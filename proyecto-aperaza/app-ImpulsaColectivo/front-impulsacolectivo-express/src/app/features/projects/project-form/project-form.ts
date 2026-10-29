import { Component, effect, inject, input, output } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Status } from '../../../core/models/api.model';
import { Project, ProjectPayload } from '../../../core/models/project.model';
import { Promoter } from '../../../core/models/promoter.model';
import { fromIsoDate, toIsoDate } from '../../../core/utils/iso-date';

/** La fecha de fin no puede ser anterior a la de inicio (regla entre dos campos). */
const dateRange: ValidatorFn = (group) => {
  const start = group.get('start_date')?.value as Date | null;
  const end = group.get('end_date')?.value as Date | null;
  return start && end && end < start ? { dateRange: true } : null;
};

/**
 * Formulario de proyecto, reutilizado para crear y editar.
 *
 * No llama a la API: recibe `project` (o `null` para crear) y los promotores
 * que puede elegir, y emite el payload con `saved`.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-project-form',
  imports: [
    ButtonModule,
    DatePickerModule,
    InputTextModule,
    MessageModule,
    ReactiveFormsModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: './project-form.html',
  styleUrl: './project-form.css',
})
export class ProjectForm {
  /** Proyecto a editar. `null` deja el formulario en modo creación. */
  readonly project = input<Project | null>(null);

  /** Promotores entre los que se puede elegir (el padre ya filtró los activos). */
  readonly promoters = input<Promoter[]>([]);

  /** Llave para reiniciar el formulario al reabrir «Nuevo proyecto». */
  readonly resetKey = input(0);

  readonly saving = input(false);

  readonly saved = output<ProjectPayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly statusOptions = [
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' },
  ];

  readonly form = this.fb.group(
    {
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.required]],
      start_date: [null as Date | null, [Validators.required]],
      end_date: [null as Date | null, [Validators.required]],
      promoter_id: [null as number | null, [Validators.required]],
      status: ['active' as Status, [Validators.required]],
    },
    { validators: [dateRange] },
  );

  constructor() {
    effect(() => {
      const current = this.project();
      this.resetKey(); // reabrir el diálogo debe vaciar el formulario

      this.form.reset({
        title: current?.title ?? '',
        description: current?.description ?? '',
        start_date: current ? fromIsoDate(current.start_date) : null,
        end_date: current ? fromIsoDate(current.end_date) : null,
        promoter_id: current?.promoter_id ?? null,
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

    if (this.form.invalid || !value.start_date || !value.end_date || value.promoter_id === null) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: ProjectPayload = {
      title: value.title.trim(),
      description: value.description.trim(),
      start_date: toIsoDate(value.start_date),
      end_date: toIsoDate(value.end_date),
      promoter_id: value.promoter_id,
    };

    // `status` solo se envía al crear: en edición lo gobierna /deactivate.
    this.saved.emit(this.project() ? payload : { ...payload, status: value.status });
  }
}
