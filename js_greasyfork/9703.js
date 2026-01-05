// ==UserScript==
// @name            HF Add to Group - Zero Temp.
// @namespace       Snorlax
// @description     Adds people to groups
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @include         *hackforums.net/member.php?action=profile&uid=*
// @version         1.0
// @downloadURL https://update.greasyfork.org/scripts/9703/HF%20Add%20to%20Group%20-%20Zero%20Temp.user.js
// @updateURL https://update.greasyfork.org/scripts/9703/HF%20Add%20to%20Group%20-%20Zero%20Temp.meta.js
// ==/UserScript==

var uid = $(location).attr('href').replace(/[^0-9]/g, '')
var name = $("span[class*='group']").text();

if($("img[src*='zero']").length >= 1) {
    $("span[class*='group']").after(' - <button class="remove button">Remove</button>');
} else {
    $("span[class*='group']").after(' - <button class="add button">Add</button>');
}

$(".add").click(function(){
    $.post("http://www.hackforums.net/managegroup.php",
    {
        "my_post_key": my_post_key,
        "action": "do_add",
        "gid": "44",
        "username": name
    },
        function(data,status){
        console.log("Data: " + data + "\nStatus: " + status);
        location.reload();
    });
});

$(".remove").click(function(){
    $.post("http://www.hackforums.net/managegroup.php",
    {
        "my_post_key": my_post_key,
        "action": "do_manageusers",
        "gid": "44",
        "removeuser[0]": uid
    },
        function(data,status){
        console.log("Data: " + data + "\nStatus: " + status);
        location.reload();
    });
});