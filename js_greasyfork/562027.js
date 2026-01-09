// ==UserScript==
// @name         bonk chat
// @namespace    http://tampermonkey.net/
// @version      1.2.0beta2
// @description  Displays images in chat.
// @author       Apx
// @match        https://bonk.io/gameframe-release.html
// @match        https://bonkisback.io/gameframe-release.html
// @require      https://cdnjs.cloudflare.com/ajax/libs/emojione/4.5.0/lib/js/emojione.min.js
// @run-at       document-body
// @license      MIT
// @grant        none
// @unwrap
// @downloadURL https://update.greasyfork.org/scripts/562027/bonk%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/562027/bonk%20chat.meta.js
// ==/UserScript==

/* WARN!!! THIS SCRIPT ISN'T COMPATIBLE WITH BONK COMMANDS (by LEGENDBOSS123) */

const settings = {
    autoShowImages: true,
    ingameImages: true,
    notify: true,
    notifyOnReply: true,
    maxMessages: 500,
    emojiLimit: 10,
    emojiNameMaxLength: 32,
};

if(!window.chatCommands) window.chatCommands = [];
window.chatCommands = window.chatCommands.concat([
    /*{
        name: 'test',
        description: 'prints test',
        parameters: ['"parameter"'],
        source: 'Bonk Chat',
        callback: function(param) {
            showStatusMessage(`* test [${param}]`);
        }
    },*/
    {
        name: 'help',
        description: 'Get started',
        source: 'Bonk Chat',
        callback: function() {
            window.chatCommands.forEach( cmd => {
                if(cmd.builtin && (cmd.hostOnly? hostId == selfId : true)) {
                    showStatusMessage(`/${cmd.name}${cmd.parameters? ' ' + cmd.parameters.join(' ') : ''}`);
                }
            })
            showStatusMessage('All aviable commands are listed above');
        }
    },
    {
        name: 'clear',
        description: 'Clears chat history',
        builtin: true
    },
    {
        name: 'balance',
        parameters: ['"user name"', '-100 to 100'],
        description: 'Balances a specific player',
        hostOnly: true,
        builtin: true
    },
    {
        name: 'roomname',
        parameters: ['"New Room Name"'],
        description: 'Sets new room name',
        hostOnly: true,
        builtin: true
    },
    {
        name: 'roompass',
        parameters: ['"New Room Name"'],
        description: 'Sets new room password',
        hostOnly: true,
        builtin: true
    },
    {
        name: 'clearroompass',
        description: 'Clears room password',
        hostOnly: true,
        builtin: true
    },
    {
        name: 'kick',
        parameters: ['"user name"'],
        description: 'Kicks a specific player, player can join the same room after being kicked',
        hostOnly: true,
        builtin: true
    },
    {
        name: 'ban',
        parameters: ['"user name"'],
        description: 'Bans a specific player',
        hostOnly: true,
        builtin: true
    },
    {
        name: 'mute',
        parameters: ['"user name"'],
        description: 'Mutes a specific player, wont be muted for everyone',
        builtin: true
    },
    {
        name: 'unmute',
        parameters: ['"user name"'],
        description: 'Unmutes a specific player, wont be unmuted for everyone',
        builtin: true
    },
    {
        name: 'move',
        parameters: ['"user name"', 'ffa or spec'],
        description: 'Moves the player to ffa or spec',
        hostOnly: true,
        builtin: true
    },
    {
        name: 'lock',
        description: 'Locks teams',
        hostOnly: true,
        builtin: true
    },
    {
        name: 'unlock',
        description: 'Unlocks teams',
        hostOnly: true,
        builtin: true
    },
    {
        name: 'fav',
        description: 'Favourites current map',
        builtin: true
    },
    {
        name: 'unfav',
        description: 'Unfavouritess current map',
        builtin: true
    },
    {
        name: 'curate',
        parameters: ['"comment" (optional)'],
        description: 'Curates current map, ignore this if you are not curator',
        builtin: true
    },
    {
        name: 'curateyes',
        description: 'Confirms current map curation, ignore this if you are not curator',
        builtin: true
    },
    {
        name: 'curateno',
        description: 'Cancels current map curation, ignore this if you are not curator',
        builtin: true
    },
]);

let send = function() {};
let playerList = null;
let hostId = -1;
let selfId = -1;

