// ==UserScript==
// @name         自动点击元素
// @description  在符合正则表达式的网址上自动点击指定的元素
// @namespace    http://tampermonkey.net/
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_addValueChangeListener
// @version      2.4
// @author       Max & Gemini
// @license      MPL2.0
// @icon      data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzNiAzNiI+PHBhdGggZmlsbD0iIzk5QUFCNSIgZD0iTTIwIDIuMDQ3VjJhMiAyIDAgMCAwLTQgMHYuMDQ3QzcuNzM3IDIuNDIyIDYgNS4xMjcgNiA3djE3YzAgNi42MjcgNS4zNzMgMTIgMTIgMTJzMTItNS4zNzMgMTItMTJWN2MwLTEuODczLTEuNzM3LTQuNTc4LTEwLTQuOTUzIi8+PHBhdGggZmlsbD0iIzI5MkYzMyIgZD0iTTIyIDkuMTk5di03YTM2IDM2IDAgMCAwLTItLjE1MVY5YTIgMiAwIDAgMS00IDBWMi4wNDhxLTEuMDY3LjA1MS0yIC4xNTF2N0M3LjQ1OSA5Ljg5IDYgMTIuMjkgNiAxNHYyYzAtMS43MjUgMS40ODItNC4xNTMgOC4xNjktNC44MTlDMTQuNjQ2IDEyLjIyOCAxNi4xNzEgMTMgMTggMTNzMy4zNTUtLjc3MiAzLjgzMS0xLjgxOUMyOC41MTggMTEuODQ3IDMwIDE0LjI3NSAzMCAxNnYtMmMwLTEuNzEtMS40NTktNC4xMS04LTQuODAxIi8+PC9zdmc+
// @downloadURL https://update.greasyfork.org/scripts/552469/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%85%83%E7%B4%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/552469/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%85%83%E7%B4%A0.meta.js
// ==/UserScript==

// --- 新增的独立辅助函数 ---

/**
 * 核心修复：寻找最优点击目标
 * 从被点击的元素开始向上遍历DOM树 寻找一个更稳定、更具代表性的父元素作为规则的目标
 * @param {HTMLElement} element 实际被点击的元素
 * @returns {HTMLElement} 最优的点击目标元素
 */
function findOptimalClickTarget(element) {
    let currentEl = element;
    const interactiveTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'SUMMARY', 'DETAILS'];
    const goodClassKeywords = ['btn', 'button', 'link', 'icon', 'item', 'action', 'nav', 'j-', 'js-', 'wrapper', 'container'];

    while (currentEl && currentEl.tagName !== 'BODY') {
        if (currentEl.id && currentEl.ownerDocument.querySelectorAll('#' + CSS.escape(currentEl.id)).length === 1) {
            return currentEl;
        }
        if (interactiveTags.includes(currentEl.tagName)) {
            return currentEl;
        }
        const role = currentEl.getAttribute('role');
        if (role && ['button', 'link', 'menuitem', 'checkbox', 'switch'].includes(role)) {
            return currentEl;
        }
        const classList = Array.from(currentEl.classList);
        if (classList.some(c => goodClassKeywords.some(k => c.includes(k)))) {
            return currentEl;
        }
        currentEl = currentEl.parentElement;
    }
    return element;
}

function generateSelectorForElement(el) {
    const doc = el.ownerDocument;
    if (el.id) {
        const selector = `#${CSS.escape(el.id)}`;
        if (doc.querySelectorAll(selector).length === 1) {
            return { type: 'css', selector: selector };
        }
    }

    if (el.classList.length > 0) {
        const classSelector = '.' + Array.from(el.classList).map(c => CSS.escape(c)).join('.');
        const selector = el.tagName.toLowerCase() + classSelector;
        if (doc.querySelectorAll(selector).length === 1) {
            return { type: 'css', selector: selector };
        }
    }

    return { type: 'xpath', selector: getXPath(el) };
}

function getXPath(element) {
    const doc = element.ownerDocument;
    if (element.id !== '') {
        if (doc.querySelectorAll(`#${CSS.escape(element.id)}`).length === 1) {
            return `//*[@id="${element.id}"]`;
        }
    }

    if (element === doc.body) return '/html/body';

    let ix = 1;
    let sibling = element.previousElementSibling;
    while (sibling) {
        if (sibling.tagName === element.tagName) {
            ix++;
        }
        sibling = sibling.previousElementSibling;
    }

    return getXPath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + ix + ']';
}


class RuleManager {
    clickRules;

    constructor() {
        this.clickRules = GM_getValue('clickRules', { rules: [] });
    }

    addRule(newRule) {
        this.clickRules.rules.push(newRule);
        this.updateRules();
    }

    updateRule(index, updatedRule) {
        this.clickRules.rules[index] = updatedRule;
        this.updateRules();
    }

    deleteRule(index) {
        this.clickRules.rules.splice(index, 1);
        this.updateRules();
    }

    updateRules() {
        GM_setValue('clickRules', this.clickRules);
    }
}

