import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { Status } from '../../../core/models/api.model';
import {
  PaymentTransaction,
  PaymentTransactionPayload,
} from '../../../core/models/payment-transaction.model';
import { fromIsoDate, toIsoDate } from '../../../core/utils/iso-date';

/** Opción del selector de contribución: el padre arma la etiqueta. */
export interface ContributionOption {
  id: number;
  label: string;
}

/**
 * Formulario de pago, reutilizado para crear y editar.
 *
 * No llama a la API: recibe `payment` (o `null` para crear) y las
 * contribuciones elegibles, y emite el payload con `saved`.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-payment-transaction-form',
  imports: [
    ButtonModule,
    DatePickerModule,
    InputNumberModule,
    InputTextModule,
    MessageModule,
    ReactiveFormsModule,
    SelectModule,
  ],
  templateUrl: './payment-transaction-form.html',
  styleUrl: './payment-transaction-form.css',
})
export class PaymentTransactionForm {
  /** Pago a editar. `null` deja el formulario en modo creación. */
  readonly payment = input<PaymentTransaction | null>(null);

  /** Contribuciones entre las que se puede elegir (el padre ya filtró las activas). */
  readonly contributions = input<ContributionOption[]>([]);

  /** Llave para reiniciar el formulario al reabrir «Nuevo pago». */
  readonly resetKey = input(0);

  readonly saving = input(false);

  readonly saved = output<PaymentTransactionPayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  /** Sugerencias: el campo es editable y acepta cualquier otro texto. */
  readonly methodOptions = ['nequi', 'transferencia', 'tarjeta', 'efectivo'];

  readonly statusOptions = [
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' },
  ];

  readonly form = this.fb.group({
    reference: ['', [Validators.required, Validators.maxLength(100)]],
    payment_method: ['', [Validators.required, Validators.maxLength(50)]],
    amount: [null as number | null, [Validators.required, Validators.min(1)]],
    transaction_date: [null as Date | null, [Validators.required]],
    contribution_id: [null as number | null, [Validators.required]],
    // Activo por defecto: un pago inactivo no puede recibir comisiones.
    status: ['active' as Status, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const current = this.payment();
      this.resetKey(); // reabrir el diálogo debe vaciar el formulario

      this.form.reset({
        reference: current?.reference ?? '',
        payment_method: current?.payment_method ?? '',
        // El backend manda el monto como texto ("250000.00"): se convierte a número.
        amount: current ? Number(current.amount) : null,
        transaction_date: current ? fromIsoDate(current.transaction_date) : new Date(),
        contribution_id: current?.contribution_id ?? null,
        status: current?.status ?? 'active',
      });

      // PATCH no acepta `status`: el estado solo cambia con /deactivate.
      if (current) {
        this.form.controls.status.disable();
      } else {
        this.form.controls.status.enable();
      }
    });
  }

  submit(): void {
    const value = this.form.getRawValue();

    if (
      this.form.invalid ||
      value.amount === null ||
      !value.transaction_date ||
      value.contribution_id === null
    ) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: PaymentTransactionPayload = {
      reference: value.reference.trim(),
      payment_method: value.payment_method.trim(),
      amount: value.amount,
      transaction_date: toIsoDate(value.transaction_date),
      contribution_id: value.contribution_id,
    };

    // `status` solo se envía al crear: en edición lo gobierna /deactivate.
    this.saved.emit(this.payment() ? payload : { ...payload, status: value.status });
  }
}
