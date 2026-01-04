// ==UserScript==
// @name         1factory BOM Copier
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Copy BOM lines from the Part page. Click: Level 1 only. Shift+Click: ALL (with headers: Level, Part, Rev, Description, Qty).
// @author       Austin
// @license      MIT
// @match        https://www.1factory.com/parts/part?*indx=1*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1factory.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550166/1factory%20BOM%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/550166/1factory%20BOM%20Copier.meta.js
// ==/UserScript==

(function() {
    const $ = (sel, root = document) => root.querySelector(sel);
    const txt = (s) => (s || "").replace(/\s+/g, " ").trim();

    const getLevel = (row) => txt(row.querySelector(".data.cell")?.textContent);
    const getPart = (row) => txt(row.querySelector(".comp_no")?.textContent);
    const getRev = (row) => txt(row.querySelector(".short.cell")?.textContent);
    const getDesc = (row) => txt(row.querySelector(".data.flex.cell")?.textContent);
    const getQty = (row) => txt(row.querySelector(".qty.cell")?.textContent);

    const getRowLine = (row, all = false) => {
        const level = getLevel(row);
        const part = getPart(row);
        const rev = getRev(row);
        const desc = getDesc(row);
        const qty = getQty(row);
        if (!part) return "";
        return all ?
            `${level}\t${part}\t${rev}\t${desc}\t${qty}` :
            (rev ? `${part} ${rev}\t${desc}` : `${part}\t${desc}`);
    };

    const collect = (all) => {
        const rows = [...document.querySelectorAll(".enterprise-grid--body .row")];
        const filtered = all ? rows : rows.filter((r) => getLevel(r) === "1");
        let lines = filtered.map((r) => getRowLine(r, all)).filter(Boolean);
        if (all) lines.unshift("Level\tPart Number\tRev\tDescription\tQty");
        return lines.join("\n");
    };

    // Visual indicator on the icon: ✅ for success, ❌ for failure, auto-revert
    const indicate = (iconEl, ok = true, ms = 2500) => {
        if (!iconEl) return;
        const prev = {
            text: iconEl.textContent,
            transform: iconEl.style.transform,
            color: iconEl.style.color
        };
        iconEl.textContent = ok ? "✅" : "❌";
        iconEl.style.transform = "scale(1.1)";
        iconEl.style.color = ok ? "" : "#e23";
        setTimeout(() => {
            iconEl.textContent = prev.text;
            iconEl.style.transform = prev.transform || "";
            iconEl.style.color = prev.color || "";
        }, ms);
    };

    const doCopy = async (text, iconEl) => {
        try {
            await navigator.clipboard.writeText(text);
            indicate(iconEl, true);
        } catch {
            // Fallback
            try {
                const ta = Object.assign(document.createElement("textarea"), {
                    value: text
                });
                ta.style.position = "fixed";
                ta.style.left = "-9999px";
                document.body.appendChild(ta);
                ta.select();
                const ok = document.execCommand("copy");
                ta.remove();
                indicate(iconEl, !!ok);
            } catch {
                indicate(iconEl, false);
            }
        }
    };

    const onClickCopy = (ev, iconEl) => doCopy(collect(ev.shiftKey), iconEl);

    const installHeaderIcon = () => {
        if (document.getElementById("copy-bom-split")) return true;

        const headings = $(".enterprise-grid--headings");
        if (!headings) return false;

        const firstCell =
            headings.querySelector(".heading.cell") ||
            headings.querySelector(".cell") ||
            headings.firstElementChild;
        if (!firstCell) return false;

        // Wrap with grid [label | icon]
        const wrapper = document.createElement("div");
        wrapper.id = "copy-bom-split";
        Object.assign(wrapper.style, {
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "center",
            gap: "6px",
            width: "100%",
        });

        const labelWrap = document.createElement("div");
        Object.assign(labelWrap.style, {
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        });
        while (firstCell.firstChild) labelWrap.appendChild(firstCell.firstChild);

        const icon = document.createElement("span");
        icon.id = "copy-bom-icon";
        icon.textContent = "📋";
        icon.title =
            "Click: copy Level 1 only • Shift+Click: copy ALL";
        Object.assign(icon.style, {
            cursor: "pointer",
            fontSize: "18px",
            lineHeight: "1",
            userSelect: "none",
            opacity: "0.85",
            justifySelf: "end",
            transition: "transform 120ms ease"
        });
        icon.addEventListener("mouseenter", () => (icon.style.opacity = "1"));
        icon.addEventListener("mouseleave", () => (icon.style.opacity = "0.85"));
        icon.addEventListener("click", (e) => onClickCopy(e, icon));

        wrapper.appendChild(labelWrap);
        wrapper.appendChild(icon);
        firstCell.appendChild(wrapper);

        return true;
    };

    // Retry while grid renders
    let attempts = 0;
    const t = setInterval(() => {
        attempts++;
        if (installHeaderIcon()) clearInterval(t);
        else if (attempts > 40) clearInterval(t); // ~10s max
    }, 250);

    // Re-install if header re-renders
    const mo = new MutationObserver(() => {
        if (!document.getElementById("copy-bom-split")) installHeaderIcon();
    });
    mo.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();