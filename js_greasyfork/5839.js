// ==UserScript==
// @name        Crowd Task Google Search Link 
// @author      mmmturkeybacon + ScottB
// @description Turns company name into Google search link.
// @include     https://www.mturk.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @version     0.1
// @grant       none
// @namespace https://greasyfork.org/users/6129
// @downloadURL https://update.greasyfork.org/scripts/5839/Crowd%20Task%20Google%20Search%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/5839/Crowd%20Task%20Google%20Search%20Link.meta.js
// ==/UserScript==

{ // Crowd Task Google Search Link
    var company_node = $("li:contains('Company Name:')");

    var company_text = company_node.text().trim().replace("Company Name: ", "");
    var google_URL = "http://www.google.com/search?q=" + company_text;
    google_URL = google_URL.replace("Company Name: ","").replace(/[" "]/g, "+");
    company_node.html('<a href="' + google_URL + '" target="_blank">' +company_text + '</a>');
}