import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../../core/services/auth';
import { toApiMessage } from '../../../core/utils/api-error';

/**
 * Pantalla de inicio de sesión. Vive fuera del Shell: sin menú ni encabezado.
 *
 * `identifier` acepta nombre de usuario o correo. Al terminar, `login()` ya
 * dejó guardados los tokens, el perfil y los permisos, así que se puede navegar.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-login',
  imports: [
    ButtonModule,
    CardModule,
    InputTextModule,
    MessageModule,
    PasswordModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.group({
    identifier: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const { identifier, password } = this.form.getRawValue();

    this.auth.login({ identifier: identifier.trim(), password }).subscribe({
      next: () => {
        this.loading.set(false);
        void this.router.navigateByUrl(this.destination());
      },
      error: (error: unknown) => {
        this.loading.set(false);
        this.error.set(toApiMessage(error));
      },
    });
  }

  /**
   * Pantalla a la que se vuelve tras el login. Solo se aceptan rutas internas:
   * `//sitio.com` y `https://sitio.com` se descartan (open redirect).
   */
  private destination(): string {
    const requested = this.route.snapshot.queryParamMap.get('returnUrl') ?? '';
    const isInternal =
      requested.startsWith('/') && !requested.startsWith('//') && !requested.startsWith('/login');

    return isInternal ? requested : '/dashboard';
  }
}
