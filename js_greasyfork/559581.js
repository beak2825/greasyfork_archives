// ==UserScript==
// @name         Bing Rewards每日任务脚本（100词搜索大力版）
// @version      V1.1
// @description  自动完成微软Rewards每日搜索任务，基于怀沙2049的改进，加入更多热词+乱序，支持单次100个热词搜索
// @note         更新于 2025年12月15日
// @author       hyque
// @match        https://*.bing.com/*
// @exclude      https://rewards.bing.com/*
// @license      GNU GPLv3
// @icon         https://www.bing.com/favicon.ico
// @connect      gumengya.com
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @namespace    https://greasyfork.org/zh-CN/scripts/559581
// @downloadURL https://update.greasyfork.org/scripts/559581/Bing%20Rewards%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8A%A1%E8%84%9A%E6%9C%AC%EF%BC%88100%E8%AF%8D%E6%90%9C%E7%B4%A2%E5%A4%A7%E5%8A%9B%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/559581/Bing%20Rewards%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8A%A1%E8%84%9A%E6%9C%AC%EF%BC%88100%E8%AF%8D%E6%90%9C%E7%B4%A2%E5%A4%A7%E5%8A%9B%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

var max_rewards = 60; //重复执行的次数，目前默认60
var pause_time = 1080000; // 1080000毫秒，建议不超过16分钟
var search_words = []; //搜索词
var appkey = ""; // 从https://www.gmya.net/api 网站申请的热门词接口APIKEY
var Hot_words_apis = "https://api.gmya.net/Api/"; // 故梦热门词API接口网站

// 默认搜索词，热门搜索词请求失败时使用
var default_search_words = [
    "床前明月光，疑是地上霜", "举头望明月，低头思故乡", "桃花潭水深千尺，不及汪伦送我情", "两岸猿声啼不住，轻舟已过万重山", "白日依山尽，黄河入海流",
    "红豆生南国，春来发几枝", "会当凌绝顶，一览众山小", "欲穷千里目，更上一层楼", "千山我独行，不必相送", "大漠孤烟直，长河落日圆",
    "春眠不觉晓，处处闻啼鸟", "无边落木萧萧下，不尽长江滚滚来", "月落乌啼霜满天，江枫渔火对愁眠", "相见时难别亦难，东风无力百花残", "且将新火试新茶，诗酒趁年华",
    "杨柳青青江水平，闻郎江上唱", "天接云涛连晓雾，星河欲转千帆舞", "举杯邀明月，对影成三人", "春风得意马蹄疾，一日看尽长安花", "会当凌绝顶，一览众山小",
    "天高地迥，觉宇宙之无穷", "野火烧不尽，春风吹又生", "黑云压城城欲摧，甲光向日金鳞开", "一片冰心在玉壶", "空山新雨后，天气晚来秋",
    "过江千尺浪，入船十里流", "千里之堤毁于蚁穴", "人生自是有情痴，此恨不关风与月", "知我者，谓我心忧，不知我者，谓我何求", "浪花有意千重雪，桃花无言一对愁",
    "天道酬勤，月明星稀", "西出阳关无故人", "采得百花成蜜后，为谁辛苦为谁甜", "孤帆远影碧空尽，唯见长江天际流", "我寄愁心与明月，随君直到夜郎西",
    "黄河远上白云间，一片孤城万仞山", "谁言寸草心，报得三春晖", "劝君更尽一杯酒，西出阳关无故人", "欲穷千里目，更上一层楼", "青青园中葵，朝露待日晞"
];

// 热词来源
var keywords_source = ['DouYinHot', 'WeiBoHot', 'TouTiaoHot', 'BaiduHot', 'ITHomeRSS'];
var current_source_index = 0; // 当前搜索词来源的索引

/**
 * 尝试从多个搜索词来源获取搜索词，如果所有来源都失败，则返回默认搜索词。
 * @returns {Promise<string[]>} 返回搜索到的name属性值列表或默认搜索词列表
 */
