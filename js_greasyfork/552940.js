// ==UserScript==
// @name         Clastify PDF Exporter with OCR
// @namespace    https://www.youtube.com/watch?v=dQw4w9WgXcQ
// @version      1.0
// @description  Export Clastify canvases into a PDF, allowing user to draw boxes for content to exclude from OCR, with individual removal, scrolling, Clastify logo OCR exclusion zone, and dynamic banner removal.
// @match        https://www.clastify.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552940/Clastify%20PDF%20Exporter%20with%20OCR.user.js
// @updateURL https://update.greasyfork.org/scripts/552940/Clastify%20PDF%20Exporter%20with%20OCR.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- Config ---
  const DEFAULT_DEBUG_MODE = false;      // Default for PDF export debugging (show all OCR text/boxes)
  let debugPdfExport = DEFAULT_DEBUG_MODE; // Can be toggled by annotation UI
  const PAGE_MODE = 'native';           // 'fit' = A4 with scaling; 'native' = page size equals canvas size
  const CALIBRATION_SIZE = 1.4;       // multiplier for font size (vertical fit)
  const BASELINE_OFFSET = -0.2;       // fraction of bbox height to shift baseline
  const ZOOM_PERCENT = 100;           // force zoom for max-quality canvases
  const SCROLL_STEP = 600;
  const SCROLL_DELAY_MS = 400;
  const RENDER_WAIT_MS = 1500;
  const LOW_CONFIDENCE_THRESHOLD = 60; // Tesseract words below this confidence are 'low confidence'
  const ANNOTATION_Z_INDEX = 10000;    // Z-index for annotation UI and overlays
  const EXPORT_SCALE = 1.75;           // Scale factor for high-res export buffer

  // New OCR Refinement Config
  const OUTLIER_Y_DEVIATION_FACTOR = 0.2; // Max allowed deviation from median Y-coordinates for words to be 'inlier' (tighter)
  const LINE_HEIGHT_BUFFER_MULTIPLIER = 1.15; // Multiplier to slightly increase calculated line height for ascenders/descenders
  const MAX_LINE_HEIGHT_FACTOR_OF_MEDIAN_WORD_HEIGHT = 1.8; // Cap effectiveHeight to prevent extreme cases (e.g. 1.8x median word height)
  const FONT_SIZE_TOLERANCE = 0.85; // Factor: if text width < target * tolerance, grow; if > target / tolerance, shrink.
  const FONT_SIZE_MAX_GROWTH_FACTOR = 1.1; // Max factor to grow font size beyond initial height-based calculation
  const SPACE_FONT_SIZE_RATIO_TO_WORD = 0.5; // Font size of inserted spaces relative to the word's font size
  const SCROLL_DEBOUNCE_DELAY = 200; // Milliseconds to wait before executing scroll-triggered functions

  // This defines a rectangular area in the top-right corner of each canvas
  // that will be automatically excluded from OCR processing.
  // Coordinates are relative to the canvas's natural (unscaled) width and height.
  const UPPER_RIGHT_EXCLUSION = {
    x_offset_from_right: 200, // 200px from the right edge of the canvas
    y_offset_from_top: 0,     // 0px from the top edge of the canvas
    width: 200,               // 200px wide
    height: 80,               // 80px tall
    description: 'Logo OCR Exclusion' // For debug logs if needed
  };

  // --- Global Annotation Storage ---
  // Stores annotations per original canvas (page).
  // Each entry in the array corresponds to a canvas index.
  // Each canvas's annotations is an array of { x, y, width, height, type: 'user_exclude_ocr', id: unique ID }
  window.clastifyPageAnnotations = window.clastifyPageAnnotations || [];
  let currentAnnotationType = 'user_exclude_ocr'; // Unified annotation type

  let isOcrEnabled = false;
  let isExporting = false;


  // --- UI Elements ---
  const BUTTON_SIZE = 140;
  const BUTTON_GAP = 10;

  const savePdfBtn = document.createElement('button');
  savePdfBtn.textContent = '💾 Save as PDF';
  Object.assign(savePdfBtn.style, {
    position: 'fixed', top: `${BUTTON_GAP}px`, right: `${BUTTON_GAP}px`, zIndex: ANNOTATION_Z_INDEX + 10,
    width: `${BUTTON_SIZE}px`, padding: '8px 12px', background: '#28a745', color: '#fff',
    border: 'none', borderRadius: '4px', cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)', display: 'block', textAlign: 'center'
  });
  document.body.appendChild(savePdfBtn);

  const ocrToggleBtn = document.createElement('button');
  Object.assign(ocrToggleBtn.style, {
    position: 'fixed', top: `${BUTTON_GAP}px`, right: `${2 * BUTTON_GAP + BUTTON_SIZE}px`, zIndex: ANNOTATION_Z_INDEX + 10,
    width: `${BUTTON_SIZE}px`, padding: '8px 12px', background: '#dc3545', color: '#fff',
    border: 'none', borderRadius: '4px', cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)', display: 'block', textAlign: 'center'
  });
  function updateOcrBtn() {
    ocrToggleBtn.textContent = isOcrEnabled ? '📄OCR: On' : '📄OCR: Off';
    ocrToggleBtn.style.background = isOcrEnabled ? '#28a745' : '#dc3545';
  }
  updateOcrBtn();
  ocrToggleBtn.addEventListener('click', () => {
    isOcrEnabled = !isOcrEnabled;
    updateOcrBtn();
    debugToggleBtn.style.display = isOcrEnabled ? 'block' : 'none';
    annotateBtn.style.display = isOcrEnabled ? 'block' : 'none';
    if (isOcrEnabled) {
      annotateBtn.style.top = `${2 * BUTTON_GAP + 34}px`;
      annotateBtn.style.right = ocrToggleBtn.style.right;
    }
  });
  document.body.appendChild(ocrToggleBtn);

  const annotateBtn = document.createElement('button');
  annotateBtn.textContent = '✍️ Exclude OCR';
  Object.assign(annotateBtn.style, {
    position: 'fixed', top: `${2 * BUTTON_GAP + 34}px`, right: `${2 * BUTTON_GAP + BUTTON_SIZE}px`, zIndex: ANNOTATION_Z_INDEX + 10,
    width: `${BUTTON_SIZE}px`, padding: '8px 12px', background: '#ffc107', color: '#333',
    border: 'none', borderRadius: '4px', cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)', display: 'none', textAlign: 'center'
  });
  document.body.appendChild(annotateBtn);

  const debugToggleBtn = document.createElement('button');
  Object.assign(debugToggleBtn.style, {
    position: 'fixed', top: `${BUTTON_GAP}px`, right: `${3 * BUTTON_GAP + 2 * BUTTON_SIZE}px`, zIndex: ANNOTATION_Z_INDEX + 10,
    width: `${BUTTON_SIZE}px`, padding: '8px 12px', color: '#fff',
    border: 'none', borderRadius: '4px', cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)', display: 'none', textAlign: 'center'
  });
  function updateDebugBtn() {
    debugToggleBtn.textContent = `🔧 Debug: ${debugPdfExport ? 'On' : 'Off'}`;
    debugToggleBtn.style.background = debugPdfExport ? '#28a745' : '#dc3545';
  }
  updateDebugBtn();
  debugToggleBtn.addEventListener('click', () => {
    debugPdfExport = !debugPdfExport;
    updateDebugBtn();
  });
  document.body.appendChild(debugToggleBtn);

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  Object.assign(cancelBtn.style, {
    position: 'fixed', top: '10px', right: `${BUTTON_GAP}px`, zIndex: ANNOTATION_Z_INDEX + 10,
    width: `${BUTTON_SIZE}px`, padding: '8px 12px', background: '#dc3545', color: '#fff',
    border: 'none', borderRadius: '4px', cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)', display: 'none', textAlign: 'center'
  });
  cancelBtn.addEventListener('click', () => {
    isExporting = false;
    hideProgress();
    cancelBtn.style.display = 'none';
    savePdfBtn.style.display = 'block';
    ocrToggleBtn.style.display = 'block';
    debugToggleBtn.style.display = isOcrEnabled ? 'block' : 'none';
    annotateBtn.style.display = isOcrEnabled ? 'block' : 'none';
    if (isOcrEnabled) {
      annotateBtn.style.top = `${2 * BUTTON_GAP + 34}px`;
      annotateBtn.style.right = ocrToggleBtn.style.right;
    }
  });
  document.body.appendChild(cancelBtn);

  const progressBox = document.createElement('div');
  Object.assign(progressBox.style, {
    position: 'fixed', bottom: '10px', right: '10px', zIndex: ANNOTATION_Z_INDEX + 10,
    padding: '8px 12px', background: '#000', color: '#fff',
    borderRadius: '4px', fontSize: '13px', fontFamily: 'monospace',
    display: 'none', whiteSpace: 'pre-line'
  });
  document.body.appendChild(progressBox);

  // --- Annotation Control Panel ---
  const annotationPanel = document.createElement('div');
  Object.assign(annotationPanel.style, {
    position: 'fixed', top: '10px', left: '10px', zIndex: ANNOTATION_Z_INDEX + 10,
    background: '#333', color: '#fff', padding: '8px', borderRadius: '6px', /* Smaller padding, less rounded corners */
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)', display: 'none', /* Smaller shadow */
    fontFamily: 'sans-serif', fontSize: '12px', lineHeight: '1.4', /* Smaller font size, tighter line height */
    width: '220px' /* Fixed width to make it slicker */
  });
  annotationPanel.innerHTML = `
    <h4 style="margin-top:0; margin-bottom: 8px; color: #ffc107; font-size: 14px;">OCR Exclusion</h4>
    <p style="margin-bottom: 10px; font-size: 11px;">Draw rectangles over content you don't want to be OCR'd. It is a good idea to draw over any images, diagrams, and mathematical equations, as they confuse the OCR engine.</p>
    <div style="margin-bottom: 10px;">
        <button id="clearAllAnnotationsBtn" style="background:#dc3545; color:#fff; border:none; padding:5px 8px; border-radius:3px; cursor:pointer; width:100%; font-size: 12px;">Remove All Annotations</button>
    </div>
    <div>
        <button id="finishAnnotationBtn" style="background:#007bff; color:#fff; border:none; padding:6px 10px; border-radius:3px; cursor:pointer; width:100%; font-size: 13px;">Finish Annotating</button>
    </div>
  `;
  document.body.appendChild(annotationPanel);

  const clearAllAnnotationsBtn = annotationPanel.querySelector('#clearAllAnnotationsBtn');
  const finishAnnotationBtn = annotationPanel.querySelector('#finishAnnotationBtn');


  function updateProgress(msg) {
    progressBox.style.display = 'block';
    progressBox.textContent = msg;
  }

  function hideProgress() {
    progressBox.style.display = 'none';
  }

  // --- Load libraries dynamically ---
  function loadScript(src) {
    return new Promise(resolve => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      document.head.appendChild(s);
    });
  }

  async function loadLibs() {
    if (!window.jspdf) {
      updateProgress('Loading jsPDF library...');
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    }
    if (isOcrEnabled && !window.Tesseract) {
      updateProgress('Loading Tesseract.js library...');
      await loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js');
    }
    updateProgress('Libraries loaded.');
  }

  // --- Filename helpers ---
  function sanitizeFilename(str) {
    return (str || 'document')
      .replace(/[<>:"/\\|?*]+/g, '')
      .replace(/\s+/g, '_');
  }

  function getDocTitle() {
    return (document.title || '')
      .replace(/\s*\|\s*Clastify\s*$/i, '')
      .trim();
  }

  // --- High-res export buffer creation ---
  function createHighResCanvas(originalCanvas, scale) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = originalCanvas.width * scale;
    tempCanvas.height = originalCanvas.height * scale;
    const ctx = tempCanvas.getContext('2d');
    ctx.drawImage(originalCanvas, 0, 0, tempCanvas.width, tempCanvas.height);
    return tempCanvas;
  }

  // --- Annotation Mode Logic ---
  let isAnnotating = false;
  let currentOverlay = null; // The overlay div currently being drawn on/hovered
  let activeCanvasIndex = -1; // The index of the canvas whose overlay is currentOverlay
  let startX, startY; // Mouse down coordinates relative to the overlay
  let drawingRect = null; // The visual rectangle element being drawn
  let annotationIdCounter = 0; // Simple ID for unique annotations

  function enterAnnotationMode() {
    isAnnotating = true;
    savePdfBtn.style.display = 'none';
    ocrToggleBtn.style.display = 'none';
    debugToggleBtn.style.display = 'none';
    annotateBtn.style.display = 'none';
    annotationPanel.style.display = 'block';
    cancelBtn.style.display = 'none';

    const canvases = Array.from(document.querySelectorAll('canvas'));
    if (canvases.length === 0) {
      alert('No canvases found for annotation. Scroll the document first.');
      exitAnnotationMode();
      return;
    }

    // Initialize annotations storage.
    if (window.clastifyPageAnnotations.length < canvases.length) {
      for (let k = window.clastifyPageAnnotations.length; k < canvases.length; k++) {
        window.clastifyPageAnnotations.push([]);
      }
    }

    // Create overlays for each canvas
    canvases.forEach((canvas, index) => {
      const canvasRect = canvas.getBoundingClientRect(); // Get accurate position of canvas
      const overlay = document.createElement('div');
      Object.assign(overlay.style, {
        position: 'absolute', // Absolute position to lock to page
        left: `${canvasRect.left + window.scrollX}px`, // Corrected: Use clientRect + scroll
        top: `${canvasRect.top + window.scrollY}px`,   // Corrected: Use clientRect + scroll
        width: `${canvasRect.width}px`,                 // Use clientRect for dimensions
        height: `${canvasRect.height}px`,               // Use clientRect for dimensions
        zIndex: ANNOTATION_Z_INDEX,
        cursor: 'crosshair',
        pointerEvents: 'auto', // Crucial to receive mouse events
      });
      overlay.dataset.canvasIndex = index;
      overlay.classList.add('clastify-annotation-overlay'); // Add a class for easy selection

      // Render existing annotations for this page
      renderAnnotationsOnOverlay(overlay, index, canvas.width, canvas.height, canvasRect.width, canvasRect.height);

      overlay.addEventListener('mousedown', startDrawing);
      overlay.addEventListener('mousemove', drawRectangle);
      overlay.addEventListener('mouseup', stopDrawing);
      overlay.addEventListener('mouseenter', handleOverlayMouseEnter); // For potential future page-specific actions
      overlay.addEventListener('mouseleave', handleOverlayMouseLeave); // For potential future page-specific actions
      document.body.appendChild(overlay);
    });

    // No type buttons to update
  }

  function exitAnnotationMode() {
    isAnnotating = false;
    savePdfBtn.style.display = 'block';
    ocrToggleBtn.style.display = 'block';
    if (isOcrEnabled) {
      debugToggleBtn.style.display = 'block';
      annotateBtn.style.display = 'block';
      annotateBtn.style.top = `${2 * BUTTON_GAP + 34}px`;
      annotateBtn.style.right = ocrToggleBtn.style.right;
    } else {
      debugToggleBtn.style.display = 'none';
      annotateBtn.style.display = 'none';
    }
    annotationPanel.style.display = 'none';
    cancelBtn.style.display = 'none';

    document.querySelectorAll('.clastify-annotation-overlay').forEach(overlay => {
      overlay.removeEventListener('mousedown', startDrawing);
      overlay.removeEventListener('mousemove', drawRectangle);
      overlay.removeEventListener('mouseup', stopDrawing);
      overlay.removeEventListener('mouseenter', handleOverlayMouseEnter);
      overlay.removeEventListener('mouseleave', handleOverlayMouseLeave);
      overlay.remove();
    });
    activeCanvasIndex = -1; // Reset active index
  }

  // These handlers are kept for structural completeness, though 'clear for hovered page' is removed
  function handleOverlayMouseEnter(event) {
    activeCanvasIndex = parseInt(event.currentTarget.dataset.canvasIndex, 10);
  }

  function handleOverlayMouseLeave() {
    activeCanvasIndex = -1;
  }

  function removeAnnotation(pageIndex, annotationId) {
    window.clastifyPageAnnotations[pageIndex] = window.clastifyPageAnnotations[pageIndex].filter(
      ann => ann.id !== annotationId
    );
    const canvas = document.querySelectorAll('canvas')[pageIndex];
    const overlay = document.querySelector(`.clastify-annotation-overlay[data-canvas-index="${pageIndex}"]`);
    if (overlay && canvas) {
        // Pass canvas.offsetWidth/Height for the current scaled dimensions of the overlay
        const canvasRect = canvas.getBoundingClientRect();
        renderAnnotationsOnOverlay(overlay, pageIndex, canvas.width, canvas.height, canvasRect.width, canvasRect.height);
    }
  }


  function renderAnnotationsOnOverlay(overlay, pageIndex, canvasNaturalWidth, canvasNaturalHeight, overlayDisplayWidth, overlayDisplayHeight) {
    overlay.innerHTML = ''; // Clear previous drawings

    const annotations = window.clastifyPageAnnotations[pageIndex] || [];
    annotations.forEach(ann => {
      const scaleX = overlayDisplayWidth / canvasNaturalWidth;
      const scaleY = overlayDisplayHeight / canvasNaturalHeight;

      const rect = document.createElement('div');
      Object.assign(rect.style, {
        position: 'absolute',
        left: `${ann.x * scaleX}px`,
        top: `${ann.y * scaleY}px`,
        width: `${ann.width * scaleX}px`,
        height: `${ann.height * scaleY}px`,
        opacity: '0.7',
        pointerEvents: 'none' // Don't block mouse events for new drawing, unless it's the 'X' button
      });

      // For user-drawn annotations: specific border and 'X' button (unified color)
      Object.assign(rect.style, {
        border: `2px solid #9c27b0`, // Purple for user-drawn exclusion boxes
      });

      // Add 'X' button for user-drawn annotations
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'X';
      Object.assign(removeBtn.style, {
        position: 'absolute',
        top: '-10px', right: '-10px',
        background: '#dc3545', color: 'white',
        border: 'none', borderRadius: '50%',
        width: '20px', height: '20px',
        fontSize: '12px', lineHeight: '10px',
        textAlign: 'center', cursor: 'pointer',
        pointerEvents: 'auto', // Allow clicks on the button
        zIndex: ANNOTATION_Z_INDEX + 1 // Ensure it's above other elements
      });
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering the mousedown on the overlay
        removeAnnotation(pageIndex, ann.id);
      });
      rect.appendChild(removeBtn);

      overlay.appendChild(rect);
    });
  }

  function getOverlayRelativeCoords(event, overlay) {
    const rect = overlay.getBoundingClientRect(); // Still use viewport-relative for mouse within overlay
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x, y };
  }

  function startDrawing(event) {
    if (event.button !== 0) return; // Only left-click
    if (drawingRect) return; // Prevent multiple simultaneous draws

    currentOverlay = event.currentTarget;
    activeCanvasIndex = parseInt(currentOverlay.dataset.canvasIndex, 10);
    const coords = getOverlayRelativeCoords(event, currentOverlay);
    startX = coords.x;
    startY = coords.y;

    drawingRect = document.createElement('div');
    Object.assign(drawingRect.style, {
      position: 'absolute',
      border: `2px dashed #9c27b0`, // Purple for drawing
      opacity: '0.7',
      pointerEvents: 'none',
      left: `${startX}px`,
      top: `${startY}px`,
      width: '0px',
      height: '0px'
    });
    currentOverlay.appendChild(drawingRect);
  }

  function drawRectangle(event) {
    if (!drawingRect) return;
    const coords = getOverlayRelativeCoords(event, currentOverlay);
    const currentX = coords.x;
    const currentY = coords.y;

    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);
    const left = Math.min(startX, currentX);
    const top = Math.min(startY, currentY);

    Object.assign(drawingRect.style, {
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`
    });
  }

  function stopDrawing(event) {
    if (!drawingRect) return;

    const coords = getOverlayRelativeCoords(event, currentOverlay);
    const endX = coords.x;
    const endY = coords.y;

    const canvas = document.querySelectorAll('canvas')[activeCanvasIndex];
    // Use getBoundingClientRect for the current displayed dimensions of the overlay
    const overlayRect = currentOverlay.getBoundingClientRect();
    const overlayDisplayWidth = overlayRect.width;
    const overlayDisplayHeight = overlayRect.height;

    const scaleX = canvas.width / overlayDisplayWidth; // Canvas's natural width vs displayed width
    const scaleY = canvas.height / overlayDisplayHeight; // Canvas's natural height vs displayed height

    const x = Math.round(Math.min(startX, endX) * scaleX);
    const y = Math.round(Math.min(startY, endY) * scaleY);
    const width = Math.round(Math.abs(endX - startX) * scaleX);
    const height = Math.round(Math.abs(endY - startY) * scaleY);

    if (width > 5 && height > 5) { // Only save if a reasonable size
      annotationIdCounter++;
      window.clastifyPageAnnotations[activeCanvasIndex].push({ x, y, width, height, type: currentAnnotationType, id: `manual-${annotationIdCounter}` });
      // Rerender the overlay to show the final, non-dashed rectangle with 'X' button
      renderAnnotationsOnOverlay(currentOverlay, activeCanvasIndex, canvas.width, canvas.height, overlayDisplayWidth, overlayDisplayHeight);
    } else {
        drawingRect.remove(); // Remove small, insignificant draws
    }

    drawingRect = null;
    currentOverlay = null; // Important to reset
    activeCanvasIndex = -1; // Important to reset
  }

  // --- Bounding box utility functions (needed for annotation overlap check) ---
  function getBbox(wObj) {
    const x0 = (wObj.bbox?.x0 ?? wObj.x ?? wObj.left ?? 0);
    const y0 = (wObj.bbox?.y0 ?? wObj.y ?? wObj.top ?? 0);
    const x1 = (wObj.bbox?.x1 ?? (x0 + (wObj.width ?? 0)));
    const y1 = (wObj.bbox?.y1 ?? (y0 + (wObj.height ?? 0)));
    return { x0, y0, x1, y1 };
  }

  // Function to generate a robust word ID, independent of parent line object structure for lookups
  function generateRobustWordId(pageIndex, wordObj) {
      // If Tesseract provides a word_id, use it directly as it's likely the most unique
      if (wordObj.word_id) {
          return `p${pageIndex}-${wordObj.word_id}`;
      }
      // Fallback: use a combination of page index, word text, and its bounding box coordinates
      // Using x0, y0, x1, y1 from bbox makes it highly unique for words on a page
      const { x0, y0, x1, y1 } = getBbox(wordObj);
      const textSnippet = (wordObj.text || '').substring(0, 20).replace(/\s+/g, '_'); // Sanitize text
      return `p${pageIndex}-${textSnippet}-${x0}-${y0}-${x1}-${y1}`;
  }

  // Helper to get median from an array
  function getMedian(arr) {
      if (arr.length === 0) return 0;
      const sorted = [...arr].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  }


  // --- Main export function (modified to use annotations) ---
  async function exportPDF() {
    isExporting = true;

    // Hide all buttons and show cancel
    savePdfBtn.style.display = 'none';
    ocrToggleBtn.style.display = 'none';
    debugToggleBtn.style.display = 'none';
    annotateBtn.style.display = 'none';
    annotationPanel.style.display = 'none';
    cancelBtn.style.display = 'block';

    await loadLibs();
    const { jsPDF } = window.jspdf;

    if (!isExporting) return;

    // Step 2: Auto-scroll to trigger lazy loading
    updateProgress('Scrolling to load all pages...');
    const firstCanvas = document.querySelector('canvas');
    let dynamicStep = SCROLL_STEP; // fallback
    if (firstCanvas) {
      dynamicStep = firstCanvas.getBoundingClientRect().height + 20;
    }
    for (let y = 0; y < document.body.scrollHeight; y += dynamicStep) {
      if (!isExporting) break;
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, SCROLL_DELAY_MS));
    }
    window.scrollTo(0, 0);

    if (!isExporting) {
      return;
    }

    // Step 3: Collect canvases
    const canvases = Array.from(document.querySelectorAll('canvas'));
    if (canvases.length === 0) {
      alert('No canvases found. Scroll the document and try again.');
      isExporting = false;
      cancelBtn.style.display = 'none';
      savePdfBtn.style.display = 'block';
      ocrToggleBtn.style.display = 'block';
      debugToggleBtn.style.display = isOcrEnabled ? 'block' : 'none';
      annotateBtn.style.display = isOcrEnabled ? 'block' : 'none';
      if (isOcrEnabled) {
        annotateBtn.style.top = `${2 * BUTTON_GAP + 34}px`;
        annotateBtn.style.right = ocrToggleBtn.style.right;
      }
      return;
    }

    // Ensure annotations array matches canvases length, fill with empty arrays if needed
    if (window.clastifyPageAnnotations.length < canvases.length) {
        for (let k = window.clastifyPageAnnotations.length; k < canvases.length; k++) {
            window.clastifyPageAnnotations.push([]);
        }
    }

    if (!isExporting) {
      return;
    }

    // Step 4: Create PDF
    let pdf;
    if (PAGE_MODE === 'fit') {
      pdf = new jsPDF({ unit: 'px', format: 'a4' });
    } else {
      const first = canvases[0];
      pdf = new jsPDF({ unit: 'px', format: [first.width, first.height] });
    }

    let invisibleState = null;
    if (isOcrEnabled) {
      const hasGState = pdf.GState ? true : false;
      invisibleState = hasGState ? new pdf.GState({ opacity: 0 }) : null;
    }

    for (let i = 0; i < canvases.length; i++) {
      if (!isExporting) break;
      const c = canvases[i];
      updateProgress(`Processing page ${i + 1} of ${canvases.length}...\n(Rendering image)`);

      // Create high-res buffer for export
      const highResCanvas = createHighResCanvas(c, EXPORT_SCALE);

      let pageWidth, pageHeight, xOffset, yOffset, imgW, imgH, ratio;

      if (PAGE_MODE === 'fit') {
        pageWidth = pdf.internal.pageSize.getWidth();
        pageHeight = pdf.internal.pageSize.getHeight();
        ratio = Math.min(pageWidth / c.width, pageHeight / c.height);
        imgW = Math.round(c.width * ratio);
        imgH = Math.round(c.height * ratio);
        xOffset = Math.round((pageWidth - imgW) / 2);
        yOffset = Math.round((pageHeight - imgH) / 2);

        if (i > 0) pdf.addPage();
        pdf.addImage(highResCanvas.toDataURL('image/png'), 'PNG', xOffset, yOffset, imgW, imgH);
      } else { // 'native' mode
        if (i > 0) pdf.addPage([c.width, c.height], 'portrait');
        pageWidth = c.width; pageHeight = c.height; ratio = 1;
        imgW = c.width; imgH = c.height;
        xOffset = 0; yOffset = 0;
        pdf.addImage(highResCanvas.toDataURL('image/png'), 'PNG', 0, 0, c.width, c.height);
      }

      if (!isOcrEnabled) continue;

      if (!isExporting) break;

      // --- Process Annotations ---
      const pageAnnotations = window.clastifyPageAnnotations[i] || [];

      // Calculate fixed upper-right exclusion zone for the *current canvas*
      const fixedExclusionX = c.width - UPPER_RIGHT_EXCLUSION.x_offset_from_right;
      const fixedExclusionY = UPPER_RIGHT_EXCLUSION.y_offset_from_top;
      const fixedExclusionWidth = UPPER_RIGHT_EXCLUSION.width;
      const fixedExclusionHeight = UPPER_RIGHT_EXCLUSION.height;

      const fixedExclusionBbox = {
          x: fixedExclusionX,
          y: fixedExclusionY,
          width: fixedExclusionWidth,
          height: fixedExclusionHeight
      };

      // Step 5: OCR this page (only for non-annotated regions), using line-based height
      let result;
      try {
          updateProgress(`Processing page ${i + 1} of ${canvases.length}...\n(Tesseract OCR running)`);
          result = await Tesseract.recognize(c, 'eng', {
              logger: m => { // Add a logger to see Tesseract's internal progress
                  if (m.status === 'recognizing') {
                      updateProgress(`Page ${i + 1}/${canvases.length}: OCR progress: ${(m.progress * 100).toFixed(1)}%`);
                  } else if (m.status === 'loading tesseract core' || m.status === 'initializing tesseract' || m.status === 'loading language traineddata') {
                      updateProgress(`Page ${i + 1}/${canvases.length}: OCR status: ${m.status}`);
                  }
              }
          });
          if (!result || !result.data) {
              throw new Error("Tesseract.recognize returned empty or invalid result data.");
          }
          updateProgress(`Processing page ${i + 1} of ${canvases.length}...\n(OCR complete)`);
      } catch (error) {
          console.error(`Tesseract OCR failed for page ${i + 1}:`, error);
          updateProgress(`ERROR: OCR failed for page ${i + 1}. Check console for details. Aborting.`);
          hideProgress();
          isExporting = false;
          cancelBtn.style.display = 'none';
          savePdfBtn.style.display = 'block';
          ocrToggleBtn.style.display = 'block';
          debugToggleBtn.style.display = isOcrEnabled ? 'block' : 'none';
          annotateBtn.style.display = isOcrEnabled ? 'block' : 'none';
          if (isOcrEnabled) {
            annotateBtn.style.top = `${2 * BUTTON_GAP + 34}px`;
            annotateBtn.style.right = ocrToggleBtn.style.right;
          }
          return; // Stop the export process
      }

      if (!isExporting) break;


      const lines = result.data.lines || [];

      // Map to store consistent height, top Y, and potentially adjusted width for words
      const wordFormattingInfoMap = new Map();

      // First pass: Iterate through Tesseract lines to determine robust line heights and prepare for overlap resolution
      for (const line of lines) {
        if (!line.words || line.words.length === 0) continue;

        let lineTopY = line.bbox.y0; // Default to Tesseract's line bbox
        let effectiveHeight = line.bbox.y1 - line.bbox.y0; // Default to Tesseract's line bbox height

        const highConfidenceWordsDetails = []; // To store {wObj, bbox} for robust height calculation

        // Collect high-confidence, non-annotated words for robust height calculation
        for (const wObj of line.words) {
            const bbox = getBbox(wObj); // Tesseract bbox in canvas coords
            const wBbox = { x: bbox.x0, y: bbox.y0, width: bbox.x1 - bbox.x0, height: bbox.y1 - bbox.y0 };

            const isOverlappingAnnotation = pageAnnotations.some(ann => {
                return wBbox.x < ann.x + ann.width &&
                       wBbox.x + wBbox.width > ann.x &&
                       wBbox.y < ann.y + ann.height &&
                       wBbox.y + wBbox.height > ann.y;
            }) || ( // Also check against the fixed upper-right exclusion zone
                wBbox.x < fixedExclusionBbox.x + fixedExclusionBbox.width &&
                wBbox.x + wBbox.width > fixedExclusionBbox.x &&
                wBbox.y < fixedExclusionBbox.y + fixedExclusionBbox.height &&
                wBbox.y + wBbox.height > fixedExclusionBbox.y
            );


            if (!isOverlappingAnnotation && wObj.confidence >= LOW_CONFIDENCE_THRESHOLD) {
                highConfidenceWordsDetails.push({ wObj, bbox });
            }
        }

        // Determine robust line height based on high confidence words
        if (highConfidenceWordsDetails.length > 0) {
            const y0s = highConfidenceWordsDetails.map(d => d.bbox.y0);
            const y1s = highConfidenceWordsDetails.map(d => d.bbox.y1);
            const heights = highConfidenceWordsDetails.map(d => d.bbox.y1 - d.bbox.y0);

            const medianY0 = getMedian(y0s);
            const medianY1 = getMedian(y1s);
            const medianWordHeight = getMedian(heights);

            // Filter outliers based on deviation from median Y
            const filteredWordsDetails = highConfidenceWordsDetails.filter(d => {
                const bbox = d.bbox;
                // A word is an outlier if its top or bottom deviates too much from the median line top/bottom
                return Math.abs(bbox.y0 - medianY0) <= (medianWordHeight * OUTLIER_Y_DEVIATION_FACTOR) &&
                       Math.abs(bbox.y1 - medianY1) <= (medianWordHeight * OUTLIER_Y_DEVIATION_FACTOR);
            });

            if (filteredWordsDetails.length > 0) {
                let finalMinY0 = Infinity;
                let finalMaxY1 = -Infinity;
                for (const d of filteredWordsDetails) {
                    finalMinY0 = Math.min(finalMinY0, d.bbox.y0);
                    finalMaxY1 = Math.max(finalMaxY1, d.bbox.y1);
                }
                lineTopY = finalMinY0;
                effectiveHeight = finalMaxY1 - finalMinY0;
            }
            // If all high-confidence words were filtered as outliers, fall back to line.bbox (already default)
        }

        // Apply a buffer to the effective height
        effectiveHeight *= LINE_HEIGHT_BUFFER_MULTIPLIER;

        // Apply a maximum cap to effectiveHeight to prevent excessively tall boxes from anomalies
        if (highConfidenceWordsDetails.length > 0) {
             const medianInitialWordHeight = getMedian(highConfidenceWordsDetails.map(d => d.bbox.y1 - d.bbox.y0));
             effectiveHeight = Math.min(effectiveHeight, medianInitialWordHeight * MAX_LINE_HEIGHT_FACTOR_OF_MEDIAN_WORD_HEIGHT);
        }

        // Prepare words for overlap resolution and final formatting info storage
        const wordsForOverlapResolution = []; // Only high-confidence for this

        for (const wObj of line.words) {
            const bbox = getBbox(wObj);
            const wBbox = { x: bbox.x0, y: bbox.y0, width: bbox.x1 - bbox.x0, height: bbox.y1 - bbox.y0 };

            const isOverlappingAnnotation = pageAnnotations.some(ann => {
                return wBbox.x < ann.x + ann.width &&
                       wBbox.x + wBbox.width > ann.x &&
                       wBbox.y < ann.y + ann.height &&
                       wBbox.y + wBbox.height > ann.y;
            }) || ( // Also check against the fixed upper-right exclusion zone
                wBbox.x < fixedExclusionBbox.x + fixedExclusionBbox.width &&
                wBbox.x + wBbox.width > fixedExclusionBbox.x &&
                wBbox.y < fixedExclusionBbox.y + fixedExclusionBbox.height &&
                wBbox.y + wBbox.height > fixedExclusionBbox.y
            );

            if (!isOverlappingAnnotation) {
                const wordId = generateRobustWordId(i, wObj);
                wordFormattingInfoMap.set(wordId, {
                    height: effectiveHeight,
                    y0_line: lineTopY,
                    originalWidth: wBbox.width,
                    adjustedWidth: wBbox.width, // Initialize adjusted width
                    isHighConfidence: wObj.confidence >= LOW_CONFIDENCE_THRESHOLD,
                    // Store the original word object's x0 for later use in drawing
                    originalX0: wBbox.x
                });
                if (wObj.confidence >= LOW_CONFIDENCE_THRESHOLD) {
                    wordsForOverlapResolution.push({ wordId, x0: wBbox.x, x1: wBbox.x + wBbox.width });
                }
            }
        }

        // Resolve horizontal overlaps for high-confidence words in this line
        wordsForOverlapResolution.sort((a, b) => a.x0 - b.x0); // Sort by x-start

        for (let k = 0; k < wordsForOverlapResolution.length - 1; k++) {
            const currentWord = wordsForOverlapResolution[k];
            const nextWord = wordsForOverlapResolution[k + 1];

            // Check for overlap
            if (currentWord.x1 > nextWord.x0) {
                const formatInfoCurrent = wordFormattingInfoMap.get(currentWord.wordId);
                // Adjust currentWord's width to end at nextWord's start
                const newAdjustedWidth = nextWord.x0 - currentWord.x0;
                if (formatInfoCurrent && newAdjustedWidth > 0) { // Ensure width doesn't become negative
                    formatInfoCurrent.adjustedWidth = newAdjustedWidth;
                    // Update the x1 in the temp array for potential future overlaps with next words
                    currentWord.x1 = nextWord.x0;
                }
            }
        }
      }

      if (!isExporting) break;

      // Step 6: Draw OCR text and bounding boxes for non-annotated regions
      if (!debugPdfExport && invisibleState) {
        pdf.setGState(invisibleState);
      }
      pdf.setFont('helvetica', 'normal');

      // Iterate through blocks, paragraphs, then lines, then words within lines, to correctly place spaces
      for (const block of result.data.blocks || []) {
          for (const paragraph of block.paragraphs || []) {
              for (const line of paragraph.lines || []) {
                  const lineWordsToDraw = [];
                  for (const wObj of line.words || []) {
                      const wordId = generateRobustWordId(i, wObj);
                      if (wordFormattingInfoMap.has(wordId)) {
                          lineWordsToDraw.push(wObj); // Push the original word object
                      }
                  }

                  // Now process words for this specific line, adding spaces between them
                  for (let k = 0; k < lineWordsToDraw.length; k++) {
                      const wObj = lineWordsToDraw[k];
                      const txt = (wObj.text || '').trim();
                      if (!txt) continue;

                      const wordId = generateRobustWordId(i, wObj);
                      const formatInfo = wordFormattingInfoMap.get(wordId);

                      if (formatInfo === undefined) {
                          console.warn(`Formatting info not found for word: "${wObj.text}" (ID: ${wordId}). Skipping word.`);
                          continue;
                      }

                      const x0 = formatInfo.originalX0; // Use the stored original X0
                      const effectiveHeight = formatInfo.height;
                      const lineTopY = formatInfo.y0_line;
                      const rectWidthForText = formatInfo.adjustedWidth;

                      // Calculate initial font size based on effectiveHeight (vertical fit)
                      let fontSize = Math.max(1, effectiveHeight * ratio * CALIBRATION_SIZE);
                      pdf.setFontSize(fontSize); // Set temporarily to measure text width

                      // Adjust font size based on horizontal fit
                      const textWidthMeasured = pdf.getTextWidth(txt);
                      const targetWidthInPdfUnits = rectWidthForText * ratio;

                      if (textWidthMeasured > targetWidthInPdfUnits * (1 + (1 - FONT_SIZE_TOLERANCE))) { // Text overflows significantly
                          fontSize = fontSize * (targetWidthInPdfUnits / textWidthMeasured) * FONT_SIZE_TOLERANCE; // Shrink
                      } else if (textWidthMeasured < targetWidthInPdfUnits * FONT_SIZE_TOLERANCE && textWidthMeasured > 0) { // Text underfills significantly
                          let proposedFontSize = fontSize * (targetWidthInPdfUnits / textWidthMeasured) * (2 - FONT_SIZE_TOLERANCE); // Grow
                          // Cap the growth
                          fontSize = Math.min(proposedFontSize, fontSize * FONT_SIZE_MAX_GROWTH_FACTOR);
                      }
                      // Ensure font size doesn't go below 1px
                      fontSize = Math.max(1, fontSize);


                      const px = xOffset + x0 * ratio; // x-coordinate for text baseline (word's original x position)
                      const pyBaseline = yOffset + (lineTopY + effectiveHeight) * ratio + (effectiveHeight * ratio * BASELINE_OFFSET);

                      const rectX = xOffset + x0 * ratio;
                      const rectY = yOffset + lineTopY * ratio;
                      const rectHeight = effectiveHeight * ratio;

                      if (debugPdfExport) {
                          if (!formatInfo.isHighConfidence) {
                              pdf.setDrawColor(255, 165, 0); // Orange for low-confidence boxes (non-annotated)
                              pdf.setTextColor(255, 0, 255); // Magenta for low-confidence text (non-annotated)
                          } else {
                              pdf.setDrawColor(0, 0, 255); // Blue for high-confidence boxes (non-annotated)
                              pdf.setTextColor(255, 0, 0); // Bright red for high-confidence text (non-annotated)
                          }
                          pdf.setLineWidth(0.5);
                          pdf.rect(rectX, rectY, rectWidthForText * ratio, rectHeight); // Use rectWidthForText
                      } else {
                          if (!invisibleState) {
                              pdf.setTextColor(255, 255, 255);
                          }
                      }

                      pdf.setFontSize(fontSize);
                      pdf.text(txt, px, pyBaseline);

                      // --- Add Space Box ---
                      if (k < lineWordsToDraw.length - 1) { // If not the last word in the line
                          const nextWordInLine = lineWordsToDraw[k + 1];
                          const currentWordEndInCanvasUnits = x0 + rectWidthForText;
                          const nextWordStartInCanvasUnits = (nextWordInLine.bbox?.x0 ?? nextWordInLine.x ?? nextWordInLine.left ?? 0);

                          const availableSpaceWidthInCanvasUnits = nextWordStartInCanvasUnits - currentWordEndInCanvasUnits;

                          if (availableSpaceWidthInCanvasUnits > 0.5) { // Only add if there's a meaningful gap
                              const spaceChar = ' ';
                              const spaceXInPdfUnits = xOffset + currentWordEndInCanvasUnits * ratio;
                              const spaceYBaselineInPdfUnits = pyBaseline; // Same baseline as the words
                              const spaceWidthInPdfUnits = availableSpaceWidthInCanvasUnits * ratio;

                              // Use a small font size for space, relative to the word's font size
                              const smallSpaceFontSize = Math.max(1, fontSize * SPACE_FONT_SIZE_RATIO_TO_WORD);

                              pdf.setFontSize(smallSpaceFontSize);
                              const measuredSpaceWidth = pdf.getTextWidth(spaceChar);

                              let finalSpaceFontSize = smallSpaceFontSize;
                              // Attempt to fit space text within the available gap, but don't grow too much
                              if (measuredSpaceWidth > spaceWidthInPdfUnits) {
                                  finalSpaceFontSize = smallSpaceFontSize * (spaceWidthInPdfUnits / measuredSpaceWidth) * FONT_SIZE_TOLERANCE;
                              } else if (measuredSpaceWidth < spaceWidthInPdfUnits * FONT_SIZE_TOLERANCE && measuredSpaceWidth > 0) {
                                  let proposedSpaceFontSize = smallSpaceFontSize * (spaceWidthInPdfUnits / measuredSpaceWidth) * (2 - FONT_SIZE_TOLERANCE);
                                  finalSpaceFontSize = Math.min(proposedSpaceFontSize, smallSpaceFontSize * FONT_SIZE_MAX_GROWTH_FACTOR);
                              }
                              finalSpaceFontSize = Math.max(1, finalSpaceFontSize);

                              pdf.setFontSize(finalSpaceFontSize);

                              if (debugPdfExport) {
                                  pdf.setDrawColor(255, 0, 255); // Magenta for space box
                                  pdf.setTextColor(255, 0, 255); // Magenta for space text
                                  // Draw space box using the line's calculated height for visual consistency
                                  pdf.rect(spaceXInPdfUnits, rectY, spaceWidthInPdfUnits, rectHeight);
                              } else {
                                  if (!invisibleState) {
                                      pdf.setTextColor(255, 255, 255); // White for invisible text if no GState
                                  }
                              }
                              pdf.text(spaceChar, spaceXInPdfUnits, spaceYBaselineInPdfUnits);

                              // Reset text color for the next word (if debug mode)
                              if (debugPdfExport) {
                                  if (formatInfo.isHighConfidence) {
                                      pdf.setTextColor(255, 0, 0); // Bright red for high-confidence text
                                  } else {
                                      pdf.setTextColor(255, 0, 255); // Magenta for low-confidence text
                                  }
                              }
                          }
                      }
                  }
              }
          }
      }

      if (!isExporting) break;

      // --- Draw Annotated Regions in PDF for Debug/Visual Confirmation ---
      if (debugPdfExport) {
        // Draw the fixed upper-right exclusion zone for debug purposes
        pdf.setDrawColor(255, 0, 0); // Red for fixed exclusion
        pdf.setLineWidth(1);
        pdf.rect(xOffset + fixedExclusionX * ratio,
                 yOffset + fixedExclusionY * ratio,
                 fixedExclusionWidth * ratio,
                 fixedExclusionHeight * ratio);
        pdf.setFontSize(10);
        pdf.setTextColor(255, 0, 0);
        pdf.text("FIXED OCR EXCLUSION", xOffset + fixedExclusionX * ratio + 2, yOffset + fixedExclusionY * ratio + 10);


        pageAnnotations.forEach(ann => {
          const rectX = xOffset + ann.x * ratio;
          const rectY = yOffset + ann.y * ratio;
          const rectWidth = ann.width * ratio;
          const rectHeight = ann.height * ratio;

          // Unified color for user-drawn exclusions
          if (ann.type === 'user_exclude_ocr') {
              pdf.setDrawColor(156, 39, 176); // Purple for user-drawn
              pdf.setLineWidth(2);
              pdf.rect(rectX, rectY, rectWidth, rectHeight);
              pdf.setFontSize(10);
              pdf.setTextColor(156, 39, 176);
              pdf.text("USER EXCLUDE OCR", rectX + 2, rectY + 10);
          }
        });
      }

      if (!debugPdfExport && invisibleState) {
        pdf.setGState(new pdf.GState({ opacity: 1 }));
      }
    }

    if (!isExporting) {
      return;
    }

    // Step 7: Save PDF
    updateProgress("Saving PDF...");
    const title = sanitizeFilename(getDocTitle());
    pdf.save(`clastify_${title}.pdf`);

    hideProgress();
    isExporting = false;
    cancelBtn.style.display = 'none';
    savePdfBtn.style.display = 'block';
    ocrToggleBtn.style.display = 'block';
    debugToggleBtn.style.display = isOcrEnabled ? 'block' : 'none';
    annotateBtn.style.display = isOcrEnabled ? 'block' : 'none';
    if (isOcrEnabled) {
      annotateBtn.style.top = `${2 * BUTTON_GAP + 34}px`;
      annotateBtn.style.right = ocrToggleBtn.style.right;
    }
    // No alert, just close the mode.
  }


  // --- Event Listeners ---
  savePdfBtn.addEventListener('click', exportPDF);
  annotateBtn.addEventListener('click', enterAnnotationMode);


  clearAllAnnotationsBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear ALL manual annotations across all pages?')) {
        // Now, we just clear everything since there's no auto-generated logo annotation to preserve
        window.clastifyPageAnnotations = window.clastifyPageAnnotations.map(() => []);
        document.querySelectorAll('.clastify-annotation-overlay').forEach(overlay => {
            const index = parseInt(overlay.dataset.canvasIndex, 10);
            const canvas = document.querySelectorAll('canvas')[index];
            // Pass the correct displayed dimensions of the overlay
            const canvasRect = canvas.getBoundingClientRect();
            renderAnnotationsOnOverlay(overlay, index, canvas.width, canvas.height, canvasRect.width, canvasRect.height);
        });
    }
  });


  finishAnnotationBtn.addEventListener('click', () => {
    exitAnnotationMode();
    // No alert, just close the mode.
  });

  // --- Dynamic Banner Removal and Debounce ---
  let debounceTimer;

  function removeBannersDynamically() {
      const banners = document.querySelectorAll('img.MuiBox-root[class*="css"]');
      banners.forEach(banner => {
          console.log('Dynamically removing banner:', banner);
          if (banner.parentElement) {
              banner.parentElement.remove();
          } else {
              banner.remove();
          }
      });
  }

  // Attach the debounced banner removal to scroll events
  window.addEventListener('scroll', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(removeBannersDynamically, SCROLL_DEBOUNCE_DELAY);
  });

  // Also run once on initial script load to catch any banners already present
  // Use DOMContentLoaded to ensure elements are parsed, but still execute early.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeBannersDynamically);
  } else {
    removeBannersDynamically();
  }


})();