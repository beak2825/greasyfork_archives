// ==UserScript==
// @name         EMB Auto Login
// @namespace    http://www2.hci.edu.sg/t0111066c
// @version      0.1
// @description  auto login script for EMB HCI
// @author       Yeo Xing Yee
// @match        http://messages.hci.edu.sg/smb/hs_student
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9292/EMB%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/9292/EMB%20Auto%20Login.meta.js
// ==/UserScript==
    document.getElementsByName("userid")[0].value= ""; // Enter your username here
    document.getElementsByName("password")[0].value= ""; // Enter your password here
    document.getElementsByName("login")[0].click();