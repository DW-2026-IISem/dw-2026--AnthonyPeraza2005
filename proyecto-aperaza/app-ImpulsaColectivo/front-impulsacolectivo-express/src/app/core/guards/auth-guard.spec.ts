import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
  provideRouter,
} from '@angular/router';
import { SessionTokens } from '../models/auth.model';
import { SessionStore } from '../services/session-store';
import { authGuard } from './auth-guard';

const TOKENS: SessionTokens = {
  access_token: 'access-1',
  token_type: 'Bearer',
  expires_in: 3600,
  refresh_token: 'refresh-1',
  refresh_expires_in: 604799,
};

describe('authGuard', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  afterAll(() => localStorage.clear());

  function ejecutar(url: string) {
    return TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, { url } as RouterStateSnapshot),
    );
  }

  it('should let the user in when there is a session', () => {
    TestBed.inject(SessionStore).setTokens(TOKENS);

    expect(ejecutar('/metas')).toBe(true);
  });

  it('should redirect to the login and remember the requested url when there is no session', () => {
    const resultado = ejecutar('/metas');

    expect(resultado).toBeInstanceOf(UrlTree);
    expect(TestBed.inject(Router).serializeUrl(resultado as UrlTree)).toBe(
      '/login?returnUrl=%2Fmetas',
    );
  });
});
