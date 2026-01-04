// ==UserScript==
// @name         YouTube → FreeTube Link Rewriter
// @name:en      YouTube → FreeTube Link Rewriter
// @name:nl      YouTube → FreeTube Link Herschrijver
// @name:es      Reescritor de Enlaces de YouTube a FreeTube
// @name:fr      Réécriture des Liens YouTube vers FreeTube
// @name:de      YouTube → FreeTube Link-Umschreiber
// @name:zh-CN   YouTube → FreeTube 链接重写器
// @name:ja      YouTube → FreeTube リンク書き換え
// @name:ru      Переписчик ссылок YouTube на FreeTube
// @name:pt      Reescritor de Links do YouTube para FreeTube
// @name:it      Riscrittore di Link da YouTube a FreeTube
// @name:ko      YouTube → FreeTube 링크 재작성기
// @namespace    https://greasyfork.org/users/1197317-opus-x
// @version      1.01
// @description  Rewrite YouTube links to use the FreeTube protocol handler for opening in the local FreeTube application. Ensures the current page remains unchanged upon clicking.
// @description:en Rewrite YouTube links to use the FreeTube protocol handler for opening in the local FreeTube application. Ensures the current page remains unchanged upon clicking.
// @description:nl Herschrijf YouTube-links om de FreeTube-protocolhandler te gebruiken voor het openen in de lokale FreeTube-applicatie. Zorgt ervoor dat de huidige pagina ongewijzigd blijft bij klikken.
// @description:es Reescribe los enlaces de YouTube para usar el manejador de protocolo FreeTube y abrir en la aplicación local FreeTube. Asegura que la página actual permanezca sin cambios al hacer clic.
// @description:fr Réécrit les liens YouTube pour utiliser le gestionnaire de protocole FreeTube afin d'ouvrir dans l'application locale FreeTube. Assure que la page actuelle reste inchangée lors du clic.
// @description:de Schreibe YouTube-Links um, um den FreeTube-Protokollhandler zu verwenden, um in der lokalen FreeTube-Anwendung zu öffnen. Stellt sicher, dass die aktuelle Seite beim Klicken unverändert bleibt.
// @description:zh-CN 将 YouTube 链接重写为使用 FreeTube 协议处理程序，以便在本地 FreeTube 应用程序中打开。确保点击时当前页面保持不变。
// @description:ja YouTubeリンクをFreeTubeプロトコルハンドラを使用して書き換え、ローカルFreeTubeアプリケーションで開く。クリック時に現在のページが変更されないようにする。
// @description:ru Переписывает ссылки YouTube для использования обработчика протокола FreeTube для открытия в локальном приложении FreeTube. Обеспечивает, чтобы текущая страница оставалась неизменной при клике.
// @description:pt Reescreve links do YouTube para usar o manipulador de protocolo FreeTube para abrir no aplicativo local FreeTube. Garante que a página atual permaneça inalterada ao clicar.
// @description:it Riscrive i link di YouTube per utilizzare il gestore di protocollo FreeTube per aprire nell'applicazione locale FreeTube. Assicura che la pagina corrente rimanga invariata al clic.
// @description:ko YouTube 링크를 FreeTube 프로토콜 핸들러를 사용하도록 재작성하여 로컬 FreeTube 애플리케이션에서 열기. 클릭 시 현재 페이지가 변경되지 않도록 함.
// @author       Opus-X
// @license      MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAKlBMVEX/MzP/MzP/MzP/MzNHcEz/MjL/MjH/MzP/MzMoq+Ipq+Epq+Epq+Epq+E6ZLarAAAADnRSTlMm6/+UAEltncQz/4zIyYVApBkAAAB5SURBVHgBYmBUUlJ2CVSCAwYhIBGihCQAIlLwCCiiC6ijCyigC6RABJpgfFVAZ3JwBRAQwEC0h+0IUAkFqGWLAG76A1njyVFu81MKqk5rywSxZIJpc0AABJAACCAxGA2W+AIN0MCqBtIPPD9A/oPg0DvkDpVD2YQPHN0sihbxqdYWAAAAAElFTkSuQmCC
// @match        *://*/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559704/YouTube%20%E2%86%92%20FreeTube%20Link%20Rewriter.user.js
// @updateURL https://update.greasyfork.org/scripts/559704/YouTube%20%E2%86%92%20FreeTube%20Link%20Rewriter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Convert a YouTube URL to the corresponding FreeTube protocol URL
    function convertToFreeTubeProtocol(url) {
        try {
            const u = new URL(url);
            const { hostname, pathname } = u;

            // Match YouTube domains and short links
            if (hostname.match(/(^|\.)youtube\.com$/) || hostname.match(/(^|\.)youtube-nocookie\.com$/) || hostname === 'youtu.be') {
                // Supported paths: watch videos, shorts, live, playlists, channels, etc.
                if (
                    pathname === '/watch' ||
                    pathname.startsWith('/shorts/') ||
                    pathname.startsWith('/live/') ||
                    pathname === '/playlist' ||
                    pathname.startsWith('/@') ||  // Channels
                    pathname.startsWith('/channel/') ||
                    pathname.startsWith('/c/') ||
                    pathname.startsWith('/user/')
                ) {
                    return 'freetube://' + url;
                }

                // For youtu.be short links
                if (hostname === 'youtu.be' && pathname.length > 1) {
                    return 'freetube://' + url;
                }
            }
        } catch (e) {
            // Invalid URL
        }

        return null;
    }

    // Trigger the FreeTube protocol using a hidden iframe
    function triggerFreeTube(protocolUrl) {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = protocolUrl;
        document.body.appendChild(iframe);
        setTimeout(() => {
            if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
        }, 1000);
    }

    // Handle direct loads and SPA navigations: trigger FreeTube and blank the page
    function handleNavigation() {
        const protocolUrl = convertToFreeTubeProtocol(location.href);
        if (protocolUrl) {
            window.stop(); // Stop loading resources
            triggerFreeTube(protocolUrl);
            location.replace('about:blank'); // Blank the page after triggering
            return true;
        }
        return false;
    }

    // Check immediately at document-start for direct loads
    if (handleNavigation()) {
        return; // Exit early if handled
    }

    // Rewrite existing YouTube links to FreeTube protocol
    function rewriteLinks() {
        const links = document.querySelectorAll('a[href^="http://youtube.com"], a[href^="https://youtube.com"], a[href^="http://www.youtube.com"], a[href^="https://www.youtube.com"], a[href^="http://youtu.be"], a[href^="https://youtu.be"], a[href^="http://youtube-nocookie.com"], a[href^="https://youtube-nocookie.com"]');
        links.forEach(link => {
            const newUrl = convertToFreeTubeProtocol(link.href);
            if (newUrl) {
                link.href = newUrl;
            }
        });
    }

    // Initial rewrite after DOMContentLoaded
    document.addEventListener('DOMContentLoaded', rewriteLinks);

    // Observe for dynamically added links
    const observer = new MutationObserver(rewriteLinks);
    observer.observe(document.body || document.documentElement, { childList: true, subtree: true });

    // Intercept clicks to trigger protocol without navigating
    document.addEventListener('click', e => {
        if (e.button !== 0 || e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;

        const a = e.target.closest('a[href]');
        if (!a) return;

        const protocolUrl = convertToFreeTubeProtocol(a.href);
        if (!protocolUrl) return;

        e.preventDefault();
        e.stopImmediatePropagation();

        triggerFreeTube(protocolUrl);
    }, true); // Capture phase

    // Patch History API to detect SPA navigations
    const origPushState = history.pushState;
    const origReplaceState = history.replaceState;

    history.pushState = function (...args) {
        origPushState.apply(this, args);
        handleNavigation();
    };

    history.replaceState = function (...args) {
        origReplaceState.apply(this, args);
        handleNavigation();
    };

    window.addEventListener('popstate', handleNavigation);

    // YouTube-specific SPA hooks for extra reliability
    window.addEventListener('yt-navigate-start', handleNavigation, true);
    window.addEventListener('yt-page-data-updated', handleNavigation, true);
})();