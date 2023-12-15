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

        // 获取回复 ID 数组
        $replyIds = isset($data['replyIds']) ? $data['replyIds'] : array();

        // 验证数据是否有效
        if (empty($replyIds)) {
            // 发送错误响应
            error("回复 ID 数组为空");
        } else {
            // 开启事务处理
            $conn->begin_transaction();

            try {
                // 循环处理每个回复 ID
                foreach ($replyIds as $replyId) {
                    // 使用预处理语句删除 reply 表中的数据
                    $stmt = $conn->prepare("DELETE FROM reply WHERE id = ?");
                    $stmt->bind_param("i", $replyId);
                    $result = $stmt->execute();

                    // 关闭语句
                    $stmt->close();

                    if (!$result) {
                        throw new Exception("删除回复数据失败");
                    }
                }

                // 提交事务
                $conn->commit();

                // 发送成功响应
                success("批量删除成功", null);
            } catch (Exception $e) {
                // 回滚事务
                $conn->rollback();

                // 发送错误响应
                error("发生异常：" . $e->getMessage());
            }
        }
    } catch (Exception $e) {
        error("发生异常：" . $e->getMessage());
    }
} else {
    error("未提供令牌");
}
?>
