import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SessionStore } from '../../../core/services/session-store';
import { grantFullAccess } from '../../../core/testing/access';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { Promoter, PromoterPayload } from '../../../core/models/promoter.model';
import { PromoterList } from './promoter-list';

const BASE = `${environment.apiUrl}/promotores`;

const PROMOTORES: Promoter[] = [
  {
    id: 1,
    name: 'Fundación Semillas del Caribe',
    description: 'Educación rural en La Guajira',
    contact_email: 'contacto@semillas.org',
    contact_phone: '3001234567',
    status: 'active',
  },
  {
    id: 2,
    name: 'Cooperativa Mar y Sol',
    description: null,
    contact_email: 'info@marysol.co',
    contact_phone: null,
    status: 'active',
  },
  {
    id: 3,
    name: 'Colectivo Huerta Viva',
    description: 'Huertas escolares',
    contact_email: 'hola@huertaviva.org',
    contact_phone: '3205550000',
    status: 'active',
  },
];

const NUEVO: PromoterPayload = {
  name: 'Red Wayuu Emprende',
  contact_email: 'red@wayuuemprende.org',
  status: 'active',
};

describe('PromoterList', () => {
  let http: HttpTestingController;
  let confirmation: ConfirmationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromoterList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    grantFullAccess(TestBed.inject(SessionStore));
    confirmation = TestBed.inject(ConfirmationService);
  });

  afterEach(() => http.verify());

  /** Crea la pantalla y responde el GET inicial que lanza el constructor. */
  async function crearLista(respuesta: Promoter[] = PROMOTORES) {
    const fixture = TestBed.createComponent(PromoterList);
    http.expectOne(BASE).flush({ promoters: respuesta });
    fixture.detectChanges();
    await fixture.whenStable();

    return { fixture, lista: fixture.componentInstance, compilado: fixture.nativeElement as HTMLElement };
  }

  /** Espía que acepta la confirmación de inmediato. */
  function aceptarConfirmacion() {
    return vi.spyOn(confirmation, 'confirm').mockImplementation((config) => {
      config.accept?.();
      return confirmation;
    });
  }

  it('should load the promoters and render them in the table', async () => {
    const { lista, compilado } = await crearLista();

    expect(lista.rows().length).toBe(3);
    expect(lista.loading()).toBe(false);

    const texto = compilado.textContent ?? '';
    expect(texto).toContain('Fundación Semillas del Caribe');
    expect(texto).toContain('Cooperativa Mar y Sol');
    expect(texto).toContain('3 promotores');
  });

  it('should show the backend error and an empty table when the load fails', async () => {
    const fixture = TestBed.createComponent(PromoterList);
    http
      .expectOne(BASE)
      .flush({ error: 'Missing Bearer token' }, { status: 401, statusText: 'Unauthorized' });
    fixture.detectChanges();
    await fixture.whenStable();

    const lista = fixture.componentInstance;
    expect(lista.error()).toBe('Missing Bearer token');
    expect(lista.rows()).toEqual([]);
    expect(lista.loading()).toBe(false);
  });

  it('should filter locally without calling the backend again', async () => {
    const { lista } = await crearLista();

    lista.filter.set('mar');

    expect(lista.visibleRows().map((p) => p.name)).toEqual(['Cooperativa Mar y Sol']);
    http.expectNone(BASE);
  });

  it('should POST a new promoter and reload', async () => {
    const { lista } = await crearLista();

    lista.openCreate();
    expect(lista.dialogVisible()).toBe(true);
    expect(lista.title()).toBe('Nuevo promotor');

    lista.save(NUEVO);

    const alta = http.expectOne(BASE);
    expect(alta.request.method).toBe('POST');
    expect(alta.request.body).toEqual(NUEVO);
    alta.flush({ promoter: { id: 4, ...NUEVO } });

    expect(lista.dialogVisible()).toBe(false);
    http.expectOne(BASE).flush({ promoters: [...PROMOTORES] }); // recarga posterior
  });

  it('should PATCH the edited promoter and send no status', async () => {
    const { lista } = await crearLista();

    lista.openEdit(PROMOTORES[0]);
    expect(lista.title()).toBe('Editar promotor');

    const cambio: PromoterPayload = {
      name: 'Fundación Semillas del Caribe',
      contact_email: 'contacto@semillas.org',
      contact_phone: '3100000000',
    };
    lista.save(cambio);

    const peticion = http.expectOne(`${BASE}/1`);
    expect(peticion.request.method).toBe('PATCH');
    expect(peticion.request.body).toEqual(cambio);
    peticion.flush({ promoter: PROMOTORES[0] });

    http.expectOne(BASE).flush({ promoters: PROMOTORES }); // recarga posterior
  });

  it('should call deactivate after the confirmation is accepted', async () => {
    const { lista } = await crearLista();
    aceptarConfirmacion();

    lista.deactivate(PROMOTORES[0]);

    const baja = http.expectOne(`${BASE}/1/deactivate`);
    expect(baja.request.method).toBe('PATCH');
    baja.flush({ message: 'Promoter deactivated (logical delete)' });

    http.expectOne(BASE).flush({ promoters: PROMOTORES.slice(1) });
  });

  it('should call DELETE after the confirmation is accepted', async () => {
    const { lista } = await crearLista();
    aceptarConfirmacion();

    lista.remove(PROMOTORES[0]);

    const borrado = http.expectOne(`${BASE}/1`);
    expect(borrado.request.method).toBe('DELETE');
    borrado.flush({ message: 'Promoter deleted' });

    http.expectOne(BASE).flush({ promoters: PROMOTORES.slice(1) });
  });

  it('should not call the backend when the confirmation is rejected', async () => {
    const { lista } = await crearLista();
    // La confirmación se abre pero nadie ejecuta `accept()`.
    vi.spyOn(confirmation, 'confirm').mockImplementation(() => confirmation);

    lista.deactivate(PROMOTORES[0]);
    lista.remove(PROMOTORES[0]);

    http.expectNone(`${BASE}/1/deactivate`);
    http.expectNone(`${BASE}/1`);
  });

  it('should keep the dialog open and show a toast when saving fails', async () => {
    const { lista } = await crearLista();
    const add = vi.spyOn(TestBed.inject(MessageService), 'add');

    lista.openCreate();
    lista.save(NUEVO);

    http
      .expectOne(BASE)
      .flush(
        { error: 'Validation error', detail: 'contact_email must be unique' },
        { status: 400, statusText: 'Bad Request' },
      );

    expect(lista.dialogVisible()).toBe(true);
    expect(lista.saving()).toBe(false);
    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'error', summary: 'No se pudo guardar' }),
    );
  });
});
