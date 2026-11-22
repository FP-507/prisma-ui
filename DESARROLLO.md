# Notas de desarrollo · Prisma UI (sistema de diseño)

Guía para retomar el proyecto: cómo está armado, por qué y cómo cambiarlo.

## Puesta en marcha

Sin build ni dependencias:

```bash
python -m http.server 8000      # o: npx serve .
```

La documentación se publica con GitHub Pages desde la raíz de la rama principal.

## Dos capas separadas

| Archivo | Qué es | ¿Se reutiliza en otros proyectos? |
|---|---|---|
| `prisma.css` | **El sistema**: tokens (variables `--pr-*`) y componentes (clases `pr-*`) | Sí, es lo único que hace falta copiar |
| `docs.css` | Estilos del sitio de documentación (layout, navegación lateral, muestras) | No |
| `docs.js` | Lógica de la documentación: escalas, contraste, tema, demos | No |
| `index.html` | La documentación con cada componente en vivo | No |

## Tokens (`prisma.css`)

Tres niveles, de más crudo a más semántico:

1. **Parámetros:** `--pr-tono` (tono OKLCH de la marca, 0–360), `--pr-radio`, `--pr-fuente`, `--pr-mono`.
2. **Escalas:** `--pr-acento-50` … `--pr-acento-900` y `--pr-neutro-50` … `--pr-neutro-900`, todas en `oklch(L C var(--pr-tono))`. Cambiar el tono recalcula ambas escalas sin tocar la luminosidad.
3. **Roles:** `--pr-fondo`, `--pr-superficie`, `--pr-borde`, `--pr-texto`, `--pr-texto-2`, `--pr-primario`, `--pr-anillo`, `--pr-exito`, `--pr-error`… El tema oscuro (`[data-tema="oscuro"]`) solo reasigna roles.

**Regla:** los componentes usan solo roles, nunca escalas ni colores crudos. Así el tema oscuro y el cambio de marca funcionan sin reglas extra.

## `docs.js`

| Sección | Funciones | Qué hace |
|---|---|---|
| Color | `oklchARgb`, `luminancia`, `contraste`, `nivel`, `muestra`, `pintarColores` | Convierte cada paso OKLCH a sRGB, calcula la luminancia relativa WCAG y muestra el contraste contra blanco y negro (AAA ≥ 7, AA ≥ 4,5, AA grande ≥ 3) |
| Tipografía | `pintarTipos` | Muestra la escala tipográfica y de espaciado |
| Tema | `aplicarTono`, `aplicarRadio`, `aplicarTema`, `guardar`, `cargar` | Controles de tono, radio y tema; guarda las preferencias en `localStorage` |
| Utilidades | `toast`, `botonesCopiar` | Copiar el código de cada demo y la variable de cada muestra |
| Demos | `formulario`, `pestanas`, `dialogo`, `tabla`, `navegacion` | Validación en vivo, pestañas ARIA (flechas, Inicio y Fin), diálogo nativo, tabla ordenable con `aria-sort` y resaltado de la sección actual |

**Importante:** las listas `ACENTO` y `NEUTRO` de `docs.js` repiten los valores L y C de las escalas de `prisma.css` para poder calcular el contraste en JavaScript. **Si se cambia una escala en el CSS, hay que actualizarla también en `docs.js`.**

## Cómo extenderlo

- **Nuevo componente:** escribir sus estilos en `prisma.css` con prefijo `pr-` y usando solo roles; agregar una sección en `index.html` con la demo y su bloque de código (el botón de copiar se agrega solo); si necesita JavaScript, una función nueva en `docs.js` llamada al cargar.
- **Nuevo rol semántico:** definirlo en `:root` y en `[data-tema="oscuro"]`.
- **Nuevo paso de escala:** agregarlo en `prisma.css` y en `ACENTO` o `NEUTRO` de `docs.js`.

## Pendientes

- Publicarlo como paquete (npm o CDN) para usarlo sin copiar el archivo.
- Los componentes que necesitan JavaScript (pestañas, tabla ordenable, toast) solo tienen la lógica de ejemplo de la documentación; se podría extraer un `prisma.js` reutilizable.
- Pruebas automáticas de contraste en CI.