class WebElementHandler {
    ruleManager;
    clickTaskManager;
    i18n = {
        'zh-CN': {
            title: '设置面板',
            matchingRules: '当前域名规则',
            noMatchingRules: '当前域名下无任何规则',
            addRuleSection: '',
            ruleName: '名称',
            urlPattern: '网址',
            selectorType: '选择器类型',
            selector: '选择器',
            selectValue: '选择框文本',
            selectValuePlaceholder: '填写显示的文本',
            nthElement: '第几个元素',
            clickDelay: '点击延迟 (ms)',
            clickMethod: '点击方法',
            methodNative: 'Native',
            methodPointer: 'PointerEvent',
            simulateHover: '模拟悬停',
            keepClicking: '持续点击',
            ifLinkOpen: '打开链接',
            groupName: '分组名称',
            groupOrder: '顺序',
            groupPlaceholder: '链式点击分组',
            addRule: '新增规则',
            save: '保存',
            delete: '删除',
            ruleNamePlaceholder: '规则名称',
            urlPatternPlaceholder: '网址正则表达式',
            selectorPlaceholder: 'button.submit',
            invalidRegex: '无效的正则表达式',
            invalidSelector: '无效的选择器',
            createRuleByClick: '选择元素',
            selectionMessage: '选择元素',
            autoRuleNamePrefix: '自动创建'
        }
    };

    constructor(ruleManager, clickTaskManager) {
        this.ruleManager = ruleManager;
        this.clickTaskManager = clickTaskManager;
        this.setupUrlChangeListener();
    }

    getMenuTitle() {
        return this.i18n[this.getLanguage()].title;
    }

