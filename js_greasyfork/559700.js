// ==UserScript==
// @name         必应搜索增强工具
// @namespace    https://github.com/leekHotline/bing-search-enhancer
// @version      1.0.0
// @description  Bing搜索增强工具 - 智能评分、预览窗口、关键词高亮、一键收藏
// @author       leekHotline
// @match        https://www.bing.com/search*
// @match        https://cn.bing.com/search*
// @license      MIT
// @supportURL   https://github.com/leekHotline/bing-search-enhancer/issues
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559700/%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/559700/%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==


(function(){
    'use strict';
    console.log('Bing Search enhancer start启动...');

/**
 * 配置文件
 */
const CONFIG = {
    SELECTORS: {
        RESULT_LIST: '.b_algo',
        RESULT_TITLE: 'h2 a',
        RESULT_DESC: '.b_caption p, .b_algoSlug, .b_caption .b_paractl',
        RESULT_URL: 'cite',
        MAIN_CONTENT: '#b_content',
        RESULTS_CONTAINER: '#b_results'
    },

    // 广告检测规则
    AD_RULES: {
        // 广告类名关键词
        CLASSES: ['b_ad', 'ad_', 'b_adTop', 'b_adBottom', 'b_adLastChild', 'ads-'],
        
        // 广告文字标记
        TEXTS: ['广告', 'Ad', 'AD', 'Sponsored', '推广', '商业推广', '赞助'],
        
        // 广告域名特征
        AD_DOMAINS: [
            'ads.', 'ad.', 'click.', 'track.', 'redirect.',
            'affiliate.', 'promo.', 'sponsor.'
        ],
        
        // 已知广告主域名（需要持续更新）
        // 已知广告主域名（持续更新中）
        KNOWN_AD_DOMAINS: [
            // 云服务 & AI 平台（你已有的 + 补充）
            'aliyun.com',
            'tencentcloud.com',
            'huaweicloud.com',
            'volcengine.com',
            'baidu.com/promotion', // 注意：这是路径，不是纯域名
            'qcloud.com',
            'jdcloud.com',
            'ucloud.cn',
            'cloud.tencent.com', // 腾讯云子站
            'modelscope.cn',     // 魔搭（阿里）
            'huggingface.co',    // 虽是国际站，但中文搜索常出现推广

            // 电商平台（高频广告）
            'taobao.com',
            'tmall.com',
            'jd.com',
            'pinduoduo.com',
            'xiaohongshu.com',
            'redbook.com',       // 小红书国际域名
            'douyin.com',
            'bytedance.com',
            'meituan.com',
            'ele.me',
            'suning.com',
            'vip.com',           // 唯品会

            // AI 工具 & 编程平台（新兴广告大户）
            'trae.cn',           // Trae（你已有）
            'codegeex.cn',
            'tongyi.aliyun.com',
            'wenxin.baidu.com',
            'spark.adobe.com',   // Adobe Firefly（中文推广多）
            'cursor.sh',         // Cursor（常投 AI 编程广告）
            'continue.dev',
            'v0.dev',
            'replit.com',

            // 在线教育 & 课程推广
            'ke.qq.com',         // 腾讯课堂
            'wangxiao.cn',
            '233.com',
            'koolearn.com',
            'hujiang.com',
            'study.163.com',     // 网易云课堂

            // 企业服务 & SaaS
            'feishu.cn',         // 飞书（含飞书文档/多维表格推广）
            'larkoffice.com',
            'docusaurus.io',     // 技术文档建站（常被推广）
            'cloudbase.net',     // 腾讯云开发
            'leancloud.app',
            'sentry.io',         // 错误监控（开发者广告常见）

            // 其他高频广告主
            'zhihu.com',         // 知乎（有时推课程/盐选）
            'bilibili.com',      // B站（推广会员/课堂）
            'weibo.com',
            'toutiao.com',
            'bdstatic.com',      // 百度静态资源，常用于落地页
            'baiducontent.com'   // 百度联盟广告域名
        ],
                
        // 广告特征：描述中的营销词汇
        MARKETING_WORDS: [
            '立即', '免费试用', '限时', '优惠', '折扣', '官方',
            '点击', '咨询', '注册', '下载', '体验'
        ],
        
        // 营销词阈值：超过此数量判定为广告
        MARKETING_THRESHOLD: 3
    },

    // 评分配置
    SCORING: {
        BASE: 50,
        AD_PENALTY: -80,
        HTTPS: 5,
        KEYWORD_TITLE: 10,
        KEYWORD_DESC: 5,
        
        // 权威域名加分
        AUTHORITY: {
            'github.com': 15,
            'stackoverflow.com': 15,
            'developer.mozilla.org': 12,
            'microsoft.com': 10,
            'wikipedia.org': 10,
            'zhihu.com': 8,
            'juejin.cn': 7,
            'segmentfault.com': 7,
            'csdn.net': 5,
            'cnblogs.com': 5
        },
        
        // 低质量域名扣分
        LOW_QUALITY: ['click.', 'ads.', 'track.', 'redirect.', 'promo.'],
        LOW_QUALITY_PENALTY: -15
    },

    // 预览配置
    PREVIEW: {
        DELAY: 150,          // 悬浮延迟(ms)
        SCALE: 0.35,         // 缩放比例
        WIDTH: 1200,         // 虚拟视口宽度
        HEIGHT: 900,         // 虚拟视口高度
        TIMEOUT: 10000       // 加载超时(ms)
    },

    // 存储键
    STORAGE: {
        PREFS: 'bse_prefs_v2',
        MARKED: 'bse_marked_v2'
    }
};

// 默认偏好
const DEFAULT_PREFS = {
    autoPreview: true,
    highlightKeywords: true,
    showScores: true,
    hideAds: false,
    previewDelay: 150
};

/**
 * 获取偏好设置
 */
function getPrefs() {
    try {
        const saved = localStorage.getItem(CONFIG.STORAGE.PREFS);
        return saved ? { ...DEFAULT_PREFS, ...JSON.parse(saved) } : DEFAULT_PREFS;
    } catch (e) {
        return DEFAULT_PREFS;
    }
}

/**
 * 保存偏好设置
 */
function savePrefs(prefs) {
    try {
        localStorage.setItem(CONFIG.STORAGE.PREFS, JSON.stringify(prefs));
    } catch (e) {}
}

/**
 * 获取收藏列表
 */
function getMarked() {
    try {
        return JSON.parse(localStorage.getItem(CONFIG.STORAGE.MARKED) || '[]');
    } catch (e) {
        return [];
    }
}

/**
 * 保存收藏列表
 */
function saveMarked(list) {
    try {
        localStorage.setItem(CONFIG.STORAGE.MARKED, JSON.stringify(list));
    } catch (e) {}
}

/**
 * 核心逻辑
 */
class SearchCore {
    constructor() {
        this.results = [];
        this.prefs = getPrefs();
        this.keywords = this.extractKeywords();
    }

    /**
     * 智能分词提取关键词
     */
    extractKeywords() {
        const query = new URLSearchParams(window.location.search).get('q') || '';
        
        // 1. 基础分割（空格、逗号、加号等）
        let words = query.toLowerCase().split(/[\s,+，、；;：:]+/);
        
        // 2. 中文智能分词（简单实现）
        const chineseWords = [];
        words.forEach(word => {
            // 检测是否包含中文
            if (/[\u4e00-\u9fa5]/.test(word)) {
                // 提取连续中文作为整体
                const matches = word.match(/[\u4e00-\u9fa5]+/g) || [];
                chineseWords.push(...matches);
                
                // 同时拆分2-4字的组合（简单n-gram）
                matches.forEach(m => {
                    if (m.length >= 4) {
                        for (let i = 0; i < m.length - 1; i++) {
                            chineseWords.push(m.slice(i, i + 2));
                            if (i + 3 <= m.length) {
                                chineseWords.push(m.slice(i, i + 3));
                            }
                        }
                    }
                });
                
                // 提取英文部分
                const engMatches = word.match(/[a-zA-Z]+/g) || [];
                chineseWords.push(...engMatches);
            } else {
                chineseWords.push(word);
            }
        });
        
        // 3. 过滤并去重
        const unique = [...new Set(chineseWords)]
            .filter(w => w.length >= 1)
            .sort((a, b) => b.length - a.length); // 长词优先
        
        console.log('[BSE] 关键词:', unique);
        return unique;
    }

    /**
     * 广告检测（增强版）
     */
    isAd(element) {
        const reasons = [];
        let score = 0; // 广告可能性评分
        
        // === 1. 类名检测 ===
        const classStr = (element.className + ' ' + 
            (element.parentElement?.className || '')).toLowerCase();
        
        for (const adClass of CONFIG.AD_RULES.CLASSES) {
            if (classStr.includes(adClass.toLowerCase())) {
                score += 50;
                reasons.push(`类名: ${adClass}`);
            }
        }
        
        // === 2. 广告标记文字检测 ===
        const fullText = element.textContent || '';
        
        for (const adText of CONFIG.AD_RULES.TEXTS) {
            // 检查常见广告标记格式
            const patterns = [
                new RegExp(`^${adText}\\s`, 'i'),
                new RegExp(`\\[${adText}\\]`, 'i'),
                new RegExp(`【${adText}】`, 'i'),
                new RegExp(`\\(${adText}\\)`, 'i'),
                new RegExp(`（${adText}）`, 'i'),
                new RegExp(`^\\s*${adText}$`, 'im')
            ];
            
            for (const pattern of patterns) {
                if (pattern.test(fullText)) {
                    score += 40;
                    reasons.push(`标记: ${adText}`);
                    break;
                }
            }
        }
        
        // === 3. 域名检测 ===
        const linkEl = element.querySelector('a[href]');
        const url = linkEl?.href || '';
        
        try {
            const hostname = new URL(url).hostname.toLowerCase();
            
            // 已知广告主
            for (const adDomain of CONFIG.AD_RULES.KNOWN_AD_DOMAINS) {
                if (hostname.includes(adDomain) || url.includes(adDomain)) {
                    score += 35;
                    reasons.push(`已知广告主: ${adDomain}`);
                    break;
                }
            }
            
            // 广告域名特征
            for (const adDomain of CONFIG.AD_RULES.AD_DOMAINS) {
                if (hostname.startsWith(adDomain) || hostname.includes('.' + adDomain)) {
                    score += 25;
                    reasons.push(`广告域名: ${adDomain}`);
                    break;
                }
            }
        } catch (e) {}
        
        // === 4. 营销词汇检测 ===
        let marketingCount = 0;
        for (const word of CONFIG.AD_RULES.MARKETING_WORDS) {
            if (fullText.includes(word)) {
                marketingCount++;
            }
        }
        
        if (marketingCount >= CONFIG.AD_RULES.MARKETING_THRESHOLD) {
            score += 30;
            reasons.push(`营销词: ${marketingCount}个`);
        }
        
        // === 5. margin-bottom 检测 ===
        const descEl = element.querySelector(CONFIG.SELECTORS.RESULT_DESC);
        if (descEl) {
            const style = window.getComputedStyle(descEl);
            const marginBottom = parseInt(style.marginBottom) || 0;
            
            if (marginBottom === 0 && score > 0) {
                score += 15;
                reasons.push('margin为0');
            }
        }
        
        // === 6. data 属性检测 ===
        if (element.getAttribute('data-ad') || 
            element.getAttribute('data-bm') === 'ad' ||
            element.querySelector('[data-ad]')) {
            score += 40;
            reasons.push('data属性');
        }
        
        // === 7. 检查是否有广告标签元素 ===
        const adLabelEl = element.querySelector('.b_adlabel, .ad_label, [class*="ad-label"]');
        if (adLabelEl) {
            score += 50;
            reasons.push('广告标签元素');
        }
        
        // 判定：评分超过阈值则为广告
        const isAd = score >= 35;
        
        return {
            isAd,
            score,
            reasons: reasons.join(', ')
        };
    }

    /**
     * 计算结果评分
     */
    calcScore(result) {
        let score = CONFIG.SCORING.BASE;
        const details = [];
        
        // 广告直接低分
        if (result.isAd) {
            score += CONFIG.SCORING.AD_PENALTY;
            details.push(`广告: ${CONFIG.SCORING.AD_PENALTY}`);
            return { score: Math.max(0, score), details };
        }
        
        // HTTPS
        if (result.url.startsWith('https://')) {
            score += CONFIG.SCORING.HTTPS;
            details.push(`HTTPS: +${CONFIG.SCORING.HTTPS}`);
        }
        
        // 关键词匹配
        const titleLower = result.title.toLowerCase();
        const descLower = result.description.toLowerCase();
        let titleHits = 0, descHits = 0;
        
        this.keywords.forEach(kw => {
            if (kw.length < 2) return; // 忽略单字符
            if (titleLower.includes(kw)) titleHits++;
            if (descLower.includes(kw)) descHits++;
        });
        
        if (titleHits > 0) {
            const bonus = Math.min(titleHits * CONFIG.SCORING.KEYWORD_TITLE, 30);
            score += bonus;
            details.push(`标题匹配: +${bonus}`);
        }
        
        if (descHits > 0) {
            const bonus = Math.min(descHits * CONFIG.SCORING.KEYWORD_DESC, 20);
            score += bonus;
            details.push(`描述匹配: +${bonus}`);
        }
        
        // 域名权威度
        try {
            const hostname = new URL(result.url).hostname;
            
            for (const [domain, bonus] of Object.entries(CONFIG.SCORING.AUTHORITY)) {
                if (hostname.includes(domain)) {
                    score += bonus;
                    details.push(`权威站: +${bonus}`);
                    break;
                }
            }
            
            for (const bad of CONFIG.SCORING.LOW_QUALITY) {
                if (hostname.includes(bad)) {
                    score += CONFIG.SCORING.LOW_QUALITY_PENALTY;
                    details.push(`低质量: ${CONFIG.SCORING.LOW_QUALITY_PENALTY}`);
                    break;
                }
            }
        } catch (e) {}
        
        return {
            score: Math.min(100, Math.max(0, Math.round(score))),
            details
        };
    }

    /**
     * 获取评分等级
     */
    getLevel(score, isAd) {
        if (isAd) return { level: 'ad', label: '广告', color: '#9ca3af' };
        if (score >= 75) return { level: 'excellent', label: '优秀', color: '#10b981' };
        if (score >= 55) return { level: 'good', label: '良好', color: '#3b82f6' };
        if (score >= 35) return { level: 'fair', label: '一般', color: '#f59e0b' };
        return { level: 'poor', label: '较差', color: '#ef4444' };
    }

    /**
     * 高亮关键词
     */
    highlight(text) {
        if (!text || !this.prefs.highlightKeywords) return text;
        
        let result = text;
        
        // 按长度降序处理，避免短词覆盖长词
        this.keywords.forEach(kw => {
            if (!kw || kw.length < 1) return;
            
            // 转义特殊字符
            const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(${escaped})`, 'gi');
            
            result = result.replace(regex, '<mark class="bse-hl">$1</mark>');
        });
        
        return result;
    }

    /**
     * 解析搜索结果
     */
    parse() {
        const elements = document.querySelectorAll(CONFIG.SELECTORS.RESULT_LIST);
        this.results = [];
        
        elements.forEach((el, index) => {
            const titleEl = el.querySelector(CONFIG.SELECTORS.RESULT_TITLE);
            const descEl = el.querySelector(CONFIG.SELECTORS.RESULT_DESC);
            const urlEl = el.querySelector(CONFIG.SELECTORS.RESULT_URL);
            
            if (!titleEl) return;
            
            // 广告检测
            const adResult = this.isAd(el);
            
            const result = {
                index,
                element: el,
                title: titleEl.textContent?.trim() || '',
                url: titleEl.href || '',
                displayUrl: urlEl?.textContent?.trim() || '',
                description: descEl?.textContent?.trim() || '',
                isAd: adResult.isAd,
                adReason: adResult.reasons,
                adScore: adResult.score,
                score: 0,
                scoreDetails: [],
                order: index
            };
            
            // 计算评分
            const scoreResult = this.calcScore(result);
            result.score = scoreResult.score;
            result.scoreDetails = scoreResult.details;
            
            this.results.push(result);
        });
        
        console.log('[BSE] 解析完成:', this.results.length, '条');
        console.log('[BSE] 广告:', this.results.filter(r => r.isAd).length, '条');
        
        return this.results;
    }

    /**
     * 按评分排序
     */
    sortByScore() {
        const normal = this.results.filter(r => !r.isAd);
        const ads = this.results.filter(r => r.isAd);
        
        normal.sort((a, b) => b.score - a.score);
        
        return [...normal, ...ads];
    }

    /**
     * 切换收藏
     */
    toggleMark(index) {
        const r = this.results[index];
        if (!r) return false;
        
        const marked = getMarked();
        const idx = marked.findIndex(m => m.url === r.url);
        
        if (idx >= 0) {
            marked.splice(idx, 1);
            r.element.classList.remove('bse-marked');
        } else {
            marked.push({ url: r.url, title: r.title, time: Date.now() });
            r.element.classList.add('bse-marked');
        }
        
        saveMarked(marked);
        return idx < 0; // 返回是否新增
    }

    /**
     * 检查是否已收藏
     */
    isMarked(url) {
        return getMarked().some(m => m.url === url);
    }
}

/**
 * UI 组件
 */
class SearchUI {
    constructor(core) {
        this.core = core;
        this.panel = null;
        this.toolbar = null;
        this.previewBox = null;
        this.hoverTimer = null;
        this.currentPreviewIdx = -1;
    }

    /**
     * 初始化
     */
    init() {
        this.injectStyles();
        this.createToolbar();
        this.createPanel();
        this.createPreviewBox();
        this.enhanceResults();
        this.bindEvents();
        this.observe();
        console.log('[BSE] UI 初始化完成');
    }

    /**
     * 注入样式
     */
    injectStyles() {
        const css = `
            /* 高亮 */
            .bse-hl {
                background: linear-gradient(120deg, #fef08a, #fde047);
                padding: 0 2px;
                border-radius: 2px;
                color: #92400e;
            }

            /* 工具栏 */
            .bse-toolbar {
                position: fixed;
                top: 90px;
                right: 20px;
                z-index: 99999;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .bse-tbtn {
                width: 46px;
                height: 46px;
                border: none;
                border-radius: 12px;
                background: rgba(255,255,255,0.95);
                backdrop-filter: blur(12px);
                box-shadow: 0 2px 12px rgba(0,0,0,0.08);
                cursor: pointer;
                font-size: 20px;
                transition: all 0.25s ease;
                position: relative;
            }

            .bse-tbtn:hover {
                transform: scale(1.08);
                box-shadow: 0 4px 20px rgba(0,0,0,0.12);
            }

            .bse-tbtn.on { background: #3b82f6; color: #fff; }

            .bse-tbtn-tip {
                position: absolute;
                right: 54px;
                top: 50%;
                transform: translateY(-50%);
                background: #1e293b;
                color: #fff;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 12px;
                white-space: nowrap;
                opacity: 0;
                pointer-events: none;
                transition: all 0.2s ease;
            }

            .bse-tbtn:hover .bse-tbtn-tip { opacity: 1; right: 52px; }

            /* 面板 */
            .bse-panel {
                position: fixed;
                top: 90px;
                right: 80px;
                width: 360px;
                max-height: calc(100vh - 110px);
                background: rgba(255,255,255,0.96);
                backdrop-filter: blur(20px);
                border-radius: 16px;
                box-shadow: 0 8px 40px rgba(0,0,0,0.1);
                z-index: 99998;
                display: flex;
                flex-direction: column;
                opacity: 0;
                transform: translateX(20px);
                pointer-events: none;
                transition: all 0.3s ease;
            }

            .bse-panel.show {
                opacity: 1;
                transform: translateX(0);
                pointer-events: auto;
            }

            .bse-panel-hd {
                padding: 14px 18px;
                border-bottom: 1px solid rgba(0,0,0,0.05);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .bse-panel-tt {
                font-size: 15px;
                font-weight: 600;
                color: #1e293b;
            }

            .bse-panel-close {
                width: 28px;
                height: 28px;
                border: none;
                background: rgba(0,0,0,0.04);
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                transition: all 0.2s ease;
            }

            .bse-panel-close:hover {
                background: #ef4444;
                color: #fff;
            }

            .bse-tabs {
                display: flex;
                padding: 0 18px;
                border-bottom: 1px solid rgba(0,0,0,0.05);
            }

            .bse-tab {
                padding: 10px 14px;
                font-size: 13px;
                color: #64748b;
                cursor: pointer;
                border-bottom: 2px solid transparent;
                transition: all 0.2s ease;
            }

            .bse-tab:hover { color: #3b82f6; }
            .bse-tab.on { color: #3b82f6; font-weight: 500; border-color: #3b82f6; }

            .bse-panel-bd {
                flex: 1;
                overflow-y: auto;
                padding: 14px 18px;
            }

            .bse-panel-bd::-webkit-scrollbar { width: 4px; }
            .bse-panel-bd::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 2px; }

            .bse-cont { display: none; }
            .bse-cont.on { display: block; }

            /* 统计 */
            .bse-stats {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
                margin-bottom: 14px;
            }

            .bse-stat {
                background: #fff;
                padding: 12px;
                border-radius: 10px;
                text-align: center;
                box-shadow: 0 1px 4px rgba(0,0,0,0.04);
            }

            .bse-stat-n { font-size: 22px; font-weight: 700; color: #3b82f6; }
            .bse-stat-n.warn { color: #f59e0b; }
            .bse-stat-l { font-size: 11px; color: #94a3b8; margin-top: 2px; }

            /* 卡片 */
            .bse-card {
                background: #fff;
                border-radius: 12px;
                padding: 14px;
                margin-bottom: 10px;
                box-shadow: 0 1px 6px rgba(0,0,0,0.04);
                cursor: pointer;
                transition: all 0.25s ease;
                border: 2px solid transparent;
            }

            .bse-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0,0,0,0.08);
                border-color: #3b82f6;
            }

            .bse-card.ad { opacity: 0.5; border-left: 3px solid #9ca3af; }

            .bse-card-tt {
                font-size: 13px;
                font-weight: 600;
                color: #1e293b;
                line-height: 1.4;
                margin-bottom: 6px;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .bse-card-url {
                font-size: 11px;
                color: #10b981;
                margin-bottom: 6px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .bse-card-desc {
                font-size: 12px;
                color: #64748b;
                line-height: 1.5;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .bse-card-ft {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-top: 10px;
                padding-top: 10px;
                border-top: 1px solid rgba(0,0,0,0.04);
            }

            .bse-badge {
                padding: 3px 10px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 600;
                color: #fff;
            }

            .bse-badge.excellent { background: #10b981; }
            .bse-badge.good { background: #3b82f6; }
            .bse-badge.fair { background: #f59e0b; }
            .bse-badge.poor { background: #ef4444; }
            .bse-badge.ad { background: #9ca3af; }

            .bse-card-acts { display: flex; gap: 6px; }

            .bse-abtn {
                width: 28px;
                height: 28px;
                border: none;
                background: rgba(0,0,0,0.04);
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .bse-abtn:hover { background: #3b82f6; color: #fff; }
            .bse-abtn.marked { background: #fef3c7; color: #d97706; }

            /* 结果增强 */
            .b_algo.bse-done {
                position: relative;
                transition: all 0.2s ease;
                border-left: 3px solid transparent;
                padding-left: 10px !important;
            }

            .b_algo.bse-done:hover {
                background: rgba(59,130,246,0.03);
                border-left-color: #3b82f6;
            }

            .b_algo.bse-ad {
                opacity: 0.4;
                border-left-color: #9ca3af !important;
            }

            .b_algo.bse-ad::after {
                content: '广告';
                position: absolute;
                top: 4px;
                right: 4px;
                background: #9ca3af;
                color: #fff;
                padding: 2px 8px;
                border-radius: 10px;
                font-size: 10px;
            }

            .b_algo.bse-marked {
                background: rgba(251,191,36,0.06) !important;
                border-left-color: #f59e0b !important;
            }

            .bse-stag {
                position: absolute;
                top: 4px;
                right: 4px;
                padding: 3px 10px;
                border-radius: 10px;
                font-size: 11px;
                font-weight: 500;
                color: #fff;
                opacity: 0;
                transition: all 0.2s ease;
            }

            .b_algo.bse-done:hover .bse-stag { opacity: 1; }

            /* 预览框 - 全屏缩放版 */
            .bse-preview {
                position: fixed;
                top: 90px;
                right: 460px;
                width: 420px;
                height: 520px;
                background: #fff;
                border-radius: 16px;
                box-shadow: 0 10px 50px rgba(0,0,0,0.15);
                z-index: 99997;
                overflow: hidden;
                opacity: 0;
                transform: scale(0.95);
                pointer-events: none;
                transition: all 0.3s ease;
            }

            .bse-preview.show {
                opacity: 1;
                transform: scale(1);
                pointer-events: auto;
            }

            .bse-preview-hd {
                padding: 10px 14px;
                background: #f8fafc;
                border-bottom: 1px solid #e2e8f0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .bse-preview-info {
                flex: 1;
                min-width: 0;
            }

            .bse-preview-tt {
                font-size: 12px;
                font-weight: 600;
                color: #1e293b;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .bse-preview-url {
                font-size: 10px;
                color: #10b981;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .bse-preview-acts { display: flex; gap: 6px; margin-left: 10px; }

            .bse-preview-btn {
                padding: 6px 12px;
                border: none;
                border-radius: 6px;
                font-size: 11px;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 4px;
            }

            .bse-preview-btn.primary { background: #3b82f6; color: #fff; }
            .bse-preview-btn.primary:hover { background: #2563eb; }

            .bse-preview-close {
                width: 26px;
                height: 26px;
                border: none;
                background: rgba(0,0,0,0.04);
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.2s ease;
            }

            .bse-preview-close:hover { background: #ef4444; color: #fff; }

            .bse-preview-bd {
                position: relative;
                height: calc(100% - 50px);
                overflow: hidden;
                background: #f1f5f9;
            }

            /* 缩放容器 */
            .bse-preview-wrap {
                width: ${CONFIG.PREVIEW.WIDTH}px;
                height: ${CONFIG.PREVIEW.HEIGHT}px;
                transform: scale(${CONFIG.PREVIEW.SCALE});
                transform-origin: top left;
                overflow: hidden;
            }

            .bse-preview-frame {
                width: 100%;
                height: 100%;
                border: none;
                background: #fff;
            }

            .bse-preview-loading {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                color: #64748b;
                font-size: 13px;
            }

            .bse-preview-loading::after {
                content: '';
                display: block;
                width: 30px;
                height: 30px;
                margin: 12px auto 0;
                border: 3px solid #e2e8f0;
                border-top-color: #3b82f6;
                border-radius: 50%;
                animation: bseSpin 0.7s linear infinite;
            }

            .bse-preview-err {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                color: #64748b;
                display: none;
            }

            .bse-preview-err p { margin: 8px 0; }

            /* 设置 */
            .bse-setting {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 0;
                border-bottom: 1px solid rgba(0,0,0,0.04);
            }

            .bse-setting-t { font-size: 13px; color: #475569; }

            .bse-switch {
                width: 40px;
                height: 22px;
                background: #e2e8f0;
                border-radius: 11px;
                cursor: pointer;
                position: relative;
                transition: all 0.2s ease;
            }

            .bse-switch.on { background: #3b82f6; }

            .bse-switch::after {
                content: '';
                position: absolute;
                top: 2px;
                left: 2px;
                width: 18px;
                height: 18px;
                background: #fff;
                border-radius: 50%;
                transition: all 0.2s ease;
            }

            .bse-switch.on::after { left: 20px; }

            /* Toast */
            .bse-toast {
                position: fixed;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%) translateY(15px);
                background: #1e293b;
                color: #fff;
                padding: 10px 22px;
                border-radius: 10px;
                font-size: 13px;
                z-index: 999999;
                opacity: 0;
                transition: all 0.3s ease;
            }

            .bse-toast.show {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }

            @keyframes bseSpin {
                to { transform: rotate(360deg); }
            }
        `;

        const style = document.createElement('style');
        style.id = 'bse-css';
        style.textContent = css;
        document.head.appendChild(style);
    }

    /**
     * 创建工具栏
     */
    createToolbar() {
        const div = document.createElement('div');
        div.className = 'bse-toolbar';
        div.innerHTML = `
            <button class="bse-tbtn on" data-act="panel">📋<span class="bse-tbtn-tip">面板</span></button>
            <button class="bse-tbtn" data-act="highlight">🔍<span class="bse-tbtn-tip">高亮</span></button>
            <button class="bse-tbtn" data-act="sort">📊<span class="bse-tbtn-tip">排序</span></button>
            <button class="bse-tbtn" data-act="hideAd">🚫<span class="bse-tbtn-tip">隐藏广告</span></button>
        `;
        document.body.appendChild(div);
        this.toolbar = div;
    }

    /**
     * 创建面板
     */
    createPanel() {
        const r = this.core.results;
        const adCnt = r.filter(x => x.isAd).length;
        const avgScore = r.length ? Math.round(r.reduce((s, x) => s + x.score, 0) / r.length) : 0;
        const goodCnt = r.filter(x => x.score >= 70 && !x.isAd).length;

        const div = document.createElement('div');
        div.className = 'bse-panel show';
        div.innerHTML = `
            <div class="bse-panel-hd">
                <span class="bse-panel-tt">🚀 搜索增强</span>
                <button class="bse-panel-close">✕</button>
            </div>
            <div class="bse-tabs">
                <div class="bse-tab on" data-tab="overview">概览</div>
                <div class="bse-tab" data-tab="all">全部</div>
                <div class="bse-tab" data-tab="settings">设置</div>
            </div>
            <div class="bse-panel-bd">
                <div class="bse-cont on" data-cont="overview">
                    <div class="bse-stats">
                        <div class="bse-stat"><div class="bse-stat-n">${r.length}</div><div class="bse-stat-l">结果</div></div>
                        <div class="bse-stat"><div class="bse-stat-n">${avgScore}</div><div class="bse-stat-l">均分</div></div>
                        <div class="bse-stat"><div class="bse-stat-n">${goodCnt}</div><div class="bse-stat-l">优质</div></div>
                        <div class="bse-stat"><div class="bse-stat-n warn">${adCnt}</div><div class="bse-stat-l">广告</div></div>
                    </div>
                    <div class="bse-cards">${this.renderCards(r.slice(0, 5))}</div>
                </div>
                <div class="bse-cont" data-cont="all">
                    <div class="bse-cards">${this.renderCards(r)}</div>
                </div>
                <div class="bse-cont" data-cont="settings">
                    <div class="bse-setting"><span class="bse-setting-t">悬浮预览</span><div class="bse-switch ${this.core.prefs.autoPreview ? 'on' : ''}" data-pref="autoPreview"></div></div>
                    <div class="bse-setting"><span class="bse-setting-t">关键词高亮</span><div class="bse-switch ${this.core.prefs.highlightKeywords ? 'on' : ''}" data-pref="highlightKeywords"></div></div>
                    <div class="bse-setting"><span class="bse-setting-t">显示评分</span><div class="bse-switch ${this.core.prefs.showScores ? 'on' : ''}" data-pref="showScores"></div></div>
                    <div class="bse-setting"><span class="bse-setting-t">隐藏广告</span><div class="bse-switch ${this.core.prefs.hideAds ? 'on' : ''}" data-pref="hideAds"></div></div>
                </div>
            </div>
        `;
        document.body.appendChild(div);
        this.panel = div;
    }

    /**
     * 渲染卡片
     */
    renderCards(list) {
        return list.map(r => {
            const lv = this.core.getLevel(r.score, r.isAd);
            const marked = this.core.isMarked(r.url);
            return `
                <div class="bse-card ${r.isAd ? 'ad' : ''}" data-idx="${r.index}">
                    <div class="bse-card-tt">${this.core.highlight(r.title)}</div>
                    <div class="bse-card-url">${r.displayUrl}</div>
                    <div class="bse-card-desc">${this.core.highlight(r.description)}</div>
                    <div class="bse-card-ft">
                        <span class="bse-badge ${lv.level}">${r.isAd ? '广告' : lv.label + ' ' + r.score}</span>
                        <div class="bse-card-acts">
                            <button class="bse-abtn ${marked ? 'marked' : ''}" data-act="mark" data-idx="${r.index}">${marked ? '⭐' : '☆'}</button>
                            <button class="bse-abtn" data-act="open" data-url="${r.url}">↗</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * 创建预览框
     */
    createPreviewBox() {
        const div = document.createElement('div');
        div.className = 'bse-preview';
        div.innerHTML = `
            <div class="bse-preview-hd">
                <div class="bse-preview-info">
                    <div class="bse-preview-tt"></div>
                    <div class="bse-preview-url"></div>
                </div>
                <div class="bse-preview-acts">
                    <button class="bse-preview-btn primary" data-act="openUrl">↗ 打开</button>
                    <button class="bse-preview-close">✕</button>
                </div>
            </div>
            <div class="bse-preview-bd">
                <div class="bse-preview-loading">加载中...</div>
                <div class="bse-preview-err">
                    <p style="font-size:36px">🚫</p>
                    <p>无法预览此页面</p>
                    <button class="bse-preview-btn primary" data-act="openUrl">↗ 新窗口打开</button>
                </div>
                <div class="bse-preview-wrap">
                    <iframe class="bse-preview-frame" sandbox="allow-same-origin allow-scripts"></iframe>
                </div>
            </div>
        `;
        document.body.appendChild(div);
        this.previewBox = div;
    }

    /**
     * 显示预览
     */
    showPreview(index) {
        const r = this.core.results[index];
        if (!r || this.currentPreviewIdx === index) return;
        
        this.currentPreviewIdx = index;
        const box = this.previewBox;
        const frame = box.querySelector('.bse-preview-frame');
        const wrap = box.querySelector('.bse-preview-wrap');
        const loading = box.querySelector('.bse-preview-loading');
        const err = box.querySelector('.bse-preview-err');

        // 更新信息
        box.querySelector('.bse-preview-tt').textContent = r.title;
        box.querySelector('.bse-preview-url').textContent = r.displayUrl;
        
        // 设置打开按钮
        box.querySelectorAll('[data-act="openUrl"]').forEach(btn => {
            btn.onclick = () => window.open(r.url, '_blank');
        });

        // 重置状态
        loading.style.display = 'block';
        err.style.display = 'none';
        wrap.style.display = 'none';
        frame.src = 'about:blank';

        // 显示预览框
        box.classList.add('show');

        // 加载超时
        const timeout = setTimeout(() => {
            if (loading.style.display !== 'none') {
                loading.style.display = 'none';
                err.style.display = 'block';
            }
        }, CONFIG.PREVIEW.TIMEOUT);

        // 加载成功
        frame.onload = () => {
            clearTimeout(timeout);
            try {
                // 尝试访问内容（跨域会报错）
                const doc = frame.contentDocument;
                if (doc && doc.body) {
                    loading.style.display = 'none';
                    wrap.style.display = 'block';
                }
            } catch (e) {
                // 跨域但已加载，仍显示
                loading.style.display = 'none';
                wrap.style.display = 'block';
            }
        };

        frame.onerror = () => {
            clearTimeout(timeout);
            loading.style.display = 'none';
            err.style.display = 'block';
        };

        // 开始加载
        frame.src = r.url;
    }

    /**
     * 隐藏预览
     */
    hidePreview() {
        this.previewBox.classList.remove('show');
        this.currentPreviewIdx = -1;
        
        setTimeout(() => {
            this.previewBox.querySelector('.bse-preview-frame').src = 'about:blank';
        }, 300);
    }

    /**
     * 增强搜索结果
     */
    enhanceResults() {
        this.core.results.forEach((r, i) => {
            const el = r.element;
            el.classList.add('bse-done');

            if (r.isAd) {
                el.classList.add('bse-ad');
                if (this.core.prefs.hideAds) el.style.display = 'none';
            }

            if (this.core.isMarked(r.url)) {
                el.classList.add('bse-marked');
            }

            // 评分标签
            if (this.core.prefs.showScores && !r.isAd) {
                const lv = this.core.getLevel(r.score, r.isAd);
                const tag = document.createElement('div');
                tag.className = 'bse-stag';
                tag.style.background = lv.color;
                tag.textContent = `${lv.label} ${r.score}`;
                el.appendChild(tag);
            }

            // 高亮
            if (this.core.prefs.highlightKeywords) {
                const descEl = el.querySelector(CONFIG.SELECTORS.RESULT_DESC);
                if (descEl && !descEl.querySelector('.bse-hl')) {
                    descEl.innerHTML = this.core.highlight(descEl.textContent);
                }
            }
        });
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 工具栏
        this.toolbar.addEventListener('click', e => {
            const btn = e.target.closest('.bse-tbtn');
            if (!btn) return;
            
            const act = btn.dataset.act;
            switch (act) {
                case 'panel':
                    this.panel.classList.toggle('show');
                    btn.classList.toggle('on');
                    break;
                case 'highlight':
                    this.core.prefs.highlightKeywords = !this.core.prefs.highlightKeywords;
                    savePrefs(this.core.prefs);
                    btn.classList.toggle('on');
                    this.refreshHighlights();
                    this.toast(this.core.prefs.highlightKeywords ? '已开启高亮' : '已关闭高亮');
                    break;
                case 'sort':
                    this.sortResults();
                    this.toast('已按评分排序');
                    break;
                case 'hideAd':
                    this.core.prefs.hideAds = !this.core.prefs.hideAds;
                    savePrefs(this.core.prefs);
                    btn.classList.toggle('on');
                    this.toggleAds();
                    this.toast(this.core.prefs.hideAds ? '已隐藏广告' : '已显示广告');
                    break;
            }
        });

        // 面板
        this.panel.addEventListener('click', e => {
            const target = e.target;

            // 关闭
            if (target.classList.contains('bse-panel-close')) {
                this.panel.classList.remove('show');
                this.toolbar.querySelector('[data-act="panel"]').classList.remove('on');
            }

            // Tab
            if (target.classList.contains('bse-tab')) {
                this.switchTab(target.dataset.tab);
            }

            // 设置开关
            if (target.classList.contains('bse-switch')) {
                const pref = target.dataset.pref;
                this.core.prefs[pref] = !this.core.prefs[pref];
                savePrefs(this.core.prefs);
                target.classList.toggle('on');
                
                if (pref === 'highlightKeywords') this.refreshHighlights();
                if (pref === 'hideAds') this.toggleAds();
            }

            // 卡片操作
            const abtn = target.closest('.bse-abtn');
            if (abtn) {
                e.stopPropagation();
                const act = abtn.dataset.act;
                if (act === 'mark') {
                    const idx = parseInt(abtn.dataset.idx);
                    const isNew = this.core.toggleMark(idx);
                    abtn.classList.toggle('marked', isNew);
                    abtn.textContent = isNew ? '⭐' : '☆';
                    this.toast(isNew ? '已收藏' : '已取消');
                } else if (act === 'open') {
                    window.open(abtn.dataset.url, '_blank');
                }
                return;
            }

            // 卡片悬浮预览（点击也触发）
            const card = target.closest('.bse-card');
            if (card) {
                const idx = parseInt(card.dataset.idx);
                this.showPreview(idx);
            }
        });

        // 卡片悬浮预览
        this.panel.addEventListener('mouseenter', e => {
            const card = e.target.closest('.bse-card');
            if (card && this.core.prefs.autoPreview) {
                clearTimeout(this.hoverTimer);
                this.hoverTimer = setTimeout(() => {
                    const idx = parseInt(card.dataset.idx);
                    this.showPreview(idx);
                }, CONFIG.PREVIEW.DELAY);
            }
        }, true);

        this.panel.addEventListener('mouseleave', e => {
            const card = e.target.closest('.bse-card');
            if (card) {
                clearTimeout(this.hoverTimer);
            }
        }, true);

        // 预览框
        this.previewBox.addEventListener('click', e => {
            if (e.target.classList.contains('bse-preview-close')) {
                this.hidePreview();
            }
        });

        // ESC 关闭
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') this.hidePreview();
        });

        // 点击外部关闭预览
        document.addEventListener('click', e => {
            if (!this.previewBox.contains(e.target) && 
                !this.panel.contains(e.target) &&
                this.previewBox.classList.contains('show')) {
                this.hidePreview();
            }
        });
    }

    /**
     * 切换Tab
     */
    switchTab(name) {
        this.panel.querySelectorAll('.bse-tab').forEach(t => {
            t.classList.toggle('on', t.dataset.tab === name);
        });
        this.panel.querySelectorAll('.bse-cont').forEach(c => {
            c.classList.toggle('on', c.dataset.cont === name);
        });
    }

    /**
     * 刷新高亮
     */
    refreshHighlights() {
        this.core.results.forEach(r => {
            const descEl = r.element.querySelector(CONFIG.SELECTORS.RESULT_DESC);
            if (!descEl) return;
            
            const text = descEl.textContent;
            descEl.innerHTML = this.core.prefs.highlightKeywords 
                ? this.core.highlight(text) 
                : text;
        });
    }

    /**
     * 隐藏/显示广告
     */
    toggleAds() {
        this.core.results.filter(r => r.isAd).forEach(r => {
            r.element.style.display = this.core.prefs.hideAds ? 'none' : '';
        });
    }

    /**
     * 排序结果
     */
    sortResults() {
        const container = document.querySelector(CONFIG.SELECTORS.RESULTS_CONTAINER);
        if (!container) return;

        container.style.display = 'flex';
        container.style.flexDirection = 'column';

        const sorted = this.core.sortByScore();
        sorted.forEach((r, i) => {
            r.element.style.order = i;
        });
    }

    /**
     * 监听变化
     */
    observe() {
        const observer = new MutationObserver(muts => {
            let needRefresh = false;
            muts.forEach(m => {
                m.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && 
                        node.classList?.contains('b_algo') && 
                        !node.classList?.contains('bse-done')) {
                        needRefresh = true;
                    }
                });
            });
            
            if (needRefresh) {
                this.core.parse();
                this.enhanceResults();
            }
        });

        const container = document.querySelector(CONFIG.SELECTORS.MAIN_CONTENT);
        if (container) {
            observer.observe(container, { childList: true, subtree: true });
        }
    }

    /**
     * Toast
     */
    toast(msg) {
        let t = document.querySelector('.bse-toast');
        if (!t) {
            t = document.createElement('div');
            t.className = 'bse-toast';
            document.body.appendChild(t);
        }
        t.textContent = msg;
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 2000);
    }
}
    // 启动
    function boot() {
        try {
            const core = new SearchCore();
            core.parse();
            const ui = new SearchUI(core);
            ui.init();
            window.__BSE__ = { core, ui };
        } catch (e) {
            console.error('[BSE] 错误:', e);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
