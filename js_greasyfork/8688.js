// ==UserScript==
// @name        John White HIT Helper
// @author      mmmturkeybacon + ScottB
// @description Turns company name into a Google search link or turns the website address into a clickable link.
// @include     https://www.mturkcontent.com*
// @require     http://code.jquery.com/jquery-latest.min.js
// @version     1.2
// @grant       none
// @namespace https://greasyfork.org/users/6129
// @downloadURL https://update.greasyfork.org/scripts/8688/John%20White%20HIT%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/8688/John%20White%20HIT%20Helper.meta.js
// ==/UserScript==

if ( $('.panel-body:contains("Find the Company Name")').length > 0 )
{ // John White Website Search
    var company_node = $("td:contains('Website:')").next();

    var company_text = company_node.text().trim().replace("&", "%26");
    var google_URL = "http://" + company_text;
    google_URL = google_URL.replace(/[" "]/g, "+");
    company_node.html('<a href="' + google_URL + '" target="_blank">' + company_text + '</a>');
}

if ( $('.panel-body:contains("Find the website address for this School")').length > 0 )
{ // John White Website Search
    var company_node = $("td:contains('School name and location:')").next();

    var company_text = company_node.text().trim().replace("&", "%26");
    var google_URL = "http://www.google.com/search?q=" + company_text;
    google_URL = google_URL.replace(/[" "]/g, "+");
    company_node.html('<a href="' + google_URL + '" target="_blank">' + company_text + '</a>');
}

else
{ // John White Company Search
    var company_node = $("td:contains('Company Name:')").next();
    var city_node = $("td:contains('City:')").next();
    var state_node = $("td:contains('State:')").next();

    var company_text = company_node.text().trim().replace("&", "%26");
    var city_text = city_node.text().trim().replace("None Listed", "");
    var state_text = state_node.text().trim().replace("None Listed", "");
    var google_URL = "http://www.google.com/search?q=" + company_text + " " + city_text + " " + state_text;
    google_URL = google_URL.replace(/[" "]/g, "+");
    company_node.html('<a href="' + google_URL + '" target="_blank">' + company_text + '</a>');
}