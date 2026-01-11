// ==UserScript==
// @name                Better Greasy Fork
// @name:pt-BR          Greasy Fork Aprimorado
// @name:zh-CN          Greasy Fork 增强
// @name:zh-TW          Greasy Fork 增強
// @name:fr-CA          Greasy Fork Amélioré
// @name:ckb            Greasy Fork ـی باشتر
// @name:ar             Greasy Fork محسن
// @name:be             Палепшаны Greasy Fork
// @name:bg             Подобрен Greasy Fork
// @name:cs             Vylepšený Greasy Fork
// @name:da             Forbedret Greasy Fork
// @name:de             Verbesserter Greasy Fork
// @name:el             Βελτιωμένο Greasy Fork
// @name:en             Better Greasy Fork
// @name:eo             Pli bona Greasy Fork
// @name:es             Greasy Fork Mejorado
// @name:fi             Parannettu Greasy Fork
// @name:fr             Greasy Fork Amélioré
// @name:he             Greasy Fork משופר
// @name:hr             Poboljšani Greasy Fork
// @name:hu             Jobb Greasy Fork
// @name:id             Greasy Fork Ditingkatkan
// @name:it             Greasy Fork Migliorato
// @name:ja             Greasy Fork 強化
// @name:ka             გაუმჯობესებული Greasy Fork
// @name:ko             Greasy Fork 향상
// @name:mr             सुधारित Greasy Fork
// @name:nb             Forbedret Greasy Fork
// @name:nl             Verbeterde Greasy Fork
// @name:pl             Ulepszony Greasy Fork
// @name:ro             Greasy Fork Îmbunătățit
// @name:ru             Улучшенный Greasy Fork
// @name:sk             Vylepšený Greasy Fork
// @name:sr             Побољшани Greasy Fork
// @name:sv             Förbättrad Greasy Fork
// @name:th             Greasy Fork ปรับปรุง
// @name:tr             Geliştirilmiş Greasy Fork
// @name:uk             Покращений Greasy Fork
// @name:ug             ئەلالاشتۇرۇلغان Greasy Fork
// @name:vi             Greasy Fork Nâng cao
// @namespace           https://github.com/0H4S
// @version             2.0
// @description         Enhance Greasy Fork usability with this function package: adds identifier icons, full HTML toolbar to edit descriptions/comments, and a direct download button. Includes a translation feature for over 100 languages for page content and allows advanced customization via metadata. A technical tool designed to make script navigation and management much more practical.
// @description:pt-BR   Melhore a usabilidade do Greasy Fork com este pacote de funções: adiciona ícones identificadores, barra de ferramentas HTML completa para editar descrições/comentários e botão de download direto. Inclui também um recurso de tradução para mais de 100 idiomas em cada conteúdo da página, além de permitir personalização avançada via metadados. Uma ferramenta técnica desenvolvida para tornar a navegação e a gestão de scripts muito mais prática e organizada.
// @description:zh-CN   通过此功能包提高 Greasy Fork 的可用性：添加标识符图标、用于编辑描述/评论的完整 HTML 工具栏以及直接下载按钮。还包括页面内容的 100 多种语言翻译功能，并允许通过元数据进行高级自定义。旨在使脚本导航和管理更加实用和有条理的技术工具。
// @description:zh-TW   透過此功能包提高 Greasy Fork 的可用性：新增識別圖示、用於編輯描述/評論的完整 HTML 工具列以及直接下載按鈕。還包括頁面內容的 100 多種語言翻譯功能，並允許透過元數據進行進階自訂。旨在使腳本導航和管理更加實用和有條理的技術工具。
// @description:fr-CA   Améliorez l'utilisabilité de Greasy Fork avec cet ensemble de fonctionnalités : ajout d'icônes d'identification, barre d'outils HTML complète pour l'édition de descriptions/commentaires et bouton de téléchargement direct. Inclut également une fonction de traduction pour plus de 100 langues et permet une personnalisation avancée via métadonnées. Un outil technique conçu pour rendre la navigation et la gestion des scripts beaucoup plus pratiques.
// @description:ckb     بەکارهێنانی Greasy Fork باشتر بکە بەم پاکێجە: زیادکردنی ئایکۆنەکانی ناسینەوە، تووڵباڕی HTMLـی تەواو بۆ دەستکاریکردنی وەسف/لێدوانەکان، و دوگمەی دابەزاندنی ڕاستەوخۆ. هەروەها تایبەتمەندی وەرگێڕان بۆ زیاتر لە 100 زمان بۆ ناوەڕۆکی پەڕەکە لەخۆ دەگرێت و ڕێگە بە دەستکاریکردنی پێشکەوتوو دەدات لە ڕێگەی مێتاداتاوە. ئامرازێکی تەکنیکی بۆ ئاسانکردنی بەڕێوەبردنی سکریپتەکان.
// @description:ar      حسّن سهولة استخدام Greasy Fork باستخدام حزمة الميزات هذه: أضف أيقونات تعريفية، وشريط أدوات HTML كامل لتحرير الأوصاف/التعليقات، وزر تنزيل مباشر. يتضمن أيضًا ميزة ترجمة لأكثر من 100 لغة لمحتوى الصفحة ويسمح بالتخصيص المتقدم عبر البيانات الوصفية. أداة تقنية مصممة لجعل التنقل في النصوص وإدارتها أكثر عملية وتنظيمًا.
// @description:be      Палепшыце зручнасць выкарыстання Greasy Fork з дапамогай гэтага пакета функцый: дадае значкі ідэнтыфікацыі, поўную панэль інструментаў HTML для рэдагавання апісанняў/каментарыяў і кнопку прамой загрузкі. Таксама ўключае функцыю перакладу на больш чым 100 моў для змесціва старонкі і дазваляе пашыраную наладу праз метаданыя. Тэхнічны інструмент, прызначаны для спрашчэння навігацыі і кіравання скрыптамі.
// @description:bg      Подобрете използваемостта на Greasy Fork с този пакет от функции: добавя идентификационни икони, пълна HTML лента с инструменти за редактиране на описания/коментари и бутон за директно изтегляне. Включва също функция за превод на над 100 езика за съдържанието на страницата и позволява разширено персонализиране чрез метаданни. Технически инструмент, предназначен да направи навигацията и управлението на скриптове много по-практични.
// @description:cs      Zlepšete použitelnost Greasy Fork pomocí tohoto balíčku funkcí: přidává identifikační ikony, plnohodnotný HTML panel nástrojů pro úpravu popisů/komentářů a tlačítko pro přímé stahování. Obsahuje také funkci překladu do více než 100 jazyků pro obsah stránky a umožňuje pokročilé přizpůsobení pomocí metadat. Technický nástroj navržený pro usnadnění navigace a správy skriptů.
// @description:da      Forbedr brugervenligheden af Greasy Fork med denne funktionspakke: Tilføjer identifikationsikoner, en komplet HTML-værktøjslinje til redigering af beskrivelser/kommentarer og en knap til direkte download. Inkluderer også en oversættelsesfunktion til over 100 sprog for sideindhold og tillader avanceret tilpasning via metadata. Et teknisk værktøj designet til at gøre navigation og administration af scripts meget mere praktisk.
// @description:de      Verbessern Sie die Benutzerfreundlichkeit von Greasy Fork mit diesem Funktionspaket: Fügt Identifikationssymbole, eine vollständige HTML-Symbolleiste zum Bearbeiten von Beschreibungen/Kommentaren und einen direkten Download-Button hinzu. Enthält außerdem eine Übersetzungsfunktion für über 100 Sprachen für Seiteninhalte und ermöglicht erweiterte Anpassungen über Metadaten. Ein technisches Tool, das die Navigation und Verwaltung von Skripten praktischer und organisierter macht.
// @description:el      Βελτιώστε τη χρηστικότητα του Greasy Fork με αυτό το πακέτο λειτουργιών: προσθέτει εικονίδια αναγνώρισης, πλήρη γραμμή εργαλείων HTML για επεξεργασία περιγραφών/σχολίων και κουμπί άμεσης λήψης. Περιλαμβάνει επίσης λειτουργία μετάφρασης για περισσότερες από 100 γλώσσες για το περιεχόμενο της σελίδας και επιτρέπει προηγμένη προσαρμογή μέσω μεταδεδομένων. Ένα τεχνικό εργαλείο σχεδιασμένο για να κάνει την πλοήγηση και τη διαχείριση των σεναρίων πιο πρακτική.
// @description:en      Enhance Greasy Fork usability with this function package: adds identifier icons, full HTML toolbar to edit descriptions/comments, and a direct download button. Includes a translation feature for over 100 languages for page content and allows advanced customization via metadata. A technical tool designed to make script navigation and management much more practical.
// @description:eo      Plibonigu la uzeblon de Greasy Fork per ĉi tiu funkcia pakaĵo: aldonas identigilajn ikonojn, plenan HTML-ilobreton por redakti priskribojn/komentojn, kaj rektan elŝut-butonon. Ankaŭ inkluzivas traduk-funkcion por pli ol 100 lingvoj por paĝa enhavo kaj ebligas altnivelan agordon per metadatumoj. Teknika ilo desegnita por fari skripto-navigadon kaj administradon multe pli praktika.
// @description:es      Mejore la usabilidad de Greasy Fork con este conjunto de funciones: añade iconos identificadores, barra de herramientas HTML completa para editar descripciones/comentarios y botón de descarga directa. Incluye también una función de traducción para más de 100 idiomas en cada contenido de la página, además de permitir personalización avanzada vía metadatos. Una herramienta técnica desarrollada para hacer la navegación y gestión de scripts mucho más práctica.
// @description:fi      Paranna Greasy Forkin käytettävyyttä tällä toimintopaketilla: lisää tunnistekuvakkeet, täydellisen HTML-työkalurivin kuvausten/kommenttien muokkaamiseen ja suoran latauspainikkeen. Sisältää myös käännöstoiminnon yli 100 kielelle sivun sisällölle ja mahdollistaa edistyneen mukauttamisen metatietojen avulla. Tekninen työkalu, joka on suunniteltu tekemään skriptien navigoinnista ja hallinnasta paljon käytännöllisempää.
// @description:fr      Améliorez l'utilisabilité de Greasy Fork avec cet ensemble de fonctionnalités : ajout d'icônes d'identification, barre d'outils HTML complète pour l'édition de descriptions/commentaires et bouton de téléchargement direct. Inclut également une fonction de traduction pour plus de 100 langues et permet une personnalisation avancée via métadonnées. Un outil technique conçu pour rendre la navigation et la gestion des scripts beaucoup plus pratiques.
// @description:he      שפר את השימושיות של Greasy Fork עם חבילת פונקציות זו: מוסיפה סמלי זיהוי, סרגל כלים HTML מלא לעריכת תיאורים/הערות, וכפתור הורדה ישירה. כוללת גם תכונת תרגום ליותר מ-100 שפות עבור תוכן הדף ומאפשרת התאמה אישית מתקדמת באמצעות מטא-נתונים. כלי טכני שנועד להפוך את הניווט וניהול הסקריפטים למעשיים ומאורגנים הרבה יותר.
// @description:hr      Poboljšajte iskoristivost Greasy Forka s ovim paketom funkcija: dodaje identifikacijske ikone, potpunu HTML alatnu traku za uređivanje opisa/komentara i gumb za izravno preuzimanje. Također uključuje značajku prijevoda za više od 100 jezika za sadržaj stranice i omogućuje naprednu prilagodbu putem metapodataka. Tehnički alat dizajniran kako bi navigaciju i upravljanje skriptama učinio mnogo praktičnijim.
// @description:hu      Javítsa a Greasy Fork használhatóságát ezzel a funkciócsomaggal: azonosító ikonokat, teljes HTML eszköztárat ad a leírások/megjegyzések szerkesztéséhez, valamint közvetlen letöltési gombot. Tartalmaz továbbá egy fordítási funkciót több mint 100 nyelvre az oldal tartalmához, és lehetővé teszi a fejlett testreszabást metaadatokon keresztül. Egy technikai eszköz, amelyet arra terveztek, hogy a szkriptek navigációját és kezelését sokkal praktikusabbá tegye.
// @description:id      Tingkatkan kegunaan Greasy Fork dengan paket fitur ini: menambahkan ikon pengenal, bilah alat HTML lengkap untuk mengedit deskripsi/komentar, dan tombol unduh langsung. Juga mencakup fitur terjemahan untuk lebih dari 100 bahasa untuk konten halaman dan memungkinkan penyesuaian tingkat lanjut melalui metadata. Alat teknis yang dirancang untuk membuat navigasi dan manajemen skrip menjadi jauh lebih praktis dan terorganisir.
// @description:it      Migliora l'usabilità di Greasy Fork con questo pacchetto di funzioni: aggiunge icone identificative, barra degli strumenti HTML completa per la modifica di descrizioni/commenti e pulsante di download diretto. Include anche una funzione di traduzione per oltre 100 lingue per il contenuto della pagina e consente una personalizzazione avanzata tramite metadati. Uno strumento tecnico progettato per rendere la navigazione e la gestione degli script molto più pratica.
// @description:ja      Greasy Forkのユーザビリティを向上させる機能パッケージ：識別アイコン、説明/コメント編集用の完全なHTMLツールバー、直接ダウンロードボタンを追加します。さらに、ページコンテンツの100以上の言語への翻訳機能や、メタデータによる高度なカスタマイズも可能です。スクリプトのナビゲーションと管理をより実用的かつ整理されたものにするために設計された技術ツールです。
// @description:ka      გააუმჯობესეთ Greasy Fork-ის მოხმარება ამ ფუნქციების პაკეტით: ამატებს საიდენტიფიკაციო ხატულებს, სრულ HTML ინსტრუმენტთა ზოლს აღწერილობების/კომენტარების რედაქტირებისთვის და პირდაპირი ჩამოტვირთვის ღილაკს. ასევე მოიცავს თარგმნის ფუნქციას 100-ზე მეტი ენისთვის გვერდის შინაარსისთვის და იძლევა გაფართოებული პერსონალიზაციის საშუალებას მეტამონაცემების მეშვეობით. ტექნიკური ინსტრუმენტი, რომელიც შექმნილია სკრიპტების ნავიგაციისა და მართვის გასამარტივებლად.
// @description:ko      Greasy Fork 사용성을 향상시키는 기능 패키지: 식별 아이콘, 설명/댓글 편집을 위한 전체 HTML 툴바, 직접 다운로드 버튼을 추가합니다. 페이지 콘텐츠에 대한 100개 이상의 언어 번역 기능과 메타데이터를 통한 고급 사용자 정의도 포함되어 있습니다. 스크립트 탐색 및 관리를 훨씬 더 실용적이고 체계적으로 만들기 위해 설계된 기술 도구입니다.
// @description:mr      या फंक्शन पॅकेजसह Greasy Fork ची उपयोगिता वाढवा: आयडेंटिफायर आयकॉन, वर्णन/टिप्पण्या संपादित करण्यासाठी पूर्ण HTML टूलबार आणि थेट डाउनलोड बटण जोडते. तसेच पृष्ठ सामग्रीसाठी 100 हून अधिक भाषांसाठी भाषांतर वैशिष्ट्य समाविष्ट करते आणि मेटाडेटाद्वारे प्रगत कस्टमायझेशनला अनुमती देते. स्क्रिप्ट नेव्हिगेशन आणि व्यवस्थापन अधिक व्यावहारिक आणि व्यवस्थित करण्यासाठी डिझाइन केलेले तांत्रिक साधन.
// @description:nb      Forbedre brukervennligheten til Greasy Fork med denne funksjonspakken: legger til identifikasjonsikoner, full HTML-verktøylinje for redigering av beskrivelser/kommentarer, og en knapp for direkte nedlasting. Inkluderer også en oversettelsesfunksjon for over 100 språk for sideinnhold og tillater avansert tilpasning via metadata. Et teknisk verktøy designet for å gjøre navigasjon og administrasjon av skript mye mer praktisk.
// @description:nl      Verbeter de bruikbaarheid van Greasy Fork met dit functiepakket: voegt identificatie-pictogrammen, een volledige HTML-werkbalk voor het bewerken van beschrijvingen/opmerkingen en een directe downloadknop toe. Bevat ook een vertaalfunctie voor meer dan 100 talen voor pagina-inhoud en maakt geavanceerde aanpassing via metadata mogelijk. Een technische tool die is ontworpen om scriptnavigatie en -beheer veel praktischer en georganiseerder te maken.
// @description:pl      Zwiększ użyteczność Greasy Fork dzięki temu pakietowi funkcji: dodaje ikony identyfikacyjne, pełny pasek narzędzi HTML do edycji opisów/komentarzy oraz przycisk bezpośredniego pobierania. Zawiera również funkcję tłumaczenia na ponad 100 języków dla treści strony i umożliwia zaawansowane dostosowywanie za pomocą metadanych. Narzędzie techniczne zaprojektowane w celu ułatwienia nawigacji i zarządzania skryptami.
// @description:ro      Îmbunătățiți utilizarea Greasy Fork cu acest pachet de funcții: adaugă pictograme de identificare, bară de instrumente HTML completă pentru editarea descrierilor/comentariilor și buton de descărcare directă. Include, de asemenea, o funcție de traducere pentru mai mult de 100 de limbi pentru conținutul paginii și permite personalizarea avansată prin metadate. Un instrument tehnic conceput pentru a face navigarea și gestionarea scripturilor mult mai practică.
// @description:ru      Улучшите удобство использования Greasy Fork с помощью этого пакета функций: добавляет значки идентификации, полную HTML-панель для редактирования описаний/комментариев и кнопку прямой загрузки. Также включает функцию перевода на более чем 100 языков для содержимого страницы и позволяет расширенную настройку через метаданные. Технический инструмент, предназначенный для упрощения навигации и управления скриптами.
// @description:sk      Zlepšite použiteľnosť Greasy Fork pomocou tohto balíka funkcií: pridáva identifikačné ikony, úplný panel s nástrojmi HTML na úpravu popisov/komentárov a tlačidlo priameho sťahovania. Obsahuje tiež funkciu prekladu do viac ako 100 jazykov pre obsah stránky a umožňuje pokročilé prispôsobenie prostredníctvom metadát. Technický nástroj navrhnutý tak, aby navigácia a správa skriptov boli oveľa praktickejšie a organizovanejšie.
// @description:sr      Poboljšajte upotrebljivost Greasy Fork-a sa ovim paketom funkcija: dodaje identifikacione ikone, punu HTML traku sa alatkama za uređivanje opisa/komentara i dugme za direktno preuzimanje. Takođe uključuje funkciju prevoda za više od 100 jezika za sadržaj stranice i omogućava napredno prilagođavanje putem metapodataka. Tehnička alatka dizajnirana da učini navigaciju i upravljanje skriptama mnogo praktičnijim.
// @description:sv      Förbättra användbarheten av Greasy Fork med detta funktionspaket: lägger till identifieringsikoner, fullständig HTML-verktygsfält för redigering av beskrivningar/kommentarer och en knapp för direkt nedladdning. Inkluderar även en översättningsfunktion för över 100 språk för sidinnehåll och tillåter avancerad anpassning via metadata. Ett tekniskt verktyg utformat för att göra skriptnavigering och hantering mycket mer praktisk.
// @description:th      ปรับปรุงความสามารถในการใช้งาน Greasy Fork ด้วยชุดฟังก์ชันนี้: เพิ่มไอคอนระบุตัวตน แถบเครื่องมือ HTML เต็มรูปแบบสำหรับแก้ไขคำอธิบาย/ความคิดเห็น และปุ่มดาวน์โหลดโดยตรง นอกจากนี้ยังมีฟีเจอร์การแปลภาษามากกว่า 100 ภาษาสำหรับเนื้อหาหน้าเว็บและอนุญาตให้ปรับแต่งขั้นสูงผ่านข้อมูลเมตา เครื่องมือทางเทคนิคที่ออกแบบมาเพื่อให้การนำทางและการจัดการสคริปต์ใช้งานได้จริงและเป็นระเบียบมากยิ่งขึ้น
// @description:tr      Bu özellik paketiyle Greasy Fork'un kullanılabilirliğini artırın: tanımlayıcı simgeler, açıklamaları/yorumları düzenlemek için tam HTML araç çubuğu ve doğrudan indirme düğmesi ekler. Ayrıca sayfa içeriği için 100'den fazla dile çeviri özelliği içerir ve meta veriler aracılığıyla gelişmiş özelleştirmeye izin verir. Komut dosyası gezinmesini ve yönetimini çok daha pratik ve düzenli hale getirmek için tasarlanmış teknik bir araç.
// @description:uk      Покращте зручність використання Greasy Fork за допомогою цього пакету функцій: додає значки ідентифікації, повну панель інструментів HTML для редагування описів/коментарів та кнопку прямого завантаження. Також включає функцію перекладу на понад 100 мов для вмісту сторінки та дозволяє розширене налаштування за допомогою метаданих. Технічний інструмент, розроблений для того, щоб зробити навігацію та керування скриптами набагато практичнішим.
// @description:ug      بۇ ئىقتىدار بولىقى ئارقىلىق Greasy Fork نىڭ ئىشلىتىشچانلىقىنى ئۆستۈرۈڭ: كىملىك ​​سىنبەلگىسى ، چۈشەندۈرۈش / باھالارنى تەھرىرلەش ئۈچۈن تولۇق HTML قورال بالدىقى ۋە بىۋاسىتە چۈشۈرۈش كۇنۇپكىسى قوشىدۇ. ئۇ يەنە بەت مەزمۇنى ئۈچۈن 100 دىن ئارتۇق تىلغا تەرجىمە قىلىش ئىقتىدارىنى ئۆز ئىچىگە ئالغان بولۇپ ، مېتا سانلىق مەلۇმატ ئارقىلىق ئىلغار خاسلاشتۇرۇشقا يول قويىدۇ. قوليازما يولباشچىسى ۋە باشقۇرۇشنى تېخىمۇ ئەمەلىي ۋە تەشكىللىك قىلىش ئۈچۈن لايىھەلەنگەن تېخنىكىلىق قورال.
// @description:vi      Cải thiện khả năng sử dụng của Greasy Fork với gói tính năng này: thêm các biểu tượng nhận dạng, thanh công cụ HTML đầy đủ để chỉnh sửa mô tả/bình luận và nút tải xuống trực tiếp. Cũng bao gồm tính năng dịch sang hơn 100 ngôn ngữ cho nội dung trang và cho phép tùy chỉnh nâng cao thông qua siêu dữ liệu. Một công cụ kỹ thuật được thiết kế để làm cho việc điều hướng và quản lý tập lệnh trở nên thực tế và có tổ chức hơn.
// @author              OHAS
// @license             CC-BY-NC-ND-4.0
// @copyright           2026 OHAS. All Rights Reserved.
// @match               https://greasyfork.org/*
// @match               https://cn-greasyfork.org/*
// @match               https://sleazyfork.org/*
// @icon                data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIG92ZXJmbG93PSJ2aXNpYmxlIj4KICAgIDxzdHlsZT4KICAgICAgICAuZGVzZW5oYXItY29udG9ybm8gewogICAgICAgICAgICBzdHJva2UtZGFzaGFycmF5OiAxMDA7CiAgICAgICAgICAgIHN0cm9rZS1kYXNob2Zmc2V0OiAxMDA7CiAgICAgICAgICAgIGFuaW1hdGlvbjogZGVzZW5oYXItY29udG9ybm8gMTBzIGVhc2UtaW4tb3V0IGluZmluaXRlOwogICAgICAgIH0KCiAgICAgICAgLm9uZGEtcHJlZW5jaGltZW50byB7CiAgICAgICAgICAgIGFuaW1hdGlvbjogb25kYS1wcmVlbmNoaW1lbnRvIDEwcyBlYXNlLWluLW91dCBpbmZpbml0ZTsKICAgICAgICB9CgogICAgICAgIEBrZXlmcmFtZXMgZGVzZW5oYXItY29udG9ybm8gewogICAgICAgICAgICAwJSB7CiAgICAgICAgICAgICAgICBzdHJva2UtZGFzaG9mZnNldDogMTAwOwogICAgICAgICAgICAgICAgc3Ryb2tlOiAjZmZmZmZmZmY7CiAgICAgICAgICAgIH0KICAgICAgICAgICAgMjUlIHsKICAgICAgICAgICAgICAgIHN0cm9rZS1kYXNob2Zmc2V0OiAwOwogICAgICAgICAgICAgICAgc3Ryb2tlOiAjZmZmZmZmZmY7CiAgICAgICAgICAgIH0KICAgICAgICAgICAgNzUlIHsKICAgICAgICAgICAgICAgIHN0cm9rZS1kYXNob2Zmc2V0OiAwOwogICAgICAgICAgICAgICAgc3Ryb2tlOiAjZmZmZmZmZmY7CiAgICAgICAgICAgIH0KICAgICAgICAgICAgMTAwJSB7CiAgICAgICAgICAgICAgICBzdHJva2UtZGFzaG9mZnNldDogLTEwMDsKICAgICAgICAgICAgICAgIHN0cm9rZTogI2ZmZmZmZmZmOwogICAgICAgICAgICB9CiAgICAgICAgfQoKICAgICAgICBAa2V5ZnJhbWVzIG9uZGEtcHJlZW5jaGltZW50byB7CiAgICAgICAgICAgIDAlIHsKICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgyNHB4KTsKICAgICAgICAgICAgICAgIGZpbGw6ICNmZmZmZmZmZjsKICAgICAgICAgICAgfQogICAgICAgICAgICAyNSUgewogICAgICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDBweCk7CiAgICAgICAgICAgICAgICBmaWxsOiAjZmZmZmZmZmY7CiAgICAgICAgICAgIH0KICAgICAgICAgICAgNzUlIHsKICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwcHgpOwogICAgICAgICAgICAgICAgZmlsbDogI2ZmZmZmZmZmOwogICAgICAgICAgICB9CiAgICAgICAgICAgIDEwMCUgewogICAgICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDI0cHgpOwogICAgICAgICAgICAgICAgZmlsbDogI2ZmZmZmZmZmOwogICAgICAgICAgICB9CiAgICAgICAgfQogICAgPC9zdHlsZT4KICAgIDxkZWZzPgogICAgICAgIDxjbGlwUGF0aCBpZD0ibW9sZGUtZ2FyZm8iPgogICAgICAgICAgICA8cGF0aCBkPSJNNS44OSAyLjIyN2EuMjguMjggMCAwIDEgLjI2Ni4wNzZsNS4wNjMgNS4wNjJjLjU0LjU0LjUwOSAxLjY1Mi0uMDMxIDIuMTkybDguNzcxIDguNzdjMS4zNTYgMS4zNTUtLjM2IDMuMDk3LTEuNzMgMS43MjhsLTguNzcyLTguNzdjLS41NC41NC0xLjY1MS41NzEtMi4xOTEuMDMxbC01LjA2My01LjA2Yy0uMzA0LS4zMDQuMzA0LS45MTEuNjA4LS42MDhsMy43MTQgMy43MTNMNy41OSA4LjI5N0wzLjg3NSA0LjU4MmMtLjMwNC0uMzA0LjMwNC0uOTExLjYwNy0uNjA3bDMuNzE1IDMuNzE0bDEuMDY3LTEuMDY2TDUuNTQ5IDIuOTFjLS4yMjgtLjIyOC4wNTctLjYyNi4zNDItLjY4M1oiLz4KICAgICAgICA8L2NsaXBQYXRoPgogICAgPC9kZWZzPgogICAgPGc+CiAgICAgICAgPHBhdGggZmlsbD0iIzAwMDAwMGZmIiBkPSJNMTIgMEM1LjM3NCAwIDAgNS4zNzUgMCAxMnM1LjM3NCAxMiAxMiAxMmM2LjYyNSAwIDEyLTUuMzc1IDEyLTEyUzE4LjYyNSAwIDEyIDAiLz4KICAgICAgICA8ZyBjbGlwLXBhdGg9InVybCgjbW9sZGUtZ2FyZm8pIj4KICAgICAgICAgICAgPHBhdGggY2xhc3M9Im9uZGEtcHJlZW5jaGltZW50byIgCiAgICAgICAgICAgICAgICAgIGQ9Ik0gLTIsMjQgTCAtMiwwIGMgNiwtNSA2LDUgMTIsMCBzIDYsLTUgMTIsMCBzIDYsLTUgMTIsMCBMIDMwLDI0IFoiLz4KICAgICAgICA8L2c+CiAgICAgICAgPHBhdGggY2xhc3M9ImRlc2VuaGFyLWNvbnRvcm5vIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjAuNSIgZD0iTTUuODkgMi4yMjdhLjI4LjI4IDAgMCAxIC4yNjYuMDc2bDUuMDYzIDUuMDYyYy41NC41NC41MDkgMS42NTItLjAzMSAyLjE5Mmw4Ljc3MSA4Ljc3YzEuMzU2IDEuMzU1LS4zNiAzLjA5Ny0xLjczIDEuNzI4bC04Ljc3Mi04Ljc3Yy0uNTQuNTQtMS42NTEuNTcxLTIuMTkxLjAzMWwtNS4wNjMtNS4wNmMtLjMwNC0uMzA0LjMwNC0uOTExLjYwOC0uNjA4bDMuNzE0IDMuNzEzTDcuNTkgOC4yOTdMMy44NzUgNC41ODJjLS4zMDQtLjMwNC4zMDQtLjkxMS42MDctLjYwN2wzLjcxNSAzLjcxNGwxLjA2Ny0xLjA2Nkw1LjU0OSAyLjkxYy0uMjI4LS4yMjguMDU3LS42MjYuMzQyLS42ODNaIi8+CiAgICA8L2c+Cjwvc3ZnPg==
// @resource            customCSS https://cdn.jsdelivr.net/gh/0H4S/Better-Greasy-Fork@2.0/custom.css
// @resource            iconsJSON https://cdn.jsdelivr.net/gh/0H4S/Better-Greasy-Fork/icons.json
// @require             https://update.greasyfork.org/scripts/549920.js
// @connect             gist.github.com
// @connect             files.catbox.moe
// @connect             update.greasyfork.org
// @connect             translate.googleapis.com
// @connect             generativelanguage.googleapis.com
// @grant               GM_addStyle
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_deleteValue
// @grant               GM_xmlhttpRequest
// @grant               GM_getResourceText
// @grant               GM_registerMenuCommand
// @run-at              document-idle
// @noframes
// @compatible          chrome
// @compatible          firefox
// @compatible          edge
// @compatible          opera
// @bgf-colorLT         rgb(0, 0, 0)
// @bgf-colorDT         #ffffffff
// @bgf-copyright       [2026 OHAS. All Rights Reserved.](https://gist.github.com/0H4S/ae2fa82957a089576367e364cbf02438)
// @bgf-compatible      brave, mobile
// @bgf-social          https://github.com/0H4S
// @contributionURL     https://linktr.ee/0H4S
// @downloadURL https://update.greasyfork.org/scripts/552737/Better%20Greasy%20Fork.user.js
// @updateURL https://update.greasyfork.org/scripts/552737/Better%20Greasy%20Fork.meta.js
// ==/UserScript==

