// ==UserScript==
// @name         雨课堂课件试卷下载器
// @namespace    https://changjiang.yuketang.cn/
// @version      1.1.1
// @description  支持试卷试题下载，PPT课件下载为图片或PDF，支持原生打印模式和可视化选择下载
// @author       kell0281 & Gemini
// @match        https://changjiang.yuketang.cn/*
// @match        https://www.yuketang.cn/*
// @match        https://*.yuketang.cn/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561133/%E9%9B%A8%E8%AF%BE%E5%A0%82%E8%AF%BE%E4%BB%B6%E8%AF%95%E5%8D%B7%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/561133/%E9%9B%A8%E8%AF%BE%E5%A0%82%E8%AF%BE%E4%BB%B6%E8%AF%95%E5%8D%B7%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 确保只在主窗口执行，防止iframe中重复创建
    if (window.self !== window.top) {
        console.log('雨课堂脚本：在iframe中，不执行');
        return;
    }

    // 全局变量，用于防止重复执行
    if (window._yuketang_script_loaded) {
        console.log('雨课堂脚本：已加载，不重复执行');
        return;
    }
    window._yuketang_script_loaded = true;

    // ================= 1. 打印专用样式 (CSS) =================
    const PRINT_STYLE = `
        <style>
            @page { size: A4; margin: 20mm; }
            body {
                font-family: "Microsoft YaHei", "SimSun", sans-serif;
                max-width: 900px;
                margin: 0 auto;
                color: #000;
                font-size: 14px;
                line-height: 1.6;
            }
            h1 { text-align: center; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 30px; }

            /* 题目卡片 */
            .q-card {
                border-bottom: 1px dashed #ccc;
                padding: 15px 0;
                page-break-inside: avoid; /* 禁止在题目中间换页 */
            }

            /* 题干样式 */
            .q-body {
                font-size: 15px;
                font-weight: bold;
                margin-bottom: 12px;
                color: #222;
                line-height: 1.8;
                word-wrap: break-word;
            }
            /* 题型标签 */
            .q-badge {
                background: #f0f0f0;
                color: #333;
                padding: 2px 6px;
                font-size: 12px;
                border-radius: 4px;
                margin-right: 8px;
                font-weight: normal;
                vertical-align: 2px;
            }

            /* 图片终极修复：自动高度，最大宽度限制 */
            img {
                display: block !important;
                max-width: 95% !important;
                height: auto !important;
                margin: 10px 0;
                border: 1px solid #eee;
            }

            /* 选项区域：Grid 双栏 + Flex 内容对齐 */
            .q-options {
                display: grid;
                grid-template-columns: 1fr 1fr; /* 强制两列 */
                column-gap: 30px;
                row-gap: 10px;
                margin-left: 10px;
                margin-top: 8px;
            }
            /* 单个选项容器 */
            .q-option-item {
                display: flex;
                align-items: flex-start; /* 顶部对齐 */
                font-size: 14px;
            }
            /* 选项标号 (A.) */
            .q-opt-label {
                font-weight: bold;
                margin-right: 8px;
                white-space: nowrap;
                min-width: 25px;
            }
            /* 选项内容 */
            .q-opt-content {
                flex: 1;
                word-break: break-all;
            }
            .q-opt-content p, .q-opt-content div { display: inline; margin: 0; }
            .q-opt-content img { display: block; margin: 5px 0; max-height: 150px; }

            /* 填空下划线 */
            .fill-blank {
                display: inline-block;
                border-bottom: 1px solid #000;
                min-width: 80px;
                text-align: center;
                padding: 0 5px;
                margin: 0 5px;
                color: #333;
                font-weight: bold;
                text-decoration: none !important;
            }

            /* 答案与解析 */
            .q-answer {
                margin-top: 12px;
                padding: 10px 15px;
                background: #f8f9fa;
                border-left: 4px solid #4a90e2;
                font-size: 13px;
                color: #555;
            }
            .timestamp { text-align: center; color: #888; font-size: 12px; margin-bottom: 20px; }
        </style>
    `;

    // ================= 2. UI 界面 =================
    function createUI() {
        // 清除已存在的面板，防止叠加
        const existingPanel = document.getElementById('yuketang-v9-panel');
        if (existingPanel) {
            console.log('雨课堂面板已存在，移除旧面板');
            existingPanel.remove();
        }

        console.log('创建雨课堂面板');
        const panel = document.createElement('div');
        panel.id = 'yuketang-v9-panel';
        Object.assign(panel.style, {
            position: 'fixed', top: '80px', right: '20px', zIndex: '99999',
            background: 'white', border: '1px solid #ddd', padding: '15px',
            borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            width: '250px', textAlign: 'center', fontFamily: 'sans-serif'
        });

        const title = document.createElement('div');
        title.innerHTML = '<b>🚀 雨课堂 </b><br><span style="font-size:12px;color:#666">';
        title.style.marginBottom = '10px';

        // 添加抓取类型选择
        const typeSelectDiv = document.createElement('div');
        typeSelectDiv.style.marginBottom = '10px';
        typeSelectDiv.innerHTML = `
            <label style="font-size:13px; color:#555; margin-bottom:5px; display:block; text-align:left;">抓取类型：</label>
            <select id="yk-content-type" style="width:100%; padding:5px; margin-bottom:10px; border:1px solid #ddd; border-radius:4px;">
                <option value="exam">试卷试题</option>
                <option value="ppt">PPT课件</option>
            </select>
        `;

        // 添加下载格式选择
        const formatSelectDiv = document.createElement('div');
        formatSelectDiv.style.marginBottom = '10px';
        formatSelectDiv.innerHTML = `
            <label style="font-size:13px; color:#555; margin-bottom:5px; display:block; text-align:left;">下载格式：</label>
            <select id="yk-download-format" style="width:100%; padding:5px; margin-bottom:10px; border:1px solid #ddd; border-radius:4px;">
                <option value="html">HTML</option>
                <option value="pdf">PDF</option>
                <option value="images">图片集</option>
            </select>
        `;

        const btn = document.createElement('button');
        btn.textContent = '开始导出';
        Object.assign(btn.style, {
            width: '100%', padding: '8px', background: '#007bff', color: 'white',
            border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
        });
        btn.onclick = startExtraction;

        const progressBar = document.createElement('div');
        progressBar.id = 'yk-progress-bar';
        Object.assign(progressBar.style, {
            width: '0%', height: '5px', background: '#28a745', marginTop: '10px',
            transition: 'width 0.3s', borderRadius: '2px'
        });

        const statusText = document.createElement('div');
        statusText.id = 'yk-status-text';
        statusText.style.fontSize = '12px';
        statusText.style.marginTop = '5px';
        statusText.textContent = '准备就绪';

        panel.appendChild(title);
        panel.appendChild(typeSelectDiv);
        panel.appendChild(formatSelectDiv);
        panel.appendChild(btn);
        panel.appendChild(progressBar);
        panel.appendChild(statusText);
        document.body.appendChild(panel);
    }

    // ================= 3. 核心功能：数据清洗 =================
    function updateStatus(text, percent) {
        const bar = document.getElementById('yk-progress-bar');
        const txt = document.getElementById('yk-status-text');
        if (bar) bar.style.width = percent + '%';
        if (txt) txt.textContent = text;
    }

    function cleanNode(node, context = 'body') {
        if (!node) return "";

        // 创建一个新的div来包装内容，确保能够正确处理来自iframe的元素
        const wrapper = document.createElement('div');
        let content;

        // 如果node是图片元素，直接处理
        if (node.tagName === 'IMG') {
            const imgClone = node.cloneNode(true);
            if (imgClone.dataset.src) imgClone.src = imgClone.dataset.src;
            ['width', 'height', 'style'].forEach(attr => imgClone.removeAttribute(attr));
            wrapper.appendChild(imgClone);
            content = wrapper;
        } else {
            // 否则克隆节点
            let clone = node.cloneNode(true);
            wrapper.appendChild(clone);
            content = clone;
        }

        if (context !== 'ppt') {
            // A. 修复填空题
            const makeBlank = (val) => `<span class="fill-blank">${val || '&nbsp;&nbsp;&nbsp;&nbsp;'}</span>`;

            content.querySelectorAll('input, textarea').forEach(el => {
                let val = el.value && el.value.trim() ? el.value : '';
                let span = document.createElement('span');
                span.innerHTML = makeBlank(val);
                el.replaceWith(span);
            });

            content.querySelectorAll('.gap, .box, u, .blank-item-dynamic').forEach(el => {
                if (!el.querySelector('img')) {
                    let val = el.innerText.replace(/_/g, '').trim();
                    if(val === '未作答') val = '';
                    let span = document.createElement('span');
                    span.innerHTML = makeBlank(val);
                    el.replaceWith(span);
                }
            });
        }

        // B. 修复图片
        content.querySelectorAll('img').forEach(img => {
            if (img.dataset.src) img.src = img.dataset.src;
            ['width', 'height', 'style'].forEach(attr => img.removeAttribute(attr));
            // 确保图片有合适的样式
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.display = 'block';
        });

        // C. 移除垃圾元素
        const trashSelectors = context === 'ppt'
            ? 'button, .icon, .operation, .collect, .error-report, .el-checkbox__inner, .el-radio__inner, .budong-btn, .navigation, .controls, .nav, .toolbar, .footer, .header'
            : 'button, .icon, .operation, .collect, .error-report, .el-checkbox__inner, .el-radio__inner, .budong-btn';
        content.querySelectorAll(trashSelectors).forEach(el => el.remove());

        // [重要] D. 移除所有内联颜色样式，防止白字
        content.querySelectorAll('*').forEach(el => {
            if(el.style.color) el.style.color = '';
            if(el.style.backgroundColor) el.style.backgroundColor = '';
        });

        return wrapper.innerHTML;
    }

    // ================= 4. 异步处理引擎 =================
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    // PPT 解析函数
    function parsePPTSlide(slide, index) {
        let html = cleanNode(slide, 'ppt');
        return `<div class="q-card"><div class="q-body"><span class="q-badge">PPT ${index}</span><br>${html}</div></div>`;
    }

    // 下载单张图片
    function downloadImage(url, filename) {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // 下载图片为zip包
    async function downloadImagesAsZip(images) {
        const zip = new JSZip();
        const imgFolder = zip.folder("PPT图片集");
        let downloadedCount = 0;

        // 下载并添加图片到zip
        for (let i = 0; i < images.length; i++) {
            await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', images[i].src, true);
                xhr.responseType = 'blob';

                xhr.onload = function() {
                    if (xhr.status === 200) {
                        imgFolder.file(`PPT_${images[i].index}.png`, xhr.response);
                        downloadedCount++;
                        updateStatus(`正在打包图片 ${downloadedCount}/${images.length}`, 80 + Math.floor((downloadedCount / images.length) * 15));
                        resolve();
                    } else {
                        reject(new Error(`图片下载失败: ${images[i].src}`));
                    }
                };

                xhr.onerror = function() {
                    reject(new Error(`网络错误: ${images[i].src}`));
                };

                xhr.send();
            });

            await sleep(100); // 避免请求过于频繁
        }

        // 生成并下载zip文件
        updateStatus("正在生成zip文件...", 95);
        const zipBlob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `雨课堂_PPT图片集_${new Date().getTime()}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    async function startExtraction() {
        const btn = document.querySelector('#yuketang-v9-panel button');
        if (btn) btn.disabled = true;

        // 获取选择的抓取类型和下载格式
        const contentType = document.getElementById('yk-content-type').value;
        const downloadFormat = document.getElementById('yk-download-format').value;

        updateStatus("正在唤醒所有内容...", 10);
        window.scrollTo(0, document.body.scrollHeight);
        await sleep(1500);
        window.scrollTo(0, 0);
        await sleep(500);

        let items = [];
        let cards = [];
        let images = [];

        if (contentType === 'ppt') {
            // PPT课件处理 - 优化识别逻辑
            let foundInIframe = false;

            // 1. 首先尝试处理iframe中的内容（雨课堂常用iframe嵌入课件）
            const iframes = Array.from(document.querySelectorAll('iframe'));
            for (const iframe of iframes) {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

                    // 1.1 尝试在iframe中查找slide元素
                    const iframeSlides = Array.from(iframeDoc.querySelectorAll(
                        '.slide, .ppt-slide, .swiper-slide, .slick-slide, .presentation-slide, .lesson-slide, .courseware-slide'
                    ));

                    if (iframeSlides.length > 0) {
                        items = iframeSlides;
                        foundInIframe = true;
                        break;
                    }

                    // 1.2 尝试在iframe中查找包含图片的容器
                    const iframeImgContainers = Array.from(iframeDoc.querySelectorAll('div img'))
                        .filter(img => img.src && (img.src.includes('ppt') || img.src.includes('image') || img.src.includes('slide')))
                        .map(img => img.closest('div'));

                    if (iframeImgContainers.length > 0) {
                        items = [...new Set(iframeImgContainers)];
                        foundInIframe = true;
                        break;
                    }

                    // 1.3 直接提取iframe中的所有图片
                    const allIframeImages = Array.from(iframeDoc.querySelectorAll('img'))
                        .filter(img => img.src && !img.src.includes('data:image') && !img.src.includes('icon') && !img.src.includes('logo'));

                    if (allIframeImages.length > 0) {
                        items = allIframeImages;
                        foundInIframe = true;
                        break;
                    }
                } catch (e) {
                    // 跨域iframe无法访问，继续尝试其他iframe
                    console.log("跨域iframe，无法访问内容");
                }
            }

            // 2. 如果iframe中没有找到，在当前页面查找
            if (!foundInIframe) {
                // 2.1 尝试多种常见的slide类名
                items = Array.from(document.querySelectorAll(
                    '.slide, .ppt-slide, .swiper-slide, .slick-slide, .presentation-slide, .lesson-slide, .courseware-slide'
                ));

                // 2.2 尝试查找包含图片的容器
                if (items.length === 0) {
                    // 查找所有包含图片的div容器
                    const imgContainers = Array.from(document.querySelectorAll('div img'))
                        .filter(img => img.src && (img.src.includes('ppt') || img.src.includes('image') || img.src.includes('slide')))
                        .map(img => img.closest('div'));
                    items = [...new Set(imgContainers)];
                }

                // 2.3 尝试查找具有特定样式的容器（全屏幻灯片）
                if (items.length === 0) {
                    const allDivs = Array.from(document.querySelectorAll('div'));
                    items = allDivs.filter(div => {
                        const style = window.getComputedStyle(div);
                        return style.width === '100%' || style.height === '100%' ||
                               style.width.includes('px') && parseInt(style.width) > 800;
                    });
                }

                // 2.4 直接提取当前页面的所有图片
                if (items.length === 0) {
                    items = Array.from(document.querySelectorAll('img'))
                        .filter(img => img.src && !img.src.includes('data:image') && !img.src.includes('icon') && !img.src.includes('logo'));
                }
            }

            if (items.length === 0) {
                alert("未找到PPT课件，请确认是否在课件播放页！\n\n提示：\n1. 确保课件已完全加载\n2. 尝试刷新页面后再试\n3. 如果是跨域iframe，可能无法访问内容");
                if (btn) btn.disabled = false;
                return;
            }

            // 显示可视化选择面板
            updateStatus("正在生成预览面板...", 20);
            const selectedIndices = await createSelectionPanel(items);

            if (selectedIndices.length === 0) {
                alert("请至少选择一张PPT！");
                if (btn) btn.disabled = false;
                updateStatus("准备就绪", 0);
                return;
            }

            updateStatus(`正在处理 ${selectedIndices.length} 张PPT...`, 30);

            // 只处理选中的PPT
            for (let i = 0; i < selectedIndices.length; i++) {
                const index = selectedIndices[i];
                const item = items[index];

                try {
                    if (downloadFormat === 'images') {
                        // 直接提取图片
                        let slideImages = [];

                        // 如果当前item是图片，直接添加
                        if (item.tagName === 'IMG') {
                            if (item.src) {
                                slideImages.push(item);
                            }
                        } else {
                            // 否则查找item中的所有图片
                            slideImages = item.querySelectorAll('img');
                        }

                        slideImages.forEach(img => {
                            if (img.src && !img.src.includes('data:image')) {
                                // 确保图片URL有效且不是base64数据
                                images.push({ src: img.src, index: i + 1 });
                            }
                        });
                    } else {
                        // 生成HTML卡片
                        const cardHTML = parsePPTSlide(item, i + 1);
                        if (cardHTML) cards.push(cardHTML);
                    }
                } catch (e) {
                    console.error("PPT解析错误", e);
                }

                const progress = 30 + Math.floor(((i + 1) / selectedIndices.length) * 60);
                updateStatus(`已处理 ${i + 1} / ${selectedIndices.length} 张PPT`, progress);
                await sleep(20);
            }

            // 额外检查：如果是图片下载模式但没有找到图片，尝试全局查找
            if (downloadFormat === 'images' && images.length === 0) {
                updateStatus("正在全局查找图片...", 80);
                // 全局查找所有图片
                const allImages = Array.from(document.querySelectorAll('img'))
                    .filter(img => img.src && !img.src.includes('data:image') && !img.src.includes('icon') && !img.src.includes('logo'));

                allImages.forEach((img, i) => {
                    images.push({ src: img.src, index: i + 1 });
                });

                if (images.length === 0) {
                    alert("未找到可下载的图片！\n\n提示：请检查页面是否已完全加载，或尝试刷新页面后再试。");
                    if (btn) btn.disabled = false;
                    return;
                }
                updateStatus(`发现 ${images.length} 张图片，准备下载...`, 90);
            }
        } else {
            // 试卷试题处理（保持原有逻辑）
            items = Array.from(document.querySelectorAll('.problem_item, .question-detail, .exercise-item, .view-quiz-body .item, .subject-item, .subject-list-item'));

            items = [...new Set(items)].filter(i => {
                if(i.classList.contains('subject-list-item')) return false;
                return i && i.innerText.length > 5;
            });

            if (items.length === 0) {
                 let listItems = document.querySelectorAll('.subject-list-item .subject-item');
                 if(listItems.length > 0) items = Array.from(listItems);
            }

            if (items.length === 0) {
                alert("未找到题目，请确认是否在解析页！");
                if (btn) btn.disabled = false;
                return;
            }

            updateStatus(`发现 ${items.length} 道题，开始解析...`, 20);

            const BATCH_SIZE = 10;
            for (let i = 0; i < items.length; i += BATCH_SIZE) {
                const chunk = items.slice(i, i + BATCH_SIZE);
                chunk.forEach((item, batchIdx) => {
                    try {
                        const cardHTML = parseOneQuestion(item, i + batchIdx + 1);
                        if (cardHTML) cards.push(cardHTML);
                    } catch (e) {
                        console.error("题目解析错误", e);
                    }
                });

                const progress = 20 + Math.floor(((i + BATCH_SIZE) / items.length) * 70);
                updateStatus(`已处理 ${Math.min(i + BATCH_SIZE, items.length)} / ${items.length} 题`, progress);
                await sleep(20);
            }
        }

        updateStatus("生成文件中...", 95);
        await sleep(500);

        if (downloadFormat === 'images' && contentType === 'ppt') {
            // 下载图片集
            if (images.length > 0) {
                await downloadImagesAsZip(images);
            } else {
                alert("未找到可下载的图片！");
            }
        } else if (downloadFormat === 'pdf') {
            // 使用原生打印模式生成PDF
            if (cards.length > 0) {
                printPPT(cards);
            } else {
                alert("未找到可生成PDF的内容！");
            }
        } else {
            // 生成HTML（默认）
            generateHTML(cards);
        }

        updateStatus("✅ 导出完成", 100);
        if (btn) btn.disabled = false;
        setTimeout(() => updateStatus("准备就绪", 0), 3000);
    }

    // 解析单道题目
    function parseOneQuestion(item, index) {
        // --- 提取题型 ---
        let typeNode = item.querySelector('.item-type, .question-type');
        let typeText = typeNode ? typeNode.innerText.replace(/\n/g, '').trim() : `第${index}题`;

        // [V9.3修复] 如果是填空题，直接跳过选项抓取逻辑，防止误判
        if (typeText.includes('填空')) {
            return parseFillBlankQuestion(item, typeText, index);
        }

        // --- 提取题干 ---
        let bodyNode = item.querySelector('.item-body') ||
                       item.querySelector('.content') ||
                       item.querySelector('.exam-font') ||
                       item.querySelector('h4');

        if (!bodyNode) return null;

        let tempBody = bodyNode.cloneNode(true);
        let internalOptions = tempBody.querySelector('ul, .options');
        if (internalOptions && (internalOptions.querySelector('li') || internalOptions.querySelector('label'))) {
            internalOptions.remove();
        }
        let cleanBodyHtml = cleanNode(tempBody);

        // --- 提取选项 (V9.4 核心修复: 正确选项内容丢失问题) ---
        let optionHtml = "";
        let options = [];

        let radios = Array.from(item.querySelectorAll('.el-radio, .el-checkbox'))
            .filter(el => !el.closest('.item-footer, .answer, .analysis'));

        if (radios.length > 0) {
            options = radios;
        } else {
            let opts = Array.from(item.querySelectorAll('.option'))
                .filter(el => !el.closest('.item-footer, .answer, .analysis'));
            if (opts.length > 0) options = opts;
        }

        if (options.length > 0) {
            optionHtml = `<div class="q-options">`;
            options.forEach(opt => {
                let keyText = "";
                let valHtml = "";

                // [V9.4 逻辑] 不再使用 span:last-child，而是获取 Label 容器并剔除干扰项
                let labelGroup = opt.querySelector('.el-radio__label, .el-checkbox__label');

                if (labelGroup) {
                    // 情况1: 标准结构 (Key 在 Label 内)
                    let tempGroup = labelGroup.cloneNode(true);

                    // 1. 提取并移除 Key (A.)
                    let keyInGroup = tempGroup.querySelector('.radioInput, .alphabet') || tempGroup.querySelector('span:first-child');
                    if (keyInGroup) {
                        keyText = keyInGroup.innerText.replace(/[^A-Z]/g, '') + ".";
                        keyInGroup.remove();
                    }

                    // 2. 移除尾部的状态图标 (这是导致内容消失的元凶)
                    tempGroup.querySelectorAll('i, .icon, .result-icon').forEach(e => e.remove());

                    // 3. 剩下的就是内容
                    valHtml = cleanNode(tempGroup, true);

                } else {
                    // 情况2: 非标准结构 (Key 可能是兄弟元素)
                    // 回退到简单文本解析，或者查找 .radioText
                    let contentEl = opt.querySelector('.radioText, .option-content');
                    if(contentEl) {
                         valHtml = cleanNode(contentEl, true);
                         // 尝试找Key
                         let keyEl = opt.querySelector('.radioInput, .alphabet');
                         if(keyEl) keyText = keyEl.innerText.replace(/[^A-Z]/g, '') + ".";
                    } else {
                        // 纯文本回退
                         let text = opt.innerText.trim();
                         let match = text.match(/^([A-Z])\s*\.?\s*/);
                         if (match) {
                             keyText = match[1] + ".";
                             let cloneOpt = opt.cloneNode(true);
                             valHtml = cleanNode(cloneOpt, true).replace(/^[A-Z]\s*\.?\s*/, '');
                         } else {
                             valHtml = cleanNode(opt, true);
                         }
                    }
                }

                optionHtml += `
                    <div class="q-option-item">
                        <span class="q-opt-label">${keyText}</span>
                        <div class="q-opt-content">${valHtml}</div>
                    </div>`;
            });
            optionHtml += `</div>`;
        }

        // --- 提取答案 ---
        let answerHtml = getAnswerHtml(item);

        return `
            <div class="q-card">
                <div class="q-body">
                    <span class="q-badge">${typeText}</span>
                    ${cleanBodyHtml}
                </div>
                ${optionHtml}
                ${answerHtml}
            </div>
        `;
    }

    // 填空题专用解析
    function parseFillBlankQuestion(item, typeText, index) {
        let bodyNode = item.querySelector('.item-body') || item.querySelector('.content') || item.querySelector('.exam-font');
        let cleanBodyHtml = bodyNode ? cleanNode(bodyNode) : "题目内容获取失败";
        let answerHtml = getAnswerHtml(item);

        return `
            <div class="q-card">
                <div class="q-body">
                    <span class="q-badge">${typeText}</span>
                    ${cleanBodyHtml}
                </div>
                ${answerHtml}
            </div>
        `;
    }

    function getAnswerHtml(item) {
        let ansNode = item.querySelector('.answer, .analysis, .exam-answer, .item-footer');
        if (ansNode) {
            let cloneAns = ansNode.cloneNode(true);
            cloneAns.querySelectorAll('.budong-btn, .grade').forEach(e => e.remove());
            let realAns = cloneAns.querySelector('.item-footer--header') || cloneAns;
            return `<div class="q-answer"><strong>解析/答案：</strong>${cleanNode(realAns)}</div>`;
        }
        return "";
    }

    // 可视化选择面板
    function createSelectionPanel(slides) {
        // 关闭已存在的选择面板
        const existingPanel = document.getElementById('yk-selection-panel');
        if (existingPanel) existingPanel.remove();

        const panel = document.createElement('div');
        panel.id = 'yk-selection-panel';
        Object.assign(panel.style, {
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '80%', maxWidth: '1000px', height: '80%', maxHeight: '800px',
            background: 'white', border: '1px solid #ddd', borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)', zIndex: '100000',
            overflow: 'auto', fontFamily: 'sans-serif'
        });

        // 面板头部
        const header = document.createElement('div');
        header.style.cssText = `
            padding: 15px; border-bottom: 1px solid #eee;
            display: flex; justify-content: space-between; align-items: center;
            background: #f8f9fa;
        `;
        header.innerHTML = `
            <h3 style="margin: 0;font-size: 16px;color: #333;">选择要下载的PPT页码</h3>
            <button id="yk-close-panel" style="
                padding: 5px 10px; background: #6c757d; color: white;
                border: none; border-radius: 4px; cursor: pointer;
            ">关闭</button>
        `;
        panel.appendChild(header);

        // 面板内容
        const content = document.createElement('div');
        content.style.cssText = `
            padding: 15px;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 15px;
        `;

        // 添加全选/取消全选按钮
        const controlDiv = document.createElement('div');
        controlDiv.style.cssText = `
            grid-column: 1 / -1;
            display: flex; gap: 10px; margin-bottom: 10px;
        `;
        controlDiv.innerHTML = `
            <button id="yk-select-all" style="
                padding: 8px 15px; background: #007bff; color: white;
                border: none; border-radius: 4px; cursor: pointer;
            ">全选</button>
            <button id="yk-select-none" style="
                padding: 8px 15px; background: #6c757d; color: white;
                border: none; border-radius: 4px; cursor: pointer;
            ">取消全选</button>
        `;
        content.appendChild(controlDiv);

        // 添加PPT选择项
        slides.forEach((slide, index) => {
            const slideDiv = document.createElement('div');
            slideDiv.style.cssText = `
                border: 2px solid #ddd; border-radius: 6px; padding: 10px;
                display: flex; flex-direction: column; align-items: center;
                cursor: pointer; transition: all 0.2s;
                background-color: white;
            `;
            slideDiv.className = 'yk-slide-item';
            slideDiv.dataset.index = index;

            // 预览图
            const previewDiv = document.createElement('div');
            previewDiv.style.cssText = `
                width: 100%; height: 100px; margin-bottom: 10px;
                background: #f0f0f0; border-radius: 4px;
                display: flex; justify-content: center; align-items: center;
                overflow: hidden;
            `;

            // 提取slide中的图片作为预览
            const slideImages = slide.querySelectorAll('img');
            if (slideImages.length > 0) {
                const previewImg = document.createElement('img');
                previewImg.src = slideImages[0].src;
                previewImg.style.cssText = `width: 100%; height: 100%; object-fit: contain;`;
                previewDiv.appendChild(previewImg);
            } else {
                previewDiv.innerHTML = `<span style="color: #999; font-size: 12px;">无预览图</span>`;
            }

            // 选择框和页码
            const selectDiv = document.createElement('div');
            selectDiv.style.cssText = `
                display: flex; align-items: center; gap: 8px;
            `;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'yk-slide-checkbox';
            checkbox.checked = true;
            checkbox.style.cssText = `width: 18px; height: 18px; cursor: pointer;`;

            const pageText = document.createElement('span');
            pageText.style.cssText = `font-size: 14px; color: #333;`;
            pageText.textContent = `第${index + 1}页`;

            selectDiv.appendChild(checkbox);
            selectDiv.appendChild(pageText);

            slideDiv.appendChild(previewDiv);
            slideDiv.appendChild(selectDiv);
            content.appendChild(slideDiv);

            // 更新选中状态样式
            const updateSelectedStyle = () => {
                if (checkbox.checked) {
                    slideDiv.style.borderColor = '#007bff';
                    slideDiv.style.backgroundColor = '#e3f2fd';
                    slideDiv.style.boxShadow = '0 0 0 2px rgba(0, 123, 255, 0.25)';
                } else {
                    slideDiv.style.borderColor = '#ddd';
                    slideDiv.style.backgroundColor = 'white';
                    slideDiv.style.boxShadow = 'none';
                }
            };

            // 初始更新样式
            updateSelectedStyle();

            // 复选框点击事件
            checkbox.addEventListener('change', updateSelectedStyle);

            // 容器点击事件
            slideDiv.addEventListener('click', (e) => {
                if (e.target !== checkbox) {
                    checkbox.checked = !checkbox.checked;
                    updateSelectedStyle();
                }
            });
        });

        // 底部操作按钮
        const footer = document.createElement('div');
        footer.style.cssText = `
            padding: 15px; border-top: 1px solid #eee;
            display: flex; justify-content: flex-end; gap: 10px;
            background: #f8f9fa;
        `;
        footer.innerHTML = `
            <button id="yk-download-selected" style="
                padding: 10px 20px; background: #28a745; color: white;
                border: none; border-radius: 4px; cursor: pointer; font-weight: bold;
            ">开始下载</button>
        `;

        panel.appendChild(header);
        panel.appendChild(content);
        panel.appendChild(footer);
        document.body.appendChild(panel);

        // 事件监听
        document.getElementById('yk-close-panel').addEventListener('click', () => panel.remove());
        document.getElementById('yk-select-all').addEventListener('click', () => {
            panel.querySelectorAll('.yk-slide-item').forEach(item => {
                const checkbox = item.querySelector('.yk-slide-checkbox');
                checkbox.checked = true;
                // 更新样式
                item.style.borderColor = '#007bff';
                item.style.backgroundColor = '#e3f2fd';
                item.style.boxShadow = '0 0 0 2px rgba(0, 123, 255, 0.25)';
            });
        });
        document.getElementById('yk-select-none').addEventListener('click', () => {
            panel.querySelectorAll('.yk-slide-item').forEach(item => {
                const checkbox = item.querySelector('.yk-slide-checkbox');
                checkbox.checked = false;
                // 更新样式
                item.style.borderColor = '#ddd';
                item.style.backgroundColor = 'white';
                item.style.boxShadow = 'none';
            });
        });

        return new Promise((resolve) => {
            document.getElementById('yk-download-selected').addEventListener('click', () => {
                const selectedIndices = Array.from(
                    panel.querySelectorAll('.yk-slide-checkbox:checked')
                ).map(cb => parseInt(cb.closest('.yk-slide-item').dataset.index));
                panel.remove();
                resolve(selectedIndices);
            });
        });
    }

    // 原生打印模式
    function printPPT(cards) {
        let title = document.title || "雨课堂PPT";
        let finalHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>${title}</title>
                ${PRINT_STYLE}
                <style>
                    /* 打印专用样式 */
                    @media print {
                        body {
                            max-width: 100%; margin: 0; padding: 0;
                        }
                        .q-card {
                            page-break-after: always; /* 每页一个PPT */
                            margin-bottom: 20px;
                        }
                        .q-badge { display: none; }
                    }
                </style>
            </head>
            <body>
                <h1 style="text-align: center; margin-bottom: 30px;">${title}</h1>
                <div class="timestamp" style="text-align: center; margin-bottom: 30px;">生成时间: ${new Date().toLocaleString()}</div>
                ${cards.join('\n')}
            </body>
            </html>
        `;

        // 打开新窗口并打印
        const printWindow = window.open('', '_blank');
        printWindow.document.write(finalHtml);
        printWindow.document.close();

        // 等待页面加载完成后唤起打印预览
        printWindow.onload = function() {
            printWindow.print();
        };
    }

    // 生成HTML文件
    function generateHTML(cards) {
        const contentType = document.getElementById('yk-content-type').value;
        let title = document.title || "雨课堂资料";
        // 确保cards数组不为空
        if (cards.length === 0) {
            alert("没有可生成HTML的内容！");
            return;
        }

        let finalHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>${title}</title>
                ${PRINT_STYLE}
            </head>
            <body>
                <h1>${title}</h1>
                <div class="timestamp">生成时间: ${new Date().toLocaleString()}</div>
                ${cards.join('\n')}
            </body>
            </html>
        `;

        let blob = new Blob([finalHtml], {type: 'text/html;charset=utf-8'});
        let url = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = `雨课堂_${contentType}_${new Date().getTime()}.html`;
        a.click();

        // 清理URL对象
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);
    }

    // 页面加载完成后创建UI
    window.addEventListener('load', () => {
        // 使用setTimeout确保DOM完全加载
        setTimeout(() => {
            createUI();
        }, 1500);
    });

    // 处理URL变化，防止重复创建面板
    let lastUrl = location.href;
    let urlChangeTimeout = null;

    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;

            // 清除之前的定时器，防止重复调用
            if (urlChangeTimeout) {
                clearTimeout(urlChangeTimeout);
            }

            // 使用新的定时器，确保页面加载完成后再创建UI
            urlChangeTimeout = setTimeout(() => {
                // 再次检查面板是否存在，防止重复创建
                if (!document.getElementById('yuketang-v9-panel')) {
                    createUI();
                }
            }, 1500);
        }
    }, 2000);
})();