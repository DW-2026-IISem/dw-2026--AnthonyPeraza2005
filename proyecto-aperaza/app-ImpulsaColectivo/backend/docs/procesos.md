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

#### **5.7 — Factory Sequelize (sin modelos aún)**

![](images/clipboard-3980053486.png)

#### **5.8 — DatabaseSeederService (sin seeders aún)**

![](images/clipboard-1079217216.png)

#### **5.9 — Módulo global Sequelize**

![](images/clipboard-1776874744.png)

#### **5.10 — Verificar conexión a BD**

![](images/clipboard-2896360579.png)

## **FASE 6 — `05_BASE_APP_COMMON_SECURITY`**

### **App config + Logger + Common + Security + bootstrap**

**Objetivo de la fase:** Dejar la infraestructura transversal lista antes de la primera entidad de negocio. Aún sin Business/Auth en AppModule y sin guards globales.

#### **6.1 — config/app/app.constants.ts**

![](images/clipboard-80136172.png)

#### **6.2 — config/app/app.config.ts**

![](images/clipboard-1223698598.png)

#### **6.3 — config/logger/logger.config.ts**

![](images/clipboard-568634298.png)

#### **6.4 — config/logger/logger.module.ts**

![](images/clipboard-3497754217.png)

#### **6.5 — config/jwt/jwt.constants.ts**

![](images/clipboard-1053830225.png)

#### **6.6 — config/jwt/jwt.config.ts**

![](images/clipboard-3680077591.png)

#### **6.7 — config/swagger/swagger.constants.ts**

![](images/clipboard-2386288496.png)

#### **6.8 — config/swagger/swagger.config.ts**

![](images/clipboard-1622750291.png)

#### **6.9 — common/enums/status.enum.ts**

![](images/clipboard-2194309287.png)

#### **6.10 — common/enums/http-method.enum.ts**

![](images/clipboard-1703526716.png)

#### **6.11 — common/enums/sort-order.enum.ts**

![](images/clipboard-3326153095.png)

#### **6.12 — common/constants/app.constants.ts**

![](images/clipboard-84231166.png)

#### **6.13 — common/constants/pagination.constants.ts**

![](images/clipboard-4191902985.png)

#### **6.14 — common/exceptions/application.exception.ts**

![](images/clipboard-2038352167.png)

#### **6.15 — common/exceptions/domain.exception.ts**

![](images/clipboard-794842332.png)

#### **6.16 — common/exceptions/entity-not-found.exception.ts**

![](images/clipboard-30458597.png)

#### **6.17 — common/exceptions/validation.exception.ts**

![](images/clipboard-637558669.png)

#### **6.18 — common/filters/global-exception.filter.ts**

![](images/clipboard-4272781397.png)

#### **6.19 — common/filters/sequelize-exception.filter.ts**

![](images/clipboard-1777495461.png)

#### **6.20 — common/interceptors/response.interceptor.ts**

![](images/clipboard-1066199738.png)

#### **6.21 — common/interceptors/logging.interceptor.ts**

![](images/clipboard-2451364036.png)

#### **6.22 — common/interceptors/timeout.interceptor.ts**

![](images/clipboard-3656896737.png)

#### **6.23 — common/pipes/validation.pipe.ts**

![](images/clipboard-4027692656.png)

#### **6.24 — common/pipes/parse-positive-int.pipe.ts**

![](images/clipboard-2535195318.png)

#### **6.25 — common/decorators/public.decorator.ts**

![](images/clipboard-1438646263.png)

#### **6.26 — common/decorators/roles.decorator.ts**

![](images/clipboard-3032542032.png)

#### **6.27 — common/decorators/current-user.decorator.ts**

![](images/clipboard-1274869102.png)

#### **6.28 — common/decorators/resource.decorator.ts**

![](images/clipboard-3936252324.png)

#### **6.29 — common/interfaces/authenticated-user.interface.ts**

![](images/clipboard-1315738991.png)

#### **6.30 — common/interfaces/pagination.interface.ts**

![](images/clipboard-2724381384.png)

#### **6.31 — common/interfaces/api-response.interface.ts**

![](images/clipboard-1676581495.png)

#### **6.32 — common/types/nullable.type.ts**

![](images/clipboard-505113896.png)

#### **6.33 — common/types/optional.type.ts**

![](images/clipboard-2198320955.png)

#### **6.34 — common/utils/pagination.util.ts**

![](images/clipboard-995979615.png)

#### **6.35 — common/utils/date.util.ts**

![](images/clipboard-468628663.png)

#### **6.36 — common/utils/string.util.ts**

![](images/clipboard-1655693341.png)

#### **6.37 — infrastructure/security/hashing/password-hasher.interface.ts**

![](images/clipboard-246770979.png)

#### **6.38 — infrastructure/security/hashing/bcrypt-password-hasher.service.ts**

![](images/clipboard-2281188192.png)

#### **6.39 — infrastructure/security/tokens/token.interface.ts**

![](images/clipboard-3456957889.png)

#### **6.40 — infrastructure/security/tokens/token.service.ts**

![](images/clipboard-3841710709.png)

#### **6.41 — infrastructure/security/security.module.ts**

![](images/clipboard-2122438720.png)

#### **6.42 — Actualizar main.ts (bootstrap completo)**

![](images/clipboard-4073901082.png)

#### **6.43 — Actualizar app.module.ts (base sin features ni guards)**

![](images/clipboard-3550428840.png)
