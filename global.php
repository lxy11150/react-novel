<?php
function success($message, $data){
  echo json_encode([
    "code" => 200,
    "message" => $message,
    "data" => $data
  ]);
}

function error($message){
  echo json_encode([
    "code" => 401,
    "message" => $message,
    "data" => null
  ]);
}