<?php
include '../mysqli.php';
include '../global.php';
include '../token.php';

$conn = connectDatabase();

// 获取 Authorization 头部信息
$token = null;
$headers = getallheaders();
if (isset($headers['Authorization'])) {
    $authorizationHeader = $headers['Authorization'];
    list($token) = sscanf($authorizationHeader, 'Bearer %s');
}

// 检查是否提供了令牌
if ($token && verifyToken($token)) {
    try {
        // 获取请求参数
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $pageSize = isset($_GET['pageSize']) ? (int)$_GET['pageSize'] : 10;

        // 构建查询条件
        $conditions = array();
        $bindTypes = "";
        $bindValues = array();

        // 处理可能为空的参数
        $classification = isset($_GET['classification']) ? $_GET['classification'] : null;
        $publish = isset($_GET['publish']) ? $_GET['publish'] : null;
        $type = isset($_GET['type']) ? $_GET['type'] : null;
        $words = isset($_GET['words']) ? $_GET['words'] : null;

        // 构建查询条件和参数绑定
        if (!is_null($classification) && $classification !== '') {
            $conditions[] = "classification = ?";
            $bindTypes .= "i";
            $bindValues[] = $classification;
        }

        if (!is_null($publish) && $publish !== '') {
            $conditions[] = "publish = ?";
            $bindTypes .= "s";
            $bindValues[] = $publish;
        }

        if (!is_null($type) && $type !== '') {
            $conditions[] = "type = ?";
            $bindTypes .= "s";
            $bindValues[] = $type;
        }

        if (!is_null($words) && $words !== '') {
            // 解析前端传递的字数范围
            $rangeMap = [
                '全部' => null,
                '300万以上' => [300, null],
                '100万以上' => [100, null],
                '50万以上' => [50, null],
                '30万以下' => [null, 30],
                '100~300万' => [100, 300],
                '50~100万' => [50, 100],
                '30~50万' => [30, 50],
                // 其他范围映射
            ];
        
            // 解析范围字符串
            list($min, $max) = $rangeMap[$words];
        
            if (!empty($min)) {
                $conditions[] = "CAST(SUBSTRING_INDEX(words, '万字', 1) AS UNSIGNED) >= ?";
                $bindTypes .= "i";
                $bindValues[] = $min;
            }
            
            if (!empty($max)) {
                $conditions[] = "CAST(SUBSTRING_INDEX(words, '万字', 1) AS UNSIGNED) <= ?";
                $bindTypes .= "i";
                $bindValues[] = $max;
            }
        }

        // 构建 WHERE 子句
        $whereClause = !empty($conditions) ? "WHERE " . implode(" AND ", $conditions) : "";

        // 计算偏移量
        $offset = ($page - 1) * $pageSize;

        // 构建查询总记录数的 SQL
        $totalQuerySQL = "SELECT COUNT(*) as total FROM novels $whereClause";
        $totalQuery = $conn->prepare($totalQuerySQL);

        // 绑定参数类型和值
        if (!empty($bindValues)) {
          $totalQuery->bind_param($bindTypes, ...$bindValues);
        }

        // 执行总记录数查询
        $totalQuery->execute();
        $totalResult = $totalQuery->get_result();
        $total = $totalResult->fetch_assoc()['total'];

        // 构建查询分页数据的 SQL
        $selectSQL = "SELECT * FROM novels $whereClause LIMIT ?, ?";
        $stmt = $conn->prepare($selectSQL);

        // 绑定参数类型和值
        $bindTypes .= "i";
        $bindValues[] = $offset;
        $bindTypes .= "i";
        $bindValues[] = $pageSize;
        if (!empty($bindValues)) {
            $stmt->bind_param($bindTypes, ...$bindValues);
        }

        // 执行查询分页数据
        $stmt->execute();
        $result = $stmt->get_result();

        // 遍历分页数据结果集，获取每个小说的 collect 属性
        $rows = $result->fetch_all(MYSQLI_ASSOC);
        foreach ($rows as &$row) {
            $novelId = $row['id'];
        
            // 查询 rank 表获取 collect 属性
            $collectQuery = $conn->prepare("SELECT collect FROM `rank` WHERE id = ?");
            $collectQuery->bind_param("i", $novelId);
            $collectQuery->execute();
            $collectResult = $collectQuery->get_result();
            $collectData = $collectResult->fetch_assoc();
        
            // 将 collect 加入到当前小说的数据中
            $row['collect'] = $collectData ? $collectData['collect'] : null;
        
            // 关闭 collect 查询
            $collectQuery->close();
        }

        // 构建返回数据结构
        $response = [
            "code" => 200,
            "data" => [
                "rows" => $rows,
                "total" => $total
            ],
            "msg" => "小说分页数据"
        ];

        // 返回 JSON 数据
        header("Content-Type: application/json");
        echo json_encode($response);

        // 关闭连接
        $stmt->close();
        $totalQuery->close();
        $conn->close();
    } catch (Exception $e) {
        error("无效的令牌");
    }
} else {
    error("未提供令牌");
}
?>
