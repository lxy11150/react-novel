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
        // 获取前端传递的 GET 请求参数
        $userId = isset($_GET['userId']) ? $_GET['userId'] : 0;

        // 验证数据是否有效
        if ($userId <= 0) {
            // 发送错误响应
            error("无效的用户 ID");
        } else {
            // 使用预处理语句查询 reply 表中符合 user_id 的数据
            $replyStmt = $conn->prepare("SELECT * FROM reply WHERE user_id = ?");
            $replyStmt->bind_param("i", $userId);
            $replyStmt->execute();
            $replyResult = $replyStmt->get_result();
            
            // 获取查询结果
            $replyData = $replyResult->fetch_all(MYSQLI_ASSOC);
            
            // 关闭 reply 语句
            $replyStmt->close();

            // 初始化回复列表
            $replyList = array();

            // 遍历 reply 数据
            foreach ($replyData as $reply) {
                // 获取 forum_id
                $forumId = $reply['forum_id'];

                // 使用预处理语句查询 comment 表中符合 forum_id 的数据
                $commentStmt = $conn->prepare("SELECT content FROM comment WHERE id = ?");
                $commentStmt->bind_param("i", $forumId);
                $commentStmt->execute();
                $commentResult = $commentStmt->get_result();
                
                // 获取查询结果
                $commentData = $commentResult->fetch_assoc();
                
                // 关闭 comment 语句
                $commentStmt->close();

                // 构建回复信息数组
                $replyInfo = array(
                    'reply_id' => $reply['id'],
                    'forum_id' => $forumId,
                    'comment' => $commentData['content'],
                    'content' => $reply['content'],
                    'time' => $reply['time'],
                    'likes' => $reply['likes'],
                    'key' => $reply['id']
                );

                // 添加到回复列表
                $replyList[] = $replyInfo;
            }

            // 整合数据并返回给前端
            $response = $replyList;

            success("查询结果", $response);
        }
    } catch (Exception $e) {
        error("发生异常：" . $e->getMessage());
    }
} else {
    error("未提供令牌");
}
?>
