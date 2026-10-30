import { TestBed } from '@angular/core/testing';
import { Project } from '../../../core/models/project.model';
import { Reward, RewardPayload } from '../../../core/models/reward.model';
import { RewardForm } from './reward-form';

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
const RECOMPENSA: Reward = {
  id: 1,
  title: 'Mención en el muro de aliados',
  description: 'Tu nombre en el muro de la biblioteca',
  min_amount: '20000.00',
  project_id: 1,
  status: 'active',
};

describe('RewardForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [RewardForm] }).compileComponents();
  });

  async function crearForm(reward: Reward | null = null) {
    const fixture = TestBed.createComponent(RewardForm);
    fixture.componentRef.setInput('reward', reward);
    fixture.componentRef.setInput('projects', [PROYECTO]);
    await fixture.whenStable();

    const formulario = fixture.componentInstance;
    const emitidos: RewardPayload[] = [];
    formulario.saved.subscribe((payload) => emitidos.push(payload));

    return { fixture, formulario, emitidos, compilado: fixture.nativeElement as HTMLElement };
  }

  it('should start empty and active in create mode', async () => {
    const { formulario } = await crearForm();

    expect(formulario.form.getRawValue()).toEqual({
      title: '',
      description: '',
      min_amount: null,
      project_id: null,
      status: 'active',
    });
    expect(formulario.form.controls.status.enabled).toBe(true);
  });

  it('should not emit and should mark fields as touched when required fields are empty', async () => {
    const { formulario, emitidos } = await crearForm();

    formulario.submit();

    expect(emitidos).toEqual([]);
    expect(formulario.form.controls.title.touched).toBe(true);
    expect(formulario.form.controls.project_id.touched).toBe(true);
  });

  it('should reject a minimum amount of zero', async () => {
    const { formulario, emitidos } = await crearForm();

    formulario.form.patchValue({
      title: 'Kit de semillas nativas',
      description: 'Semillas para tu propia huerta',
      min_amount: 0,
      project_id: 1,
    });
    formulario.submit();

    expect(formulario.form.controls.min_amount.invalid).toBe(true);
    expect(emitidos).toEqual([]);
  });

  it('should emit a trimmed payload with numeric values and status when creating', async () => {
    const { formulario, emitidos } = await crearForm();

    formulario.form.patchValue({
      title: '  Kit de semillas nativas  ',
      description: '  Semillas para tu propia huerta  ',
      min_amount: 50000,
      project_id: 1,
    });
    formulario.submit();

    expect(emitidos).toEqual([
      {
        title: 'Kit de semillas nativas',
        description: 'Semillas para tu propia huerta',
        min_amount: 50000,
        project_id: 1,
        status: 'active',
      },
    ]);
    expect(typeof emitidos[0].min_amount).toBe('number');
    expect(typeof emitidos[0].project_id).toBe('number');
  });

  it('should load the reward, convert the amount, disable status and send no status when editing', async () => {
    const { formulario, emitidos } = await crearForm(RECOMPENSA);

    expect(formulario.form.controls.min_amount.value).toBe(20000); // número, no "20000.00"
    expect(formulario.form.controls.status.disabled).toBe(true);

    formulario.submit();

    expect(emitidos).toEqual([
      {
        title: 'Mención en el muro de aliados',
        description: 'Tu nombre en el muro de la biblioteca',
        min_amount: 20000,
        project_id: 1,
      },
    ]);
    expect('status' in emitidos[0]).toBe(false);
  });

  it('should clear the form when resetKey changes even if reward stays null', async () => {
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
