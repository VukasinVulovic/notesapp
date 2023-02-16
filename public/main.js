function showError(title, text) {
    const content = document.createElement('div');
    const dialog = document.createElement('dialog');
    const button = document.createElement('button');

    dialog.className = 'info_dialog';
    content.className = 'content';
    button.className = 'button';
    button.innerHTML = 'OK';

    content.style.backgroundColor = 'rgba(244, 0, 0, 0.698)';
    content.innerHTML = `<h1>${title}</h1><p>${text}</p>`;
    button.onclick = () => {
        dialog.remove();
        document.body.onkeydown = () => {}
    };

    document.body.onkeydown = e => e.preventDefault();
    button.focus();
    
    content.appendChild(button);
    dialog.appendChild(content);
    document.body.appendChild(dialog);
}

function showSuccess(title, text) {
    const content = document.createElement('div');
    const dialog = document.createElement('dialog');
    const button = document.createElement('button');

    dialog.className = 'info_dialog';
    content.className = 'content';
    button.className = 'button';
    button.innerHTML = 'OK';

    content.innerHTML = `<h1>${title}</h1><p>${text}</p>`;
    button.onclick = () => dialog.remove();

    window.blur();
    button.focus();
    
    content.appendChild(button);
    dialog.appendChild(content);
    document.body.appendChild(dialog);
}

function showPrompt(title, text) {
    return new Promise((resolve, reject) => {
        const content = document.createElement('div');
        const dialog = document.createElement('dialog');
        const buttonYes = document.createElement('button');
        const buttonNo = document.createElement('button');
    
        dialog.className = 'info_dialog';
        content.className = 'content';
    
        buttonYes.className = 'button';
        buttonYes.innerHTML = 'YES';
    
        buttonNo.className = 'button';
        buttonNo.innerHTML = 'NO';
        
        content.style.backgroundColor = 'rgba(0, 207, 244, 0.698)';
        content.innerHTML = `<h1>${title}</h1><p>${text}</p>`;
    
        buttonYes.onclick = () => {
            dialog.remove();
            document.body.onkeydown = e => {}
            resolve(true);
        };

        buttonNo.onclick = () => {
            dialog.remove();
            document.body.onkeydown = e => {}
            resolve(false);
        };

        document.body.onkeydown = e => e.preventDefault();
        buttonYes.focus();
        
        content.appendChild(buttonYes);
        content.appendChild(buttonNo);
    
        dialog.appendChild(content);
        document.body.appendChild(dialog);
    });
}

function showAccDeletePrompt() {
    return new Promise((resolve, reject) => {
        const dialog = document.createElement('dialog');
        const content = document.createElement('div');
        const input = document.createElement('input');
        const buttonOk = document.createElement('button');
        const buttonCancel = document.createElement('button');
    
        dialog.className = 'info_dialog';
        content.className = 'content';
        
        input.type = 'password';
        input.className = 'input';

        buttonOk.className = 'button';
        buttonOk.innerHTML = 'DELETE ACCOUNT';

        buttonCancel.className = 'button';
        buttonCancel.innerHTML = 'CANCEL';
        
        content.style.backgroundColor = 'rgba(0, 207, 244, 0.698)';
        content.innerHTML = `<h1>Password required</h1><p>Please enter your password</p>`;
    
        document.body.onkeydown = e => e.preventDefault();
        buttonOk.focus();

        buttonOk.onclick = () => {
            const pass = input.value;

            if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,20}$/.test(pass)) {
                showError("Incorrect", "You have entered an incorrect password.");
            } else {
                dialog.remove();
                resolve(pass);
            }

            document.body.onkeydown = e => {}
        };

        buttonCancel.onclick = () => {
            document.body.onkeydown = e => {}
            dialog.remove();
            resolve(false);
        };
        
        const p = document.createElement('p');
        p.appendChild(input);
        content.appendChild(p);

        content.appendChild(buttonOk);
        content.appendChild(buttonCancel);
    
        dialog.appendChild(content);
        document.body.appendChild(dialog);
    });
}

