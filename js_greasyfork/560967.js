// ==UserScript==
// @name         LMArena Battle Judge (Generates a new prompt to evaluate a battle)
// @namespace    http://tampermonkey.net/
// @version      4.13
// @description  One-click extraction of side-by-side battle responses into a structured evaluation prompt. Captures multi-turn conversation history, strips thinking blocks, inlines citation URLs, identifies models, and generates a ready-to-paste judge prompt for rigorous LLM comparison.
// @match        *://lmarena.ai/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560967/LMArena%20Battle%20Judge%20%28Generates%20a%20new%20prompt%20to%20evaluate%20a%20battle%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560967/LMArena%20Battle%20Judge%20%28Generates%20a%20new%20prompt%20to%20evaluate%20a%20battle%29.meta.js
// ==/UserScript==

// NOTE: @grant none disables Tampermonkey's sandbox to allow navigator.clipboard API access.
// This is required for the copy-to-clipboard functionality. The script only runs on lmarena.ai.

(function () {
    'use strict';

    // =============================================================================
    // CONFIGURATION
    // =============================================================================

    const VERSION = '4.13';

    const CONFIG = {
        // CSS selectors
        selectors: {
            responseContainer: '[class*="flex"][class*="-ml-4"]',
            userBubble: '[class*="bg-surface-secondary"][class*="max-w-prose"]',
            prose: '[class*="prose"]',
            spinner: '[class*="spinner"], [class*="loading"], [class*="generating"]',
            hidden: '[style*="display: none"], [style*="display:none"], [style*="visibility: hidden"], [style*="visibility:hidden"]'
        },

        // Elements to strip from response text
        stripSelectors: [
            'details',
            '[class*="thinking"]',
            '[class*="reasoning"]',
            '[class*="thought"]',
            '[aria-hidden="true"]',
            '[hidden]'
        ],

        // UI
        buttonContainerId: 'lmarena-judge-btn',
        debounceMs: 500
    };

    // =============================================================================
    // UTILITIES
    // =============================================================================

    const log = (...args) => console.log(`[LMArena Judge v${VERSION}]`, ...args);

    /** Process citation links by inlining URLs for LLM context */
    function inlineCitationLinks(element) {
        if (!element) return;
        
        // Find all links that look like citations (contain [number] or are numbered references)
        const links = element.querySelectorAll('a[href]');
        links.forEach(link => {
            const text = link.textContent?.trim() || '';
            const href = link.getAttribute('href') || '';
            
            // Skip empty or javascript links
            if (!href || href.startsWith('javascript:') || href === '#') return;
            
            // Check if this is a citation link (numbered like [1] or just a number)
            const isCitation = /^\[?\d+\]?$/.test(text);
            
            if (isCitation && href.startsWith('http')) {
                // Replace citation with inline URL
                link.textContent = `(${href})`;
            } else if (href.startsWith('http') && !text.includes(href)) {
                // For other links, append URL if not already visible
                link.textContent = `${text} (${href})`;
            }
        });
    }

    /** Clean up citation artifacts from text */
    function cleanCitationArtifacts(text) {
        if (!text) return '';
        return text
            .replace(/\n*Sources\s*\n[\s\S]*$/i, '')       // "Sources" section at end
            .replace(/\n\d+\s+https?:\/\/[^\n]+/g, '')     // numbered URL lines (duplicates)
            .replace(/\n{3,}/g, '\n\n')
            .trim();
    }

    // =============================================================================
    // PROMPT API (for title generation)
    // =============================================================================

    /**
     * Generate a short title using the browser's built-in Prompt API if available.
     * Uses up to 500 characters of the user's initial prompt.
     * Returns null if the API is unavailable or fails.
     */
    async function generateTitleWithPromptAPI(userPrompt) {
        // Check if the Prompt API is available
        if (typeof LanguageModel === 'undefined') {
            log('Prompt API not available (LanguageModel undefined)');
            return null;
        }

        try {
            // Check model availability
            const availability = await LanguageModel.availability();
            if (availability === 'unavailable') {
                log('Prompt API model unavailable');
                return null;
            }

            // Truncate prompt to 500 characters
            const truncatedPrompt = userPrompt.slice(0, 500);

            // Create session with system prompt
            const session = await LanguageModel.create({
                initialPrompts: [{
                    role: 'system',
                    content: 'You are a title generator. When given text between <text> tags, output ONLY a 3-5 word title summarizing that text. No explanation, no quotes, just the title.'
                }]
            });

            // Generate title - wrap the user content clearly so the SLM doesn't treat it as instructions
            const title = await session.prompt(`<text>${truncatedPrompt}</text>`);

            // Clean up session
            session.destroy();

            // Clean up the result: take only first line, limit to ~50 chars, remove quotes
            let cleaned = title?.trim() || '';
            
            // Take only first line (model may output multiple lines)
            cleaned = cleaned.split('\n')[0].trim();
            
            // Remove quotes if wrapped
            cleaned = cleaned.replace(/^["']|["']$/g, '').trim();
            
            // Limit to first ~50 characters, breaking at word boundary
            if (cleaned.length > 50) {
                cleaned = cleaned.slice(0, 50).replace(/\s+\S*$/, '').trim();
            }
            
            return cleaned || null;

        } catch (err) {
            log('Prompt API error:', err.message || err);
            return null;
        }
    }

    /** Copy text to clipboard with fallback */
    async function copyToClipboard(text, button, originalText, originalColor) {
        try {
            await navigator.clipboard.writeText(text);
            button.textContent = 'Copied!';
            button.style.background = '#22c55e';
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = originalColor;
            }, 1500);
        } catch {
            // Fallback: show textarea for manual copy
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:80%;height:60%;z-index:10001;font-family:monospace;';
            document.body.appendChild(textarea);
            textarea.select();
            alert('Clipboard unavailable. Text selected - press Ctrl+C to copy, click outside to close.');
            textarea.addEventListener('blur', () => textarea.remove());
        }
    }

    /** Deduplicate text fragments, keeping longest non-overlapping */
    function deduplicateTexts(texts) {
        const result = [];
        for (const text of texts) {
            if (text.length < 10) continue;

            // Skip if substring of existing
            if (result.some(r => r.includes(text))) continue;

            // Remove existing texts that are substrings of this one
            for (let i = result.length - 1; i >= 0; i--) {
                if (text.includes(result[i])) result.splice(i, 1);
            }
            result.push(text);
        }
        return result;
    }

    // =============================================================================
    // MODEL DETECTION
    // =============================================================================

    // Regex to match "Assistant A" or "Assistant B" labels
    const ASSISTANT_LABEL_REGEX = /^Assistant\s+([AB])\b/i;

    // Pattern for model names: alphanumeric with hyphens/dots, no spaces, reasonable length
    // Examples: gpt-4o, claude-3.5-sonnet, ppl-sonar-pro-high, gemini-2.5-pro-grounding
    const MODEL_NAME_PATTERN = /^[a-zA-Z][\w\-\.]*[\w]$/;

    function isModelName(text) {
        if (!text) return false;
        const firstLine = text.trim().split('\n')[0].trim();
        // Model names are typically short identifiers with hyphens/dots, no spaces
        return firstLine.length > 2 && firstLine.length < 60 && 
               !firstLine.includes(' ') && MODEL_NAME_PATTERN.test(firstLine);
    }

    function isAssistantLabel(text) {
        return ASSISTANT_LABEL_REGEX.test(text?.trim() || '');
    }

    function isThoughtPrefix(text) {
        return /^thought for/i.test(text?.trim() || '');
    }

    function extractModelName(column) {
        if (!column) return 'Unknown';

        const lines = (column.innerText?.trim() || '').split('\n');

        // Check first 5 lines for model name or assistant label
        for (let i = 0; i < Math.min(5, lines.length); i++) {
            const line = lines[i].trim();
            if (!line || isThoughtPrefix(line)) continue;

            // Check for "Assistant A/B" label
            const assistantMatch = line.match(ASSISTANT_LABEL_REGEX);
            if (assistantMatch) return `Model ${assistantMatch[1]}`;

            // Check if line looks like a model name (short identifier with hyphens/dots)
            if (MODEL_NAME_PATTERN.test(line) && line.length < 60) {
                return line;
            }
        }

        return 'Unknown';
    }

    // =============================================================================
    // DOM EXTRACTION
    // =============================================================================

    /** Extract clean response text from a column element */
    function extractColumnText(column) {
        if (!column) return '';

        const clone = column.cloneNode(true);

        // Remove thinking blocks, user bubbles, and hidden elements
        const removeSelectors = [
            ...CONFIG.stripSelectors,
            CONFIG.selectors.userBubble,
            CONFIG.selectors.hidden
        ];

        for (const selector of removeSelectors) {
            try {
                clone.querySelectorAll(selector).forEach(el => el.remove());
            } catch { /* invalid selector */ }
        }

        // Inline citation URLs before extracting text
        inlineCitationLinks(clone);

        // Extract from prose elements
        const proseElements = clone.querySelectorAll(CONFIG.selectors.prose);
        if (proseElements.length > 0) {
            const texts = Array.from(proseElements)
                .map(el => el.innerText?.trim())
                .filter(Boolean);

            const deduplicated = deduplicateTexts(texts);
            if (deduplicated.length > 0) {
                return cleanCitationArtifacts(deduplicated.join('\n\n'));
            }
        }

        // Fallback: use full text, skipping model name lines
        const lines = (clone.innerText || '').split('\n');
        let startIndex = 0;
        for (let i = 0; i < Math.min(5, lines.length); i++) {
            const line = lines[i].trim();
            if (isModelName(line) || isAssistantLabel(line) || isThoughtPrefix(line) || !line) {
                startIndex = i + 1;
            } else {
                break;
            }
        }

        return cleanCitationArtifacts(lines.slice(startIndex).join('\n').trim());
    }

    // Cache for extracted column text
    const textCache = new WeakMap();

    function getCachedText(column) {
        if (!column) return '';
        if (!textCache.has(column)) {
            textCache.set(column, extractColumnText(column));
        }
        return textCache.get(column);
    }

    /** Extract user prompts from the page */
    function extractUserPrompts() {
        const seen = new Set();
        const prompts = [];

        for (const bubble of document.querySelectorAll(CONFIG.selectors.userBubble)) {
            const text = bubble.innerText?.trim();
            if (!text || text.length < 3 || seen.has(text)) continue;
            if (/^(Winner:|1\.\s*Winner|Vote|Regenerate)/i.test(text)) continue;
            if (text.split(/\s+/).length <= 2 && isModelName(text)) continue;

            seen.add(text);
            prompts.push(text);
        }

        return prompts.reverse(); // DOM is reverse-chronological
    }

    // =============================================================================
    // TURN DETECTION
    // =============================================================================

    /**
     * Find all response turn containers.
     * Returns array of { colA, colB, domIndex, chronIndex, type }
     * Type: 'complete' | 'voted' | 'incomplete'
     */
    function findAllTurns() {
        let containers = Array.from(document.querySelectorAll(CONFIG.selectors.responseContainer));

        // Fallback if primary selector fails
        if (containers.length === 0) {
            log('Primary selector failed, trying fallback...');
            containers = Array.from(document.querySelectorAll('[class*="flex"]')).filter(el => {
                if (el.children.length < 1 || el.children.length > 2) return false;
                const text = el.innerText || '';
                return text.length > 200 && (isModelName(text) || isThoughtPrefix(text));
            });
        }

        const turns = [];

        for (let i = 0; i < containers.length; i++) {
            const container = containers[i];
            const children = Array.from(container.children);

            if (children.length === 0) continue;
            if (!children.some(c => (c.innerText?.length || 0) > 5)) continue;

            // Skip user bubbles
            const hasUserBubble = children.some(c => {
                try { return c.matches?.(CONFIG.selectors.userBubble); }
                catch { return false; }
            });
            if (hasUserBubble) continue;

            const text0 = children[0]?.innerText?.slice(0, 150) || '';
            const isModel0 = isModelName(text0) || isAssistantLabel(text0) || isThoughtPrefix(text0);

            if (children.length === 2) {
                const text1 = children[1]?.innerText?.slice(0, 150) || '';
                const isModel1 = isModelName(text1) || isAssistantLabel(text1) || isThoughtPrefix(text1);
                const len0 = children[0]?.innerText?.length || 0;
                const len1 = children[1]?.innerText?.length || 0;

                if (isModel0 || isModel1 || (len0 > 500 && len1 > 500)) {
                    turns.push({ colA: children[0], colB: children[1], domIndex: i, type: 'complete' });
                }
            } else if (children.length === 1) {
                const hasSpinner = container.querySelector(CONFIG.selectors.spinner);

                if (isModel0 && !hasSpinner) {
                    turns.push({ colA: children[0], colB: null, domIndex: i, type: 'voted' });
                } else if (hasSpinner) {
                    turns.push({ colA: children[0], colB: null, domIndex: i, type: 'incomplete' });
                }
            }
        }

        // Sort by DOM order then reverse for chronological (oldest first)
        turns.sort((a, b) => a.domIndex - b.domIndex);
        turns.reverse();
        turns.forEach((turn, i) => { turn.chronIndex = i; });

        return turns;
    }

    /** Get the last complete turn for evaluation */
    function getLastCompleteTurn() {
        const allTurns = findAllTurns();
        const complete = allTurns.filter(t => t.type === 'complete');

        if (complete.length === 0) return null;

        const last = complete[complete.length - 1];
        return {
            ...last,
            totalTurns: allTurns.length,
            turnIndex: last.chronIndex
        };
    }

    // =============================================================================
    // JUDGE PROMPT GENERATION
    // =============================================================================

    function generateJudgePrompt(prompts, responseA, responseB, modelA, modelB, turnIndex, allTurnsData, generatedTitle = null) {
        const completeTurns = findAllTurns().filter(t => t.type === 'complete').length;
        const currentPrompt = prompts[turnIndex] || '[NO PROMPT DETECTED]';

        // Build title line if we have one
        const titleLine = generatedTitle ? `${generatedTitle}\n\n` : '';

        // Detect if models changed between turns
        const modelsChanged = allTurnsData?.some((turn, i) => {
            if (i === 0 || i >= turnIndex) return false;
            const prev = allTurnsData[i - 1];
            return turn.modelA !== prev.modelA || turn.modelB !== prev.modelB;
        });

        // Build conversation history for multi-turn
        let historySection = '';
        if (turnIndex > 0 && allTurnsData?.length > 0) {
            const parts = [];

            for (let i = 0; i < turnIndex; i++) {
                const prompt = prompts[i] || '[PROMPT NOT CAPTURED]';
                const turn = allTurnsData[i];

                let section = `### Turn ${i + 1} - User Prompt\n${prompt}`;

                if (turn) {
                    const isHiddenB = !turn.responseB || turn.responseB.includes('[HIDDEN');
                    if (isHiddenB) {
                        section += `\n\n[NOTE: This turn was already voted on. The second model's response is hidden.]`;
                    }
                    section += `\n\n### Turn ${i + 1} - ${turn.modelA} Response\n${turn.responseA || '[NO RESPONSE]'}`;
                    section += `\n\n### Turn ${i + 1} - ${turn.modelB} Response\n${turn.responseB || '[NO RESPONSE]'}`;
                }
                parts.push(section);
            }

            if (parts.length > 0) {
                let historyNote = '';
                if (modelsChanged) {
                    historyNote = '\n_Note: Different models responded in earlier turns. The history below is for context only._\n';
                }
                historySection = `## Full Conversation History${historyNote}\n"""\n${parts.join('\n\n---\n\n')}\n"""\n\n`;
            }
        }

        const turnLabel = turnIndex > 0 ? `Current Turn Being Evaluated (Turn ${turnIndex + 1})` : 'User Prompt';

        // Note about incomplete turns
        let incompleteNote = '';
        if (prompts.length > completeTurns) {
            const pending = prompts.length - completeTurns;
            const nextPrompt = prompts[completeTurns];
            const truncated = nextPrompt?.length > 150 ? nextPrompt.slice(0, 150) + '...' : nextPrompt || '[unknown]';
            incompleteNote = `\n\n_Note: Battle still in progress — ${pending} additional prompt(s) awaiting responses. Next prompt: "${truncated}"_\n`;
        }

        return `${titleLine}You are an extremely critical, world-class evaluator of LLM outputs. Be precise and unsparing.

${historySection}## ${turnLabel}
"""
${currentPrompt}
"""

## Model Response from ${modelA}
"""
${responseA || '[NO RESPONSE]'}
"""

## Model Response from ${modelB}
"""
${responseB || '[NO RESPONSE]'}
"""${incompleteNote}

## Your Evaluation Task

**Evaluate**: ${modelA} vs ${modelB} on Turn ${turnIndex + 1} only. Prior turns provide context but are not being judged.

**Winner**: State winner ${modelA}, ${modelB}, or "Tie".
- Choose "Tie" when both models largely agree on the facts and key conclusions.
- Prioritize **factual correctness** above all else—good structure without a factual basis is useless.

**Justification**: Provide a concise justification (2-4 sentences) focusing on key differences.

**Critical Analysis**: Explain precisely why, identifying:
- Factual errors or hallucinations in either response (attempt to verify claims where possible)
- Logical flaws or gaps in reasoning
- Missing information the prompt requested
- Unnecessary verbosity or filler
- Tone/style/formatting issues

**Deeper Comparison**:
- Which showed deeper reasoning vs. surface-level response?
- Which had more original insight vs. generic answers?
- Which was better structured and clearer?

**Prompt Improvement** (Optional): If the original user prompt has significant issues that may have confused the models or led to poor responses, suggest a revised prompt that would be more effective. Explain your changes.

---
_Generated by LMArena Judge v${VERSION} on ${new Date().toISOString().split('T')[0]}_`;
    }

    // =============================================================================
    // DEBUG OUTPUT
    // =============================================================================

    function generateDebugOutput() {
        const allTurns = findAllTurns();
        const currentTurn = getLastCompleteTurn();
        const prompts = extractUserPrompts();
        const containers = document.querySelectorAll(CONFIG.selectors.responseContainer);

        const completeTurns = allTurns.filter(t => t.type === 'complete');
        const votedTurns = allTurns.filter(t => t.type === 'voted');
        const incompleteTurns = allTurns.filter(t => t.type === 'incomplete');

        return JSON.stringify({
            meta: {
                version: VERSION,
                timestamp: new Date().toISOString(),
                url: window.location.href
            },

            summary: {
                completeTurns: completeTurns.length,
                votedTurns: votedTurns.length,
                incompleteTurns: incompleteTurns.length,
                promptsFound: prompts.length,
                aligned: prompts.length === completeTurns.length
            },

            currentEval: currentTurn ? {
                turnIndex: currentTurn.turnIndex,
                modelA: extractModelName(currentTurn.colA),
                modelB: extractModelName(currentTurn.colB),
                responseALength: getCachedText(currentTurn.colA).length,
                responseBLength: getCachedText(currentTurn.colB).length
            } : null,

            prompts: prompts.map(p => p.slice(0, 200) + (p.length > 200 ? '...' : '')),

            turns: allTurns.map(t => ({
                chronIndex: t.chronIndex,
                domIndex: t.domIndex,
                type: t.type,
                modelA: extractModelName(t.colA),
                modelB: t.colB ? extractModelName(t.colB) : '[HIDDEN]',
                responseALength: getCachedText(t.colA).length,
                responseBLength: t.colB ? getCachedText(t.colB).length : 0,
                preview: getCachedText(t.colA).slice(0, 100)
            })),

            containers: Array.from(containers).slice(0, 10).map((c, i) => ({
                index: i,
                childCount: c.children.length,
                childLengths: Array.from(c.children).map(el => el.innerText?.length || 0),
                firstChars: Array.from(c.children).map(el => (el.innerText?.slice(0, 80) || '').replace(/\n/g, ' '))
            })),

            config: {
                selectors: CONFIG.selectors,
                stripSelectors: CONFIG.stripSelectors
            }
        }, null, 2);
    }

    // =============================================================================
    // UI
    // =============================================================================

    function createButtons() {
        if (document.getElementById(CONFIG.buttonContainerId)) return;

        log('Creating buttons...');

        const container = document.createElement('div');
        container.id = CONFIG.buttonContainerId;
        container.style.cssText = 'position:fixed;top:10px;right:20px;z-index:10000;display:flex;gap:8px;';

        const buttonStyle = 'padding:8px 14px;font-size:13px;color:white;border:none;border-radius:4px;cursor:pointer;';

        // Judge button
        const judgeBtn = document.createElement('button');
        judgeBtn.textContent = `Judge v${VERSION}`;
        judgeBtn.style.cssText = buttonStyle + 'background:#6366f1;';

        judgeBtn.addEventListener('click', async () => {
            const turn = getLastCompleteTurn();
            if (!turn) {
                alert('No battle responses found. Make sure both models have responded.');
                return;
            }

            const prompts = extractUserPrompts();
            const allTurns = findAllTurns();

            // Try to generate a title using Prompt API
            let generatedTitle = null;
            if (prompts.length > 0) {
                judgeBtn.textContent = 'Generating...';
                generatedTitle = await generateTitleWithPromptAPI(prompts[0]);
            }

            const turnsData = allTurns.map(t => ({
                modelA: extractModelName(t.colA),
                modelB: t.colB ? extractModelName(t.colB) : '[HIDDEN]',
                responseA: getCachedText(t.colA),
                responseB: t.colB ? getCachedText(t.colB) : '[HIDDEN - vote already cast]'
            }));

            const judgePrompt = generateJudgePrompt(
                prompts,
                getCachedText(turn.colA),
                getCachedText(turn.colB),
                extractModelName(turn.colA),
                extractModelName(turn.colB),
                turn.turnIndex,
                turnsData,
                generatedTitle
            );

            judgeBtn.textContent = `Judge v${VERSION}`;
            copyToClipboard(judgePrompt, judgeBtn, `Judge v${VERSION}`, '#6366f1');
        });

        // Debug button
        const debugBtn = document.createElement('button');
        debugBtn.textContent = 'Debug';
        debugBtn.style.cssText = buttonStyle + 'background:#666;';

        debugBtn.addEventListener('click', () => {
            const output = generateDebugOutput();
            copyToClipboard(output, debugBtn, 'Debug', '#666');
        });

        container.appendChild(judgeBtn);
        container.appendChild(debugBtn);
        document.body.appendChild(container);
    }

    // =============================================================================
    // INITIALIZATION
    // =============================================================================

    let debounceTimeout = null;

    function debouncedCreateButtons() {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(createButtons, CONFIG.debounceMs);
    }

    // Initial setup
    log('Initializing...');
    createButtons();

    const observer = new MutationObserver(debouncedCreateButtons);
    observer.observe(document.body, { childList: true, subtree: true });

    // Cleanup on page unload
    window.addEventListener('unload', () => {
        observer.disconnect();
        clearTimeout(debounceTimeout);
    });

    log('Ready');
})();
