// ==UserScript==
// @name            Hack Forums - Notify xadamxk with reports
// @namespace       Snorlax
// @description     Adds buttons to post to 'quick report' them; sends PM of reported post.
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_xmlhttpRequest
// @include         *hackforums.net/showthread.php*
// @version         1.0
// @downloadURL https://update.greasyfork.org/scripts/6445/Hack%20Forums%20-%20Notify%20xadamxk%20with%20reports.user.js
// @updateURL https://update.greasyfork.org/scripts/6445/Hack%20Forums%20-%20Notify%20xadamxk%20with%20reports.meta.js
// ==/UserScript==

username = "xadamxk";
my_post_key = unsafeWindow.my_post_key;

$(".post_management_buttons").prepend("<a href='javascript:void(0)' class='bitButton quickReport'>S Report</a>");

$(".quickReport").on("click", function() {
    message = "[url=http://hackforums.net/" + encodeURIComponent($(this).parentsUntil("table[id*='post_']").parent().find("a[href*='showthread.php?tid=']").attr("href")) + "]This post needs moderation[/url]";
    if(confirm("Are you sure you wish to report this?") == true) {
        console.log("Sending PM to " + username + " with message: " + message);
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://hackforums.net/private.php",
            data: "my_post_key=" + my_post_key + "&to=" + username + "&bcc=&subject=Quick%20Report&message_new=" + message + "&message=" + message + "&options%5Bsignature%5D=1&options%5Bsavecopy%5D=1&options%5Breadreceipt%5D=1&action=do_send&pmid=&do=&submit=Send+Message",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Referer": "http://www.hackforums.net/private.php?action=send"
            }
        });
    }
});