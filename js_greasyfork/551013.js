// ==UserScript==
// @name         Drawaria.online SimpleBot Lite
// @namespace    http://tampermonkey.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @version      1.2
// @description  Reliable bot entry and exit in drawaria.online with connection waiting and buttons at the bottom of the screen
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551013/Drawariaonline%20SimpleBot%20Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/551013/Drawariaonline%20SimpleBot%20Lite.meta.js
// ==/UserScript==

(function () {
  'use strict';

  class BotClient {
    constructor() {
      this.name = "𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫";
      this.avatar = ["cf19b8f0-cf31-11ed-9ece-d584b24f60dc", "1680377222354"];
      this.room = { id: null, type: 2, players: [] };
      this.socket = null;
      this.interval_id = 0;
      this.interval_ms = 25000;
      this.customObservers = [];
    }

    parseServerUrl(any) {
      var prefix = String(any).length == 1 ? `sv${any}.` : "";
      return `wss://${prefix}drawaria.online/socket.io/?sid1=undefined&hostname=drawaria.online&EIO=3&transport=websocket`;
    }

    parseRoomId(any) {
      return String(any).match(/([a-f0-9.-]+?)$/gi)[0];
    }

    getReadyState() {
      if (!this.socket) return false;
      return this.socket.readyState === WebSocket.OPEN;
    }

    connect(url) {
      if (this.getReadyState()) return;
      if (!url) return; // требуем url комнаты

      this.socket = new WebSocket(this.parseServerUrl(url));

      this.socket.addEventListener("open", () => {
        this.interval_id = setInterval(() => {
          if (!this.getReadyState()) clearInterval(this.interval_id);
          else this.send(2);
        }, this.interval_ms);
      });

      this.socket.addEventListener("message", (message_event) => {
        const prefix = String(message_event.data).match(/(^\d+)/gi)?.[0] || "";
        if (prefix === "40") {
          this.send(this.emits().startplay(this.room, this.name, this.avatar));
        }
      });

      this.socket.addEventListener("close", () => {
        clearInterval(this.interval_id);
        console.log("Socket closed");
      });
    }

    disconnect() {
      if (!this.getReadyState()) return;
      this.socket.close();
    }

    reconnect() {
      this.send(41);
      this.send(40);
    }

    enterRoom(roomid) {
      this.room.id = this.parseRoomId(roomid);
      if (!this.getReadyState()) {
        this.connect(this.room.id.includes(".") ? this.room.id.slice(-1) : "");
        this.socket.addEventListener(
          "open",
          () => {
            this.reconnect();
          },
          { once: true }
        );
      } else {
        this.reconnect();
      }
    }

    send(data) {
      if (!this.getReadyState()) {
        console.warn("Socket not ready", data);
        return;
      }
      this.socket.send(data);
    }

    emits() {
      return {
        startplay: (room, name, avatar) => {
          return `${420}${JSON.stringify([
            "startplay",
            name,
            room.type,
            "en",
            room.id,
            null,
            [
              null,
              "https://drawaria.online/",
              1000,
              1000,
              [null, avatar[0], avatar[1]],
              null,
            ],
          ])}`;
        },
      };
    }
  }

  function setupBotUI() {
    if (document.getElementById("botControlPanel")) return;

    const bot = new BotClient();

    const container = document.createElement("div");
    container.id = "botControlPanel";
    Object.assign(container.style, {
      position: "fixed",
      bottom: "2cm",
      left: "20px",
      backgroundColor: "rgba(0,0,0,0.85)",
      color: "white",
      padding: "12px",
      borderRadius: "8px",
      fontFamily: "Arial, sans-serif",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      width: "230px",
      zIndex: 9999999,
      boxShadow: "0 0 15px rgba(0,0,0,0.7)",
    });

    const enterButton = document.createElement("button");
    enterButton.textContent = "Enter Room";
    enterButton.style.cursor = "pointer";
    enterButton.onclick = () => {
      const roomUrl = prompt("Enter full room URL:");
      if (roomUrl) {
        bot.enterRoom(roomUrl);
        alert("Bot is trying to enter room...");
      } else alert("Please enter a room URL!");
    };

    const leaveButton = document.createElement("button");
    leaveButton.textContent = "Leave Room";
    leaveButton.style.cursor = "pointer";
    leaveButton.onclick = () => {
      bot.disconnect();
      alert("Bot disconnected");
    };

    container.appendChild(enterButton);
    container.appendChild(leaveButton);

    document.body.appendChild(container);
  }

  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    setupBotUI();
  } else {
    window.addEventListener("DOMContentLoaded", setupBotUI);
  }
})();