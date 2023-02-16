<?php
    require_once("../helpers_and_managers.php");
    RequestHelper::require_method("POST");
    
    $username = RequestHelper::get_username();
    $password = RequestHelper::get_password();

    
    if (
        !RequestHelper::is_post_variable_set("new_password") || 
        !preg_match("/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,20}$/", $_POST["password"])
    )
    {
        http_response_code(406);
        die("New password not set or is in incorrect format.");
    }
        
    $new_password = $_POST["new_password"];

    $db = new DatabaseManager();
    
    $user_id = $db->get_user_id($username);

    if ($db->is_password_correct($user_id, $password))
    {        
        $db->change_password($user_id, $new_password);
        echo "Successfully changed password.";
    }
    else
    {
        http_response_code(401);
        die("Password is incorrect.");
    }
    
?>