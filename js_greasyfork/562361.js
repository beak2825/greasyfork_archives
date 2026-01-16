// ==UserScript==
// @name         網頁錯誤處理
// @name:en      Web Error Handler
// @name:ja      ウェブエラー處理
// @name:de      Web-Fehlerbehandlung
// @name:cs      Zpracování webových chyb
// @name:lt      Žiniatinklio klaidų tvarkymas
// @description  根據使用者的設定，當網頁出現特定錯誤元素時，自動重整頁面或跳轉到指定網址，幫助應對網頁載入錯誤。
// @description:en  According to user settings, when a specific error element appears on the webpage, automatically reload the page or redirect to the specified URL to handle web loading errors.
// @description:ja  ユーザーの設定に基づき、ウェブページに特定のエラー要素が表示された場合、自動でページをリロードするか指定URLへリダイレクトし、ウェブ読み込みエラーに対応します。
// @description:de  Je nach Benutzereinstellungen wird bei Erscheinen eines bestimmten Fehler-Elements auf der Webseite die Seite automatisch neu geladen oder zu einer angegebenen URL weitergeleitet, um Web-Ladefehler zu behandeln.
// @description:cs  Podle uživatelského nastavení se při zobrazení určitého chybového prvku na webové stránce automaticky stránka znovu načte nebo přesměruje na zadanou URL, aby se řešily chyby načítání webu.
// @description:lt  Pagal naudotojo nustatymus, kai tinklalapyje pasirodo tam tikras klaidos elementas, puslapis automatiškai persikrauna arba nukreipiamas į nurodytą adresą, kad būtų tvarkomos žiniatinklio įkėlimo klaidos.
//
// @author       Max
// @namespace    https://github.com/Max46656
// @supportURL   https://github.com/Max46656/EverythingInGreasyFork/issues
// @license      MPL2.0
//
// @version      2.0.1
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/562361/%E7%B6%B2%E9%A0%81%E9%8C%AF%E8%AA%A4%E8%99%95%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/562361/%E7%B6%B2%E9%A0%81%E9%8C%AF%E8%AA%A4%E8%99%95%E7%90%86.meta.js
// ==/UserScript==

class Error404Handler {
    constructor() {
        this.LATEST_RULE_VERSION = 1;
        this.rules = GM_getValue('rules', []);
        this.language = this.detectLanguage();
        this.i18n = this.getI18nStrings();
        this.setupMenu();
        this.updateRules();
        this.runChecksIfMatched();
    }

    detectLanguage() {
        const lang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
        if (lang.includes('zh')) return 'zh-TW';
        if (lang.startsWith('en')) return 'en';
        if (lang.startsWith('ja')) return 'ja';
        if (lang.startsWith('de')) return 'de';
        if (lang.startsWith('uk')) return 'uk';
        return 'en';
    }

