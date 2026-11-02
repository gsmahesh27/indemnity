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
// Keep each mobile task on its own screen; desktop shows both panels.
document.body.classList.add('js');
const viewButtons = document.querySelectorAll('[data-view]');
function showView(view) {
  document.body.dataset.view = view;
  document.querySelectorAll('.mobile-steps button').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.view === view));
  });
}
viewButtons.forEach(button => {
  if (button === document.body) return;
  button.addEventListener('click', () => showView(button.dataset.view));
});
showView(document.body.dataset.initialView || 'pay');
const rulesDialog = document.getElementById('rules-dialog');
document.getElementById('open-rules').addEventListener('click', () => rulesDialog.showModal());
document.getElementById('close-rules').addEventListener('click', () => rulesDialog.close());
document.getElementById('calculator-form').addEventListener('invalid', event => {
  const firstInvalid = event.currentTarget.querySelector('input:invalid, select:invalid') || event.target;
  showView(firstInvalid.closest('.pay-panel') ? 'pay' : 'service');
}, true);

