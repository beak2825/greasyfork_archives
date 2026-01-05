// ==UserScript==
// @name            Hack Forums Add to Group - Specialists Mod
// @namespace       Originally Snorlax - Modded by Roger Waters for Specialists
// @description     Adds people to groups
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @include         *hackforums.net/member.php?action=profile&uid=*
// @version         1.3.2
// @downloadURL https://update.greasyfork.org/scripts/6709/Hack%20Forums%20Add%20to%20Group%20-%20Specialists%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/6709/Hack%20Forums%20Add%20to%20Group%20-%20Specialists%20Mod.meta.js
// ==/UserScript==

var uid = $(location).attr('href').replace(/[^0-9]/g, '')
var name = $("span[class*='group']").text();

if($("img[src*='brotherhood']").length >= 1) {
    $("span[class*='group']").after(' - <button class="remove button">Remove from Specialists</button>');
} else {
    $("span[class*='group']").after(' - <button class="add button">Add to Specialists</button>');
}

$(".add").click(function(){
    $.post("http://www.hackforums.net/managegroup.php",
    {
        "my_post_key": my_post_key,
        "action": "do_add",
        "gid": "23",
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
        "gid": "23",
        "removeuser[0]": uid
    },
        function(data,status){
        console.log("Data: " + data + "\nStatus: " + status);
        location.reload();
    });
});