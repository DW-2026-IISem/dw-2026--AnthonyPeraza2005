import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Resource, ResourcePayload } from '../../../../core/models/resource.model';
import { ResourceForm } from './resource-form';

const LISTAR_PROYECTOS = {
  id: 7,
  path: '/api/proyectos',
  method: 'GET',
  description: 'Listar proyectos',
  status: 'active',
} as Resource;

describe('ResourceForm', () => {
  let fixture: ComponentFixture<ResourceForm>;
  let form: ResourceForm;

  async function estabilizar() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
    fixture = TestBed.createComponent(ResourceForm);
    form = fixture.componentInstance;
    await estabilizar();
  });

  it('should start in create mode with GET and the status enabled', () => {
    expect(form.form.controls.method.value).toBe('GET');
    expect(form.form.controls.status.enabled).toBe(true);
    expect(form.form.controls.path.value).toBe('');
  });

  it('should disable the status when editing', async () => {
    fixture.componentRef.setInput('resource', LISTAR_PROYECTOS);
    await estabilizar();

    expect(form.form.controls.path.value).toBe('/api/proyectos');
    expect(form.form.controls.status.disabled).toBe(true);
  });

  it('should reject a path that does not start with a slash', () => {
    const saved = vi.fn();
    form.saved.subscribe(saved);

    form.form.patchValue({ path: 'api/proyectos' });
    form.submit();

    expect(saved).not.toHaveBeenCalled();
    expect(form.form.controls.path.errors?.['pattern']).toBeTruthy();
    expect(form.form.controls.path.touched).toBe(true);
  });

  it('should emit the create payload with status', () => {
    const saved = vi.fn<(payload: ResourcePayload) => void>();
    form.saved.subscribe(saved);

    form.form.patchValue({
      path: '/api/recompensas ',
      method: 'POST',
      description: ' Crear recompensas ',
    });
    form.submit();

    expect(saved).toHaveBeenCalledWith({
      path: '/api/recompensas',
      method: 'POST',
      description: 'Crear recompensas',
      status: 'active',
    });
  });

  it('should emit the edit payload without status', async () => {
    const saved = vi.fn<(payload: ResourcePayload) => void>();
    form.saved.subscribe(saved);

    fixture.componentRef.setInput('resource', LISTAR_PROYECTOS);
    await estabilizar();
    form.form.patchValue({ description: 'Listar proyectos del panel' });
    form.submit();

    expect(saved).toHaveBeenCalledWith({
      path: '/api/proyectos',
      method: 'GET',
      description: 'Listar proyectos del panel',
    });
  });

  it('should empty the form when resetKey changes', async () => {
    form.form.patchValue({ path: '/restos', method: 'DELETE' });

    fixture.componentRef.setInput('resetKey', 1);
    await estabilizar();

    expect(form.form.controls.path.value).toBe('');
    expect(form.form.controls.method.value).toBe('GET');
  });

  it('should emit cancelled', () => {
    const cancelled = vi.fn();
    form.cancelled.subscribe(cancelled);

    form.cancelled.emit();

    expect(cancelled).toHaveBeenCalledTimes(1);
  });
});
