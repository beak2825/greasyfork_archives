// ==UserScript==
// @name         Toomics 漫画批量上传到Telegram（888目录页版）
// @namespace    http://tampermonkey.net/
// @version      3.999
// @description  在 Toomics 目录页显示上传按钮，自动上传指定范围的章节图片到Telegram
// @match        https://www.toomics.net/sc/webtoon/episode/toon/*
// @match        https://www.toomics.net/sc/webtoon/ranking
// @grant        GM_xmlhttpRequest
// @connect      toomics.net
// @connect      xueren.one
// @connect      www.xueren.one
// @connect      104.225.237.211
// @downloadURL https://update.greasyfork.org/scripts/550243/Toomics%20%E6%BC%AB%E7%94%BB%E6%89%B9%E9%87%8F%E4%B8%8A%E4%BC%A0%E5%88%B0Telegram%EF%BC%88888%E7%9B%AE%E5%BD%95%E9%A1%B5%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/550243/Toomics%20%E6%BC%AB%E7%94%BB%E6%89%B9%E9%87%8F%E4%B8%8A%E4%BC%A0%E5%88%B0Telegram%EF%BC%88888%E7%9B%AE%E5%BD%95%E9%A1%B5%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    /**
     * 简单的 sleep 函数
     */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * waitForAllImagesInDocument：等待文档中所有懒加载 <img> 插入 DOM
     * 这是从demo.js移植的关键函数，用于获取全部图片
     */
    async function waitForAllImagesInDocument(doc, maxTries = 50, interval = 300) {
        const viewer = doc.querySelector('#viewer-img');
        if (!viewer) {
            console.warn('未找到 #viewer-img 节点，跳过懒加载等待');
            return;
        }

        // 1. 读取 data-count，知道总共多少张
        const totalCount = parseInt(viewer.getAttribute('data-count') || '0');
        if (!totalCount) {
            console.warn('data-count 属性不存在或为 0，跳过懒加载等待');
            return;
        }

        console.log(`检测到总共需要加载 ${totalCount} 张图片`);

        // 2. 轮询检测当前已插入 img 数量
        let tries = 0;
        while (tries < maxTries) {
            const loadedCount = doc.querySelectorAll('#viewer-img img').length;
            console.log(`已加载 ${loadedCount}/${totalCount} 张图片`);

            if (loadedCount >= totalCount) {
                console.log('所有图片已加载完成！');
                break;
            }

            // 还没加载完，等待一段时间后继续检测
            await sleep(interval);
            tries++;
        }

        if (tries >= maxTries) {
            console.warn(`轮询超时：尝试 ${maxTries} 次后，仍未检测到全部 ${totalCount} 张 <img>。`);
        }
    }

    /**
     * 数据库操作函数
     */
    const dbApi = {
        baseUrl: 'https://www.xueren.one/db_save.php',

        // 检查图库是否存在
        async checkGalleryExists(aid) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `${this.baseUrl}?action=check_gallery_exists&aid=${encodeURIComponent(aid)}`,
                    headers: {
                        'Accept': 'application/json'
                    },
                    onload: res => {
                        try {
                            const result = JSON.parse(res.responseText);
                            resolve(result);
                        } catch (e) {
                            reject(e);
                        }
                    },
                    onerror: err => reject(err)
                });
            });
        },

        // 保存图库信息
        async saveGallery(galleryData) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${this.baseUrl}?action=save_gallery`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    data: JSON.stringify(galleryData),
                    onload: res => {
                        try {
                            const result = JSON.parse(res.responseText);
                            resolve(result);
                        } catch (e) {
                            reject(e);
                        }
                    },
                    onerror: err => reject(err)
                });
            });
        },

        // 保存图库图片
        async saveGalleryImages(galleryAid, imageData) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${this.baseUrl}?action=save_gallery_images`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    data: JSON.stringify({
                        gallery_aid: galleryAid,
                        images: imageData
                    }),
                    onload: res => {
                        try {
                            const result = JSON.parse(res.responseText);
                            resolve(result);
                        } catch (e) {
                            reject(e);
                        }
                    },
                    onerror: err => reject(err)
                });
            });
        }
    };

    /**
     * 从目录页获取所有章节信息
     */
    function getChapterList() {
        const chapters = [];
        const chapterElements = document.querySelectorAll('.list-ep li.normal_ep');

        chapterElements.forEach((li, index) => {
            const link = li.querySelector('a');
            if (link) {
                // 从 onclick 中提取 URL
                const onclickMatch = link.getAttribute('onclick')?.match(/location\.href='([^']+)'/);
                if (onclickMatch) {
                    const detailUrl = onclickMatch[1];
                    const chapterNum = li.querySelector('.cell-num .num')?.textContent || (index + 1);
                    const title = li.querySelector('.cell-title strong')?.textContent?.trim() || 'Unknown';

                    // 检查是否是预告片（ep/0）
                    if (detailUrl.includes('/ep/0/')) {
                        console.log(`跳过预告片: ${title} (${detailUrl})`);
                        return; // 跳过预告片
                    }

                    chapters.push({
                        index: index + 1,
                        chapterNum: parseInt(chapterNum),
                        title: title,
                        detailUrl: 'https://www.toomics.net' + detailUrl,
                        isOwn: li.classList.contains('own')
                    });
                }
            }
        });

        console.log(`过滤预告片后，找到 ${chapters.length} 个有效章节`);
        return chapters;
    }

    /**
     * 从排行榜页面获取所有漫画信息
     */
    function getRankingMangaList() {
        const mangaList = [];
        const mangaElements = document.querySelectorAll('.visual a[href*="/sc/webtoon/episode/toon/"]');

        mangaElements.forEach((link, index) => {
            const href = link.getAttribute('href');
            if (href) {
                const titleElement = link.querySelector('.title');
                const writerElement = link.querySelector('.writer');

                // 检查是否包含18+标签
                const adultTag = link.querySelector('.ico_19plus');
                const isAdult = adultTag && adultTag.textContent.includes('18+');

                // 只处理18+漫画
                if (!isAdult) {
                    console.log(`跳过非18+漫画: ${titleElement ? titleElement.textContent.trim() : `漫画${index + 1}`}`);
                    return; // 跳过非18+漫画
                }

                // 尝试多种方式获取封面图
                let coverImg = link.querySelector('img');
                if (!coverImg) {
                    // 如果直接查找失败，尝试在visual div中查找
                    const visualDiv = link.querySelector('.visual');
                    if (visualDiv) {
                        coverImg = visualDiv.querySelector('img');
                    }
                }

                const title = titleElement ? titleElement.textContent.trim() : `漫画${index + 1}`;
                const writer = writerElement ? writerElement.textContent.trim() : 'Unknown';
                const coverImage = coverImg ? coverImg.src : '';

                console.log(`找到18+漫画: ${title} (${writer})`);

                mangaList.push({
                    index: mangaList.length + 1, // 重新编号，只计算18+漫画
                    title: title,
                    writer: writer,
                    detailUrl: 'https://www.toomics.net' + href,
                    coverImage: coverImage,
                    isOwn: true, // 排行榜页面默认认为都可以访问
                    isAdult: true // 标记为18+漫画
                });

                // 为每个18+漫画添加上传按钮
                addUploadButtonToManga(link, title, 'https://www.toomics.net' + href, coverImage, mangaList.length);
            }
        });

        return mangaList;
    }

    /**
     * 为单个漫画添加上传按钮
     */
    function addUploadButtonToManga(mangaElement, title, detailUrl, coverImage, index) {
        // 创建数量显示标签
        const countLabel = document.createElement('div');
        countLabel.textContent = `第${index}个`;
        countLabel.style.cssText = `
            position: absolute !important;
            top: 5px !important;
            right: 60px !important;
            background: rgba(0,0,0,0.7) !important;
            color: white !important;
            padding: 4px 8px !important;
            border-radius: 3px !important;
            font-size: 10px !important;
            font-weight: bold !important;
            z-index: 9998 !important;
            pointer-events: none !important;
        `;

        // 创建上传按钮
        const uploadBtn = document.createElement('button');
        uploadBtn.textContent = '📤 上传';
        uploadBtn.style.cssText = `
            position: absolute !important;
            top: 5px !important;
            right: 5px !important;
            background: #4CAF50 !important;
            color: white !important;
            border: none !important;
            padding: 6px 10px !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            font-size: 11px !important;
            z-index: 9999 !important;
            box-shadow: 0 2px 6px rgba(0,0,0,0.5) !important;
            transition: background 0.3s !important;
            font-weight: bold !important;
            min-width: 50px !important;
            height: 28px !important;
        `;

        // 悬停效果
        uploadBtn.addEventListener('mouseenter', () => {
            uploadBtn.style.background = '#45a049';
        });
        uploadBtn.addEventListener('mouseleave', () => {
            uploadBtn.style.background = '#4CAF50';
        });

        // 点击事件
        uploadBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            // 禁用按钮
            uploadBtn.disabled = true;
            uploadBtn.textContent = '⏳ 上传中...';
            uploadBtn.style.background = '#ff9800';

            try {
                console.log(`开始上传漫画: ${title}`);

                // 创建漫画对象
                const mangaInfo = {
                    title: title,
                    detailUrl: detailUrl,
                    coverImage: coverImage
                };

                // 直接调用上传函数
                const result = await uploadChapter(mangaInfo);

                if (result && result.skipped) {
                    uploadBtn.textContent = '✅ 已存在';
                    uploadBtn.style.background = '#9e9e9e';
                } else if (result) {
                    uploadBtn.textContent = '✅ 完成';
                    uploadBtn.style.background = '#4CAF50';
                } else {
                    uploadBtn.textContent = '❌ 失败';
                    uploadBtn.style.background = '#f44336';
                }

            } catch (error) {
                console.error(`上传漫画 ${title} 失败:`, error);
                uploadBtn.textContent = '❌ 失败';
                uploadBtn.style.background = '#f44336';
            }
        });

        // 将数量标签和按钮添加到漫画元素中
        if (mangaElement.style.position !== 'relative') {
            mangaElement.style.position = 'relative';
        }
        mangaElement.appendChild(countLabel);
        mangaElement.appendChild(uploadBtn);
    }

    /**
     * 等待所有懒加载图片加载完成
     */
    async function waitForAllImages(maxTries = 50, interval = 300) {
        const viewer = document.querySelector('#viewer-img');
        if (!viewer) {
            console.warn('未找到 #viewer-img 节点，跳过懒加载等待');
            return;
        }

        // 滚动到底部触发懒加载
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        await sleep(1000);

        const totalCount = parseInt(viewer.getAttribute('data-count') || '0');
        if (!totalCount) {
            console.warn('data-count 属性不存在或为 0，跳过懒加载等待');
            return;
        }

        let tries = 0;
        while (tries < maxTries) {
            const loadedCount = document.querySelectorAll('#viewer-img img').length;
            if (loadedCount >= totalCount) {
                break;
            }
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            await sleep(interval);
            tries++;
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
        await sleep(500);

        if (tries >= maxTries) {
            console.warn(`轮询超时：尝试 ${maxTries} 次后，仍未检测到全部 ${totalCount} 张 <img>。`);
        }
    }

    /**
     * 获取页面标题和章节信息
     */
    function getPageInfo() {
        const titleElement = document.querySelector('.viewer-title a');
        let mangaName = 'Unknown';
        let chapterName = '第Unknown话';

        if (titleElement) {
            const fullText = titleElement.textContent.trim();
            const emElement = titleElement.querySelector('em');
            if (emElement) {
                chapterName = emElement.textContent.trim();
                mangaName = fullText.replace(chapterName, '').trim();
            }
        }

        const cleanName = (name) => {
            return name.replace(/[<>:"/\\|?*]/g, '_').replace(/\s+/g, '_').trim();
        };

        return {
            mangaName: cleanName(mangaName),
            chapterName: cleanName(chapterName),
            fullTitle: cleanName(mangaName + '_' + chapterName)
        };
    }

    /**
     * 下载图片并转换为Blob
     */
    function downloadImageAsBlob(imgUrl) {
        return new Promise((resolve, reject) => {
            console.log('开始下载图片:', imgUrl);

            GM_xmlhttpRequest({
                method: 'GET',
                url: imgUrl,
                responseType: 'arraybuffer',
                headers: {
                    'Referer': 'https://www.toomics.net',
                    'User-Agent': navigator.userAgent,
                    'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
                },
                onload: res => {
                    if (res.status === 200) {
                        try {
                            const blob = new Blob([res.response], { type: 'image/jpeg' });
                            console.log('图片下载成功，大小:', blob.size, 'bytes');
                            resolve(blob);
                        } catch (e) {
                            console.error('创建Blob失败:', e);
                            reject(e);
                        }
                    } else {
                        console.error('图片下载失败，状态码:', res.status);
                        reject(new Error(`状态码：${res.status}`));
                    }
                },
                onerror: err => {
                    console.error('图片下载请求失败:', err);
                    reject(err);
                }
            });
        });
    }

    /**
     * 批量上传图片到Telegram接口
     */
    async function uploadBatchToTelegram(imgUrls, batchSize = 10) {
        const results = [];

        // 将图片URL分组，每组最多batchSize张
        for (let i = 0; i < imgUrls.length; i += batchSize) {
            const batch = imgUrls.slice(i, i + batchSize);
            console.log(`开始上传第 ${Math.floor(i/batchSize) + 1} 批，共 ${batch.length} 张图片`);

            try {
                const batchResult = await uploadSingleBatch(batch);
                results.push(...batchResult);

                // 批次间延迟
                if (i + batchSize < imgUrls.length) {
                    console.log('批次间延迟 3 秒...');
                    await sleep(3000);
                }
            } catch (error) {
                console.error(`第 ${Math.floor(i/batchSize) + 1} 批上传失败:`, error);
                // 如果批量上传失败，回退到单张上传
                for (const imgUrl of batch) {
                    try {
                        const singleResult = await uploadToTelegram(imgUrl);
                        results.push(singleResult);
                    } catch (singleError) {
                        console.error('单张上传也失败:', singleError);
                        results.push({ ok: false, error: singleError.message });
                    }
                }
            }
        }

        return results;
    }

    /**
     * 上传单批图片
     */
    async function uploadSingleBatch(imgUrls) {
        // 先下载所有图片
        const blobs = [];
        for (let i = 0; i < imgUrls.length; i++) {
            const imgUrl = imgUrls[i];
            try {
                console.log(`正在下载第${i + 1}张图片...`);
                const blob = await downloadImageAsBlob(imgUrl);
                blobs.push(blob);
                console.log(`第${i + 1}张图片下载完成`);
            } catch (error) {
                console.error(`第${i + 1}张图片下载失败:`, imgUrl, error);
                blobs.push(null);
            }
        }

        // 创建FormData
        const formData = new FormData();
        blobs.forEach((blob, index) => {
            if (blob) {
                formData.append('photos[]', blob, `image_${index}.jpg`);
            }
        });

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://xueren.one/tgup.php',
                data: formData,
                headers: {
                    'User-Agent': navigator.userAgent,
                    'Accept': 'application/json',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
                },
                onload: res => {
                    if (res.status === 200) {
                        try {
                            const result = JSON.parse(res.responseText);
                            if (result.ok && result.batch) {
                                console.log(`批量上传完成: 成功 ${result.success}/${result.total} 张`);

                                // 详细输出每张图片的上传结果
                                result.results.forEach((imgResult, index) => {
                                    if (imgResult.ok) {
                                        console.log(`第${index + 1}张上传成功: ${imgResult.custom_url}`);
                                    } else {
                                        console.warn(`第${index + 1}张上传失败: ${imgResult.msg || '未知错误'}`);
                                    }
                                });

                                resolve(result.results);
                            } else {
                                reject(new Error(result.msg || '批量上传失败'));
                            }
                        } catch (e) {
                            console.error('解析批量上传响应失败:', e);
                            reject(e);
                        }
                    } else {
                        reject(new Error(`HTTP错误: ${res.status}`));
                    }
                },
                onerror: err => {
                    console.error('批量上传请求失败:', err);
                    reject(err);
                }
            });
        });
    }

    /**
     * 上传图片文件到Telegram接口（带重试机制）
     */
    async function uploadToTelegram(imgUrl, retryCount = 0) {
        const maxRetries = 3;

        try {
            console.log(`开始上传图片到Telegram (尝试 ${retryCount + 1}/${maxRetries + 1}):`, imgUrl);

            // 先下载图片
            const blob = await downloadImageAsBlob(imgUrl);

            // 创建FormData
            const formData = new FormData();
            formData.append('photo', blob, 'image.jpg');

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://xueren.one/tgup.php',
                    data: formData,
                    headers: {
                        'User-Agent': navigator.userAgent,
                        'Accept': 'application/json',
                        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
                    },
                    onload: res => {
                        if (res.status === 200) {
                            try {
                                const result = JSON.parse(res.responseText);

                                if (result.ok) {
                                    console.log('图片上传成功，custom_url:', result.custom_url);
                                    resolve(result);
                                } else {
                                    console.error('图片上传失败，完整响应:', result);

                                    // 如果是重试次数未达到上限，则重试
                                    if (retryCount < maxRetries) {
                                        console.log(`上传失败，${2000 * (retryCount + 1)}ms后重试...`);
                                        setTimeout(async () => {
                                            try {
                                                const retryResult = await uploadToTelegram(imgUrl, retryCount + 1);
                                                resolve(retryResult);
                                            } catch (retryError) {
                                                reject(retryError);
                                            }
                                        }, 2000 * (retryCount + 1));
                                    } else {
                                        reject(new Error(result.msg || result.error || '上传失败'));
                                    }
                                }
                            } catch (e) {
                                console.error('解析响应失败:', e);
                                console.error('原始响应内容:', res.responseText);

                                // 如果是重试次数未达到上限，则重试
                                if (retryCount < maxRetries) {
                                    console.log(`解析失败，${2000 * (retryCount + 1)}ms后重试...`);
                                    setTimeout(async () => {
                                        try {
                                            const retryResult = await uploadToTelegram(imgUrl, retryCount + 1);
                                            resolve(retryResult);
                                        } catch (retryError) {
                                            reject(retryError);
                                        }
                                    }, 2000 * (retryCount + 1));
                                } else {
                                    reject(e);
                                }
                            }
                        } else {
                            console.error('图片上传失败，状态码:', res.status);
                            console.error('响应内容:', res.responseText);

                            // 如果是重试次数未达到上限，则重试
                            if (retryCount < maxRetries) {
                                console.log(`HTTP错误，${2000 * (retryCount + 1)}ms后重试...`);
                                setTimeout(async () => {
                                    try {
                                        const retryResult = await uploadToTelegram(imgUrl, retryCount + 1);
                                        resolve(retryResult);
                                    } catch (retryError) {
                                        reject(retryError);
                                    }
                                }, 2000 * (retryCount + 1));
                            } else {
                                reject(new Error(`状态码：${res.status}`));
                            }
                        }
                    },
                    onerror: err => {
                        console.error('图片上传请求失败:', err);

                        // 如果是重试次数未达到上限，则重试
                        if (retryCount < maxRetries) {
                            console.log(`请求失败，${2000 * (retryCount + 1)}ms后重试...`);
                            setTimeout(async () => {
                                try {
                                    const retryResult = await uploadToTelegram(imgUrl, retryCount + 1);
                                    resolve(retryResult);
                                } catch (retryError) {
                                    reject(retryError);
                                }
                            }, 2000 * (retryCount + 1));
                        } else {
                            reject(err);
                        }
                    }
                });
            });
        } catch (error) {
            console.error('下载图片失败:', error);

            // 如果是重试次数未达到上限，则重试
            if (retryCount < maxRetries) {
                console.log(`下载失败，${2000 * (retryCount + 1)}ms后重试...`);
                await sleep(2000 * (retryCount + 1));
                return await uploadToTelegram(imgUrl, retryCount + 1);
            } else {
                throw error;
            }
        }
    }

    /**
     * 从URL中提取图库ID
     */
    function extractGalleryAid(url) {
        // URL格式: /sc/webtoon/detail/code/{图库ID}/ep/{章节号}/toon/{漫画ID}
        const match = url.match(/\/detail\/code\/(\d+)\/ep\/(\d+)\/toon\/(\d+)/);
        if (match) {
            return {
                galleryAid: match[1], // 图库ID
                episodeNum: match[2],  // 章节号
                toonId: match[3]       // 漫画ID
            };
        }
        return null;
    }

    /**
     * 保存到数据库
     */
    async function saveToDatabase(chapterInfo, uploadResults, mangaName, chapterName, chapterUrl) {
        try {
            console.log('=== 开始数据库保存流程 ===');
            console.log('输入参数:', {
                chapterInfo: chapterInfo,
                uploadResultsLength: uploadResults.length,
                mangaName: mangaName,
                chapterName: chapterName,
                chapterUrl: chapterUrl
            });

            // 从URL中提取图库ID
            const urlInfo = extractGalleryAid(chapterUrl);
            let galleryAid, episodeNum;

            if (urlInfo) {
                galleryAid = urlInfo.galleryAid;
                episodeNum = urlInfo.episodeNum;
                console.log(`从URL提取到图库ID: ${galleryAid}, 章节号: ${episodeNum}`);
            } else {
                // 备用方案：使用章节号作为图库ID
                galleryAid = chapterInfo.chapterNum ?
                    `${chapterInfo.chapterNum}` :
                    `1`; // 漫画模式默认为第1话
                episodeNum = galleryAid;
                console.log(`使用备用方案，图库ID: ${galleryAid}`);
            }

            // 生成图库标题
            const galleryTitle = `${mangaName} ${episodeNum}话`;

            // 检查图库是否已存在
            console.log(`检查图库 ${galleryAid} 是否存在...`);
            const existsCheck = await dbApi.checkGalleryExists(galleryAid);
            console.log('图库存在检查结果:', existsCheck);

            if (existsCheck.ok && existsCheck.exists) {
                console.log(`图库 ${galleryAid} 已存在，跳过创建`);
            } else {
                // 上传封面图
                let coverUrl = '';
                if (chapterInfo.coverImage) {
                    try {
                        console.log('开始上传封面图...');
                        const coverResult = await uploadToTelegram(chapterInfo.coverImage);
                        if (coverResult && coverResult.ok) {
                            coverUrl = coverResult.custom_url;
                            console.log('封面图上传成功:', coverUrl);
                        }
                    } catch (error) {
                        console.error('封面图上传失败:', error);
                    }
                }

                // 保存图库信息
                const galleryData = {
                    aid: galleryAid,
                    title: galleryTitle,
                    type: '韩漫',
                    cover: coverUrl,
                    photo_count: uploadResults.length
                };

                console.log('准备保存图库数据:', galleryData);
                const saveResult = await dbApi.saveGallery(galleryData);
                console.log('图库保存结果:', saveResult);

                if (saveResult.ok) {
                    console.log('图库信息保存成功');
                } else {
                    console.error('图库信息保存失败:', saveResult.msg);
                }
            }

            // 保存图片信息
            const imageUrls = uploadResults.map(result => result.customUrl);
            console.log('准备保存图片数据:', {
                galleryAid: galleryAid,
                imageUrls: imageUrls
            });
            const imagesResult = await dbApi.saveGalleryImages(galleryAid, imageUrls);
            console.log('图片保存结果:', imagesResult);

            if (imagesResult.ok) {
                console.log('图片信息保存成功');
            } else {
                console.error('图片信息保存失败:', imagesResult.msg);
            }

        } catch (error) {
            console.error('数据库保存过程出错:', error);
            throw error;
        }
    }

    /**
     * 保存图库信息到数据库
     */
    async function saveGalleryInfo(chapterInfo, mangaName, chapterName, chapterUrl, totalImages) {
        try {
            console.log('=== 开始保存图库信息 ===');

            // 从URL中提取图库ID
            const urlInfo = extractGalleryAid(chapterUrl);
            let galleryAid, episodeNum;

            if (urlInfo) {
                galleryAid = urlInfo.galleryAid;
                episodeNum = urlInfo.episodeNum;
                console.log(`从URL提取到图库ID: ${galleryAid}, 章节号: ${episodeNum}`);
            } else {
                // 备用方案：使用章节号作为图库ID
                galleryAid = chapterInfo.chapterNum ?
                    `${chapterInfo.chapterNum}` :
                    `1`; // 漫画模式默认为第1话
                episodeNum = galleryAid;
                console.log(`使用备用方案，图库ID: ${galleryAid}`);
            }

            // 生成图库标题
            const galleryTitle = `${mangaName} ${episodeNum}话`;

            // 检查图库是否已存在
            // 图库存在检查已在uploadChapter函数中提前进行

            // 上传封面图
            let coverUrl = '';

            if (chapterInfo.coverImage) {
                try {
                    console.log('开始上传封面图:', chapterInfo.coverImage);
                    const coverResult = await uploadToTelegram(chapterInfo.coverImage);
                    if (coverResult && coverResult.ok) {
                        coverUrl = coverResult.custom_url;
                        console.log('封面图上传成功:', coverUrl);
                    } else {
                        console.error('封面图上传失败，响应:', coverResult);
                    }
                } catch (error) {
                    console.error('封面图上传失败:', error);
                }
            } else {
                console.warn('没有封面图信息，跳过封面图上传');
            }

            // 保存图库信息
            const galleryData = {
                aid: galleryAid,
                title: galleryTitle,
                type: '韩漫',
                cover: coverUrl,
                photo_count: totalImages
            };

            console.log('准备保存图库数据:', galleryData);
            const saveResult = await dbApi.saveGallery(galleryData);
            console.log('图库保存结果:', saveResult);

            if (saveResult.ok) {
                console.log('图库信息保存成功');
                return galleryAid;
            } else {
                console.error('图库信息保存失败:', saveResult.msg);
                throw new Error(saveResult.msg);
            }

        } catch (error) {
            console.error('保存图库信息过程出错:', error);
            throw error;
        }
    }

    /**
     * 保存图片信息到数据库
     */
    async function saveImagesInfo(chapterInfo, uploadResults, chapterUrl) {
        try {
            console.log('=== 开始保存图片信息 ===');

            // 从URL中提取图库ID
            const urlInfo = extractGalleryAid(chapterUrl);
            let galleryAid;

            if (urlInfo) {
                galleryAid = urlInfo.galleryAid;
                console.log(`从URL提取到图库ID: ${galleryAid}`);
            } else {
                // 备用方案：使用章节号作为图库ID
                galleryAid = chapterInfo.chapterNum ?
                    `${chapterInfo.chapterNum}` :
                    `1`; // 漫画模式默认为第1话
                console.log(`使用备用方案，图库ID: ${galleryAid}`);
            }

            // 保存图片信息，保持原始序号
            const imageData = uploadResults.map(result => ({
                url: result.customUrl,
                index: result.index
            }));
            console.log('准备保存图片数据:', {
                galleryAid: galleryAid,
                imageCount: imageData.length,
                imageData: imageData
            });
            const imagesResult = await dbApi.saveGalleryImages(galleryAid, imageData);
            console.log('图片保存结果:', imagesResult);

            if (imagesResult.ok) {
                console.log('图片信息保存成功');
            } else {
                console.error('图片信息保存失败:', imagesResult.msg);
                throw new Error(imagesResult.msg);
            }

        } catch (error) {
            console.error('保存图片信息过程出错:', error);
            throw error;
        }
    }

    /**
     * 从漫画目录页获取第一个章节的URL和封面图
     */
    async function getFirstChapterUrl(mangaUrl) {
        try {
            console.log('获取漫画目录页:', mangaUrl);

            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: mangaUrl,
                    responseType: 'text',
                    headers: {
                        'Referer': 'https://www.toomics.net',
                        'User-Agent': navigator.userAgent
                    },
                    onload: res => {
                        console.log('漫画目录页响应状态:', res.status);
                        resolve(res);
                    },
                    onerror: err => {
                        console.error('漫画目录页请求失败:', err);
                        reject(err);
                    }
                });
            });

            if (response.status !== 200) {
                throw new Error(`访问漫画目录页失败: HTTP ${response.status}`);
            }

            // 创建临时 DOM 来解析页面内容
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, 'text/html');

            // 调试：输出页面结构信息
            console.log('页面标题:', doc.title);
            console.log('查找章节链接...');

            // 尝试多种选择器来查找章节链接
            const selectors = [
                '.list-ep li.normal_ep a',
                '.list-ep li a',
                '.list-ep a',
                '.episode-list li a',
                '.chapter-list li a',
                'a[onclick*="location.href"]',
                'a[href*="/episode/"]',
                'a[href*="/detail/"]',
                'a[href*="code/"]',
                'a[onclick*="detail"]'
            ];

            let firstChapterLink = null;
            let usedSelector = '';

            for (const selector of selectors) {
                const links = doc.querySelectorAll(selector);
                console.log(`选择器 "${selector}" 找到 ${links.length} 个链接`);

                if (links.length > 0) {
                    // 遍历所有链接，找到第一个非预告片的章节
                    for (const link of links) {
                        const onclickMatch = link.getAttribute('onclick')?.match(/location\.href='([^']+)'/);
                        const href = link.getAttribute('href');

                        let urlToCheck = '';
                        if (onclickMatch) {
                            urlToCheck = onclickMatch[1];
                        } else if (href) {
                            urlToCheck = href;
                        }

                        // 检查是否是预告片（ep/0）
                        if (urlToCheck && !urlToCheck.includes('/ep/0/')) {
                            firstChapterLink = link;
                            usedSelector = selector;
                            console.log(`使用选择器: ${selector}，找到非预告片章节`);
                            break;
                        } else if (urlToCheck && urlToCheck.includes('/ep/0/')) {
                            console.log(`跳过预告片: ${urlToCheck}`);
                        }
                    }

                    if (firstChapterLink) {
                        break;
                    }
                }
            }

            if (firstChapterLink) {
                console.log('找到章节链接元素:', firstChapterLink);
                console.log('链接属性:', {
                    href: firstChapterLink.getAttribute('href'),
                    onclick: firstChapterLink.getAttribute('onclick'),
                    text: firstChapterLink.textContent.trim()
                });

                // 尝试从onclick属性获取URL
                const onclickMatch = firstChapterLink.getAttribute('onclick')?.match(/location\.href='([^']+)'/);
                if (onclickMatch) {
                    const chapterUrl = 'https://www.toomics.net' + onclickMatch[1];
                    console.log('从onclick找到第一个章节URL:', chapterUrl);
                    return chapterUrl;
                }

                // 尝试从href属性获取URL
                const href = firstChapterLink.getAttribute('href');
                if (href) {
                    let chapterUrl;
                    if (href.startsWith('http')) {
                        chapterUrl = href;
                    } else if (href.includes('/detail/')) {
                        chapterUrl = 'https://www.toomics.net' + href;
                    } else if (href.includes('/episode/toon/')) {
                        // 这是目录页链接，需要进一步处理
                        console.log('找到目录页链接，需要获取具体章节:', href);
                        // 暂时返回null，让调用方知道这是目录页
                        return null;
                    }

                    if (chapterUrl) {
                        console.log('从href找到第一个章节URL:', chapterUrl);
                        return chapterUrl;
                    }
                }
            }

            // 如果还是没找到，输出更多调试信息
            console.warn('未找到第一个章节链接');
            console.log('页面中所有包含"episode"的链接:');
            const allEpisodeLinks = doc.querySelectorAll('a[href*="episode"]');
            allEpisodeLinks.forEach((link, index) => {
                console.log(`链接${index + 1}:`, {
                    href: link.getAttribute('href'),
                    onclick: link.getAttribute('onclick'),
                    text: link.textContent.trim()
                });
            });

            return null;
        } catch (error) {
            console.error('获取第一个章节URL失败:', error);
            return null;
        }
    }

    /**
     * 从目录页获取第一个真正的章节URL
     */
    async function getFirstRealChapterUrl(directoryUrl) {
        try {
            console.log('访问目录页获取章节:', directoryUrl);

            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: directoryUrl,
                    responseType: 'text',
                    headers: {
                        'Referer': 'https://www.toomics.net',
                        'User-Agent': navigator.userAgent
                    },
                    onload: res => {
                        console.log('目录页响应状态:', res.status);
                        resolve(res);
                    },
                    onerror: err => {
                        console.error('目录页请求失败:', err);
                        reject(err);
                    }
                });
            });

            if (response.status !== 200) {
                throw new Error(`访问目录页失败: HTTP ${response.status}`);
            }

            // 创建临时 DOM 来解析页面内容
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, 'text/html');

            console.log('目录页标题:', doc.title);

            // 查找第一个章节链接
            const chapterSelectors = [
                '.list-ep li.normal_ep a',
                '.list-ep li a',
                '.list-ep a',
                'a[onclick*="location.href"]',
                'a[href*="/detail/"]'
            ];

            for (const selector of chapterSelectors) {
                const links = doc.querySelectorAll(selector);
                console.log(`目录页选择器 "${selector}" 找到 ${links.length} 个链接`);

                if (links.length > 0) {
                    // 遍历所有链接，找到第一个非预告片的章节
                    for (const link of links) {
                        console.log('检查链接:', {
                            href: link.getAttribute('href'),
                            onclick: link.getAttribute('onclick'),
                            text: link.textContent.trim()
                        });

                        // 尝试从onclick获取URL
                        const onclickMatch = link.getAttribute('onclick')?.match(/location\.href='([^']+)'/);
                        if (onclickMatch) {
                            const urlToCheck = onclickMatch[1];
                            // 检查是否是预告片（ep/0）
                            if (!urlToCheck.includes('/ep/0/')) {
                                const chapterUrl = 'https://www.toomics.net' + urlToCheck;
                                console.log('从onclick找到非预告片章节URL:', chapterUrl);
                                return chapterUrl;
                            } else {
                                console.log(`跳过预告片: ${urlToCheck}`);
                            }
                        }

                        // 尝试从href获取URL
                        const href = link.getAttribute('href');
                        if (href && href.includes('/detail/')) {
                            // 检查是否是预告片（ep/0）
                            if (!href.includes('/ep/0/')) {
                                const chapterUrl = href.startsWith('http') ? href : 'https://www.toomics.net' + href;
                                console.log('从href找到非预告片章节URL:', chapterUrl);
                                return chapterUrl;
                            } else {
                                console.log(`跳过预告片: ${href}`);
                            }
                        }
                    }
                }
            }

            console.warn('目录页中未找到章节链接');
            return null;

        } catch (error) {
            console.error('获取章节URL失败:', error);
            return null;
        }
    }

    /**
     * 从漫画章节列表页面获取所有章节
     */
    async function getAllChaptersFromManga(mangaUrl) {
        try {
            console.log('获取漫画章节列表:', mangaUrl);

            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: mangaUrl,
                    responseType: 'text',
                    headers: {
                        'Referer': 'https://www.toomics.net',
                        'User-Agent': navigator.userAgent
                    },
                    onload: res => {
                        console.log('章节列表页响应状态:', res.status);
                        resolve(res);
                    },
                    onerror: err => {
                        console.error('章节列表页请求失败:', err);
                        reject(err);
                    }
                });
            });

            if (response.status !== 200) {
                throw new Error(`访问章节列表页失败: HTTP ${response.status}`);
            }

            // 创建临时 DOM 来解析页面内容
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, 'text/html');

            console.log('章节列表页标题:', doc.title);

            // 获取所有章节元素 - 使用与demo.js相同的方法
            let chapterElements = doc.querySelectorAll('.list-ep li.normal_ep');
            console.log('找到章节元素数量:', chapterElements.length);

            // 如果没有找到章节，尝试其他选择器
            if (chapterElements.length === 0) {
                console.log('尝试其他选择器...');
                const altSelectors = [
                    '.list-ep li',
                    '.episode-list li',
                    '.chapter-list li',
                    'li.normal_ep',
                    '.ep-item',
                    '.chapter-item'
                ];

                for (const selector of altSelectors) {
                    const elements = doc.querySelectorAll(selector);
                    console.log(`选择器 "${selector}" 找到 ${elements.length} 个元素`);
                    if (elements.length > 0) {
                        console.log('使用选择器:', selector);
                        chapterElements = elements;
                        break;
                    }
                }
            }

            const chapters = [];

            chapterElements.forEach((li, index) => {
                const link = li.querySelector('a');
                if (link) {
                    let detailUrl = null;
                    let chapterNum = index + 1;
                    let title = 'Unknown';

                    // 尝试多种方式获取URL
                    // 1. 从 onclick 中提取 URL
                    const onclickMatch = link.getAttribute('onclick')?.match(/location\.href='([^']+)'/);
                    if (onclickMatch) {
                        detailUrl = onclickMatch[1];
                    } else {
                        // 2. 从 href 属性获取
                        const href = link.getAttribute('href');
                        if (href && href.startsWith('/')) {
                            detailUrl = href;
                        }
                    }

                    if (detailUrl) {
                        // 尝试多种方式获取章节号
                        const numElement = li.querySelector('.cell-num .num') ||
                                         li.querySelector('.num') ||
                                         li.querySelector('.episode-num') ||
                                         li.querySelector('.chapter-num');
                        if (numElement) {
                            chapterNum = parseInt(numElement.textContent) || (index + 1);
                        }

                        // 尝试多种方式获取标题
                        const titleElement = li.querySelector('.cell-title strong') ||
                                           li.querySelector('.title') ||
                                           li.querySelector('.episode-title') ||
                                           li.querySelector('.chapter-title') ||
                                           link.querySelector('span') ||
                                           link;
                        if (titleElement) {
                            title = titleElement.textContent?.trim() || 'Unknown';
                        }

                        // 检查是否是预告片（ep/0）
                        if (detailUrl.includes('/ep/0/')) {
                            console.log(`跳过预告片: ${title} (${detailUrl})`);
                            return; // 跳过预告片
                        }

                        // 确保URL是完整的
                        if (!detailUrl.startsWith('http')) {
                            detailUrl = 'https://www.toomics.net' + detailUrl;
                        }

                        chapters.push({
                            index: index + 1,
                            chapterNum: parseInt(chapterNum),
                            title: title,
                            detailUrl: detailUrl,
                            isOwn: li.classList.contains('own')
                        });

                        console.log(`找到章节: ${title} (${detailUrl})`);
                    }
                }
            });

            console.log(`过滤预告片后，找到 ${chapters.length} 个有效章节`);
            return chapters;

        } catch (error) {
            console.error('获取章节列表失败:', error);
            return null;
        }
    }

    /**
     * 上传单个章节
     */
    async function uploadChapter(chapterInfo) {
        try {
            let targetUrl = chapterInfo.detailUrl;

            // 如果是漫画对象（从排行榜来的），需要获取所有章节
            if (chapterInfo.title && !chapterInfo.chapterNum) {
                console.log(`开始处理漫画: ${chapterInfo.title}`);
                // 获取漫画的所有章节列表
                const allChapters = await getAllChaptersFromManga(chapterInfo.detailUrl);
                if (!allChapters || allChapters.length === 0) {
                    console.warn(`漫画 ${chapterInfo.title} 未找到任何章节`);
                    return null;
                }
                console.log(`漫画 ${chapterInfo.title} 找到 ${allChapters.length} 个章节`);

                // 上传所有章节
                const allResults = [];
                for (let i = 0; i < allChapters.length; i++) {
                    const chapter = allChapters[i];
                    // 将封面图信息传递给章节
                    chapter.coverImage = chapterInfo.coverImage;
                    console.log(`开始上传第 ${i + 1}/${allChapters.length} 个章节: ${chapter.title}`);

                    try {
                        const result = await uploadChapter(chapter);
                        if (result) {
                            if (result.skipped) {
                                console.log(`章节 ${chapter.title} 已跳过: ${result.reason}`);
                            } else {
                                allResults.push(result);
                            }
                        }
                    } catch (error) {
                        console.error(`章节 ${chapter.title} 上传失败:`, error);
                    }

                    // 章节间延迟
                    if (i < allChapters.length - 1) {
                        await sleep(2000);
                    }
                }

                return {
                    mangaTitle: chapterInfo.title,
                    totalChapters: allChapters.length,
                    successChapters: allResults.length,
                    results: allResults
                };
            } else {
                console.log(`开始上传章节 ${chapterInfo.chapterNum}: ${chapterInfo.detailUrl}`);
            }

            // 先检查图库是否存在
            const urlInfo = extractGalleryAid(targetUrl);
            if (urlInfo) {
                console.log(`检查图库 ${urlInfo.galleryAid} 是否存在...`);
                const existsCheck = await dbApi.checkGalleryExists(urlInfo.galleryAid);
                console.log('图库存在检查结果:', existsCheck);

                if (existsCheck.ok && existsCheck.exists) {
                    const itemName = chapterInfo.chapterNum ? `章节 ${chapterInfo.chapterNum}` : `漫画 ${chapterInfo.title}`;
                    console.log(`${itemName} 已存在，跳过处理`);
                    return {
                        skipped: true,
                        reason: '图库已存在',
                        chapterInfo: chapterInfo
                    };
                }
            }

            // 访问章节详情页
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: targetUrl,
                    responseType: 'text',
                    headers: {
                        'Referer': 'https://www.toomics.net',
                        'User-Agent': navigator.userAgent
                    },
                    onload: res => {
                        const itemName = chapterInfo.chapterNum ? `章节 ${chapterInfo.chapterNum}` : `漫画 ${chapterInfo.title}`;
                        console.log(`${itemName} 页面响应状态:`, res.status);
                        resolve(res);
                    },
                    onerror: err => {
                        const itemName = chapterInfo.chapterNum ? `章节 ${chapterInfo.chapterNum}` : `漫画 ${chapterInfo.title}`;
                        console.error(`${itemName} 页面请求失败:`, err);
                        reject(err);
                    }
                });
            });

            if (response.status !== 200) {
                throw new Error(`访问页面失败: HTTP ${response.status}`);
            }

            const currentItemName = chapterInfo.chapterNum ? `章节 ${chapterInfo.chapterNum}` : `漫画 ${chapterInfo.title}`;
            console.log(`${currentItemName} 页面获取成功，长度:`, response.responseText.length);

            // 创建临时 DOM 来解析页面内容
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, 'text/html');

                         // 获取所有图片元素 - 直接获取，不等待懒加载
             const imgNodes = doc.querySelectorAll('#viewer-img img');
            console.log(`${currentItemName} 找到 ${imgNodes.length} 张图片`);

             if (!imgNodes.length) {
                console.warn(`${currentItemName} 未找到图片`);
                 return null;
             }

             // 将 NodeList 转换为真正的数组
             const imgArray = Array.from(imgNodes);

             // 获取页面信息
             const titleElement = doc.querySelector('.viewer-title a');
             let mangaName = 'Unknown';
            let chapterName = '第1话';

             if (titleElement) {
                 const fullText = titleElement.textContent.trim();
                 const emElement = titleElement.querySelector('em');
                 if (emElement) {
                     chapterName = emElement.textContent.trim();
                     mangaName = fullText.replace(chapterName, '').trim();
                 }
             }

            // 如果是漫画对象，使用漫画的标题
            if (chapterInfo.title && !chapterInfo.chapterNum) {
                mangaName = chapterInfo.title;
                chapterName = '第1话';
             }

             const cleanName = (name) => {
                 return name.replace(/[<>:"/\\|?*]/g, '_').replace(/\s+/g, '_').trim();
             };

            // 先保存图库信息到数据库
            try {
                console.log('开始保存图库信息到数据库...');
                await saveGalleryInfo(chapterInfo, mangaName, chapterName, targetUrl, imgArray.length);
                console.log('图库信息保存完成');
            } catch (error) {
                console.error('保存图库信息失败:', error);
                console.error('错误详情:', error.message);
                console.error('错误堆栈:', error.stack);
                return null; // 如果图库信息保存失败，直接返回
            }

            // 批量上传图片 - 每次上传10张图片
            const uploadResults = [];
            const batchSize = 10; // 每批上传10张图片
            const itemName = chapterInfo.chapterNum ? `章节 ${chapterInfo.chapterNum}` : `漫画 ${chapterInfo.title}`;

            // 先收集所有有效的图片URL
            const validImageUrls = [];
            imgArray.forEach((imgElement, index) => {
                    // 获取真实的图片URL - 优先使用 data-original 属性
                    let imgURL = imgElement.getAttribute('data-original');

                    // 如果没有 data-original，尝试其他属性
                    if (!imgURL || imgURL.startsWith('data:')) {
                        imgURL = imgElement.getAttribute('data-src') ||
                                 imgElement.getAttribute('data-lazy') ||
                                 imgElement.getAttribute('data-url');
                    }

                    // 如果还是没有，使用 src 属性
                    if (!imgURL || imgURL.startsWith('data:') || imgURL.includes('placeholder')) {
                        imgURL = imgElement.src;
                    }

                    // 过滤掉占位图片
                    if (!imgURL || imgURL.startsWith('data:') || imgURL.includes('placeholder')) {
                    console.log(`跳过占位图片 ${index + 1}: ${imgURL}`);
                } else {
                    validImageUrls.push({
                        index: index,
                        url: imgURL
                    });
                }
            });

            console.log(`${itemName} 找到 ${validImageUrls.length} 张有效图片，开始批量上传...`);

            // 分批上传图片，每批完成后写入数据库
            const totalBatches = Math.ceil(validImageUrls.length / batchSize);
            console.log(`${itemName} 将分 ${totalBatches} 批上传，每批 ${batchSize} 张图片`);

            for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
                const startIndex = batchIndex * batchSize;
                const endIndex = Math.min(startIndex + batchSize, validImageUrls.length);
                const currentBatch = validImageUrls.slice(startIndex, endIndex);

                console.log(`${itemName} 开始上传第 ${batchIndex + 1}/${totalBatches} 批 (${currentBatch.length} 张图片)`);

                try {
                    // 上传当前批次
                    const imgUrls = currentBatch.map(item => item.url);
                    const batchResults = await uploadBatchToTelegram(imgUrls, batchSize);

                    // 处理当前批次的上传结果
                    const batchUploadResults = [];
                    batchResults.forEach((result, resultIndex) => {
                        const originalIndex = currentBatch[resultIndex].index;
                        const globalIndex = originalIndex + 1; // 全局序号（从1开始）

                        if (result && result.ok) {
                            const uploadResult = {
                                index: originalIndex,
                                originalUrl: currentBatch[resultIndex].url,
                                customUrl: result.custom_url,
                                telegramUrl: result.url,
                                filePath: result.file_path
                            };
                            batchUploadResults.push(uploadResult);
                            uploadResults.push(uploadResult);
                            console.log(`第${globalIndex}张上传成功: ${result.custom_url}`);
                         } else {
                            console.warn(`第${globalIndex}张上传失败: ${result?.msg || '未知错误'}`);
                        }
                    });

                    // 当前批次上传完成后，立即写入数据库
                    if (batchUploadResults.length > 0) {
                        console.log(`${itemName} 第 ${batchIndex + 1} 批上传完成，开始写入数据库 (${batchUploadResults.length} 张图片)`);
                        try {
                            await saveImagesInfo(chapterInfo, batchUploadResults, targetUrl);
                            console.log(`${itemName} 第 ${batchIndex + 1} 批数据库写入成功`);
                        } catch (dbError) {
                            console.error(`${itemName} 第 ${batchIndex + 1} 批数据库写入失败:`, dbError);
                        }
                    }

                    // 批次间延迟
                    if (batchIndex < totalBatches - 1) {
                        console.log(`${itemName} 批次间延迟 2 秒...`);
                        await sleep(2000);
                    }

                } catch (error) {
                    console.error(`${itemName} 第 ${batchIndex + 1} 批批量上传失败，回退到单张上传:`, error);

                    // 回退到单张上传当前批次
                    const batchUploadResults = [];
                    for (let i = 0; i < currentBatch.length; i++) {
                        const { index: originalIndex, url: imgURL } = currentBatch[i];
                        const globalIndex = originalIndex + 1; // 全局序号（从1开始）

                        try {
                            console.log(`单张上传第${globalIndex}张图片: ${imgURL}`);
                            await sleep(1000); // 单张上传延迟

                            const uploadResult = await uploadToTelegram(imgURL);

                            if (uploadResult && uploadResult.ok) {
                                const result = {
                                    index: originalIndex,
                                    originalUrl: imgURL,
                                    customUrl: uploadResult.custom_url,
                                    telegramUrl: uploadResult.url,
                                    filePath: uploadResult.file_path
                                };
                                batchUploadResults.push(result);
                                uploadResults.push(result);
                                console.log(`第${globalIndex}张上传成功: ${uploadResult.custom_url}`);
                            } else {
                                console.warn(`第${globalIndex}张上传失败: ${uploadResult?.msg || '未知错误'}`);
                            }
                        } catch (e) {
                            console.error(`第${globalIndex}张上传失败:`, e);
                        }
                    }

                    // 单张上传完成后也写入数据库
                    if (batchUploadResults.length > 0) {
                        console.log(`${itemName} 第 ${batchIndex + 1} 批单张上传完成，开始写入数据库 (${batchUploadResults.length} 张图片)`);
                        try {
                            await saveImagesInfo(chapterInfo, batchUploadResults, targetUrl);
                            console.log(`${itemName} 第 ${batchIndex + 1} 批数据库写入成功`);
                        } catch (dbError) {
                            console.error(`${itemName} 第 ${batchIndex + 1} 批数据库写入失败:`, dbError);
                        }
                    }
                }
            }

            const finalItemName = chapterInfo.chapterNum ? `章节 ${chapterInfo.chapterNum}` : `漫画 ${chapterInfo.title}`;
            console.log(`${finalItemName} 上传完成，共 ${uploadResults.length} 张有效图片`);

            // 输出所有图片的custom_url到控制台
            console.log(`=== ${finalItemName} 所有图片链接 ===`);
            uploadResults.forEach((result, index) => {
                console.log(`第${index + 1}张: ${result.customUrl}`);
            });
            console.log(`=== ${finalItemName} 链接输出完毕 ===`);

            // 图片信息已在每批上传完成后写入数据库，无需再次写入

            return {
                chapterNum: chapterInfo.chapterNum || 1,
                title: chapterInfo.title,
                uploadResults: uploadResults
            };

        } catch (error) {
            const itemName = chapterInfo.chapterNum ? `章节 ${chapterInfo.chapterNum}` : `漫画 ${chapterInfo.title}`;
            console.error(`上传${itemName}失败:`, error);
            return null;
        }
    }

    /**
     * 批量上传指定范围的章节
     */
    async function uploadChaptersInRange() {
        const startChapter = parseInt(document.getElementById('start-chapter').value) || 1;
        const endChapter = parseInt(document.getElementById('end-chapter').value) || 0;

        const allChapters = getChapterList();
        if (allChapters.length === 0) {
            alert('未找到任何章节');
            return;
        }

        // 过滤指定范围的章节
        let targetChapters = allChapters;
        if (endChapter > 0) {
            targetChapters = allChapters.filter(chapter =>
                chapter.chapterNum >= startChapter && chapter.chapterNum <= endChapter
            );
        }

        if (targetChapters.length === 0) {
            alert(`未找到章节 ${startChapter} 到 ${endChapter} 的范围`);
            return;
        }

        console.log(`找到 ${targetChapters.length} 个目标章节:`, targetChapters);
        await processUpload(targetChapters, '章节');
    }

    /**
     * 批量上传指定范围的漫画
     */
    async function uploadMangaInRange() {
        const startManga = parseInt(document.getElementById('start-manga').value) || 1;
        const endManga = parseInt(document.getElementById('end-manga').value) || 0;

        const allManga = getRankingMangaList();
        if (allManga.length === 0) {
            alert('未找到任何漫画');
            return;
        }

        // 过滤指定范围的漫画
        let targetManga = allManga;
        if (endManga > 0) {
            // 判断是否需要倒序（开始序号大于结束序号）
            if (startManga > endManga) {
                // 倒序：从大序号到小序号
                targetManga = allManga.filter(manga =>
                    manga.index >= endManga && manga.index <= startManga
                );
                targetManga = targetManga.reverse();
                console.log(`倒序上传：从第${startManga}个到第${endManga}个`);
            } else {
                // 正序：从小序号到大序号
                targetManga = allManga.filter(manga =>
                    manga.index >= startManga && manga.index <= endManga
                );
                console.log(`正序上传：从第${startManga}个到第${endManga}个`);
            }
        }

        if (targetManga.length === 0) {
            alert(`未找到漫画 ${startManga} 到 ${endManga} 的范围`);
            return;
        }

        console.log(`找到 ${targetManga.length} 个18+目标漫画:`, targetManga);
        await processUpload(targetManga, '漫画');
    }

    /**
     * 处理上传的通用函数
     */
    async function processUpload(targetItems, itemType) {
        // 更新按钮状态
        const btn = document.getElementById('upload-all-btn');
        btn.disabled = true;
        btn.innerText = `开始上传 ${targetItems.length} 个${itemType}...`;

        // 创建进度显示
        const progressDiv = document.createElement('div');
        progressDiv.style.cssText = `
            position: fixed; top: 180px; right: 20px; width: 320px;
            background: rgba(0,0,0,0.9); color: white; padding: 15px;
            border-radius: 8px; z-index: 9999; font-size: 12px; max-height: 400px; overflow-y: auto;
        `;
        document.body.appendChild(progressDiv);

        const allUploadResults = [];
        let successCount = 0;
        let failCount = 0;

        // 顺序上传控制函数
        async function uploadItemsSequentially(items) {
            const results = [];

            // 逐个上传项目，一个完成后才开始下一个
            for (let i = 0; i < items.length; i++) {
                const item = items[i];

                // 更新进度
                const itemName = itemType === '章节' ? `第${item.chapterNum}话` : item.title;
                progressDiv.innerHTML = `
                    <div style="margin-bottom: 10px; font-weight: bold;">顺序上传进度</div>
                    <div>当前进度: ${i + 1}/${items.length}</div>
                    <div>正在上传: ${itemName}</div>
                    <div>成功: ${successCount} | 失败: ${failCount}</div>
                    <div style="margin-top: 10px; font-size: 11px; color: #ccc;">
                        上传模式: 顺序上传<br>
                        ${items.slice(0, i + 1).map(item => {
                            const name = itemType === '章节' ? `第${item.chapterNum}话: ${item.title}` : `${item.title} - ${item.writer}`;
                            return name;
                        }).join('<br>')}
                    </div>
                `;

                try {
                    console.log(`开始上传${itemType} ${itemName}: ${item.title}`);
                    const result = await uploadChapter(item);

                    if (result && result.uploadResults.length > 0) {
                        successCount++;
                        console.log(`${itemType} ${itemName} 上传完成，共 ${result.uploadResults.length} 张图片`);
                        results.push({ success: true, item, result });
                    } else {
                        failCount++;
                        console.warn(`${itemType} ${itemName} 未获取到有效图片`);
                        results.push({ success: false, item, error: '未获取到有效图片' });
                    }
                } catch (error) {
                    failCount++;
                    console.error(`${itemType} ${itemName} 上传失败:`, error);
                    results.push({ success: false, item, error: error.message });
                }

                // 项目间延迟，避免请求过于频繁
                if (i < items.length - 1) {
                    progressDiv.innerHTML += `<div style="margin-top: 10px; color: #FFA500;">${itemName}完成，准备上传下一个...</div>`;
                    await sleep(2000);
                }
            }

            return results;
        }

        // 使用顺序上传
        const uploadResults = await uploadItemsSequentially(targetItems);

        // 显示最终结果
        progressDiv.innerHTML += `<div style="margin-top: 15px; color: #4CAF50;">所有${itemType}上传完成！成功: ${successCount} | 失败: ${failCount}</div>`;

        btn.innerText = '开始上传';
        btn.disabled = false;

        // 10秒后隐藏进度信息
        setTimeout(() => {
            if (document.body.contains(progressDiv)) {
                document.body.removeChild(progressDiv);
            }
        }, 10000);
    }

    /** 创建上传控制面板 **/
    const controlPanel = document.createElement('div');
    controlPanel.style.cssText = `
        position: fixed; top: 80px; right: 20px; width: 300px;
        background: rgba(0,0,0,0.9); color: white; padding: 15px;
        border-radius: 8px; z-index: 9999; font-size: 12px;
    `;

    // 检测当前页面类型
    const isRankingPage = window.location.pathname.includes('/ranking');
    const isChapterPage = window.location.pathname.includes('/episode/toon/');

    let panelHTML = `
        <div style="margin-bottom: 15px; font-weight: bold; text-align: center; position: relative;">
            18+漫画批量上传到Telegram
            <button id="toggle-panel-btn" style="
                position: absolute; right: 0; top: 0;
                background: #666; color: white; border: none;
                padding: 2px 6px; border-radius: 3px; cursor: pointer;
                font-size: 10px;
            ">隐藏</button>
        </div>
    `;

    if (isRankingPage) {
        // 排行榜页面 - 上传漫画
        panelHTML += `
            <div style="margin-bottom: 10px; color: #4CAF50; font-weight: bold;">📚 18+漫画排行榜模式</div>

            <div style="margin-bottom: 10px;">
                <label style="display: block; margin-bottom: 5px;">开始漫画:</label>
                <input type="number" id="start-manga" placeholder="留空从第1个开始"
                       style="width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 4px; color: #000;">
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px;">结束漫画:</label>
                <input type="number" id="end-manga" placeholder="留空上传到最后一个"
                       style="width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 4px; color: #000;">
            </div>

            <button id="upload-all-btn" style="
                width: 100%; padding: 10px; background: #27ae60; color: white;
                border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: bold;
            ">开始上传漫画</button>

            <div style="margin-top: 10px; font-size: 11px; color: #ccc; line-height: 1.3;">
                使用说明:<br>
                • 只上传带有18+标签的漫画<br>
                • 留空开始漫画 = 从第1个18+漫画开始<br>
                • 留空结束漫画 = 上传到最后一个18+漫画<br>
                • 正序: 开始2, 结束5 = 上传第2-5个18+漫画<br>
                • 倒序: 开始5, 结束2 = 上传第5-2个18+漫画<br>
                • 每个漫画会上传所有章节<br>
                • 图片链接会在控制台输出
            </div>
        `;
    } else if (isChapterPage) {
        // 章节页面 - 上传章节
        panelHTML += `
            <div style="margin-bottom: 10px; color: #3498db; font-weight: bold;">📖 章节模式</div>

        <div style="margin-bottom: 10px;">
            <label style="display: block; margin-bottom: 5px;">开始章节:</label>
            <input type="number" id="start-chapter" placeholder="留空从第1话开始"
                   style="width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 4px; color: #000;">
        </div>

        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px;">结束章节:</label>
                <input type="number" id="end-chapter" placeholder="留空上传到最后一话"
                   style="width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 4px; color: #000;">
        </div>

            <button id="upload-all-btn" style="
                width: 100%; padding: 10px; background: #27ae60; color: white;
            border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: bold;
            ">开始上传章节</button>

        <div style="margin-top: 10px; font-size: 11px; color: #ccc; line-height: 1.3;">
            使用说明:<br>
            • 留空开始章节 = 从第1话开始<br>
                • 留空结束章节 = 上传到最后一话<br>
                • 例如: 开始2, 结束5 = 上传第2-5话<br>
                • 只上传已拥有的章节<br>
                • 图片链接会在控制台输出
        </div>
    `;
    } else {
        // 其他页面
        panelHTML += `
            <div style="margin-bottom: 10px; color: #e74c3c; font-weight: bold;">⚠️ 不支持此页面</div>
            <div style="font-size: 11px; color: #ccc;">
                请访问漫画目录页或排行榜页面使用此功能
        </div>
    `;
    }

    controlPanel.innerHTML = panelHTML;
    document.body.appendChild(controlPanel);

    // 创建独立的显示按钮（当面板隐藏时使用）
    const showPanelBtn = document.createElement('button');
    showPanelBtn.id = 'show-panel-btn';
    showPanelBtn.textContent = '📤 显示面板';
    showPanelBtn.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 10000;
        background: #4CAF50; color: white; border: none;
        padding: 8px 12px; border-radius: 4px; cursor: pointer;
        font-size: 12px; font-weight: bold; display: none;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(showPanelBtn);

    // 添加点击事件
    if (isRankingPage) {
        document.getElementById('upload-all-btn').addEventListener('click', uploadMangaInRange);
    } else if (isChapterPage) {
        document.getElementById('upload-all-btn').addEventListener('click', uploadChaptersInRange);
    }

    // 添加隐藏/显示按钮事件
    const toggleBtn = document.getElementById('toggle-panel-btn');

    toggleBtn.addEventListener('click', () => {
        controlPanel.style.display = 'none';
        showPanelBtn.style.display = 'block';
    });

    // 独立显示按钮事件
    showPanelBtn.addEventListener('click', () => {
        controlPanel.style.display = 'block';
        showPanelBtn.style.display = 'none';
    });

    console.log('Toomics 批量上传器已加载');

    // 如果是排行榜页面，立即为每个漫画添加上传按钮
    if (isRankingPage) {
        // 延迟一下确保页面完全加载
        setTimeout(() => {
            getRankingMangaList();
        }, 1000);
    }

})();