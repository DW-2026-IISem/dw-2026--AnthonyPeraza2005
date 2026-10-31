import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../../environments/environment';
import { RoleUser } from '../../../../core/models/role-user.model';
import { Role } from '../../../../core/models/role.model';
import { User } from '../../../../core/models/user.model';
import { SessionStore } from '../../../../core/services/session-store';
import { grantAccess } from '../../../../core/testing/access';
import { RoleUserList } from './role-user-list';

const BASE = `${environment.apiUrl}/asignaciones-rol`;
const USUARIOS_URL = `${environment.apiUrl}/usuarios`;
const ROLES_URL = `${environment.apiUrl}/roles`;

const USUARIOS = [
  { id: 1, username: 'admin', email: 'admin@impulsacolectivo.org', avatar: null, status: 'active' },
  {
    id: 2,
    username: 'promoter',
    email: 'promoter@impulsacolectivo.org',
    avatar: null,
    status: 'active',
  },
  {
    id: 3,
    username: 'contributor',
    email: 'contributor@impulsacolectivo.org',
    avatar: null,
    status: 'active',
  },
] as User[];

const ROLES = [
  { id: 1, name: 'ADMIN', description: null, status: 'active' },
  { id: 2, name: 'PROMOTER', description: null, status: 'active' },
  { id: 3, name: 'CONTRIBUTOR', description: null, status: 'active' },
] as Role[];

const ASIGNACIONES = [
  {
    id: 1,
    user_id: 1,
    role_id: 1,
    status: 'active',
    user: { id: 1, username: 'admin', email: 'admin@impulsacolectivo.org' },
    role: { id: 1, name: 'ADMIN' },
  },
  {
    id: 2,
    user_id: 2,
    role_id: 2,
    status: 'active',
    user: { id: 2, username: 'promoter', email: 'promoter@impulsacolectivo.org' },
    role: { id: 2, name: 'PROMOTER' },
  },
  {
    id: 3,
    user_id: 3,
    role_id: 3,
    status: 'inactive',
    user: { id: 3, username: 'contributor', email: 'contributor@impulsacolectivo.org' },
    role: { id: 3, name: 'CONTRIBUTOR' },
  },
] as RoleUser[];

/** Todo lo que `admin` puede hacer sobre asignaciones. */
const ADMIN_ASIGNACIONES = [
  'GET /api/asignaciones-rol',
  'POST /api/asignaciones-rol',
  'PATCH /api/asignaciones-rol/:id/deactivate',
  'PATCH /api/asignaciones-rol/:id/reactivate',
  'GET /api/usuarios',
  'GET /api/roles',
];

