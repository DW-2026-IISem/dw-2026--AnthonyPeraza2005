import { HttpMethod } from '../models/resource.model';

export type MethodSeverity = 'info' | 'success' | 'warn' | 'danger' | 'secondary';

/** Color del `p-tag` según el verbo: lectura, alta, modificación o borrado. */
export function methodSeverity(method: HttpMethod | string | undefined): MethodSeverity {
  switch (method) {
    case 'GET':
      return 'info';
    case 'POST':
      return 'success';
    case 'PUT':
    case 'PATCH':
      return 'warn';
    case 'DELETE':
      return 'danger';
    default:
      return 'secondary';
  }
}
