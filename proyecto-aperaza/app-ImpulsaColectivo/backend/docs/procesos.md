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

#### **4.2 — Interface de entorno**

![](images/clipboard-4240256069.png)

#### **4.3 — Validación de entorno con class-validator**

![](images/clipboard-3482848419.png)

#### **4.4 — Resolver de credenciales por motor**

![](images/clipboard-3662126410.png)

#### **4.5 — Factory registerAs de entorno**

![](images/clipboard-1373557495.png)

## **FASE 5 — `04_BASE_DATABASE_SEQUELIZE`**

### **Base de datos multi-dialecto (Sequelize)**

**Objetivo de la fase:** Conectar Sequelize al motor de `DB_DIALECT` usando el bloque `DB_MYSQL_*` / `DB_POSTGRES_*` / `DB_MSSQL_*` / `DB_ORACLE_*`. Aún sin features (ALL_MODELS vacío).

#### **5.1 — Constante SEQUELIZE_TOKEN**

![](images/clipboard-7621658.png)

#### **5.2 — Tipos auxiliares de database config**

![](images/clipboard-3758819939.png)

#### **5.3 — database.config.ts**

![](images/clipboard-1888925283.png)

#### **5.4 — database.module.ts / providers**

![](images/clipboard-883030450.png)

#### **5.5 — database.providers.ts**

![](images/clipboard-695604034.png)

#### **5.6 — Opciones Sequelize por dialecto**

![](images/clipboard-605050768.png)
