export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <p>
        © {year} Parental Legacy &amp; Life Factors Calculator &nbsp;·&nbsp;
        Built with React &amp; Recharts &nbsp;·&nbsp;
        <span style={{ color: "var(--accent-purple)" }}>♦</span>
      </p>
    </footer>
  );
}
