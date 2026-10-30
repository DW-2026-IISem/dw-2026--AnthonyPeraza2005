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
   * Menú mínimo de ISS-02. Cada ISS de negocio agrega su opción
   * (Promotores en ISS-03, Contribuyentes en ISS-04...); ISS-08/09 lo
   * sustituyen por uno filtrado por permisos.
   */
  readonly items: MenuItem[] = [
    { label: 'Panel', icon: 'pi pi-home', routerLink: '/dashboard' },
    { label: 'Promotores', icon: 'pi pi-users', routerLink: '/promotores' },
    { label: 'Contribuyentes', icon: 'pi pi-id-card', routerLink: '/contribuyentes' },
    { label: 'Proyectos', icon: 'pi pi-briefcase', routerLink: '/proyectos' },
    { label: 'Contribuciones', icon: 'pi pi-heart', routerLink: '/contribuciones' },
    { label: 'Pagos', icon: 'pi pi-credit-card', routerLink: '/pagos' },
    { label: 'Recompensas', icon: 'pi pi-gift', routerLink: '/recompensas' },
    { label: 'Metas', icon: 'pi pi-flag', routerLink: '/metas' },
    { label: 'Desembolsos', icon: 'pi pi-wallet', routerLink: '/desembolsos' },
    { label: 'Auditorías', icon: 'pi pi-history', routerLink: '/auditorias' },
    { label: 'Prototipo', icon: 'pi pi-desktop', routerLink: '/construir' },
  ];

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
