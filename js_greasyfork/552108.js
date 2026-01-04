// ==UserScript==
// @name         课程直播关键词检测助手
// @namespace    https://jabofish.top/
// @version      0.5.2
// @description  通过关键词列表（支持中/英文/正则/拟音词）和智能拼音匹配，在直播中检测“签到”等事件，并提供分级提醒。带有历史记录、配置导入导出及恢复默认功能。
// @author       Jabofish
// @match        https://classroom.zju.edu.cn/*
// @match        https://interactivemeta.cmc.zju.edu.cn/*
// @require      https://unpkg.com/pinyin-pro@3.27.0/dist/index.js
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/552108/%E8%AF%BE%E7%A8%8B%E7%9B%B4%E6%92%AD%E5%85%B3%E9%94%AE%E8%AF%8D%E6%A3%80%E6%B5%8B%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/552108/%E8%AF%BE%E7%A8%8B%E7%9B%B4%E6%92%AD%E5%85%B3%E9%94%AE%E8%AF%8D%E6%A3%80%E6%B5%8B%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const defaultConfig = {
        coreKeywords: [
            "签到", "签个到", "打卡", "打个卡", "扫码", "报到",
            "点名", "点个名", "点一下名", "点一次名", "有没有到", "在的同学", "雷达点名", "数字签到", "雷达", "名字", "点几个名", "点几个人", "点一个人", "点人",
            "小测", "小测试", "随堂", "课堂练习", "做个题", "做道题", "答题", "测验", "测试", "考试", "评测", "这道题", "这个题",
            "学在浙大", "智云", "智慧树"
        ],
        englishKeywords: [
            "quiz", "test", "exam"
        ],
        regexKeywords: [
            "签.*到","打.*卡","点.*名","报.*到","刷.*脸","在.*在","扫.*码","做.*题","小.*测","考.*试","提.*交","随堂.*(测|练习|考)","课堂.*(测|练习|考)","抢.*答","投.*票","举.*手","回.*答"
        ],
        englishHomophoneKeywords: [
            { word: "quiz", homophones: ["馈字", "亏此", "鬼次", "柜子", "亏死", "贵司", "筷子", "快吃", "拐子", "怪词"] },
            { word: "test", homophones: ["泰斯特"] }
        ],
        alerts: {
            visual: true,
            sound: true,
            system: true
        }
    };

    let detectionHistory = [];

    function loadConfig() {
        const storedCore = GM_getValue('coreKeywords');
        const storedEnglish = GM_getValue('englishKeywords');
        const storedRegex = GM_getValue('regexKeywords');
        const storedHomophones = GM_getValue('englishHomophoneKeywords');
        const storedAlerts = GM_getValue('alerts');

        return {
            coreKeywords: Array.isArray(storedCore) ? storedCore : defaultConfig.coreKeywords,
            englishKeywords: Array.isArray(storedEnglish) ? storedEnglish : defaultConfig.englishKeywords,
            regexKeywords: Array.isArray(storedRegex) ? storedRegex : defaultConfig.regexKeywords,
            englishHomophoneKeywords: Array.isArray(storedHomophones) ? storedHomophones : defaultConfig.englishHomophoneKeywords,
            alerts: (storedAlerts && typeof storedAlerts === 'object') ? { ...defaultConfig.alerts, ...storedAlerts } : defaultConfig.alerts
        };
    }

    function saveConfig(config) {
        GM_setValue('coreKeywords', config.coreKeywords);
        GM_setValue('englishKeywords', config.englishKeywords);
        GM_setValue('regexKeywords', config.regexKeywords);
        GM_setValue('englishHomophoneKeywords', config.englishHomophoneKeywords);
        GM_setValue('alerts', config.alerts);
    }

    let currentConfig = loadConfig();
    let pinyinKeywords, pinyinHomophoneKeywords;

    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = 'keyword-helper-settings-panel';
        panel.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 650px; max-width: 90vw; max-height: 85vh; background-color: #f0f2f5; color: #333;
            border: 1px solid #ccc; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.2);
            z-index: 100000; display: none; padding: 25px; font-family: sans-serif;
            display: flex; flex-direction: column;
        `;

        panel.innerHTML = `
            <h2 style="text-align: center; margin-top: 0; margin-bottom: 20px; color: #1a1a1a;">关键词检测助手设置</h2>
            <div id="khs-settings-content" style="overflow-y: auto; padding-right: 15px;">
                <label style="font-weight: bold; display: block; margin-bottom: 8px;">中文核心关键词 (每行一个):</label>
                <textarea id="khs-core" style="width: 100%; height: 100px; margin-bottom: 15px; border-radius: 6px; border: 1px solid #ccc; padding: 8px; box-sizing: border-box;"></textarea>

                <label style="font-weight: bold; display: block; margin-bottom: 8px;">英文关键词 (每行一个):</label>
                <textarea id="khs-english" style="width: 100%; height: 60px; margin-bottom: 15px; border-radius: 6px; border: 1px solid #ccc; padding: 8px; box-sizing: border-box;"></textarea>

                <label style="font-weight: bold; display: block; margin-bottom: 8px;">正则表达式 (每行一个):</label>
                <textarea id="khs-regex" style="width: 100%; height: 60px; margin-bottom: 15px; border-radius: 6px; border: 1px solid #ccc; padding: 8px; box-sizing: border-box;"></textarea>

                <label style="font-weight: bold; display: block; margin-bottom: 8px;">英文拟音词 (点击“+”添加):</label>
                <div id="khs-homophones-editor" style="width: 100%; min-height: 100px; margin-bottom: 20px; border-radius: 6px; border: 1px solid #ccc; padding: 10px; background-color: white; box-sizing: border-box;"></div>
                <button id="khs-add-new-word" style="margin-bottom: 20px; padding: 5px 10px; border-radius: 4px; border: 1px solid #007bff; background-color: #e7f3ff; color: #007bff; cursor: pointer;">+ 添加新英文词条</button>

                <label style="font-weight: bold; display: block; margin-bottom: 10px;">提醒方式:</label>
                <div style="display: flex; gap: 20px; margin-bottom: 25px;">
                    <label><input type="checkbox" id="khs-alert-visual"> 网页视觉提醒</label>
                    <label><input type="checkbox" id="khs-alert-sound"> 声音提醒</label>
                    <label><input type="checkbox" id="khs-alert-system"> 系统桌面通知</label>
                </div>
            </div>
            <div style="margin-top: auto; text-align: right; padding-top: 20px; border-top: 1px solid #ddd; display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 10px;">
                <button id="khs-restore" style="background-color: #dc3545; color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; margin-right: auto;">恢复默认</button>
                <button id="khs-import" style="background-color: #5bc0de; color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer;">导入配置</button>
                <button id="khs-export" style="background-color: #5bc0de; color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer;">导出配置</button>
                <button id="khs-test" style="background-color: #f0ad4e; color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer;">测试提醒</button>
                <button id="khs-save" style="background-color: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">保存并关闭</button>
                <button id="khs-close" style="background-color: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">关闭</button>
            </div>
        `;
        document.body.appendChild(panel);

        document.getElementById('khs-save').addEventListener('click', saveAndClose);
        document.getElementById('khs-close').addEventListener('click', () => { panel.style.display = 'none'; });
        document.getElementById('khs-test').addEventListener('click', testNotifications);
        document.getElementById('khs-export').addEventListener('click', exportConfig);
        document.getElementById('khs-import').addEventListener('click', importConfig);
        document.getElementById('khs-add-new-word').addEventListener('click', () => createHomophoneEntry());
        document.getElementById('khs-homophones-editor').addEventListener('click', handleHomophoneEditorClicks);
        document.getElementById('khs-restore').addEventListener('click', restoreDefaults);

        return panel;
    }

    function handleHomophoneEditorClicks(event) {
        const target = event.target;
        if (target.classList.contains('remove-tag')) {
            target.parentElement.remove();
        } else if (target.classList.contains('add-homophone-btn')) {
            const input = target.previousElementSibling;
            const value = input.value.trim();
            if (value) {
                const tagContainer = target.parentElement.querySelector('.homophone-tags');
                const newTag = document.createElement('span');
                newTag.className = 'homophone-tag';
                newTag.textContent = value;
                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-tag';
                removeBtn.textContent = '×';
                newTag.appendChild(removeBtn);
                tagContainer.appendChild(newTag);
                input.value = '';
                input.focus();
            }
        } else if (target.classList.contains('remove-entry-btn')) {
            target.closest('.homophone-entry').remove();
        }
    }

    function createHomophoneEntry(entry = { word: '', homophones: [] }) {
        const editor = document.getElementById('khs-homophones-editor');
        const entryDiv = document.createElement('div');
        entryDiv.className = 'homophone-entry';
        entryDiv.style.cssText = `
            display: flex; flex-wrap: wrap; align-items: center; gap: 8px;
            padding: 10px; border: 1px solid #e0e0e0; border-radius: 5px; margin-bottom: 10px;
        `;

        const tagsHTML = entry.homophones.map(h => `
            <span class="homophone-tag">${h}<button class="remove-tag">×</button></span>
        `).join('');

        entryDiv.innerHTML = `
            <input type="text" class="homophone-word" placeholder="英文词" value="${entry.word}" style="padding: 5px; border: 1px solid #ccc; border-radius: 4px; width: 80px;">
            <div class="homophone-tags" style="display: flex; flex-wrap: wrap; gap: 5px; flex: 1; min-width: 200px; border-left: 2px solid #007bff; padding-left: 8px;">
                ${tagsHTML}
            </div>
            <div class="add-homophone-controls" style="display: flex; gap: 5px;">
                <input type="text" class="new-homophone-input" placeholder="添加拟音词" style="padding: 5px; border: 1px solid #ccc; border-radius: 4px;">
                <button type="button" class="add-homophone-btn" style="padding: 5px 10px; border: none; background-color: #28a745; color: white; border-radius: 4px; cursor: pointer;">+</button>
            </div>
            <button type="button" class="remove-entry-btn" style="padding: 5px 10px; border: none; background-color: #dc3545; color: white; border-radius: 4px; cursor: pointer;">-</button>
        `;
        editor.appendChild(entryDiv);
        const style = document.createElement('style');
        style.textContent = `
            .homophone-tag { background-color: #007bff; color: white; padding: 3px 8px; border-radius: 12px; font-size: 14px; display: inline-flex; align-items: center; }
            .remove-tag { background: none; border: none; color: white; margin-left: 5px; cursor: pointer; font-weight: bold; padding: 0; line-height: 1; }
        `;
        editor.appendChild(style);
    }

    function buildHomophoneEditor(homophoneData) {
        const editor = document.getElementById('khs-homophones-editor');
        editor.innerHTML = '';
        homophoneData.forEach(entry => createHomophoneEntry(entry));
    }

    function saveAndClose() {
        const newHomophones = [];
        document.querySelectorAll('#khs-homophones-editor .homophone-entry').forEach(entryEl => {
            const word = entryEl.querySelector('.homophone-word').value.trim();
            if (!word) return;
            const homophones = Array.from(entryEl.querySelectorAll('.homophone-tags .homophone-tag'))
                                  .map(tagEl => tagEl.firstChild.textContent.trim());
            if (homophones.length > 0) {
                newHomophones.push({ word, homophones });
            }
        });

        currentConfig = {
            coreKeywords: document.getElementById('khs-core').value.split('\n').map(k => k.trim()).filter(Boolean),
            englishKeywords: document.getElementById('khs-english').value.split('\n').map(k => k.trim()).filter(Boolean),
            regexKeywords: document.getElementById('khs-regex').value.split('\n').map(k => k.trim()).filter(Boolean),
            englishHomophoneKeywords: newHomophones,
            alerts: {
                visual: document.getElementById('khs-alert-visual').checked,
                sound: document.getElementById('khs-alert-sound').checked,
                system: document.getElementById('khs-alert-system').checked,
            }
        };
        saveConfig(currentConfig);
        updatePinyinData();
        console.log("配置已保存并立即生效！");
        document.getElementById('keyword-helper-settings-panel').style.display = 'none';
    }

    function openSettingsPanel() {
        let panel = document.getElementById('keyword-helper-settings-panel');
        if (!panel) {
            panel = createSettingsPanel();
        }

        document.getElementById('khs-core').value = currentConfig.coreKeywords.join('\n');
        document.getElementById('khs-english').value = currentConfig.englishKeywords.join('\n');
        document.getElementById('khs-regex').value = currentConfig.regexKeywords.join('\n');
        buildHomophoneEditor(currentConfig.englishHomophoneKeywords);
        document.getElementById('khs-alert-visual').checked = currentConfig.alerts.visual;
        document.getElementById('khs-alert-sound').checked = currentConfig.alerts.sound;
        document.getElementById('khs-alert-system').checked = currentConfig.alerts.system;

        panel.style.display = 'flex';
    }

    function restoreDefaults() {
        if (!confirm("您确定要将所有设置恢复为默认值吗？\n此操作会覆盖您当前的配置，但需要点击“保存”后才会生效。")) {
            return;
        }

        document.getElementById('khs-core').value = defaultConfig.coreKeywords.join('\n');
        document.getElementById('khs-english').value = defaultConfig.englishKeywords.join('\n');
        document.getElementById('khs-regex').value = defaultConfig.regexKeywords.join('\n');
        buildHomophoneEditor(defaultConfig.englishHomophoneKeywords);
        document.getElementById('khs-alert-visual').checked = defaultConfig.alerts.visual;
        document.getElementById('khs-alert-sound').checked = defaultConfig.alerts.sound;
        document.getElementById('khs-alert-system').checked = defaultConfig.alerts.system;

        alert('已在面板中载入默认配置。\n请点击“保存并关闭”以应用更改。');
    }

    function exportConfig() {
        const configString = JSON.stringify(currentConfig, null, 2);
        const blob = new Blob([configString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'keyword-helper-config.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function importConfig() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,application/json';
        input.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = readerEvent => {
                try {
                    const importedConfig = JSON.parse(readerEvent.target.result);
                    if (importedConfig.coreKeywords && importedConfig.englishKeywords && importedConfig.englishHomophoneKeywords && importedConfig.alerts) {
                        document.getElementById('khs-core').value = importedConfig.coreKeywords.join('\n');
                        document.getElementById('khs-english').value = importedConfig.englishKeywords.join('\n');
                        document.getElementById('khs-regex').value = (importedConfig.regexKeywords || []).join('\n');
                        buildHomophoneEditor(importedConfig.englishHomophoneKeywords);
                        document.getElementById('khs-alert-visual').checked = importedConfig.alerts.visual;
                        document.getElementById('khs-alert-sound').checked = importedConfig.alerts.sound;
                        document.getElementById('khs-alert-system').checked = importedConfig.alerts.system;
                        alert('配置已成功载入，请点击“保存并关闭”以应用。');
                    } else {
                        alert('导入失败：配置文件格式不正确。');
                    }
                } catch (err) {
                    alert('导入失败：无法解析文件。\n' + err.message);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    function testNotifications() {
        const tempAlerts = {
            visual: document.getElementById('khs-alert-visual').checked,
            sound: document.getElementById('khs-alert-sound').checked,
            system: document.getElementById('khs-alert-system').checked
        };
        triggerNotification("测试", "这是一条测试提醒", "手动测试", tempAlerts);
        alert("已触发测试提醒，请检查声音、视觉和桌面通知是否正常。");
    }

    function createHistoryPanel() {
        const panel = document.createElement('div');
        panel.id = 'keyword-helper-history-panel';
        panel.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; width: 400px; max-width: 90vw;
            max-height: 300px; background-color: rgba(255, 255, 255, 0.95); color: #333;
            border: 1px solid #ccc; border-radius: 10px; box-shadow: 0 4px 16px rgba(0,0,0,0.2);
            z-index: 99998; display: none; flex-direction: column; font-family: sans-serif;
        `;
        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; background-color: #f7f7f7; border-bottom: 1px solid #ddd; border-radius: 10px 10px 0 0;">
                <h3 style="margin: 0; font-size: 16px; color: #1a1a1a;">关键词检测历史</h3>
                <div id="khh-actions">
                    <button id="khh-clear" style="border:none; background: #ffc107; color: white; padding: 4px 8px; border-radius: 4px; cursor: pointer; margin-right: 5px;">清空</button>
                    <button id="khh-close" style="border:none; background: #6c757d; color: white; padding: 4px 8px; border-radius: 4px; cursor: pointer;">关闭</button>
                </div>
            </div>
            <div id="khh-content" style="overflow-y: auto; padding: 10px 15px; flex-grow: 1; font-size: 14px; line-height: 1.6;"></div>
        `;
        document.body.appendChild(panel);
        document.getElementById('khh-close').addEventListener('click', () => panel.style.display = 'none');
        document.getElementById('khh-clear').addEventListener('click', () => {
            detectionHistory = [];
            updateHistoryDisplay();
        });
        return panel;
    }

    function updateHistoryDisplay() {
        const content = document.getElementById('khh-content');
        if (!content) return;
        if (detectionHistory.length === 0) {
            content.innerHTML = '<p style="color: #888; text-align: center; margin-top: 20px;">暂无记录</p>';
            return;
        }
        content.innerHTML = detectionHistory.slice().reverse().map(entry => `
            <div style="border-bottom: 1px dashed #eee; padding-bottom: 5px; margin-bottom: 5px;">
                <strong style="color: #007bff;">[${entry.time}]</strong> [${entry.matchType}] <strong>"${entry.keyword}"</strong>
                <br>
                <span style="color: #555;">${entry.fullText}</span>
            </div>
        `).join('');
    }

    function toggleHistoryPanel() {
        let panel = document.getElementById('keyword-helper-history-panel');
        if (!panel) {
            panel = createHistoryPanel();
        }
        panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
        if (panel.style.display === 'flex') {
            updateHistoryDisplay();
        }
    }

    function isPlayback() {
        const zjuClassroomPlaybackElement = document.querySelector('.course-info__header-livingstatus.header-status-video');
        if (zjuClassroomPlaybackElement && zjuClassroomPlaybackElement.textContent.trim() === '回放') {
            return true;
        }
        if (window.location.href.includes('replay')) {
            return true;
        }
        return false;
    }

    function startScript() {
        setTimeout(() => {
            if (isPlayback()) {
                return;
            }
            GM_registerMenuCommand('设置关键词与提醒', openSettingsPanel);
            GM_registerMenuCommand('显示/隐藏历史记录', toggleHistoryPanel);
            createHistoryPanel();
            initializeCoreLogic();
        }, 1500);
    }

    function updatePinyinData() {
        pinyinKeywords = currentConfig.coreKeywords.map(k => ({
            chinese: k,
            pinyin: pinyinPro.pinyin(k, { toneType: 'none', type: 'array' })
        }));
        pinyinHomophoneKeywords = currentConfig.englishHomophoneKeywords.map(item => ({
            word: item.word,
            pinyinSets: item.homophones.map(h => pinyinPro.pinyin(h, { toneType: 'none', type: 'array' }))
        }));
    }

    let audioContext = null;
    function playAlertSound() {
        if (!audioContext) {
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) { return; }
        }
        const playSingleBeep = () => {
            if (audioContext.state !== 'running') return;
            try {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.05);
                oscillator.start(audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.4);
                oscillator.stop(audioContext.currentTime + 0.5);
            } catch (e) {}
        };
        if (audioContext.state === 'suspended') {
            audioContext.resume().then(playSingleBeep).catch(e => {});
        } else {
            playSingleBeep();
        }
    }

    function showVisualAlert(message) {
        const notification = document.createElement('div');
        notification.style.whiteSpace = 'pre-wrap';
        notification.innerHTML = message;
        Object.assign(notification.style, {
            position: 'fixed', top: '20px', right: '20px', backgroundColor: '#ff4757', color: 'white',
            padding: '15px 25px', borderRadius: '8px', zIndex: '99999', fontSize: '18px', fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)', opacity: '0', transform: 'translateX(100%)',
            transition: 'opacity 0.5s ease, transform 0.5s ease', maxWidth: '400px'
        });
        const keywordSpanStyle = `
            color: #ffff00; font-weight: 900; background-color: rgba(0, 0, 0, 0.2);
            padding: 2px 6px; border-radius: 4px;
        `;
        notification.querySelectorAll('span').forEach(span => { span.style.cssText = keywordSpanStyle; });
        document.body.appendChild(notification);
        setTimeout(() => { notification.style.opacity = '1'; notification.style.transform = 'translateX(0)'; }, 100);
        setTimeout(() => {
            notification.style.opacity = '0'; notification.style.transform = 'translateX(100%)';
            setTimeout(() => { if (notification.parentNode) { notification.parentNode.removeChild(notification); } }, 500);
        }, 8000);
    }

    function showSystemNotification(title, body) {
        if (Notification.permission === 'granted') {
            new Notification(title, { body });
        }
    }

    function triggerNotification(keyword, fullText, matchType, alertConfig = currentConfig.alerts) {
        const historyEntry = {
            time: new Date().toLocaleTimeString(),
            keyword,
            fullText,
            matchType
        };
        detectionHistory.push(historyEntry);
        updateHistoryDisplay();

        const visualMessage = `【${matchType}】\n检测到关键词: "<span>${keyword}</span>"\n完整内容: "${fullText}"`;
        const systemMessage = `【${matchType}】检测到关键词: "${keyword}"\n完整内容: "${fullText}"`;

        if (alertConfig.sound) playAlertSound();
        if (alertConfig.visual) showVisualAlert(visualMessage);
        if (alertConfig.system) showSystemNotification('请注意！检测到关键词', systemMessage);
    }

    function initializeNotifications() {
        if (!currentConfig.alerts.system) return;
        if (!('Notification' in window)) return;
        if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    showSystemNotification('脚本已启动', '课程直播关键词检测助手正在运行...');
                }
            });
        }
    }

    function initializeCoreLogic() {
        updatePinyinData();

        const CHECKED_CLASS = 'keyword-checked-by-script-v052-configurable';

        function highlightMatchedElement(element) {
            Object.assign(element.style, { color: 'red', fontWeight: 'bold' });
        }

        function findKeywordMatch(text) {
            const lowerText = text.toLowerCase();

            const allDirectKeywords = [...currentConfig.coreKeywords, ...currentConfig.englishKeywords];
            for (const keyword of allDirectKeywords) {
                if (lowerText.includes(keyword.toLowerCase())) {
                    return { keyword: keyword, type: "完全匹配" };
                }
            }

            for (const regexStr of currentConfig.regexKeywords) {
                if (!regexStr) continue;
                try {
                    const regex = new RegExp(regexStr, 'i');
                    if (regex.test(text)) {
                        return { keyword: regexStr, type: "正则匹配" };
                    }
                } catch (e) {
                    console.error(`无效的正则表达式: "${regexStr}"`, e);
                }
            }

            const textPinyinArray = pinyinPro.pinyin(text, { toneType: 'none', type: 'array' });
            if (textPinyinArray.length === 0) return null;

            for (const item of pinyinHomophoneKeywords) {
                for (const homophonePinyin of item.pinyinSets) {
                    if (homophonePinyin.length > textPinyinArray.length) continue;
                    for (let i = 0; i <= textPinyinArray.length - homophonePinyin.length; i++) {
                        let match = true;
                        for (let j = 0; j < homophonePinyin.length; j++) { if (textPinyinArray[i + j] !== homophonePinyin[j]) { match = false; break; } }
                        if (match) { return { keyword: item.word, type: "仅拟声词匹配" }; }
                    }
                }
            }

            for (const keyword of pinyinKeywords) {
                const keywordPinyinArray = keyword.pinyin;
                if (keywordPinyinArray.length > textPinyinArray.length) continue;
                for (let i = 0; i <= textPinyinArray.length - keywordPinyinArray.length; i++) {
                    let match = true;
                    for (let j = 0; j < keywordPinyinArray.length; j++) { if (textPinyinArray[i + j] !== keywordPinyinArray[j]) { match = false; break; } }
                    if (match) { return { keyword: keyword.chinese, type: "仅拼音匹配" }; }
                }
            }
            return null;
        }

        function processTextElement(element) {
            element.classList.add(CHECKED_CLASS);
            const text = (element.textContent || element.innerText).trim();
            if (text) {
                const matchResult = findKeywordMatch(text);
                if (matchResult) {
                    triggerNotification(matchResult.keyword, text, matchResult.type);
                    highlightMatchedElement(element);
                }
            }
        }

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType !== 1) return;
                        if (node.classList.contains('video-trans-item')) {
                            const previousEl = node.previousElementSibling;
                            if (previousEl && previousEl.classList.contains('video-trans-item') && !previousEl.classList.contains(CHECKED_CLASS)) {
                                processTextElement(previousEl);
                            }
                        } else if (node.classList.contains('trans-item')) {
                            const previousEl = node.previousElementSibling;
                            if (previousEl && previousEl.classList.contains('trans-item')) {
                                const textContainer = previousEl.querySelector('.trans-lan');
                                if (textContainer && !textContainer.classList.contains(CHECKED_CLASS)) {
                                    processTextElement(textContainer);
                                }
                            }
                        }
                    });
                }
            }
        });

        initializeNotifications();
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', startScript);
    } else {
        startScript();
    }

})();