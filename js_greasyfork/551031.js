// ==UserScript==
// @name              Search Selected Text Ctrl+Alt+1 Google
// @name:zh-TW        選取文字後Ctrl+Alt+1搜尋Google
// @name:zh-CN        选取文字后Ctrl+Alt+1搜索Google
// @name:en           Search Selected Text Ctrl+Alt+1 Google
// @name:fr           Rechercher sur Google après sélection Ctrl+Alt+1
// @name:es           Buscar en Google tras seleccionar Ctrl+Alt+1
// @name:it           Cerca su Google dopo aver selezionato Ctrl+Alt+1
// @name:de           Suche in Google nach Textauswahl Ctrl+Alt+1
// @name:ko           텍스트 선택 후 Ctrl+Alt+1 구글 검색
// @name:ja           テキスト選択後Ctrl+Alt+1でGoogle検索
// @name:pt           Pesquisar no Google após selecionar Ctrl+Alt+1
// @name:ru           Поиск в Google после выделения текста Ctrl+Alt+1
// @name:ar           البحث في Google بعد تحديد النص Ctrl+Alt+1
// @name:hi           टेक्स्ट चुनने के बाद Ctrl+Alt+1 दबाएँ Google खोजें
// @name:bn           টেক্সট নির্বাচন করার পর Ctrl+Alt+1 চাপুন Google অনুসন্ধান
// @name:th           ค้นหาใน Google หลังเลือกข้อความ Ctrl+Alt+1
// @name:vi           Sau khi chọn văn bản nhấn Ctrl+Alt+1 để tìm trên Google
// @name:tr           Metni seçtikten sonra Ctrl+Alt+1 ile Google’da ara

// @description       After selecting text, press Ctrl+Alt+1 to search directly on Google.
// @description:zh-CN 选取文字后，按下 Ctrl+Alt+1 就能直接在 Google 搜索。
// @description:zh-TW 選取文字後，按下 Ctrl+Alt+1 就能直接在 Google 搜尋。
// @description:en    After selecting text, press Ctrl+Alt+1 to search directly on Google.
// @description:fr    Après avoir sélectionné le texte, appuyez sur Ctrl+Alt+1 pour rechercher directement sur Google.
// @description:es    Después de seleccionar el texto, presiona Ctrl+Alt+1 para buscar directamente en Google.
// @description:it    Dopo aver selezionato il testo, premi Ctrl+Alt+1 per cercare direttamente su Google.
// @description:de    Nachdem Sie den Text markiert haben, drücken Sie Strg+Alt+1, um direkt bei Google zu suchen.
// @description:ko    텍스트를 선택한 후 Ctrl+Alt+1을 누르면 Google에서 바로 검색할 수 있습니다.
// @description:ja    テキストを選択した後、Ctrl+Alt+1 を押して Google で直接検索します。
// @description:pt    Após selecionar o texto, pressione Ctrl+Alt+1 para pesquisar diretamente no Google.
// @description:ru    После выделения текста нажмите Ctrl+Alt+1, чтобы сразу искать в Google.
// @description:ar    بعد تحديد النص، اضغط Ctrl+Alt+1 للبحث مباشرة في Google.
// @description:hi    टेक्स्ट चुनने के बाद Ctrl+Alt+1 दबाएँ और सीधे Google पर खोजें。
// @description:bn    টেক্সট নির্বাচন করার পর Ctrl+Alt+1 চাপুন এবং সরাসরি Google-এ অনুসন্ধান করুন。
// @description:th    หลังจากเลือกข้อความแล้ว กด Ctrl+Alt+1 เพื่อค้นหาโดยตรงใน Google.
// @description:vi    Sau khi chọn văn bản, nhấn Ctrl+Alt+1 để tìm kiếm trực tiếp trên Google.
// @description:tr    Metni seçtikten sonra Ctrl+Alt+1 tuşuna basarak Google’da doğrudan arayın.

// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       You
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551031/Search%20Selected%20Text%20Ctrl%2BAlt%2B1%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/551031/Search%20Selected%20Text%20Ctrl%2BAlt%2B1%20Google.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.altKey && e.key === "1") {
            let selectedText = window.getSelection().toString().trim();
            if (selectedText) {
                let url = "https://www.google.com/search?q=" + encodeURIComponent(selectedText);
                window.open(url, '_blank'); // 在新分頁開啟搜尋
            }
        }
    });
})();