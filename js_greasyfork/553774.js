// ==UserScript==
// @name         ayase
// @namespace    https://github.com/Vincent-the-gamer/ayase
// @version      0.1.1
// @author       Vincent-the-gamer
// @description  A userscript + websocket to observe and record Bilibili live danmakus.
// @license      https://github.com/Vincent-the-gamer/ayase/blob/main/LICENSE.md
// @icon         https://img.moegirl.org.cn/common/6/61/%E4%B8%89%E5%8F%B8%E7%BB%AB%E6%BF%91_%E8%A7%92%E8%89%B2%E6%AD%8C%E4%B8%93%E8%BE%91%E5%B0%81%E9%9D%A2.jpg
// @match        https://live.bilibili.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/553774/ayase.user.js
// @updateURL https://update.greasyfork.org/scripts/553774/ayase.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const d=new Set;const importCSS = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):(document.head||document.documentElement).appendChild(document.createElement("style")).append(t);})(e));};

  let currentUser = null;
  let danmakuType = null;
  function game2048(ws, danmaku) {
    if (danmaku.text === "2048上机") {
      currentUser = danmaku.uname;
      danmakuType = "2048";
      console.log(`2048用户: [${danmaku.uname}] 已上机！`);
    }
    if (danmaku.uname === "诡锋Vincent" && danmaku.text === "强制下机") {
      currentUser = null;
      danmakuType = "danmaku";
      console.log(`2048 -- 管理员已强制用户下机！`);
    }
    if (!currentUser) {
      danmakuType = "danmaku";
      ws.send(
        JSON.stringify({
          ...danmaku,
          type: danmakuType
        })
      );
      return;
    }
    if (currentUser === danmaku.uname) {
      if (danmaku.text === "2048下机") {
        currentUser = null;
        danmakuType = "danmaku";
        console.log(`2048用户: [${danmaku.uname}] 已下机！`);
        ws.send(
          JSON.stringify({
            ...danmaku,
            type: danmakuType
          })
        );
      } else {
        danmakuType = "2048";
        console.log(`2048用户: [${danmaku.uname}] 发送指令`, danmaku);
        ws.send(
          JSON.stringify({
            ...danmaku,
            type: danmakuType
          })
        );
      }
    }
  }
  function setupObserver(serverLink) {
    let observer = null;
    const startObserver = () => {
      try {
        const ws = new WebSocket(serverLink);
        observer = new MutationObserver((mutations, _) => {
          mutations.forEach((mutation) => {
            if (mutation.type === "childList") {
              const addedNodes = Array.from(mutation.addedNodes);
              const node = addedNodes[0];
              const danmaku = {
                type: "danmaku",
                uname: node.querySelector("span.user-name")?.innerHTML,
                text: node.getAttribute("data-danmaku"),
                img: "",
                replacement: ""
              };
              const emoticon = node.querySelector("span.emoticon");
              if (emoticon) {
                danmaku.img = emoticon.querySelector("img.open-menu")?.getAttribute("src");
                danmaku.replacement = emoticon.querySelector("span.open-menu")?.innerHTML;
              }
              game2048(ws, danmaku);
            }
          });
        });
        const config = {
          attributes: false,
          childList: true,
          subtree: true
        };
        const danmakuDOMList = document.querySelector(".chat-history-list");
        if (danmakuDOMList) {
          observer.observe(danmakuDOMList, config);
        }
        alert(`WebSocket连接: ${serverLink}`);
      } catch (e) {
        alert(`WebSocket连接错误: ${e}`);
      }
    };
    const stopObserver = () => {
      observer?.disconnect();
    };
    return { observer, startObserver, stopObserver };
  }
  const styleCss = ".config{position:fixed;display:flex;flex-direction:row;justify-content:center;align-items:center;gap:7px;top:5px;right:5px;width:fit-content;height:fit-content;border-radius:10px;padding:8px;z-index:1000;background:#40e0d0}.config img{width:30px;height:30px}.config input{width:200px;height:20px}.config button{background-color:#000;color:#fff;height:25px;border-radius:3px}.config button:hover{background-color:orange}";
  importCSS(styleCss);
  (() => {
    const app = document.createElement("div");
    document.body.append(app);
    return app;
  })().innerHTML = `
  <div class="config" id="ayase-app">
      <img src="https://i0.hdslb.com/bfs/article/eba9c4eeae160d5f72edf1d0c1eb409a3dd8f4e7.png"/>
      <span>WebSocket地址: </span>
      <input id="ayase-link" type="text" value="ws://localhost:8081/websocket"/>
      <button id="start-ayase">连接</button>
  </div>
`;
  const input = document.querySelector("#ayase-link");
  const button = document.querySelector("#start-ayase");
  let inputValue = input.value;
  input.addEventListener("input", (event) => {
    inputValue = event.target.value;
  });
  button.addEventListener("click", () => {
    const { observer, startObserver, stopObserver } = setupObserver(inputValue);
    if (!observer) {
      stopObserver();
    }
    startObserver();
  });

})();