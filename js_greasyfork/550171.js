// ==UserScript==
// @name                【自用】F95助手
// @name:en             F95 Helper
// @namespace           https://greasyfork.org/users/1215910
// @icon                https://www.google.com/s2/favicons?sz=64&domain=f95zone.to
// @version             5.2.0
// @description         ①F95页面标签汉化，黑白名单。②F95、VNDB、SteamDB页面提取游戏信息。③在三个网站之间智能跳转。④自定义本地游戏信息。⑤独立管理我的游戏库。⑥分享游戏数据。（更详细的功能请见页面介绍和代码内的注释）
// @description:en      This plugin is designed for Chinese players. Some of its features may not be suitable for native English speakers. Of course, if you like the other features, feel free to take the code and use it.
// @author              诉语
// @match               https://f95zone.to/threads/*
// @match               https://f95zone.to/game
// @match               https://vndb.org/v*
// @match               https://steamdb.info/app/*
// @match               https://store.steampowered.com/app/*
// @grant               GM_setValue
// @grant               GM_getValue
// @grant               GM_registerMenuCommand
// @grant               GM_openInTab
// @homepage            https://greasyfork.org/scripts/550171
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/550171/%E3%80%90%E8%87%AA%E7%94%A8%E3%80%91F95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/550171/%E3%80%90%E8%87%AA%E7%94%A8%E3%80%91F95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // ==================== 用户配置 ====================
    // 分享功能的导出配置预设
    const SHARE_PRESETS = {
        // 配置一：全分享 (包含所有私人记录)
        FULL: {
            useBase64: true,
            fields: { basic: true, ids: true, links: true, props: true, playStatus: true, comments: true }
        },
        // 配置二：智能分享 (去除私人游玩记录)
        SMART: {
            useBase64: true,
            fields: { basic: true, ids: true, links: true, props: true, playStatus: false, comments: true }
        },
        // 配置三：只分享基本数据 (仅ID、基础属性、链接)
        BASIC: {
            useBase64: true,
            fields: { basic: true, ids: true, links: true, props: true, playStatus: false, comments: false }
        }
    };
    // 当前使用的导出配置
    const CURRENT_SHARE_CONFIG = SHARE_PRESETS.FULL;

    // 游戏库页面的全局筛选配置
    // userPlayStatus 参考值: 0-关注中, 1-准备玩, 2-追更中, 3-已完成, 9-黑名单
    // gameDevStatus  参考值: '更新中', '完成', '弃坑'
    const LIB_FILTER_SETTINGS = {
        userPlayStatus: [],     
        gameDevStatus: [],
        // 示例：
        // userPlayStatus: [9, 3],      // 屏蔽：游玩进度为 3-已完成，9-黑名单 的游戏
        // gameDevStatus: ['弃坑'],     // 屏蔽：开发进度为 '弃坑' 的游戏
        // gameCGEngine: ['AI'],        // 屏蔽：CG引擎为 'AI' 的游戏
    };

    // ==================== 更新日志数据 ====================
    const CHANGELOGS = [
        {
            version: '5.2.0',
            date: '2026-01-09',
            content: [
                '【新增】新增字段“NTR题材”，并自动从F95页面获取。',
                '【新增】新增更新内容提示。',
                '【其他】脚本评论区分享了《My Cute Roommate》的[自制汉化包](https://greasyfork.org/scripts/550171/discussions/317833)，分享过期记得提醒我。',
            ]
        },
        {
            version: '5.1.1',
            date: '2025-12-29',
            content: [
                '【新增】新增字段“马赛克”，并自动从F95页面获取。',
                '【修复】紧急修复了steamDB按钮的Bug。'
            ]
        },
        {
            version: '5.1.0',
            date: '2025-12-31',
            content: [
                '【新增】新增字段“音声信息”，并自动从F95页面和SteamDB页面获取。',
                '【新增】为所有页面新增“我的游戏库”按钮入口。',
                '【新增】可以通过配置全局常量 LIB_FILTER_SETTINGS 来预筛选“我的游戏库”中的游戏。不过配置UI暂时没做，需要在脚本中修改。',
                '【修复】其他细节优化和bug修复略。',
            ]
        },
        {
            version: '5.0.1',
            date: '2025-12-29',
            content: [
                '【修复】修复了分享游戏功能丢失评论的问题。',
            ]
        },
        {
            version: '5.0.0',
            date: '2025-12-29',
            content: [
                '【新增】数据库重构，新增字段。大幅扩展本地存储的数据结构，新增游戏类型細分、画风、引擎、汉化详情等十余个字段。',
                '【新增】新增“我的游戏库”管理页面。提供该独立页面用来管理保存的数据，功能强大，详情自行体验。',
                '【优化】彻底重做“编辑数据”页面。现采用三栏宽屏布局，支持全字段编辑，新增评分、游玩状态、多维度评价（优点/缺点/简评）记录。',
                '【新增】新增字段的智能锁定机制。用户手动修改过的数据会自动加锁，防止被网页抓取的更新覆盖，同时支持手动切换锁定状态。',
                '【新增】新增数据导入/导出功能。导入/导出的格式为JSON文件。',
                '【优化】优化“复制信息”按钮。将“复制信息”按钮升级为“保存信息”，点击后默认保存信息到数据库，但不会复制到剪切板（如需复制，在设置中切换为“讲介士”样式）。',
                '【新增】新增游戏分享功能。允许将某个游戏数据通过神秘代码分享给别人，[示例](https://greasyfork.org/scripts/550171/discussions/317833)。',
                '【删除】“收集癖”样式已被删除。',
                '【其他】大量细节优化和bug修复不一而足。',
                '本次更新代码改动量巨大，出现 Bug 在所难免，请多多反馈，这对我非常重要。',
            ]
        },
    ];


    // ==================== 中英对照词典 ====================
    const tagTranslations = {
        "2d game": "2D游戏",
        "2dcg": "2D CG",
        "3d game": "3D游戏",
        "3dcg": "3D CG",
        "adventure": "冒险",
        "ahegao": "阿黑颜",
        "ai cg": "AI CG",
        "anal sex": "肛交",
        "animated": "动画",
        "asset-addon": "素材-插件",
        "asset-ai-shoujo": "素材-AI少女",
        "asset-animal": "素材-动物",
        "asset-animation": "素材-动画",
        "asset-bundle": "素材-合集",
        "asset-character": "素材-角色",
        "asset-clothing": "素材-服装",
        "asset-daz-gen1": "素材-Daz G1",
        "asset-daz-gen2": "素材-Daz G2",
        "asset-daz-gen3": "素材-Daz G3",
        "asset-daz-gen8": "素材-Daz G8",
        "asset-daz-gen81": "素材-Daz G8.1",
        "asset-daz-gen9": "素材-Daz G9",
        "asset-daz-m4": "素材-Daz M4",
        "asset-daz-v4": "素材-Daz V4",
        "asset-environment": "素材-环境",
        "asset-expression": "素材-表情",
        "asset-female": "素材-女性",
        "asset-hair": "素材-头发",
        "asset-hdri": "素材-HDRI",
        "asset-honey-select": "素材-甜心选择",
        "asset-honey-select2": "素材-甜心选择2",
        "asset-light": "素材-光照",
        "asset-male": "素材-男性",
        "asset-morph": "素材-捏脸",
        "asset-nonbinary": "素材-非二元性别",
        "asset-plugin": "素材-插件",
        "asset-pose": "素材-姿势",
        "asset-prop": "素材-道具",
        "asset-scene": "素材-场景",
        "asset-script": "素材-脚本",
        "asset-shader": "素材-着色器",
        "asset-texture": "素材-贴图",
        "asset-utility": "素材-工具",
        "asset-vehicle": "素材-载具",
        "bdsm": "BDSM",
        "bestiality": "兽交",
        "big ass": "大屁股",
        "big tits": "巨乳",
        "blackmail": "勒索",
        "blood": "血腥",
        "bukkake": "颜射",
        "censored": "有码",
        "character creation": "自定义角色",
        "cheating": "出轨",
        "combat": "战斗",
        "corruption": "腐化",
        "cosplay": "COS",
        "creampie": "内射",
        "dating sim": "恋爱模拟",
        "dilf": "熟男",
        "drugs": "药物",
        "dystopian setting": "反乌托邦背景",
        "exhibitionism": "暴露癖",
        "fantasy": "奇幻",
        "female domination": "女性支配/女王",
        "female protagonist": "女主",
        "footjob": "足交",
        "furry": "福瑞控",
        "futa": "扶他",
        "futa/trans": "扶他/变性",
        "futa/trans protagonist": "扶他/变性 主角",
        "gay": "男同",
        "graphic violence": "血腥暴力",
        "groping": "痴汉",
        "group sex": "群交",
        "handjob": "手交",
        "harem": "后宫",
        "horror": "恐怖",
        "humiliation": "羞辱",
        "humor": "幽默",
        "incest": "乱伦",
        "internal view": "断面图",
        "interracial": "异族",
        "japanese game": "日本游戏",
        "kinetic novel": "动态小说",
        "lactation": "乳汁",
        "lesbian": "女同",
        "loli": "萝莉",
        "male domination": "男性支配",
        "male protagonist": "男主",
        "management": "经营",
        "masturbation": "自慰",
        "milf": "熟女",
        "mind control": "精神控制",
        "mobile game": "手机游戏",
        "monster": "怪物",
        "monster girl": "兽娘/魔物娘",
        "multiple endings": "多结局",
        "multiple penetration": "双插/多插",
        "multiple protagonist": "多主角",
        "necrophilia": "恋尸癖",
        "netorare": "NTR",
        "no sexual content": "无H内容",
        "oral sex": "口交",
        "paranormal": "灵异",
        "parody": "恶搞",
        "platformer": "平台游戏",
        "point & click": "点击式",
        "possession": "附身",
        "pov": "第一人称视角",
        "pregnancy": "怀孕",
        "prostitution": "卖淫",
        "puzzle": "解谜",
        "rape": "强暴",
        "real porn": "真人视频",
        "religion": "宗教",
        "romance": "浪漫",
        "rpg": "RPG",
        "sandbox": "沙盒",
        "scat": "吃粪",
        "school setting": "校园背景",
        "sci-fi": "科幻",
        "sex toys": "性玩具",
        "sexual harassment": "性骚扰",
        "shooter": "射击游戏",
        "shota": "正太",
        "side-scroller": "横版卷轴",
        "simulator": "模拟器",
        "sissification": "伪娘改造",
        "slave": "奴隶",
        "sleep sex": "睡奸",
        "spanking": "打屁股",
        "strategy": "策略",
        "stripping": "脱衣舞",
        "superpowers": "超能力",
        "swinging": "换妻",
        "teasing": "挑逗",
        "tentacles": "触手",
        "text based": "文字游戏",
        "titfuck": "乳交",
        "trainer": "养成",
        "transformation": "变性",
        "trap": "伪娘",
        "turn based combat": "回合制战斗",
        "twins": "双胞胎",
        "urination": "圣水",
        "vaginal sex": "阴道交",
        "virgin": "处女",
        "virtual reality": "VR",
        "violence": "暴力",
        "voiced": "有配音",
        "vore": "吞食",
        "voyeurism": "窥视癖",
    };



    // ==================== 全局常量定义 ====================
    // 中文汉化选项及分组逻辑
    const GAME_CHINESE_OPTS = [
        {v:null, t:'（未知）'},
        {v:0, t:'无官方中文'},
        {v:1, t:'官方日语'},
        {v:2, t:'官方英文'},
        {v:11, t:'机翻汉化'},
        {v:12, t:'机翻官中'},
        {v:20, t:'有官方中文'},
        {v:31, t:'AI汉化'},
        {v:32, t:'AI官中'},
        {v:41, t:'人工汉化'},
        {v:42, t:'人工官中'},
        {v:51, t:'满分汉化'},
        {v:52, t:'满分官中'}
    ];
    // 辅助函数：获取中文文本
    function getChineseText(v) {
        const item = GAME_CHINESE_OPTS.find(o => o.v === v);
        return item ? item.t : '数据错误！';
    }
    // 辅助函数：简单中文分组 (返回 ?, ✘, ✔)  - 用于飘窗
    function getSimpleChineseGroup(v) {
        if (v === null || v === undefined) return '?';
        if (v >= 0 && v <= 9) return '✘';
        if (v >= 10) return '✔';
        return '数据错误！';
    }
    // 辅助函数：进阶中文分组 (返回 ?, ✘, ✔, ☆)  - 用于列表/库
    function getAdvancedChineseGroup(v) {
        if (v === null || v === undefined) return '?';
        if (v >= 0 && v <= 19) return '✘'; // 含机翻
        if (v >= 20 && v <= 49) return '✔';
        if (v >= 50) return '☆';
        return '数据错误！';
    }

    // 音声 (gameAudioId) 选项及分组逻辑
    const GAME_AUDIO_OPTS = [
        {v:null, t:'（未知）'},
        {v:0,t:'无音声'},
        {v:10,t:'有音声'},
        {v:21,t:'仅音效'},
        {v:31,t:'日文'},
        {v:32,t:'英文'},
        {v:33,t:'中文'},
        {v:41,t:'日文ASMR'},
        {v:42,t:'英文ASMR'},
        {v:43,t:'中文ASMR'}
    ];
    // 辅助函数：获取音声文本
    function getAudioText(v) {
        const item = GAME_AUDIO_OPTS.find(o => o.v === v);
        return item ? item.t : '数据错误！';
    }
    // 辅助函数：音声分组 (返回 ?, ✘, ✔, ☆)
    function getAudioGroup(v) {
        if (v === null || v === undefined) return '?';
        if (v >= 0 && v <= 9) return '✘'; // 无音声
        if (v >= 10 && v <= 32) return '✔'; // 有音声
        if (v >= 33) return '☆'; // 完美音声 (中文 or ASMR)
        return '数据错误！';
    }
    // ▲待修改。上面两个函数是用来给游戏库UI备用的，目前没使用

    // 游戏题材-NTR (gameThemeNTR) 选项及分组逻辑
    const GAME_THEME_NTR_OPTS = [
        // NTL：淫人妻
        // NTRS：绿帽癖
        // NTR：被寝取
        // 其他：包含多种情形
        {v:null, t:'（未知）'},
        {v:0,t:'纯爱'},
        {v:10,t:'NTL'},
        {v:20,t:'NTRS'},
        {v:21,t:'NTRS-可规避'},
        {v:32,t:'NTR-纯正单线'},
        {v:30,t:'NTR'},
        {v:31,t:'NTR-可规避'},
        {v:31,t:'NTR-轻微'},
        {v:32,t:'NTR-纯正单线'},
        {v:90,t:'其他'},
    ];
    const GAME_THEME_NTR_MAP = {
        // keywords1: 用于判断 gameThemeNTR 分类的F95网站标签
        // keywords2: 用于判断 gameThemeNTR 分类的其他网站标签/关键词
        // notes: 用于提供给用户备注的标签
        '10': {
            keywords1: [], // F95没有合适的标签，需要手动输入
            keywords2: ['netori'],
            notes: ['付种', '催眠', '目前犯']
        },
        '20': {
            keywords1: ['swinging'],
            keywords2: ['netorase', 'swinging', 'sharing', 'hotwife', '借种', '公用化', '露出'],
            notes: ['借种', '换妻/分享', '淫妻', '露出', '妓院']
        },
        '21': {
            keywords1: [],
            keywords2: [],
            notes: ['借种', '换妻/分享', '淫妻', '露出', '妓院']
        },
        '22': {
            keywords1: [],
            keywords2: [],
            notes: ['借种', '换妻/分享', '淫妻', '露出', '妓院']
        },
        '30': {
            // 虽然广义上的 NTR netorare 可能为 NTRS ，但是这里一律按狭义理解
            keywords1: ['netorare'],
            keywords2: ['netorare', 'NTR', '牛头人', '绿帽', '隐奸', '败北'],
            notes: ['隐奸', '催眠', '目前犯']
        },
        '31': {
            keywords1: [],
            keywords2: [],
            notes: ['隐奸', '催眠', '目前犯']
        },
        '32': {
            keywords1: [],
            keywords2: [],
            notes: ['隐奸', '催眠', '目前犯']
        },
        '90': {
            keywords1: [],
            keywords2: [],
            notes: []
        },
        // 这里列举一些不能区分 NTRS 与 NTR 的 keywords 备用
        // keywords1: ['corruption', 'prostitution', 'voyeurism', 'cheating'],
        // keywords2: ['cuckold', 'cuckolding', ],
    };

    // ==================== SVG图标资源 ====================
    const ICONS = {
        // 锁 (闭合) - 用于编辑窗口锁定字段
        LOCK: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>`,
        
        // 锁 (打开) - 用于编辑窗口解锁字段
        UNLOCK: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z"/></svg>`,

        // 铃铛 (无点) - 用于无新消息
        BELL: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`,

        // 铃铛 (带红点) - 用于有新消息
        BELL_DOT: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path><circle cx="18" cy="5" r="3" fill="#ff4d4f" stroke="none"></circle></svg>`
    };

    // ==================== 初始化变量 ====================
    let Like = GM_getValue('喜好的标签', '');
    let Dislike = GM_getValue('厌恶的标签', '');
    let Concern = GM_getValue('值得注意的标签', '');


    // ==================== 主逻辑 ====================
    GM_registerMenuCommand('设置', openSettings);
    GM_registerMenuCommand('我的游戏库', () => {
        // 使用 GM_openInTab 打开一个伪造的同域 URL，以便脚本能匹配并接管
        GM_openInTab('https://f95zone.to/game', { active: true });
    });

    if (window.location.href.includes('f95zone.to/game')) {
        window.stop(); // 停止原网页的加载（虽然是伪造URL，但防止意外）
        document.documentElement.innerHTML = ''; // 清空原有内容
        initLibraryPage(); // 初始化我们的页面
        return; // 终止后续脚本执行
    }

    if (isURL('f95zone')) {
        const $tagList = $('span.js-tagList');
        const likeTags = [], dislikeTags = [], concernTags = [], others = [];
        // 功能1+2：标签黑白名单+汉化
        $('span.js-tagList a').each(function() {
            const $this = $(this);
            const englishText = $this.text();
            const chineseText = tagTranslations[englishText] || englishText;
            $this.text(chineseText);

            if (includesAnyIgnoreCase(chineseText, Like)) {
                $this.css('color', '#90ee90'); // 设置“喜欢”的样式（浅绿）
                likeTags.push($this);
            } else if (includesAnyIgnoreCase(chineseText, Dislike)) {
                $this.css('color', '#ff0000'); // 设置“厌恶”的样式（红色）
                dislikeTags.push($this);
            } else if (includesAnyIgnoreCase(chineseText, Concern)) {
                $this.css('color', '#ffff00'); // 设置“值得注意”的样式（黄色）
                concernTags.push($this);
            } else {
                others.push($this); // 其他标签
            }
        });
        const $fragment = $(document.createDocumentFragment());
        likeTags.forEach($el => $fragment.append($el).append(' '));
        dislikeTags.forEach($el => $fragment.append($el).append(' '));
        concernTags.forEach($el => $fragment.append($el).append(' '));
        others.forEach($el => $fragment.append($el).append(' '));
        $tagList.empty().append($fragment);

        // 功能3+4：创建操作按钮 (复制和搜索)
        f95Buttons();
    }
    else if (isURL('vndb')){
        // 功能5：提取VNDB页面的内容
        vndbButtons();
    }
    else if (isURL('steamdb')){
        // 功能6：提取SteamDB页面的内容
        steamdbButtons();
    }
    else if (isURL('steampowered')){
        steamButtons();
    }


    // ==================== 函数定义区域 ====================
    // -------------------- 通用 --------------------
    // 获取标准化的游戏数据模板
    function getDataTemplate() {
        return {
            f95ThreadId: null,      // F95 ID
            gameName1: null,        // 英文名
            gameName2: null,        // 中文名
            gameName3: null,        // 别名
            gameVersion: null,      // 游戏版本
            gameDevStatus: null,    // 开发进度。更新中/完成/弃坑
            gameReleaseDate: null,  // 更新时间。格式：YYYY-MM-DD。
            gameDev: null,          // 开发者

            gameEngine: null,       // 游戏引擎
            gameType: null,         // 游戏大类
            gameGenre: null,        // 游戏小类
            gameCGArtStyle: null,   // 游戏画风。数值，枚举值：null-(未知), 1-美式, 2-日式, 3-亚洲, 4-中式, 5-韩式, 6-真人
            gameCGType: null,       // CG类型。字符串，枚举值（允许其他值）：3D动态,2D动态,2D静态,像素动态, ...
            gameCGEngine: null,     // 游戏CG引擎。字符串，枚举值（允许其他值）：Daz, I社, Live2D, Spine, VAM, 手绘, 软绘, AI, 未知软件, ...
            gameCGMosaic: null,     // 马赛克。数值，枚举值：0-无码, 1-有码
            gameChineseId: null,    // 中文。数值，枚举值见 GAME_CHINESE_OPTS
            gameChineseNote: null,  // 中文 的备注信息
            gameAudioId: null,      // 游戏音声。数值，枚举值见 GAME_AUDIO_OPTS
            gameAudioNote: null,    // 游戏音声 的备注信息
            gameThemeNtrId: null,   // 游戏题材-NTR。数值，枚举值见 GAME_THEME_NTR_OPTS
            gameThemeNtrNote: null, // 游戏题材-NTR 的备注信息

            f95VoteCount: null,     // F95 评分人数
            f95AvgScore: null,      // F95 评分。一位小数的字符串。
            vndbId: null,           // VNDB ID
            vndbVoteCount: null,    // VNDB 评分人数
            vndbAvgScore: null,     // VNDB 评分。一位小数的字符串。
            steamId: null,          // steam ID
            steamVoteCount: null,   // steam 评分人数
            steamAvgScore: null,    // steam 评分。一位小数的字符串。

            gameOfficialLinks: [    // 官方网址：固定前4个name
                { name: '独立官网', url: null },
                { name: 'DLsite', url: null },
                { name: 'Patreon', url: null },
                { name: 'SubscribeStar', url: null }
            ],

            gameDownloadLinks: [    // 下载网址：固定4个空位
                { name: null, url: null },
                { name: null, url: null },
                { name: null, url: null },
                { name: null, url: null }
            ],

            userPlayStatus: 0,      // 游玩状态。枚举值：0-关注中, 1-准备玩, 2-追更中, 3-已完成, 9-黑名单
            userScore: null,        // 玩家评分。一位小数的字符串。
            userFinishDate: null,   // 完成时间。格式：YYYY-MM-DD。
            userCommentSummary: null, // 总体评价
            userCommentPros: null,  // 优点
            userCommentCons: null,  // 缺点
            userCommentOther: null, // 其他/备注

            lastModified: 0,        // 最后修改时间戳。数值

            lockedFields: [],       // 锁定的字段名数组
        };
    }

    /**
     * 分享游戏：生成分享字符串
     * @param {object} gameData - 完整的游戏数据对象
     * @returns {string} 格式化后的分享文本
     */
    function generateShareData(gameData) {
        const config = CURRENT_SHARE_CONFIG;
        const fields = config.fields;

        // 1. 构建导出对象 (根据配置过滤字段)
        const exportObj = {};

        // 辅助：批量复制
        const copy = (keys) => keys.forEach(k => { if (gameData[k] !== undefined) exportObj[k] = gameData[k]; });

        if (fields.basic) copy(['gameName1', 'gameName2', 'gameName3', 'gameDev', 'gameVersion', 'gameDevStatus', 'gameReleaseDate']);
        if (fields.ids)   copy(['f95ThreadId', 'steamId', 'vndbId', 'f95AvgScore', 'f95VoteCount', 'steamAvgScore', 'steamVoteCount', 'vndbAvgScore', 'vndbVoteCount']);
        if (fields.links) copy(['gameOfficialLinks', 'gameDownloadLinks']);
        if (fields.props) copy(['gameType', 'gameGenre', 'gameEngine', 'gameCGArtStyle', 'gameCGType', 'gameCGEngine', 'gameCGMosaic', 'gameChineseId', 'gameChineseNote', 'gameAudioId', 'gameAudioNote', 'gameThemeNtrId', 'gameThemeNtrNote']);
        if (fields.playStatus) copy(['userPlayStatus', 'userFinishDate']);
        if (fields.comments) copy(['userScore', 'userCommentSummary', 'userCommentPros', 'userCommentCons', 'userCommentOther']);

        // 始终保留 f95ThreadId 作为主键，防止 ids 组被误关导致无法导入
        exportObj.f95ThreadId = gameData.f95ThreadId;

        // 2. 序列化与编码
        let payload = '';
        let typeText = '';

        if (config.useBase64) {
            // 使用 Base64 + encodeURIComponent 处理中文防乱码
            const jsonStr = JSON.stringify(exportObj);
            // btoa不能直接处理中文，需要先转义
            payload = btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1)));
            typeText = '神秘代码';
        } else {
            payload = JSON.stringify(exportObj, null, 2);
            typeText = '明文JSON';
        }

        // 3. 拼接最终文本
        const header = `你收到了一个游戏分享，它的F95 ID为 ${gameData.f95ThreadId}。\n游戏${typeText}为：\n`;
        return header + payload;
    }

    /**
     * 分享游戏：解析分享字符串
     * @param {string} inputStr - 用户粘贴的完整文本
     * @returns {object|null} 解析出的游戏数据对象，失败返回null
     */
    function parseShareData(inputStr) {
        if (!inputStr) return null;

        // 1. 尝试提取 Payload
        // 匹配规则：换行符后的最后一段内容，或者是整个内容（如果没头的话）
        // 简单处理：如果包含“代码为：\n”，取后面的；否则尝试解析整个字符串
        let payload = inputStr.trim();
        const splitMarker = '代码为：'; // 匹配 Base64
        const splitMarkerJson = '明文JSON为：'; // 匹配 JSON

        if (inputStr.includes(splitMarker)) {
            payload = inputStr.split(splitMarker)[1].trim();
        } else if (inputStr.includes(splitMarkerJson)) {
            payload = inputStr.split(splitMarkerJson)[1].trim();
        }

        try {
            // 2. 尝试解析 JSON (先假设是明文)
            if (payload.startsWith('{')) {
                return JSON.parse(payload);
            }
            // 3. 尝试 Base64 解码
            else {
                // 解码流程与编码相反
                const str = decodeURIComponent(atob(payload).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
                return JSON.parse(str);
            }
        } catch (e) {
            console.error('[F95助手] 分享码解析失败:', e);
            return null;
        }
    }

    /**
     * 分享游戏：导入分享数据到数据库
     * @param {object} shareData - 解析后的对象
     */
    function importShareDataToDB(shareData) {
        const id = shareData.f95ThreadId;
        if (!id) throw new Error("无效的数据：缺少 F95 ID");

        const DB_KEY = 'f95GameDatabase';
        const database = JSON.parse(GM_getValue(DB_KEY, '{}'));

        // 获取本地现有数据，如果没有则初始化模板
        const localData = database[id] || getDataTemplate();
        // 确保本地数据的数组结构完整 (防止合并时报错)
        if (!localData.gameOfficialLinks) localData.gameOfficialLinks = getDataTemplate().gameOfficialLinks;
        if (!localData.gameDownloadLinks) localData.gameDownloadLinks = getDataTemplate().gameDownloadLinks;

        // 合并策略：覆盖非空字段
        for (const key in shareData) {
            const val = shareData[key];
            if (val !== null && val !== undefined && val !== '') {
                localData[key] = val;
            }
        }

        localData.lastModified = Date.now();
        database[id] = localData;
        GM_setValue(DB_KEY, JSON.stringify(database));
    }

    // 页面UI函数：我的游戏库
    function initLibraryPage() {
        // 设置页面标题
        document.title = 'F95助手 - 我的游戏库';

        // 注入全局 CSS
        const css = `
            :root { --bg-color: #1a1a1a; --panel-bg: #2c2c2c; --border-color: #444; --text-main: #eee; --accent-blue: #007bff; --accent-green: #28a745; --row-hover: #383838; --badge-f95: #e67e22; --badge-steam: #223D58; --badge-vndb: #3498db; }
            body { margin: 0; padding: 0; background-color: var(--bg-color); color: var(--text-main); font-family: "Segoe UI", sans-serif; height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
            /* 工具栏 */
            .toolbar { background-color: var(--panel-bg); padding: 12px 20px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); z-index: 10; }

            /* 搜索框 */
            .search-group { position: relative; flex: 1; max-width: 600px; margin-left: 20px; }
            .search-input { width: 100%; padding: 8px 35px 8px 12px; background: #111; border: 1px solid #555; border-radius: 4px; color: #fff; font-size: 14px; box-sizing: border-box; }
            .search-input:focus { border-color: var(--accent-blue); outline: none; }
            .search-help-icon { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); color: #888; cursor: pointer; border: 1px solid #666; border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; font-size: 12px; }
            .search-help-icon:hover { color: #fff; border-color: #fff; }

            /* 右上角功能区 */
            .tool-btn-group { display: flex; gap: 8px; align-items: center; margin-left: auto; }
            .icon-btn { background: transparent; border: 1px solid transparent; color: #ccc; font-size: 18px; cursor: pointer; padding: 4px 8px; border-radius: 4px; transition: all 0.2s; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; }
            .icon-btn:hover { background: #444; color: #fff; border-color: #555; }

            /* 下拉菜单 */
            .dropdown { position: relative; display: inline-block; }
            .dropdown-content { display: none; position: absolute; top: 100%; left: auto; right: 0; background-color: #2c2c2c; min-width: 200px; box-shadow: 0 8px 16px rgba(0,0,0,0.5); z-index: 20; border: 1px solid #444; border-radius: 4px; padding: 5px 0; }
            .dropdown:hover .dropdown-content { display: block; }
            .dropdown-content a { color: #ddd; padding: 8px 16px; text-decoration: none; display: block; font-size: 13px; cursor: pointer; transition: background 0.1s; user-select: none; }
            .dropdown-content a:hover { background-color: #383838; color: #fff; }

            /* 表格容器 */
            .table-container { flex: 1; overflow: auto; padding: 0; }
            table { width: 100%; border-collapse: collapse; min-width: 1400px; }
            thead th { position: sticky; top: 0; background: #252525; padding: 10px 8px; text-align: left; font-size: 13px; color: #ccc; border-bottom: 2px solid var(--border-color); cursor: pointer; user-select: none; white-space: nowrap; z-index: 5; }
            thead th:hover { background: #333; color: #fff; }
            thead th.sorted-asc::after { content: " ▲"; color: var(--accent-blue); }
            thead th.sorted-desc::after { content: " ▼"; color: var(--accent-blue); }
            td { padding: 6px 8px; border-bottom: 1px solid #333; font-size: 13px; vertical-align: middle; color: #ddd; }
            tbody tr:hover { background-color: var(--row-hover); }
            /* 列样式 */
            .col-status { width: 40px; text-align: center; }
            .col-name { max-width: 250px; } .col-cn-name { max-width: 180px; } .col-dev { max-width: 120px; } /* 超长截断 */
            .col-update { width: 90px; text-align: center; } .col-status-dev { width: 50px; text-align: center; } .col-ver { width: 80px; } /* 固定宽度 */
            .col-chinese { width: 40px; text-align: center; } .col-link { width: 90px; text-align: center; }
            .col-date { width: 90px; text-align: center; } .col-score { width: 60px; text-align: center; font-weight: bold; }
            .col-comment { width: 40px; text-align: center; } .col-action { width: 50px; text-align: center; }
            /* 组件 */
            .truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
            .status-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
            .st-0 { background: #aaa; } .st-1 { background: #17a2b8; } .st-2 { background: #ffc107; } .st-3 { background: #28a745; } .st-9 { background: #333; border: 1px solid #555; }
            /* 徽章 */
            .link-badge { display: inline-flex; flex-direction: column; align-items: center; justify-content: center; min-width: 60px; padding: 2px 6px; border-radius: 4px; text-decoration: none; font-size: 11px; background: #333; transition: transform 0.1s; }
            .link-badge:hover { transform: scale(1.05); filter: brightness(1.2); }
            .link-badge.f95 { border-left: 3px solid var(--badge-f95); } .link-badge.steam { border-left: 3px solid var(--badge-steam); } .link-badge.vndb { border-left: 3px solid var(--badge-vndb); }
            .lb-score { color: #fff; font-weight: bold; font-size: 12px; } .lb-count { color: #888; transform: scale(0.9); }
            /* 气泡与 Tooltip */
            .comment-bubble { font-size: 16px; cursor: pointer; opacity: 0.3; filter: grayscale(1); }
            .comment-bubble.has-content { opacity: 1; filter: grayscale(0); }
            .tooltip { position: fixed; background: rgba(0,0,0,0.95); border: 1px solid #555; padding: 10px; border-radius: 5px; color: #fff; font-size: 12px; z-index: 99999; display: none; max-width: 300px; white-space: pre-wrap; box-shadow: 0 5px 15px rgba(0,0,0,0.5); pointer-events: none; }
            /* 底部 */
            .footer { padding: 10px; background: var(--panel-bg); border-top: 1px solid var(--border-color); display: flex; justify-content: center; gap: 5px; }
            .page-btn { background: #333; border: 1px solid #555; color: #ccc; padding: 4px 10px; cursor: pointer; border-radius: 3px; }
            .page-btn.active { background: var(--accent-blue); border-color: var(--accent-blue); color: #fff; }
            .btn { padding: 6px 12px; background: #444; border: none; color: #fff; border-radius: 4px; cursor: pointer; font-size: 13px; transition: background 0.2s; }
            .btn:hover { background: #555; }
            .dev-completed { color: #28a745; } .dev-abandoned { color: #dc3545; } .dev-wip { color: #ffc107; }
        `;
        const style = document.createElement('style');
        style.innerHTML = css;
        document.head.appendChild(style);

        // 构建 DOM 结构
        document.body.innerHTML = `
            <div class="toolbar">
                <div style="font-weight: bold; font-size: 18px; margin-right: 20px;">🎮 我的游戏库</div>

                <div class="search-group">
                    <input type="text" id="libSearchInput" class="search-input" placeholder="搜索名称、作者、F95 ID... 或使用指令 (如 a8.5 C1000)...">
                    <div class="search-help-icon" title="高级搜索指令：\na8 = 玩家评分 ≥ 8\nb9 = F95评分 ≥ 9\nc10 = Steam评分 ≥ 10\nd8 = VNDB评分 ≥ 8\n\nB1000 = F95评分人数 ≥ 1000\nC5000 = Steam评分人数 ≥ 5000\nD200 = VNDB评分人数 ≥ 200">?</div>
                </div>

                <!-- 右上角功能按钮 -->
                <div class="tool-btn-group">
                    <button id="btnChangelog" class="icon-btn" title="更新日志">${ICONS.BELL}</button>
                    <button id="btnSettings" class="icon-btn" title="插件设置">⚙️</button>
                    <div class="dropdown">
                        <button class="icon-btn" title="数据管理">💾</button>
                        <div class="dropdown-content" style="right: 0; left: auto;">
                            <a id="btnExport">📤 导出数据（JSON文件）</a>
                            <a id="btnImport">📥 导入数据（JSON文件）</a>
                            <a id="btnImportShare">🤝 导入分享游戏（base64代码/JSON明文）</a>
                            <div style="border-top:1px solid #444; margin:4px 0;"></div>
                            <a id="btnClearAll" style="color:#ff6b6b;">🗑 清空数据库</a>
                        </div>
                    </div>
                </div>

                <!-- 隐藏的文件输入框 -->
                <input type="file" id="fileInput" style="display:none" accept=".json">
            </div>

            <div class="table-container">
                <table id="libTable">
                    <thead>
                        <tr>
                            <th class="col-status" data-sort="userPlayStatus" title="游玩状态">状态</th>
                            <th class="col-name" data-sort="gameName1">英文名称</th>
                            <th class="col-cn-name" data-sort="gameName2">中文名称</th>
                            <th class="col-dev" data-sort="gameDev">开发者</th>
                            <th class="col-update" data-sort="gameReleaseDate">更新日期</th>
                            <th class="col-status-dev" data-sort="gameDevStatus">进度</th>
                            <th class="col-ver">版本</th>
                            <th class="col-chinese" data-filter="chinese">中文</th>
                            <th class="col-link" data-sort="f95AvgScore">F95</th>
                            <th class="col-link" data-sort="steamAvgScore">SteamDB</th>
                            <th class="col-link" data-sort="vndbAvgScore">VNDB</th>
                            <th class="col-date" data-sort="userFinishDate">游玩日期</th>
                            <th class="col-score" data-sort="userScore">评分</th>
                            <th class="col-comment">评价</th>
                            <th class="col-action">修改</th>
                        </tr>
                    </thead>
                    <tbody id="libTableBody"></tbody>
                </table>
            </div>

            <div id="libTooltip" class="tooltip"></div>
            <div class="footer" id="pagination"></div>
        `;

        // 状态管理
        let currentPage = 1;
        const pageSize = 100;
        let currentSort = { key: 'lastModified', dir: 'desc' }; // 默认按最后修改时间倒序
        let currentFilterChinese = 'all'; // all, yes, no
        let searchText = '';

        // 获取数据
        const DB_KEY = 'f95GameDatabase';
        const rawData = JSON.parse(GM_getValue(DB_KEY, '{}'));
        let games = Object.values(rawData);

        // 核心渲染函数
        const refresh = () => {
            renderTable(games, {
                page: currentPage,
                pageSize,
                sort: currentSort,
                filterChinese: currentFilterChinese,
                search: searchText,
                onPageChange: (newPage) => {
                    currentPage = newPage;
                    refresh();
                }
            }, document.getElementById('libTableBody'), document.getElementById('pagination'));
        };

        // --- 事件绑定 ---
        // 0. 更新日志按钮
        const btnChangelog = document.getElementById('btnChangelog');
        const currentVer = GM_info.script.version;
        const lastReadVer = GM_getValue('lastReadVersion', '0.0.0');
        const hasNewVersion = compareVersions(currentVer, lastReadVer) > 0; // 判断是否有新版本
        if (hasNewVersion) {
            btnChangelog.classList.add('has-new');
            btnChangelog.title = `更新日志 (有新版本 v${currentVer})`;
        }
        if (hasNewVersion) {
            btnChangelog.innerHTML = ICONS.BELL_DOT;
            btnChangelog.title = `更新日志 (有新版本 v${currentVer})`;
            btnChangelog.classList.add('has-new');
        }
        btnChangelog.onclick = () => {
            openChangelogWindow(currentVer, lastReadVer);
            if (btnChangelog.classList.contains('has-new')) {
                btnChangelog.innerHTML = ICONS.BELL;
                btnChangelog.classList.remove('has-new');
                btnChangelog.title = "更新日志";
                GM_setValue('lastReadVersion', currentVer);
            }
        };
        
        // 1. 设置按钮
        document.getElementById('btnSettings').onclick = openSettings;

        // 2. 导出数据
        document.getElementById('btnExport').onclick = () => {
            // 重新读取最新数据以确保导出包含最新更改
            const currentData = JSON.parse(GM_getValue(DB_KEY, '{}'));
            const blob = new Blob([JSON.stringify(currentData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `f95_backup_${new Date().toISOString().slice(0,10)}.json`;
            a.click();
        };

        // 3. 导入数据
        // 新增 ID：直接添加到本地库。
        // 现有 ID：使用导入文件中的数据完全覆盖本地数据。
        // 未在导入文件中的本地 ID：保留不变。
        document.getElementById('btnImport').onclick = () => document.getElementById('fileInput').click();
        document.getElementById('fileInput').onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importData = JSON.parse(event.target.result);
                    // 读取现有数据
                    const currentData = JSON.parse(GM_getValue(DB_KEY, '{}'));
                    // 计算变更统计
                    let added = 0;
                    let updated = 0;

                    // 遍历导入的数据进行合并
                    for (const id in importData) {
                        const mergedGameData = { ...getDataTemplate(), ...importData[id] }; // 老数据兼容最新的模板
                        if (currentData.hasOwnProperty(id)) {
                            currentData[id] = mergedGameData;
                            updated++;
                        } else {
                            currentData[id] = mergedGameData;
                            added++;
                        }
                    }

                    if (confirm(`准备合并数据：\n新增: ${added} 条\n覆盖: ${updated} 条\n\n确定要执行吗？`)) {
                        GM_setValue(DB_KEY, JSON.stringify(currentData));
                        alert('合并成功，页面即将刷新。');
                        location.reload();
                    }
                } catch (err) {
                    alert('文件格式错误或数据损坏！');
                    console.error(err);
                }
            };
            reader.readAsText(file);
        };

        // 3.5 导入分享
        document.getElementById('btnImportShare').onclick = () => {
            const input = prompt("请粘贴完整的分享文本（包含‘代码为：...’的前缀）：");
            if (!input) return;

            try {
                const shareData = parseShareData(input);
                if (!shareData) {
                    alert('无法识别分享码！请确认复制了完整的内容。');
                    return;
                }

                const gameName = shareData.gameName1 || shareData.f95ThreadId;
                if (confirm(`解析成功！\n准备导入游戏：${gameName}\nF95 ID: ${shareData.f95ThreadId}\n\n确定要导入吗？(将覆盖本地非空字段)`)) {
                    importShareDataToDB(shareData);
                    alert('导入成功！页面即将刷新。');
                    location.reload();
                }
            } catch (err) {
                alert('导入出错: ' + err.message);
                console.error(err);
            }
        };

        // 4. 清空数据
        document.getElementById('btnClearAll').onclick = () => {
            if (confirm('⚠️ 警告：这将彻底清空所有本地保存的游戏数据！\n\n此操作不可撤销，确定要继续吗？')) {
                // 双重确认
                if (confirm('请再次确认：真的要删除所有数据吗？')) {
                    GM_setValue(DB_KEY, '{}');
                    alert('数据库已清空。');
                    location.reload();
                }
            }
        };

        // 5. 搜索
        const searchInput = document.getElementById('libSearchInput');
        let debounceTimer;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                searchText = e.target.value.trim();
                currentPage = 1; // 重置页码
                refresh();
            }, 300);
        });

        // 6. 表头排序与筛选
        document.querySelectorAll('#libTable th').forEach(th => {
            th.addEventListener('click', () => {
                // 筛选 (中文)
                if (th.dataset.filter === 'chinese') {
                    if (currentFilterChinese === 'all') currentFilterChinese = 'yes';
                    else if (currentFilterChinese === 'yes') currentFilterChinese = 'no';
                    else currentFilterChinese = 'all';

                    // 更新表头视觉
                    const map = { 'all': '中文', 'yes': '中文(✔)', 'no': '中文(✘)' };
                    th.textContent = map[currentFilterChinese];
                    currentPage = 1;
                    refresh();
                    return;
                }

                // 排序
                const key = th.dataset.sort;
                if (!key) return;

                if (currentSort.key === key) {
                    // 切换方向: desc -> asc -> default
                    if (currentSort.dir === 'desc') currentSort.dir = 'asc';
                    else if (currentSort.dir === 'asc') { currentSort = { key: 'lastModified', dir: 'desc' }; } // Reset
                } else {
                    currentSort = { key, dir: 'desc' }; // 默认新列倒序
                }

                // 更新表头箭头样式
                document.querySelectorAll('th').forEach(el => el.className = el.className.replace(/sorted-(asc|desc)/, ''));
                if (currentSort.key === key) {
                    th.classList.add(`sorted-${currentSort.dir}`);
                }

                refresh();
            });
        });

        // 初始化渲染
        refresh();

        // 监听外部更新
        window.addEventListener('f95_db_updated', () => {
            // 重新读取数据
            const newData = JSON.parse(GM_getValue(DB_KEY, '{}'));
            games = Object.values(newData);
            refresh();
        });
    }
    // 核心渲染逻辑：过滤 -> 排序 -> 分页 -> 生成HTML
    function renderTable(allGames, config, tbody, paginationEl) {
        let list = [...allGames];

        // 0. 根据 LIB_FILTER_SETTINGS 进行预筛选
        // 提取出所有配置了屏蔽项的字段名 (即数组长度大于0的key)
        const activeFilterKeys = Object.keys(LIB_FILTER_SETTINGS).filter(key => {
            const val = LIB_FILTER_SETTINGS[key];
            return Array.isArray(val) && val.length > 0;
        });
        // 只有当存在生效的筛选配置时，才执行过滤
        if (activeFilterKeys.length > 0) {
            list = list.filter(g => {
                // 遍历每一个生效的筛选字段
                for (const key of activeFilterKeys) {
                    const blockList = LIB_FILTER_SETTINGS[key]; // 获取该字段的黑名单数组
                    const gameValue = g[key]; // 获取游戏该字段的实际值

                    // 如果黑名单包含当前游戏的值，则剔除 (return false)
                    // (注: 如果 gameValue 是 null/undefined，includes 不会匹配到，除非黑名单里显式写了 null)
                    if (blockList.includes(gameValue)) {
                        return false;
                    }
                }
                return true; // 所有检查都通过，保留该游戏
            });
        }

        // 1. 搜索与高级 DSL 过滤
        if (config.search) {
            const s = config.search;
            // 解析 DSL
            const rules = [];
            // 匹配 a8, b9.5, C1000 等
            const dslRegex = /([abcdABCD])(\d+(\.\d+)?)/g;
            let match;
            let hasDsl = false;

            // 提取所有指令
            while ((match = dslRegex.exec(s)) !== null) {
                hasDsl = true;
                const code = match[1];
                const val = parseFloat(match[2]);
                rules.push({ code, val });
            }

            // 提取普通文本 (移除指令部分)
            const textQuery = s.replace(dslRegex, '').trim().toLowerCase();

            list = list.filter(g => {
                // 文本匹配
                let textMatch = true;
                if (textQuery) {
                    const searchStr = `${g.gameName1} ${g.gameName2||''} ${g.gameName3||''} ${g.gameDev||''} ${g.f95ThreadId||''}`.toLowerCase();
                    textMatch = searchStr.includes(textQuery);
                }
                if (!textMatch) return false;

                // DSL 匹配
                for (const r of rules) {
                    // a=user, b=f95, c=steam, d=vndb (小写=分, 大写=人)
                    // 注意：这里需要处理 null 值，null 视为 0
                    if (r.code === 'a') { if (parseFloat(g.userScore || 0) < r.val) return false; }
                    else if (r.code === 'b') { if (parseFloat(g.f95AvgScore || 0) < r.val) return false; }
                    else if (r.code === 'c') { if (parseFloat(g.steamAvgScore || 0) < r.val) return false; }
                    else if (r.code === 'd') { if (parseFloat(g.vndbAvgScore || 0) < r.val) return false; }
                    // 人数过滤 (暂未完全实现所有人数的大写指令，按需求先实现部分)
                    else if (r.code === 'B') { if ((g.f95VoteCount || 0) < r.val) return false; }
                    else if (r.code === 'C') { if ((g.steamVoteCount || 0) < r.val) return false; }
                    else if (r.code === 'D') { if ((g.vndbVoteCount || 0) < r.val) return false; }
                }
                return true;
            });
        }

        // 2. 筛选 (中文)
        if (config.filterChinese !== 'all') {
            const needChinese = config.filterChinese === 'yes';
            list = list.filter(g => {
                const group = getAdvancedChineseGroup(g.gameChineseId);
                const isGoodChinese = (group === '✔' || group === '☆'); // 机翻也配叫中文？
                return needChinese ? isGoodChinese : !isGoodChinese;
            });
        }

        // 3. 排序
        if (config.sort.key) {
            const { key, dir } = config.sort;

            // 定义哪些字段必须按数字排序
            const numericKeys = [
                'userScore', 'f95AvgScore', 'steamAvgScore', 'vndbAvgScore', // userScore, f95AvgScore 等现在是字符串，必须转数字
                'f95VoteCount', 'steamVoteCount', 'vndbVoteCount',
                'userPlayStatus', 'gameCGArtStyle', 'gameAudioId', 'lastModified' // lastModified 是时间戳(数字)，voteCount 是数字，userPlayStatus 是数字
            ];
            const isNumeric = numericKeys.includes(key);

            list.sort((a, b) => {
                let va = a[key];
                let vb = b[key];

                // 数字排序
                if (isNumeric) {
                    va = parseFloat(va);
                    vb = parseFloat(vb);
                    // 处理 NaN (即原本是 null/undefined 的情况)
                    if (isNaN(va)) va = -999999;
                    if (isNaN(vb)) vb = -999999;
                    return dir === 'asc' ? va - vb : vb - va;
                }

                // 文本排序
                // 处理 null 和 undefined
                if (va === null || va === undefined) va = ''; // 改为更安全的空字符串
                if (vb === null || vb === undefined) vb = '';

                // 字符串比较
                if (typeof va === 'string') return dir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);

                // 兜底
                return dir === 'asc' ? va - vb : vb - va;
            });
        }

        // 4. 分页
        const total = list.length;
        const maxPage = Math.ceil(total / config.pageSize) || 1;
        const page = Math.min(Math.max(1, config.page), maxPage);
        const start = (page - 1) * config.pageSize;
        const pageData = list.slice(start, start + config.pageSize);

        // 5. 生成 HTML
        // 辅助：生成徽章
        const badge = (site, score, count, id) => {
            if (!id) return `<span style="color:#444; font-size:12px;">-</span>`;
            let url = '#';
            if (site === 'f95') url = `https://f95zone.to/threads/${id}/`;
            else if (site === 'steam') url = `https://steamdb.info/app/${id}/info/`;
            else if (site === 'vndb') url = `https://vndb.org/v${id}`;

            // 格式化数字 1200 -> 1.2k
            const fmtCount = (n) => n > 1000 ? (n/1000).toFixed(1)+'k' : n;
            return `
                <a href="${url}" target="_blank" class="link-badge ${site}">
                    <span class="lb-score">${score || '-'}</span>
                    <span class="lb-count">${count ? fmtCount(count) : '-'}</span>
                </a>`;
        };

        // 辅助：状态点
        const statusMap = { 0: '关注中', 1: '准备玩', 2: '追更中', 3: '已完成', 9: '黑名单' };

        tbody.innerHTML = pageData.map(g => {
            // 评价气泡逻辑
            const hasComment = g.userCommentSummary || g.userCommentPros || g.userCommentCons || g.userCommentOther;
            const bubbleClass = hasComment ? 'has-content' : '';
            // 构建 Tooltip 内容
            let tooltipText = '';
            if (hasComment) {
                if (g.userCommentSummary) tooltipText += `◆ 简评 ◆\n${g.userCommentSummary}\n`;
                if (g.userCommentPros) tooltipText += `—————————————————————————\n◆ 优点 ◆\n${g.userCommentPros}\n`;
                if (g.userCommentCons) tooltipText += `—————————————————————————\n◆ 缺点 ◆\n${g.userCommentCons}\n`;
                if (g.userCommentOther) tooltipText += `—————————————————————————\n◆ 备注 ◆\n${g.userCommentOther}`;
                tooltipText = tooltipText.replace(/"/g, '&quot;'); // 简单转义
            }

            // 开发者状态颜色
            let devClass = 'dev-wip';
            if (g.gameDevStatus === '完成') devClass = 'dev-completed';
            else if (g.gameDevStatus === '弃坑') devClass = 'dev-abandoned';

            // 汉化状态处理逻辑
            const cid = g.gameChineseId;
            const note1 = `【汉化水平】\n${getChineseText(cid)}`;
            const note2 = g.gameChineseNote ? `\n【备注】\n${g.gameChineseNote}` : '';
            const chTitle = note1 + note2; // 中文情况+备注
            let chText = getAdvancedChineseGroup(cid); // 标识 ?/✘/✔/☆
            let chColor = '';
            let chWeight = 'normal';
            switch (chText) {
                case '?': break; // 未知
                case '✘': chColor = '#aaa'; break; // 无/机翻
                case '✔': chColor = '#28a745'; chWeight = 'bold'; break; // 有/人工
                case '☆': chColor = '#ffc107'; chWeight = 'bold'; break; // 完美
                default:  // 不可能
                    console.warn(`cid: ${cid}\nchText: ${chText}`);
                    chText = 'ERROR';
                    break;
            }

            return `
                <tr>
                    <td class="col-status"><span class="status-dot st-${g.userPlayStatus}" title="${statusMap[g.userPlayStatus]||'未知'}"></span></td>
                    <td class="col-name"><span class="truncate" title="${g.gameName1||''}">${g.gameName1||''}</span></td>
                    <td class="col-cn-name"><span class="truncate" title="${g.gameName2||''}">${g.gameName2||''}</span></td>
                    <td class="col-dev"><span class="truncate">${g.gameDev||''}</span></td>
                    <td class="col-update"><span class="truncate">${g.gameReleaseDate||''}</span></td>
                    <td class="col-status-dev"><span class="${devClass}">${g.gameDevStatus||''}</span></td>
                    <td class="col-ver"><span class="truncate">${g.gameVersion||''}</span></td>
                    <td class="col-chinese" style="color:${chColor}; font-weight:${chWeight}; cursor:help;" title="${chTitle}">${chText}</td>

                    <td class="col-link">${badge('f95', g.f95AvgScore, g.f95VoteCount, g.f95ThreadId)}</td>
                    <td class="col-link">${badge('steam', g.steamAvgScore, g.steamVoteCount, g.steamId)}</td>
                    <td class="col-link">${badge('vndb', g.vndbAvgScore, g.vndbVoteCount, g.vndbId)}</td>

                    <td class="col-date">${g.userFinishDate||''}</td>
                    <!-- 9分及以上的游戏，分数显示为金色 -->
                    <td class="col-score" style="${(parseFloat(g.userScore || 0)>=9)?'color:#ffc107;':''}">${g.userScore||'-'}</td>
                    <td class="col-comment">
                        <span class="comment-bubble ${bubbleClass}" data-tip="${tooltipText}">💬</span>
                    </td>
                    <td class="col-action"><button class="btn btn-edit-row" data-id="${g.f95ThreadId}" style="padding:2px 6px;">✏️</button></td>
                </tr>
            `;
        }).join('');

        // 绑定行内事件 (Tooltip & Edit)
        const tooltipEl = document.getElementById('libTooltip');
        tbody.querySelectorAll('.comment-bubble.has-content').forEach(el => {
            el.addEventListener('mousemove', (e) => {
                tooltipEl.innerText = el.dataset.tip;
                tooltipEl.style.display = 'block';
                // 智能定位：防止溢出屏幕右侧
                let left = e.clientX + 15;
                if (left + 300 > window.innerWidth) left = e.clientX - 315;
                tooltipEl.style.left = left + 'px';
                tooltipEl.style.top = (e.clientY + 10) + 'px';
            });
            el.addEventListener('mouseleave', () => { tooltipEl.style.display = 'none'; });
        });

        tbody.querySelectorAll('.btn-edit-row').forEach(btn => {
            btn.addEventListener('click', () => {
                openEditWindow(btn.dataset.id);
            });
        });

        // 生成分页控件
        let pageHtml = '';
        // 简单逻辑：首页，上一页，当前页，下一页，尾页
        pageHtml += `<button class="page-btn" ${page===1?'disabled':''}>«</button>`;
        pageHtml += `<button class="page-btn" ${page===1?'disabled':''}>‹</button>`;
        pageHtml += `<span style="color:#888; margin:0 10px; font-size:13px;">${page} / ${maxPage} (共 ${total} 条)</span>`;
        pageHtml += `<button class="page-btn" ${page===maxPage?'disabled':''}>›</button>`;
        pageHtml += `<button class="page-btn" ${page===maxPage?'disabled':''}>»</button>`;
        paginationEl.innerHTML = pageHtml;

        // 重新绑定分页事件
        paginationEl.querySelectorAll('.page-btn').forEach(btn => {
            if (btn.disabled) return;
            const txt = btn.innerText;
            btn.onclick = () => {
                let target = page;
                if (txt === '«') target = 1;
                else if (txt === '‹') target = page - 1;
                else if (txt === '›') target = page + 1;
                else if (txt === '»') target = maxPage;

                // 触发外部回调
                if (config.onPageChange) config.onPageChange(target);
            };
        });
    }

    // 窗口UI函数：插件设置
    function openSettings() {
        if ($('#translationWindow').length) return;

        // 读取设置
        let copyButtonOutputStyleSetting = GM_getValue('copyButtonOutputStyle', false);

        const settingsWindow = document.createElement('div');
        settingsWindow.id = 'translationWindow'; // 保持ID不变以便兼容检测逻辑

        // 样式：统一深色风格
        Object.assign(settingsWindow.style, {
            position: 'fixed', top: '15vh', left: '50%', transform: 'translateX(-50%)',
            width: '600px', background: '#2c2c2c', border: '1px solid #555',
            boxShadow: '0 10px 30px rgba(0,0,0,0.8)', color: '#eee',
            borderRadius: '8px', zIndex: 10005, overflow: 'hidden',
            fontFamily: '"Segoe UI", sans-serif'
        });

        // 内部 CSS
        const style = `
            <style>
                #translationWindow * { box-sizing: border-box; }
                .set-header { padding: 12px 20px; background: #202020; border-bottom: 1px solid #444; font-weight: bold; cursor: move; display: flex; justify-content: space-between; }
                .set-body { padding: 20px; max-height: 70vh; overflow-y: auto; }
                .set-group { margin-bottom: 20px; background: #333; padding: 15px; border-radius: 6px; }
                .set-title { font-size: 14px; font-weight: bold; color: #80bdff; margin-bottom: 10px; border-bottom: 1px solid #444; padding-bottom: 5px; }
                .set-row { margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between; }
                .set-desc { font-size: 12px; color: #aaa; margin-top: 5px; line-height: 1.4; }

                /* 单选框美化 */
                .radio-group { display: flex; gap: 15px; }
                .radio-label { display: flex; align-items: center; gap: 6px; cursor: pointer; color: #ddd; }
                .radio-label input { accent-color: #007bff; }

                /* 标签输入框 */
                .tag-input { width: 100%; background: #222; border: 1px solid #555; color: #fff; padding: 8px; border-radius: 4px; min-height: 60px; resize: vertical; margin-top: 5px; font-family: monospace; }
                .tag-input:focus { border-color: #007bff; outline: none; }

                .set-footer { padding: 12px 20px; background: #202020; border-top: 1px solid #444; display: flex; justify-content: flex-end; gap: 10px; }
                .btn { padding: 6px 16px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; color: white; transition: background 0.2s; }
                .btn-primary { background: #007bff; } .btn-primary:hover { background: #0056b3; }
                .btn-secondary { background: #6c757d; } .btn-secondary:hover { background: #545b62; }
            </style>
        `;

        settingsWindow.innerHTML = `
            ${style}
            <div class="set-header" id="setDragHandle">
                <span>⚙️ F95助手 设置</span>
                <span id="setCloseX" style="cursor:pointer; color:#aaa;">✘</span>
            </div>

            <div class="set-body">
                <div class="set-group">
                    <div class="set-title">保存行为</div>
                    <div style="margin-bottom: 8px;">“保存信息”按钮点击后的动作：</div>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" name="copyButtonOutputStyle" value="saveOnly" ${!copyButtonOutputStyleSetting ? 'checked' : ''}> 仅保存到数据库
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="copyButtonOutputStyle" value="presenter" ${copyButtonOutputStyleSetting ? 'checked' : ''}> 保存并复制文本
                        </label>
                    </div>
                    <div class="set-desc">勾选“保存并复制”后，点击按钮将同时复制“讲介士”格式的游戏简介到剪贴板。</div>
                </div>

                <div class="set-group">
                    <div class="set-title">标签高亮 (F95zone)</div>
                    <div class="set-desc" style="margin-bottom:10px;">输入中文标签，多个标签用英文逗号 <code>,</code> 分隔。</div>

                    <div style="margin-bottom:10px;">
                        <label style="color:#90ee90; font-weight:bold;">💚 喜好标签</label>
                        <textarea id="likeInput" class="tag-input">${Like}</textarea>
                    </div>
                    <div style="margin-bottom:10px;">
                        <label style="color:#ff7272; font-weight:bold;">💔 厌恶标签</label>
                        <textarea id="dislikeInput" class="tag-input">${Dislike}</textarea>
                    </div>
                    <div>
                        <label style="color:#ffc107; font-weight:bold;">⚠️ 值得注意</label>
                        <textarea id="concernInput" class="tag-input">${Concern}</textarea>
                    </div>
                </div>
            </div>

            <div class="set-footer">
                <button id="setSaveBtn" class="btn btn-primary">保存 (Save)</button>
                <button id="setCloseBtn" class="btn btn-secondary">关闭 (Close)</button>
            </div>
        `;

        document.body.appendChild(settingsWindow);
        makeDraggable(settingsWindow, document.getElementById('setDragHandle'));

        // 事件绑定
        const closeFunc = () => settingsWindow.remove();
        document.getElementById('setCloseBtn').onclick = closeFunc;
        document.getElementById('setCloseX').onclick = closeFunc;

        document.getElementById('setSaveBtn').onclick = function() {
            // 保存设置
            const selectedMode = document.querySelector('input[name="copyButtonOutputStyle"]:checked').value;
            const newSetting = selectedMode === 'presenter';
            GM_setValue('copyButtonOutputStyle', newSetting);

            // 保存标签
            let likeVal = document.getElementById('likeInput').value.trim().replace(/^,|,$/g, '').split(',').map(s => s.trim()).filter(Boolean).join(',');
            let dislikeVal = document.getElementById('dislikeInput').value.trim().replace(/^,|,$/g, '').split(',').map(s => s.trim()).filter(Boolean).join(',');
            let concernVal = document.getElementById('concernInput').value.trim().replace(/^,|,$/g, '').split(',').map(s => s.trim()).filter(Boolean).join(',');

            // 更新全局变量
            Like = likeVal; Dislike = dislikeVal; Concern = concernVal;
            GM_setValue('喜好的标签', Like);
            GM_setValue('厌恶的标签', Dislike);
            GM_setValue('值得注意的标签', Concern);

            alert('设置已保存！');
            // 如果在 F95 页面则刷新，否则仅关闭窗口
            if (window.location.href.includes('f95zone.to')) {
                location.reload();
            } else {
                closeFunc();
            }
        };
    }
    
    // 窗口UI函数：更新日志
    function openChangelogWindow(currentVer, lastReadVer) {
        if (document.getElementById('changelogWindow')) return;

        // 1. 分离 未读日志 和 历史日志
        const newLogs = [];
        const historyLogs = [];

        CHANGELOGS.forEach(log => {
            // 如果日志版本 > 上次已读版本，且 <= 当前版本 (防止未来版本泄露，虽然一般不会)
            if (compareVersions(log.version, lastReadVer) > 0 && compareVersions(log.version, currentVer) <= 0) {
                newLogs.push(log);
            } else {
                historyLogs.push(log);
            }
        });
        
        // 特殊情况处理：如果是初次安装(lastReadVer为0)，或者没有检测到新日志，
        // 为了避免打开空窗口，可以将最新一条日志强制显示在"新日志"区域，或者只显示历史。
        // 这里采用策略：如果 newLogs 为空，则显示提示文本。

        // 2. 构建窗口 UI
        const overlay = document.createElement('div');
        overlay.id = 'changelogWindow';
        Object.assign(overlay.style, {
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.6)', zIndex: 20020, display: 'flex',
            alignItems: 'center', justifyContent: 'center'
        });

        const win = document.createElement('div');
        Object.assign(win.style, {
            background: '#2c2c2c', border: '1px solid #555', width: '600px', maxHeight: '80vh',
            borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
            color: '#eee', fontFamily: '"Segoe UI", sans-serif', display: 'flex', flexDirection: 'column'
        });

        // 辅助：生成日志列表HTML
        const renderLogsHtml = (logs) => {
            if (logs.length === 0) return '<div style="color:#888; padding:10px; font-style:italic;">暂无内容</div>';
            return logs.map(log => `
                <div style="margin-bottom: 15px; border-left: 3px solid #007bff; padding-left: 10px;">
                    <div style="font-weight: bold; font-size: 15px; color: #fff; display: flex; align-items: baseline; gap: 10px;">
                        <span>v${log.version}</span>
                        <span style="font-size: 12px; color: #aaa; font-weight: normal;">${log.date}</span>
                    </div>
                    <ul style="margin: 5px 0 0 20px; padding: 0; font-size: 13px; color: #ddd; list-style-type: disc;">
                        ${log.content.map(txt => `<li style="margin-bottom: 2px;">${parseLogLinks(txt)}</li>`).join('')}
                    </ul>
                </div>
            `).join('');
        };

        win.innerHTML = `
            <div style="padding: 15px 20px; background: #202020; border-bottom: 1px solid #444; font-weight: bold; font-size: 16px; display: flex; justify-content: space-between;">
                <span>脚本更新日志</span>
                <span id="clCloseX" style="cursor: pointer; color: #aaa;">✘</span>
            </div>
            
            <div style="padding: 20px; overflow-y: auto; flex: 1;">
                <!-- 新版本区域 -->
                <div style="margin-bottom: 20px;">
                    <div style="font-size: 14px; color: #28a745; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #444; padding-bottom: 5px;">
                        最新更新 (v${currentVer})
                    </div>
                    <div id="clNewContainer">
                        ${newLogs.length > 0 ? renderLogsHtml(newLogs) : '<div style="color:#aaa; font-size:13px;">当前已是最新版本，暂无未读更新。</div>'}
                    </div>
                </div>

                <!-- 历史版本按钮 -->
                <button id="clHistoryBtn" style="width: 100%; padding: 8px; background: #333; border: 1px solid #555; color: #ccc; cursor: pointer; border-radius: 4px; font-size: 13px; transition: background 0.2s;">
                    🕒 查看往期更新
                </button>

                <!-- 历史版本区域 (默认隐藏) -->
                <div id="clHistoryContainer" style="display: none; margin-top: 20px; padding-top: 10px; border-top: 1px dashed #444;">
                    <div style="font-size: 14px; color: #888; font-weight: bold; margin-bottom: 10px;">
                        历史版本
                    </div>
                    ${renderLogsHtml(historyLogs)}
                </div>
            </div>

            <div style="padding: 12px 20px; background: #202020; border-top: 1px solid #444; text-align: right;">
                <button id="clCloseBtn" class="btn btn-primary">关闭 (Close)</button>
            </div>
        `;

        overlay.appendChild(win);
        document.body.appendChild(overlay);

        // 事件绑定
        const closeFunc = () => overlay.remove();
        document.getElementById('clCloseBtn').onclick = closeFunc;
        document.getElementById('clCloseX').onclick = closeFunc;

        // 展开历史
        const historyBtn = document.getElementById('clHistoryBtn');
        const historyContainer = document.getElementById('clHistoryContainer');
        historyBtn.onclick = () => {
            if (historyContainer.style.display === 'none') {
                historyContainer.style.display = 'block';
                historyBtn.textContent = '▲ 收起往期更新';
            } else {
                historyContainer.style.display = 'none';
                historyBtn.textContent = '🕒 查看往期更新';
            }
        };
    }

    // 窗口UI函数：编辑本地游戏数据
    function openEditWindow(threadId) {
        if (!threadId) { alert('错误：未提供有效的游戏ID！'); return; }
        if (document.getElementById('editWindow')) return;

        // 获取本地数据，存储到data中
        const localInfo = getLocalInfo(threadId);
        const info = localInfo || {};
        const dataTemplate = getDataTemplate();
        const data = { ...dataTemplate, ...info };
        // 二次确保数组存在（防止旧数据覆盖掉了模板里的空数组）
        if (!data.gameOfficialLinks) data.gameOfficialLinks = JSON.parse(JSON.stringify(dataTemplate.gameOfficialLinks));
        if (!data.gameDownloadLinks) data.gameDownloadLinks = JSON.parse(JSON.stringify(dataTemplate.gameDownloadLinks));

        // 预处理锁定列表
        const lockedFields = data.lockedFields || [];
        const isLocked = (field) => lockedFields.includes(field);

        // SVG 图标定义
        const iconLock = ICONS.LOCK;
        const iconUnlock = ICONS.UNLOCK;

        const editWindow = document.createElement('div');
        editWindow.id = 'editWindow';
        Object.assign(editWindow.style, {
            position: 'fixed', top: '5vh', left: '5vw',
            width: '90vw', height: '90vh',
            background: '#2c2c2c', border: '1px solid #555', padding: '0',
            zIndex: 10002, display: 'flex', flexDirection: 'column',
            boxShadow: '0 5px 25px rgba(0,0,0,0.8)', color: '#eee',
            borderRadius: '8px', overflow: 'hidden'
        });

        const style = `
            <style>
                #editWindow * { box-sizing: border-box; }
                /* 顶部标题栏 */
                .edit-header { padding: 10px 15px; background: #202020; border-bottom: 1px solid #444; display: flex; justify-content: space-between; align-items: center; cursor: move; font-weight: bold; font-size: 16px; }
                /* 主内容区：三栏布局 (弹性分数单位，自动扣除 gap 后再分配) */
                .edit-body { flex: 1; display: grid; grid-template-columns: 28fr 20fr 52fr; gap: 15px; padding: 15px; overflow-y: auto; background: #2c2c2c; }
                .edit-col { display: flex; flex-direction: column; gap: 8px; }

                /* 分组标题 */
                .group-title { font-size: 14px; font-weight: bold; color: #aaa; margin: 10px 0 5px 0; padding-bottom: 3px; border-bottom: 2px solid #444; }
                .edit-col > .group-title:first-child { margin-top: 0; }
                .group-title.blue { border-color: #007bff; color: #80bdff; }
                .group-title.green { border-color: #28a745; color: #85e09b; }
                .group-title.purple { border-color: #6f42c1; color: #d6b3ff; }

                /* 表单控件通用样式 */
                .edit-row { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
                .edit-row label { width: 70px; text-align: right; font-size: 13px; color: #ccc; flex-shrink: 0; }

                /* 输入框容器 */
                .input-wrapper { position: relative; flex: 1; display: flex; align-items: center; }
                .input-wrapper input, .input-wrapper select { width: 100%; background: #3a3a3a; border: 1px solid #555; color: #fff; padding: 4px 6px; font-size: 13px; border-radius: 3px; }
                .input-wrapper input:focus, .input-wrapper select:focus, .edit-textarea-group textarea:focus { border-color: #007bff; outline: none; background: #444; }
                /* 复合行中的输入框间距 */
                .input-wrapper + .input-wrapper { margin-left: 5px; }

                /* 文本域特殊处理 */
                .edit-textarea-group { display: flex; flex-direction: column; flex: 1; margin-bottom: 10px; }
                .edit-textarea-group label { text-align: left; margin-bottom: 4px; font-weight: bold; color: #ddd; }
                .edit-textarea-group textarea { flex: 1; background: #3a3a3a; border: 1px solid #555; color: #fff; padding: 8px; font-size: 13px; border-radius: 3px; resize: none; min-height: 60px; font-family: sans-serif; line-height: 1.4; }

                /* 锁图标相关 */
                .input-wrapper input.has-lock, .input-wrapper select.has-lock { padding-right: 24px; }
                .lock-btn { position: absolute; right: 4px; top: 50%; transform: translateY(-50%); cursor: pointer; color: #666; transition: color 0.2s; display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; z-index: 5; }
                .lock-btn.locked { color: #e74c3c; } /* 锁定红 */
                .lock-btn:hover { color: #aaa; }
                .lock-btn.locked:hover { color: #ff6b6b; }

                /* 评分高亮展示 */
                .score-display { flex: 1; text-align: right; color: #fff; font-weight: bold; font-size: 13px; white-space: nowrap; margin-left: 5px; }
                .score-meta { font-size: 12px; color: #aaa; font-weight: normal; }

                /* 底部操作栏 */
                .edit-footer { padding: 10px 15px; background: #202020; border-top: 1px solid #444; display: flex; justify-content: space-between; align-items: center; }
                .btn { padding: 6px 16px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; color: white; transition: background 0.2s; }
                .btn-primary { background: #007bff; }
                .btn-primary:hover { background: #0056b3; }
                .btn-secondary { background: #6c757d; }
                .btn-secondary:hover { background: #545b62; }
                .btn-danger { background: transparent; color: #dc3545; border: 1px solid #dc3545; }
                .btn-danger:hover { background: #dc3545; color: white; }

                /* 自定义滚动条 */
                ::-webkit-scrollbar { width: 8px; height: 8px; }
                ::-webkit-scrollbar-thumb { background: #555; border-radius: 4px; }
                ::-webkit-scrollbar-track { background: #2c2c2c; }

                /* 链接样式 */
                .link-icon-btn {
                    width: 32px; height: 32px; border-radius: 4px; display: flex; align-items: center; justify-content: center;
                    text-decoration: none; font-size: 18px; transition: transform 0.1s; background: #333; color: #777;
                    border: 1px solid #444;
                }
                .link-icon-btn.active { background: #223D58; color: #fff; border-color: #007bff; cursor: pointer; }
                .link-icon-btn.active:hover { transform: scale(1.1); filter: brightness(1.2); }
                .link-icon-btn.disabled { pointer-events: none; opacity: 0.5; }

                .dl-link-item { font-size: 13px; margin-bottom: 4px; display: flex; align-items: center; }
                .dl-link-item a { color: #80bdff; text-decoration: none; margin-right: 5px; font-weight: bold; }
                .dl-link-item a:hover { text-decoration: underline; }
                .dl-link-item span { color: #aaa; }
            </style>
        `;


        // 核心辅助函数：生成控件 HTML
        // id: 字段ID
        // label: 标签文字 (如果 config.noRow=true 则忽略)
        // value: 当前值
        // config: { type, options?, lockable?, locked?, noRow?, width?, placeholder? }
        function createField(id, label, value, config) {
            const {
                type = 'text',      // text | number | select | datalist
                options = [],       // 下拉数组 (针对 select/datalist)
                lockable = true,    // 默认显示锁
                locked = false,     // 当前是否锁定
                noRow = false,      // 默认为 false。如果为 true，只返回控件本身的 HTML 字符串，不包裹外层的 <div class="edit-row"> 和 <label>
                width = null,       // 输入框固定宽度
                placeholder = ''    // 提示字符串
            } = config;

            // 1. 生成锁图标
            let lockHtml = '';
            let inputClass = '';
            if (lockable) {
                inputClass = 'has-lock';
                const icon = locked ? iconLock : iconUnlock;
                const title = locked ? '已锁定 (点击解锁)' : '未锁定 (点击锁定)';
                const stateClass = locked ? 'locked' : '';
                lockHtml = `<div class="lock-btn ${stateClass}" data-for="${id}" title="${title}">${icon}</div>`;
            }

            // 2. 生成输入控件
            let inputHtml = '';
            const styleAttr = width ? `style="width:${width}; flex:none;"` : '';

            if (type === 'select') {
                const optsHtml = options.map(o => {
                    const v = (typeof o === 'object') ? o.v : o;
                    const t = (typeof o === 'object') ? o.t : o;
                    const isSel = String(v) === String(value);
                    return `<option value="${v}" ${isSel ? 'selected' : ''}>${t}</option>`;
                }).join('');
                inputHtml = `<select id="${id}" class="${inputClass}" ${styleAttr}>${optsHtml}</select>`;
            } else if (type === 'datalist') {
                const listId = `list-${id}`;
                const optsHtml = options.map(t => `<option value="${t}">`).join('');
                inputHtml = `
                    <input type="text" id="${id}" value="${value || ''}" list="${listId}" class="${inputClass}" ${styleAttr} placeholder="${placeholder}">
                    <datalist id="${listId}">${optsHtml}</datalist>
                `;
            } else { // text, number
                inputHtml = `<input type="${type}" id="${id}" value="${value || ''}" class="${inputClass}" ${styleAttr} placeholder="${placeholder}">`;
            }

            // 3. 组合 HTML
            const wrapperHtml = `
                <div class="input-wrapper" ${width ? `style="flex:none; width:${width}"` : ''}>
                    ${inputHtml}
                    ${lockHtml}
                </div>
            `;

            if (noRow) return wrapperHtml; // 仅返回控件部分

            return `
                <div class="edit-row">
                    <label for="${id}">${label}</label>
                    ${wrapperHtml}
                </div>
            `;
        }

        // 辅助UI函数：备注按钮
        // id: 备注字段的ID (如 'gameChineseNote')
        // value: 当前备注值
        // label: 提示文本 (如 '汉化组信息')
        // linkedSelectId: 可选，关联的下拉框ID (用于NTR等需要读取选项Map的场景)
        function createNoteBtn(id, value, label, linkedSelectId = null) {
            const hasVal = !!value;
            const btnStyle = hasVal ? 'color:#ffc107;' : 'color:#666;'; // 有值高亮
            const title = hasVal ? `${value}` : `添加备注 (${label})`;
            
            // 将 linkedSelectId 存入 data 属性
            const linkedAttr = linkedSelectId ? `data-linked="${linkedSelectId}"` : '';

            return `
                <button type="button" class="btn-note-toggle" data-for="${id}" ${linkedAttr} title="${title}"
                        style="background:none; border:none; cursor:pointer; font-size:16px; padding:0 6px; line-height:1; ${btnStyle}">
                    📝
                </button>
                <input type="hidden" id="${id}" value="${value || ''}">
            `;
        }
        
        // 辅助UI函数：备注按钮的编辑器窗口 (支持快捷标签)
        function openNoteEditor(title, initialValue, quickTags, onSave) {
            const overlay = document.createElement('div');
            Object.assign(overlay.style, {
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(0,0,0,0.6)', zIndex: 20010, display: 'flex',
                alignItems: 'center', justifyContent: 'center'
            });

            const win = document.createElement('div');
            Object.assign(win.style, {
                background: '#333', border: '1px solid #555', width: '400px',
                borderRadius: '6px', boxShadow: '0 5px 25px rgba(0,0,0,0.8)',
                color: '#eee', fontFamily: 'sans-serif', overflow: 'hidden', display:'flex', flexDirection:'column'
            });

            // 生成快捷标签HTML
            let tagsHtml = '';
            if (quickTags && quickTags.length > 0) {
                tagsHtml = `<div style="padding:10px; border-bottom:1px solid #444; background:#2a2a2a; display:flex; flex-wrap:wrap; gap:6px;">`;
                tagsHtml += `<div style="width:100%; font-size:12px; color:#aaa; margin-bottom:4px;">快捷标签 (点击添加/移除):</div>`;
                tagsHtml += quickTags.map(tag => 
                    `<button class="quick-tag-btn" data-tag="${tag}" style="padding:4px 8px; font-size:12px; background:#444; border:1px solid #555; color:#ccc; border-radius:12px; cursor:pointer;">${tag}</button>`
                ).join('');
                tagsHtml += `</div>`;
            }

            win.innerHTML = `
                <div style="padding:10px 15px; background:#222; border-bottom:1px solid #444; font-weight:bold;">${title}</div>
                ${tagsHtml}
                <div style="padding:15px; flex:1;">
                    <textarea id="noteEditorInput" style="width:100%; height:80px; background:#222; border:1px solid #555; color:#fff; padding:8px; border-radius:4px; resize:none;">${initialValue || ''}</textarea>
                </div>
                <div style="padding:10px 15px; background:#222; border-top:1px solid #444; text-align:right;">
                    <button id="noteSaveBtn" class="btn btn-primary" style="padding:4px 12px; font-size:13px;">确定</button>
                    <button id="noteCancelBtn" class="btn btn-secondary" style="padding:4px 12px; font-size:13px; margin-left:8px;">取消</button>
                </div>
            `;

            overlay.appendChild(win);
            document.body.appendChild(overlay);

            const input = win.querySelector('#noteEditorInput');
            const close = () => overlay.remove();

            // 快捷标签点击逻辑 (基于前缀匹配)
            win.querySelectorAll('.quick-tag-btn').forEach(btn => {
                btn.onclick = () => {
                    const tag = btn.dataset.tag;
                    let fullText = input.value;
                    
                    const PREFIX = '标签：';
                    const SUFFIX = '。';
                    const SEPARATOR = '，';
                    const LINE_BREAK = '\n';
                    
                    // 1. 分离首行和剩余内容
                    // 注意：这里按第一个换行符分割，如果没有换行符，则整个文本视为第一行
                    let firstLine = fullText;
                    let restText = '';
                    const breakIndex = fullText.indexOf(LINE_BREAK);
                    
                    if (breakIndex !== -1) {
                        firstLine = fullText.substring(0, breakIndex);
                        restText = fullText.substring(breakIndex + 1); // 不包含换行符本身，后续拼接时补上
                    }

                    // 2. 判断首行是否为标签行
                    // 条件：以 PREFIX 开头，且以 SUFFIX 结尾
                    let isTagLine = firstLine.startsWith(PREFIX) && firstLine.endsWith(SUFFIX);
                    
                    let currentTags = [];
                    
                    if (isTagLine) {
                        // 提取中间的内容：去除前缀和后缀
                        const content = firstLine.substring(PREFIX.length, firstLine.length - SUFFIX.length);
                        if (content.trim()) {
                            currentTags = content.split(/，|,|;|；/).map(s => s.trim()).filter(Boolean);
                        }
                    } else {
                        // 如果不是标签行，则说明整个 firstLine 其实是正文的一部分
                        // 把它归还给 restText（如果有 restText，要补回换行符；如果没有，直接作为 restText）
                        if (breakIndex !== -1) {
                            restText = firstLine + LINE_BREAK + restText;
                        } else {
                            restText = firstLine;
                        }
                        // 此时标签列表为空
                        currentTags = [];
                    }

                    // 3. 增删逻辑
                    if (currentTags.includes(tag)) {
                        currentTags = currentTags.filter(t => t !== tag);
                    } else {
                        currentTags.push(tag);
                    }

                    // 4. 重组文本
                    let newFirstLine = '';
                    if (currentTags.length > 0) {
                        newFirstLine = PREFIX + currentTags.join(SEPARATOR) + SUFFIX;
                        
                        // 拼接：标签行 + 换行 + 正文
                        // 注意处理正文为空的情况，避免多余的换行
                        if (restText) {
                            input.value = newFirstLine + LINE_BREAK + restText;
                        } else {
                            input.value = newFirstLine;
                        }
                    } else {
                        // 标签被清空，只保留正文
                        input.value = restText;
                    }

                    input.focus(); // 保持焦点
                };
            });

            document.getElementById('noteSaveBtn').onclick = () => {
                onSave(input.value.trim());
                close();
            };
            document.getElementById('noteCancelBtn').onclick = close;
            
            setTimeout(() => input.focus(), 50); // 自动聚焦
        }

        // 辅助函数：生成评分行 (复用 createField)
        function createScoreRow(site, idKey, voteKey, scoreKey) {
            const idVal = data[idKey] || '';
            const voteVal = data[voteKey] ? `${data[voteKey]}人` : 'N/A';
            const scoreVal = data[scoreKey] ? `${data[scoreKey]}` : 'N/A';

            // 生成定宽 ID 输入框
            const idInputHtml = createField(idKey, '', idVal, {
                type: 'text',
                lockable: true,
                locked: isLocked(idKey),
                noRow: true,
                width: '100px'
            });

            return `
                <div class="edit-row">
                    <label>${site} ID</label>
                    ${idInputHtml}
                    <div class="score-display">
                        ${scoreVal} <span class="score-meta">（${voteVal}）</span>
                    </div>
                </div>
            `;
        }

        // 辅助函数：渲染链接区域
        function renderLinksArea() {
            const container = document.getElementById('links-container');
            if (!container) return;
            container.innerHTML = ''; // 清空

            // 1. 官方网址区域 (Row 1)
            const offRow = document.createElement('div');
            Object.assign(offRow.style, { display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px' });

            // 图标映射
            const iconMap = { '独立官网':'🏠', 'DLsite':'RJ', 'Patreon':'🅿️', 'SubscribeStar':'⭐' };
            const defaultIcon = '🔗';

            data.gameOfficialLinks.forEach(link => {
                const btn = document.createElement('a');
                btn.className = 'link-icon-btn';
                btn.textContent = iconMap[link.name] || defaultIcon;
                btn.title = link.name;

                if (link.url) {
                    btn.classList.add('active');
                    btn.href = link.url;
                    btn.target = '_blank';
                } else {
                    btn.classList.add('disabled');
                }
                offRow.appendChild(btn);
            });

            // 编辑按钮 (官方)
            const editOffBtn = document.createElement('button');
            editOffBtn.textContent = '✏️';
            editOffBtn.className = 'btn-secondary';
            Object.assign(editOffBtn.style, { marginLeft:'auto', padding:'2px 8px', fontSize:'12px' });
            editOffBtn.onclick = () => {
                openLinkEditor('编辑官方链接', data.gameOfficialLinks, true, (newData) => {
                    data.gameOfficialLinks = newData;
                    renderLinksArea(); // 刷新显示
                });
            };
            offRow.appendChild(editOffBtn);
            container.appendChild(offRow);

            // 2. 下载网址区域 (Row 2+)
            const dlContainer = document.createElement('div');
            Object.assign(dlContainer.style, { background:'#222', padding:'8px', borderRadius:'4px', position:'relative', minHeight:'40px' });

            let hasDl = false;
            data.gameDownloadLinks.forEach((link, idx) => {
                if (link.url) {
                    hasDl = true;
                    const row = document.createElement('div');
                    row.className = 'dl-link-item';
                    const nameShow = link.name ? link.name : `下载地址 ${idx+1}`;
                    row.innerHTML = `<a href="${link.url}" target="_blank">🔗 ${nameShow}</a>`;
                    dlContainer.appendChild(row);
                }
            });

            if (!hasDl) {
                dlContainer.innerHTML = `<div style="color:#555; font-size:12px; text-align:center; padding:5px;">暂无下载链接</div>`;
            }

            // 编辑按钮 (下载) - 放在右下角
            const editDlBtn = document.createElement('button');
            editDlBtn.textContent = '✏️';
            editDlBtn.className = 'btn-secondary';
            Object.assign(editDlBtn.style, { position:'absolute', bottom:'5px', right:'5px', padding:'2px 8px', fontSize:'12px' });
            editDlBtn.onclick = () => {
                openLinkEditor('编辑下载链接', data.gameDownloadLinks, false, (newData) => {
                    data.gameDownloadLinks = newData;
                    renderLinksArea(); // 刷新显示
                });
            };
            dlContainer.appendChild(editDlBtn);
            container.appendChild(dlContainer);
        }

        // 选项数据，供 datalist 使用
        // 使用全局变量GAME_CHINESE_OPTS、GAME_AUDIO_OPTS提供选项
        const engineList = ['Ren\'Py', 'Unity', 'Unreal', 'RPGMaker', 'HTML', '未知'];
        const cgEngineList = ['Daz', 'I社', '手绘', '软绘', 'AI', '拍摄', 'Live2D', 'Spine', 'VAM'];
        // const cgTypeOpts = [{v: '', t: '(未知)'}, '3D动态', '2D动态', '2D静态', '像素动态'];
        const cgTypeOpts = ['3D动态', '2D动态', '2D静态', '像素动态', '真人动态'];
        // 选项数据，专供游戏大类gameType、游戏小类gameGenre
        const gameCategoryMap = {
            'VN': ['单线剧情', '多线剧情', '纯拔作'],
            'SLG': ['沙盒', '有限时时段', '无限时时段', '伪时段'],
            'RPG': ['战斗向', '剧情向'],
            'Rogue': ['卡牌', '战斗'],
            '休闲': ['益智', '休闲', '弱智'],
            '棋牌': ['纸牌', '麻将', '骰子'],
            'ACT': ['横版过关', '横版格斗', 'FPS']
        };
        const currentGenreOpts = gameCategoryMap[data.gameType] || []; // 计算当前应当显示的 genreList（根据已有的 gameType）
        // 选项数据，供 select 使用
        const devStatusOpts = ['更新中', '完成', '弃坑'];
        const userStatusOpts = [{v:0,t:'关注中'}, {v:1,t:'准备玩'}, {v:2,t:'正在玩'}, {v:3,t:'已完成'}, {v:9,t:'黑名单'}];
        const artStyleOpts = [{v:null,t:'(未知)'}, {v:1,t:'美式'}, {v:2,t:'日式'}, {v:3,t:'亚洲'}, {v:4,t:'中式'}, {v:5,t:'韩式'}, {v:6,t:'真人'}];
        const mosaicOpts = [{v:null,t:'(未知)'}, {v:0,t:'无码'}, {v:1,t:'有码'}];
        const typeList = Object.keys(gameCategoryMap); // 提取所有大类：['VN', 'SLG', ...]
        // 这里有一点要注意，select模式需要考虑下拉框文本的默认值问题，避免保存时null被默认值覆盖，datalist则不用。

        // 构建 HTML
        editWindow.innerHTML = `
            ${style}
            <div class="edit-header" id="editDragHandle">
                <span>编辑本地数据 (F95 ID: ${threadId})</span>
                <button id="editCloseX" style="background:none;border:none;color:#aaa;font-size:20px;cursor:pointer;">✘</button>
            </div>

            <div class="edit-body">
                <!-- ========== 左栏：基本信息与评分 ========== -->
                <div class="edit-col">
                    <div class="group-title blue">基本信息</div>
                    ${createField('gameName1', '英文名称', data.gameName1, { locked: isLocked('gameName1') })}
                    ${createField('gameName2', '中文名称', data.gameName2, { locked: isLocked('gameName2'), placeholder: '非官方名称建议加 * 后缀' })}
                    ${createField('gameName3', '别　　名', data.gameName3, { locked: isLocked('gameName3'), placeholder: '多个名称用 | 分隔' })}
                    ${createField('gameDev', '作　　者', data.gameDev, { locked: isLocked('gameDev') })}

                    <div class="group-title blue">版本状态</div>
                    <div class="edit-row">
                        <label>版本进度</label>
                        ${createField('gameVersion', '', data.gameVersion, { locked: isLocked('gameVersion'), noRow: true, placeholder: '版本号' })}
                        ${createField('gameDevStatus', '', data.gameDevStatus, { type: 'select', options: devStatusOpts, locked: isLocked('gameDevStatus'), noRow: true, width: '100px' })}
                    </div>
                    ${createField('gameReleaseDate', '更新时间', data.gameReleaseDate, { locked: isLocked('gameReleaseDate') })}

                    <div class="group-title blue">网站数据</div>
                    <div class="edit-row">
                        <label>F95 ID</label>
                        <input type="text" value="${data.f95ThreadId}" disabled style="background:#222;color:#777; width:100px; flex:none; padding:4px 6px; border:1px solid #444;">
                        <div class="score-display">
                            ${data.f95AvgScore||'N/A'} <span class="score-meta">（${data.f95VoteCount?data.f95VoteCount+'人':'N/A'}）</span>
                        </div>
                    </div>
                    ${createScoreRow('Steam', 'steamId', 'steamVoteCount', 'steamAvgScore')}
                    ${createScoreRow('VNDB', 'vndbId', 'vndbVoteCount', 'vndbAvgScore')}

                    <div class="group-title blue">其他链接</div>
                    <!-- 链接区域容器 -->
                    <div id="links-container"></div>
                </div>

                <!-- ========== 中栏：属性标签 ========== -->
                <div class="edit-col">
                    <div class="group-title purple">个人状态</div>
                    ${createField('userPlayStatus', '关注状态', data.userPlayStatus, { type: 'select', options: userStatusOpts, lockable: false })}

                    <div class="group-title purple">游戏属性</div>
                    ${createField('gameType', '游戏大类', data.gameType, { type: 'datalist', options: typeList, locked: isLocked('gameType') })}
                    ${createField('gameGenre', '游戏小类', data.gameGenre, { type: 'datalist', options: currentGenreOpts, lockable: false })}
                    ${createField('gameEngine', '游戏引擎', data.gameEngine, { type: 'datalist', options: engineList, locked: isLocked('gameEngine') })}

                    <div class="edit-row">
                        <label>中文汉化</label>
                        <div style="flex:1; display:flex; align-items:center;">
                            ${createField('gameChineseId', '', data.gameChineseId, {
                                type: 'select',
                                options: GAME_CHINESE_OPTS, // 使用全局常量
                                locked: isLocked('gameChineseId'),
                                noRow: true
                            })}
                            ${createNoteBtn('gameChineseNote', data.gameChineseNote, '汉化作者等信息')}
                        </div>
                    </div>

                    <div class="edit-row">
                        <label>游戏音声</label>
                        <div style="flex:1; display:flex; align-items:center;">
                            ${createField('gameAudioId', '', data.gameAudioId, {
                                type: 'select',
                                options: GAME_AUDIO_OPTS, // 使用全局常量
                                locked: isLocked('gameAudioId'),
                                noRow: true
                            })}
                            ${createNoteBtn('gameAudioNote', data.gameAudioNote, '声优等信息')}
                        </div>
                    </div>

                    <div class="edit-row">
                        <label>NTR 题材</label>
                        <div style="flex:1; display:flex; align-items:center;">
                            ${createField('gameThemeNtrId', '', data.gameThemeNtrId, {
                                type: 'select',
                                options: GAME_THEME_NTR_OPTS,
                                locked: isLocked('gameThemeNtrId'),
                                noRow: true
                            })}
                            <!-- 传入 linkedSelectId='gameThemeNtrId' 以启用快捷标签功能 -->
                            ${createNoteBtn('gameThemeNtrNote', data.gameThemeNtrNote, 'NTR类型备注', 'gameThemeNtrId')}
                        </div>
                    </div>

                    <div class="group-title purple">美术规格</div>
                    <!-- 第一行：ＣＧ画风 + ＣＧ类型 -->
                    <div class="edit-row">
                        <label>ＣＧ画风</label>
                        ${createField('gameCGArtStyle', '', data.gameCGArtStyle, { type: 'select', options: artStyleOpts, lockable: false, noRow: true })}
                        <label>ＣＧ类型</label>
                        ${createField('gameCGType', '', data.gameCGType, { type: 'datalist', options: cgTypeOpts, lockable: false, noRow: true })}
                    </div>
                    <!-- 第二行：ＣＧ引擎 + 马赛克 -->
                    <div class="edit-row">
                        <label>ＣＧ引擎</label>
                        ${createField('gameCGEngine', '', data.gameCGEngine, { type: 'datalist', options: cgEngineList, lockable: false, noRow: true })}
                        <label>马 赛 克</label>
                        ${createField('gameCGMosaic', '', data.gameCGMosaic, { type: 'select', options: mosaicOpts, lockable: false, noRow: true })}
                    </div>
                </div>

                <!-- ========== 右栏：游玩记录 ========== -->
                <div class="edit-col">
                    <div class="group-title green">游玩记录</div>
                    <div class="edit-row">
                        <label>评分/日期</label>
                        ${createField('userScore', '', data.userScore, { type: 'number', lockable: false, noRow: true, placeholder: '0-10' })}
                        ${createField('userFinishDate', '', data.userFinishDate, { type: 'text', lockable: false, noRow: true, placeholder: 'YYYY-MM-DD' })}
                    </div>

                    <div class="edit-textarea-group" style="flex:0.5;">
                        <label>简评</label>
                        <textarea id="userCommentSummary" placeholder="简要概述一下对游戏的整体评价……">${data.userCommentSummary||''}</textarea>
                    </div>
                    <div class="edit-textarea-group">
                        <label style="color:#85e09b;">优点</label>
                        <textarea id="userCommentPros" placeholder="可以考虑从以下方面评价游戏的优点：\n角色/剧情/成人内容/游戏性/制作……">${data.userCommentPros||''}</textarea>
                    </div>
                    <div class="edit-textarea-group">
                        <label style="color:#ff8585;">缺点</label>
                        <textarea id="userCommentCons" placeholder="可以考虑从以下方面评价游戏的缺点：\n角色/剧情/成人内容/游戏性/制作……">${data.userCommentCons||''}</textarea>
                    </div>
                    <div class="edit-textarea-group">
                        <label>备注</label>
                        <textarea id="userCommentOther" placeholder="其他想要记录的信息……">${data.userCommentOther||''}</textarea>
                    </div>
                </div>
            </div>

            <div class="edit-footer">
                <button id="btnDeleteData" class="btn btn-danger">🗑 清除数据</button>
                <button id="btnShareData" class="btn btn-secondary" style="margin-left:10px; background:#6f42c1; border-color:#6f42c1;">📤 分享游戏</button>
                <div>
                    <span id="saveStatus" style="color:#28a745; margin-right:10px; opacity:0; transition:opacity 0.5s;">已保存!</span>
                    <button id="editSaveBtn" class="btn btn-primary">保存 (Save)</button>
                    <button id="editCloseBtn" class="btn btn-secondary" style="margin-left:10px;">关闭 (Close)</button>
                </div>
            </div>
        `;

        document.body.appendChild(editWindow);
        makeDraggable(editWindow, document.getElementById('editDragHandle'));
        renderLinksArea();

        // --- 事件绑定 ---
        // 备注按钮点击事件
        editWindow.querySelectorAll('.btn-note-toggle').forEach(btn => {
            btn.onclick = () => {
                const inputId = btn.getAttribute('data-for');
                const linkedSelectId = btn.getAttribute('data-linked');
                const input = document.getElementById(inputId);
                if (!input) return;

                const oldVal = input.value;
                const titleText = btn.title.includes('添加备注') ? '编辑备注' : btn.title;
                
                // 获取快捷标签数组
                let quickTags = [];
                if (linkedSelectId) {
                    const selectEl = document.getElementById(linkedSelectId);
                    if (selectEl) {
                        const selectedVal = selectEl.value;
                        // 尝试从 GAME_THEME_NTR_MAP 中获取 notes
                        if (GAME_THEME_NTR_MAP && GAME_THEME_NTR_MAP[selectedVal]) {
                            quickTags = GAME_THEME_NTR_MAP[selectedVal].notes || [];
                        }
                    }
                }

                // 打开自定义编辑器
                openNoteEditor(titleText, oldVal, quickTags, (newVal) => {
                    input.value = newVal;
                    // 更新按钮视觉状态
                    if (input.value) {
                        btn.style.color = '#ffc107';
                        btn.title = `${input.value}`;
                    } else {
                        btn.style.color = '#666';
                        btn.title = `添加备注`;
                    }
                });
            };
        });

        // 监听游戏大类变化，动态更新小类列表
        const typeInput = document.getElementById('gameType');
        const genreDatalist = document.getElementById('list-gameGenre'); // createField 会自动生成 id="list-字段名" 的 datalist
        if (typeInput && genreDatalist) {
            typeInput.addEventListener('input', function() {
                const selectedType = this.value; // 获取当前输入的大类
                const newGenres = gameCategoryMap[selectedType] || []; // 获取对应的小类数组，如果没有匹配则为空

                // 重建 datalist 的选项
                genreDatalist.innerHTML = newGenres.map(t => `<option value="${t}">`).join('');

                // 如果切换了大类，且当前的小类不属于新大类，可以清空小类输入框
                const genreInput = document.getElementById('gameGenre');
                if (!newGenres.includes(genreInput.value)) genreInput.value = '';
            });
        }

        // 关闭按钮
        const closeFunc = () => editWindow.remove();
        document.getElementById('editCloseBtn').onclick = closeFunc;
        document.getElementById('editCloseX').onclick = closeFunc;

        // 锁图标交互 (点击切换 SVG 和 class)
        // 注意：SVG 结构较复杂，我们通过切换容器 .lock-btn 的 class，并重新渲染 innerHTML 来实现图标切换
        editWindow.querySelectorAll('.lock-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation(); // 防止触发 input focus
                const isLocked = this.classList.contains('locked');
                if (isLocked) {
                    this.classList.remove('locked');
                    this.innerHTML = iconUnlock;
                    this.title = '未锁定 (点击锁定)';
                } else {
                    this.classList.add('locked');
                    this.innerHTML = iconLock;
                    this.title = '已锁定 (点击解锁)';
                }
            });
        });

        // 输入框修改自动加锁
        editWindow.querySelectorAll('input, select').forEach(el => {
            const id = el.id;
            // 排除掉没有对应锁的字段（比如 userScore）
            const btn = editWindow.querySelector(`.lock-btn[data-for="${id}"]`);
            if (btn) {
                el.addEventListener('change', () => {
                    if (!btn.classList.contains('locked')) {
                        btn.classList.add('locked');
                        btn.innerHTML = iconLock;
                        btn.title = '已锁定 (自动)';
                    }
                });
            }
        });

        // 清除数据按钮
        document.getElementById('btnDeleteData').onclick = () => {
            if (confirm(`确定要彻底删除 ID: ${threadId} 的所有本地数据吗？此操作不可恢复。`)) {
                const DB_KEY = 'f95GameDatabase';
                const database = JSON.parse(GM_getValue(DB_KEY, '{}'));
                delete database[threadId];
                GM_setValue(DB_KEY, JSON.stringify(database));
                alert('数据已清除。');
                closeFunc();

                window.dispatchEvent(new CustomEvent('f95_db_updated')); // 广播数据更新事件
            }
        };

        // 分享按钮
        document.getElementById('btnShareData').onclick = function() {
            try {
                // 使用当前的 data 对象（它是最新的编辑状态，或者是刚打开时的状态）
                // 注意：如果用户修改了但没保存，这里分享的是未保存的草稿状态，这符合预期
                const text = generateShareData(data);

                navigator.clipboard.writeText(text).then(() => {
                    const btn = this;
                    const originalText = btn.textContent;
                    const originalBg = btn.style.background;
                    btn.textContent = '已复制分享码!';
                    btn.style.background = '#28a745'; // 绿色
                    btn.style.borderColor = '#28a745';
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.background = originalBg;
                        btn.style.borderColor = originalBg;
                    }, 2000);
                });
            } catch (err) {
                alert('生成分享码失败: ' + err.message);
            }
        };

        // 保存按钮
        document.getElementById('editSaveBtn').onclick = () => {
            const DB_KEY = 'f95GameDatabase';
            try {
                const database = JSON.parse(GM_getValue(DB_KEY, '{}'));

                const updatedInfo = { ...data };
                // renderLinksArea 回调已经提前更新了gameOfficialLinks 和 gameDownloadLinks

                // 辅助取值函数
                const val = (id) => { const el = document.getElementById(id); return el ? (el.value.trim() || null) : null; };
                const num = (id) => { const el = document.getElementById(id); return el ? parseInt(el.value) : 0; };
                const nullableInt = (id) => {
                    const el = document.getElementById(id);
                    if (!el) return null;
                    if (el.value === 'null' || el.value === '') return null; // 兼容空字符串
                    return parseInt(el.value, 10);
                };
                const scoreStr = (id) => {
                    const el = document.getElementById(id);
                    if (!el || !el.value) return null;
                    const v = parseFloat(el.value);
                    return isNaN(v) ? null : v.toFixed(1);
                }; // 输入的分数转换为保留一位小数的字符串

                // 左栏
                updatedInfo.gameName1 = val('gameName1');
                updatedInfo.gameName2 = val('gameName2');
                updatedInfo.gameName3 = val('gameName3');
                updatedInfo.gameDev = val('gameDev');
                updatedInfo.gameVersion = val('gameVersion');
                updatedInfo.gameDevStatus = val('gameDevStatus');
                updatedInfo.gameReleaseDate = val('gameReleaseDate');
                updatedInfo.steamId = val('steamId');
                updatedInfo.vndbId = val('vndbId');

                // 中栏
                updatedInfo.userPlayStatus = num('userPlayStatus');
                updatedInfo.gameType = val('gameType');
                updatedInfo.gameGenre = val('gameGenre');
                updatedInfo.gameEngine = val('gameEngine');
                updatedInfo.gameChineseId = nullableInt('gameChineseId');
                updatedInfo.gameChineseNote = val('gameChineseNote');
                updatedInfo.gameAudioId = nullableInt('gameAudioId');
                updatedInfo.gameAudioNote = val('gameAudioNote');
                updatedInfo.gameThemeNtrId = nullableInt('gameThemeNtrId');
                updatedInfo.gameThemeNtrNote = val('gameThemeNtrNote');
                updatedInfo.gameCGArtStyle = nullableInt('gameCGArtStyle');
                updatedInfo.gameCGType = val('gameCGType');
                updatedInfo.gameCGEngine = val('gameCGEngine');
                updatedInfo.gameCGMosaic = nullableInt('gameCGMosaic');

                // 右栏
                updatedInfo.userScore = scoreStr('userScore');
                updatedInfo.userFinishDate = val('userFinishDate');
                updatedInfo.userCommentSummary = val('userCommentSummary');
                updatedInfo.userCommentPros = val('userCommentPros');
                updatedInfo.userCommentCons = val('userCommentCons');
                updatedInfo.userCommentOther = val('userCommentOther');

                // 锁定状态
                const newLockedFields = [];
                editWindow.querySelectorAll('.lock-btn.locked').forEach(btn => {
                    const fieldId = btn.getAttribute('data-for');
                    if (fieldId) newLockedFields.push(fieldId);
                });
                updatedInfo.lockedFields = newLockedFields;

                // 确保主键存在
                updatedInfo.f95ThreadId = threadId;

                // 更新最后修改时间
                updatedInfo.lastModified = Date.now();

                // 写入存储
                database[threadId] = updatedInfo;
                GM_setValue(DB_KEY, JSON.stringify(database));

                // 广播数据更新事件
                window.dispatchEvent(new CustomEvent('f95_db_updated'));

                // 视觉反馈
                const statusEl = document.getElementById('saveStatus');
                statusEl.style.opacity = '1';
                setTimeout(() => { statusEl.style.opacity = '0'; }, 2000);

                // 更新引用，防止再次保存时覆盖
                Object.assign(data, updatedInfo);

            } catch (error) {
                console.error('[F95助手] 保存失败:', error);
                alert('保存失败，请查看控制台。');
            }
        };
    }
    // 子窗口UI函数：通用链接编辑器（固定4行）
    // title: 窗口标题
    // dataArray: 包含4个对象的数组 [{name, url}, ...]
    // isOfficial: boolean, 如果为true，则name字段不可编辑
    // onSave: 回调函数 (newData) => void
    function openLinkEditor(title, dataArray, isOfficial, onSave) {
        // 创建遮罩和窗口
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.5)', zIndex: 20000, display: 'flex',
            alignItems: 'center', justifyContent: 'center'
        });

        const win = document.createElement('div');
        Object.assign(win.style, {
            background: '#333', border: '1px solid #555', width: '500px',
            borderRadius: '6px', boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
            color: '#eee', fontFamily: 'sans-serif', overflow: 'hidden'
        });

        // HTML 结构
        const rowsHtml = dataArray.map((item, index) => {
            const nameVal = item.name || '';
            const urlVal = item.url || '';

            // 如果是官方链接，Name显示为文本；如果是下载链接，Name显示为输入框
            const nameInput = isOfficial
                ? `<div style="padding:6px; color:#aaa; font-weight:bold;">${nameVal}</div><input type="hidden" id="link-name-${index}" value="${nameVal}">`
                : `<input type="text" id="link-name-${index}" value="${nameVal}" placeholder="说明 (如: 百度盘)" style="width:100%; box-sizing:border-box; padding:5px; background:#444; border:1px solid #666; color:#fff;">`;

            return `
                <div style="display:grid; grid-template-columns: 120px 1fr 40px; gap:10px; margin-bottom:10px; align-items:center;">
                    <div style="text-align:right;">${nameInput}</div>
                    <div>
                        <input type="text" id="link-url-${index}" value="${urlVal}" placeholder="https://..." style="width:100%; box-sizing:border-box; padding:5px; background:#444; border:1px solid #666; color:#fff;">
                    </div>
                    <button class="btn-clear-row" data-idx="${index}" style="background:none; border:none; cursor:pointer; color:#ff6b6b; font-size:16px;" title="清空">✖</button>
                </div>
            `;
        }).join('');

        win.innerHTML = `
            <div style="padding:10px 15px; background:#222; border-bottom:1px solid #444; font-weight:bold; display:flex; justify-content:space-between;">
                <span>${title}</span>
                <span id="subCloseX" style="cursor:pointer;">×</span>
            </div>
            <div style="padding:20px;">
                ${rowsHtml}
            </div>
            <div style="padding:10px 15px; background:#222; border-top:1px solid #444; text-align:right;">
                <button id="subSaveBtn" style="padding:5px 15px; background:#007bff; border:none; color:white; border-radius:3px; cursor:pointer; font-weight:bold;">保存</button>
                <button id="subCloseBtn" style="padding:5px 15px; background:#666; border:none; color:white; border-radius:3px; cursor:pointer; margin-left:10px;">取消</button>
            </div>
        `;

        overlay.appendChild(win);
        document.body.appendChild(overlay);

        // 事件处理
        const close = () => overlay.remove();

        // 清空按钮逻辑
        win.querySelectorAll('.btn-clear-row').forEach(btn => {
            btn.onclick = () => {
                const idx = btn.dataset.idx;
                document.getElementById(`link-url-${idx}`).value = '';
                // 如果不是官方链接（即Name也是输入框），则同时也清空Name
                if (!isOfficial) {
                    document.getElementById(`link-name-${idx}`).value = '';
                }
            };
        });

        // 保存逻辑
        document.getElementById('subSaveBtn').onclick = () => {
            const result = [];
            for (let i = 0; i < 4; i++) {
                const name = document.getElementById(`link-name-${i}`).value.trim() || null;
                const url = document.getElementById(`link-url-${i}`).value.trim() || null;
                result.push({ name, url });
            }
            onSave(result); // 回调传出数据
            close();
        };

        document.getElementById('subCloseBtn').onclick = close;
        document.getElementById('subCloseX').onclick = close;
    }

    /**
     * 核心UI函数：注入CSS、通用按钮及容器
     * @returns {object} 包含所有已创建的DOM元素的对象
     */
    function createButtonUI() {
        // --- 注入通用CSS样式 ---
        if (!document.getElementById('f95-helper-styles')) {
            const css = `
                /* --- 按钮基础样式 --- */
                .f95-helper-button {
                    transition: transform 0.2s ease, filter 0.2s ease; /* 定义平滑过渡效果，时长为0.2秒，缓动函数为 ease */
                    font-weight: bold;
                    text-align: center; /* 文字统一居中显示 */
                }
                /* --- 按钮悬停样式 --- */
                .f95-helper-button:hover {
                    filter: brightness(85%); /* 悬停时，按钮颜色变暗15% */
                    transform: scale(1.05); /* 悬停时，按钮放大5% */
                }
                /* --- 飘窗中分隔线的样式 --- */
                .tooltip-separator {
                    border-top: 1px dashed #777;
                    margin: 8px 0;
                }
            `;
            const styleSheet = document.createElement("style");
            styleSheet.id = 'f95-helper-styles'; // 添加ID防止重复注入
            styleSheet.innerText = css;
            document.head.appendChild(styleSheet);
        }

        // --- 创建通用UI元素 ---
        // 总容器
        const buttonContainer = document.createElement('div');
        Object.assign(buttonContainer.style, {
            position: 'fixed', top: '150px', right: '20px', zIndex: '10000',
            display: 'flex', flexDirection: 'column', gap: '8px'
        });
        document.body.appendChild(buttonContainer);
        // 通用的按钮样式
        const baseButtonStyle = {
            padding: '8px 12px', color: 'white', border: 'none',
            borderRadius: '5px', cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        };
        // 悬浮预览窗口
        const tooltip = document.createElement('div');
        Object.assign(tooltip.style, {
            position: 'fixed', display: 'none', zIndex: '10001', padding: '10px',
            backgroundColor: 'rgba(40, 40, 40, 0.95)', color: 'white', border: '1px solid #555',
            borderRadius: '5px', pointerEvents: 'none', lineHeight: '1.6',
            boxShadow: '0 4px 8px rgba(0,0,0,0.4)', fontFamily: 'sans-serif',
            fontSize: '14px', whiteSpace: 'nowrap'
        });
        document.body.appendChild(tooltip);

        return { buttonContainer, baseButtonStyle, tooltip };
    }

    // 窗口UI函数：飘窗
    function buttonTooltip(tooltipElement, buttonElement, site) {
        let liveInfo = null;
        let localInfo = null;
        let matchedF95ThreadId = null;

        if (site === 'f95') {
            liveInfo = f95GameInfo();
            matchedF95ThreadId = liveInfo.f95ThreadId;
        }
        else if (site === 'vndb'){
            liveInfo = vndbGameInfo();
            matchedF95ThreadId = vndbMatchDB(liveInfo);
        }
        else if (site === 'steamdb'){
            liveInfo = steamdbGameInfo();
            matchedF95ThreadId = steamdbMatchDB(liveInfo);
        }
        if (!liveInfo) return;
        if (matchedF95ThreadId) localInfo = getLocalInfo(matchedF95ThreadId);

        const result = dataCompare(localInfo, liveInfo);
        const { local, live, compare } = result;

        // 辅助函数：创建一个带颜色的span标签
        const createColoredSpan = (text, color) => `<span style="color: ${color};">${text}</span>`;
        const NA_TEXT = 'N/A'; // 统一的 "N/A" 文本
        const COLOR_GREEN = '#73d791'; // 薄荷绿
        const COLOR_RED = '#f47272'; // 珊瑚红
        // const COLOR_GREEN = '#5eead4'; // 青
        // const COLOR_RED = '#f5d442'; // 橙黄

        // 【微调地点】飘窗显示
        // --- 名称信息 ---
        const rows = {};
        rows.line0 = `<div class="tooltip-separator"></div>`;
        // 英文名称（必须存在，没有则显示错误）
        switch (compare.gameName1) {
            case '00': rows.gameName1 = `<b>英文名称：</b>${NA_TEXT}<br>`; break;
            case '01': rows.gameName1 = `<b>英文名称：</b>${createColoredSpan(live.gameName1, COLOR_GREEN)}<br>`; break;
            case '10': rows.gameName1 = `<b>英文名称：</b>${local.gameName1}<br>`; break;
            case '11': rows.gameName1 = `<b>英文名称：</b>${local.gameName1}<br>`; break;
            case '99': rows.gameName1 = `<b>英文名称：</b>${createColoredSpan(local.gameName1, COLOR_RED)} ⇒ ${createColoredSpan(live.gameName1, COLOR_GREEN)}<br>`; break;
        }
        // 中文名称（不一定存在，没有则留空）
        switch (compare.gameName2) {
            case '00': rows.gameName2 = `<b>中文名称：</b><br>`; break;
            case '01': rows.gameName2 = `<b>中文名称：</b>${createColoredSpan(live.gameName2, COLOR_GREEN)}<br>`; break;
            case '10': rows.gameName2 = `<b>中文名称：</b>${local.gameName2}<br>`; break;
            case '11': rows.gameName2 = `<b>中文名称：</b>${local.gameName2}<br>`; break;
            case '99': rows.gameName2 = `<b>中文名称：</b>${createColoredSpan(local.gameName2, COLOR_RED)} ⇒ ${createColoredSpan(live.gameName2, COLOR_GREEN)}<br>`; break;
        }
        // 游戏别名（不一定存在，没有则略过）
        switch (compare.gameName3) {
            case '00': break;
            case '01': rows.gameName3 = `<b>游戏别名：</b>${createColoredSpan(live.gameName3, COLOR_GREEN)}<br>`; break;
            case '10': rows.gameName3 = `<b>游戏别名：</b>${local.gameName3}<br>`; break;
            case '11': rows.gameName3 = `<b>游戏别名：</b>${local.gameName3}<br>`; break;
            case '99': rows.gameName3 = `<b>游戏别名：</b>${createColoredSpan(local.gameName3, COLOR_RED)} ⇒ ${createColoredSpan(live.gameName3, COLOR_GREEN)}<br>`; break;
        }
        // 作者（必须存在，没有则显示错误）
        switch (compare.gameDev) {
            case '00': rows.gameDev = `<b>作　　者：</b>${NA_TEXT}<br>`; break;
            case '01': rows.gameDev = `<b>作　　者：</b>${createColoredSpan(live.gameDev, COLOR_GREEN)}<br>`; break;
            case '10': rows.gameDev = `<b>作　　者：</b>${local.gameDev}<br>`; break;
            case '11': rows.gameDev = `<b>作　　者：</b>${local.gameDev}<br>`; break;
            case '99': rows.gameDev = `<b>作　　者：</b>${createColoredSpan(local.gameDev, COLOR_RED)} ⇒ ${createColoredSpan(live.gameDev, COLOR_GREEN)}<br>`; break;
        }
        // 版本（必须存在，没有则显示错误）
        switch (compare.gameVersion) {
            case '00': rows.gameVersion = `<b>版　　本：</b>${NA_TEXT}<br>`; break;
            case '01': rows.gameVersion = `<b>版　　本：</b>${createColoredSpan(live.gameVersion, COLOR_GREEN)}<br>`; break;
            case '10': rows.gameVersion = `<b>版　　本：</b>${local.gameVersion}<br>`; break;
            case '11': rows.gameVersion = `<b>版　　本：</b>${local.gameVersion}<br>`; break;
            case '99': rows.gameVersion = `<b>版　　本：</b>${createColoredSpan(local.gameVersion, COLOR_RED)} ⇒ ${createColoredSpan(live.gameVersion, COLOR_GREEN)}<br>`; break;
        }
        // 开发进度（必须存在，没有则显示错误）
        switch (compare.gameDevStatus) {
            case '00': rows.gameDevStatus = `<b>开发进度：</b>${NA_TEXT}<br>`; break;
            case '01': rows.gameDevStatus = `<b>开发进度：</b>${createColoredSpan(live.gameDevStatus, COLOR_GREEN)}<br>`; break;
            case '10': rows.gameDevStatus = `<b>开发进度：</b>${local.gameDevStatus}<br>`; break;
            case '11': rows.gameDevStatus = `<b>开发进度：</b>${local.gameDevStatus}<br>`; break;
            case '99': rows.gameDevStatus = `<b>开发进度：</b>${createColoredSpan(local.gameDevStatus, COLOR_RED)} ⇒ ${createColoredSpan(live.gameDevStatus, COLOR_GREEN)}<br>`; break;
        }
        // 更新时间（必须存在，没有则显示错误）
        switch (compare.gameReleaseDate) {
            case '00': rows.gameReleaseDate = `<b>更新时间：</b>${NA_TEXT}<br>`; break;
            case '01': rows.gameReleaseDate = `<b>更新时间：</b>${createColoredSpan(live.gameReleaseDate, COLOR_GREEN)}<br>`; break;
            case '10': rows.gameReleaseDate = `<b>更新时间：</b>${local.gameReleaseDate}<br>`; break;
            case '11': rows.gameReleaseDate = `<b>更新时间：</b>${local.gameReleaseDate}<br>`; break;
            case '99': rows.gameReleaseDate = `<b>更新时间：</b>${createColoredSpan(local.gameReleaseDate, COLOR_RED)} ⇒ ${createColoredSpan(live.gameReleaseDate, COLOR_GREEN)}<br>`; break;
        }
        // 中文
        const localGroup = getSimpleChineseGroup(local.gameChineseId);
        const liveGroup = getSimpleChineseGroup(live.gameChineseId);
        switch (compare.gameChineseId) {
            case '00': rows.gameChineseId = `<b>中　　文：</b><br>`; break;
            case '01': rows.gameChineseId = `<b>中　　文：</b>${createColoredSpan(liveGroup, COLOR_GREEN)}<br>`; break;
            case '10': rows.gameChineseId = `<b>中　　文：</b>${localGroup}<br>`; break;
            case '11': rows.gameChineseId = `<b>中　　文：</b>${localGroup}<br>`; break;
            case '99':
                if (localGroup === '✔') {
                    // 原来有中文，现在有/没有中文。无需关注。
                    rows.gameChineseId = `<b>中　　文：</b>${localGroup}<br>`;
                } else if (localGroup === '✘' && liveGroup !== '✔') {
                    // 原来没有中文，现在也没有中文。（gameChineseId不同，而对应的简单分组相同，这是有可能的）
                    rows.gameChineseId = `<b>中　　文：</b>${localGroup}<br>`;
                } else if (localGroup === '✘' && liveGroup === '✔') {
                    // 原来没有中文，现在有中文。
                    rows.gameChineseId = `<b>中　　文：</b>${createColoredSpan(localGroup, COLOR_RED)} ⇒ ${createColoredSpan(liveGroup, COLOR_GREEN)}<br>`;
                } else {
                    // 正常来说不可能出现。
                    rows.gameChineseId = `<b>中　　文：</b>${createColoredSpan('数据错误！', COLOR_RED)}<br>`;
                    console.warn(`local.gameChineseId:${local.gameChineseId}\nlive.gameChineseId:${live.gameChineseId}\nlocalGroup:${localGroup}\nliveGroup:${liveGroup}`);
                }
                break;
        }
        // 游戏类型（不一定存在，没有则留空）
        switch (compare.gameType) {
            case '00': rows.gameType = `<b>游戏类型：</b><br>`; break;
            case '01': rows.gameType = `<b>游戏类型：</b>${createColoredSpan(live.gameType, COLOR_GREEN)}<br>`; break;
            case '10': rows.gameType = `<b>游戏类型：</b>${local.gameType}<br>`; break;
            case '11': rows.gameType = `<b>游戏类型：</b>${local.gameType}<br>`; break;
            case '99': rows.gameType = `<b>游戏类型：</b>${createColoredSpan(local.gameType, COLOR_RED)} ⇒ ${createColoredSpan(live.gameType, COLOR_GREEN)}<br>`; break;
        }
        // 游戏引擎（不一定存在，没有则留空）
        switch (compare.gameEngine) {
            case '00': rows.gameEngine = `<b>游戏引擎：</b><br>`; break;
            case '01': rows.gameEngine = `<b>游戏引擎：</b>${createColoredSpan(live.gameEngine, COLOR_GREEN)}<br>`; break;
            case '10': rows.gameEngine = `<b>游戏引擎：</b>${local.gameEngine}<br>`; break;
            case '11': rows.gameEngine = `<b>游戏引擎：</b>${local.gameEngine}<br>`; break;
            case '99': rows.gameEngine = `<b>游戏引擎：</b>${createColoredSpan(local.gameEngine, COLOR_RED)} ⇒ ${createColoredSpan(live.gameEngine, COLOR_GREEN)}<br>`; break;
        }
        // f95 ID、评分数量、平均评分
        rows.f95ThreadId = `<b>F95 ID：</b>${live.f95ThreadId || local.f95ThreadId}<br>`; // f95ThreadId 理论上不会变
        switch (compare.f95VoteCount) {
            case '00': rows.f95VoteCount = `<b>评分数量：</b>${NA_TEXT}<br>`; break;
            case '01': rows.f95VoteCount = `<b>评分数量：</b>${createColoredSpan(live.f95VoteCount+' 人', COLOR_GREEN)}<br>`; break;
            case '10': rows.f95VoteCount = `<b>评分数量：</b>${local.f95VoteCount} 人<br>`; break;
            case '11': rows.f95VoteCount = `<b>评分数量：</b>${local.f95VoteCount} 人<br>`; break;
            case '99': rows.f95VoteCount = `<b>评分数量：</b>${createColoredSpan(local.f95VoteCount+' 人', COLOR_RED)} ⇒ ${createColoredSpan(live.f95VoteCount+' 人', COLOR_GREEN)}<br>`; break;
        }
        switch (compare.f95AvgScore) {
            case '00': rows.f95AvgScore = `<b>评　　分：</b>${NA_TEXT}<br>`; break;
            case '01': rows.f95AvgScore = `<b>评　　分：</b>${createColoredSpan(live.f95AvgScore+' 分', COLOR_GREEN)}<br>`; break;
            case '10': rows.f95AvgScore = `<b>评　　分：</b>${local.f95AvgScore} 分<br>`; break;
            case '11': rows.f95AvgScore = `<b>评　　分：</b>${local.f95AvgScore} 分<br>`; break;
            case '99': rows.f95AvgScore = `<b>评　　分：</b>${createColoredSpan(local.f95AvgScore+' 分', COLOR_RED)} ⇒ ${createColoredSpan(live.f95AvgScore+' 分', COLOR_GREEN)}<br>`; break;
        }
        // VNDB 分隔线、ID、评分数量、平均评分
        if (compare.vndbId !== '00') { // 只有存在 ndbId 时才显示整个区块
            rows.line1 = `<div class="tooltip-separator"></div>`;
            switch (compare.vndbId) {
                case '01': rows.vndbId = `<b>VNDB ID：</b>${createColoredSpan(live.vndbId, COLOR_GREEN)}<br>`; break;
                case '10': rows.vndbId = `<b>VNDB ID：</b>${local.vndbId}<br>`; break;
                case '11': rows.vndbId = `<b>VNDB ID：</b>${local.vndbId}<br>`; break;
                case '99': rows.vndbId = `<b>VNDB ID：</b>${createColoredSpan(local.vndbId, COLOR_RED)} ⇒ ${createColoredSpan(live.vndbId, COLOR_GREEN)}<br>`; break;
            }
            switch (compare.vndbVoteCount) {
                case '00': rows.vndbVoteCount = `<b>评分数量：</b>${NA_TEXT}<br>`; break;
                case '01': rows.vndbVoteCount = `<b>评分数量：</b>${createColoredSpan(live.vndbVoteCount+' 人', COLOR_GREEN)}<br>`; break;
                case '10': rows.vndbVoteCount = `<b>评分数量：</b>${local.vndbVoteCount} 人<br>`; break;
                case '11': rows.vndbVoteCount = `<b>评分数量：</b>${local.vndbVoteCount} 人<br>`; break;
                case '99': rows.vndbVoteCount = `<b>评分数量：</b>${createColoredSpan(local.vndbVoteCount+' 人', COLOR_RED)} ⇒ ${createColoredSpan(live.vndbVoteCount+' 人', COLOR_GREEN)}<br>`; break;
            }
            switch (compare.vndbAvgScore) {
                case '00': rows.vndbAvgScore = `<b>评　　分：</b>${NA_TEXT}<br>`; break;
                case '01': rows.vndbAvgScore = `<b>评　　分：</b>${createColoredSpan(live.vndbAvgScore+' 分', COLOR_GREEN)}<br>`; break;
                case '10': rows.vndbAvgScore = `<b>评　　分：</b>${local.vndbAvgScore} 分<br>`; break;
                case '11': rows.vndbAvgScore = `<b>评　　分：</b>${local.vndbAvgScore} 分<br>`; break;
                case '99': rows.vndbAvgScore = `<b>评　　分：</b>${createColoredSpan(local.vndbAvgScore+' 分', COLOR_RED)} ⇒ ${createColoredSpan(live.vndbAvgScore+' 分', COLOR_GREEN)}<br>`; break;
            }
        }
        // Steam 分隔线、ID、SteamDB 评分数量、SteamDB 平均评分
        if (compare.steamId !== '00') { // 只有存在 ndbId 时才显示整个区块
            rows.line2 = `<div class="tooltip-separator"></div>`;
            switch (compare.steamId) {
                case '01': rows.steamId = `<b>Steam ID：</b>${createColoredSpan(live.steamId, COLOR_GREEN)}<br>`; break;
                case '10': rows.steamId = `<b>Steam ID：</b>${local.steamId}<br>`; break;
                case '11': rows.steamId = `<b>Steam ID：</b>${local.steamId}<br>`; break;
                case '99': rows.steamId = `<b>Steam ID：</b>${createColoredSpan(local.steamId, COLOR_RED)} ⇒ ${createColoredSpan(live.steamId, COLOR_GREEN)}<br>`; break;
            }
            switch (compare.steamVoteCount) {
                case '00': rows.steamVoteCount = `<b>评分数量：</b>${NA_TEXT}<br>`; break;
                case '01': rows.steamVoteCount = `<b>评分数量：</b>${createColoredSpan(live.steamVoteCount+' 人', COLOR_GREEN)}<br>`; break;
                case '10': rows.steamVoteCount = `<b>评分数量：</b>${local.steamVoteCount} 人<br>`; break;
                case '11': rows.steamVoteCount = `<b>评分数量：</b>${local.steamVoteCount} 人<br>`; break;
                case '99': rows.steamVoteCount = `<b>评分数量：</b>${createColoredSpan(local.steamVoteCount+' 人', COLOR_RED)} ⇒ ${createColoredSpan(live.steamVoteCount+' 人', COLOR_GREEN)}<br>`; break;
            }
            switch (compare.steamAvgScore) {
                case '00': rows.steamAvgScore = `<b>评　　分：</b>${NA_TEXT}<br>`; break;
                case '01': rows.steamAvgScore = `<b>评　　分：</b>${createColoredSpan(live.steamAvgScore+' 分', COLOR_GREEN)}<br>`; break;
                case '10': rows.steamAvgScore = `<b>评　　分：</b>${local.steamAvgScore} 分<br>`; break;
                case '11': rows.steamAvgScore = `<b>评　　分：</b>${local.steamAvgScore} 分<br>`; break;
                case '99': rows.steamAvgScore = `<b>评　　分：</b>${createColoredSpan(local.steamAvgScore+' 分', COLOR_RED)} ⇒ ${createColoredSpan(live.steamAvgScore+' 分', COLOR_GREEN)}<br>`; break;
            }
        }
        // // DLsite RJ
        // if (compare.dlsiteUrl !== '00') {
        //     rows.line3 = `<div class="tooltip-separator"></div>`;
        //     const dlsiteId1 = extractDlsiteId(local.dlsiteUrl);
        //     const dlsiteId2 = extractDlsiteId(live.dlsiteUrl);
        //     switch (compare.dlsiteUrl) {
        //         case '01': rows.dlsiteUrl = `<b>dlsite RJ：</b>${createColoredSpan(dlsiteId2, COLOR_GREEN)}<br>`; break;
        //         case '10': rows.dlsiteUrl = `<b>dlsite RJ：</b>${dlsiteId1}<br>`; break;
        //         case '11': rows.dlsiteUrl = `<b>dlsite RJ：</b>${dlsiteId1}<br>`; break;
        //         case '99': rows.dlsiteUrl = `<b>dlsite RJ：</b>${createColoredSpan(dlsiteId1, COLOR_RED)} ⇒ ${createColoredSpan(dlsiteId2, COLOR_GREEN)}<br>`; break;
        //     }
        // }

        tooltipElement.innerHTML = [
            rows.gameName1,
            rows.gameName2,
            rows.gameName3,
            rows.gameDev,
            rows.line0,
            rows.gameVersion,
            rows.gameDevStatus,
            rows.gameReleaseDate,
            rows.gameChineseId,
            rows.gameType,
            rows.gameEngine,
            rows.line0,
            rows.f95ThreadId,
            rows.f95VoteCount,
            rows.f95AvgScore,
            rows.line1,
            rows.vndbId,
            rows.vndbVoteCount,
            rows.vndbAvgScore,
            rows.line2,
            rows.steamId,
            rows.steamVoteCount,
            rows.steamAvgScore,
        ].filter(Boolean).join(''); // filter(Boolean) 会自动过滤掉所有 undefined 或空字符串的行

        const btnRect = buttonElement.getBoundingClientRect();
        tooltipElement.style.display = 'block';
        const tooltipRect = tooltipElement.getBoundingClientRect();
        tooltipElement.style.top = `${btnRect.top}px`;
        tooltipElement.style.left = `${btnRect.left - tooltipRect.width - 10}px`;
    }

    /**
     * 提取本地存储的游戏信息
     * @param {string} threadId - 游戏的 F95 Thread ID
     * @returns {object|null} 如果找到则返回游戏信息对象，否则返回 null
     */
    function getLocalInfo(threadId) {
        if (!threadId) { return null; }
        const DB_KEY = 'f95GameDatabase';
        try {
            const database = JSON.parse(GM_getValue(DB_KEY, '{}'));
            return database[threadId] || null; // 如果数据库中没有该ID的条目，返回null
        } catch (error) {
            console.error('[F95助手] 从本地存储读取游戏信息时出错:', error);
            return null;
        }
    }

    /**
     * 比较函数。对比本地存储信息和实时页面信息。
     * @param {object|null} localInfo - 从 getLocalInfo() 返回的本地数据，或 null
     * @param {object|null} liveInfo - 从 f95GameInfo() 或 vndbGameInfo() 返回的实时数据
    * @returns {{local: object, live: object, compare: object}|null} 包含三个标准化对象的返回结果，或在 liveInfo 无效时返回 null
    */
    function dataCompare(localInfo, liveInfo) {
        if (!liveInfo) {
            console.warn('[F95助手] dataCompare 函数接收到无效的 liveInfo，已中止比较。');
            return null;
        }

        // 改用通用模板
        const dataTemplate = getDataTemplate();

        // 准备数据
        const local = { ...dataTemplate, ...(localInfo || {}) };
        const live = { ...dataTemplate, ...liveInfo };
        const compare = {};

        // 遍历模板的所有字段，进行比较
        for (const key in dataTemplate) {
            if (key === 'lockedFields') continue; // 跳过 lockedFields 字段

            let localValue = local[key];
            let liveValue = live[key];

            // 通用比较逻辑
            if (localValue === null && liveValue === null) {
                compare[key] = '00'; // 都不存在
            } else if (localValue === null && liveValue !== null) {
                compare[key] = '01'; // 新增
            } else if (localValue !== null && liveValue === null) {
                compare[key] = '10'; // 丢失 (或者该字段仅本地存在，如 userScore)
            } else if (localValue !== null && liveValue !== null) {
                if (JSON.stringify(localValue) === JSON.stringify(liveValue)) { // 字段为数组时，比较前需要转化
                    compare[key] = '11'; // 存在且相同
                } else {
                    compare[key] = '99'; // 存在但不同 (发生变化)
                }
            }
        }

        return { local, live, compare };
    }

    /**
     * 数据更新函数。根据来源站点，智能合并信息到本地数据库。
     * @param {object} liveInfo - 从页面实时抓取的信息对象
     * @param {string} site - 来源站点的标识 ('f95', 'vndb', 'steamdb')
     * @param {string} [matchedThreadId=null] - 对于vndb/steamdb，传入已匹配的f95ThreadId
     */
    function updateLocalDatabase(liveInfo, site, matchedThreadId = null) {
        // 内部辅助函数：根据规则应用更新（更新规则 rules 选项为 live / local / force-live / force-local ）
        function applyUpdateRules(localInfo, liveInfo, rules = 'live') {
            const { compare } = dataCompare(localInfo, liveInfo);
            if (!compare) return localInfo || {};

            // 复制所有本地原有数据
            const updatedInfo = { ...(localInfo || {}) };

            // 获取锁定列表
            const lockedFields = (localInfo && Array.isArray(localInfo.lockedFields)) ? localInfo.lockedFields : [];

            // 遍历规则进行更新
            for (const key in rules) {
                const rule = rules[key];
                if (!rule || !compare.hasOwnProperty(key)) continue;

                if (lockedFields.includes(key)) { continue; } // 跳过锁定字段

                const localValue = localInfo ? localInfo[key] : null;
                const liveValue = liveInfo[key];
                let newValue = updatedInfo[key]; // 默认保持不变

                switch (rule) {
                    // ▲待修改。我发现 force- 的情况基本用不到。
                    case 'live':       // 优先使用实时数据，但前提是它不为 null
                        newValue = liveValue !== null ? liveValue : localValue;
                        break;
                    case 'local':      // 优先使用本地数据，但前提是它不为 null
                        newValue = localValue !== null ? localValue : liveValue;
                        break;
                    case 'force-live': // 强制使用实时数据，即使它是 null
                        newValue = liveValue;
                        break;
                    case 'force-local':// 强制保留本地数据，即使它是 null
                        newValue = localValue;
                        break;
                }
                updatedInfo[key] = newValue;
            }
            return updatedInfo;
        }

        // 主逻辑
        const DB_KEY = 'f95GameDatabase';
        const threadId = site === 'f95' ? liveInfo.f95ThreadId : matchedThreadId;

        if (!liveInfo || !threadId) {
            console.warn('[F95助手] 因缺少有效信息或ThreadId，已跳过数据库更新。');
            return;
        }

        try {
            const database = JSON.parse(GM_getValue(DB_KEY, '{}'));
            const localInfo = database[threadId] || null;

            let rules = {};
            let siteName = '';

            // 【微调地点】数据更新规则
            // 并不是所有字段都需要规则，只需要在GameInfo函数中更新的字段有规则就可以了。
            switch (site) {
                case 'f95':
                    siteName = 'F95页面';
                    rules = {
                        f95VoteCount: 'live',       // 必须更新
                        f95AvgScore: 'live',        // 必须更新
                        steamId: 'local',           // 不会变
                        vndbId: 'local',            // 不会变
                        gameName1: 'local',         // 避免修改用户改好的游戏名
                        gameDev: 'local',           // 作者名不要动
                        gameVersion: 'live',
                        gameDevStatus: 'live',
                        gameReleaseDate: 'live',
                        gameType: 'local',
                        gameEngine: 'local',
                        gameCGType: 'local',
                        gameCGEngine: 'live',       // 有AI CG标签时会跟进
                        gameCGMosaic: 'local',
                        gameChineseId: 'local',     // 可靠性低
                        gameAudioId: 'local',       // 可靠性低
                        gameThemeNtrId: 'local',    // 可靠性低
                        gameThemeNtrNote: 'local',  // 可靠性低
                    };
                    break;
                case 'vndb':
                    siteName = 'VNDB页面';
                    rules = {
                        vndbId: 'live',             // 必须更新
                        vndbVoteCount: 'live',      // 必须更新
                        vndbAvgScore: 'live',       // 必须更新
                        gameName1: 'local',         // 可靠性低
                        gameName2: 'local',         // 可靠性低
                        gameName3: 'local',         // 可靠性低
                        gameDev: 'local',           // 可靠性低
                        gameChineseId: 'local',     // 可靠性低
                    };
                    break;
                case 'steamdb':
                    siteName = 'SteamDB页面';
                    rules = {
                        steamId: 'live',            // 必须更新
                        steamVoteCount: 'live',     // 必须更新
                        steamAvgScore: 'live',      // 必须更新
                        gameName1: 'live',          // 可靠性高
                        gameName2: 'live',          // 可靠性高
                        gameDev: 'live',            // 可靠性高
                        gameEngine: 'live',         // 可靠性高
                        gameChineseId: 'live',      // 可靠性高
                        gameAudioId: 'live',        // 可靠性高
                    };
                    break;
                default:
                    console.warn(`[F95助手] 未知的站点类型: ${site}`);
                    return;
            }

            // 一般字段按照“数据更新规则”更新
            const updatedInfo = applyUpdateRules(localInfo, liveInfo, rules);
            // gameOfficialLinks字段。只填补空缺，不覆盖已有值
            if (liveInfo.gameOfficialLinks && Array.isArray(liveInfo.gameOfficialLinks)) {
                // 确保本地存在该字段（如果是旧数据可能没有，需要初始化）
                const baseLinks = updatedInfo.gameOfficialLinks || getDataTemplate().gameOfficialLinks;

                updatedInfo.gameOfficialLinks = baseLinks.map((localItem, index) => {
                    const liveItem = liveInfo.gameOfficialLinks[index];
                    // 如果本地URL为空，且实时抓取到了URL，则更新
                    if (!localItem.url && liveItem && liveItem.url) {
                        return { ...localItem, url: liveItem.url };
                    }
                    return localItem; // 否则保持本地原样
                });
            }
            // gameDownloadLinks字段。初始化为空数组，防止UI报错
            if (!updatedInfo.gameDownloadLinks) {
                updatedInfo.gameDownloadLinks = getDataTemplate().gameDownloadLinks;
            }
            // userPlayStatus字段。默认为“关注中”
            if (updatedInfo.userPlayStatus === null || updatedInfo.userPlayStatus === undefined) {
                updatedInfo.userPlayStatus = 0;
            }

            updatedInfo.f95ThreadId = threadId; // 确保主键ID始终存在
            updatedInfo.lastModified = Date.now(); // 更新最后修改时间

            database[threadId] = updatedInfo;
            GM_setValue(DB_KEY, JSON.stringify(database));

            // 广播数据更新事件
            window.dispatchEvent(new CustomEvent('f95_db_updated'));

            const action = localInfo ? '更新' : '新增';
            console.log(`[F95助手] 已使用 ${siteName} ${action}游戏信息: ${updatedInfo.gameName1 || liveInfo.gameName1} (ID: ${threadId})`);

        } catch (error) {
            console.error(`[F95助手] 使用 ${site} 信息更新数据库时出错:`, error);
        }
    }

    // -------------------- F95 --------------------
    // F95按钮（保存信息、编辑数据、SteamDB 跳转/搜索、VNDB 跳转/搜索）
    function f95Buttons() {
        const { buttonContainer, baseButtonStyle, tooltip } = createButtonUI(); // 调用核心UI函数创建通用界面

        // “我的游戏库”按钮
        const libButton = document.createElement('button');
        libButton.textContent = '我的游戏库';
        libButton.classList.add('f95-helper-button');
        Object.assign(libButton.style, baseButtonStyle, { backgroundColor: '#6f42c1' }); // 紫色
        buttonContainer.appendChild(libButton);
        // 点击事件
        libButton.addEventListener('click', () => {
            GM_openInTab('https://f95zone.to/game', { active: true });
        });

        // “保存信息”按钮
        const copyButton = document.createElement('button');
        copyButton.textContent = '保存信息';
        copyButton.classList.add('f95-helper-button');
        Object.assign(copyButton.style, baseButtonStyle, { backgroundColor: '#007bff' });
        buttonContainer.appendChild(copyButton);
        // 悬停事件
        copyButton.addEventListener('mouseover', () => buttonTooltip(tooltip, copyButton, 'f95'));
        copyButton.addEventListener('mouseout', () => { tooltip.style.display = 'none'; });
        // 点击事件
        copyButton.addEventListener('click', () => copyButtonClick(copyButton));

        // “编辑本地数据”按钮
        const editButton = document.createElement('button');
        editButton.textContent = '编辑数据';
        editButton.classList.add('f95-helper-button');
        Object.assign(editButton.style, baseButtonStyle, { backgroundColor: '#6c757d' }); // 灰色
        buttonContainer.appendChild(editButton);
        // 点击事件
        editButton.addEventListener('click', () => {
            const info = f95GameInfo();
            if (info && info.f95ThreadId) {
                openEditWindow(info.f95ThreadId);
            } else {
                alert('无法获取当前页面的 F95 ID！');
            }
        });

        // “跳转 SteamDB”按钮
        const steamdbButton = document.createElement('button');
        steamdbButton.textContent = '跳转 SteamDB';
        steamdbButton.classList.add('f95-helper-button');
        Object.assign(steamdbButton.style, baseButtonStyle, { backgroundColor: '#223D58' });
        buttonContainer.appendChild(steamdbButton);
        // 点击事件（跳转/搜索）
        steamdbButton.addEventListener('click', () => {
            const info = f95GameInfo();
            if (!info) {
                alert('无法解析页面信息！');
                return;
            }
            const localInfo = getLocalInfo(info.f95ThreadId);
            if (localInfo && localInfo.steamId) { // 如果本地有ID，直接跳转
                // const steamUrl = `https://store.steampowered.com/app/${localInfo.steamId}/_/?l=schinese`;
                const steamUrl = `https://steamdb.info/app/${localInfo.steamId}/info/`;
                window.open(steamUrl, '_blank');
            } else { // 如果本地没有ID，执行搜索
                // steamdbButton.textContent = '搜索 Steam';
                // steamdbButton.style.backgroundColor = '#9e6d81';
                // ▲待修改。点击后再变文字太慢了，后面有时间再改成 mouseover 触发
                if (!info.gameName1) {
                    alert('无法获取有效的游戏名进行搜索！');
                    return;
                }
                const searchTerm = encodeURIComponent(info.gameName1);
                // const steamUrl = `https://store.steampowered.com/search/?term=${searchTerm}&supportedlang=schinese%2Cenglish&category1=998%2C21&ndl=1`;
                const steamUrl = `https://steamdb.info/search/?a=all&q=${searchTerm}`;
                window.open(steamUrl, '_blank');
            }
        });

        // “跳转 VNDB”按钮
        const vndbButton = document.createElement('button');
        vndbButton.textContent = '跳转 VNDB';
        vndbButton.classList.add('f95-helper-button');
        Object.assign(vndbButton.style, baseButtonStyle, { backgroundColor: '#223D58' });
        buttonContainer.appendChild(vndbButton);
        // 点击事件（跳转/搜索）
        vndbButton.addEventListener('click', () => {
            const info = f95GameInfo();
            if (!info) {
                alert('无法解析页面信息！');
                return;
            }
            const localInfo = getLocalInfo(info.f95ThreadId);
            if (localInfo && localInfo.vndbId) { // 如果本地有ID，直接跳转
                const vndbUrl = `https://vndb.org/v${localInfo.vndbId}`;
                window.open(vndbUrl, '_blank');
            } else { // 如果本地没有ID，执行搜索
                // vndbButton.textContent = '搜索 VNDB';
                // vndbButton.style.backgroundColor = '#9e6d81';
                // ▲待修改。点击后再变文字太慢了，后面有时间再改成 mouseover 触发
                if (!info.gameName1) {
                    alert('无法获取有效的游戏名进行搜索！');
                    return;
                }
                const searchTerm = encodeURIComponent(info.gameName1);
                const vndbUrl = `https://vndb.org/v?sq=${searchTerm}`;
                window.open(vndbUrl, '_blank');
            }
        });

        // 内部辅助函数：“保存信息”按钮的点击事件逻辑
        function copyButtonClick(btnElement) {
            // 1. 获取实时信息
            const liveInfo = f95GameInfo();
            if (!liveInfo) { alert('错误：无法找到或解析标题！'); return; }

            // 2. 更新/保存到本地数据库
            updateLocalDatabase(liveInfo, 'f95');

            // 3. 从数据库读取最新信息
            const DB_KEY = 'f95GameDatabase';
            const database = JSON.parse(GM_getValue(DB_KEY, '{}'));
            const localInfo = database[liveInfo.f95ThreadId];
            if (!localInfo) {
                alert('错误：数据保存后读取失败！');
                return;
            }

            // 4. 判断是否需要复制到剪贴板
            const enableCopy = GM_getValue('copyButtonOutputStyle', false);
            // --- 仅保存模式 ---
            if (!enableCopy) {
                showFeedback(btnElement, '已保存!', '#28a745'); // 绿色反馈
                return;
            }
            // --- 保存并复制模式 ("讲介士"样式) ---
            const NA_TEXT = 'N/A';
            const outputLines = [];
            outputLines.push(`英文名称：${localInfo.gameName1 || NA_TEXT}`);
            if (localInfo.gameName2) outputLines.push(`中文名称：${localInfo.gameName2}`);
            if (localInfo.gameName3) outputLines.push(`游戏别名：${localInfo.gameName3}`);
            outputLines.push(`作　　者：${localInfo.gameDev || NA_TEXT}`);
            outputLines.push('--------------------');
            outputLines.push(`版　　本：${localInfo.gameVersion || NA_TEXT}`);
            outputLines.push(`开发进度：${localInfo.gameDevStatus || NA_TEXT}`);
            outputLines.push(`更新时间：${localInfo.gameReleaseDate || NA_TEXT}`);
            // 中文信息
            const chineseText = getChineseText(localInfo.gameChineseId);
            const chineseNote = localInfo.gameChineseNote ? `（${localInfo.gameChineseNote}）` : '';
            outputLines.push(`中文汉化：${chineseText}${chineseNote}`);
            if (localInfo.gameType) outputLines.push(`游戏类型：${localInfo.gameType}`);
            if (localInfo.gameEngine) outputLines.push(`游戏引擎：${localInfo.gameEngine}`);
            if (localInfo.gameCGEngine) outputLines.push(`ＣＧ引擎：${localInfo.gameCGEngine}`);
            // F95 信息
            if (localInfo.f95ThreadId) {
                outputLines.push('--------------------');
                const f95Url = `https://f95zone.to/threads/${localInfo.f95ThreadId}/`;
                outputLines.push(`F95 链接：${f95Url}`);
                const scoreInfo = (localInfo.f95VoteCount >= 10 && localInfo.f95AvgScore) ? `${localInfo.f95AvgScore} / 10` : NA_TEXT;
                outputLines.push(`F95 评分：${scoreInfo} (${localInfo.f95VoteCount || 0}人)`);
            }
            // Steam 信息
            if (localInfo.steamId) {
                outputLines.push('--------------------');
                const steamUrl = `https://store.steampowered.com/app/${localInfo.steamId}/`;
                outputLines.push(`Steam 链接：${steamUrl}`);
                const scoreInfo = (localInfo.steamVoteCount >= 10 && localInfo.steamAvgScore) ? `${localInfo.steamAvgScore} / 10` : NA_TEXT;
                outputLines.push(`SteamDB 评分：${scoreInfo} (${localInfo.steamVoteCount || 0}人)`);
            }
            // VNDB 信息
            if (localInfo.vndbId) {
                outputLines.push('--------------------');
                const vndbUrl = `https://vndb.org/v${localInfo.vndbId}`;
                outputLines.push(`VNDB 链接：${vndbUrl}`);
                const scoreInfo = (localInfo.vndbVoteCount >= 10 && localInfo.vndbAvgScore) ? `${localInfo.vndbAvgScore} / 10` : NA_TEXT;
                outputLines.push(`VNDB 评分：${scoreInfo} (${localInfo.vndbVoteCount || 0}人)`);
            }
            // 官方链接遍历输出
            if (localInfo.gameOfficialLinks && localInfo.gameOfficialLinks.length > 0) {
                let hasOfficial = false;
                localInfo.gameOfficialLinks.forEach(link => {
                    if (link.url) {
                        if (!hasOfficial) { outputLines.push('--------------------'); hasOfficial = true; }
                        outputLines.push(`官方链接：[${link.name}] ${link.url}`);
                    }
                });
            }
            // 下载链接遍历输出
            if (localInfo.gameDownloadLinks && localInfo.gameDownloadLinks.length > 0) {
                let hasDownload = false;
                localInfo.gameDownloadLinks.forEach(link => {
                    if (link.url) {
                        if (!hasDownload) { outputLines.push('--------------------'); hasDownload = true; }
                        const displayName = link.name ? link.name : '下载地址';
                        outputLines.push(`${displayName}：${link.url}`);
                    }
                });
            }

            const outputString = outputLines.join('\n');

            navigator.clipboard.writeText(outputString).then(() => {
                showFeedback(btnElement, '已复制!', '#17a2b8'); // 青色反馈，区别于仅保存
            }).catch(err => {
                console.error('复制失败: ', err);
                alert('保存成功，但复制到剪贴板失败！');
            });

            // 辅助函数：按钮反馈动画
            function showFeedback(btn, text, color) {
                const originalText = btn.textContent;
                const originalColor = btn.style.backgroundColor;
                btn.textContent = text;
                btn.style.backgroundColor = color;
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = originalColor;
                }, 1500);
            }
        }
    }
    /**
     * 提取F95页面的游戏信息
     * @returns {object|null} 包含所有游戏信息的对象，或在找不到关键元素时返回 null
     */
    function f95GameInfo() {
        // 所有输出变量
        let f95ThreadId = null;         // F95的帖ID
        let gameName1 = null;           // 游戏名1
        let gameVersion = null;         // 游戏版本
        let gameDevStatus = '更新中';   // 开发进度
        let gameReleaseDate = null;     // 更新日期
        let gameDev = null;             // 游戏作者
        let gameEngine = null;          // 游戏引擎
        let gameType = null;            // 游戏大类
        let gameCGEngine = null;        // CG引擎
        let gameCGMosaic = null;        // 马赛克
        let f95VoteCount = null;        // 评分数量
        let f95AvgScore = null;         // 平均得分 (10分制)
        let steamId = null;             // Steam ID
        let gameChineseId = null;       // 中文
        let gameAudioId = null;         // 音声
        let gameThemeNtrId = null;      // 游戏题材-NTR

        let extractedDlsiteUrl = null; // 临时变量，用于存储提取到的 dlsite 地址

        // 引擎标签的映射（Collection，WebGL，SiteRip这3个标签不会被录入）
        const ENGINE_MAP = new Map([
            ['Ren\'Py', 'Ren\'Py'],
            ['Unity', 'Unity'],
            ['HTML', 'HTML'],
            ['RPGM', 'RPGMaker'],
            ['QSP', 'QSP'],
            ['Unreal Engine', 'Unreal'],
            ['ADRIFT', 'ADRIFT'],
            ['Wolf RPG', 'WolfRPG'],
            ['Flash', 'Flash'],
            ['Java', 'Java'],
            ['RAGS', 'RAGS'],
            ['Tads', 'Tads'],
            ['Others', '未知']
        ]);
        const TYPE_SET = new Map([
            ['VN', 'VN']
        ]);
        const STATUS_SET = new Map([
            ['Completed', '完成'],
            ['Onhold', '弃坑'],
            ['Abandoned', '弃坑']
        ]);

        // F95的帖ID
        const urlMatch = window.location.href.match(/\.(\d+)\/?$/);
        if (urlMatch) { f95ThreadId = urlMatch[1]; }

        const titleElement = document.querySelector('h1.p-title-value'); // 从标题提取信息
        if (!titleElement) return null;

        // 游戏引擎，游戏大类，开发进度
        titleElement.querySelectorAll('.labelLink span').forEach(span => { // 遍历标题的所有标签并进行分类
            const labelText = span.textContent.trim();
            if (ENGINE_MAP.has(labelText)) { gameEngine = ENGINE_MAP.get(labelText); }
            else if (TYPE_SET.has(labelText)) { gameType = TYPE_SET.get(labelText); }
            else if (STATUS_SET.has(labelText)) { gameDevStatus = STATUS_SET.get(labelText); }
        });

        // 游戏作者，游戏版本，游戏名1
        let coreTitleParts = [];
        titleElement.childNodes.forEach(node => { // 遍历h1元素的所有子节点
            if (node.nodeType === 3 && node.textContent.trim() !== '') { // nodeType为3代表文本节点
                coreTitleParts.push(node.textContent.trim());
            }
        }); // 提取非标签的文本内容
        let remainingText = coreTitleParts.join(' '); // 包含作者和版本的字符串，格式应该为"游戏名 [版本] [作者]"
        const devMatch = remainingText.match(/\[([^\]]+)\]$/);
        if (devMatch) {
            gameDev = devMatch[1].trim();
            remainingText = remainingText.substring(0, devMatch.index).trim();
        }
        const versionMatch = remainingText.match(/\[([^\]]+)\]$/);
        if (versionMatch) {
            gameVersion = versionMatch[1].trim();
            remainingText = remainingText.substring(0, versionMatch.index).trim();
        }
        gameName1 = remainingText;

        // 更新日期，是否有中文，Steam ID，dlsite链接
        const postBody = document.querySelector('.bbWrapper'); // 从正文提取信息
        if (postBody) {
            // 更新日期
            const bodyText = postBody.innerText;
            const releaseMatch = bodyText.match(/^Release Date:\s*(.*)/m);
            if (releaseMatch) {
                gameReleaseDate = releaseMatch[1].trim();
            }
            // ▲待验证。如果f95出现不符合YYYY-MM-DD格式的数据，在排序页面会有隐患。需要再观察一下，看f95上的日期是否有不规范的情况。必要时处理增加标准化语句。

            // 是否有中文
            const langMatch = bodyText.match(/^Language:\s*(.*)/m);
            if (langMatch && langMatch[1].toLowerCase().includes('chinese')) {
                gameChineseId = 20;
            } else {
                gameChineseId = 0;
            }

            // Steam ID（优先提取 widget，其次提取 Store 标签后的链接，最后全局兜底）
            const widgetElement = postBody.querySelector('iframe[data-s9e-mediaembed="steamstore"]'); // Widget 提取
            if (widgetElement) {
                const widgetSrc = widgetElement.getAttribute('data-s9e-mediaembed-src');
                if (widgetSrc) {
                    const widgetMatch = widgetSrc.match(/\/widget\/(\d+)/);
                    if (widgetMatch && widgetMatch[1]) {
                        steamId = widgetMatch[1];
                    }
                }
            }
            if (!steamId) { // "Store" 标签提取
                // 遍历所有的 <b> 标签，寻找内容为 "Store" 的标签
                const boldElements = postBody.querySelectorAll('b');
                for (const bold of boldElements) {
                    if (bold.textContent.trim().toLowerCase().includes('store')) {
                        // 获取 "Store" 标签后的下一个元素节点
                        const nextLink = bold.nextElementSibling;
                        // 检查下一个元素是否为 <a> 标签且包含 steam 链接
                        if (nextLink && nextLink.tagName === 'A' && nextLink.href.includes('store.steampowered.com/app/')) {
                            const steamIdMatch = nextLink.href.match(/\/app\/(\d+)/);
                            if (steamIdMatch && steamIdMatch[1]) {
                                steamId = steamIdMatch[1];
                                break; // 找到后立即停止，避免被其他链接干扰
                            }
                        }
                    }
                }
            }
            if (!steamId) { // 全局兜底提取
                const steamLinkElement = postBody.querySelector('a[href*="store.steampowered.com/app/"]');
                if (steamLinkElement) {
                    const steamUrl = steamLinkElement.href;
                    const steamIdMatch = steamUrl.match(/\/app\/(\d+)/);
                    if (steamIdMatch && steamIdMatch[1]) {
                        steamId = steamIdMatch[1];
                    }
                }
            }

            // dlsite链接
            const dlsiteLinkElement = postBody.querySelector('a[href*="/work/=/product_id/"]');
            if (dlsiteLinkElement) {
                let originalUrl = dlsiteLinkElement.href;
                try {
                    // 使用 URL API 进行安全、可靠的格式化
                    const url = new URL(originalUrl);
                    if (url.pathname.endsWith('/')) { url.pathname = url.pathname.slice(0, -1); } // 移除路径末尾可能存在的斜杠
                    url.searchParams.set('locale', 'zh-CN'); // 强制设置 locale 为 zh-CN
                    extractedDlsiteUrl = url.href;
                } catch (error) {
                    console.error('[F95助手] DLsite URL 格式化失败:', error);
                    extractedDlsiteUrl = originalUrl; // 如果解析失败，则回退到原始URL
                }
            }
        }

        // 音声、马赛克、游戏CG引擎、NTR
        gameAudioId = 0; // 没有 voiced 标签时，认为无音声
        gameCGMosaic = 0; // 没有 censored 标签时，认为无码
        const foundNtrIds = new Set(); // 临时存储匹配到的NTR ID集合
        document.querySelectorAll('span.js-tagList a').forEach(el => {
            const href = el.href ? el.href.toLowerCase() : '';
            // gameAudioId
            if (href.includes('/tags/voiced/')) { gameAudioId = 10; }
            // gameCGMosaic
            if (href.includes('/tags/censored/')) { gameCGMosaic = 1; }
            // gameCGEngine
            if (href.includes('/tags/ai-cg/')) { gameCGEngine = 'AI'; } // 仅当有 AI 标签时，才会修改 gameCGEngine
            // gameThemeNtrId
            for (const [idStr, config] of Object.entries(GAME_THEME_NTR_MAP)) {
                // 遍历 MAP，检查 keywords1
                if (config.keywords1 && config.keywords1.length > 0) {
                    // 检查当前链接是否包含任何一个关键词 (例如 /tags/netorare/)
                    const isMatch = config.keywords1.some(kw => href.includes('/tags/' + kw.toLowerCase() + '/'));
                    if (isMatch) {
                        foundNtrIds.add(parseInt(idStr));
                    }
                }
            }
        });
        // NTR 优先级判定: 30(NTR) > 20(NTRS) > 10(NTL) > 90(其他)
        if (foundNtrIds.has(30)) gameThemeNtrId = 30;
        else if (foundNtrIds.has(20)) gameThemeNtrId = 20;
        else if (foundNtrIds.has(10)) gameThemeNtrId = 10;
        else if (foundNtrIds.has(90)) gameThemeNtrId = 90;

        // F95评分数量、F95平均得分
        const pageActionContainer = document.querySelector('.p-title-pageAction');
        if (pageActionContainer) {
            // 投票后的HTML结构
            const ratingStarsRow = pageActionContainer.querySelector('.ratingStarsRow');
            if (ratingStarsRow) {
                const ratingStars = ratingStarsRow.querySelector('.ratingStars[title]');
                if (ratingStars) {
                    const titleMatch = ratingStars.title.match(/(\d+\.?\d*)/);
                    if (titleMatch) {
                        f95AvgScore = (parseFloat(titleMatch[1]) * 2).toFixed(1); // 5分制，需乘以2
                    }
                }
                const voteElement = ratingStarsRow.querySelector('.ratingStarsRow-text div');
                if (voteElement) {
                    const voteMatch = voteElement.textContent.replace(/,/g, '').match(/(\d+)/);
                    if (voteMatch) {
                        f95VoteCount = parseInt(voteMatch[1], 10);
                    }
                }
            }
            // 投票前的HTML结构
            else {
                const ratingWidget = pageActionContainer.querySelector('.br-widget.bratr-rating');
                if (ratingWidget) {
                    const voteElement = ratingWidget.querySelector('.bratr-vote-content div');
                    if (voteElement) {
                        const voteMatch = voteElement.textContent.replace(/,/g, '').match(/(\d+)/);
                        if (voteMatch) {
                            f95VoteCount = parseInt(voteMatch[1], 10);
                        }
                    }
                    let integerPart = 0;
                    let fractionalPart = 0;
                    integerPart = ratingWidget.querySelectorAll('a.br-selected').length;
                    const fractionalStar = ratingWidget.querySelector('a[class*="br-fractional-"]');
                    if (fractionalStar) {
                        const fractionalMatch = fractionalStar.className.match(/br-fractional-(\d+)/);
                        if (fractionalMatch) {
                            fractionalPart = parseInt(fractionalMatch[1], 10) / 100;
                        }
                    }
                    f95AvgScore = ((integerPart + fractionalPart) * 2).toFixed(1);
                }
            }
        }

        const gameOfficialLinks = [
            { name: '独立官网', url: null },
            { name: 'DLsite', url: extractedDlsiteUrl }, // 填入抓取到的地址
            { name: 'Patreon', url: null },
            { name: 'SubscribeStar', url: null }
        ];

        const result = {
            f95ThreadId, 
            f95VoteCount, 
            f95AvgScore, 
            steamId, 
            gameName1, 
            gameDev, 
            gameVersion, 
            gameReleaseDate, 
            gameEngine, 
            gameType, 
            gameCGEngine, 
            gameCGMosaic,
            gameDevStatus, 
            gameOfficialLinks,
            gameChineseId, 
            gameAudioId,
            gameThemeNtrId,
        };
        console.log('[F95助手] 提取的F95信息:', result);
        return result;
    }


    // -------------------- VNDB --------------------
    // VNDB按钮（补充信息、编辑数据、F95 跳转、SteamDB 跳转/搜索）
    function vndbButtons() {
        const { buttonContainer, baseButtonStyle, tooltip } = createButtonUI(); // 调用核心UI函数创建通用界面

        // “我的游戏库”按钮
        const libButton = document.createElement('button');
        libButton.textContent = '我的游戏库';
        libButton.classList.add('f95-helper-button');
        Object.assign(libButton.style, baseButtonStyle, { backgroundColor: '#6f42c1' }); // 紫色
        buttonContainer.appendChild(libButton);
        // 点击事件
        libButton.addEventListener('click', () => {
            GM_openInTab('https://f95zone.to/game', { active: true });
        });

        // “补充信息”按钮
        const supplementButton = document.createElement('button');
        supplementButton.textContent = '补充信息';
        supplementButton.classList.add('f95-helper-button');
        Object.assign(supplementButton.style, baseButtonStyle, { backgroundColor: '#007bff' });
        buttonContainer.appendChild(supplementButton);
        // 悬停事件
        supplementButton.addEventListener('mouseover', () => buttonTooltip(tooltip, supplementButton, 'vndb'));
        supplementButton.addEventListener('mouseout', () => { tooltip.style.display = 'none'; });
        // 点击事件
        supplementButton.addEventListener('click', () => {
            const liveInfo = vndbGameInfo();
            if (!liveInfo) {
                alert('错误：无法解析当前VNDB页面信息！');
                return;
            }

            let matchedF95ThreadId = vndbMatchDB(liveInfo);
            if (!matchedF95ThreadId) { // 如果自动匹配失败，则尝试手动输入
                matchedF95ThreadId = promptForF95Id();
                if (!matchedF95ThreadId) { // 如果用户取消或输入无效
                    alert('未提供有效的 F95 ID，操作已取消。');
                    return;
                }
            }

            updateLocalDatabase(liveInfo, 'vndb', matchedF95ThreadId);

            // “补充信息”按钮的UI反馈
            const originalText = supplementButton.textContent;
            supplementButton.textContent = '已补充!';
            supplementButton.style.backgroundColor = '#28a745'; // 绿色
            setTimeout(() => {
                supplementButton.textContent = originalText;
                supplementButton.style.backgroundColor = '#007bff'; // 恢复蓝色
            }, 1500);

            // “编辑本地数据”按钮的UI反馈
            matchedIdForCheck = matchedF95ThreadId;
            editButton.disabled = false;
            editButton.style.cursor = 'pointer';
            editButton.style.filter = 'none';
            editButton.title = '编辑本地数据';
        });

        // “编辑本地数据”按钮
        const editButton = document.createElement('button');
        editButton.textContent = '编辑数据';
        editButton.classList.add('f95-helper-button');
        Object.assign(editButton.style, baseButtonStyle, { backgroundColor: '#6c757d' });
        buttonContainer.appendChild(editButton);
        // 检查本地数据是否存在，以决定是否禁用编辑按钮
        const liveInfoForCheck = vndbGameInfo();
        let matchedIdForCheck = liveInfoForCheck ? vndbMatchDB(liveInfoForCheck) : null;
        if (!matchedIdForCheck) {
            editButton.disabled = true; // 禁用点击
            editButton.style.cursor = 'not-allowed'; // 悬停光标样式为×
            editButton.style.filter = 'grayscale(80%)'; // 80%灰度滤镜
            editButton.title = '本地无此游戏记录，无法编辑';
        }
        // 点击事件
        editButton.addEventListener('click', () => {
            if (editButton.disabled) return;
            openEditWindow(matchedIdForCheck);
        });

        // “返回 F95”按钮
        const f95Button = document.createElement('button');
        f95Button.textContent = '返回 F95';
        f95Button.classList.add('f95-helper-button');
        Object.assign(f95Button.style, baseButtonStyle, { backgroundColor: '#181A1D' });
        buttonContainer.appendChild(f95Button);
        // 点击事件
        f95Button.addEventListener('click', () => {
            const liveInfo = vndbGameInfo();
            if (!liveInfo) {
                alert('无法解析页面信息！');
                return;
            }
            const matchedF95ThreadId = vndbMatchDB(liveInfo);

            if (matchedF95ThreadId) { // 如果匹配到ID，直接跳转
                const f95Url = `https://f95zone.to/threads/${matchedF95ThreadId}/`;
                window.open(f95Url, '_blank');
            } else {
                // ▲待修改。如果没有匹配到ID，执行搜索。不过F95搜索逻辑较为复杂，暂不实现。（通过url搜索需要 xfToken ；通过模拟输入需要跨域。）
                alert('未在本地数据库中找到匹配的F95页面。');
            }
        });

        // “跳转 SteamDB”按钮
        const steamdbButton = document.createElement('button');
        steamdbButton.textContent = '跳转 SteamDB';
        steamdbButton.classList.add('f95-helper-button');
        Object.assign(steamdbButton.style, baseButtonStyle, { backgroundColor: '#223D58' });
        buttonContainer.appendChild(steamdbButton);
        // 点击事件
        steamdbButton.addEventListener('click', () => {
            const liveInfo = vndbGameInfo();
            if (!liveInfo) {
                alert('无法解析页面信息！');
                return;
            }
            const matchedF95ThreadId = vndbMatchDB(liveInfo);
            const localInfo = getLocalInfo(matchedF95ThreadId);

            if (localInfo && localInfo.steamId) { // 如果本地有ID，直接跳转
                // const steamUrl = `https://store.steampowered.com/app/${localInfo.steamId}/_/?l=schinese`;
                const steamUrl = `https://steamdb.info/app/${localInfo.steamId}/info/`;
                window.open(steamUrl, '_blank');
            } else { // 如果本地没有ID，执行搜索
                if (!liveInfo.gameName1) {
                    alert('无法获取有效的游戏名进行搜索！');
                    return;
                }
                const searchTerm = encodeURIComponent(liveInfo.gameName1);
                // const steamUrl = `https://store.steampowered.com/search/?term=${searchTerm}&supportedlang=schinese%2Cenglish&category1=998%2C21&ndl=1`;
                const steamUrl = `https://steamdb.info/search/?a=all&q=${searchTerm}`;
                window.open(steamUrl, '_blank');
            }
        });
    }
    /**
     * 提取VNDB页面的游戏信息
     * @returns {object|null} 包含所有游戏信息的对象，或在找不到关键元素时返回 null
     */
    function vndbGameInfo() {
        let vndbId = null;
        let gameName1 = null; // 英文名
        let gameName2 = null; // 中文名
        let gameName3 = null; // 别名（日文名）
        let gameDev = null; // 游戏作者
        let vndbVoteCount = null; // 评分数量
        let vndbAvgScore = null; // 平均得分 (10分制)
        // let gameChineseId = null; // 游戏是否存在官方中文

        // VNDB ID
        const urlMatch = window.location.pathname.match(/\/v(\d+)/);
        if (urlMatch && urlMatch[1]) {
            vndbId = urlMatch[1];
        }

        // 游戏作者
        document.querySelectorAll('.vndetails > .stripe tr').forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 2 && cells[0].textContent.trim() === 'Developer') { // 确保行中有至少两个单元格，并且第一个单元格的文本是 "Developer"
                const devLink = cells[1].querySelector('a'); // 开发者名称在第二个单元格的 <a> 标签内
                if (devLink) {
                    gameDev = devLink.textContent.trim();
                }
            }
        });

        // 评分数量、平均得分
        const voteStatsFooter = document.querySelector('#stats .votegraph tfoot');
        if (voteStatsFooter) {
            const statsText = voteStatsFooter.textContent;
            // 评分数量
            const voteMatch = statsText.match(/(\d+)\s+votes/);
            if (voteMatch && voteMatch[1]) {
                vndbVoteCount = parseInt(voteMatch[1], 10);
            }
            // 平均得分
            const scoreMatch = statsText.match(/(\d+\.\d+)\s+average/);
            if (scoreMatch && scoreMatch[1]) {
                vndbAvgScore = parseFloat(scoreMatch[1]).toFixed(1);
            }
        }

        // 3种语言的游戏名
        document.querySelectorAll('.vnreleases > details').forEach(detailsElement => {
            const summary = detailsElement.querySelector('summary');
            if (!summary) return;
            const langIcon = summary.querySelector('abbr[class*="icon-lang-"]');
            if (!langIcon) return;
            const language = langIcon.title;
            // 英文游戏名
            if (language === 'English') {
                const firstReleaseRow = detailsElement.querySelector('table.releases tr');
                if (firstReleaseRow) {
                    const titleLink = firstReleaseRow.querySelector('td.tc4 a');
                    if (titleLink) {
                        gameName1 = titleLink.textContent.trim();
                        // const unofficialMarker = titleLink.nextElementSibling;
                        // gameName1Official = !(unofficialMarker && unofficialMarker.tagName === 'SMALL' && unofficialMarker.textContent.toLowerCase().includes('unofficial'));
                    }
                }
            }
            // 中文游戏名
            if (language === 'Chinese (simplified)') {
                const firstReleaseRow = detailsElement.querySelector('table.releases tr');
                if (firstReleaseRow) {
                    const titleLink = firstReleaseRow.querySelector('td.tc4 a');
                    if (titleLink) {
                        gameName2 = titleLink.textContent.trim();
                        // const unofficialMarker = titleLink.nextElementSibling;
                        // gameName2Official = !(unofficialMarker && unofficialMarker.tagName === 'SMALL' && unofficialMarker.textContent.toLowerCase().includes('unofficial'));
                        // if (gameName2) gameChineseId = gameName2Official ? '1' : '0';
                    }
                }
            }
            // 日文官方游戏名
            if (language === 'Japanese') {
                const firstReleaseRow = detailsElement.querySelector('table.releases tr');
                if (firstReleaseRow) {
                    const titleLink = firstReleaseRow.querySelector('td.tc4 a');
                    if (titleLink) {
                        const unofficialMarker = titleLink.nextElementSibling;
                        const isUnofficial = unofficialMarker && unofficialMarker.tagName === 'SMALL' && unofficialMarker.textContent.toLowerCase().includes('unofficial'); // 非官方名判定
                        if (!isUnofficial) {
                            gameName3 = titleLink.textContent.trim();
                        }
                    }
                }
            }
        });

        const result = {
            vndbId,
            gameName1,
            gameName2,
            gameName3,
            gameDev,
            vndbVoteCount,
            vndbAvgScore
        };
        console.log('[F95助手] 提取的VNDB信息:', result);
        return result;
    }
    /**
     * 由VNDB页面获取f95ThreadId。从本地数据库中匹配。
     * @param {object} liveInfo - 从 vndbGameInfo() 返回的实时 VNDB 信息对象
     * @returns {string|null} 如果找到匹配的游戏，返回其 f95ThreadId，否则返回 null
     */
    function vndbMatchDB(liveInfo) {
        if (!liveInfo || !liveInfo.vndbId) {
            console.warn('[F95助手] VNDB 页面缺少有效 ID，已跳过比对。');
            return null;
        }
        const database = JSON.parse(GM_getValue('f95GameDatabase', '{}'));
        if (!database) return null;

        // VNDB ID 直接匹配
        for (const threadId in database) {
            if (database[threadId].vndbId === liveInfo.vndbId) {
                return threadId;
            }
        }

        // ID 匹配失败时，进行游戏名称和开发者匹配
        const normLiveName1 = normalizeName(liveInfo.gameName1);
        const normLiveName2 = normalizeName(liveInfo.gameName2);
        const normLiveName3 = normalizeName(liveInfo.gameName3);
        const normVndbDev = normalizeAuthor(liveInfo.gameDev);
        if (!normVndbDev || !(normLiveName1 || normLiveName2 || normLiveName3)) return null;

        for (const threadId in database) {
            const localInfo = database[threadId];
            const normLocalName1 = normalizeName(localInfo.gameName1);
            const normLocalName2 = normalizeName(localInfo.gameName2);
            const normLocalName3 = normalizeName(localInfo.gameName3);
            const normLocalDev = normalizeAuthor(localInfo.gameDev);
            const isDevMatch = normLocalDev === normVndbDev;
            const isTitleMatch = normLiveName1.includes(normLocalName1) || normLiveName2.includes(normLocalName2) || normLiveName3.includes(normLocalName3);
            if (isDevMatch && isTitleMatch) {
                return threadId;
            }
        }

        return null; // 遍历结束仍未找到匹配项
    }


    // -------------------- SteamDB --------------------
    // SteamDB按钮（补充信息、编辑数据、F95 跳转、Steam 跳转、VNDB 跳转/搜索）
    function steamdbButtons() {
        const { buttonContainer, baseButtonStyle, tooltip } = createButtonUI(); // 调用核心UI函数创建通用界面

        // “我的游戏库”按钮
        const libButton = document.createElement('button');
        libButton.textContent = '我的游戏库';
        libButton.classList.add('f95-helper-button');
        Object.assign(libButton.style, baseButtonStyle, { backgroundColor: '#6f42c1' }); // 紫色
        buttonContainer.appendChild(libButton);
        // 点击事件
        libButton.addEventListener('click', () => {
            GM_openInTab('https://f95zone.to/game', { active: true });
        });

        // “补充信息”按钮
        const supplementButton = document.createElement('button');
        supplementButton.textContent = '补充信息';
        supplementButton.classList.add('f95-helper-button');
        Object.assign(supplementButton.style, baseButtonStyle, { backgroundColor: '#007bff' });
        buttonContainer.appendChild(supplementButton);
        // 悬停事件
        supplementButton.addEventListener('mouseover', () => buttonTooltip(tooltip, supplementButton, 'steamdb'));
        supplementButton.addEventListener('mouseout', () => { tooltip.style.display = 'none'; });
        // 点击事件
        supplementButton.addEventListener('click', () => {
            const liveInfo = steamdbGameInfo();
            if (!liveInfo) {
                alert('错误：无法解析当前SteamDB页面信息！');
                return;
            }
            let matchedF95ThreadId = steamdbMatchDB(liveInfo);
            if (!matchedF95ThreadId) { // 如果自动匹配失败，则尝试手动输入
                matchedF95ThreadId = promptForF95Id();
                if (!matchedF95ThreadId) { // 如果用户取消或输入无效
                    alert('未提供有效的 F95 ID，操作已取消。');
                    return;
                }
            }
            updateLocalDatabase(liveInfo, 'steamdb', matchedF95ThreadId);
            
            // “补充信息”按钮的UI反馈
            const originalText = supplementButton.textContent;
            supplementButton.textContent = '已补充!';
            supplementButton.style.backgroundColor = '#28a745'; // 绿色
            setTimeout(() => {
                supplementButton.textContent = originalText;
                supplementButton.style.backgroundColor = '#007bff'; // 恢复蓝色
            }, 1500);

            // “编辑本地数据”按钮的UI反馈
            matchedIdForCheck = matchedF95ThreadId;
            editButton.disabled = false;
            editButton.style.cursor = 'pointer';
            editButton.style.filter = 'none';
            editButton.title = '编辑本地数据';
        });

        // “编辑本地数据”按钮
        const editButton = document.createElement('button');
        editButton.textContent = '编辑数据';
        editButton.classList.add('f95-helper-button');
        Object.assign(editButton.style, baseButtonStyle, { backgroundColor: '#6c757d' });
        buttonContainer.appendChild(editButton);
        // 检查本地数据是否存在，以决定是否禁用编辑按钮
        const liveInfoForCheck = steamdbGameInfo();
        let matchedIdForCheck = liveInfoForCheck ? steamdbMatchDB(liveInfoForCheck) : null;
        if (!matchedIdForCheck) {
            editButton.disabled = true;
            editButton.style.cursor = 'not-allowed';
            editButton.style.filter = 'grayscale(80%)';
            editButton.title = '本地无此游戏记录，无法编辑';
        }
        // 点击事件
        editButton.addEventListener('click', () => {
            if (editButton.disabled) return;
            openEditWindow(matchedIdForCheck);
        });

        // “返回 F95”按钮
        const f95Button = document.createElement('button');
        f95Button.textContent = '返回 F95';
        f95Button.classList.add('f95-helper-button');
        Object.assign(f95Button.style, baseButtonStyle, { backgroundColor: '#181A1D' });
        buttonContainer.appendChild(f95Button);
        // 点击事件
        f95Button.addEventListener('click', () => {
            const liveInfo = steamdbGameInfo();
            if (!liveInfo) {
                alert('无法解析页面信息！');
                return;
            }
            const matchedF95ThreadId = steamdbMatchDB(liveInfo);

            if (matchedF95ThreadId) { // 如果匹配到ID，直接跳转
                const f95Url = `https://f95zone.to/threads/${matchedF95ThreadId}/`;
                window.open(f95Url, '_blank');
            } else {
                // ▲待修改。如果没有匹配到ID，执行搜索。不过F95搜索逻辑较为复杂，暂不实现。（通过url搜索需要 xfToken ；通过模拟输入需要跨域。）
                alert('未在本地数据库中找到匹配的F95页面。');
            }
        });

        // “跳转 Steam”按钮
        const steamButton = document.createElement('button');
        steamButton.textContent = '跳转 Steam';
        steamButton.classList.add('f95-helper-button');
        Object.assign(steamButton.style, baseButtonStyle, { backgroundColor: '#223D58' });
        buttonContainer.appendChild(steamButton);
        // 点击事件
        steamButton.addEventListener('click', () => {
            const liveInfo = steamdbGameInfo();
            if (liveInfo && liveInfo.steamId) {
                const steamUrl = `https://store.steampowered.com/app/${liveInfo.steamId}/_/?l=schinese`;
                window.open(steamUrl, '_blank');
            } else {
                alert('无法获取当前页面的 Steam ID！');
            }
        });

        // “跳转 VNDB”按钮
        const vndbButton = document.createElement('button');
        vndbButton.textContent = '跳转 VNDB';
        vndbButton.classList.add('f95-helper-button');
        Object.assign(vndbButton.style, baseButtonStyle, { backgroundColor: '#223D58' });
        buttonContainer.appendChild(vndbButton);
        // 点击事件
        vndbButton.addEventListener('click', () => {
            const liveInfo = steamdbGameInfo();
            if (!liveInfo) {
                alert('无法解析页面信息！');
                return;
            }
            const matchedF95ThreadId = steamdbMatchDB(liveInfo);
            const localInfo = getLocalInfo(matchedF95ThreadId);

            if (localInfo && localInfo.vndbId) { // 如果本地有ID，直接跳转
                const vndbUrl = `https://vndb.org/v${localInfo.vndbId}`;
                window.open(vndbUrl, '_blank');
            } else { // 如果本地没有ID，执行搜索
                if (!liveInfo.gameName1) { // 使用从SteamDB获取的游戏名
                    alert('无法获取有效的游戏名进行搜索！');
                    return;
                }
                const searchTerm = encodeURIComponent(liveInfo.gameName1);
                const vndbUrl = `https://vndb.org/v?sq=${searchTerm}`;
                window.open(vndbUrl, '_blank');
            }
        });
    }

    /**
     * 提取SteamDB页面的游戏信息
     * @returns {object|null} 包含所有游戏信息的对象，或在找不到关键元素时返回 null
     */
    function steamdbGameInfo() {
        let steamId = null;
        let gameName1 = null; // 英文名
        let gameName2 = null; // 中文名
        let gameDev = null; // 游戏作者
        let gameEngine = null; // 游戏引擎
        let steamVoteCount = null; // 评分数量
        let steamAvgScore = null; // 平均得分 (10分制)
        let gameChineseId = null; // 游戏是否存在官方中文
        let gameAudioId = null;   // 游戏音声

        // Steam ID
        const urlMatch = window.location.pathname.match(/\/app\/(\d+)/);
        if (urlMatch && urlMatch[1]) {
            steamId = urlMatch[1];
        }
        // 游戏作者，游戏引擎
        const mainInfoTable = document.querySelector('.table.table-bordered.table-responsive-flex'); // 主表格
        if (mainInfoTable) {
            mainInfoTable.querySelectorAll('tbody tr').forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length < 2) return;
                const key = cells[0].textContent.trim();
                const valueCell = cells[1];
                if (key === 'Developer') {
                    const devLinks = valueCell.querySelectorAll('a[itemprop="author"]');
                    gameDev = Array.from(devLinks).map(link => link.textContent.trim()).join(', ');
                } else if (key === 'Technologies') {
                    gameEngine = valueCell.textContent.trim();
                    if (gameEngine.includes('Unity')) gameEngine = 'Unity';
                    else if (gameEngine.includes('Unreal')) gameEngine = 'Unreal';
                    else if (gameEngine.includes("RenPy Engine")) gameEngine = "Ren'Py";
                    else if (gameEngine.includes("RPGMaker Engine")) gameEngine = "RPGMaker";
                }
            });
        }
        // 英文游戏名
        const nameElement = document.querySelector('h1[itemprop="name"]');
        if (nameElement) gameName1 = nameElement.textContent.trim();
        // 英文游戏名，中文游戏名
        const metadataTable = document.querySelector('#info .table.table-bordered'); // Additional Information 表格
        if (metadataTable) {
            metadataTable.querySelectorAll('tbody > tr').forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length < 2) return;
                const key = cells[0].textContent.trim();
                const valueCell = cells[1];
                if (key === 'name_localized') {
                    const localizedTable = valueCell.querySelector('table');
                    if (localizedTable) {
                        localizedTable.querySelectorAll('tbody tr').forEach(langRow => {
                            const langCells = langRow.querySelectorAll('td');
                            if (langCells.length >= 2 && langCells[0].textContent.trim() === 'english') {
                                gameName1 = langCells[1].textContent.trim();
                            } else if (langCells.length >= 2 && langCells[0].textContent.trim() === 'schinese') {
                                gameName2 = langCells[1].textContent.trim();
                            }
                        });
                    }
                }
            });
        }
        // 官中与音声
        const langTable = document.querySelector('.table-languages'); // 查找语言表格
        if (langTable) {
            gameChineseId = 0; // 默认为无官中
            gameAudioId = 0;   // 默认为无音声
            
            langTable.querySelectorAll('tbody tr').forEach(row => {
                const cells = row.querySelectorAll('td');
                // 确保列数足够: 0:Name, 1:Interface, 2:Audio, 3:Subtitles
                if (cells.length >= 4) { 
                    const langName = cells[0].textContent.trim();
                    const audioSupport = cells[2].textContent.trim() === 'Yes';
                    const subtitlesSupport = cells[3].textContent.trim() === 'Yes';

                    // 官中判断 (gameChineseId)
                    // 逻辑：只要有简体中文且支持字幕，即标记为官方中文(20)
                    if (langName === 'Simplified Chinese' && subtitlesSupport) {
                        gameChineseId = 20;
                    }

                    // 音声判断 (gameAudioId)
                    // 逻辑：取最大值 (简繁中33 > 英文32 > 日文31 > 其他0)
                    if (audioSupport) {
                        let currentVal = 0;
                        if (langName === 'Simplified Chinese' || langName === 'Traditional Chinese') {
                            currentVal = 33;
                        } else if (langName === 'English') {
                            currentVal = 32;
                        } else if (langName === 'Japanese') {
                            currentVal = 31;
                        }
                        // 更新最大值
                        if (currentVal > gameAudioId) {
                            gameAudioId = currentVal;
                        }
                    }
                }
            });
        }

        // 评分和数量
        const reviewsElement = document.querySelector('#js-reviews-button');
        if (reviewsElement) {
            const ariaLabel = reviewsElement.getAttribute('aria-label');
            if (ariaLabel) {
                const scoreMatch = ariaLabel.match(/^(\d+\.?\d*)%/);
                if (scoreMatch && scoreMatch[1]) {
                    steamAvgScore = (parseFloat(scoreMatch[1]) / 10).toFixed(1); // 将百分制评分转换为10分制，并保留一位小数
                }
            }
            const voteMeta = reviewsElement.querySelector('meta[itemprop="reviewCount"]');
            if (voteMeta) { // 由于html结构可能不一致，需要变换获取 steamVoteCount 的位置
                steamVoteCount = parseInt(voteMeta.getAttribute('content'), 10);
            }
            else if (ariaLabel) {
                const voteMatch = ariaLabel.match(/of the ([\d,]+) user reviews/);
                if (voteMatch && voteMatch[1]) {
                    steamVoteCount = parseInt(voteMatch[1].replace(/,/g, ''), 10);
                }
            }
        }

        const result = {
            steamId,
            gameName1,
            gameName2,
            gameDev,
            gameEngine,
            steamVoteCount,
            steamAvgScore,
            gameChineseId,
            gameAudioId,
        };
        console.log('[F95助手] 提取的SteamDB信息:', result);
        return result;
    }
    /**
     * 由SteamDB页面获取f95ThreadId。从本地数据库中匹配。
     * @param {object} liveInfo - 从 steamdbGameInfo() 返回的实时 SteamDB 信息对象
     * @returns {string|null} 如果找到匹配的游戏，返回其 f95ThreadId，否则返回 null
     */
    function steamdbMatchDB(liveInfo) {
        if (!liveInfo || !liveInfo.steamId) {
            console.warn('[F95助手] SteamDB 页面缺少有效 ID，已跳过比对。');
            return null;
        }
        const database = JSON.parse(GM_getValue('f95GameDatabase', '{}'));
        if (!database) return null;

        // 策略1：Steam ID 直接匹配 (最高优先级)
        for (const threadId in database) {
            if (database[threadId].steamId === liveInfo.steamId) {
                console.log(`[F95助手] 通过Steam ID找到匹配项: ${threadId}`);
                return threadId;
            }
        }

        // 策略2：ID 匹配失败时，进行游戏名称和开发者匹配 (备用策略)
        // 注意：此策略需要 steamdbGameInfo 能够成功提取到 gameName1 和 gameDev
        const normLiveName1 = normalizeName(liveInfo.gameName1);
        const normLiveDev = normalizeAuthor(liveInfo.gameDev);
        if (!normLiveDev || !normLiveName1) {
            console.log('[F95助手] 无法进行名称/作者匹配，信息不足。');
            return null;
        }

        for (const threadId in database) {
            const localInfo = database[threadId];
            const normLocalName1 = normalizeName(localInfo.gameName1);
            const normLocalDev = normalizeAuthor(localInfo.gameDev);

            // 匹配条件：作者名相同，且游戏名互相包含（或基本相同）
            const isDevMatch = normLocalDev === normLiveDev;
            const isTitleMatch = normLiveName1.includes(normLocalName1) || normLocalName1.includes(normLiveName1);
            if (isDevMatch && isTitleMatch) {
                console.log(`[F95助手] 通过名称和作者找到模糊匹配项: ${threadId}`);
                return threadId;
            }
        }

        console.log('[F95助手] 未在数据库中找到任何匹配项。');
        return null; // 遍历结束仍未找到匹配项
    }


    // -------------------- Steam --------------------
    // Steam按钮
    function steamButtons() {
        const { buttonContainer, baseButtonStyle, tooltip } = createButtonUI(); // 调用核心UI函数创建通用界面

        // “我的游戏库”按钮
        const libButton = document.createElement('button');
        libButton.textContent = '我的游戏库';
        libButton.classList.add('f95-helper-button');
        Object.assign(libButton.style, baseButtonStyle, { backgroundColor: '#6f42c1' }); // 紫色
        buttonContainer.appendChild(libButton);
        // 点击事件
        libButton.addEventListener('click', () => {
            GM_openInTab('https://f95zone.to/game', { active: true });
        });

        // “返回 SteamDB”按钮
        const steamdbButton = document.createElement('button');
        steamdbButton.textContent = '返回 SteamDB';
        steamdbButton.classList.add('f95-helper-button');
        Object.assign(steamdbButton.style, baseButtonStyle, { backgroundColor: '#223D58' });
        buttonContainer.appendChild(steamdbButton);
        // 点击事件
        steamdbButton.addEventListener('click', () => {
            const appId = window.location.pathname.match(/\/app\/(\d+)/);
            if (appId && appId[1]) {
                const steamdbUrl = `https://steamdb.info/app/${appId[1]}/info/`;
                window.open(steamdbUrl, '_blank');
            }
        });
    }


    // -------------------- 辅助函数 --------------------
    // 当前URL是否包含传递的字符串
    function isURL(x) {
        return window.location.href.indexOf(x) != -1;
    }
    // 游戏标题标准化
    // 例："A Game: The New Chapter [v2.0 Final]" 会变成 "a game the new chapter"。
    function normalizeName(name) {
        if (!name) return '';
        let norm = name
            .split('|')[0] // 如果包含 |, 只取第一部分作为主要名称进行比较
            // ▲待修改，最好能比较所有别名
            .toLowerCase() // 全部转为小写，这是所有比较的基础
            .replace(/\*$/, '') // 移除末尾可能的 * (表示非官方)
            .replace(/\s*\[.*?\]/g, '') // 移除所有方括号及其内容 (例如 [v1.0], [Completed])
            .replace(/\s*\(.*?\)/g, '') // 移除所有圆括号及其内容 (例如 (Full Release))
            .replace(/[-\s]\s*(season|part|chapter|episode|book)\s*(\d+|final)/g, '') // 移除类似 season 1、- season final 之类的后缀
            .replace(/-\s*(final|complete|demo|test)/g, '') // 移除类似 - final 之类的后缀
            .replace(/\s+(final|demo)/g, '') // 移除类似 final 之类的后缀（这一步需要小心，最好不要随意添加）
            .replace(/[^\p{L}\p{N}]/gu, '') // 只保留文字(Letter)、数字(Number)
            .trim();
        return norm;
    }
    // 作者名字标准化
    function normalizeAuthor(author) {
        if (!author) return '';
        return author.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
    }
    /**
     * 点击补充信息按钮时，当自动匹配失败（找不到matchedF95ThreadId），通过弹窗询问用户手动输入 F95 ID
     * @returns {string|null} 如果用户输入了有效的纯数字ID，则返回该ID字符串，否则返回 null
     */
    function promptForF95Id() {
        const message = "未在本地数据库中找到匹配的游戏。\n\n如果您知道此游戏在 F95zone 上的帖子 ID，请输入它以手动关联（留空或取消则跳过）：";
        const input = prompt(message);

        if (!input) { // 处理用户点击“取消”或输入为空字符串的情况
            return null;
        }

        const trimmedId = input.trim();
        if (/^\d+$/.test(trimmedId)) {
            console.log(`[F95助手] 用户手动输入ID: ${trimmedId}`);
            return trimmedId; // 验证成功，返回纯数字ID
        } else {
            alert('输入的ID格式无效，必须是纯数字。');
            return null; // 验证失败
        }
    }
    // 使指定的 HTML 元素可以通过一个“把手”元素进行拖拽
    function makeDraggable(elmnt, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
    /**
     * 标签：检查字符串是否包含关键词列表中的任何一个关键词（关键词由英文逗号分隔，忽略大小写）
     * @param {string} text - 被检查的源字符串 (例如: 'Male Protagonist')。
     * @param {string} keywords - 关键词列表 (例如: 'male protag, animated')。
     * @returns {boolean} 如果 text 包含了任何一个关键词，则返回 true，否则返回 false。
     */
    function includesAnyIgnoreCase(text, keywords) {
        if (!keywords) return false;
        const textLower = text.toLowerCase();
        return keywords.split(',').some(kw => textLower.includes(kw.trim().toLowerCase()));
    }
    // 更新日志：版本号比较 (1: v1>v2, -1: v1<v2, 0: v1=v2)
    function compareVersions(v1, v2) {
        if (!v1 || !v2) return 0;
        const p1 = v1.split('.').map(Number);
        const p2 = v2.split('.').map(Number);
        for (let i = 0; i < Math.max(p1.length, p2.length); i++) {
            const n1 = p1[i] || 0;
            const n2 = p2[i] || 0;
            if (n1 > n2) return 1;
            if (n1 < n2) return -1;
        }
        return 0;
    }
    // 更新日志：解析日志中的链接 [文本](url)
    function parseLogLinks(text) {
        // 匹配 [text](url) 格式
        return text.replace(/\[(.*?)\]\((.*?)\)/g, (match, txt, url) => {
            return `<a href="${url}" target="_blank" style="color:#58a6ff; text-decoration:none; border-bottom:1px dashed #58a6ff;">${txt}</a>`;
        });
    }
    // DLsite URL中提取RJ号 (例如 RJ123456)
    function extractDlsiteId(url) {
        if (!url) {
            return null;
        }
        const match = url.match(/product_id\/([A-Z]{2}\d+)/); // 正则表达式查找 "product_id/" 后面的两位大写字母+数字的组合
        return match ? match[1] : null;
    }
})();