<?php
include '../mysqli.php';
include '../global.php';
include '../token.php';

$conn = connectDatabase();

$token = null;
$headers = getallheaders();
if (isset($headers['Authorization'])) {
    $authorizationHeader = $headers['Authorization'];
    list($token) = sscanf($authorizationHeader, 'Bearer %s');
}

if ($token && verifyToken($token)) {
    try {
        // 获取前端传递的 JSON 数据
        $json_data = file_get_contents('php://input');
        $data = json_decode($json_data, true);

        // 获取 userId 和 novelId
        $userId = isset($data['userId']) ? $data['userId'] : 0;
        $novelId = isset($data['novelId']) ? $data['novelId'] : 0;

        // 验证数据是否有效
        if ($userId <= 0 || $novelId <= 0) {
            // 发送错误响应
            error("无效的 userId 或 novelId");
        } else {
            // 使用预处理语句插入数据到 recommend 表
            $insertStmt = $conn->prepare("INSERT INTO recommend (user_id, novel_id) VALUES (?, ?)");
            $insertStmt->bind_param("ii", $userId, $novelId);
            $result = $insertStmt->execute();
            $insertStmt->close();

            if ($result) {
                // 发送成功响应
                success("成功向 recommend 表中插入数据", null);
            } else {
                // 发送错误响应
                error("插入数据失败");
            }
        }
    } catch (Exception $e) {
        error("发生异常：" . $e->getMessage());
    }
} else {
    error("未提供令牌");
}
?>
