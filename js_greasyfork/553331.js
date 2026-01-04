// ==UserScript==
// @name         lms du learn 
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Автоматическая переадресация (DU, LMS, Learn)
// @author       @thelouisv
// @match        https://du.astanait.edu.kz/login
// @match        *://learn.astanait.edu.kz/*
// @match        https://lms.astanait.edu.kz/login/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553331/lms%20du%20learn.user.js
// @updateURL https://update.greasyfork.org/scripts/553331/lms%20du%20learn.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const url = window.location.href;
 
    if (url === "https://du.astanait.edu.kz/login") {
        window.location.href = "https://login.microsoftonline.com/158f15f3-83e0-4906-824c-69bdc50d9d61/oauth2/v2.0/authorize?client_id=9f15860b-4243-4610-845e-428dc4ae43a8&response_type=code&redirect_uri=https%3A%2F%2Fdu.astanait.edu.kz%2Flogin&response_mode=query&scope=offline_access%20user.read%20mail.read&state=12345";
    }
 
    else if (url === "https://learn.astanait.edu.kz/") {
        window.location.replace("https://learn.astanait.edu.kz/login?next=%2F");
    }
    else if (url.startsWith("https://learn.astanait.edu.kz/login")) {
        window.location.replace("http://learn.astanait.edu.kz/auth/login/azuread-oauth2/?auth_entry=login&next=%2F");
    }
 
    else if (url.startsWith("https://lms.astanait.edu.kz/login/")) {
        window.location.href = "https://lms.astanait.edu.kz/auth/oidc/?source=loginpage";
    }
 
})();