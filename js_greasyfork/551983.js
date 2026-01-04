// ==UserScript==
// @name         知乎收藏夹导出
// @namespace    https://github.com/miao
// @version      1.2.0
// @description  将知乎收藏夹导出为MarkDown文档，带有导出进度显示
// @author       miao
// @license      MIT
// @match        https://www.zhihu.com/collection/*
// @icon         data:image/gif;base64,R_o0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/551983/%E7%9F%A5%E4%B9%8E%E6%94%B6%E8%97%8F%E5%A4%B9%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/551983/%E7%9F%A5%E4%B9%8E%E6%94%B6%E8%97%8F%E5%A4%B9%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const myCollectionExport = {
        ui: {
            exportButton: null,
            progressContainer: null,
            progressBar: null,
            progressText: null
        },

        init: function() {
            this.createUI();
            this.ui.exportButton.onclick = () => this.startExport();
        },

        createUI: function() {
            const exportButton = document.createElement('button');
            exportButton.textContent = '导出为Markdown';
            Object.assign(exportButton.style, {
                position: 'fixed',
                top: '70px',
                right: '10px',
                zIndex: '1001',
                padding: '10px 15px',
                backgroundColor: '#0077FF', // 知乎蓝
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            });
            document.body.appendChild(exportButton);
            this.ui.exportButton = exportButton;

            const progressContainer = document.createElement('div');
            Object.assign(progressContainer.style, {
                position: 'fixed', top: '60px', right: '10px', zIndex: '1000', width: '200px',
                backgroundColor: '#f0f0f0', borderRadius: '5px', padding: '10px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)', display: 'none'
            });
            const progressBar = document.createElement('div');
            Object.assign(progressBar.style, {
                width: '0%', height: '10px', backgroundColor: '#2cbe60', borderRadius: '3px',
                transition: 'width 0.2s ease-in-out'
            });
            const progressText = document.createElement('span');
            progressText.textContent = '准备中...';
            Object.assign(progressText.style, {
                display: 'block', marginTop: '5px', fontSize: '12px', color: '#333', textAlign: 'center'
            });
            progressContainer.appendChild(progressBar);
            progressContainer.appendChild(progressText);
            document.body.appendChild(progressContainer);
            this.ui.progressContainer = progressContainer;
            this.ui.progressBar = progressBar;
            this.ui.progressText = progressText;
        },

        updateProgress: function(processed, total) {
            if (total === 0) return;
            const percentage = Math.min((processed / total) * 100, 100).toFixed(2);
            this.ui.progressBar.style.width = `${percentage}%`;
            this.ui.progressText.textContent = `正在导出: ${processed} / ${total} (${percentage}%)`;
        },

        startExport: async function() {
            this.ui.exportButton.disabled = true;
            this.ui.exportButton.style.opacity = '0.6';
            this.ui.exportButton.style.cursor = 'not-allowed';
            this.ui.progressContainer.style.display = 'block';
            this.updateProgress(0, 1);
            this.ui.progressText.textContent = '正在获取收藏夹信息...';

            try {
                const pathname = location.pathname;
                const matched = pathname.match(/(?<=\/collection\/)\d+/);
                const collectionId = matched ? matched[0] : "";
                if (!collectionId) throw new Error("无法获取收藏夹ID");

                const collectionTitleElement = document.querySelector('.CollectionDetailPageHeader-title');
                let collectionTitle = collectionTitleElement ? collectionTitleElement.innerText.trim() : '知乎收藏夹';
                collectionTitle = collectionTitle.replace(/[\s\r\n]+/g, ' ').replace(/生成PDF.*/, '').trim();

                const initialResponse = await fetch(`/api/v4/collections/${collectionId}/items?offset=0&limit=1`);
                if (!initialResponse.ok) throw new Error(`API请求失败: ${initialResponse.status}`);
                const initialData = await initialResponse.json();
                const totalItems = initialData.paging.totals;

                if (totalItems === 0) {
                    this.ui.progressText.textContent = '收藏夹为空，无需导出。';
                    this.resetUI(3000);
                    return;
                }

                let collectionsMarkdown = [];
                let itemsProcessed = 0;
                const limit = 20;

                for (let offset = 0; offset < totalItems; offset += limit) {
                    const response = await fetch(`/api/v4/collections/${collectionId}/items?offset=${offset}&limit=${limit}`);
                     if (!response.ok) {
                        console.warn(`在 offset ${offset} 请求失败, 状态: ${response.status}。可能会跳过此页。`);
                        continue;
                    }
                    const res = await response.json();
                    if (!res.data || res.data.length === 0) break;

                    const pageMarkdown = res.data.map(item => {
                        try {
                            const { type, url, question, content, title } = item.content;
                            const itemTitle = title || (question ? question.title : '无标题');
                            switch (type) {
                                case "zvideo":
                                    return `# 视频：${itemTitle}\n[视频链接](${url})\n`;
                                default:
                                    return `# ${itemTitle}\n[原文链接](${url})\n\n${this.convertHtmlToMarkdown(content)}\n`;
                            }
                        } catch (e) {
                            console.error(`处理项目失败: ${item.content.url}`, e);
                            return `# [处理失败] ${item.content.title || '无标题'}\n原文链接: ${item.content.url}\n\n错误信息: ${e.message}\n`;
                        }
                    });

                    collectionsMarkdown.push(...pageMarkdown);
                    itemsProcessed += res.data.length;
                    this.updateProgress(itemsProcessed, totalItems);
                }

                this.ui.progressText.textContent = '导出完成，正在生成文件...';

                const markdownContent = collectionsMarkdown.join("\n---\n\n");
                const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const safeTitle = collectionTitle.replace(/[\\/:*?"<>|]/g, '_');
                const fileName = `${safeTitle}_${itemsProcessed}个内容.md`;

                this.downloadFile(url, fileName);

            } catch (error) {
                console.error('导出过程中发生严重错误:', error);
                this.ui.progressText.textContent = `导出失败: ${error.message}`;
            } finally {
                this.resetUI(5000);
            }
        },

        // --- 核心修复：优先使用 a.click() 下载 ---
        downloadFile: function(url, fileName) {
            console.log(`准备下载文件: ${fileName}`);
            this.ui.progressText.textContent = `准备下载: ${fileName}`;

            try {
                console.log('尝试使用兼容模式 (a.click) 进行下载...');
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                this.ui.progressText.textContent = `下载已发起!`;
            } catch (e) {
                console.error(`兼容模式下载失败: ${e.message}.`);
                this.ui.progressText.textContent = '下载失败，请检查控制台！';
            } finally {
                // 无论成功与否，都延迟释放URL，确保下载有时间启动
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                    console.log(`Blob URL for ${fileName} has been revoked.`);
                }, 5000);
            }
        },

        resetUI: function(delay = 0) {
            setTimeout(() => {
                this.ui.progressContainer.style.display = 'none';
                this.ui.exportButton.disabled = false;
                this.ui.exportButton.style.opacity = '1';
                this.ui.exportButton.style.cursor = 'pointer';
            }, delay);
        },

        convertHtmlToMarkdown: function(html) {
            if (!html) return '';
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            function parseNode(node) {
                if (node.nodeType === Node.TEXT_NODE) return node.textContent;
                if (node.nodeType !== Node.ELEMENT_NODE) return '';
                let content = Array.from(node.childNodes).map(parseNode).join('');
                const tag = node.tagName.toLowerCase();
                switch (tag) {
                    case 'p': return content.trim() ? content + '\n\n' : '';
                    case 'img':
                        const src = node.getAttribute('data-original') || node.getAttribute('data-actualsrc') || node.src;
                        const fullSrc = src.startsWith('//') ? `https:${src}` : src;
                        return `![图片](${fullSrc})\n\n`;
                    case 'b': case 'strong': return `**${content}**`;
                    case 'i': case 'em': return `*${content}*`;
                    case 'blockquote': return `> ${content.replace(/\n/g, '\n> ')}\n\n`;
                    case 'a': return `[${content}](${node.href})`;
                    case 'ul': return content + '\n';
                    case 'ol':
                        const listItems = Array.from(node.children);
                        return listItems.map((li, index) => `${index + 1}. ${parseNode(li).trim()}`).join('\n') + '\n\n';
                    case 'li': return `* ${content.trim()}\n`;
                    case 'h1': return `# ${content}\n\n`;
                    case 'h2': return `## ${content}\n\n`;
                    case 'h3': return `### ${content}\n\n`;
                    case 'h4': return `#### ${content}\n\n`;
                    case 'figure': return Array.from(node.childNodes).map(parseNode).join('');
                    case 'br': return '\n';
                    case 'hr': return '---\n\n';
                    default: return content;
                }
            }
            let markdown = parseNode(tempDiv).trim();
            return markdown.replace(/\n{3,}/g, '\n\n');
        }
    };

    myCollectionExport.init();

})();