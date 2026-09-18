import { useState } from "react";
import { exportCSV, exportPDF } from "../utils/exportUtils";

export default function ExportBar({ result }) {
  const [pdfStatus, setPdfStatus] = useState("idle"); // idle | loading | done | error
  const [csvStatus, setCsvStatus] = useState("idle");

  /* ── CSV ── */
  function handleCSV() {
    try {
      setCsvStatus("loading");
      exportCSV(result);
      setCsvStatus("done");
      setTimeout(() => setCsvStatus("idle"), 2500);
    } catch (err) {
      console.error("CSV export failed:", err);
      setCsvStatus("error");
      setTimeout(() => setCsvStatus("idle"), 3000);
    }
  }

  /* ── PDF ── */
  async function handlePDF() {
    try {
      setPdfStatus("loading");
      await exportPDF();           // ID "pdf-capture" is handled inside exportUtils
      setPdfStatus("done");
      setTimeout(() => setPdfStatus("idle"), 2500);
    } catch (err) {
      console.error("PDF export failed:", err);
      setPdfStatus("error");
      setTimeout(() => setPdfStatus("idle"), 3000);
    }
  }

  /* ── Label helpers ── */
  function csvLabel() {
    if (csvStatus === "loading") return "⏳ Exporting...";
    if (csvStatus === "done")    return "✅ Downloaded!";
    if (csvStatus === "error")   return "❌ Failed";
    return "📄 CSV";
  }

  function pdfLabel() {
    if (pdfStatus === "loading") return "⏳ Generating...";
    if (pdfStatus === "done")    return "✅ Downloaded!";
    if (pdfStatus === "error")   return "❌ Failed";
    return "📑 PDF";
  }

  return (
    <div className="export-bar">
      <span className="export-label">Export Results:</span>

      {/* CSV Button */}
      <button
        id="export-csv-btn"
        className={`btn btn-csv ${csvStatus === "loading" ? "btn-loading" : ""}`}
        onClick={handleCSV}
        disabled={csvStatus === "loading"}
        title="Download results as CSV (opens in Excel)"
        aria-label="Export as CSV"
      >
        {csvLabel()}
      </button>

      {/* PDF Button */}
      <button
        id="export-pdf-btn"
        className={`btn btn-pdf ${pdfStatus === "loading" ? "btn-loading" : ""}`}
        onClick={handlePDF}
        disabled={pdfStatus === "loading"}
        title="Download full results as PDF"
        aria-label="Export as PDF"
      >
        {pdfLabel()}
      </button>
    </div>
  );
}
