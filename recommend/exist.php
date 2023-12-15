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
        // 获取 userId 和 novelId
        $userId = isset($_GET['userId']) ? $_GET['userId'] : 0;
        $novelId = isset($_GET['novelId']) ? $_GET['novelId'] : 0;

        // 验证数据是否有效
        if ($userId <= 0 || $novelId <= 0) {
            // 发送错误响应
            error("无效的 userId 或 novelId");
        } else {
            // 使用预处理语句查询 recommend 表中符合条件的数据
            $stmt = $conn->prepare("SELECT * FROM recommend WHERE user_id = ? AND novel_id = ?");
            $stmt->bind_param("ii", $userId, $novelId);
            $stmt->execute();
            $result = $stmt->get_result();
            
            // 获取查询结果
            $recommendData = $result->fetch_assoc();
            
            // 关闭语句
            $stmt->close();

            // 发送成功响应
            success("查询结果", $recommendData !== null);
        }
    } catch (Exception $e) {
        error("发生异常：" . $e->getMessage());
    }
} else {
    error("未提供令牌");
}
?>
