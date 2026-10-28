/**
 * Entorno de producción (`ng build`).
 *
 * `primeUiLicense`: clave Community de PrimeUI (PrimeNG 22). Solicítala en
 * https://primeui.dev. Déjala en '' si aún no la tienes (aviso en consola; la
 * app funciona). No subas claves comerciales al repositorio.
 *
 * En ISS-02 se agregan `apiUrl` y `requireAuth`.
 */
export const environment = {
  production: true,
  appName: 'ImpulsaColectivo',
  apiUrl: 'http://localhost:4000/api',
  requireAuth: true,
  primeUiLicense: '',
};
