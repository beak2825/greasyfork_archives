// ==UserScript==
// @name         学习通/超星 解除粘贴限制 (Classroom Edition)
// @namespace    https://github.com/2235443218a-has
// @version      1.0
// @description  你的同学专享版：解除学习通输入框禁止粘贴的限制，让讨论不再手打！
// @author       2235443218a-has
// @match        *://*.chaoxing.com/*
// @match        *://mooc2-ans.chaoxing.com/*
// @match        *://mooc1.chaoxing.com/*
// @match        *://*.erya.100.com/*
// @match        *://*.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558695/%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%B6%85%E6%98%9F%20%E8%A7%A3%E9%99%A4%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6%20%28Classroom%20Edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558695/%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%B6%85%E6%98%9F%20%E8%A7%A3%E9%99%A4%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6%20%28Classroom%20Edition%29.meta.js
// ==/UserScript==
// ↓↓↓↓↓ 下面是干活的代码 ↓↓↓↓↓

(function() {
    'use strict';

    // 1. 先在控制台打印一句话，证明脚本活着
    console.log("【解除限制脚本】已就绪，准备接管粘贴权限...");

    // 2. 定义核心逻辑：谁敢拦我，我就让它闭嘴
    var enablePaste = function(e) {
        e.stopImmediatePropagation(); // 停止网页的拦截行为
        return true;                  // 告诉浏览器：这事儿我说了算，允许通过
    };

    // 3. 给整个页面装上监控，专门盯着“粘贴”这件事
    // 最后的 'true' 很重要，意思是“我比网页优先执行”
    document.addEventListener('paste', enablePaste, true);
    
    // 4. 顺手把“复制”和“右键菜单”的限制也解除了（送给同学的福利）
    document.addEventListener('copy', enablePaste, true);
    document.addEventListener('contextmenu', enablePaste, true);

    console.log("【解除限制脚本】执行完毕！限制已解除。");
})();