function showPasswordChangePrompt() {
    return new Promise((resolve, reject) => {
        const dialog = document.createElement('dialog');
        const content = document.createElement('div');
        const inputOld = document.createElement('input');
        const inputNew = document.createElement('input');
        const buttonOk = document.createElement('button');
        const buttonCancel = document.createElement('button');
    
        dialog.className = 'info_dialog';
        content.className = 'content';
        
        inputOld.type = 'password';
        inputOld.className = 'input';

        inputNew.type = 'password';
        inputNew.className = 'input'

        buttonOk.className = 'button';
        buttonOk.innerHTML = 'CHANGE PASSWORD';

        
        buttonCancel.className = 'button';
        buttonCancel.innerHTML = 'CANCEL';
        
        content.style.backgroundColor = 'rgba(0, 207, 244, 0.698)';
        content.innerHTML = `<h1>Change password</h1>`;
        
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,20}$/;
        
        document.body.onkeydown = e => e.preventDefault();
        buttonOk.focus();

        buttonOk.onclick = () => {
            if (inputOld.value == inputNew.value) {
                showError('Could not change password', 'New password matches the old one.');
            } else if (!passRegex.test(inputNew.value)) {
                showError('Could not change password', 'Password must be between 8 and 20 characters, at least one uppercase and one lowercase letter, one number and one special character.');
            } else if (!passRegex.test(inputOld.value)) {
                showError('Could not change password', 'You entered the wrong password.');
            } else {
                dialog.remove();
                resolve({ oldPassword: inputOld.value, newPassword: inputNew.value });
            }

            document.body.onkeydown = e => {}
        };

        buttonCancel.onclick = () => {
            document.body.onkeydown = e => {}
            dialog.remove();
            resolve(false);
        };
        
        const p1 = document.createElement('p');
        const lbl1 = document.createElement('h3');
        lbl1.innerHTML = 'Old password: ';
        p1.append(lbl1, inputOld);
        
        const p2 = document.createElement('p');
        const lbl2 = document.createElement('h3');
        lbl2.innerHTML = 'New password: ';
        p2.append(lbl2, inputNew);

        content.append(p1, p2);
        content.append(buttonOk, buttonCancel);
        dialog.appendChild(content);
        document.body.appendChild(dialog);
    });
}

class LoginForm {
    constructor(noteManager) {
        const dialog = document.createElement('dialog');
        const form = document.createElement('form');
        
        dialog.className = 'account_dialog';
        form.method = 'post';
        form.innerHTML = '<h1>Register/Login</h1><fieldset><legend>Username</legend><input name="username" type="text" pattern="[a-zA-Z0-9_\\-!#$%^&*\\(\\)=+]{3,20}" title="username must be between 3 and 12 alphabetical/numeric/special(not single quote) characters" required></fieldset><fieldset><legend>Password</legend><input name="password" type="password" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,20}$" title="password must be between 8 and 20 characters, at least one uppercase and one lowercase letter, one number and one special character" required></fieldset><fieldset><legend>Repeat password</legend><input autocomplete="current-password" type="password" name="password_check" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,20}$" title="password must be between 8 and 20 characters, at least one uppercase and one lowercase, one number and one special character" required></fieldset><p class="disclamer">*if a user with username exists, a new one cannot be created</p><button type="submit">Log in&nbsp;<span class="material-symbols-outlined">arrow_forward</span></button><button type="submit">Register&nbsp;<span class="material-symbols-outlined">arrow_forward</span></button>';
        
        form.addEventListener('submit', this.#submitHandler.bind(this));

        dialog.appendChild(form);
        document.body.appendChild(dialog);

        this.dialog = dialog;
        this.form = form;
        this.noteManager = noteManager;
    }

    #submitHandler(e) {
        e.preventDefault();
        const usernameInput = e.target.querySelector('input[name="username"]');
        const passwordInput = e.target.querySelector('input[name="password"]');
        const password2Input = e.target.querySelector('input[name="password_check"]');

        if(passwordInput.value !== password2Input.value) {
            showError('Form input error', 'Passwords entered don\'t match.');
            return;
        }

        if(e.submitter.innerText.startsWith('Register')) {
            const error = err => showError('Error while registering user', err);
    
            this.noteManager.registerUser(usernameInput.value, passwordInput.value)
            .then(() => showSuccess('Registration successfull', 'You can now log in.'))
            .catch(error);
        } else {
            const error = err => showError('Error while logging in user', err);
    
            this.noteManager.logInUser(usernameInput.value, passwordInput.value)
            .then(() => {
                showSuccess('Login successfull', 'You can now use the application.');
                location.reload();
            })
            .catch(error);
        }
    }

