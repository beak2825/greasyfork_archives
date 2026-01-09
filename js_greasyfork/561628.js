// ==UserScript==
// @name         Hitomi.la Type Filter UI
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  ボタン生成、ドロップダウン生成、そしてConfigモーダルの構築と制御。
// ==/UserScript==

(function(window) {
    'use strict';

    if (typeof window.HitomiFilterStorage === 'undefined' || 
        typeof window.HitomiFilterUtils === 'undefined' ||
        typeof window.HitomiFilterLogic === 'undefined') {
        console.error('Hitomi.la Type Filter UI: Dependencies not loaded.');
        return;
    }

    const Storage = window.HitomiFilterStorage;
    const Utils = window.HitomiFilterUtils;
    const Logic = window.HitomiFilterLogic;

    function createTypeButtons(container) {
        Utils.TYPE_BUTTONS.forEach(typeData => {
            const btn = document.createElement('div');
            btn.className = 'type-filter-btn';
            btn.dataset.type = typeData.value;
            btn.dataset.state = 'neutral';
            btn.dataset.baseColor = typeData.color;

            const colorIndicator = document.createElement('div');
            colorIndicator.className = 'color-indicator';
            colorIndicator.style.backgroundColor = typeData.color;

            const content = document.createElement('div');
            content.className = 'btn-content';
            const label = document.createElement('span');
            label.className = 'btn-label';
            label.textContent = typeData.label;
            content.appendChild(colorIndicator);
            content.appendChild(label);

            const actionArea = document.createElement('div');
            actionArea.className = 'action-area';

            const leftArea = document.createElement('div');
            leftArea.className = 'click-area left';
            leftArea.title = 'この作品タイプを含める';
            leftArea.innerHTML = '<span>Include</span>';
            leftArea.addEventListener('click', (e) => {
                e.stopPropagation();
                Logic.toggleState(btn, 'include');
                Logic.updateSearchQuery();
                Logic.saveCurrentButtonStates();
            });

            const rightArea = document.createElement('div');
            rightArea.className = 'click-area right';
            rightArea.title = 'この作品タイプを除外';
            rightArea.innerHTML = '<span>Exclude</span>';
            rightArea.addEventListener('click', (e) => {
                e.stopPropagation();
                Logic.toggleState(btn, 'exclude');
                Logic.updateSearchQuery();
                Logic.saveCurrentButtonStates();
            });

            actionArea.appendChild(leftArea);
            actionArea.appendChild(rightArea);
            btn.appendChild(content);
            btn.appendChild(actionArea);
            container.appendChild(btn);
        });
    }

    function createToolButtons(container) {
        // Japanese
        const langBtn = document.createElement('div');
        langBtn.className = 'tool-btn lang-btn';
        langBtn.textContent = 'Japanese';
        langBtn.title = '「language:japanese」を追加';
        langBtn.addEventListener('click', () => {
            Logic.toggleLanguage('japanese');
            Logic.saveCurrentButtonStates();
        });
        container.appendChild(langBtn);

        // Blacklist
        const dropdownWrapper = document.createElement('div');
        dropdownWrapper.className = 'dropdown-wrapper';
        const dropBtn = document.createElement('div');
        dropBtn.className = 'tool-btn dropdown-btn';
        dropBtn.textContent = 'Blacklist ▼';
        dropBtn.title = '除外リストを表示';
        const dropContent = document.createElement('div');
        dropContent.className = 'dropdown-content';

        dropBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropContent.classList.toggle('show');
            dropBtn.textContent = dropContent.classList.contains('show') ? 'Blacklist ▲' : 'Blacklist ▼';
        });

        // Helper to render dropdown
        function renderDropdownItems() {
            dropContent.innerHTML = '';
            const currentList = Storage.loadSettings().excludeList;
            currentList.forEach(tag => {
                const div = document.createElement('div');
                div.className = 'dropdown-item';
                div.textContent = tag;
                div.dataset.value = tag;
                div.addEventListener('click', (e) => {
                    e.stopPropagation();
                    Logic.toggleExclusionTag(tag);
                    Logic.saveCurrentButtonStates();
                });
                dropContent.appendChild(div);
            });
        }
        renderDropdownItems();
        // Export this so Config Modal can call it
        window.HitomiFilterUI_renderDropdown = renderDropdownItems;

        dropdownWrapper.appendChild(dropBtn);
        dropdownWrapper.appendChild(dropContent);
        container.appendChild(dropdownWrapper);

        document.addEventListener('click', () => {
            dropContent.classList.remove('show');
            dropBtn.textContent = 'Blacklist ▼';
        });

        // Series Filter
        const seriesFilterBtn = document.createElement('div');
        seriesFilterBtn.className = 'tool-btn series-filter-btn';
        seriesFilterBtn.textContent = 'Series Filter';
        seriesFilterBtn.title = 'Series が Original / N/A 以外を非表示';
        
        let settings = Storage.loadSettings();
        let isSeriesFilterActive = settings.states.seriesFilter || false;
        if(!settings.syncMode) isSeriesFilterActive = false;
        if(isSeriesFilterActive) seriesFilterBtn.classList.add('active');

        seriesFilterBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Toggle Logic
            const isActive = seriesFilterBtn.classList.contains('active');
            if (!isActive) {
                seriesFilterBtn.classList.add('active');
                Logic.applySeriesFilter();
                Storage.updateState('seriesFilter', true);
            } else {
                seriesFilterBtn.classList.remove('active');
                Logic.resetSeriesFilter();
                Storage.updateState('seriesFilter', false);
            }
        });
        container.appendChild(seriesFilterBtn);

        // Config
        const configBtn = document.createElement('div');
        configBtn.className = 'tool-btn config-btn';
        configBtn.innerHTML = '⚙ Config';
        configBtn.title = '設定';
        configBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openConfigModal();
        });
        container.appendChild(configBtn);
    }

    function openConfigModal() {
        if(document.getElementById('hitomi-filter-modal-overlay')) return;
        const currentSettings = Storage.loadSettings();
        
        let tempSites = JSON.parse(JSON.stringify(currentSettings.externalSites));
        let tempBlacklist = currentSettings.excludeList.join('\n');
        let tempSyncMode = currentSettings.syncMode;

        const initialBlacklist = tempBlacklist;
        const initialSitesStr = JSON.stringify(tempSites);

        const overlay = document.createElement('div');
        overlay.id = 'hitomi-filter-modal-overlay';
        const modal = document.createElement('div');
        modal.id = 'hitomi-filter-modal';
        
        modal.innerHTML = `
            <div class="modal-header">
                <div class="modal-title">
                    <span>Hitomi Filter Settings</span>
                    <div class="sync-switch-wrapper ${tempSyncMode ? '' : 'off'}" id="sync-wrapper">
                        <span>Auto-Sync: <span id="sync-text">${tempSyncMode ? 'ON' : 'OFF'}</span></span>
                        <label class="switch">
                            <input type="checkbox" id="sync-switch" ${tempSyncMode ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
                <div class="modal-close">×</div>
            </div>
            <div class="modal-body">
                <div class="modal-section">
                    <label class="modal-label">Blacklist (Exclude Tags)</label>
                    <div class="modal-desc">1行に1つのタグを入力してください</div>
                    <textarea id="config-blacklist" class="modal-textarea"></textarea>
                </div>
                <div class="modal-section">
                    <label class="modal-label">External Sites</label>
                    <div class="modal-desc">
                         <strong>Label</strong>: ボタン名, <strong>URL</strong>: 検索URL (%query% が検索語句)<br>
                         <strong>Space</strong>: スペース置換文字<br>
                         ※PCは左端のハンドルをドラッグ、スマホ/タブレットは矢印で並び替え
                    </div>
                    <div class="site-list" id="site-list-container"></div>
                    <div class="btn-add-site" id="btn-add-site">+ Add New Site</div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-modal btn-cancel">Cancel</button>
                <button class="btn-modal btn-save">Save & Close</button>
            </div>
        `;
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        const siteContainer = modal.querySelector('#site-list-container');
        const blacklistArea = modal.querySelector('#config-blacklist');
        blacklistArea.value = tempBlacklist;

        function updateTempSitesFromDOM() {
            const rows = Array.from(siteContainer.querySelectorAll('.site-row'));
            const newSites = [];
            rows.forEach(row => {
                const index = parseInt(row.dataset.index, 10);
                const currentSite = {
                    label: row.querySelector('.site-label').value,
                    url: row.querySelector('.site-url').value,
                    spaceReplacement: row.querySelector('.site-space-select').value
                };
                newSites.push(currentSite);
            });
            tempSites = newSites;
        }

        function renderSites() {
            siteContainer.innerHTML = '';
            tempSites.forEach((site, index) => {
                const row = document.createElement('div');
                row.className = 'site-row';
                row.dataset.index = index;
                
                const opts = ['+', '%20', '-', '_'];
                let selectHtml = `<select class="site-space-select" title="Space Replacement">`;
                opts.forEach(o => {
                    const selected = (site.spaceReplacement === o) ? 'selected' : '';
                    selectHtml += `<option value="${o}" ${selected}>${o}</option>`;
                });
                selectHtml += `</select>`;

                row.innerHTML = `
                    <div class="drag-handle" title="ドラッグして並べ替える">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </div>
                    <div class="sort-arrows">
                        <div class="sort-btn up" title="上へ">▲</div>
                        <div class="sort-btn down" title="下へ">▼</div>
                    </div>
                    <input type="text" class="site-input site-label" value="${site.label}" placeholder="Label">
                    <input type="text" class="site-input site-url" value="${site.url}" placeholder="URL">
                    ${selectHtml}
                    <div class="btn-icon delete" title="Delete">✕</div>
                `;
                
                row.querySelector('.site-label').addEventListener('input', e => { tempSites[index].label = e.target.value; });
                row.querySelector('.site-url').addEventListener('input', e => { tempSites[index].url = e.target.value; });
                row.querySelector('.site-space-select').addEventListener('change', e => { tempSites[index].spaceReplacement = e.target.value; });
                row.querySelector('.delete').addEventListener('click', () => {
                    updateTempSitesFromDOM();
                    tempSites.splice(index, 1);
                    renderSites();
                });

                const btnUp = row.querySelector('.sort-btn.up');
                const btnDown = row.querySelector('.sort-btn.down');
                if (index === 0) btnUp.style.visibility = 'hidden';
                if (index === tempSites.length - 1) btnDown.style.visibility = 'hidden';

                btnUp.addEventListener('click', () => {
                    if (index > 0) {
                        updateTempSitesFromDOM();
                        [tempSites[index - 1], tempSites[index]] = [tempSites[index], tempSites[index - 1]];
                        renderSites();
                    }
                });

                btnDown.addEventListener('click', () => {
                    if (index < tempSites.length - 1) {
                        updateTempSitesFromDOM();
                        [tempSites[index + 1], tempSites[index]] = [tempSites[index], tempSites[index + 1]];
                        renderSites();
                    }
                });

                const handle = row.querySelector('.drag-handle');
                handle.addEventListener('mousedown', () => { row.draggable = true; });
                handle.addEventListener('mouseup', () => { row.draggable = false; });
                handle.addEventListener('mouseleave', () => { row.draggable = false; });

                row.addEventListener('dragstart', (e) => {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', index);
                    row.classList.add('dragging');
                });

                row.addEventListener('dragend', () => {
                    row.draggable = false;
                    row.classList.remove('dragging');
                    updateTempSitesFromDOM();
                });

                row.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    const draggingRow = siteContainer.querySelector('.dragging');
                    if (draggingRow && draggingRow !== row) {
                        const rect = row.getBoundingClientRect();
                        const next = (e.clientY - rect.top) / rect.height > 0.5;
                        siteContainer.insertBefore(draggingRow, next ? row.nextSibling : row);
                    }
                });

                siteContainer.appendChild(row);
            });
        }
        renderSites();

        modal.querySelector('#btn-add-site').addEventListener('click', () => {
            updateTempSitesFromDOM();
            tempSites.push({ label: 'New', url: 'https://example.com/?q=%query%', spaceReplacement: '+' });
            renderSites();
        });

        const syncSwitch = modal.querySelector('#sync-switch');
        const syncWrapper = modal.querySelector('#sync-wrapper');
        const syncText = modal.querySelector('#sync-text');

        syncSwitch.addEventListener('change', (e) => {
            tempSyncMode = e.target.checked;
            syncText.textContent = tempSyncMode ? 'ON' : 'OFF';
            if(tempSyncMode) syncWrapper.classList.remove('off');
            else syncWrapper.classList.add('off');
        });

        const closeModal = () => overlay.remove();
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('.btn-cancel').addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => { if(e.target === overlay) closeModal(); });

        modal.querySelector('.btn-save').addEventListener('click', () => {
            updateTempSitesFromDOM();
            const newBlacklist = blacklistArea.value.split('\n').map(s => s.trim()).filter(s => s);
            const isConfigChanged = (initialBlacklist !== blacklistArea.value) || (initialSitesStr !== JSON.stringify(tempSites));
            
            Storage.updateConfig(newBlacklist, tempSites);

            const oldSyncMode = Storage.loadSettings().syncMode;
            Storage.setSyncMode(tempSyncMode);

            if (isConfigChanged) {
                location.reload();
            } else {
                if(window.HitomiFilterUI_renderDropdown) window.HitomiFilterUI_renderDropdown();

                if (!tempSyncMode) {
                    Logic.resetUI();
                } else if (!oldSyncMode && tempSyncMode) {
                    Logic.cleanInputForSync();
                    
                    const settings = Storage.loadSettings();
                    Logic.restoreSearchFromStates(settings);
                    
                    const isSeriesFilterActive = settings.states.seriesFilter;
                    const sBtn = document.querySelector('.series-filter-btn');
                    if (isSeriesFilterActive) {
                        if(sBtn) sBtn.classList.add('active');
                        Logic.applySeriesFilter();
                    } else {
                        if(sBtn) sBtn.classList.remove('active');
                        Logic.resetSeriesFilter();
                    }
                    
                    Logic.syncButtonsFromInput();
                    Logic.syncDropdownItems();
                }
                closeModal();
            }
        });
    }
    
    function createLayoutButton(container) {
        const Utils = window.HitomiFilterUtils;
        const Logic = window.HitomiFilterLogic;
        const Storage = window.HitomiFilterStorage;

        const wrapper = document.createElement('div');
        wrapper.className = 'layout-btn-wrapper';

        const triggerBtn = document.createElement('div');
        triggerBtn.className = 'tool-btn layout-trigger-btn';
        triggerBtn.title = 'レイアウト切替';
        
        // 現在のモードを取得してアイコン設定
        const currentMode = Storage.loadSettings().layoutMode || 'list';
        triggerBtn.innerHTML = Utils.LAYOUT_ICONS[currentMode] || Utils.LAYOUT_ICONS.list;

        const dropdown = document.createElement('div');
        dropdown.className = 'layout-dropdown';

        const options = [
            { label: 'List', value: 'list', icon: Utils.LAYOUT_ICONS.list },
            { label: 'Grid', value: 'grid', icon: Utils.LAYOUT_ICONS.grid, hasColumns: true } // ★追加フラグ
        ];

        options.forEach(opt => {
            const item = document.createElement('div');
            item.className = 'layout-option';
            item.style.display = 'flex';
            item.style.justifyContent = 'space-between';
            item.style.alignItems = 'center';
            item.style.position = 'relative'; // サブメニューの位置基準
            
            if (opt.value === currentMode) item.classList.add('active');
            
            // 左側: アイコンとラベル
            const labelSpan = document.createElement('span');
            labelSpan.innerHTML = `${opt.icon} <span style="margin-left:8px">${opt.label}</span>`;
            labelSpan.style.display = 'flex';
            labelSpan.style.alignItems = 'center';
            item.appendChild(labelSpan);

            // ★変更: グリッドの場合の列数選択UI (数値表示 + サブメニュー)
            if (opt.hasColumns) {
                const wrapper = document.createElement('div');
                wrapper.className = 'grid-col-wrapper';

                // 現在の設定値
                const currentCols = Storage.loadSettings().gridColumns || 4;

                // 数値表示部分 (縦棒含む)
                const valDisplay = document.createElement('div');
                valDisplay.className = 'grid-current-val';
                valDisplay.textContent = currentCols;
                wrapper.appendChild(valDisplay);

                // サブメニュー
                const submenu = document.createElement('div');
                submenu.className = 'grid-submenu';

                // 1〜5の選択肢生成
                for (let i = 1; i <= 5; i++) {
                    const subItem = document.createElement('div');
                    subItem.className = 'grid-submenu-item';
                    subItem.textContent = i;
                    subItem.dataset.val = i; // CSSでの制御用
                    if (i === currentCols) subItem.classList.add('active');

                    // クリックイベント
                    subItem.addEventListener('click', (e) => {
                        e.stopPropagation(); // 親への伝播を止める

                        // 1. ロジック適用と保存
                        Logic.changeGridColumns(i);
                        
                        // 2. UI更新
                        valDisplay.textContent = i;
                        submenu.querySelectorAll('.grid-submenu-item').forEach(el => el.classList.remove('active'));
                        subItem.classList.add('active');

                        // 3. モード切替 (もしグリッドじゃなければ)
                        if (!item.classList.contains('active')) {
                            triggerBtn.innerHTML = opt.icon;
                            dropdown.querySelectorAll('.layout-option').forEach(el => el.classList.remove('active'));
                            item.classList.add('active');
                            Logic.applyLayout(opt.value);
                        }

                        // 4. 全てのメニューを閉じる
                        submenu.classList.remove('show');
                        dropdown.classList.remove('show');
                    });

                    submenu.appendChild(subItem);
                }
                wrapper.appendChild(submenu);
                
                // ★追加: スマホ対応 (タップで開閉トグル)
                valDisplay.addEventListener('click', (e) => {
                    e.stopPropagation(); // 親のレイアウト切替を阻止
                    submenu.classList.toggle('show');
                });

                // マウスオーバーでサブメニュー表示 (一度開いたら閉じない)
                // ★変更: マウスオーバーでサブメニュー表示 (PC用)
                // ホバー操作が可能なデバイスでのみ mouseenter イベントを登録する
                if (window.matchMedia('(hover: hover)').matches) {
                    valDisplay.addEventListener('mouseenter', () => {
                        submenu.classList.add('show');
                    });
                }

                // ※「マウスを離しても非表示にならない」は、mouseleaveイベントを設定しないことで実現
                // 閉じるのは「数字クリック」または「ドキュメント全体のクリック(既存)」で行う

                item.appendChild(wrapper);
            }
            
            // 項目全体のクリックイベント (レイアウト切替)
            item.addEventListener('click', (e) => {
                // サブメニュー内をクリックした場合は反応させない
                if (e.target.closest('.grid-submenu')) return;

                e.stopPropagation();
                triggerBtn.innerHTML = opt.icon;
                dropdown.querySelectorAll('.layout-option').forEach(el => el.classList.remove('active'));
                item.classList.add('active');
                dropdown.classList.remove('show');
                
                // サブメニューも閉じる
                const openSubmenu = item.querySelector('.grid-submenu');
                if (openSubmenu) openSubmenu.classList.remove('show');
                
                Logic.applyLayout(opt.value);
            });
            dropdown.appendChild(item);
        });

        // ドキュメントクリックでサブメニューも閉じるように追加
        document.addEventListener('click', () => {
            dropdown.classList.remove('show');
            document.querySelectorAll('.grid-submenu').forEach(el => el.classList.remove('show'));
        });

        triggerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });

        wrapper.appendChild(triggerBtn);
        wrapper.appendChild(dropdown);
        container.appendChild(wrapper);
    }

    // ★変更: サムネイルサイズ変更スライダーの生成 (範囲調整・中央1.0固定・表示削除)
    function createThumbnailSlider(targetList) {
        if (!targetList) return;
        if (document.querySelector('.thumbnail-slider-wrapper')) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'thumbnail-slider-wrapper';
        
        const label = document.createElement('span');
        label.className = 'thumbnail-slider-label';
        label.textContent = 'Page Size';
        
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.className = 'thumbnail-slider';
        
        // ★変更: 内部的には -1 ～ 1 の範囲で動かす
        // -1 = 0.5倍, 0 = 1.0倍, 1 = 3.4倍
        slider.min = '-1';
        slider.max = '1';
        slider.step = '0.001'; // 滑らかに動かすため細かく
        
        // 初期値設定
        const settings = Storage.loadSettings();
        let currentScale = settings.thumbnailScale || 1.0;
        
        // ★変更: 現在の倍率からスライダー位置(-1~1)への逆変換
        if (currentScale < 1.0) {
            // 0.5 ～ 1.0 の範囲 -> log2で計算 (0.5のとき-1, 1のとき0)
            slider.value = Math.log2(currentScale);
        } else {
            // 1.0 ～ 3.4 の範囲 -> 対数で正規化 (1のとき0, 3.4のとき1)
            slider.value = Math.log(currentScale) / Math.log(3.4);
        }
        
        // ※倍率表示(valDisplay)の生成コードは削除しました
        
        // イベントリスナー
        slider.addEventListener('input', (e) => {
            let val = parseFloat(e.target.value);
            
            // ★追加: 吸着処理 (中央 0 付近に来たら 0 に固定する)
            // 範囲は -1 ～ 1 なので、±0.05 程度を吸着範囲とする
            if (Math.abs(val) < 0.05) {
                val = 0;
                slider.value = 0; // スライダーのつまみも視覚的に中央へ移動させる
            }

            let scale;

            // スライダー位置(-1~1)から倍率への変換
            if (val < 0) {
                // 負の領域: 2^val (例: -1 -> 0.5)
                scale = Math.pow(2, val);
            } else {
                // 正の領域: 3.4^val (例: 1 -> 3.4)
                scale = Math.pow(3.4, val);
            }
            
            // 0.1刻みに丸める
            scale = Math.round(scale * 10) / 10;
            
            // 最小値ガード
            if (scale < 0.5) scale = 0.5;

            Logic.applyThumbnailScale(scale);
            
            if (Storage.updateThumbnailScale) {
                Storage.updateThumbnailScale(scale);
            }
        });
        
        wrapper.appendChild(label);
        wrapper.appendChild(slider);
        // wrapper.appendChild(valDisplay); ← 削除
        
        targetList.parentNode.insertBefore(wrapper, targetList);
    }

    // グローバル公開
    window.HitomiFilterUI = {
        createTypeButtons,
        createToolButtons,
        openConfigModal,
        createLayoutButton, // 追加
        createThumbnailSlider // ★追加
    };

})(window);