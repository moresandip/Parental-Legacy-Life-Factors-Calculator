import { useApp } from "../context/AppContext";

export default function Header() {
  const { theme, toggleTheme } = useApp();

  return (
    <header className="header">
      <div className="header-logo">
        <div className="logo-icon">🧬</div>
        <div>
          <div className="logo-text">Parental Legacy</div>
          <div className="logo-sub">Life Factors Calculator</div>
        </div>
      </div>

      <div className="header-actions">
        <button
          id="theme-toggle-btn"
          className="theme-toggle"
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
}
