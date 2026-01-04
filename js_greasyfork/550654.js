// ==UserScript==
// @name         Deepseek会话文件夹
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Manage Deepseek chats using folders. 使用文件夹管理Deepseek会话。
// @author       paradox661
// @match        https://chat.deepseek.com/*
// @icon         https://www.deepseek.com/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550654/Deepseek%E4%BC%9A%E8%AF%9D%E6%96%87%E4%BB%B6%E5%A4%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/550654/Deepseek%E4%BC%9A%E8%AF%9D%E6%96%87%E4%BB%B6%E5%A4%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Start DSChatFolders.');

    const FOLDERS = JSON.parse(GM_getValue('folders', '{}'));
    const CHATS = JSON.parse(GM_getValue('chats', '{}'));
    const FOLDER_STATE = JSON.parse(GM_getValue('folder_state', '{}'));
    let FOLDER_SEQ = JSON.parse(GM_getValue('folder_seq', '[]'));


    // 等待cond()为true时运行func()
    function waitFor(cond, func, timeout=60000) {
        const observer = new MutationObserver(function() {
            if (cond()) {
                observer.disconnect();
                func();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => observer.disconnect(), timeout);
    }


    // 添加需要的CSS类
    function addCSSClass() {
        const iconLink = document.createElement('link');
        iconLink.rel = 'stylesheet';
        iconLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(iconLink);

        const style = document.createElement('style');
        style.textContent = `
            .no-after-content::after {
                content: "" !important;
            }

            .no-scrollbar::-webkit-scrollbar {
                display: none;
            }

            .folder-btn {
                border-radius: 12px;
                margin: 2px;
            }

            .folder {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                border-radius: 12px;
            }

            .folder::before {
                content: "\\f07b";
                font-family: "Font Awesome 6 Free";
                font-weight: 900;
                color: #6770FE;
                display: inline-block;
                margin-right: 5px;
            }

            .folder::after {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0);
                pointer-events: none;
                transition: background-color 0.2s;
                border-radius: 12px;
            }

            .folder.active::after {
                background-color: rgba(0,0,0,0.08);
            }

            .chat {
                display: none;
                align-items: center;
                justify-content: flex-start;
            }

            .chat::before {
                content: "";
                display: inline-block;
                margin-right: 10px;
            }

            .drop-top {
                position: relative;
            }

            .drop-top::after {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 2px;
                background: blue;
            }

            .drop-bottom {
                position: relative;
            }

            .drop-bottom::after {
                content: "";
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 2px;
                background: blue;
            }
        `;
        document.head.appendChild(style);
    }


    // 工具函数
    let currentDragId = null;

    function existChatAnchors() {
        // 在某个会话页面刷新可能先加载一个，再加载其他。
        // 如果length > 0，可能后续逻辑下其他会话还没有加载。
        return getOriginalAnchors().length > 1;
    }

    function getChatId(chatAnchor) {
        const href = chatAnchor.getAttribute('href');
        if (href) {
            const match = href.match(/^\/a\/chat\/s\/([a-f0-9-]+)$/);
            return match[1];
        }
    }

    function outputChatAnchors() {
        const chatAnchors = getOriginalAnchors();
        console.log(`总共找到 ${chatAnchors.length} 个会话`);

        if (chatAnchors.length > 0) {
            console.group('DeepSeek 会话');
            chatAnchors.forEach(chatAnchor => {
                console.log(chatAnchor);
                console.log(getChatId(chatAnchor));
            });
            console.groupEnd();
        }
    }

    function genRandomId() {
        // 生成16位定长id
        return (Date.now().toString(36).padStart(10, "0") + Math.random().toString(36).substring(2, 8)).slice(0, 16);
    }

    function isChatId(id) {
        return id.length == 36 || id.length == 58;
    }

    function isFolderId(id) {
        return id.length == 16;
    }

    function insertAfter(newNode, referenceNode) {
        const parent = referenceNode.parentNode;
        if (referenceNode.nextSibling) {
            parent.insertBefore(newNode, referenceNode.nextSibling);
        } else {
            parent.appendChild(newNode);
        }
    }

    function extractIdFromUrl(url) {
        try {
            const u = new URL(url);
            const match = u.pathname.match(/\/a\/chat\/s\/([a-f0-9-]+)/i);
            return match ? match[1] : null;
        } catch (e) {
            console.error("Invalid URL:", e);
            return null;
        }
    }


    // 获取DOM元素
    function getScrollArea() {
        return document.querySelector('.ds-scroll-area');
    }

    function getOriginalAnchors() {
        return getScrollArea().querySelectorAll('a[href^="/a/chat/s/"]');
    }

    function getMenuBtn() {
        return getScrollArea().querySelector('a[href^="/a/chat/s/"]').children[2];
    }


    // 获取魔法数字Class
    function getBtnClass() {
        return getScrollArea().parentNode.children[1].classList[0];
    }

    function getAnchorClass() {
        return getOriginalAnchors()[0].classList[0];
    }

    function getAnchorSelectedClass() {
        return 'b64fb9ae';
    }


    // 添加DOM元素
    function addBtnArea() {
        if (document.getElementById('btn-area')) {
            return;
        }

        const btnArea = document.createElement('div');
        btnArea.id = 'btn-area';
        btnArea.style.cssText = `
            display: flex;
            margin-top: 6px;
            margin-bottom: 6px;
        `;

        return btnArea;
    }

    function addNewFolderBtn() {
        if (document.getElementById('new-folder-btn')) {
            return;
        }

        const newFolderBtn = document.createElement('button');
        newFolderBtn.id = 'new-folder-btn';
        newFolderBtn.textContent = 'New Folder';
        newFolderBtn.classList.add(getBtnClass(), 'folder-btn', 'no-after-content');
        newFolderBtn.style.flex = 4;

        newFolderBtn.addEventListener('click', () => {
            const folderArea = document.getElementById('folder-area');

            const folderName = prompt('文件夹名称：', '');
            if (folderName !== null) {
                const folderId = genRandomId();

                FOLDERS[folderId] = folderName;
                FOLDER_STATE[folderId] = false;
                FOLDER_SEQ.push(folderId);

                GM_setValue('folders', JSON.stringify(FOLDERS));
                GM_setValue('folder_state', JSON.stringify(FOLDER_STATE));
                GM_setValue('folder_seq', JSON.stringify(FOLDER_SEQ));

                const newFolder = addNewFolder(folderName, folderId);

                folderArea.appendChild(newFolder);
            }
        });

        return newFolderBtn;
    }

    function addImportFoldersBtn() {
        if (document.getElementById('import-folders-btn')) {
            return;
        }

        const importFoldersBtn = document.createElement('button');
        importFoldersBtn.id = 'import-folders-btn';
        const icon = document.createElement('i');
        icon.className = "fas fa-file-import";
        importFoldersBtn.appendChild(icon);
        importFoldersBtn.classList.add(getBtnClass(), 'folder-btn', 'no-after-content');
        importFoldersBtn.style.flex = 1;
        importFoldersBtn.style.color = '#6770FE';

        //importFoldersBtn.addEventListener('click', () => {
        //    GM_setValue('folders', '{}');
        //    GM_setValue('chats', '{}');
        //    GM_setValue('folder_state', '{}');
        //    GM_setValue('folder_seq', '[]');
        //});

        importFoldersBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.txt,.json';
            input.onchange = async () => {
                const file = input.files && input.files[0];
                if (!file) return;
                const text = await file.text();
                const obj = JSON.parse(text);
                for (const k of Object.keys(obj)) {
                    GM_setValue(k, obj[k]);
                }
                alert('导入完成。');
                location.reload();
            };
            input.click();
        });

        return importFoldersBtn;
    }

    function addExportFoldersBtn() {
        if (document.getElementById('export-folders-btn')) {
            return;
        }

        const exportFoldersBtn = document.createElement('button');
        exportFoldersBtn.id = 'export-folders-btn';
        const icon = document.createElement('i');
        icon.className = "fas fa-file-export";
        exportFoldersBtn.appendChild(icon);
        exportFoldersBtn.classList.add(getBtnClass(), 'folder-btn', 'no-after-content');
        exportFoldersBtn.style.flex = 1;
        exportFoldersBtn.style.color = '#6770FE';

        //exportFoldersBtn.addEventListener('click', () => {
        //    console.log(JSON.parse(GM_getValue('folders', '{}')));
        //    console.log(JSON.parse(GM_getValue('chats', '{}')));
        //    console.log(JSON.parse(GM_getValue('folder_state', '{}')));
        //    console.log(JSON.parse(GM_getValue('folder_seq', '[]')));
        //});

        exportFoldersBtn.addEventListener('click', () => {
            const keys = GM_listValues();
            const data = {};
            for (const k of keys){
                data[k] = GM_getValue(k);
            }

            const text = JSON.stringify(data, null, 2);
            const blob = new Blob([text], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `deepseek-folder_${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        });

        return exportFoldersBtn;
    }

    function addFolderArea() {
        if (document.getElementById('folder-area')) {
            return;
        }

        const folderArea = document.createElement('div');
        folderArea.id = 'folder-area';
        folderArea.classList.add('no-scrollbar');
        folderArea.style.cssText = `
            height: 50%;
            overflow-y: auto;
            overflow-x: hidden;
        `;

        return folderArea;
    }

    function addNewFolder(folderName, folderId) {
        const newFolder = document.createElement('div');
        newFolder.id = folderId;

        const folderHeader = document.createElement('div');
        folderHeader.classList.add(getAnchorClass(), 'folder');

        const folderHeaderText = document.createElement('div');
        folderHeaderText.style.cssText = `
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        `;
        folderHeaderText.textContent = folderName;
        folderHeader.appendChild(folderHeaderText);

        const folderMenuBtn = getMenuBtn().cloneNode(true);
        folderMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            addMenu(folderMenuBtn);
        });
        folderHeader.appendChild(folderMenuBtn);

        folderHeader.addEventListener('click', () => {
            folderHeader.classList.toggle('active');

            FOLDER_STATE[folderId] = folderHeader.classList.contains('active');
            GM_setValue('folder_state', JSON.stringify(FOLDER_STATE));

            Array.from(newFolder.children).forEach(child => {
                if (child !== folderHeader) {
                    child.style.display = (child.style.display === 'none' ||
                                           child.style.display === '') ? 'flex' : 'none';
                }
            });
        });

        folderHeader.draggable = true;

        folderHeader.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.currentTarget.parentNode.id);
            currentDragId = e.currentTarget.parentNode.id;
        });

        folderHeader.addEventListener('dragover', (e) => {
            e.preventDefault();

            if (isFolderId(currentDragId) && currentDragId != e.currentTarget.parentNode.id) {
                const rect = e.currentTarget.getBoundingClientRect();
                const isBottom = (e.clientY - rect.top) > (rect.height / 2);

                e.currentTarget.parentNode.classList.remove('drop-top', 'drop-bottom');

                e.currentTarget.parentNode.classList.add(isBottom ? 'drop-bottom' : 'drop-top');
            }
        });

        folderHeader.addEventListener('dragleave', (e) => {
            e.preventDefault();

            if (isFolderId(currentDragId) && currentDragId != e.currentTarget.parentNode.id) {
                e.currentTarget.parentNode.classList.remove('drop-top', 'drop-bottom');
            }
        });

        folderHeader.addEventListener('drop', (e) => {
            e.preventDefault();

            if (isFolderId(currentDragId) && currentDragId != e.currentTarget.parentNode.id) {
                const rect = e.currentTarget.getBoundingClientRect();
                const isBottom = (e.clientY - rect.top) > (rect.height / 2);

                e.currentTarget.parentNode.classList.remove('drop-top', 'drop-bottom');

                const originalFolderId = e.dataTransfer.getData('text/plain');
                const targetFolderId = e.currentTarget.parentNode.id;

                const newFolderSeq = [];
                FOLDER_SEQ.forEach(folderId => {
                    if (folderId == originalFolderId) {
                    } else if (folderId == targetFolderId) {
                        if (isBottom) {
                            newFolderSeq.push(targetFolderId);
                            newFolderSeq.push(originalFolderId);
                        } else {
                            newFolderSeq.push(originalFolderId);
                            newFolderSeq.push(targetFolderId);
                        }
                    } else {
                        newFolderSeq.push(folderId);
                    }
                });
                FOLDER_SEQ = newFolderSeq;
                GM_setValue('folder_seq', JSON.stringify(FOLDER_SEQ));

                const originalFolder = document.getElementById(originalFolderId);
                const targetFolder = document.getElementById(targetFolderId);

                originalFolder.remove();

                if (isBottom) {
                    insertAfter(originalFolder, targetFolder);
                } else {
                    targetFolder.parentNode.insertBefore(originalFolder, targetFolder);
                }
            }
        });

        newFolder.appendChild(folderHeader);

        newFolder.addEventListener('dragover', (e) => {
            e.preventDefault();

            if (isChatId(currentDragId)) {
                if (!currentDragId.endsWith('-copy') || currentDragId.slice(-21, -5) != folderId) {
                    newFolder.style.border = '1.5px solid blue';
                }
            }
        });

        newFolder.addEventListener('dragleave', (e) => {
            e.preventDefault();

            if (isChatId(currentDragId)) {
                if (!currentDragId.endsWith('-copy') || currentDragId.slice(-21, -5) != folderId) {
                    newFolder.style.border = '';
                }
            }
        });

        newFolder.addEventListener('drop', (e) => {
            e.preventDefault();

            if (isChatId(currentDragId)) {
                newFolder.style.border = '';

                let chatId = e.dataTransfer.getData('text/plain');
                if (chatId.endsWith('-copy')) {
                    chatId = chatId.slice(0, -22);
                }

                let inFolder = false;
                Array.from(newFolder.children).forEach(child => {
                    if (child.id == chatId + '-' + folderId + '-copy') {
                        inFolder = true;
                    }
                });

                if (!inFolder) {
                    if (chatId in CHATS) {
                        CHATS[chatId].push(folderId);
                    } else {
                        CHATS[chatId] = [folderId];
                    }
                    GM_setValue('chats', JSON.stringify(CHATS));

                    const chatAnchorCopy = addCopyedAnchor(chatId, folderId);
                    chatAnchorCopy.style.display = folderHeader.classList.contains('active') ? 'flex' :'none';
                    newFolder.insertBefore(chatAnchorCopy, newFolder.children[1]);
                }
            }
        });

        return newFolder;
    }

    function addMenu(folderMenuBtn) {
        document.querySelectorAll('.temp-menu').forEach(m => m.remove());

        const menu = document.createElement('div');
        menu.classList.add('temp-menu', 'ds-dropdown-menu', 'ds-elevated', 'ds-fade-in-zoom-in-enter', 'ds-fade-in-zoom-in-active');
        menu.style.cssText = `
            position: absolute;
            z-index: 9999;
        `;

        const rect = folderMenuBtn.getBoundingClientRect();
        menu.style.left = (rect.left + window.scrollX + 20) + 'px';
        menu.style.top = rect.bottom + window.scrollY + 'px';

        document.body.appendChild(menu);

        const renameBtn = document.createElement('div');
        renameBtn.classList.add('ds-dropdown-menu-option', 'ds-dropdown-menu-option--none');

        renameBtn.addEventListener('click', () => {
            const folderHeader = folderMenuBtn.parentNode;
            const currentFolder = folderHeader.parentNode;
            const folderHeaderText = folderHeader.children[0];

            const folderName = prompt('重命名文件夹：', FOLDERS[currentFolder.id]);
            if (folderName !== null) {
                const folderId = currentFolder.id;

                FOLDERS[folderId] = folderName;
                GM_setValue('folders', JSON.stringify(FOLDERS));

                folderHeaderText.textContent = folderName;
            }

            menu.remove();
        });

        const renameIcon = document.createElement('i');
        renameIcon.className = 'fa-solid fa-pen-to-square';
        renameIcon.classList.add('ds-dropdown-menu-option__icon');
        renameBtn.appendChild(renameIcon);

        const renameBtnText = document.createElement('div');
        renameBtnText.classList.add('ds-dropdown-menu-option__label');
        renameBtnText.textContent = 'Rename';
        renameBtn.appendChild(renameBtnText);

        menu.appendChild(renameBtn);

        const deleteBtn = document.createElement('div');
        deleteBtn.classList.add('ds-dropdown-menu-option', 'ds-dropdown-menu-option--error');

        deleteBtn.addEventListener('click', () => {
            const folderHeader = folderMenuBtn.parentNode;
            const currentFolder = folderHeader.parentNode;

            let result = confirm('确定删除文件夹：' + FOLDERS[currentFolder.id]);
            if (result) {
                const folderId = currentFolder.id;

                for (let chatId in CHATS) {
                    CHATS[chatId] = CHATS[chatId].filter(x => x !== folderId);
                }

                delete FOLDERS[folderId];
                delete FOLDER_STATE[folderId];
                FOLDER_SEQ = FOLDER_SEQ.filter(x => x != folderId);

                GM_setValue('chats', JSON.stringify(CHATS));
                GM_setValue('folders', JSON.stringify(FOLDERS));
                GM_setValue('folder_state', JSON.stringify(FOLDER_STATE));
                GM_setValue('folder_seq', JSON.stringify(FOLDER_SEQ));

                currentFolder.remove();
            }

            menu.remove();
        });

        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'fa-solid fa-trash';
        deleteIcon.classList.add('ds-dropdown-menu-option__icon');
        deleteBtn.appendChild(deleteIcon);

        const deleteBtnText = document.createElement('div');
        deleteBtnText.classList.add('ds-dropdown-menu-option__label');
        deleteBtnText.textContent = 'Delete';
        deleteBtnText.style.marginLeft = '2px';
        deleteBtn.appendChild(deleteBtnText);

        menu.appendChild(deleteBtn);

        const removeMenu = (e) => {
            if (!menu.contains(e.target) && e.target !== folderMenuBtn) {
                menu.remove();
                document.removeEventListener('click', removeMenu);
            }
        };

        setTimeout(() => document.addEventListener('click', removeMenu), 0);

        return menu;
    }

    function addCopyedAnchor(chatId, folderId) {
        const chatAnchorCopy = document.getElementById(chatId).cloneNode(true);
        chatAnchorCopy.draggable = true;
        chatAnchorCopy.id = chatId + '-' + folderId + '-copy';
        chatAnchorCopy.classList.add('chat');
        chatAnchorCopy.children[2].remove();

        chatAnchorCopy.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.id);
            currentDragId = e.target.id;
        });

        chatAnchorCopy.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById(chatId).click();
        });

        return chatAnchorCopy;
    }


    // 页面初始化
    function checkFrontUpdating() {
        const criticalClasses = ['cb86951c', 'dc04ec1d', '_546d736', 'ds-scroll-area'];

        for (const className of criticalClasses) {
            if (!document.querySelector(`.${className}`)) {
                return true;
            }
        }

        return false;
    }

    function initUISettings() {
        const scrollArea = getScrollArea();
        scrollArea.style.height = '40%';

        const btnArea = addBtnArea();
        scrollArea.parentNode.insertBefore(btnArea, scrollArea);

        const newFolderBtn = addNewFolderBtn();
        btnArea.appendChild(newFolderBtn);

        const importFoldersBtn = addImportFoldersBtn();
        btnArea.appendChild(importFoldersBtn);

        const exportFoldersBtn = addExportFoldersBtn();
        btnArea.appendChild(exportFoldersBtn);

        const folderArea = addFolderArea();
        scrollArea.parentNode.insertBefore(folderArea, scrollArea);

        const horizontalLine = document.createElement('div');
        horizontalLine.style.cssText = `
            height: 0.8px;
            background-color: #C0C0C0;
            width: 95%;
            margin: 0 auto;
            margin-top: 5px;
        `;

        scrollArea.parentNode.insertBefore(horizontalLine, scrollArea);

        scrollArea.addEventListener('dragover', (e) => {
            e.preventDefault();

            if (isChatId(currentDragId) && currentDragId.endsWith('-copy')) {
                scrollArea.style.border = '1.5px solid blue';
            }
        });

        scrollArea.addEventListener('dragleave', (e) => {
            e.preventDefault();

            if (isChatId(currentDragId) && currentDragId.endsWith('-copy')) {
                scrollArea.style.border = '';
            }
        });

        scrollArea.addEventListener('drop', (e) => {
            e.preventDefault();

            if (isChatId(currentDragId)) {
                let chatId = e.dataTransfer.getData('text/plain');
                if (chatId.endsWith('-copy')) {
                    scrollArea.style.border = '';

                    document.getElementById(chatId).remove();

                    const folderId = chatId.slice(-21, -5);
                    chatId = chatId.slice(0, -22);

                    CHATS[chatId] = CHATS[chatId].filter(x => x != folderId);

                    GM_setValue('chats', JSON.stringify(CHATS));
                }
            }
        });
    }

    function setOriginalAnchorsDraggable() {
        const chatAnchors = getOriginalAnchors();

        chatAnchors.forEach(chatAnchor => {
            chatAnchor.draggable = true;
            chatAnchor.id = getChatId(chatAnchor);

            chatAnchor.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.id);
                currentDragId = e.target.id;
            });
        });
    }

    function initFoldersLoading() {
        // FOLDER_STATE、FOLDER_SEQ都与FOLDER保持一致。
        const folderArea = document.getElementById('folder-area');

        for (let folderId in FOLDERS) {
            if (!(folderId in FOLDER_STATE)) {
                FOLDER_STATE[folderId] = false;
            }
        }

        const removedFolderState = [];
        for (let folderId in FOLDER_STATE) {
            if (!(folderId in FOLDERS)) {
                removedFolderState.push(folderId);
            }
        }
        removedFolderState.forEach(folderId => delete FOLDER_STATE[folderId]);

        for (let folderId in FOLDERS) {
            if (!FOLDER_SEQ.includes(folderId)) {
                FOLDER_SEQ.push(folderId);
            }
        }
        FOLDER_SEQ = [...new Set(FOLDER_SEQ)];

        const removedFolderSeq = [];

        FOLDER_SEQ.forEach(folderId => {
            if (folderId in FOLDERS) {
                const newFolder = addNewFolder(FOLDERS[folderId], folderId);
                const folderHeader = newFolder.children[0];

                folderHeader.classList.toggle('active', FOLDER_STATE[folderId]);

                folderArea.appendChild(newFolder);
            } else {
                removedFolderSeq.push(folderId);
            }
        });

        removedFolderSeq.forEach(folderId => {
            FOLDER_SEQ = FOLDER_SEQ.filter(x => x != folderId);
        });

        GM_setValue('folder_state', JSON.stringify(FOLDER_STATE));
        GM_setValue('folder_seq', JSON.stringify(FOLDER_SEQ));
    }

    function initAnchorsLoading() {
        const removedChatIds = [];

        for (let chatId in CHATS) {
            if (!document.getElementById(chatId)) {
                removedChatIds.push(chatId);
            }
        }

        const chatAnchors = getOriginalAnchors();

        chatAnchors.forEach(chatAnchor => {
            const chatId = getChatId(chatAnchor);

            if (chatId in CHATS) {
                const belongFolders = CHATS[chatId];
                const activeFolders = [];

                belongFolders.forEach(folderId => {
                    if (document.getElementById(folderId)) {
                        activeFolders.push(folderId);

                        const belongFolder = document.getElementById(folderId);
                        const folderHeader = belongFolder.children[0];

                        let inFolder = false;
                        Array.from(belongFolder.children).forEach(child => {
                            if (child.id == chatId + '-' + folderId + '-copy') {
                                inFolder = true;
                            }
                        });

                        if (!inFolder) {
                            const chatAnchorCopy = addCopyedAnchor(chatId, folderId);
                            chatAnchorCopy.style.display = folderHeader.classList.contains('active') ? 'flex' :'none';
                            belongFolder.appendChild(chatAnchorCopy);
                        }
                    }
                });
                CHATS[chatId] = activeFolders;
            }
        });

        removedChatIds.forEach(chatId => delete CHATS[chatId]);
        GM_setValue('chats', JSON.stringify(CHATS));
    }

    function observeScrollArea () {
        const scrollArea = getScrollArea();

        const observer = new MutationObserver((mutationList) => {
            for (const mutation of mutationList) {
                if (mutation.type !== "childList") continue;

                /* eslint-disable no-loop-func */
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType !== 1) return;
                    let chatAnchor = null;
                    if (node.tagName === "A") {
                        chatAnchor = node;
                    } else {
                        chatAnchor = node.querySelector("a");
                    }
                    if (chatAnchor) {
                        chatAnchor.draggable = true;
                        chatAnchor.id = getChatId(chatAnchor);

                        chatAnchor.addEventListener('dragstart', (e) => {
                            e.dataTransfer.setData('text/plain', e.target.id);
                            currentDragId = e.target.id;
                        });

                        const chatId = getChatId(chatAnchor);

                        if (chatId in CHATS) {
                            const belongFolders = CHATS[chatId];
                            const activeFolders = [];

                            belongFolders.forEach(folderId => {
                                if (document.getElementById(folderId)) {
                                    activeFolders.push(folderId);

                                    const belongFolder = document.getElementById(folderId);
                                    const folderHeader = belongFolder.children[0];

                                    let inFolder = false;
                                    Array.from(belongFolder.children).forEach(child => {
                                        if (child.id == chatId + '-' + folderId + '-copy') {
                                            inFolder = true;
                                        }
                                    });

                                    if (!inFolder) {
                                        const chatAnchorCopy = addCopyedAnchor(chatId, folderId);
                                        chatAnchorCopy.style.display = folderHeader.classList.contains('active') ? 'flex' :'none';
                                        belongFolder.insertBefore(chatAnchorCopy, belongFolder.children[1]);
                                    }
                                }
                            });
                            CHATS[chatId] = activeFolders;
                            GM_setValue('chats', JSON.stringify(CHATS));
                        }
                    }
                });

                mutation.removedNodes.forEach((node) => {
                    if (node.nodeType !== 1) return;
                    let chatAnchor = null;
                    if (node.tagName === "A") {
                        chatAnchor = node;
                    } else {
                        chatAnchor = node.querySelector("a");
                    }
                    if (chatAnchor) {
                        const chatId = getChatId(chatAnchor);

                        if (!scrollArea.querySelector(`#${CSS.escape(chatId)}`)) {
                            for (let folderId in FOLDERS) {
                                if (document.getElementById(chatId + '-' + folderId + '-copy')) {
                                    document.getElementById(chatId + '-' + folderId + '-copy').remove();
                                }
                            }
                        }
                    }
                });
            }
        });

        observer.observe(scrollArea, {
            childList: true,
            subtree: true
        });
    }

    function listenDomain() {
        function updateSelectedState() {
            const chatId = extractIdFromUrl(location.href);

            const copyedAnchors = document.getElementById('folder-area').querySelectorAll('a[href^="/a/chat/s/"]');
            copyedAnchors.forEach(anchor => {
                anchor.classList.remove(getAnchorSelectedClass());
            });

            if (chatId) {
                const selectedCopyedAnchors = document.getElementById('folder-area').querySelectorAll(`a[href="/a/chat/s/${chatId}"]`);
                selectedCopyedAnchors.forEach(anchor => {
                    anchor.classList.add(getAnchorSelectedClass());
                });
            }
        }

        window.addEventListener("popstate", updateSelectedState);
        window.addEventListener("hashchange", updateSelectedState);

        ["pushState", "replaceState"].forEach(fn => {
            const orig = history[fn];
            history[fn] = function (...args) {
                const ret = orig.apply(this, args);
                updateSelectedState();
                return ret;
            };
        });

        updateSelectedState();
    }


    function main() {
        addCSSClass();

        waitFor(existChatAnchors, () => {
            if (!checkFrontUpdating()) {
                initUISettings();
                setOriginalAnchorsDraggable();
                initFoldersLoading();
                initAnchorsLoading();
                observeScrollArea();
                listenDomain();
            } else {
                let result = confirm('Deepseek前端已更新，旧版本“Deepseek会话文件夹”不再支持，是否导出原先的文件夹设置？');
                if (result) {
                    const exportFoldersBtn = addExportFoldersBtn();
                    exportFoldersBtn.click();
                }
            }
        });
    }

    main();
})();