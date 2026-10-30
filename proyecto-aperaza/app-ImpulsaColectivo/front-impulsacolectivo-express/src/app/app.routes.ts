import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';

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
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'promotores',
        title: 'Promotores · ImpulsaColectivo',
        loadComponent: () =>
          import('./features/promoters/promoter-list/promoter-list').then((m) => m.PromoterList),
      },
      {
        path: 'contribuyentes',
        title: 'Contribuyentes · ImpulsaColectivo',
        loadComponent: () =>
          import('./features/contributors/contributor-list/contributor-list').then(
            (m) => m.ContributorList,
          ),
      },
      {
        path: 'proyectos',
        title: 'Proyectos · ImpulsaColectivo',
        loadComponent: () =>
          import('./features/projects/project-list/project-list').then((m) => m.ProjectList),
      },
      {
        path: 'contribuciones',
        title: 'Contribuciones · ImpulsaColectivo',
        loadComponent: () =>
          import('./features/contributions/contribution-list/contribution-list').then(
            (m) => m.ContributionList,
          ),
      },
      {
        path: 'pagos',
        title: 'Pagos · ImpulsaColectivo',
        loadComponent: () =>
          import('./features/payment-transactions/payment-transaction-list/payment-transaction-list').then(
            (m) => m.PaymentTransactionList,
          ),
      },
      {
        path: 'recompensas',
        title: 'Recompensas · ImpulsaColectivo',
        loadComponent: () =>
          import('./features/rewards/reward-list/reward-list').then((m) => m.RewardList),
      },
      {
        path: 'metas',
        title: 'Metas · ImpulsaColectivo',
        loadComponent: () =>
          import('./features/goals/goal-list/goal-list').then((m) => m.GoalList),
      },
      {
        path: 'desembolsos',
        title: 'Desembolsos · ImpulsaColectivo',
        loadComponent: () =>
          import('./features/disbursements/disbursement-list/disbursement-list').then(
            (m) => m.DisbursementList,
          ),
      },
      {
        path: 'auditorias',
        title: 'Auditorías · ImpulsaColectivo',
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
