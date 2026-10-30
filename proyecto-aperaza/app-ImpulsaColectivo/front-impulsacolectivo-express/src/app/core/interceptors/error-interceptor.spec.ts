import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { environment } from '../../../environments/environment';
import { errorInterceptor } from './error-interceptor';

const METAS = `${environment.apiUrl}/metas`;

describe('errorInterceptor', () => {
  let http: HttpTestingController;
  let client: HttpClient;
  let aviso: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        MessageService,
      ],
    });

    http = TestBed.inject(HttpTestingController);
    client = TestBed.inject(HttpClient);
    aviso = vi.spyOn(TestBed.inject(MessageService), 'add');
  });

  afterEach(() => http.verify());

  it('should warn about a lost connection on a GET', () => {
    client.get(METAS).subscribe({ error: () => undefined });

    http.expectOne(METAS).error(new ProgressEvent('error'));

    expect(aviso).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'error', summary: 'Sin conexión' }),
    );
  });

  it('should warn about a 403 on a GET', () => {
    client.get(METAS).subscribe({ error: () => undefined });

    http.expectOne(METAS).flush({ error: 'Forbidden' }, { status: 403, statusText: 'Forbidden' });

    expect(aviso).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'error', summary: 'Sin permiso' }),
    );
  });

  it('should warn about a server error on a GET', () => {
    client.get(METAS).subscribe({ error: () => undefined });

    http.expectOne(METAS).flush({ error: 'Boom' }, { status: 500, statusText: 'Server Error' });

    expect(aviso).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'error', summary: 'Error del servidor' }),
    );
  });

  it('should stay silent on a 401', () => {
    client.get(METAS).subscribe({ error: () => undefined });

    http.expectOne(METAS).flush({ error: 'No token' }, { status: 401, statusText: 'Unauthorized' });

    expect(aviso).not.toHaveBeenCalled();
  });

  it('should stay silent when a write fails, because the list already shows its own warning', () => {
    client.post(METAS, {}).subscribe({ error: () => undefined });

    http.expectOne(METAS).flush({ error: 'Boom' }, { status: 500, statusText: 'Server Error' });

    expect(aviso).not.toHaveBeenCalled();
  });

  it('should keep propagating the error to the caller', () => {
    let estado = 0;

    client.get(METAS).subscribe({ error: (error) => (estado = error.status) });

    http.expectOne(METAS).flush({ error: 'Forbidden' }, { status: 403, statusText: 'Forbidden' });

    expect(estado).toBe(403);
  });
});
