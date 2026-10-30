import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EffectivePermission } from '../../core/models/auth.model';
import { HttpMethod } from '../../core/models/resource.model';
import { User } from '../../core/models/user.model';
import { SessionStore } from '../../core/services/session-store';
import { NAV } from './nav.config';
import { Shell } from './shell';

const USUARIO = {
  id: 2,
  username: 'promoter',
  email: 'promoter@impulsacolectivo.local',
  avatar: null,
  status: 'active',
} as User;

/** `'GET /api/metas'` → fila de permiso efectivo. */
function permiso(texto: string, id: number): EffectivePermission {
  const [method, path] = texto.split(' ');
  return {
    resource_id: id,
    method: method as HttpMethod,
    path,
    description: null,
    role_id: 1,
    role_name: 'PROMOTER',
  };
}

describe('NAV', () => {
  it('should give every screen a different link', () => {
    const enlaces = NAV.map((item) => item.routerLink);

    expect(new Set(enlaces).size).toBe(enlaces.length);
  });

  it('should protect every screen with a GET permission over /api', () => {
    for (const item of NAV.filter((opcion) => opcion.permission)) {
      expect(item.permission).toMatch(/^GET \/api\/[a-z-]+$/);
    }
  });
});

describe('Shell · menú por permisos', () => {
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
  });

  afterAll(() => localStorage.clear());

  function conPermisos(...textos: string[]) {
    session.setAccess({
      user: USUARIO,
      permissions: textos.map((texto, indice) => permiso(texto, indice + 1)),
    });
  }

  function etiquetas() {
    return TestBed.createComponent(Shell).componentInstance.items().map((item) => item.label);
  }

  it('should show the whole menu when the role holds every permission', () => {
    conPermisos(...NAV.filter((item) => item.permission).map((item) => item.permission!));

    expect(etiquetas()).toEqual(NAV.map((item) => item.label));
  });

  it('should show only the screens the role can read, keeping the catalog order', () => {
    conPermisos('GET /api/proyectos', 'GET /api/promotores', 'GET /api/metas');

    expect(etiquetas()).toEqual(['Panel', 'Promotores', 'Proyectos', 'Metas', 'Prototipo']);
  });

  it('should leave only the public prototype when there are no permissions', () => {
    expect(etiquetas()).toEqual(['Prototipo']);
  });

  it('should recalculate the menu when the permissions change', () => {
    conPermisos('GET /api/metas');
    const shell = TestBed.createComponent(Shell).componentInstance;
    expect(shell.items().map((item) => item.label)).toEqual(['Metas', 'Prototipo']);

    conPermisos('GET /api/metas', 'GET /api/desembolsos');

    expect(shell.items().map((item) => item.label)).toEqual(['Metas', 'Desembolsos', 'Prototipo']);
  });
});
