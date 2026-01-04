// ==UserScript==
// @name               SUP 盤點明細：鍵盤導覽
// @description        使用鍵盤瀏覽 SUP 盤點明細。
// @icon               data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAJUExURRqzlP///xuzlCEvLkIAAAABYktHRAH/Ai3eAAAAB3RJTUUH6QsQBzIzjbmlhgAAACVJREFUCNdjYIACARARwsDoICIAIhhAxAooERrCACWgEsgEKgAA/gAFwfMH0swAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjUtMTEtMTZUMDc6NTA6NTErMDA6MDDDFCdBAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI1LTExLTE2VDA3OjUwOjUxKzAwOjAwskmf/QAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyNS0xMS0xNlQwNzo1MDo1MSswMDowMOVcviIAAAAASUVORK5CYII=
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.0.0
// @license            MIT
// @match              https://stocktake.sup.services/vueapp/index.html#/admin/stock/status/details
// @match              https://stocktake.sup.services/vueapp/index.html#/admin/stock/status/details?*
// @run-at             document-end
// @grant              none
// @supportURL         https://greasyfork.org/scripts/555994/feedback
// @downloadURL https://update.greasyfork.org/scripts/555994/SUP%20%E7%9B%A4%E9%BB%9E%E6%98%8E%E7%B4%B0%EF%BC%9A%E9%8D%B5%E7%9B%A4%E5%B0%8E%E8%A6%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/555994/SUP%20%E7%9B%A4%E9%BB%9E%E6%98%8E%E7%B4%B0%EF%BC%9A%E9%8D%B5%E7%9B%A4%E5%B0%8E%E8%A6%BD.meta.js
// ==/UserScript==

window.addEventListener("unload", () => {});

const interval = setInterval(() =>
{
    const searchField = document.querySelector("[placeholder=請輸入條碼]");
    const searchButton = document.querySelector(".search");
    if (!searchField || !searchButton) { return; }

    window.addEventListener("focus", () =>
    {
        searchField.focus();
        searchField.select();
    });

    document.addEventListener("visibilitychange", () =>
    {
        if ((document.visibilityState === "visible") && (frameElement?.style.display !== "none"))
        {
            searchField.focus();
            searchField.select();
        }
    });

    if (frameElement)
    {
        const observer = new MutationObserver((records) =>
        {
            if (frameElement.style.display !== "none")
            {
                searchField.focus();
                searchField.select();
            }
        });

        observer.observe(frameElement, { attributes: true, attributeFilter: ["style"] });
    }

    searchField.addEventListener("focus", () =>
    {
        searchField.select();
    });

    searchField.addEventListener("keydown", () =>
    {
        if (event.key === "Enter")
        {
            event.preventDefault();
            searchButton.click();
        }
    });

    searchButton.addEventListener("click", () =>
    {
        searchField.focus();
        searchField.select();
    });

    searchField.focus();
    searchField.select();

    clearInterval(interval);
}, 100);
