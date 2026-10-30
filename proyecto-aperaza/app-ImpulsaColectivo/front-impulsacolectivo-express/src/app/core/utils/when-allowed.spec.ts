import { defer, firstValueFrom, of } from 'rxjs';
import { whenAllowed } from './when-allowed';

describe('whenAllowed', () => {
  it('should return the source when the role is allowed', async () => {
    const resultado = await firstValueFrom(whenAllowed(true, of([1, 2])));

    expect(resultado).toEqual([1, 2]);
  });

  it('should return an empty list without subscribing to the source when it is not allowed', async () => {
    let suscripciones = 0;
    const fuente = defer(() => {
      suscripciones++;
      return of([1]);
    });

    const resultado = await firstValueFrom(whenAllowed(false, fuente));

    expect(resultado).toEqual([]);
    expect(suscripciones).toBe(0);
  });
});
