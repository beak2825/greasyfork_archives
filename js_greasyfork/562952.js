// ==UserScript==
// @name               Greasyfork Unlisted Detector
// @name:en            Greasyfork Unlisted Detector
// @name:en-GB         Greasyfork Unlisted Detector
// @name:fr            Détecteur de scripts non répertoriés Greasyfork
// @name:de            Greasyfork Unlisted-Erkenner
// @name:es            Detector de scripts no listados de Greasyfork
// @name:pt-BR         Detector de scripts não listados do Greasyfork
// @name:ru            Обнаружение скрытых скриптов Greasyfork
// @name:zh-CN         Greasyfork 未列出脚本检测器
// @name:zh-TW         Greasyfork 未列出指令碼偵測器
// @name:ja            Greasyfork 非公開スクリプト検出
// @name:ko            Greasyfork 비공개 스크립트 감지기
// @name:it            Rilevatore di script non elencati Greasyfork
// @name:nl            Greasyfork detector voor niet-vermelde scripts
// @name:pl            Wykrywacz niepublicznych skryptów Greasyfork
// @name:tr            Greasyfork liste dışı betik algılayıcı
//
// @description        Detects unlisted Greasyfork scripts by checking for a meta robots tag and highlights the script info section.
// @description:en     Detects unlisted Greasyfork scripts by checking for a meta robots tag and highlights the script info section.
// @description:fr     Détecte les scripts Greasyfork non répertoriés via la balise meta robots et met la section en évidence.
// @description:de     Erkennt nicht gelistete Greasyfork-Skripte anhand des Meta-Robots-Tags und hebt sie hervor.
// @description:es     Detecta scripts no listados de Greasyfork mediante la etiqueta meta robots.
// @description:pt-BR  Detecta scripts não listados do Greasyfork verificando a meta tag robots.
// @description:ru     Определяет скрытые скрипты Greasyfork по meta robots и выделяет информацию.
// @description:zh-CN  通过 meta robots 标签检测 Greasyfork 未列出的脚本并高亮显示。
// @description:zh-TW  透過 meta robots 標籤偵測 Greasyfork 未列出指令碼。
// @description:ja     meta robots タグを使って非公開の Greasyfork スクリプトを検出します。
// @description:ko     meta robots 태그를 사용하여 Greasyfork 비공개 스크립트를 감지합니다.
// @description:it     Rileva script Greasyfork non elencati tramite il tag meta robots.
// @description:nl     Detecteert niet-vermelde Greasyfork-scripts via de meta robots-tag.
// @description:pl     Wykrywa niepubliczne skrypty Greasyfork za pomocą meta robots.
// @description:tr     Meta robots etiketiyle Greasyfork liste dışı betikleri algılar.
//
// @namespace    https://greasyfork.org/
// @version      1.0
// @match        https://greasyfork.org/*/scripts/*
// @match        https://greasyfork.org/scripts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @author       beak2825 / jarivivi / perosonsybs@gmail.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562952/Greasyfork%20Unlisted%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/562952/Greasyfork%20Unlisted%20Detector.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // Check if the page has a meta name="robots"
    const hasRobotsMeta = !!document.querySelector('meta[name="robots"]');

    if (!hasRobotsMeta) return;

    // Wait for the #script-info section to exist, then style it
    function styleScriptInfo() {
        const section = document.querySelector('#script-info');
        if (section) {
            section.style.backgroundColor = 'darkgreen';
            section.style.color = 'white';
        }
    }

    // Run once now
    styleScriptInfo();

    // Also observe DOM changes in case #script-info is added later
    const observer = new MutationObserver(styleScriptInfo);
    observer.observe(document.documentElement, { childList: true, subtree: true });
})();
