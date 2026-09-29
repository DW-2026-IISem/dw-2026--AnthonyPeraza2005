# **Manual — app-ImpulsaColectivo-express**

# **1. ISS-00 — Requisitos previos**

![](images/clipboard-2110780702.png)

# **2. ISS-01 — Esqueleto del proyecto**

### **Criterios de aceptación (ISS-01) — consolidados**

- [ ] **2.1** Existe `package.json` con `"type": "commonjs"` y scripts `build` / `dev`

- [ ] **2.2** Árbol `src/` con `config`, `database/seeders`, `routes`, `features/business/client` (auth **fuera de alcance** de este lab)

- [ ] **2.3** Dependencias Express/TS instaladas (`npm ls --depth=0`)

- [ ] **2.4** Existe `tsconfig.json` (`rootDir: ./src`, `outDir: ./dist`, `strict: true`)

- [ ] **2.5** Existen `src/server.ts` y `src/config/index.ts` (esqueleto App)

- [ ] `npx tsc --noEmit` sin errores al cerrar el ISS

## **2.1 Inicializar npm y scripts**

![](images/clipboard-2240156546.png)

### **Paso 1.2 — Reemplazar `package.json` con los scripts y metadata definitivos**

![](images/clipboard-1194523339.png)

### **Paso 1.3 — Instalar dependencias de producción**

![](images/clipboard-595099715.png)

![](images/clipboard-287997375.png)

### **Paso 1.4 — Instalar dependencias de desarrollo**

![](images/clipboard-2493403805.png)

### **Paso 1.5 — Crear `tsconfig.json`**

![](images/clipboard-4285858096.png)

### **Paso 1.6 — Crear `.gitignore`**

![](images/clipboard-3622711439.png)

### **Paso 1.7 — Crear estructura de carpetas base**

![](images/clipboard-3220417751.png)

### Paso 1.8

### **paso 1.8.1 crear `src/server.ts`**

![](images/clipboard-3310508528.png)

### paso 1.8.2 **Paso — crear `src/config/index.ts` (esqueleto App)**

![](images/clipboard-2349572382.png)

### **Verificación del ISS-01**

![](images/clipboard-1683536450.png)

# **3. ISS-02 — Infraestructura de base de datos**

**Objetivo:** drivers + `.env` + módulo Sequelize + carpeta `seeders/`.\
**Bloqueado por:** ISS-01.

### **Criterios de aceptación (ISS-02) — consolidados**

- [ ] **3.1** Paquetes Sequelize/drivers instalados; existe `.env` con `DB_ENGINE` y bloques de motores

- [ ] **3.2** Existe `src/database/db.ts` exportando `sequelize`, `getDatabaseInfo`, `testConnection`

- [ ] **3.3** Existe carpeta `src/database/seeders/` **sin** lógica implementada aún

- [ ] `npx tsc --noEmit` OK

### **3.1 Drivers Sequelize y `.env`**

![](images/clipboard-2611525330.png)

## **3.2 Configuración Sequelize (`database/db.ts`)**

![](images/clipboard-744334375.png)

## **3.3 Carpeta seeders (reservada)**

![](images/clipboard-199297218.png)

### **Verificación del ISS-02**

![](images/clipboard-1274851386.png)

### **Cierre del ISS**

![](images/clipboard-2601699514.png)

### ISS-03-A — Feature Promoter — fundación

### 4.1 — Modelo Promoter

![](images/clipboard-1390301091.png)

### **4.2 — Esqueleto controller/routes + carpeta `http/`**

![](images/clipboard-3151657891.png)

### Crear el controller (esqueleto):

![](images/clipboard-3580017838.png)

### Crear las rutas (esqueleto):

![](images/clipboard-3951296814.png)

### **4.3 — Agregador de rutas + PARCHE a `config/index.ts`**

**PARCHE** sobre `src/config/index.ts` (ya existe desde ISS-01):

