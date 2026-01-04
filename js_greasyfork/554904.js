// ==UserScript==
// @name         SEU劳动教育课程推送助手
// @namespace    http://tampermonkey.net/
// @version      2.6
// @license      MIT
// @description  东南大学劳动教育选课神器！实时监控新增课程并微信推送，移动端后台稳定运行，当然你也可以选择在电脑上安装
// @author       zz6zz666@github with AI support
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @run-at       document-end
// @connect      www.pushplus.plus
// @downloadURL https://update.greasyfork.org/scripts/554904/SEU%E5%8A%B3%E5%8A%A8%E6%95%99%E8%82%B2%E8%AF%BE%E7%A8%8B%E6%8E%A8%E9%80%81%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/554904/SEU%E5%8A%B3%E5%8A%A8%E6%95%99%E8%82%B2%E8%AF%BE%E7%A8%8B%E6%8E%A8%E9%80%81%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== 全局配置区（用户可自定义）====================
    // 【登录与推送配置】
    const USERNAME = '12345678';       // 替换为你的一卡通号
    const PASSWORD = 'abc123456';      // 替换为你的密码
    const PUSHPLUS_TOKEN = 'ce0**********************************11'; // 替换为你的PushPlus Token
    const PUSH_TITLE = '劳动教育课程推送'; // 微信推送标题
    const LOCATION_FILTERS = [];       // 校区筛选，如['四牌楼校区', '九龙湖校区']，为空则不筛选
    const CATEGORY_FILTERS = [];       // 劳动类别筛选，如['服务劳动']，为空则不筛选（完全匹配）
    const REFRESH_INTERVAL = 3 * 60 * 1000; // 选课页自动刷新间隔（单位：毫秒）
    const LOGIN_TIMEOUT = 10 * 1000;  // 登录超时检测时间（单位：毫秒）
    const LOGIN_DISABLE_DURATION = 15 * 60 * 1000; // 登录失败后禁用自动登录时长（单位：毫秒）

    // 【后台页面活性维持配置】
    const COOLDOWN = 180 * 1000;        // 冷却时间（单位：毫秒）
    const HEARTBEAT_INTERVAL = 15 * 1000;   // 心跳间隔
    const CHECK_INTERVAL = 60 * 1000;       // 检查间隔
    const HEARTBEAT_URL = 'https://labor.seu.edu.cn/favicon.ico'; // 用于心跳的轻量资源
    // =================================================================

    // ==================== 工具函数 ====================
    function pushToWechat(title, content) {
        if (!PUSHPLUS_TOKEN) {
            console.error('【错误】请填写PushPlus Token');
            return;
        }
        GM_xmlhttpRequest({
            method: "POST",
            url: 'http://www.pushplus.plus/send',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify({
                'token': PUSHPLUS_TOKEN,
                'title': title,
                'content': content,
                'template': 'markdown'
            }),
            onload: function(response) {
                console.log('%c【推送成功】', 'color:green; font-weight:bold;');
            },
            onerror: function(error) {
                console.error('【推送失败】', error);
            }
        });
    }

    function shouldDisableLogin() {
        const isLoginFailed = GM_getValue('loginFailStatus', true);
        if (!isLoginFailed) {
            return false;
        }
        
        // 有失败标志时，再判断是否在冷却期内
        const lastFailTime = GM_getValue('loginFailTime', 0);
        const now = Date.now();
        return (now - lastFailTime) < LOGIN_DISABLE_DURATION;
    }
    // =================================================

    // ==================== 移动端活性维持增强逻辑 ====================
    const currentUrl = window.location.href;
    const LOGIN_LABOR_URL = "https://auth.seu.edu.cn/dist/#/dist/main/login?service=https://labor.seu.edu.cn/UnifiedAuth/CASLogin";

    /**
     * 发送轻量心跳请求（兼容移动端后台）
     * 利用浏览器对同域请求的优先级优待，减少被休眠的概率
     */
    function sendHeartbeat() {
        // 带时间戳避免缓存，确保请求实际发送
        const url = `${HEARTBEAT_URL}?ts=${Date.now()}`;
        return fetch(url, {
            method: 'HEAD', // 只请求头，减少数据传输
            keepalive: true, // 确保页面隐藏时仍能发送
            cache: 'no-store'
        }).then(() => {
            const now = Date.now();
            GM_setValue('lastTargetActive', now);
            console.log(`[心跳成功] ${new Date(now).toLocaleTimeString()}`);
        }).catch(err => {
            console.log(`[心跳失败] 重试中... ${err.message}`);
            // 失败时立即重试一次
            setTimeout(sendHeartbeat, 3000);
        });
    }

    /**
     * 增强版目标页面活性维持
     * 结合心跳请求+定时器策略，对抗移动端后台休眠
     */
    function handleTargetPage() {
        // 立即发送一次心跳初始化
        sendHeartbeat();

        // 核心：使用不等间隔的定时器，避免浏览器识别为周期性任务而延迟
        let intervalOffset = 0; // 动态偏移量，避免固定间隔被优化
        const startHeartbeatLoop = () => {
            // 每次间隔在基础时间上±10%波动，减少规律性
            const randomOffset = Math.floor(HEARTBEAT_INTERVAL * (0.9 + Math.random() * 0.2));
            intervalOffset = (intervalOffset + 1) % 5; // 避免偏移累积

            const timer = setTimeout(() => {
                // 检测页面可见性，可见时额外更新一次状态
                if (document.visibilityState === 'visible') {
                    GM_setValue('lastTargetActive', Date.now());
                }
                sendHeartbeat();
                startHeartbeatLoop(); // 递归调用，保持循环
            }, randomOffset + intervalOffset * 100);

            // 监听页面可见性变化，立即发送心跳
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible') {
                    clearTimeout(timer);
                    sendHeartbeat();
                    startHeartbeatLoop();
                }
            }, { once: true });
        };

        startHeartbeatLoop();
    }

    /**
     * 非目标页面检查逻辑
     */
    function handleNonTargetPage() {
        if (shouldDisableLogin()) {
            console.log('[页面活性] 登录失败冷却期内，暂不创建新标签页');
            return;
        }
        function checkAndCreate() {
            const lastActive = GM_getValue('lastTargetActive', 0);
            const now = Date.now();
            const timeSinceLast = now - lastActive;

            if (timeSinceLast > COOLDOWN) {
                console.log(`[页面活性] 超过${COOLDOWN/1000}秒无目标页面活跃，创建新标签页`);
                GM_openInTab(LOGIN_LABOR_URL, {
                    active: false,
                    insert: true
                });
                GM_setValue('lastTargetActive', now);
            } else {
                console.log(`[页面活性] 目标页面活跃，剩余冷却：${Math.floor((COOLDOWN - timeSinceLast)/1000)}秒`);
            }
        }
        checkAndCreate();
        setInterval(checkAndCreate, CHECK_INTERVAL);
    }

    // 启动活性维持逻辑
    if (currentUrl.includes('labor.seu.edu.cn')) {
        handleTargetPage();
    } else {
        handleNonTargetPage();
    }
    // ==============================================================

    // ==================== 自动登录与选课跳转逻辑 ====================
    let loginTimer = null;
    function handleLoginPage() {
        if (shouldDisableLogin()) {
            const lastFailTime = new Date(GM_getValue('loginFailTime', 0)).toLocaleString();
            console.log(`[自动登录] 登录失败后禁用期内（上次失败时间：${lastFailTime}），暂不执行自动登录`);
            return;
        }

        console.log('[自动登录] 检测到登录页，开始自动登录...');

        let loginSuccess = false;

        if (loginTimer) {
            clearTimeout(loginTimer);
            loginTimer = null;
        }
        loginTimer = setTimeout(() => {
            // 超时后先检测是否停留在登录成功哈希页
            if (window.location.hash === '#/dist/LoginSuccess') {
                loginSuccess = true;
                GM_setValue('loginFailStatus', false);
                GM_setValue('loginFailTime', 0);
                console.log('%c[登录成功] 检测到登录成功页，未超时', 'color: green; font-weight: bold');
            }

            if (!loginSuccess) {
                console.error('[自动登录] 登录超时，未检测到跳转或成功页');
                GM_setValue('loginFailStatus', true);
                GM_setValue('loginFailTime', Date.now());
                pushToWechat('课程推送登录失效提醒',
                             `## 统一身份认证登录超时\n\n⚠️ 登录尝试超过${LOGIN_TIMEOUT/1000}秒未跳转，可能是以下原因：\n1. 需要短信验证码\n2. 账号密码错误\n3. 系统临时故障\n\n请手动登录检查状态\n时间：${new Date().toLocaleString()}`);
            }
        }, LOGIN_TIMEOUT);

        // 监听页面跳转判断登录成功
        const originalPushState = history.pushState;
        history.pushState = function(...args) {
            loginSuccess = true;
            clearTimeout(loginTimer);
            loginTimer = null;
            return originalPushState.apply(this, args);
        };

        window.addEventListener('beforeunload', () => {
            loginSuccess = true;
            clearTimeout(loginTimer);
            loginTimer = null;
        });

        // 等待登录元素加载
        const waitForElements = () => {
            // 适配PC和移动端的用户名输入框
            const usernameInput = document.querySelector('input.input-username-pc[type="text"]') ||
                                document.querySelector('input.input-username-mobile[type="text"]') ||
                                document.querySelector('input[type="text"][placeholder*="一卡通号"], input[type="text"][placeholder*="学号"]');

            // 适配PC和移动端的密码输入框
            const passwordInput = document.querySelector('input[type="password"]') ||
                                document.querySelector('input.input-password-pc') ||
                                document.querySelector('input.input-password-mobile input.ant-input');

            // 适配PC和移动端的登录按钮
            const loginButton = document.querySelector('button.login-button-pc') ||
                                document.querySelector('button[type="button"].ant-btn-primary') ||
                                document.querySelector('button[type="button"]');

            if (!usernameInput || !passwordInput || !loginButton) {
                console.log('[自动登录] 元素未找到，500ms 后重试...');
                setTimeout(waitForElements, 500);
                return;
            }

            console.log('[自动登录] 找到输入框，等待 1 秒后输入信息...');

            setTimeout(() => {
                // 强制设置输入值（兼容React等框架）
                const forceSetValue = (input, value) => {
                    const lastValue = input.value;
                    input.value = value;
                    const event = new Event('input', { bubbles: true });
                    event.simulated = true;
                    const tracker = input._valueTracker;
                    if (tracker) tracker.setValue(lastValue);
                    input.dispatchEvent(event);
                };

                forceSetValue(usernameInput, USERNAME);
                forceSetValue(passwordInput, PASSWORD);

                setTimeout(() => {
                    if (!loginButton.disabled) {
                        console.log('[自动登录] 点击登录按钮...');
                        loginButton.click();
                    } else {
                        console.log('[自动登录] 登录按钮禁用，1秒后重试点击...');
                        setTimeout(() => loginButton.click(), 1000);
                    }
                }, 500);
            }, 1000);
        };

        setTimeout(waitForElements, 1000);
    }

    function handleLaborHomePage() {
        console.log('[页面跳转] 检测到劳动教育首页，准备跳转选课页...');

        // 清除登录失败状态
        GM_setValue('loginFailStatus', false);
        GM_setValue('loginFailTime', 0);

        const targetUrl = 'https://labor.seu.edu.cn/SJItemKaiKe/XuanKe/Index';
        setTimeout(() => {
            console.log('[页面跳转] 正在跳转到选课页:', targetUrl);
            window.location.href = targetUrl;
        }, 1000);
    }
    // ==============================================================

    // ==================== 课程监控与推送逻辑 ====================
    function getWeekday(dateStr) {
        if (!dateStr) return '';
        const dateMatch = dateStr.match(/\d{4}-\d{2}-\d{2}/);
        if (!dateMatch) return '';
        const date = new Date(dateMatch[0]);
        return isNaN(date.getTime()) ? '' : ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()];
    }

    const cleanText = (text) => text ? text.trim().replace(/\s+/g, ' ') : '无';

    function extractCourseInfo(row) {
        const isPureNumber = (text) => /^\d+$/.test(text.trim());
        const col1Text = cleanText(row.querySelector('td:nth-child(1)')?.textContent || '');
        const col2Text = cleanText(row.querySelector('td:nth-child(2)')?.textContent || '');
        const isIndexInCol1 = isPureNumber(col1Text) && !isPureNumber(col2Text);
        const offset = isIndexInCol1 ? 0 : 1;

        const originalTime = cleanText(row.querySelector(`td:nth-child(${8 + offset})`).textContent);
        const weekday = getWeekday(originalTime);
        const 选课状态 = cleanText(row.querySelector(`td:nth-child(${10 + offset})`).textContent);
        const 截止状态 = cleanText(row.querySelector(`td:nth-child(${9 + offset})`).textContent);
        const 开课地点 = cleanText(row.querySelector(`td:nth-child(${7 + offset}) .limit-line`)?.textContent);
        const 项目名称 = cleanText(row.querySelector(`td:nth-child(${3 + offset})`).textContent);
        const 实施时间 = weekday ? `${originalTime}（${weekday}）` : originalTime;

        const uniqueId = `${项目名称}|${实施时间}`;
        const isFull = 选课状态.includes('已满');
        const isExpired = 截止状态.includes('已截止');
        const isInvalid = isFull || isExpired;

        const locationMatch = LOCATION_FILTERS.length === 0
            ? true
            : LOCATION_FILTERS.some(filter => 开课地点?.includes(filter));
        const categoryMatch = CATEGORY_FILTERS.length === 0
            ? true
            : CATEGORY_FILTERS.some(filter => 项目类别 === filter);

        return {
            uniqueId,
            序号: isIndexInCol1 ? col1Text : col2Text,
            项目名称,
            项目类别: cleanText(row.querySelector(`td:nth-child(${4 + offset})`).textContent),
            开课地点,
            实施时间,
            选课截止时间: 截止状态,
            选课人数_容纳人数: 选课状态,
            授课教师: cleanText(row.querySelector(`td:nth-child(${15 + offset})`).textContent),
            isInvalid,
            locationMatch,
            categoryMatch
        };
    }

    function handleCoursePage() {
        console.log('[课程监控] 检测到选课页面，开始处理选课信息...');

        GM_setValue('loginFailStatus', false);
        GM_setValue('loginFailTime', 0);

        window.addEventListener('load', function() {
            const courseTable = document.getElementById('c_app_page_index_XuanKe_table');
            if (!courseTable) {
                console.error('[课程监控] 错误：未找到课程表格，请先登录系统');
                return;
            }
            const courseRows = courseTable.querySelectorAll('tbody .c--tr');
            if (courseRows.length === 0) {
                console.log('[课程监控] 提示：当前无课程数据或页面未加载完成');
                return;
            }

            let allCourses = Array.from(courseRows).map(row => extractCourseInfo(row));
            const validCourses = allCourses.filter(
                course => course.locationMatch && course.categoryMatch && !course.isInvalid);

            console.log('%c[课程监控] 符合推送条件的课程', 'color:#2E86AB; font-weight:bold;');
            console.log(`共 ${validCourses.length} 门`, validCourses);

            const storedUniqueIds = GM_getValue('pushedCourseUniqueIds', []);
            let pushedUniqueIds = new Set(storedUniqueIds);
            const newCourses = validCourses.filter(course => !pushedUniqueIds.has(course.uniqueId));

            // 清理过期课程
            const allCurrentUniqueIds = new Set(allCourses.map(c => c.uniqueId));
            const expiredUniqueIds = Array.from(pushedUniqueIds).filter(id => !allCurrentUniqueIds.has(id) ||
                allCourses.find(c => c.uniqueId === id)?.isInvalid ||
                !allCourses.find(c => c.uniqueId === id)?.locationMatch
            );
            expiredUniqueIds.forEach(id => pushedUniqueIds.delete(id));
            GM_setValue('pushedCourseUniqueIds', Array.from(pushedUniqueIds));

            // 推送新课程
            if (newCourses.length > 0) {
                console.log(`%c[课程监控] 发现 ${newCourses.length} 门新课程，准备推送`, 'color:green;');
                const formatToMarkdown = (courses) => {
                    let md = '| 序号 | 项目名称 | 项目类别 | 实施时间 | 开课地点 | 选课情况 | 教师 |\n';
                    md += '|------|----------|----------|----------|----------|----------|------|\n';
                    courses.forEach(course => {
                        md += `| ${course.序号} | ${course.项目名称} | ${course.项目类别} | ${course.实施时间} | ${course.开课地点} | ${course.选课人数_容纳人数} | ${course.授课教师} |\n`;
                    });
                    return md + `\n提取时间：${new Date().toLocaleString()}`;
                };
                pushToWechat(PUSH_TITLE, formatToMarkdown(newCourses));
                newCourses.forEach(course => pushedUniqueIds.add(course.uniqueId));
                GM_setValue('pushedCourseUniqueIds', Array.from(pushedUniqueIds));
            } else {
                console.log('[课程监控] 无新增课程');
            }

            // 定时刷新
            setTimeout(() => {
                console.log(`\n[课程监控] ${REFRESH_INTERVAL/1000/60}分钟后自动刷新...`);
                window.location.reload();
            }, REFRESH_INTERVAL);
        });
    }
    // ==============================================================

    // ==================== 主流程分发 ====================
    function handleMainLogic() {
        const currentUrl = window.location.href;
        if (currentUrl === "https://labor.seu.edu.cn/AuthServer/Login") {
            console.log('[登录重定向] 检测到旧登录页，跳转至统一身份认证...');
            window.location.href = LOGIN_LABOR_URL;
        } else if (currentUrl.includes('auth.seu.edu.cn/dist')) {
            if (window.location.hash === '#/dist/LoginSuccess') {
                console.log('%c[登录成功检测] 已匹配登录成功页面哈希路径，登录冷却标志（如果有）已清除', 'color: #4CAF50; font-weight: bold');
                clearTimeout(loginTimer);
                loginTimer = null;
                GM_setValue('loginFailStatus', false);
                GM_setValue('loginFailTime', 0);
            } else {
                handleLoginPage();
            }
        } else if (/^https:\/\/labor\.seu\.edu\.cn\/System\/Home/.test(currentUrl)) {
            handleLaborHomePage();
        } else if (currentUrl.includes('labor.seu.edu.cn/SJItemKaiKe/XuanKe/Index')) {
            handleCoursePage();
        }
    }

    // 初始加载时执行一次
    handleMainLogic();

    // 监听 hash 变化（前端路由切换时触发），重新执行主流程
    window.addEventListener('hashchange', () => {
        // 6. 当hash从LoginSuccess切换到登录页时，清除计时器
        if (!window.location.hash.includes('LoginSuccess') && loginTimer) {
            clearTimeout(loginTimer);
            loginTimer = null;
            console.log('[hash变化] 检测到离开登录成功页，已清除计时器');
        }
        handleMainLogic();
    });
    // ====================================================
})();