    getLanguage() {
        return 'zh-CN';
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    validateRule(rule) {
        const i18n = this.i18n[this.getLanguage()];
        try {
            new RegExp(rule.urlPattern);
        } catch (e) {
            alert(`${i18n.invalidRegex}: ${rule.urlPattern}`);
            return false;
        }
        if (!rule.selector || !['css', 'xpath'].includes(rule.selectorType)) {
            alert(`${i18n.invalidSelector}: ${rule.selector}`);
            return false;
        }
        return true;
    }

    createRuleElement(rule, ruleIndex) {
        const i18n = this.i18n[this.getLanguage()];
        const ruleDiv = document.createElement('div');

        const escapeHTML = (str) => (str || '').replace(/"/g, '&quot;');
        const safeRuleName = escapeHTML(rule.ruleName);
        const safeUrlPattern = escapeHTML(rule.urlPattern);
        const safeSelector = escapeHTML(rule.selector);
        const safeSelectValue = escapeHTML(rule.selectValue);
        const safeGroupName = escapeHTML(rule.groupName);

        const clickMethod = rule.clickMethod || 'native';

        ruleDiv.innerHTML = `
                <div class="ruleHeader" id="ruleHeader${ruleIndex}">
                    <strong>${rule.ruleName || `规则 ${ruleIndex + 1}`}</strong>
                    ${rule.groupName ? `<span style="font-size:0.8em; color:#aaa;">[${safeGroupName}:${rule.order || 0}]</span>` : ''}
                </div>
                <div class="readRule" id="readRule${ruleIndex}" style="display: none;">
                    <label>${i18n.ruleName}</label>
                    <input type="text" id="updateRuleName${ruleIndex}" value="${safeRuleName}">
                    <label>${i18n.urlPattern}</label>
                    <input type="text" id="updateUrlPattern${ruleIndex}" value="${safeUrlPattern}">

                    <!-- 行 1：顺序 (左) + 分组名称 (右) -->
                    <div class="input-row">
                        <div class="input-col">
                            <label>${i18n.groupOrder}</label>
                            <input type="number" id="updateOrder${ruleIndex}" value="${rule.order || 1}">
                        </div>
                        <div class="input-col" style="flex: 2;">
                            <label>${i18n.groupName}</label>
                            <input type="text" id="updateGroupName${ruleIndex}" value="${safeGroupName}" placeholder="${i18n.groupPlaceholder}">
                        </div>
                    </div>

                    <!-- 行 2：选择器类型 (左) + 选择器 (右) -->
                    <div class="input-row">
                        <div class="input-col">
                            <label>${i18n.selectorType}</label>
                            <select id="updateSelectorType${ruleIndex}">
                                <option value="css" ${rule.selectorType === 'css' ? 'selected' : ''}>CSS</option>
                                <option value="xpath" ${rule.selectorType === 'xpath' ? 'selected' : ''}>XPath</option>
                            </select>
                        </div>
                        <div class="input-col" style="flex: 2;">
                            <label>${i18n.selector}</label>
                            <input type="text" id="updateSelector${ruleIndex}" value="${safeSelector}">
                        </div>
                    </div>

                    <!-- 行 3：第几个元素 (左) + 选择框文本 (右) -->
                    <div class="input-row">
                        <div class="input-col">
                            <label>${i18n.nthElement}</label>
                            <input type="number" id="updateNthElement${ruleIndex}" min="1" value="${rule.nthElement}">
                        </div>
                        <div class="input-col" style="flex: 2;">
                            <label>${i18n.selectValue}</label>
                            <input type="text" id="updateSelectValue${ruleIndex}" value="${safeSelectValue}" placeholder="${i18n.selectValuePlaceholder}">
                        </div>
                    </div>

                    <!-- 行 4：点击方法 (左) + 点击延迟 (右) -->
                    <div class="input-row">
                        <div class="input-col">
                            <label>${i18n.clickMethod}</label>
                            <select id="updateClickMethod${ruleIndex}">
                                <option value="native" ${clickMethod === 'native' ? 'selected' : ''}>${i18n.methodNative}</option>
                                <option value="pointer" ${clickMethod === 'pointer' ? 'selected' : ''}>${i18n.methodPointer}</option>
                            </select>
                        </div>
                        <div class="input-col" style="flex: 2;">
                            <label>${i18n.clickDelay}</label>
                            <input type="number" id="updateClickDelay${ruleIndex}" min="100" value="${rule.clickDelay || 1000}">
                        </div>
                    </div>

                    <div class="checkbox-row">
                        <div class="checkbox-container">
                            <label>${i18n.keepClicking}</label>
                            <input type="checkbox" id="updateKeepSearching${ruleIndex}" ${rule.keepClicking ? 'checked' : ''}>
                        </div>

                        <div class="checkbox-container">
                            <label>${i18n.simulateHover}</label>
                            <input type="checkbox" id="updateSimulateHover${ruleIndex}" ${rule.simulateHover ? 'checked' : ''}>
                        </div>

                        <div class="checkbox-container">
                            <label>${i18n.ifLinkOpen}</label>
                            <input type="checkbox" id="updateIfLink${ruleIndex}" ${rule.ifLinkOpen ? 'checked' : ''}>
                        </div>
                    </div>

                    <button id="updateRule${ruleIndex}">${i18n.save}</button>
                    <button id="deleteRule${ruleIndex}">${i18n.delete}</button>
                </div>
            `;
        return ruleDiv;
    }

    createMenuElement() {
        const i18n = this.i18n[this.getLanguage()];
        const menu = document.createElement('div');
        menu.id = 'autoClickMenuContainer';

        const defaultEscapedUrl = this.escapeRegex(window.location.hostname);

        menu.style.position = 'fixed';
        menu.style.top = '10px';
        menu.style.right = '10px';
        menu.style.background = 'rgb(36, 36, 36)';
        menu.style.color = 'rgb(204, 204, 204)';
        menu.style.border = '1px solid rgb(80, 80, 80)';
        menu.style.padding = '10px';
        menu.style.zIndex = '2147483647';
        menu.style.width = '265px';
        menu.style.boxSizing = 'border-box';
        menu.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        menu.innerHTML = `
            <style>
                #autoClickMenu {
                    overflow-y: auto;
                    max-height: 80vh;
                    font-size: 9px;
                    scrollbar-gutter: stable;
                    padding-right: 8px;
                }
                #autoClickMenu::-webkit-scrollbar {
                    width: 8px;
                }
                #autoClickMenu::-webkit-scrollbar-track {
                    background: rgb(44, 44, 44);
                }
                #autoClickMenu::-webkit-scrollbar-thumb {
                    background-color: rgb(159, 159, 159);
                    border-radius: 0px;
                }
                #autoClickMenu input:not([type="checkbox"]), #autoClickMenu select, #autoClickMenu button {
                    background: rgb(50, 50, 50);
                    color: rgb(204, 204, 204);
                    border: 1px solid rgb(80, 80, 80);
                    margin: 5px 0;
                    padding: 5px;
                    width: 100% !important;
                    min-width: 100% !important;
                    max-width: 100% !important;
                    box-sizing: border-box !important;
                    height: 29px;
                    font-size: 9px;
                    text-align: center !important;
                    border-radius: 0 !important;
                }
                #autoClickMenu button {
                    text-align: center !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    padding: 0 !important;
                }
                #autoClickMenu h3, #autoClickMenu h4, #autoClickMenu p, #autoClickMenu label {
                    font-size: 9px;
                    display: block;
                    color: rgb(204, 204, 204);
                    text-align: center;
                }
                #autoClickMenu input[type="checkbox"] {
                    background: rgb(50, 50, 50);
                    color: rgb(204, 204, 204);
                    border: 1px solid rgb(80, 80, 80);
                    margin: 0 5px 0 0;
                    padding: 5px;
                    width: auto;
                    vertical-align: middle;
                }
                #autoClickMenu button {
                    cursor: pointer;
                }
                #autoClickMenu button:hover {
                    background: rgb(70, 70, 70);
                }
                #autoClickMenu .checkbox-container {
                    display: flex;
                    align-items: center;
                    margin-top: 5px;
                    margin-right: 3px;
                }
                #autoClickMenu .checkbox-row {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    align-items: center;
                    justify-content: center;
                }
                #autoClickMenu .input-row {
                    display: flex;
                    flex-direction: row;
                    gap: 5px;
                    align-items: flex-start;
                    width: 100%;
                }
                #autoClickMenu .input-col {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    min-width: 0;
                }
                #autoClickMenu .ruleHeader {
                    cursor: pointer;
                    background: rgb(50, 50, 50);
                    padding: 5px;
                    margin: 5px 0;
                    border-radius: 0px;
                    border: 1px solid rgb(80, 80, 80);
                    text-align: center;
                }
                #autoClickMenu .readRule {
                    padding: 5px;
                    border: 1px solid rgb(80, 80, 80);
                    border-radius: 0px;
                    margin-bottom: 5px;
                }
                #autoClickMenu .headerContainer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }
                #autoClickMenu .closeButton {
                    width: auto !important;
                    min-width: auto !important;
                    padding: 5px 10px;
                    margin: 0;
                    border: none !important;
                    background: transparent;
                }
                #autoClickMenu button[id^="updateRule"],
                #autoClickMenu button[id^="deleteRule"] {
                    border-radius: 0;
                }
                #autoClickMenu .separator {
                    width: 100%;
                    height: 1px;
                    background-color: rgb(204, 204, 204);
                    margin: 10px 0;
                }
            </style>
                <div id="autoClickMenu">
                    <div class="headerContainer">
                        <h3>${i18n.title}</h3>
                        <button id="closeMenu" class="closeButton">✕</button>
                    </div>
                    <div id="rulesList"></div>
                    <div class="separator"></div>
                    <h4>${i18n.addRuleSection}</h4>
                    <label>${i18n.ruleName}</label>
                    <input type="text" id="ruleName" placeholder="${i18n.ruleNamePlaceholder}">
                    <label>${i18n.urlPattern}</label>
                    <input type="text" id="urlPattern" value="${defaultEscapedUrl}" placeholder="${i18n.urlPatternPlaceholder}">

                    <!-- 行 1：顺序 (左) + 分组名称 (右) -->
                    <div class="input-row">
                        <div class="input-col">
                            <label>${i18n.groupOrder}</label>
                            <input type="number" id="groupOrder" value="1">
                        </div>
                        <div class="input-col" style="flex: 2;">
                            <label>${i18n.groupName}</label>
                            <input type="text" id="groupName" placeholder="${i18n.groupPlaceholder}">
                        </div>
                    </div>

                    <!-- 行 2：选择器类型 (左) + 选择器 (右) -->
                    <div class="input-row">
                        <div class="input-col">
                            <label>${i18n.selectorType}</label>
                            <select id="selectorType">
                                <option value="css">CSS</option>
                                <option value="xpath">XPath</option>
                            </select>
                        </div>
                        <div class="input-col" style="flex: 2;">
                            <label>${i18n.selector}</label>
                            <input type="text" id="selector" placeholder="${i18n.selectorPlaceholder}">
                        </div>
                    </div>

                    <!-- 行 3：第几个元素 (左) + 选择框文本 (右) -->
                    <div class="input-row">
                        <div class="input-col">
                            <label>${i18n.nthElement}</label>
                            <input type="number" id="nthElement" min="1" value="1">
                        </div>
                        <div class="input-col" style="flex: 2;">
                            <label>${i18n.selectValue}</label>
                            <input type="text" id="selectValue" placeholder="${i18n.selectValuePlaceholder}">
                        </div>
                    </div>

                    <!-- 行 4：点击方法 (左) + 点击延迟 (右) -->
                    <div class="input-row">
                        <div class="input-col">
                            <label>${i18n.clickMethod}</label>
                            <select id="clickMethod">
                                <option value="native">${i18n.methodNative}</option>
                                <option value="pointer">${i18n.methodPointer}</option>
                            </select>
                        </div>
                        <div class="input-col" style="flex: 2;">
                            <label>${i18n.clickDelay}</label>
                            <input type="number" id="clickDelay" min="50" value="1000">
                        </div>
                    </div>

                    <div class="checkbox-row">
                        <div class="checkbox-container">
                            <label>${i18n.keepClicking}</label>
                            <input type="checkbox" id="keepClicking">
                        </div>

                        <div class="checkbox-container">
                            <label>${i18n.simulateHover}</label>
                            <input type="checkbox" id="simulateHover">
                        </div>

                        <div class="checkbox-container">
                            <label>${i18n.ifLinkOpen}</label>
                            <input type="checkbox" id="ifLinkOpen">
                        </div>
                    </div>

                    <button id="addRule" style="margin-top: 10px;">${i18n.addRule}</button>
                    <button id="createRuleByClick" style="margin-top: 5px;">${i18n.createRuleByClick}</button>
                </div>
            `;
        document.body.appendChild(menu);

        const stopPropagation = (e) => {
            e.stopPropagation();
        };
        const eventTypes = ['click', 'mousedown', 'keydown', 'keyup', 'contextmenu', 'focus', 'focusin', 'wheel'];
        eventTypes.forEach(evt => menu.addEventListener(evt, stopPropagation, false));

        menu.addEventListener('mousedown', (event) => {
            const interactiveTags = ['INPUT', 'SELECT', 'OPTION', 'BUTTON'];
            if (!interactiveTags.includes(event.target.tagName.toUpperCase())) {
                event.preventDefault();
            }
            event.stopPropagation();
        });
        menu.addEventListener('click', (event) => {
            event.stopPropagation();
        });

        this.updateRulesElement();

        document.getElementById('addRule').addEventListener('click', () => {
            const newRule = {
                ruleName: document.getElementById('ruleName').value || `规则 ${this.ruleManager.clickRules.rules.length + 1}`,
                urlPattern: document.getElementById('urlPattern').value,
                selectorType: document.getElementById('selectorType').value,
                selector: document.getElementById('selector').value,
                selectValue: document.getElementById('selectValue').value || '',
                nthElement: parseInt(document.getElementById('nthElement').value) || 1,
                clickDelay: parseInt(document.getElementById('clickDelay').value) || 1000,
                clickMethod: document.getElementById('clickMethod').value,
                simulateHover: document.getElementById('simulateHover').checked || false,
                keepClicking: document.getElementById('keepClicking').checked || false,
                ifLinkOpen: document.getElementById('ifLinkOpen').checked || false,
                // 新增字段
                groupName: document.getElementById('groupName').value || '',
                order: parseInt(document.getElementById('groupOrder').value) || 1
            };
            if (!this.validateRule(newRule)) return;
            this.ruleManager.addRule(newRule);

            document.getElementById('ruleName').value = '';
            document.getElementById('selector').value = '';
            document.getElementById('selectValue').value = '';
            document.getElementById('nthElement').value = '1';
            document.getElementById('clickDelay').value = '1000';
            document.getElementById('clickMethod').value = 'native';
            document.getElementById('simulateHover').checked = false;
            document.getElementById('keepClicking').checked = false;
            document.getElementById('ifLinkOpen').checked = false;
            document.getElementById('groupName').value = '';
            document.getElementById('groupOrder').value = '1';
        });

        document.getElementById('createRuleByClick').addEventListener('click', () => this.startElementSelection());

        document.getElementById('closeMenu').addEventListener('click', () => {
            menu.remove();
        });
    }

    updateRulesElement() {
        const rulesList = document.getElementById('rulesList');
        const i18n = this.i18n[this.getLanguage()];
        rulesList.innerHTML = '';

        const currentHostname = window.location.hostname;
        const baseHostname = currentHostname.replace(/^www\./, '');

        const matchingRules = this.ruleManager.clickRules.rules.filter(rule => {
            try {
                const normalizedPattern = rule.urlPattern.replace(/\\/g, '');
                return normalizedPattern.includes(baseHostname);
            } catch (e) {
                return false;
            }
        });

        if (matchingRules.length === 0) {
            rulesList.innerHTML = `<p>${i18n.noMatchingRules}</p>`;
            return;
        }

        const titleHeader = document.createElement('h4');
        titleHeader.textContent = i18n.matchingRules;
        rulesList.appendChild(titleHeader);

        matchingRules.forEach((rule) => {
            const ruleIndex = this.ruleManager.clickRules.rules.indexOf(rule);
            const ruleDiv = this.createRuleElement(rule, ruleIndex);
            rulesList.appendChild(ruleDiv);

            document.getElementById(`ruleHeader${ruleIndex}`).addEventListener('click', () => {
                const details = document.getElementById(`readRule${ruleIndex}`);
                details.style.display = details.style.display === 'none' ? 'block' : 'none';
            });

            document.getElementById(`updateRule${ruleIndex}`).addEventListener('click', () => {
                const updatedRule = {
                    ruleName: document.getElementById(`updateRuleName${ruleIndex}`).value || `规则 ${ruleIndex + 1}`,
                    urlPattern: document.getElementById(`updateUrlPattern${ruleIndex}`).value,
                    selectorType: document.getElementById(`updateSelectorType${ruleIndex}`).value,
                    selector: document.getElementById(`updateSelector${ruleIndex}`).value,
                    selectValue: document.getElementById(`updateSelectValue${ruleIndex}`).value || '',
                    nthElement: parseInt(document.getElementById(`updateNthElement${ruleIndex}`).value) || 1,
                    clickDelay: parseInt(document.getElementById(`updateClickDelay${ruleIndex}`).value) || 1000,
                    clickMethod: document.getElementById(`updateClickMethod${ruleIndex}`).value,
                    simulateHover: document.getElementById(`updateSimulateHover${ruleIndex}`).checked || false,
                    keepClicking: document.getElementById(`updateKeepSearching${ruleIndex}`).checked || false,
                    ifLinkOpen: document.getElementById(`updateIfLink${ruleIndex}`).checked || false,
                    // 新增字段
                    groupName: document.getElementById(`updateGroupName${ruleIndex}`).value || '',
                    order: parseInt(document.getElementById(`updateOrder${ruleIndex}`).value) || 1
                };
                if (!this.validateRule(updatedRule)) return;
                this.ruleManager.updateRule(ruleIndex, updatedRule);
            });

            document.getElementById(`deleteRule${ruleIndex}`).addEventListener('click', () => {
                this.ruleManager.deleteRule(ruleIndex);
            });
        });
    }

    startElementSelection() {
        const i18n = this.i18n[this.getLanguage()];
        const menu = document.querySelector('#autoClickMenuContainer');
        if (!menu) return;

        const originalCursor = document.body.style.cursor;
        document.body.style.cursor = 'crosshair';

        const message = document.createElement('div');
        message.textContent = i18n.selectionMessage;
        message.style.position = 'fixed';
        message.style.top = '10px';
        message.style.left = '50%';
        message.style.transform = 'translateX(-50%)';
        message.style.padding = '10px 20px';
        message.style.background = 'rgba(0, 0, 0, 0.5)';
        message.style.color = 'white';
        message.style.zIndex = '2147483647';
        message.style.pointerEvents = 'none';
        document.body.appendChild(message);

        const broadcastMessage = (msg) => {
            window.postMessage(msg, '*');
            Array.from(document.querySelectorAll('iframe, frame')).forEach(f => f.contentWindow?.postMessage(msg, '*'));
        };

        const rightClickHandler = (event) => {
            event.preventDefault();
            event.stopPropagation();
            cleanup();
        };

        const cleanup = () => {
            broadcastMessage({ type: 'AUTO_CLICK_STOP_SELECTION_MODE' });
            window.removeEventListener('message', messageHandler);
            document.removeEventListener('contextmenu', rightClickHandler, true);
            if (document.body.contains(message)) document.body.removeChild(message);
            document.body.style.cursor = originalCursor;
            menu.style.display = 'block';
        };

        const messageHandler = (event) => {
            if (event.data?.type === 'AUTO_CLICK_ELEMENT_SELECTED') {
                const { selectorType, selector, ruleName } = event.data.payload;
                const preciseUrlPattern = this.escapeRegex(window.location.hostname);

                document.getElementById('selectorType').value = selectorType;
                document.getElementById('selector').value = selector;
                document.getElementById('urlPattern').value = preciseUrlPattern;
                document.getElementById('ruleName').value = `${i18n.autoRuleNamePrefix}: ${ruleName}`;

                cleanup();
            }
        };

        menu.style.display = 'none';
        window.addEventListener('message', messageHandler);
        document.addEventListener('contextmenu', rightClickHandler, true);
        broadcastMessage({ type: 'AUTO_CLICK_START_SELECTION_MODE' });
    }

    setupUrlChangeListener() {
        // 记录当前的 URL 用于后续对比
        let lastUrl = window.location.href;

        // 定义一个检查函数 只有 URL 变了才触发
        const checkUrlChange = () => {
            const currentUrl = window.location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                // 仅分发脚本内部使用的事件 不再分发 pushstate/replacestate 以免干扰网页
                window.dispatchEvent(new Event('locationchange'));
            }
        };

        const oldPushState = history.pushState;
        history.pushState = function pushState() {
            const result = oldPushState.apply(this, arguments);
            checkUrlChange();
            return result;
        };

        const oldReplaceState = history.replaceState;
        history.replaceState = function replaceState() {
            const result = oldReplaceState.apply(this, arguments);
            checkUrlChange();
            return result;
        };

        window.addEventListener('popstate', () => {
            checkUrlChange();
        });

        window.addEventListener('locationchange', () => {
            this.clickTaskManager.clearAutoClicks();
            this.clickTaskManager.runAutoClicks();
        });
    }
}

class ClickTaskManager {
    ruleManager;
    timerIds = {}; // 改名：统称 timerIds 混用 interval 和 timeout

