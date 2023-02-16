<?php
    require_once("../helpers_and_managers.php");
    RequestHelper::require_method("POST");

    $title = RequestHelper::get_note_title();
    $text = RequestHelper::get_note_text();
    
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
        $db->add_note($user_id, $title, $text);
        
        http_response_code(201);
        echo "Created new note.";
    }  
?>