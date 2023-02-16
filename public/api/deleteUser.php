<?php
    require_once("../helpers_and_managers.php");
    RequestHelper::require_method("POST");
    
    $username = RequestHelper::get_username();
    $password = RequestHelper::get_password();

    $db = new DatabaseManager();
    
    $user_id = $db->get_user_id($username);

    if ($db->is_password_correct($user_id, $password))
    {        
        $db->delete_user($user_id);
        echo "Successfully deleted user.";
    }
    else
    {
        http_response_code(401);
        die("Password is incorrect.");
    }
    
?>