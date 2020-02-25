## NHMTHUminer
Đây là một giao diện người dùng nhỏ cho https://maxmines.com/.  
Giao diện này được phát triển bởi Minh Thư, các bạn có thể liên hệ bạn ấy qua email: ```nguyenhoangminhthu0203@gmail.com```

# Getting Started
Các hướng dẫn này sẽ giúp bạn có một bản sao của dự án và chạy trên máy hoặc máy chủ cục bộ của bạn.

## Configuration
Mở `api/config.php`.
```php
<?php
$dbUser = "<TÊN_TÀI_KHOẢN_DATABASE_CỦA_BẠN>";
$dbPass = "<MẬT_KHẨU_DATABASE_CỦA_BẠN>";
$dbName = "<TÊN_DATABASE_CỦA_BẠN>";
$MaxMinesSecret="<YOUR_SITE_SECRET_KEY>";
```
Mở `scripts/miner.js`
```js
var siteKey = "<YOUR_SITE_PUBLIC_KEY>";
```

# Demo
[Live demo](http://miner.stressoff.ga/)  
![Demo](https://github.com/lesongvi/NHMTHUminer/blob/master/nhmthuminer.png?raw=true)
