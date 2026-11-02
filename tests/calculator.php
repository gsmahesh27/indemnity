<?php
declare(strict_types=1);
require dirname(__DIR__) . '/src/Calculator.php';
use Indemnity\Calculator;
$count = 0;
function check(string $label, bool $ok): void { global $count; $count++; if (!$ok) { fwrite(STDERR, "FAIL: $label\n"); exit(1); } echo "PASS: $label\n"; }
function calc(array $overrides = []): array { return Calculator::calculate(array_replace(['salary' => '260', 'start' => '2020-01-01', 'end' => '2025-01-01', 'basis' => 'monthly', 'reason' => 'employer'], $overrides)); }
function near(float $actual, float $expected): bool { return abs($actual - $expected) < 0.00001; }
check('Monthly first five years: 75 daily wages', near(calc()['total'], 750));
check('Monthly later tier is full monthly wage', near(calc(['end' => '2026-01-01'])['total'], 1010));
check('Monthly cap: 18 months', near(calc(['end' => '2070-01-01'])['total'], 4680));
check('Daily first tier: 50 days', near(calc(['basis' => 'daily', 'salary' => '10'])['total'], 500));
check('Daily second tier: 15 days per year', near(calc(['basis' => 'daily', 'salary' => '10', 'end' => '2026-01-01'])['total'], 650));
check('Daily annual cap: 312 daily wages', near(calc(['basis' => 'daily', 'salary' => '10', 'end' => '2070-01-01'])['total'], 3120));
foreach (['2022-12-31' => 0.0, '2023-01-01' => 0.5, '2025-01-01' => 0.5, '2025-01-02' => 2/3, '2029-12-31' => 2/3, '2030-01-01' => 1.0] as $end => $factor) {
 check("Resignation threshold $end", near(calc(['reason' => 'resignation', 'end' => $end])['factor'], $factor));
}
check('Partial leap year is prorated', near(calc(['end' => '2020-07-02'])['total'], 75));
check('Contract expiry grants full entitlement', calc(['reason' => 'expiry'])['factor'] === 1.0);
check('Article 41(a) forfeiture', near(calc(['reason' => 'article41'])['total'], 0));
check('Fixed-term resignation requires review', calc(['reason' => 'fixed_resignation'])['review']);
foreach ([['salary' => '-1'], ['salary' => 'NaN'], ['salary' => 'INF'], ['start' => '2023-02-29'], ['end' => '2019-01-01'], ['end' => '2020-01-01'], ['basis' => 'other'], ['reason' => 'other'], ['start' => '2020-01-01<script>']] as $bad) {
 check('Reject invalid input ' . json_encode($bad), !empty(calc($bad)['errors']));
}
$allowances = ['salary' => '500', 'housing' => '150', 'transport' => '50', 'incentive' => '100', 'other' => '20'];
check('All regular monthly components form wage basis', near(calc($allowances)['wage'], 820));
check('Allowance-inclusive first tier', near(calc($allowances)['total'], 820 / 26 * 75));
check('Allowance-inclusive second tier', near(calc($allowances + ['end' => '2026-01-01'])['total'], 820 / 26 * 75 + 820));
check('Cap includes regular allowances', near(calc($allowances + ['end' => '2070-01-01'])['total'], 820 * 18));
check('Resignation applies to allowance-inclusive benefit', near(calc($allowances + ['reason' => 'resignation'])['total'], 820 / 26 * 75 / 2));
check('Daily pay does not add monthly components', near(calc(['basis' => 'daily', 'salary' => '10', 'housing' => '150'])['total'], 500));
check('Blank optional allowance means zero', near(calc(['housing' => ''])['wage'], 260));
foreach (['housing', 'transport', 'incentive', 'other'] as $key) {
 check("Reject negative $key", isset(calc([$key => '-1'])['errors'][$key]));
 check("Reject invalid $key", isset(calc([$key => 'not-a-number'])['errors'][$key]));
}
check('Reject excessive combined wage', isset(calc(['salary' => '999999', 'housing' => '2'])['errors']['salary']));
echo "$count checks passed.\n";
