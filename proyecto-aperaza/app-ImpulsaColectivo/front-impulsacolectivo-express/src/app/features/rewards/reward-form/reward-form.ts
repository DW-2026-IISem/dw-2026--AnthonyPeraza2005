import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Status } from '../../../core/models/api.model';
import { Project } from '../../../core/models/project.model';
import { Reward, RewardPayload } from '../../../core/models/reward.model';

/**
 * Formulario de recompensa, reutilizado para crear y editar.
 *
 * No llama a la API: recibe `reward` (o `null` para crear) y los proyectos que
 * puede elegir, y emite el payload con `saved`.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-reward-form',
  imports: [
    ButtonModule,
    InputNumberModule,
    InputTextModule,
    MessageModule,
    ReactiveFormsModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: './reward-form.html',
  styleUrl: './reward-form.css',
})
export class RewardForm {
  /** Recompensa a editar. `null` deja el formulario en modo creación. */
  readonly reward = input<Reward | null>(null);

  /** Proyectos elegibles (el padre ya filtró los activos). */
  readonly projects = input<Project[]>([]);

  /** Llave para reiniciar el formulario al reabrir «Nueva recompensa». */
  readonly resetKey = input(0);

  readonly saving = input(false);

  readonly saved = output<RewardPayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly statusOptions = [
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' },
  ];

  readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', [Validators.required]],
    min_amount: [null as number | null, [Validators.required, Validators.min(1)]],
    project_id: [null as number | null, [Validators.required]],
    status: ['active' as Status, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const current = this.reward();
      this.resetKey(); // reabrir el diálogo debe vaciar el formulario

      this.form.reset({
        title: current?.title ?? '',
        description: current?.description ?? '',
        // El backend manda el monto como texto ("20000.00"): se convierte a número.
        min_amount: current ? Number(current.min_amount) : null,
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

    if (this.form.invalid || value.min_amount === null || value.project_id === null) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: RewardPayload = {
      title: value.title.trim(),
      description: value.description.trim(),
      min_amount: value.min_amount,
      project_id: value.project_id,
    };

    // `status` solo se envía al crear: en edición lo gobierna /deactivate.
    this.saved.emit(this.reward() ? payload : { ...payload, status: value.status });
  }
}
