export default function FactorTable({ result }) {
  const { factors, motherTotal, fatherTotal, grandTotal } = result;

  return (
    <div className="table-card">
      <div className="section-title">
        <div className="icon">📊</div>
        Life Factor Breakdown
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="factor-table" aria-label="Life factors breakdown table">
          <thead>
            <tr>
              <th style={{ width: "30%" }}>Factor</th>
              <th className="center">Mother</th>
              <th className="center">Father</th>
              <th className="center">Total</th>
              <th className="center" style={{ minWidth: "100px" }}>Distribution</th>
            </tr>
          </thead>

          <tbody>
            {factors.map((factor, idx) => {
              const motherPct = (factor.mother / factor.total) * 100;
              const fatherPct = (factor.father / factor.total) * 100;
              return (
                <tr key={factor.key}>
                  <td>
                    <div className="factor-name">
                      {factor.label}
                      <span className="factor-range">
                        Range: {factor.min} – {factor.max}
                      </span>
                    </div>
                  </td>

                  <td className="center">
                    <span className="value-badge mother">
                      {factor.mother.toFixed(3)}
                    </span>
                  </td>

                  <td className="center">
                    <span className="value-badge father">
                      {factor.father.toFixed(3)}
                    </span>
                  </td>

                  <td className="center">
                    <span className="value-badge total">
                      {factor.total.toFixed(3)}
                    </span>
                  </td>

                  <td className="center">
                    <div className="dominance-bar">
                      <div
                        className="mother-fill"
                        style={{ width: `${motherPct}%` }}
                        title={`Mother: ${motherPct.toFixed(1)}%`}
                      />
                      <div
                        className="father-fill"
                        style={{ width: `${fatherPct}%` }}
                        title={`Father: ${fatherPct.toFixed(1)}%`}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>

          <tfoot>
            <tr>
              <td><strong>Grand Total</strong></td>
              <td className="center">
                <span className="value-badge mother">
                  {motherTotal.toFixed(3)}
                </span>
              </td>
              <td className="center">
                <span className="value-badge father">
                  {fatherTotal.toFixed(3)}
                </span>
              </td>
              <td className="center">
                <span className="value-badge total" style={{ fontWeight: 800 }}>
                  {grandTotal.toFixed(3)}
                </span>
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="chart-legend" style={{ marginTop: "16px" }}>
        <div className="legend-item">
          <div className="legend-dot mother" />
          Mother Values
        </div>
        <div className="legend-item">
          <div className="legend-dot father" />
          Father Values
        </div>
      </div>
    </div>
  );
}
