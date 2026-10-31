import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../../environments/environment';
import { EffectivePermission } from '../../../../core/models/auth.model';
import { User } from '../../../../core/models/user.model';
import { SessionStore } from '../../../../core/services/session-store';
import { grantAccess } from '../../../../core/testing/access';
import { UserList } from './user-list';

const BASE = `${environment.apiUrl}/usuarios`;

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
    status: 'inactive',
  },
] as User[];

const PERMISOS: EffectivePermission[] = [
  {
    resource_id: 1,
    method: 'GET',
    path: '/api/proyectos',
    description: 'Listar proyectos',
    role_id: 2,
    role_name: 'PROMOTER',
  },
  {
    resource_id: 2,
    method: 'POST',
    path: '/api/proyectos',
    description: null,
    role_id: 2,
    role_name: 'PROMOTER',
  },
  {
    resource_id: 3,
    method: 'GET',
    path: '/api/transacciones-pago',
    description: 'Listar pagos',
    role_id: 3,
    role_name: 'CONTRIBUTOR',
  },
];

/** Todo lo que `admin` puede hacer sobre usuarios. */
const ADMIN_USUARIOS = [
  'GET /api/usuarios',
  'POST /api/usuarios',
  'PATCH /api/usuarios/:id',
  'PATCH /api/usuarios/:id/deactivate',
  'DELETE /api/usuarios/:id',
  'GET /api/usuarios/:id/permisos',
];

describe('UserList', () => {
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
    grantAccess(session, ...ADMIN_USUARIOS);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  async function abrir() {
    const fixture = TestBed.createComponent(UserList);
    http.expectOne(BASE).flush({ users: USUARIOS });
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

  it('should load the users on creation', async () => {
    const lista = (await abrir()).componentInstance;

    expect(lista.rows().length).toBe(3);
    expect(lista.activeCount()).toBe(2);
    expect(lista.loading()).toBe(false);
    expect(lista.error()).toBeNull();
  });

  it('should show the error and no rows when loading fails', async () => {
    const fixture = TestBed.createComponent(UserList);
    http.expectOne(BASE).flush({ message: 'Fallo' }, { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.rows()).toEqual([]);
    expect(fixture.componentInstance.error()).not.toBeNull();
    expect(fixture.componentInstance.loading()).toBe(false);
  });

  it('should filter by username or email without new requests', async () => {
    const lista = (await abrir()).componentInstance;

    lista.filter.set('contributor');

    expect(lista.visibleRows().map((user) => user.id)).toEqual([3]);
  });

  it('should POST a new user with password and status and then reload', async () => {
    const lista = (await abrir()).componentInstance;
    const payload = {
      username: 'maria.ortiz',
      email: 'maria.ortiz@impulsacolectivo.org',
      avatar: null,
      status: 'active' as const,
      password: 'Clave12345',
    };

    lista.openCreate();
    lista.save(payload);

    const alta = http.expectOne(BASE);
    expect(alta.request.method).toBe('POST');
    expect(alta.request.body).toEqual(payload);
    alta.flush({ user: USUARIOS[0] });

    http.expectOne(BASE).flush({ users: USUARIOS });
    expect(lista.dialogVisible()).toBe(false);
    expect(lista.saving()).toBe(false);
  });

  it('should PATCH the edited user without password or status', async () => {
    const lista = (await abrir()).componentInstance;
    const payload = {
      username: 'promoter.riohacha',
      email: 'promoter@impulsacolectivo.org',
      avatar: null,
    };

    lista.openEdit(USUARIOS[1]);
    lista.save(payload);

    const cambio = http.expectOne(`${BASE}/2`);
    expect(cambio.request.method).toBe('PATCH');
    expect(cambio.request.body).toEqual(payload);
    cambio.flush({ user: USUARIOS[1] });

    http.expectOne(BASE).flush({ users: USUARIOS });
  });

  it('should call deactivate after the confirmation is accepted', async () => {
    const lista = (await abrir()).componentInstance;
    aceptarConfirmacion();

    lista.deactivate(USUARIOS[1]);

    const baja = http.expectOne(`${BASE}/2/deactivate`);
    expect(baja.request.method).toBe('PATCH');
    baja.flush({ message: 'User deactivated' });

    http.expectOne(BASE).flush({ users: USUARIOS });
  });

  it('should call DELETE after the confirmation is accepted', async () => {
    const lista = (await abrir()).componentInstance;
    aceptarConfirmacion();

    lista.remove(USUARIOS[2]);

    const borrado = http.expectOne(`${BASE}/3`);
    expect(borrado.request.method).toBe('DELETE');
    borrado.flush({ message: 'User deleted' });

    http.expectOne(BASE).flush({ users: USUARIOS.slice(0, 2) });
  });

  it('should show an error toast and stay open when saving fails', async () => {
    const lista = (await abrir()).componentInstance;
    const mensajes = vi.spyOn(TestBed.inject(MessageService), 'add');

    lista.openCreate();
    lista.save({
      username: 'admin',
      email: 'otro@impulsacolectivo.org',
      password: 'Clave12345',
      status: 'active',
    });
    http
      .expectOne(BASE)
      .flush({ message: 'username already exists' }, { status: 409, statusText: 'Conflict' });

    expect(mensajes).toHaveBeenCalledWith(expect.objectContaining({ severity: 'error' }));
    expect(lista.saving()).toBe(false);
    expect(lista.dialogVisible()).toBe(true);
  });

  it('should recognise the logged-in user as self', async () => {
    session.setAccess({ user: USUARIOS[0], permissions: session.permissions() });
    const lista = (await abrir()).componentInstance;

    expect(lista.isSelf(USUARIOS[0])).toBe(true);
    expect(lista.isSelf(USUARIOS[1])).toBe(false);
  });

  it('should load the effective permissions and derive the roles', async () => {
    const lista = (await abrir()).componentInstance;

    lista.openAccess(USUARIOS[1]);
    expect(lista.accessVisible()).toBe(true);
    expect(lista.accessLoading()).toBe(true);

    const consulta = http.expectOne(`${BASE}/2/permisos`);
    expect(consulta.request.method).toBe('GET');
    consulta.flush({ permissions: PERMISOS });

    expect(lista.access().length).toBe(3);
    expect(lista.accessRoles()).toEqual([
      { id: 2, name: 'PROMOTER' },
      { id: 3, name: 'CONTRIBUTOR' },
    ]);
    expect(lista.accessLoading()).toBe(false);
  });

  it('should close the permissions dialog and toast when loading them fails', async () => {
    const lista = (await abrir()).componentInstance;
    const mensajes = vi.spyOn(TestBed.inject(MessageService), 'add');

    lista.openAccess(USUARIOS[1]);
    http
      .expectOne(`${BASE}/2/permisos`)
      .flush({ message: 'No encontrado' }, { status: 404, statusText: 'Not Found' });

    expect(lista.accessVisible()).toBe(false);
    expect(mensajes).toHaveBeenCalledWith(expect.objectContaining({ severity: 'error' }));
  });

  it('should hide the write buttons for a read-only role', async () => {
    grantAccess(session, 'GET /api/usuarios');

    const fixture = await abrir();
    const raiz = fixture.nativeElement as HTMLElement;
    const textos = Array.from(raiz.querySelectorAll('button')).map((b) => b.textContent ?? '');

    expect(textos.some((texto) => texto.includes('Nuevo usuario'))).toBe(false);
    expect(raiz.querySelector('button[aria-label="Editar usuario"]')).toBeNull();
    expect(raiz.querySelector('button[aria-label="Ver permisos del usuario"]')).toBeNull();
  });
});
