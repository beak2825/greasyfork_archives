// ==UserScript==
// @name         蓝白-ExHentai 常用搜索词助手
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  为ExHentai添加常用搜索词快速输入功能
// @author       蓝白社野怪
// @match        https://exhentai.org/*
// @grant        none
// @license        MIT 
// @downloadURL https://update.greasyfork.org/scripts/550440/%E8%93%9D%E7%99%BD-ExHentai%20%E5%B8%B8%E7%94%A8%E6%90%9C%E7%B4%A2%E8%AF%8D%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/550440/%E8%93%9D%E7%99%BD-ExHentai%20%E5%B8%B8%E7%94%A8%E6%90%9C%E7%B4%A2%E8%AF%8D%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建样式 - 暗色主题适配
    const style = document.createElement('style');
    style.innerHTML = `
        .search-wrapper {
            position: relative;
            width: 980px;
            margin: 0 auto;
        }
        #searchbox {
            width: 720px;
        }
        .search-tags-container {
            position: absolute;
            left: 860px;
            top: 0;
            width: 250px;
            padding: 10px;
            background: #1a1a1a;
            border-radius: 4px;
            border: 1px solid #333;
        }
        .search-tags-header {
            margin-bottom: 8px;
        }
        .search-tags-input {
            padding: 6px 8px;
            width: 100%;
            background: #2d2d2d;
            border: 1px solid #444;
            color: #e0e0e0;
            border-radius: 3px;
            font-size: 13px;
            box-sizing: border-box;
        }
        .search-tags-input::placeholder {
            color: #777;
        }
        .search-tags-input:focus {
            outline: none;
            border-color: #666;
            background: #333;
        }
        .search-tags-list {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            max-height: 120px;
            overflow-y: auto;
            padding-right: 3px;
        }
        .search-tags-list::-webkit-scrollbar {
            width: 5px;
        }
        .search-tags-list::-webkit-scrollbar-thumb {
            background: #444;
            border-radius: 3px;
        }
        .search-tag {
            padding: 4px 10px;
            background: #333;
            border-radius: 3px;
            cursor: pointer;
            user-select: none;
            color: #d0d0d0;
            font-size: 12px;
            border: 1px solid #444;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            white-space: nowrap;
        }
        .search-tag:hover {
            background: #444;
            color: #fff;
            border-color: #555;
        }
        .search-tag:active {
            transform: scale(0.95);
        }
        .search-tags-hint {
            color: #777;
            font-size: 11px;
            margin-top: 8px;
            line-height: 1.3;
        }
    `;
    document.head.appendChild(style);

    // 获取原始搜索框及其父容器
    const searchBox = document.getElementById('searchbox');
    const toppane = document.getElementById('toppane');

    // 创建包装容器
    const wrapper = document.createElement('div');
    wrapper.className = 'search-wrapper';

    // 创建标签容器
    const tagsContainer = document.createElement('div');
    tagsContainer.className = 'search-tags-container';
    tagsContainer.innerHTML = `
        <div class="search-tags-header">
            <input type="text" class="search-tags-input" placeholder="输入常用搜索词后按回车添加">
        </div>
        <div class="search-tags-list"></div>
        <div class="search-tags-hint">点击标签可在搜索框末尾添加该词</div>
    `;

    // 重新组织DOM结构
    wrapper.appendChild(searchBox.cloneNode(true));
    wrapper.appendChild(tagsContainer);

    // 替换原始搜索框
    toppane.insertBefore(wrapper, searchBox);
    toppane.removeChild(searchBox);

    const input = tagsContainer.querySelector('.search-tags-input');
    const tagsList = tagsContainer.querySelector('.search-tags-list');

    // 从本地存储加载标签
    loadTags();

    // 输入框回车事件
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const tag = input.value.trim();
            if (tag) {
                addTag(tag);
                input.value = '';
                saveTags();
            }
        }
    });

    // 添加标签
    function addTag(tag) {
        // 检查是否已存在相同标签
        const existingTags = Array.from(tagsList.children).map(t => t.textContent);
        if (existingTags.includes(tag)) return;

        const tagElement = document.createElement('div');
        tagElement.className = 'search-tag';
        tagElement.textContent = tag;

        tagElement.addEventListener('click', function() {
            const searchInput = document.getElementById('f_search');
            // 在现有内容末尾添加空格和搜索词
            if (searchInput.value.trim() === '') {
                searchInput.value = tag;
            } else {
                searchInput.value = `${searchInput.value} ${tag}`;
            }
            searchInput.focus();
        });

        tagsList.appendChild(tagElement);
    }

    // 保存标签到本地存储
    function saveTags() {
        const tags = Array.from(tagsList.children).map(tag => tag.textContent);
        localStorage.setItem('exhentai_search_tags', JSON.stringify(tags));
    }

    // 从本地存储加载标签
    function loadTags() {
        const savedTags = localStorage.getItem('exhentai_search_tags');
        if (savedTags) {
            const tags = JSON.parse(savedTags);
            tags.forEach(tag => addTag(tag));
        }
    }
})();