#### **1)** Debajo de `var cors = require("cors");`, añade:

![](images/clipboard-165591944.png)

#### **2)** Dentro de `export class App`, debajo de `public app: Application;`, añade:

![](images/clipboard-2090795408.png)

#### **3)** Dentro de `routes()`, reemplaza `// ISS-03 §4.3` por:

![](images/clipboard-3089428004.png)

#### **4)** Dentro de `dbConnection()`, reemplaza `// ISS-02 / ISS-03` por:

![](images/clipboard-1940768148.png)

### **Verificación ISS-03-A**

![](images/clipboard-1858432371.png)

### **Cierre del ISS**

![](images/clipboard-2601372.png)

![](images/clipboard-3152164095.png)

## ISS-03-B — Feature Promoter — GetAll y GetOne

**PARCHE** sobre `src/features/business/promoter/promoter.controller.ts`: abre el archivo y, **debajo de** `// ================== READ ==================` (y **encima de** `// ================== CREATE ==================`), agrega:

![](images/clipboard-2266266592.png)

#### **PARCHE** sobre `src/features/business/promoter/promoter.routes.ts`: **debajo de** `// ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================`, agrega:

![](images/clipboard-2153241801.png)

#### Archivo nuevo — `.http`

![](images/clipboard-1156497546.png)

#### **Verificación:**

![](images/clipboard-841046219.png)

### **Cierre del ISS**

![](images/clipboard-3030102832.png)

### ISS-03-C — Feature Promoter — Crear promotor

**PARCHE** sobre `src/features/business/promoter/promoter.controller.ts`: **debajo de** `// ================== CREATE ==================` (y **encima de** `// ================== UPDATE ==================`), agrega el método `create`:

![](images/clipboard-1880155054.png)

**PARCHE** sobre `src/features/business/promoter/promoter.routes.ts`: **debajo de** el bloque `// getOne`, agrega:

![](images/clipboard-2848179397.png)

#### Archivo nuevo — `.http`

![](images/clipboard-2366189685.png)

### **Verificación**

![](images/clipboard-2433263452.png)

#### **Cierre del ISS-03-C:**

![](images/clipboard-2022209909.png)

### ISS-03-D — Feature Promoter — Update (PUT) y Update (PATCH)

**PARCHE** sobre `src/features/business/promoter/promoter.controller.ts`: **debajo de** el comentario `// ================== UPDATE ==================` (y **encima de** `// ================== DELETE ==================`), agrega:

![](images/clipboard-2520990230.png)

**PARCHE** sobre `src/features/business/promoter/promoter.routes.ts`: **debajo de** el bloque `// create`, agrega:

![](images/clipboard-960060521.png)

#### Archivo nuevo — `.http`

![](images/clipboard-446429490.png)

**Verificación:**

![**Cierre del ISS-03-D:**](images/clipboard-2188981627.png)

![](images/clipboard-3796577259.png)

### ISS-03-E — Feature Promoter — Eliminar (físico y lógico)

**PARCHE** sobre `src/features/business/promoter/promoter.controller.ts`: **debajo de** el comentario `// ================== DELETE ==================`, agrega primero el borrado físico y después el lógico:

![](images/clipboard-2100100603.png)

**PARCHE** sobre `src/features/business/promoter/promoter.routes.ts`:

**1)** Debajo del bloque `// update (PUT / PATCH)`, agrega el borrado físico:

![](images/clipboard-2504392159.png)

![](images/clipboard-2059682464.png)

### **HTTP — archivo nuevo**

![](images/clipboard-1494803203.png)

#### **Verificación:**

![](images/clipboard-3133061278.png)

#### **Cierre de ISS-03 completo (A→E):**

![](images/clipboard-378491852.png)

### ISS-04 — Seeders con Faker (feature Promoter + runner externo)

**9.1 — Seeder dentro del feature Promoter**

![](images/clipboard-2675491480.png)

![](images/clipboard-1879300546.png)

#### **9.2.1 — Conteos**

