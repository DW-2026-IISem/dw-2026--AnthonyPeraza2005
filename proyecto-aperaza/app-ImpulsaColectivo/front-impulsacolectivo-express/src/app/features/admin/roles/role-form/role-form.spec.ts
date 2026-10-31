import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Role, RolePayload } from '../../../../core/models/role.model';
import { RoleForm } from './role-form';

const PROMOTOR = {
  id: 2,
  name: 'PROMOTER',
  description: 'Gestiona sus campañas',
  status: 'active',
} as Role;

describe('RoleForm', () => {
  let fixture: ComponentFixture<RoleForm>;
  let form: RoleForm;

  async function estabilizar() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
    fixture = TestBed.createComponent(RoleForm);
    form = fixture.componentInstance;
    await estabilizar();
  });

  it('should start in create mode with the status enabled', () => {
    expect(form.form.controls.status.enabled).toBe(true);
    expect(form.form.controls.name.value).toBe('');
  });

  it('should disable the status when editing', async () => {
    fixture.componentRef.setInput('role', PROMOTOR);
    await estabilizar();

    expect(form.form.controls.name.value).toBe('PROMOTER');
    expect(form.form.controls.status.disabled).toBe(true);
  });

  it('should not emit and should mark the fields as touched when invalid', () => {
    const saved = vi.fn();
    form.saved.subscribe(saved);

    form.submit();

    expect(saved).not.toHaveBeenCalled();
    expect(form.form.controls.name.touched).toBe(true);
  });

  it('should emit the create payload with status', () => {
    const saved = vi.fn<(payload: RolePayload) => void>();
    form.saved.subscribe(saved);

    form.form.patchValue({
      name: '  coordinador ',
      description: 'Acompaña a los promotores',
    });
    form.submit();

    expect(saved).toHaveBeenCalledWith({
      name: 'coordinador',
      description: 'Acompaña a los promotores',
      status: 'active',
    });
  });

  it('should emit the edit payload without status', async () => {
    const saved = vi.fn<(payload: RolePayload) => void>();
    form.saved.subscribe(saved);

    fixture.componentRef.setInput('role', PROMOTOR);
    await estabilizar();
    form.form.patchValue({ description: '' });
    form.submit();

    expect(saved).toHaveBeenCalledWith({ name: 'PROMOTER', description: null });
  });

  it('should empty the form when resetKey changes', async () => {
    form.form.controls.name.setValue('restos del intento anterior');

    fixture.componentRef.setInput('resetKey', 1);
    await estabilizar();

    expect(form.form.controls.name.value).toBe('');
  });

  it('should emit cancelled', () => {
    const cancelled = vi.fn();
    form.cancelled.subscribe(cancelled);

    form.cancelled.emit();

    expect(cancelled).toHaveBeenCalledTimes(1);
  });
});