    open() {
        this.dialog.open = 'open';
    }
}

function getUserColor(username) {
    return new Promise((resolve, reject) => {
        let color = localStorage.getItem('user_color-'+username);
    
        if(color !== null) {
            resolve(color);
        } else {
            fetch('/api/colorByUsername.php?username=' + encodeURIComponent(username))
            .then(res => res.text())
            .then(c => {
                localStorage.setItem('user_color-'+username, c);
                resolve(c);
            })
            .catch(() => resolve('#000000'));
        }
    })
}

class Note {
    constructor(noteManager, id, title, text) {
        this.noteManager = noteManager;
        this.id = id;

        const element = document.createElement('article');
        element.className = 'note';
        element.draggable = true;

        const unsavedIcon = document.createElement('div');
        unsavedIcon.className = 'unsaved_icon';
        unsavedIcon.innerHTML = '<span class="material-symbols-outlined">sync_problem</span>';
        unsavedIcon.hidden = true;
        this.unsavedIcon = unsavedIcon;

        const titleInput = document.createElement('textarea');
        titleInput.className = 'title';
        titleInput.maxLength = 100;
        titleInput.value = title;
        titleInput.spellcheck = false;
        
        const textInput = document.createElement('textarea');
        textInput.className = 'text';
        textInput.maxLength = 250;
        textInput.value = text;
        textInput.rows = 10;
        textInput.spellcheck = false;

        titleInput.addEventListener('keypress', e => {
            if(e.key == 'Enter')
            {
                textInput.focus();
            }
        });

        textInput.addEventListener('keypress', e => {
            if(e.key == 'Enter')
            {
                this.updateNote(titleInput.value, textInput.value);
            }
        });

        element.addEventListener('dragstart', e => {
            e.dataTransfer.setData('noteId', id);
        });

        element.append(unsavedIcon, titleInput, textInput);
        this.element = element;

        textInput.addEventListener('change', () => this.updateNote(titleInput.value, textInput.value));
        titleInput.addEventListener('change', () => this.updateNote(titleInput.value, textInput.value));
    
        textInput.addEventListener('keydown', () => unsavedIcon.hidden = false);
        titleInput.addEventListener('keydown', () => unsavedIcon.hidden = false);
        
        this.titleInput = titleInput;
        this.textInput = textInput;
    }

    get title() {
        return this.titleInput.value;
    }

    get text() {
        return this.textInput.value;
    }

    updateNote(title, text) {
        this.noteManager.editNote(this.id, title, text)
        .catch(err => showError('Could not update note', err));

        this.unsavedIcon.hidden = true
    }

    childTo(container) {
        container.appendChild(this.element);
    }

    delete() {
        return this.noteManager.deleteNote(this.id);
    }
}

class NoteManager {
    constructor(baseURL='/api') {
        this.baseURL = baseURL;
        this.userInfo = this.#getUserInfo();
    }

    registerUser(username, password) {
        return new Promise((resolve, reject) => {
            const data = new FormData();

            data.append('username', username);
            data.append('password', password);

            fetch(`${this.baseURL}/register.php`, {
                'method': 'POST',
                'headers': {},
                'body': data
            })
            .then(async res => {
                if(res.status == 200) {
                    resolve();
                } else {
                    reject(res.statusText + ', ' + await res.text())
                }
            })
            .catch(e => reject(e));
        });
    }

    logInUser(username, password) {
        return new Promise((resolve, reject) => {
            const data = new FormData();

            data.append('username', username);
            data.append('password', password);

            fetch(`${this.baseURL}/logIn.php`, {
                'method': 'POST',
                'headers': {},
                'body': data
            })
            .then(async res => {
                if(res.status == 200) {
                    this.#setUserInfo(await res.json());
                    resolve();
                } else {
                    reject(res.statusText + ', ' + await res.text());
                }
            })
            .catch(e => reject(e));
        });
    }