    getI18nStrings() {
        return {
            'zh-TW': {
                menuAdd: '新增規則',
                menuManage: '管理規則',
                detectedError: '偵測到符合元素，自動重整頁面...',
                titleAdd: '新增規則',
                titleManage: '管理規則',
                isEnabled: '啟用規則',
                ruleName: '規則名稱',
                ruleNamePlaceholder: '規則名稱（選填）',
                urlPattern: '網址模式',
                selectorType: '選擇器類型',
                feature: '元素特徵',
                featurePlaceholder: '錯誤時才出現的元素如 [data-testid="error_retry"]',
                actionType: '動作類型',
                reload: '重整頁面',
                redirect: '跳轉網址',
                targetUrl: '目標網址',
                targetUrlPlaceholder: '例如 https://*/* （* 代表原網址符合部份）',
                addRule: '新增',
                save: '儲存',
                delete: '刪除',
                noMatchingRules: '目前無符合規則',
                matchingRules: '符合規則',
                conflictingRules: '衝突規則',
                elementConflict: '元素衝突',
                css: 'CSS',
                xpath: 'XPath',
                compatChecking: '正在檢查規則向下相容性',
                compatApplying: '正在補全舊規則...',
                compatUpdated: '規則版本已更新'
            },
            en: {
                menuAdd: 'Add Rule',
                menuManage: 'Manage Rules',
                detectedError: 'Detected matching element, auto-reloading page...',
                titleAdd: 'Add Rule',
                titleManage: 'Manage Rules',
                isEnabled: 'Enable Rule',
                ruleName: 'Rule Name',
                ruleNamePlaceholder: 'Rule Name (optional)',
                urlPattern: 'URL Pattern',
                selectorType: 'Selector Type',
                feature: 'Element Feature',
                featurePlaceholder: 'Error-specific elements like [data-testid="error_retry"]',
                actionType: 'Action Type',
                reload: 'Reload Page',
                redirect: 'Redirect URL',
                targetUrl: 'Target URL',
                targetUrlPlaceholder: 'e.g. https://*/* (* represents matched part from original URL)',
                addRule: 'Add',
                save: 'Save',
                delete: 'Delete',
                noMatchingRules: 'No matching rules currently',
                matchingRules: 'Matching Rules',
                conflictingRules: 'Conflicting Rules',
                elementConflict: 'Element Conflict',
                css: 'CSS',
                xpath: 'XPath',
                compatChecking: 'Checking backward compatibility of rules',
                compatApplying: 'Applying fixes to old rules...',
                compatUpdated: 'Rule version has been updated'
            },
            ja: {
                menuAdd: 'ルールを追加',
                menuManage: 'ルールを管理',
                detectedError: '一致する要素を検出、ページを自動リロード...',
                titleAdd: 'ルールを追加',
                titleManage: 'ルールを管理',
                isEnabled: 'ルールを有効にする',
                ruleName: 'ルール名',
                ruleNamePlaceholder: 'ルール名（任意）',
                urlPattern: 'URLパターン',
                selectorType: 'セレクター種類',
                feature: '要素の特徴',
                featurePlaceholder: 'エラー時に出現する要素例：[data-testid="error_retry"]',
                actionType: 'アクション種類',
                reload: 'ページをリロード',
                redirect: 'URLへリダイレクト',
                targetUrl: '対象URL',
                targetUrlPlaceholder: '例：https://*/* （* は元のURLの一致部分を表す）',
                addRule: '追加',
                save: '保存',
                delete: '削除',
                noMatchingRules: '現在一致するルールはありません',
                matchingRules: '一致するルール',
                conflictingRules: '競合ルール',
                elementConflict: '要素競合',
                css: 'CSS',
                xpath: 'XPath',
                compatChecking: 'ルールの後方互換性を確認中',
                compatApplying: '古いルールに修正を適用中...',
                compatUpdated: 'ルールバージョンを更新しました'
            },
            de: {
                menuAdd: 'Regel hinzufügen',
                menuManage: 'Regeln verwalten',
                detectedError: 'Passendes Element erkannt, Seite wird automatisch neu geladen...',
                titleAdd: 'Regel hinzufügen',
                titleManage: 'Regeln verwalten',
                isEnabled: 'Regel aktivieren',
                ruleName: 'Regelname',
                ruleNamePlaceholder: 'Regelname (optional)',
                urlPattern: 'URL-Muster',
                selectorType: 'Selektor-Typ',
                feature: 'Elementmerkmal',
                featurePlaceholder: 'Fehlerspezifische Elemente wie [data-testid="error_retry"]',
                actionType: 'Aktionstyp',
                reload: 'Seite neu laden',
                redirect: 'URL umleiten',
                targetUrl: 'Ziel-URL',
                targetUrlPlaceholder: 'z.B. https://*/* (* steht für übereinstimmenden Teil der Original-URL)',
                addRule: 'Hinzufügen',
                save: 'Speichern',
                delete: 'Löschen',
                noMatchingRules: 'Derzeit keine passenden Regeln',
                matchingRules: 'Passende Regeln',
                conflictingRules: 'Konfliktregeln',
                elementConflict: 'Element-Konflikt',
                css: 'CSS',
                xpath: 'XPath',
                compatChecking: 'Prüfung der Rückwärtskompatibilität der Regeln',
                compatApplying: 'Kompatibilitätskorrekturen auf alte Regeln anwenden...',
                compatUpdated: 'Regelversion wurde aktualisiert'
            },
            cs: {
                menuAdd: 'Přidat pravidlo',
                menuManage: 'Spravovat pravidla',
                detectedError: 'Zjištěn odpovídající prvek, stránka se automaticky načítá znovu...',
                titleAdd: 'Přidat pravidlo',
                titleManage: 'Spravovat pravidla',
                isEnabled: 'Povolit pravidlo',
                ruleName: 'Název pravidla',
                ruleNamePlaceholder: 'Název pravidla (volitelný)',
                urlPattern: 'Vzorec URL',
                selectorType: 'Typ selektoru',
                feature: 'Vlastnost prvku',
                featurePlaceholder: 'Prvky specifické pro chybu, např. [data-testid="error_retry"]',
                actionType: 'Typ akce',
                reload: 'Obnovit stránku',
                redirect: 'Přesměrovat URL',
                targetUrl: 'Cílová URL',
                targetUrlPlaceholder: 'např. https://*/* (* představuje shodnou část původní URL)',
                addRule: 'Přidat',
                save: 'Uložit',
                delete: 'Smazat',
                noMatchingRules: 'Aktuálně žádná odpovídající pravidla',
                matchingRules: 'Odpovídající pravidla',
                conflictingRules: 'Konfliktní pravidla',
                elementConflict: 'Konflikt prvku',
                css: 'CSS',
                xpath: 'XPath',
                compatChecking: 'Kontrola zpětné kompatibility pravidel',
                compatApplying: 'Aplikace oprav kompatibility na stará pravidla...',
                compatUpdated: 'Verze pravidel byla aktualizována'
            },
            lt: {
                menuAdd: 'Pridėti taisyklę',
                menuManage: 'Tvarkyti taisykles',
                detectedError: 'Aptiktas atitinkantis elementas, puslapis automatiškai persikrauna...',
                titleAdd: 'Pridėti taisyklę',
                titleManage: 'Tvarkyti taisykles',
                isEnabled: 'Įjungti taisyklę',
                ruleName: 'Taisyklės pavadinimas',
                ruleNamePlaceholder: 'Taisyklės pavadinimas (neprivalomas)',
                urlPattern: 'URL šablonas',
                selectorType: 'Selektoriaus tipas',
                feature: 'Elemento ypatybė',
                featurePlaceholder: 'Klaidai būdingi elementai, pvz. [data-testid="error_retry"]',
                actionType: 'Veiksmo tipas',
                reload: 'Perkrauti puslapį',
                redirect: 'Nukreipti URL',
                targetUrl: 'Tikslinis URL',
                targetUrlPlaceholder: 'pvz. https://*/* (* reiškia atitinkančią originalaus URL dalį)',
                addRule: 'Pridėti',
                save: 'Išsaugoti',
                delete: 'Ištrinti',
                noMatchingRules: 'Šiuo metu nėra atitinkančių taisyklių',
                matchingRules: 'Atitinkančios taisyklės',
                conflictingRules: 'Konfliktinės taisyklės',
                elementConflict: 'Elemento konfliktas',
                css: 'CSS',
                xpath: 'XPath',
                compatChecking: 'Tikrinama taisyklių atgalinė suderinamumas',
                compatApplying: 'Taikomi suderinamumo pataisymai senoms taisyklėms...',
                compatUpdated: 'Taisyklių versija atnaujinta'
            }
        };
    }

