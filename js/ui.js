// ui.js
// Módulo encargado de las interacciones de usuario sobre el canvas

import { getClickedTextIndex, updateText } from './canvas.js';

let currentInput = null;
let selectedTextIndex = -1;
let canvasElement = null;

/**
 * Inicializa la gestión de eventos UI sobre el canvas.
 */
export function enableCanvasInteraction(canvasId) {
  canvasElement = document.getElementById(canvasId);

  canvasElement.addEventListener('click', handleCanvasClick);
}

/**
 * Captura el clic sobre el canvas y muestra un input flotante si se clicó una palabra.
 */
function handleCanvasClick(event) {
  const rect = canvasElement.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const index = getClickedTextIndex(x, y);
  if (index !== -1) {
    selectedTextIndex = index;
    showEditInput(x, y);
  } else {
    removeEditInput();
  }
}

/**
 * Crea y posiciona un input para editar el texto clicado.
 */
function showEditInput(x, y) {
  removeEditInput(); // Si ya hay uno, lo quitamos

  currentInput = document.createElement('input');
  currentInput.type = 'text';
  currentInput.placeholder = 'Editar texto...';
  currentInput.style.position = 'absolute';
  currentInput.style.top = `${canvasElement.offsetTop + y}px`;
  currentInput.style.left = `${canvasElement.offsetLeft + x}px`;
  currentInput.style.zIndex = 10;
  currentInput.style.padding = '5px';
  currentInput.style.fontSize = '14px';
  currentInput.style.border = '1px solid #999';
  currentInput.style.borderRadius = '4px';

  document.body.appendChild(currentInput);
  currentInput.focus();

  // Confirmar edición con Enter
  currentInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      commitTextEdit(currentInput.value);
    }
  });

  // Cancelar con Escape
  currentInput.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      removeEditInput();
    }
  });
}

/**
 * Aplica el nuevo texto y redibuja el canvas.
 */
function commitTextEdit(newText) {
  if (selectedTextIndex !== -1 && newText.trim() !== '') {
    updateText(selectedTextIndex, newText.trim());
  }
  removeEditInput();
}

/**
 * Elimina el input flotante si existe.
 */
function removeEditInput() {
  if (currentInput) {
    document.body.removeChild(currentInput);
    currentInput = null;
    selectedTextIndex = -1;
  }
}
