import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { ResourceRoleApi } from './resource-role-api';

const BASE = `${environment.apiUrl}/concesiones-rol`;

describe('ResourceRoleApi.reconcile', () => {
  let api: ResourceRoleApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(ResourceRoleApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should POST role_id and the full list of resource_ids and unwrap result', () => {
    let resultado: unknown;
    api.reconcile(2, [15, 16, 17]).subscribe((r) => (resultado = r));

    const peticion = http.expectOne(BASE);
    expect(peticion.request.method).toBe('POST');
    expect(peticion.request.body).toEqual({ role_id: 2, resource_ids: [15, 16, 17] });
    peticion.flush({
      message: 'Role permissions updated',
      result: { role_id: 2, activated: 3, deactivated: 0, total_active: 3 },
    });

    expect(resultado).toEqual({ role_id: 2, activated: 3, deactivated: 0, total_active: 3 });
  });

  it('should send an empty list as is (the role is left without permissions)', () => {
    api.reconcile(2, []).subscribe();

    expect(http.expectOne(BASE).request.body).toEqual({ role_id: 2, resource_ids: [] });
  });

  it('should fail with a readable error when the response has no result', () => {
    let error: unknown;
    api.reconcile(2, [1]).subscribe({ error: (e: unknown) => (error = e) });

    http.expectOne(BASE).flush({ message: 'Role permissions updated' });

    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toContain('resultado');
  });
});
