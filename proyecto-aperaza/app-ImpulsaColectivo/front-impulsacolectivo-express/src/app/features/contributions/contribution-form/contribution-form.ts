import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { Status } from '../../../core/models/api.model';
import { Contribution, ContributionPayload } from '../../../core/models/contribution.model';
import { Contributor } from '../../../core/models/contributor.model';
import { Project } from '../../../core/models/project.model';
import { fromIsoDate, toIsoDate } from '../../../core/utils/iso-date';

/**
 * Formulario de contribución, reutilizado para crear y editar.
 *
 * No llama a la API: recibe `contribution` (o `null` para crear) y las listas
 * de proyectos y contribuyentes elegibles, y emite el payload con `saved`.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-contribution-form',
  imports: [
    ButtonModule,
    DatePickerModule,
    InputNumberModule,
    MessageModule,
    ReactiveFormsModule,
    SelectModule,
  ],
  templateUrl: './contribution-form.html',
  styleUrl: './contribution-form.css',
})
export class ContributionForm {
  /** Contribución a editar. `null` deja el formulario en modo creación. */
  readonly contribution = input<Contribution | null>(null);

  /** Proyectos elegibles (el padre ya filtró los activos). */
  readonly projects = input<Project[]>([]);

  /** Contribuyentes elegibles (el padre ya filtró los activos). */
  readonly contributors = input<Contributor[]>([]);

  /** Llave para reiniciar el formulario al reabrir «Nueva contribución». */
  readonly resetKey = input(0);

  readonly saving = input(false);

  readonly saved = output<ContributionPayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly statusOptions = [
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' },
  ];

  readonly form = this.fb.group({
    amount: [null as number | null, [Validators.required, Validators.min(1)]],
    contribution_date: [null as Date | null, [Validators.required]],
    project_id: [null as number | null, [Validators.required]],
    contributor_id: [null as number | null, [Validators.required]],
    // Activa por defecto: una contribución inactiva no puede recibir pagos.
    status: ['active' as Status, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const current = this.contribution();
      this.resetKey(); // reabrir el diálogo debe vaciar el formulario

      this.form.reset({
        // El backend manda el monto como texto ("250000.00"): se convierte a número.
        amount: current ? Number(current.amount) : null,
        contribution_date: current ? fromIsoDate(current.contribution_date) : new Date(),
        project_id: current?.project_id ?? null,
        contributor_id: current?.contributor_id ?? null,
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
      !value.contribution_date ||
      value.project_id === null ||
      value.contributor_id === null
    ) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: ContributionPayload = {
      amount: value.amount,
      contribution_date: toIsoDate(value.contribution_date),
      project_id: value.project_id,
      contributor_id: value.contributor_id,
    };

    // `status` solo se envía al crear: en edición lo gobierna /deactivate.
    this.saved.emit(this.contribution() ? payload : { ...payload, status: value.status });
  }
}
