<?php
    require_once("../helpers_and_managers.php");
    RequestHelper::require_method("GET");

    if (!RequestHelper::is_get_variable_set("username"))
    {
        http_response_code(403);
        die("Username not provided.");
    }

    $username = $_GET["username"];

    $seed = 0;
    
    for ($i = 0; $i < strlen($username); $i++)
    {
        $seed += ord($username[$i]);
    }

    srand($seed / strlen($username));

    $r = str_pad(dechex(rand(0, 255)), 2, "0", STR_PAD_LEFT);
    $g = str_pad(dechex(rand(0, 255)), 2, "0", STR_PAD_LEFT);
    $b = str_pad(dechex(rand(0, 255)), 2, "0", STR_PAD_LEFT);

    echo "#{$r}{$g}{$b}";
?>