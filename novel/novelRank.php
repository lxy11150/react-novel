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
        if (isset($_GET['nav'])) {
            $nav = $_GET['nav'];

            $sqlResults = array();

            switch ($nav) {
                case 'likes':
                case 'click':
                case 'collect':
                case 'recommend':
                    $rankResults = executeQuery("SELECT * FROM `rank` ORDER BY $nav DESC LIMIT 8");
                    $sqlResults[$nav] = addNovelInfo($rankResults, $nav);
                    break;

                case 'finish':
                    $novelResults = executeQuery("SELECT * FROM novels WHERE publish = '完结' LIMIT 8");
                    $sqlResults[$nav] = $novelResults;
                    break;

                case 'platform':
                    $novelResults = executeQuery("SELECT * FROM novels ORDER BY id LIMIT 8");
                    $sqlResults[$nav] = $novelResults;
                    break;

                case 'default':
                    // Execute all cases and store results in the array
                    $rankLikes = executeQuery("SELECT * FROM `rank` ORDER BY likes DESC LIMIT 8");
                    $rankClick = executeQuery("SELECT * FROM `rank` ORDER BY click DESC LIMIT 8");
                    $rankCollect = executeQuery("SELECT * FROM `rank` ORDER BY collect DESC LIMIT 8");
                    $rankRecommend = executeQuery("SELECT * FROM `rank` ORDER BY recommend DESC LIMIT 8");

                    $sqlResults['likes'] = addNovelInfo($rankLikes, 'likes');
                    $sqlResults['click'] = addNovelInfo($rankClick, 'click');
                    $sqlResults['collect'] = addNovelInfo($rankCollect, 'collect');
                    $sqlResults['recommend'] = addNovelInfo($rankRecommend, 'recommend');

                    $novelFinish = executeQuery("SELECT * FROM novels WHERE publish = '完结' LIMIT 8");
                    $novelPlatform = executeQuery("SELECT * FROM novels ORDER BY id LIMIT 8");

                    $sqlResults['finish'] = $novelFinish;
                    $sqlResults['platform'] = $novelPlatform;
                    break;

                default:
                    error("未知的 nav 参数");
                    exit;
            }

            success("查询结果", $sqlResults);
        } else {
            error("未提供 nav 参数");
        }
    } catch (Exception $e) {
        error("无效的令牌");
    }
} else {
    error("未提供令牌");
}

$conn->close();

function addNovelInfo($rankResults, $nav)
{
    global $conn;

    $resultWithNovelInfo = array();

    foreach ($rankResults as $rankRow) {
        $novelId = $rankRow['id'];
        $novelInfo = executeQuery("SELECT * FROM novels WHERE id = $novelId LIMIT 1");

        if (!empty($novelInfo)) {
            // If novel info is found, add it to the result array
            $resultWithNovelInfo[] = array_merge($novelInfo[0], array('data' => $rankRow[$nav]));
        }
    }

    return $resultWithNovelInfo;
}

function executeQuery($sql)
{
    global $conn;

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $data = array();

        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        return $data;
    } else {
        return array(); // Return an empty array if no data is found
    }
}
?>
