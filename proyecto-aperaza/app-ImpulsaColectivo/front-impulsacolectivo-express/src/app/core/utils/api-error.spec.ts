import { HttpErrorResponse } from '@angular/common/http';
import { toApiMessage } from './api-error';

describe('toApiMessage', () => {
  it('should explain status 0 as an unreachable backend', () => {
    const error = new HttpErrorResponse({ status: 0, statusText: 'Unknown Error' });
    expect(toApiMessage(error)).toContain('No se pudo conectar con el backend');
  });

  it('should join error and detail from Express', () => {
    const error = new HttpErrorResponse({
      status: 400,
      error: { error: 'Validation error', detail: 'title must be a string' },
    });
    expect(toApiMessage(error)).toBe('Validation error — title must be a string');
  });

  it('should keep the bare Forbidden of RBAC', () => {
    const error = new HttpErrorResponse({ status: 403, error: { error: 'Forbidden' } });
    expect(toApiMessage(error)).toBe('Forbidden');
  });

  it('should return plain text bodies as they are', () => {
    const error = new HttpErrorResponse({ status: 500, error: 'Error interno del servidor' });
    expect(toApiMessage(error)).toBe('Error interno del servidor');
  });
});
