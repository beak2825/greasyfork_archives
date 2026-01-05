// ==UserScript==
// @name            LeakForums | Hide certain section's threads from the "View New Posts" page.
// @namespace       Beware
// @description     Hide certain section's threads from the "View New Posts" page.
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @include         *leakforums.org/search.php*
// @version         1.0
// @downloadURL https://update.greasyfork.org/scripts/8338/LeakForums%20%7C%20Hide%20certain%20section%27s%20threads%20from%20the%20%22View%20New%20Posts%22%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/8338/LeakForums%20%7C%20Hide%20certain%20section%27s%20threads%20from%20the%20%22View%20New%20Posts%22%20page.meta.js
// ==/UserScript==

sections = ["Enter", "Enter", "Enter", "Enter"]

if($("a:contains('Last Post')").length) {
    $("strong:contains('Search Results')").append(" - Hiding: " + sections.join(", "));
    console.log("VIEW NEW POSTS PAGE");
    for(i=0; i<sections.length; i++) {
        $("a:contains("+sections[i]+")").closest("tr").hide();
    }
} 