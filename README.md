# Kuwait EOS

A dependency-free PHP calculator for Kuwait private-sector end-of-service indemnity, with a compact responsive interface, server-side validation, an itemized calculation, and print support. Mobile uses Pay / Service / Estimate steps; desktop shows form and results together. Wage components expand on demand and legal notes open in a dialog. Normal states were checked without page scrolling at 375×667, 390×844, 1024×768, 1366×600, 1366×768 and 1920×1080. Expanded details, validation messages, smaller viewports, enlarged text and the on-screen keyboard can require scrolling; content is never clipped to force a fit. No database, accounts, third-party assets, or JavaScript requirement for calculating.

## Run

Requires PHP 8.2 or later.

```sh
cd /workspace/indemnity
php -S 0.0.0.0:8080 -t public
```

The web root must be `public/`. PHP's built-in server is for development; use a PHP-enabled web server with HTTPS for production. No Composer installation is needed.

```sh
php tests/calculator.php
php -l public/index.php
php -l src/Calculator.php
```

On the prepared cloud machine PHP is installed locally at `/workspace/php-runtime/bin/php`; use that path if `php` is not on PATH. Live server processes must be restarted in new tasks.

## Calculation and scope

- Article 51, Law No. 6 of 2010: monthly workers earn 15 daily wages per year for the first five years and one monthly wage thereafter; cap of 18 monthly wages.
- Daily/weekly/hourly/piece-rate workers earn 10 daily wages per year for the first five years and 15 thereafter; cap of one year's remuneration, modeled as 312 daily wages.
- Monthly daily-wage equivalent uses the 26-working-day convention. Hourly workers enter their equivalent normal daily wage. Confirm schedule-dependent conversions with a qualified adviser.
- Article 53, indefinite-contract resignation: below 3 years, zero; 3 through exactly 5 years, half; more than 5 but below 10, two-thirds; at least 10, full. The reduction applies after the statutory cap.
- Eligible termination/expiry assumes full entitlement. Article 41(a) dismissal assumes zero. Early fixed-term resignation shows accrued benefits with a review warning; compensation under Article 47 is not calculated.
- Fractional service uses whole calendar years plus remaining days divided by the length of the next service year. The end date is exclusive. Amounts retain precision internally and display three decimal places (KWD).
- Monthly wage is basic salary plus separately entered regular housing/rent, transport, fixed incentive and other wage allowances, under the remuneration principles in Articles 55 and 62. This combined wage drives both accrual and caps. Leave optional components blank for zero; do not double count. Actual expense reimbursements are excluded from these wage entries. Eligibility depends on contract, established practice and legal character. Variable commissions/bonuses and benefits in kind need individual assessment, applicable averaging or legal valuation; the app does not automatically determine them. Daily workers enter their total applicable daily remuneration; monthly allowance fields are ignored. No automatic unpaid-absence deductions, social-insurance adjustment, notice compensation, leave encashment, deductions, or superior contractual benefits.
- Government, domestic-worker and special-sector rules are outside scope.

Reference: [Public Authority for Manpower](https://www.manpower.gov.kw/), Labour Law No. 6 of 2010, Articles 41, 47, 48 and 51–55, 62. The official website was inaccessible from the build environment; current amendments were not independently verified. This is an estimate, not a final legal settlement. Have the rules reviewed against current law before production use.

## Structure

- `src/Calculator.php`: calculation and input validation.
- `public/index.php`: server-rendered form and results, escaping and security headers.
- `public/assets/`: responsive styles and optional field-label / print enhancements.
- `tests/calculator.php`: dependency-free boundary, cap, proration and validation checks.

No submitted fields are intentionally persisted. Hosting infrastructure may maintain access logs; configure retention for your deployment.

## Shared hosting

For a domain-root installation, copy `public/index.php`, `public/about.php` and `public/assets/` into `htdocs/`, and `src/` into `htdocs/src/`. The entry point supports both this layout and the standard `public/` web root. Upload only application files; leave tests and documentation out of the public host. The discreet footer About link opens a separate page with the project contact, gsmahesh@gmail.com.

## Automatic deployment

`.github/workflows/deploy.yml` deploys changes on `kuwait-eos-calculator` after PHP syntax and calculation checks pass. It uses the GitHub repository Actions secrets `FTP_SERVER` (hostname only), `FTP_USERNAME` and `FTP_PASSWORD`. Never put their values in source code. GitHub Actions runs independently of Codespaces.

The default remote directory is `/htdocs`. If this domain uses a different document root, set the repository Actions **variable** `FTP_DIRECTORY` to its absolute FTP path. The upload maps `public/*` to the domain root and `src/*` to its `src/` directory. Tests, README and `.github` are not uploaded. Existing unrelated files are not deleted. Files removed from GitHub must currently be removed manually from the host.

The uploader requires explicit FTPS on port 21, validates certificates and encrypts file transfers; it never falls back to unencrypted FTP. If the hosting service is down, credentials are incorrect, or verified TLS is unavailable, the run fails rather than reporting a successful deployment. Check the Actions run to confirm a real upload; saving the workflow alone does not prove the live website changed. Each successful deployment can take a few minutes. Uploads are sequential, not an atomic website release.

## Optional currency conversion

After calculating, use the currency dropdown beside the headline total to view an indicative converted amount directly. KWD is first so the selected original currency opens at the top, with INR immediately below it, followed by EGP, BDT, PHP and an approximate order of other common expatriate communities. No current population percentages were verified; this is not an official demographic ranking. Currencies without an approximate community priority follow alphabetically, and KWD (the original entitlement) remains the default selection. The headline changes to the selected currency; the original entitlement and breakdown stay in KWD. The browser fetches daily rates from `https://open.er-api.com/v6/latest/KWD` (ExchangeRate-API, linked attribution in the converter); no API key is needed. The request sends only the base-currency URL, never entered employment details. The converter shows the provider's update time and supports the currencies returned by the API, with their usual decimal precision. Rates are not real-time bank quotes and exclude transfer fees.

Rates are cached only in memory for up to 15 minutes. **Refresh rates** requests the latest available daily quote. Invalid responses, wrong base currencies, nonpositive rates, future timestamps and rates older than 48 hours are rejected. Network/API failure leaves the KWD result intact and offers a retry. Currency conversion requires JavaScript and browser access to the provider; server-side PHP calculation works independently. The page's CSP permits that specific rate API. The cloud executor could not access the public endpoint (HTTP 403); integration behavior is tested with representative API responses, not a verified live quote from this environment.

## Amount in words

The amount in words is always visible directly beneath the headline amount. It follows the selected currency and rounds exactly as the numeric display does. KWD uses three-decimal fils, INR uses lakh/crore and paise, JPY uses whole yen, and common currencies use their major/minor unit names. For other currencies the ISO code and fractional denomination (for example, hundredths) are used rather than guessing local unit names. Unavailable rates do not produce an amount in words. Run `node tests/amount-words.mjs` for rounding, zero, singular/plural and currency-unit checks. Long amounts in words wrap naturally and may require additional vertical space.
