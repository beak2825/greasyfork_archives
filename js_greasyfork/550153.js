// ==UserScript==
// @name         DoubanCommentDelete
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Delete your comments in group posts
// @author       HouBo
// @match        *://www.douban.com/group/topic/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/550153/DoubanCommentDelete.user.js
// @updateURL https://update.greasyfork.org/scripts/550153/DoubanCommentDelete.meta.js
// ==/UserScript==

;(async () => {
    'use strict';

    // —— 工具函数 ——
    function getCk() {
        const match = document.cookie.match(/(?:^|; )ck=([^;]+)/);
        return match ? match[1] : '';
    }

    function logToUI(text, type = 'info') {
        const colorMap = {
            info: '#1890ff',
            success: '#52c41a',
            warn: '#faad14',
            error: '#f5222d'
        };
        const log = document.createElement('div');
        log.textContent = text;
        Object.assign(log.style, {
            fontSize: '14px',
            padding: '4px 0',
            color: colorMap[type] || '#000'
        });
        logContainer.appendChild(log);
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    function createButton(text, style, handler) {
        const btn = document.createElement('a');
        btn.href = 'javascript:void(0)';
        btn.textContent = text;
        Object.assign(btn.style, {
            padding: '6px 10px',
            margin: '0 4px',
            borderRadius: '4px',
            fontSize: '14px',
            textDecoration: 'none',
            cursor: 'pointer',
            ...style
        });
        btn.addEventListener('click', handler);
        return btn;
    }

    // —— 获取或输入用户 ID ——
    async function fetchOrPromptUserId() {
        let stored = await GM_getValue('userId', null);
        if (!stored) {
            const input = prompt('请输入你的用户 ID（可在个人主页 URL 中找到）：');
            if (input && input.trim()) {
                await GM_setValue('userId', input.trim());
                return input.trim();
            }
            return null;
        }
        return stored;
    }

    const userId = await fetchOrPromptUserId();
    if (!userId) {
        alert('未输入用户 ID，脚本已停止。');
        return;
    }

    GM_registerMenuCommand('修改用户 ID', async () => {
        const newId = prompt('重新输入你的用户 ID：', userId || '');
        if (newId && newId.trim()) {
            await GM_setValue('userId', newId.trim());
            location.reload();
        }
    });

    // 显示当前 ID
    const idBox = document.createElement('div');
    idBox.textContent = `当前用户 ID: ${userId}`;
    Object.assign(idBox.style, {
        position: 'fixed',
        bottom: '10px',
        left: '10px',
        padding: '8px 12px',
        background: 'rgba(0,0,0,0.7)',
        color: '#fff',
        borderRadius: '6px',
        fontSize: '14px',
        zIndex: 9999,
        fontFamily: 'monospace'
    });
    document.body.appendChild(idBox);

    // —— 初始化变量 ——
    const tid = location.href.match(/topic\/(\d+)\//)?.[1];
    if (!tid) {
        console.error('无法提取话题 ID');
        return;
    }

    const ck = getCk();
    if (!ck) {
        alert('未获取到 ck（登录凭证），请重新登录豆瓣后重试。');
        return;
    }

    const topicAdminOpts = $('.topic-admin-opts')[0];
    if (!topicAdminOpts) {
        console.error('找不到操作区域');
        return;
    }

    // —— 创建控制面板 ——
    const controlPanel = document.createElement('div');
    controlPanel.innerHTML = `
        <div style="margin: 12px 0; padding: 12px; border: 1px solid #e8e8e8; border-radius: 8px; background: #fafafa; font-family: Arial, sans-serif;">
            <h3 style="margin: 0 0 10px; color: #333;">自动删除我的评论</h3>
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                <label style="font-weight:bold; color:#333;">起始页：</label>
                <input type="number" id="page-start-input" value="1" min="1" style="width: 60px; padding: 4px; border: 1px solid #ccc; border-radius: 4px;">
                <div id="progress-bar" style="flex: 1; height: 6px; background: #eee; border-radius: 3px; overflow: hidden; display: none;">
                    <div id="progress-fill" style="height: 100%; width: 0%; background: #1890ff; transition: width 0.3s;"></div>
                </div>
            </div>
            <div id="button-container" style="margin-top: 10px;"></div>
            <div id="log-container" style="max-height: 200px; overflow-y: auto; margin-top: 10px; font-size: 14px; color: #555; line-height: 1.5;"></div>
        </div>
    `;
    topicAdminOpts.appendChild(controlPanel);

    const progressBar = document.getElementById('progress-bar');
    const progressFill = document.getElementById('progress-fill');
    const buttonContainer = document.getElementById('button-container');
    const logContainer = document.getElementById('log-container');

    let isRunning = false;
    let isPaused = false;
    let totalDeleted = 0;
    let currentPage = 1;
    let totalPages = null;

    // —— 控制按钮 ——
    const startBtn = createButton('▶️ 开始删除', { background: '#1890ff', color: 'white' }, startDeletion);
    const pauseBtn = createButton('⏸️ 暂停', { background: '#faad14', color: 'white', display: 'none' }, () => { isPaused = true; pauseBtn.style.display = 'none'; resumeBtn.style.display = 'inline-block'; logToUI('⏸️ 已暂停，点击“继续”恢复。', 'warn'); });
    const resumeBtn = createButton('▶️ 继续', { background: '#52c41a', color: 'white', display: 'none' }, () => { isPaused = false; resumeBtn.style.display = 'none'; pauseBtn.style.display = 'inline-block'; });
    const stopBtn = createButton('⏹️ 停止', { background: '#f5222d', color: 'white' }, () => {
        isRunning = false;
        isPaused = false;
        logToUI(`⏹️ 已停止。共删除 ${totalDeleted} 条评论。`, 'warn');
        updateButtons(false);
    });

    buttonContainer.appendChild(startBtn);
    buttonContainer.appendChild(pauseBtn);
    buttonContainer.appendChild(resumeBtn);
    buttonContainer.appendChild(stopBtn);

    function updateButtons(running) {
        startBtn.style.display = running ? 'none' : 'inline-block';
        pauseBtn.style.display = running && !isPaused ? 'inline-block' : 'none';
        resumeBtn.style.display = running && isPaused ? 'inline-block' : 'none';
        stopBtn.style.display = running ? 'inline-block' : 'none';
    }

    // —— 延迟函数 ——
    function randomDelay(min = 800, max = 1500) {
        return new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));
    }

    // —— 删除单条评论（带重试）——
    async function delComment(commentElement) {
        const cid = $(commentElement).data('cid');
        const content = $(commentElement).find('.markdown').text().trim().substring(0, 25);

        for (let i = 0; i < 3; i++) {
            try {
                await $.post(`/j/group/topic/${tid}/remove_comment`, { ck, cid });
                totalDeleted++;
                logToUI(`成功删除："${content}"`, 'success');
                return true;
            } catch (err) {
                if (i === 2) {
                    logToUI(`删除失败（重试3次）："${content}"`, 'error');
                    return false;
                }
                await randomDelay(1000, 2000);
            }
        }
    }

    // —— 删除当前页所有自己的评论 ——
    async function delPageComment() {
        const comments = $('.topic-reply li');
        const myComments = Array.from(comments).filter(el => $(el).data('author-id') == userId);

        if (myComments.length === 0) {
            logToUI(`🔍 第 ${currentPage} 页：未找到属于你的评论。`);
            return;
        }

        logToUI(`🔍 第 ${currentPage} 页：发现 ${myComments.length} 条属于你的评论，开始删除...`);

        for (const comment of myComments) {
            if (!isRunning || isPaused) break;
            await delComment(comment);
            await randomDelay();
        }
    }

    // —— 跳转下一页 ——
    async function gotoNextPage() {
        const nextLink = $('a:contains("后页")').attr('href');
        if (!nextLink) return false;

        try {
            const data = await $.ajax({ url: nextLink, method: 'GET' });
            const $newDom = $('<div>').html(data);

            $('#comments').html($newDom.find('#comments').html());
            $('#popular-comments, h3:contains("最赞回应")').remove();
            $('.paginator').html($newDom.find('.paginator').html());

            currentPage++;
            updateProgress();
            return true;
        } catch (e) {
            logToUI('❌ 加载下一页失败', 'error');
            return false;
        }
    }

    // —— 更新进度条 ——
    function updateProgress() {
        const percent = totalPages ? Math.round((currentPage / totalPages) * 100) : 0;
        progressFill.style.width = `${Math.min(percent, 100)}%`;
    }

    // —— 主删除流程 ——
    async function startDeletion() {
        const startPageInput = document.getElementById('page-start-input').value;
        const startPage = Math.max(1, parseInt(startPageInput, 10) || 1);

        isRunning = true;
        isPaused = false;
        totalDeleted = 0;
        currentPage = startPage;
        updateButtons(true);
        logContainer.innerHTML = '';
        progressBar.style.display = 'block';
        progressFill.style.width = '0%';

        logToUI(`🚀 开始从第 ${startPage} 页删除评论...`, 'info');

        try {
            await goToPage(startPage);
            updateProgress();

            while (isRunning) {
                if (isPaused) {
                    await new Promise(resolve => {
                        const check = () => isPaused && isRunning ? setTimeout(check, 500) : resolve();
                        check();
                    });
                }

                await delPageComment();
                const hasNext = await gotoNextPage();
                if (!hasNext) {
                    logToUI('已到最后一页，删除完成！', 'success');
                    break;
                }
            }
        } catch (e) {
            logToUI(`❌ 发生错误: ${e.message}`, 'error');
        } finally {
            if (isRunning) {
                logToUI(`✅ 全部完成！共删除 ${totalDeleted} 条评论。`, 'success');
            }
            isRunning = false;
            updateButtons(false);
        }
    }

    // —— 跳转到指定页 ——
    function goToPage(pageNum) {
        if (pageNum === 1) {
            $('#popular-comments, h3:contains("最赞回应")').remove();
            return Promise.resolve();
        }

        const url = `/group/topic/${tid}/?start=${(pageNum - 1) * 100}`;
        return $.ajax({
            url,
            method: 'GET',
            success: data => {
                const $newDom = $('<div>').html(data);
                $('.topic-reply').html($newDom.find('.topic-reply').html());
                $('.paginator').html($newDom.find('.paginator').html());
                currentPage = pageNum;
                updateProgress();
            },
            error: () => logToUI(`❌ 无法加载第 ${pageNum} 页`, 'error')
        });
    }

    // —— 移除广告 ——
    $('#gdt-ad-container, #dale_group_topic_inner_middle').remove();

    logToUI('✅ 脚本已就绪，请设置起始页并点击“开始删除”。');

})();