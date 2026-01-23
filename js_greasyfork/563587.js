// ==UserScript==
// @name         k5-zhihu-answer-extractor
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  提取知乎回答的内容(含评论）信息，转为markdown格式，便于复制到笔记软件（如obsidian，思源等）
// @author       dingzhen
// @match        https://www.zhihu.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563587/k5-zhihu-answer-extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/563587/k5-zhihu-answer-extractor.meta.js
// ==/UserScript==

/*
需要对以下兼容：
- 我的搜藏 https://www.zhihu.com/collection/786299545
- 首页推送 https://www.zhihu.com/
- 问题主页 https://www.zhihu.com/question/1996606123982214593
- 评论详情（评论的评论模态框） X
- 个人主页 https://www.zhihu.com/people/sinya-lee
 */

(function () {
    'use strict'

    // 添加提取按钮到回答项(div.AnswerItem)中
    function addExtractBtn(elDivAnswerItem) {
        // 检查是否已经添加过按钮
        if (elDivAnswerItem.querySelector('.extract-answer-btn')) return

        const actionsDiv = elDivAnswerItem.querySelector('div.ContentItem-actions')
        if (!actionsDiv) return

        // 创建提取按钮
        const extractBtn = document.createElement('button')
        extractBtn.type = 'button'
        extractBtn.className = 'Button extract-answer-btn Button--plain Button--withIcon Button--withLabel'
        extractBtn.innerHTML = '提取'

        // 插入到最前面
        actionsDiv.insertBefore(extractBtn, actionsDiv.firstChild)

        // 绑定点击事件
        extractBtn.addEventListener('click', function (e) {
            e.preventDefault()
            e.stopPropagation()

            try {
                // 查找评论容器
                const commentsContainer = elDivAnswerItem.querySelector('div.Comments-container')


                // 获取原始回答内容
                const ansData = extractAnswerData(elDivAnswerItem)


                copyToClipboard(ansData.r2)
                showResultModal(ansData)
            } catch (error) {
                console.error('提取失败:', error)
                alert('提取失败，请查看控制台了解详情')
            }
        })
    }

    // 添加按钮到每个回答的操作栏中
    function addAllExtractionButtons() {
        const answerItems = document.querySelectorAll('div.AnswerItem')

        answerItems.forEach(item => addExtractBtn(item))
    }

    // 显示结果模态框
    function showResultModal(ansData) {
        // 默认使用精简格式
        let currentContent = ansData.r2;

        // 移除已存在的模态框
        const existingModal = document.querySelector('#answer-extractor-modal')
        if (existingModal) existingModal.remove()

        // 创建遮罩
        const overlay = document.createElement('div')
        overlay.id = 'answer-extractor-overlay'
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        `

        // 创建模态框容器
        const modal = document.createElement('div')
        modal.id = 'answer-extractor-modal'
        modal.style.cssText = `
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            max-width: 80vw;
            max-height: 80vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        `

        // 创建头部
        const header = document.createElement('div')
        header.style.cssText = `
            padding: 16px;
            background: #f6f6f6;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `

        const title = document.createElement('h3')
        title.textContent = '提取结果'
        title.style.margin = '0'

        const closeBtn = document.createElement('button')
        closeBtn.innerHTML = '&times;'
        closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        `
        closeBtn.onclick = () => {
            document.body.removeChild(overlay)
        }

        header.appendChild(title)
        header.appendChild(closeBtn)

        // 创建内容区域
        const contentArea = document.createElement('div')
        contentArea.style.cssText = `
            padding: 16px;
            max-height: 60vh;
            overflow-y: auto;
            white-space: pre-wrap;
            word-break: break-word;
            font-family: monospace;
            font-size: 14px;
            line-height: 1.5;
        `
        contentArea.textContent = currentContent

        // 创建底部
        const footer = document.createElement('div')
        footer.style.cssText = `
            padding: 16px;
            background: #f6f6f6;
            border-top: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `

        // 创建格式切换区域
        const formatSection = document.createElement('div')
        formatSection.style.cssText = `
            display: flex;
            gap: 8px;
            align-items: center;
        `

        const formatLabel = document.createElement('span')
        formatLabel.textContent = '格式：'
        formatLabel.style.fontSize = '14px'

        const defaultFormatBtn = document.createElement('button')
        defaultFormatBtn.textContent = '默认格式'
        defaultFormatBtn.style.cssText = `
            padding: 6px 12px;
            background: #f0f0f0;
            color: #333;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        `

        const simpleFormatBtn = document.createElement('button')
        simpleFormatBtn.textContent = '精简格式'
        simpleFormatBtn.style.cssText = `
            padding: 6px 12px;
            background: #007acc;
            color: white;
            border: 1px solid #007acc;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        `
        const titleFormatBtn = document.createElement('button')
        titleFormatBtn.textContent = '仅标题'
        titleFormatBtn.style.cssText = `
            padding: 6px 12px;
            background: #007acc;
            color: white;
            border: 1px solid #007acc;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        `

        // 按钮点击事件
        defaultFormatBtn.onclick = () => {
            currentContent = ansData.r1;
            contentArea.textContent = currentContent;
            copyToClipboard(currentContent);

            // 更新按钮样式
            defaultFormatBtn.style.background = '#007acc';
            defaultFormatBtn.style.color = 'white';
            defaultFormatBtn.style.border = '1px solid #007acc';

            simpleFormatBtn.style.background = '#f0f0f0';
            simpleFormatBtn.style.color = '#333';
            simpleFormatBtn.style.border = '1px solid #ddd';

            titleFormatBtn.style.background = '#f0f0f0';
            titleFormatBtn.style.color = '#333';
            titleFormatBtn.style.border = '1px solid #ddd';
        }

        simpleFormatBtn.onclick = () => {
            currentContent = ansData.r2;
            contentArea.textContent = currentContent;
            copyToClipboard(currentContent);

            // 更新按钮样式
            simpleFormatBtn.style.background = '#007acc';
            simpleFormatBtn.style.color = 'white';
            simpleFormatBtn.style.border = '1px solid #007acc';

            defaultFormatBtn.style.background = '#f0f0f0';
            defaultFormatBtn.style.color = '#333';
            defaultFormatBtn.style.border = '1px solid #ddd';

            titleFormatBtn.style.background = '#f0f0f0';
            titleFormatBtn.style.color = '#333';
            titleFormatBtn.style.border = '1px solid #ddd';
        }

        titleFormatBtn.onclick = () => {
            currentContent = ansData.r3;
            contentArea.textContent = currentContent;
            copyToClipboard(currentContent);

            // 更新按钮样式
            titleFormatBtn.style.background = '#007acc';
            titleFormatBtn.style.color = 'white';
            titleFormatBtn.style.border = '1px solid #007acc';

            defaultFormatBtn.style.background = '#f0f0f0';
            defaultFormatBtn.style.color = '#333';
            defaultFormatBtn.style.border = '1px solid #ddd';

            simpleFormatBtn.style.background = '#f0f0f0';
            simpleFormatBtn.style.color = '#333';
            simpleFormatBtn.style.border = '1px solid #ddd';
        }

        formatSection.appendChild(formatLabel)
        formatSection.appendChild(defaultFormatBtn)
        formatSection.appendChild(simpleFormatBtn)
        formatSection.appendChild(titleFormatBtn)

        // 创建关闭按钮区域
        const closeSection = document.createElement('div')

        const closeModalBtn = document.createElement('button')
        closeModalBtn.textContent = '关闭'
        closeModalBtn.style.cssText = `
            padding: 8px 16px;
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `
        closeModalBtn.onclick = () => {
            document.body.removeChild(overlay)
        }

        closeSection.appendChild(closeModalBtn)

        footer.appendChild(formatSection)
        footer.appendChild(closeSection)

        modal.appendChild(header)
        modal.appendChild(contentArea)
        modal.appendChild(footer)

        overlay.appendChild(modal)
        document.body.appendChild(overlay)

        // 初始复制精简格式到剪贴板
        copyToClipboard(currentContent);

        // 点击遮罩关闭
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay)
            }
        }
    }

    // 提取回答数据
    function extractAnswerData(elDivAnswer) {
        // 1. 提取回答主题
        let title = ''
        // 1a. 尝试回答主题页的
        const titleEl = document.querySelector('h1.QuestionHeader-title')
        if (titleEl) {
            title = titleEl.textContent.trim()
        } else {
            // 1b. 尝试首页推流的
            const titleElement = elDivAnswer.querySelector('h2.ContentItem-title a')
            if (titleElement) {
                title = titleElement.textContent.trim()
            }
        }

        // 2. 提取答主昵称和URL
        let ansAuthorName = ''
        let ansAuthorUrl = ''
        const elAuthor =  elDivAnswer.querySelector('.AuthorInfo-name a.UserLink-link')
        if (elAuthor.href.includes('/people/')) {
            ansAuthorName = elAuthor.textContent.trim()
            ansAuthorUrl = elAuthor.href
        }
        // 3. 提取回答日期
        let date = ''
        const timeElement = elDivAnswer.querySelector('div.ContentItem-time a')
        if (timeElement) {
            const timeText = timeElement.textContent.trim()
            // 匹配 "发布于 2026-01-17 15:15" 或类似格式  , 转换为'26.01.17'
            const m = timeText.match(/(?:发布于|编辑于)\s+(\d{4})-(\d{2})-(\d{2})/)
            if (m) {
                date = `${m[1].substring(2)}.${m[2]}.${m[3]}`
            }
        }



        // 4. 提取回答链接
        let answerUrl = ''
        // 4a. 尝试从标题链接获取
        const titleLink = elDivAnswer.querySelector('h2.ContentItem-title a')
        if (titleLink && titleLink.href) {
            answerUrl = titleLink.href.startsWith('//') ? 'https:' + titleLink.href : titleLink.href
        } else {
            // 4b. 尝试从meta标签获取
            const urlMeta = elDivAnswer.querySelector('meta[itemprop="url"]')
            if (urlMeta && urlMeta.content) {
                answerUrl = urlMeta.content
            } else {
                // 4c. 尝试从时间链接获取
                if (timeElement && timeElement.href) {
                    answerUrl = timeElement.href.startsWith('//') ? 'https:' + timeElement.href : timeElement.href
                }
            }
        }

        // 5. 提取回答内容并转换为纯文本
        let content = ''
        const contentElement = elDivAnswer.querySelector('div.RichContent')
        if (contentElement) {
            // 获取主要内容部分
            const innerContent = contentElement.querySelector('.RichContent-inner')
            if (innerContent) {
                content = convertHtmlToMarkdownText(innerContent.cloneNode(true))
            } else {
                content = convertHtmlToMarkdownText(contentElement.cloneNode(true))
            }
        }
        const content2 = content.replace(/(\r\n|\n|\r)+/g, '\n');

        // 6. 提取回答的评论树

        // 查找评论容器
        const commentsContainer = elDivAnswer.querySelector('div.Comments-container')
        const commentsMd1 = extractMarkdownComments(commentsContainer, 1)
        const commentsMd2 = extractMarkdownComments(commentsContainer, 2)

        const template1 = `${date} [知乎](${answerUrl}) ${title} [${ansAuthorName}](${ansAuthorUrl}):
${content}
【comments】
${commentsMd1}
`

        // 格式化输出
        const template2 = ` - ${date} [知乎](${answerUrl}) ${title} [${ansAuthorName}](${ansAuthorUrl}): ${content2}
【comments】
${commentsMd2}
`
        const template3 = ` - ${date} [知乎](${answerUrl}) ${title}`

        return {
            'r1': template1,
            'r2': template2,
            'r3': template3
        }
    }


    // 每隔1秒执行一次添加按钮操作
    setInterval(addAllExtractionButtons, 1000);

    // 使用 MutationObserver 监听页面动态变化，以便为新加载的回答添加按钮
    const observer = new MutationObserver(function (mutations) {
        let shouldAddButtons = false

        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 检查新增节点或其子节点是否包含 AnswerItem
                        if (node.classList && node.classList.contains('AnswerItem')) {
                            shouldAddButtons = true
                        }
                        if (node.querySelector && node.querySelector('.AnswerItem')) {
                            shouldAddButtons = true
                        }
                    }
                })
            }
        })

        if (shouldAddButtons) {
            setTimeout(addAllExtractionButtons, 1000) // 延迟执行，确保内容完全加载
        }
    })

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    })


})()


