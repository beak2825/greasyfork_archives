// ==UserScript==
// @name         牛牛查求职助手-招聘网站信息增强工具
// @namespace    http://c1gstudio.com/
// @version      1.3
// @homepage     https://blog.c1gstudio.com/
// @supportURL   https://github.com/andychu46/niuniuchajobhunting
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAACeElEQVQ4jW2TS0hUYRTHf+d6aWZ8TDa+Hzk+kkQqCUJbFGXYIjCzNgVCSBG0aeEi27Vo12NR5KJFIEFaG4PouYnAkh5WFBET5WNoJnMcxvHF6Dhz79fi3hlH8GzO4Tvf/3yH////iVKmAgAB7BJhfagN+latKRRKqYxLG4HJAFpnFgZ0QVCY6amxeJxsh5P+d494HfmChrC/cDdn954gFl/GtcmBiAZib5A5fWYuQm//VfyhILfGBvhVM4Wv5i83xweZDAXp7b9OeH4WUIgNFaVMpZSJSBbfJnwYpsmdlw9BwJ2bAwgLi4uAcP7IKTSEptoGCyyCDgpE+D3l50dgjMcfXnGt+yJlnkIC4X+AsLWolKlImEv3btDR0kaOK5v6cq/FgcWJQhBM02TPth14i8u5MthHT+cZ7r4fYnj0K07NQW1lFaZpZNAsiKkMhVKICPOxJfqeDlBdXIGu69z//oTYPqE+z8u8sYQvOM5lZzfHm9tAQNJMICgFblcuFVuK6TrYTn2pF39RiMb8OnpKurhQeBJvRRnPIyOISFpdTeyFRDREBE3L4k94msaqOkDxc8XP5Mo0geQM4eTcmivE8o6uULYxTEQET56bB8PPmAgFiEfjeJryeBP7iAK0qHCs5ECGEyVlJCsWYkusJhO07mzmdGsHyaHbVIwVMbLyGZe4OFfUTmxxOe1OlVbBjoSRJLIQZTTo4/D2Fjp3tXK05RCpLV98estsPLrO2OsGeHLd5OdvZnUlSENlNWUFxSmxACHb4cRZUGJ/BwFJy2iuuVpMq5l6RTSbHytbilkbiWg2B5LxJRBExKZIUlPWshISiQSGYaDrOv8BNCz+u1A+hJcAAAAASUVORK5CYII=
// @description  在招聘网站职位列表页每个职位添加公司工商信息(天眼查、爱企查、企查查)查询功能，增加额外的职位首发/更新时间，职位详情。支持前程无忧、BOSS直聘、牛企直聘、应届生求职网网站。
// @author       c1gstudio
// @match        *://we.51job.com/*
// @match        *://www.zhipin.com/*
// @match        *://campus.niuqizp.com/*
// @match        *://q.yingjiesheng.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @copyright 2025, awpb46 (https://openuserjs.org/users/awpb46)
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/549140/%E7%89%9B%E7%89%9B%E6%9F%A5%E6%B1%82%E8%81%8C%E5%8A%A9%E6%89%8B-%E6%8B%9B%E8%81%98%E7%BD%91%E7%AB%99%E4%BF%A1%E6%81%AF%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/549140/%E7%89%9B%E7%89%9B%E6%9F%A5%E6%B1%82%E8%81%8C%E5%8A%A9%E6%89%8B-%E6%8B%9B%E8%81%98%E7%BD%91%E7%AB%99%E4%BF%A1%E6%81%AF%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 常量定义 ====================
    const SCRIPT_NAME = '牛牛查求职助手';
    const DEBUG = false;
    
    // 日期颜色配置
    const DATE_COLORS = {
        fresh: '#4CAF50',    // 7天内-绿色
        recent: '#2196F3',   // 14天内-蓝色  
        normal: '#FFC107',   // 2个月内-黄色
        old: '#F44336',      // 3个月内-红色
        expired: '#9E9E9E'   // 3个月以上-灰色
    };
    
    // 查询服务配置
    const QUERY_SERVICES = [
        { name: '🔍 百度', url: 'https://www.baidu.com/s?wd=' },
        { name: '👁️ 天眼查', url: 'https://www.tianyancha.com/search?key=' },     
        { name: '📊 爱企查', url: 'https://aiqicha.baidu.com/s?t=0&q=' },           
        { name: '🏢 企查查', url: 'https://www.qcc.com/web/search?key=' }
    ];

    
    // ==================== 公司名单数据库 ====================
    const COMPANY_BLACKLISTS = {
        // 诈骗公司名单，请自行完善
        scam: {
            name: '诈骗',
            emoji: '⚠️',
            color: '#FF5722', // 红色警告
            companies: [
                '华安', '虚假投资', '假冒银行',
                '假冒政府', '假冒公安', '假冒快递', '假冒客服', '刷单诈骗',
                '贷款诈骗', '兼职诈骗', '投资诈骗', '理财诈骗', '炒股诈骗',
                '外汇诈骗', '期货诈骗', '比特币诈骗', '虚拟货币诈骗',
                '网恋诈骗', '交友诈骗', '婚恋诈骗', '征婚诈骗'
            ]
        },
        
        // 外包公司名单,由AI生成，请自定义
        outsourcing: {
            name: '外包', 
            emoji: '🔄',
            color: '#FF9800', // 橙色提醒
            companies: [
            "软通动力", "中软国际", "中科软文", "博彦科技", "易思博", 
            "润和软件", "佰钧成", "睿服科技", "亿达信", "微创软件", 
            "招银云创", "拓维云创", "华为od", "德科信息", "外企德科", 
            "深劳人力", "拓保软件", "法本信息", "腾云悦智", "腾云忆想", 
            "汇合发展", "神州信息", "网新新思", "东华软件", "音佇自联想云领", 
            "金证科技", "平安金服", "前海金信", "中盛瑞达", "东软集团", 
            "格创东智", "安韦尔", "奥博特", "汉克时代", "易宝软件", 
            "讯方技术股份", "四川准达", "诚迈科技", "柯莱特集团", "联愬利泰", 
            "神州新桥", "神州数码", "科锐国际麦亚信", "青橄榄", "马衡达", 
            "京北方", "四方精创", "宇信科技", "橙色魔方", "华通科技", 
            "文思海辉", "海隆软件", "启明软件", "神州信息", "神州数码", 
            "神州泰岳", "神州通誉", "亚信联创", "法本信息", "上海中和", 
            "纬创软件", "中软国际", "软通动力", "柯莱特", "上海新致软件", 
            "上海晟欧", "浪潮软件", "北京汉克时代", "博彦科技", "大连华信", 
            "信华信", "华信泛亚信息技术", "同方鼎欣", "易思博", "迪原创新", 
            "中讯软件", "睿服科技", "晟峰软件", "卓越际联", "杭州颐和科技", 
            "恒生电子", "联和利泰", "阳光雨露", "宏智科技", "华道数据处理", 
            "北京中恒博瑞", "江苏欧索软件", "经纬国际", "北京护航", "杭州七凌科技", 
            "北京华胜天成", "北京尖峰", "北京开运联合", "亿达信息", "立思辰科技", 
            "赛迪通呼叫中心", "盛安德", "泛微软件", "新聚思", "在信汇通", 
            "中科创达", "博朗软件", "创博国际", "华拓数码", "大宇宙信息", 
            "大展科技", "第一线安莱", "东南融通", "福瑞博德", "富基融通", 
            "富士通信息", "某德软件", "广东迅维", "九城关贸", "武汉佰钧", 
            "开运联合", "联迪恒星", "联合信息", "凌志软件", "普联软件", 
            "千方科技", "日电卓越", "赛科斯", "北明全程物流", "中盈蓝海", 
            "上海海隆", "杭州斯凯网络", "四川汉科", "索迪斯", "通动力信息", 
            "通邮集团", "万国数据服务", "上海微创软件", "西安诺赛软件", "西安炎兴", 
            "新宇软件", "信必优", "信雅达", "药明康德", "音泰思", 
            "英极软件开发", "北京永新视博", "北京灵信互动", "中网在线", "中创软件", 
            "宇信易诚", "浙大网新"
            ]
        },
        
        // 培训公司名单, 由AI生成，请自定义
        training: {
            name: '培训', 
            emoji: '📚',
            color: '#2196F3', // 蓝色信息
            companies: [
                '达内', '传智播客', '黑马程序员', '尚硅谷', '千锋教育',
                '动力节点', '马士兵教育', '咕泡学院', '拉勾教育', '开课吧',
                '极客时间', '慕课网', '实验楼', 'CSDN学院', '51CTO学院',
                '腾讯课堂', '网易云课堂', '中公教育', '华图教育', '粉笔教育',
                '高顿教育', '尚德机构', '环球网校', '新东方在线', '学而思网校',
                '猿辅导', '作业帮', 'VIPKID', '掌门1对1', '跟谁学',
                '火花思维', '豌豆思维', '编程猫', '小码王', '核桃编程',
                '优就业', 'IT培训', '软件培训', '编程培训', '计算机培训',
                '互联网培训', 'Java培训', 'Python培训', '前端培训', 'UI培训',
                '测试培训', '运维培训', '大数据培训', '人工智能培训', '区块链培训'
            ]
        },
        
        // 自定义警告名单（可根据需要添加）
        custom: {
            name: '自定义',
            emoji: '🚨',
            color: '#9C27B0', // 紫色自定义
            companies: [
                // 可以根据个人经验添加需要注意的公司
                '996公司', '福报公司', '无薪加班', '克扣工资', '拖欠工资',
                '无五险一金', '试用期陷阱', '霸王条款', '违法解约',
                '虚假宣传', '夸大职位', '低薪高要求', '频繁加班'
            ]
        }
    };


    // 网站配置对象，存储不同网站的选择器和API信息
    const siteConfigs = {
        'we.51job.com': {
            companyNameSelector: '.joblist-item-bot .bl > a',
            jobListSelector: '.joblist-item > div',
            jobTitleSelector: '.joblist-item-top > .jname',
            hrInfoSelector: '.chat',
            apiPatterns: [
                '/api/job/search-pc'
            ],
            waitForElement: 'div.joblist',
            enableUrlChangeMonitoring: true,
            companyNameFromElement: function(el) { return el.textContent.trim(); }
        },
        'www.zhipin.com': {
            companyNameSelector: '.job-card-footer > .boss-info > .boss-name',
            jobListSelector: '.job-card-box',
            jobTitleSelector: '.job-name',
            hrInfoSelector: '.info-company .info-public, .job-author .name',
            apiPatterns: [
                '/wapi/zpgeek/search/joblist.json',
                '/wapi/zpgeek/pc/recommend/job/list.json'  
            ],
            waitForElement: 'div.recommend-result-job',
            enableUrlChangeMonitoring: true,
            companyNameFromElement: function(el) { return el.textContent.trim(); }
        },
        'campus.niuqizp.com': {
            companyNameSelector: '.detail-title-campus',
            jobListSelector: '',
            jobTitleSelector: '.job-name',
            hrInfoSelector: '',
            apiPatterns: [],
            waitForElement: '.job-detail',
            detailContentSelector: '.job-detail',
            detailMoreLayer: '.job-meta',
            detailCompanyName: '.detail-title-campus',
            detailOutLink: 'a.jshow_link_c',
            enableUrlChangeMonitoring: false,
            companyNameFromElement: function(el) { return el.textContent.trim(); }
        },
        'q.yingjiesheng.com': {
            companyNameSelector: 'div.left-detail-company',
            jobListSelector: '.search-list-item-wrapper',
            jobTitleSelector: 'div.left-title-name',
            hrInfoSelector: '',
            apiPatterns: [
                '/open/noauth/job/intern',
                '/open/noauth/job-v2/recommend',
                '/open/noauth/job/search'
            ],
            waitForElement: '.search-list',
            detailContentSelector: 'div.detail-content',
            detailMoreLayer: '.detail-title-left-center',
            detailCompanyName: '.detail-content-compnav-center',
            detailOutLink: 'a.jshow_link_c',
            enableUrlChangeMonitoring: false,
            companyNameFromElement: function(el) { return el.textContent.trim(); }
        }        
    };

    // ==================== 初始化配置 ====================
    const initConfig = {
        initialLoadDelay: 1500,     // 初始加载延迟(ms)
        enableApiInterception: true, // 是否启用API拦截
        maxInitialRetries: 3,       // 最大初始重试次数
        retryInterval: 1000,        // 重试间隔(ms)
        showTipButton: true         // 是否显示功能提示按钮
    };

    const logger = {
        log: (...args) => DEBUG && console.log(`[${SCRIPT_NAME}]`, ...args),
        warn: (...args) => console.warn(`[${SCRIPT_NAME}]`, ...args),
        error: (...args) => console.error(`[${SCRIPT_NAME}]`, ...args)
    };   
    // ==================== 全局变量 ====================
    const currentHost = window.location.hostname;
    const urlObj = new URL(window.location.href);
    const pathname = urlObj.pathname;
    // 获取url目录部分
    const pathDirectory = pathname.replace(/\/[^\/]*$/, '');

    const config = siteConfigs[currentHost];
    let apiData = [];

    if (!config) {
        logger.warn('未找到匹配的配置，当前主机名:', currentHost);
        return;
    }

    logger.log('脚本启动，当前主机和URL目录部分:', currentHost,pathDirectory);

    if (initConfig.enableApiInterception && config.apiPatterns?.length) {
        interceptAPIRequests();
    }

    // ==================== 样式定义 ====================
    GM_addStyle(`
        .niuniu_company-query-layer{display:inline-flex;align-items:center;margin-left:12px;position:relative;z-index:99}
        .niuniu_company-query-btn{display:inline-flex;align-items:center;justify-content:center;padding:6px 12px;margin:0 4px;border-radius:6px;background:linear-gradient(135deg,#4CAF50 0%,#45a049 100%);color:white;text-decoration:none;font-size:12px;font-weight:500;cursor:pointer;border:none;min-width:60px;transition:all 0.3s cubic-bezier(0.4,0,0.2,1);box-shadow:0 2px 4px rgba(76,175,80,0.3)}
        .niuniu_company-query-btn:hover{background:linear-gradient(135deg,#45a049 0%,#3d8b40 100%);transform:translateY(-1px);box-shadow:0 4px 8px rgba(76,175,80,0.4)}
        .niuniu_company-query-btn:active{transform:translateY(0);box-shadow:0 2px 4px rgba(76,175,80,0.3)}
        .niuniu_query-popup{position:absolute;top:100%;left:0;min-width:120px;background:white;border:1px solid #e0e0e0;border-radius:8px;padding:8px 0;box-shadow:0 8px 24px rgba(0,0,0,0.15);z-index:10000;margin-top:4px;opacity:0;visibility:hidden;transform:translateY(-10px);transition:all 0.3s cubic-bezier(0.4,0,0.2,1)}
        .niuniu_query-popup.show{opacity:1;visibility:visible;transform:translateY(0)}
        .niuniu_query-popup a{display:flex;align-items:center;padding:8px 16px;color:#333;text-decoration:none;font-size:13px;transition:all 0.2s ease;border-bottom:1px solid #f5f5f5}
        .niuniu_query-popup a:last-child{border-bottom:none}
        .niuniu_query-popup a:hover{background-color:#f8f9fa;color:#4CAF50}
        .niuniu_company-tag{display:inline-flex;align-items:center;padding:6px 12px;border-radius:12px;color:white;font-size:11px;font-weight:600;margin-right:8px;white-space:nowrap;text-shadow:0 1px 2px rgba(0,0,0,0.2);animation:companyTagFadeIn 0.3s ease-in-out}
        .niuniu_company-tag.scam{background:linear-gradient(135deg,#FF5722 0%,#D32F2F 100%);border:1px solid #D32F2F;box-shadow:0 2px 4px rgba(255,87,34,0.3)}
        .niuniu_company-tag.outsourcing{background:linear-gradient(135deg,#FF9800 0%,#F57C00 100%);border:1px solid #F57C00;box-shadow:0 2px 4px rgba(255,152,0,0.3)}
        .niuniu_company-tag.training{background:linear-gradient(135deg,#2196F3 0%,#1976D2 100%);border:1px solid #1976D2;box-shadow:0 2px 4px rgba(33,150,243,0.3)}
        .niuniu_company-tag.custom{background:linear-gradient(135deg,#9C27B0 0%,#7B1FA2 100%);border:1px solid #7B1FA2;box-shadow:0 2px 4px rgba(156,39,176,0.3)}
        @keyframes companyTagFadeIn{from{opacity:0;transform:scale(0.8)}to{opacity:1;transform:scale(1)}}
        .niuniu_job-info-layer{display:flex;flex-direction:column;gap:8px;padding:8px;background:linear-gradient(135deg,#f8f9fa 0%,#e9ecef 100%);border-radius:8px;margin:8px 0;font-size:13px;border-left:4px solid #4CAF50;box-shadow:0 2px 4px rgba(0,0,0,0.05)}
        .niuniu_job-info-row{display:flex;align-items:left;gap:10px;flex-wrap:wrap}
        .niuniu_company-tags-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;min-height:24px;padding:4px 0;border-top:1px solid rgba(76,175,80,0.1);margin-top:4px}
        .niuniu_company-tags-container{display:flex;align-items:center;margin-left:12px;gap:8px;flex-wrap:wrap;width:100%}
        .niuniu_company-tag-label{font-size:12px;color:#666;font-weight:500;margin-right:8px;white-space:nowrap}
        .niuniu_date-tag{display:inline-flex;align-items:center;padding:4px 8px;border-radius:12px;color:white;font-size:12px;font-weight:500;white-space:nowrap}
        .niuniu_info-tag{display:inline-flex;align-items:center;color:#6c757d;font-size:12px;white-space:nowrap}
        .niuniu_link{display:inline-flex;align-items:center;color:#007bff;text-decoration:none;font-size:12px;cursor:pointer;transition:color 0.2s ease}
        .niuniu_link:hover{color:#0056b3;text-decoration:none}
        @media (max-width:768px){.niuniu_job-info-layer{gap:6px;padding:10px 12px}.niuniu_job-info-row{gap:8px}.niuniu_company-tags-row{gap:6px;padding:3px 0}.niuniu_company-tags-container{gap:6px}.niuniu_company-tag-label{font-size:11px;margin-right:6px}.niuniu_company-query-btn{font-size:11px;padding:4px 8px;min-width:50px}.niuniu_company-tag{font-size:10px;padding:2px 6px}.niuniu_info-tag{font-size:11px}.niuniu_date-tag{font-size:11px;padding:3px 6px}}
        
        .niuniu_feature-modal{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:none;justify-content:center;align-items:center;z-index:10001;backdrop-filter:blur(3px)}
        .niuniu_feature-modal.show{display:flex}
        .niuniu_feature-content{background:linear-gradient(135deg,#ffffff 0%,#f8f9fa 100%);border-radius:16px;padding:30px;max-width:600px;max-height:80vh;overflow-y:auto;box-shadow:0 20px 40px rgba(0,0,0,0.2);transform:scale(0.8);transition:all 0.3s cubic-bezier(0.4,0,0.2,1);position:relative;border:1px solid rgba(76,175,80,0.2)}
        .niuniu_feature-modal.show .niuniu_feature-content{transform:scale(1)}
        .niuniu_feature-header{text-align:center;margin-bottom:25px;padding-bottom:20px;border-bottom:2px solid #e9ecef}
        .niuniu_feature-title{font-size:24px;font-weight:bold;color:#2c3e50;margin-bottom:8px;background:linear-gradient(135deg,#4CAF50 0%,#45a049 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .niuniu_feature-subtitle{font-size:14px;color:#6c757d;margin:0}
        .niuniu_feature-section{margin-bottom:25px}
        .niuniu_feature-section h3{font-size:18px;color:#2c3e50;margin-bottom:15px;display:flex;align-items:center;gap:8px}
        .niuniu_feature-list{list-style:none;padding:0;margin:0}
        .niuniu_feature-list li{padding:8px 0;color:#495057;font-size:14px;line-height:1.6;display:flex;align-items:flex-start;gap:10px}
        .niuniu_feature-close{position:absolute;top:15px;right:20px;background:none;border:none;font-size:24px;color:#6c757d;cursor:pointer;padding:5px;border-radius:50%;transition:all 0.3s ease;width:35px;height:35px;display:flex;align-items:center;justify-content:center}
        .niuniu_feature-close:hover{background:#f8f9fa;color:#e74c3c;transform:rotate(90deg)}
        .niuniu_feature-highlight{background:linear-gradient(135deg,#fff3cd 0%,#ffeaa7 100%);border-left:4px solid #ffc107;padding:15px;border-radius:8px;margin-top:15px}
        @media (max-width:768px){.niuniu_feature-content{margin:20px;padding:20px;max-width:calc(100% - 40px)}.niuniu_feature-title{font-size:20px}.niuniu_feature-section h3{font-size:16px}}
    `);



    
    function setupGlobalErrorHandling() {
        window.addEventListener('error', function(event) {
            if (event.error && event.error.message && 
                event.error.message.includes('牛牛查')) {
                logger.error('全局错误捕获:', {
                    message: event.error.message,
                    filename: event.filename,
                    lineno: event.lineno,
                    colno: event.colno,
                    stack: event.error.stack
                });
            }
        });
        window.addEventListener('unhandledrejection', function(event) {
            if (event.reason && event.reason.message && 
                event.reason.message.includes('牛牛查')) {
                logger.error('未处理的Promise拒绝:', event.reason);
            }
        });
        logger.log('全局错误处理器已设置');
    }
  

    function checkCompanyBlacklist(companyName) {
        if (!companyName) return [];
        
        const matches = [];
        const normalizedCompanyName = companyName.toLowerCase().replace(/\s+/g, '');
        
        // 遍历所有黑名单类型
        Object.keys(COMPANY_BLACKLISTS).forEach(function(listType) {
            const blacklist = COMPANY_BLACKLISTS[listType];
            
            // 模糊匹配公司名称，记录匹配到的关键词
            const matchedKeywords = [];
            blacklist.companies.forEach(function(blacklistedCompany) {
                const normalizedBlacklisted = blacklistedCompany.toLowerCase().replace(/\s+/g, '');
                
                // 双向模糊匹配
                if (normalizedCompanyName.includes(normalizedBlacklisted) || 
                    normalizedBlacklisted.includes(normalizedCompanyName)) {
                    matchedKeywords.push(blacklistedCompany);
                }
            });
            
            if (matchedKeywords.length > 0) {
                matches.push({
                    type: listType,
                    name: blacklist.name,
                    emoji: blacklist.emoji,
                    color: blacklist.color,
                    matchedKeywords: matchedKeywords,
                    companyName: companyName
                });
                logger.log('牛牛查求职助手: 发现匹配公司', companyName, '->', blacklist.name);
            }
        });
        return matches;
    }
    

    function createCompanyTag(matchInfo) {
        const tag = document.createElement('span');
        tag.className = `niuniu_company-tag ${matchInfo.type}`;
        
        // 显示匹配到的关键词（最多显示2个）
        const displayKeywords = matchInfo.matchedKeywords.slice(0, 2).join('、');
        const hasMoreKeywords = matchInfo.matchedKeywords.length > 2;
        const keywordText = hasMoreKeywords ? `${displayKeywords}等` : displayKeywords;
        
        tag.textContent = `${matchInfo.emoji} ${matchInfo.name} `;
        
        // 在title中显示所有匹配关键词
        const allKeywords = matchInfo.matchedKeywords.join('、');
        tag.title = `该公司被标记为：${matchInfo.name}类型\n匹配关键词：${allKeywords}\n公司名称：${matchInfo.companyName}`;
        
        tag.style.backgroundColor = matchInfo.color;
        
        // 添加点击事件显示详情
        tag.addEventListener('click', function(e) {
            e.stopPropagation();
            showCompanyTagDetails(matchInfo);
        });
        
        return tag;
    }
    

    function showCompanyTagDetails(matchInfo) {
        const blacklist = COMPANY_BLACKLISTS[matchInfo.type];
        const allKeywords = matchInfo.matchedKeywords.join('、');
        const message = `
公司名称：${matchInfo.companyName}
公司类型：${matchInfo.name}
匹配关键词：${allKeywords}
标记原因：该公司名称匹配了${matchInfo.name}类型名单中的关键词
建议：请谨慎考虑该职位，建议详细了解公司情况后再做决定

匹配规则：模糊匹配公司名称关键词
名单来源：基于公开信息和用户反馈整理

注意：此标记仅供参考，具体情况请自行判断
        `;
        
        alert(message);
    }
    

    function addCompanyTags(companyName) {
        const matches = checkCompanyBlacklist(companyName);
        
        if (matches.length === 0) {
            return null;
        }
        
        const tagContainer = document.createElement('div');
        tagContainer.className = 'niuniu_company-tags-container';
        
        // 添加标签标题
        const tagLabel = document.createElement('span');
        tagLabel.className = 'niuniu_company-tag-label';
        tagLabel.textContent = '🏷️ 公司标签：';
        tagContainer.appendChild(tagLabel);
        
        matches.forEach(function(match) {
            const tag = createCompanyTag(match);
            tagContainer.appendChild(tag);
        });
        
        return tagContainer;
    }
    


    

    function interceptAPIRequests() {
        try {
            logger.log('开始初始化API拦截器...');
            
            // 拦截Fetch API
            const originalFetch = window.fetch;
            if (originalFetch && typeof originalFetch === 'function') {
                // 检查是否已经被牛牛查脚本拦截
                if (originalFetch._niuniuIntercepted) {
                    logger.log('Fetch API已被牛牛查脚本拦截，跳过重复设置');
                } else {
                    window.fetch = function(...args) {
                        const url = args[0] || '';
                        return originalFetch.apply(this, args).then(response => {
                            if (isTargetApi(url)) {
                                logger.log('✅ 拦截到目标API (Fetch):', url);
                                handleApiResponse(response.clone(), url);
                            }
                            return response;
                        }).catch(err => {
                            logger.error('Fetch请求失败:', err);
                            throw err;
                        });
                    };
                    
                    // 标记已拦截
                    window.fetch._niuniuIntercepted = true;
                    
                    logger.log('Fetch API拦截器已设置（增强兼容模式）');
                }
            } else {
                logger.warn('Fetch API不可用或不是函数');
            }

            // 拦截XMLHttpRequest
            interceptXMLHttpRequest();

            logger.log('API拦截器初始化完成');
        } catch (error) {
            logger.error('初始化API拦截器失败:', error);
        }
    }
    

    function interceptXMLHttpRequest() {
        if (XMLHttpRequest.prototype._niuniuIntercepted) {
            logger.log('XMLHttpRequest已被牛牛查脚本拦截，跳过重复设置');
            return;
        }
        
        const originalXHROpen = XMLHttpRequest.prototype.open;
        const originalXHRSend = XMLHttpRequest.prototype.send;
        
        if (typeof originalXHROpen !== 'function' || typeof originalXHRSend !== 'function') {
            logger.warn('XMLHttpRequest原始方法不可用，跳过拦截');
            return;
        }

        XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            this._niuniuUrl = url;
            this._niuniuMethod = method;
            const args = [method, url];
            if (arguments.length > 2 && async !== undefined) args.push(async);
            if (arguments.length > 3 && user !== undefined) args.push(user);
            if (arguments.length > 4 && password !== undefined) args.push(password);
            return originalXHROpen.apply(this, args);
        };

        XMLHttpRequest.prototype.send = function(data) {
            const self = this;
            const oldOnReadyStateChange = this.onreadystatechange;

            this.onreadystatechange = function() {
                if (self.readyState === 4 && self.status === 200) {
                    const url = self._niuniuUrl || '';
                    if (isTargetApi(url)) {
                        logger.log('✅ 拦截到目标API (XHR):', url);
                        try {
                            const responseData = JSON.parse(self.responseText);
                            const processedData = processJobData(url, responseData);
                            apiData = processedData;
                            logger.log('处理后的API数据:', apiData);
                        } catch (parseError) {
                            logger.error('解析API响应失败:', parseError);
                        }
                    }
                }
                
                if (typeof oldOnReadyStateChange === 'function') {
                    oldOnReadyStateChange.apply(this, arguments);
                }
            };

            return originalXHRSend.apply(this, arguments);
        };

        XMLHttpRequest.prototype._niuniuIntercepted = true;
        logger.log('XMLHttpRequest拦截器已设置');
    }
        
    

    async function handleApiResponse(response, url) {
        if (isTargetApi(url)) {
            const data = await response.json();
            const processedData = processJobData(url, data);
            apiData = processedData;
            logger.log('API数据处理完成，数据长度:', Array.isArray(apiData) ? apiData.length : 'not array');
        }
    }
    

    function isTargetApi(url) {
        if (!config.apiPatterns || !Array.isArray(config.apiPatterns)) {
            return false;
        }
        
        return config.apiPatterns.some(pattern => {
            const isMatch = url.includes(pattern);
            if (isMatch) {
                logger.log('API匹配成功:', pattern, '在URL:', url);
            }
            return isMatch;
        });
    }


    function processJobData(url,data) {
        try {
            if (currentHost === 'we.51job.com') {
                return process51JobData(url,data);
            } else if (currentHost === 'q.yingjiesheng.com') {
                return processYingJieShengData(url,data);
            } else if (currentHost === 'www.zhipin.com') {
                try {
                    let urlObj = url.startsWith('http') ? new URL(url) : new URL(url, window.location.origin);
                    const pageParam = urlObj.searchParams.get('page');
                    const page = pageParam ? parseInt(pageParam) : 1;
                    
                    if (page === 1) {
                        logger.log('检测到第一页数据，清空历史数据');
                        apiData = [];
                    }
                } catch (urlError) {
                    logger.error('URL解析失败:', urlError);
                }
                               
                return processBossData(url,data);
            }
            logger.warn('未知的网站类型:', currentHost);
            return [];
        } catch (error) {
            logger.error('处理职位数据失败:', error);
            return [];
        }
    }
    

    function process51JobData(url,data) {
        if (data && data.status === "1" && data.resultbody?.job?.items) {
            logger.log('成功解析到', data.resultbody.job.items.length, '条职位数据');
            return data.resultbody.job.items;
        }
        logger.warn('51job API数据格式不正确:', data);
        return [];
    }
    
    function processYingJieShengData(url,data) {
        logger.log('YingJieSheng API数据:', url);
        if (data && data.status === "1" && data.resultbody?.jobs?.items) {
            logger.log('成功解析到游客可见的', data.resultbody.jobs.items.length, '条职位数据');
            return data.resultbody.jobs.items;
        }else if (data && data.status === "1" && data.resultbody?.joblist?.items) {
            logger.log('成功解析到推荐', data.resultbody.joblist.items.length, '条职位数据');
            return data.resultbody.joblist.items;            
        } else if (data && data.status === "1" && data.resultbody?.searchData?.joblist?.items) {
            logger.log('成功解析到', data.resultbody.searchData.joblist.items.length, '条职位数据');
            return data.resultbody.searchData.joblist.items;
        }
        logger.warn(' YingJieSheng API数据格式不正确:', data);
        return [];
    }

    function processBossData(url,data) { 
        if (data && data.message === "Success" && data.zpData.jobList) {
            logger.log('成功解析到', data.zpData.jobList.length, '条职位数据');
            let joblist = data.zpData.jobList;
            
            if (apiData && apiData.length > 0) {
                let currentMaxIndex = Math.max(...apiData.map(item => item.index || 0));
                joblist.forEach((job, idx) => {
                    job.index = currentMaxIndex + idx + 1;
                });
                apiData.push(...joblist);
                return apiData;
            } else {
                return joblist;
            }
        }
        logger.warn('BOSS直聘 API数据格式不正确:', data);
        return [];
    }


    

    function createCompanyQueryLayer(companyName) {
        const layer = document.createElement('div');
        layer.className = 'niuniu_company-query-layer';

        // 创建主按钮
        const mainBtn = createMainButton(companyName);
        layer.appendChild(mainBtn);

        // 创建弹出层
        const popup = createPopupMenu(companyName);
        layer.appendChild(popup);

        // 绑定事件
        bindPopupEvents(layer, mainBtn, popup, companyName);

        return layer;
    }
    

    function createMainButton(companyName) {
        const btn = document.createElement('span');
        btn.className = 'niuniu_company-query-btn';
        btn.textContent = '🔍 牛牛查公司';
        btn.title = '查询公司信息: ' + companyName;
        return btn;
    }
    

    function createPopupMenu(companyName) {
        const popup = document.createElement('div');
        popup.className = 'niuniu_query-popup';

        QUERY_SERVICES.forEach(service => {
            const link = document.createElement('a');
            link.href = service.url + encodeURIComponent(companyName);
            link.target = '_blank';
            link.textContent = service.name;
            link.addEventListener('click', (e) => {
                e.stopPropagation();
                window.open(link.href, '_blank');
                hidePopup(popup);
            });
            popup.appendChild(link);
        });

        return popup;
    }
    

    function bindPopupEvents(layer, btn, popup, companyName) {
        let hideTimeout;
        
        // 主按钮点击事件
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.open(QUERY_SERVICES[0].url + encodeURIComponent(companyName), '_blank');
        });
        
        // 鼠标悬停显示弹出层
        btn.addEventListener('mouseenter', () => {
            clearTimeout(hideTimeout);
            showPopup(popup);
        });
        
        // 鼠标离开延迟隐藏
        layer.addEventListener('mouseleave', () => {
            hideTimeout = setTimeout(() => hidePopup(popup), 300);
        });
        
        // 鼠标进入取消隐藏
        layer.addEventListener('mouseenter', () => {
            clearTimeout(hideTimeout);
        });
    }
    

    function showPopup(popup) {
        popup.classList.add('show');
    }
    

    function hidePopup(popup) {
        popup.classList.remove('show');
    }

    function showFeatureIntroduction() {
        // 检查是否已存在弹出层
        let modal = document.getElementById('niuniu_feature_modal');
        if (modal) {
            modal.classList.add('show');
            return;
        }
        
        // 创建弹出层
        modal = document.createElement('div');
        modal.id = 'niuniu_feature_modal';
        modal.className = 'niuniu_feature-modal';
        
        modal.innerHTML = `
            <div class="niuniu_feature-content">
                <button class="niuniu_feature-close" onclick="this.closest('.niuniu_feature-modal').classList.remove('show')">×</button>
                
                <div class="niuniu_feature-header">
                    <h2 class="niuniu_feature-title">🏷️ 牛牛查求职助手</h2>
                    <p class="niuniu_feature-subtitle">智能招聘信息增强工具 - 让求职更安全、更高效</p>
                </div>
                
                <div class="niuniu_feature-section">
                    <h3>🎆 核心功能</h3>
                    <ul class="niuniu_feature-list">
                        <li>🏷️ <strong>公司标签系统</strong> - 智能识别诈骗、外包、培训公司，帮您身引风险</li>
                        <li>🔍 <strong>公司信息查询</strong> - 查询公司工商信息，支持天眼查、爱企查等平台</li>
                        <li>📅 <strong>职位时间追踪</strong> - 显示职位首发和更新时间，识别新鲜职位</li>
                        <li>💼 <strong>职位详情增强</strong> - 自动显示学历、经验要求，信息一目了然</li>
                        <li>🔗 <strong>链接智能解码</strong> - 自动解码加密链接，方便查看真实链接地址</li>
                    </ul>
                </div>
                
                <div class="niuniu_feature-section">
                    <h3>🏠 公司标签系统</h3>
                    <ul class="niuniu_feature-list">
                        <li>⚠️ <strong style="color: #FF5722;">诈骗公司</strong> - 红色警告标签，提醒您谨慎对待</li>
                        <li>🔄 <strong style="color: #FF9800;">外包公司</strong> - 橙色提醒标签，了解工作性质</li>
                        <li>📚 <strong style="color: #2196F3;">培训公司</strong> - 蓝色信息标签，识别培训机构</li>
                        <li>🚨 <strong style="color: #9C27B0;">自定义标签</strong> - 紫色标记，支持个性化配置</li>
                    </ul>
                </div>
                
                <div class="niuniu_feature-section">
                    <h3>🚀 特色亮点</h3>
                    <ul class="niuniu_feature-list">
                        <li>🧪 <strong>智能匹配</strong> - 采用模糊匹配算法，精准识别公司类型</li>
                        <li>🌍 <strong>多平台支持</strong> - 兼容 <a href="https://www.51job.com">51job</a>、<a href="https://www.zhipin.com">BOSS直聘</a>、<a href="https://www.niuqizp.com">牛企直聘</a>等招聘平台</li>
                        <li>📱 <strong>响应式设计</strong> - 适配桌面和移动设备，体验一致</li>
                        <li>⚡ <strong>实时更新</strong> - 自动监听页面变化，实时显示信息</li>
                        <li>🔒 <strong>隐私保护</strong> - 本地处理，不收集个人信息</li>
                    </ul>
                </div>
                
                <div class="niuniu_feature-highlight">
                    <strong>💡 使用提示：</strong>
                    点击公司标签可查看详细信息，点击查询按钮可快速跳转到公司信息查询平台。
                    本工具仅供参考，建议结合多种渠道获取公司信息。
                </div>
            </div>
        `;
        
        // 添加到页面
        document.body.appendChild(modal);
        
        // 显示弹出层
        setTimeout(() => {
            modal.classList.add('show');
        }, 100);
        
        // 点击背景关闭
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
        
        // ESC键关闭
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                modal.classList.remove('show');
            }
        });
        
        logger.log('功能介绍弹出层已显示');
    }

    function initTipButton() {
        if (!initConfig.showTipButton) {
            return;
        }
        
        const tipBtn = document.createElement('div');
        tipBtn.innerHTML = '🏷️';
        tipBtn.title = '牛牛查求职助手 ';
        tipBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 20px;
            box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
            z-index: 9998;
            transition: all 0.3s ease;
        `;
        
        tipBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 6px 16px rgba(76, 175, 80, 0.4)';
        });
        
        tipBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.3)';
        });
        
        tipBtn.addEventListener('click', function() {
            showFeatureIntroduction();
        });
        
        document.body.appendChild(tipBtn);
        logger.log('功能提示按钮已加载');
    }

    

    function calculateDaysDifference(date) {
        try {
            let inputDate = parseDate(date);
            
            if (!inputDate || isNaN(inputDate.getTime())) {
                logger.warn('无效的日期输入:', date);
                return 0;
            }
            
            const today = new Date();
            // 标准化时间到当天凌晨
            inputDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);
            
            const diffTime = today - inputDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            return diffDays < 0 ? 0 : diffDays; // 处理未来日期情况
        } catch (error) {
            logger.error('计算日期差值失败:', error);
            return 0;
        }
    }
    

    function parseDate(date) {
        if (date instanceof Date) {
            return new Date(date);
        }
        
        if (typeof date === 'number') {
            return new Date(date);
        }
        
        if (typeof date === 'string') {
            return parseStringDate(date.trim());
        }
        
        return null;
    }
    

    function parseStringDate(dateStr) {
        if (!dateStr) return null;
        
        // 尝试直接解析
        let inputDate = new Date(dateStr);
        if (!isNaN(inputDate.getTime())) {
            return inputDate;
        }
        
        // 尝试提取日期部分
        const datePart = dateStr.split(/[ ,TZ]/)[0].replace(/[^\d-]/g, '');
        inputDate = new Date(datePart);
        
        if (!isNaN(inputDate.getTime())) {
            return inputDate;
        }
        
        // 尝试标准化分隔符
        const normalizedDate = datePart.replace(/[\/./]/g, '-');
        inputDate = new Date(normalizedDate);
        
        if (!isNaN(inputDate.getTime())) {
            return inputDate;
        }
        
        // 尝试重建日期格式
        return reconstructDate(datePart);
    }
    

    function reconstructDate(datePart) {
        const digits = datePart.match(/\d+/g);
        if (!digits || digits.length < 3) {
            return null;
        }
        
        let year, month, day;
        
        if (digits[0].length === 4) {
            [year, month, day] = digits;
        } else if (digits[2].length === 4) {
            [month, day, year] = digits;
        } else {
            [year, month, day] = digits;
        }
        
        const reconstructedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        let inputDate = new Date(reconstructedDate);
        
        // 如果日期无效，尝试交换月和日
        if (isNaN(inputDate.getTime())) {
            const swappedDate = `${year}-${day.padStart(2, '0')}-${month.padStart(2, '0')}`;
            inputDate = new Date(swappedDate);
        }
        
        return isNaN(inputDate.getTime()) ? null : inputDate;
    }


    function getDateStyle(days) {
        if (days <= 7) return DATE_COLORS.fresh;
        if (days <= 14) return DATE_COLORS.recent;
        if (days <= 60) return DATE_COLORS.normal;
        if (days <= 90) return DATE_COLORS.old;
        return DATE_COLORS.expired;
    }

    function processDetailPage(){
        if ( currentHost === 'campus.niuqizp.com'){
            processNiuqizpDetailPage();
        } else if (currentHost === 'q.yingjiesheng.com'){
            processYingjieshengDetailPage();
        }
    }

    function processNiuqizpDetailPage(){
        const detailContainer = document.querySelector(config.detailContentSelector);
        if (!detailContainer) {
            logger.warn('未找到详情页容器元素');
            return;
        }
        const jobmetaContainer = document.querySelector(config.detailMoreLayer);

        let companyNameStr = detailContainer.querySelector(config.detailCompanyName).textContent.trim();
        // 去除年份（2025、2026等）或招聘之后的字符
        companyNameStr = companyNameStr.replace(/(202[0-9]|招聘).*$/, '').trim();
        logger.log(`元素 ${companyNameStr}`);

        let jobData={
                fullCompanyName: companyNameStr,
                jobTitle: null,
                degreeString: null,
                workYearString: null,
                confirmDateString: null,
                updateDateTime: null,
                jobHref: null,
                jobDescribe: null    
        }   
        const infoLayer = createJobInfoLayer(jobData);
        insertInfoLayer(jobmetaContainer, infoLayer);
        
        
        let hrefItems = detailContainer.querySelectorAll(config.detailOutLink);
        logger.log(`链接元素 ${hrefItems.length}`);
        hrefItems.forEach((hrefItem,index) => { 
            try {
                var base64Encoded = hrefItem.getAttribute('ref');
                var hreftext = hrefItem.textContent.trim();
                logger.log(`链接元素 ${hreftext}`);                
                // 进行Base64解码
                var decodedUrl = atob(base64Encoded);
                
                // 移除原有的事件监听器
                const newHrefItem = hrefItem.cloneNode(true);
                hrefItem.parentNode.replaceChild(newHrefItem, hrefItem);
                
                // 替换文本内容和href
                if (hreftext.includes('[点击查看]')){
                    newHrefItem.textContent = decodedUrl;
                }             
                newHrefItem.style = 'border-left:4px solid #4CAF50;border-radius:6px;padding:4px;margin-left:4px;';
                newHrefItem.href = decodedUrl;
                
                // 添加新的点击事件（直接打开链接）
                newHrefItem.addEventListener('click', function(e) {
                    e.preventDefault();
                    window.open(decodedUrl, '_blank');
                });
                
            } catch (error) {
                logger.error(`链接元素${index} Base64解码失败: ${error}`);
            }         
        })
    }

    function processYingjieshengDetailPage(){

        try {
            const loginpop = document.querySelector('div.window-login');
            const loginmask = document.querySelector('div.v-modal');
            const bodydev = document.querySelector('body.pc_body');

            if (loginpop){
                bodydev.classList.remove('el-popup-parent--hidden');
                loginmask.className='v-modal-leave';           
                loginpop.style.display='none';
                logger.log(`关闭登录弹窗元素 ${loginpop?.className}`);
                logger.log(`关闭登录遮罩层 ${loginmask?.className}`);
            }else{
                logger.warn('未找到登录弹窗元素');
            }
        } catch (error) {
            logger.error(`详情页没有登录弹窗: ${error}`);
        }
        try {
            const detailContainer = document.querySelector(config.detailContentSelector);
            if (!detailContainer) {
                logger.warn('未找到详情页容器元素', config.detailContentSelector);
                return;
            }  
            try {
                const jobtext = detailContainer.querySelector('div.text');
                jobtext.style.height = 'auto';
                jobtext.style.overflowY='auto';
                logger.log(`显示详情页隐藏内容 ${jobtext?.className}`);
            } catch (error) {
                logger.error(`详情页没有隐藏内容: ${error}`);
            }
     
            try{
                const jobmask = detailContainer.querySelector('div.mask');
                jobmask.style.display='none';
                logger.log(`关闭详情页遮罩层 ${jobmask?.className}`);   
            } catch (error) {
                logger.error(`详情页没有详情页遮罩层元素: ${error}`);
            }

            let jobmetaContainer=document.querySelector('div.detail-title-left-center');
            let companyNameStr = document.querySelector('div.detail-content-compnav-center').textContent.trim();
            logger.log(`公司名称: ${companyNameStr}`);

            let jobData={
                    fullCompanyName: companyNameStr,
                    jobTitle: null,
                    degreeString: null,
                    workYearString: null,
                    confirmDateString: null,
                    updateDateTime: null,
                    jobHref: null,
                    jobDescribe: null    
            }   
            const infoLayer = createJobInfoLayer(jobData);
            insertInfoLayer(jobmetaContainer, infoLayer);
        } catch (error) {
            logger.error(`详情页没有详情页容器元素: ${error}`);
        }            
    }    

    function CompanyListPreprocess(){
        try{
            const qiuzhaopop = document.querySelector('div.operate-popup');
            if (qiuzhaopop){
                const bodydev = document.querySelector('body.pc_body'); 
                qiuzhaopop.style.display='none';
                logger.log(`关闭列表推广弹窗元素 ${qiuzhaopop?.className}`);
                logger.log(`关闭列表推广遮罩层 ${bodydev?.className}`);                
            }else{
                logger.warn('未找到列表推广弹窗元素');
            }
        } catch (error) {
            logger.error(`未找到列表推广弹窗元素: ${error}`);
        }
    }

    function processCompanyList() {
        CompanyListPreprocess();
        const jobItems = document.querySelectorAll(config.jobListSelector);
        logger.log('DOM找到', jobItems.length, '个职位项目');
 
        jobItems.forEach((jobElement, index) => {
            try {
                if (shouldSkipElement(jobElement, index)) return;      
                const jobData = getJobData(index, jobElement);
                if (!jobData) {
                    logger.warn(`第${index}个职位没有数据`);
                    return;
                }              
                logger.log(`处理职位 ${index}: ${jobData.fullCompanyName}`);
                
                const infoLayer = createJobInfoLayer(jobData);
                insertInfoLayer(jobElement, infoLayer);
                
                markElementAsProcessed(jobElement);
                logger.log(`元素 ${index} 处理完成`);
            } catch (error) {
                logger.error(`处理元素 ${index} 时出错:`, error);
            }
        });
    }
    

    function shouldSkipElement(element, index) {
        if (element.dataset.processed) {
            logger.log(`元素 ${index} 已处理过，跳过`);
            return true;
        }
        return false;
    }

    function process51JobListData(data){
            return {
                fullCompanyName: data['fullCompanyName'],
                jobTitle: data['jobName'],
                degreeString: data['degreeString'],
                workYearString: data['workYearString'],
                confirmDateString: data['confirmDateString'],
                updateDateTime: data['updateDateTime'],
                jobHref: data['jobHref'],
                jobDescribe: data['jobDescribe'],
            };
    }

    function processYingJieShengListData(data){
            return {
                fullCompanyName: data['coname'],
                jobTitle: data['jobname'],
                degreeString: data['degree'],
                workYearString: data['workyear'],
                confirmDateString: data['issuedate'],
                updateDateTime: data['lastupdate'],
                jobHref: data['jumpUrlHttp'],
                jobDescribe: data['jobtag'],
            };
    }

    function processBossListData(data){
            return {
                fullCompanyName: data['brandName'],
                jobTitle: data['jobName'],
                degreeString: data['jobDegree'],
                workYearString: data['jobExperience'],
                confirmDateString: '',
                updateDateTime: '',
                jobHref: '',
                jobDescribe:'',
            };
    }   

    function getJobData(index, jobElement) {
        // 优先使用API数据
        
        if (apiData && apiData[index]) {
            if (currentHost === 'we.51job.com') {
                return process51JobListData(apiData[index]);
            } else if (currentHost === 'q.yingjiesheng.com') {
                return processYingJieShengListData(apiData[index]);
            } else if (currentHost === 'www.zhipin.com') {
                return processBossListData(apiData[index]);
            }              
        }
      
        // 如果API数据不可用，从 DOM 中提取基本信息
        logger.log(`API数据不可用，从 DOM 提取职位 ${index} 的信息`);
        
        try {
            const companyElement = jobElement.querySelector(config.companyNameSelector);
            const jobTitleElement = jobElement.querySelector(config.jobTitleSelector);
            
            const companyName = companyElement ? companyElement.textContent.trim() : `公司${index + 1}`;
            const jobTitle = jobTitleElement ? jobTitleElement.textContent.trim() : `职位${index + 1}`;
            
            // 创建基本数据结构
            return {
                fullCompanyName: companyName,
                jobTitle: jobTitle,
                degreeString: '',
                workYearString: '',
                confirmDateString: null,
                updateDateTime: null,
                jobHref: null,
                jobDescribe: `${companyName} - ${jobTitle}`
            };
        } catch (error) {
            logger.error(`提取职位 ${index} DOM 信息失败:`, error);
            return null;
        }
    }
    

    function createJobInfoLayer(jobData) {
        const infoLayer = document.createElement('div');
        infoLayer.className = 'niuniu_job-info-layer';
        
        // 第一行：公司查询按钮、学历经验信息和时间信息
        const mainRow = document.createElement('div');
        mainRow.className = 'niuniu_job-info-row';
        
        // 添加公司查询按钮
        if (jobData.fullCompanyName) {
            const queryLayer = createCompanyQueryLayer(jobData.fullCompanyName);
            mainRow.appendChild(queryLayer);
        }

        // 添加发布时间
        if (jobData.confirmDateString) {
            const daysDiff = calculateDaysDifference(jobData.confirmDateString);
            const createTimeTag = createDateTag('📅 首发', jobData.confirmDateString, daysDiff);
            mainRow.appendChild(createTimeTag);
        }
        
        // 添加更新时间
        if (jobData.updateDateTime) {
            const updaysDiff = calculateDaysDifference(jobData.updateDateTime);
            const updateInfo = createDateTag('🔄 更新', jobData.updateDateTime, updaysDiff);
            mainRow.appendChild(updateInfo);
        }

        // 添加学历和经验信息
        if (jobData.degreeString || jobData.workYearString){
            const degreeInfo = createInfoTag(
                `🎓 学历: ${jobData.degreeString || '不限'} | 💼 经验: ${jobData.workYearString || '不限'}`,
                'niuniu_info-tag'
            );
            mainRow.appendChild(degreeInfo);
        }
        
        // 添加详情链接
        if (jobData.jobHref) {
            const detailLink = createDetailLink(jobData);
            mainRow.appendChild(detailLink);
        }
        
        infoLayer.appendChild(mainRow);
        
        // 第二行：公司标签（独立显示）
        if (jobData.fullCompanyName) {
            const companyTags = addCompanyTags(jobData.fullCompanyName);
            if (companyTags) {
                const tagsRow = document.createElement('div');
                tagsRow.className = 'niuniu_company-tags-row';
                tagsRow.appendChild(companyTags);
                infoLayer.appendChild(tagsRow);
            }
        }
        return infoLayer;
    }
    

    function createInfoTag(text, className) {
        const tag = document.createElement('span');
        tag.className = className;
        tag.textContent = text;
        return tag;
    }
    

    function createDateTag(label, dateString, daysDiff) {
        const tag = document.createElement('span');
        tag.className = 'niuniu_date-tag';
        tag.textContent = `${label}: ${dateString}`;
        tag.title = `${daysDiff}天前`;
        tag.style.background = getDateStyle(daysDiff);
        return tag;
    }
    

    function createDetailLink(jobData) {
        const link = document.createElement('a');
        link.className = 'niuniu_link';
        link.textContent = '📝 详情';
        link.href = jobData.jobHref;
        link.target = '_blank';
        link.title = jobData.jobDescribe || '查看详细信息';
        return link;
    }
    

    function insertInfoLayer(jobElement, infoLayer) {
        jobElement.parentNode.insertBefore(infoLayer, jobElement.nextSibling);
    }
    

    function markElementAsProcessed(element) {
        element.dataset.processed = 'true';
    }
    

    function initProcessWithRetry(retryCount = 0) {
        try {
            // 设置全局错误处理
            setupGlobalErrorHandling();
            
            // API拦截器已在脚本开始时启动，这里不再重复启动
            // 只是记录一下状态
            console.log('[牛牛查求职助手] initProcessWithRetry - API拦截器已在早期启动');

            setTimeout(() => {
                const testElement = document.querySelector(config.companyNameSelector);
                if (testElement || retryCount >= initConfig.maxInitialRetries) {
                    processPage();
                    logger.log(`初始化处理完成，重试次数: ${retryCount}`);
                } else {
                    logger.log(`未检测到目标元素，将在${initConfig.retryInterval}ms后重试(${retryCount+1}/${initConfig.maxInitialRetries})`);
                    initProcessWithRetry(retryCount + 1);
                }
            }, initConfig.initialLoadDelay);
        } catch (error) {
            logger.error('初始化处理失败:', error);
        }
    }


    function processPage() {
        try {
            logger.log('开始处理页面...');
            
            if (currentHost === 'campus.niuqizp.com' || (currentHost === 'q.yingjiesheng.com' && pathDirectory === '/jobdetail')){
                processDetailPage();
            }else{
                processCompanyList();
                // 设置MutationObserver监听动态加载的内容
                setupMutationObserver();                
            }
            
        } catch (error) {
            logger.error('处理页面时发生错误:', error);
        }
    }
         

    function isScriptOwnChange(mutation) {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
            for (let node of mutation.addedNodes) {
                if (node.nodeType === 1) {
                    if (isScriptElement(node) || 
                        (node.querySelector && node.querySelector('[class*="niuniu_"]'))) {
                        return true;
                    }
                }
            }
        }
        
        if (mutation.target && mutation.target.nodeType === 1) {
            if (isScriptElement(mutation.target) || 
                mutation.target.closest('[class*="niuniu_"]')) {
                return true;
            }
        }
        
        return false;
    }
    

    function isScriptElement(element) {
        if (!element || !element.className) return false;
        
        // 检查类名是否包含脚本标识
        const className = element.className;
        if (typeof className === 'string') {
            return className.includes('niuniu_');
        }
        
        return false;
    }


    function setupMutationObserver() {
        let targetNode = document.querySelector(config.waitForElement);
        logger.log('等待监听的目标元素:', config.waitForElement, targetNode);
        
        if (!targetNode) {
            logger.warn('未找到目标监听元素:', config.waitForElement);
            targetNode = document.body;
        }
        
        if (!targetNode || !targetNode.nodeType || targetNode.nodeType !== Node.ELEMENT_NODE) {
            logger.error('无法找到有效的DOM节点进行监听，延迟重试...');
            setTimeout(() => {
                setupMutationObserver();
            }, 2000);
            return;
        }
        
        let isProcessing = false;
        
        const observer = new MutationObserver((mutations) => {
            if (isProcessing) return;
            
            let hasNewJobs = false;
            
            mutations.forEach(mutation => {
                if (isScriptOwnChange(mutation)) {
                    return;
                }
                
                if (mutation.type === 'childList') {
                    if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === 1 && 
                                (node.matches && node.matches(config.jobListSelector) || 
                                 node.querySelector && node.querySelector(config.jobListSelector))) {
                                hasNewJobs = true;
                            }
                        });
                    }
                }
            });
            
            if (hasNewJobs) {
                logger.log('检测到新职位，开始处理');
                
                isProcessing = true;
                setTimeout(() => {
                    processCompanyList();
                    isProcessing = false;
                }, 1200);
            }
        });
        
        observer.observe(targetNode, {
            childList: true,
            subtree: true
        });
        
        logger.log('已启动MutationObserver监听动态内容');
    }

    $(document).ready(function() {
        logger.log('jQuery已加载，准备启动脚本...');

        setTimeout(() => {
            initProcessWithRetry();
            
            setTimeout(function() {
                initTipButton();
            }, 3000);
        }, 1000);
    });

})();