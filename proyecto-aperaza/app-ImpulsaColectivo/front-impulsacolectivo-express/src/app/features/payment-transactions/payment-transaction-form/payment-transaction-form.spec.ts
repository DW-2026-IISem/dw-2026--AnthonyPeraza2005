import { TestBed } from '@angular/core/testing';
import {
  PaymentTransaction,
  PaymentTransactionPayload,
} from '../../../core/models/payment-transaction.model';
import { todayIso, toIsoDate } from '../../../core/utils/iso-date';
import { PaymentTransactionForm } from './payment-transaction-form';

const OPCIONES = [{ id: 1, label: '#1 · Biblioteca comunitaria Riohacha · María Fernanda Ortiz' }];

// El backend manda el monto como texto: así se prueba la conversión.
const PAGO: PaymentTransaction = {
  id: 1,
  reference: 'NQ-2026-0001',
  payment_method: 'nequi',
  amount: '250000.00',
  transaction_date: '2026-11-01',
  contribution_id: 1,
  status: 'active',
};

describe('PaymentTransactionForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PaymentTransactionForm] }).compileComponents();
  });

  async function crearForm(payment: PaymentTransaction | null = null) {
    const fixture = TestBed.createComponent(PaymentTransactionForm);
    fixture.componentRef.setInput('payment', payment);
    fixture.componentRef.setInput('contributions', OPCIONES);
    await fixture.whenStable();

    const formulario = fixture.componentInstance;
    const emitidos: PaymentTransactionPayload[] = [];
    formulario.saved.subscribe((payload) => emitidos.push(payload));

    return { fixture, formulario, emitidos, compilado: fixture.nativeElement as HTMLElement };
  }

  it('should start empty, dated today and active in create mode', async () => {
    const { formulario } = await crearForm();
    const valor = formulario.form.getRawValue();

    expect(valor.reference).toBe('');
    expect(valor.amount).toBeNull();
    expect(valor.contribution_id).toBeNull();
    expect(valor.status).toBe('active');
    expect(toIsoDate(valor.transaction_date as Date)).toBe(todayIso());
    expect(formulario.form.controls.status.enabled).toBe(true);
  });

  it('should not emit and should mark fields as touched when required fields are empty', async () => {
    const { formulario, emitidos } = await crearForm();

    formulario.submit();

    expect(emitidos).toEqual([]);
    expect(formulario.form.controls.reference.touched).toBe(true);
    expect(formulario.form.controls.contribution_id.touched).toBe(true);
  });

  it('should reject an amount of zero', async () => {
    const { formulario, emitidos } = await crearForm();

    formulario.form.patchValue({
      reference: 'NQ-2026-0009',
      payment_method: 'nequi',
      amount: 0,
      contribution_id: 1,
    });
    formulario.submit();

    expect(formulario.form.controls.amount.invalid).toBe(true);
    expect(emitidos).toEqual([]);
  });

  it('should emit a trimmed payload with ISO date, numeric ids and status when creating', async () => {
    const { formulario, emitidos } = await crearForm();

    formulario.form.patchValue({
      reference: '  NQ-2026-0004  ',
      payment_method: 'nequi',
      amount: 120000,
      transaction_date: new Date(2026, 9, 28),
      contribution_id: 1,
    });
    formulario.submit();

    expect(emitidos).toEqual([
      {
        reference: 'NQ-2026-0004',
        payment_method: 'nequi',
        amount: 120000,
        transaction_date: '2026-10-28',
        contribution_id: 1,
        status: 'active',
      },
    ]);
    expect(typeof emitidos[0].amount).toBe('number');
    expect(typeof emitidos[0].contribution_id).toBe('number');
  });

  it('should load the payment, convert the amount, disable status and send no status when editing', async () => {
    const { formulario, emitidos } = await crearForm(PAGO);

    expect(formulario.form.controls.amount.value).toBe(250000); // número, no "250000.00"
    expect(formulario.form.controls.transaction_date.value?.getDate()).toBe(1);
    expect(formulario.form.controls.status.disabled).toBe(true);

    formulario.submit();

    expect(emitidos).toEqual([
      {
        reference: 'NQ-2026-0001',
        payment_method: 'nequi',
        amount: 250000,
        transaction_date: '2026-11-01',
        contribution_id: 1,
      },
    ]);
    expect('status' in emitidos[0]).toBe(false);
  });

  it('should clear the form when resetKey changes even if payment stays null', async () => {
    const { fixture, formulario } = await crearForm();

    formulario.form.patchValue({ reference: 'BORRADOR' });
    fixture.componentRef.setInput('resetKey', 1);
    await fixture.whenStable();

    expect(formulario.form.controls.reference.value).toBe('');
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
