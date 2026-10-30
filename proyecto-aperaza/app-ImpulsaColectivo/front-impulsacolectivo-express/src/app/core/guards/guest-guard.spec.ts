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
import { guestGuard } from './guest-guard';

const TOKENS: SessionTokens = {
  access_token: 'access-1',
  token_type: 'Bearer',
  expires_in: 3600,
  refresh_token: 'refresh-1',
  refresh_expires_in: 604799,
};

describe('guestGuard', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  afterAll(() => localStorage.clear());

  function ejecutar() {
    return TestBed.runInInjectionContext(() =>
      guestGuard({} as ActivatedRouteSnapshot, { url: '/login' } as RouterStateSnapshot),
    );
  }

  it('should let an anonymous visitor open the login', () => {
    expect(ejecutar()).toBe(true);
  });

  it('should send a user who is already signed in to the dashboard', () => {
    TestBed.inject(SessionStore).setTokens(TOKENS);

    const resultado = ejecutar();

    expect(resultado).toBeInstanceOf(UrlTree);
    expect(TestBed.inject(Router).serializeUrl(resultado as UrlTree)).toBe('/dashboard');
  });
});
