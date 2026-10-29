import { TestBed } from '@angular/core/testing';
import { Contributor, ContributorPayload } from '../../../core/models/contributor.model';
import { ContributorForm } from './contributor-form';

const CONTRIBUYENTE: Contributor = {
  id: 1,
  name: 'María Fernanda Ortiz',
  email: 'maria.ortiz@correo.com',
  phone: '3001234567',
  status: 'active',
};

describe('ContributorForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ContributorForm] }).compileComponents();
  });

  async function crearForm(contributor: Contributor | null = null) {
    const fixture = TestBed.createComponent(ContributorForm);
    fixture.componentRef.setInput('contributor', contributor);
    await fixture.whenStable();

    const formulario = fixture.componentInstance;
    const emitidos: ContributorPayload[] = [];
    formulario.saved.subscribe((payload) => emitidos.push(payload));

    return { fixture, formulario, emitidos, compilado: fixture.nativeElement as HTMLElement };
  }

  it('should start empty and active in create mode', async () => {
    const { formulario } = await crearForm();

    expect(formulario.form.getRawValue()).toEqual({
      name: '',
      email: '',
      phone: '',
      status: 'active',
    });
    expect(formulario.form.controls.status.enabled).toBe(true);
  });

  it('should not emit and should mark fields as touched when required fields are empty', async () => {
    const { formulario, emitidos } = await crearForm();

    formulario.submit();

    expect(emitidos).toEqual([]);
    expect(formulario.form.controls.name.touched).toBe(true);
    expect(formulario.form.controls.email.touched).toBe(true);
  });

  it('should reject an invalid email', async () => {
    const { formulario, emitidos } = await crearForm();

    formulario.form.patchValue({ name: 'Carlos Andrés Pinto', email: 'no-es-correo' });
    formulario.submit();

    expect(formulario.form.controls.email.invalid).toBe(true);
    expect(emitidos).toEqual([]);
  });

  it('should emit a trimmed payload with status when creating', async () => {
    const { formulario, emitidos } = await crearForm();

    formulario.form.patchValue({
      name: '  Laura Gómez  ',
      email: 'laura.gomez@correo.com',
    });
    formulario.submit();

    expect(emitidos).toEqual([
      { name: 'Laura Gómez', email: 'laura.gomez@correo.com', phone: null, status: 'active' },
    ]);
  });

  it('should load the contributor, disable status and send no status when editing', async () => {
    const { formulario, emitidos } = await crearForm(CONTRIBUYENTE);

    expect(formulario.form.controls.name.value).toBe('María Fernanda Ortiz');
    expect(formulario.form.controls.status.disabled).toBe(true);

    formulario.submit();

    expect(emitidos).toEqual([
      { name: 'María Fernanda Ortiz', email: 'maria.ortiz@correo.com', phone: '3001234567' },
    ]);
    expect('status' in emitidos[0]).toBe(false);
  });

  it('should clear the form when resetKey changes even if contributor stays null', async () => {
    const { fixture, formulario } = await crearForm();

    formulario.form.patchValue({ name: 'Borrador sin guardar' });
    fixture.componentRef.setInput('resetKey', 1);
    await fixture.whenStable();

    expect(formulario.form.controls.name.value).toBe('');
  });

  it('should emit cancelled when Cancelar is pressed', async () => {
    const { formulario, compilado } = await crearForm();
    let cancelado = 0;
    formulario.cancelled.subscribe(() => cancelado++);

    const boton = [...compilado.querySelectorAll('button')].find((b) =>
      b.textContent?.includes('Cancelar'),
    ) as HTMLButtonElement;
    boton.click();

    expect(cancelado).toBe(1);
  });
});
