import { createContext, useContext, useState, useEffect } from "react";
import { calculateFactors } from "../utils/calculator";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("plfc_theme") || "dark";
  });

  const [dob, setDob] = useState(() => {
    return localStorage.getItem("plfc_dob") || "";
  });

  const [result, setResult] = useState(() => {
    const saved = localStorage.getItem("plfc_result");
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  });

  // Persist theme
  useEffect(() => {
    localStorage.setItem("plfc_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Calculate whenever dob changes
  useEffect(() => {
    if (!dob) { setResult(null); return; }
    const parts = dob.split("-");
    if (parts.length !== 3) { setResult(null); return; }
    const date = new Date(dob); // input type=date gives YYYY-MM-DD
    if (isNaN(date.getTime())) { setResult(null); return; }
    const calc = calculateFactors(date);
    setResult(calc);
    localStorage.setItem("plfc_result", JSON.stringify(calc));
    localStorage.setItem("plfc_dob", dob);
  }, [dob]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <AppContext.Provider value={{ theme, toggleTheme, dob, setDob, result }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
