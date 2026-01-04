// ==UserScript==
// @name         Kone.gg Saved URLs Extractor
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  kone.gg /saved 페이지 저장된 게시물 URL 추출 + 전체 URL 추출 버튼 강조
// @match        https://kone.gg/saved*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555859/Konegg%20Saved%20URLs%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/555859/Konegg%20Saved%20URLs%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createUI() {
        if (document.getElementById("koneExtractorBox")) return;

        const box = document.createElement("div");
        box.id = "koneExtractorBox";
        box.style.position = "fixed";
        box.style.right = "20px";
        box.style.bottom = "20px";
        box.style.background = "#fff";
        box.style.border = "1px solid #555";
        box.style.padding = "12px";
        box.style.borderRadius = "8px";
        box.style.zIndex = "9999999";
        box.style.fontSize = "14px";
        box.style.boxShadow = "0 3px 15px rgba(0,0,0,0.25)";
        box.style.maxWidth = "560px";
        box.style.display = "flex";
        box.style.flexDirection = "column";
        box.style.gap = "5px";

        const createButton = (text, icon, color, fullWidth=false) => {
            const btn = document.createElement("button");
            btn.innerHTML = `${icon} ${text}`;
            btn.style.padding = "6px 12px";
            btn.style.border = `1px solid ${color}`;
            btn.style.borderRadius = "5px";
            btn.style.background = color + "22";
            btn.style.color = color;
            btn.style.cursor = "pointer";
            btn.style.transition = "all 0.15s";
            btn.onmouseover = () => { btn.style.background = color + "44"; btn.style.transform = "scale(1.03)"; };
            btn.onmouseout = () => { btn.style.background = color + "22"; btn.style.transform = "scale(1)"; };
            if (fullWidth) btn.style.width = "100%";
            return btn;
        };

        // 전체 URL 버튼 (가장 넓은 자리)
        const extractAllBtn = createButton("전체 URL 추출", "📋", "#17a2b8", true);

        const loadAllBtn = createButton("모두 로드", "🔄", "#007bff");
        const selectAllBtn = createButton("전체 선택", "✅", "#28a745");
        const deselectAllBtn = createButton("전체 해제", "❌", "#dc3545");
        const extractSelectedBtn = createButton("선택 URL 추출", "📥", "#6f42c1");
        const extractExcludedBtn = createButton("선택 제외 URL 추출", "📤", "#fd7e14");

        const output = document.createElement("textarea");
        output.id = "koneExtractOutput";
        output.style.width = "100%";
        output.style.height = "200px";
        output.style.marginTop = "10px";
        output.style.whiteSpace = "pre-wrap";
        output.style.resize = "vertical";
        output.style.padding = "5px";
        output.style.border = "1px solid #555";
        output.style.borderRadius = "5px";

        // 버튼 배치
        box.appendChild(extractAllBtn);   // 가장 넓은 버튼 최상단
        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.gap = "5px";
        row.appendChild(loadAllBtn);
        row.appendChild(selectAllBtn);
        row.appendChild(deselectAllBtn);
        row.appendChild(extractSelectedBtn);
        row.appendChild(extractExcludedBtn);
        box.appendChild(row);
        box.appendChild(output);
        document.body.appendChild(box);

        // 버튼 기능
        extractAllBtn.addEventListener("click", () => {
            let results = "";
            document.querySelectorAll('div.group a.block').forEach(link => {
                const href = link.getAttribute("href");
                if (href) results += location.origin + href + "\n";
            });
            output.value = results;
            if (results.trim()) try { navigator.clipboard.writeText(results); } catch(e){}
            alert(results.trim() ? "모든 URL이 복사되었습니다." : "URL이 없습니다.");
        });

        loadAllBtn.addEventListener("click", async () => {
            const scrollDelay = 500;
            while (true) {
                window.scrollTo(0, document.body.scrollHeight);
                await new Promise(r => setTimeout(r, scrollDelay));
                const allLoaded = Array.from(document.querySelectorAll('div.group, div')).some(div =>
                    div.textContent.includes("모든 게시글을 불러왔습니다.")
                );
                if (allLoaded) break;
            }
            alert("모든 게시물이 로드되었습니다.");
        });

        const toggleCheckboxes = (check) => {
            document.querySelectorAll('button[role="checkbox"]').forEach(cb => {
                const isChecked = cb.getAttribute("aria-checked") === "true";
                if (check && !isChecked) cb.click();
                if (!check && isChecked) cb.click();
            });
        };
        selectAllBtn.addEventListener("click", () => toggleCheckboxes(true));
        deselectAllBtn.addEventListener("click", () => toggleCheckboxes(false));

        extractSelectedBtn.addEventListener("click", () => {
            let results = "";
            document.querySelectorAll('div.group').forEach(group => {
                const cb = group.querySelector('button[role="checkbox"]');
                const link = group.querySelector('a.block');
                if (cb && cb.getAttribute("aria-checked") === "true" && link) {
                    const href = link.getAttribute("href");
                    if (href) results += location.origin + href + "\n";
                }
            });
            output.value = results;
            if (results.trim()) try { navigator.clipboard.writeText(results); } catch(e){}
            alert(results.trim() ? "선택된 URL이 복사되었습니다." : "선택된 게시물이 없습니다.");
        });

        extractExcludedBtn.addEventListener("click", () => {
            let results = "";
            document.querySelectorAll('div.group').forEach(group => {
                const cb = group.querySelector('button[role="checkbox"]');
                const link = group.querySelector('a.block');
                if (cb && cb.getAttribute("aria-checked") !== "true" && link) {
                    const href = link.getAttribute("href");
                    if (href) results += location.origin + href + "\n";
                }
            });
            output.value = results;
            if (results.trim()) try { navigator.clipboard.writeText(results); } catch(e){}
            alert(results.trim() ? "선택 제외 URL이 복사되었습니다." : "선택되지 않은 게시물이 없습니다.");
        });

        output.addEventListener("click", () => output.select());
    }

    // SPA 안정화
    function ensureUI() {
        if (location.pathname.startsWith("/saved")) createUI();
    }

    new MutationObserver(ensureUI).observe(document.body, { childList: true, subtree: true });
    setInterval(ensureUI, 1000);
})();
