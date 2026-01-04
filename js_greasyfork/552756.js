// ==UserScript==
// @name         3-课程配置检查
// @namespace    http://tampermonkey.net/
// @version      3.2.0
// @description  【猫厂专用】自动检查课程配置是否符合规范，修复了讲义链接格式检查规则
// @author       大生
// @match        https://tyca.codemao.cn/tanyue-course-warehouse/course/info?courseId=*
// @grant        none
// @icon         https://tyca.codemao.cn/favicon.ico
// @license      MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/552756/3-%E8%AF%BE%E7%A8%8B%E9%85%8D%E7%BD%AE%E6%A3%80%E6%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/552756/3-%E8%AF%BE%E7%A8%8B%E9%85%8D%E7%BD%AE%E6%A3%80%E6%9F%A5.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 检查脚本更新
    function checkForUpdates() {
        const currentVersion = GM_info.script.version || '3.0';
        const updateURL = 'https://raw.githubusercontent.com/bpjanson/Vibe_Coding/main/web_scripts/3-%E9%85%8D%E8%AF%BE%E6%A3%80%E6%9F%A5.js';

        fetch(updateURL)
            .then(response => response.text())
            .then(text => {
                // 从远程脚本中提取版本号
                const versionMatch = text.match(/@version\s+(\d+\.\d+)/);
                if (versionMatch && versionMatch[1]) {
                    const latestVersion = versionMatch[1];
                    if (compareVersions(latestVersion, currentVersion) > 0) {
                        showUpdateNotification(currentVersion, latestVersion, updateURL);
                    }
                }
            })
            .catch(error => {
                console.log('检查更新失败:', error);
            });
    }

    // 版本号比较函数
    function compareVersions(v1, v2) {
        const parts1 = v1.split('.').map(Number);
        const parts2 = v2.split('.').map(Number);
        const length = Math.max(parts1.length, parts2.length);

        for (let i = 0; i < length; i++) {
            const num1 = parts1[i] || 0;
            const num2 = parts2[i] || 0;

            if (num1 > num2) return 1;
            if (num1 < num2) return -1;
        }

        return 0;
    }

    // 显示更新通知
    function showUpdateNotification(currentVersion, latestVersion, updateURL) {
        // 创建更新通知容器
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
        `;

        // 创建通知内容
        notification.innerHTML = `
            <div style="padding: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                    <h3 style="margin: 0; font-size: 16px; color: #333;">脚本有更新</h3>
                    <button id="closeNotification" style="background: none; border: none; font-size: 20px; cursor: pointer; padding: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">×</button>
                </div>
                <div style="margin-bottom: 16px; line-height: 1.5;">
                    <p style="margin: 0 0 8px 0;">当前版本: <strong>v${currentVersion}</strong></p>
                    <p style="margin: 0 0 12px 0;">最新版本: <strong style="color: #28a745;">v${latestVersion}</strong></p>
                    <p style="margin: 0; color: #666;">有新功能和修复可用，建议及时更新。</p>
                </div>
                <div style="display: flex; gap: 8px;">
                    <a href="${updateURL}" target="_blank" style="flex: 1; text-align: center; padding: 8px 12px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; font-size: 13px; transition: background 0.2s;">查看更新</a>
                    <button id="updateLater" style="flex: 1; padding: 8px 12px; background: #f8f9fa; color: #333; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; font-size: 13px; transition: background 0.2s;">稍后提醒</button>
                </div>
            </div>
        `;

        // 添加到页面
        document.body.appendChild(notification);

        // 绑定关闭事件
        notification.querySelector('#closeNotification').addEventListener('click', () => {
            document.body.removeChild(notification);
        });

        // 绑定稍后提醒事件
        notification.querySelector('#updateLater').addEventListener('click', () => {
            document.body.removeChild(notification);
        });
    }

    // 检查编程步骤的配置情况
    const programmingSteps = {
        type: 13,
        requiredFields: [
            { field: 'tipsV2List', message: '提示卡', check: true },
            { field: 'taskV2', message: '任务卡', check: true },
            { field: 'pythonRule', message: '正则检测', check: true },
            { field: 'fastInput', message: '快捷输入', check: true },
            { field: 'isGuideWork', message: '提交作品', check: false }
        ],
        // 是否必须存在编程步骤
        mustExist: true,
        mustExistMessage: "上课环节必须配置编程步骤"
    };
    const questionStrps = {
        type: 22,
        requiredFields: [
            { field: 'questionId', message: '题目ID', check: false },
            { field: 'questionName', message: '题目名称', check: false },
            { field: 'knowledgeArr', message: '知识点标签', check: false },
        ],
        // 是否必须标记知识点
        mustknowledgeArr: 3,
        mustknowledgeArrMessage: "至少配置3个带知识点标签的题目"
    };

    // 单数课配置规则
    const singleCourseRules = {
        "课前直播": {
            fields: [
                { key: 'sort', expected: 1, message: "环节顺序应为 1" },
                { key: 'beforeUnlockTime', expected: 1200, message: "开播规则应为：开课前 20 分钟" },
                { key: 'remindTimeBeforeUnlock', expected: 86400, message: "通知规则应为：开课前 1 天" }
            ]
        },
        "上课": {
            fields: [
                { key: 'sort', expected: 2, message: "环节顺序应为 2" },
                { key: 'unlockCondition', expected: "AFTER_START_COURSE", message: "解锁规则应为：开课后解锁" },
                { key: 'showComment', expected: 0, message: "移动端不展示评语" },
                { key: 'pcShowComment', expected: 0, message: "PC端不展示评语" },
                { key: 'complete', expected: 1, message: "该环节应为：完课环节" },
                { key: 'direction', expected: 0, message: "该环节应为：横屏显示" }
            ],
            checkProgrammingSteps: programmingSteps,
            checkquestionStrps: questionStrps,
            // 是否检查打点步骤
            checkKeyPointSteps: true,
            // 是否要求不提交作品
            checkSubmitWorks: {
                type: 13,
                allZero: true,
                message: "单数课不需要提交作品"
            },
            // 检查步骤是否为空
            stepsNotEmpty: true
        }
    };

    // 双数课配置规则
    const doubleCourseRules = {
        "上课": {
            fields: [
                { key: 'sort', expected: 1, message: "环节顺序应为 1" },
                { key: 'unlockCondition', expected: "AFTER_START_COURSE", message: "解锁规则应为：开课后解锁" },
                { key: 'showComment', expected: 1, message: "移动端需展示评语" },
                { key: 'pcShowComment', expected: 1, message: "PC端需展示评语" },
                { key: 'complete', expected: 1, message: "该环节应为：完课环节" },
                { key: 'direction', expected: 0, message: "该环节应为：横屏显示" }
            ],
            checkProgrammingSteps: programmingSteps,
            checkquestionStrps: questionStrps,
            // 是否检查打点步骤
            checkKeyPointSteps: true,
            // 是否要求提交作品
            checkSubmitWorks: {
                type: 13,
                anyOne: true,
                message: "双数课需要提交作品"
            },
            // 检查步骤是否为空
            stepsNotEmpty: true
        },
        "课后练习": {
            fields: [
                { key: 'sort', expected: 2, message: "环节顺序应为 2" },
                { key: 'unlockCondition', expected: "AFTER_START_COURSE", message: "解锁规则应为：开课后解锁" },
                { key: 'showComment', expected: 0, message: "移动端不展示评语" },
                { key: 'pcShowComment', expected: 0, message: "PC端不展示评语" },
                { key: 'complete', expected: 0, message: "该环节应为：非完课环节" },
                { key: 'direction', expected: 1, message: "该环节应为：竖屏显示" }
            ],
            checkWeeklyList: {
                requiredFields: [
                    { field: 'questionId', message: '题目ID', check: false },
                    { field: 'name', message: '题目名称', check: false },
                    { field: 'knowledgeArr', message: '知识点标签', check: false }
                ],
                // 是否必须标记知识点
                mustknowledgeArr: -1,
                mustknowledgeArrMessage: "全部周测题目都需要带知识点标签"
            },
            // 检查周测连接配置
            checkWeeklyTest: true
        },
        "笔记打卡": {
            fields: [
                { key: 'sort', expected: 3, message: "环节顺序应为 3" },
                { key: 'unlockCondition', expected: "AFTER_COMPLETE_COURSE", message: "解锁规则应为：完课后解锁" },
                { key: 'complete', expected: 0, message: "该环节应为：非完课环节" }
            ]
        },
        "电子讲义": {
            fields: [
                { key: 'sort', expected: 4, message: "环节顺序应为 4" },
                { key: 'unlockCondition', expected: "AFTER_COMPLETE_COURSE", message: "解锁规则应为：完课后解锁" },
                { key: 'complete', expected: 0, message: "该环节应为：非完课环节" },
                { key: 'direction', expected: 1, message: "该环节应为：竖屏显示" }
            ],
            // 检讲义测连接配置
            checkUrl: true
        },
        "学习报告": {
            fields: [
                { key: 'sort', expected: 5, message: "环节顺序应为 5" },
                { key: 'unlockCondition', expected: "AFTER_COMPLETE_COURSE", message: "解锁规则应为：完课后解锁" },
                { key: 'complete', expected: 0, message: "该环节应为：非完课环节" }
            ]
        },

    };

    // 全局变量
    let courseId = null;
    let courseData = null;
    let stepsData = {};

    // 通用样式
    const STYLES = {
        container: `
            position: fixed !important;
            right: 20px !important;
            top: 40vh !important;
            transform: translateY(-50%) !important;
            z-index: 999999 !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        `,
        button: `
            width: 50px !important;
            height: 50px !important;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            border: none !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3) !important;
            transition: all 0.2s ease !important;
            font-size: 15px !important;
            font-weight: bold !important;
            color: white !important;
            transform: scale(1) !important;
        `,
        menu: `
            position: absolute !important;
            right: 50px !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            background: transparent !important;
            border-radius: 6px !important;
            padding: 8px !important;
            display: none !important;
            min-width: 120px !important;
            z-index: 1000000 !important;
        `,
        menuButton: `
            width: 100% !important;
            padding: 10px 16px !important;
            border: none !important;
            background: linear-gradient(135deg, #6A72D9 0%, #8B95E5 100%) !important;
            border-radius: 6px !important;
            cursor: pointer !important;
            transition: all 0.2s !important;
            font-size: 13px !important;
            font-weight: 500 !important;
            text-align: center !important;
            min-height: 32px !important;
            color: white !important;
            box-shadow: 0 2px 6px rgba(106, 114, 217, 0.3) !important;
        `
    };

    // 工具函数
    const utils = {
        getCourseId() {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('courseId');
        },

        createElement(tag, styles, content = '') {
            const element = document.createElement(tag);
            if (styles) element.style.cssText = styles;
            if (content) element.innerHTML = content;
            return element;
        },

        addHoverEffect(element, normalBg, hoverBg) {
            element.addEventListener('mouseenter', () => {
                element.style.background = hoverBg;
            });
            element.addEventListener('mouseleave', () => {
                element.style.background = normalBg;
            });
        }
    };

    // 通用API调用函数
    async function fetchAPI(url, errorMessage) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    return data.data;
                }
            }
            return null;
        } catch (error) {
            console.error(errorMessage, error);
            return null;
        }
    }

    // API调用函数
    const fetchCourseLinks = (courseId) =>
        fetchAPI(`https://codecamp-teaching-system.codemao.cn/ty-courses/${courseId}/link`, '获取课程数据失败:');

    const fetchCourseSteps = (courseId, linkId) =>
        fetchAPI(`https://codecamp-teaching-system.codemao.cn/ty-courses/${courseId}/link/${linkId}/step`, '获取课程步骤失败:');

    // 新增：获取周测题目详情的API调用函数
    const fetchWeeklyTestQuestions = (paperId) =>
        fetchAPI(`https://codecamp-teaching-system.codemao.cn/paper/${paperId}`, '获取周测题目失败:');

    // 从周测URL中提取paperId
    function extractPaperIdFromUrl(url) {
        if (!url) return null;
        const match = url.match(/paperId=(\d+)/);
        return match ? match[1] : null;
    }

    // 创建周测题目表格
    function createWeeklyQuestionsTable(questions) {
        const table = utils.createElement('div', `
            border: 1px solid #e1e5e9 !important;
            border-radius: 6px !important;
            overflow: hidden !important;
            font-size: 12px !important;
            margin-top: 8px !important;
        `);

        // 表头
        const headerColumns = ['题目ID', '题目名称', '知识点标签'];
        const header = utils.createElement('div', `
            display: grid !important;
            grid-template-columns: 1fr 2fr 2fr !important;
            background: #f8f9fa !important;
            font-weight: 600 !important;
            border-bottom: 1px solid #e1e5e9 !important;
        `);

        headerColumns.forEach(headerText => {
            const cell = utils.createElement('div', 'padding: 8px 6px !important; border-right: 1px solid #e1e5e9 !important;', headerText);
            header.appendChild(cell);
        });

        table.appendChild(header);

        // 数据行
        questions.forEach((question, index) => {
            const row = utils.createElement('div', `
                display: grid !important;
                grid-template-columns: 1fr 2fr 2fr !important;
                ${index % 2 === 0 ? 'background: #fafafa !important;' : 'background: white !important;'}
                border-bottom: 1px solid #f0f0f0 !important;
            `);

            // 题目ID（带链接）
            const idCell = utils.createElement('div', 'padding: 8px 6px !important; border-right: 1px solid #e1e5e9 !important;');
            if (question.questionId) {
                const link = utils.createElement('a', `
                    color: #007bff !important;
                    text-decoration: none !important;
                    transition: all 0.2s !important;
                `, question.questionId);

                link.href = `https://tyca.codemao.cn/weekly-test/topic/detail?questionId=${question.questionId}&type=1`;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';

                // 添加悬停效果
                link.addEventListener('mouseenter', () => {
                    link.style.textDecoration = 'underline';
                });
                link.addEventListener('mouseleave', () => {
                    link.style.textDecoration = 'none';
                });

                idCell.appendChild(link);
            } else {
                idCell.textContent = '-';
            }
            row.appendChild(idCell);

            // 题目名称
            const nameCell = utils.createElement('div', `
                padding: 8px 6px !important;
                border-right: 1px solid #e1e5e9 !important;
                word-break: break-all !important;
            `, question.name || '-');
            row.appendChild(nameCell);

            // 知识点标签
            const knowledgeCell = utils.createElement('div', `
                padding: 8px 6px !important;
                border-right: 1px solid #e1e5e9 !important;
                word-break: break-all !important;
                ${(!question.knowledgeArr || question.knowledgeArr.length === 0) ? 'color: #dc3545 !important;' : 'color: #28a745 !important;'}
            `);

            if (question.knowledgeArr && question.knowledgeArr.length > 0) {
                knowledgeCell.textContent = question.knowledgeArr.join(', ');
            } else {
                knowledgeCell.textContent = '缺少知识点标签';
            }
            row.appendChild(knowledgeCell);

            table.appendChild(row);
        });

        return table;
    }

    // 创建悬浮按钮
    function createFloatingButton() {
        if (document.getElementById('course-check-container')) {
            return;
        }

        const container = utils.createElement('div', STYLES.container);
        container.id = 'course-check-container';

        const button = utils.createElement('div', STYLES.button, '检查');
        button.id = 'course-check-btn';

        const menu = utils.createElement('div', STYLES.menu);
        menu.id = 'course-check-menu';

        const singleBtn = utils.createElement('button', STYLES.menuButton + 'margin-bottom: 8px !important;', '单数课');
        const doubleBtn = utils.createElement('button', STYLES.menuButton, '双数课');

        // 添加悬停效果
        utils.addHoverEffect(singleBtn, 'linear-gradient(135deg, #6A72D9 0%, #8B95E5 100%)', 'linear-gradient(135deg, #66CDAA 0%, #87E8DE 100%)');
        utils.addHoverEffect(doubleBtn, 'linear-gradient(135deg, #6A72D9 0%, #8B95E5 100%)', 'linear-gradient(135deg, #66CDAA 0%, #87E8DE 100%)');

        // 菜单显示/隐藏逻辑
        let hideTimeout;
        const showMenu = () => {
            clearTimeout(hideTimeout);
            menu.style.display = 'block';
        };
        const hideMenu = () => {
            hideTimeout = setTimeout(() => {
                menu.style.display = 'none';
            }, 50);
        };

        // 事件监听
        button.addEventListener('mouseenter', () => {
            showMenu();
            button.style.background = 'linear-gradient(135deg, #764ba2 0%, #9575cd 100%)';
            button.style.transform = 'scale(1.1)';
            button.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
        });

        button.addEventListener('mouseleave', () => {
            hideMenu();
            button.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
        });

        menu.addEventListener('mouseenter', showMenu);
        menu.addEventListener('mouseleave', hideMenu);

        const handleCheck = (rules, courseType) => {
            menu.style.display = 'none';
            courseData = null;
            stepsData = {};
            performCheck(rules, courseType);
        };

        singleBtn.addEventListener('click', () => handleCheck(singleCourseRules, '单数课'));
        doubleBtn.addEventListener('click', () => handleCheck(doubleCourseRules, '双数课'));

        menu.appendChild(singleBtn);
        menu.appendChild(doubleBtn);
        container.appendChild(button);
        container.appendChild(menu);

        if (document.body) {
            document.body.appendChild(container);
        }
    }
    // 执行检查
    async function performCheck(rules, courseType) {
        if (!courseData) {
            courseData = await fetchCourseLinks(courseId);
            if (!courseData) {
                alert('无法获取课程数据，请检查网络连接或重新登录后重试');
                return;
            }
        }

        const results = {};
        let overallPass = true;

        for (const [sectionName, rule] of Object.entries(rules)) {
            const section = courseData.find(item => item.name === sectionName);
            if (!section) {
                results[sectionName] = {
                    found: false,
                    message: `未找到${sectionName}环节`,
                    sectionPass: false
                };
                overallPass = false;
                continue;
            }

            const sectionResult = {
                found: true,
                fieldChecks: [],
                sectionPass: true
            };

            // 检查基础字段
            rule.fields.forEach(field => {
                const actual = section[field.key];
                const expected = field.expected;
                const isMatch = actual === expected;

                sectionResult.fieldChecks.push({
                    key: field.key,
                    message: field.message,
                    expected: expected,
                    actual: actual,
                    isMatch: isMatch
                });

                if (!isMatch) {
                    sectionResult.sectionPass = false;
                    overallPass = false;
                }
            });

            // 获取步骤数据（如果需要）
            if (rule.checkProgrammingSteps || rule.checkquestionStrps || rule.checkKeyPointSteps || rule.checkSubmitWorks || rule.checkWeeklyTest || rule.stepsNotEmpty) {
                if (!stepsData[section.id]) {
                    stepsData[section.id] = await fetchCourseSteps(courseId, section.id);
                }

                const steps = stepsData[section.id];

                if (steps) {
                    // 新增：检查步骤是否为空
                    if (rule.stepsNotEmpty) {
                        const isValid = steps.length > 0;
                        sectionResult.stepsNotEmptyCheck = {
                            isValid: isValid,
                            message: isValid ? '环节已包含步骤' : '环节步骤不能为空'
                        };
                        if (!isValid) {
                            sectionResult.sectionPass = false;
                            overallPass = false;
                        }
                    }

                    // 检查编程步骤
                    if (rule.checkProgrammingSteps) {
                        sectionResult.programmingSteps = checkProgrammingSteps(steps, rule.checkProgrammingSteps);
                        if (!sectionResult.programmingSteps.hasSteps || !sectionResult.programmingSteps.allStepsPass) {
                            sectionResult.sectionPass = false;
                            overallPass = false;
                        }
                    }

                    // 检查题目步骤
                    if (rule.checkquestionStrps) {
                        sectionResult.questionSteps = checkQuestionSteps(steps, rule.checkquestionStrps);
                        if (!sectionResult.questionSteps.isValid) {
                            sectionResult.sectionPass = false;
                            overallPass = false;
                        }
                    }

                    // 检查打点步骤
                    if (rule.checkKeyPointSteps) {
                        sectionResult.keyPointSteps = checkKeyPointSteps(steps);
                        if (!sectionResult.keyPointSteps.hasKeyPoints) {
                            sectionResult.sectionPass = false;
                            overallPass = false;
                        }
                    }

                    // 检查提交作品
                    if (rule.checkSubmitWorks) {
                        sectionResult.submitWorks = checkSubmitWorks(steps, rule.checkSubmitWorks);
                        if (!sectionResult.submitWorks.isValid) {
                            sectionResult.sectionPass = false;
                            overallPass = false;
                        }
                    }

                    // 检查周测
                    if (rule.checkWeeklyTest) {
                        sectionResult.weeklyTest = await checkWeeklyTest(steps, rule.checkWeeklyList);
                        if (!sectionResult.weeklyTest.isValid) {
                            sectionResult.sectionPass = false;
                            overallPass = false;
                        }
                    }
                } else {
                    sectionResult.stepDataError = `无法获取${sectionName}的步骤数据，相关检查已跳过`;
                    sectionResult.sectionPass = false;
                    overallPass = false;
                }
            }

            // 检查URL
            if (rule.checkUrl) {
                sectionResult.urlCheck = checkUrl(section);
                if (!sectionResult.urlCheck.isValid) {
                    sectionResult.sectionPass = false;
                    overallPass = false;
                }
            }

            results[sectionName] = sectionResult;
        }

        showResults(results, overallPass, courseType);
    }

    // 检查编程步骤
    function checkProgrammingSteps(steps, config) {
        const programmingSteps = steps.filter(step => step.type === config.type);

        // 检查是否必须存在编程步骤
        if (config.mustExist && programmingSteps.length === 0) {
            return {
                hasSteps: false,
                message: config.mustExistMessage,
                steps: [],
                allStepsPass: false
            };
        }

        let allStepsPass = true;

        const results = programmingSteps.map(step => {
            const stepResult = {
                name: step.name,
                sort: (step.sort || 0) + 1,
                checks: [],
                stepPass: true
            };

            config.requiredFields.forEach(fieldConfig => {
                let isConfigured = false;
                let value = step.turDetail?.[fieldConfig.field];

                if (fieldConfig.field === 'isGuideWork') {
                    isConfigured = value === 1;
                } else {
                    isConfigured = value !== undefined && value !== null &&
                        (Array.isArray(value) ? value.length > 0 : value !== '');
                }

                stepResult.checks.push({
                    field: fieldConfig.field,
                    message: fieldConfig.message,
                    isConfigured: isConfigured,
                    value: value,
                    check: fieldConfig.check
                });

                // 如果该字段需要检查且未配置，则该步骤不通过
                if (fieldConfig.check && !isConfigured) {
                    stepResult.stepPass = false;
                }
            });

            // 如果任何一个步骤不通过，整体就不通过
            if (!stepResult.stepPass) {
                allStepsPass = false;
            }

            return stepResult;
        });

        return {
            hasSteps: true,
            steps: results,
            allStepsPass: allStepsPass
        };
    }

    // 检查打点步骤
    function checkKeyPointSteps(steps) {
        const keyPointSteps = steps.filter(step => step.isKeyPoint === 1);
        return {
            hasKeyPoints: keyPointSteps.length > 0,
            keyPointSteps: keyPointSteps.map(step => ({
                name: step.name,
                sort: (step.sort || 0) + 1
            }))
        };
    }

    // 检查提交作品
    function checkSubmitWorks(steps, config) {
        const programmingSteps = steps.filter(step => step.type === config.type);
        const submitSteps = programmingSteps.filter(step => step.turDetail?.isGuideWork === 1);

        if (config.allZero) {
            return {
                isValid: submitSteps.length === 0,
                message: config.message,
                count: submitSteps.length
            };
        } else if (config.anyOne) {
            return {
                isValid: submitSteps.length > 0,
                message: config.message,
                count: submitSteps.length
            };
        }

        return { isValid: true, message: config.message, count: submitSteps.length };
    }

    // 检查周测
    async function checkWeeklyTest(steps, config = null) {
        const weeklyTestSteps = steps.filter(step => step.type === 7);
        const hasWeeklyTest = weeklyTestSteps.length >= 1;

        let weeklyTestUrl = null;
        let weeklyQuestions = null;
        let questionsValid = true;
        let questionsMessage = "";

        if (hasWeeklyTest) {
            const weeklyStep = weeklyTestSteps[0];
            weeklyTestUrl = weeklyStep.h5Detail?.url || weeklyStep.url || null;

            // 如果需要检查周测题目详情
            if (config && weeklyTestUrl) {
                const paperId = extractPaperIdFromUrl(weeklyTestUrl);
                if (paperId) {
                    try {
                        const paperData = await fetchWeeklyTestQuestions(paperId);
                        if (paperData && paperData.questions) {
                            weeklyQuestions = paperData.questions.map(q => ({
                                questionId: q.questionId,
                                name: q.name,
                                knowledgeArr: q.knowledgeArr || []
                            }));

                            // 检查知识点标签要求
                            if (config.mustknowledgeArr === -1) {
                                // 所有题目都需要有知识点标签
                                const questionsWithoutKnowledge = weeklyQuestions.filter(q =>
                                    !q.knowledgeArr || q.knowledgeArr.length === 0
                                );

                                if (questionsWithoutKnowledge.length > 0) {
                                    questionsValid = false;
                                    questionsMessage = `有${questionsWithoutKnowledge.length}个题目缺少知识点标签`;
                                } else {
                                    questionsMessage = `所有${weeklyQuestions.length}个题目都已配置知识点标签`;
                                }
                            }
                        } else {
                            questionsValid = false;
                            questionsMessage = "无法获取周测题目数据";
                        }
                    } catch (error) {
                        console.error('获取周测题目失败:', error);
                        questionsValid = false;
                        questionsMessage = "获取周测题目数据失败";
                    }
                } else {
                    questionsValid = false;
                    questionsMessage = "无法从URL中提取paperId";
                }
            }
        }

        const basicValid = hasWeeklyTest && weeklyTestUrl !== null;
        const overallValid = basicValid && (config ? questionsValid : true);

        return {
            isValid: overallValid,
            message: hasWeeklyTest && weeklyTestUrl ? "已配置周测" : "未配置周测",
            url: weeklyTestUrl,
            questions: weeklyQuestions,
            questionsValid: questionsValid,
            questionsMessage: questionsMessage
        };
    }

    // 检查题目步骤
    function checkQuestionSteps(steps, config) {
        const questionSteps = steps.filter(step => step.type === config.type);

        // 统计有知识点标签的题目数量
        let knowledgeArrCount = 0;

        const results = questionSteps.map(step => {
            const stepResult = {
                name: step.name,
                sort: (step.sort || 0) + 1,
                checks: [],
                stepPass: true
            };

            config.requiredFields.forEach(fieldConfig => {
                let value = null;
                let isConfigured = false;

                // 获取题目列表
                const questionList = step.courseQuestionDetail?.questionList || [];

                if (fieldConfig.field === 'questionId') {
                    // 收集所有题目ID
                    value = questionList.map(q => q.questionId).filter(id => id);
                    isConfigured = value.length > 0;
                } else if (fieldConfig.field === 'questionName') {
                    // 收集所有题目名称
                    value = questionList.map(q => q.questionName).filter(name => name && name.trim() !== '');
                    isConfigured = value.length > 0;
                } else if (fieldConfig.field === 'knowledgeArr') {
                    // 收集所有知识点标签
                    const allKnowledgeArr = [];
                    questionList.forEach(q => {
                        if (Array.isArray(q.knowledgeArr) && q.knowledgeArr.length > 0) {
                            allKnowledgeArr.push(...q.knowledgeArr);
                        }
                    });
                    value = [...new Set(allKnowledgeArr)]; // 去重
                    isConfigured = value.length > 0;
                    if (isConfigured) {
                        knowledgeArrCount++;
                    }
                }

                stepResult.checks.push({
                    field: fieldConfig.field,
                    message: fieldConfig.message,
                    isConfigured: isConfigured,
                    value: value,
                    check: fieldConfig.check
                });
            });

            return stepResult;
        });

        // 检查知识点标签数量是否满足要求
        const isValid = knowledgeArrCount >= config.mustknowledgeArr;

        return {
            hasSteps: questionSteps.length > 0,
            steps: results,
            knowledgeArrCount: knowledgeArrCount,
            requiredKnowledgeArr: config.mustknowledgeArr,
            isValid: isValid,
            message: isValid ?
                `已配置${knowledgeArrCount}个带知识点标签的题目` :
                `仅配置${knowledgeArrCount}个带知识点标签的题目，需要至少${config.mustknowledgeArr}个`
        };
    }

    // 检查URL - 验证是否为有效的URL格式
function checkUrl(link) {
    const url = link.url && link.url.trim();
    let isValid = false;
    let message = "未配置讲义";

    if (url) {
        try {
            // 尝试创建URL对象来验证基本格式
            const urlObj = new URL(url);

            // 检查协议是否为http或https
            if (!['http:', 'https:'].includes(urlObj.protocol)) {
                throw new Error('协议必须是http或https');
            }

            // 检查域名有效性：必须包含至少一个点，且不能是纯中文或特殊字符组合
            const hostname = urlObj.hostname;
            if (!hostname.includes('.') || hostname === 'localhost' ||
                /^[\u4e00-\u9fa5]+$/.test(hostname.replace(/[^\u4e00-\u9fa5]/g, '')) && hostname.length <= 10) {
                throw new Error('无效的域名格式');
            }

            isValid = true;
            message = "已配置有效讲义链接";
        } catch (e) {
            // 如果URL格式无效，捕获异常
            isValid = false;
            message = "讲义链接格式无效";
        }
    }

    return {
        isValid: isValid,
        message: message,
        url: url
    };
}

    // 显示检查结果
    function showResults(results, overallPass, courseType) {
        const existingPanel = document.getElementById('course-check-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        const panel = utils.createElement('div', `
            position: fixed !important;
            right: 20px !important;
            top: 20px !important;
            width: 400px !important;
            max-height: 80vh !important;
            background: white !important;
            border-radius: 12px !important;
            box-shadow: 0 12px 40px rgba(0,0,0,0.2) !important;
            z-index: 999998 !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            overflow: hidden !important;
            border: 1px solid #e1e5e9 !important;
        `);
        panel.id = 'course-check-panel';

        // 头部
        const header = utils.createElement('div', `
            padding: 16px 20px !important;
            background: ${overallPass ? 'linear-gradient(135deg, #4CAF50, #45a049)' : 'linear-gradient(135deg, #f44336, #d32f2f)'} !important;
            color: white !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
        `);

        const title = utils.createElement('h3', 'margin: 0 !important; font-size: 20px !important; font-weight: 600 !important; color: white !important;', `${courseType}检查结果`);
        const status = utils.createElement('span', 'font-size: 20px !important; font-weight: 500 !important;', overallPass ? '✓ 通过' : '✗ 不通过');
        const closeBtn = utils.createElement('button', `
            background: none !important;
            border: none !important;
            color: white !important;
            font-size: 20px !important;
            cursor: pointer !important;
            padding: 0 !important;
            width: 24px !important;
            height: 24px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        `, '×');

        closeBtn.addEventListener('click', () => panel.remove());

        header.appendChild(title);
        header.appendChild(status);
        header.appendChild(closeBtn);

        // 内容区域
        const content = utils.createElement('div', `
            max-height: calc(80vh - 68px) !important;
            overflow-y: auto !important;
            padding: 16px !important;
        `);

        // 生成检查结果
        Object.entries(results).forEach(([sectionName, result]) => {
            const sectionCard = createSectionCard(sectionName, result);
            content.appendChild(sectionCard);
        });

        panel.appendChild(header);
        panel.appendChild(content);
        document.body.appendChild(panel);
    }

    // 创建环节卡片
    function createSectionCard(sectionName, result) {
        const card = utils.createElement('div', `
            border: 1px solid #e1e5e9 !important;
            border-radius: 8px !important;
            margin-bottom: 12px !important;
            overflow: hidden !important;
            background: white !important;
        `);

        const cardHeader = utils.createElement('div', `
            padding: 12px 16px !important;
            cursor: pointer !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            background: ${result.sectionPass ? '#f8fff8' : '#fff5f5'} !important;
            border-left: 4px solid ${result.sectionPass ? '#28a745' : '#dc3545'} !important;
        `);

        const cardTitle = utils.createElement('div', 'display: flex !important; align-items: center !important; gap: 8px !important;');
        const statusIcon = utils.createElement('span', `
            color: ${result.sectionPass ? '#28a745' : '#dc3545'} !important;
            font-weight: bold !important;
            font-size: 16px !important;
        `, result.sectionPass ? '✓' : '✗');
        const titleText = utils.createElement('span', 'font-weight: 600 !important; font-size: 14px !important;', sectionName);
        const expandIcon = utils.createElement('span', `
            transition: transform 0.2s !important;
            font-size: 12px !important;
            color: #666 !important;
        `, '▼');

        cardTitle.appendChild(statusIcon);
        cardTitle.appendChild(titleText);
        cardHeader.appendChild(cardTitle);
        cardHeader.appendChild(expandIcon);

        const cardBody = utils.createElement('div', `
            padding: 0 16px !important;
            max-height: 0 !important;
            overflow: hidden !important;
            transition: all 0.3s ease !important;
            background: #fafafa !important;
        `);

        // 如果有失败项，默认展开
        if (!result.sectionPass) {
            cardBody.style.maxHeight = '1000px';
            cardBody.style.paddingTop = '12px';
            cardBody.style.paddingBottom = '12px';
            expandIcon.style.transform = 'rotate(180deg)';
        }

        // 点击展开/折叠
        cardHeader.addEventListener('click', () => {
            const isExpanded = cardBody.style.maxHeight !== '0px';
            if (isExpanded) {
                cardBody.style.maxHeight = '0px';
                cardBody.style.paddingTop = '0';
                cardBody.style.paddingBottom = '0';
                expandIcon.style.transform = 'rotate(0deg)';
            } else {
                cardBody.style.maxHeight = '1000px';
                cardBody.style.paddingTop = '12px';
                cardBody.style.paddingBottom = '12px';
                expandIcon.style.transform = 'rotate(180deg)';
            }
        });

        // 添加检查项内容
        if (!result.found) {
            const notFoundMsg = utils.createElement('div', 'color: #dc3545 !important; font-size: 14px !important; padding: 8px 0 !important;', result.message);
            cardBody.appendChild(notFoundMsg);
        } else {
            // 基础字段检查
            if (result.fieldChecks && result.fieldChecks.length > 0) {
                const fieldsSection = createCheckSection('基础信息', result.fieldChecks.map(check => ({
                    label: check.message,
                    status: check.isMatch,
                    detail: `正确值: ${check.expected}, 当前值: ${check.actual}`
                })));
                cardBody.appendChild(fieldsSection);
            }

            // 新增：步骤数量检查
            if (result.stepsNotEmptyCheck) {
                const stepsNotEmptySection = createSimpleSection('步骤数量',
                    result.stepsNotEmptyCheck.message,
                    result.stepsNotEmptyCheck.isValid
                );
                cardBody.appendChild(stepsNotEmptySection);
            }

            // 打点步骤检查
            if (result.keyPointSteps) {
                const keyPointSection = createSimpleSection('步骤打点',
                    result.keyPointSteps.hasKeyPoints ? '存在打点步骤' : '没有打点步骤',
                    result.keyPointSteps.hasKeyPoints
                );

                if (result.keyPointSteps.hasKeyPoints && result.keyPointSteps.keyPointSteps.length > 0) {
                    const stepsList = utils.createElement('div', 'margin-left: 20px !important; font-size: 12px !important; color: #666 !important;');
                    result.keyPointSteps.keyPointSteps.forEach(step => {
                        const stepItem = utils.createElement('div', 'margin: 2px 0 !important;', `${step.sort}⭐${step.name}`);
                        stepsList.appendChild(stepItem);
                    });
                    keyPointSection.appendChild(stepsList);
                }

                cardBody.appendChild(keyPointSection);
            }

            // 题目步骤检查
            if (result.questionSteps) {
                const questionSection = createSimpleSection('课中题目',
                    result.questionSteps.message,
                    result.questionSteps.isValid
                );

                if (result.questionSteps.hasSteps && result.questionSteps.steps.length > 0) {
                    const questionTable = createQuestionStepsSection(result.questionSteps.steps);
                    questionSection.appendChild(questionTable);
                }

                cardBody.appendChild(questionSection);
            }

            if (result.programmingSteps) {
                if (result.programmingSteps.hasSteps) {
                    const programmingSection = createProgrammingStepsSection(result.programmingSteps.steps);
                    cardBody.appendChild(programmingSection);
                } else {
                    const programmingSection = createSimpleSection('编程步骤',
                        result.programmingSteps.message,
                        false
                    );
                    cardBody.appendChild(programmingSection);
                }
            }

            if (result.submitWorks) {
                const submitSection = createSimpleSection('作品提交',
                    `${result.submitWorks.message} (${result.submitWorks.count}个)`,
                    result.submitWorks.isValid
                );
                cardBody.appendChild(submitSection);
            }

            if (result.weeklyTest) {
                const weeklySection = createSimpleSection('周测连接',
                    result.weeklyTest.message,
                    result.weeklyTest.isValid,
                    result.weeklyTest.url
                );

                // 如果有题目详情检查结果，添加题目信息显示
                if (result.weeklyTest.questions) {
                    const questionsStatus = utils.createElement('div', 'margin-top: 8px !important; margin-left: 20px !important;');
                    const statusIcon = utils.createElement('span', `color: ${result.weeklyTest.questionsValid ? '#28a745' : '#dc3545'} !important;`, result.weeklyTest.questionsValid ? '✓' : '✗');
                    const statusText = utils.createElement('span', 'font-size: 13px !important; margin-left: 8px !important;', result.weeklyTest.questionsMessage);

                    questionsStatus.appendChild(statusIcon);
                    questionsStatus.appendChild(statusText);
                    weeklySection.appendChild(questionsStatus);

                    // 添加题目详情表格
                    if (result.weeklyTest.questions.length > 0) {
                        const questionsTable = createWeeklyQuestionsTable(result.weeklyTest.questions);
                        weeklySection.appendChild(questionsTable);
                    }
                }

                cardBody.appendChild(weeklySection);
            }

            if (result.urlCheck) {
                const urlSection = createSimpleSection('讲义链接',
                    result.urlCheck.message,
                    result.urlCheck.isValid,
                    result.urlCheck.url
                );
                cardBody.appendChild(urlSection);
            }
        }

        card.appendChild(cardHeader);
        card.appendChild(cardBody);
        return card;
    }

    // 创建简单检查区域
    function createSimpleSection(title, message, isValid, url = null) {
        const section = utils.createElement('div', 'margin: 12px 0 !important;');
        const sectionTitle = utils.createElement('div', 'font-weight: 600 !important; font-size: 13px !important; margin-bottom: 8px !important; color: #333 !important;', title);
        const status = utils.createElement('div', 'display: flex !important; align-items: center !important; gap: 8px !important;');
        const icon = utils.createElement('span', `color: ${isValid ? '#28a745' : '#dc3545'} !important;`, isValid ? '✓' : '✗');
        const text = utils.createElement('span', 'font-size: 13px !important;', message);

        status.appendChild(icon);
        status.appendChild(text);
        section.appendChild(sectionTitle);
        section.appendChild(status);

        // 如果有URL，添加链接显示
        if (url && url.trim() !== '') {
            const urlContainer = utils.createElement('div', 'margin-top: 8px !important; margin-left: 20px !important;');
            const urlLink = utils.createElement('a', `
                color: #007bff !important;
                text-decoration: none !important;
                font-size: 12px !important;
                word-break: break-all !important;
                display: inline-block !important;
                padding: 4px 8px !important;
                background: #f8f9fa !important;
                border-radius: 4px !important;
                border: 1px solid #e9ecef !important;
                transition: all 0.2s !important;
            `, url);

            urlLink.href = url;
            urlLink.target = '_blank';
            urlLink.rel = 'noopener noreferrer';

            // 添加悬停效果
            urlLink.addEventListener('mouseenter', () => {
                urlLink.style.background = '#e9ecef';
                urlLink.style.textDecoration = 'underline';
            });
            urlLink.addEventListener('mouseleave', () => {
                urlLink.style.background = '#f8f9fa';
                urlLink.style.textDecoration = 'none';
            });

            urlContainer.appendChild(urlLink);
            section.appendChild(urlContainer);
        }

        return section;
    }

    // 创建检查项区域
    function createCheckSection(title, items) {
        const section = utils.createElement('div', 'margin: 12px 0 !important;');
        const sectionTitle = utils.createElement('div', 'font-weight: 600 !important; font-size: 13px !important; margin-bottom: 8px !important; color: #333 !important;', title);
        section.appendChild(sectionTitle);

        items.forEach(item => {
            const itemDiv = utils.createElement('div', 'display: flex !important; align-items: flex-start !important; gap: 8px !important; margin: 4px 0 !important; font-size: 13px !important;');
            const icon = utils.createElement('span', `color: ${item.status ? '#28a745' : '#dc3545'} !important; flex-shrink: 0 !important; margin-top: 1px !important;`, item.status ? '✓' : '✗');
            const content = utils.createElement('div', 'flex: 1 !important;');
            const label = utils.createElement('div', 'margin-bottom: 2px !important;', item.label);
            const detail = utils.createElement('div', 'font-size: 11px !important; color: #666 !important; word-break: break-all !important;', item.detail);

            content.appendChild(label);
            if (item.detail) content.appendChild(detail);
            itemDiv.appendChild(icon);
            itemDiv.appendChild(content);
            section.appendChild(itemDiv);
        });

        return section;
    }

    // 创建编程步骤区域
    function createProgrammingStepsSection(programmingSteps) {
        const section = utils.createElement('div', 'margin: 12px 0 !important;');
        const title = utils.createElement('div', 'font-weight: 600 !important; font-size: 13px !important; margin-bottom: 8px !important; color: #333 !important;', '编程步骤');
        section.appendChild(title);

        const table = utils.createElement('div', `
            border: 1px solid #e1e5e9 !important;
            border-radius: 6px !important;
            overflow: hidden !important;
            font-size: 12px !important;
        `);

        // 表头
        const headerColumns = ['名称', '提示卡', '创作任务', '正则检测', '快捷输入', '提交作品'];
        const header = utils.createElement('div', `
            display: grid !important;
            grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr !important;
            background: #f8f9fa !important;
            font-weight: 600 !important;
            border-bottom: 1px solid #e1e5e9 !important;
        `);

        headerColumns.forEach(headerText => {
            const cell = utils.createElement('div', 'padding: 8px 6px !important; border-right: 1px solid #e1e5e9 !important;', headerText);
            header.appendChild(cell);
        });

        table.appendChild(header);

        // 数据行
        programmingSteps.forEach((step, index) => {
            const row = utils.createElement('div', `
                display: grid !important;
                grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr !important;
                ${index % 2 === 0 ? 'background: #fafafa !important;' : 'background: white !important;'}
                border-bottom: 1px solid #f0f0f0 !important;
            `);

            const nameCell = utils.createElement('div', 'padding: 8px 6px !important; border-right: 1px solid #e1e5e9 !important; word-break: break-all !important;', `${step.sort}📍${step.name}`);
            row.appendChild(nameCell);

            step.checks.forEach(check => {
                const cell = utils.createElement('div', 'padding: 8px 6px !important; border-right: 1px solid #e1e5e9 !important; text-align: center !important;', check.isConfigured ? '✅' : '❌');
                row.appendChild(cell);
            });

            table.appendChild(row);
        });

        section.appendChild(table);
        return section;
    }

    // 创建题目步骤区域
    function createQuestionStepsSection(questionSteps) {
        const table = utils.createElement('div', `
            border: 1px solid #e1e5e9 !important;
            border-radius: 6px !important;
            overflow: hidden !important;
            font-size: 12px !important;
            margin-top: 8px !important;
        `);

        // 表头
        const headerColumns = ['名称', '题目ID', '题目名称', '知识点标签'];
        const header = utils.createElement('div', `
            display: grid !important;
            grid-template-columns: 2fr 1fr 2fr 2fr !important;
            background: #f8f9fa !important;
            font-weight: 600 !important;
            border-bottom: 1px solid #e1e5e9 !important;
        `);

        headerColumns.forEach(headerText => {
            const cell = utils.createElement('div', 'padding: 8px 6px !important; border-right: 1px solid #e1e5e9 !important;', headerText);
            header.appendChild(cell);
        });

        table.appendChild(header);

        // 数据行
        questionSteps.forEach((step, index) => {
            const row = utils.createElement('div', `
                display: grid !important;
                grid-template-columns: 2fr 1fr 2fr 2fr !important;
                ${index % 2 === 0 ? 'background: #fafafa !important;' : 'background: white !important;'}
                border-bottom: 1px solid #f0f0f0 !important;
            `);

            // 步骤名称
            const nameCell = utils.createElement('div', 'padding: 8px 6px !important; border-right: 1px solid #e1e5e9 !important; word-break: break-all !important;', `${step.sort}📍${step.name}`);
            row.appendChild(nameCell);

            // 题目ID、题目名称、知识点标签
            step.checks.forEach(check => {
                const cell = utils.createElement('div', `
                    padding: 8px 6px !important;
                    border-right: 1px solid #e1e5e9 !important;
                    word-break: break-all !important;
                    ${check.isConfigured ? 'color: #28a745 !important;' : 'color: #dc3545 !important;'}
                `);

                if (check.field === 'questionId') {
                    if (Array.isArray(check.value) && check.value.length > 0) {
                        // 为每个题目ID创建链接
                        check.value.forEach((questionId, index) => {
                            if (index > 0) {
                                cell.appendChild(document.createTextNode(', '));
                            }

                            const link = utils.createElement('a', `
                                color: #007bff !important;
                                text-decoration: none !important;
                                transition: all 0.2s !important;
                            `, questionId);

                            link.href = `https://tyca.codemao.cn/weekly-test/topic/detail?questionId=${questionId}&type=1`;
                            link.target = '_blank';
                            link.rel = 'noopener noreferrer';

                            // 添加悬停效果
                            link.addEventListener('mouseenter', () => {
                                link.style.textDecoration = 'underline';
                            });
                            link.addEventListener('mouseleave', () => {
                                link.style.textDecoration = 'none';
                            });

                            cell.appendChild(link);
                        });
                    } else {
                        cell.textContent = '-';
                    }
                } else if (check.field === 'questionName') {
                    if (Array.isArray(check.value) && check.value.length > 0) {
                        cell.textContent = check.value.join(', ');
                    } else {
                        cell.textContent = '-';
                    }
                } else if (check.field === 'knowledgeArr') {
                    if (Array.isArray(check.value) && check.value.length > 0) {
                        cell.textContent = check.value.join(', ');
                    } else {
                        cell.textContent = '-';
                    }
                }

                row.appendChild(cell);
            });

            table.appendChild(row);
        });

        return table;
    }

    // 初始化
    function init() {
        courseId = utils.getCourseId();
        createFloatingButton();

        if (courseId) {
            fetchCourseLinks(courseId).then(data => {
                courseData = data;
            });
        }

        // 检查脚本更新
        setTimeout(checkForUpdates, 3000);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();