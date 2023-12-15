<?php
include '../mysqli.php';
include '../global.php';
include '../token.php';

$conn = connectDatabase();

// 获取 userId
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

        // 初始化 classification=0 和 classification=1 的计数
        $classification0Count = 0;
        $classification1Count = 0;

        // 如果 recommend 数据不为空，则查询对应的小说信息
        if (!empty($recommendData)) {
            // 构建一个包含所有 novel_id 的数组
            $novelIds = array_column($recommendData, 'novel_id');

            // 使用预处理语句查询 novels 表中符合 novel_id 和 classification=0 的数据总数
            $classification0Stmt = $conn->prepare("SELECT COUNT(*) as count FROM novels WHERE id IN (?) AND classification = 0");
            $novelIdsString = implode(',', $novelIds);
            $classification0Stmt->bind_param("s", $novelIdsString);
            $classification0Stmt->execute();
            $classification0Result = $classification0Stmt->get_result();
            $classification0Data = $classification0Result->fetch_assoc();
            $classification0Stmt->close();


            // 使用预处理语句查询 novels 表中符合 novel_id 和 classification=1 的数据总数
            $classification1Stmt = $conn->prepare("SELECT COUNT(*) as count FROM novels WHERE id IN (?) AND classification = 1");
            $classification1Stmt->bind_param("s", $novelIdsString);
            $classification1Stmt->execute();
            $classification1Result = $classification1Stmt->get_result();
            $classification1Data = $classification1Result->fetch_assoc();
            $classification1Stmt->close();

            // 获取分类计数
            $classification0Count = $classification0Data['count'];
            $classification1Count = $classification1Data['count'];
        }

        // 整合数据并返回给前端
        $response = array(
            'total' => $classification0Count + $classification1Count,
            'male' => $classification0Count,
            'female' => $classification1Count
        );

        // 发送成功响应
        success("查询结果", $response);
    } catch (Exception $e) {
        // 发送错误响应
        error("发生异常：" . $e->getMessage());
    }
}
?>