// 提取知乎评论为Markdown格式，基于稳定的DOM结构
function extractMarkdownComments(el, mode=2) {
    if (!el) return '';

    // 获取所有评论（包含data-id属性的div）
    const topLevelComments = el.querySelectorAll('div[data-id]');
    let markdownResult = '';

    topLevelComments.forEach(comment => {
        // 基于CommentContent元素向上查找父级结构
        const contentElement = comment.querySelector('div.CommentContent');
        if (!contentElement) return;

        // 获取内容文本（处理表情图片）
        let contentText = '';
        const tempElement = contentElement.cloneNode(true);
        const images = tempElement.querySelectorAll('img');
        images.forEach(img => {
            const alt = img.getAttribute('alt') || '';
            if (alt.includes('[') && alt.includes(']')) {
                img.replaceWith(document.createTextNode(alt));
            } else {
                img.remove();
            }
        });
        contentText = tempElement.textContent.trim();

        // 向上查找作者信息
        const a = findAuthorInfo(contentElement);

        // 向上查找时间信息
        const t = findTimeAndLocInfo(contentElement);

        // 计算评论的深度
        const depth = findDepthFromCommentsContainer(comment, el);
        const lv = depth -4; // 0=一级评论，1=二级评论，2=三级评论，...
        const blank = ' '.repeat(lv * 3);
        // 构建 评论的Markdown格式
        let mdText = ''
        if (mode === 1) {
            mdText = `${blank}- ${t.time} ${t.location} [${a.name}](${a.url}): ${contentText}`
        } else {
            mdText = `${blank}- ${t.time} ${t.location} ${a.name}: ${contentText}`
        }
        markdownResult += mdText + '\n';


    });
    return markdownResult;
}

