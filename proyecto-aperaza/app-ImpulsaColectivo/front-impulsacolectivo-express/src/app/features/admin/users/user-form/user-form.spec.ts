import { ComponentFixture, TestBed } from '@angular/core/testing';
import { User, UserPayload } from '../../../../core/models/user.model';
import { UserForm } from './user-form';

const PROMOTOR = {
  id: 2,
  username: 'promoter',
  email: 'promoter@impulsacolectivo.org',
  avatar: null,
  status: 'active',
} as User;

describe('UserForm', () => {
  let fixture: ComponentFixture<UserForm>;
  let form: UserForm;

  async function estabilizar() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
    fixture = TestBed.createComponent(UserForm);
    form = fixture.componentInstance;
    await estabilizar();
  });

  it('should start in create mode with password and status enabled', () => {
    expect(form.form.controls.password.enabled).toBe(true);
    expect(form.form.controls.status.enabled).toBe(true);
    expect(form.form.controls.username.value).toBe('');
  });

  it('should disable password and status when editing', async () => {
    fixture.componentRef.setInput('user', PROMOTOR);
    await estabilizar();

    expect(form.form.controls.username.value).toBe('promoter');
    expect(form.form.controls.password.disabled).toBe(true);
    expect(form.form.controls.status.disabled).toBe(true);
  });

  it('should not emit and should mark the fields as touched when invalid', () => {
    const saved = vi.fn();
    form.saved.subscribe(saved);

    form.submit();

    expect(saved).not.toHaveBeenCalled();
    expect(form.form.controls.username.touched).toBe(true);
  });

  it('should emit the create payload with password and status', () => {
    const saved = vi.fn<(payload: UserPayload) => void>();
    form.saved.subscribe(saved);

    form.form.patchValue({
      username: '  maria.ortiz ',
      email: 'maria.ortiz@impulsacolectivo.org',
      password: 'Clave12345',
    });
    form.submit();

    expect(saved).toHaveBeenCalledWith({
      username: 'maria.ortiz',
      email: 'maria.ortiz@impulsacolectivo.org',
      avatar: null,
      status: 'active',
      password: 'Clave12345',
    });
  });

  it('should emit the edit payload without password or status', async () => {
    const saved = vi.fn<(payload: UserPayload) => void>();
    form.saved.subscribe(saved);

    fixture.componentRef.setInput('user', PROMOTOR);
    await estabilizar();
    form.form.patchValue({ username: 'promoter.riohacha' });
    form.submit();

    expect(saved).toHaveBeenCalledWith({
      username: 'promoter.riohacha',
      email: 'promoter@impulsacolectivo.org',
      avatar: null,
    });
  });

  it('should empty the form when resetKey changes', async () => {
    form.form.controls.username.setValue('restos del intento anterior');

    fixture.componentRef.setInput('resetKey', 1);
    await estabilizar();

    expect(form.form.controls.username.value).toBe('');
  });

  it('should emit cancelled', () => {
    const cancelled = vi.fn();
    form.cancelled.subscribe(cancelled);

    form.cancelled.emit();

    expect(cancelled).toHaveBeenCalledTimes(1);
  });
});
