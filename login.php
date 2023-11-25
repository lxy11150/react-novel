<?php
include './mysqli.php';
include './global.php';
require __DIR__ . '/vendor/autoload.php'; // 引入 Firebase JWT 库

use \Firebase\JWT\JWT;

$conn = connectDatabase();

// 获取原始 JSON 数据
$json_data = file_get_contents("php://input");

// 解码 JSON 数据为 PHP 数组
$data = json_decode($json_data, true);

// 用户提交的登录信息
$password = isset($data['password']) ? $data['password'] : '';
$username = isset($data['username']) ? $data['username'] : '';

// 检查必要的字段是否为空
if ($password !== '' && $username !== '') {
    // 使用预处理语句防止 SQL 注入
    $stmt = $conn->prepare("SELECT * FROM user WHERE username = ?");
    $stmt->bind_param("s", $username);

    // 执行预处理语句
    $stmt->execute();

    // 获取查询结果
    $result = $stmt->get_result();

    // 检查用户名和密码是否匹配
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc(); //从查询结果中获取一行数据

        // 验证密码
        if (password_verify($password, $user['password'])) {
            // 生成 JWT 令牌
            $jwtSecret = "my_secret_key"; // 更换为你的密钥
            $issuedAt = time();
            $expirationTime = $issuedAt + 3600; // 令牌有效期为1小时

            $payload = array(
                "id" => $user['id'], // 将用户ID加入 payload
                "username" => $username,
                "iat" => $issuedAt,
                "exp" => $expirationTime
            );

            $token = JWT::encode($payload, $jwtSecret, 'HS256');

            // 返回 token 给客户端
            success("登录成功", $token);
        } else {
          error("密码不匹配");
        }
    } else {
      error("用户不存在");
    }

    // 关闭预处理语句
    $stmt->close();
} else {
    error("用户名和密码不能为空");
}

// 关闭连接
$conn->close();
?>
