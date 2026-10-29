import { Routes } from '@angular/router';

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
    path: '',
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    children: [
      // La primera pantalla de negocio es la redirección por defecto.
      // ISS-07 la cambiará por el dashboard.
      { path: '', pathMatch: 'full', redirectTo: 'promotores' },
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
    ],
  },
  { path: '**', redirectTo: 'construir' },
];
