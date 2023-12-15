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
        // 获取前端传递的 DELETE 请求参数
        $json_data = file_get_contents('php://input');
        $data = json_decode($json_data, true);

        // 验证数据是否为数组
        if (!is_array($data)) {
            // 发送错误响应
            error("无效的请求数据");
        }

        // 初始化成功删除的记录数
        $successCount = 0;

        foreach ($data as $item) {
            // 获取 userId 和 novelId
            $userId = isset($item['userId']) ? $item['userId'] : 0;
            $novelId = isset($item['novelId']) ? $item['novelId'] : 0;

            // 验证数据是否有效
            if ($userId > 0 && $novelId > 0) {
                // 使用预处理语句删除 shelf 表中符合 userId 和 novelId 的记录
                $stmt = $conn->prepare("DELETE FROM shelf WHERE user_id = ? AND novel_id = ?");
                $stmt->bind_param("ii", $userId, $novelId);
                $result = $stmt->execute();
                $stmt->close();

                if ($result) {
                    $successCount++;
                }
            }
        }

        // 发送成功响应
        success("成功删除 {$successCount} 条书架信息", null);

    } catch (Exception $e) {
        error("发生异常：" . $e->getMessage());
    }
} else {
    error("未提供令牌");
}
?>
