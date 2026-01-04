// ==UserScript==
// @name         B站番剧显示BGM评分
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  在B站番剧页面显示动漫和BGM评分,播放页面添加BGM评分
// @author       blue bird
// @match        https://www.bilibili.com/anime/index/*
// @match        https://www.bilibili.com/bangumi/play/ep*
// @match        https://www.bilibili.com/bangumi/play/ss*
// @resource     BILI_BANGUMI_MAPPING https://rhilip.github.io/BangumiExtLinker/data/anime_map.json
// @require      https://scriptcat.org/lib/513/2.1.0/ElementGetter.js#sha256=aQF7JFfhQ7Hi+weLrBlOsY24Z2ORjaxgZNoni7pAz5U=
// @require      https://scriptcat.org/lib/637/1.4.8/ajaxHooker.js#sha256=dTF50feumqJW36kBpbf6+LguSLAtLr7CEs3oPmyfbiM=
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      api.bgm.tv
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552069/B%E7%AB%99%E7%95%AA%E5%89%A7%E6%98%BE%E7%A4%BABGM%E8%AF%84%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/552069/B%E7%AB%99%E7%95%AA%E5%89%A7%E6%98%BE%E7%A4%BABGM%E8%AF%84%E5%88%86.meta.js
// ==/UserScript==

/*global elmGetter,ajaxHooker*/

