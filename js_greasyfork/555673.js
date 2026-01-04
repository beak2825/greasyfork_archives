// ==UserScript==
// @name         Mistral AI Chat Exporter
// @name:en      Mistral AI Chat Exporter
// @name:zh      Mistral AI 聊天导出器
// @name:zh-CN   Mistral AI 聊天导出器
// @name:zh-TW   Mistral AI 聊天匯出器
// @name:ja      Mistral AI チャットエクスポーター
// @name:es      Exportador de Chat de Mistral AI
// @name:fr      Exportateur de Chat Mistral AI
// @name:de      Mistral AI Chat-Exporteur
// @name:it      Esportatore Chat Mistral AI
// @name:ru      Экспортёр чата Mistral AI
// @name:pt      Exportador de Chat Mistral AI
// @name:ko      Mistral AI 채팅 내보내기
// @name:ar      مصدر دردشة Mistral AI
// @name:hi      Mistral AI चैट निर्यातक
// @name:el      Εξαγωγέας Συνομιλιών Mistral AI
// @description  Export Mistral AI chat conversations to markdown
// @description:en Export Mistral AI chat conversations to markdown format
// @description:zh 导出Mistral AI聊天对话为Markdown格式
// @description:zh-CN 导出Mistral AI聊天对话为Markdown格式
// @description:zh-TW 匯出 Mistral AI 聊天對話為 Markdown 格式
// @description:ja Mistral AIのチャット会話をMarkdown形式でエクスポート
// @description:es Exportar conversaciones de chat de Mistral AI a formato markdown
// @description:fr Exporter les conversations de chat Mistral AI au format markdown
// @description:de Mistral AI Chat-Unterhaltungen in Markdown-Format exportieren
// @description:it Esporta conversazioni chat di Mistral AI in formato markdown
// @description:ru Экспорт разговоров чата Mistral AI в формат markdown
// @description:pt Exportar conversas de chat do Mistral AI para formato markdown
// @description:ko Mistral AI 채팅 대화를 마크다운 형식으로 내보내기
// @description:ar تصدير محادثات دردشة Mistral AI إلى تنسيق markdown
// @description:hi Mistral AI चैट वार्तालापों को markdown प्रारूप में निर्यात करें
// @description:el Εξαγωγή συνομιλιών του Mistral AI σε μορφή markdown
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @author       aspen138
// @match        https://chat.mistral.ai/chat/*
// @grant        none
// @license      MIT
// @icon         data:image/x-icon;base64,AAABAAMAEBAAAAEAIABoBAAANgAAACAgAAABACAAKBEAAJ4EAAAwMAAAAQAgAGgmAADGFQAAKAAAABAAAAAgAAAAAQAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALgXAAD34IAA9+CAAPfggAD34IAA9+CAATgdAAAAAAAAAAAAATgdAAD34IAA9+CAAPfggAD34IAA9+CAALgXAAE4bUABeH/AAXh/wAF4f8ABeH/AAXh/wAE4OUAAAAAAAAAAAAE4OUABeH/AAXh/wAF4f8ABeH/AAXh/wAE4bUABOB+AATgsQIR5dgEG+f+Axbm5gAE4LEAB+GmDU74Tg1O+E4AB+GmAATgsQMW5uYEG+f+AhHl2AAE4LEABOB+AAAAAAAAAAANTvmCD1D6/w5P+bEAAAAACU71Gg9Q+v8PUPr/CU71GgAAAAAOT/mxD1D6/w1O+YIAAAAAAAAAAAAAAAAAAAAADVP7gQ5U+f4MVfq4AH//GgVo+TEOVPn+DlT5/gVo+TEAf/8aDFX6uA5U+f4NU/uBAAAAAAAAAAAAAAAAAAAAAAOB/4IFgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//A4H/ggAAAAAAAAAAAAAAAAAAAAADgf+CBYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wOB/4IAAAAAAAAAAAAAAAAAAAAAAKr/gQCp//4Aqf/+AKn//gCp/+YAf/8aAH//GgCp/+YAqf/+AKn//gCp//4Aqv+BAAAAAAAAAAAAAAAAAAAAAACu/4IAr///AK///wCv//8Arv/lAAAAAAAAAAAArv/lAK///wCv//8Ar///AK7/ggAAAAAAAAAAAAAAAAAAAAAAyf+BAMn//gDG/8gArf9OAK7/RgAAAAAAAAAAAK7/RgCt/04Axv/IAMn//gDJ/4EAAAAAAAAAAAAAAAAAAAAAANX/ggDX//8A1v+xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANb/sQDX//8A1f+CAAAAAAAAAAAAAAAAAAAAAADU/0IA1f+CANT/WgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADU/1oA1f+CANT/QgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKAAAACAAAABAAAAAAQAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB/AgAAzAUAAMwFAADMBQAAzAUAAMwFAADMBQAAzAUAAMwFAADMBQAAzAUAAMwFAADMBQAAvwQAAAAAAAAAAAAA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AAAAAAAAAAAAAADV/2MA1///ANf//wDX//8A1///AMz/BQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMz/BQDX//8A1///ANf//wDX//8A1f9jAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANX/YwDX//8A1///ANf//wDX//8AzP8FAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMz/BQDM/wUAzP8FAMz/BQD//wEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8BAMz/BQDM/wUAzP8FAMz/BQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKAAAADAAAABgAAAAAQAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8BAAD/AQAA/wEAAP8BAAD/AQAA/wEAAP8BAAD/AQAA/wEAAP8BAAD/AQAA/wEAAP8BAAD/AQAA/wEAAP8BAAD/AQAA/wEAAP8BAAD/AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wEAAP8BAAD/AQAA/wEAAP8BAAD/AQAA/wEAAP8BAAD/AQAA/wEAAP8BAAD/AQAA/wEAAP8BAAD/AQAA/wEAAP8BAAD/AQAA/wEAAP8BAAAAAAAA2g4ABOF6AAPihAAD4oQAA+KEAAPihAAD4oQAA+KEAAPihAAD4oQAA+KEAAPihAAD4oQAA+KEAAPihAAD4oQAA+KEAAPihAAD4oQAA+KEAALiWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4VUAA+KEAAPihAAD4oQAA+KEAAPihAAD4oQAA+KEAAPihAAD4oQAA+KEAAPihAAD4oQAA+KEAAPihAAD4oQAA+KEAAPihAAD4oQABOF6AADaFQAA4hsABODsAAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAThqgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE36QABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABODsAADlKAAA4hsABODsAAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAThqgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE36QABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABODsAADlKAAA4hsABODsAAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAThqgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE36QABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABODsAADlKAAA4hsABODsAAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAThqgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE36QABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABODsAADlKAAA4hsABODsAAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAThqgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE36QABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF4f8ABeH/AAXh/wAF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//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Dgf+EAAD/AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wEDgf+EBYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Dgf+EAAD/AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wEDgf+EBYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Dgf+EAAD/AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wEDgf+EBYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Dgf+EAAD/AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wEDgf+EBYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Fgv//BYL//wWC//8Dgf+EAAD/AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wEAnv+CAZ//+wGf//sBn//7AZ//+wGf//sBn//7AZ//+wGf//sBn//7AZ//+wGf//sBn//7AZr/xAOC/1QDgv9UA4L/VAOC/1QDgv9UA4L/VAGa/8ABn//7AZ//+wGf//sBn//7AZ//+wGf//sBn//7AZ//+wGf//sBn//7AZ//+wGf//sAnv+CAP//AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wEAr/+EAK///wCv//8Ar///AK///wCv//8Ar///AK///wCv//8Ar///AK///wCv//8Ar///AK//qgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACu/6QAr///AK///wCv//8Ar///AK///wCv//8Ar///AK///wCv//8Ar///AK///wCv//8Ar/+EAP//AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wEAr/+EAK///wCv//8Ar///AK///wCv//8Ar///AK///wCv//8Ar///AK///wCv//8Ar///AK//qgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACu/6QAr///AK///wCv//8Ar///AK///wCv//8Ar///AK///wCv//8Ar///AK///wCv//8Ar/+EAP//AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wEAr/+EAK///wCv//8Ar///AK///wCv//8Ar///AK///wCv//8Ar///AK///wCv//8Ar///AK//qgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACu/6QAr///AK///wCv//8Ar///AK///wCv//8Ar///AK///wCv//8Ar///AK///wCv//8Ar/+EAP//AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wEAr/+EAK///wCv//8Ar///AK///wCv//8Ar///AK///wCv//8Ar///AK///wCv//8Ar///AK//qgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACu/6QAr///AK///wCv//8Ar///AK///wCv//8Ar///AK///wCv//8Ar///AK///wCv//8Ar/+EAP//AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wEAr/+EAK///wCv//8Ar///AK///wCv//8Ar///AK///wCv//8Ar///AK///wCv//8Ar///AK//qgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACu/6QAr///AK///wCv//8Ar///AK///wCv//8Ar///AK///wCv//8Ar///AK///wCv//8Ar/+EAP//AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wEAs/+EALT//gC0//4AtP/+ALT//gC0//4As//6AK7/3wCv/9kAr//ZAK//2QCv/9kAr//ZAK//kQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACu/4wAr//ZAK//2QCv/9kAr//ZAK//2QCv/90As//6ALT//gC0//4AtP/+ALT//gC0//4As/+EAP//AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wEA0v+DANH//QDR//0A0f/9ANH//QDR//0A0v/jAMT/PQCt/xwArf8cAK3/HACt/xwArf8cALj/EgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACq/xIArf8cAK3/HACt/xwArf8cAK3/HAC8/zIA0v/jANH//QDR//0A0f/9ANH//QDR//0A0v+DAP//AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wEA1v+EANf//wDX//8A1///ANf//wDX//8A1//iANX/JQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADU/xgA1//iANf//wDX//8A1///ANf//wDX//8A1v+EAP//AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wEA1v+EANf//wDX//8A1///ANf//wDX//8A1//iANX/JQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADU/xgA1//iANf//wDX//8A1///ANf//wDX//8A1v+EAP//AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wEA1v+EANf//wDX//8A1///ANf//wDX//8A1//iANX/JQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADU/xgA1//iANf//wDX//8A1///ANf//wDX//8A1v+EAP//AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wEA1v+EANf//wDX//8A1///ANf//wDX//8A1//iANX/JQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADU/xgA1//iANf//wDX//8A1///ANf//wDX//8A1v+EAP//AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wEA1v+EANf//wDX//8A1///ANf//wDX//8A1//iANX/JQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADU/xgA1//iANf//wDX//8A1///ANf//wDX//8A1v+EAP//AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1f9EANb/hADW/4QA1v+EANb/hADW/4QA1/91ANb/EwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADU/wwA1/91ANb/hADW/4QA1v+EANb/hADW/4QA1f9EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//AQD//wEA//8BAP//AQD//wEAAP8BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8BAP//AQD//wEA//8BAP//AQD//wEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==
// @downloadURL https://update.greasyfork.org/scripts/555673/Mistral%20AI%20Chat%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/555673/Mistral%20AI%20Chat%20Exporter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Create export button
    function createExportButton() {
        if (document.getElementById('mistral-export-button')) return;

        const button = document.createElement('button');
        button.id = 'mistral-export-button';
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export
        `;

        // Default fallback styles
        let styles = {
            position: 'fixed',
            top: '0.5rem',
            right: '5.5rem', // Positioned to the left of the user profile/menu usually in top right
            zIndex: '9999',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 12px',
            backgroundColor: '#fff', // Fallback
            color: '#000',      // Fallback
            border: '1px solid #e5e5e5', // Fallback
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
        };

        // element to mimic (look for a button in the header or shared styles)
        // Trying to find a "Share" button or similar secondary button in the header
        const selectorsToTry = [
            'header button[class*="secondary"]',
            'header button',
            'button[aria-label="New chat"]',
            '.flex.gap-2 button'
        ];

        let referenceBtn = null;
        for (const sel of selectorsToTry) {
            const found = document.querySelector(sel);
            if (found && found.offsetParent !== null) { // Check if visible
                referenceBtn = found;
                break;
            }
        }

        // If we found a reference button, try to copy its computed styles
        if (referenceBtn) {
            try {
                const computed = window.getComputedStyle(referenceBtn);
                styles.backgroundColor = computed.backgroundColor;
                styles.color = computed.color;
                styles.borderRadius = computed.borderRadius;
                styles.fontFamily = computed.fontFamily;
                styles.fontSize = computed.fontSize;
                styles.border = computed.border;
                // If the reference button has no border, keep our default or check box-shadow
                if (computed.borderWidth === '0px' && !computed.boxShadow) {
                    styles.border = '1px solid transparent'; // Mimic clean look but ensure visibility if transparent bg
                }

                // If background is transparent, it might be an icon-only button or rely on parents.
                // In that case, we might want to default to a "surface" look.
                if (computed.backgroundColor === 'rgba(0, 0, 0, 0)' || computed.backgroundColor === 'transparent') {
                    styles.backgroundColor = '#ffffff';
                    styles.border = '1px solid #e5e7eb';
                }
            } catch (e) {
                console.warn('Mistral Exporter: Could not copy styles', e);
            }
        }

        // Apply styles
        Object.assign(button.style, styles);

        // Add hover effect logic manually since we can't easily copy :hover state
        button.onmouseover = () => {
            button.style.opacity = '0.9';
            button.style.transform = 'translateY(-1px)';
        };
        button.onmouseout = () => {
            button.style.opacity = '1';
            button.style.transform = 'translateY(0)';
        };

        button.onclick = exportChat;
        document.body.appendChild(button);
    }

    // Function to extract text content from code blocks
    function extractCodeContent(codeElement) {
        const codeText = codeElement.querySelector('code');
        if (codeText) {
            return codeText.textContent || codeText.innerText;
        }
        return codeElement.textContent || codeElement.innerText;
    }

    // Function to process message content and convert to markdown
    function processMessageContent(contentDiv) {
        let markdown = '';

        // Handle different types of content
        const children = contentDiv.children;

        for (let i = 0; i < children.length; i++) {
            const child = children[i];

            // Handle paragraphs
            if (child.tagName === 'P') {
                const textContent = child.textContent || child.innerText;
                if (textContent.trim()) {
                    markdown += textContent.trim() + '\n\n';
                }
            }

            // Handle code blocks
            else if (child.tagName === 'PRE') {
                const codeContent = extractCodeContent(child);
                const languageElement = child.querySelector('[class*="language-"]');
                let language = '';

                if (languageElement) {
                    const classList = languageElement.className;
                    const match = classList.match(/language-(\w+)/);
                    if (match) {
                        language = match[1];
                    }
                }

                // Also check for language indicators in header
                const headerSpan = child.querySelector('span.text-xs.capitalize');
                if (headerSpan && !language) {
                    language = headerSpan.textContent || '';
                }

                markdown += '```' + language + '\n' + codeContent.trim() + '\n```\n\n';
            }

            // Handle headings
            else if (child.tagName && child.tagName.match(/^H[1-6]$/)) {
                const level = parseInt(child.tagName.charAt(1));
                const headingText = child.textContent || child.innerText;
                markdown += '#'.repeat(level) + ' ' + headingText.trim() + '\n\n';
            }

            // Handle lists
            else if (child.tagName === 'UL') {
                const listItems = child.querySelectorAll('li');
                listItems.forEach(li => {
                    const itemText = li.textContent || li.innerText;
                    markdown += '- ' + itemText.trim() + '\n';
                });
                markdown += '\n';
            }

            else if (child.tagName === 'OL') {
                const listItems = child.querySelectorAll('li');
                listItems.forEach((li, index) => {
                    const itemText = li.textContent || li.innerText;
                    markdown += `${index + 1}. ` + itemText.trim() + '\n';
                });
                markdown += '\n';
            }

            // Handle other elements by extracting text
            else {
                const textContent = child.textContent || child.innerText;
                if (textContent.trim()) {
                    markdown += textContent.trim() + '\n\n';
                }
            }
        }

        return markdown.trim();
    }

    // Main export function
    function exportChat() {
        try {
            // Find all message containers
            const messageContainers = document.querySelectorAll('[data-message-author-role]');

            if (messageContainers.length === 0) {
                alert('No messages found to export. Make sure you are on a chat page with messages.');
                return;
            }

            let markdown = '# Mistral AI Chat Export\n\n';
            markdown += `**Exported on:** ${new Date().toLocaleString()}\n\n`;
            markdown += '---\n\n';

            messageContainers.forEach((container, index) => {
                const role = container.getAttribute('data-message-author-role');
                const messageId = container.getAttribute('data-message-id');

                // Find the timestamp
                let timestamp = '';
                const timestampElement = container.querySelector('.text-sm.text-hint');
                if (timestampElement) {
                    timestamp = timestampElement.textContent || timestampElement.innerText;
                }

                // Find the message content
                let content = '';

                if (role === 'user') {
                    // User messages - look for select-text content
                    const userContent = container.querySelector('.select-text');
                    if (userContent) {
                        // Handle user messages with potential code blocks
                        const spans = userContent.querySelectorAll('span.whitespace-pre-wrap');
                        let userText = '';
                        let inCodeBlock = false;
                        let codeLanguage = '';

                        spans.forEach(span => {
                            const text = span.textContent || span.innerText;
                            if (text === '```') {
                                if (!inCodeBlock) {
                                    inCodeBlock = true;
                                    userText += '```';
                                } else {
                                    inCodeBlock = false;
                                    userText += '\n```\n';
                                }
                            } else {
                                if (inCodeBlock) {
                                    userText += text + '\n';
                                } else {
                                    userText += text;
                                }
                            }
                        });

                        content = userText.trim();
                    }
                } else if (role === 'assistant') {
                    // Assistant messages - look for markdown container
                    const markdownContainer = container.querySelector('.markdown-container-style');
                    if (markdownContainer) {
                        content = processMessageContent(markdownContainer);
                    }
                }

                // Add message to markdown
                if (content) {
                    const roleTitle = role === 'user' ? '👤 User' : '🤖 Assistant';
                    markdown += `## ${roleTitle}`;
                    if (timestamp) {
                        markdown += ` *(${timestamp})*`;
                    }
                    markdown += '\n\n';
                    markdown += content + '\n\n';
                    markdown += '---\n\n';
                }
            });

            // Create and download file
            const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;

            // Generate filename with current date
            const now = new Date();
            const dateStr = now.toISOString().split('T')[0];
            const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
            a.download = `mistral-chat-${dateStr}_${timeStr}.md`;

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            // Show success message
            const successMsg = document.createElement('div');
            successMsg.innerText = '✅ Chat exported successfully!';
            successMsg.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 10px 15px;
                border-radius: 8px;
                z-index: 10000;
                font-weight: 600;
                animation: fadeInOut 3s ease-in-out;
            `;

            // Add CSS animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translateY(-10px); }
                    20%, 80% { opacity: 1; transform: translateY(0); }
                    100% { opacity: 0; transform: translateY(-10px); }
                }
            `;
            document.head.appendChild(style);

            document.body.appendChild(successMsg);
            setTimeout(() => {
                if (document.body.contains(successMsg)) {
                    document.body.removeChild(successMsg);
                }
            }, 3000);

        } catch (error) {
            console.error('Export error:', error);
            alert('An error occurred while exporting the chat. Please check the console for details.');
        }
    }

    // Initialize the script when page loads
    function init() {
        // Wait for the page to load completely
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // Add a small delay to ensure all elements are rendered
        setTimeout(() => {
            createExportButton();
        }, 2000);
    }

    // Start initialization
    init();

    // Also handle navigation changes (for SPAs)
    let currentUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== currentUrl) {
            currentUrl = location.href;
            // Re-initialize on page change
            setTimeout(() => {
                if (!document.querySelector('button:contains("📝 Export to MD")')) {
                    createExportButton();
                }
            }, 2000);
        }
    }).observe(document, { subtree: true, childList: true });

})();