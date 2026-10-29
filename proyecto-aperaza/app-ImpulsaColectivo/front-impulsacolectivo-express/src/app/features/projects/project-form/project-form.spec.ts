import { TestBed } from '@angular/core/testing';
import { Project, ProjectPayload } from '../../../core/models/project.model';
import { Promoter } from '../../../core/models/promoter.model';
import { ProjectForm } from './project-form';

const PROMOTOR: Promoter = {
  id: 1,
  name: 'Fundación Semillas del Caribe',
  description: null,
  contact_email: 'contacto@semillas.org',
  contact_phone: null,
  status: 'active',
};

const PROYECTO: Project = {
  id: 1,
  title: 'Biblioteca comunitaria Riohacha',
  description: 'Dotar de libros y mobiliario a una biblioteca barrial',
  start_date: '2026-11-01',
  end_date: '2027-02-28',
  promoter_id: 1,
  status: 'active',
};

describe('ProjectForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ProjectForm] }).compileComponents();
  });

  async function crearForm(project: Project | null = null) {
    const fixture = TestBed.createComponent(ProjectForm);
    fixture.componentRef.setInput('project', project);
    fixture.componentRef.setInput('promoters', [PROMOTOR]);
    await fixture.whenStable();

    const formulario = fixture.componentInstance;
    const emitidos: ProjectPayload[] = [];
    formulario.saved.subscribe((payload) => emitidos.push(payload));

    return { fixture, formulario, emitidos, compilado: fixture.nativeElement as HTMLElement };
  }

  it('should start empty and active in create mode', async () => {
    const { formulario } = await crearForm();

    expect(formulario.form.getRawValue()).toEqual({
      title: '',
      description: '',
      start_date: null,
      end_date: null,
      promoter_id: null,
      status: 'active',
    });
    expect(formulario.form.controls.status.enabled).toBe(true);
  });

  it('should not emit and should mark fields as touched when required fields are empty', async () => {
    const { formulario, emitidos } = await crearForm();

    formulario.submit();

    expect(emitidos).toEqual([]);
    expect(formulario.form.controls.title.touched).toBe(true);
    expect(formulario.form.controls.promoter_id.touched).toBe(true);
  });

  it('should reject an end date earlier than the start date', async () => {
    const { formulario, emitidos } = await crearForm();

    formulario.form.patchValue({
      title: 'Huerta escolar Uribia',
      description: 'Huerta para el comedor de una escuela rural',
      start_date: new Date(2026, 11, 1),
      end_date: new Date(2026, 10, 1),
      promoter_id: 1,
    });
    formulario.submit();

    expect(formulario.form.hasError('dateRange')).toBe(true);
    expect(emitidos).toEqual([]);
  });

  it('should emit a payload with ISO dates, a numeric promoter and status when creating', async () => {
    const { formulario, emitidos } = await crearForm();

    formulario.form.patchValue({
      title: '  Biblioteca comunitaria Riohacha  ',
      description: 'Dotar de libros y mobiliario a una biblioteca barrial',
      start_date: new Date(2026, 10, 1),
      end_date: new Date(2027, 1, 28),
      promoter_id: 1,
    });
    formulario.submit();

    expect(emitidos).toEqual([
      {
        title: 'Biblioteca comunitaria Riohacha',
        description: 'Dotar de libros y mobiliario a una biblioteca barrial',
        start_date: '2026-11-01',
        end_date: '2027-02-28',
        promoter_id: 1,
        status: 'active',
      },
    ]);
    expect(typeof emitidos[0].promoter_id).toBe('number');
  });

  it('should load the project, disable status and send no status when editing', async () => {
    const { formulario, emitidos } = await crearForm(PROYECTO);

    expect(formulario.form.controls.title.value).toBe('Biblioteca comunitaria Riohacha');
    expect(formulario.form.controls.start_date.value?.getDate()).toBe(1); // no 31 de octubre
    expect(formulario.form.controls.status.disabled).toBe(true);

    formulario.submit();

    expect(emitidos).toEqual([
      {
        title: 'Biblioteca comunitaria Riohacha',
        description: 'Dotar de libros y mobiliario a una biblioteca barrial',
        start_date: '2026-11-01',
        end_date: '2027-02-28',
        promoter_id: 1,
      },
    ]);
    expect('status' in emitidos[0]).toBe(false);
  });

  it('should clear the form when resetKey changes even if project stays null', async () => {
    const { fixture, formulario } = await crearForm();

    formulario.form.patchValue({ title: 'Borrador sin guardar' });
    fixture.componentRef.setInput('resetKey', 1);
    await fixture.whenStable();

    expect(formulario.form.controls.title.value).toBe('');
  });

  it('should emit cancelled when Cancelar is pressed', async () => {
    const { formulario, compilado } = await crearForm();
    let cancelado = 0;
    formulario.cancelled.subscribe(() => cancelado++);

    const boton = [...compilado.querySelectorAll('button')].find((b) =>
      b.textContent?.includes('Cancelar'),
    ) as HTMLButtonElement;
    boton.click();

    expect(cancelado).toBe(1);
  });
});
