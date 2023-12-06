<?php
include '../mysqli.php';
include '../global.php';
require __DIR__ . '/../vendor/autoload.php'; // 引入 Firebase JWT 库

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
        // 获取小说列表信息
        $stmt = $conn->prepare("SELECT * FROM novels WHERE id < 375 ORDER BY RAND() LIMIT 5");

        // 执行预处理语句
        $stmt->execute();

        // 获取查询结果
        $result = $stmt->get_result();

        // 检查小说数据是否存在
        if ($result->num_rows > 0) {
            $novels = array();

            // 遍历所有行并将它们添加到小说数组中
            while ($row = $result->fetch_assoc()) {
                $novels[] = $row;
            }

            // 返回小说列表给客户端
            success("小说列表", $novels);
        } else {
            error("未找到小说");
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
