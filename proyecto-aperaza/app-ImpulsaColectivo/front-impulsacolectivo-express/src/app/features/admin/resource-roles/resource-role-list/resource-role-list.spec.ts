import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../../environments/environment';
import { ResourceRole } from '../../../../core/models/resource-role.model';
import { Resource } from '../../../../core/models/resource.model';
import { Role } from '../../../../core/models/role.model';
import { SessionStore } from '../../../../core/services/session-store';
import { grantAccess } from '../../../../core/testing/access';
import { ResourceRoleList } from './resource-role-list';

const BASE = `${environment.apiUrl}/concesiones-rol`;
const ROLES_URL = `${environment.apiUrl}/roles`;
const RECURSOS_URL = `${environment.apiUrl}/recursos`;

const ROLES = [
  { id: 1, name: 'ADMIN', description: null, status: 'active' },
  { id: 2, name: 'PROMOTER', description: null, status: 'active' },
] as Role[];

const RECURSOS = [
  {
    id: 1,
    path: '/api/proyectos',
    method: 'GET',
    description: 'Listar proyectos',
    status: 'active',
  },
  { id: 2, path: '/api/proyectos', method: 'POST', description: null, status: 'active' },
  {
    id: 3,
    path: '/api/proyectos/:id',
    method: 'DELETE',
    description: 'Eliminar proyectos',
    status: 'active',
  },
] as Resource[];

const CONCESIONES = [
  {
    id: 1,
    role_id: 1,
    resource_id: 1,
    status: 'active',
    role: { id: 1, name: 'ADMIN' },
    resource: { id: 1, method: 'GET', path: '/api/proyectos', description: 'Listar proyectos' },
  },
  {
    id: 2,
    role_id: 2,
    resource_id: 1,
    status: 'active',
    role: { id: 2, name: 'PROMOTER' },
    resource: { id: 1, method: 'GET', path: '/api/proyectos', description: 'Listar proyectos' },
  },
  {
    id: 3,
    role_id: 2,
    resource_id: 2,
    status: 'inactive',
    role: { id: 2, name: 'PROMOTER' },
    resource: { id: 2, method: 'POST', path: '/api/proyectos', description: null },
  },
] as ResourceRole[];

/** Todo lo que `admin` puede hacer sobre concesiones. */
const ADMIN_CONCESIONES = [
  'GET /api/concesiones-rol',
  'POST /api/concesiones-rol',
  'PATCH /api/concesiones-rol/:id/deactivate',
  'PATCH /api/concesiones-rol/:id/reactivate',
  'GET /api/roles',
  'GET /api/recursos',
];

