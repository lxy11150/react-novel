<?php
// 封装数据库连接
function connectDatabase() {
    // 允许所有域访问
    header("Access-Control-Allow-Origin: *");
  
    // 允许的请求方法 
    header("Access-Control-Allow-Methods: POST, GET, DELETE, PUT, OPTIONS");
  
    // 允许的请求头
    header("Access-Control-Allow-Headers: *");
  
    // 设置响应类型为 JSON
    header("Content-Type: application/json");
    
    $servername = "localhost";
    $username = "root";
    $password = "lxy3.1415926353";
    $dbname = "novel";
    // 创建连接
    $conn = new mysqli($servername, $username, $password, $dbname);
    // 检查连接是否成功
    if ($conn->connect_error) {
        die("连接失败: " . $conn->connect_error);
    }
    return $conn;
}