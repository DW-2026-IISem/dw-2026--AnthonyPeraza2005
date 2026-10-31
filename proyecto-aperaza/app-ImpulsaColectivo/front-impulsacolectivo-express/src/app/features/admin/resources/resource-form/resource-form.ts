import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { Status } from '../../../../core/models/api.model';
import {
  HTTP_METHODS,
  HttpMethod,
  Resource,
  ResourcePayload,
} from '../../../../core/models/resource.model';

/**
 * Formulario de recurso HTTP (un par método + ruta del catálogo del RBAC).
 *
 * `status` solo se envía en el alta: `PATCH /api/recursos/:id` no lo acepta y el
 * estado se cambia con `/deactivate`. Para rutas con parámetro se usa `:id`.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-resource-form',
  imports: [ButtonModule, InputTextModule, MessageModule, ReactiveFormsModule, SelectModule],
  templateUrl: './resource-form.html',
  styleUrl: './resource-form.css',
})
export class ResourceForm {
  /** Recurso a editar. `null` deja el formulario en modo creación. */
  readonly resource = input<Resource | null>(null);

  /** Cambia cada vez que el padre abre el diálogo: vacía el formulario aunque `resource` siga en `null`. */
  readonly resetKey = input(0);

  /** Petición en curso: deshabilita el botón y muestra su spinner. */
  readonly saving = input(false);

  readonly saved = output<ResourcePayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly methodOptions = HTTP_METHODS.map((method) => ({ label: method, value: method }));

  readonly statusOptions = [
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' },
  ];

  readonly form = this.fb.group({
    path: ['', [Validators.required, Validators.pattern(/^\/.*$/)]],
    method: ['GET' as HttpMethod, [Validators.required]],
    description: [''],
    status: ['active' as Status, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const current = this.resource();
      // `resetKey` se lee a propósito: abrir de nuevo el diálogo debe vaciar el formulario.
      this.resetKey();

      this.form.reset({
        path: current?.path ?? '',
        method: current?.method ?? 'GET',
        description: current?.description ?? '',
        status: current?.status ?? 'active',
      });

      if (current) {
        this.form.controls.status.disable();
      } else {
        this.form.controls.status.enable();
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: ResourcePayload = {
      path: value.path.trim(),
      method: value.method,
      description: value.description.trim() || null,
    };

    // `status` solo existe en el alta.
    if (!this.resource()) {
      payload.status = value.status;
    }

    this.saved.emit(payload);
  }
}
