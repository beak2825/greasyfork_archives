// ==UserScript==
// @name         快递信息Formatter (和诚)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动生成快递信息格式，以供微信群接龙集运 http://www.shhcexp.com/Home/Package
// @match        http://www.shhcexp.com/Home/Package*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548966/%E5%BF%AB%E9%80%92%E4%BF%A1%E6%81%AFFormatter%20%28%E5%92%8C%E8%AF%9A%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548966/%E5%BF%AB%E9%80%92%E4%BF%A1%E6%81%AFFormatter%20%28%E5%92%8C%E8%AF%9A%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 等待DOM加载完成再执行
    window.addEventListener('load', () => {

        // 创建悬浮面板
        const panel = document.createElement('div');
        panel.innerHTML = `
          <div style="position: fixed; right: 18px; bottom: 18px; z-index: 2147483647; width: 320px; background: #fff; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,.12); font: 13px / 1.4 -apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Helvetica,Arial;">
            <div style="padding:8px 10px; border-bottom:1px solid #eee; display:flex; align-items:center; gap:8px;">
              <strong style="flex:1;">快递信息Formatter</strong>
              <label style="font-weight:normal; white-space:nowrap;">
                用户编号：
                <input id="tm-pack-code" style="width:80px; padding:2px 6px;" placeholder="#####">
              </label>
              <button id="tm-gen" style="margin-left:auto; padding:6px 10px; border:0; border-radius:6px; background:#4CAF50; color:#fff; cursor:pointer;">生成</button>
            </div>
            <textarea id="tm-out" style="width:100%; height:180px; border:0; padding:10px; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;"></textarea>
            <div style="padding:8px 10px; border-top:1px solid #eee; display:flex; gap:8px;">
              <button id="tm-copy" style="padding:6px 10px; border:0; border-radius:6px; background:#1677ff; color:#fff; cursor:pointer;">复制到剪贴板</button>
              <button id="tm-close" style="margin-left:auto; padding:6px 10px; border:0; border-radius:6px; background:#999; color:#fff; cursor:pointer;">关闭</button>
            </div>
          </div>
        `;
        document.body.appendChild(panel);

        const input = document.getElementById('tm-pack-code');
        const output = document.getElementById('tm-out');

        // 页面加载时自动填入上次编号
        const lastCode = localStorage.getItem('tm_last_code');
        if (lastCode) input.value = lastCode;

        // 生成按钮逻辑
        document.getElementById('tm-gen').onclick = () => {
            const code = input.value.trim();
            if (!code) return alert('请输入用户编号');

            // 保存本次编号
            localStorage.setItem('tm_last_code', code);

            // 统计选中的包裹
            let lines = [];
            let totalWeight = 0;
            const chks = document.querySelectorAll("input[name='Kd_List']:checked");

            if (chks.length === 0) {
                return alert('请先勾选需要的包裹');
            }

            chks.forEach(chk => {
                const billElem = chk.closest('td').querySelector("span.BillCodeUpdata");
                if (!billElem) return;
                const bill = billElem.innerText;
                const weight = parseFloat(chk.getAttribute('data-weight')) || 0;
                totalWeight += weight;
                lines.push(`${bill}   ${weight.toFixed(2)}kg`);
            });

            const header = `【${code}】${chks.length}件 ${totalWeight.toFixed(2)}kg`;
            output.value = header + "\n" + lines.join("\n");
        };

        // 复制到剪贴板
        document.getElementById('tm-copy').onclick = () => {
            output.select();
            document.execCommand('copy');
            alert('已复制到剪贴板');
        };

        // 关闭面板
        document.getElementById('tm-close').onclick = () => panel.remove();

    });
})();