![](images/clipboard-2022053327.png)

**9.2.2 — Runner**

![](images/clipboard-3052178796.png)

**PARCHE** — `package.json`: dentro de `"scripts"`, debajo de `"dev": "..."`, agrega (recuerda poner coma al final de la línea de `dev` si no la tiene):

![](images/clipboard-4008600627.png)

**Verificación:**

![](images/clipboard-2767456900.png)

### **Cierre del ISS-04:**

![](images/clipboard-3026413795.png)

### ISS-05 — Swagger/OpenAPI (feature Promoter + registry externo)

#### **10.1 — OpenAPI dentro del feature Promoter**

![](images/clipboard-3083118898.png)

![](images/clipboard-2391055989.png)

#### **10.2 — Registry externo + montaje en Config**

![](images/clipboard-2354806169.png)

![](images/clipboard-2286119972.png)

**PARCHE** sobre `src/config/index.ts`: ábrelo con `nano src/config/index.ts` y haz estos 3 cambios:

**1)** Debajo de `import { Routes } from "../routes/index";`, agrega:

![](images/clipboard-1530406464.png)

**2)** Dentro del `constructor`, debajo de `this.routes();` y encima de `this.dbConnection();`, agrega:

![**3)** Dentro de la clase `App`, debajo del método `routes()` y encima de `dbConnection()`, agrega:](images/clipboard-2394612159.png)

![](images/clipboard-1285478637.png)

**Verificación:**

![**Cierre del ISS-05:**](images/clipboard-1450899533.png)

![](images/clipboard-2114847537.png)

### ISS-06 — Feature Contributor (aportantes)

**Objetivo:** CRUD + seeder + swagger de Contributor (sin FK).\
**API:** `/api/contribuyentes` — SIN AUTH.\
**Patrón:** igual que ProductType (catálogo simple).

![](images/clipboard-1915917346.png)

#### **11.1 — Modelo Contributor**

![](images/clipboard-1385126126.png)

#### **11.2 — Controller + routes (CRUD completo)**

![](images/clipboard-520033376.png)

![](images/clipboard-1108419677.png)

#### **11.3 — HTTP**

![](images/clipboard-598900311.png)

![![](images/clipboard-1625070615.png)](images/clipboard-4281810694.png)

**11.4 — Cableado Routes + Config**

**PARCHE** sobre `src/routes/index.ts`:

1.  Debajo de `import { PromoterRoutes } ...`, agrega:

![](images/clipboard-500447000.png)

2.  Dentro de `export class Routes`, debajo de `promoterRoutes`, agrega:

    ![](images/clipboard-3561700604.png)

    **PARCHE** sobre `src/config/index.ts`:

    1.  Debajo de `import "../features/business/promoter/promoter.model";`, agrega:

    ![](images/clipboard-167420139.png)

<!-- -->

2.  Dentro de `routes()`, debajo de `this.routePrv.promoterRoutes.routes(this.app);`, agrega:

    ![](images/clipboard-917604580.png)

#### **Verificación:**

![](images/clipboard-768797171.png)

#### **11.5 — Seeder Contributor**

![](images/clipboard-2052112024.png)

**PARCHE** sobre `src/database/seeders/counts.ts` :

- Dentro de `SeedCounts`, agrega `contributors: number;`

- Dentro de `DEFAULT_SEED_COUNTS`, agrega `contributors: 15,`

- Dentro de la lectura por env, agrega (debajo de `envPromoters`):

![](images/clipboard-3536409696.png)

**PARCHE** sobre `src/database/seeders/index.ts`:

1.  Debajo del import de `seedPromoters`, agrega:

![](images/clipboard-2169969776.png)

2.  Debajo de `await seedPromoters(counts.promoters);`, agrega:

![](images/clipboard-2787351296.png)

#### **11.6 — Swagger Contributor**

![](images/clipboard-3603474485.png)

**PARCHE** sobre `src/swagger/index.ts`:

