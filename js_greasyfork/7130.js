// ==UserScript==
// @name        刀塔2
// @author      onisuly
// @namespace   onisuly
// @description 刀塔2 Steam社区增强
// @include     http://steamcommunity.com/id/*
// @include     http://steamcommunity.com/profiles/*
// @version     2014.11.14
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7130/%E5%88%80%E5%A1%942.user.js
// @updateURL https://update.greasyfork.org/scripts/7130/%E5%88%80%E5%A1%942.meta.js
// ==/UserScript==

var SteamLanguage = getCookie("Steam_Language");

var txtViewId = "查看 刀塔2 ID";
var txtDotabuff = "打开 Dotabuff";
var txtDotamax = "打开 Dotamax";

if( SteamLanguage == "schinese" ) {
    txtViewId = "查看 刀塔2 ID";
    txtDotabuff = "打开 Dotabuff";
    txtDotamax = "打开 Dotamax";
}

var steamId64 = document.getElementsByName("abuseID")[0].value;
var dotaId = steamId64.substring(1, steamId64.length) - 6561197960265728;

/*Dota2 ID*/
var eDropDownMenu = document.getElementsByClassName("popup_body popup_menu shadow_content")[2];
var eMenuItem = document.createElement("a");
eMenuItem.className = "popup_menu_item";
eMenuItem.href = "#";
eMenuItem.onclick = function() {
    ShowAlertDialog(txtViewId, dotaId);
    HideMenu( 'profile_action_dropdown_link', 'profile_action_dropdown' );
    return false;
}
eMenuItem.innerHTML = "<img src=\"http://www.dota2.com/favicon.ico\">&nbsp;&nbsp;" + txtViewId;
eDropDownMenu.appendChild(eMenuItem);

/*DotaBuff*/
var eMenuItem2 = document.createElement("a");
eMenuItem2.className = "popup_menu_item";
eMenuItem2.href = "#";
eMenuItem2.onclick = function() {
    window.open("http://zh.dotabuff.com/players/" + dotaId);
    HideMenu( 'profile_action_dropdown_link', 'profile_action_dropdown' );
    return false;
}
eMenuItem2.innerHTML = "<img src=\"http://www.dotabuff.com/favicon.ico\">&nbsp;&nbsp;" + txtDotabuff;
eDropDownMenu.appendChild(eMenuItem2);

/*DotaMax*/
var eMenuItem3 = document.createElement("a");
eMenuItem3.className = "popup_menu_item";
eMenuItem3.href = "#";
eMenuItem3.onclick = function() {
    window.open("http://www.dotamax.com/player/detail/" + dotaId);
    HideMenu( 'profile_action_dropdown_link', 'profile_action_dropdown' );
    return false;
}
eMenuItem3.innerHTML = "<img src=\"http://www.dotamax.com/static/image/favicon.ico\">&nbsp;&nbsp;" + txtDotamax;
eDropDownMenu.appendChild(eMenuItem3);

function getCookie(c_name) {
    if ( document.cookie.length > 0 ) {
        c_start = document.cookie.indexOf(c_name + "=");
        if ( c_start != -1 ) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";",c_start);
            if(c_end == -1) c_end = document.cookie.length;
            return unescape( document.cookie.substring(c_start,c_end) );
        }
    }
    return "";
}