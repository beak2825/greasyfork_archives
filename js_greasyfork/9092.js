// ==UserScript==
// @name         tf2pug.me userscript
// @namespace    tf2pug.me
// @include      http://www.tf2pug.me/
// @include      http://www.tf2pug.me/*
// @version      6.9
// @description  makes website dark and spooky like my soul
// @author       null
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/9092/tf2pugme%20userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/9092/tf2pugme%20userscript.meta.js
// ==/UserScript==

var pugme =
    "@import url(http://fonts.googleapis.com/css?family=Roboto);" +
    "body {background: url('http://i.imgur.com/3Nax3vM.png'); color: #fff;}" +
    "header {color: #fff; background: rgba(255,255,255,0.1);}" +
    "main {background: rgba(255,255,255,0.1);}" +
    "footer {color: #fff; background: rgba(255,255,255,0.1); !important}" +
    "a, h4, h2, h3, ul, li {color: #fff;}" +
    "h1 {font-family: 'Roboto', sans-serif;color:#fff;}" +
    "a:link {color: #fff;}" +
    "a:visited {color: #fff;}" +
    "a:hover {color: #ccc;background: rgba(0,0,0,0);}" + 
    "a:active {color: #fff;}" +
    "#captainlist {color: #fff;}" +
    "#playerCount {color: #fff;margin-bottom:5px;}" +
    "a.header-button {border:0;}" +
    "a.header-button:hover {background:0;}" +
    ".class-header {color: #fff;background: rgb(27,27,27);border:0;}" +
    "#userpanel {border:0;}" +
    "#userpanel:hover {background:0;}" +
    "a#mumblelink {background:0;}" +
    "h4.modal-title, .bootbox-body {color: #000;}" +
    "#chat {border: 0;}" +
    "#rulesheader.noselect {background: 0;}" +
    "#aboutheader.noselect {background: 0;}" +
    ".message {color: #fff; background: rgb(50,50,50);border:1px rgb(50,50,50);}" + 
    "div.player.noselect {border:0;color: #fff;background: rgb(50,50,50);}" +
    "span.chat-user {border: 0;color: #fff;background: rgb(27,27,27);}" +
    "#chat-users {border: 0;color: #fff;background: rgb(27,27,27);}" +
    "#chat-users:hover {border: 0;color: #000;background: rgb(27,27,27);}" +
    ".chat-user:hover {border: 0;color: #ccc;background: rgb(27,27,27);}" +
    "#chat-messages {color: #000; background: rgb(27,27,27);}" +
    "#chatMessage {color: #fff); background: rgb(27,27,27);border:0;}" +
    "pre {color: #fff;margin: 0 auto;margin-bottom: 7px;padding: 30px 0 30px 21px;background: rgba(255,255,255,0.1);border-radius: 2px;width: 800px;min-height: 450px;}}"
GM_addStyle(pugme);