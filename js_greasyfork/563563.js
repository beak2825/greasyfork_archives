// ==UserScript==
// @name         Microsoft Bing Rewards GPT update
// @version      V1.0.0
// @description  自动完成微软Rewards每日搜索任务,每次运行时获取热门词,避免使用同样的搜索词被封号；隔天自动运行；更换热门词API接口。
// @note         2026年1月21日
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yaohuo.me
// @namespace    http://yaohuo.me/
// @author       我黄某与赌毒不两立
// @match        https://*.bing.com/*
// @exclude      https://rewards.bing.com/*
// @license      GNU GPLv3
// @icon         https://www.bing.com/favicon.ico
// @connect      gumengya.com
// @connect      rewards.bing.com
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/563563/Microsoft%20Bing%20Rewards%20GPT%20update.user.js
// @updateURL https://update.greasyfork.org/scripts/563563/Microsoft%20Bing%20Rewards%20GPT%20update.meta.js
// ==/UserScript==

var default_max_rewards = 40; //默认重复执行的次数
var max_rewards = default_max_rewards; //当前执行次数
var progress_complete = false;
var done_timer = null;
var search_cache = [];
var search_cache_inflight = null;
var used_words = Object.create(null);
//每执行4次搜索后插入暂停时间,解决账号被监控不增加积分的问题
var pause_time = { min: 360000, max: 720000 }; // 随机暂停时长 360-720 秒
var appkey = "";//从https://api.pearktrue.cn/dashboard/profile 网站申请的热门词接口APIKEY

var Hot_words_apis = "https://api.pearktrue.cn/api/dailyhot/"
var keywords_source = ['NGA','游研社','爱范儿','百度贴吧','豆瓣讨论','虎扑','虎嗅','今日头条','36氪','微博','哔哩哔哩'];


//默认搜索词，热门搜索词请求失败时使用
var default_search_words = ["盛年不重来，一日难再晨", "千里之行，始于足下", "少年易学老难成，一寸光阴不可轻", "敏而好学，不耻下问", "海内存知已，天涯若比邻", "三人行，必有我师焉",
    "莫愁前路无知已，天下谁人不识君", "人生贵相知，何用金与钱", "天生我材必有用", "海纳百川有容乃大；壁立千仞无欲则刚", "穷则独善其身，达则兼济天下", "读书破万卷，下笔如有神",
    "学而不思则罔，思而不学则殆", "一年之计在于春，一日之计在于晨", "莫等闲，白了少年头，空悲切", "少壮不努力，老大徒伤悲", "一寸光阴一寸金，寸金难买寸光阴", "近朱者赤，近墨者黑",
    "吾生也有涯，而知也无涯", "纸上得来终觉浅，绝知此事要躬行", "学无止境", "己所不欲，勿施于人", "天将降大任于斯人也", "鞠躬尽瘁，死而后已", "书到用时方恨少", "天下兴亡，匹夫有责",
    "人无远虑，必有近忧", "为中华之崛起而读书", "一日无书，百事荒废", "岂能尽如人意，但求无愧我心", "人生自古谁无死，留取丹心照汗青", "吾生也有涯，而知也无涯", "生于忧患，死于安乐",
    "言必信，行必果", "读书破万卷，下笔如有神", "夫君子之行，静以修身，俭以养德", "老骥伏枥，志在千里", "一日不读书，胸臆无佳想", "王侯将相宁有种乎", "淡泊以明志。宁静而致远,", "卧龙跃马终黄土"]
//{weibohot}微博热搜榜//{douyinhot}抖音热搜榜/{zhihuhot}知乎热搜榜/{baiduhot}百度热搜榜/{toutiaohot}今日头条热搜榜/


var REWARD_API_URL = 'https://rewards.bing.com/api/getuserinfo?type=1';

function getTodayKey() {
    return new Date().toDateString();
}

function loadMaxRewardsCache() {
    var cachedDate = GM_getValue('MaxRewardsDate', '');
    if (cachedDate !== getTodayKey()) {
        return false;
    }
    var cachedMax = GM_getValue('MaxRewards', null);
    var parsed = Number(cachedMax);
    if (!isFinite(parsed)) {
        return false;
    }
    max_rewards = parsed;
    progress_complete = !!GM_getValue('ProgressComplete', false);
    return true;
}

