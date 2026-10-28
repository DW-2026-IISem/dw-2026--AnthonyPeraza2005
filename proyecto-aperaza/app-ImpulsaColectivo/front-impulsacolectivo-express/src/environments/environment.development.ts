/**
 * Entorno de desarrollo: lo usa `ng serve` y `npm test` (vía fileReplacements).
 * Pega aquí la misma `primeUiLicense` que en producción.
 */
export const environment = {
  production: false,
  appName: 'ImpulsaColectivo',
  apiUrl: 'http://localhost:4000/api',
  requireAuth: true,
  primeUiLicense: '',
};
