// ==UserScript==
// @name      Hack Forums - Request Warning Tool
// @namespace      Tony (the tiger) Stark
// @description     Request Warnings Easier To Clipboard
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @grant      GM_setClipboard
// @include      *hackforums.net/showthread.php?tid=*
// @version      1.0
// @downloadURL https://update.greasyfork.org/scripts/9503/Hack%20Forums%20-%20Request%20Warning%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/9503/Hack%20Forums%20-%20Request%20Warning%20Tool.meta.js
// ==/UserScript==

text = '<select class="request" style="width: 120px"> \
<option>Select request</option> \
<option>Adult Content</option> \
<option>Forum Advertising</option> \
<option>Copyright Infringement</option> \
<option>Cross Posting</option> \
<option>Disallowed Blackhat Activity</option> \
<option>Donation Begging</option> \
<option>Flame, Threat, Harassment</option> \
<option>Infected Download or Link</option> \
<option>Leeched Post</option> \
<option>Low Quality</option> \
<option>Market Cross Posting</option> \
<option>Marketplace Violation</option> \
<option>Not In Marketplace</option> \
<option>Unrelated or Off Topic Post</option> \
<option>Personal Data</option> \
<option>Post to PM</option> \
<option>Profile Violation</option> \
<option>Reputation Abuse</option> \
<option>Spam Posting</option> \
<option>Vouch Begging</option> \
<option>Wrong Forum</option> \
<option>Other</option> \
</select>';

$(".post_management_buttons").prepend(text);

$(".request").on("change", function() {
    if($(this).val() != "Select one") {
      url = "http://hackforums.net/" + $(this).parentsUntil("table[id*='post_']").parent().find("a[href*='showthread.php?tid=']").attr("href");
      optionSelected = $(this).find('option:selected').text();
      GM_setClipboard("[list][url=" + url + "]" + optionSelected + "[/url][/list]");
    }
});