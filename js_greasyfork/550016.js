// ==UserScript==
// @name         MTT项目快捷登录
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @license      MIT
// @description  MTT项目快捷登录描述
// @author       yesyou
// @match        http://192.168.0.108/login
// @match        http://192.168.0.223/login
// @icon         data:image/png;base64,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
// @grant        none
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/550016/MTT%E9%A1%B9%E7%9B%AE%E5%BF%AB%E6%8D%B7%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/550016/MTT%E9%A1%B9%E7%9B%AE%E5%BF%AB%E6%8D%B7%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
/* global $ */

(function() {
    'use strict';
    addLoginListener();
    showConfirm();


})();
function doLogin(uName,password){
    // 通过类选择器获取input元素
    const userName = document.querySelector('.arco-input.arco-input-size-large[type="text"]');
    // 检查元素是否存在
    // 设置输入框的值为111
    userName.value = uName;
    // 触发input事件，确保可能的监听器能感知到值的变化
    userName.dispatchEvent(new Event('input', { bubbles: true }));
    console.log('账号设置成功');
    // 通过类选择器获取input元素
    const pwd = document.querySelector('.arco-input.arco-input-size-large[type="password"]');
    // 检查元素是否存在
    if (pwd) {
        pwd.value = password;
        // 触发input事件，确保可能的监听器能感知到值的变化
        pwd.dispatchEvent(new Event('input', { bubbles: true }));
        console.log('密码设置成功');
    } else {
        console.log('未找到密码框');
    }
    // 通过类名和数据属性定位登录按钮
    const loginButton = document.querySelector('div.sub-btn');

    if (loginButton) {
        // 触发按钮点击事件
        //loginButton.click();

        // 为确保点击被正确识别，也可以触发鼠标事件
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        loginButton.dispatchEvent(clickEvent);

        console.log('登录按钮已点击');
    } else {
        console.log('未找到登录按钮');
    }
}
function addLoginListener(){
    setTimeout(function(){
        const loginButton = document.querySelector('div.sub-btn');
        loginButton.addEventListener('click', function() {
            const userName = document.querySelector('.arco-input.arco-input-size-large[type="text"]').value;
            const pwd = document.querySelector('.arco-input.arco-input-size-large[type="password"]').value;
            var account = localStorage.getItem('account');
            if(account==null){
                account='{}';
            }
            var acJson = JSON.parse(account);
            acJson[userName]=pwd;
            localStorage.setItem('account', JSON.stringify(acJson));
            console.log(userName,pwd)
            showConfirm().updateOptions();
        });
    },2000);
}

function showConfirm(){
    // 创建下拉选择框容器
    const dropdownContainer = document.createElement('div');
    dropdownContainer.style.position = 'fixed';
    dropdownContainer.style.top = '20px';
    dropdownContainer.style.right = '20px';
    dropdownContainer.style.padding = '15px';
    dropdownContainer.style.backgroundColor = 'white';
    dropdownContainer.style.border = '1px solid #ccc';
    dropdownContainer.style.borderRadius = '4px';
    dropdownContainer.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.2)';
    dropdownContainer.style.minWidth = '250px';

    // 添加标题
    const titleElement = document.createElement('div');
    titleElement.textContent = '选择账号登录';
    titleElement.style.fontWeight = 'bold';
    titleElement.style.marginBottom = '15px';
    titleElement.style.paddingBottom = '8px';
    titleElement.style.borderBottom = '1px solid #eee';
    dropdownContainer.appendChild(titleElement);

    // 创建选择框容器（用于放置选项和删除按钮）
    const selectContainer = document.createElement('div');
    selectContainer.style.marginBottom = '15px';
    dropdownContainer.appendChild(selectContainer);


    // 函数：更新选项列表
    function updateOptions() {
        // 清空现有选项
        console.log("开始更新选项");
        selectContainer.innerHTML = '';

        // 添加选项
        let account = localStorage.getItem('account');
        if(account == null){
            account = '{}';
        }
        let acJson = JSON.parse(account);
        const options = Object.keys(acJson);

        if (options.length === 0) {
            // 没有选项时显示提示
            const empty提示 = document.createElement('div');
            empty提示.textContent = '没有保存的账号';
            empty提示.style.color = '#999';
            empty提示.style.padding = '8px';
            selectContainer.appendChild(empty提示);
            return;
        }

        // 添加所有选项
        options.forEach(optionText => {
            const optionWrapper = document.createElement('div');
            optionWrapper.style.display = 'flex';
            optionWrapper.style.alignItems = 'center';
            optionWrapper.style.justifyContent = 'space-between';
            optionWrapper.style.padding = '8px';
            optionWrapper.style.border = '1px solid #eee';
            optionWrapper.style.borderRadius = '4px';
            optionWrapper.style.marginBottom = '5px';
            optionWrapper.style.cursor = 'pointer';

            // 选项文本
            const optionTextElement = document.createElement('span');
            optionTextElement.textContent = optionText;

            // 删除按钮
            const deleteButton = document.createElement('span');
            deleteButton.textContent = '×';
            deleteButton.style.color = '#ff4d4f';
            deleteButton.style.fontSize = '16px';
            deleteButton.style.marginLeft = '10px';
            deleteButton.style.cursor = 'pointer';
            deleteButton.style.padding = '0 5px';

            // 绑定删除事件
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止事件冒泡
                // 从对象中删除该账号
                delete acJson[optionText];
                // 更新localStorage
                localStorage.setItem('account', JSON.stringify(acJson));
                // 更新选项列表
                updateOptions();
            });

            // 点击选项时选中该账号
            optionWrapper.addEventListener('click', () => {
                console.log(`选中的账号: ${optionText}`);
                document.body.removeChild(dropdownContainer);
                // 这里可以添加登录逻辑
                doLogin(optionText,acJson[optionText]);
                // 更新选项列表
                updateOptions();
            });

            optionWrapper.appendChild(optionTextElement);
            optionWrapper.appendChild(deleteButton);
            selectContainer.appendChild(optionWrapper);
        });
    }

    // 初始加载选项
    updateOptions();

    // 添加确认按钮（用于关闭弹窗）
    const confirmButton = document.createElement('button');
    confirmButton.textContent = '关闭';
    confirmButton.style.padding = '6px 12px';
    confirmButton.style.backgroundColor = '#f5f5f5';
    confirmButton.style.border = '1px solid #ddd';
    confirmButton.style.borderRadius = '4px';
    confirmButton.style.cursor = 'pointer';

    // 点击确认按钮处理
    confirmButton.addEventListener('click', () => {
        document.body.removeChild(dropdownContainer);
    });

    dropdownContainer.appendChild(confirmButton);
    document.body.appendChild(dropdownContainer);
}
