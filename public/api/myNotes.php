<?php
    require_once("../helpers_and_managers.php");
    RequestHelper::require_method("GET");
    
    $user_id = RequestHelper::get_user_id();
    $token = RequestHelper::get_auth_token();
    $db = new DatabaseManager();
    
    if (!$db->is_user_logged_in($user_id, $token)) //if user not logged in
    {
        http_response_code(401);
        die("User is not logged in.");
    }
    else
    {
        $notes = $db->get_notes($user_id);
        
        header("Content-Type: application/json");
        echo json_encode($notes);
    }
?>