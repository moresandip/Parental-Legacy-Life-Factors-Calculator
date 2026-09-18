/**
 * Parental Legacy & Life Factors Calculator
 * Core calculation engine — deterministic, seed-based
 */

export const FACTORS = [
  { key: "genetic",       label: "Genetic Inheritance",     min: 9.333, max: 10.777 },
  { key: "constitutional", label: "Constitutional Vitality", min: 8.111, max: 9.111  },
  { key: "mental",        label: "Mental Patterns",          min: 6.111, max: 7.111  },
  { key: "intellectual",  label: "Intellectual Capacity",    min: 6.333, max: 6.999  },
  { key: "emotional",     label: "Emotional Foundation",     min: 7.111, max: 7.999  },
  { key: "spiritual",     label: "Spiritual Lineage",        min: 5.011, max: 6.011  },
  { key: "soul",          label: "Soul Connections",         min: 5.111, max: 6.222  },
];

// Sum of all midpoints => approximately 100
// We scale totals so grand total = exactly 100

/**
 * Simple seeded pseudo-random number generator (LCG)
 * Returns a value in [0, 1)
 */
function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0x100000000;
  };
}

/**
 * Build a numeric seed from a Date object
 */
function buildSeed(date) {
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear();
  return d * 1000000 + m * 10000 + y;
}

/**
 * Generate raw factor totals in their [min, max] range using the seed.
 * Then scale all totals so they sum to exactly 100.
 */
function generateScaledTotals(rng) {
  const rawTotals = FACTORS.map(({ min, max }) => {
    const t = min + rng() * (max - min);
    return t;
  });

  const rawSum = rawTotals.reduce((a, b) => a + b, 0);
  const scale = 100 / rawSum;

  return rawTotals.map((t) => parseFloat((t * scale).toFixed(3)));
}

/**
 * Split a total into mother/father values.
 * Mother-dominant (odd day): mother gets 55–70% of total
 * Father-dominant (even day): father gets 55–70% of total
 */
function splitValue(total, motherDominant, rng) {
  // Dominant parent gets between 53% and 68% of the total
  const dominantFraction = 0.53 + rng() * 0.15;
  const dominantValue = parseFloat((total * dominantFraction).toFixed(3));
  const recessiveValue = parseFloat((total - dominantValue).toFixed(3));

  if (motherDominant) {
    return { mother: dominantValue, father: recessiveValue };
  } else {
    return { mother: recessiveValue, father: dominantValue };
  }
}

/**
 * Main calculation function.
 * @param {Date} dob
 * @returns {{ factors: Array, motherTotal: number, fatherTotal: number, grandTotal: number, motherDominant: boolean }}
 */
export function calculateFactors(dob) {
  const day = dob.getDate();
  const motherDominant = day % 2 !== 0; // odd day => mother higher

  const seed = buildSeed(dob);
  const rng = seededRandom(seed);

  const scaledTotals = generateScaledTotals(rng);

  const factors = FACTORS.map((factor, i) => {
    const total = scaledTotals[i];
    const { mother, father } = splitValue(total, motherDominant, rng);

    // Recalculate total from rounded values to keep accuracy
    const recalcTotal = parseFloat((mother + father).toFixed(3));

    return {
      key: factor.key,
      label: factor.label,
      min: factor.min,
      max: factor.max,
      mother,
      father,
      total: recalcTotal,
    };
  });

  // Recalculate grand totals
  const motherTotal = parseFloat(
    factors.reduce((sum, f) => sum + f.mother, 0).toFixed(3)
  );
  const fatherTotal = parseFloat(
    factors.reduce((sum, f) => sum + f.father, 0).toFixed(3)
  );
  const grandTotal = parseFloat((motherTotal + fatherTotal).toFixed(3));

  return {
    factors,
    motherTotal,
    fatherTotal,
    grandTotal,
    motherDominant,
    day,
    dob: dob.toLocaleDateString("en-GB"), // DD/MM/YYYY
  };
}
