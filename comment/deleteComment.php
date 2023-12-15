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

        // 获取评论 ID 数组
        $commentIds = isset($data['commentIds']) ? $data['commentIds'] : array();

        // 验证数据是否有效
        if (empty($commentIds)) {
            // 发送错误响应
            error("评论 ID 数组为空");
        } else {
            // 开启事务处理
            $conn->begin_transaction();

            try {
                // 循环处理每个评论 ID
                foreach ($commentIds as $commentId) {
                    // 使用预处理语句删除 comment 表中的数据
                    $commentStmt = $conn->prepare("DELETE FROM comment WHERE id = ?");
                    $commentStmt->bind_param("i", $commentId);
                    $commentResult = $commentStmt->execute();

                    // 关闭 comment 语句
                    $commentStmt->close();

                    if (!$commentResult) {
                        throw new Exception("删除评论数据失败");
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
