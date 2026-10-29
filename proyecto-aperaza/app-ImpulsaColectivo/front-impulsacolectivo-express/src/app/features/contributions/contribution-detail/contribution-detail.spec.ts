import { TestBed } from '@angular/core/testing';
import { Commission } from '../../../core/models/commission.model';
import { Contribution } from '../../../core/models/contribution.model';
import { PaymentTransaction } from '../../../core/models/payment-transaction.model';
import { Refund } from '../../../core/models/refund.model';
import { ContributionDetail } from './contribution-detail';

const CONTRIBUCION: Contribution = {
  id: 1,
  amount: '250000.00',
  contribution_date: '2026-10-05',
  project_id: 1,
  contributor_id: 1,
  status: 'active',
};

// Montos como texto, igual que en el backend real. El pago #2 está inactivo.
const PAGOS: PaymentTransaction[] = [
  {
    id: 1,
    reference: 'NQ-2026-0001',
    payment_method: 'nequi',
    amount: '150000.00',
    transaction_date: '2026-10-06',
    contribution_id: 1,
    status: 'active',
  },
  {
    id: 2,
    reference: 'TR-2026-0002',
    payment_method: 'transferencia',
    amount: '50000.00',
    transaction_date: '2026-10-08',
    contribution_id: 1,
    status: 'inactive',
  },
];

const COMISIONES: Commission[] = [
  {
    id: 1,
    percentage: '2.95',
    amount: '4425.00',
    calculation_date: '2026-10-07',
    payment_transaction_id: 1,
    status: 'active',
  },
  {
    id: 2,
    percentage: '5.00',
    amount: '2500.00',
    calculation_date: '2026-10-09',
    payment_transaction_id: 2,
    status: 'inactive',
  },
];

const REEMBOLSOS: Refund[] = [
  {
    id: 1,
    amount: '20000.00',
    reason: 'Aporte duplicado',
    refund_date: '2026-10-10',
    contribution_id: 1,
    status: 'active',
  },
];

describe('ContributionDetail', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ContributionDetail] }).compileComponents();
  });

  async function crearDetalle(
    datos: {
      payments?: PaymentTransaction[];
      commissions?: Commission[];
      refunds?: Refund[];
    } = {},
  ) {
    const fixture = TestBed.createComponent(ContributionDetail);
    fixture.componentRef.setInput('contribution', CONTRIBUCION);
    fixture.componentRef.setInput('projectTitle', 'Biblioteca comunitaria Riohacha');
    fixture.componentRef.setInput('contributorName', 'María Fernanda Ortiz');
    fixture.componentRef.setInput('payments', datos.payments ?? PAGOS);
    fixture.componentRef.setInput('commissions', datos.commissions ?? COMISIONES);
    fixture.componentRef.setInput('refunds', datos.refunds ?? REEMBOLSOS);
    await fixture.whenStable();

    return {
      fixture,
      detalle: fixture.componentInstance,
      compilado: fixture.nativeElement as HTMLElement,
    };
  }

  it('should add up only the active records', async () => {
    const { detalle } = await crearDetalle();

    expect(detalle.amount()).toBe(250000);
    expect(detalle.paid()).toBe(150000); // el pago inactivo no cuenta
    expect(detalle.commissionTotal()).toBe(4425);
    expect(detalle.refunded()).toBe(20000);
    expect(detalle.pending()).toBe(100000);
  });

  it('should never show a negative pending amount', async () => {
    const { detalle } = await crearDetalle({
      payments: [{ ...PAGOS[0], amount: '300000.00' }],
    });

    expect(detalle.pending()).toBe(0);
  });

  it('should recalculate when the payments input changes', async () => {
    const { fixture, detalle } = await crearDetalle();

    fixture.componentRef.setInput('payments', []);
    await fixture.whenStable();

    expect(detalle.paid()).toBe(0);
    expect(detalle.pending()).toBe(250000);
  });

  it('should render the header and every list', async () => {
    const { compilado } = await crearDetalle();
    const texto = compilado.textContent ?? '';

    expect(texto).toContain('Biblioteca comunitaria Riohacha');
    expect(texto).toContain('María Fernanda Ortiz');
    expect(texto).toContain('NQ-2026-0001');
    expect(texto).toContain('Aporte duplicado');
    expect(texto).toContain('Pagos (2)');
  });

  it('should show a message for each empty list', async () => {
    const { compilado } = await crearDetalle({ payments: [], commissions: [], refunds: [] });
    const texto = compilado.textContent ?? '';

    expect(texto).toContain('Este aporte aún no tiene pagos.');
    expect(texto).toContain('Sin comisiones registradas.');
    expect(texto).toContain('Sin reembolsos.');
  });

  it('should name the payment of each commission and fall back when unknown', async () => {
    const { detalle } = await crearDetalle();

    expect(detalle.paymentReference()(1)).toBe('NQ-2026-0001');
    expect(detalle.paymentReference()(99)).toBe('Pago #99');
  });
});
