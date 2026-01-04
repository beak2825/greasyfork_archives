// ==UserScript==
// @name         JobPilot 海投助手
// @name:en      JobPilot Helper for BOSS
// @namespace    https://github.com/fancyboi999/JobPilot
// @version      1.0.0
// @description  BOSS 直聘批量沟通 + 图片简历 + AI 回复的一站式脚本，装好即可开启自动求职流程。
// @description:en  All-in-one automation helper for BOSS Zhipin (auto apply, image resume, AI replies).
// @author       fancyboi999
// @match        https://www.zhipin.com/web/*
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @supportURL   https://github.com/fancyboi999/JobPilot/issues
// @homepageURL  https://github.com/fancyboi999/JobPilot
// @license      AGPL-3.0-or-later
// @icon         https://static.zhipin.com/favicon.ico
// @connect      zhipin.com
// @connect      spark-api-open.xf-yun.com
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/556268/JobPilot%20%E6%B5%B7%E6%8A%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/556268/JobPilot%20%E6%B5%B7%E6%8A%95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 基本配置设置内容
    const CONFIG$1 = {
        BASIC_INTERVAL: 1000,
        OPERATION_INTERVAL: 1500,
        CARD_STYLE: {
            BACKGROUND: '#ffffff',
            SHADOW: '0 6px 18px rgba(0,0,0,0.12)',
            BORDER: '1px solid #e4e7ed'
        },
        COLORS: {
            PRIMARY: '#2196f3',
            SECONDARY: '#ff5722',
            NEUTRAL: '#95a5a6'
        },
        MINI_ICON_SIZE: 40,
        SELECTORS: {
            JOB_CARD: 'li.job-card-box',
            CHAT_BTN: 'a.op-btn-chat',
            CHAT_LIST: 'ul[data-v-8e790d94=""]',
            CHAT_INPUT: '#chat-input',
            SEND_BUTTON: '.btn-send',
            FRIEND_MESSAGE: '.item-friend .text span',
            COMMON_PHRASE_BTN: '.btn-dict',
            RESUME_BTN: '.toolbar-btn:contains("发简历")',
            CONFIRM_SEND: 'span.btn-sure-v2',
            IMAGE_SEND_BTN: '.toolbar-btn-content.icon.btn-sendimg input[type="file"]'
        },
        AI: {
            MAX_REPLIES_FREE: 10,
            MAX_REPLIES_PREMIUM: 25,
            DEFAULT_ROLE: '你是个正在积极寻找工作机会的求职者，回复礼貌简短、言简意赅且避免大段文字，突出优势和能力展现专业素养。'
        },
        MESSAGES: {
            JOB_MATCHED: '找到匹配岗位: ',
            JOB_NOT_FOUND: '没有找到符合条件的岗位',
            START_PROCESSING: '开始自动处理...',
            STOP_PROCESSING: '已停止自动处理',
            RESUME_SENT: '简历已发送',
            AI_REPLYING: 'AI 正在回复...',
            MAX_REPLIES_REACHED: '今日 AI 回复次数已达上限'
        },
        STORAGE_KEYS: {
            PROCESSED_HRS: 'processedHRs',
            AI_REPLY_COUNT: 'aiReplyCount',
            LAST_AI_DATE: 'lastAiDate',
            AI_ROLE: 'aiRole',
            LETTER_LAST_SHOWN: 'letterLastShown'
        }
    };

    window.CONFIG = CONFIG$1;

    // 状态管理
    const state$1 = {
        // 运行状态
        isRunning: false,
        chatMode: null, // 'GREETINGS', 'IMAGE_RESUME', 'AI_REPLY'
        currentIndex: 0,

        // 筛选条件 - 职位名/工作地关键词
        includeKeywords: [],  // 职位名包含关键词
        locationKeywords: [], // 工作地包含关键词

        // 数据缓存
        jobList: [],

        // UI 状态
        ui: {
            isMinimized: false,
            theme: localStorage.getItem('theme') || 'light',
            showWelcomeMessage: JSON.parse(localStorage.getItem('showWelcomeMessage') || 'true')
        },

        // HR交互状态
        hrInteractions: {
            processedHRs: new Set(JSON.parse(localStorage.getItem('processedHRs') || '[]')),
            currentTopHRKey: null,
            sentGreetingsHRs: new Set(JSON.parse(localStorage.getItem('sentGreetingsHRs') || '[]')),
            sentResumeHRs: new Set(JSON.parse(localStorage.getItem('sentResumeHRs') || '[]')),
            sentImageResumeHRs: new Set(JSON.parse(localStorage.getItem('sentImageResumeHRs') || '[]')) // 已发送图片简历的HR
        },

        // AI 功能
        ai: {
            replyCount: JSON.parse(localStorage.getItem('aiReplyCount') || '0'),
            lastAiDate: localStorage.getItem('lastAiDate') || '',
            useAiReply: true
        },

        // 操作记录
        operation: {
            lastMessageTime: 0,
            processedJobsCount: 0,
            lastProcessedDate: localStorage.getItem('lastProcessedDate') || '',
            dailyJobLimit: 50
        },

        // 用户权限
        user: {
            isPremiumUser: localStorage.getItem('isPremiumUser') === 'true'
        },

        // 应用设置
        settings: {
            useAutoSendResume: JSON.parse(localStorage.getItem('useAutoSendResume') || 'true'),
            useAutoSendImageResume: JSON.parse(localStorage.getItem('useAutoSendImageResume') || 'false'), // 自动发送图片简历
            imageResumes: JSON.parse(localStorage.getItem('imageResumes') || '[]'), // 图片简历数组，最多3个，格式：[{path: 'xxx.jpg', data: 'base64data'}]
            autoScrollSpeed: parseInt(localStorage.getItem('autoScrollSpeed') || '500'),
            customPhrases: JSON.parse(localStorage.getItem('customPhrases') || '[]'),
            actionDelays: {
                click: parseInt(localStorage.getItem('clickDelay') || '130'),  // 发送常用语的速度
            },
            notifications: {
                enabled: JSON.parse(localStorage.getItem('notificationsEnabled') || 'true'),
                sound: JSON.parse(localStorage.getItem('notificationSound') || 'true')
            }
        }
    };

    // DOM 元素引用 - 更新为新的输入框引用
    const elements$1 = {
        panel: null,
        controlBtn: null,
        log: null,
        includeInput: null,   // 职位名包含输入框
        locationInput: null,  // 工作地包含输入框
        miniIcon: null,
        aiRoleInput: null,
        themeToggle: null,
        settingsPanel: null,
        greetingsBtn: null,
        resumeBtn: null,
        aiBtn: null
    };

    // 状态持久化工具类
    let StatePersistence$1 = class StatePersistence {
        /**
         * 保存所有状态到localStorage
         */
        static saveState() {
            // 保存HR交互状态
            localStorage.setItem('processedHRs', JSON.stringify([...state$1.hrInteractions.processedHRs]));
            localStorage.setItem('sentGreetingsHRs', JSON.stringify([...state$1.hrInteractions.sentGreetingsHRs]));
            localStorage.setItem('sentResumeHRs', JSON.stringify([...state$1.hrInteractions.sentResumeHRs]));
            localStorage.setItem('sentImageResumeHRs', JSON.stringify([...state$1.hrInteractions.sentImageResumeHRs]));

            // 保存AI状态
            localStorage.setItem('aiReplyCount', state$1.ai.replyCount);
            localStorage.setItem('lastAiDate', state$1.ai.lastAiDate);

            // 保存操作记录
            localStorage.setItem('lastProcessedDate', state$1.operation.lastProcessedDate);

            // 保存用户设置
            localStorage.setItem('showWelcomeMessage', state$1.ui.showWelcomeMessage);
            localStorage.setItem('isPremiumUser', state$1.user.isPremiumUser);
            localStorage.setItem('useAiReply', state$1.ai.useAiReply);
            localStorage.setItem('useAutoSendResume', state$1.settings.useAutoSendResume);
            localStorage.setItem('useAutoSendImageResume', state$1.settings.useAutoSendImageResume);

            // 更新：保存多图片简历数据，单独存储以处理大型Base64数据
            if (state$1.settings.imageResumes && Array.isArray(state$1.settings.imageResumes)) {
                // 过滤无效数据并限制最多3个
                const validResumes = state$1.settings.imageResumes
                    .filter(resume => resume && typeof resume === 'object' && resume.path && resume.data)
                    .slice(0, 3);
                localStorage.setItem('imageResumes', JSON.stringify(validResumes));
            }

            // 清理旧的单图片简历数据
            localStorage.removeItem('imageResumePath');
            localStorage.removeItem('imageResumeData');

            localStorage.setItem('autoScrollSpeed', state$1.settings.autoScrollSpeed);
            localStorage.setItem('customPhrases', JSON.stringify(state$1.settings.customPhrases));

            // 保存UI设置
            localStorage.setItem('theme', state$1.ui.theme);

            // 保存操作延迟
            localStorage.setItem('clickDelay', state$1.settings.actionDelays.click);

            // 保存通知设置
            localStorage.setItem('notificationsEnabled', state$1.settings.notifications.enabled);
            localStorage.setItem('notificationSound', state$1.settings.notifications.sound);

            // 新增：保存筛选条件
            localStorage.setItem('includeKeywords', JSON.stringify(state$1.includeKeywords));
            localStorage.setItem('locationKeywords', JSON.stringify(state$1.locationKeywords));
        }

        /**
         * 从localStorage加载状态
         */
        static loadState() {
            // 初始化加载已在 state 对象定义中完成

            // 加载筛选条件（兼容旧版 excludeKeywords -> 迁移为 locationKeywords）
            const includeKeywords = JSON.parse(localStorage.getItem('includeKeywords') || '[]');
            const locationKeywords = JSON.parse(
                localStorage.getItem('locationKeywords') ||
                localStorage.getItem('excludeKeywords') || '[]'
            );

            if (Array.isArray(includeKeywords)) state$1.includeKeywords = includeKeywords;
            if (Array.isArray(locationKeywords)) state$1.locationKeywords = locationKeywords;

            // 执行图片简历数据迁移
            this.migrateImageResumeData();
        }

        /**
         * 迁移旧版的单个图片简历数据到新版的多图片简历数组
         */
        static migrateImageResumeData() {
            try {
                // 检查是否有旧版数据且新版数据为空
                const hasOldData = localStorage.getItem('imageResumePath') || localStorage.getItem('imageResumeData');
                const imageResumesStr = localStorage.getItem('imageResumes');
                let hasNewData = false;

                if (imageResumesStr) {
                    try {
                        const imageResumes = JSON.parse(imageResumesStr);
                        hasNewData = Array.isArray(imageResumes) && imageResumes.length > 0;
                    } catch (e) {
                        // 解析失败，视为无新数据
                    }
                }

                // 如果有旧数据且无新数据，执行迁移
                if (hasOldData && !hasNewData) {
                    console.log('执行图片简历数据迁移...');

                    const oldResume = {
                        path: localStorage.getItem('imageResumePath') || 'legacy_resume.jpg',
                        data: localStorage.getItem('imageResumeData')
                    };

                    // 只有在有数据的情况下才迁移
                    if (oldResume.data) {
                        state$1.settings.imageResumes = [oldResume];
                        localStorage.setItem('imageResumes', JSON.stringify(state$1.settings.imageResumes));
                        console.log('图片简历数据迁移完成');
                    }

                    // 清理旧数据
                    localStorage.removeItem('imageResumePath');
                    localStorage.removeItem('imageResumeData');
                }
            } catch (error) {
                console.error('图片简历数据迁移失败:', error);
            }
        }
    };

    // HR交互管理类
    let HRInteractionManager$1 = class HRInteractionManager {
        /**
         * 根据HR状态执行相应操作
         * @param {string} hrKey - HR标识（如："姓名-公司名"）
         */
        static async handleHRInteraction(hrKey) {
            // 根据当前模式执行特定操作
            if (state$1.chatMode === 'GREETINGS') {
                if (!state$1.hrInteractions.sentGreetingsHRs.has(hrKey)) {
                    Core.log(`正在发送常用语: ${hrKey}`);
                    const sent = await this.sendGreetings();
                    if (sent) {
                        state$1.hrInteractions.sentGreetingsHRs.add(hrKey);
                        StatePersistence$1.saveState();
                        Core.log(`常用语发送成功`);
                    }
                } else {
                    Core.log(`已发送过常用语，跳过`);
                }
                return;
            }

            if (state$1.chatMode === 'IMAGE_RESUME') {
                if (!state$1.hrInteractions.sentImageResumeHRs.has(hrKey)) {
                    Core.log(`正在发送图片简历: ${hrKey}`);
                    const sentImageResume = await this.sendImageResume();
                    if (sentImageResume) {
                        state$1.hrInteractions.sentImageResumeHRs.add(hrKey);
                        StatePersistence$1.saveState();
                        Core.log(`图片简历发送成功`);
                    }
                } else {
                    Core.log(`已发送过图片简历，跳过`);
                }
                return;
            }

            if (state$1.chatMode === 'AI_REPLY') {
                Core.log(`正在进行AI回复: ${hrKey}`);
                await Core.aiReply();
                return;
            }

            // 原有的智能逻辑（如果chatMode为null或SMART，虽然现在UI上没有入口了，但保留逻辑以防万一）
            // ... (保留原有逻辑或直接返回)
            // 由于用户明确要求拆分，且UI已更改，这里可以简化或保留作为兜底

            // 检查HR是否已发送消息
            await this.hasHRResponded();

            // ... (原有逻辑)
            if (!state$1.hrInteractions.sentGreetingsHRs.has(hrKey)) {
                // ...
                return;
            }
            // ...
        }

        /**
         * 检查HR是否已回复消息
         */
        static async hasHRResponded() {
            await Core.delay(state$1.settings.actionDelays.click);

            const chatContainer = document.querySelector('.chat-message .im-list');
            if (!chatContainer) return false;

            const friendMessages = Array.from(chatContainer.querySelectorAll('li.message-item.item-friend'));
            return friendMessages.length > 0;
        }

        /**
         * 发送常用语
         */
        static async sendGreetings() {
            try {
                // await Core.delay(state.settings.actionDelays.click);

                // 点击“常用语”按钮
                const dictBtn = await Core.waitForElement('.btn-dict');
                if (!dictBtn) {
                    Core.log('未找到常用语按钮');
                    return false;
                }
                await Core.simulateClick(dictBtn);
                await Core.delay(state$1.settings.actionDelays.click);

                // 等待0.3秒，确保常用语列表加载完成
                await Core.delay(300);

                // 查找常用语列表
                const dictList = await Core.waitForElement('ul[data-v-1d93a2d5=""]');
                if (!dictList) {
                    Core.log('未找到常用语列表');
                    return false;
                }

                const dictItems = dictList.querySelectorAll('li');
                if (!dictItems || dictItems.length === 0) {
                    Core.log('常用语列表为空');
                    return false;
                }

                // 遍历并点击每条常用语
                for (let i = 0; i < dictItems.length; i++) {
                    const item = dictItems[i];
                    Core.log(`发送常用语（自我介绍）：第${i + 1}条/共${dictItems.length}条`);
                    await Core.simulateClick(item);
                    await Core.delay(state$1.settings.actionDelays.click);
                }

                return true;
            } catch (error) {
                Core.log(`发送常用语出错: ${error.message}`);
                return false;
            }
        }

        /**
         * 发送简历
         */
        /**
         * 从岗位名称中提取连续的两个字作为关键词
         * @param {string} positionName - 岗位名称
         * @returns {Array} 双字关键词数组
         */
        static _extractTwoCharKeywords(positionName) {
            const keywords = [];
            // 确保中文处理正确，过滤掉标点符号和空格
            const cleanedName = positionName.replace(/[\s,，.。:：;；""''\[\]\(\)\{\}]/g, '');

            // 提取连续的两个字
            for (let i = 0; i < cleanedName.length - 1; i++) {
                keywords.push(cleanedName.substring(i, i + 2));
            }

            return keywords;
        }

        /**
         * 根据双字关键词查找匹配的简历
         * @param {Array} resumeItems - 简历项数组
         * @param {string} positionName - 岗位名称
         * @returns {HTMLElement|null} 匹配的简历项或null
         */
        static _findMatchingResume(resumeItems, positionName) {
            try {
                // 转换为小写用于匹配
                const positionNameLower = positionName.toLowerCase();

                // 提取双字关键词
                const twoCharKeywords = this._extractTwoCharKeywords(positionNameLower);

                // 按关键词优先级（从左到右）遍历
                for (const keyword of twoCharKeywords) {
                    // 查找包含当前关键词的简历
                    for (const item of resumeItems) {
                        const resumeNameElement = item.querySelector('.resume-name');
                        if (!resumeNameElement) continue;

                        const resumeName = resumeNameElement.textContent.trim().toLowerCase();

                        // 检查简历名称是否包含当前关键词
                        if (resumeName.includes(keyword)) {
                            const resumeNameText = resumeNameElement.textContent.trim();
                            Core.log(`找到匹配简历: "${resumeNameText}" 匹配关键词: "${keyword}"`);
                            return item;
                        }
                    }
                }

                // 如果没有找到匹配的简历，返回null（将在主方法中使用第一个简历）
                return null;
            } catch (error) {
                Core.log(`简历匹配出错: ${error.message}`);
                return null;
            }
        }

        static async sendResume() {
            try {
                // 查找"发简历"按钮
                const resumeBtn = await Core.waitForElement(() => {
                    return [...document.querySelectorAll('.toolbar-btn')].find(
                        el => el.textContent.trim() === '发简历'
                    );
                });

                if (!resumeBtn) {
                    Core.log('无法发送简历，未找到发简历按钮');
                    return false;
                }

                if (resumeBtn.classList.contains('unable')) {
                    Core.log('对方未回复，您无权发送简历');
                    return false;
                }

                // 获取当前岗位名称
                let positionName = '';
                try {
                    // 尝试从职位卡片获取岗位名称
                    const positionNameElement = document.querySelector('.position-name') ||
                        document.querySelector('.job-name') ||
                        document.querySelector('[class*="position-content"] .left-content .position-name');

                    if (positionNameElement) {
                        positionName = positionNameElement.textContent.trim();
                        Core.log(`当前岗位: ${positionName}`);
                    } else {
                        Core.log('未找到岗位名称元素');
                    }
                } catch (e) {
                    Core.log(`获取岗位名称出错: ${e.message}`);
                }

                // 点击"发简历"
                await Core.simulateClick(resumeBtn);
                await Core.delay(state$1.settings.actionDelays.click);

                // 等待1秒，确保简历列表加载完成
                await Core.delay(1000);

                // 查找简历列表
                const resumeList = await Core.waitForElement('ul.resume-list');
                if (!resumeList) {
                    Core.log('未找到简历列表');
                    return false;
                }

                // 获取所有简历项
                const resumeItems = Array.from(resumeList.querySelectorAll('li.list-item'));
                if (resumeItems.length === 0) {
                    Core.log('未找到简历列表项');
                    return false;
                }

                // 选择简历：优先根据岗位名称匹配，否则选择第一个
                let selectedResumeItem = null;
                if (positionName) {
                    // 根据双字关键词匹配简历
                    selectedResumeItem = this._findMatchingResume(resumeItems, positionName);
                }

                // 如果没有找到匹配的简历，使用第一个
                if (!selectedResumeItem) {
                    selectedResumeItem = resumeItems[0];
                    const resumeName = selectedResumeItem.querySelector('.resume-name').textContent.trim();
                    Core.log('使用第一个简历: "' + resumeName + '"');
                }

                // 点击选中的简历项
                await Core.simulateClick(selectedResumeItem);
                await Core.delay(state$1.settings.actionDelays.click);

                // 等待0.5秒，确保选择生效
                await Core.delay(500);

                // 查找发送按钮（注意：按钮可能初始为disabled状态）
                const sendBtn = await Core.waitForElement('button.btn-v2.btn-sure-v2.btn-confirm');
                if (!sendBtn) {
                    Core.log('未找到发送按钮');
                    return false;
                }

                // 检查按钮是否可用
                if (sendBtn.disabled) {
                    Core.log('发送按钮不可用，可能简历未正确选择');
                    return false;
                }

                await Core.simulateClick(sendBtn);
                return true;
            } catch (error) {
                Core.log(`发送简历出错: ${error.message}`);
                return false;
            }
        }

        /**
         * 根据岗位名称智能选择合适的图片简历
         * @returns {Object|null} 选中的图片简历对象，格式: {path, data}
         */
        static selectImageResume() {
            if (!state$1.settings.imageResumes || state$1.settings.imageResumes.length === 0) {
                return null;
            }

            // 获取当前岗位名称
            let positionName = '';
            try {
                const positionNameElement = document.querySelector('.position-name') ||
                    document.querySelector('.job-name') ||
                    document.querySelector('[class*="position-content"] .left-content .position-name');

                if (positionNameElement) {
                    positionName = positionNameElement.textContent.trim();
                    Core.log(`当前岗位: ${positionName}`);
                }
            } catch (e) {
                Core.log(`获取岗位名称出错: ${e.message}`);
            }

            // 如果只有一个简历，直接返回
            if (state$1.settings.imageResumes.length === 1) {
                const selectedResume = state$1.settings.imageResumes[0];
                Core.log(`只有一个图片简历，选择: ${selectedResume.path}`);
                return selectedResume;
            }

            // 智能匹配算法：根据简历文件名和岗位名称的相似度进行匹配
            const positionLower = positionName.toLowerCase();
            let bestMatch = null;
            let highestScore = -1;

            state$1.settings.imageResumes.forEach(resume => {
                const resumeNameLower = resume.path.toLowerCase();
                let score = 0;

                // 检查文件名是否包含岗位关键词
                // 提取简历文件名（不含扩展名）
                const resumeName = resume.path.substring(0, resume.path.lastIndexOf('.'));

                // 检查简历名中是否有与岗位相关的关键词
                const commonKeywords = ['前端', '后端', '全栈', '开发', '工程师', '程序', '软件',
                    'frontend', 'backend', 'fullstack', 'developer', 'engineer'];

                commonKeywords.forEach(keyword => {
                    if (positionLower.includes(keyword) && resumeNameLower.includes(keyword)) {
                        score += 1;
                    }
                });

                // 根据文件名长度调整匹配策略
                if (positionName && resumeName) {
                    // 计算简单的字符匹配度
                    const matchingChars = Array.from(positionLower).filter(char =>
                        resumeNameLower.includes(char)
                    ).length;

                    // 计算匹配率（避免除零错误）
                    const matchRate = resumeNameLower.length > 0 ?
                        matchingChars / resumeNameLower.length : 0;
                    score += matchRate * 2;
                }

                // 记录最高分的简历
                if (score > highestScore) {
                    highestScore = score;
                    bestMatch = resume;
                }
            });

            // 如果找到匹配的简历，返回它，否则返回第一个简历
            const selectedResume = bestMatch || state$1.settings.imageResumes[0];
            Core.log(`智能选择图片简历: ${selectedResume.path}`);
            return selectedResume;
        }

        /**
         * 发送图片简历
         */
        static async sendImageResume() {
            try {
                if (!state$1.settings.useAutoSendImageResume || !state$1.settings.imageResumes ||
                    state$1.settings.imageResumes.length === 0) {
                    return false;
                }

                // 智能选择图片简历
                const selectedResume = this.selectImageResume();
                if (!selectedResume) {
                    return false;
                }

                // 找到图片发送按钮
                const imageSendBtn = await Core.waitForElement('.toolbar-btn-content.icon.btn-sendimg input[type="file"]');
                if (!imageSendBtn) {
                    Core.log('未找到图片发送按钮');
                    return false;
                }

                // 创建一个Blob对象
                const byteCharacters = atob(selectedResume.data.split(',')[1]);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'image/jpeg' });

                // 创建一个File对象
                const file = new File([blob], selectedResume.path, {
                    type: 'image/jpeg',
                    lastModified: new Date().getTime()
                });

                // 创建一个DataTransfer对象来模拟文件选择
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);

                // 设置文件输入的值
                imageSendBtn.files = dataTransfer.files;

                // 触发change事件
                const event = new Event('change', { bubbles: true });
                imageSendBtn.dispatchEvent(event);
                return true;
            } catch (error) {
                Core.log(`发送图片简历出错: ${error.message}`);
                return false;
            }
        }
    };


    // 初始化加载状态
    StatePersistence$1.loadState();

    // 导出状态和工具类
    window.state = state$1;
    window.elements = elements$1;
    window.StatePersistence = StatePersistence$1;
    window.HRInteractionManager = HRInteractionManager$1;

    function toggleProcess$1() {
        state.isRunning = !state.isRunning;

        if (state.isRunning) {
            // 获取职位名包含与工作地包含关键词
            state.includeKeywords = elements.includeInput.value.trim().toLowerCase().split(',').filter(keyword => keyword.trim() !== '');
            state.locationKeywords = (elements.locationInput?.value || '').trim().toLowerCase().split(',').filter(keyword => keyword.trim() !== '');

            elements.controlBtn.textContent = '停止海投';
            elements.controlBtn.style.background = `linear-gradient(45deg, ${CONFIG.COLORS.SECONDARY}, #f44336)`;

            const startTime = new Date();
            Core.log(`开始自动海投，时间：${startTime.toLocaleTimeString()}`);
            Core.log(`筛选条件：职位名包含【${state.includeKeywords.join('、') || '无'}】，工作地包含【${state.locationKeywords.join('、') || '无'}】`);

            Core.startProcessing();
        } else {
            elements.controlBtn.textContent = '启动海投';
            elements.controlBtn.style.background = `linear-gradient(45deg, ${CONFIG.COLORS.PRIMARY}, #4db6ac)`;

            state.isRunning = false;

            const stopTime = new Date();
            Core.log(`停止自动海投，时间：${stopTime.toLocaleTimeString()}`);
            Core.log(`本次共沟通 ${state.currentIndex} 个岗位`);

            state.currentIndex = 0;
        }
    }

    function startSendGreetings$1() {
        if (state.isRunning) {
            stopChatProcess();
            return;
        }

        state.isRunning = true;
        state.chatMode = 'GREETINGS';

        // 更新按钮状态
        updateChatButtonsState(true, 'greetings');

        const startTime = new Date();
        Core.log(`开始发送常用语，时间：${startTime.toLocaleTimeString()}`);

        Core.startProcessing();
    }

    function startSendImageResume$1() {
        if (state.isRunning) {
            stopChatProcess();
            return;
        }

        state.isRunning = true;
        state.chatMode = 'IMAGE_RESUME';

        updateChatButtonsState(true, 'imageResume');

        const startTime = new Date();
        Core.log(`开始发送图片简历，时间：${startTime.toLocaleTimeString()}`);

        Core.startProcessing();
    }

    function startAiReply$1() {
        if (state.isRunning) {
            stopChatProcess();
            return;
        }

        state.isRunning = true;
        state.chatMode = 'AI_REPLY';

        updateChatButtonsState(true, 'aiReply');

        const startTime = new Date();
        Core.log(`开始AI回复，时间：${startTime.toLocaleTimeString()}`);

        Core.startProcessing();
    }

    function stopChatProcess() {
        state.isRunning = false;
        state.chatMode = null;

        updateChatButtonsState(false);

        // 断开消息监听
        if (Core.messageObserver) {
            Core.messageObserver.disconnect();
            Core.messageObserver = null;
        }

        const stopTime = new Date();
        Core.log(`停止操作，时间：${stopTime.toLocaleTimeString()}`);
    }

    function updateChatButtonsState(isRunning, activeMode = null) {
        const greetingsBtn = document.getElementById('btn-greetings');
        const resumeBtn = document.getElementById('btn-image-resume');
        const aiBtn = document.getElementById('btn-ai-reply');

        if (!greetingsBtn || !resumeBtn || !aiBtn) return;

        if (isRunning) {
            // 禁用所有按钮，除了当前运行的按钮变为"停止"
            greetingsBtn.disabled = activeMode !== 'greetings';
            resumeBtn.disabled = activeMode !== 'imageResume';
            aiBtn.disabled = activeMode !== 'aiReply';

            if (activeMode === 'greetings') {
                greetingsBtn.textContent = '停止发送';
                greetingsBtn.style.background = `linear-gradient(45deg, ${CONFIG.COLORS.SECONDARY}, #f44336)`;
            } else if (activeMode === 'imageResume') {
                resumeBtn.textContent = '停止发送';
                resumeBtn.style.background = `linear-gradient(45deg, ${CONFIG.COLORS.SECONDARY}, #f44336)`;
            } else if (activeMode === 'aiReply') {
                aiBtn.textContent = '停止回复';
                aiBtn.style.background = `linear-gradient(45deg, ${CONFIG.COLORS.SECONDARY}, #f44336)`;
            }
        } else {
            // 恢复所有按钮
            greetingsBtn.disabled = false;
            resumeBtn.disabled = false;
            aiBtn.disabled = false;

            greetingsBtn.textContent = '发常用语';
            resumeBtn.textContent = '发图片简历';
            aiBtn.textContent = 'AI回复';

            greetingsBtn.style.background = 'var(--primary-color)';
            resumeBtn.style.background = 'var(--primary-color)';
            aiBtn.style.background = 'var(--primary-color)';
        }
    }

    function showCustomAlert(message) {
        const overlay = document.createElement('div');
        overlay.id = 'custom-alert-overlay';
        overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        backdrop-filter: blur(3px);
        animation: fadeIn 0.3s ease-out;
    `;

        const dialog = document.createElement('div');
        dialog.id = 'custom-alert-dialog';
        dialog.style.cssText = `
        background: white;
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        width: 90%;
        max-width: 400px;
        overflow: hidden;
        transform: scale(0.95);
        animation: scaleIn 0.3s ease-out forwards;
    `;

        const header = document.createElement('div');
        header.style.cssText = `
        padding: 16px 24px;
        background: ${CONFIG.COLORS.PRIMARY};
        color: white;
        font-size: 18px;
        font-weight: 500;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
        header.innerHTML = `<span>JOBPILOT 投递助手</span><i class="fa fa-info-circle ml-2"></i>`;

        const content = document.createElement('div');
        content.style.cssText = `
        padding: 24px;
        font-size: 16px;
        line-height: 1.8;
        color: #333;
    `;
        content.innerHTML = message.replace(/\n/g, '<br>');

        const footer = document.createElement('div');
        footer.style.cssText = `
        padding: 12px 24px;
        display: flex;
        justify-content: center;
        border-top: 1px solid #eee;
    `;

        const confirmBtn = document.createElement('button');
        confirmBtn.style.cssText = `
        background: ${CONFIG.COLORS.PRIMARY};
        color: white;
        border: none;
        border-radius: 8px;
        padding: 10px 24px;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
    `;
        confirmBtn.textContent = '确定';

        confirmBtn.addEventListener('click', () => {
            overlay.remove();
        });

        confirmBtn.addEventListener('mouseenter', () => {
            confirmBtn.style.transform = 'translateY(-2px)';
            confirmBtn.style.boxShadow = '0 6px 16px rgba(33, 150, 243, 0.5)';
        });

        confirmBtn.addEventListener('mouseleave', () => {
            confirmBtn.style.transform = 'translateY(0)';
            confirmBtn.style.boxShadow = '0 4px 12px rgba(33, 150, 243, 0.4)';
        });

        footer.appendChild(confirmBtn);

        dialog.appendChild(header);
        dialog.appendChild(content);
        dialog.appendChild(footer);

        overlay.appendChild(dialog);

        document.body.appendChild(overlay);

        const style = document.createElement('style');
        style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes scaleIn {
            from {
                transform: scale(0.95);
                opacity: 0;
            }
            to {
                transform: scale(1);
                opacity: 1;
            }
        }
    `;
        document.head.appendChild(style);
    }

    function showConfirmDialog(message, confirmCallback, cancelCallback) {
        const overlay = document.createElement('div');
        overlay.id = 'custom-confirm-overlay';
        overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        backdrop-filter: blur(3px);
        animation: fadeIn 0.3s ease-out;
    `;

        const dialog = document.createElement('div');
        dialog.id = 'custom-confirm-dialog';
        dialog.style.cssText = `
        background: white;
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        width: 90%;
        max-width: 400px;
        overflow: hidden;
        transform: scale(0.95);
        animation: scaleIn 0.3s ease-out forwards;
    `;

        const header = document.createElement('div');
        header.style.cssText = `
        padding: 16px 24px;
        background: ${CONFIG.COLORS.PRIMARY};
        color: white;
        font-size: 18px;
        font-weight: 500;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
        header.innerHTML = `<span>JOBPILOT 投递助手</span><i class="fa fa-question-circle ml-2"></i>`;

        const content = document.createElement('div');
        content.style.cssText = `
        padding: 24px;
        font-size: 16px;
        line-height: 1.8;
        color: #333;
    `;
        content.textContent = message;

        const buttonArea = document.createElement('div');
        buttonArea.style.cssText = `
        padding: 12px 24px;
        display: flex;
        justify-content: space-around;
        border-top: 1px solid #eee;
    `;

        const confirmBtn = document.createElement('button');
        confirmBtn.style.cssText = `
        background: ${CONFIG.COLORS.PRIMARY};
        color: white;
        border: none;
        border-radius: 8px;
        padding: 10px 24px;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
    `;
        confirmBtn.textContent = '确认';

        confirmBtn.addEventListener('click', () => {
            if (typeof confirmCallback === 'function') {
                confirmCallback();
            }
            overlay.remove();
        });

        const cancelBtn = document.createElement('button');
        cancelBtn.style.cssText = `
        background: #f0f0f0;
        color: #666;
        border: none;
        border-radius: 8px;
        padding: 10px 24px;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.3s;
    `;
        cancelBtn.textContent = '取消';

        cancelBtn.addEventListener('click', () => {
            if (typeof cancelCallback === 'function') {
                cancelCallback();
            }
            overlay.remove();
        });

        buttonArea.appendChild(cancelBtn);
        buttonArea.appendChild(confirmBtn);

        dialog.appendChild(header);
        dialog.appendChild(content);
        dialog.appendChild(buttonArea);

        overlay.appendChild(dialog);

        document.body.appendChild(overlay);

        const style = document.createElement('style');
        style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes scaleIn {
            from {
                transform: scale(0.95);
                opacity: 0;
            }
            to {
                transform: scale(1);
                opacity: 1;
            }
        }
    `;
        document.head.appendChild(style);
    }

    function showProgress(message, progress) {
        let progressContainer = document.getElementById('progress-container');
        let progressBar = document.getElementById('progress-bar');
        let progressText = document.getElementById('progress-text');

        if (!progressContainer) {
            progressContainer = document.createElement('div');
            progressContainer.id = 'progress-container';
            progressContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            padding: 24px;
            width: 90%;
            max-width: 400px;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            gap: 16px;
        `;

            progressText = document.createElement('div');
            progressText.id = 'progress-text';
            progressText.style.cssText = `
            font-size: 16px;
            color: #333;
            text-align: center;
        `;

            const progressBackground = document.createElement('div');
            progressBackground.style.cssText = `
            height: 12px;
            background: #f0f0f0;
            border-radius: 6px;
            overflow: hidden;
        `;

            progressBar = document.createElement('div');
            progressBar.id = 'progress-bar';
            progressBar.style.cssText = `
            height: 100%;
            background: linear-gradient(90deg, ${CONFIG.COLORS.PRIMARY}, #4db6ac);
            border-radius: 6px;
            transition: width 0.3s ease;
            width: 0%;
        `;

            progressBackground.appendChild(progressBar);
            progressContainer.appendChild(progressText);
            progressContainer.appendChild(progressBackground);

            document.body.appendChild(progressContainer);
        }

        progressText.textContent = message;
        progressBar.style.width = `${progress}%`;

        if (progress >= 100) {
            setTimeout(() => {
                if (progressContainer && progressContainer.parentNode) {
                    progressContainer.parentNode.removeChild(progressContainer);
                }
            }, 1000);
        }
    }


    window.toggleProcess = toggleProcess$1;
    window.startSendGreetings = startSendGreetings$1;
    window.startSendImageResume = startSendImageResume$1;
    window.startAiReply = startAiReply$1;
    window.showCustomAlert = showCustomAlert;
    window.showConfirmDialog = showConfirmDialog;
    window.showProgress = showProgress;

    /**
      * UI模块：面板界面 - 复古描边风
      */
    const UI$1 = {
        // 页面类型常量
        PAGE_TYPES: {
            JOB_LIST: 'jobList',
            CHAT: 'chat'
        },

        // 当前页面类型
        currentPageType: null,

        // UI状态
        isReady: false,

        // 初始化UI
        init(isLoading = false) {
            this.currentPageType = location.pathname.includes('/chat')
                ? this.PAGE_TYPES.CHAT
                : this.PAGE_TYPES.JOB_LIST;
            this._applyTheme();
            this.createControlPanel(isLoading);
            this.createMiniIcon();
        },

        // 设置为就绪状态
        setReady() {
            this.isReady = true;
            this._enableControlButton();
        },

        // 创建主控制面板
        createControlPanel(isLoading = false) {
            if (document.getElementById('boss-pro-panel')) {
                document.getElementById('boss-pro-panel').remove();
            }

            elements.panel = this._createPanel();

            const header = this._createHeader();
            const controls = this._createPageControls(isLoading);
            elements.log = this._createLogger();
            const footer = this._createFooter();

            elements.panel.append(header, controls, elements.log, footer);
            document.body.appendChild(elements.panel);
            this._makeDraggable(elements.panel);
        },

        // 应用主题配置 - 复古描边风
        _applyTheme() {
            CONFIG.COLORS = this.currentPageType === this.PAGE_TYPES.JOB_LIST
                ? this.THEMES.JOB_LIST
                : this.THEMES.CHAT;

            // 将颜色配置应用到CSS变量
            document.documentElement.style.setProperty('--primary-color', CONFIG.COLORS.primary);
            document.documentElement.style.setProperty('--secondary-color', CONFIG.COLORS.secondary);
            document.documentElement.style.setProperty('--accent-color', CONFIG.COLORS.accent);
            document.documentElement.style.setProperty('--neutral-color', CONFIG.COLORS.neutral);
        },

        // 复古 颜色主题配置
        THEMES: {
            JOB_LIST: {
                primary: '#6FC2FF',    // 品牌蓝
                secondary: '#F4EFEA',  // 奶油色
                accent: '#383838',     // 墨黑
                neutral: '#A1A1A1'     // 中性灰
            },
            CHAT: {
                primary: '#53DBC9',    // 品牌绿
                secondary: '#F4EFEA',  // 奶油色
                accent: '#383838',     // 墨黑
                neutral: '#A1A1A1'     // 中性灰
            }
        },

        // 创建面板容器 - 复古描边风
        _createPanel() {
            const panel = document.createElement('div');
            panel.id = 'boss-pro-panel';
            panel.className = this.currentPageType === this.PAGE_TYPES.JOB_LIST
                ? 'boss-joblist-panel'
                : 'boss-chat-panel';

            // 复古描边风样式
            const baseStyles = `
            position: fixed;
            top: 40px;
            right: 30px;
            width: clamp(320px, 90vw, 420px);
            border-radius: 2px;
            padding: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            z-index: 2147483647;
            display: flex;
            flex-direction: column;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            background: #FFFFFF;
            box-shadow: 0 10px 25px rgba(56, 56, 56, 0.2);
            border: 2px solid #383838;
            cursor: default;
        `;

            panel.style.cssText = baseStyles;

            // 设置RGB颜色变量
            const rgbColor = this._hexToRgb(CONFIG.COLORS.primary);
            document.documentElement.style.setProperty('--primary-rgb', rgbColor);

            return panel;
        },

        // 创建头部 - 复古描边风
        _createHeader() {
            const header = document.createElement('div');
            header.className = this.currentPageType === this.PAGE_TYPES.JOB_LIST
                ? 'boss-header'
                : 'boss-chat-header';

            header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            background: #F4EFEA;
            border-bottom: 2px solid #383838;
            cursor: move;
        `;

            const title = this._createTitle();

            // 创建按钮容器
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = `
            display: flex;
            gap: 8px;
        `;

            // 添加清空日志按钮
            const clearLogBtn = this._createIconButton('🗑', () => {
                elements.log.innerHTML = `<div style="color:var(--neutral-color); margin-bottom:8px;">🚢 欢迎使用 JobPilot 海投助手！</div>`;
            }, this.currentPageType === this.PAGE_TYPES.JOB_LIST
                ? '清空日志'
                : '清空聊天记录');

            // 添加设置按钮
            const settingsBtn = this._createIconButton('⚙', () => {
                showSettingsDialog();
            }, this.currentPageType === this.PAGE_TYPES.JOB_LIST
                ? '插件设置'
                : 'AI人设设置');

            // 添加最小化按钮
            const closeBtn = this._createIconButton('−', () => {
                state.isMinimized = true;
                elements.panel.style.transform = 'translateY(-120%)';
                elements.miniIcon.style.display = 'flex';
            }, this.currentPageType === this.PAGE_TYPES.JOB_LIST
                ? '最小化海投面板'
                : '最小化聊天面板');

            buttonContainer.append(clearLogBtn, settingsBtn, closeBtn);

            header.append(title, buttonContainer);
            return header;
        },

        // 创建标题 - 复古描边风
        _createTitle() {
            const title = document.createElement('div');
            title.style.display = 'flex';
            title.style.alignItems = 'center';
            title.style.gap = '12px';

            // 复古描边风图标
            const icon = document.createElement('div');
            icon.style.cssText = `
            width: 44px;
            height: 44px;
            background: var(--primary-color);
            border: 2px solid #383838;
            border-radius: 2px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
        `;
            icon.textContent = '🚢';

            const titleText = document.createElement('div');

            const mainTitle = document.createElement('h3');
            mainTitle.style.cssText = `
            margin: 0;
            font-family: 'Monaco', 'Consolas', monospace;
            font-size: 18px;
            font-weight: 400;
            text-transform: uppercase;
            letter-spacing: 0.02em;
            color: #383838;
            line-height: 1.2;
        `;
            mainTitle.innerHTML = this.currentPageType === this.PAGE_TYPES.JOB_LIST
                ? 'BOSS <span style="color:var(--primary-color);">海投</span> 助手'
                : 'BOSS <span style="color:var(--primary-color);">智能</span> 聊天';

            const subTitle = document.createElement('p');
            subTitle.style.cssText = `
            margin: 2px 0 0 0;
            font-size: 12px;
            font-weight: 300;
            color: var(--neutral-color);
        `;
            subTitle.textContent = this.currentPageType === this.PAGE_TYPES.JOB_LIST
                ? 'Automate your job search'
                : 'AI-powered conversations';

            titleText.appendChild(mainTitle);
            titleText.appendChild(subTitle);
            title.appendChild(icon);
            title.appendChild(titleText);

            return title;
        },

        // 创建页面控制区域
        _createPageControls(isLoading = false) {
            if (this.currentPageType === this.PAGE_TYPES.JOB_LIST) {
                return this._createJobListControls(isLoading);
            } else {
                return this._createChatControls(isLoading);
            }
        },

        // 创建职位列表页面控制区域
        _createJobListControls(isLoading = false) {
            const container = document.createElement('div');
            container.className = 'boss-joblist-controls';
            container.style.cssText = `
            padding: 16px;
            background: #FFFFFF;
        `;

            // 筛选条件区域
            const filterContainer = this._createFilterContainer();

            elements.controlBtn = this._createTextButton(
                isLoading ? '初始化中...' : '启动海投',
                isLoading ? '#A1A1A1' : 'var(--primary-color)',
                () => {
                    if (this.isReady) toggleProcess();
                },
                isLoading
            );

            // 居中控制按钮
            const btnContainer = document.createElement('div');
            btnContainer.style.cssText = `
            display: flex;
            justify-content: center;
            width: 100%;
        `;
            btnContainer.appendChild(elements.controlBtn);

            container.append(filterContainer, btnContainer);
            return container;
        },

        // 创建聊天页面控制区域
        _createChatControls(isLoading = false) {
            const container = document.createElement('div');
            container.className = 'boss-chat-controls';
            container.style.cssText = `
            padding: 16px;
            background: #FFFFFF;
        `;

            // 人设和模板选择
            const configRow = document.createElement('div');
            configRow.style.cssText = `
            display: flex;
            gap: 12px;
            margin-bottom: 16px;
        `;

            // 动态获取AI人设选项
            const getPersonaOptions = () => {
                const defaultOptions = [
                    { value: 'default', text: '默认' }
                ];
                const customPersonas = settings.customPersonas || [];
                return [...defaultOptions, ...customPersonas];
            };

            const personaCol = this._createSelectControl('AI人设：', 'ai-persona-selector', getPersonaOptions());
            const templateCol = this._createSelectControl('仅回复岗位包含：', 'reply-template-selector', [
                { value: 'standard', text: '标准' },
                { value: 'brief', text: '简洁' },
                { value: 'detailed', text: '详细' }
            ]);

            elements.personaSelector = personaCol.querySelector('select');
            configRow.append(personaCol, templateCol);

            // 按钮容器 - 使用Grid布局优化美观度
            const btnContainer = document.createElement('div');
            btnContainer.style.cssText = `
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            width: 100%;
        `;

            // 1. 发常用语按钮
            const greetingsBtn = this._createTextButton(
                '发常用语',
                'var(--primary-color)',
                () => {
                    if (this.isReady) startSendGreetings();
                },
                isLoading
            );
            greetingsBtn.id = 'btn-greetings';
            greetingsBtn.style.maxWidth = '100%'; // 填满网格
            elements.greetingsBtn = greetingsBtn; // 保存引用

            // 2. 发图片简历按钮
            const resumeBtn = this._createTextButton(
                '发图片简历',
                'var(--primary-color)',
                () => {
                    if (this.isReady) startSendImageResume();
                },
                isLoading
            );
            resumeBtn.id = 'btn-image-resume';
            resumeBtn.style.maxWidth = '100%'; // 填满网格
            elements.resumeBtn = resumeBtn; // 保存引用

            // 3. AI回复按钮 - 占据两列
            const aiBtn = this._createTextButton(
                'AI回复',
                'var(--primary-color)',
                () => {
                    if (this.isReady) startAiReply();
                },
                isLoading
            );
            aiBtn.id = 'btn-ai-reply';
            aiBtn.style.gridColumn = 'span 2'; // 占据整行
            aiBtn.style.maxWidth = '100%'; // 填满网格
            elements.aiBtn = aiBtn; // 保存引用

            btnContainer.append(greetingsBtn, resumeBtn, aiBtn);

            container.append(configRow, btnContainer);
            return container;
        },

        // 创建筛选容器 - 复古描边风
        _createFilterContainer() {
            const filterContainer = document.createElement('div');
            filterContainer.style.cssText = `
            background: #F4EFEA;
            border: 2px solid #383838;
            border-radius: 2px;
            padding: 16px;
            margin-bottom: 16px;
        `;

            const filterRow = document.createElement('div');
            filterRow.style.cssText = `
            display: flex;
            gap: 12px;
            margin-bottom: 12px;
        `;

            const includeFilterCol = this._createInputControl('职位名包含：', 'include-filter', '如：前端,开发');
            const locationFilterCol = this._createInputControl('工作地包含：', 'location-filter', '如：杭州,滨江');

            elements.includeInput = includeFilterCol.querySelector('input');
            elements.locationInput = locationFilterCol.querySelector('input');

            filterRow.append(includeFilterCol, locationFilterCol);

            filterContainer.append(filterRow);
            return filterContainer;
        },

        // 创建输入控件 - 复古描边风
        _createInputControl(labelText, id, placeholder) {
            const controlCol = document.createElement('div');
            controlCol.style.cssText = 'flex: 1;';

            const label = document.createElement('label');
            label.textContent = labelText;
            label.style.cssText = `
            display: block;
            margin-bottom: 8px;
            font-family: 'Monaco', 'Consolas', monospace;
            font-size: 12px;
            font-weight: 400;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #383838;
        `;

            const input = document.createElement('input');
            input.id = id;
            input.placeholder = placeholder;
            input.style.cssText = `
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #383838;
            border-radius: 2px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 300;
            background: #FFFFFF;
            transition: all 0.2s ease;
        `;

            input.addEventListener('focus', () => {
                input.style.outline = '2px solid #2BA5FF';
                input.style.outlineOffset = '0';
                input.style.borderColor = '#2BA5FF';
            });

            input.addEventListener('blur', () => {
                input.style.outline = 'none';
                input.style.borderColor = '#383838';
            });

            controlCol.append(label, input);
            return controlCol;
        },

        // 创建选择控件 - 复古描边风
        _createSelectControl(labelText, id, options) {
            const controlCol = document.createElement('div');
            controlCol.style.cssText = 'flex: 1;';

            const label = document.createElement('label');
            label.textContent = labelText;
            label.style.cssText = `
            display: block;
            margin-bottom: 8px;
            font-family: 'Monaco', 'Consolas', monospace;
            font-size: 12px;
            font-weight: 400;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #383838;
        `;

            const select = document.createElement('select');
            select.id = id;
            select.style.cssText = `
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #383838;
            border-radius: 2px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            background: #FFFFFF;
            color: #383838;
            transition: all 0.2s ease;
        `;

            options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option.value;
                opt.textContent = option.text;
                select.appendChild(opt);
            });

            select.addEventListener('focus', () => {
                select.style.outline = '2px solid #2BA5FF';
                select.style.outlineOffset = '0';
            });

            select.addEventListener('blur', () => {
                select.style.outline = 'none';
            });

            controlCol.append(label, select);
            return controlCol;
        },

        // 日志区域 - 复古描边风
        _createLogger() {
            const log = document.createElement('div');
            log.id = 'pro-log';
            log.className = this.currentPageType === this.PAGE_TYPES.JOB_LIST
                ? 'boss-joblist-log'
                : 'boss-chat-log';

            const height = this.currentPageType === this.PAGE_TYPES.JOB_LIST ? '300px' : '300px';

            log.style.cssText = `
            height: ${height};
            overflow-y: auto;
            background: #F4EFEA;
            border-top: 2px solid #383838;
            padding: 16px;
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 13px;
            line-height: 1.6;
            transition: all 0.3s ease;
            user-select: text;
        `;

            // 自定义滚动条
            const style = document.createElement('style');
            style.textContent = `
            #pro-log::-webkit-scrollbar {
                width: 8px;
            }
            #pro-log::-webkit-scrollbar-track {
                background: #F8F8F7;
            }
            #pro-log::-webkit-scrollbar-thumb {
                background: #A1A1A1;
                border-radius: 0;
            }
            #pro-log::-webkit-scrollbar-thumb:hover {
                background: #383838;
            }
        `;
            document.head.appendChild(style);

            return log;
        },

        // 面板页脚 - 复古描边风
        _createFooter() {
            const footer = document.createElement('div');
            footer.className = this.currentPageType === this.PAGE_TYPES.JOB_LIST
                ? 'boss-joblist-footer'
                : 'boss-chat-footer';

            footer.style.cssText = `
            padding: 12px 16px;
            background: #383838;
            color: #FFFFFF;
            font-size: 11px;
            font-weight: 300;
            text-align: center;
            border-top: 2px solid #383838;
        `;

            footer.textContent = 'JobPilot · © 2025 fancyboi999';
            return footer;
        },

        // 文本按钮 - 复古描边风
        _createTextButton(text, bgColor, onClick, isDisabled = false) {
            const btn = document.createElement('button');
            btn.className = 'boss-btn';
            btn.textContent = text;
            btn.disabled = isDisabled;

            const baseCursor = isDisabled ? 'not-allowed' : 'pointer';
            const baseOpacity = isDisabled ? '0.6' : '1';

            btn.style.cssText = `
            width: 100%;
            max-width: 360px;
            margin: 0 auto; /* 居中显示 */
            padding: 12px 20px;
            background: ${bgColor};
            color: #383838;
            border: 2px solid #383838;
            border-radius: 2px;
            cursor: ${baseCursor};
            font-family: 'Monaco', 'Consolas', monospace;
            font-size: 14px;
            font-weight: 400;
            text-transform: uppercase;
            letter-spacing: 0.02em;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: ${baseOpacity};
        `;

            if (!isDisabled) {
                btn.addEventListener('mouseenter', () => {
                    btn.style.background = '#2BA5FF';
                    btn.style.transform = 'translate(7px, -7px)';
                    btn.style.boxShadow = '-7px 7px 0 #383838';
                });

                btn.addEventListener('mouseleave', () => {
                    btn.style.background = bgColor;
                    btn.style.transform = 'translate(0, 0)';
                    btn.style.boxShadow = 'none';
                });

                btn.addEventListener('mousedown', () => {
                    btn.style.transform = 'translate(0, 0)';
                    btn.style.boxShadow = 'none';
                });
            }

            btn.addEventListener('click', onClick);

            return btn;
        },

        // 启用控制按钮
        _enableControlButton() {
            if (this.currentPageType === this.PAGE_TYPES.JOB_LIST) {
                if (!elements.controlBtn) return;

                const newBgColor = 'var(--primary-color)';
                elements.controlBtn.disabled = false;
                elements.controlBtn.textContent = '启动海投';
                elements.controlBtn.style.cursor = 'pointer';
                elements.controlBtn.style.opacity = '1';
                elements.controlBtn.style.background = newBgColor;
                elements.controlBtn.style.animation = 'pulse-ready 0.6s ease-out';

                // 绑定事件
                this._bindButtonEffects(elements.controlBtn, newBgColor);
            } else {
                // 聊天页面启用三个按钮
                const buttons = [elements.greetingsBtn, elements.resumeBtn, elements.aiBtn];
                const newBgColor = 'var(--primary-color)';

                buttons.forEach(btn => {
                    if (btn) {
                        btn.disabled = false;
                        btn.style.cursor = 'pointer';
                        btn.style.opacity = '1';
                        btn.style.background = newBgColor;
                        btn.style.animation = 'pulse-ready 0.6s ease-out';
                        this._bindButtonEffects(btn, newBgColor);
                    }
                });
            }

            // 添加动画样式
            if (!document.getElementById('button-ready-animation')) {
                const style = document.createElement('style');
                style.id = 'button-ready-animation';
                style.textContent = `
                @keyframes pulse-ready {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); box-shadow: -7px 7px 0 #383838, 0 0 20px rgba(111, 194, 255, 0.6); }
                    100% { transform: scale(1); }
                }
            `;
                document.head.appendChild(style);
            }
        },

        // 绑定按钮特效
        _bindButtonEffects(btn, bgColor) {
            btn.onmouseenter = () => {
                btn.style.background = '#2BA5FF';
                btn.style.transform = 'translate(7px, -7px)';
                btn.style.boxShadow = '-7px 7px 0 #383838';
            };

            btn.onmouseleave = () => {
                btn.style.background = bgColor;
                btn.style.transform = 'translate(0, 0)';
                btn.style.boxShadow = 'none';
            };

            btn.onmousedown = () => {
                btn.style.transform = 'translate(0, 0)';
                btn.style.boxShadow = 'none';
            };
        },

        // 图标按钮 - 复古描边风
        _createIconButton(icon, onClick, title) {
            const btn = document.createElement('button');
            btn.className = 'boss-icon-btn';
            btn.innerHTML = icon;
            btn.title = title;
            btn.style.cssText = `
            width: 32px;
            height: 32px;
            border-radius: 2px;
            border: 2px solid #383838;
            background: #FFFFFF;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            justify-content: center;
            align-items: center;
            color: #383838;
        `;

            btn.addEventListener('click', onClick);

            btn.addEventListener('mouseenter', () => {
                btn.style.background = '#F4EFEA';
                btn.style.transform = 'translate(3px, -3px)';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.background = '#FFFFFF';
                btn.style.transform = 'translate(0, 0)';
            });

            btn.addEventListener('mousedown', () => {
                btn.style.background = '#2BA5FF';
                btn.style.color = '#FFFFFF';
                btn.style.transform = 'translate(0, 0)';
            });

            btn.addEventListener('mouseup', () => {
                btn.style.background = '#F4EFEA';
                btn.style.color = '#383838';
            });

            return btn;
        },

        // 设置面板可拖动功能
        _makeDraggable(panel) {
            const header = panel.querySelector('.boss-header, .boss-chat-header');

            if (!header) return;

            header.style.cursor = 'move';

            let isDragging = false;
            let startX = 0, startY = 0;
            let initialX = panel.offsetLeft, initialY = panel.offsetTop;

            header.addEventListener('mousedown', (e) => {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                initialX = panel.offsetLeft;
                initialY = panel.offsetTop;
                panel.style.transition = 'none';
                panel.style.zIndex = '2147483647';
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;

                const dx = e.clientX - startX;
                const dy = e.clientY - startY;

                panel.style.left = `${initialX + dx}px`;
                panel.style.top = `${initialY + dy}px`;
                panel.style.right = 'auto';
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    panel.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                    panel.style.zIndex = '2147483646';
                }
            });
        },

        // 最小化图标 - 复古描边风
        createMiniIcon() {
            elements.miniIcon = document.createElement('div');
            elements.miniIcon.style.cssText = `
            width: 60px;
            height: 60px;
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: var(--primary-color);
            border: 2px solid #383838;
            border-radius: 50%;
            box-shadow: 0 10px 25px rgba(56, 56, 56, 0.2);
            cursor: pointer;
            display: none;
            justify-content: center;
            align-items: center;
            color: #383838;
            font-size: 28px;
            z-index: 2147483647;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        `;

            elements.miniIcon.textContent = '🚢';

            elements.miniIcon.addEventListener('mouseenter', () => {
                elements.miniIcon.style.background = '#2BA5FF';
                elements.miniIcon.style.transform = 'translate(5px, -5px) scale(1.1)';
                elements.miniIcon.style.boxShadow = '-5px 5px 0 #383838, 0 10px 25px rgba(56, 56, 56, 0.2)';
            });

            elements.miniIcon.addEventListener('mouseleave', () => {
                elements.miniIcon.style.background = 'var(--primary-color)';
                elements.miniIcon.style.transform = 'scale(1)';
                elements.miniIcon.style.boxShadow = '0 10px 25px rgba(56, 56, 56, 0.2)';
            });

            elements.miniIcon.addEventListener('click', () => {
                state.isMinimized = false;
                elements.panel.style.transform = 'translateY(0)';
                elements.miniIcon.style.display = 'none';
            });

            document.body.appendChild(elements.miniIcon);
        },

        // 十六进制颜色转RGB
        _hexToRgb(hex) {
            hex = hex.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return `${r}, ${g}, ${b}`;
        }
    };

    // 导出到全局
    window.UI = UI$1;

    const Core$1 = {
        basicInterval: parseInt(localStorage.getItem('basicInterval')) || CONFIG.BASIC_INTERVAL,
        operationInterval: parseInt(localStorage.getItem('operationInterval')) || CONFIG.OPERATION_INTERVAL,
        messageObserver: null,
        lastProcessedMessage: null,
        processingMessage: false,

        async startProcessing() {
            // 如果是在岗位列表页面，先自动滚动加载所有岗位
            if (location.pathname.includes('/jobs')) await this.autoScrollJobList();

            while (state.isRunning) {
                // 如果是在岗位列表页面，一个一个点击岗位列表中的岗位卡片
                if (location.pathname.includes('/jobs')) await this.processJobList();
                // 如果是在聊天页面，处理最顶部的聊天
                else if (location.pathname.includes('/chat')) await this.handleChatPage();
                await this.delay(this.basicInterval);
            }
        },

        async autoScrollJobList() {
            // 自动滚动加载所有岗位卡片，直到页面底部
            return new Promise((resolve) => {
                const cardSelector = 'li.job-card-box';
                const maxHistory = 3;
                const waitTime = this.basicInterval;
                let cardCountHistory = [];
                let isStopped = false;

                const scrollStep = async () => {
                    if (isStopped) return;

                    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
                    await this.delay(waitTime);

                    const cards = document.querySelectorAll(cardSelector);
                    const currentCount = cards.length;
                    cardCountHistory.push(currentCount);

                    if (cardCountHistory.length > maxHistory) cardCountHistory.shift();

                    if (cardCountHistory.length === maxHistory && new Set(cardCountHistory).size === 1) {
                        this.log("当前页面岗位加载完成，开始沟通");
                        resolve(cards);
                        return;
                    }

                    scrollStep();
                };

                scrollStep();

                this.stopAutoScroll = () => {
                    isStopped = true;
                    resolve(null);
                };
            });
        },

        async processJobList() {
            // 点击岗位列表中的岗位卡片, operationInterval控制点击卡片的时间间隔
            const excludeHeadhunters = JSON.parse(localStorage.getItem('excludeHeadhunters') || 'false');
            const activeStatusFilter = JSON.parse(localStorage.getItem('recruiterActivityStatus') || '["不限"]');

            // 使用新的包含关键词筛选逻辑
            state.jobList = Array.from(document.querySelectorAll('li.job-card-box')).filter(card => {
                const title = card.querySelector('.job-name')?.textContent?.toLowerCase() || '';
                // 优先从卡片内取地址，兜底从常见位置类名取
                const addressText = (
                    card.querySelector('.job-address-desc')?.textContent ||
                    card.querySelector('.company-location')?.textContent ||
                    card.querySelector('.job-area')?.textContent ||
                    ''
                ).toLowerCase().trim();
                const headhuntingElement = card.querySelector('.job-tag-icon');
                const altText = headhuntingElement ? headhuntingElement.alt : '';

                // 职位名包含（空数组表示不限制）
                const includeMatch = state.includeKeywords.length === 0 ||
                    state.includeKeywords.some(kw => kw && title.includes(kw.trim()));

                // 工作地包含（空数组表示不限制）
                const locationMatch = state.locationKeywords.length === 0 ||
                    state.locationKeywords.some(kw => kw && addressText.includes(kw.trim()));

                const excludeHeadhunterMatch = !excludeHeadhunters || !altText.includes("猎头");

                return includeMatch && locationMatch && excludeHeadhunterMatch;
            });

            if (!state.jobList.length) {
                this.log('没有符合条件的职位');
                toggleProcess();
                return;
            }

            if (state.currentIndex >= state.jobList.length) {
                this.resetCycle();
                return;
            }

            const currentCard = state.jobList[state.currentIndex];
            currentCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            currentCard.click();

            await this.delay(this.operationInterval * 2);

            let activeTime = '未知';
            const onlineTag = document.querySelector('.boss-online-tag');
            if (onlineTag && onlineTag.textContent.trim() === '在线') {
                activeTime = '在线';
            } else {
                const activeTimeElement = document.querySelector('.boss-active-time');
                activeTime = activeTimeElement?.textContent?.trim() || '未知';
            }

            const isActiveStatusMatch = activeStatusFilter.includes('不限') || activeStatusFilter.includes(activeTime);

            if (!isActiveStatusMatch) {
                this.log(`跳过: 招聘者状态 "${activeTime}"`);
                state.currentIndex++;
                return;
            }

            const includeLog = state.includeKeywords.length ? `职位名包含[${state.includeKeywords.join('、')}]` : '职位名不限';
            const locationLog = state.locationKeywords.length ? `工作地包含[${state.locationKeywords.join('、')}]` : '工作地不限';
            this.log(`正在沟通：${++state.currentIndex}/${state.jobList.length}，${includeLog}，${locationLog}，招聘者"${activeTime}"`);

            const chatBtn = document.querySelector('a.op-btn-chat');
            if (chatBtn) {
                const btnText = chatBtn.textContent.trim();
                if (btnText === '立即沟通') {
                    chatBtn.click();
                    await this.handleGreetingModal();
                }
            }
        },

        async handleGreetingModal() {
            await this.delay(this.operationInterval * 4);

            const btn = [...document.querySelectorAll('.default-btn.cancel-btn')]
                .find(b => b.textContent.trim() === '留在此页');

            if (btn) {
                btn.click();
                await this.delay(this.operationInterval * 2);
            }
        },

        async handleChatPage() {
            this.resetMessageState();

            if (this.messageObserver) {
                this.messageObserver.disconnect();
                this.messageObserver = null;
            }

            const latestChatLi = await this.waitForElement(this.getLatestChatLi);
            if (!latestChatLi) return;

            const nameEl = latestChatLi.querySelector('.name-text');
            const companyEl = latestChatLi.querySelector('.name-box span:nth-child(2)');
            const name = (nameEl?.textContent || '未知').trim();
            const company = (companyEl?.textContent || '').trim();
            const hrKey = `${name}-${company}`.toLowerCase();

            if (!latestChatLi.classList.contains('last-clicked')) {
                await this.simulateClick(latestChatLi.querySelector('.figure'));
                latestChatLi.classList.add('last-clicked');
                state.hrInteractions.currentTopHRKey = hrKey;

                await this.delay(this.operationInterval);
                await HRInteractionManager.handleHRInteraction(hrKey);
            }

            await this.setupMessageObserver(hrKey);
        },

        resetMessageState() {
            this.lastProcessedMessage = null;
            this.processingMessage = false;
        },

        async setupMessageObserver(hrKey) {
            const chatContainer = await this.waitForElement('.chat-message .im-list');
            if (!chatContainer) return;

            this.messageObserver = new MutationObserver(async (mutations) => {
                let hasNewFriendMessage = false;
                for (const mutation of mutations) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        hasNewFriendMessage = Array.from(mutation.addedNodes).some(node =>
                            node.classList?.contains('item-friend')
                        );
                        if (hasNewFriendMessage) break;
                    }
                }

                if (hasNewFriendMessage) {
                    await this.handleNewMessage(hrKey);
                }
            });

            this.messageObserver.observe(chatContainer, { childList: true, subtree: true });
        },

        async handleNewMessage(hrKey) {
            if (!state.isRunning) return;

            // 如果处于特定模式且不是AI回复模式，不处理新消息
            if (state.chatMode && state.chatMode !== 'AI_REPLY') return;

            if (this.processingMessage) return;

            this.processingMessage = true;

            try {
                await this.delay(this.operationInterval);

                const lastMessage = await this.getLastFriendMessageText();
                if (!lastMessage) return;

                const cleanedMessage = this.cleanMessage(lastMessage);
                const shouldSendResumeOnly = cleanedMessage.includes('简历');

                if (cleanedMessage === this.lastProcessedMessage) return;

                this.lastProcessedMessage = cleanedMessage;
                this.log(`对方: ${lastMessage}`);

                await this.delay(200);
                const updatedMessage = await this.getLastFriendMessageText();
                if (updatedMessage && this.cleanMessage(updatedMessage) !== cleanedMessage) {
                    await this.handleNewMessage(hrKey);
                    return;
                }

                const autoSendResume = JSON.parse(localStorage.getItem('useAutoSendResume') || 'true');
                const autoReplyEnabled = JSON.parse(localStorage.getItem('autoReply') || 'true');

                if (shouldSendResumeOnly && autoSendResume) {
                    this.log('对方提到"简历"，正在发送简历');
                    const sent = await HRInteractionManager.sendResume();
                    if (sent) {
                        state.hrInteractions.sentResumeHRs.add(hrKey);
                        StatePersistence.saveState();
                        this.log(`已向 ${hrKey} 发送简历`);
                    }
                } else if (autoReplyEnabled) {
                    await HRInteractionManager.handleHRInteraction(hrKey);
                }

                await this.delay(200);
                const postReplyMessage = await this.getLastFriendMessageText();
            } catch (error) {
                this.log(`处理消息出错: ${error.message}`);
            } finally {
                this.processingMessage = false;
            }
        },

        cleanMessage(message) {
            if (!message) return '';

            let clean = message.replace(/<[^>]*>/g, '');
            clean = clean.trim().replace(/\s+/g, ' ').replace(/[\u200B-\u200D\uFEFF]/g, '');
            return clean;
        },

        getLatestChatLi() {
            return document.querySelector('li[role="listitem"][class]:has(.friend-content-warp)');
        },

        async aiReply() {
            if (!state.isRunning) return;
            try {
                const autoReplyEnabled = JSON.parse(localStorage.getItem('autoReply') || 'true');
                if (!autoReplyEnabled) {
                    return false;
                }

                if (!state.ai.useAiReply) {
                    return false;
                }

                const lastMessage = await this.getLastFriendMessageText();
                if (!lastMessage) return false;

                const today = new Date().toISOString().split('T')[0];
                if (state.ai.lastAiDate !== today) {
                    state.ai.replyCount = 0;
                    state.ai.lastAiDate = today;
                    StatePersistence.saveState();
                }

                const maxReplies = state.user.isPremiumUser ? CONFIG.AI.MAX_REPLIES_PREMIUM : CONFIG.AI.MAX_REPLIES_FREE;
                if (state.ai.replyCount >= maxReplies) {
                    this.log(`AI回复已达上限，充值即可继续使用`);
                    return false;
                }

                const aiReplyText = await this.requestAi(lastMessage);
                if (!aiReplyText) return false;

                this.log(`AI回复: ${aiReplyText.slice(0, 30)}...`);
                state.ai.replyCount++;
                StatePersistence.saveState();

                const inputBox = await this.waitForElement('#chat-input');
                if (!inputBox) return false;

                inputBox.textContent = '';
                inputBox.focus();
                document.execCommand('insertText', false, aiReplyText);
                await this.delay(this.operationInterval / 10);

                const sendButton = document.querySelector('.btn-send');
                if (sendButton) {
                    await this.simulateClick(sendButton);
                } else {
                    const enterKeyEvent = new KeyboardEvent('keydown', {
                        key: 'Enter', keyCode: 13, code: 'Enter', which: 13, bubbles: true
                    });
                    inputBox.dispatchEvent(enterKeyEvent);
                }

                return true;
            } catch (error) {
                this.log(`AI回复出错: ${error.message}`);
                return false;
            }
        },

        async requestAi(message) {
            const authToken = (function () {
                const c = [0x73, 0x64, 0x56, 0x45, 0x44, 0x41, 0x42, 0x6a, 0x5a, 0x65, 0x49, 0x6b, 0x77,
                    0x58, 0x4e, 0x42, 0x46, 0x4e, 0x42, 0x73, 0x3a, 0x43, 0x71, 0x4d, 0x58, 0x6a,
                    0x71, 0x65, 0x50, 0x56, 0x43, 0x4a, 0x62, 0x55, 0x59, 0x4a, 0x50, 0x63, 0x69, 0x70, 0x4a
                ];
                return c.map(d => String.fromCharCode(d)).join('');
            })();

            const apiUrl = (function () {
                const e = '68747470733a2f2f737061726b2d6170692d6f70656e2e78662d79756e2e636f6d2f76312f636861742f636f6d706c6574696f6e73';
                return e.replace(/../g, f => String.fromCharCode(parseInt(f, 16)));
            })();

            const requestBody = {
                model: 'lite',
                messages: [
                    { role: 'system', content: localStorage.getItem('aiRole') || '你是有经验的求职者，你会用口语化的表达（如“行”、“呃”）和语气词（如“啊”、“吗”）使对话自然。你回复对方很肯定且言简意赅，不会发送段落和长句子。' },
                    { role: 'user', content: message }
                ],
                temperature: 0.9, top_p: 0.8, max_tokens: 512
            };

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST', url: apiUrl,
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
                    data: JSON.stringify(requestBody),
                    onload: (response) => {
                        try {
                            const result = JSON.parse(response.responseText);
                            if (result.code !== 0) throw new Error('API错误: ' + result.message + '（Code: ' + result.code + '）');
                            resolve(result.choices[0].message.content.trim());
                        } catch (error) {
                            reject(new Error('响应解析失败: ' + error.message + '\n原始响应: ' + response.responseText));
                        }
                    },
                    onerror: (error) => reject(new Error('网络请求失败: ' + error))
                });
            });
        },

        async getLastFriendMessageText() {
            try {
                const chatContainer = document.querySelector('.chat-message .im-list');
                if (!chatContainer) return null;

                const friendMessages = Array.from(chatContainer.querySelectorAll('li.message-item.item-friend'));
                if (friendMessages.length === 0) return null;

                const lastMessageEl = friendMessages[friendMessages.length - 1];
                const textEl = lastMessageEl.querySelector('.text span');
                return textEl?.textContent?.trim() || null;
            } catch (error) {
                this.log(`获取消息出错: ${error.message}`);
                return null;
            }
        },

        async simulateClick(element) {
            if (!element) return;

            const rect = element.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            const dispatchMouseEvent = (type, options = {}) => {
                const event = new MouseEvent(type, {
                    bubbles: true, cancelable: true, view: document.defaultView, clientX: x, clientY: y, ...options
                });
                element.dispatchEvent(event);
            };

            dispatchMouseEvent('mouseover'); await this.delay(30);
            dispatchMouseEvent('mousemove'); await this.delay(30);
            dispatchMouseEvent('mousedown', { button: 0 }); await this.delay(30);
            dispatchMouseEvent('mouseup', { button: 0 }); await this.delay(30);
            dispatchMouseEvent('click', { button: 0 });
        },

        async waitForElement(selectorOrFunction, timeout = 5000) {
            return new Promise((resolve) => {
                let element;
                if (typeof selectorOrFunction === 'function') element = selectorOrFunction();
                else element = document.querySelector(selectorOrFunction);

                if (element) return resolve(element);

                const timeoutId = setTimeout(() => { observer.disconnect(); resolve(null); }, timeout);
                const observer = new MutationObserver(() => {
                    if (typeof selectorOrFunction === 'function') element = selectorOrFunction();
                    else element = document.querySelector(selectorOrFunction);
                    if (element) { clearTimeout(timeoutId); observer.disconnect(); resolve(element); }
                });
                observer.observe(document.body, { childList: true, subtree: true });
            });
        },

        async delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); },

        resetCycle() {
            toggleProcess();
            this.log('所有岗位沟通完成，恭喜您即将找到理想工作！');
            state.currentIndex = 0;
            state.operation.lastMessageTime = 0;
        },

        log(message) {
            const logEntry = `[${new Date().toLocaleTimeString()}] ${message}`;
            const logPanel = document.querySelector('#pro-log');
            if (logPanel) {
                const logItem = document.createElement('div');
                logItem.className = 'log-item';
                logItem.textContent = logEntry;
                logPanel.appendChild(logItem);
                logPanel.scrollTop = logPanel.scrollHeight;
            }
        }
    };


    window.Core = Core$1;

    const letter$1 = {
        showLetterToUser: function () {
            const COLORS = {
                ink: '#383838',
                cream: '#F4EFEA',
                paper: '#FFFFFF',
                accent: '#6FC2FF',
                accentDark: '#2BA5FF',
                neutral: '#A1A1A1'
            };

            const overlay = document.createElement('div');
            overlay.id = 'letter-overlay';
            overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(244, 239, 234, 0.95);
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 24px;
            z-index: 2147483646;
            border: 2px solid ${COLORS.ink};
            animation: md-overlay-in 0.3s ease forwards;
        `;

            const card = document.createElement('div');
            card.id = 'motherduck-letter-card';
            card.style.cssText = `
            width: clamp(320px, 90vw, 640px);
            background: ${COLORS.cream};
            border: 2px solid ${COLORS.ink};
            border-radius: 2px;
            box-shadow: -18px 18px 0 ${COLORS.ink}, 0 25px 45px rgba(56, 56, 56, 0.25);
            padding: 32px;
            position: relative;
            font-family: 'Inter', sans-serif;
            animation: md-letter-enter 0.4s ease forwards;
        `;

            const ribbon = document.createElement('div');
            ribbon.style.cssText = `
            position: absolute;
            top: -24px;
            left: 32px;
            background: ${COLORS.accent};
            color: ${COLORS.ink};
            border: 2px solid ${COLORS.ink};
            padding: 6px 18px;
            font-family: 'Monaco', 'Consolas', monospace;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            box-shadow: -6px 6px 0 ${COLORS.ink};
        `;
            ribbon.textContent = 'FIELD NOTE';

            const header = document.createElement('div');
            header.style.cssText = `
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 20px;
        `;

            const icon = document.createElement('div');
            icon.textContent = '🚢';
            icon.style.cssText = `
            width: 64px;
            height: 64px;
            border: 2px solid ${COLORS.ink};
            background: ${COLORS.paper};
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
        `;

            const headerText = document.createElement('div');
            const title = document.createElement('h2');
            title.textContent = '致海投助手用户';
            title.style.cssText = `
            margin: 0;
            font-size: 20px;
            font-family: 'Monaco', 'Consolas', monospace;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: ${COLORS.ink};
        `;

            const subtitle = document.createElement('p');
            subtitle.textContent = 'JobPilot 求职行动手册 · 2025';
            subtitle.style.cssText = `
            margin: 6px 0 0;
            color: ${COLORS.neutral};
            font-size: 13px;
            letter-spacing: 0.05em;
        `;

            headerText.appendChild(title);
            headerText.appendChild(subtitle);
            header.append(icon, headerText);

            const content = document.createElement('div');
            content.style.cssText = `
            font-size: 15px;
            line-height: 1.7;
            color: ${COLORS.ink};
        `;
            content.innerHTML = `
            <p>你好，未来的成功人士：</p>
            <p>我是 fancyboi999——曾在求职路上狂刷 BOSS，却换来无尽的“稍后联系”。于是我把所有痛点写进代码，让海投这件事带点幽默感和效率。</p>
            <p>这封信交到你手上，说明你已经准备升级求职姿势。记得以下 3 条作战准则：</p>
            <ul style="margin: 12px 0 18px 20px; padding: 0;">
                <li style="margin-bottom: 8px;"><strong>自动扫描 + 打招呼</strong>：像卷轴一样收集岗位，再精准出击。</li>
                <li style="margin-bottom: 8px;"><strong>AI 智能回话</strong>：24 小时保持在线，HR 不再被晾着。</li>
                <li><strong>个性化策略</strong>：人设、话术全定制，形成属于你的专属态度。</li>
            </ul>
            <p>工具是助推器，你的诚意才是终极武器。愿你被更多好岗位看见，搞定 Offer，顺便来 Repo 点颗 🌟。</p>
            <p style="text-align:right; font-family: 'Monaco', 'Consolas', monospace;">—— fancyboi999</p>
        `;

            const actions = document.createElement('div');
            actions.style.cssText = `
            margin-top: 24px;
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        `;

            const applyButtonMotion = (button, accent = false) => {
                const baseBg = accent ? COLORS.accent : COLORS.paper;
                const hoverBg = accent ? COLORS.accentDark : COLORS.cream;
                button.style.background = baseBg;
                button.style.border = `2px solid ${COLORS.ink}`;
                button.style.color = COLORS.ink;
                button.style.fontFamily = `'Monaco', 'Consolas', monospace`;
                button.style.textTransform = 'uppercase';
                button.style.letterSpacing = '0.08em';
                button.style.padding = '12px 24px';
                button.style.cursor = 'pointer';
                button.style.boxShadow = `-6px 6px 0 ${COLORS.ink}`;
                button.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease';

                button.addEventListener('mouseenter', () => {
                    button.style.background = hoverBg;
                    button.style.transform = 'translate(4px, -4px)';
                    button.style.boxShadow = `-4px 4px 0 ${COLORS.ink}`;
                });

                button.addEventListener('mouseleave', () => {
                    button.style.background = baseBg;
                    button.style.transform = 'translate(0, 0)';
                    button.style.boxShadow = `-6px 6px 0 ${COLORS.ink}`;
                });

                button.addEventListener('mousedown', () => {
                    button.style.transform = 'translate(0, 0)';
                    button.style.boxShadow = 'none';
                });

                button.addEventListener('mouseup', () => {
                    button.style.transform = 'translate(4px, -4px)';
                    button.style.boxShadow = `-4px 4px 0 ${COLORS.ink}`;
                });
            };

            const closeLetter = (callback) => {
                card.style.animation = 'md-letter-exit 0.35s ease forwards';
                overlay.style.animation = 'md-overlay-out 0.3s ease forwards';
                setTimeout(() => {
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                    if (typeof callback === 'function') {
                        callback();
                    }
                }, 280);
            };

            const startButton = document.createElement('button');
            startButton.textContent = '立即出发';
            applyButtonMotion(startButton, true);
            startButton.addEventListener('click', () => {
                closeLetter(() => {
                    window.open('https://github.com/fancyboi999', '_blank');
                });
            });

            const laterButton = document.createElement('button');
            laterButton.textContent = '稍后阅读';
            applyButtonMotion(laterButton, false);
            laterButton.addEventListener('click', () => closeLetter());

            actions.append(startButton, laterButton);

            card.append(ribbon, header, content, actions);
            overlay.appendChild(card);
            document.body.appendChild(overlay);

            const style = document.createElement('style');
            style.textContent = `
            @keyframes md-letter-enter {
                from { transform: translateY(30px) scale(0.95); opacity: 0; }
                to { transform: translateY(0) scale(1); opacity: 1; }
            }

            @keyframes md-letter-exit {
                from { transform: translateY(0) scale(1); opacity: 1; }
                to { transform: translateY(-20px) scale(0.97); opacity: 0; }
            }

            @keyframes md-overlay-in {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes md-overlay-out {
                from { opacity: 1; }
                to { opacity: 0; }
            }

            @media (max-width: 520px) {
                #motherduck-letter-card { padding: 24px; }
                #motherduck-letter-card h2 { font-size: 18px; }
            }
        `;
            document.head.appendChild(style);
        }
    };

    // 导出到全局
    window.letter = letter$1;

    const GUIDE_THEME = {
        ink: '#383838',
        cream: '#F4EFEA',
        paper: '#FFFFFF',
        accent: '#6FC2FF',
        accentDark: '#2BA5FF',
        warning: '#FF7169'
    };

    const guide$1 = {
        steps: [
            {
                target: 'div.city-label.active',
                content: '👋 海投前，先在BOSS<span class="highlight">筛选出岗位</span>！\n\n助手会先滚动收集界面上显示的岗位，\n随后依次进行沟通~',
                highlightColor: '#4285f4', // 主蓝色
                arrowPosition: 'bottom',
                defaultPosition: { left: '50%', top: '20%', transform: 'translateX(-50%)' }
            },
            {
                target: 'a[ka="header-jobs"]',
                content: '🚀 <span class="highlight">职位页操作流程</span>：\n\n1️⃣ 扫描职位卡片\n2️⃣ 点击"立即沟通"（需开启“自动打招呼”）\n3️⃣ 留在当前页，继续沟通下一个职位\n\n全程无需手动干预，高效投递！',
                highlightColor: '#3367d6', // 主蓝加深10%
                arrowPosition: 'bottom',
                defaultPosition: { left: '25%', top: '80px' }
            },
            {
                target: 'a[ka="header-message"]',
                content: '💬 <span class="highlight">海投建议</span>！\n\n✅ HR与您沟通，HR需要付费给平台\n因此您尽可能先自我介绍以提高效率 \n\n✅ HR查看附件简历，HR也要付费给平台\n所以尽量先发送`图片简历`给HR',
                highlightColor: '#2a56c6', // 主蓝加深15%
                arrowPosition: 'left',
                defaultPosition: { right: '150px', top: '100px' }
            },
            {
                target: 'div.logo',
                content: '🤖 <span class="highlight">您需要打开两个浏览器窗口</span>：\n\n左侧窗口自动打招呼发起沟通\n右侧发送自我介绍和图片简历\n\n您只需专注于挑选offer！',
                highlightColor: '#1a73e8', // 主蓝加深20%
                arrowPosition: 'right',
                defaultPosition: { left: '200px', top: '20px' }
            },
            {
                target: 'div.logo',
                content: '❗ <span class="highlight">特别注意</span>：\n\n1. <span class="warning">BOSS直聘每日打招呼上限为150次</span>\n2. 聊天页仅处理最上方的最新对话\n3. 打招呼后对方会显示在聊天页\n4. <span class="warning">投递操作过于频繁有封号风险!</span>',
                highlightColor: '#0d47a1', // 主蓝加深30%
                arrowPosition: 'bottom',
                defaultPosition: { left: '50px', top: '80px' }
            }
        ],
        currentStep: 0,
        guideElement: null,
        overlay: null,
        highlightElements: [],
        chatUrl: 'https://www.zhipin.com/web/geek/chat', // 聊天页面URL

        showGuideToUser() {
            // 创建遮罩层
            this.overlay = document.createElement('div');
            this.overlay.id = 'guide-overlay';
            this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(244, 239, 234, 0.9);
            backdrop-filter: blur(3px);
            mix-blend-mode: multiply;
            z-index: 99997;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
            document.body.appendChild(this.overlay);

            // 创建引导卡片
            this.guideElement = document.createElement('div');
            this.guideElement.id = 'guide-tooltip';
            this.guideElement.style.cssText = `
            position: fixed;
            z-index: 99999;
            width: 340px;
            background: ${GUIDE_THEME.cream};
            border-radius: 2px;
            border: 2px solid ${GUIDE_THEME.ink};
            box-shadow: -12px 12px 0 ${GUIDE_THEME.ink}, 0 18px 35px rgba(56, 56, 56, 0.25);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            overflow: hidden;
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.3s ease, transform 0.3s ease;
        `;
            document.body.appendChild(this.guideElement);

            // 显示遮罩层
            setTimeout(() => {
                this.overlay.style.opacity = '1';

                // 延迟显示第一步，增强视觉层次感
                setTimeout(() => {
                    this.showStep(0);
                }, 300);
            }, 100);
        },

        showStep(stepIndex) {
            const step = this.steps[stepIndex];
            if (!step) return;

            this.clearHighlights();
            const target = document.querySelector(step.target);
            const accentColor = step.highlightColor || GUIDE_THEME.accent;

            if (target) {
                // 创建高亮区域
                const rect = target.getBoundingClientRect();
                const highlight = document.createElement('div');
                highlight.className = 'guide-highlight';
                highlight.style.cssText = `
                position: fixed;
                top: ${rect.top}px;
                left: ${rect.left}px;
                width: ${rect.width}px;
                height: ${rect.height}px;
                background: rgba(244, 239, 234, 0.25);
                border-radius: 2px;
                z-index: 99998;
                border: 2px dashed ${GUIDE_THEME.ink};
                box-shadow: -6px 6px 0 ${GUIDE_THEME.ink}, 0 0 0 6px ${accentColor}33;
                animation: guide-outline 1.8s infinite;
            `;
                document.body.appendChild(highlight);
                this.highlightElements.push(highlight);

                // 计算提示框位置（基于目标元素）
                this.setGuidePositionFromTarget(step, rect);
            } else {
                console.warn('引导目标元素未找到，使用默认位置:', step.target);
                // 使用默认位置显示提示框
                this.setGuidePositionFromDefault(step);
            }

            // 设置引导提示框内容
            let buttonsHtml = '';
            const buttonBaseStyle = `
            padding: 12px 22px;
            border: 2px solid ${GUIDE_THEME.ink};
            font-size: 13px;
            font-family: 'Monaco', 'Consolas', monospace;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            cursor: pointer;
            box-shadow: -4px 4px 0 ${GUIDE_THEME.ink};
            transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        `;

            // 根据是否为最后一步生成不同的按钮
            if (stepIndex === this.steps.length - 1) {
                buttonsHtml = `
                <div class="guide-buttons" style="display: flex; justify-content: center; padding: 18px 20px; border-top: 2px solid ${GUIDE_THEME.ink}; background: ${GUIDE_THEME.paper};">
                    <button id="guide-finish-btn" style="${buttonBaseStyle} background: ${accentColor}; color: ${GUIDE_THEME.ink};">
                        完成
                    </button>
                </div>
            `;
            } else {
                buttonsHtml = `
                <div class="guide-buttons" style="display: flex; justify-content: flex-end; padding: 18px 20px; border-top: 2px solid ${GUIDE_THEME.ink}; background: ${GUIDE_THEME.paper}; gap: 12px;">
                    <button id="guide-skip-btn" style="${buttonBaseStyle} background: ${GUIDE_THEME.paper}; color: ${GUIDE_THEME.ink};">
                        跳过
                    </button>
                    <button id="guide-next-btn" style="${buttonBaseStyle} background: ${accentColor}; color: ${GUIDE_THEME.ink};">
                        下一步
                    </button>
                </div>
            `;
            }

            this.guideElement.innerHTML = `
            <div style="height: 8px; background: ${accentColor}; border-bottom: 2px solid ${GUIDE_THEME.ink};"></div>
            <div class="guide-header" style="padding: 18px 20px; background: ${GUIDE_THEME.paper}; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid ${GUIDE_THEME.ink};">
                <div class="guide-title" style="font-size: 14px; font-family: 'Monaco', 'Consolas', monospace; letter-spacing: 0.08em; text-transform: uppercase; color: ${GUIDE_THEME.ink};">JobPilot 海投指北</div>
                <div class="guide-step" style="font-size: 12px; letter-spacing: 0.08em; color: ${GUIDE_THEME.ink};">步骤 ${stepIndex + 1}/${this.steps.length}</div>
            </div>
            <div class="guide-content" style="padding: 20px; font-size: 14px; line-height: 1.6; color: ${GUIDE_THEME.ink}; background: ${GUIDE_THEME.cream}; border-bottom: 2px solid ${GUIDE_THEME.ink};">
                <div style="white-space: pre-wrap; font-family: 'Inter', sans-serif; margin: 0;">${step.content}</div>
            </div>
            ${buttonsHtml}
        `;

            // 重新绑定按钮事件
            if (stepIndex === this.steps.length - 1) {
                const finishBtn = document.getElementById('guide-finish-btn');
                finishBtn.addEventListener('click', () => this.endGuide(true));
                this.bindGuideButtonHover(finishBtn, {
                    defaultBg: accentColor,
                    hoverBg: this.darkenColor(accentColor, 10)
                });
            } else {
                const nextBtn = document.getElementById('guide-next-btn');
                const skipBtn = document.getElementById('guide-skip-btn');
                nextBtn.addEventListener('click', () => this.nextStep());
                skipBtn.addEventListener('click', () => this.endGuide());

                this.bindGuideButtonHover(nextBtn, {
                    defaultBg: accentColor,
                    hoverBg: this.darkenColor(accentColor, 10)
                });
                this.bindGuideButtonHover(skipBtn, {
                    defaultBg: GUIDE_THEME.paper,
                    hoverBg: GUIDE_THEME.cream
                });
            }

            // 显示提示框
            this.guideElement.style.opacity = '1';
            this.guideElement.style.transform = 'translateY(0)';
        },

        // 根据目标元素计算提示框位置
        setGuidePositionFromTarget(step, rect) {
            let left, top;
            const guideWidth = 320;
            const guideHeight = 240;

            // 根据箭头方向调整位置
            switch (step.arrowPosition) {
                case 'top':
                    left = rect.left + rect.width / 2 - guideWidth / 2;
                    top = rect.top - guideHeight - 20;
                    break;
                case 'bottom':
                    left = rect.left + rect.width / 2 - guideWidth / 2;
                    top = rect.bottom + 20;
                    break;
                case 'left':
                    left = rect.left - guideWidth - 20;
                    top = rect.top + rect.height / 2 - guideHeight / 2;
                    break;
                case 'right':
                    left = rect.right + 20;
                    top = rect.top + rect.height / 2 - guideHeight / 2;
                    break;
                default:
                    left = rect.right + 20;
                    top = rect.top;
            }

            // 确保提示框不超出屏幕
            left = Math.max(10, Math.min(left, window.innerWidth - guideWidth - 10));
            top = Math.max(10, Math.min(top, window.innerHeight - guideHeight - 10));

            // 设置位置
            this.guideElement.style.left = `${left}px`;
            this.guideElement.style.top = `${top}px`;
            this.guideElement.style.transform = 'translateY(0)';
        },

        // 使用默认位置显示提示框
        setGuidePositionFromDefault(step) {
            const position = step.defaultPosition || { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' };

            // 应用默认位置样式
            Object.assign(this.guideElement.style, {
                left: position.left,
                top: position.top,
                right: position.right || 'auto',
                bottom: position.bottom || 'auto',
                transform: position.transform || 'none'
            });
        },

        nextStep() {
            // 清除当前步骤的事件监听
            const currentStep = this.steps[this.currentStep];
            if (currentStep) {
                const target = document.querySelector(currentStep.target);
                if (target) {
                    target.removeEventListener('click', this.nextStep);
                }
            }

            this.currentStep++;
            if (this.currentStep < this.steps.length) {
                // 隐藏当前提示框，显示下一步
                this.guideElement.style.opacity = '0';
                this.guideElement.style.transform = 'translateY(10px)';

                setTimeout(() => {
                    this.showStep(this.currentStep);
                }, 300);
            } else {
                this.endGuide(true); // 传递true表示引导已完成
            }
        },

        clearHighlights() {
            this.highlightElements.forEach(el => el.remove());
            this.highlightElements = [];
        },

        endGuide(isCompleted = false) {
            // 清除高亮和事件
            this.clearHighlights();

            // 淡出提示框和遮罩
            this.guideElement.style.opacity = '0';
            this.guideElement.style.transform = 'translateY(10px)';
            this.overlay.style.opacity = '0';

            // 延迟移除元素
            setTimeout(() => {
                if (this.overlay && this.overlay.parentNode) {
                    this.overlay.parentNode.removeChild(this.overlay);
                }
                if (this.guideElement && this.guideElement.parentNode) {
                    this.guideElement.parentNode.removeChild(this.guideElement);
                }

                // 当引导完成时打开聊天页面
                if (isCompleted && this.chatUrl) {
                    window.open(this.chatUrl, '_blank');
                }
            }, 300);

            // 触发引导结束事件
            document.dispatchEvent(new Event('guideEnd'));
        },

        bindGuideButtonHover(button, { defaultBg, hoverBg } = {}) {
            if (!button) return;
            const baseBackground = defaultBg || button.style.background || GUIDE_THEME.paper;
            const hoverBackground = hoverBg || GUIDE_THEME.cream;
            button.style.background = baseBackground;
            button.style.boxShadow = `-4px 4px 0 ${GUIDE_THEME.ink}`;

            button.addEventListener('mouseenter', () => {
                button.style.background = hoverBackground;
                button.style.transform = 'translate(4px, -4px)';
                button.style.boxShadow = `-4px 4px 0 ${GUIDE_THEME.ink}`;
            });

            button.addEventListener('mouseleave', () => {
                button.style.background = baseBackground;
                button.style.transform = 'translate(0, 0)';
                button.style.boxShadow = `-4px 4px 0 ${GUIDE_THEME.ink}`;
            });

            button.addEventListener('mousedown', () => {
                button.style.transform = 'translate(0, 0)';
                button.style.boxShadow = 'none';
            });

            button.addEventListener('mouseup', () => {
                button.style.transform = 'translate(4px, -4px)';
                button.style.boxShadow = `-4px 4px 0 ${GUIDE_THEME.ink}`;
            });
        },

        // 辅助函数：颜色加深
        darkenColor(color, percent) {
            let R = parseInt(color.substring(1, 3), 16);
            let G = parseInt(color.substring(3, 5), 16);
            let B = parseInt(color.substring(5, 7), 16);

            R = parseInt(R * (100 - percent) / 100);
            G = parseInt(G * (100 - percent) / 100);
            B = parseInt(B * (100 - percent) / 100);

            R = (R < 255) ? R : 255;
            G = (G < 255) ? G : 255;
            B = (B < 255) ? B : 255;

            R = Math.round(R);
            G = Math.round(G);
            B = Math.round(B);

            const RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
            const GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
            const BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));

            return `#${RR}${GG}${BB}`;
        }
    };

    // 添加脉冲动画样式和高亮样式
    const style = document.createElement('style');
    style.textContent = `
    @keyframes guide-outline {
        0% { box-shadow: 0 0 0 0 rgba(111, 194, 255, 0.6); }
        100% { box-shadow: 0 0 0 12px rgba(111, 194, 255, 0); }
    }

    .guide-content .highlight {
        font-weight: 700;
        color: ${GUIDE_THEME.accentDark};
        font-family: 'Monaco', 'Consolas', monospace;
        text-transform: uppercase;
    }

    .guide-content .warning {
        font-weight: 700;
        color: ${GUIDE_THEME.warning};
    }
`;
    document.head.appendChild(style);

    // 导出到全局
    window.guide = guide$1;

    // 1. 更新settings对象
    const settings$1 = {
        useAutoSendResume: JSON.parse(localStorage.getItem('useAutoSendResume') || 'true'),
        excludeHeadhunters: JSON.parse(localStorage.getItem('excludeHeadhunters') || 'false'),
        autoScrollSpeed: parseInt(localStorage.getItem('autoScrollSpeed') || '500'),
        customPhrases: JSON.parse(localStorage.getItem('customPhrases') || '[]'),
        actionDelays: {
            click: parseInt(localStorage.getItem('clickDelay') || '130')
        },
        notifications: {
            enabled: JSON.parse(localStorage.getItem('notificationsEnabled') || 'true'),
            sound: JSON.parse(localStorage.getItem('notificationSound') || 'true')
        },
        ai: {
            role: localStorage.getItem('aiRole') || '你是大四应届生正冲刺秋招，目标是尽力得到可签三方的正式岗位，也接受优质实习机会。沟通中做到：1. 语气自然，回复简洁精炼，不堆砌文字；2. 主动呈现核心优势（可根据对方要求编造亮点，如专业技能、项目经验、实习经历等）；3. 若被询问联系方式，提供手机号 123456、微信号 BOSS；4. 全程表现对岗位的渴望，不冗余、不过度客气。'
        },
        autoReply: JSON.parse(localStorage.getItem('autoReply') || 'true'),
        autoApply: JSON.parse(localStorage.getItem('autoApply') || 'true'),
        intervals: {
            basic: parseInt(localStorage.getItem('basicInterval') || '1000'),
            operation: parseInt(localStorage.getItem('operationInterval') || '800')
        },
        recruiterActivityStatus: JSON.parse(localStorage.getItem('recruiterActivityStatus') || '["不限"]'),
        // 自动发送图片简历相关配置
        useAutoSendImageResume: JSON.parse(localStorage.getItem('useAutoSendImageResume') || 'false'),
        imageResumePath: localStorage.getItem('imageResumePath') || '',
        imageResumeData: localStorage.getItem('imageResumeData') || null
    };

    // 面板主题的一致色板
    const PANEL_THEME = {
        ink: '#383838',
        cream: '#F4EFEA',
        paper: '#FFFFFF',
        primary: '#6FC2FF',
        primaryHover: '#2BA5FF',
        secondary: '#53DBC9',
        neutral: '#A1A1A1'};

    // 2. saveSettings函数，保存配置
    function saveSettings() {
        localStorage.setItem('useAutoSendResume', settings$1.useAutoSendResume.toString());
        localStorage.setItem('excludeHeadhunters', settings$1.excludeHeadhunters.toString());
        localStorage.setItem('autoScrollSpeed', settings$1.autoScrollSpeed.toString());
        localStorage.setItem('customPhrases', JSON.stringify(settings$1.customPhrases));
        localStorage.setItem('clickDelay', settings$1.actionDelays.click.toString());
        localStorage.setItem('notificationsEnabled', settings$1.notifications.enabled.toString());
        localStorage.setItem('notificationSound', settings$1.notifications.sound.toString());
        localStorage.setItem('aiRole', settings$1.ai.role);
        localStorage.setItem('autoReply', settings$1.autoReply.toString());
        localStorage.setItem('autoApply', settings$1.autoApply.toString());
        localStorage.setItem('basicInterval', settings$1.intervals.basic.toString());
        localStorage.setItem('operationInterval', settings$1.intervals.operation.toString());
        localStorage.setItem('recruiterActivityStatus', JSON.stringify(settings$1.recruiterActivityStatus));
        // 保存图片简历配置
        localStorage.setItem('useAutoSendImageResume', settings$1.useAutoSendImageResume.toString());
        localStorage.setItem('imageResumePath', settings$1.imageResumePath);
        // 存储图片数据
        if (settings$1.imageResumeData) {
            localStorage.setItem('imageResumeData', settings$1.imageResumeData);
        } else {
            localStorage.removeItem('imageResumeData');
        }
    }

    // 4. createSettingsDialog函数添加新UI元素
    function createSettingsDialog() {
        const dialog = document.createElement('div');
        dialog.id = 'boss-settings-dialog';
        dialog.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -60%);
        width: clamp(340px, 92vw, 620px);
        height: min(85vh, 720px);
        background: ${PANEL_THEME.cream};
        border-radius: 2px;
        border: 2px solid ${PANEL_THEME.ink};
        box-shadow: -18px 18px 0 ${PANEL_THEME.ink}, 0 20px 45px rgba(56, 56, 56, 0.25);
        z-index: 2147483646;
        display: none;
        flex-direction: column;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        overflow: hidden;
        transition: transform 0.3s ease, opacity 0.3s ease;
        background-image: linear-gradient(120deg, rgba(255,255,255,0.9) 0%, rgba(244,239,234,0.95) 100%);
    `;

        dialog.innerHTML += `
        <style>
            #boss-settings-dialog {
                opacity: 0;
                transform: translate(-50%, -60%) scale(0.97);
            }
            #boss-settings-dialog.active {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
            .setting-item {
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            .setting-item:hover {
                transform: translate(3px, -3px);
                box-shadow: -4px 4px 0 ${PANEL_THEME.ink};
            }
            .multi-select-container {
                position: relative;
                width: 100%;
                margin-top: 10px;
            }
            .multi-select-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px;
                border-radius: 2px;
                border: 2px solid ${PANEL_THEME.ink};
                background: ${PANEL_THEME.paper};
                cursor: pointer;
                transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
            }
            .multi-select-header:hover {
                background: ${PANEL_THEME.cream};
                transform: translate(3px, -3px);
                box-shadow: -4px 4px 0 ${PANEL_THEME.ink};
            }
            .multi-select-options {
                position: absolute;
                top: calc(100% + 8px);
                left: 0;
                right: 0;
                max-height: 200px;
                overflow-y: auto;
                border-radius: 2px;
                border: 2px solid ${PANEL_THEME.ink};
                background: ${PANEL_THEME.paper};
                z-index: 100;
                box-shadow: -8px 8px 0 ${PANEL_THEME.ink}, 0 12px 25px rgba(56,56,56,0.2);
                display: none;
            }
            .multi-select-option {
                padding: 12px 14px;
                cursor: pointer;
                transition: background 0.2s ease;
                font-family: 'Inter', sans-serif;
                font-size: 14px;
                color: ${PANEL_THEME.ink};
            }
            .multi-select-option:hover {
                background-color: ${PANEL_THEME.cream};
            }
            .multi-select-option.selected {
                background-color: rgba(111, 194, 255, 0.25);
            }
            .multi-select-clear {
                color: ${PANEL_THEME.neutral};
                cursor: pointer;
                margin-left: 5px;
                font-size: 16px;
                line-height: 1;
            }
            .multi-select-clear:hover {
                color: ${PANEL_THEME.ink};
            }
        </style>
    `;

        const dialogHeader = createDialogHeader('海投助手·BOSS设置');

        const dialogContent = document.createElement('div');
        dialogContent.style.cssText = `
        padding: 20px 24px 24px;
        flex: 1;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: ${PANEL_THEME.primary} rgba(0, 0, 0, 0);
    `;

        dialogContent.innerHTML += `
    <style>
        #boss-settings-dialog ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        #boss-settings-dialog ::-webkit-scrollbar-track {
            background: transparent;
            margin: 10px 0;
        }
        #boss-settings-dialog ::-webkit-scrollbar-thumb {
            background: ${PANEL_THEME.primary};
            border-radius: 2px;
            border: 2px solid ${PANEL_THEME.ink};
            box-shadow: -2px 2px 0 ${PANEL_THEME.ink};
            transition: background 0.2s ease;
        }
        #boss-settings-dialog ::-webkit-scrollbar-thumb:hover {
            background: ${PANEL_THEME.primaryHover};
        }
    </style>
    `;

        const tabsContainer = document.createElement('div');
        tabsContainer.style.cssText = `
        display: flex;
        border-bottom: 2px solid ${PANEL_THEME.ink};
        margin-bottom: 16px;
        gap: 8px;
    `;

        const aiTab = document.createElement('button');
        aiTab.textContent = 'AI人设';
        aiTab.className = 'settings-tab active';
        aiTab.style.cssText = `
        padding: 10px 18px;
        background: ${PANEL_THEME.paper};
        color: ${PANEL_THEME.ink};
        border: 2px solid ${PANEL_THEME.ink};
        border-radius: 2px 2px 0 0;
        font-weight: 500;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        font-family: 'Monaco', 'Consolas', monospace;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    `;

        const advancedTab = document.createElement('button');
        advancedTab.textContent = '高级设置';
        advancedTab.className = 'settings-tab';
        advancedTab.style.cssText = `
        padding: 10px 18px;
        background: ${PANEL_THEME.paper};
        color: ${PANEL_THEME.ink};
        border: 2px solid ${PANEL_THEME.ink};
        border-radius: 2px 2px 0 0;
        font-weight: 500;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        font-family: 'Monaco', 'Consolas', monospace;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    `;

        const intervalTab = document.createElement('button');
        intervalTab.textContent = '间隔设置';
        intervalTab.className = 'settings-tab';
        intervalTab.style.cssText = `
        padding: 10px 18px;
        background: ${PANEL_THEME.paper};
        color: ${PANEL_THEME.ink};
        border: 2px solid ${PANEL_THEME.ink};
        border-radius: 2px 2px 0 0;
        font-weight: 500;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        font-family: 'Monaco', 'Consolas', monospace;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    `;

        tabsContainer.append(aiTab, advancedTab, intervalTab);

        const aiSettingsPanel = document.createElement('div');
        aiSettingsPanel.id = 'ai-settings-panel';

        const roleSettingResult = createSettingItem(
            'AI角色定位',
            '定义AI在对话中的角色和语气特点',
            () => document.getElementById('ai-role-input')
        );

        const roleSetting = roleSettingResult.settingItem;

        const roleInput = document.createElement('textarea');
        roleInput.id = 'ai-role-input';
        roleInput.rows = 5;
        roleInput.style.cssText = `
        width: 100%;
        padding: 12px 14px;
        border-radius: 2px;
        border: 2px solid ${PANEL_THEME.ink};
        background: ${PANEL_THEME.paper};
        color: ${PANEL_THEME.ink};
        resize: vertical;
        font-size: 14px;
        transition: box-shadow 0.2s ease, background 0.2s ease;
        margin-top: 12px;
    `;

        addFocusBlurEffects(roleInput);
        roleSetting.append(roleInput);

        const presetRoleSettingResult = createSettingItem(
            '预设角色',
            '选择预设的AI角色模板',
            () => document.getElementById('ai-preset-select')
        );

        const presetRoleSetting = presetRoleSettingResult.settingItem;

        const presetSelect = document.createElement('select');
        presetSelect.id = 'ai-preset-select';
        presetSelect.style.cssText = `
        width: 100%;
        padding: 12px 14px;
        border-radius: 2px;
        border: 2px solid ${PANEL_THEME.ink};
        font-size: 14px;
        background: ${PANEL_THEME.paper};
        color: ${PANEL_THEME.ink};
        margin-top: 12px;
        transition: box-shadow 0.2s ease, background 0.2s ease;
    `;

        const presets = [
            { value: 'default', text: '默认角色' }
        ];

        presets.forEach(preset => {
            const option = document.createElement('option');
            option.value = preset.value;
            option.textContent = preset.text;
            presetSelect.appendChild(option);
        });

        presetSelect.addEventListener('change', () => {
            if (presetSelect.value !== 'custom') {
                const presetValues = {
                    'default': '你是大四应届生正冲刺秋招，目标是尽力得到可签三方的正式岗位，也接受优质实习机会。沟通中做到：1. 语气自然，回复简洁精炼，不堆砌文字；2. 主动呈现核心优势（可根据对方要求编造亮点，如专业技能、项目经验、实习经历等）；3. 若被询问联系方式，提供手机号 123456、微信号 BOSS；4. 全程表现对岗位的渴望，不冗余、不过度客气。'
                };
                roleInput.value = presetValues[presetSelect.value];
            }
        });

        presetRoleSetting.append(presetSelect);
        aiSettingsPanel.append(roleSetting, presetRoleSetting);

        const advancedSettingsPanel = document.createElement('div');
        advancedSettingsPanel.id = 'advanced-settings-panel';
        advancedSettingsPanel.style.display = 'none';

        const autoReplySettingResult = createSettingItem(
            'Ai回复模式',
            '开启后Ai将自动回复消息',
            () => document.querySelector('#toggle-auto-reply-mode input')
        );

        const autoReplySetting = autoReplySettingResult.settingItem;
        const autoReplyDescriptionContainer = autoReplySettingResult.descriptionContainer;

        const autoReplyToggle = createToggleSwitch(
            'auto-reply-mode',
            settings$1.autoReply,
            (checked) => { settings$1.autoReply = checked; }
        );

        autoReplyDescriptionContainer.append(autoReplyToggle);

        const autoSendResumeSettingResult = createSettingItem(
            '自动发送简历',
            '开启后系统将自动发送简历给HR',
            () => document.querySelector('#toggle-auto-send-resume input')
        );

        const autoSendResumeSetting = autoSendResumeSettingResult.settingItem;
        const autoSendResumeDescriptionContainer = autoSendResumeSettingResult.descriptionContainer;

        const autoSendResumeToggle = createToggleSwitch(
            'auto-send-resume',
            settings$1.useAutoSendResume,
            (checked) => { settings$1.useAutoSendResume = checked; }
        );

        autoSendResumeDescriptionContainer.append(autoSendResumeToggle);

        const excludeHeadhuntersSettingResult = createSettingItem(
            '投递时排除猎头',
            '开启后将不会向猎头职位自动投递简历',
            () => document.querySelector('#toggle-exclude-headhunters input')
        );

        const excludeHeadhuntersSetting = excludeHeadhuntersSettingResult.settingItem;
        const excludeHeadhuntersDescriptionContainer = excludeHeadhuntersSettingResult.descriptionContainer;

        const excludeHeadhuntersToggle = createToggleSwitch(
            'exclude-headhunters',
            settings$1.excludeHeadhunters,
            (checked) => { settings$1.excludeHeadhunters = checked; }
        );

        excludeHeadhuntersDescriptionContainer.append(excludeHeadhuntersToggle);

        // 改进后的自动发送图片简历设置
        const imageResumeSettingResult = createSettingItem(
            '自动发送图片简历',
            '开启后将根据岗位智能选择发送图片简历给HR（最多添加3个）',
            () => document.querySelector('#toggle-auto-send-image-resume input')
        );

        const imageResumeSetting = imageResumeSettingResult.settingItem;
        const imageResumeDescriptionContainer = imageResumeSettingResult.descriptionContainer;

        // 确保全局state中的imageResumes数组已初始化
        if (!state.settings.imageResumes) {
            state.settings.imageResumes = [];
        }

        // 多图片简历上传容器
        const fileUploadsContainer = document.createElement('div');
        fileUploadsContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        margin-top: 10px;
    `;

        // 创建添加简历按钮
        const addResumeBtn = document.createElement('button');
        addResumeBtn.id = 'add-image-resume-btn';
        addResumeBtn.textContent = '添加图片简历（最多3个）';
        addResumeBtn.style.cssText = `
        padding: 12px 18px;
        border-radius: 2px;
        border: 2px solid ${PANEL_THEME.ink};
        background: ${PANEL_THEME.paper};
        color: ${PANEL_THEME.ink};
        cursor: pointer;
        font-size: 14px;
        font-family: 'Monaco', 'Consolas', monospace;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        align-self: flex-start;
    `;

        addResumeBtn.addEventListener('mouseenter', () => {
            addResumeBtn.style.background = PANEL_THEME.cream;
            addResumeBtn.style.transform = 'translate(4px, -4px)';
            addResumeBtn.style.boxShadow = `-4px 4px 0 ${PANEL_THEME.ink}`;
        });

        addResumeBtn.addEventListener('mouseleave', () => {
            addResumeBtn.style.background = PANEL_THEME.paper;
            addResumeBtn.style.transform = 'translate(0, 0)';
            addResumeBtn.style.boxShadow = 'none';
        });

        // 创建隐藏的文件输入
        const hiddenFileInput = document.createElement('input');
        hiddenFileInput.type = 'file';
        hiddenFileInput.accept = 'image/*';
        hiddenFileInput.style.display = 'none';

        // 显示已上传简历的容器
        const uploadedResumesContainer = document.createElement('div');
        uploadedResumesContainer.id = 'uploaded-resumes-container';
        uploadedResumesContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
    `;

        // 更新按钮状态
        function updateAddButtonState() {
            addResumeBtn.disabled = state.settings.imageResumes.length >= 3;
            addResumeBtn.style.opacity = state.settings.imageResumes.length >= 3 ? '0.5' : '1';
            addResumeBtn.style.cursor = state.settings.imageResumes.length >= 3 ? 'not-allowed' : 'pointer';
            addResumeBtn.textContent = state.settings.imageResumes.length >= 3 ? '已达最大限制（3个）' : '添加图片简历';
        }

        // 渲染简历项
        function renderResumeItem(index, resume) {
            const resumeItem = document.createElement('div');
            resumeItem.id = `resume-item-${index}`;
            resumeItem.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 12px;
            border-radius: 2px;
            border: 2px solid ${PANEL_THEME.ink};
            background: ${PANEL_THEME.paper};
            width: 100%;
            box-shadow: -4px 4px 0 ${PANEL_THEME.ink};
        `;

            const fileNameSpan = document.createElement('span');
            fileNameSpan.style.cssText = `
            flex: 1;
            color: ${PANEL_THEME.ink};
            font-size: 14px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        `;
            fileNameSpan.textContent = resume.path;

            const removeBtn = document.createElement('button');
            removeBtn.textContent = '删除';
            removeBtn.style.cssText = `
            padding: 6px 14px;
            border-radius: 2px;
            border: 2px solid #ff7169;
            background: rgba(255, 113, 105, 0.15);
            color: #A11D12;
            cursor: pointer;
            font-size: 12px;
            font-family: 'Monaco', 'Consolas', monospace;
            text-transform: uppercase;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        `;

            removeBtn.addEventListener('mouseenter', () => {
                removeBtn.style.transform = 'translate(2px, -2px)';
                removeBtn.style.boxShadow = '-2px 2px 0 #A11D12';
            });

            removeBtn.addEventListener('mouseleave', () => {
                removeBtn.style.transform = 'translate(0, 0)';
                removeBtn.style.boxShadow = 'none';
            });

            // 删除简历
            removeBtn.addEventListener('click', () => {
                state.settings.imageResumes.splice(index, 1);
                resumeItem.remove();
                updateAddButtonState();
                updateToggleState();
                StatePersistence.saveState();
            });

            resumeItem.append(fileNameSpan, removeBtn);
            return resumeItem;
        }

        // 更新开关状态
        function updateToggleState() {
            const hasResumes = state.settings.imageResumes && state.settings.imageResumes.length > 0;
            const toggleInput = document.querySelector('#toggle-auto-send-image-resume input');

            if (!hasResumes) {
                state.settings.useAutoSendImageResume = false;
                if (toggleInput) {
                    toggleInput.checked = false;
                    toggleInput.dispatchEvent(new Event('change'));
                }
            }
        }

        // 初始渲染已上传的简历
        if (state.settings.imageResumes && state.settings.imageResumes.length > 0) {
            state.settings.imageResumes.forEach((resume, index) => {
                const resumeItem = renderResumeItem(index, resume);
                uploadedResumesContainer.appendChild(resumeItem);
            });
        }

        // 修改后的 createToggleSwitch 调用
        const autoSendImageResumeToggle = (() => {
            // 检查是否有简历，但保留用户的设置状态
            const hasResumes = state.settings.imageResumes && state.settings.imageResumes.length > 0;
            // UI上显示的状态是设置为true且有简历时才为true
            const displayState = hasResumes && state.settings.useAutoSendImageResume;

            return createToggleSwitch(
                'auto-send-image-resume',
                displayState,
                (checked) => {
                    const hasResumes = state.settings.imageResumes && state.settings.imageResumes.length > 0;
                    if (checked && !hasResumes) {
                        showNotification('请先添加至少一个图片简历', 'error');

                        return false; // 阻止后续处理
                    }
                    state.settings.useAutoSendImageResume = checked;
                    StatePersistence.saveState(); // 保存设置
                    return true;
                }
            );
        })();

        // 添加简历按钮点击事件
        addResumeBtn.addEventListener('click', () => {
            if (state.settings.imageResumes.length < 3) {
                hiddenFileInput.click();
            }
        });

        // 文件选择变化事件
        hiddenFileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];

                // 检查是否已存在同名文件
                const isDuplicate = state.settings.imageResumes.some(resume => resume.path === file.name);
                if (isDuplicate) {
                    showNotification('该文件名已存在', 'error');
                    return;
                }

                // 读取图片并转换为Base64
                const reader = new FileReader();
                reader.onload = function (event) {
                    const newResume = {
                        path: file.name,
                        data: event.target.result
                    };

                    state.settings.imageResumes.push(newResume);

                    // 添加到UI
                    const index = state.settings.imageResumes.length - 1;
                    const resumeItem = renderResumeItem(index, newResume);
                    uploadedResumesContainer.appendChild(resumeItem);

                    // 更新按钮状态
                    updateAddButtonState();

                    // 自动启用开关
                    if (!state.settings.useAutoSendImageResume) {
                        state.settings.useAutoSendImageResume = true;
                        const toggleInput = document.querySelector('#toggle-auto-send-image-resume input');
                        toggleInput.checked = true;
                        toggleInput.dispatchEvent(new Event('change'));
                    }

                    // 保存设置
                    StatePersistence.saveState();
                };
                reader.readAsDataURL(file);
            }
        });

        // 初始化按钮状态
        updateAddButtonState();

        fileUploadsContainer.append(addResumeBtn, uploadedResumesContainer, hiddenFileInput);
        imageResumeDescriptionContainer.append(autoSendImageResumeToggle);
        imageResumeSetting.append(fileUploadsContainer);

        const recruiterStatusSettingResult = createSettingItem(
            '投递招聘者状态',
            '筛选活跃状态符合要求的招聘者进行投递',
            () => document.querySelector('#recruiter-status-select .select-header')
        );

        const recruiterStatusSetting = recruiterStatusSettingResult.settingItem;

        const statusSelect = document.createElement('div');
        statusSelect.id = 'recruiter-status-select';
        statusSelect.className = 'custom-select';
        statusSelect.style.cssText = `
        position: relative;
        width: 100%;
        margin-top: 10px;
    `;

        const statusHeader = document.createElement('div');
        statusHeader.className = 'select-header';
        statusHeader.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        border-radius: 2px;
        border: 2px solid ${PANEL_THEME.ink};
        background: ${PANEL_THEME.paper};
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        min-height: 48px;
    `;

        const statusDisplay = document.createElement('div');
        statusDisplay.className = 'select-value';
        statusDisplay.style.cssText = `
        flex: 1;
        text-align: left;
        color: ${PANEL_THEME.ink};
        font-size: 14px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    `;
        statusDisplay.textContent = getStatusDisplayText();

        const statusIcon = document.createElement('div');
        statusIcon.className = 'select-icon';
        statusIcon.innerHTML = '&#9660;';
        statusIcon.style.cssText = `
        margin-left: 10px;
        color: ${PANEL_THEME.ink};
        transition: transform 0.2s ease;
    `;

        const statusClear = document.createElement('button');
        statusClear.className = 'select-clear';
        statusClear.innerHTML = '×';
        statusClear.style.cssText = `
        background: none;
        border: none;
        color: ${PANEL_THEME.neutral};
        cursor: pointer;
        font-size: 16px;
        margin-left: 8px;
        display: none;
        transition: color 0.2s ease;
    `;

        statusHeader.append(statusDisplay, statusClear, statusIcon);

        const statusOptions = document.createElement('div');
        statusOptions.className = 'select-options';
        statusOptions.style.cssText = `
        position: absolute;
        top: calc(100% + 6px);
        left: 0;
        right: 0;
        max-height: 240px;
        overflow-y: auto;
        border-radius: 2px;
        border: 2px solid ${PANEL_THEME.ink};
        background: ${PANEL_THEME.paper};
        z-index: 100;
        box-shadow: -8px 8px 0 ${PANEL_THEME.ink}, 0 12px 25px rgba(56,56,56,0.2);
        display: none;
        transition: all 0.2s ease;
        scrollbar-width: thin;
        scrollbar-color: ${PANEL_THEME.primary} ${PANEL_THEME.cream};
    `;

        statusOptions.innerHTML += `
        <style>
            .select-options::-webkit-scrollbar {
                width: 6px;
            }
            .select-options::-webkit-scrollbar-track {
                background: ${PANEL_THEME.cream};
            }
            .select-options::-webkit-scrollbar-thumb {
                background: ${PANEL_THEME.primary};
                border-radius: 2px;
                border: 2px solid ${PANEL_THEME.ink};
            }
            .select-options::-webkit-scrollbar-thumb:hover {
                background: ${PANEL_THEME.primaryHover};
            }
            .select-options .select-option.selected {
                background: rgba(111, 194, 255, 0.2);
            }
        </style>
    `;

        const statusOptionsList = [
            { value: '不限', text: '不限' },
            { value: '在线', text: '在线' },
            { value: '刚刚活跃', text: '刚刚活跃' },
            { value: '今日活跃', text: '今日活跃' },
            { value: '3日内活跃', text: '3日内活跃' },
            { value: '本周活跃', text: '本周活跃' },
            { value: '本月活跃', text: '本月活跃' },
            { value: '半年前活跃', text: '半年前活跃' }
        ];

        statusOptionsList.forEach(option => {
            const statusOption = document.createElement('div');
            statusOption.className = 'select-option' + (settings$1.recruiterActivityStatus.includes(option.value) ? ' selected' : '');
            statusOption.dataset.value = option.value;
            statusOption.style.cssText = `
            padding: 12px 16px;
            cursor: pointer;
            transition: background 0.2s ease;
            display: flex;
            align-items: center;
            font-size: 14px;
            color: ${PANEL_THEME.ink};
        `;

            const checkIcon = document.createElement('span');
            checkIcon.className = 'check-icon';
            checkIcon.innerHTML = '✓';
            checkIcon.style.cssText = `
            margin-right: 8px;
            color: ${PANEL_THEME.primary};
            font-weight: bold;
            display: ${settings$1.recruiterActivityStatus.includes(option.value) ? 'inline' : 'none'};
        `;

            const textSpan = document.createElement('span');
            textSpan.textContent = option.text;

            statusOption.append(checkIcon, textSpan);

            statusOption.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleStatusOption(option.value);
            });

            statusOptions.appendChild(statusOption);
        });

        statusHeader.addEventListener('click', () => {
            statusOptions.style.display = statusOptions.style.display === 'block' ? 'none' : 'block';
            statusIcon.style.transform = statusOptions.style.display === 'block' ? 'rotate(180deg)' : 'rotate(0)';
        });

        statusClear.addEventListener('click', (e) => {
            e.stopPropagation();
            settings$1.recruiterActivityStatus = [];
            updateStatusOptions();
        });

        document.addEventListener('click', (e) => {
            if (!statusSelect.contains(e.target)) {
                statusOptions.style.display = 'none';
                statusIcon.style.transform = 'rotate(0)';
            }
        });

        statusHeader.addEventListener('mouseenter', () => {
            statusHeader.style.background = PANEL_THEME.cream;
            statusHeader.style.transform = 'translate(4px, -4px)';
            statusHeader.style.boxShadow = `-4px 4px 0 ${PANEL_THEME.ink}`;
        });

        statusHeader.addEventListener('mouseleave', () => {
            if (!statusHeader.contains(document.activeElement)) {
                statusHeader.style.background = PANEL_THEME.paper;
                statusHeader.style.transform = 'translate(0, 0)';
                statusHeader.style.boxShadow = 'none';
            }
        });

        statusHeader.addEventListener('focus', () => {
            statusHeader.style.background = PANEL_THEME.cream;
            statusHeader.style.transform = 'translate(4px, -4px)';
            statusHeader.style.boxShadow = `-4px 4px 0 ${PANEL_THEME.ink}`;
        });

        statusHeader.addEventListener('blur', () => {
            statusHeader.style.background = PANEL_THEME.paper;
            statusHeader.style.transform = 'translate(0, 0)';
            statusHeader.style.boxShadow = 'none';
        });

        statusSelect.append(statusHeader, statusOptions);
        recruiterStatusSetting.append(statusSelect);

        advancedSettingsPanel.append(autoReplySetting, autoSendResumeSetting, excludeHeadhuntersSetting, imageResumeSetting, recruiterStatusSetting);

        const intervalSettingsPanel = document.createElement('div');
        intervalSettingsPanel.id = 'interval-settings-panel';
        intervalSettingsPanel.style.display = 'none';

        const basicIntervalSettingResult = createSettingItem(
            '基本间隔',
            '滚动、检查新聊天等间隔时间（毫秒）',
            () => document.getElementById('basic-interval-input')
        );

        const basicIntervalSetting = basicIntervalSettingResult.settingItem;

        const basicIntervalInput = document.createElement('input');
        basicIntervalInput.id = 'basic-interval-input';
        basicIntervalInput.type = 'number';
        basicIntervalInput.min = 500;
        basicIntervalInput.max = 10000;
        basicIntervalInput.step = 100;
        basicIntervalInput.style.cssText = `
        width: 100%;
        padding: 12px 14px;
        border-radius: 2px;
        border: 2px solid ${PANEL_THEME.ink};
        font-size: 14px;
        margin-top: 12px;
        background: ${PANEL_THEME.paper};
        color: ${PANEL_THEME.ink};
        transition: box-shadow 0.2s ease;
    `;

        addFocusBlurEffects(basicIntervalInput);
        basicIntervalSetting.append(basicIntervalInput);

        const operationIntervalSettingResult = createSettingItem(
            '操作间隔',
            '点击沟通按钮之间的间隔时间（毫秒）',
            () => document.getElementById('operation-interval-input')
        );

        const operationIntervalSetting = operationIntervalSettingResult.settingItem;

        const operationIntervalInput = document.createElement('input');
        operationIntervalInput.id = 'operation-interval-input';
        operationIntervalInput.type = 'number';
        operationIntervalInput.min = 100;
        operationIntervalInput.max = 2000;
        operationIntervalInput.step = 50;
        operationIntervalInput.style.cssText = `
        width: 100%;
        padding: 12px 14px;
        border-radius: 2px;
        border: 2px solid ${PANEL_THEME.ink};
        font-size: 14px;
        margin-top: 12px;
        background: ${PANEL_THEME.paper};
        color: ${PANEL_THEME.ink};
        transition: box-shadow 0.2s ease;
    `;

        addFocusBlurEffects(operationIntervalInput);
        operationIntervalSetting.append(operationIntervalInput);

        const scrollSpeedSettingResult = createSettingItem(
            '自动滚动速度',
            '页面自动滚动的速度 (毫秒/像素)',
            () => document.getElementById('scroll-speed-input')
        );

        const scrollSpeedSetting = scrollSpeedSettingResult.settingItem;

        const scrollSpeedInput = document.createElement('input');
        scrollSpeedInput.id = 'scroll-speed-input';
        scrollSpeedInput.type = 'number';
        scrollSpeedInput.min = 100;
        scrollSpeedInput.max = 2000;
        scrollSpeedInput.step = 50;
        scrollSpeedInput.style.cssText = `
        width: 100%;
        padding: 12px 14px;
        border-radius: 2px;
        border: 2px solid ${PANEL_THEME.ink};
        font-size: 14px;
        margin-top: 12px;
        background: ${PANEL_THEME.paper};
        color: ${PANEL_THEME.ink};
        transition: box-shadow 0.2s ease;
    `;

        addFocusBlurEffects(scrollSpeedInput);
        scrollSpeedSetting.append(scrollSpeedInput);

        intervalSettingsPanel.append(basicIntervalSetting, operationIntervalSetting, scrollSpeedSetting);

        aiTab.style.background = 'var(--primary-color)';
        aiTab.style.color = PANEL_THEME.ink;
        aiTab.style.transform = 'translate(4px, -4px)';
        aiTab.style.boxShadow = `-4px 4px 0 ${PANEL_THEME.ink}`;

        aiTab.addEventListener('click', () => {
            setActiveTab(aiTab, aiSettingsPanel);
        });

        advancedTab.addEventListener('click', () => {
            setActiveTab(advancedTab, advancedSettingsPanel);
        });

        intervalTab.addEventListener('click', () => {
            setActiveTab(intervalTab, intervalSettingsPanel);
        });

        const dialogFooter = document.createElement('div');
        dialogFooter.style.cssText = `
        padding: 16px 24px;
        border-top: 2px solid ${PANEL_THEME.ink};
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        background: ${PANEL_THEME.paper};
    `;

        const cancelBtn = createTextButton(
            '取消',
            PANEL_THEME.paper,
            () => {
                dialog.classList.remove('active');
                setTimeout(() => {
                    dialog.style.display = 'none';
                }, 150);
            }
        );

        const saveBtn = createTextButton(
            '保存设置',
            'var(--primary-color)',
            () => {
                try {
                    const aiRoleInput = document.getElementById('ai-role-input');
                    settings$1.ai.role = aiRoleInput ? aiRoleInput.value : '';

                    const basicIntervalInput = document.getElementById('basic-interval-input');
                    const basicIntervalValue = basicIntervalInput ? parseInt(basicIntervalInput.value) : settings$1.intervals.basic;
                    settings$1.intervals.basic = isNaN(basicIntervalValue) ? settings$1.intervals.basic : basicIntervalValue;

                    const operationIntervalInput = document.getElementById('operation-interval-input');
                    const operationIntervalValue = operationIntervalInput ? parseInt(operationIntervalInput.value) : settings$1.intervals.operation;
                    settings$1.intervals.operation = isNaN(operationIntervalValue) ? settings$1.intervals.operation : operationIntervalValue;

                    const scrollSpeedInput = document.getElementById('scroll-speed-input');
                    const scrollSpeedValue = scrollSpeedInput ? parseInt(scrollSpeedInput.value) : settings$1.autoScrollSpeed;
                    settings$1.autoScrollSpeed = isNaN(scrollSpeedValue) ? settings$1.autoScrollSpeed : scrollSpeedValue;

                    saveSettings();

                    showNotification('设置已保存');
                    dialog.classList.remove('active');
                    setTimeout(() => {
                        dialog.style.display = 'none';
                    }, 150);
                } catch (error) {
                    showNotification('保存失败: ' + error.message, 'error');
                    console.error('保存设置失败:', error);
                }
            }
        );

        dialogFooter.append(cancelBtn, saveBtn);

        dialogContent.append(tabsContainer, aiSettingsPanel, advancedSettingsPanel, intervalSettingsPanel);
        dialog.append(dialogHeader, dialogContent, dialogFooter);

        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                dialog.classList.remove('active');
                setTimeout(() => {
                    dialog.style.display = 'none';
                }, 150);
            }
        });

        return dialog;
    }

    function showSettingsDialog$1() {
        let dialog = document.getElementById('boss-settings-dialog');
        if (!dialog) {
            dialog = createSettingsDialog();
            document.body.appendChild(dialog);
        }

        dialog.style.display = 'flex';

        setTimeout(() => {
            dialog.classList.add('active');
            setTimeout(loadSettingsIntoUI, 100);
        }, 10);
    }

    function toggleStatusOption(value) {
        if (value === '不限') {
            settings$1.recruiterActivityStatus = settings$1.recruiterActivityStatus.includes('不限') ? [] : ['不限'];
        } else {
            if (settings$1.recruiterActivityStatus.includes('不限')) {
                settings$1.recruiterActivityStatus = [value];
            } else {
                if (settings$1.recruiterActivityStatus.includes(value)) {
                    settings$1.recruiterActivityStatus = settings$1.recruiterActivityStatus.filter(v => v !== value);
                } else {
                    settings$1.recruiterActivityStatus.push(value);
                }

                if (settings$1.recruiterActivityStatus.length === 0) {
                    settings$1.recruiterActivityStatus = ['不限'];
                }
            }
        }

        updateStatusOptions();
    }

    function updateStatusOptions() {
        const options = document.querySelectorAll('#recruiter-status-select .select-option');
        options.forEach(option => {
            const isSelected = settings$1.recruiterActivityStatus.includes(option.dataset.value);
            option.className = 'select-option' + (isSelected ? ' selected' : '');
            option.querySelector('.check-icon').style.display = isSelected ? 'inline' : 'none';

            if (option.dataset.value === '不限') {
                if (isSelected) {
                    options.forEach(opt => {
                        if (opt.dataset.value !== '不限') {
                            opt.className = 'select-option';
                            opt.querySelector('.check-icon').style.display = 'none';
                        }
                    });
                }
            }
        });

        document.querySelector('#recruiter-status-select .select-value').textContent = getStatusDisplayText();

        document.querySelector('#recruiter-status-select .select-clear').style.display =
            settings$1.recruiterActivityStatus.length > 0 && !settings$1.recruiterActivityStatus.includes('不限') ? 'inline' : 'none';
    }

    function getStatusDisplayText() {
        if (settings$1.recruiterActivityStatus.includes('不限')) {
            return '不限';
        }

        if (settings$1.recruiterActivityStatus.length === 0) {
            return '请选择';
        }

        if (settings$1.recruiterActivityStatus.length <= 2) {
            return settings$1.recruiterActivityStatus.join('、');
        }

        return `${settings$1.recruiterActivityStatus[0]}、${settings$1.recruiterActivityStatus[1]}等${settings$1.recruiterActivityStatus.length}项`;
    }

    function loadSettingsIntoUI() {
        const aiRoleInput = document.getElementById('ai-role-input');
        if (aiRoleInput) {
            aiRoleInput.value = settings$1.ai.role;
        }

        const autoReplyInput = document.querySelector('#toggle-auto-reply-mode input');
        if (autoReplyInput) {
            autoReplyInput.checked = settings$1.autoReply;
        }

        const autoSendResumeInput = document.querySelector('#toggle-auto-send-resume input');
        if (autoSendResumeInput) {
            autoSendResumeInput.checked = settings$1.useAutoSendResume;
        }

        const excludeHeadhuntersInput = document.querySelector('#toggle-exclude-headhunters input');
        if (excludeHeadhuntersInput) {
            excludeHeadhuntersInput.checked = settings$1.excludeHeadhunters;
        }

        const basicIntervalInput = document.getElementById('basic-interval-input');
        if (basicIntervalInput) {
            basicIntervalInput.value = settings$1.intervals.basic.toString();
        }

        const operationIntervalInput = document.getElementById('operation-interval-input');
        if (operationIntervalInput) {
            operationIntervalInput.value = settings$1.intervals.operation.toString();
        }

        const scrollSpeedInput = document.getElementById('scroll-speed-input');
        if (scrollSpeedInput) {
            scrollSpeedInput.value = settings$1.autoScrollSpeed.toString();
        }

        // 加载图片简历设置
        const autoSendImageResumeInput = document.querySelector('#toggle-auto-send-image-resume input');
        if (autoSendImageResumeInput) {
            // 只有在有图片文件时才允许开启
            autoSendImageResumeInput.checked = settings$1.useAutoSendImageResume && settings$1.imageResumePath;
        }

        const fileNameDisplay = document.getElementById('image-resume-filename');
        if (fileNameDisplay) {
            fileNameDisplay.textContent = settings$1.imageResumePath || '未选择文件';
        }

        updateStatusOptions();
    }

    function createDialogHeader(title) {
        const header = document.createElement('div');
        header.style.cssText = `
        padding: 18px 24px;
        background: ${PANEL_THEME.paper};
        color: ${PANEL_THEME.ink};
        font-size: 18px;
        font-weight: 500;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid ${PANEL_THEME.ink};
    `;

        const titleElement = document.createElement('div');
        titleElement.textContent = title;
        titleElement.style.cssText = `
        font-family: 'Monaco', 'Consolas', monospace;
        letter-spacing: 0.08em;
        text-transform: uppercase;
    `;

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.title = '关闭设置';
        closeBtn.style.cssText = `
        width: 36px;
        height: 36px;
        background: ${PANEL_THEME.paper};
        color: ${PANEL_THEME.ink};
        border-radius: 2px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        border: 2px solid ${PANEL_THEME.ink};
        font-size: 16px;
    `;

        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.transform = 'translate(3px, -3px)';
            closeBtn.style.boxShadow = `-3px 3px 0 ${PANEL_THEME.ink}`;
        });

        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.transform = 'translate(0, 0)';
            closeBtn.style.boxShadow = 'none';
        });

        closeBtn.addEventListener('click', () => {
            const dialog = document.getElementById('boss-settings-dialog');
            if (dialog) {
                dialog.classList.remove('active');
                setTimeout(() => {
                    dialog.style.display = 'none';
                }, 150);
            }
        });

        header.append(titleElement, closeBtn);
        return header;
    }

    function createSettingItem(title, description, controlGetter) {
        const settingItem = document.createElement('div');
        settingItem.className = 'setting-item';
        settingItem.style.cssText = `
        padding: 18px 20px;
        border-radius: 2px;
        margin-bottom: 16px;
        background: ${PANEL_THEME.paper};
        box-shadow: -6px 6px 0 ${PANEL_THEME.ink};
        border: 2px solid ${PANEL_THEME.ink};
        display: flex;
        flex-direction: column;
        gap: 10px;
    `;

        const titleElement = document.createElement('h4');
        titleElement.textContent = title;
        titleElement.style.cssText = `
        margin: 0;
        color: ${PANEL_THEME.ink};
        font-size: 15px;
        font-weight: 500;
        letter-spacing: 0.05em;
        text-transform: uppercase;
    `;

        const descElement = document.createElement('p');
        descElement.textContent = description;
        descElement.style.cssText = `
        margin: 4px 0 0;
        color: ${PANEL_THEME.neutral};
        font-size: 13px;
        line-height: 1.5;
    `;

        const descriptionContainer = document.createElement('div');
        descriptionContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        gap: 12px;
    `;

        const textContainer = document.createElement('div');
        textContainer.append(titleElement, descElement);

        descriptionContainer.append(textContainer);

        settingItem.append(descriptionContainer);

        settingItem.addEventListener('click', () => {
            const control = controlGetter();
            if (control && typeof control.focus === 'function') {
                control.focus();
            }
        });

        return {
            settingItem,
            descriptionContainer
        };
    }

    function createToggleSwitch(id, isChecked, onChange) {
        const container = document.createElement('div');
        container.className = 'toggle-container';
        container.style.cssText = 'display: flex; justify-content: space-between; align-items: center;';

        const switchContainer = document.createElement('div');
        switchContainer.className = 'toggle-switch';
        switchContainer.style.cssText = `
        position: relative;
        width: 64px;
        height: 28px;
        border-radius: 2px;
        border: 2px solid ${PANEL_THEME.ink};
        background: ${isChecked ? 'var(--primary-color)' : PANEL_THEME.paper};
        transition: background 0.2s ease;
        cursor: pointer;
    `;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `toggle-${id}`;
        checkbox.checked = isChecked;
        checkbox.style.display = 'none';

        const slider = document.createElement('span');
        slider.className = 'toggle-slider';
        slider.style.cssText = `
        position: absolute;
        top: 2px;
        left: ${isChecked ? '34px' : '2px'};
        width: 24px;
        height: 24px;
        border-radius: 2px;
        background-color: ${PANEL_THEME.paper};
        border: 2px solid ${PANEL_THEME.ink};
        box-shadow: -2px 2px 0 ${PANEL_THEME.ink};
        transition: left 0.2s ease;
    `;

        // 新增强制状态同步函数
        const forceUpdateUI = (checked) => {
            checkbox.checked = checked;
            switchContainer.style.background = checked ? 'var(--primary-color)' : PANEL_THEME.paper;
            slider.style.left = checked ? '34px' : '2px';
        };

        checkbox.addEventListener('change', () => {
            let allowChange = true;

            if (onChange) {
                // 回调函数可通过返回 false 阻断状态更新
                allowChange = onChange(checkbox.checked) !== false;
            }

            if (!allowChange) {
                // 非法操作时立即恢复原状态（不触发动画）
                forceUpdateUI(!checkbox.checked);
                return;
            }

            // 正常操作更新UI
            forceUpdateUI(checkbox.checked);
        });

        switchContainer.addEventListener('click', () => {
            // 直接触发状态变化（不再通过模拟事件）
            const newState = !checkbox.checked;

            if (onChange) {
                if (onChange(newState) !== false) {
                    forceUpdateUI(newState);
                }
            } else {
                forceUpdateUI(newState);
            }
        });

        switchContainer.append(checkbox, slider);
        container.append(switchContainer);

        return container;
    }

    function createTextButton(text, backgroundColor, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        const defaultBackground = backgroundColor || PANEL_THEME.paper;
        const isAccentButton = defaultBackground !== PANEL_THEME.paper;
        button.style.cssText = `
        padding: 12px 22px;
        border-radius: 2px;
        border: 2px solid ${PANEL_THEME.ink};
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        background: ${defaultBackground};
        color: ${PANEL_THEME.ink};
        font-family: 'Monaco', 'Consolas', monospace;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        box-shadow: -4px 4px 0 ${PANEL_THEME.ink};
        min-width: 120px;
    `;

        button.addEventListener('mouseenter', () => {
            button.style.background = isAccentButton ? PANEL_THEME.primaryHover : PANEL_THEME.cream;
            button.style.transform = 'translate(4px, -4px)';
            button.style.boxShadow = `-4px 4px 0 ${PANEL_THEME.ink}`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.background = defaultBackground;
            button.style.transform = 'translate(0, 0)';
            button.style.boxShadow = '-4px 4px 0 ' + PANEL_THEME.ink;
        });

        button.addEventListener('mousedown', () => {
            button.style.transform = 'translate(0, 0)';
            button.style.boxShadow = 'none';
        });

        button.addEventListener('mouseup', () => {
            button.style.transform = 'translate(4px, -4px)';
            button.style.boxShadow = `-4px 4px 0 ${PANEL_THEME.ink}`;
        });

        button.addEventListener('click', onClick);

        return button;
    }

    function addFocusBlurEffects(element) {
        element.addEventListener('focus', () => {
            element.style.borderColor = 'var(--primary-color)';
            element.style.boxShadow = `-4px 4px 0 ${PANEL_THEME.ink}`;
        });

        element.addEventListener('blur', () => {
            element.style.borderColor = PANEL_THEME.ink;
            element.style.boxShadow = 'none';
        });
    }

    function setActiveTab(tab, panel) {
        const tabs = document.querySelectorAll('.settings-tab');
        const panels = [
            document.getElementById('ai-settings-panel'),
            document.getElementById('advanced-settings-panel'),
            document.getElementById('interval-settings-panel')
        ];

        tabs.forEach(t => {
            t.classList.remove('active');
            t.style.background = PANEL_THEME.paper;
            t.style.color = PANEL_THEME.ink;
            t.style.transform = 'translate(0, 0)';
            t.style.boxShadow = 'none';
        });

        panels.forEach(p => {
            if (p) {
                p.style.display = 'none';
            }
        });

        tab.classList.add('active');
        tab.style.background = 'var(--primary-color)';
        tab.style.color = PANEL_THEME.ink;
        tab.style.transform = 'translate(4px, -4px)';
        tab.style.boxShadow = `-4px 4px 0 ${PANEL_THEME.ink}`;

        if (panel) {
            panel.style.display = 'block';
        }
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        const bgColor = type === 'success' ? PANEL_THEME.secondary : '#FF7169';

        notification.style.cssText = `
        position: fixed;
        top: 24px;
        left: 50%;
        transform: translateX(-50%);
        background: ${bgColor};
        color: ${PANEL_THEME.ink};
        padding: 12px 20px;
        border-radius: 2px;
        border: 2px solid ${PANEL_THEME.ink};
        box-shadow: -6px 6px 0 ${PANEL_THEME.ink};
        z-index: 9999999;
        opacity: 0;
        transition: opacity 0.3s ease;
        font-family: 'Monaco', 'Consolas', monospace;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    `;

        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.style.opacity = '1', 10);
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 2000);
    }

    // 导出到全局
    window.showSettingsDialog = showSettingsDialog$1;
    window.settings = settings$1;

    /**
     * JOBPILOT 投递助手 - 主入口文件
     * 模块化开发，自动构建打包
     */


    // 主程序启动逻辑（来自 main.js）
    (function () {

        const STORAGE = {
            LETTER: 'letterLastShown',
            GUIDE: 'shouldShowGuide',
            AI_COUNT: 'aiReplyCount',
            AI_DATE: 'lastAiDate'
        };

        function getToday() {
            return new Date().toISOString().split('T')[0];
        }

        // 立即显示UI（加载中状态）
        function initUIFast() {
            try {
                // 立即初始化UI面板（禁用状态）
                UI.init(true); // 传入true表示加载中状态
                document.body.style.position = 'relative';
            } catch (error) {
                console.error('UI快速初始化失败:', error);
            }
        }

        // DOM就绪后启用功能
        function enableFeatures() {
            try {
                const midnight = new Date();
                midnight.setDate(midnight.getDate() + 1);
                midnight.setHours(0, 0, 0, 0);
                setTimeout(() => {
                    localStorage.removeItem(STORAGE.AI_COUNT);
                    localStorage.removeItem(STORAGE.AI_DATE);
                    localStorage.removeItem(STORAGE.LETTER);
                }, midnight - Date.now());

                // 启用UI功能
                UI.setReady();

                const today = getToday();
                if (location.pathname.includes('/jobs')) {
                    if (localStorage.getItem(STORAGE.LETTER) !== today) {
                        letter.showLetterToUser();
                        localStorage.setItem(STORAGE.LETTER, today);
                    } else if (localStorage.getItem(STORAGE.GUIDE) !== 'true') {
                        guide.showGuideToUser();
                        localStorage.setItem(STORAGE.GUIDE, 'true');
                        Core.delay(800);
                        window.open('https://www.zhipin.com/web/geek/notify-set?ka=notify-set', '_blank');
                    }
                    Core.log('欢迎使用海投助手,我将自动投递岗位!');
                } else if (location.pathname.includes('/chat')) {
                    Core.log('欢迎使用海投助手,我将自动发送简历!');
                } else if (location.pathname.includes('/notify-set')) {
                    Core.log('请将常用语换为自我介绍来引起HR的注意!');

                    const targetSelector = 'h3.normal.title';
                    const observer = new MutationObserver((mutations, obs) => {
                        const targetElement = document.querySelector(targetSelector);
                        if (targetElement) {
                            targetElement.textContent = '把常用语换为自我介绍,并设图片简历; 招呼语功能必须启用。';
                            obs.disconnect();
                        }
                    });

                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });
                } else {
                    Core.log('当前页面暂不支持,请移步至职位页面!');
                }
            } catch (error) {
                console.error('功能启用失败:', error);
                if (UI.notify) UI.notify('功能启用失败', 'error');
            }
        }

        // 立即执行UI初始化
        initUIFast();

        // DOM完全加载后启用功能
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', enableFeatures);
        } else {
            // DOM已经就绪，立即启用
            enableFeatures();
        }
    })();

})();
