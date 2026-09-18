/**
 * Export utilities — CSV and PDF generation
 */

/**
 * Export results as a CSV file
 */
export function exportCSV(result) {
  const { factors, motherTotal, fatherTotal, grandTotal, dob } = result;

  const rows = [
    ["Parental Legacy & Life Factors Report"],
    [`Date of Birth: ${dob}`],
    [`Generated on: ${new Date().toLocaleString()}`],
    [""],
    ["Factor", "Mother Value", "Father Value", "Total"],
    ...factors.map((f) => [f.label, f.mother, f.father, f.total]),
    [""],
    ["Totals", motherTotal, fatherTotal, grandTotal],
  ];

  const csv = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `parental-legacy-${dob.replace(/\//g, "-")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Export results as a PDF using jsPDF + html2canvas
 */
export async function exportPDF(elementId) {
  const { default: jsPDF } = await import("jspdf");
  const { default: html2canvas } = await import("html2canvas");

  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: null,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth - 20;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let y = 10;
  let heightLeft = imgHeight;

  pdf.addImage(imgData, "PNG", 10, y, imgWidth, imgHeight);
  heightLeft -= pageHeight - 20;

  while (heightLeft > 0) {
    y = heightLeft - imgHeight + 10;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 10, y, imgWidth, imgHeight);
    heightLeft -= pageHeight - 20;
  }

  pdf.save(`parental-legacy-report.pdf`);
}
