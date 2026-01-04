// ==UserScript==
// @name         OWOP Teleport+
// @namespace    https://greasyfork.org/en/users/1502179/
// @version      1.2
// @description  Adds instant teleporting
// @author       Nothinghere7759
// @match        https://ourworldofpixels.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAYAAACLz2ctAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAIAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAA8nYBAOgDAADydgEA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAAArIfcnPEIHlAAAArRJREFUeF7t28uNE1EQQFGbBUkgEQo5jYhjRE6EMhJJsBn2LZDKmsLXn3OWvXB321dvUSWfTw/i64/v78drj+zt5fV8vHaPPh0vwDUJkJQASQmQlABJCZCUAEkJkJQASWXT9Gpz8eXb5+Olm/Lr5+/jpauoNitOQFICJCVAUgIkJUBSAiQlQFICJCVAUuvT7+0Nx7NtLrbfd/v5tjcmTkBSAiQlQFICJCVAUgIkJUBSAiQlQFLjqXa14die5E/vO3Xrzze1/R7TjYkTkJQASQmQlABJCZCUAEkJkJQASQmQ1GhafbpgEzKd5G9P3rdN36My/f6232N6X5sQ7oIASQmQlABJCZCUAEkJkJQASQmQ1Hm64ZiaTt6nE/XK9D2ezfbv5gQkJUBSAiQlQFICJCVAUgIkJUBSAiQ13oRUm4Htyfv2e2w/37bt952afi9OQFICJCVAUgIkJUBSAiQlQFICJCVAUje/CalMJ/mPYvv3nX5/TkBSAiQlQFICJCVAUgIkJUBSAiQlQFLrm5DpBHxqet+p7ed7NtPfY/o9OwFJCZCUAEkJkJQASQmQlABJCZCUAEkJkJQASQmQlABJCZCUAEkJkJQASQmQlABJjf8TMjX9z0Bl+l8FrsMJSEqApARISoCkBEhKgKQESEqApARI6ny88C/Tjcn2JmS6uZjed/p5fMzby+uoLScgKQGSEiApAZISICkBkhIgKQGSEiCp0bT6dMEmZGq6uajYmHyMTQh3QYCkBEhKgKQESEqApARISoCkBEhqNK2+hI3JY5tuOKacgKQESEqApARISoCkBEhKgKQESEqApFan2pfY3phM2az83faGY8oJSEqApARISoCkBEhKgKQESEqApARIKpl+/w/VZqVSbS62OQFJCZCUAEkJkJQASQmQlABJCZCUAEn9AZ4Wfs3fCVt6AAAAAElFTkSuQmCC
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555881/OWOP%20Teleport%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/555881/OWOP%20Teleport%2B.meta.js
// ==/UserScript==

/* CHANGELOG
1.0 - Standalone
1.0.1 - Added /tpback
1.0.2 - Added support for scientific notation
1.0.3 - Added compatibility with vanilla player teleporting
1.1 - Added /warp
      Added support for k and m notation
      Added icon
1.1.1 - Fixed teleporting to x or y = 0 not working
        Added 'error' to borders
        Renamed to Teleport+
1.2 - Fixed a bug causing the script to not work sometimes
      Removed /warp border
      Added /warp create and /warp delete as aliases for /warp add and /warp remove, respectively
      Fixed the bug causing /help to give the "Unknown command: ..." error message when using it for script commands
      Added ~ notation to /tp for specifying relative coords (like in Minecraft)
      Fixed the bug causing both Neko Script and Teleport+ to teleport you
*/

