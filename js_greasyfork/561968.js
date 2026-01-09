// ==UserScript==
// @name         Dealer Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This makes HRMS more user friendly and easy to use for dealers
// @author       You
// @match        https://hrms.indianrail.gov.in/HRMS/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.in
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561968/Dealer%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/561968/Dealer%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $(document).ready(function() {
    var currentUrl = window.location.href;
 
    if (currentUrl === "https://hrms.indianrail.gov.in/HRMS/assign-bill-unit") {
        console.log('On Assign Bill Unit page');

        var ids = prompt('Enter HRMS ids with comma').replace(/\s+/g, '').split(",");
        for (i = 0; i < ids.length; i++) {
            $("#addRowButton").click(); console.log(ids[i]); $("#ipasEmployeeId" + i).val(ids[i]).change();
        }
    }

    else if (currentUrl === "https://hrms.indianrail.gov.in/HRMS/cadre-management/seniority-list-updation-status#") {

        $("#cadre-heirarchy-reset").after('<button type="button" onclick="serializeSeniority()" class="btn btn-primary-grad" id="serialize-seniority">Serialize</button>');
    }



    else {
        console.log('Not on expected pages. Current URL:', currentUrl);
    }

	window.serializeSeniority = function () {
		$("input.seniorityPosition").each(function(i) {
			$(this).val(i+1);
		});
	}

    window.delay = function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

	window.exit = function () {
		throw new Error('This is not an error. This is just to abort javascript');
	} 
});

})();