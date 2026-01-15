// ==UserScript==
// @name         PTSKit种子审核助手
// @name:en      PTSKit Torrent Audit Assistant
// @namespace    https://greasyfork.org/users/your-user-id
// @version      1.2.1
// @description  基于PT Auto Audit系统的审核规则，为人工审核提供智能辅助建议（含快捷审核按钮、备注编辑、自动提交）
// @description:en  Smart audit assistant for PTSKit based on PT Auto Audit rules
// @author       PT-Audit-System
// @match        *://*.ptskit.org/details.php*
// @match        *://*.ptskit.org/seed_review.php*
// @icon         https://www.ptskit.org/favicon.ico
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @license      MIT
// @supportURL   https://github.com/your-username/ptskit-audit-userscript/issues
// @homepageURL  https://greasyfork.org/scripts/your-script-id
// @downloadURL https://update.greasyfork.org/scripts/562611/PTSKit%E7%A7%8D%E5%AD%90%E5%AE%A1%E6%A0%B8%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/562611/PTSKit%E7%A7%8D%E5%AD%90%E5%AE%A1%E6%A0%B8%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置 ====================
    const CONFIG = {
        // 显示位置：1=页面最上方，2=主标题正下方，3=主标题正上方
        position: GM_getValue('position', 2),
        // 自动展开详细规则结果
        autoExpand: GM_getValue('autoExpand', false),
        // 严格模式（更严格的检查）
        strictMode: GM_getValue('strictMode', false),
        // 自动提交表单（快捷审核按钮填写表单后自动提交）
        autoSubmit: GM_getValue('autoSubmit', true)
    };

    // 流媒体域名（用于识别分集链接）
    const STREAMING_DOMAINS = [
        'iqiyi.com',
        'v.qq.com',
        'youku.com',
        'bilibili.com',
        'mgtv.com',
        'tv.sohu.com'
    ];

    // 禁止的图床域名
    const BANNED_IMAGE_HOSTS = [
        'imgbb.com',
        'imgur.com',
        'postimg.cc'
    ];

    // ==================== 工具函数 ====================
    
    /**
     * 提取页面信息
     */
    function extractPageInfo() {
        const info = {
            title: '',
            subtitle: '',
            category: '',
            description: '',
            images: [],
            tags: [],
            mediainfo: ''
        };

        // 获取主标题
        const titleElement = $('#top, h1').first();
        if (titleElement.length) {
            info.title = titleElement.text()
                .replace(/禁转|\((已审|冻结|待定)\)|\[(免费|50%|2X免费|30%|2X 50%)\]|\(限时\d+.*\)|\[2X\]|\[(推荐|热门|经典|已审)\]/g, '')
                .replace(/剩余时间.*/g, '')
                .trim();
        }

        // 获取副标题
        const subtitleElement = $('td:contains("副标题")').next();
        if (subtitleElement.length) {
            info.subtitle = subtitleElement.text().trim();
        }

        // 获取类型
        let category = '';
        
        // 允许的类型列表，用于验证提取结果
        const VALID_CATEGORIES = ['电视剧', '电影', '动漫', '综艺', '短剧', '动态漫', '音乐', '游戏', '其他'];
        
        $('table tr').each(function() {
            const cells = $(this).find('td');
            if (cells.length >= 2) {
                const key = cells.eq(0).text().trim().replace(/[:：]/g, '');
                const value = cells.eq(1).text().trim();
                
                // 方法1: 直接匹配"类型"字段，且值必须是有效类型
                if (key === '类型' && VALID_CATEGORIES.includes(value)) {
                    category = value;
                    return false; // 找到后退出循环
                }
                
                // 方法2: 从"基本信息"中提取（与后端一致）
                if (key === '基本信息' && !category) {
                    const match = value.match(/类型[:：]\s*([^\s\n]+)/);
                    if (match && VALID_CATEGORIES.includes(match[1].trim())) {
                        category = match[1].trim();
                    }
                }
            }
        });
        
        info.category = category;

        // 获取简介
        const descElement = $('#kdescr');
        if (descElement.length) {
            info.description = descElement.text().toLowerCase();
            info.mediainfo = descElement.html();
        }

        // 获取图片
        const images = [];
        $('#kdescr img').each(function() {
            const src = $(this).attr('src');
            if (src) {
                images.push(src.trim());
            }
        });
        
        // 分类海报和截图（与后端逻辑一致）
        info.images = [];
        let foundExplicitPoster = false;
        const descriptionText = $('#kdescr').text();
        
        images.forEach((url, index) => {
            let isPoster = false;
            
            // 检查是否有明确的海报标识
            if (url.toLowerCase().includes('poster')) {
                isPoster = true;
                foundExplicitPoster = true;
            } else {
                // 检查图片周围文本
                const imgElement = $(`#kdescr img[src="${url}"]`);
                const context = imgElement.parent().text() || '';
                if (/海报|poster/i.test(context)) {
                    isPoster = true;
                    foundExplicitPoster = true;
                }
            }
            
            info.images.push({
                url: url,
                isPoster: isPoster
            });
        });
        
        // 如果没有明确的海报，将第一张图作为海报（与后端一致）
        if (!foundExplicitPoster && info.images.length > 0) {
            info.images[0].isPoster = true;
        }

        // 获取标签
        const tagsElement = $('td:contains("标签")').next();
        if (tagsElement.length) {
            const tagsText = tagsElement.text().trim();
            if (tagsText && tagsText !== '无') {
                info.tags = tagsText.split(/[,，、]/).map(t => t.trim());
            }
        }

        return info;
    }

    /**
     * 检查是否包含流媒体链接（Episode规则）
     */
    function checkStreamingLinks(description) {
        const errors = [];
        
        // 检查是否包含流媒体链接
        for (const domain of STREAMING_DOMAINS) {
            const regex = new RegExp(`https?://[^\\s]*${domain.replace('.', '\\.')}[^\\s]*`, 'gi');
            const matches = description.match(regex);
            
            if (matches) {
                for (const url of matches) {
                    // 芒果TV特殊处理
                    if (domain === 'mgtv.com') {
                        // 单集链接格式: /b/293002/3552646.html
                        if (/\/b\/\d+\/\d+\.html/i.test(url)) {
                            errors.push(`包含芒果TV单集链接: ${url.substring(0, 50)}...`);
                        }
                    }
                    // 爱奇艺
                    else if (domain === 'iqiyi.com') {
                        if (/\/v_\w+\.html/i.test(url)) {
                            errors.push(`包含爱奇艺单集链接: ${url.substring(0, 50)}...`);
                        }
                    }
                    // 腾讯视频
                    else if (domain === 'v.qq.com') {
                        if (/\/x\/cover\/\w+\/\w+\.html/i.test(url) || /\/x\/page\/\w+\.html/i.test(url)) {
                            errors.push(`包含腾讯视频单集链接: ${url.substring(0, 50)}...`);
                        }
                    }
                }
            }
        }
        
        return errors;
    }

    /**
     * 检查标题中的分集标识（Episode规则）
     * 不允许转载分集种子
     */
    function checkEpisodeInTitle(title, tags) {
        const errors = [];
        
        // 单集标记的正则表达式
        const episodePatterns = [
            /[Ss]\d{1,2}[Ee]\d{1,2}/,           // S01E02, s01e02
            /\bE\d{1,3}\b/,                      // E02, E123
            /\bEP\d{1,3}\b/,                     // EP02, EP123
            /第\d{1,3}集/,                       // 第02集
            /\b\d{1,3}话\b/,                     // 02话
            /- \d{1,3} \[/,                      // - 02 [
            /\[\d{1,3}\]/,                       // [02]（排除年份和分辨率）
        ];
        
        // 先检查是否为完整季度包
        if (isCompleteSeason(title, tags)) {
            return errors;  // 完整季度包，跳过分集检查
        }
        
        // 检测单集标记
        for (const pattern of episodePatterns) {
            const match = title.match(pattern);
            if (match) {
                const matchedText = match[0];
                
                // 排除年份 [2023], [2024]
                if (/^\[(19|20)\d{2}\]$/.test(matchedText)) continue;
                
                // 排除分辨率 [1080p], [2160p]
                if (/^\[\d{3,4}[pi]\]$/i.test(matchedText)) continue;
                
                // 排除 [数字] 中数字>1900 或是分辨率
                if (/^\[\d+\]$/.test(matchedText)) {
                    const num = parseInt(matchedText.match(/\d+/)[0]);
                    if (num > 1900 || [480, 720, 1080, 2160, 4320].includes(num)) continue;
                }
                
                // 检查 S01E01 格式是否是季度包（如 S01E01-E12）
                if (/[Ss]\d{1,2}[Ee]\d{1,2}/.test(matchedText)) {
                    const startIdx = Math.max(0, match.index - 5);
                    const endIdx = Math.min(title.length, match.index + matchedText.length + 15);
                    const context = title.substring(startIdx, endIdx);
                    // 如果有范围连接符，说明是季度包
                    if (/[Ee]\d{1,2}[-~][Ee]?\d{1,2}/.test(context)) continue;
                }
                
                errors.push(`标题包含单集标记: ${matchedText}`);
                break;
            }
        }
        
        return errors;
    }
    
    /**
     * 判断是否为完整季度包
     */
    function isCompleteSeason(title, tags) {
        // tags可能是数组或字符串
        const tagsStr = Array.isArray(tags) ? tags.join(',') : (tags || '');
        
        // 检查标签
        if (tagsStr.includes('官方') || tagsStr.includes('Official')) {
            return true;
        }
        
        // 检查完整季关键字
        const completePatterns = [
            /\bComplete\s+Season\b/i,
            /\bComplete\s+Series\b/i,
            /\bComplete\b/i,
            /全集/,
            /整季/,
            /完整/,
            /S\d{1,2}\s+\d{1,2}-\d{1,2}/i,      // S01 1-12
            /S\d{1,2}E\d{1,2}[-~]E?\d{1,2}/i,   // S01E01-E12
            /E\d{1,2}[-~]E?\d{1,2}/i,           // E01-E12
        ];
        
        for (const pattern of completePatterns) {
            if (pattern.test(title)) return true;
        }
        
        return false;
    }

    /**
     * 检查标题格式（Title规则）
     * 标准格式：剧名 季数 年份 分辨率 来源 编码 音频 制作组
     * 例：Friends S01 1994 1080p WEB-DL H265 AAC2.0-CSWEB
     */
    function checkTitleFormat(title, subtitle) {
        const errors = [];
        const warnings = [];
        
        // 先清理标题（移除促销标签、时间信息等）
        let cleanTitle = title
            .replace(/\[.*?\]/g, '')  // 移除 [免费]、[2X] 等
            .replace(/剩余时间[：:].+/g, '')  // 移除剩余时间
            .trim();
        
        // 检查标题是否为空
        if (!cleanTitle || cleanTitle.length < 3) {
            errors.push('标题过短或为空');
            return { errors, warnings };
        }
        
        // 检查是否包含乱码
        if (/[□�]/.test(cleanTitle)) {
            errors.push('标题包含乱码字符');
        }
        
        // 检查是否包含中文字符（标题应为纯英文）
        if (/[\u4e00-\u9fff]/.test(cleanTitle)) {
            errors.push('标题包含中文字符，应使用纯英文标题');
        }
        
        // 检查是否包含非法字符
        if (/[<>|?*]/.test(cleanTitle)) {
            errors.push('标题包含非法字符（<>|?*）');
        }
        
        // 检查标题长度（太短说明信息不全）
        if (cleanTitle.length < 20) {
            errors.push('标题过短，信息不完整');
        }
        
        // 检查必要信息
        const patterns = {
            '分辨率': /720[pi]|1080[pi]|2160[pi]|4K|UHD/i,
            '视频编码': /H\.?264|H\.?265|HEVC|AVC|x264|x265|AV1|MPEG-?[124]/i,
            '音频': /AAC|AC3|DTS|DDP|DD\+?|FLAC|TrueHD|Atmos|E-?AC-?3|LPCM|PCM|MPEG|\d+Audio[s]?/i
        };
        
        const missing = [];
        const found = {};
        
        for (const [name, pattern] of Object.entries(patterns)) {
            const match = cleanTitle.match(pattern);
            if (match) {
                found[name] = match[0];
            } else {
                missing.push(name);
            }
        }
        
        // 如果缺少关键信息
        if (missing.length > 0) {
            errors.push(`标题缺少必要信息：${missing.join('、')}`);
        }
        
        // 检查多余空格（警告级别）
        if (/\s{2,}/.test(cleanTitle)) {
            warnings.push('标题包含多余空格');
        }
        
        // 检查副标题
        if (!subtitle || subtitle.trim() === '') {
            errors.push('副标题为空');
        } else if (subtitle.length < 2) {
            warnings.push('副标题过短');
        }
        
        return { errors, warnings };
    }

    /**
     * 检查图片（Image规则）
     */
    function checkImages(images) {
        const errors = [];
        const warnings = [];
        const skipReasons = [];
        
        if (images.length === 0) {
            errors.push('未找到任何图片');
            return { errors, warnings, skipReasons };
        }
        
        // 统计海报和截图
        let posterCount = 0;
        let screenshotCount = 0;
        let bannedHostCount = 0;
        
        for (const img of images) {
            // 检查是否使用禁止的图床
            for (const host of BANNED_IMAGE_HOSTS) {
                if (img.url.includes(host)) {
                    bannedHostCount++;
                    break;
                }
            }
            
            if (img.isPoster) {
                posterCount++;
            } else {
                screenshotCount++;
            }
        }
        
        // 检查海报数量（与后端一致：如果第一张图被标记为海报，就认为有海报）
        if (posterCount === 0) {
            errors.push('缺少海报：简介中必须包含海报图片');
        }
        
        // 检查截图数量
        if (screenshotCount === 0) {
            errors.push('未检测到截图');
        } else if (screenshotCount >= 1 && screenshotCount <= 2) {
            skipReasons.push(`截图数量较少（${screenshotCount}张），可能为拼接截图`);
        } else if (screenshotCount < 3) {
            warnings.push(`截图数量偏少（${screenshotCount}张）`);
        }
        
        // 检查总图片数量
        if (images.length <= 2) {
            skipReasons.push(`图片识别存疑：仅识别到${images.length}张图片，可能存在识别遗漏`);
        }
        
        // 检查禁止图床
        if (bannedHostCount > 0) {
            errors.push(`使用了禁止的图床（${bannedHostCount}张）: ${BANNED_IMAGE_HOSTS.join(', ')}`);
        }
        
        return { errors, warnings, skipReasons };
    }

    /**
     * 检查MediaInfo（MediaInfo规则）
     */
    function checkMediaInfo(description, mediainfo) {
        const errors = [];
        const warnings = [];
        const skipReasons = [];
        
        const descLower = description.toLowerCase();
        
        // 检查是否包含MediaInfo
        let hasMediaInfo = false;
        
        // 标准MediaInfo格式
        if ((descLower.includes('general') && descLower.includes('video') && descLower.includes('audio')) ||
            (descLower.includes('概览') && descLower.includes('视频') && descLower.includes('音频'))) {
            hasMediaInfo = true;
        }
        
        // 其他MediaInfo格式
        if (descLower.includes('disc info') || descLower.includes('disc size') || 
            descLower.includes('.release.info') || descLower.includes('general information') ||
            descLower.includes('nfo信息') || descLower.includes('release date') ||
            descLower.includes('release.name') || descLower.includes('release.size')) {
            hasMediaInfo = true;
        }
        
        if (!hasMediaInfo) {
            skipReasons.push('简介中未检测到MediaInfo信息，请确认是否包含');
        }
        
        return { errors, warnings, skipReasons };
    }

    /**
     * 检查类型分类（Category规则）
     */
    function checkCategory(category, subtitle) {
        const errors = [];
        const warnings = [];
        
        // 允许的类型列表
        const ALLOWED_CATEGORIES = ['电视剧', '电影', '动漫', '综艺', '短剧', '动态漫', '音乐', '游戏', '其他'];
        
        // 检查是否在允许列表中
        if (category && !ALLOWED_CATEGORIES.includes(category)) {
            errors.push(`类型分类错误：'${category}' 不是有效的类型`);
        }
        
        // 检查副标题与分类一致性
        if (subtitle && category) {
            const subtitleLower = subtitle.toLowerCase();
            
            // 动漫关键词检查
            const isAnimeKeyword = /动漫|动画|anime|アニメ/.test(subtitleLower);
            const isCategoryAnime = /动漫|漫画|anime/i.test(category);
            if (isAnimeKeyword && !isCategoryAnime) {
                warnings.push('副标题包含动漫关键词，但类型不是动漫');
            }
            
            // 电影关键词检查
            const isMovieKeyword = /电影|movie|film/i.test(subtitleLower);
            const isCategoryMovie = category === '电影';
            if (isMovieKeyword && !isCategoryMovie && category !== '短剧') {
                warnings.push('副标题包含电影关键词，但类型不是电影');
            }
            
            // 综艺关键词检查
            const isVarietyKeyword = /综艺|真人秀|脱口秀|variety/i.test(subtitleLower);
            const isCategoryVariety = category === '综艺';
            if (isVarietyKeyword && !isCategoryVariety) {
                warnings.push('副标题包含综艺关键词，但类型不是综艺');
            }
        }
        
        return { errors, warnings };
    }
    
    /**
     * 检查标签（Tag规则）
     * 逻辑：官方→跳过审核，转载→继续审核，其他→拒绝
     */
    function checkTags(tags) {
        const errors = [];
        const skipReasons = [];
        
        // tags可能是数组或字符串
        const tagsStr = Array.isArray(tags) ? tags.join(',') : (tags || '');
        const isOfficial = tagsStr.includes('官方');
        
        // 官方种子，跳过审核
        if (isOfficial) {
            return { errors, skipReasons, isOfficial: true };
        }
        
        // 转载种子，继续审核
        if (tagsStr.includes('转载')) {
            return { errors, skipReasons, isOfficial: false };
        }
        
        // 其他标签，拒绝
        errors.push('标签不明确：转载种子必须标注"转载"标签');
        return { errors, skipReasons, isOfficial: false };
    }

    /**
     * 执行完整审核
     */
    function performAudit(info) {
        const result = {
            decision: 'approved',  // approved, rejected, skip
            fatal_errors: [],
            warnings: [],
            skip_reasons: [],
            details: {}
        };

        // 0. Tag检查（最优先）
        const tagCheck = checkTags(info.tags);
        result.details.tag = tagCheck;
        
        // 官方种子也要继续执行其他检查，只是最终结果标记为skip
        const isOfficial = tagCheck.isOfficial;
        if (!isOfficial) {
            // 非官方种子，检查标签错误
            result.fatal_errors.push(...tagCheck.errors);
        }

        // 1. Episode检查（传入tags用于判断完整季）
        const episodeTitle = checkEpisodeInTitle(info.title, info.tags);
        const episodeLinks = checkStreamingLinks(info.description);
        // 检查副标题是否包含"分集"
        const subtitleHasFenJi = info.subtitle && info.subtitle.includes('分集');
        result.details.episode = {
            title_errors: episodeTitle,
            link_errors: episodeLinks,
            subtitle_fenji: subtitleHasFenJi
        };
        if (subtitleHasFenJi) {
            result.fatal_errors.push('副标题包含"分集"，不允许转载分集');
        }
        if (episodeTitle.length > 0 || episodeLinks.length > 0) {
            result.fatal_errors.push(...episodeTitle);
            result.fatal_errors.push(...episodeLinks);
        }

        // 2. Title检查
        const titleCheck = checkTitleFormat(info.title, info.subtitle);
        result.details.title = titleCheck;
        result.fatal_errors.push(...titleCheck.errors);
        result.warnings.push(...titleCheck.warnings);

        // 3. Image检查
        const imageCheck = checkImages(info.images);
        result.details.image = imageCheck;
        result.fatal_errors.push(...imageCheck.errors);
        result.warnings.push(...imageCheck.warnings);
        result.skip_reasons.push(...imageCheck.skipReasons);

        // 4. MediaInfo检查
        const mediainfoCheck = checkMediaInfo(info.description, info.mediainfo);
        result.details.mediainfo = mediainfoCheck;
        result.warnings.push(...mediainfoCheck.warnings);
        result.skip_reasons.push(...mediainfoCheck.skipReasons);

        // 5. Category检查
        const categoryCheck = checkCategory(info.category, info.subtitle);
        result.details.category = categoryCheck;
        result.fatal_errors.push(...categoryCheck.errors);
        result.warnings.push(...categoryCheck.warnings);

        // 决定最终审核结果
        // 官方种子优先级最高，直接标记为skip
        if (isOfficial) {
            result.skip_reasons.unshift('官方种子，无需审核');
            result.decision = 'skip';
        } else if (result.skip_reasons.length > 0) {
            result.decision = 'skip';
        } else if (result.fatal_errors.length > 0) {
            result.decision = 'rejected';
        } else {
            result.decision = 'approved';
        }

        return result;
    }

    /**
     * 显示审核结果
     */
    function displayAuditResult(result, info) {
        // 移除旧的审核结果
        $('#audit-assistant-panel').remove();

        // 创建审核结果面板
        const panel = $('<div id="audit-assistant-panel"></div>');
        
        // 决定颜色和标题（柔和护眼配色）
        let bgColor, textColor, borderColor, icon, title;
        if (result.decision === 'approved') {
            bgColor = '#E8F5E9';  // 淡绿色背景
            textColor = '#2E7D32';  // 深绿色文字
            borderColor = '#81C784';  // 中绿色边框
            icon = '✅';
            title = '可以通过';
        } else if (result.decision === 'rejected') {
            bgColor = '#FFEBEE';  // 淡红色背景
            textColor = '#C62828';  // 深红色文字
            borderColor = '#E57373';  // 中红色边框
            icon = '❌';
            title = '不建议通过';
        } else {
            bgColor = '#FFF8E1';  // 淡黄色背景
            textColor = '#F57C00';  // 深橙色文字
            borderColor = '#FFB74D';  // 中橙色边框
            icon = '⚠️';
            title = '需要仔细检查';
        }

        // 面板样式（柔和设计）
        panel.css({
            'display': 'block',
            'padding': '15px 25px',
            'margin': '10px 0',
            'background': bgColor,
            'color': textColor,
            'font-weight': 'bold',
            'border-radius': '8px',
            'border': `2px solid ${borderColor}`,
            'box-shadow': '0 2px 8px rgba(0,0,0,0.08)',
            'position': 'relative'
        });

        // 构建内容
        let html = `<div style="font-size: 16px; margin-bottom: 10px;">${icon} ${title}</div>`;
        
        // 备注输入框
        let defaultComment = '';
        if (result.fatal_errors.length > 0) {
            defaultComment = result.fatal_errors.map(e => `• ${e}`).join('\n');
        }
        html += '<div style="margin: 10px 0;">';
        html += '<label style="font-size: 12px; font-weight: normal; display: block; margin-bottom: 5px;">📝 审核备注（拒绝时必填）:</label>';
        html += `<textarea id="audit-comment" style="width: 100%; height: 100px; padding: 8px; border: 1px solid ${borderColor}; border-radius: 5px; font-size: 13px; resize: vertical; box-sizing: border-box; min-height: 60px; max-height: 200px;" placeholder="填写审核备注...">${defaultComment}</textarea>`;
        html += '</div>';
        
        // 快捷审核按钮（增强视觉反馈）
        html += '<div style="margin: 10px 0; display: flex; gap: 12px;">';
        html += '<button id="quick-approve-btn" style="flex: 1; padding: 12px 16px; background: linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 15px; transition: all 0.15s ease; box-shadow: 0 3px 6px rgba(76,175,80,0.3);">✅ 通过</button>';
        html += '<button id="quick-reject-btn" style="flex: 1; padding: 12px 16px; background: linear-gradient(135deg, #EF5350 0%, #E53935 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 15px; transition: all 0.15s ease; box-shadow: 0 3px 6px rgba(244,67,54,0.3);">❌ 拒绝</button>';
        html += '</div>';
        // 添加按钮悬停和点击效果
        html += '<style>';
        html += '#quick-approve-btn:hover { background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%); transform: translateY(-2px); box-shadow: 0 6px 12px rgba(76,175,80,0.4); }';
        html += '#quick-approve-btn:active { transform: translateY(1px) scale(0.98); box-shadow: 0 2px 4px rgba(76,175,80,0.3); }';
        html += '#quick-reject-btn:hover { background: linear-gradient(135deg, #E53935 0%, #C62828 100%); transform: translateY(-2px); box-shadow: 0 6px 12px rgba(244,67,54,0.4); }';
        html += '#quick-reject-btn:active { transform: translateY(1px) scale(0.98); box-shadow: 0 2px 4px rgba(244,67,54,0.3); }';
        html += '#quick-approve-btn:disabled, #quick-reject-btn:disabled { transform: none; box-shadow: none; cursor: not-allowed; }';
        html += '#audit-comment:focus { outline: none; border-color: #2196F3; box-shadow: 0 0 0 3px rgba(33,150,243,0.2); }';
        html += '@keyframes btnSuccess { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }';
        html += '@keyframes btnPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(76,175,80,0.5); } 50% { box-shadow: 0 0 0 8px rgba(76,175,80,0); } }';
        html += '@keyframes shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-5px); } 40%, 80% { transform: translateX(5px); } }';
        html += '</style>';

        // 致命错误（更柔和的提示框）
        if (result.fatal_errors.length > 0) {
            html += '<div style="margin-top: 10px; padding: 10px; background: rgba(198, 40, 40, 0.1); border-left: 3px solid #C62828; border-radius: 5px;">';
            html += '<strong>❌ 发现问题:</strong><br>';
            result.fatal_errors.forEach(err => {
                html += `• ${err}<br>`;
            });
            html += '</div>';
        }

        // 需要确认的问题（更柔和的提示框）
        if (result.skip_reasons.length > 0) {
            html += '<div style="margin-top: 10px; padding: 10px; background: rgba(245, 124, 0, 0.1); border-left: 3px solid #F57C00; border-radius: 5px;">';
            html += '<strong>⚠️ 需要确认:</strong><br>';
            result.skip_reasons.forEach(reason => {
                html += `• ${reason}<br>`;
            });
            html += '</div>';
        }

        // 警告
        if (result.warnings.length > 0) {
            html += '<div style="margin-top: 10px; padding: 10px; background: rgba(0,0,0,0.08); border-radius: 5px;">';
            html += '<strong>💡 提示:</strong><br>';
            result.warnings.forEach(warn => {
                html += `• ${warn}<br>`;
            });
            html += '</div>';
        }

        // 详细信息（可折叠）
        html += '<div style="margin-top: 10px;">';
        html += '<button id="toggle-details" style="padding: 5px 15px; background: rgba(0,0,0,0.1); color: ' + textColor + '; border: none; border-radius: 5px; cursor: pointer; font-weight: normal;">查看详情</button>';
        html += '<div id="audit-details" style="display: none; margin-top: 10px; padding: 10px; background: rgba(0,0,0,0.1); border-radius: 5px; font-size: 12px; font-weight: normal;">';
        
        // 各项规则检查结果
        html += '<strong>📋 规则检查详情:</strong><br><br>';
        html += `• <strong>Tag检查:</strong> ${result.details.tag ? (result.details.tag.isOfficial ? '⏭ 官方种子' : (result.details.tag.errors.length === 0 ? '✓ 转载标签' : '✗ 标签问题')) : '⚠ 未检查'}<br>`;
        html += `• <strong>Episode检查:</strong> ${result.details.episode.title_errors.length + result.details.episode.link_errors.length === 0 && !result.details.episode.subtitle_fenji ? '✓ 通过' : '✗ 发现问题'}<br>`;
        html += `• <strong>Title检查:</strong> ${result.details.title.errors.length === 0 ? '✓ 通过' : '✗ 发现问题'}<br>`;
        html += `• <strong>Image检查:</strong> ${result.details.image.errors.length === 0 && result.details.image.skipReasons.length === 0 ? '✓ 通过' : (result.details.image.skipReasons.length > 0 ? '⚠ 需确认' : '✗ 发现问题')}<br>`;
        html += `• <strong>MediaInfo检查:</strong> ${result.details.mediainfo.warnings.length === 0 ? '✓ 通过' : '⚠ 有警告'}<br>`;
        html += `• <strong>Category检查:</strong> ${result.details.category.errors.length === 0 ? '✓ 通过' : '✗ 发现问题'}<br>`;
        html += '<br>';
        html += `<strong>图片统计:</strong> 共${info.images.length}张图片<br>`;
        html += `<strong>标题:</strong> ${info.title.substring(0, 60)}${info.title.length > 60 ? '...' : ''}<br>`;
        html += `<strong>副标题:</strong> ${info.subtitle || '(无)'}<br>`;
        html += `<strong>类型:</strong> ${info.category || '(未选择)'}<br>`;
        html += `<strong>标签:</strong> ${info.tags.length > 0 ? info.tags.join(', ') : '(无)'}<br>`;
        
        html += '</div>';
        html += '</div>';

        panel.html(html);

        // 根据配置插入位置
        if (CONFIG.position === 1) {
            $('#outer').prepend(panel);
        } else if (CONFIG.position === 2) {
            $('#top').after(panel);
        } else {
            $('#top').before(panel);
        }

        // 绑定展开/折叠事件
        $('#toggle-details').click(function() {
            const details = $('#audit-details');
            if (details.is(':visible')) {
                details.slideUp();
                $(this).text('查看详情');
            } else {
                details.slideDown();
                $(this).text('收起详情');
            }
        });

        // 自动展开
        if (CONFIG.autoExpand) {
            $('#audit-details').show();
            $('#toggle-details').text('收起详情');
        }

        // 绑定快捷审核按钮事件
        $('#quick-approve-btn').click(function() {
            console.log('✅ 点击了通过按钮');
            const $btn = $(this);
            const comment = $('#audit-comment').val().trim() || '审核通过';
            
            // 点击反馈动画
            $btn.css({
                'background': 'linear-gradient(135deg, #388E3C 0%, #2E7D32 100%)',
                'animation': 'btnSuccess 0.3s ease'
            }).html('⏳ 提交中...');
            $btn.prop('disabled', true);
            $('#quick-reject-btn').prop('disabled', true).css('opacity', '0.5');
            
            submitAuditDirectly(true, comment);
        });

        $('#quick-reject-btn').click(function() {
            const comment = $('#audit-comment').val().trim();
            if (!comment) {
                showToast('❌ 拒绝时必须填写备注', 'error');
                $('#audit-comment').focus().css({
                    'border-color': '#F44336',
                    'box-shadow': '0 0 0 3px rgba(244,67,54,0.2)'
                });
                // 抖动动画
                $('#audit-comment').css('animation', 'shake 0.3s ease');
                setTimeout(() => $('#audit-comment').css('animation', ''), 300);
                return;
            }
            
            console.log('❌ 点击了拒绝按钮');
            const $btn = $(this);
            
            // 点击反馈动画
            $btn.css({
                'background': 'linear-gradient(135deg, #C62828 0%, #B71C1C 100%)',
                'animation': 'btnSuccess 0.3s ease'
            }).html('⏳ 提交中...');
            $btn.prop('disabled', true);
            $('#quick-approve-btn').prop('disabled', true).css('opacity', '0.5');
            
            submitAuditDirectly(false, comment);
        });

        /**
         * 直接通过API提交审核
         * @param {boolean} approve - true为通过，false为拒绝
         * @param {string} comment - 审核备注
         */
        function submitAuditDirectly(approve, comment) {
            // 从URL获取种子ID
            const torrentId = new URLSearchParams(window.location.search).get('id');
            
            if (!torrentId) {
                showToast('❌ 无法获取种子ID', 'error');
                $('#quick-approve-btn, #quick-reject-btn').prop('disabled', false).css('opacity', '1');
                return;
            }
            
            console.log('种子ID:', torrentId, '审核:', approve ? '通过' : '拒绝');
            
            // 尝试多种可能的API端点
            const apiEndpoints = [
                {
                    name: 'NexusPHP新版API',
                    getUrl: `https://www.ptskit.org/web/torrent-approval-page?torrent_id=${torrentId}`,
                    postUrl: 'https://www.ptskit.org/web/torrent-approval',
                    tokenSelector: 'input[name="_token"]',
                    formBuilder: (token) => {
                        const formData = new URLSearchParams();
                        formData.append('_token', token);
                        formData.append('torrent_id', torrentId);
                        formData.append('approval_status', approve ? '1' : '2');
                        formData.append('comment', comment);
                        return formData.toString();
                    }
                },
                {
                    name: 'NexusPHP传统API',
                    getUrl: `https://www.ptskit.org/seed_review.php?id=${torrentId}`,
                    postUrl: 'https://www.ptskit.org/seed_review.php',
                    tokenSelector: 'input[name="_token"], input[name="csrf_token"], input[name="token"]',
                    formBuilder: (token) => {
                        const formData = new URLSearchParams();
                        formData.append('_token', token);
                        formData.append('id', torrentId);
                        formData.append('action', approve ? 'approve' : 'reject');
                        formData.append('comment', comment);
                        return formData.toString();
                    }
                }
            ];
            
            // 尝试第一个端点
            tryEndpoint(0);
            
            function tryEndpoint(index) {
                if (index >= apiEndpoints.length) {
                    console.error('所有API端点均失败，回退到传统方式');
                    showToast('❌ 无法获取审核token，尝试传统方式...', 'warning');
                    handleQuickAudit(approve ? 'approve' : 'reject');
                    return;
                }
                
                const endpoint = apiEndpoints[index];
                console.log(`尝试API端点 ${index + 1}/${apiEndpoints.length}: ${endpoint.name}`);
                console.log('请求URL:', endpoint.getUrl);
                
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: endpoint.getUrl,
                    onload: function(res) {
                        console.log(`${endpoint.name} 响应:`, res.status);
                        
                        if (res.status !== 200) {
                            console.log(`${endpoint.name} 返回状态码 ${res.status}，尝试下一个`);
                            tryEndpoint(index + 1);
                            return;
                        }
                        
                        // 尝试从响应中提取token
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(res.responseText, 'text/html');
                        
                        // 调试：输出页面结构
                        console.log('页面标题:', doc.title);
                        console.log('表单数量:', doc.querySelectorAll('form').length);
                        console.log('输入框数量:', doc.querySelectorAll('input').length);
                        
                        const tokenInput = doc.querySelector(endpoint.tokenSelector);
                        
                        if (tokenInput) {
                            const token = tokenInput.value;
                            console.log(`✅ ${endpoint.name} 获取到token:`, token.substring(0, 20) + '...');
                            
                            // 提交审核
                            const formData = endpoint.formBuilder(token);
                            console.log('提交URL:', endpoint.postUrl);
                            console.log('提交数据:', formData);
                            
                            GM_xmlhttpRequest({
                                method: 'POST',
                                url: endpoint.postUrl,
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                },
                                data: formData,
                                onload: function(response) {
                                    console.log('提交响应:', response.status);
                                    console.log('响应内容:', response.responseText.substring(0, 500));
                                    
                                    // 尝试解析JSON响应
                                    try {
                                        const jsonRes = JSON.parse(response.responseText);
                                        console.log('JSON响应:', jsonRes);
                                        if (jsonRes.ret === 0 || jsonRes.success === true || jsonRes.status === 'success') {
                                            showToast('✅ 审核已提交成功！', 'success');
                                            setTimeout(() => location.reload(), 1500);
                                            return;
                                        }
                                    } catch (e) {
                                        // 不是JSON响应
                                    }
                                    
                                    // 检查HTML响应
                                    if (response.status === 200 || response.status === 302) {
                                        showToast('✅ 审核已提交成功！', 'success');
                                        setTimeout(() => location.reload(), 1500);
                                    } else {
                                        console.log('提交失败，尝试下一个端点');
                                        tryEndpoint(index + 1);
                                    }
                                },
                                onerror: function(err) {
                                    console.error('提交错误:', err);
                                    tryEndpoint(index + 1);
                                }
                            });
                        } else {
                            console.log(`❌ ${endpoint.name} 未找到token，尝试下一个`);
                            // 调试：列出所有input
                            doc.querySelectorAll('input').forEach((input, i) => {
                                console.log(`Input ${i}:`, {
                                    name: input.name,
                                    type: input.type,
                                    id: input.id,
                                    value: input.value ? input.value.substring(0, 20) + '...' : ''
                                });
                            });
                            tryEndpoint(index + 1);
                        }
                    },
                    onerror: function(err) {
                        console.error(`${endpoint.name} 请求错误:`, err);
                        tryEndpoint(index + 1);
                    }
                });
            }
        }
        
        /**
         * 显示提示消息
         */
        function showToast(message, type = 'info') {
            const colors = {
                'info': { bg: '#2196F3', icon: '🔵' },
                'success': { bg: '#4CAF50', icon: '✅' },
                'error': { bg: '#F44336', icon: '❌' },
                'warning': { bg: '#FF9800', icon: '⚠️' }
            };
            
            const color = colors[type] || colors.info;
            const toast = $('<div></div>').css({
                'position': 'fixed',
                'top': '20px',
                'right': '20px',
                'background': color.bg,
                'color': 'white',
                'padding': '12px 20px',
                'border-radius': '5px',
                'box-shadow': '0 4px 12px rgba(0,0,0,0.3)',
                'z-index': '10000',
                'font-weight': 'bold',
                'animation': 'slideIn 0.3s ease-out'
            }).text(`${color.icon} ${message}`);
            
            $('body').append(toast);
            
            setTimeout(() => {
                toast.fadeOut(300, function() {
                    $(this).remove();
                });
            }, 3000);
        }
        
        /**
         * 处理快捷审核
         * @param {string} action - 'approve' 或 'reject'
         */
        function handleQuickAudit(action) {
            console.log('=== 开始快捷审核 ===');
            console.log('操作类型:', action);
            
            // 1. 先尝试找到审核按钮并点击打开弹窗
            // 尝试多种可能的审核按钮选择器
            const auditBtnSelectors = [
                'a:contains("审核")',
                'button:contains("审核")',
                'input[value*="审核"]',
                '[onclick*="audit"]',
                '[onclick*="review"]',
                '.audit-btn',
                '#audit-btn',
                'a[href*="audit"]',
                '.approval' // 根据日志中的class
            ];
            
            let auditBtn = null;
            for (const selector of auditBtnSelectors) {
                const btn = $(selector).filter(':visible').first();
                if (btn.length > 0) {
                    auditBtn = btn;
                    console.log('找到审核按钮:', selector);
                    console.log('按钮文本:', btn.text());
                    console.log('按钮HTML:', btn[0].outerHTML);
                    break;
                }
            }
            
            if (auditBtn && auditBtn.length > 0) {
                console.log('点击审核按钮...');
                
                // 触发多种点击事件以确保弹窗打开
                const element = auditBtn[0];
                
                // 方法1: jQuery click
                auditBtn.trigger('click');
                
                // 方法2: 原生click
                element.click();
                
                // 方法3: 模拟真实的鼠标事件
                const clickEvent = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                element.dispatchEvent(clickEvent);
                
                console.log('等待弹窗加载（使用智能等待）...');
                
                // 使用智能等待：检测弹窗是否出现
                waitForModal(action, 0);
            } else {
                console.log('未找到审核按钮，尝试直接填写表单...');
                showToast('⚠️ 未找到审核按钮，尝试直接填写表单', 'warning');
                fillAuditForm(action);
            }
        }
        
        /**
         * 智能等待弹窗出现
         * @param {string} action - 'approve' 或 'reject'
         * @param {number} attempt - 当前尝试次数
         */
        function waitForModal(action, attempt) {
            const maxAttempts = 20; // 最多尝试20次（4秒）
            const checkInterval = 200; // 每200ms检查一次
            
            // 检查是否有可见的单选按钮
            const radios = $('input[type="radio"]:visible');
            console.log(`尝试 ${attempt + 1}/${maxAttempts}: 找到 ${radios.length} 个可见单选按钮`);
            
            if (radios.length > 0) {
                console.log('✅ 弹窗已加载，开始填写表单');
                fillAuditForm(action);
            } else if (attempt < maxAttempts) {
                // 继续等待
                setTimeout(() => {
                    waitForModal(action, attempt + 1);
                }, checkInterval);
            } else {
                console.log(' 等待超时，弹窗未出现');
                showToast(' 审核弹窗未能正常打开', 'error');
                $('#quick-approve-btn, #quick-reject-btn').prop('disabled', false).css('opacity', '1');
                alert('审核弹窗未能正常打开\n\n可能原因：\n1. 没有审核权限\n2. 弹窗被浏览器拦截\n3. 页面脚本冲突\n\n请尝试手动点击"审核"按钮');
            }
        }

        /**
         * 填写审核表单
         * @param {string} action - 'approve' 或 'reject'
         */
        function fillAuditForm(action) {
            console.log('=== 开始填写表单 ===');
            console.log('当前可见的单选按钮数量:', $('input[type="radio"]:visible').length);
            console.log('当前可见的表单数量:', $('form:visible').length);
            console.log('当前可见的弹窗数量:', $('.modal:visible, .dialog:visible, [role="dialog"]:visible').length);
            
            // 打印所有可见的单选按钮信息
            $('input[type="radio"]:visible').each(function(i, el) {
                console.log(`单选按钮 ${i}:`, {
                    name: $(el).attr('name'),
                    value: $(el).attr('value'),
                    id: $(el).attr('id'),
                    checked: $(el).prop('checked'),
                    label: $(el).closest('label').text() || $(el).parent().text()
                });
            });
            
            let found = false;

            if (action === 'approve') {
                console.log('--- 查找通过选项 ---');
                // 查找"通过"选项 - 尝试多种可能的选择器
                const approveSelectors = [
                    'input[type="radio"][value*="通过"]:visible',
                    'input[type="radio"][value="2"]:visible',
                    'input[type="radio"][value="pass"]:visible',
                    'input[name*="audit"][value="2"]:visible',
                    'input[name*="status"][value="2"]:visible',
                    'label:contains("通过") input[type="radio"]:visible',
                    'input[type="radio"]:visible:eq(1)' // 尝试第二个单选按钮（通常第一个是"未审"）
                ];

                for (const selector of approveSelectors) {
                    console.log('尝试选择器:', selector);
                    const radio = $(selector);
                    console.log('找到元素数量:', radio.length);
                    if (radio.length > 0) {
                        radio.first().prop('checked', true).trigger('change').trigger('click');
                        found = true;
                        console.log('✅ 已选择通过选项:', selector);
                        console.log('选中的元素:', radio[0]);
                        
                        // 高亮提示
                        radio.first().closest('.modal, .dialog, form, tr, div, body').first().css('background-color', '#E8F5E9');
                        setTimeout(() => {
                            radio.first().closest('.modal, .dialog, form, tr, div, body').first().css('background-color', '');
                        }, 2000);
                        break;
                    }
                }
            } else if (action === 'reject') {
                console.log('--- 查找拒绝选项 ---');
                // 查找"拒绝"选项
                const rejectSelectors = [
                    'input[type="radio"][value*="拒绝"]:visible',
                    'input[type="radio"][value="3"]:visible',
                    'input[type="radio"][value="reject"]:visible',
                    'input[name*="audit"][value="3"]:visible',
                    'input[name*="status"][value="3"]:visible',
                    'label:contains("拒绝") input[type="radio"]:visible',
                    'input[type="radio"]:visible:eq(2)' // 尝试第三个单选按钮
                ];

                for (const selector of rejectSelectors) {
                    console.log('尝试选择器:', selector);
                    const radio = $(selector);
                    console.log('找到元素数量:', radio.length);
                    if (radio.length > 0) {
                        radio.first().prop('checked', true).trigger('change').trigger('click');
                        found = true;
                        console.log('✅ 已选择拒绝选项:', selector);
                        console.log('选中的元素:', radio[0]);
                        
                        // 填写拒绝理由
                        setTimeout(() => {
                            console.log('--- 查找备注框 ---');
                            const reasonSelectors = [
                                'textarea[name*="reason"]:visible',
                                'textarea[name*="remark"]:visible',
                                'textarea[name*="comment"]:visible',
                                'textarea[name*="备注"]:visible',
                                'textarea[name*="note"]:visible',
                                'textarea:visible'
                            ];

                            for (const textareaSelector of reasonSelectors) {
                                console.log('尝试备注框选择器:', textareaSelector);
                                const textarea = $(textareaSelector).first();
                                console.log('找到备注框数量:', textarea.length);
                                if (textarea.length > 0) {
                                    if (result.fatal_errors.length > 0) {
                                        let rejectReason = '发现以下问题：\n';
                                        result.fatal_errors.forEach(err => {
                                            rejectReason += `• ${err}\n`;
                                        });
                                        textarea.val(rejectReason).trigger('input').trigger('change');
                                        console.log('✅ 已自动填写拒绝理由:', rejectReason);
                                    } else {
                                        console.log('⚠️ 没有检测到问题，跳过填写');
                                    }
                                    break;
                                }
                            }
                        }, 200);
                        
                        // 高亮提示
                        radio.first().closest('.modal, .dialog, form, tr, div, body').first().css('background-color', '#FFEBEE');
                        setTimeout(() => {
                            radio.first().closest('.modal, .dialog, form, tr, div, body').first().css('background-color', '');
                        }, 2000);
                        break;
                    }
                }
            }

            if (!found) {
                console.log('❌ 未找到审核表单元素');
                showToast('❌ 未找到审核表单', 'error');
                $('#quick-approve-btn, #quick-reject-btn').prop('disabled', false).css('opacity', '1');
                alert('未找到审核表单，请确认审核弹窗是否已打开\n\n请按F12查看控制台日志获取详细信息');
            } else {
                console.log('✅ 表单填写成功');
                // 提示用户点击提交
                setTimeout(() => {
                    console.log('--- 查找提交按钮 ---');
                    const submitSelectors = [
                        'button:contains("提交"):visible',
                        'input[type="submit"]:visible',
                        'input[value*="提交"]:visible',
                        'input[value*="确定"]:visible',
                        'button:contains("确定"):visible',
                        'button:contains("保存"):visible'
                    ];
                    
                    let submitBtn = null;
                    for (const selector of submitSelectors) {
                        const btn = $(selector).first();
                        if (btn.length > 0) {
                            submitBtn = btn;
                            console.log('找到提交按钮:', selector);
                            break;
                        }
                    }
                    
                    if (submitBtn && submitBtn.length > 0) {
                        console.log('找到提交按钮，配置autoSubmit:', CONFIG.autoSubmit);
                        
                        if (CONFIG.autoSubmit) {
                            // 自动提交表单
                            console.log('🚀 自动提交表单...');
                            
                            // 尝试多种提交方式
                            setTimeout(() => {
                                // 方法1: jQuery trigger
                                submitBtn.trigger('click');
                                
                                // 方法2: 原生click
                                submitBtn[0].click();
                                
                                // 方法3: 模拟鼠标事件
                                const clickEvent = new MouseEvent('click', {
                                    view: window,
                                    bubbles: true,
                                    cancelable: true
                                });
                                submitBtn[0].dispatchEvent(clickEvent);
                                
                                // 方法4: 如果是在表单内，尝试提交表单
                                const form = submitBtn.closest('form');
                                if (form.length > 0) {
                                    console.log('找到表单，尝试提交表单');
                                    form.trigger('submit');
                                    form[0].submit();
                                }
                                
                                console.log('✅ 已自动提交审核表单');
                                showToast('✅ 审核表单已提交！', 'success');
                                
                                // 显示成功提示
                                const successMsg = $('<div></div>').css({
                                    'position': 'fixed',
                                    'top': '20px',
                                    'right': '20px',
                                    'background': '#4CAF50',
                                    'color': 'white',
                                    'padding': '15px 25px',
                                    'border-radius': '5px',
                                    'box-shadow': '0 2px 10px rgba(0,0,0,0.3)',
                                    'z-index': '999999',
                                    'font-weight': 'bold'
                                }).text('✅ 审核表单已提交').appendTo('body');
                                
                                setTimeout(() => {
                                    successMsg.fadeOut(500, function() {
                                        $(this).remove();
                                    });
                                }, 2000);
                            }, 500);
                        } else {
                            // 只高亮提交按钮，不自动提交
                            submitBtn.css({
                                'box-shadow': '0 0 10px 3px #FF9800',
                                'animation': 'pulse 1s infinite'
                            });
                            console.log('✅ 提交按钮高亮成功（需手动点击）');
                            
                            // 添加脉冲动画
                            if (!$('#pulse-animation').length) {
                                $('head').append(`
                                    <style id="pulse-animation">
                                        @keyframes pulse {
                                            0%, 100% { box-shadow: 0 0 10px 3px #FF9800; }
                                            50% { box-shadow: 0 0 20px 6px #FF9800; }
                                        }
                                    </style>
                                `);
                            }
                            
                            // 显示提示
                            alert('审核选项已自动填写完成\n\n请检查后点击高亮的提交按钮完成审核');
                        }
                    } else {
                        console.log('⚠️ 未找到提交按钮');
                    }
                }, 300);
            }
            
            console.log('=== 表单填写完成 ===');
        }
    }

    // ==================== 主函数 ====================
    
    function init() {
        console.log('PTSKit审核助手已加载');

        // 检查是否在详情页
        if (!window.location.href.includes('details.php')) {
            return;
        }

        // 等待页面加载完成后立即执行
        $(document).ready(function() {
            // 减少延迟，提升响应速度
            setTimeout(() => {
                // 提取页面信息
                const info = extractPageInfo();
                console.log('提取的种子信息:', info);

                // 执行审核
                const result = performAudit(info);
                console.log('审核结果:', result);

                // 显示结果
                displayAuditResult(result, info);
            }, 300);  // 从1000ms减少到300ms
        });
    }

    // 注册菜单命令
    GM_registerMenuCommand('切换详细信息自动展开', function() {
        CONFIG.autoExpand = !CONFIG.autoExpand;
        GM_setValue('autoExpand', CONFIG.autoExpand);
        alert(`详细信息自动展开已${CONFIG.autoExpand ? '开启' : '关闭'}`);
        location.reload();
    });

    GM_registerMenuCommand('切换显示位置', function() {
        CONFIG.position = (CONFIG.position % 3) + 1;
        GM_setValue('position', CONFIG.position);
        const posText = ['页面最上方', '主标题正下方', '主标题正上方'][CONFIG.position - 1];
        alert(`显示位置已切换到：${posText}`);
        location.reload();
    });

    GM_registerMenuCommand('切换自动提交', function() {
        CONFIG.autoSubmit = !CONFIG.autoSubmit;
        GM_setValue('autoSubmit', CONFIG.autoSubmit);
        alert(`快捷审核按钮自动提交已${CONFIG.autoSubmit ? '开启' : '关闭'}\n\n${CONFIG.autoSubmit ? '点击快捷按钮后将自动提交表单' : '点击快捷按钮后需手动点击提交'}`);
        location.reload();
    });

    // 启动
    init();
})();
