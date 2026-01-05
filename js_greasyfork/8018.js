// ==UserScript==
// @name        Stephanie Hass ZIP Lookup
// @author      mmmturkeybacon + ScottB
// @description Turns company name into a Google Maps search link.
// @include     https://www.mturkcontent.com*
// @require     http://code.jquery.com/jquery-latest.min.js
// @version     1.0
// @grant       none
// @namespace https://greasyfork.org/users/6129
// @downloadURL https://update.greasyfork.org/scripts/8018/Stephanie%20Hass%20ZIP%20Lookup.user.js
// @updateURL https://update.greasyfork.org/scripts/8018/Stephanie%20Hass%20ZIP%20Lookup.meta.js
// ==/UserScript==

{ // Stephanie Haas ZIP Lookup 
    var company_node = $("p:contains('Restaurant Name:')").children('strong');
    var address_node = $("p:contains('Address:')").children('b');
    var city_text = $("p:contains('City:')").children('b').text().trim();
    var state_text = $("p:contains('State:')").children('b').text().trim();
    var country_text = $("p:contains('Country:')").children('b').text().trim();

    var company_text = company_node.text().trim().replace("&", "%26");
    var address_text = address_node.text().trim().replace("#", "%23");
    var google_URL = "http://maps.google.com/?q=" + company_text + " " + address_text + " " + city_text + " " + state_text + " " + country_text;
    google_URL = google_URL.replace("Business Name: ","").replace(/[" "]/g, "+");
    company_node.html('<a href="' + google_URL + '" target="_blank">' + company_text + '</a>');
}