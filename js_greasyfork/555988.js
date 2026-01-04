// ==UserScript==
// @name         Tan8曲谱下载器修改版
// @namespace    https://github.com/GZH2K19/tan8-downloader
// @version      1.0.22
// @description  下载www.tan8.com网页端曲谱图片 (支持所有乐器类型，支持免费PNG/PDF/mp3导出)
// @author       RepEater + Linlelest修改
// @license      MIT
// @match        *://www.tan8.com/yuepu*
// @match        *://www.tan8.com/jitapu-*.html
// @match        *://www.tan8.com/violin-*.html
// @match        *://www.tan8.com/keyboard-*.html
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555988/Tan8%E6%9B%B2%E8%B0%B1%E4%B8%8B%E8%BD%BD%E5%99%A8%E4%BF%AE%E6%94%B9%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/555988/Tan8%E6%9B%B2%E8%B0%B1%E4%B8%8B%E8%BD%BD%E5%99%A8%E4%BF%AE%E6%94%B9%E7%89%88.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // --- 配置和状态 ---
    let config = {
        exportFormat: 'png', // 默认导出格式
        jitapuDownloadMode: 'pack', // 默认 Jitapu 下载模式: 'pack' (打包) 或 'single' (单种乐器)
        language: 'zh-CN' // 默认语言
    };

    try {
        const savedConfig = localStorage.getItem('tan8DownloaderConfig');
        if (savedConfig) {
            const parsed = JSON.parse(savedConfig);
            if (parsed && typeof parsed.exportFormat === 'string') {
                config.exportFormat = parsed.exportFormat;
            }
            if (parsed && typeof parsed.jitapuDownloadMode === 'string') {
                config.jitapuDownloadMode = parsed.jitapuDownloadMode;
            }
            if (parsed && typeof parsed.language === 'string') {
                config.language = parsed.language;
            }
        }
    } catch (e) {
        console.warn("[Tan8 Downloader] 读取配置失败:", e);
    }

    // --- 多语言翻译 ---
    const i18n = {
        'zh-CN': {
            title: '弹琴吧下载器设置',
            formatLabel: '导出格式:',
            pdf: 'PDF (合并为文件)',
            png: 'PNG (单张图片)',
            jitapuModeLabel: 'Jitapu 页面下载模式:',
            pack: '打包下载所有乐器',
            single: '单独下载一种乐器',
            save: '保存',
            close: '关闭',
            settings: '设置',
            downloadAudio: '下载音频',
            downloadSheet: '下载谱子',
            downloadJian: '下载简谱',
            info: '信息',
            success: '成功',
            error: '错误',
            waiting: '请稍候...',
            noImages: '未找到任何符合要求的核心曲谱图片。',
            foundImages: '找到 {count} 张图片，将处理全部图片...',
            downloaded: '图片下载完成，共 {total} 张，成功 {success} 张，失败 {failed} 张。',
            downloading: '正在下载 {count} 张图片...',
            processing: '正在处理数据...',
            scanning: '正在扫描页面...',
            usingArray: '使用 yuepuArrXian 数组...',
            usingHtml: '使用 HTML 扫描...',
            downloadPdf: '正在将图片合并为PDF，请稍候...',
            downloadSuccess: '成功下载预览音频~',
            downloadSuccessSheets: '谱子下载成功！',
            downloadSuccessPdf: 'PDF 文件已下载！',
            downloadError: '下载出现错误QAQ: {error}',
            downloadFailed: '下载失败QAQ: {error}',
            downloadAudioFailed: '未找到音频源',
            downloadAudioElementNotFound: '未找到音频元素',
            titleDetected: '检测到标题: {title}',
            version: 'v1.0.22-final-fix-vln'
        },
        'en-US': {
            title: 'Tan8 Downloader Settings',
            formatLabel: 'Export Format:',
            pdf: 'PDF (Merge into file)',
            png: 'PNG (Individual images)',
            jitapuModeLabel: 'Jitapu Page Download Mode:',
            pack: 'Download All Instruments (Pack)',
            single: 'Download One Instrument (Single)',
            save: 'Save',
            close: 'Close',
            settings: 'Settings',
            downloadAudio: 'Download Audio',
            downloadSheet: 'Download Sheet',
            downloadJian: 'Download Jianpu',
            info: 'Info',
            success: 'Success',
            error: 'Error',
            waiting: 'Please wait...',
            noImages: 'No core sheet images found.',
            foundImages: 'Found {count} images, will process all images...',
            downloaded: 'Image download complete. Total: {total}, Success: {success}, Failed: {failed}.',
            downloading: 'Downloading {count} images...',
            processing: 'Processing data...',
            scanning: 'Scanning page...',
            usingArray: 'Using yuepuArrXian array...',
            usingHtml: 'Using HTML scan...',
            downloadPdf: 'Merging images into PDF, please wait...',
            downloadSuccess: 'Preview audio downloaded successfully~',
            downloadSuccessSheets: 'Sheet download successful!',
            downloadSuccessPdf: 'PDF file downloaded!',
            downloadError: 'Download error QAQ: {error}',
            downloadFailed: 'Download failed QAQ: {error}',
            downloadAudioFailed: 'Audio source not found',
            downloadAudioElementNotFound: 'Audio element not found',
            titleDetected: 'Detected title: {title}',
            version: 'v1.0.22-final-fix-vln'
        }
    };

    function t(key, params = {}) {
        const lang = config.language;
        const text = i18n[lang][key] || i18n['zh-CN'][key]; // 回退到中文
        return Object.keys(params).reduce((str, key) => str.replace(`{${key}}`, params[key]), text);
    }

    var msgDiv = document.createElement("div");
    msgDiv.id = "msgDiv";
    msgDiv.style.position = "fixed";
    msgDiv.style.top = "50%";
    msgDiv.style.left = "50%";
    msgDiv.style.transform = "translate(-50%, -50%)";
    msgDiv.style.padding = "30px";
    msgDiv.style.fontSize = "20px";
    msgDiv.style.borderRadius = "5px";
    msgDiv.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    msgDiv.style.border = "2px solid #666";
    msgDiv.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
    msgDiv.style.zIndex = "10000";
    msgDiv.style.display = "none";
    document.body.appendChild(msgDiv);

    function info(msg) {
        console.log("[Tan8 Downloader Info]", msg);
        msgDiv.innerHTML = msg;
        msgDiv.style.display = "block";
        setTimeout(() => {
            msgDiv.style.display = "none";
        }, 5000);
    }

    function createButton(text, bottom, color, onClick) {
        var button = document.createElement("button");
        button.innerHTML = text;
        button.style.position = "fixed";
        button.style.bottom = bottom;
        button.style.left = "20px";
        button.style.zIndex = "1000";
        button.style.padding = "10px 20px";
        button.style.backgroundColor = color;
        button.style.color = "#fff";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        button.onclick = onClick;
        return button;
    }

    // --- 设置界面 ---
    function createSettingsPanel() {
        const panel = document.createElement("div");
        panel.id = "tan8SettingsPanel";
        // 居中显示
        panel.style.position = "fixed";
        panel.style.top = "50%";
        panel.style.left = "50%";
        panel.style.transform = "translate(-50%, -50%)";
        panel.style.width = "400px";
        panel.style.padding = "20px";
        panel.style.backgroundColor = "#fff";
        panel.style.border = "1px solid #ccc";
        panel.style.borderRadius = "8px";
        panel.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
        panel.style.zIndex = "10001";
        panel.style.display = "none";
        panel.style.maxHeight = "80vh"; // 最大高度
        panel.style.overflowY = "auto"; // 滚动条

        const title = document.createElement("h3");
        title.textContent = t('title');
        title.style.marginTop = "0";
        title.style.textAlign = "center";

        // 导出格式
        const formatSection = document.createElement("div");
        formatSection.style.marginBottom = "20px";
        const formatLabel = document.createElement("label");
        formatLabel.textContent = t('formatLabel');
        const formatSelect = document.createElement("select");
        formatSelect.id = "exportFormatSelect";
        formatSelect.innerHTML = `
            <option value="png" ${config.exportFormat === 'png' ? 'selected' : ''}>${t('png')}</option>
            <option value="pdf" ${config.exportFormat === 'pdf' ? 'selected' : ''}>${t('pdf')}</option>
        `;

        // Jitapu 下载模式 (仅当页面是 jitapu 时显示)
        const jitapuModeSection = document.createElement("div");
        jitapuModeSection.id = "jitapuModeSection";
        jitapuModeSection.style.marginBottom = "20px";
        jitapuModeSection.style.display = "none"; // 默认隐藏
        const jitapuModeLabel = document.createElement("label");
        jitapuModeLabel.textContent = t('jitapuModeLabel');
        const jitapuModeSelect = document.createElement("select");
        jitapuModeSelect.id = "jitapuDownloadModeSelect";
        jitapuModeSelect.innerHTML = `
            <option value="pack" ${config.jitapuDownloadMode === 'pack' ? 'selected' : ''}>${t('pack')}</option>
            <option value="single" ${config.jitapuDownloadMode === 'single' ? 'selected' : ''}>${t('single')}</option>
        `;

        // 语言选择
        const languageSection = document.createElement("div");
        languageSection.style.marginBottom = "20px";
        const languageLabel = document.createElement("label");
        languageLabel.textContent = "Language:";
        const languageSelect = document.createElement("select");
        languageSelect.id = "languageSelect";
        languageSelect.innerHTML = `
            <option value="zh-CN" ${config.language === 'zh-CN' ? 'selected' : ''}>简体中文</option>
            <option value="en-US" ${config.language === 'en-US' ? 'selected' : ''}>English</option>
        `;

        const saveButton = document.createElement("button");
        saveButton.textContent = t('save');
        saveButton.style.marginTop = "10px";
        saveButton.style.padding = "5px 10px";
        saveButton.onclick = function() {
            config.exportFormat = formatSelect.value;
            config.jitapuDownloadMode = jitapuModeSelect.value;
            config.language = languageSelect.value;
            try {
                localStorage.setItem('tan8DownloaderConfig', JSON.stringify(config));
                info(t('success')); // 修复：保存配置时显示“成功”
            } catch (e) {
                console.error("[Tan8 Downloader] 保存配置失败:", e);
                info(t('downloadError', {error: e.message}));
            }
            panel.style.display = "none";
        };

        const closeButton = document.createElement("button");
        closeButton.textContent = t('close');
        closeButton.style.marginTop = "10px";
        closeButton.style.marginLeft = "10px";
        closeButton.style.padding = "5px 10px";
        closeButton.onclick = function() {
            panel.style.display = "none";
        };

        formatSection.appendChild(formatLabel);
        formatSection.appendChild(formatSelect);
        jitapuModeSection.appendChild(jitapuModeLabel);
        jitapuModeSection.appendChild(jitapuModeSelect);
        languageSection.appendChild(languageLabel);
        languageSection.appendChild(languageSelect);

        panel.appendChild(title);
        panel.appendChild(formatSection);
        panel.appendChild(jitapuModeSection);
        panel.appendChild(languageSection);
        panel.appendChild(document.createElement("br"));
        panel.appendChild(saveButton);
        panel.appendChild(closeButton);

        return panel;
    }

    const settingsPanel = createSettingsPanel();
    document.body.appendChild(settingsPanel);

    function toggleSettings() {
        const isHidden = settingsPanel.style.display === "none";
        settingsPanel.style.display = isHidden ? "block" : "none";

        // 根据当前页面类型，动态显示或隐藏 Jitapu 模式选项
        const jitapuModeSection = document.getElementById('jitapuModeSection');
        if (jitapuModeSection) {
            if (window.location.href.includes("jitapu")) {
                jitapuModeSection.style.display = "block";
            } else {
                jitapuModeSection.style.display = "none";
            }
        }
    }

    // --- 图片处理函数 ---

    async function fetchImageBlobs(urls) {
        const blobPromises = urls.map(async (url) => {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to fetch image: ${url}`);
            return await response.blob();
        });
        return Promise.all(blobPromises);
    }

    async function downloadAsPDF(imageBlobs, baseTitle) {
        info(t('downloadPdf'));
        try {
            if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
                document.head.appendChild(script);
                await new Promise((resolve, reject) => {
                    script.onload = resolve;
                    script.onerror = () => reject(new Error('Failed to load jsPDF library'));
                });
            }

            const { jsPDF } = window.jspdf;
            let pdf = null;
            let isFirstPage = true;

            for (let i = 0; i < imageBlobs.length; i++) {
                const imgBlob = imageBlobs[i];
                const img = new Image();
                img.src = URL.createObjectURL(imgBlob);

                await new Promise((resolve) => {
                    img.onload = async () => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        const imgWidth = img.width;
                        const imgHeight = img.height;

                        const pdfWidth = 595 - 20;
                        const pdfHeight = (imgHeight * pdfWidth) / imgWidth;

                        if (isFirstPage) {
                            pdf = new jsPDF('p', 'pt', [pdfWidth + 20, pdfHeight + 20]);
                            isFirstPage = false;
                        } else {
                            pdf.addPage([pdfWidth + 20, pdfHeight + 20], 'p');
                        }

                        pdf.addImage(img, 'PNG', 10, 10, pdfWidth, pdfHeight);
                        URL.revokeObjectURL(img.src);
                        resolve();
                    };
                    img.onerror = () => resolve();
                });
            }

            if (pdf) {
                pdf.save(`${baseTitle}.pdf`);
                info(t('downloadSuccessPdf')); // 修复：PDF 下载成功提示
            } else {
                info(t('noImages'));
            }
        } catch (error) {
            console.error("[Tan8 Downloader] 生成PDF失败:", error);
            info(t('downloadFailed', {error: error.message}));
        }
    }

    async function downloadImage(imgUrl, fileName) {
        console.log("[Tan8 Downloader Debug] Downloading image:", imgUrl);
        try {
            let res = await fetch(imgUrl);
            if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
            let blob = await res.blob();
            var link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return true;
        } catch (error) {
            console.error("[Tan8 Downloader Error] 下载失败:", imgUrl, error);
            return false;
        }
    }

    // 处理收集到的图片URL列表
    async function processImageUrls(urls, baseTitle, typName = '') {
        if (urls.length === 0) {
            info(t('noImages'));
            return;
        }

        if (config.exportFormat === 'pdf') {
            const blobs = await fetchImageBlobs(urls);
            await downloadAsPDF(blobs, baseTitle);
        } else {
            info(t('downloading', {count: urls.length}));
            var downloadedCount = 0;
            var failedCount = 0;
            for (let i = 0; i < urls.length; i++) {
                const url = urls[i];
                const fileName = `${baseTitle} [${typName || 'Page'}-${i+1}].png`;
                let success = await downloadImage(url, fileName);
                if (success) downloadedCount++;
                else failedCount++;
            }
            info(t('downloaded', {total: urls.length, success: downloadedCount, failed: failedCount})); // 修复：图片下载成功提示
        }
    }

    // --- 分页面处理逻辑 ---

    // 原始的 yuepuku 格式下载函数 (用于 yuepu 页面)
    async function fetchYuepuImages(base, typ, baseTitle) {
        var pageNum = 0;
        var typName = typ === "standard" ? "X" : "J";
        const urls = [];
        var fetchNext = async function() {
            var imageUrl = `${base}${pageNum}.png`;
            try {
                let res = await fetch(imageUrl);
                if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
                urls.push(imageUrl);
                pageNum++;
                fetchNext();
            } catch (error) {
                if (error.message.includes("404")) {
                    info(t('foundImages', {count: pageNum}));
                    await processImageUrls(urls, baseTitle, typName);
                } else {
                    info(t('downloadError', {error: error.message}));
                    console.error("[Tan8 Downloader Error]", error);
                }
            }
        };
        fetchNext();
    }

    // 分析并尝试下载 (yuepu - 原始方法)
    function analyzeAndDownloadYuepu(arrName, arr) {
        console.log("[Tan8 Downloader Debug] Analyzing yuepu array:", arrName, arr);
        if (!arr || arr.length === 0) {
            info(t('info') + ": " + t('noImages'));
            return;
        }

        var firstItem = arr[0];
        var imgUrl = null;
        if (firstItem && typeof firstItem === 'object') {
            if (Array.isArray(firstItem.img) && firstItem.img.length > 0) {
                 imgUrl = firstItem.img[0];
            } else if (typeof firstItem.img === 'string') {
                 imgUrl = firstItem.img;
            } else if (firstItem.url) {
                 imgUrl = firstItem.url;
            } else if (firstItem.src) {
                 imgUrl = firstItem.src;
            }
        } else if (typeof firstItem === 'string') {
            imgUrl = firstItem;
        }

        if (!imgUrl) {
            info(t('info') + ": " + t('downloadError', {error: `无法从 ${arrName} 中提取图片 URL`}));
            return;
        }

        var match = imgUrl.match(/(https:\/\/oss\.tan8\.com\/yuepuku\/\d+\/\d+\/)\d+_([a-z]+)_([a-z]+)\/+[^\/]+/);
        if (match) {
            var pre = match[1];
            var cid = match[2];
            var typ = match[3];

            var sheetId;
            if (typeof ypid !== 'undefined') {
                sheetId = ypid;
            } else {
                var urlMatch = window.location.pathname.match(/-(\d+)\.html$/);
                if (urlMatch) {
                    sheetId = urlMatch[1];
                } else {
                    info(t('info') + ": " + t('downloadError', {error: "无法获取曲谱 ID (ypid)"}));
                    return;
                }
            }

            var base = `${pre}${sheetId}_${cid}_${typ}/${sheetId}_${cid}.ypad.`;
            fetchYuepuImages(base, typ, title);
            return;
        }

        info(t('info') + ": " + t('downloadError', {error: `从 ${arrName} 提取的 URL 格式无法识别: ${imgUrl}`}));
        console.error("[Tan8 Downloader Error] URL Pattern not recognized:", imgUrl);
    }

    // 专门用于扫描 HTML 元素的方法 (用于 jitapu 的 'single' 模式 和 keyboard/violin 页面)
    async function scanHtmlForSingleInstrument() {
        info(t('scanning'));

        // 1. 直接开始扫描HTML元素 (适配懒加载)
        info(t('usingHtml'));
        // 等待一段时间让懒加载执行
        await new Promise(resolve => setTimeout(resolve, 2000));

        const imageElements = document.querySelectorAll('img');
        const targetUrls = new Set(); // 使用 Set 去重

        for (let img of imageElements) {
            // 尝试获取真实的图片URL (src, data-src, data-original, 等)
            let src = img.src || img.getAttribute('data-src') || img.getAttribute('data-original') || img.getAttribute('src-lazy');
            if (!src) continue;

            // 基础过滤：必须是 oss.tan8.com 的图片
            if (!src.startsWith('https://oss.tan8.com/')) continue;

            // 路径过滤：必须包含 jtpnew, yuepuku_dzq, 或 violin (适用于 keyboard, violin)
            if (!src.includes('/jtpnew/') && !src.includes('/yuepuku_dzq/') && !src.includes('/violin/')) continue;

            // 精准定位：检查图片的父元素或祖先元素是否包含特定的类名
            let isCoreSheet = false;
            let parent = img.parentElement;
            while (parent && parent !== document.body) {
                if (parent.classList.contains('yuepu-img') ||
                    parent.classList.contains('jtp-new-img') ||
                    parent.classList.contains('sheet-container') ||
                    parent.classList.contains('music-sheet') ||
                    parent.classList.contains('yuepu-show') ||
                    parent.classList.contains('guitar_sheet') ||
                    parent.id === 'yuepuShow' ||
                    parent.id === 'jtpNewShow') {
                    isCoreSheet = true;
                    break;
                }
                parent = parent.parentElement;
            }

            // 如果没有找到匹配的容器，则尝试通过URL模式判断
            if (!isCoreSheet) {
                if (src.includes('web_image_') || src.includes('.ypad.')) { // 包含 .ypad. 是 keyboard/violin 页面的特征
                    isCoreSheet = true;
                } else {
                    continue;
                }
            }

            targetUrls.add(src);
            console.log("[Tan8 Downloader Debug] Found core sheet image (HTML scan):", src);
        }

        if (targetUrls.size === 0) {
            info(t('noImages'));
            return;
        }

        const allUrls = Array.from(targetUrls);
        const totalFound = allUrls.length;
        info(t('foundImages', {count: totalFound}));

        const urlsToProcess = allUrls; // 不再切片
        await processImageUrls(urlsToProcess, title);
    }


    // Jitapu 页面专用函数 (根据设置决定行为) - 现在也适用于 violin 和 keyboard
    async function analyzeAndDownloadJitapu() {
        info(t('scanning'));

        // ✅ 关键修复：根据 config.jitapuDownloadMode 直接分支，互不干扰
        if (config.jitapuDownloadMode === 'pack') {
            // 打包模式：直接使用 yuepuArrXian 数组 (下载所有)
            info(t('usingArray'));
            if (typeof yuepuArrXian !== 'undefined' && Array.isArray(yuepuArrXian) && yuepuArrXian.length > 0) {
                const urls = [];
                for (let item of yuepuArrXian) {
                    if (item && item.img && Array.isArray(item.img)) {
                        for (let img of item.img) {
                            if (img) urls.push(img);
                        }
                    }
                }
                if (urls.length > 0) {
                    info(t('foundImages', {count: urls.length}));
                    await processImageUrls(urls, title, "yuepuArrXian"); // 下载全部
                    return;
                } else {
                    info(t('info') + ": " + t('downloadError', {error: "从 yuepuArrXian 数组未能提取到有效的URL。"}));
                }
            } else {
                info(t('info') + ": " + t('downloadError', {error: "未在 window 对象上找到 yuepuArrXian 数组。"}));
            }
        } else if (config.jitapuDownloadMode === 'single') {
            // 单独模式：**只**执行扫描HTML元素的方法
            info(t('usingHtml'));
            await scanHtmlForSingleInstrument(); // 直接调用新函数
        }
    }


    async function fetchAudio() {
        var audioElement = document.getElementById("myAudio");
        if (audioElement) {
            var audioSource = audioElement.querySelector("source");
            if (audioSource && audioSource.src) {
                var audioUrl = audioSource.src;
                try {
                    let res = await fetch(audioUrl);
                    if (!res.ok) throw new Error(res.status);
                    let blob = await res.blob();
                    var link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = `${title} [preview].mp3`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    info(t('downloadSuccess')); // 修复：音频下载成功提示
                } catch (error) {
                    info(t('downloadError', {error: error.message}));
                }
            } else {
                info(t('downloadAudioFailed'));
            }
        } else {
            info(t('downloadAudioElementNotFound'));
        }
    }

    // --- 主逻辑 ---
    var titleElement;
    var title;

    if (window.location.href.includes("yuepu")) {
        titleElement = document.querySelector(".yuepu-text-info li:nth-child(2) p");
    } else {
        titleElement = document.querySelector('.show_info h2') ||
                       document.querySelector('h2') ||
                       document.querySelector('.guitar_sheet .show_info p') ||
                       document.querySelector('title');
        if(titleElement) {
             if(titleElement.tagName.toLowerCase() === 'title') {
                 title = titleElement.textContent.trim();
                 title = title.replace(/\s*-.*$/, '').trim();
             } else {
                 title = titleElement.textContent.trim();
             }
        }
    }

    title = title || "未知标题";
    console.log(t('titleDetected', {title: title}));

    var audioButton = createButton(t('downloadAudio'), "220px", "#900090", fetchAudio);
    var settingsButton = createButton(t('settings'), "160px", "#555", toggleSettings);

    var sheetButton, jianButton;

    if (window.location.href.includes("yuepu")) {
        sheetButton = createButton(t('downloadSheet'), "100px", "#007bff", function() {
            if (typeof yuepuArrGuitar !== 'undefined' && Array.isArray(yuepuArrGuitar)) {
                analyzeAndDownloadYuepu("yuepuArrGuitar", yuepuArrGuitar);
            } else if (typeof yuepuArrXian !== 'undefined' && Array.isArray(yuepuArrXian)) {
                analyzeAndDownloadYuepu("yuepuArrXian", yuepuArrXian);
            } else if (typeof yuepuArrJian !== 'undefined' && Array.isArray(yuepuArrJian)) {
                analyzeAndDownloadYuepu("yuepuArrJian", yuepuArrJian);
            } else {
                info(t('info') + ": " + t('noImages'));
            }
        });

        jianButton = createButton(t('downloadJian'), "40px", "#28a545", function() {
            if (typeof yuepuArrJian !== 'undefined' && Array.isArray(yuepuArrJian)) {
                analyzeAndDownloadYuepu("yuepuArrJian", yuepuArrJian);
            } else {
                info(t('info') + ": " + t('noImages'));
            }
        });
    } else {
        // 所有其他页面 (violin, keyboard, jitapu) - 使用新的统一函数
        // Jitapu 页面会根据设置切换行为
        sheetButton = createButton(t('downloadSheet'), "100px", "#007bff", analyzeAndDownloadJitapu);
        jianButton = createButton(t('downloadJian'), "40px", "#28a545", analyzeAndDownloadJitapu);
    }

    document.body.appendChild(audioButton);
    document.body.appendChild(settingsButton);
    document.body.appendChild(sheetButton);
    document.body.appendChild(jianButton);

})();