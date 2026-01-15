// ==UserScript==
// @name         xnyy_Akso_pdf（豆包适配版）
// @namespace    http://tampermonkey.net/
// @version      202600
// @description  下载XNYY AKSO PDF（兼容豆包浏览器）
// @author       You
// @match        http://192.10.16.71/web/document/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=16.71
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562619/xnyy_Akso_pdf%EF%BC%88%E8%B1%86%E5%8C%85%E9%80%82%E9%85%8D%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/562619/xnyy_Akso_pdf%EF%BC%88%E8%B1%86%E5%8C%85%E9%80%82%E9%85%8D%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // **************************
    // 加载jspdf库
    // **************************
    function loadJSPDF() {
        return new Promise((resolve, reject) => {
            // 检查是否已加载
            if (window.jsPDF) {
                resolve();
                return;
            }

            // 创建script标签加载jspdf
            const script = document.createElement('script');
            script.src = 'https://cdn.bootcdn.net/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = () => {
                window.jsPDF = window.jspdf.jsPDF;
                resolve();
            };
            script.onerror = () => {
                reject(new Error('Failed to load jspdf'));
            };
            document.head.appendChild(script);
        });
    }

    // 兼容豆包的页面加载事件
    function waitForPageReady() {
        return new Promise(resolve => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                document.addEventListener('DOMContentLoaded', resolve);
                window.addEventListener('load', resolve);
            }
        });
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 获取总页数
    function getTotalPages() {
        try {
            // 首先尝试通过遍历导航键元素获取总页数（用户指定的方法）
            const navItems = document.querySelectorAll('.pdf-dms-layout__sidebar--pages-item');
            if (navItems.length > 0) {
                const total = navItems.length;
                console.log(`从导航键元素获取到总页数: ${total}`);
                return total;
            }

            // 查找页码标签
            const pageLabels = document.querySelectorAll('.pdf-toolbar__label');
            for (const label of pageLabels) {
                const text = label.textContent.trim();
                const match = text.match(/\/\s*(\d+)/);
                if (match) {
                    const total = parseInt(match[1]);
                    console.log(`从页面获取到总页数: ${total}`);
                    return total;
                }
            }

            // 如果找不到，查找侧边栏页面项
            //pageItems = document.querySelectorAll('.pdf-dms-layout__sidebar--pages-item');
        } catch (e) {
            console.log('获取总页数失败:', e.message);
            return 10;
        }
    }
    // 全局变量，用于存储捕获的Canvas
    let totalPages = 0; // 默认总页数，将从页面获取
    let validCanvases = [];
    //导航点击策略<5遍历和=5点击5遍历 >5遍历策略每次+8，n/8
    // 获取有效Canvas元素
    async function getValidCanvases() {
        try {
            await waitForPageReady();
            // 捕获当前页面的Canvas元素
            const canvasLayers = document.querySelectorAll('.pdf-core__canvas-layer');
            console.log(`捕获到 ${canvasLayers.length} 个 .pdf-core__canvas-layer 元素`);

            for (const layer of canvasLayers) {
                const canvas = layer.querySelector('canvas');
                if (canvas) {
                    try {
                        const imgData = canvas.toDataURL('image/jpeg', 1.0);
                        if (imgData.length > 10000) { // 简单判断是否有效
                            validCanvases.push({
                                dataURL: imgData,
                                width: canvas.width,
                                height: canvas.height
                            });
                        }
                    } catch (e) {
                        console.log('转换Canvas失败:', e.message);
                    }
                }
            }
            console.log('有效Canvas元素:', validCanvases.length);
            return validCanvases;
        } catch (e) {
            console.log('获取有效Canvas元素失败:', e.message);
            return [];
        }
    }
        async function getNewValidCanvases() {
        try {
            await waitForPageReady();
            // 捕获当前页面的Canvas元素
            await delay(1200);
            const canvasLayers = document.querySelectorAll('.pdf-core__canvas-layer');
            console.log(`捕获到 ${canvasLayers.length} 个 .pdf-core__canvas-layer 元素`);
            const canvas = canvasLayers[canvasLayers.length - 1].querySelector('canvas');
            console.log("new捕获长度"+canvas.length);
            console.log("newcanvas" + canvas.getAttribute('data-testid'));
            if (canvas) {
                try {
                    const imgData = canvas.toDataURL('image/jpeg', 1.0);
                    if (imgData.length > 10000) { // 简单判断是否有效
                        validCanvases.push({
                            dataURL: imgData,
                            width: canvas.width,
                            height: canvas.height
                        });
                    }
                } catch (e) {
                    console.log('转换Canvas失败:', e.message);
                }
            }
            console.log('有效Canvas元素:', validCanvases.length);
            return validCanvases;
        } catch (e) {
            console.log('获取有效Canvas元素失败:', e.message);
            return [];
        }
    }

    // 主逻辑
    waitForPageReady().then(async () => {
        // 创建输入框
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '请输入文件名';
        input.style.cssText = `
            position: fixed; top: 10px; left: 200px; color: red;
            z-index: 9999; padding: 4px; border: 1px solid #ccc;
            background: #fff;
        `;

        // 创建下载按钮
        const button = document.createElement('button');
        button.textContent = '文件加载完点击下载';
        button.style.cssText = `
            position: fixed; top: 10px; left: 10px; color: red;
            z-index: 9999; padding: 4px 8px; cursor: pointer;
            border: 1px solid #ccc; background: #fff;
        `;

        // 按钮点击事件
        button.addEventListener('click', async function() {
            try {
                button.disabled = true;
                button.textContent = '加载中...';

                // 校验文件名
                const fileName = input.value.trim();
                if (!fileName) {
                    alert('请输入文件名！');
                    button.disabled = false;
                    button.textContent = '文件加载完点击下载';
                    return;
                }

                // 加载jspdf库
                button.textContent = '加载PDF库...';
                await loadJSPDF();

                // 重新获取总页数和页面元素
                totalPages = getTotalPages();
                const pageItems = document.querySelectorAll('.pdf-dms-layout__sidebar--pages-item');//导航键
                console.log(`总页数: ${totalPages}, 导航项数量: ${pageItems.length}`);

                // 获取图片数据
                button.textContent = '加载页面内容...';
                // 清空之前的缓存
                validCanvases = [];
                // 1. 边界值校验（避免非法输入）
                if (!Number.isInteger(totalPages) || totalPages < 1) {
                    throw new Error('总页数必须是≥1的整数');
                }

                // 显示捕获到的页数
                const pageCount = totalPages;
                console.log(`准备导出 ${pageCount} 页`);

                if (pageCount === 0) {
                    alert('未找到可导出的页面内容！');
                    throw new Error('无有效页面内容');
                }
                if(totalPages <= 5){
                    //1-5#
                    await getValidCanvases();
                }else{
                    //1-5#
                    await getValidCanvases();
                    const maxkey = totalPages-4;
                    for (let i = 1; i < maxkey; i++) {
                            await pageItems[i].click();
                            console.log("导航键zzx" + pageItems[i].textContent);
                            await waitForPageReady();
                            await getNewValidCanvases();
                    }
                }

                // 初始化PDF
                const doc = new window.jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });

                // 逐页添加图片内容
                let successCount = 0;
                button.textContent = `生成PDF (0/${pageCount})...`;

                for (let i = 0; i < validCanvases.length; i++) {
                    // 更新状态
                    button.textContent = `生成PDF (${i+1}/${pageCount})...`;

                    const imageData = validCanvases[i];

                    // 确保imageData有效
                    if (!imageData || !imageData.dataURL) {
                        console.log(`跳过无效的页面数据: ${i+1}`);
                        continue;
                    }

                    // 等待渲染
                    await new Promise(resolve => requestAnimationFrame(resolve));

                    try {
                        // 对于第一页，直接添加内容；对于后续页面，先添加新页
                        if (i > 0) {
                            doc.addPage();
                        }

                        // 添加图片到PDF
                        doc.addImage(imageData.dataURL, 'JPEG', 5, 5, 200, 0);
                        successCount++;
                        console.log(`成功添加第 ${i+1} 页到PDF`);

                    } catch (e) {
                        console.log(`添加第 ${i+1} 页失败:`, e.message);
                        // 跳过失败的页面，继续处理其他页面
                    }
                }

                // 下载PDF
                button.textContent = '下载中...';
                doc.save(`${fileName}.pdf`);

                // 显示结果
                if (successCount >= totalPages) {
                    alert(`PDF导出成功！共 ${successCount} 页，达到目标数量。`);
                } else {
                    alert(`PDF导出成功！共 ${successCount} 页。\n注意：未达到目标${totalPages}页，可能需要检查页面加载情况。`);
                }

            } catch (error) {
                console.error('导出失败：', error);
                alert(`导出失败：${error.message}`);
            } finally {
                button.disabled = false;
                button.textContent = '文件加载完点击下载';
            }
        });

        // 追加到页面（核心：这里语法绝对正确）
        document.body.appendChild(button);
        document.body.appendChild(input);
    });

})();