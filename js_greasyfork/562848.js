// ==UserScript==
// @name         JanitorAI Pronoun Neutralizer (Vibe Coded) - Turns They/Them to He/Him or She/Her
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  Converts they/them to he/him or she/her. Draggable UI, auto-save location, and hover-expand effects.
// @author       You
// @match        *://janitorai.com/*
// @match        *://*.janitorai.com/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562848/JanitorAI%20Pronoun%20Neutralizer%20%28Vibe%20Coded%29%20-%20Turns%20TheyThem%20to%20HeHim%20or%20SheHer.user.js
// @updateURL https://update.greasyfork.org/scripts/562848/JanitorAI%20Pronoun%20Neutralizer%20%28Vibe%20Coded%29%20-%20Turns%20TheyThem%20to%20HeHim%20or%20SheHer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration & State ---
    const UI_ID = 'janitor-neutralizer-ui-v7';
    const STORAGE_KEY = 'janitor_neutralizer_data_v7';

    let state = {
        top: '80px',
        left: 'auto',
        right: '20px',
        targetGender: 'M', // 'M' or 'F'
        ultraAggressive: false
    };

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) { state = { ...state, ...JSON.parse(saved) }; }

    const saveState = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    // --- Grammar Logic ---
    const strictPlurals = [
        'people', 'children', 'kids', 'parents', 'siblings', 'friends', 'enemies',
        'users', 'members', 'students', 'staff', 'teachers', 'audience', 'crowd',
        'team', 'group', 'couple', 'pair', 'relatives', 'folks', 'others', 'men', 'women'
    ];

    function isProbablyGrammatical(fullText, index) {
        if (state.ultraAggressive) return false;
        const start = Math.max(0, index - 50);
        const contextClean = fullText.substring(start, index).replace(/["*'_]/g, ' ').toLowerCase();
        
        for (const plural of strictPlurals) { 
            if (contextClean.slice(-25).includes(plural)) return true; 
        }
        
        const indicators = ['either of', 'neither of', 'both of', 'two of', 'all of'];
        if (indicators.some(i => contextClean.includes(i))) return true;
        
        return false;
    }

    // --- Regex Factory ---
    function getRegexMap() {
        const M = { sub: 'he', obj: 'him', pos: 'his', poss: 'his', ref: 'himself' };
        const F = { sub: 'she', obj: 'her', pos: 'her', poss: 'hers', ref: 'herself' };
        const T = state.targetGender === 'M' ? M : F;
        const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

        return [
            { reg: /\b(They)\b/g, rep: cap(T.sub) }, { reg: /\b(they)\b/g, rep: T.sub },
            { reg: /\b(Them)\b/g, rep: cap(T.obj) }, { reg: /\b(them)\b/g, rep: T.obj },
            { reg: /\b(Their)\b/g, rep: cap(T.pos) }, { reg: /\b(their)\b/g, rep: T.pos },
            { reg: /\b(Theirs)\b/g, rep: cap(T.poss) }, { reg: /\b(theirs)\b/g, rep: T.poss },
            { reg: /\b(Themselves)\b/g, rep: cap(T.ref) }, { reg: /\b(themselves)\b/g, rep: T.ref }
        ];
    }

    // --- Replacement Logic (Inputs) ---
    function processInputs() {
        let changes = 0;
        const map = getRegexMap();
        
        document.querySelectorAll('textarea, input[type="text"]').forEach(el => {
            let newText = el.value;
            let elChanges = 0;
            
            map.forEach(({ reg, rep }) => {
                newText = newText.replace(reg, (match, offset) => {
                    if (isProbablyGrammatical(el.value, offset)) return match;
                    elChanges++;
                    return rep;
                });
            });

            if (newText !== el.value) {
                el.value = newText;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                changes += elChanges;
            }
        });
        return changes;
    }

    // --- Replacement Logic (Text Nodes with Highlighting) ---
    function processTextNodes() {
        let changes = 0;
        const map = getRegexMap();
        
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
            acceptNode: (node) => {
                const tag = node.parentNode.tagName;
                if (['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'BUTTON'].includes(tag)) return NodeFilter.FILTER_REJECT;
                // Don't process nodes we've already highlighted
                if (node.parentNode.classList.contains('neu-highlight')) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        }, false);

        const nodesToProcess = [];
        let node;
        while (node = walker.nextNode()) {
            if (node.nodeValue.match(/they|them|their/i)) {
                nodesToProcess.push(node);
            }
        }

        // Process strictly in reverse to avoid DOM shifting issues
        for (let i = nodesToProcess.length - 1; i >= 0; i--) {
            const originalNode = nodesToProcess[i];
            const text = originalNode.nodeValue;
            
            // We find the FIRST match, replace it, highlight it, and stop processing this node 
            // (The loop will catch the rest on the next click or we rely on recursion, but simple is better here)
            let matchFound = false;

            for (const { reg, rep } of map) {
                // Reset regex state
                reg.lastIndex = 0; 
                const matchArr = reg.exec(text);
                
                if (matchArr) {
                    const matchIndex = matchArr.index;
                    const matchStr = matchArr[0];

                    if (isProbablyGrammatical(text, matchIndex)) continue;

                    // 1. Cut text before
                    const beforeText = text.substring(0, matchIndex);
                    // 2. The replacement
                    const replacementText = rep;
                    // 3. Cut text after
                    const afterText = text.substring(matchIndex + matchStr.length);

                    const fragment = document.createDocumentFragment();
                    
                    if (beforeText) fragment.appendChild(document.createTextNode(beforeText));
                    
                    // Create the Highlight Span
                    const span = document.createElement('span');
                    span.textContent = replacementText;
                    span.className = 'neu-highlight';
                    span.style.cssText = `
                        background-color: #2ea043;
                        color: #fff;
                        border-radius: 4px;
                        padding: 0 2px;
                        transition: background-color 1.5s ease, color 0.5s ease;
                    `;
                    fragment.appendChild(span);
                    
                    if (afterText) fragment.appendChild(document.createTextNode(afterText));

                    originalNode.parentNode.replaceChild(fragment, originalNode);
                    
                    // Trigger Fade out
                    setTimeout(() => {
                        span.style.backgroundColor = 'transparent';
                        span.style.color = 'inherit';
                    }, 50);

                    changes++;
                    matchFound = true;
                    break; // Move to next node, don't try to double replace on same node instance in one pass
                }
            }
        }
        return changes;
    }

    // --- UI Logic ---
    function createUI() {
        if (document.getElementById(UI_ID)) return;

        const container = document.createElement('div');
        container.id = UI_ID;
        container.style.cssText = `
            position: fixed;
            top: ${state.top};
            left: ${state.left};
            right: ${state.right};
            z-index: 999999;
            display: flex;
            align-items: center;
            gap: 8px;
            font-family: 'Segoe UI', sans-serif;
            transform: scale(0.8);
            opacity: 0.5;
            transition: transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28), opacity 0.3s ease;
            transform-origin: center right;
        `;

        const btn = document.createElement('div');
        btn.textContent = 'Neutralize';
        btn.style.cssText = `
            padding: 8px 16px;
            background: rgba(20, 20, 20, 0.9);
            backdrop-filter: blur(8px);
            color: #fff;
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 99px;
            cursor: pointer;
            font-weight: 600;
            font-size: 13px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            user-select: none;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            min-width: 80px;
        `;

        const panel = document.createElement('div');
        panel.style.cssText = `
            position: absolute;
            top: 45px;
            right: 0;
            background: rgba(25, 25, 25, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid #444;
            padding: 12px;
            border-radius: 12px;
            display: none;
            flex-direction: column;
            gap: 10px;
            min-width: 160px;
            color: #ddd;
            font-size: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.6);
        `;

        panel.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <span>Target</span>
                <span id="gender-label" style="font-weight:bold; color: ${state.targetGender === 'M' ? '#6ab0f3' : '#f36aae'}">
                    ${state.targetGender === 'M' ? 'He/Him' : 'She/Her'}
                </span>
            </div>
            <div style="display:flex; background:#333; border-radius:4px; padding:2px;">
                <button id="btn-male" style="flex:1; border:none; background:${state.targetGender === 'M' ? '#444' : 'transparent'}; color:${state.targetGender === 'M' ? '#fff' : '#888'}; cursor:pointer; padding:4px; border-radius:3px;">♂</button>
                <button id="btn-female" style="flex:1; border:none; background:${state.targetGender === 'F' ? '#444' : 'transparent'}; color:${state.targetGender === 'F' ? '#fff' : '#888'}; cursor:pointer; padding:4px; border-radius:3px;">♀</button>
            </div>
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer; margin-top:5px;">
                <input type="checkbox" id="chk-aggro" ${state.ultraAggressive ? 'checked' : ''}>
                <span>Ultra Aggressive</span>
            </label>
        `;

        // --- Event Logic ---
        let isDragging = false;
        let startX, startY;
        let uiX = 0, uiY = 0;
        let collapseTimer;

        // Hover
        container.addEventListener('mouseenter', () => {
            clearTimeout(collapseTimer);
            container.style.opacity = '1';
            container.style.transform = isDragging ? container.style.transform : `scale(1) translate3d(${uiX}px, ${uiY}px, 0)`;
            panel.style.display = 'flex';
        });

        container.addEventListener('mouseleave', () => {
            collapseTimer = setTimeout(() => {
                panel.style.display = 'none';
                container.style.opacity = '0.5';
                container.style.transform = `scale(0.8) translate3d(${uiX}px, ${uiY}px, 0)`;
            }, 600); // Faster collapse (600ms)
        });

        // Dragging
        container.addEventListener('mousedown', (e) => {
            if(e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
            isDragging = false;
            startX = e.clientX;
            startY = e.clientY;
            
            // DISABLE transition for instant follow
            container.style.transition = 'none'; 

            const onMove = (mv) => {
                const dx = mv.clientX - startX;
                const dy = mv.clientY - startY;
                
                if (Math.abs(dx) > 3 || Math.abs(dy) > 3) isDragging = true;
                
                if (isDragging) {
                    mv.preventDefault();
                    uiX = dx; 
                    uiY = dy;
                    container.style.transform = `scale(1) translate3d(${dx}px, ${dy}px, 0)`;
                }
            };

            const onUp = () => {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
                
                // Re-enable transition for hover effects
                container.style.transition = 'transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28), opacity 0.3s ease';

                if (isDragging) {
                    const rect = container.getBoundingClientRect();
                    state.top = rect.top + 'px';
                    state.left = rect.left + 'px';
                    state.right = 'auto';
                    saveState();
                    
                    container.style.top = state.top;
                    container.style.left = state.left;
                    container.style.right = 'auto';
                    uiX = 0; uiY = 0;
                    container.style.transform = `scale(1)`;
                }
            };

            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        });

        // Click Action
        btn.addEventListener('click', (e) => {
            if (isDragging) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            
            let count = processInputs();
            count += processTextNodes();

            const originalText = btn.textContent;
            btn.textContent = count > 0 ? `Fixed ${count}` : 'Clean';
            
            // Visual feedback on button
            btn.style.borderColor = count > 0 ? '#4caf50' : 'rgba(255,255,255,0.15)';
            btn.style.color = count > 0 ? '#4caf50' : '#fff';
            btn.style.boxShadow = count > 0 ? '0 0 15px rgba(76, 175, 80, 0.5)' : '0 4px 15px rgba(0,0,0,0.4)';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                btn.style.color = '#fff';
                btn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.4)';
            }, 1000);
        });

        container.appendChild(btn);
        container.appendChild(panel);
        document.body.appendChild(container);

        // Binding
        const lbl = document.getElementById('gender-label');
        const bM = document.getElementById('btn-male');
        const bF = document.getElementById('btn-female');
        const updateGender = (g) => {
            state.targetGender = g;
            saveState();
            lbl.textContent = g === 'M' ? 'He/Him' : 'She/Her';
            lbl.style.color = g === 'M' ? '#6ab0f3' : '#f36aae';
            bM.style.background = g === 'M' ? '#444' : 'transparent';
            bF.style.background = g === 'F' ? '#444' : 'transparent';
            bM.style.color = g === 'M' ? '#fff' : '#888';
            bF.style.color = g === 'F' ? '#fff' : '#888';
        };
        bM.onclick = () => updateGender('M');
        bF.onclick = () => updateGender('F');
        document.getElementById('chk-aggro').onchange = (e) => {
            state.ultraAggressive = e.target.checked;
            saveState();
        };
    }

    setInterval(() => {
        if (!document.getElementById(UI_ID) && document.body) createUI();
    }, 1000);

})();