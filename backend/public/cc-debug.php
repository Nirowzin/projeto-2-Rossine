<?php
header('Content-Type: application/json');

$autoload = __DIR__ . '/../vendor/autoload.php';
$artisan = __DIR__ . '/../artisan';

echo json_encode([
    'ok' => true,
    'php_version' => PHP_VERSION,
    'autoload_exists' => file_exists($autoload),
    'artisan_exists' => file_exists($artisan),
    'cwd' => getcwd(),
], JSON_PRETTY_PRINT);
