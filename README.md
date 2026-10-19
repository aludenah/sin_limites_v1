# Sin Límites V1

Aula virtual de Saco Oliveros para la preparación San Marcos. La interfaz incluye 18 cursos con 24 temas cada uno. Todos los temas se pueden visitar directamente, sin condiciones de avance.

Cada tema tiene tres pestañas:

- **Videoclase**: reproductor de YouTube cuando se agrega el enlace. Mientras tanto muestra «Próximamente».
- **Autoaprendizaje**: exactamente 10 preguntas de cinco alternativas, con nota automática sobre 20. Cada respuesta correcta vale 2 puntos, sin penalización por error.
- **Solucionario**: enlace al documento que se publique para ese tema.

Se incluye una práctica de muestra de análisis dimensional (Física, tema 01), con 10 preguntas y explicaciones. Los demás bancos de preguntas, los videos y los documentos de solución están pendientes de carga. Los resultados de práctica se guardan únicamente en este navegador, separados por usuario.

## Archivos

En la copia de GitHub, el contenido de `dist/` se publica en la raíz para servirlo con GitHub Pages. En la copia de Sites se mantiene dentro de `dist/`.

- `data/courses.json`: cursos, temas y enlaces de recursos.
- `data/questions/fisica-01.json`: ejemplo de autoevaluación.
- `config.js`: configuración pública de Firebase y opción de vista previa.
- `core.js`: validación de enlaces y calificación.
- `app.js` y `styles.css`: interfaz y navegación.
- `assets/`: logo y Oliverito originales extraídos de Formato Física.pptx.

## Agregar una videoclase o un solucionario

En `data/courses.json`, localiza el curso y el tema. Cambia `videoUrl` por el enlace HTTPS de YouTube (`watch`, `youtu.be`, `shorts` o `embed`) y `solutionUrl` por un enlace HTTPS al solucionario. No pegues código HTML en esos campos. Los valores `null` muestran el aviso de publicación pendiente.

```json
{
  "id": "01",
  "title": "Análisis dimensional",
  "videoUrl": null,
  "questionsFile": "data/questions/fisica-01.json",
  "questionStatus": "sample",
  "solutionUrl": null
}
```

## Agregar una autoevaluación

Crea un JSON dentro de `data/questions/` con `sample: false` y un arreglo `questions` de exactamente 10 objetos. Cada pregunta debe tener `id` único, `prompt`, cinco `options`, `correct` (índice de 0 a 4) y `explanation`. En el tema correspondiente configura `questionsFile` con esa ruta y `questionStatus: "ready"`. La interfaz valida el banco antes de permitir la calificación. La etiqueta de muestra solo aparece cuando el banco tiene `sample: true`.

## Ingreso con Google

Se reutiliza el proyecto Firebase público de la web original: `sin-limites-12f07`. Google debe estar habilitado como proveedor de autenticación y el dominio de publicación debe figurar en los dominios autorizados de Firebase. La web nueva y la anterior compartirán el mismo directorio de usuarios de Firebase.

`aludenah.github.io` es el mismo dominio de la web anterior. El dominio de la vista previa de Sites requiere autorización adicional si se desea probar allí el ingreso real con Google. La vista previa privada permite recorrer el diseño mediante la opción explícita «Explorar la vista previa» y nunca simula una cuenta autenticada.

Para ocultar el acceso de demostración al entregar el aula a estudiantes, establece `previewEnabled: false` en `config.js`. El ingreso real utiliza Firebase Google Authentication y no un formulario que acepte un correo sin verificar.

Esta es una web estática: el inicio con Google organiza la sesión de la interfaz y no vuelve privados los archivos estáticos ni protege videos de YouTube. No se almacenan datos académicos en Firestore ni se modifican las reglas del proyecto existente.

## Publicar en GitHub Pages

En el repositorio `aludenah/sin_limites_v1`, abre **Settings → Pages** y selecciona **Deploy from a branch → main → / (root)**. El enlace definitivo lo proporciona GitHub después de completar la publicación. La web funciona bajo una subcarpeta sin reescribir rutas porque usa navegación con `#` y enlaces relativos.

## Fuentes curriculares

La distribución en 24 temas es una organización pedagógica de los contenidos de **temario_sm_2026_ii.pdf**, localizado en la carpeta del proyecto, complementada por el catálogo de la web anterior. No representa una numeración oficial de 24 capítulos de la UNMSM. Se respetan al inicio los títulos de las PPT disponibles en los cursos de Lenguaje, Geometría, Trigonometría, Literatura, Habilidad Verbal, Habilidad Lógico-Matemática, Historia del Perú, Historia Universal, Química y Biología.

La paleta, el logo permanente con hélice y el personaje corresponden a la **Guía de estilo general** y a **Formato Física.pptx** del proyecto. Los materiales originales de Drive no se duplicaron ni se cambió su organización.

## Validación

En la copia de Sites: `node tests/check.mjs`. La verificación recorre las 432 rutas de temas, el buscador, los estados pendientes, las 10 preguntas de muestra, las puntuaciones y los solucionarios. No sustituye la revisión visual en navegador ni el ingreso real con una cuenta Google.

Referencias de implementación: [Google en Firebase](https://firebase.google.com/docs/auth/web/google-signin?hl=es-419) y [reproductores de YouTube](https://developers.google.com/youtube/player_parameters).
