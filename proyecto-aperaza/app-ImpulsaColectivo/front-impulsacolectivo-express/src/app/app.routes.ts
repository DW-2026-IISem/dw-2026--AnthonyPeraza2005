import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';
import { permissionGuard } from './core/guards/permission-guard';

/**
 * Rutas de la aplicación.
 *
 * ISS-01B presenta el router con una pantalla real. `loadComponent` descarga
 * `Construir` solo cuando se visita su URL: el bundle inicial no lo incluye.
 */
export const routes: Routes = [
  {
    path: 'construir',
    loadComponent: () => import('./features/construir/construir').then((m) => m.Construir),
  },
  {
    path: 'login',
    title: 'Iniciar sesión · ImpulsaColectivo',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    children: [
      // La primera pantalla de negocio es la redirección por defecto.
      // ISS-07 la cambiará por el dashboard.
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        title: 'Panel · ImpulsaColectivo',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/proyectos' },
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'promotores',
        title: 'Promotores · ImpulsaColectivo',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/promotores' },
        loadComponent: () =>
          import('./features/promoters/promoter-list/promoter-list').then((m) => m.PromoterList),
      },
      {
        path: 'contribuyentes',
        title: 'Contribuyentes · ImpulsaColectivo',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/contribuyentes' },
        loadComponent: () =>
          import('./features/contributors/contributor-list/contributor-list').then(
            (m) => m.ContributorList,
          ),
      },
      {
        path: 'proyectos',
        title: 'Proyectos · ImpulsaColectivo',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/proyectos' },
        loadComponent: () =>
          import('./features/projects/project-list/project-list').then((m) => m.ProjectList),
      },
      {
        path: 'contribuciones',
        title: 'Contribuciones · ImpulsaColectivo',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/contribuciones' },
        loadComponent: () =>
          import('./features/contributions/contribution-list/contribution-list').then(
            (m) => m.ContributionList,
          ),
      },
      {
        path: 'pagos',
        title: 'Pagos · ImpulsaColectivo',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/transacciones-pago' },
        loadComponent: () =>
          import('./features/payment-transactions/payment-transaction-list/payment-transaction-list').then(
            (m) => m.PaymentTransactionList,
          ),
      },
      {
        path: 'recompensas',
        title: 'Recompensas · ImpulsaColectivo',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/recompensas' },
        loadComponent: () =>
          import('./features/rewards/reward-list/reward-list').then((m) => m.RewardList),
      },
      {
        path: 'metas',
        title: 'Metas · ImpulsaColectivo',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/metas' },
        loadComponent: () =>
          import('./features/goals/goal-list/goal-list').then((m) => m.GoalList),
      },
      {
        path: 'desembolsos',
        title: 'Desembolsos · ImpulsaColectivo',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/desembolsos' },
        loadComponent: () =>
          import('./features/disbursements/disbursement-list/disbursement-list').then(
            (m) => m.DisbursementList,
          ),
      },
      {
        path: 'auditorias',
        title: 'Auditorías · ImpulsaColectivo',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/auditorias-proyecto' },
        loadComponent: () =>
          import('./features/project-audits/project-audit-list/project-audit-list').then(
            (m) => m.ProjectAuditList,
          ),
      },
      {
        path: 'perfil',
        title: 'Mi perfil · ImpulsaColectivo',
        loadComponent: () => import('./features/auth/profile/profile').then((m) => m.Profile),
      },
      {
        path: 'sin-permiso',
        title: 'Sin permiso · ImpulsaColectivo',
        loadComponent: () =>
          import('./features/auth/forbidden/forbidden').then((m) => m.Forbidden),
      },
    ],
  },
  { path: '**', redirectTo: 'construir' },
];
