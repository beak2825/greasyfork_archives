// ==UserScript==
// @name            Block save as (ctrl + s)
// @name:vi         Chặn lưu trang (ctrl + s)
// @name:ja         ページ保存をブロック (ctrl + s)
// @name:zh-CN      阻止保存为 (ctrl + s)
// @name:ru         Блокировка сохранения (ctrl + s)
// @name:es         Bloquear guardar como (ctrl + s)
// @name:fr         Bloquer enregistrer sous (ctrl + s)
// @name:de         Speichern unter blockieren (ctrl + s)
// @name:ko         다른 이름으로 저장 차단 (ctrl + s)
// @description     Block save as (ctrl + s) in web pages. Turn on CapsLock to bypass.
// @description:vi  Chặn lưu trang bằng phím tắt ctrl + s. Bật CapsLock để bỏ qua.
// @description:ja  Webページでの保存 (ctrl + s) をブロックします。バイパスするにはCapsLockをオンにしてください。
// @description:zh-CN 在网页中阻止保存为 (ctrl + s)。开启 CapsLock 可绕过。
// @description:ru  Блокирует сохранение (ctrl + s) на веб-страницах. Включите CapsLock, чтобы обойти.
// @description:es  Bloquear guardar como (ctrl + s) en páginas web. Active CapsLock para omitir.
// @description:fr  Bloquer enregistrer sous (ctrl + s) dans les pages web. Activez CapsLock pour contourner.
// @description:de  Speichern unter (ctrl + s) auf Webseiten blockieren. Schalten Sie CapsLock ein, um dies zu umgehen.
// @description:ko  웹 페이지에서 다른 이름으로 저장 (ctrl + s) 차단. 우회하려면 CapsLock을 켜십시오.
// @author          QuanVu
// @namespace       https://github.com/vuquan2005/ScriptsMonkey
// @version         1.2.0
// @match           *://*/*
// @grant           none
// @run-at          document-start
// @license         MIT
// @icon            data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/563884/Block%20save%20as%20%28ctrl%20%2B%20s%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563884/Block%20save%20as%20%28ctrl%20%2B%20s%29.meta.js
// ==/UserScript==

(function () {
    "use strict";

    document.addEventListener("keydown", function (event) {
        if ((event.ctrlKey || event.metaKey) && (event.key === "s" || event.key === "S")) {
            if (!event.getModifierState("CapsLock")) {
                event.preventDefault();
                console.log("❌ Block Save As: Blocked. Turn on CapsLock to bypass.");
            }
        }
    }, { capture: true });
})();