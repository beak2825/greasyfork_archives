// ==UserScript==
// @name            Bluesky Follower Multi-Comparer
// @icon            data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⛄</text></svg>
// @description     Compare followers using a public API that requires no authentication.
// @description:ja  認証不要のパブリックAPIを使用してフォロワーを比較します。
// @namespace       https://bsky.app/profile/neon-ai.art
// @homepage        https://neon-aiart.github.io/
// @version         1.7
// @author          ねおん
// @match           https://bsky.app/*
// @grant           GM_addStyle
// @run-at          document-idle
// @license         CC BY-NC 4.0
// @downloadURL https://update.greasyfork.org/scripts/559742/Bluesky%20Follower%20Multi-Comparer.user.js
// @updateURL https://update.greasyfork.org/scripts/559742/Bluesky%20Follower%20Multi-Comparer.meta.js
// ==/UserScript==

/**
 * ==============================================================================
 * IMPORTANT NOTICE / 重要事項
 * ==============================================================================
 * Copyright (c) 2024 ねおん (Neon)
 * Released under the CC BY-NC 4.0 License.
 * * [EN] Unauthorized re-uploading, modification of authorship, or removal of 
 * author credits is strictly prohibited. If you fork this project, you MUST 
 * retain the original credits.
 * * [JP] 無断転載、作者名の書き換え、およびクレジットの削除は固く禁じます。
 * 本スクリプトを改変・配布する場合は、必ず元の作者名（ねおん）を明記してください。
 * ==============================================================================
 */

