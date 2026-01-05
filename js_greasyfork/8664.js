// ==UserScript==
// @name           Politics and War Mass Messenger
// @description    Mass Messenger for Politics and War
// @include        https://politicsandwar.com/*
// @version        0.1
// @require		   http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @grant		   GM_setValue
// @grant		   GM_deleteValue
// @grant		   GM_getValue
// @grant          GM_xmlhttpRequest
// @namespace      https://greasyfork.org/users/3941
// @downloadURL https://update.greasyfork.org/scripts/8664/Politics%20and%20War%20Mass%20Messenger.user.js
// @updateURL https://update.greasyfork.org/scripts/8664/Politics%20and%20War%20Mass%20Messenger.meta.js
// ==/UserScript==
var pathAll = window.location.pathname.split('/');
var path = pathAll[1];
var search = window.location.search;
if(GM_getValue('recips', "") != ""){
    var recipArray = JSON.parse(GM_getValue('recips', ""));
    var recipLength = recipArray.length;
}else{
    var recipArray = "";
    var recipLength = "0";
}

jQuery('#leftcolumn').append('<div id="pwMessenger" class="well"><a href="https://politicsandwar.com/inbox/message/">Create Message</a><br /><button type="button" class="btn btn-danger btn-xs removeRecips" style="margin-bottom:2px;"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span>Remove All<span class="badge" id="recipCounter" style="margin-left:4px;">' + recipLength + '</span></button><br /><div id="recipList"></div></div>');

if(search.indexOf('id=15') >= 0 || path == "nations"){
    jQuery('th:first-child').append('<button type="button" class="btn btn-default btn-xs addAllMessenger" style="margin-left: 2px;"><span class="glyphicon glyphicon-envelope" aria-hidden="true"></span></button>');
    jQuery('td:first-child').append('<button type="button" class="btn btn-default btn-xs addMessenger" style="margin-left: 2px;"><span class="glyphicon glyphicon-envelope" aria-hidden="true"></span></button>');
}

if(pathAll[2] == "message"){
     var ccBox = "";
    if(GM_getValue('recips', "") != ""){
        for(i = 0; i < recipArray.length; i++){
            if(i == recipArray.length - 1){
                ccBox += recipArray[i];
            }else{
                ccBox += recipArray[i] + ",";
            }
        }
        jQuery('input[name="carboncopy"]').val(ccBox);
    }
}

for(i = 0; i < recipArray.length; i++){
    jQuery('#recipList').append('<button type="button" class="btn btn-default btn-xs clickRemove"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' + recipArray[i] + '</button><br />');
} 

jQuery('.addMessenger').on('click', function() {
    var leaderName = jQuery(this).closest('td').next().clone().find('a').remove().end().text().trim();
    if(GM_getValue('recips', "") != ""){
        recipArray = JSON.parse(GM_getValue("recips", ""));
        if(recipArray.indexOf(leaderName) == -1 && recipArray.length < 20){
            recipArray.push(leaderName);
        }
    } else {
        recipArray = [leaderName];
    }
    GM_setValue('recips', JSON.stringify(recipArray));
    jQuery('#recipList').empty();
    for(i = 0; i < recipArray.length; i++){
        jQuery('#recipList').append('<button type="button" class="btn btn-default btn-xs clickRemove"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' + recipArray[i] + '</button><br />');
    }
});

jQuery('.addAllMessenger').on('click', function() {
    jQuery(this).closest('table').find('tr:not(:first-child)').each(function() {
        var leaderName = jQuery(this).find('td:eq(1)').clone().find('a').remove().end().text().trim();
        if(GM_getValue('recips', "") != "" && leaderName != ""){
            recipArray = JSON.parse(GM_getValue("recips", ""));
            if(recipArray.indexOf(leaderName) == -1 && recipArray.length < 20){
                recipArray.push(leaderName);
            }
        } else {
            recipArray = [leaderName];
        }
        GM_setValue('recips', JSON.stringify(recipArray));
    });
    jQuery('#recipList').empty();
    for(i = 0; i < recipArray.length; i++){
        jQuery('#recipList').append('<button type="button" class="btn btn-default btn-xs clickRemove"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' + recipArray[i] + '</button><br />');
    }
});

jQuery('#pwMessenger').on('click', '.clickRemove', function() {
    var removeName = jQuery(this).text();
    recipArray = JSON.parse(GM_getValue('recips'));
    recipArray.splice(recipArray.indexOf(removeName),1);
    GM_setValue('recips', JSON.stringify(recipArray));
    jQuery('#recipList').empty();
    for(i = 0; i < recipArray.length; i++){
        jQuery('#recipList').append('<button type="button" class="btn btn-default btn-xs clickRemove"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' + recipArray[i] + '</button><br />');
    }
});

jQuery('#recipList').bind('DOMNodeInserted DOMNodeRemoved', function() {
    recipArray = JSON.parse(GM_getValue('recips'));
    jQuery('#recipCounter').text(String(recipArray.length));
    
});

jQuery('#pwMessenger').on('click', '.removeRecips', function() {
    GM_deleteValue("recips");
    jQuery('#recipList').empty();
    jQuery('#recipCounter').text("0");
});