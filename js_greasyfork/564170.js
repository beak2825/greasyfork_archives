// ==UserScript==
// @name         Browser AI By N1ko
// @namespace    http://tampermonkey.net/
// @version      8.0
// @description  AI Assistant with Screen Reading (Coupons, Prices, Summary)
// @author       N1ko
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.groq.com
// @connect      api.openai.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564170/Browser%20AI%20By%20N1ko.user.js
// @updateURL https://update.greasyfork.org/scripts/564170/Browser%20AI%20By%20N1ko.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let apiKey = GM_getValue("user_api_key", "");
    let chatHistory = GM_getValue("chat_log", []);

    GM_addStyle(`
        @keyframes rainbow { 0%{border-color:#ff0000} 33%{border-color:#00ff00} 66%{border-color:#0000ff} 100%{border-color:#ff0000} }
        #n1ko-ui { position:fixed; top:80px; right:20px; width:400px; height:600px; background:#0a0a0a; color:white; z-index:999999; border:3px solid red; border-radius:15px; animation:rainbow 3s linear infinite; display:flex; flex-direction:column; font-family:sans-serif; box-shadow: 0 0 20px #000; }
        #n1ko-header { padding:12px; background:#111; display:flex; justify-content:space-between; font-weight:bold; border-bottom:1px solid #333; }
        #n1ko-chat { flex-grow:1; overflow-y:auto; padding:15px; background:#050505; font-size:13px; }
        #n1ko-input-area { padding:12px; background:#111; border-top:1px solid #333; }
        #n1ko-main-input { width:100%; background:#222; color:#0f0; border:1px solid #444; padding:10px; border-radius:6px; outline:none; }
        .bot-msg { color:#0f0; margin-bottom:12px; border-left:3px solid #0f0; padding-left:8px; white-space: pre-wrap; }
        .user-msg { color:#aaa; text-align:right; margin-bottom:12px; }
        #n1ko-toggle { position:fixed; top:20px; right:20px; z-index:1000001; cursor:pointer; background:#000; border:2px solid #fff; color:#fff; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; }
        .screen-badge { font-size: 10px; color: #555; margin-bottom: 5px; display: block; }
    `);

    // UI Structure
    const ui = document.createElement('div');
    ui.id = 'n1ko-ui';
    ui.innerHTML = `
        <div id="n1ko-header"><span>N1KO INTELLIGENCE v8.0</span> <span id="n1ko-close" style="cursor:pointer">✖</span></div>
        <div style="padding:10px; background:#1a1a1a; display:flex; gap:5px; border-bottom:1px solid #333;">
            <input type="password" id="api-key-input" placeholder="Paste Key" style="flex:1; background:#000;color:#fff;border:1px solid #444;padding:4px;font-size:11px;">
            <button id="save-key" style="cursor:pointer;background:#444;color:white;border:none;padding:4px 8px;border-radius:4px;">SAVE</button>
            <span id="key-check" style="display:${apiKey ? 'inline' : 'none'};color:#0f0;">✔</span>
        </div>
        <div id="n1ko-chat"></div>
        <div id="n1ko-input-area">
            <span class="screen-badge">⚡ AUTO-SCANNING PAGE CONTENT...</span>
            <input type="text" id="n1ko-main-input" placeholder="Ask about coupons, prices, or this page...">
            <button id="n1ko-clear" style="margin-top:10px; width:100%; background:transparent; color:#555; border:none; cursor:pointer; font-size:10px;">RESET MEMORY</button>
        </div>
    `;
    document.body.appendChild(ui);

    const chat = document.getElementById('n1ko-chat');
    const mainInput = document.getElementById('n1ko-main-input');

    // 1. Memory Logic
    function renderHistory() {
        chat.innerHTML = '';
        chatHistory.forEach(msg => {
            const div = document.createElement('div');
            div.className = msg.role === 'user' ? 'user-msg' : 'bot-msg';
            div.innerHTML = `<b>${msg.role === 'user' ? '>' : 'N1ko'}:</b> ${msg.content}`;
            chat.appendChild(div);
        });
        chat.scrollTop = chat.scrollHeight;
    }
    renderHistory();

    // 2. Screen Scraper (The "Magic" part)
    function getPageContent() {
        // Grabs all visible text but ignores scripts/styles
        const clone = document.body.cloneNode(true);
        const scripts = clone.getElementsByTagName('script');
        const styles = clone.getElementsByTagName('style');
        while (scripts.length > 0) scripts[0].parentNode.removeChild(scripts[0]);
        while (styles.length > 0) styles[0].parentNode.removeChild(styles[0]);

        return clone.innerText.substring(0, 4000); // Limit to 4000 chars for speed
    }

    // 3. API Logic
    mainInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && mainInput.value.trim() !== "") {
            if (!apiKey) { alert("Enter API key first!"); return; }

            let userPrompt = mainInput.value;
            mainInput.value = 'Thinking...';
            mainInput.disabled = true;

            // Add to UI and Memory
            chatHistory.push({role: 'user', content: userPrompt});
            renderHistory();

            const pageText = getPageContent();
            const systemMessage = {
                role: "system",
                content: `You are N1ko Assistant. You can see the user's screen.
                Below is the current webpage content. Use it to find coupons, product details, or answer questions.
                --- PAGE CONTENT ---
                ${pageText}`
            };

            let apiUrl = apiKey.startsWith("gsk") ? "https://api.groq.com/openai/v1/chat/completions" : "https://api.openai.com/v1/chat/completions";
            let model = apiKey.startsWith("gsk") ? "llama-3.3-70b-versatile" : "gpt-4o-mini";

            GM_xmlhttpRequest({
                method: "POST",
                url: apiUrl,
                headers: { "Content-Type": "application/json", "Authorization": "Bearer " + apiKey },
                data: JSON.stringify({
                    model: model,
                    messages: [systemMessage, ...chatHistory]
                }),
                onload: (res) => {
                    mainInput.value = '';
                    mainInput.disabled = false;
                    try {
                        const data = JSON.parse(res.responseText);
                        const reply = data.choices[0].message.content;
                        chatHistory.push({role: 'assistant', content: reply});
                        GM_setValue("chat_log", chatHistory);
                        renderHistory();
                    } catch(err) {
                        chat.innerHTML += `<div style="color:red;">Error: AI couldn't read the page. Check Key/Balance.</div>`;
                    }
                }
            });
        }
    });

    // 4. Buttons
    document.getElementById('save-key').onclick = () => {
        let val = document.getElementById('api-key-input').value.trim();
        if (val) {
            GM_setValue("user_api_key", val); apiKey = val;
            document.getElementById('key-check').style.display = 'inline';
            alert("API Key Entered Successfully! ✔");
            document.getElementById('api-key-input').value = "********";
        }
    };

    document.getElementById('n1ko-clear').onclick = () => {
        chatHistory = [];
        GM_setValue("chat_log", []);
        renderHistory();
    };

    const toggle = document.createElement('div');
    toggle.id = 'n1ko-toggle'; toggle.innerText = 'N1';
    document.body.appendChild(toggle);
    toggle.onclick = () => { ui.style.display = ui.style.display === 'none' ? 'flex' : 'none'; };
    document.getElementById('n1ko-close').onclick = () => { ui.style.display = 'none'; };

})();