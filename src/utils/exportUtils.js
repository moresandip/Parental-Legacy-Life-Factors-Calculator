/**
 * Export Utilities — CSV and PDF generation
 * jsPDF v2.5.1 + html2canvas v1.4.1
 */

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/* ─────────────────────────────────────────
   CSV Export
───────────────────────────────────────── */
export function exportCSV(result) {
  if (!result) throw new Error("No result to export");

  const { factors, motherTotal, fatherTotal, grandTotal, dob, motherDominant } = result;

  // Wrap each value in quotes so commas inside values don't break CSV
  const row = (...fields) => fields.map((f) => `"${f}"`).join(",");

  const lines = [
    row("Parental Legacy & Life Factors Report"),
    row(`Date of Birth: ${dob}`),
    row(`Dominant Parent: ${motherDominant ? "Mother (Odd Day)" : "Father (Even Day)"}`),
    row(`Generated: ${new Date().toLocaleString()}`),
    "",
    row("Factor", "Mother Value", "Father Value", "Total"),
    ...factors.map((f) =>
      row(f.label, f.mother.toFixed(3), f.father.toFixed(3), f.total.toFixed(3))
    ),
    "",
    row("GRAND TOTAL", motherTotal.toFixed(3), fatherTotal.toFixed(3), grandTotal.toFixed(3)),
  ];

  const csvContent = lines.join("\r\n");
  const BOM = "\uFEFF"; // UTF-8 BOM — ensures Excel opens file with correct encoding
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `parental-legacy-${dob.replace(/\//g, "-")}.csv`);
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

/* ─────────────────────────────────────────
   PDF Export
───────────────────────────────────────── */
export async function exportPDF() {
  // Target the dedicated capture area (excludes export buttons)
  const element = document.getElementById("pdf-capture");
  if (!element) throw new Error("pdf-capture element not found");

  // Detect current theme background
  const theme = document.documentElement.getAttribute("data-theme");
  const bgColor = theme === "light" ? "#f5f3ff" : "#0a0b14";

  // Temporarily set a solid background on the element so html2canvas
  // doesn't render glassmorphism backdrop-filters as transparent
  const originalBg = element.style.background;
  element.style.background = bgColor;

  let canvas;
  try {
    canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: bgColor,
      allowTaint: true,
      removeContainer: true,
    });
  } finally {
    element.style.background = originalBg; // Restore
  }

  const imgData = canvas.toDataURL("image/jpeg", 0.95);

  // A4 page dimensions in mm
  const PAGE_W = 210;
  const PAGE_H = 297;
  const MARGIN = 12;
  const contentW = PAGE_W - MARGIN * 2;

  // Image height in mm (maintain aspect ratio)
  const imgH = (canvas.height * contentW) / canvas.width;

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  // Helper: fill page background
  const fillBg = () => {
    const [r, g, b] = theme === "light"
      ? [245, 243, 255]
      : [10, 11, 20];
    pdf.setFillColor(r, g, b);
    pdf.rect(0, 0, PAGE_W, PAGE_H, "F");
  };

  const pageContentH = PAGE_H - MARGIN * 2; // usable height per page in mm

  if (imgH <= pageContentH) {
    // Single page
    fillBg();
    pdf.addImage(imgData, "JPEG", MARGIN, MARGIN, contentW, imgH);
  } else {
    // Multi-page: clip image slice per page
    let remainingH = imgH;
    let pageTop = 0; // how many mm into the image we've printed

    while (remainingH > 0) {
      if (pageTop > 0) pdf.addPage();
      fillBg();

      // Draw the full-height image shifted up so the right slice shows
      pdf.addImage(
        imgData,
        "JPEG",
        MARGIN,
        MARGIN - pageTop,  // negative offset scrolls the image up
        contentW,
        imgH
      );

      // Clip to page area by filling above MARGIN and below (PAGE_H - MARGIN)
      // (jsPDF doesn't support clip paths easily, so we over-fill borders)
      pdf.setFillColor(...(theme === "light" ? [245, 243, 255] : [10, 11, 20]));
      // Top mask
      pdf.rect(0, 0, PAGE_W, MARGIN, "F");
      // Bottom mask
      pdf.rect(0, PAGE_H - MARGIN, PAGE_W, MARGIN, "F");

      pageTop += pageContentH;
      remainingH -= pageContentH;
    }
  }

  pdf.save(`parental-legacy-report.pdf`);
}
