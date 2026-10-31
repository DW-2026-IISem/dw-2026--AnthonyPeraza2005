import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../../environments/environment';
import { Resource } from '../../../../core/models/resource.model';
import { SessionStore } from '../../../../core/services/session-store';
import { grantAccess } from '../../../../core/testing/access';
import { ResourceList } from './resource-list';

const BASE = `${environment.apiUrl}/recursos`;

const RECURSOS = [
  { id: 1, path: '/api/proyectos', method: 'GET', description: 'Listar proyectos', status: 'active' },
  { id: 2, path: '/api/proyectos', method: 'POST', description: 'Crear proyectos', status: 'active' },
  {
    id: 3,
    path: '/api/proyectos/:id',
    method: 'PATCH',
    description: 'Editar proyectos',
    status: 'active',
  },
  { id: 4, path: '/api/transacciones-pago', method: 'GET', description: null, status: 'inactive' },
] as Resource[];

/** Todo lo que `admin` puede hacer sobre recursos. */
const ADMIN_RECURSOS = [
  'GET /api/recursos',
  'POST /api/recursos',
  'PATCH /api/recursos/:id',
  'PATCH /api/recursos/:id/deactivate',
  'DELETE /api/recursos/:id',
];

describe('ResourceList', () => {
  let http: HttpTestingController;
  let session: SessionStore;
  let confirmation: ConfirmationService;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    session = TestBed.inject(SessionStore);
    confirmation = TestBed.inject(ConfirmationService);
    grantAccess(session, ...ADMIN_RECURSOS);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  async function abrir() {
    const fixture = TestBed.createComponent(ResourceList);
    http.expectOne(BASE).flush({ resources: RECURSOS });
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  function aceptarConfirmacion() {
    vi.spyOn(confirmation, 'confirm').mockImplementation((config) => {
      config.accept?.();
      return confirmation;
    });
  }

  it('should load the resources on creation', async () => {
    const lista = (await abrir()).componentInstance;

    expect(lista.rows().length).toBe(4);
    expect(lista.loading()).toBe(false);
    expect(lista.error()).toBeNull();
  });

  it('should show the error and no rows when loading fails', async () => {
    const fixture = TestBed.createComponent(ResourceList);
    http.expectOne(BASE).flush({ message: 'Fallo' }, { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.rows()).toEqual([]);
    expect(fixture.componentInstance.error()).not.toBeNull();
    expect(fixture.componentInstance.loading()).toBe(false);
  });

  it('should filter by path or description without new requests', async () => {
    const lista = (await abrir()).componentInstance;

    lista.filter.set('transacciones');

    expect(lista.visibleRows().map((resource) => resource.id)).toEqual([4]);
  });

  it('should combine the text filter with the method filter', async () => {
    const lista = (await abrir()).componentInstance;

    lista.methodFilter.set('GET');
    expect(lista.visibleRows().map((resource) => resource.id)).toEqual([1, 4]);

    lista.filter.set('proyectos');
    expect(lista.visibleRows().map((resource) => resource.id)).toEqual([1]);

    lista.methodFilter.set('');
    expect(lista.visibleRows().length).toBe(3);
  });

  it('should count the resources by method in HTTP order', async () => {
    const lista = (await abrir()).componentInstance;

    expect(lista.countsByMethod()).toEqual([
      { method: 'GET', count: 2 },
      { method: 'POST', count: 1 },
      { method: 'PATCH', count: 1 },
    ]);
  });

  it('should POST a new resource with status and then reload', async () => {
    const lista = (await abrir()).componentInstance;
    const payload = {
      path: '/api/recompensas',
      method: 'POST' as const,
      description: 'Crear recompensas',
      status: 'active' as const,
    };

    lista.openCreate();
    lista.save(payload);

    const alta = http.expectOne(BASE);
    expect(alta.request.method).toBe('POST');
    expect(alta.request.body).toEqual(payload);
    alta.flush({ resource: RECURSOS[0] });

    http.expectOne(BASE).flush({ resources: RECURSOS });
    expect(lista.dialogVisible()).toBe(false);
    expect(lista.saving()).toBe(false);
  });

  it('should PATCH the edited resource without status', async () => {
    const lista = (await abrir()).componentInstance;
    const payload = {
      path: '/api/proyectos',
      method: 'GET' as const,
      description: 'Listar proyectos del panel',
    };

    lista.openEdit(RECURSOS[0]);
    lista.save(payload);

    const cambio = http.expectOne(`${BASE}/1`);
    expect(cambio.request.method).toBe('PATCH');
    expect(cambio.request.body).toEqual(payload);
    cambio.flush({ resource: RECURSOS[0] });

    http.expectOne(BASE).flush({ resources: RECURSOS });
  });

  it('should call deactivate after the confirmation is accepted', async () => {
    const lista = (await abrir()).componentInstance;
    aceptarConfirmacion();

    lista.deactivate(RECURSOS[1]);

    const baja = http.expectOne(`${BASE}/2/deactivate`);
    expect(baja.request.method).toBe('PATCH');
    baja.flush({ message: 'Resource deactivated' });

    http.expectOne(BASE).flush({ resources: RECURSOS });
  });

  it('should call DELETE after the confirmation is accepted', async () => {
    const lista = (await abrir()).componentInstance;
    aceptarConfirmacion();

    lista.remove(RECURSOS[3]);

    const borrado = http.expectOne(`${BASE}/4`);
    expect(borrado.request.method).toBe('DELETE');
    borrado.flush({ message: 'Resource deleted' });

    http.expectOne(BASE).flush({ resources: RECURSOS.slice(0, 3) });
  });

  it('should show an error toast and stay open when saving fails', async () => {
    const lista = (await abrir()).componentInstance;
    const mensajes = vi.spyOn(TestBed.inject(MessageService), 'add');

    lista.openCreate();
    lista.save({ path: '/api/proyectos', method: 'GET', description: null, status: 'active' });
    http
      .expectOne(BASE)
      .flush({ message: 'resource already exists' }, { status: 409, statusText: 'Conflict' });

    expect(mensajes).toHaveBeenCalledWith(expect.objectContaining({ severity: 'error' }));
    expect(lista.saving()).toBe(false);
    expect(lista.dialogVisible()).toBe(true);
  });

  it('should hide the write buttons for a read-only role', async () => {
    grantAccess(session, 'GET /api/recursos');

    const fixture = await abrir();
    const raiz = fixture.nativeElement as HTMLElement;
    const textos = Array.from(raiz.querySelectorAll('button')).map((b) => b.textContent ?? '');

    expect(textos.some((texto) => texto.includes('Nuevo recurso'))).toBe(false);
    expect(raiz.querySelector('button[aria-label="Editar recurso"]')).toBeNull();
    expect(raiz.querySelector('button[aria-label="Eliminar recurso"]')).toBeNull();
  });
});
