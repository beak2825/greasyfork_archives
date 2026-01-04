// ==UserScript==
// @name         查询排程自动填写影城名字
// @namespace    freebuyall
// @version      3.0
// @description  适配多域名，支持用户自定义影城名称，支持脚本后续更新不丢失配置
// @author       IT Support
// @match        *://*.hengdianfilm.com*/webroot/decision/*viewlet=*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559388/%E6%9F%A5%E8%AF%A2%E6%8E%92%E7%A8%8B%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%BD%B1%E5%9F%8E%E5%90%8D%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/559388/%E6%9F%A5%E8%AF%A2%E6%8E%92%E7%A8%8B%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%BD%B1%E5%9F%8E%E5%90%8D%E5%AD%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 核心配置 ---
    const WIDGET_NAME = "THEATER_ID"; // 控件名
    const KEYWORD_CHECK = "排程";       // 只有报表名字里带有这个词才运行

    // --- 菜单功能注册 ---
    // 在油猴菜单中添加“设置影城名称”按钮，用户随时可以改
    GM_registerMenuCommand("⚙️ 设置默认影城名称", setTheaterName);

    // --- 第一步：网址关键词匹配检查 ---
    var currentURL = decodeURIComponent(window.location.href);
    if (currentURL.indexOf("hengdianfilm.com") === -1 ||
        currentURL.indexOf("webroot") === -1 ||
        currentURL.indexOf("decision") === -1 ||
        currentURL.indexOf("viewlet") === -1) {
        return;
    }

    // --- 第二步：安全检查 ---
    if (currentURL.indexOf(KEYWORD_CHECK) === -1) {
        return;
    }

    // --- 第三步：获取用户配置 ---
    // 从存储中读取影城名称，如果没有（第一次运行），则为空
    var targetText = GM_getValue("MyTheaterName", "");

    // 如果还没有设置过名称，弹窗让用户输入
    if (!targetText) {
        setTheaterName(); // 调用设置函数
        // 如果用户在弹窗里点了取消，则不继续执行
        targetText = GM_getValue("MyTheaterName", "");
        if (!targetText) return;
    }

    console.log("当前设置的目标影城为：" + targetText);

    // --- 第四步：执行填写逻辑 ---
    var checkTimer = setInterval(function() {
        try {
            if (typeof _g === 'function' && _g().parameterEl) {
                var widget = _g().parameterEl.getWidgetByName(WIDGET_NAME);
                if (widget) {
                    var currentVal = widget.getValue();
                    // 只有值不同的时候才填，避免死循环
                    if(currentVal !== targetText){
                        console.log("正在写入：" + targetText);
                        widget.setValue(targetText);
                    }
                    clearInterval(checkTimer);
                }
            }
        } catch (e) {}
    }, 500);

    // 30秒超时停止
    setTimeout(function() {
        clearInterval(checkTimer);
    }, 30000);


    // --- 辅助函数：设置名称 ---
    function setTheaterName() {
        var oldName = GM_getValue("MyTheaterName", "");
        var newName = prompt("【首次运行或修改配置】\n请输入要自动填写的影城名称（例如：广东广州花都）：", oldName);

        if (newName !== null && newName.trim() !== "") {
            GM_setValue("MyTheaterName", newName.trim());
            alert("设置成功！以后打开排程表将自动填写：" + newName);
            // 如果是在报表页面，尝试刷新一下让设置生效
            if (window.location.href.indexOf(KEYWORD_CHECK) !== -1) {
                 location.reload();
            }
        }
    }

})();