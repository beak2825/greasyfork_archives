// ==UserScript==
// @name         【图片工具】图片链接处理工具
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  在图片信息区域添加靠右单行排列的复制和打开按钮
// @author       YourName
// @match        *://movie.mtime.com/*/posters_and_images/*
// @match        *://movie.douban.com/subject/*/photos*

// @include      *://img*.mtime.cn/*

// @grant        GM_setClipboard
// @grant        GM_openInTab
// @grant        GM_download
// @license      All rights reserved
// @downloadURL https://update.greasyfork.org/scripts/557570/%E3%80%90%E5%9B%BE%E7%89%87%E5%B7%A5%E5%85%B7%E3%80%91%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5%E5%A4%84%E7%90%86%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/557570/%E3%80%90%E5%9B%BE%E7%89%87%E5%B7%A5%E5%85%B7%E3%80%91%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5%E5%A4%84%E7%90%86%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // =============================================================================
    // 使用说明：
    // 1. 新增站点时：
    //    - 在 @match 中添加域名匹配规则
    //    - 在 siteHandlers 中添加映射关系
    //    - 编写对应的 initSiteX() 函数
    //
    // 2. 优势：
    //    - 代码结构清晰，易于维护
    //    - 各站点逻辑完全隔离
    //    - 新增站点只需最小化修改
    //
    // 3. 注意事项：
    //    - 确保域名匹配逻辑正确
    //    - 各站点的函数名要有明确区分
    //    - 添加适当的错误处理
    // =============================================================================





    // =========================================================================
    // 站点处理器映射表
    // 作用：将域名标识符映射到对应的初始化函数
    // 优点：新增站点时只需在此添加映射关系，无需修改主逻辑
    // =========================================================================
    const siteHandlers = {
        'mtime.com': initSite1, // 对应 时光网 及其子域名的处理函数
        'douban.com': initSite2, // 对应 豆瓣网 及其子域名的处理函数
        '1905.com': initSite3, // 对应 1905网 的特定处理函数

        'img5.mtime.cn': initSite4, // 对应 时光网 图片 的处理函数
        'img21.mtime.cn': initSite4,
        'img31.mtime.cn': initSite4,
    };

    // =========================================================================
    // 时光网 初始化函数
    // 功能：针对 site1.com 网站的专用逻辑
    // 执行时机：页面加载完成后自动调用
    // =========================================================================
    function initSite1() {
        console.log('🚀 初始化 Site1 专用逻辑');

        addSite1Features();

        // 可以添加更多的 site1 专用逻辑...
    }

    // =========================================================================
    // Site2 初始化函数
    // =========================================================================
    function initSite2() {
        console.log('🎯 初始化 Site2 专用逻辑');

        addSite2Features();

        // 可以添加更多的 site2 专用逻辑...
    }

    // =========================================================================
    // Site3 初始化函数
    // =========================================================================
    function initSite3() {
        console.log('✨ 初始化 Site3 子域名专用逻辑');


    }

    // =========================================================================
    // Site4 初始化函数
    // =========================================================================
    function initSite4() {
        console.log('✨ 初始化 Site4 子域名专用逻辑');

        addSite4Features();
    }

    // =========================================================================
    // 站点识别函数
    // 作用：根据当前页面的域名返回对应的站点标识符
    // 返回值：匹配 siteHandlers 中的键名，如 'site1.com'
    // =========================================================================
    function getSiteHandler() {
        // 获取当前页面的完整域名（包含子域名）
        const hostname = window.location.hostname;
        console.log(`🔍 检测到当前域名: ${hostname}`);

        // 从 siteHandlers 的键中获取所有配置的域名
        const configuredDomains = Object.keys(siteHandlers);

        // 遍历所有已配置的域名，检查是否匹配
        for (const domain of configuredDomains) {
            if (hostname.includes(domain)) {
                console.log(`✅ 匹配到配置的域名: ${domain}`);
                return domain; // 返回匹配的域名键
            }
        }

        // 如果没有匹配到任何已知站点，返回 null
        console.warn('⚠️ 未识别的域名:', hostname);
        console.log('📋 已配置的域名:', configuredDomains);
        return null;
    }



    // =========================================================================
    // 辅助函数：Site1 专用功能
    // 说明：将复杂功能拆分为独立函数，提高代码可读性
    // =========================================================================
    function addSite1Features() {
        // 添加 site1 的特定功能


        // 添加按钮到目标元素
        function addButtons() {
            const targetElements = document.querySelectorAll("#app > div > div.content.routerView.container > div.picCont > div > div.waterFull > dl > dd > div.p_item > div.p_info");

            targetElements.forEach(pInfo => {
                if (pInfo.querySelector('.img-btn-container')) return;

                // 创建按钮容器（靠右单行排列）
                const btnContainer = document.createElement('div');
                btnContainer.className = 'img-btn-container';
                btnContainer.style.cssText = `
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                margin-top: 15px;
            `;

                // 创建复制按钮
                const copyBtn = createButton('复制', '#4CAF50');
                // 创建打开按钮
                const openBtn = createButton('打开', '#2196F3');
                // 创建下载按钮
                const downBtn = createButton('下载', '#2196F3');

                // 添加按钮到容器
                btnContainer.appendChild(copyBtn);
                btnContainer.appendChild(openBtn);
                btnContainer.appendChild(downBtn);
                pInfo.appendChild(btnContainer);

                // 添加事件监听器
                copyBtn.addEventListener('click', () => handleCopy(pInfo));
                openBtn.addEventListener('click', () => handleOpen(pInfo));
                downBtn.addEventListener('click', () => handleDown(pInfo));
            });
        }

        // 创建按钮函数
        function createButton(text, color) {
            const btn = document.createElement('button');
            btn.className = 'img-action-btn';
            btn.textContent = text;
            btn.style.cssText = `
            padding: 8px 15px;
            background: ${color};
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.2s ease;
        `;

            // 添加悬停效果
            btn.addEventListener('mouseover', () => {
                btn.style.opacity = '0.9';
                btn.style.transform = 'translateY(-2px)';
            });

            btn.addEventListener('mouseout', () => {
                btn.style.opacity = '1';
                btn.style.transform = 'translateY(0)';
            });

            return btn;
        }

        // 复制到剪贴板
        function copyToClipboard(text) {

            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.top = 0;
            textArea.style.left = 0;
            textArea.style.opacity = 0;
            document.body.appendChild(textArea);
            textArea.select();

            try {
                document.execCommand('copy');
            } catch (err) {
                console.error('复制失败:', err);
                throw new Error('无法复制到剪贴板');
            } finally {
                document.body.removeChild(textArea);
            }
        }

        // 处理复制功能
        function handleCopy(pInfo) {
            try {
                const imgUrl = getModifiedUrl(pInfo);
                copyToClipboard(imgUrl);
                showNotification('链接已复制到剪贴板！');
            } catch (error) {
                console.error('复制失败:', error);
                showNotification('复制失败: ' + error.message);
            }
        }

        // 处理打开功能
        function handleOpen(pInfo) {
            try {
                const imgUrl = getModifiedUrl(pInfo);
                if (typeof GM_openInTab !== 'undefined') {
                    GM_openInTab(imgUrl, { active: true });
                } else {
                    window.open(imgUrl, '_blank');
                }
            } catch (error) {
                console.error('打开失败:', error);
                showNotification('打开失败: ' + error.message);
            }
        }

        // 处理下载功能
        function handleDown(pInfo) {
            try {
                const imgUrl = getModifiedUrl(pInfo);

                // 下载图片
                fetch(imgUrl)
                    .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.blob();
                })
                    .then(blob => {
                    // 创建下载链接
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;

                    // 从URL中提取图片名称
                    const fileName = imgUrl.split('/').pop().split('?')[0] || 'image';
                    a.download = fileName;

                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);

                    // 复制图片名称到剪贴板
                    copyToClipboard(fileName);
                })
                    .catch(error => {
                    console.error('下载失败:', error);
                });

            } catch (error) {
                console.error('处理失败:', error);
            }
        }

        // 获取修改后的图片URL
        function getModifiedUrl(pInfo) {
            const imgElement = pInfo.parentElement.querySelector('.p_img img');
            if (!imgElement) throw new Error('未找到图片元素');

            const originalUrl = imgElement.src;
            if (!originalUrl) throw new Error('图片URL为空');

            const sizeElement = pInfo.querySelector('.p_size');
            if (!sizeElement) throw new Error('未找到尺寸元素');

            const newSize = sizeElement.textContent.trim();
            if (!newSize) throw new Error('尺寸信息为空');

            // 替换URL中的尺寸部分
            if (originalUrl.includes('_1000X1000.')) {
                return originalUrl.replace('_1000X1000.', `_${newSize}.`);
            }

            const regex = /_(\d+X\d+)(?=\.\w+$)/;
            if (regex.test(originalUrl)) {
                return originalUrl.replace(regex, `_${newSize}`);
            }

            const lastDotIndex = originalUrl.lastIndexOf('.');
            if (lastDotIndex !== -1) {
                return originalUrl.substring(0, lastDotIndex) + '_' + newSize + originalUrl.substring(lastDotIndex);
            }

            return originalUrl;
        }


        // 显示通知
        function showNotification(message) {
            const existing = document.querySelector('.img-tool-notification');
            if (existing) existing.remove();

            const notification = document.createElement('div');
            notification.className = 'img-tool-notification';
            notification.textContent = message;
            notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: rgba(0, 0, 0, 0.85);
            color: white;
            border-radius: 8px;
            z-index: 9999;
            font-family: sans-serif;
            font-size: 14px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            opacity: 0;
            transform: translateY(-20px);
        `;
            document.body.appendChild(notification);

            // 显示通知
            setTimeout(() => {
                notification.style.opacity = 1;
                notification.style.transform = 'translateY(0)';
            }, 10);

            // 3秒后消失
            setTimeout(() => {
                notification.style.opacity = 0;
                notification.style.transform = 'translateY(-20px)';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        // 初始执行
        function initMtime() {
            if (document.readyState === 'complete') {
                setTimeout(addButtons, 1000);
            } else {
                window.addEventListener('load', () => setTimeout(addButtons, 1000));
            }

            // 监听DOM变化动态添加按钮
            const observer = new MutationObserver(() => addButtons());
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        // 启动脚本
        initMtime();


    }

    // =========================================================================
    // 辅助函数：Site2 专用功能
    // 说明：将复杂功能拆分为独立函数，提高代码可读性
    // =========================================================================
    function addSite2Features() {
        // 添加 site1 的特定功能


        // 添加按钮到目标元素
        function addButtons() {
            const targetElements = document.querySelectorAll("#content .article ul li");

            targetElements.forEach(pInfo => {
                if (pInfo.querySelector('.img-btn-container')) return;

                // 创建按钮容器（靠右单行排列）
                const btnContainer = document.createElement('div');
                btnContainer.className = 'img-btn-container';
                btnContainer.style.cssText = `
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                margin-top: 15px;
            `;

                // 创建复制按钮
                const copyBtn = createButton('复制', '#4CAF50');
                // 创建打开按钮
                const openBtn = createButton('打开', '#2196F3');
                // 创建下载按钮
                const downBtn = createButton('下载', '#2196F3');

                // 添加按钮到容器
                btnContainer.appendChild(copyBtn);
                btnContainer.appendChild(openBtn);
                btnContainer.appendChild(downBtn);
                pInfo.appendChild(btnContainer);

                // 添加事件监听器
                copyBtn.addEventListener('click', () => handleCopy(pInfo));
                openBtn.addEventListener('click', () => handleOpen(pInfo));
                downBtn.addEventListener('click', () => handleDown(pInfo));
            });
        }

        // 创建按钮函数
        function createButton(text, color) {
            const btn = document.createElement('button');
            btn.className = 'img-action-btn';
            btn.textContent = text;
            btn.style.cssText = `
            padding: 8px 15px;
            background: ${color};
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.2s ease;
        `;

            // 添加悬停效果
            btn.addEventListener('mouseover', () => {
                btn.style.opacity = '0.9';
                btn.style.transform = 'translateY(-2px)';
            });

            btn.addEventListener('mouseout', () => {
                btn.style.opacity = '1';
                btn.style.transform = 'translateY(0)';
            });

            return btn;
        }

        // 复制到剪贴板
        function copyToClipboard(text) {

            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.top = 0;
            textArea.style.left = 0;
            textArea.style.opacity = 0;
            document.body.appendChild(textArea);
            textArea.select();

            try {
                document.execCommand('copy');
            } catch (err) {
                console.error('复制失败:', err);
                throw new Error('无法复制到剪贴板');
            } finally {
                document.body.removeChild(textArea);
            }
        }

        // 处理复制功能
        function handleCopy(pInfo) {
            try {
                const imgUrl = getModifiedUrl(pInfo);
                copyToClipboard(imgUrl);
                showNotification('链接已复制到剪贴板！');
            } catch (error) {
                console.error('复制失败:', error);
                showNotification('复制失败: ' + error.message);
            }
        }

        // 处理打开功能
        function handleOpen(pInfo) {
            try {
                const imgUrl = getModifiedUrl(pInfo);
                if (typeof GM_openInTab !== 'undefined') {
                    GM_openInTab(imgUrl, { active: true });
                } else {
                    window.open(imgUrl, '_blank');
                }
            } catch (error) {
                console.error('打开失败:', error);
                showNotification('打开失败: ' + error.message);
            }
        }

        // 处理下载功能
        function handleDown(pInfo) {
            try {
                const imgUrl = getModifiedUrl(pInfo);

                // 从URL中提取图片名称
                const fileName = imgUrl.split('/').pop().split('?')[0] || 'image';

                // 使用GM_download下载图片（绕过CORS）
                if (typeof GM_download !== 'undefined') {
                    GM_download({
                        url: imgUrl,
                        name: fileName,
                        onload: function() {
                            // 下载完成后复制文件名
                            copyToClipboard(fileName);
                            console.log('下载完成:', fileName);
                        },
                        onerror: function(error) {
                            console.error('下载失败:', error);
                        }
                    });
                } else {
                    // 备用方案：直接打开图片链接
                    window.open(imgUrl, '_blank');
                    copyToClipboard(fileName);
                }

            } catch (error) {
                console.error('处理失败:', error);
            }
        }

        // 获取修改后的图片URL
        function getModifiedUrl(pInfo) {
            const imgElement = pInfo.querySelector('.cover a img');
            if (!imgElement) throw new Error('未找到图片元素');

            let originalUrl = imgElement.src;
            if (!originalUrl) throw new Error('图片URL为空');

            // 替换URL部分
            if (originalUrl.includes('photo/m/public')) {
                originalUrl = originalUrl.replace('photo/m/public', 'photo/xl/public');
            }
            if (originalUrl.includes('webp')) {
                originalUrl = originalUrl.replace(/\.webp/g, '.jpg');
            }

            return originalUrl;
        }


        // 显示通知
        function showNotification(message) {
            const existing = document.querySelector('.img-tool-notification');
            if (existing) existing.remove();

            const notification = document.createElement('div');
            notification.className = 'img-tool-notification';
            notification.textContent = message;
            notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: rgba(0, 0, 0, 0.85);
            color: white;
            border-radius: 8px;
            z-index: 9999;
            font-family: sans-serif;
            font-size: 14px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            opacity: 0;
            transform: translateY(-20px);
        `;
            document.body.appendChild(notification);

            // 显示通知
            setTimeout(() => {
                notification.style.opacity = 1;
                notification.style.transform = 'translateY(0)';
            }, 10);

            // 3秒后消失
            setTimeout(() => {
                notification.style.opacity = 0;
                notification.style.transform = 'translateY(-20px)';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        // 初始执行
        function initDouban() {
            if (document.readyState === 'complete') {
                setTimeout(addButtons, 1000);
            } else {
                window.addEventListener('load', () => setTimeout(addButtons, 1000));
            }

            // 监听DOM变化动态添加按钮
            const observer = new MutationObserver(() => addButtons());
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        // 启动脚本
        initDouban();


    }


    // =========================================================================
    // 辅助函数：Site4 专用功能
    // 说明：将复杂功能拆分为独立函数，提高代码可读性
    // =========================================================================
    function addSite4Features() {
        // 添加 site4 的特定功能



        // 创建主控制面板
        function createImageControlPanel() {
            const panel = document.createElement('div');
            panel.className = 'img-control-panel';
            panel.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                min-width: 200px;
                max-width: 250px;
                font-family: Arial, sans-serif;
            `;

            // 获取当前图片尺寸信息
            const currentSize = getCurrentImageSize();
            if (!currentSize) return;

            // 创建尺寸输入区域
            const sizeInputSection = createSizeInputSection(currentSize);
            panel.appendChild(sizeInputSection);

            // 创建按钮区域
            const buttonSection = createButtonSection(currentSize);
            panel.appendChild(buttonSection);

            document.body.appendChild(panel);
        }

        // 获取当前图片尺寸
        function getCurrentImageSize() {
            const url = window.location.href;
            const sizeMatch = url.match(/_(\d+)x(\d+)\.jpg$/);

            if (sizeMatch && sizeMatch.length === 3) {
                return {
                    width: parseInt(sizeMatch[1]),
                    height: parseInt(sizeMatch[2]),
                    url: url
                };
            }
            return null;
        }

        // 创建尺寸输入区域（同一行布局）
        function createSizeInputSection(currentSize) {
            const section = document.createElement('div');
            section.style.marginBottom = '15px';

            // 标题
            const title = document.createElement('div');
            title.textContent = '调整图片尺寸';
            title.style.cssText = `
                font-weight: bold;
                margin-bottom: 10px;
                color: #333;
                font-size: 14px;
            `;
            section.appendChild(title);

            // 创建同一行的容器
            const inputRow = document.createElement('div');
            inputRow.style.cssText = 'display: flex; align-items: center; gap: 8px; margin-bottom: 10px;';

            // 宽度输入
            const widthDiv = document.createElement('div');
            widthDiv.style.cssText = 'display: flex; align-items: center; flex: 1;';

            const widthLabel = document.createElement('label');
            widthLabel.textContent = '宽:';
            widthLabel.style.cssText = 'width: 25px; font-size: 12px; margin-right: 4px;';

            const widthInput = document.createElement('input');
            widthInput.type = 'number';
            widthInput.id = 'widthInput';
            widthInput.value = currentSize.width;
            widthInput.style.cssText = `
                flex: 1;
                padding: 4px 8px;
                border: 1px solid #ccc;
                border-radius: 3px;
                font-size: 12px;
                min-width: 0;
                max-width: 50px;
            `;

            widthDiv.appendChild(widthLabel);
            widthDiv.appendChild(widthInput);

            // 分隔符
            const separator = document.createElement('span');
            separator.textContent = '×';
            separator.style.cssText = 'font-size: 12px; color: #666;';

            // 高度输入
            const heightDiv = document.createElement('div');
            heightDiv.style.cssText = 'display: flex; align-items: center; flex: 1;';

            const heightLabel = document.createElement('label');
            heightLabel.textContent = '高:';
            heightLabel.style.cssText = 'width: 25px; font-size: 12px; margin-right: 4px;';

            const heightInput = document.createElement('input');
            heightInput.type = 'number';
            heightInput.id = 'heightInput';
            heightInput.value = currentSize.height;
            heightInput.style.cssText = `
                flex: 1;
                padding: 4px 8px;
                border: 1px solid #ccc;
                border-radius: 3px;
                font-size: 12px;
                min-width: 0;
                max-width: 50px;
            `;

            heightDiv.appendChild(heightLabel);
            heightDiv.appendChild(heightInput);

            // 组装到同一行
            inputRow.appendChild(widthDiv);
            inputRow.appendChild(separator);
            inputRow.appendChild(heightDiv);
            section.appendChild(inputRow);

            // 相互关联的输入逻辑
            let updating = false;

            widthInput.addEventListener('input', () => {
                if (updating) return;
                updating = true;
                const newWidth = parseInt(widthInput.value);
                if (newWidth > 0) {
                    const ratio = currentSize.height / currentSize.width;
                    heightInput.value = Math.round(newWidth * ratio);
                }
                updating = false;
            });

            heightInput.addEventListener('input', () => {
                if (updating) return;
                updating = true;
                const newHeight = parseInt(heightInput.value);
                if (newHeight > 0) {
                    const ratio = currentSize.width / currentSize.height;
                    widthInput.value = Math.round(newHeight * ratio);
                }
                updating = false;
            });

            // 存储输入框引用
            section.widthInput = widthInput;
            section.heightInput = heightInput;

            return section;
        }

        // 创建按钮区域
        function createButtonSection(currentSize) {
            const section = document.createElement('div');
            section.style.cssText = 'display: flex; flex-direction: column; gap: 8px;';



            // 按钮1：应用自定义尺寸
            const applyBtn = createButton('应用尺寸', '#4CAF50', () => {
                let widthInput = document.querySelector('#widthInput');
                let heightInput = document.querySelector('#heightInput');

                if (widthInput && heightInput) {
                    let newWidth = parseInt(widthInput.valueAsNumber);
                    let newHeight = parseInt(heightInput.valueAsNumber);

                    alert(`宽：${newWidth}，高：${newHeight}`);

                    if (newWidth > 0 && newHeight > 0) {
                        let newUrl = currentSize.url.replace(
                            /_(\d+)x(\d+)\.jpg$/,
                            `_${newWidth}x${newHeight}.jpg`
                        );
                        window.location.href = newUrl;
                    }
                }
            });
            section.appendChild(applyBtn);

            // 按钮2：2倍尺寸
            const doubleBtn = createButton('2倍尺寸', '#2196F3', () => {
                const newWidth = currentSize.width * 2;
                const newHeight = currentSize.height * 2;
                const newUrl = currentSize.url.replace(
                    /_(\d+)x(\d+)\.jpg$/,
                    `_${newWidth}x${newHeight}.jpg`
                );
                window.location.href = newUrl;
            });
            section.appendChild(doubleBtn);

            // 按钮3：下载图片
            const downloadBtn = createButton('下载图片', '#FF9800', () => {
                downloadImage(currentSize.url);
            });
            section.appendChild(downloadBtn);

            return section;
        }

        // 创建按钮的通用函数
        function createButton(text, color, onClick) {
            const btn = document.createElement('button');
            btn.className = 'img-action-btn';
            btn.textContent = text;
            btn.style.cssText = `
                padding: 8px 15px;
                background: ${color};
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                transition: all 0.2s ease;
            `;

            // 添加悬停效果
            btn.addEventListener('mouseenter', () => {
                btn.style.opacity = '0.8';
                btn.style.transform = 'translateY(-1px)';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.opacity = '1';
                btn.style.transform = 'translateY(0)';
            });

            btn.addEventListener('click', onClick);
            return btn;
        }

        // 下载图片函数
        function downloadImage(url) {
            // 提取图片文件名
            const filename = url.split('/').pop();

            // 创建下载链接
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.style.display = 'none';

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // 复制文件名到剪贴板
            copyToClipboard(filename);

            // 显示提示
            showNotification(`已下载并复制文件名: ${filename}`);
        }

        // 复制到剪贴板
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).catch(err => {
                console.error('复制失败:', err);
            });
        }

        // 显示通知
        function showNotification(message) {
            const notification = document.createElement('div');
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 10px 20px;
                border-radius: 4px;
                z-index: 10001;
                font-size: 14px;
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                document.body.removeChild(notification);
            }, 2000);
        }


        setTimeout(createImageControlPanel, 1000);

    }


    // =========================================================================
    // 主执行逻辑
    // 作用：脚本入口点，协调整个执行流程
    // 执行流程：
    // 1. 识别当前网站
    // 2. 查找对应的处理函数
    // 3. 执行站点专用逻辑
    // =========================================================================
    function main() {
        console.log('🔧 脚本开始执行...');

        try {
            // 步骤1：获取当前站点的标识符
            const siteKey = getSiteHandler();

            if (!siteKey) {
                console.log('❌ 当前站点无需处理，脚本退出');
                return;
            }

            console.log(`📍 识别到站点: ${siteKey}`);

            // 步骤2：从映射表中获取对应的处理函数
            const siteHandler = siteHandlers[siteKey];

            if (typeof siteHandler === 'function') {
                // 步骤3：执行站点专用的初始化函数
                console.log(`✅ 开始执行 ${siteKey} 的初始化逻辑`);
                siteHandler();
                console.log(`✅ ${siteKey} 初始化完成`);
            } else {
                console.error(`❌ 未找到站点 ${siteKey} 对应的处理函数`);
            }

        } catch (error) {
            // 错误处理：捕获并记录可能的异常
            console.error('💥 脚本执行出错:', error);
        }
    }

    // =========================================================================
    // 脚本启动方式
    // 说明：根据需求选择合适的启动时机
    // =========================================================================

    // 方式1：DOM加载完成后立即执行（推荐大多数情况）
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

    // 方式2：页面完全加载后执行（如果需要操作所有资源）
    // window.addEventListener('load', main);

    // 方式3：延迟执行，确保动态内容加载完成
    // setTimeout(main, 1000);

})();



