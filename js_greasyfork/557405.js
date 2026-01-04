// ==UserScript==
// @name         Torn Forum TLDR (Groq Version) – Free Summaries
// @namespace    yoyoyossarian
// @version      2.2-groq
// @description  TLDR button + free Groq API integration + summary box + custom API modal
// @match        https://www.torn.com/forums.php*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557405/Torn%20Forum%20TLDR%20%28Groq%20Version%29%20%E2%80%93%20Free%20Summaries.user.js
// @updateURL https://update.greasyfork.org/scripts/557405/Torn%20Forum%20TLDR%20%28Groq%20Version%29%20%E2%80%93%20Free%20Summaries.meta.js
// ==/UserScript==

(function () {

    // ------------------------------------------------------
    // Inject button + summary CSS
    // ------------------------------------------------------
    const style = document.createElement('style');
    style.textContent = `
        .tldr-btn {
            display: inline-block !important;
            padding: 2px 6px !important;
            margin: 0 4px !important;
            font-size: 11px !important;
            font-weight: bold !important;
            font-family: Arial, sans-serif !important;
            color: #ddd !important;
            background: #2a2a2a !important;
            border: 1px solid #444 !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            white-space: nowrap !important;
        }
        .tldr-btn:hover {
            background: #3b3b3b !important;
        }
        .tldr-li {
            display: inline-flex !important;
            flex: 0 0 auto !important;
        }
        .tldr-summary-box {
            opacity: 0;
            transition: opacity 0.25s ease;
        }
        .tldr-visible {
            opacity: 1 !important;
        }
    `;
    document.head.appendChild(style);

    // ------------------------------------------------------
    // MutationObserver for threaded forum comments
    // ------------------------------------------------------
    const observer = new MutationObserver(addButtons);
    observer.observe(document.body, { childList: true, subtree: true });
    addButtons();


    // ------------------------------------------------------
    // Add TLDR buttons
    // ------------------------------------------------------
    function addButtons() {
        document.querySelectorAll("ul.action-wrap").forEach(action => {

            if (action.dataset.tldrInit === "1") return;

            const rightPart = action.querySelector(".right-part");
            if (!rightPart) return;

            action.dataset.tldrInit = "1";

            const li = document.createElement("li");
            li.className = "tldr-li";
            li.innerHTML = `<span class="tldr-btn">TLDR</span>`;
            action.insertBefore(li, rightPart);

            li.addEventListener("click", async (e) => {

                // SHIFT = clear key
                if (e.shiftKey) {
                    localStorage.removeItem("tornTLDR_apiKey_groq");
                    alert("Groq API key reset.");
                    return;
                }

                const post = findPost(action);
                if (!post) return alert("Unable to locate post container.");

                const content = extractPost(post);
                if (!content) return alert("No post content found.");

                const apiKey = await getGroqKey();
                if (!apiKey) return;

                showSummary(post, "Summarizing…");

                try {
                    const summary = await groqSummary(content, apiKey);
                    showSummary(post, summary);
                    GM_setClipboard(summary);
                } catch (err) {
                    showSummary(post, "❌ Groq API Error:\n" + err);
                }
            });

            // Mobile long-press reset
            let pressTimer;
            li.addEventListener("touchstart", () => {
                pressTimer = setTimeout(() => {
                    localStorage.removeItem("tornTLDR_apiKey_groq");
                    alert("Groq API key reset.");
                }, 700);
            });
            li.addEventListener("touchend", () => clearTimeout(pressTimer));
            li.addEventListener("touchmove", () => clearTimeout(pressTimer));

            // Desktop right-click reset
            li.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                localStorage.removeItem("tornTLDR_apiKey_groq");
                alert("Groq API key reset.");
            });
        });
    }


    // ------------------------------------------------------
    // CLICKABLE LINK MODAL FOR API KEY
    // ------------------------------------------------------
    function showGroqKeyModal() {
        return new Promise((resolve) => {

            const old = document.getElementById("tldr-groq-modal");
            if (old) old.remove();

            const overlay = document.createElement("div");
            overlay.id = "tldr-groq-modal";
            overlay.style.position = "fixed";
            overlay.style.top = 0;
            overlay.style.left = 0;
            overlay.style.width = "100vw";
            overlay.style.height = "100vh";
            overlay.style.background = "rgba(0,0,0,0.55)";
            overlay.style.zIndex = 999999;
            overlay.style.display = "flex";
            overlay.style.justifyContent = "center";
            overlay.style.alignItems = "center";

            const box = document.createElement("div");
            box.style.background = "#1b1b1b";
            box.style.padding = "20px";
            box.style.border = "1px solid #555";
            box.style.borderRadius = "8px";
            box.style.minWidth = "320px";
            box.style.maxWidth = "90vw";
            box.style.color = "#ddd";
            box.style.fontFamily = "Arial, sans-serif";
            box.style.boxShadow = "0 0 15px rgba(0,0,0,0.5)";

            box.innerHTML = `
                <div style="font-size:18px; font-weight:bold; margin-bottom:12px;">
                    Enter your Groq API Key
                </div>

                <div style="font-size:13px; line-height:1.4; margin-bottom:10px;">
                    • Keys begin with <b>gsk_</b><br>
                    • Free keys at:
                    <a href="https://console.groq.com/keys" target="_blank" style="color:#6bb4ff;">
                        https://console.groq.com/keys
                    </a>
                </div>

                <input id="tldr-groq-input" type="text" placeholder="gsk_..."
                    style="width:100%; padding:8px; border-radius:4px; border:1px solid #444;
                           background:#2a2a2a; color:#eee; margin-bottom:14px; font-size:14px;">

                <div style="text-align:right;">
                    <button id="tldr-groq-ok" style="
                        padding:6px 12px; margin-right:6px; background:#444; border:1px solid #666;
                        color:#ddd; border-radius:4px; cursor:pointer;">OK</button>

                    <button id="tldr-groq-cancel" style="
                        padding:6px 12px; background:#333; border:1px solid #555;
                        color:#aaa; border-radius:4px; cursor:pointer;">Cancel</button>
                </div>
            `;

            overlay.appendChild(box);
            document.body.appendChild(overlay);

            setTimeout(() => {
                const inp = document.getElementById("tldr-groq-input");
                if (inp) inp.focus();
            }, 50);

            document.getElementById("tldr-groq-ok").onclick = () => {
                const val = document.getElementById("tldr-groq-input").value.trim();
                overlay.remove();
                resolve(val || null);
            };

            document.getElementById("tldr-groq-cancel").onclick = () => {
                overlay.remove();
                resolve(null);
            };

            overlay.onclick = (e) => {
                if (e.target === overlay) {
                    overlay.remove();
                    resolve(null);
                }
            };
        });
    }


    // ------------------------------------------------------
    // Get or request Groq API key
    // ------------------------------------------------------
    async function getGroqKey() {
        let key = localStorage.getItem("tornTLDR_apiKey_groq");
        if (key) return key;

        key = await showGroqKeyModal();
        if (!key || !key.startsWith("gsk_")) {
            alert("Invalid Groq key.");
            return null;
        }

        localStorage.setItem("tornTLDR_apiKey_groq", key);
        return key;
    }


    // ------------------------------------------------------
    // Find post container
    // ------------------------------------------------------
    function findPost(action) {
        while (action && !action.classList.contains("post-wrap")) {
            action = action.parentElement;
        }
        return action;
    }

    function extractPost(post) {
        const body =
            post.querySelector(".post.unreset") ||
            post.querySelector(".editor-content") ||
            post.querySelector(".bbcode-content");
        return body ? body.innerText.trim() : "";
    }


    // ------------------------------------------------------
    // Summary box
    // ------------------------------------------------------
    function showSummary(post, text) {
        let box = post.querySelector(".tldr-summary-box");
        const isNew = !box;

        if (!box) {
            box = document.createElement("div");
            box.className = "tldr-summary-box";
            box.style.background = "#1f1f1f";
            box.style.color = "#e6e6e6";
            box.style.border = "1px solid #444";
            box.style.padding = "10px";
            box.style.margin = "10px 0";
            box.style.borderRadius = "6px";
            box.style.fontSize = "14px";
            box.style.lineHeight = "1.5";
            box.style.opacity = "0";
            box.style.whiteSpace = "pre-wrap";

            const firstContent = post.querySelector(".post.unreset, .editor-content, .bbcode-content");
            if (firstContent) post.insertBefore(box, firstContent);
            else post.prepend(box);
        }

        box.textContent = text;

        if (isNew) {
            requestAnimationFrame(() => {
                box.classList.add("tldr-visible");
            });
        }
    }


    // ------------------------------------------------------
    // Groq summary generator
    // ------------------------------------------------------
    async function groqSummary(text, apiKey) {

        const prompt =
`Summarize the following Torn forum post into EXACTLY three bullet points.

Rules:
- Sentences should be short and readable.
- One sentence per bullet.
- No extra text before or after the bullets.
- No commentary, tone, or sarcasm.
- Only compress the literal meaning.
- If the meaning is unclear, it is okay to call that out.
- No fabrication.
- Output ONLY three bullets.

Post:
${text}
`;

        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + apiKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.2,
                max_tokens: 300
            })
        });

        if (!res.ok) throw await res.text();
        const data = await res.json();
        return data.choices[0].message.content.trim();
    }

})();
