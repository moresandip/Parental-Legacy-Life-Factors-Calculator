import { useEffect, useState } from "react";
import { AppProvider } from "./context/AppContext";
import Header from "./components/Header";
import DOBInput from "./components/DOBInput";
import Results from "./components/Results";
import Footer from "./components/Footer";
import "./index.css";

function ScrollTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = () => setShow(window.scrollY > 300);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  if (!show) return null;
  return (
    <button
      className="scroll-top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      title="Back to top"
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
}

function AppContent() {
  return (
    <>
      {/* Background ambient orbs */}
      <div className="bg-orbs" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <Header />

      <main className="main">
        <DOBInput />
        <Results />
      </main>

      <Footer />
      <ScrollTopButton />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