    constructor(ruleManager) {
        this.ruleManager = ruleManager;
        this.runAutoClicks();
        GM_addValueChangeListener('clickRules', this.handleRulesChange.bind(this));
    }

    handleRulesChange(name, oldValue, newValue, remote) {
        this.ruleManager.clickRules = newValue || { rules: [] };
        this.clearAutoClicks();
        this.runAutoClicks();
    }

    clearAutoClicks() {
        // 清除所有定时器 (兼容 Interval 和 Timeout)
        Object.keys(this.timerIds).forEach(key => {
            clearTimeout(this.timerIds[key]); // 在浏览器中 clearTimeout 通常也能清除 Interval 但为了严谨混用时需注意
            clearInterval(this.timerIds[key]);
            delete this.timerIds[key];
        });
    }

    runAutoClicks() {
        const currentUrl = window.location.href;
        const allRules = this.ruleManager.clickRules.rules;

        // 1. 筛选
        const activeRules = allRules.filter(rule => {
            try {
                return rule.urlPattern && rule.selector && new RegExp(rule.urlPattern).test(currentUrl);
            } catch (e) {
                return false;
            }
        });

        // 2. 分类
        const independentRules = [];
        const groupedRules = {};

        activeRules.forEach(rule => {
            if (rule.groupName && rule.groupName.trim() !== '') {
                const gName = rule.groupName.trim();
                if (!groupedRules[gName]) {
                    groupedRules[gName] = [];
                }
                groupedRules[gName].push(rule);
            } else {
                independentRules.push(rule);
            }
        });

        // 3. 执行独立规则 (使用 setInterval)
        independentRules.forEach(rule => {
            const ruleKey = `indep_${Math.random().toString(36).substr(2, 9)}`;
            const intervalId = setInterval(() => {
                const clicked = this.autoClick(rule);
                if (clicked && !rule.keepClicking) {
                    clearInterval(this.timerIds[ruleKey]);
                    delete this.timerIds[ruleKey];
                }
            }, rule.clickDelay || 1000);
            this.timerIds[ruleKey] = intervalId;
        });

        // 4. 执行分组规则 (使用递归 setTimeout 以支持动态延迟)
        Object.keys(groupedRules).forEach(groupName => {
            const rules = groupedRules[groupName];
            // 按 order 排序
            rules.sort((a, b) => (a.order || 1) - (b.order || 1));
            this.runChainGroup(groupName, rules);
        });
    }