1.  Debajo de `import { promoterSwagger } ...`, agrega:

![](images/clipboard-1442299572.png)

2.  Dentro de `featureSwaggerModules`, debajo de `promoterSwagger,`, agrega:

![](images/clipboard-2002984752.png)

#### **Verificación final:**

![](images/clipboard-3476640638.png)

### **Cierre del ISS-06:**

![](images/clipboard-3514103314.png)

### ISS-07 — Feature Project (proyectos) — con FK a Promoter

**Objetivo:** CRUD de Project con FK `promoter_id`.\
**API:** `/api/proyectos` — SIN AUTH.

![](images/clipboard-4068161805.png)

#### **12.1 — Modelo Project**

![](images/clipboard-1582757540.png)

#### **12.2 — Controller + routes**

![](images/clipboard-3809936832.png)

![](images/clipboard-4034797462.png)

#### **12.3 — HTTP**

![](images/clipboard-1846952603.png)

![](images/clipboard-3164907424.png)

**12.4 — Cableado**

**PARCHE** sobre `src/routes/index.ts`:

1.  Debajo de `import { ContributorRoutes } ...`, agrega:

![](images/clipboard-3197628230.png)

2.  Dentro de `export class Routes`, debajo de `contributorRoutes`, agregar

![](images/clipboard-3508066304.png)

**PARCHE** sobre `src/config/index.ts`:

1.  Debajo de `import "../features/business/contributor/contributor.model";`, agrega:

![](images/clipboard-4260411019.png)

2.  Dentro de `routes()`, debajo de `this.routePrv.contributorRoutes.routes(this.app);`, agrega:

    ![](images/clipboard-1061110720.png)

#### **12.5 — Relación Promoter ↔ Project (obligatorio al cerrar la tabla)**

> #### 
>
> #### Norma FK: `promoter_id` (tabla `promoters` → singular `promoter` + `_id`).

![](images/clipboard-730902901.png)

#### **PARCHE** sobre `src/config/index.ts`: debajo de `import "../features/business/project/project.model";` (y encima de `import { Routes }`), agrega:

![](images/clipboard-1266893622.png)

#### **Verificación relación:**

![](images/clipboard-626266531.png)

#### **12.6 — Seeder + Swagger Project**

![](images/clipboard-3969071135.png)

![](images/clipboard-2617025119.png)

**PARCHE** sobre `src/database/seeders/counts.ts`:

- Dentro de `SeedCounts`, agrega `projects: number;`

- Dentro de `DEFAULT_SEED_COUNTS`, agrega `projects: 12,`

- Dentro de la lectura por env, agrega:

![](images/clipboard-3106888607.png)

**PARCHE** sobre `src/database/seeders/index.ts`:

1.  Debajo del import de `seedContributors`, agrega:

![](images/clipboard-1141113902.png)

2.  Debajo de `await seedContributors(counts.contributors);`, agrega:

![](images/clipboard-1983183984.png)

**PARCHE** sobre `src/swagger/index.ts`:

1.  Debajo de `import { contributorSwagger } ...`, agrega:

![](images/clipboard-2358487211.png)

2.  Dentro de `featureSwaggerModules`, debajo de `contributorSwagger,`, agrega:

![](images/clipboard-2189368400.png)

#### **Verificación final:**

![](images/clipboard-2344600265.png)

#### **Cierre del ISS-07:**

![](images/clipboard-3768853097.png)

### ISS-08 — Feature Goal (metas de financiamiento) — con FK a Project

**Objetivo:** CRUD de Goal con FK `project_id`.\
**API:** `/api/metas` — SIN AUTH.

![](images/clipboard-3289494788.png)

**Modelo Goal**

![](images/clipboard-1453151528.png)

**Controller + routes**

![](images/clipboard-2476000917.png)

![](images/clipboard-2465055567.png)

### **HTTP**

![](images/clipboard-1890984905.png)

