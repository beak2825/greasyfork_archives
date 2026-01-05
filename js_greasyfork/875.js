// ==UserScript==
// @name        GameFAQs - Private Board invite button on message list
// @namespace   http://userscripts.org/scripts/source/181911.user.js
// @description GameFAQs - Private Board invite button on message list descr
// @include     http://www.gamefaqs.com/boards/*
// @version     1.83
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/875/GameFAQs%20-%20Private%20Board%20invite%20button%20on%20message%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/875/GameFAQs%20-%20Private%20Board%20invite%20button%20on%20message%20list.meta.js
// ==/UserScript==
var boardNumbers = [
    "848", "850"
]; //Board Numbers

var inviteTexts = [
    "Invite to Hardcore", "Invite to 850"
]; //Text for invite link


//Do not edit below this line unless you know what you're doing.
var msg_stats_arr = document.getElementsByClassName('msg_infobox');
var user_key = document.forms[1].key.value;
for (var i = 0; i < msg_stats_arr.length; i++) {
    if (msg_stats_arr[i].getElementsByClassName('msg_deleted').length == 0) {
        var username_arr = msg_stats_arr[i].getElementsByClassName('name')[0].childNodes[0];
        var username = username_arr.textContent;

        for (var j = 0; j < boardNumbers.length; j++) {
            var form = document.createElement('form');
            form.setAttribute("action", "http://www.gamefaqs.com/boardaction/" + boardNumbers[j] + "-?admin=1");
            form.setAttribute("method", "post");
            form.setAttribute("style", "display:none;");
            form.setAttribute("name", j + "gm_invite_" + i);

            var inputName = document.createElement('input');
            inputName.setAttribute("type", "hidden");
            inputName.setAttribute("name", "target_text");
            inputName.setAttribute("value", username);

            var inputKey = document.createElement('input');
            inputKey.setAttribute("type", "hidden");
            inputKey.setAttribute("name", "key");
            inputKey.setAttribute("value", user_key);

            var action = document.createElement('input');
            action.setAttribute("type", "hidden");
            action.setAttribute("name", "action");
            action.setAttribute("value", "addmember");

            var inviteLink = document.createElement('input');
            inviteLink.setAttribute("type", "button");
            inviteLink.setAttribute("onclick", "document.forms['" + j + "gm_invite_" + i + "'].submit();");
            if (j == 0) {
                inviteLink.setAttribute("style", "margin-left:10px;");
            }
            inviteLink.setAttribute("value", inviteTexts[j]);


            msg_stats_arr[i].appendChild(inviteLink);
            inviteLink.appendChild(form);
            form.appendChild(inputName);
            form.appendChild(inputKey);
            form.appendChild(action);
        }
    }
}