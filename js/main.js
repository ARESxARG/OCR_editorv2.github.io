// main.js
// Archivo principal que conecta los módulos: OCR, canvas y UI

import { initCanvas, drawImage, setTextBoxes, exportCanvasImage } from './canvas.js';
import { recognizeTextFromImage } from './ocr.js';
import { enableCanvasInteraction } from './ui.js';

// Referencias al DOM
const fileInput = document.getElementById('imageLoader');
const hiddenImg = document.getElementById('imagePreview');
const exportBtn = document.getElementById('exportBtn');
const canvasId = 'imageCanvas';

// Inicializamos el canvas y eventos
initCanvas(canvasId);
enableCanvasInteraction(canvasId);

// Escucha cuando se carga una imagen
fileInput.addEventListener('change', handleImageUpload);

// Escucha para exportar la imagen final
exportBtn.addEventListener('click', () => {
  const dataUrl = exportCanvasImage('image/png');

  // Crear enlace de descarga automático
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = 'imagen-editada.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

/**
 * Procesa la imagen seleccionada por el usuario
 */
function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = e => {
    hiddenImg.src = e.target.result;

    // Esperamos a que se cargue la imagen antes de continuar
    hiddenImg.onload = async () => {
      drawImage(hiddenImg); // Dibuja la imagen en el canvas

      try {
        const words = await recognizeTextFromImage(hiddenImg);
        setTextBoxes(words); // Renderiza texto detectado en el canvas
      } catch (error) {
        alert('Ocurrió un error al procesar la imagen.');
        console.error(error);
      }
    };
  };

  reader.readAsDataURL(file);
}
