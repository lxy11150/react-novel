<?php
include '../mysqli.php';
include '../global.php';
include '../token.php';  // 添加令牌验证相关代码

$conn = connectDatabase();

// 获取令牌
$token = null;
$headers = getallheaders();
if (isset($headers['Authorization'])) {
    $authorizationHeader = $headers['Authorization'];
    list($token) = sscanf($authorizationHeader, 'Bearer %s');
}

// 验证令牌
if ($token && verifyToken($token)) {
    // 获取前端传递的 userId（通过 GET 请求）
    $userId = isset($_GET['userId']) ? $_GET['userId'] : 0;

    // 验证数据是否有效
    if ($userId <= 0) {
        // 发送错误响应
        error("无效的 userId");
    } else {
        try {
            // 使用预处理语句查询 recommend 表中符合 userId 的数据
            $recommendStmt = $conn->prepare("SELECT novel_id FROM recommend WHERE user_id = ?");
            $recommendStmt->bind_param("i", $userId);
            $recommendStmt->execute();
            $recommendResult = $recommendStmt->get_result();
            $recommendData = $recommendResult->fetch_all(MYSQLI_ASSOC);
            $recommendStmt->close();

            // 初始化小说信息数组
            $novelInfo = array();

            // 如果 recommend 表中存在符合 userId 的数据，则继续查询其他表
            if (!empty($recommendData)) {
                // 构建一个包含所有 novel_id 的数组
                $novelIds = array_column($recommendData, 'novel_id');

                // 遍历每个 novel_id 查询对应的数据
                foreach ($novelIds as $novelId) {
                    // 使用预处理语句查询 rank 表中符合 novel_id 的数据
                    $rankStmt = $conn->prepare("SELECT * FROM `rank` WHERE id = ?");
                    $rankStmt->bind_param("i", $novelId);
                    $rankStmt->execute();
                    $rankResult = $rankStmt->get_result();
                    $rankData = $rankResult->fetch_assoc();
                    $rankStmt->close();

                    // 使用预处理语句查询 novels 表中符合 id 的数据
                    $novelsStmt = $conn->prepare("SELECT book FROM novels WHERE id = ?");
                    $novelsStmt->bind_param("i", $novelId);
                    $novelsStmt->execute();
                    $novelsResult = $novelsStmt->get_result();
                    $novelData = $novelsResult->fetch_assoc();
                    $novelsStmt->close();

                    // 使用预处理语句查询 comment 表中符合 novel_id 的数据总数
                    $commentTotalStmt = $conn->prepare("SELECT COUNT(*) as commentTotal FROM comment WHERE novel_id = ?");
                    $commentTotalStmt->bind_param("i", $novelId);
                    $commentTotalStmt->execute();
                    $commentTotalResult = $commentTotalStmt->get_result();
                    $commentTotalData = $commentTotalResult->fetch_assoc();
                    $commentTotalStmt->close();

                    // 添加到数组中
                    $novelInfo[] = array(
                        'id' => $novelId,
                        'book' => $novelData['book'],
                        'likes' => $rankData['likes'],
                        'click' => $rankData['click'],
                        'collect' => $rankData['collect'],
                        'recommend' => $rankData['recommend'],
                        'total' => $commentTotalData['commentTotal'],
                        'key' => $novelId
                    );
                }
            }

            // 整合数据并返回给前端
            $response = $novelInfo;

            // 发送成功响应
            success("查询结果", $response);
        } catch (Exception $e) {
            // 发送错误响应
            error("发生异常：" . $e->getMessage());
        }
    }
} else {
    // 发送令牌验证失败的错误响应
    error("令牌验证失败");
}
?>
