import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { Money, Status } from '../../../core/models/api.model';
import { Commission } from '../../../core/models/commission.model';
import { Contribution } from '../../../core/models/contribution.model';
import { PaymentTransaction } from '../../../core/models/payment-transaction.model';
import { Refund } from '../../../core/models/refund.model';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';

/** Suma de los registros activos. El monto llega como texto: se pasa por `Number`. */
function sumActive(items: { amount: Money; status: Status }[]): number {
  return items
    .filter((item) => item.status === 'active')
    .reduce((sum, item) => sum + Number(item.amount), 0);
}

/**
 * Detalle de un aporte: cabecera, totales y sus pagos, comisiones y reembolsos.
 *
 * Es presentacional: no llama a la API. El padre decide qué cargar y cuándo.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-contribution-detail',
  imports: [CurrencyPipe, DatePipe, DecimalPipe, StatusTag],
  templateUrl: './contribution-detail.html',
  styleUrl: './contribution-detail.css',
})
export class ContributionDetail {
  /** `input.required`: el padre no puede olvidar pasar el aporte. */
  readonly contribution = input.required<Contribution>();

  readonly projectTitle = input('');
  readonly contributorName = input('');
  readonly payments = input<PaymentTransaction[]>([]);
  readonly commissions = input<Commission[]>([]);
  readonly refunds = input<Refund[]>([]);

  readonly amount = computed(() => Number(this.contribution().amount));
  readonly paid = computed(() => sumActive(this.payments()));
  readonly commissionTotal = computed(() => sumActive(this.commissions()));
  readonly refunded = computed(() => sumActive(this.refunds()));

  /** Lo que falta por pagar del aporte; nunca baja de cero. */
  readonly pending = computed(() => Math.max(this.amount() - this.paid(), 0));

  /** `id de pago → referencia`, para nombrar el pago de cada comisión. */
  readonly paymentReference = computed(() => {
    const references = new Map(this.payments().map((payment) => [payment.id, payment.reference]));
    return (id: number) => references.get(id) ?? `Pago #${id}`;
  });

  /** La plantilla no puede llamar a `Number`: se convierte aquí. */
  percentage(commission: Commission): number {
    return Number(commission.percentage);
  }
}