    getString(key) {
        return this.i18n[this.language][key] || this.i18n['en'][key];
    }

    saveRules() {
        GM_setValue('rules', this.rules);
    }

    setupMenu() {
        GM_registerMenuCommand(this.getString('menuAdd'), () => this.createAddRuleMenu());
        GM_registerMenuCommand(this.getString('menuManage'), () => this.createManageRulesMenu());
    }

    updateRules() {
        let savedRuleVersion = GM_getValue('rulesVersion', 0);
        if (savedRuleVersion >= this.LATEST_RULE_VERSION) return
        console.log(`[${this.scriptName}] ${this.getString('compatChecking', {
            saved: savedRuleVersion,
            latest: this.LATEST_RULE_VERSION
        })}`);

        console.log(`[${this.scriptName}] ${this.getString('compatApplying')}`);

        this.rules = this.rules.map(rule => ({
            ...rule,
            ruleName: rule.ruleName !== undefined ? rule.ruleName : '',
            url: rule.ruleName !== undefined ? rule.ruleName : '*://*',
            selectorType: rule.selectorType || 'css',
            feature: '[data-testid="error_retry"]',
            action: rule.action || 'reload',
            targetUrl: rule.targetUrl !== undefined ? rule.targetUrl : '',
            isEnabled: rule.isEnabled !== undefined ? rule.isEnabled : true,
        }));

        GM_setValue('rulesVersion', this.LATEST_RULE_VERSION);
        console.log(`[${this.scriptName}] ${this.getString('compatUpdated', { latest: this.LATEST_RULE_VERSION })}`);
    }

