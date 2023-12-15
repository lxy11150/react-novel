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
        $target = isset($_GET['target']) ? $_GET['target'] : 0;

        // 验证数据是否有效
        if ($userId <= 0 || $target <= 0 || $target > 3) {
            // 发送错误响应
            error("无效的用户 ID 或目标值");
        } else {
            // 使用预处理语句查询 praise 表中符合 user_id 和 target 的数据
            $praiseStmt = $conn->prepare("SELECT target_id FROM praise WHERE user_id = ? AND target = ?");
            $praiseStmt->bind_param("ii", $userId, $target);
            $praiseStmt->execute();
            $praiseResult = $praiseStmt->get_result();
            
            // 获取查询结果
            $praiseData = $praiseResult->fetch_all(MYSQLI_ASSOC);
            
            // 关闭 praise 语句
            $praiseStmt->close();

            // 初始化返回结果数组
            $response = array();

            // 根据 target 的值进行不同的查询和处理
            foreach ($praiseData as $praise) {
                $targetId = $praise['target_id'];

                if ($target == 1) {
                    // 若 target 为 1，去 rank 表中找到 id 与 target_id 匹配的数据
                    $rankStmt = $conn->prepare("SELECT * FROM `rank` WHERE id = ?");
                    $rankStmt->bind_param("i", $targetId);
                    $rankStmt->execute();
                    $rankResult = $rankStmt->get_result();
                    $rankData = $rankResult->fetch_assoc();
                    $rankStmt->close();

                    if ($rankData) {
                        // 在 comment 表中查询 novel_id 与 rank 表匹配的数据总数
                        $commentStmt = $conn->prepare("SELECT COUNT(*) as total FROM comment WHERE novel_id = ?");
                        $commentStmt->bind_param("i", $targetId);
                        $commentStmt->execute();
                        $commentResult = $commentStmt->get_result();
                        $commentData = $commentResult->fetch_assoc();
                        $commentStmt->close();

                        // 使用预处理语句查询 novels 表中符合 id 的小说名字
                        $novelNameStmt = $conn->prepare("SELECT book FROM novels WHERE id = ?");
                        $novelNameStmt->bind_param("i", $targetId);
                        $novelNameStmt->execute();
                        $novelNameResult = $novelNameStmt->get_result();
                        
                        // 获取查询结果
                        $novelNameData = $novelNameResult->fetch_assoc();
                    
                        // 关闭 novelName 语句
                        $novelNameStmt->close();

                        $rankData['total'] = $commentData['total'];
                        $rankData['book'] = $novelNameData['book'];
                        $rankData['targetId'] = $targetId;
                        $rankData['key'] = $targetId;

                        $response[] = $rankData;
                    }
                } elseif ($target == 2) {
                    // 若 target 为 2，去 comment 表中找到 id 与 target_id 匹配的数据
                    $commentStmt = $conn->prepare("SELECT * FROM comment WHERE id = ?");
                    $commentStmt->bind_param("i", $targetId);
                    $commentStmt->execute();
                    $commentResult = $commentStmt->get_result();
                    $commentData = $commentResult->fetch_assoc();
                    $commentStmt->close();

                    if ($commentData) {
                        // 在 user 表中查询对应的姓名 username
                        $userStmt = $conn->prepare("SELECT username FROM user WHERE id = ?");
                        $userStmt->bind_param("i", $commentData['user_id']);
                        $userStmt->execute();
                        $userData = $userStmt->get_result()->fetch_assoc();
                        $userStmt->close();

                        $commentData['targetId'] = $targetId;
                        $commentData['key'] = $targetId;
                        $commentData['username'] = $userData['username'];

                        $response[] = $commentData;
                    }
                } elseif ($target == 3) {
                    // 若 target 为 3，去 reply 表中找到 id 与 target_id 匹配的数据
                    $replyStmt = $conn->prepare("SELECT * FROM reply WHERE id = ?");
                    $replyStmt->bind_param("i", $targetId);
                    $replyStmt->execute();
                    $replyResult = $replyStmt->get_result();
                    $replyData = $replyResult->fetch_assoc();
                    $replyStmt->close();

                    if ($replyData) {
                        // 在 user 表中查询对应的姓名 username
                        $userStmt = $conn->prepare("SELECT username FROM user WHERE id = ?");
                        $userStmt->bind_param("i", $replyData['user_id']);
                        $userStmt->execute();
                        $userData = $userStmt->get_result()->fetch_assoc();
                        $userStmt->close();

                        // 构建返回结果
                        $replyData['targetId'] = $targetId;
                        $replyData['key'] = $targetId;
                        $replyData['username'] = $userData['username'];

                        $response[] = $replyData;
                    }
                }
            }

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
