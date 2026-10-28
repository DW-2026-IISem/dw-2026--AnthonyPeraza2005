import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { ResourceRoleApi } from './resource-roles/resource-role-api';
import { RoleUserApi } from './role-users/role-user-api';

/**
 * Las tablas se llaman `role_users` y `resource_roles`, pero Express responde
 * `{ assignments }` y `{ grants }`. Estas pruebas fijan esa trampa del contrato.
 */
describe('Pivot APIs', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should unwrap { assignments }, not { role_users }', () => {
    let total = -1;
    TestBed.inject(RoleUserApi)
      .list()
      .subscribe((filas) => (total = filas.length));

    http
      .expectOne(`${environment.apiUrl}/asignaciones-rol`)
      .flush({ assignments: [{ id: 1, user_id: 3, role_id: 2, status: 'active' }] });

    expect(total).toBe(1);
  });

  it('should unwrap { grants }, not { resource_roles }', () => {
    let total = -1;
    TestBed.inject(ResourceRoleApi)
      .list()
      .subscribe((filas) => (total = filas.length));

    http
      .expectOne(`${environment.apiUrl}/concesiones-rol`)
      .flush({ grants: [{ id: 1, resource_id: 10, role_id: 2, status: 'active' }] });

    expect(total).toBe(1);
  });

  it('should send the role filter as a query param', () => {
    TestBed.inject(ResourceRoleApi).list({ role_id: 2 }).subscribe();

    const peticion = http.expectOne(
      (r) => r.url === `${environment.apiUrl}/concesiones-rol` && r.params.get('role_id') === '2',
    );
    peticion.flush({ grants: [] });
  });
});
