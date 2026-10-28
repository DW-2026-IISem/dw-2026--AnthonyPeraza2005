import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { Promoter } from '../../core/models/promoter.model';
import { PromoterApi } from './promoter-api';

const BASE = `${environment.apiUrl}/promotores`;

const PROMOTOR: Promoter = {
  id: 1,
  name: 'Fundación Semillas del Caribe',
  description: null,
  contact_email: 'contacto@semillasdelcaribe.org',
  contact_phone: '3001234567',
  status: 'active',
};

describe('PromoterApi', () => {
  let api: PromoterApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(PromoterApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should unwrap { promoters } into Promoter[]', () => {
    let resultado: Promoter[] | undefined;
    api.list().subscribe((promoters) => (resultado = promoters));

    const peticion = http.expectOne(BASE);
    expect(peticion.request.method).toBe('GET');
    peticion.flush({ promoters: [PROMOTOR] });

    expect(resultado).toEqual([PROMOTOR]);
  });

  it('should unwrap { promoter } when creating', () => {
    let resultado: Promoter | undefined;
    api
      .create({ name: PROMOTOR.name, contact_email: PROMOTOR.contact_email })
      .subscribe((promoter) => (resultado = promoter));

    const peticion = http.expectOne(BASE);
    expect(peticion.request.method).toBe('POST');
    peticion.flush({ promoter: PROMOTOR });

    expect(resultado).toEqual(PROMOTOR);
  });

  it('should build URLs from environment.apiUrl (no trailing slash)', () => {
    expect(environment.apiUrl.endsWith('/api')).toBe(true);
    api.list().subscribe();
    http.expectOne('http://localhost:4000/api/promotores').flush({ promoters: [] });
  });
});
