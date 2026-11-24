import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../../environments/environment';
import { ResourceRole } from '../../../../core/models/resource-role.model';
import { Resource } from '../../../../core/models/resource.model';
import { Role } from '../../../../core/models/role.model';
import { SessionStore } from '../../../../core/services/session-store';
import { grantAccess } from '../../../../core/testing/access';
import { MatrixOperation } from '../permission-matrix';
import { PermissionMatrixPage } from './permission-matrix-page';

const BASE = `${environment.apiUrl}/concesiones-rol`;
const ROLES_URL = `${environment.apiUrl}/roles`;
const RECURSOS_URL = `${environment.apiUrl}/recursos`;

const ROLES = [
  { id: 1, name: 'ADMIN', description: null, status: 'active' },
  { id: 2, name: 'PROMOTER', description: null, status: 'active' },
  { id: 3, name: 'AUDITOR', description: null, status: 'inactive' },
] as Role[];

function recurso(id: number, method: string, path: string, status = 'active'): Resource {
  return { id, method, path, description: null, status } as Resource;
}

const RECURSOS = [
  recurso(1, 'GET', '/api/proyectos'),
  recurso(2, 'GET', '/api/proyectos/:id'),
  recurso(3, 'POST', '/api/proyectos'),
  recurso(4, 'PUT', '/api/proyectos/:id'),
  recurso(5, 'PATCH', '/api/proyectos/:id'),
  recurso(6, 'PATCH', '/api/proyectos/:id/deactivate'),
  recurso(7, 'DELETE', '/api/proyectos/:id'),
  recurso(8, 'GET', '/api/metas'),
  recurso(9, 'POST', '/api/metas'),
  recurso(10, 'GET', '/api/recompensas', 'inactive'),
];

function concesion(
  id: number,
  roleId: number,
  resourceId: number,
  status = 'active',
): ResourceRole {
  return { id, role_id: roleId, resource_id: resourceId, status } as ResourceRole;
}

/** ADMIN tiene todos los recursos activos (1 a 9). */
const GRANTS_ADMIN = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((id) => concesion(id, 1, id));

/** PROMOTER: 1, 2 y 8 activos; el 3 retirado; y uno activo sobre el recurso 10, que está inactivo. */
const GRANTS_PROMOTER = [
  concesion(20, 2, 1),
  concesion(21, 2, 2),
  concesion(22, 2, 8),
  concesion(23, 2, 3, 'inactive'),
  concesion(24, 2, 10),
];

const PERMISOS = [
  'GET /api/concesiones-rol',
  'POST /api/concesiones-rol',
  'GET /api/roles',
  'GET /api/recursos',
];

