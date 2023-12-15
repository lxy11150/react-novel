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
        // 获取 userId
        $userId = isset($_GET['userId']) ? $_GET['userId'] : 0;

        // 验证数据是否有效
        if ($userId <= 0) {
            // 发送错误响应
            error("无效的 userId");
        } else {
            // Calculate the timestamp one week ago
            $oneWeekAgo = strtotime('week');

            // 使用预处理语句查询 comment 表中一周内符合 userId 和 time 限制的数据总数
            $commentStmt = $conn->prepare("SELECT COUNT(*) as commentCount FROM comment WHERE user_id = ? AND time > ?");
            $commentStmt->bind_param("ii", $userId, $oneWeekAgo);
            $commentStmt->execute();
            $commentResult = $commentStmt->get_result();
            $commentData = $commentResult->fetch_assoc();
            $commentStmt->close();

            // 使用预处理语句查询 reply 表中一周内符合 userId 和 time 限制的数据总数
            $replyStmt = $conn->prepare("SELECT COUNT(*) as replyCount FROM reply WHERE user_id = ? AND time > ?");
            $replyStmt->bind_param("ii", $userId, $oneWeekAgo);
            $replyStmt->execute();
            $replyResult = $replyStmt->get_result();
            $replyData = $replyResult->fetch_assoc();
            $replyStmt->close();

            // 整合数据并返回给前端
            $response = array(
                'total' => $commentData['commentCount'] + $replyData['replyCount'],
                'commentCount' => $commentData['commentCount'],
                'replyCount' => $replyData['replyCount']
            );

            // 发送成功响应
            success("查询结果", $response);
        }
    } catch (Exception $e) {
        error("发生异常：" . $e->getMessage());
    }
} else {
    error("未提供令牌");
}
?>
