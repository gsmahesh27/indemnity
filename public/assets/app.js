'use strict';
const radios = document.querySelectorAll('input[name="basis"]');
function updateBasis() {
  const daily = document.querySelector('input[name="basis"]:checked')?.value === 'daily';
  document.getElementById('salary-label').textContent = daily ? 'Total daily wage' : 'Basic monthly salary';
  document.getElementById('salary-help').textContent = daily
    ? 'Enter total daily remuneration including eligible allowances; hourly rate × normal daily hours for hourly pay.'
    : 'Basic salary only; add regular allowances below.';
  const allowances = document.getElementById('allowance-fields');
  allowances.hidden = daily;
  allowances.disabled = daily;
  document.getElementById('salary').placeholder = daily ? 'e.g. 25.000' : 'e.g. 650.000';
}
radios.forEach(radio => radio.addEventListener('change', updateBasis));
updateBasis();
document.getElementById('print-result')?.addEventListener('click', () => window.print());
