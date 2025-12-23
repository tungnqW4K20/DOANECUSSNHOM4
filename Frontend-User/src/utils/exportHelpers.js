import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import dayjs from 'dayjs';

/**
 * Export dashboard to PDF format
 * @param {HTMLElement} element - The DOM element to export
 * @param {string} companyName - Company name to include in the export
 * @returns {Promise<void>}
 */
export const exportToPDF = async (element, companyName = 'Dashboard') => {
  if (!element) {
    throw new Error('Element not found for export');
  }

  try {
    // Capture the element as canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Create PDF in landscape orientation
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    
    // A4 landscape dimensions
    const pdfWidth = 297; // mm
    const pdfHeight = 210; // mm
    
    // Calculate image dimensions to fit in PDF
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Add image to PDF
    if (imgHeight <= pdfHeight) {
      // Image fits in one page
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    } else {
      // Image needs multiple pages
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
      
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
    }
    
    // Generate filename with timestamp
    const timestamp = dayjs().format('YYYY-MM-DD-HHmmss');
    const filename = `${companyName}-Dashboard-${timestamp}.pdf`;
    
    // Save the PDF
    pdf.save(filename);
    
    return { success: true, filename };
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw new Error('Failed to export PDF: ' + error.message);
  }
};

/**
 * Export dashboard to PNG format
 * @param {HTMLElement} element - The DOM element to export
 * @param {string} companyName - Company name to include in the export
 * @returns {Promise<void>}
 */
export const exportToPNG = async (element, companyName = 'Dashboard') => {
  if (!element) {
    throw new Error('Element not found for export');
  }

  try {
    // Capture the element as canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to create image blob');
      }

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // Generate filename with timestamp
      const timestamp = dayjs().format('YYYY-MM-DD-HHmmss');
      const filename = `${companyName}-Dashboard-${timestamp}.png`;
      
      link.href = url;
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 'image/png');

    return { success: true };
  } catch (error) {
    console.error('Error exporting to PNG:', error);
    throw new Error('Failed to export PNG: ' + error.message);
  }
};

/**
 * Prepare element for export by temporarily adjusting styles
 * @param {HTMLElement} element - The DOM element to prepare
 * @returns {Function} Cleanup function to restore original styles
 */
export const prepareElementForExport = (element) => {
  if (!element) return () => {};

  // Store original styles
  const originalStyles = {
    overflow: element.style.overflow,
    height: element.style.height
  };

  // Adjust styles for better export
  element.style.overflow = 'visible';
  element.style.height = 'auto';

  // Return cleanup function
  return () => {
    element.style.overflow = originalStyles.overflow;
    element.style.height = originalStyles.height;
  };
};