describe('RoleUserList', () => {
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
    grantAccess(session, ...ADMIN_ASIGNACIONES);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  /** Responde las tres peticiones en paralelo que hace `load()`. */
  function responderCarga() {
    http.expectOne(BASE).flush({ assignments: ASIGNACIONES });
    http.expectOne(USUARIOS_URL).flush({ users: USUARIOS });
    http.expectOne(ROLES_URL).flush({ roles: ROLES });
  }

  async function abrir() {
    const fixture = TestBed.createComponent(RoleUserList);
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

  it('should load the assignments, users and roles in parallel', async () => {
    const lista = (await abrir()).componentInstance;

    expect(lista.rows().length).toBe(3);
    expect(lista.users().length).toBe(3);
    expect(lista.roles().length).toBe(3);
    expect(lista.activeCount()).toBe(2);
    expect(lista.loading()).toBe(false);
    expect(lista.error()).toBeNull();
  });

  it('should show the error and no rows when loading fails', async () => {
    const fixture = TestBed.createComponent(RoleUserList);
    http.expectOne(USUARIOS_URL).flush({ users: USUARIOS });
    http.expectOne(ROLES_URL).flush({ roles: ROLES });
    http.expectOne(BASE).flush({ message: 'Fallo' }, { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.rows()).toEqual([]);
    expect(fixture.componentInstance.error()).not.toBeNull();
    expect(fixture.componentInstance.loading()).toBe(false);
  });

  it('should filter by user and by role without new requests', async () => {
    const lista = (await abrir()).componentInstance;

    lista.userFilter.set(2);
    expect(lista.visibleRows().map((row) => row.id)).toEqual([2]);

    lista.userFilter.set(null);
    lista.roleFilter.set(3);
    expect(lista.visibleRows().map((row) => row.id)).toEqual([3]);

    lista.userFilter.set(1);
    expect(lista.visibleRows()).toEqual([]);
  });

  it('should POST the assignment and then reload', async () => {
    const lista = (await abrir()).componentInstance;

    lista.openAssign();
    lista.selectedUser.set(USUARIOS[2]);
    lista.selectedRole.set(ROLES[1]);
    lista.assign();

    const alta = http.expectOne(BASE);
    expect(alta.request.method).toBe('POST');
    expect(alta.request.body).toEqual({ user_id: 3, role_id: 2 });
    alta.flush({ assignment: ASIGNACIONES[1] });

    responderCarga();
    expect(lista.dialogVisible()).toBe(false);
    expect(lista.saving()).toBe(false);
  });

  it('should block a duplicate active assignment but allow an inactive one', async () => {
    const lista = (await abrir()).componentInstance;

    lista.selectedUser.set(USUARIOS[1]);
    lista.selectedRole.set(ROLES[1]);
    expect(lista.duplicate()).toBe(true);
    lista.assign();
    http.expectNone(BASE);

    // El par (contributor, CONTRIBUTOR) está inactivo: el backend lo reactiva.
    lista.selectedUser.set(USUARIOS[2]);
    lista.selectedRole.set(ROLES[2]);
    expect(lista.duplicate()).toBe(false);
  });

  it('should call deactivate after the confirmation is accepted', async () => {
    const lista = (await abrir()).componentInstance;
    aceptarConfirmacion();

    lista.withdraw(ASIGNACIONES[1]);

    const baja = http.expectOne(`${BASE}/2/deactivate`);
    expect(baja.request.method).toBe('PATCH');
    baja.flush({ message: 'Assignment deactivated' });

    responderCarga();
  });

  it('should warn about the last administrator when withdrawing ADMIN', async () => {
    const lista = (await abrir()).componentInstance;
    const confirmar = vi.spyOn(confirmation, 'confirm').mockImplementation(() => confirmation);

    lista.withdraw(ASIGNACIONES[0]);
    lista.withdraw(ASIGNACIONES[1]);

    expect(confirmar.mock.calls[0][0].message).toContain('otro administrador');
    expect(confirmar.mock.calls[1][0].message).not.toContain('otro administrador');
  });

  it('should PATCH reactivate and reload', async () => {
    const lista = (await abrir()).componentInstance;

    lista.reactivate(ASIGNACIONES[2]);

    const alta = http.expectOne(`${BASE}/3/reactivate`);
    expect(alta.request.method).toBe('PATCH');
    alta.flush({ message: 'Assignment reactivated' });

    responderCarga();
  });

  it('should show an error toast and stay open when assigning fails', async () => {
    const lista = (await abrir()).componentInstance;
    const mensajes = vi.spyOn(TestBed.inject(MessageService), 'add');

    lista.openAssign();
    lista.selectedUser.set(USUARIOS[2]);
    lista.selectedRole.set(ROLES[1]);
    lista.assign();
    http
      .expectOne(BASE)
      .flush({ message: 'Role is inactive' }, { status: 409, statusText: 'Conflict' });

    expect(mensajes).toHaveBeenCalledWith(expect.objectContaining({ severity: 'error' }));
    expect(lista.saving()).toBe(false);
    expect(lista.dialogVisible()).toBe(true);
  });

  it('should recognise the own assignments of the logged-in user', async () => {
    session.setAccess({ user: USUARIOS[0], permissions: session.permissions() });
    const lista = (await abrir()).componentInstance;

    expect(lista.isSelf(ASIGNACIONES[0])).toBe(true);
    expect(lista.isSelf(ASIGNACIONES[1])).toBe(false);
  });

  it('should offer Retirar for active rows and Reactivar for inactive ones', async () => {
    const raiz = (await abrir()).nativeElement as HTMLElement;

    expect(raiz.querySelectorAll('button[aria-label="Retirar rol"]').length).toBe(2);
    expect(raiz.querySelectorAll('button[aria-label="Reactivar asignación"]').length).toBe(1);
  });

  it('should hide the write buttons for a read-only role', async () => {
    grantAccess(session, 'GET /api/asignaciones-rol', 'GET /api/usuarios', 'GET /api/roles');

    const raiz = (await abrir()).nativeElement as HTMLElement;
    const textos = Array.from(raiz.querySelectorAll('button')).map((b) => b.textContent ?? '');

    expect(textos.some((texto) => texto.includes('Asignar rol'))).toBe(false);
    expect(raiz.querySelector('button[aria-label="Retirar rol"]')).toBeNull();
    expect(raiz.querySelector('button[aria-label="Reactivar asignación"]')).toBeNull();
  });

  it('should not ask for users or roles when the role cannot read them', async () => {
    grantAccess(session, 'GET /api/asignaciones-rol');

    const fixture = TestBed.createComponent(RoleUserList);
    http.expectOne(BASE).flush({ assignments: ASIGNACIONES });
    http.expectNone(USUARIOS_URL);
    http.expectNone(ROLES_URL);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.rows().length).toBe(3);
    expect(fixture.componentInstance.error()).toBeNull();
  });
});