// 基于CommentContent向上查找作者信息
function findAuthorInfo(contentElement) {
    let authorName = '';
    let authorUrl = '';

    // 直接查找前一个兄弟节点
    const firstDivChild = contentElement.previousElementSibling;
    if (firstDivChild) {
        // 在第一个div子元素中查找作者链接
        const authorLink = firstDivChild.querySelector('a[href*="zhihu.com/people/"]');
        if (authorLink && authorLink.textContent.trim()) {
            authorName = authorLink.textContent.trim();
            authorUrl = authorLink.href;
        }
    }

    return {name: authorName, url: authorUrl};
}

// 基于CommentContent向上查找时间，地点信息
function findTimeAndLocInfo(contentElement) {
    let current = contentElement;
    let timeText = '';
    let locationText = '';

    // 直接查找后一个兄弟节点
    const nextDivChild = contentElement.nextElementSibling;
    if (nextDivChild) {
        // 在后一个div子元素中查找时间信息
        const spans = nextDivChild.querySelectorAll('span');
        if (spans[0]) {
            timeText = spans[0].textContent.trim();
            if (timeText.includes('前') || timeText.includes('昨')) {
                timeText = '';
            } else {
                timeText = formatDateToShort(timeText);
            }
        }
        if (spans[2]) {
            locationText = spans[2].textContent.trim();
        }
    }

    return {time: timeText, location: locationText};
}

