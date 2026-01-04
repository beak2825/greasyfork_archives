// ==UserScript==
// @name         【夸克百科】参考资料复制
// @namespace    http://tampermonkey.net/
// @version      2025/12/02-01:31:24
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @match        *://*/*

// @exclude      *://*.google.com/*
// @exclude      *://*.bing.com/*
// @exclude      *://*.baidu.com/*
// @exclude      *://*.quark.*/*

// @exclude      *://192.168.*.*/*
// @exclude      /^https?:\/\/(192\.168\.|127\.0\.0\.1|localhost|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/
// @exclude      file:///*

// @exclude      *://*.github.com/*
// @exclude      *://*.github.io/*
// @exclude      *://greasyfork.org/*

// @exclude      *://img*.mtime.cn/*
// @exclude      *://img*.doubanio.com/*

// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548696/%E3%80%90%E5%A4%B8%E5%85%8B%E7%99%BE%E7%A7%91%E3%80%91%E5%8F%82%E8%80%83%E8%B5%84%E6%96%99%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/548696/%E3%80%90%E5%A4%B8%E5%85%8B%E7%99%BE%E7%A7%91%E3%80%91%E5%8F%82%E8%80%83%E8%B5%84%E6%96%99%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 确保不在iframe中运行
    if (window.self !== window.top) return;


    // 主域名与网站名称的映射表
    const DOMAIN_NAME_MAPPING = {
        // 知识平台
        'www.zdic.net': '汉典',
        'cqvip.com': '维普期刊官网',
        'jds.cssn.cn': '中国社会科学院近代史研究所',
        'cssn.cn': '中国社会科学院',
        'dpm.org.cn': '故宫博物院',
        'kepuchina.cn': '科普中国网',
        'hanspub.org': '汉斯出版社',


        // 影视音乐平台
        'movie.douban.com': '豆瓣电影',
        'book.douban.com': '豆瓣读书',
        'douban.com': '豆瓣',
        'www.iq.com': '爱奇艺',
        'iqiyi.com': '爱奇艺',
        '1905.com': '1905电影网',
        'movie.sogou.com': '搜狗视频',
        'video.sogou.com': '搜狗视频',
        'waptv.sogou.com': '搜狗视频',
        'wapv.sogou.com': '搜狗视频',
        'tv.sohu.com': '搜狐视频',
        'chinafilm.gov.cn': '国家电影局',
        'v.qq.com': '腾讯视频',


        // 网文平台
        'zongheng.com': '纵横中文网',
        'qidian.com': '起点中文网',
        'xxsy.net': '潇湘书院',


        // 新闻平台
        'people.com.cn': '人民网',
        'ent.sina.com.cn': '新浪娱乐',
        'comic.sina.com.cn': '新浪动漫',
        'k.sina.cn': '新浪',
        'ent.ifeng.com': '凤凰娱乐',
        'ifeng.com': '凤凰网',
        'sports.sohu.com': '搜狐体育',
        'news.sohu.com': '搜狐新闻',
        'sohu.com': '搜狐',
        'thepaper.cn': '澎湃新闻',
        'bjnews.com.cn': '新京报',
        'huanqiu.com': '环球网',
        'cctvwenhua.tv': '中国文化视窗网',
        'chinanews.com': '中国新闻网',
        'gmw.cn': '光明网',
        'chinadaily.com.cn': '中国日报网',
        'guancha.cn': '观察者网',
        'shobserver.com': '上观新闻',
        'cctv.com': '央视网',
        'news.66wz.com': '温州新闻网',
        'rednet.cn': '红网',
        'nfnews.com': '南方日报',
        'zqb.cyol.com': '中国青年报',
        'youth.cn': '中国青年网',
        'news.cyol.com': '中青在线',
        'ent.ynet.com': '北青网',
        'dbw.cn': '东北网',
        'bjd.com.cn': '北京日报',
        'cnnb.com.cn': '宁波日报',
        'm.voc.com.cn': '新湖南客户端',
        'newsduan.com': '东西问',
        'hnr.cn': '映象网',
        'news.zynews.cn': '中原网',
        'gzstv.com': '贵视网',
        'static.cdsb.com': '红星新闻',
        'dutenews.com': '读特新闻',
        'huacheng.gz-cmc.com': '新花城',
        'enorth.com.cn': '中国集团公司促进会',
        'szmeiw.cn': '陕西都市新闻网',
        'news.ycwb.com': '金羊网',


        // 其他文章平台
        'rogerebert.com': 'Roger Ebert',
        'cppcc.gov.cn': '中国政协网',
        'bift.edu.cn': '北京服装学院',
        'cgcpa.org.cn': '中国集团公司促进会',


        // 游戏平台
        '17173.com': '17173网络游戏门户站',
        'gamersky.com': '游民星空',



    };




    // 文章与标题选择器的映射表（最高优先级）
    const TITLE_SELECTOR_MAPPING = {
        // 格式：{ type: "css|xpath", value: "selector" }
        // JavaScript 对象的键不能重复，后面的会覆盖前面的


        // 知识平台
        'zgbk.com': { type: "css", value: "div.title h2.fl" },// 《中国大百科全书》第三版网络版
        // 'www.termonline.cn': { type: "css", value: "span.text-h5.text-sm-h4" },// 术语在线
        'www.termonline.cn': { type: "css", value: ".flex.items-center .font-bold" },// 术语在线 新版
        'www.zdic.net': { type: "css", value: "div.nr-box-header h2.h2_entry span.orth" },// 汉典
        'cqvip.com': { type: "xpath", value: '//*[@id="body"]/div/div/div[@class="article-main"]/div[@class="article-title"]/h1/text()' },// 维普期刊官网
        'ncpssd.cn': { type: "xpath", value: '//*[@id="h2_title_c"][@class="H2Style"]/text()' },// 国家哲学社会科学文献中心
        'jishuoshuo.com': { type: "css", value: '.entry-header .entry-title' },// 集说说
        'jinwen.net': { type: "css", value: '.content h2 span' },// 锦文网络流行语
        'jinwen.net': { type: "css", value: '.content .txtcontent h2.title.sline' },// 锦文网络流行语
        'cnenc.net': { type: "css", value: '#table1 > tbody > tr:nth-child(1) > td:nth-child(2)' },// 中文百科全书
        'nstl.gov.cn': { type: "css", value: '.serverleftcont_content #title' },// NSTL国家科技图书文献中心
        'semanticscholar.org': { type: "css", value: '*[data-test-id="paper-detail-title"]' },// Semantic Scholar
        'find.nlc.cn': { type: "css", value: '.book_name' },// 文津搜索


        // 影视音乐平台
        'movie.douban.com': { type: "css", value: "#content h1" },// 豆瓣电影
        'www.douban.com': { type: "css", value: ".subject-name" },// 豆瓣
        '1905.com': { type: "css", value: "#content #contentNews .title" },// 1905电影网
        'mtime.com': { type: "css", value: "div.headline div.info div.title" },// Mtime时光网 文章
        'tv.sohu.com': { type: "css", value: "div#topInfo h2.dbt.c-black" },// 搜狐视频
        'movie.sogou.com': { type: "css", value: "figcaption" },// 搜狐视频
        'video.sogou.com': { type: "css", value: "figcaption" },// 搜狐视频
        'waptv.sogou.com': { type: "css", value: "figcaption" },// 搜狐视频
        'wapv.sogou.com': { type: "css", value: "figcaption" },// 搜狐视频
        'v.qq.com': { type: "css", value: '.b-text-clamp h1' },// 腾讯视频 影视剧
        'v.qq.com': { type: "css", value: '.star_name._star_name' },// 腾讯视频 影人
        'chinafilm.gov.cn': { type: "xpath", value: '//table/tbody/tr[3]/td[2]' },// 国家电影局
        'music.163.com': { type: "css", value: '#g_iframe:scope .tit .f-ff2' },// 网易云音乐
        'maoyan.com': { type: "css", value: "div.shortInfo p.china-name.cele-name" },// 猫眼电影 文章
        'manga.bilibili.com': { type: "css", value: "[class*='manga-info'] [class*='manga-title']" },// 哔哩哔哩漫画
        'iq.com': { type: "css", value: ".focus-info-title" },// 爱奇艺


        // 网文平台
        'zongheng.com': { type: "css", value: 'div.book-info--title span' },// 纵横中文网
        'xxsy.net': { type: "css", value: '.bookprofile .title h1' },// 潇湘书院


        // 新闻平台
        'cctv.com': { type: "css", value: "div#title_area h1" },// 央视网 文章
        'cctv.com': { type: "css", value: ".wrapper .cnt_bd h1" },// 央视网 文章
        'sina.cn': { type: "css", value: "article.art_box h1.art_tit_h1" },// 手机新浪网 文章
        'sina.com.cn': { type: "css", value: "center div#outer table tbody h1" },// 新浪网 文章
        'news.qq.com': { type: "css", value: "div.content-article h1" },// 腾讯新闻 文章
        'people.com.cn': { type: "css", value: "div.main div.col.col-1.fl h1" },// 人民网 文章
        'cnpc.com.cn': { type: "css", value: 'div.content_title' },// 中国石油天然气集团公司 文章
        'cctvwenhua.tv': { type: "css", value: 'article.post-single h1.title' },// 中国文化视窗网
        //'sina.com.cn': { type: "css", value: 'head title' },// 新浪娱乐
        'm.thepaper.cn': { type: "css", value: '#title.titleFont' },// 澎湃新闻
        'thepaper.cn': { type: "css", value: 'div[class*="index_container__"] h1[class*="index_title__"]' },// 澎湃新闻
        'china.com': { type: "css", value: '.article_title' },// 中华网
        'china.com.cn': { type: "css", value: 'div.mainbody div.title h2' },// 中华网
        'ent.china.com': { type: "css", value: 'h1#chan_newsTitle' },// 中华网
        'gmw.cn': { type: "css", value: '.m-title-box .u-title' },// 光明网
        'sghexport.shobserver.com': { type: "css", value: '#title.titleFont' },// 上观新闻
        'neweekly.com.cn': { type: "css", value: '.article_header .title' },// 新周刊官网
        'kankanews.com': { type: "css", value: '.detail-main .bt' },// 看看新闻网
        'pconline.com.cn': { type: "xpath", value: '//*[@id="artHd"][@class="art-hd"]/h1/text()' },// 太平洋电脑网
        '66wz.com': { type: "css", value: '.title #artibodytitle' },// 温州新闻网
        'enorth.com.cn': { type: "css", value: '#title h2 b' },// 北方网
        'toutiao.com': { type: "css", value: '.article-content h1' },// 今日头条
        'm.voc.com.cn': { type: "css", value: '#main_title' },// 新湖南客户端
        'hinews.cn': { type: "css", value: '[class*="page_h2"]' },// 南海网
        'kepu.gov.cn': { type: "css", value: '.detil-new-title div:nth-child(2)' },// 中国科普网


        // 其他文章平台
        'chinairn.com': { type: "css", value: '.article-main h1' },// 中研网
        'chinawriter.com.cn': { type: "css", value: '#newstit' },// 中国作家网
        'std.samr.gov.cn': { type: "css", value: '.page-header h4' },// 全国标准信息公共服务平台
        'meishichina.com': { type: "css", value: '*[id="recipe_title"]' },// 美食天下
        'dpm.org.cn': { type: "css", value: '.s-title' },// 故宫博物院
        'chinacourt.cn': { type: "css", value: '.detail_bigtitle' },// 中国法院网
        'ihchina.cn': { type: "css", value: '.t_head' },// 中国非物质文化遗产网·中国非物质文化遗产数字博物馆
        'bift.edu.cn': { type: "css", value: '.tt_one' },// 北京服装学院
        'cgcpa.org.cn': { type: "css", value: '.cont h1' },// 中国集团公司促进会



        // 游戏平台
        '17173.com': { type: "css", value: '#content .gb-final-tit-article' },// 17173网络游戏门户站
        'gamersky.com': { type: "css", value: '.Mid2L_tit h1' },// 游民星空
        'acg.gamersky.com': { type: "css", value: '*[class*="_title"] h1' },// 游民星空 动漫星空
        '3dmgame.com': { type: "css", value: '.warp_top h1' },// 3DM网游





    };


    // 改进的复制函数
    function copyText(text) {
        const tempInput = document.createElement('textarea');
        tempInput.value = text;
        tempInput.style.position = 'fixed';
        tempInput.style.opacity = '0';
        document.body.appendChild(tempInput);
        tempInput.select();

        try {
            // 尝试使用新的Clipboard API
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text);
            }
            // 回退到execCommand
            else if (document.execCommand('copy')) {
                document.execCommand('copy');
            } else {
                // 终极解决方案：使用alert提示用户手动复制
                alert('请手动复制以下内容: \n\n' + text);
            }
        } catch (err) {
            console.error('复制失败:', err);
            prompt('请手动复制以下内容:', text);
        } finally {
            document.body.removeChild(tempInput);
        }
    }


    // 获取网站名称的函数
    async function getSiteName() {
        const host = window.location.hostname.toLowerCase();

        // 0. 最高优先级：检查预定义的域名映射
        for (const [domain, name] of Object.entries(DOMAIN_NAME_MAPPING)) {
            if (host.includes(domain)) {
                return name;
            }
        }

        // 0+：从head获取标题
        const metaSites = [
            document.querySelector('meta[property="og:site_name"]'),
            document.querySelector('meta[name="SiteName"]'),
            document.querySelector('meta[name="subsite"]'),

        ];

        for (const meta of metaSites) {
            if (meta && meta.content && meta.content.trim()) {
                return meta.content.trim();
            }
        }

        // 1. 尝试从当前页面标题获取
        const titleParts = document.title.split(/-|_|\|/);
        const nameFromTitle = titleParts[titleParts.length - 1]?.trim();
        if (nameFromTitle) return nameFromTitle;

        // 2. 尝试从主域名获取
        const domainParts = host.split('.');
        const nameFromDomain = domainParts.length > 1
        ? domainParts[domainParts.length - 2]
        : domainParts[0];

        // 3. 终极方案：通过网站图标获取
        try {
            const faviconLink = document.querySelector('link[rel*="icon"]')?.href;
            if (faviconLink) {
                const urlObj = new URL(faviconLink);
                const faviconHost = urlObj.hostname;
                const faviconParts = faviconHost.split('.');
                return faviconParts.length > 1
                    ? faviconParts[faviconParts.length - 2]
                : faviconHost;
            }
        } catch (e) {
            console.log('无法从favicon获取名称', e);
        }

        return nameFromDomain || host;
    }



    // 获取文章标题的函数（支持多级回退策略）
    function getArticleTitle() {
        const host = window.location.hostname.toLowerCase();

        // 策略0（最高优先级）：域名特定的标题选择器
        for (const [domain, selectorObj] of Object.entries(TITLE_SELECTOR_MAPPING)) {
            if (host.includes(domain)) {
                let title = null;

                if (selectorObj.type === "css") {
                    // 处理 CSS 选择器
                    const element = document.querySelector(selectorObj.value);
                    if (element && element.innerText.trim()) {
                        title = element.innerText.trim();
                    }
                } else if (selectorObj.type === "xpath") {
                    // 处理 XPath
                    const result = document.evaluate(
                        selectorObj.value,
                        document,
                        null,
                        XPathResult.STRING_TYPE,
                        null
                    );
                    title = result.stringValue.trim();
                }

                if (title) return title; // 找到有效标题则立即返回
            }
        }

        // 策略1：从 Open Graph (og:title) 或 Twitter Card 获取标题
        const metaTitles = [
            document.querySelector('meta[property="og:title"]'),
            document.querySelector('meta[name="twitter:title"]'),
            document.querySelector('meta[itemprop="name"]'),
            document.querySelector('meta[name="title"]'),
        ];

        for (const meta of metaTitles) {
            if (meta && meta.content && meta.content.trim()) {
                return meta.content.trim();
            }
        }

        // 策略2：从常见标题选择器获取
        const commonTitleSelectors = [
            // 特定网站选择器
            'div#title_area h1',          // 央视网
            'center div#outer h1',        // 新浪网
            'div.text_title h1',          // 人民网
            'div.article-title h1',      // 常见新闻网站
            'article h1',                 // HTML5文章
            'main h1',                    // HTML5主内容区
            'section h1',                // HTML5分区
            '[role="main"] h1',           // ARIA主内容区
            '[itemprop="headline"]',      // 微数据标题
            '[itemprop="name"]',           // 微数据名称



            // 通用标题选择器
            'h1', 'h2', 'h3',
            'h1.title', 'h1.tit', 'h1.headline', 'h1.article-title',
            'h2.title', 'h2.tit', 'h2.headline',
            'div.title', 'div.tit', 'div.headline',
            'span.title', 'span.tit', 'span.headline',

        ].join(', ');

        const elements = document.querySelectorAll(commonTitleSelectors);
        for (const element of elements) {
            const text = element.textContent.trim();
            if (text) {
                // 优先返回h1标签内容
                if (element.tagName.toLowerCase() === 'h1') {
                    return text;
                }
                // 其他标签作为候选
                return text;
            }
        }

        // 策略3：从页面标题获取
        const title = document.title.trim();
        if (title) {
            // 尝试清理标题中的网站名和分隔符
            const cleanTitle = title.split(/[-_|·—]/)[0].trim();
            return cleanTitle || title;
        }

        // 终极策略：返回空字符串
        return '';
    }

    // 创建按钮的函数
    function createButton(label, onClick) {
        const button = document.createElement('div');
        button.textContent = label;
        button.style.position = 'relative';
        button.style.zIndex = '999999999999999999';
        button.style.cursor = 'pointer';
        button.style.padding = '8px 12px';
        button.style.background = 'linear-gradient(145deg, #2c3e50, #1a2530)';
        button.style.color = '#ecf0f1';
        button.style.borderRadius = '5px';
        button.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
        button.style.fontSize = '22px';
        button.style.fontWeight = 'bold';
        button.style.transition = 'all 0.3s ease';
        button.style.userSelect = 'none';
        button.style.textAlign = 'center';
        button.style.width = 'auto';
        button.style.minWidth = '80px';

        // 悬停效果
        button.addEventListener('mouseover', () => {
            button.style.background = 'linear-gradient(145deg, #3498db, #2980b9)';
            button.style.transform = 'scale(1.05)';
        });

        button.addEventListener('mouseout', () => {
            button.style.background = 'linear-gradient(145deg, #2c3e50, #1a2530)';
            button.style.transform = 'scale(1)';
        });

        button.onclick = onClick;

        return button;
    }

    // 创建按钮容器（移到右上角）
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'copy-tools-container';
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.top = '20px';
    buttonContainer.style.right = '20px';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'column';
    buttonContainer.style.gap = '8px';
    buttonContainer.style.zIndex = '999999999999999999';
    document.body.appendChild(buttonContainer);

    // URL 按钮
    const urlButton = createButton('复制URL', () => {
        copyText(window.location.href);
        urlButton.textContent = '✓ 已复制!';
        setTimeout(() => urlButton.textContent = '复制URL', 2000);
    });
    buttonContainer.appendChild(urlButton);

    // 标题按钮
    const titleButton = createButton('复制标题', () => {
        const finalTitle = getArticleTitle();
        copyText(finalTitle);
        titleButton.textContent = '✓ 已复制!';
        setTimeout(() => titleButton.textContent = '复制标题', 2000);
    });
    buttonContainer.appendChild(titleButton);

    // 网站名按钮
    const siteNameButton = createButton('复制网站名', async () => {
        const siteName = await getSiteName();
        copyText(siteName);
        siteNameButton.textContent = '✓ 已复制!';
        setTimeout(() => siteNameButton.textContent = '复制网站名', 2000);
    });
    buttonContainer.appendChild(siteNameButton);

    // 添加全局样式防止复制被阻止
    const style = document.createElement('style');
    style.textContent = `
        #copy-tools-container * {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
            pointer-events: auto !important;
        }

        #copy-tools-container div {
            cursor: pointer !important;
        }
    `;
    document.head.appendChild(style);

    // 强制解除复制限制
    document.addEventListener('copy', (e) => {
        e.stopImmediatePropagation();
    }, true);

    document.addEventListener('cut', (e) => {
        e.stopImmediatePropagation();
    }, true);

    document.addEventListener('contextmenu', (e) => {
        e.stopImmediatePropagation();
    }, true);

})();