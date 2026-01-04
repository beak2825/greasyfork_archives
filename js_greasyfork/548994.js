// ==UserScript==
// @name         昵图网自动勾选共享图和文件类型
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  在昵图网进行搜索时，自动选择共享图分类，同时自动勾选文件格式为所有矢量图格式
// @author       Joe Ye
// @match        https://www.nipic.com/*
// @match        https://soso.nipic.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548994/%E6%98%B5%E5%9B%BE%E7%BD%91%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89%E5%85%B1%E4%BA%AB%E5%9B%BE%E5%92%8C%E6%96%87%E4%BB%B6%E7%B1%BB%E5%9E%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/548994/%E6%98%B5%E5%9B%BE%E7%BD%91%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89%E5%85%B1%E4%BA%AB%E5%9B%BE%E5%92%8C%E6%96%87%E4%BB%B6%E7%B1%BB%E5%9E%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 查找目标form元素
    const forms = document.querySelectorAll('form.soso-form');

    // 遍历目标form
    forms.forEach(form => {
        // 添加新的隐藏输入标签
        const newInputF = document.createElement('input');
        newInputF.type = 'hidden';
        newInputF.name = 'f';
        newInputF.value = 'CDR,AI,EPS,PDF,DWG,WMF';
        newInputF.autocomplete = 'off';
        form.appendChild(newInputF);

        // 查找现有隐藏输入标签 name="g"
        let existingInputG = form.querySelector('input[name="g"]');
        if (existingInputG) {
            // 如果存在，修改其值为1
            existingInputG.value = '1';
        } else {
            // 如果不存在，创建并添加到表单中
            const newInputG = document.createElement('input');
            newInputG.type = 'hidden';
            newInputG.name = 'g';
            newInputG.value = '1';
            newInputG.autocomplete = 'off';
            form.appendChild(newInputG);
        }
    });
})();