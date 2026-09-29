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

**PARCHE** — `package.json` (ya existe): dentro de `"scripts"`, debajo de `"dev": "..."`, agrega (recuerda poner coma al final de la línea de `dev` si no la tiene):

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

**PARCHE** sobre `src/config/index.ts` (ya existe): ábrelo con `nano src/config/index.ts` y haz estos 3 cambios:

**1)** Debajo de `import { Routes } from "../routes/index";`, agrega:

![](images/clipboard-1530406464.png)

**2)** Dentro del `constructor`, debajo de `this.routes();` y encima de `this.dbConnection();`, agrega:

![**3)** Dentro de la clase `App`, debajo del método `routes()` y encima de `dbConnection()`, agrega:](images/clipboard-2394612159.png)

![](images/clipboard-1285478637.png)

**Verificación:**

![**Cierre del ISS-05:**](images/clipboard-1450899533.png)

![](images/clipboard-2114847537.png)
