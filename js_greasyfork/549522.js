// ==UserScript==
// @name         YouTube Full View Count and Upload Date
// @name:es      YouTube Conteo Completo de Vistas y Fecha de Carga
// @name:fr      YouTube Nombre Complet de Vues et Date de Téléchargement
// @name:de      YouTube Vollständige Aufrufanzahl und Upload-Datum
// @name:it      YouTube Conteggio Completo delle Visualizzazioni e Data di Caricamento
// @name:pt      YouTube Contagem Completa de Visualizações e Data de Upload
// @name:ru      YouTube Полный Счёт Просмотров и Дата Загрузки
// @name:zh-CN   YouTube 完整查看次数和上传日期
// @name:ja      YouTube 完全視聴回数とアップロード日
// @name:ko      YouTube 전체 조회수 및 업로드 날짜
// @name:nl      YouTube Volledige Weergavetelling en Upload-Datum
// @namespace    https://greasyfork.org/users/1514993-wewe
// @version      1.05
// @description  Displays full view count and upload date (Without time - On video pages only).
// @description:es Muestra el conteo completo de vistas y la fecha de carga (Sin hora - Solo en páginas de video).
// @description:fr Affiche le nombre complet de vues et la date de téléchargement (Sans heure - Sur les pages vidéo seulement).
// @description:de Zeigt die vollständige Aufrufanzahl und das Upload-Datum an (Ohne Uhrzeit - Nur auf Videoseiten).
// @description:it Visualizza il conteggio completo delle visualizzazioni e la data di caricamento (Senza orario - Solo sulle pagine video).
// @description:pt Exibe a contagem completa de visualizações e a data de upload (Sem hora - Apenas em páginas de vídeo).
// @description:ru Отображает полный счёт просмотров и дату загрузки (Без времени - Только на страницах видео).
// @description:zh-CN 显示完整查看次数和上传日期 (无时间 - 仅在视频页面).
// @description:ja 完全視聴回数とアップロード日を表示 (時間なし - ビデオページのみ).
// @description:ko 전체 조회수 및 업로드 날짜 표시 (시간 없음 - 비디오 페이지에서만).
// @description:nl Toont de volledige weergavetelling en upload-datum (Zonder tijd - Alleen op videopagina's).
// @author       ^wewe
// @match        http*://*.youtube.com/watch?v=*
// @grant        none
// @license      CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @copyright    2025 ^wewe
// @downloadURL https://update.greasyfork.org/scripts/549522/YouTube%20Full%20View%20Count%20and%20Upload%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/549522/YouTube%20Full%20View%20Count%20and%20Upload%20Date.meta.js
// ==/UserScript==

/*
THE SOFTWARE PROVIDES NO WARRANTY AND IS PROVIDED "AS IS." THE AUTHOR IS NOT LIABLE OR RESPONSIBLE FOR ANY DAMAGES ARISING FROM ITS USE.
*/

/*
Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License

Copyright (c) 2025 by ^wewe

You are free to:
- Share: copy and redistribute the material in any medium or format
- Adapt: remix, transform, and build upon the material

Under the following terms:
- Attribution: You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
- NonCommercial: You may not use the material for commercial purposes.
- ShareAlike: If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.
- No additional restrictions: You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.

No warranties are given. The license does not grant trademark rights or permissions for publicity/privacy rights. The licensor is not liable for damages. Private use is explicitly permitted. When distributing, the source code (this userscript) must be included.

See the full license text at: https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
*/

(function() {
    'use strict';

    let lastInfoText = '';

    function updateMetadata() {
        const infoEl = document.querySelector('#info-container #info');
        if (!infoEl) return;

        const text = infoEl.textContent.trim();
        if (text === lastInfoText) return;

        const tooltipEl = document.querySelector('tp-yt-paper-tooltip.style-scope.ytd-watch-info-text #tooltip');
        if (!tooltipEl) return;

        let fullTooltip = tooltipEl.textContent.trim();
        const parts = fullTooltip.split('•').map(part => part.trim());

        if (parts.length < 2) return;

        const spans = infoEl.querySelectorAll('span');
        if (spans.length < 3) return;
        spans[0].textContent = parts[0];
        spans[2].textContent = parts[1];

        lastInfoText = infoEl.textContent.trim();
    }

    // Run periodically to handle page loads and video changes
    setInterval(updateMetadata, 1000);
})();