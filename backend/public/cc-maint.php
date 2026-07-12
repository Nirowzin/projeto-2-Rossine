<?php
$key = $_GET['key'] ?? '';

// Temporary protected maintenance endpoint for emergency migration.
if ($key !== 'cc-2026-07-12-fix-login') {
    http_response_code(403);
    header('Content-Type: text/plain');
    echo 'forbidden';
    exit;
}

header('Content-Type: text/plain');
@set_time_limit(0);

chdir(__DIR__ . '/..');

passthru('php artisan optimize:clear 2>&1');
echo PHP_EOL;
passthru('php artisan migrate --force --seed 2>&1');