    logOutUser(fromAll=false) {
        return new Promise((resolve, reject) => {
            const data = new FormData();

            data.append('from_all', fromAll ? 'true' : 'false');

            fetch(`${this.baseURL}/logOut.php`, {
                'method': 'POST',
                'headers': {
                    'UserID': this.userInfo['user_id'],
                    'Authorization': this.userInfo['token']
                },
                'body': data
            })
            .then(async res => {
                if(res.status == 200) {
                    this.#removeUserInfo();
                    resolve();
                } else {
                    reject(res.statusText + ', ' + await res.text());
                }
            })
            .catch(e => reject(e));
        });
    }

    #removeUserInfo() {
        localStorage.removeItem('user_info');
    }

    #setUserInfo(userInfo) {
        localStorage.setItem('user_info', JSON.stringify(userInfo));
    }

    #getUserInfo() {
        let info = localStorage.getItem('user_info');
        
        try {
            info = !info ? null : JSON.parse(info);
        } catch(err) {
            info = null;
        }
        
        return info;
    }
    
    getNotes() {
        return new Promise((resolve, reject) => {
            fetch(`${this.baseURL}/myNotes.php`, {
                'method': 'GET',
                'headers': {
                    'UserID': this.userInfo['user_id'],
                    'Authorization': this.userInfo['token']
                }
            })
            .then(async res => {
                if(res.status == 401)
                {
                    this.#removeUserInfo();
                    location.reload();
                }

                if(res.status == 200) {
                    const json = await res.json();
                    const notes = json.map(note => new Note(this, note['note_id'], note['title'], note['text']));

                    resolve(notes);
                } else {
                    reject(res.statusText + ', ' + await res.text());
                }
            })
            .catch(e => reject(e));
        })
    }

    deleteNote(noteId) {
        return new Promise((resolve, reject) => {
            fetch(`${this.baseURL}/deleteNote.php?note_id=${noteId}`, {
                'method': 'DELETE',
                'headers': {
                    'UserID': this.userInfo['user_id'],
                    'Authorization': this.userInfo['token']
                }
            })
            .then(async res => {
                if(res.status == 401)
                {
                    this.#removeUserInfo();
                    location.reload();
                }

                if(res.status == 200) {
                    resolve();
                } else {
                    reject(res.statusText + ', ' + await res.text());
                }
            })
            .catch(e => reject(e));
        });
    }

    createNote(title, text) {
        return new Promise((resolve, reject) => {
            const data = new FormData();

            data.append('title', title);
            data.append('text', text);

            fetch(`${this.baseURL}/addNote.php`, {
                'method': 'POST',
                'headers': {
                    'UserID': this.userInfo['user_id'],
                    'Authorization': this.userInfo['token']
                },
                'body': data
            })
            .then(async res => {
                if(res.status == 401)
                {
                    this.#removeUserInfo();
                    location.reload();
                }

                if(res.status == 201) {
                    resolve();
                } else {
                    reject(res.statusText + ', ' + await res.text());
                }
            })
            .catch(e => reject(e));
        });
    }

    editNote(noteId, title, text) {
        return new Promise((resolve, reject) => {
            const data = new FormData();

            data.append('note_id', noteId);
            data.append('title', title);
            data.append('text', text);

            fetch(`${this.baseURL}/editNote.php`, {
                'method': 'POST',
                'headers': {
                    'UserID': this.userInfo['user_id'],
                    'Authorization': this.userInfo['token']
                },
                'body': data
            })
            .then(async res => {
                if(res.status == 401)
                {
                    this.#removeUserInfo();
                    location.reload();
                }

                if(res.status == 200) {
                    resolve();
                } else {
                    reject(res.statusText + ', ' + await res.text());
                }
            })
            .catch(e => reject(e));
        });
    }

    deleteUser(password) {
        return new Promise((resolve, reject) => {
            const data = new FormData();

            data.append('username', this.userInfo['username']);
            data.append('password', password);

            fetch(`${this.baseURL}/deleteUser.php`, {
                'method': 'POST',
                'body': data
            })
            .then(async res => {
                if(res.status == 200) {
                    this.#removeUserInfo();
                    location.reload();
                    resolve();
                } else {
                    reject(res.statusText + ', ' + await res.text());
                }
            })
            .catch(e => reject(e));
        });
    }
    
    changePassword(password, newPassword) {
        return new Promise((resolve, reject) => {
            const data = new FormData();

            data.append('username', this.userInfo['username']);
            data.append('new_password', newPassword);
            data.append('password', password);

            fetch(`${this.baseURL}/changePassword.php`, {
                'method': 'POST',
                'body': data
            })
            .then(async res => {
                if(res.status == 200) {
                    this.#removeUserInfo();
                    location.reload();
                    resolve();
                } else {
                    reject(res.statusText + ', ' + await res.text());
                }
            })
            .catch(e => reject(e));
        });
    }
}

