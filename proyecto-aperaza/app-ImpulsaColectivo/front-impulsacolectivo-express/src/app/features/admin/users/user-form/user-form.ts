import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { Status } from '../../../../core/models/api.model';
import { User, UserPayload } from '../../../../core/models/user.model';

/**
 * Formulario de usuario, reutilizado para crear y editar.
 *
 * No llama a la API: emite el payload con `saved`. En el alta incluye
 * `password` y `status`; en la edición no, porque `PATCH /api/usuarios/:id`
 * solo acepta `username`, `email` y `avatar` (el estado se cambia con
 * `/deactivate` y la contraseña con su propio endpoint).
 */
@Component({
  host: { class: 'block' },
  selector: 'app-user-form',
  imports: [
    ButtonModule,
    InputTextModule,
    MessageModule,
    PasswordModule,
    ReactiveFormsModule,
    SelectModule,
  ],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm {
  /** Usuario a editar. `null` deja el formulario en modo creación. */
  readonly user = input<User | null>(null);

  /** Cambia cada vez que el padre abre el diálogo: vacía el formulario aunque `user` siga en `null`. */
  readonly resetKey = input(0);

  /** Petición en curso: deshabilita el botón y muestra su spinner. */
  readonly saving = input(false);

  readonly saved = output<UserPayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly statusOptions = [
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' },
  ];

  readonly form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    avatar: [''],
    status: ['active' as Status, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const current = this.user();
      // `resetKey` se lee a propósito: abrir de nuevo el diálogo debe vaciar el formulario.
      this.resetKey();

      this.form.reset({
        username: current?.username ?? '',
        email: current?.email ?? '',
        password: '',
        avatar: current?.avatar ?? '',
        status: current?.status ?? 'active',
      });

      // Un control deshabilitado no cuenta para la validez del formulario.
      if (current) {
        this.form.controls.password.disable();
        this.form.controls.status.disable();
      } else {
        this.form.controls.password.enable();
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
    const payload: UserPayload = {
      username: value.username.trim(),
      email: value.email.trim(),
      avatar: value.avatar.trim() || null,
    };

    // password + status solo existen en el alta.
    if (!this.user()) {
      payload.status = value.status;
      payload.password = value.password;
    }

    this.saved.emit(payload);
  }
}
