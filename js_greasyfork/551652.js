// ==UserScript==
// @name         ChatGPT + DeepL + Google 三合一選取翻譯（底部 + 右側歷史 + 朗讀）
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自動翻譯選取文字為繁體中文，整合 Google / DeepL / ChatGPT，底部浮窗，右側歷史紀錄，朗讀功能。
// @author       issac
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      translate.googleapis.com
// @connect      api-free.deepl.com
// @connect      api.openai.com
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/551652/ChatGPT%20%2B%20DeepL%20%2B%20Google%20%E4%B8%89%E5%90%88%E4%B8%80%E9%81%B8%E5%8F%96%E7%BF%BB%E8%AD%AF%EF%BC%88%E5%BA%95%E9%83%A8%20%2B%20%E5%8F%B3%E5%81%B4%E6%AD%B7%E5%8F%B2%20%2B%20%E6%9C%97%E8%AE%80%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/551652/ChatGPT%20%2B%20DeepL%20%2B%20Google%20%E4%B8%89%E5%90%88%E4%B8%80%E9%81%B8%E5%8F%96%E7%BF%BB%E8%AD%AF%EF%BC%88%E5%BA%95%E9%83%A8%20%2B%20%E5%8F%B3%E5%81%B4%E6%AD%B7%E5%8F%B2%20%2B%20%E6%9C%97%E8%AE%80%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEEPL_API_KEY = "你的_DeepL_API_KEY";
    const OPENAI_API_KEY = "你的_OpenAI_API_KEY";

    GM_addStyle(`
        #translatorBox {
            position: fixed;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 100%;
            max-width: 900px;
            background: rgba(255,255,255,0.98);
            border-top: 2px solid #333;
            border-radius: 12px 12px 0 0;
            padding: 10px;
            box-shadow: 0 -4px 15px rgba(0,0,0,0.2);
            z-index: 999999;
            font-family: "Microsoft JhengHei", Arial, sans-serif;
            text-align: center;
            display: none;
        }
        #translatorResult {
            margin-top: 10px;
            font-size: 24px;
            font-weight: bold;
            color: #111;
            line-height: 1.6;
            word-break: break-word;
        }
        .engine-btn {
            cursor: pointer;
            padding: 8px 14px;
            margin: 6px;
            border: none;
            border-radius: 8px;
            font-size: 15px;
            color: #fff;
        }
        .google { background: #4285F4; }
        .deepl { background: #0F7CDA; }
        .chatgpt { background: #10A37F; }

        /* 歷史紀錄視窗 */
        #historyContainer {
            position: fixed;
            top: 20%;
            right: 0;
            width: 300px;
            max-height: 60%;
            background: rgba(255,255,255,0.95);
            border: 1px solid #ccc;
            border-radius: 8px 0 0 8px;
            padding: 10px;
            box-shadow: -2px 2px 10px rgba(0,0,0,0.2);
            z-index: 999998;
            font-family: Arial, sans-serif;
            font-size: 14px;
            overflow-y: auto;
            display: none;
        }
        #historyHeader {
            cursor: pointer;
            font-weight: bold;
            text-align: center;
            background: #eee;
            padding: 5px;
            border-radius: 5px;
            margin-bottom: 5px;
        }
        #historyList div {
            border-bottom: 1px solid #ddd;
            padding: 4px;
            font-size: 13px;
        }
        .tts-btn {
            cursor: pointer;
            padding: 5px 10px;
            margin-left: 5px;
            border: none;
            border-radius: 5px;
            font-size: 14px;
            background: #ff9800;
            color: white;
        }
    `);

    const box = document.createElement("div");
    box.id = "translatorBox";
    box.innerHTML = `
        <h3 style="margin:0;font-size:18px;">翻譯結果（繁體中文）</h3>
        <div id="translatorResult">請選取文字</div>
        <div id="translatorButtons">
            <button class="engine-btn google" data-engine="google">Google</button>
            <button class="engine-btn deepl" data-engine="deepl">DeepL→繁體</button>
            <button class="engine-btn chatgpt" data-engine="chatgpt">ChatGPT</button>
            <button class="tts-btn" data-type="original">朗讀原文</button>
            <button class="tts-btn" data-type="translation">朗讀翻譯</button>
        </div>
    `;
    document.body.appendChild(box);

    const historyBox = document.createElement("div");
    historyBox.id = "historyContainer";
    historyBox.innerHTML = `
        <div id="historyHeader">📜 歷史紀錄 ▼</div>
        <div id="historyList"></div>
    `;
    document.body.appendChild(historyBox);

    let selectedText = "";
    let currentEngine = "google";
    let history = [];
    let historyVisible = true;

    document.addEventListener("mouseup", () => {
        const sel = window.getSelection().toString().trim();
        if (sel && sel !== selectedText) {
            selectedText = sel;
            box.style.display = "block";
            translateText(selectedText, currentEngine);
        } else if (!sel) {
            box.style.display = "none";
        }
    });

    document.querySelectorAll(".engine-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            if (selectedText) {
                currentEngine = this.dataset.engine;
                translateText(selectedText, currentEngine);
            }
        });
    });

    document.querySelectorAll(".tts-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            const type = this.dataset.type;
            const text = type === "original" ? selectedText : document.getElementById("translatorResult").innerText;
            playTTS(text, type);
        });
    });

    document.getElementById("historyHeader").addEventListener("click", () => {
        historyVisible = !historyVisible;
        document.getElementById("historyList").style.display = historyVisible ? "block" : "none";
        document.getElementById("historyHeader").innerText = historyVisible ? "📜 歷史紀錄 ▼" : "📜 歷史紀錄 ▲";
    });

    function addHistory(original, translation, engine) {
        history.unshift({ original, translation, engine });
        const historyList = document.getElementById("historyList");
        historyList.innerHTML = history.map(h => `<div><b>[${h.engine}]</b> ${h.original} → ${h.translation}</div>`).join("");
        historyBox.style.display = "block";
    }

    function detectLanguage(text, callback) {
        fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`)
            .then(res => res.json())
            .then(data => {
                const detectedLang = data[2] || "en";
                callback(detectedLang);
            })
            .catch(() => callback("en"));
    }

    function playTTS(text, type) {
        if (!text) return;
        if (type === "original") {
            detectLanguage(text, lang => {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = lang;
                speechSynthesis.speak(utterance);
            });
        } else {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = "zh-TW";
            speechSynthesis.speak(utterance);
        }
    }

    function translateText(text, engine) {
        const resultDiv = document.getElementById("translatorResult");
        resultDiv.innerText = "翻譯中…";

        if (engine === "google") {
            fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-TW&dt=t&q=${encodeURIComponent(text)}`)
                .then(res => res.json())
                .then(data => {
                    const translation = data[0].map(d => d[0]).join("");
                    resultDiv.innerText = translation;
                    addHistory(text, translation, "Google");
                })
                .catch(() => resultDiv.innerText = "Google 翻譯失敗");
        }

        else if (engine === "deepl") {
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://api-free.deepl.com/v2/translate",
                headers: {
                    "Authorization": "DeepL-Auth-Key " + DEEPL_API_KEY,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: `text=${encodeURIComponent(text)}&target_lang=ZH`,
                onload: function(res) {
                    try {
                        const data = JSON.parse(res.responseText);
                        const zhCN = data?.translations?.[0]?.text || "";
                        if (!zhCN) {
                            resultDiv.innerText = "DeepL 翻譯失敗";
                            return;
                        }
                        fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=zh-TW&dt=t&q=${encodeURIComponent(zhCN)}`)
                            .then(r => r.json())
                            .then(d => {
                                const translation = d[0].map(x => x[0]).join("");
                                resultDiv.innerText = translation;
                                addHistory(text, translation, "DeepL");
                            })
                            .catch(() => resultDiv.innerText = "繁體轉換失敗");
                    } catch (err) {
                        resultDiv.innerText = "DeepL 翻譯解析錯誤：" + err.message;
                    }
                },
                onerror: () => resultDiv.innerText = "DeepL API 錯誤"
            });
        }

        else if (engine === "chatgpt") {
            if (!OPENAI_API_KEY) {
                resultDiv.innerText = "請先設定 OpenAI API Key";
                return;
            }
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://api.openai.com/v1/chat/completions",
                headers: {
                    "Authorization": "Bearer " + OPENAI_API_KEY,
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: "你是一位專業的翻譯員，請將以下文字翻譯成繁體中文：" },
                        { role: "user", content: text }
                    ]
                }),
                onload: function(response) {
                    try {
                        const res = JSON.parse(response.responseText);
                        if (res?.error?.code === "insufficient_quota") {
                            resultDiv.innerText = "ChatGPT 今日額度已用完";
                        } else {
                            const msg = res?.choices?.[0]?.message?.content || "ChatGPT 翻譯失敗";
                            resultDiv.innerText = msg.trim();
                            addHistory(text, msg.trim(), "ChatGPT");
                        }
                    } catch (err) {
                        resultDiv.innerText = "ChatGPT 翻譯解析錯誤：" + err.message;
                    }
                },
                onerror: e => resultDiv.innerText = "ChatGPT API 請求錯誤：" + JSON.stringify(e)
            });
        }
    }
})();
