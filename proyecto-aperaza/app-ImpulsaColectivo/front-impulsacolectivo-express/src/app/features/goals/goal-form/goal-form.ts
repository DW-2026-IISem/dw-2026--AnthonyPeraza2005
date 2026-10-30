import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Status } from '../../../core/models/api.model';
import { Goal, GoalPayload } from '../../../core/models/goal.model';
import { Project } from '../../../core/models/project.model';

/**
 * Formulario de meta, reutilizado para crear y editar.
 *
 * No llama a la API: recibe `goal` (o `null` para crear) y los proyectos que
 * puede elegir, y emite el payload con `saved`.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-goal-form',
  imports: [
    ButtonModule,
    InputNumberModule,
    MessageModule,
    ReactiveFormsModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: './goal-form.html',
  styleUrl: './goal-form.css',
})
export class GoalForm {
  /** Meta a editar. `null` deja el formulario en modo creación. */
  readonly goal = input<Goal | null>(null);

  /** Proyectos elegibles (el padre ya filtró los activos). */
  readonly projects = input<Project[]>([]);

  /** Llave para reiniciar el formulario al reabrir «Nueva meta». */
  readonly resetKey = input(0);

  readonly saving = input(false);

  readonly saved = output<GoalPayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly statusOptions = [
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' },
  ];

  readonly form = this.fb.group({
    description: ['', [Validators.required]],
    target_amount: [null as number | null, [Validators.required, Validators.min(1)]],
    project_id: [null as number | null, [Validators.required]],
    status: ['active' as Status, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const current = this.goal();
      this.resetKey(); // reabrir el diálogo debe vaciar el formulario

      this.form.reset({
        description: current?.description ?? '',
        // El backend manda el monto como texto ("5000000.00"): se convierte a número.
        target_amount: current ? Number(current.target_amount) : null,
        project_id: current?.project_id ?? null,
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

    if (this.form.invalid || value.target_amount === null || value.project_id === null) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: GoalPayload = {
      description: value.description.trim(),
      target_amount: value.target_amount,
      project_id: value.project_id,
    };

    // `status` solo se envía al crear: en edición lo gobierna /deactivate.
    this.saved.emit(this.goal() ? payload : { ...payload, status: value.status });
  }
}
