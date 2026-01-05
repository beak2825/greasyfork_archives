// ==UserScript==
// @name         Login devcloud
// @grant GM_setValue
// @grant GM_getValue
// @grant GM.setValue
// @grant GM.getValue
// @namespace    https://tiss.tuwien.ac.at/
// @match https://*.tiss.tuwien.ac.at/*
// @match https://*.apps.dev.csd.tuwien.ac.at/*
// @version      2025-12-12
// @description  Login as Admin on TISS dev instances (Only works if passwords are saved/autcompleted by the browser)
// @author       Kristóf Cserpes
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/559094/Login%20devcloud.user.js
// @updateURL https://update.greasyfork.org/scripts/559094/Login%20devcloud.meta.js
// ==/UserScript==

function createAdminLoginButton () {
    var adminLoginButton = document.createElement('span');
    adminLoginButton.style.fontWeight = 'bold';
    adminLoginButton.style.backgroundColor = '#ffe6e6';
    adminLoginButton.style.border = '2px dotted red';
    adminLoginButton.style.margin = '2px';
    adminLoginButton.style.padding = '2px';
    adminLoginButton.style.cursor = 'poiner';
    adminLoginButton.addEventListener('mouseover', function(){
        adminLoginButton.style.backgroundColor = '#ff8080';

    });
    adminLoginButton.addEventListener('mouseout', function(){
        adminLoginButton.style.backgroundColor = '#ffe6e6';

    });
    return adminLoginButton;
}


function addLoginButton() {
    if (!isTissDevInstance()) {
        return;
    }
    var loginLink = document.querySelectorAll('a[href="/admin/authentifizierung"]')[0];
    if (loginLink == undefined) {
        return
    }
    var container = loginLink.parentNode.parentNode;
    var adminLoginButton = createAdminLoginButton();
    adminLoginButton.innerText = "Login as Admin";
    container.appendChild(adminLoginButton);
    adminLoginButton.addEventListener('click', function () {
        GM_setValue('login-devcloud-state', 'admin-login-clicked');
        loginLink.click();
    });
}


function loginSSO() {
    setTimeout(function() {
        var signInButton = document.getElementById('kc-login');
        GM_setValue('login-devcloud-state', 'sso-logged-in');
        signInButton.click();
    }, 1000);

};


function clickOnBenutzerWechseln () {
    GM_setValue('login-devcloud-state', 'on-benutzer-wechseln');
    window.location.href = '/admin/authentifizierung/benutzer_wechseln';
};

function loginAsAdmin () {
    var container = document.getElementById('contentInner');
    var link = container.querySelector('a[rel=nofollow]');
    GM_setValue('login-devcloud-state', undefined);
    link.click();
};


function isTissDevInstance () {
    var devInfoElement = document.getElementById('development-info');
    return devInfoElement !== null;
}


(function() {
    var state = GM_getValue('login-devcloud-state');
    if (state == undefined) {
        addLoginButton();
        return;
    };
    switch(state) {
        case 'admin-login-clicked':
            loginSSO();
            break;
        case 'sso-logged-in':
            clickOnBenutzerWechseln();
            break;
        case 'on-benutzer-wechseln':
            loginAsAdmin();
            break;
        default:
            console.error("Unknown state: " + state);
            GM_setValue('login-devcloud-state', undefined);
    }
})();