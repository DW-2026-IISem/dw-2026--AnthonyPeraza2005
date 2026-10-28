import { Component, computed, effect, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';

/** Objeto de demostración: un proyecto de crowdfunding (no es el modelo de la API). */
export interface ProyectoDemo {
  nombre: string;
  meta: number;
  activo: boolean;
}

/**
 * Componente didáctico de ISS-01.
 *
 * Muestra un objeto guardado en un `signal`, valores derivados con `computed`
 * y un registro en consola con `effect`. No es una pantalla de negocio.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-ejemplo',
  imports: [ButtonModule, CardModule, InputTextModule, MessageModule, TagModule],
  templateUrl: './ejemplo.html',
  styleUrl: './ejemplo.css',
})
export class Ejemplo {
  // ESTADO: el signal guarda un objeto completo.
  protected readonly proyecto = signal<ProyectoDemo>(proyectoInicial());

  // DERIVADOS: se calculan desde `proyecto()`, nunca se asignan.
  protected readonly metaConComision = computed(() =>
    Math.round(this.proyecto().meta * 1.05),
  );
  protected readonly estadoTexto = computed(() =>
    this.proyecto().activo ? 'Activo' : 'Inactivo',
  );

  // EFECTO: se ejecuta al crear y en cada cambio del objeto.
  private readonly registro = effect(() => {
    const { nombre, meta, activo } = this.proyecto();
    console.log(`[ejemplo] ${nombre} · meta ${meta} · ${activo ? 'activo' : 'inactivo'}`);
  });

  protected cambiarNombre(event: Event): void {
    const nombre = (event.target as HTMLInputElement).value;
    this.proyecto.update((actual) => ({ ...actual, nombre }));
  }

  protected variarMeta(delta: number): void {
    this.proyecto.update((actual) => ({
      ...actual,
      meta: Math.max(0, actual.meta + delta),
    }));
  }

  protected alternarEstado(): void {
    this.proyecto.update((actual) => ({ ...actual, activo: !actual.activo }));
  }

  protected reiniciar(): void {
    this.proyecto.set(proyectoInicial());
  }
}

/** Función auxiliar: evita compartir el mismo objeto entre el estado inicial y el reinicio. */
function proyectoInicial(): ProyectoDemo {
  return { nombre: 'Biblioteca comunitaria Riohacha', meta: 2000000, activo: true };
}
