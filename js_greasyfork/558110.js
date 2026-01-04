// ==UserScript==
// @name         搜索引擎关键词网址自动跳转器
// @version      1.0
// @description  从搜索引擎中提取关键词，自动识别并跳转关键词中的网址
// @author       DeepSeek
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/558110/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%85%B3%E9%94%AE%E8%AF%8D%E7%BD%91%E5%9D%80%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/558110/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%85%B3%E9%94%AE%E8%AF%8D%E7%BD%91%E5%9D%80%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置（关键修改：优先使用 HTTP）
    const CONFIG = {
        enabled: true,
        autoJump: true,
        showPopup: true,
        delayBeforeJump: 800,
        preferHttps: false,          // 改为 false，彻底关闭 HTTPS 优先
        forceHttpForLocalhost: true, // localhost 也强制走 HTTP
        maxUrlLength: 500,
        minUrlLength: 8,
        debug: false
    };

    // 所有可能的搜索参数
    const SEARCH_PARAMS = [
        'q', 'query', 'search', 'wd', 'word', 'keyword', 'keywords',
        'p', 'text', 'txt', 'string', 'ask', 'terms', 'term',
        'searchfor', 'searchterm', 'searchquery', 'searchtext',
        'searchstring', 'searchterms', 'searchword', 'searchphrase',
        's', 't', 'v', 'w', 'k', 'key', 'field-keywords', '_nkw',
        'i', 'question', 'phrase', 'expression', 'lookfor',
        'find', 'findwhat', 'lookup', 'seek', 'request'
    ];

    // 常见顶级域名列表
    const COMMON_TLDS = [
        '.com', '.org', '.net', '.edu', '.gov', '.mil', '.int',
        '.cn', '.jp', '.uk', '.de', '.fr', '.ru', '.br', '.it',
        '.es', '.ca', '.au', '.in', '.mx', '.kr', '.nl', '.ch',
        '.se', '.no', '.dk', '.fi', '.pl', '.tr', '.id', '.th',
        '.tw', '.hk', '.sg', '.my', '.ph', '.vn', '.ir', '.sa',
        '.ae', '.eg', '.za', '.ng', '.ke', '.et', '.gh', '.ci',
        '.cm', '.ma', '.tn', '.dz', '.ly', '.sd', '.so', '.ye',
        '.iq', '.sy', '.jo', '.lb', '.ps', '.il', '.kw', '.qa',
        '.bh', '.om', '.uz', '.kz', '.az', '.ge', '.am', '.kg',
        '.tj', '.tm', '.af', '.pk', '.bd', '.lk', '.np', '.bt',
        '.mv', '.mm', '.la', '.kh', '.mn', '.mo', '.io', '.co',
        '.me', '.tv', '.cc', '.ws', '.biz', '.info', '.name',
        '.pro', '.mobi', '.asia', '.tel', '.xxx', '.xyz', '.top',
        '.club', '.online', '.site', '.store', '.tech', '.fun',
        '.app', '.dev', '.blog', '.design', '.art', '.shop',
        '.news', '.media', '.live', '.space', '.cloud', '.link',
        '.work', '.studio', '.network', '.digital', '.today',
        '.world', '.company', '.services', '.solutions', '.expert',
        '.guru', '.center', '.systems', '.management', '.support',
        '.directory', '.download', '.software', '.tools', '.agency',
        '.guide', '.academy', '.institute', '.education', '.training',
        '.university', '.school', '.college', '.campus', '.careers',
        '.jobs', '.recruitment', '.team', '.staff', '.office',
        '.business', '.enterprise', '.ventures', '.partners',
        '.holdings', '.group', '.global', '.international', '.worldwide',
        '.national', '.regional', '.local', '.city', '.town',
        '.village', '.community', '.society', '.association', '.foundation',
        '.charity', '.ngo', '.org', '.nonprofit', '.fund', '.trust',
        '.foundation', '.institution', '.museum', '.gallery', '.library',
        '.archive', '.heritage', '.history', '.culture', '.arts',
        '.music', '.film', '.theater', '.dance', '.photography',
        '.creative', '.innovation', '.science', '.research', '.lab',
        '.technology', '.engineering', '.development', '.solutions',
        '.consulting', '.advisory', '.strategy', '.planning', '.design',
        '.architecture', '.construction', '.engineering', '.manufacturing',
        '.production', '.factory', '.industrial', '.logistics', '.supply',
        '.distribution', '.transport', '.shipping', '.delivery', '.courier',
        '.post', '.mail', '.email', '.messaging', '.chat', '.talk',
        '.voice', '.video', '.stream', '.broadcast', '.media', '.press',
        '.news', '.journal', '.magazine', '.book', '.publishing',
        '.writing', '.author', '.editor', '.review', '.rating', '.score',
        '.rank', '.position', '.status', '.level', '.grade', '.class',
        '.category', '.type', '.kind', '.sort', '.order', '.system',
        '.structure', '.framework', '.platform', '.infrastructure',
        '.environment', '.ecosystem', '.network', '.web', '.internet',
        '.digital', '.virtual', '.cyber', '.ai', '.ml', '.data',
        '.analytics', '.intelligence', '.smart', '.automation', '.robot',
        '.iot', '.blockchain', '.crypto', '.bitcoin', '.ethereum',
        '.nft', '.metaverse', '.vr', '.ar', '.3d', '.graphics',
        '.animation', '.visual', '.image', '.photo', '.picture',
        '.video', '.audio', '.sound', '.music', '.podcast', '.radio',
        '.tv', '.film', '.movie', '.cinema', '.theater', '.stage',
        '.performance', '.show', '.event', '.festival', '.celebration',
        '.party', '.gathering', '.meeting', '.conference', '.summit',
        '.forum', '.seminar', '.workshop', '.training', '.course',
        '.lesson', '.tutorial', '.guide', '.manual', '.handbook',
        '.reference', '.documentation', '.wiki', '.knowledge', '.info',
        '.facts', '.data', '.statistics', '.numbers', '.figures',
        '.charts', '.graphs', '.tables', '.reports', '.analysis',
        '.study', '.research', '.experiment', '.test', '.trial',
        '.proof', '.evidence', '.result', '.outcome', '.impact',
        '.effect', '.consequence', '.implication', '.significance',
        '.importance', '.value', '.worth', '.price', '.cost', '.fee',
        '.charge', '.payment', '.billing', '.invoice', '.receipt',
        '.transaction', '.exchange', '.trade', '.market', '.commerce',
        '.business', '.enterprise', '.company', '.corporation', '.firm',
        '.agency', '.organization', '.institution', '.association',
        '.society', '.club', '.group', '.team', '.crew', '.squad',
        '.gang', '.band', '.orchestra', '.choir', '.ensemble', '.cast',
        '.troupe', '.company', '.corporation', '.llc', '.inc', '.ltd',
        '.gmbh', '.ag', '.sa', '.nv', '.bv', '.oy', '.ab', '.as',
        '.kk', '.sp', '.sro', '.srl', '.sl', '.sc', '.scsp', '.sas',
        '.snc', '.sarl', '.gbr', '.kg', '.ohg', '.ug', '.gmbhco',
        '.agco', '.ltdco', '.incco', '.corp', '.co', '.com', '.biz',
        '.info', '.net', '.org', '.pro', '.name', '.mobi', '.asia',
        '.tel', '.xxx', '.xyz', '.top', '.club', '.online', '.site',
        '.store', '.tech', '.fun', '.app', '.dev', '.blog', '.design',
        '.art', '.shop', '.news', '.media', '.live', '.space', '.cloud',
        '.link', '.work', '.studio', '.network', '.digital', '.today',
        '.world', '.company', '.services', '.solutions', '.expert',
        '.guru', '.center', '.systems', '.management', '.support',
        '.directory', '.download', '.software', '.tools', '.agency',
        '.guide', '.academy', '.institute', '.education', '.training',
        '.university', '.school', '.college', '.campus', '.careers',
        '.jobs', '.recruitment', '.team', '.staff', '.office',
        '.business', '.enterprise', '.ventures', '.partners',
        '.holdings', '.group', '.global', '.international', '.worldwide',
        '.national', '.regional', '.local', '.city', '.town',
        '.village', '.community', '.society', '.association', '.foundation',
        '.charity', '.ngo', '.org', '.nonprofit', '.fund', '.trust'
    ];

    // 自动添加协议到无协议的URL（核心修改点）
    function addProtocolToUrl(url) {
        if (!url) return url;
        
        url = url.trim();
        
        // 如果已经有协议，直接返回
        if (url.match(/^[a-z]+:\/\//i)) {
            return url;
        }
        
        // 处理特殊协议
        if (url.startsWith('mailto:') || url.startsWith('tel:') || 
            url.startsWith('ftp:') || url.startsWith('file:')) {
            return url;
        }
        
        // 所有情况（包括 www.、纯域名、IP、localhost）都强制加 http://
        return 'http://' + url;
    }

    // 修复编码的URL
    function fixEncodedUrl(url) {
        if (!url) return url;
        
        // 移除多余的引号、空格
        url = url.trim().replace(/^["']+|["']+$/g, '');
        
        // 处理常见的URL编码问题
        const replacements = [
            ['%3A', ':'],
            ['%2F', '/'],
            ['%3F', '?'],
            ['%3D', '='],
            ['%26', '&'],
            ['%25', '%'],
            ['%23', '#'],
            ['%20', ' '],
            ['%2B', '+'],
            ['%2C', ','],
            ['%3B', ';'],
            ['%5B', '['],
            ['%5D', ']'],
            ['%7B', '{'],
            ['%7D', '}'],
            ['%7C', '|'],
            ['%5C', '\\'],
            ['%5E', '^'],
            ['%60', '`'],
            ['%3C', '<'],
            ['%3E', '>'],
            [' ', '%20']
        ];
        
        let fixedUrl = url;
        for (const [encoded, decoded] of replacements) {
            fixedUrl = fixedUrl.replace(new RegExp(encoded, 'gi'), decoded);
        }
        
        // 尝试完整URL解码
        try {
            fixedUrl = decodeURIComponent(fixedUrl);
        } catch (e) {
            try {
                fixedUrl = decodeURI(fixedUrl);
            } catch (e2) {
                if (CONFIG.debug) console.log('URL解码失败:', e2);
            }
        }
        
        // 自动添加协议
        fixedUrl = addProtocolToUrl(fixedUrl);
        
        return fixedUrl;
    }

    // 从查询字符串中提取和修复URL
    function extractAndFixUrlFromQuery(query) {
        if (!query) return null;
        
        // 1. 尝试提取完整的URL
        const urlPatterns = [
            // 完整URL（可能被编码）
            /(https?%3A%2F%2F[^\s&]+)/gi,
            /(https?:\/\/[^\s]+)/gi,
            // www开头的URL
            /(www\.[^\s]+\.[a-z]{2,}[^\s]*)/gi,
            // 无协议的域名+路径
            /([a-z0-9\-]+\.[a-z]{2,}\/[^\s]+)/gi,
            // 无协议的简单域名
            /([a-z0-9\-]+\.[a-z]{2,}[^\s]*)/gi,
            // IP地址
            /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}[^\s]*)/gi,
            // 本地地址
            /(localhost[^\s]*)/gi,
            /(127\.0\.0\.1[^\s]*)/gi
        ];
        
        for (const pattern of urlPatterns) {
            const matches = query.match(pattern);
            if (matches && matches.length > 0) {
                // 返回第一个匹配的URL
                let url = matches[0];
                url = fixEncodedUrl(url);
                
                if (isValidUrl(url)) {
                    return url;
                }
            }
        }
        
        // 2. 尝试从混合文本中提取
        const mixedPatterns = [
            /(?:搜索|search|查找|find|网址|url|链接|link|打开|访问|goto|go to)[\s:：]*[\w\s]*?((?:https?:\/\/|www\.|ftp:\/\/)[^\s]+)/i,
            /[\w\s]*?((?:https?:\/\/|www\.|ftp:\/\/)[^\s]+)/i,
            /[\w\s]*?([a-z0-9\-]+\.[a-z]{2,}[^\s]*)/i
        ];
        
        for (const pattern of mixedPatterns) {
            const match = query.match(pattern);
            if (match && match[1]) {
                let url = match[1];
                url = fixEncodedUrl(url);
                
                if (isValidUrl(url)) {
                    return url;
                }
            }
        }
        
        return null;
    }

    // 验证URL是否有效
    function isValidUrl(url) {
        if (!url || typeof url !== 'string') return false;
        
        const urlStr = url.trim();
        
        // 长度检查
        if (urlStr.length < CONFIG.minUrlLength || urlStr.length > CONFIG.maxUrlLength) {
            return false;
        }
        
        try {
            // 确保有协议
            let testUrl = urlStr;
            if (!testUrl.match(/^[a-z]+:\/\//i)) {
                testUrl = 'http://' + testUrl;
            }
            
            // 创建URL对象
            const urlObj = new URL(testUrl);
            
            // 检查协议
            const allowedProtocols = ['http:', 'https:', 'ftp:', 'mailto:', 'tel:', 'file:'];
            if (!allowedProtocols.includes(urlObj.protocol.toLowerCase())) {
                return false;
            }
            
            // 检查主机名
            if (!urlObj.hostname) return false;
            
            // 检查主机名格式
            const hostnamePattern = /^[a-z0-9\-\.:]+$/i;
            if (!hostnamePattern.test(urlObj.hostname)) {
                return false;
            }
            
            // 对于HTTP/HTTPS协议，检查主机名
            if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
                // 允许localhost和IP地址
                if (urlObj.hostname === 'localhost' || 
                    urlObj.hostname.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
                    return true;
                }
                
                // 检查是否有有效的顶级域名
                const hasValidTld = COMMON_TLDS.some(tld => 
                    urlObj.hostname.toLowerCase().endsWith(tld)
                );
                
                if (!hasValidTld && !urlObj.hostname.includes('.')) {
                    return false;
                }
            }
            
            return true;
        } catch (e) {
            // URL对象创建失败，尝试正则验证
            const urlPatterns = [
                /^https?:\/\/([a-z0-9\-]+\.)+[a-z]{2,}(:\d+)?(\/.*)?$/i,
                /^www\.[a-z0-9\-]+\.[a-z]{2,}(:\d+)?(\/.*)?$/i,
                /^[a-z0-9\-]+\.[a-z]{2,}(:\d+)?(\/.*)?$/i,
                /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?(\/.*)?$/i,
                /^localhost(:\d+)?(\/.*)?$/i,
                /^ftp:\/\/[^\s]+$/i,
                /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i,
                /^file:\/\/\/?[^\s]+$/i,
                /^tel:\+?[\d\s\-\(\)]+$/i
            ];
            
            for (const pattern of urlPatterns) {
                if (pattern.test(urlStr)) {
                    return true;
                }
            }
            
            return false;
        }
    }

    // 从URL获取搜索关键词
    function getSearchQueryFromUrl() {
        const url = new URL(window.location.href);
        
        // 尝试所有可能的搜索参数
        for (const param of SEARCH_PARAMS) {
            const value = url.searchParams.get(param);
            if (value && value.trim()) {
                const decodedValue = decodeURIComponent(value.trim());
                if (CONFIG.debug) console.log(`从参数 ${param} 获取到查询:`, decodedValue);
                return decodedValue;
            }
        }
        
        return null;
    }

    // 显示跳转确认弹窗
    function showJumpPopup(url, originalQuery) {
        if (!CONFIG.showPopup) return true;
        
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(2px);
        `;
        
        const popup = document.createElement('div');
        popup.style.cssText = `
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            max-width: 500px;
            width: 90%;
            font-family: -apple-system, system-ui, sans-serif;
        `;
        
        const displayUrl = url.length > 80 ? url.substring(0, 80) + '...' : url;
        const displayQuery = originalQuery.length > 60 ? originalQuery.substring(0, 60) + '...' : originalQuery;
        
        popup.innerHTML = `
            <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">
                <span style="color: #007aff;">🔗</span> 检测到网址
            </h3>
            <div style="background: #f8f9fa; padding: 10px; border-radius: 6px; margin: 10px 0; font-size: 13px; color: #666;">
                <strong>原始搜索词:</strong> ${displayQuery}
            </div>
            <div style="background: #e8f4ff; padding: 15px; border-radius: 8px; margin: 15px 0; border: 1px solid #cce5ff;">
                <strong style="color: #0056b3;">提取的网址:</strong><br>
                <div style="margin-top: 8px; padding: 10px; background: white; border-radius: 4px; border: 1px solid #dee2e6; word-break: break-all; font-family: 'Courier New', monospace; font-size: 13px;">
                    ${displayUrl}
                </div>
                ${!url.startsWith('http') ? '<div style="margin-top: 8px; padding: 6px; background: #fff3cd; border-radius: 4px; border: 1px solid #ffeaa7; font-size: 12px; color: #856404;">⚠️ 已自动添加HTTP协议</div>' : ''}
            </div>
            <p style="margin: 0 0 20px 0; color: #666; font-size: 14px;">
                是否要跳转到这个网址？
            </p>
            <div style="display: flex; justify-content: flex-end; gap: 10px;">
                <button id="cancelBtn" style="padding: 10px 20px; border: 1px solid #ddd; background: white; border-radius: 6px; cursor: pointer; font-size: 14px; transition: all 0.2s;">
                    留在当前页面
                </button>
                <button id="jumpBtn" style="padding: 10px 20px; background: linear-gradient(135deg, #007aff, #0056b3); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s;">
                    🚀 立即跳转
                </button>
            </div>
        `;
        
        overlay.appendChild(popup);
        document.body.appendChild(overlay);
        
        // 添加按钮悬停效果
        const cancelBtn = popup.querySelector('#cancelBtn');
        const jumpBtn = popup.querySelector('#jumpBtn');
        
        cancelBtn.onmouseenter = () => cancelBtn.style.background = '#f8f9fa';
        cancelBtn.onmouseleave = () => cancelBtn.style.background = 'white';
        jumpBtn.onmouseenter = () => jumpBtn.style.background = 'linear-gradient(135deg, #0056b3, #003d82)';
        jumpBtn.onmouseleave = () => jumpBtn.style.background = 'linear-gradient(135deg, #007aff, #0056b3)';
        
        return new Promise((resolve) => {
            cancelBtn.onclick = () => {
                document.body.removeChild(overlay);
                resolve(false);
            };
            
            jumpBtn.onclick = () => {
                document.body.removeChild(overlay);
                resolve(true);
            };
            
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    document.body.removeChild(overlay);
                    document.removeEventListener('keydown', escHandler);
                    resolve(false);
                }
            };
            document.addEventListener('keydown', escHandler);
            
            overlay.onclick = (e) => {
                if (e.target === overlay) {
                    document.body.removeChild(overlay);
                    document.removeEventListener('keydown', escHandler);
                    resolve(false);
                }
            };
        });
    }

    // 主处理函数
    async function processSearchPage() {
        if (!CONFIG.enabled) return;
        
        const query = getSearchQueryFromUrl();
        if (!query) {
            if (CONFIG.debug) console.log('未找到搜索查询');
            return;
        }
        
        if (CONFIG.debug) console.log('原始查询:', query);
        
        const extractedUrl = extractAndFixUrlFromQuery(query);
        
        if (extractedUrl) {
            if (CONFIG.debug) console.log('提取的URL:', extractedUrl);
            
            if (isValidUrl(extractedUrl)) {
                console.log('✅ 发现可跳转的URL:', extractedUrl);
                
                // 显示协议添加信息
                if (!extractedUrl.startsWith('http')) {
                    console.log('⚠️ 已自动添加协议到URL');
                }
                
                let shouldJump = CONFIG.autoJump;
                if (CONFIG.showPopup) {
                    shouldJump = await showJumpPopup(extractedUrl, query);
                }
                
                if (shouldJump) {
                    setTimeout(() => {
                        console.log('正在跳转到:', extractedUrl);
                        window.location.href = extractedUrl;
                    }, CONFIG.delayBeforeJump);
                }
            } else {
                if (CONFIG.debug) console.log('URL验证失败:', extractedUrl);
            }
        } else {
            if (CONFIG.debug) console.log('未提取到URL');
        }
    }

    // 检查是否是搜索引擎页面
    function isSearchEnginePage() {
        const hostname = window.location.hostname.toLowerCase();
        const search = window.location.search;
        
        const searchEngineHosts = [
            'google.', 'bing.', 'baidu.', 'yahoo.', 'duckduckgo.', 'yandex.',
            'sogou.', 'so.com', 'sm.cn', 'ask.com', 'aol.com', 'wolframalpha.',
            'startpage.', 'searx.', 'ecosia.', 'qwant.'
        ];
        
        for (const host of searchEngineHosts) {
            if (hostname.includes(host)) {
                return true;
            }
        }
        
        for (const param of SEARCH_PARAMS) {
            if (search.includes(param + '=')) {
                return true;
            }
        }
        
        return false;
    }

    // 初始化
    function init() {
        if (isSearchEnginePage()) {
            if (CONFIG.debug) console.log('检测到搜索引擎页面');
            
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    setTimeout(processSearchPage, 500);
                });
            } else {
                setTimeout(processSearchPage, 500);
            }
            
            let lastUrl = window.location.href;
            const observer = new MutationObserver(() => {
                const currentUrl = window.location.href;
                if (currentUrl !== lastUrl) {
                    lastUrl = currentUrl;
                    if (isSearchEnginePage()) {
                        setTimeout(processSearchPage, 300);
                    }
                }
            });
            
            observer.observe(document, { subtree: true, childList: true });
        }
    }

    // 启动脚本
    init();
    
    // 提供全局函数供调试
    window.AutoProtocolUrlExtractor = {
        addProtocol: addProtocolToUrl,
        fixUrl: fixEncodedUrl,
        extractUrl: extractAndFixUrlFromQuery,
        isValidUrl: isValidUrl,
        getQuery: getSearchQueryFromUrl,
        process: processSearchPage
    };

    console.log('🔗 自动协议URL提取器已加载');
})();