async function douyinhot_dic() {
    let allWords = [];
    while (current_source_index < keywords_source.length) {
        const source = keywords_source[current_source_index]; // 获取当前搜索词来源
        let url;

        // 根据appkey是否为空来决定如何构建 URL地址
        if (appkey) {
            url = Hot_words_apis + source + "?format=json&appkey=" + appkey;
        } else {
            url = Hot_words_apis + source; // 无appkey则直接请求接口地址
        }

        try {
            const response = await fetch(url); // 发起网络请求
            if (!response.ok) {
                throw new Error('HTTP error! status: ' + response.status);
            }
            const data = await response.json(); // 解析响应内容为JSON

            if (data.data && data.data.length) {
                // 如果数据中存在有效项
                const names = data.data.map(item => item.title);
                allWords = allWords.concat(names);
            }
        } catch (error) {
            // 当前来源请求失败，记录错误并尝试下一个来源
            console.error('搜索词来源请求失败:', error);
        }

        // 尝试下一个搜索词来源
        current_source_index++;
    }

    // 所有搜索词来源都已尝试且失败，使用默认热词
    if (allWords.length === 0) {
        console.error('所有搜索词来源请求失败，使用默认热词');
        allWords = default_search_words;
    }

    // 打乱热词顺序并返回
    return allWords.sort(() => Math.random() - 0.5).slice(0, max_rewards); // 保证获取100条
}

// 执行搜索
douyinhot_dic()
    .then(names => {
        search_words = names; // 获取热词
        exec(); // 执行搜索
    })
    .catch(error => {
        console.error(error);
    });

// 定义菜单命令：开始
let menu1 = GM_registerMenuCommand('开始', function () {
    GM_setValue('Cnt', 0); // 将计数器重置为0
    location.href = "https://www.bing.com/?br_msg=Please-Wait"; // 跳转到Bing首页
}, 'o');

// 定义菜单命令：停止
let menu2 = GM_registerMenuCommand('停止', function () {
    GM_setValue('Cnt', max_rewards + 10); // 将计数器设置为超过最大搜索次数，以停止搜索
}, 'o');

// 自动将字符串中的字符进行替换
function AutoStrTrans(st) {
    let yStr = st; // 原字符串
    let rStr = ""; // 插入的混淆字符
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
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function exec() {
    let randomDelay = Math.floor(Math.random() * 60000) + 20000; // 生成20秒到60秒之间的随机数
    let randomString = generateRandomString(4); //生成4个长度的随机字符串
    let randomCvid = generateRandomString(32); //生成32位长度的cvid

    'use strict';

    if (GM_getValue('Cnt') == null) {
        GM_setValue('Cnt', max_rewards + 10);
    }

    let currentSearchCount = GM_getValue('Cnt');
    if (currentSearchCount <= max_rewards / 2) {
        let tt = document.getElementsByTagName("title")[0];
        tt.innerHTML = "[" + currentSearchCount + " / " + max_rewards + "] " + tt.innerHTML;
        smoothScrollToBottom(); // 滚动页面到底部
        GM_setValue('Cnt', currentSearchCount + 1);
        setTimeout(function () {
            let nowtxt = search_words[currentSearchCount];
            nowtxt = AutoStrTrans(nowtxt);
            if ((currentSearchCount + 1) % 5 === 0) {
                setTimeout(function () {
                    location.href = "https://www.bing.com/search?q=" + encodeURI(nowtxt) + "&form=" + randomString + "&cvid=" + randomCvid;
                }, pause_time);
            } else {
                location.href = "https://www.bing.com/search?q=" + encodeURI(nowtxt) + "&form=" + randomString + "&cvid=" + randomCvid;
            }
        }, randomDelay);
    } else if (currentSearchCount > max_rewards / 2 && currentSearchCount < max_rewards) {
        let tt = document.getElementsByTagName("title")[0];
        tt.innerHTML = "[" + currentSearchCount + " / " + max_rewards + "] " + tt.innerHTML;
        smoothScrollToBottom(); // 滚动页面到底部
        GM_setValue('Cnt', currentSearchCount + 1);

        setTimeout(function () {
            let nowtxt = search_words[currentSearchCount];
            nowtxt = AutoStrTrans(nowtxt);
            if ((currentSearchCount + 1) % 5 === 0) {
                setTimeout(function () {
                    location.href = "https://cn.bing.com/search?q=" + encodeURI(nowtxt) + "&form=" + randomString + "&cvid=" + randomCvid;
                }, pause_time);
            } else {
                location.href = "https://cn.bing.com/search?q=" + encodeURI(nowtxt) + "&form=" + randomString + "&cvid=" + randomCvid;
            }
        }, randomDelay);
    }

    // 实现平滑滚动到页面底部的函数
    function smoothScrollToBottom() {
        document.documentElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
}
