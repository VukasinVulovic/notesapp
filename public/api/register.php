<?php
    require_once("../helpers_and_managers.php");
    RequestHelper::require_method("POST");

    $username = RequestHelper::get_username();
    $password = RequestHelper::get_password();

    $db = new DatabaseManager();
    $db->create_user($username, $password);
    
    echo 'User registered successfully.';
?>