import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { EffectivePermission } from '../../../core/models/auth.model';
import { UserApi } from './user-api';

describe('UserApi.permissions', () => {
  it('should unwrap { permissions } from GET /usuarios/:id/permisos', () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const api = TestBed.inject(UserApi);
    const http = TestBed.inject(HttpTestingController);

    const permiso: EffectivePermission = {
      resource_id: 7,
      method: 'GET',
      path: '/api/proyectos',
      description: 'Listar proyectos',
      role_id: 2,
      role_name: 'PROMOTER',
    };

    let resultado: EffectivePermission[] | undefined;
    api.permissions(2).subscribe((permisos) => (resultado = permisos));

    const peticion = http.expectOne(`${environment.apiUrl}/usuarios/2/permisos`);
    expect(peticion.request.method).toBe('GET');
    peticion.flush({ permissions: [permiso] });

    expect(resultado).toEqual([permiso]);
    http.verify();
  });
});