![](images/clipboard-3279543017.png)

**Cableado**

**PARCHE** sobre `src/routes/index.ts`:

1.  Debajo de `import { ProjectRoutes } ...`, agrega:

![](images/clipboard-3731394614.png)

2.  Dentro de `export class Routes`, debajo de `projectRoutes`, agrega:

![](images/clipboard-1222438304.png)

**PARCHE** sobre `src/config/index.ts`:

1.  Debajo de `import "../features/business/project/project.model";`, agrega:

![](images/clipboard-2196542337.png)

2.  Dentro de `routes()`, debajo de `this.routePrv.projectRoutes.routes(this.app);`, agrega:

![](images/clipboard-1370101527.png)

#### **Relación Project ↔ Goal (obligatorio al cerrar la tabla)**

![](images/clipboard-1576015695.png)

**PARCHE** sobre `src/config/index.ts`: debajo de `import "../features/business/goal/goal.model";` (y encima de `import { Routes }`), agrega:

![](images/clipboard-2079159714.png)

#### **Verificación relación:**

![](images/clipboard-1867678370.png)

#### **Seeder + Swagger Goal**

![](images/clipboard-965531536.png)

![](images/clipboard-1350318576.png)

**PARCHE** sobre `src/database/seeders/counts.ts`:

- Dentro de `SeedCounts`, agrega `goals: number;`

- Dentro de `DEFAULT_SEED_COUNTS`, agrega `goals: 15,`

- Dentro de la lectura por env, agrega:

![](images/clipboard-3296448898.png)

**PARCHE** sobre `src/database/seeders/index.ts`:

1.  Debajo del import de `seedProjects`, agrega:

![](images/clipboard-1473578327.png)

2.  Debajo de `await seedProjects(counts.projects);`, agrega:

    ![](images/clipboard-98405172.png)

**PARCHE** sobre `src/swagger/index.ts`:

1.  Debajo de `import { projectSwagger } ...`, agrega:

![](images/clipboard-4116023968.png)

2.  Dentro de `featureSwaggerModules`, debajo de `projectSwagger,`, agrega:

![](images/clipboard-3908034623.png)

#### **Verificación final:**

![](images/clipboard-2770121548.png)

#### **Cierre del ISS-08:**

![](images/clipboard-2394669828.png)

### ISS-09 — Feature Reward (recompensas) — con FK a Project

**Objetivo:** CRUD de Reward con FK `project_id`.\
**API:** `/api/recompensas` — SIN AUTH.

![](images/clipboard-738376555.png)

#### **Modelo Reward**

#### ![](images/clipboard-2687438399.png)

#### **Controller + routes**

![](images/clipboard-4204244106.png)

#### ![](images/clipboard-965969552.png)

#### HTTP

![](images/clipboard-3036062356.png)

![](images/clipboard-2895091374.png)

**Cableado**

**PARCHE** sobre `src/routes/index.ts` (ya existe):

1.  Debajo de `import { GoalRoutes } ...`, agrega:

![](images/clipboard-3493424504.png)

2.  Dentro de `export class Routes`, debajo de `goalRoutes`, agrega:

![](images/clipboard-3019321272.png)

**PARCHE** sobre `src/config/index.ts` (ya existe):

1.  Debajo de `import "../features/business/goal/goal.model";`, agrega:

![](images/clipboard-4137872283.png)

2.  Dentro de `routes()`, debajo de `this.routePrv.goalRoutes.routes(this.app);`, agrega:

![](images/clipboard-3926727853.png)

#### **Relación Project ↔ Reward (obligatorio al cerrar la tabla)**

![](images/clipboard-215120814.png)

**PARCHE** sobre `src/config/index.ts` (ya existe): debajo de `import "../features/business/reward/reward.model";` (y encima de `import { Routes }`), agrega:

![](images/clipboard-2179681248.png)

#### **Verificación relación:**

![](images/clipboard-2397658968.png)

#### **Seeder + Swagger Reward**

