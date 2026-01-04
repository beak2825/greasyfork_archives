// ==UserScript==
// @name         My Userscript : 自动匹配显示当前网站所有可用的UserJS脚本
// @name:zh-CN   My Userscript : 自动匹配显示当前网站所有可用的UserJS脚本
// @name:zh-TW   My Userscript : 自動匹配顯示當前網站所有可用的UserJS腳本
// @name:en      My Userscript : Auto match and display all available UserJS scripts for current website
// @name:ja      My Userscript : 現在のウェブサイトで利用可能なすべてのUserJSスクリプトを自動表示
// @name:ko      My Userscript : 현재 웹사이트에서 사용 가능한 모든 UserJS 스크립트를 자동 표시
// @version      4.5
// @description  智能显示当前网站所有可用的UserJS脚本，支持一键安装到油猴扩展。悬浮按钮可关闭，设置按钮支持拖拽移动，提供灵活的用户体验。
// @description:zh-CN  智能显示当前网站所有可用的UserJS脚本，支持一键安装到油猴扩展。悬浮按钮可关闭，设置按钮支持拖拽移动，提供灵活的用户体验。
// @description:zh-TW  智慧顯示當前網站所有可用的UserJS腳本，支援一鍵安裝到油猴擴展。懸浮按鈕可關閉，設定按鈕支援拖拽移動，提供靈活的使用者體驗。
// @description:en     Smartly displays all available UserJS scripts for the current website, supports one-click installation to Tampermonkey. The floating button can be closed, and the settings button supports drag and move, providing a flexible user experience.
// @description:ja     現在のウェブサイトで利用可能なすべてのUserJSスクリプトをスマートに表示し、Tampermonkeyへのワンクリックインストールをサポートします。フローティングボタンを閉じることができ、設定ボタンはドラッグアンドムーブをサポートし、柔軟なユーザーエクスペリエンスを提供します。
// @description:ko     현재 웹사이트에서 사용 가능한 모든 UserJS 스크립트를 스마트하게 표시하고 Tampermonkey에 일-click 설치를 지원합니다. 플로팅 버튼을 닫을 수 있고, 설정 버튼은 드래그 앤드 무브를 지원하여 유연한 사용자 경험을 제공합니다.
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3ggEBCQHM3fXsAAAAVdJREFUOMudkz2qwkAUhc/goBaGJBgUtBCZyj0ILkpwAW7Bws4yO3AHLiCtEFD8KVREkoiFxZzX5A2KGfN4F04zMN+ce+5c4LMUgDmANYBnrnV+plBSi+FwyHq9TgA2LQpvCiEiABwMBtzv95RSfoNEHy8DYBzHrNVqVEr9BWKcqNFoxF6vx3a7zc1mYyC73a4MogBg7vs+z+czO50OW60Wt9stK5UKp9Mpj8cjq9WqDTBHnjAdxzGQZrPJw+HA31oulzbAWgLoA0CWZVBKIY5jzGYzdLtdE9DlcrFNrY98zobqOA6TJKHW2jg4nU5sNBpFDp6mhVe5rsvVasUwDHm9Xqm15u12o+/7Hy0gD8KatOd5vN/v1FozTVN6nkchxFuI6hsAAIMg4OPxMJCXdtTbR7JJCMEgCJhlGUlyPB4XfumozInrupxMJpRSRtZlKoNYl+m/6/wDuWAjtPfsQuwAAAAASUVORK5CYII=
// @include      *
// @require      https://cdn.jsdelivr.net/npm/psl@1.9.0/dist/psl.min.js
// @resource     count https://greasyfork.org/scripts/by-site.json
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @connect      greasyfork.org
// @run-at       document-end
// @namespace https://github.com/jae-jae/Userscript-Plus
// @downloadURL https://update.greasyfork.org/scripts/548869/My%20Userscript%20%3A%20%E8%87%AA%E5%8A%A8%E5%8C%B9%E9%85%8D%E6%98%BE%E7%A4%BA%E5%BD%93%E5%89%8D%E7%BD%91%E7%AB%99%E6%89%80%E6%9C%89%E5%8F%AF%E7%94%A8%E7%9A%84UserJS%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/548869/My%20Userscript%20%3A%20%E8%87%AA%E5%8A%A8%E5%8C%B9%E9%85%8D%E6%98%BE%E7%A4%BA%E5%BD%93%E5%89%8D%E7%BD%91%E7%AB%99%E6%89%80%E6%9C%89%E5%8F%AF%E7%94%A8%E7%9A%84UserJS%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 样式定义
    const CSS = `
        #jae_userscript_box { font-family: sans-serif; }
        .jae-userscript { position: fixed; width: 500px; top: 20px; right: 20px; z-index: 2147483647; height: auto; background: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); padding: 15px; border: 2px solid #4CAF50; display: none; }
        .script-list { max-height: 450px; overflow-y: auto; padding: 10px; }
        .script-item { padding: 15px; margin: 10px 0; border: 1px solid #e0e0e0; border-radius: 6px; background: #fafafa; transition: all 0.3s; }
        .script-item:hover { background-color: #f0f8ff; border-color: #4CAF50; box-shadow: 0 2px 8px rgba(76,175,80,0.2); }
        .script-name { font-weight: bold; color: #333; margin-bottom: 8px; font-size: 15px; line-height: 1.4; }
        .script-desc { font-size: 13px; color: #666; margin-bottom: 10px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .script-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; font-size: 12px; }
        .script-meta-item { background: #e8f5e8; color: #2e7d32; padding: 3px 8px; border-radius: 12px; }
        .script-meta-item.installs { background: #e3f2fd; color: #1565c0; }
        .script-meta-item.rating { background: #fff3e0; color: #f57c00; }
        .script-meta-item.updated { background: #f3e5f5; color: #7b1fa2; }
        .script-actions { display: flex; gap: 8px; }
        .script-install { display: inline-block; padding: 8px 12px; background: #4CAF50; color: white; text-decoration: none; border-radius: 4px; font-size: 13px; transition: background-color 0.3s; text-align: center; flex: 1; cursor: pointer; }
        .script-install:hover { background: #45a049; color: white; }
        .script-install.secondary { background: #2196F3; }
        .script-install.secondary:hover { background: #1976D2; }
        .close-btn { position: absolute; top: 8px; right: 8px; background: #ff4444; color: white; border: none; border-radius: 6px; width: 32px; height: 32px; font-size: 18px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10; }
        .close-btn:hover { background: #e53935; }
        .sort-controls { padding: 10px; background: #f8f9fa; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .sort-select { padding: 5px 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px; background: white; cursor: pointer; }
        
        /* Float Button & Settings */
        #jae_float_container { position: fixed; top: 50%; right: 0; z-index: 2147483646; display: flex; flex-direction: column; align-items: flex-end; transform: translateY(-50%); }
        .jae-float-btn { width: 40px; color: white; border: none; border-radius: 8px 0 0 8px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.2); margin-bottom: 10px; display: flex; align-items: center; justify-content: center; transition: transform 0.3s; }
        .jae-float-btn:hover { transform: translateX(-5px); }
        #jae_settings_box { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); z-index: 2147483647; width: 400px; background: #fff; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.3); padding: 20px; border: 2px solid #FF9800; }
        #jae_restore_float_btn { position: fixed; bottom: 20px; right: 20px; z-index: 2147483646; width: 30px; height: 30px; background: #FF9800; color: white; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        
        /* 语言选择器样式 */
        .language-select { padding: 5px 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px; background: white; cursor: pointer; margin-left: auto; }
    `;

    // 多语言支持
    const i18n = {
        // 简体中文
        'zh-CN': {
            'settings': '设置',
            'autoShow': '自动显示脚本列表',
            'floatButtonsVisible': '显示侧边悬浮按钮',
            'showRestoreButton': '显示恢复设置按钮',
            'save': '保存',
            'cancel': '取消',
            'matchingScripts': '可匹配的脚本',
            'currentWebsite': '当前网站',
            'sort': '排序',
            'default': '默认',
            'installsDesc': '安装量(高↓)',
            'updatedDesc': '更新时间(新↓)',
            'noScripts': '暂无可用脚本',
            'install': '安装',
            'details': '详情',
            'unknownScript': '未知脚本',
            'noDescription': '无描述',
            'installCount': '安装',
            'updatedTime': '更新',
            'hideFloatQuestion': '是否仅本次隐藏悬浮窗？\n点击[确定]临时隐藏。\n点击[取消]将在设置中永久关闭悬浮窗。',
            'restoreFloatTitle': '显示UserJS设置',
            'menuSettings': 'UserJS设置',
            'yesterday': '昨天',
            'daysAgo': '{days}天前',
            'weeksAgo': '{weeks}周前',
            'monthsAgo': '{months}个月前',
            'language': '语言',
            'loading': '正在加载...'
        },
        // 繁体中文
        'zh-TW': {
            'settings': '設定',
            'autoShow': '自動顯示腳本列表',
            'floatButtonsVisible': '顯示側邊懸浮按鈕',
            'showRestoreButton': '顯示恢復設定按鈕',
            'save': '儲存',
            'cancel': '取消',
            'matchingScripts': '可匹配的腳本',
            'currentWebsite': '當前網站',
            'sort': '排序',
            'default': '預設',
            'installsDesc': '安裝量(高↓)',
            'updatedDesc': '更新時間(新↓)',
            'noScripts': '暫無可用腳本',
            'install': '安裝',
            'details': '詳情',
            'unknownScript': '未知腳本',
            'noDescription': '無描述',
            'installCount': '安裝',
            'updatedTime': '更新',
            'hideFloatQuestion': '是否僅本次隱藏懸浮窗？\n點擊[確定]臨時隱藏。\n點擊[取消]將在設定中永久關閉懸浮窗。',
            'restoreFloatTitle': '顯示UserJS設定',
            'menuSettings': 'UserJS設定',
            'yesterday': '昨天',
            'daysAgo': '{days}天前',
            'weeksAgo': '{weeks}周前',
            'monthsAgo': '{months}個月前',
            'language': '語言',
            'loading': '正在載入...'
        },
        // 英文
        'en': {
            'settings': 'Settings',
            'autoShow': 'Auto show script list',
            'floatButtonsVisible': 'Show sidebar float buttons',
            'showRestoreButton': 'Show restore settings button',
            'save': 'Save',
            'cancel': 'Cancel',
            'matchingScripts': 'Matching Scripts',
            'currentWebsite': 'Current Website',
            'sort': 'Sort',
            'default': 'Default',
            'installsDesc': 'Installs (High↓)',
            'updatedDesc': 'Updated (New↓)',
            'noScripts': 'No available scripts',
            'install': 'Install',
            'details': 'Details',
            'unknownScript': 'Unknown Script',
            'noDescription': 'No description',
            'installCount': 'Installs',
            'updatedTime': 'Updated',
            'hideFloatQuestion': 'Hide floating window only this time?\nClick [OK] to hide temporarily.\nClick [Cancel] to permanently close in settings.',
            'restoreFloatTitle': 'Show UserJS Settings',
            'menuSettings': 'UserJS Settings',
            'yesterday': 'Yesterday',
            'daysAgo': '{days} days ago',
            'weeksAgo': '{weeks} weeks ago',
            'monthsAgo': '{months} months ago',
            'language': 'Language',
            'loading': 'Loading...'
        },
        // 日语
        'ja': {
            'settings': '設定',
            'autoShow': 'スクリプトリストを自動的に表示',
            'floatButtonsVisible': 'サイドフロートボタンを表示',
            'showRestoreButton': '設定復元ボタンを表示',
            'save': '保存',
            'cancel': 'キャンセル',
            'matchingScripts': '一致するスクリプト',
            'currentWebsite': '現在のウェブサイト',
            'sort': '並び替え',
            'default': 'デフォルト',
            'installsDesc': 'インストール数(高↓)',
            'updatedDesc': '更新日時(新↓)',
            'noScripts': '利用可能なスクリプトはありません',
            'install': 'インストール',
            'details': '詳細',
            'unknownScript': '不明なスクリプト',
            'noDescription': '説明なし',
            'installCount': 'インストール',
            'updatedTime': '更新',
            'hideFloatQuestion': '今回だけフローティングウィンドウを非表示にしますか？\n[OK]をクリックして一時的に非表示にします。\n[キャンセル]をクリックして設定で永久に閉じます。',
            'restoreFloatTitle': 'UserJS設定を表示',
            'menuSettings': 'UserJS設定',
            'yesterday': '昨日',
            'daysAgo': '{days}日前',
            'weeksAgo': '{weeks}週間前',
            'monthsAgo': '{months}ヶ月前',
            'language': '言語',
            'loading': '読み込み中...'
        },
        // 韩语
        'ko': {
            'settings': '설정',
            'autoShow': '스크립트 목록 자동 표시',
            'floatButtonsVisible': '사이드 플로팅 버튼 표시',
            'showRestoreButton': '설정 복원 버튼 표시',
            'save': '저장',
            'cancel': '취소',
            'matchingScripts': '일치하는 스크립트',
            'currentWebsite': '현재 웹사이트',
            'sort': '정렬',
            'default': '기본',
            'installsDesc': '설치량(높음↓)',
            'updatedDesc': '업데이트 시간(최근↓)',
            'noScripts': '사용 가능한 스크립트가 없습니다',
            'install': '설치',
            'details': '세부 정보',
            'unknownScript': '알 수 없는 스크립트',
            'noDescription': '설명 없음',
            'installCount': '설치',
            'updatedTime': '업데이트',
            'hideFloatQuestion': '플로팅 창을 이번만 숨기시겠습니까?\n[확인]을 클릭하여 일시적으로 숨깁니다.\n[취소]를 클릭하여 설정에서 영구히 닫습니다.',
            'restoreFloatTitle': 'UserJS 설정 표시',
            'menuSettings': 'UserJS 설정',
            'yesterday': '어제',
            'daysAgo': '{days}일 전',
            'weeksAgo': '{weeks}주 전',
            'monthsAgo': '{months}개월 전',
            'language': '언어',
            'loading': '로딩 중...'
        }
    };

    // 获取用户语言
    function getUserLanguage() {
        // 优先使用用户保存的语言设置
        const savedLang = GM_getValue('jae_userscript_language');
        if (savedLang && i18n[savedLang]) {
            return savedLang;
        }
        
        // 否则使用浏览器语言
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0];
        
        // 查找匹配的语言
        for (const lang in i18n) {
            if (lang.startsWith(langCode)) {
                return lang;
            }
        }
        
        // 默认使用中文简体
        return 'zh-CN';
    }

    // 获取翻译文本
    function t(key, replacements = {}) {
        const lang = getUserLanguage();
        const translations = i18n[lang] || i18n['en'];
        let text = translations[key] || key;
        
        // 替换占位符
        for (const [placeholder, value] of Object.entries(replacements)) {
            text = text.replace(`{${placeholder}}`, value);
        }
        
        return text;
    }

    class FetchUserjs {
        constructor() {
            this.host = this.getMainHost();
            this.quietKey = 'jae_fetch_userjs_quiet';
            this.countKey = 'jae_fetch_userjs_count';
            this.settingsKey = 'jae_fetch_userjs_settings';
            this.currentScriptList = [];
            this.settings = this.loadSettings();
            
            GM_addStyle(CSS);
        }

        getMainHost() {
            const host = window.location.hostname;
            try {
                if (typeof psl !== 'undefined' && psl?.get) {
                    return psl.get(host) || host;
                }
                return host.split('.').slice(-2).join('.');
            } catch (e) {
                return host;
            }
        }

        getCountData() {
            try {
                const countData = GM_getResourceText('count');
                if (!countData) return 0;
                const data = JSON.parse(countData);
                return data[this.host] || 0;
            } catch (e) {
                console.error('Data Parse Error:', e);
                return 0;
            }
        }

        fetchScriptList(host) {
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://greasyfork.org/zh-CN/scripts/by-site/${encodeURIComponent(host)}.json`,
                    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; My Userscript Optimized)' },
                    timeout: 10000,
                    onload: (res) => {
                        if (res.status === 200) {
                            try {
                                resolve(JSON.parse(res.responseText) || []);
                            } catch { resolve([]); }
                        } else {
                            resolve([]);
                        }
                    },
                    onerror: () => resolve([]),
                    ontimeout: () => resolve([])
                });
            });
        }

        formatDate(dateStr) {
            const date = new Date(dateStr);
            const diffDays = Math.ceil(Math.abs(new Date() - date) / (86400000));
            if (diffDays === 1) return t('yesterday');
            if (diffDays < 7) return t('daysAgo', { days: diffDays });
            if (diffDays < 30) return t('weeksAgo', { weeks: Math.ceil(diffDays / 7) });
            return t('monthsAgo', { months: Math.ceil(diffDays / 30) });
        }

        formatNumber(num) {
            if (!num) return '0';
            if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
            if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
            return num.toString();
        }

        loadSettings() {
            return GM_getValue(this.settingsKey, { autoShow: false, floatButtonsVisible: true, showRestoreButton: true });
        }

        saveSettings(newSettings) {
            GM_setValue(this.settingsKey, newSettings);
            this.settings = newSettings;
            this.render(); // Re-render to reflect changes
        }

        createEl(html) {
            const div = document.createElement('div');
            div.innerHTML = html.trim();
            return div.firstChild;
        }

        renderSettings() {
            if (document.getElementById('jae_settings_box')) return;
            
            const html = `
                <div id="jae_settings_box">
                    <div style="font-weight:bold;font-size:18px;margin-bottom:15px;text-align:center;">${t('settings')}</div>
                    <label style="display:block;margin-bottom:15px;cursor:pointer;">
                        <input type="checkbox" id="auto-show-setting" ${this.settings.autoShow ? 'checked' : ''}> ${t('autoShow')}
                    </label>
                    <label style="display:block;margin-bottom:15px;cursor:pointer;">
                        <input type="checkbox" id="float-buttons-setting" ${this.settings.floatButtonsVisible ? 'checked' : ''}> ${t('floatButtonsVisible')}
                    </label>
                    <label style="display:block;margin-bottom:15px;cursor:pointer;">
                        <input type="checkbox" id="show-restore-setting" ${this.settings.showRestoreButton ? 'checked' : ''}> ${t('showRestoreButton')}
                    </label>
                    <label style="display:block;margin-bottom:20px;cursor:pointer;">
                        ${t('language')}: <select id="language-select" class="language-select">
                            <option value="zh-CN" ${getUserLanguage() === 'zh-CN' ? 'selected' : ''}>简体中文</option>
                            <option value="zh-TW" ${getUserLanguage() === 'zh-TW' ? 'selected' : ''}>繁体中文</option>
                            <option value="en" ${getUserLanguage() === 'en' ? 'selected' : ''}>English</option>
                            <option value="ja" ${getUserLanguage() === 'ja' ? 'selected' : ''}>日本語</option>
                            <option value="ko" ${getUserLanguage() === 'ko' ? 'selected' : ''}>한국어</option>
                        </select>
                    </label>
                    <div style="text-align:center;">
                        <button id="save-settings" style="padding:5px 15px;margin-right:10px;">${t('save')}</button>
                        <button id="cancel-settings" style="padding:5px 15px;">${t('cancel')}</button>
                    </div>
                </div>`;
            
            document.body.appendChild(this.createEl(html));

            document.getElementById('save-settings').onclick = () => {
                // 保存语言设置
                const selectedLang = document.getElementById('language-select').value;
                GM_setValue('jae_userscript_language', selectedLang);
                
                this.saveSettings({
                    autoShow: document.getElementById('auto-show-setting').checked,
                    floatButtonsVisible: document.getElementById('float-buttons-setting').checked,
                    showRestoreButton: document.getElementById('show-restore-setting').checked
                });
                document.getElementById('jae_settings_box').remove();
            };
            document.getElementById('cancel-settings').onclick = () => document.getElementById('jae_settings_box').remove();
        }

        sortScripts(list, method) {
            const sorted = [...list];
            sorted.sort((a, b) => {
                switch(method) {
                    case 'installs_desc': return (b.total_installs || 0) - (a.total_installs || 0);
                    case 'installs_asc': return (a.total_installs || 0) - (b.total_installs || 0);
                    case 'updated_desc': return new Date(b.code_updated_at) - new Date(a.code_updated_at);
                    case 'updated_asc': return new Date(a.code_updated_at) - new Date(b.code_updated_at);
                    default: return 0;
                }
            });
            return sorted;
        }

        renderScriptList(list) {
            const container = document.querySelector('.script-list');
            if (!list.length) {
                container.innerHTML = `<div style="text-align:center;padding:20px;color:#666;">${t('noScripts')}</div>`;
                return;
            }

            container.innerHTML = '';
            list.forEach(script => {
                const item = document.createElement('div');
                item.className = 'script-item';
                
                // Safe text content setting to prevent XSS
                const safeName = script.name || t('unknownScript');
                const safeDesc = script.description || t('noDescription');
                
                item.innerHTML = `
                    <div class="script-name"></div>
                    <div class="script-desc"></div>
                    <div class="script-meta">
                        <span class="script-meta-item installs">${t('installCount')}: ${this.formatNumber(script.total_installs)}</span>
                        <span class="script-meta-item updated">${t('updatedTime')}: ${this.formatDate(script.code_updated_at)}</span>
                    </div>
                    <div class="script-actions">
                        <a href="https://greasyfork.org/zh-CN/scripts/${script.id}" target="_blank" class="script-install secondary">${t('details')}</a>
                        <button class="script-install primary">${t('install')}</button>
                    </div>
                `;
                
                item.querySelector('.script-name').textContent = safeName;
                item.querySelector('.script-desc').textContent = safeDesc;
                
                // 为安装按钮添加点击事件，使用GM_openInTab直接打开脚本URL，油猴会自动处理安装
                const installBtn = item.querySelector('.script-install.primary');
                installBtn.onclick = () => {
                    if (script.code_url) {
                        GM_openInTab(script.code_url, { active: true, insert: true });
                    }
                };
                
                container.appendChild(item);
            });
        }

        showScriptBox() {
            let box = document.getElementById('jae_userscript_box');
            if (!box) {
                const html = `
                    <div id="jae_userscript_box" class="jae-userscript">
                        <div style="padding:10px;border-bottom:1px solid #eee;position:relative;">
                            <strong>${t('matchingScripts')}</strong>
                            <div style="font-size:12px;color:#666;">${t('currentWebsite')}: ${this.host}</div>
                            <button class="close-btn" id="close-script-box">✕</button>
                        </div>
                        <div class="sort-controls">
                            ${t('sort')}: <select id="sort-method" class="sort-select">
                                <option value="default">${t('default')}</option>
                                <option value="installs_desc">${t('installsDesc')}</option>
                                <option value="updated_desc">${t('updatedDesc')}</option>
                            </select>
                        </div>
                        <div class="script-list">${t('loading')}</div>
                    </div>`;
                document.body.appendChild(this.createEl(html));
                box = document.getElementById('jae_userscript_box');
                
                document.getElementById('close-script-box').onclick = () => box.style.display = 'none';
                
                document.getElementById('sort-method').onchange = (e) => {
                    this.renderScriptList(this.sortScripts(this.currentScriptList, e.target.value));
                };

                this.fetchScriptList(this.host).then(list => {
                    this.currentScriptList = list;
                    this.renderScriptList(list);
                });
            }
            box.style.display = 'block';
        }

        createFloatButtons() {
            if (document.getElementById('jae_float_container')) return;

            const html = `
                <div id="jae_float_container">
                    <button id="jae_btn_show" class="jae-float-btn" style="background:#4CAF50;height:80px;writing-mode:vertical-lr;font-weight:bold;">UserJS</button>
                    <button id="jae_btn_settings" class="jae-float-btn" style="background:#FF9800;height:40px;">⚙️</button>
                    <button id="jae_btn_close" class="jae-float-btn" style="background:#f44336;height:30px;font-weight:bold;">✕</button>
                </div>`;
            document.body.appendChild(this.createEl(html));

            document.getElementById('jae_btn_show').onclick = () => this.showScriptBox();
            document.getElementById('jae_btn_settings').onclick = () => this.renderSettings();
            
            // Close logic
            document.getElementById('jae_btn_close').onclick = (e) => {
                e.stopPropagation();
                if(confirm(t('hideFloatQuestion'))) {
                    sessionStorage.setItem(this.quietKey, 'true');
                    this.render();
                } else {
                    this.saveSettings({...this.settings, floatButtonsVisible: false});
                }
            };
        }

        render() {
            const isQuiet = sessionStorage.getItem(this.quietKey);
            const container = document.getElementById('jae_float_container');
            const restoreBtn = document.getElementById('jae_restore_float_btn');

            // 处理悬浮按钮显示
            if (this.settings.floatButtonsVisible && !isQuiet) {
                this.createFloatButtons();
                if (restoreBtn) restoreBtn.remove();
            } else {
                if (container) container.remove();
                // 只有当设置允许时才显示恢复小按钮
                if (!restoreBtn && this.settings.showRestoreButton) {
                    const btn = this.createEl(`<div id="jae_restore_float_btn" title="${t('restoreFloatTitle')}">⚙️</div>`);
                    btn.onclick = () => {
                        sessionStorage.removeItem(this.quietKey);
                        this.renderSettings();
                    };
                    
                    // 添加拖拽功能
                    let isDragging = false;
                    let startX, startY, offsetX, offsetY;
                    
                    btn.addEventListener('mousedown', (e) => {
                        if (e.target === btn) {
                            isDragging = true;
                            startX = e.clientX;
                            startY = e.clientY;
                            const rect = btn.getBoundingClientRect();
                            offsetX = startX - rect.left;
                            offsetY = startY - rect.top;
                            btn.style.cursor = 'grabbing';
                        }
                    });
                    
                    document.addEventListener('mousemove', (e) => {
                        if (isDragging) {
                            const newX = e.clientX - offsetX;
                            const newY = e.clientY - offsetY;
                            
                            // 确保按钮不会移出视口
                            const maxX = window.innerWidth - btn.offsetWidth;
                            const maxY = window.innerHeight - btn.offsetHeight;
                            const finalX = Math.max(0, Math.min(maxX, newX));
                            const finalY = Math.max(0, Math.min(maxY, newY));
                            
                            btn.style.left = finalX + 'px';
                            btn.style.top = finalY + 'px';
                            btn.style.bottom = 'auto';
                            btn.style.right = 'auto';
                        }
                    });
                    
                    document.addEventListener('mouseup', () => {
                        if (isDragging) {
                            isDragging = false;
                            btn.style.cursor = 'pointer';
                        }
                    });
                    
                    document.body.appendChild(btn);
                } else if (restoreBtn && !this.settings.showRestoreButton) {
                    // 如果设置不允许显示恢复按钮，并且当前有恢复按钮，则移除
                    restoreBtn.remove();
                }
            }

            // 处理自动弹窗
            if (this.settings.autoShow && !isQuiet) {
                const count = this.getCountData();
                if (count > 0) this.showScriptBox();
            }
        }
    }

    // 创建FetchUserjs实例
    const fetchUserjs = new FetchUserjs();
    
    // 注册油猴菜单命令
    GM_registerMenuCommand(t('menuSettings'), () => {
        // 清除会话级别的隐藏标记，确保设置界面可以显示
        sessionStorage.removeItem(fetchUserjs.quietKey);
        // 渲染设置界面
        fetchUserjs.renderSettings();
    }, 'S');
    
    // 初始化渲染
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => fetchUserjs.render());
    } else {
        fetchUserjs.render();
    }

})();