function findDepthFromCommentsContainer(elDataId, elCont) {
    // 计算elDataId在elCont中的深度
    let depth = 0;
    let current = elDataId;
    while (current && current !== elCont) {
        depth++;
        current = current.parentElement;
    }
    return depth;
}


// 将HTML内容转换为markdown文本
function convertHtmlToMarkdownText(element) {
    // 创建副本以避免修改原始元素
    const tempElement = element.cloneNode(true);

    // 移除不需要的元素
    const unwantedSelectors = [
        '.RichContent-actions',
        '.ContentItem-time',
        '.AuthorInfo',
        'script',
        'style',
        '.CommentContent',
    ]

    unwantedSelectors.forEach(selector => {
        tempElement.querySelectorAll(selector).forEach(el => el.remove())
    })

    // 递归处理DOM节点，转换为Markdown
    function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent;
        }

        if (node.nodeType !== Node.ELEMENT_NODE) {
            return '';
        }

        const tagName = node.tagName.toLowerCase();
        let markdown = '';

        // 处理超链接
        if (tagName === 'a') {
            const href = node.getAttribute('href') || '';
            const text = getTextContent(node);
            // href是否包含zhida.zhihu
            const isContainZhida = href.includes('zhida.zhihu')
            if (href && text && !isContainZhida) {
                return `[${text}](${href})`;
            }
            return text;
        }

        // 处理标题
        if (tagName.match(/^h[1-6]$/)) {
            const level = parseInt(tagName.charAt(1));
            const text = getTextContent(node);
            return `${'#'.repeat(level)} ${text}\n\n`;
        }

        // 处理粗体
        if (tagName === 'b' || tagName === 'strong') {
            const text = getTextContent(node);
            return `**${text}**`;
        }

        // 处理斜体
        if (tagName === 'i' || tagName === 'em') {
            const text = getTextContent(node);
            return `*${text}*`;
        }

        // 处理代码
        if (tagName === 'code') {
            const text = getTextContent(node);
            return `\`${text}\``;
        }

        // 处理代码块
        if (tagName === 'pre') {
            const text = getTextContent(node);
            return `\`\`\`\n${text}\n\`\`\`\n\n`;
        }

        // 处理引用块
        if (tagName === 'blockquote') {
            const text = getTextContent(node);
            const lines = text.split('\n').map(line => `> ${line}`).join('\n');
            return `${lines}\n\n`;
        }

        // 处理无序列表
        if (tagName === 'ul') {
            const items = Array.from(node.children).map(child => {
                if (child.tagName.toLowerCase() === 'li') {
                    const text = getTextContent(child);
                    return `- ${text}`;
                }
                return '';
            }).filter(item => item);
            return `${items.join('\n')}\n\n`;
        }

        // 处理有序列表
        if (tagName === 'ol') {
            const items = Array.from(node.children).map((child, index) => {
                if (child.tagName.toLowerCase() === 'li') {
                    const text = getTextContent(child);
                    return `${index + 1}. ${text}`;
                }
                return '';
            }).filter(item => item);
            return `${items.join('\n')}\n\n`;
        }

        // 处理列表项
        if (tagName === 'li') {
            const text = getTextContent(node);
            return `${text}\n`;
        }

        // 处理块级元素（添加换行）
        const blockElements = ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'blockquote', 'pre', 'br'];
        if (blockElements.includes(tagName)) {
            // 处理子节点
            let childContent = '';
            for (const child of node.childNodes) {
                childContent += processNode(child);
            }

            if (tagName === 'br') {
                return '\n';
            }

            return `${childContent}\n`;
        }

        // 处理内联元素
        let childContent = '';
        for (const child of node.childNodes) {
            childContent += processNode(child);
        }

        return childContent;
    }

    // 获取元素的文本内容（递归处理子节点）
    function getTextContent(element) {
        let text = '';
        for (const child of element.childNodes) {
            if (child.nodeType === Node.TEXT_NODE) {
                text += child.textContent;
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                text += processNode(child);
            }
        }
        return text.trim();
    }

    // 开始处理
    let markdown = processNode(tempElement);

    // 清理多余的空行和空白
    markdown = markdown.replace(/\n{3,}/g, '\n\n');
    markdown = markdown.trim();

    return markdown;
}

// 复制到剪贴板
function copyToClipboard(text) {
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
}

// '2025-01-22'  => '25.01.22'
function formatDateToShort(dateString) {
    // 验证日期格式
    if (!dateString || typeof dateString !== 'string') {
        return dateString;
    }

    // 使用正则表达式匹配YYYY-MM-DD格式
    const dateMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (dateMatch) {
        const year = dateMatch[1].slice(-2);  // 取后两位年份
        const month = dateMatch[2];            // 月份
        const day = dateMatch[3];              // 日期

        return `${year}.${month}.${day}`;
    }

    // 如果格式不匹配，返回原字符串
    return dateString;
}
