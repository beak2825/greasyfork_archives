// ==UserScript==
// @name         考勤加班时长计算器
// @namespace    http://tampermonkey.net/
// @version      2.9.1
// @description  自动计算加班时长（支持弹性工作制、跨天加班、补签卡、历史记录查询、今日下班提醒、加班提醒、自动识别节假日和周末调休）
// @author       You
// @match        https://*/Home/PersonalHomePage/
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @connect      *
// @license MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/552893/%E8%80%83%E5%8B%A4%E5%8A%A0%E7%8F%AD%E6%97%B6%E9%95%BF%E8%AE%A1%E7%AE%97%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/552893/%E8%80%83%E5%8B%A4%E5%8A%A0%E7%8F%AD%E6%97%B6%E9%95%BF%E8%AE%A1%E7%AE%97%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[加班计算器] 脚本已加载');

    // 引入Bootstrap CSS
    const bootstrapCSS = document.createElement('link');
    bootstrapCSS.rel = 'stylesheet';
    bootstrapCSS.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';
    bootstrapCSS.integrity = 'sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN';
    bootstrapCSS.crossOrigin = 'anonymous';
    document.head.appendChild(bootstrapCSS);

    // 引入Bootstrap Icons
    const bootstrapIcons = document.createElement('link');
    bootstrapIcons.rel = 'stylesheet';
    bootstrapIcons.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css';
    document.head.appendChild(bootstrapIcons);

    console.log('[加班计算器] Bootstrap 资源已加载');

    // 获取当前站点的基础URL
    const BASE_URL = window.location.origin;
    console.log('[加班计算器] 站点基础URL:', BASE_URL);

    // 工作时间配置常量
    const WORK_CONFIG = {
        EARLIEST_START: '08:10',       // 最早上班时间
        LATEST_START: '09:00',         // 弹性上班截止时间
        WORK_HOURS: 8,                 // 纯工作时长（小时）
        LUNCH_BREAK: 1.5,              // 午休时长（小时）
        OVERTIME_BUFFER: 30,           // 加班缓冲时间（分钟）
        MAKEUP_CARD_THRESHOLD: '10:00' // 补签卡判定时间
    };

    // 时间常量
    const TIME_CONSTANTS = {
        CROSS_DAY_THRESHOLD: '06:00',  // 跨天判定时间（早于此时间算前一天）
        MINUTES_PER_DAY: 1440,         // 一天的分钟数（24小时）
        MINUTES_PER_HOUR: 60           // 一小时的分钟数
    };

    // 配置项
    const SETTINGS_KEY = 'overtime_calculator_settings';
    let settings = {
        // 下班提醒
        notifyEnabled: localStorage.getItem(SETTINGS_KEY + '_notify') === 'true',
        notified: false, // 是否已通知过（会话级别，刷新页面重置）

        // 加班提醒
        overtimeStartNotify: localStorage.getItem(SETTINGS_KEY + '_overtimeStartNotify') === 'true',
        overtimeStartNotified: false,

        // 加班周期提醒（每小时/半小时）
        overtimePeriodicNotify: localStorage.getItem(SETTINGS_KEY + '_overtimePeriodicNotify') || 'none', // 'none', 'hourly', 'halfHourly'
        lastOvertimePeriodicNotify: null, // 上次周期提醒时间

        // 加班目标时长提醒（小时）
        overtimeTargetHours: parseFloat(localStorage.getItem(SETTINGS_KEY + '_overtimeTargetHours')) || 0,
        overtimeTargetNotified: false
    };

    // 保存设置
    function saveSetting(key, value) {
        localStorage.setItem(SETTINGS_KEY + '_' + key, value);
        settings[key] = value;
    }

    // 用户活动检测
    let lastUserActivity = Date.now();
    let userIsActive = true;

    // 更新用户活动时间
    function updateUserActivity() {
        lastUserActivity = Date.now();
        userIsActive = true;
    }

    // 检查用户是否活跃（5分钟内有活动）
    function checkUserActive() {
        const inactiveThreshold = 5 * 60 * 1000; // 5分钟
        const timeSinceLastActivity = Date.now() - lastUserActivity;
        userIsActive = timeSinceLastActivity < inactiveThreshold;
        return userIsActive;
    }

    // 监听用户活动
    ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
        document.addEventListener(event, updateUserActivity, { passive: true });
    });

    console.log('[用户活动] 已启动用户活动监测');

    // 解析 C# JSON 日期格式 /Date(timestamp)/
    // eslint-disable-next-line no-unused-vars
    function parseJsonDate(dateStr) {
        if (!dateStr) return null;
        const match = dateStr.match(/\/Date\((\d+)\)\//);
        if (match) {
            return new Date(parseInt(match[1]));
        }
        return null;
    }

    // 从页面获取 user_uid
    function getUserUid() {
        console.log('[加班计算器] 尝试获取 user_uid');

        // 尝试多个可能的选择器
        const selectors = [
            'body > div.page-container > div.page-right.hidden.mini > div.page-header-container > div.nav-wrap.right > ul > li:nth-child(1) > a > span',
            'body > div.page-container > div.page-right > div.page-header-container > div.nav-wrap.right > ul > li:nth-child(1) > a > span',
            '.page-header-container .nav-wrap.right li:first-child a span',
            '.nav-wrap.right li:first-child a span'
        ];

        for (let selector of selectors) {
            const element = document.querySelector(selector);
            console.log(`[加班计算器] 尝试选择器: ${selector}, 找到元素:`, element);
            if (element) {
                const text = element.textContent.trim();
                console.log(`[加班计算器] 元素文本内容: "${text}"`);
                // 匹配格式: xxx(220000000)
                const match = text.match(/\((\d+)\)/);
                if (match) {
                    console.log(`[加班计算器] 成功提取 user_uid: ${match[1]}`);
                    return match[1];
                }
            }
        }

        console.error('[加班计算器] 无法找到 user_uid 元素');
        return null;
    }

    // 将时间字符串转换为分钟数（从00:00开始）
    function timeToMinutes(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    // 将分钟数转换为小时（保留2位小数）
    function minutesToHours(minutes) {
        return (minutes / 60).toFixed(2);
    }

    // 将分钟数转换为时间字符串 "HH:MM"
    function minutesToTimeString(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = Math.round(minutes % 60);
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    }

    // 获取当天排班工作小时（无数据时回退到配置）
    function getScheduledWorkHours(dateStr) {
        const cached = workdayCache.get(dateStr);
        if (cached && typeof cached.scheduledHours === 'number' && cached.scheduledHours > 0) {
            return cached.scheduledHours;
        }
        return WORK_CONFIG.WORK_HOURS;
    }

    // 基础工作分钟数（排班工作小时 + 午休）
    function getBaseWorkMinutes(dateStr) {
        const workHours = getScheduledWorkHours(dateStr);
        return (workHours + WORK_CONFIG.LUNCH_BREAK) * TIME_CONSTANTS.MINUTES_PER_HOUR;
    }

    // 根据实际开始工作时间计算应下班与加班开始分钟数（按日期使用排班小时）
    function computeLeaveAndOvertime(actualStartMinutes, dateStr) {
        const latestStart = timeToMinutes(WORK_CONFIG.LATEST_START); // 9:00 = 540分钟

        // 9:00之后打卡（迟到/请假）：固定18:30下班，19:00加班
        if (actualStartMinutes > latestStart) {
            const fixedLeaveTime = 18 * 60 + 30; // 18:30 = 1110分钟
            const fixedOvertimeStart = 19 * 60;  // 19:00 = 1140分钟
            return { leaveTime: fixedLeaveTime, overtimeStart: fixedOvertimeStart };
        }

        // 9:00及之前打卡（正常/弹性）：按实际时间+工作时长计算
        const leaveTime = actualStartMinutes + getBaseWorkMinutes(dateStr);
        const overtimeStart = leaveTime + WORK_CONFIG.OVERTIME_BUFFER;
        return { leaveTime, overtimeStart };
    }

    // 提取并排序某天的打卡时间，可选排除阈值之前的时间（分钟）
    function getSortedTimes(dayRecord, excludeBeforeMinutes) {
        if (!dayRecord || !dayRecord.LtData) return [];
        return dayRecord.LtData
            .map(r => ({ time: r.kqdata_time_text, minutes: r.kqdata_time_text ? timeToMinutes(r.kqdata_time_text) : null }))
            .filter(t => t.time && (typeof excludeBeforeMinutes !== 'number' || t.minutes >= excludeBeforeMinutes))
            .sort((a, b) => a.minutes - b.minutes);
    }

    // 获取阈值（分钟）之前的“凌晨早打卡”集合（用于跨天判断）
    function getEarlyTimes(dayRecord, thresholdMinutes) {
        if (!dayRecord || !dayRecord.LtData) return [];
        return dayRecord.LtData
            .map(r => ({ time: r.kqdata_time_text, minutes: r.kqdata_time_text ? timeToMinutes(r.kqdata_time_text) : null }))
            .filter(t => t.time && t.minutes < thresholdMinutes)
            .sort((a, b) => a.minutes - b.minutes);
    }

    // 判断是否为周末
    function isWeekend(dateStr) {
        const date = new Date(dateStr);
        const day = date.getDay();
        return day === 0 || day === 6; // 0=周日, 6=周六
    }

    // 全局缓存：缓存整个月的工作日/节假日信息
    // 结构: { "2025-10-17": { isHoliday: false, isWorkday: true, mx_kq_is_except: 2 }, ... }
    let workdayCache = new Map();

    // 获取指定日期范围的工作日/节假日信息
    async function fetchWorkdayInfo(userUid, beginDate, endDate) {
        return new Promise((resolve, reject) => {
            const params = `user_uid=${userUid}&begin_date=${beginDate}&end_date=${endDate}&zhangtao=C`;

            GM_xmlhttpRequest({
                method: 'POST',
                url: `${BASE_URL}/Attendance/AttendanceCenter/InitMonthAttendanceDetailData/`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                data: params,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        resolve(data);
                    } catch (e) {
                        console.error('[工作日信息] JSON解析失败:', e, '响应:', response.responseText?.substring(0, 200));
                        reject(new Error('解析工作日信息失败，请稍后重试'));
                    }
                },
                onerror: function(error) {
                    console.error('[工作日信息] 网络请求失败:', error);
                    reject(new Error('网络请求失败，请检查网络连接'));
                }
            });
        });
    }

    // 加载并缓存整个月的工作日信息
    async function loadMonthWorkdayInfo(userUid, beginDate, endDate) {
        console.log(`[工作日信息] 加载月份工作日信息: ${beginDate} 到 ${endDate}`);

        try {
            const result = await fetchWorkdayInfo(userUid, beginDate, endDate);

            // 解析数据并存入缓存
            if (result && result._MxList && result._MxList.length > 0) {
                result._MxList.forEach(item => {
                    const dateStr = item.mx_rq; // 格式: "2025-10-18"
                    const code = item.mx_kq_is_except; // 0=非工作日；其余由账套定义
                    const scheduledHours = parseFloat(item.mx_sbgs || 0); // 当天排班小时数（>0 表示工作日/调休）

                    // 判定规则：优先用 mx_sbgs 是否>0 来判断工作日；若没有排班信息，再回退 code。
                    const isWorkday = (scheduledHours > 0) || (code !== 0);
                    const isHoliday = (scheduledHours === 0) && (code === 0);

                    workdayCache.set(dateStr, {
                        isHoliday,
                        isWorkday,
                        mx_kq_is_except: code,
                        scheduledHours
                    });

                    console.log(`[工作日信息] ${dateStr}: sbgs=${scheduledHours}, code=${code}, 节假日=${isHoliday}, 工作日=${isWorkday}`);
                });

                console.log(`[工作日信息] 已缓存 ${result._MxList.length} 天的工作日信息`);
            }
        } catch (error) {
            console.error('[工作日信息] 加载失败:', error);
        }
    }

    // 加载并缓存单天工作日信息（用于今日下班提醒）
    async function loadTodayWorkdayInfo(userUid, dateStr) {
        // 如果已经缓存了当天数据，直接返回
        if (workdayCache.has(dateStr)) {
            console.log(`[工作日信息] 使用缓存: ${dateStr}`);
            return;
        }

        console.log(`[工作日信息] 加载单天工作日信息: ${dateStr}`);

        try {
            const result = await fetchWorkdayInfo(userUid, dateStr, dateStr);

            // 解析数据
            if (result && result._MxList && result._MxList.length > 0) {
                const item = result._MxList[0];
                const code = item.mx_kq_is_except;
                const scheduledHours = parseFloat(item.mx_sbgs || 0);
                const isWorkday = (scheduledHours > 0) || (code !== 0);
                const isHoliday = (scheduledHours === 0) && (code === 0);

                workdayCache.set(dateStr, {
                    isHoliday,
                    isWorkday,
                    mx_kq_is_except: code,
                    scheduledHours
                });

                console.log(`[工作日信息] ${dateStr}: sbgs=${scheduledHours}, code=${code}, 节假日=${isHoliday}, 工作日=${isWorkday}`);
            }
        } catch (error) {
            console.error('[工作日信息] 加载失败:', error);
        }
    }

    // 清空工作日缓存（用于切换月份时）
    function clearWorkdayCache() {
        workdayCache.clear();
        console.log('[工作日信息] 缓存已清空');
    }

    // 判断是否为节假日（优先使用接口数据，其次判断周末）
    function isHoliday(dateStr) {
        const cached = workdayCache.get(dateStr);
        if (cached) {
            // 节假日：无排班(scheduledHours=0) 且 接口标记为0
            return cached.scheduledHours === 0 && cached.mx_kq_is_except === 0;
        }
        // 无缓存：不贸然判为节假日
        return false;
    }

    // 判断是否为工作日
    // eslint-disable-next-line no-unused-vars
    function isWorkday(dateStr) {
        const cached = workdayCache.get(dateStr);
        if (cached) {
            // 优先：有排班即工作日；其次：接口非0也按工作日
            return (cached.scheduledHours > 0) || (cached.mx_kq_is_except !== 0);
        }
        // 无缓存：周一到周五默认工作日
        const date = new Date(dateStr);
        const day = date.getDay();
        return day >= 1 && day <= 5;
    }

    // 判断是否为非工作日（节假日或周末）
    function isNonWorkingDay(dateStr) {
        const cached = workdayCache.get(dateStr);
        if (cached) {
            // 有排班：一定是工作日
            if (cached.scheduledHours > 0) return false;
            // 无排班且接口标记0：非工作日（周末/节假日）
            if (cached.mx_kq_is_except === 0) return true;
        }
        // 无缓存：退化到“是否周末”
        return isWeekend(dateStr);
    }

    /**
     * 分析打卡状态（正常/弹性/迟到/补签卡）
     * @param {number} checkInMinutes - 打卡时间（分钟数）
     * @returns {{
     *   type: string,           // 类型: 'normal'|'flexible'|'late'|'makeup'
     *   actualStart: number,    // 实际开始工作时间（分钟数）
     *   lateMinutes: number,    // 迟到分钟数
     *   isLate: boolean,        // 是否迟到
     *   isMakeupCard: boolean,  // 是否补签卡
     *   status: string          // 状态描述
     * }}
     */
    function analyzeCheckInStatus(checkInMinutes) {
        const earliestStart = timeToMinutes(WORK_CONFIG.EARLIEST_START);
        const latestStart = timeToMinutes(WORK_CONFIG.LATEST_START);
        const makeupThreshold = timeToMinutes(WORK_CONFIG.MAKEUP_CARD_THRESHOLD);

        if (checkInMinutes > latestStart) {
            // 9:00之后打卡，都算迟到（固定下班时间18:30）
            const lateMinutes = checkInMinutes - latestStart;  // 相对于9:00计算迟到时间
            const isMakeup = checkInMinutes >= makeupThreshold;  // 10点及以后算补签卡

            return {
                type: 'late',
                actualStart: checkInMinutes,  // 使用实际打卡时间，触发固定下班时间逻辑
                lateMinutes: lateMinutes,
                isLate: true,  // 9:00之后都算迟到
                isMakeupCard: isMakeup,  // 10:00之后标记为补签卡
                status: isMakeup ? '补签卡' : `迟到${Math.round(lateMinutes)}分钟`
            };
        } else if (checkInMinutes > earliestStart) {
            // 8:10-9:00之间打卡，弹性上班
            return {
                type: 'flexible',
                actualStart: checkInMinutes,
                lateMinutes: checkInMinutes - earliestStart,
                isLate: false,
                isMakeupCard: false,
                status: '弹性上班'
            };
        } else {
            // 8:10之前打卡，正常，但按8:10算（弹性工作制规则）
            return {
                type: 'normal',
                actualStart: earliestStart,  // 使用8:10，不是实际打卡时间
                lateMinutes: 0,
                isLate: false,
                isMakeupCard: false,
                status: '正常'
            };
        }
    }

    // 解析完整时间（包含日期和时间）返回Date对象
    // eslint-disable-next-line no-unused-vars
    function parseFullDateTime(dateText, timeText) {
        // dateText 格式: "2025-10-17"
        // timeText 格式: "13:46" 或 "00:13"
        const [year, month, day] = dateText.split('-').map(Number);
        const [hours, minutes] = timeText.split(':').map(Number);
        return new Date(year, month - 1, day, hours, minutes);
    }

    // 计算单日加班时长（考虑跨天和补签卡）- 返回详细信息
    function calculateDailyOvertime(dayRecord, allRecords) {
        if (!dayRecord.LtData || dayRecord.LtData.length === 0) {
            return null;
        }

        const currentDate = dayRecord.kq_date; // 例如 "2025-10-16"

        const crossDayThreshold = timeToMinutes(TIME_CONSTANTS.CROSS_DAY_THRESHOLD);

        // 检查前一天是否有跨天加班（如果有，当天6点前的打卡应该被忽略）
        const prevDayRecord = findPrevDayRecord(currentDate, allRecords);
        let prevDayHasCrossDay = false;
        if (prevDayRecord && prevDayRecord.LtData) {
            // 检查前一天是否有第二天凌晨的打卡
            const nextOfPrev = findNextDayRecord(prevDayRecord.kq_date, allRecords);
            if (nextOfPrev && nextOfPrev.kq_date === currentDate) {
                const hasEarlyPunch = dayRecord.LtData.some(r =>
                    r.kqdata_time_text && timeToMinutes(r.kqdata_time_text) < crossDayThreshold
                );
                if (hasEarlyPunch) {
                    prevDayHasCrossDay = true;
                }
            }
        }

        // 获取当天所有打卡时间并排序，排除前一天跨天加班的打卡记录
        const todayTimes = getSortedTimes(dayRecord, prevDayHasCrossDay ? crossDayThreshold : undefined);

        if (todayTimes.length === 0) {
            return null;
        }

        // 寻找第二天凌晨的打卡记录（跨天加班）
        const nextDayRecord = findNextDayRecord(currentDate, allRecords);
        let nextDayEarlyTimes = [];
        let isCrossDay = false;
        if (nextDayRecord) {
            // 只取6点之前的打卡（算作前一天加班）
            nextDayEarlyTimes = getEarlyTimes(nextDayRecord, crossDayThreshold);
        }

        // 上班打卡时间
        const firstTime = todayTimes[0];

        // 判断是否为非工作日（节假日或周末）
        const isNonWorking = isNonWorkingDay(currentDate);

        // 下班打卡时间：优先取第二天凌晨的，否则取当天最晚的
        // 工作日需要判断是否达到预期下班时间
        let lastTime;
        let hasCheckOut = true;  // 是否有下班打卡记录

        if (nextDayEarlyTimes.length > 0) {
            // 跨天了，取第二天最晚的凌晨打卡时间，加上24小时转换为当天的分钟数
            isCrossDay = true;
            const nextDayLast = nextDayEarlyTimes[nextDayEarlyTimes.length - 1];
            lastTime = {
                time: nextDayLast.time,
                displayTime: `次日 ${nextDayLast.time}`,
                minutes: nextDayLast.minutes + TIME_CONSTANTS.MINUTES_PER_DAY
            };
        } else if (todayTimes.length === 1) {
            // 只有一条打卡记录，说明还没下班
            hasCheckOut = false;
            lastTime = {
                time: firstTime.time,
                displayTime: '-',  // 显示为横线表示未打卡
                minutes: firstTime.minutes  // 临时使用上班时间，后续不会用于加班计算
            };
        } else {
            // 有多次打卡，取最后一次
            const lastPunchTime = todayTimes[todayTimes.length - 1];

            // 工作日：需要判断最后一次打卡是否达到预期下班时间
            if (!isNonWorking) {
                // 先计算预期下班时间（需要先分析打卡状态）
                const checkInStatus = analyzeCheckInStatus(firstTime.minutes);
                const { leaveTime } = computeLeaveAndOvertime(checkInStatus.actualStart, currentDate);

                // 检查最后一次打卡是否达到预期下班时间
                if (lastPunchTime.minutes < leaveTime) {
                    // 还没到下班时间，不算下班
                    hasCheckOut = false;
                    lastTime = {
                        time: lastPunchTime.time,
                        displayTime: '-',  // 显示为横线表示未下班
                        minutes: lastPunchTime.minutes
                    };
                } else {
                    // 已达到下班时间
                    lastTime = {
                        time: lastPunchTime.time,
                        displayTime: lastPunchTime.time,
                        minutes: lastPunchTime.minutes
                    };
                }
            } else {
                // 非工作日：最后一次打卡就算下班
                lastTime = {
                    time: lastPunchTime.time,
                    displayTime: lastPunchTime.time,
                    minutes: lastPunchTime.minutes
                };
            }
        }

        // 非工作日：全天算加班，根据时间扣除午休和晚饭
        if (isNonWorking) {
            let overtimeMinutes = 0;
            let hasOvertime = false;

            if (hasCheckOut) {
                const totalWorkMinutes = lastTime.minutes - firstTime.minutes;

                // 判断是否需要扣除午休时间（中午12点 = 720分钟）
                const noonMinutes = 12 * TIME_CONSTANTS.MINUTES_PER_HOUR;  // 12:00
                const needDeductLunch = lastTime.minutes > noonMinutes;  // 超过中午12点才扣除午休

                // 判断是否需要扣除晚饭时间（晚上6点半 = 1110分钟，18:30）
                const eveningMinutes = 18 * TIME_CONSTANTS.MINUTES_PER_HOUR + 30;  // 18:30
                const needDeductDinner = lastTime.minutes > eveningMinutes;  // 超过晚上6点半才扣除晚饭

                // 扣除时间：午休1.5小时 + 晚饭0.5小时
                const lunchBreakMinutes = needDeductLunch ? WORK_CONFIG.LUNCH_BREAK * TIME_CONSTANTS.MINUTES_PER_HOUR : 0;  // 90分钟或0
                const dinnerBreakMinutes = needDeductDinner ? WORK_CONFIG.OVERTIME_BUFFER : 0;  // 30分钟或0
                const totalDeductMinutes = lunchBreakMinutes + dinnerBreakMinutes;

                overtimeMinutes = Math.max(0, totalWorkMinutes - totalDeductMinutes);
                hasOvertime = overtimeMinutes > 0;

                console.log(`[加班计算器] ${currentDate} (非工作日) 上班: ${firstTime.time}, 下班: ${lastTime.displayTime}, 总时长: ${minutesToHours(totalWorkMinutes)}小时, 扣除午休(${needDeductLunch ? '1.5h' : '0h'})+晚饭(${needDeductDinner ? '0.5h' : '0h'})后加班: ${minutesToHours(overtimeMinutes)}小时`);
            } else {
                console.log(`[加班计算器] ${currentDate} (非工作日) 上班: ${firstTime.time}, 下班: 未打卡，不计算加班`);
            }

            // 判定当天类型（节假日/周末/非工作日）
            let dayType = '非工作日';
            if (isHoliday(currentDate)) {
                dayType = '节假日';
            } else if (isWeekend(currentDate)) {
                dayType = '周末';
            }

            return {
                date: currentDate,
                dayOfWeek: dayRecord.day_week,
                checkIn: firstTime.time,
                checkOut: lastTime.displayTime,
                hasCheckOut: hasCheckOut,  // 是否有下班打卡
                isLate: false,  // 非工作日不算迟到
                isMakeupCard: false,  // 非工作日不算补签
                lateMinutes: 0,
                hasOvertime: hasOvertime,
                isCrossDay: isCrossDay,
                overtimeMinutes: overtimeMinutes,
                overtimeHours: minutesToHours(overtimeMinutes),
                scheduledHours: getScheduledWorkHours(currentDate) || 0,
                dayType: dayType
            };
        }

        // 工作日：按原逻辑计算加班
        // 分析打卡状态
        const checkInStatus = analyzeCheckInStatus(firstTime.minutes);

        // 调试输出：检查迟到情况下的时间
        if (checkInStatus.isLate) {
            console.log(`[加班计算器DEBUG] ${currentDate} 迟到打卡 - 原始时间: ${firstTime.time}, 分钟数: ${firstTime.minutes}, actualStart: ${checkInStatus.actualStart}, 迟到分钟: ${checkInStatus.lateMinutes}`);
        }

        // 计算应下班时间与加班开始时间（使用当天排班小时）
        const { leaveTime: adjustedEnd, overtimeStart } = computeLeaveAndOvertime(checkInStatus.actualStart, currentDate);

        // 计算加班时长（只有在有下班打卡时才计算）
        let overtimeMinutes = 0;
        let hasOvertime = false;
        if (hasCheckOut && lastTime.minutes > overtimeStart) {
            overtimeMinutes = lastTime.minutes - overtimeStart;
            hasOvertime = true;
            console.log(`[加班计算器] ${currentDate} (工作日) 上班: ${firstTime.time}, 下班: ${lastTime.displayTime}, 加班: ${minutesToHours(overtimeMinutes)}小时`);
        } else if (!hasCheckOut) {
            console.log(`[加班计算器] ${currentDate} (工作日) 上班: ${firstTime.time}, 下班: 未打卡，不计算加班`);
        }

        // 判定当天类型（工作日/调休工作日）
        let dayType = '工作日';
        if (isWeekend(currentDate) && isWorkday(currentDate)) {
            dayType = '调休工作日';
        }

        // 调试输出：确认返回的checkIn值
        if (checkInStatus.isLate) {
            console.log(`[加班计算器DEBUG] ${currentDate} 返回值 checkIn 字段: ${firstTime.time}`);
        }

        return {
            date: currentDate,
            dayOfWeek: dayRecord.day_week,
            checkIn: firstTime.time,
            checkOut: lastTime.displayTime,
            hasCheckOut: hasCheckOut,  // 是否有下班打卡
            isLate: checkInStatus.isLate,
            isMakeupCard: checkInStatus.isMakeupCard,
            lateMinutes: checkInStatus.lateMinutes,
            hasOvertime: hasOvertime,
            isCrossDay: isCrossDay,
            overtimeMinutes: overtimeMinutes,
            overtimeHours: minutesToHours(overtimeMinutes),
            expectedLeave: minutesToTimeString(adjustedEnd),
            overtimeStartTime: minutesToTimeString(overtimeStart),
            scheduledHours: getScheduledWorkHours(currentDate),
            dayType: dayType
        };
    }

    /**
     * 查找指定日期偏移量的考勤记录
     * @param {string} currentDate - 当前日期 (YYYY-MM-DD)
     * @param {Array} allRecords - 所有考勤记录
     * @param {number} dayOffset - 日期偏移量（-1=前一天, 1=后一天）
     * @returns {Object|undefined} 考勤记录或undefined
     */
    function findDayRecord(currentDate, allRecords, dayOffset) {
        const current = new Date(currentDate);
        const targetDay = new Date(current);
        targetDay.setDate(current.getDate() + dayOffset);
        const targetDayStr = targetDay.toISOString().split('T')[0];
        return allRecords.find(r => r.kq_date === targetDayStr);
    }

    // 查找前一天的考勤记录
    function findPrevDayRecord(currentDate, allRecords) {
        return findDayRecord(currentDate, allRecords, -1);
    }

    // 查找第二天的考勤记录
    function findNextDayRecord(currentDate, allRecords) {
        return findDayRecord(currentDate, allRecords, 1);
    }

    // 获取单页考勤数据
    function fetchAttendanceDataPage(userUid, beginDate, endDate, pageNum, pageSize) {
        return new Promise((resolve, reject) => {
            const params = `begin_date=${beginDate}&end_date=${endDate}&user_uid=${userUid}&order=1&page_num=${pageNum}&page_size=${pageSize}`;

            GM_xmlhttpRequest({
                method: 'POST',
                url: `${BASE_URL}/Attendance/Record/GetUserDayAttendancePhotoRecordPageObjs/`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                data: params,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        resolve(data);
                    } catch (e) {
                        console.error('[考勤数据] JSON解析失败:', e, '响应:', response.responseText?.substring(0, 200));
                        reject(new Error('解析考勤数据失败，请稍后重试'));
                    }
                },
                onerror: function(error) {
                    console.error('[考勤数据] 网络请求失败:', error);
                    reject(new Error('网络请求失败，请检查网络连接'));
                }
            });
        });
    }

    // 获取所有考勤数据（自动分页）
    async function fetchAllAttendanceData(userUid, beginDate, endDate) {
        const pageSize = 10; // 每页10条（天）
        let pageNum = 1;
        let allData = [];

        while (true) {
            console.log(`正在获取第 ${pageNum} 页数据...`);
            const pageData = await fetchAttendanceDataPage(userUid, beginDate, endDate, pageNum, pageSize);

            if (!pageData || pageData.length === 0) {
                // 没有更多数据了
                break;
            }

            allData = allData.concat(pageData);

            // 如果返回的数据少于 pageSize，说明已经是最后一页
            if (pageData.length < pageSize) {
                break;
            }

            pageNum++;
        }

        console.log(`共获取 ${allData.length} 天的考勤数据`);
        return allData;
    }

    // 获取今天的打卡信息并计算下班时间
    async function getTodayLeaveTime(userUid) {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0]; // 格式: "2025-10-17"

        console.log(`[今日下班] 查询今天的打卡记录: ${todayStr}`);

        // 先加载工作日信息
        await loadTodayWorkdayInfo(userUid, todayStr);

        try {
            const data = await fetchAllAttendanceData(userUid, todayStr, todayStr);

            if (!data || data.length === 0) {
                console.log('[今日下班] 今天没有打卡记录');
                return {
                    hasRecord: false,
                    message: '今天还没有打卡记录'
                };
            }

            const todayRecord = data[0];
            const isNonWorking = isNonWorkingDay(todayStr);

            console.log(`[今日下班] 是否非工作日: ${isNonWorking}`);

            if (!todayRecord.LtData || todayRecord.LtData.length === 0) {
                return {
                    hasRecord: false,
                    message: '今天还没有打卡记录'
                };
            }

            // 获取今天的所有打卡时间，排除凌晨6点前的打卡（可能是昨天的下班）
            const crossDayThreshold = timeToMinutes(TIME_CONSTANTS.CROSS_DAY_THRESHOLD);
            // 获取所有打卡时间（包括凌晨的）
            const allTimes = getSortedTimes(todayRecord);
            // 过滤掉凌晨6点前的打卡（这些应该是昨天跨天加班的下班打卡）
            const validTimes = getSortedTimes(todayRecord, crossDayThreshold).map(t => t.time);

            if (validTimes.length === 0) {
                // 如果没有6点后的打卡，说明今天还没有正式上班
                // 但有凌晨打卡，说明是昨天加班到今天
                if (allTimes.length > 0) {
                    return {
                        hasRecord: false,
                        message: '凌晨打卡记录为昨日加班，今天还未上班'
                    };
                }
                return {
                    hasRecord: false,
                    message: '今天还没有打卡记录'
                };
            }

            const firstTime = validTimes[0];
            const firstTimeMinutes = timeToMinutes(firstTime);

            console.log(`[今日下班] 上班打卡: ${firstTime}`);

            if (isNonWorking) {
                // 非工作日：全天算加班，下班就是加班
                let dayType = '周末';
                if (isHoliday(todayStr)) {
                    dayType = '节假日';
                } else if (isWeekend(todayStr)) {
                    dayType = '周末';
                }

                return {
                    hasRecord: true,
                    checkInTime: firstTime,
                    isNonWorkingDay: true,
                    message: `今天是${dayType}，全天算加班`,
                    dayType: dayType
                };
            }

            // 工作日：计算应下班时间
            const checkInStatus = analyzeCheckInStatus(firstTimeMinutes);

            const { leaveTime, overtimeStart } = computeLeaveAndOvertime(checkInStatus.actualStart, todayStr);

            return {
                hasRecord: true,
                checkInTime: firstTime,
                isNonWorkingDay: false,
                leaveTime: minutesToTimeString(leaveTime),
                overtimeStart: minutesToTimeString(overtimeStart),
                status: checkInStatus.status,
                actualStartMinutes: checkInStatus.actualStart
            };

        } catch (error) {
            console.error('[今日下班] 获取数据失败:', error);
            return {
                hasRecord: false,
                error: true,
                message: '获取打卡信息失败'
            };
        }
    }

    // 计算总加班时长
    function calculateTotalOvertime(attendanceData) {
        let totalOvertimeMinutes = 0;
        const dailyDetails = [];
        const processedDates = new Set(); // 记录已处理的日期，避免重复计算

        attendanceData.forEach((dayRecord) => {
            const currentDate = dayRecord.kq_date;

            // 如果这一天已经作为"第二天"被前一天计算过了，跳过
            if (processedDates.has(currentDate)) {
                console.log(`[加班计算器] ${currentDate} 已作为跨天加班计算过，跳过`);
                return;
            }

            const dayInfo = calculateDailyOvertime(dayRecord, attendanceData);
            if (dayInfo) {
                // 累计加班时长
                if (dayInfo.hasOvertime) {
                    totalOvertimeMinutes += dayInfo.overtimeMinutes;
                }

                // 添加到详情列表（显示所有有打卡记录的天）
                dailyDetails.push(dayInfo);

                // 检查是否使用了第二天的凌晨打卡
                if (dayInfo.isCrossDay) {
                    const nextDayRecord = findNextDayRecord(currentDate, attendanceData);
                    if (nextDayRecord) {
                        processedDates.add(nextDayRecord.kq_date);
                        console.log(`[加班计算器] 标记 ${nextDayRecord.kq_date} 为已处理（跨天加班）`);
                    }
                }
            }
        });

        return {
            totalHours: minutesToHours(totalOvertimeMinutes),
            totalMinutes: totalOvertimeMinutes,
            dailyDetails: dailyDetails
        };
    }

    // 创建显示面板（Bootstrap版）
    function createDisplayPanel() {
        const panel = document.createElement('div');
        panel.id = 'overtime-panel';
        panel.className = 'card shadow-lg';
        panel.style.cssText = `
            position: fixed !important;
            top: 80px !important;
            right: 20px !important;
            width: 520px !important;
            max-width: calc(100vw - 40px) !important;
            z-index: 999999 !important;
            display: block !important;
        `;
        panel.innerHTML = `
            <!-- 卡片头部 -->
            <div class="card-header bg-white border-bottom d-flex justify-content-between align-items-center" style="padding: 12px 16px;">
                <h6 class="mb-0 fw-bold text-dark">
                    <i class="bi bi-clock-history me-2" style="color: #667eea;"></i>加班时长统计
                </h6>
                <button id="close-overtime-panel" type="button" class="btn-close" aria-label="Close"></button>
            </div>

            <!-- 卡片主体 -->
            <div class="card-body p-2">
                <!-- 月份选择器 - 优化布局 -->
                <div class="d-flex align-items-center gap-2 mb-2" role="group">
                    <button id="prev-month-btn" type="button" class="btn btn-sm btn-outline-secondary px-2 py-1" title="上个月">
                        <i class="bi bi-chevron-left"></i>
                    </button>
                    <select id="month-selector" class="form-select form-select-sm" style="flex: 1; font-size: 13px;">
                    </select>
                    <button id="next-month-btn" type="button" class="btn btn-sm btn-outline-secondary px-2 py-1" title="下个月">
                        <i class="bi bi-chevron-right"></i>
                    </button>
                    <button id="current-month-btn" type="button" class="btn btn-sm btn-primary px-2 py-1" title="返回本月">
                        <i class="bi bi-calendar-month me-1"></i>本月
                    </button>
                </div>

                <!-- 内容区域 -->
                <div id="overtime-content">
                    <div class="text-center py-4">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="text-muted mt-2">正在加载数据...</p>
                    </div>
                </div>

                <!-- 今日下班时间卡片 -->
                <div id="today-leave-time-card" class="alert alert-success mb-0 mt-2" style="display: none; padding: 6px 10px;" role="alert">
                    <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-calendar-check me-2"></i>
                        <strong class="small">今日下班时间</strong>
                    </div>
                    <div id="leave-time-content" class="h4 mb-1"></div>
                    <div id="leave-time-detail" class="small"></div>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
        console.log('[加班计算器] Bootstrap面板已创建并添加到页面');

        // 关闭按钮事件
        const closeBtn = document.getElementById('close-overtime-panel');
        closeBtn.addEventListener('click', () => {
            panel.style.display = 'none';
            // 显示唤醒按钮
            const toggleBtn = document.getElementById('overtime-toggle-btn');
            if (toggleBtn) {
                toggleBtn.style.display = 'flex';
            }
            console.log('[加班计算器] 面板已关闭');
        });

        return panel;
    }

    // 创建唤醒按钮（固定在右上角）
    function createToggleButton() {
        const button = document.createElement('div');
        button.id = 'overtime-toggle-btn';
        button.style.cssText = `
            position: fixed !important;
            top: 80px !important;
            right: 20px !important;
            width: 50px !important;
            height: 50px !important;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            border-radius: 50% !important;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4) !important;
            cursor: pointer !important;
            z-index: 999998 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 24px !important;
            color: white !important;
            transition: all 0.3s ease !important;
            user-select: none !important;
        `;
        button.innerHTML = '<i class="bi bi-clock-history"></i>';
        button.title = '打开加班统计面板';

        // 悬停效果
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
            button.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
        });

        // 点击打开面板
        button.addEventListener('click', () => {
            const panel = document.getElementById('overtime-panel');
            if (panel) {
                panel.style.display = 'block';
                button.style.display = 'none';
                console.log('[加班计算器] 面板已打开');
            }
        });

        document.body.appendChild(button);
        console.log('[加班计算器] 唤醒按钮已创建');
        return button;
    }

    // 初始化月份选择器
    function initMonthSelector(currentYear, currentMonth) {
        const selector = document.getElementById('month-selector');
        selector.innerHTML = '';

        // API限制：只能查询本月和上个月的数据
        const today = new Date();
        const thisYear = today.getFullYear();
        const thisMonth = today.getMonth() + 1;

        // 计算上个月
        const lastMonth = new Date(thisYear, thisMonth - 2, 1); // -2 因为 getMonth() 是 0-11
        const lastYear = lastMonth.getFullYear();
        const lastMonthNum = lastMonth.getMonth() + 1;

        // 只生成本月和上月两个选项
        const options = [
            { year: lastYear, month: lastMonthNum, label: `${lastYear}年${lastMonthNum}月（上月）` },
            { year: thisYear, month: thisMonth, label: `${thisYear}年${thisMonth}月（本月）` }
        ];

        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = `${opt.year}-${String(opt.month).padStart(2, '0')}`;
            option.textContent = opt.label;
            if (opt.year === currentYear && opt.month === currentMonth) {
                option.selected = true;
            }
            selector.appendChild(option);
        });

        console.log(`[加班计算器] 月份选择器已初始化，可查询: 本月(${thisYear}-${thisMonth}) 和 上月(${lastYear}-${lastMonthNum})`);
    }

    // 当前正在加载的请求ID（防止并发请求导致数据错乱）
    let currentLoadingRequestId = 0;

    // 加载指定月份的数据
    async function loadMonthData(userUid, year, month) {
        // 生成唯一请求ID
        const requestId = ++currentLoadingRequestId;

        console.log(`[加班计算器] ========== 开始加载月份数据 (请求ID: ${requestId}) ==========`);
        console.log(`[加班计算器] 请求参数: userUid=${userUid}, year=${year}, month=${month}`);

        const content = document.getElementById('overtime-content');
        console.log('[加班计算器] 找到内容容器:', content ? 'YES' : 'NO');
        content.innerHTML = '<p style="text-align: center; color: #666; padding: 20px 0;">正在加载数据...</p>';

        const firstDay = `${year}-${String(month).padStart(2, '0')}-01`;
        const lastDay = new Date(year, month, 0);
        const endDay = `${year}-${String(month).padStart(2, '0')}-${String(lastDay.getDate()).padStart(2, '0')}`;

        console.log(`[加班计算器] 日期范围: ${firstDay} 到 ${endDay}`);

        try {
            // 并行加载考勤数据和工作日信息
            const [data] = await Promise.all([
                fetchAllAttendanceData(userUid, firstDay, endDay),
                loadMonthWorkdayInfo(userUid, firstDay, endDay)
            ]);

            // 检查是否被更新的请求覆盖（防止旧请求的数据覆盖新请求）
            if (requestId !== currentLoadingRequestId) {
                console.log(`[加班计算器] 请求ID ${requestId} 已过期，当前请求ID: ${currentLoadingRequestId}，忽略此次结果`);
                return;
            }

            console.log(`[加班计算器] API返回数据量: ${data.length} 天`);
            console.log('[加班计算器] 前3条数据:', data.slice(0, 3));

            // 验证返回的数据日期范围是否匹配
            if (data.length > 0) {
                const firstDataDate = data[0].kq_date;
                const expectedMonth = String(month).padStart(2, '0');
                const actualMonth = firstDataDate.substring(5, 7);
                const actualYear = firstDataDate.substring(0, 4);
                console.log(`[加班计算器] 期望月份: ${year}-${expectedMonth}, 实际数据月份: ${firstDataDate.substring(0, 7)}`);

                if (actualMonth !== expectedMonth || actualYear !== String(year)) {
                    console.warn(`[加班计算器] [表情] 警告: API返回的数据月份(${actualYear}-${actualMonth})与请求月份(${year}-${expectedMonth})不匹配！`);

                    // 显示提示信息给用户
                    content.innerHTML = `
                        <div style="text-align: center; padding: 40px 20px;">
                            <div style="font-size: 48px; margin-bottom: 20px;">[表情]</div>
                            <div style="font-size: 16px; color: #ff9800; margin-bottom: 10px; font-weight: bold;">
                                系统限制提示
                            </div>
                            <div style="font-size: 14px; color: #666; line-height: 1.6;">
                                考勤系统只能查询上个月及之前的数据<br>
                                您请求的是 <strong>${year}年${month}月</strong><br>
                                但系统返回的是 <strong>${actualYear}年${parseInt(actualMonth)}月</strong> 的数据<br><br>
                                <span style="color: #999; font-size: 12px;">
                                    请选择上个月或更早的月份查询
                                </span>
                            </div>
                        </div>
                    `;
                    return;
                }
            } else {
                // 没有数据的情况
                content.innerHTML = `
                    <div style="text-align: center; padding: 40px 20px;">
                        <div style="font-size: 48px; margin-bottom: 20px;">[表情]</div>
                        <div style="font-size: 16px; color: #666; margin-bottom: 10px;">
                            暂无考勤数据
                        </div>
                        <div style="font-size: 14px; color: #999;">
                            ${year}年${month}月 没有找到考勤记录
                        </div>
                    </div>
                `;
                return;
            }

            const result = calculateTotalOvertime(data);
            console.log(`[加班计算器] 计算结果: 总时长=${result.totalHours}h, 详情条数=${result.dailyDetails.length}`);
            console.log('[加班计算器] 前3条详情:', result.dailyDetails.slice(0, 3));

            const monthStr = `${year}年${month}月`;
            console.log(`[加班计算器] 准备更新显示: ${monthStr}`);
            updateDisplayContent(result, monthStr);
            console.log(`[加班计算器] ========== 完成加载月份数据 (请求ID: ${requestId}) ==========`);
        } catch (error) {
            // 同样检查请求是否过期
            if (requestId !== currentLoadingRequestId) {
                console.log(`[加班计算器] 请求ID ${requestId} 错误处理被跳过（已过期）`);
                return;
            }

            console.error('[加班计算器] 获取数据失败:', error);
            content.innerHTML = `<p style="color: red; text-align: center;">加载失败: ${error.message}</p>`;
        }
    }

    // 显示浏览器通知（仅在用户活跃时）
    function showNotification(title, message, force = false) {
        // 检查用户是否活跃
        if (!force && !checkUserActive()) {
            console.log('[通知] 用户不活跃，跳过通知:', title);
            return false;
        }

        if (typeof GM_notification !== 'undefined') {
            GM_notification({
                title: title,
                text: message,
                timeout: 10000 // 10秒后自动关闭
            });
            console.log('[通知] 已发送通知:', title, message);
            return true;
        } else {
            console.warn('[通知] GM_notification 不可用');
            return false;
        }
    }

    // 定时器ID存储
    let notificationTimers = {
        leaveTime: null,
        overtimeStart: null,
        overtimePeriodic: null,
        overtimeTarget: null
    };

    // 清除所有定时器
    function clearAllNotificationTimers() {
        Object.keys(notificationTimers).forEach(key => {
            if (notificationTimers[key]) {
                clearTimeout(notificationTimers[key]);
                notificationTimers[key] = null;
            }
        });
        console.log('[定时器] 所有提醒定时器已清除');
    }

    // 设置下班时间提醒
    function scheduleLeaveTimeNotification(todayInfo) {
        if (!settings.notifyEnabled || settings.notified) {
            return;
        }

        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        const [leaveHour, leaveMin] = todayInfo.leaveTime.split(':').map(Number);
        const leaveMinutes = leaveHour * 60 + leaveMin;

        // 如果已经过了下班时间，立即通知
        if (currentMinutes >= leaveMinutes) {
            showNotification(
                '[表情] 下班时间到了！',
                `现在是 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}，您可以准备下班了。${todayInfo.overtimeStart} 后开始算加班。`
            );
            settings.notified = true;
            return;
        }

        // 计算距离下班时间还有多少毫秒
        const delayMinutes = leaveMinutes - currentMinutes;
        const delayMs = delayMinutes * 60 * 1000;

        console.log(`[定时器] 下班提醒将在 ${delayMinutes} 分钟后触发 (${todayInfo.leaveTime})`);

        notificationTimers.leaveTime = setTimeout(() => {
            if (settings.notifyEnabled && !settings.notified) {
                const now = new Date();
                showNotification(
                    '[表情] 下班时间到了！',
                    `现在是 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}，您可以准备下班了。${todayInfo.overtimeStart} 后开始算加班。`
                );
                settings.notified = true;
            }
        }, delayMs);
    }

    // 设置加班开始提醒
    function scheduleOvertimeStartNotification(todayInfo) {
        if (!settings.overtimeStartNotify || settings.overtimeStartNotified) {
            return;
        }

        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        const [overtimeHour, overtimeMin] = todayInfo.overtimeStart.split(':').map(Number);
        const overtimeStartMinutes = overtimeHour * 60 + overtimeMin;

        // 如果已经进入加班时间，立即通知
        if (currentMinutes >= overtimeStartMinutes) {
            showNotification(
                '[表情] 加班开始了',
                `现在是 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}，已进入加班时间。加油！`
            );
            settings.overtimeStartNotified = true;
            // 设置周期提醒和目标提醒
            scheduleOvertimePeriodicNotifications(todayInfo);
            scheduleOvertimeTargetNotification(todayInfo);
            return;
        }

        // 计算距离加班开始时间还有多少毫秒
        const delayMinutes = overtimeStartMinutes - currentMinutes;
        const delayMs = delayMinutes * 60 * 1000;

        console.log(`[定时器] 加班开始提醒将在 ${delayMinutes} 分钟后触发 (${todayInfo.overtimeStart})`);

        notificationTimers.overtimeStart = setTimeout(() => {
            if (settings.overtimeStartNotify && !settings.overtimeStartNotified) {
                const now = new Date();
                showNotification(
                    '[表情] 加班开始了',
                    `现在是 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}，已进入加班时间。加油！`
                );
                settings.overtimeStartNotified = true;
                // 设置周期提醒和目标提醒
                scheduleOvertimePeriodicNotifications(todayInfo);
                scheduleOvertimeTargetNotification(todayInfo);
            }
        }, delayMs);
    }

    // 设置加班周期提醒（递归）
    function scheduleOvertimePeriodicNotifications(todayInfo) {
        if (settings.overtimePeriodicNotify === 'none') {
            return;
        }

        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        const [overtimeHour, overtimeMin] = todayInfo.overtimeStart.split(':').map(Number);
        const overtimeStartMinutes = overtimeHour * 60 + overtimeMin;

        // 如果还没到加班时间，不设置周期提醒
        if (currentMinutes < overtimeStartMinutes) {
            return;
        }

        const intervalMinutes = settings.overtimePeriodicNotify === 'hourly' ? 60 : 30;
        const overtimeMinutes = currentMinutes - overtimeStartMinutes;

        // 计算下一次提醒时间
        const currentInterval = Math.floor(overtimeMinutes / intervalMinutes);
        const nextInterval = currentInterval + 1;
        const nextNotifyMinutes = overtimeStartMinutes + (nextInterval * intervalMinutes);

        // 计算距离下次提醒还有多少分钟
        const delayMinutes = nextNotifyMinutes - currentMinutes;

        // 如果延迟时间合理（不超过24小时）
        if (delayMinutes > 0 && delayMinutes < 1440) {
            const delayMs = delayMinutes * 60 * 1000;

            console.log(`[定时器] 加班周期提醒将在 ${delayMinutes} 分钟后触发 (${settings.overtimePeriodicNotify})`);

            notificationTimers.overtimePeriodic = setTimeout(() => {
                if (settings.overtimePeriodicNotify !== 'none') {
                    const now = new Date();
                    const currentMinutes = now.getHours() * 60 + now.getMinutes();
                    const overtimeMinutes = currentMinutes - overtimeStartMinutes;

                    const hours = Math.floor(overtimeMinutes / 60);
                    const mins = Math.round(overtimeMinutes % 60);
                    const timeStr = hours > 0
                        ? `${hours}小时${mins > 0 ? mins + '分钟' : ''}`
                        : `${mins}分钟`;

                    showNotification(
                        '[表情] 加班时长提醒',
                        `您已加班 ${timeStr}，注意休息！`
                    );

                    // 递归设置下一次周期提醒
                    scheduleOvertimePeriodicNotifications(todayInfo);
                }
            }, delayMs);
        }
    }

    // 设置加班目标时长提醒
    function scheduleOvertimeTargetNotification(todayInfo) {
        if (settings.overtimeTargetHours <= 0 || settings.overtimeTargetNotified) {
            return;
        }

        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        const [overtimeHour, overtimeMin] = todayInfo.overtimeStart.split(':').map(Number);
        const overtimeStartMinutes = overtimeHour * 60 + overtimeMin;

        // 计算目标时间点（加班开始时间 + 目标小时数）
        const targetMinutes = overtimeStartMinutes + (settings.overtimeTargetHours * 60);

        // 如果已经达到目标，立即通知
        if (currentMinutes >= targetMinutes) {
            showNotification(
                '[表情] 加班目标达成',
                `您已加班 ${settings.overtimeTargetHours} 小时，目标达成！可以准备下班了。`
            );
            settings.overtimeTargetNotified = true;
            return;
        }

        // 计算距离目标时间还有多少毫秒
        const delayMinutes = targetMinutes - currentMinutes;
        const delayMs = delayMinutes * 60 * 1000;

        console.log(`[定时器] 加班目标提醒将在 ${delayMinutes} 分钟后触发 (${settings.overtimeTargetHours}小时)`);

        notificationTimers.overtimeTarget = setTimeout(() => {
            if (settings.overtimeTargetHours > 0 && !settings.overtimeTargetNotified) {
                showNotification(
                    '[表情] 加班目标达成',
                    `您已加班 ${settings.overtimeTargetHours} 小时，目标达成！可以准备下班了。`
                );
                settings.overtimeTargetNotified = true;
            }
        }, delayMs);
    }

    // 初始化所有提醒定时器
    function setupNotificationTimers(todayInfo) {
        if (!todayInfo.hasRecord || todayInfo.isNonWorkingDay) {
            console.log('[定时器] 非工作日或无打卡记录，不设置定时器');
            return;
        }

        console.log('[定时器] 开始设置所有提醒定时器');

        // 清除旧的定时器
        clearAllNotificationTimers();

        // 设置下班时间提醒
        scheduleLeaveTimeNotification(todayInfo);

        // 设置加班开始提醒
        scheduleOvertimeStartNotification(todayInfo);

        // 如果已经在加班中，设置周期和目标提醒
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const [overtimeHour, overtimeMin] = todayInfo.overtimeStart.split(':').map(Number);
        const overtimeStartMinutes = overtimeHour * 60 + overtimeMin;

        if (currentMinutes >= overtimeStartMinutes) {
            scheduleOvertimePeriodicNotifications(todayInfo);
            scheduleOvertimeTargetNotification(todayInfo);
        }

        console.log('[定时器] 所有提醒定时器设置完成');
    }

    // 更新今日下班时间卡片
    function updateTodayLeaveTimeCard(todayInfo) {
        const card = document.getElementById('today-leave-time-card');
        const content = document.getElementById('leave-time-content');
        const detail = document.getElementById('leave-time-detail');

        if (!todayInfo.hasRecord) {
            // 没有打卡记录，隐藏卡片
            card.style.display = 'none';
            return;
        }

        // 显示卡片
        card.style.display = 'block';

        if (todayInfo.isNonWorkingDay) {
            // 非工作日
            card.className = 'alert alert-warning mb-2';
            card.style.cssText = 'border-left: 4px solid #ff9800; padding: 8px 12px; margin-bottom: 0.75rem;';
            content.className = 'h4 mb-1 text-warning fw-bold';
            content.textContent = `${todayInfo.dayType}加班`;
            detail.className = 'text-dark small mb-0';
            detail.innerHTML = `
                <!-- 打卡信息 -->
                <div class="mb-2" style="font-size: 12px;">
                    ${todayInfo.checkInTime} 上班，全天算加班时长
                </div>

                <!-- 提醒设置 -->
                <div class="d-flex align-items-center gap-2 flex-wrap" style="font-size: 13px;">
                    <div class="form-check form-switch mb-0">
                        <input class="form-check-input" type="checkbox" id="notify-toggle" ${settings.notifyEnabled ? 'checked' : ''}>
                        <label class="form-check-label" for="notify-toggle">下班提醒</label>
                    </div>
                    <button id="test-notify-btn" class="btn btn-sm btn-outline-secondary py-1 px-2" style="font-size: 12px;">
                        <i class="bi bi-bell"></i> 测试
                    </button>
                    <details class="d-inline">
                        <summary class="btn btn-sm btn-outline-primary py-1 px-2" style="font-size: 12px; cursor: pointer; list-style: none;">
                            <i class="bi bi-gear"></i> 高级设置
                        </summary>
                        <div class="position-absolute bg-white border rounded shadow-sm p-2 mt-1 end-0" style="font-size: 12px; z-index: 1000; min-width: 320px;">
                            <div class="mb-2">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="overtime-start-toggle" ${settings.overtimeStartNotify ? 'checked' : ''}>
                                    <label class="form-check-label" for="overtime-start-toggle">加班开始提醒</label>
                                </div>
                            </div>
                            <div class="mb-2">
                                <label class="form-label mb-1">周期提醒:</label>
                                <select id="overtime-periodic-select" class="form-select form-select-sm">
                                    <option value="none" ${settings.overtimePeriodicNotify === 'none' ? 'selected' : ''}>无</option>
                                    <option value="hourly" ${settings.overtimePeriodicNotify === 'hourly' ? 'selected' : ''}>每小时</option>
                                    <option value="halfHourly" ${settings.overtimePeriodicNotify === 'halfHourly' ? 'selected' : ''}>每半小时</option>
                                </select>
                            </div>
                            <div>
                                <label class="form-label mb-1">目标时长 (小时):</label>
                                <input type="number" id="overtime-target-input" value="${settings.overtimeTargetHours}"
                                       min="0" max="12" step="0.5"
                                       class="form-control form-control-sm"
                                       placeholder="0表示不提醒">
                            </div>
                        </div>
                    </details>
                </div>
            `;
        } else {
            // 工作日
            card.className = 'alert alert-light mb-2 border';
            card.style.cssText = 'border-left: 4px solid #4CAF50; padding: 8px 12px; margin-bottom: 0.75rem;';
            content.className = 'h3 mb-1 text-success fw-bold';
            content.textContent = todayInfo.leaveTime;

            // 主要信息布局
            detail.className = 'text-muted mb-0';
            detail.innerHTML = `
                <!-- 打卡信息 -->
                <div class="d-flex align-items-center gap-2 flex-wrap mb-2" style="font-size: 12px;">
                    <span><i class="bi bi-clock-fill text-success"></i> ${todayInfo.checkInTime}</span>
                    <span class="badge bg-success-subtle text-success" style="font-size: 10px;">${todayInfo.status}</span>
                    <span class="text-muted">|</span>
                    <span><i class="bi bi-box-arrow-right text-info"></i> ${todayInfo.overtimeStart} 后加班</span>
                </div>

                <!-- 提醒设置 -->
                <div class="d-flex align-items-center gap-2 flex-wrap" style="font-size: 13px;">
                    <div class="form-check form-switch mb-0">
                        <input class="form-check-input" type="checkbox" id="notify-toggle" ${settings.notifyEnabled ? 'checked' : ''}>
                        <label class="form-check-label" for="notify-toggle">下班提醒</label>
                    </div>
                    <button id="test-notify-btn" class="btn btn-sm btn-outline-secondary py-1 px-2" style="font-size: 12px;">
                        <i class="bi bi-bell"></i> 测试
                    </button>
                    <details class="d-inline">
                        <summary class="btn btn-sm btn-outline-primary py-1 px-2" style="font-size: 12px; cursor: pointer; list-style: none;">
                            <i class="bi bi-gear"></i> 高级设置
                        </summary>
                        <div class="position-absolute bg-white border rounded shadow-sm p-2 mt-1 end-0" style="font-size: 12px; z-index: 1000; min-width: 320px;">
                            <div class="mb-2">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="overtime-start-toggle" ${settings.overtimeStartNotify ? 'checked' : ''}>
                                    <label class="form-check-label" for="overtime-start-toggle">加班开始提醒</label>
                                </div>
                            </div>
                            <div class="mb-2">
                                <label class="form-label mb-1">周期提醒:</label>
                                <select id="overtime-periodic-select" class="form-select form-select-sm">
                                    <option value="none" ${settings.overtimePeriodicNotify === 'none' ? 'selected' : ''}>无</option>
                                    <option value="hourly" ${settings.overtimePeriodicNotify === 'hourly' ? 'selected' : ''}>每小时</option>
                                    <option value="halfHourly" ${settings.overtimePeriodicNotify === 'halfHourly' ? 'selected' : ''}>每半小时</option>
                                </select>
                            </div>
                            <div>
                                <label class="form-label mb-1">目标时长 (小时):</label>
                                <input type="number" id="overtime-target-input" value="${settings.overtimeTargetHours}"
                                       min="0" max="12" step="0.5"
                                       class="form-control form-control-sm"
                                       placeholder="0表示不提醒">
                            </div>
                        </div>
                    </details>
                </div>
            `;
        }

        // 绑定开关事件和测试按钮（无论工作日还是非工作日都需要）
        setTimeout(() => {
            const checkbox = document.getElementById('notify-toggle');
            if (checkbox) {
                checkbox.addEventListener('change', (e) => {
                    const enabled = e.target.checked;
                    saveSetting('notify', enabled);
                    console.log('[下班提醒] 提醒功能', enabled ? '已开启' : '已关闭');
                    if (enabled) {
                        settings.notified = false; // 重置通知状态
                    }
                    // 重新设置定时器
                    setupNotificationTimers(todayInfo);
                });
            }

            // 测试按钮事件
            const testBtn = document.getElementById('test-notify-btn');
            if (testBtn) {
                testBtn.addEventListener('click', () => {
                    console.log('[下班提醒] 测试通知功能');
                    const now = new Date();
                    showNotification(
                        '🔔 下班提醒测试',
                        `这是一条测试通知。当前时间：${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}。如果您看到此通知，说明通知功能正常工作！`,
                        true // 强制发送
                    );
                });
            }

            // 加班开始提醒开关
            const overtimeStartToggle = document.getElementById('overtime-start-toggle');
            if (overtimeStartToggle) {
                overtimeStartToggle.addEventListener('change', (e) => {
                    const enabled = e.target.checked;
                    saveSetting('overtimeStartNotify', enabled);
                    console.log('[加班提醒] 开始提醒', enabled ? '已开启' : '已关闭');
                    if (enabled) {
                        settings.overtimeStartNotified = false; // 重置通知状态
                    }
                    // 重新设置定时器
                    setupNotificationTimers(todayInfo);
                });
            }

            // 加班周期提醒选择
            const overtimePeriodicSelect = document.getElementById('overtime-periodic-select');
            if (overtimePeriodicSelect) {
                overtimePeriodicSelect.addEventListener('change', (e) => {
                    const value = e.target.value;
                    saveSetting('overtimePeriodicNotify', value);
                    console.log('[加班提醒] 周期提醒设置为:', value);
                    // 重新设置定时器
                    setupNotificationTimers(todayInfo);
                });
            }

            // 加班目标时长输入
            const overtimeTargetInput = document.getElementById('overtime-target-input');
            if (overtimeTargetInput) {
                overtimeTargetInput.addEventListener('change', (e) => {
                    const value = parseFloat(e.target.value) || 0;
                    saveSetting('overtimeTargetHours', value);
                    console.log('[加班提醒] 目标时长设置为:', value, '小时');
                    settings.overtimeTargetNotified = false; // 重置通知状态
                    // 重新设置定时器
                    setupNotificationTimers(todayInfo);
                });
            }
        }, 100);

        console.log('[今日下班] 卡片已更新:', todayInfo);
    }

    // 更新显示内容
    function updateDisplayContent(result, month) {
        console.log('[加班计算器] ========== 开始更新显示 ==========');
        const content = document.getElementById('overtime-content');
        console.log(`[加班计算器] 月份: ${month}`);
        console.log(`[加班计算器] 总时长: ${result.totalHours}h`);
        console.log(`[加班计算器] 详情数量: ${result.dailyDetails.length}`);
        console.log('[加班计算器] 容器元素:', content);

        // 计算进度条的百分比（假设目标是40小时，超过则显示100%）
        const targetHours = 40;
        const progressPercent = Math.min(100, (parseFloat(result.totalHours) / targetHours) * 100);
        const progressColor = progressPercent < 50 ? 'success' : (progressPercent < 80 ? 'warning' : 'danger');

        let html = `
            <div class="card border-0 shadow-sm mb-2">
                <div class="card-body text-center py-2">
                    <div class="text-muted mb-1" style="font-size: 12px;">
                        <i class="bi bi-calendar3"></i> ${month} 总加班时长
                    </div>
                    <div class="display-4 fw-bold mb-1" style="color: #667eea;">${result.totalHours}</div>
                    <div class="text-muted mb-2" style="font-size: 12px;">小时</div>
                    <div class="px-3">
                        <div class="progress" style="height: 8px; border-radius: 4px;">
                            <div class="progress-bar bg-${progressColor}" role="progressbar"
                                 style="width: ${progressPercent}%; transition: width 0.6s ease;"
                                 aria-valuenow="${result.totalHours}"
                                 aria-valuemin="0"
                                 aria-valuemax="${targetHours}">
                            </div>
                        </div>
                        <div class="d-flex justify-content-between mt-1">
                            <small class="text-muted" style="font-size: 10px;">0h</small>
                            <small class="text-muted" style="font-size: 10px;">${targetHours}h (参考)</small>
                        </div>
                    </div>
                </div>
            </div>
        `;

        if (result.dailyDetails.length > 0) {
            // 统计信息
            const overtimeDays = result.dailyDetails.filter(d => d.hasOvertime).length;
            const lateDays = result.dailyDetails.filter(d => d.isLate).length;
            const makeupCardDays = result.dailyDetails.filter(d => d.isMakeupCard).length;

            html += `
                <div class="row text-center mb-2 g-2">
                    <div class="col">
                        <div class="card border border-success border-opacity-25 shadow-sm">
                            <div class="card-body py-2 px-2">
                                <div class="h5 mb-0 text-success fw-bold">${overtimeDays}</div>
                                <div class="text-muted" style="font-size: 11px;">
                                    <i class="bi bi-clock-history"></i> 加班天数
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="card border border-warning border-opacity-25 shadow-sm">
                            <div class="card-body py-2 px-2">
                                <div class="h5 mb-0 text-warning fw-bold">${lateDays}</div>
                                <div class="text-muted" style="font-size: 11px;">
                                    <i class="bi bi-exclamation-circle"></i> 迟到天数
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="card border border-primary border-opacity-25 shadow-sm">
                            <div class="card-body py-2 px-2">
                                <div class="h5 mb-0 text-primary fw-bold">${makeupCardDays}</div>
                                <div class="text-muted" style="font-size: 11px;">
                                    <i class="bi bi-pencil-square"></i> 补签卡
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            html += `
                <div class="table-responsive" style="max-height: 380px;">
                    <table class="table table-hover align-middle mb-0" style="font-size: 13px;">
                        <thead class="table-light border-bottom" style="position: sticky; top: 0; z-index: 1;">
                            <tr>
                                <th class="text-center py-2">日期</th>
                                <th class="text-center py-2">上班</th>
                                <th class="text-center py-2">下班</th>
                                <th class="text-center py-2">状态</th>
                                <th class="text-center py-2">类型</th>
                                <th class="text-center py-2">加班</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            result.dailyDetails.forEach(day => {
                // 构建状态标签（使用Bootstrap Badge）
                let statusTags = [];
                if (day.isMakeupCard) {
                    statusTags.push('<span class="badge bg-primary me-1">补签</span>');
                } else if (day.isLate) {
                    // 只有真正迟到才显示迟到标签
                    const lateMinutes = Math.round(day.lateMinutes);
                    statusTags.push(`<span class="badge bg-warning text-dark me-1">迟${lateMinutes}分</span>`);
                } else if (day.lateMinutes > 0 && !day.isMakeupCard) {
                    // 弹性上班（8:10-9:00之间），显示弹性标签
                    statusTags.push('<span class="badge bg-success me-1">弹性</span>');
                }
                if (day.isCrossDay) {
                    statusTags.push('<span class="badge bg-purple me-1" style="background: #9c27b0;">跨天</span>');
                }
                if (!day.isLate && !day.isMakeupCard && !day.isCrossDay && day.lateMinutes === 0) {
                    statusTags.push('<span class="badge bg-success-subtle text-success"><i class="bi bi-check-circle"></i> 正常</span>');
                }

                const statusHtml = statusTags.join('');

                // 行背景色
                let rowBg = 'white';
                if (day.hasOvertime) {
                    rowBg = '#e8f5e9'; // 浅绿色背景表示有加班
                }

                // 上班时间颜色：只有真正迟到或补签才标红
                let checkInColor = '#333';
                if (day.isLate || day.isMakeupCard) {
                    checkInColor = '#ff9800';
                } else if (day.lateMinutes > 0) {
                    checkInColor = '#4CAF50'; // 弹性上班显示绿色
                }

                // 判定依据标签（使用Bootstrap Badge）
                const basisTags = [];
                // if (typeof day.scheduledHours === 'number') {
                //     basisTags.push(`<span class="badge bg-secondary" style="font-size:10px;">排班 ${day.scheduledHours}h</span>`);
                // }
                if (day.dayType) {
                    let badgeClass = 'bg-success'; // 默认工作日
                    if (day.dayType.includes('休')) {
                        badgeClass = 'bg-info';
                    } else if (day.dayType !== '工作日') {
                        badgeClass = 'bg-warning text-dark';
                    }
                    basisTags.push(`<span class="badge ${badgeClass}" style="font-size:10px;">${day.dayType}</span>`);
                }

                html += `
                    <tr class="${day.hasOvertime ? 'table-success table-success-subtle' : ''}">
                        <td class="text-center py-2">
                            <div class="fw-bold">${day.date.substring(5)}</div>
                            <small class="text-muted">${day.dayOfWeek}</small>
                        </td>
                        <td class="text-center py-2 fw-semibold" style="color: ${checkInColor};">
                            ${day.checkIn}
                        </td>
                        <td class="text-center py-2 fw-semibold" style="color: ${day.isCrossDay ? '#9c27b0' : '#333'};">
                            ${day.checkOut}
                        </td>
                        <td class="text-center py-2">
                            ${statusHtml}
                        </td>
                        <td class="text-center py-2">${basisTags.join('')}</td>
                        <td class="text-center py-2 fw-bold fs-6 ${day.hasOvertime ? 'text-success' : 'text-muted'}">
                            ${day.hasOvertime ? day.overtimeHours + 'h' : '-'}
                        </td>
                    </tr>
                `;
            });

            html += `
                        </tbody>
                    </table>
                </div>
            `;
        }

        console.log(`[加班计算器] HTML长度: ${html.length} 字符`);
        console.log('[加班计算器] 设置 innerHTML...');
        content.innerHTML = html;
        console.log('[加班计算器] innerHTML 已更新');
        console.log('[加班计算器] ========== 完成更新显示 ==========');
    }

    // 等待用户信息元素出现
    async function waitForUserElement(maxWaitTime = 15000) {
        console.log('[加班计算器] 开始等待用户信息元素...');
        const startTime = Date.now();
        const checkInterval = 500; // 每500ms检查一次

        const selectors = [
            'body > div.page-container > div.page-right.hidden.mini > div.page-header-container > div.nav-wrap.right > ul > li:nth-child(1) > a > span',
            'body > div.page-container > div.page-right > div.page-header-container > div.nav-wrap.right > ul > li:nth-child(1) > a > span',
            '.page-header-container .nav-wrap.right li:first-child a span',
            '.nav-wrap.right li:first-child a span'
        ];

        while (Date.now() - startTime < maxWaitTime) {
            for (let selector of selectors) {
                const element = document.querySelector(selector);
                if (element && element.textContent.trim()) {
                    const text = element.textContent.trim();
                    // 检查是否包含括号和数字（用户ID格式）
                    if (/\(\d+\)/.test(text)) {
                        console.log(`[加班计算器] 找到用户信息元素，耗时: ${Date.now() - startTime}ms`);
                        return true;
                    }
                }
            }
            // 等待后再次检查
            await new Promise(resolve => setTimeout(resolve, checkInterval));
            console.log(`[加班计算器] 继续等待... 已等待 ${Date.now() - startTime}ms`);
        }

        console.error(`[加班计算器] 等待超时 (${maxWaitTime}ms)，未找到用户信息元素`);
        return false;
    }

    // 主函数
    async function main() {
        console.log('[加班计算器] 主函数开始执行');
        console.log('[加班计算器] 当前 URL:', window.location.href);
        console.log('[加班计算器] document.readyState:', document.readyState);

        // 检查是否已经创建过面板（避免重复执行）
        if (document.getElementById('overtime-panel')) {
            console.log('[加班计算器] 面板已存在，跳过执行');
            return;
        }

        // 等待用户信息元素出现
        const elementFound = await waitForUserElement();
        if (!elementFound) {
            console.warn('[加班计算器] 未找到用户信息元素，可能当前页面不支持');
            return; // 静默失败，不弹窗
        }

        const userUid = getUserUid();
        if (!userUid) {
            console.error('[加班计算器] 无法获取 user_uid');
            alert('无法获取用户ID，请检查页面是否正常加载\n\n请尝试：\n1. 刷新页面\n2. 检查控制台日志\n3. 确认页面已完全加载');
            return;
        }

        console.log('[加班计算器] 获取到 user_uid:', userUid);

        // 创建显示面板
        createDisplayPanel();

        // 创建唤醒按钮（初始隐藏）
        createToggleButton();

        // 获取当前年月（默认显示本月）
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        console.log(`[加班计算器] 默认查询月份: ${currentYear}年${currentMonth}月（本月）`);

        // 初始化月份选择器
        initMonthSelector(currentYear, currentMonth);

        // 当前选中的年月
        let selectedYear = currentYear;
        let selectedMonth = currentMonth;

        // 月份选择器变化事件
        const selector = document.getElementById('month-selector');
        selector.addEventListener('change', async (e) => {
            const [year, month] = e.target.value.split('-').map(Number);
            selectedYear = year;
            selectedMonth = month;
            await loadMonthData(userUid, year, month);
        });

        // 上一月按钮 - 切换到上个月
        document.getElementById('prev-month-btn').addEventListener('click', async () => {
            const now = new Date();
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const lastYear = lastMonth.getFullYear();
            const lastMonthNum = lastMonth.getMonth() + 1;

            // 检查是否已经在上月
            if (selectedYear === lastYear && selectedMonth === lastMonthNum) {
                // 显示提示信息
                const content = document.getElementById('overtime-content');
                const originalContent = content.innerHTML;
                content.innerHTML = `
                    <div style="text-align: center; padding: 40px 20px;">
                        <div style="font-size: 48px; margin-bottom: 20px;"></div>
                        <div style="font-size: 16px; color: #667eea; margin-bottom: 10px; font-weight: bold;">
                            已经是最早月份
                        </div>
                        <div style="font-size: 14px; color: #666; line-height: 1.6;">
                            系统只能查询本月和上月的数据<br>
                            当前已显示上月数据，无法查询更早的月份
                        </div>
                    </div>
                `;
                // 2秒后恢复原内容
                setTimeout(() => {
                    content.innerHTML = originalContent;
                }, 2000);
                return;
            }

            selectedYear = lastYear;
            selectedMonth = lastMonthNum;
            selector.value = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
            await loadMonthData(userUid, selectedYear, selectedMonth);
        });

        // 下一月按钮 - 切换到本月
        document.getElementById('next-month-btn').addEventListener('click', async () => {
            const now = new Date();
            const thisYear = now.getFullYear();
            const thisMonth = now.getMonth() + 1;

            // 检查是否已经在本月
            if (selectedYear === thisYear && selectedMonth === thisMonth) {
                // 显示提示信息
                const content = document.getElementById('overtime-content');
                const originalContent = content.innerHTML;
                content.innerHTML = `
                    <div style="text-align: center; padding: 40px 20px;">
                        <div style="font-size: 48px; margin-bottom: 20px;"></div>
                        <div style="font-size: 16px; color: #667eea; margin-bottom: 10px; font-weight: bold;">
                            已经是本月
                        </div>
                        <div style="font-size: 14px; color: #666; line-height: 1.6;">
                            当前已显示本月数据
                        </div>
                    </div>
                `;
                // 2秒后恢复原内容
                setTimeout(() => {
                    content.innerHTML = originalContent;
                }, 2000);
                return;
            }

            selectedYear = thisYear;
            selectedMonth = thisMonth;
            selector.value = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
            await loadMonthData(userUid, selectedYear, selectedMonth);
        });

        // 本月按钮
        document.getElementById('current-month-btn').addEventListener('click', async () => {
            const now = new Date();
            selectedYear = now.getFullYear();
            selectedMonth = now.getMonth() + 1;
            selector.value = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
            await loadMonthData(userUid, selectedYear, selectedMonth);
        });

        // 按钮悬停效果
        ['prev-month-btn', 'next-month-btn'].forEach(btnId => {
            const btn = document.getElementById(btnId);
            btn.addEventListener('mouseenter', () => {
                btn.style.background = '#667eea';
                btn.style.color = 'white';
                btn.style.borderColor = '#667eea';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.background = 'white';
                btn.style.color = '#333';
                btn.style.borderColor = '#ddd';
            });
        });

        document.getElementById('current-month-btn').addEventListener('mouseenter', (e) => {
            e.target.style.background = '#5568d3';
        });
        document.getElementById('current-month-btn').addEventListener('mouseleave', (e) => {
            e.target.style.background = '#667eea';
        });

        // 加载当天工作日信息（用于今日下班提醒）
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        await loadTodayWorkdayInfo(userUid, todayStr);

        // 加载今日下班时间
        const todayInfo = await getTodayLeaveTime(userUid);
        updateTodayLeaveTimeCard(todayInfo);

        // 设置所有提醒定时器（使用精准的setTimeout而不是循环检测）
        setupNotificationTimers(todayInfo);

        // 加载默认数据（当月）
        await loadMonthData(userUid, currentYear, currentMonth);
    }

    // 页面加载完成后执行
    console.log('[加班计算器] 初始化开始, readyState:', document.readyState);

    if (document.readyState === 'loading') {
        console.log('[加班计算器] 等待 DOMContentLoaded 事件');
        document.addEventListener('DOMContentLoaded', () => {
            console.log('[加班计算器] DOMContentLoaded 事件触发');
            main();
        });
    } else {
        console.log('[加班计算器] 页面已加载完成，直接执行');
        main();
    }

})();
