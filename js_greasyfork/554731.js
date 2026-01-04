// ==UserScript==
// @name         아카라이브 아카콘 검색
// @namespace    https://arca.live
// @version      1.0.4
// @author       배배배
// @description  아카콘 검색 기능
// @match        https://arca.live/b/*/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license      LGPL
// @downloadURL https://update.greasyfork.org/scripts/554731/%EC%95%84%EC%B9%B4%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EC%95%84%EC%B9%B4%EC%BD%98%20%EA%B2%80%EC%83%89.user.js
// @updateURL https://update.greasyfork.org/scripts/554731/%EC%95%84%EC%B9%B4%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EC%95%84%EC%B9%B4%EC%BD%98%20%EA%B2%80%EC%83%89.meta.js
// ==/UserScript==

(function() {
    //v1.0.3_0 롤백한 이후 수정 완료
    'use strict';

    const HOVER_BOX_ID = '__arcacon_floating__';
    const FOCUS_DELAY_MS = 300;
    window.__arcaconWarningActive = false;

    function focusLatestArcaconSearch() {
        const inputs = document.querySelectorAll('div[class^="arcaconPicker"] input[id$="_search"]');
        const el = inputs[inputs.length - 1];
        if (el) setTimeout(() => { try { el.focus({ preventScroll: true }); } catch(_){} }, 50);
    }

    document.addEventListener('click', e => {
        try {
            const mode = localStorage.getItem('hoverMode') || 'default';
            if (mode !== 'mobile') return;
            const wrap = e.target.closest('.thumbnail-wrap');
            if (!wrap) return;
            if (window.__arcaconWarningActive) return;
            const floating = document.getElementById(HOVER_BOX_ID);
            const isOpen = floating && floating.dataset.open === '1';
            const current = floating && floating.dataset.currentId;
            const targetId = wrap.dataset.attachmentId || wrap.getAttribute('data-attachmentid');
            if (isOpen && current && targetId && current === targetId) {
                document.dispatchEvent(new CustomEvent('arcamemo-close', { detail: { wrap } }));
                return;
            }
            e.stopImmediatePropagation();
            if (e.cancelable) e.preventDefault();
            document.dispatchEvent(new CustomEvent('arcamemo-firstclick', { detail: { wrap } }));
        } catch {}
    }, true);
    const __origFetch = window.fetch;
    window.fetch = async function(resource, init) {
        try {
            const mode = localStorage.getItem('hoverMode') || 'default';
            if (mode === 'mobile') {
                if (!window.__arcaconWarningActive) {
                    let bodyText = '';
                    if (init && init.body) {
                        if (typeof init.body === 'string') bodyText = init.body;
                        else if (init.body instanceof URLSearchParams) bodyText = init.body.toString();
                    }
                    if (bodyText.includes('contentType=emoticon')) {
                        console.warn('[ArcaconMemo] fetch blocked in mobile hover mode:', resource);
                        return new Response('', { status: 204, statusText: 'Blocked by ArcaconMemo' });
                    }
                }
            }
        } catch {}
        return __origFetch.apply(this, arguments);
    };
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.reply-form-arcacon-button.btn-namlacon');
        if (!btn) return;
        setTimeout(focusLatestArcaconSearch, FOCUS_DELAY_MS);
    }, true);
    window.addEventListener('load', () => {
        document.querySelectorAll('.thumbnail-wrap').forEach(el => {
            const clone = el.cloneNode(true);
            clone.removeAttribute('onclick');
            el.parentNode && el.parentNode.replaceChild(clone, el);
        });
    });

    function isReadyPicker(el) {
        if (!el || el.nodeType !== 1) return false;
        const cls = (el.className || '').trim();
        return cls.startsWith('arcaconPicker') &&
            el.querySelector('.title-area') &&
            el.querySelector('.content');
    }
    function initPicker(p) {
        if (!isReadyPicker(p) || p.dataset.arcaconEnhanced) return;
        setupArcacon(p);
        p.dataset.arcaconEnhanced = 'true';
    }
    document.querySelectorAll('div[class^="arcaconPicker"]').forEach(initPicker);
    new MutationObserver(muts => {
        for (const m of muts) {
            if (m.type === 'attributes' && m.attributeName === 'class') {
                const el = m.target;
                if (isReadyPicker(el) && !el.dataset.arcaconEnhanced) initPicker(el);
            }
            for (const node of m.addedNodes) {
                if (node.nodeType === 1 && isReadyPicker(node) && !node.dataset.arcaconEnhanced) initPicker(node);
            }
        }
    }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });

    function setupArcacon(picker) {
        const titleArea = picker.querySelector('.title-area');
        const content = picker.querySelector('.content');
        if (!titleArea || !content) return;
        const uid = 'arcacon_' + Math.random().toString(36).slice(2, 8);

        if (!picker.querySelector(`#${uid}_search`)) {
            const wrap = document.createElement('div');
            wrap.id = 'arca_search_wrap';
            wrap.style.cssText = `
      display:flex;align-items:center;gap:6px;
      margin:6px 0 8px 0;padding:4px 6px;
      background:#f9f9f9;border-radius:6px;border:1px solid #ddd;
      position:relative;
    `;
            const searchInput = document.createElement('input');
            searchInput.id = `${uid}_search`;
            searchInput.placeholder = '아카콘 메모 검색...';
            searchInput.style.cssText = `
      flex:1;padding:4px 6px;border:1px solid #bbb;
      border-radius:4px;font-size:12px;background:#fff;
    `;
            const settingsBtn = document.createElement('button');
            settingsBtn.textContent = '⚙️';
            settingsBtn.id = 'con_setBtn';
            settingsBtn.style.cssText = `
      width:28px;height:28px;font-size:14px;border:none;
      background:#eee;border-radius:4px;cursor:pointer;
    `;
            const settingsPanel = document.createElement('div');
            settingsPanel.id = 'pan_setBtn';
            settingsPanel.style.cssText = `
      position:absolute;right:0;top:36px;width:240px;
      background:white;border:1px solid #ccc;border-radius:8px;
      box-shadow:0 2px 8px rgba(0,0,0,0.2);padding:8px;
      display:none;flex-direction:column;gap:8px;z-index:10000;
    `;
            const nightLabel = document.createElement('label');
            nightLabel.style.cssText = `display:flex;justify-content:space-between;align-items:center;font-size:12px;`;
            nightLabel.innerHTML = `<span>🌙 Auto Night-mode</span>`;
            const nightToggle = document.createElement('input');
            nightToggle.type = 'checkbox';
            nightToggle.checked = localStorage.getItem('nightModeAuto') === 'true';
            nightLabel.appendChild(nightToggle);
            const hoverLabel = document.createElement('label');
            hoverLabel.style.cssText = `display:flex;justify-content:space-between;align-items:center;font-size:12px;`;
            hoverLabel.innerHTML = `<span>🖱️ Hover 설정</span>`;
            const hoverSelect = document.createElement('select');
            hoverSelect.innerHTML = `
      <option value="default">기본</option>
      <option value="mobile">모바일</option>
      <option value="off">끄기</option>
    `;
            hoverSelect.value = localStorage.getItem('hoverMode') || 'default';
            hoverLabel.appendChild(hoverSelect);
            hoverSelect.addEventListener('change', () => localStorage.setItem('hoverMode', hoverSelect.value));
            const exportBtn = document.createElement('button');
            exportBtn.textContent = '🗒️ 메모 내보내기 (.txt)';
            exportBtn.id = 'exBtn';
            exportBtn.style.cssText = `
      padding:4px;border-radius:4px;border:1px solid #aaa;
      background:#fafafa;cursor:pointer;font-size:12px;
    `;
            const importBtn = document.createElement('button');
            importBtn.textContent = '🗒️ 메모 불러오기 (.txt)';
            importBtn.id = 'imBtn';
            importBtn.style.cssText = `
      padding:4px;border-radius:4px;border:1px solid #aaa;
      background:#fafafa;cursor:pointer;font-size:12px;
    `;
            const tip = document.createElement('span');
            tip.textContent = '내보내기/불러오기 확장자 .txt 사용 권장';
            tip.style.cssText = 'padding:4px;font-size:12px;';
            settingsPanel.append(nightLabel, hoverLabel, exportBtn, importBtn, tip);
            wrap.append(searchInput, settingsBtn);
            wrap.appendChild(settingsPanel);
            const firstSpan = titleArea.querySelector('span');
            if (firstSpan && firstSpan.nextSibling) titleArea.insertBefore(wrap, firstSpan.nextSibling);
            else titleArea.appendChild(wrap);
            setTimeout(() => { try { searchInput.focus({ preventScroll: true }); } catch(_){} }, 150);
            settingsBtn.addEventListener('click', e => {
                e.preventDefault(); e.stopPropagation();
                settingsPanel.style.display = settingsPanel.style.display === 'flex' ? 'none' : 'flex';
            });
            settingsBtn.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); }
            });

            nightToggle.addEventListener('change', () => {
                localStorage.setItem('nightModeAuto', nightToggle.checked);
                applyThemeStyles();
            });
            exportBtn.addEventListener('click', e => {
                e.preventDefault(); e.stopPropagation();
                const notes = localStorage.getItem('arcaconNotes') || '{}';
                const blob = new Blob([notes], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = 'arcacon_notes.txt'; a.click();
                URL.revokeObjectURL(url);
            });
            importBtn.addEventListener('click', e => {
                e.preventDefault(); e.stopPropagation();
                const inputFile = document.createElement('input');
                inputFile.type = 'file'; inputFile.accept = '.txt';
                inputFile.onchange = ev => {
                    const file = ev.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = r => {
                        try { localStorage.setItem('arcaconNotes', r.target.result); }
                        catch {}
                    };
                    reader.readAsText(file);
                };
                inputFile.click();
            });
            let debounceTimer;
            searchInput.addEventListener('input', () => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    const keyword = searchInput.value.trim();
                    content.scrollTop = 0;
                    const old = picker.querySelector('#arcaconSearchPackage');
                    if (old) old.remove();
                    if (!keyword) return;
                    let all = {};
                    try { all = JSON.parse(localStorage.getItem('arcaconNotes') || '{}'); } catch {}
                    const matches = (keyword === '*')
                    ? Object.entries(all).map(([id, o]) => ({ id, ...o }))
                    : Object.entries(all)
                    .filter(([_, o]) => o?.text?.includes(keyword))
                    .map(([id, o]) => ({ id, ...o }));
                    const pkg = document.createElement('div');
                    pkg.className = 'package-wrap';
                    pkg.id = 'arcaconSearchPackage';
                    pkg.dataset.packageId = '0';
                    const title = document.createElement('span');
                    title.className = 'package-title';
                    title.textContent = keyword === '*'
                        ? `모든 메모 (${matches.length})` : `검색 결과 (${matches.length})`;
                    pkg.appendChild(title);
                    const thumbs = document.createElement('div');
                    thumbs.className = 'thumbnails';
                    pkg.appendChild(thumbs);
                    matches.forEach(m => {
                        if (!m.html) return;
                        const doc = new DOMParser().parseFromString(m.html.trim(), 'text/html');
                        const node = doc.body.firstElementChild;
                        if (!node) return;
                        const video = node.querySelector('video.thumbnail');
                        if (video) {
                            video.autoplay = true; video.loop = true; video.muted = true; video.playsInline = true;
                            video.load(); setTimeout(() => video.play().catch(() => {}), 150);
                        }
                        node.style.position = 'relative';
                        node.style.overflow = 'hidden';
                        const caption = document.createElement('div');
                        caption.textContent = m.text || '';
                        caption.style.cssText = `
            position:absolute;bottom:0;left:0;width:100%;
            background:rgba(0,0,0,0.6);color:#fff;font-size:10px;
            text-align:center;padding:2px 0;white-space:nowrap;
            overflow:hidden;text-overflow:ellipsis;pointer-events:none;z-index:1;
          `;
                        node.appendChild(caption);
                        thumbs.appendChild(node);
                    });

                    content.prepend(pkg);
                }, 250);
            });
        }
        let notes = {};
        try { notes = JSON.parse(localStorage.getItem('arcaconNotes') || '{}'); } catch {}

        let floating = document.getElementById(HOVER_BOX_ID);
        if (!floating) {
            floating = document.createElement('div');
            floating.id = HOVER_BOX_ID;
            floating.style.cssText = `
      position:fixed;width:70px;
      background:rgba(255,255,255,0.98);border:1px solid #ccc;border-radius:6px;
      padding:4px;z-index:99999;box-shadow:0 2px 6px rgba(0,0,0,0.25);
      transition:opacity .12s,transform .08s;opacity:0;transform:translateY(-6px);
      display:flex;flex-direction:column;gap:4px;font-size:11px;
      justify-content:center;align-items:center;will-change:opacity,transform;
    `;
            document.body.appendChild(floating);
        }
        const inputBox = document.createElement('input');
        inputBox.type = 'text'; inputBox.placeholder = '메모';
        inputBox.style.cssText = `
    width:100%;padding:3px 4px;border-radius:4px;border:1px solid #bbb;font-size:12px;
  `;
        const saveBtn = document.createElement('button');
        saveBtn.textContent = '💾';
        saveBtn.style.cssText = `
    width:100%;padding:3px 0;border-radius:4px;border:none;background:#444;color:white;cursor:pointer;font-size:12px;
  `;
        floating.innerHTML = '';
        floating.append(inputBox, saveBtn);
        floating.dataset.open = floating.dataset.open || '0';
        floating.dataset.currentId = floating.dataset.currentId || '';

        let currentTarget = null;
        let currentId = null;
        let isWarning = false;
        let isHovering = false;

        function positionFloating(th) {
            const rect = th.getBoundingClientRect();
            floating.style.left = (rect.left + rect.width / 2 - 35) + 'px';
            floating.style.top = (rect.top - 50) + 'px';
        }
        function showWarning(msg, anchorEl = currentTarget) {
            if (anchorEl) positionFloating(anchorEl);
            floating.style.opacity = '1';
            floating.style.transform = 'translateY(0)';
            floating.style.background= 'rgba(255,70,70,0.95)';
            floating.style.color = 'white';
            floating.style.border = '1px solid rgba(255,120,120,0.8)';
            floating.innerHTML = `<div style="font-size:11px;text-align:center;line-height:1.4;padding:4px 2px;">${msg}</div>`;
            isWarning = true;
            window.__arcaconWarningActive = true;
            floating.dataset.open = '1';
            floating.dataset.currentId = currentId || '';
        }
        function showMemoUI() {
            if (!isWarning) return;
            floating.innerHTML = '';
            floating.append(inputBox, saveBtn);
            const isDark = document.documentElement.classList.contains('theme-dark');
            floating.style.background = isDark ? '#000' : 'rgba(255,255,255,0.98)';
            floating.style.color = 'black';
            floating.style.border = '1px solid #ccc';
            isWarning = false;
            window.__arcaconWarningActive = false;
            floating.dataset.open = '1';
            floating.dataset.currentId = currentId || '';
        }
        function hideFloating() {
            floating.style.opacity = '0';
            floating.style.transform = 'translateY(-6px)';
            currentTarget = null;
            currentId = null;
            isHovering = false;
            isWarning = false;
            window.__arcaconWarningActive = false;
            floating.dataset.open = '0';
            floating.dataset.currentId = '';
            const isDark = document.documentElement.classList.contains('theme-dark');
            floating.style.background = isDark ? '#000' : 'rgba(255,255,255,0.98)';
            floating.style.color = isDark ? '#fff' : '#000';
            floating.style.border = '1px solid #ccc';
            floating.innerHTML = '';
            floating.append(inputBox, saveBtn);
        }
        function extractMeta(el) {
            const wrap = el.closest('.thumbnail-wrap');
            if (!wrap) return {};
            const attachmentId = wrap.dataset.attachmentId || wrap.getAttribute('data-attachmentid');
            let emoticonId = wrap.dataset.emoticonId || wrap.getAttribute('data-emoticonid') || wrap.dataset.emoticonid;
            if (!attachmentId) return {};
            if (emoticonId === '0') {
                if (!notes[attachmentId]) {
                    showWarning('⚠️<br>저장정보X.', wrap);
                    return {};
                }
                return { ...notes[attachmentId], attachmentId, emoticonId: '0' };
            }
            return { attachmentId, emoticonId, html: wrap.outerHTML };
        }
        document.addEventListener('arcamemo-firstclick', ev => {
            const wrap = ev.detail && ev.detail.wrap;
            if (!wrap) return;
            if (!picker.contains(wrap)) return;
            currentTarget = wrap;
            const meta = extractMeta(wrap);
            if (!meta.attachmentId) return;
            if (isWarning) showMemoUI();
            currentId = meta.attachmentId;
            inputBox.value = notes[currentId]?.text || '';
            positionFloating(wrap);
            floating.style.opacity = '1';
            floating.style.transform = 'translateY(0)';
            try { inputBox.focus({ preventScroll: true }); } catch(_){}
            floating.dataset.open = '1';
            floating.dataset.currentId = currentId || '';
        });

        document.addEventListener('arcamemo-close', ev => {
            const wrap = ev.detail && ev.detail.wrap;
            if (wrap && picker.contains(wrap)) hideFloating();
        });
        content.addEventListener('pointerover', e => {
            const mode = localStorage.getItem('hoverMode') || 'default';
            if (mode !== 'default') return;

            const wrap = e.target.closest('.thumbnail-wrap');
            if (!wrap) return;

            isHovering = true;
            currentTarget = wrap;
            const meta = extractMeta(wrap);
            if (!meta.attachmentId) return;
            if (isWarning) showMemoUI();
            currentId = meta.attachmentId;
            inputBox.value = notes[currentId]?.text || '';
            positionFloating(wrap);
            floating.style.opacity = '1';
            floating.style.transform = 'translateY(0)';
            try { inputBox.focus({ preventScroll: true }); } catch(_){}
            floating.dataset.open = '1';
            floating.dataset.currentId = currentId || '';
        });

        content.addEventListener('pointerout', e => {
            const rel = e.relatedTarget;
            if (rel && (floating.contains(rel) || currentTarget?.contains(rel))) return;
            hideFloating();
        });
        content.addEventListener('click', e => {
            const mode = localStorage.getItem('hoverMode') || 'default';
            if (mode !== 'mobile') return;
            const wrap = e.target.closest('.thumbnail-wrap');
            if (!wrap) return;
            const targetId = wrap.dataset.attachmentId || wrap.getAttribute('data-attachmentid');
            if (floating.dataset.open === '1' && floating.dataset.currentId === targetId) {
                hideFloating();
            }
        });

        saveBtn.addEventListener('click', e => {
            e.preventDefault(); e.stopPropagation();
            if (!currentTarget || !currentId) return;
            const text = inputBox.value.trim();
            const meta = extractMeta(currentTarget);
            if (!meta.attachmentId) return;

            if (meta.emoticonId === '0' && notes[currentId]) {
                notes[currentId].text = text;
            } else {
                notes[currentId] = { text, ...meta };
            }
            localStorage.setItem('arcaconNotes', JSON.stringify(notes));
            saveBtn.style.background = '#2a7';
            setTimeout(() => (saveBtn.style.background = '#444'), 400);
        });
        inputBox.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault(); e.stopImmediatePropagation();
                saveBtn.click();
            }
        });
        floating.addEventListener('wheel', e => {
            e.preventDefault();
            content.scrollTop += e.deltaY;
        });

        const htmlEl = document.documentElement;
        function applyThemeStyles() {
            const nightAuto = localStorage.getItem('nightModeAuto') === 'true';
            if (!nightAuto) return;
            const isDark = htmlEl.classList.contains('theme-dark');
            const inputEl = picker.querySelector(`#${uid}_search`);
            const wrapEl = picker.querySelector('#arca_search_wrap');
            const panelEl = picker.querySelector('#pan_setBtn');
            const exBtn = picker.querySelector('#exBtn');
            const imBtn = picker.querySelector('#imBtn');
            if (!inputEl || !wrapEl || !panelEl) return;
            if (isDark) {
                wrapEl.style.background = 'RGB(50,50,50)';
                wrapEl.style.border = '1px solid RGB(100,100,100)';
                panelEl.style.background = 'black';
                if (exBtn) exBtn.style.background = 'black';
                if (imBtn) imBtn.style.background = 'black';
                inputEl.style.background = 'RGB(50,50,50)';
                inputEl.style.color = '#f5f5f5';
                inputEl.style.border = '1px solid RGB(100,100,100)';
            } else {
                wrapEl.style.background = 'RGB(250,250,250)';
                wrapEl.style.border = '1px solid RGB(200,200,200)';
                panelEl.style.background = 'white';
                if (exBtn) exBtn.style.background = 'white';
                if (imBtn) imBtn.style.background = 'white';
                inputEl.style.background = '#fff';
                inputEl.style.color = '#000';
                inputEl.style.border = '1px solid #bbb';
            }
        }
        new MutationObserver(() => applyThemeStyles()).observe(htmlEl, { attributes: true, attributeFilter: ['class'] });
        applyThemeStyles();
    }
})();