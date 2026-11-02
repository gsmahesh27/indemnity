# Kuwait EOS

A dependency-free PHP calculator for Kuwait private-sector end-of-service indemnity, with a compact responsive interface, server-side validation, an itemized calculation, and print support. No database, accounts, third-party assets, or JavaScript requirement for calculating.

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
- Enter applicable Article 55 remuneration, including qualifying regular components and any required variable-wage averaging. No automatic unpaid-absence deductions, social-insurance adjustment, notice compensation, leave encashment, deductions, or superior contractual benefits.
- Government, domestic-worker and special-sector rules are outside scope.

Reference: [Public Authority for Manpower](https://www.manpower.gov.kw/), Labour Law No. 6 of 2010, Articles 41, 47, 48 and 51–55. The official website was inaccessible from the build environment; current amendments were not independently verified. This is an estimate, not a final legal settlement. Have the rules reviewed against current law before production use.

## Structure

- `src/Calculator.php`: calculation and input validation.
- `public/index.php`: server-rendered form and results, escaping and security headers.
- `public/assets/`: responsive styles and optional field-label / print enhancements.
- `tests/calculator.php`: dependency-free boundary, cap, proration and validation checks.

No submitted fields are intentionally persisted. Hosting infrastructure may maintain access logs; configure retention for your deployment.
