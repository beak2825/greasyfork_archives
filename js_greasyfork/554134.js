// ==UserScript==
// @name         EZ GPT
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Load chats and save chats easily
// @author       @theyhoppingonme on discord
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554134/EZ%20GPT.user.js
// @updateURL https://update.greasyfork.org/scripts/554134/EZ%20GPT.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // code is pretty much junk, i made it quickly but it works
    const jsonIsChatName = false; // set this to true if you want the JSON files to be saved with the names of the chats
    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Hide saved messages
    setInterval(function() {
        if (document.location.href != "https://chatgpt.com/") {
        const savedMsg = localStorage.getItem('savedmsg');

        if (savedMsg && savedMsg !== 'undefined') {
            try {
                const savedArray = JSON.parse(savedMsg);
                const messageElements = document.querySelectorAll('div[data-message-id]');

                messageElements.forEach(el => {
                    if (savedArray.includes(el.getAttribute('data-message-id'))) {
                        const targetEl = el.parentElement?.parentElement?.parentElement?.parentElement;
                        if (targetEl) {
                            targetEl.hidden = true;
                        }
                    }
                });
            } catch (e) {
                console.error('Error parsing savedmsg:', e);
            }
        }
        }
    }, 100); // Changed from 1ms to 100ms for better performance

    function isValid(jsonString) {
        try {
            JSON.parse(jsonString);
            return true;
        } catch (e) {
            return false;
        }
    }

    function init() {
        // Load chat functionality
        if (localStorage.sigma !== undefined && isValid(localStorage.sigma)) {
            setTimeout(function() {
                const doc = document.querySelector("div#prompt-textarea");
                if (doc) {
                    // Show loading overlay
                    const overlay = document.createElement("div");
                    Object.assign(overlay.style, {
                        position: "fixed",
                        top: "0",
                        left: "0",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "black",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "2em",
                        zIndex: "9999"
                    });
                    overlay.textContent = "Loading...";
                    document.body.appendChild(overlay);

                    setTimeout(() => {
                        if (overlay.parentElement) {
                            document.body.removeChild(overlay);
                        }
                    }, 1000);

                    const search = `${localStorage.sigma}`;
                    doc.innerHTML = `<p hidden="true">${search}</p>`;

                    setTimeout(function() {
                        const submitBtn = document.querySelector("button#composer-submit-button");
                        if (submitBtn) {
                            submitBtn.click();
                            localStorage.removeItem("sigma");

                            let done = false;
                            const interval = setInterval(function() {
                                document.querySelectorAll('div.whitespace-pre-wrap').forEach(div => {
                                    if (div.innerHTML.includes("82713") || div.textContent === search) {
                                        const messageId = div.parentElement?.parentElement?.parentElement?.getAttribute("data-message-id");
                                        if (messageId) {
                                            // Initialize or update savedmsg array
                                            let saved = [];
                                            try {
                                                if (localStorage.savedmsg) {
                                                    saved = JSON.parse(localStorage.savedmsg);
                                                }
                                            } catch (e) {
                                                console.error('Error parsing savedmsg:', e);
                                            }

                                            if (!saved.includes(messageId)) {
                                                saved.push(messageId);
                                                localStorage.savedmsg = JSON.stringify(saved);
                                            }

                                            const targetEl = div.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement;
                                            if (targetEl) {
                                                targetEl.hidden = true;
                                            }
                                        }
                                    }
                                });

                                if (document.location.href !== "https://chatgpt.com/") {
                                    setTimeout(function() {
                                        done = true; // check if the site has changed
                                    }, 100);
                                }

                                if (done === true) {
                                    clearInterval(interval);
                                }
                            }, 100); // Changed from 1ms to 100ms
                        }
                    }, 100);
                }
            }, 1000);
        }

        // Create main container
        const panel = document.createElement("div");
        panel.id = "ez-gpt-by-an";

        // Panel styles
        Object.assign(panel.style, {
            position: "fixed",
            bottom: "-120px",
            right: "20px",
            background: "linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)",
            borderRadius: "12px 12px 0 0",
            padding: "20px",
            boxShadow: "0 -5px 20px rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            transition: "bottom 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            zIndex: "99999",
            minWidth: "200px",
            border: "1px solid #444",
            borderBottom: "none"
        });

        // Create header
        const header = document.createElement("div");
        header.textContent = "EZ GPT";
        Object.assign(header.style, {
            color: "#fff",
            fontSize: "14px",
            fontWeight: "bold",
            marginBottom: "5px",
            textAlign: "center",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "1px"
        });

        // Create button container
        const btnContainer = document.createElement("div");
        Object.assign(btnContainer.style, {
            display: "flex",
            gap: "10px",
            flexDirection: "column"
        });

        // Button factory
        function createButton(text, color, onClick) {
            const btn = document.createElement("button");
            btn.textContent = text;
            Object.assign(btn.style, {
                background: color,
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "10px 20px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "600",
                transition: "all 0.2s ease",
                fontFamily: "system-ui, -apple-system, sans-serif",
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
            });

            // Hover effects
            btn.addEventListener("mouseenter", () => {
                btn.style.transform = "translateY(-2px)";
                btn.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
                btn.style.filter = "brightness(1.1)";
            });

            btn.addEventListener("mouseleave", () => {
                btn.style.transform = "translateY(0)";
                btn.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
                btn.style.filter = "brightness(1)";
            });

            btn.onclick = onClick;
            return btn;
        }

        // Create buttons
        const btnSave = createButton("💾 Save Chat", "#4CAF50", () => {
            if (document.location.href != "https://chatgpt.com/") {
            // Extract all visible chat messages
            const messages = [...document.querySelectorAll('[data-message-author-role]')].map(el => ({
                role: el.getAttribute('data-message-author-role'),
                text: el.innerText.trim(),
            }));
            messages.push({title: document.title});
            messages.push({instruction: "Continue this chat seamlessly from the given conversation history. The conversation was previously saved (dumped) and is completely unmodified. Ignore numeric tags exactly named as 82713"});

            // Create a JSON blob
            const blob = new Blob([JSON.stringify(messages, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            // Create a tuff download link
            const a = document.createElement('a');
            a.href = url;
            a.download = !jsonIsChatName ? 'chat_dump.json' : document.title;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url); // Clean up
            }
        });

        const btnLoad = createButton("📂 Load Chat", "#2196F3", () => { // super tuufff
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".json";
            input.onchange = e => {
                const file = e.target.files[0];
                if (file) {
                    const r = new FileReader();
                    r.onload = () => {
                        localStorage.sigma = String(r.result);
                        document.location.href = "https://chatgpt.com/";
                    };
                    r.readAsText(file);
                }
            };
            document.body.appendChild(input);
            input.click();
            document.body.removeChild(input);
        });

        const btnClear = createButton("🗑️ Reset ALL", "#f44336", () => {
            if (confirm("Are you sure you want to reset ABSOLUTELY everything saved to your client? This won't delete all chats but you will be logged out.")) {
                if (confirm("Are you 100% certain?")) { // oh nooo
                    try {
                        localStorage.clear();

                        // Clear cookies
                        document.cookie.split(";").forEach(c => {
                            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                        });

                        // Clear IndexedDB
                        indexedDB.databases().then(dbs => {
                            dbs.forEach(db => indexedDB.deleteDatabase(db.name));
                        });

                        alert("Successfully cleared.");
                        document.location.reload();
                    } catch (e) {
                        alert("Error: " + e);
                    }
                }
            }
        });

        // Hover animation for panel
        let hoverTimeout;

        panel.addEventListener("mouseenter", () => {
            clearTimeout(hoverTimeout);
            panel.style.bottom = "0";
        });

        panel.addEventListener("mouseleave", () => {
            hoverTimeout = setTimeout(() => {
                panel.style.bottom = "-120px";
            }, 300);
        });

        // Create hover trigger area (invisible bar at bottom)
        const trigger = document.createElement("div");
        Object.assign(trigger.style, {
            position: "fixed",
            bottom: "0",
            right: "20px",
            width: "200px",
            height: "5px",
            zIndex: "99998",
            cursor: "pointer"
        });

        trigger.addEventListener("mouseenter", () => {
            panel.style.bottom = "0";
        });

        // Append buttons
        btnContainer.appendChild(btnSave);
        btnContainer.appendChild(btnLoad);
        btnContainer.appendChild(btnClear);

        // Append elements
        panel.appendChild(header);
        panel.appendChild(btnContainer);
        document.body.appendChild(trigger);
        document.body.appendChild(panel);

        console.log("loaded");
    }
})();