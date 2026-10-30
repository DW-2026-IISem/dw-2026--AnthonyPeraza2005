import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Status } from '../../../core/models/api.model';
import { Project } from '../../../core/models/project.model';
import { ProjectAudit, ProjectAuditPayload } from '../../../core/models/project-audit.model';
import { fromIsoDate, todayIso, toIsoDate } from '../../../core/utils/iso-date';

/**
 * Formulario de auditoría de proyecto, reutilizado para crear y editar.
 *
 * No llama a la API: recibe `audit` (o `null` para crear) y los proyectos que
 * puede elegir, y emite el payload con `saved`.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-project-audit-form',
  imports: [
    ButtonModule,
    DatePickerModule,
    MessageModule,
    ReactiveFormsModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: './project-audit-form.html',
  styleUrl: './project-audit-form.css',
})
export class ProjectAuditForm {
  /** Auditoría a editar. `null` deja el formulario en modo creación. */
  readonly audit = input<ProjectAudit | null>(null);

  /** Proyectos elegibles (el padre ya filtró los activos). */
  readonly projects = input<Project[]>([]);

  /** Llave para reiniciar el formulario al reabrir «Nueva auditoría». */
  readonly resetKey = input(0);

  readonly saving = input(false);

  readonly saved = output<ProjectAuditPayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  /** Sugerencias: el select es editable, así que también admite texto libre. */
  readonly actionOptions = [
    'Revisión documental',
    'Visita de campo',
    'Verificación de gastos',
    'Reporte de avance',
    'Cambio de estado',
  ];

  readonly statusOptions = [
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' },
  ];

  readonly form = this.fb.group({
    project_id: [null as number | null, [Validators.required]],
    action: ['', [Validators.required]],
    detail: ['', [Validators.required]],
    audit_date: [null as Date | null, [Validators.required]],
    status: ['active' as Status, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const current = this.audit();
      this.resetKey(); // reabrir el diálogo debe vaciar el formulario

      this.form.reset({
        project_id: current?.project_id ?? null,
        action: current?.action ?? '',
        detail: current?.detail ?? '',
        // Fecha local (no UTC): al crear arranca en hoy.
        audit_date: fromIsoDate(current?.audit_date ?? todayIso()),
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

    if (this.form.invalid || value.project_id === null || value.audit_date === null) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: ProjectAuditPayload = {
      action: value.action.trim(),
      detail: value.detail.trim(),
      audit_date: toIsoDate(value.audit_date),
      project_id: value.project_id,
    };

    // `status` solo se envía al crear: en edición lo gobierna /deactivate.
    this.saved.emit(this.audit() ? payload : { ...payload, status: value.status });
  }
}
