// ==UserScript==
// @name         zmpt-check-tool
// @namespace    http://tampermonkey.net/
// @description  织梦种子审核协助工具
// @author       anynopt
// @match        https://zmpt.cc/details.php?id=*
// @grant        GM_xmlhttpRequest
// @icon         https://img.picgo.net/2024/11/15/78e8e2c67f051d15519e12911819dc9f.gif
// @run-at       document-end
// @license      MIT
// @version      2025.11.29.23
// @downloadURL https://update.greasyfork.org/scripts/552769/zmpt-check-tool.user.js
// @updateURL https://update.greasyfork.org/scripts/552769/zmpt-check-tool.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 是否屏蔽详情页网络访问（设置为false 或者直接注释这一行 可以提升页面打开速度）
    const IS_ACCESS_NETWORK = true;
    let infoCounter = 0; // 全局信息计数器

    /**
     * 创建并返回一个启动按钮
     * @returns {HTMLButtonElement} 配置好的启动按钮
     */
    function createStartButton() {
        const startButton = document.createElement('button');
        startButton.textContent = '启动吧，电力！';
        startButton.style.position = 'fixed';
        startButton.style.top = '5px';
        startButton.style.left = '5px';
        startButton.style.zIndex = '9999';
        startButton.style.padding = '5px 5px';
        startButton.style.backgroundColor = 'orange';
        startButton.style.color = 'white';
        startButton.style.border = 'none';
        startButton.style.borderRadius = '5px';
        startButton.style.cursor = 'pointer';
        startButton.style.fontWeight = 'bold';
        startButton.style.fontSize = '14px';

        startButton.addEventListener('click', () => {
            const count = prompt('请输入要审核的种子数量:', '20');
            if (count && !isNaN(count)) {
                getNextUncheckTorrent(parseInt(count), (urls) => {
                    urls.forEach(url => {
                        window.open(url, '_blank');

                    });
                });
            }
        });

        return startButton;
    }


    /**
     * 添加回车键点击approval元素的功能
     */
    function setupEnterKeyApproval() {
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                const approvalElement = document.evaluate(
                    "//font[@id='approval']",
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;

                if (approvalElement) {
                    approvalElement.click();
                }
            }
        });
    }

    /**
     * 检查种子文件信息
     * @param {HTMLElement} main_table - 主表格元素
     */
    function checkTorrentFile(main_table) {
        const torrentFileElement = queryXPathNode(`.//tr[td[1][normalize-space()='种子文件']]/td[2]`, main_table);
        if (torrentFileElement) {
            const fileCountMatch = torrentFileElement.textContent.match(/文件数：(\d+)个文件/);
            if (fileCountMatch) {
                addTorrentInfo(`种子文件数: ${fileCountMatch[1]} 个`);
            } else {
                addTorrentInfo(`种子文件数: 单个文件(无外层文件夹)`);

            }
        }
        // 从当前URL提取ID参数
        const currentUrl = window.location.href;
        const idMatch = currentUrl.match(/id=(\d+)/);
        const torrentId = idMatch ? idMatch[1] : null;

        if (torrentId) {
            // 1. 首先触发页面点击展示文件列表
            const viewLink = document.querySelector(`a[href="javascript: viewfilelist(${torrentId})"]`);
            if (viewLink) {
                viewLink.click();
                return new Promise((resolve) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: `https://zmpt.cc/viewfilelist.php?id=${torrentId}`,
                        onload: function (response) {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(response.responseText, "text/html");
                            const fileListTable = doc.querySelector('table.main');
                            if (fileListTable) {
                                const files = Array.from(fileListTable.querySelectorAll('tr')).slice(1).map(row => {
                                    const cells = row.querySelectorAll('td');
                                    return {
                                        name: cells[0].textContent.trim(),
                                        size: cells[1].textContent.trim()
                                    };
                                });
                                resolve(files);
                            } else {
                                resolve(null);
                            }
                        },
                        onerror: function (error) {
                            console.error('获取文件列表失败:', error);
                            resolve(null);
                        }
                    });
                });
            } else {
                // console.warn('未找到查看列表链接，开始直接请求种子结构树');
                return new Promise((resolve) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: `https://zmpt.cc/torrent_info.php?id=${torrentId}`,
                        onload: function (response) {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(response.responseText, "text/html");

                            // 使用XPath获取文件名
                            const nameNodes = document.evaluate(
                                "//ul[@id='torrent-structure']//div[@class='string'][span[@class='title']='[name]']/span[@class='value']/text()",
                                doc,
                                null,
                                XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                null
                            );

                            const files = [];
                            for (let i = 0; i < nameNodes.snapshotLength; i++) {
                                files.push({
                                    name: nameNodes.snapshotItem(i).nodeValue.trim(),
                                    size: '未知' // 直接请求的结构树可能不包含大小信息
                                });
                            }
                            resolve(files); // 直接返回解析结果，空数组表示解析失败
                        },
                        onerror: function (error) {
                            console.error('获取文件列表失败:', error);
                            resolve(null);
                        }
                    });
                });
            }

            // 2. 通过API直接获取文件列表

        } else {
            console.error('无法从URL中提取种子ID');
            return Promise.resolve(null);
        }
    }
    /**
        * 获取未审核的种子
        */
    var XPATH = "//table[@class='torrents']//table[@class='torrentname']//td[.//span[normalize-space(@title)='未审']]//a[normalize-space(@href) and normalize-space(@title)]/@href";

    function getNextUncheckTorrent(count, callback) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://zmpt.cc/torrents.php?approval_status=0&sort=4&type=desc&page=30",
                onload: function (response) {
                    try {
                        var parser = new DOMParser();
                        var doc = parser.parseFromString(response.responseText, "text/html");
                        var snapshot = document.evaluate(XPATH, doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                        var urls = [];
                        for (var i = 0; i < snapshot.snapshotLength; i++) {
                            var attr = snapshot.snapshotItem(i);
                            var raw = (attr && (attr.value || attr.nodeValue)) || '';
                            if (!raw) continue;
                            try {
                                var abs = new URL(raw, doc.baseURI).href;
                                urls.push(abs);
                            } catch (e) {
                                // 忽略无法解析的 URL
                            }
                        }
                        const resultCount = Math.min(count, urls.length);
                        const resultUrls = urls.slice(0, resultCount);
                        resolve(resultUrls);
                        if (callback) callback(resultUrls);
                    } catch (e) {
                        reject(e);
                        if (callback) callback([]);
                    }
                },
                onerror: function (error) {
                    console.error('请求失败:', error);
                    reject(error);
                    if (callback) callback([]);
                }
            });
        });
    }

    /**
     * 获取种审数
     * @returns {Promise<number>} 返回种审数
     */
    function getTorrentReviewCount() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://zmpt.cc/info.php",
                onload: function (response) {
                    try {
                        var parser = new DOMParser();
                        var doc = parser.parseFromString(response.responseText, "text/html");
                        var result = document.evaluate(
                            "(//tbody[.//td[contains(text(), '审种数')]])[last()]/tr[2]/td[6]/text()",
                            doc,
                            null,
                            XPathResult.STRING_TYPE,
                            null
                        );
                        const count = parseInt(result.stringValue.trim());
                        resolve(isNaN(count) ? 0 : count);
                    } catch (e) {
                        console.error('解析种审数失败:', e);
                        resolve(0);
                    }
                },
                onerror: function (error) {
                    console.error('获取种审数失败:', error);
                    resolve(0);
                }
            });
        });
    }
    /**
     * 校验纯享版标签
     * @param {Array} torrent_tags - 种子标签数组
     */
    function checkCXBtag(torrent_tags) {
        if (torrent_tags && torrent_tags.length > 0 && torrent_tags.includes('纯享版')) {
            addWarnInfo('[特殊标签提示]：上传者携带纯享版标签，请人工检查');
        }
    }
    /**
     * 检查种子是否应该标记为"原盘"标签
     * 判断逻辑：
     * 1. 如果种子已有标签且包含"原盘"，则直接返回true
     * 2. 如果种子名称包含"blu-ray"或"bluray"（不区分大小写），则应该标记为"原盘"
     * 
     * @param {string} torrent_name 种子名称
     * @param {string} subtitle 副标题
     * @param {Array<string>} torrent_tags 种子已有的标签数组
    
     * @returns {boolean} 返回true表示应该标记为"原盘"，false表示不应该
     */
    function checkYPTag(videoIsDiyOrYP, torrent_name, subtitle, torrent_tags, torrent_files) {
        const lowerName = torrent_name.toLowerCase();
        const words = lowerName.split(/\s+/);
        // 移除种子名称的官组来源
        // 检查words数组是否非空
        if (words.length > 0) {
            // 获取最后一个元素
            let lastWord = words[words.length - 1];
            // 找到第一个 '-' 的位置
            const dashIndex = lastWord.indexOf('-');
            // 如果找到 '-'，则截取 '-' 之前的部分
            if (dashIndex !== -1) {
                lastWord = lastWord.substring(0, dashIndex);
            }

            // 更新words数组的最后一个元素
            words[words.length - 1] = lastWord;
        }
        const torrent_name_has_bluray = words?.some(word => ['blu-ray', 'bluray'].includes(word)) ?? false;
        let torrent_file_has_mkv = torrent_files?.some(file => file.name.toLowerCase().endsWith('.mkv')) ?? false;
        // const torrent_name_has_x265 = words?.some(word => ['x265', 'x264'].includes(word)) ?? false;
        const torrent_name_has_diy_yp = words?.some(word => ['diy', '原盘'].includes(word)) || /diy|原盘/.test(subtitle.lowerName);


        // 标签中是否携带diy原盘标签
        // const torrent_tag_has_yp_diy = torrent_tags?.some(tag => ['原盘', 'DIY'].includes(tag)) ?? false;
        const torrent_tag_choice = torrent_tags?.find(tag => ['原盘', 'DIY'].includes(tag));
        const torrent_tag_has_yp_diy = Boolean(torrent_tag_choice);

        const isYPOrDiy = videoIsDiyOrYP || !torrent_file_has_mkv;
        // 是否需要添加 原盘或者DIY标签
        if ((torrent_name_has_bluray && isYPOrDiy) || torrent_name_has_diy_yp) {
            // 种子名称包含 bluray，且没有mkv视频，需要添加原盘DIY标签
            if (torrent_tag_has_yp_diy) {
                addCorrectInfo(`[原盘|DIY检测]：种子疑似为原盘DIY，且已选择${torrent_tag_choice}标签，检测通过`);
            } else {
                addErrorInfo(`[原盘|DIY检测]：种子疑似为原盘DIY，但未选择相关标签，请人工确认`);
            }
        } else {
            // 不需要diy原盘标签
            if (torrent_tag_has_yp_diy) {
                addErrorInfo(`[原盘|DIY检测]：种子不是原盘DIY，但是选择${torrent_tag_choice}标签，请人工确认`);
            } else {
                addCorrectInfo(`[原盘|DIY检测]：种子不是为原盘DIY，且未选择相关标签，检测通过`);
            }
        }
    }
    /**
     * 查找主表格
     * @returns {HTMLElement|null} 返回匹配的主表格元素，未找到返回null
     */
    function findMainTable() {
        let mainTable = null;
        document.querySelectorAll('table').forEach(table => {
            const rows = table.querySelectorAll('tr');
            if (rows.length >= 2 &&
                rows[0].querySelector('td')?.textContent.trim() === '下载' &&
                rows[1].querySelector('td')?.textContent.trim() === '副标题') {
                mainTable = table;
            }
        });
        return mainTable;
    }
    function checkSimpleInfo(introduction_text, imdb_element) {
        const introduction_year = (introduction_text?.match(/◎年　　代　(.+?)(?=\n|◎|$)/)?.[1] || '').trim();
        if (imdb_element) {
            const imdb_year = (imdb_element.textContent || '').match(/(?:◎\s*)?年代[:：]\s*([0-9]{4}(?:\s*[-–—]\s*[0-9]{4})?)/)?.[1] || '';
            addTorrentInfo("[主体简介年代]：" + introduction_year + "  [IMDB识别年代]：" + imdb_year);
        } else {
            addTorrentInfo("[主体简介年代]：" + introduction_year + "  [IMDB识别年代]：暂无法识别")
        }
    }
    /**
     * 获取网页标题
     * @param {string} url - 网页URL
     * @param {function} callback - 回调函数(title)
     */
    function fetchPageTitle(url) {
        let title = '获取标题失败';
        try {
            let apiUrl;
            if (url.includes('imdb.com')) {
                const imdbId = url.match(/tt\d+/)[0];
                apiUrl = `https://ptgen.zmpt.cc?site=douban&sid=${imdbId}`;
            } else {
                apiUrl = `https://ptgen.zmpt.cc?url=${encodeURIComponent(url)}`;
            }
            const xhr = new XMLHttpRequest();
            xhr.open('GET', apiUrl, false);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send();

            if (xhr.status === 200) {
                const result = JSON.parse(xhr.responseText);
                const originalTitles = Array.isArray(result.this_title) ? result.this_title : [result.this_title || ''];
                const translatedTitles = Array.isArray(result.trans_title) ? result.trans_title : [result.trans_title || ''];

                title = [...originalTitles, ...translatedTitles]
                    .filter(t => t && t.trim())
                    .join(' / ');

                if (!title.trim()) {
                    title = '无法获取标题';
                }
            }
        } catch (e) {
            title = '请求失败';
        }
        return title;
    }
    /**
   * 检查视频格式
   * @param {String} video_format_user_upload_element - 用户选择的视频格式
   * @param {String} torrent_name 种子名称
   */
    function checkVidoFormat(video_format_user_upload_element, torrent_name) {
        if (video_format_user_upload_element) {
            // 1. 将种子名称按空格分割成单词数组，并全部转小写
            const wordsInName = torrent_name.toLowerCase().split(/\s+/);

            // 2. 将用户选择的视频格式转小写
            const userFormat = video_format_user_upload_element.toLowerCase();

            // 3. 检查用户选择的格式是否在种子名称的单词数组中出现过
            if (wordsInName.includes(userFormat)) {
                addCorrectInfo(`[种子标题检测]：视频格式选择跟种子名称匹配，检测通过`)
            } else {
                addErrorInfo(`[种子标题检测]：视频格式选择${video_format_user_upload_element}跟种子名称不匹配，请人工确认`)
            }
        }

    }
    /**
     * 检查简介图片数量和可访问性
     * @param {HTMLElement} introduction_element - 简介元素
     */
    function checkIntroducetionImg(introduction_element) {
        const imgElements = introduction_element.querySelectorAll('img');
        const srcList = Array.from(imgElements, img => img.src).filter(Boolean);

        // 检查图片数量
        if (srcList.length < 2) {
            addErrorInfo(`[简介图片检测]：简介图片少于两张（当前${srcList.length}张），请人工确认。`);
        } else {
            addCorrectInfo(`[简介图片检测]：简介图片共${srcList.length}张，数量大于2检测通过。`);
        }

        // 静默检查图片可访问性
        let allAccessible = true;
        const failedUrls = [];

        // 使用Promise等待所有图片加载完成
        const checkPromises = Array.from(imgElements).map(img => {
            return new Promise((resolve) => {
                // 如果图片已经加载完成（无论成功或失败）
                if (img.complete) {
                    if (!img.naturalWidth || img.naturalHeight === 0) {
                        allAccessible = false;
                        failedUrls.push(img.src);
                    }
                    resolve();
                    return;
                }

                // 监听加载成功
                img.addEventListener('load', () => {
                    resolve();
                });

                // 监听加载失败
                img.addEventListener('error', () => {
                    allAccessible = false;
                    failedUrls.push(img.src);
                    resolve();
                });
            });
        });

        Promise.all(checkPromises).then(() => {
            if (allAccessible) {
                addCorrectInfo('[简介图片质量]：所有图片都可以访问，检测通过。');
            } else {
                let errorMsg = '[简介图片质量]：简介图片部分不可访问，请人工确认。\n不可访问的图片链接：';
                // 去重后再输出
                const uniqueFailedUrls = [...new Set(failedUrls)];
                errorMsg += uniqueFailedUrls.join('\n');
                addErrorInfo(errorMsg);
            }
        });
    }


    /**
     * 检查并提取豆瓣和IMDB链接
     * @param {string} type - 资源类型
     * @param {string} content - 简介文本内容
     */
    async function checkDouBanAndIMDB(type, content) {
        // 匹配所有IMDb链接
        const imdbLinks = content.match(/https?:\/\/[^\s]*imdb\.com[^\s]*/gi) || [];
        // 匹配所有豆瓣链接
        const doubanLinks = content.match(/https?:\/\/[^\s]*douban\.com[^\s]*/gi) || [];

        // 检查链接并获取标题
        const checkLinks = (links, typeName) => {
            if (links.length === 0) {
                return { title: null, hasError: false };
            } else if (links.length > 1) {
                addErrorInfo(`[${typeName}信息校验]：简介中${typeName}链接大于1，请人工审查`);
                // links.forEach(link => addTorrentInfo(`${typeName}链接: ${link}`));
                return { title: null, hasError: true };
            } else {
                // addTorrentInfo(`${typeName}链接: ${links[0]}`);
                if (IS_ACCESS_NETWORK == true) {
                    const title = fetchPageTitle(links[0]);
                    addTorrentInfo(`${typeName}标题: ${title}`);
                    return { title, hasError: false };
                }
            }
        };

        // 检查IMDb链接
        // const imdbResult = checkLinks(imdbLinks, 'IMDB');
        // const imdbTitle = imdbResult.title;

        // 检查豆瓣链接
        // const doubanRequired = type === '电影 / Movie' || type === '电视剧 / TV Series';
        const doubanResult = checkLinks(doubanLinks, '豆瓣');
        // const doubanTitle = doubanResult.title;

        // 检查链接存在情况
        if (imdbLinks.length === 0 && doubanLinks.length === 0) {
            addErrorInfo('[豆瓣&IMDB校验]：简介缺失豆瓣或IMDB链接信息，请人工确认');
            // } else if (imdbLinks.length > 0 && doubanLinks.length > 0) {
            //     addCorrectInfo('[豆瓣&IMDB校验]：简介中包含豆瓣和IMDB链接信息，完美，校验通过');

            //     // 校验标题一致性
            //     if (imdbTitle && doubanTitle && imdbTitle !== doubanTitle) {
            //         addErrorInfo('[标题一致性]：豆瓣和IMDb标题不一致，请人工审查');
            //     } else if ('获取标题失败' == imdbTitle && '获取标题失败' == doubanTitle) {
            //         addErrorInfo('[标题一致性]：豆瓣和IMDb标题无法验证，请人工审查');

            //     }
            // } else if (imdbLinks.length > 0) {
            //     addCorrectInfo('[豆瓣&IMDB校验]：简介中包含IMDB链接信息，校验通过');
            //     // 豆瓣链接缺失但非必需时不报错
            //     if (doubanRequired && doubanLinks.length === 0) {
            //         addErrorInfo('[豆瓣信息校验]：简介中缺少豆瓣链接');
            //     }
            // } else if (doubanLinks.length > 0) {
            //     addCorrectInfo('[豆瓣&IMDB校验]：简介中包含豆瓣链接信息，校验通过');
            //     // IMDB链接缺失时不报错
        }
    }
    /**
     * 检测媒体信息中是否包含中文/国语音频轨道
     * @param {Object} mediaInfo - MediaInfo对象
     * @param {Object} discInfo - DiscInfo对象
     * @returns {Object} 返回检测结果 {
     *   hasChineseAudio: boolean, // 是否包含中文音频
     *   detectedLanguage: string|null // 检测到的具体语言标识
     * }
     */
    function checkHasChineseAudio(mediaInfo, discInfo) {
        // 中文音频标识列表（按匹配优先级排序）
        const audioChineseLanguageIdentifiers = [
            'Chinese',        // 通用中文标识
            'Mandarin',       // 普通话
            '国语',           // 简体中文标识
            '普通话',         // 标准普通话
            '中文',           // 通用中文
            'Mandarin (CN)',  // 中国大陆普通话
            'Chinese (CN)',   // 中国大陆中文
            'Chinese (Simplified)' // 简体中文
        ];

        // ======================
        // 1. 检查mediaInfo格式数据
        // ======================
        if (mediaInfo) {
            const audioItems = mediaInfo?.Audio || mediaInfo?.audio;
            if (audioItems) {
                for (const audioItem of audioItems) {
                    // 检查所有可能包含语言信息的字段
                    const fieldsToCheck = [
                        audioItem.Language,    // 标准语言字段
                        audioItem.language,    // 可能的变体字段
                        audioItem.Title,       // 标题可能包含语言信息
                        audioItem.title        // 可能的变体字段
                    ].filter(Boolean); // 过滤掉空值

                    // 检查字段值是否匹配中文标识
                    for (const fieldValue of fieldsToCheck) {
                        for (const identifier of audioChineseLanguageIdentifiers) {
                            if (fieldValue.includes(identifier)) {
                                return {
                                    hasChineseAudio: true,
                                    detectedLanguage: identifier
                                };
                            }
                        }
                    }
                }
            }
        }

        // ======================
        // 2. 检查discInfo格式数据（适配新结构）
        // ======================
        if (discInfo && discInfo.Audio) {
            // 确保处理的是数组（兼容单个字符串的情况）
            const audioItems = Array.isArray(discInfo.Audio) ? discInfo.Audio : [discInfo.Audio];

            for (const audioLine of audioItems) {
                if (audioLine && typeof audioLine === 'string') {
                    // 提取语言部分（假设格式为"Audio: 语言 / 格式 / 声道..."）
                    const languagePart = audioLine.split('/')[0]?.replace('Audio:', '').trim();

                    if (languagePart) {
                        // 检查是否匹配中文音频标识
                        for (const identifier of audioChineseLanguageIdentifiers) {
                            if (languagePart.includes(identifier)) {
                                return {
                                    hasChineseAudio: true,
                                    detectedLanguage: identifier
                                };
                            }
                        }
                    }
                }
            }
        }


        // ======================
        // 3. 未检测到中文音频
        // ======================
        return {
            hasChineseAudio: false,
            detectedLanguage: null
        };
    }


    const gyLanguages = ['汉语普通话', '国语'];
    function checkGYTag(torrent_tags, mediaInfo, discInfo, introduction_text, subtitle) {
        // 检查标签中是否包含'国语'
        const tag_has_gy = torrent_tags?.includes('国语') ?? false;
        const subtitle_has_gy = subtitle.includes('国语');
        // 提取语言信息
        const language = (introduction_text?.match(/◎语　　言　(.+?)(?=\n|◎|$)/)?.[1] || '').trim();
        const introduction_has_gy = gyLanguages.some(gy => language.includes(gy));
        // 检测音轨
        const { hasChineseAudio, detectedLanguage } = checkHasChineseAudio(mediaInfo, discInfo)
        let checkPrompt = null;
        if (mediaInfo) {
            checkPrompt = 'MediaInfo'
        } else {
            checkPrompt = 'DiscInfo'
        }
        if (tag_has_gy && hasChineseAudio && introduction_has_gy) {
            addCorrectInfo(`[国语标签检测：] 国语标签已选择，${checkPrompt}携带国语，简介中介绍携带国语，完美，检测通过`)
        } else if (tag_has_gy && hasChineseAudio) {
            addCorrectInfo(`[国语标签检测：] 国语标签已选择，${checkPrompt}携带国语，检测通过`)
        } else if (tag_has_gy && introduction_has_gy) {
            addCorrectInfo(`[国语标签检测：] 国语标签已选择，简介中介绍携带国语，检测通过`)
        } else if (tag_has_gy && (!hasChineseAudio || !introduction_has_gy)) {
            addErrorInfo(`[国语标签检测：] 国语标签已选择，简介和，${checkPrompt}均未检测到国语，请人工确认`)
        }
        if (!tag_has_gy && hasChineseAudio) {
            addErrorInfo(`[国语标签检测：] 国语标签未选择，，${checkPrompt}携带国语，请补充国语标签`)
        } else if (!tag_has_gy && introduction_has_gy) {
            addErrorInfo(`[国语标签检测：] 国语标签未选择，简介中介绍携带国语，请补充国语标签`)
        } else if (!tag_has_gy && subtitle_has_gy) {
            addWarnInfo(`[国语标签检测：] 国语标签未选择，副标题带国语，请人工检查是否需要补充国语标签`)
        }
        if (!tag_has_gy && !hasChineseAudio && !introduction_has_gy && !subtitle_has_gy) {
            addCorrectInfo(`[国语标签检测：] 国语标签未选择，简介和${checkPrompt}均未检测到国语，检测通过`)
        }

    }
    /**
         * 校验电视剧分集/完结标签
         * @param {string} type - 资源类型
         * @param {Array} torrent_tags - 种子标签数组
         * @param {string} torrent_name - 种子名称(用于日志)
         */
    // 电影不允许的标签
    const MOVIE_FORBIDDEN_TAGS = ['完结', '分集'];


    /**
     * 校验电影标签
     * @param {string} type - 资源类型
     * @param {Array} torrent_tags - 种子标签数组
     */
    function checkMovieTag(type, torrent_tags) {
        if (type && type.includes('电影')) {
            let hasForbiddenTag = false;
            MOVIE_FORBIDDEN_TAGS.forEach(tag => {
                if (torrent_tags.includes(tag)) {
                    addErrorInfo(`[电影标签检测]：电影不能包含${tag}标签`);
                    hasForbiddenTag = true;
                }
            });

            if (!hasForbiddenTag) {
                addCorrectInfo('[电影标签检测]：电影未检测到排斥标签，检测通过');
            }
        }
    }

    /**
     * 校验电视剧分集/完结标签
     * @param {string} type - 资源类型
     * @param {Array} torrent_tags - 种子标签数组
     * @param {string} torrent_name - 种子名称(用于日志)
     */
    function checkIfMultiPart(type, torrent_tags, torrent_name, subtitle) {
        const hasCompleteTag = torrent_tags.includes('完结');
        if (type === '电视剧 / TV Series') {
            const hasEpisodeTag = torrent_tags.includes('分集');

            if (torrent_tags.length === 0) {
                addErrorInfo('[电视剧校验]：电视剧分集/完结标签缺失，需要补充标签');
            } else if (hasEpisodeTag || hasCompleteTag) {
                const tag = hasEpisodeTag ? '分集' : '完结';
                addCorrectInfo(`[电视剧校验]：当前包含${tag}标签`);
            } else {
                addErrorInfo('[电视剧校验]：电视剧分集/完结标签缺失，需要补充标签');
            }
        }
        const subtitle_has_wj = subtitle.includes('完结');
        if (subtitle_has_wj && !hasCompleteTag) {
            addErrorInfo('[电视剧校验]：副标题携带完结字样，请人工检查是否需要补充完结标签');
        }
    }





    /**
     * 判断Mediainfo或DiscInfo中是否含有中文字幕
     * @param {Object} mediaInfo - MediaInfo对象
     * @param {Object} discInfo - DiscInfo对象
     * @returns {Object} 返回包含hasChineseSubtitle和chineseSubtitl的对象
     */
    function checkMediaInfoHasSimpleChinese(mediaInfo, discInfo) {
        const chineseLanguageIdentifiers = [
            'Simplified Chinese',
            'Chinese',
            '简体中文',
            '繁体中文',
            '繁体',
            'Chinese',
            '简体',
            '简体中字',
            '中文简体',
            '中文（简体）',
            'Chinese Simplified',
            'Simplified',
            'Chinese (Simplified)'
        ];

        // 检查mediaInfo
        // 检查mediaInfo
        if (mediaInfo) {
            const textItems = mediaInfo?.Text || mediaInfo?.mediaInfo?.Text;
            if (textItems) {
                for (const textItem of textItems) {
                    // 需要检查的字段列表
                    const fieldsToCheck = [
                        textItem.Language,    // 标准语言字段
                        textItem.language,   // 可能的变体字段
                        textItem.Title,      // 标题可能包含语言信息
                        textItem.title       // 可能的变体字段
                    ].filter(Boolean); // 过滤空值

                    // 检查所有相关字段
                    for (const fieldValue of fieldsToCheck) {
                        const normalizedValue = fieldValue.trim().toLowerCase();
                        for (const identifier of chineseLanguageIdentifiers) {
                            if (normalizedValue.includes(identifier.toLowerCase())) {
                                return {
                                    hasChineseSubtitle: true,
                                    chineseSubtitle: identifier
                                };
                            }
                        }
                    }
                }
            }
        }


        if (discInfo && discInfo.Text) {
            // 确保处理的是数组（兼容单个对象/字符串的情况）
            const textItems = Array.isArray(discInfo.Text) ? discInfo.Text : [discInfo.Text];

            // 构建正则表达式（匹配所有中文标识符）
            const chineseRegex = new RegExp(
                chineseLanguageIdentifiers
                    .map(identifier => identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
                    .join('|'),
                'i' // 不区分大小写
            );

            for (const textLine of textItems) {
                // 统一转为字符串处理
                const lineStr = typeof textLine === 'object'
                    ? JSON.stringify(textLine) // 如果是对象则序列化
                    : String(textLine);

                // 整行模糊匹配
                if (chineseRegex.test(lineStr)) {
                    // 找出具体匹配到的标识符
                    const matchedIdentifier = chineseLanguageIdentifiers.find(identifier =>
                        new RegExp(identifier, 'i').test(lineStr)
                    );

                    if (matchedIdentifier) {
                        return {
                            hasChineseSubtitle: true,
                            chineseSubtitle: matchedIdentifier
                        };
                    }
                }
            }
        }




        return {
            hasChineseSubtitle: false,
            chineseSubtitl: null
        };
    }





    /**
     * 解析单个fieldset内容
     * @param {HTMLElement} fieldset - fieldset元素
     * @returns {Object} 返回包含引用和字幕信息的对象
     */
    /**
     * 提取杜比视界信息
     * @param {HTMLElement} mediaInfo - mediaInfo元素
     * @returns {boolean} 是否检测到杜比视界
     */
    function hasHasDolbyVisionInfo(mediaInfo, discInfo) {
        if (mediaInfo) {
            // 确保 mediaInfo 和 Video 部分存在
            if (!mediaInfo?.Video) {
                return { hasDolbyVision: false, dolbyValue: null };
            }

            // 所有可能包含 Dolby Vision 信息的字段
            const fieldsToCheck = [
                "HDR format",        // 主要检查字段
                "Format profile",    // 次要检查字段
                "Format/Info",       // 次要检查字段
                "Commercial name",   // 次要检查字段
                "Title"              // 次要检查字段
            ];

            // 统一检查这些字段
            for (const field of fieldsToCheck) {
                const fieldValue = mediaInfo.Video[field];
                if (fieldValue && fieldValue.includes("Dolby Vision")) {
                    return { hasDolbyVision: true, dolbyValue: fieldValue };
                }
            }
        } else if (discInfo) {
            // 检查discInfo（适配新的Video结构）
            const videoItems = Array.isArray(discInfo.Video) ? discInfo.Video : [discInfo.Video];

            for (const videoLine of videoItems) {
                if (videoLine && typeof videoLine === 'string' && videoLine.includes("Dolby Vision")) {
                    return {
                        hasDolbyVision: true,
                        dolbyValue: videoLine
                    };
                }
            }
        }

        // 没有找到匹配项
        return { hasDolbyVision: false, dolbyValue: null };
    }
    /**
    * 检测媒体信息中是否包含HDR格式（如HDR Vivid、HDR10、Dolby Vision等）
    * @param {Object} mediaInfo - MediaInfo格式的媒体信息对象
    * @param {Object} discInfo - BDInfo/DISC INFO格式的媒体信息对象
    * @returns {Object} 返回检测结果对象 {
    *   hasHDRVivid: boolean, // 是否检测到HDR格式
    *   HDRValue: string|null // 检测到的具体HDR格式名称
    * }
    */
    function hasHDRVividInfo(mediaInfo, discInfo) {
        // ======================
        // 1. HDR关键词定义
        // ======================
        // 注意：这些关键词不区分大小写（通过includes()隐式实现）
        const hdrKeywords = [
            "HDR Vivid",    // 中国超高清视频产业联盟标准
            "HDR10",        // 基础HDR标准
            "HDR10+",       // 三星动态HDR
            "Advanced HDR", // 通用高级HDR标识
            "HLG"           // 广电标准Hybrid Log-Gamma
        ];

        // ======================
        // 2. 检查mediaInfo格式数据
        // ======================
        if (mediaInfo) {
            // 2.1 验证数据结构有效性
            if (!mediaInfo?.Video) {
                console.debug("[HDR检测] mediaInfo缺少Video字段");
                return { hasHDRVivid: false, HDRValue: null };
            }

            // 2.2 定义需要检查的字段（按检测优先级排序）
            const fieldsToCheck = [
                "HDR format",       // 标准HDR标识字段
                "Format profile",   // 格式描述字段
                "Format/Info",      // 格式信息字段
                "Commercial name",  // 商业名称字段
                "Title"             // 标题字段（次要）
            ];

            // 2.3 遍历所有目标字段
            for (const field of fieldsToCheck) {
                const fieldValue = mediaInfo.Video[field];
                if (!fieldValue) continue; // 跳过空字段

                // 2.4 检查字段值是否包含任一HDR关键词
                for (const keyword of hdrKeywords) {
                    if (fieldValue.includes(keyword)) {
                        console.debug(`[HDR检测] 在mediaInfo.${field}中发现HDR标识: ${keyword}`);
                        return {
                            hasHDRVivid: true,
                            HDRValue: keyword // 返回匹配到的具体格式
                        };
                    }
                }
            }
        }

        // ======================
        // 3. 检查discInfo格式数据
        // ======================
        if (discInfo && discInfo.Video) {
            // 处理Video字段（确保是数组）
            const videoItems = Array.isArray(discInfo.Video) ? discInfo.Video : [discInfo.Video];

            // 遍历所有视频轨道字符串
            for (const videoLine of videoItems) {
                if (videoLine && typeof videoLine === 'string') {
                    // 在整行视频信息中搜索HDR关键词
                    for (const keyword of hdrKeywords) {
                        if (videoLine.includes(keyword)) {
                            console.debug(`[HDR检测] 在视频信息中发现HDR标识: ${keyword}`);
                            return {
                                hasHDRVivid: true,
                                HDRValue: keyword
                            };
                        }
                    }
                }
            }
        }


        // ======================
        // 4. 未检测到HDR信息
        // ======================
        console.debug("[HDR检测] 未发现任何HDR格式标识");
        return {
            hasHDRVivid: false,
            HDRValue: null
        };
    }



    /**
     * 提取MediaInfo内容
     * @param {string} content - fieldset文本内容
     * @returns {Object|null} 返回解析后的MediaInfo字典，不是MediaInfo则返回null
     */
    function extractMediaInfoContent(content) {
        if (!content) return null;

        const mediaInfo = {
            General: {},
            Video: null,
            Audio: [],
            Text: []
        };

        // 标准化输入：统一换行符并去除前后空白
        content = content.replace(/\r\n/g, '\n').trim();

        // 分割section，支持带编号的Audio/Text
        const sections = content.split(/\n+(?=(?:General|Video|Audio(?: #\d+)?|Text(?: #\d+)?)\s*\n)/i);
        // 验证必须包含General section
        if (!sections.some(s => s.startsWith('General'))) {
            console.warn('Invalid MediaInfo: Missing General section');
            return null;
        }

        sections.forEach(section => {
            // 提取section名称和编号
            const sectionMatch = section.match(/^(\w+)(?: #(\d+))?\s*\n/i);
            if (!sectionMatch) return;

            let [_, sectionName, index] = sectionMatch;
            sectionName = sectionName.toLowerCase();
            const sectionContent = section.replace(/^[\w\s#]+\n/, '').trim();

            // 解析section内容为键值对
            const sectionData = {};
            sectionContent.split('\n').forEach(line => {
                const colonIndex = line.indexOf(':');
                if (colonIndex > 0) {
                    const key = line.substring(0, colonIndex).trim();
                    const value = line.substring(colonIndex + 1).trim();
                    sectionData[key] = value;
                }
            });

            // 根据section类型存储数据
            switch (sectionName.toLowerCase()) {
                case 'general':
                    mediaInfo.General = sectionData;
                    break;
                case 'video':
                    if (mediaInfo.Video) {
                        console.warn('Multiple Video sections found, using last one');
                    }
                    mediaInfo.Video = sectionData;
                    break;
                case 'audio':
                    mediaInfo.Audio.push({
                        index: index ? parseInt(index) : mediaInfo.Audio.length + 1,
                        ...sectionData
                    });
                    break;
                case 'text':
                    mediaInfo.Text.push({
                        index: index ? parseInt(index) : mediaInfo.Text.length + 1,
                        ...sectionData
                    });
                    break;
            }
        });

        return mediaInfo;
    }
    /**
     * 提取Disc Info内容（简化版）
     * @param {string} content - BDInfo/DISC INFO文本内容
     * @returns {Object|null} 返回解析后的MediaInfo字典，不是有效格式则返回null
     */
    function extractDiscInfoContent(content) {
        if (!content) return null;

        const discInfo = {
            General: {},
            Video: [],
            Audio: [],
            Text: []
        };

        // 标准化输入：统一换行符并去除前后空白
        content = content.replace(/\r\n/g, '\n').trim();

        // 验证必须包含DISC INFO部分
        if (!content.includes('DISC INFO:')) {
            console.warn('Invalid Disc Info: Missing DISC INFO section');
            return null;
        }

        // 分割主要部分
        const sections = content.split(/\n+(?=(?:DISC INFO|PLAYLIST REPORT|VIDEO|AUDIO|SUBTITLES):)/i);

        sections.forEach(section => {
            // 提取section名称
            const sectionMatch = section.match(/^([A-Z\s]+):/i);
            if (!sectionMatch) return;

            const sectionName = sectionMatch[1].trim().toLowerCase();
            const sectionContent = section.replace(/^[A-Z\s]+:\s*\n?/, '').trim();

            // 处理不同section
            switch (sectionName) {
                case 'disc info':
                case 'playlist report':
                    // 解析为General部分
                    sectionContent.split('\n').forEach(line => {
                        const colonIndex = line.indexOf(':');
                        if (colonIndex > 0) {
                            const key = line.substring(0, colonIndex).trim();
                            const value = line.substring(colonIndex + 1).trim();
                            discInfo.General[key] = value;
                        }
                    });
                    break;

                case 'video':
                    // 直接存储每行内容
                    sectionContent.split('\n')
                        .filter(line => line.trim() && !line.startsWith('-----'))
                        .forEach(line => discInfo.Video.push(line.trim()));
                    break;

                case 'audio':
                    // 直接存储每行内容
                    sectionContent.split('\n')
                        .filter(line => line.trim() && !line.startsWith('-----'))
                        .forEach(line => discInfo.Audio.push(line.trim()));
                    break;

                case 'subtitles':
                    // 直接存储每行内容（映射到Text）
                    sectionContent.split('\n')
                        .filter(line => line.trim() && !line.startsWith('-----'))
                        .forEach(line => discInfo.Text.push(line.trim()));
                    break;
            }
        });

        return discInfo;
    }

    /**
     * 提取Disc Info内容（第二种格式）
     * @param {string} content - 包含Disc Title和Video/Audio/Subtitle的文本内容
     * @returns {Object|null} 返回解析后的MediaInfo字典，不是有效格式则返回null
     */
    function extractDiscTitleContent(content) {
        if (!content) return null;

        const discInfo = {
            General: {},
            Video: [],
            Audio: [],
            Text: []
        };

        // 标准化输入：统一换行符并去除前后空白
        content = content.replace(/\r\n/g, '\n').trim();

        // 验证必须包含Disc Title和至少一个Video/Audio/Subtitle
        if (!content.includes('Disc Title:') ||
            !/(^|\n)(\*?\s*)?(Video|Audio|Subtitle):/i.test(content)) {
            console.warn('Invalid Disc Info: Missing required sections');
            return null;
        }

        // 分割每行
        const lines = content.split('\n');

        lines.forEach(line => {
            line = line.trim();
            if (!line) return;

            // 移除*号前缀
            if (line.startsWith('*')) {
                line = line.substring(1).trim();
            }

            // 处理General信息（以冒号分隔的键值对）
            if (line.includes(':') && !line.match(/^(Video|Audio|Subtitle):/i)) {
                const colonIndex = line.indexOf(':');
                const key = line.substring(0, colonIndex).trim();
                const value = line.substring(colonIndex + 1).trim();
                discInfo.General[key] = value;
            }
            // 处理Video信息（整行存储）
            else if (line.match(/^Video:/i)) {
                discInfo.Video.push(line.substring(6).trim());
            }
            // 处理Audio信息（整行存储）
            else if (line.match(/^Audio:/i)) {
                discInfo.Audio.push(line.substring(6).trim());
            }
            // 处理Subtitle信息（整行存储，映射到Text）
            else if (line.match(/^Subtitle:/i)) {
                discInfo.Text.push(line.substring(9).trim());
            }
        });

        return discInfo;
    }

    /**
     * 提取引用内容
     * @param {string} content - fieldset文本内容
     * @returns {string|null} 返回引用信息，没有则返回null
     */
    function extractReferenceContent(content) {
        return content.replace(/\r\n/g, '\n').trim();
    }
    // 引用关键词
    const REFERENCE_KEYWORDS = ['观组作品', '感谢原制作者发布'];
    /**
     * 分类并解析多个fieldsets内容
     * @param {Array} fieldsets - fieldset元素数组
     * @returns {Object} 返回包含mediaInfo和reference的对象
     */
    function classifyAndParseFieldset(fieldsets, torrent_tags = [], official_group) {
        let mediaInfo = null
        let discInfo = null
        let reference = null
        fieldsets.forEach(fieldset => {
            let processedContent = fieldset.textContent.replace(/\r\n/g, '\n').trim();
            // 移除开头的引用内容和换行符
            processedContent = processedContent.replace(/^\s*引用\s+/, '');
            // 如果开头不是General，则移除General之前的所有信息
            if (!processedContent.startsWith('General')) {
                const generalIndex = processedContent.indexOf('General');
                if (generalIndex > 0) {
                    processedContent = processedContent.substring(generalIndex);
                }
            }
            if (/^General\s*\n[\s\S]*?\n\s*\nVideo\s*(?:#\d+)?\s*\n|Audio\s*(?:#\d+)?\s*\n|Text\s*(?:#\d+)?\s*\n/i.test(processedContent)) {
                // 判断并解析MediaInfo
                mediaInfo = extractMediaInfoContent(processedContent);
            } else if (/DISC INFO:.*?(VIDEO|AUDIO|SUBTITLES)/is.test(processedContent)) {
                // 判断并解析BDInfo格式的DISC信息
                discInfo = extractDiscInfoContent(processedContent);
            } else if (/Disc Title:.*?(Video:|Audio:|Subtitle:)/is.test(processedContent)) {
                // 判断并解析包含Disc Title且至少有一个Video/Audio/Subtitle的内容
                discInfo = extractDiscTitleContent(processedContent);
            }
            else if (REFERENCE_KEYWORDS.some(keyword => processedContent.includes(keyword))) {
                // 判断并解析引用 - 检查是否包含任意关键词
                reference = processedContent;
            }
        });
        // 判断是否是zm官方资源
        const isZMOfficial = official_group.toLowerCase().startsWith("zm");

        // 三方转载来源判断
        // 使用逻辑非 (!) 两次
        const hasReference = !!reference;
        if (isZMOfficial) {
            addCorrectInfo("[转载来源检查]：织梦官方资源，无需声明引用。");
        } else if (!isZMOfficial && hasReference) {
            addCorrectInfo("[转载来源检查]：转自 " + official_group + " 已声明引用，校验通过。");
        } else if (!isZMOfficial && !hasReference) {
            addErrorInfo("[转载来源检查]：转自 " + official_group + " 未检测到引用，请人工检查。");
        }

        // MediaInfo校验
        const hasAnyMediaInfo = !!mediaInfo;
        const hasAnyDiscInfo = !!discInfo;
        let checkPrompt = null;
        if (hasAnyMediaInfo) {
            addCorrectInfo('[MediaInfo校验]：该简介包含MediaInfo信息，校验通过');
            checkPrompt = 'MediaInfo'
        } else if (hasAnyDiscInfo) {
            addCorrectInfo('[DiscInfo校验]：该简介包含DiscInfo信息，校验通过');
            checkPrompt = 'DiscInfo'
        } else {
            addErrorInfo('[MediaInfo|DiscInfo校验]：该简介缺少MediaInfo或者DiscInfo信息，请人工确认！');
        }

        // 校验中字标签和字幕信息
        const hasChineseTag = torrent_tags.includes('中字');
        const { hasChineseSubtitle, chineseSubtitl } = checkMediaInfoHasSimpleChinese(mediaInfo, discInfo)
        if (isZMOfficial) {
            addCorrectInfo("[中字标签校验]：织梦官方资源，无需校验中字标签,20251111协议；");
        } else if (hasChineseSubtitle && !hasChineseTag) {
            addErrorInfo(`[中字标签校验]：发布者未选择中字标签，${checkPrompt}检测到中文字幕，请补充中字标签`);
        } else if (!hasChineseSubtitle && hasChineseTag) {
            addErrorInfo(`[中字标签校验]：发布者选择了中字标签，${checkPrompt}未检测到中文字幕，请检查是否有中文字幕截图`);
        } else if (!hasChineseSubtitle && !hasChineseTag) {
            addWarnInfo(`[中字标签校验]：发布者未选择中字标签，${checkPrompt}未检测到中文字幕，请检查是否有中文字幕截图`);
        } else if (hasChineseSubtitle && hasChineseTag) {
            addCorrectInfo(`[中字标签校验]：发布者选择了中字标签，${checkPrompt}检测到中文字幕，校验通过`);
        }

        // 校验杜比标签和内容
        const hasDolbyTag = torrent_tags.includes('杜比');
        let { hasDolbyVision, dolbyValue } = hasHasDolbyVisionInfo(mediaInfo, discInfo);
        if (hasDolbyVision && !hasDolbyTag) {
            addErrorInfo(`[杜比标签校验]：发布者未选择杜比标签，${checkPrompt}已检测到杜比视界内容[${dolbyValue}]，请补充杜比标签`);
        } else if (!hasDolbyVision && hasDolbyTag) {
            addErrorInfo(`[杜比标签校验]：发布者选择了杜比标签，${checkPrompt}未检测到杜比视界内容，请检查是否有杜比视界截图`);
        } else if (!hasDolbyVision && !hasDolbyTag) {
            addCorrectInfo(`[杜比标签校验]：发布者未选择杜比标签，${checkPrompt}未检测到杜比视界内容，校验通过`);
        } else if (hasDolbyVision && hasDolbyTag) {
            addCorrectInfo(`[杜比标签校验]：发布者选择了杜比标签，${checkPrompt}已检测到杜比视界内容[${dolbyValue}]，校验通过`);
        }

        // 校验HDR标签和内容
        const hasHDRTag = torrent_tags.includes('HDR');
        let { hasHDRVivid, HDRValue } = hasHDRVividInfo(mediaInfo, discInfo);

        if (hasHDRVivid && !hasHDRTag) {
            addErrorInfo(`[HDR标签校验]：发布者未选择HDR标签，${checkPrompt}已检测到HDR内容[${HDRValue}]，请补充HDR标签`);
        } else if (!hasHDRVivid && hasHDRTag) {
            addErrorInfo(`[HDR标签校验]：发布者选择了HDR标签，${checkPrompt}未检测到HDR内容，请检查是否有HDR截图`);
        } else if (!hasHDRVivid && !hasHDRTag) {
            addCorrectInfo(`[HDR标签校验]：发布者未选择HDR标签，${checkPrompt}未检测到HDR内容，校验通过`);
        } else if (hasHDRVivid && hasHDRTag) {
            addCorrectInfo(`[HDR标签校验]：发布者选择了HDR标签，${checkPrompt}已检测到HDR内容[${HDRValue}]，校验通过`);
        }
        return { mediaInfo, discInfo };
    }

    /**
     * 校验种子名称格式
     * @param {string} torrentName 种子名称
     */
    function validateTorrentName(torrentName) {
        const lowerName = torrentName.toLowerCase();
        let torrentTile = null;
        if (torrentName.includes('-')) {
            torrentTile = torrentName.substring(0, torrentName.lastIndexOf('-'));
        } else {
            torrentTile = torrentName;
        }
        // 1. 基础校验
        // 中文检查
        if (/[\u4e00-\u9fa5\uff01-\uff60]+/.test(torrentName)) {
            addErrorInfo("[种子标题校验]：种子标题包含中文或中文字符");
        }

        // 分辨率格式检查
        if (/(480|720|1080|2160|4320)P/.test(torrentName)) {
            addErrorInfo("[种子标题校验]：种子标题分辨率P应改为小写p");
        }
        if (torrentName.includes('4K')) {
            addErrorInfo("[种子标题校验]：种子标题4K应改为2160p");
        }
        const spaceCount = (torrentName.match(/ /g) || []).length;
        if (spaceCount < 5) {
            addErrorInfo("[种子标题校验]：种子标题中空格数量少于5个，请检查种子标题格式");
        }

        // HDR格式检查
        // const hdrMatch = torrentName.match(/H[^\s]*D[^\s]*R/i);
        // if (hdrMatch) {
        //     const wrongHDR = hdrMatch[0];
        //     if (wrongHDR !== 'HDR') {
        //         addErrorInfo(`[种子标题校验]：${wrongHDR}需要更换为HDR（全部大写）`);
        //     }
        // }
        const hdrMatch = torrentName.match(/(?:^|\s)(hdr)(?:$|\s)/i);
        if (hdrMatch) {
            const foundHDR = hdrMatch[1]; // 获取捕获的hdr部分
            if (foundHDR.toLowerCase() === 'hdr' && foundHDR !== 'HDR') {
                addErrorInfo(`[种子标题校验]：种子标题 ${foundHDR}需要更换为HDR（全部大写）`);
            }
        }
        // 媒介类型检查
        // const wrongBD = torrentName.match(/Blu[Rr]ay|Blu-Ray|BDMV|BLURAY/);
        // if (wrongBD) {
        //     addErrorInfo(`[种子标题校验]：媒介类型${wrongBD[0]}应为Blu-ray`);
        // }

        // 编码格式检查
        // if (lowerName.includes(' hevc') && !lowerName.includes('h.265')) {
        //     addErrorInfo("[种子标题校验]：HEVC应改为H.265");
        // }
        // if (lowerName.includes(' avc') && !lowerName.includes('h.264')) {
        //     addErrorInfo("[种子标题校验]：AVC应改为H.264");
        // }

        // 特殊字符检查
        // if (lowerName.includes('hq')) {
        //     addErrorInfo("[种子标题校验]：删除种子标题中的HQ");
        // }
        // if (lowerName.includes('fps')) {
        //     addErrorInfo("[种子标题校验]：删除种子标题中的FPS");
        // }
        // if (lowerName.includes('edr')) {
        //     addErrorInfo("[种子标题校验]：删除种子标题中的EDR");
        // }
        // if (lowerName.includes('sdr')) {
        //     addErrorInfo("[种子标题校验]：删除种子标题中的SDR");
        // }
        // if (lowerName.includes('10bit')) {
        //     addErrorInfo("[种子标题校验]：删除种子标题中的10bit");
        // }

        // 2. 高级结构校验
        // 年份检查
        const yearMatch = torrentName.match(/(19|20)\d{2}/);
        const versionMatch = torrentName.match(/\b(PROPER|REPACK|READ\.NFO|RERIP)\b/i);
        // 种子主标题必须有年份
        if (!yearMatch) {
            addErrorInfo("[种子标题校验]：在主标题未找到有效的年份信息，请人工确认");
        } else {
            addCorrectInfo(`[种子标题校验]：找到有效的年份${yearMatch[0]}，校验通过`)
        }
        if (yearMatch && versionMatch) {
            if (torrentName.indexOf(yearMatch[0]) > torrentName.indexOf(versionMatch[0])) {
                addErrorInfo(`年份 ${yearMatch[0]} 应在版本 ${versionMatch[0]} 前面`);
            }
        }

        // 编码顺序检查
        const audioCodecs = ['FLAC', 'DTS', 'AC3', 'DDP 2.0', 'TrueHD', 'AAC', 'LPCM'];
        const videoCodecs = ['x264', 'x265', 'H.264', 'H.265', 'AVC', 'HEVC'];
        const videoCodecsNonStandardized = ['H265', 'H264'];


        //视频格式检查
        // 1. 合并所有编码（保留原始大小写）
        const allCodecs = [...videoCodecs, ...videoCodecsNonStandardized];

        // 2. 分割种子名称成单词（保留原始大小写）
        const words = torrentTile.split(/\s+/);

        // 3. 找到匹配的视频编码（大小写敏感）
        const matchedCodec = words.find(word => allCodecs.includes(word));

        if (!matchedCodec) {
            addErrorInfo(`[种子标题校验]：在主标题未找到有效的视频格式，请人工确认`);
        } else {
            addCorrectInfo(`[种子标题校验]：找到有效的视频格式${matchedCodec}，校验通过`);
        }



        let lastVideoPos = -1;
        let firstAudioPos = torrentName.length;

        videoCodecs.forEach(codec => {
            const pos = torrentName.indexOf(codec);
            if (pos > -1) lastVideoPos = Math.max(lastVideoPos, pos);
        });

        audioCodecs.forEach(codec => {
            const pos = torrentName.indexOf(codec);
            if (pos > -1) firstAudioPos = Math.min(firstAudioPos, pos);
        });

        // if (lastVideoPos > -1 && firstAudioPos < torrentName.length && lastVideoPos > firstAudioPos) {
        //     // 找出具体的视频和音频编码
        //     let videoCodec = '', audioCodec = '';
        //     for (const codec of videoCodecs) {
        //         if (torrentName.includes(codec)) {
        //             videoCodec = codec;
        //             break;
        //         }
        //     }
        //     for (const codec of audioCodecs) {
        //         if (torrentName.includes(codec)) {
        //             audioCodec = codec;
        //             break;
        //         }
        //     }
        //     addErrorInfo(`视频编码 ${videoCodec} 应在音频编码 ${audioCodec} 前面`);
        // }

        // 3. 类型特定校验
        // 电视剧季集检查
        if (torrentName.match(/S\d{2}E\d{2}/i)) {
            if (!torrentName.match(/S\d{2}E\d{2}/i)) {
                addErrorInfo("电视剧应包含S**E**格式的季集编号");
            }
        }
    }

    // 创建右上角信息容器
    const infoContainer = document.createElement('div');
    infoContainer.style.position = 'fixed';
    infoContainer.style.top = '20px';
    infoContainer.style.right = '20px';
    infoContainer.style.maxWidth = '500px';
    infoContainer.style.zIndex = '9999';
    document.body.appendChild(infoContainer);

    // 在右上角添加自定义文字
    function addTopRightText(text, fontSize = '14px', color = '#000') {
        const element = document.createElement('div');
        element.textContent = text;
        element.style.position = 'absolute';
        element.style.top = '5px';
        element.style.right = '5px';
        element.style.fontSize = fontSize;
        element.style.color = color;
        element.style.fontWeight = 'bold';
        torrentInfoBox.appendChild(element);
    }

    // 在右下角添加自定义文字
    function addBottomRightText(text, fontSize = '14px', color = '#000') {
        const element = document.createElement('div');
        element.textContent = text;
        element.style.position = 'absolute';
        element.style.bottom = '5px';
        element.style.right = '5px';
        element.style.fontSize = fontSize;
        element.style.color = color;
        element.style.fontWeight = 'bold';
        torrentInfoBox.appendChild(element);
    }

    // 创建种子信息div
    const torrentInfoBox = document.createElement('div');
    torrentInfoBox.id = 'torrent-info-box';
    torrentInfoBox.style.marginBottom = '5px';
    torrentInfoBox.style.padding = '10px';
    torrentInfoBox.style.backgroundColor = 'rgba(245, 245, 245, 0.7)';
    torrentInfoBox.style.border = '1px solid #ddd';
    torrentInfoBox.style.borderRadius = '5px';
    torrentInfoBox.style.overflow = 'auto';
    torrentInfoBox.style.maxHeight = '40vh';
    torrentInfoBox.style.fontSize = '14px';
    torrentInfoBox.style.position = 'relative'; // 添加相对定位以便子元素绝对定位
    infoContainer.appendChild(torrentInfoBox);

    // 创建审核参考div
    const auditInfoBox = document.createElement('div');
    auditInfoBox.id = 'audit-info-box';
    auditInfoBox.style.padding = '10px';
    auditInfoBox.style.backgroundColor = 'rgba(245, 245, 245, 0.7)';
    auditInfoBox.style.border = '1px solid #ddd';
    auditInfoBox.style.borderRadius = '5px';
    auditInfoBox.style.overflow = 'auto';
    auditInfoBox.style.maxHeight = '80vh';
    auditInfoBox.style.fontSize = '14px';
    infoContainer.appendChild(auditInfoBox);

    /**
     * 添加种子基本信息
     * @param {string} info - 要显示的信息
     */
    function addTorrentInfo(info) {
        if (typeof info !== 'string' || !info.trim()) return;

        const infoBox = document.getElementById('torrent-info-box');
        if (!infoBox) return;

        const item = document.createElement('div');
        item.innerHTML = info;
        infoBox.appendChild(item);
    }


    /**
     * 用 XPath 查询 DOM 节点（直接返回匹配的第一个元素，方便后续操作）
     * @param {string} xpath - XPath 表达式
     * @param {Element} [context=document] - 查询的根节点（默认从 document 开始）
     * @returns {Element|null} - 返回匹配的第一个 DOM 元素，未找到则返回 null
     */
    function queryXPathNode(xpath, context = document) {
        const result = document.evaluate(
            xpath,
            context,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        );
        return result.singleNodeValue;
    };
    /**
     * 添加正确信息（绿色文字+自动编号）
     * @param {HTMLElement} reviewRow - 审核信息行
     * @param {string} info - 正确信息
     */
    function addCorrectInfo(info) {
        if (typeof info !== 'string' || !info.trim()) return;

        const infoBox = document.getElementById('audit-info-box');
        if (!infoBox) return;

        // 创建带样式的信息元素
        const item = document.createElement('div');
        item.className = 'correct-item';
        item.style.color = '#107c10'; // 浅绿色
        item.textContent = `${++infoCounter}. √ ${info}`;

        infoBox.appendChild(item);
    };

    /**
     * 添加警告信息（黄色文字+自动编号）
     * @param {HTMLElement} reviewRow - 审核信息行
     * @param {string} info - 警告信息
     */
    function addWarnInfo(info) {
        if (typeof info !== 'string' || !info.trim()) return;

        const infoBox = document.getElementById('audit-info-box');
        if (!infoBox) return;

        // 创建带样式的信息元素
        const item = document.createElement('div');
        item.className = 'warn-item';
        item.style.color = '#FF8C00'; // 深黄色
        item.textContent = `${++infoCounter}. ! ${info}`;

        infoBox.appendChild(item);
    };

    /**
     * 添加错误信息（红色文字+自动编号）
     * @param {HTMLElement} reviewRow - 审核信息行
     * @param {string} info - 错误信息
     */
    function addErrorInfo(info) {
        if (typeof info !== 'string' || !info.trim()) return;

        const infoBox = document.getElementById('audit-info-box');
        if (!infoBox) return;

        // 创建带样式的信息元素
        const item = document.createElement('div');
        item.className = 'error-item';
        item.style.color = '#d83b01'; // 浅红色
        item.textContent = `${++infoCounter}. × ${info}`;

        infoBox.appendChild(item);
    };
    var resolution_constant = {
        1: "480p",
        2: "720p",
        3: "1080p/1080i",
        4: "4K/2160p",
        5: "8k/4320p/4320i",
        6: "Other"
    };
    /**
     * 从文件名中提取分辨率并返回对应的 key（1-6）
     * @param {string} filename 种子文件名
     * @return {number} resolution_constant 的 key（1-6）
     */
    function getResolutionKey(filename) {
        if (!filename || typeof filename !== 'string') return 6; // 无效输入默认返回 Other

        const lowerFilename = filename.toLowerCase();

        // 正则匹配：优先级 4k/8k > 2160p/4320p > 1080p/720p/480p
        const resolutionMatch = lowerFilename.match(
            /(?:\s|^)(4k|8k|2160[pi]|4320[pi]|1080[pi]|720[pi]|480[pi])(?:\s|$)/i
        );

        if (!resolutionMatch) return 6; // 未匹配到分辨率

        const resolution = resolutionMatch[1];

        if (resolution.includes('480')) return 1;
        if (resolution.includes('720')) return 2;
        if (resolution.includes('1080')) return 3;
        if (resolution.includes('4k') || resolution.includes('2160')) return 4;
        if (resolution.includes('8k') || resolution.includes('4320')) return 5;

        return 6; // 未知分辨率
    }
    /**
     * 解析种子基本信息HTML元素，提取关键信息
     * 
     * @param {HTMLElement} baseInfoElement - 包含基本信息的DOM元素
     * @returns {Object} 包含解析结果的对象，结构如下：
     *   - size {string} 文件大小（如"2.86 GB"）
     *   - type {string} 资源类型（如"电影 / Movies"）
     *   - videoClass {string} 视频类型（如"WEB-DL"）
     *   - resolution {string} 分辨率（如"1080p/1080i"）
     *   - audio {string} 音频编码（如"AAC"）
     * 
     * 注意：如果某个字段不存在，则返回的对象中不会包含该key
     */
    function parseBaseInfo(baseInfoElement) {
        // 空值检查
        if (!baseInfoElement) return {};

        const result = {};
        const nodes = baseInfoElement.childNodes;

        // 遍历所有子节点
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            // 1. 提取大小（格式：<b>大小：</b><b>2.86 GB</b>）
            if (node.nodeType === 1 && node.tagName === 'B' && node.textContent.includes('大小：')) {
                const sizeNode = nodes[i + 1];
                if (sizeNode && sizeNode.tagName === 'B') {
                    result.size = sizeNode.textContent.trim(); // 示例："2.86 GB"
                }
                i++; // 跳过已处理的节点
            }

            // 2. 提取类型（格式：<b>类型:</b> 电影 / Movies）
            else if (node.nodeType === 1 && node.tagName === 'B' && node.textContent.includes('类型:')) {
                const typeText = nodes[i + 1]?.textContent;
                if (typeText) result.type = typeText.trim(); // 示例："电影 / Movies"
                i++;
            }

            // 3. 提取视频类（格式：<b>视频类: </b><span>WEB-DL</span>）
            else if (node.nodeType === 1 && node.tagName === 'B' && node.textContent.includes('视频类:')) {
                const videoClassNode = nodes[i + 1];
                if (videoClassNode && videoClassNode.tagName === 'SPAN') {
                    result.videoClass = videoClassNode.textContent.trim(); // 示例："WEB-DL"
                }
                i++;
            }

            // 4. 提取分辨率（格式：<b>分辨率: </b><span>1080p/1080i</span>）
            else if (node.nodeType === 1 && node.tagName === 'B' && node.textContent.includes('分辨率:')) {
                const resolutionNode = nodes[i + 1];
                if (resolutionNode && resolutionNode.tagName === 'SPAN') {
                    result.resolution = resolutionNode.textContent.trim(); // 示例："1080p/1080i"
                }
                i++;
            }

            // 5. 提取音频类（格式：<b>音频类: </b><span>AAC</span>）
            else if (node.nodeType === 1 && node.tagName === 'B' && node.textContent.includes('音频类:')) {
                const audioNode = nodes[i + 1];
                if (audioNode && audioNode.tagName === 'SPAN') {
                    result.audio = audioNode.textContent.trim(); // 示例："AAC"
                }
                i++;
            }
        }

        return result;
    }






    // 创建并添加启动按钮
    document.body.appendChild(createStartButton());
    addTorrentInfo('<span style="color:#d2d0ce">脚本版本: ' + GM_info.script.version + ' (按下回车键快速审核)</span>')

    // 获取并显示种审数和预计工资
    getTorrentReviewCount().then(count => {
        if (count > 0) {
            addTorrentInfo('<span style="color:#c12c1f">当前业绩: ' + count + '</span>');
        }
    }).catch(() => {
        // 静默失败，不显示任何信息
    });
    const h1 = document.querySelector('h1#top')
    //种子名称
    const torrent_name = h1.childNodes[0].textContent.trim()
    // 官组信息提取
    const official_group = torrent_name.split('-').pop();
    addCorrectInfo('[种子来源官组]：' + official_group)

    // 校验种子名称
    validateTorrentName(torrent_name);

    // 审核状态
    //const torrent_audit_status = Array.from(h1.childNodes).find(node => node.getAttribute?.('title'))?.getAttribute('title')
    const torrent_audit_status = Array.from(h1.childNodes).pop()?.getAttribute?.('title');

    // 获取主表格内容
    const main_table = findMainTable();
    if (!main_table) {
        console.error('无法定位主表格');
        return;
    }

    const base_info_element = queryXPathNode(`.//tr[td[1][normalize-space()='基本信息']]/td[2]`, main_table)
    //   - size {string} 文件大小（如"2.86 GB"）
    //   - type {string} 资源类型（如"电影 / Movies"）
    //   - videoClass {string} 视频类型（如"WEB-DL"）
    //   - resolution {string} 分辨率（如"1080p/1080i"）
    //   - audio {string} 音频编码（如"AAC"）
    const baseInfoDic = parseBaseInfo(base_info_element)
    // 视频类检测eg:web_dl
    const video_format_user_upload = baseInfoDic['videoClass']
    checkVidoFormat(video_format_user_upload, torrent_name)
    // 副标题
    const subtitle = queryXPathNode(`.//tr[td[1][normalize-space()='副标题']]/td[2]`, main_table).textContent
    // 提取类型、视频类、分辨率信息
    //const type = queryXPathNode(`.//b[contains(text(), '类型:')]/following-sibling::text()[1]`, base_info_element)?.textContent.trim()
    const type = baseInfoDic['type']
    //const videoType = queryXPathNode(`.//b[@title='媒介']/following-sibling::span[1]`, base_info_element)?.textContent.trim()
    //const resolution = queryXPathNode(`.//b[@title='分辨率']/following-sibling::span[1]`, base_info_element)?.textContent.trim()
    // addTorrentInfo(`<span style="color:#0066cc">类型: ${type || '未知'}` + "\t | \t审核状态：" + torrent_audit_status + '</span>')
    addBottomRightText(type.split('/').shift().trim(), '30px', '#EA8B56')
    if ('未审' == torrent_audit_status) {
        addTopRightText(torrent_audit_status, '20px', '#837a0eff')
    } else if ('拒绝' == torrent_audit_status) {
        addTopRightText(torrent_audit_status, '20px', '#ed0808ff')
    } else if ('通过' == torrent_audit_status) {
        addTopRightText(torrent_audit_status, '20px', '#2c6b0eff')
    } else {
        addTopRightText(torrent_audit_status, '20px', '#110105ff')
    }
    // addTorrentInfo(`视频类: ${videoType || '未知'}`)
    // addTorrentInfo(`分辨率: ${resolution || '未知'}`)
    // 获取标签
    const tag_element = queryXPathNode(`.//tr[td[1][normalize-space()='标签']]/td[2]`, main_table)
    let torrent_tags = []
    if (tag_element) {
        torrent_tags = Array.from(tag_element.querySelectorAll('span')).map(span => span.textContent.trim())
        const specialTags = ['国语', '中字', '杜比', 'HDR', '纯享版', '完结', 'DIY', '原盘'];
        const rainbowColors = ['#ff0000', '#ff00ffff', '#ff6600ff', '#33cc33', '#3399ff', '#cc66ff'];

        const styledTags = torrent_tags.map((tag, index) => {
            if (specialTags.includes(tag)) {
                const colorIndex = index % rainbowColors.length;
                const color = rainbowColors[colorIndex];
                return `<span style="color:${color}; font-weight:bold; font-size:18px">${tag}</span>`;
            }
            return tag;
        }).join(", ");

        addTorrentInfo('种子标签: ' + styledTags);
    } else {
        addCorrectInfo("发布者当前没有选择标签，请人工审查注意")
    }
    addTorrentInfo('<span style="color:#b4009e"><strong>' + subtitle + '</strong></span>')    // 种子简介内容解析
    const introduction_element = queryXPathNode(`.//tr[td[1][normalize-space()='简介']]/td[2]`, main_table)
    if (!introduction_element) {
        addErrorInfo('[简介信息校验]：无法获取简介内容，请人工确认是否详情是否包含简介');
        return;
    }
    const { mediaInfo, discInfo } = classifyAndParseFieldset(introduction_element.querySelectorAll('fieldset'), torrent_tags, official_group);
    // console.log(mediaInfo)
    // console.log(JSON.stringify(mediaInfo))
    // 分辨率校验
    // 获取种子名称中的分辨率
    const resolution_torrent_name = resolution_constant[getResolutionKey(torrent_name)]
    // 获取上传选择的分辨率
    //const resolution_user_upload_element = queryXPathNode(`.//b[@title='分辨率']/following-sibling::span[1]`, base_info_element)
    const resolution_user_upload = baseInfoDic['resolution']
    if (resolution_user_upload === "未知") {
        addWarnInfo("[分辨率选择校验]：无法获取用户上传选择的分辨率")
    } else if (resolution_torrent_name === resolution_user_upload) {
        addCorrectInfo("[分辨率选择校验]：当前种子命名解析分辨率为：" + resolution_torrent_name + "，用户上传选择分辨率为：" + resolution_user_upload + " , 选择正确。")
    } else {
        addErrorInfo('[分辨率选择校验]：种子主标题解析分辨率为：' + resolution_torrent_name + "，用户上传选择分辨率为：" + resolution_user_upload + " , 选择异常，需要人工确认。")
    }

    // 检测简介图片
    checkIntroducetionImg(introduction_element);

    // 检测分集或者完整
    checkIfMultiPart(type, torrent_tags, torrent_name, subtitle)
    // 检测豆瓣和IMDB信息
    checkDouBanAndIMDB(type, introduction_element.textContent);
    // 电影不能包含完结标签检测
    checkMovieTag(type, torrent_tags)

    // 调用纯享版标签检查
    checkCXBtag(torrent_tags);


    //  国语 标签 的识别
    checkGYTag(torrent_tags, mediaInfo, discInfo, introduction_element.textContent, subtitle);
    // 检测简介信息
    checkSimpleInfo(introduction_element.textContent, queryXPathNode(`.//tr[td[1][normalize-space()='IMDb信息']]/td[2]`, main_table))


    // 通过的以浅绿色信息标识
    // 添加分集检测逻辑
    // fix 中文字幕检测异常 种子id 264700



    //addCorrectInfo(reviewInfoRow,"当前种子命名：分辨率为："+resolution_torrent_name)
    //addCorrectInfo(reviewInfoRow,"用户上传选择分辨率为："+resolution_user_upload)
    //addCorrectInfo(reviewInfoRow,'分辨率正确')
    //addErrorInfo(reviewInfoRow,'这里会显示错误信息')



    // 初始化回车键功能
    setupEnterKeyApproval();

    // 调用检查种子文件信息并显示结果
    checkTorrentFile(main_table).then(torrent_files => {
        // console.log('文件列表:', torrent_files);
        // if (torrent_files) {
        //     addTorrentInfo(`文件列表: ${torrent_files.length}个文件`);
        //     torrent_files.forEach(file => {
        //         addTorrentInfo(`- ${file.name} (${file.size})`);
        //     });
        // }

        const videoIsDiyOrYP = !mediaInfo && !!discInfo;
        // 原盘标签检查
        checkYPTag(videoIsDiyOrYP, torrent_name, subtitle, torrent_tags, torrent_files);
    });
})();

