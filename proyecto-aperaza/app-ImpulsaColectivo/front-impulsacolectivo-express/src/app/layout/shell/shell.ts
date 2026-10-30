import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DrawerModule } from 'primeng/drawer';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../core/services/auth';
import { SessionStore } from '../../core/services/session-store';
import { watchMediaQuery } from '../../core/utils/media-query';
import { Aside } from '../aside/aside';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { NAV } from './nav.config';

/**
 * Layout persistente de la aplicación.
 *
 * El Header, el Aside y el Footer se montan **una sola vez**; solo la región
 * central cambia con `<router-outlet />`. Reutilizar el layout evita remontar
 * el menú (y perder el scroll o el foco) al navegar.
 *
 * Conecta la sesión con Header y Aside: usuario, rol, permisos y cierre de sesión.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-shell',
  imports: [RouterOutlet, Header, Aside, Footer, ConfirmDialogModule, DrawerModule, ToastModule],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
  /** `lg` de Tailwind: desde aquí el Aside es fijo y el botón lo alterna. */
  private readonly isDesktop = watchMediaQuery('(min-width: 1024px)');

  /** Escritorio: Aside fijo visible u oculto. */
  readonly sidebarCollapsed = signal(false);

  /** Móvil: Drawer abierto. */
  readonly mobileOpen = signal(false);

  private readonly session = inject(SessionStore);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /** Datos de la sesión para Header y Aside. */
  readonly authEnabled = this.session.authEnabled;
  readonly username = computed(() => this.session.user()?.username ?? '');
  readonly initials = this.session.initials;
  readonly roleLabel = this.session.roleLabel;
  readonly permissionCount = this.session.permissionCount;

  /** Menú del avatar en el encabezado. */
  readonly userItems: MenuItem[] = [
    { label: 'Mi perfil', icon: 'pi pi-user', routerLink: '/perfil' },
    { separator: true },
    { label: 'Cerrar sesión', icon: 'pi pi-sign-out', command: () => this.logout() },
  ];

  /**
   * Menú lateral: cada opción del catálogo `NAV` aparece solo si el rol tiene
   * su permiso. Es un `computed`, así que se recalcula solo al cargar o
   * actualizar los permisos. Es una ayuda visual; Express vuelve a validar.
   */
  readonly items = computed<MenuItem[]>(() =>
    NAV.filter((item) => !item.permission || this.session.canPermission(item.permission)).map(
      (item) => ({ label: item.label, icon: item.icon, routerLink: item.routerLink }),
    ),
  );

  /**
   * Un solo botón, dos disposiciones: en escritorio alterna el Aside fijo; por
   * debajo de `lg` abre el Drawer.
   */
  protected onMenuToggle(): void {
    if (this.isDesktop()) {
      this.sidebarCollapsed.update((collapsed) => !collapsed);
      return;
    }
    this.mobileOpen.set(true);
  }

  /** Cierra la sesión en el backend, la limpia y vuelve al login. */
  protected logout(): void {
    this.auth.logout().subscribe(() => {
      void this.router.navigate(['/login']);
    });
  }
}
