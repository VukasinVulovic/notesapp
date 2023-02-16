<?php
    require_once("../helpers_and_managers.php");
    RequestHelper::require_method("DELETE");

    if (!RequestHelper::is_get_variable_set("note_id") || !RequestHelper::is_id_valid($_GET["note_id"]))
    {
        http_response_code(403);
        die("Note id not provided.");
    }

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
        $db->remove_note($user_id, $_GET["note_id"]);
    }

    echo "Deleted note.";
?>