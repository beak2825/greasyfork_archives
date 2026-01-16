// ==UserScript==
// @name         Bilibili 自动投币增加亲密度
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  每日在B站动态页后台自动为指定合集的5个视频投币，静默执行，有详细日志。
// @author       ysl
// @match        https://t.bilibili.com/*
// @connect      api.bilibili.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562748/Bilibili%20%E8%87%AA%E5%8A%A8%E6%8A%95%E5%B8%81%E5%A2%9E%E5%8A%A0%E4%BA%B2%E5%AF%86%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/562748/Bilibili%20%E8%87%AA%E5%8A%A8%E6%8A%95%E5%B8%81%E5%A2%9E%E5%8A%A0%E4%BA%B2%E5%AF%86%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置区域 ---
    const CONFIG = {
        TARGET_MID: 2132180406,      // 目标UP主的MID
        TARGET_SERIES_ID: 2484684,   // 目标合集的ID
        COINS_PER_VIDEO: 2,          // 每个视频投币数量 (1 或 2)
        TARGET_COUNT: 5,             // 每天投币的视频总数
        MAX_PAGES_TO_CHECK: 20,      // 为防止意外，最多检查的合集页数
    };

    // --- 日志封装 ---
    const log = (message) => console.log(`[自动投币脚本] ${message}`);

    // --- 核心功能 ---

    /**
     * 获取 CSRF Token，用于执行写操作（如投币）
     * @returns {string|null} CSRF Token 或 null
     */
    const getCsrf = () => {
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
            const [name, value] = cookie.split('=');
            if (name === 'bili_jct') {
                return decodeURIComponent(value);
            }
        }
        return null;
    };

    /**
     * 获取 'YYYY-MM-DD' 格式的今天日期字符串
     * @returns {string}
     */
    const getTodayDateString = () => {
        return new Date().toISOString().split('T')[0];
    };

    /**
     * Promisified GM_xmlhttpRequest
     * @param {object} options - GM_xmlhttpRequest 的参数
     * @returns {Promise<any>}
     */
    const request = (options) => {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                ...options,
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.code === 0) {
                            resolve(data);
                        } else {
                            reject(data);
                        }
                    } catch (e) {
                        reject({ code: -1, message: 'JSON解析失败', error: e });
                    }
                },
                onerror: (error) => {
                    reject({ code: -2, message: '网络请求失败', error });
                }
            });
        });
    };

    /**
     * 获取合集某一页的视频列表
     * @param {number} pageNum - 页码
     * @returns {Promise<object>}
     */
    const fetchPlaylistPage = (pageNum) => {
        const url = `https://api.bilibili.com/x/series/archives?mid=${CONFIG.TARGET_MID}&series_id=${CONFIG.TARGET_SERIES_ID}&only_normal=true&sort=desc&ps=30&pn=${pageNum}`;
        return request({ method: 'GET', url });
    };

    /**
     * 检查指定视频的投币状态
     * @param {string} bvid - 视频BVID
     * @returns {Promise<object>}
     */
    const checkCoinStatus = (bvid) => {
        const url = `https://api.bilibili.com/x/web-interface/archive/coins?bvid=${bvid}`;
        return request({ method: 'GET', url });
    };

    /**
     * 为指定视频投币
     * @param {string} bvid - 视频BVID
     * @param {string} csrf - CSRF Token
     * @returns {Promise<object>}
     */
    const addCoin = (bvid, csrf) => {
        const url = 'https://api.bilibili.com/x/web-interface/coin/add';
        const postData = `bvid=${bvid}&multiply=${CONFIG.COINS_PER_VIDEO}&select_like=0&csrf=${csrf}`;
        return request({
            method: 'POST',
            url: url,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: postData,
        });
    };

    /**
     * 主执行函数
     */
    const main = async () => {
        log('脚本已启动，开始检查任务...');

        // 1. 检查今天是否已执行
        const lastExecutionDate = await GM_getValue('lastExecutionDate', null);
        const today = getTodayDateString();

        if (lastExecutionDate === today) {
            log('今日任务已完成或已尝试，明天再来吧！');
            return;
        }

        log(`今天是 ${today}，开始执行每日投币任务。`);

        // 2. 获取 CSRF token
        const csrf = getCsrf();
        if (!csrf) {
            log('错误：无法获取 CSRF Token，请确保您已登录B站。');
            return;
        }
        log('成功获取 CSRF Token。');

        // 3. 加载本地已投币列表
        const coinedBvidsArray = await GM_getValue('coinedVideos', []);
        const coinedBvidsSet = new Set(coinedBvidsArray);
        log(`已加载 ${coinedBvidsSet.size} 条本地投币记录。`);

        let successCount = 0;
        let isTaskStopped = false;

        // 4. 循环获取视频并处理
        for (let page = 1; page <= CONFIG.MAX_PAGES_TO_CHECK; page++) {
            if (successCount >= CONFIG.TARGET_COUNT || isTaskStopped) break;

            log(`正在请求合集第 ${page} 页...`);
            let pageData;
            try {
                pageData = await fetchPlaylistPage(page);
            } catch (e) {
                log(`获取第 ${page} 页失败: ${e.message || '未知错误'}`);
                break; // 获取分页失败，终止任务
            }

            const videos = pageData.data?.archives;
            if (!videos || videos.length === 0) {
                log('合集已遍历完毕，没有更多视频了。');
                break;
            }

            for (const video of videos) {
                if (successCount >= CONFIG.TARGET_COUNT || isTaskStopped) break;
                const bvid = video.bvid;

                // 检查本地记录
                if (coinedBvidsSet.has(bvid)) {
                    log(`[本地跳过] ${bvid} 已在投币记录中。`);
                    continue;
                }

                try {
                    // API 检查投币状态 (双重保险)
                    const statusData = await checkCoinStatus(bvid);
                    if (statusData.data.multiply > 0) {
                        log(`[API跳过] ${bvid} 已投过 ${statusData.data.multiply} 枚硬币，更新本地记录。`);
                        coinedBvidsSet.add(bvid);
                        continue;
                    }

                    // 执行投币
                    log(`[发现目标] 准备为 ${bvid} (${video.title}) 投 ${CONFIG.COINS_PER_VIDEO} 枚硬币...`);
                    const coinResult = await addCoin(bvid, csrf);

                    log(`[投币成功] ${bvid} 投币成功！`);
                    successCount++;
                    coinedBvidsSet.add(bvid);
                    log(`任务进度: ${successCount} / ${CONFIG.TARGET_COUNT}`);

                } catch (error) {
                    // 处理API错误
                    log(`处理 ${bvid} 时发生错误，Code: ${error.code}, Message: ${error.message}`);
                    switch (error.code) {
                        case -104:
                            log('错误：硬币不足！今日任务终止。');
                            isTaskStopped = true;
                            break;
                        case -101:
                            log('错误：账号未登录！今日任务终止。');
                            isTaskStopped = true;
                            break;
                         case -111:
                            log('错误：CSRF 校验失败！今日任务终止。');
                            isTaskStopped = true;
                            break;
                        case 34005: // 超过投币上限
                             log(`[API跳过] ${bvid} 已达到投币上限（5枚），更新本地记录。`);
                             coinedBvidsSet.add(bvid);
                             break;
                        default:
                            log(`投币失败，可能是其他原因，继续尝试下一个视频。`);
                    }
                }
            }
        }

        // 5. 任务结束，保存数据
        log(`任务执行完毕。总共成功为 ${successCount} 个视频投币。`);
        await GM_setValue('coinedVideos', Array.from(coinedBvidsSet));
        await GM_setValue('lastExecutionDate', today);
        log('已更新本地投币记录和执行日期。');
    };

    // 启动脚本
    main();

})();