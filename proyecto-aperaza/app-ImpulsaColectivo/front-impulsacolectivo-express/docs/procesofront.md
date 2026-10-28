# ISS-00- REQUISITOS PREVIOS

## 0.1 Node, npm y Angular CLI

![](images/clipboard-3004882951.png)

## 0.2 Backend en marcha (preparación para integrar HTTP)

![](images/clipboard-4013962191.png)

## 0.3 Login y permisos

![](images/clipboard-3442513319.png)

## Verificación final del ISS-00

![](images/clipboard-1898108958.png)

# ISS-01- REQUISITOS PREVIOS

## 1.1 Crear el proyecto en la carpeta actual

![](images/clipboard-3657658568.png)

## 1.2 Instalar PrimeNG compatible con Angular

![](images/clipboard-1788264521.png)

## 1.3 Estilos globales

![](images/clipboard-1399721923.png)

## 1.4 Configurar PrimeNG

![](images/clipboard-3096152558.png)

![](images/clipboard-3773647256.png)

![](images/clipboard-3269759164.png)

### app.config.ts

![](images/clipboard-4160046430.png)

## 1.4.1 Licencia de PrimeNG 22

![](images/clipboard-3223471937.png)

## 1.5 Pantalla de arranque

![](images/clipboard-2048986614.png)

## src/app/demo/ejemplo/ejemplo.ts

![](images/clipboard-183464187.png)

### src/app/demo/ejemplo/ejemplo.html

![](images/clipboard-1798712163.png)

### src/app/demo/ejemplo/ejemplo.css

![](images/clipboard-1097895812.png)

### src/app/demo/ejemplo/ejemplo.spec.ts

![](images/clipboard-3691233924.png)

### src/app/app.ts

![](images/clipboard-3553403866.png)

### src/app/app.routes.ts

![](images/clipboard-1407731820.png)

### src/app/app.css

![](images/clipboard-2563118136.png)

### PARCHE — `app.spec.ts`

![](images/clipboard-2294661042.png)

### 1.6 Personalizar `index.html`

![](images/clipboard-2552434936.png)

### 1.7 Ajustar el presupuesto de build

![](images/clipboard-3010738128.png)

### 1.8 Primera ejecución

![](images/clipboard-3898297958.png)

## ISS-01A · Esqueleto Header / Aside / contenido / Footer

![](images/clipboard-184933671.png)

## 1.2 Generar las tres piezas de `layout/`

![](images/clipboard-978894563.png)

## 1.3 Contenido de cada componente

![](images/clipboard-3958198345.png)

### Aside

![](images/clipboard-3309165381.png)

### Footer

![](images/clipboard-1389179209.png)

## 1.4 Componer las cuatro regiones en `App`

![](images/clipboard-580681274.png)

## Verificación final del ISS-01A

![](images/clipboard-2967887655.png)

## ISS-01B · Entradas, salidas y estado: Aside, Header y Drawer ImpulsaColectivo

## 1.2 El Aside recibe el menú con `input()`

![](images/clipboard-1905252432.png)

### 1.3 El Header avisa con `output()`

![](images/clipboard-406327217.png)

### 1.4 `features/construir`

![](images/clipboard-3821662306.png)

### 1.4.2 El helper que decide el ancho

![](images/clipboard-2465363659.png)

### 1.4.3 La clase `Construir`

![](images/clipboard-2223399258.png)

### **1.4.4 La plantilla.** El layout se compone una sola vez, y el Drawer reutiliza el mismo `<app-aside>`

![](images/clipboard-2025901595.png)

### 1.4.5 `construir.css`

![](images/clipboard-3822351059.png)

### 1.4.6 La prueba de la pantalla

![](images/clipboard-1412034694.png)

### 1.5 `App` pasa a ser el punto de entrada con `router-outlet`

![](images/clipboard-2544242628.png)

### PRUEBAS

![](images/clipboard-670787013.png)

### RESULTADO VISUAL HASTA EL MOMENTO 

![](images/clipboard-3571583269.png)

# Fase I: Frontend — ISS-02 — Núcleo: environment, modelos, servicios y layout

### 2.1 `environment`: una sola URL para todo el frente

![](images/clipboard-2257896960.png)

### 2.2 Comprobar el reemplazo de entornos

![](images/clipboard-3723109586.png)

### 2.3 Sacar los campos reales

![](images/clipboard-858675070.png)

### 2.4 Sacar las rutas y envolturas reales

![](images/clipboard-3586703238.png)

### 2.5 Modelos: reflejar el backend

### 2.5.1 Tipos compartidos

![](images/clipboard-1088580043.png)

### 2.5.2 Entidades de negocio

![](images/clipboard-1378361399.png)

### 2.5.3 Entidades de negocio, segunda mitad

![](images/clipboard-3128775313.png)

### 2.5.4 Seguridad y sesión

![](images/clipboard-3913993653.png)

### 2.5.5 PRUEBA

![](images/clipboard-3407628299.png)

### 2.6 Servicios HTTP

### 2.6.1 Comprobar el contrato

![](images/clipboard-2540998210.png)

### 2.7 Utilidades transversales

#### **2.7.1 `toApiMessage`:** un solo lugar traduce el error HTTP a texto legible.

![](images/clipboard-1927211994.png)

### 2.7.2 `NotificationService`

![](images/clipboard-1798750303.png)

### 2.8 Componentes compartidos

![](images/clipboard-313102267.png)

### 2.9 `Shell`: conservar el esqueleto al navegar

![](images/clipboard-3489486914.png)

### 2.9.2 Rutas PARCHE sobre `app.routes.ts`

![](images/clipboard-934937166.png)

### 2.10 Registrar `HttpClient` sin interceptores de sesión

![](images/clipboard-164854857.png)

### 2.11 Verificación del ISS

![](images/clipboard-2968349217.png)

![](images/clipboard-3791888865.png)

### PRUEBA VISUAL

![](images/clipboard-1928406883.png)

![](images/clipboard-874492642.png)
