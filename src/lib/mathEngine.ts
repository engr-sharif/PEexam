// Safe math expression engine used by the on-exam Calculator and MathLab.
// Supports variables, deg/rad trig, and common engineering functions.
// No arbitrary code: identifiers are whitelisted before evaluation.

export interface EvalScope {
  [name: string]: number;
}

const FUNCTIONS = [
  'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'atan2',
  'sqrt', 'log', 'ln', 'exp', 'abs', 'min', 'max', 'pow', 'round',
] as const;
const CONSTANTS = ['pi', 'e', 'gw', 'gwSI'] as const; // gw = 62.4 pcf, gwSI = 9.81 kN/m³

const NAME_RE = /[A-Za-z_][A-Za-z0-9_]*/g;

/** Evaluate one expression against a variable scope. Throws on bad input. */
export function evaluate(expr: string, scope: EvalScope, deg = true): number {
  const js = expr.replace(/\^/g, '**');

  // whitelist identifiers
  const names = js.match(NAME_RE) ?? [];
  for (const n of names) {
    if (
      !FUNCTIONS.includes(n as (typeof FUNCTIONS)[number]) &&
      !CONSTANTS.includes(n as (typeof CONSTANTS)[number]) &&
      !(n in scope)
    ) {
      throw new Error(`Unknown name: ${n}`);
    }
  }

  const toRad = deg ? (x: number) => (x * Math.PI) / 180 : (x: number) => x;
  const fromRad = deg ? (x: number) => (x * 180) / Math.PI : (x: number) => x;

  const builtins: Record<string, unknown> = {
    sin: (x: number) => Math.sin(toRad(x)),
    cos: (x: number) => Math.cos(toRad(x)),
    tan: (x: number) => Math.tan(toRad(x)),
    asin: (x: number) => fromRad(Math.asin(x)),
    acos: (x: number) => fromRad(Math.acos(x)),
    atan: (x: number) => fromRad(Math.atan(x)),
    atan2: (y: number, x: number) => fromRad(Math.atan2(y, x)),
    sqrt: Math.sqrt,
    log: Math.log10,
    ln: Math.log,
    exp: Math.exp,
    abs: Math.abs,
    min: Math.min,
    max: Math.max,
    pow: Math.pow,
    round: Math.round,
    pi: Math.PI,
    e: Math.E,
    gw: 62.4,
    gwSI: 9.81,
  };

  const env = { ...builtins, ...scope };
  const keys = Object.keys(env);
  const vals = Object.values(env);
  // eslint-disable-next-line no-new-func
  const fn = new Function(...keys, `"use strict"; return (${js});`);
  const out = fn(...vals);
  if (typeof out !== 'number' || !isFinite(out)) throw new Error('Not a number');
  return out;
}

export interface WorksheetLine {
  input: string;
  /** variable assigned, if the line was `name = expr` */
  name?: string;
  value?: number;
  error?: string;
}

/**
 * Evaluate a whole worksheet top-to-bottom. Lines may be:
 *   `x = expr`   (assignment)
 *   `expr`       (evaluate & display)
 *   `# comment`  (ignored)
 */
export function runWorksheet(lines: string[], deg = true): WorksheetLine[] {
  const scope: EvalScope = {};
  return lines.map((raw) => {
    const input = raw.trim();
    if (!input || input.startsWith('#')) return { input };
    const m = input.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=(?!=)\s*(.+)$/);
    try {
      if (m) {
        const value = evaluate(m[2], scope, deg);
        scope[m[1]] = value;
        return { input, name: m[1], value };
      }
      const value = evaluate(input, scope, deg);
      return { input, value };
    } catch (e) {
      return { input, error: e instanceof Error ? e.message : 'Error' };
    }
  });
}

export function fmt(n: number, digits = 4): string {
  if (n === 0) return '0';
  const abs = Math.abs(n);
  if (abs >= 1e6 || abs < 1e-4) return n.toExponential(3);
  return Number(n.toPrecision(digits + 2)).toLocaleString('en-US', {
    maximumFractionDigits: digits,
  });
}
