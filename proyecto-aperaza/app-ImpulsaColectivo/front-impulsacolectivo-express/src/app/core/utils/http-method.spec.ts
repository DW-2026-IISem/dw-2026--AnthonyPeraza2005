import { methodSeverity } from './http-method';

describe('methodSeverity', () => {
  it('should map every HTTP verb to its severity and fall back to secondary', () => {
    expect(methodSeverity('GET')).toBe('info');
    expect(methodSeverity('POST')).toBe('success');
    expect(methodSeverity('PUT')).toBe('warn');
    expect(methodSeverity('PATCH')).toBe('warn');
    expect(methodSeverity('DELETE')).toBe('danger');
    expect(methodSeverity(undefined)).toBe('secondary');
    expect(methodSeverity('TRACE')).toBe('secondary');
  });
});
