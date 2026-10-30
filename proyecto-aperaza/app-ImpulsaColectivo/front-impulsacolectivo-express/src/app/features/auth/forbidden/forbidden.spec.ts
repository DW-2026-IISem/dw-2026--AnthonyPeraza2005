import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Forbidden } from './forbidden';

describe('Forbidden', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Forbidden],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  function crear() {
    const fixture = TestBed.createComponent(Forbidden);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('should explain that the role has no access', () => {
    const compilado = crear();

    expect(compilado.textContent).toContain('Sin permiso');
    expect(compilado.textContent).toContain('Tu rol no permite abrir esta pantalla');
  });

  it('should offer a link back to the dashboard', () => {
    const compilado = crear();

    const enlace = compilado.querySelector('a[href="/dashboard"]');
    expect(enlace).not.toBeNull();
    expect(enlace?.textContent).toContain('Volver al panel');
  });
});
