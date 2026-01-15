// ==UserScript==
// @name         AI Scan Overlay
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Scans page, sends text to Base44 AI, returns summary.
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562484/AI%20Scan%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/562484/AI%20Scan%20Overlay.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // -----------------------------
    // 🔑 API KEY (YOU FILL THIS IN)
    // -----------------------------
    const API_KEY = "'e7c073784a0c404c8b2aee5d8d70f102', // or use await User.me() to get the API key"; // <--- paste your Base44 API key here

    // -----------------------------
    // UI BUTTON
    // -----------------------------
    const btn = document.createElement('button');
    btn.textContent = 'AI Scan';
    Object.assign(btn.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: '999999',
        padding: '10px 16px',
        backgroundColor: '#22c55e',
        color: '#ffffff',
        border: 'none',
        borderRadius: '6px',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '14px',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
        opacity: '0.9',
        transition: 'opacity 0.2s, transform 0.1s'
    });

    btn.addEventListener('mouseenter', () => {
        btn.style.opacity = '1';
        btn.style.transform = 'translateY(-1px)';
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.opacity = '0.9';
        btn.style.transform = 'translateY(0)';
    });

    document.body.appendChild(btn);

    // -----------------------------
    // CLICK HANDLER
    // -----------------------------
    btn.addEventListener('click', async () => {
        if (!API_KEY) {
            alert("You must paste your Base44 API key into the script first.");
            return;
        }

        await runScanEffect();

        const text = extractVisibleText();
        const aiResponse = await askBase44(text);

        alert(aiResponse);
    });

    // -----------------------------
    // TEXT EXTRACTION
    // -----------------------------
    function extractVisibleText() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
            acceptNode: (node) => {
                if (!node.parentElement) return NodeFilter.FILTER_REJECT;
                const style = window.getComputedStyle(node.parentElement);
                if (style.visibility === 'hidden' || style.display === 'none') {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        });

        let text = "";
        let node;
        while ((node = walker.nextNode())) {
            const trimmed = node.textContent.trim();
            if (trimmed.length > 0) text += trimmed + " ";
        }

        return text.slice(0, 8000); // safety limit
    }

    // -----------------------------
    // BASE44 AI REQUEST
    // -----------------------------
    async function askBase44(text) {
        try {
            const response = await fetch("https://app.base44.com/api/apps/6965c217b671e534baa0fd20/entities/Conversation", {
                method: "POST",
                headers: {
                    "api_key": API_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: "AI Scan Summary",
                    messages: [
                        {
                            role: "user",
                            content: "Summarize this webpage text: " + text
                        }
                    ],
                    mode: "chat"
                })
            });

            const data = await response.json();

            // Base44 returns the AI response inside the entity
            const lastMessage = data?.messages?.[data.messages.length - 1]?.content;

            return lastMessage || "AI returned no message.";
        } catch (err) {
            return "AI request failed: " + err.message;
        }
    }

    // -----------------------------
    // SCAN ANIMATION
    // -----------------------------
    function runScanEffect() {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            Object.assign(overlay.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0,0,0,0.5)',
                zIndex: '999998',
                pointerEvents: 'none',
                overflow: 'hidden'
            });

            const line = document.createElement('div');
            Object.assign(line.style, {
                position: 'absolute',
                top: '-10%',
                left: '0',
                width: '100%',
                height: '4px',
                background: 'linear-gradient(to right, transparent, #22c55e, transparent)',
                boxShadow: '0 0 20px #22c55e',
                filter: 'blur(0.5px)'
            });

            overlay.appendChild(line);
            document.body.appendChild(overlay);

            const style = document.createElement('style');
            style.textContent = `
                @keyframes aiGreenScan {
                    0%   { top: -10%; opacity: 0; }
                    10%  { opacity: 1; }
                    90%  { opacity: 1; }
                    100% { top: 110%; opacity: 0; }
                }
            `;
            document.head.appendChild(style);

            line.style.animation = 'aiGreenScan 1.5s ease-in-out forwards';

            const grid = document.createElement('div');
            Object.assign(grid.style, {
                position: 'absolute',
                inset: '0',
                backgroundImage:
                    'linear-gradient(rgba(34,197,94,0.12) 1px, transparent 1px),' +
                    'linear-gradient(90deg, rgba(34,197,94,0.12) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                mixBlendMode: 'screen',
                opacity: '0',
                transition: 'opacity 0.2s'
            });
            overlay.appendChild(grid);

            setTimeout(() => { grid.style.opacity = '1'; }, 100);
            setTimeout(() => { grid.style.opacity = '0'; }, 1300);

            setTimeout(() => {
                overlay.remove();
                style.remove();
                resolve();
            }, 1600);
        });
    }

})();

