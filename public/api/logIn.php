<?php
    require_once("../helpers_and_managers.php");
    RequestHelper::require_method("POST");
    
    $token = RequestHelper::get_auth_token(false);
    $username = RequestHelper::get_username();
    $password = RequestHelper::get_password();

    $db = new DatabaseManager();
    
    $user_id = $db->get_user_id($username);
    
    if ($token && $db->is_user_logged_in($user_id, $token))
    {
        http_response_code(409);
        die("User is already logged in");
    }

    if ($db->is_password_correct($user_id, $password))
    {        
        $token = $db->create_token($user_id);
        
        echo json_encode(array(
            "user_id" => $user_id,
            "username" => $username,
            "token" => $token
        ));
    }
    else
    {
        http_response_code(401);
        die("Password is incorrect.");
    }
    
?>