function saveMaxRewardsCache() {
    GM_setValue('MaxRewards', max_rewards);
    GM_setValue('MaxRewardsDate', getTodayKey());
    GM_setValue('ProgressComplete', progress_complete);
}

/**
 * 检查是否需要重置搜索计数（每天00:00）
 * @returns {boolean} 如果是新的一天，返回 true
 */
function checkAndResetDaily() {
    const today = getTodayKey();
    const lastReset = GM_getValue('lastReset', '');

    if (lastReset !== today) {
        GM_setValue('Cnt', 0);
        GM_setValue('lastReset', today);
        search_cache = [];
        search_cache_inflight = null;
        used_words = Object.create(null);
        progress_complete = false;
        GM_setValue('ProgressComplete', false);
        return true;
    }
    return false;
}

function extractPcSearchProgress(data) {
    var dash = (data && (data.dashboard || data)) || null;
    var counters = dash && dash.userStatus && dash.userStatus.counters;
    if (!counters) return null;

    var pcCounter = counters.pcSearch;
    if (!pcCounter) return null;

    //console.log('pcSearch counters:', pcCounter);

    if (Array.isArray(pcCounter)) {
        var sumMax = 0;
        var sumCur = 0;
        pcCounter.forEach(function (item) {
            sumMax += Number(item.pointProgressMax || item.pointMax || 0);
			console.log('pointProgressMax:', item.pointProgressMax);
			console.log('pointProgress:', item.pointProgress);
            sumCur += Number(item.pointProgress || 0);
        });
        return { max: sumMax, cur: sumCur };
    }

    return {
        max: Number(pcCounter.pointProgressMax || pcCounter.pointMax || 0),
        cur: Number(pcCounter.pointProgress || 0)
    };
}

function fetchPcSearchProgress() {
    return new Promise(function (resolve) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: REWARD_API_URL,
            onload: function (res) {
                try {
                    var data = JSON.parse(res.responseText);
                    resolve(extractPcSearchProgress(data));
                } catch (e) {
                    resolve(null);
                }
            },
            onerror: function () { resolve(null); }
        });
    });
}

function calcMaxRewardsFromProgress(progress) {
    progress_complete = false;
    if (!progress) return default_max_rewards;
    var max = Number(progress.max);
    var cur = Number(progress.cur);
    if (!isFinite(max) || !isFinite(cur)) return default_max_rewards;

    var diff = max - cur;
    if (max !== 0 && cur !== 0 && diff === 0) {
        progress_complete = true;
        return 0;
    }

    var runTimes = Math.ceil(diff / 3) + 3;
    if (!isFinite(runTimes) || runTimes <= 0) return default_max_rewards;
    return runTimes;
}

async function refreshMaxRewards(force) {
    if (!force && loadMaxRewardsCache()) {
        return;
    }
    var progress = await fetchPcSearchProgress();
    max_rewards = calcMaxRewardsFromProgress(progress);
    saveMaxRewardsCache();
}

async function confirmDailyProgress() {
    var progress = await fetchPcSearchProgress();
    if (!progress) return null;
    max_rewards = calcMaxRewardsFromProgress(progress);
    saveMaxRewardsCache();
    return progress_complete;
}

function setDoneTitle() {
    if (!progress_complete) return;
    var baseTitle = document.title.replace(/^(\[[^\]]*\]\s*)+/, '');
    function getMsUntilMidnight() {
        var now = new Date();
        var midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        return midnight.getTime() - now.getTime();
    }
    function formatCountdown(ms) {
        var totalMinutes = Math.max(0, Math.ceil(ms / 60000));
        var hours = Math.floor(totalMinutes / 60);
        var minutes = totalMinutes % 60;
        return "[" + hours + "h" + minutes + "m]";
    }
    function updateTitle() {
        var remainingMs = getMsUntilMidnight();
        document.title = formatCountdown(remainingMs) + baseTitle;
    }
    updateTitle();
    if (done_timer) {
        clearInterval(done_timer);
    }
    done_timer = setInterval(updateTitle, 60000);
}

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 尝试从多个搜索词来源获取搜索词，如果所有来源都失败，则返回默认搜索词。
 * @returns {Promise<string[]>} 返回搜索到的name属性值列表或默认搜索词列表
 */
