// ==UserScript==
// @name         Torn Airport Quick Link
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a small airplane icon at top left that links to the airport
// @author       SharmZ
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/560485/Torn%20Airport%20Quick%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/560485/Torn%20Airport%20Quick%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS for the airplane box
    GM_addStyle(`
        #airport-quick-link {
            position: fixed;
            top: 80px;
            left: 370px;
            width: 90px;
            height: 60px;
            background-color: #22353c;
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: all 0.2s;
        }
        #airport-quick-link:hover {
            transform: scale(1.1);
            background-color: #22353c;
        }
        #airport-quick-link::after {
            content: "✈";
            color: white;
            font-size: 18px;
        }
    `);

    // Create the airplane box element
    const airportLink = document.createElement('div');
    airportLink.id = 'airport-quick-link';
    airportLink.title = 'Go to Airport';

    // Add click handler to navigate to airport
    airportLink.addEventListener('click', function() {
        window.location.href = '/page.php?sid=travel';
    });

    // Add the element to the page
    document.body.appendChild(airportLink);
})();