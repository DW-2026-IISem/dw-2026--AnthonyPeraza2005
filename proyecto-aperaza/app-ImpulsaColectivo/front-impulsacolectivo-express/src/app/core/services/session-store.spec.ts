import { TestBed } from '@angular/core/testing';
import { AccessPayload, EffectivePermission, SessionTokens } from '../models/auth.model';
import { User } from '../models/user.model';
import { SESSION_STORAGE_KEY, SessionStore } from './session-store';

const TOKENS: SessionTokens = {
  access_token: 'access-1',
  token_type: 'Bearer',
  expires_in: 3600,
  refresh_token: 'refresh-1',
  refresh_expires_in: 604799,
};

// Igual que el perfil real de `admin`: el backend no manda marcas de tiempo.
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
    method: 'GET',
    path: '/api/usuarios/:id',
    description: 'Ver un usuario',
    role_id: 1,
    role_name: 'ADMIN',
  },
  {
    resource_id: 3,
    method: 'POST',
    path: '/api/proyectos',
    description: 'Crear proyecto',
    role_id: 2,
    role_name: 'PROMOTER',
  },
];

const ACCESO: AccessPayload = { user: ADMIN, permissions: PERMISOS };

describe('SessionStore', () => {
  beforeEach(() => localStorage.clear());
  afterAll(() => localStorage.clear());

  function crearStore() {
    return TestBed.inject(SessionStore);
  }

  it('should start empty and not authenticated', () => {
    const store = crearStore();

    expect(store.isAuthenticated()).toBe(false);
    expect(store.user()).toBeNull();
    expect(store.permissions()).toEqual([]);
    expect(store.roleLabel()).toBe('Sin rol');
    expect(store.initials()).toBe('IN');
  });

  it('should keep the tokens and persist them', () => {
    const store = crearStore();

    store.setTokens(TOKENS);

    expect(store.accessToken()).toBe('access-1');
    expect(store.refreshToken()).toBe('refresh-1');
    expect(store.isAuthenticated()).toBe(true);

    const guardado = JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) ?? '{}');
    expect(guardado.accessToken).toBe('access-1');
    expect(guardado.refreshToken).toBe('refresh-1');
  });

  it('should derive roles, label, initials and count from the access payload', () => {
    const store = crearStore();

    store.setAccess(ACCESO);

    expect(store.user()?.username).toBe('admin');
    expect(store.permissionCount()).toBe(3);
    expect(store.roleNames()).toEqual(['ADMIN', 'PROMOTER']);
    expect(store.roleLabel()).toBe('ADMIN, PROMOTER');
    expect(store.initials()).toBe('AD');
  });

  it('should match a permission by method and exact path', () => {
    const store = crearStore();
    store.setAccess(ACCESO);

    expect(store.can('GET', '/api/metas')).toBe(true);
    expect(store.can('get', '/api/metas')).toBe(true); // el método no distingue mayúsculas
    expect(store.can('DELETE', '/api/metas')).toBe(false); // otro método
    expect(store.can('GET', '/api/recompensas')).toBe(false); // otra ruta
  });

  it('should match :id patterns and ignore the query string', () => {
    const store = crearStore();
    store.setAccess(ACCESO);

    expect(store.can('GET', '/api/usuarios/7')).toBe(true);
    expect(store.can('GET', '/api/usuarios/7?include=roles')).toBe(true);
    expect(store.can('GET', '/api/usuarios')).toBe(false);
    expect(store.can('GET', '/api/usuarios/7/permisos')).toBe(false);
  });

  it('should answer canPermission with the "METHOD /path" format', () => {
    const store = crearStore();
    store.setAccess(ACCESO);

    expect(store.canPermission('GET /api/metas')).toBe(true);
    expect(store.canPermission('POST /api/proyectos')).toBe(true);
    expect(store.canPermission('PATCH /api/metas/3/deactivate')).toBe(false);
    expect(store.canPermission('GET')).toBe(false); // sin ruta
  });

  it('should check roles ignoring case', () => {
    const store = crearStore();
    store.setAccess(ACCESO);

    expect(store.hasRole('admin')).toBe(true);
    expect(store.hasRole('PROMOTER')).toBe(true);
    expect(store.hasRole('CONTRIBUTOR')).toBe(false);
  });

  it('should empty everything and remove the storage on clear', () => {
    const store = crearStore();
    store.setTokens(TOKENS);
    store.setAccess(ACCESO);

    store.clear();

    expect(store.isAuthenticated()).toBe(false);
    expect(store.user()).toBeNull();
    expect(store.permissions()).toEqual([]);
    expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
  });

  it('should restore a saved session when it is created', () => {
    localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({
        accessToken: 'access-9',
        refreshToken: 'refresh-9',
        user: ADMIN,
        permissions: PERMISOS,
      }),
    );

    const store = crearStore();

    expect(store.isAuthenticated()).toBe(true);
    expect(store.accessToken()).toBe('access-9');
    expect(store.user()?.username).toBe('admin');
    expect(store.permissionCount()).toBe(3);
  });

  it('should discard a corrupt saved session', () => {
    localStorage.setItem(SESSION_STORAGE_KEY, '{esto no es json');

    const store = crearStore();

    expect(store.isAuthenticated()).toBe(false);
    expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
  });

  it('should discard a saved session that has no permissions list', () => {
    localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({ accessToken: 'viejo', refreshToken: 'viejo', user: ADMIN }),
    );

    const store = crearStore();

    expect(store.isAuthenticated()).toBe(false);
    expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
  });
});
