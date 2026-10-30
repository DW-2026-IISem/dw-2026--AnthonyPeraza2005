import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { Project } from '../../../core/models/project.model';
import { ProjectAudit, ProjectAuditPayload } from '../../../core/models/project-audit.model';
import { ProjectAuditList } from './project-audit-list';

const AUDITORIAS = `${environment.apiUrl}/auditorias-proyecto`;
const PROYECTOS = `${environment.apiUrl}/proyectos`;

const PROYECTOS_DATA: Project[] = [
  {
    id: 1,
    title: 'Biblioteca comunitaria Riohacha',
    description: 'Dotar de libros y mobiliario a una biblioteca barrial',
    start_date: '2026-10-01',
    end_date: '2027-02-28',
    promoter_id: 1,
    status: 'active',
  },
  {
    id: 2,
    title: 'Huerta escolar Uribia',
    description: 'Huerta para el comedor de una escuela rural',
    start_date: '2026-10-01',
    end_date: '2027-03-31',
    promoter_id: 2,
    status: 'active',
  },
  {
    id: 3,
    title: 'Becas de robótica Maicao',
    description: 'Becas para talleres de robótica juvenil',
    start_date: '2026-10-01',
    end_date: '2027-03-31',
    promoter_id: 1,
    status: 'inactive',
  },
];

const AUDITORIAS_DATA: ProjectAudit[] = [
  {
    id: 1,
    action: 'Verificación de gastos',
    detail: 'Se contrastaron las facturas de compra de libros con el presupuesto aprobado',
    audit_date: '2026-10-15',
    project_id: 1,
    status: 'active',
  },
  {
    id: 2,
    action: 'Visita de campo',
    detail: 'Se recorrió el predio de la huerta y se revisó el sistema de riego',
    audit_date: '2026-10-20',
    project_id: 2,
    status: 'active',
  },
  {
    id: 3,
    action: 'Revisión documental',
    detail: 'Se revisaron los convenios con los talleristas',
    audit_date: '2026-10-25',
    project_id: 3, // proyecto inactivo
    status: 'inactive',
  },
];

const NUEVA: ProjectAuditPayload = {
  action: 'Reporte de avance',
  detail: 'Se entregó el informe mensual de avance',
  audit_date: '2026-10-28',
  project_id: 1,
  status: 'active',
};

