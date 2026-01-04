// ==UserScript==
// @name         微信公众号编辑器HTML工具
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  在微信公众号编辑器中添加HTML代码查看和编辑功能
// @author       liudonghua123
// @match        https://mp.weixin.qq.com/cgi-bin/appmsg*
// @grant        none
// @require      https://unpkg.com/zepto@1.2.0/dist/zepto.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs/loader.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548932/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E7%BC%96%E8%BE%91%E5%99%A8HTML%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/548932/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E7%BC%96%E8%BE%91%E5%99%A8HTML%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    console.info(`微信公众号编辑器HTML工具`);
    // 等待编辑器加载完成
    async function waitForEditor() {
        return new Promise((resolve) => {
            console.log('微信公众号HTML工具: 等待编辑器加载...');
            const checkEditor = setInterval(() => {
                if (window.__MP_Editor_JSAPI__) {
                    clearInterval(checkEditor);
                    console.log('微信公众号HTML工具: 编辑器已加载');
                    resolve();
                }
            }, 1000);
        });
    }

    async function waitForToolbar() {
        return new Promise((resolve) => {
            console.log('微信公众号HTML工具: 等待工具栏加载...');
            const checkToolbar = setInterval(() => {
                const toolbar = document.querySelector('.edui-toolbar.edui-toolbar-primary');
                if (toolbar) {
                    clearInterval(checkToolbar);
                    console.log('微信公众号HTML工具: 工具栏已加载');
                    resolve(toolbar);
                }
            }, 500);
        });
    }

    // 监听工具栏变化，确保按钮始终存在
    function observeToolbar(toolbar) {
        // 清除现有的观察器
        if (window.htmlToolObserver) {
            window.htmlToolObserver.disconnect();
        }

        const observer = new MutationObserver((mutations) => {
            // 检查按钮是否已存在
            const existingButton = toolbar.querySelector('.edui-for-htmlcode');
            if (!existingButton) {
                console.log('微信公众号HTML工具: 检测到工具栏变化，重新添加HTML按钮');
                addHTMLButton(toolbar);
            }
        });

        observer.observe(toolbar, {
            childList: true,
            subtree: true
        });

        // 保存观察器引用，防止被垃圾回收
        window.htmlToolObserver = observer;

        // 定期检查按钮是否存在（备用机制）
        const interval = setInterval(() => {
            const existingButton = toolbar.querySelector('.edui-for-htmlcode');
            if (!existingButton) {
                console.log('微信公众号HTML工具: 定期检查发现按钮缺失，重新添加HTML按钮');
                addHTMLButton(toolbar);
            }
        }, 2000);

        // 保存定时器引用
        window.htmlToolInterval = interval;
    }

    // 页面可见性变化时检查按钮
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            // 页面变为可见时，延迟检查按钮
            setTimeout(() => {
                checkAndAddButton();
            }, 500);
        }
    });

    // 窗口焦点变化时检查按钮
    window.addEventListener('focus', () => {
        setTimeout(() => {
            checkAndAddButton();
        }, 500);
    });

    // 检查并添加按钮的通用函数
    async function checkAndAddButton() {
        try {
            const toolbar = await waitForToolbar();
            const existingButton = toolbar.querySelector('.edui-for-htmlcode');
            if (!existingButton) {
                console.log('微信公众号HTML工具: 检查发现按钮缺失，重新添加HTML按钮');
                addHTMLButton(toolbar);
            }
        } catch (error) {
            console.error('微信公众号HTML工具: 检查按钮失败', error);
        }
    }

    async function initHTMLTool() {
        try {
            await waitForEditor();
            const toolbar = await waitForToolbar();
            addHTMLButton(toolbar);
            observeToolbar(toolbar);

            // 定期重新检查工具栏（防止观察器失效）
            setInterval(async () => {
                try {
                    const currentToolbar = await waitForToolbar();
                    const existingButton = currentToolbar.querySelector('.edui-for-htmlcode');
                    if (!existingButton) {
                        console.log('微信公众号HTML工具: 定期重新检查发现按钮缺失，重新添加HTML按钮');
                        addHTMLButton(currentToolbar);
                        // 重新绑定观察器
                        observeToolbar(currentToolbar);
                    }
                } catch (error) {
                    console.error('微信公众号HTML工具: 定期检查失败', error);
                }
            }, 5000);
        } catch (error) {
            console.error('微信公众号HTML工具: 初始化失败', error);
            createNotification('工具初始化失败: ' + error.message, 'error');
        }
    }

    function addHTMLButton(toolbar) {
        // 检查按钮是否已存在
        const existingButton = toolbar.querySelector('.edui-for-htmlcode');
        if (existingButton) {
            console.log('微信公众号HTML工具: HTML按钮已存在，无需重复添加');
            return;
        }

        // 创建HTML按钮
        const htmlButton = document.createElement('div');
        htmlButton.className = 'edui-box edui-button edui-default edui-for-htmlcode';
        htmlButton.innerHTML = `
            <div data-tooltip="HTML代码" class="js_tooltip edui-default">
                <div class="edui-button-wrap edui-default">
                    <div class="edui-box edui-button-body edui-default">
                        <div class="edui-box edui-icon edui-default" style="font-size: 16px; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
                            <span>📄</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 添加到工具栏末尾
        toolbar.appendChild(htmlButton);

        // 绑定点击事件
        htmlButton.addEventListener('click', showHTMLDialog);

        // 创建一键整理图片按钮
        const formatImageButton = document.createElement('div');
        formatImageButton.className = 'edui-box edui-button edui-default edui-for-formatimage';
        formatImageButton.innerHTML = `
            <div data-tooltip="一键整理图片" class="js_tooltip edui-default">
                <div class="edui-button-wrap edui-default">
                    <div class="edui-box edui-button-body edui-default">
                        <div class="edui-box edui-icon edui-default" style="font-size: 16px; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
                            <span>🖼️</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 添加到HTML按钮右边
        toolbar.appendChild(formatImageButton);

        // 绑定点击事件
        formatImageButton.addEventListener('click', formatImages);

        console.log('微信公众号HTML工具: HTML按钮和一键整理图片按钮添加成功');
    }

    async function getEditorContent() {
        return new Promise((resolve, reject) => {
            window.__MP_Editor_JSAPI__.invoke({
                apiName: 'mp_editor_get_content',
                sucCb: (res) => {
                    console.log('微信公众号HTML工具: 获取内容成功', res);
                    resolve(res.content);
                },
                errCb: (err) => {
                    console.error('微信公众号HTML工具: 获取内容失败', err);
                    reject(err);
                }
            });
        });
    }

    async function setEditorContent(content) {
        return new Promise((resolve, reject) => {
            window.__MP_Editor_JSAPI__.invoke({
                apiName: 'mp_editor_set_content',
                apiParam: {
                    content: content
                },
                sucCb: (res) => {
                    console.log('微信公众号HTML工具: 设置内容成功', res);
                    resolve(res);
                },
                errCb: (err) => {
                    console.error('微信公众号HTML工具: 设置内容失败', err);
                    reject(err);
                }
            });
        });
    }

    async function loadMonaco() {
        return new Promise((resolve, reject) => {
            if (window.monaco) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs/loader.min.js';
            script.onload = () => {
                require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs' }});
                require(['vs/editor/editor.main'], () => {
                    resolve();
                }, reject);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async function showHTMLDialog() {
        try {
            // 获取当前HTML内容
            const content = await getEditorContent();

            // 创建对话框
            const dialog = document.createElement('div');
            dialog.id = 'html-editor-dialog';
            dialog.innerHTML = `
                <div class="html-editor-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999;"></div>
                <div class="html-editor-container" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80%; height: 70%; background: white; border-radius: 8px; z-index: 10000; display: flex; flex-direction: column; box-shadow: 0 4px 20px rgba(0,0,0,0.15); border: 1px solid #e0e0e0;">
                    <div class="html-editor-header" style="padding: 16px; border-bottom: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center; background: #f8f8f8; border-radius: 8px 8px 0 0;">
                        <h3 style="margin: 0; font-weight: 500; color: #333;">HTML代码编辑器</h3>
                        <div style="display: flex; gap: 8px;">
                            <button class="html-editor-maximize" style="background: none; border: none; font-size: 16px; cursor: pointer; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;" title="最大化">□</button>
                            <button class="html-editor-close" style="background: none; border: none; font-size: 24px; cursor: pointer; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">×</button>
                        </div>
                    </div>
                    <div class="html-editor-body" style="flex: 1; padding: 0; overflow: hidden;">
                        <div id="monaco-editor" style="width: 100%; height: 100%;"></div>
                    </div>
                    <div class="html-editor-footer" style="padding: 16px; border-top: 1px solid #e0e0e0; display: flex; justify-content: flex-end; gap: 12px; background: #f8f8f8; border-radius: 0 0 8px 8px;">
                        <button id="format-btn" style="padding: 8px 16px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; font-size: 14px;">格式化</button>
                        <button id="save-btn" style="padding: 8px 16px; background: #07c160; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">保存</button>
                    </div>
                </div>
            `;

            // 添加到页面
            document.body.appendChild(dialog);

            // 加载Monaco Editor
            await loadMonaco();

            // 初始化Monaco Editor
            const editor = monaco.editor.create(document.getElementById('monaco-editor'), {
                value: content || '',
                language: 'html',
                theme: 'vs-light',
                automaticLayout: true,
                minimap: {
                    enabled: true
                },
                fontSize: 14,
                scrollBeyondLastLine: false,
                wordWrap: 'on'
            });

            // 保存编辑器实例到对话框上，方便后续访问
            dialog.editorInstance = editor;

            // 绑定事件
            dialog.querySelector('.html-editor-close').addEventListener('click', () => {
                editor.dispose();
                document.body.removeChild(dialog);
            });

            dialog.querySelector('.html-editor-overlay').addEventListener('click', () => {
                editor.dispose();
                document.body.removeChild(dialog);
            });

            // 最大化功能
            let isMaximized = false;
            const container = dialog.querySelector('.html-editor-container');
            const maximizeBtn = dialog.querySelector('.html-editor-maximize');

            maximizeBtn.addEventListener('click', () => {
                if (isMaximized) {
                    // 恢复原状
                    container.style.width = '80%';
                    container.style.height = '70%';
                    container.style.top = '50%';
                    container.style.left = '50%';
                    container.style.transform = 'translate(-50%, -50%)';
                    maximizeBtn.textContent = '□';
                    maximizeBtn.title = '最大化';
                    isMaximized = false;
                } else {
                    // 最大化
                    container.style.width = '95%';
                    container.style.height = '90%';
                    container.style.top = '5%';
                    container.style.left = '2.5%';
                    container.style.transform = 'none';
                    maximizeBtn.textContent = '❐';
                    maximizeBtn.title = '恢复';
                    isMaximized = true;
                }
                // 通知编辑器重新布局
                setTimeout(() => editor.layout(), 100);
            });

            // 格式化功能
            dialog.querySelector('#format-btn').addEventListener('click', () => {
                const currentValue = editor.getValue();
                // 简单的HTML格式化
                let formatted = currentValue.replace(/></g, '>\n<');
                editor.setValue(formatted);
            });

            // 保存功能
            dialog.querySelector('#save-btn').addEventListener('click', async () => {
                const html = editor.getValue();
                try {
                    await setEditorContent(html);
                    createNotification('保存成功', 'success');
                } catch (e) {
                    console.error('微信公众号HTML工具: 保存失败', e);
                    createNotification('保存失败: ' + e.message, 'error');
                }
            });
        } catch (error) {
            console.error('微信公众号HTML工具: 显示对话框失败', error);
            createNotification('获取内容失败: ' + error.message, 'error');
        }
    }

    // 创建通知banner
    function createNotification(message, type = 'info') {
        // 移除现有的通知
        const existingNotification = document.getElementById('html-editor-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.id = 'html-editor-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            border-radius: 4px;
            color: white;
            font-size: 14px;
            z-index: 10001;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: opacity 0.3s ease-in-out;
            max-width: 80%;
            text-align: center;
        `;

        // 根据类型设置样式
        switch (type) {
            case 'success':
                notification.style.backgroundColor = '#07c160';
                break;
            case 'error':
                notification.style.backgroundColor = '#fa5151';
                break;
            case 'warning':
                notification.style.backgroundColor = '#ffc300';
                notification.style.color = '#333';
                break;
            default:
                notification.style.backgroundColor = '#000000';
        }

        notification.textContent = message;
        document.body.appendChild(notification);

        // 3秒后自动移除
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.opacity = '0';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 3000);

        return notification;
    }

    // 一键整理图片功能
    async function formatImages() {
        try {
            // 获取当前HTML内容
            const content = await getEditorContent();

            // 处理HTML内容
            let formattedContent = content;

            // 统计修改数量
            let imgModifiedCount = 0;
            let sectionRemovedCount = 0;

            // 2.1 找到在<section style="text-align: center;" nodeleaf=""> </section> 中的 带有class="rich_pages wxw-img" 没有 style的 img，添加样式
            formattedContent = formattedContent.replace(
                /(<section style="text-align: center;" nodeleaf="">)([\s\S]*?)(<\/section>)/g,
                (sectionMatch, openTag, content, closeTag) => {
                    // 处理section中的img标签
                    const processedContent = content.replace(
                        /<img(?![^>]*style="[^"]*border-radius[^"]*")([^>]*class="rich_pages wxw-img"[^>]*>)/g,
                        (imgMatch, imgTag) => {
                            imgModifiedCount++;
                            return `<img style="border-radius: 9px;box-shadow: rgb(210, 210, 210) 0px 0px 0.5em 0px;background-color: transparent;"${imgTag}`;
                        }
                    );
                    return openTag + processedContent + closeTag;
                }
            );

            // 2.2 删除可能的<section ...><figure ...><span leaf=""><br ...></span>...</figure></section>
            const removeSectionRegex = /<section[^>]*?><figure[^>]*?><span leaf=""><br[^>]*?><\/span>(<figcaption[^>]*?>.*?<\/figcaption>)?<\/figure><\/section>/g;
            let removeSectionMatch;
            while ((removeSectionMatch = removeSectionRegex.exec(formattedContent)) !== null) {
                sectionRemovedCount++;
            }
            formattedContent = formattedContent.replace(removeSectionRegex, '');

            // 2.3 删除可能的<figcaption ...><span leaf=""><br ...></span></figcaption>
            const removeBlankRegex = /<figcaption[^>]*?><span leaf=""><br[^>]*?><\/span><\/figcaption>/g;
            let removeBlankMatch;
            while ((removeBlankMatch = removeBlankRegex.exec(formattedContent)) !== null) {
                sectionRemovedCount++;
            }
            formattedContent = formattedContent.replace(removeBlankRegex, '');

            // 2.4 设置 table img 的 width/height
            const context = Zepto(`<div>${formattedContent}</div>`);
            Zepto('table img', context).css({ 'width': '200px !important', 'height': '200px !important' });
            console.info(`Zepto('table img', context)[0].style.width: ${Zepto('table img', context)[0].style.width}`);
            formattedContent = context.prop('innerHTML');

            // 设置处理后的内容
            await setEditorContent(formattedContent);
            createNotification(`图片整理完成，修改了 ${imgModifiedCount} 处图片，删除了 ${sectionRemovedCount} 处多余内容`, 'success');
        } catch (error) {
            console.error('微信公众号HTML工具: 图片整理失败', error);
            createNotification('图片整理失败: ' + error.message, 'error');
        }
    }


    await initHTMLTool();
})();