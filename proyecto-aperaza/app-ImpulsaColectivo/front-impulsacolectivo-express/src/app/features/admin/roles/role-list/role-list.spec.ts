import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../../environments/environment';
import { Role } from '../../../../core/models/role.model';
import { SessionStore } from '../../../../core/services/session-store';
import { grantAccess } from '../../../../core/testing/access';
import { RoleList } from './role-list';

const BASE = `${environment.apiUrl}/roles`;

const ROLES = [
  { id: 1, name: 'ADMIN', description: 'Administra todo el sistema', status: 'active' },
  { id: 2, name: 'PROMOTER', description: 'Gestiona sus campañas', status: 'active' },
  { id: 3, name: 'CONTRIBUTOR', description: 'Aporta a los proyectos', status: 'inactive' },
] as Role[];

/** Todo lo que `admin` puede hacer sobre roles. */
const ADMIN_ROLES = [
  'GET /api/roles',
  'POST /api/roles',
  'PATCH /api/roles/:id',
  'PATCH /api/roles/:id/deactivate',
  'DELETE /api/roles/:id',
];

describe('RoleList', () => {
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
    grantAccess(session, ...ADMIN_ROLES);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  async function abrir() {
    const fixture = TestBed.createComponent(RoleList);
    http.expectOne(BASE).flush({ roles: ROLES });
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

  it('should load the roles on creation', async () => {
    const lista = (await abrir()).componentInstance;

    expect(lista.rows().length).toBe(3);
    expect(lista.activeCount()).toBe(2);
    expect(lista.loading()).toBe(false);
    expect(lista.error()).toBeNull();
  });

  it('should show the error and no rows when loading fails', async () => {
    const fixture = TestBed.createComponent(RoleList);
    http.expectOne(BASE).flush({ message: 'Fallo' }, { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.rows()).toEqual([]);
    expect(fixture.componentInstance.error()).not.toBeNull();
    expect(fixture.componentInstance.loading()).toBe(false);
  });

  it('should filter by name or description without new requests', async () => {
    const lista = (await abrir()).componentInstance;

    lista.filter.set('campañas');

    expect(lista.visibleRows().map((role) => role.id)).toEqual([2]);
  });

  it('should POST a new role with status and then reload', async () => {
    const lista = (await abrir()).componentInstance;
    const payload = {
      name: 'COORDINADOR',
      description: 'Acompaña a los promotores',
      status: 'active' as const,
    };

    lista.openCreate();
    lista.save(payload);

    const alta = http.expectOne(BASE);
    expect(alta.request.method).toBe('POST');
    expect(alta.request.body).toEqual(payload);
    alta.flush({ role: ROLES[0] });

    http.expectOne(BASE).flush({ roles: ROLES });
    expect(lista.dialogVisible()).toBe(false);
    expect(lista.saving()).toBe(false);
  });

  it('should PATCH the edited role without status', async () => {
    const lista = (await abrir()).componentInstance;
    const payload = { name: 'PROMOTER', description: 'Gestiona sus campañas y metas' };

    lista.openEdit(ROLES[1]);
    lista.save(payload);

    const cambio = http.expectOne(`${BASE}/2`);
    expect(cambio.request.method).toBe('PATCH');
    expect(cambio.request.body).toEqual(payload);
    cambio.flush({ role: ROLES[1] });

    http.expectOne(BASE).flush({ roles: ROLES });
  });

  it('should call deactivate after the confirmation is accepted', async () => {
    const lista = (await abrir()).componentInstance;
    aceptarConfirmacion();

    lista.deactivate(ROLES[1]);

    const baja = http.expectOne(`${BASE}/2/deactivate`);
    expect(baja.request.method).toBe('PATCH');
    baja.flush({ message: 'Role deactivated' });

    http.expectOne(BASE).flush({ roles: ROLES });
  });

  it('should call DELETE after the confirmation is accepted', async () => {
    const lista = (await abrir()).componentInstance;
    aceptarConfirmacion();

    lista.remove(ROLES[2]);

    const borrado = http.expectOne(`${BASE}/3`);
    expect(borrado.request.method).toBe('DELETE');
    borrado.flush({ message: 'Role deleted' });

    http.expectOne(BASE).flush({ roles: ROLES.slice(0, 2) });
  });

  it('should show an error toast and stay open when saving fails', async () => {
    const lista = (await abrir()).componentInstance;
    const mensajes = vi.spyOn(TestBed.inject(MessageService), 'add');

    lista.openCreate();
    lista.save({ name: 'ADMIN', description: null, status: 'active' });
    http
      .expectOne(BASE)
      .flush({ message: 'role already exists' }, { status: 409, statusText: 'Conflict' });

    expect(mensajes).toHaveBeenCalledWith(expect.objectContaining({ severity: 'error' }));
    expect(lista.saving()).toBe(false);
    expect(lista.dialogVisible()).toBe(true);
  });

  it('should recognise the roles of the logged-in user as its own', async () => {
    const lista = (await abrir()).componentInstance;

    // `grantAccess` deja al usuario de prueba con el rol ADMIN.
    expect(lista.isOwnRole(ROLES[0])).toBe(true);
    expect(lista.isOwnRole(ROLES[1])).toBe(false);
  });

  it('should hide the write buttons for a read-only role', async () => {
    grantAccess(session, 'GET /api/roles');

    const fixture = await abrir();
    const raiz = fixture.nativeElement as HTMLElement;
    const textos = Array.from(raiz.querySelectorAll('button')).map((b) => b.textContent ?? '');

    expect(textos.some((texto) => texto.includes('Nuevo rol'))).toBe(false);
    expect(raiz.querySelector('button[aria-label="Editar rol"]')).toBeNull();
    expect(raiz.querySelector('button[aria-label="Eliminar rol"]')).toBeNull();
  });
});