describe('PermissionMatrixPage', () => {
  let http: HttpTestingController;
  let session: SessionStore;
  let confirmation: ConfirmationService;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    session = TestBed.inject(SessionStore);
    confirmation = TestBed.inject(ConfirmationService);
    grantAccess(session, ...PERMISOS);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  /** La petición de concesiones de un rol lleva `?role_id=`, por eso se busca con función. */
  function grantsRequest(roleId: number) {
    return http.expectOne(
      (req) => req.url === BASE && req.params.get('role_id') === String(roleId),
    );
  }

  async function estabilizar(fixture: ComponentFixture<PermissionMatrixPage>) {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  /** Abre la pantalla; elige sola el primer rol activo (ADMIN). */
  async function abrir(grants: ResourceRole[] = GRANTS_ADMIN) {
    const fixture = TestBed.createComponent(PermissionMatrixPage);
    http.expectOne(ROLES_URL).flush({ roles: ROLES });
    http.expectOne(RECURSOS_URL).flush({ resources: RECURSOS });
    grantsRequest(1).flush({ grants });
    await estabilizar(fixture);
    return fixture;
  }

  /** Abre y cambia a PROMOTER, un rol que el usuario de prueba no tiene. */
  async function abrirPromotor() {
    const fixture = await abrir();
    fixture.componentInstance.chooseRole(2);
    grantsRequest(2).flush({ grants: GRANTS_PROMOTER });
    await estabilizar(fixture);
    return fixture;
  }

  function celda(pagina: PermissionMatrixPage, entidad: string, operacion: MatrixOperation) {
    return pagina.rows().find((fila) => fila.entity === entidad)!.operations[operacion];
  }

  function cambiar(pagina: PermissionMatrixPage, cell: Resource[], checked: boolean) {
    pagina.setCell(cell, { target: { checked } } as unknown as Event);
  }

  function ordenados(ids: ReadonlySet<number>) {
    return [...ids].sort((a, b) => a - b);
  }

  it('should load the catalog, pick the first active role and mark its grants', async () => {
    const pagina = (await abrir()).componentInstance;

    expect(pagina.selectedRoleId()).toBe(1);
    expect(ordenados(pagina.selected())).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(pagina.dirty()).toBe(false);
    expect(pagina.loading()).toBe(false);
    expect(pagina.error()).toBeNull();
  });

  it('should offer only active roles and show only active resources', async () => {
    const pagina = (await abrir()).componentInstance;

    expect(pagina.activeRoles().map((role) => role.name)).toEqual(['ADMIN', 'PROMOTER']);
    expect(pagina.rows().map((fila) => fila.entity)).toEqual(['proyectos', 'metas']);
  });

  it('should ignore inactive grants and grants over inactive resources', async () => {
    const pagina = (await abrirPromotor()).componentInstance;

    // El 23 está retirado y el 24 apunta al recurso 10, que está inactivo.
    expect(ordenados(pagina.selected())).toEqual([1, 2, 8]);
    expect(ordenados(pagina.saved())).toEqual([1, 2, 8]);
  });

  it('should show a partial state when only some resources of a cell are granted', async () => {
    const fixture = await abrir([concesion(1, 1, 1)]);
    const pagina = fixture.componentInstance;

    expect(pagina.state(celda(pagina, 'proyectos', 'read'))).toBe('some');
    expect(pagina.state(celda(pagina, 'proyectos', 'create'))).toBe('none');

    const lectura = fixture.nativeElement.querySelector(
      'input[aria-label="Leer Proyectos"]',
    ) as HTMLInputElement;
    expect(lectura.indeterminate).toBe(true);
  });

  it('should add or remove every resource of a column and track the unsaved changes', async () => {
    const pagina = (await abrirPromotor()).componentInstance;
    const actualizar = celda(pagina, 'proyectos', 'update');

    cambiar(pagina, actualizar, true);
    expect(pagina.state(actualizar)).toBe('all');
    expect(pagina.dirty()).toBe(true);

    cambiar(pagina, actualizar, false);
    expect(pagina.state(actualizar)).toBe('none');
    expect(pagina.dirty()).toBe(false);
  });

  it('should clear the selection while the grants of the new role load', async () => {
    const pagina = (await abrir()).componentInstance;

    pagina.chooseRole(2);
    expect(pagina.selected().size).toBe(0);
    expect(pagina.loadingGrants()).toBe(true);

    grantsRequest(2).flush({ grants: GRANTS_PROMOTER });
    expect(pagina.loadingGrants()).toBe(false);
    expect(ordenados(pagina.selected())).toEqual([1, 2, 8]);
  });

  it('should ignore a stale response when the role changes again', async () => {
    const pagina = (await abrir()).componentInstance;

    pagina.chooseRole(2);
    const viejaPromotor = grantsRequest(2);
    pagina.chooseRole(1);
    const vigenteAdmin = grantsRequest(1);

    viejaPromotor.flush({ grants: GRANTS_PROMOTER });
    expect(pagina.selected().size).toBe(0);
    expect(pagina.loadingGrants()).toBe(true);

    vigenteAdmin.flush({ grants: GRANTS_ADMIN });
    expect(pagina.selected().size).toBe(9);
    expect(pagina.loadingGrants()).toBe(false);
  });

  it('should POST role_id and the full set, announce success and reload the role', async () => {
    const pagina = (await abrirPromotor()).componentInstance;

    cambiar(pagina, celda(pagina, 'metas', 'create'), true);
    pagina.save();

    const alta = http.expectOne(BASE);
    expect(alta.request.method).toBe('POST');
    expect(alta.request.body.role_id).toBe(2);
    expect([...alta.request.body.resource_ids].sort((a: number, b: number) => a - b)).toEqual([
      1, 2, 8, 9,
    ]);
    expect(pagina.saving()).toBe(true);

    alta.flush({
      message: 'Role permissions updated',
      result: { role_id: 2, activated: 1, deactivated: 0, total_active: 4 },
    });
    grantsRequest(2).flush({ grants: [...GRANTS_PROMOTER, concesion(25, 2, 9)] });

    expect(pagina.saving()).toBe(false);
    expect(pagina.saveMessage()).toContain('4 permisos activos');
    expect(pagina.dirty()).toBe(false);
  });

  it('should ask for confirmation before leaving a role without permissions', async () => {
    const pagina = (await abrirPromotor()).componentInstance;
    const confirmar = vi.spyOn(confirmation, 'confirm').mockImplementation((config) => {
      config.accept?.();
      return confirmation;
    });

    pagina.selected.set(new Set());
    pagina.save();

    expect(confirmar.mock.calls[0][0].message).toContain('sin ningún permiso');
    const alta = http.expectOne(BASE);
    expect(alta.request.body).toEqual({ role_id: 2, resource_ids: [] });
    alta.flush({
      message: 'Role permissions updated',
      result: { role_id: 2, activated: 0, deactivated: 3, total_active: 0 },
    });
    grantsRequest(2).flush({ grants: [] });
    expect(pagina.selected().size).toBe(0);
  });

  it('should warn about a role the user has and not save if the user cancels', async () => {
    const pagina = (await abrir()).componentInstance;
    const confirmar = vi.spyOn(confirmation, 'confirm').mockImplementation(() => confirmation);

    cambiar(pagina, celda(pagina, 'proyectos', 'delete'), false);
    pagina.save();

    expect(confirmar.mock.calls[0][0].message).toContain('perder acceso');
    http.expectNone(BASE);
    expect(pagina.saving()).toBe(false);
  });

  it('should show the error and keep the selection when saving fails', async () => {
    const pagina = (await abrirPromotor()).componentInstance;
    const mensajes = vi.spyOn(TestBed.inject(MessageService), 'add');

    cambiar(pagina, celda(pagina, 'metas', 'create'), true);
    pagina.save();
    http
      .expectOne(BASE)
      .flush(
        { error: 'Resources not found or inactive: 9' },
        { status: 400, statusText: 'Bad Request' },
      );

    expect(mensajes).toHaveBeenCalledWith(expect.objectContaining({ severity: 'error' }));
    expect(pagina.saving()).toBe(false);
    expect(pagina.saveMessage()).toBeNull();
    expect(pagina.dirty()).toBe(true);
  });

  it('should not send twice while a save is in progress', async () => {
    const pagina = (await abrirPromotor()).componentInstance;

    cambiar(pagina, celda(pagina, 'metas', 'create'), true);
    pagina.save();
    pagina.save();

    const alta = http.expectOne(BASE);
    alta.flush({
      message: 'Role permissions updated',
      result: { role_id: 2, activated: 1, deactivated: 0, total_active: 4 },
    });
    grantsRequest(2).flush({ grants: GRANTS_PROMOTER });
  });

  it('should restore the saved selection when the changes are discarded', async () => {
    const pagina = (await abrirPromotor()).componentInstance;

    cambiar(pagina, celda(pagina, 'metas', 'create'), true);
    expect(pagina.dirty()).toBe(true);

    pagina.discard();

    expect(pagina.dirty()).toBe(false);
    expect(ordenados(pagina.selected())).toEqual([1, 2, 8]);
  });

  it('should disable the checkboxes and hide Guardar for a read-only role', async () => {
    grantAccess(session, 'GET /api/concesiones-rol', 'GET /api/roles', 'GET /api/recursos');

    const raiz = (await abrir()).nativeElement as HTMLElement;
    const casillas = Array.from(raiz.querySelectorAll<HTMLInputElement>('input[type="checkbox"]'));
    const textos = Array.from(raiz.querySelectorAll('button')).map((b) => b.textContent ?? '');

    expect(casillas.length).toBeGreaterThan(0);
    expect(casillas.every((casilla) => casilla.disabled)).toBe(true);
    expect(textos.some((texto) => texto.includes('Guardar permisos'))).toBe(false);
  });

  it('should not ask for roles or resources when the role cannot read them', async () => {
    grantAccess(session, 'GET /api/concesiones-rol');

    const fixture = TestBed.createComponent(PermissionMatrixPage);
    http.expectNone(ROLES_URL);
    http.expectNone(RECURSOS_URL);
    http.expectNone(BASE);
    await estabilizar(fixture);

    expect(fixture.componentInstance.rows()).toEqual([]);
    expect(fixture.componentInstance.selectedRoleId()).toBeNull();
    expect(fixture.componentInstance.loading()).toBe(false);
    expect(fixture.componentInstance.error()).toBeNull();
  });

  it('should show the error and no matrix when loading fails', async () => {
    const fixture = TestBed.createComponent(PermissionMatrixPage);
    http.expectOne(RECURSOS_URL).flush({ resources: RECURSOS });
    http
      .expectOne(ROLES_URL)
      .flush({ error: 'Fallo' }, { status: 500, statusText: 'Server Error' });
    await estabilizar(fixture);

    expect(fixture.componentInstance.error()).not.toBeNull();
    expect(fixture.componentInstance.loading()).toBe(false);
    expect(fixture.componentInstance.selectedRoleId()).toBeNull();
  });

  it('should give every checkbox an accessible name and mark missing operations', async () => {
    const fixture = await abrir();
    const raiz = fixture.nativeElement as HTMLElement;

    expect(raiz.querySelector('label[for="matrix-role"]')).not.toBeNull();
    expect(raiz.querySelector('input[aria-label="Crear Proyectos"]')).not.toBeNull();
    expect(raiz.querySelector('input[aria-label="Estado Proyectos"]')).not.toBeNull();
    // Metas no tiene Actualizar, Estado ni Eliminar.
    expect(raiz.textContent).toContain('No disponible');
  });

  it('should warn when the selected role is one the user has', async () => {
    const pagina = (await abrir()).componentInstance;

    expect(pagina.isOwnRole()).toBe(true);

    pagina.chooseRole(2);
    grantsRequest(2).flush({ grants: GRANTS_PROMOTER });
    expect(pagina.isOwnRole()).toBe(false);
  });
});