    getRuleDisplayName(rule, index) {
        if (rule.ruleName && rule.ruleName.trim() !== '') return rule.ruleName.trim();
        return `規則 ${index + 1}（${rule.url}）`;
    }

    createRuleElement(rule, ruleIndex) {
        const i18n = this.i18n[this.language];
        const currentUrl = window.location.href;
        const conflicts = this.checkConflicts(rule, currentUrl, ruleIndex);
        const conflictHtml = conflicts.length > 0 ? `
            <div class="conflictHeader" id="conflictHeader${ruleIndex}">
                <strong>${i18n.conflictingRules}</strong>
            </div>
            <div class="conflictDetails" id="conflictDetails${ruleIndex}" style="display: none;">
                ${conflicts.map(c => `<p>${i18n.elementConflict}: ${this.getRuleDisplayName(c.rule, this.rules.indexOf(c.rule))}</p>`).join('')}
            </div>
        ` : '';
        const targetUrlHtml = rule.action === 'redirect' ? `
            <label>${i18n.targetUrl}</label>
            <input type="text" id="updateTargetUrl${ruleIndex}" value="${rule.targetUrl || ''}" placeholder="${i18n.targetUrlPlaceholder}">
        ` : '';
        const ruleDiv = document.createElement('div');
        ruleDiv.innerHTML = `
            <div class="ruleHeader" id="ruleHeader${ruleIndex}">
                <strong>${this.getRuleDisplayName(rule, ruleIndex)}</strong>
            </div>
            <div class="readRule" id="readRule${ruleIndex}" style="display: none;">
                <div class="checkbox-container">
                    <label>${i18n.isEnabled}</label>
                    <input type="checkbox" id="updateIsEnabled${ruleIndex}" ${rule.isEnabled !== false ? 'checked' : ''}>
                </div>
                <label>${i18n.ruleName}</label>
                <input type="text" id="updateRuleName${ruleIndex}" value="${rule.ruleName || ''}" placeholder="${i18n.ruleNamePlaceholder}">
                <label>${i18n.urlPattern}</label>
                <input type="text" id="updateUrlPattern${ruleIndex}" value="${rule.url}">
                <label>${i18n.selectorType}</label>
                <select id="updateSelectorType${ruleIndex}">
                    <option value="css" ${rule.selectorType !== 'xpath' ? 'selected' : ''}>${i18n.css}</option>
                    <option value="xpath" ${rule.selectorType === 'xpath' ? 'selected' : ''}>${i18n.xpath}</option>
                </select>
                <label>${i18n.feature}</label>
                <input type="text" id="updateFeature${ruleIndex}" value="${rule.feature}">
                <label>${i18n.actionType}</label>
                <select id="updateActionType${ruleIndex}">
                    <option value="reload" ${rule.action !== 'redirect' ? 'selected' : ''}>${i18n.reload}</option>
                    <option value="redirect" ${rule.action === 'redirect' ? 'selected' : ''}>${i18n.redirect}</option>
                </select>
                <div id="updateTargetUrlContainer${ruleIndex}" style="display: ${rule.action === 'redirect' ? 'block' : 'none'};">
                    ${targetUrlHtml}
                </div>
                <button id="updateRule${ruleIndex}">${i18n.save}</button>
                <button id="deleteRule${ruleIndex}">${i18n.delete}</button>
                ${conflictHtml}
            </div>
        `;
        return ruleDiv;
    }

