// ==UserScript==
// @name         多平台问卷AI自动填写，问卷星、腾讯问卷、飞书通用
// @name:en-US   Multi-Platform Questionnaire AI Auto-Filler
// @namespace    https://github.com/kelryry
// @version      1.1
// @description  Extracts DOM structure, sends it to Gemini AI for semantic analysis, and simulates human input to fill forms. Supports custom user profiles and works on modern frameworks (React/Vue).
// @description:zh-CN 提取页面DOM结构，发送给Gemini AI进行语义分析，并模拟人类输入进行填表。支持自定义用户画像，兼容现代前端框架（React/Vue）。
// @author       kelryry
// @license      GPL-3.0-only
// @homepageURL  https://github.com/kelryry/questionnaire-auto-filling
// @match        https://example.com/replace-this-with-your-target-url/*
// @match        https://docs.qq.com/form/*
// @match        https://*.wjx.cn/*
// @match        https://*.wjx.top/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      generativelanguage.googleapis.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557963/%E5%A4%9A%E5%B9%B3%E5%8F%B0%E9%97%AE%E5%8D%B7AI%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%EF%BC%8C%E9%97%AE%E5%8D%B7%E6%98%9F%E3%80%81%E8%85%BE%E8%AE%AF%E9%97%AE%E5%8D%B7%E3%80%81%E9%A3%9E%E4%B9%A6%E9%80%9A%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/557963/%E5%A4%9A%E5%B9%B3%E5%8F%B0%E9%97%AE%E5%8D%B7AI%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%EF%BC%8C%E9%97%AE%E5%8D%B7%E6%98%9F%E3%80%81%E8%85%BE%E8%AE%AF%E9%97%AE%E5%8D%B7%E3%80%81%E9%A3%9E%E4%B9%A6%E9%80%9A%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =========================================================================
    // [USER CONFIGURATION] - MUST BE CONFIGURED BEFORE USE
    // =========================================================================
    const CONFIG = {
        // 1. Google Gemini API Key (Required)
        // Get yours at: https://aistudio.google.com/
        apiKey: "YOUR_GEMINI_API_KEY_HERE",

        // 2. Model Selection
        // Recommended: "gemini-2.5-flash-lite" for speed, "gemini-2.5-flash" for balance.
        modelName: "gemini-2.5-flash-lite",

        // 3. Thinking Budget
        // Set to 0 for maximum speed (Flash/Lite).
        // For "Pro" models, you can set a budget (e.g., 1024) if reasoning is needed.
        thinkingBudget: 0,

        // 4. Auto Submit Configuration
        // autoSubmit: If true, clicks the submit button automatically.
        // submitDelay: Delay in milliseconds before clicking submit.
        autoSubmit: false,
        submitDelay: 1000,

        // 5. Scheduled Execution
        // targetTime: Format "YYYY-MM-DD HH:MM:SS". If in the past, runs immediately.
        // preLoadOffset: Milliseconds to start scanning before the target time (counteract network latency).
        targetTime: "2025-12-03 15:00:00",
        preLoadOffset: 500,

        // 6. User Profile
        // The AI will use this information to answer questions.
        userProfile: `
            Name: John Doe
            Phone: 13800138000
            ID Card: 110101199001011234
            Email: test@example.com
            Address: Chaoyang District, Beijing
            Education: Bachelor
            Occupation: Developer
            Note: None
            Agree to Terms: Yes/Agree
        `,

        // 7. Debug Mode
        // If true, prints the HTML payload and AI plan to the console.
        debug: true
    };

    // =========================================================================
    // [UI & STATUS MANAGEMENT]
    // =========================================================================
    let statusDiv = null;
    let elementMap = new Map();

    // Initialize the floating status bar
    function initUI() {
        if (statusDiv) return;
        statusDiv = document.createElement('div');
        statusDiv.style.cssText = `
            position: fixed; top: 10px; right: 10px; z-index: 2147483647;
            background: rgba(0,0,0,0.8); color: #00ff00; padding: 8px 12px;
            border-radius: 4px; font-family: sans-serif; font-size: 12px;
            pointer-events: none; user-select: none; transition: all 0.2s;
        `;
        statusDiv.innerText = '🤖 Gemini: Standby';
        document.body.appendChild(statusDiv);
    }

    // Update status text and color
    function updateStatus(text, color = '#00ff00') {
        if (!statusDiv) initUI();
        statusDiv.style.color = color;
        statusDiv.innerText = `🤖 ${text}`;
        console.log(`[Gemini] ${text}`);
    }

    // =========================================================================
    // [CORE UTILS: INPUT SIMULATION]
    // Handles React/Vue/Angular state hijacking issues
    // =========================================================================

    function simulateInput(element, value) {
        if (!element) return;
        element.focus();

        const tag = element.tagName.toLowerCase();
        let proto;

        // Determine the correct prototype to bypass framework proxies
        if (tag === 'textarea') {
            proto = window.HTMLTextAreaElement.prototype;
        } else if (tag === 'select') {
            proto = window.HTMLSelectElement.prototype;
        } else {
            proto = window.HTMLInputElement.prototype;
        }

        // Try to call the native value setter
        try {
            const nativeSetter = Object.getOwnPropertyDescriptor(proto, "value").set;
            if (nativeSetter) {
                nativeSetter.call(element, value);
            } else {
                element.value = value; // Fallback
            }
        } catch (e) {
            console.warn(`Native setter failed for ${tag}, fallback to direct assignment.`, e);
            element.value = value;
        }

        // Dispatch events to ensure the framework detects the change
        const eventTypes = ['input', 'change', 'blur', 'focusout'];
        eventTypes.forEach(type => {
            element.dispatchEvent(new Event(type, { bubbles: true }));
        });
    }

    function simulateClick(element) {
        if (!element) return;
        try {
            // Scroll to view to ensure visibility
            element.scrollIntoView({ behavior: 'auto', block: 'center' });

            // Standard click
            element.click();

            // Additional events for stubborn elements
            element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        } catch (e) {
            console.error("Click failed", e);
        }
    }

    // =========================================================================
    // [DOM EXTRACTION]
    // Converts HTML to a simplified format for the LLM to save tokens
    // =========================================================================

    function isInteractive(el) {
        const tag = el.tagName.toLowerCase();
        if (['input', 'textarea', 'select', 'button'].includes(tag)) return true;

        // Detect custom styled radio/checkboxes (divs acting as buttons)
        const style = window.getComputedStyle(el);
        return style.cursor === 'pointer';

    }

    function generateSimplifiedDOM(root) {
        elementMap.clear();
        let idCounter = 0;
        let output = [];

        function traverse(node, depth) {
            // Skip invisible elements or non-element nodes
            if (!node || node.nodeType !== 1 ||
                node.offsetWidth <= 0 && node.offsetHeight <= 0 && node.tagName !== 'OPTION') {
                return;
            }

            const tag = node.tagName.toLowerCase();
            // Skip irrelevant tags
            if (['script', 'style', 'svg', 'path', 'noscript', 'meta', 'link'].includes(tag)) return;

            // Extract direct text content
            let directText = "";
            node.childNodes.forEach(child => {
                if (child.nodeType === 3) directText += child.textContent.trim() + " ";
            });
            directText = directText.trim();

            const placeholder = node.getAttribute('placeholder');
            const ariaLabel = node.getAttribute('aria-label');
            const type = node.getAttribute('type');

            const interactive = isInteractive(node);

            // Record the node if it's interactive, has text, or is a label
            if (interactive || directText || placeholder || ariaLabel || tag === 'label') {
                const myId = `el_${idCounter++}`;
                elementMap.set(myId, node);

                const indent = "  ".repeat(depth);
                let line = `${indent}<${tag}`;

                // Assign ID only to interactive elements for the AI to reference
                if (interactive) line += ` _ai_id="${myId}"`;

                if (type) line += ` type="${type}"`;
                if (placeholder) line += ` placeholder="${placeholder}"`;
                if (ariaLabel) line += ` label="${ariaLabel}"`;

                line += ">";
                if (directText) line += ` ${directText}`;

                // Indicate state for checkboxes/radios
                if (tag === 'input' && (type === 'radio' || type === 'checkbox')) {
                    line += node.checked ? " [CHECKED]" : "";
                }

                output.push(line);
            }

            Array.from(node.children).forEach(child => traverse(child, depth + 1));
        }

        traverse(root, 0);
        return output.join("\n");
    }

    // =========================================================================
    // [GEMINI AGENT LOGIC]
    // =========================================================================

    async function runAgent() {
        updateStatus("Scanning Page...", "yellow");

        // 1. Snapshot DOM
        const simplifiedHTML = generateSimplifiedDOM(document.body);

        if(CONFIG.debug) {
            console.log("--- Payload Sent to Gemini ---");
            console.log(simplifiedHTML);
        }

        // 2. Construct System Prompt
        const prompt = `
        You are an auto-filling agent.
        Your goal: Fill the form based on User Profile.

        User Profile:
        ${CONFIG.userProfile}

        Simplified HTML Structure:
        ${simplifiedHTML}

        Instructions:
        1. Analyze the structure to link Labels with Inputs (based on indentation/hierarchy).
        2. Output a JSON plan.
        3. Use "fill" for inputs/textareas/selects.
        4. Use "click" for radio options, checkboxes, and buttons.
        5. IMPORTANT: For "fill", output the string value.
        6. IMPORTANT: For "click", choose the element that looks like the option text (e.g. the div containing "Male").
        
        Response JSON Schema (Array of objects):
        [
          {"id": "el_xxx", "action": "fill", "value": "my value"},
          {"id": "el_yyy", "action": "click", "reason": "Select Gender"}
        ]
        `;

        updateStatus("Gemini Thinking...", "#00ffff");

        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.modelName}:generateContent?key=${CONFIG.apiKey}`;

            // Construct API Payload
            const payload = {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    // Only apply thinkingConfig for non-lite models with budget > 0
                    thinkingConfig: CONFIG.modelName.includes('2.5') && !CONFIG.modelName.includes('lite') && CONFIG.thinkingBudget > 0
                        ? { thinkingBudget: CONFIG.thinkingBudget } : undefined
                }
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.message);
            }

            const planText = data.candidates[0].content.parts[0].text;
            const plan = JSON.parse(planText);

            console.log("Gemini Plan:", plan);
            await executePlan(plan);

        } catch (e) {
            console.error(e);
            updateStatus(`Error: ${e.message}`, "red");
        }
    }

    async function executePlan(plan) {
        updateStatus(`Executing ${plan.length} actions...`, "#00ff00");

        let submitBtn = null;

        for (const step of plan) {
            const el = elementMap.get(step.id);
            if (!el) continue;

            // Identify submit buttons but do not click immediately
            const text = (el.innerText || el.value || "").toLowerCase();
            if (step.action === 'click' && (text.includes('提交') || text.includes('submit') || text.includes('下一步'))) {
                submitBtn = el;
                continue;
            }

            if (step.action === 'fill') {
                simulateInput(el, step.value);
            } else if (step.action === 'click') {
                simulateClick(el);
            }

            // Small delay to prevent freezing the UI
            await new Promise(r => setTimeout(r, 20));
        }

        finalize(submitBtn);
    }

    function finalize(submitBtn) {
        // Validation: Highlight missing required fields
        const inputs = document.querySelectorAll('input[required], textarea[required]');
        let missing = false;
        inputs.forEach(el => {
            if (!el.value) {
                el.style.boxShadow = "0 0 10px red";
                el.style.border = "2px solid red";
                missing = true;
            }
        });

        if (missing) {
            updateStatus("Found missing fields!", "red");
            return;
        }

        if (submitBtn) {
            if (CONFIG.autoSubmit) {
                updateStatus(`Submitting in ${CONFIG.submitDelay}ms...`, "orange");
                setTimeout(() => submitBtn.click(), CONFIG.submitDelay);
            } else {
                // Highlight submit button for manual confirmation
                submitBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                submitBtn.style.border = "4px solid #00ff00";
                updateStatus("Ready to Submit", "white");
            }
        } else {
            updateStatus("Finished (No submit btn)", "white");
        }
    }

    // =========================================================================
    // [ENTRY POINT]
    // =========================================================================

    function main() {
        initUI();

        // Pre-warm connection to Google API
        fetch(`https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.modelName}?key=${CONFIG.apiKey}`, {method: 'HEAD'}).catch(()=>{});

        const now = Date.now();
        const target = new Date(CONFIG.targetTime).getTime();

        if (target > now) {
            const waitTime = target - now - CONFIG.preLoadOffset;
            updateStatus(`Wait ${(waitTime/1000).toFixed(1)}s`, "white");

            // Countdown timer
            const timer = setInterval(() => {
                const n = Date.now();
                if (n >= target - CONFIG.preLoadOffset) {
                    clearInterval(timer);
                    runAgent();
                } else {
                    statusDiv.innerText = `🤖 Wait: ${((target - CONFIG.preLoadOffset - n)/1000).toFixed(1)}s`;
                }
            }, 100);
        } else {
            runAgent();
        }
    }

    // Register menu command
    GM_registerMenuCommand("🚀 Run Auto-Filler", main);
    window.addEventListener('load', main);

})();