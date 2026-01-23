// ==UserScript==
// @name         学习通一键批阅工具（含自定义快捷键与自动刷新） ChaoXing One-Click Marking Tool with Custom Hotkeys
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  点击下一份后自动刷新页面，确保脚本永久有效，并带弹窗提醒
// @author       Gemini
// @match        *://mooc2-ans.chaoxing.com/mooc2-ans/exam/test/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563700/%E5%AD%A6%E4%B9%A0%E9%80%9A%E4%B8%80%E9%94%AE%E6%89%B9%E9%98%85%E5%B7%A5%E5%85%B7%EF%BC%88%E5%90%AB%E8%87%AA%E5%AE%9A%E4%B9%89%E5%BF%AB%E6%8D%B7%E9%94%AE%E4%B8%8E%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%EF%BC%89%20ChaoXing%20One-Click%20Marking%20Tool%20with%20Custom%20Hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/563700/%E5%AD%A6%E4%B9%A0%E9%80%9A%E4%B8%80%E9%94%AE%E6%89%B9%E9%98%85%E5%B7%A5%E5%85%B7%EF%BC%88%E5%90%AB%E8%87%AA%E5%AE%9A%E4%B9%89%E5%BF%AB%E6%8D%B7%E9%94%AE%E4%B8%8E%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%EF%BC%89%20ChaoXing%20One-Click%20Marking%20Tool%20with%20Custom%20Hotkeys.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 初始化快捷键配置
    let config = GM_getValue('markConfig_v6', [
        { key: '1', data: '100' },
        { key: '2', data: '80' },
        { key: '0', data: '0' }
    ]);

    // 2. 弹窗提醒工具
    function showPopup(msg, color = "#52c41a") {
        let popup = document.getElementById('script-msg-popup');
        if (!popup) {
            popup = document.createElement('div');
            popup.id = 'script-msg-popup';
            document.body.appendChild(popup);
        }
        popup.style = `position:fixed; top:30px; left:50%; transform:translateX(-50%); z-index:10000000; padding:15px 30px; background:${color}; color:white; border-radius:40px; font-weight:bold; font-size:18px; box-shadow:0 6px 20px rgba(0,0,0,0.4); display:block;`;
        popup.innerText = msg;
        setTimeout(() => { popup.style.display = 'none'; }, 2000);
    }

    // 3. 执行打分逻辑
    function doMarkAndRefresh(dataVal) {
        // 查找当前页面的评分按钮
        const btn = document.querySelector(`.fastScore[data="${dataVal}"]`);

        if (btn) {
            showPopup(`✅ 匹配成功！分值数据: ${dataVal}\n正在保存并准备刷新...`);
            btn.click(); // 触发页面原生打分函数 fastSore(this)

            // 核心修改：执行“下一份”并在 800ms 后强制刷新页面
            setTimeout(() => {
                const nextBtn = document.querySelector('a.jb_btn[onclick*="submitMarkQuestion(2)"]') ||
                                Array.from(document.querySelectorAll('a')).find(el => el.textContent.includes('下一份'));

                if (nextBtn) {
                    nextBtn.click();
                    // 等待提交请求发出后，强制刷新整个页面
                    setTimeout(() => {
                        window.location.reload();
                    }, 600);
                } else {
                    showPopup("⚠️ 已打分，但未找到‘下一份’按钮", "#faad14");
                }
            }, 500);
        } else {
            showPopup(`❌ 找不到 data="${dataVal}" 的按钮，请检查配置`, "#ff4d4f");
        }
    }

    // 4. 维护配置面板
    function setupUI() {
        if (document.getElementById('mark-panel-v6')) return;
        const panel = document.createElement('div');
        panel.id = 'mark-panel-v6';
        panel.style = "position:fixed; top:150px; right:15px; z-index:999999; background:white; border:2px solid #52c41a; padding:15px; border-radius:10px; width:150px; box-shadow:0 4px 12px rgba(0,0,0,0.2);";
        panel.innerHTML = `<h4 style="margin:0 0 10px; text-align:center; color:#52c41a; font-size:14px;">快捷键配置</h4><div id="cfg-list"></div><button id="add-cfg" style="width:100%; cursor:pointer; background:#f6ffed; border:1px dashed #52c41a; color:#52c41a;">+ 添加</button><div style="font-size:10px; color:#999; margin-top:8px; line-height:1.2;">点击下一份后<br>脚本会自动刷新页面</div>`;
        document.body.appendChild(panel);

        const render = () => {
            const list = document.getElementById('cfg-list');
            list.innerHTML = '';
            config.forEach((item, i) => {
                const row = document.createElement('div');
                row.style = "display:flex; margin-bottom:5px; gap:4px; align-items:center;";
                row.innerHTML = `<input type="text" value="${item.key}" style="width:25px;text-align:center;"> : <input type="text" value="${item.data}" style="width:50px;text-align:center;"><button class="del-row" style="color:red; border:none; background:none; cursor:pointer;">×</button>`;
                row.querySelectorAll('input').forEach(ipt => ipt.onblur = save);
                row.querySelector('.del-row').onclick = () => { config.splice(i, 1); save(); render(); };
                list.appendChild(row);
            });
        };

        const save = () => {
            const rows = document.querySelectorAll('#cfg-list > div');
            config = Array.from(rows).map(r => ({
                key: r.querySelectorAll('input')[0].value,
                data: r.querySelectorAll('input')[1].value
            }));
            GM_setValue('markConfig_v6', config);
        };
        document.getElementById('add-cfg').onclick = () => { config.push({key:'', data:''}); render(); };
        render();
    }

    // 5. 启动面板检查与键盘监听
    setupUI(); // 初始化面板

    window.addEventListener('keydown', function(e) {
        // 排除输入框干扰
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

        const found = config.find(c => c.key.toLowerCase() === e.key.toLowerCase());
        if (found && found.data !== '') {
            e.preventDefault();
            doMarkAndRefresh(found.data);
        }
    }, true);

})();