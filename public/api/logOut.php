<?php
    require_once("../helpers_and_managers.php");
    RequestHelper::require_method("POST");

    $from_all = RequestHelper::is_post_variable_set("from_all") && $_POST["from_all"] == "true"; //should log out of all devices

    $user_id = RequestHelper::get_user_id();
    $token = RequestHelper::get_auth_token();
    $db = new DatabaseManager();
    
    if (!$db->is_user_logged_in($user_id, $token)) //if user not logged in
    {
        http_response_code(401);
        die("User is not logged in");
    }
    else
    {
        if ($from_all) 
        {
            $db->remove_all_tokens($user_id);
        } 
        else 
        {
            $db->remove_token($user_id, $token);
        }
    }

    echo $from_all ? "Logged out of all devices." : "Logged out.";
?>