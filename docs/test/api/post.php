<?php 


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    exit;
}

$filename = 'data/data.json';

if (file_put_contents($filename, json_encode($data, JSON_PRETTY_PRINT)) === false) {
    http_response_code(500);
    exit;
}

http_response_code(200);

