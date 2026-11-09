<?php
declare(strict_types=1);

namespace Indemnity;

use DateTimeImmutable;

final class Calculator
{
    public static function calculate(array $input): array
    {
        $errors = [];
        $salary = filter_var($input['salary'] ?? '', FILTER_VALIDATE_FLOAT);
        if ($salary === false || !is_finite($salary) || $salary <= 0 || $salary > 1000000) {
            $errors['salary'] = 'Enter a wage greater than 0 and no more than 1,000,000 KWD.';
        }
        $dates = [];
        foreach (['start', 'end'] as $key) {
            $raw = $input[$key] ?? '';
            $date = is_string($raw) ? DateTimeImmutable::createFromFormat('!Y-m-d', $raw) : false;
            if (!$date || $date->format('Y-m-d') !== $raw || $raw < '1900-01-01' || $raw > '2200-12-31') {
                $errors[$key] = 'Enter a valid date between 1900 and 2200.';
            } else {
                $dates[$key] = $date;
            }
        }
        $basis = $input['basis'] ?? '';
        $reason = $input['reason'] ?? '';
        $components = ['basic' => $salary === false ? 0.0 : $salary];
        if ($basis === 'monthly') {
            foreach (['housing', 'transport', 'incentive', 'other'] as $key) {
                $raw = $input[$key] ?? '';
                $amount = $raw === '' ? 0.0 : filter_var($raw, FILTER_VALIDATE_FLOAT);
                if ($amount === false || !is_finite($amount) || $amount < 0 || $amount > 1000000) {
                    $errors[$key] = 'Enter 0 or a positive amount up to 1,000,000 KWD.';
                } else {
                    $components[$key] = $amount;
                }
            }
            if (!$errors) {
                $salary = array_sum($components);
                if ($salary > 1000000) $errors['salary'] = 'The combined monthly wage must not exceed 1,000,000 KWD.';
            }
        }

        if (!in_array($basis, ['monthly', 'daily'], true)) $errors['basis'] = 'Choose a wage basis.';
        if (!in_array($reason, ['employer', 'expiry', 'resignation', 'fixed_resignation', 'article41'], true)) $errors['reason'] = 'Choose how employment ended.';
        if (isset($dates['start'], $dates['end']) && $dates['end'] <= $dates['start']) $errors['end'] = 'The end date must be after the start date.';
        if ($errors) return ['errors' => $errors];

        // Complete calendar years plus the fraction of the current anniversary year.
        // End date is the service endpoint, exclusive; no extra day is added.
        $start = $dates['start'];
        $end = $dates['end'];
        $wholeYears = (int) $start->diff($end)->y;
        $anniversary = $start->modify("+$wholeYears years");
        $next = $start->modify('+' . ($wholeYears + 1) . ' years');
        $fraction = (int) $anniversary->diff($end)->days / (int) $anniversary->diff($next)->days;
        $years = $wholeYears + $fraction;
        $firstYears = min($years, 5);
        $laterYears = max(0, $years - 5);
        $daily = $basis === 'monthly' ? $salary / 26 : $salary;
        $firstRate = $basis === 'monthly' ? 15 : 10;
        $laterRate = $basis === 'monthly' ? 26 : 15;
        $first = $firstYears * $firstRate * $daily;
        $later = $laterYears * $laterRate * $daily;
        $cap = $basis === 'monthly' ? $salary * 18 : $salary * 26 * 12;
        $gross = min($first + $later, $cap);
        $factor = 1.0;
        if ($reason === 'resignation') {
            $factor = $wholeYears < 3 ? 0.0 : ($years <= 5 ? 0.5 : ($wholeYears < 10 ? 2 / 3 : 1.0));
        }
        if ($reason === 'article41') $factor = 0.0;
        return [
            'wage' => $salary, 'components' => $components,
            'errors' => [], 'years' => $years, 'duration' => $start->diff($end),
            'firstYears' => $firstYears, 'laterYears' => $laterYears,
            'firstRate' => $firstRate, 'laterRate' => $laterRate,
            'daily' => $daily, 'first' => $first, 'later' => $later,
            'cap' => $cap, 'gross' => $gross, 'factor' => $factor,
            'total' => $gross * $factor,
            'review' => $reason === 'fixed_resignation',
        ];
    }
}
