// ==UserScript==
// @name         虚言癖のおーなー用いろいろ楽しいやつ
// @match         https://pictsense.com/*
// @grant         none
// @description   これでディスコみたいな遊びができる
// @version 0.0.1.20260126070721
// @namespace https://greasyfork.org/users/1471874
// @downloadURL https://update.greasyfork.org/scripts/564091/%E8%99%9A%E8%A8%80%E7%99%96%E3%81%AE%E3%81%8A%E3%83%BC%E3%81%AA%E3%83%BC%E7%94%A8%E3%81%84%E3%82%8D%E3%81%84%E3%82%8D%E6%A5%BD%E3%81%97%E3%81%84%E3%82%84%E3%81%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/564091/%E8%99%9A%E8%A8%80%E7%99%96%E3%81%AE%E3%81%8A%E3%83%BC%E3%81%AA%E3%83%BC%E7%94%A8%E3%81%84%E3%82%8D%E3%81%84%E3%82%8D%E6%A5%BD%E3%81%97%E3%81%84%E3%82%84%E3%81%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let savedMsg = localStorage.getItem('auto_greet_text') || "うぃ";

    const container = document.createElement("div");
    container.id = "autoChatUI";
    // ドラッグ時にテキスト選択されないよう user-select:none を追加
    container.style.cssText = "display:none; position:fixed; top:120px; right:10px; z-index:9999; background:#222; padding:0; border-radius:10px; color:#fff; font-family:sans-serif; width:220px; border:1px solid #444; box-shadow: 0 4px 15px rgba(0,0,0,0.5); user-select:none;";

    container.innerHTML = `
        <div id="dragHeader" style="background:#333; padding:8px; border-top-left-radius:10px; border-top-right-radius:10px; cursor:move; font-size:11px; color:#888; text-align:center; border-bottom:1px solid #444;">ここをドラッグで移動</div>

        <div style="padding:15px;">
            <div style="font-weight:bold; margin-bottom:8px; font-size:13px; border-bottom:1px solid #444; padding-bottom:5px;">自動挨拶設定</div>
            <input type="text" id="greetInput" value="${savedMsg}" style="width:100%; background:#333; border:1px solid #555; color:#fff; padding:5px; border-radius:4px; font-size:12px; box-sizing:border-box; margin-bottom:15px;">

            <div style="font-weight:bold; margin-bottom:8px; font-size:13px; border-bottom:1px solid #444; padding-bottom:5px;">コマンド実行</div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:5px; margin-bottom:15px;">
                <button class="c-btn" data-msg="/slot">🎰 スロット</button>
                <button class="c-btn" data-msg="/random">👤 人選(ランダム)</button>
                <button class="c-btn" data-msg="/dice">🎲 ダイス</button>
                <button class="c-btn" data-msg="/coin">🪙 コイン</button>
                <button class="c-btn" data-msg="/janken">✊ じゃんけん</button>
                <button class="c-btn" data-msg="/uranai">🔮 占い</button>
            </div>

            <div style="font-weight:bold; margin-bottom:8px; font-size:13px; border-bottom:1px solid #444; padding-bottom:5px;">クイックリアクション</div>
            <div id="quickButtons" style="display:flex; flex-wrap:wrap; gap:5px; margin-top:8px;">
                <button class="q-btn" data-msg="おつぅ">おつぅ</button>
                <button class="q-btn" data-msg="ww">ww</button>
                <button class="q-btn" data-msg="どんまい">どんまい</button>
                <button class="q-btn" data-msg="おかえり">おかえり</button>
                <button class="q-btn" data-msg="おーなーかえして">おーなーかえして</button>
            </div>
        </div>

        <style>
            .c-btn, .q-btn { background: #444; color: #fff; border: none; padding: 6px; border-radius: 4px; font-size: 11px; cursor: pointer; transition: 0.1s; }
            .c-btn { background: #0056b3; font-weight: bold; }
            .c-btn:hover { background: #007bff; }
            .q-btn:hover { background: #666; }
            .q-btn:active, .c-btn:active { transform: translateY(2px); }
        </style>
    `;
    document.body.appendChild(container);

    // --- ドラッグ処理の追加 ---
    let isDragging = false;
    let offset = { x: 0, y: 0 };
    const header = document.getElementById("dragHeader");

    header.onmousedown = (e) => {
        isDragging = true;
        offset.x = e.clientX - container.offsetLeft;
        offset.y = e.clientY - container.offsetTop;
    };

    document.onmousemove = (e) => {
        if (!isDragging) return;
        container.style.left = (e.clientX - offset.x) + "px";
        container.style.top = (e.clientY - offset.y) + "px";
        container.style.right = "auto"; // 右端固定を解除
    };

    document.onmouseup = () => {
        isDragging = false;
    };

    // --- 元々のロジック ---
    const sendChat = (text) => {
        const input = document.querySelector("#chatText");
        const btn = document.querySelector("#chatSubmitButton");
        if (input && btn && text) {
            input.value = text;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            btn.click();
        }
    };

    container.querySelectorAll(".q-btn, .c-btn").forEach(btn => {
        btn.onclick = () => sendChat(btn.getAttribute("data-msg"));
    });

    const startObserve = () => {
        const targetList = document.querySelector("#chatMessage");
        if (!targetList) {
            setTimeout(startObserve, 500);
            return;
        }

        const observer = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                for (let node of mutation.addedNodes) {
                    if (node.nodeName !== "LI") continue;
                    const text = node.innerText;

                    if (text.includes("の参加を自動承認しました")) {
                        const msg = document.getElementById("greetInput").value || "うぃ";
                        setTimeout(() => sendChat(msg), 1200);
                        continue;
                    }

                    const isDice = text.includes("/dice");
                    const isCoin = text.includes("/coin");
                    const isJanken = text.includes("/janken");
                    const isUranai = text.includes("/uranai");
                    const isSlot = text.includes("/slot");
                    const isRandom = text.includes("/random");

                    if (isDice || isCoin || isJanken || isUranai || isSlot || isRandom) {
                        const nameEl = node.querySelector(".userName");
                        if (nameEl) {
                            const userName = nameEl.innerText;
                            let resultMsg = "";

                            if (isSlot) {
                                const symbols = ["🍒", "🔔", "🍉", "🍇", "🍋", "💎", "7️⃣"];
                                const s = [symbols[Math.floor(Math.random() * 7)], symbols[Math.floor(Math.random() * 7)], symbols[Math.floor(Math.random() * 7)]];
                                const isWin = (s[0] === s[1] && s[1] === s[2]);
                                const isJackpot = (isWin && s[0] === "7️⃣");
                                resultMsg = `${userName}：[ ${s[0]} | ${s[1]} | ${s[2]} ] ${isJackpot ? "JACKPOT!!!" : (isWin ? "WIN!" : "")}`;
                            } else if (isRandom) {
                                const memberThs = document.querySelectorAll("#userList tr th");
                                const users = Array.from(memberThs).map(el => el.innerText.trim()).filter(n => n !== "");
                                if (users.length > 0) {
                                    const picked = users[Math.floor(Math.random() * users.length)];
                                    resultMsg = `${picked}`;
                                }
                            } else if (isDice) {
                                resultMsg = `${userName}：${Math.floor(Math.random() * 100) + 1}`;
                            } else if (isCoin) {
                                resultMsg = `${userName}：${Math.random() < 0.5 ? "表" : "裏"}`;
                            } else if (isJanken) {
                                resultMsg = `${userName}：${["✊", "✌", "🖐"][Math.floor(Math.random() * 3)]}`;
                            } else if (isUranai) {
                                const fortunes = ["大大大大大吉", "大吉", "中吉", "吉", "小吉", "末吉", "凶", "大凶", "大大大大大凶"];
                                resultMsg = `${userName}：${fortunes[Math.floor(Math.random() * fortunes.length)]}`;
                            }

                            if (resultMsg) {
                                setTimeout(() => sendChat(resultMsg), 600);
                            }
                        }
                    }
                }
            }
        });

        observer.observe(targetList, { childList: true });
    };

    startObserve();

    window.toggleAutoChat = (isVisible) => {
        container.style.display = isVisible ? "block" : "none";
    };
})();