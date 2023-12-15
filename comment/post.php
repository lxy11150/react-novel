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
        // 获取前端传递的JSON数据
        $json_data = file_get_contents('php://input');
        $data = json_decode($json_data, true);

        // 获取 JSON 数据中的字段值
        $content = isset($data['comment']) ? $data['comment'] : '';
        $novelId = isset($data['novelId']) ? $data['novelId'] : 0;
        $userId = isset($data['userId']) ? $data['userId'] : 0;
        $chapterId = isset($data['chapterId']) ? $data['chapterId'] : 0;
        
        // 验证数据是否有效
        if (empty(trim($content)) || $novelId <= 0 || $userId <= 0 || $chapterId <= 0) {
            // 发送错误响应
            error("无效的评论数据");
        } else{
            // 插入评论数据到comment表
            $insertCommentSql = "INSERT INTO comment (content, novel_id, user_id, chapter_id, time) VALUES (?, ?, ?, ?, NOW())";

            $stmt = $conn->prepare($insertCommentSql);
            if ($stmt) {
                $stmt->bind_param("siii", $content, $novelId, $userId, $chapterId);
                $result = $stmt->execute();
                $stmt->close();
    
                if ($result) {
                    // 发送成功响应
                    success("评论已成功添加", null);
                } else {
                    // 发送错误响应
                    error("评论添加失败");
                }
            } else {
                // 发送错误响应
                error("无法准备查询");
            }
        }
    } catch (Exception $e) {
        error("发生异常：" . $e->getMessage());
    }
} else {
    error("未提供令牌");
}
?>