    createAddRuleMenu() {
        if (document.querySelector('#addRuleMenu')) return;
        const i18n = this.i18n[this.language];
        const menu = document.createElement('div');
        menu.id = 'addRuleMenu';
        menu.style.cssText = 'position:fixed;top:10px;right:10px;background:#242424;color:#ccc;border:1px solid #505050;padding:10px;z-index:10000;max-width:400px;box-shadow:0 0 10px rgba(0,0,0,0.5);font-family:sans-serif;';
        menu.innerHTML = `
            <style>
                h1{font-size:2rem;margin:0 0 10px;} h2{font-size:1.5rem;margin:10px 0;}
                input:not([type=checkbox]), select, button{background:#323232;color:#ccc;border:1px solid #505050;padding:5px;margin:5px 0;width:100%;box-sizing:border-box;}
                input[type=checkbox]{margin:0 5px 0 0;vertical-align:middle;}
                button{cursor:pointer;} button:hover{background:#464646;}
                label{display:block;margin-top:5px;}
                .checkbox-container{display:flex;align-items:center;margin-top:5px;}
                .headerContainer{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;}
                .closeButton{width:auto;padding:5px 10px;margin:0;}
                #targetUrlContainer { display: none; }
            </style>
            <div class="headerContainer">
                <h1>${GM_info.script.name}</h1>
                <button id="closeAddMenu" class="closeButton">✕</button>
            </div>
            <h2>${i18n.titleAdd}</h2>
            <div class="checkbox-container">
                <label>${i18n.isEnabled}</label>
                <input type="checkbox" id="isEnabled" checked>
            </div>
            <label>${i18n.ruleName}</label>
            <input type="text" id="ruleName" placeholder="${i18n.ruleNamePlaceholder}">
            <label>${i18n.urlPattern}</label>
            <input type="text" id="urlPattern" value="${window.location.href}">
            <label>${i18n.selectorType}</label>
            <select id="selectorType">
                <option value="css">${i18n.css}</option>
                <option value="xpath">${i18n.xpath}</option>
            </select>
            <label>${i18n.feature}</label>
            <input type="text" id="feature" placeholder="${i18n.featurePlaceholder}">
            <label>${i18n.actionType}</label>
            <select id="actionType">
                <option value="reload">${i18n.reload}</option>
                <option value="redirect">${i18n.redirect}</option>
            </select>
            <div id="targetUrlContainer">
                <label>${i18n.targetUrl}</label>
                <input type="text" id="targetUrl" placeholder="${i18n.targetUrlPlaceholder}">
            </div>
            <button id="addRuleBtn" style="margin-top:10px;">${i18n.addRule}</button>
        `;
        document.body.appendChild(menu);

        const closeBtn = menu.querySelector('#closeAddMenu');
        closeBtn.addEventListener('click', () => menu.remove());

        const actionTypeSelect = menu.querySelector('#actionType');
        actionTypeSelect.addEventListener('change', () => {
            menu.querySelector('#targetUrlContainer').style.display = actionTypeSelect.value === 'redirect' ? 'block' : 'none';
        });

        const addBtn = menu.querySelector('#addRuleBtn');
        addBtn.addEventListener('click', () => {
            const action = actionTypeSelect.value;
            const targetUrl = action === 'redirect' ? menu.querySelector('#targetUrl').value.trim() : '';
            const newRule = {
                ruleName: menu.querySelector('#ruleName').value.trim() || '',
                url: menu.querySelector('#urlPattern').value.trim(),
                selectorType: menu.querySelector('#selectorType').value,
                feature: menu.querySelector('#feature').value.trim(),
                action: action,
                targetUrl: targetUrl,
                isEnabled: menu.querySelector('#isEnabled').checked,
            };
            if (!newRule.url || !newRule.feature || (action === 'redirect' && !targetUrl)) {
                alert('網址模式、元素特徵為必填項目，若選擇跳轉則目標網址也為必填');
                return;
            }
            this.rules.push(newRule);
            this.saveRules();
            menu.remove();
        });
    }

