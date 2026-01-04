// ==UserScript==
// @name         Torn Item Watchlist
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Torn item market watchlist with desktop notifications
// @match        https://www.torn.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549258/Torn%20Item%20Watchlist.user.js
// @updateURL https://update.greasyfork.org/scripts/549258/Torn%20Item%20Watchlist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = "tm_torn_api_key";
    const ITEMS_KEY = "tm_torn_items";
    const WATCH_KEY = "tm_active_watched_items";
    const ICONS_KEY = "tm_show_icons";
    const FETCHING_CLASS = "tm-fetching";
    const MIN_W = 200, MIN_H = 200;
    const MAX_W = 600, MAX_H = 600;
    const REFRESH_KEY = "tm_refresh_interval"; // salvează "15" | "30" | "60" | "120"
    const NOTIF_ENABLED_KEY = "tm_notify_enabled";
    const SOUND_ENABLED_KEY = "tm_sound_enabled";
    const NOTIFIED_CACHE_KEY = "tm_last_notified_cache_ts"; // map: { [itemId]: number }

    function isNotifyEnabled() {
        return localStorage.getItem(NOTIF_ENABLED_KEY) === 'true';
    }
    function isSoundEnabled() {
        return localStorage.getItem(SOUND_ENABLED_KEY) === 'true';
    }
    function getNotifiedCacheMap() {
        try { return JSON.parse(localStorage.getItem(NOTIFIED_CACHE_KEY) || '{}'); } catch { return {}; }
    }
    function setNotifiedCacheMap(map) {
        localStorage.setItem(NOTIFIED_CACHE_KEY, JSON.stringify(map));
    }

    // Scurt beep fără asset extern
    async function playBeep() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = 880; // A5
            gain.gain.value = 0.05;
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            setTimeout(() => { osc.stop(); ctx.close(); }, 180);
        } catch {}
    }

    // Cere permisiunea pentru notificări (dacă e nevoie)
    async function ensureNotificationPermission() {
        if (!("Notification" in window)) return false;
        if (Notification.permission === "granted") return true;
        if (Notification.permission === "denied") return false;
        try {
            const res = await Notification.requestPermission();
            return res === "granted";
        } catch { return false; }
    }

    // Trimite notificarea + sunet (dacă sunt activate)
    async function notifyDeal({ id, name, myPrice, lowest, type }) {
        if (isNotifyEnabled() && ("Notification" in window)) {
            const ok = await ensureNotificationPermission();
            if (ok) {
                const n = new Notification("TORN deal found", {
                    body: `${name} ≤ ${myPrice.toLocaleString('en-US')}$ • Lowest: ${lowest.toLocaleString('en-US')}$`,
                    icon: undefined // poți pune icon global dacă vrei
                });
                // click => deschide market
                n.onclick = () => {
                    const url = `https://www.torn.com/page.php?sid=ItemMarket#/market/view=search&itemID=${id}&itemName=${encodeURIComponent(name)}&itemType=${encodeURIComponent(type||'')}`;
                    window.open(url, '_blank', 'noopener');
                };
            }
        }
        if (isSoundEnabled()) {
            playBeep();
        }
    }


    function getRefreshInterval() {
        const v = parseInt(localStorage.getItem(REFRESH_KEY), 10);
        return [15,30,60,120].includes(v) ? v : 60; // default 60
    }
    function setRefreshInterval(v) {
        localStorage.setItem(REFRESH_KEY, String(v));
    }


    // ---- Utils ----
    function formatPrice(num) {
        return num.toLocaleString('en-US') + '$';
    }

    function getApiKey() {
        return localStorage.getItem(STORAGE_KEY) || '';
    }

    function loadWatchedItems() {
        try {
            return JSON.parse(localStorage.getItem(WATCH_KEY) || '[]');
        } catch {
            return [];
        }
    }

    // Normalizează structura unei listări din API
    function normalizeListing(x) {
        if (!x || typeof x !== 'object') return null;
        const p = Number.isFinite(x.cost) ? x.cost
        : Number.isFinite(x.price) ? x.price
        : Number.parseInt(x.cost || x.price, 10);
        if (!Number.isFinite(p)) return null;
        return { price: p, quantity: x.quantity || x.qty || 1, id: x.ID || x.id || null, seller: x.seller_id || x.seller || null };
    }

    // Ia lowest price pentru un item de pe Item Market
    async function fetchLowestMarketPrice(itemId) {
        const key = getApiKey();
        if (!key) return null;
        try {
            const url = `https://api.torn.com/v2/market/${itemId}/itemmarket?offset=0&key=${key}`;
            const res = await fetch(url);
            const data = await res.json();
            if (!data || !data.itemmarket || !Array.isArray(data.itemmarket.listings)) return null;

            const listings = data.itemmarket.listings.slice().sort((a, b) => a.price - b.price);
            if (listings.length === 0) return null;

            return {
                price: listings[0].price,
                name: data.itemmarket.item?.name,
                type: data.itemmarket.item?.type,
                cache_ts: data.itemmarket.cache_timestamp
            };
        } catch (e) {
            console.error('fetchLowestMarketPrice error', e);
            return null;
        }
    }





    function saveWatchedItems(items) {
        localStorage.setItem(WATCH_KEY, JSON.stringify(items));
        renderWatchedItems();
    }

    // ---- Main floating window ----
    function createFloatingWindow() {
        const win = document.createElement('div');
        win.id = 'tm-floating-window';
        Object.assign(win.style, {
            position: 'fixed',
            width: '200px',
            height: '200px',
            top: '20px',
            left: '20px',
            background: 'rgba(0,0,0,0.7)',
            zIndex: '2147483647',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
            color: '#fff',
            fontSize: '13px',
            userSelect: 'none',
            minWidth: MIN_W + 'px',
            minHeight: MIN_H + 'px',
            maxWidth: MAX_W + 'px',
            maxHeight: MAX_H + 'px',
            boxSizing: 'border-box',
        });
        document.body.appendChild(win);

        // top bar
        const topBar = document.createElement('div');
        Object.assign(topBar.style, {
            height: '24px',
            background: 'rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 6px',
            cursor: 'move',
            borderBottom: '1px solid rgba(255,255,255,0.2)',
        });
        win.appendChild(topBar);

        const title = document.createElement('span');
        title.textContent = 'Panel';
        title.style.fontWeight = 'bold';
        title.style.fontSize = '12px';
        topBar.appendChild(title);

        let isRefreshing = false;
        let refreshTimer = null;
        let countdown = getRefreshInterval();

        const refreshBtn = document.createElement('button');
        Object.assign(refreshBtn.style, {
            fontSize: '11px',
            padding: '2px 6px',
            cursor: 'pointer',
            background: '#444',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            marginLeft: '6px',
        });

        function setRefreshLabel() {
            refreshBtn.textContent = `Refresh:${String(countdown).padStart(2, '0')}`;
        }

        async function doRefresh() {
            if (isRefreshing) return;
            isRefreshing = true;
            try {
                // dacă nu există iteme în watchlist, evităm orice fetch de market
                const watched = (JSON.parse(localStorage.getItem("tm_active_watched_items") || "[]"));
                if (watched.length === 0) {
                    // doar rerandează mesajul „No items being watched.” dacă e cazul
                    await renderWatchedItems(false);
                } else {
                    await renderWatchedItems(true);
                }
            } finally {
                isRefreshing = false;
            }
        }

        function startAutoRefresh() {
            if (refreshTimer) clearInterval(refreshTimer);
            countdown = getRefreshInterval();
            setRefreshLabel();
            refreshTimer = setInterval(async () => {
                countdown -= 1;
                if (countdown <= 0) {
                    countdown = getRefreshInterval();
                    setRefreshLabel();
                    await doRefresh();
                    return;
                }
                setRefreshLabel();
            }, 1000);
        }

        refreshBtn.addEventListener('click', async () => {
            countdown = getRefreshInterval();
            setRefreshLabel();
            await doRefresh();
        });

        topBar.appendChild(refreshBtn);
        startAutoRefresh();

        window.addEventListener('tm-refresh-interval-updated', () => {
            startAutoRefresh(); // recalculează countdown + repornește intervalul
        });

        window.addEventListener('beforeunload', () => refreshTimer && clearInterval(refreshTimer));



        const optionsBtn = document.createElement('button');
        optionsBtn.textContent = 'Options';
        Object.assign(optionsBtn.style, {
            fontSize: '11px',
            padding: '2px 6px',
            cursor: 'pointer',
            background: '#444',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
        });
        optionsBtn.addEventListener('click', createOptionsPanel);
        topBar.appendChild(optionsBtn);

        // content
        const content = document.createElement('div');
        content.id = 'tm-main-content';
        Object.assign(content.style, {
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '6px',
            gap: '4px',
            overflowY: 'auto',
        });
        win.appendChild(content);

        const resizer = document.createElement('div');
        Object.assign(resizer.style, {
            position: 'absolute',
            width: '12px',
            height: '12px',
            right: '2px',
            bottom: '2px',
            cursor: 'se-resize',
            background:
            'linear-gradient(135deg, rgba(255,255,255,0.35) 0 50%, transparent 50% 100%)',
            borderRadius: '2px',
            opacity: '0.8',
        });
        win.appendChild(resizer);


        makeDraggable(win, topBar);
        makeResizable(win, resizer);
        renderWatchedItems();
    }

	function upsertWatchedItem(newItem) {
	  const list = loadWatchedItems();
	  const idx = list.findIndex(it => String(it.id) === String(newItem.id));
	  if (idx > -1) {
	    // Actualizează (păstrăm numele existent sau îl înnoim cu cel curent)
	    list[idx] = { ...list[idx], ...newItem };
	  } else {
	    list.push(newItem);
	  }
	  saveWatchedItems(list); // asta re-randează automat
	}


    // ---- Render watchlist ----
    async function renderWatchedItems(forceRefresh = false) {
        const container = document.querySelector('#tm-main-content');
        if (!container) return;
        container.innerHTML = '';

        const watched = loadWatchedItems();
        if (watched.length === 0) {
            container.textContent = "No items being watched.";
            return;
        }

        const showIcons = localStorage.getItem(ICONS_KEY) === 'true';
        const db = JSON.parse(localStorage.getItem(ITEMS_KEY) || '{}');

        // un mic indicator vizual la refresh
        container.classList.toggle(FETCHING_CLASS, true);

        for (const [idx, item] of watched.entries()) {
            const row = document.createElement('div');
            Object.assign(row.style, {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                gap: '6px',
            });

            const left = document.createElement('div');
            Object.assign(left.style, {
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                minWidth: 0,
                flex: '1',
            });

            // icon (din URL salvat)
            if (showIcons && item.id) {
                const dbItem = db[item.id];
                if (dbItem && dbItem.image) {
                    let imgUrl = dbItem.image;
                    if (!/^https?:\/\//i.test(imgUrl)) {
                        if (imgUrl.startsWith('/')) imgUrl = `https://www.torn.com${imgUrl}`;
                        else imgUrl = `https://www.torn.com/images/items/${imgUrl}`;
                    }
                    const img = document.createElement('img');
                    img.src = imgUrl;
                    img.alt = dbItem.name || 'item';
                    Object.assign(img.style, { width: '20px', height: '20px', flex: '0 0 auto' });
                    left.appendChild(img);
                }
            }

            const nameEl = document.createElement('span');
            nameEl.style.whiteSpace = 'nowrap';
            nameEl.style.overflow = 'hidden';
            nameEl.style.textOverflow = 'ellipsis';
            nameEl.textContent = item.name;
            left.appendChild(nameEl);

            const middle = document.createElement('div');
            middle.textContent = '— ' + formatPrice(item.price);
            left.appendChild(middle);
            row.appendChild(left);

            // placeholder pentru lowest
            const right = document.createElement('div');
            Object.assign(right.style, { display: 'flex', alignItems: 'center', gap: '6px' });
            const lowLink = document.createElement('a');
            lowLink.textContent = '(...)';
            lowLink.href = `https://www.torn.com/page.php?sid=ItemMarket#/market/view=search&itemID=${item.id}`;
            lowLink.target = '_blank';
            lowLink.rel = 'noopener noreferrer';
            Object.assign(lowLink.style, { color: '#9cf', textDecoration: 'underline' });
            right.appendChild(lowLink);

            // remove button (păstrat ca înainte)
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'x';
            Object.assign(removeBtn.style, {
                marginLeft: '6px',
                background: '#a33',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '3px',
                padding: '0 6px',
                fontSize: '11px',
            });
            removeBtn.addEventListener('click', () => {
                const updated = loadWatchedItems().filter((_, i) => i !== idx);
                saveWatchedItems(updated);
            });

            right.appendChild(removeBtn);
            row.appendChild(right);
            container.appendChild(row);

            // fetch lowest pentru fiecare item
            const lowest = await fetchLowestMarketPrice(item.id);

            if (lowest && Number.isFinite(lowest.price)) {
                // actualizează textul și linkul
                lowLink.textContent = `(${formatPrice(lowest.price)})`;
                lowLink.href = `https://www.torn.com/page.php?sid=ItemMarket#/market/view=search`
                    + `&itemID=${item.id}`
                    + `&itemName=${encodeURIComponent(lowest.name || item.name)}`
                    + `&itemType=${encodeURIComponent(lowest.type || '')}`;

                // notificare dacă lowest <= target-ul meu
                try {
                    if (lowest.price <= item.price && Number.isFinite(lowest.cache_ts)) {
                        const notifiedMap = getNotifiedCacheMap();
                        const lastTs = notifiedMap[item.id];
                        if (lastTs !== lowest.cache_ts) {
                            await notifyDeal({
                                id: item.id,
                                name: lowest.name || item.name,
                                myPrice: item.price,
                                lowest: lowest.price,
                                type: lowest.type
                            });
                            notifiedMap[item.id] = lowest.cache_ts;
                            setNotifiedCacheMap(notifiedMap);
                        }
                    }
                } catch (e) {
                    console.warn('notifyDeal failed', e);
                }

            } else {
                lowLink.textContent = '(n/a)';
            }

        }

        container.classList.toggle(FETCHING_CLASS, false);
    }


    // ---- Options panel ----
    function createOptionsPanel() {
        if (document.querySelector('#tm-options-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'tm-options-panel';
        Object.assign(panel.style, {
            position: 'fixed',
            width: '320px',
            height: '360px',
            top: '240px',
            left: '20px',
            background: 'rgba(0,0,0,0.85)',
            zIndex: '2147483647',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
            color: '#fff',
            fontSize: '13px',
        });
        document.body.appendChild(panel);

        // top bar
        const topBar = document.createElement('div');
        Object.assign(topBar.style, {
            height: '24px',
            background: 'rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 6px',
            cursor: 'move',
            borderBottom: '1px solid rgba(255,255,255,0.2)',
        });
        panel.appendChild(topBar);

        const title = document.createElement('span');
        title.textContent = 'Settings';
        title.style.fontWeight = 'bold';
        title.style.fontSize = '12px';
        topBar.appendChild(title);

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        Object.assign(closeBtn.style, {
            fontSize: '12px',
            cursor: 'pointer',
            background: 'transparent',
            color: '#fff',
            border: 'none',
            fontWeight: 'bold',
        });
        closeBtn.addEventListener('click', () => panel.remove());
        topBar.appendChild(closeBtn);

        const content = document.createElement('div');
        Object.assign(content.style, {
            flex: '1',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
        });
        panel.appendChild(content);

        // API key row
        const apiRow = document.createElement('div');
        apiRow.style.display = 'flex';
        apiRow.style.gap = '6px';
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter API Key';
        Object.assign(input.style, {
            flex: '1',
            padding: '4px',
            fontSize: '12px',
            borderRadius: '4px',
            border: '1px solid #555',
            background: '#222',
            color: '#fff',
        });
        const savedKey = localStorage.getItem(STORAGE_KEY);
        if (savedKey) input.value = savedKey;

        const setBtn = document.createElement('button');
        setBtn.textContent = 'Set';
        Object.assign(setBtn.style, {
            padding: '4px 8px',
            fontSize: '12px',
            cursor: 'pointer',
            background: '#444',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
        });
        apiRow.appendChild(input);
        apiRow.appendChild(setBtn);
        content.appendChild(apiRow);

        const apiMsg = document.createElement('div');
        apiMsg.style.fontSize = '11px';
        apiMsg.style.color = '#0f0';
        if (savedKey) apiMsg.textContent = "Apikey saved to localstorage";
        content.appendChild(apiMsg);

        setBtn.addEventListener('click', () => {
            const val = input.value.trim();
            if (val) {
                localStorage.setItem(STORAGE_KEY, val);
                apiMsg.textContent = "Apikey saved to localstorage";
            }
        });

        // Fetch items row
        const fetchRow = document.createElement('div');
        fetchRow.style.display = 'flex';
        fetchRow.style.gap = '6px';
        const fetchStatus = document.createElement('span');
        fetchStatus.style.flex = '1';
        fetchStatus.style.fontSize = '11px';
        fetchStatus.style.color = '#ff0';
        fetchStatus.textContent = localStorage.getItem(ITEMS_KEY) ? "Item DB OK" : "Item DB Empty";
        const fetchBtn = document.createElement('button');
        fetchBtn.textContent = 'Fetch TORN items DB';
        Object.assign(fetchBtn.style, {
            padding: '4px 8px',
            fontSize: '12px',
            cursor: 'pointer',
            background: '#444',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
        });
        fetchRow.appendChild(fetchStatus);
        fetchRow.appendChild(fetchBtn);
        content.appendChild(fetchRow);

        fetchBtn.addEventListener('click', async () => {
            const key = localStorage.getItem(STORAGE_KEY);
            if (!key) {
                alert('No API key set!');
                return;
            }
            try {
                const res = await fetch(`https://api.torn.com/torn/?selections=items&key=${key}`);
                const data = await res.json();
                if (data.items) {
                    const db = {};
                    for (const [id, item] of Object.entries(data.items)) {
                        if (item.tradeable) {
                            db[id] = {
                                name: item.name,
                                description: item.description,
                                image: item.image,
                            };
                        }
                    }
                    localStorage.setItem(ITEMS_KEY, JSON.stringify(db));
                    fetchStatus.textContent = "Item DB OK";
                    fetchStatus.style.color = '#0f0';
                }
            } catch (e) {
                console.error(e);
                fetchStatus.textContent = "Error fetching DB";
                fetchStatus.style.color = '#f00';
            }
        });

        // Search + add watch row
        const searchRow = document.createElement('div');
        searchRow.style.display = 'flex';
        searchRow.style.gap = '6px';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search item';
        Object.assign(searchInput.style, {
            flex: '1',
            padding: '4px',
            fontSize: '12px',
            borderRadius: '4px',
            border: '1px solid #555',
            background: '#222',
            color: '#fff',
        });

        const priceInput = document.createElement('input');
        priceInput.type = 'number';
        priceInput.placeholder = 'Price';
        Object.assign(priceInput.style, {
            width: '80px',
            padding: '4px',
            fontSize: '12px',
            borderRadius: '4px',
            border: '1px solid #555',
            background: '#222',
            color: '#fff',
        });

        const addBtn = document.createElement('button');
        addBtn.textContent = 'Add Watch';
        Object.assign(addBtn.style, {
            padding: '4px 6px',
            fontSize: '12px',
            cursor: 'pointer',
            background: '#444',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
        });

        searchRow.appendChild(searchInput);
        searchRow.appendChild(priceInput);
        searchRow.appendChild(addBtn);
        content.appendChild(searchRow);

        // dropdown pentru sugestii
        const dropdown = document.createElement('div');
        Object.assign(dropdown.style, {
            position: 'fixed',
            background: '#222',
            border: '1px solid #555',
            borderRadius: '4px',
            maxHeight: '100px',
            overflowY: 'auto',
            zIndex: '2147483648',
            display: 'none',
        });
        document.body.appendChild(dropdown);

        let selectedItem = null;

        searchInput.addEventListener('input', () => {
            const val = searchInput.value.trim().toLowerCase();
            dropdown.innerHTML = '';
            if (!val) {
                dropdown.style.display = 'none';
                return;
            }
            const items = JSON.parse(localStorage.getItem(ITEMS_KEY) || '{}');
            const matches = Object.entries(items).filter(([id, it]) =>
                it.name.toLowerCase().includes(val)
            );
            if (matches.length === 0) {
                dropdown.style.display = 'none';
                return;
            }
            matches.forEach(([id, it]) => {
                const opt = document.createElement('div');
                opt.textContent = it.name;
                Object.assign(opt.style, {
                    padding: '2px 6px',
                    cursor: 'pointer',
                });
                opt.addEventListener('click', () => {
                    searchInput.value = it.name;
                    selectedItem = { id, ...it };
                    dropdown.style.display = 'none';
                });
                dropdown.appendChild(opt);
            });
            const rect = searchInput.getBoundingClientRect();
            dropdown.style.top = rect.bottom + 'px';
            dropdown.style.left = rect.left + 'px';
            dropdown.style.width = rect.width + 'px';
            dropdown.style.display = 'block';
        });

		addBtn.addEventListener('click', () => {
		  // Acceptă și cazul în care userul a tastat fix numele și n-a dat click pe sugestie
		  let chosen = selectedItem;
		  if (!chosen) {
		    const items = JSON.parse(localStorage.getItem(ITEMS_KEY) || '{}');
		    const byName = Object.entries(items).find(([id, it]) =>
		      it.name.toLowerCase() === searchInput.value.trim().toLowerCase()
		    );
		    if (byName) {
		      const [id, it] = byName;
		      chosen = { id, ...it };
		    }
		  }

		  const price = Number.parseInt(priceInput.value, 10);
		  if (!chosen || !Number.isFinite(price) || price < 0) return;

		  upsertWatchedItem({ id: chosen.id, name: chosen.name, price });

		  // Curățare UI
		  searchInput.value = '';
		  priceInput.value = '';
		  selectedItem = null;
		});


        // Clear storage row
        const clearBtn = document.createElement('button');
        clearBtn.textContent = 'Clear Script Storage';
        Object.assign(clearBtn.style, {
            padding: '4px 8px',
            fontSize: '12px',
            cursor: 'pointer',
            background: '#a33',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
        });
        clearBtn.addEventListener('click', () => {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(ITEMS_KEY);
            localStorage.removeItem(WATCH_KEY);
            apiMsg.textContent = '';
            fetchStatus.textContent = "Item DB Empty";
            renderWatchedItems();
        });
        content.appendChild(clearBtn);

        // Show items icon toggle
		const iconRow = document.createElement('div');
		iconRow.style.display = 'flex';
		iconRow.style.gap = '6px';
		iconRow.style.alignItems = 'center';

		const iconLabel = document.createElement('span');
		iconLabel.textContent = "Show Items Icon:";

		const iconBtn = document.createElement('button');
		Object.assign(iconBtn.style, {
		    padding: '4px 8px',
		    fontSize: '12px',
		    cursor: 'pointer',
		    background: '#444',
		    color: '#fff',
		    border: 'none',
		    borderRadius: '4px',
		});

        // --- Notifications toggle
        const notifRow = document.createElement('div');
        notifRow.style.display = 'flex';
        notifRow.style.gap = '6px';
        notifRow.style.alignItems = 'center';

        const notifLabel = document.createElement('span');
        notifLabel.textContent = "Desktop Notifications:";

        const notifBtn = document.createElement('button');
        Object.assign(notifBtn.style, {
            padding: '4px 8px',
            fontSize: '12px',
            cursor: 'pointer',
            background: '#444',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
        });
        if (localStorage.getItem(NOTIF_ENABLED_KEY) === null) localStorage.setItem(NOTIF_ENABLED_KEY, 'false');
        function updateNotifBtn() {
            notifBtn.textContent = (localStorage.getItem(NOTIF_ENABLED_KEY) === 'true') ? "Disable" : "Enable";
        }
        updateNotifBtn();
        notifBtn.addEventListener('click', async () => {
            const cur = localStorage.getItem(NOTIF_ENABLED_KEY) === 'true';
            if (!cur) {
                // dacă activăm, cerem permisiunea
                const ok = await ensureNotificationPermission();
                if (!ok) {
                    alert('Notification permission was not granted by the browser.');
                    return;
                }
            }
            localStorage.setItem(NOTIF_ENABLED_KEY, (!cur).toString());
            updateNotifBtn();
        });
        notifRow.appendChild(notifLabel);
        notifRow.appendChild(notifBtn);
        content.appendChild(notifRow);

        // --- Sound toggle
        const soundRow = document.createElement('div');
        soundRow.style.display = 'flex';
        soundRow.style.gap = '6px';
        soundRow.style.alignItems = 'center';

        const soundLabel = document.createElement('span');
        soundLabel.textContent = "Sound Alert:";

        const soundBtn = document.createElement('button');
        Object.assign(soundBtn.style, {
            padding: '4px 8px',
            fontSize: '12px',
            cursor: 'pointer',
            background: '#444',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
        });
        if (localStorage.getItem(SOUND_ENABLED_KEY) === null) localStorage.setItem(SOUND_ENABLED_KEY, 'false');
        function updateSoundBtn() {
            soundBtn.textContent = (localStorage.getItem(SOUND_ENABLED_KEY) === 'true') ? "Disable" : "Enable";
        }
        updateSoundBtn();
        soundBtn.addEventListener('click', () => {
            const cur = localStorage.getItem(SOUND_ENABLED_KEY) === 'true';
            localStorage.setItem(SOUND_ENABLED_KEY, (!cur).toString());
            updateSoundBtn();
        });
        soundRow.appendChild(soundLabel);
        soundRow.appendChild(soundBtn);
        content.appendChild(soundRow);

        // (opțional) buton de test alertă
        const testBtn = document.createElement('button');
        testBtn.textContent = 'Test Alert';
        Object.assign(testBtn.style, {
            padding: '4px 8px',
            fontSize: '12px',
            cursor: 'pointer',
            background: '#555',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
        });
        testBtn.addEventListener('click', async () => {
            await notifyDeal({ id: 0, name: 'Test Item', myPrice: 123456, lowest: 123000, type: '' });
        });
        content.appendChild(testBtn);


        // după ce creezi `dropdown` și `searchInput`
        function repositionDropdown() {
            if (dropdown.style.display === 'none') return;
            const rect = searchInput.getBoundingClientRect();
            dropdown.style.top = rect.bottom + 'px';
            dropdown.style.left = rect.left + 'px';
            dropdown.style.width = rect.width + 'px';
        }


		function updateIconBtn() {
		    const val = localStorage.getItem(ICONS_KEY) === 'true';
		    iconBtn.textContent = val ? "Disable" : "Enable";
		}
		updateIconBtn();

		iconBtn.addEventListener('click', () => {
		    const val = localStorage.getItem(ICONS_KEY) === 'true';
		    localStorage.setItem(ICONS_KEY, (!val).toString());
		    updateIconBtn();
		    renderWatchedItems();
		});

        // Refresh interval setting
        const refreshRow = document.createElement('div');
        refreshRow.style.display = 'flex';
        refreshRow.style.gap = '8px';
        refreshRow.style.alignItems = 'center';

        const refreshLabel = document.createElement('span');
        refreshLabel.textContent = "Auto-Refresh (sec):";

        const refreshSelect = document.createElement('select');
        Object.assign(refreshSelect.style, {
            padding: '4px',
            fontSize: '12px',
            borderRadius: '4px',
            border: '1px solid #555',
            background: '#222',
            color: '#fff',
        });
        [15,30,60,120].forEach(v => {
            const opt = document.createElement('option');
            opt.value = String(v);
            opt.textContent = String(v);
            refreshSelect.appendChild(opt);
        });
        refreshSelect.value = String(getRefreshInterval());

        refreshSelect.addEventListener('change', () => {
            const val = parseInt(refreshSelect.value, 10);
            setRefreshInterval(val);
            // repornește timerul cu noul interval
            const evt = new Event('tm-refresh-interval-updated');
            window.dispatchEvent(evt);
        });

        refreshRow.appendChild(refreshLabel);
        refreshRow.appendChild(refreshSelect);
        content.appendChild(refreshRow);


		iconRow.appendChild(iconLabel);
		iconRow.appendChild(iconBtn);
		content.appendChild(iconRow);

        makeDraggable(panel, topBar, repositionDropdown);
    }

    // ---- Draggable helper ----
    function makeDraggable(el, handle, onDrag) {
        let dragging = false, offsetX = 0, offsetY = 0;
        handle.addEventListener('mousedown', e => {
            dragging = true;
            const rect = el.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            if (typeof onDrag === 'function') onDrag(); // repoziționează/ascunde imediat
        });
        function onMouseMove(e) {
            if (!dragging) return;
            el.style.left = (e.clientX - offsetX) + 'px';
            el.style.top = (e.clientY - offsetY) + 'px';
            if (typeof onDrag === 'function') onDrag(); // <— repoziționează dropdown-ul

        }
        function onMouseUp() {
            dragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    }

    function makeResizable(el, handle) {
        if (!el || !handle) return;
        let resizing = false;
        let startX = 0, startY = 0;
        let startW = 0, startH = 0;

        const onMouseDown = (e) => {
            e.preventDefault();
            resizing = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = el.getBoundingClientRect();
            startW = rect.width;
            startH = rect.height;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };

        const onMouseMove = (e) => {
            if (!resizing) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            let newW = Math.min(Math.max(startW + dx, MIN_W), MAX_W);
            let newH = Math.min(Math.max(startH + dy, MIN_H), MAX_H);

            el.style.width = newW + 'px';
            el.style.height = newH + 'px';
        };

        const onMouseUp = () => {
            resizing = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        handle.addEventListener('mousedown', onMouseDown);
    }


    // ---- Init ----
    createFloatingWindow();
})();
