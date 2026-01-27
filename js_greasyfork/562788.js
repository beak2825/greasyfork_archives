// ==UserScript==
// @name         MWI Wondher Tools (WS)
// @namespace    https://github.com/wondher/mwi-wondher-tools
// @version      v4.0.0
// @license      CC-BY-NC-SA-4.0
// @description  A new type of calculator for MWI - Real-time combat analytics with DPS Meter, Loot Tracker, XP Tracker, Party Overview, and more.
// @author       Brian Mendes (Wondher)
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @run-at       document-start
// @icon         data:image/vnd.microsoft.icon;base64,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2/92iqv/hoKA/4eEgf+GhIL/hoOB/4SCgP99fHz/e3l5/3h2d/90dHT/cHFx/3Fzdf9ydHX/DAgE/w4KB/8aFhb/MS8v/3Jzdf9nZmv/VVVb/2diYv9ETlv/EzBO/xIuSv8ULUr/HTRS/2h9q/9mjcH/T22n/2qBzf94jtb/bJHL/3mf0f+GiJD/ioeD/4mGgv+IhYL/hIKB/0xSWf9LXGb/QFdj/0hZYf9DT1j/XmVq/3Z4ef8QDAn/EQwK/wwHBP83NTX/dXR2/2ZlbP9VVVz/b2xs/0JLWP8RLk3/Dy1L/xAtS/9FUHf/dY/B/4Sm2v9KaJr/S2WX/1l3rv9vkML/ia3e/4SUsP+Lh4X/ioaD/2RgZf9VVFz/Ullg/05qdv9ca3T/Vmhw/1Rgaf9UXWT/enp8/wsHBP8KBgP/CgUC/0E/QP91dXX/ZWNr/0hGTf9kYGD/PUZV/w8uTv8PLEv/GTJV/1Rfi/9afrT/aoe+/1tzp/99lsr/dZHI/4mi1P+IpNP/g6DM/4yIif+Lh4b/fXl9/2tpb/9fYmf/YG51/2hudP9ca3H/W2hw/05XX/97eXv/CQQB/wkEAf8KBQL/S0hK/3V0df9mY2z/TktR/3Zsav8/R1f/Dy1N/w0pSv8XJ0T/QExx/z1Uh/9SWID/RVB6/2yCsP9nfa7/ZHqq/2uFvf9ceKf/iYeL/4yJif+Lion/ioiI/2psbv9SbHn/V295/2Vtc/9VYnD/S1Nd/3p5eP8KBQL/DAcD/w8KB/9UUVP/dHR2/2dja/9lXmT/joB7/0NKWv8QLk3/DipM/xMYJf9FSWX/RFFz/1FUcP9YX37/YXCM/11rj/9MWn3/Wl2D/01Pcf94dnj/i4mJ/4yKif+KiIj/dnV3/15iZ/9gYWb/Wlxj/1VZYP9OVFv/enl4/wsGA/8MCAT/Eg0K/1lYWP90cnT/amRr/3plZf/Knn7/U1Fe/xIwT/8PLE3/Exkm/09ljf9dh7//eqPZ/5e55v+gvef/pL/p/5W14P90ndD/R2OL/3Bscf+MiYn/jImJ/4uIiP+KhYj/hYOD/4B/f/9/e37/fHl7/3t5ef97eXj/DAcD/w4IBP8VEA3/XVpc/3Jycv9tZGr/g2tl/8+ffv9ZVF7/FDNR/xMvTv8UHSv/MjxX/2OHvP94o9r/i7Pl/5q76P+avOn/jrXm/3ai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5v/g5eb/4OXm/9/k5v/g5eb/3uPk/9nf4v/O1tr/vcfN/3WLov8uUHn/K01r/zdpef87dYL/IkVQ/ys+SP9KcoD/RYSU/zhzg/9Qjp//Zput/5iepP+boqb/oKap/7G2uP/Lz9H/3OHh/+fs7P/t8fH/5uvr/9re4P+2ubv/hoSK/6epsP/M0dX/z9XY/8HHzf/Y3d7/4eXm/+Ln6P/f5OX/2+Dh/9zh4v/j5+n/5erq/+br7P/l6uv/4+jp/+Ln6P/i5+j/4ebn/+Dl5v/h5uf/4OXm/9zi4//R2dz/wcvQ/4GVqf8pR2z/HDNJ/ypdav8peYf/F1tq/yRAS/9BX2v/TomY/z+Glf9Bhpf/V5yt/6Oorv+pr7T/s7m8/8bKzP/Y3Nz/4ebm/+bq6//p7u3/6Ozs/+Pn6P/d4uL/1Nnb/8jO0v/U2Nr/1tvc/8zR1P/b4OH/5Onp/+Tp6v/f5OX/3OHi/+Ln6P/n7Ov/6Ozt/+jt7v/k6er/4+jq/+Tp6v/i5+j/4ebn/+Ln6P/h5uf/4ufo/97k5f/V3N//xs/W/42gs/8mRW//Ex4u/xkzOv8vdYP/N3+Q/yRUYv8tTVj/PGh1/0WNnP84j5//Ppmo/7i8v//EyMv/zNHR/9PX2P/c4OH/5uvq//H19P/z9/b/8PX0/+rv7v/g5eX/19vc/9PY2//Z3t//3eHi/9ba3f/f4+T/5uvr/+br6//f5OX/4ebo/+nt7f/p7u7/6+/w/+jt7v/l6uv/5err/+Xq6//j6On/4ufo/+Ln6P/i5+j/4ufo/9/k5v/Y3+L/y9TY/6CvwP87Un3/LCs9/yomLv9KZnL/YJKi/018jP8yWGX/Mlhl/zh2hf85kqH/Mpio/7u7vv/P09T/2+Df/+Ln5v/o7ez/8PT0//T39v/19/f/8fX1/+zx8f/l6ur/3ODh/9nd3v/c4eH/4+jn/9zh4v/j5+f/6+/v/+br7P/i5uj/6Ozt/+rv7//s8PH/6/Dw/+Tp6v/KztD/ztPW/+br7P/j6Or/4ufo/+Po6f/j6On/4+jp/+Hm5//b4eP/0dnc/6y3xv9QW4P/SzxN/zUoMP87QUz/VoGQ/02Elv9EaHf/PGZ1/zp6if9Fk6L/NZqo/7aytP/Lysz/4eXl/+js7P/s8fD/8PX0//X39//1+Pf/8/b2//H19f/r8O//4+jn/9/k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
// @grant        GM_xmlhttpRequest
// @connect      greasyfork.org
// @connect      api.greasyfork.org
// @connect      api.github.com
// @downloadURL https://update.greasyfork.org/scripts/562788/MWI%20Wondher%20Tools%20%28WS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562788/MWI%20Wondher%20Tools%20%28WS%29.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const pageWindow = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;

    if (pageWindow.__mwiWondherInjected) return;
    pageWindow.__mwiWondherInjected = true;

    const SCRIPT_VERSION = "v4.0.0";
    const SCRIPT_CHANGELOG = [
        {
            version: "v4.0.0",
            date: "2026-01-27",
            items: {
                "pt-BR": [
                    "Atualizações automáticas com permissão do usuário",
                    "Novidades via releases do GitHub",
                    "Hook WebSocket mais seguro (sandbox compatível)",
                    "Correções de inicialização da UI",
                ],
                "en-US": [
                    "User-approved automatic updates",
                    "What’s New from GitHub releases",
                    "Safer WebSocket hook (sandbox compatible)",
                    "UI initialization fixes",
                ],
            },
        },
        {
            version: "v3.2.5",
            date: "2026-01-27",
            items: {
                "pt-BR": [
                    "Hook de WebSocket mais seguro",
                    "UI inicializa após o DOM estar pronto",
                    "Versão visível no painel",
                ],
                "en-US": [
                    "Safer WebSocket hook",
                    "UI initializes after DOM is ready",
                    "Version visible in panel",
                ],
            },
        },
        {
            version: "v3.2.4",
            date: "2026-01-16",
            items: {
                "pt-BR": ["Correções gerais de estabilidade"],
                "en-US": ["General stability fixes"],
            },
        },
    ];

    const UPDATE_OPTIN_KEY = "mwi_update_optin";
    const UPDATE_CACHE_KEY = "mwi_update_cache_v1";
    const UPDATE_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
    const GREASYFORK_API_URL =
        "https://api.greasyfork.org/en/scripts/562788-mwi-wondher-tools-ws.json";
    const GITHUB_REPO = "wondher/mwi-wondher-tools";
    const GITHUB_RELEASES_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases?per_page=5`;

    const MARKET_API_URL = window.location.href.includes("milkywayidle.com")
    ? "https://www.milkywayidle.com/game_data/marketplace.json"
    : "https://www.milkywayidlecn.com/game_data/marketplace.json";

    const state = {
        sessionStartTs: null,
        lastUpdateTs: null,
        battleId: null,
        players: [],
        monsters: [],
        playerDamage: {},
        playerDamageTaken: {},
        partyDamage: 0,
        partyDamageTaken: 0,
        encountersCompleted: 0,
        coinsGained: 0,
        estimatedValueGained: 0,
        loot: {},
        unknownValueLoot: {},
        xpGainedBySkill: {},
        totalExpGained: 0,
        totalLevelExpGained: 0,
        lastAbilityByPlayer: {},
        isInCombat: false,
    };

    const internal = {
        lastActionCount: null,
        lastItemCountsByHash: {},
        lastSkillExp: {},
        lastPlayerDmg: {},
        lastMonsterDmg: {},
        lastPlayerHP: {},
        playerIndexToName: {},
        monsterIndexToName: {},
        inventoryCountsByItemHrid: {},
        priceTable: {},
        marketData: null,
        priceTableSource: "none",
        itemsInitialized: false,
        skillsInitialized: false,
    };

    function toNumber(value) {
        if (typeof value === "number") return value;
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
    }

    function normalizeName(text, fallback) {
        if (typeof text === "string" && text.trim()) return text.trim();
        return fallback;
    }

    function updateSessionStart(timestamp) {
        if (!state.sessionStartTs) state.sessionStartTs = timestamp || Date.now();
    }

    function updateLastTimestamp(timestamp) {
        state.lastUpdateTs = timestamp || Date.now();
    }

    function formatHrid(hrid) {
        if (!hrid) return "";
        return hrid.split("/").pop().replace(/_/g, " ");
    }

    const LOCALE_KEY = "mwi_wondher_locale";

    function getInitialLocale() {
        try {
            const stored = localStorage.getItem(LOCALE_KEY);
            if (stored === "pt-BR" || stored === "en-US") return stored;
        } catch {
            // ignore storage errors
        }
        const lang = (navigator.language || "en-US").toLowerCase();
        return lang.startsWith("pt") ? "pt-BR" : "en-US";
    }

    let currentLocale = getInitialLocale();

    function formatNumber(value) {
        const num = Number(value || 0);
        return new Intl.NumberFormat(currentLocale, {
            maximumFractionDigits: 2,
        }).format(num);
    }

    function formatCompact(value) {
        const num = Number(value || 0);
        const abs = Math.abs(num);
        if (abs < 1000) return formatNumber(num);
        const units = [
            { v: 1e12, s: "t" },
            { v: 1e9, s: "b" },
            { v: 1e6, s: "m" },
            { v: 1e3, s: "k" },
        ];
        const unit = units.find((u) => abs >= u.v) || units[units.length - 1];
        const val = num / unit.v;
        return `${formatNumber(val)}${unit.s}`;
    }

    function formatDuration(totalSeconds) {
        const seconds = Math.max(0, Math.floor(totalSeconds || 0));
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${String(h).padStart(2, "0")}:${String(m).padStart(
            2,
            "0"
        )}:${String(s).padStart(2, "0")}`;
    }

    const MARKET_CACHE_KEY = "mwi_market_price_cache_v1";
    const MARKET_CACHE_TTL_MS = 30 * 60 * 1000;

    function getUpdateOptIn() {
        try {
            return localStorage.getItem(UPDATE_OPTIN_KEY) === "1";
        } catch {
            return false;
        }
    }

    const updateState = {
        enabled: getUpdateOptIn(),
        status: "idle",
        lastCheckedAt: null,
        latestVersion: null,
        updateUrl: null,
        infoUrl: null,
        hasUpdate: false,
        isChecking: false,
        error: null,
    };

    const newsState = {
        status: "idle",
        releases: [],
        isLoading: false,
        error: null,
    };

    function setUpdateOptIn(enabled) {
        updateState.enabled = Boolean(enabled);
        try {
            localStorage.setItem(UPDATE_OPTIN_KEY, updateState.enabled ? "1" : "0");
        } catch {
            // ignore storage errors
        }
        render();
        if (updateState.enabled) {
            checkForUpdates({ manual: false });
        }
    }

    function getCachedUpdateInfo() {
        try {
            const raw = localStorage.getItem(UPDATE_CACHE_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (!parsed || !parsed.savedAt || !parsed.data) return null;
            if (Date.now() - parsed.savedAt > UPDATE_CACHE_TTL_MS) return null;
            return parsed.data;
        } catch {
            return null;
        }
    }

    function setCachedUpdateInfo(data) {
        try {
            localStorage.setItem(
                UPDATE_CACHE_KEY,
                JSON.stringify({ savedAt: Date.now(), data })
            );
        } catch {
            // ignore cache errors
        }
    }

    function parseVersion(version) {
        if (!version) return [];
        return String(version)
            .replace(/^v/i, "")
            .split(/[^0-9]+/)
            .filter(Boolean)
            .map((n) => Number(n));
    }

    function compareVersions(a, b) {
        const av = parseVersion(a);
        const bv = parseVersion(b);
        const len = Math.max(av.length, bv.length);
        for (let i = 0; i < len; i += 1) {
            const ai = av[i] || 0;
            const bi = bv[i] || 0;
            if (ai > bi) return 1;
            if (ai < bi) return -1;
        }
        return 0;
    }

    function fetchJson(url) {
        return new Promise((resolve, reject) => {
            if (typeof GM_xmlhttpRequest === "function") {
                GM_xmlhttpRequest({
                    method: "GET",
                    url,
                    onload: (res) => {
                        try {
                            resolve(JSON.parse(res.responseText));
                        } catch (err) {
                            reject(err);
                        }
                    },
                    onerror: () => reject(new Error("request_failed")),
                });
                return;
            }

            fetch(url, { cache: "no-store" })
                .then((res) => {
                    if (!res.ok) throw new Error("http_error");
                    return res.json();
                })
                .then(resolve)
                .catch(reject);
        });
    }

    function escapeHtml(text) {
        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    async function fetchGithubReleases() {
        if (newsState.isLoading) return;
        newsState.isLoading = true;
        newsState.status = "loading";
        newsState.error = null;
        render();

        try {
            const data = await fetchJson(GITHUB_RELEASES_URL);
            const releases = Array.isArray(data) ? data : [];
            newsState.releases = releases.slice(0, 5).map((rel) => ({
                tag: rel.tag_name || rel.name || "",
                name: rel.name || rel.tag_name || "",
                body: rel.body || "",
                url: rel.html_url || "",
                publishedAt: rel.published_at || rel.created_at || "",
            }));
            newsState.status = newsState.releases.length ? "loaded" : "empty";
        } catch (err) {
            newsState.status = "error";
            newsState.error = err?.message || "error";
        } finally {
            newsState.isLoading = false;
            render();
        }
    }

    async function checkForUpdates({ manual = false } = {}) {
        if (updateState.isChecking) return;
        if (!updateState.enabled && !manual) return;

        updateState.isChecking = true;
        updateState.status = "checking";
        updateState.error = null;
        render();

        try {
            let data = getCachedUpdateInfo();
            if (!data || manual) {
                data = await fetchJson(GREASYFORK_API_URL);
                setCachedUpdateInfo(data);
            }

            updateState.latestVersion = data?.version || null;
            updateState.updateUrl = data?.code_url || null;
            updateState.infoUrl = data?.url || null;
            updateState.lastCheckedAt = Date.now();

            const cmp = compareVersions(updateState.latestVersion, SCRIPT_VERSION);
            updateState.hasUpdate = cmp > 0 && Boolean(updateState.updateUrl);
            updateState.status = updateState.hasUpdate ? "update_available" : "up_to_date";
        } catch (err) {
            updateState.status = "error";
            updateState.error = err?.message || "error";
        } finally {
            updateState.isChecking = false;
            render();
        }
    }

    function openUpdateUrl() {
        if (!updateState.updateUrl) return;
        window.open(updateState.updateUrl, "_blank", "noopener");
    }

    function openUpdateInfo() {
        if (!updateState.infoUrl) return;
        window.open(updateState.infoUrl, "_blank", "noopener");
    }

    function formatUpdateStatus() {
        if (updateState.isChecking) return t("updates_checking");
        if (updateState.status === "missing_id") return t("updates_missing_id");
        if (updateState.status === "update_available") return t("updates_available");
        if (updateState.status === "up_to_date") return t("updates_uptodate");
        if (updateState.status === "error") return t("updates_error");
        return t("updates_idle");
    }

    async function loadMarketPrices(force = false) {
        try {
            const cached = getCachedPrices();
            if (cached && !force) {
                internal.priceTable = cached.map;
                internal.marketData = null;
                internal.priceTableSource = "cache";
                return;
            }

            const res = await fetch(MARKET_API_URL, { cache: "no-store" });
            if (!res.ok) return;
            const data = await res.json();
            const map = extractPriceTable(data);
            if (Object.keys(map).length > 0) {
                internal.priceTable = map;
                internal.marketData = data?.marketData || data;
                internal.priceTableSource = "market";
                setCachedPrices(map);
            }
        } catch (err) {
            // fallback silencioso
        }
    }

    function getCachedPrices() {
        try {
            const raw = localStorage.getItem(MARKET_CACHE_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (!parsed || !parsed.map || !parsed.savedAt) return null;
            if (Date.now() - parsed.savedAt > MARKET_CACHE_TTL_MS) return null;
            return parsed;
        } catch {
            return null;
        }
    }

    function setCachedPrices(map) {
        try {
            const payload = { savedAt: Date.now(), map };
            localStorage.setItem(MARKET_CACHE_KEY, JSON.stringify(payload));
        } catch {
            // ignore cache errors
        }
    }

    function extractPriceTable(data) {
        const map = {};
        const source = data?.marketData || data;
        if (source && typeof source === "object" && !Array.isArray(source)) {
            Object.entries(source).forEach(([hrid, levels]) => {
                if (!levels || typeof levels !== "object") return;
                const levelKey = levels["0"] ? "0" : getLowestLevelKey(levels);
                const level = levels[levelKey];
                if (!level) return;
                const price = resolveBestPrice(level);
                if (price > 0) map[hrid] = price;
            });
            return map;
        }

        const visited = new Set();
        const queue = [data];
        let steps = 0;

        while (queue.length && steps < 2000) {
            const node = queue.shift();
            steps += 1;
            if (!node || typeof node !== "object") continue;
            if (visited.has(node)) continue;
            visited.add(node);

            if (Array.isArray(node)) {
                node.forEach((item) => queue.push(item));
                continue;
            }

            const maybeItemHrid =
                  node.itemHrid || node.hrid || node.item || node.item_hrid;
            const maybePrice =
                  node.sellPrice ??
                  node.unitPrice ??
                  node.price ??
                  node.minPrice ??
                  node.minimumPrice ??
                  node.averagePrice ??
                  node.value;

            if (maybeItemHrid && typeof maybePrice === "number" && maybePrice > 0) {
                map[maybeItemHrid] = maybePrice;
            }

            Object.values(node).forEach((child) => queue.push(child));
        }

        return map;
    }

    function getLowestLevelKey(levels) {
        const keys = Object.keys(levels || {})
        .map((k) => Number(k))
        .filter((n) => Number.isFinite(n));
        if (!keys.length) return "0";
        return String(Math.min(...keys));
    }

    function resolveBestPrice(level) {
        if (!level || typeof level !== "object") return 0;
        const bid = Number(level.b);
        if (Number.isFinite(bid) && bid > 0) return bid;
        const ask = Number(level.a);
        if (Number.isFinite(ask) && ask > 0) return ask;
        return 0;
    }

    function getMarketPrice(hrid, enhancementLevel = 0) {
        if (internal.marketData && internal.marketData[hrid]) {
            const levels = internal.marketData[hrid];
            const key = levels[String(enhancementLevel)]
            ? String(enhancementLevel)
            : levels["0"]
            ? "0"
            : getLowestLevelKey(levels);
            const level = levels[key];
            const price = resolveBestPrice(level);
            if (price > 0) return price;
        }
        const fallback = internal.priceTable[hrid];
        return typeof fallback === "number" ? fallback : 0;
    }

    function handleNewBattle(data, timestamp) {
        updateSessionStart(timestamp);
        state.isInCombat = true;
        state.battleId = data.battleId || state.battleId;

        const players = Array.isArray(data.players) ? data.players : [];
        internal.playerIndexToName = {};
        state.players = players.map((p, idx) => {
            const name = normalizeName(p?.name, `Player ${idx + 1}`);
            internal.playerIndexToName[idx] = name;
            return {
                name,
                currentHP: toNumber(p?.currentHitpoints),
                maxHP: toNumber(p?.maxHitpoints),
                currentMP: toNumber(p?.currentManapoints),
                maxMP: toNumber(p?.maxManapoints),
                combatStyle: p?.combatStyleHrid || p?.primaryTraining || "",
            };
        });

        const monsters = Array.isArray(data.monsters) ? data.monsters : [];
        internal.monsterIndexToName = {};
        state.monsters = monsters.map((m, idx) => {
            const name = normalizeName(
                m?.name,
                m?.hrid?.split("/").pop()?.replace(/_/g, " ") || `Monster ${idx + 1}`
      );
            internal.monsterIndexToName[idx] = name;
            return { name, hrid: m?.hrid || "" };
        });

        internal.lastPlayerDmg = {};
        internal.lastMonsterDmg = {};
        internal.lastPlayerHP = {};
    }

    function updatePlayerVitalsFromBattle(pMap) {
        if (!pMap) return;
        const updatedPlayers = [...state.players];
        Object.entries(pMap).forEach(([idx, entry]) => {
            const index = Number(idx);
            const name = internal.playerIndexToName[index] || `Player ${index + 1}`;
            const playerIndex = updatedPlayers.findIndex((p) => p.name === name);
            const current = {
                name,
                currentHP: toNumber(entry.cHP),
                maxHP: toNumber(entry.mHP),
                currentMP: toNumber(entry.cMP),
                maxMP: toNumber(entry.mMP),
                combatStyle: updatedPlayers[playerIndex]?.combatStyle || "",
            };

            if (playerIndex >= 0) {
                updatedPlayers[playerIndex] = current;
            } else {
                updatedPlayers.push(current);
            }

            if (entry.abilityHrid) {
                state.lastAbilityByPlayer[name] = entry.abilityHrid;
            }
        });
        state.players = updatedPlayers;
    }

    function handleBattleUpdated(data, timestamp) {
        updateSessionStart(timestamp);
        state.isInCombat = true;
        state.battleId = data.battleId || state.battleId;

        const pMap = data.pMap || {};
        const mMap = data.mMap || {};

        updatePlayerVitalsFromBattle(pMap);

        Object.entries(pMap).forEach(([idx, entry]) => {
            const index = Number(idx);
            const name = internal.playerIndexToName[index] || `Player ${index + 1}`;
            const dmg = toNumber(entry.dmgCounter);
            const prev = internal.lastPlayerDmg[index] || 0;
            const delta = Math.max(0, dmg - prev);
            internal.lastPlayerDmg[index] = dmg;

            if (delta > 0) {
                state.playerDamage[name] = (state.playerDamage[name] || 0) + delta;
                state.partyDamage += delta;
            }

            const currentHP = toNumber(entry.cHP);
            const prevHP = internal.lastPlayerHP[index];
            if (typeof prevHP === "number") {
                const taken = Math.max(0, prevHP - currentHP);
                if (taken > 0) {
                    state.playerDamageTaken[name] =
                        (state.playerDamageTaken[name] || 0) + taken;
                    state.partyDamageTaken += taken;
                }
            }
            internal.lastPlayerHP[index] = currentHP;
        });

        Object.entries(mMap).forEach(([idx, entry]) => {
            const index = Number(idx);
            const dmg = toNumber(entry.dmgCounter);
            const prev = internal.lastMonsterDmg[index] || 0;
            const delta = Math.max(0, dmg - prev);
            internal.lastMonsterDmg[index] = dmg;

            if (delta > 0) state.partyDamageTaken += delta;
        });
    }

    function applyItemDelta(item, delta) {
        if (delta <= 0) return;
        if (item.itemHrid === "/items/coin") {
            state.coinsGained += delta;
            state.estimatedValueGained += delta;
            return;
        }
        state.loot[item.itemHrid] = (state.loot[item.itemHrid] || 0) + delta;

        const price = getMarketPrice(item.itemHrid, item.enhancementLevel || 0);
        if (typeof price === "number") {
            state.estimatedValueGained += delta * price;
        } else {
            state.unknownValueLoot[item.itemHrid] =
                (state.unknownValueLoot[item.itemHrid] || 0) + delta;
        }
    }

    function handleItemsUpdated(data) {
        const items = Array.isArray(data.endCharacterItems)
        ? data.endCharacterItems
        : [];
        items.forEach((item) => {
            if (item.itemLocationHrid !== "/item_locations/inventory") return;
            const hash =
                  item.hash ||
                  `${item.characterID || "0"}::${item.itemHrid}::${
          item.enhancementLevel || 0
            }`;
            const count = toNumber(item.count);
            const hasSeen = Object.prototype.hasOwnProperty.call(
                internal.lastItemCountsByHash,
                hash
            );
            const prev = hasSeen ? internal.lastItemCountsByHash[hash] : 0;
            const delta = count - prev;
            internal.lastItemCountsByHash[hash] = count;

            if (!hasSeen) {
                internal.inventoryCountsByItemHrid[item.itemHrid] =
                    (internal.inventoryCountsByItemHrid[item.itemHrid] || 0) + count;
                return;
            }

            internal.inventoryCountsByItemHrid[item.itemHrid] =
                (internal.inventoryCountsByItemHrid[item.itemHrid] || 0) + delta;

            if (internal.itemsInitialized) {
                applyItemDelta(item, delta);
            }
        });
        if (!internal.itemsInitialized) internal.itemsInitialized = true;
    }

    function handleSkillsUpdated(skills) {
        const skillList = Array.isArray(skills) ? skills : [];
        skillList.forEach((skill) => {
            const hrid = skill.skillHrid || "";
            if (!hrid) return;
            const exp = toNumber(skill.experience);
            const prev = internal.lastSkillExp[hrid] || 0;
            const delta = exp - prev;
            internal.lastSkillExp[hrid] = exp;
            if (!internal.skillsInitialized) return;
            if (delta <= 0) return;

            state.xpGainedBySkill[hrid] = (state.xpGainedBySkill[hrid] || 0) + delta;
            state.totalExpGained += delta;
            if (hrid === "/skills/total_level") state.totalLevelExpGained += delta;
        });
        if (!internal.skillsInitialized) internal.skillsInitialized = true;
    }

    function handleActionCompleted(data, timestamp) {
        updateSessionStart(timestamp);
        const action = data.endCharacterAction || {};
        const currentCount = toNumber(action.currentCount);
        if (currentCount && internal.lastActionCount !== null) {
            const delta = Math.max(0, currentCount - internal.lastActionCount);
            state.encountersCompleted += delta;
        }
        if (currentCount) internal.lastActionCount = currentCount;

        handleItemsUpdated(data);
        handleSkillsUpdated(data.endCharacterSkills);
    }

    function handleMessage(payload, timestamp) {
        if (!payload || typeof payload !== "object") return;
        const message =
              payload.data && payload.type === "message" ? payload.data : payload;
        const type = message?.type || payload?.eventType;
        if (!type) return;
        updateLastTimestamp(timestamp);

        if (type === "new_battle") return handleNewBattle(message, timestamp);
        if (type === "battle_updated") {
            return handleBattleUpdated(message, timestamp);
        }
        if (type === "items_updated") return handleItemsUpdated(message);
        if (type === "action_completed") {
            return handleActionCompleted(message, timestamp);
        }
    }

    function parseMessageData(messageEvent) {
        const raw = messageEvent?.data;
        if (!raw) return null;

        if (typeof raw === "object" && !(raw instanceof ArrayBuffer) && !(raw instanceof Blob)) {
            return raw;
        }

        if (typeof raw === "string") {
            try {
                return JSON.parse(raw);
            } catch {
                return null;
            }
        }

        if (raw instanceof ArrayBuffer) {
            try {
                const decoded = new TextDecoder("utf-8").decode(raw);
                return JSON.parse(decoded);
            } catch {
                return null;
            }
        }

        if (ArrayBuffer.isView(raw)) {
            try {
                const decoded = new TextDecoder("utf-8").decode(raw);
                return JSON.parse(decoded);
            } catch {
                return null;
            }
        }

        if (raw instanceof Blob) {
            return raw.text().then((text) => {
                try {
                    return JSON.parse(text);
                } catch {
                    return null;
                }
            });
        }

        return null;
    }

    function patchWebSocket() {
        const OriginalWebSocket = pageWindow.WebSocket;
        if (!OriginalWebSocket || pageWindow.__mwiWondherWsPatched) return;
        pageWindow.__mwiWondherWsPatched = true;

        const trackedSockets = new WeakSet();

        const onMessage = (event) => {
            try {
                const maybePromise = parseMessageData(event);
                if (maybePromise && typeof maybePromise.then === "function") {
                    maybePromise.then((data) => handleMessage(data, Date.now())).catch(() => {});
                } else {
                    handleMessage(maybePromise, Date.now());
                }
            } catch (e) {
                // Silent fail - don't break the game
            }
        };

        const attachListener = (ws) => {
            if (!ws || trackedSockets.has(ws)) return;
            try {
                trackedSockets.add(ws);
                ws.addEventListener("message", onMessage);
            } catch (e) {
                // Silent fail
            }
        };

        // Use Proxy instead of replacing constructor - more transparent
        pageWindow.WebSocket = new Proxy(OriginalWebSocket, {
            construct(target, args) {
                const ws = new target(...args);
                // Attach listener after a microtask to avoid interfering with construction
                Promise.resolve().then(() => attachListener(ws));
                return ws;
            },
            get(target, prop, receiver) {
                return Reflect.get(target, prop, receiver);
            },
            set(target, prop, value, receiver) {
                return Reflect.set(target, prop, value, receiver);
            }
        });
    }

    function getDerived() {
        const now = Date.now();
        const durationMs = state.sessionStartTs
        ? Math.max(0, now - state.sessionStartTs)
        : 0;
        const durationHours = Math.max(durationMs / 3600000, 0.0001);
        const totalLevelExp = state.totalLevelExpGained || 0;
        const totalExp = totalLevelExp || state.totalExpGained || 0;
        const skillExpTotal = Math.max(
            0,
            (state.totalExpGained || 0) - totalLevelExp
        );

        const rates = {
            encountersPerHour: state.encountersCompleted / durationHours,
            estimatedRevenuePerHour: state.estimatedValueGained / durationHours,
            coinsPerHour: state.coinsGained / durationHours,
            expPerHour: totalExp / durationHours,
            skillExpPerHour: skillExpTotal / durationHours,
        };

        const projectionsHours =
              uiState.projectionHours + uiState.projectionDays * 24;
        const projections = {
            encounters: rates.encountersPerHour * projectionsHours,
            estimatedRevenue: rates.estimatedRevenuePerHour * projectionsHours,
            coins: rates.coinsPerHour * projectionsHours,
            exp: rates.expPerHour * projectionsHours,
            skillExp: rates.skillExpPerHour * projectionsHours,
        };

        return { durationMs, durationHours, totalExp, rates, projections };
    }

    const uiState = {
        currentTab: "rates",
        projectionHours: 1,
        projectionDays: 0,
        minimized: false,
        isInteracting: false,
        panelWidth: null,
        panelHeight: null,
        locale: currentLocale,
    };

    const i18n = {
        "pt-BR": {
            tabs_rates: "📊 Taxas",
            tabs_dps: "⚔️ Batalha",
            tabs_loot: "💰 Loot",
            tabs_xp: "✨ XP",
            tabs_session: "📈 Sessão",
            waiting_ws: "Aguardando WebSocket",
            waiting_combat: "Aguardando Combate",
            no_loot: "Nenhum Loot",
            no_xp: "Nenhum XP",
            rates_title: "Taxas atuais",
            projections_title: "Projeções",
            hours: "Horas",
            days: "Dias",
            encounters_per_hour: "Encontros/h",
            revenue_per_hour: "Receita estim./h",
            coins_per_hour: "Moedas/h",
            xp_per_hour: "XP/h",
            skill_xp_per_hour: "XP Skill/h",
            encounters: "Encontros",
            est_revenue: "Receita estim.",
            coins: "Moedas",
            xp: "XP",
            skill_xp: "XP Skill",
            group: "Grupo",
            monsters: "Monstros",
            total_damage_done: "Dano Total Realizado",
            total_damage_taken: "Dano Total Recebido",
            resources_obtained: "Recursos Obtidos",
            inventory: "Inventário",
            price: "Preço",
            drop_value: "Valor drop",
            inventory_value: "Valor inv.",
            inventory_fee_note: "Inventário (2% taxa)",
            missing_price_table: "Sem preço na tabela",
            xp_gains: "Ganhos de XP",
            session: "Sessão",
            duration: "Duração",
            total_damage: "Dano Total",
            total_taken: "Dano Recebido",
            total_xp: "XP Total",
            price_table: "Tabela de preços",
            drops: "drops",
            updates_title: "Atualizações",
            updates_enable: "Ativar",
            updates_disable: "Desativar",
            updates_check: "Verificar",
            updates_open: "Atualizar",
            updates_notes: "Abrir página",
            updates_status_label: "Status",
            updates_checking: "Verificando...",
            updates_available: "Nova versão disponível",
            updates_uptodate: "Você está atualizado",
            updates_error: "Falha ao verificar",
            updates_idle: "Não verificado",
            updates_missing_id: "Instale via GreasyFork para ativar",
            news_title: "Novidades",
            news_loading: "Carregando do GitHub...",
            news_empty: "Sem releases no GitHub ainda",
            news_error: "Falha ao carregar do GitHub",
        },
        "en-US": {
            tabs_rates: "📊 Rates",
            tabs_dps: "⚔️ Battle",
            tabs_loot: "💰 Loot",
            tabs_xp: "✨ XP",
            tabs_session: "📈 Session",
            waiting_ws: "Waiting for WebSocket",
            waiting_combat: "Waiting for Combat",
            no_loot: "No Loot",
            no_xp: "No XP",
            rates_title: "Current rates",
            projections_title: "Projections",
            hours: "Hours",
            days: "Days",
            encounters_per_hour: "Encounters/h",
            revenue_per_hour: "Est. revenue/h",
            coins_per_hour: "Coins/h",
            xp_per_hour: "XP/h",
            skill_xp_per_hour: "Skill XP/h",
            encounters: "Encounters",
            est_revenue: "Est. revenue",
            coins: "Coins",
            xp: "XP",
            skill_xp: "Skill XP",
            group: "Party",
            monsters: "Monsters",
            total_damage_done: "Total Damage Done",
            total_damage_taken: "Total Damage Taken",
            resources_obtained: "Resources Obtained",
            inventory: "Inventory",
            price: "Price",
            drop_value: "Drop value",
            inventory_value: "Inventory value",
            inventory_fee_note: "Inventory (2% fee)",
            missing_price_table: "Missing price in table",
            xp_gains: "XP Gains",
            session: "Session",
            duration: "Duration",
            total_damage: "Total Damage",
            total_taken: "Damage Taken",
            total_xp: "Total XP",
            price_table: "Price table",
            drops: "drops",
            language_label: "Language",
            updates_title: "Updates",
            updates_enable: "Enable",
            updates_disable: "Disable",
            updates_check: "Check",
            updates_open: "Update",
            updates_notes: "Open page",
            updates_status_label: "Status",
            updates_checking: "Checking...",
            updates_available: "New version available",
            updates_uptodate: "You are up to date",
            updates_error: "Failed to check",
            updates_idle: "Not checked",
            updates_missing_id: "Install via GreasyFork to enable",
            news_title: "What’s New",
            news_loading: "Loading from GitHub...",
            news_empty: "No GitHub releases yet",
            news_error: "Failed to load from GitHub",
        },
    };

    function t(key) {
        return (i18n[currentLocale] || i18n["en-US"])[key] || key;
    }

    function setLocale(locale) {
        if (locale !== "pt-BR" && locale !== "en-US") return;
        currentLocale = locale;
        uiState.locale = locale;
        try {
            localStorage.setItem(LOCALE_KEY, locale);
        } catch {
            // ignore storage errors
        }
        render();
    }

    function setLauncherVisible(visible) {
        const launcher = document.getElementById("mwi-launcher");
        if (!launcher) return;
        launcher.style.display = visible ? "flex" : "none";
    }

    function openPanel() {
        const container = document.getElementById("mwi-wondher-panel");
        if (container) {
            container.style.display = "block";
            setLauncherVisible(false);
            render();
            return;
        }
        createPanel();
        setLauncherVisible(false);
        render();
    }

    function createLauncher() {
        if (!document.body) return;
        if (document.getElementById("mwi-launcher")) return;
        const launcher = document.createElement("button");
        launcher.id = "mwi-launcher";
        launcher.textContent = "⚙️";
        launcher.style.cssText = `
      position: fixed;
      right: 18px;
      bottom: 18px;
      width: 44px;
      height: 44px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.2);
      background: linear-gradient(135deg, rgba(168,85,247,0.9), rgba(236,72,153,0.9));
      box-shadow: 0 12px 24px rgba(0,0,0,0.35);
      color: #0f172a;
      font-size: 18px;
      cursor: pointer;
      z-index: 9999;
      display: none;
      align-items: center;
      justify-content: center;
    `;
        launcher.onclick = () => openPanel();
        document.body.appendChild(launcher);
    }

    function createPanel() {
        if (!document.body) return;
        const container = document.createElement("div");
        container.id = "mwi-wondher-panel";
        container.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 9999;
            background: linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04)) , rgba(15, 23, 42, 0.88);
            border: 1px solid rgba(255, 255, 255, 0.18);
            border-radius: 12px;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08);
            backdrop-filter: blur(20px) saturate(160%);
            color: #e2e8f0;
            font-family: Inter, system-ui, sans-serif;
            width: 380px;
            overflow: hidden;
        `;

        const header = document.createElement("div");
        header.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 12px;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            background: rgba(30, 41, 59, 0.6);
            cursor: move;
        `;

        const title = document.createElement("div");
        title.innerHTML = `<span style="font-weight:700;background:linear-gradient(135deg,#a855f7,#ec4899);-webkit-background-clip:text;color:transparent;">Wondher Tools</span><span style="margin-left:6px;font-size:0.65rem;color:#94a3b8;">${SCRIPT_VERSION}</span>`;

        const headerActions = document.createElement("div");
        headerActions.style.cssText = `display:flex;gap:6px;align-items:center;`;

        const statusDot = document.createElement("span");
        statusDot.id = "mwi-status-dot";
        statusDot.style.cssText = `width:8px;height:8px;border-radius:50%;background:#64748b;box-shadow:0 0 8px #64748b;`;

        const langToggle = document.createElement("button");
        langToggle.id = "mwi-lang-toggle";
        langToggle.textContent = uiState.locale === "pt-BR" ? "PT-BR" : "EN-US";
        langToggle.style.cssText = buttonCss();
        langToggle.title = "Language";
        langToggle.onclick = () => {
            setLocale(uiState.locale === "pt-BR" ? "en-US" : "pt-BR");
        };

        const btnMin = document.createElement("button");
        btnMin.textContent = "➖";
        btnMin.style.cssText = buttonCss();
        btnMin.onclick = () => {
            uiState.minimized = !uiState.minimized;
            render();
        };

        const btnClose = document.createElement("button");
        btnClose.textContent = "✕";
        btnClose.style.cssText = buttonCss("danger");
        btnClose.onclick = () => {
            container.style.display = "none";
            uiState.minimized = false;
            setLauncherVisible(true);
        };

        headerActions.appendChild(statusDot);
        headerActions.appendChild(langToggle);
        headerActions.appendChild(btnMin);
        headerActions.appendChild(btnClose);
        header.appendChild(title);
        header.appendChild(headerActions);

        const tabs = document.createElement("div");
        tabs.id = "mwi-tabs";
        tabs.style.cssText = `display:flex;border-bottom:1px solid rgba(255,255,255,0.08);background:rgba(30,41,59,0.35);`;

        const tabList = [
            { id: "rates", label: t("tabs_rates") },
            { id: "dps", label: t("tabs_dps") },
            { id: "loot", label: t("tabs_loot") },
            { id: "xp", label: t("tabs_xp") },
            { id: "session", label: t("tabs_session") },
        ];

        tabList.forEach((tab) => {
            const btn = document.createElement("button");
            btn.textContent = tab.label;
            btn.style.cssText = tabButtonCss(tab.id === uiState.currentTab);
            btn.onclick = () => {
                uiState.currentTab = tab.id;
                render();
            };
            btn.dataset.tabId = tab.id;
            tabs.appendChild(btn);
        });

        const content = document.createElement("div");
        content.id = "mwi-content";
        content.style.cssText = `padding:10px;max-height:70vh;overflow:auto;`;

        container.appendChild(header);
        container.appendChild(tabs);
        container.appendChild(content);

        const resizeHandle = document.createElement("div");
        resizeHandle.id = "mwi-resize";
        resizeHandle.style.cssText = `
      position:absolute;
      right:6px;
      bottom:6px;
      width:14px;
      height:14px;
      cursor:se-resize;
      opacity:0.6;
      border-right:2px solid rgba(168,85,247,0.8);
      border-bottom:2px solid rgba(168,85,247,0.8);
      border-radius:2px;
    `;

        container.appendChild(resizeHandle);

        makeDraggable(container, header);
        makeResizable(container, resizeHandle);

        document.body.appendChild(container);
        setLauncherVisible(false);
    }

    function ensureUiReady() {
        if (document.body) {
            createLauncher();
            createPanel();
            render();
            return;
        }
        window.addEventListener(
            "DOMContentLoaded",
            () => {
                createLauncher();
                createPanel();
                render();
            },
            { once: true }
        );
    }

    function makeDraggable(container, handle) {
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;
        handle.addEventListener("mousedown", (e) => {
            isDragging = true;
            offsetX = e.clientX - container.getBoundingClientRect().left;
            offsetY = e.clientY - container.getBoundingClientRect().top;
        });
        handle.addEventListener("touchstart", (e) => {
            const touch = e.touches[0];
            if (!touch) return;
            isDragging = true;
            const rect = container.getBoundingClientRect();
            offsetX = touch.clientX - rect.left;
            offsetY = touch.clientY - rect.top;
        }, { passive: true });
        window.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            container.style.left = `${e.clientX - offsetX}px`;
            container.style.top = `${e.clientY - offsetY}px`;
        });
        window.addEventListener("touchmove", (e) => {
            if (!isDragging) return;
            const touch = e.touches[0];
            if (!touch) return;
            container.style.left = `${touch.clientX - offsetX}px`;
            container.style.top = `${touch.clientY - offsetY}px`;
        }, { passive: true });
        window.addEventListener("mouseup", () => {
            isDragging = false;
        });
        window.addEventListener("touchend", () => {
            isDragging = false;
        });
    }

    function makeResizable(container, handle) {
        let isResizing = false;
        let startX = 0;
        let startY = 0;
        let startW = 0;
        let startH = 0;

        const begin = (clientX, clientY) => {
            isResizing = true;
            const rect = container.getBoundingClientRect();
            startX = clientX;
            startY = clientY;
            startW = rect.width;
            startH = rect.height;
        };

        handle.addEventListener("mousedown", (e) => {
            e.preventDefault();
            begin(e.clientX, e.clientY);
        });
        handle.addEventListener("touchstart", (e) => {
            const touch = e.touches[0];
            if (!touch) return;
            begin(touch.clientX, touch.clientY);
        }, { passive: true });

        window.addEventListener("mousemove", (e) => {
            if (!isResizing) return;
            const newW = Math.min(700, Math.max(300, startW + (e.clientX - startX)));
            const newH = Math.min(900, Math.max(360, startH + (e.clientY - startY)));
            container.style.width = `${newW}px`;
            container.style.height = `${newH}px`;
            uiState.panelWidth = newW;
            uiState.panelHeight = newH;
        });
        window.addEventListener("touchmove", (e) => {
            if (!isResizing) return;
            const touch = e.touches[0];
            if (!touch) return;
            const newW = Math.min(700, Math.max(300, startW + (touch.clientX - startX)));
            const newH = Math.min(900, Math.max(360, startH + (touch.clientY - startY)));
            container.style.width = `${newW}px`;
            container.style.height = `${newH}px`;
            uiState.panelWidth = newW;
            uiState.panelHeight = newH;
        }, { passive: true });

        window.addEventListener("mouseup", () => {
            isResizing = false;
        });
        window.addEventListener("touchend", () => {
            isResizing = false;
        });
    }

    function buttonCss(type) {
        if (type === "danger") {
            return `background:transparent;border:none;color:#f87171;cursor:pointer;font-size:0.8rem;opacity:0.8;`;
        }
        return `background:transparent;border:none;color:#e2e8f0;cursor:pointer;font-size:0.8rem;opacity:0.8;`;
    }

    function tabButtonCss(active) {
        return `
            flex:1;
            padding:8px 4px;
            background:${active ? "rgba(168,85,247,0.15)" : "transparent"};
            border:none;
            color:${active ? "#a855f7" : "#64748b"};
            border-bottom:2px solid ${active ? "#a855f7" : "transparent"};
            cursor:pointer;
            font-size:0.7rem;
            transition:all 0.2s;
        `;
    }

    function statCard(label, value, color) {
        return `
            <div style="padding:6px 8px;background:rgba(30,41,59,0.65);border-radius:6px;border:1px solid rgba(255,255,255,0.06);">
                <div style="font-size:0.55rem;color:#64748b;margin-bottom:1px;">${label}</div>
                <div style="font-size:0.9rem;font-weight:700;color:${color};">${value}</div>
            </div>
        `;
    }

    function renderChangelog() {
        if (newsState.isLoading) {
            return `<div style="font-size:0.6rem;color:#94a3b8;">${t("news_loading")}</div>`;
        }
        if (newsState.status === "error") {
            return `<div style="font-size:0.6rem;color:#f87171;">${t("news_error")}</div>`;
        }
        if (newsState.releases.length) {
            return newsState.releases
                .map((rel) => {
                    const date = rel.publishedAt
                        ? new Date(rel.publishedAt).toISOString().split("T")[0]
                        : "";
                    const body = escapeHtml(rel.body)
                        .replace(/\r?\n\r?\n/g, "<br><br>")
                        .replace(/\r?\n/g, "<br>");
                    return `
                        <div style="margin-bottom:8px;padding:8px;background:rgba(30,41,59,0.4);border-radius:6px;">
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                                <span style="font-size:0.75rem;font-weight:600;color:#e2e8f0;">${escapeHtml(
                                    rel.name || rel.tag
                                )}</span>
                                <span style="font-size:0.6rem;color:#94a3b8;">${date}</span>
                            </div>
                            <div style="font-size:0.6rem;color:#cbd5f5;">${body}</div>
                        </div>
                    `;
                })
                .join("");
        }
        if (newsState.status === "empty") {
            return `<div style="font-size:0.6rem;color:#94a3b8;">${t("news_empty")}</div>`;
        }

        return SCRIPT_CHANGELOG.map((entry) => {
            const items = entry.items[currentLocale] || entry.items["en-US"] || [];
            return `
                <div style="margin-bottom:8px;padding:8px;background:rgba(30,41,59,0.4);border-radius:6px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                        <span style="font-size:0.75rem;font-weight:600;color:#e2e8f0;">${entry.version}</span>
                        <span style="font-size:0.6rem;color:#94a3b8;">${entry.date}</span>
                    </div>
                    <ul style="margin:0;padding-left:14px;color:#cbd5f5;font-size:0.6rem;">
                        ${items.map((item) => `<li style="margin-bottom:2px;">${item}</li>`).join("")}
                    </ul>
                </div>
            `;
        }).join("");
    }

    function updateProjectionUI() {
        const derived = getDerived();
        const hoursTotal = uiState.projectionHours + uiState.projectionDays * 24;

        const hoursLabel = document.getElementById("mwi-proj-hours");
        const hoursValue = document.getElementById("mwi-hours-value");
        const daysValue = document.getElementById("mwi-days-value");
        if (hoursLabel) hoursLabel.textContent = `${hoursTotal.toFixed(0)}h`;
        if (hoursValue) hoursValue.textContent = `${uiState.projectionHours}`;
        if (daysValue) daysValue.textContent = `${uiState.projectionDays}`;

        const updateText = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        };

        updateText(
            "mwi-proj-encounters",
            formatCompact(derived.projections.encounters)
        );
        updateText(
            "mwi-proj-revenue",
            formatCompact(derived.projections.estimatedRevenue)
        );
        updateText("mwi-proj-coins", formatCompact(derived.projections.coins));
        updateText("mwi-proj-exp", formatCompact(derived.projections.exp));
        updateText("mwi-proj-skill", formatCompact(derived.projections.skillExp));
    }

    function render() {
        const container = document.getElementById("mwi-wondher-panel");
        if (!container) return;
        const content = document.getElementById("mwi-content");
        const tabs = document.getElementById("mwi-tabs");
        const statusDot = document.getElementById("mwi-status-dot");
        const langToggle = document.getElementById("mwi-lang-toggle");
        const resizeHandle = document.getElementById("mwi-resize");

        statusDot.style.background = state.isInCombat ? "#ef4444" : "#64748b";
        statusDot.style.boxShadow = state.isInCombat
            ? "0 0 8px #ef4444"
        : "0 0 8px #64748b";

        if (langToggle) {
            langToggle.textContent = uiState.locale === "pt-BR" ? "PT-BR" : "EN-US";
        }

        if (uiState.isInteracting) {
            return;
        }

        if (uiState.minimized) {
            tabs.style.display = "none";
            content.style.display = "none";
            if (resizeHandle) resizeHandle.style.display = "none";
            container.style.height = "auto";
            return;
        }
        tabs.style.display = "flex";
        content.style.display = "block";
        if (resizeHandle) resizeHandle.style.display = "block";
        if (uiState.panelWidth) container.style.width = `${uiState.panelWidth}px`;
        if (uiState.panelHeight) container.style.height = `${uiState.panelHeight}px`;

        Array.from(tabs.children).forEach((btn) => {
            const isActive = btn.dataset.tabId === uiState.currentTab;
            btn.style.cssText = tabButtonCss(isActive);
            if (btn.dataset.tabId === "rates") btn.textContent = t("tabs_rates");
            if (btn.dataset.tabId === "dps") btn.textContent = t("tabs_dps");
            if (btn.dataset.tabId === "loot") btn.textContent = t("tabs_loot");
            if (btn.dataset.tabId === "xp") btn.textContent = t("tabs_xp");
            if (btn.dataset.tabId === "session") {
                btn.textContent = t("tabs_session");
            }
        });

        const derived = getDerived();
        const durationSeconds = Math.floor(derived.durationMs / 1000);

        if (!state.sessionStartTs && uiState.currentTab !== "session") {
            content.innerHTML = `<div style="text-align:center;padding:20px 12px;color:#64748b;background:rgba(30,41,59,0.3);border-radius:8px;border:1px dashed rgba(100,116,139,0.2);">📡<div style="margin-top:6px">${t(
                "waiting_ws"
            )}</div></div>`;
            return;
        }

        if (uiState.currentTab === "rates") {
            content.innerHTML = `
                <div style="margin-bottom:12px;">
                    <div style="font-size:0.65rem;color:#64748b;text-transform:uppercase;margin-bottom:6px;">${t(
                "rates_title"
            )}</div>
                    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px;">
                        ${statCard(
                t("encounters_per_hour"),
                formatCompact(derived.rates.encountersPerHour),
                "#ec4899"
            )}
                        ${statCard(
                t("revenue_per_hour"),
                formatCompact(derived.rates.estimatedRevenuePerHour),
                "#22c55e"
            )}
                        ${statCard(
                t("coins_per_hour"),
                formatCompact(derived.rates.coinsPerHour),
                "#eab308"
            )}
                        ${statCard(
                t("xp_per_hour"),
                formatCompact(derived.rates.expPerHour),
                "#3b82f6"
            )}
                        ${statCard(
                t("skill_xp_per_hour"),
                formatCompact(derived.rates.skillExpPerHour),
                "#8b5cf6"
            )}
                    </div>
                </div>
                <div>
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                        <div style="font-size:0.65rem;color:#64748b;text-transform:uppercase;">${t(
                "projections_title"
            )}</div>
                        <div id="mwi-proj-hours" style="font-size:0.7rem;color:#a855f7;font-weight:600;">${(
                uiState.projectionHours +
                uiState.projectionDays * 24
            ).toFixed(0)}h</div>
                    </div>
                    <div style="margin-bottom:8px;padding:8px;background:rgba(30,41,59,0.4);border-radius:6px;">
                        <div style="margin-bottom:6px;">
                            <div style="display:flex;justify-content:space-between;font-size:0.6rem;color:#94a3b8;margin-bottom:2px;"><span>${t(
                "hours"
            )}</span><span id="mwi-hours-value">${
                              uiState.projectionHours
        }</span></div>
                            <input id="mwi-hours" type="range" min="0" max="23" value="${
                              uiState.projectionHours
        }" style="width:100%;height:3px;accent-color:#a855f7;" />
                        </div>
                        <div>
                            <div style="display:flex;justify-content:space-between;font-size:0.6rem;color:#94a3b8;margin-bottom:2px;"><span>${t(
                "days"
            )}</span><span id="mwi-days-value">${
                              uiState.projectionDays
        }</span></div>
                            <input id="mwi-days" type="range" min="0" max="30" value="${
                              uiState.projectionDays
        }" style="width:100%;height:3px;accent-color:#a855f7;" />
                        </div>
                    </div>
                    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px;">
                        ${statCard(
                t("encounters"),
                `<span id="mwi-proj-encounters">${formatCompact(
                    derived.projections.encounters
                )}</span>`,
                "#a855f7"
            )}
                        ${statCard(
                t("est_revenue"),
                `<span id="mwi-proj-revenue">${formatCompact(
                    derived.projections.estimatedRevenue
                )}</span>`,
                "#a855f7"
            )}
                        ${statCard(
                t("coins"),
                `<span id="mwi-proj-coins">${formatCompact(
                    derived.projections.coins
                )}</span>`,
                "#a855f7"
            )}
                        ${statCard(
                t("xp"),
                `<span id="mwi-proj-exp">${formatCompact(
                    derived.projections.exp
                )}</span>`,
                "#a855f7"
            )}
                        ${statCard(
                t("skill_xp"),
                `<span id="mwi-proj-skill">${formatCompact(
                    derived.projections.skillExp
                )}</span>`,
                "#a855f7"
            )}
                    </div>
                </div>
            `;

            const hoursInput = document.getElementById("mwi-hours");
            const daysInput = document.getElementById("mwi-days");
            if (hoursInput) {
                const updateHours = (e) => {
                    uiState.projectionHours = Number(e.target.value);
                    updateProjectionUI();
                };
                hoursInput.oninput = updateHours;
                hoursInput.onchange = updateHours;
                hoursInput.ontouchstart = () => {
                    uiState.isInteracting = true;
                };
                hoursInput.ontouchend = () => {
                    uiState.isInteracting = false;
                    render();
                };
                hoursInput.onmousedown = () => {
                    uiState.isInteracting = true;
                };
                hoursInput.onmouseup = () => {
                    uiState.isInteracting = false;
                    render();
                };
                hoursInput.onpointerdown = () => {
                    uiState.isInteracting = true;
                };
                hoursInput.onpointerup = () => {
                    uiState.isInteracting = false;
                    render();
                };
                hoursInput.onpointerleave = () => {
                    uiState.isInteracting = false;
                    render();
                };
            }
            if (daysInput) {
                const updateDays = (e) => {
                    uiState.projectionDays = Number(e.target.value);
                    updateProjectionUI();
                };
                daysInput.oninput = updateDays;
                daysInput.onchange = updateDays;
                daysInput.ontouchstart = () => {
                    uiState.isInteracting = true;
                };
                daysInput.ontouchend = () => {
                    uiState.isInteracting = false;
                    render();
                };
                daysInput.onmousedown = () => {
                    uiState.isInteracting = true;
                };
                daysInput.onmouseup = () => {
                    uiState.isInteracting = false;
                    render();
                };
                daysInput.onpointerdown = () => {
                    uiState.isInteracting = true;
                };
                daysInput.onpointerup = () => {
                    uiState.isInteracting = false;
                    render();
                };
                daysInput.onpointerleave = () => {
                    uiState.isInteracting = false;
                    render();
                };
            }
            return;
        }

        if (uiState.currentTab === "dps") {
            if (!state.players || state.players.length === 0) {
                content.innerHTML = `<div style="text-align:center;padding:20px 12px;color:#64748b;background:rgba(30,41,59,0.3);border-radius:8px;border:1px dashed rgba(100,116,139,0.2);">⚔️<div style="margin-top:6px">${t(
                    "waiting_combat"
                )}</div></div>`;
                return;
            }

            const durationSec = Math.max(1, durationSeconds);
            const players = state.players
            .map((player) => {
                const name = player.name;
                const totalDamage = state.playerDamage[name] || 0;
                const vitals = player || {};
                const hpPct = vitals.maxHP
                ? (vitals.currentHP / vitals.maxHP) * 100
                : 0;
                const mpPct = vitals.maxMP
                ? (vitals.currentMP / vitals.maxMP) * 100
                : 0;
                return {
                    name,
                    totalDamage,
                    dps: totalDamage / durationSec,
                    damageTaken: state.playerDamageTaken[name] || 0,
                    hpPct,
                    mpPct,
                    currentHP: vitals.currentHP || 0,
                    maxHP: vitals.maxHP || 0,
                    currentMP: vitals.currentMP || 0,
                    maxMP: vitals.maxMP || 0,
                };
            })
            .filter((player) => player.maxHP > 0 || player.currentHP > 0)
            .sort((a, b) => b.totalDamage - a.totalDamage);

            content.innerHTML = `
                <div style="font-size:0.65rem;color:#64748b;text-transform:uppercase;margin-bottom:10px;">${t(
              "group"
          )}</div>
                ${players
              .map(
              (player, idx) => `
                    <div style="margin-bottom:10px;padding:8px;background:rgba(30,41,59,0.4);border-radius:6px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                            <span style="font-size:0.75rem;font-weight:600;color:#e2e8f0;">${
                              idx === 0 ? "👑 " : ""
              }${player.name}</span>
                            <span style="font-size:0.7rem;color:#a855f7;font-weight:600;">${formatNumber(
                                player.dps
                            )} DPS</span>
                        </div>
                        <div style="margin-bottom:6px;">
                            <div style="display:flex;justify-content:space-between;font-size:0.55rem;color:#94a3b8;margin-bottom:1px;"><span>HP</span><span>${
                              player.currentHP
              }/${player.maxHP}</span></div>
                            <div style="height:6px;background:rgba(0,0,0,0.3);border-radius:3px;overflow:hidden;"><div style="width:${
                              player.hpPct
              }%;height:100%;background:${
                      player.hpPct > 50
              ? "#22c55e"
              : player.hpPct > 25
              ? "#eab308"
              : "#ef4444"
              };"></div></div>
                        </div>
                        <div style="margin-bottom:6px;">
                            <div style="display:flex;justify-content:space-between;font-size:0.55rem;color:#94a3b8;margin-bottom:1px;"><span>MP</span><span>${
                              player.currentMP
              }/${player.maxMP}</span></div>
                            <div style="height:6px;background:rgba(0,0,0,0.3);border-radius:3px;overflow:hidden;"><div style="width:${
                              player.mpPct
              }%;height:100%;background:#3b82f6;"></div></div>
                        </div>
                        <div style="display:flex;justify-content:space-between;font-size:0.6rem;color:#94a3b8;">
                            <span>${t("total_damage_done")}: ${formatCompact(
                                player.totalDamage
                            )}</span>
                            <span>${t("total_damage_taken")}: ${formatCompact(
                                player.damageTaken
                            )}</span>
                        </div>
                    </div>
                `
                  )
              .join("")}
                ${
                  state.monsters?.length
              ? `
                    <div style="margin-top:12px;font-size:0.65rem;color:#64748b;text-transform:uppercase;">${t(
              "monsters"
          )}</div>
                    <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:6px;">
                        ${state.monsters
              .map(
              (m) =>
              `<span style="padding:3px 6px;background:rgba(239,68,68,0.1);border-radius:4px;font-size:0.65rem;color:#f87171;">${m.name}</span>`
                          )
              .join("")}
                    </div>
                `
                    : ""
      }
            `;
          return;
      }

        if (uiState.currentTab === "loot") {
            const lootEntries = Object.entries(state.loot || {}).sort(
                (a, b) => b[1] - a[1]
            );
            const unknownEntries = Object.entries(state.unknownValueLoot || {}).sort(
                (a, b) => b[1] - a[1]
            );
            if (lootEntries.length === 0 && !state.coinsGained) {
                content.innerHTML = `<div style="text-align:center;padding:20px 12px;color:#64748b;background:rgba(30,41,59,0.3);border-radius:8px;border:1px dashed rgba(100,116,139,0.2);">💰<div style="margin-top:6px">${t(
                    "no_loot"
                )}</div></div>`;
                return;
            }

            content.innerHTML = `
                <div style="font-size:0.65rem;color:#64748b;text-transform:uppercase;margin-bottom:10px;">${t(
              "resources_obtained"
          )}</div>
                ${
                  state.coinsGained
              ? `
                    <div style="margin-bottom:8px;padding:8px;background:rgba(234,179,8,0.15);border-radius:6px;border:1px solid rgba(234,179,8,0.3);display:flex;justify-content:space-between;align-items:center;">
                        <span style="font-size:0.8rem;color:#facc15;font-weight:bold;">🪙 ${t(
              "coins"
          )}</span>
                        <span style="font-size:0.9rem;color:#facc15;font-weight:bold;">${formatCompact(
              state.coinsGained
          )}</span>
                    </div>
                `
                    : ""
      }
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    ${lootEntries
              .map(([item, count]) => {
              const inventoryCount =
                    internal.inventoryCountsByItemHrid[item] || 0;
              const price = getMarketPrice(item, 0);
              const lootValue = price ? count * price : 0;
              const inventoryValue = price
              ? inventoryCount * price * 0.98
              : 0;
              return `
                            <div style="padding:8px;background:rgba(30,41,59,0.4);border-radius:6px;display:flex;flex-direction:column;gap:4px;">
                                <div style="display:flex;justify-content:space-between;align-items:center;">
                                    <span style="font-size:0.75rem;color:#e2e8f0;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:70%;" title="${formatHrid(
              item
          )}">${formatHrid(item)}</span>
                                    <span style="font-size:0.7rem;color:#a855f7;font-weight:600;">${formatNumber(
              count
          )} ${t("drops")}</span>
                                </div>
                                <div style="display:flex;justify-content:space-between;font-size:0.6rem;color:#94a3b8;">
                                    <span>${t("inventory")}: ${formatNumber(
              inventoryCount
          )}</span>
                                    <span>${t("price")}: ${
                                      price ? formatCompact(price) : "—"
          }</span>
                                </div>
                                <div style="display:flex;justify-content:space-between;font-size:0.6rem;color:#94a3b8;">
                                    <span>${t("drop_value")}: ${
                                      price ? formatCompact(lootValue) : "—"
          }</span>

                                </div>
                                <div style="display:flex;justify-content:space-between;font-size:0.6rem;color:#94a3b8;">
                                     <span>${t("inventory_value")}: ${
                                       price
              ? formatCompact(inventoryValue)
          : "—"
          }</span>

                                </div>

                                <div style="font-size:0.55rem;color:#64748b;">${t(
              "inventory_fee_note"
          )}</div>
                            </div>
                        `;
          })
              .join("")}
                </div>
                ${
                  unknownEntries.length
              ? `
                    <div style="margin-top:10px;">
                        <div style="font-size:0.6rem;color:#f59e0b;margin-bottom:6px;">${t(
              "missing_price_table"
          )}</div>
                        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px;">
                            ${unknownEntries
              .map(
              ([item, count]) => `
                                <div style="padding:6px 8px;background:rgba(245,158,11,0.12);border-radius:5px;display:flex;justify-content:space-between;align-items:center;">
                                    <span style="font-size:0.65rem;color:#fcd34d;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:70%;" title="${formatHrid(
                                        item
                                    )}">${formatHrid(item)}</span>
                                    <span style="font-size:0.75rem;font-weight:600;color:#fcd34d;">${formatNumber(
                                        count
                                    )}</span>
                                </div>
                            `
                              )
              .join("")}
                        </div>
                    </div>
                `
                    : ""
      }
            `;
          return;
      }

        if (uiState.currentTab === "xp") {
            const skillEntries = Object.entries(state.xpGainedBySkill || {}).filter(
                ([skill]) => skill !== "/skills/total_level"
            );
            if (!skillEntries.length) {
                content.innerHTML = `<div style="text-align:center;padding:20px 12px;color:#64748b;background:rgba(30,41,59,0.3);border-radius:8px;border:1px dashed rgba(100,116,139,0.2);">✨<div style="margin-top:6px">${t(
                    "no_xp"
                )}</div></div>`;
                return;
            }
            const xp = skillEntries.sort((a, b) => b[1] - a[1]);
            content.innerHTML = `
                <div style="font-size:0.65rem;color:#64748b;text-transform:uppercase;margin-bottom:10px;">${t(
              "xp_gains"
          )}</div>
                <div style="display:flex;flex-direction:column;gap:6px;">
                    ${xp
              .map(
              ([skill, amount]) => `
                        <div style="padding:8px;background:rgba(30,41,59,0.4);border-radius:6px;">
                            <div style="display:flex;justify-content:space-between;margin-bottom:2px;">
                                <span style="font-size:0.75rem;font-weight:600;color:#e2e8f0;">${formatHrid(
                                    skill
                                )}</span>
                                <span style="font-size:0.75rem;font-weight:600;color:#3b82f6;">${formatCompact(
                                    amount
                                )} XP</span>
                            </div>
                            <div style="font-size:0.6rem;color:#64748b;text-align:right;">${formatCompact(
                                amount / Math.max(0.001, derived.durationHours)
                            )} ${t("xp_per_hour")}</div>
                        </div>
                    `
                      )
              .join("")}
                </div>
            `;
          return;
      }

        if (uiState.currentTab === "session") {
            content.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                    <div style="font-size:0.65rem;color:#64748b;text-transform:uppercase;">${t(
              "session"
          )}</div>
                    <div style="display:flex;gap:4px;">
                        <button id="mwi-locale-toggle" style="font-size:0.55rem;padding:3px 6px;background:rgba(148,163,184,0.15);border:1px solid rgba(148,163,184,0.3);border-radius:4px;color:#e2e8f0;cursor:pointer;">${
                          uiState.locale === "pt-BR" ? "PT-BR" : "EN-US"
                        }</button>
                        <button id="mwi-export" style="font-size:0.55rem;padding:3px 6px;background:rgba(34,197,94,0.15);border:1px solid rgba(34,197,94,0.3);border-radius:4px;color:#4ade80;cursor:pointer;">📥</button>
                        <button id="mwi-reset" style="font-size:0.55rem;padding:3px 6px;background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);border-radius:4px;color:#f87171;cursor:pointer;">🔄</button>
                    </div>
                </div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px;">
                    ${statCard(
              t("duration"),
              formatDuration(durationSeconds),
              "#a855f7"
          )}
                    ${statCard(
              t("encounters"),
              formatNumber(state.encountersCompleted || 0),
              "#ec4899"
          )}
                    ${statCard(
              t("total_damage"),
              formatCompact(state.partyDamage || 0),
              "#f87171"
          )}
                    ${statCard(
              t("total_taken"),
              formatCompact(state.partyDamageTaken || 0),
              "#f59e0b"
          )}
                    ${statCard(
              t("coins"),
              formatCompact(state.coinsGained || 0),
              "#eab308"
          )}
                    ${statCard(
              t("total_xp"),
              formatCompact(derived.totalExp),
              "#3b82f6"
          )}
                    ${statCard(
              t("est_revenue"),
              formatCompact(state.estimatedValueGained || 0),
              "#22c55e"
          )}
                </div>
                <div style="margin-top:10px;font-size:0.6rem;color:#94a3b8;">
                    ${t("price_table")}: ${internal.priceTableSource}
                </div>
                <div style="margin-top:12px;padding:8px;background:rgba(30,41,59,0.4);border-radius:6px;border:1px solid rgba(255,255,255,0.06);">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <div style="font-size:0.65rem;color:#64748b;text-transform:uppercase;">${t(
              "updates_title"
          )}</div>
                        <button id="mwi-update-toggle" style="font-size:0.55rem;padding:3px 6px;background:rgba(148,163,184,0.15);border:1px solid rgba(148,163,184,0.3);border-radius:4px;color:#e2e8f0;cursor:pointer;">${
                          updateState.enabled ? t("updates_disable") : t("updates_enable")
                        }</button>
                    </div>
                    <div style="margin-top:6px;font-size:0.6rem;color:#94a3b8;">
                        ${t("updates_status_label")}: ${formatUpdateStatus()}
                    </div>
                    <div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap;">
                        <button id="mwi-update-check" style="font-size:0.55rem;padding:3px 6px;background:rgba(59,130,246,0.15);border:1px solid rgba(59,130,246,0.35);border-radius:4px;color:#93c5fd;cursor:pointer;">${t(
              "updates_check"
          )}</button>
                        <button id="mwi-update-open" style="font-size:0.55rem;padding:3px 6px;background:rgba(34,197,94,0.15);border:1px solid rgba(34,197,94,0.3);border-radius:4px;color:#4ade80;cursor:pointer;display:${
                          updateState.hasUpdate ? "inline-flex" : "none"
                        }">${t("updates_open")}</button>
                        <button id="mwi-update-info" style="font-size:0.55rem;padding:3px 6px;background:rgba(168,85,247,0.15);border:1px solid rgba(168,85,247,0.35);border-radius:4px;color:#d8b4fe;cursor:pointer;display:${
                          updateState.infoUrl ? "inline-flex" : "none"
                        }">${t("updates_notes")}</button>
                    </div>
                </div>
                <div style="margin-top:12px;">
                    <div style="font-size:0.65rem;color:#64748b;text-transform:uppercase;margin-bottom:6px;">${t(
              "news_title"
          )}</div>
                    ${renderChangelog()}
                </div>
            `;

                    const exportBtn = document.getElementById("mwi-export");
                    const resetBtn = document.getElementById("mwi-reset");
                    const localeBtn = document.getElementById("mwi-locale-toggle");
                    const updateToggle = document.getElementById("mwi-update-toggle");
                    const updateCheck = document.getElementById("mwi-update-check");
                    const updateOpen = document.getElementById("mwi-update-open");
                    const updateInfo = document.getElementById("mwi-update-info");
                    if (exportBtn) exportBtn.onclick = exportSession;
                    if (resetBtn) resetBtn.onclick = () => resetSession();
                    if (localeBtn) {
                        localeBtn.textContent = uiState.locale === "pt-BR" ? "PT-BR" : "EN-US";
                        localeBtn.onclick = () => {
                            setLocale(uiState.locale === "pt-BR" ? "en-US" : "pt-BR");
                        };
                    }
                    if (updateToggle) {
                        updateToggle.textContent = updateState.enabled
                            ? t("updates_disable")
                            : t("updates_enable");
                        updateToggle.onclick = () => {
                            setUpdateOptIn(!updateState.enabled);
                        };
                    }
                    if (updateCheck) updateCheck.onclick = () => checkForUpdates({ manual: true });
                    if (updateOpen) updateOpen.onclick = () => openUpdateUrl();
                    if (updateInfo) updateInfo.onclick = () => openUpdateInfo();
          return;
      }
    }

    function resetSession() {
        state.sessionStartTs = null;
        state.lastUpdateTs = null;
        state.battleId = null;
        state.players = [];
        state.monsters = [];
        state.playerDamage = {};
        state.playerDamageTaken = {};
        state.partyDamage = 0;
        state.partyDamageTaken = 0;
        state.encountersCompleted = 0;
        state.coinsGained = 0;
        state.estimatedValueGained = 0;
        state.loot = {};
        state.unknownValueLoot = {};
        state.xpGainedBySkill = {};
        state.totalExpGained = 0;
        state.totalLevelExpGained = 0;
        state.lastAbilityByPlayer = {};
        state.isInCombat = false;

        internal.lastActionCount = null;
        internal.lastItemCountsByHash = {};
        internal.lastSkillExp = {};
        internal.lastPlayerDmg = {};
        internal.lastMonsterDmg = {};
        internal.lastPlayerHP = {};
        internal.playerIndexToName = {};
        internal.monsterIndexToName = {};
        internal.inventoryCountsByItemHrid = {};
        internal.itemsInitialized = false;
        internal.skillsInitialized = false;

        render();
    }

    function exportSession() {
        const derived = getDerived();
        const report = {
            generatedAt: new Date().toISOString(),
            session: state,
            derived,
            priceTable: internal.priceTable,
            priceTableSource: internal.priceTableSource,
            note: "Valores iniciam após baseline (primeiro snapshot de itens/skills).",
        };
        const blob = new Blob([JSON.stringify(report, null, 2)], {
            type: "application/json",
        });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `mwi-session-${new Date().toISOString().split("T")[0]}.json`;
        a.click();
    }

    function startRenderLoop() {
        setInterval(render, 1000);
    }

    function startMarketRefresh() {
        setInterval(() => {
            loadMarketPrices(true).finally(() => render());
        }, MARKET_CACHE_TTL_MS);
    }

    function init() {
        patchWebSocket();
        ensureUiReady();
        loadMarketPrices().finally(() => render());
        startRenderLoop();
        startMarketRefresh();
        setTimeout(() => checkForUpdates({ manual: false }), 4000);
        setTimeout(() => fetchGithubReleases(), 4500);
    }

    init();
})();