    createManageRulesMenu() {
        if (document.querySelector('#manageRulesMenu')) return;
        const i18n = this.i18n[this.language];
        const menu = document.createElement('div');
        menu.id = 'manageRulesMenu';
        menu.style.cssText = 'position:fixed;top:10px;right:10px;background:#242424;color:#ccc;border:1px solid #505050;padding:10px;z-index:10000;max-width:400px;box-shadow:0 0 10px rgba(0,0,0,0.5);font-family:sans-serif;overflow-y:auto;max-height:90vh;';
        menu.innerHTML = `
            <style>
                h1{font-size:2rem;margin:0 0 10px;} h2{font-size:1.5rem;margin:10px 0;}
                input:not([type=checkbox]), select, button{background:#323232;color:#ccc;border:1px solid #505050;padding:5px;margin:5px 0;width:100%;box-sizing:border-box;}
                input[type=checkbox]{margin:0 5px 0 0;vertical-align:middle;}
                button{cursor:pointer;} button:hover{background:#464646;}
                label{display:block;margin-top:5px;}
                .checkbox-container{display:flex;align-items:center;margin-top:5px;}
                .ruleHeader,.conflictHeader{cursor:pointer;background:#323232;padding:5px;margin:5px 0;border-radius:3px;}
                .readRule,.conflictDetails{padding:5px;border:1px solid #505050;border-radius:3px;margin-bottom:5px;}
                .headerContainer{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;}
                .closeButton{width:auto;padding:5px 10px;margin:0;}
            </style>
            <div class="headerContainer">
                <h1>${GM_info.script.name}</h1>
                <button id="closeManageMenu" class="closeButton">✕</button>
            </div>
            <h2>${i18n.titleManage}</h2>
            <div id="rulesList"></div>
        `;
        document.body.appendChild(menu);

        const closeBtn = menu.querySelector('#closeManageMenu');
        closeBtn.addEventListener('click', () => {
            this.collapseAllRules();
            this.collapseAllConflicts();
            menu.remove();
        });

        this.updateRulesElement(menu);
    }

    updateRulesElement(menu) {
        const rulesList = menu.querySelector('#rulesList');
        const i18n = this.i18n[this.language];
        rulesList.innerHTML = `<h4>${i18n.matchingRules}</h4>`;

        const currentUrl = window.location.href;
        const matchingRules = this.rules.filter(rule => {
            try {
                return new RegExp(rule.url.replace(/\*/g, '.*')).test(currentUrl);
            } catch (e) {
                console.warn(`Auto Reload Manager: 規則網址模式無效: ${rule.url}`);
                return false;
            }
        }).filter(rule => rule.isEnabled !== false);

        if (matchingRules.length === 0) {
            rulesList.innerHTML += `<p>${i18n.noMatchingRules}</p>`;
            return;
        }

        matchingRules.forEach(rule => {
            const ruleIndex = this.rules.indexOf(rule);
            const ruleDiv = this.createRuleElement(rule, ruleIndex);
            rulesList.appendChild(ruleDiv);

            menu.querySelector(`#ruleHeader${ruleIndex}`).addEventListener('click', () => {
                const details = menu.querySelector(`#readRule${ruleIndex}`);
                if (details.style.display === 'block') {
                    details.style.display = 'none';
                } else {
                    this.collapseAllRules();
                    this.collapseAllConflicts();
                    details.style.display = 'block';
                }
            });

            const conflictHeader = menu.querySelector(`#conflictHeader${ruleIndex}`);
            if (conflictHeader) {
                conflictHeader.addEventListener('click', () => {
                    const details = menu.querySelector(`#conflictDetails${ruleIndex}`);
                    details.style.display = details.style.display === 'block' ? 'none' : 'block';
                });
            }

            const actionTypeSelect = menu.querySelector(`#updateActionType${ruleIndex}`);
            actionTypeSelect.addEventListener('change', (e) => {
                const targetContainer = menu.querySelector(`#updateTargetUrlContainer${ruleIndex}`);
                if (targetContainer) targetContainer.style.display = e.target.value === 'redirect' ? 'block' : 'none';
            });

            const updateBtn = menu.querySelector(`#updateRule${ruleIndex}`);
            updateBtn.addEventListener('click', () => {
                const action = actionTypeSelect.value;
                const targetUrlInput = menu.querySelector(`#updateTargetUrl${ruleIndex}`);
                const targetUrl = action === 'redirect' ? (targetUrlInput ? targetUrlInput.value.trim() : '') : '';
                const updatedRule = {
                    ruleName: menu.querySelector(`#updateRuleName${ruleIndex}`).value.trim() || '',
                    url: menu.querySelector(`#updateUrlPattern${ruleIndex}`).value.trim(),
                    selectorType: menu.querySelector(`#updateSelectorType${ruleIndex}`).value,
                    feature: menu.querySelector(`#updateFeature${ruleIndex}`).value.trim(),
                    action: action,
                    targetUrl: targetUrl,
                    isEnabled: menu.querySelector(`#updateIsEnabled${ruleIndex}`).checked,
                };
                if (!updatedRule.url || !updatedRule.feature || (action === 'redirect' && !targetUrl)) {
                    alert('網址模式、元素特徵為必填項目，若選擇跳轉則目標網址也為必填');
                    return;
                }
                this.rules[ruleIndex] = updatedRule;
                this.saveRules();
                this.updateRulesElement(menu);
            });

            const deleteBtn = menu.querySelector(`#deleteRule${ruleIndex}`);
            deleteBtn.addEventListener('click', () => {
                this.rules.splice(ruleIndex, 1);
                this.saveRules();
                this.updateRulesElement(menu);
            });
        });
    }