async function douyinhot_dic() {
    var sources = keywords_source.slice();
    var all = [];
    var seen = Object.create(null);

    for (var i = 0; i < sources.length; i++) {
        var source = sources[i];
        let url;
        //根据 appkey 是否为空来决定如何构建 URL地址,如果appkey为空,则直接请求接口地址
        if (appkey) {
            url = Hot_words_apis + '?title=' + source;//无appkey则直接请求接口地址//有appkey则添加appkey参数
        } else {
            url = Hot_words_apis + '?title=' + source;//无appkey则直接请求接口地址//无appkey则直接请求接口地址
        }
        try {
            const response = await fetch(url); // 发起网络请求
            if (!response.ok) {
                throw new Error('HTTP error! status: ' + response.status); // 如果响应状态不是OK，则抛出错误
            }
            const data = await response.json(); // 解析响应内容为JSON

            if (Array.isArray(data.data)) {
                data.data.forEach(function (item) {
                    var title = item && item.title;
                    if (!title || used_words[title]) return;
                    if (!seen[title]) {
                        seen[title] = true;
                        all.push(title);
                    }
                });
            }
        } catch (error) {
            // 当前来源请求失败，记录错误并尝试下一个来源
            console.error('搜索词来源请求失败:', error);
        }
    }

    if (all.length > 0) {
        return all; // 返回搜索到的title属性值列表
    }

    // 所有搜索词来源都已尝试且失败
    console.error('所有搜索词来源请求失败');
    return default_search_words.slice(); // 返回默认搜索词列表
}

function takeRandomFromCache() {
    if (!search_cache.length) return null;
    var idx = Math.floor(Math.random() * search_cache.length);
    return search_cache.splice(idx, 1)[0];
}

async function refillSearchCache() {
    var names = await douyinhot_dic();
    if (!Array.isArray(names)) {
        names = [];
    }
    if (names.length === 0) {
        names = default_search_words.slice();
    }
    search_cache = names.filter(function (name) {
        return name && !used_words[name];
    });
    if (search_cache.length === 0) {
        used_words = Object.create(null);
        search_cache = names.slice();
    }
}

async function ensureSearchCache() {
    if (search_cache.length > 0) return;
    if (search_cache_inflight) {
        await search_cache_inflight;
        return;
    }
    search_cache_inflight = refillSearchCache()
        .catch(function (error) {
            console.error(error);
        })
        .finally(function () {
            search_cache_inflight = null;
        });
    await search_cache_inflight;
}

async function getRandomSearchWord() {
    await ensureSearchCache();
    var word = takeRandomFromCache();
    if (!word) {
        await refillSearchCache();
        word = takeRandomFromCache();
    }
    if (!word) {
        word = pickRandom(default_search_words);
    }
    if (word) {
        used_words[word] = true;
    }
    return word;
}

// 执行搜索
(async function () {
    try {
        checkAndResetDaily();
        await refreshMaxRewards(false);
        if (max_rewards <= 0) {
            setDoneTitle();
            return;
        }
        exec();
    } catch (error) {
        console.error(error);
    }
})();

// 定义菜单命令：开始
let menu1 = GM_registerMenuCommand('开始', async function () {
    GM_setValue('Cnt', 0); // 将计数器重置为0
    GM_setValue('Stop', false);
    checkAndResetDaily();
    await refreshMaxRewards(true);
    if (max_rewards <= 0) {
        setDoneTitle();
        return;
    }
    location.href = "https://www.bing.com/?br_msg=Please-Wait"; // 跳转到Bing首页
}, 'o');

// 定义菜单命令：停止
let menu2 = GM_registerMenuCommand('停止', function () {
    GM_setValue('Stop', true);
    GM_setValue('Cnt', max_rewards + 10); // 将计数器设置为超过最大搜索次数，以停止搜索
}, 'o');

// 自动将字符串中的字符进行替换
function AutoStrTrans(st) {
    let yStr = st; // 原字符串
    let rStr = ""; // 插入的混淆字符，可以自定义自己的混淆字符串
    let zStr = ""; // 结果字符串
    let prePo = 0;
    for (let i = 0; i < yStr.length;) {
        let step = parseInt(Math.random() * 5) + 1; // 随机生成步长
        if (i > 0) {
            zStr = zStr + yStr.substr(prePo, i - prePo) + rStr; // 将插入字符插入到相应位置
            prePo = i;
        }
        i = i + step;
    }
    if (prePo < yStr.length) {
        zStr = zStr + yStr.substr(prePo, yStr.length - prePo); // 将剩余部分添加到结果字符串中
    }
    return zStr;
}

