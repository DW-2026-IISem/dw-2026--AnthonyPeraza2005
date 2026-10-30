import { TestBed } from '@angular/core/testing';
import { Project } from '../../../core/models/project.model';
import { ProjectAudit, ProjectAuditPayload } from '../../../core/models/project-audit.model';
import { todayIso, toIsoDate } from '../../../core/utils/iso-date';
import { ProjectAuditForm } from './project-audit-form';

const PROYECTO: Project = {
  id: 1,
  title: 'Biblioteca comunitaria Riohacha',
  description: 'Dotar de libros y mobiliario a una biblioteca barrial',
  start_date: '2026-10-01',
  end_date: '2027-02-28',
  promoter_id: 1,
  status: 'active',
};

const AUDITORIA: ProjectAudit = {
  id: 1,
  action: 'Verificación de gastos',
  detail: 'Se contrastaron las facturas de compra de libros con el presupuesto aprobado',
  audit_date: '2026-10-15',
  project_id: 1,
  status: 'active',
};

describe('ProjectAuditForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ProjectAuditForm] }).compileComponents();
  });

  async function crearForm(audit: ProjectAudit | null = null) {
    const fixture = TestBed.createComponent(ProjectAuditForm);
    fixture.componentRef.setInput('audit', audit);
    fixture.componentRef.setInput('projects', [PROYECTO]);
    await fixture.whenStable();

    const formulario = fixture.componentInstance;
    const emitidos: ProjectAuditPayload[] = [];
    formulario.saved.subscribe((payload) => emitidos.push(payload));

    return { fixture, formulario, emitidos, compilado: fixture.nativeElement as HTMLElement };
  }

  it('should start in create mode with today as date and active status', async () => {
    const { formulario } = await crearForm();
    const valor = formulario.form.getRawValue();

    expect(valor.project_id).toBeNull();
    expect(valor.action).toBe('');
    expect(valor.detail).toBe('');
    expect(valor.status).toBe('active');
    expect(toIsoDate(valor.audit_date as Date)).toBe(todayIso());
    expect(formulario.form.controls.status.enabled).toBe(true);
  });

  it('should not emit and should mark fields as touched when required fields are empty', async () => {
    const { formulario, emitidos } = await crearForm();

    formulario.submit();

    expect(emitidos).toEqual([]);
    expect(formulario.form.controls.project_id.touched).toBe(true);
    expect(formulario.form.controls.action.touched).toBe(true);
    expect(formulario.form.controls.detail.touched).toBe(true);
  });

  it('should not emit when the date is cleared', async () => {
    const { formulario, emitidos } = await crearForm();

    formulario.form.patchValue({
      project_id: 1,
      action: 'Visita de campo',
      detail: 'Se visitó el predio',
      audit_date: null,
    });
    formulario.submit();

    expect(formulario.form.controls.audit_date.invalid).toBe(true);
    expect(emitidos).toEqual([]);
  });

  it('should emit a trimmed payload with an ISO date and status when creating', async () => {
    const { formulario, emitidos } = await crearForm();

    formulario.form.patchValue({
      project_id: 1,
      action: '  Visita de campo  ',
      detail: '  Se visitó el predio de la huerta  ',
      audit_date: new Date(2026, 9, 20), // 20/oct/2026, hora local
    });
    formulario.submit();

    expect(emitidos).toEqual([
      {
        action: 'Visita de campo',
        detail: 'Se visitó el predio de la huerta',
        audit_date: '2026-10-20', // sin desfase por zona horaria
        project_id: 1,
        status: 'active',
      },
    ]);
    expect(typeof emitidos[0].project_id).toBe('number');
  });

  it('should load the audit, disable status and send no status when editing', async () => {
    const { formulario, emitidos } = await crearForm(AUDITORIA);

    expect(formulario.form.controls.status.disabled).toBe(true);

    formulario.submit();

    expect(emitidos).toEqual([
      {
        action: 'Verificación de gastos',
        detail: 'Se contrastaron las facturas de compra de libros con el presupuesto aprobado',
        audit_date: '2026-10-15',
        project_id: 1,
      },
    ]);
    expect('status' in emitidos[0]).toBe(false);
  });

  it('should clear the form when resetKey changes even if audit stays null', async () => {
    const { fixture, formulario } = await crearForm();

    formulario.form.patchValue({ detail: 'Borrador sin guardar' });
    fixture.componentRef.setInput('resetKey', 1);
    await fixture.whenStable();

    expect(formulario.form.controls.detail.value).toBe('');
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
