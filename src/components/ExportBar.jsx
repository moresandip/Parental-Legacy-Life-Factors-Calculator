import { useState } from "react";
import { exportCSV, exportPDF } from "../utils/exportUtils";

export default function ExportBar({ result }) {
  const [pdfLoading, setPdfLoading] = useState(false);

  async function handlePDF() {
    setPdfLoading(true);
    try {
      await exportPDF("results-section");
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <div className="export-bar">
      <span className="export-label">Export:</span>

      <button
        id="export-csv-btn"
        className="btn btn-csv"
        onClick={() => exportCSV(result)}
        title="Download results as CSV"
      >
        📄 CSV
      </button>

      <button
        id="export-pdf-btn"
        className="btn btn-pdf"
        onClick={handlePDF}
        disabled={pdfLoading}
        title="Download results as PDF"
      >
        {pdfLoading ? "⏳ Generating..." : "📑 PDF"}
      </button>
    </div>
  );
}
