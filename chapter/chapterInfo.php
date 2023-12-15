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
        if (isset($_GET['novelId']) && isset($_GET['id'])) {
            $novelId = $_GET['novelId'];
            $chapterId = $_GET['id'];

            // 查询 chapter 表中符合 novelId 的数据（使用预处理语句）
            $chapterResults = executePreparedQuery("SELECT * FROM chapter WHERE novelId = ?", array($novelId));

            // 查询 novels 表中符合 novelId 的小说名字（使用预处理语句）
            $novelInfoResults = executePreparedQuery("SELECT book FROM novels WHERE id = ? LIMIT 1", array($novelId));

            if (!empty($chapterResults) && !empty($novelInfoResults)) {
                // 根据 chapterId 获取对应的章节数据
                $selectedChapter = $chapterResults[$chapterId];

                if (!is_null($selectedChapter)) {
                    // 处理 content 字段
                    $paragraphs = explode("\n", $selectedChapter['content']);
                    $htmlContent = '';
                    foreach ($paragraphs as $paragraph) {
                        if (!empty($paragraph)) {
                            $htmlContent .= '<p>' . trim($paragraph) . '</p>';
                        }
                    }
                    $cleanedContent = preg_replace('/[0-9\n]+/', '', $htmlContent);

                    // 更新 content 字段
                    $selectedChapter['content'] = $cleanedContent;

                    // 整合数据并返回给前端
                    $response = array(
                        'novelId' => $novelId,
                        'name' => $novelInfoResults[0]['book'],
                        'chapter' => $selectedChapter
                    );

                    success("查询结果", $response);
                } else {
                    error("未找到对应的章节数据");
                }
            } else {
                error("未找到符合条件的数据");
            }
        } else {
            error("未提供 novelId 和 id 参数");
        }
    } catch (Exception $e) {
        error("无效的令牌");
    }
} else {
    error("未提供令牌");
}
?>
