import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { environment } from '../../../environments/environment';
import { SessionTokens } from '../models/auth.model';
import { SESSION_STORAGE_KEY, SessionStore } from '../services/session-store';
import { authInterceptor } from './auth-interceptor';

const METAS = `${environment.apiUrl}/metas`;
const SESION = `${environment.apiUrl}/sesion`;

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

describe('authInterceptor', () => {
  let http: HttpTestingController;
  let client: HttpClient;
  let session: SessionStore;
  let router: Router;
  let navegar: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });

    http = TestBed.inject(HttpTestingController);
    client = TestBed.inject(HttpClient);
    session = TestBed.inject(SessionStore);
    router = TestBed.inject(Router);

    // No se navega de verdad: solo se comprueba a dónde se intentó ir.
    navegar = vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('should add the Bearer header when there is an access token', () => {
    session.setTokens(TOKENS);

    client.get(METAS).subscribe();

    const peticion = http.expectOne(METAS);
    expect(peticion.request.headers.get('Authorization')).toBe('Bearer access-1');
    peticion.flush({ goals: [] });
  });

  it('should send no Authorization header without a session', () => {
    client.get(METAS).subscribe();

    const peticion = http.expectOne(METAS);
    expect(peticion.request.headers.has('Authorization')).toBe(false);
    peticion.flush({ goals: [] });
  });

  it('should not add the Bearer header to login, refresh or logout', () => {
    session.setTokens(TOKENS);

    client.post(`${SESION}/login`, {}).subscribe();
    client.post(`${SESION}/refresh`, {}).subscribe();
    client.post(`${SESION}/logout`, {}).subscribe();

    for (const ruta of ['login', 'refresh', 'logout']) {
      const peticion = http.expectOne(`${SESION}/${ruta}`);
      expect(peticion.request.headers.has('Authorization')).toBe(false);
      peticion.flush({});
    }
  });

  it('should refresh once on a 401 and retry the request with the new token', () => {
    session.setTokens(TOKENS);
    let respuesta: unknown;

    client.get(METAS).subscribe((datos) => (respuesta = datos));

    http.expectOne(METAS).flush({ error: 'Expired' }, { status: 401, statusText: 'Unauthorized' });

    const refresh = http.expectOne(`${SESION}/refresh`);
    expect(refresh.request.body).toEqual({ refresh_token: 'refresh-1' });
    refresh.flush(ROTADOS);

    const reintento = http.expectOne(METAS);
    expect(reintento.request.headers.get('Authorization')).toBe('Bearer access-2');
    reintento.flush({ goals: [] });

    expect(respuesta).toEqual({ goals: [] });
    expect(session.refreshToken()).toBe('refresh-2');
  });

  it('should share a single refresh between simultaneous 401 responses', () => {
    session.setTokens(TOKENS);
    const respuestas: unknown[] = [];

    client.get(METAS).subscribe((datos) => respuestas.push(datos));
    client.get(METAS).subscribe((datos) => respuestas.push(datos));

    const iniciales = http.match(METAS);
    expect(iniciales.length).toBe(2);
    for (const peticion of iniciales) {
      peticion.flush({ error: 'Expired' }, { status: 401, statusText: 'Unauthorized' });
    }

    // Una sola renovación para las dos peticiones.
    http.expectOne(`${SESION}/refresh`).flush(ROTADOS);

    const reintentos = http.match(METAS);
    expect(reintentos.length).toBe(2);
    for (const peticion of reintentos) {
      expect(peticion.request.headers.get('Authorization')).toBe('Bearer access-2');
      peticion.flush({ goals: [] });
    }

    expect(respuestas.length).toBe(2);
  });

  it('should clear the session and go to the login when the refresh fails', () => {
    session.setTokens(TOKENS);
    let fallo: unknown;

    client.get(METAS).subscribe({ error: (error) => (fallo = error) });

    http.expectOne(METAS).flush({ error: 'Expired' }, { status: 401, statusText: 'Unauthorized' });
    http
      .expectOne(`${SESION}/refresh`)
      .flush({ error: 'Token reuse detected' }, { status: 401, statusText: 'Unauthorized' });

    expect(fallo).toBeDefined();
    expect(session.isAuthenticated()).toBe(false);
    expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
    expect(navegar).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/' } });
  });

  it('should go to the login without calling refresh when there is no refresh token', () => {
    session.setTokens({ ...TOKENS, refresh_token: '' });
    let fallo: unknown;

    client.get(METAS).subscribe({ error: (error) => (fallo = error) });

    http
      .expectOne(METAS)
      .flush({ error: 'Missing Bearer token' }, { status: 401, statusText: 'Unauthorized' });

    http.expectNone(`${SESION}/refresh`);
    expect(fallo).toBeDefined();
    expect(session.isAuthenticated()).toBe(false);
    expect(navegar).toHaveBeenCalled();
  });

  it('should pass through errors that are not 401 without refreshing', () => {
    session.setTokens(TOKENS);
    let estado = 0;

    client.get(METAS).subscribe({ error: (error) => (estado = error.status) });

    http.expectOne(METAS).flush({ error: 'Down' }, { status: 500, statusText: 'Server Error' });

    http.expectNone(`${SESION}/refresh`);
    expect(estado).toBe(500);
    expect(session.isAuthenticated()).toBe(true);
  });

  it('should not try to refresh when the login itself answers 401', () => {
    let estado = 0;

    client
      .post(`${SESION}/login`, { identifier: 'admin', password: 'mala' })
      .subscribe({ error: (error) => (estado = error.status) });

    http
      .expectOne(`${SESION}/login`)
      .flush({ error: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });

    http.expectNone(`${SESION}/refresh`);
    expect(estado).toBe(401);
    expect(navegar).not.toHaveBeenCalled();
  });
});
