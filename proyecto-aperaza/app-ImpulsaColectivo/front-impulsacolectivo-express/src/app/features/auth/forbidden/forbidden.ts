import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

/** Aviso de acceso denegado: el usuario tiene sesión pero su rol no alcanza. */
@Component({
  host: { class: 'block' },
  selector: 'app-forbidden',
  imports: [ButtonModule, RouterLink],
  templateUrl: './forbidden.html',
  styleUrl: './forbidden.css',
})
export class Forbidden {
  private readonly route = inject(ActivatedRoute);

  /** Permiso que faltaba, enviado por el guard: `GET /api/transacciones-pago`. */
  readonly permission = this.route.snapshot.queryParamMap.get('permission');
}
