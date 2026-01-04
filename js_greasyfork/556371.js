// ==UserScript==
// @name         CNKI学位论文搜索学校标记（985211）（华工域名）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  CNKI 学校 标记 985 211
// @author       Kratos
// @match        https://kns-cnki-net-443.webvpn.scut.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cnki.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556371/CNKI%E5%AD%A6%E4%BD%8D%E8%AE%BA%E6%96%87%E6%90%9C%E7%B4%A2%E5%AD%A6%E6%A0%A1%E6%A0%87%E8%AE%B0%EF%BC%88985211%EF%BC%89%EF%BC%88%E5%8D%8E%E5%B7%A5%E5%9F%9F%E5%90%8D%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/556371/CNKI%E5%AD%A6%E4%BD%8D%E8%AE%BA%E6%96%87%E6%90%9C%E7%B4%A2%E5%AD%A6%E6%A0%A1%E6%A0%87%E8%AE%B0%EF%BC%88985211%EF%BC%89%EF%BC%88%E5%8D%8E%E5%B7%A5%E5%9F%9F%E5%90%8D%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function plog(msg) {
        const e = "border-radius: 2px 0 0 2px; background: #004fd9; color: #fff;";
        const t = "color: #004fd9;font-weight: bold;";
        console.log(`%c CNKI_SchoolTag %c ${msg} `, e, t);
    }

    // --- 985 大学列表（完整） ---
    const universities985 = [
        "清华大学", "北京大学", "厦门大学", "南京大学", "复旦大学",
        "天津大学", "浙江大学", "南开大学", "西安交通大学", "东南大学",
        "武汉大学", "上海交通大学", "山东大学", "湖南大学", "中国人民大学",
        "吉林大学", "重庆大学", "电子科技大学", "四川大学", "中山大学",
        "华南理工大学", "兰州大学", "东北大学", "西北工业大学", "哈尔滨工业大学",
        "华中科技大学", "中国海洋大学", "北京理工大学", "大连理工大学", "北京航空航天大学",
        "北京师范大学", "同济大学", "中南大学", "中国科学技术大学",
        "中国农业大学", "国防科学技术大学", "中央民族大学", "华东师范大学", "西北农林科技大学"
    ];

    // --- 211 大学列表（完整） ---
    const universities211 = [
        // 北京(26所)
        "清华大学", "北京大学", "中国人民大学", "北京工业大学", "北京理工大学",
        "北京航空航天大学", "北京化工大学", "北京邮电大学", "对外经济贸易大学",
        "中国传媒大学", "中央民族大学", "中国矿业大学", "中央财经大学",
        "中国政法大学", "中国石油大学", "中央音乐学院", "北京体育大学",
        "北京外国语大学", "北京交通大学", "北京科技大学", "北京林业大学",
        "中国农业大学", "北京中医药大学", "华北电力大学", "北京师范大学",
        "中国地质大学",
        // 上海(9所)
        "复旦大学", "华东师范大学", "上海外国语大学", "上海大学", "同济大学",
        "华东理工大学", "东华大学", "上海财经大学", "上海交通大学",
        // 天津(4所)
        "南开大学", "天津大学", "天津医科大学",
        // 重庆(2所)
        "重庆大学", "西南大学",
        // 河北(1所)
        "华北电力大学(保定)",
        // 山西(1所)
        "太原理工大学",
        // 内蒙古(1所)
        "内蒙古大学",
        // 辽宁(4所)
        "大连理工大学", "东北大学", "辽宁大学", "大连海事大学",
        // 吉林(3所)
        "吉林大学", "东北师范大学", "延边大学",
        // 黑龙江(4所)
        "东北农业大学", "东北林业大学", "哈尔滨工业大学", "哈尔滨工程大学",
        // 江苏(11所)
        "南京大学", "东南大学", "苏州大学", "河海大学", "中国药科大学",
        "中国矿业大学(徐州)", "南京师范大学", "南京理工大学", "南京航空航天大学",
        "江南大学", "南京农业大学",
        // 浙江(1所)
        "浙江大学",
        // 安徽(3所)
        "安徽大学", "合肥工业大学", "中国科学技术大学",
        // 福建(2所)
        "厦门大学", "福州大学",
        // 江西(1所)
        "南昌大学",
        // 山东(3所)
        "山东大学", "中国海洋大学", "中国石油大学(华东)",
        // 河南(1所)
        "郑州大学",
        // 湖北(7所)
        "武汉大学", "华中科技大学", "中国地质大学(武汉)", "华中师范大学",
        "华中农业大学", "中南财经政法大学", "武汉理工大学",
        // 湖南(3所)
        "湖南大学", "中南大学", "湖南师范大学",
        // 广东(4所)
        "中山大学", "暨南大学", "华南理工大学", "华南师范大学",
        // 广西(1所)
        "广西大学",
        // 四川(5所)
        "四川大学", "西南交通大学", "电子科技大学", "西南财经大学", "四川农业大学",
        // 云南(1所)
        "云南大学",
        // 贵州(1所)
        "贵州大学",
        // 陕西(7所)
        "西北大学", "西安交通大学", "西北工业大学", "陕西师范大学",
        "西北农林科技大学", "西安电子科技大学", "长安大学",
        // 甘肃(1所)
        "兰州大学",
        // 新疆(2所)
        "新疆大学", "石河子大学",
        // 海南(1所)
        "海南大学",
        // 宁夏(1所)
        "宁夏大学",
        // 青海(1所)
        "青海大学",
        // 西藏(1所)
        "西藏大学",
        // 军事系统(3所)
        "第二军医大学", "第四军医大学", "国防科学技术大学"
    ];


    function tagUniversity(unitElement) {
        // 检查是否已经添加了标签，避免重复添加
        if (unitElement.querySelector('span.cnki-school-tag')) {
            return;
        }

        // 尝试从单元格中找到链接元素
        const aEle = unitElement.querySelector('a');
        if (!aEle) {
            return;
        }

        // 获取学校名称
        const universityName = aEle.textContent.trim();
        let tagText = '';
        let tagColor = '';

        if (universities985.includes(universityName)) {
            tagText = '985';
            tagColor = '#fe9898'; // 红色系 for 985
        } else if (universities211.includes(universityName)) {
            tagText = '211';
            tagColor = '#98befe'; // 蓝色系 for 211
        } else {
            return; // 不是985也不是211，直接返回
        }

        // 创建并设置标签样式
        const span = document.createElement('span');
        span.textContent = tagText;
        span.className = 'cnki-school-tag';
        span.style.marginLeft = '5px';
        span.style.fontFamily = '"Times New Roman", sans-serif';
        span.style.borderRadius = '9px';
        span.style.whiteSpace = 'nowrap';
        span.style.padding = '1px 7px 1px';
        span.style.fontSize = '12px';
        span.style.color = '#000';
        span.style.background = tagColor;
        span.style.fontWeight = 'bold';

        // 将标签添加到链接元素后面
        aEle.appendChild(span);
        // plog(`已标记学校: ${universityName} 为 ${tagText}`);
    }


    function processResults() {
        // 优先尝试新版 CNKI 列表结构（来自您的第一张截图）
        const unitsNew = document.querySelectorAll('table.data-table tbody tr td:nth-child(4)');
        if (unitsNew.length > 0) {
            // plog(`新版结构: 发现 ${unitsNew.length} 个结果，开始标记...`);
            unitsNew.forEach(tagUniversity);
            return;
        }

        // 其次尝试旧版 CNKI/特定视图结构（来自您的 XPath 提示）
        // CNKI学位论文结果列表的学校/机构字段通常在 class="unit" 的 <td> 中，
        // 或者像您提示的那样，通过 #gridTable 里面的第4个 td 找到链接。
        const unitsOld = document.querySelectorAll('#gridTable td:nth-child(4)');

        if (unitsOld.length > 0) {
            // plog(`旧版结构: 发现 ${unitsOld.length} 个结果，开始标记...`);
            unitsOld.forEach(tagUniversity);
            return;
        }

        // 最后尝试原先经典的选择器（可能也匹配某些子页面）
        const unitsClassic = document.querySelectorAll('table.result-table-list tbody tr td.unit');
         if (unitsClassic.length > 0) {
            // plog(`经典结构: 发现 ${unitsClassic.length} 个结果，开始标记...`);
            unitsClassic.forEach(tagUniversity);
            return;
        }

        // plog('未找到任何匹配的学校元素。');
    }


    // 创建一个 MutationObserver 实例，用于监听分页和排序导致的DOM更新
    const observer = new MutationObserver((mutationsList, observer) => {
        // 在新版CNKI中，DOM变化后通常需要稍等片刻让数据完全加载
        setTimeout(processResults, 100);
    });

    // 等待最有可能的搜索结果容器加载完成
    function waitForResultContainer() {
        // 兼容新版 (.result-list-box) 和旧版 (#ModuleSearchResult / #gridTable)
        const resultContainer = document.querySelector('.result-list-box') ||
                                document.querySelector('#ModuleSearchResult') ||
                                document.querySelector('#gridTable');

        if (resultContainer) {
            plog('结果列表容器已找到，启动观察器。');

            // 首次加载页面时先执行一次标记
            processResults();

            // 配置观察选项: 观察子节点变化和深层子树 (用于捕获分页/排序)
            const config = {
                childList: true,
                subtree: true,
                attributes: false,
                characterData: false
            };

            // 开始观察
            observer.observe(resultContainer, config);

        } else {
            // 如果元素还没有加载，等待500ms后再次检查
            setTimeout(waitForResultContainer, 500);
        }
    }

    // 启动监控流程
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', waitForResultContainer);
    } else {
        waitForResultContainer();
    }

    // 页面卸载时清理
    window.addEventListener('unload', () => observer.disconnect());
})();