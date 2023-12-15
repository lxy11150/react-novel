<?php

// require 'vendor/autoload.php';

// use Elastic\Elasticsearch\ClientBuilder;

// $client = ClientBuilder::create()
//     ->setHosts(['http://localhost:9200']) // 修改为你的 Elasticsearch 节点地址
//     ->build();

// // 连接 MySQL 数据库
// $mysqli = new mysqli('localhost', 'root', 'lxy3.1415926353', 'novel');

// if ($mysqli->connect_error) {
//     die('Connection Error (' . $mysqli->connect_errno . ') ' . $mysqli->connect_error);
// }

// // 从 MySQL 数据库中检索数据
// $result = $mysqli->query('SELECT * FROM novels');
// $novels = $result->fetch_all(MYSQLI_ASSOC);

// // 将数据索引到 Elasticsearch
// foreach ($novels as $novel) {
//     $params = [
//         'index' => 'your', // 替换成你的索引名称
//         'id'    => $novel['id'],
//         'body'  => $novel
//     ];

//     $response = $client->index($params);
// }

// echo 'Data indexed successfully.';
