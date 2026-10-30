import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { EffectivePermission, SessionTokens } from '../../../core/models/auth.model';
import { User } from '../../../core/models/user.model';
import { Login } from './login';

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
];

describe('Login', () => {
  let http: HttpTestingController;

  beforeEach(() => localStorage.clear());

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  /** Monta el login como si la URL llevara (o no) un `returnUrl`. */
  async function crear(returnUrl: string | null) {
    TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParamMap: convertToParamMap(returnUrl ? { returnUrl } : {}) },
          },
        },
      ],
    });
    await TestBed.compileComponents();

    http = TestBed.inject(HttpTestingController);
    const navegar = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);

    const fixture = TestBed.createComponent(Login);
    fixture.detectChanges();

    return { fixture, login: fixture.componentInstance, navegar };
  }

  /** Contesta el login y, después, el perfil y los permisos. */
  function completarLogin() {
    http.expectOne(`${SESION}/login`).flush(TOKENS);
    http.expectOne(`${SESION}/perfil`).flush({ user: ADMIN });
    http.expectOne(PERMISOS_URL).flush({ permissions: PERMISOS });
  }

  it('should not call the backend and should mark the fields when the form is empty', async () => {
    const { login } = await crear(null);

    login.submit();

    http.expectNone(`${SESION}/login`);
    expect(login.form.controls.identifier.touched).toBe(true);
    expect(login.form.controls.password.touched).toBe(true);
  });

  it('should log in and go back to the requested screen', async () => {
    const { login, navegar } = await crear('/metas');

    login.form.setValue({ identifier: '  admin  ', password: 'Admin123!' });
    login.submit();

    const peticion = http.expectOne(`${SESION}/login`);
    expect(peticion.request.body).toEqual({ identifier: 'admin', password: 'Admin123!' });
    expect(login.loading()).toBe(true);

    peticion.flush(TOKENS);
    http.expectOne(`${SESION}/perfil`).flush({ user: ADMIN });
    http.expectOne(PERMISOS_URL).flush({ permissions: PERMISOS });

    expect(login.loading()).toBe(false);
    expect(navegar).toHaveBeenCalledWith('/metas');
  });

  it('should go to the dashboard when there is no returnUrl', async () => {
    const { login, navegar } = await crear(null);

    login.form.setValue({ identifier: 'admin', password: 'Admin123!' });
    login.submit();
    completarLogin();

    expect(navegar).toHaveBeenCalledWith('/dashboard');
  });

  it('should ignore a returnUrl that points to another site', async () => {
    const { login, navegar } = await crear('https://sitio-malo.com/robo');

    login.form.setValue({ identifier: 'admin', password: 'Admin123!' });
    login.submit();
    completarLogin();

    expect(navegar).toHaveBeenCalledWith('/dashboard');
  });

  it('should ignore a protocol-relative returnUrl', async () => {
    const { login, navegar } = await crear('//sitio-malo.com');

    login.form.setValue({ identifier: 'admin', password: 'Admin123!' });
    login.submit();
    completarLogin();

    expect(navegar).toHaveBeenCalledWith('/dashboard');
  });

  it('should show the backend message and stay on the page when the credentials are wrong', async () => {
    const { fixture, login, navegar } = await crear('/metas');

    login.form.setValue({ identifier: 'admin', password: 'incorrecta' });
    login.submit();

    http
      .expectOne(`${SESION}/login`)
      .flush({ error: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
    fixture.detectChanges();

    expect(login.error()).toBe('Invalid credentials');
    expect(login.loading()).toBe(false);
    expect(navegar).not.toHaveBeenCalled();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Invalid credentials');
  });
});
