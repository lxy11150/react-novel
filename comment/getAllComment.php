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
        // 获取前端传递的数据
        $novelId = isset($_GET['novelId']) ? $_GET['novelId'] : 0;
        $page = isset($_GET['page']) ? $_GET['page'] : 1;

        $offset = ($page - 1) * 4;

        // 验证数据是否有效
        if ($novelId <= 0) {
            // 发送错误响应
            error("无效的novelId");
        } else{
            // 使用预处理语句查询comment表中符合chapterId的数据，并关联查询user表和chapter表
            $stmt = $conn->prepare("
                SELECT comment.*, user.username, chapter.title
                FROM comment
                JOIN user ON comment.user_id = user.id
                JOIN chapter ON comment.chapter_id = chapter.id
                WHERE comment.novel_id = ?
                ORDER BY comment.time DESC
                LIMIT ?,4
            ");
            $stmt->bind_param("ii", $novelId, $offset);
            $stmt->execute();
            $result = $stmt->get_result();
            
            // 获取查询结果
            $commentResults = $result->fetch_all(MYSQLI_ASSOC);
            
            // 关闭语句
            $stmt->close();

             // 获取评论总数
            $totalStmt = $conn->prepare("SELECT COUNT(*) as total FROM comment WHERE novel_id = ?");
            $totalStmt->bind_param("i", $novelId);
            $totalStmt->execute();
            $totalResult = $totalStmt->get_result();
            $total = $totalResult->fetch_assoc()['total'];
            
            // 关闭语句
            $totalStmt->close();
    
            // 整合数据并返回给前端
            // 整合数据并返回给前端
            $response = [
                "comment" => $commentResults,
                "total" => $total
            ];
    
            success("查询结果", $response);
            }
    } catch (Exception $e) {
        error("发生异常：" . $e->getMessage());
    }
} else {
    error("未提供令牌");
}
?>
