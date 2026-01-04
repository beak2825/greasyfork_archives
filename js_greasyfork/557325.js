// ==UserScript==
// @name         HLV中文化 (修复版)
// @namespace    http://tampermonkey.net/
// @version      1.6.0-fix
// @license      MIT
// @description  手动替换一些HLTV数据页容易被错误机翻的词汇，包含导航栏修复
// @author       ST & Fixed by sanba
// @match        https://www.hltv.org/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557325/HLV%E4%B8%AD%E6%96%87%E5%8C%96%20%28%E4%BF%AE%E5%A4%8D%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557325/HLV%E4%B8%AD%E6%96%87%E5%8C%96%20%28%E4%BF%AE%E5%A4%8D%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 词典
    const dictionary = {
        // === 导航栏 & 菜单 (新增优化) ===
        'News': '新闻',
        'Matches': '赛事', // 原为“赛事列表”，导航栏简短一点更好，也可改为“比赛”
        'Results': '赛果', // 原为“赛果速递”
        'Events': '赛事日历',
        'Players': '选手',
        'Stats': '数据',
        'Fantasy': '梦幻联赛',
        'Forum': '论坛',
        'Media': '媒体',
        'Betting': '博彩',
        'Live': '直播',

        // === 地图翻译 ===
        'Dust2': '沙漠2',
        'Dust 2': '沙漠2',
        'Inferno': '炼狱小镇',
        'Mirage': '荒漠迷城',
        'Nuke': '核子危机',
        'Overpass': '死亡游乐园',
        'Vertigo': '殒命大厦',
        'Ancient': '远古遗迹',
        'Train': '列车停放站',
        'Cache': '仓库',
        'Anubis':'阿努比斯',

        // === 大洲/地区 ===
        'Grouped events':'各地区赛事日历',
        'Location':'地区',
        'Asia': '亚洲',
        'AS': '亚洲',
        'Europe': '欧洲',
        'EU': '欧洲',
        'North America': '北美洲',
        'NA': '北美洲',
        'South America': '南美洲',
        'SA': '南美洲',
        'Oceania': '大洋洲',
        'OCE': '大洋洲',
        'Africa': '非洲',
        'AF': '非洲',
        'Pacific':'太平洋',
        'Asia-Pacific':'亚太地区',

        // === 赛事相关 ===
        'Group': '小组赛',
        'Playoffs': '季后赛',
        'Qualifier': '预选赛',
        'Grand Final': '总决赛',
        'Closed': '封闭',
        'Prize pool':'总奖金',
        'Date':'日期',
        'Teams':'战队',
        'Related events':'关联赛事',
        'Formats':"安排",
        'Group stage':'小组赛阶段',
        'the Upper bracket':'胜者组',
        'the Lower bracket':'败者组',
        'Upper bracket':'胜者组',
        'Lower bracket':'败者组',
        'Double elimination':'双败',
        'with 1-0 map advantage for':'图一直接获胜对于',
        'places go to':'名前往',
        'semi-finals':'半决赛',
        'quarter-finals':'1/4决赛',
        'Round 1':'第一轮',
        'Round-robin':'循环赛',
        'Matches, past 3 months':'过去3个月对战数据',
        'Group Swiss':'小组循环赛',
        'Prize distribution':'奖金分配',
        'Highlights':'精彩瞬间',
        'Now playing':'最近高光',
        'Browse highlights':'浏览更多高光',
        'Teams attending':'参赛战队',
        'Swiss':'循环赛',
        'Single elimination':'单败',

        // === 侧边/其他菜单 ===
        'Ranking': '战队排名',
        'Galleries': '赛事图集',
        'Overview': '概览',
        'Detailed':'详细的',

        // === 比赛数据 ===
        'KD diff': '击杀差',
        'Kills': '击杀数',
        'Headshot %': '爆头率',
        'ADR': '场均伤害',
        'Team': '战队',
        'Online':'线上',
        'Map pool':'地图池',
        'Map stats':'地图数据',
        'removed':"Ban掉了",
        'picked ':'选择了',
        'picked':'选择了',
        'Winner qualifies for':'胜者晋级',
        'was left over':'剩下了',
        'Analytics center':'数据分析',
        'Pick a winner':'预测胜者',
        'Scoreboard':'数据统计',
        'Game log':'比赛日志',
        'Live win probability':'实时胜率',
        'Fantasy games':'梦幻联赛', // 兼容长词
        'Best of':'BO',
        'Maps':'地图',
        'Watch':'观看',
        'Hide minimap':'隐藏小地图',
        'Normal':'常规',
        'Advanced':'高级',
        'Op.duels':'对位单杀',
        '2+kills':'多杀',
        '1vsX':'一打多',
        'Head to head':'历史对战结果',
        'Wins':'胜利',
        'Overtimes':'加时',
        'Side':'阵营',
        'match win streak':'场连胜',
        'World rank':'世界排名',
        'Top player in match':'单局最佳',
        'RECENT ACTIVITY':'最新消息',
        'Team stats':'战队数据',
        'TOP 30 TRANSFERS':'转会TOP30',
        '3rd Place Decider Match':'季军争夺赛',
        '3rd place decider match':'季军争夺赛',
        'Start date':'开始日期',
        'End date':'结束日期',
        'Group play':'小组赛',
        'Total prize pool':'总奖金',
        'Player share':'选手奖金',
        'Event type':'赛事类型',
        'Brackets':'赛程',
        'Event data':'赛事数据',
        'Quarter-finals':'1/4决赛',
        'Semi-finals':'半决赛',
        'Tiebreaker':'决胜局',
        'Semi-final':'半决赛',
        'All maps':'所有地图',
        'Match stats':'比赛数据',
        'Both':'双边',
        'Terrorist':'T',
        'Counter-Terrorist':'CT',
        'VRS forecast':'V社排名(积分)预测',
        'VRS result ?':'V社排名(积分)大概的结果',
        'current':'当前',
        'if':'',
        'team wins':'如果赢了',
        'team loses':'如果输了',
        'Match lineup core winrate, past 3 months, min. 3 maps played':'地图胜率',
        'Core':'核心',
        'before':'之前',
        'result':'结果',
        'Match over':'比赛已结束',
        'Match not started':'比赛未开始',
        'round 2':'第二轮',
        'round 3':'第三轮',
        'round 1':'第一轮',
        'teams with a ':'战绩为',
        ' record':'的队伍',
        'LAN':'线下',
        'All streams':'所有直播',
        'Map over.':'本图已结束',
        'Player profile':'选手数据',
        'Highlighted stats':'数据对比',
        'Kills per round':'平均每回合击杀',
        'Deaths per round':'平均每回合死亡',
        'Impact':'影响',
        'Average damage per round':'平均每回合伤害',
        'Full comparison':'全面数据对比',
        'Past 3 months':'过去3个月',
        'elimination match':'淘汰赛',
        'round 4':'第四轮',
        'Losing':'输了的',
        'Winning':'赢了的',
        'is eliminated':'被淘汰',

        'TBA':'待定',
        // === 战队信息 ===
        'Roster': '战队阵容',
        'Coach': '教练',
        'Stand-in': '替补选手',
        'Lineups':'阵容',
    };

    // 高级配置
    const config = {
        skipTags: ['SCRIPT', 'STYLE', 'TEXTAREA', 'CODE', 'PRE', 'TIME', 'INPUT'],
        skipClasses: ['moment-timestamp'],
        mainContainer: 'body'
    };

    function formatDates(text) {
        const monthToNumber = {
            'January': '1', 'February': '2', 'March': '3', 'April': '4',
            'May': '5', 'June': '6', 'July': '7', 'August': '8',
            'September': '9', 'October': '10', 'November': '11', 'December': '12',
            'Jan': '1', 'Feb': '2', 'Mar': '3', 'Apr': '4',
            'May': '5', 'Jun': '6', 'Jul': '7', 'Aug': '8',
            'Sep': '9', 'Oct': '10', 'Nov': '11', 'Dec': '12'
        };

        text = text.replace(/(\d+)(?:st|nd|rd|th) of ([A-Za-z]+) (\d{4})/gi, (match, day, month, year) => {
            return `${year}年${monthToNumber[month] || month}月${day}日`;
        });
        text = text.replace(/([A-Za-z]+) (\d{1,2}), (\d{4})/g, (match, month, day, year) => {
            return `${year}年${monthToNumber[month] || month}月${day}日`;
        });
        text = text.replace(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{1,2})/g, (match, month, day) => {
            return `${monthToNumber[month] || month}月${day}日`;
        });

        return text;
    }

    function replaceText(node) {
        if (!node || !node.isConnected) return;

        if (node.nodeType === Node.TEXT_NODE &&
            node.textContent.trim() &&
            !config.skipClasses.some(c => node.parentElement && node.parentElement.classList.contains(c))) {

            let text = node.textContent;
            let originalText = text;

            text = formatDates(text);

            // 词典键值按长度排序，确保 "Fantasy games" 在 "Fantasy" 之前被匹配
            const sortedKeys = Object.keys(dictionary).sort((a, b) => b.length - a.length);

            sortedKeys.forEach(key => {
                const regex = new RegExp(`\\b${key}\\b`, 'gi');
                if (regex.test(text)) {
                    text = text.replace(regex, match => {
                         return dictionary[key];
                    });
                }
            });

            if (text !== originalText) {
                node.textContent = text;
            }
        }
    }

    function walkDOM(target) {
        const treeWalker = document.createTreeWalker(
            target,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: node => {
                    if (!node.parentNode) return NodeFilter.FILTER_REJECT;
                    return config.skipTags.includes(node.parentNode.nodeName)
                        ? NodeFilter.FILTER_REJECT
                        : NodeFilter.FILTER_ACCEPT;
                }
            },
            false
        );

        const nodes = [];
        let currentNode;
        while ((currentNode = treeWalker.nextNode())) {
            nodes.push(currentNode);
        }
        nodes.forEach(replaceText);
    }

    walkDOM(document.body);

    const observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                shouldUpdate = true;
            }
        });

        if (shouldUpdate) {
            walkDOM(document.body);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();