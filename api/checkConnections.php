<?php
include "config.php";


$curl = curl_init();
curl_setopt_array($curl, array(
  CURLOPT_RETURNTRANSFER => 1,
  CURLOPT_URL => 'https://api.maxmines.com/stats/site?secret='.$MaxMinesSecret
));

$result = curl_exec($curl);

if($result === false){
  echo "Lỗi trong khi yêu cầu thống kê trang web\n";
  echo "Lỗi: ".curl_error($curl);
}else{
  echo "Có số liệu thống kê trang web!\n";
}
curl_close($curl);

$curl = curl_init();
curl_setopt_array($curl, array(
    CURLOPT_RETURNTRANSFER => 1,
    CURLOPT_URL => 'https://api.maxmines.com/user/top?secret='.$MaxMinesSecret.'&count=10'
));
$result = curl_exec($curl);
if($result === false){
  echo "Lỗi trong khi yêu cầu các miner hàng đầu\n";
  echo "Lỗi: ".curl_error($curl);
}else{
  echo "Có miner trang web hàng đầu!\n";
}
curl_close($curl);
