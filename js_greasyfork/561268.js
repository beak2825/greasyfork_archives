// ==UserScript==
// @name                Translator
// @name:pt-BR          Tradutor
// @name:zh-CN          在线翻译
// @name:zh-TW          線上翻譯
// @name:fr-CA          Traducteur
// @name:ckb            وەرگێڕ
// @name:ar             مترجم
// @name:be             Перакладчык
// @name:bg             Преводач
// @name:cs             Překladač
// @name:da             Oversætter
// @name:de             Übersetzer
// @name:el             Μεταφραστής
// @name:en             Translator
// @name:eo             Tradukisto
// @name:es             Traductor
// @name:fi             Kääntäjä
// @name:fr             Traducteur
// @name:he             מתרגם
// @name:hr             Prevoditelj
// @name:hu             Fordító
// @name:id             Penerjemah
// @name:it             Traduttore
// @name:ja             翻訳機
// @name:ka             თარჯიმანი
// @name:ko             번역기
// @name:mr             अनुवादक
// @name:nb             Oversetter
// @name:nl             Vertaler
// @name:pl             Tłumacz
// @name:ro             Traducător
// @name:ru             Переводчик
// @name:sk             Prekladač
// @name:sr             Prevodilac
// @name:sv             Översättare
// @name:th             เครื่องมือแปลภาษา
// @name:tr             Çevirmen
// @name:uk             Перекладач
// @name:ug             تەرجىمان
// @name:vi             Trình thông dịch
// @description         Translate and replace your typing in real-time. Features a practical basic mode for daily use and an AI mode for complex texts with a human touch, working directly in text boxes across the web.
// @description:pt-BR   Traduza e substitua o que você digita em tempo real. Oferece um modo básico prático para o dia a dia e um modo IA para textos complexos com toque humano, funcionando diretamente em caixas de texto por toda a web.
// @description:zh-CN   实时翻译并替换您输入的内容。提供适用于日常使用的实用基础模式，以及用于复杂文本且具有人性化触感的人工智能模式，直接在全网文本框中运行。
// @description:zh-TW   即時翻譯並替換您輸入的內容。提供適用於日常使用的實用基礎模式，以及用於複雜文本且具有人性化觸感的人工智慧模式，直接在全網文字框中運行。
// @description:fr-CA   Traduisez et remplacez votre saisie en temps réel. Offre un mode de base pratique pour le quotidien et un mode IA pour les textes complexes avec une touche humaine, fonctionnant directement dans les zones de texte sur le Web.
// @description:ckb     وەرگێڕان و گۆڕینی ئەوەی دەینووسیت لە کاتی ڕاستەقینەدا. مۆدێکی بنەڕەتی پراکتیکی بۆ ژیانی ڕۆژانە و مۆدێکی زیرەکی دەستکرد بۆ دەقە ئاڵۆزەکان بە دەستکاری مرۆییەوە دابین دەکات، ڕاستەوخۆ لەناو سندووقە دەقەکاندا لە تەواوی وێب کاردەکات.
// @description:ar      ترجمة واستبدال ما تكتبه في الوقت الفعلي. يقدم وضعًا أساسيًا عمليًا للاستخدام اليومي ووضع ذكاء اصطناعي للنصوص المعقدة بلمسة بشرية، ويعمل مباشرة في صناديق النصوص عبر الويب.
// @description:be      Перакладайце і замяняйце тое, што вы ўводзіце, у рэжыме рэальнага часу. Прапануе практычны базавы рэжым для паўсядзённага выкарыстання і рэжым ІІ для складаных тэкстаў з чалавечым адценнем, працуючы непасрэдна ў тэкставых полях па ўсім інтэрнэце.
// @description:bg      Превеждайте и заменяйте това, което пишете в реално време. Предлага практичен основен режим за ежедневието и ИИ режим за сложни текстове с човешко докосване, работещ директно в текстови полета в цялата мрежа.
// @description:cs      Překládejte a nahrazujte to, co píšete, v reálném čase. Nabízí praktický základní režim pro každodenní použití a režim AI pro komplexní texty s lidským přístupem, fungující přímo v textových polích na celém webu.
// @description:da      Oversæt og erstat det, du skriver, i realtid. Tilbyder en praktisk basistilstand til hverdag og en AI-tilstand til komplekse tekster med et menneskeligt præg, der fungerer direkte i tekstfelter over hele nettet.
// @description:de      Übersetzen und ersetzen Sie das, was Sie schreiben, in Echtzeit. Bietet einen praktischen Basismodus für den Alltag und einen KI-Modus für komplexe Texte mit menschlicher Note, der direkt in Textfeldern im gesamten Web funktioniert.
// @description:el      Μεταφράστε και αντικαταστήστε ό,τι πληκτρολογείτε σε πραγματικό χρόνο. Προσφέρει μια πρακτική βασική λειτουργία για την καθημερινότητα και μια λειτουργία AI για σύνθετα κείμενα με ανθρώπινη αίσθηση, λειτουργώντας απευθείας σε πεδία κειμένου σε όλο τον ιστό.
// @description:en      Translate and replace your typing in real-time. Features a practical basic mode for daily use and an AI mode for complex texts with a human touch, working directly in text boxes across the web.
// @description:eo      Traduku και anstataŭigu tion, kion vi tajpas en reala tempo. Oferas praktikan bazan modon por via ĉiutaga vivo kaj AI-modon por kompleksaj tekstoj kun homa nuanco, funkciante rekte en tekstujoj tra la tuta reto.
// @description:es      Traduce y reemplaza lo que escribes en tiempo real. Ofrece un modo básico práctico para el día a día y un modo IA para textos complejos con un toque humano, funcionando directamente en cuadros de texto en toda la web.
// @description:fi      Käännä ja korvaa kirjoittamasi teksti reaaliajassa. Tarjoaa käytännöllisen perustilan arkikäyttöön ja tekoälytilan monimutkaisille teksteille inhimillisellä vivahteella, toimien suoraan tekstikentissä kaikkialla verkossa.
// @description:fr      Traduisez et remplacez votre saisie en temps réel. Offre un mode de base pratique pour le quotidien et un mode IA pour les textes complexes avec une touche humaine, fonctionnant directement dans les zones de texte sur le Web.
// @description:he      תרגם והחלף את מה שאתה מקליד בזמן אמת. מציע מצב בסיסי מעשי ליומיום ומצב בינה מלאכותית לטקסטים מורכבים עם מגע אנושי, הפועל ישירות בתיבות טקסט ברחבי הרשת.
// @description:hr      Prevedite i zamijenite ono što upisujete u stvarnom vremenu. Nudi praktičan osnovni način rada za svakodnevicu i AI način rada za složene tekstove s ljudskim dodirom, radeći izravno u tekstualnim okvirima diljem weba.
// @description:hu      Fordítsa le és cserélje ki gépelését valós időben. Praktikus alapmódot kínál a mindennapokhoz és egy MI-módot a bonyolult szövegekhez emberi érintéssel, közvetlenül a weboldalak szövegmezőiben működik.
// @description:id      Terjemahkan dan ganti apa yang Anda ketik secara real-time. Menawarkan mode dasar praktis untuk penggunaan sehari-hari dan mode AI untuk teks kompleks dengan sentuhan manusia, bekerja langsung di kotak teks di seluruh web.
// @description:it      Traduci e sostituisci quello che digiti in tempo reale. Offre una modalità base pratica per l'uso quotidiano e una modalità IA per testi complessi con un tocco umano, funzionando direttamente nelle caselle di testo su tutto il web.
// @description:ja      入力した内容をリアルタイムで翻訳して置換します。日常使いに便利な基本モードと、複雑な文章に対応する人間味のあるAIモードを提供し、ウェブ上のあらゆるテキストボックスで直接動作します。
// @description:ka      თარგმნეთ და შეცვალეთ რასაც წერთ რეალურ დროში. გთავაზობთ პრაქტიკულ საბაზისო რეჟიმს ყოველდღიურობისთვის და AI რეჟიმს რთული ტექსტებისთვის ადამიანური შეხებით, რომელიც მუშაობს პირდაპირ ტექსტურ ველებში მთელ ინტერნეტში.
// @description:ko      입력하는 내용을 실시간으로 번역하고 교체합니다. 일상적인 사용을 위한 실용적인 기본 모드와 인간적인 터치가 가미된 복잡한 텍스트용 AI 모드를 제공하며, 웹 전체의 텍스트 상자에서 직접 작동합니다.
// @description:mr      तुम्ही जे टाइप करता ते रिअल-टाइममध्ये भाषांतरित करा आणि बदला. दैनंदिन वापरासाठी एक व्यावहारिक मूलभूत मोड आणि मानवी स्पर्शासह जटिल मजकुरासाठी एक AI मोड ऑफर करतो, जो संपूर्ण वेबवरील टेक्स्ट बॉक्समध्ये थेट काम करतो.
// @description:nb      Oversett og erstatt det du skriver i sanntid. Tilbyr en praktisk basismodus for hverdagen og en AI-modus for komplekse tekster med et menneskelig preg, som fungerer direkte i tekstfelt over hele nettet.
// @description:nl      Vertaal en vervang wat u typt in realtime. Biedt een praktische basismodus voor dagelijks gebruik en een AI-modus voor complexe teksten met een menselijke nuance, die rechtstreeks in tekstvakken op het hele web werkt.
// @description:pl      Tłumacz i zastępuj to, co piszesz w czasie rzeczywistym. Oferuje praktyczny tryb podstawowy do codziennego użytku oraz tryb AI do złożonych tekstów z ludzkim akcentem, działający bezpośrednio w polach tekstowych w całej sieci.
// @description:ro      Traduceți și înlocuiți ceea ce tastați în timp real. Oferă un mod de bază practic pentru viața de zi cu zi și un mod AI pentru texte complexe cu o notă umană, funcționând direct în casetele de tekst de pe întregul web.
// @description:ru      Переводите и заменяйте набираемый текст в режиме реального времени. Предлагает практичный базовый режим для повседневного использования и режим ИИ для сложных текстов с человеческим оттенком, работающий непосредственно в текстовых полях на всех сайтах.
// @description:sk      Prekladajte a nahrádzajte to, čo píšete, v reálnom čase. Ponúka praktický základný režim pre každodenný život a režim AI pre komplexné texty s ľudským prístupom, fungujúci priamo v textových poliach po celom webe.
// @description:sr      Prevedite i zamenite ono što kucate u realnom vremenu. Nudi praktičan osnovni režim za svakodnevnu upotrebu i AI režim za složene tekstove sa ljudskim dodirom, radeći direktno u poljima za tekst širom veba.
// @description:sv      Översätt och ersätt det du skriver i realtid. Erbjuder ett praktiskt basläge för vardagen och ett AI-läge för komplexa texter med en mänsklig touch, som fungerar direkt i textfält över hela webben.
// @description:th      แปลและแทนที่สิ่งที่คุณพิมพ์แบบเรียลไทม์ นำเสนอโหมดพื้นฐานที่ใช้งานได้จริงสำหรับชีวิตประจำวันและโหมด AI สำหรับข้อความที่ซับซ้อนพร้อมสัมผัสของมนุษย์ โดยทำงานโดยตรงในช่องข้อความทั่วทั้งเว็บ
// @description:tr      Yazdıklarınızı gerçek zamanlı olarak çevirin ve değiştirin. Günlük kullanım için pratik bir temel mod ve insan dokunuşuyla karmaşık metinler için bir yapay zeka modu sunar, doğrudan web genelindeki metin kutularında çalışır.
// @description:uk      Перекладайте та замінюйте те, що ви вводите, у режимі реального часу. Пропонує практичний базовий режим для повсякденного використання та режим ШІ для складних текстів з людським відтінком, що працює безпосередньо в текстових полях на всіх сайтах.
// @description:ug      يازغانلىرىڭىزنى دەل ۋاقتىدا تەرجىمە قىلىدۇ ۋە ئالماشتۇرىدۇ. كۈندىلىك تۇرمۇشقا ماس كېلىدىغان قوللىنىشچان ئاساسىي مودېل ۋە ئادەم تېگىش قىلىنغان مۇرەككەپ تېكىستلەر ئۈچۈن سۈنئىي ئىدراك مودېلى بىلەن تەمىنلەيدۇ، پۈتۈن تور ئارا تېكىست رامكىلىرىدا بىۋاسىتە ئىشلەيدۇ.
// @description:vi      Dịch và thay thế những gì bạn nhập trong thời gian thực. Cung cấp chế độ cơ bản thực tế cho cuộc sống hàng ngày và chế độ AI cho các văn bản phức tạp với nét chạm của con người, hoạt động trực tiếp trong các khung văn bản trên toàn nền tảng web.
// @version             1.2
// @author              OHAS
// @license             CC-BY-NC-ND-4.0
// @copyright           2026 OHAS. All Rights Reserved.
// @namespace           http://github.com/0H4S
// @icon                https://cdn-icons-png.flaticon.com/512/2014/2014826.png
// @require             https://update.greasyfork.org/scripts/549920.js
// @match               *://*/*
// @connect             i.imgur.com
// @connect             gist.github.com
// @connect             api.longcat.chat
// @connect             files.catbox.moe
// @connect             translate.googleapis.com
// @grant               GM_registerMenuCommand
// @grant               GM_xmlhttpRequest
// @grant               GM_setClipboard
// @grant               GM_setValue
// @grant               GM_getValue
// @run-at              document-end
// @noframes
// @compatible          chrome
// @compatible          firefox
// @compatible          edge
// @compatible          opera
// @bgf-compatible      brave
// @bgf-colorLT         #ff9d22
// @bgf-colorDT         #ffcb00
// @bgf-copyright       [2026 OHAS. All Rights Reserved.](https://gist.github.com/0H4S/ae2fa82957a089576367e364cbf02438)
// @bgf-social          https://github.com/0H4S
// @contributionURL     https://linktr.ee/0H4S
// @downloadURL https://update.greasyfork.org/scripts/561268/Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/561268/Translator.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*eslint-disable*/

    // --- NOTIFICAÇÃO ---
    const SCRIPT_CONFIG = {notificationsUrl: 'https://gist.github.com/0H4S/d133ce7b86ab1815acf1bb149ce2f059', scriptVersion: '1.2',};
    const notifier = new ScriptNotifier(SCRIPT_CONFIG);
    notifier.run();

    // ======
    // #region INTERNACIONALIZAÇÃO E CONFIGURAÇÕES
    // ======

    // --- TRADUÇÕES ---
    const I18N_STRINGS = {
        pt: {
            lbl_lang:           "Idioma Alvo",
            lbl_search:         "Buscar idioma...",
            lbl_mode:           "Motor de Tradução",
            lbl_key:            "Chave API (LongCat)",
            lbl_hotkey:         "Tecla de Atalho (Clique e aperte)",
            lbl_shortcuts_list: "Atalhos Definidos",
            btn_save:           "Salvar",
            btn_cancel:         "Cancelar",
            btn_add:            "Adicionar",
            toast_saved:        "Configurações salvas com sucesso!",
            toast_sel:          "Selecione um texto primeiro",
            toast_translating:  "Traduzindo...",
            toast_done:         "Tradução concluída",
            toast_no_key:       "Configure a API Key",
            tab_general:        "Geral",
            tab_shortcuts:      "Atalhos Avançados",
            ph_hotkey:          "Ex: Alt+S",
            menu_translate:     "🌐 Traduzir",
            menu_config:        "⚙️ Configurações"
        },
        en: {
            lbl_lang:           "Target Language",
            lbl_search:         "Search language...",
            lbl_mode:           "Translation Engine",
            lbl_key:            "API Key (LongCat)",
            lbl_hotkey:         "Hotkey (Click and press)",
            lbl_shortcuts_list: "Defined Shortcuts",
            btn_save:           "Save",
            btn_cancel:         "Cancel",
            btn_add:            "Add",
            toast_saved:        "Settings saved successfully!",
            toast_sel:          "Please select text first",
            toast_translating:  "Translating...",
            toast_done:         "Translation complete",
            toast_no_key:       "API Key required",
            tab_general:        "General",
            tab_shortcuts:      "Advanced Shortcuts",
            ph_hotkey:          "Ex: Alt+S",
            menu_translate:     "🌐 Translate",
            menu_config:        "⚙️ Settings"
        },
        zh: {
            lbl_lang:           "目标语言",
            lbl_search:         "搜索语言...",
            lbl_mode:           "翻译引擎",
            lbl_key:            "API 密钥 (LongCat)",
            lbl_hotkey:         "热键 (点击并按键)",
            lbl_shortcuts_list: "已定义快捷键",
            btn_save:           "保存",
            btn_cancel:         "取消",
            btn_add:            "添加",
            toast_saved:        "设置已保存！",
            toast_sel:          "请先选择文本",
            toast_translating:  "翻译中...",
            toast_done:         "翻译完成",
            toast_no_key:       "需要 API 密钥",
            tab_general:        "常规",
            tab_shortcuts:      "高级快捷键",
            ph_hotkey:          "例如: Alt+S",
            menu_translate:     "🌐 翻译",
            menu_config:        "⚙️ 设置"
        },
        ja: {
            lbl_lang:           "ターゲット言語",
            lbl_search:         "言語を検索...",
            lbl_mode:           "翻訳エンジン",
            lbl_key:            "APIキー (LongCat)",
            lbl_hotkey:         "ホットキー (クリックして入力)",
            lbl_shortcuts_list: "定義済みショートカット",
            btn_save:           "保存",
            btn_cancel:         "キャンセル",
            btn_add:            "追加",
            toast_saved:        "設定を保存しました！",
            toast_sel:          "最初にテキストを選択してください",
            toast_translating:  "翻訳中...",
            toast_done:         "翻訳が完了しました",
            toast_no_key:       "APIキーが必要です",
            tab_general:        "全般",
            tab_shortcuts:      "高度なショートカット",
            ph_hotkey:          "例: Alt+S",
            menu_translate:     "🌐 翻訳",
            menu_config:        "⚙️ 設定"
        },
        ko: {
            lbl_lang:           "대상 언어",
            lbl_search:         "언어 검색...",
            lbl_mode:           "번역 엔진",
            lbl_key:            "API 키 (LongCat)",
            lbl_hotkey:         "단축키 (클릭 후 입력)",
            lbl_shortcuts_list: "정의된 단축키",
            btn_save:           "저장",
            btn_cancel:         "취소",
            btn_add:            "추가",
            toast_saved:        "설정이 성공적으로 저장되었습니다!",
            toast_sel:          "먼저 텍스트를 선택하세요",
            toast_translating:  "번역 중...",
            toast_done:         "번역 완료",
            toast_no_key:       "API 키가 필요합니다",
            tab_general:        "일반",
            tab_shortcuts:      "고급 단축키",
            ph_hotkey:          "예: Alt+S",
            menu_translate:     "🌐 번역",
            menu_config:        "⚙️ 설정"
        },
        ru: {
            lbl_lang:           "Целевой язык",
            lbl_search:         "Поиск языка...",
            lbl_mode:           "Система перевода",
            lbl_key:            "Ключ API (LongCat)",
            lbl_hotkey:         "Горячая клавиша (Нажмите здесь)",
            lbl_shortcuts_list: "Определенные ярлыки",
            btn_save:           "Сохранить",
            btn_cancel:         "Отмена",
            btn_add:            "Добавить",
            toast_saved:        "Настройки успешно сохранены!",
            toast_sel:          "Сначала выделите текст",
            toast_translating:  "Перевод...",
            toast_done:         "Перевод завершен",
            toast_no_key:       "Требуется ключ API",
            tab_general:        "Общие",
            tab_shortcuts:      "Расширенные ярлыки",
            ph_hotkey:          "Пример: Alt+S",
            menu_translate:     "🌐 Перевести",
            menu_config:        "⚙️ Настройки"
        },
        fr: {
            lbl_lang:           "Langue cible",
            lbl_search:         "Rechercher une langue...",
            lbl_mode:           "Moteur de traduction",
            lbl_key:            "Clé API (LongCat)",
            lbl_hotkey:         "Raccourci (Cliquez et appuyez)",
            lbl_shortcuts_list: "Raccourcis Définis",
            btn_save:           "Enregistrer",
            btn_cancel:         "Annuler",
            btn_add:            "Ajouter",
            toast_saved:        "Paramètres enregistrés avec succès !",
            toast_sel:          "Veuillez d'abord sélectionner du texte",
            toast_translating:  "Traduction en cours...",
            toast_done:         "Traduction terminée",
            toast_no_key:       "Clé API requise",
            tab_general:        "Général",
            tab_shortcuts:      "Raccourcis Avancés",
            ph_hotkey:          "Ex: Alt+S",
            menu_translate:     "🌐 Traduire",
            menu_config:        "⚙️ Paramètres"
        },
        de: {
            lbl_lang:           "Zielsprache",
            lbl_search:         "Sprache suchen...",
            lbl_mode:           "Übersetzungs-Engine",
            lbl_key:            "API-Schlüssel (LongCat)",
            lbl_hotkey:         "Hotkey (Klicken und drücken)",
            lbl_shortcuts_list: "Definierte Tastenkombinationen",
            btn_save:           "Speichern",
            btn_cancel:         "Abbrechen",
            btn_add:            "Hinzufügen",
            toast_saved:        "Einstellungen erfolgreich gespeichert!",
            toast_sel:          "Bitte wählen Sie zuerst einen Text aus",
            toast_translating:  "Übersetzung läuft...",
            toast_done:         "Übersetzung abgeschlossen",
            toast_no_key:       "API-Schlüssel erforderlich",
            tab_general:        "Allgemein",
            tab_shortcuts:      "Erweiterte Tastenkombinationen",
            ph_hotkey:          "Beispiel: Alt+S",
            menu_translate:     "🌐 Übersetzen",
            menu_config:        "⚙️ Einstellungen"
        },
        es: {
            lbl_lang:           "Idioma de destino",
            lbl_search:         "Buscar idioma...",
            lbl_mode:           "Motor de traducción",
            lbl_key:            "Clave API (LongCat)",
            lbl_hotkey:         "Tecla de Atajo (Clic y presione)",
            lbl_shortcuts_list: "Atajos Definidos",
            btn_save:           "Guardar",
            btn_cancel:         "Cancelar",
            btn_add:            "Añadir",
            toast_saved:        "¡Ajustes guardados correctamente!",
            toast_sel:          "Por favor, selecciona un texto primero",
            toast_translating:  "Traduciendo...",
            toast_done:         "Traducción completada",
            toast_no_key:       "Clave API requerida",
            tab_general:        "General",
            tab_shortcuts:      "Atajos Avanzados",
            ph_hotkey:          "Ej: Alt+S",
            menu_translate:     "🌐 Traducir",
            menu_config:        "⚙️ Configuración"
        },
        ar: {
            lbl_lang:           "اللغة المستهدفة",
            lbl_search:         "البحث عن لغة...",
            lbl_mode:           "محرك الترجمة",
            lbl_key:            "مفتاح API (LongCat)",
            lbl_hotkey:         "مفتاح الاختصار (انقر واضغط)",
            lbl_shortcuts_list: "الاختصارات المحددة",
            btn_save:           "حفظ",
            btn_cancel:         "إلغاء",
            btn_add:            "إضافة",
            toast_saved:        "تم حفظ الإعدادات بنجاح!",
            toast_sel:          "يرجى تحديد النص أولاً",
            toast_translating:  "جاري الترجمة...",
            toast_done:         "اكتملت الترجمة",
            toast_no_key:       "مفتاح API مطلوب",
            tab_general:        "عام",
            tab_shortcuts:      "اختصارات متقدمة",
            ph_hotkey:          "مثال: Alt+S",
            menu_translate:     "🌐 ترجمة",
            menu_config:        "⚙️ الإعدادات"
        },
        hi: {
            lbl_lang:           "लक्ष्य भाषा",
            lbl_search:         "भाषा खोजें...",
            lbl_mode:           "अनुवाद इंजन",
            lbl_key:            "API कुंजी (LongCat)",
            lbl_hotkey:         "हॉटकी (क्लिक करें और दबाएं)",
            lbl_shortcuts_list: "परिभाषित शॉर्टकट",
            btn_save:           "सहेजें",
            btn_cancel:         "रद्द करें",
            btn_add:            "जोड़ें",
            toast_saved:        "सेटिंग्स सफलतापूर्वक सहेजी गईं!",
            toast_sel:          "कृपया पहले टेक्स्ट चुनें",
            toast_translating:  "अनुवाद हो रहा है...",
            toast_done:         "अनुवाद पूरा हुआ",
            toast_no_key:       "API कुंजी आवश्यक है",
            tab_general:        "सामान्य",
            tab_shortcuts:      "उन्नत शॉर्टकट",
            ph_hotkey:          "उदा: Alt+S",
            menu_translate:     "🌐 अनुवाद करें",
            menu_config:        "⚙️ सेटिंग्स"
        },
        it: {
            lbl_lang:           "Lingua di destinazione",
            lbl_search:         "Cerca lingua...",
            lbl_mode:           "Motore di traduzione",
            lbl_key:            "Chiave API (LongCat)",
            lbl_hotkey:         "Tasto Scelta Rapida (Clicca e premi)",
            lbl_shortcuts_list: "Scorciatoie Definite",
            btn_save:           "Salva",
            btn_cancel:         "Annulla",
            btn_add:            "Aggiungi",
            toast_saved:        "Impostazioni salvate con successo!",
            toast_sel:          "Seleziona prima il testo",
            toast_translating:  "Traduzione in corso...",
            toast_done:         "Traduzione completata",
            toast_no_key:       "Chiave API richiesta",
            tab_general:        "Generale",
            tab_shortcuts:      "Scorciatoie Avanzate",
            ph_hotkey:          "Es: Alt+S",
            menu_translate:     "🌐 Traduci",
            menu_config:        "⚙️ Impostazioni"
        },
    };

    const userLang = navigator.language.split('-')[0];
    const CURRENT_LANG = I18N_STRINGS[userLang] ? userLang : 'en';
    const T = (key) => I18N_STRINGS[CURRENT_LANG][key] || I18N_STRINGS['en'][key];

    // --- IDIOMAS ---
    const SUPPORTED_LANGS = [
        { code: "af",       name: "Afrikaans" },
        { code: "ak",       name: "Akan" },
        { code: "sq",       name: "Albanian" },
        { code: "am",       name: "Amharic" },
        { code: "ar",       name: "Arabic" },
        { code: "hy",       name: "Armenian" },
        { code: "as",       name: "Assamese" },
        { code: "ay",       name: "Aymara" },
        { code: "az",       name: "Azerbaijani" },
        { code: "bm",       name: "Bambara" },
        { code: "eu",       name: "Basque" },
        { code: "be",       name: "Belarusian" },
        { code: "bn",       name: "Bengali" },
        { code: "bho",      name: "Bhojpuri" },
        { code: "bs",       name: "Bosnian" },
        { code: "bg",       name: "Bulgarian" },
        { code: "ca",       name: "Catalan" },
        { code: "ceb",      name: "Cebuano" },
        { code: "ny",       name: "Chichewa" },
        { code: "zh-CN",    name: "Chinese (Simplified)" },
        { code: "zh-TW",    name: "Chinese (Traditional)" },
        { code: "co",       name: "Corsican" },
        { code: "hr",       name: "Croatian" },
        { code: "cs",       name: "Czech" },
        { code: "da",       name: "Danish" },
        { code: "dv",       name: "Divehi" },
        { code: "doi",      name: "Dogri" },
        { code: "nl",       name: "Dutch" },
        { code: "en",       name: "English" },
        { code: "eo",       name: "Esperanto" },
        { code: "et",       name: "Estonian" },
        { code: "ee",       name: "Ewe" },
        { code: "tl",       name: "Filipino" },
        { code: "fi",       name: "Finnish" },
        { code: "fr",       name: "French" },
        { code: "fy",       name: "Frisian" },
        { code: "gl",       name: "Galician" },
        { code: "ka",       name: "Georgian" },
        { code: "de",       name: "German" },
        { code: "el",       name: "Greek" },
        { code: "gn",       name: "Guarani" },
        { code: "gu",       name: "Gujarati" },
        { code: "ht",       name: "Haitian Creole" },
        { code: "ha",       name: "Hausa" },
        { code: "haw",      name: "Hawaiian" },
        { code: "iw",       name: "Hebrew" },
        { code: "hi",       name: "Hindi" },
        { code: "hmn",      name: "Hmong" },
        { code: "hu",       name: "Hungarian" },
        { code: "is",       name: "Icelandic" },
        { code: "ig",       name: "Igbo" },
        { code: "ilo",      name: "Ilocano" },
        { code: "id",       name: "Indonesian" },
        { code: "ga",       name: "Irish" },
        { code: "it",       name: "Italian" },
        { code: "ja",       name: "Japanese" },
        { code: "jw",       name: "Javanese" },
        { code: "kn",       name: "Kannada" },
        { code: "kk",       name: "Kazakh" },
        { code: "km",       name: "Khmer" },
        { code: "rw",       name: "Kinyarwanda" },
        { code: "gom",      name: "Konkani" },
        { code: "ko",       name: "Korean" },
        { code: "kri",      name: "Krio" },
        { code: "ku",       name: "Kurdish (Kurmanji)" },
        { code: "ckb",      name: "Kurdish (Sorani)" },
        { code: "ky",       name: "Kyrgyz" },
        { code: "lo",       name: "Lao" },
        { code: "la",       name: "Latin" },
        { code: "lv",       name: "Latvian" },
        { code: "ln",       name: "Lingala" },
        { code: "lt",       name: "Lithuanian" },
        { code: "lg",       name: "Luganda" },
        { code: "lb",       name: "Luxembourgish" },
        { code: "mk",       name: "Macedonian" },
        { code: "mai",      name: "Maithili" },
        { code: "mg",       name: "Malagasy" },
        { code: "ms",       name: "Malay" },
        { code: "ml",       name: "Malayalam" },
        { code: "mt",       name: "Maltese" },
        { code: "mi",       name: "Maori" },
        { code: "mr",       name: "Marathi" },
        { code: "mni-Mtei", name: "Meiteilon (Manipuri)" },
        { code: "lus",      name: "Mizo" },
        { code: "mn",       name: "Mongolian" },
        { code: "my",       name: "Myanmar (Burmese)" },
        { code: "ne",       name: "Nepali" },
        { code: "no",       name: "Norwegian" },
        { code: "or",       name: "Odia (Oriya)" },
        { code: "om",       name: "Oromo" },
        { code: "ps",       name: "Pashto" },
        { code: "fa",       name: "Persian" },
        { code: "pl",       name: "Polish" },
        { code: "pt",       name: "Portuguese (Portugal)" },
        { code: "pt-BR",    name: "Portuguese (Brazil)" },
        { code: "pa",       name: "Punjabi (Gurmukhi)" },
        { code: "qu",       name: "Quechua" },
        { code: "ro",       name: "Romanian" },
        { code: "ru",       name: "Russian" },
        { code: "sm",       name: "Samoan" },
        { code: "sa",       name: "Sanskrit" },
        { code: "gd",       name: "Scots Gaelic" },
        { code: "nso",      name: "Sepedi" },
        { code: "sr",       name: "Serbian" },
        { code: "st",       name: "Sesotho" },
        { code: "sn",       name: "Shona" },
        { code: "sd",       name: "Sindhi" },
        { code: "si",       name: "Sinhala" },
        { code: "sk",       name: "Slovak" },
        { code: "sl",       name: "Slovenian" },
        { code: "so",       name: "Somali" },
        { code: "es",       name: "Spanish" },
        { code: "su",       name: "Sundanese" },
        { code: "sw",       name: "Swahili" },
        { code: "sv",       name: "Swedish" },
        { code: "tg",       name: "Tajik" },
        { code: "ta",       name: "Tamil" },
        { code: "tt",       name: "Tatar" },
        { code: "te",       name: "Telugu" },
        { code: "th",       name: "Thai" },
        { code: "ti",       name: "Tigrinya" },
        { code: "ts",       name: "Tsonga" },
        { code: "tr",       name: "Turkish" },
        { code: "tk",       name: "Turkmen" },
        { code: "tw",       name: "Twi" },
        { code: "uk",       name: "Ukrainian" },
        { code: "ur",       name: "Urdu" },
        { code: "ug",       name: "Uyghur" },
        { code: "uz",       name: "Uzbek" },
        { code: "vi",       name: "Vietnamese" },
        { code: "cy",       name: "Welsh" },
        { code: "xh",       name: "Xhosa" },
        { code: "yi",       name: "Yiddish" },
        { code: "yo",       name: "Yoruba" },
        { code: "zu",       name: "Zulu" },
        { code: "ab",       name: "Abkhaz" },
        { code: "ace",      name: "Acehnese" },
        { code: "ach",      name: "Acholi" },
        { code: "aa",       name: "Afar" },
        { code: "alz",      name: "Alur" },
        { code: "av",       name: "Avar" },
        { code: "awa",      name: "Awadhi" },
        { code: "ban",      name: "Balinese" },
        { code: "bal",      name: "Baluchi" },
        { code: "ba",       name: "Bashkir" },
        { code: "btx",      name: "Batak Karo" },
        { code: "bts",      name: "Batak Simalungun" },
        { code: "bbc",      name: "Batak Toba" },
        { code: "bem",      name: "Bemba" },
        { code: "bew",      name: "Betawi" },
        { code: "bcl",      name: "Bikol" },
        { code: "br",       name: "Breton" },
        { code: "bua",      name: "Buryat" },
        { code: "yue",      name: "Cantonese" },
        { code: "chm",      name: "Chamorro" },
        { code: "ce",       name: "Chechen" },
        { code: "chk",      name: "Chuukese" },
        { code: "cv",       name: "Chuvash" },
        { code: "crh",      name: "Crimean Tatar" },
        { code: "din",      name: "Dinka" },
        { code: "dov",      name: "Dombe" },
        { code: "dyu",      name: "Dyula" },
        { code: "dz",       name: "Dzongkha" },
        { code: "fo",       name: "Faroese" },
        { code: "fj",       name: "Fijian" },
        { code: "fon",      name: "Fon" },
        { code: "fur",      name: "Friulian" },
        { code: "ff",       name: "Fulani" },
        { code: "gaa",      name: "Ga" },
        { code: "cnh",      name: "Hakha Chin" },
        { code: "hil",      name: "Hiligaynon" },
        { code: "hrx",      name: "Hunsrik" },
        { code: "iba",      name: "Iban" },
        { code: "jam",      name: "Jamaican Patois" },
        { code: "kac",      name: "Jingpo" },
        { code: "kl",       name: "Kalaallisut" },
        { code: "kr",       name: "Kanuri" },
        { code: "pam",      name: "Kapampangan" },
        { code: "kha",      name: "Khasi" },
        { code: "cgg",      name: "Kiga" },
        { code: "kg",       name: "Kikongo" },
        { code: "ktu",      name: "Kituba" },
        { code: "trp",      name: "Kokborok" },
        { code: "kv",       name: "Komi" },
        { code: "ltg",      name: "Latgalian" },
        { code: "lij",      name: "Ligurian" },
        { code: "li",       name: "Limburgish" },
        { code: "lmo",      name: "Lombard" },
        { code: "luo",      name: "Luo" },
        { code: "mad",      name: "Madurese" },
        { code: "mak",      name: "Makassar" },
        { code: "ms-Arab",  name: "Malay (Jawi)" },
        { code: "mam",      name: "Mam" },
        { code: "gv",       name: "Manx" },
        { code: "mh",       name: "Marshallese" },
        { code: "mwr",      name: "Marwadi" },
        { code: "mfe",      name: "Mauritian Creole" },
        { code: "chm",      name: "Meadow Mari" },
        { code: "min",      name: "Minang" },
        { code: "nhe",      name: "Nahuatl (Eastern Huasteca)" },
        { code: "ndc",      name: "Ndau" },
        { code: "nr",       name: "Ndebele (South)" },
        { code: "new",      name: "Nepalbhasa (Newari)" },
        { code: "nqo",      name: "NKo" },
        { code: "nus",      name: "Nuer" },
        { code: "oc",       name: "Occitan" },
        { code: "os",       name: "Ossetian" },
        { code: "pag",      name: "Pangasinan" },
        { code: "pap",      name: "Papiamento" },
        { code: "pa-Arab",  name: "Punjabi (Shahmukhi)" },
        { code: "kek",      name: "Q'eqchi'" },
        { code: "rom",      name: "Romani" },
        { code: "rn",       name: "Rundi" },
        { code: "se",       name: "Sami (North)" },
        { code: "sg",       name: "Sango" },
        { code: "sat",      name: "Santali" },
        { code: "crs",      name: "Seychellois Creole" },
        { code: "shn",      name: "Shan" },
        { code: "scn",      name: "Sicilian" },
        { code: "szl",      name: "Silesian" },
        { code: "sus",      name: "Susu" },
        { code: "ss",       name: "Swati" },
        { code: "ty",       name: "Tahitian" },
        { code: "zgh",      name: "Tamazight (Tifinagh)" },
        { code: "tzm",      name: "Tamazight (Latin)" },
        { code: "tet",      name: "Tetum" },
        { code: "bo",       name: "Tibetan" },
        { code: "tiv",      name: "Tiv" },
        { code: "tpi",      name: "Tok Pisin" },
        { code: "to",       name: "Tongan" },
        { code: "tn",       name: "Tswana" },
        { code: "tcy",      name: "Tulu" },
        { code: "tum",      name: "Tumbuka" },
        { code: "tyv",      name: "Tuvan" },
        { code: "udm",      name: "Udmurt" },
        { code: "ve",       name: "Venda" },
        { code: "vec",      name: "Venetian" },
        { code: "war",      name: "Waray" },
        { code: "wo",       name: "Wolof" },
        { code: "sah",      name: "Yakut" },
        { code: "yua",      name: "Yucatec Maya" },
        { code: "zap",      name: "Zapotec" }
    ];
    SUPPORTED_LANGS.sort((a, b) => a.name.localeCompare(b.name));

    // ======
    // #endregion INTERNACIONALIZAÇÃO E CONFIGURAÇÕES
    // ======

    // ======
    // #region FUNÇÕES DE TRADUÇÃO
    // ======

    const API_URL_IA = "https://api.longcat.chat/openai/v1/chat/completions";

    // --- FUNÇÃO PARA PEGAR AS CONFIGURAÇÕES ---
    function getConfig() {
        return {
            mode: GM_getValue('CFG_MODE', 'GOOGLE'),
            targetLang: GM_getValue('CFG_LANG', navigator.language.split('-')[0]),
            keysString: GM_getValue("LONGCAT_KEYS_ARRAY", []).join(', '),
            shortcuts: GM_getValue('CFG_SHORTCUTS', [])
        };
    }

    // --- FUNÇÃO PARA SALVAR AS CONFIGURAÇÕES ---
    function saveConfig(config) {
        GM_setValue('CFG_MODE', config.mode);
        GM_setValue('CFG_LANG', config.targetLang);
        const cleanKeys = config.keysString.split(',').map(k => k.trim()).filter(k => k.length > 5);
        GM_setValue("LONGCAT_KEYS_ARRAY", cleanKeys);
        GM_setValue('CFG_SHORTCUTS', config.shortcuts || []);
    }

    // --- FUNÇÃO PARA PEGAR UMA KEY ALEATÓRIA ---
    function getRandomApiKey() {
        const keys = GM_getValue("LONGCAT_KEYS_ARRAY", []);
        return keys.length > 0 ? keys[Math.floor(Math.random() * keys.length)] : null;
    }

    // ======
    // #endregion FUNÇÕES DE TRADUÇÃO
    // ======

    // ======
    // #region MOTORES DE TRADUÇÃO
    // ======

    // --- GOOGLE TRADUTOR---
    function translateGoogle(text, targetLang, callback, errorCallback) {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        GM_xmlhttpRequest({
            method: "GET", url: url,
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const json = JSON.parse(response.responseText);
                        let translated = "";
                        if (json && json[0]) json[0].forEach(seg => { if (seg[0]) translated += seg[0]; });
                        callback(translated);
                    } catch (e) { errorCallback("Google JSON Error"); }
                } else errorCallback(`Google Status: ${response.status}`);
            },
            onerror: () => errorCallback("Google Connection Fail")
        });
    }

    // --- LONGCAT AI ---
    function translateAI(text, targetLang, callback, errorCallback) {
        const apiKey = getRandomApiKey();
        if (!apiKey) return errorCallback("SEM_KEY");
        const langName = SUPPORTED_LANGS.find(l => l.code === targetLang)?.name || targetLang;
        const data = {
            model: "LongCat-Flash-Chat",
            messages: [
                { role: "system", content: `
                    Act as a professional native translator for ${langName}.
                    Translate the provided text ensuring it sounds natural, idiomatic, and culturally appropriate for a native speaker.

                    Strict Rules:
                    1. Maintain the original tone and intent (e.g., formal, technical, or persuasive).
                    2. Keep the exact same formatting, including line breaks, markdown, and special characters.
                    3. Use localized terminology instead of literal translations.
                    4. Return ONLY the translated text. Do not include explanations, notes, or introductory remarks.`
                },
                { role: "user", content: text }
            ],
            temperature: 0.1
        };

        // --- REQUSIÇÃO ---
        GM_xmlhttpRequest({
            method: "POST", url: API_URL_IA,
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
            data: JSON.stringify(data),
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const json = JSON.parse(response.responseText);
                        if (json.choices?.length > 0) callback(json.choices[0].message.content.trim());
                        else errorCallback("AI Empty");
                    } catch (e) { errorCallback("AI JSON Error"); }
                } else errorCallback(`AI Status: ${response.status}`);
            },
            onerror: () => errorCallback("AI Connection Fail")
        });
    }

    // ======
    // #endregion MOTORES DE TRADUÇÃO
    // ======

    // ======
    // #region UI
    // ======

    // --- ESCUDO DE INTERFACE ---
    class ShieldedUI {
        constructor() {
            this.hostElement = null;
            this.shadowRoot = null;
            this.selectedLangCode = null;
            this.policy = null;
            if (window.trustedTypes && window.trustedTypes.createPolicy) {
                try {
                    this.policy = window.trustedTypes.createPolicy('ohas-tradutor-policy-' + Math.random().toString(36).substring(7), {
                        createHTML: input => input
                    });
                } catch(e) {}
            }
        }

        // --- MÉTODO SEGURO ---
        _setSafeHTML(element, html) {
            if (!element) return;
            if (this.policy) {
                element.innerHTML = this.policy.createHTML(html);
            } else {
                element.innerHTML = html;
            }
        }

        // --- HOST & SHADOW DOM ---
        _ensureHost() {
            const hostId = 'ohas-tradutor';
            this.hostElement = document.getElementById(hostId);
            if (!this.hostElement) {
                this.hostElement = document.createElement('div');
                this.hostElement.id = hostId;
                (document.documentElement || document.body).appendChild(this.hostElement);
                this.shadowRoot = this.hostElement.attachShadow({ mode: 'open' });
                const styleElement = document.createElement('style');
                styleElement.textContent = this._getStyles();
                this.shadowRoot.appendChild(styleElement);
                this._buildStructure();
            }
        }

        // --- CSS ---
        _getStyles() {
            return `
            @import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;500;600;700&display=swap');
                :host {
                    all: initial !important;
                    position: fixed !important;
                    z-index: 2147483647 !important;
                    pointer-events: none !important;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
                    --bg: #ffffff;
                    --text: #2d3748;
                    --text-sec: #718096;
                    --border: #e2e8f0;
                    --primary: #3182ce;
                    --primary-hover: #2b6cb0;
                    --surface: #f7fafc;
                    --item-hover: #ebf8ff;
                    --shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                    --radius: 12px;
                    --toast-bg: #2d3748;
                    --toast-text: #fff;
                    --danger: #e53e3e;
                }

                @media (prefers-color-scheme: dark) {
                    :host {
                        --bg: #1a202c;
                        --text: #edf2f7;
                        --text-sec: #a0aec0;
                        --border: #2d3748;
                        --primary: #4299e1;
                        --primary-hover: #63b3ed;
                        --surface: #2d3748;
                        --item-hover: #2c5282;
                        --shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
                        --toast-bg: #edf2f7;
                        --toast-text: #1a202c;
                    }
                }

                .ui-layer {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    pointer-events: none;
                    display: flex;
                    flex-direction: column;
                }

                /* --- MODAL --- */
                .modal-overlay {
                    position: fixed !important;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.5) !important;
                    backdrop-filter: blur(4px) !important;
                    display: none;
                    align-items: center !important;
                    justify-content: center !important;
                    pointer-events: auto !important;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .modal-overlay.visible {
                    display: flex !important;
                    opacity: 1;
                }

                .modal-box {
                    background: var(--bg) !important;
                    color: var(--text) !important;
                    padding: 0 !important;
                    border-radius: var(--radius) !important;
                    width: 380px !important;
                    border: 1px solid var(--border) !important;
                    box-shadow: var(--shadow) !important;
                    display: flex !important;
                    flex-direction: column !important;
                    transform: scale(0.95);
                    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    overflow: hidden !important;
                }

                .modal-overlay.visible .modal-box {
                    transform: scale(1);
                }

                /* --- TABS --- */
                .tabs-head {
                    display: flex !important;
                    border-bottom: 1px solid var(--border) !important;
                    background: var(--surface) !important;
                    padding: 0 12px !important;
                }

                .tab-btn {
                    flex: 1 !important;
                    padding: 14px 12px !important;
                    background: transparent !important;
                    border: none !important;
                    border-bottom: 2px solid transparent !important;
                    color: var(--text-sec) !important;
                    font-weight: 600 !important;
                    cursor: pointer !important;
                    border-radius: 0 !important;
                    font-size: 13px !important;
                    text-transform: uppercase !important;
                }

                .tab-btn:hover {
                    color: var(--text) !important;
                }

                .tab-btn.active {
                    color: var(--primary) !important;
                    border-bottom-color: var(--primary) !important;
                    background: transparent !important;
                }

                .tab-content {
                    display: none !important;
                    padding: 24px !important;
                    gap: 16px !important;
                    flex-direction: column !important;
                }

                .tab-content.active {
                    display: flex !important;
                }

                /* --- FORMULÁRIOS --- */
                label {
                    display: block !important;
                    font-size: 12px !important;
                    font-weight: 700 !important;
                    color: var(--text-sec) !important;
                    margin-bottom: 6px !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.5px !important;
                }

                input[type="text"],
                select {
                    width: 100% !important;
                    padding: 10px 12px !important;
                    background: var(--surface) !important;
                    color: var(--text) !important;
                    border: 1px solid var(--border) !important;
                    border-radius: 6px !important;
                    font-size: 14px !important;
                    box-sizing: border-box !important;
                    outline: none !important;
                    transition: border-color 0.2s, box-shadow 0.2s !important;
                }

                input:focus,
                select:focus {
                    border-color: var(--primary) !important;
                    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2) !important;
                }

                /* --- LISTAGEM --- */
                .custom-list {
                    height: 140px !important;
                    overflow-y: auto !important;
                    background: var(--surface) !important;
                    border: 1px solid var(--border) !important;
                    border-radius: 6px !important;
                    margin-top: 5px !important;
                    scrollbar-width: thin;
                    scrollbar-color: var(--text-sec) transparent;
                }

                .custom-list::-webkit-scrollbar {
                    width: 6px;
                }

                .custom-list::-webkit-scrollbar-thumb {
                    background: var(--text-sec);
                    border-radius: 3px;
                }

                .lang-item {
                    padding: 8px 12px !important;
                    font-size: 14px !important;
                    color: var(--text) !important;
                    cursor: pointer !important;
                    transition: background 0.15s ease, padding-left 0.15s ease !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: space-between !important;
                }

                .lang-item:hover {
                    background: var(--item-hover) !important;
                    padding-left: 16px !important;
                }

                .lang-item.selected {
                    background: var(--primary) !important;
                    color: white !important;
                    font-weight: 600 !important;
                }

                /* --- LISTA DE ATALHOS --- */
                .shortcut-row {
                    display: flex !important;
                    align-items: center !important;
                    justify-content: space-between !important;
                    padding: 8px 10px !important;
                    background: var(--surface) !important;
                    border-radius: 6px !important;
                    margin-bottom: 6px !important;
                    border: 1px solid var(--border) !important;
                }

                .sc-info {
                    display: flex !important;
                    flex-direction: column !important;
                }

                .sc-keys {
                    font-weight: 700 !important;
                    color: var(--primary) !important;
                    font-size: 13px !important;
                }

                .sc-lang {
                    font-size: 12px !important;
                    color: var(--text-sec) !important;
                }

                .btn-del {
                    background: transparent !important;
                    color: var(--danger) !important;
                    border: none !important;
                    padding: 4px 8px !important;
                    font-size: 16px !important;
                    cursor: pointer !important;
                }

                .btn-del:hover {
                    background: rgba(229, 62, 62, 0.1) !important;
                    border-radius: 4px !important;
                }

                /* --- BOTÕES GERAIS --- */
                .btn-row {
                    display: flex !important;
                    justify-content: space-between !important;
                    margin-top: 8px !important;
                }

                button {
                    padding: 10px 20px !important;
                    border: none !important;
                    cursor: pointer !important;
                    border-radius: 6px !important;
                    font-weight: 600 !important;
                    font-size: 14px !important;
                    transition: transform 0.1s ease, filter 0.2s !important;
                }

                button:active {
                    transform: scale(0.96) !important;
                }

                .btn-save {
                    background: var(--primary) !important;
                    color: white !important;
                    box-shadow: 0 4px 6px rgba(66, 153, 225, 0.3) !important;
                }

                .btn-save:hover {
                    filter: brightness(110%) !important;
                }

                .btn-cancel {
                    background: transparent !important;
                    color: var(--text-sec) !important;
                    border: 1px solid var(--border) !important;
                }

                .btn-cancel:hover {
                    color: var(--text) !important;
                    border-color: var(--text-sec) !important;
                    background: var(--surface) !important;
                }

                /* --- NOTIFICAÇÃO --- */
                .toast-classic {
                    position: fixed !important;
                    bottom: 30px !important;
                    left: 50% !important;
                    z-index: 2147483647 !important;
                    transform: translateX(-50%) translateY(150%);
                    opacity: 0;
                    background: var(--bg) !important;
                    color: var(--text) !important;
                    padding: 12px 24px !important;
                    border-radius: 50px !important;
                    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3) !important;
                    border: 1px solid var(--border) !important;
                    font-size: 14px !important;
                    font-weight: 600 !important;
                    display: flex !important;
                    align-items: center !important;
                    gap: 10px !important;
                    white-space: nowrap !important;
                    pointer-events: none !important;
                    animation: toastPopup 3.5s cubic-bezier(0.23, 1, 0.32, 1) forwards !important;
                }

                @keyframes toastPopup {
                    0% {
                        transform: translateX(-50%) translateY(150%);
                        opacity: 0;
                    }

                    10% {
                        transform: translateX(-50%) translateY(0);
                        opacity: 1;
                    }

                    85% {
                        transform: translateX(-50%) translateY(0);
                        opacity: 1;
                    }

                    100% {
                        transform: translateX(-50%) translateY(150%);
                        opacity: 0;
                    }
                }

                .toast-icon {
                    font-size: 18px !important;
                }
            `;
        }

        // --- ESTRUTURA HTML ---
        _buildStructure() {
            const container = document.createElement('div');
            container.className = 'ui-layer';
            const toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            container.appendChild(toastContainer);
            this.tempShortcuts = [];
            this.tempShortcutLang = 'en';
            const modalHtml = `
                <div id="modal" class="modal-overlay">
                    <div class="modal-box">
                        <!-- ABAS -->
                        <div class="tabs-head">
                            <button class="tab-btn active" id="btn-tab-gen">${T('tab_general')}</button>
                            <button class="tab-btn" id="btn-tab-adv">${T('tab_shortcuts')}</button>
                        </div>

                        <!-- CONTEÚDO: GERAL -->
                        <div id="tab-gen" class="tab-content active">
                            <div>
                                <label>${T('lbl_lang')}</label>
                                <input type="text" id="lang-search" placeholder="${T('lbl_search')}">
                                <div id="lang-list" class="custom-list"></div>
                            </div>
                            <div>
                                <label>${T('lbl_mode')}</label>
                                <select id="cfg-mode">
                                    <option value="GOOGLE">Google Translate</option>
                                    <option value="IA">IA (LongCat)</option>
                                </select>
                            </div>
                            <div id="key-area" style="display:none">
                                <label>${T('lbl_key')}</label>
                                <input type="text" id="cfg-key">
                            </div>
                        </div>

                        <!-- CONTEÚDO: ATALHOS -->
                        <div id="tab-adv" class="tab-content">
                            <!-- 1. IDIOMA -->
                            <div>
                                <label>${T('lbl_lang')}</label>
                                <input type="text" id="sc-lang-search" placeholder="${T('lbl_search')}">
                                <div id="sc-lang-list" class="custom-list" style="height: 100px !important;"></div>
                            </div>

                            <!-- 2. TECLA -->
                            <div>
                                <label>${T('lbl_hotkey')}</label>
                                <input type="text" id="sc-key-input" placeholder="${T('ph_hotkey')}" readonly>
                            </div>

                            <!-- BOTÃO ADICIONAR -->
                            <button id="btn-add-sc" style="background:var(--surface); border:1px solid var(--border); color:var(--primary); width:100%">${T('btn_add')}</button>

                            <!-- LISTA -->
                            <div style="border-top:1px solid var(--border); padding-top:10px;">
                                <label>${T('lbl_shortcuts_list')}</label>
                                <div id="saved-shortcuts" class="custom-list" style="height: 100px !important; background:transparent; border:none;"></div>
                            </div>
                        </div>

                        <!-- RODAPÉ -->
                        <div class="btn-row" style="padding: 0 24px 24px 24px;">
                            <button id="btn-cancel" class="btn-cancel">${T('btn_cancel')}</button>
                            <button id="btn-save" class="btn-save">${T('btn_save')}</button>
                        </div>
                    </div>
                </div>
            `;

            const wrapper = document.createElement('div');
            this._setSafeHTML(wrapper, modalHtml);
            while(wrapper.firstChild) container.appendChild(wrapper.firstChild);
            this.shadowRoot.appendChild(container);

            // --- LÓGICA DE ABAS ---
            const tabGen = this.shadowRoot.getElementById('tab-gen');
            const tabAdv = this.shadowRoot.getElementById('tab-adv');
            const btnTabGen = this.shadowRoot.getElementById('btn-tab-gen');
            const btnTabAdv = this.shadowRoot.getElementById('btn-tab-adv');
            const switchTab = (toGeneral) => {
                if (toGeneral) {
                    tabGen.classList.add('active'); tabAdv.classList.remove('active');
                    btnTabGen.classList.add('active'); btnTabAdv.classList.remove('active');
                } else {
                    tabAdv.classList.add('active'); tabGen.classList.remove('active');
                    btnTabAdv.classList.add('active'); btnTabGen.classList.remove('active');
                }
            };
            btnTabGen.onclick = () => switchTab(true);
            btnTabAdv.onclick = () => switchTab(false);

            // --- EVENTOS GERAIS ---
            this.selectedLangCode = getConfig().targetLang;
            this._populateLangs('lang-list', '', this.selectedLangCode, (code) => this.selectedLangCode = code);
            this.shadowRoot.getElementById('lang-search').oninput = (e) =>
            this._populateLangs('lang-list', e.target.value, this.selectedLangCode, (code) => this.selectedLangCode = code);
            this.shadowRoot.getElementById('cfg-mode').onchange = (e) =>
            this.shadowRoot.getElementById('key-area').style.display = e.target.value === 'IA' ? 'block' : 'none';
            this.shadowRoot.getElementById('btn-cancel').onclick = () => this.toggleModal(false);
            this.shadowRoot.getElementById('btn-save').onclick = () => this.saveAndClose();

            // --- LÓGICA DE EVENTOS DA ABA DE ATALHOS ---
            // GRAVAÇÃO DE TECLA
            const keyInput = this.shadowRoot.getElementById('sc-key-input');
            keyInput.onkeydown = (e) => {
                e.preventDefault();
                e.stopPropagation();
                let keys = [];
                if (e.ctrlKey) keys.push('Ctrl');
                if (e.altKey) keys.push('Alt');
                if (e.shiftKey) keys.push('Shift');
                if (e.metaKey) keys.push('Meta');
                if (!['Control','Alt','Shift','Meta'].includes(e.key)) {
                    keys.push(e.key.length === 1 ? e.key.toUpperCase() : e.key);
                }
                if (keys.length > 0) keyInput.value = keys.join('+');
            };

            // SELETOR DE LÍNGUA DO ATALHO
            this.shadowRoot.getElementById('sc-lang-search').oninput = (e) =>
            this._populateLangs('sc-lang-list', e.target.value, this.tempShortcutLang, (code) => this.tempShortcutLang = code);

            // ADICIONAR ATALHO
            this.shadowRoot.getElementById('btn-add-sc').onclick = () => {
                const keys = keyInput.value;
                if (!keys || keys.length < 1) return;
                this.tempShortcuts = this.tempShortcuts.filter(s => s.keys !== keys);
                this.tempShortcuts.push({ keys: keys, lang: this.tempShortcutLang });
                keyInput.value = "";
                this._renderShortcutsList();
            };
        }

        // --- LISTAGEM DE IDIOMAS GENÉRICA ---
        _populateLangs(containerId, filter = "", currentSel, onSelect) {
            const list = this.shadowRoot.getElementById(containerId);
            if (!list) return;
            list.textContent = '';
            const term = filter.toLowerCase();
            SUPPORTED_LANGS.forEach(l => {
                if (l.name.toLowerCase().includes(term) || l.code.includes(term)) {
                    const item = document.createElement('div');
                    item.className = 'lang-item';
                    if (l.code === currentSel) item.classList.add('selected');
                    this._setSafeHTML(item, `<span>${l.name}</span> <span style="font-size:10px; opacity:0.6">${l.code}</span>`);
                    item.onclick = () => {
                        const old = list.querySelector('.selected');
                        if (old) old.classList.remove('selected');
                        item.classList.add('selected');
                        onSelect(l.code);
                    };
                    list.appendChild(item);
                }
            });
        }

        // --- RENDERIZAR LISTA DE ATALHOS ---
        _renderShortcutsList() {
            const container = this.shadowRoot.getElementById('saved-shortcuts');
            container.textContent = '';
            this.tempShortcuts.forEach((sc, idx) => {
                const row = document.createElement('div');
                row.className = 'shortcut-row';
                const langName = SUPPORTED_LANGS.find(l => l.code === sc.lang)?.name || sc.lang;
                const html = `<div class="sc-info"><span class="sc-keys">${sc.keys}</span><span class="sc-lang">${langName}</span></div><button class="btn-del" data-idx="${idx}">🗑️</button>`;
                this._setSafeHTML(row, html);
                row.querySelector('.btn-del').onclick = () => {
                    this.tempShortcuts.splice(idx, 1);
                    this._renderShortcutsList();
                };
                container.appendChild(row);
            });
        }

        // --- MODAL TOGGLE ---
        toggleModal(show) {
            this._ensureHost();
            const modal = this.shadowRoot.getElementById('modal');
            const cfg = getConfig();
            if (show) {
                this.shadowRoot.getElementById('lang-search').value = "";
                this.selectedLangCode = cfg.targetLang;
                this._populateLangs('lang-list', "", this.selectedLangCode, (c) => this.selectedLangCode = c);
                this.tempShortcuts = [...cfg.shortcuts];
                this.tempShortcutLang = 'en';
                this.shadowRoot.getElementById('sc-key-input').value = "";
                this.shadowRoot.getElementById('sc-lang-search').value = "";
                this._populateLangs('sc-lang-list', "", 'en', (c) => this.tempShortcutLang = c);
                this._renderShortcutsList();
                this.shadowRoot.getElementById('cfg-mode').value = cfg.mode;
                this.shadowRoot.getElementById('cfg-key').value = cfg.keysString;
                this.shadowRoot.getElementById('key-area').style.display = cfg.mode === 'IA' ? 'block' : 'none';
                modal.classList.add('visible');
            } else modal.classList.remove('visible');
        }

        // --- SALVAR E FECHAR ---
        saveAndClose() {
            saveConfig({
                targetLang: this.selectedLangCode || getConfig().targetLang,
                mode: this.shadowRoot.getElementById('cfg-mode').value,
                keysString: this.shadowRoot.getElementById('cfg-key').value,
                shortcuts: this.tempShortcuts
            });
            this.toggleModal(false);
            this.showToast(T('toast_saved'), 'success');
        }

        // --- TOAST ---
        showToast(msg, type = 'info') {
            this._ensureHost();
            const container = this.shadowRoot.querySelector('.ui-layer');
            const oldToast = this.shadowRoot.getElementById('temp-toast');
            if (oldToast) oldToast.remove();
            const toast = document.createElement('div');
            toast.id = 'temp-toast';
            toast.className = 'toast-classic';
            let icon = 'ℹ️';
            if (type === 'error') icon = '❌';
            if (type === 'success') icon = '✅';
            if (type === 'loading') icon = '⏳';
            this._setSafeHTML(toast, `<span class="toast-icon">${icon}</span> <span>${msg}</span>`);
            container.appendChild(toast);
            setTimeout(() => {
                if (toast.isConnected) toast.remove();
            }, 3600);
        }
    }
    const ui = new ShieldedUI();

    // ======
    // #endregion UI
    // ======

    // ======
    // #region LÓGICA CORE
    // ======

    // --- REPLACE SEGURO (CLIPBOARD + PASTE) ---
    function safeReplace(targetElement, newText) {
        GM_setClipboard(newText, "text");
        if (!targetElement) return;
        try { targetElement.focus(); } catch(e) {}
        let success = false;
        try {
            success = document.execCommand("paste");
        } catch (e) {}
        if (!success) {
            success = document.execCommand("insertText", false, newText);
        }
        if (!success) {
            if (typeof targetElement.value === 'string' && targetElement.selectionStart !== undefined) {
                const start = targetElement.selectionStart;
                const end = targetElement.selectionEnd;
                const val = targetElement.value;
                targetElement.value = val.substring(0, start) + newText + val.substring(end);
                targetElement.selectionStart = targetElement.selectionEnd = start + newText.length;
                targetElement.dispatchEvent(new Event('input', { bubbles: true }));
            } else if (targetElement.isContentEditable) {
                const sel = window.getSelection();
                if (sel.rangeCount) {
                    const range = sel.getRangeAt(0);
                    range.deleteContents();
                    range.insertNode(document.createTextNode(newText));
                }
            }
        }
    }

    // --- LÓGICA DE TRADUÇÃO ---
    function runTranslation(forceLang = null) {
        ui._ensureHost();
        let textToTranslate = "";
        let targetElement = document.activeElement;
        let isSelection = false;
        const sel = window.getSelection();
        const rawSelection = sel.toString();
        if (targetElement && (targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
            const start = targetElement.selectionStart;
            const end = targetElement.selectionEnd;
            if (start !== end) {
                textToTranslate = targetElement.value.substring(start, end);
                isSelection = true;
            }
        } else if (rawSelection.trim().length > 0) {
            textToTranslate = rawSelection;
            isSelection = true;
            if (sel.anchorNode && sel.anchorNode.parentElement && sel.anchorNode.parentElement.isContentEditable) {
                 targetElement = sel.anchorNode.parentElement;
            }
        }
        if (!isSelection || !textToTranslate.trim()) {
            ui.showToast(T('toast_sel'), "error");
            return;
        }
        ui.showToast(T('toast_translating'), "loading");
        const cfg = getConfig();
        const finalLang = forceLang || cfg.targetLang;
        const onSuccess = (result) => {
            safeReplace(targetElement, result);
            ui.showToast(T('toast_done'), "success");
        };
        const onError = (msg) => {
            if (msg === "SEM_KEY") {
                ui.showToast(T('toast_no_key'), "error");
                ui.toggleModal(true);
            } else ui.showToast(msg, "error");
        };
        if (cfg.mode === 'IA') translateAI(textToTranslate, finalLang, onSuccess, onError);
        else translateGoogle(textToTranslate, finalLang, onSuccess, onError);
    }

    // --- MENUS ---
    GM_registerMenuCommand(T('menu_translate'), runTranslation);
    GM_registerMenuCommand(T('menu_config'), () => ui.toggleModal(true));

    // --- ATALHOS DE TECLADO ---
    window.addEventListener('keydown', function(e) {
        const cfg = getConfig();
        if (cfg.shortcuts && cfg.shortcuts.length > 0) {
            const pressedKeys = [];
            if (e.ctrlKey) pressedKeys.push('Ctrl');
            if (e.altKey) pressedKeys.push('Alt');
            if (e.shiftKey) pressedKeys.push('Shift');
            if (e.metaKey) pressedKeys.push('Meta');
            if (!['Control','Alt','Shift','Meta'].includes(e.key)) {
                pressedKeys.push(e.key.length === 1 ? e.key.toUpperCase() : e.key);
            }
            const combo = pressedKeys.join('+');
            const match = cfg.shortcuts.find(s => s.keys === combo);
            if (match) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                runTranslation(match.lang);
                return;
            }
        }

        // ATALHO PADRÃO (ALT+T)
        if (e.altKey && (e.key === 't' || e.key === 'T')) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            runTranslation();
        }
    }, true);

    // =======
    // #endregion LÓGICA CORE
    // ======

})();