let CSS = document.createElement('style');
CSS.id = 'bonkChatUserscript';
CSS.innerHTML = `
#newbonklobby_chat_content {
   padding: 2px 4px;
}
.newbonklobby_chat_msg_colorbox {
    width: 12px;
    position: absolute;
    top: 8px;
    left: 8px;
    scale: 2;
    user-select: none;
}
.newbonklobby_chat_msg_topname {
    margin-top: 0;
    display: block;
    font-size: 12px;
    margin-left: 30px;
    user-select: none;
}
.newbonklobby_chat_msg_txt {
    word-break: break-all;
    margin-left: 28px;
}
.newbonklobby_chat_msg_time {
    font-family: futurept_b1;
    font-size: 11px;
    color: #999999;
    display: inline-block;
    margin-left: 5px;
    user-select: none;
}
.newbonklobby_chat_msg_arrowtoreply {
    display: inline-block;
    height: 10px;
    width: 20px;
    margin: 10px 5px -7px 13px;
    border-left: 2px solid #b3b3b3;
    border-top: 2px solid #b3b3b3;
    border-radius: 7px 0 0;
}
.newbonklobby_chat_msg_texttoreply {
    display: inline;
    font-family: "futurept_b1";
    font-size: 14px;
    user-select: none;
}
.newbonklobby_chat_msg_replytexthref {
    color: #181818;
    text-decoration: none;
}
.newbonklobby_chat_msg_replytexthref:hover {
    text-decoration: underline;
}
#pretty_bottom {
    display: none;
}
.newbonklobby_chat_msg_texthref {
    color: #0955c7;
    font-family: "futurept_book";
    cursor: pointer;
    text-decoration: none;
}
.ingamechatmessagehref {
    color: #278fff;
    font-family: "futurept_book";
    cursor: pointer;
    text-decoration: none;
}
.newbonklobby_chat_msg_texthref:hover, .ingamechatmessagehref:hover {
    text-decoration: underline;
}
.newbonklobby_chat_image_container {
    padding: 4px 0;
    margin-left: 28px;
    display: block;
}
.newbonklobby_chat_image {
    max-height: 100px;
    max-width: calc(100% - 40px);
    border-radius: 10px;
    cursor: pointer;
}
.newbonklobby_chat_image_showbutton {
    cursor: pointer;
    display: inline-block;
    position: relative;
    width: 20px;
    height: 20px;
    background-image: url("data:image/svg+xml,%3Csvg width='18px' height='18px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: 1 1;
    bottom: 5px;
}
.newbonklobby_chat_image_showbutton:hover {
    background-color: rgba(100, 100, 100, 0.2);
}
.newbonklobby_chat_image_hidebutton {
    cursor: pointer;
    display: inline-block;
    position: relative;
    width: 20px;
    height: 20px;
    background-image: url("data:image/svg+xml,%3Csvg width='18px' height='18px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: 1 1;
    background-color: rgba(0, 0, 0, 0.2);
    bottom: 5px;
    right: 25px;
    border-radius: 5px;
}
.newbonklobby_chat_image_hidebutton:hover {
    background-color: rgba(100, 100, 100, 0.2);
}
#imagepreviewcontainer {
    width: 100%;
    height: 100%;
    position: absolute;
    visibility: hidden;
    z-index: 2;
}
#imagepreviewbehindblocker {
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.70);
}
#imagepreview {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    max-width: 80%;
    max-height: 80%;
}
.imagepreviewbutton {
    cursor: pointer;
    position: absolute;
    top: 50px;
    width: 40px;
    height: 40px;
    background-repeat: no-repeat;
    background-position: 5 5;
    background-color: rgba(64, 64, 64, 0.33);
    border: 2px solid rgba(102, 102, 102, 0.33);
    border-radius: 30px;
}
.imagepreviewbutton:hover {
    background-color: rgba(90, 90, 90, 0.33);
}
#imagepreview_close {
    right: 40px;
    background-image: url("data:image/svg+xml,%3Csvg width='30px' height='30px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z' fill='%23888'/%3E%3C/svg%3E");
}
#imagepreview_opennewtab {
    right: 100px;
    background-image: url("data:image/svg+xml,%3Csvg width='30px' height='30px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 4C11.4477 4 11 3.55228 11 3C11 2.44772 11.4477 2 12 2L20 2C21.1046 2 22 2.89543 22 4V12C22 12.5523 21.5523 13 21 13C20.4477 13 20 12.5523 20 12V5.39343L3.72798 21.6655C3.33746 22.056 2.70429 22.056 2.31377 21.6655C1.92324 21.2749 1.92324 20.6418 2.31377 20.2512L18.565 4L12 4Z' fill='%23888'/%3E%3C/svg%3E");
}
#imagepreview_link {
    right: 150px;
    background-image: url("data:image/svg+xml,%3Csvg width='30px' height='30px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M13.2218 3.32234C15.3697 1.17445 18.8521 1.17445 21 3.32234C23.1479 5.47022 23.1479 8.95263 21 11.1005L17.4645 14.636C15.3166 16.7839 11.8342 16.7839 9.6863 14.636C9.48752 14.4373 9.30713 14.2271 9.14514 14.0075C8.90318 13.6796 8.97098 13.2301 9.25914 12.9419C9.73221 12.4688 10.5662 12.6561 11.0245 13.1435C11.0494 13.1699 11.0747 13.196 11.1005 13.2218C12.4673 14.5887 14.6834 14.5887 16.0503 13.2218L19.5858 9.6863C20.9526 8.31947 20.9526 6.10339 19.5858 4.73655C18.219 3.36972 16.0029 3.36972 14.636 4.73655L13.5754 5.79721C13.1849 6.18774 12.5517 6.18774 12.1612 5.79721C11.7706 5.40669 11.7706 4.77352 12.1612 4.383L13.2218 3.32234Z' fill='%23888'/%3E%3Cpath d='M6.85787 9.6863C8.90184 7.64233 12.2261 7.60094 14.3494 9.42268C14.7319 9.75083 14.7008 10.3287 14.3444 10.685C13.9253 11.1041 13.2317 11.0404 12.7416 10.707C11.398 9.79292 9.48593 9.88667 8.27209 11.1005L4.73655 14.636C3.36972 16.0029 3.36972 18.219 4.73655 19.5858C6.10339 20.9526 8.31947 20.9526 9.6863 19.5858L10.747 18.5251C11.1375 18.1346 11.7706 18.1346 12.1612 18.5251C12.5517 18.9157 12.5517 19.5488 12.1612 19.9394L11.1005 21C8.95263 23.1479 5.47022 23.1479 3.32234 21C1.17445 18.8521 1.17445 15.3697 3.32234 13.2218L6.85787 9.6863Z' fill='%23888'/%3E%3C/svg%3E");
}
#imagepreview_infocontainer {
    position: absolute;
    max-width: 50%;
    top: 50px;
    left: 40px;
    color: #dbdbdb;
    font-family: "futurept_b1";
    text-shadow: 1px 1px 3px black;
}
#newbonklobby_chat_actionmenu {
    background-color: #b8cdd0;
    position: absolute;
    padding: 0 5px 5px 5px;
    border-radius: 5px;
    z-index: 99;
    box-shadow: 2px 3px 5px -2px rgb(0 0 0 / 63%);
    display: none;
}
.newbonklobby_chat_actionmenu_button {
    margin-top: 5px;
    width: 145px;
}
.newbonklobby_chat_actionmenu_overline {
    margin-top: 5px;
    width: 145px
    height: 1px;
    background-color: #a5acb0;
}
.newbonklobby_chat_msgselected {
    background-color: rgba(13, 125, 120, 0.12) !important;
}
#ingamechatcontent {
    pointer-events: all;
    overflow-y: scroll;
    max-height: 125px;
    margin-right: 2px;
}
#ingamechatbox {
    height: 152px;
    overflow: visible;
}
#ingamechatcontent::-webkit-scrollbar {
    background-color: transparent;
    width: 8px;
}
#ingamechatcontent::-webkit-scrollbar-track {
    background-color: transparent;
}
#ingamechatcontent::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.18);
    border-radius: 4px;
}
.ingamechatname, .ingamechatmessage {
    user-select: text;
}
.ingamechatreplytext {
    display: block;
    user-select: text;
    margin: 5px 0 -3px 15px;
    text-decoration: none;
}
.ingamechatreplyhref {
    font-size: 12px;
    color: #abababba;
    text-decoration: none;
}
.ingamechatreplyhref:hover {
    text-decoration: underline;
}
.ingamechattime {
    font-size: 12px;
    color: #ffffff8d;
    margin-left: 3px;
}
.ingamechatselected {
    background-color: rgba(13, 125, 120, 0.12) !important;
}
#ingamechatactionmenu {
    background-color: rgba(0, 0, 0, 0.2);
    position: absolute;
    padding: 0 5px 5px 5px;
    border: 1px solid white;
    border-radius: 10px;
    z-index: 99;
    box-shadow: 2px 3px 5px -2px rgb(0 0 0 / 63%);
    display: none;
    backdrop-filter: blur(5px);
}
.ingamechatactionmenuoverline {
    margin-top: 5px;
    width: 145px;
    height: 1px;
    background-color: white;
}
.ingamechatbutton {
    font-family: futurept_b1;
    letter-spacing: 0.4px;
    text-align: center;
    cursor: pointer;
    height: 21px;
    color: white;
    margin-top: 5px;
    pointer-events: all;
    border: 1px solid;
    border-radius: 5px;
}
.ingamechatbutton:hover {
    background-color: rgba(0, 0, 0, 0.4);
}
.ingamechatbuttondisabled {
    background-color: rgba(209, 82, 82, 0.3);
    pointer-events: none; !important
}
.ingamechatimagecontainer {
    padding: 4px 0;
    display: block;
}
.ingamechatimage {
    max-height: 70px;
    max-width: calc(70% - 40px);
    border-radius: 6px;
    cursor: pointer;
}
.ingamechatimageshowbutton {
    cursor: pointer;
    display: inline-block;
    position: relative;
    width: 14px;
    height: 14px;
    background-image: url("data:image/svg+xml,%3Csvg width='12px' height='12px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: 1 1;
    bottom: 3px;
}
.ingamechatimageshowbutton:hover {
    background-color: rgba(100, 100, 100, 0.2);
}
.ingamechatimagehidebutton {
    cursor: pointer;
    display: inline-block;
    position: relative;
    width: 14px;
    height: 14px;
    background-image: url("data:image/svg+xml,%3Csvg width='12px' height='12px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: 1 1;
    background-color: rgba(0, 0, 0, 0.2);
    bottom: 3px;
    right: 17px;
    border-radius: 5px;
}
.ingamechatimagehidebutton:hover {
    background-color: rgba(100, 100, 100, 0.2);
}
.newbonklobby_chat_helpcontainer {
    bottom: 26px;
    position: absolute;
    width: calc(100% - 2px);
    max-height: 142px;
    overflow-y: scroll;
    background-color: rgba(207, 216, 220, 0.9);
    left: 0;
    right: 0;
    margin: auto;
    border-radius: 10px 10px 5px 5px;
    border-bottom: 0;
    box-shadow: 1px 1px 5px -2px rgba(0, 0, 0, 0.63);
    backdrop-filter: blur(1px);
}
.newbonklobby_chat_helpcontainer::-webkit-scrollbar {
    background-color: transparent;
    width: 8px;
}
.newbonklobby_chat_helpcontainer::-webkit-scrollbar-track {
    background-color: transparent;
    margin-top: 5px;
}
.newbonklobby_chat_helpcontainer::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.18);
    border-radius: 4px;
}
.newbonklobby_chat_helptable, .ingamechathelptable {
    border-collapse: collapse;
    font-family: "futurept_b1";
    width: 97%;
    margin-left: 2.5%;
}
.newbonklobby_chat_helptable tr:nth-last-child(n + 2) {
	border-bottom: 1px solid #c2ccd1;
}
.ingamechathelptable tr:nth-last-child(n + 2) {
	border-bottom: 1px solid white;
}
.newbonklobby_chat_helptable tr, .ingamechathelptable tr {
    cursor: pointer;
    font-size: 15px;
    height: 30px;
}
.newbonklobby_chat_helptable tr:hover {
    background-color: rgba(100,100,100,0.10);
}
.ingamechathelptable tr:hover {
    background-color: rgba(0, 0, 0, 0.2);
}
.newbonklobby_chat_helpoption {
    padding: 5px;
    padding-left: 10px;
}
.newbonklobby_chat_helpoptiondesc {
    display: block;
    color: #4e4e4e;
    font-size: 14px;
    pointer-events: none;
}
.newbonklobby_chat_helpoptionright {
    padding-right: 10px;
    text-align: right;
    color: #4e4e4e;
    width: 35%;
}
.ingamechathelpcontainer {
    bottom: 26px;
    position: absolute;
    width: calc(98% - 1px);
    max-height: 142px;
    overflow-y: scroll;
    background-color: rgba(0, 0, 0, 0.2);
    left: 7px;
    border-radius: 10px 10px 5px 5px;
    border-bottom: 0;
    box-shadow: 4px 1.5px 5px -4px rgb(0 0 0 / 63%);
    backdrop-filter: blur(5px);
    height: fit-content;
    pointer-events: all;
}
.ingamechathelpcontainer::-webkit-scrollbar {
    background-color: transparent;
    width: 8px;
}
.ingamechathelpcontainer::-webkit-scrollbar-track {
    background-color: transparent;
    margin-top: 5px;
}
.ingamechathelpcontainer::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.18);
    border-radius: 4px;
}
.ingamechathelpoption {
    color: white;
    padding: 5px;
    padding-left: 10px;
}
.ingamechathelpoptiondesc {
    display: block;
    color: #e3e3e3a0;
    font-size: 14px;
    pointer-events: none;
}
.ingamechathelpoptionright {
    padding-right: 10px;
    text-align: right;
    color: #e3e3e3a0;
    width: 35%;
}
.newbonklobby_chat_msg_txt_emojiscaled {
    max-width: 42px !important;
}

`;
document.getElementsByTagName('head')[0].appendChild(CSS);

