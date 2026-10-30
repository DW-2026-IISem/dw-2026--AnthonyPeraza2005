import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { Forbidden } from './forbidden';

describe('Forbidden · permiso requerido', () => {
  async function crear(permission: string | null) {
    await TestBed.configureTestingModule({
      imports: [Forbidden],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParamMap: convertToParamMap(permission ? { permission } : {}) },
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(Forbidden);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('should show the permission that the guard reported as missing', async () => {
    const compilado = await crear('GET /api/transacciones-pago');

    expect(compilado.textContent).toContain('Permiso requerido');
    expect(compilado.querySelector('code')?.textContent).toContain('GET /api/transacciones-pago');
  });

  it('should not show the permission block when none was reported', async () => {
    const compilado = await crear(null);

    expect(compilado.textContent).not.toContain('Permiso requerido');
    expect(compilado.querySelector('code')).toBeNull();
  });
});