describe('ProjectAuditList', () => {
  let http: HttpTestingController;
  let confirmation: ConfirmationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectAuditList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    confirmation = TestBed.inject(ConfirmationService);
  });

  afterEach(() => http.verify());

  /** `forkJoin` lanza dos GET: se contestan los dos. */
  function responderCarga(auditorias = AUDITORIAS_DATA) {
    http.expectOne(PROYECTOS).flush({ projects: PROYECTOS_DATA });
    http.expectOne(AUDITORIAS).flush({ project_audits: auditorias });
  }

  async function crearLista() {
    const fixture = TestBed.createComponent(ProjectAuditList);
    responderCarga();
    fixture.detectChanges();
    await fixture.whenStable();

    return {
      fixture,
      lista: fixture.componentInstance,
      compilado: fixture.nativeElement as HTMLElement,
    };
  }

  function aceptarConfirmacion() {
    return vi.spyOn(confirmation, 'confirm').mockImplementation((config) => {
      config.accept?.();
      return confirmation;
    });
  }

  it('should load audits and projects and render them in the table', async () => {
    const { lista, compilado } = await crearLista();

    expect(lista.rows().length).toBe(3);
    expect(lista.projects().length).toBe(3);
    expect(lista.loading()).toBe(false);

    const texto = compilado.textContent ?? '';
    expect(texto).toContain('Visita de campo');
    expect(texto).toContain('Huerta escolar Uribia');
    expect(texto).toContain('3 auditorías');
  });

  it('should show the backend error and an empty table when the load fails', async () => {
    const fixture = TestBed.createComponent(ProjectAuditList);
    http.expectOne(PROYECTOS).flush({ projects: [] });
    http
      .expectOne(AUDITORIAS)
      .flush({ error: 'Missing Bearer token' }, { status: 401, statusText: 'Unauthorized' });
    fixture.detectChanges();
    await fixture.whenStable();

    const lista = fixture.componentInstance;
    expect(lista.error()).toBe('Missing Bearer token');
    expect(lista.rows()).toEqual([]);
    expect(lista.loading()).toBe(false);
  });

  it('should resolve the project title and fall back when it is unknown', async () => {
    const { lista } = await crearLista();

    expect(lista.projectTitle()(1)).toBe('Biblioteca comunitaria Riohacha');
    expect(lista.projectTitle()(99)).toBe('Proyecto #99');
  });

  it('should format an ISO date as DD/MM/YYYY without shifting the day', async () => {
    const { lista } = await crearLista();

    expect(lista.formatDate('2026-10-15')).toBe('15/10/2026');
    expect(lista.formatDate('2027-01-01')).toBe('01/01/2027');
  });

  it('should offer only active projects, plus the current one when editing', async () => {
    const { lista } = await crearLista();

    expect(lista.projectOptions().map((p) => p.id)).toEqual([1, 2]);

    lista.openEdit(AUDITORIAS_DATA[2]); // su proyecto (3) está inactivo
    expect(lista.projectOptions().map((p) => p.id)).toEqual([1, 2, 3]);
  });

  it('should filter locally by action or project name without calling the backend', async () => {
    const { lista } = await crearLista();

    lista.filter.set('visita'); // acción
    expect(lista.visibleRows().map((a) => a.id)).toEqual([2]);

    lista.filter.set('riohacha'); // título del proyecto
    expect(lista.visibleRows().map((a) => a.id)).toEqual([1]);

    http.expectNone(AUDITORIAS);
    http.expectNone(PROYECTOS);
  });

  it('should filter by detail text and by date', async () => {
    const { lista } = await crearLista();

    lista.filter.set('riego'); // dentro del detalle
    expect(lista.visibleRows().map((a) => a.id)).toEqual([2]);

    lista.filter.set('2026-10-25'); // fecha ISO
    expect(lista.visibleRows().map((a) => a.id)).toEqual([3]);
  });

  it('should count only the active audits', async () => {
    const { lista } = await crearLista();

    expect(lista.activeCount()).toBe(2);
  });

  it('should POST a new audit with status and reload both lists', async () => {
    const { lista } = await crearLista();

    lista.openCreate();
    expect(lista.dialogVisible()).toBe(true);
    expect(lista.title()).toBe('Nueva auditoría');

    lista.save(NUEVA);

    const alta = http.expectOne(AUDITORIAS);
    expect(alta.request.method).toBe('POST');
    expect(alta.request.body).toEqual(NUEVA);
    alta.flush({ project_audit: { id: 4, ...NUEVA } });

    expect(lista.dialogVisible()).toBe(false);
    responderCarga();
  });

  it('should PATCH the edited audit and send no status', async () => {
    const { lista } = await crearLista();

    lista.openEdit(AUDITORIAS_DATA[0]);
    expect(lista.title()).toBe('Editar auditoría');

    const cambio: ProjectAuditPayload = {
      action: 'Verificación de gastos',
      detail: 'Se contrastaron las facturas y se encontró una diferencia menor',
      audit_date: '2026-10-16',
      project_id: 1,
    };
    lista.save(cambio);

    const peticion = http.expectOne(`${AUDITORIAS}/1`);
    expect(peticion.request.method).toBe('PATCH');
    expect(peticion.request.body).toEqual(cambio);
    peticion.flush({ project_audit: AUDITORIAS_DATA[0] });

    responderCarga();
  });

  it('should call deactivate and DELETE only after the confirmation is accepted', async () => {
    const { lista } = await crearLista();

    // Rechazada: no hay petición.
    const rechazo = vi.spyOn(confirmation, 'confirm').mockImplementation(() => confirmation);
    lista.deactivate(AUDITORIAS_DATA[0]);
    lista.remove(AUDITORIAS_DATA[0]);
    http.expectNone(`${AUDITORIAS}/1/deactivate`);
    http.expectNone(`${AUDITORIAS}/1`);
    rechazo.mockRestore();

    // Aceptada: baja lógica y recarga.
    const aceptado = aceptarConfirmacion();
    lista.deactivate(AUDITORIAS_DATA[0]);

    const baja = http.expectOne(`${AUDITORIAS}/1/deactivate`);
    expect(baja.request.method).toBe('PATCH');
    baja.flush({ message: 'Project audit deactivated (logical delete)' });
    responderCarga(AUDITORIAS_DATA.slice(1));

    // Aceptada: baja física y recarga.
    lista.remove(AUDITORIAS_DATA[1]);

    const borrado = http.expectOne(`${AUDITORIAS}/2`);
    expect(borrado.request.method).toBe('DELETE');
    borrado.flush({ message: 'Project audit deleted' });
    responderCarga(AUDITORIAS_DATA.slice(2));

    aceptado.mockRestore();
  });

  it('should keep the dialog open and show a toast when saving fails', async () => {
    const { lista } = await crearLista();
    const add = vi.spyOn(TestBed.inject(MessageService), 'add');

    lista.openCreate();
    lista.save(NUEVA);

    http
      .expectOne(AUDITORIAS)
      .flush(
        { error: 'El proyecto indicado no está activo' },
        { status: 400, statusText: 'Bad Request' },
      );

    expect(lista.dialogVisible()).toBe(true);
    expect(lista.saving()).toBe(false);
    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'error', summary: 'No se pudo guardar' }),
    );
  });
});