const linkRegex = /https:\/\/[a-zA-Z0-9\/\._%-]{1,}(?:\?[a-zA-Z0-9\_%=&-]{1,})?/g;
const chat = document.getElementById('newbonklobby_chat_content');
const ingameChat = document.getElementById('ingamechatcontent');
let userscriptName = '';
try {
    userscriptName = new Error().stack.split('\n    at ')[1].match(/.*?userscript.html\?name=.*?\&id=[a-f0-9-]+(?=:)/)[0];
} catch (e) {}
let messageCount = 0;
const ownEmojis = [];
const customEmojis = [];
let targetCommandId = -1;

function showStatusMessage (text, color = '#b53030', ingame) {
    let status = document.createElement("div");
    let scroll = chat.scrollTop + chat.clientHeight >= chat.scrollHeight - 5;
    let message = document.createElement("span");
    message.style.color = color;
    message.classList.add("newbonklobby_chat_status");
    message.appendChild(document.createTextNode(text));
    status.appendChild(message);
    chat.appendChild(status);
    if (chat.childElementCount > 250) {
        chat.removeChild(chat.firstChild);
    }
    if (scroll) {
        chat.scrollTop = chat.scrollHeight;
    }
    if(ingame) {
        let ingameStatus = document.createElement("div");
        let ingameMessage = document.createElement("span");
        ingameMessage.classList.add("ingamechatstatus");
        ingameMessage.appendChild(document.createTextNode(text));
        ingameStatus.appendChild(ingameMessage);
        ingameChat.appendChild(ingameStatus);
        if (ingameChat.childElementCount > 100) {
            ingameChat.removeChild(ingameChat.firstChild);
        }
        ingameChat.scrollTop = ingameChat.scrollHeight;
    }
}

function handleRepliedText (message) {
    if(message[0] == ' ') message = message.substring(1);
    if(message[0] != '"') return null;
    let textToReply = message.split('" ');
    if(textToReply.length < 2) return null;
    let reply = textToReply.slice(1).join('" ');
    textToReply = textToReply[0].substring(1).split(': ');
    if(textToReply.length < 2) return null;
    let authorToReply = textToReply[0];
    return {
        reply: reply,
        textToReply: textToReply.slice(1).join(': '),
        authorToReply: authorToReply
    };
}
function createHref (textToFind, ingame) {
    function check (text, msg) {
        let matches = text.match(/(?!<\\):[a-z0-9_~]{1,255}:/g);
        if(matches) {
            matches = matches.map( x => x.slice(1, -1) );
            const ids = matches.map( x => customEmojis.findIndex( emj => emj.name == x ) );
            for(let i = 0; i < ids.length; i++) {
                if(ids[i] != -1) {
                    text = text.replace(`:${matches[i]}:`, getUnicodeChar(ids[i]));
                }
            }
        }

        if(textToFind.endsWith('…')) {
            if(text.startsWith(textToFind.substring(0, textToFind.length - 1))) {
                let id = hrefTemplate + messageCount;
                msg.id = id;
                result = id;
            }
        } else {
            if(textToFind == text) {
                let id = hrefTemplate + messageCount;
                msg.id = id;
                result = id;
            }
        }
    }
    let hrefTemplate = ingame? 'hrefGameID' : 'hrefID';
    let result = null;
    if(ingame) {
        [...ingameChat.children].reverse().splice(1).forEach( msg => {
            if(!msg.find('ingamechatmessage')) return;
            let text = msg.find('ingamechatname').textContent + msg.find('ingamechatmessage').textContent;
            check(text, msg);
        });
    }
    else {
        [...chat.children].reverse().splice(1).forEach( msg => {
            if(!msg.find('newbonklobby_chat_msg_colorbox')) return;
            let text = msg.find('newbonklobby_chat_msg_name').textContent + msg.find('newbonklobby_chat_msg_txt').textContent;
            check(text, msg);
        });
    }
    /*if(ingame) messages = [...ingameChat.children].filter( child => child.find('ingamechatmessage') ).reverse();
    else messages = [...chat.children].filter( child => child.find('newbonklobby_chat_msg_colorbox') ).reverse();
    for(let i = 1; i < messages.length; i++) {
        let msg = messages[i];
        let text;
        if(ingame) text = msg.find('ingamechatname').textContent + msg.find('ingamechatmessage').textContent;
        else text = msg.find('newbonklobby_chat_msg_name').textContent + msg.find('newbonklobby_chat_msg_txt').textContent;
        // … IS A SINGLE CHARACTER
        if(textToFind.endsWith('…')) {
            if(text.startsWith(textToFind.substring(0, textToFind.length - 1))) {
                let id = hrefTemplate + messageCount;
                msg.id = id;
                return id;
            }
        } else {
            if(textToFind == text) {
                let id = hrefTemplate + messageCount;
                msg.id = id;
                return id;
            }
        }
    }*/
    return result;
}
function createImages (link, onload) {
    let img = new Image();
    let name = link.match(/\/[a-zA-Z0-9_%-]{1,}(?:\.[a-zA-Z0-9_%-]{1,})?(?=[^.a-zA-z0-9_%\-]|$)/g).reverse()[0].substring(1);
    img.onload = function () {
        if(!img.loaded) {
            img.onload = null;
            onload(img, name);
        }
    };
    img.src = link;
}

function copyToClipboard (text) {
    navigator.clipboard.writeText(text).catch(err => {
        console.error('Failed to copy text: ' + text, err);
    });
}
function focusChat(isInGameChat) {
    let event = document.createEvent("HTMLEvents");
    event.initEvent('keydown');
    event.keyCode = 13;
    document.dispatchEvent(event);
}

let imagePreviewContainer = document.createElement('div');
imagePreviewContainer.id = 'imagepreviewcontainer';
let imagePreviewBehindBlocker = document.createElement('div');
imagePreviewBehindBlocker.id = 'imagepreviewbehindblocker';
// image preview close button
let imagePreviewClose = document.createElement('div');
imagePreviewClose.classList.add('imagepreviewbutton');
imagePreviewClose.id = 'imagepreview_close';
imagePreviewBehindBlocker.onclick = imagePreviewClose.onclick = function () {
    window.anime({
        targets: imagePreviewContainer,
        opacity: 0,
        duration: 100,
        easing: "easeOutCubic",
        complete: () => {
            imagePreviewContainer.style.visibility = 'hidden';
        }
    });
    let imagePreview = document.getElementById('imagepreview');
    if(!imagePreview) return;
    window.anime({
        targets: imagePreview,
        scale: 0.8,
        duration: 100,
        easing: "easeOutCubic",
    });
};
// open in a new tab button
let imagePreviewTab = document.createElement('div');
imagePreviewTab.classList.add('imagepreviewbutton');
imagePreviewTab.id = 'imagepreview_opennewtab';
// '<a>' element just to have 'target' attribute
let tabA = document.createElement('a');
tabA.target = '_blank';
imagePreviewTab.onclick = () => tabA.click();

