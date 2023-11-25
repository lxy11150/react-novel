<?php
include './mysqli.php';
include './global.php';

$conn = connectDatabase();

// 获取原始 JSON 数据
$json_data = file_get_contents("php://input");

// 解码 JSON 数据为 PHP 数组
$data = json_decode($json_data, true);

// 用户提交的数据
$email = isset($data['email']) ? $data['email'] : '';
$gender = isset($data['gender']) ? $data['gender'] : '';
$intro = isset($data['intro']) ? $data['intro'] : '';
$password = isset($data['password']) ? password_hash($data['password'], PASSWORD_BCRYPT) : ''; // bcrypt 加密
$username = isset($data['username']) ? $data['username'] : '';

// 检查必要的字段是否为空
if ($email !== '' && $gender !== '' && $intro !== '' && $password !== '' && $username !== '') {
    // 在插入数据之前检查用户名是否已经存在
    $checkStmt = $conn->prepare("SELECT id FROM user WHERE username = ?");
    $checkStmt->bind_param("s", $username);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();

    if ($checkResult->num_rows > 0) {
        // 用户名已存在，返回相应信息
        error("用户已存在");
    } else {
        // 用户名不存在，继续执行插入操作
        $insertStmt = $conn->prepare("INSERT INTO user (email, gender, intro, password, username) VALUES (?, ?, ?, ?, ?)");
        $insertStmt->bind_param("sisss", $email, $gender, $intro, $password, $username);

        // 执行插入操作
        if ($insertStmt->execute()) {
            success("注册成功", null);
        } else {
            error("网络出错了" . $insertStmt->error);
        }

        // 关闭插入语句
        $insertStmt->close();
    }

    // 关闭检查语句
    $checkStmt->close();
} else {
    error("数据不能为空");
}

// 关闭连接
$conn->close();
?>
