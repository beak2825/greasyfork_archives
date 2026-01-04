// ==UserScript==
// @name         又双叒叕增强
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动检测页面中的又双叒叕内容
// @author       iwpz
// @match        *://*/*
// @grant        GM_addStyle
// @license      mit
// @downloadURL https://update.greasyfork.org/scripts/553521/%E5%8F%88%E5%8F%8C%E5%8F%92%E5%8F%95%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/553521/%E5%8F%88%E5%8F%8C%E5%8F%92%E5%8F%95%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加自定义样式
    GM_addStyle(`
        .ysrz-container {
            display: flex;
            align-items: flex-start;
            margin: 5px 0;
            position: relative;
        }
        .ysrz-decoded {
            flex: 1;
            background-color: #f0f8ff;
            border: 1px solid #c3d9ff;
            border-radius: 4px;
            padding: 8px;
            min-height: 40px;
        }
        .ysrz-original-btn {
            margin-left: 8px;
            background: #4b6cb7;
            color: white;
            border: none;
            border-radius: 3px;
            padding: 5px 10px;
            font-size: 12px;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.3s;
            white-space: nowrap;
            height: fit-content;
        }
        .ysrz-original-btn:hover {
            opacity: 1;
        }
        .ysrz-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            z-index: 10000;
            justify-content: center;
            align-items: center;
        }
        .ysrz-modal-content {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            max-width: 80%;
            max-height: 80%;
            overflow: auto;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        .ysrz-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        .ysrz-modal-title {
            font-weight: bold;
            font-size: 18px;
        }
        .ysrz-modal-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #666;
        }
        .ysrz-modal-body {
            word-break: break-all;
            line-height: 1.5;
            font-family: monospace;
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 4px;
            white-space: pre-wrap;
            font-size: 16px;
        }
        .ysrz-badge {
            position: absolute;
            top: -8px;
            left: 5px;
            background: #4b6cb7;
            color: white;
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 10px;
            z-index: 1;
        }
    `);

    // 定义字符映射
    const charMap = {
        0: '又',
        1: '双',
        2: '叒',
        3: '叕'
    };

    const reverseCharMap = {
        '又': 0,
        '双': 1,
        '叒': 2,
        '叕': 3
    };

    // 解码函数
    function decodeYSRZ(encodedText) {
        // 去除所有空白字符
        const pureEncodedText = encodedText.replace(/\s/g, '');

        // 检查是否只包含又双叒叕字符
        const validChars = /^[又双叒叕]+$/;
        if (!validChars.test(pureEncodedText)) {
            return null;
        }

        try {
            // 将又双叒叕字符转换为二进制字符串
            let binaryString = '';
            for (let i = 0; i < pureEncodedText.length; i++) {
                const char = pureEncodedText[i];
                const base4Value = reverseCharMap[char];
                binaryString += base4Value.toString(2).padStart(2, '0');
            }

            // 将二进制字符串转换为字节数组
            const byteArray = [];
            for (let i = 0; i < binaryString.length; i += 8) {
                const byteString = binaryString.substr(i, 8);
                // 如果最后不足8位，忽略（可能是填充位）
                if (byteString.length === 8) {
                    byteArray.push(parseInt(byteString, 2));
                }
            }

            // 将字节数组解码为文本
            const decoder = new TextDecoder();
            const decodedString = decoder.decode(new Uint8Array(byteArray));

            return decodedString;
        } catch (error) {
            console.error('解码错误:', error);
            return null;
        }
    }

    // 判断文本是否有意义
    function isMeaningful(text) {
        if (!text) return false;

        // 检查是否包含可打印字符（排除纯控制字符）
        const hasPrintableChars = /[\p{L}\p{N}\p{P}\p{S}]/gu.test(text);
        if (!hasPrintableChars) return false;

        // 检查是否包含常见语言字符（中英日韩等）
        const hasLanguageChars = /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7afa-zA-Z]/.test(text);
        if (hasLanguageChars) return true;

        // 检查是否包含常见标点和数字
        const hasCommonSymbols = /[0-9.,!?;:'"()\[\]{}]/.test(text);

        return hasPrintableChars && (hasLanguageChars || hasCommonSymbols);
    }

    // 检查节点是否在模态框内
    function isInModal(node) {
        // 对于元素节点，使用closest方法
        if (node.nodeType === Node.ELEMENT_NODE) {
            return node.closest('.ysrz-modal') !== null;
        }
        // 对于文本节点，检查其父节点
        else if (node.nodeType === Node.TEXT_NODE && node.parentNode) {
            return node.parentNode.closest && node.parentNode.closest('.ysrz-modal') !== null;
        }
        return false;
    }

    // 创建模态框
    function createModal() {
        const modal = document.createElement('div');
        modal.className = 'ysrz-modal';
        modal.innerHTML = `
            <div class="ysrz-modal-content">
                <div class="ysrz-modal-header">
                    <div class="ysrz-modal-title">又双叒叕原文</div>
                    <button class="ysrz-modal-close">&times;</button>
                </div>
                <div class="ysrz-modal-body"></div>
            </div>
        `;

        modal.querySelector('.ysrz-modal-close').addEventListener('click', function() {
            modal.style.display = 'none';
        });

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        document.body.appendChild(modal);
        return modal;
    }

    // 显示原文模态框
    function showOriginalText(originalYSRZ) {
        let modal = document.querySelector('.ysrz-modal');
        if (!modal) {
            modal = createModal();
        }

        // 直接设置文本内容为原始的又双叒叕密文
        const modalBody = modal.querySelector('.ysrz-modal-body');

        // 使用textContent而不是innerHTML，确保只显示纯文本
        modalBody.textContent = originalYSRZ;

        modal.style.display = 'flex';

        console.log('弹窗显示内容:', originalYSRZ);
    }

    // 处理文本节点
    function processTextNode(textNode) {
        // 检查文本节点是否仍然在DOM中
        if (!textNode.parentNode) {
            return;
        }

        // 跳过模态框内的文本节点
        if (isInModal(textNode)) {
            return;
        }

        const textContent = textNode.textContent.trim();

        // 如果文本太短，可能不是编码内容
        if (textContent.length < 4) return;

        // 检查是否只包含又双叒叕字符
        const validChars = /^[又双叒叕]+$/;
        if (!validChars.test(textContent)) {
            return;
        }

        // 尝试解码
        const decodedText = decodeYSRZ(textContent);

        // 如果解码成功且有意义的文本
        if (decodedText && isMeaningful(decodedText)) {
            // 保存原始文本（又双叒叕密文）
            const originalYSRZ = textContent;

            // 创建容器
            const container = document.createElement('div');
            container.className = 'ysrz-container';

            // 添加解码后的内容区域
            const decodedContainer = document.createElement('div');
            decodedContainer.className = 'ysrz-decoded';
            decodedContainer.textContent = decodedText;

            // 添加标识徽章
            const badge = document.createElement('div');
            badge.className = 'ysrz-badge';
            badge.textContent = '已解码';
            decodedContainer.appendChild(badge);

            // 添加查看原文按钮
            const originalBtn = document.createElement('button');
            originalBtn.className = 'ysrz-original-btn';
            originalBtn.textContent = '原文';
            originalBtn.title = '查看又双叒叕原文';

            // 为按钮添加事件监听器 - 使用闭包确保传递正确的originalYSRZ
            originalBtn.addEventListener('click', (function(ysrzText) {
                return function(e) {
                    e.stopPropagation();
                    // 传递原始的又双叒叕密文
                    showOriginalText(ysrzText);
                };
            })(originalYSRZ));

            // 组装容器
            container.appendChild(decodedContainer);
            container.appendChild(originalBtn);

            // 再次检查父节点是否存在
            if (textNode.parentNode) {
                // 替换文本节点
                textNode.parentNode.replaceChild(container, textNode);
            } else {
                console.warn('文本节点没有父节点，无法替换');
            }

            console.log('检测到又双叒叕编码内容并已解码:', {
                original: originalYSRZ,
                decoded: decodedText
            });
        }
    }

    // 遍历DOM树查找文本节点
    function walkDOM(node, callback) {
        if (node.nodeType === Node.TEXT_NODE) {
            callback(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // 跳过script和style标签，以及模态框内的元素
            if (node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE' &&
                !node.classList.contains('ysrz-decoded') &&
                !node.classList.contains('ysrz-container') &&
                !isInModal(node)) { // 跳过模态框内的元素
                for (let i = 0; i < node.childNodes.length; i++) {
                    walkDOM(node.childNodes[i], callback);
                }
            }
        }
    }

    // 初始化函数
    function init() {
        console.log('又双叒叕内容检测器已启动');

        // 处理现有内容
        walkDOM(document.body, processTextNode);

        // 监听DOM变化，处理动态加载的内容
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes) {
                    mutation.addedNodes.forEach(function(node) {
                        // 跳过模态框内的元素
                        if (isInModal(node)) {
                            return;
                        }

                        if (node.nodeType === Node.ELEMENT_NODE) {
                            walkDOM(node, processTextNode);
                        } else if (node.nodeType === Node.TEXT_NODE) {
                            // 跳过模态框内的文本节点
                            if (isInModal(node)) {
                                return;
                            }

                            // 延迟处理，确保节点已完全添加到DOM中
                            setTimeout(() => {
                                if (node.parentNode) {
                                    processTextNode(node);
                                }
                            }, 0);
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();