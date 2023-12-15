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
            error("无效的 userId");
        } else {
            // 使用预处理语句查询 log 表中符合 userId 的记录
            $stmt = $conn->prepare("SELECT * FROM `log` WHERE user_id = ? ORDER BY time DESC");
            $stmt->bind_param("i", $userId);
            $stmt->execute();
            $result = $stmt->get_result();
            
            // 获取查询结果
            $shelfResults = $result->fetch_all(MYSQLI_ASSOC);
            
            // 关闭语句
            $stmt->close();

            // 初始化结果数组
            $response = array();

            foreach ($shelfResults as $shelfItem) {
                $novelId = $shelfItem['novel_id'];

                // 从 novels 表中获取小说信息
                $novelStmt = $conn->prepare("SELECT * FROM novels WHERE id = ?");
                $novelStmt->bind_param("i", $novelId);
                $novelStmt->execute();
                $novelResult = $novelStmt->get_result();
                $novelInfo = $novelResult->fetch_assoc();
                $novelStmt->close();

                // 从 chapter 表中获取与之匹配的最后一条数据的章节名 title
                $lastChapterStmt = $conn->prepare("SELECT title FROM chapter WHERE novelId = ? ORDER BY id DESC LIMIT 1");
                $lastChapterStmt->bind_param("i", $novelId);
                $lastChapterStmt->execute();
                $lastChapterResult = $lastChapterStmt->get_result();  
                $lastChapterInfo = $lastChapterResult->fetch_assoc();
                $lastChapterStmt->close();

                $totalStmt = $conn->prepare("SELECT COUNT(*) as total FROM chapter WHERE novelId = ?");
                $totalStmt->bind_param("i", $novelId);
                $totalStmt->execute();
                $totalResult = $totalStmt->get_result();
                $totalInfo = $totalResult->fetch_assoc();
                $totalStmt->close();
                $total = $totalInfo['total'];

                // 构建小说信息
                $novelInfo['chapter'] = isset($lastChapterInfo['title']) ? $lastChapterInfo['title'] : '';
                $novelInfo['key'] = $shelfItem['novel_id'];
                $novelInfo['chapterId'] = $shelfItem['chapter_id'];
                $novelInfo['total'] = $total;

                // 将小说信息添加到结果数组
                $response[] = $novelInfo;
            }

            success("查询结果", $response);
        }
    } catch (Exception $e) {
        error("发生异常：" . $e->getMessage());
    }
} else {
    error("未提供令牌");
}
?>
