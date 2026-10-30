import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { ConfirmationService, MenuItemCommandEvent, MessageService } from 'primeng/api';
import { environment } from '../../../environments/environment';
import { EffectivePermission, SessionTokens } from '../../core/models/auth.model';
import { User } from '../../core/models/user.model';
import { SessionStore } from '../../core/services/session-store';
import { Shell } from './shell';

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

describe('Shell · sesión', () => {
  let session: SessionStore;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [Shell],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();

    session = TestBed.inject(SessionStore);
    session.setTokens(TOKENS);
    session.setAccess({ user: ADMIN, permissions: PERMISOS });
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
    localStorage.clear();
  });

  async function crearShell() {
    const fixture = TestBed.createComponent(Shell);
    await fixture.whenStable();
    return fixture.componentInstance;
  }

  it('should expose the session data that the header and the aside show', async () => {
    const shell = await crearShell();

    expect(shell.authEnabled).toBe(true);
    expect(shell.username()).toBe('admin');
    expect(shell.initials()).toBe('AD');
    expect(shell.roleLabel()).toBe('ADMIN');
    expect(shell.permissionCount()).toBe(2);
  });

  it('should offer the profile and the logout in the user menu', async () => {
    const shell = await crearShell();

    const etiquetas = shell.userItems.map((item) => item.label).filter(Boolean);
    expect(etiquetas).toEqual(['Mi perfil', 'Cerrar sesión']);
    expect(shell.userItems[0].routerLink).toBe('/perfil');
  });

  it('should close the session and go to the login from the user menu', async () => {
    const shell = await crearShell();
    const http = TestBed.inject(HttpTestingController);
    const navegar = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    const salir = shell.userItems.find((item) => item.label === 'Cerrar sesión');
    salir?.command?.({} as MenuItemCommandEvent);

    const peticion = http.expectOne(`${environment.apiUrl}/sesion/logout`);
    expect(peticion.request.body).toEqual({ refresh_token: 'refresh-1' });
    peticion.flush({ message: 'Logged out' });

    expect(session.isAuthenticated()).toBe(false);
    expect(navegar).toHaveBeenCalledWith(['/login']);
  });
});