let imagePreviewLink = document.createElement('div');
imagePreviewLink.classList.add('imagepreviewbutton');
imagePreviewLink.id = 'imagepreview_link';
imagePreviewLink.onclick = () => {
    copyToClipboard(document.getElementById('imagepreview').src);
    imagePreviewLink.style.backgroundColor = 'rgba(192, 192, 192, 0.33)';
    window.anime({
        targets: imagePreviewLink,
        backgroundColor: 'rgba(64, 64, 64, 0.33)',
        duration: 800,
        easing: "easeOutCubic",
        complete: () => imagePreviewLink.removeAttribute('style')
    });
};
let imageInfo = document.createElement('div');
imageInfo.id = 'imagepreview_infocontainer';

imagePreviewContainer.appendChild(imagePreviewBehindBlocker);
imagePreviewContainer.appendChild(imagePreviewClose);
imagePreviewContainer.appendChild(imagePreviewTab);
imagePreviewContainer.appendChild(imagePreviewLink);
imagePreviewContainer.appendChild(imageInfo);

document.getElementById('newbonkgamecontainer').appendChild(imagePreviewContainer);

let contextMenu = null;

// context menu
let createButton = function (text, ingame) {
    let button = document.createElement('div');
    button.textContent = text;
    if(ingame) button.classList.add('ingamechatbutton');
    else {
        button.classList.add('brownButton');
        button.classList.add('brownButton_classic');
        button.classList.add('buttonShadow');
        button.classList.add('newbonklobby_chat_actionmenu_button');
        button.classList.add('newbonklobby_chat_actionmenu_buttonoverlined');
    }
    contextMenu.appendChild(button);
    return button;
};
let createLine = function (ingame) {
    let line = document.createElement('div');
    if(ingame) line.classList.add('ingamechatactionmenuoverline');
    else line.classList.add('newbonklobby_chat_actionmenu_overline');
    contextMenu.appendChild(line);
};

const actions = {
    copyname: (content) => {
        let button = createButton('Copy Username', content.ingame);
        button.onclick = () => {
            copyToClipboard(content.name);
            closeContextMenu();
        }
    },
    copymessage: (content) => {
        let button = createButton('Copy Message', content.ingame);
        button.onclick = () => {
            copyToClipboard(`[${content.time}] ${content.name}: ${content.message}`);
            closeContextMenu();
        }
    },
    copytext: (content) => {
        let button = createButton('Copy Text', content.ingame);
        button.onclick = () => {
            copyToClipboard(content.message);
            closeContextMenu();
        }
    },
    kickoverline: (content) => createLine(content.ingame),
    kick: (content) => {
        let button = createButton('Kick ' + content.name, content.ingame);
        let isHost = !document.getElementById('newbonklobby_startbutton').classList.contains('brownButtonDisabled');
        let id = playerList.findIndex(user => user && user.userName == content.name);
        if(isHost && id != selfId) {
            button.onclick = () => {
                if(button.textContent.startsWith('Kick ')) button.textContent = 'Sure?';
                else {
                    if(id == -1) showStatusMessage('* Player not found.', '#b53030', content.ingame);
                    else send(`42[9,{"banshortid":${id},"kickonly":true}]`);
                    closeContextMenu();
                }
            }
        }
        else {
            if(content.ingame) button.classList.add('ingamechatbuttondisabled');
            else button.classList.add('brownButtonDisabled');
        }
    },
    ban: (content) => {
        let button = createButton('Ban ' + content.name, content.ingame);
        let isHost = !document.getElementById('newbonklobby_startbutton').classList.contains('brownButtonDisabled');
        let id = playerList.findIndex(user => user && user.userName == content.name);
        if(isHost && id != selfId) {
            button.onclick = () => {
                if(button.textContent.startsWith('Ban ')) button.textContent = 'Sure?';
                else {
                    if(id == -1) showStatusMessage('* Player not found.', '#b53030', content.ingame);
                    else send(`42[9,{"banshortid":${id}}]`);
                    closeContextMenu();
                }
            }
        }
        else {
            if(content.ingame) button.classList.add('ingamechatbuttondisabled');
            else button.classList.add('brownButtonDisabled');
        }
    },
    pingoverline: (content) => createLine(content.ingame),
    ping: (content) => {
        let button = createButton('Ping', content.ingame);
        button.onclick = () => {
            focusChat();
            if(content.ingame) document.getElementById('ingamechatinputtext').value += `@${content.name}`;
            else document.getElementById('newbonklobby_chat_input').value += `@${content.name}`;
            closeContextMenu();
        }
    },
    reply: (content) => {
        let button = createButton('Reply', content.ingame);
        button.onclick = () => {
            let text = content.message;
            let inputElement;
            if(content.ingame) inputElement = document.getElementById('ingamechatinputtext');
            else inputElement = document.getElementById('newbonklobby_chat_input');
            // … IS A SINGLE CHARACTER
            if(text.length > 28) text = text.substring(0, 29) + '…';
            focusChat();
            inputElement.value = `"${content.name}: ${text}" ` + inputElement.value;
            closeContextMenu();
        }
    }
}

let hideChatAfterClose = false;
function openContextMenu (content, actions, position) {
    closeContextMenu();
    if(content.ingame) content.element.classList.add('ingamechatselected');
    else content.element.classList.add('newbonklobby_chat_msgselected');
    contextMenu = document.createElement('div');
    contextMenu.oncontextmenu = () => false;
    if(content.ingame) {
        contextMenu.id = 'ingamechatactionmenu';
        document.getElementById('ingamechatbox').appendChild(contextMenu);
        let observer;
        let callback = (mutation) => {
            if(mutation[0].target.style.visibility == 'hidden') {
                hideChatAfterClose = true;
                mutation[0].target.style.visibility = 'inherit';
            }
            observer.disconnect();
        }
        observer = new MutationObserver(callback);
        observer.observe(document.getElementById('ingamechatbox'), {attributes: true});
    }
    else {
        contextMenu.id = 'newbonklobby_chat_actionmenu';
        document.getElementById('newbonklobby_chatbox').appendChild(contextMenu);
    }
    let keys = Object.keys(actions);
    let players = [];
    for(let i = 0; i < keys.length; i++) {
        actions[keys[i]](content);
    }
    let rect = content.element.getBoundingClientRect();
    let chatRect;
    if(content.ingame) chatRect = document.getElementById('ingamechatbox').getBoundingClientRect();
    else chatRect = document.getElementById('newbonklobby_chatbox').getBoundingClientRect();
    contextMenu.style.display = 'unset';
    contextMenu.style.left = position.x - rect.x + 10;
    contextMenu.style.top = position.y - chatRect.top - (contextMenu.clientHeight * 0.4);
    if(contextMenu.getBoundingClientRect().bottom - chatRect.bottom > -10) {
        contextMenu.style.top = chatRect.height - contextMenu.clientHeight - 10;
    }
}

function closeContextMenu () {
    if(contextMenu) contextMenu.parentNode.removeChild(contextMenu);
    contextMenu = null;
    if(hideChatAfterClose) {
        hideChatAfterClose = false;
        document.getElementById('ingamechatbox').style.visibility = 'hidden';
    }
    [...chat.children].forEach( element => element.classList.remove('newbonklobby_chat_msgselected') );
    [...ingameChat.children].forEach( element => element.classList.remove('ingamechatselected') );
}

function openImagePreview (image) {
    imagePreviewContainer.style.visibility = 'inherit';
    imagePreviewContainer.style.opacity = '0';
    window.anime({
        targets: imagePreviewContainer,
        opacity: 1,
        duration: 175,
        easing: "easeOutCubic",
    });
    if(document.getElementById('imagepreview')) document.getElementById('imagepreview').remove();
    let imagePreview = image.cloneNode();
    imagePreview.classList.remove('newbonklobby_chat_image');
    imagePreview.id = 'imagepreview';
    imagePreviewContainer.insertBefore(imagePreview, imagePreviewClose);
    imagePreview.style.transform = 'scale(0.8)';
    window.anime({
        targets: imagePreview,
        scale: 1,
        duration: 175,
        easing: "easeOutCubic",
    });
    tabA.href = image.src;

    while(imageInfo.firstChild) imageInfo.removeChild(imageInfo.firstChild);
    let info = [
        'Link: ' + image.src,
        'Name: ' + image.src.match(/\/[a-zA-Z0-9_%-]{1,}(?:\.[a-zA-Z0-9_%-]{1,})?(?=[^.a-zA-z0-9_%\-]|$)/g).reverse()[0].substring(1),
        'Size: ' + image.naturalWidth + 'x' + image.naturalHeight
    ];
    info.forEach( info => {
        let div = document.createElement('div');
        div.textContent = info;
        imageInfo.appendChild(div);
    });
}