    // --- 修改：链式分组执行逻辑 (支持自定义延迟) ---
    runChainGroup(groupName, sortedRules) {
        const groupKey = `group_${groupName}`;
        let currentIndex = 0;
        const isInfiniteLoop = sortedRules.every(r => r.keepClicking);

        const processNextStep = () => {
            // 检查是否结束
            if (currentIndex >= sortedRules.length) {
                if (isInfiniteLoop) {
                    currentIndex = 0; // 重置循环
                } else {
                    delete this.timerIds[groupKey];
                    return; // 结束链条
                }
            }

            const currentRule = sortedRules[currentIndex];
            const clicked = this.autoClick(currentRule);

            let nextDelay = 1000; // 默认轮询间隔 (未找到元素时)

            if (clicked) {
                // 只有点击成功了 才应用规则设定的延迟
                nextDelay = currentRule.clickDelay || 1000;
                // 移动到下一步
                currentIndex++;
            } else {
                // 未找到元素 保持 currentIndex 不变 1秒后重试
                nextDelay = 1000;
            }

            // 递归调度
            this.timerIds[groupKey] = setTimeout(processNextStep, nextDelay);
        };

        // 启动链条
        processNextStep();
    }

    triggerPointerEvent(element, eventType) {
        if (!element) return;
        const realWindow = element.ownerDocument.defaultView || window;
        const rect = element.getBoundingClientRect();
        const clientX = rect.left + rect.width / 2;
        const clientY = rect.top + rect.height / 2;

        // 判断是否为点击动作（按下或抬起） 如果是 buttons 为 1 否则（悬停）为 0
        const isClickAction = ['down', 'up', 'click'].some(k => eventType.includes(k));
        const buttons = isClickAction ? 1 : 0;
        const pressure = isClickAction ? 0.5 : 0;

        // PointerEvent 配置
        const eventConfig = {
            bubbles: true,
            cancelable: true,
            view: realWindow,
            pointerId: 1,
            width: 1,
            height: 1,
            isPrimary: true,
            pointerType: 'mouse',
            clientX: clientX,
            clientY: clientY,
            screenX: clientX,
            screenY: clientY,
            buttons: buttons,
            pressure: pressure
        };

        // 某些事件（如 mouseenter/leave）默认不冒泡 但手动触发时通常设为冒泡以保证兼容性
        // 这里保持 bubbles: true 能覆盖大多数情况

        const event = new PointerEvent(eventType, eventConfig);
        element.dispatchEvent(event);

        // 兼容旧的 MouseEvent
        if (eventType.startsWith('pointer')) {
             const mouseEventType = eventType.replace('pointer', 'mouse');
             const mouseEvent = new MouseEvent(mouseEventType, eventConfig);
             element.dispatchEvent(mouseEvent);
        }
    }