(function () {
    'use strict';

    let requestCache = GM_getValue('bangumiRatingCache', {});

    // 存储API获取的动漫数据（key: season_id, value: 动漫信息对象）
    const animeDataMap = GM_getValue('bilibiliAnimeCache', {});

    // 1. 处理获取到的动漫数据
    function processAnimeData(data) {
        console.debug("processAnimeData", data);

        if (data.code === 0 && data.data?.list?.length > 0) {
            data.data.list.forEach(anime => {
                // 只存储有season_id和score的有效数据
                if (anime.season_id && anime.score) {
                    animeDataMap[anime.season_id] = anime;
                }
            });

            console.debug("save animeDataMap", animeDataMap);
            GM_setValue('bilibiliAnimeCache', animeDataMap);
        }
    }

    ajaxHooker.filter([
        { url: /^https:\/\/api\.bilibili\.com/ },
    ]);

    // 接口拦截
    ajaxHooker.hook(request => {
        // 处理原有接口
        if (request.url.startsWith('https://api.bilibili.com/pgc/season/index/result')) {
            request.response = (res) => {
                try {
                    const data = JSON.parse(res.responseText);
                    processAnimeData(data);
                    renderBiliScores();
                } catch (e) {
                    console.error('解析B站动漫API(XHR)数据失败：', e);
                }
            };
        }
        return request;
    });

    // 4. 根据评分获取对应的颜色（高分绿色/蓝色，低分红色）
    function getScoreColor(score) {
        const scoreNum = parseFloat(score);
        if (scoreNum >= 9.5) return '#00b42a';    // 深绿色：极高分
        if (scoreNum >= 9.0) return '#36b37e';    // 绿色：高分
        if (scoreNum >= 8.0) return '#165dff';    // 蓝色：良好
        if (scoreNum >= 7.0) return '#ff7d00';    // 橙色：中等
        return '#ff3838';                         // 红色：低分（预警）
    }

    // 5. 查找动漫卡片对应的season_id（从链接中提取）
    function getSeasonIdFromCard(cardElement) {
        // 获取动漫卡片的链接（cover-wrapper的href）
        const linkElem = cardElement.querySelector('a.cover-wrapper');
        if (!linkElem) return null;

        const linkHref = linkElem.getAttribute('href');
        // 匹配链接中的ss数字（season_id），例如：https://www.bilibili.com/bangumi/play/ss21466
        const seasonIdMatch = linkHref.match(/ss(\d+)/);
        return seasonIdMatch ? parseInt(seasonIdMatch[1], 10) : null;
    }


    function renderBiliScore(card) {
        // 获取当前卡片的season_id
        const seasonId = getSeasonIdFromCard(card);
        if (!seasonId) {
            console.log("未找到season_id");
            return;
        }

        // 从存储中获取对应的动漫数据
        const animeData = animeDataMap[seasonId];
        if (!animeData || !animeData.score) {
            console.warn("未找到对应的动漫数据", seasonId);
            return;
        }

        // 检查是否已经添加过评分，避免重复添加
        const existingScore = card.querySelector('.bili-score-tag');
        if (existingScore) {
            return;
        }

        // 找到封面容器元素
        const coverWrapper = card.querySelector('a.cover-wrapper');
        if (!coverWrapper) {
            console.log("未找到cover-wrapper元素");
            return;
        }

        // 获取评分颜色
        const scoreColor = getScoreColor(animeData.score);

        // 创建评分标签元素
        const scoreTag = document.createElement('span');
        scoreTag.className = 'corner-tag bili-score-tag';
        scoreTag.style.cssText = `
        position: absolute;
        width: 60px; /* 比"独家"标签窄一些 */
        height: 24px;
        line-height: 24px;
        border-radius: 0 0 4px 0; /* 左下角圆角 */
        top: 0;
        left: 0; /* 定位到左上角 */
        font-size: 12px;
        text-align: center;
        background-color: ${scoreColor};
        color: #fff;
        z-index: 1; /* 确保显示在封面上方 */
    `;
        scoreTag.textContent = "★" + animeData.score;

        // 将评分标签添加到封面容器中
        coverWrapper.appendChild(scoreTag);
    }


    // 6. 渲染评分到动漫卡片
    function renderBiliScores() {
        // 获取所有动漫卡片元素
        const animeCards = document.querySelectorAll(
            '#app > div.bangumi-index-body.clearfix > div.filter-body > ul.bangumi-list.clearfix > li'
        );
        animeCards.forEach(card => renderBiliScore(card));
    }


    // -------------------------- 排行榜页面Bangumi评分逻辑（核心优化） --------------------------
    /**
     * 获取Bangumi评分颜色（紫色系，与B站区分）
     * @param {string|number} score - 评分（如 9.2）
     * @returns {string} 颜色十六进制值
     */
    function getBangumiScoreColor(score) {
        const scoreNum = parseFloat(score);
        if (scoreNum >= 9.5) return '#9c27b0';    // 深紫：极高分
        if (scoreNum >= 9.0) return '#7b1fa2';    // 紫色：高分
        if (scoreNum >= 8.0) return '#673ab7';    // 靛蓝：良好
        if (scoreNum >= 7.0) return '#5c6bc0';    // 浅靛：中等
        return '#7986cb';                         // 浅紫：低分（不刺眼）
    }


    function renderBangumiScore(card) {
        console.debug("renderBangumiScore");
        console.debug(card);

        // 1. 避免重复渲染（添加标记属性）
        if (card.hasAttribute('data-bgm-render-error') || $(card).find('.bgm_score').length > 0 || card.hasAttribute('data-bgm-processing')) {
            return;
        }

        // 2. 提取season_id → 从animeDataMap获取mediaId（核心优化）
        const seasonId = getSeasonIdFromCard(card);
        if (!seasonId) {
            card.setAttribute('data-bgm-render-error', 'no season_id');
            return;
        }
        const animeData = animeDataMap[seasonId];
        // 关键判断：是否有有效的mediaId（mdxxx）
        if (!animeData || !animeData.media_id) {
            console.warn(`未获取到seasonId=${seasonId}的mediaId`);

            card.setAttribute('data-bgm-render-error', 'no media_id');
            return;
        }

        // 3. 用mediaId匹配Bangumi ID（无需解析链接，更稳定）
        const bangumiId = getBangumiIdFromMediaId(animeData.media_id);
        if (!bangumiId) {
            console.warn(`mediaId=${animeData.mediaId}无匹配的Bangumi ID`);
            card.setAttribute('data-bgm-render-error', 'no bgm_id');
            return;
        }

        card.setAttribute('data-bgm-processing', 'true');
        // 4. 获取Bangumi评分并渲染
        getBangumiRating(bangumiId, (ratingData) => {
            const shadowElem = card.querySelector('div.shadow');
            if (!shadowElem || !ratingData) {
                card.setAttribute('data-bgm-render-error', 'no rating data');
                card.removeAttribute('data-bgm-processing');
                return;
            }

            // 5. 渲染Bangumi评分（紫色系+“BGM”标识）
            const scoreColor = getBangumiScoreColor(ratingData.score);
            const scoreHtml = `
                    <span style="
                        margin-left: 2px; /* 进一步缩小间距（原6px） */
                        padding: 1px 4px; /* 与B站评分一致 */
                        border-radius: 2px; /* 与B站评分一致 */
                        font-size: 14px; /* 与B站评分一致 */
                        font-weight: 500; /* 与B站评分一致 */
                        color: white;
                        background-color: ${scoreColor};
                        white-space: nowrap; /* 强制不换行 */
                        overflow: visible; /* 避免溢出隐藏 */
                        display: inline-block; /* 确保布局稳定 */
                    " class="bgm_score">
                        BGM ★${ratingData.score} <!-- 去掉"★"，减少冗余 bgm score -->
                    </span>
                `;
            shadowElem.innerHTML += scoreHtml;
            card.removeAttribute('data-bgm-processing');
        });
    }
    /**
     * 渲染Bangumi评分到排行榜卡片（关键优化：用animeData.mediaId替代链接提取）
     */
    function renderBangumiScores() {
        const animeCards = document.querySelectorAll(
            '#app > div.bangumi-index-body.clearfix > div.filter-body > ul.bangumi-list.clearfix > li'
        );

        animeCards.forEach(card => renderBangumiScore(card));
    }





    // 1. 获取预加载的JSON文本
    const jsonText = GM_getResourceText('BILI_BANGUMI_MAPPING');

    // 2. 解析为JSON对象
    var linkData = {};
    // -------------------------- 工具函数 --------------------------
    /**
     * 1. 从a标签提取B站md号（格式：md+数字，如md28229676）
     * @param {string} link - 包含md号的url
     * @returns {string|null} md号（如md28229676）
     */
    function extractMdId(link) {
        const href = link;
        if (!href) return null;
        // 匹配 href 中的 "/md数字" 格式（如 "/bangumi/media/md28229676"）
        const mdMatch = href.match(/\/media\/md(\d+)/) || href.match(/\/media\/ss(\d+)/);
        return mdMatch ? `${mdMatch[1]}` : null;
    }

    /**
     * 2. 从映射数据中通过md号获取Bangumi ID
     * @param {string} mdId - B站md号（如md28229676）
     * @param {function} callback - 回调函数（参数：bangumiId或null）
     */
    function getBangumiIdFromMediaId(Id) {
        const mdId = `md${Id}`;
        if (!linkData || Object.keys(linkData).length === 0) {
            linkData = JSON.parse(jsonText)
        }
        const item = Object.values(linkData).find(item =>
            item.bili_id && item.bili_id === mdId
        );
        return item ? item.bgm_id : null;
    }





    function saveCache() {
        GM_setValue('bangumiRatingCache', requestCache);
    }
    /**
     * 3. 调用Bangumi API获取评分数据
     * @param {string} bangumiId - Bangumi条目ID（如400602）
     * @param {function} callback - 回调函数（参数：评分数据或null）
     */
    function getBangumiRating(bangumiId, callback) {
        const BANGUMI_API_BASE = "https://api.bgm.tv/v0/subjects/";
        const cacheKey = `${BANGUMI_API_BASE}${bangumiId}`;
        if (requestCache[cacheKey]) {
            callback(requestCache[cacheKey]);
            return;
        }
        GM_xmlhttpRequest({
            method: "GET",
            url: `${BANGUMI_API_BASE}${bangumiId}`,
            responseType: "json",
            headers: {
                // Bangumi API要求User-Agent）
                "User-Agent": "bluebird/userscript",
                "Accept": "application/json"
            },
            timeout: 10000,

            onload: (response) => {
                if (response.status === 200 && response.response) {
                    const { rating } = response.response;
                    if (rating) {
                        // 提取关键评分数据（score：评分，users_count：评分人数）
                        const result = {
                            score: rating.score.toFixed(1), // 保留1位小数（如8.9）
                            userCount: formatNumber(rating.total) // 格式化人数（如1.2万）
                        };
                        requestCache[cacheKey] = result;
                        saveCache();
                        callback(result);
                    } else {
                        console.error("Bangumi API无评分数据");
                        callback(null);
                    }
                } else {
                    console.error("Bangumi API请求失败，状态码：", response.status);
                    callback(null);
                }
            },
            onerror: (error) => {
                console.error("Bangumi API请求错误：", error);
                callback(null);
            },
            ontimeout: () => {
                console.error("Bangumi API请求超时");
                callback(null);
            }
        });
    }

    /**
     * 4. 将Bangumi评分插入到B站评分容器旁
     * @param {jQuery} targetContainer - B站原评分容器（jQuery对象）
     * @param {Object} ratingData - Bangumi评分数据（score, userCount）
     */
    function insertBangumiRating(targetContainer, ratingData) {
        // 创建Bangumi评分容器（样式模仿B站原评分）
        const bangumiRating = document.createElement("div");
        bangumiRating.className = "mediainfo_mediaRating__C5uvV";
        bangumiRating.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-left: 16px; /* 与B站评分保持间距 */
        padding: 2px 0;
    `;

        // 评分数字（模仿B站粉色+大字体）
        const scoreElem = document.createElement("div");
        scoreElem.className = "mediainfo_score__SQ_KG"; // 复用B站原有类名保持样式一致
        scoreElem.style.color = "#FB7299"; // B站粉色主色
        scoreElem.innerHTML = `${ratingData.score}<span class="mediainfo_suffix__fXV4_">分</span>`;

        // 评分人数（模仿B站灰色+小字体）
        const countElem = document.createElement("div");
        countElem.className = "mediainfo_ratingText__N8GtM"; // 复用B站原有类名
        countElem.style.color = "#9499A0"; // B站辅助灰色
        countElem.textContent = `${ratingData.userCount}人评分`;

        bangumiRating.appendChild(scoreElem);
        bangumiRating.appendChild(countElem);


        // 将Bangumi评分插入到B站评分容器旁边（横向排列）
        targetContainer.parent().css("display", "flex"); // 父容器改为flex布局（jQuery方式）
        $(bangumiRating).insertBefore(targetContainer.next()); // 插入到目标容器的下一个兄弟前（jQuery插入方法）
    }

    function insertErrorMsg(targetContainer, msg) {
        const errorElem = document.createElement("div");
        errorElem.style.cssText = `
        margin-left: 16px;
        font-size: 12px;
        color: #9499A0;
        white-space: nowrap;
        `;
        errorElem.textContent = `Bangumi：${msg}`;

        // 利用jQuery的parent()方法获取父元素并设置样式
        targetContainer.parent().css("display", "flex");
        // 插入到targetContainer的下一个兄弟元素之前
        // 先通过next()获取下一个兄弟的jQuery对象，再通过get(0)转为原生DOM元素
        targetContainer.parent().get(0).insertBefore(errorElem, targetContainer.next().get(0));
    }


    async function initBangumiRating() {
        // 1. 获取B站评分容器
        // examepl const gameContainer = await elmGetter.get('div.ivu-tabs-content  div.flex-row.jc-space-flex-start.flex-wrap.w-auto');
        const ratingContainer = await elmGetter.get('[class*="mediainfo_mediaRating__"]');
        if (!ratingContainer) {
            console.error("未找到B站评分容器");
            return;
        }
        const title = await elmGetter.get('[class*="mediainfo_mediaTitle__"]');
        console.log(`current title:${title[0]} ${title[0].href}`);
        const mdId = extractMdId(title[0].href);
        if (!mdId) {
            console.error("未能从链接中提取md号");
            insertErrorMsg(ratingContainer, "未识别md号");
            return;
        }
        const bangumiId = getBangumiIdFromMediaId(mdId);
        if (!bangumiId) {
            console.error("未在映射数据中找到对应的Bangumi ID");
            insertErrorMsg(ratingContainer, "映射数据缺失");
            return;
        }
        // 2. 调用Bangumi API获取评分
        getBangumiRating(bangumiId, (ratingData) => {
            if (ratingData) {
                // 3. 插入Bangumi评分到页面
                window.addEventListener('load', () => {
                    insertBangumiRating(ratingContainer, ratingData);
                });


            } else {
                insertErrorMsg(ratingContainer, "评分加载失败");
            }
        });
    }

    /**
     * 辅助：格式化数字（如1234→1.2万，123456→12.3万）
     * @param {number} num - 原始数字
     * @returns {string} 格式化后的字符串
     */
    function formatNumber(num) {
        if (num >= 10000) {
            return (num / 10000).toFixed(1) + "万";
        }
        return num.toString();
    }

    // 1. 核心函数：判断是否为epxxx路径
    function isBilibiliEpPage() {
        // 获取当前页面的路径（如 "/bangumi/play/ep341249"）
        const currentPath = window.location.pathname;
        const epPathReg = /^\/bangumi\/play\/ep\d+(\/|$)/;
        const ssPathReg = /^\/bangumi\/play\/ss\d+(\/|$)/;
        // 返回匹配结果（true=是ep路径，false=不是）
        return epPathReg.test(currentPath) || ssPathReg.test(currentPath);
    }

    function isBiliBiliAnimeIndexPage() {
        const currentPath = window.location.pathname;
        const infoPathReg = /^\/anime\/index\//;
        return infoPathReg.test(currentPath);
    }

    function observePageChanges() {
        const targetContainer = document.querySelector(
            '#app > div.bangumi-index-body.clearfix > div.filter-body'
        );
        if (!targetContainer) return;

        elmGetter.each('.bangumi-item', targetContainer, async (Dom) => {
            // dom is a jquery array
            Dom.each(async (index, dom) => {
                renderBiliScore(dom);
                renderBangumiScore(dom);
            });
        })

        // 标记是否已调度执行
        let isScheduled = false;

        // 创建观察器
        const observer = new MutationObserver(() => {
            // 如果尚未调度，则安排在下一帧执行
            if (!isScheduled) {
                isScheduled = true;
                // 利用requestAnimationFrame确保在DOM更新后、渲染前执行
                requestAnimationFrame(() => {
                    console.log('观察到DOM变化，重新渲染');
                    observer.disconnect();
                    requestAnimationFrame(() => { 
                        elmGetter.each('.bangumi-item', targetContainer, async (Dom) => {
                            // dom is a jquery array
                            Dom.each(async (index, dom) => {
                                renderBiliScore(dom);
                                renderBangumiScore(dom);
                            });
                        })
                    });
                    isScheduled = false; // 
                    observer.observe(targetContainer, options);
                });
            }
        });

        // 配置观察选项（按需调整）
        const options = {
            childList: true,    // 观察子节点变化
            subtree: true,      // 观察所有后代节点
            attributes: true,   // 观察属性变化
            characterData: true // 观察文本内容变化
        };

        // 开始观察
        observer.observe(targetContainer, options);
    }

    elmGetter.selector($)

    // 2. 使用判断结果执行逻辑
    if (isBilibiliEpPage()) {
        console.log("init bgm rating");
        initBangumiRating();
    } else if (isBiliBiliAnimeIndexPage()) {
        // window.addEventListener('load', async () => {
        //     await elmGetter.get('.bangumi-title')
        //     renderBiliScores();
        //     renderBangumiScores();
        // });

        observePageChanges();
    }
})();
