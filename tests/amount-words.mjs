import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const source = readFileSync(new URL('../public/assets/amount-words.js', import.meta.url), 'utf8');
const { amountInWords } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const cases = [
  [1250.5, 'KWD', 'One thousand two hundred fifty Kuwaiti dinars and five hundred fils only.'],
  [1.001, 'KWD', 'One Kuwaiti dinar and one fils only.'],
  [1.9996, 'KWD', 'Two Kuwaiti dinars only.'],
  [0, 'KWD', 'Zero Kuwaiti dinars only.'],
  [0.005, 'KWD', 'Zero Kuwaiti dinars and five fils only.'],
  [125000.5, 'INR', 'One lakh twenty-five thousand Indian rupees and fifty paise only.'],
  [10000000, 'INR', 'One crore Indian rupees only.'],
  [1.01, 'INR', 'One Indian rupee and one paisa only.'],
  [1.01, 'GBP', 'One British pound and one penny only.'],
  [2.02, 'GBP', 'Two British pounds and two pence only.'],
  [1.005, 'USD', 'One US dollar and one cent only.'],
  [1.5, 'JPY', 'Two Japanese yen only.'],
  [1.25, 'PHP', 'One Philippine peso and twenty-five centavos only.'],
  [1.25, 'AUD', 'One AUD and twenty-five hundredths only.'],
  [-1, 'KWD', 'Amount unavailable.'],
  [Infinity, 'INR', 'Amount unavailable.'],
];
for (const [value, code, expected] of cases) assert.equal(amountInWords(value, code), expected, `${value} ${code}`);
console.log(`${cases.length} amount-in-words checks passed.`);
