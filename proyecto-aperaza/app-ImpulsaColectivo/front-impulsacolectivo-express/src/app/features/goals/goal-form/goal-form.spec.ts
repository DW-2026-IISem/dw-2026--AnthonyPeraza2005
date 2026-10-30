import { TestBed } from '@angular/core/testing';
import { Goal, GoalPayload } from '../../../core/models/goal.model';
import { Project } from '../../../core/models/project.model';
import { GoalForm } from './goal-form';

const PROYECTO: Project = {
  id: 1,
  title: 'Biblioteca comunitaria Riohacha',
  description: 'Dotar de libros y mobiliario a una biblioteca barrial',
  start_date: '2026-10-01',
  end_date: '2027-02-28',
  promoter_id: 1,
  status: 'active',
};

// El backend manda el monto como texto: así se prueba la conversión.
const META: Goal = {
  id: 1,
  description: 'Comprar 500 libros infantiles para la biblioteca',
  target_amount: '5000000.00',
  project_id: 1,
  status: 'active',
};

describe('GoalForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [GoalForm] }).compileComponents();
  });

  async function crearForm(goal: Goal | null = null) {
    const fixture = TestBed.createComponent(GoalForm);
    fixture.componentRef.setInput('goal', goal);
    fixture.componentRef.setInput('projects', [PROYECTO]);
    await fixture.whenStable();

    const formulario = fixture.componentInstance;
    const emitidos: GoalPayload[] = [];
    formulario.saved.subscribe((payload) => emitidos.push(payload));

    return { fixture, formulario, emitidos, compilado: fixture.nativeElement as HTMLElement };
  }

  it('should start empty and active in create mode', async () => {
    const { formulario } = await crearForm();

    expect(formulario.form.getRawValue()).toEqual({
      description: '',
      target_amount: null,
      project_id: null,
      status: 'active',
    });
    expect(formulario.form.controls.status.enabled).toBe(true);
  });

  it('should not emit and should mark fields as touched when required fields are empty', async () => {
    const { formulario, emitidos } = await crearForm();

    formulario.submit();

    expect(emitidos).toEqual([]);
    expect(formulario.form.controls.description.touched).toBe(true);
    expect(formulario.form.controls.project_id.touched).toBe(true);
  });

  it('should reject a target amount of zero', async () => {
    const { formulario, emitidos } = await crearForm();

    formulario.form.patchValue({
      description: 'Instalar el sistema de riego por goteo',
      target_amount: 0,
      project_id: 1,
    });
    formulario.submit();

    expect(formulario.form.controls.target_amount.invalid).toBe(true);
    expect(emitidos).toEqual([]);
  });

  it('should emit a trimmed payload with numeric values and status when creating', async () => {
    const { formulario, emitidos } = await crearForm();

    formulario.form.patchValue({
      description: '  Instalar el sistema de riego por goteo  ',
      target_amount: 3500000,
      project_id: 1,
    });
    formulario.submit();

    expect(emitidos).toEqual([
      {
        description: 'Instalar el sistema de riego por goteo',
        target_amount: 3500000,
        project_id: 1,
        status: 'active',
      },
    ]);
    expect(typeof emitidos[0].target_amount).toBe('number');
    expect(typeof emitidos[0].project_id).toBe('number');
  });

  it('should load the goal, convert the amount, disable status and send no status when editing', async () => {
    const { formulario, emitidos } = await crearForm(META);

    expect(formulario.form.controls.target_amount.value).toBe(5000000); // número, no texto
    expect(formulario.form.controls.status.disabled).toBe(true);

    formulario.submit();

    expect(emitidos).toEqual([
      {
        description: 'Comprar 500 libros infantiles para la biblioteca',
        target_amount: 5000000,
        project_id: 1,
      },
    ]);
    expect('status' in emitidos[0]).toBe(false);
  });

  it('should clear the form when resetKey changes even if goal stays null', async () => {
    const { fixture, formulario } = await crearForm();

    formulario.form.patchValue({ description: 'Borrador sin guardar' });
    fixture.componentRef.setInput('resetKey', 1);
    await fixture.whenStable();

    expect(formulario.form.controls.description.value).toBe('');
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