(function() {
    'use strict';

    const SCRIPT_VERSION = '1.7';

    // --- CSS Styles ---
    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

        #bsky-compare-panel {
            position: fixed; bottom: 20px; left: 20px; width: 360px; max-height: 85vh;
            background: #ffffff; border: 1px solid #e1e8ed; border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2); z-index: 99998;
            display: none; flex-direction: column; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            overflow: hidden;
        }
        #bsky-compare-panel.active { display: flex; }

        /* Header */
        .compare-header { background: #2563eb; color: white; padding: 14px; font-weight: bold; display: flex; justify-content: space-between; align-items: center; }

        /* Body & Scrollbar */
        .compare-body { padding: 15px; overflow-y: auto; flex-grow: 1; }
        .compare-body::-webkit-scrollbar { width: 6px; }
        .compare-body::-webkit-scrollbar-thumb { background: #cfd9de; border-radius: 3px; }

        /* Form */
        .input-group { margin-bottom: 12px; }
        .input-group label { display: block; font-size: 11px; color: #536471; margin-bottom: 4px; font-weight: 600; }
        .input-group input { width: 100%; padding: 10px; border: 1px solid #cfd9de; border-radius: 8px; box-sizing: border-box; font-size: 14px; }
        .input-group input:focus { border-color: #2563eb; outline: none; }

        .btn-run { width: 100%; padding: 12px; background: #2563eb; color: white; border: none; border-radius: 25px; cursor: pointer; font-weight: bold; margin-top: 10px; font-size: 14px; transition: opacity 0.2s; }
        .btn-run:hover { opacity: 0.9; }
        .btn-run:disabled { background: #cfd9de; cursor: not-allowed; }

        .status-msg {
            font-size: 12px;
            color: #2563eb;
            text-align: center;
            white-space: pre-wrap;
            overflow-wrap: break-word;
            overflow: auto;
            word-break: break-word;
            padding: 6px;
            font-weight: bold;
            line-height: 1.4;
            min-height: 18px;
        }

        /* Results */
        .compare-results { margin-top: 20px; border-top: 1px solid #eff3f4; padding-top: 10px; }

        .result-item-container { border-bottom: 1px solid #f0f3f5; }
        .result-item { padding: 12px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: background 0.2s; border-radius: 8px; }
        .result-item:hover { background: #f7f9f9; }
        .result-label { font-size: 13px; font-weight: 500; color: #0f1419; }
        .result-count { background: #eff3f4; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 700; color: #536471; }

        /* 詳細リスト表示エリア */
        .result-details { display: none; padding: 0 12px 12px 12px; background: #f8fafb; border-radius: 0 0 8px 8px; }
        .result-details.active { display: block; }
        .detail-actions { display: flex; justify-content: flex-end; padding: 8px 0; border-bottom: 1px solid #e1e8ed; margin-bottom: 8px; }
        .btn-csv { font-size: 11px; background: #fff; border: 1px solid #cfd9de; padding: 4px 8px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 4px; }
        .btn-csv:hover { background: #f1f5f9; }

        /* result-item がアクティブ（詳細展開中）の時のスタイル */
        .result-item.active {
            background: #f0f7ff;
            border-left: 4px solid #2563eb;
            border-radius: 8px 8px 0 0;
        }

        /* IDリスト */
        .id-list {
            max-height: 200px;
            overflow-y: auto;
            font-size: 12px;
            color: #536471;
            line-height: 1.8; /* 行間を広めに */
            word-break: break-all;
            display: flex;
            flex-direction: column; /* 縦に並べる（改行） */
            gap: 4px;
            padding: 8px;
            background: #ffffff;
            border: 1px solid #e1e8ed;
            border-radius: 4px;
        }
        .id-link-item {
            display: flex;
            align-items: center;
            padding: 8px;
            text-decoration: none;
            border-bottom: 1px solid #f0f3f5;
            transition: background 0.2s;
            position: relative;
            user-select: text; /* テキスト選択を許可 */
            -webkit-user-drag: none; /* ドラッグを防止 */
        }
        .id-link-item:hover {
            background: #f1f5f9;
        }
        .id-link-item:hover .list-handle {
            text-decoration: underline;
            color: #2563eb; /* ホバー時にハンドルを少し青くしてリンク感を出す */
        }
        .list-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            margin-right: 10px;
            background-color: #f1f5f9;
            -webkit-user-drag: none;
        }
        .list-user-info {
            display: flex;
            flex-direction: column;
            overflow: hidden;
            flex-grow: 1;
            }
        .list-display-name {
            font-size: 13px;
            font-weight: bold;
            color: #0f1419;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .list-handle {
            font-size: 11px;
            color: #536471;
        }

        /* コピーボタン */
        .btn-copy-id {
            display: none;
            position: absolute;
            right: 8px;
            background: #fff;
            border: 1px solid #cfd9de;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            flex-shrink: 0;
            padding: 0px;
            cursor: pointer;
            color: #536471;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            align-items: center;
            justify-content: center;
            line-height: 1;
        }
        /* コピーボタン内のアイコンサイズを個別に指定 */
        .btn-copy-id .material-symbols-outlined {
            font-size: 18px !important; /* 強制的にサイズを上書き */
            width: 18px;
            height: 18px;
            line-height: 18px;
            display: block;
        }
        .id-link-item:hover .btn-copy-id {
            display: flex;
        }
        .btn-copy-id:hover {
            background: #2563eb;
            color: #fff;
            border-color: #2563eb;
        }

        /* Sidebar Trigger Button */
        .sidebar-trigger {
            flex-direction: row;
            align-items: center;
            padding: 12px;
            border-radius: 9999px;
            gap: 8px;
            cursor: pointer;
            transition: opacity 0.1s;
            display: flex;
            text-decoration: none;
            background: #2563eb;
            color: white;
            margin-top: 4px; /* 他のボタンとの間隔微調整 */
        }

        .sidebar-trigger:hover {
            opacity: 0.9;
        }

        /* アイコンコンテナを24x24に固定 */
        .sidebar-trigger-icon-wrapper {
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            display: flex;
            flex-shrink: 0;
        }

        /* テキストスタイルを完全に一致させる */
        .sidebar-trigger-label {
            font-size: 18.8px;
            letter-spacing: 0px;
            color: white;
            font-weight: 400;
            line-height: 18.8px;
            font-family: InterVariable, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            white-space: nowrap;
        }

        /* アイコンサイズの調整 */
        .sidebar-trigger-icon-wrapper .material-symbols-outlined {
            font-size: 28px; /* Blueskyの標準アイコンサイズに合わせる */
        }

        @media (max-width: 1300px) {
            .sidebar-trigger-label {
                display: none;
            }
            .sidebar-trigger {
                justify-content: center;
                width: 48px;
                height: 48px;
                padding: 0;
                margin: 0 auto 8px auto;
            }
        }
    `);

    // --- UI Setup ---
    const panel = document.createElement('div');
    panel.id = 'bsky-compare-panel';
    panel.innerHTML = `
        <div class="compare-header">
            <span>Follower Multi-Comparer v${SCRIPT_VERSION}</span>
            <button id="close-panel" style="background:none; border:none; color:white; cursor:pointer; font-size: 18px;">✕</button>
        </div>
        <div class="compare-body">
            <div class="input-group"><label>アカウントA (必須)</label><input type="text" id="acc-a" placeholder="@user-a.bsky.social"></div>
            <div class="input-group"><label>アカウントB (必須)</label><input type="text" id="acc-b" placeholder="@user-b.bsky.social"></div>
            <div class="input-group"><label>アカウントC (任意)</label><input type="text" id="acc-c" placeholder="@user-c.bsky.social"></div>
            <button class="btn-run" id="run-compare">比較を開始</button>
            <div id="status-display" class="status-msg"></div>
            <div id="results-display" class="compare-results"></div>
        </div>
    `;
    document.body.appendChild(panel);

    // --- Auto-fill Utilities ---
    const getMyHandle = () => {
        const profileLink = document.querySelector('nav[role="navigation"] a[href^="/profile/"]');
        if (profileLink) {
            const handle = profileLink.getAttribute('href').replace('/profile/', '');
            return handle ? `@${handle}` : '';
        }
        return '';
    };


    /**
     * URLから現在表示中のプロフィールのハンドルを取得する
     * bsky.app/profile/xxx.bsky.social -> @xxx.bsky.social
     */
    const getCurrentPageHandle = () => {
        const pathParts = window.location.pathname.split('/');
        // /profile/handle.name の形式をチェック
        if (pathParts[1] === 'profile' && pathParts[2]) {
            // パスからDIDまたはハンドルを取得（URLエンコードされている場合を考慮）
            const handle = decodeURIComponent(pathParts[2]);
            return handle ? `@${handle}` : '';
        }
        return '';
    };

    const autoFillInputs = () => {
        const inputA = document.getElementById('acc-a');
        const inputB = document.getElementById('acc-b');
        const inputC = document.getElementById('acc-c');

        const myHandle = getMyHandle();
        const pageHandle = getCurrentPageHandle();

        // アカウントAが空欄、かつBとCに自分がいない場合、自分を入れる
        if (myHandle && !inputA.value && inputB.value !== myHandle && inputC.value !== myHandle) {
            inputA.value = myHandle;
        }

        // アカウントBが空欄、かつAとCに現在のページのアカウントがいない場合、その人を入れる
        if (pageHandle && !inputB.value && inputA.value !== pageHandle && inputC.value !== pageHandle) {
            inputB.value = pageHandle;
        }
    };

    // --- UIの開閉ロジック ---

    // 1. パネルを閉じる共通関数
    const hidePanel = () => {
        if (panel) panel.classList.remove('active');
    };

    // 2. トリガーボタンのイベント設定（injectTrigger関数内で行うか、後から上書き）
    const setupTriggerEvent = (targetTrigger) => {
        if (!targetTrigger) return;
        targetTrigger.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation(); // documentのクリックイベントに流さない
            const isActive = panel.classList.toggle('active');
            if (isActive) {
                autoFillInputs();
            }
        };
    };

    // 3. ✕ボタン（close-panel）のイベント設定
    const closeBtn = document.getElementById('close-panel');
    if (closeBtn) {
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            hidePanel();
        };
    }

    // 4. パネル自体のクリックで閉じないように設定
    panel.onclick = (e) => {
        e.stopPropagation();
    };

    // 5. 外側クリック判定（documentレベルで監視）
    document.addEventListener('click', (e) => {
        if (!panel.classList.contains('active')) return;

        // クリックされた要素がパネル自体に含まれず、かつトリガーボタンでもなければ閉じる
        const currentTrigger = document.getElementById('compare-trigger');
        const isClickInsidePanel = panel.contains(e.target);
        const isClickOnTrigger = currentTrigger && currentTrigger.contains(e.target);

        if (!isClickInsidePanel && !isClickOnTrigger) {
            hidePanel();
        }
    }, true); // Captureモードで確実に拾う

    // 6. ページ遷移（URL変更）時にパネルを閉じる
    let lastUrl = location.href;
    const navObserver = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            hidePanel();
        }
    });
    navObserver.observe(document.body, { subtree: true, childList: true });

    // サイドバーにボタンを注入する関数
    const injectTrigger = () => {
        if (document.getElementById('compare-trigger')) return;

        const nav = document.querySelector('nav[role="navigation"]');
        if (!nav) return;

        // 「設定」ボタンを取得（これを基準に挿入）
        const settingsLink = nav.querySelector('a[href="/settings"]');
        if (!settingsLink) return;

        const trigger = document.createElement('div');
        trigger.id = 'compare-trigger';
        trigger.className = 'sidebar-trigger';
        trigger.setAttribute('aria-label', 'フォロワー比較');

        trigger.innerHTML = `
            <div class="sidebar-trigger-icon-wrapper">
                <span class="material-symbols-outlined">balance</span>
            </div>
            <div dir="auto" class="sidebar-trigger-label">比較</div>
        `;

        setupTriggerEvent(trigger); // Using the common function

        settingsLink.parentNode.insertBefore(trigger, settingsLink.nextSibling);
    };

    // 監視の開始
    const sideObserver = new MutationObserver(() => {
        injectTrigger();
    });
    sideObserver.observe(document.body, { subtree: true, childList: true });
    injectTrigger(); // 初回実行

    // --- Utility ---
    const cleanHandle = (h) => h.startsWith('@') ? h.substring(1) : h;

    const downloadCSV = (label, list) => {
        const header = "display_name,handle\n";
        const rows = list.map(u => `"${u.displayName.replace(/"/g, '""')}","${u.handle}"`).join("\n");
        const csvContent = "data:text/csv;charset=utf-8," + header + rows;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `bsky_followers_${label}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- API Core (Using Public API) ---
    const fetchFollowers = async (handle) => {
        if (!handle) return new Map();
        const status = document.getElementById('status-display');
        const targetHandle = cleanHandle(handle);

        let followers = new Map();
        let cursor = null;

        try {
            while (true) {
                status.innerText = `${targetHandle} を取得中... (${followers.size.toLocaleString()}人)`;
                // 認証不要のパブリックAppView APIを使用
                const url = `https://public.api.bsky.app/xrpc/app.bsky.graph.getFollowers?actor=${encodeURIComponent(targetHandle)}&limit=100${cursor ? `&cursor=${cursor}` : ''}`;

                const res = await fetch(url);
                if (res.status === 429) {
                    status.innerText = '制限中... 待機しています。';
                    await new Promise(r => setTimeout(r, 5000));
                    continue;
                }

                if (!res.ok) {
                    const errData = await res.json().catch(() => ({}));
                    throw new Error(`APIエラー (${res.status}): ${errData.message || '取得できませんでした'}`);
                }

                const data = await res.json();
                data.followers.forEach(f => {
                    followers.set(f.did, {
                        handle: f.handle,
                        displayName: f.displayName || f.handle,
                        avatar: f.avatar || ''
                    });
                });

                cursor = data.cursor;
                if (!cursor) break;

                // パブリックAPIはレート制限に配慮して少し待ちを入れる
                await new Promise(r => setTimeout(r, 300));
            }
            return followers;
        } catch (e) {
            status.style.color = '#d00';
            throw e;
        }
    };

    const runComparison = async () => {
        const btn = document.getElementById('run-compare');
        const status = document.getElementById('status-display');
        const resultsDiv = document.getElementById('results-display');

        const rawA = document.getElementById('acc-a').value.trim();
        const rawB = document.getElementById('acc-b').value.trim();
        const rawC = document.getElementById('acc-c').value.trim();

        if (!rawA || !rawB) {
            status.style.color = '#d00';
            status.innerText = 'エラー: AとBは必須入力です';
            return;
        }

        try {
            btn.disabled = true;
            status.style.color = '#2563eb';
            resultsDiv.innerHTML = '';

            // 各アカウントのフォロワーを取得
            const mapA = await fetchFollowers(rawA);
            const mapB = await fetchFollowers(rawB);
            const mapC = rawC ? await fetchFollowers(rawC) : new Map();

            status.innerText = 'データを照合しています...';

            const a = cleanHandle(rawA);
            const b = cleanHandle(rawB);
            const c = rawC ? cleanHandle(rawC) : '';

            const allDids = new Set([...mapA.keys(), ...mapB.keys(), ...mapC.keys()]);
            const groups = {
                all: { label: '3人全員共通', list: [] },
                ab: { label: 'AとBのみ共通', list: [] },
                bc: { label: 'BとCのみ共通', list: [] },
                ac: { label: 'AとCのみ共通', list: [] },
                onlyA: { label: `${a} のみ`, list: [] },
                onlyB: { label: `${b} のみ`, list: [] },
                onlyC: { label: `${c} のみ`, list: [] }
            };

            allDids.forEach(did => {
                const inA = mapA.has(did);
                const inB = mapB.has(did);
                const inC = mapC.has(did);
                const userData = mapA.get(did) || mapB.get(did) || mapC.get(did);

                // ロジック判定
                if (inA && inB && (c ? inC : false)) groups.all.list.push(userData);
                else if (inA && inB && !inC) groups.ab.list.push(userData);
                else if (!inA && inB && inC) groups.bc.list.push(userData);
                else if (inA && !inB && inC) groups.ac.list.push(userData);
                else if (inA && !inB && !inC) groups.onlyA.list.push(userData);
                else if (!inA && inB && !inC) groups.onlyB.list.push(userData);
                else if (!inA && !inB && inC) groups.onlyC.list.push(userData);
            });

            status.innerText = '完了！項目クリックで一覧を表示します。';

            Object.values(groups).forEach(group => {
                if (group.list.length === 0) return;

                const container = document.createElement('div');
                container.className = 'result-item-container';

                const row = document.createElement('div');
                row.className = 'result-item';
                row.innerHTML = `<span class="result-label">${group.label}</span><span class="result-count">${group.list.length.toLocaleString()}人</span>`;

                const details = document.createElement('div');
                details.className = 'result-details';
                details.innerHTML = `
                    <div class="detail-actions">
                        <button class="btn-csv"><span class="material-symbols-outlined" style="font-size:14px">download</span>CSV保存</button>
                    </div>
                    <div class="id-list"></div>
                `;

                const idListContainer = details.querySelector('.id-list');
                group.list.forEach(userData => {
                    const idItem = document.createElement('a');
                    idItem.href = `https://bsky.app/profile/${userData.handle}`;
                    idItem.target = "_blank";
                    idItem.className = 'id-link-item';
                    idItem.innerHTML = `
                        <img src="${userData.avatar || 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png'}" class="list-avatar">
                        <div class="list-user-info">
                            <div class="list-display-name">${userData.displayName}</div>
                            <div class="list-handle">@${userData.handle}</div>
                        </div>
                        <button class="btn-copy-id" title="ハンドルをコピー">
                            <span class="material-symbols-outlined" style="font-size:16px display:block;">content_copy</span>
                        </button>
                    `;

                    // コピーボタンのロジック
                    const copyBtn = idItem.querySelector('.btn-copy-id');
                    copyBtn.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const handleText = `@${userData.handle}`;
                        // クリップボードへのコピー
                        const tempInput = document.createElement('input');
                        tempInput.value = handleText;
                        document.body.appendChild(tempInput);
                        tempInput.select();
                        document.execCommand('copy');
                        document.body.removeChild(tempInput);

                        // 一時的なアイコン変化
                        const originalIcon = copyBtn.innerHTML;
                        copyBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size:14px">check</span>';
                        setTimeout(() => {
                            copyBtn.innerHTML = originalIcon;
                        }, 1500);
                    };

                    idListContainer.appendChild(idItem);
                });

                row.onclick = () => {
                    // 自分以外の全ての詳細を閉じ、アクティブクラスを外す
                    document.querySelectorAll('.result-details').forEach(d => {
                        if (d !== details) d.classList.remove('active');
                    });
                    document.querySelectorAll('.result-item').forEach(r => {
                        if (r !== row) r.classList.remove('active');
                    });

                    // 自分の状態をトグル
                    const isActive = details.classList.toggle('active');
                    row.classList.toggle('active', isActive);
                };

                details.querySelector('.btn-csv').onclick = (e) => {
                    e.stopPropagation();
                    downloadCSV(group.label, group.list);
                };

                container.appendChild(row);
                container.appendChild(details);
                resultsDiv.appendChild(container);
            });

        } catch (e) {
            status.style.color = '#d00';
            status.innerText = `エラー: ${e.message}`;
        } finally {
            btn.disabled = false;
        }
    };

    document.getElementById('run-compare').onclick = runComparison;

})();