import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { Quotation } from '../types/placePackage';

/**
 * Ensures all web fonts and image assets inside the container are fully downloaded,
 * decoded, and raster-ready before html2canvas begins rendering.
 */
async function preloadContainerAssets(container: HTMLElement): Promise<void> {
  // 1. Wait for document web fonts (Plus Jakarta Sans, Cormorant Garamond, Cinzel, etc.)
  try {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
  } catch (e) {
    console.warn('Font loading check notice:', e);
  }

  // 2. Preload and decode all images
  const imgElements = Array.from(container.querySelectorAll('img'));
  const promises = imgElements.map((img) => {
    if (img.complete && img.naturalHeight !== 0) {
      if ('decode' in img && typeof (img as any).decode === 'function') {
        return (img as any).decode().catch(() => {});
      }
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      const onDone = () => {
        img.removeEventListener('load', onDone);
        img.removeEventListener('error', onDone);
        if ('decode' in img && typeof (img as any).decode === 'function') {
          (img as any).decode().then(resolve).catch(resolve);
        } else {
          resolve();
        }
      };
      img.addEventListener('load', onDone);
      img.addEventListener('error', onDone);
      // Fallback timeout in case an asset never fires
      setTimeout(resolve, 3000);
    });
  });

  await Promise.all(promises);
}

/**
 * Generates an ultra-crisp, high-DPI single continuous long-page PDF with no page breaks.
 * Employs scale 3 (300+ DPI equivalent) and lossless PNG encoding so that when users
 * zoom in (200%-500%), text, numbers, icons, lines, and cards remain razor-sharp
 * with zero pixelation, blur, or compression artifacts.
 */
