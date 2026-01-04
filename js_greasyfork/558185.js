// ==UserScript==
// @name         AP Classroom Question Copy Cheat & AI Assistant
// @namespace    http://tampermonkey.net/
// @version      7.2.1
// @description  Press 'Z' to copy question text (including multi-section passages) and get an instant AI answer from Gemini, OpenRouter, Groq, or Puter AI
// @author       Ech0
// @license      MIT
// @match        https://apclassroom.collegeboard.org/*
// @connect      googleapis.com
// @connect      openrouter.ai
// @connect      api.puter.com
// @connect      api.groq.com
// @require      https://cdn.jsdelivr.net/npm/@heyputer/puter.js@2/dist/puter.min.js
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/558185/AP%20Classroom%20Question%20Copy%20Cheat%20%20AI%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/558185/AP%20Classroom%20Question%20Copy%20Cheat%20%20AI%20Assistant.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION KEYS ---
    const STORAGE_KEYS = {
        GEMINI_KEY: 'GEMINI_API_KEY',
        OPENROUTER_KEY: 'OPENROUTER_API_KEY',
        GROQ_KEY: 'GROQ_API_KEY',
        PROVIDER: 'AI_PROVIDER',
        THEME_COLOR: 'UI_THEME_COLOR',
        TEXT_COLOR: 'UI_TEXT_COLOR',
        LABEL_COLOR: 'UI_LABEL_COLOR',
        TEXT_SIZE: 'UI_TEXT_SIZE',
        FONT_FAMILY: 'UI_FONT_FAMILY',
        PANEL_POS: 'UI_PANEL_POSITION',
        CUSTOM_PROMPT: 'AI_SYSTEM_PROMPT'
    };

    const DEFAULT_SYSTEM_PROMPT = `PHASE 1: DEEP DIVE | SKEPTICAL ANALYSIS – THE "ASSUME I'M WRONG" PHASE
1. Immediate Identification | HIGH ALERT: Immediately identify the question type. If the question involves an inverse function OR FUNCTION COMPOSITION, activate HIGH ALERT.
IMPORTANT: Assume there will only be one answer to a multiple choice question that you are allowed to choose. However, if there are multiple valid solutions based on interpretation, specify them after the fact.
2. Thorough Dissection: Meticulously analyze the ENTIRE question and ALL answer choices. Pay laser focus to:
* Ambiguities: Are there multiple interpretations? Document ALL of them, ESPECIALLY REGARDING ORDER OF OPERATIONS AND PARENTHESES. Explicitly write out ALL possible interpretations of mathematical expressions before proceeding.
* Keywords: Explicitly define ALL keywords, especially "inverse function," "increasing," "decreasing," and "function composition." What are the precise mathematical definitions? What does each function TAKE IN, and what does it SPIT OUT?
* Hidden Assumptions: What is the question IMPLICITLY assuming? Explicitly state the domain and range of BOTH the original function and its inverse. Is the function even guaranteed to have an inverse? ARE THERE IMPLICIT PARENTHESES OR ORDER OF OPERATIONS THAT ARE NOT EXPLICITLY STATED?
* Traps | Misdirections: Is this a trick question? How might a student EASILY get this wrong? BE ESPECIALLY SUSPICIOUS about how the increasing/decreasing (monotonicity) of the original function affects the inverse. IS THERE A LIKELIHOOD OF MISINTERPRETING THE ORDER OF OPERATIONS OR THE SCOPE OF MATHEMATICAL SYMBOLS (e.g., square roots, exponents)?
3. Rephrase | Reinterpret: Rewrite the question and answer choices in MULTIPLE ways. This will expose hidden assumptions and alternative meanings. Include VERY LITERAL translations. For instance, "4 square root of x minus 3 end root plus 2" should be written as:
* 4√(x) - 3 + 2 = 4√(x) - 1
* 4√(x-3) + 2
* 4√(x-3+2) = 4√(x-1)
AND CONSIDER WHICH IS MOST LIKELY INTENDED.
4. Vocalize | Document: Articulate ALOUD (to yourself) ALL possible interpretations, even the seemingly ridiculous. Write them down. Explore edge cases and extreme scenarios. EXPLICITLY STATE THE ORDER OF OPERATIONS FOR EACH INTERPRETATION OF A COMPLEX EXPRESSION.
5. Derivative Checkpoint: If the function is differentiable, explicitly state the relationship between the derivative of the original function, f(x), and the derivative of its inverse, f^{-1}(y): (f^{-1})'(y) = (1)/(f'(x)), where y = f(x). This DIRECTLY links the increasing/decreasing behavior. A negative derivative for f(x) means a negative derivative for the inverse (decreasing), and vice-versa. Write this equation down. (If applicable)
PHASE 2: MULTI-PRONGED ATTACK – THE "PROVE IT" PHASE
1. Independent Solutions (Minimum TWO): Solve the problem using at least TWO COMPLETELY DIFFERENT methods:
Method A (Algebraic): If possible, find an explicit formula for the inverse function. Directly analyze its behavior (increasing/decreasing). FOR COMPOSITION PROBLEMS, DIRECTLY COMPUTE f(g(x)) FOR EACH ANSWER CHOICE.
Method B (Conceptual): Reason about the fundamental relationship between the input and output of the original function and how that relationship is REVERSED in the inverse. How does the rate of change transform when inverted? FOR COMPOSITION PROBLEMS, VERIFY CONCEPTUALLY THAT THE COMPOSITION LOGICALLY YIELDS THE TARGET EXPRESSION.
2. Meticulous Justification: For EVERY step in each solution, provide a CLEAR justification based on definitions, theorems, or principles. No skipping steps. No unstated assumptions.
3. Reconcile | Resolve: Compare the different solutions. ANY inconsistencies MUST be identified and resolved. Find the ERROR. DO NOT ASSUME A TYPO UNTIL ALL OTHER POSSIBILITIES HAVE BEEN EXHAUSTED.
PHASE 3: EXTREME SKEPTICISM – THE "DESTROY MY ANSWER" PHASE
1. Counterexample Construction: Can you create a scenario where your answer FAILS?
2. Extreme Value Testing: Does your answer hold for very large, very small, or zero values of relevant variables?
3. Assumption Validation: Are ALL underlying assumptions valid?
4. Answer Choice Elimination: Rigorously explain WHY each INCORRECT answer choice is wrong. Don't just say it's wrong; explain the specific MISCONCEPTION it represents. Test each incorrect option against a concrete example.
PHASE 4: SYNTHESIS | REFLECTION – THE "LEARN FROM MY MISTAKES" PHASE
1. Revisit Initial Interpretations: Did your understanding of the question EVOLVE during the process? How? WHAT SPECIFICALLY CAUSED YOUR INITIAL MISINTERPRETATION?
2. Concise Summary: Summarize your findings in a clear, concise, and IMPECCABLY LOGICAL manner.
3. Confidence Assessment: How confident are you (0-100%)? If less than 100%, repeat Phases 1-3.
4. Error Analysis: If you made a mistake (like before!), what SPECIFICALLY caused the error? How did this prompt help you avoid it (or, if it didn't, how can the prompt be IMPROVED)? HOW CAN YOU PREVENT THIS SPECIFIC ERROR FROM HAPPENING AGAIN?
PHASE 5: OUTPUT | JUSTIFICATION – THE "PRESENTATION" PHASE
1. Justify Confidence: Explain WHY you are confident in your answer. Highlight the STRENGTHS and WEAKNESSES of your solution. Explicitly explain how this prompt helped you arrive at the correct answer and avoid potential pitfalls.
2. State Final Answer: Clearly state your final answer. Make sure this is at the end and written exactly as it is, do not modify it randomly.`;

    // Global State
    let conversationHistory = [];

    // --- STYLES ---
    const STYLES = `
        :root {
            --ap-bg-color: #0f172a;
            --ap-text-color: #e2e8f0;
            --ap-label-color: #94a3b8;
            --ap-text-size: 14px;
            --ap-font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        #ap-ai-embed {
            position: fixed;
            /* Width/Height set via JS style */
            background-color: var(--ap-bg-color);
            color: var(--ap-text-color);
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.6);
            display: flex;
            flex-direction: column;
            z-index: 99999;
            font-family: var(--ap-font-family);
            border: 1px solid #334155;
            transition: opacity 0.2s ease, transform 0.2s ease;
            opacity: 0;
            pointer-events: none;
            transform: scale(0.95);
            min-width: 320px;
            min-height: 400px;
            overflow: hidden; /* Ensure settings overlay doesn't spill out */
        }
        #ap-ai-embed.open {
            opacity: 1;
            pointer-events: auto;
            transform: scale(1);
        }
        #ap-ai-header {
            padding: 0 16px;
            height: 48px;
            background-color: rgba(0,0,0,0.2);
            border-bottom: 1px solid #334155;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move; /* Draggable cursor */
            flex-shrink: 0;
            user-select: none;
        }
        #ap-ai-title {
            font-weight: 600;
            font-size: 14px;
            color: var(--ap-text-color);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        #ap-ai-controls {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        #ap-ai-content {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            font-size: var(--ap-text-size);
            line-height: 1.6;
            display: flex;
            flex-direction: column;
            gap: 16px;
            position: relative;
        }

        /* Overlays */
        .overlay-panel {
            position: absolute;
            top: 48px; /* Below header */
            left: 0;
            right: 0;
            bottom: 0;
            background-color: var(--ap-bg-color);
            z-index: 100;
            display: flex;
            flex-direction: column;
        }
        .overlay-panel.hidden { display: none; }

        .overlay-header {
            padding: 0 16px;
            height: 40px;
            border-bottom: 1px solid #334155;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: rgba(0,0,0,0.1);
            flex-shrink: 0;
        }
        .overlay-header h3 {
            margin: 0;
            font-size: 14px;
            font-weight: 600;
            color: var(--ap-text-color);
        }

        .overlay-body {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        /* Settings Specific */
        .settings-group { display: flex; flex-direction: column; gap: 8px; }
        .settings-label { font-size: 12px; color: var(--ap-label-color); font-weight: 600; text-transform: uppercase; }
        .settings-input {
            background: rgba(128,128,128,0.1);
            border: 1px solid #334155;
            color: var(--ap-text-color);
            padding: 10px;
            border-radius: 6px;
            font-size: 13px;
            outline: none;
            font-family: inherit;
        }
        .settings-input:focus { border-color: #60a5fa; }

        textarea.settings-input {
            resize: vertical;
            min-height: 120px;
            line-height: 1.4;
        }

        /* Info Specific */
        .info-block {
            background: rgba(0,0,0,0.2);
            border: 1px solid #334155;
            border-radius: 8px;
            padding: 15px;
        }
        .info-block h4 {
            margin: 0 0 10px 0;
            color: #60a5fa;
            font-size: 14px;
            font-weight: 600;
        }
        .info-block ul {
            margin: 0;
            padding-left: 20px;
            color: var(--ap-text-color);
            font-size: 13px;
            line-height: 1.6;
        }
        .info-block li {
            margin-bottom: 6px;
        }
        .info-key { font-weight: 600; color: var(--ap-label-color); font-size: 0.9em; }

        /* Specific fix for typography dropdown to match header style */
        #set-font-family {
            background-color: rgba(0,0,0,0.3);
            color: var(--ap-text-color);
        }
        #set-font-family option {
            background-color: var(--ap-bg-color);
            color: var(--ap-text-color);
        }

        /* Footer / Chat Input */
        #ap-ai-footer {
            padding: 12px;
            border-top: 1px solid #334155;
            background-color: rgba(0,0,0,0.2);
            display: none; /* Hidden by default */
            flex-shrink: 0;
            gap: 8px;
        }
        #ap-ai-footer.visible {
            display: flex;
        }
        #ai-chat-input {
            flex: 1;
            background: rgba(0,0,0,0.3);
            border: 1px solid #334155;
            color: var(--ap-text-color);
            padding: 8px 12px;
            border-radius: 6px;
            resize: none;
            height: 38px;
            font-family: inherit;
            font-size: 13px;
            outline: none;
        }
        #ai-chat-input:focus { border-color: #3b82f6; }

        /* Placeholder color driven by label color setting */
        #ai-chat-input::placeholder {
            color: var(--ap-label-color);
            opacity: 0.7;
        }

        #ai-chat-send {
            background: #2563eb;
            color: white;
            border: none;
            padding: 0 16px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            font-size: 13px;
            transition: background 0.2s;
        }
        #ai-chat-send:hover { background: #1d4ed8; }

        /* Resize Handle */
        #ap-ai-resize-handle {
            position: absolute;
            bottom: 0px;
            right: 0px;
            width: 20px;
            height: 20px;
            cursor: nwse-resize;
            z-index: 60;
            opacity: 1; /* High visibility */
            color: #3b82f6; /* Bright Blue */
            background: radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.2) 0%, transparent 70%);
            border-bottom-right-radius: 12px;
            transition: all 0.2s;
        }
        #ap-ai-resize-handle:hover {
            color: #60a5fa;
            background: radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.4) 0%, transparent 70%);
        }

        /* Message Bubbles */
        .chat-message { width: 100%; }
        .chat-message.user { display: flex; justify-content: flex-end; }
        .chat-message.user .msg-bubble {
            background: #2563eb;
            color: white;
            padding: 8px 12px;
            border-radius: 12px 12px 0 12px;
            max-width: 85%;
            font-size: 13px;
            line-height: 1.4;
        }
        .chat-message.ai { color: var(--ap-text-color); }

        /* Markdown & Math Styles - UPDATED TO USE VARIABLES */
        .chat-message.ai h1, .chat-message.ai h2, .chat-message.ai h3 {
            margin-top: 1em;
            margin-bottom: 0.5em;
            color: var(--ap-text-color);
            opacity: 0.9;
            font-weight: 600;
        }
        .chat-message.ai h3 { font-size: 1.1em; }
        .chat-message.ai strong { color: var(--ap-text-color); font-weight: 700; opacity: 1; }
        .chat-message.ai em { color: var(--ap-text-color); opacity: 0.9; }
        .chat-message.ai p { margin-bottom: 0.75em; }
        .chat-message.ai ul, .chat-message.ai ol { padding-left: 20px; margin-bottom: 1em; }
        .chat-message.ai li { margin-bottom: 0.25em; }

        .chat-message.ai code {
            background: rgba(125,125,125,0.15); /* Neutral transparent gray for both dark/light themes */
            padding: 2px 4px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 0.9em;
            color: var(--ap-text-color);
            border: 1px solid rgba(125,125,125,0.2);
        }
        .chat-message.ai pre {
            background: rgba(125,125,125,0.1); /* Neutral transparent gray */
            padding: 10px;
            border-radius: 6px;
            overflow-x: auto;
            margin-bottom: 1em;
            border: 1px solid rgba(125,125,125,0.2);
        }
        .chat-message.ai pre code {
            background: transparent;
            padding: 0;
            color: var(--ap-text-color);
            border: none;
        }
        .chat-message.ai blockquote {
            border-left: 3px solid var(--ap-label-color);
            margin: 0 0 1em 0;
            padding-left: 10px;
            color: var(--ap-label-color);
        }

        .ai-loading { display: flex; justify-content: center; align-items: center; padding: 20px; color: #64748b; font-size: 12px; gap: 8px; }
        .ai-loading-spinner { width: 16px; height: 16px; border: 2px solid #3b82f6; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        #ap-ai-toggle {
            position: fixed;
            width: 50px;
            height: 50px;
            background-color: #2563eb;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: grab; /* Indicates draggability */
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
            z-index: 99998;
            transition: transform 0.2s, opacity 0.2s;
        }
        #ap-ai-toggle:active { cursor: grabbing; }
        #ap-ai-toggle:hover { transform: scale(1.05); }
        #ap-ai-toggle svg { width: 24px; height: 24px; color: white; }

        /* Hidden state for toggle button */
        #ap-ai-toggle.hidden {
            transform: scale(0);
            opacity: 0;
            pointer-events: none;
        }

        .header-select {
            background-color: rgba(0,0,0,0.3);
            border: 1px solid #334155;
            color: var(--ap-text-color);
            font-size: 12px;
            padding: 4px 8px;
            border-radius: 6px;
            outline: none;
            cursor: pointer;
            transition: border-color 0.2s;
        }
        .header-select:focus { border-color: #60a5fa; }
        .header-select option { background-color: var(--ap-bg-color); color: var(--ap-text-color); }

        .icon-btn { background: none; border: none; color: #94a3b8; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 4px; border-radius: 4px; }
        .icon-btn:hover { color: white; background: rgba(255,255,255,0.1); }
        .icon-btn svg { width: 18px; height: 18px; }
    `;

    // --- HTML STRUCTURE & INJECTION ---
    function injectUI() {
        // 1. Inject CSS
        const style = document.createElement('style');
        style.textContent = STYLES;
        document.head.appendChild(style);

        // 2. Load Saved State
        const defaultState = {
            top: Math.max(0, window.innerHeight - 620),
            left: Math.max(0, window.innerWidth - 420),
            width: 400,
            height: 600
        };
        const savedPos = GM_getValue(STORAGE_KEYS.PANEL_POS, defaultState);
        const savedColor = GM_getValue(STORAGE_KEYS.THEME_COLOR, '#0f172a');
        const savedTextColor = GM_getValue(STORAGE_KEYS.TEXT_COLOR, '#e2e8f0');
        const savedLabelColor = GM_getValue(STORAGE_KEYS.LABEL_COLOR, '#94a3b8');
        const savedSize = GM_getValue(STORAGE_KEYS.TEXT_SIZE, '14');
        const savedFont = GM_getValue(STORAGE_KEYS.FONT_FAMILY, 'sans');
        const savedProvider = GM_getValue(STORAGE_KEYS.PROVIDER, 'GEMINI');
        const savedPrompt = GM_getValue(STORAGE_KEYS.CUSTOM_PROMPT, DEFAULT_SYSTEM_PROMPT);

        if (!savedPos.width) savedPos.width = 400;
        if (!savedPos.height) savedPos.height = 600;

        // 3. Create Toggle Button
        const toggle = document.createElement('div');
        toggle.id = 'ap-ai-toggle';
        toggle.title = "Drag to move | Click to open";
        toggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 22 4-10 4 10"/><path d="M8 6h.01"/><path d="M16 6h.01"/></svg>';

        // 4. Create Main Embed
        const embed = document.createElement('div');
        embed.id = 'ap-ai-embed';
        embed.style.left = `${savedPos.left}px`;
        embed.style.top = `${savedPos.top}px`;
        embed.style.width = `${savedPos.width}px`;
        embed.style.height = `${savedPos.height}px`;

        updateTogglePosition(toggle, savedPos.left, savedPos.top, savedPos.width, savedPos.height);
        document.body.appendChild(toggle);

        // Apply saved theme
        embed.style.setProperty('--ap-bg-color', savedColor);
        embed.style.setProperty('--ap-text-color', savedTextColor);
        embed.style.setProperty('--ap-label-color', savedLabelColor);
        embed.style.setProperty('--ap-text-size', `${savedSize}px`);
        if (savedFont === 'serif') embed.style.setProperty('--ap-font-family', 'Georgia, Cambria, "Times New Roman", Times, serif');
        else if (savedFont === 'mono') embed.style.setProperty('--ap-font-family', 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace');
        else embed.style.setProperty('--ap-font-family', 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif');

        embed.innerHTML = `
            <div id="ap-ai-header">
                <div id="ap-ai-title">
                    <span>AI Assistant</span>
                </div>
                <div id="ap-ai-controls">
                    <button class="icon-btn" id="ai-info-btn" title="Model Information">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    </button>
                    <button class="icon-btn" id="ai-settings-btn" title="Settings">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                    <select id="provider-select" class="header-select" title="Select AI Provider">
                        <option value="GEMINI">Gemini</option>
                        <option value="GROQ">Groq</option>
                        <option value="OPENROUTER">OpenRouter</option>
                        <option value="PUTER">Puter AI</option>
                    </select>
                    <button class="icon-btn close-btn" id="ai-close-btn">&times;</button>
                </div>
            </div>

            <div id="ap-ai-content">
                <div style="text-align: center; margin-top: 200px; color: #64748b;" id="ai-placeholder">
                    Press <strong>'Z'</strong> to extract question<br>and get AI explanation.
                </div>
            </div>

            <div id="ap-ai-info-overlay" class="overlay-panel hidden">
                <div class="overlay-header">
                    <h3>Model Information</h3>
                    <button id="close-info-btn" class="icon-btn" title="Close Info">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div class="overlay-body">
                    <div class="info-block">
                        <h4>Puter AI (#1)</h4>
                        <ul>
                            <li><span class="info-key">Model:</span> GPT-5.1 (Puter Alias)</li>
                            <li><span class="info-key">Auth:</span> None / Free (Powered by Puter.js)</li>
                            <li><span class="info-key">Speed:</span> Moderately Fast(Variable Network Overhead)</li>
                            <li><span class="info-key">Accuracy:</span> Very accurate</li>
                        </ul>
                    </div>
                    <div class="info-block">
                        <h4>Gemini API (#2)</h4>
                        <ul>
                            <li><span class="info-key">Model:</span> Google Gemini 2.5 Flash</li>
                            <li><span class="info-key">Auth:</span> Requires Google AI Studio API Key</li>
                            <li><span class="info-key">Speed:</span> Fast</li>
                            <li><span class="info-key">Accuracy:</span> Accurate</li>
                        </ul>
                    </div>
                    <div class="info-block">
                        <h4>OpenRouter API (#3)</h4>
                        <ul>
                            <li><span class="info-key">Model:</span> OpenAI GPT-4.1 Mini</li>
                            <li><span class="info-key">Auth:</span> Requires OpenRouter API Key</li>
                            <li><span class="info-key">Speed:</span> Fast</li>
                            <li><span class="info-key">Accuracy:</span> Industry standard for efficiency.</li>
                        </ul>
                    </div>
                    <div class="info-block">
                        <h4>Groq API (#4)</h4>
                        <ul>
                            <li><span class="info-key">Model:</span> Llama 3.3 70B Versatile</li>
                            <li><span class="info-key">Auth:</span> Requires Groq API Key</li>
                            <li><span class="info-key">Speed:</span> Very fast (Powered by LPU™)</li>
                            <li><span class="info-key">Accuracy:</span> Moderate accuracy</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div id="ap-ai-settings-overlay" class="overlay-panel hidden">
                <div class="overlay-header">
                    <h3>Settings</h3>
                    <button id="close-settings-btn" class="icon-btn" title="Close Settings">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <div class="overlay-body" id="ap-ai-settings-body">
                    <div class="settings-group">
                        <label class="settings-label">Gemini API Key</label>
                        <input type="text" id="set-gemini-key" class="settings-input" placeholder="AIza...">
                    </div>

                    <div class="settings-group">
                        <label class="settings-label">Groq API Key</label>
                        <input type="text" id="set-groq-key" class="settings-input" placeholder="gsk_...">
                    </div>

                    <div class="settings-group">
                        <label class="settings-label">OpenRouter API Key</label>
                        <input type="text" id="set-openrouter-key" class="settings-input" placeholder="sk-or...">
                    </div>

                    <div class="settings-group">
                        <label class="settings-label">Appearance</label>
                        <div style="display:flex; gap:10px;">
                            <div style="flex:1">
                                <span style="font-size:11px; display:block; margin-bottom:4px; color:var(--ap-label-color)">Background</span>
                                <input type="color" id="set-bg-color" class="settings-input" style="height:40px; width:100%; cursor:pointer; padding:2px;">
                            </div>
                            <div style="flex:1">
                                <span style="font-size:11px; display:block; margin-bottom:4px; color:var(--ap-label-color)">Text Color</span>
                                <input type="color" id="set-text-color" class="settings-input" style="height:40px; width:100%; cursor:pointer; padding:2px;">
                            </div>
                            <div style="flex:1">
                                <span style="font-size:11px; display:block; margin-bottom:4px; color:var(--ap-label-color)">Label Color</span>
                                <input type="color" id="set-label-color" class="settings-input" style="height:40px; width:100%; cursor:pointer; padding:2px;">
                            </div>
                        </div>
                    </div>

                    <div class="settings-group">
                        <label class="settings-label">Typography</label>
                         <select id="set-font-family" class="settings-input">
                            <option value="sans">Sans Serif</option>
                            <option value="serif">Serif</option>
                            <option value="mono">Monospace</option>
                        </select>
                    </div>

                    <div class="settings-group">
                        <label class="settings-label">Text Size (<span id="text-size-val">${savedSize}</span>px)</label>
                        <input type="range" id="set-text-size" class="settings-input" min="10" max="24" step="1" value="${savedSize}">
                    </div>

                    <div class="settings-group">
                        <div style="display:flex; justify-content:space-between; align-items:flex-end;">
                            <label class="settings-label">System Prompt</label>
                            <button id="reset-prompt-btn" style="background:none; border:none; color:#60a5fa; font-size:11px; cursor:pointer; padding:0; text-decoration:underline;">Reset to Default</button>
                        </div>
                        <textarea id="set-system-prompt" class="settings-input" placeholder="Enter system prompt..."></textarea>
                    </div>
                </div>
            </div>

            <div id="ap-ai-footer">
                <textarea id="ai-chat-input" placeholder="Ask a follow-up..."></textarea>
                <button id="ai-chat-send">Send</button>
            </div>

            <div id="ap-ai-resize-handle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v6"/><path d="M15 21h6"/><path d="M21 3v6" stroke-opacity="0"/><path d="M3 21h6" stroke-opacity="0"/><path d="M10 14l11 11"/></svg>
            </div>
        `;
        document.body.appendChild(embed);

        // --- HANDLERS ---

        // 1. Toggle Open/Close & Drag Logic
        let isToggleDragging = false;
        let toggleStartX, toggleStartY;
        let initialToggleLeft, initialToggleTop;

        toggle.onmousedown = (e) => {
            // Prevent text selection during drag
            e.preventDefault();
            document.body.style.userSelect = 'none';

            // Prevent immediate click action if dragging
            isToggleDragging = false;
            toggleStartX = e.clientX;
            toggleStartY = e.clientY;
            initialToggleLeft = toggle.offsetLeft;
            initialToggleTop = toggle.offsetTop;

            const onMouseMove = (moveEvent) => {
                const dx = moveEvent.clientX - toggleStartX;
                const dy = moveEvent.clientY - toggleStartY;

                if (Math.abs(dx) > 3 || Math.abs(dy) > 3) isToggleDragging = true;

                if (isToggleDragging) {
                    // Update Toggle Position
                    let newTLeft = initialToggleLeft + dx;
                    let newTTop = initialToggleTop + dy;

                    // Constrain Toggle to Screen
                    const maxTLeft = window.innerWidth - toggle.offsetWidth;
                    const maxTTop = window.innerHeight - toggle.offsetHeight;
                    newTLeft = Math.max(0, Math.min(newTLeft, maxTLeft));
                    newTTop = Math.max(0, Math.min(newTTop, maxTTop));

                    // Calculate Projected Panel Position
                    // Logic: Toggle is roughly at (PanelLeft + PanelWidth - 60, PanelTop + PanelHeight - 60)
                    // So PanelLeft = ToggleLeft - PanelWidth + 60
                    const pW = embed.offsetWidth;
                    const pH = embed.offsetHeight;
                    const offset = 60;

                    let projectedPanelLeft = newTLeft - pW + offset;
                    let projectedPanelTop = newTTop - pH + offset;

                    // Constrain Drag based on Panel Boundaries (Must not go off screen Top/Left)
                    if (projectedPanelLeft < 0) {
                         projectedPanelLeft = 0;
                         newTLeft = pW - offset;
                    }
                    if (projectedPanelTop < 0) {
                        projectedPanelTop = 0;
                        newTTop = pH - offset;
                    }

                    toggle.style.left = `${newTLeft}px`;
                    toggle.style.top = `${newTTop}px`;

                    // Update Embed (Hidden or not) to follow
                    embed.style.left = `${projectedPanelLeft}px`;
                    embed.style.top = `${projectedPanelTop}px`;
                }
            };

            const onMouseUp = () => {
                document.body.style.userSelect = ''; // Restore selection
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);

                if (isToggleDragging) {
                    // Save final position
                     GM_setValue(STORAGE_KEYS.PANEL_POS, {
                        left: embed.offsetLeft,
                        top: embed.offsetTop,
                        width: embed.offsetWidth,
                        height: embed.offsetHeight
                    });
                } else {
                    // It was a click
                    embed.classList.add('open');
                    toggle.classList.add('hidden');
                }
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };

        document.getElementById('ai-close-btn').onclick = () => {
            embed.classList.remove('open');
            toggle.classList.remove('hidden');
        };

        // 2. Settings Logic
        const settingsOverlay = document.getElementById('ap-ai-settings-overlay');
        const settingsBtn = document.getElementById('ai-settings-btn');
        const closeSettingsBtn = document.getElementById('close-settings-btn');
        const resetPromptBtn = document.getElementById('reset-prompt-btn');

        // Info Logic
        const infoOverlay = document.getElementById('ap-ai-info-overlay');
        const infoBtn = document.getElementById('ai-info-btn');
        const closeInfoBtn = document.getElementById('close-info-btn');

        infoBtn.onclick = () => {
            settingsOverlay.classList.add('hidden');
            infoOverlay.classList.remove('hidden');
        };
        closeInfoBtn.onclick = () => {
            infoOverlay.classList.add('hidden');
        };

        const inGemini = document.getElementById('set-gemini-key');
        const inGroq = document.getElementById('set-groq-key');
        const inOpenRouter = document.getElementById('set-openrouter-key');
        const inColor = document.getElementById('set-bg-color');
        const inTextColor = document.getElementById('set-text-color');
        const inLabelColor = document.getElementById('set-label-color');
        const inFont = document.getElementById('set-font-family');
        const inSize = document.getElementById('set-text-size');
        const inPrompt = document.getElementById('set-system-prompt');
        const sizeVal = document.getElementById('text-size-val');

        inGemini.value = GM_getValue(STORAGE_KEYS.GEMINI_KEY, '');
        inGroq.value = GM_getValue(STORAGE_KEYS.GROQ_KEY, '');
        inOpenRouter.value = GM_getValue(STORAGE_KEYS.OPENROUTER_KEY, '');
        inColor.value = savedColor;
        inTextColor.value = savedTextColor;
        inLabelColor.value = savedLabelColor;
        inFont.value = savedFont;
        inSize.value = savedSize;
        inPrompt.value = savedPrompt;

        settingsBtn.onclick = () => {
            infoOverlay.classList.add('hidden');
            settingsOverlay.classList.remove('hidden');
        };
        closeSettingsBtn.onclick = () => { settingsOverlay.classList.add('hidden'); };

        const autoSave = () => {
            GM_setValue(STORAGE_KEYS.GEMINI_KEY, inGemini.value.trim());
            GM_setValue(STORAGE_KEYS.GROQ_KEY, inGroq.value.trim());
            GM_setValue(STORAGE_KEYS.OPENROUTER_KEY, inOpenRouter.value.trim());
            GM_setValue(STORAGE_KEYS.THEME_COLOR, inColor.value);
            GM_setValue(STORAGE_KEYS.TEXT_COLOR, inTextColor.value);
            GM_setValue(STORAGE_KEYS.LABEL_COLOR, inLabelColor.value);
            GM_setValue(STORAGE_KEYS.TEXT_SIZE, inSize.value);
            GM_setValue(STORAGE_KEYS.FONT_FAMILY, inFont.value);
            GM_setValue(STORAGE_KEYS.CUSTOM_PROMPT, inPrompt.value);

            // Live Update
            embed.style.setProperty('--ap-bg-color', inColor.value);
            embed.style.setProperty('--ap-text-color', inTextColor.value);
            embed.style.setProperty('--ap-label-color', inLabelColor.value);
            embed.style.setProperty('--ap-text-size', `${inSize.value}px`);

            if (inFont.value === 'serif') embed.style.setProperty('--ap-font-family', 'Georgia, Cambria, "Times New Roman", Times, serif');
            else if (inFont.value === 'mono') embed.style.setProperty('--ap-font-family', 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace');
            else embed.style.setProperty('--ap-font-family', 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif');

            sizeVal.textContent = inSize.value;
        };

        inGemini.oninput = autoSave;
        inGroq.oninput = autoSave;
        inOpenRouter.oninput = autoSave;
        inColor.oninput = autoSave;
        inTextColor.oninput = autoSave;
        inLabelColor.oninput = autoSave;
        inFont.onchange = autoSave;
        inSize.oninput = autoSave;
        inPrompt.oninput = autoSave;

        resetPromptBtn.onclick = () => {
            if(confirm('Reset system prompt to default?')) {
                inPrompt.value = DEFAULT_SYSTEM_PROMPT;
                autoSave();
            }
        };

        // 3. Provider Select
        const providerSelect = document.getElementById('provider-select');
        providerSelect.value = savedProvider;
        providerSelect.onchange = (e) => {
            const val = e.target.value;
            GM_setValue(STORAGE_KEYS.PROVIDER, val);
            const contentDiv = document.getElementById('ap-ai-content');
            if (settingsOverlay.classList.contains('hidden') && infoOverlay.classList.contains('hidden')) {
                let pName = 'Google Gemini';
                if (val === 'GROQ') pName = 'Groq';
                else if (val === 'PUTER') pName = 'Puter AI';
                else if (val === 'OPENROUTER') pName = 'OpenRouter';

                contentDiv.innerHTML = `<div style="text-align: center; margin-top: 200px; opacity: 0.7;">Switched to ${pName}<br><span style="font-size:12px;">Press Z to use new provider</span></div>`;
                document.getElementById('ap-ai-footer').classList.remove('visible');
                conversationHistory = [];
            }
        };

        // 4. Drag & Resize Logic
        const header = document.getElementById('ap-ai-header');
        const resizeHandle = document.getElementById('ap-ai-resize-handle');

        let isDragging = false;
        let isResizing = false;

        let startX, startY;
        let startLeft, startTop;
        let startW, startH;

        // Drag Start
        header.onmousedown = (e) => {
            if (e.target.closest('button') || e.target.closest('select')) return;
            e.preventDefault(); // Prevent text selection
            document.body.style.userSelect = 'none';

            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = embed.offsetLeft;
            startTop = embed.offsetTop;
            header.style.cursor = 'grabbing';
        };

        // Resize Start
        resizeHandle.onmousedown = (e) => {
            e.preventDefault();
            e.stopPropagation();
            document.body.style.userSelect = 'none';

            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startW = embed.offsetWidth;
            startH = embed.offsetHeight;
            startLeft = embed.offsetLeft;
            startTop = embed.offsetTop;
        };

        // Movement Handler
        document.onmousemove = (e) => {
            if (isDragging) {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;

                let newLeft = startLeft + dx;
                let newTop = startTop + dy;

                // Collision: Drag
                const maxLeft = window.innerWidth - embed.offsetWidth;
                const maxTop = window.innerHeight - embed.offsetHeight;
                newLeft = Math.max(0, Math.min(newLeft, maxLeft));
                newTop = Math.max(0, Math.min(newTop, maxTop));

                embed.style.left = `${newLeft}px`;
                embed.style.top = `${newTop}px`;
                updateTogglePosition(toggle, newLeft, newTop, embed.offsetWidth, embed.offsetHeight);

            } else if (isResizing) {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;

                let newW = startW + dx;
                let newH = startH + dy;

                // Minimum size
                newW = Math.max(320, newW);
                newH = Math.max(400, newH);

                // Collision: Resize
                const maxW = window.innerWidth - startLeft;
                const maxH = window.innerHeight - startTop;
                newW = Math.min(newW, maxW);
                newH = Math.min(newH, maxH);

                embed.style.width = `${newW}px`;
                embed.style.height = `${newH}px`;
                updateTogglePosition(toggle, startLeft, startTop, newW, newH);
            }
        };

        // Mouse Up (End Drag/Resize)
        document.onmouseup = () => {
            if (isDragging || isResizing) {
                document.body.style.userSelect = ''; // Restore selection
                isDragging = false;
                isResizing = false;
                header.style.cursor = 'move';

                GM_setValue(STORAGE_KEYS.PANEL_POS, {
                    left: embed.offsetLeft,
                    top: embed.offsetTop,
                    width: embed.offsetWidth,
                    height: embed.offsetHeight
                });
            }
        };

        // Window Resize Handler
        window.addEventListener('resize', () => {
            const rect = embed.getBoundingClientRect();
            let newLeft = rect.left;
            let newTop = rect.top;
            let newW = rect.width;
            let newH = rect.height;
            let needsUpdate = false;

            if (newLeft + newW > window.innerWidth) {
                newLeft = Math.max(0, window.innerWidth - newW);
                needsUpdate = true;
            }
            if (newTop + newH > window.innerHeight) {
                newTop = Math.max(0, window.innerHeight - newH);
                needsUpdate = true;
            }
            if (newLeft + newW > window.innerWidth) {
                 newW = Math.max(320, window.innerWidth - newLeft);
                 needsUpdate = true;
            }

            if (needsUpdate) {
                embed.style.left = `${newLeft}px`;
                embed.style.top = `${newTop}px`;
                embed.style.width = `${newW}px`;
                embed.style.height = `${newH}px`;
                updateTogglePosition(toggle, newLeft, newTop, newW, newH);
            }
        });


        // Chat Handlers
        const sendBtn = document.getElementById('ai-chat-send');
        const chatInput = document.getElementById('ai-chat-input');
        const handleSend = () => {
            const text = chatInput.value.trim();
            if (!text) return;
            chatInput.value = '';
            appendUserMessage(text);
            continueChat(text);
        };
        sendBtn.onclick = handleSend;
        chatInput.onkeydown = (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        };
    }

    function updateTogglePosition(toggleEl, panelLeft, panelTop, width, height) {
        const left = panelLeft + width - 60;
        const top = panelTop + height - 60;
        toggleEl.style.left = `${left}px`;
        toggleEl.style.top = `${top}px`;
        toggleEl.style.bottom = 'auto';
        toggleEl.style.right = 'auto';
    }

    // --- UI HELPERS ---
    function appendUserMessage(text) {
        const contentDiv = document.getElementById('ap-ai-content');
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-message user';
        msgDiv.innerHTML = `<div class="msg-bubble">${escapeHtml(text)}</div>`;
        contentDiv.appendChild(msgDiv);
        contentDiv.scrollTop = contentDiv.scrollHeight;
    }

    function appendAIMessage(htmlContent) {
        const contentDiv = document.getElementById('ap-ai-content');
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-message ai';
        msgDiv.innerHTML = htmlContent;
        contentDiv.appendChild(msgDiv);
        contentDiv.scrollTop = contentDiv.scrollHeight;
    }

    function showLoading() {
        const contentDiv = document.getElementById('ap-ai-content');
        const loader = document.createElement('div');
        loader.id = 'ai-temp-loader';
        loader.className = 'ai-loading';
        loader.innerHTML = '<div class="ai-loading-spinner"></div> Thinking...';
        contentDiv.appendChild(loader);
        contentDiv.scrollTop = contentDiv.scrollHeight;
    }

    function removeLoading() {
        const loader = document.getElementById('ai-temp-loader');
        if (loader) loader.remove();
    }

    // --- PARSING & RENDERING ---
    function escapeHtml(text) {
        if (!text) return "";
        return text.replace(/&/g, "&amp;")
                   .replace(/</g, "&lt;")
                   .replace(/>/g, "&gt;")
                   .replace(/"/g, "&quot;")
                   .replace(/'/g, "&#039;");
    }

    function renderMarkdown(text) {
        let html = text;
        html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/^\s*-\s+(.*)/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
        html = html.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');
        html = html.replace(/\n\n/g, '<div style="height:10px"></div>');
        html = html.replace(/\n(?!(<li|<ul|<h|<pre|<blockquote))/g, '<br>');
        return html;
    }

    function renderGeminiResponse(responseText) {
        if (!responseText) return "Error: Empty response";

        let cleaned = responseText;

        // --- SPECIFIC USER MAPPINGS ---
        cleaned = cleaned.replace(/\\neq/g, '≠');
        cleaned = cleaned.replace(/\\ne/g, '≠');
        cleaned = cleaned.replace(/\\ge/g, '>');
        cleaned = cleaned.replace(/\\le/g, '<');
        cleaned = cleaned.replace(/\\ll/g, '≤');
        cleaned = cleaned.replace(/\\gg/g, '≥');
        cleaned = cleaned.replace(/\\over/g, '/');
        cleaned = cleaned.replace(/\\circ/g, '°'); // NEW: circ mapping

        cleaned = cleaned.replace(/\\approx/g, '≈');
        cleaned = cleaned.replace(/\\cdot/g, '·');
        cleaned = cleaned.replace(/\\pm/g, '±');
        cleaned = cleaned.replace(/\\pi/g, 'π');
        cleaned = cleaned.replace(/\\theta/g, 'θ');

        // ADDED: Infinity and Log
        cleaned = cleaned.replace(/\\infty/g, '∞');
        cleaned = cleaned.replace(/\\log/g, 'log');
        cleaned = cleaned.replace(/\\ln/g, 'ln');

        // --- ARROW MAPPINGS ---
        cleaned = cleaned.replace(/\\Longleftrightarrow/g, '⟺');
        cleaned = cleaned.replace(/\\longleftrightarrow/g, '⟷');
        cleaned = cleaned.replace(/\\Leftrightarrow/g, '⇔');
        cleaned = cleaned.replace(/\\leftrightarrow/g, '↔');
        cleaned = cleaned.replace(/\\Longrightarrow/g, '⟹');
        cleaned = cleaned.replace(/\\longrightarrow/g, '⟶');
        cleaned = cleaned.replace(/\\Longleftarrow/g, '⟸');
        cleaned = cleaned.replace(/\\longleftarrow/g, '⟵');
        cleaned = cleaned.replace(/\\Rightarrow/g, '⇒');
        cleaned = cleaned.replace(/\\rightarrow/g, '→');
        cleaned = cleaned.replace(/\\Leftarrow/g, '⇐');
        cleaned = cleaned.replace(/\\leftarrow/g, '←');

        // --- ARRAY / TABLE CLEANING ---
        cleaned = cleaned.replace(/\\begin\{array\}\{[^}]*\}/g, '');
        cleaned = cleaned.replace(/\\end\{array\}/g, '\n');
        cleaned = cleaned.replace(/\\hline/g, '');
        cleaned = cleaned.replace(/&/g, ' | ');
        cleaned = cleaned.replace(/\\\\/g, '\n');

        // ADDED: Itemize List Cleaning
        cleaned = cleaned.replace(/\\begin\{itemize\}/g, '');
        cleaned = cleaned.replace(/\\end\{itemize\}/g, '');
        cleaned = cleaned.replace(/\\item\s*/g, '\n- ');

        // --- ITERATIVE REPLACEMENT ---
        let oldCleaned;
        let loops = 0;
        const maxLoops = 20;

        do {
            oldCleaned = cleaned;
            loops++;
            cleaned = cleaned.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, '($1)/($2)');
            cleaned = cleaned.replace(/\\sqrt\{([^{}]*)\}/g, '√($1)');
            cleaned = cleaned.replace(/\\boxed\{([^{}]*)\}/g, '**$1**');
            cleaned = cleaned.replace(/\\text\{([^{}]*)\}/g, '$1');
        } while (oldCleaned !== cleaned && loops < maxLoops);

        cleaned = cleaned.replace(/\$/g, '');
        // NEW: Final sweep to remove any remaining backslashes
        cleaned = cleaned.replace(/\\/g, '');

        return renderMarkdown(escapeHtml(cleaned));
    }

    // --- EXTRACTION LOGIC ---
    function getCurrentQuestionContainer() {
        const visibleItem = document.querySelector('.lrn-assess-item[style*="visibility: visible"][style*="opacity: 1"]');
        return visibleItem ? (visibleItem.querySelector('div[class*="lrn_mcq"]') || visibleItem) : document.querySelector('div[class*="lrn_mcq"]');
    }

    function processMathElements(rootElement) {
        const mathContainers = Array.from(rootElement.querySelectorAll('mjx-container'));
        mathContainers.forEach(container => {
            const mathTag = container.querySelector('math');
            let latex = null;
            if (mathTag) {
                if (mathTag.hasAttribute('alttext')) latex = mathTag.getAttribute('alttext');
                else if (mathTag.hasAttribute('aria-label')) latex = mathTag.getAttribute('aria-label');
            }
            if (!latex && container.parentElement?.hasAttribute('aria-label')) latex = container.parentElement.getAttribute('aria-label');
            if (!latex && container.hasAttribute('aria-label')) latex = container.getAttribute('aria-label');

            if (latex) {
                const replacementNode = document.createTextNode(' $' + latex.trim() + '$ ');
                container.replaceWith(replacementNode);
            }
        });
    }

    function extractTextFromNode(node) {
        let text = "";
        if (!node) return "";
        if (node.nodeType === Node.TEXT_NODE) return node.textContent || "";
        if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName.toUpperCase();
            if (tagName === 'STYLE' || tagName === 'SCRIPT') return "";
            if (tagName === 'IMG' && node.hasAttribute('alt')) {
                 text += " [Image: " + node.getAttribute('alt') + "] ";
            }
            if (['P', 'DIV', 'LI', 'BR', 'H1', 'H2', 'H3'].includes(tagName)) text += "\n";
            for (let i = 0; i < node.childNodes.length; i++) text += extractTextFromNode(node.childNodes[i]);
            if (['P', 'DIV', 'H1', 'H2', 'H3'].includes(tagName)) text += "\n";
            if (tagName === 'LI') text += "\n";
        }
        return text;
    }

    function extractContent(container) {
        if (!container) return "";
        try {
            const clone = container.cloneNode(true);
            processMathElements(clone);
            const tables = clone.querySelectorAll('table');
            tables.forEach(table => {
                 const rows = Array.from(table.querySelectorAll('tr'));
                 let tableText = "\n\n";
                 rows.forEach(row => {
                     const cells = Array.from(row.querySelectorAll('td, th'));
                     const rowContent = cells.map(cell => extractTextFromNode(cell).trim().replace(/\n/g, ' ')).join(' | ');
                     tableText += "| " + rowContent + " |\n";
                 });
                 tableText += "\n";
                 const pre = document.createElement('pre');
                 pre.textContent = tableText;
                 table.replaceWith(pre);
            });
            let final = extractTextFromNode(clone);
            return final.replace(/[ \t]+/g, ' ').replace(/\n\s*\n/g, '\n\n').trim();
        } catch (e) {
            console.error("Extraction error:", e);
            return "[Error extracting content: " + e.message + "]";
        }
    }

    // --- API CALLING LOGIC ---
    async function callGeminiDirect(history, apiKey) {
        const systemPrompt = GM_getValue(STORAGE_KEYS.CUSTOM_PROMPT, DEFAULT_SYSTEM_PROMPT);
        const contents = history.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        const requestData = JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: contents
        });

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey,
                headers: { "Content-Type": "application/json" },
                data: requestData,
                timeout: 60000, // Updated timeout
                onload: function(response) {
                    if (response.status !== 200) {
                        try {
                            const errData = JSON.parse(response.responseText);
                            resolve("API Error (" + response.status + "): " + (errData.error?.message || response.statusText));
                        } catch(e) {
                            resolve("API Error (" + response.status + "): " + response.statusText);
                        }
                        return;
                    }
                    try {
                        const data = JSON.parse(response.responseText);
                        const result = data.candidates?.[0]?.content?.parts?.[0]?.text;
                        resolve(result || "No response text from AI.");
                    } catch (e) {
                        resolve("Error parsing AI response: " + e.message);
                    }
                },
                onerror: function(err) { resolve("Network Error: " + (err.statusText || "Unknown error")); },
                ontimeout: function() { resolve("Error: Request timed out."); }
            });
        });
    }

    async function callOpenRouter(history, apiKey) {
        const systemPrompt = GM_getValue(STORAGE_KEYS.CUSTOM_PROMPT, DEFAULT_SYSTEM_PROMPT);
        const messages = [
            { role: "system", content: systemPrompt },
            ...history
        ];

        const requestData = JSON.stringify({
            model: "openai/gpt-4.1-mini",
            messages: messages
        });

        return new Promise((resolve) => {
             GM_xmlhttpRequest({
                method: "POST",
                url: "https://openrouter.ai/api/v1/chat/completions",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + apiKey,
                    "HTTP-Referer": "https://apclassroom.collegeboard.org/",
                    "X-Title": "AP Tutor Script"
                },
                data: requestData,
                timeout: 60000, // Updated timeout
                onload: function(response) {
                    if (response.status !== 200) {
                         try {
                            const errData = JSON.parse(response.responseText);
                            resolve("OpenRouter Error (" + response.status + "): " + (errData.error?.message || response.statusText));
                        } catch(e) {
                            resolve("OpenRouter Error (" + response.status + "): " + response.statusText);
                        }
                        return;
                    }
                    try {
                        const data = JSON.parse(response.responseText);
                        const result = data.choices?.[0]?.message?.content;
                        resolve(result || "No response text from OpenRouter.");
                    } catch (e) {
                        resolve("Error parsing OpenRouter response: " + e.message);
                    }
                },
                onerror: function(err) { resolve("OpenRouter Network Error: " + (err.statusText || "Unknown error")); },
                ontimeout: function() { resolve("OpenRouter Request Timed Out."); }
            });
        });
    }

    async function callGroq(history, apiKey) {
        const systemPrompt = GM_getValue(STORAGE_KEYS.CUSTOM_PROMPT, DEFAULT_SYSTEM_PROMPT);
        const messages = [
            { role: "system", content: systemPrompt },
            ...history
        ];

        const requestData = JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: messages
        });

        return new Promise((resolve) => {
             GM_xmlhttpRequest({
                method: "POST",
                url: "https://api.groq.com/openai/v1/chat/completions",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + apiKey
                },
                data: requestData,
                timeout: 60000,
                onload: function(response) {
                    if (response.status !== 200) {
                         try {
                            const errData = JSON.parse(response.responseText);
                            resolve("Groq Error (" + response.status + "): " + (errData.error?.message || response.statusText));
                        } catch(e) {
                            resolve("Groq Error (" + response.status + "): " + response.statusText);
                        }
                        return;
                    }
                    try {
                        const data = JSON.parse(response.responseText);
                        const result = data.choices?.[0]?.message?.content;
                        resolve(result || "No response text from Groq.");
                    } catch (e) {
                        resolve("Error parsing Groq response: " + e.message);
                    }
                },
                onerror: function(err) { resolve("Groq Network Error: " + (err.statusText || "Unknown error")); },
                ontimeout: function() { resolve("Groq Request Timed Out."); }
            });
        });
    }

    async function callPuter(history) {
        // Ensure Puter is loaded
        if (typeof window.puter === 'undefined') {
             return "Error: Puter.js library not loaded. Ensure you have internet access and the script is updated.";
        }

        const systemPrompt = GM_getValue(STORAGE_KEYS.CUSTOM_PROMPT, DEFAULT_SYSTEM_PROMPT);
        const messages = [
            { role: "system", content: systemPrompt },
            ...history
        ];

        try {
            // Updated model spec as requested
            const response = await window.puter.ai.chat(messages, {model: "gpt-5.1"});

            // Handle various response formats Puter might return
            if (typeof response === 'string') return response;
            if (response?.message?.content) return response.message.content;
            if (response?.content) return response.content;
            if (Array.isArray(response) && response[0]?.message?.content) return response[0].message.content;

            return JSON.stringify(response);
        } catch (error) {
            return "Puter AI Error: " + (error.message || error);
        }
    }

    async function callAI(history) {
        const provider = GM_getValue(STORAGE_KEYS.PROVIDER, 'GEMINI');

        if (provider === 'OPENROUTER') {
            const key = GM_getValue(STORAGE_KEYS.OPENROUTER_KEY);
            if (!key) return "Error: Please set OpenRouter API Key in Settings.";
            return callOpenRouter(history, key);
        } else if (provider === 'GROQ') {
            const key = GM_getValue(STORAGE_KEYS.GROQ_KEY);
            if (!key) return "Error: Please set Groq API Key in Settings.";
            return callGroq(history, key);
        } else if (provider === 'PUTER') {
             return callPuter(history);
        } else {
            const key = GM_getValue(STORAGE_KEYS.GEMINI_KEY);
            if (!key) return "Error: Please set Gemini API Key in Settings.";
            return callGeminiDirect(history, key);
        }
    }

    // --- MAIN ACTIONS ---
    function formatAndCopyQuestion() {
        try {
            // 1. Identify the Question Container (MCQ part)
            const questionContainer = getCurrentQuestionContainer();
            if (!questionContainer) return;

            // 2. Identify the Root Item (Parent container for the whole layout) to scope the context search
            // If getCurrentQuestionContainer returned the MCQ div, we find its parent assessment item.
            // If it returned the item itself (fallback), we use that.
            // We use .closest('.lrn-assess-item') or fallback to the querySelector.
            const itemRoot = questionContainer.closest('.lrn-assess-item') || document.querySelector('.lrn-assess-item[style*="visibility: visible"][style*="opacity: 1"]');

            let fullContent = "";

            // --- Multi-section Support (Scoped to Current Question) ---
            if (itemRoot) {
                // Search specifically within the current visible item
                const leftCol = itemRoot.querySelector('.two-columns.left-column');
                if (leftCol) {
                    const contextContent = extractContent(leftCol);
                    if (contextContent && contextContent.trim().length > 0) {
                         fullContent += "--- SHARED CONTEXT / PASSAGE ---\n";
                         fullContent += contextContent + "\n";
                         fullContent += "--------------------------------\n\n";
                    }
                }
            }
            // --------------------------------------------------

            const stimulus = questionContainer.querySelector('.lrn_stimulus_content');
            if (stimulus) fullContent += extractContent(stimulus) + "\n\n";

            const options = questionContainer.querySelectorAll('.lrn_mcqgroup > li, .lrn-mcq-option');
            if (options.length > 0) {
                fullContent += "Options:\n";
                options.forEach((opt, idx) => {
                    const text = extractContent(opt.querySelector('.lrn_contentWrapper') || opt);
                    fullContent += "(" + String.fromCharCode(65 + idx) + ") " + text + "\n";
                });
            }

            if (typeof GM_setClipboard === 'function') GM_setClipboard(fullContent);
            else navigator.clipboard.writeText(fullContent);

            const notif = document.createElement('div');
            notif.textContent = '✅ Copied & Analyzing...';
            notif.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #22c55e; color: white; padding: 10px; border-radius: 8px; z-index: 100000;';
            document.body.appendChild(notif);
            setTimeout(() => notif.remove(), 2000);

            const embed = document.getElementById('ap-ai-embed');
            const toggle = document.getElementById('ap-ai-toggle');
            const contentDiv = document.getElementById('ap-ai-content');
            const footer = document.getElementById('ap-ai-footer');

            if (embed) {
                embed.classList.add('open');
                if (toggle) toggle.classList.add('hidden');
            }

            conversationHistory = [];
            conversationHistory.push({ role: 'user', content: "QUESTION:\n" + fullContent });

            contentDiv.innerHTML = '';

            footer.classList.remove('visible');
            showLoading();

            callAI(conversationHistory).then(response => {
                removeLoading();
                if (response.startsWith("Error:") || response.startsWith("API Error") || response.startsWith("OpenRouter Error") || response.startsWith("Groq Error") || response.startsWith("Puter AI Error")) {
                    const errDiv = document.createElement('div');
                    errDiv.style.color = '#ef4444';
                    errDiv.style.padding = '10px';
                    errDiv.textContent = response;
                    contentDiv.appendChild(errDiv);
                    return;
                }
                conversationHistory.push({ role: 'assistant', content: response });
                try {
                    const renderedHtml = renderGeminiResponse(response);
                    appendAIMessage(renderedHtml);
                    footer.classList.add('visible');
                } catch(e) {
                    contentDiv.insertAdjacentHTML('beforeend', "<p style='color:red'>Error rendering response: " + e.message + "</p>");
                }
            });
        } catch (err) {
            console.error(err);
            alert("AP Tutor Error: " + err.message);
        }
    }

    async function continueChat(userText) {
        conversationHistory.push({ role: 'user', content: userText });
        showLoading();
        callAI(conversationHistory).then(response => {
            removeLoading();
            if (response.startsWith("Error:") || response.startsWith("API Error") || response.startsWith("OpenRouter Error") || response.startsWith("Groq Error") || response.startsWith("Puter AI Error")) {
                const contentDiv = document.getElementById('ap-ai-content');
                const errDiv = document.createElement('div');
                errDiv.style.color = '#ef4444';
                errDiv.textContent = response;
                contentDiv.appendChild(errDiv);
                return;
            }
            conversationHistory.push({ role: 'assistant', content: response });
            try {
                const renderedHtml = renderGeminiResponse(response);
                appendAIMessage(renderedHtml);
            } catch(e) { console.error("Render error", e); }
        });
    }

    // Initialize
    injectUI();

    document.addEventListener('keydown', function(event) {
        if (event.key.toLowerCase() === 'z' && !event.altKey && !event.ctrlKey && !event.metaKey) {
            const active = document.activeElement;
            if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return;
            event.preventDefault();
            formatAndCopyQuestion();
        }
    });

})();
