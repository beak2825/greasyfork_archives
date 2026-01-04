// ==UserScript==
// @name         蓝白-JavDB影片标记已看
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  支持Excel上传、动态按钮状态、手动标记和移除已看功能
// @author       蓝白社野怪
// @include      https://javdb*.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.mini.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/550038/%E8%93%9D%E7%99%BD-JavDB%E5%BD%B1%E7%89%87%E6%A0%87%E8%AE%B0%E5%B7%B2%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/550038/%E8%93%9D%E7%99%BD-JavDB%E5%BD%B1%E7%89%87%E6%A0%87%E8%AE%B0%E5%B7%B2%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const CONFIG = {
        coverOpacity: 0.3,
        storageKeys: {
            ids: 'JavDBViewIdList',
            names: 'JavDBViewNameList'
        }
    };

    // 初始化存储
    let watchedIds = GM_getValue(CONFIG.storageKeys.ids, []);
    let watchedNames = GM_getValue(CONFIG.storageKeys.names, []);

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .watched-cover {
            opacity: ${CONFIG.coverOpacity} !important;
        }
        #excel-upload-btn {
            background-color: #4CAF50;
            border: none;
            color: white;
            padding: 6px 12px;
            font-size: 14px;
            cursor: pointer;
            border-radius: 4px;
        }
        #excel-upload-btn:hover {
            background-color: #45a049;
        }
        #file-input {
            display: none;
        }
        .button-container {
            display: flex;
            justify-content: flex-start;
            gap: 6px;
        }
        .button-disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(style);

    // 创建上传UI
    function createUploadUI() {
        const container = $(".movie-list");
        if (!container.length) {
            setTimeout(createUploadUI, 500);
            return;
        }

        if ($("#excel-upload-btn").length > 0) return;

        const buttonContainer = $('<div class="button-container"></div>');
        const uploadBtn = $('<button id="excel-upload-btn">上传标记</button>');
        const fileInput = $('<input type="file" id="file-input" accept=".xlsx,.xls,.csv">');

        uploadBtn.click(() => fileInput.trigger('click'));
        fileInput.change(handleFileUpload);

        buttonContainer.append(uploadBtn, fileInput);
        container.before(buttonContainer);
    }

    // 添加手动标记和取消标记按钮
    function addManualMarkButtons() {
        const saveListBtn = $(".modal-save-list-button");
        if (saveListBtn.length && !$(".mark-watched-btn").length) {
            // 标记已看按钮（蓝色）
            const markBtn = $(`
                <button class="button is-small mark-watched-btn is-primary">
                    <span class="icon is-small">
                        <i class="icon-check"></i>
                    </span>
                    <span>标记已看</span>
                </button>
            `);

            // 移除已看按钮（红色）
            const unmarkBtn = $(`
                <button class="button is-small unmark-watched-btn is-danger">
                    <span class="icon is-small">
                        <i class="icon-remove"></i>
                    </span>
                    <span>移除已看</span>
                </button>
            `);

            // 初始化按钮状态
            updateButtonStates(markBtn, unmarkBtn);

            markBtn.click(function() {
                const videoId = $(".video-detail strong:first").text().trim();
                const videoTitle = $(".video-detail .current-title").text().trim();

                if (videoId && videoTitle) {
                    if (!isVideoWatched(videoId, videoTitle)) {
                        watchedIds.unshift(videoId);
                        watchedNames.unshift(videoTitle);
                        updateStorage();

                        // 更新封面显示和按钮状态
                        updateCoverDisplay(videoId);
                        updateButtonStates(markBtn, unmarkBtn);
                        showNotification(`已标记: ${videoId} ${videoTitle}`);
                    }
                }
            });

            unmarkBtn.click(function() {
                const videoId = $(".video-detail strong:first").text().trim();
                const videoTitle = $(".video-detail .current-title").text().trim();

                if (videoId && videoTitle) {
                    if (isVideoWatched(videoId, videoTitle)) {
                        removeWatchedVideo(videoId, videoTitle);
                        updateStorage();

                        // 更新封面显示和按钮状态
                        updateCoverDisplay(videoId);
                        updateButtonStates(markBtn, unmarkBtn);
                        showNotification(`已移除: ${videoId} ${videoTitle}`);
                    }
                }
            });

            saveListBtn.after(unmarkBtn, markBtn);
        }
    }

    // 更新按钮状态
    function updateButtonStates(markBtn, unmarkBtn) {
        const videoId = $(".video-detail strong:first").text().trim();
        const videoTitle = $(".video-detail .current-title").text().trim();

        if (videoId && videoTitle) {
            const isWatched = isVideoWatched(videoId, videoTitle);

            // 标记已看按钮：已看时禁用，未看时启用
            markBtn.toggleClass('button-disabled', isWatched);
            markBtn.prop('disabled', isWatched);

            // 移除已看按钮：未看时禁用，已看时启用
            unmarkBtn.toggleClass('button-disabled', !isWatched);
            unmarkBtn.prop('disabled', !isWatched);
        }
    }

    // 从存储中移除影片
    function removeWatchedVideo(videoId, videoTitle) {
        const newIds = [];
        const newNames = [];

        for (let i = 0; i < watchedIds.length; i++) {
            if (watchedIds[i] !== videoId || watchedNames[i] !== videoTitle) {
                newIds.push(watchedIds[i]);
                newNames.push(watchedNames[i]);
            }
        }

        watchedIds = newIds;
        watchedNames = newNames;
    }

    // 更新封面显示
    function updateCoverDisplay(videoId) {
        $(".movie-list .item").each(function() {
            const $item = $(this);
            const currentId = $item.find(".video-title strong").text().trim();
            if (currentId === videoId) {
                const cover = $item.find("img").first();
                if (isVideoWatched(currentId, $item.find(".video-title").text().replace(currentId, "").trim())) {
                    cover.addClass("watched-cover");
                } else {
                    cover.removeClass("watched-cover");
                }
            }
        });
    }

    // 更新存储
    function updateStorage() {
        GM_setValue(CONFIG.storageKeys.ids, watchedIds);
        GM_setValue(CONFIG.storageKeys.names, watchedNames);
    }

    // 处理文件上传
    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data);
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                const newIds = [];
                const newNames = [];

                jsonData.forEach(item => {
                    const id = (item.id || '').toString().trim();
                    const title = (item.title || '').toString().trim();
                    if (id && title) {
                        newIds.push(id);
                        newNames.push(title);
                    }
                });

                watchedIds = newIds;
                watchedNames = newNames;
                updateStorage();

                markVideos();
                showNotification(`已更新 ${newIds.length} 条观看记录`);
            } catch (error) {
                console.error('处理Excel文件出错:', error);
                showNotification('处理Excel文件出错', 'error');
            }
        };
        reader.readAsArrayBuffer(file);
    }

    // 标记影片
    function markVideos() {
        $(".movie-list .item").each(function() {
            const $item = $(this);
            const titleElement = $item.find(".video-title");
            const videoId = titleElement.find("strong").text().trim();
            const videoTitle = getPureTitle(titleElement);
            const cover = $item.find("img").first();

            if (cover.length) {
                if (isVideoWatched(videoId, videoTitle)) {
                    cover.addClass("watched-cover");
                } else {
                    cover.removeClass("watched-cover");
                }
            }
        });
    }

    // 获取纯标题
    function getPureTitle(titleElement) {
        const clone = titleElement.clone();
        clone.find("strong").remove();
        return clone.text().trim();
    }

    // 检查是否已观看
    function isVideoWatched(videoId, videoTitle) {
        return watchedIds.some((id, index) =>
            id === videoId && watchedNames[index] === videoTitle
        );
    }

    // 显示通知
    function showNotification(message, type = 'success') {
        const $notification = $(`
            <div style="
                position: fixed;
                bottom: 20px;
                left: 20px;
                padding: 10px 20px;
                background-color: ${type === 'error' ? '#f44336' : type === 'info' ? '#2196F3' : '#4CAF50'};
                color: white;
                border-radius: 4px;
                z-index: 9999;
                animation: fadeIn 0.3s;
            ">
                ${message}
            </div>
        `);

        $("body").append($notification);

        setTimeout(() => {
            $notification.css("animation", "fadeOut 0.3s");
            setTimeout(() => $notification.remove(), 300);
        }, 3000);
    }

    // 初始化
    $(function() {
        // 添加CSS动画
        $("head").append(`
            <style>
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeOut {
                    from { opacity: 1; transform: translateY(0); }
                    to { opacity: 0; transform: translateY(20px); }
                }
            </style>
        `);

        createUploadUI();
        markVideos();
        addManualMarkButtons();

        // 监听页面变化，确保按钮始终存在
        const observer = new MutationObserver(() => {
            createUploadUI();
            addManualMarkButtons();
            markVideos();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();