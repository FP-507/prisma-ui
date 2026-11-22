# Prisma UI · sistema de diseño

Sistema de diseño con su sitio de documentación: **tokens de color en OKLCH**, contraste WCAG calculado en vivo y componentes accesibles en HTML y CSS puro, sin frameworks.

**[Ver la documentación en vivo →](https://fp-507.github.io/prisma-ui/)**

## Qué lo hace distinto

- **Color perceptual (OKLCH)**: las escalas de acento y neutro se generan a partir de un único tono. Al moverlo, la luminosidad de cada paso se mantiene, así que el contraste se conserva en cualquier color de marca.
- **Contraste calculado en vivo**: cada muestra convierte OKLCH a sRGB en JavaScript, calcula la luminancia relativa y muestra el contraste contra blanco y negro con su nivel WCAG (AA, AAA o "AA grande").
- **Un token para los radios**: `--pr-radio` controla botones, campos, tarjetas y diálogos; se cambia con un control deslizante.
- **Tema claro y oscuro** con roles semánticos (`--pr-superficie`, `--pr-texto-2`, `--pr-primario`…): los componentes nunca usan colores crudos.

## Componentes

Botones (4 variantes, 3 tamaños y estado de carga) · campos con validación en vivo y mensajes por `aria-describedby` · casillas, opciones e interruptores (`role="switch"`) · alertas con ícono y texto, nunca solo color · insignias · pestañas con el patrón ARIA y navegación por flechas, Inicio y Fin · diálogo nativo con fondo difuminado · tabla ordenable con `aria-sort` y cifras tabulares · control segmentado · notificación tipo toast.

Cada demo tiene un botón para **copiar el código**, y al hacer clic en una muestra de color se copia su variable CSS.

## Estructura

```
prisma.css   el sistema: tokens y componentes (se puede usar en cualquier proyecto)
docs.css     estilos propios del sitio de documentación
docs.js      generación de escalas, contraste, temas y demos interactivas
index.html   documentación
```

### Usarlo en otro proyecto

```html
<link rel="stylesheet" href="prisma.css">
<html data-tema="oscuro" style="--pr-tono: 150; --pr-radio: 6px">
<button class="pr-btn">Guardar</button>
```

## Accesibilidad

Foco visible con anillo de dos capas en todos los controles, etiquetas siempre visibles, roles y estados ARIA, soporte de `prefers-reduced-motion`, y preferencias de tema guardadas localmente.
