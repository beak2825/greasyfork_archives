// ==UserScript==
// @name         仿M浏览器元素审查
// @namespace    https://viayoo.com/81gzxv
// @version      1.9
// @description  利用AI模仿并生成M浏览器的元素审查。整合弹性选取逻辑与深度AD规则生成。
// @author       Via && Gemini
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @license       MIT
// @icon         data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/562372/%E4%BB%BFM%E6%B5%8F%E8%A7%88%E5%99%A8%E5%85%83%E7%B4%A0%E5%AE%A1%E6%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/562372/%E4%BB%BFM%E6%B5%8F%E8%A7%88%E5%99%A8%E5%85%83%E7%B4%A0%E5%AE%A1%E6%9F%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isDebugMode = false;
    let isPicking = false;
    let isCollapsed = false;
    let currentTarget = null;
    let activePreviewStyle = null;

    GM_addStyle(`
        #mb-debug-panel {
            position: fixed; left: 0; bottom: 0; width: 100%; height: 50%;
            background: #fff !important; z-index: 2147483647 !important; 
            display: none; flex-direction: column; box-shadow: 0 -2px 15px rgba(0,0,0,0.3);
            font-family: sans-serif !important; border-top: 1px solid #ccc;
            transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        #mb-main-stage { display: flex; width: 200%; height: calc(100% - 40px); transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .mb-page { width: 50%; height: 100%; display: flex; flex-direction: column; overflow: hidden; }
        #mb-debug-header { display: flex; align-items: center; background: #f1f1f1; padding: 0 12px; height: 40px; border-bottom: 1px solid #ddd; flex-shrink: 0; overflow-x: auto; white-space: nowrap; }
        #mb-debug-header::-webkit-scrollbar { display: none; }
        .mb-tool-btn { margin-right: 18px; cursor: pointer; color: #333; font-size: 14px; user-select: none; flex-shrink: 0; }
        .mb-tool-btn.active { color: #ff4757 !important; font-weight: bold; }
        #mb-btn-close { margin-left: auto; font-size: 18px; margin-right: 0; color: #666; }
        #mb-debug-content, #mb-ad-content { flex: 1; overflow: auto; padding: 10px; background: #fff !important; }
        
        .ad-rule-item { background: #fdfdfd; border: 1px solid #eee; border-radius: 6px; padding: 12px; margin-bottom: 15px; }
        .ad-rule-display { display: block; word-break: break-all; font-weight: bold; margin-bottom: 10px; font-size: 14px; line-height: 1.4; font-family: monospace; }
        .hl-domain { color: #ff8c00; }
        .hl-sep { color: #007bff; }
        .hl-selector { color: #808080; }
        .hl-url { color: #ff0000; }

        .ad-action-bar { display: flex; flex-wrap: wrap; gap: 8px; }
        .ad-mini-btn { padding: 5px 12px; font-size: 12px; border: 1px solid #ddd; background: #fff; cursor: pointer; border-radius: 4px; color: #333; }
        
        .mb-inspect-hl { outline: 2px dashed #ff4757 !important; outline-offset: 2px !important; background: rgba(255, 71, 87, 0.1) !important; }
        .node-wrapper { margin-left: 14px; border-left: 1px solid #f0f0f0; font-family: monospace; }
        .node-row { padding: 2px 4px; cursor: pointer; white-space: pre-wrap; word-break: break-all; display: flex; }
        .node-row.selected { background: #dceeff; outline: 1px solid #1e90ff; }
        .toggle-btn { width: 18px; flex-shrink: 0; text-align: center; font-size: 10px; color: #999; cursor: pointer; }
        body.mb-picking-mode { cursor: crosshair !important; }
    `);

    const panel = document.createElement('div');
    panel.id = 'mb-debug-panel';
    panel.innerHTML = `
        <div id="mb-debug-header">
            <span class="mb-tool-btn" id="mb-btn-pick">🎯 选取</span>
            <span class="mb-tool-btn" id="mb-btn-fold">收起</span>
            <span class="mb-tool-btn" id="mb-btn-back" style="display:none;">⬅ 返回</span>
            <span class="mb-tool-btn" id="mb-btn-copy-html">H (复制)</span>
            <span class="mb-tool-btn" id="mb-btn-parent">父</span>
            <span class="mb-tool-btn" id="mb-btn-restore">恢复</span>
            <span class="mb-tool-btn" id="mb-btn-to-ad" style="color:#d11; font-weight:bold;">AD 规则</span>
            <span class="mb-tool-btn" id="mb-btn-close">✕</span>
        </div>
        <div id="mb-main-stage">
            <div class="mb-page" id="page-dom"><div id="mb-debug-content"></div></div>
            <div class="mb-page" id="page-ad"><div id="mb-ad-content"></div></div>
        </div>
    `;
    document.body.appendChild(panel);

    const domContent = document.getElementById('mb-debug-content');
    const adContent = document.getElementById('mb-ad-content');
    const stage = document.getElementById('mb-main-stage');
    const btnPick = document.getElementById('mb-btn-pick');
    const btnFold = document.getElementById('mb-btn-fold');

    function updateFoldState() {
        if (isCollapsed) {
            panel.style.height = '40px';
            btnFold.innerText = '展开';
        } else {
            panel.style.height = '50%';
            btnFold.innerText = '收起';
        }
    }

    function startPicking() {
        isPicking = true;
        btnPick.classList.add('active');
        document.body.classList.add('mb-picking-mode');
    }

    function stopPicking() {
        isPicking = false;
        btnPick.classList.remove('active');
        document.body.classList.remove('mb-picking-mode');
    }

    function togglePanel(show) {
        isDebugMode = show;
        panel.style.display = show ? 'flex' : 'none';
        if (show) {
            document.body.style.paddingBottom = '50vh';
            isCollapsed = false;
            updateFoldState();
            startPicking();
        } else {
            document.body.style.paddingBottom = '';
            stopPicking();
            if (currentTarget) currentTarget.classList.remove('mb-inspect-hl');
        }
    }

    function highlightAdRule(rule) {
        const match = rule.match(/^(.*?)(###?)(.*)$/);
        if (!match) return `<span>${rule}</span>`;
        let rest = match[3].replace(/("(.*?)")/g, '<span class="hl-url">"$2"</span>');
        return `<span class="hl-domain">${match[1]}</span><span class="hl-sep">${match[2]}</span><span class="hl-selector">${rest}</span>`;
    }

    function generateSmartRules(el) {
        const domain = window.location.hostname;
        const tagName = el.tagName.toLowerCase();
        let rules = [];
        const isInvalid = (str) => /^[:\d]/.test(str) || str.includes(':');
        if (el.id && !isInvalid(el.id)) {
            rules.push(`${domain}###${el.id}`);
        }
        const classList = Array.from(el.classList).filter(c =>
            !/\d{5,}/.test(c) && c.length < 30 && c !== 'mb-inspect-hl' && !isInvalid(c)
        );
        if (classList.length > 0) {
            classList.forEach(c => rules.push(`${domain}##.${c}`));
            if (classList.length >= 2) rules.push(`${domain}##.${classList.slice(0, 2).join('.')}`);
            if (classList.length >= 3) rules.push(`${domain}##.${classList.join('.')}`);
        }
        let attrRules = [];
        let sizeBundle = "";
        for (let attr of el.attributes) {
            if (['id', 'class', 'style'].includes(attr.name)) continue;
            let val = attr.value;
            if (!val) continue;
            if (['width', 'height'].includes(attr.name)) {
                sizeBundle += `[${attr.name}="${val}"]`;
                continue;
            }
            if (val.startsWith('data:')) {
                const b64 = val.match(/^data:[^;]+;base64,/);
                if (b64) {
                    attrRules.push(`${tagName}[${attr.name}^="${b64[0]}"]`);
                    continue;
                }
            }
            if (/^(https?:|)\/\//.test(val)) {
                const urlMatch = val.match(/^((?:https?:|)\/\/[^\/]+\/)/);
                if (urlMatch) {
                    attrRules.push(`${tagName}[${attr.name}^="${urlMatch[1]}"]`);
                } else {
                    attrRules.push(`${tagName}[${attr.name}="${val}"]`);
                }
            } else {
                if (val.length > 180) {
                    attrRules.push(`${tagName}[${attr.name}^="${val.substring(0, 30)}"]`);
                } else {
                    attrRules.push(`${tagName}[${attr.name}="${val}"]`);
                }
            }
        }
        if (sizeBundle) {
            rules.push(`${domain}##${tagName}${sizeBundle}`);
        }
        attrRules.forEach(r => rules.push(`${domain}##${r}`));
        rules = [...new Set(rules)];
        rules.sort((a, b) => {
            const getWeight = (s) => {
                if (/ad/i.test(s)) return 1;
                if (s.includes('[src') || s.includes('[href') || s.includes('[data-src')) return 2;
                if (s.includes('[width') || s.includes('[height')) return 3;
                if (s.includes('###') || (s.includes('##.') && !s.includes('['))) return 4;
                return 5;
            };
            const weightA = getWeight(a);
            const weightB = getWeight(b);
            if (weightA !== weightB) return weightA - weightB;
            return a.length - b.length;
        });
        const genericTags = ['div', 'span', 'p', 'li', 'ul', 'ins', 'section', 'article'];
        return rules.filter(r => {
            const selector = r.split(/###?/)[1];
            return !genericTags.includes(selector);
        });
    }

    function renderAdPage() {
        adContent.innerHTML = '';
        if (!currentTarget) return;
        const rules = generateSmartRules(currentTarget);
        if (rules.length === 0) {
            adContent.innerHTML = '<div style="color:#999;padding:20px;">该元素特征不足，未生成自动规则。</div>';
        }
        rules.forEach(ruleText => {
            let currentRule = ruleText;
            const originalRule = ruleText;
            const item = document.createElement('div');
            item.className = 'ad-rule-item';
            const updateUI = (isEditing = false) => {
                item.innerHTML = `
                    <div class="ad-rule-display" ${isEditing ? 'contenteditable="true" style="border:1px solid #007bff; padding:5px; outline:none; background:#fff;"' : ''}>${isEditing ? currentRule : highlightAdRule(currentRule)}</div>
                    <div class="ad-action-bar">
                        ${isEditing ? `
                            <button class="ad-mini-btn btn-save" style="background:#28a745; color:#fff; border:none;">保存</button>
                            <button class="ad-mini-btn btn-undo">撤销</button>
                        ` : `
                            <button class="ad-mini-btn btn-copy">复制</button>
                            <button class="ad-mini-btn btn-pre">预览执行</button>
                            <button class="ad-mini-btn btn-res">恢复单条</button>
                            <button class="ad-mini-btn btn-edit">编辑</button>
                        `}
                    </div>
                `;
                if (isEditing) {
                    const display = item.querySelector('.ad-rule-display');
                    setTimeout(() => display.focus(), 10);
                    item.querySelector('.btn-save').onclick = () => {
                        currentRule = display.innerText.trim();
                        updateUI(false);
                    };
                    item.querySelector('.btn-undo').onclick = () => {
                        currentRule = originalRule;
                        updateUI(false);
                    };
                } else {
                    item.querySelector('.btn-copy').onclick = () => {
                        GM_setClipboard(currentRule);
                        alert('已复制');
                    };
                    item.querySelector('.btn-edit').onclick = () => {
                        updateUI(true);
                    };
                    item.querySelector('.btn-pre').onclick = () => {
                        if (activePreviewStyle) activePreviewStyle.remove();
                        activePreviewStyle = document.createElement('style');
                        try {
                            const selector = currentRule.split(/###?/)[1];
                            activePreviewStyle.innerHTML = `${selector} { display: none !important; }`;
                            document.head.appendChild(activePreviewStyle);
                        } catch (e) {
                            alert("语法错误");
                        }
                    };
                    item.querySelector('.btn-res').onclick = () => {
                        if (activePreviewStyle) activePreviewStyle.remove();
                    };
                }
            };
            updateUI();
            adContent.appendChild(item);
        });
    }

    function buildTree(el, isRoot = false) {
        if (!el || el.nodeType !== 1) return null;
        const wrapper = document.createElement('div');
        wrapper.className = 'node-wrapper';
        const row = document.createElement('div');
        const isSelected = el === currentTarget;
        row.className = 'node-row' + (isSelected ? ' selected' : '');
        const hasChildren = el.children.length > 0;
        const arrow = document.createElement('span');
        arrow.className = 'toggle-btn';
        arrow.innerText = (hasChildren && (isRoot || isSelected)) ? '▼' : (hasChildren ? '▶' : ' ');
        row.appendChild(arrow);
        let html = `<span style="color:#881280;font-weight:bold;">&lt;${el.tagName.toLowerCase()}</span>`;
        for (let attr of el.attributes) {
            let val = attr.value;
            if (attr.name === 'class') {
                val = val.replace('mb-inspect-hl', '').trim();
                if (!val) continue;
            }
            html += ` <span style="color:#994500;">${attr.name}=</span><span style="color:#1a1aa6;">"${val}"</span>`;
        }
        html += `<span style="color:#881280;font-weight:bold;">&gt;</span>`;
        const label = document.createElement('span');
        label.innerHTML = html;
        row.appendChild(label);
        wrapper.appendChild(row);
        const cBox = document.createElement('div');
        if (hasChildren && (isRoot || isSelected)) {
            cBox.style.display = 'block';
            Array.from(el.children).forEach(c => {
                const childNode = buildTree(c, false);
                if (childNode) cBox.appendChild(childNode);
            });
        } else {
            cBox.style.display = 'none';
        }
        wrapper.appendChild(cBox);
        arrow.onclick = (e) => {
            e.stopPropagation();
            if (cBox.style.display === 'none') {
                if (cBox.innerHTML === '' && hasChildren) {
                    Array.from(el.children).forEach(c => {
                        const childNode = buildTree(c, false);
                        if (childNode) cBox.appendChild(childNode);
                    });
                }
                cBox.style.display = 'block';
                arrow.innerText = '▼';
            } else {
                cBox.style.display = 'none';
                arrow.innerText = '▶';
            }
        };
        row.onclick = (e) => {
            e.stopPropagation();
            highlight(el);
            renderDOM();
        };
        return wrapper;
    }

    function renderDOM() {
        domContent.innerHTML = '';
        if (!currentTarget) return;
        const parent = currentTarget.parentElement;
        if (parent) {
            domContent.appendChild(buildTree(parent, true));
        } else {
            domContent.appendChild(buildTree(currentTarget, true));
        }
    }

    function highlight(el) {
        if (currentTarget) currentTarget.classList.remove('mb-inspect-hl');
        currentTarget = el;
        currentTarget.classList.add('mb-inspect-hl');
    }

    btnPick.onclick = (e) => {
        e.stopPropagation();
        isPicking ? stopPicking() : startPicking();
    };

    btnFold.onclick = (e) => {
        e.stopPropagation();
        isCollapsed = !isCollapsed;
        updateFoldState();
    };

    document.getElementById('mb-btn-restore').onclick = () => {
        if (activePreviewStyle) {
            activePreviewStyle.remove();
            activePreviewStyle = null;
        }
    };

    document.getElementById('mb-btn-to-ad').onclick = () => {
        if (!currentTarget) return;
        stage.style.transform = 'translateX(-50%)';
        document.getElementById('mb-btn-back').style.display = 'inline';
        renderAdPage();
    };
    document.getElementById('mb-btn-back').onclick = () => {
        stage.style.transform = 'translateX(0)';
        document.getElementById('mb-btn-back').style.display = 'none';
    };
    document.getElementById('mb-btn-close').onclick = () => togglePanel(false);
    document.getElementById('mb-btn-copy-html').onclick = () => {
        if (currentTarget) GM_setClipboard(currentTarget.outerHTML);
    };
    document.getElementById('mb-btn-parent').onclick = () => {
        if (currentTarget && currentTarget.parentElement) {
            highlight(currentTarget.parentElement);
            renderDOM();
        }
    };

    GM_registerMenuCommand("开启审查", () => togglePanel(true));

    const handler = (e) => {
        if (!isDebugMode || !isPicking) return;
        if (panel.contains(e.target)) return;
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (e.type === 'click') {
            highlight(e.target);
            renderDOM();
            if (isCollapsed) {
                isCollapsed = false;
                updateFoldState();
            }
        }
    };
    ['click', 'mousedown', 'mouseup', 'pointerdown'].forEach(type => {
        window.addEventListener(type, handler, true);
    });

})();