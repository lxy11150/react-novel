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
        // 获取前端传递的 JSON 数据
        $json_data = file_get_contents('php://input');
        $data = json_decode($json_data, true);

        // 获取 userId 和 novelId
        $userId = isset($data['userId']) ? $data['userId'] : 0;
        $novelId = isset($data['novelId']) ? $data['novelId'] : 0;

        // 验证数据是否有效
        if ($userId <= 0 || $novelId <= 0) {
            // 发送错误响应
            error("无效的 userId 或 novelId");
        }else{
            // 使用预处理语句查询 shelf 表中是否存在记录
            $stmt = $conn->prepare("SELECT 1 FROM shelf WHERE user_id = ? AND novel_id = ?");
            $stmt->bind_param("ii", $userId, $novelId);
            $stmt->execute();
            $stmt->store_result();
            $result = $stmt->num_rows > 0;
            $stmt->close();
    
            // 返回查询结果给前端
            echo json_encode($result);
            }
    } catch (Exception $e) {
        error("发生异常：" . $e->getMessage());
    }
} else {
    error("未提供令牌");
}
?>