    collapseAllRules() {
        document.querySelectorAll('.readRule').forEach(el => el.style.display = 'none');
    }

    collapseAllConflicts() {
        document.querySelectorAll('.conflictDetails').forEach(el => el.style.display = 'none');
    }

    checkConflicts(rule, currentUrl, excludeIndex = -1) {
        const conflicts = [];
        this.rules.forEach((r, i) => {
            if (i !== excludeIndex && r.isEnabled !== false && r.feature === rule.feature && r.selectorType === rule.selectorType) {
                try {
                    const thisMatches = new RegExp(rule.url.replace(/\*/g, '.*')).test(currentUrl);
                    const otherMatches = new RegExp(r.url.replace(/\*/g, '.*')).test(currentUrl);
                    if (thisMatches && otherMatches) {
                        conflicts.push({ type: 'feature', rule: r });
                    }
                } catch (e) {}
            }
        });
        return conflicts;
    }

    checkElementExists(rule) {
        if (rule.selectorType === 'xpath') {
            try {
                const result = document.evaluate(rule.feature, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                return result.singleNodeValue !== null;
            } catch (e) {
                return false;
            }
        }
        return document.querySelector(rule.feature) !== null;
    }

    computeRedirectUrl(rule, currentUrl) {
        const urlPattern = new RegExp(rule.url.replace(/\*/g, '(.*?)'));
        const match = currentUrl.match(urlPattern);
        if (!match) return currentUrl;

        let target = rule.targetUrl;
        let groupIndex = 1;
        while (target.includes('*')) {
            target = target.replace('*', match[groupIndex] || '');
            groupIndex++;
        }
        return target;
    }

    runChecksIfMatched() {
        const matchedRules = this.rules.filter(rule =>
                                               rule.isEnabled !== false &&
                                               new RegExp(rule.url.replace(/\*/g, '.*')).test(window.location.href)
                                              );

        if (matchedRules.length === 0) return;

        const observer = new MutationObserver(() => {
            matchedRules.forEach(rule => {
                if (this.checkElementExists(rule)) {
                    if (rule.action === 'redirect' && rule.targetUrl) {
                        const target = this.computeRedirectUrl(rule, window.location.href);
                        console.log(this.getString('detectedError'), '跳轉至:', target);
                        location.replace(target);
                    } else {
                        console.log(this.getString('detectedError'));
                        location.reload();
                    }
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true, attributes: true });

        setInterval(() => {
            matchedRules.forEach(rule => {
                if (this.checkElementExists(rule)) {
                    if (rule.action === 'redirect' && rule.targetUrl) {
                        const target = this.computeRedirectUrl(rule, window.location.href);
                        console.log(this.getString('detectedError'), '跳轉至:', target);
                        location.replace(target);
                    } else {
                        console.log(this.getString('detectedError'));
                        location.reload();
                    }
                }
            });
        }, 5000);

        matchedRules.forEach(rule => {
            if (this.checkElementExists(rule)) {
                if (rule.action === 'redirect' && rule.targetUrl) {
                    const target = this.computeRedirectUrl(rule, window.location.href);
                    console.log(this.getString('detectedError'), '跳轉至:', target);
                    location.replace(target);
                } else {
                    console.log(this.getString('detectedError'));
                    location.reload();
                }
            }
        });
    }
}


new Error404Handler();
