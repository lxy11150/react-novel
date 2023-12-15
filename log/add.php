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

        // 获取 user_id 和 novel_id
        $userId = isset($data['userId']) ? $data['userId'] : 0;
        $novelId = isset($data['novelId']) ? $data['novelId'] : 0;
        $chapterId = isset($data['chapterId']) ? $data['chapterId'] : 0;

        // 验证数据是否有效
        if ($userId <= 0 || $novelId <= 0) {
            // 发送错误响应
            error("无效的 user_id 或 novel_id");
        } else {
            // 使用预处理语句插入数据到 log 表，如果唯一键冲突则更新
            $stmt = $conn->prepare("INSERT INTO `log` (user_id, novel_id, chapter_id, time) VALUES (?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE chapter_id = VALUES(chapter_id), time = NOW()");
            $stmt->bind_param("iii", $userId, $novelId, $chapterId);
            $result = $stmt->execute();
            $stmt->close();

            if ($result) {
                // 发送成功响应
                success("小说已成功添加到书架", null);
            } else {
                // 发送错误响应
                error("添加到书架失败");
            }
        }
    } catch (Exception $e) {
        error("发生异常：" . $e->getMessage());
    }
} else {
    error("未提供令牌");
}
?>
