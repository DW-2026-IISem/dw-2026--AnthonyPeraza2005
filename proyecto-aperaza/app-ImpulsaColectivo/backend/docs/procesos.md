# Proceso manual de backend

**Objetivo de la fase:** Dejar el esqueleto oficial Nest corriendo en un puerto libre, con Git inicial.

## 1.1 Crear carpeta ![](images/clipboard-2577174203.png)

## **1.2 — Instalar Nest CLI (si no existe)** ![](images/clipboard-2256785914.png) **1.3 — Crear proyecto NestJS**

![](images/clipboard-3660125353.png)

#### **1.4 — Crear `.env` mínimo (puerto)**

![](images/clipboard-3065097918.png)

## **FASE 2 — `01_BASE_DEPS_Y_PUERTO`**

**Objetivo de la fase:** Instalar el stack profesional y evitar que un `start:dev` colgado bloquee el puerto.

#### **2.1 — Dependencias de producción**

![](images/clipboard-2674015011.png)

#### **2.2 — Dependencias de desarrollo**

![](images/clipboard-3175577465.png)

#### **2.3 — Script para liberar puerto (evita EADDRINUSE)**

![](images/clipboard-3038469083.png)

#### **2.4 — Actualizar scripts npm en package.json**

![](images/clipboard-1017259150.png)
