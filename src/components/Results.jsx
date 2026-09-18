import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import ParentalLegacy from "./ParentalLegacy";
import FactorTable from "./FactorTable";
import Charts from "./Charts";
import ExportBar from "./ExportBar";

export default function Results() {
  const { result } = useApp();
  const [visible, setVisible] = useState(false);

  // Re-animate on result change
  useEffect(() => {
    if (result) {
      setVisible(false);
      const t = setTimeout(() => setVisible(true), 50);
      return () => clearTimeout(t);
    }
  }, [result]);

  if (!result) return null;

  return (
    <section
      id="results-section"
      className="results-section"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease" }}
    >
      <div className="container">
        {/* Export buttons — excluded from PDF capture */}
        <ExportBar result={result} />

        {/* ↓ Everything below this div is captured in the PDF ↓ */}
        <div id="pdf-capture">
          {/* Parental Legacy banner */}
          <ParentalLegacy result={result} />

          {/* Factor breakdown table */}
          <FactorTable result={result} />

          {/* Charts */}
          <Charts result={result} />
        </div>
      </div>
    </section>
  );
}