![](images/clipboard-4061436552.png)

![](images/clipboard-1151681234.png)

**PARCHE** sobre `src/database/seeders/counts.ts` (ya existe):

- Dentro de `SeedCounts`, agrega `rewards: number;`

- Dentro de `DEFAULT_SEED_COUNTS`, agrega `rewards: 15,`

- Dentro de la lectura por env, agrega:

![](images/clipboard-4030943601.png)

**PARCHE** sobre `src/database/seeders/index.ts` (ya existe):

1.  Debajo del import de `seedGoals`, agrega:

![](images/clipboard-239898656.png)

2.  Debajo de `await seedGoals(counts.goals);`, agrega:

![](images/clipboard-1518676062.png)

**PARCHE** sobre `src/swagger/index.ts` (ya existe):

1.  Debajo de `import { goalSwagger } ...`, agrega:

![](images/clipboard-1183065193.png)

2.  Dentro de `featureSwaggerModules`, debajo de `goalSwagger,`, agrega:

![](images/clipboard-2511091768.png)

#### **Verificación final:**

![](images/clipboard-648564817.png)

#### **Cierre del ISS-09:**

![](images/clipboard-2656868851.png)

## ISS-10 — Feature Contribution (doble FK: Project + Contributor)

#### 10.1 Crear carpeta y modelo

![](images/clipboard-3176635127.png)

![](images/clipboard-2319301352.png)

#### 10.1b Associations

![](images/clipboard-2403102750.png)

#### 10.2 Controller (doble validación FK: Project y Contributor activos)

![](images/clipboard-3485322081.png)

#### 10.3 Routes (`/api/contribuciones`)

![](images/clipboard-404421456.png)

#### 10.3b Archivos `.http` de prueba

![](images/clipboard-14809525.png)

#### 10.4 Cableado — `src/routes/index.ts`

**PARCHE:** abre con `nano src/routes/index.ts`, agrega el import junto a los demás:

![](images/clipboard-2590147757.png)

Y dentro de la clase `Routes`, agrega la propiedad junto a las demás (debajo de `rewardRoutes`):

![](images/clipboard-1953124998.png)

#### 10.4b Cableado — `src/config/index.ts`

**PARCHE 1** (imports, debajo de la línea `import "../features/business/reward/reward.associations";`):

![](images/clipboard-285347175.png)

**PARCHE 2** (dentro del método `routes()`, debajo de `this.routePrv.rewardRoutes.routes(this.app);`):

![](images/clipboard-3161287926.png)

#### 10.5 Seeder — `src/database/seeders/counts.ts`

**PARCHE:** agrega la clave `contributions` en el type `SeedCounts`, en `DEFAULT_SEED_COUNTS` y en la resolución de overrides, siguiendo exactamente el mismo patrón que ya tienes para `rewards`.

![](images/clipboard-821273619.png)

#### 10.9 Seeder — `contribution.seeder.ts`

![](images/clipboard-1329395236.png)

#### 10.10 Cableado — `src/database/seeders/index.ts`

**PARCHE:** agrega el import junto a los demás:

![](images/clipboard-4073358345.png)

![](images/clipboard-3244045470.png)

#### 10.11 Swagger — `contribution.swagger.ts`

![](images/clipboard-222564414.png)

#### 10.12 Cableado — `src/swagger/index.ts`

**PARCHE:** agrega el import junto a los demás:

![](images/clipboard-2909485593.png)

Y agrega `contributionSwagger` al arreglo `featureSwaggerModules` (donde ya están `promoterSwagger`, `contributorSwagger`, `projectSwagger`, `goalSwagger`, `rewardSwagger`):

![](images/clipboard-1534033590.png)

### 10.13 Verificación final

![](images/clipboard-2912813307.png)

#### Cierre del ISS-10:

![](images/clipboard-4088200091.png)

## ISS-11 — Feature PaymentTransaction (FK a Contribution)

