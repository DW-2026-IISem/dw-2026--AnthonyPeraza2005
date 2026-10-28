import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Ejemplo } from './ejemplo';

describe('Ejemplo', () => {
  let fixture: ComponentFixture<Ejemplo>;
  let root: HTMLElement;

  async function render(): Promise<void> {
    fixture = TestBed.createComponent(Ejemplo);
    await fixture.whenStable();
    root = fixture.nativeElement as HTMLElement;
  }

  function boton(texto: string): HTMLButtonElement {
    const encontrado = Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent?.includes(texto),
    );
    if (!encontrado) {
      throw new Error(`No se encontró el botón "${texto}"`);
    }
    return encontrado;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Ejemplo] }).compileComponents();
    await render();
  });

  it('muestra el proyecto inicial con su meta y la meta con comisión', () => {
    const texto = root.textContent ?? '';
    expect(texto).toContain('Biblioteca comunitaria Riohacha');
    expect(texto).toContain('2000000');
    expect(texto).toContain('2100000');
    expect(texto).toContain('Activo');
  });

  it('+100000 sube la meta y recalcula la meta con comisión', async () => {
    boton('+100000').click();
    await fixture.whenStable();
    const texto = root.textContent ?? '';
    expect(texto).toContain('2205000');
  });

  it('escribir en Nombre actualiza la vista previa', async () => {
    const input = root.querySelector('input') as HTMLInputElement;
    input.value = 'Huerta escolar';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(root.textContent).toContain('Vista previa: Huerta escolar');
  });

  it('Cambiar estado alterna la etiqueta y Reiniciar restaura el objeto', async () => {
    boton('Cambiar estado').click();
    await fixture.whenStable();
    expect(root.textContent).toContain('Inactivo');

    boton('Reiniciar').click();
    await fixture.whenStable();
    expect(root.textContent).toContain('Activo');
    expect(root.textContent).toContain('Biblioteca comunitaria Riohacha');
  });
});
