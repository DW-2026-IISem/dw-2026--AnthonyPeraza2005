import { TestBed } from '@angular/core/testing';
import { Contribution, ContributionPayload } from '../../../core/models/contribution.model';
import { Contributor } from '../../../core/models/contributor.model';
import { Project } from '../../../core/models/project.model';
import { todayIso, toIsoDate } from '../../../core/utils/iso-date';
import { ContributionForm } from './contribution-form';

const PROYECTO: Project = {
  id: 1,
  title: 'Biblioteca comunitaria Riohacha',
  description: 'Dotar de libros y mobiliario a una biblioteca barrial',
  start_date: '2026-10-01',
  end_date: '2027-02-28',
  promoter_id: 1,
  status: 'active',
};

const CONTRIBUYENTE: Contributor = {
  id: 2,
  name: 'María Fernanda Ortiz',
  email: 'maria.ortiz@example.com',
  phone: null,
  status: 'active',
};

// El backend manda el monto como texto: así se prueba la conversión.
const CONTRIBUCION: Contribution = {
  id: 1,
  amount: '250000.00',
  contribution_date: '2026-11-01',
  project_id: 1,
  contributor_id: 2,
  status: 'active',
};

describe('ContributionForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ContributionForm] }).compileComponents();
  });

  async function crearForm(contribution: Contribution | null = null) {
    const fixture = TestBed.createComponent(ContributionForm);
    fixture.componentRef.setInput('contribution', contribution);
    fixture.componentRef.setInput('projects', [PROYECTO]);
    fixture.componentRef.setInput('contributors', [CONTRIBUYENTE]);
    await fixture.whenStable();

    const formulario = fixture.componentInstance;
    const emitidos: ContributionPayload[] = [];
    formulario.saved.subscribe((payload) => emitidos.push(payload));

    return { fixture, formulario, emitidos, compilado: fixture.nativeElement as HTMLElement };
  }

  it('should start empty, dated today and active in create mode', async () => {
    const { formulario } = await crearForm();
    const valor = formulario.form.getRawValue();

    expect(valor.amount).toBeNull();
    expect(valor.project_id).toBeNull();
    expect(valor.contributor_id).toBeNull();
    expect(valor.status).toBe('active');
    expect(toIsoDate(valor.contribution_date as Date)).toBe(todayIso());
    expect(formulario.form.controls.status.enabled).toBe(true);
  });

  it('should not emit and should mark fields as touched when required fields are empty', async () => {
    const { formulario, emitidos } = await crearForm();

    formulario.submit();

    expect(emitidos).toEqual([]);
    expect(formulario.form.controls.amount.touched).toBe(true);
    expect(formulario.form.controls.project_id.touched).toBe(true);
    expect(formulario.form.controls.contributor_id.touched).toBe(true);
  });

  it('should reject an amount of zero', async () => {
    const { formulario, emitidos } = await crearForm();

    formulario.form.patchValue({ amount: 0, project_id: 1, contributor_id: 2 });
    formulario.submit();

    expect(formulario.form.controls.amount.invalid).toBe(true);
    expect(emitidos).toEqual([]);
  });

  it('should emit numeric ids, a numeric amount, an ISO date and status when creating', async () => {
    const { formulario, emitidos } = await crearForm();

    formulario.form.patchValue({
      amount: 250000,
      contribution_date: new Date(2026, 9, 5),
      project_id: 1,
      contributor_id: 2,
    });
    formulario.submit();

    expect(emitidos).toEqual([
      {
        amount: 250000,
        contribution_date: '2026-10-05',
        project_id: 1,
        contributor_id: 2,
        status: 'active',
      },
    ]);
    expect(typeof emitidos[0].amount).toBe('number');
    expect(typeof emitidos[0].project_id).toBe('number');
  });

  it('should load the contribution, convert the amount, disable status and send no status when editing', async () => {
    const { formulario, emitidos } = await crearForm(CONTRIBUCION);

    expect(formulario.form.controls.amount.value).toBe(250000); // número, no "250000.00"
    expect(formulario.form.controls.contribution_date.value?.getDate()).toBe(1);
    expect(formulario.form.controls.status.disabled).toBe(true);

    formulario.submit();

    expect(emitidos).toEqual([
      {
        amount: 250000,
        contribution_date: '2026-11-01',
        project_id: 1,
        contributor_id: 2,
      },
    ]);
    expect('status' in emitidos[0]).toBe(false);
  });

  it('should clear the form when resetKey changes even if contribution stays null', async () => {
    const { fixture, formulario } = await crearForm();

    formulario.form.patchValue({ amount: 99999 });
    fixture.componentRef.setInput('resetKey', 1);
    await fixture.whenStable();

    expect(formulario.form.controls.amount.value).toBeNull();
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
