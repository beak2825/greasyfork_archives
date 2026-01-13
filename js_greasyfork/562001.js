// ==UserScript==
// @name         Bonk Jukebox
// @namespace    https://greasyfork.org/
// @version      1.3
// @license      MIT
// @description  Adds /jukebox [link], /pausejukebox, /playjukebox, /volume [0-100] to share music with players on the room.
// @author       Sires
// @match        https://bonk.io/*
// @match        https://bonkisback.io/*
// @match        https://multiplayer.gg/physics/*
// @run-at       document-idle
// @grant        none
// @icon         https://static.wikia.nocookie.net/minecraft_gamepedia/images/e/ee/Jukebox_JE2_BE2.png/revision/latest?cb=20201202075007
// @unwrap
// @downloadURL https://update.greasyfork.org/scripts/562001/Bonk%20Jukebox.user.js
// @updateURL https://update.greasyfork.org/scripts/562001/Bonk%20Jukebox.meta.js
// ==/UserScript==

function BonkJukeboxInjector(f) {
    if (window.location == window.parent.location) {
        console.log("Bonk Jukebox: Injector loaded");
        if (document.readyState == "complete") { f(); }
        else { document.addEventListener('readystatechange', function () { setTimeout(f, 1500); }); }
    }
}

BonkJukeboxInjector(function () {
    if (window.bonkJukeboxRunning) {
        console.warn("Bonk Jukebox: Already running. Aborting duplicate injection.");
        return;
    }
    window.bonkJukeboxRunning = true;

    const JUKEBOX_VERSION = "1.3";
    var scope = window;
    var Gwindow = document.getElementById("maingameframe").contentWindow;
    var Gdocument = document.getElementById("maingameframe").contentDocument;


    var jukeboxplayerURL = "";
    var jukeboxplayervolume = 100;
    var jukeboxplayer = null;

    var myid = -1;
    var hostid = -1;
    var username = "Player";
    var playerids = {};
    var bonkwss = null;
    var jukeboxQueryActive = false;
    var jukeboxQueryResults = [];

    console.log("Bonk Jukebox: Initializing...");

    function cleanupJukebox() {
        var iframe = document.getElementById('bonk_jukebox_player');
        if (iframe) {
            iframe.remove();
            console.log("Bonk Jukebox: Removed iframe.");
        }
        if (scope.jukeboxMessageListener) {
            window.removeEventListener('message', scope.jukeboxMessageListener);
            scope.jukeboxMessageListener = null;
        }
        jukeboxplayer = null;
        jukeboxplayerURL = "";
    }

    function displayInChat(message) {
        var ids = ["newbonklobby_chat_content", "ingamechatcontent"];
        for (var i = 0; i < ids.length; i++) {
            try {
                var chat_content = Gdocument.getElementById(ids[i]);
                if (chat_content) {
                    var div = Gdocument.createElement("div");
                    div.style.color = "#DA0808";
                    div.style.fontWeight = "bold";
                    div.style.fontFamily = "futurept_b1";
                    div.innerHTML = "[Jukebox] " + message;
                    chat_content.appendChild(div);
                    chat_content.scrollTop = chat_content.scrollHeight;
                }
            } catch(e) { console.error("Bonk Jukebox Error (displayInChat):", e); }
        }
    }

    function displaySuggestionInChat(from, url) {
        var ids = ["newbonklobby_chat_content", "ingamechatcontent"];
        for (var i = 0; i < ids.length; i++) {
            try {
                var chat_content = Gdocument.getElementById(ids[i]);
                if (chat_content) {
                    var div = Gdocument.createElement("div");
                    div.style.color = "#DA0808";
                    div.style.fontWeight = "bold";
                    div.style.fontFamily = "futurept_b1";

                    var span = Gdocument.createElement("span");
                    span.innerText = "[Jukebox] " + from + " suggests: ";

                    const link = Gdocument.createElement("span");
                    link.innerText = url;
                    link.style.textDecoration = "underline";
                    link.style.cursor = "pointer";
                    link.style.color = "#9933ff";

                    fetch("https://noembed.com/embed?url=" + encodeURIComponent(url))
                        .then(r => r.json())
                        .then(data => {
                            if (data.title) link.innerText = data.title;
                        })
                        .catch(e => console.error("Bonk Jukebox: Failed to fetch title", e));

                    link.onclick = function() {
                        var packet = '42' + JSON.stringify([4, { "type": "video player", "from": username, "url": url, "timestamp": Date.now() + 2000, "to": [-1] }]);
                        if(bonkwss) originalSend.call(bonkwss, packet);
                        changeJukeboxURL(url, Date.now() + 2000);

                        this.innerText += " (Playing)";
                        this.onclick = null;
                        this.style.cursor = "default";
                        this.style.textDecoration = "none";
                    };

                    var extLink = Gdocument.createElement("span");
                    extLink.innerText = " (Link)";
                    extLink.style.fontSize = "0.8em";
                    extLink.style.cursor = "pointer";
                    extLink.style.color = "#DA0808";
                    extLink.onclick = function() {
                        window.open(url, '_blank');
                    };

                    div.appendChild(span);
                    div.appendChild(link);
                    div.appendChild(extLink);
                    chat_content.appendChild(div);
                    chat_content.scrollTop = chat_content.scrollHeight;
                }
            } catch(e) { console.error("Bonk Jukebox Error (displaySuggestionInChat):", e); }
        }
    }

    function embedYouTubeVideo(videoId) {
        var existing = document.getElementById('bonk_jukebox_player');
        if (existing) {
            existing.remove();
        }

        if (scope.jukeboxMessageListener) {
            window.removeEventListener('message', scope.jukeboxMessageListener);
        }

        var iframe = document.createElement('iframe');
        iframe.id = 'bonk_jukebox_player';
        iframe.style.position = 'absolute';
        iframe.style.top = '-9999px';
        iframe.style.left = '-9999px';
        iframe.style.width = '1px';
        iframe.style.height = '1px';
        iframe.style.visibility = 'hidden';
        iframe.allow = "autoplay; encrypted-media";
        iframe.src = "https://www.youtube.com/embed/" + videoId + "?enablejsapi=1&autoplay=1&controls=0&origin=" + window.location.origin;

        document.body.appendChild(iframe);

        var state = {
            currentTime: 0,
            lastUpdateTime: Date.now(),
            paused: false,
            duration: 0
        };

        scope.jukeboxMessageListener = function(event) {
            if (event.source === iframe.contentWindow) {
                try {
                    var data = JSON.parse(event.data);
                    if (data.event === 'infoDelivery' && data.info) {
                        if (data.info.currentTime) {
                            state.currentTime = data.info.currentTime;
                            state.lastUpdateTime = Date.now();
                        }
                        if (typeof data.info.playerState !== 'undefined') {
                            state.paused = (data.info.playerState !== 1 && data.info.playerState !== 3);
                        }
                    }
                } catch (e) { console.error("Bonk Jukebox Error (messageListener):", e); }
            }
        };
        window.addEventListener('message', scope.jukeboxMessageListener);

        return {
            post: function(command, args) {
                if (iframe.contentWindow) {
                    iframe.contentWindow.postMessage(JSON.stringify({ 'event': 'command', 'func': command, 'args': args || [] }), '*');
                }
            },
            play: function () { this.post('playVideo'); state.paused = false; state.lastUpdateTime = Date.now(); },
            pause: function () { this.post('pauseVideo'); state.paused = true; },
            setCurrentTime: function (seconds) {
                this.post('seekTo', [seconds, true]);
                state.currentTime = seconds;
                state.lastUpdateTime = Date.now();
            },
            getCurrentTime: function () {
                return state.paused ? state.currentTime : state.currentTime + (Date.now() - state.lastUpdateTime) / 1000;
            },
            setVolume: function (volume) { this.post('setVolume', [volume]); },
            isPaused: function() { return state.paused; },
            src: videoId
        };
    }


    async function changeJukeboxURL(url, timestamp = 0, showMsg = false) {
        if (url == "") {
            if (jukeboxplayer) jukeboxplayer.pause();
            displayInChat("Jukebox paused.");
            return;
        }

        if (jukeboxplayer && url == jukeboxplayerURL && Date.now() - timestamp >= 2000) {
            jukeboxplayer.setVolume(jukeboxplayervolume);
            if (showMsg) displayInChat("Resumed playback.");
            jukeboxplayer.play();
            jukeboxplayer.setCurrentTime((Date.now() - timestamp) / 1000);
            return;
        }

        var idMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        if (!idMatch) {
            displayInChat("Invalid YouTube URL.");
            return;
        }
        var id = idMatch[1];


        var timeMatch = url.match(/(?:[?&;]|&amp;)(?:t|time)=((?:\d+[hms]?)+)/);
        var startTime = 0;
        if (timeMatch && timeMatch[1]) {
            var timeStr = timeMatch[1];
            if (!isNaN(timeStr)) {
                startTime = parseInt(timeStr);
            } else {
                var h = timeStr.match(/(\d+)h/);
                var m = timeStr.match(/(\d+)m/);
                var s = timeStr.match(/(\d+)s/);
                if (h) startTime += parseInt(h[1]) * 3600;
                if (m) startTime += parseInt(m[1]) * 60;
                if (s) startTime += parseInt(s[1]);
            }
        }

        jukeboxplayer = embedYouTubeVideo(id);
        jukeboxplayer.setVolume(jukeboxplayervolume);
        jukeboxplayerURL = url;

        var ids = ["newbonklobby_chat_content", "ingamechatcontent"];
        for (var i = 0; i < ids.length; i++) {
            try {
                var chat_content = Gdocument.getElementById(ids[i]);
                if (chat_content) {
                    var div = Gdocument.createElement("div");
                    div.style.color = "#DA0808";
                    div.style.fontWeight = "bold";
                    div.style.fontFamily = "futurept_b1";

                    var span = Gdocument.createElement("span");
                    span.innerText = "Now playing: ";

                    const link = Gdocument.createElement("span");
                    link.innerText = url;
                    link.style.textDecoration = "underline";
                    link.style.color = "#9933ff";
                    link.style.cursor = "pointer";
                    link.onclick = function() {
                        window.open(url, '_blank');
                    };

                    fetch("https://noembed.com/embed?url=" + encodeURIComponent(url))
                        .then(r => r.json())
                        .then(data => {
                            if (data.title) link.innerText = data.title;
                        })
                        .catch(e => console.error("Bonk Jukebox: Failed to fetch title", e));

                    div.appendChild(span);
                    div.appendChild(link);
                    chat_content.appendChild(div);
                    chat_content.scrollTop = chat_content.scrollHeight;
                }
            } catch(e) { console.error("Bonk Jukebox Error (Playing Msg):", e); }
        }

        var effectiveTimestamp = timestamp;
        if (timestamp > Date.now() - 10000 && startTime > 0) {
            effectiveTimestamp = timestamp - (startTime * 1000);
        }

        var seekTime = (Date.now() - effectiveTimestamp) / 1000;
        if (seekTime > 0) {
            setTimeout(function() { jukeboxplayer.setCurrentTime(seekTime + 1); }, 1000);
            setTimeout(function() { jukeboxplayer.setCurrentTime(seekTime + 3); }, 3000);
        }
    }


    var originalSend = Gwindow.WebSocket.prototype.send;
    var originalOpen = Gwindow.WebSocket.prototype.open;

    Gwindow.WebSocket.prototype.open = function() {
        originalOpen.apply(this, arguments);
    };


    Gwindow.WebSocket.prototype.send = function (data) {
        if (!bonkwss) { 
            bonkwss = this; 
            hookOnMessage(this); 
            hookOnClose(this);
        }


        if (typeof data === 'string' && data.startsWith('42[')) {
            try {
                var packet = JSON.parse(data.substring(2));
                if (packet[0] == 12) {
                    hostid = 0;
                    myid = 0;
                    console.log("Jukebox: Room creation detected (Packet 12). Initializing as Host (0).");
                }
            } catch(e) { 
                console.error("Bonk Jukebox Error (Packet 12 detection):", e); 
            }
        }

        originalSend.call(this, data);
    };

    function hookOnClose(ws) {
        var originalOnClose = ws.onclose;
        ws.onclose = function () {
            cleanupJukebox();
            if (originalOnClose) originalOnClose.apply(this, arguments);
            if (bonkwss === ws) bonkwss = null;
        };
    }

    function hookOnMessage(ws) {
        var originalOnMessage = ws.onmessage;
        ws.onmessage = function (e) {
            var data = e.data;
            if (typeof data === 'string' && data.startsWith('42[')) {
                var packet = JSON.parse(data.substring(2));
                var type = packet[0];

                if (type == 3) {
                    if (typeof packet[1] !== 'undefined') myid = packet[1];
                    if (typeof packet[2] !== 'undefined') {
                        hostid = packet[2];
                    }
                    var playerList = packet[3];
                    if (playerList && playerList.length) {
                        for (var i = 0; i < playerList.length; i++) {
                            if (playerList[i]) {
                                playerids[i] = playerList[i].userName;
                                if (i == myid) {
                                    username = playerList[i].userName;
                                }
                            }
                        }
                    }
                }



                if (type == 41) {
                    var p41payload = packet[1];
                    if (p41payload && typeof p41payload.newHost !== 'undefined') {
                        hostid = p41payload.newHost;
                        console.log("Jukebox: Packet 41 set Host ID to " + hostid);
                    }
                }



                if (type == 6) {
                    if (typeof packet[2] !== 'undefined') {
                        hostid = packet[2];
                        console.log("Jukebox: Packet 6 set Host ID to " + hostid);
                    }
                }



                if (type == 5) {
                    delete playerids[packet[1]];
                    if (packet[1] == myid) {
                        console.log("Jukebox: Detected self leave via Packet 5. Cleaning up.");
                        cleanupJukebox();
                    }
                }



                if (type == 29) {
                    if (typeof packet[2] !== 'undefined') {
                        hostid = packet[2];
                    }
                }

                if (type == 7) {
                    var senderId = packet[1];
                    var payload = packet[2];

                    if (senderId == myid) return;

                    if (payload) {
                        if (payload.type == "video player") {
                            if (senderId == hostid) {
                                changeJukeboxURL(payload.url, payload.timestamp);
                            }
                        } else if (payload.type == "jukebox suggestion") {
                            if (hostid == myid) {
                                displaySuggestionInChat(payload.from, payload.url);
                            }
                        } else if (payload.type == "jukebox query") {
                            var response = '42' + JSON.stringify([4, { "type": "jukebox version", "from": username, "version": JUKEBOX_VERSION }]);
                            originalSend.call(bonkwss, response);
                        } else if (payload.type == "jukebox version") {
                            if (jukeboxQueryActive) {
                                var ver = payload.version || "Unknown";
                                var name = payload.from || playerids[senderId] || "Unknown";
                                jukeboxQueryResults.push(name + " (v" + ver + ")");
                            }
                        }
                    }
                }


                if (type == 4 && packet.length >= 8) {
                    if (typeof packet[1] === 'number' && typeof packet[3] === 'string' && typeof packet[7] === 'object') {
                        var newPlayerId = packet[1];
                        var newPlayerName = packet[3];

                        playerids[newPlayerId] = newPlayerName;

                        if (hostid == myid && jukeboxplayer && !jukeboxplayer.isPaused()) {
                            var ts = Date.now() - jukeboxplayer.getCurrentTime() * 1000;

                            setTimeout(function() {
                                originalSend.call(ws, '42' + JSON.stringify([4, {
                                    "type": "video player",
                                    "from": username,
                                    "url": jukeboxplayerURL,
                                    "timestamp": ts,
                                    "to": [-1]
                                }]));
                            }, 2000);
                            displayInChat("Auto-synced for " + newPlayerName);
                        }
                    }
                }

                if (type == 7 && packet[2] && typeof packet[2].message === 'string') {
                    var msg = packet[2].message;
                    if (hostid == myid && msg.endsWith(" has joined the game")) {


                    }
                }
            }
            if (originalOnMessage) originalOnMessage.call(this, e);
        };
    }

    function handleChatInput(e, inputId) {
        if (e.keyCode == 13) {
            var input = Gdocument.getElementById(inputId);
            var val = input.value;

            if (val.startsWith("/jukebox ") || val.startsWith("/playjukebox") || val.startsWith("/pausejukebox") || val.startsWith("/resetjukebox") || val.startsWith("/volume ") || val.startsWith("/jukeboxhost") || val.startsWith("/jukeboxwho")) {

                input.value = "";
                e.preventDefault();
                e.stopPropagation();

                if (val.startsWith("/volume ")) {
                    var vol = parseInt(val.substring(8));
                    if (!isNaN(vol)) {
                        jukeboxplayervolume = vol;
                        if (jukeboxplayer) jukeboxplayer.setVolume(vol);
                        displayInChat("Volume set to " + vol + "%");
                    }
                }
                else if (val.startsWith("/jukeboxhost")) {
                    var hostName = playerids[hostid] || "Unknown";
                    displayInChat("Current Host: " + hostName + " (ID: " + hostid + ")");
                }
                else if (val.startsWith("/jukeboxwho")) {
                    jukeboxQueryActive = true;
                    jukeboxQueryResults = [];
                    displayInChat("Querying players for Jukebox...");

                    if (bonkwss) {
                        var packet = '42' + JSON.stringify([4, { "type": "jukebox query", "from": username }]);
                        originalSend.call(bonkwss, packet);
                    }

                    setTimeout(function() {
                        jukeboxQueryActive = false;
                        var list = ["You (v" + JUKEBOX_VERSION + ")"].concat(jukeboxQueryResults);
                        displayInChat("Jukebox Users: " + list.join(", "));
                    }, 3000);
                }

                if (bonkwss) {                    if (val.startsWith("/jukebox ")) {
                    var url = val.substring(9).trim();
                    if (hostid == myid) {
                        var packet = '42' + JSON.stringify([4, { "type": "video player", "from": username, "url": url, "timestamp": Date.now() + 2000, "to": [-1] }]);
                        console.log("Jukebox: Sending packet: ", packet);
                        originalSend.call(bonkwss, packet);
                        changeJukeboxURL(url, Date.now() + 2000);
                    } else {
                        var packet = '42' + JSON.stringify([4, { "type": "jukebox suggestion", "from": username, "url": url }]);
                        originalSend.call(bonkwss, packet);
                        displayInChat("Suggestion sent to host.");
                    }
                }
                    else if (val.startsWith("/pausejukebox")) {
                        if (jukeboxplayer) jukeboxplayer.pause();
                        originalSend.call(bonkwss, '42' + JSON.stringify([4, { "type": "video player", "from": username, "url": "", "timestamp": Date.now(), "to": [-1] }]));
                    }
                    else if (val.startsWith("/resetjukebox")) {
                        if (jukeboxplayer) {
                            jukeboxplayer.setCurrentTime(0);
                            changeJukeboxURL(jukeboxplayerURL, Date.now() + 2000);
                            originalSend.call(bonkwss, '42' + JSON.stringify([4, { "type": "video player", "from": username, "url": jukeboxplayerURL, "timestamp": Date.now() + 2000, "to": [-1] }]));
                        }
                    }
                    else if (val.startsWith("/playjukebox")) {
                        if (jukeboxplayer) {
                            var ts = Date.now() - jukeboxplayer.getCurrentTime() * 1000;
                            changeJukeboxURL(jukeboxplayerURL, ts, true);
                            originalSend.call(bonkwss, '42' + JSON.stringify([4, { "type": "video player", "from": username, "url": jukeboxplayerURL, "timestamp": ts, "to": [-1] }]));
                        }
                    }
                }
                return false;
            }
        }
        return true;
    }

    function hookInput(id) {
        var elem = Gdocument.getElementById(id);
        if (elem) {
            var oldKeyDown = elem.onkeydown;
            elem.onkeydown = function(e) {
                if (handleChatInput(e, id) === false) return;
                if (oldKeyDown) oldKeyDown.call(this, e);
            };
        }
    }

    var attempts = 0;
    var interval = setInterval(function() {
        attempts++;
        var bcLoaded = (typeof scope.injectedBonkCommandsScript !== 'undefined');
        var chatInput = Gdocument.getElementById("newbonklobby_chat_input");

        if (chatInput && (bcLoaded || attempts > 20)) {
            hookInput("newbonklobby_chat_input");
            hookInput("ingamechatinputtext");
            clearInterval(interval);
            console.log("Bonk Jukebox: Inputs hooked (BC Loaded: " + bcLoaded + ")");
        }
    }, 500);
});
