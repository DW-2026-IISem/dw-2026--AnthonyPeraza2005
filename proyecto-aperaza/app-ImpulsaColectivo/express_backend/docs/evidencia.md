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
