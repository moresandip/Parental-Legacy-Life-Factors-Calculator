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
 * Generate an array of values that sum exactly to `targetSum`,
 * where each value is bounded by [min, max] of its corresponding factor.
 */
function distributeSum(targetSum, rng) {
  const values = FACTORS.map(f => f.min);
  let currentSum = values.reduce((a, b) => a + b, 0);
  let remaining = targetSum - currentSum;
  
  const capacities = FACTORS.map(f => f.max - f.min);
  
  let iterations = 0;
  while (remaining > 0.0005 && iterations < 100) {
    iterations++;
    // Generate random weights for factors that still have capacity
    const weights = capacities.map(c => (c > 0.001 ? rng() : 0));
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    
    if (totalWeight === 0) break; // Should not happen if targetSum <= max possible sum
    
    for (let i = 0; i < FACTORS.length; i++) {
      if (weights[i] > 0 && remaining > 0) {
        let toAdd = (weights[i] / totalWeight) * remaining;
        // Cap the addition to the remaining capacity of this factor
        if (toAdd > capacities[i]) {
          toAdd = capacities[i];
        }
        
        values[i] += toAdd;
        capacities[i] -= toAdd;
        remaining -= toAdd;
      }
    }
  }
  
  return values;
}

/**
 * Main calculation function.
 * @param {Date} dob
 * @returns {Object}
 */
export function calculateFactors(dob) {
  const day = dob.getDate();
  const motherDominant = day % 2 !== 0; // odd day => mother higher

  const seed = buildSeed(dob);
  const rng = seededRandom(seed);

  // The sum of minimums is 47.121
  // The sum of maximums is 54.230
  // To reach a grand total of 100, the dominant parent gets a target between 51.0 and 52.8
  // The recessive parent gets the remainder (100 - dominant target), which will be 47.2 to 49.0
  const dominantTarget = 51.0 + rng() * 1.8;
  const recessiveTarget = 100.0 - dominantTarget;
  
  const motherTarget = motherDominant ? dominantTarget : recessiveTarget;
  const fatherTarget = motherDominant ? recessiveTarget : dominantTarget;
  
  const motherValues = distributeSum(motherTarget, rng);
  const fatherValues = distributeSum(fatherTarget, rng);

  const factors = FACTORS.map((factor, i) => {
    const mother = parseFloat(motherValues[i].toFixed(3));
    const father = parseFloat(fatherValues[i].toFixed(3));
    const total = parseFloat((mother + father).toFixed(3));

    return {
      key: factor.key,
      label: factor.label,
      min: factor.min,
      max: factor.max,
      mother,
      father,
      total,
    };
  });

  // Calculate strict totals from the rounded values
  const motherTotal = parseFloat(factors.reduce((sum, f) => sum + f.mother, 0).toFixed(3));
  const fatherTotal = parseFloat(factors.reduce((sum, f) => sum + f.father, 0).toFixed(3));
  
  // Distribute any tiny floating point rounding error (e.g. 0.001) to force exact 100.000
  let grandTotal = parseFloat((motherTotal + fatherTotal).toFixed(3));
  if (grandTotal !== 100.000) {
    let diff = parseFloat((100.000 - grandTotal).toFixed(3));
    
    // Find a factor's father value that can absorb the diff without violating min/max limits
    for (let i = 0; i < factors.length && diff !== 0; i++) {
      let newFather = parseFloat((factors[i].father + diff).toFixed(3));
      if (newFather >= factors[i].min && newFather <= factors[i].max) {
        factors[i].father = newFather;
        factors[i].total = parseFloat((factors[i].mother + factors[i].father).toFixed(3));
        diff = 0;
        break;
      }
    }
    
    // Fallback to mother if needed (very unlikely)
    for (let i = 0; i < factors.length && diff !== 0; i++) {
      let newMother = parseFloat((factors[i].mother + diff).toFixed(3));
      if (newMother >= factors[i].min && newMother <= factors[i].max) {
        factors[i].mother = newMother;
        factors[i].total = parseFloat((factors[i].mother + factors[i].father).toFixed(3));
        diff = 0;
        break;
      }
    }
  }

  // Recalculate after correction
  const finalMotherTotal = parseFloat(factors.reduce((sum, f) => sum + f.mother, 0).toFixed(3));
  const finalFatherTotal = parseFloat(factors.reduce((sum, f) => sum + f.father, 0).toFixed(3));
  const finalGrandTotal = parseFloat((finalMotherTotal + finalFatherTotal).toFixed(3));

  return {
    factors,
    motherTotal: finalMotherTotal,
    fatherTotal: finalFatherTotal,
    grandTotal: finalGrandTotal,
    motherDominant,
    day,
    dob: dob.toLocaleDateString("en-GB"),
  };
}
