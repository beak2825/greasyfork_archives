// ==UserScript==
// @name         0xxx 多搜索引擎 + 115秒开 + 过滤仅主页生效（articles页禁用）
// @namespace    http://tampermonkey.net/
// @version      7.4
// @description  搜索按钮去掉"Search"、过滤仅在非 articles 页面生效（2160p/1080p/VR）
// @author       你 + 最终版
// @include      *://0xxx.*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      115.com
// @connect      web.api.115.com
// @connect      webapi.115.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552982/0xxx%20%E5%A4%9A%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%20%2B%20115%E7%A7%92%E5%BC%80%20%2B%20%E8%BF%87%E6%BB%A4%E4%BB%85%E4%B8%BB%E9%A1%B5%E7%94%9F%E6%95%88%EF%BC%88articles%E9%A1%B5%E7%A6%81%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/552982/0xxx%20%E5%A4%9A%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%20%2B%20115%E7%A7%92%E5%BC%80%20%2B%20%E8%BF%87%E6%BB%A4%E4%BB%85%E4%B8%BB%E9%A1%B5%E7%94%9F%E6%95%88%EF%BC%88articles%E9%A1%B5%E7%A6%81%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const defaultEngines = [
        { name: "PirateBay", url: "https://thepiratebay.org/search.php?q={{ q }}&all=on&search=Pirate+Search&page=0&orderby=", enabled: true },
        { name: "BTChichi", url: "https://www.btchichi.work/search.html?name={{ q }}", enabled: true },
        { name: "TruPornoLabs", url: "https://trupornolabs.org/search/{{ q }}", enabled: true }
    ];

    const processedRows = new WeakSet();

    // ==================== 115 播放逻辑（完全保留） ====================
    function search115Data(searchKey, callback) {
        let searchKey_Key = searchKey.replace(/(\.)/g, " ");
        let searchUrl = `https://webapi.115.com/files/search?search_value=${encodeURIComponent(searchKey_Key)}&format=json&limit=200`;
        GM_xmlhttpRequest({
            method: 'GET',
            url: searchUrl,
            headers: {
                "Referer": "https://115.com/",
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "X-Requested-With": "XMLHttpRequest"
            },
            timeout: 10000,
            onload: (result) => {
                if (result.status === 200) {
                    try {
                        let json = JSON.parse(result.responseText);
                        if (json.count > 0) {
                            for (let row of json.data) {
                                if (row.play_long && row.n.toLowerCase().includes(searchKey.toLowerCase())) {
                                    let videoUrl = `https://115.com/web/lixian/master/video/?cid=${row.cid}&pick_code=${row.pc}&title=${encodeURIComponent(row.n)}`;
                                    callback(true, videoUrl);
                                    return;
                                }
                            }
                        }
                    } catch (e) { console.error(e); }
                }
                callback(false, null);
            },
            onerror: () => callback(false, null),
            ontimeout: () => callback(false, null)
        });
    }

    function check115Availability(fileName, btn, callback) {
        const query = extractSearchTerm(fileName);
        search115Data(query, (found, url) => {
            if (found) {
                btn.style.backgroundColor = "#4CAF50";
                btn.dataset.videoUrl = url;
                if (callback) callback(true, url);
            } else {
                btn.style.backgroundColor = "#f44336";
                if (callback) callback(false, null);
            }
        });
    }

    function play115Video(fileName, btn) {
        if (btn.dataset.videoUrl) {
            window.open(btn.dataset.videoUrl, '_blank');
        } else {
            check115Availability(fileName, btn, (found, videoUrl) => {
                if (found && videoUrl) {
                    btn.dataset.videoUrl = videoUrl;
                    window.open(videoUrl, '_blank');
                } else {
                    alert(`未在115网盘中找到匹配 "${extractSearchTerm(fileName)}" 的视频`);
                }
            });
        }
    }

    function extractSearchTerm(fileName) {
        let name = fileName.replace(/\s+/g, ".");
        const dateMatch = name.match(/^([^.]+(?:\.[^.]+)*?)\.(\d{2}\.\d{2}\.\d{2})/);
        if (dateMatch) return `${dateMatch[1]}.${dateMatch[2]}`;
        const resolutions = ["2160p", "1080p", "720p", "480p"];
        for (const res of resolutions) {
            const i = name.indexOf(res);
            if (i !== -1) return name.substring(0, i).replace(/\.+$/, "");
        }
        return name;
    }

    // 搜索按钮：只显示引擎名
    function createButton(fileName, engine) {
        const btn = document.createElement("button");
        btn.innerText = engine.name;
        btn.style.cssText = "margin-left:6px;padding:2px 8px;font-size:12px;cursor:pointer;";
        btn.onclick = () => window.open(engine.url.replace("{{ q }}", encodeURIComponent(extractSearchTerm(fileName))), "_blank");
        return btn;
    }

    function add115PlayButton(fileNameEl, fileName) {
        if (fileNameEl.querySelector('.btn-115-play')) return;
        const btn = document.createElement("button");
        btn.innerText = "115 在线播放";
        btn.className = 'btn-115-play';
        btn.style.cssText = "margin-left:6px;padding:2px 6px;color:white;border:none;border-radius:3px;cursor:pointer;";
        check115Availability(fileName, btn);
        btn.onclick = () => play115Video(fileName, btn);
        fileNameEl.appendChild(btn);
    }

    function handleCatalogueLikePage(engines) {
        const tables = document.querySelectorAll("table");
        tables.forEach(table => {
            const headerRow = table.querySelector("tr");
            if (!headerRow) return;
            let titleIndex = -1;
            headerRow.querySelectorAll("th, td").forEach((cell, i) => {
                if (cell.textContent.trim().toLowerCase() === "title") titleIndex = i;
            });
            if (titleIndex === -1) return;

            table.querySelectorAll("tr").forEach((row, i) => {
                if (i === 0 || processedRows.has(row)) return;
                const cell = row.cells[titleIndex];
                if (!cell) return;
                const fileName = cell.textContent.trim();
                if (!fileName) return;

                engines.filter(e => e.enabled).forEach(engine => {
                    if (!cell.querySelector(`button[data-engine="${engine.name}"]`)) {
                        cell.appendChild(createButton(fileName, engine));
                    }
                });
                add115PlayButton(cell, fileName);
                processedRows.add(row);
            });
        });
    }

    function handleArticlesPage(engines) {
        const titleLabel = Array.from(document.querySelectorAll("td, th, div, span"))
            .find(el => el.textContent.trim().toLowerCase() === "title");
        if (!titleLabel) return;
        const fileNameEl = titleLabel.nextElementSibling;
        if (!fileNameEl || fileNameEl.querySelector("button")) return;

        const fileName = fileNameEl.textContent.trim();
        if (!fileName) return;

        engines.filter(e => e.enabled).forEach(engine => {
            fileNameEl.appendChild(createButton(fileName, engine));
        });
        add115PlayButton(fileNameEl, fileName);
    }

    function observeDomChanges(engines) {
        const observer = new MutationObserver(() => {
            if (location.href.includes("/articles/")) {
                handleArticlesPage(engines);
            } else {
                handleCatalogueLikePage(engines);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ==================== 快速过滤（仅在非 articles 页面生效）================
    function addQuickFilters() {
        if (location.href.includes("/articles/")) return;  // articles 页不显示
        if (document.getElementById('xxx-quick-filters')) return;

        const bar = document.createElement('div');
        bar.id = 'xxx-quick-filters';
        bar.innerHTML = `
            <button data-filter="all">ALL</button>
            <button data-filter="2160p">2160p</button>
            <button data-filter="1080p">1080p</button>
            <button data-filter="vr">VR</button>
        `;
        bar.style.cssText = `
            position:fixed;top:10px;left:50%;transform:translateX(-50%);
            background:rgba(0,0,0,0.95);padding:12px 35px;border-radius:50px;
            z-index:99999;color:white;font-family:Arial;box-shadow:0 8px 32px rgba(0,0,0,0.7);
            backdrop-filter:blur(15px);display:flex;gap:20px;align-items:center;
        `;

        bar.querySelectorAll('button').forEach(btn => {
            btn.style.cssText = `
                padding:10px 24px;background:${btn.dataset.filter===GM_getValue('xxx_filter','all')?'#4CAF50':'#444'};
                color:white;border:none;border-radius:30px;cursor:pointer;font-weight:bold;
                font-size:15px;transition:all 0.3s;min-width:90px;
            `;
            btn.onclick = () => {
                GM_setValue('xxx_filter', btn.dataset.filter);
                bar.querySelectorAll('button').forEach(b => b.style.background = '#444');
                btn.style.background = '#4CAF50';
                applyQuickFilter();
            };
        });

        document.body.appendChild(bar);
    }

    function applyQuickFilter() {
        if (location.href.includes("/articles/")) return;  // articles 页不执行过滤

        const mode = GM_getValue('xxx_filter', 'all');

        document.querySelectorAll('table tr').forEach(row => {
            if (row.querySelector('th')) return; // 跳过表头
            const categoryCell = row.cells[0];
            if (!categoryCell) return;

            const text = categoryCell.textContent || '';
            const lower = text.toLowerCase();

            let show = true;

            if (mode === '2160p') show = /2160p|4k|uhd/i.test(lower);
            else if (mode === '1080p') show = /1080p|fhd|fullhd/i.test(lower) && !/2160p|4k|uhd/i.test(lower);
            else if (mode === 'vr') show = /vr/i.test(lower);

            row.style.display = show ? '' : 'none';
        });
    }

    const filterObserver = new MutationObserver(() => {
        if (!location.href.includes("/articles/")) applyQuickFilter();
    });
    filterObserver.observe(document.body, { childList: true, subtree: true });

    // ==================== 初始化 ====================
    const engines = GM_getValue("engines", defaultEngines);

    GM_registerMenuCommand("管理搜索引擎", showEnginePanel);
    GM_registerMenuCommand("导出搜索引擎配置", () => {
        const json = JSON.stringify(engines, null, 2);
        const w = window.open("","配置"); w.document.write(`<pre>${json}</pre>`);
    });
    GM_registerMenuCommand("导入搜索引擎配置", () => {
        const input = prompt("粘贴 JSON 配置：");
        if (!input) return;
        try {
            const parsed = JSON.parse(input);
            if (Array.isArray(parsed) && parsed.every(e=>e.name && e.url && e.url.includes("{{ q }}"))) {
                GM_setValue("engines", parsed);
                alert("导入成功，刷新页面生效");
            } else throw "";
        } catch { alert("格式错误"); }
    });

    function showEnginePanel() {
        const engines = GM_getValue("engines", defaultEngines);
        let panel = document.getElementById("engine-panel");
        if (panel) panel.remove();

        panel = document.createElement("div");
        panel.id = "engine-panel";
        panel.style.cssText = "position:fixed;top:50px;right:50px;z-index:99999;background:#fff;border:1px solid #ccc;padding:15px;box-shadow:0 2px 10px rgba(0,0,0,0.3);max-width:400px;font-size:14px;";

        const title = document.createElement("div");
        title.innerText = "搜索引擎管理";
        title.style.fontWeight = "bold";
        panel.appendChild(title);

        engines.forEach((engine, i) => {
            const row = document.createElement("div");
            row.style.margin = "8px 0";

            const label = document.createElement("span");
            label.innerText = engine.name + " ";
            row.appendChild(label);

            const toggle = document.createElement("button");
            toggle.innerText = engine.enabled ? "启用" : "禁用";
            toggle.style.marginLeft = "6px";
            toggle.onclick = () => {
                engine.enabled = !engine.enabled;
                toggle.innerText = engine.enabled ? "启用" : "禁用";
                GM_setValue("engines", engines);
            };
            row.appendChild(toggle);

            const del = document.createElement("button");
            del.innerText = "删除";
            del.style.marginLeft = "6px";
            del.onclick = () => {
                engines.splice(i, 1);
                GM_setValue("engines", engines);
                panel.remove();
                showEnginePanel();
            };
            row.appendChild(del);

            panel.appendChild(row);
        });

        const addRow = document.createElement("div");
        addRow.style.marginTop = "15px";

        const nameInput = document.createElement("input");
        nameInput.placeholder = "名称";
        nameInput.style.width = "100px";
        addRow.appendChild(nameInput);

        const urlInput = document.createElement("input");
        urlInput.placeholder = "搜索地址 (含 {{ q }})";
        urlInput.style.width = "220px";
        urlInput.style.marginLeft = "6px";
        addRow.appendChild(urlInput);

        const addBtn = document.createElement("button");
        addBtn.innerText = "新增";
        addBtn.style.marginLeft = "6px";
        addBtn.onclick = () => {
            const name = nameInput.value.trim();
            const url = urlInput.value.trim();
            if (!name || !url.includes("{{ q }}")) {
                alert("必须填写名称，且搜索地址必须包含 {{ q }} 占位符！");
                return;
            }
            engines.push({ name, url, enabled: true });
            GM_setValue("engines", engines);
            panel.remove();
            showEnginePanel();
        };
        addRow.appendChild(addBtn);

        panel.appendChild(addRow);

        const close = document.createElement("button");
        close.innerText = "关闭";
        close.style.marginTop = "10px";
        close.onclick = () => panel.remove();
        panel.appendChild(close);

        document.body.appendChild(panel);
    }

    // 主逻辑
    if (location.href.includes("/articles/")) {
        handleArticlesPage(engines);
    } else if (location.href.includes("/index.php?catalogue=") || location.hostname.startsWith("0xxx.")) {
        handleCatalogueLikePage(engines);
    }

    observeDomChanges(engines);

    // 快速过滤：仅在非 articles 页面生效
    if (!location.href.includes("/articles/")) {
        addQuickFilters();
        applyQuickFilter();
    }
})();