let injected = false;
let originalSend = window.WebSocket.prototype.send;
window.WebSocket.prototype.send = function(args) {
    if(this.url.includes("socket.io/?EIO=3&transport=websocket&sid=") && !injected){
        // information about packets (Aug 25, 2023): https://github.com/UnmatchedBracket/DemystifyBonk/blob/main/Packets.md
        send = (args) => {
            this.send(args);
        };
        injected = true;
        let originalReceive = this.onmessage;
        this.onmessage = function(args){
            let packet = null;
            if(args.data.indexOf('[') != -1) packet = JSON.parse(args.data.substring(args.data.indexOf('[')));
            else packet = [0, parseInt(args)];
            if(packet[0] == 0) {
                if(packet[1] == 41) {
                    playerList = null;
                    injected = false;
                    selfId = -1;
                }
            }
            else if(packet[0] == 2) {
                playerList = [{
                    userName: document.getElementById('pretty_top_name').textContent,
                    guest: document.getElementById('pretty_top_level').textContent == 'Guest',
                    level: document.getElementById('pretty_top_level').textContent == 'Guest'? 0 : parseInt(document.getElementById('pretty_top_level').textContent),
                    ready: false,
                    team: 1,
                    avatar: null,
                    ping: 105,
                }];
                hostId = 0;
                selfId = 0;
            }
            else if(packet[0] == 3) {
                playerList = packet[3];
                hostId = packet[2];
                selfId = packet[1];
            }
            else if(packet[0] == 4) {
                playerList.push({
                    userName: packet[3],
                    guest: packet[4],
                    level: packet[5],
                    ready: false,
                    team: packet[6],
                    avatar: null,
                    ping: 105,
                });
                if(hostId == selfId && customEmojis.length > 0) {
                    const max = 200000;

                    const filtered = customEmojis.filter(x => x.data.length <= max);
                    let index = 0;
                    let extra = 0;
                    let chunks = [];
                    while(index < filtered.length) {
                        let count = JSON.stringify(filtered.slice(index, index + extra + 1)).length;
                        if(index + extra + 1 == filtered.length) {
                            if(count <= max) chunks.push(filtered.slice(index, index + extra + 1));
                            else {
                                chunks.push(filtered.slice(index, index + extra));
                                chunks.push(filtered.slice(index + extra, index + extra + 1));
                            }
                            index = filtered.length;
                        }
                        else if(count > max) {
                            chunks.push(filtered.slice(index, index + extra));
                            index = index + extra + 1;
                            extra = 0;
                        } else extra++;
                    }

                    for(let i = 0; i < chunks.length; i++) {
                        const sendPacket = {
                            type: 'bonkchat:emj',
                            action: 'info',
                            to: packet[1],
                            emjs: chunks[i],
                            last: i + 1 == chunks.length? true : false
                        };
                        send(`42[4,${JSON.stringify(sendPacket)}]`);
                    }
                }
            }
            else if(packet[0] == 5) {
                playerList[packet[1]] = null;
            }
            else if(packet[0] == 6) {
                hostId = packet[2];
            }
            else if(packet[0] == 7) {
                if(packet[2].type && packet[2].type == 'bonkchat:emj' && packet[1] == hostId) {
                    //console.log(`bonkchat:emj [ACTION:${packet[2].action},ID:${packet[1]},HOST:${hostId}]`)
                    if(packet[2].action == 'push') {
                        for(let i in packet[2].emjs) {
                            if(customEmojis.length < settings.emojiLimit && packet[2].emjs[i].name.length < settings.emojiNameMaxLength + 4) customEmojis.push(packet[2].emjs[i]);
                            else break;
                        }
                    }
                    else if(packet[2].action == 'info') {
                        if(packet[2].to == selfId) {
                            for(let i in packet[2].emjs) {
                                if(customEmojis.length < settings.emojiLimit && packet[2].emjs[i].name.length < settings.emojiNameMaxLength + 4) customEmojis.push(packet[2].emjs[i]);
                                else break;
                            }
                        }
                    }
                    else if(packet[2].action == 'clear') {
                        while(typeof customEmojis[0] != 'undefined') customEmojis.pop();
                    }
                }
            }
            else if(packet[0] == 41) {
                hostId = packet[1].newHost;
            }
            return originalReceive.call(this, args);
        };
        let originalClose = this.onclose;
        this.onclose = function(args){
            injected = false;
            while(typeof customEmojis[0] != 'undefined') customEmojis.pop();
            return originalClose.call(this, args);
        };
    }
    return originalSend.call(this, args);
};

const doLimit = function () {
    if(this.children.length < settings.maxMessages) return 0;
    return 1000;
};
document.getElementById("newbonklobby_chat_content").__defineGetter__("childElementCount", doLimit);
document.getElementById("ingamechatcontent").__defineGetter__("childElementCount", doLimit);

