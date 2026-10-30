import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SessionStore } from '../../../core/services/session-store';
import { grantFullAccess } from '../../../core/testing/access';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { Contributor, ContributorPayload } from '../../../core/models/contributor.model';
import { ContributorList } from './contributor-list';

const BASE = `${environment.apiUrl}/contribuyentes`;

const CONTRIBUYENTES: Contributor[] = [
  {
    id: 1,
    name: 'María Fernanda Ortiz',
    email: 'maria.ortiz@correo.com',
    phone: '3001234567',
    status: 'active',
  },
  {
    id: 2,
    name: 'Carlos Andrés Pinto',
    email: 'carlos.pinto@correo.com',
    phone: null,
    status: 'active',
  },
  {
    id: 3,
    name: 'Laura Gómez',
    email: 'laura.gomez@correo.com',
    phone: '3205550000',
    status: 'active',
  },
];

const NUEVO: ContributorPayload = {
  name: 'Andrea Vargas',
  email: 'andrea.vargas@correo.com',
  status: 'active',
};

describe('ContributorList', () => {
  let http: HttpTestingController;
  let confirmation: ConfirmationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContributorList],
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
  async function crearLista(respuesta: Contributor[] = CONTRIBUYENTES) {
    const fixture = TestBed.createComponent(ContributorList);
    http.expectOne(BASE).flush({ contributors: respuesta });
    fixture.detectChanges();
    await fixture.whenStable();

    return {
      fixture,
      lista: fixture.componentInstance,
      compilado: fixture.nativeElement as HTMLElement,
    };
  }

  /** Espía que acepta la confirmación de inmediato. */
  function aceptarConfirmacion() {
    return vi.spyOn(confirmation, 'confirm').mockImplementation((config) => {
      config.accept?.();
      return confirmation;
    });
  }

  it('should load the contributors and render them in the table', async () => {
    const { lista, compilado } = await crearLista();

    expect(lista.rows().length).toBe(3);
    expect(lista.loading()).toBe(false);

    const texto = compilado.textContent ?? '';
    expect(texto).toContain('María Fernanda Ortiz');
    expect(texto).toContain('Carlos Andrés Pinto');
    expect(texto).toContain('3 contribuyentes');
  });

  it('should show the backend error and an empty table when the load fails', async () => {
    const fixture = TestBed.createComponent(ContributorList);
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

    lista.filter.set('carlos');

    expect(lista.visibleRows().map((c) => c.name)).toEqual(['Carlos Andrés Pinto']);
    http.expectNone(BASE);
  });

  it('should POST a new contributor and reload', async () => {
    const { lista } = await crearLista();

    lista.openCreate();
    expect(lista.dialogVisible()).toBe(true);
    expect(lista.title()).toBe('Nuevo contribuyente');

    lista.save(NUEVO);

    const alta = http.expectOne(BASE);
    expect(alta.request.method).toBe('POST');
    expect(alta.request.body).toEqual(NUEVO);
    alta.flush({ contributor: { id: 4, phone: null, ...NUEVO } });

    expect(lista.dialogVisible()).toBe(false);
    http.expectOne(BASE).flush({ contributors: [...CONTRIBUYENTES] }); // recarga posterior
  });

  it('should PATCH the edited contributor and send no status', async () => {
    const { lista } = await crearLista();

    lista.openEdit(CONTRIBUYENTES[0]);
    expect(lista.title()).toBe('Editar contribuyente');

    const cambio: ContributorPayload = {
      name: 'María Fernanda Ortiz',
      email: 'maria.ortiz@correo.com',
      phone: '3100000000',
    };
    lista.save(cambio);

    const peticion = http.expectOne(`${BASE}/1`);
    expect(peticion.request.method).toBe('PATCH');
    expect(peticion.request.body).toEqual(cambio);
    peticion.flush({ contributor: CONTRIBUYENTES[0] });

    http.expectOne(BASE).flush({ contributors: CONTRIBUYENTES }); // recarga posterior
  });

  it('should call deactivate after the confirmation is accepted', async () => {
    const { lista } = await crearLista();
    aceptarConfirmacion();

    lista.deactivate(CONTRIBUYENTES[0]);

    const baja = http.expectOne(`${BASE}/1/deactivate`);
    expect(baja.request.method).toBe('PATCH');
    baja.flush({ message: 'Contributor deactivated (logical delete)' });

    http.expectOne(BASE).flush({ contributors: CONTRIBUYENTES.slice(1) });
  });

  it('should call DELETE after the confirmation is accepted', async () => {
    const { lista } = await crearLista();
    aceptarConfirmacion();

    lista.remove(CONTRIBUYENTES[0]);

    const borrado = http.expectOne(`${BASE}/1`);
    expect(borrado.request.method).toBe('DELETE');
    borrado.flush({ message: 'Contributor deleted' });

    http.expectOne(BASE).flush({ contributors: CONTRIBUYENTES.slice(1) });
  });

  it('should not call the backend when the confirmation is rejected', async () => {
    const { lista } = await crearLista();
    // La confirmación se abre pero nadie ejecuta `accept()`.
    vi.spyOn(confirmation, 'confirm').mockImplementation(() => confirmation);

    lista.deactivate(CONTRIBUYENTES[0]);
    lista.remove(CONTRIBUYENTES[0]);

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
        { error: 'Validation error', detail: 'email must be unique' },
        { status: 400, statusText: 'Bad Request' },
      );

    expect(lista.dialogVisible()).toBe(true);
    expect(lista.saving()).toBe(false);
    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'error', summary: 'No se pudo guardar' }),
    );
  });
});
