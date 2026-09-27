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

**Paso 1.2 — Reemplazar `package.json` con los scripts y metadata definitivos**

![](images/clipboard-1194523339.png)

### **Paso 1.3 — Instalar dependencias de producción**

![](images/clipboard-595099715.png)

### **Paso 1.4 — Instalar dependencias de desarrollo**

![](images/clipboard-2493403805.png)

### **Paso 1.5 — Crear `tsconfig.json`**

![](images/clipboard-4285858096.png)

### **Paso 1.6 — Crear `.gitignore`**

![](images/clipboard-3622711439.png)

### **Paso 1.7 — Crear estructura de carpetas base**

![](images/clipboard-3220417751.png)
