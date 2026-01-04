// ==UserScript==
// @name        ニコニコ動画 フォロー新着拡張ツール
// @namespace   https://greasyfork.org/ja/users/1519380-yofumin
// @version     1.0.0
// @description シリーズとマイリストの動画をタイムラインに差分挿入します。あとで見るリストの続きから再生機能、ソース管理UIも搭載。
// @author      yofumin
// @license     MIT
// @match       https://www.nicovideo.jp/my*
// @match       https://www.nicovideo.jp/tag/%E7%B6%9A%E3%81%8D%E3%81%8B%E3%82%89%E5%86%8D%E7%94%9F
// @icon        https://resource.video.nimg.jp/uni/images/favicon/32.png
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @connect     nvapi.nicovideo.jp
// @connect     secure-dcdn.cdn.nimg.jp
// @downloadURL https://update.greasyfork.org/scripts/556882/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%20%E3%83%95%E3%82%A9%E3%83%AD%E3%83%BC%E6%96%B0%E7%9D%80%E6%8B%A1%E5%BC%B5%E3%83%84%E3%83%BC%E3%83%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/556882/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%20%E3%83%95%E3%82%A9%E3%83%AD%E3%83%BC%E6%96%B0%E7%9D%80%E6%8B%A1%E5%BC%B5%E3%83%84%E3%83%BC%E3%83%AB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ---------------- HTMLエスケープ関数 ----------------
    function escapeHtml(unsafe) {
        if (unsafe == null) return '';
        return String(unsafe)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // ---------------- 設定 ----------------
    const WATCH_LATER_HISTORY_KEY = 'niconico_watch_later_history';
    const SOURCE_DATA_KEY = 'niconico_timeline_sources_data';
    const SOURCE_CACHE_KEY = 'niconico_timeline_sources_cache';
    const DEBOUNCE_MS = 600;

    const baseButtonStyle = `padding: 4px 8px; font-size: 12px; font-weight: bold; color: #fff; border: none; border-radius: 4px; cursor: pointer; transition: background-color .2s; text-decoration: none; display: block; width: 80px; text-align: center;`;
    const watchLaterButtonStyle = `${baseButtonStyle} background-color: #007bff;`;
    const processedButtonStyle = `${baseButtonStyle} background-color: #28a745; cursor: default;`;
    const listPlayButtonStyle = `${baseButtonStyle} background-color: #17a2b8;`;
    const fixedButtonStyleBase = `position:fixed; right:10px; z-index:9999; padding:8px 12px; font-size:14px; font-weight:bold; color:#fff; border:none; border-radius:4px; cursor:pointer; transition:background-color .2s;`;
    const fixedContinuationButtonStyle = `${fixedButtonStyleBase} top:70px; background-color:#fd7e14;`;
    const sourceManagerButtonStyle = `${fixedButtonStyleBase} top: 120px; background-color: #6c757d;`;

    // ---------------- 状態 ----------------
    let csrfToken = null;
    let allSourceVideos = [];
    let timelineRoot = null;
    let mainObserver = null;
    let integrationTimer = null;
    let minVisibleOriginalDate = null;
    let deferredVideos = [];
    let sourceDataForModal = [];
    let isSourceDataChanged = false;

    // SPA監視用
    let spaObserver = null;
    let currentPath = location.href;
    let isRunning = false; // 現在タイムライン拡張が稼働中か

    const log = (...args) => {}; // 公開用ログ無効化

    // ---------------- ヘルパー ----------------
    function getHistory() { try { return JSON.parse(GM_getValue(WATCH_LATER_HISTORY_KEY, '{}')); } catch { return {}; } }
    function saveHistory(h) { try { GM_setValue(WATCH_LATER_HISTORY_KEY, JSON.stringify(h)); } catch {} }
    function addVideoToHistory(v) { const h = getHistory(); h[v] = Date.now(); saveHistory(h); }
    function cleanupOldHistory() { const h = getHistory(), n = Date.now(), e = 30 * 86400000; let c=false; for(const v in h){ if(n-h[v]>e){ delete h[v]; c=true;} } if(c) saveHistory(h); }
    function formatDuration(totalSeconds) { const m = Math.floor((totalSeconds||0) / 60); const s = (totalSeconds||0) % 60; return `${m}:${String(s).padStart(2,'0')}`; }
    function parseNicoTime(timeString) { if (!timeString || typeof timeString !== 'string') return null; const now = new Date(); const t = timeString.trim(); let m; if ((m = t.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{1,2})$/))) { const [, y, mo, d, hh, mm] = m.map(Number); return new Date(y, mo-1, d, hh, mm); } if ((m = t.match(/(\d+)日前/))) { const days = parseInt(m[1],10); const dt = new Date(now); dt.setDate(now.getDate() - days); return dt; } if ((m = t.match(/(\d+)時間前/))) { const h = parseInt(m[1],10); const dt = new Date(now); dt.setHours(now.getHours() - h); return dt; } if ((m = t.match(/(\d+)分前/))) { const mm = parseInt(m[1],10); const dt = new Date(now); dt.setMinutes(now.getMinutes() - mm); return dt; } if ((m = t.match(/(\d+)秒前/))) { const s = parseInt(m[1],10); const dt = new Date(now); dt.setSeconds(now.getSeconds() - s); return dt; } return null; }
    function findCsrfToken() { try { const el = document.getElementById('js-initial-userpage-data'); if (!el) throw new Error('初期データ要素が見つからない'); const data = JSON.parse(el.getAttribute('data-environment')); return data?.csrfToken || null; } catch (e) { return null; } }
    function loadSourceCache() { try { return JSON.parse(GM_getValue(SOURCE_CACHE_KEY, '{}')); } catch { return {}; } }
    function saveSourceCache(cache) { try { GM_setValue(SOURCE_CACHE_KEY, JSON.stringify(cache)); } catch {} }

    // ---------------- API: 通信とソース取得 ----------------
    function nicoApiRequest(options) {
        return new Promise((resolve, reject) => {
            const defaultHeaders = { "X-Frontend-Id": "6", "X-Frontend-Version": "0", "Accept": "application/json", "X-Request-With": "XMLHttpRequest" };
            if (csrfToken) { defaultHeaders["X-Csrf-Token"] = csrfToken; }
            GM_xmlhttpRequest({
                ...options,
                headers: { ...defaultHeaders, ...options.headers },
                onload: (res) => {
                    try {
                        if (res.status >= 200 && res.status < 300) {
                            resolve(res.responseText ? JSON.parse(res.responseText) : {});
                        } else {
                            const errData = res.responseText ? JSON.parse(res.responseText) : {};
                            reject({ status: res.status, message: errData?.meta?.errorMessage || 'APIエラー', response: errData });
                        }
                    } catch (e) { reject({ status: -1, message: 'レスポンス解析失敗', error: e }); }
                },
                onerror: (err) => reject({ status: -2, message: '通信エラー', error: err })
            });
        });
    }

    async function fetchAllSourceVideos() {
        allSourceVideos = [];
        const sourceCache = loadSourceCache();
        let isCacheUpdated = false;

        try {
            const raw = GM_getValue(SOURCE_DATA_KEY, '[]');
            const sourceList = JSON.parse(raw);
            if (!Array.isArray(sourceList) || sourceList.length === 0) return [];

            const promises = sourceList.map(async (source) => {
                const isSeries = source.type === 'series';
                const cacheKey = `${source.type}_${source.id}`;
                const apiUrlBase = isSeries ? `https://nvapi.nicovideo.jp/v2/series/${source.id}` : `https://nvapi.nicovideo.jp/v2/mylists/${source.id}`;

                try {
                    const metaRes = await nicoApiRequest({ method: "GET", url: `${apiUrlBase}?pageSize=1&page=1` });
                    const totalCount = isSeries ? (metaRes.data?.totalCount || 0) : (metaRes.data?.mylist?.totalItemCount || 0);
                    const cachedSource = sourceCache[cacheKey];

                    if (cachedSource && cachedSource.totalCount === totalCount && cachedSource.items) return cachedSource.items;

                    if (totalCount === 0) {
                        sourceCache[cacheKey] = { totalCount: 0, items: [] };
                        isCacheUpdated = true;
                        return [];
                    }

                    let fullItems = [];
                    const sortParams = isSeries ? `&sortKey=registeredAt&sortOrder=asc` : `&sortKey=addedAt&sortOrder=asc`;

                    if (isSeries) {
                        const videosRes = await nicoApiRequest({ method: "GET", url: `${apiUrlBase}?pageSize=${totalCount}&${sortParams}` });
                        fullItems = videosRes.data?.items || [];
                    } else {
                        const pageSize = 100;
                        const totalPages = Math.ceil(totalCount / pageSize);
                        const pagePromises = Array.from({ length: totalPages }, (_, i) =>
                            nicoApiRequest({ method: "GET", url: `${apiUrlBase}?pageSize=${pageSize}&page=${i + 1}&${sortParams}` })
                        );
                        const pageResults = await Promise.all(pagePromises);
                        fullItems = pageResults.flatMap(res => res.data?.mylist?.items || []);
                    }

                    const itemsForCache = fullItems.slice(-20);
                    sourceCache[cacheKey] = { totalCount, items: itemsForCache };
                    isCacheUpdated = true;
                    return fullItems;

                } catch (e) {
                    console.error(`[source] fetch failed for ${source.type} id=${source.id}`, e);
                    return [];
                }
            });

            const settled = await Promise.allSettled(promises);
            allSourceVideos = settled.flatMap(s => s.status === 'fulfilled' ? s.value : []);
            if (isCacheUpdated) saveSourceCache(sourceCache);
            return allSourceVideos;
        } catch (e) {
            console.error('fetchAllSourceVideos error', e);
            return [];
        }
    }

    // ---------------- UI: モーダル管理 ----------------
    function createModalUI() {
        if (document.getElementById('custom-modal-overlay')) return; // 既に作成済みならスキップ

        const modalStyle = `
            .custom-modal-hidden { display: none !important; }
            #custom-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.6); z-index: 10000; }
            #custom-modal-content { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 600px; max-height: 80vh; display: flex; flex-direction: column; background-color: #2e2e2e; color: #fff; padding: 20px 30px; border-radius: 8px; z-index: 10001; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
            #custom-modal-content h2, #custom-modal-content h3 { margin-top: 0; border-bottom: 1px solid #555; padding-bottom: 10px; font-weight: bold; flex-shrink: 0; }
            #custom-modal-content h3 { border: none; margin-bottom: 10px; padding-bottom: 0; }
            #custom-modal-content hr { border: 0; border-top: 1px solid #555; margin: 20px 0; flex-shrink: 0; }

            #custom-modal-source-list { flex-grow: 1; overflow-y: auto; margin-bottom: 10px; border: 1px solid #555; border-radius: 4px; background-color: #383838; }
            #custom-modal-source-list ul { list-style: none; padding: 0; margin: 0; }
            #custom-modal-source-list li { padding: 8px 12px; border-bottom: 1px solid #555; font-size: 14px; }
            #custom-modal-source-list li:last-child { border-bottom: none; }

            #custom-modal-source-list .source-type-label { font-size: 11px; background-color: #555; color: #ddd; padding: 2px 5px; border-radius: 3px; margin-right: 8px; }
            #custom-modal-source-list button { color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; transition: background-color .2s; }
            #custom-modal-source-list button.delete-btn { background-color: #dc3545; }
            #custom-modal-source-list button.delete-btn:hover { background-color: #c82333; }

            .custom-cache-list { display: none; background-color: #222; margin-top: 8px; padding: 10px; border-radius: 4px; font-size: 12px; }
            .custom-cache-list.active { display: block; }
            .custom-cache-list .cache-item { border-bottom: 1px solid #444; padding: 4px 0; color: #ccc; }
            .custom-cache-list .cache-item:last-child { border-bottom: none; }
            .custom-cache-list a { color: #8ab4f8; text-decoration: none; }
            .custom-cache-list a:hover { text-decoration: underline; }
            .source-link { color: #8ab4f8; margin-left: 8px; text-decoration: none; font-size: 12px; }
            .custom-btn-secondary { background-color: #6c757d; margin-right: 5px; }
            .custom-btn-secondary:hover { background-color: #5a6268; }

            .custom-add-source-form { display: flex; gap: 10px; flex-shrink: 0; }
            .custom-add-source-form input { flex-grow: 1; padding: 8px; border-radius: 4px; border: 1px solid #555; background-color: #222; color: #fff; }
            .custom-add-source-form button { background-color: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; transition: background-color .2s; }
            .custom-add-source-form button:hover { background-color: #0056b3; }
            .custom-add-source-form button:disabled { background-color: #555; cursor: not-allowed; }
            .custom-source-type-selector { margin-bottom: 10px; flex-shrink: 0; }
            .custom-source-type-selector label { margin-right: 15px; cursor: pointer; }
            .custom-modal-footer { text-align: right; margin-top: 20px; flex-shrink: 0; }
            .custom-modal-footer button { background-color: #17a2b8; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; transition: background-color .2s; font-size: 14px; }
            .custom-modal-footer button:hover { background-color: #117a8b; }
        `;
        const styleEl = document.createElement('style');
        styleEl.textContent = modalStyle;
        document.head.appendChild(styleEl);

        const modalHtml = `
            <div id="custom-modal-overlay" class="custom-modal-hidden"></div>
            <div id="custom-modal-content" class="custom-modal-hidden">
                <h2>ソース管理 (シリーズ / マイリスト)</h2>
                <div id="custom-modal-source-list"></div>
                <hr>
                <h3>新しいソースを追加</h3>
                <div class="custom-source-type-selector">
                  <label><input type="radio" name="source_type" value="series" checked> シリーズ</label>
                  <label><input type="radio" name="source_type" value="mylist"> マイリスト</label>
                </div>
                <div class="custom-add-source-form">
                    <input type="text" id="custom-new-source-id-input" placeholder="シリーズID or マイリストID (例: 12345)">
                    <button id="custom-add-source-button">追加</button>
                </div>
                <div class="custom-modal-footer">
                    <button id="custom-close-modal-button">保存して閉じる</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        setupModalEventListeners();
    }

    function createSourceManagerButton() {
        if (document.getElementById('edit-sources-button')) return;
        const managerBtn = document.createElement('button');
        managerBtn.id = 'edit-sources-button';
        managerBtn.textContent = 'ソース管理';
        managerBtn.style.cssText = sourceManagerButtonStyle;
        managerBtn.addEventListener('mouseover', () => managerBtn.style.backgroundColor = '#5a6268');
        managerBtn.addEventListener('mouseout', () => managerBtn.style.backgroundColor = '#6c757d');
        document.body.appendChild(managerBtn);
        // ボタンクリックイベントはsetupModalEventListenersでバインド済みだが、ボタン再作成時は再度必要
        managerBtn.addEventListener('click', openModal);
    }

    function setupModalEventListeners() {
        // ボタンが存在しない可能性があるのでdocument経由ではなく、存在チェックが必要だが、
        // createSourceManagerButtonで個別にbindするためここではモーダル内部のイベントのみ
        document.getElementById('custom-modal-overlay').addEventListener('click', closeModal);
        document.getElementById('custom-close-modal-button').addEventListener('click', closeModal);
        document.getElementById('custom-add-source-button').addEventListener('click', addSource);
        document.getElementById('custom-new-source-id-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addSource(); } });
    }

    function openModal() {
        isSourceDataChanged = false;
        try { sourceDataForModal = JSON.parse(GM_getValue(SOURCE_DATA_KEY, '[]')); } catch { sourceDataForModal = []; }
        renderModalList();
        document.getElementById('custom-modal-overlay').classList.remove('custom-modal-hidden');
        document.getElementById('custom-modal-content').classList.remove('custom-modal-hidden');
    }

    function closeModal() {
        if (isSourceDataChanged) {
            GM_setValue(SOURCE_DATA_KEY, JSON.stringify(sourceDataForModal));
            alert('ソース情報を更新しました。ページをリロードします。');
            location.reload();
        } else {
            document.getElementById('custom-modal-overlay').classList.add('custom-modal-hidden');
            document.getElementById('custom-modal-content').classList.add('custom-modal-hidden');
        }
    }

    function renderModalList() {
        const listContainer = document.getElementById('custom-modal-source-list');
        if (sourceDataForModal.length === 0) { listContainer.textContent = '現在登録されているソースはありません。'; return; }
        const sourceCache = loadSourceCache();
        const ul = document.createElement('ul');

        sourceDataForModal.forEach(s => {
            const typeLabel = s.type === 'series' ? 'シリーズ' : 'マイリスト';
            const cacheKey = `${s.type}_${s.id}`;
            const cachedData = sourceCache[cacheKey];
            const cachedCount = cachedData ? cachedData.items.length : 0;
            const totalCount = cachedData ? cachedData.totalCount : '-';

            const li = document.createElement('li');
            li.style.flexDirection = 'column';
            li.style.alignItems = 'stretch';

            const headerDiv = document.createElement('div');
            headerDiv.style.display = 'flex';
            headerDiv.style.justifyContent = 'space-between';
            headerDiv.style.alignItems = 'center';

            const infoDiv = document.createElement('div');
            const typeLabelSpan = document.createElement('span');
            typeLabelSpan.className = 'source-type-label';
            typeLabelSpan.textContent = typeLabel;
            const titleSpan = document.createElement('span');
            titleSpan.textContent = `${s.title}`;

            const sourceUrl = s.type === 'series' ? `https://www.nicovideo.jp/series/${s.id}` : `https://www.nicovideo.jp/mylist/${s.id}`;
            const linkAnchor = document.createElement('a');
            linkAnchor.href = sourceUrl;
            linkAnchor.target = '_blank';
            linkAnchor.rel = 'noopener noreferrer';
            linkAnchor.textContent = '[↗]';
            linkAnchor.className = 'source-link';
            linkAnchor.title = '元のページを開く';

            infoDiv.appendChild(typeLabelSpan);
            infoDiv.appendChild(titleSpan);
            infoDiv.appendChild(linkAnchor);

            const btnDiv = document.createElement('div');
            const detailButton = document.createElement('button');
            detailButton.textContent = `詳細 (${cachedCount}/${totalCount})`;
            detailButton.className = 'custom-btn-secondary';
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '削除';
            deleteButton.className = 'delete-btn';
            deleteButton.addEventListener('click', () => deleteSource(s.id, s.type));

            btnDiv.appendChild(detailButton);
            btnDiv.appendChild(deleteButton);

            headerDiv.appendChild(infoDiv);
            headerDiv.appendChild(btnDiv);

            const cacheListDiv = document.createElement('div');
            cacheListDiv.className = 'custom-cache-list';

            if (cachedCount > 0) {
                cachedData.items.forEach(item => {
                    const vid = item.video;
                    const row = document.createElement('div');
                    row.className = 'cache-item';
                    const dateStr = new Date(item.addedAt || vid.registeredAt).toLocaleString('ja-JP', {year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit'});
                    row.innerHTML = `
                        <span style="color:#888; font-family:monospace; margin-right:8px;">${dateStr}</span>
                        <a href="https://www.nicovideo.jp/watch/${vid.id}" target="_blank">${escapeHtml(vid.title)}</a>
                    `;
                    cacheListDiv.appendChild(row);
                });
            } else {
                cacheListDiv.textContent = 'キャッシュされた動画はありません';
                cacheListDiv.style.color = '#888';
            }

            detailButton.addEventListener('click', () => {
                if (cacheListDiv.classList.contains('active')) cacheListDiv.classList.remove('active');
                else cacheListDiv.classList.add('active');
            });

            li.appendChild(headerDiv);
            li.appendChild(cacheListDiv);
            ul.appendChild(li);
        });

        listContainer.replaceChildren();
        listContainer.appendChild(ul);
    }

    async function addSource() {
        const input = document.getElementById('custom-new-source-id-input');
        const addButton = document.getElementById('custom-add-source-button');
        const sourceType = document.querySelector('input[name="source_type"]:checked').value;
        const newId = (input.value || '').trim().replace(/^(series|mylist)\//, '');

        if (!/^\d+$/.test(newId)) { alert('IDは数字で入力してください。'); return; }
        if (sourceDataForModal.some(s => s.id === newId && s.type === sourceType)) { alert('このソースは既に追加されています。'); return; }

        addButton.disabled = true; addButton.textContent = '追加中...';
        try {
            const isSeries = sourceType === 'series';
            const apiUrl = isSeries ? `https://nvapi.nicovideo.jp/v2/series/${newId}` : `https://nvapi.nicovideo.jp/v2/mylists/${newId}`;
            const data = await nicoApiRequest({ method: "GET", url: apiUrl });
            const sourceTitle = isSeries ? data.data.detail.title : data.data.mylist.name;
            sourceDataForModal.push({ type: sourceType, id: newId, title: sourceTitle });
            isSourceDataChanged = true;
            input.value = '';
            renderModalList();
        } catch (error) {
            console.error("ソース追加エラー:", error);
            alert(`ソースの追加に失敗しました。IDを確認してください。`);
        } finally {
            addButton.disabled = false; addButton.textContent = '追加';
        }
    }

    function deleteSource(idToDelete, typeToDelete) {
        if(!confirm('本当に削除しますか？')) return;
        sourceDataForModal = sourceDataForModal.filter(s => !(s.id === idToDelete && s.type === typeToDelete));
        isSourceDataChanged = true;
        const sourceCache = loadSourceCache();
        const cacheKey = `${typeToDelete}_${idToDelete}`;
        if (sourceCache[cacheKey]) { delete sourceCache[cacheKey]; saveSourceCache(sourceCache); }
        renderModalList();
    }

    // ---------------- UI: カスタム要素作成 ----------------
    function createCustomItemFromSource(itemData) {
        if (!itemData || !itemData.video) return null;
        const v = itemData.video;
        const owner = v.owner || { id: '#', name: '投稿者不明', iconUrl: '' };
        const el = document.createElement('div');
        el.className = 'TimelineItem Timeline-item TimelineItem_video custom-generated-item';
        const article = document.createElement('article');
        article.className = 'TimelineItem-item';

        const iconDiv = document.createElement('div');
        iconDiv.className = 'TimelineItem-icon';
        const iconLink = document.createElement('a');
        iconLink.href = `/user/${escapeHtml(owner.id)}`;
        iconLink.target = '_blank';
        iconLink.rel = 'noopener noreferrer';
        const thumbnailDiv = document.createElement('div');
        thumbnailDiv.className = 'Thumbnail TimelineItem-senderIcon Thumbnail_sizeCover';
        const thumbnailImage = document.createElement('div');
        thumbnailImage.className = 'Thumbnail-image';
        thumbnailImage.style.backgroundImage = `url('${escapeHtml(owner.iconUrl)}')`;
        thumbnailDiv.appendChild(thumbnailImage);
        iconLink.appendChild(thumbnailDiv);
        iconDiv.appendChild(iconLink);

        const bodyDiv = document.createElement('div');
        bodyDiv.className = 'TimelineItem-body';
        const headerDiv = document.createElement('div');
        headerDiv.className = 'TimelineItem-header';
        const headerInnerDiv = document.createElement('div');
        const senderLink = document.createElement('a');
        senderLink.className = 'TimelineItem-senderName';
        senderLink.href = `/user/${escapeHtml(owner.id)}`;
        senderLink.target = '_blank';
        senderLink.rel = 'noopener noreferrer';
        senderLink.textContent = owner.name;
        const timeSpan = document.createElement('span');
        timeSpan.className = 'TimelineItem-activityCreatedAt';
        timeSpan.textContent = new Date(itemData.addedAt || v.registeredAt).toLocaleString('ja-JP', {year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'});
        headerInnerDiv.appendChild(senderLink);
        headerInnerDiv.appendChild(timeSpan);
        headerDiv.appendChild(headerInnerDiv);
        const messageDiv = document.createElement('div');
        messageDiv.className = 'TimelineItem-activityMessage';
        messageDiv.textContent = '動画を投稿しました (登録ソース)';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'TimelineItem-content';
        const contentLink = document.createElement('a');
        contentLink.href = `/watch/${escapeHtml(v.id)}`;
        contentLink.target = '_blank';
        contentLink.rel = 'noopener noreferrer';
        contentLink.className = 'TimelineItem-contentBody';
        const videoThumbnailDiv = document.createElement('div');
        videoThumbnailDiv.className = 'TimelineVideoThumbnail';
        const videoImageDiv = document.createElement('div');
        videoImageDiv.className = 'TimelineVideoThumbnail-image';
        videoImageDiv.style.backgroundImage = `url('${escapeHtml(v.thumbnail?.largeUrl || '')}')`;
        const durationDiv = document.createElement('div');
        durationDiv.className = 'NC-VideoLength TimelineVideoThumbnail-VideoLength';
        durationDiv.textContent = formatDuration(v.duration);
        videoImageDiv.appendChild(durationDiv);
        videoThumbnailDiv.appendChild(videoImageDiv);
        contentLink.appendChild(videoThumbnailDiv);
        const titleDiv = document.createElement('div');
        titleDiv.className = 'TimelineItem-contentTitle';
        titleDiv.textContent = v.title;

        contentDiv.appendChild(contentLink);
        contentDiv.appendChild(titleDiv);
        bodyDiv.appendChild(headerDiv);
        bodyDiv.appendChild(messageDiv);
        bodyDiv.appendChild(contentDiv);
        article.appendChild(iconDiv);
        article.appendChild(bodyDiv);
        el.appendChild(article);
        processItem(el, v.id);
        return el;
    }

    function processItem(item, videoId) {
        if (!item || !videoId || item.classList.contains('custom-layout-applied')) return;
        item.classList.add('custom-layout-applied');
        const contentEl = item.querySelector('.TimelineItem-content');
        const titleEl = item.querySelector('.TimelineItem-contentTitle');
        const thumbnailLinkEl = item.querySelector('.TimelineItem-contentBody');
        if (!contentEl || !titleEl || !thumbnailLinkEl) return;

        contentEl.style.position = 'relative';
        contentEl.style.display = 'flex';
        contentEl.style.alignItems = 'flex-start';
        contentEl.style.gap = '8px';
        thumbnailLinkEl.style.flexShrink = '0';

        const titleWrapper = document.createElement('div');
        titleWrapper.style.display = 'flex';
        titleWrapper.style.alignItems = 'flex-start';
        titleWrapper.style.flex = '1';
        titleWrapper.style.minWidth = '0';

        const history = getHistory();
        const processed = !!history[videoId];
        const watchLaterBtn = document.createElement('button');
        watchLaterBtn.textContent = processed ? '追加処理済' : 'あとで見る';
        watchLaterBtn.style.cssText = processed ? processedButtonStyle : watchLaterButtonStyle;
        watchLaterBtn.style.writingMode = 'vertical-rl';
        watchLaterBtn.style.textOrientation = 'mixed';
        watchLaterBtn.style.width = '40px';
        watchLaterBtn.style.marginRight = '8px';
        watchLaterBtn.style.flexShrink = '0';
        watchLaterBtn.style.display = 'flex';
        watchLaterBtn.style.alignItems = 'center';
        watchLaterBtn.style.justifyContent = 'center';
        watchLaterBtn.style.boxSizing = 'border-box';
        setTimeout(() => { try { watchLaterBtn.style.height = thumbnailLinkEl.offsetHeight + 'px'; } catch(e){} }, 0);
        watchLaterBtn.disabled = !!processed;
        if (!processed) {
            watchLaterBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); performAddToWatchLater_API(watchLaterBtn, videoId); });
            watchLaterBtn.addEventListener('mouseover', () => { if (!watchLaterBtn.disabled) watchLaterBtn.style.backgroundColor = '#0056b3'; });
            watchLaterBtn.addEventListener('mouseout', () => { if (!watchLaterBtn.disabled) watchLaterBtn.style.backgroundColor = '#007bff'; });
        }
        titleWrapper.appendChild(watchLaterBtn);
        titleWrapper.appendChild(titleEl);
        thumbnailLinkEl.insertAdjacentElement('afterend', titleWrapper);

        const playlistBtn = document.createElement('a');
        playlistBtn.href = `https://www.nicovideo.jp/watch/${videoId}?playlist=eyJ0eXBlIjoid2F0Y2hsYXRlciIsImNvbnRleHQiOnsic29ydEtleSI6ImFkZGVkQXQiLCJzb3J0T3JkZXIiOiJhc2MifX0&ref=pc_mypage_watchlater&continuous=1`;
        playlistBtn.target = '_blank';
        playlistBtn.rel = 'noopener noreferrer';
        playlistBtn.textContent = 'リスト再生';
        playlistBtn.style.cssText = listPlayButtonStyle;
        playlistBtn.style.position = 'absolute';
        playlistBtn.style.bottom = '8px';
        playlistBtn.style.right = '8px';
        playlistBtn.style.zIndex = '10';
        playlistBtn.addEventListener('mouseover', () => playlistBtn.style.backgroundColor = '#117a8b');
        playlistBtn.addEventListener('mouseout', () => playlistBtn.style.backgroundColor = '#17a2b8');
        playlistBtn.addEventListener('click', (e) => e.stopPropagation());
        contentEl.appendChild(playlistBtn);
    }

    async function performAddToWatchLater_API(buttonElement, videoId) {
        if (!csrfToken) { alert('CSRFがありません'); return; }
        buttonElement.textContent = '追加中...'; buttonElement.disabled = true;
        try {
            await nicoApiRequest({
                method: "POST", url: "https://nvapi.nicovideo.jp/v1/users/me/watch-later",
                headers: { "Content-Type": "application/json" }, data: JSON.stringify({ watchId: videoId }),
            });
            addVideoToHistory(videoId);
            buttonElement.textContent = '追加処理済';
            buttonElement.style.cssText = processedButtonStyle;
        } catch (err) {
            console.error('「あとで見る」追加失敗:', err);
            alert(`追加失敗: ${err.message || '不明なエラー'}`);
            buttonElement.textContent = 'あとで見る'; buttonElement.disabled = false;
        }
    }

    // ---------------- API: あとで見る一覧取得 ----------------
    async function fetchWatchLaterIds() {
        try {
            const res = await nicoApiRequest({
                method: "GET",
                url: "https://nvapi.nicovideo.jp/v1/users/me/watch-later?pageSize=100&page=1"
            });
            return (res.data?.watchLater?.items || []).map(item => item.watchId);
        } catch (e) {
            console.error('[TL拡張] あとで見る取得失敗:', e);
            return [];
        }
    }

    // ---------------- 続きから再生 ----------------
    async function findAndPlayContinuation(button) {
        if (button) { button.textContent = '履歴とリストを照合中...'; button.disabled = true; }
        try {
            const historyPromise = nicoApiRequest({ method: "GET", url: `https://nvapi.nicovideo.jp/v1/users/me/watch/history?pageSize=100&page=1` });
            const watchLaterPromise = fetchWatchLaterIds();
            const [historyRes, watchLaterIds] = await Promise.all([historyPromise, watchLaterPromise]);

            const watchHistoryItems = historyRes.data.items || [];
            if (!watchHistoryItems.length) throw new Error('視聴履歴がありません');
            const watchLaterSet = new Set(watchLaterIds);
            if (!watchLaterSet.size) throw new Error('「あとで見る」に動画がありません');
            const cont = watchHistoryItems.find(item => watchLaterSet.has(item.watchId));

            if (cont) {
                const basePosition = cont.playbackPosition || 0;
                const seek = basePosition > 0 ? Math.max(0, basePosition - 60) : 0;
                const playlistParams = 'playlist=eyJ0eXBlIjoid2F0Y2hsYXRlciIsImNvbnRleHQiOnsic29ydEtleSI6ImFkZGVkQXQiLCJzb3J0T3JkZXIiOiJhc2MifX0&ref=pc_mypage_watchlater&continuous=1';
                const url = `https://www.nicovideo.jp/watch/${cont.watchId}?${playlistParams}&from=${Math.floor(seek)}`;
                if (button) window.open(url, '_blank');
                else window.location.href = url;
            } else {
                throw new Error('履歴の中に「あとで見る」登録動画が見つかりませんでした');
            }
        } catch (err) {
            console.error(err);
            if (button) alert(err.message || 'エラーが発生しました');
        } finally {
            if (button) { button.textContent = '「あとで見る」の続きから再生'; button.disabled = false; }
        }
    }

    function createContinuationButton() {
        if (document.querySelector('.custom-continuation-button')) return;
        const b = document.createElement('button');
        b.className = 'custom-continuation-button';
        b.textContent = '「あとで見る」の続きから再生';
        b.style.cssText = fixedContinuationButtonStyle;
        b.addEventListener('click', () => findAndPlayContinuation(b));
        b.addEventListener('mouseover', () => !b.disabled && (b.style.backgroundColor = '#e66a00'));
        b.addEventListener('mouseout', () => !b.disabled && (b.style.backgroundColor = '#fd7e14'));
        document.body.appendChild(b);
    }

    // ---------------- 差分挿入ロジック ----------------
    function integrateDiffWithCutoff() {
        if (!timelineRoot) return;
        const originalNodes = Array.from(timelineRoot.querySelectorAll('.TimelineItem_video:not(.custom-generated-item)'));
        const originalData = originalNodes.map(node => {
            const timeEl = node.querySelector('.TimelineItem-activityCreatedAt');
            const linkEl = node.querySelector('.TimelineItem-contentBody');
            const date = timeEl ? parseNicoTime(timeEl.textContent) : null;
            const idMatch = linkEl ? (linkEl.href.match(/(sm|so|nm|im)\d+/) || [null])[0] : null;
            return { node, date, videoId: idMatch };
        }).filter(x => x.date && x.videoId);

        originalData.forEach(od => { processItem(od.node, od.videoId); });
        if (!originalData.length) return;
        const oldest = originalData.reduce((acc, cur) => cur.date < acc ? cur.date : acc, originalData[0].date);
        minVisibleOriginalDate = oldest;

        const presentIds = new Set(Array.from(timelineRoot.querySelectorAll('.TimelineItem-contentBody')).map(el => (el.href.match(/(sm|so|nm|im)\d+/) || [null])[0]).filter(Boolean));
        const sourceVideosSorted = Array.from(allSourceVideos).sort((a,b) => new Date(b.addedAt || b.video.registeredAt) - new Date(a.addedAt || a.video.registeredAt));
        const newDeferred = [];

        for (const item of sourceVideosSorted) {
            const vid = item.video.id;
            if (presentIds.has(vid)) continue;
            const itemDate = new Date(item.addedAt || item.video.registeredAt);
            if (minVisibleOriginalDate && itemDate.getTime() < minVisibleOriginalDate.getTime()) {
                newDeferred.push(item); continue;
            }
            let inserted = false;
            for (const od of originalData) {
                if (od.date.getTime() <= itemDate.getTime()) {
                    const newEl = createCustomItemFromSource(item);
                    if (newEl) { od.node.parentNode.insertBefore(newEl, od.node); presentIds.add(vid); inserted = true; }
                    break;
                }
            }
            if (!inserted) {
                const refNode = timelineRoot.querySelector('.TimelineItem_video') || timelineRoot.querySelector('.Timeline-more');
                if (refNode?.parentNode) {
                    const newEl = createCustomItemFromSource(item);
                    if (newEl) { refNode.parentNode.insertBefore(newEl, refNode); presentIds.add(vid); }
                }
            }
        }
        deferredVideos = newDeferred;
    }

    // ---------------- 監視ロジック ----------------
    function scheduleIntegrate() {
        if (integrationTimer) clearTimeout(integrationTimer);
        integrationTimer = setTimeout(() => {
            try { integrateDiffWithCutoff(); } catch (e) { console.error('integrate error', e); }
        }, DEBOUNCE_MS);
    }

    function setupMainObserver() {
        if (!timelineRoot) return;
        if (mainObserver) try { mainObserver.disconnect(); } catch (e) {}
        mainObserver = new MutationObserver((mutations) => {
            let sawRelevant = false;
            for (const m of mutations) {
                if (m.type !== 'childList') continue;
                for (const node of m.addedNodes) {
                    if (node.nodeType === 1 && (node.matches('.Timeline-activitiesByTime, .TimelineItem_video, .Timeline-divider') || node.querySelector('.TimelineItem_video'))) {
                        sawRelevant = true;
                        break;
                    }
                }
                if (sawRelevant) break;
            }
            if (sawRelevant) { scheduleIntegrate(); }
        });
        mainObserver.observe(timelineRoot, { childList: true, subtree: true });
    }

    // ---------------- SPA / ページ初期化ロジック ----------------

    // タイムラインページの初期化処理（ページ遷移のたびに呼ばれる）
    async function activateTimelineFeatures() {
        if (isRunning) return; // 既に動いていれば何もしない

        // DOMが完全に描画されるのを少し待つ
        const checkExist = setInterval(async () => {
            const first = document.querySelector('.TimelineItem_video');
            if (first) {
                clearInterval(checkExist);
                timelineRoot = first.closest('.Timeline');
                if (!timelineRoot) return;

                isRunning = true;
                csrfToken = findCsrfToken();
                cleanupOldHistory();

                // ボタン類を再配置
                createContinuationButton();
                createSourceManagerButton();

                // ソース取得と統合
                await fetchAllSourceVideos();
                try { integrateDiffWithCutoff(); } catch (e) { console.error('初回integrate error', e); }

                setupMainObserver();

                // さらに表示ボタンの監視
                document.body.addEventListener('click', handleLoadMoreClick, true);
            }
        }, 500);
    }

    function handleLoadMoreClick(e) {
        if (e.target.closest('.Timeline-more')) {
            setTimeout(scheduleIntegrate, 300);
        }
    }

    // ページから離脱したときのクリーンアップ
    function deactivateTimelineFeatures() {
        if (!isRunning) return;
        isRunning = false;

        if (mainObserver) {
            mainObserver.disconnect();
            mainObserver = null;
        }

        document.body.removeEventListener('click', handleLoadMoreClick, true);

        // 固定ボタンを削除
        document.querySelectorAll('.custom-continuation-button, #edit-sources-button').forEach(el => el.remove());

        timelineRoot = null;
    }

    // SPA遷移の検知
    function handleSpaTransition() {
        const isTimelinePage = location.pathname === '/my' || location.pathname.startsWith('/my/timeline');
        // ニコニコのDOM構造上、Timeline要素があるかどうかで判断するのが確実
        const hasTimelineElement = document.querySelector('.Timeline') !== null;

        if (isTimelinePage) {
            // DOM描画待ちを含めてactivateを呼ぶ
            activateTimelineFeatures();
        } else {
            deactivateTimelineFeatures();
        }
    }

    // 最初に1回だけ実行する初期化
    function globalInitialize() {
        createModalUI(); // CSSとモーダルのHTMLは最初に一度だけ注入

        // SPA監視設定
        spaObserver = new MutationObserver(() => {
            if (location.href !== currentPath) {
                currentPath = location.href;
                handleSpaTransition(); // URLが変わった
            } else if (document.querySelector('.Timeline') && !isRunning) {
                // URLが変わってなくてもタイムラインが出現した場合（戻るボタンなど）
                handleSpaTransition();
            }
        });

        spaObserver.observe(document.body, { childList: true, subtree: true });

        // 初回実行
        handleSpaTransition();
    }

    // ---------------- 実行 ----------------

    if (window.location.pathname.startsWith('/tag/')) {
        // タグページの場合
        window.addEventListener('load', async () => {
            setTimeout(async () => { findAndPlayContinuation(null); }, 1000);
        });
    } else {
        // マイページ(SPA)の場合
        globalInitialize();
    }

})();