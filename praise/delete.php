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

        // 获取 user_id、target 和 target_ids
        $userId = isset($data['userId']) ? $data['userId'] : 0;
        $target = isset($data['target']) ? $data['target'] : 0;
        $targetIds = isset($data['targetIds']) ? $data['targetIds'] : [];

        // 验证数据是否有效
        if ($userId <= 0 || $target <= 0 || $target > 3 || empty($targetIds)) {
            // 发送错误响应
            error("无效的用户 ID、目标值或目标 ID 数组");
        } else {
            // 构建 IN 子句的占位符
            $placeholders = implode(',', array_fill(0, count($targetIds), '?'));

            // 使用预处理语句删除 praise 表中符合条件的数据
            $deleteStmt = $conn->prepare("DELETE FROM praise WHERE user_id = ? AND target = ? AND target_id IN ($placeholders)");
            
            // 绑定参数
            $deleteStmt->bind_param(str_repeat('i', count($targetIds) + 2), $userId, $target, ...$targetIds);

            $result = $deleteStmt->execute();
            $deleteStmt->close();

            if ($result) {
                // 发送成功响应
                success("取消点赞成功", null);
            } else {
                // 发送错误响应
                error("取消点赞失败");
            }
        }
    } catch (Exception $e) {
        error("发生异常：" . $e->getMessage());
    }
} else {
    error("未提供令牌");
}
?>
