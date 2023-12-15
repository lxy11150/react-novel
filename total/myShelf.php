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
            // 计算一周前的时间戳
            $oneWeekAgo = strtotime('week');

            // 使用预处理语句查询 shelf 表中一周内符合 userId 和 time 限制的数据
            $shelfStmt = $conn->prepare("SELECT novel_id FROM shelf WHERE user_id = ? AND time > ?");
            $shelfStmt->bind_param("ii", $userId, $oneWeekAgo);
            $shelfStmt->execute();
            $shelfResult = $shelfStmt->get_result();
            $shelfData = $shelfResult->fetch_all(MYSQLI_ASSOC);
            $shelfStmt->close();

            // 初始化 male（classification=0） 和 female（classification=1） 的计数
            $maleCount = 0;
            $femaleCount = 0;

            // 如果 shelf 数据不为空，则查询对应的小说信息
            if (!empty($shelfData)) {
                // 构建一个包含所有 novel_id 的数组
                $novelIds = array_column($shelfData, 'novel_id');

                // 使用预处理语句查询 novels 表中符合 novel_id 的数据
                $novelsStmt = $conn->prepare("SELECT classification FROM novels WHERE id IN (" . implode(',', $novelIds) . ")");
                $novelsStmt->execute();
                $novelsResult = $novelsStmt->get_result();
                $novelsData = $novelsResult->fetch_all(MYSQLI_ASSOC);
                $novelsStmt->close();

                // 计算 male 和 female 的总数
                foreach ($novelsData as $novel) {
                    if ($novel['classification'] == 0) {
                        $maleCount++;
                    } elseif ($novel['classification'] == 1) {
                        $femaleCount++;
                    }
                }
            }

            // 整合数据并返回给前端
            $response = array(
                'total' => $maleCount + $femaleCount,
                'male' => $maleCount,
                'female' => $femaleCount
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
