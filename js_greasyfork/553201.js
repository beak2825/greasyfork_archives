// ==UserScript==

// @name         Private Server
// @namespace    by tokyo
// @author       Tokyo
// @author       nick: Tokyo
// @author       telegram: @TheyTokyo
// @author       Discord server: https://discord.gg/zwKzMptf
// @author       Discord: TheyTokyo
// @description  Moomoo.io private server
// @version      2
// @grant        none
// @run-at       document-start
// @icon data:image/png;base64,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

// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @match        *://moomoo.io/*
// @match        *://domoev.moo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://https://moomoo.io/bundle.js/*
// @match        *://https://sandbox.moomoo.io/bundle.js/*

// @downloadURL https://update.greasyfork.org/scripts/553201/Private%20Server.user.js
// @updateURL https://update.greasyfork.org/scripts/553201/Private%20Server.meta.js
// ==/UserScript==

/*

Інструкція українською
1) Завантажте скрипт Private Server
2) Увімкніть його
3) Відкрийте сайт moomoo.io
4) Виберіть будь-який сервер зі списку.
5) Пройдіть капчу.
6) Натисніть Enter Game, щоб увійти в гру.
7) Насолоджуйтеся грою на приватному сервері!

Ви можете грати разом із друзями та іншими гравцями онлайн.

---------------------------------------------------------------------------------

Instructions in English
1) Download the MooMoo Private Server script.
2) Enable it (run the file or activate the extension, depending on how it works).
3) Go to moomoo.io
4) Choose any server from the list.
5) Complete the captcha.
6) Click Enter Game to join.
7) Enjoy playing on the private server!

You can play together with your friends and other players online.

*/




(function() {
    "use strict";

    const originalWebSocket = window.WebSocket;

    window.WebSocket = new Proxy(originalWebSocket, {
        construct(target, args) {
            const [url, ...rest] = args;
            const newUrl = "wss://cowgame-private-server-production.up.railway.app/";
            return Reflect.construct(target, [newUrl, ...rest]);
        }
    });

})();





/*
.___  ___.   ______     ______   .___  ___.   ______     ______           __    ______
|   \/   |  /  __  \   /  __  \  |   \/   |  /  __  \   /  __  \         |  |  /  __  \
|  \  /  | |  |  |  | |  |  |  | |  \  /  | |  |  |  | |  |  |  |        |  | |  |  |  |
|  |\/|  | |  |  |  | |  |  |  | |  |\/|  | |  |  |  | |  |  |  |        |  | |  |  |  |
|  |  |  | |  `--'  | |  `--'  | |  |  |  | |  `--'  | |  `--'  |  __    |  | |  `--'  |
|__|  |__|  \______/   \______/  |__|  |__|  \______/   \______/  (__)   |__|  \______/

.______   .______       __  ____    ____  ___   .___________. _______
|   _  \  |   _  \     |  | \   \  /   / /   \  |           ||   ____|
|  |_)  | |  |_)  |    |  |  \   \/   / /  ^  \ `---|  |----`|  |__
|   ___/  |      /     |  |   \      / /  /_\  \    |  |     |   __|
|  |      |  |\  \----.|  |    \    / /  _____  \   |  |     |  |____
| _|      | _| `._____||__|     \__/ /__/     \__\  |__|     |_______|

     _______. _______ .______     ____    ____  _______ .______
    /       ||   ____||   _  \    \   \  /   / |   ____||   _  \
   |   (----`|  |__   |  |_)  |    \   \/   /  |  |__   |  |_)  |
    \   \    |   __|  |      /      \      /   |   __|  |      /
.----)   |   |  |____ |  |\  \----.  \    /    |  |____ |  |\  \----.
|_______/    |_______|| _| `._____|   \__/     |_______|| _| `._____|

*/

