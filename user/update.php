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

        // 获取用户 ID
        $userId = isset($data['id']) ? $data['id'] : 0;

        // 验证数据是否有效
        if ($userId <= 0) {
            // 发送错误响应
            error("无效的用户 ID");
        } else {
            // 使用预处理语句查询用户信息
            $stmt = $conn->prepare("SELECT * FROM user WHERE id = ?");
            $stmt->bind_param("i", $userId);
            $stmt->execute();
            $result = $stmt->get_result();
            
            // 获取查询结果
            $user = $result->fetch_assoc();
            
            // 关闭语句
            $stmt->close();

            // 检查是否找到用户
            if (!$user) {
                error("未找到对应的用户");
            } else {
                // 获取更新的字段
                $email = isset($data['email']) ? $data['email'] : $user['email'];
                $gender = isset($data['gender']) ? $data['gender'] : $user['gender'];
                $intro = isset($data['intro']) ? $data['intro'] : $user['intro'];
                $username = isset($data['username']) ? $data['username'] : $user['username'];
    
                // 使用预处理语句更新用户信息
                $updateStmt = $conn->prepare("UPDATE user SET email = ?, gender = ?, intro = ?, username = ? WHERE id = ?");
                $updateStmt->bind_param("sisss", $email, $gender, $intro, $username, $userId);
                $updateResult = $updateStmt->execute();
                $updateStmt->close();
    
                if ($updateResult) {
                    // 发送成功响应
                    success("用户信息已成功更新", null);
                } else {
                    // 发送错误响应
                    error("更新用户信息失败");
                }
            }
        }
    } catch (Exception $e) {
        error("发生异常：" . $e->getMessage());
    }
} else {
    error("未提供令牌");
}
?>