// 生成指定长度的包含大写字母、小写字母和数字的随机字符串
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        // 从字符集中随机选择字符，并拼接到结果字符串中
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function startCountdownTitle(totalMs, count, max, baseTitle) {
    var remaining = Math.max(0, Math.ceil(totalMs / 1000));
    function updateTitle() {
        document.title = "[" + remaining + "s][" + count + "/" + max + "]" + baseTitle;
    }
    updateTitle();
    var timer = setInterval(function () {
        remaining -= 1;
        if (remaining <= 0) {
            remaining = 0;
            updateTitle();
            clearInterval(timer);
            return;
        }
        updateTitle();
    }, 1000);
}

async function exec() {
    function getPauseDelay() {
        return Math.floor(Math.random() * (pause_time.max - pause_time.min + 1)) + pause_time.min;
    }
    function getScrollDelay() {
        return Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;
    }
    // 生成随机延迟时间
    let randomDelay = Math.floor(Math.random() * (360000 - 180000 + 1)) + 180000; // 生成180秒到360秒之间的随机数
    let randomString = generateRandomString(4); //生成4个长度的随机字符串
    let randomCvid = generateRandomString(32); //生成32位长度的cvid
    'use strict';
    var baseTitle = document.title.replace(/^(\[[^\]]*\]\s*)+/, '');

    if (GM_getValue('Stop', false)) {
        return;
    }

    if (max_rewards <= 0) {
        setDoneTitle();
        return;
    }

    // 检查计数器的值，若为空则设置为超过最大搜索次数
    if (GM_getValue('Cnt') == null) {
        GM_setValue('Cnt', 0);
    }

    // 获取当前搜索次数
    let currentSearchCount = GM_getValue('Cnt');
    // 根据计数器的值选择搜索引擎
    if (currentSearchCount <= max_rewards / 2) {
        setTimeout(smoothScrollToBottom, getScrollDelay()); // 随机延迟后滚动页面到底部
        GM_setValue('Cnt', currentSearchCount + 1); // 将计数器加1
        let nowtxt = await getRandomSearchWord(); // 从接口随机获取搜索词
        nowtxt = AutoStrTrans(nowtxt); // 对搜索词进行替换
        var totalDelay = randomDelay + (((currentSearchCount + 1) % 5 === 0) ? getPauseDelay() : 0);
        startCountdownTitle(totalDelay, currentSearchCount, max_rewards, baseTitle);
        setTimeout(function () {
            location.href = "https://www.bing.com/search?q=" + encodeURI(nowtxt) + "&form=" + randomString + "&cvid=" + randomCvid; // 在Bing搜索引擎中搜索
        }, totalDelay);
    } else if (currentSearchCount > max_rewards / 2 && currentSearchCount < max_rewards) {
        setTimeout(smoothScrollToBottom, getScrollDelay()); // 随机延迟后滚动页面到底部
        GM_setValue('Cnt', currentSearchCount + 1); // 将计数器加1

        let nowtxt = await getRandomSearchWord(); // 从接口随机获取搜索词
        nowtxt = AutoStrTrans(nowtxt); // 对搜索词进行替换
        var totalDelay = randomDelay + (((currentSearchCount + 1) % 5 === 0) ? getPauseDelay() : 0);
        startCountdownTitle(totalDelay, currentSearchCount, max_rewards, baseTitle);
        setTimeout(function () {
            location.href = "https://cn.bing.com/search?q=" + encodeURI(nowtxt) + "&form=" + randomString + "&cvid=" + randomCvid; // 在Bing搜索引擎中搜索
        }, totalDelay);
    }
    if (currentSearchCount >= max_rewards) {
        if (progress_complete) {
            setDoneTitle();
            return;
        }
        var confirmed = await confirmDailyProgress();
        if (confirmed || max_rewards <= 0) {
            setDoneTitle();
            return;
        }
        GM_setValue('Cnt', 0);
        exec();
        return;
    }

    // 午夜后重置并重新运行
    const now = new Date();
    const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
    setTimeout(function () {
        if (checkAndResetDaily()) {
            refreshMaxRewards(true)
                .then(function () {
                    if (max_rewards <= 0) {
                        setDoneTitle();
                        return;
                    }
                    exec();
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }, msUntilMidnight);
    // 实现平滑滚动到页面底部的函数
    function smoothScrollToBottom() {
         document.documentElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
}
