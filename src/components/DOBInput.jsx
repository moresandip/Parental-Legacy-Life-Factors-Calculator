import { useState, useRef } from "react";
import { useApp } from "../context/AppContext";

export default function DOBInput() {
  const { dob, setDob, result } = useApp();
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const today = new Date();
  const maxDate = today.toISOString().split("T")[0]; // YYYY-MM-DD

  function handleChange(e) {
    const val = e.target.value;
    setError("");

    if (!val) {
      setDob("");
      return;
    }

    validateAndSetDate(val);
  }

  function validateAndSetDate(val) {
    const selected = new Date(val);
    if (selected > today) {
      setError("Date of birth cannot be in the future.");
      setDob("");
      return;
    }
    if (selected.getFullYear() < 1900) {
      setError("Please enter a date after January 1, 1900.");
      setDob("");
      return;
    }
    setDob(val);
  }

  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      // Search for the line containing "Date of Birth: "
      const match = text.match(/Date of Birth:\s*(\d{4}-\d{2}-\d{2})/);
      
      if (match && match[1]) {
        validateAndSetDate(match[1]);
      } else {
        setError("Invalid file format. Could not find a valid Date of Birth in the CSV.");
      }
      
      // Reset input so the same file can be uploaded again if needed
      e.target.value = "";
    };
    reader.readAsText(file);
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label htmlFor="dob-input">Date of Birth</label>
              <button 
                className="upload-btn"
                onClick={() => fileInputRef.current?.click()}
                title="Upload previous CSV result to restore date"
              >
                📂 Import CSV
              </button>
              <input 
                type="file" 
                accept=".csv" 
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
            </div>
            
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
