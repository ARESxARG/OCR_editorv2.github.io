// canvas.js
// Módulo encargado del renderizado de la imagen y el texto sobre el Canvas

let canvas, ctx;
let image = null;
let textBoxes = []; // Array de palabras detectadas con posiciones y texto

/**
 * Inicializa el canvas y su contexto.
 */
export function initCanvas(canvasId) {
  canvas = document.getElementById(canvasId);
  ctx = canvas.getContext('2d');
}

/**
 * Dibuja la imagen en el canvas y ajusta su tamaño.
 */
export function drawImage(img) {
  image = img;

  // Ajustamos el tamaño del canvas a la imagen
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0);

  // Después de dibujar la imagen, redibujamos los textos
  drawAllText();
}

/**
 * Guarda las cajas de texto reconocidas para pintarlas y permitir interacción.
 */
export function setTextBoxes(boxes) {
  textBoxes = boxes;
  drawAllText();
}

/**
 * Dibuja todas las palabras sobre la imagen en su posición original.
 */
function drawAllText() {
  if (!image || textBoxes.length === 0) return;

  // Volvemos a dibujar la imagen base
  ctx.drawImage(image, 0, 0);

  textBoxes.forEach(box => {
    drawTextBox(box);
  });
}

/**
 * Dibuja una palabra sobre el canvas según sus coordenadas.
 */
function drawTextBox(box) {
  ctx.font = `${box.fontSize}px sans-serif`; // Fuente estimada
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';     // Color provisional, luego puede ser más preciso
  ctx.fillText(box.text, box.bbox.x, box.bbox.y + box.bbox.height);
}

/**
 * Detecta si el usuario hace clic sobre un texto.
 * Devuelve el índice del texto clicado o -1 si ninguno.
 */
export function getClickedTextIndex(x, y) {
  return textBoxes.findIndex(box => {
    return (
      x >= box.bbox.x &&
      x <= box.bbox.x + box.bbox.width &&
      y >= box.bbox.y &&
      y <= box.bbox.y + box.bbox.height
    );
  });
}

/**
 * Permite actualizar el texto de una palabra específica.
 */
export function updateText(index, newText) {
  if (textBoxes[index]) {
    textBoxes[index].text = newText;
    drawAllText(); // Redibujamos todo
  }
}

/**
 * Exporta el contenido actual del canvas como imagen.
 */
export function exportCanvasImage(type = 'image/png') {
  return canvas.toDataURL(type);
}
