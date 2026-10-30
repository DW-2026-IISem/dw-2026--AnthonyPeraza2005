import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
  provideRouter,
} from '@angular/router';
import { EffectivePermission } from '../models/auth.model';
import { User } from '../models/user.model';
import { SessionStore } from '../services/session-store';
import { permissionGuard } from './permission-guard';

const PROMOTOR = {
  id: 2,
  username: 'promoter',
  email: 'promoter@impulsacolectivo.local',
  avatar: null,
  status: 'active',
} as User;

const PERMISOS: EffectivePermission[] = [
  {
    resource_id: 1,
    method: 'GET',
    path: '/api/metas',
    description: 'Listar metas',
    role_id: 2,
    role_name: 'PROMOTER',
  },
];

describe('permissionGuard', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  afterAll(() => localStorage.clear());

  /** Ejecuta el guard como si la ruta declarara `data.permission`. */
  function ejecutar(permission?: string) {
    const route = { data: permission ? { permission } : {} } as unknown as ActivatedRouteSnapshot;
    return TestBed.runInInjectionContext(() => permissionGuard(route, {} as RouterStateSnapshot));
  }

  function conPermisos() {
    TestBed.inject(SessionStore).setAccess({ user: PROMOTOR, permissions: PERMISOS });
  }

  it('should let the user in when the role has the permission', () => {
    conPermisos();

    expect(ejecutar('GET /api/metas')).toBe(true);
  });

  it('should redirect to the forbidden page and say which permission is missing', () => {
    conPermisos();

    const resultado = ejecutar('GET /api/transacciones-pago') as UrlTree;

    expect(resultado).toBeInstanceOf(UrlTree);
    expect(resultado.queryParams['permission']).toBe('GET /api/transacciones-pago');
    expect(TestBed.inject(Router).serializeUrl(resultado).startsWith('/sin-permiso?')).toBe(true);
  });

  it('should let any user in when the route declares no permission', () => {
    conPermisos();

    expect(ejecutar()).toBe(true);
  });

  it('should deny by default when no permissions have been loaded', () => {
    const resultado = ejecutar('GET /api/metas');

    expect(resultado).toBeInstanceOf(UrlTree);
  });
});
