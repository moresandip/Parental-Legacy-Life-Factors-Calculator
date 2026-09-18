export default function ParentalLegacy({ result }) {
  const { motherDominant, motherTotal, fatherTotal, grandTotal, dob, day } = result;

  const dominantName = motherDominant ? "Mother" : "Father";
  const dominantColor = motherDominant ? "mother" : "father";
  const emoji = motherDominant ? "💗" : "💙";
  const icon = motherDominant ? "👩" : "👨";

  const motherPct = ((motherTotal / grandTotal) * 100).toFixed(1);
  const fatherPct = ((fatherTotal / grandTotal) * 100).toFixed(1);

  return (
    <div id="parental-legacy-section">
      {/* Info chips */}
      <div className="info-chips">
        <div className="chip">
          <span className="emoji">📅</span>
          Date of Birth: <strong>{dob}</strong>
        </div>
        <div className="chip">
          <span className="emoji">🗓️</span>
          Day: <strong>{day}</strong>
        </div>
        <div className="chip">
          <span className="emoji">{day % 2 !== 0 ? "🔴" : "🔵"}</span>
          {day % 2 !== 0 ? "Odd Day — Mother Dominant" : "Even Day — Father Dominant"}
        </div>
      </div>

      {/* Legacy Banner */}
      <div className={`legacy-banner ${dominantColor}`}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div className="banner-icon">{icon}</div>
          <div className="banner-text">
            <h2>{emoji} {dominantName}&apos;s Legacy Prevails</h2>
            <p>
              Your {dominantName.toLowerCase()} has contributed more across all life factors.
              Born on day <strong>{day}</strong> ({day % 2 !== 0 ? "odd" : "even"}), 
              your {dominantName.toLowerCase()}&apos;s influence dominates your parental legacy.
            </p>
          </div>
        </div>

        <div className="banner-totals">
          <div className="legacy-stat mother">
            <span className="stat-value">{motherTotal.toFixed(3)}</span>
            <span className="stat-label">Mother Total</span>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{motherPct}%</div>
          </div>

          <div className="legacy-stat father">
            <span className="stat-value">{fatherTotal.toFixed(3)}</span>
            <span className="stat-label">Father Total</span>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{fatherPct}%</div>
          </div>

          <div className="legacy-stat grand">
            <span className="stat-value">{grandTotal.toFixed(3)}</span>
            <span className="stat-label">Grand Total</span>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>= 100</div>
          </div>
        </div>
      </div>
    </div>
  );
}
