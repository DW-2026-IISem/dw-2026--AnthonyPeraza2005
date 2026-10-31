import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Status } from '../../../../core/models/api.model';
import { Role, RolePayload } from '../../../../core/models/role.model';

/**
 * Formulario de rol, reutilizado para crear y editar.
 *
 * `status` solo se envía en el alta: `PATCH /api/roles/:id` no lo acepta y el
 * estado se cambia con `/deactivate`. El backend normaliza `name` a MAYÚSCULAS.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-role-form',
  imports: [
    ButtonModule,
    InputTextModule,
    MessageModule,
    ReactiveFormsModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: './role-form.html',
  styleUrl: './role-form.css',
})
export class RoleForm {
  /** Rol a editar. `null` deja el formulario en modo creación. */
  readonly role = input<Role | null>(null);

  /** Cambia cada vez que el padre abre el diálogo: vacía el formulario aunque `role` siga en `null`. */
  readonly resetKey = input(0);

  /** Petición en curso: deshabilita el botón y muestra su spinner. */
  readonly saving = input(false);

  readonly saved = output<RolePayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly statusOptions = [
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' },
  ];

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(60)]],
    description: [''],
    status: ['active' as Status, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const current = this.role();
      // `resetKey` se lee a propósito: abrir de nuevo el diálogo debe vaciar el formulario.
      this.resetKey();

      this.form.reset({
        name: current?.name ?? '',
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
    const payload: RolePayload = {
      name: value.name.trim(),
      description: value.description.trim() || null,
    };

    // `status` solo existe en el alta.
    if (!this.role()) {
      payload.status = value.status;
    }

    this.saved.emit(payload);
  }
}