export async function generateContinuousBrochurePDF(
  containerId: string,
  quotation: Quotation,
  onProgress?: (progress: number, status: string) => void
): Promise<Blob> {
  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`Brochure element container #${containerId} not found in DOM.`);
  }

  if (onProgress) {
    onProgress(10, 'Preloading typography and high-res assets...');
  }

  // Ensure fonts and all images are fully loaded and decoded
  await preloadContainerAssets(container);

  // Exact 794 CSS px width matching A4 595pt aspect ratio
  const elementWidth = 794;
  const totalHeight = Math.max(container.scrollHeight, container.offsetHeight);

  if (onProgress) {
    onProgress(20, `Rendering continuous brochure (${elementWidth}x${totalHeight}px)...`);
  }

  // Scale 2 as specified for crisp rendering without excess memory
  const scale = 2;

  // Max slice height in CSS px before stitching (approx 2-3 slices for ultra tall docs)
  const MAX_SLICE_HEIGHT = 3800;

  // Initialize jsPDF continuous single page with exact custom dimensions [794, totalHeight]
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [elementWidth, totalHeight],
    hotfixes: ['px_scaling'],
    compress: true,
  });

  const sharedOnClone = (clonedDoc: Document, clonedElement?: HTMLElement) => {
    try {
      // Inject high-DPI font antialiasing and subpixel precision styles
      const styleTag = clonedDoc.createElement('style');
      styleTag.textContent = `
        * {
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
          text-rendering: geometricPrecision !important;
          font-family: 'Poppins', -apple-system, sans-serif !important;
        }
        img {
          image-rendering: -webkit-optimize-contrast !important;
          image-rendering: high-quality !important;
        }
      `;
      clonedDoc.head.appendChild(styleTag);

      // Sanitize modern color functions if unsupported in target engine
      const styleElements = clonedDoc.querySelectorAll('style');
      styleElements.forEach((s) => {
        if (s.textContent && s.textContent.includes('oklch')) {
          s.textContent = s.textContent.replace(/oklch\([^)]+\)/g, '#334155');
        }
      });

      // Ensure exact pristine 794px width and visibility in the clone
      if (clonedElement) {
        clonedElement.style.width = `${elementWidth}px`;
        clonedElement.style.maxWidth = `${elementWidth}px`;
        clonedElement.style.opacity = '1';
        clonedElement.style.visibility = 'visible';
        clonedElement.style.transform = 'none';
      }
    } catch (e) {
      console.warn('onclone style note:', e);
    }
  };

  if (totalHeight <= MAX_SLICE_HEIGHT) {
    // Single continuous pass with backgroundColor: null so background texture is preserved
    if (onProgress) {
      onProgress(40, 'Rasterizing document with background texture...');
    }

    const canvas = await html2canvas(container, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
      imageSmoothing: true,
      imageSmoothingQuality: 'high',
      width: elementWidth,
      height: totalHeight,
      windowWidth: elementWidth,
      windowHeight: totalHeight,
      onclone: (clonedDoc: Document) => sharedOnClone(clonedDoc),
    });

    if (onProgress) {
      onProgress(80, 'Generating lossless image stream...');
    }

    const pngDataUrl = canvas.toDataURL('image/png');

    if (onProgress) {
      onProgress(95, 'Composing continuous PDF...');
    }

    // Export as image to prevent text layer double-character artifacts (e.g. "NNOOTTEESS")
    pdf.addImage(
      pngDataUrl,
      'PNG',
      0,
      0,
      elementWidth,
      totalHeight,
      undefined,
      'FAST'
    );
  } else {
    // Multi-slice stitched rendering for very tall pages (2–3 vertical slices)
    const numSlices = Math.ceil(totalHeight / 2800);
    const sliceHeight = Math.ceil(totalHeight / numSlices);

    // Create a master stitch canvas to unify slices seamlessly
    const masterCanvas = document.createElement('canvas');
    masterCanvas.width = elementWidth * scale;
    masterCanvas.height = totalHeight * scale;
    const masterCtx = masterCanvas.getContext('2d');

    for (let i = 0; i < numSlices; i++) {
      const sliceY = i * sliceHeight;
      const currentSliceH = Math.min(sliceHeight, totalHeight - sliceY);

      if (onProgress) {
        const pct = Math.round(25 + ((i + 1) / numSlices) * 55);
        onProgress(pct, `Stitching section ${i + 1} of ${numSlices}...`);
      }

      const sliceCanvas = await html2canvas(container, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        imageSmoothing: true,
        imageSmoothingQuality: 'high',
        x: 0,
        y: sliceY,
        width: elementWidth,
        height: currentSliceH,
        windowWidth: elementWidth,
        windowHeight: totalHeight,
        onclone: (clonedDoc: Document) => sharedOnClone(clonedDoc),
      });

      if (masterCtx) {
        masterCtx.drawImage(
          sliceCanvas,
          0,
          0,
          sliceCanvas.width,
          sliceCanvas.height,
          0,
          sliceY * scale,
          elementWidth * scale,
          currentSliceH * scale
        );
      }
    }

    const stitchedPng = masterCanvas.toDataURL('image/png');

    pdf.addImage(
      stitchedPng,
      'PNG',
      0,
      0,
      elementWidth,
      totalHeight,
      undefined,
      'FAST'
    );
  }

  if (onProgress) {
    onProgress(100, 'HD Document ready!');
  }

  return pdf.output('blob');
}

/**
 * Returns formatted filename: RoyalTours_<Destinations>_<TripType>_<Date>.pdf
 */
export function getQuotationFileName(quotation: Quotation): string {
  const rawDest =
    quotation.destination ||
    quotation.dayPackages
      .map((d) => d.customTitle || '')
      .filter(Boolean)
      .join('-') ||
    'Itinerary';

  const destinations = rawDest
    .replace(/[^a-zA-Z0-9_\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  const tripType = (quotation.tripType || 'Tour').replace(/[^a-zA-Z0-9_-]/g, '').trim();
  const rawDate = quotation.departureDate || quotation.travelDates || new Date().toISOString().slice(0, 10);
  const dateStr = rawDate.replace(/[^a-zA-Z0-9_-]/g, '').trim();

  return `RoyalTours_${destinations}_${tripType}_${dateStr}.pdf`;
}

// Backward compatibility alias
export const generateQuotationPDF = generateContinuousBrochurePDF;
