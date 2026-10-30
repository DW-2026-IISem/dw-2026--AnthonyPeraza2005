import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
import { SessionStore } from '../../core/services/session-store';

/**
 * Pinta el bloque solo si la sesión tiene el permiso indicado.
 *
 *   <ng-container *appHasPermission="'POST /api/metas'">
 *     <button pButton>Nueva meta</button>
 *   </ng-container>
 *
 * El permiso usa el formato del catálogo: `'MÉTODO /api/ruta'`, con `:id` para
 * las rutas de un solo registro. Es una ayuda visual; el backend sigue siendo
 * la autoridad.
 */
@Directive({ selector: '[appHasPermission]' })
export class HasPermission {
  private readonly session = inject(SessionStore);
  private readonly template = inject<TemplateRef<unknown>>(TemplateRef);
  private readonly container = inject(ViewContainerRef);

  readonly appHasPermission = input.required<string>();

  private rendered = false;

  constructor() {
    // Lee `permissions()` por dentro de `canPermission`: se vuelve a ejecutar
    // cuando la sesión cambia de permisos.
    effect(() => {
      const allowed = this.session.canPermission(this.appHasPermission());

      if (allowed && !this.rendered) {
        this.container.createEmbeddedView(this.template);
        this.rendered = true;
      } else if (!allowed && this.rendered) {
        this.container.clear();
        this.rendered = false;
      }
    });
  }
}
