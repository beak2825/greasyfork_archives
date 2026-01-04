// ==UserScript==
// @name         Toomics 漫画批量下载（888目录页版）
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  在 Toomics 目录页显示下载按钮，自动下载指定范围的章节到ZIP文件
// @match        https://www.toomics.net/sc/webtoon/episode/toon/*
// @grant        GM_xmlhttpRequest
// @connect      toomics.net
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/548370/Toomics%20%E6%BC%AB%E7%94%BB%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%EF%BC%88888%E7%9B%AE%E5%BD%95%E9%A1%B5%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/548370/Toomics%20%E6%BC%AB%E7%94%BB%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%EF%BC%88888%E7%9B%AE%E5%BD%95%E9%A1%B5%E7%89%88%EF%BC%89.meta.js
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

        return chapters;
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
     * 拉取单张图片并返回 Blob
     */
    function fetchAsBlob(url) {
        return new Promise((resolve, reject) => {
            console.log('开始下载图片:', url);

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'arraybuffer',
                headers: {
                    'Referer': 'https://www.toomics.net',
                    'User-Agent': navigator.userAgent,
                    'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
                },
                onload: res => {
                    console.log('图片下载响应:', res.status, '大小:', res.response ? res.response.byteLength : 0);

                    if (res.status === 200) {
                        try {
                            const blob = new Blob([res.response], { type: 'image/jpeg' });
                            console.log('图片下载成功，大小:', blob.size, 'bytes');

                            // 检查图片大小，如果太小可能是空白图片
                            if (blob.size < 1000) {
                                console.warn('图片文件过小，可能是空白图片:', blob.size, 'bytes');
                            }

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
                    reject(err)
                }
            });
        });
    }

    /**
     * 下载单个章节
     */
    async function downloadChapter(chapterInfo) {
        try {
            console.log(`开始下载章节 ${chapterInfo.chapterNum}: ${chapterInfo.detailUrl}`);

            // 访问章节详情页
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: chapterInfo.detailUrl,
                    responseType: 'text',
                    headers: {
                        'Referer': 'https://www.toomics.net',
                        'User-Agent': navigator.userAgent
                    },
                    onload: res => {
                        console.log(`章节 ${chapterInfo.chapterNum} 页面响应状态:`, res.status);
                        resolve(res);
                    },
                    onerror: err => {
                        console.error(`章节 ${chapterInfo.chapterNum} 页面请求失败:`, err);
                        reject(err);
                    }
                });
            });

            if (response.status !== 200) {
                throw new Error(`访问章节页面失败: HTTP ${response.status}`);
            }

            console.log(`章节 ${chapterInfo.chapterNum} 页面获取成功，长度:`, response.responseText.length);

            // 创建临时 DOM 来解析页面内容
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, 'text/html');

                         // 获取所有图片元素
             const imgNodes = doc.querySelectorAll('#viewer-img img');
             console.log(`章节 ${chapterInfo.chapterNum} 找到 ${imgNodes.length} 张图片`);

             if (!imgNodes.length) {
                 console.warn(`章节 ${chapterInfo.chapterNum} 未找到图片`);
                 return null;
             }

             // 将 NodeList 转换为真正的数组
             const imgArray = Array.from(imgNodes);

             // 获取页面信息
             const titleElement = doc.querySelector('.viewer-title a');
             let mangaName = 'Unknown';
             let chapterName = `第${chapterInfo.chapterNum}话`;

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

             // 下载图片 - 使用并发下载，每次同时下载5张图片
             const blobs = [];
             const concurrency = 10; // 图片并发数

             // 将图片分批处理，每批最多5张
             for (let i = 0; i < imgArray.length; i += concurrency) {
                 const batch = imgArray.slice(i, i + concurrency);
                console.log(`章节 ${chapterInfo.chapterNum} 开始下载图片批次 ${Math.floor(i/concurrency) + 1}，包含 ${batch.length} 张图片`);

                // 并发下载当前批次的图片
                const batchPromises = batch.map(async (imgElement, batchIndex) => {
                    const globalIndex = i + batchIndex;

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
                        console.log(`跳过占位图片 ${globalIndex + 1}: ${imgURL}`);
                        return null;
                    }

                                         try {
                         console.log(`下载图片 ${globalIndex + 1}/${imgArray.length}: ${imgURL}`);

                         // 添加延迟，模拟真实浏览器的图片加载
                         await sleep(1000);

                         const blob = await fetchAsBlob(imgURL);

                         // 验证图片是否有效（检查文件大小）
                         if (blob && blob.size > 5000) { // 大于5KB才认为是有效图片
                             const ext = imgURL.includes('.png') ? 'png' : 'jpg';
                             const fileName = `${cleanName(mangaName)}_${cleanName(chapterName)}_p${String(globalIndex + 1).padStart(3, '0')}.${ext}`;

                             console.log(`章节 ${chapterInfo.chapterNum} 第 ${globalIndex + 1} 张下载完成，大小: ${blob.size} bytes`);
                             return { name: fileName, blob: blob, index: globalIndex };
                         } else {
                             console.warn(`图片 ${globalIndex + 1} 无效，大小: ${blob ? blob.size : 0} bytes`);
                             return null;
                         }
                     } catch (e) {
                         console.error(`章节 ${chapterInfo.chapterNum} 第 ${globalIndex + 1} 张下载失败:`, e);
                         return null;
                     }
                 });

                 // 等待当前批次的所有图片下载完成
                 const batchResults = await Promise.all(batchPromises);

                 // 过滤掉失败的图片，按原始顺序添加到blobs数组
                 batchResults.forEach(result => {
                     if (result) {
                         blobs.push(result);
                     }
                 });

                 // 批次间延迟，避免请求过于频繁
                 if (i + concurrency < imgArray.length) {
                     console.log(`章节 ${chapterInfo.chapterNum} 图片批次 ${Math.floor(i/concurrency) + 1} 完成，准备下一批次...`);
                     await sleep(500);
                 }
            }

            console.log(`章节 ${chapterInfo.chapterNum} 下载完成，共 ${blobs.length} 张有效图片`);

            return {
                chapterNum: chapterInfo.chapterNum,
                title: chapterInfo.title,
                blobs: blobs
            };

        } catch (error) {
            console.error(`下载章节 ${chapterInfo.chapterNum} 失败:`, error);
            return null;
        }
    }

    /**
     * 批量下载指定范围的章节
     */
    async function downloadChaptersInRange() {
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

        // 更新按钮状态
        const btn = document.getElementById('download-all-btn');
        btn.disabled = true;
        btn.innerText = `开始下载 ${targetChapters.length} 个章节...`;

        // 创建进度显示
        const progressDiv = document.createElement('div');
        progressDiv.style.cssText = `
            position: fixed; top: 180px; right: 20px; width: 320px;
            background: rgba(0,0,0,0.9); color: white; padding: 15px;
            border-radius: 8px; z-index: 9999; font-size: 12px; max-height: 400px; overflow-y: auto;
        `;
        document.body.appendChild(progressDiv);

        const allBlobs = [];
        let successCount = 0;
        let failCount = 0;

        // 顺序下载控制函数
        async function downloadChaptersSequentially(chapters) {
            const results = [];

            // 逐个下载章节，一个完成后才开始下一个
            for (let i = 0; i < chapters.length; i++) {
                const chapter = chapters[i];

                // 更新进度
                progressDiv.innerHTML = `
                    <div style="margin-bottom: 10px; font-weight: bold;">顺序下载进度</div>
                    <div>当前进度: ${i + 1}/${chapters.length}</div>
                    <div>正在下载: 第${chapter.chapterNum}话</div>
                    <div>成功: ${successCount} | 失败: ${failCount}</div>
                    <div style="margin-top: 10px; font-size: 11px; color: #ccc;">
                        下载范围: ${startChapter}-${endChapter || '全部'}<br>
                        下载模式: 顺序下载<br>
                        ${chapters.slice(0, i + 1).map(c =>
                            `第${c.chapterNum}话: ${c.title} - ${c.isOwn ? '已拥有' : '未拥有'}`
                        ).join('<br>')}
                    </div>
                `;

                try {
                    console.log(`开始下载章节 ${chapter.chapterNum}: ${chapter.title}`);
                    const result = await downloadChapter(chapter);

                    if (result && result.blobs.length > 0) {
                        // 每个章节下载完成后立即生成ZIP文件
                        await generateChapterZip(result, chapter);
                        successCount++;
                        console.log(`章节 ${chapter.chapterNum} 下载完成并打包，共 ${result.blobs.length} 张图片`);
                        results.push({ success: true, chapter, result });
                    } else {
                        failCount++;
                        console.warn(`章节 ${chapter.chapterNum} 未获取到有效图片`);
                        results.push({ success: false, chapter, error: '未获取到有效图片' });
                    }
                } catch (error) {
                    failCount++;
                    console.error(`章节 ${chapter.chapterNum} 下载失败:`, error);
                    results.push({ success: false, chapter, error: error.message });
                }

                // 章节间延迟，避免请求过于频繁
                if (i < chapters.length - 1) {
                    progressDiv.innerHTML += '<div style="margin-top: 10px; color: #FFA500;">第${chapter.chapterNum}话完成，准备下载下一话...</div>';
                    await sleep(2000);
                }
            }

            return results;
        }

        // 生成单个章节ZIP文件的函数
        async function generateChapterZip(chapterResult, chapterInfo) {
            try {
                // 动态提取页面中的漫画名称
                let mangaName = '未知漫画';
                const h2Element = document.querySelector('h2.mt-3.line-clamp-2.break-normal.text-\\[37px\\]\\/\\[50px\\].font-bold.text-white');
                if (h2Element) {
                    mangaName = h2Element.textContent.trim();
                    console.log('提取到漫画名称:', mangaName);
                } else {
                    // 备用方案：尝试其他选择器
                    const titleElement = document.querySelector('.viewer-title a');
                    if (titleElement) {
                        const fullText = titleElement.textContent.trim();
                        const emElement = titleElement.querySelector('em');
                        if (emElement) {
                            const chapterName = emElement.textContent.trim();
                            mangaName = fullText.replace(chapterName, '').trim();
                        } else {
                            mangaName = fullText;
                        }
                    }
                    console.log('使用备用方案提取漫画名称:', mangaName);
                }

                // 清理文件名中的非法字符
                const cleanName = (name) => {
                    return name.replace(/[<>:"/\\|?*]/g, '_').replace(/\s+/g, '_').trim();
                };

                // 生成ZIP文件名
                const zipFileName = `${cleanName(mangaName)}_第${chapterInfo.chapterNum}话.zip`;

                // 创建ZIP文件
                const JSZip = window.JSZip;
                const zip = new JSZip();

                chapterResult.blobs.forEach(item => {
                    zip.file(item.name, item.blob);
                });

                const zipBlob = await zip.generateAsync({ type: 'blob' });

                // 下载ZIP文件
                const a = document.createElement('a');
                a.href = URL.createObjectURL(zipBlob);
                a.download = zipFileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                // 更新进度显示
                progressDiv.innerHTML += `<div style="margin-top: 10px; color: #4CAF50;">第${chapterInfo.chapterNum}话ZIP文件已生成: ${zipFileName}</div>`;

                console.log(`章节 ${chapterInfo.chapterNum} ZIP文件生成成功: ${zipFileName}`);

            } catch (error) {
                console.error(`生成章节 ${chapterInfo.chapterNum} ZIP文件失败:`, error);
                progressDiv.innerHTML += `<div style="margin-top: 10px; color: #e74c3c;">第${chapterInfo.chapterNum}话ZIP文件生成失败</div>`;
            }
        }

        // 使用顺序下载
        const downloadResults = await downloadChaptersSequentially(targetChapters);

        // 显示最终结果
        progressDiv.innerHTML += `<div style="margin-top: 15px; color: #4CAF50;">所有章节下载完成！成功: ${successCount} | 失败: ${failCount}</div>`;

        btn.innerText = '开始下载';
        btn.disabled = false;

        // 10秒后隐藏进度信息
        setTimeout(() => {
            if (document.body.contains(progressDiv)) {
                document.body.removeChild(progressDiv);
            }
        }, 10000);
    }

    /** 创建下载控制面板 **/
    const controlPanel = document.createElement('div');
    controlPanel.style.cssText = `
        position: fixed; top: 80px; right: 20px; width: 280px;
        background: rgba(0,0,0,0.9); color: white; padding: 15px;
        border-radius: 8px; z-index: 9999; font-size: 12px;
    `;

    controlPanel.innerHTML = `
        <div style="margin-bottom: 15px; font-weight: bold; text-align: center;">批量下载控制</div>

        <div style="margin-bottom: 10px;">
            <label style="display: block; margin-bottom: 5px;">开始章节:</label>
            <input type="number" id="start-chapter" placeholder="留空从第1话开始"
                   style="width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 4px; color: #000;">
        </div>

        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px;">结束章节:</label>
            <input type="number" id="end-chapter" placeholder="留空下载到最后一话"
                   style="width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 4px; color: #000;">
        </div>

        <button id="download-all-btn" style="
            width: 100%; padding: 10px; background: #e74c3c; color: white;
            border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: bold;
        ">开始下载</button>

        <div style="margin-top: 10px; font-size: 11px; color: #ccc; line-height: 1.3;">
            使用说明:<br>
            • 留空开始章节 = 从第1话开始<br>
            • 留空结束章节 = 下载到最后一话<br>
            • 例如: 开始2, 结束5 = 下载第2-5话<br>
            • 只下载已拥有的章节
        </div>
    `;

    document.body.appendChild(controlPanel);

    // 添加点击事件
    document.getElementById('download-all-btn').addEventListener('click', downloadChaptersInRange);

    console.log('Toomics 批量下载器已加载');

})();