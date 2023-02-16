<?php
    class StringHelper 
    {
        public static function random_string(int $length)
        {
            $output = "";
            
            for ($i = 0; $i < $length; $i++)
            {
                $output .= 'qwertyuiopasdfghjklzxcvbnm1234567890'[rand(0, 35)];
            }
    
            return $output;
        }
    }

    class RequestHelper 
    {
        public static function require_method(string $method)
        {
            if (strtolower($_SERVER['REQUEST_METHOD']) != strtolower($method))
            {
                http_response_code(405);
                die("Only $method method is allowed.");
            }
        }

        public static function is_get_variable_set(string $var)
        {
            return isset($_GET[$var]) && !empty($_GET[$var]);
        }    

        public static function is_post_variable_set(string $var)
        {
            return isset($_POST[$var]) && !empty($_POST[$var]);
        }       

        public static function is_server_variable_set(string $var)
        {
            return isset($_SERVER[$var]) && !empty($_SERVER[$var]);
        } 

        public static function get_username()
        {
            if (!RequestHelper::is_post_variable_set("username") || !preg_match("/[a-zA-Z0-9_\-!#$%^&*\(\)=+]{3,12}/", $_POST["username"]))
            {
                http_response_code(406);
                die("Username not set or is in incorrect format.");
            }

            return $_POST["username"];
        }

        public static function get_password()
        {
            if (
                !RequestHelper::is_post_variable_set("password") || 
                !preg_match("/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,20}$/", $_POST["password"])
            )
            {
                http_response_code(406);
                die("Password not set or is in incorrect format.");
            }

            return $_POST["password"];
        }
    
        public static function is_token_valid(string $token)
        {
            return preg_match("/[a-z0-9]{32}/", $token);
        }
    
        public static function is_id_valid(string $user_id)
        {
            return preg_match("/[0-9]/", $user_id);
        }

        public static function is_title_valid(string $title)
        {
            return strlen($title) <= 250;
        }

        public static function is_text_valid(string $title)
        {
            return strlen($title) <= 20000;
        }

        public static function get_header(string $header)
        {
            $headers = getallheaders();
            
            if (array_key_exists($header, $headers))
            {
                return $headers[$header];
            }

            return null;
        }

        public static function get_user_id()
        {
            $user_id = RequestHelper::get_header("UserID");

            if (!$user_id || !RequestHelper::is_id_valid($user_id))
            {
                http_response_code(406);
                die("UserID not set or is in incorrect format.");
            }
            
            return $user_id;
        }

        public static function get_auth_token(bool $required=true)
        {
            $token = RequestHelper::get_header("Authorization");

            if (!$token || !RequestHelper::is_id_valid($token))
            {
                if (!$required)
                {
                    return null;
                }

                http_response_code(401);
                die("Authorization token not set or is in incorrect format.");
            }

            return $token;
        }

        public static function get_note_title(bool $required=true)
        {
            if (!RequestHelper::is_post_variable_set("title") || !RequestHelper::is_title_valid($_POST["title"]))
            {
                if ($required) 
                {
                    http_response_code(403);
                    die("Title must be provided and have a length < 250 characters.");
                }

                return null;
            }

            return $_POST["title"];
        }

        public static function get_note_text(bool $required=true)
        {
            if (!RequestHelper::is_post_variable_set("text") || !RequestHelper::is_text_valid($_POST["text"]))
            {
                if ($required) 
                {
                    http_response_code(403);
                    die("Text must be provided and have a length < 20000 characters.");
                }

                return null;
            }

            return $_POST["text"];
        }
    }

    class DatabaseManager
    {
        private $db;

        function __construct() 
        {
            $this->db = mysqli_connect("localhost", "root", "", "notesapp");

            if ($this->db->connect_error)
            {
                http_response_code(500);
                die("Could not connect to database.");
            }
        }

        function __destruct() 
        {
            if ($this->db)
            {
                $this->db->close();
            }
        }

        public function is_user_logged_in(string $user_id, string $token)
        {
            $user_id = RequestHelper::get_user_id();
            $token = RequestHelper::get_auth_token();

            if (!RequestHelper::is_token_valid($token) || !RequestHelper::is_id_valid($user_id))
            {
                return false;
            }

            $hash = hash("sha256", $token); //token hash

            $result = $this->db->query("SELECT token, best_by FROM Tokens WHERE user_id={$user_id}");

            if (!$result)
            {
                http_response_code(500);
                die("Could not create token.");
            }

            while ($row = mysqli_fetch_array($result))
            {
                if ($row["token"] == $hash)
                {
                    $time_now = (new DateTime())->getTimestamp();

                    if (strtotime($row["best_by"]) <= $time_now) //if token expired
                    {
                        remove_token($user_id, $token);
                    }

                    return true;
                }
            }

            return false;
        }

        public function get_user_id(string $username)
        {
            $result = $this->db->query("SELECT user_id FROM Users WHERE username='{$username}' LIMIT 1");

            if (!$result)
            {
                http_response_code(500);
                die("Could not find user.");
            }
        
            if ($result->num_rows == 0)
            {
                http_response_code(406);
                die("User does not exists.");
            }

            return $result->fetch_row()[0];
        }

        public function create_user(string $username, string $password)
        {
            $salt = StringHelper::random_string(12);
            $hash = hash("sha256", $password . $salt);
        
            $result = $this->db->query("CALL CreateUser('$username', '$salt', '$hash')"); //reate user using procedure

            if (!$result)
            {
                http_response_code(500);
                die("Could not create user.");
            }
        }

        public function is_password_correct(string $user_id, string $password)
        {
            $result = $this->db->query("SELECT hash, salt FROM passwords WHERE user_id = $user_id LIMIT 1");
        
            if (!$result || $result->num_rows == 0)
            {
                http_response_code(404);
                die("Could not find password for user.");
            }

            $row = $result->fetch_row();
            
            $hash = hash("sha256", $password . $row[1]);

            return $hash === $row[0];
        }

        public function create_token(string $user_id, int $expireInDays=31)
        {
            $token_plaintext = StringHelper::random_string(32);
            $token = hash("sha256", $token_plaintext);
            
            $date = new DateTime();
            $date->add(DateInterval::createFromDateString("$expireInDays days"));
            $expiration = $date->format("Y-m-d H:i:s");

            $result = $this->db->query("INSERT INTO Tokens (user_id, token, best_by) VALUES ($user_id, '$token', '$expiration')");
        
            if (!$result)
            {
                http_response_code(500);
                die("Could not create token.");
            }

            return $token_plaintext;
        }

        public function remove_token(string $user_id, string $token)
        {
            $hash = hash("sha256", $token); //token hash
            $result = $this->db->query("DELETE FROM Tokens WHERE user_id = $user_id AND token = '$hash'"); //remov token with user id and hash

            if (!$result)
            {
                http_response_code(500);
                die("Could not remove token");
            }
        }

        public function remove_all_tokens(string $user_id)
        {
            $result = $this->db->query("DELETE FROM Tokens WHERE user_id = $user_id"); //remove all tokens with user id

            if (!$result)
            {
                http_response_code(500);
                die("Could not remove tokens.");
            }
        }

        public function add_note(string $user_id, string $title, string $text)
        {
            $title = htmlspecialchars($title);
            $text = htmlspecialchars($text);

            $result = $this->db->query("INSERT INTO Notes (user_id, title, text, date_created, date_modified) VALUES ($user_id, '$title', '$text', NOW(), NOW())"); //add note to database

            if (!$result)
            {
                http_response_code(500);
                die("Could not create note");
            }

            if ($this->db->affected_rows == 0)
            {
                http_response_code(204); //not changed
            }
        }

        public function remove_note(string $user_id, string $note_id)
        {
            $result = $this->db->query("DELETE FROM Notes WHERE user_id = $user_id AND note_id = $note_id"); //delete note from database

            if (!$result)
            {
                http_response_code(500);
                die("Could not delete note.");
            }

            if ($this->db->affected_rows == 0)
            {
                http_response_code(204); //not changed
            }
        }

        public function edit_note(string $user_id, string $note_id, string $title, string $text)
        {
            $title = htmlspecialchars($title);
            $text = htmlspecialchars($text);
            
            $sql = "UPDATE Notes SET ";

            if ($title != null && $text != null)
            {
                $sql .= "title = '$title', text = '$text'";
            } 
            else if ($title != null)
            {
                $sql .= "title = '$title'";
            }
            else if ($text != null)
            {
                $sql .= "text = '$text'";
            }
            else
            {
                return;
            }

            $sql .= ", date_modified = NOW() WHERE user_id = $user_id AND note_id = $note_id";

            $result = $this->db->query($sql); //update note in database

            if (!$result)
            {
                http_response_code(500);
                die("Could not delete note.");
            }

            if ($this->db->affected_rows == 0)
            {
                http_response_code(204); //not changed
            }
        }

        public function get_notes(string $user_id)
        {
            $notes = array();
            $result = $this->db->query("SELECT note_id, title, text, date_created, date_modified FROM Notes WHERE user_id = '$user_id' ORDER BY date_modified DESC"); //add note to database

            if (!$result)
            {
                http_response_code(500);
                die("Could not get notes.");
            }

            while ($row = mysqli_fetch_array($result))
            {
                $notes[] = [
                    "note_id" => $row["note_id"],
                    "title" => $row["title"],
                    "text" => $row["text"],
                    "date_created" => $row["date_created"],
                    "date_modified" => $row["date_modified"]
                ];
            }

            return $notes;
        }

        public function delete_user(string $user_id) 
        {
            $result = $this->db->query("DELETE FROM Notes WHERE user_id = $user_id"); //delete notes from database

            if (!$result)
            {
                http_response_code(500);
                die("Could not delete users notes.");
            }

            $this->remove_all_tokens($user_id);

            $result = $this->db->query("DELETE FROM Passwords WHERE user_id = $user_id"); //delete user from database

            if (!$result)
            {
                http_response_code(500);
                die("Could not delete users password.");
            }

            $result = $this->db->query("DELETE FROM Users WHERE user_id = $user_id"); //delete user from database

            if (!$result)
            {
                http_response_code(500);
                die("Could not delete user.");
            }

            if ($this->db->affected_rows == 0)
            {
                http_response_code(204); //not changed
            }
        }

        public function change_password(string $user_id, string $new_password)
        {
            $salt = StringHelper::random_string(12);
            $hash = hash("sha256", $new_password . $salt);

            $result = $this->db->query("UPDATE Passwords SET hash = '$hash', salt = '$salt' WHERE user_id = $user_id"); //delete notes from database

            if (!$result)
            {
                http_response_code(500);
                die("Could not change password.");
            }

            if ($this->db->affected_rows == 0)
            {
                http_response_code(204); //not changed
            }

            $this->remove_all_tokens($user_id);
        }
    }
?>