<?php
header('Content-Type: application/json');

$autoload = __DIR__ . '/../vendor/autoload.php';
$artisan = __DIR__ . '/../artisan';

if (isset($_GET['which']) && $_GET['which'] === 'composer') {
    header('Content-Type: text/plain');
    echo shell_exec('which composer 2>&1');
    exit;
}

if (isset($_GET['install']) && $_GET['install'] === '1') {
    header('Content-Type: text/plain');
    @set_time_limit(0);
    chdir(__DIR__ . '/..');
    passthru('composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader 2>&1');
    echo PHP_EOL;
    passthru('php -r "if (!file_exists(\'/tmp/database.sqlite\')) { touch(\'/tmp/database.sqlite\'); }" 2>&1');
    echo PHP_EOL;
    passthru('php artisan migrate --force --seed 2>&1');
    exit;
}

echo json_encode([
    'ok' => true,
    'php_version' => PHP_VERSION,
    'autoload_exists' => file_exists($autoload),
    'artisan_exists' => file_exists($artisan),
    'cwd' => getcwd(),
], JSON_PRETTY_PRINT);