#### 11.1 Crear carpeta y modelo

![](images/clipboard-1693273442.png)

![](images/clipboard-1486479421.png)

#### 11.2 Associations (PaymentTransaction ↔ Contribution)

![](images/clipboard-1236715041.png)

#### 11.3 Controller (CRUD + validación de Contribution activa)

![](images/clipboard-1812196045.png)

#### 11.4 Routes (`/api/transacciones-pago`)

![](images/clipboard-1021146689.png)

#### 11.5 Archivos `.http` 

![](images/clipboard-1201864721.png)

#### 11.6 Cableado — `src/routes/index.ts`

**PARCHE:** `nano src/routes/index.ts`. Agrega el import junto a los demás:

![](images/clipboard-3753809824.png)

Y la propiedad dentro de la clase `Routes`, debajo de `contributionRoutes`:

![](images/clipboard-1441973746.png)

#### 11.7 Cableado — `src/config/index.ts`

**PARCHE 1** (imports, debajo de `import "../features/business/contribution/contribution.associations";`):

![](images/clipboard-3602248190.png)

**PARCHE 2** (dentro del método `routes()`, debajo de `this.routePrv.contributionRoutes.routes(this.app);`):

![](images/clipboard-1399508795.png)

#### 11.8 Cableado — `src/database/seeders/counts.ts`

Con tu estructura real (bloques `if` por variable de entorno), son **tres** ediciones:

**PARCHE 1** — en el `type SeedCounts { ... }`:

![](images/clipboard-314987657.png)

![](images/clipboard-959372981.png)

#### 11.9 Seeder — `payment-transaction.seeder.ts`

![](images/clipboard-1745059739.png)

#### 11.10 Cableado — `src/database/seeders/index.ts`

**PARCHE:** agrega el import junto a los demás:

![](images/clipboard-533405561.png)

Y la llamada, **después** de `seedContributions` (la contribución padre debe existir antes):

![](images/clipboard-3918553250.png)

#### 11.11 Swagger — `payment-transaction.swagger.ts`

![](images/clipboard-740380277.png)

#### 11.12 Cableado — `src/swagger/index.ts`

**PARCHE:** agrega el import junto a los demás:

![](images/clipboard-1269907346.png)

Y agrégalo al arreglo `featureSwaggerModules`, debajo de `contributionSwagger`:

![](images/clipboard-3281799917.png)

#### 11.13 Verificación final

![](images/clipboard-3380980758.png)

#### 11.14 Cierre del ISS-11

![](images/clipboard-2695583361.png)

## ISS-12 — Feature Commission (FK a PaymentTransaction)

#### 12.1 Crear carpeta y modelo

![](images/clipboard-332992576.png)

![](images/clipboard-2523014285.png)

#### 12.2 Associations (Commission ↔ PaymentTransaction)

![](images/clipboard-3066197522.png)

#### 12.3 Controller (CRUD + validación de PaymentTransaction activa)

![](images/clipboard-3899808150.png)

#### 12.4 Routes (`/api/comisiones`)

![](images/clipboard-941960793.png)

#### 12.5 Archivos `.http` 

![](images/clipboard-2598335720.png)

#### 12.6 Cableado — `src/routes/index.ts`

**PARCHE:** `nano src/routes/index.ts`. Agrega el import junto a los demás:

![](images/clipboard-1850234746.png)

Y la propiedad dentro de la clase `Routes`, debajo de `paymentTransactionRoutes`:

![](images/clipboard-4203889214.png)

#### 12.7 Cableado — `src/config/index.ts`

**PARCHE 1** (imports, debajo de `import "../features/business/payment-transaction/payment-transaction.associations";`):

![](images/clipboard-2473986293.png)

**PARCHE 2** (dentro del método `routes()`, debajo de `this.routePrv.paymentTransactionRoutes.routes(this.app);`):

![](images/clipboard-3431177010.png)

#### 12.8 Cableado — `src/database/seeders/counts.ts`