    // --- 新增：完整的悬停序列 ---
    triggerHoverSequence(element) {
        // 模拟鼠标移入的完整过程：Over -> Enter -> Move
        this.triggerPointerEvent(element, 'pointerover');
        this.triggerPointerEvent(element, 'mouseover');

        this.triggerPointerEvent(element, 'pointerenter');
        this.triggerPointerEvent(element, 'mouseenter');

        this.triggerPointerEvent(element, 'pointermove');
        this.triggerPointerEvent(element, 'mousemove');
    }

    // --- 修改：执行点击（包含悬停、聚焦、点击） ---
    performClick(targetElement, method, ifLinkOpen) {
        if (targetElement.tagName === 'SELECT') return;

        // 1. 优化 Target 属性 (防止新标签页拦截)
        if (targetElement.tagName === 'A' && targetElement.target === '_blank' && !ifLinkOpen) {
            targetElement.setAttribute('target', '_self');
        }

        // 2. 执行完整的悬停序列 (模拟鼠标靠近)
        this.triggerHoverSequence(targetElement);

        // 3. 显式聚焦 (模拟用户点击前的 Focus)
        // 注意：这可能会导致页面滚动到元素位置 这是符合真实行为的
        if (typeof targetElement.focus === 'function') {
            targetElement.focus({ preventScroll: true }); // 尽量不剧烈滚动 但获取焦点
        }

        // 4. 执行点击序列
        if (method === 'pointer') {
            this.triggerPointerEvent(targetElement, 'pointerdown');
            this.triggerPointerEvent(targetElement, 'mousedown');

            // 模拟极短的按压延迟
            // (由于 JS 单线程限制 这里不使用 setTimeout 阻塞 直接顺序执行
            // 如果需要严格时序 需要重构为 async/await 但通常同步触发已足够欺骗检测)

            this.triggerPointerEvent(targetElement, 'pointerup');
            this.triggerPointerEvent(targetElement, 'mouseup');

            targetElement.click();
        } else {
            if (ifLinkOpen && targetElement.tagName === "A" && targetElement.href) {
                window.location.href = targetElement.href;
            } else {
                targetElement.click();
            }
        }
    }