let originalAppendChild = chat.appendChild;
chat.appendChild = function (args) {
    messageCount++;
    const lastMessage = this.lastChild;
    originalAppendChild.call(this, args);
    const newMessage = this.lastChild;
    newMessage.style.position = 'relative';
    newMessage.style.margin = '2px 0';

    let notified = false;

    newMessage.find = (name) => {
        return newMessage.getElementsByClassName(name)[0] || null;
    };
    newMessage.highlight = function (name) {
        this.style.backgroundColor = 'rgba(145, 154, 157, 0.5)';
        window.anime({
            targets: this,
            backgroundColor: 'rgba(145, 154, 157, 0)',
            delay: 250,
            duration: 500,
            easing: "easeOutCubic",
            complete: () => {
                this.style.backgroundColor = '';
            }
        });
    };

    newMessage.addEventListener('mouseover', function () {
        this.style.backgroundColor = 'rgba(0, 0, 0, 0.06)';
    });
    newMessage.addEventListener('mouseout', function () {
        this.style.backgroundColor = 'unset';
    });
    newMessage.oncontextmenu = () => false;

    if(newMessage.children[0] && newMessage.children[0].classList.contains('newbonklobby_chat_status')) {
        let text = newMessage.textContent;
        if(text == '* You\'re doing that too much!') {
            //informRatelimited();
        }
        else if(text.startsWith('* ') && text.endsWith(' has joined the game ')) {
            newMessage.addEventListener('mousedown', (event) => {
                if(event.which != 3) return;
                [...chat.children].forEach( element => element.classList.remove('newbonklobby_chat_msgselected') );
                newMessage.classList.add('newbonklobby_chat_msgselected');
                const lessActions = { kick: actions.kick, ban: actions.ban };
                openContextMenu(
                    {
                        message: newMessage.textContent,
                        name: text.substring(0, text.length - 21).substring(2),
                        time: new Date().toLocaleTimeString(),
                        element: newMessage,
                        ingame: false
                    },
                    lessActions,
                    event
                );
                let documentMouseEvent = (event) => {
                    if(event.which == 3) {
                        for(let i = 0; i < chat.children.length; i++) {
                            let element = chat.children[i];
                            if(element.find('newbonklobby_chat_msg_colorbox') || element.textContent.endsWith(' has joined the game ') && element.contains(event.target)) {
                                return;
                            }
                        }
                    }
                    if(contextMenu && contextMenu.contains(event.target)) return;
                    document.removeEventListener('mousedown', documentMouseEvent);
                    closeContextMenu();
                }
                document.addEventListener('mousedown', documentMouseEvent);
            });
        }
        return;
    }

    const originalNewAppendChild = newMessage.appendChild;
    newMessage.appendChild = function (element) {
        /*if(element.className == 'newbonklobby_chat_msg_colorbox') {
            // create img element to avoid some bugs
            let img = document.createElement('div');
            img.className = 'newbonklobby_chat_msg_avatar';
            img.style.width = '12px';
            img.style.height = '12px';
            element.appendChild(img);
            let observer;
            let callback = (childList) => {
                if(childList.length == 1) element.removeChild(element.firstChild);
                observer.disconnect();
            }
            observer = new MutationObserver(callback);
            observer.observe(element, {childList: true});
        }
        else */if(element.className == 'newbonklobby_chat_msg_txt') {
            let playerName = newMessage.find('newbonklobby_chat_msg_name');
            playerName.classList.add('newbonklobby_chat_msg_topname');
            playerName.textContent = playerName.textContent.substring(0, playerName.textContent.length - 2);

            let reply = handleRepliedText(element.textContent);
            let textA = document.createElement('a'); // for 'reply'
            if(!reply && lastMessage && !lastMessage.find('newbonklobby_chat_status') && lastMessage.find('newbonklobby_chat_msg_name') && lastMessage.find('newbonklobby_chat_msg_name').textContent == playerName.textContent) {
                // if message is from the same person, do not display the name and avatar
                newMessage.find('newbonklobby_chat_msg_colorbox').style.display = 'none';
                newMessage.find('newbonklobby_chat_msg_name').style.display = 'none';
                element.classList.add('newbonklobby_chat_msg_txtright');
            } else if(reply) {
                // creating the message at the top
                newMessage.find('newbonklobby_chat_msg_colorbox').style.top = '28px';
                let text = document.createElement('div');
                textA.classList.add('newbonklobby_chat_msg_replytexthref');
                let href = createHref(`${reply.authorToReply}${reply.textToReply}`);
                if(href) {
                    textA.href = '#' + href;
                    let hrefElement = [...chat.children].find( child => child.id == href );
                    textA.onclick = () => hrefElement.highlight();
                }
                text.classList.add('newbonklobby_chat_msg_texttoreply');
                textA.textContent = `${reply.authorToReply}: ${reply.textToReply}`;

                text.appendChild(textA);

                element.textContent = reply.reply;
                let arrow = document.createElement('div');
                arrow.classList.add('newbonklobby_chat_msg_arrowtoreply');
                arrow.appendChild(text);
                let div = document.createElement('div');
                div.appendChild(arrow);
                div.appendChild(text);
                newMessage.insertBefore(div, newMessage.firstChild);
                if(reply.authorToReply == playerList[selfId].userName && settings.notify && settings.notifyOnReply && Notification.permission != 'denied' && !notified && newMessage.find('newbonklobby_chat_msg_name').textContent != playerList[selfId].userName && document.visibilityState == 'visible') {
                    new Notification(element.textContent);
                    notified = true;
                }
            }

            if (element.textContent.includes('@' + playerList[selfId].userName) && settings.notify && Notification.permission != 'denied' && !notified && newMessage.find('newbonklobby_chat_msg_name').textContent != playerList[selfId].userName && document.visibilityState == 'visible') {
                new Notification(element.textContent);
                notified = true;
            }

            newMessage.addEventListener('mousedown', (event) => {
                if(event.which != 3) return;
                openContextMenu(
                    {
                        message: newMessage.find('newbonklobby_chat_msg_txt').textContent,
                        name: newMessage.find('newbonklobby_chat_msg_name').textContent,
                        time: newMessage.find('newbonklobby_chat_msg_time').textContent,
                        element: newMessage,
                        ingame: false
                    },
                    actions,
                    event);
                let documentMouseEvent = (event) => {
                    if(event.which == 3) {
                        for(let i = 0; i < chat.children.length; i++) {
                            let element = chat.children[i];
                            if(element.find('newbonklobby_chat_msg_colorbox') || element.textContent.endsWith(' has joined the game ') && element.contains(event.target)) {
                                return;
                            }
                        }
                    }
                    if(contextMenu && contextMenu.contains(event.target)) return;
                    document.removeEventListener('mousedown', documentMouseEvent);
                    closeContextMenu();
                }
                document.addEventListener('mousedown', documentMouseEvent);
            });

            let links = element.textContent.match(linkRegex);
            try{
                if(links && links.length) {
                    let content = element.textContent.substring();
                    element.textContent = '';
                    for(let i = 0; i < links.length; i++) {
                        let index = content.indexOf(links[i]);
                        let text = new Text(content.substring(0, index));
                        if(text.length > 0) element.appendChild(text);
                        let link = document.createElement('a');
                        link.classList.add('newbonklobby_chat_msg_texthref');
                        link.href = links[i];
                        link.target = '_blank';
                        link.textContent = links[i];
                        element.appendChild(link);
                        content = content.substring(index + links[i].length);
                        if(i == 0) {
                            let appendImage = function (image, name) {
                                link.removeAttribute('href');
                                link.removeAttribute('target');
                                link.textContent = name;
                                link.onclick = () => {
                                    openImagePreview(image);
                                };

                                image.onclick = () => {
                                    openImagePreview(image);
                                };

                                let imageDiv = document.createElement('div');
                                let buttonDiv = document.createElement('div');
                                let button = document.createElement('div');

                                imageDiv.classList.add('newbonklobby_chat_image_container');
                                image.classList.add('newbonklobby_chat_image');
                                if(settings.autoShowImages) {
                                    button.classList.add('newbonklobby_chat_image_hidebutton');
                                } else {
                                    button.classList.add('newbonklobby_chat_image_showbutton');
                                    image.style.display = 'none';
                                }

                                button.onclick = () => {
                                    if(button.classList.contains('newbonklobby_chat_image_showbutton')) {
                                        button.classList.remove('newbonklobby_chat_image_showbutton');
                                        button.classList.remove('brownButton');
                                        button.classList.remove('brownButton_classic');
                                        button.classList.remove('buttonShadow');

                                        button.classList.add('newbonklobby_chat_image_hidebutton');

                                        image.style.display = '';
                                    } else {
                                        button.classList.remove('newbonklobby_chat_image_hidebutton');

                                        button.classList.add('newbonklobby_chat_image_showbutton');
                                        button.classList.add('brownButton');
                                        button.classList.add('brownButton_classic');
                                        button.classList.add('buttonShadow');

                                        image.style.display = 'none';
                                    }
                                };

                                imageDiv.appendChild(image);
                                imageDiv.appendChild(button);
                                newMessage.appendChild(imageDiv);
                            };
                            createImages(links[0], appendImage);
                        }
                    }
                    // pushing the remainder of textContent
                    if(content.length > 0) element.appendChild(new Text(content));
                }
            }
            catch(e) {
                console.error(e);
            }

            originalNewAppendChild.call(this, element);
            let time = document.createElement('span');
            time.classList.add('newbonklobby_chat_msg_time');
            time.textContent = new Date().toLocaleTimeString();
            originalNewAppendChild.call(this, time);

            let msgText = element.textContent;
            emojify(element);
            if(msgText.length != element.textContent.length && msgText.length < 7 && element.children.length == msgText.replace(/ /, '').length) {
                [...element.getElementsByTagName('img')].forEach( child => {child.className = 'newbonklobby_chat_msg_txt_emojiscaled'} );
            }

            if(reply) emojify(textA);
            return;
        }
        originalNewAppendChild.call(this, element);
        return;
    };
};



