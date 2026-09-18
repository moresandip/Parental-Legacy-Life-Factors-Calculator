import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function DOBInput() {
  const { dob, setDob, result } = useApp();
  const [error, setError] = useState("");

  const today = new Date();
  const maxDate = today.toISOString().split("T")[0]; // YYYY-MM-DD

  function handleChange(e) {
    const val = e.target.value;
    setError("");

    if (!val) {
      setDob("");
      return;
    }

    // Validate: not in the future
    const selected = new Date(val);
    if (selected > today) {
      setError("Date of birth cannot be in the future.");
      setDob("");
      return;
    }

    // Validate: reasonable range (not before 1900)
    if (selected.getFullYear() < 1900) {
      setError("Please enter a date after January 1, 1900.");
      setDob("");
      return;
    }

    setDob(val);
  }

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-badge">
          <span>✨</span> Discover Your Parental Legacy
        </div>

        <h1>Parental Legacy &amp;<br />Life Factors Calculator</h1>

        <p>
          Enter your date of birth to reveal how your parents' genetic and spiritual
          contributions have shaped the seven core dimensions of your life.
        </p>

        <div className="dob-card">
          <h2>Enter Your Date of Birth</h2>
          <p>Your birth date determines how each life factor is distributed between your parents.</p>

          <div className="form-group">
            <label htmlFor="dob-input">Date of Birth</label>
            <input
              id="dob-input"
              type="date"
              value={dob}
              onChange={handleChange}
              max={maxDate}
              min="1900-01-01"
              aria-label="Date of birth"
              aria-describedby={error ? "dob-error" : undefined}
            />
            {error && (
              <div id="dob-error" className="error-msg" role="alert">
                <span>⚠️</span> {error}
              </div>
            )}
          </div>

          {!result && (
            <button
              className="calculate-btn"
              disabled
              aria-disabled="true"
            >
              {dob ? "Calculating..." : "Select a date to calculate"}
            </button>
          )}

          {result && (
            <button
              className="calculate-btn"
              onClick={() => {
                document
                  .getElementById("results-section")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              ↓ View Your Results
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
