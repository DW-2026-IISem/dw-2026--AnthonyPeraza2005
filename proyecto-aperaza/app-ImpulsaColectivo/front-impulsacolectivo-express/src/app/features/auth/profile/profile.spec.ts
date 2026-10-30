import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { EffectivePermission, SessionTokens } from '../../../core/models/auth.model';
import { User } from '../../../core/models/user.model';
import { SessionStore } from '../../../core/services/session-store';
import { Profile } from './profile';

const SESION = `${environment.apiUrl}/sesion`;
const PERMISOS_URL = `${environment.apiUrl}/permisos`;

const TOKENS: SessionTokens = {
  access_token: 'access-1',
  token_type: 'Bearer',
  expires_in: 3600,
  refresh_token: 'refresh-1',
  refresh_expires_in: 604799,
};

const ADMIN = {
  id: 1,
  username: 'admin',
  email: 'admin@impulsacolectivo.local',
  avatar: null,
  status: 'active',
} as User;

const PERMISOS: EffectivePermission[] = [
  {
    resource_id: 1,
    method: 'GET',
    path: '/api/metas',
    description: 'Listar metas',
    role_id: 1,
    role_name: 'ADMIN',
  },
  {
    resource_id: 2,
    method: 'POST',
    path: '/api/recompensas',
    description: 'Crear recompensa',
    role_id: 1,
    role_name: 'ADMIN',
  },
];

describe('Profile', () => {
  let http: HttpTestingController;
  let session: SessionStore;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        MessageService,
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    session = TestBed.inject(SessionStore);
    session.setTokens(TOKENS);
    session.setAccess({ user: ADMIN, permissions: PERMISOS });
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  function crear() {
    const fixture = TestBed.createComponent(Profile);
    fixture.detectChanges();
    return { fixture, perfil: fixture.componentInstance, compilado: fixture.nativeElement as HTMLElement };
  }

  it('should show the account, the roles and the permission count', () => {
    const { compilado } = crear();

    const texto = compilado.textContent ?? '';
    expect(texto).toContain('admin');
    expect(texto).toContain('admin@impulsacolectivo.local');
    expect(texto).toContain('ADMIN');
    expect(texto).toContain('2 permisos');
    expect(texto).toContain('/api/recompensas');
  });

  it('should filter the permissions locally', () => {
    const { perfil } = crear();

    perfil.filter.set('recompensas');
    expect(perfil.visibleRows().map((p) => p.resource_id)).toEqual([2]);

    perfil.filter.set('listar');
    expect(perfil.visibleRows().map((p) => p.resource_id)).toEqual([1]);
  });

  it('should reload profile and permissions and warn the user', () => {
    const { perfil } = crear();
    const aviso = vi.spyOn(TestBed.inject(MessageService), 'add');

    perfil.refresh();
    expect(perfil.refreshing()).toBe(true);

    http.expectOne(`${SESION}/perfil`).flush({ user: ADMIN });
    http.expectOne(PERMISOS_URL).flush({
      permissions: [
        ...PERMISOS,
        {
          resource_id: 3,
          method: 'DELETE',
          path: '/api/metas/:id',
          description: 'Eliminar meta',
          role_id: 1,
          role_name: 'ADMIN',
        },
      ],
    });

    expect(perfil.refreshing()).toBe(false);
    expect(session.permissionCount()).toBe(3);
    expect(aviso).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'success', summary: 'Permisos actualizados' }),
    );
  });

  it('should close the session in the backend, clear it and go to the login', () => {
    const { perfil } = crear();
    const navegar = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    perfil.logout();

    const peticion = http.expectOne(`${SESION}/logout`);
    expect(peticion.request.body).toEqual({ refresh_token: 'refresh-1' });
    peticion.flush({ message: 'Logged out' });

    expect(session.isAuthenticated()).toBe(false);
    expect(navegar).toHaveBeenCalledWith(['/login']);
  });
});
