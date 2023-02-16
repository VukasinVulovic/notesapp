<?php
    require_once("../helpers_and_managers.php");
    RequestHelper::require_method("POST");

    if (!RequestHelper::is_post_variable_set("note_id") || !RequestHelper::is_id_valid($_POST["note_id"]))
    {
        http_response_code(403);
        die("Note id not provided.");
    }

    $title = RequestHelper::get_note_title(false);
    $text = RequestHelper::get_note_text(false);

    if ($title == null && $text == null)
    {
        http_response_code(403);
        die("No change to note provided.");
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
        $db->edit_note($user_id, $_POST["note_id"], $title, $text);
    }

    echo "Edited note.";
?>