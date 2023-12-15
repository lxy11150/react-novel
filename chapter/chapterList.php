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

function executePreparedQuery($sql, $params = array()) {
    global $conn;

    $stmt = $conn->prepare($sql);

    if ($stmt) {
        if (!empty($params)) {
            $types = str_repeat('s', count($params));
            $stmt->bind_param($types, ...$params);
        }

        $stmt->execute();
        $result = $stmt->get_result();

        if ($result) {
            $data = $result->fetch_all(MYSQLI_ASSOC);
            $stmt->close();
            return $data;
        }
    }

    return array();
}

if ($token && verifyToken($token)) {
    try {
        if (isset($_GET['id'])) {
            $novelId = $_GET['id'];

            // 查询 chapter 表中符合 novelId 的所有 title 信息（使用预处理语句）
            $titleResults = executePreparedQuery("SELECT title FROM chapter WHERE novelId = ?", array($novelId));

            if (!empty($titleResults)) {
                // 整理数据并返回给前端
                $response = array_column($titleResults, 'title');

                success("查询结果", $response);
            } else {
                error("未找到符合条件的数据");
            }
        } else {
            error("未提供 id 参数");
        }
    } catch (Exception $e) {
        error("无效的令牌");
    }
} else {
    error("未提供令牌");
}
?>
