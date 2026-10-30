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

## ISS-07 · Parte 3 · Recompensas

### 7.19 Generar con el CLI

![](images/clipboard-175318639.png)

### 7.20 Formulario de recompensa

![](images/clipboard-1796330389.png)

### 7.21 Lista de recompensas

![](images/clipboard-2713983612.png)

### 7.22 Prueba de la lista

![](images/clipboard-1422101788.png)

### 7.23 Ruta y menú 

**7.23.1 `app.routes.ts`**

![](images/clipboard-2514224570.png)

### 7.23.2 `shell.ts`

![](images/clipboard-3949760049.png)

### 7.24 Comprobación

![](images/clipboard-3136633623.png)

### PRUEBA VISUAL

![](images/clipboard-1492033586.png)

## ISS-07 · Parte 3 · Metas

### 7.25 Generar con el CLI

![](images/clipboard-4137341903.png)

### 7.26 Formulario de meta

![](images/clipboard-1665562943.png)

### 7.27 Lista de metas

![](images/clipboard-2166659727.png)

### 7.28 Prueba de la lista 

![](images/clipboard-1763005683.png)

### 7.29 Ruta y menú 

**7.29.1 `app.routes.ts`**

![](images/clipboard-4248179070.png)

### 7.29.2 `shell.ts`

![](images/clipboard-1572629399.png)

### 7.30 Comprobación de metas

![](images/clipboard-661813070.png)

### PRUEBA VISUAL

![](images/clipboard-3202543508.png)

## ISS-07 · Parte 3 · Desembolsos

### 7.31 Generar con el CLI

![](images/clipboard-2976315026.png)

### 7.32 Formulario de desembolso

![](images/clipboard-1893021602.png)

### 7.33 Lista de desembolsos

![](images/clipboard-2505016409.png)

### 7.34 Prueba de la lista

![](images/clipboard-1572084550.png)

### 7.35 Ruta y menú 

**7.35.1 `app.routes.ts`**

![](images/clipboard-4052579352.png)

### 7.35.2 `shell.ts`

![](images/clipboard-2508277749.png)

### 7.36 Comprobación de desembolso

![](images/clipboard-3303714097.png)

### PRUEBA VISUAL

![](images/clipboard-453062354.png)

## ISS-07 · Parte 3 · Auditorías

### 7.37 Generar con el CLI

![](images/clipboard-3882507930.png)

### 7.38 Formulario de auditoría

![](images/clipboard-4254244483.png)

### 7.39 Lista de auditorías

![](images/clipboard-2313858427.png)

### 7.40 Prueba de la lista

![](images/clipboard-2273507081.png)

### 7.41 Ruta y menú 

**7.41.1 `app.routes.ts`**

![](images/clipboard-61015878.png)

### 7.41.2 `shell.ts`

![](images/clipboard-3179872810.png)

### 7.42 Comprobación de auditorías

![](images/clipboard-1140769840.png)

### PRUEBA VISUAL

![](images/clipboard-3886466254.png)

## ISS-08 · Autenticación JWT, perfil y permisos

### 8.1 Comprobar el contrato del backend

![](images/clipboard-2351890034.png)

## Parte 1 · Sesión 

### 8.2 Modelos de sesión

![](images/clipboard-3305677073.png)

### 8.3 `SessionStore`

![](images/clipboard-1464733360.png)

### 8.4 `AuthService`

![](images/clipboard-2809830670.png)

### 8.5 Comprobación

![](images/clipboard-3246127547.png)

## ISS-08 · Parte 2 · Interceptores

### 8.6 Generar los interceptores

![](images/clipboard-1537476961.png)

### 8.7 `authInterceptor`

![](images/clipboard-1336800243.png)

### 8.8 `errorInterceptor`

![](images/clipboard-69883719.png)

### 8.9 Registrar los interceptores

![](images/clipboard-3022148243.png)

### 8.10 Comprobación

![](images/clipboard-3505148020.png)

## ISS-08 · Parte 3 · Login, perfil y guards

### 8.11 Corregir el cierre de sesión

![](images/clipboard-4052521426.png)

### 8.12 Guards básicos

![](images/clipboard-3386903174.png)

### 8.13 Generar los componentes

![](images/clipboard-1388098065.png)

### 8.14 Login

![](images/clipboard-2385931562.png)

### 8.15 Página «Sin permiso»

![](images/clipboard-1116987287.png)

### 8.16 Perfil

![](images/clipboard-3793041815.png)

### 8.17 Comprobación

![](images/clipboard-3946426428.png)

### 8.18 Preparar el cableado

![](images/clipboard-281911296.png)

## ISS-08 · Parte 4 · Rutas protegidas

### 8.19 Rutas de la sesión

![](images/clipboard-2005211345.png)

### 8.20 Probar el login en el navegador

![](images/clipboard-2284831673.png)

### 8.21 Preparar el cableado de la sesión

![](images/clipboard-1663466182.png)

## ISS-08 · Parte 5 · Sesión en el encabezado y el menú

### 8.22 `shell.ts`

![](images/clipboard-922602129.png)

### 8.23 `shell.html`

![](images/clipboard-3847237099.png)

### 8.24 Pruebas del Shell

**8.24.1 `shell.spec.ts`**

![](images/clipboard-3639335785.png)

### 8.24.2 Pruebas de la sesión en el Shell

![](images/clipboard-4167739266.png)

### 8.25 Comprobación del ISS-08

![](images/clipboard-3019772463.png)
