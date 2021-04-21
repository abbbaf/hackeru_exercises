<?php
$dbh = mysqli_init();
$user = 'wordpress';
$password = '12345678';
$host = 'localhost';
mysqli_real_connect( $dbh, $host, $user, $password, null, null, null, 0 );
print_r($dbh);
