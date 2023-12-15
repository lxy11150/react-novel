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
            // 使用预处理语句查询评论信息
            $stmt = $conn->prepare("SELECT * FROM comment WHERE user_id = ? ORDER BY time DESC");
            $stmt->bind_param("i", $userId);
            $stmt->execute();
            $result = $stmt->get_result();
            
            // 获取查询结果
            $comments = $result->fetch_all(MYSQLI_ASSOC);
            
            // 关闭语句
            $stmt->close();

            // 初始化评论列表
            $commentList = array();

            // 遍历评论信息
            foreach ($comments as $comment) {
                // 获取 novel_id 和 chapter_id
                $novelId = $comment['novel_id'];
                $chapterId = $comment['chapter_id'];

                // 使用预处理语句查询小说信息
                $novelStmt = $conn->prepare("SELECT book FROM novels WHERE id = ?");
                $novelStmt->bind_param("i", $novelId);
                $novelStmt->execute();
                $novelResult = $novelStmt->get_result();
                
                // 获取小说信息
                $novelInfo = $novelResult->fetch_assoc();
                
                // 关闭小说语句
                $novelStmt->close();

                // 使用预处理语句查询章节信息
                $chapterStmt = $conn->prepare("SELECT title FROM chapter WHERE id = ?");
                $chapterStmt->bind_param("i", $chapterId);
                $chapterStmt->execute();
                $chapterResult = $chapterStmt->get_result();
                
                // 获取章节信息
                $chapterInfo = $chapterResult->fetch_assoc();
                
                // 关闭章节语句
                $chapterStmt->close();

                // 构建评论信息数组
                $commentInfo = array(
                    'comment_id' => $comment['id'],
                    'novel_id' => $novelId,
                    'book' => $novelInfo['book'],
                    'chapter_id' => $chapterId,
                    'title' => $chapterInfo['title'],
                    'content' => $comment['content'],
                    'time' => $comment['time'],
                    'likes' => $comment['likes'],
                    'key' => $comment['id']
                );

                // 添加到评论列表
                $commentList[] = $commentInfo;
            }

            // 整合数据并返回给前端
            $response = $commentList;

            success("查询结果", $response);
        }
    } catch (Exception $e) {
        error("发生异常：" . $e->getMessage());
    }
} else {
    error("未提供令牌");
}
?>
