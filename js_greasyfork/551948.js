// ==UserScript==
// @name         百度文言文批量翻译搜索插件
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  中文分号分隔输入+搜索后刷新+本地存储+进度显示
// @author       You
// @match        https://www.baidu.com/*
// @icon         https://www.baidu.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551948/%E7%99%BE%E5%BA%A6%E6%96%87%E8%A8%80%E6%96%87%E6%89%B9%E9%87%8F%E7%BF%BB%E8%AF%91%E6%90%9C%E7%B4%A2%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/551948/%E7%99%BE%E5%BA%A6%E6%96%87%E8%A8%80%E6%96%87%E6%89%B9%E9%87%8F%E7%BF%BB%E8%AF%91%E6%90%9C%E7%B4%A2%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentIndex = parseInt(localStorage.getItem('classicCurrentIndex')) || 0;
    let classicTextList = JSON.parse(localStorage.getItem('classicTextList')) || [];
    let guiContainer = null;
    let progressText = null;
    const REFRESH_DELAY = 800; // 搜索后刷新延迟（可调整）

    // 1. 创建/恢复GUI（更新输入提示语）
    function createOrRestoreGUI() {
        if (document.getElementById('classicSearchGUI')) {
            document.getElementById('classicSearchGUI').remove();
        }

        guiContainer = document.createElement('div');
        guiContainer.id = 'classicSearchGUI';
        guiContainer.style.cssText = `
            position: fixed; top: 10px; left: 50%; transform: translateX(-50%); 
            display: flex; align-items: center; gap: 8px; z-index: 9999;
            background: #fff; padding: 8px; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        `;

        // 输入框：提示语改为中文分号分隔，支持含句号的原文
        const inputBox = document.createElement('textarea');
        inputBox.id = 'classicInputBox';
        inputBox.style.cssText = `
            height: 40px; width: 450px; padding: 8px 12px; border: 1px solid #ddd; 
            border-radius: 4px; resize: none; font-size: 14px; line-height: 24px;
        `;
        inputBox.placeholder = '请按中文分号分隔输入（例：“国恒亡。”；“学而时习之。”；“温故而知新，可以为师矣。”）';
        inputBox.value = localStorage.getItem('classicInputContent') || '';

        // 确认按钮：核心修改——按中文分号“；”分割输入（原中文逗号“，”已替换）
        const switchBtn = document.createElement('button');
        switchBtn.textContent = "确认列表";
        switchBtn.style.cssText = `
            height: 40px; padding: 0 16px; border: none; background: #4e6ef2; 
            color: #fff; border-radius: 4px; cursor: pointer; font-size: 14px;
        `;
        switchBtn.addEventListener('click', () => {
            const inputValue = inputBox.value.trim();
            if (!inputValue) return;

            // 解析逻辑：去引号→按中文分号“；”分割→过滤空项（支持原文含句号）
            const parsedList = inputValue
                .replace(/"|'/g, '') // 移除引号
                .split('；') // 关键修改：用中文分号分隔，而非原中文逗号
                .map(item => item.trim()) // 保留原文句号（如“国恒亡。”）
                .filter(item => item !== '');
            
            if (parsedList.length === 0) return;

            // 更新并保存数据
            classicTextList = parsedList;
            currentIndex = 0;
            localStorage.setItem('classicTextList', JSON.stringify(classicTextList));
            localStorage.setItem('classicCurrentIndex', currentIndex);
            localStorage.setItem('classicInputContent', inputValue);

            updateProgress();
            searchClassicText(currentIndex);
        });

        // <>按键（逻辑不变，始终显示）
        const prevBtn = document.createElement('button');
        prevBtn.textContent = "< 上一句";
        prevBtn.style.cssText = `
            height: 40px; padding: 0 16px; border: none; background: #f5f5f5; 
            color: #333; border-radius: 4px; cursor: pointer; font-size: 14px;
        `;
        prevBtn.addEventListener('click', () => {
            if (classicTextList.length === 0) return;
            currentIndex = (currentIndex - 1 + classicTextList.length) % classicTextList.length;
            localStorage.setItem('classicCurrentIndex', currentIndex);
            updateProgress();
            searchClassicText(currentIndex);
        });

        const nextBtn = document.createElement('button');
        nextBtn.textContent = "下一句 >";
        nextBtn.style.cssText = `
            height: 40px; padding: 0 16px; border: none; background: #f5f5f5; 
            color: #333; border-radius: 4px; cursor: pointer; font-size: 14px;
        `;
        nextBtn.addEventListener('click', () => {
            if (classicTextList.length === 0) return;
            currentIndex = (currentIndex + 1) % classicTextList.length;
            localStorage.setItem('classicCurrentIndex', currentIndex);
            updateProgress();
            searchClassicText(currentIndex);
        });

        // 进度显示（逻辑不变）
        progressText = document.createElement('span');
        progressText.style.cssText = `font-size: 14px; color: #666;`;
        updateProgress();

        // 组装GUI
        guiContainer.appendChild(inputBox);
        guiContainer.appendChild(switchBtn);
        guiContainer.appendChild(progressText);
        guiContainer.appendChild(prevBtn);
        guiContainer.appendChild(nextBtn);
        document.body.appendChild(guiContainer);
    }

    // 2. 更新进度（逻辑不变）
    function updateProgress() {
        if (!progressText) return;
        const total = classicTextList.length;
        const current = total > 0 ? currentIndex + 1 : 0;
        progressText.textContent = ` ${current}/${total} `;
    }

    // 3. 搜索函数（逻辑不变，含延迟刷新）
    function searchClassicText(index) {
        const searchInput = document.getElementById('kw');
        const searchBtn = document.getElementById('su');
        if (!searchInput || !searchBtn || classicTextList.length === 0) return;

        // 搜索内容保留原文句号（如“国恒亡。 翻译”）
        const targetText = `${classicTextList[index]} 翻译`;
        searchInput.value = targetText;
        searchBtn.click();

        // 延迟刷新并保存索引
        setTimeout(() => {
            localStorage.setItem('classicCurrentIndex', currentIndex);
            window.location.reload();
        }, REFRESH_DELAY);
    }

    // 4. 初始化（逻辑不变）
    window.addEventListener('load', () => {
        createOrRestoreGUI();
        updateProgress();
    });

    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            createOrRestoreGUI();
            updateProgress();
        }
    }, 300);
})();