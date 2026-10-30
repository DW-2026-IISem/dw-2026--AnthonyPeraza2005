import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { AccessPayload, EffectivePermission, SessionTokens } from '../models/auth.model';
import { User } from '../models/user.model';
import { AuthService } from './auth';
import { SESSION_STORAGE_KEY, SessionStore } from './session-store';

const SESION = `${environment.apiUrl}/sesion`;
const PERMISOS_URL = `${environment.apiUrl}/permisos`;

const TOKENS: SessionTokens = {
  access_token: 'access-1',
  token_type: 'Bearer',
  expires_in: 3600,
  refresh_token: 'refresh-1',
  refresh_expires_in: 604799,
};

const ROTADOS: SessionTokens = {
  ...TOKENS,
  access_token: 'access-2',
  refresh_token: 'refresh-2',
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
];

const CREDENCIALES = { identifier: 'admin', password: 'Admin123!' };

describe('AuthService', () => {
  let http: HttpTestingController;
  let auth: AuthService;
  let session: SessionStore;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    http = TestBed.inject(HttpTestingController);
    auth = TestBed.inject(AuthService);
    session = TestBed.inject(SessionStore);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('should save the tokens, then load profile and permissions on login', () => {
    let resultado: AccessPayload | undefined;
    auth.login(CREDENCIALES).subscribe((acceso) => (resultado = acceso));

    const login = http.expectOne(`${SESION}/login`);
    expect(login.request.method).toBe('POST');
    expect(login.request.body).toEqual(CREDENCIALES);
    login.flush(TOKENS);

    // Los tokens ya están guardados antes de pedir perfil y permisos.
    expect(session.accessToken()).toBe('access-1');
    expect(resultado).toBeUndefined();

    http.expectOne(`${SESION}/perfil`).flush({ user: ADMIN });
    http.expectOne(PERMISOS_URL).flush({ permissions: PERMISOS });

    expect(resultado?.user.username).toBe('admin');
    expect(session.user()?.username).toBe('admin');
    expect(session.permissionCount()).toBe(1);
    expect(session.isAuthenticated()).toBe(true);
  });

  it('should clear the session when profile or permissions fail after the login', () => {
    let fallo: unknown;
    auth.login(CREDENCIALES).subscribe({ error: (error) => (fallo = error) });

    http.expectOne(`${SESION}/login`).flush(TOKENS);

    // Se contesta primero lo que sí responde y al final el error.
    http.expectOne(PERMISOS_URL).flush({ permissions: PERMISOS });
    http
      .expectOne(`${SESION}/perfil`)
      .flush({ error: 'Internal error' }, { status: 500, statusText: 'Server Error' });

    expect(fallo).toBeDefined();
    expect(session.isAuthenticated()).toBe(false);
    expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
  });

  it('should not save anything when the credentials are wrong', () => {
    let fallo: unknown;
    auth
      .login({ identifier: 'admin', password: 'incorrecta' })
      .subscribe({ error: (error) => (fallo = error) });

    http
      .expectOne(`${SESION}/login`)
      .flush({ error: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });

    expect(fallo).toBeDefined();
    expect(session.isAuthenticated()).toBe(false);
    expect(session.accessToken()).toBeNull();
  });

  it('should reload profile and permissions with me()', () => {
    session.setTokens(TOKENS);

    auth.me().subscribe();

    http.expectOne(`${SESION}/perfil`).flush({ user: ADMIN });
    http.expectOne(PERMISOS_URL).flush({ permissions: PERMISOS });

    expect(session.user()?.email).toBe('admin@impulsacolectivo.local');
    expect(session.permissionCount()).toBe(1);
  });

  it('should POST the refresh token and keep the rotated pair', () => {
    session.setTokens(TOKENS);

    auth.refresh().subscribe();

    const peticion = http.expectOne(`${SESION}/refresh`);
    expect(peticion.request.method).toBe('POST');
    expect(peticion.request.body).toEqual({ refresh_token: 'refresh-1' });
    peticion.flush(ROTADOS);

    expect(session.accessToken()).toBe('access-2');
    expect(session.refreshToken()).toBe('refresh-2');
  });

  it('should fail without calling the backend when there is no refresh token', () => {
    let fallo: unknown;
    auth.refresh().subscribe({ error: (error) => (fallo = error) });

    http.expectNone(`${SESION}/refresh`);
    expect(fallo).toBeInstanceOf(Error);
  });

  it('should POST the refresh token on logout and clear the session', () => {
    session.setTokens(TOKENS);
    session.setAccess({ user: ADMIN, permissions: PERMISOS });

    auth.logout().subscribe();

    const peticion = http.expectOne(`${SESION}/logout`);
    expect(peticion.request.method).toBe('POST');
    expect(peticion.request.body).toEqual({ refresh_token: 'refresh-1' });
    peticion.flush({ message: 'Logged out' });

    expect(session.isAuthenticated()).toBe(false);
    expect(session.user()).toBeNull();
    expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
  });

  it('should clear the session on logout even if the backend fails', () => {
    session.setTokens(TOKENS);

    let terminado = false;
    auth.logout().subscribe({ complete: () => (terminado = true) });

    http
      .expectOne(`${SESION}/logout`)
      .flush({ error: 'Down' }, { status: 500, statusText: 'Server Error' });

    expect(terminado).toBe(true);
    expect(session.isAuthenticated()).toBe(false);
  });
});