originalAppendChild = ingameChat.appendChild;
ingameChat.appendChild = function (args) {
    originalAppendChild.call(this, args);
    const newMessage = this.lastChild;
    newMessage.find = (name) => {
        return newMessage.getElementsByClassName(name)[0] || null;
    };
    newMessage.highlight = function (name) {
        this.style.backgroundColor = 'rgba(145, 154, 157, 0.5)';
        window.anime({
            targets: this,
            backgroundColor: 'rgba(145, 154, 157, 0)',
            delay: 250,
            duration: 500,
            easing: "easeOutCubic",
            complete: () => {
                this.style.backgroundColor = '';
            }
        });
    };

    newMessage.addEventListener('mouseover', function () {
        this.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
    });
    newMessage.addEventListener('mouseout', function () {
        this.removeAttribute('style');
    });
    newMessage.oncontextmenu = () => false;

    if(newMessage.children[0] && newMessage.children[0].classList.contains('ingamechatstatus')) {
        let text = newMessage.textContent;
        if(text.startsWith('* ') && text.endsWith(' has joined the game.')) {
            newMessage.addEventListener('mousedown', (event) => {
                [...ingameChat.children].forEach( element => element.classList.remove('ingamechatselected') );
                newMessage.classList.add('ingamechatselected');
                if(event.which != 3) return;
                const lessActions = { kick: actions.kick, ban: actions.ban };
                openContextMenu(
                    {
                        message: newMessage.textContent,
                        name: text.substring(0, text.length - 21).substring(2),
                        time: new Date().toLocaleTimeString(),
                        element: newMessage,
                        ingame: true
                    },
                    lessActions,
                    event);
                let documentMouseEvent = (event) => {
                    if(event.which == 3) {
                        for(let i = 0; i < chat.children.length; i++) {
                            let element = chat.children[i];
                            if(element.find('newbonklobby_chat_msg_colorbox') || element.textContent.endsWith(' has joined the game ') && element.contains(event.target)) {
                                return;
                            }
                        }
                    }
                    if(contextMenu && contextMenu.contains(event.target)) return;
                    document.removeEventListener('mousedown', documentMouseEvent);
                    closeContextMenu();
                }
                document.addEventListener('mousedown', documentMouseEvent);
            });
        }
        return;
    }

    let msgTextElement = args.find('ingamechatmessage');
    if(msgTextElement) {
        let reply = handleRepliedText(msgTextElement.textContent);
        let textA = document.createElement('a'); // for 'reply'
        if(reply) {
            let text = document.createElement('div');
            text.classList.add('ingamechatreplytext');
            let href = createHref(`${reply.authorToReply}: ${reply.textToReply}`, true);
            if(href) {
                textA.href = '#' + href;
                let element = [...ingameChat.children].find(child => child.id == href);
                textA.onclick = () => element.highlight();
            }
            textA.className = 'ingamechatreplyhref';
            textA.textContent = `Replied to ${reply.authorToReply}: ${reply.textToReply}`;
            msgTextElement.textContent = ' ' + reply.reply;

            text.appendChild(textA);

            args.insertBefore(text, args.firstChild);
        }
        newMessage.addEventListener('mousedown', function (event) {
            if(event.which != 3) return;
            openContextMenu(
                {
                    message: newMessage.find('ingamechatmessage').textContent.substring(1),
                    name: newMessage.find('ingamechatname').textContent.substring(0, newMessage.find('ingamechatname').textContent.length - 1),
                    time: newMessage.find('ingamechattime').textContent,
                    element: newMessage,
                    ingame: true
                },
                actions,
                event);
            let documentClickEvent = (event) => {
                if(event.which == 3) {
                    for(let i = 0; i < ingameChat.children.length; i++) {
                        let element = ingameChat.children[i];
                        if(element.find('ingamechatmessage') || element.textContent.endsWith(' has joined the game ') && element.contains(event.target)) {
                            return;
                        }
                    }
                }
                if(contextMenu && contextMenu.contains(event.target)) return;
                document.removeEventListener('mousedown', documentClickEvent);
                closeContextMenu();
            }
            document.addEventListener('mousedown', documentClickEvent);
        });
        let links = msgTextElement.textContent.match(linkRegex);
        try{
            if(links && links.length) {
                let content = msgTextElement.textContent.substring();
                msgTextElement.textContent = '';
                for(let i = 0; i < links.length; i++) {
                    let index = content.indexOf(links[i]);
                    let text = new Text(content.substring(0, index));
                    if(text.length > 0) msgTextElement.appendChild(text);
                    let link = document.createElement('a');
                    link.classList.add('ingamechatmessagehref');
                    link.href = links[i];
                    link.target = '_blank';
                    link.textContent = links[i];
                    msgTextElement.appendChild(link);
                    content = content.substring(index + links[i].length);
                    if(i == 0) {
                        let appendImage = function (image, name) {
                            link.removeAttribute('href');
                            link.removeAttribute('target');
                            link.textContent = name;
                            link.onclick = () => {
                                openImagePreview(image);
                            };

                            image.onclick = () => {
                                openImagePreview(image);
                            };

                            let imageDiv = document.createElement('div');
                            let buttonDiv = document.createElement('div');
                            let button = document.createElement('div');

                            imageDiv.classList.add('ingamechatimagecontainer');
                            image.classList.add('ingamechatimage');
                            if(settings.autoShowImages && settings.ingameImages) {
                                button.classList.add('ingamechatimagehidebutton');
                            } else {
                                button.classList.add('ingamechatimageshowbutton');
                                image.style.display = 'none';
                            }

                            button.onclick = () => {
                                if(button.classList.contains('ingamechatimageshowbutton')) {
                                    button.classList.remove('ingamechatimageshowbutton');
                                    button.classList.remove('ingamechatbutton');
                                    button.classList.add('ingamechatimagehidebutton');
                                    image.style.display = '';
                                } else {
                                    button.classList.remove('ingamechatimagehidebutton');
                                    button.classList.add('ingamechatimageshowbutton');
                                    button.classList.add('ingamechatbutton');
                                    image.style.display = 'none';
                                }
                            };

                            imageDiv.appendChild(image);
                            imageDiv.appendChild(button);
                            newMessage.appendChild(imageDiv);
                        };
                        createImages(links[0], appendImage);
                    }
                }
                // pushing the remainder of textContent
                if(content.length > 0) msgTextElement.appendChild(new Text(content));
            }
        }
        catch(e) {
            console.error(e);
        }

        let time = document.createElement('span');
        time.classList.add('ingamechattime');
        time.textContent = new Date().toLocaleTimeString();
        newMessage.appendChild(time);

        emojify(msgTextElement);

        if(reply) emojify(textA);
    }
}

// emojify innerHTML of elements
function emojify (element) {
    for(let i = 0; i < customEmojis.length; i++) {
        let emoji = customEmojis[i];
        element.innerHTML = element.innerHTML.replaceAll(new RegExp('\\ue1' + String(i).padStart(2, '0'), 'g'), `<span style="display: inline-block;"><span style="display: none;">:${emoji.name}:</span><img style="max-height: 100%;max-width: ${element.offsetHeight}px;vertical-align: text-bottom;" alt=":${emoji.name}:" src="${emoji.data}"></span>`)
    }
}
// get unicode character of emoji by its ID
function getUnicodeChar (id) {
    let a = 57600 + id;
    if(isNaN(a)) return '';
    return unescape(`%u${a.toString(16)}`);
}

let helpContainer = null;
let helpFocus = -1;

function helpTableNavigate (e) {
    const children = [...helpContainer.children[0].children[0].children];
    const ingame = helpContainer.className == 'ingamechathelpcontainer';
    const last = children.length - 1;
    helpFocus = Math.min(last, Math.max(-1, helpFocus));
    if(helpFocus != -1) children[helpFocus].removeAttribute('style');
    if(e.key == 'ArrowUp') {
        e.preventDefault();
        if(helpFocus == 0 || helpFocus == -1) helpFocus = last;
        else helpFocus--;

        if(ingame) children[helpFocus].style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
        else children[helpFocus].style.backgroundColor = 'rgba(100,100,100,0.10)';
    }
    else if(e.key == 'ArrowDown') {
        e.preventDefault();
        if(helpFocus == last) helpFocus = 0;
        else helpFocus++;

        if(ingame) children[helpFocus].style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
        else children[helpFocus].style.backgroundColor = 'rgba(100,100,100,0.10)';
    }
}

function showHelpContainer (optionsList, ingame) {
    hideHelpContainer();
    helpFocus = -1;
    helpContainer = document.createElement('div');
    let helpTable = document.createElement('table');
    let tbody = document.createElement('tbody');
    if(ingame) {
        helpContainer.className = 'ingamechathelpcontainer';
        helpTable.className = 'ingamechathelptable';
        document.getElementById('ingamechatbox').appendChild(helpContainer);
    }
    else {
        helpContainer.className = 'newbonklobby_chat_helpcontainer';
        helpTable.className = 'newbonklobby_chat_helptable';
        document.getElementById('newbonklobby_chatbox').appendChild(helpContainer);
    }

    helpContainer.appendChild(helpTable);
    helpTable.appendChild(tbody);

    for(let i in optionsList) {
        let option = optionsList[i];
        let optionElement = document.createElement('tr');
        if(option.color) optionElement.style.color = option.color;
        optionElement.onclick = (e) => {
            option.onclick(e);

            if(document.activeElement != document.getElementById('newbonklobby_chat_input') && document.activeElement != document.getElementById('ingamechatinputtext')) focusChat();
            const chatInput = document.getElementById('newbonklobby_chat_input');
            chatInput.selectionStart = chatInput.value.length;
            chatInput.selectionEnd = chatInput.value.length;
        };
        let leftText = document.createElement('td');
        leftText.className = ingame? 'ingamechathelpoption' : 'newbonklobby_chat_helpoption';
        leftText.innerHTML = option.text;
        optionElement.appendChild(leftText);
        if(option.rightText) {
            let rightText = document.createElement('td');
            rightText.className = ingame? 'ingamechathelpoptionright' : 'newbonklobby_chat_helpoptionright';
            rightText.textContent = option.rightText;
            optionElement.appendChild(rightText);
        }
        if(option.desc && typeof option.desc === 'string' && option.desc.length > 0) {
            let desc = document.createElement('span');
            desc.className = ingame? 'ingamechathelpoptiondesc' : 'newbonklobby_chat_helpoptiondesc';
            desc.textContent = option.desc;
            leftText.appendChild(desc);
        }
        helpContainer.getElementsByTagName('TBODY')[0].appendChild(optionElement);
    }

    document.addEventListener('keydown', helpTableNavigate);
}

