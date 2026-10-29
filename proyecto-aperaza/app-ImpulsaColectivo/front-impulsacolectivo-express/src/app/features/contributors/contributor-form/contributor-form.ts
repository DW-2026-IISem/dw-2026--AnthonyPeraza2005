import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { Status } from '../../../core/models/api.model';
import { Contributor, ContributorPayload } from '../../../core/models/contributor.model';

/**
 * Formulario de contribuyente, reutilizado para crear y editar.
 *
 * Mismo patrón que `PromoterForm`: no llama a la API, recibe `contributor`
 * (o `null` para crear) y emite el payload con `saved`.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-contributor-form',
  imports: [MessageModule, ReactiveFormsModule, ButtonModule, InputTextModule, SelectModule],
  templateUrl: './contributor-form.html',
  styleUrl: './contributor-form.css',
})
export class ContributorForm {
  /** Contribuyente a editar. `null` deja el formulario en modo creación. */
  readonly contributor = input<Contributor | null>(null);

  /** Llave para reiniciar el formulario al reabrir «Nuevo contribuyente». */
  readonly resetKey = input(0);

  readonly saving = input(false);

  readonly saved = output<ContributorPayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly statusOptions = [
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' },
  ];

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
    phone: [''],
    status: ['active' as Status, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const current = this.contributor();
      this.resetKey(); // reabrir el diálogo debe vaciar el formulario

      this.form.reset({
        name: current?.name ?? '',
        email: current?.email ?? '',
        phone: current?.phone ?? '',
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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: ContributorPayload = {
      name: value.name.trim(),
      email: value.email.trim(),
      phone: value.phone.trim() || null,
    };

    // `status` solo se envía al crear: en edición lo gobierna /deactivate.
    this.saved.emit(this.contributor() ? payload : { ...payload, status: value.status });
  }
}
