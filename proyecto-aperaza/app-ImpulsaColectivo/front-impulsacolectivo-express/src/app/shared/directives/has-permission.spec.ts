import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EffectivePermission } from '../../core/models/auth.model';
import { User } from '../../core/models/user.model';
import { SessionStore } from '../../core/services/session-store';
import { HasPermission } from './has-permission';

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
    method: 'POST',
    path: '/api/metas',
    description: 'Crear meta',
    role_id: 2,
    role_name: 'PROMOTER',
  },
  {
    resource_id: 2,
    method: 'PATCH',
    path: '/api/metas/:id',
    description: 'Editar meta',
    role_id: 2,
    role_name: 'PROMOTER',
  },
];

@Component({
  imports: [HasPermission],
  template: `
    <p>Siempre visible</p>
    <button *appHasPermission="permission()">Acción protegida</button>
  `,
})
class Anfitrion {
  readonly permission = signal('POST /api/metas');
}

describe('HasPermission', () => {
  let session: SessionStore;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({ imports: [Anfitrion] }).compileComponents();
    session = TestBed.inject(SessionStore);
  });

  afterAll(() => localStorage.clear());

  /** Los efectos corren al detectar cambios: se fuerza y se espera. */
  async function actualizar(fixture: ComponentFixture<Anfitrion>) {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  async function crear() {
    const fixture = TestBed.createComponent(Anfitrion);
    await actualizar(fixture);
    return { fixture, compilado: fixture.nativeElement as HTMLElement };
  }

  it('should render the block when the session has the permission', async () => {
    session.setAccess({ user: PROMOTOR, permissions: PERMISOS });

    const { compilado } = await crear();

    expect(compilado.querySelector('button')).not.toBeNull();
    expect(compilado.textContent).toContain('Siempre visible');
  });

  it('should not render the block when the permission is missing', async () => {
    const { compilado } = await crear();

    expect(compilado.querySelector('button')).toBeNull();
    expect(compilado.textContent).toContain('Siempre visible');
  });

  it('should show the block once the permissions arrive', async () => {
    const { fixture, compilado } = await crear();
    expect(compilado.querySelector('button')).toBeNull();

    session.setAccess({ user: PROMOTOR, permissions: PERMISOS });
    await actualizar(fixture);

    expect(compilado.querySelector('button')).not.toBeNull();
  });

  it('should hide the block when the session is closed', async () => {
    session.setAccess({ user: PROMOTOR, permissions: PERMISOS });
    const { fixture, compilado } = await crear();
    expect(compilado.querySelector('button')).not.toBeNull();

    session.clear();
    await actualizar(fixture);

    expect(compilado.querySelector('button')).toBeNull();
  });

  it('should follow the permission when the input changes and understand :id patterns', async () => {
    session.setAccess({ user: PROMOTOR, permissions: PERMISOS });
    const { fixture, compilado } = await crear();

    fixture.componentInstance.permission.set('PATCH /api/metas/:id');
    await actualizar(fixture);
    expect(compilado.querySelector('button')).not.toBeNull();

    fixture.componentInstance.permission.set('DELETE /api/metas/:id');
    await actualizar(fixture);
    expect(compilado.querySelector('button')).toBeNull();
  });
});
