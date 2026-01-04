// ==UserScript==
// @name         Tiktok - Redirect to tiknot.netlify.app 1.1
// @author       Eliton
// @description  Redirects TikTok links to TikNot and guarantees video loading with persistence verification.
// @description:pt-BR Redireciona links do TikTok para o TikNot e garante o carregamento do vídeo com verificação de persistência.
// @description:es Redirecciona los enlaces de TikTok a TikNot y garantiza la carga del video con verificación de persistencia.
// @description:fr Redirige les liens TikTok vers TikNot et garantit le chargement de la vidéo avec vérification de persistance.
// @description:ru Перенаправляет ссылки TikTok на TikNot и гарантирует загрузку видео с проверкой устойчивости.
// @description:zh-CN 将 TikTok 链接重定向到 TikNot，并通过持久性验证保证视频加载。
// @description:ar يعيد توجيه روابط TikTok إلى TikNot ويضمن تحميل الفيديو مع التحقق من الاستمرار.
// @description:hi TikTok लिंक को TikNot पर पुनर्निर्देशित करता है और दृढ़ता सत्यापन के साथ वीडियो लोड होने की गारंटी देता है।
// @description:id Mengarahkan ulang tautan TikTok ke TikNot dan menjamin pemuatan video dengan verifikasi persistensi.
// @description:ja TikTok リンクを TikNot にリダイレクトし、永続性検証により動画の読み込みを保証します。
// @description:de Leitet TikTok-Links zu TikNot um und garantiert das Laden des Videos mit Persistenzüberprüfung.// @match        *://www.tiktok.com/*
// @match        *://vt.tiktok.com/*
// @match        *://vm.tiktok.com/*
// @match        https://tiknot.netlify.app/*
// @run-at       document-start
// @version      1.1
// @grant        none
// @namespace    https://greasyfork.org/en/users/1550373
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559636/Tiktok%20-%20Redirect%20to%20tiknotnetlifyapp%2011.user.js
// @updateURL https://update.greasyfork.org/scripts/559636/Tiktok%20-%20Redirect%20to%20tiknotnetlifyapp%2011.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hostname = window.location.hostname;
    let currentUrl = window.location.href;

    // --- TIKTOK: LIMPEZA E REDIRECIONAMENTO ---
    if (hostname.includes("tiktok.com")) {
        if (currentUrl.includes("redirect_url=")) {
            try {
                const urlObj = new URL(currentUrl);
                const decodedUrl = urlObj.searchParams.get("redirect_url");
                if (decodedUrl) currentUrl = decodeURIComponent(decodedUrl);
            } catch (e) {}
        }

        try {
            const urlObj = new URL(currentUrl);
            const cleanBaseUrl = urlObj.origin + urlObj.pathname;
            window.location.replace("https://tiknot.netlify.app/?url=" + encodeURIComponent(cleanBaseUrl));
        } catch (e) {
            window.location.replace("https://tiknot.netlify.app/?url=" + encodeURIComponent(currentUrl));
        }
        return;
    }

    // --- TIKNOT: AUTOMAÇÃO COM PERSISTÊNCIA ---
    if (hostname.includes("tiknot.netlify.app")) {
        const urlParams = new URLSearchParams(window.location.search);
        const tiktokUrl = urlParams.get('url');

        if (tiktokUrl) {
            let clicked = false;

            const autoLoad = setInterval(() => {
                const inputField = document.getElementById('link');
                const searchButton = document.getElementById('search');

                if (inputField && searchButton && !clicked) {
                    // Se o campo estiver vazio ou errado, força a inserção novamente
                    if (inputField.value !== tiktokUrl) {
                        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                        inputField.focus();
                        nativeInputValueSetter.call(inputField, tiktokUrl);
                        inputField.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                    // Se estiver correto, inicia contagem de estabilidade
                    else {
                        let stability = parseInt(inputField.getAttribute('data-stability-count') || '0');
                        stability++;
                        inputField.setAttribute('data-stability-count', stability);

                        // Se estável por 3 ciclos (~300ms), autoriza o clique
                        if (stability >= 3) {
                            clicked = true;
                            clearInterval(autoLoad);
                            searchButton.click();

                            setTimeout(() => {
                                window.history.replaceState({}, document.title, "/");
                            }, 1000);
                        }
                    }
                }
            }, 100);
        }
    }
})();