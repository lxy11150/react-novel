<?php
require __DIR__ . '/vendor/autoload.php'; // 引入 Firebase JWT 库

use \Firebase\JWT\JWT;

// 验证令牌
function verifyToken($token)
{
    $secretKey = "my_secret_key"; // 替换为你的密钥
    try {
        // 解码令牌
        $decoded = JWT::decode($token, $secretKey, array('HS256'));
        return true;
    } catch (Exception $e) {
        return false;
    }
}