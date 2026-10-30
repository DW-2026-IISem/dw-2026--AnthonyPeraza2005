/** Una opción del menú lateral. Sin `permission`, todos la ven. */
export interface NavItem {
  label: string;
  icon: string;
  routerLink: string;
  /** Permiso que el rol necesita para verla: `'GET /api/metas'`. */
  permission?: string;
}

/**
 * Catálogo del menú: orden, iconos y permiso de cada pantalla.
 *
 * El permiso de cada opción es el de leer su lista, el mismo que declara su
 * ruta en `app.routes.ts`. El Panel usa `GET /api/proyectos`, el permiso más
 * básico de sus fuentes de datos.
 */
export const NAV: NavItem[] = [
  { label: 'Panel', icon: 'pi pi-home', routerLink: '/dashboard', permission: 'GET /api/proyectos' },
  {
    label: 'Promotores',
    icon: 'pi pi-users',
    routerLink: '/promotores',
    permission: 'GET /api/promotores',
  },
  {
    label: 'Contribuyentes',
    icon: 'pi pi-id-card',
    routerLink: '/contribuyentes',
    permission: 'GET /api/contribuyentes',
  },
  {
    label: 'Proyectos',
    icon: 'pi pi-briefcase',
    routerLink: '/proyectos',
    permission: 'GET /api/proyectos',
  },
  {
    label: 'Contribuciones',
    icon: 'pi pi-heart',
    routerLink: '/contribuciones',
    permission: 'GET /api/contribuciones',
  },
  {
    label: 'Pagos',
    icon: 'pi pi-credit-card',
    routerLink: '/pagos',
    permission: 'GET /api/transacciones-pago',
  },
  {
    label: 'Recompensas',
    icon: 'pi pi-gift',
    routerLink: '/recompensas',
    permission: 'GET /api/recompensas',
  },
  { label: 'Metas', icon: 'pi pi-flag', routerLink: '/metas', permission: 'GET /api/metas' },
  {
    label: 'Desembolsos',
    icon: 'pi pi-wallet',
    routerLink: '/desembolsos',
    permission: 'GET /api/desembolsos',
  },
  {
    label: 'Auditorías',
    icon: 'pi pi-history',
    routerLink: '/auditorias',
    permission: 'GET /api/auditorias-proyecto',
  },
  { label: 'Prototipo', icon: 'pi pi-desktop', routerLink: '/construir' },
];
