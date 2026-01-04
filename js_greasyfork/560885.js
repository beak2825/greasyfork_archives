// ==UserScript==
// @name           🎯 Heist Automator
// @namespace      http://tampermonkey.net/
// @version        3.0.0
// @description    Popmundo Heist: Auto-Continue with RECON TRACK inspired design
// @author         You
// @match          https://*.popmundo.com/*
// @match          http://*.popmundo.com/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/560885/%F0%9F%8E%AF%20Heist%20Automator.user.js
// @updateURL https://update.greasyfork.org/scripts/560885/%F0%9F%8E%AF%20Heist%20Automator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const HEIST_RUNNING_KEY = 'heistAutomatorRunning';
    const TIE_UP_COUNT_KEY = 'heistTieUpCount';
    const ACTION_DELAY_MS = 300;

    const STRATEGY = [
        { obstacle: "Security Guard", actionText: "Distract", type: "ACTION" },
        { obstacle: "Cleaning Lady", actionText: "Tie up", type: "ACTION" },
        { obstacle: "Drunk Groupie", actionText: "Sneak", type: "ACTION" },
        { obstacle: "Grumpy Janitor", actionText: "Distract", type: "ACTION" },
        { obstacle: "Studio Manager", actionText: "Fight", type: "ACTION" },
        { obstacle: "Pizza Delivery Boy", actionText: "Bribe", type: "ACTION" },
        { obstacle: "Studio Musician", actionText: "Tie up", type: "ACTION" },
        { obstacle: "Financial Manager", actionText: "Tie up", type: "ACTION" },
        { obstacle: "Feisty Virtuoso", actionText: "Distract", type: "ACTION" },

        { obstacle: "Angry Rottweiler", actionText: "Tie up", type: "ACTION" },
        { obstacle: "Guard Dog", actionText: "Feed", type: "ACTION" },
        { obstacle: "Feisty Chihuahua", actionText: "Feed", type: "ACTION" },

        { obstacle: "Security Camera", actionText: "Hack", type: "ACTION" },
        { obstacle: "Infrared Motion Sensor", actionText: "Sneak", type: "ACTION" },

        { obstacle: "Wooden Door", actionText: "Pick lock", type: "ACTION" },
        { obstacle: "Double Locked Door", actionText: "Pick lock", type: "ACTION" },
        { obstacle: "Padlocked Security Door", actionText: "Pick lock", type: "ACTION" },
        { obstacle: "Door with Door Chain", actionText: "Remove door chain", type: "ACTION" },
        { obstacle: "Main Gate", actionText: "Open", type: "ACTION" },
        { obstacle: "Back Door", actionText: "Open", type: "ACTION" },
        { obstacle: "Casement Window", actionText: "Pry open", type: "ACTION" },
        { obstacle: "Locked Display Cabinet", actionText: "Pick lock", type: "ACTION" },

        { obstacle: "Angry Chef", actionText: "Tie up", type: "ACTION" },
        { obstacle: "Elevator Operator", actionText: "Bribe", type: "ACTION" },
        { obstacle: "Hotel Guest", actionText: "Sneak", type: "ACTION" },
        { obstacle: "Guest Safe Box", actionText: "Crack", type: "ACTION" },
        { obstacle: "Bellboy", actionText: "Sneak", type: "ACTION" },
        { obstacle: "Hotel Owner", actionText: "Distract", type: "ACTION" },
        { obstacle: "Chambermaid", actionText: "Tie up", type: "ACTION" },
        { obstacle: "Disgruntled Guest", actionText: "Sneak", type: "ACTION" },
        { obstacle: "Hotel Concierge", actionText: "Bribe", type: "ACTION" },
        { obstacle: "Off Duty Police Officer", actionText: "Bribe", type: "ACTION" },
        { obstacle: "Cash Register", actionText: "Empty", type: "ACTION" },

        { obstacle: "Exit Door", actionText: "Leave through", type: "ACTION" }
    ];

    let tieUpCount = 0;

    function ensureStyle() {
        if (document.querySelector("#heist-style")) return;
        const style = document.createElement("style");
        style.id = "heist-style";
        style.textContent = `
            .heist-badge-container {
                position: fixed;
                top: 20px;
                right: 20px;
                display: flex;
                flex-direction: column;
                gap: 8px;
                z-index: 99999;
            }
            .heist-badge {
                background: #222;
                color: #fff;
                font-family: 'Segoe UI', sans-serif;
                font-size: 13px;
                padding: 6px 10px;
                border-radius: 20px;
                display: flex;
                align-items: center;
                gap: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                opacity: 0.95;
                cursor: pointer;
                transition: transform 0.15s ease, opacity 0.2s ease;
            }
            .heist-badge:hover {
                opacity: 1;
                transform: scale(1.02);
            }
            .heist-badge:active {
                transform: scale(0.98);
            }
            .heist-icon {
                font-weight: bold;
                color: #fff;
            }
            .heist-status {
                font-weight: bold;
                padding: 2px 8px;
                border-radius: 12px;
                background: #d934cb;
                color: #fff;
            }
            .heist-status.idle { background: #d934cb; }
            .heist-status.running { background: #1ab17b; }
        `;
        document.head.appendChild(style);
    }

    function updateButton(status, tieUpCount = 0) {
        let container = document.querySelector(".heist-badge-container");
        if (container) container.remove();

        container = document.createElement("div");
        container.className = "heist-badge-container";

        const badge = document.createElement("div");
        badge.className = "heist-badge";
        badge.id = "heist-fire-button";

        if (status === "running") {
            badge.innerHTML = `
                <span class="heist-icon">🗄️</span>
                <span class="heist-icon">HEIST</span>
                <span class="heist-status running">Tie Up: ${tieUpCount}/2</span>
            `;
        } else {
            badge.innerHTML = `
                <span class="heist-icon">🗄️</span>
                <span class="heist-icon">HEIST</span>
                <span class="heist-status idle">START</span>
            `;
        }

        badge.onclick = () => executeHeistAction(false);
        container.appendChild(badge);
        document.body.appendChild(container);
    }

    function executeHeistAction(isAutoRun = false) {
        if (isAutoRun) {
            const storedCount = localStorage.getItem(TIE_UP_COUNT_KEY);
            tieUpCount = storedCount ? parseInt(storedCount, 10) : 0;
        } else {
            localStorage.setItem(HEIST_RUNNING_KEY, 'true');
            localStorage.setItem(TIE_UP_COUNT_KEY, '0');
            tieUpCount = 0;
        }

        updateButton("running", tieUpCount);

        const barriers = document.querySelectorAll('div[id$="divBarrier"]');

        for (let i = 0; i < barriers.length; i++) {
            const barrier = barriers[i];
            const barrierText = (barrier.innerText || barrier.textContent).trim();
            const target = STRATEGY.find(t => barrierText.includes(t.obstacle));

            if (target && target.type === "ACTION") {
                let currentActionText = target.actionText;

                const selectDropdown = barrier.querySelector('select');
                const goButton = barrier.querySelector('input[type="submit"]');

                if (selectDropdown && goButton) {
                    let desiredValue = null;
                    const actionTextLower = currentActionText.toLowerCase();

                    for (let j = 0; j < selectDropdown.options.length; j++) {
                        if (selectDropdown.options[j].text.toLowerCase().includes(actionTextLower)) {
                            desiredValue = selectDropdown.options[j].value;
                            break;
                        }
                    }

                    if (desiredValue) {
                        // If already 2 tie ups, override to Distract
                        if (actionTextLower.includes("tie up") && tieUpCount >= 2) {
                            const distractOption = [...selectDropdown.options]
                                .find(opt => opt.text.toLowerCase().includes("distract"));
                            if (distractOption) {
                                desiredValue = distractOption.value;
                            }
                        }

                        // Set the dropdown
                        selectDropdown.value = desiredValue;
                        selectDropdown.dispatchEvent(new Event('change', { bubbles: true }));

                        // Increment only when actually selecting "Tie up"
                        if (actionTextLower.includes("tie up") && tieUpCount < 2) {
                            tieUpCount++;
                            localStorage.setItem(TIE_UP_COUNT_KEY, tieUpCount.toString());
                            updateButton("running", tieUpCount);
                        }

                        // Trigger the action
                        setTimeout(() => {
                            goButton.click();
                        }, ACTION_DELAY_MS);

                        return true;
                    }
                }
            }
        }

        if (localStorage.getItem(HEIST_RUNNING_KEY) === 'true') {
            localStorage.removeItem(HEIST_RUNNING_KEY);
            localStorage.removeItem(TIE_UP_COUNT_KEY);
            updateButton("idle");
        }
    }

    function addButton() {
        ensureStyle();

        const isRunning = localStorage.getItem(HEIST_RUNNING_KEY) === 'true';

        if (isRunning) {
            const storedCount = localStorage.getItem(TIE_UP_COUNT_KEY);
            const currentTieUpCount = storedCount ? parseInt(storedCount, 10) : 0;
            updateButton("running", currentTieUpCount);
            executeHeistAction(true);
        } else {
            updateButton("idle");
        }
    }

    window.addEventListener('load', addButton);

})();