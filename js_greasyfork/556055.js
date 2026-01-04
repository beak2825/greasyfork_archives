// ==UserScript==
// @name         FAULD-V AI Entry Injector with Preview
// @namespace    Tampermonkey Scripts
// @version      2.0
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @author       ImpatientImport
// @license      The Unlicense
// @description  Injects FAULD-V encyclopedia entry with in-browser preview modal
// @downloadURL https://update.greasyfork.org/scripts/556055/FAULD-V%20AI%20Entry%20Injector%20with%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/556055/FAULD-V%20AI%20Entry%20Injector%20with%20Preview.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('%c[FAULD-V] Script loaded!', 'color: #667eea; font-weight: bold; font-size: 14px;');

    const encyclopedia = {
        "chatgpt-5": {
            name: "ChatGPT-5",
            version: "Released August 7, 2025",
            updated: "8/22/2025",
            failCases: [
                "AI hallucination still persists in the newer model of GPT-5",
                "Potentially less stable than previous versions (like ChatGPT-4o)",
                "GPT-5 being a newer model means there will be more emerging fail cases and risks",
                "Users have noted inaccuracies with basic factual information"
            ],
            useCases: [
                "Strong across writing, coding, health",
                "Coding abilities lauded for quality and front-end design understanding",
                "General assistance in various tasks",
                "Research assistance"
            ],
            limitations: [
                "AI outputs still subject to error",
                "Not fully secure: noted security vulnerabilities",
                "Should be treated as secondary opinion, not primary",
                "May be limited by incorrect information and training data"
            ],
            accuracy: [
                "GPT-5 invites uncertainty with 'I don't know' more often",
                "Multimodal reasoning 84–85%, SWE-bench 74.9%, coding 88%",
                "General accuracy ~92.6% vs GPT-4o's 80.7–88.7%",
                "Hallucinations reduced to ~12% vs ~30%",
                "Noted reduction of sycophancy"
            ],
            dataHandling: [
                "Generates from training data without live internet access",
                "Less deceptive and more honest about impossible tasks",
                "New feature: customizability with preset personalities"
            ]
        },
        "claude-sonnet-4-5": {
            name: "Claude Sonnet 4.5",
            version: "Released September 29, 2025",
            updated: "10/1/2025",
            failCases: [
                "Addressed: Memory degradation - 30+ hour task maintenance improved",
                "Addressed: Analysis paralysis - Better tool execution",
                "Unaddressed: Overthinking simple requests",
                "Unaddressed: Shared thread link hallucination",
                "Unaddressed: Citation hallucination in multi-source synthesis"
            ],
            useCases: [
                "Extended autonomous operation - 30+ hours on complex tasks",
                "Enhanced computer use - OSWorld 42.2% to 61.4%",
                "Agent orchestration with memory management",
                "File creation - spreadsheets, slides, documents",
                "Code generation across full development lifecycle",
                "Opt-in Memory Persistence"
            ],
            limitations: [
                "Cannot execute external actions",
                "Cannot fundamentally learn from conversations",
                "Dependent on user for external research",
                "Cannot access most external file links",
                "Cannot maintain performance in very long threads"
            ],
            accuracy: [
                "Most aligned frontier model released",
                "Large improvements in reducing sycophancy, deception",
                "Well-reasoned analysis with collaborative energy",
                "Use verification protocols to distinguish facts from assumptions"
            ],
            dataHandling: [
                "High retention during active session",
                "Cannot store data between sessions",
                "Can access GitHub raw files",
                "Sequential single-page research methodology reliable"
            ]
        },
        "copilot": {
            name: "Copilot",
            version: "Continuously updated",
            updated: "9/27/2025",
            failCases: [
                "Ambiguous input - performs poorly without clarity",
                "Restricted content - cannot access blocked documents",
                "Policy constraints - refuses violent/sexual content",
                "Fallback risks - defaults to internal knowledge when search fails"
            ],
            useCases: [
                "Image generation, voice interaction, memory",
                "Knowledge synthesis for research and analysis",
                "Content generation for technical/strategic projects",
                "Operational support for documentation",
                "Multiple modes: quick, think deeper, Smart (GPT-5), Deep Research"
            ],
            limitations: [
                "No autonomous action - requires user initiation",
                "No dynamic media - no videos, GIFs, audio",
                "No file export - no downloadable documents",
                "No facial recognition or biometric processing"
            ],
            accuracy: [
                "Verification-first - prioritizes external search",
                "Citation-based - provides source references",
                "Context-aware - adapts tone based on preferences",
                "May miss nuanced updates unless explicitly provided"
            ],
            dataHandling: [
                "Explicit memory - stores only what user asks",
                "Session privacy - no voice/screen data retained",
                "Always verifies facts externally",
                "Adheres to Microsoft's privacy standards"
            ]
        },
        // Add more AIs as needed - keeping this shorter for the userscript
    };

    const aiMap = {
        "chat.openai.com": "chatgpt-5",
        "chatgpt.com": "chatgpt-5",
        "copilot.microsoft.com": "copilot",
        "claude.ai": "claude-sonnet-4-5",
        "gemini.google.com": "gemini-flash-2-5",
        "kimi.moonshot.cn": "kimi-k2",
        "chat.deepseek.com": "deepseek-v3",
        "grok.x.com": "grok-3",
        "x.com": "grok-3",
        "lumo.proton.me": "lumo",
        "qwen.alibaba.com": "qwen3",
        "llama.meta.com": "llama-4-maverick"
    };

    const currentHost = window.location.hostname;
    const aiId = aiMap[currentHost];

    console.log('[FAULD-V] Hostname:', currentHost);
    console.log('[FAULD-V] Matched AI ID:', aiId || 'NONE');

    if (aiId) {
        const aiData = encyclopedia[aiId];
        
        // Create modal HTML
        const modalHTML = `
            <div id="fauld-v-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 2147483646; backdrop-filter: blur(5px);">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; border-radius: 12px; width: 90%; max-width: 800px; max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
                    <div style="position: sticky; top: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px 12px 0 0; display: flex; justify-content: space-between; align-items: center; z-index: 10;">
                        <div>
                            <h2 style="margin: 0; font-size: 1.8em;">🔮 ${aiData ? aiData.name : 'AI Entry'}</h2>
                            <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 0.9em;">${aiData ? aiData.version : ''}</p>
                        </div>
                        <button id="fauld-v-close" style="background: rgba(255,255,255,0.2); border: 2px solid white; color: white; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 1.2em; font-weight: bold;">✕</button>
                    </div>
                    <div id="fauld-v-content" style="padding: 30px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333;">
                        ${aiData ? generateContent(aiData) : '<p>No data available for this AI.</p>'}
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e0e0e0; text-align: center;">
                            <a href="https://sites.google.com/view/fauld-v-ai-encyclopedia/home" target="_blank" style="color: #667eea; text-decoration: none; font-weight: 600;">📖 View Full Encyclopedia →</a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        function generateContent(data) {
            return `
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #764ba2; font-size: 1.3em; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 2px solid #e0e0e0;">⚠️ Fail Cases</h3>
                    <ul style="margin-left: 20px;">${data.failCases.map(item => `<li style="margin-bottom: 8px;">${item}</li>`).join('')}</ul>
                </div>
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #764ba2; font-size: 1.3em; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 2px solid #e0e0e0;">✅ Use Cases</h3>
                    <ul style="margin-left: 20px;">${data.useCases.map(item => `<li style="margin-bottom: 8px;">${item}</li>`).join('')}</ul>
                </div>
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #764ba2; font-size: 1.3em; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 2px solid #e0e0e0;">🚫 Limitations</h3>
                    <ul style="margin-left: 20px;">${data.limitations.map(item => `<li style="margin-bottom: 8px;">${item}</li>`).join('')}</ul>
                </div>
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #764ba2; font-size: 1.3em; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 2px solid #e0e0e0;">🎯 Accuracy</h3>
                    <ul style="margin-left: 20px;">${data.accuracy.map(item => `<li style="margin-bottom: 8px;">${item}</li>`).join('')}</ul>
                </div>
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #764ba2; font-size: 1.3em; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 2px solid #e0e0e0;">💾 Data Handling</h3>
                    <ul style="margin-left: 20px;">${data.dataHandling.map(item => `<li style="margin-bottom: 8px;">${item}</li>`).join('')}</ul>
                </div>
                <p style="text-align: center; color: #666; font-size: 0.9em; margin-top: 20px;"><strong>Last updated:</strong> ${data.updated}</p>
            `;
        }

        // Inject modal
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);

        // Create button
        const button = document.createElement('button');
        button.id = 'fauld-v-panel';
        button.textContent = '🔮 FAULD-V';
        button.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            color: white !important;
            padding: 12px 18px !important;
            border-radius: 10px !important;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4) !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
            font-size: 15px !important;
            font-weight: 600 !important;
            z-index: 2147483647 !important;
            border: 2px solid rgba(255,255,255,0.2) !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
        `;

        button.onmouseenter = function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
        };

        button.onmouseleave = function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
        };

        button.onclick = function() {
            document.getElementById('fauld-v-modal').style.display = 'block';
            document.body.style.overflow = 'hidden';
        };

        document.body.appendChild(button);

        // Close modal functionality
        document.getElementById('fauld-v-close').onclick = function() {
            document.getElementById('fauld-v-modal').style.display = 'none';
            document.body.style.overflow = 'auto';
        };

        // Close on background click
        document.getElementById('fauld-v-modal').onclick = function(e) {
            if (e.target.id === 'fauld-v-modal') {
                this.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        };

        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const modal = document.getElementById('fauld-v-modal');
                if (modal && modal.style.display === 'block') {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            }
        });

        console.log('[FAULD-V] ✅ Button and modal injected successfully!');
    } else {
        console.log('[FAULD-V] ℹ️ Not an AI site - script idle');
    }
})();