function handleAccountSettings(noteManager) {
    document.querySelector('#log_out_btn').addEventListener('click', () => {
        noteManager.logOutUser()
        .then(() => location.reload())
        .catch(err => showError('Error while logging out user', err));
    });

    document.querySelector('#log_out_all_btn').addEventListener('click', () => {
        noteManager.logOutUser(true)
        .then(() => location.reload())
        .catch(err => showError('Error while logging out user', err));
    });


    document.querySelector('#delete_acc_btn').addEventListener('click', async() => {
        const password = await showAccDeletePrompt();
        
        if(!password) {
            return;
        }

        noteManager.deleteUser(password)
        .then(() => location.reload())
        .catch(err => showError('Error while deleting user', err));
    });

    document.querySelector('#change_pass_btn').addEventListener('click', async() => {
        const res = await showPasswordChangePrompt();
        
        if(!res) {
            return;
        }

        noteManager.changePassword(res.oldPassword, res.newPassword)
        .then(() => location.reload())
        .catch(err => showError('Error while changing password', err));
    });
}

function displayUserInfo(noteManager) {
    //username, title
    const usernameLetterEl = document.querySelector('#username_letter');

    document.querySelector('#user_title').innerHTML = `${noteManager.userInfo['username']}'s notes`;
    document.querySelector('#username_text').innerHTML = noteManager.userInfo['username'];
    
    document.title = `${noteManager.userInfo['username']}'s notes`;
    usernameLetterEl.innerHTML = noteManager.userInfo['username'][0];

    getUserColor(noteManager.userInfo['username'])
    .then(color => usernameLetterEl.style.backgroundColor = color)
    .catch(err => usernameLetterEl.style.backgroundColor = 'red');
}

function handleDelete(notes) {
    const rubbishBinEl = document.querySelector('#rubbish_bin');

    rubbishBinEl.addEventListener('dragover', e => e.preventDefault());
    rubbishBinEl.addEventListener('drop', async e => {
        e.preventDefault();
        const noteId = e.dataTransfer.getData('noteId');
        
        if(noteId) {
            if(await showPrompt('Delete note?', `Would you like to delete note "${notes[noteId].title}"?`))
            {     
                notes[noteId].delete()
                .then(() => {
                    delete notes[noteId];
                    displayNotes(notes);
                })
                .catch(err => showError('Delete note error', err));
            }
        }
    });
}

function hasToken(noteManager) { //if token is saved
    if(noteManager.userInfo == null) {
        const form = new LoginForm(noteManager);
        form.open();

        return false;
    }

    return true;
}

function displayNotes(notes) {
    const notesContainerEl = document.querySelector('#notes_container');

    notesContainerEl.innerHTML = '';
    Object.values(notes).forEach(note => note.childTo(notesContainerEl));
}

async function main() {
    let notes = {};
    const noteManager = new NoteManager('/api');

    if(!hasToken(noteManager)) {
        return;
    }

    displayUserInfo(noteManager);
    handleAccountSettings(noteManager);
    handleDelete(notes);

    const fetchNotes = () => {
        noteManager.getNotes()
        .then(ns => {
            Object.keys(notes).forEach(nk => delete notes[nk]);
            ns.forEach(note => notes[note.id] = note);
    
            displayNotes(notes);
        })
        .catch(err => showError('Error while fetching notes', err));
    }
        
    document.querySelector('#add_note').addEventListener('click', () => {
        noteManager.createNote('Unitled note', 'Lorem Ipsum')
        .then(() => fetchNotes())
        .catch(err => showError('Error while creating note', err));
    });

    fetchNotes();
}

main().catch(err => showError('An error ocured', err));