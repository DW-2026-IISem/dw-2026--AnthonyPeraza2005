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
      // Aún no hay pantallas de negocio: la raíz sigue llevando al prototipo.
      // ISS-03 cambia esta redirección por la primera pantalla de negocio.
      { path: '', pathMatch: 'full', redirectTo: '/construir' },
    ],
  },
  { path: '**', redirectTo: 'construir' },
];