function hideHelpContainer () {
    if(!helpContainer) return;
    let tbody = helpContainer.getElementsByTagName('TBODY')[0];
    while(tbody.firstChild) tbody.removeChild(tbody.firstChild);
    if(helpContainer) {
        helpContainer.parentNode.removeChild(helpContainer);
        helpContainer = null;
    }
    document.removeEventListener('keydown', helpTableNavigate);
}

document.getElementById('newbonklobby_chat_input').oninput = function (event) {
    const index = event.target.selectionEnd;
    const text = event.target.value;
    const remain = text.substring(index);
    const before = text.substring(0, index);
    const chatInput = () => this.oninput({target: this});

    const matchEmoji = before.match(/(?<=:)[a-z0-9_~]+/g)?.reverse()[0];

    const matchPing = before.match(/(?<=@)[^@]*/g)?.reverse()[0];
    let players = [];
    if(typeof matchPing == 'string') players = [...document.getElementById('newbonkgamecontainer').getElementsByClassName('newbonklobby_playerentry')].filter( x => x.getElementsByClassName('newbonklobby_playerentry_name')[0].textContent.includes(matchPing) )

    if(matchEmoji && before.lastIndexOf(matchEmoji) + matchEmoji.length == index) {
        const emojis = window.emojione.shortnames.split('|').filter( x => x.includes(matchEmoji) && window.emojione.emojioneList[x]).slice(0, 24);
        const roomEmojis = customEmojis.map( (x, id) => {
            return {
                text: `<img src="${x.data}" style="width: 20px;vertical-align: middle;"> :${x.name}:`,
                rightText: 'custom',
                name: x.name,
                onclick: () => {
                    event.target.value = `${before.slice(0, - matchEmoji.length)}${x.name}: ${remain}`;
                    hideHelpContainer();
                    chatInput();
                }
            };
        }).filter( x => x.name.includes(matchEmoji) );
        if(emojis.length == 0 && roomEmojis.length == 0) {
            hideHelpContainer();
            return;
        }
        let normalEmojis = emojis.map( x => {
            return {
                text: `${window.emojione.shortnameToUnicode(x)} ${x}`,
                onclick: () => {
                    event.target.value = `${before.slice(0, - matchEmoji.length - 1)}${window.emojione.shortnameToUnicode(x)} ${remain}`;
                    hideHelpContainer();
                    chatInput();
                }
            };
        });
        showHelpContainer(roomEmojis.concat(normalEmojis), event.target.id == 'ingamechatinputtext');
    }
    else if(players.length > 0) {
        players = players.map( x => {
            let name = x.getElementsByClassName('newbonklobby_playerentry_name')[0].textContent;
            let avatar = x.getElementsByClassName('newbonklobby_playerentry_avatar')[0].children[0].src;
            return {
                text: `<img src="${avatar}" style="width: 28px;vertical-align: middle;"> @${name}`,
                name: name,
                onclick: () => {
                    event.target.value = `${before.slice(0, - matchPing.length)}@${name} ${remain}`;
                    hideHelpContainer();
                    chatInput();
                }
            };
        });
        showHelpContainer(players, event.target.id == 'ingamechatinputtext');
    }
    else if(text.startsWith('/')) {
        function getHelpOptions(name) {
            return window.chatCommands.map( (x, id) => {
                return {
                    text: `/${x.name} ${x.parameters? x.parameters.join(' ') : ''}`,
                    rightText: x.builtin? 'built-in' : x.source,
                    desc: x.description ?? '',
                    name: x.name,
                    hostOnly: x.hostOnly,
                    onclick: (clickEvent) => {
                        event.target.value = `/${x.name}${x.parameters? ' ' + remain.trimStart() : ''}`;
                        targetCommandId = id;
                        clickEvent.target.parentNode.id = 't';
                        for(let i = 0; i < clickEvent.target.parentNode.parentNode.children.length; i++) {
                            const child = clickEvent.target.parentNode.parentNode.children[i];
                            if(child.id != 't') {
                                child.parentNode.removeChild(child);
                                i--;
                            }
                        }
                    }
                };
            }).filter( x => x.name.includes(name) && (x.hostOnly? !document.getElementById('newbonklobby_startbutton').classList.contains('brownButtonDisabled') : true));
        };
        if(text.includes(' ')) {
            if(helpContainer && helpContainer.children.length == 1) return;
            const command = [getHelpOptions(before.split(' ')[0].substring(1))[0]];
            showHelpContainer(command, event.target.id == 'ingamechatinputtext');
            return;
        }
        else if(text.length <= 1) {
            hideHelpContainer();
            return;
        }
        const commands = getHelpOptions(before.substring(1));
        showHelpContainer(commands, event.target.id == 'ingamechatinputtext');
    }
    else if(helpContainer) hideHelpContainer();
}
document.getElementById('ingamechatinputtext').oninput = document.getElementById('newbonklobby_chat_input').oninput;

function processCommand (value) {
    const text = value.replace(/ +/, ' ');
    const splited = [];
    let index = 0;
    let ignoreSpaces = false;
    for(let i = 0; i < text.length; i++) {
        const char = text[i];
        const prevChar = text[i - 1] ?? '';
        if(char == '"' && prevChar != '\\') {
            ignoreSpaces = !ignoreSpaces;
        }
        else if(char == ' ' && !ignoreSpaces) {
            let param = text.substring(index, i);
            if(prevChar == '"') param = param.substring(1).substring(0, param.length - 2);
            splited.push(param);
            index = i + 1;
        } else if(i == text.length - 1) {
            let param = text.substring(index, i + 1);
            if(prevChar == '"') param = param.substring(1).substring(0, param.length - 2);
            splited.push(param);
        }
    }

    let name = splited.shift().substring(1);
    let command;
    if(targetCommandId > -1) command = window.chatCommands[targetCommandId];
    else command = window.chatCommands.find( x => x.name == name );

    targetCommandId = -1;

    if(command && !command.builtin) {
        try {
            command.callback(...splited);
        }
        catch (error) {
            showStatusMessage(`* Something went wrong... [Processing /${command.name}]`);
            console.error(error);
        }
        return '';
    }
    return value;
}

const originalKeyDown = document.getElementById('newbonklobby_chat_input').onkeydown ?? new Function();
document.getElementById('newbonklobby_chat_input').onkeydown = function(event) {
    if(event.keyCode == 32 && helpContainer && helpFocus != -1) {
        helpContainer.children[0].children[0].children[helpFocus].click();
    }
    else if(event.keyCode == 13 && helpContainer && helpFocus != -1) {
        helpContainer.children[0].children[0].children[helpFocus].click();
        document.getElementById('newbonklobby_chat_input').blur();
        document.getElementById('ingamechatinputtext').blur();
    }
    else if(event.keyCode == 13 && event.target.value.length > 0) {
        hideHelpContainer();
        if(event.target.value.startsWith('/')) {
            event.target.value = processCommand(event.target.value);
        }
        else {
            let matches = event.target.value.match(/(?!<\\):[a-z0-9_~]{1,255}:/g);
            if(matches) {
                matches = matches.map( x => x.slice(1, -1) );
                const ids = matches.map( x => customEmojis.findIndex( emj => emj.name == x ) );
                for(let i = 0; i < ids.length; i++) {
                    if(ids[i] != -1) {
                        event.target.value = event.target.value.replace(`:${matches[i]}:`, getUnicodeChar(ids[i])).trim();
                    }
                }
            }
        }
    }
    originalKeyDown.call(this, event);
};
document.getElementById('ingamechatinputtext').onkeydown = document.getElementById('newbonklobby_chat_input').onkeydown;

let bonklobbyObserver = new MutationObserver((mutationList) => {
    [...chat.children].forEach( element => element.classList.remove('newbonklobby_chat_msgselected') );
    [...ingameChat.children].forEach( element => element.classList.remove('ingamechatselected') );
    closeContextMenu();
});
bonklobbyObserver.observe(document.getElementById('newbonklobby'), {attributes: true});


console.log('bonk chat loaded');










