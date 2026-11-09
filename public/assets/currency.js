'use strict';
const endpoint = 'https://open.er-api.com/v6/latest/KWD';
const result = document.getElementById('currency-result');

// Rates are indicative daily quotes. Reject invalid, future, or stale responses.
export function validateRates(payload, now = Date.now()) {
  const updated = Number(payload.time_last_update_unix) * 1000;
  if (payload.result !== 'success' || payload.base_code !== 'KWD'
      || !Number.isFinite(updated) || updated > now + 300000
      || now - updated > 48 * 60 * 60 * 1000
      || !payload.rates || typeof payload.rates !== 'object'
      || payload.rates.KWD !== 1) {
    throw new Error('Valid current KWD rates are unavailable.');
  }
  const rates = Object.fromEntries(Object.entries(payload.rates).filter(([code, rate]) =>
    /^[A-Z]{3}$/.test(code) && Number.isFinite(rate) && rate > 0));
  return { rates, updated };
}

if (result) {
  const base = Number(result.dataset.kwd);
  const select = document.getElementById('display-currency');
  const value = document.getElementById('converted-value');
  const codeLabel = document.getElementById('converted-code');
  const rateLabel = document.getElementById('conversion-rate');
  const status = document.getElementById('currency-status');
  const refresh = document.getElementById('refresh-rates');
  let cached = null;
  let loadedAt = 0;
  let pending = null;
  let failure = false;

  // Approximate community-size priority, not a verified current population ranking.
  // Keep this order stable when the rate response adds more currencies.
  const priority = ['INR', 'EGP', 'BDT', 'PHP', 'SYP', 'SAR', 'LKR', 'NPR', 'PKR',
    'JOD', 'YER', 'IRR', 'LBP', 'SDG', 'AFN', 'IDR', 'TRY', 'ETB', 'CNY', 'KES'];
  const countryLabels = new Map([...select.options].map(option => [option.value, option.textContent]));
  const meta = document.getElementById('currency-meta');

  function populateCurrencies(rates) {
    const selected = select.value;
    const names = typeof Intl.DisplayNames === 'function'
      ? new Intl.DisplayNames(['en'], { type: 'currency' }) : null;
    const codes = ['KWD', ...priority, ...Object.keys(rates).filter(code =>
      !priority.includes(code) && code !== 'KWD').sort()];
    if (!codes.includes(selected)) codes.push(selected);
    select.replaceChildren(...codes.map(code => {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = countryLabels.get(code) || code + (names ? ' · ' + names.of(code) : '');
      if (!rates[code]) option.textContent += ' · unavailable';
      return option;
    }));
    select.value = selected;
  }

  function render() {
    const code = select.value;
    const rate = code === 'KWD' ? 1 : cached?.rates[code];
    codeLabel.textContent = code;
    meta.hidden = code === 'KWD';
    const available = Number.isFinite(rate) && rate > 0 && Number.isFinite(base * rate);
    value.textContent = available ? new Intl.NumberFormat('en', {
      style: 'currency', currency: code, currencyDisplay: 'code',
    }).format(base * rate).replace(code, '').trim() : '—';
    rateLabel.textContent = available
      ? '1 KWD = ' + new Intl.NumberFormat('en', { maximumFractionDigits: 6 }).format(rate) + ' ' + code
      : 'Conversion unavailable. Your KWD total is unchanged.';
    status.textContent = pending ? 'Loading latest available daily rates…'
      : failure ? 'Could not load current rates. Check your connection and try Refresh rates.'
      : cached ? ' · Updated ' + new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium', timeStyle: 'short',
      }).format(new Date(cached.updated))
      : 'Rates update daily, not in real time.';
  }

  async function load(force = false) {
    if (pending) return pending;
    if (!force && cached && Date.now() - loadedAt < 15 * 60 * 1000) {
      render();
      return;
    }
    failure = false;
    refresh.disabled = true;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    pending = (async () => {
      try {
        // Only the base currency is sent to the provider, never salary or service details.
        const response = await fetch(endpoint, {
          signal: controller.signal, credentials: 'omit', referrerPolicy: 'no-referrer',
          cache: 'no-cache',
        });
        if (!response.ok) throw new Error('Rate request failed.');
        cached = validateRates(await response.json());
        loadedAt = Date.now();
        populateCurrencies(cached.rates);
      } catch {
        cached = null;
        failure = true;
      } finally {
        clearTimeout(timer);
        pending = null;
        refresh.disabled = false;
        render();
      }
    })();
    render();
    return pending;
  }

  select.addEventListener('change', () => {
    render();
    if (select.value !== 'KWD') load();
  });
  refresh.addEventListener('click', () => load(true));
  load();
}
