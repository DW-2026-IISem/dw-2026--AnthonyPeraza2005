import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../environments/environment';
import { Contribution } from '../core/models/contribution.model';
import { Project } from '../core/models/project.model';
import { SessionStore } from '../core/services/session-store';
import { grantAccess } from '../core/testing/access';
import { ContributionList } from './contributions/contribution-list/contribution-list';

const API = environment.apiUrl;
const CONTRIBUCIONES = `${API}/contribuciones`;
const PROYECTOS = `${API}/proyectos`;
const CONTRIBUYENTES = `${API}/contribuyentes`;

const PROYECTOS_DATA: Project[] = [
  {
    id: 1,
    title: 'Huerta escolar Uribia',
    description: 'Huerta con riego por goteo para la escuela rural',
    start_date: '2026-10-01',
    end_date: '2027-02-28',
    promoter_id: 1,
    status: 'active',
  },
];

const CONTRIBUCIONES_DATA: Contribution[] = [
  {
    id: 1,
    amount: '150000.00',
    contribution_date: '2026-10-05',
    project_id: 1,
    contributor_id: 1,
    status: 'active',
  },
];

const LECTURA = ['GET /api/contribuciones', 'GET /api/proyectos'];

describe('Botones según el permiso', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  /** Abre la lista de contribuciones con solo estos permisos y devuelve su DOM. */
  async function abrir(...permisos: string[]): Promise<HTMLElement> {
    grantAccess(TestBed.inject(SessionStore), ...permisos);

    const fixture = TestBed.createComponent(ContributionList);
    http.expectOne(CONTRIBUCIONES).flush({ contributions: CONTRIBUCIONES_DATA });
    http.expectOne(PROYECTOS).flush({ projects: PROYECTOS_DATA });
    if (permisos.includes('GET /api/contribuyentes')) {
      http.expectOne(CONTRIBUYENTES).flush({ contributors: [] });
    }

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    return fixture.nativeElement as HTMLElement;
  }

  const boton = (raiz: HTMLElement, etiqueta: string) =>
    raiz.querySelector(`button[aria-label="${etiqueta}"]`);

  const hayCrear = (raiz: HTMLElement) =>
    Array.from(raiz.querySelectorAll('button')).some((b) =>
      (b.textContent ?? '').includes('Nueva contribución'),
    );

  it('should show every action to a role with full write access', async () => {
    const raiz = await abrir(
      ...LECTURA,
      'GET /api/contribuyentes',
      'POST /api/contribuciones',
      'PATCH /api/contribuciones/:id',
      'PATCH /api/contribuciones/:id/deactivate',
      'DELETE /api/contribuciones/:id',
    );

    expect(hayCrear(raiz)).toBe(true);
    expect(boton(raiz, 'Editar contribución')).not.toBeNull();
    expect(boton(raiz, 'Dar de baja a la contribución')).not.toBeNull();
    expect(boton(raiz, 'Eliminar contribución')).not.toBeNull();
  });

  it('should show no write action to a read-only role', async () => {
    const raiz = await abrir(...LECTURA);

    expect(hayCrear(raiz)).toBe(false);
    expect(boton(raiz, 'Editar contribución')).toBeNull();
    expect(boton(raiz, 'Dar de baja a la contribución')).toBeNull();
    expect(boton(raiz, 'Eliminar contribución')).toBeNull();
  });

  it('should hide the create button when the role cannot read contributors', async () => {
    const raiz = await abrir(...LECTURA, 'POST /api/contribuciones');

    expect(hayCrear(raiz)).toBe(false);
  });

  it('should show only the edit button when the role can only PATCH', async () => {
    const raiz = await abrir(...LECTURA, 'PATCH /api/contribuciones/:id');

    expect(boton(raiz, 'Editar contribución')).not.toBeNull();
    expect(boton(raiz, 'Dar de baja a la contribución')).toBeNull();
    expect(boton(raiz, 'Eliminar contribución')).toBeNull();
  });

  it('should show only the delete button when the role can only DELETE', async () => {
    const raiz = await abrir(...LECTURA, 'DELETE /api/contribuciones/:id');

    expect(boton(raiz, 'Eliminar contribución')).not.toBeNull();
    expect(boton(raiz, 'Editar contribución')).toBeNull();
    expect(boton(raiz, 'Dar de baja a la contribución')).toBeNull();
  });
});
