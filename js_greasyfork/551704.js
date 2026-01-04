// ==UserScript==
// @name         Password Manager & Autofiller
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Secure password manager with autofill capabilities
// @author       voidofdarkness
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/551704/Password%20Manager%20%20Autofiller.user.js
// @updateURL https://update.greasyfork.org/scripts/551704/Password%20Manager%20%20Autofiller.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Encryption/Decryption utilities (simple XOR - for production use a proper crypto library)
    function simpleEncrypt(text, key) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return btoa(result);
    }

    function simpleDecrypt(encoded, key) {
        const text = atob(encoded);
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return result;
    }

    // Get master password from user
    let masterPassword = GM_getValue('master_password', '');

    // Password storage functions
    function savePassword(domain, username, password) {
        if (!masterPassword) {
            alert('Please set a master password first!');
            return;
        }
        const encrypted = simpleEncrypt(password, masterPassword);
        const key = `pwd_${domain}`;
        const data = GM_getValue(key, {});
        data[username] = encrypted;
        GM_setValue(key, data);
    }

    function getPasswords(domain) {
        if (!masterPassword) return {};
        const key = `pwd_${domain}`;
        const data = GM_getValue(key, {});
        const decrypted = {};
        for (let username in data) {
            try {
                decrypted[username] = simpleDecrypt(data[username], masterPassword);
            } catch (e) {
                console.error('Decryption failed for', username);
            }
        }
        return decrypted;
    }

    function deletePassword(domain, username) {
        const key = `pwd_${domain}`;
        const data = GM_getValue(key, {});
        delete data[username];
        GM_setValue(key, data);
    }

    // Get current domain
    const currentDomain = window.location.hostname;

    // Create UI
    function createUI() {
        const panel = document.createElement('div');
        panel.id = 'pwd-manager-panel';
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 320px;
            background: #2c3e50;
            color: #ecf0f1;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 999999;
            font-family: Arial, sans-serif;
            display: none;
        `;

        panel.innerHTML = `
            <div style="padding: 15px; border-bottom: 1px solid #34495e;">
                <h3 style="margin: 0; font-size: 16px;">🔐 Password Manager</h3>
                <button id="close-panel" style="position: absolute; top: 15px; right: 15px; background: none; border: none; color: #ecf0f1; font-size: 20px; cursor: pointer;">×</button>
            </div>
            <div style="padding: 15px;">
                <div id="master-pwd-section" style="margin-bottom: 15px;">
                    <input type="password" id="master-pwd-input" placeholder="Master Password" style="width: 100%; padding: 8px; border: 1px solid #34495e; border-radius: 4px; background: #34495e; color: #ecf0f1; box-sizing: border-box;">
                    <button id="set-master-pwd" style="width: 100%; margin-top: 8px; padding: 8px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">Set Master Password</button>
                </div>
                <div id="password-section" style="display: none;">
                    <div style="margin-bottom: 15px;">
                        <strong>Domain:</strong> ${currentDomain}
                    </div>
                    <input type="text" id="username-input" placeholder="Username" style="width: 100%; padding: 8px; margin-bottom: 8px; border: 1px solid #34495e; border-radius: 4px; background: #34495e; color: #ecf0f1; box-sizing: border-box;">
                    <input type="password" id="password-input" placeholder="Password" style="width: 100%; padding: 8px; margin-bottom: 8px; border: 1px solid #34495e; border-radius: 4px; background: #34495e; color: #ecf0f1; box-sizing: border-box;">
                    <button id="save-pwd" style="width: 100%; padding: 8px; background: #27ae60; color: white; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 15px;">Save Password</button>
                    <div id="saved-passwords" style="max-height: 200px; overflow-y: auto;">
                        <strong>Saved Accounts:</strong>
                        <div id="password-list" style="margin-top: 8px;"></div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // Toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'pwd-manager-toggle';
        toggleBtn.innerHTML = '🔐';
        toggleBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #3498db;
            color: white;
            border: none;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 999998;
        `;
        document.body.appendChild(toggleBtn);

        // Event listeners
        toggleBtn.onclick = () => {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        };

        document.getElementById('close-panel').onclick = () => {
            panel.style.display = 'none';
        };

        document.getElementById('set-master-pwd').onclick = () => {
            const pwd = document.getElementById('master-pwd-input').value;
            if (pwd.length < 4) {
                alert('Master password must be at least 4 characters!');
                return;
            }
            masterPassword = pwd;
            GM_setValue('master_password', pwd);
            document.getElementById('master-pwd-section').style.display = 'none';
            document.getElementById('password-section').style.display = 'block';
            updatePasswordList();
        };

        document.getElementById('save-pwd').onclick = () => {
            const username = document.getElementById('username-input').value;
            const password = document.getElementById('password-input').value;
            if (!username || !password) {
                alert('Please enter both username and password!');
                return;
            }
            savePassword(currentDomain, username, password);
            document.getElementById('username-input').value = '';
            document.getElementById('password-input').value = '';
            updatePasswordList();
            alert('Password saved!');
        };

        if (masterPassword) {
            document.getElementById('master-pwd-section').style.display = 'none';
            document.getElementById('password-section').style.display = 'block';
            updatePasswordList();
        }
    }

    function updatePasswordList() {
        const passwords = getPasswords(currentDomain);
        const listDiv = document.getElementById('password-list');
        listDiv.innerHTML = '';

        if (Object.keys(passwords).length === 0) {
            listDiv.innerHTML = '<div style="color: #95a5a6; font-size: 12px;">No saved passwords for this site</div>';
            return;
        }

        for (let username in passwords) {
            const itemDiv = document.createElement('div');
            itemDiv.style.cssText = 'padding: 8px; background: #34495e; margin-bottom: 8px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;';
            itemDiv.innerHTML = `
                <span style="flex: 1;">${username}</span>
                <button class="autofill-btn" data-username="${username}" style="padding: 4px 8px; background: #3498db; color: white; border: none; border-radius: 3px; cursor: pointer; margin-right: 5px; font-size: 12px;">Fill</button>
                <button class="delete-btn" data-username="${username}" style="padding: 4px 8px; background: #e74c3c; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">Delete</button>
            `;
            listDiv.appendChild(itemDiv);
        }

        // Autofill buttons
        document.querySelectorAll('.autofill-btn').forEach(btn => {
            btn.onclick = () => {
                const username = btn.dataset.username;
                const password = passwords[username];
                autofillCredentials(username, password);
            };
        });

        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.onclick = () => {
                const username = btn.dataset.username;
                if (confirm(`Delete password for ${username}?`)) {
                    deletePassword(currentDomain, username);
                    updatePasswordList();
                }
            };
        });
    }

    function autofillCredentials(username, password) {
        // Find username/email fields
        const usernameFields = document.querySelectorAll('input[type="text"], input[type="email"], input[name*="user"], input[name*="email"], input[id*="user"], input[id*="email"]');
        const passwordFields = document.querySelectorAll('input[type="password"]');

        if (usernameFields.length > 0) {
            usernameFields[0].value = username;
            usernameFields[0].dispatchEvent(new Event('input', { bubbles: true }));
            usernameFields[0].dispatchEvent(new Event('change', { bubbles: true }));
        }

        if (passwordFields.length > 0) {
            passwordFields[0].value = password;
            passwordFields[0].dispatchEvent(new Event('input', { bubbles: true }));
            passwordFields[0].dispatchEvent(new Event('change', { bubbles: true }));
        }

        alert('Credentials autofilled!');
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createUI);
    } else {
        createUI();
    }
})();