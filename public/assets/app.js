'use strict';
const radios = document.querySelectorAll('input[name="basis"]');
function updateBasis() {
  const daily = document.querySelector('input[name="basis"]:checked')?.value === 'daily';
  document.getElementById('salary-label').textContent = daily ? 'Daily wage' : 'Last monthly wage';
  document.getElementById('salary-help').textContent = daily
    ? 'Hourly-paid? Enter hourly rate × normal paid hours per day.'
    : 'Include regular wage components under Article 55.';
  document.getElementById('salary').placeholder = daily ? 'e.g. 25.000' : 'e.g. 650.000';
}
radios.forEach(radio => radio.addEventListener('change', updateBasis));
updateBasis();
document.getElementById('print-result')?.addEventListener('click', () => window.print());
