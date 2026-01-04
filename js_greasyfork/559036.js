// ==UserScript==
// @name         MangaDex Read Status Filter for Advanced Search
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Mangadex Filter Based on User Read Status Works for Advanced Search
// @author       dapakyuu
// @homepageURL  https://github.com/dapakyuu/mangadex_readstatus_filter
// @match        https://mangadex.org/titles*
// @icon         https://mangadex.org/favicon.ico
// @exclude      https://mangadex.org/titles/feed*
// @exclude      https://mangadex.org/titles/recent*
// @exclude      https://mangadex.org/titles/latest*
// @exclude      https://mangadex.org/titles/follows*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/559036/MangaDex%20Read%20Status%20Filter%20for%20Advanced%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/559036/MangaDex%20Read%20Status%20Filter%20for%20Advanced%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const excludedPaths = [
        "/titles/feed",
        "/titles/recent",
        "/titles/latest",
        "/titles/follows"
    ];

    function isExcludedPath() {
        return excludedPaths.some(path => location.pathname.startsWith(path));
    }

    // --- Konfigurasi Auth (default) ---
    let CONFIG = {
        username: GM_getValue("username", ""),
        password: GM_getValue("password", ""),
        client_id: GM_getValue("client_id", ""),
        client_secret: GM_getValue("client_secret", "")
    };

    let accessToken = null;
    let refreshToken = null;
    let tokenExpiry = null;

    async function login() {
        const creds = new URLSearchParams({
            grant_type: "password",
            username: CONFIG.username,
            password: CONFIG.password,
            client_id: CONFIG.client_id,
            client_secret: CONFIG.client_secret
        });

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/token",
                data: creds.toString(),
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                onload: function(resp) {
                    const data = JSON.parse(resp.responseText);
                    accessToken = data.access_token;
                    refreshToken = data.refresh_token;
                    tokenExpiry = Date.now() + (15 * 60 * 1000);
                    resolve(data);
                },
                onerror: reject
            });
        });
    }

    async function ensureToken() {
        if (!accessToken || Date.now() > tokenExpiry) {
            await login();
        }
    }

    async function getStatus(mangaId) {
        await ensureToken();
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.mangadex.org/manga/${mangaId}/status`,
                headers: { "Authorization": "Bearer " + accessToken },
                onload: function(resp) {
                    const data = JSON.parse(resp.responseText);
                    resolve(data.status);
                },
                onerror: reject
            });
        });
    }

    async function getAllStatuses() {
        await ensureToken();
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://api.mangadex.org/manga/status",
                headers: { "Authorization": "Bearer " + accessToken },
                onload: function(resp) {
                    const data = JSON.parse(resp.responseText);
                    resolve(data.statuses || {});
                },
                onerror: reject
            });
        });
    }

    async function getFilteredStatuses(selectedStatus) {
        await ensureToken();
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.mangadex.org/manga/status?statuses[]=${selectedStatus}`,
                headers: { "Authorization": "Bearer " + accessToken },
                onload: function(resp) {
                    const data = JSON.parse(resp.responseText);
                    resolve(data.statuses || {});
                },
                onerror: reject
            });
        });
    }

    async function autoApplyLastStatus(filterBox) {
        const lastStatus = GM_getValue("lastFilterStatus", "");
        if (!lastStatus) return;

        filterBox.value = lastStatus;

        let statuses = {};
        if (lastStatus === "null") {
            statuses = await getAllStatuses();
        } else {
            statuses = await getFilteredStatuses(lastStatus);
        }

        const mangaCards = document.querySelectorAll("a[href^='/title/']");
        mangaCards.forEach(card => {
            const href = card.getAttribute("href");
            const match = href.match(/\/title\/([0-9a-f-]+)/);
            if (!match) return;
            const mangaId = match[1];
            const status = statuses[mangaId] || null;

            if (lastStatus === "null") {
                card.closest("div").style.display = (status === null ? "" : "none");
            } else {
                card.closest("div").style.display = (status ? "" : "none");
            }
        });
    }

    // fungsi bantu untuk gelapkan/terangkan warna hex
    function shadeColor(hex, percent) {
        // hapus tanda #
        hex = hex.replace(/^#/, "");
        // konversi ke integer
        let r = parseInt(hex.substring(0,2), 16);
        let g = parseInt(hex.substring(2,4), 16);
        let b = parseInt(hex.substring(4,6), 16);

        // geser nilai sesuai percent
        r = Math.min(255, Math.max(0, r + (percent/100)*255));
        g = Math.min(255, Math.max(0, g + (percent/100)*255));
        b = Math.min(255, Math.max(0, b + (percent/100)*255));

        // kembali ke hex
        const toHex = v => {
            const h = Math.round(v).toString(16);
            return h.length === 1 ? "0" + h : h;
        };

        return "#" + toHex(r) + toHex(g) + toHex(b);
    }


    function addFilterUI() {
        // hapus UI lama supaya event listener aktif kembali
        const oldContainer = document.querySelector("#custom-filter-container");
        if (oldContainer) oldContainer.remove();

        const container = document.createElement("div");
        container.id = "custom-filter-container";
        container.style.display = "flex";
        container.style.alignItems = "flex-end";
        container.style.gap = "8px";

        // Cari tombol Reset filters
        const buttons = Array.from(document.querySelectorAll("button"));
        const resetBtn = buttons.find(btn => btn.textContent.trim().toLowerCase().includes("reset"));
        if (!resetBtn) { console.log("Reset button tidak ditemukan"); return; }

        const searchBg = "#FF6740";
        const searchColor = "white";

        // Tombol Set Config
        const configBtn = document.createElement("button");
        configBtn.textContent = "Set Config";

        // samakan tinggi dengan tombol Reset
        configBtn.style.height = resetBtn.offsetHeight + "px";
        configBtn.style.padding = "0 12px";
        configBtn.style.fontWeight = 500;
        configBtn.style.backgroundColor = "blue";
        configBtn.style.color = "white";
        configBtn.style.border = "none";
        configBtn.style.borderRadius = "4px";
        configBtn.style.cursor = "pointer";
        configBtn.style.transition = "background-color 0.2s ease";

        // efek hover
        configBtn.addEventListener("mouseenter", () => {
            configBtn.style.backgroundColor = "#003f91"; // biru lebih gelap saat hover
        });
        configBtn.addEventListener("mouseleave", () => {
            configBtn.style.backgroundColor = "blue"; // kembali ke warna asli
        });


        // ambil warna dari html (root), bukan body
        let pageBg = window.getComputedStyle(document.documentElement).backgroundColor;

        // fallback kalau transparan
        if (!pageBg || pageBg.includes("rgba") && pageBg.endsWith(", 0)")) {
            // default ke putih
            pageBg = "#ffffff";
        }

        // Popup form
        const popup = document.createElement("div");
        popup.id = "custom-config-popup"; // id unik supaya bisa dihapus/rebuild
        popup.style.position = "fixed";
        popup.style.top = "50%";
        popup.style.left = "50%";
        popup.style.transform = "translate(-50%, -50%) scale(0.8)"; // mulai kecil
        popup.style.backgroundColor = pageBg;
        popup.style.border = "1px solid #ccc";
        popup.style.padding = "16px";
        popup.style.zIndex = "10000";
        popup.style.display = "none";
        popup.style.flexDirection = "column";
        popup.style.gap = "8px";
        popup.style.borderRadius = "6px";
        popup.style.opacity = "0"; // mulai transparan
        popup.style.transition = "opacity 0.3s ease, transform 0.3s ease";

        // Input fields dengan outline
        const fields = [
            { key: "username", label: "Username" },
            { key: "password", label: "Password" },
            { key: "client_id", label: "Client ID" },
            { key: "client_secret", label: "Client Secret" }
        ];

        const inputs = {};
        fields.forEach(f => {
            const wrapper = document.createElement("div");
            const lbl = document.createElement("label");
            lbl.textContent = f.label;
            lbl.style.fontWeight = "bold";
            const inp = document.createElement("input");
            inp.type = "text";
            inp.value = "";
            inp.style.width = "100%";
            inp.style.padding = "6px";
            inp.style.border = "1px solid #999"; // outline abu-abu
            inp.style.borderRadius = "4px";
            inp.style.outline = "none";
            inp.addEventListener("focus", () => {
                inp.style.borderColor = "#FF6740"; // outline oranye saat fokus
                inp.style.boxShadow = "0 0 4px rgba(255, 103, 64, 0.6)";
            });
            inp.addEventListener("blur", () => {
                inp.style.borderColor = "#999";
                inp.style.boxShadow = "none";
            });
            wrapper.appendChild(lbl);
            wrapper.appendChild(inp);
            popup.appendChild(wrapper);
            inputs[f.key] = inp;
        });

        // Tombol Save
        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save";
        saveBtn.style.backgroundColor = searchBg;
        saveBtn.style.color = searchColor;
        saveBtn.style.border = "none";
        saveBtn.style.borderRadius = "4px";
        saveBtn.style.padding = "6px 12px";
        saveBtn.style.cursor = "pointer";

        saveBtn.addEventListener("click", () => {
            CONFIG.username = inputs.username.value;
            CONFIG.password = inputs.password.value;
            CONFIG.client_id = inputs.client_id.value;
            CONFIG.client_secret = inputs.client_secret.value;

            // simpan ke Tampermonkey storage
            GM_setValue("username", CONFIG.username);
            GM_setValue("password", CONFIG.password);
            GM_setValue("client_id", CONFIG.client_id);
            GM_setValue("client_secret", CONFIG.client_secret);

            // animasi keluar form config
            popup.style.opacity = "0";
            popup.style.transform = "translate(-50%, -50%) scale(0.8)";
            setTimeout(() => {
                popup.style.display = "none";

                // buat popup sukses
                const successPopup = document.createElement("div");
                successPopup.style.position = "fixed";
                successPopup.style.top = "50%";
                successPopup.style.left = "50%";
                successPopup.style.transform = "translate(-50%, -50%) scale(0.9)";
                successPopup.style.backgroundColor = window.getComputedStyle(document.documentElement).backgroundColor;
                successPopup.style.border = "1px solid #ccc";
                successPopup.style.padding = "16px";
                successPopup.style.zIndex = "10001";
                successPopup.style.borderRadius = "6px";
                successPopup.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
                successPopup.style.opacity = "0";
                successPopup.style.transition = "opacity 0.3s ease, transform 0.3s ease";

                const msg = document.createElement("p");
                msg.textContent = "Config berhasil disimpan! Refresh halaman untuk login ulang.";
                msg.style.fontWeight = "bold";
                msg.style.marginBottom = "12px";

                const closeBtn = document.createElement("button");
                closeBtn.textContent = "OK";
                closeBtn.style.backgroundColor = "#FF6740";
                closeBtn.style.color = "white";
                closeBtn.style.border = "none";
                closeBtn.style.borderRadius = "4px";
                closeBtn.style.padding = "6px 12px";
                closeBtn.style.cursor = "pointer";
                closeBtn.style.transition = "background-color 0.2s ease";
                closeBtn.addEventListener("mouseenter", () => {
                    closeBtn.style.backgroundColor = shadeColor("#FF6740", -10);
                });
                closeBtn.addEventListener("mouseleave", () => {
                    closeBtn.style.backgroundColor = "#FF6740";
                });
                closeBtn.addEventListener("click", () => {
                    successPopup.style.opacity = "0";
                    successPopup.style.transform = "translate(-50%, -50%) scale(0.9)";
                    setTimeout(() => {
                        successPopup.remove();
                    }, 300);
                });

                successPopup.appendChild(msg);
                successPopup.appendChild(closeBtn);
                document.body.appendChild(successPopup);

                // animasi masuk
                requestAnimationFrame(() => {
                    successPopup.style.opacity = "1";
                    successPopup.style.transform = "translate(-50%, -50%) scale(1)";
                });
            }, 300);
        });

        saveBtn.addEventListener("mouseenter", () => {
            saveBtn.style.backgroundColor = shadeColor(searchBg, -10);
        });
        saveBtn.addEventListener("mouseleave", () => {
            saveBtn.style.backgroundColor = searchBg;
        });

        // Tombol Cancel
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancel";
        cancelBtn.style.backgroundColor = "#6b7280";
        cancelBtn.style.color = "white";
        cancelBtn.style.border = "none";
        cancelBtn.style.borderRadius = "4px";
        cancelBtn.style.padding = "6px 12px";
        cancelBtn.style.cursor = "pointer";
        cancelBtn.addEventListener("mouseenter", () => {
            cancelBtn.style.backgroundColor = shadeColor("#6b7280", -10);
        });
        cancelBtn.addEventListener("mouseleave", () => {
            cancelBtn.style.backgroundColor = "#6b7280";
        });

        cancelBtn.addEventListener("click", () => {
            // animasi keluar
            popup.style.opacity = "0";
            popup.style.transform = "translate(-50%, -50%) scale(0.8)";
            setTimeout(() => {
                popup.style.display = "none";
            }, 300);
        });


        popup.appendChild(saveBtn);
        popup.appendChild(cancelBtn);
        document.body.appendChild(popup);

        configBtn.addEventListener("click", () => {
            popup.style.display = "flex";
        });

        // --- Dropdown + Apply tetap seperti sebelumnya ---
        const dropdownWrapper = document.createElement("div");
        dropdownWrapper.style.display = "flex";
        dropdownWrapper.style.flexDirection = "column";

        const label = document.createElement("span");
        label.textContent = "Read Status";
        label.style.fontWeight = "bold";
        label.style.fontSize = "13px";
        label.style.marginBottom = "4px";

        // Dropdown dengan outline
        const filterBox = document.createElement("select");
        filterBox.className = resetBtn.className;
        filterBox.style.height = resetBtn.offsetHeight + "px";
        filterBox.style.padding = "0 12px";

        // outline default
        filterBox.style.border = "1px solid #999";
        filterBox.style.borderRadius = "4px";
        filterBox.style.outline = "none";

        // efek fokus
        filterBox.addEventListener("focus", () => {
            filterBox.style.borderColor = "#FF6740"; // oranye saat fokus
            filterBox.style.boxShadow = "0 0 4px rgba(255, 103, 64, 0.6)";
        });
        filterBox.addEventListener("blur", () => {
            filterBox.style.borderColor = "#999";
            filterBox.style.boxShadow = "none";
        });

        // isi opsi tetap sama
        const options = [
            { value: "", text: "All" },
            { value: "null", text: "Not Added" },
            { value: "reading", text: "Reading" },
            { value: "on_hold", text: "On Hold" },
            { value: "plan_to_read", text: "Plan to Read" },
            { value: "dropped", text: "Dropped" },
            { value: "re_reading", text: "Re-Reading" },
            { value: "completed", text: "Completed" }
        ];
        options.forEach(optData => {
            const opt = document.createElement("option");
            opt.value = optData.value;
            opt.textContent = optData.text;
            filterBox.appendChild(opt);
        });


        dropdownWrapper.appendChild(label);
        dropdownWrapper.appendChild(filterBox);

        const lastStatus = GM_getValue("lastFilterStatus", "");
        filterBox.value = lastStatus;

        if (lastStatus) {
            // apply langsung
            applyFilterWhenReady(filterBox);

            // coba ulang setelah 3 detik
            setTimeout(() => {
                applyFilterWhenReady(filterBox);
            }, 3000);

            // coba ulang lagi setelah 5 detik
            setTimeout(() => {
                applyFilterWhenReady(filterBox);
            }, 5000);
        }

        // jika ada status terakhir, jalankan filter otomatis
        if (lastStatus !== "") {
            (async () => {
                let statuses = {};
                if (lastStatus === "null") {
                    statuses = await getAllStatuses();
                } else {
                    statuses = await getFilteredStatuses(lastStatus);
                }

                const mangaCards = document.querySelectorAll("a[href^='/title/']");
                mangaCards.forEach(card => {
                    const href = card.getAttribute("href");
                    const match = href.match(/\/title\/([0-9a-f-]+)/);
                    if (!match) return;
                    const mangaId = match[1];
                    const status = statuses[mangaId] || null;

                    if (lastStatus === "null") {
                        card.closest("div").style.display = (status === null ? "" : "none");
                    } else {
                        card.closest("div").style.display = (status ? "" : "none");
                    }
                });
            })();
        }

        const applyBtn = document.createElement("button");
        applyBtn.textContent = "Apply";
        applyBtn.style.height = resetBtn.offsetHeight + "px";
        applyBtn.style.padding = "0 16px";
        applyBtn.style.marginRight = "16px";
        applyBtn.style.fontWeight = 500;
        applyBtn.style.backgroundColor = searchBg;
        applyBtn.style.color = searchColor;
        applyBtn.style.border = "none";
        applyBtn.style.borderRadius = "4px";
        applyBtn.style.cursor = "pointer";
        applyBtn.style.transition = "background-color 0.2s ease";
        applyBtn.addEventListener("mouseenter", () => {
            applyBtn.style.backgroundColor = shadeColor(searchBg, -10);
        });
        applyBtn.addEventListener("mouseleave", () => {
            applyBtn.style.backgroundColor = searchBg;
        });

        container.appendChild(configBtn);
        container.appendChild(dropdownWrapper);
        container.appendChild(applyBtn);

        resetBtn.parentElement.insertBefore(container, resetBtn);

        // Event Apply
        applyBtn.addEventListener("click", async () => {
            // cek apakah ada config kosong
            if (!CONFIG.username || !CONFIG.password || !CONFIG.client_id || !CONFIG.client_secret) {
                // buat popup peringatan
                const warnPopup = document.createElement("div");
                warnPopup.style.position = "fixed";
                warnPopup.style.top = "50%";
                warnPopup.style.left = "50%";
                warnPopup.style.transform = "translate(-50%, -50%) scale(0.9)";
                warnPopup.style.backgroundColor = window.getComputedStyle(document.documentElement).backgroundColor;
                warnPopup.style.border = "1px solid #ccc";
                warnPopup.style.padding = "16px";
                warnPopup.style.zIndex = "10001";
                warnPopup.style.borderRadius = "6px";
                warnPopup.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
                warnPopup.style.opacity = "0";
                warnPopup.style.transition = "opacity 0.3s ease, transform 0.3s ease";

                const msg = document.createElement("p");
                msg.textContent = "Config belum lengkap. Silakan isi Username, Password, Client ID, dan Client Secret.";
                msg.style.fontWeight = "bold";
                msg.style.marginBottom = "12px";

                const closeBtn = document.createElement("button");
                closeBtn.textContent = "OK";
                closeBtn.style.backgroundColor = searchBg;
                closeBtn.style.color = searchColor;
                closeBtn.style.padding = "0 16px";
                closeBtn.style.marginRight = "16px";
                closeBtn.style.fontWeight = "bold";
                closeBtn.style.backgroundColor = searchBg;
                closeBtn.style.color = searchColor;
                closeBtn.style.border = "none";
                closeBtn.style.borderRadius = "4px";
                closeBtn.style.cursor = "pointer";
                closeBtn.style.transition = "background-color 0.2s ease";
                closeBtn.addEventListener("mouseenter", () => {
                    closeBtn.style.backgroundColor = shadeColor(searchBg, -10);
                });
                closeBtn.addEventListener("mouseleave", () => {
                    closeBtn.style.backgroundColor = searchBg;
                });
                closeBtn.addEventListener("click", () => {
                    warnPopup.style.opacity = "0";
                    warnPopup.style.transform = "translate(-50%, -50%) scale(0.9)";
                    setTimeout(() => {
                        warnPopup.remove();
                    }, 300);
                });

                warnPopup.appendChild(msg);
                warnPopup.appendChild(closeBtn);
                document.body.appendChild(warnPopup);

                // animasi masuk
                requestAnimationFrame(() => {
                    warnPopup.style.opacity = "1";
                    warnPopup.style.transform = "translate(-50%, -50%) scale(1)";
                });

                return; // hentikan eksekusi Apply
            }

            // kalau config sudah lengkap, jalankan filter seperti biasa
            const selectedStatus = filterBox.value;
            GM_setValue("lastFilterStatus", selectedStatus);
            const mangaCards = document.querySelectorAll("a[href^='/title/']");

            let statuses = {};
            if (selectedStatus === "") {
                // ambil semua status
                statuses = await getAllStatuses();
            } else if (selectedStatus === "null") {
                // kasus khusus: manga yang tidak ada di status sama sekali
                statuses = await getAllStatuses(); // ambil semua, lalu filter null
            } else {
                // ambil hanya manga dengan status tertentu
                statuses = await getFilteredStatuses(selectedStatus);
            }

            mangaCards.forEach(card => {
                const href = card.getAttribute("href");
                const match = href.match(/\/title\/([0-9a-f-]+)/);
                if (!match) return;
                const mangaId = match[1];

                const status = statuses[mangaId] || null;

                if (selectedStatus === "") {
                    card.closest("div").style.display = "";
                } else if (selectedStatus === "null") {
                    card.closest("div").style.display = (status === null ? "" : "none");
                } else {
                    card.closest("div").style.display = (status ? "" : "none");
                }
            });
        });

        configBtn.addEventListener("click", () => {
            popup.style.display = "flex";
            requestAnimationFrame(() => {
                popup.style.opacity = "1";
                popup.style.transform = "translate(-50%, -50%) scale(1)";
            });
        });

    }

    (async () => {
        await login();
        addFilterUI();
    })();

    // Observer untuk deteksi navigasi/back
    window.addEventListener("popstate", () => {
        if (location.pathname.startsWith("/titles")) {
            // tunggu sampai tombol Reset muncul
            const observer = new MutationObserver(() => {
                const resetBtn = Array.from(document.querySelectorAll("button"))
                .find(btn => btn.textContent.trim().toLowerCase().includes("reset"));
                if (resetBtn) {
                    addFilterUI();
                    observer.disconnect(); // stop observer setelah UI dibuat
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    });

    function handleTitlesPage() {
        const observer = new MutationObserver(() => {
            const resetBtn = Array.from(document.querySelectorAll("button"))
            .find(btn => btn.textContent.trim().toLowerCase().includes("reset"));
            if (resetBtn) {
                addFilterUI();
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Back/Forward
    window.addEventListener("popstate", () => {
        if (isExcludedPath()) {
            GM_setValue("lastFilterStatus", "");
            location.reload();
            return;
        }
        if (location.pathname.startsWith("/titles")) {
            handleTitlesPage();
        }
    });

    // Override pushState/replaceState untuk deteksi pindah page=2,3,...
    ["pushState", "replaceState"].forEach(fn => {
        const orig = history[fn];
        history[fn] = function(...args) {
            const ret = orig.apply(this, args);

            if (isExcludedPath()) {
                // reset filter dan reload sekali
                GM_setValue("lastFilterStatus", "");
                location.reload();
                return ret;
            }

            if (location.pathname.startsWith("/titles")) {
                handleTitlesPage();
            }
            return ret;
        };
    });

    function applyFilterWhenReady(filterBox) {
        const lastStatus = GM_getValue("lastFilterStatus", "");
        if (!lastStatus) return;

        filterBox.value = lastStatus;

        const runFilter = async () => {
            let statuses = {};
            if (lastStatus === "null") {
                statuses = await getAllStatuses();
            } else {
                statuses = await getFilteredStatuses(lastStatus);
            }

            const mangaCards = document.querySelectorAll("a[href^='/title/']");
            if (mangaCards.length === 0) return false; // belum ada card

            mangaCards.forEach(card => {
                const href = card.getAttribute("href");
                const match = href.match(/\/title\/([0-9a-f-]+)/);
                if (!match) return;
                const mangaId = match[1];
                const status = statuses[mangaId] || null;

                if (lastStatus === "null") {
                    card.closest("div").style.display = (status === null ? "" : "none");
                } else {
                    card.closest("div").style.display = (status ? "" : "none");
                }
            });
            return true;
        };

        // coba langsung sekali
        runFilter().then(success => {
            if (success) return;
            // kalau belum ada card, tunggu dengan observer
            const observer = new MutationObserver(async () => {
                const ok = await runFilter();
                if (ok) observer.disconnect();
            });
            // fokus ke container list manga, bukan body
            const listContainer = document.querySelector("main") || document.querySelector("[class*='title-list']");
            observer.observe(listContainer || document.body, { childList: true, subtree: true });
        });
    }

})();
