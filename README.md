# 🧬 Parental Legacy & Life Factors Calculator

A full-featured React.js web application that calculates parental legacy and life factor values based on a user's **Date of Birth**.

## 🚀 Live Demo

> Deploy URL: *(Add after deployment)*

## ✨ Features

- 📅 **DOB Date Picker** with full validation (no future dates, min 1900)
- 🔢 **Auto-Calculation** — values generate instantly on date selection
- 📊 **7 Life Factors** displayed with Mother, Father, and Total values
- ⚖️ **Grand Total = 100** — guaranteed by the scaling algorithm
- 👩‍👨 **Parental Legacy Banner** — shows which parent dominates (odd day = mother, even day = father)
- 📈 **Recharts Visualizations** — grouped bar chart + donut pie chart
- 🌙 **Dark / Light Mode Toggle** — persisted in localStorage
- 💾 **localStorage Save** — results persist across browser sessions
- 📄 **CSV Export** — download results as a spreadsheet
- 📑 **PDF Export** — capture full results page as PDF (html2canvas + jsPDF)
- 📱 **Fully Responsive** — works on mobile, tablet, and desktop

## 🧮 Calculation Logic

| Factor | Min | Max |
|---|---|---|
| Genetic Inheritance | 9.333 | 10.777 |
| Constitutional Vitality | 8.111 | 9.111 |
| Mental Patterns | 6.111 | 7.111 |
| Intellectual Capacity | 6.333 | 6.999 |
| Emotional Foundation | 7.111 | 7.999 |
| Spiritual Lineage | 5.011 | 6.011 |
| Soul Connections | 5.111 | 6.222 |

**Rules:**
- Each factor total is within its min–max range
- All factor totals are scaled so they **sum to exactly 100**
- **Odd birth day** → Mother values are higher for all factors
- **Even birth day** → Father values are higher for all factors
- Mother Value + Father Value = Factor Total for every factor
- The calculation is **deterministic** — same DOB always gives same result

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite |
| State | React Context API + useEffect/useState |
| Styling | Pure CSS3 (CSS Variables, Glassmorphism) |
| Charts | Recharts |
| PDF Export | jsPDF + html2canvas |
| Persistence | localStorage |
| Fonts | Google Fonts — Inter, Playfair Display |

## 📦 Setup & Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd parental-legacy-calculator

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Open in browser
# http://localhost:5173
```

## 🏗️ Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Navigation bar with theme toggle
│   ├── DOBInput.jsx        # Date picker with validation
│   ├── Results.jsx         # Results orchestrator
│   ├── ParentalLegacy.jsx  # Legacy banner + stats
│   ├── FactorTable.jsx     # 7 factors breakdown table
│   ├── Charts.jsx          # Bar + Pie charts (Recharts)
│   ├── ExportBar.jsx       # CSV & PDF export buttons
│   └── Footer.jsx          # Footer
├── context/
│   └── AppContext.jsx      # Global state (theme, DOB, result)
├── utils/
│   ├── calculator.js       # Core calculation engine
│   └── exportUtils.js      # CSV + PDF export logic
├── App.jsx                 # Root component
├── main.jsx                # Entry point
└── index.css               # Global styles & design system
```

## 📧 Submission

- GitHub: *(your repo link)*
- WhatsApp: 8454815742
