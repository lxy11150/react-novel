<?php
include './mysqli.php';
include './global.php';
require 'vendor/autoload.php'; // 引入 Firebase JWT 库

use \Firebase\JWT\JWT;

$conn = connectDatabase();

// 获取 Authorization 头部信息
$token = null;
$headers = getallheaders();
if (isset($headers['Authorization'])) {
    $authorizationHeader = $headers['Authorization'];
    list($token) = sscanf($authorizationHeader, 'Bearer %s');
}

// 检查是否提供了令牌
if ($token) {
    try {
        // 解码 JWT 令牌
        $jwtSecret = "my_secret_key"; // 替换为你的密钥
        $decoded = JWT::decode($token, $jwtSecret, array('HS256'));

        // 获取用户名
        $username = $decoded->username;

        // 查询用户信息
        $stmt = $conn->prepare("SELECT * FROM user WHERE username = ?");
        $stmt->bind_param("s", $username);

        // 执行预处理语句
        $stmt->execute();

        // 获取查询结果
        $result = $stmt->get_result();

        // 检查用户是否存在
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();

            // 返回用户信息给客户端
            success("用户的个人信息", $user);
        } else {
            error("用户不存在");
        }

        // 关闭预处理语句
        $stmt->close();
    } catch (Exception $e) {
        error("无效的令牌");
    }
} else {
    error("未提供令牌");
}

// 关闭连接
$conn->close();
?>
