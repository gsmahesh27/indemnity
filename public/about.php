<?php
declare(strict_types=1);
$nonce = base64_encode(random_bytes(18));
header('Content-Type: text/html; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header("Content-Security-Policy: default-src 'self'; style-src 'nonce-$nonce'; base-uri 'none'; frame-ancestors 'none'");
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#f8fafd">
<title>About · Kuwait EOS</title>
<style nonce="<?= htmlspecialchars($nonce, ENT_QUOTES, 'UTF-8') ?>">
:root{color-scheme:light;font-family:Arial,Helvetica,sans-serif;color:#202124;background:#f8fafd}*{box-sizing:border-box}body{margin:0;padding:32px 20px;min-height:100vh;display:grid;place-items:center}main{width:100%;max-width:520px}.back{display:inline-flex;align-items:center;gap:8px;font-size:12px;color:#5f6368;text-decoration:none;margin-bottom:18px;padding:5px 0}.back:hover{color:#202124}.card{background:#fff;border:1px solid #e0e5ed;border-radius:18px;padding:32px;box-shadow:0 8px 30px #20212405}.brand-mark{width:42px;height:42px;display:grid;place-items:center;border-radius:12px;background:#1a73e8;color:#ffffff;font-size:28px;font-weight:700;margin-bottom:23px}.eyebrow{font-size:10px;letter-spacing:1.8px;color:#1a73e8;font-weight:600;margin:0 0 10px}h1{font-size:32px;font-weight:500;letter-spacing:-1px;margin:0 0 14px}.description{font-size:14px;line-height:1.8;color:#5f6368;margin:0 0 26px}.links{border-top:1px solid #e1e5eb}.link-row{display:flex;justify-content:space-between;align-items:center;gap:15px;padding:18px 0;border-bottom:1px solid #e1e5eb;text-decoration:none;color:inherit}.link-row:hover .value{text-decoration:underline;text-underline-offset:4px}.label{display:block;color:#5f6368;font-size:10px;letter-spacing:1px;text-transform:uppercase;margin-bottom:7px}.value{font-size:14px;font-weight:600;overflow-wrap:anywhere}.arrow{font-size:20px;color:#1a73e8;font-weight:400}.note{margin:23px 0 0;font-size:11px;line-height:1.8;color:#5f6368}a:focus-visible{outline:3px solid #4285f4;outline-offset:5px;border-radius:4px}@media(max-width:480px){body{padding:20px 16px}.card{padding:25px 23px;border-radius:15px}h1{font-size:29px}.description{font-size:13px}.value{font-size:13px}.brand-mark{margin-bottom:20px}}@media(max-height:650px){body{padding-top:16px;padding-bottom:16px}.card{padding:24px}.brand-mark{margin-bottom:16px}.description{margin-bottom:18px}.link-row{padding:14px 0}.note{margin-top:17px}}
.card{border-top:3px solid #34a853}.brand-mark{background:#1a73e8}.description{padding-left:12px;border-left:3px solid #fbbc04}.links{border-top-color:#f4d783}.link-row:last-child .arrow{color:#c5221f}h1{color:#1967d2}.link-row:first-child .label{color:#188038}.link-row:last-child .label{color:#b3261e}
</style>
</head>
<body><main>
<a class="back" href="./"><span aria-hidden="true">←</span> Back to calculator</a>
<article class="card" aria-labelledby="about-title">
<div class="brand-mark" aria-hidden="true">K°</div>
<p class="eyebrow">ABOUT THIS PROJECT</p>
<h1 id="about-title">Kuwait EOS</h1>
<p class="description">A simple way to understand your estimated end-of-service indemnity in Kuwait. Clear inputs, transparent calculations, and an itemized result.</p>
<div class="links">
<a class="link-row" href="mailto:gsmahesh@gmail.com"><span><span class="label">Contact & feedback</span><span class="value">gsmahesh@gmail.com</span></span><span class="arrow" aria-hidden="true">→</span></a>
<a class="link-row" href="https://github.com/gsmahesh27/indemnity/tree/kuwait-eos-calculator" target="_blank" rel="noopener noreferrer"><span><span class="label">Source code</span><span class="value">View project on GitHub</span></span><span class="arrow" aria-hidden="true">↗</span></a>
</div>
<p class="note">For general information only. Review the calculator’s rules and assumptions before relying on an estimate.</p>
</article>
</main></body></html>
