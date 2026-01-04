// ==UserScript==
// @name         墨刀下载原型图片
// @namespace    http://tampermonkey.net/
// @version      2025-10-13
// @description  墨刀下载原型图片，悬浮球批量下载图片
// @author       You
// @match        https://modao.cc/proto/**/sharing*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=modao.cc
// @run-at       document-end
// @grant        none
// @require    https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @downloadURL https://update.greasyfork.org/scripts/552444/%E5%A2%A8%E5%88%80%E4%B8%8B%E8%BD%BD%E5%8E%9F%E5%9E%8B%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/552444/%E5%A2%A8%E5%88%80%E4%B8%8B%E8%BD%BD%E5%8E%9F%E5%9E%8B%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("油猴脚本(墨刀下载原型图片)：开始执行");

    // -------------------------- 1. 原生设备边框CSS（仅定义边框样式，不固定尺寸）
    const deviceNativeCSS = `
        /* 设备基础边框样式（尺寸由JS动态计算） */
        .device-frame {
            position: relative;
            display: inline-block;
            margin: 0;
            background: #fafafa;
            border-radius: 36px; /* 设备圆角（固定） */
            box-shadow: 0 0 0 1px rgba(0,0,0,.1),
                        0 0 0 12px #111, /* 设备边框宽度（固定） */
                        0 0 0 13px rgba(0,0,0,.2),
                        0 20px 15px -10px rgba(0,0,0,.15);
            overflow: hidden;
        }
        /* 设备屏幕容器（尺寸由JS动态计算，匹配原图） */
        .device-screen {
            position: absolute;
            top: 0;
            left: 0;
            margin: 0;
            border-radius: 22px; /* 屏幕圆角（固定，比设备小14px） */
            background: #fff; /* 屏幕背景 */
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center; /* 图片居中显示 */
        }

        /* -------------------------- 设备特有细节（仅影响装饰，不影响尺寸） -------------------------- */
        /* 1. iPhone X 刘海 + 圆形Home键 */
        .device-iphone-x::before {
            content: "";
            position: absolute;
            top: 0;
            left: 50%;
            width: 150px;
            height: 20px;
            margin-left: -75px;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
            background: #111;
            z-index: 10;
        }
        .device-iphone-x::after {
            content: "";
            position: absolute;
            bottom: 15px;
            left: 50%;
            width: 40px;
            height: 40px;
            margin-left: -20px;
            border-radius: 50%;
            background: #111;
            box-shadow: inset 0 0 0 2px rgba(0,0,0,.3);
            z-index: 10;
        }

        /* 2. iPhone 8 圆形Home键（无刘海） */
        .device-iphone-8::after {
            content: "";
            position: absolute;
            bottom: 15px;
            left: 50%;
            width: 40px;
            height: 40px;
            margin-left: -20px;
            border-radius: 50%;
            background: #111;
            box-shadow: inset 0 0 0 2px rgba(0,0,0,.3);
            z-index: 10;
        }

        /* 3. iPhone 8 Plus 圆形Home键（无刘海，尺寸与8一致） */
        .device-iphone-8-plus::after {
            content: "";
            position: absolute;
            bottom: 15px;
            left: 50%;
            width: 40px;
            height: 40px;
            margin-left: -20px;
            border-radius: 50%;
            background: #111;
            box-shadow: inset 0 0 0 2px rgba(0,0,0,.3);
            z-index: 10;
        }

        /* 4. iPad Pro 顶部听筒（无Home键） */
        .device-ipad-pro {
            border-radius: 48px; /* iPad 更大圆角 */
        }
        .device-ipad-pro::before {
            content: "";
            position: absolute;
            top: 20px;
            left: 50%;
            width: 180px;
            height: 20px;
            margin-left: -90px;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
            background: #111;
            z-index: 10;
        }
        .device-ipad-pro .device-screen {
            border-radius: 32px; /* iPad屏幕圆角匹配设备 */
        }

        /* 5. Samsung Galaxy S8 顶部听筒（曲面屏圆角） */
        .device-samsung-galaxy-s8 {
            border-radius: 48px; /* 三星曲面屏大圆角 */
        }
        .device-samsung-galaxy-s8::before {
            content: "";
            position: absolute;
            top: 0;
            left: 50%;
            width: 180px;
            height: 20px;
            margin-left: -90px;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
            background: #111;
            z-index: 10;
        }
        .device-samsung-galaxy-s8 .device-screen {
            border-radius: 32px; /* 屏幕圆角匹配设备 */
        }

        /* 6. Samsung Galaxy Note8（同S8样式） */
        .device-samsung-galaxy-note8 {
            border-radius: 48px;
        }
        .device-samsung-galaxy-note8::before {
            content: "";
            position: absolute;
            top: 0;
            left: 50%;
            width: 180px;
            height: 20px;
            margin-left: -90px;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
            background: #111;
            z-index: 10;
        }
        .device-samsung-galaxy-note8 .device-screen {
            border-radius: 32px;
        }
    `;

    // -------------------------- 2. 加载原生设备CSS
    function loadDeviceCSS() {
        if (document.getElementById('device-native-css')) return;
        const style = document.createElement('style');
        style.id = 'device-native-css';
        style.type = 'text/css';
        style.innerHTML = deviceNativeCSS.trim();
        document.head.appendChild(style);
        console.log("原生设备CSS已加载");
    }

    // -------------------------- 3. 核心修复：动态计算设备尺寸（适配原图，不缩小图片）
    function createDeviceContainer(deviceType, imgWidth, imgHeight) {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '-9999px'; // 隐藏在可视区外
        container.style.top = '0';
        container.style.zIndex = '99999';
        container.style.width = 'auto';
        container.style.height = 'auto';

        // 注入CSS确保样式捕获
        const innerStyle = document.createElement('style');
        innerStyle.type = 'text/css';
        innerStyle.innerHTML = deviceNativeCSS.trim();
        container.appendChild(innerStyle);

        // -------------------------- 关键：根据原图尺寸计算设备和屏幕尺寸
        const deviceBorderWidth = 12; // 设备边框宽度（对应CSS中的 0 0 0 12px #111）
        const screenPadding = 0; // 屏幕内无额外padding，避免图片被压缩

        // 1. 屏幕尺寸 = 原图尺寸（完全匹配，不缩小）
        const screenWidth = imgWidth;
        const screenHeight = imgHeight;

        // 2. 设备尺寸 = 屏幕尺寸 + 2*边框宽度（边框在屏幕外侧）
        const deviceWidth = screenWidth + 2 * deviceBorderWidth;
        const deviceHeight = screenHeight + 2 * deviceBorderWidth;

        // 创建设备主体（应用动态尺寸和设备类型样式）
        const deviceFrame = document.createElement('div');
        deviceFrame.className = `device-frame device-${deviceType}`;
        deviceFrame.style.width = `${deviceWidth}px`; // 动态宽度
        deviceFrame.style.height = `${deviceHeight}px`; // 动态高度
        deviceFrame.style.display = 'block';

        // 创建屏幕容器（尺寸匹配原图）
        const deviceScreen = document.createElement('div');
        deviceScreen.className = 'device-screen';
        deviceScreen.style.width = `${screenWidth}px`;
        deviceScreen.style.height = `${screenHeight}px`;
        // 屏幕定位：居中（设备边框宽度 = 屏幕left/top）
        deviceScreen.style.left = `${deviceBorderWidth}px`;
        deviceScreen.style.top = `${deviceBorderWidth}px`;

        deviceFrame.appendChild(deviceScreen);
        container.appendChild(deviceFrame);
        document.body.appendChild(container);

        return { container, screen: deviceScreen };
    }

    // -------------------------- 4. 生成带边框图片（图片不缩小）
    async function renderWithDeviceFrame(imgElement, deviceType) {
        // 先获取原图真实尺寸（避免使用DOM中的缩放尺寸）
        const imgNaturalWidth = imgElement.naturalWidth || imgElement.width;
        const imgNaturalHeight = imgElement.naturalHeight || imgElement.height;
        console.log(`原图尺寸：${imgNaturalWidth}x${imgNaturalHeight}`);

        // 创建设备容器（传入原图尺寸，动态适配）
        const { container, screen } = createDeviceContainer(deviceType, imgNaturalWidth, imgNaturalHeight);

        // 加载原图（保持原始尺寸）
        const img = document.createElement('img');
        img.crossOrigin = 'anonymous'; // 解决跨域
        img.src = imgElement.src;
        // 关键：不强制缩放，用max确保图片不超出屏幕（实际会完全匹配）
        img.style.maxWidth = '100%';
        img.style.maxHeight = '100%';
        img.style.objectFit = 'contain'; // 保持比例，避免拉伸
        img.style.border = 'none';
        screen.appendChild(img);

        // 等待图片加载完成
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => reject(new Error('图片加载失败'));
            setTimeout(() => reject(new Error('图片加载超时（5秒）')), 5000);
        });

        // 截图配置（确保尺寸匹配）
        const canvas = await html2canvas(container, {
            useCORS: true,
            logging: false,
            backgroundColor: null, // 透明背景
            scale: 1, // 不缩放，保持原图清晰度
            allowTaint: false,
            windowWidth: container.offsetWidth,
            windowHeight: container.offsetHeight
        });

        // 清理临时元素
        document.body.removeChild(container);

        // 返回PNG图片
        return new Promise(resolve => {
            canvas.toBlob(blob => resolve(blob), 'image/png', 0.95);
        });
    }

    // -------------------------- 5. 单张图片下载（双按钮逻辑不变）
    async function downloadImage(imgElement, withFrame) {
        if (!withFrame) {
            // 下载原图
            const link = document.createElement('a');
            link.href = imgElement.src;
            link.download = `original_${imgElement.src.split('/').pop()}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return;
        }

        // 选择设备类型
        const deviceType = prompt('请选择设备类型:\n' +
            'iphone-x\n' +
            'iphone-8\n' +
            'iphone-8-plus\n' +
            'ipad-pro\n' +
            'samsung-galaxy-s8\n' +
            'samsung-galaxy-note8', 'iphone-x');

        const validDevices = ['iphone-x', 'iphone-8', 'iphone-8-plus', 'ipad-pro', 'samsung-galaxy-s8', 'samsung-galaxy-note8'];
        if (!deviceType || !validDevices.includes(deviceType)) {
            alert('无效设备类型！请从列表中选择');
            return;
        }

        try {
            const blob = await renderWithDeviceFrame(imgElement, deviceType);
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `frame_${deviceType}_${imgElement.src.split('/').pop()}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            alert(`带边框下载失败：${err.message}`);
            console.error('错误详情：', err);
        }
    }

    // -------------------------- 6. 添加单张下载双按钮
    function addDownloadButtons() {
        const imgElements = document.querySelectorAll('.image-container .img');
        if (!imgElements.length) return false;

        imgElements.forEach(imgElement => {
            const container = imgElement.closest('.image-container');
            if (!container) return;

            if (container.querySelector('.download-original-btn') && container.querySelector('.download-framed-btn')) {
                return;
            }

            // 下载原图按钮
            const originalBtn = document.createElement('button');
            originalBtn.className = 'download-original-btn';
            originalBtn.textContent = '下载图片';
            originalBtn.style.cssText = `
                font-size: 14px;
                background: #1890ff;
                color: white;
                border: none;
                padding: 0.4rem 0.8rem;
                cursor: pointer;
                border-radius: 4px;
                margin-right: 5px;
                margin-bottom: 8px;
                z-index: 9999;
                transition: background 0.2s;
            `;
            originalBtn.addEventListener('mouseover', () => originalBtn.style.background = '#096dd9');
            originalBtn.addEventListener('mouseout', () => originalBtn.style.background = '#1890ff');
            originalBtn.addEventListener('click', () => downloadImage(imgElement, false));

            // 下载带边框按钮
            const framedBtn = document.createElement('button');
            framedBtn.className = 'download-framed-btn';
            framedBtn.textContent = '下载图片（含设备边框）';
            framedBtn.style.cssText = `
                font-size: 14px;
                background: #52c41a;
                color: white;
                border: none;
                padding: 0.4rem 0.8rem;
                cursor: pointer;
                border-radius: 4px;
                margin-bottom: 8px;
                z-index: 9999;
                transition: background 0.2s;
            `;
            framedBtn.addEventListener('mouseover', () => framedBtn.style.background = '#45a814');
            framedBtn.addEventListener('mouseout', () => framedBtn.style.background = '#52c41a');
            framedBtn.addEventListener('click', () => downloadImage(imgElement, true));

            container.insertBefore(originalBtn, container.firstChild);
            container.insertBefore(framedBtn, originalBtn.nextSibling);
        });
        console.log(`已为 ${imgElements.length} 张图片添加下载按钮`);
        return true;
    }

    // -------------------------- 7. 批量下载原图
    function batchDownloadOriginal() {
        const imgElements = document.querySelectorAll('.image-container .img');
        if (!imgElements.length) {
            alert('未找到任何图片');
            return;
        }

        alert(`即将批量下载 ${imgElements.length} 张原图（间隔300ms）`);
        imgElements.forEach((img, index) => {
            setTimeout(() => {
                const link = document.createElement('a');
                link.href = img.src;
                link.download = `original_${index + 1}_${img.src.split('/').pop()}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }, index * 300);
        });
    }

    // -------------------------- 8. 批量下载带边框
    async function batchDownloadFramed() {
        const imgElements = document.querySelectorAll('.image-container .img');
        if (!imgElements.length) {
            alert('未找到任何图片');
            return;
        }

        const deviceType = prompt('请选择设备类型:\n' +
            'iphone-x\n' +
            'iphone-8\n' +
            'iphone-8-plus\n' +
            'ipad-pro\n' +
            'samsung-galaxy-s8\n' +
            'samsung-galaxy-note8', 'iphone-x');

        const validDevices = ['iphone-x', 'iphone-8', 'iphone-8-plus', 'ipad-pro', 'samsung-galaxy-s8', 'samsung-galaxy-note8'];
        if (!deviceType || !validDevices.includes(deviceType)) {
            alert('无效设备类型！请从列表中选择');
            return;
        }

        alert(`即将批量下载 ${imgElements.length} 张带边框图片（间隔500ms）`);
        for (let i = 0; i < imgElements.length; i++) {
            try {
                const blob = await renderWithDeviceFrame(imgElements[i], deviceType);
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `frame_${deviceType}_${i + 1}_${imgElements[i].src.split('/').pop()}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                await new Promise(r => setTimeout(r, 500));
            } catch (err) {
                alert(`第 ${i + 1} 张图片失败：${err.message}`);
                console.error(`第 ${i + 1} 张错误：`, err);
            }
        }
    }

    // -------------------------- 9. 可拖动悬浮批量面板
    function createFloatingPanel() {
        if (document.getElementById('floating-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'floating-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999999;
        `;

        // 悬浮球按钮
        const toggleBtn = document.createElement('div');
        toggleBtn.textContent = '⤵';
        toggleBtn.style.cssText = `
            width: 50px;
            height: 50px;
            background: #ff4d4f;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: background 0.2s;
        `;
        toggleBtn.addEventListener('mouseover', () => toggleBtn.style.background = '#f5222d');
        toggleBtn.addEventListener('mouseout', () => toggleBtn.style.background = '#ff4d4f');

        // 批量按钮容器
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = `
            display: none;
            position: absolute;
            bottom: 60px;
            right: 0;
            flex-direction: column;
            gap: 10px;
            padding: 10px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        `;

        // 批量下载原图按钮
        const batchOriginalBtn = document.createElement('button');
        batchOriginalBtn.textContent = '批量下载原图';
        batchOriginalBtn.style.cssText = `
            background: #ff4d4f;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            white-space: nowrap;
            transition: background 0.2s;
        `;
        batchOriginalBtn.addEventListener('click', batchDownloadOriginal);

        // 批量下载带边框按钮
        const batchFramedBtn = document.createElement('button');
        batchFramedBtn.textContent = '批量下载带设备边框';
        batchFramedBtn.style.cssText = `
            background: #fa8c16;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            white-space: nowrap;
            transition: background 0.2s;
        `;
        batchFramedBtn.addEventListener('click', batchDownloadFramed);

        buttonsContainer.appendChild(batchOriginalBtn);
        buttonsContainer.appendChild(batchFramedBtn);
        panel.appendChild(toggleBtn);
        panel.appendChild(buttonsContainer);
        document.body.appendChild(panel);

        // 展开/收起切换
        toggleBtn.addEventListener('click', () => {
            buttonsContainer.style.display = buttonsContainer.style.display === 'flex' ? 'none' : 'flex';
            toggleBtn.textContent = buttonsContainer.style.display === 'flex' ? '⤴' : '⤵';
        });

        // 拖动功能
        let isDragging = false;
        let offsetX, offsetY;
        toggleBtn.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - panel.getBoundingClientRect().left;
            offsetY = e.clientY - panel.getBoundingClientRect().top;
            panel.style.cursor = 'grabbing';
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const maxX = window.innerWidth - panel.offsetWidth;
            const maxY = window.innerHeight - panel.offsetHeight;
            const x = Math.max(0, Math.min(e.clientX - offsetX, maxX));
            const y = Math.max(0, Math.min(e.clientY - offsetY, maxY));
            panel.style.left = `${x}px`;
            panel.style.top = `${y}px`;
            panel.style.bottom = 'auto';
            panel.style.right = 'auto';
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
            panel.style.cursor = 'default';
        });
    }

    // -------------------------- 10. 初始化
    loadDeviceCSS();
    createFloatingPanel();

    if (!addDownloadButtons()) {
        const observer = new MutationObserver(() => {
            if (addDownloadButtons()) {
                observer.disconnect();
                console.log("动态图片加载完成，已添加按钮");
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        console.log("监听动态加载的图片...");
    }

})();
