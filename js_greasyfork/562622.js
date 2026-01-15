// ==UserScript==
// @name         西北大学教务系统自动评价助手
// @namespace    http://tampermonkey.net/
// @version      5.2
// @description  专为西北大学（NWU）正方教务系统设计的自动评教工具。功能包括：一键自动填充 100 分、自动填写好评评语、绕过“脚本注入”检测、并且在填写完成后自动保存（不提交）。
// @author       Taffy
// @match        *://jwgl.nwu.edu.cn/jwglxt/xspjgl/xspj_cxXspjIndex.html*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562622/%E8%A5%BF%E5%8C%97%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/562622/%E8%A5%BF%E5%8C%97%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取页面的原生 jQuery 对象
    const $ = unsafeWindow.jQuery || window.jQuery;

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // 添加按钮
    function addControlPanel() {
        if (document.getElementById('auto-eval-v5')) return;
        const btn = document.createElement('button');
        btn.id = 'auto-eval-v5';
        btn.innerHTML = '自动评价，启动';
        btn.style.cssText = 'position: fixed; top: 10px; right: 200px; z-index: 10000; padding: 10px 20px; background: #d63384; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.2);';
        btn.onclick = startKernelEvaluation;
        document.body.appendChild(btn);
    }

    // 强制写入值的核心函数
    function forceFillInput(jqElement, value) {
        if (!jqElement || jqElement.length === 0) return;

        // 1. 聚焦
        jqElement.focus();

        // 2. 写入值 (jQuery方式 + 原生方式双管齐下)
        jqElement.val(value);
        jqElement[0].value = value;

        // 3. 关键：疯狂触发事件
        // 正方系统通常在 'blur' (失焦) 时计算总分，如果总分不更新，保存就无效
        jqElement.trigger('input')
                 .trigger('change')
                 .trigger('keydown')
                 .trigger('keyup')
                 .trigger('blur'); // 最重要的一步

        // 4. 再次失焦确保生效
        jqElement[0].blur();
    }

    async function startKernelEvaluation() {
        if (!$) {
            alert("错误：未检测到页面jQuery，请确保页面已完全加载！");
            return;
        }

        if (!confirm('准备开始。\n\n本脚本将自动填入所有评分框为100，填入评语\n并自动保存而不提交。\n\n脚本执行过程中，请勿操作鼠标！')) {
            return;
        }

        // 查找左侧列表（使用页面原生jQuery选择器）
        let rows = $("#tempGrid").find("tr.jqgrow");

        if (rows.length === 0) {
            alert("未找到课程列表，请刷新页面重试。");
            return;
        }

        for (let i = 0; i < rows.length; i++) {
            let row = $(rows[i]);
            let status = row.find("td[aria-describedby='tempGrid_tjztmc']").text();

            // 只处理未评
            if (status.indexOf("未评") !== -1) {
                console.log(`>>> 正在处理第 ${i + 1} 门课程...`);

                // 点击课程行
                row.trigger("click");

                // 等待右侧加载
                await sleep(2000);

                // --- 1. 填分 ---
                let inputs = $("input.input-pjf");
                console.log(`找到 ${inputs.length} 个评分框`);

                if (inputs.length > 0) {
                    inputs.each(function() {
                        forceFillInput($(this), "100");
                    });
                    // 填完后等待一下，让系统计算总分
                    await sleep(1000);
                }

                // --- 2. 评语 ---
                let textArea = $("textarea[name='py']");
                if (textArea.length > 0) {
                    textArea.val("老师教学认真，重点突出，课堂氛围好。");
                    textArea.trigger('change').trigger('blur');
                }

                // --- 3. 保存 ---
                await sleep(1000);

                // 尝试点击保存按钮 (使用 jQuery click，通常比原生更有效因为绑定在 JQ 上)
                let topBtn = $("#btn_bc");
                let bottomBtn = $("#btn_xspj_bc");

                if (topBtn.length > 0) {
                    console.log("正在点击顶部保存...");
                    topBtn.trigger("click");
                }

                if (bottomBtn.length > 0) {
                    console.log("正在点击底部保存...");
                    bottomBtn.trigger("click");
                }

                console.log("保存动作执行完毕，等待系统响应...");

                // --- 4. 处理弹窗 ---
                await sleep(3000);

                // 自动点掉 "保存成功" 或 "确认" 弹窗
                let okBtn = $(".bootbox .btn-primary");
                if (okBtn.length > 0) {
                    console.log("检测到弹窗，点击确定");
                    okBtn.trigger("click");
                    await sleep(1000);
                }

                // 重新获取列表，准备下一个
                rows = $("#tempGrid").find("tr.jqgrow");
            }
        }

        alert("全部处理完成！\n请检查列表状态是否已变为【已评完】，这代表 保存且必填项已评完。");
    }

    window.addEventListener('load', function() {
        setTimeout(addControlPanel, 1000);
    });
})();