CREATE DATABASE NotesApp;
USE NotesApp;

/*tables*/

CREATE TABLE Users(
    user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(20) NOT NULL UNIQUE,
    signup_date DATETIME NOT NULL
);

CREATE TABLE Passwords(
	user_id INT NOT NULL,
    hash VARCHAR(64) NOT NULL,
    salt VARCHAR(12) NOT NULL,
	last_updated DATETIME NOT NULL,
    CONSTRAINT pk_password PRIMARY KEY (user_id, hash),
    CONSTRAINT fk_password_users FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Tokens(
	user_id INT NOT NULL,
    token VARCHAR(64) NOT NULL,
    best_by DATETIME,
    CONSTRAINT pk_tokens PRIMARY KEY (user_id, token),
    CONSTRAINT fk_tokens_users FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Notes(
    note_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    date_created DATETIME NOT NULL,
    date_modified DATETIME NOT NULL,
    CONSTRAINT pk_notes PRIMARY KEY (note_id),
    CONSTRAINT fk_notes_users FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

/*PROCEDURES*/
DELIMITER //
CREATE PROCEDURE CreateUser(IN username VARCHAR(20), IN password_salt VARCHAR(12), IN password_hash VARCHAR(64)) 
BEGIN
    INSERT INTO Users(username, signup_date) VALUES(username, CURDATE());
    
    SET @user_id = (SELECT Users.user_id FROM users WHERE Users.username = username LIMIT 1);

    INSERT INTO Passwords(Passwords.user_id, Passwords.hash, Passwords.salt, Passwords.last_updated) 
        VALUES(@user_id, password_hash, password_salt, CURDATE());
END//
DELIMITER ;