(() => {
    "use strict";

    // Pre-Installation
    const waitUntil = (probe, cb, t = 200) => {
        const id = setInterval(() => {
            try {
                if (probe()) {
                    clearInterval(id); cb();
                }
            } catch { }
        }, t);
    };

    waitUntil(() => OWOP?.camera?.centerCameraTo && OWOP.misc?.world?.players && OWOP.chat?.local && OWOP.misc?.chatSendModifier && OWOP.camera?.y && OWOP.mouse?.tileY && OWOP.player?.rank && OWOP.world?.name, install);

    // Install
    function install() {
        // Utilities
        const locSend = OWOP.chat.local;
        function locErr(msg) {
            OWOP.chat.receiveMessage(`{
            	"sender":"server",
            	"type":"error",
            	"data":{
                    "allowHTML":true,
        		    "message":"${msg}"
        	    }
            }`);
        }
        if (localStorage.warpList === undefined) {
            localStorage.warpList = '{}';
        };
        let xOld = 0, yOld = 0;
        function teleport(cx, cy) {
            xOld = OWOP.camera.x;
            yOld = OWOP.camera.y;
            OWOP.camera.centerCameraTo(cx, cy);
        }
        function argToNum(n, coord) {
            coord = coord == "x" ? OWOP.mouse.tileX : OWOP.mouse.tileY;
            if (!isNaN(n)) {
                return Number(n);
            } else if (!isNaN(n.slice(0, -1)) && !n.startsWith("~")) {
                if (n.endsWith('k')) {
                    return n.slice(0, -1) * 1000;
                };
                if (n.endsWith('m')) {
                    return n.slice(0, -1) * 1000000;
                };
                return null;
            } else if (n.startsWith("~")) {
                if (n.length == 1) return coord;
                else if (!isNaN(n.slice(1))) {
                    return coord + Number(n.slice(1));
                } else if (!isNaN(n.slice(1, -1))) {
                    if (n.endsWith('k')) {
                        return coord + n.slice(1, -1) * 1000;
                    };
                    if (n.endsWith('m')) {
                        return coord + n.slice(1, -1) * 1000000;
                    };
                    return null;
                } else return null;
            } else return null;
        };

        // Help
        function help(args) {
            if (args.length == 0) {
                if (OWOP.player.rank < 2) {
                    locSend('Teleport commands: /tp, /tpback, /warp');
                    return;
                };
                locSend('Teleport commands: /tpback, /warp');
                return;
            };
            switch (args[0]) {
                case 'tp':
                    if (OWOP.player.rank < 2) {
                        locSend('tp - Teleport to a given location or to another user.\nUsage: /tp &lt;id&gt; | /tp &lt;x&gt; &lt;y&gt;\nAliases: [None]');
                        break;
                    };
                    //locSend('tp - Teleport you or another user to a given location, or you to another user.\nUsage: /tp &lt;id&gt; | /tp &lt;x&gt; &lt;y&gt; | /tp &lt;id&gt; &lt;x&gt; &lt;y&gt;\nAliases: [None]');
                    break;
                case 'tpback':
                case 'tpb':
                    locSend('tpback - Teleports you to the position before your last teleportation.\nUsage: /tpback\nAliases: tpb');
                    break;
                case 'warp':
                    locSend('warp - Create, delete or teleport to waypoints and list them\nUsage: /warp (create|add) &lt;name&gt; &lt;x&gt; &lt;y&gt; global* | /warp (remove|delete) &lt;name&gt; | /warp list | /warp &lt;name&gt; (* = optional)\nAliases: [None]');
            };
            return '';
        };

        // Prevent /help from sending "Unknown command" error
        const prevR = OWOP.misc.chatRecvModifier;
        OWOP.misc.chatRecvModifier = msg => {
            msg = prevR(msg);
            const msgParsed = JSON.parse(msg);
            if (msgParsed.type == "error" && msgParsed.data.message.startsWith("Unknown command: ")) {
                if (!["warp", "tpback", "tpb", "tp"].every(cmd => cmd != msgParsed.data.message.slice(17, -1))) {
                    return '';
                };
            };
            return msg;
        }

        // Command Processing
        const prevS = OWOP.misc.chatSendModifier;
        OWOP.misc.chatSendModifier = msg => {
            msg = prevS((() => {
                if (!msg.startsWith('/')) return msg;
                const [cmd, ...args] = msg.slice(1).trim().split(/\s+/);
                switch (cmd.toLowerCase()) {
                    case "tp": {
                        if (args.length === 2 && argToNum(args[0], "x") != null && argToNum(args[1], "y") != null) {
                            teleport(argToNum(args[0], "x"), argToNum(args[1], "y"));
                            return '';
                        };
                        if (args.length === 1 && !isNaN(args[0])) {
                            if (!OWOP.misc.world.players[args[0]]) {
                                locErr(`No player with ID ${args[0]}`);
                                return '';
                            };
                            let p = OWOP.misc.world.players[args[0]];
                            teleport((p.x / 16) | 0, (p.y / 16) | 0);
                            return '';
                        };
                        if (args.length === 3 && args.every(a => !isNaN(a)) && OWOP.player.rank > 1) {
                            return msg;
                        };
                        if (OWOP.player.rank > 1) {
                            locErr('Correct usage: /tp &lt;x&gt; &lt;y&gt; | /tp &lt;id&gt; | /tp &lt;id&gt; &lt;x&gt; &lt;y&gt;');
                            return '';
                        };
                        locErr('Correct usage: /tp &lt;x&gt; &lt;y&gt; | /tp &lt;id&gt;');
                        return '';
                    };
                    case "tpback":
                    case "tpb": {
                        const x = OWOP.camera.x, y = OWOP.camera.y;
                        OWOP.camera.moveCameraTo(xOld, yOld);
                        xOld = x;
                        yOld = y;
                        return '';
                    }
                    case "warp": {
                        let warpList = JSON.parse(localStorage.warpList);
                        switch (args[0]) {
                            case 'create':
                            case 'add':
                                if (args.length != 4 && args.length != 5 || isNaN(args[2]) || isNaN(args[3])) {
                                    locErr('Correct usage: /warp (create|add) &lt;name&gt; &lt;x&gt; &lt;y&gt; global* (* = optional)');
                                    return '';
                                };
                                if (["add", "remove", "list"].includes(args[1])) {
                                    locErr('The warp name cannot be a reserved word (add, remove, list)');
                                    return '';
                                };
                                if (warpList.$global?.[args[1]] || warpList[OWOP.world.name]?.[args[1]]) {
                                    locErr(`'${args[1]}' already exists`);
                                    return '';
                                };
                                if (args[4] == 'global') {
                                    if (!warpList.$global) warpList.$global = {};
                                    warpList.$global[args[1]] = [args[2], args[3]];
                                    localStorage.warpList = JSON.stringify(warpList);
                                    return '';
                                };
                                if (!warpList[OWOP.world.name]) warpList[OWOP.world.name] = {};
                                warpList[OWOP.world.name][args[1]] = [args[2], args[3]];
                                localStorage.warpList = JSON.stringify(warpList);
                                return '';
                            case 'delete':
                            case 'remove':
                                if (args.length != 2) {
                                    locErr('Correct usage: /warp (remove|delete) &lt;name&gt;');
                                    return '';
                                };
                                if (!warpList[OWOP.world.name]?.[args[1]]) {
                                    if (!warpList.$global?.[args[1]]) {
                                        locErr(`'${args[1]}' does not exist`);
                                        return '';
                                    };
                                    warpList.$global[args[1]] = undefined;
                                    if (JSON.stringify(warpList.$global) === '{}') warpList.$global = undefined;
                                    localStorage.warpList = JSON.stringify(warpList);
                                    return '';
                                };
                                warpList[OWOP.world.name][args[1]] = undefined;
                                if (JSON.stringify(warpList[OWOP.world.name]) === '{}') warpList[OWOP.world.name] = undefined;
                                localStorage.warpList = JSON.stringify(warpList);
                                return '';
                            case 'list':
                                if (args.length != 1) {
                                    locErr('Correct usage: /warp list');
                                    return '';
                                };
                                locSend(`Local warps: ${warpList[OWOP.world.name] ? Object.keys(warpList[OWOP.world.name]).join(', ') : '[None]'}\nGlobal warps: ${warpList.$global ? Object.keys(warpList.$global).join(', ') : '[None]'}`);
                                return '';
                            default:
                                if (args.length != 1) {
                                    locErr('Usage: /warp (create|add) &lt;name&gt; &lt;x&gt; &lt;y&gt; global* | /warp (remove|delete) &lt;name&gt; | /warp list | /warp &lt;name&gt; (* = optional)');
                                    return '';
                                };
                                if (!warpList[OWOP.world.name]?.[args]) {
                                    if (!warpList.$global?.[args]) {
                                        locErr(`'${args}' does not exist`);
                                        return '';
                                    };
                                    teleport(Number(warpList.$global[args][0]), Number(warpList.$global[args][1]));
                                    return '';
                                };
                                teleport(Number(warpList[OWOP.world.name][args][0]), Number(warpList[OWOP.world.name][args][1]));
                                return '';
                        };
                    };
                    case "help":
                    case "h":
                    case "?":
                        help(args);
                };
                return msg;
            })());
            return msg;
        };
        console.log('Teleport loaded');
    }
})();