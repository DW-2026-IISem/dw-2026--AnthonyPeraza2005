import { TestBed } from '@angular/core/testing';
import { Disbursement, DisbursementPayload } from '../../../core/models/disbursement.model';
import { Project } from '../../../core/models/project.model';
import { todayIso, toIsoDate } from '../../../core/utils/iso-date';
import { DisbursementForm } from './disbursement-form';

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
const DESEMBOLSO: Disbursement = {
  id: 1,
  amount: '3000000.00',
  disbursement_date: '2026-10-15',
  method: 'Transferencia bancaria',
  project_id: 1,
  status: 'active',
};

describe('DisbursementForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DisbursementForm] }).compileComponents();
  });

  async function crearForm(disbursement: Disbursement | null = null) {
    const fixture = TestBed.createComponent(DisbursementForm);
    fixture.componentRef.setInput('disbursement', disbursement);
    fixture.componentRef.setInput('projects', [PROYECTO]);
    await fixture.whenStable();

    const formulario = fixture.componentInstance;
    const emitidos: DisbursementPayload[] = [];
    formulario.saved.subscribe((payload) => emitidos.push(payload));

    return { fixture, formulario, emitidos, compilado: fixture.nativeElement as HTMLElement };
  }

  it('should start in create mode with today as date and active status', async () => {
    const { formulario } = await crearForm();
    const valor = formulario.form.getRawValue();

    expect(valor.project_id).toBeNull();
    expect(valor.amount).toBeNull();
    expect(valor.method).toBe('');
    expect(valor.status).toBe('active');
    expect(toIsoDate(valor.disbursement_date as Date)).toBe(todayIso());
    expect(formulario.form.controls.status.enabled).toBe(true);
  });

  it('should not emit and should mark fields as touched when required fields are empty', async () => {
    const { formulario, emitidos } = await crearForm();

    formulario.submit();

    expect(emitidos).toEqual([]);
    expect(formulario.form.controls.project_id.touched).toBe(true);
    expect(formulario.form.controls.method.touched).toBe(true);
  });

  it('should reject an amount of zero', async () => {
    const { formulario, emitidos } = await crearForm();

    formulario.form.patchValue({ project_id: 1, amount: 0, method: 'Nequi' });
    formulario.submit();

    expect(formulario.form.controls.amount.invalid).toBe(true);
    expect(emitidos).toEqual([]);
  });

  it('should emit a payload with numeric values, an ISO date and status when creating', async () => {
    const { formulario, emitidos } = await crearForm();

    formulario.form.patchValue({
      project_id: 1,
      amount: 1500000,
      disbursement_date: new Date(2026, 9, 20), // 20/oct/2026, hora local
      method: '  Nequi  ',
    });
    formulario.submit();

    expect(emitidos).toEqual([
      {
        amount: 1500000,
        disbursement_date: '2026-10-20', // sin desfase por zona horaria
        method: 'Nequi',
        project_id: 1,
        status: 'active',
      },
    ]);
    expect(typeof emitidos[0].amount).toBe('number');
  });

  it('should load the disbursement, convert the amount, disable status and send no status when editing', async () => {
    const { formulario, emitidos } = await crearForm(DESEMBOLSO);

    expect(formulario.form.controls.amount.value).toBe(3000000); // número, no texto
    expect(formulario.form.controls.status.disabled).toBe(true);

    formulario.submit();

    expect(emitidos).toEqual([
      {
        amount: 3000000,
        disbursement_date: '2026-10-15',
        method: 'Transferencia bancaria',
        project_id: 1,
      },
    ]);
    expect('status' in emitidos[0]).toBe(false);
  });

  it('should clear the form when resetKey changes even if disbursement stays null', async () => {
    const { fixture, formulario } = await crearForm();

    formulario.form.patchValue({ method: 'Borrador sin guardar' });
    fixture.componentRef.setInput('resetKey', 1);
    await fixture.whenStable();

    expect(formulario.form.controls.method.value).toBe('');
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
