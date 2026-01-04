// ==UserScript==
// @name         Auto Login to Salsabeel Cars
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically log in and redirect to car list page on salsabeelcars.site
// @author       muftypro
// @match        https://salsabeelcars.site/index.php/login
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548219/Auto%20Login%20to%20Salsabeel%20Cars.user.js
// @updateURL https://update.greasyfork.org/scripts/548219/Auto%20Login%20to%20Salsabeel%20Cars.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if we are on the login page
    if (window.location.href === "https://salsabeelcars.site/index.php/login") {

        // Fill in the email
        document.querySelector("#username").value = "admin@salsabeel.com";

        // Fill in the password
        document.querySelector("#password").value = "12340ookhjmilclo";

        // Click the login button
        document.querySelector("#login_form > div:nth-child(4) > div > span").click();

        // After a delay (to simulate loading), redirect to the car list page
        setTimeout(function() {
            window.location.href = "https://salsabeelcars.site/index.php/admin/car_list";
        }, 2000); // Wait for 2 seconds to ensure login is processed
    }
})();