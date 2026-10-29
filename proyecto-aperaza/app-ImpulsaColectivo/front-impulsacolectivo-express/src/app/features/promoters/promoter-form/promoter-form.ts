import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Status } from '../../../core/models/api.model';
import { Promoter, PromoterPayload } from '../../../core/models/promoter.model';

/**
 * Formulario de promotor, reutilizado para crear y editar.
 *
 * No llama a la API: recibe `promoter` (o `null` para crear) y emite el payload
 * con `saved`. El padre decide entre `POST` y `PATCH` y controla el diálogo, así
 * que este componente sirve igual dentro de un Dialog que en una página.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-promoter-form',
  imports: [
    MessageModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: './promoter-form.html',
  styleUrl: './promoter-form.css',
})
export class PromoterForm {
  /** Promotor a editar. `null` deja el formulario en modo creación. */
  readonly promoter = input<Promoter | null>(null);

  /**
   * Cambia cada vez que el padre abre el diálogo.
   *
   * Sin esto, reabrir «Nuevo promotor» tras cancelar conservaría lo escrito:
   * `promoter` sigue siendo `null`, así que el `effect()` no volvería a correr.
   * Es una llave explícita para reiniciar, no un estado duplicado.
   */
  readonly resetKey = input(0);

  /** Petición en curso: deshabilita el botón y muestra su spinner. */
  readonly saving = input(false);

  readonly saved = output<PromoterPayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly statusOptions = [
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' },
  ];

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    description: [''],
    contact_email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
    contact_phone: [''],
    status: ['active' as Status, [Validators.required]],
  });

  constructor() {
    // `effect()` reacciona al input `promoter()`: el mismo formulario sirve para
    // crear y editar sin `ngOnChanges` ni comparar objetos a mano.
    effect(() => {
      const current = this.promoter();
      // `resetKey` se lee a propósito: abrir de nuevo el diálogo debe vaciar el
      // formulario aunque `promoter` siga siendo `null`.
      this.resetKey();

      this.form.reset({
        name: current?.name ?? '',
        description: current?.description ?? '',
        contact_email: current?.contact_email ?? '',
        contact_phone: current?.contact_phone ?? '',
        status: current?.status ?? 'active',
      });

      // El backend solo cambia `status` con PATCH /deactivate. Si el campo
      // siguiera habilitado, el formulario prometería algo que el backend ignora.
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
    const payload: PromoterPayload = {
      name: value.name.trim(),
      description: value.description.trim() || null,
      contact_email: value.contact_email.trim(),
      contact_phone: value.contact_phone.trim() || null,
    };

    // `status` solo se envía al crear: en edición lo gobierna /deactivate.
    this.saved.emit(this.promoter() ? payload : { ...payload, status: value.status });
  }
}
