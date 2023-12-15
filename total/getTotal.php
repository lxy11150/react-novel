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
            // 使用预处理语句查询 comment 表中符合 userId 的数据总数
            $commentStmt = $conn->prepare("SELECT COUNT(*) as commentTotal FROM comment WHERE user_id = ?");
            $commentStmt->bind_param("i", $userId);
            $commentStmt->execute();
            $commentResult = $commentStmt->get_result();
            $commentData = $commentResult->fetch_assoc();
            $commentStmt->close();

            // 使用预处理语句查询 reply 表中符合 userId 的数据总数
            $replyStmt = $conn->prepare("SELECT COUNT(*) as replyTotal FROM reply WHERE user_id = ?");
            $replyStmt->bind_param("i", $userId);
            $replyStmt->execute();
            $replyResult = $replyStmt->get_result();
            $replyData = $replyResult->fetch_assoc();
            $replyStmt->close();

            // 使用预处理语句查询 shelf 表中符合 userId 的数据总数
            $shelfStmt = $conn->prepare("SELECT COUNT(*) as shelfTotal FROM shelf WHERE user_id = ?");
            $shelfStmt->bind_param("i", $userId);
            $shelfStmt->execute();
            $shelfResult = $shelfStmt->get_result();
            $shelfData = $shelfResult->fetch_assoc();
            $shelfStmt->close();

            // 使用预处理语句查询 praise 表中符合 userId 的数据总数
            $praiseStmt = $conn->prepare("SELECT COUNT(*) as praiseTotal FROM praise WHERE user_id = ?");
            $praiseStmt->bind_param("i", $userId);
            $praiseStmt->execute();
            $praiseResult = $praiseStmt->get_result();
            $praiseData = $praiseResult->fetch_assoc();
            $praiseStmt->close();

            // 使用预处理语句查询 comment 表和 reply 表中符合 userId 的数据的 id
            $idStmt = $conn->prepare("SELECT id FROM comment WHERE user_id = ? UNION SELECT id FROM reply WHERE user_id = ?");
            $idStmt->bind_param("ii", $userId, $userId);
            $idStmt->execute();
            $idResult = $idStmt->get_result();
            $idData = $idResult->fetch_all(MYSQLI_ASSOC);
            $idStmt->close();

            // 初始化点赞总数
            $likesTotal = 0;

            // 使用预处理语句查询 praise 表中符合条件的数据总数（target 为 2 或 3 且 target_id 匹配）
            if (!empty($idData)) {
                $likesStmt = $conn->prepare("SELECT COUNT(*) as likesTotal FROM praise WHERE (target = 2 OR target = 3) AND target_id IN (?)");
                $ids = implode(',', array_column($idData, 'id'));
                $likesStmt->bind_param("s", $ids);
                $likesStmt->execute();
                $likesResult = $likesStmt->get_result();
                $likesData = $likesResult->fetch_assoc();
                $likesStmt->close();

                $likesTotal = $likesData['likesTotal'];
            }

            // 整合数据并返回给前端
            $response = array(
                'commentTotal' => $commentData['commentTotal'] + $replyData['replyTotal'],
                'shelfTotal' => $shelfData['shelfTotal'],
                'praiseTotal' => $praiseData['praiseTotal'],
                'likesTotal' => $likesTotal
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