**PARCHE 1** — en el `type SeedCounts { ... }`:

**PARCHE 2** — en `DEFAULT_SEED_COUNTS = { ... }`:

![](images/clipboard-2680889246.png)

**PARCHE 3** — en `resolveSeedCounts()`, justo después del bloque `envPaymentTransactions`:

![](images/clipboard-3450874520.png)

#### 12.9 Seeder — `commission.seeder.ts`

![](images/clipboard-3885396296.png)

#### 12.10 Cableado — `src/database/seeders/index.ts`

**PARCHE:** agrega el import junto a los demás:

![](images/clipboard-973839361.png)

Y la llamada, **después** de `seedPaymentTransactions`:

![](images/clipboard-350726229.png)

#### 12.11 Swagger — `commission.swagger.ts`

![](images/clipboard-629005239.png)

#### 12.12 Cableado — `src/swagger/index.ts`

**PARCHE:** agrega el import junto a los demás:

![](images/clipboard-1289917899.png)

Y agrégalo al arreglo `featureSwaggerModules`, debajo de `paymentTransactionSwagger`:

![](images/clipboard-809172387.png)

#### 12.13 Verificación final

![](images/clipboard-3077155742.png)

#### 12.14 Cierre del ISS-12

![](images/clipboard-1503931311.png)

## ISS-13 — Feature Disbursement (FK a Project)

#### 13.1 Crear carpeta y modelo

![](images/clipboard-572690739.png)

![](images/clipboard-2205955091.png)

#### 13.2 Associations (Disbursement ↔ Project)

![](images/clipboard-600261490.png)

#### 13.3 Controller (CRUD + validación de Project activo)

![](images/clipboard-4074947899.png)

#### 13.4 Routes (`/api/desembolsos`)

![](images/clipboard-2816419076.png)

#### 13.5 Archivos `.http` 

![](images/clipboard-749887714.png)

#### 13.6 Cableado — `src/routes/index.ts`

**PARCHE:** `nano src/routes/index.ts`. Agrega el import junto a los demás:

![](images/clipboard-3686873248.png)

Y la propiedad dentro de la clase `Routes`, debajo de `commissionRoutes`:

![](images/clipboard-1238017697.png)

#### 13.7 Cableado — `src/config/index.ts`

**PARCHE 1** (imports, debajo de `import "../features/business/commission/commission.associations";`):

![](images/clipboard-2108433805.png)

**PARCHE 2** (dentro del método `routes()`, debajo de `this.routePrv.commissionRoutes.routes(this.app);`):

![](images/clipboard-3549299781.png)

#### 13.8 Cableado — `src/database/seeders/counts.ts`

**PARCHE 1** — en el `type SeedCounts { ... }`:

**PARCHE 2** — en `DEFAULT_SEED_COUNTS = { ... }`:

![](images/clipboard-1349702985.png)

**PARCHE 3** — en `resolveSeedCounts()`, justo después del bloque `envCommissions`:

![](images/clipboard-889773553.png)

#### 13.9 Seeder — `disbursement.seeder.ts`

![](images/clipboard-1379730588.png)

#### 13.10 Cableado — `src/database/seeders/index.ts`

**PARCHE:** agrega el import junto a los demás:

![](images/clipboard-395270474.png)

Y la llamada, **después** de `seedCommissions`:

![](images/clipboard-598461560.png)

#### 13.11 Swagger — `disbursement.swagger.ts`

![](images/clipboard-1772007191.png)

#### 13.12 Cableado — `src/swagger/index.ts`

**PARCHE:** agrega el import junto a los demás:

![](images/clipboard-1281416998.png)

Y agrégalo al arreglo `featureSwaggerModules`, debajo de `commissionSwagger`:

![](images/clipboard-314918870.png)

#### 13.13 Verificación final

![](images/clipboard-417572788.png)

#### 13.14 Cierre del ISS-13

![](images/clipboard-2568776388.png)
