// ==UserScript==
// @name                CodeDown
// @name:pt-BR          CodeDown
// @name:zh-CN          CodeDown
// @name:zh-TW          CodeDown
// @name:fr-CA          CodeDown
// @name:ckb            CodeDown
// @name:ar             CodeDown
// @name:be             CodeDown
// @name:bg             CodeDown
// @name:cs             CodeDown
// @name:da             CodeDown
// @name:de             CodeDown
// @name:el             CodeDown
// @name:en             CodeDown
// @name:eo             CodeDown
// @name:es             CodeDown
// @name:fi             CodeDown
// @name:fr             CodeDown
// @name:he             CodeDown
// @name:hr             CodeDown
// @name:hu             CodeDown
// @name:id             CodeDown
// @name:it             CodeDown
// @name:ja             CodeDown
// @name:ka             CodeDown
// @name:ko             CodeDown
// @name:mr             CodeDown
// @name:nb             CodeDown
// @name:nl             CodeDown
// @name:pl             CodeDown
// @name:ro             CodeDown
// @name:ru             CodeDown
// @name:sk             CodeDown
// @name:sr             CodeDown
// @name:sv             CodeDown
// @name:th             CodeDown
// @name:tr             CodeDown
// @name:uk             CodeDown
// @name:ug             CodeDown
// @name:vi             CodeDown
// @namespace           https://github.com/0H4S
// @version             1.5
// @description         Add download buttons to code blocks across ChatGPT, Z.Ai, Gemini, LMArena, Kimi, Le Chat, Meta AI, Copilot, Grok, and LongCat. Save snippets as ready-to-use files and organize multiple downloads with an advanced management menu.
// @description:pt-BR   Adicione botões de download aos blocos de código do ChatGPT, Z.Ai, Gemini, LMArena, Kimi, Le Chat, Meta AI, Copilot, Grok e LongCat. Exporte trechos de código como arquivos prontos para uso e gerencie downloads em massa com um menu avançado.
// @description:zh-CN   为 ChatGPT、Z.Ai、Gemini、LMArena、Kimi、Le Chat、Meta AI、Copilot、Grok 和 LongCat 的代码块添加下载按钮。将代码片段保存为即用型文件，并通过高级菜单高效管理批量下载。
// @description:zh-TW   為 ChatGPT、Z.Ai、Gemini、LMArena、Kimi、Le Chat、Meta AI、Copilot、Grok 和 LongCat 的程式碼區塊新增下載按鈕。將程式碼片段儲存為即用型檔案，並透過進階選單高效管理批量下載。
// @description:fr-CA   Ajoutez des boutons de téléchargement aux blocs de code de ChatGPT, Z.Ai, Gemini, LMArena, Kimi, Le Chat, Meta AI, Copilot, Grok et LongCat. Enregistrez les extraits de code sous forme de fichiers prêts à l'emploi et gérez les téléchargements en masse via un menu avancé.
// @description:ckb     دوگمەی دابەزاندن زیاد بکە بۆ بلۆکەکانی کۆد لە ChatGPT, Z.Ai, Gemini, LMArena, Kimi, Le Chat, Meta AI, Copilot, Grok و LongCat. پارچە کۆدەکان وەک پەڕگەی ئامادە بۆ بەکارهێنان خەزن بکە و بەڕێوەبردنی دابەزاندنی بەکۆمەڵ لە ڕێگەی مینیوێکی پێشکەوتووەوە ئەنجام بدە.
// @description:ar      أضف أزرار تنزيل إلى كتل الكود في ChatGPT و Z.Ai و Gemini و LMArena و Kimi و Le Chat و Meta AI و Copilot و Grok و LongCat. احفظ مقتطفات الكود كملفات جاهزة للاستخدام ونظّم التنزيلات الجماعية من خلال قائمة إدارة متقدمة.
// @description:be      Дадайце кнопкі спампоўкі ў блокі кода на ChatGPT, Z.Ai, Gemini, LMArena, Kimi, Le Chat, Meta AI, Copilot, Grok і LongCat. Захоўвайце фрагменты кода як файлы, гатовыя да выкарыстання, і кіруйце масавымі спампоўкамі праз пашыранае меню.
// @description:bg      Добавете бутони за изтегляне към кодовите блокове в ChatGPT, Z.Ai, Gemini, LMArena, Kimi, Le Chat, Meta AI, Copilot, Grok и LongCat. Запазвайте кодови фрагменти като готови за употреба файлове и управлявайте масови изтегляния чрез разширено меню.
// @description:cs      Přidejte tlačítka pro stahování do kódových bloků na ChatGPT, Z.Ai, Gemini, LMArena, Kimi, Le Chat, Meta AI, Copilot, Grok a LongCat. Ukládejte fragmenty kódu jako soubory připravené k použití a spravujte hromadné stahování pomocí pokročilého menu.
// @description:da      Tilføj downloadknapper til kodeblokke på ChatGPT, Z.Ai, Gemini, LMArena, Kimi, Le Chat, Meta AI, Copilot, Grok og LongCat. Gem kodestykker som filer, der er klar til brug, og administrer massedownloads med en avanceret menu.
// @description:de      Fügen Sie Download-Buttons zu Code-Blöcken in ChatGPT, Z.Ai, Gemini, LMArena, Kimi, Le Chat, Meta AI, Copilot, Grok und LongCat hinzu. Speichern Sie Code-Snippets als gebrauchsfertige Dateien und verwalten Sie Massen-Downloads über ein erweitertes Menü.
// @description:el      Προσθέστε κουμπιά λήψης σε μπλοκ κώδικα στα ChatGPT, Z.Ai, Gemini, LMArena, Kimi, Le Chat, Meta AI, Copilot, Grok και LongCat. Αποθηκεύστε αποσπάσματα κώδικα ως έτοιμα προς χρήση αρχεία και διαχειριστείτε μαζικές λήψεις με ένα προηγμένο μενού.
// @description:en      Add download buttons to code blocks across ChatGPT, Z.Ai, Gemini, LMArena, Kimi, Le Chat, Meta AI, Copilot, Grok, and LongCat. Save snippets as ready-to-use files and organize multiple downloads with an advanced management menu.
// @description:eo      Aldonu elŝutbutonojn al kodblokoj en ChatGPT, Z.Ai, Gemini, LMArena, Kimi, Le Chat, Meta AI, Copilot, Grok kaj LongCat. Konservu kodpecojn kiel pretajn dosierojn kaj administru amasajn elŝutojn per altnivela menuo.
// @description:es      Agregue botones de descarga a los bloques de código en ChatGPT, Z.Ai, Gemini, LMArena, Kimi, Le Chat, Meta AI, Copilot, Grok y LongCat. Guarde fragmentos de código como archivos listos para usar y organice descargas masivas con un menú avanzado.
// @description:fi      Lisää latauspainikkeet koodilohkoihin ChatGPT:ssä, Z.Ai:ssa, Geminissä, LMArenassa, Kimissä, Le Chatissa, Meta AI:ssa, Copilotissa, Grokissa ja LongCatissa. Tallenna koodinpätkät käyttövalmiina tiedostoina ja hallitse massalatauksia edistyneen valikon avulla.
// @description:fr      Ajoutez des boutons de téléchargement aux blocs de code de ChatGPT, Z.Ai, Gemini, LMArena, Kimi, Le Chat, Meta AI, Copilot, Grok et LongCat. Enregistrez les extraits de code sous forme de fichiers prêts à l'emploi et gérez les téléchargements en masse via un menu avancé.
// @description:he      הוסף כפתורי הורדה לקוביות קוד ב-ChatGPT, Z.Ai, Gemini, LMArena, Kimi, Le Chat, Meta AI, Copilot, Grok ו-LongCat. שמור קטעי קוד כקבצים מוכנים לשימוש ונהל הורדות מרובות באמצעות תפריט ניהול מתקדם.
// @description:hr      Dodajte gumbe za preuzimanje u blokove koda na ChatGPT, Z.Ai, Gemini, LMArena, Kimi, Le Chat, Meta AI, Copilot, Grok i LongCat. Spremite isječke koda kao datoteke spremne za upotrebu i upravljajte masovnim preuzimanjima putem naprednog izbornika.
// @description:hu      Adjon hozzá letöltés gombokat a kódblokkokhoz a ChatGPT, Z.Ai, Gemini, LMArena, Kimi, Le Chat, Meta AI, Copilot, Grok és LongCat oldalakon. Mentse el a kódrészleteket használatra kész fájlokként, és kezelje a tömeges letöltéseket egy fejlett menüvel.
// @description:id      Tambahkan tombol unduh ke blok kode di ChatGPT, Z.Ai, Gemini, LMArena, Kimi, Le Chat, Meta AI, Copilot, Grok, dan LongCat. Simpan cuplikan kode sebagai file yang siap digunakan dan kelola unduhan massal dengan menu manajemen tingkat lanjut.
// @description:it      Aggiungi pulsanti di download ai blocchi di codice su ChatGPT, Z.Ai, Gemini, LMArena, Kimi, Le Chat, Meta AI, Copilot, Grok e LongCat. Salva i frammenti di codice come file pronti all'uso e gestisci i download di massa con un menu avanzato.
// @description:ja      ChatGPT、Z.Ai、Gemini、LMArena、Kimi、Le Chat、Meta AI、Copilot、Grok、LongCatのコードブロックにダウンロードボタンを追加します。コードスニペットを即座に使用できるファイルとして保存し、高度なメニューで一括ダウンロードを効率的に管理します。
// @description:ka      დაამატეთ ჩამოტვირთვის ღილაკები კოდის ბლოკებში ChatGPT, Z.Ai, Gemini, LMArena, Kimi, Le Chat, Meta AI, Copilot, Grok და LongCat-ზე. შეინახეთ კოდის ფრაგმენტები გამოსაყენებლად მზა ფაილების სახით და მართეთ მასიური ჩამოტვირთვები გაფართოებული მენიუთი.
// @description:ko      ChatGPT, Z.Ai, Gemini, LMArena, Kimi, Le Chat, Meta AI, Copilot, Grok 및 LongCat의 코드 블록에 다운로드 버튼을 추가하십시오. 코드 조각을 즉시 사용 가능한 파일로 저장하고 고급 메뉴를 통해 대량 다운로드를 효율적으로 관리하십시오.
// @description:mr      ChatGPT, Z.Ai, Gemini, LMArena, Kimi, Le Chat, Meta AI, Copilot, Grok आणि LongCat वरील कोड ब्लॉक्समध्ये डाउनलोड बटणे जोडा. कोड स्निपेट्स वापरण्यासाठी तयार फाइल म्हणून जतन करा आणि प्रगत मेनूद्वारे मोठ्या प्रमाणात डाउनलोड व्यवस्थापित करा.
// @description:nb      Legg til nedlastingsknapper i kodeblokker på ChatGPT, Z.Ai, Gemini, LMArena, Kimi, Le Chat, Meta AI, Copilot, Grok og LongCat. Lagre kodesnutter som filer klare til bruk og administrer massenedlastinger med en avansert meny.
// @description:nl      Voeg downloadknoppen toe aan codeblokken op ChatGPT, Z.Ai, Gemini, LMArena, Kimi, Le Chat, Meta AI, Copilot, Grok en LongCat. Sla codefragmenten op als bestanden die klaar zijn voor gebruik en beheer massadownloads met een geavanceerd menu.
// @description:pl      Dodaj przyciski pobierania do bloków kodu w ChatGPT, Z.Ai, Gemini, LMArena, Kimi, Le Chat, Meta AI, Copilot, Grok i LongCat. Zapisuj fragmenty kodu jako pliki gotowe do użycia i zarządzaj masowymi pobraniami za pomocą zaawansowanego menu.
// @description:ro      Adăugați butoane de descărcare la blocurile de cod din ChatGPT, Z.Ai, Gemini, LMArena, Kimi, Le Chat, Meta AI, Copilot, Grok și LongCat. Salvați fragmentele de cod ca fișiere gata de utilizare și gestionați descărcările în masă printr-un meniu avansat.
// @description:ru      Добавьте кнопки загрузки в блоки кода на ChatGPT, Z.Ai, Gemini, LMArena, Kimi, Le Chat, Meta AI, Copilot, Grok и LongCat. Сохраняйте фрагменты кода как готовые к использованию файлы и управляйте массовыми загрузками через расширенное меню.
// @description:sk      Pridajte tlačidlá na sťahovanie do blokov kódu na ChatGPT, Z.Ai, Gemini, LMArena, Kimi, Le Chat, Meta AI, Copilot, Grok a LongCat. Ukladajte fragmenty kódu ako súbory pripravené na použitie a spravujte hromadné sťahovanie pomocou pokročilého menu.
// @description:sr      Додајте дугмад за преузимање у блокове кода на ChatGPT, Z.Ai, Gemini, LMArena, Kimi, Le Chat, Meta AI, Copilot, Grok и LongCat. Сачувајте исечке кода као датотеке спремне за употребу и управљајте масовним преузимањима помоћу напредног менија.
// @description:sv      Lägg till nedladdningsknappar i kodblock på ChatGPT, Z.Ai, Gemini, LMArena, Kimi, Le Chat, Meta AI, Copilot, Grok och LongCat. Spara kodavsnitt som filer redo att användas och hantera massnedladdningar med en avancerad meny.
// @description:th      เพิ่มปุ่มดาวน์โหลดลงในบล็อกโค้ดบน ChatGPT, Z.Ai, Gemini, LMArena, Kimi, Le Chat, Meta AI, Copilot, Grok และ LongCat บันทึกข้อมูลโค้ดเป็นไฟล์พร้อมใช้งานและจัดการการดาวน์โหลดจำนวนมากด้วยเมนูขั้นสูง
// @description:tr      ChatGPT, Z.Ai, Gemini, LMArena, Kimi, Le Chat, Meta AI, Copilot, Grok ve LongCat üzerindeki kod bloklarına indirme butonları ekleyin. Kod parçacıklarını kullanıma hazır dosyalar olarak kaydedin ve gelişmiş bir menü ile toplu indirmeleri yönetin.
// @description:uk      Додайте кнопки завантаження до блоків коду на ChatGPT, Z.Ai, Gemini, LMArena, Kimi, Le Chat, Meta AI, Copilot, Grok та LongCat. Зберігайте фрагменти коду як готові до використання файли та керуйте масовими завантаженнями за допомогою розширеного меню.
// @description:ug      ChatGPT، Z.Ai، Gemini، LMArena، Kimi، Le Chat، Meta AI، Copilot، Grok ۋە LongCat تىكى كود بۆلەكلىرىگە چۈشۈرۈش كۇنۇپكىسى قوشۇڭ. كود پارچىلىرىنى ئىشلىتىشكە تەييار ھۆججەت سۈپىتىدە ساقلاڭ ۋە ئىلغار تىزىملىك ئارقىلىق كۆپ چۈشۈرۈشلەرنى باشقۇرۇڭ.
// @description:vi      Thêm nút tải xuống vào các khối mã trên ChatGPT, Z.Ai, Gemini, LMArena, Kimi, Le Chat, Meta AI, Copilot, Grok và LongCat. Lưu các đoạn mã dưới dạng tệp sẵn sàng để sử dụng và quản lý tải xuống hàng loạt với menu nâng cao.
// @author              OHAS
// @license             CC-BY-NC-ND-4.0
// @copyright           2025 OHAS. All Rights Reserved.
// @icon                https://cdn-icons-png.flaticon.com/512/8832/8832243.png
// @require             https://update.greasyfork.org/scripts/473358/1237031/JSZip.js
// @require             https://update.greasyfork.org/scripts/549920.js
// @match               https://copilot.microsoft.com/*
// @match               https://gemini.google.com/*
// @match               https://chat.mistral.ai/*
// @match               https://longcat.chat/*
// @match               https://www.kimi.com/*
// @match               https://www.meta.ai/*
// @match               https://chatgpt.com/*
// @match               https://lmarena.ai/*
// @match               https://chat.z.ai/*
// @match               https://grok.com/*
// @connect             gist.github.com
// @grant               GM_registerMenuCommand
// @grant               GM_xmlhttpRequest
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_addStyle
// @noframes
// @compatible          chrome
// @compatible          firefox
// @compatible          edge
// @compatible          opera
// @bgf-compatible      brave
// @bgf-colorLT         #02bc7d
// @bgf-colorDT         #02bc7d
// @bgf-copyright       [2025 OHAS. All Rights Reserved.](https://gist.github.com/0H4S/ae2fa82957a089576367e364cbf02438)
// @bgf-social          https://github.com/0H4S
// @contributionURL     https://linktr.ee/0H4S
// @downloadURL https://update.greasyfork.org/scripts/550714/CodeDown.user.js
// @updateURL https://update.greasyfork.org/scripts/550714/CodeDown.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // #region GLOBAL
    const SCRIPT_CONFIG = {
        notificationsUrl: 'https://gist.github.com/0H4S/3945fb0c57d988bd8d41fc560c433b50',
        scriptVersion: '1.5',
    };
    const notifier = new ScriptNotifier(SCRIPT_CONFIG);
    notifier.run();
    // #region TRADUÇÃO
    const translations = {
        'pt-br': {
            download:       'Baixar',
            downloadCode:   'Baixar código',
            managerTitle:   'Gerenciador CodeDown',
            managerButton:  '⬇️ Baixar Tudo',
            downloadZip:    'Baixar Selecionados (ZIP)',
            selectAll:      'Selecionar Todos',
            unselectAll:    'Desmarcar Todos',
            noCodeFound:    'Nenhum bloco de código encontrado nesta página.',
            close:          'Fechar',
            files:          'arquivos',
            scanning:       'Escaneando...',
            atalho:         'Atalho: <strong>Ctrl+Alt+S</strong>'
        },
        'zh-cn': {
            download:       '下载',
            downloadCode:   '下载代码',
            managerTitle:   'CodeDown 管理器',
            managerButton:  '⬇️ 下载全部',
            downloadZip:    '下载选中 (ZIP)',
            selectAll:      '全选',
            unselectAll:    '取消全选',
            noCodeFound:    '此页面未发现代码块。',
            close:          '关闭',
            files:          '文件',
            scanning:       '扫描中...',
            atalho:         '快捷键: <strong>Ctrl+Alt+S</strong>'
        },
        'ckb': {
            download:       'داگرتن',
            downloadCode:   'کۆدی داگرتن',
            managerTitle:   'بەڕێوەبەری CodeDown',
            managerButton:  '⬇️ داگرتنی هەمووی',
            downloadZip:    'داگرتنی دیاریکراوەکان (ZIP)',
            selectAll:      'دیاریکردنی هەمووی',
            unselectAll:    'لابردنی دیاریکردنی هەمووی',
            noCodeFound:    'هیچ کۆدێک لەم پەڕەیەدا نەدۆزرایەوە.',
            close:          'داخستن',
            files:          'پەڕگەکان',
            scanning:       'پشکنین...',
            atalho:         'قەدبڕ: <strong>Ctrl+Alt+S</strong>'
        },
        'ar': {
            download:       'تحميل',
            downloadCode:   'تحميل الكود',
            managerTitle:   'مدير CodeDown',
            managerButton:  '⬇️ تحميل الكل',
            downloadZip:    'تحميل المحدد (ZIP)',
            selectAll:      'تحديد الكل',
            unselectAll:    'إلغاء تحديد الكل',
            noCodeFound:    'لم يتم العثور على كود في هذه الصفحة.',
            close:          'إغلاق',
            files:          'ملفات',
            scanning:       'جاري المسح...',
            atalho:         'اختصار: <strong>Ctrl+Alt+S</strong>'
        },
        'be': {
            download:       'Спампаваць',
            downloadCode:   'Спампаваць код',
            managerTitle:   'Менеджэр CodeDown',
            managerButton:  '⬇️ Спампаваць усё',
            downloadZip:    'Спампаваць выбранае (ZIP)',
            selectAll:      'Вылучыць усё',
            unselectAll:    'Зняць вылучэнне',
            noCodeFound:    'Блокі кода на старонцы не знойдзены.',
            close:          'Закрыць',
            files:          'файлы',
            scanning:       'Сканаванне...',
            atalho:         'Спалучэнне клавіш: <strong>Ctrl+Alt+S</strong>'
        },
        'bg': {
            download:       'Изтегляне',
            downloadCode:   'Изтегляне на код',
            managerTitle:   'Мениджър CodeDown',
            managerButton:  '⬇️ Изтегли всички',
            downloadZip:    'Изтегли избраните (ZIP)',
            selectAll:      'Избери всички',
            unselectAll:    'Премахни избора',
            noCodeFound:    'На тази страница не са намерени кодови блокове.',
            close:          'Затвори',
            files:          'файлове',
            scanning:       'Сканиране...',
            atalho:         'Пряк път: <strong>Ctrl+Alt+S</strong>'
        },
        'cs': {
            download:       'Stáhnout',
            downloadCode:   'Stáhnout kód',
            managerTitle:   'Správce CodeDown',
            managerButton:  '⬇️ Stáhnout vše',
            downloadZip:    'Stáhnout vybrané (ZIP)',
            selectAll:      'Vybrat vše',
            unselectAll:    'Zrušit výběr',
            noCodeFound:    'Na této stránce nebyly nalezeny žádné bloky kódu.',
            close:          'Zavřít',
            files:          'soubory',
            scanning:       'Skenování...',
            atalho:         'Zkratka: <strong>Ctrl+Alt+S</strong>'
        },
        'da': {
            download:       'Download',
            downloadCode:   'Download kode',
            managerTitle:   'CodeDown Manager',
            managerButton:  '⬇️ Download alt',
            downloadZip:    'Download valgte (ZIP)',
            selectAll:      'Vælg alle',
            unselectAll:    'Fravælg alle',
            noCodeFound:    'Ingen kodeblokke fundet på denne side.',
            close:          'Luk',
            files:          'filer',
            scanning:       'Scanner...',
            atalho:         'Genvej: <strong>Ctrl+Alt+S</strong>'
        },
        'de': {
            download:       'Herunterladen',
            downloadCode:   'Code herunterladen',
            managerTitle:   'CodeDown Manager',
            managerButton:  '⬇️ Alles herunterladen',
            downloadZip:    'Ausgewählte herunterladen (ZIP)',
            selectAll:      'Alle auswählen',
            unselectAll:    'Auswahl aufheben',
            noCodeFound:    'Keine Codeblöcke auf dieser Seite gefunden.',
            close:          'Schließen',
            files:          'Dateien',
            scanning:       'Scannen...',
            atalho:         'Tastenkürzel: <strong>Ctrl+Alt+S</strong>'
        },
        'el': {
            download:       'Λήψη',
            downloadCode:   'Λήψη κώδικα',
            managerTitle:   'Διαχειριστής CodeDown',
            managerButton:  '⬇️ Λήψη όλων',
            downloadZip:    'Λήψη επιλεγμένων (ZIP)',
            selectAll:      'Επιλογή όλων',
            unselectAll:    'Αποεπιλογή όλων',
            noCodeFound:    'Δεν βρέθηκαν μπλοκ κώδικα σε αυτή τη σελίδα.',
            close:          'Κλείσιμο',
            files:          'αρχεία',
            scanning:       'Σάρωση...',
            atalho:         'Συντόμευση: <strong>Ctrl+Alt+S</strong>'
        },
        'en': {
            download:       'Download',
            downloadCode:   'Download code',
            managerTitle:   'CodeDown Manager',
            managerButton:  '⬇️ Download All',
            downloadZip:    'Download Selected (ZIP)',
            selectAll:      'Select All',
            unselectAll:    'Unselect All',
            noCodeFound:    'No code blocks found on this page.',
            close:          'Close',
            files:          'files',
            scanning:       'Scanning...',
            atalho:         'Shortcut: <strong>Ctrl+Alt+S</strong>'
        },
        'eo': {
            download:       'Elŝuti',
            downloadCode:   'Elŝuti kodon',
            managerTitle:   'CodeDown Administrilo',
            managerButton:  '⬇️ Elŝuti Ĉion',
            downloadZip:    'Elŝuti Elektitajn (ZIP)',
            selectAll:      'Elekti Ĉion',
            unselectAll:    'Malelekti Ĉion',
            noCodeFound:    'Neniuj kodblokoj trovitaj en ĉi tiu paĝo.',
            close:          'Fermi',
            files:          'dosieroj',
            scanning:       'Skanado...',
            atalho:         'Klavkombino: <strong>Ctrl+Alt+S</strong>'
        },
        'es': {
            download:       'Descargar',
            downloadCode:   'Descargar código',
            managerTitle:   'Gestor CodeDown',
            managerButton:  '⬇️ Descargar todo',
            downloadZip:    'Descargar seleccionados (ZIP)',
            selectAll:      'Seleccionar todo',
            unselectAll:    'Deseleccionar todo',
            noCodeFound:    'No se encontraron bloques de código en esta página.',
            close:          'Cerrar',
            files:          'archivos',
            scanning:       'Escaneando...',
            atalho:         'Atajo: <strong>Ctrl+Alt+S</strong>'
        },
        'fi': {
            download:       'Lataa',
            downloadCode:   'Lataa koodi',
            managerTitle:   'CodeDown-hallinta',
            managerButton:  '⬇️ Lataa kaikki',
            downloadZip:    'Lataa valitut (ZIP)',
            selectAll:      'Valitse kaikki',
            unselectAll:    'Poista valinnat',
            noCodeFound:    'Tältä sivulta ei löytynyt koodilohkoja.',
            close:          'Sulje',
            files:          'tiedostoa',
            scanning:       'Skannataan...',
            atalho:         'Pikanäppäin: <strong>Ctrl+Alt+S</strong>'
        },
        'fr': {
            download:       'Télécharger',
            downloadCode:   'Télécharger le code',
            managerTitle:   'Gestionnaire CodeDown',
            managerButton:  '⬇️ Tout télécharger',
            downloadZip:    'Télécharger la sélection (ZIP)',
            selectAll:      'Tout sélectionner',
            unselectAll:    'Tout désélectionner',
            noCodeFound:    'Aucun bloc de code trouvé sur cette page.',
            close:          'Fermer',
            files:          'fichiers',
            scanning:       'Analyse...',
            atalho:         'Raccourci : <strong>Ctrl+Alt+S</strong>'
        },
        'he': {
            download:       'הורד',
            downloadCode:   'הורד קוד',
            managerTitle:   'מנהל CodeDown',
            managerButton:  '⬇️ הורד הכל',
            downloadZip:    'הורד נבחרים (ZIP)',
            selectAll:      'בחר הכל',
            unselectAll:    'בטל בחירה',
            noCodeFound:    'לא נמצאו קטעי קוד בדף זה.',
            close:          'סגור',
            files:          'קבצים',
            scanning:       'סורק...',
            atalho:         'קיצור דרך: <strong>Ctrl+Alt+S</strong>'
        },
        'hr': {
            download:       'Preuzmi',
            downloadCode:   'Preuzmi kod',
            managerTitle:   'CodeDown Upravitelj',
            managerButton:  '⬇️ Preuzmi sve',
            downloadZip:    'Preuzmi odabrano (ZIP)',
            selectAll:      'Odaberi sve',
            unselectAll:    'Poništi odabir',
            noCodeFound:    'Na ovoj stranici nisu pronađeni blokovi koda.',
            close:          'Zatvori',
            files:          'datoteka',
            scanning:       'Skeniranje...',
            atalho:         'Prečac: <strong>Ctrl+Alt+S</strong>'
        },
        'hu': {
            download:       'Letöltés',
            downloadCode:   'Kód letöltése',
            managerTitle:   'CodeDown Kezelő',
            managerButton:  '⬇️ Összes letöltése',
            downloadZip:    'Kijelöltek letöltése (ZIP)',
            selectAll:      'Összes kijelölése',
            unselectAll:    'Kijelölés megszüntetése',
            noCodeFound:    'Nem található kódrészlet ezen az oldalon.',
            close:          'Bezárás',
            files:          'fájl',
            scanning:       'Keresés...',
            atalho:         'Gyorsbillentyű: <strong>Ctrl+Alt+S</strong>'
        },
        'id': {
            download:       'Unduh',
            downloadCode:   'Unduh kode',
            managerTitle:   'Manajer CodeDown',
            managerButton:  '⬇️ Unduh Semua',
            downloadZip:    'Unduh Terpilih (ZIP)',
            selectAll:      'Pilih Semua',
            unselectAll:    'Batal Pilih Semua',
            noCodeFound:    'Tidak ada blok kode ditemukan di halaman ini.',
            close:          'Tutup',
            files:          'berkas',
            scanning:       'Memindai...',
            atalho:         'Pintasan: <strong>Ctrl+Alt+S</strong>'
        },
        'it': {
            download:       'Scarica',
            downloadCode:   'Scarica codice',
            managerTitle:   'Gestore CodeDown',
            managerButton:  '⬇️ Scarica tutto',
            downloadZip:    'Scarica selezionati (ZIP)',
            selectAll:      'Seleziona tutto',
            unselectAll:    'Deseleziona tutto',
            noCodeFound:    'Nessun blocco di codice trovato in questa pagina.',
            close:          'Chiudi',
            files:          'file',
            scanning:       'Scansione...',
            atalho:         'Scorciatoia: <strong>Ctrl+Alt+S</strong>'
        },
        'ja': {
            download:       'ダウンロード',
            downloadCode:   'コードをダウンロード',
            managerTitle:   'CodeDown マネージャー',
            managerButton:  '⬇️ すべてダウンロード',
            downloadZip:    '選択したものをダウンロード (ZIP)',
            selectAll:      'すべて選択',
            unselectAll:    '選択を解除',
            noCodeFound:    'このページにコードブロックは見つかりませんでした。',
            close:          '閉じる',
            files:          'ファイル',
            scanning:       'スキャン中...',
            atalho:         'ショートカット: <strong>Ctrl+Alt+S</strong>'
        },
        'ka': {
            download:       'ჩამოტვირთვა',
            downloadCode:   'კოდის ჩამოტვირთვა',
            managerTitle:   'CodeDown მენეჯერი',
            managerButton:  '⬇️ ყველას ჩამოტვირთვა',
            downloadZip:    'არჩეულების ჩამოტვირთვა (ZIP)',
            selectAll:      'ყველას მონიშვნა',
            unselectAll:    'მონიშვნის გაუქმება',
            noCodeFound:    'ამ გვერდზე კოდის ბლოკები ვერ მოიძებნა.',
            close:          'დახურვა',
            files:          'ფაილი',
            scanning:       'სკანირება...',
            atalho:         'მალსახმობი: <strong>Ctrl+Alt+S</strong>'
        },
        'ko': {
            download:       '다운로드',
            downloadCode:   '코드 다운로드',
            managerTitle:   'CodeDown 관리자',
            managerButton:  '⬇️ 모두 다운로드',
            downloadZip:    '선택 항목 다운로드 (ZIP)',
            selectAll:      '모두 선택',
            unselectAll:    '선택 해제',
            noCodeFound:    '이 페이지에서 코드 블록을 찾을 수 없습니다.',
            close:          '닫기',
            files:          '파일',
            scanning:       '스캔 중...',
            atalho:         '단축키: <strong>Ctrl+Alt+S</strong>'
        },
        'mr': {
            download:       'डाउनलोड',
            downloadCode:   'कोड डाउनलोड',
            managerTitle:   'CodeDown व्यवस्थापक',
            managerButton:  '⬇️ सर्व डाउनलोड करा',
            downloadZip:    'निवडलेले डाउनलोड करा (ZIP)',
            selectAll:      'सर्व निवडा',
            unselectAll:    'निवड रद्द करा',
            noCodeFound:    'या पृष्ठावर कोणताही कोड ब्लॉक सापडला नाही.',
            close:          'बंद करा',
            files:          'फाइल्स',
            scanning:       'स्कॅन करत आहे...',
            atalho:         'शॉर्टकट: <strong>Ctrl+Alt+S</strong>'
        },
        'nb': {
            download:       'Last ned',
            downloadCode:   'Last ned kode',
            managerTitle:   'CodeDown-behandler',
            managerButton:  '⬇️ Last ned alt',
            downloadZip:    'Last ned valgte (ZIP)',
            selectAll:      'Velg alle',
            unselectAll:    'Fjern valg',
            noCodeFound:    'Ingen kodeblokker funnet på denne siden.',
            close:          'Lukk',
            files:          'filer',
            scanning:       'Skanner...',
            atalho:         'Snarvei: <strong>Ctrl+Alt+S</strong>'
        },
        'nl': {
            download:       'Downloaden',
            downloadCode:   'Code downloaden',
            managerTitle:   'CodeDown Beheerder',
            managerButton:  '⬇️ Alles downloaden',
            downloadZip:    'Geselecteerde downloaden (ZIP)',
            selectAll:      'Alles selecteren',
            unselectAll:    'Selectie ongedaan maken',
            noCodeFound:    'Geen codeblokken gevonden op deze pagina.',
            close:          'Sluiten',
            files:          'bestanden',
            scanning:       'Scannen...',
            atalho:         'Sneltoets: <strong>Ctrl+Alt+S</strong>'
        },
        'pl': {
            download:       'Pobierz',
            downloadCode:   'Pobierz kod',
            managerTitle:   'Menedżer CodeDown',
            managerButton:  '⬇️ Pobierz wszystko',
            downloadZip:    'Pobierz zaznaczone (ZIP)',
            selectAll:      'Zaznacz wszystko',
            unselectAll:    'Odznacz wszystko',
            noCodeFound:    'Nie znaleziono bloków kodu na tej stronie.',
            close:          'Zamknij',
            files:          'pliki',
            scanning:       'Skanowanie...',
            atalho:         'Skrót: <strong>Ctrl+Alt+S</strong>'
        },
        'ro': {
            download:       'Descarcă',
            downloadCode:   'Descarcă codul',
            managerTitle:   'Manager CodeDown',
            managerButton:  '⬇️ Descarcă tot',
            downloadZip:    'Descarcă selecția (ZIP)',
            selectAll:      'Selectează tot',
            unselectAll:    'Deselectează tot',
            noCodeFound:    'Nu s-au găsit blocuri de cod pe această pagină.',
            close:          'Închide',
            files:          'fișiere',
            scanning:       'Se scanează...',
            atalho:         'Scurtătură: <strong>Ctrl+Alt+S</strong>'
        },
        'ru': {
            download:       'Скачать',
            downloadCode:   'Скачать код',
            managerTitle:   'Менеджер CodeDown',
            managerButton:  '⬇️ Скачать всё',
            downloadZip:    'Скачать выбранное (ZIP)',
            selectAll:      'Выбрать всё',
            unselectAll:    'Снять выделение',
            noCodeFound:    'Блоки кода на странице не найдены.',
            close:          'Закрыть',
            files:          'файлы',
            scanning:       'Сканирование...',
            atalho:         'Горячая клавиша: <strong>Ctrl+Alt+S</strong>'
        },
        'sk': {
            download:       'Stiahnuť',
            downloadCode:   'Stiahnuť kód',
            managerTitle:   'Správca CodeDown',
            managerButton:  '⬇️ Stiahnuť všetko',
            downloadZip:    'Stiahnuť vybrané (ZIP)',
            selectAll:      'Vybrať všetko',
            unselectAll:    'Zrušiť výber',
            noCodeFound:    'Na tejto stránke sa nenašli žiadne bloky kódu.',
            close:          'Zavrieť',
            files:          'súbory',
            scanning:       'Skenovanie...',
            atalho:         'Skratka: <strong>Ctrl+Alt+S</strong>'
        },
        'sr': {
            download:       'Преузми',
            downloadCode:   'Преузми код',
            managerTitle:   'CodeDown менаџер',
            managerButton:  '⬇️ Преузми све',
            downloadZip:    'Преузми изабрано (ZIP)',
            selectAll:      'Изабери све',
            unselectAll:    'Поништи избор',
            noCodeFound:    'Нису пронађени блокови кода на овој страници.',
            close:          'Затвори',
            files:          'датотеке',
            scanning:       'Скенирање...',
            atalho:         'Пречица: <strong>Ctrl+Alt+S</strong>'
        },
        'sv': {
            download:       'Ladda ner',
            downloadCode:   'Ladda ner kod',
            managerTitle:   'CodeDown Hanterare',
            managerButton:  '⬇️ Ladda ner allt',
            downloadZip:    'Ladda ner valda (ZIP)',
            selectAll:      'Välj alla',
            unselectAll:    'Avmarkera alla',
            noCodeFound:    'Inga kodblock hittades på denna sida.',
            close:          'Stäng',
            files:          'filer',
            scanning:       'Skannar...',
            atalho:         'Genväg: <strong>Ctrl+Alt+S</strong>'
        },
        'th': {
            download:       'ดาวน์โหลด',
            downloadCode:   'ดาวน์โหลดโค้ด',
            managerTitle:   'ตัวจัดการ CodeDown',
            managerButton:  '⬇️ ดาวน์โหลดทั้งหมด',
            downloadZip:    'ดาวน์โหลดที่เลือก (ZIP)',
            selectAll:      'เลือกทั้งหมด',
            unselectAll:    'ยกเลิกการเลือก',
            noCodeFound:    'ไม่พบโค้ดในหน้านี้',
            close:          'ปิด',
            files:          'ไฟล์',
            scanning:       'กำลังสแกน...',
            atalho:         'คีย์ลัด: <strong>Ctrl+Alt+S</strong>'
        },
        'tr': {
            download:       'İndir',
            downloadCode:   'Kodu indir',
            managerTitle:   'CodeDown Yöneticisi',
            managerButton:  '⬇️ Tümünü İndir',
            downloadZip:    'Seçilenleri İndir (ZIP)',
            selectAll:      'Tümünü Seç',
            unselectAll:    'Seçimi Kaldır',
            noCodeFound:    'Bu sayfada kod bloğu bulunamadı.',
            close:          'Kapat',
            files:          'dosya',
            scanning:       'Taranıyor...',
            atalho:         'Kısayol: <strong>Ctrl+Alt+S</strong>'
        },
        'uk': {
            download:       'Завантажити',
            downloadCode:   'Завантажити код',
            managerTitle:   'Менеджер CodeDown',
            managerButton:  '⬇️ Завантажити все',
            downloadZip:    'Завантажити обране (ZIP)',
            selectAll:      'Вибрати все',
            unselectAll:    'Зняти виділення',
            noCodeFound:    'Блоки коду на сторінці не знайдено.',
            close:          'Закрити',
            files:          'файли',
            scanning:       'Сканування...',
            atalho:         'Гаряча клавіша: <strong>Ctrl+Alt+S</strong>'
        },
        'ug': {
            download:       'چۈشۈرۈش',
            downloadCode:   'كودنى چۈشۈرۈش',
            managerTitle:   'CodeDown باشقۇرغۇچ',
            managerButton:  '⬇️ ھەممىنى چۈشۈرۈش',
            downloadZip:    'تاللانغاننى چۈشۈرۈش (ZIP)',
            selectAll:      'ھەممىنى تاللاش',
            unselectAll:    'تاللاشنى بىكار قىلىش',
            noCodeFound:    'بۇ بەتتە كود بۆلىكى تېپىلمىدى.',
            close:          'تاقاش',
            files:          'ھۆججەت',
            scanning:       'تەكشۈرۈۋاتىدۇ...',
            atalho:         'تېزلەتمە: <strong>Ctrl+Alt+S</strong>'
        },
        'vi': {
            download:       'Tải xuống',
            downloadCode:   'Tải mã nguồn',
            managerTitle:   'Trình quản lý CodeDown',
            managerButton:  '⬇️ Tải xuống tất cả',
            downloadZip:    'Tải xuống đã chọn (ZIP)',
            selectAll:      'Chọn tất cả',
            unselectAll:    'Bỏ chọn tất cả',
            noCodeFound:    'Không tìm thấy đoạn mã nào trên trang này.',
            close:          'Đóng',
            files:          'tệp tin',
            scanning:       'Đang quét...',
            atalho:         'Phím tắt: <strong>Ctrl+Alt+S</strong>'
        }
    };
    function getLanguage() {
        const lang = (navigator.language || navigator.userLanguage).toLowerCase().split('-')[0];
        switch (lang) {
            case 'pt':  return 'pt-br';
            case 'zh':  return 'zh-cn';
            case 'ckb': return 'ckb';
            case 'ar':  return 'ar';
            case 'be':  return 'be';
            case 'bg':  return 'bg';
            case 'cs':  return 'cs';
            case 'da':  return 'da';
            case 'de':  return 'de';
            case 'el':  return 'el';
            case 'en':  return 'en';
            case 'eo':  return 'eo';
            case 'es':  return 'es';
            case 'fi':  return 'fi';
            case 'fr':  return 'fr';
            case 'he':  return 'he';
            case 'hr':  return 'hr';
            case 'hu':  return 'hu';
            case 'id':  return 'id';
            case 'it':  return 'it';
            case 'ja':  return 'ja';
            case 'ka':  return 'ka';
            case 'ko':  return 'ko';
            case 'mr':  return 'mr';
            case 'nb':  return 'nb';
            case 'nl':  return 'nl';
            case 'pl':  return 'pl';
            case 'ro':  return 'ro';
            case 'ru':  return 'ru';
            case 'sk':  return 'sk';
            case 'sr':  return 'sr';
            case 'sv':  return 'sv';
            case 'th':  return 'th';
            case 'tr':  return 'tr';
            case 'uk':  return 'uk';
            case 'ug':  return 'ug';
            case 'vi':  return 'vi';
            default:    return 'en';
        }
    }
    const langKey = getLanguage();
    const i18n = translations[langKey];
    // #endregion TRADUÇÃO
    // #region FORMATOS
    const fileTypeExtensions = {
        bash:       'sh',
        bat:        'bat',
        c:          'c',
        'c#':       'cs',
        'c++':      'cpp',
        cpp:        'cpp',
        css:        'css',
        csv:        'csv',
        dockerfile: 'dockerfile',
        env:        'env',
        go:         'go',
        gitignore:  'gitignore',
        html:       'html',
        java:       'java',
        javascript: 'js',
        json:       'json',
        jsx:        'jsx',
        kotlin:     'kt',
        markdown:   'md',
        php:        'php',
        plain:      'txt',
        powershell: 'ps1',
        python:     'py',
        r:          'r',
        ruby:       'rb',
        rust:       'rs',
        sass:       'sass',
        scala:      'scala',
        scss:       'scss',
        shell:      'sh',
        sql:        'sql',
        svg:        'svg',
        swift:      'swift',
        text:       'txt',
        toml:       'toml',
        tsx:        'tsx',
        txt:        'txt',
        typescript: 'ts',
        vue:        'vue',
        xml:        'xml',
        yaml:       'yaml'
    };
    function getMimeType(ext) {
        const mime = {
            bat:        'text/plain',
            c:          'text/x-csrc',
            cpp:        'text/x-c++src',
            cs:         'text/x-csharp',
            css:        'text/css',
            csv:        'text/csv',
            dockerfile: 'text/plain',
            env:        'text/plain',
            gitignore:  'text/plain',
            go:         'text/x-go',
            html:       'text/html',
            java:       'text/x-java-source',
            js:         'application/javascript',
            json:       'application/json',
            jsx:        'text/jsx',
            kt:         'text/x-kotlin',
            md:         'text/markdown',
            php:        'application/x-php',
            ps1:        'application/x-powershell',
            py:         'text/x-python',
            r:          'text/x-r-source',
            rb:         'application/x-ruby',
            rs:         'text/x-rust',
            sass:       'text/x-sass',
            scala:      'text/x-scala',
            scss:       'text/x-scss',
            sh:         'application/x-sh',
            sql:        'application/sql',
            svg:        'image/svg+xml',
            swift:      'text/x-swift',
            toml:       'application/toml',
            ts:         'application/typescript',
            tsx:        'text/tsx',
            txt:        'text/plain',
            vue:        'text/plain',
            xml:        'application/xml',
            yaml:       'application/x-yaml'
        };
        return mime[ext] || 'text/plain';
    }
    // #endregion FORMATOS
    // #endregion GLOBAL
    // #region GERENCIADOR CODEDOWN
    const scriptPolicy = window.trustedTypes
        ? window.trustedTypes.createPolicy('codedown-policy', {
            createHTML: (input) => input
        })
        : null;

    function setSafeInnerHTML(element, html) {
        if (!element) return;
        if (scriptPolicy) {
            element.innerHTML = scriptPolicy.createHTML(html);
        } else {
            element.innerHTML = html;
        }
    }

    class CodeDownManager {
        constructor() {
            this.hostElement      = null;
            this.shadowRoot       = null;
            this.isVisible        = false;
            this.lastCheckedIndex = -1;
            this.codeBlocks       = [];
        }

        _ensureHost() {
            const hostId            = 'codedown-host-ui';
            this.hostElement        = document.getElementById(hostId);
            if (!this.hostElement) {
                this.hostElement    = document.createElement('div');
                this.hostElement.id = hostId;
                document.body.appendChild(this.hostElement);
            }
            if (!this.hostElement.shadowRoot) {
                this.shadowRoot          = this.hostElement.attachShadow({ mode: 'open' });
                const styleElement       = document.createElement('style');
                styleElement.textContent = this._getStyles();
                this.shadowRoot.appendChild(styleElement);
            }
        }
    // #region ESTILOS CSS
    _getStyles() {
        return `
            /* === VARIÁVEIS CSS === */
            :host {
                all: initial !important;
                --cd-bg: #1e1e1e;
                --cd-surface: #2d2d2d;
                --cd-border: #444;
                --cd-text: #e0e0e0;
                --cd-text-muted: #888;
                --cd-primary: #02bc7d;
                --cd-primary-hover: #029a66;
                --cd-scroll: #555;
            }

            /* === ESTILOS GLOBAIS === */
            * {
                box-sizing: border-box !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace !important;
            }

            /* === OVERLAY / FUNDO MODAL === */
            .overlay {
                position: fixed !important;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0,0,0,0.7);
                z-index: 2147483646;
                display: none;
                backdrop-filter: blur(3px);
            }

            .overlay.visible {
                display: flex !important;
                justify-content: center;
                align-items: center;
            }

            /* === PAINEL PRINCIPAL === */
            .panel {
                background: var(--cd-bg);
                width: 550px;
                max-width: 90%;
                max-height: 85vh;
                border-radius: 12px;
                border: 1px solid var(--cd-border);
                box-shadow: 0 10px 40px rgba(0,0,0,0.6);
                display: flex;
                flex-direction: column;
                animation: slideIn 0.2s ease-out;
                color: var(--cd-text);
            }

            @keyframes slideIn {
                from {
                    transform: translateY(20px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            /* === CABEÇALHO === */
            .header {
                padding: 16px 24px;
                border-bottom: 1px solid var(--cd-border);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: var(--cd-surface);
                border-radius: 12px 12px 0 0;
            }

            .header-actions {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .title {
                font-size: 18px;
                font-weight: 600;
                color: var(--cd-primary);
                display: flex;
                align-items: center;
                gap: 10px;
            }

            /* === BOTÃO INFO === */
            .info-btn {
                background: none;
                border: none;
                color: var(--cd-text-muted);
                cursor: pointer;
                padding: 6px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: color 0.3s ease, background-color 0.3s ease;
                position: relative;
            }

            .info-btn svg {
                width: 24px;
                height: 24px;
            }

            .info-btn:hover {
                color: var(--cd-primary);
                background-color: rgba(255, 255, 255, 0.05);
            }

            .info-popup {
                position: absolute;
                top: calc(100% + 10px);
                right: 0;
                background: var(--cd-surface);
                border: 1px solid var(--cd-border);
                border-radius: 8px;
                padding: 12px 16px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                color: var(--cd-text);
                font-size: 13px;
                white-space: nowrap;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: opacity 0.2s ease, visibility 0.2s ease, transform 0.2s ease;
                z-index: 2147483647;
            }

            .info-popup.visible {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            /* === BOTÃO FECHAR === */
            .close-btn {
                background: none;
                border: none;
                color: var(--cd-text-muted);
                cursor: pointer;
                padding: 6px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: color 0.3s ease, background-color 0.3s ease;
            }

            .close-btn svg {
                width: 24px;
                height: 24px;
                transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                transform-origin: center;
            }

            .close-btn:hover {
                color: var(--cd-primary);
                background-color: rgba(255, 255, 255, 0.05);
            }

            .close-btn:hover svg {
                transform: rotate(90deg);
            }

            /* === CONTEÚDO PRINCIPAL === */
            .content {
                padding: 0;
                overflow-y: auto;
                flex: 1;
            }

            /* === ESTADO VAZIO === */
            .empty-state {
                padding: 40px;
                text-align: center;
                color: var(--cd-text-muted);
            }

            /* === LISTA DE ITENS === */
            .list-item {
                display: flex;
                align-items: center;
                padding: 12px 20px;
                border-bottom: 1px solid var(--cd-border);
                transition: background 0.15s;
                cursor: pointer;
                user-select: none;
            }

            .list-item:hover {
                background: rgba(255,255,255,0.05);
            }

            .list-item:last-child {
                border-bottom: none;
            }

            /* === CHECKBOX PERSONALIZADO === */
            .checkbox-wrapper {
                position: relative;
                width: 20px;
                height: 20px;
                margin-right: 15px;
                flex-shrink: 0;
            }

            input[type="checkbox"] {
                opacity: 0;
                width: 100%;
                height: 100%;
                margin: 0;
                cursor: pointer;
                z-index: 2;
            }

            .checkmark {
                position: absolute;
                top: 0;
                left: 0;
                height: 20px;
                width: 20px;
                background-color: transparent;
                border: 2px solid var(--cd-text-muted);
                border-radius: 4px;
                pointer-events: none;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }

            input:checked ~ .checkmark {
                background-color: var(--cd-primary);
                border-color: var(--cd-primary);
                box-shadow: 0 0 5px rgba(2, 188, 125, 0.4);
            }

            .checkbox-wrapper:hover input:not(:checked) ~ .checkmark {
                border-color: var(--cd-text);
            }

            input:checked ~ .checkmark:after {
                display: block;
            }

            /* === COLUNA DE ÍNDICE === */
            .index-col {
                font-family: "Consolas", "Monaco", monospace !important;
                color: var(--cd-text-muted);
                font-size: 13px;
                min-width: 35px;
                text-align: right;
                margin-right: 12px;
                font-weight: bold;
                opacity: 0.7;
            }

            .vertical-sep {
                width: 1px;
                height: 28px;
                background-color: var(--cd-border);
                margin-right: 15px;
            }

            /* === INFORMAÇÕES DO ARQUIVO === */
            .file-info {
                flex: 1;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }

            .file-name {
                font-size: 14px;
                font-weight: 500;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                color: var(--cd-text);
                margin-bottom: 4px;
            }

            .file-lang {
                font-size: 11px;
                color: var(--cd-text-muted);
                text-transform: uppercase;
                letter-spacing: 0.5px;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .file-lang::before {
                content: '';
                display: inline-block;
                width: 6px;
                height: 6px;
                background: var(--cd-primary);
                border-radius: 50%;
            }

            /* === RODAPÉ === */
            .footer {
                padding: 16px 24px;
                border-top: 1px solid var(--cd-border);
                background: var(--cd-surface);
                border-radius: 0 0 12px 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 10px;
            }

            .footer-left {
                display: flex;
                align-items: center;
                gap: 15px;
            }

            .selection-info {
                font-size: 13px;
                color: var(--cd-text-muted);
            }

            /* === BOTÕES === */
            .btn {
                padding: 10px 16px;
                border-radius: 6px;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.2s;
                border: 1px solid transparent;
            }

            .btn-secondary {
                background: transparent;
                color: var(--cd-text);
                border-color: var(--cd-border);
            }

            .btn-secondary:hover {
                background: rgba(255,255,255,0.05);
                border-color: var(--cd-text-muted);
                color: #fff;
            }

            .btn-primary {
                background: var(--cd-primary);
                color: white;
            }

            .btn-primary:hover {
                background: var(--cd-primary-hover);
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(2, 188, 125, 0.3);
            }

            .btn-primary:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                filter: grayscale(1);
                transform: none;
                box-shadow: none;
            }

            /* === BARRA DE ROLAGEM === */
            .content::-webkit-scrollbar {
                width: 8px;
            }

            .content::-webkit-scrollbar-track {
                background: var(--cd-bg);
            }

            .content::-webkit-scrollbar-thumb {
                background: var(--cd-scroll);
                border-radius: 4px;
            }
        `;
    }
    // #endregion ESTILOS CSS
    // #region FUNÇÕES AUXILIARES
        scanForCodes() {
            this.codeBlocks = [];
            const strategies = [
                { selector: '.download-button-gpt',     type: 'ChatGPT' },
                { selector: '.download-button-zai',     type: 'Z.AI'    },
                { selector: '.download-button-gemini',  type: 'Gemini'  },
                { selector: '.download-button-lmarena', type: 'LMArena' },
                { selector: '.download-button-kimi',    type: 'Kimi'    },
                { selector: '.download-button-mistral', type: 'Mistral' },
                { selector: '.download-button-meta',    type: 'Meta'    },
                { selector: '.download-button-copilot', type: 'Copilot' },
                { selector: '.download-button-grok',    type: 'Grok'    },
                { selector: '.download-button-longcat', type: 'LongCat' }
            ];

            strategies.forEach(strat => {
                document.querySelectorAll(strat.selector).forEach(btn => {
                    const data = this._extractData(btn, strat.type);
                    if (data && data.content) {
                        this.codeBlocks.push({ ...data, id: Math.random().toString(36).substr(2, 9), checked: true });
                    }
                });
            });
        }
        // ---EXTRAÇÃO DE DADOS---
        _extractData(btn, type) {
            try {
                let content = null, ext = 'txt', lang = 'text';
                // ---CHATGPT---
                if (type === 'ChatGPT') {
                    const block = btn.closest('.contain-inline-size');
                    lang        = block?.querySelector('.flex.items-center.text-token-text-secondary')?.textContent.trim().toLowerCase() || 'txt';
                    content     = block?.querySelector('code')?.textContent;
                }
                // ---Z.AI---
                else if (type === 'Z.AI') {
                    const root             = btn.closest('.relative');
                    const contentEl        = root?.querySelector('.cm-content[data-language]');
                    lang                   = contentEl?.getAttribute('data-language') || 'txt';
                    if (contentEl) content = Array.from(contentEl.querySelectorAll('.cm-line')).map(d => d.innerText.replace(/\u00a0/g, ' ')).join('\n');
                }
                // ---GEMINI---
                else if (type === 'Gemini') {
                    lang    = btn.closest('.buttons')?.parentElement?.querySelector('span')?.textContent.trim().toLowerCase() || 'txt';
                    content = btn.closest('code-block')?.querySelector('code[data-test-id="code-content"]')?.innerText;
                }
                // ---LMARENA---
                else if (type === 'LMArena') {
                    const container = btn.closest('[data-sentry-component="CodeBlock"]');
                    lang            = container?.querySelector('[data-sentry-component="CodeBlockGroup"] span')?.textContent.trim().toLowerCase() || 'txt';
                    content         = container?.querySelector('[data-sentry-element="CodeBlockCode"] code')?.innerText;
                }
                // ---KIMI---
                else if (type === 'Kimi') {
                    const block = btn.closest('.segment-code');
                    lang        = block?.querySelector('.segment-code-lang')?.textContent.trim().toLowerCase() || 'txt';
                    content     = block?.querySelector('code')?.innerText;
                }
                // ---MISTRAL---
                else if (type === 'Mistral') {
                    const container     = btn.closest('.relative.rounded-md');
                    const codeEl        = container?.querySelector('code[class*="language-"]');
                    content             = codeEl?.innerText;
                    const langMatch     = Array.from(codeEl?.classList || []).find(c => c.startsWith('language-'));
                    if (langMatch) lang = langMatch.replace('language-', '');
                }
                // ---META---
                else if (type === 'Meta') {
                    const container = btn.closest('.x78zum5.xdt5ytf.xfe5zq5');
                    lang            = container?.querySelector('div[class*="x6s0dn4"] > span')?.textContent.trim().toLowerCase() || 'txt';
                    content         = container?.querySelector('pre > code')?.innerText;
                }
                // ---COPILOT---
                else if (type === 'Copilot') {
                    const header    = btn.closest('.flex.items-center.justify-between');
                    const container = header?.parentElement;
                    lang    = container?.querySelector('.capitalize')?.textContent.trim().toLowerCase() || 'txt';
                    content = container?.querySelector('pre > code')?.innerText;
                }
                // ---GROK---
                else if (type === 'Grok') {
                    const container     = btn.closest('.relative.not-prose');
                    lang                = container?.querySelector('.flex.flex-row.px-4 span')?.textContent.trim().toLowerCase() || 'txt';
                    const codeEl        = container?.querySelector('pre.shiki > code');
                    if (codeEl) content = Array.from(codeEl.querySelectorAll('.line')).map(l => l.textContent).join('\n');
                }
                // ---LONGCAT---
                else if (type === 'LongCat') {
                    const header    = btn.parentElement;
                    const container = header?.parentElement;
                    lang            = header?.querySelector('.code-block-header__lang')?.textContent.trim().toLowerCase() || 'txt';
                    content         = container?.querySelector('code.code-block-body')?.innerText;
                }
                // ---NORMALIZAÇÃO---
                ext = fileTypeExtensions[lang] || 'txt';
                let fileName = `CodeDown-${type.charAt(0).toUpperCase() + type.slice(1)}.${ext}`;
                return { fileName, content, ext, type };
            } catch (e) { return null; }
        }

        build() {
            this._ensureHost();
            this.scanForCodes();
            const existingOverlay = this.shadowRoot.querySelector('.overlay');
            if (existingOverlay) existingOverlay.remove();
            const overlay = document.createElement('div');
            overlay.className = 'overlay';
            overlay.onclick = (e) => { if(e.target === overlay) this.hide(); };
            const itemsHtml = this.codeBlocks.length > 0 ? this.codeBlocks.map((block, index) => `
                <div class="list-item" data-index="${index}">
                    <div class="checkbox-wrapper">
                        <input type="checkbox" ${block.checked ? 'checked' : ''} data-index="${index}">
                        <span class="checkmark"></span>
                    </div>
                    <div class="index-col">#${index + 1}</div>
                    <div class="vertical-sep"></div>
                    <div class="file-info">
                        <div class="file-name">${block.fileName}</div>
                        <div class="file-lang">${block.type} | ${block.ext} | ${block.content.length} chars</div>
                    </div>
                </div>
            `).join('') : `<div class="empty-state">${i18n.noCodeFound}</div>`;
            setSafeInnerHTML(overlay, `
                <div class="panel">
                    <div class="header">
                        <div class="title">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            ${i18n.managerTitle}
                        </div>
                        <div class="header-actions">
                            <button class="info-btn">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                                <div class="info-popup">${i18n.atalho}</div>
                            </button>
                            <button class="close-btn" aria-label="${i18n.close}">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="content">
                        ${itemsHtml}
                    </div>
                    <div class="footer">
                        <div class="footer-left">
                            <button id="select-all-btn" class="btn btn-secondary" ${this.codeBlocks.length === 0 ? 'disabled' : ''}>
                                ${i18n.selectAll}
                            </button>
                            <div class="selection-info"><span id="count-el">${this.codeBlocks.length}</span> ${i18n.files}</div>
                        </div>
                        <button id="download-zip-btn" class="btn btn-primary" ${this.codeBlocks.length === 0 ? 'disabled' : ''}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            ${i18n.downloadZip}
                        </button>
                    </div>
                </div>
            `);
            // ---EVENTOS---
            this.shadowRoot.appendChild(overlay);
            const closeBtn      = overlay.querySelector('.close-btn');
            const infoBtn       = overlay.querySelector('.info-btn');
            const infoPopup     = overlay.querySelector('.info-popup');
            const dlBtn         = overlay.querySelector('#download-zip-btn');
            const selectAllBtn  = overlay.querySelector('#select-all-btn');
            const countEl       = overlay.querySelector('#count-el');
            const checkboxes    = overlay.querySelectorAll('input[type="checkbox"]');
            if (closeBtn) closeBtn.onclick = () => this.hide();
            if (dlBtn) dlBtn.onclick       = () => this.downloadZip();
            let isInfoPopupVisible = false;
            if (infoBtn) {
                infoBtn.onclick = (e) => {
                    e.stopPropagation();
                    isInfoPopupVisible = !isInfoPopupVisible;
                    infoPopup.classList.toggle('visible', isInfoPopupVisible);
                };
            }
            overlay.addEventListener('click', (e) => {
                if (isInfoPopupVisible && infoPopup && !infoBtn.contains(e.target) && !infoPopup.contains(e.target)) {
                    isInfoPopupVisible = false;
                    infoPopup.classList.remove('visible');
                }
            });
            // ---ATUALIZAÇÃO DA INTERFACE---
            const updateUI                 = () => {
                const total                = this.codeBlocks.length;
                const checkedCount         = this.codeBlocks.filter(b => b.checked).length;
                const isAllSelected        = checkedCount === total && total > 0;
                if (countEl) countEl.textContent = `${checkedCount} / ${total} ${i18n.files}`;
                if (dlBtn) {
                    dlBtn.disabled      = checkedCount === 0;
                    dlBtn.style.opacity = checkedCount === 0 ? '0.5' : '1';
                }
                if (selectAllBtn) {
                    selectAllBtn.textContent = isAllSelected ? i18n.unselectAll : i18n.selectAll;
                }
            };
            // ---SELECIONAR TODOS---
            if (selectAllBtn) {
                selectAllBtn.onclick  = () => {
                    const allSelected = this.codeBlocks.every(b => b.checked);
                    const newState    = !allSelected;
                    this.codeBlocks.forEach((b, i) => {
                        b.checked = newState;
                        if (checkboxes[i]) checkboxes[i].checked = newState;
                    });
                    updateUI();
                };
            }
            // ---CHECKBOX---
            checkboxes.forEach(cb => {
                cb.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const idx = parseInt(e.target.dataset.index);
                    if (e.shiftKey && this.lastCheckedIndex !== -1) {
                        const start  = Math.min(this.lastCheckedIndex, idx);
                        const end    = Math.max(this.lastCheckedIndex, idx);
                        const status = e.target.checked;
                        for (let i = start; i <= end; i++) {
                            this.codeBlocks[i].checked = status;
                            checkboxes[i].checked = status;
                        }
                    } else {
                        this.codeBlocks[idx].checked = e.target.checked;
                    }
                    this.lastCheckedIndex = idx;
                    updateUI();
                });
            });
            // ---ITEM DA LISTA---
            overlay.querySelectorAll('.list-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    if (e.target.tagName === 'INPUT') return;
                    const cb = item.querySelector('input');
                    if (cb) cb.click();
                });
            });
            updateUI();
            setTimeout(() => overlay.classList.add('visible'), 10);
            this.isVisible = true;
        }
        // ---TOGGLE VISIBILIDADE---
        toggle() {
            if (this.isVisible) this.hide();
            else this.build();
        }
        // ---OCULTAR INTERFACE---
        hide() {
            const overlay = this.shadowRoot.querySelector('.overlay');
            if (overlay) {
                overlay.classList.remove('visible');
                setTimeout(() => {
                    overlay.remove();
                    this.isVisible = false;
                }, 200);
            }
        }
        // ---DOWNLOAD ZIP---
        async downloadZip() {
            const selected = this.codeBlocks.filter(b => b.checked);
            if (selected.length === 0) return;
            const btn = this.shadowRoot.querySelector('#download-zip-btn');
            const originalText = btn.textContent;
            btn.textContent = i18n.scanning;
            btn.disabled = true;
            const zip = new JSZip();
            const nameCounts = {};
            selected.forEach(block => {
                let finalName = block.fileName;
                if (nameCounts[finalName]) {
                    nameCounts[finalName]++;
                    const parts = finalName.split('.');
                    const ext = parts.pop();
                    finalName = `${parts.join('.')} (${nameCounts[finalName]}).${ext}`;
                } else {
                    nameCounts[finalName] = 1;
                }
                zip.file(finalName, block.content);
            });
            try {
                const content = await zip.generateAsync({ type: "blob" });
                const url = URL.createObjectURL(content);
                const a = document.createElement('a');
                a.href = url;
                a.download = "CodeDown.zip";
                document.body.appendChild(a);
                a.click();
                setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
                this.hide();
            } catch (err) {
                alert("Erro: " + err);
                btn.textContent = originalText;
                btn.disabled = false;
            }
        }
    }
    // #endregion FUNÇÕES AUXILIARES
    const uiManager = new CodeDownManager();
    // #endregion GERENCIADOR CODEDOWN
    // #region BOTÕES DE DOWNLOAD
    const isGPT     = /chatgpt\.com/.test           (location.hostname);
    const isZAI     = /chat\.z\.ai/.test            (location.hostname);
    const isGemini  = /gemini\.google\.com/.test    (location.hostname);
    const isLmArena = /lmarena\.ai/.test            (location.hostname);
    const isKimi    = /kimi\.com/.test              (location.hostname);
    const isMistral = /chat\.mistral\.ai/.test      (location.hostname);
    const isMetaAI  = /meta\.ai/.test               (location.hostname);
    const isCopilot = /copilot\.microsoft.com/.test (location.hostname);
    const isGrok    = /grok\.com/.test              (location.hostname);
    const isLongCat = /longcat\.chat/.test          (location.hostname);

    function createAndTriggerDownload(fileName, content, mimeType) {
        const blob = new Blob([content], {
            type: mimeType
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }
    // #region ChatGPT
    if (isGPT) {
        function createDownloadButtonGPT(container) {
            if (container.querySelector('.download-button-gpt')) {
                return;
            }
            const btn = document.createElement('button');
            btn.className = 'flex gap-1 items-center select-none py-1 download-button-gpt';
            btn.setAttribute('aria-label', i18n.downloadCode);
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '20');
            svg.setAttribute('height', '20');
            svg.setAttribute('viewBox', '0 0 20 20');
            svg.setAttribute('fill', 'currentColor');
            svg.classList.add('icon-sm');
            svg.innerHTML = '<path d="M14.707 7.293a1 1 0 0 0-1.414 0L11 9.586V3a1 1 0 1 0-2 0v6.586L6.707 7.293a1 1 0 0 0-1.414 1.414l4 4a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0 0-1.414zM3 12a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3a1 1 0 1 1 2 0v3a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-3a1 1 0 0 1 1-1z"/>';
            btn.appendChild(svg);
            btn.appendChild(document.createTextNode(i18n.download));
            btn.addEventListener('click', downloadCodeGPT);
            container.insertBefore(btn, container.firstChild);
        }
        function downloadCodeGPT() {
            const block = this.closest('.contain-inline-size');
            if (!block) return;
            const typeEl = block.querySelector('.flex.items-center.text-token-text-secondary');
            const fileType = typeEl?.textContent.trim().toLowerCase() || 'txt';
            const ext = fileTypeExtensions[fileType] || 'txt';
            const codeEl = block.querySelector('code');
            if (!codeEl) return;
            const fileName = `CodeDown-ChatGPT.${ext}`;
            createAndTriggerDownload(fileName, codeEl.textContent, getMimeType(ext));
        }
        const checkGPT = () => document.querySelectorAll('.bg-token-bg-elevated-secondary.text-token-text-secondary.flex').forEach(createDownloadButtonGPT);
        setInterval(checkGPT, 1000);
        window.addEventListener('load', checkGPT);
    }
    // #endregion
    // #region Z AI
    if (isZAI) {
        function createDownloadButtonZAI(copyBtn) {
            const buttonContainer = copyBtn.parentElement;
            if (!buttonContainer || buttonContainer.querySelector('.download-button-zai')) {
                return;
            }
            const btn = document.createElement('button');
            btn.className = `${copyBtn.className} download-button-zai`;
            btn.setAttribute('aria-label', i18n.downloadCode);
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '20');
            svg.setAttribute('height', '20');
            svg.setAttribute('viewBox', '0 0 20 20');
            svg.setAttribute('fill', 'currentColor');
            svg.classList.add('size-3');
            svg.innerHTML = '<path d="M14.707 7.293a1 1 0 0 0-1.414 0L11 9.586V3a1 1 0 1 0-2 0v6.586L6.707 7.293a1 1 0 0 0-1.414 1.414l4 4a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0 0-1.414zM3 12a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3a1 1 0 1 1 2 0v3a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-3a1 1 0 0 1 1-1z"/>';
            btn.appendChild(svg);
            btn.appendChild(document.createTextNode(i18n.download));
            btn.addEventListener('click', downloadCodeZAI);
            buttonContainer.insertBefore(btn, copyBtn);
        }
        function downloadCodeZAI() {
            const root = this.closest('.relative');
            if (!root) return;
            const contentEl = root.querySelector('.cm-content[data-language]');
            if (!contentEl) return;
            const lang = (contentEl.getAttribute('data-language') || 'txt').toLowerCase();
            const ext = fileTypeExtensions[lang] || 'txt';
            const text = Array.from(contentEl.querySelectorAll('.cm-line')).map(div => div.innerText.replace(/\u00a0/g, ' ')).join('\n');
            const fileName = `CodeDown-Z.AI.${ext}`;
            createAndTriggerDownload(fileName, text, getMimeType(ext));
        }
        const checkZAI = () => {
            document.querySelectorAll('button svg path[d^="M853.333333 298.666667"]').forEach(path => {
                const copyBtn = path.closest('button');
                if (copyBtn) createDownloadButtonZAI(copyBtn);
            });
        };
        setInterval(checkZAI, 1000);
        window.addEventListener('load', checkZAI);
    }
    // #endregion
    // #region Gemini
    if (isGemini) {
        GM_addStyle(`#codedown-gemini-tooltip { position: fixed; background: white; color: black; padding: 6px 10px; border-radius: 6px; font-size: 13px; font-family: sans-serif; opacity: 0; visibility: hidden; pointer-events: none; transition: opacity 0.2s, visibility 0.2s; z-index: 2147483647; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }`);
        let tooltip = document.createElement('div');
        tooltip.id = 'codedown-gemini-tooltip';
        document.body.appendChild(tooltip);
        function createDownloadButtonGemini(copyBtn) {
            if (copyBtn.parentElement.querySelector('.download-button-gemini')) return;
            const btn = document.createElement('button');
            btn.className = copyBtn.className + ' download-button-gemini';
            btn.setAttribute('aria-label', i18n.downloadCode);
            const matIcon = document.createElement('mat-icon');
            matIcon.className = copyBtn.querySelector('mat-icon').className;
            matIcon.setAttribute('role', 'img');
            matIcon.setAttribute('aria-hidden', 'true');
            matIcon.textContent = 'download';
            btn.appendChild(matIcon);
            btn.addEventListener('click', downloadCodeGemini);
            btn.addEventListener('mouseover', (e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                tooltip.textContent = i18n.downloadCode;
                tooltip.style.opacity = '1';
                tooltip.style.visibility = 'visible';
                tooltip.style.top = `${rect.bottom + 8}px`;
                tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
            });
            btn.addEventListener('mouseout', () => {
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'hidden';
            });
            copyBtn.parentElement.insertBefore(btn, copyBtn);
        }
        function downloadCodeGemini(event) {
            const header = event.currentTarget.closest('.buttons').parentElement;
            const spanType = header.querySelector('span');
            const fileType = spanType?.textContent.trim().toLowerCase() || 'txt';
            const ext = fileTypeExtensions[fileType] || 'txt';
            const codeEl = event.currentTarget.closest('code-block').querySelector('code[data-test-id="code-content"]');
            if (!codeEl) return;
            const fileName = `CodeDown-Gemini.${ext}`;
            createAndTriggerDownload(fileName, codeEl.innerText, getMimeType(ext));
        }
        const checkGemini = () => document.querySelectorAll('button.copy-button').forEach(createDownloadButtonGemini);
        setInterval(checkGemini, 1000);
        window.addEventListener('load', checkGemini);
    }
    // #endregion
    // #region LMArena
    if (isLmArena) {
        GM_addStyle(`.download-button-lmarena { position: relative; } .download-button-lmarena::before { content: attr(data-tooltip); position: absolute; top: 100%; left: 50%; transform: translateX(-50%); margin-top: 8px; background-color: white; color: black; padding: 5px 9px; border-radius: 5px; font-size: 13px; white-space: nowrap; opacity: 0; visibility: hidden; pointer-events: none; transition: opacity 0.2s, visibility 0.2s; z-index: 2147483647; box-shadow: 0 2px 5px rgba(0,0,0,0.2); } .download-button-lmarena:hover::before { opacity: 1; visibility: visible; }`);
        function createDownloadButtonLmArena(copyBtn) {
            if (copyBtn.parentElement.classList.contains('code-down-buttons-wrapper')) return;
            const wrapper = document.createElement('div');
            wrapper.className = 'flex items-center gap-2 code-down-buttons-wrapper';
            const btn = document.createElement('button');
            btn.className = copyBtn.className + ' download-button-lmarena';
            btn.setAttribute('aria-label', i18n.downloadCode);
            btn.setAttribute('type', 'button');
            btn.setAttribute('data-tooltip', i18n.downloadCode);
            const downloadSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            downloadSvg.setAttribute('width', '16');
            downloadSvg.setAttribute('height', '16');
            downloadSvg.setAttribute('viewBox', '0 0 24 24');
            downloadSvg.setAttribute('fill', 'none');
            downloadSvg.setAttribute('stroke', 'currentColor');
            downloadSvg.setAttribute('stroke-width', '2');
            downloadSvg.setAttribute('stroke-linecap', 'round');
            downloadSvg.setAttribute('stroke-linejoin', 'round');
            downloadSvg.innerHTML = '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>';
            btn.appendChild(downloadSvg);
            btn.addEventListener('click', downloadCodeLmArena);
            copyBtn.parentElement.insertBefore(wrapper, copyBtn);
            wrapper.appendChild(btn);
            wrapper.appendChild(copyBtn);
        }
        function downloadCodeLmArena(event) {
            event.stopPropagation();
            const container = this.closest('[data-sentry-component="CodeBlock"]');
            if (!container) return;
            const langEl = container.querySelector('[data-sentry-component="CodeBlockGroup"] span');
            const fileType = langEl?.textContent.trim().toLowerCase() || 'txt';
            const ext = fileTypeExtensions[fileType] || 'txt';
            const codeEl = container.querySelector('[data-sentry-element="CodeBlockCode"] code');
            if (!codeEl) return;
            const fileName = `CodeDown-LMArena.${ext}`;
            createAndTriggerDownload(fileName, codeEl.innerText, getMimeType(ext));
        }
        const checkLmArena = () => document.querySelectorAll('[data-sentry-component="CodeBlock"] button[data-sentry-component="CopyButton"]').forEach(createDownloadButtonLmArena);
        setInterval(checkLmArena, 1000);
        window.addEventListener('load', checkLmArena);
    }
    // #endregion
    // #region Kimi
    if (isKimi) {
        function createDownloadButtonKimi(copyBtn) {
            const headerContent = copyBtn.parentElement;
            if (!headerContent || headerContent.querySelector('.download-button-kimi')) return;
            const btn = copyBtn.cloneNode(true);
            btn.classList.add('download-button-kimi');
            btn.querySelector('span').textContent = i18n.download;
            const svg = btn.querySelector('svg');
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.innerHTML = '<path d="M5 20h14v-2H5v2zm14-9h-4V3H9v8H5l7 7l7-7z" fill="currentColor"></path>';
            btn.addEventListener('click', downloadCodeKimi);
            if (!copyBtn.parentElement.classList.contains('codedown-wrapper')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'codedown-wrapper';
                wrapper.style.display = 'flex';
                wrapper.style.gap = '8px';
                headerContent.replaceChild(wrapper, copyBtn);
                wrapper.appendChild(btn);
                wrapper.appendChild(copyBtn);
            }
        }
        function downloadCodeKimi() {
            const codeBlock = this.closest('.segment-code');
            if (!codeBlock) return;
            const langEl = codeBlock.querySelector('.segment-code-lang');
            const fileType = langEl?.textContent.trim().toLowerCase() || 'txt';
            const ext = fileTypeExtensions[fileType] || 'txt';
            const codeEl = codeBlock.querySelector('code');
            if (!codeEl) return;
            const fileName = `CodeDown-Kimi.${ext}`;
            createAndTriggerDownload(fileName, codeEl.innerText, getMimeType(ext));
        }
        const checkKimi = () => document.querySelectorAll('.segment-code-header-content .simple-button').forEach(createDownloadButtonKimi);
        setInterval(checkKimi, 1000);
        window.addEventListener('load', checkKimi);
    }
    // #endregion
    // #region Mistral
    if (isMistral) {
        function createDownloadButtonMistral(copyBtn) {
            const parent = copyBtn.parentElement;
            if (parent.querySelector('.download-button-mistral')) {
                return;
            }
            const btn = document.createElement('button');
            btn.className = copyBtn.className + ' download-button-mistral';
            btn.setAttribute('type', 'button');
            btn.setAttribute('aria-label', i18n.downloadCode);
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            for (const attr of copyBtn.querySelector('svg').attributes) {
                svg.setAttribute(attr.name, attr.value);
            }
            svg.innerHTML = '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>';
            btn.appendChild(svg);
            btn.appendChild(document.createTextNode(i18n.download));
            btn.addEventListener('click', downloadCodeMistral);
            parent.insertBefore(btn, copyBtn);
        }
        function downloadCodeMistral() {
            const container = this.closest('.relative.rounded-md');
            if (!container) return;
            const codeEl = container.querySelector('code[class*="language-"]');
            if (!codeEl) return;
            const langMatch = Array.from(codeEl.classList).find(c => c.startsWith('language-'));
            const fileType = langMatch ? langMatch.replace('language-', '').toLowerCase() : 'txt';
            const ext = fileTypeExtensions[fileType] || 'txt';
            const fileName = `CodeDown-Mistral.${ext}`;
            createAndTriggerDownload(fileName, codeEl.innerText, getMimeType(ext));
        }
        const checkMistral = () => {
            document.querySelectorAll('div[data-exclude-copy="true"] button svg.lucide-copy').forEach(svgEl => {
                const copyBtn = svgEl.closest('button');
                if (copyBtn) {
                    createDownloadButtonMistral(copyBtn);
                }
            });
        };
        setInterval(checkMistral, 1000);
        window.addEventListener('load', checkMistral);
    }
    // #endregion
    // #region Meta
    if (isMetaAI) {
        function createDownloadButtonMetaAI(copyBtn) {
            const parent = copyBtn.parentElement;
            if (!parent || parent.querySelector('.download-button-meta')) {
                return;
            }
            const btn = copyBtn.cloneNode(true);
            btn.classList.add('download-button-meta');
            btn.setAttribute('aria-label', i18n.download);
            btn.removeAttribute('data-tooltip-content');
            const svg = btn.querySelector('svg');
            if (svg) {
                svg.innerHTML = '<path fill-rule="evenodd" clip-rule="evenodd" d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"></path>';
            }
            btn.addEventListener('click', downloadCodeMetaAI);
            parent.insertBefore(btn, copyBtn);
        }
        function downloadCodeMetaAI(event) {
            event.stopPropagation();
            const container = this.closest('.x78zum5.xdt5ytf.xfe5zq5');
            if (!container) return;
            const langEl = container.querySelector('div[class*="x6s0dn4"] > span');
            const fileType = langEl?.textContent.trim().toLowerCase() || 'txt';
            const ext = fileTypeExtensions[fileType] || 'txt';
            const codeEl = container.querySelector('pre > code');
            if (!codeEl) return;
            const fileName = `CodeDown-Meta.${ext}`;
            createAndTriggerDownload(fileName, codeEl.innerText, getMimeType(ext));
        }
        const checkMetaAI = () => {
            const svgPathSelector = 'M5 14h1v2H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v1h-2V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1zm14 6h-8a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1zm3-1a3 3 0 0 1-3 3h-8a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v8z';
            document.querySelectorAll(`svg path[d="${svgPathSelector}"]`).forEach(pathEl => {
                const copyBtn = pathEl.closest('div[role="button"]');
                if (copyBtn) {
                    const container = copyBtn.closest('.x78zum5.xdt5ytf.xfe5zq5');
                    if (container && container.querySelector('pre > code')) {
                        createDownloadButtonMetaAI(copyBtn);
                    }
                }
            });
        };
        setInterval(checkMetaAI, 1000);
        window.addEventListener('load', checkMetaAI);
    }
    // #endregion
    // #region Copilot
    if (isCopilot) {
        function createDownloadButtonCopilot(copyBtn) {
            const parent = copyBtn.parentElement;
            if (parent.querySelector('.download-button-copilot')) {
                return;
            }
            const btn = copyBtn.cloneNode(true);
            btn.classList.add('download-button-copilot');
            btn.setAttribute('title', i18n.downloadCode);
            btn.removeAttribute('data-copy');
            const contentDiv = btn.querySelector('div');
            if (contentDiv) {
                contentDiv.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="w-5"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 19v-2h14v2H5z"></path></svg> ${i18n.download}`;
            } else {
                btn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="w-5"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 19v-2h14v2H5z"></path></svg> ${i18n.download}`;
            }
            btn.addEventListener('click', downloadCodeCopilot);
            parent.insertBefore(btn, copyBtn);
        }
        function downloadCodeCopilot(event) {
            event.stopPropagation();
            const header = this.closest('.flex.items-center.justify-between');
            const container = header ? header.parentElement : null;
            if (!container) return;
            const langEl = container.querySelector('.capitalize');
            const fileType = langEl?.textContent.trim().toLowerCase() || 'txt';
            const ext = fileTypeExtensions[fileType] || 'txt';
            const codeEl = container.querySelector('pre > code') || container.querySelector('code');
            if (!codeEl) return;
            const fileName = `CodeDown-Copilot.${ext}`;
            createAndTriggerDownload(fileName, codeEl.innerText, getMimeType(ext));
        }
        const checkCopilot = () => {
            const buttons = document.querySelectorAll('button[data-copy]');
            buttons.forEach(copyBtn => {
                if (copyBtn && !copyBtn.parentElement.querySelector('.download-button-copilot')) {
                    createDownloadButtonCopilot(copyBtn);
                }
            });
        };
        setInterval(checkCopilot, 1000);
        window.addEventListener('load', checkCopilot);
    }
    // #endregion
    // #region Grok
    if (isGrok) {
        function createDownloadButtonGrok(collapseBtn) {
            const parent = collapseBtn.parentElement;
            if (parent.querySelector('.download-button-grok')) return;
            const btn = collapseBtn.cloneNode(true);
            btn.classList.add('download-button-grok');
            btn.setAttribute('aria-label', i18n.downloadCode);
            const svg = btn.querySelector('svg');
            if (svg) {
                svg.innerHTML = '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>';
                svg.setAttribute('viewBox', '0 0 24 24');
            }
            const span = btn.querySelector('span');
            if (span) {
                span.textContent = i18n.download;
            }
            btn.addEventListener('click', downloadCodeGrok);
            parent.insertBefore(btn, collapseBtn);
        }
        function downloadCodeGrok(event) {
            event.stopPropagation();
            const container = this.closest('.relative.not-prose');
            if (!container) return;
            const langEl = container.querySelector('.flex.flex-row.px-4 span');
            const fileType = langEl?.textContent.trim().toLowerCase() || 'txt';
            const ext = fileTypeExtensions[fileType] || 'txt';
            const codeEl = container.querySelector('pre.shiki > code');
            if (!codeEl) return;
            const codeText = Array.from(codeEl.querySelectorAll('.line'))
                                .map(line => line.textContent)
                                .join('\n');
            const fileName = `CodeDown-Grok.${ext}`;
            createAndTriggerDownload(fileName, codeText, getMimeType(ext));
        }
        const checkGrok = () => {
            document.querySelectorAll('button svg.lucide-chevrons-down-up').forEach(svgEl => {
                const collapseBtn = svgEl.closest('button');
                if (collapseBtn) {
                    createDownloadButtonGrok(collapseBtn);
                }
            });
        };
        setInterval(checkGrok, 1000);
        window.addEventListener('load', checkGrok);
    }
    // #endregion
    // #region LongCat
    if (isLongCat) {
        function createDownloadButtonLongCat(copyBtn) {
            const header = copyBtn.parentElement;
            if (header.querySelector('.download-button-longcat')) {
                return;
            }
            const btn = document.createElement('div');
            btn.className = copyBtn.className + ' download-button-longcat';
            btn.setAttribute('aria-label', i18n.downloadCode);
            btn.style.display = 'flex';
            btn.style.alignItems = 'center';
            btn.style.gap = '5px';
            btn.style.cursor = 'pointer';
            btn.style.marginLeft = 'auto';
            btn.style.marginRight = '15px';
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '16');
            svg.setAttribute('height', '16');
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.setAttribute('fill', 'none');
            svg.setAttribute('stroke', 'currentColor');
            svg.setAttribute('stroke-width', '2');
            svg.setAttribute('stroke-linecap', 'round');
            svg.setAttribute('stroke-linejoin', 'round');
            svg.innerHTML = '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>';
            const span = document.createElement('span');
            span.className = 'code-block-header__text code-block-header__click';
            span.textContent = i18n.download;
            btn.appendChild(svg);
            btn.appendChild(span);
            btn.addEventListener('click', downloadCodeLongCat);
            header.insertBefore(btn, copyBtn);
        }
        function downloadCodeLongCat(event) {
            event.stopPropagation();
            event.preventDefault();
            const btn = event.currentTarget;
            const header = btn.parentElement;
            if (!header) return;
            const codeBlockContainer = header.parentElement;
            if (!codeBlockContainer) return;
            const langEl = header.querySelector('.code-block-header__lang');
            const fileType = langEl?.textContent.trim().toLowerCase() || 'txt';
            const ext = fileTypeExtensions[fileType] || 'txt';
            const codeEl = codeBlockContainer.querySelector('code.code-block-body');
            if (!codeEl) return;
            const fileName = `CodeDown-LongCat.${ext}`;
            createAndTriggerDownload(fileName, codeEl.innerText, getMimeType(ext));
        }
        const observerConfig = { childList: true, subtree: true };
        const handleMutations = (mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    document.querySelectorAll('.code-block-header__copy').forEach(createDownloadButtonLongCat);
                }
            }
        };
        const observer = new MutationObserver(handleMutations);
        const startObserver = () => {
            observer.observe(document.body, observerConfig);
            document.querySelectorAll('.code-block-header__copy').forEach(createDownloadButtonLongCat);
        };
        if (document.readyState === 'loading') {
            window.addEventListener('DOMContentLoaded', startObserver);
        } else {
            startObserver();
        }
    }
    // #endregion
    // #endregion BOTÕES DE DOWNLOAD
    // #region OUTROS
    GM_registerMenuCommand(i18n.managerButton, () => uiManager.toggle());
        window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.altKey && (e.key === 's' || e.key === 'S')) {
            e.preventDefault();
            uiManager.toggle();
        }
    });
    // #endregion
})();