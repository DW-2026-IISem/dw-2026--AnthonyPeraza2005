import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { Status } from '../../../core/models/api.model';
import { Disbursement, DisbursementPayload } from '../../../core/models/disbursement.model';
import { Project } from '../../../core/models/project.model';
import { fromIsoDate, todayIso, toIsoDate } from '../../../core/utils/iso-date';

/**
 * Formulario de desembolso, reutilizado para crear y editar.
 *
 * No llama a la API: recibe `disbursement` (o `null` para crear) y los proyectos
 * que puede elegir, y emite el payload con `saved`.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-disbursement-form',
  imports: [
    ButtonModule,
    DatePickerModule,
    InputNumberModule,
    MessageModule,
    ReactiveFormsModule,
    SelectModule,
  ],
  templateUrl: './disbursement-form.html',
  styleUrl: './disbursement-form.css',
})
export class DisbursementForm {
  /** Desembolso a editar. `null` deja el formulario en modo creación. */
  readonly disbursement = input<Disbursement | null>(null);

  /** Proyectos elegibles (el padre ya filtró los activos). */
  readonly projects = input<Project[]>([]);

  /** Llave para reiniciar el formulario al reabrir «Nuevo desembolso». */
  readonly resetKey = input(0);

  readonly saving = input(false);

  readonly saved = output<DisbursementPayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  /** Sugerencias: el select es editable, así que también admite texto libre. */
  readonly methodOptions = [
    'Transferencia bancaria',
    'Consignación',
    'Nequi',
    'Daviplata',
    'Efectivo',
  ];

  readonly statusOptions = [
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' },
  ];

  readonly form = this.fb.group({
    project_id: [null as number | null, [Validators.required]],
    amount: [null as number | null, [Validators.required, Validators.min(1)]],
    disbursement_date: [null as Date | null, [Validators.required]],
    method: ['', [Validators.required]],
    status: ['active' as Status, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const current = this.disbursement();
      this.resetKey(); // reabrir el diálogo debe vaciar el formulario

      this.form.reset({
        project_id: current?.project_id ?? null,
        // El backend manda el monto como texto ("3000000.00"): se convierte a número.
        amount: current ? Number(current.amount) : null,
        // Fecha local (no UTC): al crear arranca en hoy.
        disbursement_date: fromIsoDate(current?.disbursement_date ?? todayIso()),
        method: current?.method ?? '',
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
      value.project_id === null ||
      value.disbursement_date === null
    ) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: DisbursementPayload = {
      amount: value.amount,
      disbursement_date: toIsoDate(value.disbursement_date),
      method: value.method.trim(),
      project_id: value.project_id,
    };

    // `status` solo se envía al crear: en edición lo gobierna /deactivate.
    this.saved.emit(this.disbursement() ? payload : { ...payload, status: value.status });
  }
}
