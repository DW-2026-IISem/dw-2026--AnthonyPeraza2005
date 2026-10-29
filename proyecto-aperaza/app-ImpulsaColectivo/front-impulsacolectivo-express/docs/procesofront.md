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

## ISS-03 · CRUD de promotores con Signals

### 3.1 Generar los componentes

![](images/clipboard-2911345582.png)

### 3.2 Utilidad de filtro local

![](images/clipboard-2740795674.png)

### 3.3 Formulario reactivo reutilizable

![](images/clipboard-3264254993.png)

### 3.4 Lista con estado en Signals

![](images/clipboard-3934080950.png)

### 3.5 Plantilla de la lista

![](images/clipboard-791609743.png)

### 3.7 Ruta y menú 

### 3.7.1 `app.routes.ts`

![](images/clipboard-2726901614.png)

### 3.7.2 `shell.ts`

![](images/clipboard-3319502526.png)

### 3.8 Prueba de la lista

![](images/clipboard-3694759724.png)

### 3.9 Comprobación funcional

**3.9.1 Backend sin autenticación**

![](images/clipboard-1364545739.png)

### 3.9.2 Frontend

![](images/clipboard-161488727.png)

### 3.10 Verificación del ISS

![](images/clipboard-573934110.png)

![](images/clipboard-2258505833.png)

## ISS-04 · CRUD de contribuyentes 

### 4.2 Generar con el CLI

![](images/clipboard-91226967.png)

### 4.3 Servicio

![](images/clipboard-1385814972.png)

### 4.4 Formulario

![](images/clipboard-4153530836.png)

### 4.5 Lista

![](images/clipboard-2328596542.png)

### 4.6 Prueba de la lista

![](images/clipboard-1913976751.png)

### 4.7 Ruta y menú

### 4.7.1 `app.routes.ts`

![](images/clipboard-207356320.png)

### 4.7.2 `shell.ts`

![](images/clipboard-392461532.png)

### 4.8 Comprobación

![](images/clipboard-745993827.png)

### 4.9 Verificación del ISS

![](images/clipboard-918185846.png)

![](images/clipboard-1546668540.png)

### PRUEBA VISUAL

![](images/clipboard-767716248.png)

## ISS-05 · CRUD de proyectos y relación con promotores

### 5.1 Modelo y reglas

![](images/clipboard-4222486828.png)

### 5.2 Generar con el CLI

![](images/clipboard-3638550819.png)

### 5.3 Servicios

![](images/clipboard-3435093858.png)

### 5.4 Utilidades nuevas: fechas y fase del proyecto

**5.4.1 Fechas**

![](images/clipboard-241578382.png)

### 5.4.2 La fase del proyecto

![](images/clipboard-2141065006.png)

### 5.5 Formulario con relación y fechas

![](images/clipboard-2251305323.png)

### 5.6 Lista

![](images/clipboard-4159460598.png)

### 5.7 Prueba de la lista

![](images/clipboard-4261967766.png)

### 5.8 Ruta y menú 

**5.8.1 `app.routes.ts`**

![](images/clipboard-3295945311.png)

### 5.8.2 `shell.ts`

![](images/clipboard-2421961620.png)

### 5.9 Comprobación

![](images/clipboard-1235783656.png)

### 5.10 Verificación del ISS

![](images/clipboard-2971694583.png)

![](images/clipboard-3564006.png)

### PRUEBA VISUAL

![](images/clipboard-1919802534.png)

## ISS-06 · Contribuciones y su flujo de pago

### 6.2 Generar con el CLI

![](images/clipboard-3468333246.png)

### 6.3 Servicios y modelo

![](images/clipboard-2841473116.png)

### 6.4 Formulario con dos relaciones y un monto

![](images/clipboard-4161925538.png)

### 6.5 Lista: tres cargas en paralelo, nombres y total

![](images/clipboard-138526870.png)

### 6.6 Prueba de la lista

![](images/clipboard-1303346258.png)

### 6.7 Ruta y menú 

**6.7.1 `app.routes.ts`**

![](images/clipboard-2931151165.png)

### 6.7.2 `shell.ts`

![](images/clipboard-1751216803.png)

### 6.8 Comprobación

![](images/clipboard-2184662901.png)

### PRUEBA VISUAL

![](images/clipboard-1370367352.png)

### 6.9 Verificación del ISS

![](images/clipboard-4033856485.png)

![](images/clipboard-1373720816.png)

### ISS-07 · Pagos, detalle del aporte, dashboard y cierre de Fase I

### 7.2 Generar con el CLI

![](images/clipboard-1723574983.png)

### 7.3 Servicio y modelo

![](images/clipboard-3463354109.png)

### 7.4 Formulario de pago

![](images/clipboard-20571445.png)

### Prueba del formulario

![](images/clipboard-1755100759.png)

### 7.5 Lista de pagos: cuatro cargas en paralelo

![](images/clipboard-2272453642.png)

### 7.6 Prueba de la lista de pagos

![](images/clipboard-4049257566.png)

### 7.7 Ruta y menú de pagos 

**7.7.1 `app.routes.ts`**

![](images/clipboard-2420780220.png)

### 7.7.2 `shell.ts`

![](images/clipboard-1191186435.png)

### 7.8 Comprobación de la Parte 1

![](images/clipboard-45528653.png)

### 7.9 Modelos y servicios de comisiones y reembolsos

![](images/clipboard-1078886910.png)

### 7.10 Generar con el CLI

![](images/clipboard-792823561.png)

### 7.11 `ContributionDetail`

![](images/clipboard-4239488039.png)

### 7.12 PARCHE de `ContributionList`

**7.12.1 `contribution-list.ts`**

![](images/clipboard-3286007779.png)

### 7.12.2 `contribution-list.html`

![](images/clipboard-1873740485.png)

### 7.12.3 Prueba nueva del detalle en la lista 

![](images/clipboard-3677513001.png)

### 7.13 Dashboard

![](images/clipboard-935490376.png)

### 7.14 Ruta del panel y menú 

**7.14.1 `app.routes.ts`**

![](images/clipboard-3066192833.png)

### 7.14.2 `shell.ts`

![](images/clipboard-1210123772.png)

### 7.15 Comprobación

![](images/clipboard-960075944.png)

## PRUEBA VISUAL

![](images/clipboard-931693235.png)

### 7.16 Verificación del ISS

![](images/clipboard-402199301.png)

![](images/clipboard-1399319361.png)
