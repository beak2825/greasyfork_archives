// ==UserScript==
// @name         UCAS 自动教评 Automatic Course/Teacher Evaluation
// @namespace    local
// @version      1.0
// @description  可配置版评教脚本：带图形化设置界面，自定义概率、特殊题选项及主观题文案
// @match        https://xkcts.ucas.ac.cn:8443/evaluate/*
// @grant        none
// @license      All rights reserved
// @downloadURL https://update.greasyfork.org/scripts/562928/UCAS%20%E8%87%AA%E5%8A%A8%E6%95%99%E8%AF%84%20Automatic%20CourseTeacher%20Evaluation.user.js
// @updateURL https://update.greasyfork.org/scripts/562928/UCAS%20%E8%87%AA%E5%8A%A8%E6%95%99%E8%AF%84%20Automatic%20CourseTeacher%20Evaluation.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ============ 默认配置 ============
    const DEFAULT_CONFIG = {
        radioWeights: { '3': 15, '4': 35, '5': 50 },
        q6Choice: '1625', // 默认 A
        q7Choices: ['1632', '1633'], // 默认 B, C
        // 移除 textareaFallback，改为针对每一题的预设
        textPresets: {
            'item_1619': '相关知识的讲解和推导非常有助于学习和建立认知。',
            'item_1620': '暂时没有特别需要改进和提高的部分。',
            'item_1621': '约 4 小时左右。',
            'item_1622': '我对该学科较为感兴趣，热衷于在该领域内进行进一步学习',
            'item_1623': '保证了全部出勤，课堂回答问题较少',
            'item_1667': '最喜欢该老师的教学风格与内容，生动有启发',
            'item_1668': '暂时没有什么建议，保持现状足够'
        }
    };

    // ============ 配置存取 ============
    function loadConfig() {
        const saved = localStorage.getItem('ucas_eval_config');
        if (!saved) return DEFAULT_CONFIG;
        try {
            return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
        } catch (e) {
            console.error('配置读取失败', e);
            return DEFAULT_CONFIG;
        }
    }

    function saveConfig(config) {
        localStorage.setItem('ucas_eval_config', JSON.stringify(config));
    }

    let currentConfig = loadConfig();

    // ============ 核心逻辑区 (复用并修改为读取配置) ============

    function weightedPick(pMap) {
        const entries = Object.entries(pMap);
        const sum = entries.reduce((acc, [, p]) => acc + Number(p), 0);
        let r = Math.random() * sum;
        for (const [val, p] of entries) {
            r -= Number(p);
            if (r <= 0) return String(val);
        }
        return String(entries[entries.length - 1][0]);
    }

    // 填写通用单选
    function fillRadios() {
        const radios = Array.from(document.querySelectorAll('input[type="radio"][name^="item_"]'));
        const groupNames = Array.from(new Set(radios.map(r => r.name)));
        let changed = 0, skipped = 0;

        for (const name of groupNames) {
            const group = Array.from(document.querySelectorAll(`input[type="radio"][name="${CSS.escape(name)}"]`));
            if (!group.length) continue;
            if (group.some(r => r.checked)) { skipped++; continue; }

            const desired = weightedPick(currentConfig.radioWeights);
            const target = group.find(r => String(r.value) === desired);
            if (target) { target.click(); changed++; }
        }
        return { changed, skipped };
    }

    // 第6题 (使用配置)
    function fillQ6() {
        const targetId = currentConfig.q6Choice;
        // 尝试通过ID找，或者通过value fallback
        let target = document.getElementById(targetId);
        if (!target) {
            // 简单推导 value，假设 ID 和 Value 有某种对应，这里简化处理只尝试找 ID
            // 若找不到 ID，尝试找 value 相同的
            target = document.querySelector(`input[name="radio_1624"][value="${targetId}"]`);
        }

        if (target && !target.checked) {
            target.click();
            return true;
        }
        return false;
    }

    // 第7题 (使用配置)
    function fillQ7() {
        let count = 0;
        currentConfig.q7Choices.forEach(id => {
            let target = document.getElementById(id) || document.querySelector(`input[name="item_1630"][value="${id}"]`);
            if (target && !target.checked) {
                target.click();
                count++;
            }
        });
        return count;
    }

    // 主观题
    function fillTextareas() {
        const textareas = Array.from(document.querySelectorAll('textarea[name^="item_"]'));
        let changed = 0, skipped = 0;

        for (const ta of textareas) {
            if (ta.value.trim().length > 0) { skipped++; continue; }

            // 优先使用配置中的特定题号文案
            let text = currentConfig.textPresets[ta.name];

            // 如果没配置对应题号，使用一个简单的兜底 (虽然用户说不需要，但防止程序出错)
            if (!text) text = '整体体验良好，内容组织清晰。';

            // 简单的长度处理 (填充 spaces 直到满足 minlength)
            const min = ta.getAttribute('minlength') || 0;
            while(text.length < min) { text += " " + text; }

            const max = ta.getAttribute('maxlength');
            if (max) text = text.slice(0, Number(max));

            ta.value = text;
            ta.dispatchEvent(new Event('input', { bubbles: true }));
            changed++;
        }
        return { changed, skipped };
    }

    // ============ GUI 界面构建 ============

    function createSettingsPanel() {
        if (document.getElementById('__eval_settings_panel__')) return;

        const panel = document.createElement('div');
        panel.id = '__eval_settings_panel__';
        panel.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 720px; max-width: 95vw; background: white; padding: 25px; border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.25); z-index: 1000000;
            font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 14px;
            display: none; flex-direction: column;
        `;

        panel.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                <h3 style="margin:0; font-size: 18px; color: #333;">评教脚本配置</h3>
                <span id="btn_close_x" style="cursor:pointer; font-size:24px; color:#999; line-height: 1;">&times;</span>
            </div>

            <div style="display:flex; gap: 20px; flex-wrap: wrap;">
                <!-- 左侧：选择题配置 -->
                <div style="flex: 1; min-width: 300px; display:flex; flex-direction:column; gap: 15px;">
                    <fieldset style="border:1px solid #e0e0e0; padding:10px 15px; border-radius:6px;">
                        <legend style="font-weight:bold; color:#555; padding: 0 5px;">选项权重</legend>
                        <div style="display:flex; justify-content:space-around; align-items:center;">
                            <label style="cursor:pointer">3分 <input type="number" id="cfg_w3" style="width:50px; padding:4px; border:1px solid #ccc; border-radius:4px" step="0.1"></label>
                            <label style="cursor:pointer">4分 <input type="number" id="cfg_w4" style="width:50px; padding:4px; border:1px solid #ccc; border-radius:4px" step="0.1"></label>
                            <label style="cursor:pointer">5分 <input type="number" id="cfg_w5" style="width:50px; padding:4px; border:1px solid #ccc; border-radius:4px" step="0.1"></label>
                        </div>
                    </fieldset>

                    <fieldset style="border:1px solid #e0e0e0; padding:10px 15px; border-radius:6px;">
                        <legend style="font-weight:bold; color:#555; padding: 0 5px;">第6题 (教室情况)</legend>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                            <label style="cursor:pointer"><input type="radio" name="cfg_q6" value="1625"> A.大小合适</label>
                            <label style="cursor:pointer"><input type="radio" name="cfg_q6" value="1626"> B.太大</label>
                            <label style="cursor:pointer"><input type="radio" name="cfg_q6" value="1627"> C.太小</label>
                            <label style="cursor:pointer"><input type="radio" name="cfg_q6" value="1628"> D.投影好</label>
                            <label style="cursor:pointer"><input type="radio" name="cfg_q6" value="1629"> E.投影待改善</label>
                        </div>
                    </fieldset>

                    <fieldset style="border:1px solid #e0e0e0; padding:10px 15px; border-radius:6px;">
                        <legend style="font-weight:bold; color:#555; padding: 0 5px;">第7题 (修读原因)</legend>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                            <label style="cursor:pointer"><input type="checkbox" name="cfg_q7" value="1631"> A.导师要求</label>
                            <label style="cursor:pointer"><input type="checkbox" name="cfg_q7" value="1632"> B.兴趣/需求</label>
                            <label style="cursor:pointer"><input type="checkbox" name="cfg_q7" value="1633"> C.核心课</label>
                            <label style="cursor:pointer"><input type="checkbox" name="cfg_q7" value="1634"> D.口碑好</label>
                            <label style="cursor:pointer"><input type="checkbox" name="cfg_q7" value="1635"> E.时间适宜</label>
                            <label style="cursor:pointer"><input type="checkbox" name="cfg_q7" value="1636"> F.挑战性</label>
                        </div>
                    </fieldset>
                </div>

                <!-- 右侧：简答题配置 -->
                <div style="flex: 1.2; min-width: 300px; display:flex; flex-direction:column;">
                    <fieldset style="border:1px solid #e0e0e0; padding:10px 15px; border-radius:6px; flex:1; display:flex; flex-direction:column;">
                        <legend style="font-weight:bold; color:#555; padding: 0 5px;">简答题预设文案</legend>
                        <div style="overflow-y: auto; padding-right:5px; flex:1;">
                            <div style="margin-bottom:15px;">
                                <div style="font-weight:bold; color:#007bff; margin-bottom:8px; border-bottom:1px solid #f0f0f0; padding-bottom:5px;">第一类题型 (5题)</div>
                                <input type="text" id="cfg_1619" placeholder="1619: 收获" style="width:100%; box-sizing:border-box; margin-bottom:8px; padding:8px; border:1px solid #ddd; border-radius:4px;">
                                <input type="text" id="cfg_1620" placeholder="1620: 建议" style="width:100%; box-sizing:border-box; margin-bottom:8px; padding:8px; border:1px solid #ddd; border-radius:4px;">
                                <input type="text" id="cfg_1621" placeholder="1621: 课时" style="width:100%; box-sizing:border-box; margin-bottom:8px; padding:8px; border:1px solid #ddd; border-radius:4px;">
                                <input type="text" id="cfg_1622" placeholder="1622: 兴趣" style="width:100%; box-sizing:border-box; margin-bottom:8px; padding:8px; border:1px solid #ddd; border-radius:4px;">
                                <input type="text" id="cfg_1623" placeholder="1623: 出勤" style="width:100%; box-sizing:border-box; margin-bottom:8px; padding:8px; border:1px solid #ddd; border-radius:4px;">
                            </div>
                            <div>
                                <div style="font-weight:bold; color:#007bff; margin-bottom:8px; border-bottom:1px solid #f0f0f0; padding-bottom:5px;">第二类题型 (2题)</div>
                                <input type="text" id="cfg_1667" placeholder="1667: 评价" style="width:100%; box-sizing:border-box; margin-bottom:8px; padding:8px; border:1px solid #ddd; border-radius:4px;">
                                <input type="text" id="cfg_1668" placeholder="1668: 建议" style="width:100%; box-sizing:border-box; margin-bottom:8px; padding:8px; border:1px solid #ddd; border-radius:4px;">
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>

            <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px; padding-top:15px; border-top:1px solid #f0f0f0;">
                <button id="btn_cancel" style="padding:8px 24px; cursor:pointer; background: #f8f9fa; border: 1px solid #ddd; border-radius: 6px; color:#555; font-weight:500;">关闭</button>
                <button id="btn_save" style="padding:8px 24px; cursor:pointer; background: #007bff; border: none; border-radius: 6px; color: white; font-weight:500; box-shadow: 0 2px 5px rgba(0,123,255,0.3);">保存配置</button>
            </div>
        `;

        document.body.appendChild(panel);

        // 绑定事件
        const closePanel = () => { panel.style.display = 'none'; };

        panel.querySelector('#btn_close_x').onclick = closePanel;
        panel.querySelector('#btn_cancel').onclick = closePanel;

        panel.querySelector('#btn_save').onclick = () => {
             const newConfig = {
                radioWeights: {
                    '3': Number(panel.querySelector('#cfg_w3').value),
                    '4': Number(panel.querySelector('#cfg_w4').value),
                    '5': Number(panel.querySelector('#cfg_w5').value)
                },
                q6Choice: panel.querySelector('input[name="cfg_q6"]:checked')?.value || '1625',
                q7Choices: Array.from(panel.querySelectorAll('input[name="cfg_q7"]:checked')).map(cb => cb.value),
                textPresets: {
                    'item_1619': panel.querySelector('#cfg_1619').value,
                    'item_1620': panel.querySelector('#cfg_1620').value,
                    'item_1621': panel.querySelector('#cfg_1621').value,
                    'item_1622': panel.querySelector('#cfg_1622').value,
                    'item_1623': panel.querySelector('#cfg_1623').value,
                    'item_1667': panel.querySelector('#cfg_1667').value,
                    'item_1668': panel.querySelector('#cfg_1668').value
                }
            };
            saveConfig(newConfig);
            currentConfig = newConfig;
            alert('设置已保存');
            closePanel();
        };
    }

    function openSettings() {
        createSettingsPanel();
        const panel = document.getElementById('__eval_settings_panel__');

        // 填充当前值
        panel.querySelector('#cfg_w3').value = currentConfig.radioWeights['3'];
        panel.querySelector('#cfg_w4').value = currentConfig.radioWeights['4'];
        panel.querySelector('#cfg_w5').value = currentConfig.radioWeights['5'];

        // 填充第6题
        const r = panel.querySelector(`input[name="cfg_q6"][value="${currentConfig.q6Choice}"]`);
        if(r) r.checked = true;

        // 填充第7题
        panel.querySelectorAll('input[name="cfg_q7"]').forEach(cb => {
            cb.checked = currentConfig.q7Choices.includes(cb.value);
        });

        // 填充主观题 (特定题号) - 使用点号访问以避免 ESLint 警告
        panel.querySelector('#cfg_1619').value = currentConfig.textPresets.item_1619 || '';
        panel.querySelector('#cfg_1620').value = currentConfig.textPresets.item_1620 || '';
        panel.querySelector('#cfg_1621').value = currentConfig.textPresets.item_1621 || '';
        panel.querySelector('#cfg_1622').value = currentConfig.textPresets.item_1622 || '';
        panel.querySelector('#cfg_1623').value = currentConfig.textPresets.item_1623 || '';
        panel.querySelector('#cfg_1667').value = currentConfig.textPresets.item_1667 || '';
        panel.querySelector('#cfg_1668').value = currentConfig.textPresets.item_1668 || '';

        panel.style.display = 'flex';
    }

    // ============ 主界面按钮 ============
    function createMainButtons() {
        if (document.getElementById('__main_control_bar__')) return;

        const container = document.createElement('div');
        container.id = '__main_control_bar__';
        container.style.cssText = `
            position: fixed; right: 20px; bottom: 20px; z-index: 999999;
            display: flex; gap: 10px;
        `;

        // 设置按钮
        const btnSet = document.createElement('button');
        btnSet.textContent = '⚙️ 设置';
        btnSet.style.cssText = `padding: 8px 12px; cursor: pointer; border: 1px solid #999; border-radius: 4px; background: #eee;`;
        btnSet.onclick = openSettings;

        // 执行按钮
        const btnRun = document.createElement('button');
        btnRun.textContent = '🚀 一键填写';
        btnRun.style.cssText = `padding: 8px 12px; cursor: pointer; border: 1px solid #007bff; border-radius: 4px; background: #007bff; color: white;`;
        btnRun.onclick = () => {
             const r = fillRadios();
             fillQ6();
             fillQ7();
             const t = fillTextareas();
             alert(`完成！\n选择题: ${r.changed} (跳过${r.skipped})\n主观题: ${t.changed} (跳过${t.skipped})`);
        };

        container.appendChild(btnSet);
        container.appendChild(btnRun);
        document.body.appendChild(container);
    }

    // ============ 初始化观察器 ============
    const observer = new MutationObserver(() => {
        if (document.querySelector('input[type="radio"][name^="item_"]')) {
            createMainButtons();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 初始检查
    if (document.querySelector('input[type="radio"][name^="item_"]')) {
        createMainButtons();
    }

})();
