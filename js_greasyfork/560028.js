// ==UserScript==
// @name         智能JavaScript拦截器
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  按域名和脚本类型选择性拦截JavaScript
// @author       Your Name
// @match        *://*/*
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/560028/%E6%99%BA%E8%83%BDJavaScript%E6%8B%A6%E6%88%AA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/560028/%E6%99%BA%E8%83%BDJavaScript%E6%8B%A6%E6%88%AA%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 获取当前域名
    var currentDomain = window.location.hostname;
    
    // 默认拦截规则
    var defaultRules = {
        // 广告相关脚本
        "ads": {
            name: "广告脚本",
            enabled: true,
            keywords: [
                "ads", "adserver", "doubleclick", "googlesyndication",
                "adsystem", "adnxs", "advertising", "advertisement",
                "adtech", "criteo", "taboola", "outbrain",
                "adsbygoogle", "adsense", "amazon-adsystem",
                "facebook.com/ads", "advertising.com", "adzerk",
                "mgid", "revcontent", "zemanta", "adition",
                "adblade", "adbrite", "adform", "adition",
                "adriver", "adsnative", "adsoptimal", "advertisingbox",
                "advertnative", "adyoulike", "adzbazar", "aidata",
                "appier", "bidswitch", "brightroll", "casalemedia",
                "conversant", "districtm", "exponential", "flashtalking",
                "gemius", "getintent", "improvedigital", "indexexchange",
                "innovid", "inspectlet", "kargo", "kiosked",
                "lifestreet", "lkqd", "loopme", "mads",
                "mantis", "media.net", "monetate", "myads",
                "nativeads", "nativo", "openx", "pixel",
                "pubmatic", "pubnation", "purch", "quoraads",
                "rubiconproject", "sharethrough", "smartadserver",
                "sovrn", "spotx", "stackadapt", "taboola",
                "teads", "triplelift", "undertone", "unruly",
                "verizonmedia", "videology", "vivaki", "yieldmo",
                "yieldone", "yieldlab", "zedo", "adthink",
                "audiencenetwork", "bidvertiser", "clickaine", "clickio",
                "criteo", "digidip", "epom", "goldlasso",
                "gumgum", "ibillboard", "infolinks", "inmobi",
                "insticator", "integralads", "junction", "kiosked",
                "komoona", "leadbolt", "mediavine", "mgid",
                "moatads", "nend", "okasconcepts", "openadstream",
                "orbitz", "plista", "powerlinks", "projectwonderful",
                "propellerads", "pulsepoint", "redirectvoluum",
                "rocketfuel", "sekindo", "sharethrough", "sonobi",
                "swoop", "synacor", "trafficjunky", "tribalfusion",
                "trugaze", "turn", "videointelligence", "vidsense",
                "videoadex", "weborama", "xaxis", "yieldbot",
                "yieldr", "zeus", "adscale", "adstir",
                "afilio", "ambientdigital", "atemda", "avocarrot",
                "axonix", "betweendigital", "brainient", "bumlam",
                "captify", "cedato", "clinch", "colombia",
                "connectad", "contentad", "conversant", "crimtan",
                "dable", "dainik", "delivery", "demandbase",
                "dentsu", "dianomi", "digiseg", "dotandads",
                "eadv", "eanalyzer", "ebay", "ebuzzing",
                "effective", "emetriq", "engagespot", "eskimi",
                "etarget", "everesttech", "exelator", "exosrv",
                "eyeota", "eyereturn", "faktor", "fatchilli",
                "flashtalking", "freewheel", "funnel", "geniee",
                "giraff", "globalow", "gmossp", "grapeshot",
                "grid", "growingio", "hadron", "haus",
                "hi-media", "ias", "ibillboard", "ignitionone",
                "imr", "incrementx", "infonline", "innity",
                "inskin", "instream", "intent", "interceptd",
                "iprom", "iprospect", "ironsource", "isocket",
                "jivox", "justpremium", "kantar", "keen",
                "komoona", "largo", "ligatus", "liverail",
                "lockerdome", "logly", "mantis", "marchex",
                "marfeel", "marimedia", "mather", "maxpoint",
                "mediaimpact", "mediarithmics", "mediamath", "mediavoice",
                "metrigo", "mgid", "microad", "mixpo",
                "mobfox", "mobilda", "mobalo", "mobitrans",
                "moblin", "mobusi", "mojiva", "moloco",
                "mookie", "my6sense", "mythings", "nativo",
                "navdmp", "nend", "netcommunities", "netletix",
                "netshelter", "neuro", "nielsen", "noddus",
                "oath", "oberon", "okasconcepts", "omnitag",
                "onebyaol", "onenetwork", "onetag", "opteeo",
                "oracle", "outcomes", "oxomi", "parsely",
                "paytm", "permutive", "phando", "phluant",
                "plista", "polar", "popin", "popmyads",
                "postrelease", "ppenguin", "prediction", "privatestats",
                "proclivity", "projectagora", "propellerads", "prosper",
                "pubfuture", "pulpix", "quantcast", "radiumone",
                "rakuten", "readpeak", "realytics", "redintelligence",
                "rekmob", "remintrex", "research", "revcontent",
                "revjet", "richrelevance", "rightmove", "rockabox",
                "roqad", "rtb", "rubicon", "samba",
                "scanscout", "seeding", "sekindo", "semasio",
                "seventh", "sharethrough", "shopping", "siftscience",
                "simpli", "sirdata", "site", "skimlinks",
                "smadex", "smartclip", "smartstream", "smilewanted",
                "sociomantic", "sovrn", "sparkflow", "spotx",
                "sprinklr", "steepto", "stickyadstv", "streamrail",
                "stroeer", "superfast", "supernova", "survicate",
                "switchconcepts", "tabmo", "taboola", "tag",
                "tapad", "targeting", "teads", "tealium",
                "theadex", "themediagrid", "tidaltv", "tradedoubler",
                "traqli", "traffic", "traffichaus", "triplelift",
                "truefit", "trugaze", "tubemogul", "turn",
                "tvads", "twitter", "uberads", "ubimo",
                "udmserve", "ultra", "unruly", "usabilla",
                "value", "velti", "vibrant", "video",
                "videobyte", "videointelligence", "vidora", "viewdeos",
                "visible", "vmg", "vungle", "widespace",
                "wish", "wizaly", "xad", "xaxis",
                "xeiro", "xplosion", "yahoo", "yandex",
                "yieldify", "yieldlab", "yieldmo", "yieldone",
                "yieldr", "yieldtraffic", "youmi", "zemanta",
                "zergnet", "zucks", "admaster", "admicro",
                "adnium", "adnow", "adspirit", "adsunflower",
                "aduptech", "advangelists", "adverline", "adverticum",
                "advertur", "adyard", "aidata", "appads",
                "appier", "applift", "applovin", "appnext",
                "appnexus", "appsfire", "apptoday", "apptornado",
                "apsalar", "apsmart", "artimedia", "asianmedia",
                "avazutracking", "avocet", "awin", "axonix",
                "beachfront", "bee7", "betweendigital", "bidgear",
                "bidtheatre", "bidsx", "blismedia", "bluecava",
                "bounceexchange", "brandscreen", "brightcom", "britepool",
                "burstly", "buzzcity", "buzzoola", "byyd",
                "c1exchange", "cadreon", "cappture", "captifymedia",
                "carbon", "carambola", "ccpa", "cedato",
                "centro", "ceskydopravce", "chartboost", "chitika",
                "cj.com", "clarium", "clayful", "clearspring",
                "clickbooth", "clickdistrict", "clickfuse", "clickin",
                "clickky", "clickonometrics", "clicksor", "clipcentric",
                "cloudsponge", "cmps", "colombia", "com2us",
                "comscore", "connextra", "contentabc", "contentclick",
                "conversantmedia", "conversionruler", "coremetrics", "cpalead",
                "cpmstar", "cpxinteractive", "crispadvertising", "crosspixel",
                "crowdgravity", "crowdignite", "crownpeak", "crtv",
                "crystaladvertising", "cubics", "cxense", "dable",
                "datalogix", "datonics", "dcstorm", "decenthat",
                "dedicatedmedia", "deepintent", "delivery", "demandbase",
                "demdex", "dentsu", "dianomi", "digicert",
                "digidip", "digitaltarget", "digitimes", "disqusads",
                "distroscale", "dmtracker", "dmtracking", "domob",
                "dotandads", "doubleverify", "drip", "dtscout",
                "dynamicoxygen", "e-planning", "eadv", "eanalyzer",
                "ebay", "ebuzzing", "ecpm", "effective",
                "emetriq", "engager", "ensighten", "epom",
                "eskimi", "etarget", "everesttech", "exelate",
                "exelator", "exoclick", "exosrv", "exponential",
                "eyeview", "eyeota", "eyereturn", "eyewonder",
                "f1e", "faktor", "fatchilli", "feedads",
                "fetchback", "fiftyt", "firefly", "firstimpression",
                "flashtalking", "flexoffers", "flite", "fluent",
                "fmads", "forward", "foursquare", "fqtag",
                "freenet", "freewheel", "fresh8", "fullcircle",
                "funnel", "fusion", "fyber", "gamoshi",
                "geniee", "getclicky", "getintent", "giraff",
                "glispa", "globalow", "globalsign", "gmossp",
                "go2mobi", "goaffpro", "goldspot", "gothamads",
                "grapeshot", "gravity", "greenhouse", "grid",
                "growingio", "gumgum", "hadron", "halozyme",
                "haus", "hbx", "healthtrader", "heias",
                "hi-media", "historyads", "hittail", "honey",
                "hotjar", "huddle", "hydramedia", "hyper",
                "hypercontext", "i-mobile", "iad", "iam.ai",
                "ibillboard", "iclive", "ignitionone", "im-apps",
                "imagine", "imedia", "imds", "imonomy",
                "impact", "impdesk", "impressiondesk", "impressionnova",
                "improvedigital", "inadco", "inbrain", "increaserev",
                "indeedads", "indexexchange", "infinity", "infonline",
                "infolinks", "inmobi", "innity", "innovid",
                "innovid", "inpage", "inskin", "insticator",
                "instream", "integralads", "intellitxt", "intergi",
                "intermarkets", "intermundomedia", "interstitial", "intext",
                "invitemedia", "ipinyou", "ipro", "iprom",
                "iprospect", "ironsource", "isocket", "jads",
                "jampp", "jelli", "jetpack", "jivox",
                "jubna", "jump", "junction", "justpremium",
                "kargo", "kenshoo", "kiip", "kiosked",
                "kixer", "komoona", "kontera", "largo",
                "leadbolt", "leadplace", "leady", "ligatus",
                "lijit", "linkprice", "linksynergy", "liquidus",
                "liveintent", "liverail", "load", "lockerdome",
                "loggly", "logly", "logrocket", "lomadee",
                "luckyorange", "lunamedia", "lytics", "madads",
                "madvertise", "magnetic", "mailmunch", "mantis",
                "marchex", "marfeel", "marimedia", "marketgid",
                "marfeel", "marin", "marketo", "marfeel",
                "marfeel", "marfeel", "marfeel", "marfeel",
                "marfeel", "marfeel", "marfeel", "marfeel",
                "marfeel", "marfeel", "marfeel", "marfeel",
                "marfeel", "marfeel", "marfeel", "marfeel"
            ]
        },
        // 视频播放器脚本 - 默认不拦截
        "video": {
            name: "视频播放器",
            enabled: false,
            keywords: [
                "video", "player", "youtube", "vimeo",
                "dailymotion", "jwplayer", "videojs", "flowplayer",
                "brightcove", "kaltura", "wistia", "plyr",
                "mediaelement", "clappr", "shaka", "dash",
                "hls", "mpeg-dash", "html5video", "flv",
                "rtmp", "webrtc", "stream", "playback",
                "embed", "iframe", "player.js", "video-js",
                "jw-platform", "bitmovin", "theoplayer", "muvi",
                "contus", "bootstrap", "cine.io", "cloudinary",
                "dacast", "encoding", "francetv", "gumlet",
                "hbbtv", "imagen", "livestream", "matterport",
                "mux", "nexplayer", "octoshape", "palcomp3",
                "pandastream", "panopto", "picarto", "piksel",
                "platform", "qumu", "resonate", "seenow",
                "sproutvideo", "streamable", "streamroot", "ustream",
                "vbrick", "vevo", "vplayed", "vualto",
                "wowza", "zencoder", "zype", "adaptive",
                "bitrate", "codec", "caption", "subtitle",
                "playready", "widevine", "fairplay", "drm"
            ]
        },
        // 社交媒体脚本
        "social": {
            name: "社交媒体",
            enabled: false,
            keywords: [
                "facebook", "twitter", "linkedin", "instagram",
                "pinterest", "whatsapp", "tiktok", "reddit",
                "tumblr", "snapchat", "wechat", "qq",
                "weibo", "vk", "telegram", "discord",
                "slack", "line", "kakao", "mixi",
                "naver", "odnoklassniki", "qzone", "renren",
                "twitch", "viber", "xing", "yelp",
                "flickr", "periscope", "meetup", "goodreads",
                "deviantart", "soundcloud", "spotify", "last.fm",
                "bandcamp", "myspace", "vine", "anchor",
                "clubhouse", "parler", "truth", "gettr",
                "mastodon", "bluesky", "threads", "nextdoor",
                "quora", "medium", "substack", "patreon",
                "onlyfans", "fansly", "ko-fi", "buy me a coffee",
                "cashapp", "venmo", "paypal.me", "gofundme",
                "kickstarter", "indiegogo", "patreon", "subscription",
                "membership", "tip jar", "donate", "support"
            ]
        },
        // 分析和追踪脚本
        "analytics": {
            name: "分析和追踪",
            enabled: true,
            keywords: [
                "analytics", "tracking", "tracker", "statistics",
                "metrics", "monitoring", "measurement", "ga.js",
                "gtag", "gtm", "google-analytics", "googleads",
                "facebook.net", "fbq", "pixel", "beacon",
                "tagmanager", "marketo", "hubspot", "salesforce",
                "pardot", "eloqua", "marketingcloud", "adobe",
                "omniture", "sitecatalyst", "test&target", "audiencemanager",
                "experiencecloud", "dynamic tag management", "ensighten", "tealium",
                "segment", "munchkin", "pardot", "act-on",
                "pardot", "pardot", "pardot", "pardot",
                "pardot", "pardot", "pardot", "pardot",
                "pardot", "pardot", "pardot", "pardot"
            ]
        }
    };
    
    // 获取用户设置
    var enabledDomains = GM_getValue('enabledDomains', '');
    var isEnabledForCurrentDomain = checkIfEnabledForDomain(currentDomain, enabledDomains);
    var rules = GM_getValue('interceptionRules', JSON.stringify(defaultRules));
    
    try {
        rules = JSON.parse(rules);
    } catch(e) {
        rules = defaultRules;
    }
    
    // 注册菜单命令
    if (typeof GM_registerMenuCommand !== 'undefined') {
        // 域名管理菜单
        GM_registerMenuCommand('🌐 为此域名开启拦截: ' + currentDomain, function() {
            enableForCurrentDomain();
        });
        
        GM_registerMenuCommand('🌐 为此域名关闭拦截: ' + currentDomain, function() {
            disableForCurrentDomain();
        });
        
        GM_registerMenuCommand('📋 管理域名白名单', function() {
            manageDomains();
        });
        
        // 规则管理菜单
        GM_registerMenuCommand('⚙️ 拦截规则设置', function() {
            manageRules();
        });
        
        GM_registerMenuCommand('📊 查看拦截统计', function() {
            showStatistics();
        });
        
        GM_registerMenuCommand('ℹ️ 当前状态', function() {
            showCurrentStatus();
        });
    }
    
    // 拦截统计
    var blockedCount = {
        total: 0,
        byType: {
            ads: 0,
            video: 0,
            social: 0,
            analytics: 0,
            other: 0
        }
    };
    
    // 检查当前域名是否在白名单中
    function checkIfEnabledForDomain(domain, enabledDomainsStr) {
        if (!enabledDomainsStr) return false;
        
        var domains = enabledDomainsStr.split(';');
        for (var i = 0; i < domains.length; i++) {
            var pattern = domains[i].trim();
            if (!pattern) continue;
            
            // 正则表达式匹配
            if (pattern.startsWith('/') && pattern.endsWith('/')) {
                try {
                    var regex = new RegExp(pattern.slice(1, -1));
                    if (regex.test(domain)) {
                        return true;
                    }
                } catch (e) {
                    console.error('无效的正则表达式:', pattern, e);
                }
            } 
            // 通配符匹配
            else if (pattern.includes('*')) {
                var regexPattern = '^' + pattern.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$';
                try {
                    var regex = new RegExp(regexPattern);
                    if (regex.test(domain)) {
                        return true;
                    }
                } catch (e) {
                    console.error('无效的通配符模式:', pattern, e);
                }
            }
            // 精确匹配
            else if (domain === pattern) {
                return true;
            }
        }
        return false;
    }
    
    // 检查脚本是否匹配拦截规则
    function shouldBlockScript(scriptSrc, scriptContent) {
        if (!scriptSrc && !scriptContent) return {block: false, type: null};
        
        var textToCheck = (scriptSrc || '').toLowerCase() + ' ' + (scriptContent || '').toLowerCase();
        
        // 检查每个启用的规则
        for (var ruleId in rules) {
            var rule = rules[ruleId];
            if (rule.enabled && rule.keywords) {
                for (var i = 0; i < rule.keywords.length; i++) {
                    var keyword = rule.keywords[i].toLowerCase();
                    if (textToCheck.includes(keyword)) {
                        return {block: true, type: ruleId, keyword: keyword};
                    }
                }
            }
        }
        
        return {block: false, type: null};
    }
    
    // 为当前域名启用拦截
    function enableForCurrentDomain() {
        var currentDomains = GM_getValue('enabledDomains', '');
        var domains = currentDomains ? currentDomains.split(';') : [];
        
        if (!domains.includes(currentDomain)) {
            domains.push(currentDomain);
            GM_setValue('enabledDomains', domains.join(';'));
            alert('已为域名 "' + currentDomain + '" 启用JavaScript拦截功能\n页面将重新加载');
            location.reload();
        } else {
            alert('此域名已在白名单中');
        }
    }
    
    // 为当前域名禁用拦截
    function disableForCurrentDomain() {
        var currentDomains = GM_getValue('enabledDomains', '');
        if (!currentDomains) {
            alert('此域名不在白名单中');
            return;
        }
        
        var domains = currentDomains.split(';');
        var index = domains.indexOf(currentDomain);
        
        if (index !== -1) {
            domains.splice(index, 1);
            GM_setValue('enabledDomains', domains.join(';'));
            alert('已从域名白名单中移除 "' + currentDomain + '"\n页面将重新加载');
            location.reload();
        } else {
            alert('此域名不在白名单中');
        }
    }
    
    // 管理域名白名单
    function manageDomains() {
        var currentDomains = GM_getValue('enabledDomains', '');
        var domains = currentDomains ? currentDomains.split(';') : [];
        
        var message = '当前启用了拦截的域名:\n\n';
        if (domains.length === 0) {
            message += '（无）\n\n';
        } else {
            domains.forEach(function(domain, index) {
                message += (index + 1) + '. ' + domain + '\n';
            });
            message += '\n';
        }
        
        message += '请输入要执行的操作：\n';
        message += '1. 添加新域名（输入域名）\n';
        message += '2. 删除域名（输入要删除的编号）\n';
        message += '3. 使用通配符（如 *.example.com）\n';
        message += '4. 使用正则表达式（如 /.*\\.example\\.com/）\n';
        message += '取消或留空不执行任何操作';
        
        var input = prompt(message, '');
        
        if (input === null || input.trim() === '') {
            return;
        }
        
        if (/^\d+$/.test(input.trim())) {
            var indexToRemove = parseInt(input.trim()) - 1;
            if (indexToRemove >= 0 && indexToRemove < domains.length) {
                var removedDomain = domains[indexToRemove];
                domains.splice(indexToRemove, 1);
                GM_setValue('enabledDomains', domains.join(';'));
                alert('已移除域名: ' + removedDomain + '\n页面将重新加载');
                location.reload();
            } else {
                alert('无效的编号');
            }
        } else {
            var newDomain = input.trim();
            if (!domains.includes(newDomain)) {
                domains.push(newDomain);
                GM_setValue('enabledDomains', domains.join(';'));
                alert('已添加域名: ' + newDomain + '\n页面将重新加载');
                location.reload();
            } else {
                alert('此域名已在白名单中');
            }
        }
    }
    
    // 管理拦截规则
    function manageRules() {
        var message = '请选择要管理的拦截规则：\n\n';
        var ruleIndex = 1;
        var ruleMap = {};
        
        for (var ruleId in rules) {
            var rule = rules[ruleId];
            ruleMap[ruleIndex] = ruleId;
            message += ruleIndex + '. ' + rule.name + ' (' + (rule.enabled ? '✅ 已启用' : '❌ 已禁用') + ')\n';
            ruleIndex++;
        }
        
        message += '\n' + ruleIndex + '. 添加自定义规则\n';
        ruleMap[ruleIndex] = 'custom';
        
        message += '\n请输入规则编号（切换启用状态）或输入新规则名称（添加自定义规则）：';
        
        var input = prompt(message, '');
        
        if (input === null || input.trim() === '') {
            return;
        }
        
        // 检查是否是数字（切换现有规则）
        if (/^\d+$/.test(input.trim())) {
            var selectedIndex = parseInt(input.trim());
            var selectedRuleId = ruleMap[selectedIndex];
            
            if (selectedRuleId === 'custom') {
                addCustomRule();
            } else if (rules[selectedRuleId]) {
                var rule = rules[selectedRuleId];
                rule.enabled = !rule.enabled;
                GM_setValue('interceptionRules', JSON.stringify(rules));
                alert('已' + (rule.enabled ? '启用' : '禁用') + '规则: ' + rule.name + '\n页面将重新加载');
                location.reload();
            }
        } else {
            // 添加新规则
            var newRuleName = input.trim();
            addCustomRule(newRuleName);
        }
    }
    
    // 添加自定义规则
    function addCustomRule(ruleName) {
        if (!ruleName) {
            ruleName = prompt('请输入新规则的名称：', '');
            if (!ruleName) return;
        }
        
        var keywordsInput = prompt('请输入关键词（用逗号分隔）：\n例如：ad,ads,advertising', '');
        if (keywordsInput === null) return;
        
        var keywords = keywordsInput.split(',').map(function(k) {
            return k.trim();
        }).filter(function(k) {
            return k.length > 0;
        });
        
        if (keywords.length === 0) {
            alert('请输入至少一个关键词');
            return;
        }
        
        // 生成规则ID
        var ruleId = 'custom_' + Date.now();
        
        rules[ruleId] = {
            name: ruleName,
            enabled: true,
            keywords: keywords
        };
        
        GM_setValue('interceptionRules', JSON.stringify(rules));
        alert('已添加自定义规则: ' + ruleName + '\n页面将重新加载');
        location.reload();
    }
    
    // 显示拦截统计
    function showStatistics() {
        var message = '拦截统计信息：\n\n';
        message += '总拦截数：' + blockedCount.total + '\n\n';
        message += '按类型统计：\n';
        
        for (var type in blockedCount.byType) {
            if (blockedCount.byType[type] > 0) {
                var typeName = getTypeName(type);
                message += typeName + '：' + blockedCount.byType[type] + '\n';
            }
        }
        
        if (blockedCount.total === 0) {
            message += '\n暂无拦截记录';
        }
        
        alert(message);
    }
    
    // 获取类型名称
    function getTypeName(type) {
        var names = {
            'ads': '广告脚本',
            'video': '视频播放器',
            'social': '社交媒体',
            'analytics': '分析追踪',
            'other': '其他'
        };
        return names[type] || type;
    }
    
    // 显示当前状态
    function showCurrentStatus() {
        var currentDomains = GM_getValue('enabledDomains', '');
        var domains = currentDomains ? currentDomains.split(';') : [];
        
        var message = '智能JavaScript拦截器状态\n\n';
        message += '当前域名：' + currentDomain + '\n';
        message += '拦截状态：' + (isEnabledForCurrentDomain ? '✅ 已启用' : '❌ 未启用') + '\n\n';
        
        if (domains.length > 0) {
            message += '白名单中的域名：\n';
            domains.forEach(function(domain, index) {
                var prefix = (domain === currentDomain) ? '✓ ' : '  ';
                message += prefix + (index + 1) + '. ' + domain + '\n';
            });
            message += '\n';
        }
        
        message += '启用的拦截规则：\n';
        var enabledRulesCount = 0;
        for (var ruleId in rules) {
            if (rules[ruleId].enabled) {
                enabledRulesCount++;
                message += '✓ ' + rules[ruleId].name + '\n';
            }
        }
        
        if (enabledRulesCount === 0) {
            message += '（无启用的规则）\n';
        }
        
        alert(message);
    }
    
    // 只在当前域名在白名单中时才执行拦截逻辑
    if (!isEnabledForCurrentDomain) {
        return;
    }
    
    // ============================
    // 以下是JavaScript拦截逻辑
    // ============================
    
    // 监听DOM变化
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeName === 'SCRIPT') {
                    var src = node.src || '';
                    var content = node.textContent || '';
                    var result = shouldBlockScript(src, content);
                    
                    if (result.block) {
                        blockedCount.total++;
                        blockedCount.byType[result.type || 'other']++;
                        console.log('已拦截脚本（' + getTypeName(result.type) + '）：', src || content.substring(0, 100));
                        node.remove();
                    }
                }
            });
        });
    });
    
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
    
    // 移除现有脚本
    document.addEventListener('DOMContentLoaded', function() {
        var scripts = document.querySelectorAll('script');
        scripts.forEach(function(script) {
            var src = script.src || '';
            var content = script.textContent || '';
            var result = shouldBlockScript(src, content);
            
            if (result.block) {
                blockedCount.total++;
                blockedCount.byType[result.type || 'other']++;
                console.log('已拦截脚本（' + getTypeName(result.type) + '）：', src || content.substring(0, 100));
                script.remove();
            }
        });
    });
    
    // 阻止通过document.write添加的脚本
    var oldWrite = document.write;
    document.write = function(content) {
        // 过滤掉匹配拦截规则的script标签
        var filteredContent = content.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, function(match, scriptContent) {
            // 提取src属性
            var srcMatch = match.match(/src\s*=\s*["']([^"']+)["']/i);
            var src = srcMatch ? srcMatch[1] : '';
            var result = shouldBlockScript(src, scriptContent);
            
            if (result.block) {
                blockedCount.total++;
                blockedCount.byType[result.type || 'other']++;
                console.log('已拦截document.write脚本（' + getTypeName(result.type) + '）');
                return '';
            }
            return match;
        });
        
        oldWrite.call(document, filteredContent);
    };
    
    // 拦截document.writeln
    var oldWriteln = document.writeln;
    document.writeln = function(content) {
        document.write(content + '\n');
    };
    
    // 拦截通过innerHTML添加的脚本
    var originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
    if (originalInnerHTML && originalInnerHTML.set) {
        Object.defineProperty(Element.prototype, 'innerHTML', {
            set: function(value) {
                var filteredValue = value.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, function(match, scriptContent) {
                    var srcMatch = match.match(/src\s*=\s*["']([^"']+)["']/i);
                    var src = srcMatch ? srcMatch[1] : '';
                    var result = shouldBlockScript(src, scriptContent);
                    
                    if (result.block) {
                        blockedCount.total++;
                        blockedCount.byType[result.type || 'other']++;
                        console.log('已拦截innerHTML脚本（' + getTypeName(result.type) + '）');
                        return '';
                    }
                    return match;
                });
                
                originalInnerHTML.set.call(this, filteredValue);
            },
            get: function() {
                return originalInnerHTML.get.call(this);
            }
        });
    }
    
    // 拦截动态创建的script元素
    var originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
        var element = originalCreateElement.call(document, tagName);
        
        if (tagName.toLowerCase() === 'script') {
            // 拦截src属性设置
            var originalSrcDescriptor = Object.getOwnPropertyDescriptor(element, 'src');
            if (!originalSrcDescriptor) {
                originalSrcDescriptor = {
                    configurable: true,
                    enumerable: true,
                    writable: true,
                    value: ''
                };
            }
            
            Object.defineProperty(element, 'src', {
                set: function(value) {
                    var result = shouldBlockScript(value, '');
                    if (result.block) {
                        blockedCount.total++;
                        blockedCount.byType[result.type || 'other']++;
                        console.log('已拦截动态脚本（' + getTypeName(result.type) + '）：', value);
                        return;
                    }
                    originalSrcDescriptor.value = value;
                },
                get: function() {
                    return originalSrcDescriptor.value;
                },
                configurable: true,
                enumerable: true
            });
        }
        
        return element;
    };
    
})();