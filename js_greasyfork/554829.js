// ==UserScript==
// @name         NGS-划词数据库
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  带详细日志的版本：仅在 task 页面生效，划词结束后弹出菜单，含中文时不弹窗，方便调试打印日志。
// @author       QXY
// @match        http://ngs-report.mtttt.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554829/NGS-%E5%88%92%E8%AF%8D%E6%95%B0%E6%8D%AE%E5%BA%93.user.js
// @updateURL https://update.greasyfork.org/scripts/554829/NGS-%E5%88%92%E8%AF%8D%E6%95%B0%E6%8D%AE%E5%BA%93.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const LOG_PREFIX = "[NGS Gan]";
    function log(...args) { console.log(LOG_PREFIX, ...args); }
    function warn(...args) { console.warn(LOG_PREFIX, ...args); }
    function error(...args) { console.error(LOG_PREFIX, ...args); }

    log("脚本开始装载...");

    const TARGET_HASH_PREFIX = "#/ngsReport-taskMake?taskId=";

    let active = false;
    let cleanupFn = null;

    // 主入口，捕获异常并打印
    try {
        window.addEventListener("hashchange", () => {
            log("hashchange 事件触发，当前 hash:", location.hash);
            checkAndActivate();
        });

        // 首次检查（页面首次加载时）
        log("首次检测当前 URL 和 hash：", location.href, location.hash);
        checkAndActivate();
    } catch (e) {
        error("初始化时发生异常：", e);
    }

    function checkAndActivate() {
        try {
            if (location.hash && location.hash.startsWith(TARGET_HASH_PREFIX)) {
                log("检测到目标 hash 前缀 -> 目标页面。");
                if (!active) {
                    log("准备激活脚本...");
                    active = true;
                    try {
                        cleanupFn = initScript();
                        log("脚本已激活，cleanupFn 存在：", typeof cleanupFn === "function");
                    } catch (e) {
                        error("initScript 执行错误：", e);
                    }
                } else {
                    log("脚本已激活，跳过重复激活。");
                }
            } else {
                log("当前不是目标 hash 页面（或 hash 为空）。hash:", location.hash);
                if (active) {
                    log("正在停用脚本（离开目标页面）...");
                    active = false;
                    try {
                        if (cleanupFn) cleanupFn();
                        cleanupFn = null;
                        log("脚本已停用并清理完毕。");
                    } catch (e) {
                        error("清理过程中发生错误：", e);
                    }
                } else {
                    log("脚本当前未激活，无需停用。");
                }
            }
        } catch (e) {
            error("checkAndActivate 内部异常：", e);
        }
    }

    function initScript() {
        log("initScript 开始。读取配置...");
        const defaultConfig = {
            links: {
                "OncoKB": "https://www.oncokb.org/gene/{gene}",
                "Genecards": "https://www.genecards.org/cgi-bin/carddisp.pl?gene={gene}",
                "PubMed": "https://pubmed.ncbi.nlm.nih.gov/?term={gene}",
                "ClinVar": "https://www.ncbi.nlm.nih.gov/clinvar/?term={gene}"
            }
        };

        let config;
        try {
            config = GM_getValue("geneLinkConfig", defaultConfig);
            log("配置读取完成：", config);
        } catch (e) {
            warn("读取 GM_getValue 时出错，使用默认配置：", e);
            config = defaultConfig;
        }

        try {
            GM_registerMenuCommand("📝 编辑 Gene Link 配置", () => {
                const input = prompt("请输入 JSON 配置:", JSON.stringify(config, null, 2));
                if (!input) return;
                try {
                    const parsed = JSON.parse(input);
                    config = parsed;
                    GM_setValue("geneLinkConfig", config);
                    alert("配置已保存 ✅");
                    log("用户通过菜单编辑并保存了配置：", config);
                } catch (err) {
                    alert("JSON 格式错误: " + err.message);
                    warn("用户输入 JSON 格式错误：", err);
                }
            });

            GM_registerMenuCommand("🔄 重置为默认配置", () => {
                config = defaultConfig;
                GM_setValue("geneLinkConfig", defaultConfig);
                alert("已重置为默认配置 ✅");
                log("配置已重置为默认：", defaultConfig);
            });
        } catch (e) {
            warn("注册菜单命令时出错（可能在某些环境不支持）：", e);
        }

        // ======= 创建 UI =======
        const menu = document.createElement("div");
        Object.assign(menu.style, {
            position: "absolute",
            display: "none",
            background: "linear-gradient(180deg,#ffffff,#fbfdff)",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: "12px",
            boxShadow: "0 12px 36px rgba(18,35,60,0.14)",
            padding: "8px",
            fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
            fontSize: "15px",
            minWidth: "240px",
            zIndex: "2147483647",
            userSelect: "none",
            transformOrigin: "center top",
            transition: "opacity 0.12s ease, transform 0.12s ease",
            opacity: "0",
        });

        const header = document.createElement("div");
        Object.assign(header.style, {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 10px",
            borderBottom: "1px solid rgba(0,0,0,0.04)",
            marginBottom: "8px"
        });

        const headerText = document.createElement("div");
        headerText.style.fontWeight = "700";
        headerText.style.color = "#0b2545";
        headerText.textContent = "🔗";

        const gearBtn = document.createElement("button");
        gearBtn.textContent = "⚙";
        Object.assign(gearBtn.style, {
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            padding: "4px"
        });
        gearBtn.title = "编辑配置";

        header.appendChild(headerText);
        header.appendChild(gearBtn);
        menu.appendChild(header);

        const list = document.createElement("div");
        list.style.display = "flex";
        list.style.flexDirection = "column";
        list.style.gap = "8px";
        menu.appendChild(list);
        document.body.appendChild(menu);

        gearBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const input = prompt("编辑 JSON 配置：", JSON.stringify(config, null, 2));
            if (!input) return;
            try {
                const parsed = JSON.parse(input);
                config = parsed;
                GM_setValue("geneLinkConfig", config);
                alert("配置已保存 ✅");
                log("用户通过 UI Gear 保存配置：", config);
            } catch (err) {
                alert("JSON 格式错误: " + err.message);
                warn("UI 编辑配置 JSON 错误：", err);
            }
        });

        // ======= 仅在鼠标松开后触发（避免闪烁）=======
        const mouseupHandler = (ev) => {
            try {
                log("mouseup 触发，准备检查选区。 mouse event:", ev.type, "target:", ev.target && ev.target.tagName);
                setTimeout(() => {
                    const sel = window.getSelection();
                    if (!sel) { log("window.getSelection() 返回 null/undefined"); hideMenu(); return; }
                    if (sel.rangeCount === 0) { log("selection rangeCount 为 0"); hideMenu(); return; }
                    if (sel.isCollapsed) { log("selection isCollapsed"); hideMenu(); return; }

                    const raw = sel.toString();
                    log("选中原始文本（未 trim）：", JSON.stringify(raw));
                    const text = raw.trim();
                    log("选中文本（trim 后）：", JSON.stringify(text));
                    if (!text) { log("trim 后为空，不显示"); hideMenu(); return; }

                    // 检测中文（如果包含中文则不弹出）
                    if (/[\u4e00-\u9fa5]/.test(text)) {
                        log("选中文本包含中文，取消弹窗。文本：", text);
                        hideMenu(); return;
                    }

                    // 检查是否过长或包含换行（可视需要调整）
                    if (text.length > 200) {
                        log("选中文本过长，已忽略（长度）:", text.length);
                        hideMenu(); return;
                    }

                    const range = sel.getRangeAt(0);
                    let rect = range.getBoundingClientRect();
                    if (!rect || (rect.width === 0 && rect.height === 0)) {
                        rect = getRectByTemporaryNode(range);
                        log("通过临时节点获取 rect：", rect);
                    } else {
                        log("直接获取到 rect：", rect);
                    }
                    showMenuAt(text, rect);
                }, 120); // 稍微延迟等待稳定
            } catch (e) {
                error("mouseupHandler 内部异常：", e);
            }
        };

        const mousedownHandler = (e) => {
            try {
                if (!menu.contains(e.target)) {
                    log("mousedown 在菜单外，隐藏菜单。 target:", e.target && e.target.tagName);
                    hideMenu();
                } else {
                    log("mousedown 在菜单上，保留菜单。");
                }
            } catch (e) {
                warn("mousedownHandler 异常：", e);
            }
        };

        const keyupHandler = (e) => {
            if (e.key === "Escape") {
                log("检测到 Escape，隐藏菜单");
                hideMenu();
            }
        };

        document.addEventListener("mouseup", mouseupHandler);
        document.addEventListener("mousedown", mousedownHandler, true);
        document.addEventListener("keyup", keyupHandler, true);

        function getRectByTemporaryNode(range) {
            try {
                const zb = document.createElement("span");
                zb.textContent = "\u200b";
                range.insertNode(zb);
                const r = zb.getBoundingClientRect();
                zb.remove();
                return r;
            } catch (e) {
                warn("getRectByTemporaryNode 异常：", e);
                return { top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0 };
            }
        }

        function showMenuAt(rawText, rect) {
            try {
                log("准备显示菜单，rawText:", rawText, "rect:", rect);
                headerText.textContent = `🔗 ${rawText}`;
                list.innerHTML = "";

                const entries = Object.entries((config && config.links) ? config.links : defaultConfig.links);
                if (entries.length === 0) {
                    const none = document.createElement("div");
                    none.textContent = "未配置任何链接（通过脚本菜单编辑）";
                    none.style.padding = "8px";
                    none.style.color = "#666";
                    list.appendChild(none);
                } else {
                    entries.forEach(([name, template]) => {
                        const btn = document.createElement("button");
                        btn.textContent = name;
                        Object.assign(btn.style, {
                            padding: "10px",
                            borderRadius: "10px",
                            border: "none",
                            background: "linear-gradient(180deg,#f7f9ff,#eef4ff)",
                            cursor: "pointer",
                            fontWeight: "600",
                            color: "#034ea2",
                            boxShadow: "0 6px 16px rgba(3,78,162,0.06)",
                            transition: "transform .08s ease, box-shadow .08s ease"
                        });

                        btn.addEventListener("mouseenter", () => {
                            btn.style.transform = "translateY(-3px)";
                            btn.style.boxShadow = "0 12px 26px rgba(3,78,162,0.12)";
                        });
                        btn.addEventListener("mouseleave", () => {
                            btn.style.transform = "none";
                            btn.style.boxShadow = "0 6px 16px rgba(3,78,162,0.06)";
                        });

                        btn.addEventListener("click", (e) => {
                            e.stopPropagation();
                            try {
                                let gene = cleanText(rawText);
                                log("点击链接，原始 gene:", rawText, "cleaned:", gene);

                                if (/clinvar/i.test(name)) {
                                    const geneName = gene.split(":")[0];
                                    const cMatch = gene.match(/c\.[^:\s]+/);
                                    if (cMatch) gene = `${geneName} ${cMatch[0]}`;
                                    log("ClinVar 特殊处理后 gene:", gene);
                                }

                                let href;
                                if (/oncokb/i.test(name)) {
                                    href = template.replace(/{\s*gene\s*}/gi, gene);
                                } else {
                                    const encoded = encodeURIComponent(gene);
                                    href = template.replace(/{\s*gene\s*}/gi, encoded);
                                }

                                log("打开链接：", href);
                                openInNewTab(href);
                                hideMenu();
                            } catch (e) {
                                error("点击链接处理异常：", e);
                            }
                        });

                        list.appendChild(btn);
                    });
                }

                const padding = 12;
                const popupW = 320;
                menu.style.width = popupW + "px";
                const scrollY = window.scrollY || window.pageYOffset;
                const scrollX = window.scrollX || window.pageXOffset;
                let top = scrollY + rect.bottom + 10;
                let left = scrollX + rect.left + (rect.width / 2) - (popupW / 2);
                left = Math.max(padding + scrollX, Math.min(left, (document.documentElement.clientWidth - popupW - padding) + scrollX));

                menu.style.left = `${left}px`;
                menu.style.top = `${top}px`;
                menu.style.display = "block";
                requestAnimationFrame(() => {
                    menu.style.opacity = "1";
                    menu.style.transform = "scale(1)";
                });
                log("菜单已显示（DOM 更新完毕）");
            } catch (e) {
                error("showMenuAt 异常：", e);
            }
        }

        function hideMenu() {
            try {
                if (menu.style.display === "none") {
                    log("hideMenu 调用：菜单已隐藏状态，跳过。");
                    return;
                }
                log("正在隐藏菜单...");
                menu.style.opacity = "0";
                menu.style.transform = "scale(0.98)";
                setTimeout(() => {
                    if (menu.style.opacity === "0") {
                        menu.style.display = "none";
                        log("菜单已完全隐藏（display none）。");
                    }
                }, 140);
            } catch (e) {
                warn("hideMenu 异常：", e);
            }
        }

        function openInNewTab(href) {
            try {
                const a = document.createElement("a");
                a.href = href;
                a.target = "_blank";
                a.rel = "noopener";
                document.body.appendChild(a);
                a.click();
                a.remove();
                log("openInNewTab 已执行。");
            } catch (e) {
                warn("openInNewTab 出错：", e);
            }
        }

        function cleanText(str) {
            try {
                const s = str
                    .replace(/%20/gi, " ")
                    .replace(/[\n\t\r\s]+/g, " ")
                    .trim()
                    .replace(/\s+/g, "/");
                return s;
            } catch (e) {
                warn("cleanText 出错，返回原始：", e);
                return str;
            }
        }

        // 返回清理函数（用于停用时移除事件和 DOM）
        return () => {
            try {
                log("执行 cleanup：隐藏菜单，移除事件，销毁 DOM。");
                hideMenu();
                document.removeEventListener("mouseup", mouseupHandler);
                document.removeEventListener("mousedown", mousedownHandler, true);
                document.removeEventListener("keyup", keyupHandler, true);
                if (menu && menu.parentNode) menu.remove();
                log("cleanup 完成。");
            } catch (e) {
                warn("cleanup 异常：", e);
            }
        };
    }

})();
