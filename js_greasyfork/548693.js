// ==UserScript==
// @name         【夸克百科】文字模板生成器
// @namespace    http://tampermonkey.net/
// @version      2025/12/02-01:24:35
// @description  在 Quark 百科任务页生成定制文字模板图片
// @match        https://baike.quark.cn/dashboard/task/detail?task_id=9
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license      All rights reserved
// @downloadURL https://update.greasyfork.org/scripts/548693/%E3%80%90%E5%A4%B8%E5%85%8B%E7%99%BE%E7%A7%91%E3%80%91%E6%96%87%E5%AD%97%E6%A8%A1%E6%9D%BF%E7%94%9F%E6%88%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/548693/%E3%80%90%E5%A4%B8%E5%85%8B%E7%99%BE%E7%A7%91%E3%80%91%E6%96%87%E5%AD%97%E6%A8%A1%E6%9D%BF%E7%94%9F%E6%88%90%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 清除原网页内容
    document.body.innerHTML = '';
    document.body.style.backgroundColor = '#f8f8f8';
    document.body.style.margin = '0';
    document.body.style.padding = '0';

    // 2. 使用Fetch API动态加载字体
    async function loadFontCSS(main, fallback) {
        try {
            let response = await fetch(main, { method: "GET", mode: "cors" });
            if (!response.ok) throw new Error('Main font load failed');
            let cssText = await response.text();
            const baseUrl = main.replace(/result\.css$/, "");

            const style = document.createElement('style');
            style.textContent = cssText.replace(
                /url\(['"]?.\/([^'")]+)['"]?\)/g,
                `url("${baseUrl}$1")`
            );
            document.head.appendChild(style);

            // 添加全局字体样式
            GM_addStyle(`
                body {
                    font-family: "Smiley Sans Oblique", sans-serif;
                    font-weight: normal;
                }
            `);

            return true;
        } catch (error) {
            console.warn('主字体加载失败:', error);
            if (fallback) {
                try {
                    let response = await fetch(fallback, { method: "GET", mode: "cors" });
                    if (!response.ok) throw new Error('Fallback font load failed');
                    let cssText = await response.text();
                    const baseUrl = fallback.replace(/result\.css$/, "");

                    const style = document.createElement('style');
                    style.textContent = cssText.replace(
                        /url\(['"]?.\/([^'")]+)['"]?\)/g,
                        `url("${baseUrl}$1")`
                    );
                    document.head.appendChild(style);
                    return true;
                } catch (fallbackError) {
                    console.error('备用字体加载失败:', fallbackError);
                    return false;
                }
            }
            return false;
        }
    }

    // 加载字体（主URL和备用URL）
    const fontLoadedPromise = loadFontCSS(
        "https://fontsapi.zeoseven.com/92/main/result.css",
        "https://fontsapi-storage.zeoseven.com/92/main/result.css"
    );

    // 3. 创建主容器
    const mainContainer = document.createElement('div');
    mainContainer.style.display = 'flex';
    mainContainer.style.height = '100vh';
    mainContainer.style.width = '100vw';
    mainContainer.style.padding = '20px';
    mainContainer.style.boxSizing = 'border-box';
    document.body.appendChild(mainContainer);

    // 4. 创建控制面板
    const controlPanel = document.createElement('div');
    controlPanel.style.width = '300px';
    controlPanel.style.padding = '20px';
    controlPanel.style.backgroundColor = '#fff';
    controlPanel.style.borderRadius = '8px';
    controlPanel.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    controlPanel.style.marginRight = '20px';
    controlPanel.style.fontFamily = '"Smiley Sans Oblique", sans-serif';

    // 5. 创建预览面板
    const previewPanel = document.createElement('div');
    previewPanel.style.flex = '1';
    previewPanel.style.display = 'flex';
    previewPanel.style.justifyContent = 'center';
    previewPanel.style.alignItems = 'center';
    previewPanel.style.backgroundColor = '#dddddd';
    previewPanel.style.borderRadius = '8px';
    previewPanel.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    previewPanel.style.position = 'relative';
    previewPanel.style.overflow = 'hidden';

    // 6. 创建预览画布
    const previewCanvas = document.createElement('canvas');
    previewCanvas.width = 3000;
    previewCanvas.height = 2000;
    previewCanvas.style.backgroundColor = '#f8f8f8';
    previewCanvas.style.objectFit = 'contain';

    // 7. 创建控制元素
    const title = document.createElement('h2');
    title.textContent = '文字模板生成器';
    title.style.marginTop = '0';
    title.style.color = '#333';

    const textarea = document.createElement('textarea');
    textarea.style.width = '100%';
    textarea.style.height = '200px';
    textarea.style.margin = '15px 0';
    textarea.style.padding = '10px';
    textarea.style.border = '1px solid #ddd';
    textarea.style.borderRadius = '4px';
    textarea.style.fontFamily = '"Smiley Sans Oblique", sans-serif';
    textarea.placeholder = '输入文字（回车换行）';

    const generateBtn = document.createElement('button');
    generateBtn.textContent = '下载图片 (3000×2000)';
    generateBtn.style.width = '100%';
    generateBtn.style.padding = '10px';
    generateBtn.style.backgroundColor = '#1890ff';
    generateBtn.style.color = '#fff';
    generateBtn.style.border = 'none';
    generateBtn.style.borderRadius = '4px';
    generateBtn.style.cursor = 'pointer';
    generateBtn.style.fontWeight = 'normal';

    // 8. 组装UI
    controlPanel.appendChild(title);
    controlPanel.appendChild(textarea);
    controlPanel.appendChild(generateBtn);
    previewPanel.appendChild(previewCanvas);
    mainContainer.appendChild(controlPanel);
    mainContainer.appendChild(previewPanel);

    // 9. 字体加载状态检测
    let fontLoaded = false;
    fontLoadedPromise.then((success) => {
        fontLoaded = success;
        console.log(success ? '自定义字体加载成功' : '使用备用字体');
        renderPreview();
    }).catch(err => {
        console.error('字体加载错误:', err);
        renderPreview();
    });

    // 10. 渲染函数
    function renderPreview() {
        const canvas = previewCanvas;
        const ctx = canvas.getContext('2d');

        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 设置背景色
        ctx.fillStyle = '#f8f8f8';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 计算文字区域
        const textAreaWidth = canvas.width * (4/6);
        const textAreaHeight = canvas.height * (3/4);
        const startX = (canvas.width - textAreaWidth) / 2;
        const startY = (canvas.height - textAreaHeight) / 2;

        // 设置文字样式
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 处理文字
        const text = textarea.value;
        if (!text) return;

        const lines = text.split('\n').filter(line => line.trim());
        if (lines.length === 0) return;

        // 确定要使用的字体
        const fontToUse = fontLoaded ? '"Smiley Sans Oblique"' : 'sans-serif';

        // 初始字号计算 - 基于可用空间和行数
        let fontSize = Math.min(
            textAreaWidth / Math.max(...lines.map(line => line.length)) * 1.5, // 进一步增大放大系数
            (textAreaHeight / lines.length) * 0.85 // 提高高度利用率
        );

        // 检查文字是否超出范围，自动调整字号
        let textTooLarge = false;
        let attempts = 0;
        const maxAttempts = 20;

        do {
            textTooLarge = false;
            ctx.font = `normal ${fontSize}px ${fontToUse}, sans-serif`;

            // 检查每行文字宽度
            for (const line of lines) {
                const metrics = ctx.measureText(line);
                if (metrics.width > textAreaWidth * 0.95) { // 进一步放宽宽度限制
                    textTooLarge = true;
                    fontSize *= 0.99; // 更精细的调整
                    break;
                }
            }

            // 检查总高度
            const lineHeight = fontSize * 1.3;
            const totalTextHeight = lines.length * lineHeight;
            if (totalTextHeight > textAreaHeight * 0.95) { // 进一步放宽高度限制
                textTooLarge = true;
                fontSize *= 0.99;
            }

            attempts++;
        } while (textTooLarge && attempts < maxAttempts && fontSize > 10);

        // 计算行高和垂直位置
        const lineHeight = fontSize * 1.3;
        const totalTextHeight = lines.length * lineHeight;
        let y = startY + (textAreaHeight - totalTextHeight) / 2 + lineHeight/2;

        // 绘制文字
        ctx.font = `normal ${fontSize}px ${fontToUse}, sans-serif`;
        for (const line of lines) {
            ctx.fillText(line, canvas.width / 2, y);
            y += lineHeight;
        }

        // 更新预览
        const scale = Math.min(
            previewPanel.clientWidth / canvas.width * 0.9,
            previewPanel.clientHeight / canvas.height * 0.9
        );
        previewCanvas.style.transform = `scale(${scale})`;
    }

    // 11. 添加事件监听
    textarea.addEventListener('input', renderPreview);
    generateBtn.addEventListener('click', function() {
        // 生成时间戳文件名
        const now = new Date();
        const timestamp = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}_${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}${now.getSeconds().toString().padStart(2,'0')}`;
        const filename = `文字模板_${timestamp}.png`;

        // 下载图片
        const link = document.createElement('a');
        link.href = previewCanvas.toDataURL('image/png');
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 复制文件名到剪贴板
        GM_setClipboard(filename, 'text').then(function() {
            // 显示提示信息
            const originalText = generateBtn.textContent;
            generateBtn.textContent = '文件名已复制!';
            generateBtn.style.backgroundColor = '#52c41a';

            // 3秒后恢复原状
            setTimeout(function() {
                generateBtn.textContent = originalText;
                generateBtn.style.backgroundColor = '#1890ff';
            }, 3000);
        }).catch(function(err) {
            console.error('复制失败:', err);
        });
    });

    // 12. 初始渲染
    renderPreview();

    // 13. 响应式调整
    window.addEventListener('resize', function() {
        renderPreview();
    });
})();