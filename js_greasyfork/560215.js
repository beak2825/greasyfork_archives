// ==UserScript==
// @name         昵图网查看高清预览图
// @namespace    https://www.nipic.com
// @version      1.0.1
// @description  去除昵图网素材图片展示区域顶部的水印遮罩层，添加高清预览图下载功能
// @note         【免责声明】本脚本仅用于学习和研究目的，请勿用于商业用途。
// @note         使用本脚本时，请遵守昵图网的用户协议和相关法律法规。
// @note         脚本作者不对使用本脚本产生的任何后果负责，包括但不限于版权纠纷、法律责任等。
// @note         请尊重原创作者的知识产权，支持正版素材。
// @author       小张 | 个人博客：https://blog.z-l.top | 公众号“爱吃馍” | 设计导航站 ：https://dh.z-l.top | quicker账号昵称：星河城野❤
// @license      GPL-3.0
// @match        https://www.nipic.com/show/*.html
// @connect      pic.nximg.cn
// @connect      pic.ntimg.cn
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @icon         https://static.ntimg.cn/original/images/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/560215/%E6%98%B5%E5%9B%BE%E7%BD%91%E6%9F%A5%E7%9C%8B%E9%AB%98%E6%B8%85%E9%A2%84%E8%A7%88%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/560215/%E6%98%B5%E5%9B%BE%E7%BD%91%E6%9F%A5%E7%9C%8B%E9%AB%98%E6%B8%85%E9%A2%84%E8%A7%88%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 去除水印遮罩层
    function removeWatermark() {
        const watermark = document.querySelector('.watermark');
        if (watermark) {
            watermark.remove();
            console.log('昵图网水印遮罩层已移除');
        }
    }

    // 添加高清预览图下载按钮
    function addHighPreviewButton() {
        // 找到目标元素
        const picInfoBox = document.querySelector('.picinfo-box');
        if (!picInfoBox) return;

        const ulElement = picInfoBox.querySelector('ul');
        if (!ulElement) return;

        const targetLi = ulElement.querySelector('.info-item.info-item-down');
        if (!targetLi) return;

        // 检查是否已经添加过
        if (document.getElementById('highpreview')) return;

        // 获取图片URL
        const imgElement = document.querySelector('.works-img.main-image');
        if (!imgElement) return;

        const imgUrl = imgElement.src;
        
        // 创建新的li元素
        const newLi = document.createElement('li');
        newLi.className = 'info-item info-item-down';
        newLi.innerHTML = `
            <a rel="nofollow" style="background:#d11ef0!important;" id="highpreview" title="点击下载高清预览图" class="down-btn down-btn2" href="javascript:void(0);">
                <span class="ico ico-down"></span>
                <span>高清预览图</span>
            </a>
        `;

        // 添加到目标li后面
        targetLi.after(newLi);
        
        // 添加下载事件
        const downloadBtn = document.getElementById('highpreview');
        downloadBtn.addEventListener('click', () => {
            // 获取页面标题作为文件名
            let fileTitle = 'nipic-preview';
            const titleElement = document.querySelector('.works-show-box h1.works-show-title');
            if (titleElement) {
                fileTitle = titleElement.textContent.trim();
                // 清理文件名，移除特殊字符
                fileTitle = fileTitle.replace(/[^\w\u4e00-\u9fa5.-]/g, '_');
            }
            
            // 提取文件扩展名
            const fileExt = imgUrl.split('.').pop() || 'jpg';
            const fileName = `${fileTitle}.${fileExt}`;
            
            try {
                // 使用GM_xmlhttpRequest绕过CORS限制
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: imgUrl,
                    responseType: 'blob',
                    onload: function(response) {
                        if (response.status === 200) {
                            // 创建下载链接
                            const blob = response.response;
                            const downloadUrl = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = downloadUrl;
                            a.download = fileName;
                            
                            // 触发下载
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            
                            // 释放URL对象
                            URL.revokeObjectURL(downloadUrl);
                            
                            console.log('高清预览图下载已触发');
                        } else {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                    },
                    onerror: function(error) {
                        console.error('下载失败:', error);
                        alert('下载失败，请重试');
                    }
                });
            } catch (error) {
                console.error('下载失败:', error);
                alert('下载失败，请重试');
            }
        });
        
        console.log('高清预览图按钮已添加');
    }

    // 初始加载时执行
    function init() {
        removeWatermark();
        addHighPreviewButton();
    }

    // 初始加载时执行
    init();

    // 监听页面变化，处理动态加载的内容
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                removeWatermark();
                addHighPreviewButton();
            }
        });
    });

    // 观察包含水印和下载按钮的父元素
    const targetNodes = [
        document.querySelector('.works-img')?.parentElement,
        document.querySelector('.picinfo-box')
    ];

    targetNodes.forEach(node => {
        if (node) {
            observer.observe(node, {
                childList: true,
                subtree: true
            });
        }
    });

    
})();