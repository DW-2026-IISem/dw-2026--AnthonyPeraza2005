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

#### **2.5 — Verificar arranque base**

![](images/clipboard-1249128542.png)

## **FASE 3 — `02_BASE_ESTRUCTURA_CA`**

### **Estructura de carpetas Clean Architecture**

> **Objetivo de la fase:** Crear el mapa mental: config / common / infrastructure / features (business + auth).

#### **3.1 — Crear árbol base de carpetas**

![](images/clipboard-529769721.png)

## **FASE 4 — `03_BASE_ENTORNO_ENV`**

### **Configuración del entorno tipado (multi-base)**

**Objetivo de la fase:** Centralizar variables en `.env`: selector `DB_DIALECT` y un bloque de credenciales por motor (MySQL, PostgreSQL, SQL Server, Oracle). Validar antes del boot.

#### **4.1 — Crear `.env.example` y actualizar `.env` completo**

![](images/clipboard-1628961092.png)

![](images/clipboard-3577020004.png)