(function () {
    'use strict';
    /*eslint-disable*/
    // ================
    // #region GLOBAL
    // ================

    // --- VARIÁVEIS GLOBAIS ---
    let currentLang         = 'en';
    let languageModal       = null;
    const CACHE_KEY         = 'Values';
    const LANG_STORAGE_KEY  = 'UserScriptLang';
    const LAST_TAG_TYPE_KEY = 'Tag';
    const LAST_COLOR_KEY    = 'Color';

    // --- NOTIFICADOR ---
    const SCRIPT_CONFIG = { notificationsUrl: 'https://gist.github.com/0H4S/d55d216b4487d64c606abb5d4f097fe0', scriptVersion: '2.0', };
    const notifier = new ScriptNotifier(SCRIPT_CONFIG);
    notifier.run();

    // --- IDIOMAS DO SCRIPT ---
    const allTranslations = {
    'pt-BR': {
            // --- Configurações Gerais e Sistema ---
            langName:                         'Português (BR)',
            languageSettings:                 '🌐 Idioma',
            force_update:                     '🔄️ Forçar Atualização',
            settings:                         '⚙️ Configurações',
            compatible_with:                  'Compatível com',
            force_update_alert:               'O cache foi limpo. A página será recarregada para buscar os dados atualizados.',
            downloading:                      'Baixando...',
            selection:                        'Seleção',
            trans_saved:                      'Configurações salvas!',

            // --- Botões e Ações ---
            close:                            'Fechar',
            confirm:                          'Confirmar',
            cancel:                           'Cancelar',
            download:                         'Baixar',
            translate:                        'Traduzir',
            trans_undo:                       'Desfazer',
            trans_translating:                'Traduzindo...',

            // --- Ferramentas de Formatação (Editor) ---
            titles:                           'Títulos',
            bold:                             'Negrito',
            italic:                           'Itálico',
            underline:                        'Sublinhado',
            strikethrough:                    'Riscado',
            unordered_list:                   'Lista não ordenada',
            ordered_list:                     'Lista ordenada',
            quote:                            'Citação',
            inline_code:                      'Código Inline',
            code_block:                       'Bloco de Código',
            horizontal_line:                  'Linha Horizontal',
            horizontal_line_style:            'Estilo da Linha Horizontal',
            link:                             'Link',
            image:                            'Imagem',
            video:                            'Vídeo',
            table:                            'Tabela',
            subscript:                        'Subscrito',
            superscript:                      'Sobrescrito',
            highlight:                        'Marcação',
            keyboard:                         'Teclado',
            abbreviation:                     'Abreviação',
            text_color:                       'Cor do Texto',
            background_color:                 'Cor de Fundo',
            details:                          'Seção Recolhível',
            center:                           'Centralizar',
            border_style:                     'Estilo da Borda',

            // --- Placeholders (Campos de Preenchimento) ---
            txt:                              'Texto',
            title_placeholder:                'Título',
            bold_placeholder:                 'negrito',
            italic_placeholder:               'itálico',
            underline_placeholder:            'sublinhado',
            strikethrough_placeholder:        'riscado',
            list_item_placeholder:            'Item',
            inline_code_placeholder:          'código',
            code_block_placeholder:           'código aqui',
            link_text_placeholder:            'texto do link',
            image_title_placeholder:          'ex: Minha bela imagem',
            table_header_placeholder:         'Cabeçalho',
            table_cell_placeholder:           'Célula',
            subscript_placeholder:            'sub',
            superscript_placeholder:          'sup',
            highlight_placeholder:            'marcado',
            keyboard_placeholder:             'Ctrl+C',
            abbreviation_placeholder:         'HTML',
            colored_text_placeholder:         'texto colorido',
            colored_background_placeholder:   'fundo colorido',
            details_summary_placeholder:      'Resumo ou Título',
            details_content_placeholder:      'Conteúdo a ser ocultado...',
            center_placeholder:               'texto centralizado',
            trans_search_ph:                  'Buscar idioma...',

            // --- Prompts e Entradas de Dados ---
            prompt_hr_size:                   'Tamanho (px)',
            prompt_hr_color:                  'Cor',
            prompt_insert_url:                'Insira a URL:',
            prompt_link_text:                 'Texto do link:',
            prompt_insert_image_url:          'Insira a URL da imagem (https):',
            prompt_image_title:               'Título da imagem (opcional):',
            prompt_image_width:               'Largura (opcional):',
            prompt_image_height:              'Altura (opcional):',
            prompt_video_type:                'Tipo de Vídeo',
            prompt_video_poster_url:          'URL da Imagem de Capa (poster)',
            prompt_insert_video_url:          'Insira a URL do vídeo:',
            prompt_video_width:               'Largura (opcional):',
            prompt_video_height:              'Altura (opcional):',
            prompt_columns:                   'Número de colunas:',
            prompt_rows:                      'Número de linhas:',
            prompt_abbreviation_text:         'Texto da abreviação:',
            prompt_abbreviation_meaning:      'Qual o significado da abreviação?',
            prompt_border_size:               'Tamanho da borda (px)',
            prompt_border_color:              'Cor da borda',
            prompt_border_tag_type:           'Tipo de Tag',
            prompt_translate_to:              'Traduzir para:',

            // --- Tradução e IA ---
            mode:                             'Motor de Tradução',
            prompt_ai_model:                  'Modelo IA:',
            prompt_api_key:                   'Chave API (Gemini API):',
            placeholder_api_key:              'Cole sua chave AIza... aqui',
            api_help_title:                   'Como obter uma chave API Gratuita',
            api_help_text:                    'O Google oferece uma cota gratuita generosa. Para usar, acesse o Google AI Studio no link abaixo, faça login com sua conta e clique em "Create API key". Basta copiar a chave gerada e colá-la no script.',
            api_help_link_text:               'Obter Chave API',
            api_help_tooltip:                 'Ajuda: Como obter uma chave',
            trans_mode_google:                'Google Tradutor (Padrão)',
            trans_mode_gemini:                'IA Gemini (Melhor qualidade)',
            trans_target_lang:                'Idioma de Destino',
            gemini_model_label:               'Modelo Gemini',

            // --- Informações e Atalhos ---
            info_tooltip:                     'Atalhos',
            info_shortcuts_title:             'Atalhos do Teclado',
            info_header_shortcut:             'Atalho',
            info_header_action:               'Ação',
            info_shortcut_tab:                'Insere um espaço de tabulação',
            info_shortcut_shift_enter:        'Insere uma quebra de linha <span style="color: #d21934;"><strong>&lt;br&gt;</strong></span>',
            info_shortcut_ctrl_d:             'Envolve a seleção em uma tag <span style="color: #d21934;"><strong>&lt;div&gt;</strong></span>',
            info_shortcut_ctrl_p:             'Envolve a seleção em um parágrafo <span style="color: #d21934;"><strong>&lt;p&gt;</strong></span>',
            info_shortcut_ctrl_m:             'Envolve a seleção em um bloco de código markdown.',
            info_shortcut_ctrl_space:         'Insere um espaço não separável <span style="color: #d21934;"><strong>;nbsp</strong></span>',

            // --- Alertas e Erros ---
            alert_invalid_video_url:          'URL de vídeo inválida ou não suportada.',
            alert_text_empty:                 'A caixa de texto está vazia.',
            alert_translation_error:          'Erro na tradução: ',
            notFound:                         'Código não encontrado!',
            scriptIdNotFound:                 'Não foi possível identificar o ID do script.',
            downloadError:                    'Ocorreu um erro ao baixar o script.',
            downloadTimeout:                  'O tempo para baixar o script esgotou.',
            error_no_text:                    'A IA não retornou texto válido.',
            error_api_processing:             'Erro ao processar resposta da API.',
            error_rede:                       'Erro de conexão.',
            error_generic:                    'Erro',
            trans_err_gemini_key:             'Chave API do Gemini não configurada. Vá em Configurações > Tradução.'
        },
    'en': {
            langName:                         'English',
            languageSettings:                 '🌐 Language',
            force_update:                     '🔄️ Force Update',
            settings:                         '⚙️ Settings',
            compatible_with:                  'Compatible with',
            force_update_alert:               'Cache cleared. The page will reload to fetch updated data.',
            downloading:                      'Downloading...',
            selection:                        'Selection',
            trans_saved:                      'Settings saved!',
            close:                            'Close',
            confirm:                          'Confirm',
            cancel:                           'Cancel',
            download:                         'Download',
            translate:                        'Translate',
            trans_undo:                       'Undo',
            trans_translating:                'Translating...',
            titles:                           'Headings',
            bold:                             'Bold',
            italic:                           'Italic',
            underline:                        'Underline',
            strikethrough:                    'Strikethrough',
            unordered_list:                   'Unordered List',
            ordered_list:                     'Ordered List',
            quote:                            'Quote',
            inline_code:                      'Inline Code',
            code_block:                       'Code Block',
            horizontal_line:                  'Horizontal Line',
            horizontal_line_style:            'Horizontal Line Style',
            link:                             'Link',
            image:                            'Image',
            video:                            'Video',
            table:                            'Table',
            subscript:                        'Subscript',
            superscript:                      'Superscript',
            highlight:                        'Highlight',
            keyboard:                         'Keyboard Input',
            abbreviation:                     'Abbreviation',
            text_color:                       'Text Color',
            background_color:                 'Background Color',
            details:                          'Collapsible Section',
            center:                           'Center',
            border_style:                     'Border Style',
            txt:                              'Text',
            title_placeholder:                'Title',
            bold_placeholder:                 'bold',
            italic_placeholder:               'italic',
            underline_placeholder:            'underline',
            strikethrough_placeholder:        'strikethrough',
            list_item_placeholder:            'Item',
            inline_code_placeholder:          'code',
            code_block_placeholder:           'code here',
            link_text_placeholder:            'link text',
            image_title_placeholder:          'e.g., My beautiful image',
            table_header_placeholder:         'Header',
            table_cell_placeholder:           'Cell',
            subscript_placeholder:            'sub',
            superscript_placeholder:          'sup',
            highlight_placeholder:            'highlighted',
            keyboard_placeholder:             'Ctrl+C',
            abbreviation_placeholder:         'HTML',
            colored_text_placeholder:         'colored text',
            colored_background_placeholder:   'colored background',
            details_summary_placeholder:      'Summary or Title',
            details_content_placeholder:      'Content to be hidden...',
            center_placeholder:               'centered text',
            trans_search_ph:                  'Search language...',
            prompt_hr_size:                   'Size (px)',
            prompt_hr_color:                  'Color',
            prompt_insert_url:                'Insert URL:',
            prompt_link_text:                 'Link text:',
            prompt_insert_image_url:          'Insert Image URL (https):',
            prompt_image_title:               'Image Title (optional):',
            prompt_image_width:               'Width (optional):',
            prompt_image_height:              'Height (optional):',
            prompt_video_type:                'Video Type',
            prompt_video_poster_url:          'Cover Image URL (poster)',
            prompt_insert_video_url:          'Insert Video URL:',
            prompt_video_width:               'Width (optional):',
            prompt_video_height:              'Height (optional):',
            prompt_columns:                   'Number of columns:',
            prompt_rows:                      'Number of rows:',
            prompt_abbreviation_text:         'Abbreviation text:',
            prompt_abbreviation_meaning:      'What is the meaning?',
            prompt_border_size:               'Border size (px)',
            prompt_border_color:              'Border color',
            prompt_border_tag_type:           'Tag Type',
            prompt_translate_to:              'Translate to:',
            mode:                             'Translation Engine',
            prompt_ai_model:                  'AI Model:',
            prompt_api_key:                   'API Key (Gemini API):',
            placeholder_api_key:              'Paste your AIza... key here',
            api_help_title:                   'How to get a Free API Key',
            api_help_text:                    'Google offers a generous free quota. To use it, access Google AI Studio via the link below, log in with your account, and click "Create API key". Copy the generated key and paste it into the script.',
            api_help_link_text:               'Get API Key',
            api_help_tooltip:                 'Help: How to get a key',
            trans_mode_google:                'Google Translate (Default)',
            trans_mode_gemini:                'Gemini AI (Best quality)',
            trans_target_lang:                'Target Language',
            gemini_model_label:               'Gemini Model',
            info_tooltip:                     'Shortcuts',
            info_shortcuts_title:             'Keyboard Shortcuts',
            info_header_shortcut:             'Shortcut',
            info_header_action:               'Action',
            info_shortcut_tab:                'Inserts a tab space',
            info_shortcut_shift_enter:        'Inserts a line break <span style="color: #d21934;"><strong>&lt;br&gt;</strong></span>',
            info_shortcut_ctrl_d:             'Wraps selection in a <span style="color: #d21934;"><strong>&lt;div&gt;</strong></span> tag',
            info_shortcut_ctrl_p:             'Wraps selection in a paragraph <span style="color: #d21934;"><strong>&lt;p&gt;</strong></span>',
            info_shortcut_ctrl_m:             'Wraps selection in a markdown code block.',
            info_shortcut_ctrl_space:         'Inserts a non-breaking space <span style="color: #d21934;"><strong>&nbsp;</strong></span>',
            alert_invalid_video_url:          'Invalid or unsupported video URL.',
            alert_text_empty:                 'The text box is empty.',
            alert_translation_error:          'Translation error: ',
            notFound:                         'Code not found!',
            scriptIdNotFound:                 'Could not identify the script ID.',
            downloadError:                    'An error occurred while downloading the script.',
            downloadTimeout:                  'Script download timed out.',
            error_no_text:                    'AI returned no valid text.',
            error_api_processing:             'Error processing API response.',
            error_rede:                       'Connection error.',
            error_generic:                    'Error',
            trans_err_gemini_key:             'Gemini API key not configured. Go to Settings > Translation.'
        },
    'zh-CN': {
            langName:                         '简体中文',
            languageSettings:                 '🌐 语言',
            force_update:                     '🔄️ 强制更新',
            settings:                         '⚙️ 设置',
            compatible_with:                  '兼容于',
            force_update_alert:               '缓存已清除。页面将重新加载以获取更新的数据。',
            downloading:                      '下载中...',
            selection:                        '选择',
            trans_saved:                      '设置已保存！',
            close:                            '关闭',
            confirm:                          '确认',
            cancel:                           '取消',
            download:                         '下载',
            translate:                        '翻译',
            trans_undo:                       '撤销',
            trans_translating:                '翻译中...',
            titles:                           '标题',
            bold:                             '粗体',
            italic:                           '斜体',
            underline:                        '下划线',
            strikethrough:                    '删除线',
            unordered_list:                   '无序列表',
            ordered_list:                     '有序列表',
            quote:                            '引用',
            inline_code:                      '行内代码',
            code_block:                       '代码块',
            horizontal_line:                  '水平线',
            horizontal_line_style:            '水平线样式',
            link:                             '链接',
            image:                            '图片',
            video:                            '视频',
            table:                            '表格',
            subscript:                        '下标',
            superscript:                      '上标',
            highlight:                        '高亮',
            keyboard:                         '键盘输入',
            abbreviation:                     '缩写',
            text_color:                       '文本颜色',
            background_color:                 '背景颜色',
            details:                          '折叠部分',
            center:                           '居中',
            border_style:                     '边框样式',
            txt:                              '文本',
            title_placeholder:                '标题',
            bold_placeholder:                 '粗体',
            italic_placeholder:               '斜体',
            underline_placeholder:            '下划线',
            strikethrough_placeholder:        '删除线',
            list_item_placeholder:            '项目',
            inline_code_placeholder:          '代码',
            code_block_placeholder:           '在此输入代码',
            link_text_placeholder:            '链接文本',
            image_title_placeholder:          '例如：我的精美图片',
            table_header_placeholder:         '表头',
            table_cell_placeholder:           '单元格',
            subscript_placeholder:            'sub',
            superscript_placeholder:          'sup',
            highlight_placeholder:            '高亮',
            keyboard_placeholder:             'Ctrl+C',
            abbreviation_placeholder:         'HTML',
            colored_text_placeholder:         '彩色文本',
            colored_background_placeholder:   '彩色背景',
            details_summary_placeholder:      '摘要或标题',
            details_content_placeholder:      '要隐藏的内容...',
            center_placeholder:               '居中文本',
            trans_search_ph:                  '搜索语言...',
            prompt_hr_size:                   '大小 (px)',
            prompt_hr_color:                  '颜色',
            prompt_insert_url:                '插入 URL:',
            prompt_link_text:                 '链接文本:',
            prompt_insert_image_url:          '插入图片 URL (https):',
            prompt_image_title:               '图片标题 (可选):',
            prompt_image_width:               '宽度 (可选):',
            prompt_image_height:              '高度 (可选):',
            prompt_video_type:                '视频类型',
            prompt_video_poster_url:          '封面图片 URL (海报)',
            prompt_insert_video_url:          '插入视频 URL:',
            prompt_video_width:               '宽度 (可选):',
            prompt_video_height:              '高度 (可选):',
            prompt_columns:                   '列数:',
            prompt_rows:                      '行数:',
            prompt_abbreviation_text:         '缩写文本:',
            prompt_abbreviation_meaning:      '缩写的含义是什么？',
            prompt_border_size:               '边框大小 (px)',
            prompt_border_color:              '边框颜色',
            prompt_border_tag_type:           '标签类型',
            prompt_translate_to:              '翻译为:',
            mode:                             '翻译引擎',
            prompt_ai_model:                  'AI 模型:',
            prompt_api_key:                   'API 密钥 (Gemini API):',
            placeholder_api_key:              '在此粘贴您的 AIza... 密钥',
            api_help_title:                   '如何获取免费 API 密钥',
            api_help_text:                    'Google 提供慷慨的免费配额。要使用它，请通过下面的链接访问 Google AI Studio，登录您的帐户并点击 "Create API key"。复制生成的密钥并将其粘贴到脚本中。',
            api_help_link_text:               '获取 API 密钥',
            api_help_tooltip:                 '帮助：如何获取密钥',
            trans_mode_google:                'Google 翻译 (默认)',
            trans_mode_gemini:                'Gemini IA (最佳质量)',
            trans_target_lang:                '目标语言',
            gemini_model_label:               'Gemini 模型',
            info_tooltip:                     '快捷键',
            info_shortcuts_title:             '键盘快捷键',
            info_header_shortcut:             '快捷键',
            info_header_action:               '操作',
            info_shortcut_tab:                '插入制表符空格',
            info_shortcut_shift_enter:        '插入换行符 <span style="color: #d21934;"><strong>&lt;br&gt;</strong></span>',
            info_shortcut_ctrl_d:             '用 <span style="color: #d21934;"><strong>&lt;div&gt;</strong></span> 标签包裹选区',
            info_shortcut_ctrl_p:             '用段落 <span style="color: #d21934;"><strong>&lt;p&gt;</strong></span> 包裹选区',
            info_shortcut_ctrl_m:             '用 Markdown 代码块包裹选区',
            info_shortcut_ctrl_space:         '插入不间断空格 <span style="color: #d21934;"><strong>&nbsp;</strong></span>',
            alert_invalid_video_url:          '视频 URL 无效或不支持。',
            alert_text_empty:                 '文本框为空。',
            alert_translation_error:          '翻译错误：',
            notFound:                         '未找到代码！',
            scriptIdNotFound:                 '无法识别脚本 ID。',
            downloadError:                    '下载脚本时出错。',
            downloadTimeout:                  '脚本下载超时。',
            error_no_text:                    'AI 未返回有效文本。',
            error_api_processing:             '处理 API 响应时出错。',
            error_rede:                       '连接错误。',
            error_generic:                    '错误',
            trans_err_gemini_key:             '未配置 Gemini API 密钥。请转到 设置 > 翻译。'
        },
    'es': {
            langName:                         'Español',
            languageSettings:                 '🌐 Idioma',
            force_update:                     '🔄️ Forzar actualización',
            settings:                         '⚙️ Configuración',
            compatible_with:                  'Compatible con',
            force_update_alert:               'Se ha borrado la caché. La página se recargará para obtener los datos actualizados.',
            downloading:                      'Descargando...',
            selection:                        'Selección',
            trans_saved:                      '¡Configuración guardada!',
            close:                            'Cerrar',
            confirm:                          'Confirmar',
            cancel:                           'Cancelar',
            download:                         'Descargar',
            translate:                        'Traducir',
            trans_undo:                       'Deshacer',
            trans_translating:                'Traduciendo...',
            titles:                           'Títulos',
            bold:                             'Negrita',
            italic:                           'Cursiva',
            underline:                        'Subrayado',
            strikethrough:                    'Tachado',
            unordered_list:                   'Lista desordenada',
            ordered_list:                     'Lista ordenada',
            quote:                            'Cita',
            inline_code:                      'Código en línea',
            code_block:                       'Bloque de código',
            horizontal_line:                  'Línea horizontal',
            horizontal_line_style:            'Estilo de línea horizontal',
            link:                             'Enlace',
            image:                            'Imagen',
            video:                            'Video',
            table:                            'Tabla',
            subscript:                        'Subíndice',
            superscript:                      'Superíndice',
            highlight:                        'Resaltado',
            keyboard:                         'Entrada de teclado',
            abbreviation:                     'Abreviatura',
            text_color:                       'Color del texto',
            background_color:                 'Color de fondo',
            details:                          'Sección desplegable',
            center:                           'Centrar',
            border_style:                     'Estilo de borde',
            txt:                              'Texto',
            title_placeholder:                'Título',
            bold_placeholder:                 'negrita',
            italic_placeholder:               'cursiva',
            underline_placeholder:            'subrayado',
            strikethrough_placeholder:        'tachado',
            list_item_placeholder:            'Elemento',
            inline_code_placeholder:          'código',
            code_block_placeholder:           'código aquí',
            link_text_placeholder:            'texto del enlace',
            image_title_placeholder:          'ej: Mi bella imagen',
            table_header_placeholder:         'Encabezado',
            table_cell_placeholder:           'Celda',
            subscript_placeholder:            'sub',
            superscript_placeholder:          'sup',
            highlight_placeholder:            'resaltado',
            keyboard_placeholder:             'Ctrl+C',
            abbreviation_placeholder:         'HTML',
            colored_text_placeholder:         'texto coloreado',
            colored_background_placeholder:   'fondo coloreado',
            details_summary_placeholder:      'Resumen o Título',
            details_content_placeholder:      'Contenido para ocultar...',
            center_placeholder:               'texto centrado',
            trans_search_ph:                  'Buscar idioma...',
            prompt_hr_size:                   'Tamaño (px)',
            prompt_hr_color:                  'Color',
            prompt_insert_url:                'Insertar URL:',
            prompt_link_text:                 'Texto del enlace:',
            prompt_insert_image_url:          'Insertar URL de la imagen (https):',
            prompt_image_title:               'Título de la imagen (opcional):',
            prompt_image_width:               'Ancho (opcional):',
            prompt_image_height:              'Alto (opcional):',
            prompt_video_type:                'Tipo de video',
            prompt_video_poster_url:          'URL de imagen de portada (poster)',
            prompt_insert_video_url:          'Insertar URL del video:',
            prompt_video_width:               'Ancho (opcional):',
            prompt_video_height:              'Alto (opcional):',
            prompt_columns:                   'Número de columnas:',
            prompt_rows:                      'Número de filas:',
            prompt_abbreviation_text:         'Texto de la abreviatura:',
            prompt_abbreviation_meaning:      '¿Cuál es el significado?',
            prompt_border_size:               'Tamaño del borde (px)',
            prompt_border_color:              'Color del borde',
            prompt_border_tag_type:           'Tipo de etiqueta',
            prompt_translate_to:              'Traducir a:',
            mode:                             'Motor de traducción',
            prompt_ai_model:                  'Modelo IA:',
            prompt_api_key:                   'Clave API (Gemini API):',
            placeholder_api_key:              'Pega tu clave AIza... aquí',
            api_help_title:                   'Cómo obtener una clave API gratuita',
            api_help_text:                    'Google ofrece una cuota gratuita generosa. Para usarla, accede a Google AI Studio en el enlace de abajo, inicia sesión con tu cuenta y haz clic en "Create API key". Copia la clave generada y pégala en el script.',
            api_help_link_text:               'Obtener Clave API',
            api_help_tooltip:                 'Ayuda: Cómo obtener una clave',
            trans_mode_google:                'Traductor de Google (Predeterminado)',
            trans_mode_gemini:                'Gemini IA (Mejor calidad)',
            trans_target_lang:                'Idioma de destino',
            gemini_model_label:               'Modelo Gemini',
            info_tooltip:                     'Atajos',
            info_shortcuts_title:             'Atajos del teclado',
            info_header_shortcut:             'Atajo',
            info_header_action:               'Acción',
            info_shortcut_tab:                'Inserta un espacio de tabulación',
            info_shortcut_shift_enter:        'Inserta un salto de línea <span style="color: #d21934;"><strong>&lt;br&gt;</strong></span>',
            info_shortcut_ctrl_d:             'Envuelve la selección en una etiqueta <span style="color: #d21934;"><strong>&lt;div&gt;</strong></span>',
            info_shortcut_ctrl_p:             'Envuelve la selección en un párrafo <span style="color: #d21934;"><strong>&lt;p&gt;</strong></span>',
            info_shortcut_ctrl_m:             'Envuelve la selección en un bloque de código markdown.',
            info_shortcut_ctrl_space:         'Inserta un espacio de no separación <span style="color: #d21934;"><strong>&nbsp;</strong></span>',
            alert_invalid_video_url:          'URL de video no válida o no soportada.',
            alert_text_empty:                 'El cuadro de texto está vacío.',
            alert_translation_error:          'Error en la traducción: ',
            notFound:                         '¡Código no encontrado!',
            scriptIdNotFound:                 'No se pudo identificar el ID del script.',
            downloadError:                    'Ocurrió un error al descargar el script.',
            downloadTimeout:                  'Se agotó el tiempo para descargar el script.',
            error_no_text:                    'La IA no devolvió texto válido.',
            error_api_processing:             'Error al procesar la respuesta de la API.',
            error_rede:                       'Error de conexión.',
            error_generic:                    'Error',
            trans_err_gemini_key:             'Clave API de Gemini no configurada. Ve a Configuración > Traducción.'
        },
    'fr': {
            langName:                         'Français',
            languageSettings:                 '🌐 Langue',
            force_update:                     '🔄️ Forcer la mise à jour',
            settings:                         '⚙️ Paramètres',
            compatible_with:                  'Compatible avec',
            force_update_alert:               'Le cache a été vidé. La page va se recharger pour récupérer les données mises à jour.',
            downloading:                      'Téléchargement...',
            selection:                        'Sélection',
            trans_saved:                      'Paramètres enregistrés !',
            close:                            'Fermer',
            confirm:                          'Confirmer',
            cancel:                           'Annuler',
            download:                         'Télécharger',
            translate:                        'Traduire',
            trans_undo:                       'Annuler',
            trans_translating:                'Traduction...',
            titles:                           'Titres',
            bold:                             'Gras',
            italic:                           'Italique',
            underline:                        'Souligné',
            strikethrough:                    'Barré',
            unordered_list:                   'Liste à puces',
            ordered_list:                     'Liste ordonnée',
            quote:                            'Citation',
            inline_code:                      'Code en ligne',
            code_block:                       'Bloc de code',
            horizontal_line:                  'Ligne horizontale',
            horizontal_line_style:            'Style de ligne horizontale',
            link:                             'Lien',
            image:                            'Image',
            video:                            'Vidéo',
            table:                            'Tableau',
            subscript:                        'Indice',
            superscript:                      'Exposant',
            highlight:                        'Surlignage',
            keyboard:                         'Entrée clavier',
            abbreviation:                     'Abréviation',
            text_color:                       'Couleur du texte',
            background_color:                 'Couleur de fond',
            details:                          'Section repliable',
            center:                           'Centrer',
            border_style:                     'Style de bordure',
            txt:                              'Texte',
            title_placeholder:                'Titre',
            bold_placeholder:                 'gras',
            italic_placeholder:               'italique',
            underline_placeholder:            'souligné',
            strikethrough_placeholder:        'barré',
            list_item_placeholder:            'Élément',
            inline_code_placeholder:          'code',
            code_block_placeholder:           'code ici',
            link_text_placeholder:            'texte du lien',
            image_title_placeholder:          'ex: Ma belle image',
            table_header_placeholder:         'En-tête',
            table_cell_placeholder:           'Cellule',
            subscript_placeholder:            'ind',
            superscript_placeholder:          'exp',
            highlight_placeholder:            'surligné',
            keyboard_placeholder:             'Ctrl+C',
            abbreviation_placeholder:         'HTML',
            colored_text_placeholder:         'texte coloré',
            colored_background_placeholder:   'fond coloré',
            details_summary_placeholder:      'Résumé ou Titre',
            details_content_placeholder:      'Contenu à masquer...',
            center_placeholder:               'texte centré',
            trans_search_ph:                  'Rechercher la langue...',
            prompt_hr_size:                   'Taille (px)',
            prompt_hr_color:                  'Couleur',
            prompt_insert_url:                'Insérer l\'URL :',
            prompt_link_text:                 'Texte du lien :',
            prompt_insert_image_url:          'Insérer l\'URL de l\'image (https) :',
            prompt_image_title:               'Titre de l\'image (optionnel) :',
            prompt_image_width:               'Largeur (optionnel) :',
            prompt_image_height:              'Hauteur (optionnel) :',
            prompt_video_type:                'Type de vidéo',
            prompt_video_poster_url:          'URL de l\'image de couverture (poster)',
            prompt_insert_video_url:          'Insérer l\'URL de la vidéo :',
            prompt_video_width:               'Largeur (optionnel) :',
            prompt_video_height:              'Hauteur (optionnel) :',
            prompt_columns:                   'Nombre de colonnes :',
            prompt_rows:                      'Nombre de lignes :',
            prompt_abbreviation_text:         'Texte de l\'abréviation :',
            prompt_abbreviation_meaning:      'Quelle est la signification ?',
            prompt_border_size:               'Taille de la bordure (px)',
            prompt_border_color:              'Couleur de la bordure',
            prompt_border_tag_type:           'Type de balise',
            prompt_translate_to:              'Traduire en :',
            mode:                             'Moteur de traduction',
            prompt_ai_model:                  'Modèle IA :',
            prompt_api_key:                   'Clé API (Gemini API) :',
            placeholder_api_key:              'Collez votre clé AIza... ici',
            api_help_title:                   'Comment obtenir une clé API gratuite',
            api_help_text:                    'Google offre un quota gratuit généreux. Pour l\'utiliser, accédez à Google AI Studio via le lien ci-dessous, connectez-vous avec votre compte et cliquez sur "Create API key". Copiez la clé générée et collez-la dans le script.',
            api_help_link_text:               'Obtenir une clé API',
            api_help_tooltip:                 'Aide : Comment obtenir une clé',
            trans_mode_google:                'Google Traduction (Par défaut)',
            trans_mode_gemini:                'Gemini IA (Meilleure qualité)',
            trans_target_lang:                'Langue cible',
            gemini_model_label:               'Modèle Gemini',
            info_tooltip:                     'Raccourcis',
            info_shortcuts_title:             'Raccourcis Clavier',
            info_header_shortcut:             'Raccourci',
            info_header_action:               'Action',
            info_shortcut_tab:                'Insère un espace de tabulation',
            info_shortcut_shift_enter:        'Insère un saut de ligne <span style="color: #d21934;"><strong>&lt;br&gt;</strong></span>',
            info_shortcut_ctrl_d:             'Entoure la sélection d\'une balise <span style="color: #d21934;"><strong>&lt;div&gt;</strong></span>',
            info_shortcut_ctrl_p:             'Entoure la sélection d\'un paragraphe <span style="color: #d21934;"><strong>&lt;p&gt;</strong></span>',
            info_shortcut_ctrl_m:             'Entoure la sélection d\'un bloc de code markdown.',
            info_shortcut_ctrl_space:         'Insère une espace insécable <span style="color: #d21934;"><strong>&nbsp;</strong></span>',
            alert_invalid_video_url:          'URL de vidéo invalide ou non prise en charge.',
            alert_text_empty:                 'La zone de texte est vide.',
            alert_translation_error:          'Erreur de traduction : ',
            notFound:                         'Code introuvable !',
            scriptIdNotFound:                 'Impossible d\'identifier l\'ID du script.',
            downloadError:                    'Une erreur est survenue lors du téléchargement du script.',
            downloadTimeout:                  'Le délai de téléchargement du script a expiré.',
            error_no_text:                    'L\'IA n\'a renvoyé aucun texte valide.',
            error_api_processing:             'Erreur lors du traitement de la réponse API.',
            error_rede:                       'Erreur de connexion.',
            error_generic:                    'Erreur',
            trans_err_gemini_key:             'Clé API Gemini non configurée. Allez dans Paramètres > Traduction.'
        },
    'ru': {
            langName:                         'Русский',
            languageSettings:                 '🌐 Язык',
            force_update:                     '🔄️ Принудительное обновление',
            settings:                         '⚙️ Настройки',
            compatible_with:                  'Совместимо с',
            force_update_alert:               'Кэш очищен. Страница будет перезагружена для получения обновленных данных.',
            downloading:                      'Загрузка...',
            selection:                        'Выделение',
            trans_saved:                      'Настройки сохранены!',
            close:                            'Закрыть',
            confirm:                          'Подтвердить',
            cancel:                           'Отмена',
            download:                         'Скачать',
            translate:                        'Перевести',
            trans_undo:                       'Отменить',
            trans_translating:                'Перевод...',
            titles:                           'Заголовки',
            bold:                             'Жирный',
            italic:                           'Курсив',
            underline:                        'Подчеркнутый',
            strikethrough:                    'Зачеркнутый',
            unordered_list:                   'Маркированный список',
            ordered_list:                     'Нумерованный список',
            quote:                            'Цитата',
            inline_code:                      'Встроенный код',
            code_block:                       'Блок кода',
            horizontal_line:                  'Горизонтальная линия',
            horizontal_line_style:            'Стиль линии',
            link:                             'Ссылка',
            image:                            'Изображение',
            video:                            'Видео',
            table:                            'Таблица',
            subscript:                        'Подстрочный',
            superscript:                      'Надстрочный',
            highlight:                        'Выделение',
            keyboard:                         'Клавиши',
            abbreviation:                     'Аббревиатура',
            text_color:                       'Цвет текста',
            background_color:                 'Цвет фона',
            details:                          'Сворачиваемый блок',
            center:                           'По центру',
            border_style:                     'Стиль границы',
            txt:                              'Текст',
            title_placeholder:                'Заголовок',
            bold_placeholder:                 'жирный',
            italic_placeholder:               'курсив',
            underline_placeholder:            'подчеркнутый',
            strikethrough_placeholder:        'зачеркнутый',
            list_item_placeholder:            'Элемент',
            inline_code_placeholder:          'код',
            code_block_placeholder:           'код здесь',
            link_text_placeholder:            'текст ссылки',
            image_title_placeholder:          'напр.: Мое красивое фото',
            table_header_placeholder:         'Заголовок',
            table_cell_placeholder:           'Ячейка',
            subscript_placeholder:            'sub',
            superscript_placeholder:          'sup',
            highlight_placeholder:            'выделено',
            keyboard_placeholder:             'Ctrl+C',
            abbreviation_placeholder:         'HTML',
            colored_text_placeholder:         'цветной текст',
            colored_background_placeholder:   'цветной фон',
            details_summary_placeholder:      'Сводка или Заголовок',
            details_content_placeholder:      'Скрытый контент...',
            center_placeholder:               'текст по центру',
            trans_search_ph:                  'Поиск языка...',
            prompt_hr_size:                   'Размер (px)',
            prompt_hr_color:                  'Цвет',
            prompt_insert_url:                'Вставьте URL:',
            prompt_link_text:                 'Текст ссылки:',
            prompt_insert_image_url:          'Вставьте URL изображения (https):',
            prompt_image_title:               'Название изображения (необязательно):',
            prompt_image_width:               'Ширина (необязательно):',
            prompt_image_height:              'Высота (необязательно):',
            prompt_video_type:                'Тип видео',
            prompt_video_poster_url:          'URL обложки (постер)',
            prompt_insert_video_url:          'Вставьте URL видео:',
            prompt_video_width:               'Ширина (необязательно):',
            prompt_video_height:              'Высота (необязательно):',
            prompt_columns:                   'Количество столбцов:',
            prompt_rows:                      'Количество строк:',
            prompt_abbreviation_text:         'Текст аббревиатуры:',
            prompt_abbreviation_meaning:      'Что это означает?',
            prompt_border_size:               'Размер границы (px)',
            prompt_border_color:              'Цвет границы',
            prompt_border_tag_type:           'Тип тега',
            prompt_translate_to:              'Перевести на:',
            mode:                             'Система перевода',
            prompt_ai_model:                  'Модель ИИ:',
            prompt_api_key:                   'Ключ API (Gemini API):',
            placeholder_api_key:              'Вставьте ключ AIza... сюда',
            api_help_title:                   'Как получить бесплатный API ключ',
            api_help_text:                    'Google предлагает щедрую бесплатную квоту. Чтобы воспользоваться, перейдите в Google AI Studio по ссылке ниже, войдите в аккаунт и нажмите "Create API key". Скопируйте созданный ключ и вставьте его в скрипт.',
            api_help_link_text:               'Получить API ключ',
            api_help_tooltip:                 'Помощь: Как получить ключ',
            trans_mode_google:                'Google Переводчик (По умолчанию)',
            trans_mode_gemini:                'Gemini ИИ (Лучшее качество)',
            trans_target_lang:                'Целевой язык',
            gemini_model_label:               'Модель Gemini',
            info_tooltip:                     'Горячие клавиши',
            info_shortcuts_title:             'Сочетания клавиш',
            info_header_shortcut:             'Сочетание',
            info_header_action:               'Действие',
            info_shortcut_tab:                'Вставляет отступ (tab)',
            info_shortcut_shift_enter:        'Вставляет разрыв строки <span style="color: #d21934;"><strong>&lt;br&gt;</strong></span>',
            info_shortcut_ctrl_d:             'Оборачивает выделение в тег <span style="color: #d21934;"><strong>&lt;div&gt;</strong></span>',
            info_shortcut_ctrl_p:             'Оборачивает выделение в параграф <span style="color: #d21934;"><strong>&lt;p&gt;</strong></span>',
            info_shortcut_ctrl_m:             'Оборачивает выделение в блок кода markdown.',
            info_shortcut_ctrl_space:         'Вставляет неразрывный пробел <span style="color: #d21934;"><strong>&nbsp;</strong></span>',
            alert_invalid_video_url:          'Неверный или неподдерживаемый URL видео.',
            alert_text_empty:                 'Текстовое поле пусто.',
            alert_translation_error:          'Ошибка перевода: ',
            notFound:                         'Код не найден!',
            scriptIdNotFound:                 'Не удалось определить ID скрипта.',
            downloadError:                    'Произошла ошибка при загрузке скрипта.',
            downloadTimeout:                  'Время загрузки скрипта истекло.',
            error_no_text:                    'ИИ не вернул корректный текст.',
            error_api_processing:             'Ошибка обработки ответа API.',
            error_rede:                       'Ошибка соединения.',
            error_generic:                    'Ошибка',
            trans_err_gemini_key:             'Ключ API Gemini не настроен. Перейдите в Настройки > Перевод.'
        },
    'ja': {
            langName:                         '日本語',
            languageSettings:                 '🌐 言語',
            force_update:                     '🔄️ 強制更新',
            settings:                         '⚙️ 設定',
            compatible_with:                  '対応バージョン',
            force_update_alert:               'キャッシュがクリアされました。更新データを取得するためページを再読み込みします。',
            downloading:                      'ダウンロード中...',
            selection:                        '選択',
            trans_saved:                      '設定を保存しました！',
            close:                            '閉じる',
            confirm:                          '確認',
            cancel:                           'キャンセル',
            download:                         'ダウンロード',
            translate:                        '翻訳',
            trans_undo:                       '元に戻す',
            trans_translating:                '翻訳中...',
            titles:                           '見出し',
            bold:                             '太字',
            italic:                           '斜体',
            underline:                        '下線',
            strikethrough:                    '取り消し線',
            unordered_list:                   '箇条書き',
            ordered_list:                     '番号付きリスト',
            quote:                            '引用',
            inline_code:                      'インラインコード',
            code_block:                       'コードブロック',
            horizontal_line:                  '水平線',
            horizontal_line_style:            '水平線のスタイル',
            link:                             'リンク',
            image:                            '画像',
            video:                            '動画',
            table:                            'テーブル',
            subscript:                        '下付き文字',
            superscript:                      '上付き文字',
            highlight:                        'ハイライト',
            keyboard:                         'キーボード入力',
            abbreviation:                     '略語',
            text_color:                       '文字色',
            background_color:                 '背景色',
            details:                          '折りたたみセクション',
            center:                           '中央揃え',
            border_style:                     '枠線のスタイル',
            txt:                              'テキスト',
            title_placeholder:                'タイトル',
            bold_placeholder:                 '太字',
            italic_placeholder:               '斜体',
            underline_placeholder:            '下線',
            strikethrough_placeholder:        '取り消し線',
            list_item_placeholder:            '項目',
            inline_code_placeholder:          'コード',
            code_block_placeholder:           'ここにコードを入力',
            link_text_placeholder:            'リンクのテキスト',
            image_title_placeholder:          '例: 美しい風景',
            table_header_placeholder:         'ヘッダー',
            table_cell_placeholder:           'セル',
            subscript_placeholder:            'sub',
            superscript_placeholder:          'sup',
            highlight_placeholder:            'ハイライト',
            keyboard_placeholder:             'Ctrl+C',
            abbreviation_placeholder:         'HTML',
            colored_text_placeholder:         '色付きテキスト',
            colored_background_placeholder:   '色付き背景',
            details_summary_placeholder:      '概要またはタイトル',
            details_content_placeholder:      '隠すコンテンツ...',
            center_placeholder:               '中央揃えテキスト',
            trans_search_ph:                  '言語を検索...',
            prompt_hr_size:                   'サイズ (px)',
            prompt_hr_color:                  '色',
            prompt_insert_url:                'URLを入力:',
            prompt_link_text:                 'リンクテキスト:',
            prompt_insert_image_url:          '画像URLを入力 (https):',
            prompt_image_title:               '画像タイトル (任意):',
            prompt_image_width:               '幅 (任意):',
            prompt_image_height:              '高さ (任意):',
            prompt_video_type:                '動画タイプ',
            prompt_video_poster_url:          'カバー画像URL (ポスター)',
            prompt_insert_video_url:          '動画URLを入力:',
            prompt_video_width:               '幅 (任意):',
            prompt_video_height:              '高さ (任意):',
            prompt_columns:                   '列数:',
            prompt_rows:                      '行数:',
            prompt_abbreviation_text:         '略語のテキスト:',
            prompt_abbreviation_meaning:      '略語の意味は？',
            prompt_border_size:               '枠線のサイズ (px)',
            prompt_border_color:              '枠線の色',
            prompt_border_tag_type:           'タグタイプ',
            prompt_translate_to:              '翻訳先:',
            mode:                             '翻訳エンジン',
            prompt_ai_model:                  'AIモデル:',
            prompt_api_key:                   'APIキー (Gemini API):',
            placeholder_api_key:              'ここにAIza...キーを貼り付け',
            api_help_title:                   '無料APIキーの取得方法',
            api_help_text:                    'Googleは寛大な無料枠を提供しています。使用するには、以下のリンクからGoogle AI Studioにアクセスし、アカウントでログインして「Create API key」をクリックします。生成されたキーをコピーして、スクリプトに貼り付けてください。',
            api_help_link_text:               'APIキーを取得',
            api_help_tooltip:                 'ヘルプ: キーの取得方法',
            trans_mode_google:                'Google翻訳 (デフォルト)',
            trans_mode_gemini:                'Gemini AI (最高品質)',
            trans_target_lang:                'ターゲット言語',
            gemini_model_label:               'Geminiモデル',
            info_tooltip:                     'ショートカット',
            info_shortcuts_title:             'キーボードショートカット',
            info_header_shortcut:             'ショートカット',
            info_header_action:               '動作',
            info_shortcut_tab:                'タブスペースを挿入',
            info_shortcut_shift_enter:        '改行 <span style="color: #d21934;"><strong>&lt;br&gt;</strong></span> を挿入',
            info_shortcut_ctrl_d:             '選択範囲を <span style="color: #d21934;"><strong>&lt;div&gt;</strong></span> タグで囲む',
            info_shortcut_ctrl_p:             '選択範囲を段落 <span style="color: #d21934;"><strong>&lt;p&gt;</strong></span> で囲む',
            info_shortcut_ctrl_m:             '選択範囲をMarkdownコードブロックで囲む',
            info_shortcut_ctrl_space:         'ノーブレークスペース <span style="color: #d21934;"><strong>&nbsp;</strong></span> を挿入',
            alert_invalid_video_url:          '無効またはサポートされていない動画URLです。',
            alert_text_empty:                 'テキストボックスが空です。',
            alert_translation_error:          '翻訳エラー: ',
            notFound:                         'コードが見つかりません！',
            scriptIdNotFound:                 'スクリプトIDを特定できませんでした。',
            downloadError:                    'スクリプトのダウンロード中にエラーが発生しました。',
            downloadTimeout:                  'スクリプトのダウンロードがタイムアウトしました。',
            error_no_text:                    'AIから有効なテキストが返されませんでした。',
            error_api_processing:             'API応答の処理中にエラーが発生しました。',
            error_rede:                       '接続エラー。',
            error_generic:                    'エラー',
            trans_err_gemini_key:             'Gemini APIキーが設定されていません。設定 > 翻訳 に移動してください。'
        },
    'ko': {
            langName:                         '한국어',
            languageSettings:                 '🌐 언어',
            force_update:                     '🔄️ 강제 업데이트',
            settings:                         '⚙️ 설정',
            compatible_with:                  '호환성',
            force_update_alert:               '캐시가 삭제되었습니다. 업데이트된 데이터를 가져오기 위해 페이지를 새로 고침합니다.',
            downloading:                      '다운로드 중...',
            selection:                        '선택',
            trans_saved:                      '설정이 저장되었습니다!',
            close:                            '닫기',
            confirm:                          '확인',
            cancel:                           '취소',
            download:                         '다운로드',
            translate:                        '번역',
            trans_undo:                       '실행 취소',
            trans_translating:                '번역 중...',
            titles:                           '제목',
            bold:                             '굵게',
            italic:                           '기울임꼴',
            underline:                        '밑줄',
            strikethrough:                    '취소선',
            unordered_list:                   '글머리 기호 목록',
            ordered_list:                     '번호 매기기 목록',
            quote:                            '인용',
            inline_code:                      '인라인 코드',
            code_block:                       '코드 블록',
            horizontal_line:                  '가로줄',
            horizontal_line_style:            '가로줄 스타일',
            link:                             '링크',
            image:                            '이미지',
            video:                            '동영상',
            table:                            '표',
            subscript:                        '아래 첨자',
            superscript:                      '위 첨자',
            highlight:                        '형광펜',
            keyboard:                         '키보드 입력',
            abbreviation:                     '약어',
            text_color:                       '글자 색상',
            background_color:                 '배경 색상',
            details:                          '접이식 섹션',
            center:                           '가운데 정렬',
            border_style:                     '테두리 스타일',
            txt:                              '텍스트',
            title_placeholder:                '제목',
            bold_placeholder:                 '굵게',
            italic_placeholder:               '기울임꼴',
            underline_placeholder:            '밑줄',
            strikethrough_placeholder:        '취소선',
            list_item_placeholder:            '항목',
            inline_code_placeholder:          '코드',
            code_block_placeholder:           '코드를 입력하세요',
            link_text_placeholder:            '링크 텍스트',
            image_title_placeholder:          '예: 멋진 이미지',
            table_header_placeholder:         '헤더',
            table_cell_placeholder:           '셀',
            subscript_placeholder:            'sub',
            superscript_placeholder:          'sup',
            highlight_placeholder:            '강조됨',
            keyboard_placeholder:             'Ctrl+C',
            abbreviation_placeholder:         'HTML',
            colored_text_placeholder:         '색상 텍스트',
            colored_background_placeholder:   '색상 배경',
            details_summary_placeholder:      '요약 또는 제목',
            details_content_placeholder:      '숨길 내용...',
            center_placeholder:               '가운데 정렬 텍스트',
            trans_search_ph:                  '언어 검색...',
            prompt_hr_size:                   '크기 (px)',
            prompt_hr_color:                  '색상',
            prompt_insert_url:                'URL 입력:',
            prompt_link_text:                 '링크 텍스트:',
            prompt_insert_image_url:          '이미지 URL 입력 (https):',
            prompt_image_title:               '이미지 제목 (선택):',
            prompt_image_width:               '너비 (선택):',
            prompt_image_height:              '높이 (선택):',
            prompt_video_type:                '동영상 유형',
            prompt_video_poster_url:          '커버 이미지 URL (포스터)',
            prompt_insert_video_url:          '동영상 URL 입력:',
            prompt_video_width:               '너비 (선택):',
            prompt_video_height:              '높이 (선택):',
            prompt_columns:                   '열 개수:',
            prompt_rows:                      '행 개수:',
            prompt_abbreviation_text:         '약어 텍스트:',
            prompt_abbreviation_meaning:      '의미는 무엇입니까?',
            prompt_border_size:               '테두리 크기 (px)',
            prompt_border_color:              '테두리 색상',
            prompt_border_tag_type:           '태그 유형',
            prompt_translate_to:              '번역 대상:',
            mode:                             '번역 엔진',
            prompt_ai_model:                  'AI 모델:',
            prompt_api_key:                   'API 키 (Gemini API):',
            placeholder_api_key:              '여기에 AIza... 키를 붙여넣으세요',
            api_help_title:                   '무료 API 키를 얻는 방법',
            api_help_text:                    'Google은 넉넉한 무료 할당량을 제공합니다. 사용하려면 아래 링크를 통해 Google AI Studio에 접속하여 계정으로 로그인한 후 "Create API key"를 클릭하세요. 생성된 키를 복사하여 스크립트에 붙여넣으세요.',
            api_help_link_text:               'API 키 받기',
            api_help_tooltip:                 '도움말: 키를 얻는 방법',
            trans_mode_google:                'Google 번역 (기본값)',
            trans_mode_gemini:                'Gemini AI (최고 품질)',
            trans_target_lang:                '도착 언어',
            gemini_model_label:               'Gemini 모델',
            info_tooltip:                     '단축키',
            info_shortcuts_title:             '키보드 단축키',
            info_header_shortcut:             '단축키',
            info_header_action:               '동작',
            info_shortcut_tab:                '탭 공백 삽입',
            info_shortcut_shift_enter:        '줄 바꿈 <span style="color: #d21934;"><strong>&lt;br&gt;</strong></span> 삽입',
            info_shortcut_ctrl_d:             '선택 영역을 <span style="color: #d21934;"><strong>&lt;div&gt;</strong></span> 태그로 감싸기',
            info_shortcut_ctrl_p:             '선택 영역을 문단 <span style="color: #d21934;"><strong>&lt;p&gt;</strong></span>으로 감싸기',
            info_shortcut_ctrl_m:             '선택 영역을 마크다운 코드 블록으로 감싸기',
            info_shortcut_ctrl_space:         '줄 바꿈 없는 공백 <span style="color: #d21934;"><strong>&nbsp;</strong></span> 삽입',
            alert_invalid_video_url:          '유효하지 않거나 지원되지 않는 동영상 URL입니다.',
            alert_text_empty:                 '텍스트 상자가 비어 있습니다.',
            alert_translation_error:          '번역 오류: ',
            notFound:                         '코드를 찾을 수 없습니다!',
            scriptIdNotFound:                 '스크립트 ID를 식별할 수 없습니다.',
            downloadError:                    '스크립트를 다운로드하는 중 오류가 발생했습니다.',
            downloadTimeout:                  '스크립트 다운로드 시간이 초과되었습니다.',
            error_no_text:                    'AI가 유효한 텍스트를 반환하지 않았습니다.',
            error_api_processing:             'API 응답 처리 중 오류가 발생했습니다.',
            error_rede:                       '연결 오류.',
            error_generic:                    '오류',
            trans_err_gemini_key:             'Gemini API 키가 설정되지 않았습니다. 설정 > 번역으로 이동하세요.'
        },

    };

    // --- CONSTANTES ---
    const translations = allTranslations;
    const icons        = JSON.parse(GM_getResourceText("iconsJSON"));
    const myCss        = GM_getResourceText("customCSS");

    // --- INJETAR CSS ---
    GM_addStyle(myCss);

    // --- FUNÇÕES DE TRADUÇÃO E IDIOMA ---
    function getTranslation(key) {
        return translations[currentLang] ?.[key] || translations.en[key];
    }

    // --- GERENCIAR IDIOMA ---
    async function determineLanguage() {
        const savedLang = await GM_getValue(LANG_STORAGE_KEY);
        if (savedLang && translations[savedLang]) {
            currentLang = savedLang;
            return;
        }
        const browserLang = (navigator.language || navigator.userLanguage).toLowerCase();
        if      (browserLang.startsWith('pt')) currentLang = 'pt-BR';
        else if (browserLang.startsWith('zh')) currentLang = 'zh-CN';
        else if (browserLang.startsWith('en')) currentLang = 'en';
        else if (browserLang.startsWith('es')) currentLang = 'es';
        else if (browserLang.startsWith('fr')) currentLang = 'fr';
        else if (browserLang.startsWith('ru')) currentLang = 'ru';
        else if (browserLang.startsWith('ja')) currentLang = 'ja';
        else if (browserLang.startsWith('ko')) currentLang = 'ko';
        else currentLang = 'en';
    }

    // --- MENU DE IDIOMA ---
    function registerLanguageMenu() {
        GM_registerMenuCommand(getTranslation('languageSettings'), () => {
            showModal(languageModal);
        });
    }

    // --- MODAL DE SELEÇÃO DE IDIOMA ---
    function showModal(modal) {
        if (!modal) return;
        modal.style.display = 'flex';
        setTimeout(() => {
            const box = modal.querySelector('.lang-modal-box');
            box.style.opacity = '1';
            box.style.transform = 'scale(1)';
        }, 10);
    }

    // --- MODAL DE SELEÇÃO DE IDIOMA ---
    function hideModal(modal) {
        if (!modal) return;
        const box = modal.querySelector('.lang-modal-box');
        box.style.opacity = '0';
        box.style.transform = 'scale(0.95)';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 200);
    }

    // --- CRIAR MODAL DE SELEÇÃO DE IDIOMA ---
    function createLanguageModal() {
        const overlay = document.createElement('div');
        overlay.className = 'lang-modal-overlay';
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                hideModal(overlay);
            }
        });
        const box = document.createElement('div');
        box.className = 'lang-modal-box';
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'lang-modal-buttons';
        Object.keys(translations).forEach(langKey => {
            const btn = document.createElement('button');
            btn.textContent = translations[langKey].langName;
            btn.onclick = async () => {
                await GM_setValue(LANG_STORAGE_KEY, langKey);
                window.location.reload();
            };
            buttonsContainer.appendChild(btn);
        });
        box.appendChild(buttonsContainer);
        overlay.appendChild(box);
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        function applyTheme(isDark) {
            box.classList.toggle('dark-theme', isDark);
            box.classList.toggle('light-theme', !isDark);
        }
        applyTheme(mediaQuery.matches);
        mediaQuery.addEventListener('change', e => applyTheme(e.matches));
        return overlay;
    }

    // --- MENU DE FORÇAR ATUALIZAÇÃO ---
    function registerForceUpdateMenu() {
        GM_registerMenuCommand(getTranslation('force_update'), forceUpdate);
    }

    // --- FORÇAR ATUALIZAÇÃO ---
    async function forceUpdate() {
        alert(getTranslation('force_update_alert'));
        await GM_deleteValue(CACHE_KEY);
        window.location.reload();
    }

    // --- FUNÇÕES AUXILIARES ---
    function capitalizeCompatItem(item) {
        return item.replace(/\b\w/g, char => char.toUpperCase());
    }
    // #endregion

    // ================
    // #region ESTILIZAR
    // ================

    // --- NORMALIZAR CAMINHO DO SCRIPT ---
    function isScriptPage() {
        const path = window.location.pathname;
        return /^\/([a-z]{2}(-[A-Z]{2})?\/)?scripts\/\d+-[^/]+$/.test(path);
    }

    // --- ADICIONAR SEPARADOR ANTES DE INFORMAÇÕES ADICIONAIS ---
    function addAdditionalInfoSeparator() {
        const additionalInfo = document.getElementById('additional-info');
        if (additionalInfo && !additionalInfo.previousElementSibling?.matches('hr.bgs-info-separator')) {
            const hr = document.createElement('hr');
            hr.className = 'bgs-info-separator';
            additionalInfo.before(hr);
        }
    }

    // --- DESTACAR DESCRIÇÃO DO SCRIPT ---
    function highlightScriptDescription() {
        const descriptionElements = document.querySelectorAll('#script-description, .script-description.description');
        descriptionElements.forEach(element => {
            const scriptLink = element.closest('article, li')?.querySelector('a.script-link');
            const path = scriptLink ? normalizeScriptPath(new URL(scriptLink.href).pathname) : normalizeScriptPath(window.location.pathname);
            if (element && element.parentElement.tagName !== 'BLOCKQUOTE') {
                const blockquoteWrapper = document.createElement('blockquote');
                blockquoteWrapper.className = 'script-description-blockquote';
                if (path) {
                    blockquoteWrapper.dataset.bgfPath = path;
                }
                element.parentNode.insertBefore(blockquoteWrapper, element);
                blockquoteWrapper.appendChild(element);
            }
        });
    }

    // --- TORNAR DISCUSSÕES CLICÁVEIS ---
    function makeDiscussionClickable() {
        document.querySelectorAll('.discussion-list-container').forEach(container => {
            container.removeEventListener('click', handleDiscussionClick);
            container.addEventListener('click', handleDiscussionClick);
        });
    }

    // --- MANIPULADOR DE CLIQUE EM DISCUSSÃO ---
    function handleDiscussionClick(e) {
        if (e.target.tagName === 'A' ||
            e.target.closest('a') ||
            e.target.closest('.user-link') ||
            e.target.closest('.badge-author') ||
            e.target.closest('.rating-icon')) {
            return;
        }
        const discussionLink = this.querySelector('.discussion-title');
        if (discussionLink && discussionLink.href) {
            window.location.href = discussionLink.href;
        }
    }

    // --- APLICAR REALCE DE SINTAXE ---
    function applySyntaxHighlighting() {
        document.querySelectorAll('pre code').forEach(block => {
            if (block.dataset.highlighted === 'true') { return; }
            const code = block.textContent;
            block.innerHTML = highlight(code);
            block.dataset.highlighted = 'true';
        });
    }

    // --- ESCAPAR HTML ---
    function escapeHtml(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    // --- REALCE DE SINTAXE ---
    function highlight(code) {
        const keywords = new Set(['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'of', 'in', 'async', 'await', 'try', 'catch', 'new', 'import', 'export', 'from', 'class', 'extends', 'super', 'true', 'false', 'null', 'undefined', 'document', 'window']);
        const tokens = [];
        let cursor = 0;
        const tokenDefinitions = [
            { type: 'url',              regex: /^(https?:\/\/[^\s"'`<>]+)/ },
            { type: 'comment-special',  regex: /^(\/\/[^\r\n]*)/ },
            { type: 'comment',          regex: /^(\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->)/ },
            { type: 'string',           regex: /^(`(?:\\.|[^`])*`|"(?:\\.|[^"])*"|'(?:\\.|[^'])*')/ },
            { type: 'tag-punctuation',  regex: /^(&lt;\/?|\/&gt;|&gt;)/ },
            { type: 'tag-name',         regex: /^([\w-]+)/, context: (t) => { const l=t[t.length-1]; return l&&l.type==='tag-punctuation'&&l.content.startsWith('&lt;') }},
            { type: 'attribute',        regex: /^([\w-]+)/, context: (t) => { for(let i=t.length-1;i>=0;i--){const n=t[i];if(n.type==='tag-punctuation'&&n.content.includes('&gt;'))return!1;if(n.type==='tag-name')return!0;if(n.type==='whitespace')continue}return!1 }},
            { type: 'regex',            regex: /^(\/(?!\*)(?:[^\r\n/\\]|\\.)+\/[gimyus]*)/ },
            { type: 'number',           regex: /^\b-?(\d+(\.\d+)?)\b/ },
            { type: 'keyword',          regex: new RegExp(`^\\b(${Array.from(keywords).join('|')})\\b`) },
            { type: 'function',         regex: /^([a-zA-Z_][\w_]*)(?=\s*\()/ },
            { type: 'property',         regex: /^\.([a-zA-Z_][\w_]*)/ },
            { type: 'operator',         regex: /^(==?=?|!=?=?|=>|[+\-*/%&|^<>]=?|\?|:|=)/ },
            { type: 'punctuation',      regex: /^([,;(){}[\]])/ },
            { type: 'whitespace',       regex: /^\s+/ },
            { type: 'unknown',          regex: /^./ },
        ];
        let processedCode = escapeHtml(code);
        while (cursor < processedCode.length) {
            let matched = false;
            for (const def of tokenDefinitions) {
                if (def.context && !def.context(tokens)) { continue; }
                const match = def.regex.exec(processedCode.slice(cursor));
                if (match) {
                    const content = match[0];
                    if (def.type === 'function' && keywords.has(content)) { continue; }
                    tokens.push({ type: def.type, content });
                    cursor += content.length;
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                 tokens.push({ type: 'unknown', content: processedCode[cursor] });
                 cursor++;
            }
        }
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i].type === 'string') {
                let nextToken = null;
                for(let j=i+1;j<tokens.length;j++){if(tokens[j].type!=='whitespace'){nextToken=tokens[j];break}}
                if (nextToken && nextToken.content === ':') { tokens[i].type = 'json-key'; }
            }
        }
        return tokens.map(token => {
            if (['whitespace', 'unknown', 'url'].includes(token.type)) return token.content;
            if (token.type === 'property') return `<span class="sh-punctuation">.</span><span class="sh-property">${token.content.slice(1)}</span>`;
            return `<span class="sh-${token.type}">${token.content}</span>`;
        }).join('');
    }
    // #endregion

    // ================
    // #region ÍCONES
    // ================

    // --- GERENCIAR CACHE DE ÍCONES ---
    let iconCache;
    const processedKeys = new Set();

    // --- CARREGAR CACHE ---
    async function saveCache() {
        await GM_setValue(CACHE_KEY, iconCache);
    }

    // --- NORMALIZAR CAMINHO DO SCRIPT ---
    function normalizeScriptPath(pathname) {
        let withoutLocale = pathname.replace(/^\/[a-z]{2}(?:-[A-Z]{2})?\//, '/');
        const match = withoutLocale.match(/^\/scripts\/\d+-.+?(?=\/|$)/);
        return match ? match[0] : null;
    }

    // --- EXTRAIR ID DO SCRIPT DO CAMINHO NORMALIZADO ---
    function extractScriptIdFromNormalizedPath(normalized) {
        const match = normalized.match(/\/scripts\/(\d+)-/);
        return match ? match[1] : null;
    }

    // --- APLICAR RECURSOS BGF (tamanho do ícone) ---
    function createIconElement(src, isHeader = false) {
        const img = document.createElement('img');
        img.src = src;
        img.alt = '';
        if (isHeader) {
            img.style.cssText = `
                width: 80px;
                height: 80px;
                margin-right: 10px;
                vertical-align: middle;
                border-radius: 4px;
                object-fit: contain;
                pointer-events: none;
            `;
        } else {
            img.style.cssText = `
                width: 40px;
                height: 40px;
                margin-right: 8px;
                vertical-align: middle;
                border-radius: 3px;
                object-fit: contain;
                pointer-events: none;
            `;
        }
        img.loading = 'lazy';
        return img;
    }

    // --- EXTRAI METADADOS ---
    function extractMetadataFromContent(content) {
        if (typeof content !== 'string') return {};
        const metadata = {};
        const lines = content.split('\n');
        const supportedTags = new Set([ '@icon', '@bgf-colorLT', '@bgf-colorDT', '@bgf-compatible', '@bgf-copyright', '@bgf-social' ]);
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('// ==/UserScript==')) break;
            if (!trimmedLine.startsWith('// @')) continue;
            const match = trimmedLine.match(/\/\/\s*(@[a-zA-Z0-9-]+)\s+(.+)/);
            if (!match) continue;
            const key = match[1];
            let value = match[2].trim();
            if (supportedTags.has(key) && !metadata.hasOwnProperty(key)) {
                if (key === '@bgf-colorLT' || key === '@bgf-colorDT') {
                    const colorRegex = /(#[0-9a-fA-F]{3,8}|(?:rgba?|hsla?)\s*\([^)]+\))/;
                    const colorMatch = value.match(colorRegex);
                    if (colorMatch) {
                        value = colorMatch[0];
                    } else { value = value.split(',')[0].trim(); }
                }
                metadata[key] = value;
            }
        }
        return metadata;
    }

    // --- VALIDAR URL DO ÍCONE ---
    function isValidIconUrl(url) {
        return url && (url.startsWith('http') || url.startsWith(''));
    }

    // --- PROCESSAR SCRIPT ---
    async function processScript(normalizedPath, targetElement, isHeader = false) {
        if (processedKeys.has(normalizedPath) && isHeader) {
            applyBfgFeatures(iconCache[normalizedPath]);
        }
        if (processedKeys.has(normalizedPath) && !isHeader) {
            const cached = iconCache[normalizedPath];
            if (cached && isValidIconUrl(cached.iconUrl)) {
                targetElement.prepend(createIconElement(cached.iconUrl, isHeader));
            }
            return;
        }
        processedKeys.add(normalizedPath);
        const cached = iconCache[normalizedPath];
        const now = Date.now();
        const applyColorToBlockquote = (metadata) => {
            const blockquotes = document.querySelectorAll(`blockquote.script-description-blockquote[data-bgf-path="${normalizedPath}"]`);
            if (blockquotes.length === 0) return;
            const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const colorToApply = isDarkMode ? metadata.bgfColorDT : metadata.bgfColorLT;
            blockquotes.forEach(bq => {
                if (colorToApply) {
                    bq.style.setProperty('border-left-color', colorToApply, 'important');
                } else {
                    bq.style.removeProperty('border-left-color');
                }
            });
        };
        if (cached && now - cached.ts < 7 * 24 * 60 * 60 * 1000) {
            if (isValidIconUrl(cached.iconUrl)) {
                targetElement.prepend(createIconElement(cached.iconUrl, isHeader));
            }
            applyColorToBlockquote(cached);
            if (isHeader) {
                applyBfgFeatures(cached);
            }
            return;
        }
        const scriptId = extractScriptIdFromNormalizedPath(normalizedPath);
        if (!scriptId) {
            iconCache[normalizedPath] = { ts: now };
            await saveCache();
            return;
        }
        const scriptUrl = `https://update.greasyfork.org/scripts/${scriptId}.js`;
        GM_xmlhttpRequest({
            method: 'GET',
            url: scriptUrl,
            timeout: 6000,
            onload: async function (res) {
                if (typeof res.responseText !== 'string') {
                    iconCache[normalizedPath] = { ts: now };
                    await saveCache();
                    return;
                }
                const rawMetadata = extractMetadataFromContent(res.responseText);
                const metadata = {
                    iconUrl:        rawMetadata['@icon']            || null,
                    bgfColorLT:     rawMetadata['@bgf-colorLT']     || null,
                    bgfColorDT:     rawMetadata['@bgf-colorDT']     || null,
                    bgfCompatible:  rawMetadata['@bgf-compatible']  || null,
                    bgfCopyright:   rawMetadata['@bgf-copyright']   || null,
                    bgfSocial:      rawMetadata['@bgf-social']      || null,
                    ts:             now
                };
                iconCache[normalizedPath] = metadata;
                await saveCache();
                if (isValidIconUrl(metadata.iconUrl)) {
                    targetElement.prepend(createIconElement(metadata.iconUrl, isHeader));
                }
                applyColorToBlockquote(metadata);
                if (isHeader) {
                    applyBfgFeatures(metadata);
                }
            },
            onerror: async function () {
                iconCache[normalizedPath] = { ts: now };
                await saveCache();
            }
        });
    }

    // --- PROCESSAR ELEMENTOS DE ÍCONE ---
    function handleScriptLink(linkEl) {
        if (linkEl._handled) return;
        linkEl._handled = true;
        const href = linkEl.getAttribute('href');
        if (!href || !href.startsWith('/')) return;
        try {
            const url = new URL(href, window.location.origin);
            const normalized = normalizeScriptPath(url.pathname);
            if (!normalized) return;
            setTimeout(() => processScript(normalized, linkEl, false), 0);
        } catch (e) {}
    }

    // --- MANIPULAR H2 DO CABEÇALHO PRINCIPAL ---
    function handleMainHeaderH2() {
        const headers = document.querySelectorAll('header');
        for (const header of headers) {
            const h2 = header.querySelector('h2');
            const desc = header.querySelector('p.script-description');
            if (h2 && desc && !h2._handled) {
                h2._handled = true;
                const normalized = normalizeScriptPath(window.location.pathname);
                if (!normalized) return;
                setTimeout(() => processScript(normalized, h2, true), 0);
                break;
            }
        }
    }

    // --- PROCESSAR ELEMENTOS DE ÍCONE ---
    function processIconElements() {
        document.querySelectorAll('a.script-link:not([data-icon-processed])')
            .forEach(el => {
                el.setAttribute('data-icon-processed', '1');
                handleScriptLink(el);
            });
        handleMainHeaderH2();
    }
    // #endregion

    // ================
    // #region METADADOS
    // ================

    // --- APLICAR RECURSOS BGF (compatibilidade, direitos autorais, redes sociais) ---
    function applyBfgFeatures(metadata) {
        if (!metadata) return;
        applyBfgCompatibility(metadata.bgfCompatible);
        applyBfgCopyright(metadata.bgfCopyright);
        applyBfgSocial(metadata.bgfSocial);
    }

    // --- APLICAR COMPATIBILIDADE BGF ---
    function applyBfgCompatibility(compatValue) {
        if (!compatValue) return;
        const compatDd = document.querySelector('dd.script-show-compatibility');
        if (!compatDd) {
            return;
        }
        let compatContainer = compatDd.querySelector('span');
        if (!compatContainer) {
            compatContainer = document.createElement('span');
            compatDd.innerHTML = '';
            compatDd.appendChild(compatContainer);
        }
        const compatItems = compatValue.split(',').map(item => item.trim().toLowerCase());
        compatItems.forEach(item => {
            if (!icons[item] || compatContainer.querySelector(`.bgf-compat-${item}`)) {
                return;
            }
            const img = document.createElement('img');
            img.className = `browser-compatible bgf-compat-${item}`;
            const displayName = capitalizeCompatItem(item);
            img.alt = `${getTranslation('compatible_with')} ${displayName}`;
            img.title = `${getTranslation('compatible_with')} ${displayName}`;
            img.style.marginLeft = '1px';
            img.src = `data:image/svg+xml;utf8,${encodeURIComponent(icons[item])}`;
            compatContainer.appendChild(img);
        });
    }

    // --- REAPLICAR CORES DE BLOCKQUOTE AO MUDAR O TEMA (descrição do script) ---
    function reapplyAllBlockquoteColors() {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const allBlockquotes = document.querySelectorAll('blockquote.script-description-blockquote[data-bgf-path]');
        allBlockquotes.forEach(bq => {
            const path = bq.dataset.bgfPath;
            if (!path || !iconCache[path]) return;
            const metadata = iconCache[path];
            const colorToApply = isDarkMode ? metadata.bgfColorDT : metadata.bgfColorLT;
            if (colorToApply) {
                bq.style.setProperty('border-left-color', colorToApply, 'important');
            } else {
                bq.style.removeProperty('border-left-color');
            }
        });
    }

    // --- CONFIGURAR OUVINTE DE MUDANÇA DE TEMA ---
    function setupThemeChangeListener() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', reapplyAllBlockquoteColors);
    }

    // --- APLICAR DIREITOS AUTORAIS BGF ---
    function applyBfgCopyright(copyrightValue) {
        if (!copyrightValue || document.querySelector('.script-show-copyright')) return;
        const copyrightRegex = /\[(.{1,50})\]\((https:\/\/gist\.github\.com\/[^)]+)\)/;
        const match = copyrightValue.match(copyrightRegex);
        if (!match) return;
        const licenseDd = document.querySelector('dd.script-show-license');
        if (!licenseDd) return;
        const text = match[1];
        const url = match[2];
        const copyrightDt = document.createElement('dt');
        copyrightDt.className = 'script-show-copyright';
        copyrightDt.innerHTML = '<span>Copyright</span>';
        const copyrightDd = document.createElement('dd');
        copyrightDd.className = 'script-show-copyright';
        copyrightDd.style.alignSelf = 'center';
        const link = document.createElement('a');
        link.href = url;
        link.textContent = text;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        const span = document.createElement('span');
        span.appendChild(link);
        copyrightDd.appendChild(span);
        licenseDd.after(copyrightDt, copyrightDd);
    }

    // --- APLICAR REDES SOCIAIS BGF ---
    function applyBfgSocial(socialValue) {
        if (!socialValue || document.querySelector('.script-show-social')) return;
        const authorDd = document.querySelector('dd.script-show-author');
        if (!authorDd) return;
        const socialDomainMap = {
            'instagram.com':    { icon: icons.instagram,    name: 'Instagram'   },
            'facebook.com':     { icon: icons.facebook,     name: 'Facebook'    },
            'x.com':            { icon: icons.x,            name: 'X / Twitter' },
            'youtube.com':      { icon: icons.youtube,      name: 'YouTube'     },
            'bilibili.com':     { icon: icons.bilibili,     name: 'Bilibili'    },
            'tiktok.com':       { icon: icons.tiktok,       name: 'TikTok'      },
            'douyin.com':       { icon: icons.tiktok,       name: 'Douyin'      },
            'github.com':       { icon: icons.github,       name: 'GitHub'      },
            'linkedin.com':     { icon: icons.linkedin,     name: 'LinkedIn'    },
        };
        const urls = socialValue.split(',').map(url => url.trim());
        const validLinks = [];
        let tiktokFamilyProcessed = false;
        urls.forEach(url => {
            try {
                const domain = new URL(url).hostname.replace('www.', '');
                if (socialDomainMap[domain]) {
                    if (domain === 'tiktok.com' || domain === 'douyin.com') {
                        if (tiktokFamilyProcessed) return;
                        tiktokFamilyProcessed = true;
                    }
                    validLinks.push({ url, ...socialDomainMap[domain] });
                }
            } catch (e) {}
        });
        if (validLinks.length === 0) return;
        const socialDt = document.createElement('dt');
        socialDt.className = 'script-show-social';
        socialDt.innerHTML = '<span>Social</span>';
        const socialDd = document.createElement('dd');
        socialDd.className = 'script-show-social';
        socialDd.style.cssText = 'display: flex; gap: 8px; align-items: center; align-self: center; z-index: 10;';
        validLinks.forEach(linkInfo => {
            const link = document.createElement('a');
            link.href = linkInfo.url;
            link.title = linkInfo.name;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.innerHTML = linkInfo.icon;
            const svg = link.querySelector('svg');
            if (svg) {
                svg.style.width = '20px';
                svg.style.height = '20px';
                svg.style.verticalAlign = 'middle';
            }
            socialDd.appendChild(link);
        });
        authorDd.after(socialDt, socialDd);
    }
    // #endregion

    // ==========================================
    // #region FUNÇÕES DE TRADUÇÃO
    // ==========================================

    // --- MOTOR DE TRADUÇÃO - GOOGLE TRADUTOR ---
    function translateWithGoogle(text, targetLang) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: "q=" + encodeURIComponent(text),
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const json = JSON.parse(response.responseText);
                            let translated = "";
                            if (json && json[0]) {
                                json[0].forEach(seg => { if (seg[0]) translated += seg[0]; });
                                resolve(translated);
                            } else reject("Empty response from Google");
                        } catch (e) { reject("JSON Parse Error"); }
                    } else reject(`Google Error: ${response.status}`);
                },
                onerror: () => reject(getTranslation('error_rede'))
            });
        });
    }

    // --- MOTOR DE TRADUÇÃO - GEMINI ---
    async function translateWithGemini(text, targetLang, modelId, apiKey, isHTML = false) {
        return new Promise((resolve, reject) => {
            let systemInstruction = "";
            if (isHTML) {
                systemInstruction = `
                    You are a professional translator engine.
                    Task: Translate the text content within the provided HTML to ${targetLang}.
                    CRITICAL RULES:
                    1. STRICTLY PRESERVE all HTML tags (<div>, <p>, <a>, <h1>, span, style, etc), attributes (href, class, style), and structure.
                    2. Do NOT translate URLs, code blocks, or variable names.
                    3. Only translate the human-readable text.
                    4. Return ONLY the translated HTML code, no markdown block syntax (no \`\`\`).
                `;
            } else {
                systemInstruction = `
                    Translate the following text to ${targetLang}.
                    Rules: Natural phrasing, correct grammar, no conversational filler. Return only the translation.
                `;
            }
            GM_xmlhttpRequest({
                method: "POST",
                url: `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `${systemInstruction}\n\nContent to translate:\n${text}`
                        }]
                    }]
                }),
                onload: (response) => {
                    try {
                        if (response.status !== 200) {
                            const errorJson = JSON.parse(response.responseText);
                            reject(`Gemini Error ${response.status}: ${errorJson.error?.message || 'Unknown'}`);
                            return;
                        }
                        const data = JSON.parse(response.responseText);
                        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
                            let result = data.candidates[0].content.parts[0].text.trim();
                            if (result.startsWith('```html')) result = result.replace(/^```html/, '').replace(/```$/, '');
                            else if (result.startsWith('```')) result = result.replace(/^```/, '').replace(/```$/, '');
                            resolve(result);
                        } else {
                            reject(getTranslation('error_no_text'));
                        }
                    } catch (e) {
                        console.error(e);
                        reject(getTranslation('error_api_processing'));
                    }
                },
                onerror: (_err) => reject(getTranslation('error_rede'))
            });
        });
    }

    // --- FUNÇÃO PRINCIPAL DE TRADUÇÃO ---
    async function performTranslation(text, targetLangOverride = null, isHTML = false) {
        const cfg = getTransConfig();
        const targetLang = targetLangOverride || cfg.lang;
        if (cfg.mode === 'GEMINI') {
            const apiKey = await GM_getValue('GOOGLE_AI_KEY', '');
            const model = await GM_getValue('GOOGLE_AI_LAST_MODEL', 'gemini-3-flash-preview');
            if (!apiKey) throw new Error(getTranslation('trans_err_gemini_key'));
            return await translateWithGemini(text, targetLang, model, apiKey, isHTML);
        } else {
            return await translateWithGoogle(text, targetLang);
        }
    }

    // --- LISTA DE IDIOMAS ---
    function getSortedLanguages() {
        const allLangs = [
            { code: "af",   name: "Afrikaans"             }, { code: "sq",      name: "Albanian"                }, { code: "am",    name: "Amharic"                 },
            { code: "ar",   name: "Arabic"                }, { code: "hy",      name: "Armenian"                }, { code: "az",    name: "Azerbaijani"             },
            { code: "eu",   name: "Basque"                }, { code: "be",      name: "Belarusian"              }, { code: "bn",    name: "Bengali"                 },
            { code: "bs",   name: "Bosnian"               }, { code: "bg",      name: "Bulgarian"               }, { code: "ca",    name: "Catalan"                 },
            { code: "ceb",  name: "Cebuano"               }, { code: "zh-CN",   name: "Chinese (Simplified)"    }, { code: "zh-TW", name: "Chinese (Traditional)"   },
            { code: "co",   name: "Corsican"              }, { code: "hr",      name: "Croatian"                }, { code: "cs",    name: "Czech"                   },
            { code: "da",   name: "Danish"                }, { code: "nl",      name: "Dutch"                   }, { code: "en",    name: "English"                 },
            { code: "eo",   name: "Esperanto"             }, { code: "et",      name: "Estonian"                }, { code: "fi",    name: "Finnish"                 },
            { code: "fr",   name: "French"                }, { code: "fy",      name: "Frisian"                 }, { code: "gl",    name: "Galician"                },
            { code: "ka",   name: "Georgian"              }, { code: "de",      name: "German"                  }, { code: "el",    name: "Greek"                   },
            { code: "gu",   name: "Gujarati"              }, { code: "ht",      name: "Haitian Creole"          }, { code: "ha",    name: "Hausa"                   },
            { code: "haw",  name: "Hawaiian"              }, { code: "iw",      name: "Hebrew"                  }, { code: "hi",    name: "Hindi"                   },
            { code: "hmn",  name: "Hmong"                 }, { code: "hu",      name: "Hungarian"               }, { code: "is",    name: "Icelandic"               },
            { code: "ig",   name: "Igbo"                  }, { code: "id",      name: "Indonesian"              }, { code: "ga",    name: "Irish"                   },
            { code: "it",   name: "Italian"               }, { code: "ja",      name: "Japanese"                }, { code: "jw",    name: "Javanese"                },
            { code: "kn",   name: "Kannada"               }, { code: "kk",      name: "Kazakh"                  }, { code: "km",    name: "Khmer"                   },
            { code: "ko",   name: "Korean"                }, { code: "ku",      name: "Kurdish (Kurmanji)"      }, { code: "ckb",   name: "Kurdish (Sorani)"        },
            { code: "ky",   name: "Kyrgyz"                }, { code: "lo",      name: "Lao"                     }, { code: "la",    name: "Latin"                   },
            { code: "lv",   name: "Latvian"               }, { code: "lt",      name: "Lithuanian"              }, { code: "lb",    name: "Luxembourgish"           },
            { code: "mk",   name: "Macedonian"            }, { code: "mg",      name: "Malagasy"                }, { code: "ms",    name: "Malay"                   },
            { code: "ml",   name: "Malayalam"             }, { code: "mt",      name: "Maltese"                 }, { code: "mi",    name: "Maori"                   },
            { code: "mr",   name: "Marathi"               }, { code: "mn",      name: "Mongolian"               }, { code: "my",    name: "Myanmar (Burmese)"       },
            { code: "ne",   name: "Nepali"                }, { code: "no",      name: "Norwegian"               }, { code: "ny",    name: "Nyanja (Chichewa)"       },
            { code: "ps",   name: "Pashto"                }, { code: "fa",      name: "Persian"                 }, { code: "pl",    name: "Polish"                  },
            { code: "pt",   name: "Portuguese (Portugal)" }, { code: "pt-BR",   name: "Portuguese (Brazil)"     }, { code: "pa",    name: "Punjabi"                 },
            { code: "ro",   name: "Romanian"              }, { code: "ru",      name: "Russian"                 }, { code: "sm",    name: "Samoan"                  },
            { code: "gd",   name: "Scots Gaelic"          }, { code: "sr",      name: "Serbian"                 }, { code: "st",    name: "Sesotho"                 },
            { code: "sn",   name: "Shona"                 }, { code: "sd",      name: "Sindhi"                  }, { code: "si",    name: "Sinhala"                 },
            { code: "sk",   name: "Slovak"                }, { code: "sl",      name: "Slovenian"               }, { code: "so",    name: "Somali"                  },
            { code: "es",   name: "Spanish"               }, { code: "su",      name: "Sundanese"               }, { code: "sw",    name: "Swahili"                 },
            { code: "sv",   name: "Swedish"               }, { code: "tl",      name: "Tagalog (Filipino)"      }, { code: "tg",    name: "Tajik"                   },
            { code: "ta",   name: "Tamil"                 }, { code: "tt",      name: "Tatar"                   }, { code: "te",    name: "Telugu"                  },
            { code: "th",   name: "Thai"                  }, { code: "tr",      name: "Turkish"                 }, { code: "uk",    name: "Ukrainian"               },
            { code: "ur",   name: "Urdu"                  }, { code: "tk",      name: "Turkmen"                 }, { code: "ug",    name: "Uyghur"                  },
            { code: "uz",   name: "Uzbek"                 }, { code: "vi",      name: "Vietnamese"              }, { code: "cy",    name: "Welsh"                   },
            { code: "xh",   name: "Xhosa"                 }, { code: "yi",      name: "Yiddish"                 }, { code: "yo",    name: "Yoruba"                  },
            { code: "zu",   name: "Zulu"                  }
        ];
        const priorities = ['en', 'zh-CN', 'zh-TW', 'pt-BR', 'es', 'fr', 'ja', 'ko', 'ru', 'de', 'it'];
        const topList = [];
        const otherList = [];
        allLangs.forEach(lang => {
            if (priorities.includes(lang.code)) {
                topList.push(lang);
            } else {
                otherList.push(lang);
            }
        });
        topList.sort((a, b) => priorities.indexOf(a.code) - priorities.indexOf(b.code));
        otherList.sort((a, b) => a.name.localeCompare(b.name));
        return [...topList, ...otherList].map(l => ({ value: l.code, text: l.name }));
    }
    const TRANS_CONFIG_KEY = 'TranslationConfig';

    // --- CONFIGURAÇÃO DE TRADUÇÃO RÁPIDA ---
    function getTransConfig() {
        return GM_getValue(TRANS_CONFIG_KEY, {
            mode: 'GOOGLE',
            lang: navigator.language.startsWith('pt') ? 'pt-BR' : 'en'
        });
    }

    // --- SALVAR CONFIGURAÇÃO DE TRADUÇÃO RÁPIDA ---
    function saveTransConfig(cfg) {
        GM_setValue(TRANS_CONFIG_KEY, cfg);
    }

    // --- MODELOS GEMINI ---
    function getGeminiModels() {
        return [
            { value: 'gemini-3-pro-preview',       text: 'Gemini 3 Pro Preview'     },
            { value: 'gemini-3-flash-preview',     text: 'Gemini 3 Flash Preview'   },
            { value: 'gemini-2.5-pro',             text: 'Gemini 2.5 Pro'           },
            { value: 'gemini-2.5-flash',           text: 'Gemini 2.5 Flash'         },
            { value: 'gemini-2.5-flash-lite',      text: 'Gemini 2.5 Flash Lite'    },
            { value: 'gemini-2.0-flash',           text: 'Gemini 2.0 Flash'         },
            { value: 'gemini-2.0-flash-lite',      text: 'Gemini 2.0 Flash Lite'    },
            { value: 'gemini-flash-latest',        text: 'Gemini Flash Latest'      },
            { value: 'gemini-flash-lite-latest',   text: 'Gemini Flash Lite Latest' }
        ];
    }

    // --- ABRIR CONFIGURAÇÕES DE TRADUÇÃO ---
    async function openTranslationSettings() {
        if (document.querySelector('.bgf-trans-overlay')) return;
        const cfg = getTransConfig();
        const savedKey = await GM_getValue('GOOGLE_AI_KEY', '');
        const savedModel = await GM_getValue('GOOGLE_AI_LAST_MODEL', 'gemini-3-flash-preview');
        const overlay = document.createElement('div');
        overlay.className = 'bgf-trans-overlay';
        const modal = document.createElement('div');
        modal.className = 'bgf-trans-modal';
        const ICON_INFO = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
        modal.innerHTML = `
            <form autocomplete="off" onsubmit="return false;" style="display:flex; flex-direction:column; gap:15px;">
                <div>
                    <label class="bgf-trans-label">${getTranslation('trans_target_lang')}</label>
                    <div class="bgf-lang-container">
                        <input type="text" class="bgf-lang-search" id="bgf-search"
                               placeholder="${getTranslation('trans_search_ph')}"
                               autocomplete="off" name="bgf-search-random-${Date.now()}">
                        <ul class="bgf-lang-list" id="bgf-list"></ul>
                    </div>
                </div>
                <div>
                    <label class="bgf-trans-label">${getTranslation('mode') || 'Motor'}</label>
                    <select id="bgf-mode" class="bgf-trans-select">
                        <option value="GOOGLE" ${cfg.mode === 'GOOGLE' ? 'selected' : ''}>${getTranslation('trans_mode_google')}</option>
                        <option value="GEMINI" ${cfg.mode === 'GEMINI' ? 'selected' : ''}>${getTranslation('trans_mode_gemini')}</option>
                    </select>
                </div>
                <div id="bgf-gemini-opts" class="bgf-gemini-group" style="display:none;">
                    <div style="margin-bottom:10px;">
                        <label class="bgf-trans-label">${getTranslation('gemini_model_label')}</label>
                        <select id="bgf-model" class="bgf-trans-select">
                            ${getGeminiModels().map(m => `<option value="${m.value}" ${m.value === savedModel ? 'selected' : ''}>${m.text}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="bgf-trans-label" style="display:inline-block;">API Key</label>
                        <span id="bgf-info-btn" class="bgf-info-icon" title="Ajuda API">${ICON_INFO}</span>
                        <input type="password" id="bgf-key" class="bgf-trans-input"
                               value="${savedKey}" placeholder="${getTranslation('placeholder_api_key')}"
                               autocomplete="new-password" name="bgf-api-key-field">
                    </div>
                </div>
                <div class="bgf-trans-actions">
                    <button id="bgf-cancel" class="bgf-trans-btn bgf-btn-secondary">${getTranslation('cancel')}</button>
                    <button id="bgf-save" class="bgf-trans-btn bgf-btn-primary">${getTranslation('confirm')}</button>
                </div>
            </form>
        `;
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        const searchInput = modal.querySelector('#bgf-search');
        const langList = modal.querySelector('#bgf-list');
        const modeSelect = modal.querySelector('#bgf-mode');
        const geminiOpts = modal.querySelector('#bgf-gemini-opts');
        let currentLang = cfg.lang;
        const toggleGemini = () => {
            geminiOpts.style.display = modeSelect.value === 'GEMINI' ? 'block' : 'none';
        };
        modeSelect.addEventListener('change', toggleGemini);
        toggleGemini();
        modal.querySelector('#bgf-info-btn').onclick = (e) => {
            e.preventDefault();
            showApiKeyHelp();
        };
        const renderLangs = (filter = "") => {
            langList.innerHTML = "";
            const term = filter.toLowerCase();
            getSortedLanguages().forEach(l => {
                if(l.text.toLowerCase().includes(term) || l.value.includes(term)) {
                    const li = document.createElement('li');
                    li.className = `bgf-lang-option ${currentLang === l.value ? 'selected' : ''}`;
                    li.textContent = l.text;
                    li.onclick = () => {
                        currentLang = l.value;
                        renderLangs(filter);
                    };
                    langList.appendChild(li);
                }
            });
        };
        searchInput.addEventListener('input', (e) => renderLangs(e.target.value));
        renderLangs();
        modal.querySelector('#bgf-save').onclick = async (e) => {
            e.preventDefault();
            const newMode = modeSelect.value;
            const newModel = modal.querySelector('#bgf-model').value;
            const newKey = modal.querySelector('#bgf-key').value.trim();
            saveTransConfig({ mode: newMode, lang: currentLang });
            if(newMode === 'GEMINI') {
                if(newKey) await GM_setValue('GOOGLE_AI_KEY', newKey);
                await GM_setValue('GOOGLE_AI_LAST_MODEL', newModel);
            }
            overlay.remove();
            showCustomAlert(getTranslation('trans_saved'));
        };
        modal.querySelector('#bgf-cancel').onclick = (e) => {
            e.preventDefault();
            overlay.remove();
        };
    }

    // --- ÍCONES DE TRADUÇÃO ---
    const ICN_TRANS = `<svg viewBox="0 0 20 20" width="12" height="12" fill="currentColor"><path d="m7.4 9 2.3 2.2-.9 2L6 10.4l-3.3 3.3-1.4-1.4L4.6 9l-.9-.9A6 6 0 0 1 2.4 6h2.2l.5.7.9.9.9-.9C7.5 6.1 8 4.8 8 4H0V2h5V0h2v2h5v2h-2c0 1.4-.7 3.2-1.7 4.1zm3.9 8L10 20H8l5-12h2l5 12h-2l-1.2-3zm.8-2h3.8L14 10.4z"/></svg>`;
    const ICN_UNDO  = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/></svg>`;
    const ICN_SPIN  = `<svg class="bgf-spin" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>`;

    // --- DESCRIÇÃO ---
    function processDescriptionTranslation() {
        document.querySelectorAll('.script-description').forEach(el => {
            if (el.querySelector('.bgf-translate-btn-desc')) return;
            const btn = document.createElement('a');
            btn.className = 'bgf-translate-btn-desc';
            btn.href = '#';
            btn.innerHTML = `${ICN_TRANS} ${getTranslation('translate')}`;
            if (el.firstChild) el.insertBefore(btn, el.firstChild);
            else el.appendChild(btn);
            let originalHTML = null;
            let isTranslated = false;
            btn.onclick = async (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isTranslated && originalHTML) {
                    el.innerHTML = originalHTML;
                    isTranslated = false;
                } else {
                    btn.remove();
                    originalHTML = el.innerHTML;
                    const textToTranslate = el.innerText.trim();
                    if (el.firstChild) el.insertBefore(btn, el.firstChild); else el.appendChild(btn);
                    btn.innerHTML = `${ICN_SPIN} ${getTranslation('trans_translating')}`;
                    btn.style.pointerEvents = 'none';
                    try {
                        const translation = await performTranslation(textToTranslate);
                        const cfg = getTransConfig();
                        let finalHtml = translation.replace(/\n/g, '<br>');
                        if (cfg.mode === 'GEMINI') finalHtml = finalHtml.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
                        el.innerHTML = `${finalHtml}<hr style="opacity:0.2; margin:10px 0;"><div style="opacity:0.6; font-size:0.9em; font-style:italic;">${originalHTML}</div>`;
                        const undoBtn = document.createElement('a');
                        undoBtn.className = 'bgf-translate-btn-desc';
                        undoBtn.href='#';
                        undoBtn.innerHTML = `${ICN_UNDO} ${getTranslation('trans_undo')}`;
                        undoBtn.onclick = (ev) => { ev.preventDefault(); el.innerHTML = originalHTML; };
                        el.insertBefore(undoBtn, el.firstChild);
                        isTranslated = true;
                    } catch (err) {
                        showCustomAlert(err.message || err);
                        btn.innerHTML = `${ICN_TRANS} ${getTranslation('translate')}`;
                    } finally { btn.style.pointerEvents = 'auto'; }
                }
            };
        });
    }

    // --- INFORMAÇÃO ADICIONAL ---
    function processAdditionalInfoTranslation() {
        const el = document.querySelector('#additional-info');
        if (!el || el.querySelector('.bgf-translate-btn-desc')) return;
        const btn = document.createElement('a');
        btn.className = 'bgf-translate-btn-desc';
        btn.href = '#';
        btn.style.marginBottom = '15px';
        btn.innerHTML = `${ICN_TRANS} ${getTranslation('translate')}`;
        if (el.firstChild) el.insertBefore(btn, el.firstChild);
        else el.appendChild(btn);
        let originalHTML = null;
        let isTranslated = false;
        btn.onclick = async (e) => {
            e.preventDefault();
            if (isTranslated && originalHTML) {
                el.innerHTML = originalHTML;
                isTranslated = false;
            } else {
                btn.remove();
                originalHTML = el.innerHTML;
                if (el.firstChild) el.insertBefore(btn, el.firstChild); else el.appendChild(btn);
                btn.innerHTML = `${ICN_SPIN} ${getTranslation('trans_translating')}`;
                btn.style.pointerEvents = 'none';
                try {
                    const translation = await performTranslation(originalHTML, null, true);
                    el.innerHTML = translation;
                    const undoBtn = document.createElement('a');
                    undoBtn.className = 'bgf-translate-btn-desc';
                    undoBtn.style.marginBottom = '15px';
                    undoBtn.href='#';
                    undoBtn.innerHTML = `${ICN_UNDO} ${getTranslation('trans_undo')}`;
                    undoBtn.onclick = (ev) => { ev.preventDefault(); el.innerHTML = originalHTML; };
                    if(el.firstChild) el.insertBefore(undoBtn, el.firstChild);
                    else el.appendChild(undoBtn);
                    isTranslated = true;
                } catch (err) {
                    showCustomAlert("Erro: " + (err.message || err));
                    btn.innerHTML = `${ICN_TRANS} ${getTranslation('translate')}`;
                } finally { btn.style.pointerEvents = 'auto'; }
            }
        };
    }

    // --- COMENTÁRIOS ---
    function processCommentTranslation() {
        document.querySelectorAll('.comment').forEach(comment => {
            if (comment.querySelector('.bgf-translate-btn-comment')) return;
            const meta = comment.querySelector('.comment-meta');
            const body = comment.querySelector('.user-content');
            if(!meta || !body) return;
            const btnContainer = document.createElement('span');
            btnContainer.className = 'comment-meta-item bgf-translate-btn-comment';
            btnContainer.innerHTML = `${ICN_TRANS} ${getTranslation('translate')}`;
            const spacer = meta.querySelector('.comment-meta-spacer');
            if (spacer) meta.insertBefore(btnContainer, spacer);
            else meta.appendChild(btnContainer);
            let originalHTML = null;
            let isTranslated = false;
            btnContainer.onclick = async () => {
                if(isTranslated && originalHTML) {
                    body.innerHTML = originalHTML;
                    btnContainer.innerHTML = `${ICN_TRANS} ${getTranslation('translate')}`;
                    btnContainer.style.color = '';
                    isTranslated = false;
                } else {
                    originalHTML = body.innerHTML;
                    btnContainer.innerHTML = `${ICN_SPIN} ...`;
                    try {
                        const translation = await performTranslation(originalHTML, null, true);
                        body.innerHTML = translation;
                        btnContainer.innerHTML = `${ICN_UNDO} ${getTranslation('trans_undo')}`;
                        btnContainer.style.color = '#00b1b8';
                        isTranslated = true;
                    } catch (err) {
                        alert(err);
                        btnContainer.innerHTML = `${ICN_TRANS} ${getTranslation('translate')}`;
                    }
                }
            };
        });
    }

    // --- EXECUTAR TRADUÇÕES ---
    function runTranslations() {
        processDescriptionTranslation();
        processAdditionalInfoTranslation();
        processCommentTranslation();
    }

    // ================
    // #region EDITOR HTML
    // ================

    // --- INSERIR TEXTO ---
    function insertText(textarea, prefix, suffix = '', placeholder = '') {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = textarea.value.substring(start, end);
        const text = selected || placeholder;
        if (!selected && !placeholder) {
            textarea.setRangeText(prefix + suffix, start, end);
            const cursorPosition = start + prefix.length;
            textarea.setSelectionRange(cursorPosition, cursorPosition);
        } else {
            textarea.setRangeText(prefix + text + suffix, start, end, selected ? 'end' : 'select');
        }
        textarea.focus();
    }

    // --- BOTÃO DA BARRA DE FERRAMENTAS ---
    function createToolbarButton(def) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'txt-editor-toolbar-button';
        btn.dataset.tooltip = def.title;
        btn.innerHTML = def.icon || def.label;
        btn.addEventListener('click', e => {
            e.preventDefault();
            def.action();
        });
        return btn;
    }

    // --- CAIXAS DE DIÁLOGO ---
    function showCustomAlert(message) {
        const overlay = document.createElement('div');
        overlay.className = 'custom-prompt-overlay';
        const modal = document.createElement('div');
        modal.className = 'custom-prompt-box custom-alert-box';
        const editorContainer = document.querySelector('.txt-editor-container');
        modal.classList.add(editorContainer && editorContainer.classList.contains('dark-theme') ? 'dark-theme' : 'light-theme');
        const messageP = document.createElement('p');
        messageP.textContent = message;
        const closeBtn = document.createElement('button');
        closeBtn.textContent = getTranslation('close');
        closeBtn.className = 'custom-prompt-confirm';
        closeBtn.onclick = () => document.body.removeChild(overlay);
        modal.append(messageP, closeBtn);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        closeBtn.focus();
    }

    // --- MENU DE TRADUÇÃO TOOLBAR ---
    function showCustomPrompt({ inputs, onConfirm }) {
        const overlay = document.createElement('div');
        overlay.className = 'custom-prompt-overlay';
        const modal = document.createElement('div');
        modal.className = 'custom-prompt-box';
        const editorContainer = document.querySelector('.txt-editor-container');
        if(editorContainer) modal.classList.add(editorContainer.classList.contains('dark-theme') ? 'dark-theme' : 'light-theme');
        const form = document.createElement('form');
        const inputsMap = new Map();
        inputs.forEach(config => {
            const label = document.createElement('label');
            label.dataset.fieldId = config.id;
            const labelTextContainer = document.createElement('div');
            labelTextContainer.style.display = 'flex';
            labelTextContainer.style.justifyContent = 'space-between';
            labelTextContainer.style.alignItems = 'center';
            labelTextContainer.style.marginBottom = '4px';
            const textSpan = document.createElement('span');
            textSpan.textContent = config.label;
            labelTextContainer.appendChild(textSpan);
            if (config.helpAction) {
                const helpIcon = document.createElement('span');
                helpIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>';
                helpIcon.style.cursor = 'pointer';
                helpIcon.style.opacity = '0.7';
                helpIcon.title = getTranslation('api_help_tooltip') || "Help";
                helpIcon.addEventListener('click', (e) => { e.preventDefault(); config.helpAction(); });
                labelTextContainer.appendChild(helpIcon);
            }
            label.appendChild(labelTextContainer);
            let field;
            if (config.type === 'select') {
                field = document.createElement('select');
                (config.options || []).forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt.value;
                    option.textContent = opt.text;
                    if (config.value && opt.value === config.value) option.selected = true;
                    field.appendChild(option);
                });
            } else {
                field = document.createElement('input');
                field.type = config.type || 'text';
                if(config.placeholder) field.placeholder = config.placeholder;
                field.value = config.value || '';
                if(config.required !== false) field.required = true;
            }
            label.appendChild(field);
            form.appendChild(label);
            inputsMap.set(config.id, { field, label });
        });
        inputs.forEach(config => {
            if (config.onChange) {
                const entry = inputsMap.get(config.id);
                const handler = () => {
                    config.onChange(entry.field.value, inputsMap);
                };
                entry.field.addEventListener('change', handler);
                handler();
            }
        });
        const buttons = document.createElement('div');
        buttons.className = 'custom-prompt-buttons';
        const confirmBtn = document.createElement('button');
        confirmBtn.type = 'submit';
        confirmBtn.textContent = getTranslation('confirm') || 'OK';
        confirmBtn.className = 'custom-prompt-confirm';
        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.textContent = getTranslation('cancel') || 'Cancel';
        cancelBtn.className = 'custom-prompt-cancel';
        cancelBtn.onclick = () => document.body.removeChild(overlay);
        form.onsubmit = (e) => {
            e.preventDefault();
            const results = {};
            for (const [id, entry] of inputsMap.entries()) {
                results[id] = entry.field.value;
            }
            onConfirm(results);
            document.body.removeChild(overlay);
        };
        buttons.append(confirmBtn, cancelBtn);
        form.appendChild(buttons);
        modal.appendChild(form);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        const firstInput = form.querySelector('input, select');
        if(firstInput) firstInput.focus();
    }

    // --- MENU DE INFORMAÇÕES ---
    function showInfoModal() {
        const overlay = document.createElement('div');
        overlay.className = 'custom-prompt-overlay info-modal-overlay';
        overlay.style.display = 'flex';
        const modal = document.createElement('div');
        modal.className = 'custom-prompt-box info-modal-box';
        const editorContainer = document.querySelector('.txt-editor-container');
        modal.classList.add(editorContainer && editorContainer.classList.contains('dark-theme') ? 'dark-theme' : 'light-theme');
        modal.innerHTML = `
            <h2>${getTranslation('info_shortcuts_title')}</h2>
            <div class="info-shortcuts">
                <table>
                    <thead>
                        <tr>
                            <th>${getTranslation('info_header_shortcut')}</th>
                            <th>${getTranslation('info_header_action')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>Tab</code></td>
                            <td>${getTranslation('info_shortcut_tab')}</td>
                        </tr>
                        <tr>
                            <td><code>Shift + Enter</code></td>
                            <td>${getTranslation('info_shortcut_shift_enter')}</td>
                        </tr>
                        <tr>
                            <td><code>Ctrl + D</code></td>
                            <td>${getTranslation('info_shortcut_ctrl_d')}</td>
                        </tr>
                        <tr>
                            <td><code>Ctrl + P</code></td>
                            <td>${getTranslation('info_shortcut_ctrl_p')}</td>
                        </tr>
                        <tr>
                            <td><code>Ctrl + M</code></td>
                            <td>${getTranslation('info_shortcut_ctrl_m')}</td>
                        </tr>
                        <tr>
                            <td><code>Ctrl + Space</code></td>
                            <td>${getTranslation('info_shortcut_ctrl_space')}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="custom-prompt-buttons">
                <button class="custom-prompt-cancel">${getTranslation('close')}</button>
            </div>
        `;
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        overlay.querySelector('.custom-prompt-cancel').onclick = () => document.body.removeChild(overlay);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
    }

    // --- AJUDA SOBRE A CHAVE DE API ---
    function showApiKeyHelp() {
        const overlay = document.createElement('div');
        overlay.className = 'custom-prompt-overlay info-modal-overlay';
        overlay.style.display = 'flex';
        const modal = document.createElement('div');
        modal.className = 'custom-prompt-box info-modal-box';
        const editorContainer = document.querySelector('.txt-editor-container');
        modal.classList.add(editorContainer && editorContainer.classList.contains('dark-theme') ? 'dark-theme' : 'light-theme');
        const linkStyle = `
            display: inline-block;
            padding: 8px 16px;
            background-color: #444;
            border: 1px solid #666;
            color: #fff;
            text-decoration: none;
            border-radius: 4px;
            font-size: 0.9em;
            transition: background 0.2s;
            cursor: pointer;
        `;
        modal.innerHTML = `
            <h3 style="margin: 0 0 15px 0; text-align: center;">${getTranslation('api_help_title')}</h3>
            <p style="margin: 0 15px 20px 15px; text-align: center; line-height: 1.6; opacity: 0.95;">
                ${getTranslation('api_help_text')}
            </p>
            <div style="text-align: center; margin-bottom: 0px;">
                <a href="https://aistudio.google.com/api-keys" target="_blank" id="api-help-link" style="${linkStyle}"
                   onmouseover="this.style.backgroundColor='#555'"
                   onmouseout="this.style.backgroundColor='#444'">
                    ${getTranslation('api_help_link_text')}
                </a>
            </div>
        `;
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        const linkBtn = document.getElementById('api-help-link');
        if(linkBtn) linkBtn.focus();
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
        const escListener = (e) => {
            if (e.key === 'Escape') {
                if (document.body.contains(overlay)) {
                    document.body.removeChild(overlay);
                }
                document.removeEventListener('keydown', escListener);
            }
        };
        document.addEventListener('keydown', escListener);
    }

    // --- ATALHOS DE TEXTO E EDITOR DE TEXTO ---
    async function createTextStyleEditor(textarea) {
        if (textarea.dataset.editorApplied) return;
        textarea.dataset.editorApplied = 'true';
        textarea.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = this.selectionStart;
                const end = this.selectionEnd;
                this.setRangeText('   ', start, end, 'end');
            }
            if (e.shiftKey && e.key === 'Enter') {
                e.preventDefault();
                const start = this.selectionStart;
                const end = this.selectionEnd;
                this.setRangeText('<br>', start, end, 'end');
            }
            if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'd') {
                e.preventDefault();
                insertText(this, '<div>\n', '\n</div>', '');
            }
            if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'p') {
                e.preventDefault();
                insertText(this, '<p>', '</p>', '');
            }
            if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'm') {
                e.preventDefault();
                insertText(this, '```\n', '\n```', '');
            }
            if (e.ctrlKey && !e.shiftKey && e.key === ' ') {
                e.preventDefault();
                insertText(this, '&nbsp;', '', '');
            }
        });

        // --- CONTAINER E BARRA DE FERRAMENTAS ---
        const container = document.createElement('div');
        container.className = 'txt-editor-container';
        const toolbar = document.createElement('div');
        toolbar.className = 'txt-editor-toolbar';
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        // --- APLICAR TEMA ---
        function applyTheme(isDark) {
            container.classList.toggle('dark-theme', isDark);
            container.classList.toggle('light-theme', !isDark);
        }
        applyTheme(mediaQuery.matches);
        mediaQuery.addEventListener('change', e => applyTheme(e.matches));

        // --- FERRAMENTAS DA BARRA DE FERRAMENTAS ---
        const tools = [
            { type: 'select', title: getTranslation('titles'), options: { 'H1': '1', 'H2': '2', 'H3': '3', 'H4': '4', 'H5': '5', 'H6': '6' }, action: (val) => insertText(textarea, `<h${val}>`, `</h${val}>`, getTranslation('title_placeholder')) },
            { type: 'divider' },
            { title: getTranslation('bold'),            icon:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26"><path fill="currentColor" d="M22.94 18.05a5.3 5.3 0 0 1-.7 2.82 5 5 0 0 1-2.03 1.83q-1.4.71-3.21 1c-1.22.2-1.65.3-3.3.3H2v-1.78c.32-.03 2.03-.43 2.03-1.96V6.06C4.03 4.2 2.32 3.97 2 3.92V2h11.95c3.01 0 3.64.41 4.98 1.24q2 1.25 2 3.66c0 3.09-2.47 4.93-3.28 5.11v.3c.8.08 5.3.95 5.3 5.74m-7.5-10.23A2.5 2.5 0 0 0 14.4 5.7c-.68-.51-1.49-.77-2.86-.77a24 24 0 0 0-1.58.05v6.1h.8c1.68 0 2.69-.3 3.48-.88q1.2-.87 1.2-2.37m.8 9.65q0-1.74-1.3-2.68c-.87-.62-1.9-.93-3.54-.93l-.75.02-.7.03v7.17h2.32q1.76 0 2.87-.94a3.3 3.3 0 0 0 1.1-2.66"/></svg>', action: () => insertText(textarea, '<strong>', '</strong>', getTranslation('bold_placeholder'))},
            { title: getTranslation('italic'),          icon:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"><path fill="currentColor" d="M2 0v1h1.63l-.06.13-2 5-.34.88H.01v1h5v-1H3.38l.06-.13 2-5L5.78 1H7V0z"/></svg>', action: () => insertText(textarea, '<em>', '</em>', getTranslation('italic_placeholder'))},
            { title: getTranslation('underline'),       icon:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M0 32A32 32 0 0 1 32 0h64a32 32 0 1 1 0 64v160a96 96 0 0 0 192 0V64a32 32 0 1 1 0-64h64a32 32 0 1 1 0 64v160a160 160 0 1 1-320 0V64A32 32 0 0 1 0 32m0 448a32 32 0 0 1 32-32h320a32 32 0 1 1 0 64H32a32 32 0 0 1-32-32"/></svg>', action: () => insertText(textarea, '<u>', '</u>', getTranslation('underline_placeholder'))},
            { title: getTranslation('strikethrough'),   icon:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M496 224H293.9l-87.2-26.8a43.6 43.6 0 0 1 12.9-85.2h66.7a50 50 0 0 1 44.7 27.6 16 16 0 0 0 21.5 7.1l42.9-21.4a16 16 0 0 0 7.2-21.5l-.6-1A128 128 0 0 0 287.5 32h-68a123.7 123.7 0 0 0-123 135.6c2 21 10.1 39.9 21.8 56.4H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h480a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16m-180.2 96a43 43 0 0 1 20.2 36.4 43.6 43.6 0 0 1-43.6 43.6h-66.7a50 50 0 0 1-44.7-27.6 16 16 0 0 0-21.5-7.1l-42.9 21.4a16 16 0 0 0-7.2 21.5l.6 1A128 128 0 0 0 224.5 480h68a123.7 123.7 0 0 0 123-135.6 114 114 0 0 0-5.3-24.4z"/></svg>', action: () => insertText(textarea, '<s>', '</s>', getTranslation('strikethrough_placeholder'))},
            { type: 'divider' },
            { title: getTranslation('unordered_list'),  icon:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1792 1408"><path fill="currentColor" d="M384 1216q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136m0-512q0 80-56 136t-136 56-136-56T0 704t56-136 136-56 136 56 56 136m1408 416v192q0 13-9.5 22.5t-22.5 9.5H544q-13 0-22.5-9.5T512 1312v-192q0-13 9.5-22.5t22.5-9.5h1216q13 0 22.5 9.5t9.5 22.5M384 192q0 80-56 136t-136 56-136-56T0 192 56 56 192 0t136 56 56 136m1408 416v192q0 13-9.5 22.5T1760 832H544q-13 0-22.5-9.5T512 800V608q0-13 9.5-22.5T544 576h1216q13 0 22.5 9.5t9.5 22.5m0-512v192q0 13-9.5 22.5T1760 320H544q-13 0-22.5-9.5T512 288V96q0-13 9.5-22.5T544 64h1216q13 0 22.5 9.5T1792 96"/></svg>', action: () => { const start = textarea.selectionStart; const end = textarea.selectionEnd; const selection = textarea.value.substring(start, end); const items = selection ? selection.split('\n').map(line => `  <li>${line}</li>`).join('\n') : `  <li>${getTranslation('list_item_placeholder')}</li>`; const listHtml = `<ul>\n${items}\n</ul>`; textarea.setRangeText(listHtml, start, end, 'select'); textarea.focus();}},
            { title: getTranslation('ordered_list'),    icon:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M24 56a24 24 0 0 1 24-24h32a24 24 0 0 1 24 24v120h16a24 24 0 1 1 0 48H40a24 24 0 1 1 0-48h16V80h-8a24 24 0 0 1-24-24m62.7 285.2a15.3 15.3 0 0 0-24 1.2l-11.2 15.5A24 24 0 0 1 12.4 330l11.1-15.6a63.4 63.4 0 1 1 98.1 79.8L86.8 432H120a24 24 0 1 1 0 48H32a24.1 24.1 0 0 1-17.7-40.3l72-78c5.3-5.8 5.4-14.6.3-20.5zM224 64h256a32 32 0 1 1 0 64H224a32 32 0 1 1 0-64m0 160h256a32 32 0 1 1 0 64H224a32 32 0 1 1 0-64m0 160h256a32 32 0 1 1 0 64H224a32 32 0 1 1 0-64"/></svg>', action: () => { const start = textarea.selectionStart; const end = textarea.selectionEnd; const selection = textarea.value.substring(start, end); const items = selection ? selection.split('\n').map(line => `  <li>${line}</li>`).join('\n') : `  <li>${getTranslation('list_item_placeholder')}</li>`; const listHtml = `<ol>\n${items}\n</ol>`; textarea.setRangeText(listHtml, start, end, 'select');textarea.focus();}},
            { title: getTranslation('details'),         label: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M4.25 3A2.25 2.25 0 0 0 2.3 6.37l7.75 13.5a2.25 2.25 0 0 0 3.9 0l7.74-13.5A2.25 2.25 0 0 0 19.74 3z"/></svg>', action: () => insertText(textarea, '<details><summary>' + getTranslation('details_summary_placeholder') + '</summary>' + getTranslation('details_content_placeholder') + '</details>')},
            { title: getTranslation('center'),          label: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill="currentColor" d="M1 1h18v2H1zm0 8h18v2H1zm0 8h18v2H1zM4 5h12v2H4zm0 8h12v2H4z"/></svg>', action: () => insertText(textarea, '<center>', '</center>', getTranslation('center_placeholder')) },
            { type: 'divider' },
            { title: getTranslation('quote'),           icon:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 304 384"><path fill="currentColor" d="m21 299 43-86H0V85h128v128l-43 86zm171 0 43-86h-64V85h128v128l-43 86z"/></svg>', action: () => { const start = textarea.selectionStart; const end = textarea.selectionEnd; const selection = textarea.value.substring(start, end); const content = selection ? selection.replace(/\n/g, '<br>\n  ') : getTranslation('quote'); const quoteHtml = `<blockquote>${content}</blockquote>`; textarea.setRangeText(quoteHtml, start, end, 'select'); textarea.focus(); } },
            { title: getTranslation('inline_code'),     icon:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="m278.9 511.5-61-17.7a12 12 0 0 1-8.2-14.9L346.2 8.7A12 12 0 0 1 361.1.5l61 17.7a12 12 0 0 1 8.2 14.9L293.8 503.3a12 12 0 0 1-14.9 8.2m-114-112.2 43.5-46.4a12 12 0 0 0-.8-17.2L117 256l90.6-79.7a12 12 0 0 0 .8-17.2l-43.5-46.4a12 12 0 0 0-17-.5L3.8 247.2a12 12 0 0 0 0 17.5l144.1 135.1a12 12 0 0 0 17-.5m327.2.6 144.1-135.1a12 12 0 0 0 0-17.5L492.1 112.1a12 12 0 0 0-17 .5L431.6 159a12 12 0 0 0 .8 17.2L523 256l-90.6 79.7a12 12 0 0 0-.8 17.2l43.5 46.4a12 12 0 0 0 17 .6"/></svg>', action: () => insertText(textarea, '<code>', '</code>', getTranslation('inline_code_placeholder')) },
            { title: getTranslation('code_block'),      label: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path fill="currentColor" d="M52 52v152h28a12 12 0 0 1 0 24H40a12 12 0 0 1-12-12V40a12 12 0 0 1 12-12h40a12 12 0 0 1 0 24Zm164-24h-40a12 12 0 0 0 0 24h28v152h-28a12 12 0 0 0 0 24h40a12 12 0 0 0 12-12V40a12 12 0 0 0-12-12"/></svg>', action: () => insertText(textarea, '<pre><code>', '</code></pre>', getTranslation('code_block_placeholder')) },
            { title: getTranslation('horizontal_line'), icon:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill="currentColor" fill-rule="evenodd" d="M1 10a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H2a1 1 0 0 1-1-1" clip-rule="evenodd"/></svg>', action: () => insertText(textarea, '\n<hr>\n') },
            { type: 'divider' },
            { title: getTranslation('link'),            icon:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 12h8M9 8H6a4 4 0 1 0 0 8h3m6-8h3a4 4 0 0 1 0 8h-3"/></svg>', action: () => { const start = textarea.selectionStart; const end = textarea.selectionEnd; const selectedText = textarea.value.substring(start, end); showCustomPrompt({ inputs: [ { id: 'url', label: getTranslation('prompt_insert_url'), placeholder: 'https://', type: 'url', required: true }, { id: 'text', label: getTranslation('prompt_link_text'), placeholder: getTranslation('link_text_placeholder'), value: selectedText, required: false } ], onConfirm: ({ url, text }) => { if (url) { const linkText = text || selectedText || url; const selectionMode = selectedText ? 'end' : 'select'; textarea.setRangeText(`<a href="${url}">${linkText}</a>`, start, end, selectionMode); textarea.focus();}}});}},
            { title: getTranslation('image'),           icon:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42"><path fill="currentColor" d="M.5 7.5v27c0 2.5.5 3 3 3h34c2.5 0 3-.5 3-3v-27c0-2.5-.5-3-3-3h-34c-2.5 0-3 .4-3 3m35.3 23H5.2c3.4-4.9 9.3-13 10.8-13s6.4 6.6 8.7 8.9c0 0 2.9-3.9 4.4-3.9s6.6 8 6.7 8m-9-17a3.7 3.7 0 1 1 7.4 0 3.7 3.7 0 0 1-7.4 0"/></svg>', action: () => showCustomPrompt({ inputs: [ { id: 'src', label: getTranslation('prompt_insert_image_url'), placeholder: 'https://', type: 'url' }, { id: 'title', label: getTranslation('prompt_image_title'), placeholder: getTranslation('image_title_placeholder'), required: false }, { id: 'width', label: getTranslation('prompt_image_width'), placeholder: '500px', type: 'number', required: false }, { id: 'height', label: getTranslation('prompt_image_height'), placeholder: '500px', type: 'number', required: false } ], onConfirm: ({ src, title, width, height }) => { if (src) { const titleAttr = title ? ` title="${title}"` : ''; const widthAttr = width ? ` width="${width}"` : ''; const heightAttr = height ? ` height="${height}"` : ''; insertText(textarea, `<img src="${src}"${titleAttr}${widthAttr}${heightAttr}>`);}}})},
            { title: getTranslation('table'),           icon:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill="currentColor" d="M2 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm0 4h7v4H2zm0 10v-4h7v4zm16 0h-7v-4h7zm0-6h-7V6h7z"/></svg>', action: () => showCustomPrompt({ inputs: [ { id: 'cols', label: getTranslation('prompt_columns'), type: 'number', value: '3' }, { id: 'rows', label: getTranslation('prompt_rows'), type: 'number', value: '2' } ], onConfirm: ({ cols, rows }) => { const numCols = parseInt(cols, 10) || 3; const numRows = parseInt(rows, 10) || 2; let table = '<table>\n  <thead>\n    <tr>\n'; table += '      ' + Array(numCols).fill(`<th>${getTranslation('table_header_placeholder')}</th>`).join('\n      ') + '\n    </tr>\n  </thead>\n  <tbody>\n'; for (let i = 0; i < numRows; i++) { table += '    <tr>\n'; table += '      ' + Array(numCols).fill(`<td>${getTranslation('table_cell_placeholder')}</td>`).join('\n      ') + '\n    </tr>\n'; } table += '  </tbody>\n</table>'; insertText(textarea, `\n${table}\n`);}})},
            { title: getTranslation('video'),           icon:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" d="M0 3.75C0 2.78.78 2 1.75 2h12.5c.97 0 1.75.78 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25Zm1.75-.25a.25.25 0 0 0-.25.25v8.5c0 .14.11.25.25.25h12.5a.25.25 0 0 0 .25-.25v-8.5a.25.25 0 0 0-.25-.25Z"/><path fill="currentColor" d="M6 10.56V5.44a.25.25 0 0 1 .38-.21l4.26 2.56a.25.25 0 0 1 0 .42l-4.26 2.56a.25.25 0 0 1-.38-.21"/></svg>', action: () => showCustomPrompt({ inputs: [ { id: 'type', label: getTranslation('prompt_video_type'), type: 'select', options: [ { value: 'embed', text: getTranslation('video_type_embed') }, { value: 'html5', text: getTranslation('video_type_html5') } ]}, { id: 'url', label: getTranslation('prompt_insert_video_url'), placeholder: 'https://', type: 'url' }, { id: 'poster', label: getTranslation('prompt_video_poster_url'), placeholder: 'https://image.jpg', type: 'url', required: false }, { id: 'width', label: getTranslation('prompt_video_width'), placeholder: '560', type: 'number', required: false }, { id: 'height', label: getTranslation('prompt_video_height'), placeholder: '315', type: 'number', required: false } ], onConfirm: ({ type, url, poster, width, height }) => { if (!url) return; const widthAttr = width ? ` width="${width}"` : ''; const heightAttr = height ? ` height="${height}"` : ''; if (type === 'html5') { const posterAttr = poster ? ` poster="${poster}"` : ''; const videoTag = `\n<video src="${url}"${posterAttr}${widthAttr}${heightAttr} controls></video>\n`; insertText(textarea, videoTag); } else { let src = ''; try { if (url.includes('youtube.com/watch?v=')) { src = `https://www.youtube.com/embed/${new URL(url).searchParams.get('v')}`; } else if (url.includes('youtu.be/')) { src = `https://www.youtube.com/embed/${new URL(url).pathname.substring(1)}`; } else if (url.includes('bilibili.com/video/')) { src = `https://player.bilibili.com/player.html?bvid=${new URL(url).pathname.split('/')[2]}`; } } catch { src = ''; } if (src) { insertText(textarea, `\n<iframe src="${src}"${widthAttr}${heightAttr} allowfullscreen></iframe>\n`); } else { showCustomAlert(getTranslation('alert_invalid_video_url'));}}}})},
            { type: 'divider' },
            { title: getTranslation('subscript'),       label: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M32 64C14.3 64 0 78.3 0 96s14.3 32 32 32h15.3l89.6 128l-89.6 128H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h32c10.4 0 20.2-5.1 26.2-13.6L176 311.8l85.8 122.6c6 8.6 15.8 13.6 26.2 13.6h32c17.7 0 32-14.3 32-32s-14.3-32-32-32h-15.3l-89.6-128l89.6-128H320c17.7 0 32-14.3 32-32s-14.3-32-32-32h-32c-10.4 0-20.2 5.1-26.2 13.6L176 200.2L90.2 77.6C84.2 69.1 74.4 64 64 64H32zm448 256c0-11.1-5.7-21.4-15.2-27.2s-21.2-6.4-31.1-1.4l-32 16c-15.8 7.9-22.2 27.1-14.3 42.9C393 361.5 404.3 368 416 368v80c-17.7 0-32 14.3-32 32s14.3 32 32 32h64c17.7 0 32-14.3 32-32s-14.3-32-32-32V320z"/></svg>', action: () => insertText(textarea, '<sub>', '</sub>', getTranslation('subscript_placeholder'))},
            { title: getTranslation('superscript'),     label: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M480 32c0-11.1-5.7-21.4-15.2-27.2s-21.2-6.4-31.1-1.4l-32 16c-15.8 7.9-22.2 27.1-14.3 42.9C393 73.5 404.3 80 416 80v80c-17.7 0-32 14.3-32 32s14.3 32 32 32h64c17.7 0 32-14.3 32-32s-14.3-32-32-32V32zM32 64C14.3 64 0 78.3 0 96s14.3 32 32 32h15.3l89.6 128l-89.6 128H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h32c10.4 0 20.2-5.1 26.2-13.6L176 311.8l85.8 122.6c6 8.6 15.8 13.6 26.2 13.6h32c17.7 0 32-14.3 32-32s-14.3-32-32-32h-15.3l-89.6-128l89.6-128H320c17.7 0 32-14.3 32-32s-14.3-32-32-32h-32c-10.4 0-20.2 5.1-26.2 13.6L176 200.2L90.2 77.6C84.2 69.1 74.4 64 64 64H32z"/></svg>', action: () => insertText(textarea, '<sup>', '</sup>', getTranslation('superscript_placeholder'))},
            { title: getTranslation('highlight'),       label: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" d="M3 1a1 1 0 0 0-1 1v2.5A1.5 1.5 0 0 0 3.5 6h-.05.1-.05 9-.05.1-.05A1.5 1.5 0 0 0 14 4.5V2a1 1 0 0 0-1-1zm0 6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2zm2 7.5V10h6v.74a1.5 1.5 0 0 1-.69 1.26l-4.54 2.92A.5.5 0 0 1 5 14.5"/></svg>', action: () => insertText(textarea, '<mark>', '</mark>', getTranslation('highlight_placeholder'))},
            { title: getTranslation('keyboard'),        label: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M3 4h10a1.5 1.5 0 0 1 1.5 1.5v5A1.5 1.5 0 0 1 13 12H3a1.5 1.5 0 0 1-1.5-1.5v-5A1.5 1.5 0 0 1 3 4M0 5.5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3zm6.25 3.25a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5zM4.5 6.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0m2 1a1 1 0 1 0 0-2a1 1 0 0 0 0 2m4-1a1 1 0 1 1-2 0a1 1 0 0 1 2 0m2 1a1 1 0 1 0 0-2a1 1 0 0 0 0 2m-8 2a1 1 0 1 1-2 0a1 1 0 0 1 2 0m8 1a1 1 0 1 0 0-2a1 1 0 0 0 0 2" clip-rule="evenodd"/></svg>', action: () => insertText(textarea, '<kbd>', '</kbd>', getTranslation('keyboard_placeholder'))},
            { title: getTranslation('abbreviation'),    label: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512"><path fill="currentColor" d="M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72s72-32.235 72-72S135.764 0 96 0z"/></svg>', action: () => { const start = textarea.selectionStart; const end = textarea.selectionEnd; const selectedText = textarea.value.substring(start, end); showCustomPrompt({ inputs: [ { id: 'title', label: getTranslation('prompt_abbreviation_meaning'), required: true }, { id: 'text', label: getTranslation('prompt_abbreviation_text'), placeholder: getTranslation('abbreviation_placeholder'), value: selectedText, required: true } ], onConfirm: ({ title, text }) => { if (title && text) { const selectionMode = selectedText ? 'end' : 'select'; textarea.setRangeText(`<abbr title="${title}">${text}</abbr>`, start, end, selectionMode); textarea.focus();}}});}},
            {
                title: getTranslation('translate'),
                label: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill="currentColor" d="m7.4 9 2.3 2.2-.9 2L6 10.4l-3.3 3.3-1.4-1.4L4.6 9l-.9-.9A6 6 0 0 1 2.4 6h2.2l.5.7.9.9.9-.9C7.5 6.1 8 4.8 8 4H0V2h5V0h2v2h5v2h-2c0 1.4-.7 3.2-1.7 4.1zm3.9 8L10 20H8l5-12h2l5 12h-2l-1.2-3zm.8-2h3.8L14 10.4z"/></svg>',
                action: async () => {
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const textToTranslate = (start !== end) ? textarea.value.substring(start, end) : textarea.value;
                    if (!textToTranslate.trim()) {
                        showCustomAlert(getTranslation('alert_text_empty'));
                        return;
                    }
                    const lastEngine = await GM_getValue('TOOLBAR_LAST_ENGINE', 'GOOGLE');
                    const lastModel  = await GM_getValue('GOOGLE_AI_LAST_MODEL', 'gemini-3-flash-preview');
                    const lastLang   = await GM_getValue('GOOGLE_AI_LAST_LANG', 'English');
                    const savedKey   = await GM_getValue('GOOGLE_AI_KEY', '');
                    showCustomPrompt({
                        inputs: [
                            {
                                id: 'lang',
                                label: getTranslation('trans_target_lang') || 'Idioma',
                                type: 'select',
                                value: lastLang,
                                options: getSortedLanguages()
                            },
                            {
                                id: 'engine',
                                label: getTranslation('lbl_mode') || 'Motor',
                                type: 'select',
                                value: lastEngine,
                                options: [
                                    { value: 'GOOGLE', text: getTranslation('trans_mode_google') },
                                    { value: 'GEMINI', text: getTranslation('trans_mode_gemini') }
                                ],
                                onChange: (val, inputsMap) => {
                                    const modelLabel = inputsMap.get('model').label;
                                    if (val === 'GEMINI') {
                                        modelLabel.style.display = 'block';
                                    } else {
                                        modelLabel.style.display = 'none';
                                    }
                                }
                            },
                            {
                                id: 'model',
                                label: getTranslation('prompt_ai_model'),
                                type: 'select',
                                value: lastModel,
                                options: getGeminiModels()
                            }
                        ],
                        onConfirm: async ({ lang, engine, model }) => {
                            await GM_setValue('TOOLBAR_LAST_ENGINE', engine);
                            await GM_setValue('GOOGLE_AI_LAST_LANG', lang);
                            await GM_setValue('GOOGLE_AI_LAST_MODEL', model);
                            const originalCursor = document.body.style.cursor;
                            document.body.style.cursor = 'wait';
                            textarea.disabled = true;
                            try {
                                let result = "";
                                if (engine === 'GOOGLE') {
                                    result = await translateWithGoogle(textToTranslate, lang);
                                } else {
                                    if (!savedKey) throw getTranslation('trans_err_gemini_key');
                                    const isHTML = /<[a-z][\s\S]*>/i.test(textToTranslate);
                                    result = await translateWithGemini(textToTranslate, lang, model, savedKey, isHTML);
                                }
                                if (start !== end) textarea.setRangeText(result, start, end, 'select');
                                else textarea.value = result;
                                textarea.dispatchEvent(new Event('input', { bubbles: true }));

                            } catch (error) {
                                showCustomAlert(getTranslation('alert_translation_error') + "\n" + error);
                            } finally {
                                document.body.style.cursor = originalCursor;
                                textarea.disabled = false;
                                textarea.focus();
                            }
                        }
                    });
                }
            },
            { type: 'divider' },
            { type: 'color-picker' }
        ];
        for (const tool of tools) {
            if (tool.type === 'divider') {
                const div = document.createElement('div');
                div.className = 'txt-editor-toolbar-divider';
                toolbar.appendChild(div);
            } else if (tool.type === 'select') {
                const container = document.createElement('span');
                container.className = 'txt-editor-toolbar-button';
                container.dataset.tooltip = tool.title;
                container.style.position = 'relative';
                container.style.display = 'flex';
                container.style.alignItems = 'center';
                container.style.justifyContent = 'center';
                container.innerHTML = '<svg viewBox="0 0 16 16"><path d="M3.75 2a.75.75 0 0 1 .75.75V7h7V2.75a.75.75 0 0 1 1.5 0v10.5a.75.75 0 0 1-1.5 0V8.5h-7v4.75a.75.75 0 0 1-1.5 0V2.75A.75.75 0 0 1 3.75 2Z"></path></svg>';
                const select = document.createElement('select');
                select.className = 'txt-editor-toolbar-select';
                select.style.cssText = ` -webkit-appearance: none; appearance: none; background: transparent; border: none; color: transparent; position: absolute; top: 0; left: 0; width: 100%; height: 100%; cursor: pointer; `;
                const placeholderOpt = document.createElement('option');
                placeholderOpt.value = '';
                placeholderOpt.textContent = '';
                placeholderOpt.disabled = true;
                placeholderOpt.selected = true;
                placeholderOpt.style.display = 'none';
                select.appendChild(placeholderOpt);
                Object.keys(tool.options).forEach(key => {
                    const opt = document.createElement('option');
                    opt.value = tool.options[key];
                    opt.textContent = key;
                    select.appendChild(opt);
                });
                select.addEventListener('change', () => {
                    if (select.value) tool.action(select.value);
                    select.selectedIndex = 0;
                });
                container.appendChild(select);
                toolbar.appendChild(container);
                } else if (tool.type === 'color-picker') {
                const colorContainer = document.createElement('div');
                colorContainer.className = 'txt-color-picker-container';
                const input = document.createElement('input');
                input.type = 'color';
                input.className = 'txt-color-picker-input';
                const lastColor = await GM_getValue(LAST_COLOR_KEY, '#58a6ff');
                input.value = lastColor;
                input.addEventListener('input', async (e) => {
                    await GM_setValue(LAST_COLOR_KEY, e.target.value);
                });
                const colorBtn = createToolbarButton({
                    title: getTranslation('text_color'),
                    label: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><rect width="36" height="36" x="6" y="6" rx="3"/><path stroke-linecap="round" d="M16 19v-3h16v3M22 34h4m-2-16v16"/></g></svg>',
                    action: () => insertText(textarea, `<span style="color: ${input.value};">`, '</span>', getTranslation('colored_text_placeholder'))
                });
                const bgBtn = createToolbarButton({
                    title: getTranslation('background_color'),
                    label: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><mask id="a"><g fill="none" stroke-linejoin="round" stroke-width="4"><rect width="36" height="36" x="6" y="6" fill="#fff" stroke="#fff" rx="3"/><path stroke="#000" stroke-linecap="round" d="M16 19v-3h16v3M22 34h4m-2-16v16"/></g></mask><path fill="currentColor" d="M0 0h48v48H0z" mask="url(#a)"/></svg>',
                    action: async () => {
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const selectedText = textarea.value.substring(start, end);
                        const lastTag = await GM_getValue(LAST_TAG_TYPE_KEY, 'span');
                        showCustomPrompt({
                            inputs: [
                                { id: 'text',  label: getTranslation('prompt_border_text'),     type: 'text',   value: selectedText || getTranslation('colored_background_placeholder') },
                                { id: 'color', label: getTranslation('background_color'),       type: 'text',   value: input.value },
                                { id: 'tag',   label: getTranslation('prompt_border_tag_type'), type: 'select', value: lastTag, options: [ { value: 'span', text: '<span>' }, { value: 'div', text: '<div>' } ] }
                            ],
                            onConfirm: async ({ text, color, tag }) => {
                                await GM_setValue(LAST_TAG_TYPE_KEY, tag);
                                let newElement;
                                if (tag === 'div') {
                                    newElement = `\n<div style="background-color: ${color};">\n   ${text}\n</div>\n`;
                                } else {
                                    newElement = `<span style="background-color: ${color};">${text}</span>`;
                                }
                                textarea.setRangeText(newElement, start, end, selectedText ? 'end' : 'select');
                                textarea.focus();
                            }
                        });
                    }
                });
                const hrStyleBtn = createToolbarButton({
                    title: getTranslation('horizontal_line_style'),
                    label: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill="currentColor" d="M2 4.75A.75.75 0 0 1 2.75 4h2.5a.75.75 0 0 1 0 1.5h-2.5A.75.75 0 0 1 2 4.75m6 0A.75.75 0 0 1 8.75 4h2.5a.75.75 0 0 1 0 1.5h-2.5A.75.75 0 0 1 8 4.75m6 0a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75m-12 5A.75.75 0 0 1 2.75 9h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 9.75M3.25 14a1.25 1.25 0 1 0 0 2.5h13.5a1.25 1.25 0 1 0 0-2.5z"/></svg>',
                    action: () => {
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const selectedText = textarea.value.substring(start, end).trim();
                        let currentSize = '1';
                        let currentColor = input.value;
                        const hrRegex = /<hr\s+style="border:\s*(\d+)px\s+solid\s+([^;"]+)/i;
                        const match = selectedText.match(hrRegex);
                        if (match && selectedText.startsWith('<hr')) {
                            currentSize = match[1];
                            currentColor = match[2];
                        }
                        showCustomPrompt({
                            inputs: [
                                { id: 'size',  label: getTranslation('prompt_hr_size'),     type: 'number', value: currentSize  },
                                { id: 'color', label: getTranslation('prompt_hr_color'),    type: 'text',   value: currentColor }
                            ],
                            onConfirm: ({ size, color }) => {
                                const newHr = `<hr style="border: ${size}px solid ${color};">`;
                                textarea.setRangeText(newHr, start, end, 'select');
                                textarea.focus();
                            }
                        });
                    }
                });
                const borderStyleBtn = createToolbarButton({
                    title: getTranslation('border_style'),
                    label: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M3 21V3h18v18zM5 5v14h14V5z"/></svg>',
                    action: async () => {
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const selectedText = textarea.value.substring(start, end);
                        const lastTag = await GM_getValue(LAST_TAG_TYPE_KEY, 'span');
                        showCustomPrompt({
                            inputs: [
                                { id: 'text',  label: getTranslation('prompt_border_text'),     type: 'text',   value: selectedText || getTranslation('txt') },
                                { id: 'size',  label: getTranslation('prompt_border_size'),     type: 'number', value: '1' },
                                { id: 'color', label: getTranslation('prompt_border_color'),    type: 'text',   value: input.value },
                                { id: 'tag',   label: getTranslation('prompt_border_tag_type'), type: 'select', value: lastTag, options: [ { value: 'span', text: '<span>' }, { value: 'div', text: '<div>' } ] }
                            ],
                            onConfirm: async ({ text, size, color, tag }) => {
                                await GM_setValue(LAST_TAG_TYPE_KEY, tag);
                                let newElement;
                                if (tag === 'div') {
                                    newElement = `\n<div style="border: ${size}px solid ${color};">\n   ${text}\n</div>`;
                                } else {
                                    newElement = `<span style="border: ${size}px solid ${color};">${text}</span>`;
                                }
                                textarea.setRangeText(newElement, start, end, selectedText ? 'end' : 'select');
                                textarea.focus();
                            }
                        });
                    }
                });
                colorContainer.append(input, colorBtn, bgBtn, hrStyleBtn, borderStyleBtn);
                toolbar.appendChild(colorContainer);
            } else {toolbar.appendChild(createToolbarButton(tool));}
        }
        const infoButton = createToolbarButton({
            title: getTranslation('info_tooltip'),
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V7h2v2z"/></svg>',
            action: showInfoModal
        });
        infoButton.style.marginLeft = 'auto';
        toolbar.appendChild(infoButton);
        textarea.parentNode.insertBefore(container, textarea);
        container.append(toolbar, textarea);
    }

    // --- INICIALIZAÇÃO DO EDITOR ---
    function applyToAllTextareas() {
        const textareas = document.querySelectorAll('textarea:not(#script_version_code):not([data-editor-applied])');
        textareas.forEach(createTextStyleEditor);
    }

    // --- HABILITAR EDITOR DE CÓDIGO FONTE ---
    function enableSourceEditorCheckbox() {
        const enableCheckbox = () => {
            const checkbox = document.getElementById('enable-source-editor-code');
            if (checkbox && !checkbox.checked) {
                checkbox.checked = true;
                const event = new Event('change', {
                    bubbles: true
                });
                checkbox.dispatchEvent(event);
            }
        };
        enableCheckbox();
        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const checkbox = document.getElementById('enable-source-editor-code');
                    if (checkbox) {
                        enableCheckbox();
                        observer.disconnect();
                        break;
                    }
                }
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // --- DETECTAR PÁGINAS QUE USAM EDITOR ---
    function isHTMLPage() {
        const path = window.location.pathname;
        const markdownSegments = [ '/new', '/edit', '/feedback', '/discussions', '/conversations' ];
        if (path.includes('/sets/')) {
            return false;
        }
        return markdownSegments.some(segment => path.includes(segment));
    }
    // #endregion

    // ================
    // #region DOWNLOAD
    // ================

    // --- DETECTAR PÁGINA DE SCRIPT ---
    function isCodePage() {
        return /^\/([a-z]{2}(-[A-Z]{2})?\/)?scripts\/\d+-.+\/code/.test(window.location.pathname);
    }

    // --- NORMALIZAR CAMINHO DO SCRIPT ---
    function initializeDownloadButton() {
        const waitFor = (sel) =>
        new Promise((resolve) => {
            const el = document.querySelector(sel);
            if (el) return resolve(el);
            const obs = new MutationObserver(() => {
                const el = document.querySelector(sel);
                if (el) {
                    obs.disconnect();
                    resolve(el);
                }
            });
            obs.observe(document, { childList: true, subtree: true });
        });
        waitFor('label[for="wrap-lines"]').then((label) => {
            const wrapLinesCheckbox = document.getElementById('wrap-lines');
            if (wrapLinesCheckbox) {
                wrapLinesCheckbox.checked = false;
            }
            const toolbar = label.parentElement;
            const btn = document.createElement('button');
            btn.className = 'btn';
            btn.textContent = getTranslation('download');
            btn.style.marginLeft = '12px';
            btn.style.backgroundColor = '#005200';
            btn.style.color = 'white';
            btn.style.border = 'none';
            btn.style.padding = '6px 16px';
            btn.style.borderRadius = '4px';
            btn.style.cursor = 'pointer';
            btn.addEventListener('mouseenter', () => btn.style.backgroundColor = '#1e971e');
            btn.addEventListener('mouseleave', () => btn.style.backgroundColor = '#005200');
            btn.addEventListener('click', () => {
                const normalizedPath = normalizeScriptPath(window.location.pathname);
                const scriptId = extractScriptIdFromNormalizedPath(normalizedPath);

                if (!scriptId) {
                    alert(getTranslation('scriptIdNotFound'));
                    return;
                }
                const scriptUrl = `https://update.greasyfork.org/scripts/${scriptId}.js`;
                btn.disabled = true;
                btn.textContent = getTranslation('downloading');
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: scriptUrl,
                    onload: function (res) {
                        const code = res.responseText;
                        if (!code) {
                            alert(getTranslation('notFound'));
                            return;
                        }
                        const nameMatch = code.match(/\/\/\s*@name\s+(.+)/i);
                        const fileName = nameMatch ? `${nameMatch[1].trim()}.user.js` : 'script.user.js';
                        const blob = new Blob([code], { type: 'application/javascript;charset=utf-8' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = fileName;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    },
                    onerror: function (res) {
                        alert(getTranslation('downloadError'));
                    },
                    ontimeout: function () {
                        alert(getTranslation('downloadTimeout'));
                    },
                    onloadend: function () {
                        btn.disabled = false;
                        btn.textContent = getTranslation('download');
                    }
                });
            });
            toolbar.appendChild(btn);
            const spacer = document.createElement('div');
            spacer.style.height = '12px';
            toolbar.appendChild(spacer);
        });
    }
    // #endregion

    // ================
    // #region INICIALIZAR
    // ================

    // --- INICIAR SCRIPT ---
    async function start() {
        iconCache = await GM_getValue(CACHE_KEY, {});
        await determineLanguage();
        languageModal = createLanguageModal();
        document.body.appendChild(languageModal);
        registerLanguageMenu();
        registerForceUpdateMenu();
        GM_registerMenuCommand(`${getTranslation('settings')}`, openTranslationSettings);
        setupThemeChangeListener();
        if (isHTMLPage()) {
            applyToAllTextareas();
            enableSourceEditorCheckbox();
        }
        if (isCodePage()){
            initializeDownloadButton();
        }
        processIconElements();
        highlightScriptDescription();
        if (isScriptPage()) {
            addAdditionalInfoSeparator();
        }
        makeDiscussionClickable();
        applySyntaxHighlighting();
        runTranslations();
        const observer = new MutationObserver(() => {
            processIconElements();
            highlightScriptDescription();
            if (isScriptPage()) {
                addAdditionalInfoSeparator();
            }
            if (isHTMLPage()) {
                applyToAllTextareas();
            }
            makeDiscussionClickable();
            applySyntaxHighlighting();
            runTranslations();
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    start();
    // #endregion
})();