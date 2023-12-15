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
        // 获取前端传递的 PUT 请求参数
        $json_data = file_get_contents('php://input');
        $data = json_decode($json_data, true);

        // 获取 chapterId
        $chapterId = isset($data['chapterId']) ? $data['chapterId'] : 0;

        // 验证数据是否有效
        if ($chapterId < 0) {
            // 发送错误响应
            error("无效的 chapterId");
        }else{
            // 获取 userId 和 novelId
            $userId = isset($data['userId']) ? $data['userId'] : 0;
            $novelId = isset($data['novelId']) ? $data['novelId'] : 0;
    
            // 验证数据是否有效
            if ($userId <= 0 || $novelId <= 0) {
                // 发送错误响应
                error("无效的 userId 或 novelId");
            } else {
                // 使用预处理语句更新 shelf 表中符合 userId 和 novelId 的记录的 chapter_id
                $stmt = $conn->prepare("UPDATE shelf SET chapter_id = ? WHERE user_id = ? AND novel_id = ?");
                $stmt->bind_param("iii", $chapterId, $userId, $novelId);
                $result = $stmt->execute();
                $stmt->close();
        
                if ($result) {
                    // 发送成功响应
                    success("章节已成功更新", null);
                } else {
                    // 发送错误响应
                    error("更新章节失败");
                }
            }
        }
    } catch (Exception $e) {
        error("发生异常：" . $e->getMessage());
    }
} else {
    error("未提供令牌");
}
?>
