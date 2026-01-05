// ==UserScript==
// @name        Bypass Highland Coffee
// @namespace   https://greasyfork.org/en/users/10166-moriarty
// @description Go fight HighlandCoffee hotspot!
// @author      Moriarty
// @include     http://*
// @include     https://*
// @version     0.1.2
// @license	GNU/GPL v3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8944/Bypass%20Highland%20Coffee.user.js
// @updateURL https://update.greasyfork.org/scripts/8944/Bypass%20Highland%20Coffee.meta.js
// ==/UserScript==
var docTitle = document.title;
var searchText = 'Viet Thai International | Connect';
var isHighlandCoffee = (docTitle === searchText) ? true : false;
if (isHighlandCoffee) {
    console.info('Fucking HighlandCoffee HotSpot...');
    document.getElementsByName('redir')[0].value = window.location.href;
    document.forms[0].submit();
} else {
    console.warn('There is no hotspot to bypass, fuck Highland!');
}