    // --- 修改：autoClick 中对模拟悬停的处理 ---
    autoClick(rule) {
        try {
            const urlRegex = new RegExp(rule.urlPattern);
            if (!urlRegex.test(window.location.href)) return false;

            const elements = this.getElements(rule.selectorType, rule.selector);
            if (elements.length === 0) return false;

            if (rule.nthElement < 1 || rule.nthElement > elements.length) return false;

            const targetElement = elements[rule.nthElement - 1];
            if (targetElement) {
                // 处理 Select
                if (targetElement.tagName === 'SELECT' && rule.selectValue) {
                    const targetText = rule.selectValue.trim();
                    for (const option of targetElement.options) {
                        if (option.textContent.trim() === targetText) {
                            if (targetElement.value !== option.value) {
                                targetElement.value = option.value;
                                targetElement.dispatchEvent(new Event('change', { bubbles: true }));
                                targetElement.dispatchEvent(new Event('input', { bubbles: true }));
                            }
                            return true;
                        }
                    }
                    return true;
                }

                // 处理模拟悬停 (仅悬停不点击)
                if (rule.simulateHover) {
                    this.triggerHoverSequence(targetElement);
                    // 模拟悬停时通常也伴随聚焦
                    if (typeof targetElement.focus === 'function') {
                        targetElement.focus({ preventScroll: true });
                    }
                } else {
                    // 执行完整点击
                    this.performClick(targetElement, rule.clickMethod, rule.ifLinkOpen);
                }
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    diveIntoShadow(element) {
        let current = element;
        let depth = 0;
        const maxDepth = 20;
        while (current && current.shadowRoot && depth < maxDepth) {
            const internal = current.shadowRoot.querySelector('input, textarea, button, a, select, [role="button"], [tabindex]:not([tabindex="-1"])');
            if (internal) {
                current = internal;
                depth++;
            } else {
                break;
            }
        }
        return current;
    }

    getElements(selectorType, selector) {
        try {
            let elements = [];
            if (selectorType === 'xpath') {
                const nodes = document.evaluate(selector, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                for (let i = 0; i < nodes.snapshotLength; i++) {
                    elements.push(nodes.snapshotItem(i));
                }
            } else if (selectorType === 'css') {
                elements = Array.from(document.querySelectorAll(selector));
            }
            return elements.map(el => this.diveIntoShadow(el));
        } catch (e) {
            return [];
        }
    }
}

function initializeFrameSelectionListener() {
    let isSelectionModeActive = false;

    const masterInterceptionHandler = (event) => {
        if (!event.isTrusted) return;

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        if (event.type === 'click') {
            const optimalTarget = findOptimalClickTarget(event.target);
            const { type, selector } = generateSelectorForElement(optimalTarget);
            const ruleNameText = optimalTarget.textContent.trim().substring(0, 20) || optimalTarget.name || optimalTarget.id || 'Element';
            window.top.postMessage({ type: 'AUTO_CLICK_ELEMENT_SELECTED', payload: { selectorType: type, selector, ruleName: ruleNameText } }, '*');
            stopListening();
        }
    };

    const startListening = () => {
        if (isSelectionModeActive) return;
        isSelectionModeActive = true;
        document.body.style.cursor = 'crosshair';
        document.addEventListener('mousedown', masterInterceptionHandler, true);
        document.addEventListener('mouseup', masterInterceptionHandler, true);
        document.addEventListener('click', masterInterceptionHandler, true);
    };

    const stopListening = () => {
        if (!isSelectionModeActive) return;
        isSelectionModeActive = false;
        document.body.style.cursor = 'default';
        document.removeEventListener('mousedown', masterInterceptionHandler, true);
        document.removeEventListener('mouseup', masterInterceptionHandler, true);
        document.removeEventListener('click', masterInterceptionHandler, true);
    };

    window.addEventListener('message', (event) => {
        if (window.self !== window.top && event.source !== window.top) return;
        if (event.data?.type === 'AUTO_CLICK_START_SELECTION_MODE') startListening();
        else if (event.data?.type === 'AUTO_CLICK_STOP_SELECTION_MODE') stopListening();
    });
}

initializeFrameSelectionListener();

const localRuleManager = new RuleManager();
const localClickTaskManager = new ClickTaskManager(localRuleManager);

if (window.self === window.top) {
    const uiRuleManager = new RuleManager();
    const Mika = new WebElementHandler(uiRuleManager, localClickTaskManager);

    GM_addValueChangeListener('clickRules', (name, oldValue, newValue, remote) => {
        Mika.ruleManager.clickRules = newValue || { rules: [] };
        if (document.getElementById('autoClickMenuContainer')) {
            Mika.updateRulesElement();
        }
    });

    GM_registerMenuCommand(Mika.getMenuTitle(), () => {
        if (!document.getElementById('autoClickMenuContainer')) {
            Mika.createMenuElement();
        }
    });
}