// ==UserScript==
// @name         百合会图片提取
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  从楼主贴子中提取图片，并且支持以ZIP或EPUB格式下载
// @author       Nonbeing
// @license      MIT
// @match        https://bbs.yamibo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yamibo.com
// @grant        GM.xmlHttpRequest
// @grant        GM.download
// @connect      https://bbs.yamibo.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/uuid/8.3.2/uuid.min.js
// @downloadURL https://update.greasyfork.org/scripts/554037/%E7%99%BE%E5%90%88%E4%BC%9A%E5%9B%BE%E7%89%87%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/554037/%E7%99%BE%E5%90%88%E4%BC%9A%E5%9B%BE%E7%89%87%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

/*global JSZip*/
/*global saveAs*/
/*global uuid*/

(function () {
    'use strict';

    // 检查依赖
    if (typeof JSZip === 'undefined' || typeof saveAs === 'undefined' || typeof uuid === 'undefined') {
        console.error('Tampermonkey Error: JSZip or FileSaver or uuid failed to load.');
        return;
    }

    // 避免重复下载
    let cachedImagesData = null;

    /**
     * 获取img元素中的真实url
     * @description url样例：https://bbs.yamibo.com/data/attachment/forum/xxx/xxxx.jpg
     * @param {object} img 传入images元素对象
     * @returns {string|null} 返回url
    */
    function getImageUrl(img) {
        let imageUrl = '';
        // yamibo帖子图片采用懒加载，原始图片地址存在'zoomfile'和'file'属性里
        imageUrl = img.getAttribute('zoomfile');
        if (!imageUrl) {
            imageUrl = img.getAttribute('file');
        }
        // 防止图片加载后，只有src中有图片地址（目前不会起作用）
        if (!imageUrl || imageUrl.endsWith('none.gif')) {
            imageUrl = img.src;
        }
        // 'zoomfile'和'file'中的地址是相对路径，需要加上yamibo当前位置的域名头
        // https://bbs.yamibo.com/ + data/attachment/forum/xxx/xxxx.jpg
        if (imageUrl && !imageUrl.endsWith('none.gif')) {
            let absoluteUrl = new URL(imageUrl, window.location.href).href;
            return absoluteUrl;
        }
        return null;
    }

    /**
     * 从post div元素中获取所有的图片地址
     * @param {object} post 传入post元素对象
     * @returns {string[]} 返回所有图片地址
     */
    function getImageUrls(post) {
        if (!post) {
            console.warn('post is undefined.');
            return [];
        }
        // img元素包含在<ignore_js_op>标签里
        let images = post.querySelectorAll('ignore_js_op > img');
        let urls = [];
        images.forEach(img => {
            let url = getImageUrl(img);
            if (url && !urls.includes(url)) {
                urls.push(url);
            }
        });
        return urls;
    }

    /**
     * 通过图片地址批量下载图片文件
     * @param {string[]} urls 图片地址数组
     * @param {object} downloadProgressSpan 下载进度条元素
     * @returns {object[]} 返回下载的图片文件数组
     */
    async function downloadImages(urls, downloadProgressSpan) {
        let downloadCount = 0;
        let totalCount = urls.length;
        let downloadedImageFiles = []; // 存储下载文件{ epubFilename, zipFilename, data, ext }
        if (totalCount === 0) {
            downloadProgressSpan.textContent = '没有图片可下载';
            return [];
        }
        // 遍历地址，批量下载文件
        const downloadPromises = urls.map((url, index) => {
            return new Promise(resolve => {
                let ext = 'jpg';
                // 获取图片的扩展名
                let urlParts = url.split('.');
                if (urlParts.length > 1) {
                    let potentialExt = urlParts[urlParts.length - 1].split('?')[0]; // 处理URL参数
                    if (potentialExt.length <= 5 && /^[a-zA-Z0-9]+$/.test(potentialExt)) {
                        ext = potentialExt;
                    }
                }
                const filename = `${index + 1}.${ext}`; // 1.jpg, 2.png
                // 让TM通过发送请求获取图片文件
                GM.xmlHttpRequest({
                    method: "GET",
                    url: url,
                    responseType: "arraybuffer",
                    headers: {
                        "Referer": window.location.href,
                        "User-Agent": navigator.userAgent
                    },
                    withCredentials: true,
                    onload: function (response) {
                        downloadCount++;
                        downloadProgressSpan.textContent = `(${downloadCount}/${totalCount}) 下载中...`;
                        if (response.status === 200) {
                            downloadedImageFiles.push({
                                epubFilename: `images/${filename}`, // EPUB内部的路径名，OEBPS/images/1.jpg
                                zipFilename: filename, // ZIP内的文件名
                                data: response.response,
                                ext: ext
                            });
                            resolve({ status: 'fulfilled', filename: filename });
                        } else {
                            console.error(`Failed to download ${url}: Status ${response.status} (attempted with custom headers/cookies)`);
                            resolve({ status: 'rejected', url: url, error: `Status ${response.status}` });
                        }
                    },
                    onerror: function (error) {
                        downloadCount++;
                        downloadProgressSpan.textContent = `(${downloadCount}/${totalCount}) 下载中...`;
                        console.error(`Error downloading ${url}:`, error);
                        resolve({ status: 'rejected', url: url, error: error });
                    },
                    onabort: function () {
                        downloadCount++;
                        downloadProgressSpan.textContent = `(${downloadCount}/${totalCount}) 下载中...`;
                        console.warn(`Download aborted for ${url}`);
                        resolve({ status: 'rejected', url: url, error: 'Aborted' });
                    }
                });
            });
        });
        await Promise.allSettled(downloadPromises); //保证图片下载完毕
        return downloadedImageFiles;
    }


    /**
     * 打包为epub格式、
     * @param {string} title 贴子标题
     * @param {object[]} downloadedImageFiles 已下载的图片
     * @returns {object} epub数据文件
     */
    function generateEpubContent(title, downloadedImageFiles) {
        const epubZip = new JSZip();
        const bookId = `urn:uuid:${generateUUID()}`;
        const now = new Date().toISOString().split('.')[0] + 'Z'; // ISO 8601
        // 1. mimetype
        epubZip.file("mimetype", "application/epub+zip", { compression: "STORE" });
        // 2. META-INF/container.xml
        epubZip.folder("META-INF").file("container.xml", `<?xml version="1.0"?>
            <container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
              <rootfiles>
                <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
              </rootfiles>
            </container>`);
        const OEBPS = epubZip.folder("OEBPS");
        OEBPS.folder("images"); // images文件夹存放下载的图片
        OEBPS.folder("html");
        OEBPS.folder("css");
        let manifestItems = [];
        let spineItems = [];
        let navigationPoints = []; // toc.ncx导航点
        // 发帖人为作者
        const author = document.querySelector('.xw1')?.textContent.trim() || 'Unknown Author';
        // 将下载的图片组装为epub的metadata
        downloadedImageFiles.forEach((imgFile, index) => {
            const imgId = `img-${index + 1}`;
            const pageId = `page-${index + 1}`;
            const imageFilename = imgFile.epubFilename; // OEBPS/images/1.jpg
            const imageData = imgFile.data;
            const mediaType = `image/${imgFile.ext === 'jpg' ? 'jpeg' : imgFile.ext}`;
            OEBPS.file(imageFilename, imageData, { binary: true });
            manifestItems.push(`<item id="${imgId}" href="${imageFilename}" media-type="${mediaType}"/>`);
            const xhtmlPathInEpub = `html/${pageId}.xhtml`; // OEBPS/html/page-1.xhtml
            const xhtmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="zh-CN">
<head>
  <title>${title} - Page ${index + 1}</title>
  <meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8" />
  <link href="../css/style.css" rel="stylesheet" type="text/css" />
</head>
<body>
  <div class="image-container">
    <img src="../${imageFilename}" alt="Page ${index + 1}" />
  </div>
</body>
</html>`;
            OEBPS.file(xhtmlPathInEpub, xhtmlContent);
            manifestItems.push(`<item id="${pageId}" href="${xhtmlPathInEpub}" media-type="application/xhtml+xml"/>`);
            spineItems.push(`<itemref idref="${pageId}"/>`);
            navigationPoints.push(`<navPoint id="navpoint-${index + 1}" playOrder="${index + 1}">
            <navLabel><text>Page ${index + 1}</text></navLabel>
            <content src="${xhtmlPathInEpub}"/>
        </navPoint>`);
        });
        // 3. content.opf
        const contentOpf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookId" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:title>${title}</dc:title>
    <dc:creator opf:file-as="${author}" opf:role="aut">${author}</dc:creator>
    <dc:date>${now}</dc:date>
    <dc:identifier id="BookId" opf:scheme="uuid">${bookId}</dc:identifier>
    <dc:language>zh-CN</dc:language>
    <meta name="cover" content="cover-image"/> <!-- If you want a cover, you'll need to define it in manifest-->
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    ${manifestItems.join('\n    ')}
    <item id="css" href="css/style.css" media-type="text/css"/>
  </manifest>
  <spine toc="ncx">
    ${spineItems.join('\n    ')}
  </spine>
  <guide>
    <reference type="text" title="${title}" href="${downloadedImageFiles.length > 0 ? `html/page-1.xhtml` : ''}"/>
  </guide>
</package>`;
        OEBPS.file("content.opf", contentOpf);
        // 4. toc.ncx
        const tocNcx = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1" xml:lang="zh-CN">
  <head>
    <meta name="dtb:uid" content="${bookId}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle><text>${title}</text></docTitle>
  <docAuthor><text>${author}</text></docAuthor>
  <navMap>
    ${navigationPoints.join('\n    ')}
  </navMap>
</ncx>`;
        OEBPS.file("toc.ncx", tocNcx);
        // 5. style.css
        const cssContent = `body { margin: 0; padding: 0; background-color: #f5f5f5; }
.image-container { text-align: center; }
img { max-width: 100%; height: auto; display: block; margin: 0 auto; }`;
        OEBPS.file("css/style.css", cssContent);
        return epubZip;
    }

    /**
     * 生成UUID
     * @returns {string} UUID字符串
     */
    function generateUUID() {
        // return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        //     var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        //     return v.toString(16);
        // });
        let id = uuid.v4();
        return id;
    }

    /**
     * 显示获取到的图片地址以及其它结果
     * @param {string[]} urls 图片地址列表
     * @param {string} title 贴子标题
     */
    async function displayResult(urls, title) {
        // 清除原有的结果展示
        let resultDiv = document.getElementById('tm_result_display');
        if (resultDiv) {
            resultDiv.remove();
        }
        // 无结果
        if (urls.length === 0) {
            console.log('No images found in the first post.');
            resultDiv = document.createElement('div');
            resultDiv.id = 'tm_result_display';
            resultDiv.style.cssText = 'position: fixed; top: 10px; right: 10px; background: rgba(255,100,100,0.8); color: white; padding: 10px; z-index: 10000; max-height: 90vh; overflow-y: auto; border-radius: 5px;';
            resultDiv.innerHTML = '<h3>未找到图片</h3>';
            document.body.appendChild(resultDiv);
            setTimeout(() => resultDiv.remove(), 3000);
            return;
        }

        console.log('Found images in the first post:');
        urls.forEach((url, index) => {
            console.log(`Image ${index + 1}: ${url}`)
        })

        resultDiv = document.createElement('div');
        resultDiv.id = 'tm_result_display';
        resultDiv.style.cssText = 'position: fixed; top: 10px; right: 10px; background: rgba(0,0,0,0.8); color: white; padding: 10px; z-index: 10000; max-height: 90vh; overflow-y: auto; border-radius: 5px; width: 300px;';
        resultDiv.innerHTML = `
            <h3>提取到的图片URL:</h3>
            <button id="tm_close_image_urls_btn" style="float:right; background:none; border:none; color:white; font-size:16px; cursor:pointer;">&times;</button>
            <button id="tm_download_zip_btn" style="float:left; margin-bottom: 5px; padding: 5px 10px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">下载所有图片(ZIP)</button>
            <button id="tm_download_epub_btn" style="float:left; margin-left: 10px; margin-bottom: 5px; padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">下载为EPUB</button>
            <span id="tm_download_progress" style="float:left; margin-left: 10px; margin-top: 7px; color: yellow;"></span>
            <div style="clear:both;"></div>
        `;
        // 列表展示
        let ul = document.createElement('ul');
        ul.style.cssText = 'list-style: decimal; padding-left: 20px; margin-top: 10px;';
        urls.forEach(url => {
            let li = document.createElement('li');
            li.style.marginBottom = '5px';
            let a = document.createElement('a');
            a.href = url;
            a.target = '_blank';
            a.textContent = url.substring(url.lastIndexOf('/') + 1) || url;
            a.title = url;
            a.style.cssText = 'color: #87CEEB; text-decoration: none; word-break: break-all;';
            li.appendChild(a);
            ul.appendChild(li);
        });
        resultDiv.appendChild(ul);
        document.body.appendChild(resultDiv);
        // 缓存会在关闭结果展示后清除
        document.getElementById('tm_close_image_urls_btn').addEventListener('click', () => {
            resultDiv.remove();
            cachedImagesData = null;
        });

        let downloadZipButton = document.getElementById('tm_download_zip_btn');
        let downloadEpubButton = document.getElementById('tm_download_epub_btn');
        let downloadProgressSpan = document.getElementById('tm_download_progress');

        const commonDownloadLogic = async (format) => {
            downloadZipButton.disabled = true;
            downloadEpubButton.disabled = true;
            downloadZipButton.textContent = '正在下载...';
            downloadEpubButton.textContent = '正在下载...';
            downloadProgressSpan.textContent = '';

            if (urls.length === 0) {
                downloadProgressSpan.textContent = '没有图片可下载';
                downloadZipButton.disabled = false;
                downloadEpubButton.disabled = false;
                downloadZipButton.textContent = '下载所有图片(ZIP)';
                downloadEpubButton.textContent = '下载为EPUB';
                return;
            }

            // 下载图片文件
            let downloadedImageFiles;
            if (cachedImagesData) {
                downloadProgressSpan.textContent = '使用缓存图片数据...';
                downloadedImageFiles = cachedImagesData;
            } else {
                downloadProgressSpan.textContent = `开始下载 ${urls.length} 张图片...`;
                downloadedImageFiles = await downloadImages(urls, downloadProgressSpan);
                cachedImagesData = downloadedImageFiles;
            }

            if (downloadedImageFiles.length === 0) {
                downloadProgressSpan.textContent = '图片下载失败或为空。';
                downloadZipButton.disabled = false;
                downloadEpubButton.disabled = false;
                downloadZipButton.textContent = '下载所有图片(ZIP)';
                downloadEpubButton.textContent = '下载为EPUB';
                return;
            }

            // 打包成指定格式
            try {
                if (format === 'zip') {
                    downloadProgressSpan.textContent = `生成ZIP中...`;
                    let zip = new JSZip();
                    downloadedImageFiles.forEach(file => {
                        zip.file(file.zipFilename, file.data, { binary: true });
                    });
                    let content = await zip.generateAsync({ type: "blob" }, function updateCallback(metadata) {
                        downloadProgressSpan.textContent = `生成ZIP中: ${metadata.percent.toFixed(2)}%`;
                    });
                    saveAs(content, `${title}.zip`);
                    downloadProgressSpan.textContent = `ZIP下载完成`;
                } else if (format === 'epub') {
                    downloadProgressSpan.textContent = `生成EPUB中...`;
                    const epubZip = generateEpubContent(title, downloadedImageFiles);
                    const content = await epubZip.generateAsync({
                        type: "blob",
                        mimeType: "application/epub+zip",
                        compression: "DEFLATE",
                        compressionOptions: {
                            level: 9
                        }
                    }, function updateCallback(metadata) {
                        downloadProgressSpan.textContent = `生成EPUB中: ${metadata.percent.toFixed(2)}%`;
                    });
                    saveAs(content, `${title}.epub`);
                    downloadProgressSpan.textContent = `EPUB下载完成`;
                }
            } catch (error) {
                console.error(`Error generating or saving ${format.toUpperCase()}:`, error);
                downloadProgressSpan.textContent = `${format.toUpperCase()}生成失败: ${error.message}`;
            } finally {
                downloadZipButton.disabled = false;
                downloadEpubButton.disabled = false;
                downloadZipButton.textContent = '下载所有图片(ZIP)';
                downloadEpubButton.textContent = '下载为EPUB';
            }
        };

        downloadZipButton.addEventListener('click', () => commonDownloadLogic('zip'));
        downloadEpubButton.addEventListener('click', () => commonDownloadLogic('epub'));
    }

    /**
     * 获取贴子的标题
     * @returns {string|null} 返回标题字符串
     */
    function getPostTitle() {
        // 定位标题所在的thread元素
        let thread = document.getElementById('thread_subject');
        if (!thread) {
            console.warn('Get post title failed.');
            return null;
        }
        // 获取标题并处理特殊字符
        let title = thread.textContent.replace(/[\/\\:*?"<>|]/g, '_').trim()
        // 限制标题长度
        if (title.length > 50) {
            title = title.substring(0, 50);
        }
        return title
    }

    // 脚本向页面注入自己的交互
    window.addEventListener('load', () => {
        let postList = document.getElementById('postlist');
        if (!postList) {
            console.warn('Post list container not found.');
            return;
        }
        // 定位标题元素Header
        let postHeader = postList.querySelector('td.plc.ptm.pbn.vwthd');
        if (postHeader) {
            // 把按钮加入标题尾部或者头部
            let getImagesButton = document.createElement('button');
            getImagesButton.textContent = '获取帖子图片';
            getImagesButton.id = 'tm_get_post_images_btn';
            getImagesButton.style.cssText = `
                margin-left: 10px;
                padding: 5px 10px;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                float: right;
            `;
            getImagesButton.onmouseover = function () { this.style.backgroundColor = '#0056b3'; };
            getImagesButton.onmouseout = function () { this.style.backgroundColor = '#007bff'; };
            let h1 = postHeader.querySelector('h1.ts');
            if (h1) {
                h1.insertAdjacentElement('afterend', getImagesButton);
            } else {
                postHeader.prepend(getImagesButton);
            }
            getImagesButton.addEventListener('click', async () => {
                let firstPost = postList.querySelector('div[id^="post_"]');
                let urls = getImageUrls(firstPost);
                let title = getPostTitle();
                await displayResult(urls, title);
            });
        } else {
            console.warn('Post header not found.');
        }
    })

})();
