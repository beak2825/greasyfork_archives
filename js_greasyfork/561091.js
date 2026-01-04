// ==UserScript==
// @name         Chat+
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  Chat+, the first Multiplayer Piano chat that uses an external server to grant chatting capabilities.
// @author       You
// @match        *://multiplayerpiano.org/*
// @match        *://multiplayerpiano.net/*
// @icon         https://multiplayerpiano.net/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561091/Chat%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/561091/Chat%2B.meta.js
// ==/UserScript==

function getChannel() {
    let urlParams = new URLSearchParams(window.location.search);
    let cValue = urlParams.get("c");
    return cValue;
};

// =+=+=+=+= Server =+=+=+=+= \\
let ChatServer = document.createElement("iframe");
ChatServer.src = "https://xmr37v-1967.csb.app";
ChatServer.style.position = "fixed";
ChatServer.style.top = "0";
ChatServer.style.left = "0";
ChatServer.style.width = "100vw";
ChatServer.style.height = "100vh";
ChatServer.style.border = "none";
ChatServer.style.zIndex = "99999999999999999";
document.body.appendChild(ChatServer);

// =+=+=+=+= Functions =+=+=+=+= \\
function sendChat(token, msg, room) {
    if (!token || !msg) return;
    ChatServer.contentWindow.postMessage({
        type: "ws:send",
        data: JSON.stringify({ m: "a", token, message: msg, room })
    }, "*");
};

const chatList = document.querySelector("#chat ul");

function addChat(player, message) {
    const chatList = document.querySelector("#chat ul");
    if (!chatList) return;

    const msgID = "msg-" + Math.random().toString(16).slice(2, 10);

    const now = new Date();
    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const ampm = now.getHours() >= 12 ? "PM" : "AM";
    const timestamp = `${hours}:${minutes}:${seconds} ${ampm}`;

    const playerID = player.ID || "000000";
    const playerName = player.Name || "Anonymous";
    const playerColor = player.Color || "#ffffff";

    const li = document.createElement("li");
    li.id = msgID;
    li.title = player.ID || "";
    li.style.opacity = "0.97";

    // Create span elements safely with textContent
    const replySpan = document.createElement("span");
    replySpan.className = "reply";
    replySpan.textContent = "➦";

    const timestampSpan = document.createElement("span");
    timestampSpan.className = "timestamp";
    timestampSpan.textContent = timestamp;

    const idSpan = document.createElement("span");
    idSpan.className = "id";
    idSpan.textContent = playerID;

    const nameSpan = document.createElement("span");
    nameSpan.className = "name";
    nameSpan.style.color = playerColor;
    nameSpan.textContent = `${playerName}:`;

    const messageSpan = document.createElement("span");
    messageSpan.className = "message";
    messageSpan.style.color = playerColor;
    messageSpan.textContent = message;

    li.appendChild(replySpan);
    li.appendChild(timestampSpan);
    li.appendChild(idSpan);
    li.appendChild(nameSpan);
    li.appendChild(messageSpan);

    chatList.appendChild(li);
    chatList.scrollTop = chatList.scrollHeight;
}

// =+=+=+=+= Recieve Messages =+=+=+=+= \\
window.addEventListener("message", event => {
    let msg = JSON.parse(event.data.data)
    console.log(msg);
    if (event.data.type === "ws:msg") {
        if (msg.m === "welcome") {
            if (!localStorage.cplustoken) {
                console.log("No token. Request one. (@sherlockmpp < discord)");
            };
            ChatServer.style.display = "block";
            ChatServer.style.opacity = "0";
            ChatServer.style.pointerEvents = "none";
            ChatServer.style.zIndex = "1";
            setInterval(() => {
                let channel = getChannel();
                ChatServer.contentWindow.postMessage({
                    type: "ws:send",
                    data: JSON.stringify({ m: "ch", _id: channel })
                }, "*");
            }, 1000);
        };

        if (msg.m === "a") {
            if (!msg.p || !msg.message) return;
            addChat(msg.p, msg.message);
        };
    };
});

window.addEventListener("close", (tf) => {
    if (true) return addChat({ Name: "Chat+", Color: "#ffffff", ID: -1, Muted: false, Rank: 5 }, "You have been disconnected from the server. Refresh to reconnect. If the issue presists, contact staff.");
});

// =+=+=+=+= Send Messages =+=+=+=+= \\
let chatInput = document.querySelector("#chat-input");
let orig = MPP.chat.send;

MPP.chat.send = function(msg) {
    const args = msg.split(" ").join(" ");
    const message = args[0].trim();
    if (!message) return;

    if (message === "~") {
        if (!localStorage.cplustoken) return console.log("No token. Request one. (@sherlockmpp < discord)");
        return sendChat(localStorage.cplustoken, args.slice(message.length), getChannel());
    }

    orig.call(MPP.chat, msg);
    chatInput.value = "";
};