describe('ResourceRoleList', () => {
  let http: HttpTestingController;
  let session: SessionStore;
  let confirmation: ConfirmationService;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    session = TestBed.inject(SessionStore);
    confirmation = TestBed.inject(ConfirmationService);
    grantAccess(session, ...ADMIN_CONCESIONES);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  /** Responde las tres peticiones en paralelo que hace `load()`. */
  function responderCarga() {
    http.expectOne(BASE).flush({ grants: CONCESIONES });
    http.expectOne(ROLES_URL).flush({ roles: ROLES });
    http.expectOne(RECURSOS_URL).flush({ resources: RECURSOS });
  }

  async function abrir() {
    const fixture = TestBed.createComponent(ResourceRoleList);
    responderCarga();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  function aceptarConfirmacion() {
    vi.spyOn(confirmation, 'confirm').mockImplementation((config) => {
      config.accept?.();
      return confirmation;
    });
  }

  it('should load the grants, roles and resources in parallel', async () => {
    const lista = (await abrir()).componentInstance;

    expect(lista.rows().length).toBe(3);
    expect(lista.roles().length).toBe(2);
    expect(lista.resources().length).toBe(3);
    expect(lista.activeCount()).toBe(2);
    expect(lista.loading()).toBe(false);
    expect(lista.error()).toBeNull();
  });

  it('should show the error and no rows when loading fails', async () => {
    const fixture = TestBed.createComponent(ResourceRoleList);
    http.expectOne(ROLES_URL).flush({ roles: ROLES });
    http.expectOne(RECURSOS_URL).flush({ resources: RECURSOS });
    http.expectOne(BASE).flush({ message: 'Fallo' }, { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.rows()).toEqual([]);
    expect(fixture.componentInstance.error()).not.toBeNull();
    expect(fixture.componentInstance.loading()).toBe(false);
  });

  it('should combine the text filter with the role filter', async () => {
    const lista = (await abrir()).componentInstance;

    lista.roleFilter.set(2);
    expect(lista.visibleRows().map((grant) => grant.id)).toEqual([2, 3]);

    lista.filter.set('POST');
    expect(lista.visibleRows().map((grant) => grant.id)).toEqual([3]);

    lista.roleFilter.set(null);
    lista.filter.set('admin');
    expect(lista.visibleRows().map((grant) => grant.id)).toEqual([1]);
  });

  it('should POST the grant with role_id and resource_id and then reload', async () => {
    const lista = (await abrir()).componentInstance;

    lista.openGrant();
    lista.selectedRole.set(ROLES[1]);
    lista.selectedResource.set(RECURSOS[2]);
    lista.grant();

    const alta = http.expectOne(BASE);
    expect(alta.request.method).toBe('POST');
    expect(alta.request.body).toEqual({ role_id: 2, resource_id: 3 });
    alta.flush({ message: 'Grant created', grant: CONCESIONES[1] });

    responderCarga();
    expect(lista.dialogVisible()).toBe(false);
    expect(lista.saving()).toBe(false);
  });

  it('should block a duplicate active grant but allow an inactive one', async () => {
    const lista = (await abrir()).componentInstance;

    lista.selectedRole.set(ROLES[1]);
    lista.selectedResource.set(RECURSOS[0]);
    expect(lista.duplicate()).toBe(true);
    lista.grant();
    http.expectNone(BASE);

    // El par (PROMOTER, POST /api/proyectos) está inactivo: el backend lo reactiva.
    lista.selectedResource.set(RECURSOS[1]);
    expect(lista.duplicate()).toBe(false);
  });

  it('should call deactivate after the confirmation is accepted', async () => {
    const lista = (await abrir()).componentInstance;
    aceptarConfirmacion();

    lista.revoke(CONCESIONES[1]);

    const baja = http.expectOne(`${BASE}/2/deactivate`);
    expect(baja.request.method).toBe('PATCH');
    baja.flush({ message: 'Grant deactivated' });

    responderCarga();
  });

  it('should warn when revoking a permission of a role the user has', async () => {
    const lista = (await abrir()).componentInstance;
    const confirmar = vi.spyOn(confirmation, 'confirm').mockImplementation(() => confirmation);

    // `grantAccess` deja al usuario de prueba con el rol ADMIN.
    lista.revoke(CONCESIONES[0]);
    lista.revoke(CONCESIONES[1]);

    expect(confirmar.mock.calls[0][0].message).toContain('perder acceso');
    expect(confirmar.mock.calls[1][0].message).not.toContain('perder acceso');
  });

  it('should PATCH reactivate and reload', async () => {
    const lista = (await abrir()).componentInstance;

    lista.reactivate(CONCESIONES[2]);

    const alta = http.expectOne(`${BASE}/3/reactivate`);
    expect(alta.request.method).toBe('PATCH');
    alta.flush({ message: 'Grant reactivated' });

    responderCarga();
  });

  it('should show an error toast and stay open when granting fails', async () => {
    const lista = (await abrir()).componentInstance;
    const mensajes = vi.spyOn(TestBed.inject(MessageService), 'add');

    lista.openGrant();
    lista.selectedRole.set(ROLES[1]);
    lista.selectedResource.set(RECURSOS[2]);
    lista.grant();
    http
      .expectOne(BASE)
      .flush({ message: 'Resource is inactive' }, { status: 409, statusText: 'Conflict' });

    expect(mensajes).toHaveBeenCalledWith(expect.objectContaining({ severity: 'error' }));
    expect(lista.saving()).toBe(false);
    expect(lista.dialogVisible()).toBe(true);
  });

  it('should hide the write buttons for a read-only role', async () => {
    grantAccess(session, 'GET /api/concesiones-rol', 'GET /api/roles', 'GET /api/recursos');

    const raiz = (await abrir()).nativeElement as HTMLElement;
    const textos = Array.from(raiz.querySelectorAll('button')).map((b) => b.textContent ?? '');

    expect(textos.some((texto) => texto.includes('Conceder permiso'))).toBe(false);
    expect(raiz.querySelector('button[aria-label="Revocar permiso"]')).toBeNull();
    expect(raiz.querySelector('button[aria-label="Reactivar permiso"]')).toBeNull();
  });

  it('should not ask for roles or resources when the role cannot read them', async () => {
    grantAccess(session, 'GET /api/concesiones-rol');

    const fixture = TestBed.createComponent(ResourceRoleList);
    http.expectOne(BASE).flush({ grants: CONCESIONES });
    http.expectNone(ROLES_URL);
    http.expectNone(RECURSOS_URL);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.rows().length).toBe(3);
    expect(fixture.componentInstance.error()).toBeNull();
  });

  it('should recognise the grants of a role the logged-in user has', async () => {
    const lista = (await abrir()).componentInstance;

    expect(lista.isOwnRole(CONCESIONES[0])).toBe(true);
    expect(lista.isOwnRole(CONCESIONES[1])).toBe(false);
  });
});
