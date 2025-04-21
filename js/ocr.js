// ocr.js
// Módulo encargado del reconocimiento de texto usando Tesseract.js

// Exportamos una función asincrónica que recibe una imagen (HTMLImageElement)
// y devuelve un array con los bloques de texto detectado y sus características
export async function recognizeTextFromImage(imageElement) {
  const { TesseractWorker } = Tesseract;
  const worker = new TesseractWorker();

  return new Promise((resolve, reject) => {
    worker
      .recognize(imageElement, 'eng', {
        logger: m => console.log(`[OCR] ${m.status} (${Math.round(m.progress * 100)}%)`)
      })
      .progress(p => {
        // Puedes usar esto para mostrar una barra de progreso
        console.log('[OCR Progress]', p);
      })
      .then(result => {
        const boxes = [];

        // Extraemos solo los datos relevantes de cada palabra detectada
        result.words.forEach(word => {
          boxes.push({
            text: word.text,
            bbox: {
              x: word.bbox.x0,
              y: word.bbox.y0,
              width: word.bbox.x1 - word.bbox.x0,
              height: word.bbox.y1 - word.bbox.y0
            },
            confidence: word.confidence,
            baseline: word.baseline,
            fontSize: word.bbox.y1 - word.bbox.y0 // estimación rápida
          });
        });

        worker.terminate();
        resolve(boxes);
      })
      .catch(err => {
        console.error('[OCR Error]', err);
        worker.terminate();
        reject(err);
      });
  });
}
