'use strict';
const small = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
function belowThousand(n) {
  if (n < 20n) return small[Number(n)];
  if (n < 100n) return tens[Number(n / 10n)] + (n % 10n ? '-' + small[Number(n % 10n)] : '');
  return small[Number(n / 100n)] + ' hundred' + (n % 100n ? ' ' + belowThousand(n % 100n) : '');
}
function integerWords(n, indian = false) {
  const scales = indian
    ? [[1000000000000000n, 'quadrillion'], [1000000000000n, 'trillion'], [1000000000n, 'hundred crore'], [10000000n, 'crore'], [100000n, 'lakh'], [1000n, 'thousand']]
    : [[1000000000000000000n, 'quintillion'], [1000000000000000n, 'quadrillion'], [1000000000000n, 'trillion'], [1000000000n, 'billion'], [1000000n, 'million'], [1000n, 'thousand']];
  for (const [scale, label] of scales) {
    if (n >= scale) return integerWords(n / scale, indian) + ' ' + label + (n % scale ? ' ' + integerWords(n % scale, indian) : '');
  }
  return belowThousand(n);
}
// Major singular, major plural, minor singular, minor plural.
const units = {
  KWD: ['Kuwaiti dinar', 'Kuwaiti dinars', 'fils', 'fils'],
  INR: ['Indian rupee', 'Indian rupees', 'paisa', 'paise'],
  PHP: ['Philippine peso', 'Philippine pesos', 'centavo', 'centavos'],
  EGP: ['Egyptian pound', 'Egyptian pounds', 'piastre', 'piastres'],
  PKR: ['Pakistani rupee', 'Pakistani rupees', 'paisa', 'paise'],
  BDT: ['Bangladeshi taka', 'Bangladeshi taka', 'poisha', 'poisha'],
  LKR: ['Sri Lankan rupee', 'Sri Lankan rupees', 'cent', 'cents'],
  NPR: ['Nepalese rupee', 'Nepalese rupees', 'paisa', 'paise'],
  USD: ['US dollar', 'US dollars', 'cent', 'cents'],
  EUR: ['euro', 'euros', 'cent', 'cents'],
  GBP: ['British pound', 'British pounds', 'penny', 'pence'],
  SAR: ['Saudi riyal', 'Saudi riyals', 'halala', 'halalas'],
  AED: ['UAE dirham', 'UAE dirhams', 'fils', 'fils'],
  JOD: ['Jordanian dinar', 'Jordanian dinars', 'fils', 'fils'],
  BHD: ['Bahraini dinar', 'Bahraini dinars', 'fils', 'fils'],
  OMR: ['Omani rial', 'Omani rials', 'baisa', 'baisa'],
  JPY: ['Japanese yen', 'Japanese yen'],
};

export function amountInWords(amount, currency) {
  if (!Number.isFinite(amount) || amount < 0 || !/^[A-Z]{3}$/.test(currency)) return 'Amount unavailable.';
  // Use the same currency rounding as the numeric display, including carry to the major unit.
  const formatter = new Intl.NumberFormat('en', { style: 'currency', currency, useGrouping: false });
  const parts = formatter.formatToParts(amount);
  const whole = BigInt(parts.find(part => part.type === 'integer').value);
  const fraction = parts.find(part => part.type === 'fraction')?.value || '';
  const minor = BigInt(fraction || '0');
  const names = units[currency];
  let result = integerWords(whole, currency === 'INR') + ' ' + (names ? names[whole === 1n ? 0 : 1] : currency);
  if (minor) {
    const minorName = names?.[minor === 1n ? 2 : 3]
      || ({ 1: 'tenths', 2: 'hundredths', 3: 'thousandths', 4: 'ten-thousandths' }[fraction.length]);
    result += ' and ' + integerWords(minor) + ' ' + minorName;
  }
  return result[0].toUpperCase() + result.slice(1) + ' only.';
}
