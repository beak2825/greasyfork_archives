// ==UserScript==
// @name         MIR Library - スタ画ライブラリ
// @namespace    https://rentry.co/78hcq7c7/
// @license      MIT
// @version      1.1
// @description  MIR用の画像ライブラリ管理ツール。キャラクター画像をIndexedDBで管理し、:character/記法で呼び出せます
// @author       ForeverPWA
// @match        *://aistudio.google.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/563506/MIR%20Library%20-%20%E3%82%B9%E3%82%BF%E7%94%BB%E3%83%A9%E3%82%A4%E3%83%96%E3%83%A9%E3%83%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/563506/MIR%20Library%20-%20%E3%82%B9%E3%82%BF%E7%94%BB%E3%83%A9%E3%82%A4%E3%83%96%E3%83%A9%E3%83%AA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==========================================================================
    // 定数・設定
    // ==========================================================================
    const DB_NAME = 'ImageManagerDB';
    const DB_VERSION = 1;
    const STORES = {
        CHARACTERS: 'characters',
        OUTFITS: 'outfits',
        CHARACTER_IMAGES: 'characterImages',
        CATEGORIES: 'categories',
        BACKGROUND_IMAGES: 'backgroundImages'
    };

    // ==========================================================================
    // ユーティリティ
    // ==========================================================================
    const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // DOM要素を安全に作成するヘルパー（TrustedHTML対応）
    const createElement = (tag, attrs = {}, children = []) => {
        const el = document.createElement(tag);
        for (const [key, value] of Object.entries(attrs)) {
            if (key === 'className') {
                el.className = value;
            } else if (key === 'style' && typeof value === 'object') {
                Object.assign(el.style, value);
            } else if (key.startsWith('on') && typeof value === 'function') {
                el.addEventListener(key.slice(2).toLowerCase(), value);
            } else if (key === 'dataset') {
                for (const [dataKey, dataValue] of Object.entries(value)) {
                    el.dataset[dataKey] = dataValue;
                }
            } else {
                el.setAttribute(key, value);
            }
        }
        for (const child of children) {
            if (typeof child === 'string') {
                el.appendChild(document.createTextNode(child));
            } else if (child) {
                el.appendChild(child);
            }
        }
        return el;
    };

    const escapeHtml = (str) => str || '';

    // File System Access APIのサポート確認
    const isFolderUploadSupported = () => 'showDirectoryPicker' in window;

    // 画像ファイルの拡張子
    const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'];

    // フォルダを選択してキャラクター構造を解析
    const selectCharacterFolder = async () => {
        if (!isFolderUploadSupported()) {
            alert('このブラウザはフォルダ選択をサポートしていません');
            return null;
        }

        try {
            const directoryHandle = await window.showDirectoryPicker({ mode: 'read' });
            const characterName = directoryHandle.name;
            const outfits = [];

            // ディレクトリ内のエントリを取得
            for await (const [, handle] of directoryHandle.entries()) {
                if (handle.kind === 'directory') {
                    // 衣装フォルダとして処理
                    const outfitName = handle.name;
                    const images = [];

                    for await (const [fileName, fileHandle] of handle.entries()) {
                        if (fileHandle.kind === 'file') {
                            const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
                            if (IMAGE_EXTENSIONS.includes(extension)) {
                                try {
                                    const file = await fileHandle.getFile();
                                    images.push(file);
                                } catch (e) {
                                    console.warn(`ファイルの読み込みに失敗: ${fileName}`, e);
                                }
                            }
                        }
                    }

                    if (images.length > 0) {
                        outfits.push({ outfitName, images });
                    }
                }
            }

            return { characterName, outfits };
        } catch (error) {
            if (error.name === 'AbortError') {
                return null; // ユーザーがキャンセル
            }
            console.error('フォルダ選択に失敗:', error);
            throw error;
        }
    };

    // 背景画像用のフォルダを選択
    const selectImageFolder = async () => {
        if (!isFolderUploadSupported()) {
            alert('このブラウザはフォルダ選択をサポートしていません');
            return null;
        }

        try {
            const directoryHandle = await window.showDirectoryPicker({ mode: 'read' });
            const folderName = directoryHandle.name;
            const images = [];

            for await (const [fileName, handle] of directoryHandle.entries()) {
                if (handle.kind === 'file') {
                    const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
                    if (IMAGE_EXTENSIONS.includes(extension)) {
                        try {
                            const file = await handle.getFile();
                            images.push(file);
                        } catch (e) {
                            console.warn(`ファイルの読み込みに失敗: ${fileName}`, e);
                        }
                    }
                }
            }

            if (images.length === 0) {
                alert('選択されたフォルダに画像ファイルが見つかりません');
                return null;
            }

            return { folderName, images };
        } catch (error) {
            if (error.name === 'AbortError') {
                return null;
            }
            console.error('フォルダ選択に失敗:', error);
            throw error;
        }
    };

    // フォルダからキャラクターを一括登録
    const bulkUploadFromFolder = async (folderData, onProgress) => {
        const { characterName, outfits } = folderData;
        const now = Date.now();
        let totalImages = outfits.reduce((sum, o) => sum + o.images.length, 0);
        let processedImages = 0;

        // キャラクター作成
        const character = {
            id: generateId(),
            name: characterName,
            description: '',
            createdAt: now,
            updatedAt: now
        };
        await dbAdd(STORES.CHARACTERS, character);

        // 衣装と画像を登録
        for (const outfitData of outfits) {
            const outfit = {
                id: generateId(),
                characterId: character.id,
                name: outfitData.outfitName,
                createdAt: now,
                updatedAt: now
            };
            await dbAdd(STORES.OUTFITS, outfit);

            for (const file of outfitData.images) {
                const data = await fileToBase64(file);
                const imageName = file.name.replace(/\.[^/.]+$/, '');
                await dbAdd(STORES.CHARACTER_IMAGES, {
                    id: generateId(),
                    outfitId: outfit.id,
                    name: imageName,
                    data,
                    mimeType: file.type,
                    size: file.size,
                    createdAt: now
                });

                processedImages++;
                if (onProgress) {
                    onProgress(processedImages, totalImages);
                }
            }
        }

        return { character, outfitCount: outfits.length, imageCount: totalImages };
    };

    // フォルダから背景カテゴリーを一括登録
    const bulkUploadBackgroundFromFolder = async (folderData, onProgress) => {
        const { folderName, images } = folderData;
        const now = Date.now();
        let processedImages = 0;

        // カテゴリー作成
        const category = {
            id: generateId(),
            name: folderName,
            description: '',
            createdAt: now,
            updatedAt: now
        };
        await dbAdd(STORES.CATEGORIES, category);

        // 画像を登録
        for (const file of images) {
            const data = await fileToBase64(file);
            const imageName = file.name.replace(/\.[^/.]+$/, '');
            await dbAdd(STORES.BACKGROUND_IMAGES, {
                id: generateId(),
                categoryId: category.id,
                name: imageName,
                data,
                mimeType: file.type,
                size: file.size,
                createdAt: now
            });

            processedImages++;
            if (onProgress) {
                onProgress(processedImages, images.length);
            }
        }

        return { category, imageCount: images.length };
    };


    // ==========================================================================
    // IndexedDB操作
    // ==========================================================================
    let db = null;

    const openDB = () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                db = request.result;
                resolve(db);
            };

            request.onupgradeneeded = (event) => {
                const database = event.target.result;

                if (!database.objectStoreNames.contains(STORES.CHARACTERS)) {
                    database.createObjectStore(STORES.CHARACTERS, { keyPath: 'id' });
                }
                if (!database.objectStoreNames.contains(STORES.OUTFITS)) {
                    const outfitStore = database.createObjectStore(STORES.OUTFITS, { keyPath: 'id' });
                    outfitStore.createIndex('characterId', 'characterId', { unique: false });
                }
                if (!database.objectStoreNames.contains(STORES.CHARACTER_IMAGES)) {
                    const imgStore = database.createObjectStore(STORES.CHARACTER_IMAGES, { keyPath: 'id' });
                    imgStore.createIndex('outfitId', 'outfitId', { unique: false });
                }
                if (!database.objectStoreNames.contains(STORES.CATEGORIES)) {
                    database.createObjectStore(STORES.CATEGORIES, { keyPath: 'id' });
                }
                if (!database.objectStoreNames.contains(STORES.BACKGROUND_IMAGES)) {
                    const bgStore = database.createObjectStore(STORES.BACKGROUND_IMAGES, { keyPath: 'id' });
                    bgStore.createIndex('categoryId', 'categoryId', { unique: false });
                }
            };
        });
    };

    const dbAdd = (storeName, data) => {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            const request = store.add(data);
            request.onsuccess = () => resolve(data);
            request.onerror = () => reject(request.error);
        });
    };

    const dbGetAll = (storeName) => {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    };

    const dbGetByIndex = (storeName, indexName, value) => {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const index = store.index(indexName);
            const request = index.getAll(value);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    };

    const dbUpdate = (storeName, data) => {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            const request = store.put(data);
            request.onsuccess = () => resolve(data);
            request.onerror = () => reject(request.error);
        });
    };

    const dbDelete = (storeName, id) => {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            const request = store.delete(id);
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    };

    // キャラクターの最初の画像を取得（サムネイル用）
    const getCharacterFirstImage = async (characterId) => {
        const outfits = await dbGetByIndex(STORES.OUTFITS, 'characterId', characterId);
        for (const outfit of outfits) {
            const images = await dbGetByIndex(STORES.CHARACTER_IMAGES, 'outfitId', outfit.id);
            if (images.length > 0) {
                return images[0];
            }
        }
        return null;
    };

    // キャラクターの統計情報を取得
    const getCharacterStats = async (characterId) => {
        const outfits = await dbGetByIndex(STORES.OUTFITS, 'characterId', characterId);
        let imageCount = 0;
        for (const outfit of outfits) {
            const images = await dbGetByIndex(STORES.CHARACTER_IMAGES, 'outfitId', outfit.id);
            imageCount += images.length;
        }
        return { outfitCount: outfits.length, imageCount };
    };

    // カテゴリーの最初の画像を取得（サムネイル用）
    const getCategoryFirstImage = async (categoryId) => {
        const images = await dbGetByIndex(STORES.BACKGROUND_IMAGES, 'categoryId', categoryId);
        return images.length > 0 ? images[0] : null;
    };

    // カテゴリーの画像数を取得
    const getCategoryImageCount = async (categoryId) => {
        const images = await dbGetByIndex(STORES.BACKGROUND_IMAGES, 'categoryId', categoryId);
        return images.length;
    };

    // キャラクターの全衣装と全表情名を取得（一括コピー用）
    const getCharacterFullData = async (characterId) => {
        const outfits = await dbGetByIndex(STORES.OUTFITS, 'characterId', characterId);
        const expressionSet = new Set();
        const outfitNames = outfits.map(o => o.name);

        for (const outfit of outfits) {
            const images = await dbGetByIndex(STORES.CHARACTER_IMAGES, 'outfitId', outfit.id);
            images.forEach(img => expressionSet.add(img.name));
        }

        return {
            outfits: outfitNames,
            expressions: Array.from(expressionSet)
        };
    };

    // ==========================================================================
    // スタイル
    // ==========================================================================
    GM_addStyle(`
        .img-manager-folder-btn {
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            color: white;
            padding: 10px 16px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 16px;
        }
        .img-manager-folder-btn:hover {
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
        }
        .img-manager-folder-btn:disabled {
            background: #555;
            cursor: not-allowed;
        }
        .img-manager-progress {
            background: #252542;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
        }
        .img-manager-progress-bar {
            height: 8px;
            background: #333;
            border-radius: 4px;
            overflow: hidden;
            margin-top: 8px;
        }
        .img-manager-progress-fill {
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            transition: width 0.3s;
        }
        .img-manager-info {
            background: rgba(102, 126, 234, 0.2);
            border: 1px solid #667eea;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 16px;
            font-size: 13px;
        }
        #img-manager-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 800px;
            max-height: 80vh;
            background: #1a1a2e;
            color: #eee;
            border-radius: 16px;
            box-shadow: 0 25px 50px rgba(0,0,0,0.5);
            z-index: 999998;
            display: none;
            flex-direction: column;
            overflow: hidden;
        }
        #img-manager-panel.visible { display: flex; }

        .img-manager-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.7);
            z-index: 999997;
            display: none;
        }
        .img-manager-overlay.visible { display: block; }

        .img-manager-header {
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .img-manager-header h2 { margin: 0; font-size: 1.5rem; }
        .img-manager-close {
            background: none; border: none; color: white;
            font-size: 28px; cursor: pointer; padding: 0;
        }

        .img-manager-tabs {
            display: flex;
            border-bottom: 1px solid #333;
        }
        .img-manager-tab {
            flex: 1;
            padding: 12px;
            background: transparent;
            border: none;
            color: #888;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
        }
        .img-manager-tab.active {
            color: #667eea;
            border-bottom: 2px solid #667eea;
        }

        .img-manager-content {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
        }

        .img-manager-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 16px;
        }

        .img-manager-card {
            background: #252542;
            border-radius: 12px;
            padding: 16px;
            text-align: center;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            border: 1px solid #333;
        }
        .img-manager-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            border-color: #667eea;
        }

        .img-manager-card-add {
            border: 2px dashed #444;
            background: transparent;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 150px;
        }
        .img-manager-card-add:hover {
            border-color: #667eea;
            background: rgba(102, 126, 234, 0.1);
        }

        .img-manager-card img {
            width: 100%;
            height: 100px;
            object-fit: cover;
            border-radius: 8px;
            margin-bottom: 8px;
        }

        .img-manager-card-title {
            font-weight: 600;
            margin-bottom: 4px;
            font-size: 14px;
        }

        .img-manager-card-desc {
            color: #888;
            font-size: 12px;
        }

        .img-manager-modal {
            position: fixed;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            background: #252542;
            padding: 24px;
            border-radius: 16px;
            z-index: 1000000;
            min-width: 320px;
            max-width: 500px;
            display: none;
        }
        .img-manager-modal.visible { display: block; }

        .img-manager-modal h3 {
            margin: 0 0 16px 0;
            color: #eee;
        }

        .img-manager-modal input,
        .img-manager-modal textarea {
            width: 100%;
            padding: 12px;
            margin-bottom: 12px;
            border: 1px solid #444;
            border-radius: 8px;
            background: #1a1a2e;
            color: #eee;
            font-size: 14px;
            box-sizing: border-box;
        }

        .img-manager-modal-btns {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        }

        .img-manager-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
        }
        .img-manager-btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .img-manager-btn-secondary {
            background: #333;
            color: #eee;
        }
        .img-manager-btn-danger {
            background: #dc3545;
            color: white;
        }

        .img-manager-drop-zone {
            border: 2px dashed #444;
            border-radius: 12px;
            padding: 40px;
            text-align: center;
            margin-bottom: 16px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .img-manager-drop-zone:hover,
        .img-manager-drop-zone.dragover {
            border-color: #667eea;
            background: rgba(102, 126, 234, 0.1);
        }

        .img-manager-actions {
            display: flex;
            gap: 8px;
            margin-top: 8px;
            justify-content: center;
        }
        .img-manager-action-btn {
            padding: 4px 8px;
            font-size: 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        .img-manager-back-btn {
            background: none;
            border: none;
            color: #667eea;
            cursor: pointer;
            font-size: 14px;
            margin-bottom: 16px;
            padding: 0;
        }
    `);

    // ==========================================================================
    // UI生成
    // ==========================================================================
    let currentTab = 'characters';
    let selectedCharacter = null;
    let selectedOutfit = null;
    let selectedCategory = null;
    let panelElement = null;
    let overlayElement = null;

    const createUI = () => {
        // オーバーレイ
        overlayElement = createElement('div', { className: 'img-manager-overlay' });
        document.body.appendChild(overlayElement);

        // ヘッダー
        const header = createElement('div', { className: 'img-manager-header' }, [
            createElement('h2', {}, ['📁 画像管理']),
            createElement('button', { className: 'img-manager-close', onClick: () => togglePanel(false) }, ['×'])
        ]);

        // タブ
        const tabCharacters = createElement('button', {
            className: 'img-manager-tab active',
            dataset: { tab: 'characters' },
            onClick: () => switchTab('characters')
        }, ['キャラクター画像']);

        // 背景画像タブ（未実装）
        // const tabBackgrounds = createElement('button', {
        //     className: 'img-manager-tab',
        //     dataset: { tab: 'backgrounds' },
        //     onClick: () => switchTab('backgrounds')
        // }, ['背景画像']);

        const tabs = createElement('div', { className: 'img-manager-tabs' }, [tabCharacters /* , tabBackgrounds */]);

        // コンテンツエリア
        const content = createElement('div', { className: 'img-manager-content', id: 'img-manager-content' });

        // メインパネル
        panelElement = createElement('div', { id: 'img-manager-panel' }, [header, tabs, content]);
        document.body.appendChild(panelElement);

        // オーバーレイクリックで閉じる
        overlayElement.addEventListener('click', () => togglePanel(false));
    };

    const switchTab = (tab) => {
        currentTab = tab;
        panelElement.querySelectorAll('.img-manager-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.tab === tab);
        });
        selectedCharacter = null;
        selectedOutfit = null;
        selectedCategory = null;
        renderContent();
    };

    const togglePanel = (show) => {
        if (show) {
            panelElement.classList.add('visible');
            overlayElement.classList.add('visible');
            renderContent();
        } else {
            panelElement.classList.remove('visible');
            overlayElement.classList.remove('visible');
        }
    };

    // ==========================================================================
    // レンダリング
    // ==========================================================================
    const renderContent = async () => {
        const content = document.getElementById('img-manager-content');
        content.textContent = ''; // 安全にクリア

        if (currentTab === 'characters') {
            if (selectedOutfit) {
                await renderExpressions(content);
            } else if (selectedCharacter) {
                await renderOutfits(content);
            } else {
                await renderCharacters(content);
            }
        }
        // 背景画像タブ（未実装）
        // else {
        //     if (selectedCategory) {
        //         await renderBackgroundImages(content);
        //     } else {
        //         await renderCategories(content);
        //     }
        // }
    };

    // キャラクター一覧
    const renderCharacters = async (content) => {
        const characters = await dbGetAll(STORES.CHARACTERS);

        // フォルダから一括追加ボタン
        if (isFolderUploadSupported()) {
            const folderBtn = createElement('button', {
                className: 'img-manager-folder-btn',
                onClick: handleCharacterFolderUpload
            }, ['📂 フォルダから一括追加']);
            content.appendChild(folderBtn);

            // 説明
            const info = createElement('div', { className: 'img-manager-info' }, [
                '💡 フォルダ構造: キャラクター名/衣装名/画像ファイル'
            ]);
            content.appendChild(info);
        }

        const grid = createElement('div', { className: 'img-manager-grid' });

        // 追加カード
        const addCard = createElement('div', { className: 'img-manager-card img-manager-card-add', onClick: () => showModal('character') }, [
            createElement('div', { style: { fontSize: '32px', marginBottom: '8px' } }, ['➕']),
            createElement('div', { className: 'img-manager-card-title' }, ['キャラクター追加'])
        ]);
        grid.appendChild(addCard);

        // キャラクターカード
        for (const c of characters) {
            const card = createCharacterCard(c);
            grid.appendChild(card);
        }

        content.appendChild(grid);
    };

    // フォルダからキャラクター一括追加ハンドラー
    const handleCharacterFolderUpload = async () => {
        const folderData = await selectCharacterFolder();
        if (!folderData) return;

        if (folderData.outfits.length === 0) {
            alert('選択されたフォルダにサブフォルダ（衣装フォルダ）が見つかりません。\\n\\n構造: キャラクター名/衣装名/画像ファイル');
            return;
        }

        const totalImages = folderData.outfits.reduce((sum, o) => sum + o.images.length, 0);
        if (!confirm(`「${folderData.characterName}」を登録します。\\n\\n衣装: ${folderData.outfits.length}個\\n画像: ${totalImages}枚\\n\\n続行しますか？`)) {
            return;
        }

        // プログレス表示
        const content = document.getElementById('img-manager-content');
        content.textContent = '';

        const progressDiv = createElement('div', { className: 'img-manager-progress' }, [
            createElement('div', { id: 'progress-text' }, ['処理中...']),
            createElement('div', { className: 'img-manager-progress-bar' }, [
                createElement('div', { className: 'img-manager-progress-fill', id: 'progress-fill', style: { width: '0%' } })
            ])
        ]);
        content.appendChild(progressDiv);

        try {
            await bulkUploadFromFolder(folderData, (processed, total) => {
                const percent = Math.round((processed / total) * 100);
                document.getElementById('progress-text').textContent = `処理中... ${processed}/${total} (${percent}%)`;
                document.getElementById('progress-fill').style.width = `${percent}%`;
            });

            alert(`「${folderData.characterName}」を登録しました！\\n\\n衣装: ${folderData.outfits.length}個\\n画像: ${totalImages}枚`);
            renderContent();
        } catch (error) {
            alert('登録に失敗しました: ' + error.message);
            renderContent();
        }
    };

    const createCharacterCard = (c) => {
        // サムネイル用コンテナ
        const thumbnailContainer = createElement('div', {
            className: 'img-manager-card-thumbnail',
            style: {
                width: '100%',
                height: '120px',
                borderRadius: '8px',
                overflow: 'hidden',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#333'
            }
        }, [
            createElement('div', { style: { fontSize: '48px' } }, ['👤'])
        ]);

        // 統計情報用コンテナ
        const statsContainer = createElement('div', {
            className: 'img-manager-card-stats',
            style: { fontSize: '11px', color: '#888', marginTop: '4px' }
        }, ['読み込み中...']);

        const editBtn = createElement('button', {
            className: 'img-manager-action-btn img-manager-btn-secondary',
            onClick: (e) => { e.stopPropagation(); showModal('character', c); }
        }, ['編集']);

        const copyBtn = createElement('button', {
            className: 'img-manager-action-btn img-manager-btn-primary',
            onClick: async (e) => {
                e.stopPropagation();
                try {
                    const data = await getCharacterFullData(c.id);
                    const text = `【画像URL】\n:character/${c.name}/{現在の服装}/{下記の中から最適な表情を選択}\n\n【URLリスト】\n【マークダウンの対象となるキャラクタ】\n${c.name}\n【マークダウンの対象となる対象服装一覧】\n${data.outfits.join('\n')}\n【マークダウンの対象となる対象表情一覧】\n${data.expressions.join('\n')}`;
                    await navigator.clipboard.writeText(text);

                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = '完了!';
                    setTimeout(() => { copyBtn.textContent = originalText; }, 1000);
                } catch (e) {
                    alert('コピーに失敗しました');
                }
            }
        }, ['コピー']);

        const deleteBtn = createElement('button', {
            className: 'img-manager-action-btn img-manager-btn-danger',
            onClick: async (e) => {
                e.stopPropagation();
                if (confirm('このキャラクターを削除しますか？')) {
                    await deleteCharacterCascade(c.id);
                    renderContent();
                }
            }
        }, ['削除']);

        const card = createElement('div', {
            className: 'img-manager-card',
            onClick: () => { selectedCharacter = c; renderContent(); }
        }, [
            thumbnailContainer,
            createElement('div', { className: 'img-manager-card-title' }, [escapeHtml(c.name)]),
            statsContainer,
            createElement('div', { className: 'img-manager-card-desc' }, [escapeHtml(c.description || '')]),
            createElement('div', { className: 'img-manager-actions' }, [copyBtn, editBtn, deleteBtn])
        ]);

        // 非同期でサムネイルと統計情報を読み込み
        (async () => {
            try {
                // サムネイル取得
                const thumbnail = await getCharacterFirstImage(c.id);
                if (thumbnail) {
                    thumbnailContainer.textContent = '';
                    const img = createElement('img', {
                        src: thumbnail.data,
                        alt: c.name,
                        style: { width: '100%', height: '100%', objectFit: 'cover' }
                    });
                    thumbnailContainer.appendChild(img);
                }

                // 統計情報取得
                const stats = await getCharacterStats(c.id);
                statsContainer.textContent = `👗 ${stats.outfitCount}衣装 | 🖼️ ${stats.imageCount}枚`;
            } catch (e) {
                console.warn('統計情報取得失敗:', e);
                statsContainer.textContent = '';
            }
        })();

        return card;
    };

    // 衣装一覧
    const renderOutfits = async (content) => {
        const outfits = await dbGetByIndex(STORES.OUTFITS, 'characterId', selectedCharacter.id);

        const backBtn = createElement('button', { className: 'img-manager-back-btn', onClick: () => { selectedCharacter = null; renderContent(); } }, ['← 戻る']);
        const title = createElement('h3', {}, [`${escapeHtml(selectedCharacter.name)} の衣装`]);

        const grid = createElement('div', { className: 'img-manager-grid' });

        const addCard = createElement('div', { className: 'img-manager-card img-manager-card-add', onClick: () => showModal('outfit') }, [
            createElement('div', { style: { fontSize: '32px', marginBottom: '8px' } }, ['👗']),
            createElement('div', { className: 'img-manager-card-title' }, ['衣装追加'])
        ]);
        grid.appendChild(addCard);

        for (const o of outfits) {
            const card = createOutfitCard(o);
            grid.appendChild(card);
        }

        content.appendChild(backBtn);
        content.appendChild(title);
        content.appendChild(grid);
    };

    const createOutfitCard = (o) => {
        const editBtn = createElement('button', {
            className: 'img-manager-action-btn img-manager-btn-secondary',
            onClick: (e) => { e.stopPropagation(); showModal('outfit', o); }
        }, ['編集']);

        const deleteBtn = createElement('button', {
            className: 'img-manager-action-btn img-manager-btn-danger',
            onClick: async (e) => {
                e.stopPropagation();
                if (confirm('この衣装を削除しますか？')) {
                    await deleteOutfitCascade(o.id);
                    renderContent();
                }
            }
        }, ['削除']);

        return createElement('div', {
            className: 'img-manager-card',
            onClick: () => { selectedOutfit = o; renderContent(); }
        }, [
            createElement('div', { style: { fontSize: '48px', marginBottom: '8px' } }, ['👗']),
            createElement('div', { className: 'img-manager-card-title' }, [escapeHtml(o.name)]),
            createElement('div', { className: 'img-manager-actions' }, [editBtn, deleteBtn])
        ]);
    };

    // 表情画像一覧
    const renderExpressions = async (content) => {
        const images = await dbGetByIndex(STORES.CHARACTER_IMAGES, 'outfitId', selectedOutfit.id);

        const backBtn = createElement('button', { className: 'img-manager-back-btn', onClick: () => { selectedOutfit = null; renderContent(); } }, ['← 戻る']);
        const title = createElement('h3', {}, [`${escapeHtml(selectedCharacter.name)} / ${escapeHtml(selectedOutfit.name)} の表情`]);

        const fileInput = createElement('input', { type: 'file', accept: 'image/*', multiple: true, style: { display: 'none' } });
        const dropZone = createElement('div', { className: 'img-manager-drop-zone' }, [
            '📷 画像をドラッグ＆ドロップ、またはクリックしてアップロード'
        ]);

        dropZone.appendChild(fileInput);
        dropZone.addEventListener('click', () => fileInput.click());
        dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
        dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            handleFiles(e.dataTransfer.files);
        });
        fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

        const grid = createElement('div', { className: 'img-manager-grid' });

        for (const img of images) {
            const card = createImageCard(img, STORES.CHARACTER_IMAGES);
            grid.appendChild(card);
        }

        content.appendChild(backBtn);
        content.appendChild(title);
        content.appendChild(dropZone);
        content.appendChild(grid);
    };

    const createImageCard = (img, storeName) => {
        const imgEl = createElement('img', {
            src: img.data,
            alt: escapeHtml(img.name),
            style: { width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }
        });

        const copyBtn = createElement('button', {
            className: 'img-manager-action-btn img-manager-btn-primary',
            onClick: async (e) => {
                e.stopPropagation();
                let text = '';
                if (storeName === STORES.CHARACTER_IMAGES) {
                    text = `![C](:character/${selectedCharacter.name}/${selectedOutfit.name}/${img.name} "画像")`;
                } else {
                    text = `![B](:background/${selectedCategory.name}/${img.name} "画像")`;
                }
                await navigator.clipboard.writeText(text);
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '完了!';
                setTimeout(() => { copyBtn.textContent = originalText; }, 1000);
            }
        }, ['コピー']);

        const deleteBtn = createElement('button', {
            className: 'img-manager-action-btn img-manager-btn-danger',
            onClick: async (e) => {
                e.stopPropagation();
                if (confirm('この画像を削除しますか？')) {
                    await dbDelete(storeName, img.id);
                    renderContent();
                }
            }
        }, ['削除']);

        return createElement('div', { className: 'img-manager-card' }, [
            imgEl,
            createElement('div', { className: 'img-manager-card-title' }, [escapeHtml(img.name)]),
            createElement('div', { className: 'img-manager-actions' }, [copyBtn, deleteBtn])
        ]);
    };

    // カテゴリー一覧
    const renderCategories = async (content) => {
        const categories = await dbGetAll(STORES.CATEGORIES);

        // フォルダから一括追加ボタン
        if (isFolderUploadSupported()) {
            const folderBtn = createElement('button', {
                className: 'img-manager-folder-btn',
                onClick: handleCategoryFolderUpload
            }, ['📂 フォルダから一括追加']);
            content.appendChild(folderBtn);

            // 説明
            const info = createElement('div', { className: 'img-manager-info' }, [
                '💡 フォルダ名がカテゴリー名になります'
            ]);
            content.appendChild(info);
        }

        const grid = createElement('div', { className: 'img-manager-grid' });

        const addCard = createElement('div', { className: 'img-manager-card img-manager-card-add', onClick: () => showModal('category') }, [
            createElement('div', { style: { fontSize: '32px', marginBottom: '8px' } }, ['📁']),
            createElement('div', { className: 'img-manager-card-title' }, ['カテゴリー追加'])
        ]);
        grid.appendChild(addCard);

        for (const c of categories) {
            const card = createCategoryCard(c);
            grid.appendChild(card);
        }

        content.appendChild(grid);
    };

    // フォルダから背景カテゴリー一括追加ハンドラー
    const handleCategoryFolderUpload = async () => {
        const folderData = await selectImageFolder();
        if (!folderData) return;

        if (!confirm(`「${folderData.folderName}」カテゴリーを作成し、${folderData.images.length}枚の画像を登録します。\\n\\n続行しますか？`)) {
            return;
        }

        // プログレス表示
        const content = document.getElementById('img-manager-content');
        content.textContent = '';

        const progressDiv = createElement('div', { className: 'img-manager-progress' }, [
            createElement('div', { id: 'progress-text' }, ['処理中...']),
            createElement('div', { className: 'img-manager-progress-bar' }, [
                createElement('div', { className: 'img-manager-progress-fill', id: 'progress-fill', style: { width: '0%' } })
            ])
        ]);
        content.appendChild(progressDiv);

        try {
            await bulkUploadBackgroundFromFolder(folderData, (processed, total) => {
                const percent = Math.round((processed / total) * 100);
                document.getElementById('progress-text').textContent = `処理中... ${processed}/${total} (${percent}%)`;
                document.getElementById('progress-fill').style.width = `${percent}%`;
            });

            alert(`「${folderData.folderName}」カテゴリーを作成しました！\\n\\n画像: ${folderData.images.length}枚`);
            renderContent();
        } catch (error) {
            alert('登録に失敗しました: ' + error.message);
            renderContent();
        }
    };

    const createCategoryCard = (c) => {
        // サムネイル用コンテナ
        const thumbnailContainer = createElement('div', {
            className: 'img-manager-card-thumbnail',
            style: {
                width: '100%',
                height: '120px',
                borderRadius: '8px',
                overflow: 'hidden',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#333'
            }
        }, [
            createElement('div', { style: { fontSize: '48px' } }, ['🏞️'])
        ]);

        // 統計情報
        const statsContainer = createElement('div', {
            className: 'img-manager-card-stats',
            style: { fontSize: '11px', color: '#888', marginTop: '4px' }
        }, ['読み込み中...']);

        const editBtn = createElement('button', {
            className: 'img-manager-action-btn img-manager-btn-secondary',
            onClick: (e) => { e.stopPropagation(); showModal('category', c); }
        }, ['編集']);

        const deleteBtn = createElement('button', {
            className: 'img-manager-action-btn img-manager-btn-danger',
            onClick: async (e) => {
                e.stopPropagation();
                if (confirm('このカテゴリーを削除しますか？')) {
                    await deleteCategoryCascade(c.id);
                    renderContent();
                }
            }
        }, ['削除']);

        const card = createElement('div', {
            className: 'img-manager-card',
            onClick: () => { selectedCategory = c; renderContent(); }
        }, [
            thumbnailContainer,
            createElement('div', { className: 'img-manager-card-title' }, [escapeHtml(c.name)]),
            statsContainer,
            createElement('div', { className: 'img-manager-card-desc' }, [escapeHtml(c.description || '')]),
            createElement('div', { className: 'img-manager-actions' }, [editBtn, deleteBtn])
        ]);

        // 非同期で読み込み
        (async () => {
            try {
                const thumbnail = await getCategoryFirstImage(c.id);
                if (thumbnail) {
                    thumbnailContainer.textContent = '';
                    const img = createElement('img', {
                        src: thumbnail.data,
                        alt: c.name,
                        style: { width: '100%', height: '100%', objectFit: 'cover' }
                    });
                    thumbnailContainer.appendChild(img);
                }
                const count = await getCategoryImageCount(c.id);
                statsContainer.textContent = `🖼️ ${count}枚`;
            } catch (e) {
                console.warn('カテゴリー情報取得失敗:', e);
                statsContainer.textContent = '';
            }
        })();

        return card;
    };

    // 背景画像一覧
    const renderBackgroundImages = async (content) => {
        const images = await dbGetByIndex(STORES.BACKGROUND_IMAGES, 'categoryId', selectedCategory.id);

        const backBtn = createElement('button', { className: 'img-manager-back-btn', onClick: () => { selectedCategory = null; renderContent(); } }, ['← 戻る']);
        const title = createElement('h3', {}, [`${escapeHtml(selectedCategory.name)} の画像`]);

        const fileInput = createElement('input', { type: 'file', accept: 'image/*', multiple: true, style: { display: 'none' } });
        const dropZone = createElement('div', { className: 'img-manager-drop-zone' }, [
            '📷 画像をドラッグ＆ドロップ、またはクリックしてアップロード'
        ]);

        dropZone.appendChild(fileInput);
        dropZone.addEventListener('click', () => fileInput.click());
        dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
        dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            handleBackgroundFiles(e.dataTransfer.files);
        });
        fileInput.addEventListener('change', (e) => handleBackgroundFiles(e.target.files));

        const grid = createElement('div', { className: 'img-manager-grid' });

        for (const img of images) {
            const card = createImageCard(img, STORES.BACKGROUND_IMAGES);
            grid.appendChild(card);
        }

        content.appendChild(backBtn);
        content.appendChild(title);
        content.appendChild(dropZone);
        content.appendChild(grid);
    };

    // ==========================================================================
    // モーダル
    // ==========================================================================
    const showModal = (type, editData = null) => {
        const existingModal = document.querySelector('.img-manager-modal');
        if (existingModal) existingModal.remove();

        const isEdit = !!editData;
        let title = '';
        let fields = [];

        const nameInput = createElement('input', {
            type: 'text',
            id: 'modal-name',
            placeholder: type === 'outfit' ? '衣装名' : (type === 'category' ? 'カテゴリー名' : '名前'),
            value: editData?.name || ''
        });

        switch (type) {
            case 'character':
            case 'category':
                title = isEdit ? (type === 'character' ? 'キャラクター編集' : 'カテゴリー編集') : (type === 'character' ? 'キャラクター追加' : 'カテゴリー追加');
                const descInput = createElement('textarea', {
                    id: 'modal-desc',
                    placeholder: '説明（任意）',
                    rows: '3'
                });
                descInput.value = editData?.description || '';
                fields = [nameInput, descInput];
                break;
            case 'outfit':
                title = isEdit ? '衣装編集' : '衣装追加';
                fields = [nameInput];
                break;
        }

        const cancelBtn = createElement('button', {
            className: 'img-manager-btn img-manager-btn-secondary',
            onClick: () => modal.remove()
        }, ['キャンセル']);

        const saveBtn = createElement('button', {
            className: 'img-manager-btn img-manager-btn-primary',
            onClick: async () => {
                const name = document.getElementById('modal-name').value.trim();
                const descEl = document.getElementById('modal-desc');
                const desc = descEl ? descEl.value.trim() : '';

                if (!name) {
                    alert('名前を入力してください');
                    return;
                }

                const now = Date.now();

                switch (type) {
                    case 'character':
                        if (isEdit) {
                            await dbUpdate(STORES.CHARACTERS, { ...editData, name, description: desc, updatedAt: now });
                        } else {
                            await dbAdd(STORES.CHARACTERS, { id: generateId(), name, description: desc, createdAt: now, updatedAt: now });
                        }
                        break;
                    case 'outfit':
                        if (isEdit) {
                            await dbUpdate(STORES.OUTFITS, { ...editData, name, updatedAt: now });
                        } else {
                            await dbAdd(STORES.OUTFITS, { id: generateId(), characterId: selectedCharacter.id, name, createdAt: now, updatedAt: now });
                        }
                        break;
                    case 'category':
                        if (isEdit) {
                            await dbUpdate(STORES.CATEGORIES, { ...editData, name, description: desc, updatedAt: now });
                        } else {
                            await dbAdd(STORES.CATEGORIES, { id: generateId(), name, description: desc, createdAt: now, updatedAt: now });
                        }
                        break;
                }

                modal.remove();
                renderContent();
            }
        }, [isEdit ? '更新' : '追加']);

        const btnsDiv = createElement('div', { className: 'img-manager-modal-btns' }, [cancelBtn, saveBtn]);

        const modal = createElement('div', { className: 'img-manager-modal visible' }, [
            createElement('h3', {}, [title]),
            ...fields,
            btnsDiv
        ]);

        document.body.appendChild(modal);
    };

    // ==========================================================================
    // ファイル処理
    // ==========================================================================
    const handleFiles = async (files) => {
        for (const file of files) {
            if (!file.type.startsWith('image/')) continue;
            const data = await fileToBase64(file);
            const name = file.name.replace(/\.[^/.]+$/, '');
            await dbAdd(STORES.CHARACTER_IMAGES, {
                id: generateId(),
                outfitId: selectedOutfit.id,
                name,
                data,
                mimeType: file.type,
                size: file.size,
                createdAt: Date.now()
            });
        }
        renderContent();
    };

    const handleBackgroundFiles = async (files) => {
        for (const file of files) {
            if (!file.type.startsWith('image/')) continue;
            const data = await fileToBase64(file);
            const name = file.name.replace(/\.[^/.]+$/, '');
            await dbAdd(STORES.BACKGROUND_IMAGES, {
                id: generateId(),
                categoryId: selectedCategory.id,
                name,
                data,
                mimeType: file.type,
                size: file.size,
                createdAt: Date.now()
            });
        }
        renderContent();
    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    // ==========================================================================
    // カスケード削除
    // ==========================================================================
    const deleteCharacterCascade = async (characterId) => {
        const outfits = await dbGetByIndex(STORES.OUTFITS, 'characterId', characterId);
        for (const outfit of outfits) {
            await deleteOutfitCascade(outfit.id);
        }
        await dbDelete(STORES.CHARACTERS, characterId);
    };

    const deleteOutfitCascade = async (outfitId) => {
        const images = await dbGetByIndex(STORES.CHARACTER_IMAGES, 'outfitId', outfitId);
        for (const img of images) {
            await dbDelete(STORES.CHARACTER_IMAGES, img.id);
        }
        await dbDelete(STORES.OUTFITS, outfitId);
    };

    const deleteCategoryCascade = async (categoryId) => {
        const images = await dbGetByIndex(STORES.BACKGROUND_IMAGES, 'categoryId', categoryId);
        for (const img of images) {
            await dbDelete(STORES.BACKGROUND_IMAGES, img.id);
        }
        await dbDelete(STORES.CATEGORIES, categoryId);
    };

    // ==========================================================================
    // 初期化
    // ==========================================================================
    const init = async () => {
        try {
            await openDB();
            createUI();
            GM_registerMenuCommand('📁 画像管理を開く', () => togglePanel(true));
            console.log('[画像管理ツール] 初期化完了');
        } catch (err) {
            console.error('[画像管理ツール] 初期化エラー:', err);
        }
    };

    init();
})();
