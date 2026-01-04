// ==UserScript==
// @name         Google Drive User Switcher
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Doing it better than google ever did
// @author       Me (actually mostly chatGPT lol rip)
// @website      https://github.com/sendiriaann/Gdrive-User-Switcher/tree/main
// @match        https://drive.google.com/drive/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js
// @downloadURL https://update.greasyfork.org/scripts/554375/Google%20Drive%20User%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/554375/Google%20Drive%20User%20Switcher.meta.js
// ==/UserScript==

const select = document.createElement('select');
const editBtn = document.createElement('button');
editBtn.innerHTML = '<i class="fa-solid fa-user-pen"></i>';
editBtn.style.marginLeft = '5px';

const currentUrl = window.location.href;
const match = currentUrl.match(/\/u\/(\d+)/);
const currentUser = match ? match[1] : '0';

// Get all existing users sorted by number
const getExistingUsers = () => {
    const users = [];
    for (let i = 0; i <= 20; i++) {
        if (localStorage.getItem(`gdrive_user_${i}`) !== null) {
            users.push({ number: i, name: localStorage.getItem(`gdrive_user_${i}`) });
        }
    }
    if (users.length === 0) {
        localStorage.setItem(`gdrive_user_0`, 'User 0');
        users.push({ number: 0, name: 'User 0' });
    }
    return users.sort((a, b) => a.number - b.number);
};

// Get display name for dropdown
const getUserName = (num) => localStorage.getItem(`gdrive_user_${num}`) || `User ${num}`;

function updateSelect() {
    const users = getExistingUsers();
    select.innerHTML = '';

    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.number; // Store actual user number
        option.textContent = user.name;
        if (user.number.toString() === currentUser) option.selected = true;
        select.appendChild(option);
    });

    const addOption = document.createElement('option');
    addOption.value = 'add';
    addOption.textContent = '+ Add User';
    select.appendChild(addOption);
}

updateSelect();

const container = document.createElement('div');
container.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 9999;
    display: flex;
    align-items: center;
`;

select.style.cssText = `
    padding: 8px;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    min-width: 120px;
`;

editBtn.style.cssText = `
    padding: 8px 12px;
    background: #4285f4;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
`;

select.addEventListener('change', () => {
    if (select.value === 'add') {
        const users = getExistingUsers();
        const maxNumber = Math.max(...users.map(u => u.number));
        const newNumber = maxNumber + 1;
        localStorage.setItem(`gdrive_user_${newNumber}`, `User ${newNumber}`);
        updateSelect();
        select.value = newNumber;
    } else {
        const userNum = select.value;
        const newUrl = currentUrl.includes('/u/')
            ? currentUrl.replace(/\/u\/\d+/, `/u/${userNum}`)
            : currentUrl.replace('/drive/', `/drive/u/${userNum}/`);
        window.location.href = newUrl;
    }
});

let dialog = null;

editBtn.addEventListener('click', () => {
    // If popup exists, close it
    if (dialog && document.body.contains(dialog)) {
        document.body.removeChild(dialog);
        dialog = null;
        return;
    }

    // Otherwise create new popup
    let users = getExistingUsers();

    dialog = document.createElement('div');
    dialog.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        min-width: 300px;
    `;

    function renderUserList() {
        let usersHTML = users.map((user, index) => `
            <div class="user-row" style="display: flex; align-items: center; margin-bottom: 10px; gap: 10px;">
                <span class="user-label" style="min-width: 60px;">User ${index}:</span>
                <input type="text" value="${user.name}" data-original-number="${user.number}"
                       style="flex: 1; padding: 5px; border: 1px solid #ccc; border-radius: 4px;">
                <button class="deleteBtn" data-index="${index}"
                        style="padding: 5px 10px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;"><i class="fa-solid fa-trash"></i></button>
            </div>
        `).join('');

        dialog.querySelector('#usersList').innerHTML = usersHTML;

        // Re-attach delete event listeners
        dialog.querySelectorAll('.deleteBtn').forEach(btn => {
            btn.addEventListener('click', deleteUser);
        });
    }

    dialog.innerHTML = `
        <h3 style="margin: 0 0 15px 0;">Manage Users</h3>
        <div id="usersList"></div>
        <div style="display: flex; justify-content: space-between; margin-top: 20px;">
            <button id="addUserBtn" style="padding: 5px 10px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;"><i class="fa-solid fa-user-plus"></i></button>
            <div>
                <button id="cancelBtn" style="padding: 5px 10px; margin-right: 8px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;"><i class="fa-solid fa-xmark"></i></button>
                <button id="saveBtn" style="padding: 5px 10px; background: #4285f4; color: white; border: none; border-radius: 4px; cursor: pointer;"><i class="fa-solid fa-floppy-disk"></i></button>
            </div>
        </div>
    `;

    document.body.appendChild(dialog);
    renderUserList();

    // Add new user
    dialog.querySelector('#addUserBtn').addEventListener('click', () => {
        const maxNumber = Math.max(...users.map(u => u.number), 0);
        const newNumber = maxNumber + 1;
        const newName = `User ${users.length}`;

        users.push({ number: newNumber, name: newName });
        renderUserList();
    });

    // Delete user function
    function deleteUser(e) {
        const index = e.target.getAttribute('data-index');
        if (confirm('Delete this user?')) {
            users.splice(index, 1);
            renderUserList();
        }
    }

    // Save all changes
    dialog.querySelector('#saveBtn').addEventListener('click', () => {
        // Clear all existing users
        for (let i = 0; i <= 20; i++) {
            localStorage.removeItem(`gdrive_user_${i}`);
        }

        // Save all users from the list with sequential numbers
        const inputs = dialog.querySelectorAll('input[data-original-number]');
        users = []; // Rebuild users array with sequential numbers

        inputs.forEach((input, index) => {
            const name = input.value.trim();
            if (name) {
                users.push({ number: index, name: name });
                localStorage.setItem(`gdrive_user_${index}`, name);
            }
        });

        updateSelect();
        document.body.removeChild(dialog);
    });

    // Cancel
    dialog.querySelector('#cancelBtn').addEventListener('click', () => {
        document.body.removeChild(dialog);
    });
});

container.appendChild(select);
container.appendChild(editBtn);
document.body.appendChild(container);