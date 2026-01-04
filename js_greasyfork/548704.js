// ==UserScript==
// @name         自动选课脚本
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  提供两种模式：1. 一键全选所有可选课。 2. 根据预设列表精确选择课程（用于解决冲突），两种模式均会自动跳过必修课。
// @author       AI Assistant
// @match        https://yjsxt.gzhmu.edu.cn/pdsci/gyxjgl/student/course/*
// @match        http://yjsxt.gzhmu.edu.cn/pdsci/gyxjgl/student/course/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548704/%E8%87%AA%E5%8A%A8%E9%80%89%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/548704/%E8%87%AA%E5%8A%A8%E9%80%89%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 在这里编辑你想要选择的推荐课程列表 ---
    const targetCourses = [
        "Python程序设计与数据分析",
        "R语言在生物信息中的应用",
        "人类疾病动物模型概述",
        "医学遗传学理论与技术",
        "发育生物学与肿瘤演化",
        "基础医学前沿",
        "现代生物研究技术",
        "生命伦理学",
        "生物化学实验与技术",
        "生物医学大型仪器应用技术",
        "神经生物学",
        "细胞分子生物学技术",
        "血管生物学进展",
        "人文医学专题",
        "母胎医学研究进展及前沿技术应用",
        "结构式心理压力调节",
        "肿瘤生物学前沿",
        "让生命永续-器官捐献与移植",
        "重大传染病防治"
    ];
    // -----------------------------------------

    const targetCourseSet = new Set(targetCourses);
    let requiredCourseIds = new Set(); // 用于存放被系统默认选中的必修课ID

    /**
     * 从复选框元素向上追溯，获取课程名称
     * @param {HTMLElement} checkbox - 课程行的复选框元素
     * @returns {string|null} - 返回课程名称或null
     */
    function getCourseNameFromCheckbox(checkbox) {
        const row = checkbox.closest('tr');
        if (!row) return null;
        const fontElement = row.querySelector('td:first-child font');
        if (!fontElement) return null;
        const rawText = fontElement.textContent.trim();
        return rawText.substring(rawText.indexOf(']') + 1).trim();
    }

    /**
     * 功能一：一键全选所有可选课程
     */
    function selectAllOptionalCourses() {
        console.clear();
        console.log('%c[自动选课脚本] 开始执行“1. 一键全选 (可选课)”...', 'color: blue; font-weight: bold;');

        const checkboxes = document.querySelectorAll('input[type="checkbox"][name="courseFlow"]');
        let selectedCount = 0;

        checkboxes.forEach(checkbox => {
            // 跳过已识别的必修课
            if (requiredCourseIds.has(checkbox.id)) {
                console.log(`%c  -> [跳过] 课程ID ${checkbox.id} 是必修课。`, 'color: grey;');
                return;
            }

            // (为方便测试) 解除禁用
            if (checkbox.disabled) {
                checkbox.disabled = false;
            }

            if (!checkbox.checked) {
                const courseName = getCourseNameFromCheckbox(checkbox) || `ID: ${checkbox.id}`;
                console.log(`%c  -> [操作] 选中可选课: "${courseName}"`, 'color: green;');
                checkbox.click();
                selectedCount++;
            }
        });

        const message = `操作完成！共新选中了 ${selectedCount} 门可选课程。`;
        console.log(`%c[自动选课脚本] ${message}`, 'color: blue; font-weight: bold;');
        alert(message);
    }

    /**
     * 功能二：仅选择推荐列表中的课程（用于回退和解决冲突）
     */
    function selectTargetCourses() {
        console.clear();
        console.log('%c[自动选课脚本] 开始执行“2. 仅选推荐列表”...', 'color: blue; font-weight: bold;');

        const checkboxes = document.querySelectorAll('input[type="checkbox"][name="courseFlow"]');
        let newlySelectedCount = 0;
        let deselectedCount = 0;
        let notFoundCourses = [...targetCourses];

        checkboxes.forEach(checkbox => {
            // 同样跳过必修课
            if (requiredCourseIds.has(checkbox.id)) {
                return;
            }

            const courseName = getCourseNameFromCheckbox(checkbox);
            if (!courseName) return;

            // 从“未找到”列表中移除当前课程
            const foundIndex = notFoundCourses.indexOf(courseName);
            if (foundIndex > -1) {
                notFoundCourses.splice(foundIndex, 1);
            }

            // (为方便测试) 解除禁用
            if (checkbox.disabled) {
                checkbox.disabled = false;
            }

            const isTarget = targetCourseSet.has(courseName);

            // 核心逻辑：
            // 1. 如果是目标课程，但没被选中 -> 选中它
            if (isTarget && !checkbox.checked) {
                console.log(`%c  -> [选中] 目标课程: "${courseName}"`, 'color: green;');
                checkbox.click();
                newlySelectedCount++;
            }
            // 2. 如果不是目标课程，但却被选中了 -> 取消选中
            else if (!isTarget && checkbox.checked) {
                console.log(`%c  -> [取消] 非目标可选课: "${courseName}"`, 'color: red;');
                checkbox.click();
                deselectedCount++;
            }
        });

        let message = `操作完成！\n- 新选中了 ${newlySelectedCount} 门推荐课程。\n- 取消了 ${deselectedCount} 门非推荐课程。`;
        if (notFoundCourses.length > 0) {
            const notFoundMessage = `\n\n注意：以下 ${notFoundCourses.length} 门目标课程在当前页面未找到：\n- ${notFoundCourses.join('\n- ')}`;
            message += notFoundMessage;
            console.warn(`[自动选课脚本] 以下目标课程未在页面上找到:`, notFoundCourses);
        }
        console.log(`%c[自动选课脚本] 操作报告已生成。`, 'color: blue; font-weight: bold;');
        alert(message);
    }

    /**
     * 创建操作按钮
     */
    function createButtons() {
        const container = document.createElement('div');
        Object.assign(container.style, {
            position: 'fixed', bottom: '20px', left: '20px', zIndex: '9999',
            display: 'flex', flexDirection: 'column', gap: '10px'
        });

        // 按钮1: 全选
        const btnAll = document.createElement('button');
        btnAll.textContent = '1. 一键全选 (可选课)';
        Object.assign(btnAll.style, {
            padding: '12px 24px', backgroundColor: '#007BFF', color: 'white',
            border: 'none', borderRadius: '5px', cursor: 'pointer',
            fontSize: '16px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        });
        btnAll.addEventListener('click', selectAllOptionalCourses);

        // 按钮2: 选推荐
        const btnTarget = document.createElement('button');
        btnTarget.textContent = '2. 仅选推荐列表 (冲突后用)';
        Object.assign(btnTarget.style, {
            padding: '12px 24px', backgroundColor: '#28a745', color: 'white',
            border: 'none', borderRadius: '5px', cursor: 'pointer',
            fontSize: '16px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        });
        btnTarget.addEventListener('click', selectTargetCourses);

        container.appendChild(btnAll);
        container.appendChild(btnTarget);
        document.body.appendChild(container);
        console.log('[自动选课脚本] 双功能按钮已成功添加到页面。');
    }

    /**
     * 初始化脚本：识别必修课并创建按钮
     */
    function initializeScript() {
        console.log('[自动选课脚本] 正在识别必修课...');
        const checkboxes = document.querySelectorAll('input[type="checkbox"][name="courseFlow"]');
        checkboxes.forEach(checkbox => {
            // 必修课的特征：页面加载时就已选中且被禁用
            if (checkbox.checked && checkbox.disabled) {
                requiredCourseIds.add(checkbox.id);
                const courseName = getCourseNameFromCheckbox(checkbox) || `ID: ${checkbox.id}`;
                console.log(`  -> [识别为必修课] ${courseName}`);
            }
        });
        console.log(`[自动选课脚本] 共识别到 ${requiredCourseIds.size} 门必修课，后续操作将自动跳过它们。`);
        createButtons();
    }

    /**
     * 等待课程列表加载完成后执行初始化
     */
    function waitForElement(selector, callback) {
        const interval = setInterval(() => {
            if (document.querySelector(selector)) {
                clearInterval(interval);
                callback();
            }
        }, 500);
    }

    console.log('[自动选课脚本] 已启动，正在等待课程列表加载...');
    waitForElement('input[name="courseFlow"]', initializeScript);

})();