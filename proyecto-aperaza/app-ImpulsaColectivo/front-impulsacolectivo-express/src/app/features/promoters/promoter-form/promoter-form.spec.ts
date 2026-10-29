import { TestBed } from '@angular/core/testing';
import { Promoter, PromoterPayload } from '../../../core/models/promoter.model';
import { PromoterForm } from './promoter-form';

const PROMOTOR: Promoter = {
  id: 1,
  name: 'Fundación Semillas del Caribe',
  description: 'Educación rural en La Guajira',
  contact_email: 'contacto@semillas.org',
  contact_phone: '3001234567',
  status: 'active',
};

describe('PromoterForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PromoterForm] }).compileComponents();
  });

  async function crearForm(promoter: Promoter | null = null) {
    const fixture = TestBed.createComponent(PromoterForm);
    fixture.componentRef.setInput('promoter', promoter);
    await fixture.whenStable();

    const formulario = fixture.componentInstance;
    const emitidos: PromoterPayload[] = [];
    formulario.saved.subscribe((payload) => emitidos.push(payload));

    return { fixture, formulario, emitidos, compilado: fixture.nativeElement as HTMLElement };
  }

  it('should start empty and active in create mode', async () => {
    const { formulario } = await crearForm();

    expect(formulario.form.getRawValue()).toEqual({
      name: '',
      description: '',
      contact_email: '',
      contact_phone: '',
      status: 'active',
    });
    expect(formulario.form.controls.status.enabled).toBe(true);
  });

  it('should not emit and should mark fields as touched when required fields are empty', async () => {
    const { formulario, emitidos } = await crearForm();

    formulario.submit();

    expect(emitidos).toEqual([]);
    expect(formulario.form.controls.name.touched).toBe(true);
    expect(formulario.form.controls.contact_email.touched).toBe(true);
  });

  it('should reject an invalid email', async () => {
    const { formulario, emitidos } = await crearForm();

    formulario.form.patchValue({ name: 'Colectivo Huerta Viva', contact_email: 'no-es-correo' });
    formulario.submit();

    expect(formulario.form.controls.contact_email.invalid).toBe(true);
    expect(emitidos).toEqual([]);
  });

  it('should emit a trimmed payload with status when creating', async () => {
    const { formulario, emitidos } = await crearForm();

    formulario.form.patchValue({
      name: '  Colectivo Huerta Viva  ',
      contact_email: 'hola@huertaviva.org',
    });
    formulario.submit();

    expect(emitidos).toEqual([
      {
        name: 'Colectivo Huerta Viva',
        description: null,
        contact_email: 'hola@huertaviva.org',
        contact_phone: null,
        status: 'active',
      },
    ]);
  });

  it('should load the promoter, disable status and send no status when editing', async () => {
    const { formulario, emitidos } = await crearForm(PROMOTOR);

    expect(formulario.form.controls.name.value).toBe('Fundación Semillas del Caribe');
    expect(formulario.form.controls.status.disabled).toBe(true);

    formulario.submit();

    expect(emitidos).toEqual([
      {
        name: 'Fundación Semillas del Caribe',
        description: 'Educación rural en La Guajira',
        contact_email: 'contacto@semillas.org',
        contact_phone: '3001234567',
      },
    ]);
    expect('status' in emitidos[0]).toBe(false);
  });

  it('should clear the form when resetKey changes even if promoter stays null', async () => {
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
