// ==UserScript==
// @name                My Prompt
// @name:pt-BR          Meu Prompt
// @name:zh-CN          我的提示词
// @name:zh-TW          我的提示詞
// @name:fr-CA          Mon Prompt
// @name:ckb            پڕۆمپتەکەم
// @name:ar             مُوجِّهي
// @name:be             Мой запыт
// @name:bg             Моята подкана
// @name:cs             Můj pokyn
// @name:da             Min prompt
// @name:de             Mein Prompt
// @name:el             Η προτροπή μου
// @name:en             My Prompt
// @name:eo             Mia instigo
// @name:es             Mi Prompt
// @name:fi             Kehotteeni
// @name:fr             Mon Prompt
// @name:he             ההנחיה שלי
// @name:hr             Moja uputa
// @name:hu             Promptom
// @name:id             Prompt Saya
// @name:it             Il mio Prompt
// @name:ja             マイプロンプト
// @name:ka             ჩემი პრომპტი
// @name:ko             나의 프롬프트
// @name:mr             माझी सूचना
// @name:nb             Min prompt
// @name:nl             Mijn Prompt
// @name:pl             Mój Prompt
// @name:ro             Prompt-ul meu
// @name:ru             Мой Промпт
// @name:sk             Môj pokyn
// @name:sr             Мој упит
// @name:sv             Min prompt
// @name:th             พรอมต์ของฉัน
// @name:tr             İstemim
// @name:uk             Мій запит
// @name:ug             مېنىڭ پرومپتۇم
// @name:vi             Lời nhắc của tôi
// @namespace           https://github.com/0H4S
// @version             3.4
// @description         Save and use your personalized prompts in your own library. Use Dynamic Prompt mode to insert interactive information and adapt commands as needed. Attach and reuse files anytime without reselections. Compatible with: ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, and Google AI Mode.
// @description:pt-BR   Salve e use seus prompts personalizados na sua própria biblioteca de prompts. Use o modo Prompt Dinâmico para inserir informações interativas e adaptar comandos conforme sua necessidade. Anexe e use arquivos sempre que quiser, sem precisar selecionar tudo de novo. Compatível com: ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM e Google Modo IA.
// @description:zh-CN   保存并在您自己的库中使用自定义提示词。使用动态提示词模式插入交互信息并根据需要调整指令。随时附加和使用文件，无需重新选择。兼容：ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, 腾讯元宝, ChatGLM, Google AI Mode。
// @description:zh-TW   儲存並在您自己的資料庫中使用自訂提示詞。使用動態提示詞模式插入互動資訊並根據需要調整指令。隨時附加和使用檔案，無需重新選取。相容於：ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, 騰訊元寶, ChatGLM, Google AI Mode。
// @description:fr-CA   Sauvegardez et utilisez vos prompts personnalisés dans votre bibliothèque. Utilisez le mode Prompt Dynamique pour insérer des informations interactives et adapter les commandes. Joignez et réutilisez des fichiers à tout moment sans resélection. Compatible avec : ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, Google AI Mode.
// @description:ckb     پرۆمپتە تایبەتەکانت لە کتێبخانەی خۆتدا پاشەکەوت بکە و بەکاریان بهێنە. دۆخی پرۆمپتی داینامیکی بەکاربهێنە بۆ تێکردنی زانیاری کارلێککارانە و گونجاندنی فەرمانەکان بەپێی پێویست. فایلەکان لە هەر کاتێکدا لکێنە و بەکاریان بهێنەوە بەبێ هەڵبژاردنەوە. گونجاوە لەگەڵ: ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, Google AI Mode.
// @description:ar      احفظ واستخدم مطالباتك المخصصة في مكتبتك الخاصة. استخدم وضع المطالبة الديناميكية (Dynamic Prompt) لإدراج معلومات تفاعلية وتكييف الأوامر حسب الحاجة. أرفق الملفات واستخدمها في أي وقت دون الحاجة إلى إعادة التحديد. متوافق مع: ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, Google AI Mode.
// @description:be      Захоўвайце і выкарыстоўвайце свае персаналізаваныя падказкі ў уласнай бібліятэцы. Выкарыстоўвайце рэжым Dynamic Prompt для ўстаўкі інтэрактыўнай інфармацыі і адаптацыі каманд па меры неабходнасці. Далучайце і выкарыстоўвайце файлы ў любы час без паўторнага выбару. Сумяшчальна з: ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, Google AI Mode.
// @description:bg      Запазете и използвайте вашите персонализирани подкани (prompts) в собствената си библиотека. Използвайте режима Dynamic Prompt за вмъкване на интерактивна информация и адаптиране на командите. Прикачвайте и използвайте файлове по всяко време без повторен избор. Съвместим с: ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, Google AI Mode.
// @description:cs      Ukládejte a používejte své přizpůsobené prompty ve vlastní knihovně. Použijte režim Dynamic Prompt pro vkládání interaktivních informací a přizpůsobení příkazů podle potřeby. Připojujte a používejte soubory kdykoli bez nutnosti nového výběru. Kompatibilní s: ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, Google AI Mode.
// @description:da      Gem og brug dine personlige prompts i dit eget bibliotek. Brug Dynamic Prompt-tilstand til at indsætte interaktiv information og tilpasse kommandoer efter behov. Vedhæft og brug filer når som helst uden at skulle vælge dem igen. Kompatibel med: ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, Google AI Mode.
// @description:de      Speichern und verwenden Sie Ihre personalisierten Prompts in Ihrer eigenen Bibliothek. Nutzen Sie den Dynamic Prompt-Modus, um interaktive Informationen einzufügen und Befehle anzupassen. Hängen Sie Dateien jederzeit an und verwenden Sie sie wieder, ohne sie erneut auswählen zu müssen. Kompatibel mit: ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, Google AI Mode.
// @description:el      Αποθηκεύστε και χρησιμοποιήστε τις εξατομικευμένες προτροπές σας στη δική σας βιβλιοθήκη. Χρησιμοποιήστε τη λειτουργία Dynamic Prompt για να εισάγετε διαδραστικές πληροφορίες και να προσαρμόσετε τις εντολές ανάλογα με τις ανάγκες σας. Επισυνάψτε και χρησιμοποιήστε αρχεία ανά πάσα στιγμή χωρίς εκ νέου επιλογή. Συμβατό με: ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, Google AI
// @description:en      Save and use your personalized prompts in your own library. Use Dynamic Prompt mode to insert interactive information and adapt commands as needed. Attach and reuse files anytime without reselections. Compatible with: ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, and Google AI Mode.
// @description:eo      Konservu kaj uzu viajn personigitajn invitojn en via propra biblioteko. Uzu la reĝimon Dinamika Invito por enmeti interagajn informojn kaj adapti ordonojn laŭbezone. Aldonu kaj uzu dosierojn iam ajn sen reelekto. Kongrua kun: ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, Google AI Mode.
// @description:es      Guarde y utilice sus prompts personalizados en su propia biblioteca. Use el modo Prompt Dinámico para insertar información interactiva y adaptar comandos según sus necesidades. Adjunte y reutilice archivos en cualquier momento sin tener que volver a seleccionarlos. Compatible con: ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, Google AI Mode.
// @description:fi      Tallenna ja käytä mukautettuja kehotteita omassa kirjastossasi. Käytä Dynamic Prompt -tilaa interaktiivisten tietojen lisäämiseen ja komentojen mukauttamiseen tarpeen mukaan. Liitä ja käytä tiedostoja milloin tahansa ilman uudelleenvalintaa. Yhteensopiva seuraavien kanssa: ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, Google AI Mode.
// @description:fr      Sauvegardez et utilisez vos prompts personnalisés dans votre bibliothèque. Utilisez le mode Prompt Dynamique pour insérer des informations interactives et adapter les commandes. Joignez et réutilisez des fichiers à tout moment sans resélection. Compatible avec : ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, Google AI Mode.
// @description:he      שמור והשתמש בפוסטים המותאמים אישית שלך בספרייה משלך. השתמש במצב Dynamic Prompt כדי להוסיף מידע אינטראקטיבי ולהתאים פקודות לפי הצורך. צרף והשתמש בקבצים בכל עת ללא צורך בבחירה מחדש. תואם ל: ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, Google AI Mode.
// @description:hr      Spremite i koristite svoje personalizirane upite u vlastitoj knjižnici. Koristite način Dynamic Prompt za umetanje interaktivnih informacija i prilagodbu naredbi prema potrebi. Priložite i koristite datoteke u bilo kojem trenutku bez ponovnog odabira. Kompatibilno s: ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, Google AI Mode.
// @description:hu      Mentse el és használja személyre szabott promptjait a saját könyvtárában. Használja a Dynamic Prompt módot interaktív információk beillesztéséhez és a parancsok szükség szerinti módosításához. Csatoljon és használjon fájlokat bármikor újra kiválasztás nélkül. Kompatibilis: ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, Google AI Mode.
// @description:id      Simpan dan gunakan prompt pribadi Anda di perpustakaan Anda sendiri. Gunakan mode Dynamic Prompt untuk menyisipkan informasi interaktif dan menyesuaikan perintah sesuai kebutuhan. Lampirkan dan gunakan file kapan saja tanpa perlu memilih ulang. Kompatibel dengan: ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, Google AI Mode.
// @description:it      Salva e usa i tuoi prompt personalizzati nella tua libreria. Usa la modalità Dynamic Prompt per inserire informazioni interattive e adattare i comandi secondo necessità. Allega e usa file in qualsiasi momento senza doverli selezionare di nuovo. Compatibile con: ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, Google AI Mode.
// @description:ja      独自のライブラリでパーソナライズされたプロンプトを保存して使用します。Dynamic Promptモードを使用して、対話型の情報を挿入し、必要に応じてコマンドを適応させます。再選択することなく、いつでもファイルを添付して使用できます。対応プラットフォーム：ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, Google AI Mode.
// @description:ka      შეინახეთ და გამოიყენეთ თქვენი პერსონალიზებული მოთხოვნები თქვენს ბიბლიოთეკაში. გამოიყენეთ Dynamic Prompt რეჟიმი ინტერაქტიული ინფორმაციის ჩასასმელად და ბრძანებების ადაპტირებისთვის. მიამაგრეთ და გამოიყენეთ ფაილები ნებისმიერ დროს ხელახალი არჩევის გარეშე. თავსებადია: ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, Google AI Mode.
// @description:ko      사용자 지정 프롬프트를 자신의 라이브러리에 저장하고 사용하세요. Dynamic Prompt 모드를 사용하여 대화형 정보를 삽입하고 필요에 따라 명령을 조정할 수 있습니다. 다시 선택할 필요 없이 언제든지 파일을 첨부하고 사용할 수 있습니다. 호환 대상: ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, Google AI Mode.
// @description:mr      आपल्या स्वतःच्या लायब्ररीमध्ये आपले वैयक्तिक प्रॉम्प्ट जतन करा आणि वापरा. परस्परसंवादी माहिती समाविष्ट करण्यासाठी आणि आवश्यकतेनुसार आदेश जुळवून घेण्यासाठी डायनॅमिक प्रॉम्प्ट मोड वापरा. पुन्हा निवड न करता कधीही फायली जोडा आणि वापरा. यासह सुसंगत: ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, Google AI Mode.
// @description:nb      Lagre og bruk dine personlige ledetekster i ditt eget bibliotek. Bruk Dynamic Prompt-modus for å sette inn interaktiv informasjon og tilpasse kommandoer etter behov. Legg ved og bruk filer når som helst uten å måtte velge dem på nytt. Kompatibel med: ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, Google AI Mode.
// @description:nl      Bewaar en gebruik uw gepersonaliseerde prompts in uw eigen bibliotheek. Gebruik de Dynamic Prompt-modus om interactieve informatie in te voegen en opdrachten aan te passen. Voeg bestanden toe en gebruik ze op elk moment zonder opnieuw te selecteren. Compatibel met: ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, Google AI Mode.
// @description:pl      Zapisuj i używaj spersonalizowanych promptów w własnej bibliotece. Używaj trybu Dynamic Prompt do wstawiania interaktywnych informacji i dostosowywania poleceń. Dołączaj i używaj plików w dowolnym momencie bez ponownego wyboru. Kompatybilne z: ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, Google AI Mode.
// @description:ro      Salvați și utilizați prompturile personalizate în propria bibliotecă. Utilizați modul Dynamic Prompt pentru a insera informații interactive și a adapta comenzile după cum este necesar. Atașați și utilizați fișiere oricând, fără a le selecta din nou. Compatibil cu: ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, Google AI Mode.
// @description:ru      Сохраняйте и используйте свои персонализированные промпты в собственной библиотеке. Используйте режим Dynamic Prompt для вставки интерактивной информации и адаптации команд. Прикрепляйте и используйте файлы в любое время без повторного выбора. Совместимо с: ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, Google AI Mode.
// @description:sk      Uložte a používajte svoje prispôsobené prompty vo vlastnej knižnici. Použite režim Dynamic Prompt na vkladanie interaktívnych informácií a prispôsobenie príkazov podľa potreby. Pripájajte a používajte súbory kedykoľvek bez potreby nového výberu. Kompatibilné s: ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, Google AI Mode.
// @description:sr      Сачувајте и користите своје прилагођене промпте у сопственој библиотеци. Користите режим Dynamic Prompt за уметање интерактивних информација и прилагођавање команди по потреби. Приложите и користите датотеке у било ком тренутку без поновног избора. Компатибилно са: ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, Google AI Mode.
// @description:sv      Spara och använd dina personliga prompts i ditt eget bibliotek. Använd Dynamic Prompt-läget för att infoga interaktiv information och anpassa kommandon efter behov. Bifoga och använd filer när som helst utan att behöva välja dem igen. Kompatibel med: ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, Google AI Mode.
// @description:th      บันทึกและใช้พรอมต์ส่วนตัวของคุณในไลบรารีของคุณเอง ใช้โหมด Dynamic Prompt เพื่อแทรกข้อมูลเชิงโต้ตอบและปรับเปลี่ยนคำสั่งตามต้องการ แนบและใช้ไฟล์ได้ตลอดเวลาโดยไม่ต้องเลือกใหม่ รองรับ: ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, Google AI Mode
// @description:tr      Özelleştirilmiş istemlerinizi (prompts) kendi kütüphanenizde kaydedin ve kullanın. Etkileşimli bilgiler eklemek ve komutları ihtiyaca göre uyarlamak için Dinamik İstem modunu kullanın. Dosyaları yeniden seçmeye gerek kalmadan istediğiniz zaman ekleyin ve kullanın. Şunlarla uyumludur: ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, Google AI Mode.
// @description:uk      Зберігайте та використовуйте свої персоналізовані промпти у власній бібліотеці. Використовуйте режим Dynamic Prompt для вставки інтерактивної інформації та адаптації команд за потребою. Долучайте та використовуйте файли в будь-який час без повторного вибору. Сумісно з: ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, Google AI Mode.
// @description:ug      خاسلاشتۇرۇلغان ئەسكەرتىمىلىرىڭىزنى ئۆزىڭىزنىڭ ئامبىرىدا ساقلاڭ ۋە ئىشلىتىڭ. Dynamic Prompt ھالىتى ئارقىلىق ئۆز-ئارا تەسىر كۆرسىتىدىغان ئۇچۇرلارنى قىستۇرۇڭ ۋە بۇيرۇقلارنى ئېھتىياجغا ئاساسەن تەڭشەڭ. ھۆججەتلەرنى قايتا تاللىماي ھەر ۋاقىت قوشۇڭ ۋە ئىشلىتىڭ. ماسلىشىشچانلىقى: ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, Google AI Mode.
// @description:vi      Lưu và sử dụng các prompt tùy chỉnh trong thư viện của riêng bạn. Sử dụng chế độ Dynamic Prompt để chèn thông tin tương tác và điều chỉnh lệnh theo nhu cầu. Đính kèm và sử dụng tệp bất cứ lúc nào mà không cần chọn lại. Tương thích với: ChatGPT, Gemini, DeepSeek, Google AI Studio, NotebookLM, Doubao, Claude, Kimi, Qwen, Grok, Mistral, LMArena, LongCat, Z.AI, Perplexity, Poe, Tencent Yuanbao, ChatGLM, Google AI Mode.
// @author              OHAS
// @homepage            https://github.com/0H4S
// @icon                https://cdn-icons-png.flaticon.com/512/4997/4997543.png
// @license             CC-BY-NC-ND-4.0
// @copyright           2025 OHAS. All Rights Reserved.
// @match               *://www.google.com/search?*udm=50*
// @match               *://notebooklm.google.com/*
// @match               *://aistudio.google.com/*
// @match               *://yuanbao.tencent.com/*
// @match               *://gemini.google.com/*
// @match               *://chat.deepseek.com/*
// @match               *://www.perplexity.ai/*
// @match               *://chat.mistral.ai/*
// @match               *://www.doubao.com/*
// @match               *://www.kimi.com/*
// @match               *://chat.qwen.ai/*
// @match               *://longcat.chat/*
// @match               *://chatgpt.com/*
// @match               *://lmarena.ai/*
// @match               *://chatglm.cn/*
// @match               *://chat.z.ai/*
// @match               *://claude.ai/*
// @match               *://grok.com/*
// @match               *://poe.com/*
// @require             https://update.greasyfork.org/scripts/549920.js
// @connect             gist.github.com
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_xmlhttpRequest
// @grant               GM_registerMenuCommand
// @run-at              document-end
// @noframes
// @compatible          chrome
// @compatible          firefox
// @compatible          edge
// @compatible          opera
// @bgf-colorLT         #847dfd
// @bgf-colorDT         #6963ca
// @bgf-compatible      brave
// @bgf-copyright       [2025 OHAS. All Rights Reserved.](https://gist.github.com/0H4S/ae2fa82957a089576367e364cbf02438)
// @contributionURL     https://linktr.ee/0H4S
// @downloadURL https://update.greasyfork.org/scripts/549921/My%20Prompt.user.js
// @updateURL https://update.greasyfork.org/scripts/549921/My%20Prompt.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*eslint-disable*/
    // #region GLOBAL
    // ---CHAVES E CONSTANTES---
    const LANG_STORAGE_KEY      = 'UserScriptLang';
    const GLOBAL_FILES_KEY      = 'GlobalFiles';
    const PROMPT_STORAGE_KEY    = 'Prompts';
    let currentLang             = 'en';
    let isInitialized           = false;
    let isInitializing          = false;
    let currentButton           = null;
    let currentPlatform         = null;
    let pageObserver            = null;
    let currentMenu             = null;
    let currentModal            = null;
    let languageModal           = null;
    let currentPlaceholderModal = null;
    let infoModal               = null;
    let inlineMenu              = null;
    let inlineMenuCurrentItems  = [];
    let inlineMenuIndex         = 0;
    let currentActiveFileIds    = new Set();

    // ---TRUSTED TYPES---
    const scriptPolicy = window.trustedTypes
        ? window.trustedTypes.createPolicy('MyPromptPolicy', { createHTML: (input) => input })
        : null;

    function setSafeInnerHTML(element, html) {
        if   (!element) return;
        if   (scriptPolicy) {element.innerHTML = scriptPolicy.createHTML(html);}
        else {element.innerHTML = html;}
    }

    // ---NOTIFICADOR---
    const SCRIPT_CONFIG = {notificationsUrl:'https://gist.github.com/0H4S/b2f9a9f92259deadc35bdccb11cd9a75', scriptVersion: '3.4',};
    const notifier      = new ScriptNotifier(SCRIPT_CONFIG);
    notifier.run();

    // ---TRADUÇÕES---
    const translations = {
        'pt-BR': {
            langName:           'Português (BR)',
            prompt:             'Prompt',
            prompts:            'Prompts',
            newPrompt:          'Novo Prompt',
            editPrompt:         'Editar Prompt',
            title:              'Título',
            text:               'Prompt',
            save:               'Salvar',
            close:              'Fechar',
            edit:               'Editar',
            delete:             'Excluir',
            noSavedPrompts:     'Nenhum prompt salvo.',
            addPrompt:          'Adicionar prompt',
            import:             'Importar',
            export:             'Exportar',
            confirmDelete:      'Excluir prompt "{title}"?',
            noPromptsToExport:  'Não há prompts para exportar.',
            promptsImported:    '{count} prompts importados com sucesso!',
            errorImporting:     'Erro ao importar o arquivo: {error}',
            requiredFields:     'Título e prompt são obrigatórios.',
            editorNotFound:     'Não foi possível encontrar a área de texto para {platform}.',
            languageSettings:   '🌐 Idioma',
            fillPlaceholders:   'Preencha as Informações',
            insert:             'Inserir',
            enablePlaceholders: 'Prompt Dinâmico',
            autoExecute:        'Envio Automático',
            infoTitle:          'Ajuda',
            infoDPDesc:         'Acesse o guia de uso completo:<br><a href="https://gist.github.com/0H4S/109af9d102881cbc34b20d6f2bc196e7#file-english-md" target="_blank"><span style="color: #63b3ed;">English</span></a> | <a href="https://gist.github.com/0H4S/109af9d102881cbc34b20d6f2bc196e7#file-portugues-br-md" target="_blank"><span style="color: #63b3ed;">Português (BR)</span></a> | <a href="https://gist.github.com/0H4S/109af9d102881cbc34b20d6f2bc196e7#file-md" target="_blank"><span style="color: #63b3ed;">简体中文</span></a>',
            infoASDesc:         'Envia o prompt para o chat instantaneamente após ser inserido, sem necessidade de ação manual.',
            search:             'Procurar prompt...',
            searchLanguage:     'Procurar idioma...',
            selectAll:          'Selecionar Tudo',
            countPrompts:       '{count} prompts',
            confirmDownloads:   'Você está prestes a baixar {count} arquivos de texto individuais. Continuar?',
            noSearchResults:    'Nenhum prompt corresponde à pesquisa.',
            ffWarningTitle:     'Aviso Importante',
            ffWarningText:      'Nesta área específica da página, o <span style="color: #6a6cfc;"><strong>Meu Prompt</strong></span> não consegue interagir corretamente usando o Firefox.',
            ffRecommend:        'Para obter suporte completo em todas as áreas do chat no Doubao, recomendamos o uso de navegadores baseados em Chromium (Chrome, Edge, Brave, etc).',
            dontShowAgain:      'Remover Botão de Aviso',
            select:             'Selecione uma opção:',
            context:            'Contexto',
            expand:             'Expandir',
            collapse:           'Contrair',
            idGroup:            'Grupo ID',
            uniqueSelection:    'Seleção Única',
            filesLabel:         'Arquivos',
            addCardTitle:       'Adicionar arquivos',
            confirmDeleteFile:  'Apagar arquivo da memória?',
            confirmLargeFile:   'Arquivo grande ({fileSizeMB}MB). Deseja continuar mesmo assim?',
            sendingFiles:       'Enviando {fileCount} arquivo(s)...',
            filesCounter:       'Arquivos ({active}/{total})'
        },
        'en': {
            langName:           'English',
            prompt:             'Prompt',
            prompts:            'Prompts',
            newPrompt:          'New Prompt',
            editPrompt:         'Edit Prompt',
            title:              'Title',
            text:               'Prompt',
            save:               'Save',
            close:              'Close',
            edit:               'Edit',
            delete:             'Delete',
            noSavedPrompts:     'No saved prompts.',
            addPrompt:          'Add prompt',
            import:             'Import',
            export:             'Export',
            confirmDelete:      'Delete prompt "{title}"?',
            noPromptsToExport:  'No prompts to export.',
            promptsImported:    '{count} prompts imported successfully!',
            errorImporting:     'Error importing file: {error}',
            requiredFields:     'Title and prompt are required.',
            editorNotFound:     'Could not find the text area for {platform}.',
            languageSettings:   '🌐 Language',
            fillPlaceholders:   'Fill in the Information',
            insert:             'Insert',
            enablePlaceholders: 'Dynamic Prompt',
            autoExecute:        'Auto-Send',
            infoTitle:          'Help',
            infoDPDesc:         'Access the complete usage guide:<br><a href="https://gist.github.com/0H4S/109af9d102881cbc34b20d6f2bc196e7#file-english-md" target="_blank"><span style="color: #63b3ed;">English</span></a> | <a href="https://gist.github.com/0H4S/109af9d102881cbc34b20d6f2bc196e7#file-portugues-br-md" target="_blank"><span style="color: #63b3ed;">Português (BR)</span></a> | <a href="https://gist.github.com/0H4S/109af9d102881cbc34b20d6f2bc196e7#file-md" target="_blank"><span style="color: #63b3ed;">简体中文</span></a>',
            infoASDesc:         'Sends the prompt to the chat instantly after being inserted, without needing manual action.',
            search:             'Search prompt...',
            searchLanguage:     'Search language...',
            selectAll:          'Select All',
            countPrompts:       '{count} prompts',
            confirmDownloads:   'You are about to download {count} individual text files. Continue?',
            noSearchResults:    'No prompts match your search.',
            ffWarningTitle:     'Important Notice',
            ffWarningText:      'In this specific area of the page, <span style="color: #6a6cfc;"><strong>My Prompt</strong></span> cannot interact properly when using Firefox.',
            ffRecommend:        'For full support in all chat areas on Doubao, we recommend using Chromium-based browsers (Chrome, Edge, Brave, etc).',
            dontShowAgain:      'Remove Warning Button',
            select:             'Select an option:',
            context:            'Context',
            expand:             'Expand',
            collapse:           'Collapse',
            idGroup:            'Group ID',
            uniqueSelection:    'Unique Selection',
            filesLabel:         'Files',
            addCardTitle:       'Add files',
            confirmDeleteFile:  'Delete file from memory?',
            confirmLargeFile:   'Large file ({fileSizeMB}MB). Continue anyway?',
            sendingFiles:       'Sending {fileCount} file(s)...',
            filesCounter:       'Files ({active}/{total})'
        },
        'es': {
            langName:           'Español',
            prompt:             'Prompt',
            prompts:            'Prompts',
            newPrompt:          'Nuevo Prompt',
            editPrompt:         'Editar Prompt',
            title:              'Título',
            text:               'Prompt',
            save:               'Guardar',
            close:              'Cerrar',
            edit:               'Editar',
            delete:             'Eliminar',
            noSavedPrompts:     'No hay prompts guardados.',
            addPrompt:          'Añadir prompt',
            import:             'Importar',
            export:             'Exportar',
            confirmDelete:      '¿Eliminar prompt "{title}"?',
            noPromptsToExport:  'No hay prompts para exportar.',
            promptsImported:    '¡{count} prompts importados con éxito!',
            errorImporting:     'Error al importar el archivo: {error}',
            requiredFields:     'El título y el prompt son obligatorios.',
            editorNotFound:     'No se pudo encontrar el área de texto para {platform}.',
            languageSettings:   '🌐 Idioma',
            fillPlaceholders:   'Rellene la Información',
            insert:             'Insertar',
            enablePlaceholders: 'Prompt Dinámico',
            autoExecute:        'Envío Automático',
            infoTitle:          'Ayuda',
            infoDPDesc:         'Accede a la guía de uso completa:<br><a href="https://gist.github.com/0H4S/109af9d102881cbc34b20d6f2bc196e7#file-english-md" target="_blank"><span style="color: #63b3ed;">English</span></a> | <a href="https://gist.github.com/0H4S/109af9d102881cbc34b20d6f2bc196e7#file-portugues-br-md" target="_blank"><span style="color: #63b3ed;">Português (BR)</span></a> | <a href="https://gist.github.com/0H4S/109af9d102881cbc34b20d6f2bc196e7#file-md" target="_blank"><span style="color: #63b3ed;">简体中文</span></a>',
            infoASDesc:         'Envía el prompt al chat instantáneamente después de ser insertado, sin necesidad de acción manual.',
            search:             'Buscar prompt...',
            searchLanguage:     'Buscar idioma...',
            selectAll:          'Seleccionar todo',
            countPrompts:       '{count} prompts',
            confirmDownloads:   'Estás a punto de descargar {count} archivos de texto individuales. ¿Continuar?',
            noSearchResults:    'Ningún prompt coincide con tu búsqueda.',
            ffWarningTitle:     'Aviso Importante',
            ffWarningText:      'En esta área específica de la página, <span style="color: #6a6cfc;"><strong>Mi Prompt</strong></span> no puede interactuar correctamente cuando se usa Firefox.',
            ffRecommend:        'Para obtener compatibilidad completa en todas las áreas del chat en Doubao, recomendamos usar navegadores basados en Chromium (Chrome, Edge, Brave, etc).',
            dontShowAgain:      'Quitar Botón de Aviso',
            select:             'Seleccione una opción:',
            context:            'Contexto',
            expand:             'Expandir',
            collapse:           'Contraer',
            idGroup:            'ID de Grupo',
            uniqueSelection:    'Selección Única',
            filesLabel:         'Archivos',
            addCardTitle:       'Añadir archivos',
            confirmDeleteFile:  '¿Eliminar archivo de la memoria?',
            confirmLargeFile:   'Archivo grande ({fileSizeMB}MB). ¿Continuar de todos modos?',
            sendingFiles:       'Enviando {fileCount} archivo(s)...',
            filesCounter:       'Archivos ({active}/{total})'
        },
        'fr': {
            langName:           'Français',
            prompt:             'Prompt',
            prompts:            'Prompts',
            newPrompt:          'Nouveau prompt',
            editPrompt:         'Modifier le prompt',
            title:              'Titre',
            text:               'Prompt',
            save:               'Enregistrer',
            close:              'Fermer',
            edit:               'Modifier',
            delete:             'Supprimer',
            noSavedPrompts:     'Aucun prompt enregistré.',
            addPrompt:          'Ajouter un prompt',
            import:             'Importer',
            export:             'Exporter',
            confirmDelete:      'Supprimer le prompt "{title}" ?',
            noPromptsToExport:  'Aucun prompt à exporter.',
            promptsImported:    '{count} prompts importés avec succès !',
            errorImporting:     'Erreur lors de l\'importation du fichier : {error}',
            requiredFields:     'Le titre et le prompt sont obligatoires.',
            editorNotFound:     'Impossible de trouver la zone de texte pour {platform}.',
            languageSettings:   '🌐 Langue',
            fillPlaceholders:   'Remplir les informations',
            insert:             'Insérer',
            enablePlaceholders: 'Prompt Dynamique',
            autoExecute:        'Envoi Automatique',
            infoTitle:          'Aide',
            infoDPDesc:         'Accédez au guide d\'utilisation complet :<br><a href="https://gist.github.com/0H4S/109af9d102881cbc34b20d6f2bc196e7#file-english-md" target="_blank"><span style="color: #63b3ed;">English</span></a> | <a href="https://gist.github.com/0H4S/109af9d102881cbc34b20d6f2bc196e7#file-portugues-br-md" target="_blank"><span style="color: #63b3ed;">Português (BR)</span></a> | <a href="https://gist.github.com/0H4S/109af9d102881cbc34b20d6f2bc196e7#file-md" target="_blank"><span style="color: #63b3ed;">简体中文</span></a>',
            infoASDesc:         'Envoie le prompt au chat instantanément après son insertion, sans nécessiter d\'action manuelle.',
            search:             'Rechercher prompt...',
            searchLanguage:     'Rechercher langue...',
            selectAll:          'Tout sélectionner',
            countPrompts:       '{count} prompts',
            confirmDownloads:   'Vous êtes sur le point de télécharger {count} fichiers texte individuels. Continuer ?',
            noSearchResults:    'Aucun prompt ne correspond à la recherche.',
            ffWarningTitle:     'Avis Important',
            ffWarningText:      'Dans cette zone spécifique de la page, <span style="color: #6a6cfc;"><strong>Mon Prompt</strong></span> ne peut pas interagir correctement avec Firefox.',
            ffRecommend:        'Pour une prise en charge complète dans toutes les zones du chat sur Doubao, nous recommandons d’utiliser des navigateurs basés sur Chromium (Chrome, Edge, Brave, etc).',
            dontShowAgain:      'Retirer le Bouton d’Avertissement',
            select:             'Sélectionnez une option :',
            context:            'Contexte',
            expand:             'Développer',
            collapse:           'Réduire',
            idGroup:            'ID de Groupe',
            uniqueSelection:    'Sélection Unique',
            filesLabel:         'Fichiers',
            addCardTitle:       'Ajouter des fichiers',
            confirmDeleteFile:  'Supprimer le fichier de la mémoire ?',
            confirmLargeFile:   'Fichier volumineux ({fileSizeMB}MB). Continuer quand même ?',
            sendingFiles:       'Envoi de {fileCount} fichier(s)...',
            filesCounter:       'Fichiers ({active}/{total})'
        },
        'ru': {
            langName:           'Русский',
            prompt:             'Промпт',
            prompts:            'Промпты',
            newPrompt:          'Новый промпт',
            editPrompt:         'Редактировать промпт',
            title:              'Название',
            text:               'Текст промпта',
            save:               'Сохранить',
            close:              'Закрыть',
            edit:               'Редактировать',
            delete:             'Удалить',
            noSavedPrompts:     'Нет сохраненных промптов.',
            addPrompt:          'Добавить промпт',
            import:             'Импорт',
            export:             'Экспорт',
            confirmDelete:      'Удалить промпт "{title}"?',
            noPromptsToExport:  'Нет промптов для экспорта.',
            promptsImported:    'Успешно импортировано промптов: {count}!',
            errorImporting:     'Ошибка при импорте файла: {error}',
            requiredFields:     'Название и текст промпта обязательны.',
            editorNotFound:     'Не удалось найти текстовое поле для {platform}.',
            languageSettings:   '🌐 Язык',
            fillPlaceholders:   'Заполните данные',
            insert:             'Вставить',
            enablePlaceholders: 'Динамический промпт',
            autoExecute:        'Автоотправка',
            infoTitle:          'Справка',
            infoDPDesc:         'Открыть полное руководство пользователя:<br><a href="https://gist.github.com/0H4S/109af9d102881cbc34b20d6f2bc196e7#file-english-md" target="_blank"><span style="color: #63b3ed;">English</span></a> | <a href="https://gist.github.com/0H4S/109af9d102881cbc34b20d6f2bc196e7#file-portugues-br-md" target="_blank"><span style="color: #63b3ed;">Português (BR)</span></a> | <a href="https://gist.github.com/0H4S/109af9d102881cbc34b20d6f2bc196e7#file-md" target="_blank"><span style="color: #63b3ed;">简体中文</span></a>',
            infoASDesc:         'Автоматически отправляет промпт в чат сразу после вставки, не требуя ручного подтверждения.',
            search:             'Поиск промпта...',
            searchLanguage:     'Поиск языка...',
            selectAll:          'Выбрать все',
            countPrompts:       '{count} промптов',
            confirmDownloads:   'Вы собираетесь скачать {count} отдельных текстовых файлов. Продолжить?',
            noSearchResults:    'По вашему запросу промптов не найдено.',
            ffWarningTitle:     'Важное уведомление',
            ffWarningText:      'В этой конкретной области страницы <span style="color: #6a6cfc;"><strong>Мой Промпты</strong></span> не может корректно взаимодействовать при использовании Firefox.',
            ffRecommend:        'Для полной поддержки всех областей чата в Doubao мы рекомендуем использовать браузеры на базе Chromium (Chrome, Edge, Brave и др.).',
            dontShowAgain:      'Удалить кнопку предупреждения',
            select:             'Выберите вариант:',
            context:            'Контекст',
            expand:             'Развернуть',
            collapse:           'Свернуть',
            idGroup:            'ID группы',
            uniqueSelection:    'Уникальный выбор',
            filesLabel:         'Файлы',
            addCardTitle:       'Добавить файлы',
            confirmDeleteFile:  'Удалить файл из памяти?',
            confirmLargeFile:   'Большой файл ({fileSizeMB}MB). Все равно продолжить?',
            sendingFiles:       'Отправка {fileCount} файл(а/ов)...',
            filesCounter:       'Файлы ({active}/{total})'
        },
        'zh-CN': {
            langName:           '简体中文',
            prompt:             '提示',
            prompts:            '提示',
            newPrompt:          '新建提示',
            editPrompt:         '编辑提示',
            title:              '标题',
            text:               '提示内容',
            save:               '保存',
            close:              '关闭',
            edit:               '编辑',
            delete:             '删除',
            noSavedPrompts:     '没有已保存的提示。',
            addPrompt:          '添加提示',
            import:             '导入',
            export:             '导出',
            confirmDelete:      '确定要删除提示 "{title}" 吗？',
            noPromptsToExport:  '沒有可導出的提示。',
            promptsImported:    '成功导入 {count} 个提示！',
            errorImporting:     '导入文件时出错: {error}',
            requiredFields:     '标题和提示内容为必填项。',
            editorNotFound:     '未能找到 {platform} 的文本输入区域。',
            languageSettings:   '🌐 语言',
            fillPlaceholders:   '填写信息',
            insert:             '插入',
            enablePlaceholders: '动态提示',
            autoExecute:        '自动发送',
            infoTitle:          '帮助',
            infoDPDesc:         '访问完整的使用指南：<br><a href="https://gist.github.com/0H4S/109af9d102881cbc34b20d6f2bc196e7#file-english-md" target="_blank"><span style="color: #63b3ed;">English</span></a> | <a href="https://gist.github.com/0H4S/109af9d102881cbc34b20d6f2bc196e7#file-portugues-br-md" target="_blank"><span style="color: #63b3ed;">Português (BR)</span></a> | <a href="https://gist.github.com/0H4S/109af9d102881cbc34b20d6f2bc196e7#file-md" target="_blank"><span style="color: #63b3ed;">简体中文</span></a>',
            infoASDesc:         '插入后立即将提示发送到聊天室，无需手动操作。',
            search:             '搜索提示...',
            searchLanguage:     '搜索语言...',
            selectAll:          '全选',
            countPrompts:       '{count} 个提示词',
            confirmDownloads:   '即将下载 {count} 个单独的文本文件。是否继续？',
            noSearchResults:    '未找到匹配的提示词。',
            ffWarningTitle:     '重要提示',
            ffWarningText:      '在页面的此特定区域，<span style="color: #6a6cfc;"><strong>我的提示词</strong></span> 在使用 Firefox 时无法正常互动。',
            ffRecommend:        '为在 Doubao 的所有聊天区域获得完整支持，建议使用基于 Chromium 的浏览器（Chrome、Edge、Brave 等）。',
            dontShowAgain:      '移除警告按钮',
            select:             '请选择一个选项：',
            context:            '上下文',
            expand:             '展开',
            collapse:           '折叠',
            idGroup:            '组ID',
            uniqueSelection:    '唯一选择',
            filesLabel:         '文件',
            addCardTitle:       '添加文件',
            confirmDeleteFile:  '从内存中删除文件？',
            confirmLargeFile:   '文件过大（{fileSizeMB}MB）。是否继续？',
            sendingFiles:       '正在发送 {fileCount} 个文件...',
            filesCounter:       '文件 ({active}/{total})'
        },
        'ja': {
            langName:           '日本語',
            prompt:             'プロンプト',
            prompts:            'プロンプト',
            newPrompt:          '新規プロンプト',
            editPrompt:         'プロンプト編集',
            title:              'タイトル',
            text:               'プロンプト',
            save:               '保存',
            close:              '閉じる',
            edit:               '編集',
            delete:             '削除',
            noSavedPrompts:     '保存されたプロンプトはありません',
            addPrompt:          'プロンプトを追加',
            import:             'インポート',
            export:             'エクスポート',
            confirmDelete:      'プロンプト「{title}」を削除しますか？',
            noPromptsToExport:  'エクスポートするプロンプトがありません',
            promptsImported:    '{count}件のプロンプトをインポートしました',
            errorImporting:     'ファイルのインポート中にエラーが発生しました: {error}',
            requiredFields:     'タイトルとプロンプトは必須です',
            editorNotFound:     '{platform}のテキストエリアが見つかりません',
            languageSettings:   '🌐 言語設定',
            fillPlaceholders:   '情報を入力',
            insert:             '挿入',
            enablePlaceholders: '動的プロンプト',
            autoExecute:        '自動送信',
            infoTitle:          'ヘルプ',
            infoDPDesc:         '完全な利用ガイドを見る：<br><a href="https://gist.github.com/0H4S/109af9d102881cbc34b20d6f2bc196e7#file-english-md" target="_blank"><span style="color: #63b3ed;">English</span></a> | <a href="https://gist.github.com/0H4S/109af9d102881cbc34b20d6f2bc196e7#file-portugues-br-md" target="_blank"><span style="color: #63b3ed;">Português (BR)</span></a> | <a href="https://gist.github.com/0H4S/109af9d102881cbc34b20d6f2bc196e7#file-md" target="_blank"><span style="color: #63b3ed;">简体中文</span></a>',
            infoASDesc:         '挿入後、手動操作なしでプロンプトをチャットに即座に送信します。',
            search:             'プロンプトを検索...',
            searchLanguage:     '言語を検索...',
            selectAll:          'すべて選択',
            countPrompts:       '{count} 件のプロンプト',
            confirmDownloads:   '{count} 個のテキストファイルをダウンロードしようとしています。続行しますか？',
            noSearchResults:    '検索条件に一致するプロンプトはありません。',
            ffWarningTitle:     '重要なお知らせ',
            ffWarningText:      'ページのこの特定エリアでは、Firefox を使用している場合、<span style="color: #6a6cfc;"><strong>マイプロンプト</strong></span>が正しく動作できません。',
            ffRecommend:        'Doubao のすべてのチャット領域で完全なサポートを受けるには、Chromium ベースのブラウザ（Chrome、Edge、Brave など）の使用を推奨します。',
            dontShowAgain:      '警告ボタンを削除',
            select:             'オプションを選択してください：',
            context:            'コンテキスト',
            expand:             '展開',
            collapse:           '折りたたむ',
            idGroup:            'グループID',
            uniqueSelection:    '一意選択',
            filesLabel:         'ファイル',
            addCardTitle:       'ファイルを追加',
            confirmDeleteFile:  'メモリからファイルを削除しますか？',
            confirmLargeFile:   'ファイルが大きいです（{fileSizeMB}MB）。続行しますか？',
            sendingFiles:       '{fileCount} 個のファイルを送信中...',
            filesCounter:       'ファイル ({active}/{total})'
        },
        'ko': {
            langName:           '한국어',
            prompt:             '프롬프트',
            prompts:            '프롬프트',
            newPrompt:          '새 프롬프트',
            editPrompt:         '프롬프트 편집',
            title:              '제목',
            text:               '프롬프트',
            save:               '저장',
            close:              '닫기',
            edit:               '편집',
            delete:             '삭제',
            noSavedPrompts:     '저장된 프롬프트가 없습니다',
            addPrompt:          '프롬프트 추가',
            import:             '가져오기',
            export:             '내보내기',
            confirmDelete:      '프롬프트 "{title}"을(를) 삭제하시겠습니까?',
            noPromptsToExport:  '내보낼 프롬프트가 없습니다',
            promptsImported:    '프롬프트 {count}개를 성공적으로 가져왔습니다',
            errorImporting:     '파일 가져오기 오류: {error}',
            requiredFields:     '제목과 프롬프트는 필수 항목입니다',
            editorNotFound:     '{platform}의 텍스트 영역을 찾을 수 없습니다',
            languageSettings:   '🌐 언어 설정',
            fillPlaceholders:   '정보 채우기',
            insert:             '삽입',
            enablePlaceholders: '동적 프롬프트',
            autoExecute:        '자동 전송',
            infoTitle:          '도움말',
            infoDPDesc:         '전체 사용 가이드 보기:<br><a href="https://gist.github.com/0H4S/109af9d102881cbc34b20d6f2bc196e7#file-english-md" target="_blank"><span style="color: #63b3ed;">English</span></a> | <a href="https://gist.github.com/0H4S/109af9d102881cbc34b20d6f2bc196e7#file-portugues-br-md" target="_blank"><span style="color: #63b3ed;">Português (BR)</span></a> | <a href="https://gist.github.com/0H4S/109af9d102881cbc34b20d6f2bc196e7#file-md" target="_blank"><span style="color: #63b3ed;">简体中文</span></a>',
            infoASDesc:         '수동 조치 없이 삽입 후 즉시 프롬프트를 채팅으로 보냅니다.',
            search:             '프롬프트 검색...',
            searchLanguage:     '언어 검색...',
            selectAll:          '전체 선택',
            countPrompts:       '{count}개의 프롬프트',
            confirmDownloads:   '{count}개의 개별 텍스트 파일을 다운로드하시겠습니까?',
            noSearchResults:    '검색 결과와 일치하는 프롬프트가 없습니다.',
            ffWarningTitle:     '중요 안내',
            ffWarningText:      '페이지의 이 특정 영역에서는 Firefox 사용 시 <span style="color: #6a6cfc;"><strong>나의 프롬프트</strong></span>가 제대로 동작하지 않습니다.',
            ffRecommend:        'Doubao의 모든 채팅 영역에서 완전한 지원을 받으려면 Chromium 기반 브라우저(Chrome, Edge, Brave 등)를 사용할 것을 권장합니다.',
            dontShowAgain:      '경고 버튼 제거',
            select:             '옵션을 선택하세요:',
            context:            '컨텍스트',
            expand:             '펼치기',
            collapse:           '접기',
            idGroup:            '그룹 ID',
            uniqueSelection:    '고유 선택',
            filesLabel:         '파일',
            addCardTitle:       '파일 추가',
            confirmDeleteFile:  '메모리에서 파일을 삭제하시겠습니까?',
            confirmLargeFile:   '파일이 큽니다 ({fileSizeMB}MB). 계속하시겠습니까?',
            sendingFiles:       '{fileCount}개 파일 전송 중...',
            filesCounter:       '파일 ({active}/{total})'
        }
    };

    // ---DEFINIÇÃO DE IDIOMA---
    function getTranslation(key, replacements = {}) {
        let text = translations[currentLang]?.[key] || translations.en[key];
        Object.entries(replacements).forEach(([p, v]) => text = text.replace(`{${p}}`, v));
        return text;
    }

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

    // ---SELETORES CAMPO DE TEXTO---
    const platformSelectors = {
        chatgpt:        '#prompt-textarea',
        deepseek:       'textarea.ds-scroll-area',
        googleaistudio: 'textarea',
        qwen:           'textarea#chat-input',
        zai:            'textarea#chat-input',
        gemini:         'div.ql-editor[contenteditable="true"]',
        lmarena:        'textarea[name="message"]',
        kimi:           'div.chat-input-editor[contenteditable="true"]',
        claude:         'div.ProseMirror[contenteditable="true"]',
        grok:           'div.tiptap.ProseMirror[contenteditable="true"], textarea',
        perplexity:     '#ask-input',
        doubao:         'textarea[data-testid="chat_input_input"], div[data-testid="chat_input_input"]',
        longcat:        'div.tiptap.ProseMirror',
        mistral:        '.ProseMirror',
        yuanbao:        'div.chat-input-editor > div.ql-editor',
        chatglm:        'textarea.scroll-display-none',
        poe:            'textarea[class*="GrowingTextArea_textArea"]',
        googleModoIA:   'textarea.ITIRGe',
        notebooklm:     'textarea.query-box-input',
    };

    // ---GERENCIAMENTO DE ARQUIVOS/ANEXOS---
    async function getGlobalFiles() {
        return await GM_getValue(GLOBAL_FILES_KEY, []);
    }

    async function saveGlobalFile(fileObj) {
        const files = await getGlobalFiles();
        if (!files.find(f => f.name === fileObj.name && f.size === fileObj.size)) {
            files.push(fileObj);
            await GM_setValue(GLOBAL_FILES_KEY, files);
        }
        return files;
    }

    async function deleteGlobalFile(id) {
        let files = await getGlobalFiles();
        files = files.filter(f => f.id !== id);
        await GM_setValue(GLOBAL_FILES_KEY, files);
    }

    function dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){ u8arr[n] = bstr.charCodeAt(n); }
        return new File([u8arr], filename, {type:mime});
    }

    // ---HELPERS---
    function waitFor(selector, timeout = 8000) {
        return new Promise((resolve, reject) => {
            const el = document.querySelector(selector);
            if (el) { resolve(el); return; }
            const timer = setTimeout(() => { obs.disconnect(); reject(`Timeout esperando por ${selector}`); }, timeout);
            const obs = new MutationObserver(() => {
                const target = document.querySelector(selector);
                if (target) { clearTimeout(timer); obs.disconnect(); resolve(target); }
            });
            if (document.body) obs.observe(document.body, { childList: true, subtree: true });
            else document.addEventListener('DOMContentLoaded', () => obs.observe(document.body, { childList: true, subtree: true }));
        });
    }

    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    async function getAll() { return await GM_getValue(PROMPT_STORAGE_KEY, []); }

    // ---GERENCIAMENTO DE PROMPTS---
    async function addItem(item) {
        const prompts = await getAll();
        prompts.unshift(item);
        await GM_setValue(PROMPT_STORAGE_KEY, prompts);
    }

    async function update(index, item) {
        let prompts = await getAll();
        if (prompts[index]) {
            prompts[index] = item;
            await GM_setValue(PROMPT_STORAGE_KEY, prompts);
        }
    }

    async function remove(index) {
        let prompts = await getAll();
        prompts.splice(index, 1);
        await GM_setValue(PROMPT_STORAGE_KEY, prompts);
    }

    // ---TOOLTIPS CUSTOMIZADOS---
    function createCustomTooltip(button, text, position = 'top') {
        let tooltipElement = null;
        const showTooltip = () => {
            if (tooltipElement) return;
            tooltipElement = document.createElement('div');
            tooltipElement.className = `mp-tooltip mp-tooltip-${position}`;
            const content = document.createElement('div');
            content.className = 'mp-tooltip-content';
            content.textContent = text;
            const arrow = document.createElement('div');
            arrow.className = 'mp-tooltip-arrow';
            tooltipElement.appendChild(content);
            tooltipElement.appendChild(arrow);
            document.body.appendChild(tooltipElement);
            const btnRect = button.getBoundingClientRect();
            const tooltipWidth = tooltipElement.offsetWidth;
            const tooltipHeight = tooltipElement.offsetHeight;
            const margin = 8;
            let top, left;
            if      (position === 'bottom') {top = btnRect.bottom + margin + window.scrollY;}
            else if (position === 'top'   ) {top = btnRect.top - tooltipHeight - margin + window.scrollY;}
            else if (position === 'left'  ) {top = btnRect.top + (btnRect.height / 2) - (tooltipHeight / 2) + window.scrollY; left = btnRect.left - tooltipWidth - margin; }
            else if (position === 'right' ) {top = btnRect.top + (btnRect.height / 2) - (tooltipHeight / 2) + window.scrollY; left = btnRect.right + margin;}
            if      (position === 'top' || position === 'bottom') { left = btnRect.left + (btnRect.width / 2) - (tooltipWidth / 2); }
            const screenPadding = 10;
            if (left < screenPadding) {left = screenPadding;}
            else if (left + tooltipWidth > window.innerWidth - screenPadding) {left = window.innerWidth - tooltipWidth - screenPadding;}
            tooltipElement.style.left = `${Math.round(left)}px`;
            tooltipElement.style.top = `${Math.round(top)}px`;
            requestAnimationFrame(() => {
                tooltipElement.classList.add('visible');
            });
        };
        const hideTooltip = () => {
            if (!tooltipElement) return;
            const el = tooltipElement;
            tooltipElement = null;
            el.classList.remove('visible');
            setTimeout(() => {
                if (document.body.contains(el)) document.body.removeChild(el);
            }, 150);
        };
        button.addEventListener('mouseenter', showTooltip);
        button.addEventListener('mouseleave', hideTooltip);
        button.addEventListener('mousedown', hideTooltip);
    }

    // ---ESTILIZAÇÕES GLOBAIS---
    function injectGlobalStyles() {
        const styleId = 'my-prompt-styles';
        if (document.getElementById(styleId)) return;
        const styleElement = document.createElement('style');
        styleElement.id = styleId;
        setSafeInnerHTML(styleElement, `
            /* ---VARIÁVEIS E TEMA (CLARO / ESCURO)--- */
            :root {
                /* Tipografia */
                --mp-font-family-base: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important;

                /* Cores Base (Modo Claro) */
                --mp-bg-primary: #ffffff;
                --mp-bg-secondary: #f8f9fa;
                --mp-bg-tertiary: #f1f3f5;
                --mp-bg-overlay: rgba(10, 10, 10, 0.5);

                /* Texto */
                --mp-text-primary: #212529;
                --mp-text-secondary: #495057;
                --mp-text-tertiary: #868e96;

                /* Bordas */
                --mp-border-primary: #dee2e6;
                --mp-border-secondary: #ced4da;

                /* Cores de Ação */
                --mp-accent-primary: #7071fc;
                --mp-accent-primary-hover: #595ac9;
                --mp-accent-yellow: #fab005;
                --mp-accent-yellow-hover: #f08c00;
                --mp-accent-red: #f03e3e;
                --mp-accent-red-hover: #c92a2a;

                /* Sombras e Bordas */
                --mp-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
                --mp-shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
                --mp-shadow-lg: 0 10px 30px rgba(0, 0, 0, 0.1);
                --mp-border-radius-sm: 4px;
                --mp-border-radius-md: 8px;
                --mp-border-radius-lg: 16px;

                /* Transições */
                --mp-transition-fast: 0.2s cubic-bezier(0.25, 1, 0.5, 1);
            }

            @media (prefers-color-scheme: dark) {
                :root {
                    /* Cores Base (Modo Escuro) */
                    --mp-bg-primary: #212529;
                    --mp-bg-secondary: #2c2c30;
                    --mp-bg-tertiary: #343a40;
                    --mp-bg-overlay: rgba(0, 0, 0, 0.7);

                    /* Texto */
                    --mp-text-primary: #f8f9fa;
                    --mp-text-secondary: #e9ecef;
                    --mp-text-tertiary: #adb5bd;

                    /* Bordas */
                    --mp-border-primary: #495057;
                    --mp-border-secondary: #868e96;

                    /* Sombras */
                    --mp-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.15);
                    --mp-shadow-md: 0 4px 12px rgba(0, 0, 0, 0.25);
                    --mp-shadow-lg: 0 10px 30px rgba(0, 0, 0, 0.3);
                }
            }

            /* ---UTILITÁRIOS GERAIS--- */
            .mp-hidden {
                display: none !important;
            }

            /* ---SISTEMA DE SCROLL--- */
            .mp-scroll-invisible {
                overflow-y: auto !important;
                scrollbar-width: none !important; /* Firefox */
                -ms-overflow-style: none !important; /* IE/Edge */
                scroll-behavior: smooth;
            }

            /* Remove scrollbar no Chrome/Safari/Webkit */
            .mp-scroll-invisible::-webkit-scrollbar {
                display: none;
                width: 0;
                height: 0;
            }

            /* Wrapper que envolve a lista e contém as setas absolutas */
            .mp-scroll-wrapper {
                position: relative;
                display: flex;
                flex-direction: column;
                flex: 1;
                overflow: hidden;
                min-height: 0;
                max-width: 100%;
                box-sizing: border-box;
            }

            /* Estilo Base das Setas */
            .mp-scroll-arrow {
                position: absolute;
                left: 0;
                right: 0;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--mp-text-tertiary);
                cursor: pointer;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.2s ease, color 0.2s ease;
                z-index: 10;
            }

            /* Seta Superior */
            .mp-scroll-arrow.up {
                top: 0;
                background: linear-gradient(to bottom, var(--scroll-bg, var(--mp-bg-primary)) 30%, transparent);
            }

            /* Seta Inferior */
            .mp-scroll-arrow.down {
                bottom: 0;
                background: linear-gradient(to top, var(--scroll-bg, var(--mp-bg-primary)) 30%, transparent);
            }

            /* Estados da Seta */
            .mp-scroll-arrow:hover {
                color: var(--mp-accent-primary);
            }

            .mp-scroll-arrow.visible {
                opacity: 1;
                pointer-events: auto;
            }

            /* Ícone SVG da Seta */
            .mp-scroll-arrow svg {
                width: 20px;
                height: 20px;
                filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
            }

            /* --- AJUSTE ESPECÍFICO PARA O TEXTAREA DO EDITOR DE PROMPT --- */
            #AB_modal_box_el #__ap_text,
            #prompt-menu-container #__ap_text,
            .mp-modal-box .form-group:has(#__ap_text) .form-textarea {
                border: none !important;
                box-shadow: none !important;
                background-color: transparent !important;
                padding: 10px;
                width: 100%;
                height: 100%;
            }

            .mp-modal-box .form-group:has(#__ap_text) .mp-scroll-wrapper {
                border: 1px solid var(--mp-border-primary);
                border-radius: var(--mp-border-radius-md);
                background-color: var(--mp-bg-secondary);
                transition: border-color 0.2s, box-shadow 0.2s;
                overflow: hidden !important;
                display: flex;
                flex-direction: column;
                height: 300px;
            }

            .mp-modal-box .form-group:has(#__ap_text) .mp-scroll-wrapper:focus-within {
                border-color: var(--mp-accent-primary);
                box-shadow: 0 0 0 3px color-mix(in srgb, var(--mp-accent-primary) 25%, transparent);
            }

            .mp-modal-box.mp-expanded .form-group:has(#__ap_text) .mp-scroll-wrapper {
                height: 100% !important;
            }

            /* ---OVERLAY E MODAL PRINCIPAL--- */
            .mp-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: var(--mp-bg-overlay);
                z-index: 2147483647;
                display: flex;
                justify-content: center;
                align-items: center;
                backdrop-filter: blur(4px);
                opacity: 0;
                visibility: hidden;
                transition: opacity var(--mp-transition-fast), visibility var(--mp-transition-fast);
            }

            .mp-overlay.visible {
                opacity: 1;
                visibility: visible;
            }

            .mp-modal-box {
                font-family: var(--mp-font-family-base) !important;
                background-color: var(--mp-bg-primary);
                color: var(--mp-text-primary);
                border-radius: var(--mp-border-radius-lg);
                padding: 24px;
                box-shadow: var(--mp-shadow-lg);
                width: min(90vw, 520px);
                border: 1px solid var(--mp-border-primary);
                transform: scale(0.95) translateY(10px);
                opacity: 0;
                transition: transform var(--mp-transition-fast), opacity var(--mp-transition-fast), width 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                display: flex;
                flex-direction: column;
                max-height: 85vh;
            }

            .mp-modal-box.mp-expanded {
                width: 900px !important;
                max-width: 95vw !important;
                height: 85vh !important;
                display: flex;
                flex-direction: column;
            }

            .mp-modal-box.mp-expanded .modal-title {
                display: block !important;
                visibility: visible !important;
                text-align: center;
                margin-bottom: 20px;
                flex-shrink: 0;
            }

            .mp-modal-box.mp-expanded .form-group:has(.form-textarea) {
                flex: 1;
                display: flex;
                flex-direction: column;
                min-height: 0;
                margin-bottom: 24px;
            }

            .mp-modal-box.mp-expanded .mp-scroll-wrapper {
                flex: 1;
                height: 100% !important;
            }

            .mp-modal-box.mp-expanded .form-textarea {
                height: 100% !important;
            }

            .mp-modal-box.mp-expanded .mp-switch-container {
                padding-top: 10px;
            }

            .mp-overlay.visible .mp-modal-box {
                transform: scale(1) translateY(0);
                opacity: 1;
            }

            .modal-title {
                font-size: 18px;
                font-weight: 600;
                margin: 0 0 20px;
                text-align: center;
                color: var(--mp-text-primary);
                flex-shrink: 0;
            }

            .modal-footer {
                display: flex;
                justify-content: center;
                margin-top: 16px;
                flex-shrink: 0;
            }

            /* Botões de Fechar e Info */
            .mp-modal-close-btn,
            .mp-modal-info-btn {
                position: absolute;
                top: 12px;
                background: none;
                border: none;
                color: var(--mp-text-tertiary);
                cursor: pointer;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                transition: transform 0.3s ease, color 0.3s ease, background-color 0.3s ease;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 0;
                z-index: 20;
            }

            .mp-modal-close-btn {
                right: 12px;
            }

            .mp-modal-info-btn {
                right: 88px;
            }

            .mp-modal-close-btn:hover {
                transform: rotate(90deg);
                color: var(--mp-accent-red);
                background-color: color-mix(in srgb, var(--mp-accent-red) 15%, transparent);
            }

            .mp-modal-info-btn:hover {
                transform: scale(1.1);
                color: var(--mp-accent-primary);
                background-color: color-mix(in srgb, var(--mp-accent-primary) 15%, transparent);
            }

            .mp-modal-close-btn svg,
            .mp-modal-info-btn svg {
                width: 20px;
                height: 20px;
                stroke: currentColor;
                stroke-width: 2.5;
                fill: none;
            }

            .mp-modal-info-btn svg {
                stroke-width: 0;
                fill: currentColor;
            }

            /* Estilo do Botão de Expandir */
            .mp-modal-expand-btn {
                position: absolute;
                top: 12px;
                right: 50px;
                background: none;
                border: none;
                color: var(--mp-text-tertiary);
                cursor: pointer;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                transition: transform 0.3s ease, color 0.3s ease, background-color 0.3s ease;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 0;
                z-index: 20;
            }

            .mp-modal-expand-btn:hover {
                transform: scale(1.1);
                color: var(--mp-accent-primary);
                background-color: color-mix(in srgb, var(--mp-accent-primary) 15%, transparent);
            }

            .mp-modal-expand-btn svg {
                width: 20px;
                height: 20px;
                stroke: currentColor;
                stroke-width: 2;
                fill: none;
            }

            /* ---ANEXOS--- */
            .mp-files-accordion {
                border: 1px solid var(--mp-border-primary);
                border-radius: var(--mp-border-radius-md);
                background-color: var(--mp-bg-secondary);
                overflow: hidden;
                margin-top: 10px;
                margin-bottom: 20px;
                flex-shrink: 0;
                transition: border-color 0.2s;
                display: flex;
                flex-direction: column;
            }

            .mp-files-accordion:hover {
                border-color: var(--mp-accent-primary);
            }

            .mp-accordion-header {
                padding: 10px 12px;
                background-color: var(--mp-bg-secondary);
                cursor: pointer;
                font-size: 13px;
                font-weight: 600;
                color: var(--mp-text-secondary);
                display: flex;
                justify-content: space-between;
                align-items: center;
                user-select: none;
                transition: background 0.2s;
                border-bottom: 1px solid transparent;
                flex-shrink: 0;
            }

            .mp-accordion-header:hover {
                color: var(--mp-text-primary);
                background-color: var(--mp-bg-tertiary);
            }

            .mp-acc-arrow {
                width: 16px;
                height: 16px;
                transition: transform 0.2s ease;
                opacity: 0.6;
            }

            .mp-files-accordion.open .mp-accordion-header {
                border-bottom: 1px solid var(--mp-border-primary);
                background-color: var(--mp-bg-tertiary);
            }

            .mp-files-accordion.open .mp-acc-arrow {
                transform: rotate(180deg);
                opacity: 1;
                color: var(--mp-accent-primary);
            }

            .mp-accordion-content {
                display: none;
                background-color: var(--mp-bg-primary);
                position: relative;
            }

            .mp-files-accordion.open .mp-accordion-content {
                display: block;
            }

            /* SCROLL WRAPPER COM RESPIRO */
            .mp-file-scroll-wrapper {
                max-height: 170px;
                overflow-y: auto;
                padding: 12px 10px;
                scrollbar-width: none;
                -ms-overflow-style: none;
                box-sizing: border-box;
            }

            .mp-file-scroll-wrapper::-webkit-scrollbar {
                display: none;
            }

            .mp-file-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, 70px);
                justify-content: center;
                gap: 10px;
                width: 100%;
            }

            .mp-file-card,
            .mp-add-file-card {
                position: relative;
                width: 100%;
                height: 70px;
                border-radius: 6px;
                flex-shrink: 0;
                cursor: pointer;
                transition: all 0.2s ease;
                box-sizing: border-box;
            }

            /* Estilo Card Arquivo */
            .mp-file-card {
                background: var(--mp-bg-secondary);
                border: 1px solid var(--mp-border-primary);
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
            }

            .mp-add-file-card {
                border: 2px dashed var(--mp-border-primary);
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--mp-text-tertiary);
                background: transparent;
            }

            .mp-add-file-card:hover {
                border-color: var(--mp-accent-primary);
                color: var(--mp-accent-primary);
                background-color: color-mix(in srgb, var(--mp-accent-primary) 5%, transparent);
            }

            .mp-add-icon {
                width: 24px;
                height: 24px;
                stroke: currentColor;
                stroke-width: 2;
            }

            /* Estados */
            .mp-file-card.inactive {
                opacity: 0.5;
                filter: grayscale(100%);
            }

            .mp-file-card.inactive:hover {
                opacity: 0.9;
                filter: grayscale(0%);
                border-color: var(--mp-text-tertiary);
            }

            .mp-file-card.active {
                opacity: 1;
                border-color: var(--mp-accent-yellow);
                box-shadow: 0 0 0 2px color-mix(in srgb, var(--mp-accent-yellow) 20%, transparent);
            }

            .mp-file-thumb {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .mp-file-icon-gen {
                width: 28px;
                height: 28px;
                color: var(--mp-text-secondary);
            }

            /* Botão Delete */
            .mp-file-delete-perm {
                position: absolute;
                top: 2px;
                right: 2px;
                width: 16px;
                height: 16px;
                background: rgba(0, 0, 0, 0.6);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                opacity: 0;
                transition: opacity 0.2s;
                z-index: 10;
            }

            .mp-file-delete-perm:hover {
                background-color: var(--mp-accent-red);
            }

            .mp-file-card:hover .mp-file-delete-perm {
                opacity: 1;
            }

            /* Tooltip */
            .mp-file-card::after {
                content: attr(title);
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                font-size: 9px;
                padding: 2px 0;
                text-align: center;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                transform: translateY(100%);
                transition: transform 0.2s;
            }

            .mp-file-card:hover::after {
                transform: translateY(0);
            }

            /* --- HELPERS E TOOLTIPS DE CONTEXTO --- */
            .mp-label-wrapper {
                display: flex;
                align-items: center;
                gap: 6px;
                margin-bottom: 6px;
                width: 100%;
            }

            .mp-help-icon {
                color: var(--mp-accent-primary);
                cursor: pointer;
                display: flex;
                align-items: center;
                transition: transform 0.2s;
                opacity: 0.8;
            }

            .mp-help-icon:hover {
                transform: scale(1.1);
                opacity: 1;
            }

            .mp-help-icon svg {
                width: 15px;
                height: 15px;
                fill: currentColor;
            }

            .mp-context-bubble {
                display: none;
                background-color: var(--mp-bg-tertiary);
                border-left: 3px solid var(--mp-accent-primary);
                padding: 8px 12px;
                border-radius: 0 var(--mp-border-radius-sm) var(--mp-border-radius-sm) 0;
                margin-bottom: 12px;
                font-size: 13px;
                color: var(--mp-text-secondary);
                line-height: 1.4;
                animation: mp-fade-in-down 0.2s ease-out forwards;
                width: 100%;
                box-sizing: border-box;
            }

            .mp-context-bubble.visible {
                display: block;
            }

            .mp-context-bubble strong {
                color: var(--mp-text-primary);
                font-weight: 600;
            }

            @keyframes mp-fade-in-down {
                from {
                    opacity: 0;
                    transform: translateY(-5px);
                }

                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* ---MENU FLUTUANTE DE PROMPTS--- */
            .prompt-menu {
                position: fixed;
                min-width: 320px;
                max-width: 420px;
                background-color: var(--mp-bg-primary);
                border: 1px solid var(--mp-border-primary);
                border-radius: var(--mp-border-radius-lg);
                box-shadow: var(--mp-shadow-lg);
                z-index: 2147483647;
                display: flex;
                flex-direction: column;
                user-select: none;
                color: var(--mp-text-primary) !important;
                font-family: var(--mp-font-family-base) !important;
                overflow: hidden;
                opacity: 0;
                visibility: hidden;
                transform: scale(0.95);
                transform-origin: top left;
                transition: opacity 0.2s ease, transform 0.2s ease, visibility 0s linear 0.2s;
            }

            .prompt-menu.visible {
                opacity: 1;
                visibility: visible;
                transform: scale(1);
                transition-delay: 0s;
            }

            .prompt-menu-list {
                max-height: 220px;
                padding: 4px;
            }

            .prompt-item-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 8px 12px;
                border-radius: var(--mp-border-radius-md);
                cursor: pointer;
                transition: background-color 0.15s ease-in-out;
            }

            .prompt-item-row:hover {
                background-color: var(--mp-bg-tertiary);
            }

            .prompt-title {
                font-size: 14px;
                font-weight: 500;
                flex: 1;
                padding-right: 12px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: var(--mp-text-secondary);
            }

            .prompt-item-row:hover .prompt-title {
                color: var(--mp-text-primary);
            }

            .prompt-actions {
                display: flex;
                align-items: center;
                gap: 4px;
            }

            .action-btn {
                background: transparent;
                border: none;
                cursor: pointer;
                padding: 6px;
                border-radius: var(--mp-border-radius-sm);
                transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out;
                display: flex;
                align-items: center;
                justify-content: center;
                line-height: 0;
                color: var(--mp-text-secondary);
            }

            .action-btn svg {
                width: 16px;
                height: 16px;
                display: block;
            }

            .action-btn.edit:hover {
                background-color: var(--mp-bg-tertiary);
                color: var(--mp-accent-yellow);
            }

            .action-btn.delete:hover {
                background-color: var(--mp-bg-tertiary);
                color: var(--mp-accent-red);
            }

            /* Rodapé do Menu */
            .menu-footer-grid {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                border-top: 1px solid var(--mp-border-primary);
                background-color: var(--mp-bg-secondary);
                flex-shrink: 0;
            }

            .menu-footer-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                background: transparent;
                border: none;
                cursor: pointer;
                padding: 12px 0;
                color: var(--mp-text-secondary);
                transition: all 0.2s ease;
                height: auto;
            }

            .menu-footer-btn:not(:last-child) {
                border-right: 1px solid var(--mp-border-primary);
            }

            .menu-footer-btn svg {
                width: 20px;
                height: 20px;
                transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
            }

            .menu-footer-btn:hover svg {
                transform: scale(1.2);
            }

            .menu-footer-btn.btn-export:hover {
                background-color: rgba(34, 129, 207, 0.1);
                color: #2281cfff;
            }

            .menu-footer-btn.btn-add:hover {
                background-color: rgba(32, 201, 97, 0.1);
                color: #20c961ff;
                transform: none;
            }

            .menu-footer-btn.btn-add:hover svg {
                transform: scale(1.4);
            }

            .menu-footer-btn.btn-import:hover {
                background-color: rgba(253, 126, 20, 0.1);
                color: #fd7e14;
            }

            /* ---FORMULÁRIOS E INPUTS--- */
            .form-group {
                display: flex;
                flex-direction: column;
                margin-bottom: 16px;
                flex-shrink: 0;
            }

            .form-label {
                margin-bottom: 8px;
                font-size: 13px !important;
                font-weight: 500 !important;
                color: var(--mp-text-secondary);
                display: block;
            }

            .form-input,
            .form-textarea {
                background-color: var(--mp-bg-secondary) !important;
                color: var(--mp-text-primary) !important;
                border: 1px solid var(--mp-border-primary) !important;
                border-radius: var(--mp-border-radius-md);
                padding: 10px;
                width: 100%;
                box-sizing: border-box;
                transition: border-color 0.2s, box-shadow 0.2s;
                outline: 0 !important;
                font-family: var(--mp-font-family-base) !important;
                font-size: 14px !important;
            }

            .form-textarea {
                height: 300px !important;
                resize: none !important;
                display: block;
            }

            .form-input:focus,
            .form-textarea:focus {
                border-color: var(--mp-accent-primary) !important;
                box-shadow: 0 0 0 3px color-mix(in srgb, var(--mp-accent-primary) 25%, transparent) !important;
            }

            .form-input::placeholder,
            .form-textarea::placeholder,
            .mp-search-input::placeholder,
            .menu-search-input::placeholder,
            .lang-search-input::placeholder {
                color: var(--mp-text-tertiary) !important;
                opacity: 0.7;
            }

            /* Switches (Checkbox estilo Toggle) */
            .mp-switch-container {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 4px 0 4px;
                margin: -8px 0 24px;
                flex-shrink: 0;
            }

            .mp-switch {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .mp-switch input[type="checkbox"] {
                height: 0;
                width: 0;
                visibility: hidden;
                position: absolute;
            }

            .mp-switch label {
                cursor: pointer;
                text-indent: -9999px;
                width: 40px;
                height: 22px;
                background: var(--mp-bg-tertiary);
                display: block;
                border-radius: 100px;
                position: relative;
                transition: background-color var(--mp-transition-fast);
            }

            .mp-switch label:after {
                content: '';
                position: absolute;
                top: 3px;
                left: 3px;
                width: 16px;
                height: 16px;
                background: #fff;
                border-radius: 90px;
                transition: 0.3s cubic-bezier(.25, 1, .5, 1);
                box-shadow: var(--mp-shadow-sm);
            }

            .mp-switch input:checked+label {
                background: var(--mp-accent-primary);
            }

            .mp-switch input:checked+label:after {
                left: calc(100% - 3px);
                transform: translateX(-100%);
            }

            .mp-switch .switch-text {
                font-size: 13px;
                font-weight: 500;
                color: var(--mp-text-secondary);
                cursor: pointer;
                user-select: none;
            }

            /* Checkboxe */
            .mp-checkbox, .mp-option-item input[type="checkbox"] {
                -webkit-appearance: none !important;
                appearance: none !important;
                width: 18px !important;
                height: 18px !important;
                border: 1px solid var(--mp-border-primary) !important;
                border-radius: var(--mp-border-radius-sm) !important;
                background-color: var(--mp-bg-secondary) !important;
                cursor: pointer !important;
                margin: 0 !important;
                display: grid !important;
                place-content: center !important;
                transition: all 0.2s ease;
            }

            .mp-checkbox:checked, .mp-option-item input[type="checkbox"]:checked {
                background-color: var(--mp-accent-primary) !important;
                border-color: var(--mp-accent-primary) !important;
            }

            .mp-checkbox::before, .mp-option-item input[type="checkbox"]::before {
                content: "";
                width: 10px;
                height: 10px;
                clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
                background-color: #ffffff;
                transform: scale(0);
                transition: 0.15s transform ease-in-out;
            }

            .mp-checkbox:checked::before, .mp-option-item input[type="checkbox"]:checked::before {
                transform: scale(1);
            }

            /* Campos de Busca */
            .mp-search-container,
            .menu-search-container {
                position: sticky;
                top: 0;
                z-index: 10;
                display: flex;
                flex-direction: column;
                flex-shrink: 0;
            }

            .menu-search-container {
                padding: 10px 12px;
                background-color: var(--mp-bg-secondary);
                border-bottom: 1px solid var(--mp-border-primary);
            }

            .mp-search-input,
            .menu-search-input,
            .lang-search-input {
                width: 100%;
                padding: 10px 12px;
                border-radius: var(--mp-border-radius-md);
                border: 1px solid var(--mp-border-primary);
                background-color: var(--mp-bg-secondary);
                color: var(--mp-text-primary);
                font-family: var(--mp-font-family-base) !important;
                font-size: 13px;
                box-sizing: border-box;
                outline: none;
                transition: border-color 0.2s;
            }

            .menu-search-input {
                background-color: var(--mp-bg-primary) !important;
            }

            .lang-search-input {
                margin-bottom: 12px;
            }

            .mp-search-input:focus,
            .menu-search-input:focus,
            .lang-search-input:focus {
                border-color: var(--mp-accent-primary);
            }

            /* ---MENUS ESPECÍFICOS (EXPORTAÇÃO, DINÂMICO, IDIOMAS)--- */
            /* Exportação */
            .mp-export-actions {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 20px;
                margin-bottom: 20px;
                font-size: 13px;
                color: var(--mp-text-secondary);
                border-bottom: 1px solid var(--mp-border-primary);
                padding-bottom: 16px;
            }

            .mp-checkbox-wrapper {
                display: flex;
                align-items: center;
                cursor: pointer;
                user-select: none;
            }

            .mp-export-list {
                display: flex;
                flex-direction: column;
                gap: 4px;
                margin: 0 -8px;
                padding: 0 8px;
            }

            .mp-export-item {
                display: flex;
                align-items: center;
                padding: 8px;
                border-radius: var(--mp-border-radius-md);
                transition: background 0.15s;
                cursor: pointer;
                border: 1px solid transparent;
            }

            .mp-export-item:hover {
                background-color: var(--mp-bg-tertiary);
                border-color: var(--mp-border-primary);
            }

            .mp-item-content {
                display: flex;
                flex-direction: column;
                overflow: hidden;
                margin-left: 12px;
            }

            .mp-item-title {
                font-size: 14px;
                font-weight: 500;
                color: var(--mp-text-primary);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .mp-item-preview {
                font-size: 12px;
                color: var(--mp-text-tertiary);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-top: 2px;
            }

            .mp-export-buttons {
                display: flex;
                gap: 10px;
                margin-top: 20px;
                justify-content: flex-end;
                border-top: 1px solid var(--mp-border-primary);
                padding-top: 16px;
                flex-shrink: 0;
            }

            /* Dinâmico */
            #__ap_placeholders_container {
                padding: 4px;
                margin-top: 15px;
                box-sizing: border-box;
                transition: padding-top 0.2s ease;
            }

            .mp-option-group {
                display: flex;
                flex-direction: column;
                gap: 4px;
                margin-bottom: 12px;
                padding: 8px;
                border: 1px solid var(--mp-border-primary);
                border-radius: var(--mp-border-radius-md);
                background-color: var(--mp-bg-tertiary);
                max-height: none !important;
                overflow: visible !important;
            }

            .mp-option-item {
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 13px;
                cursor: pointer;
                padding: 8px 8px 8px 12px !important;
                border-radius: var(--mp-border-radius-sm);
                background-color: var(--mp-bg-primary);
                transition: background-color 0.2s;
                user-select: none;
                border-left: 5px solid transparent;
                position: relative;
            }

            .mp-option-item:hover {
                background-color: var(--mp-bg-secondary);
            }

            /* Modo Expandido */
            .mp-modal-box.mp-expanded #__ap_placeholders_container {
                max-height: none !important;
                height: 100% !important;
                flex: 1;
                display: flex;
                flex-direction: column;
                min-height: 0;
            }

            .mp-modal-box.mp-expanded #__ap_placeholders_container .mp-scroll-wrapper {
                height: 100% !important;
                flex: 1;
            }

            .dynamic-input {
                min-height: 45px !important;
                line-height: 1.5;
            }

            /* Idiomas */
            .lang-box {
                width: min(90vw, 320px);
            }

            .lang-button {
                all: unset;
                box-sizing: border-box;
                display: block;
                width: 100%;
                padding: 12px 20px;
                border-radius: var(--mp-border-radius-md);
                background-color: var(--mp-bg-secondary);
                color: var(--mp-text-primary);
                border: 1px solid var(--mp-border-primary);
                font-weight: 500;
                cursor: pointer;
                text-align: center;
                transition: all 0.2s ease;
                font-family: var(--mp-font-family-base) !important;
                flex-shrink: 0;
            }

            .lang-button:hover {
                transform: translateY(-2px);
                box-shadow: var(--mp-shadow-sm);
                background-color: var(--mp-bg-tertiary);
            }

            .lang-button.selected {
                border-color: var(--mp-accent-primary);
                color: var(--mp-accent-primary);
                background-color: color-mix(in srgb, var(--mp-accent-primary) 5%, transparent);
                font-weight: 600;
            }

            /* ---BOTÕES PRINCIPAIS--- */
            .save-button {
                padding: 10px 28px;
                border-radius: var(--mp-border-radius-md);
                background-color: var(--mp-accent-primary);
                color: #fff;
                border: none;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease-in-out;
                font-family: var(--mp-font-family-base) !important;
            }

            .save-button:hover {
                background-color: var(--mp-accent-primary-hover);
                transform: translateY(-1px);
            }

            .mp-btn-secondary {
                background: transparent;
                border: 1px solid var(--mp-border-secondary);
                color: var(--mp-text-secondary);
            }

            .mp-btn-secondary:hover {
                background-color: var(--mp-bg-tertiary);
                color: var(--mp-text-primary);
            }

            /* ---TABELA DE INFORMAÇÕES--- */
            .mp-info-table {
                display: flex;
                flex-direction: column;
                border: 1px solid var(--mp-border-primary);
                border-radius: var(--mp-border-radius-md);
                overflow: hidden;
                margin-top: 8px;
            }

            .mp-info-row {
                display: flex;
                text-align: center;
            }

            .mp-info-row:not(:last-child) {
                border-bottom: 1px solid var(--mp-border-primary);
            }

            .mp-info-col {
                padding: 16px;
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }

            .mp-info-col:not(:last-child) {
                border-right: 1px solid var(--mp-border-primary);
            }

            .mp-info-col h3 {
                font-size: 14px;
                font-weight: 600;
                color: var(--mp-text-primary);
                margin: 0 0 8px;
            }

            .mp-info-col p {
                font-size: 13px;
                color: var(--mp-text-secondary);
                line-height: 1.5;
                margin: 0;
            }

            /* ---BUSCA DIFUSA--- */
            .mp-inline-menu {
                position: fixed;
                width: 300px;
                max-height: 250px;
                background-color: var(--mp-bg-primary) !important;
                border: 1px solid var(--mp-border-primary);
                border-radius: var(--mp-border-radius-md);
                box-shadow: var(--mp-shadow-lg);
                z-index: 2147483647 !important;
                display: flex;
                flex-direction: column;
                opacity: 0;
                visibility: hidden;
                transform: translateY(10px);
                transition: opacity 0.1s, transform 0.1s, visibility 0s linear 0.1s;
                overflow: hidden;
                font-family: var(--mp-font-family-base) !important;
            }

            .mp-inline-menu.visible {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
                transition-delay: 0s;
            }

            .mp-inline-list {
                display: flex;
                flex-direction: column;
                padding: 4px;
                pointer-events: auto;
            }

            .mp-inline-item {
                padding: 8px 12px;
                cursor: pointer;
                border-radius: var(--mp-border-radius-sm);
                font-size: 13px;
                color: var(--mp-text-primary);
                display: flex;
                align-items: center;
                justify-content: space-between;
                transition: background-color 0.1s;
            }

            .mp-inline-item:hover {
                background-color: var(--mp-bg-tertiary);
            }

            .mp-inline-item.selected {
                background-color: var(--mp-accent-primary);
                color: #ffffff !important;
            }

            .mp-inline-title {
                font-weight: 500;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 100%;
            }

            /* ---EXTRAS (Tooltips, Empty States, Animações)--- */
            .mp-tooltip {
                position: fixed;
                z-index: 2147483647;
                pointer-events: none;
                display: flex;
                flex-direction: column;
                align-items: center;
                width: max-content;
                opacity: 0;
                transform: scale(0.95) translateY(4px);
                transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1), transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
            }

            .mp-tooltip.visible {
                opacity: 1;
                transform: scale(1) translateY(0);
            }

            .mp-tooltip-content {
                background-color: var(--mp-text-primary);
                color: var(--mp-bg-primary);
                padding: 5px 10px;
                border-radius: var(--mp-border-radius-sm);
                white-space: nowrap;
                font-family: var(--mp-font-family-base) !important;
                font-size: 12px;
                font-weight: 500;
                box-shadow: var(--mp-shadow-md);
                line-height: 1.2;
            }

            .mp-tooltip-arrow {
                width: 0;
                height: 0;
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                margin: 0 auto;
            }

            .mp-tooltip-top .mp-tooltip-arrow {
                border-top: 5px solid var(--mp-text-primary);
                margin-top: -1px;
            }

            .mp-tooltip-bottom .mp-tooltip-arrow {
                border-bottom: 5px solid var(--mp-text-primary);
                margin-bottom: -1px;
                order: -1;
            }

            .empty-state {
                padding: 24px 16px;
                text-align: center;
                color: var(--mp-text-tertiary);
                font-size: 14px;
            }

            @keyframes mp-fade-in-up {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `);
        document.head.appendChild(styleElement);
    }
    // #endregion GLOBAL
    // #region BOTÕES DE PROMPT
    // ---CHATGPT---
    function createChatGPTButton() {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('data-testid', 'composer-button-prompts');
        btn.className = 'composer-btn';
        setSafeInnerHTML(btn, `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M4 5h12M4 10h12M4 15h12" stroke="currentColor" stroke-width="2"/></svg>`);
        createCustomTooltip(btn, getTranslation('prompts'));
        return btn;
    }

    // ---DEEPSEEK---
    function createDeepseekButton() {
        const styleId = 'uni-btn-deepseek-v2';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `.uni-btn-deepseek-v2 {display: inline-flex;align-items: center;justify-content: center;box-sizing: border-box;height: 32px;cursor: pointer;gap: 4px;}.uni-btn-deepseek-v2 svg { display: block; }`;
            document.head.appendChild(style);
        }
        const btn = document.createElement('div');
        btn.setAttribute('role', 'button');
        btn.setAttribute('aria-disabled', 'false');
        btn.setAttribute('tabindex', '0');
        btn.className = 'ds-atom-button ds-toggle-button ds-toggle-button--md uni-btn-deepseek-v2';
        btn.setAttribute('data-testid', 'composer-button-prompts');
        const iconDiv = document.createElement('div');
        iconDiv.className = 'ds-icon ds-atom-button__icon';
        iconDiv.style.cssText = 'font-size: 14px; width: 14px; height: 14px; color: var(--dsw-alias-label-primary); margin-right: 4px; display: flex; align-items: center; justify-content: center;';
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '14'); svg.setAttribute('height', '14');
        svg.setAttribute('viewBox', '0 0 20 20'); svg.setAttribute('fill', 'none');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M4 5h12M4 10h12M4 15h12');
        path.setAttribute('stroke', 'currentColor');
        path.setAttribute('stroke-width', '2');
        svg.appendChild(path);
        iconDiv.appendChild(svg);
        const textWrapper = document.createElement('span');
        const textInner = document.createElement('span');
        textInner.textContent = getTranslation('prompts');
        textWrapper.appendChild(textInner);
        const focusRing = document.createElement('div');
        focusRing.className = 'ds-focus-ring';
        btn.appendChild(iconDiv);
        btn.appendChild(textWrapper);
        btn.appendChild(focusRing);
        return btn;
    }

    // ---GOOGLE AI STUDIO---
    function createGoogleAIStudioButton() {
        const styleId = 'uni-ai-btn-style';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `.uni-ai-btn {display: inline-flex; align-items: center; justify-content: center;box-sizing: border-box; width: 32px; height: 32px; border-radius: 50%;border: 1px solid transparent; background: transparent; cursor: pointer;color: currentColor; transition: all 0.2s ease; margin-right: 4px;position: relative; z-index: 10;}.uni-ai-btn:hover { background-color: rgba(125, 125, 125, 0.15); }.uni-ai-btn svg { display: block; }`;
            document.head.appendChild(style);
        }
        const btn = document.createElement('button');
        btn.className = 'uni-ai-btn';
        btn.setAttribute('data-testid', 'composer-button-prompts');
        btn.setAttribute('aria-label', getTranslation('prompts'));
        const span = document.createElement('span');
        span.style.display = 'flex';
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '24');
        svg.setAttribute('height', '24');
        svg.setAttribute('viewBox', '0 0 20 20');
        svg.setAttribute('fill', 'none');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M4 5h12M4 10h12M4 15h12');
        path.setAttribute('stroke', 'currentColor');
        path.setAttribute('stroke-width', '2');
        svg.appendChild(path);
        span.appendChild(svg);
        btn.appendChild(span);
        createCustomTooltip(btn, getTranslation('prompts'));
        return btn;
    }

    // ---QWEN---
    function createQwenButton() {
        const btn = document.createElement('div');
        btn.className = 'chat-input-feature-btn';
        btn.setAttribute('data-testid', 'composer-button-prompts');
        btn.style.cursor = 'pointer';
        setSafeInnerHTML(btn, `<span class="chat-input-feature-btn-icon"><svg width="1em" height="1em" viewBox="0 0 20 20" fill="currentColor" style="font-size: 16px;"><path d="M4 5h12M4 10h12M4 15h12" stroke="currentColor" stroke-width="2"/></svg></span><span class="chat-input-feature-btn-text">${getTranslation('prompt')}</span>`);
        return btn;
    }

    // ---Z.AI---
    function createZaiButton() {
        const btnWrapper = document.createElement('div');
        setSafeInnerHTML(btnWrapper, `<button type="button" class="px-2 @xl:px-3 py-1.5 flex gap-1.5 items-center text-sm rounded-lg border transition-colors duration-300 focus:outline-hidden max-w-full overflow-hidden bg-transparent dark:text-gray-300 border-[#E5E5E5] dark:border-[#3C3E3F] hover:bg-black/5 dark:hover:bg-white/5"><svg class="size-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M4 5h12M4 10h12M4 15h12" stroke="currentColor" stroke-width="2"></path></svg><span class="hidden @sm:block whitespace-nowrap overflow-hidden text-ellipsis translate-y-[0.5px] mr-0.5">${getTranslation('prompt')}</span></button>`);
        const btn = btnWrapper.firstElementChild;
        btn.setAttribute('data-testid', 'composer-button-prompts');
        return btn;
    }

    // ---GEMINI---
    function createGeminiButton() {
        const btn = document.createElement('button');
        btn.setAttribute('data-testid', 'composer-button-prompts');
        btn.className = 'mdc-icon-button mat-mdc-icon-button mat-mdc-button-base mat-primary mat-mdc-tooltip-trigger';
        const svgHTML = `<span class="mat-mdc-button-persistent-ripple mdc-icon-button__ripple"></span><span class="mat-icon notranslate" style="display: inline-flex; align-items: center; justify-content: center;"><svg style="width: 24px; height: 24px;" viewBox="0 0 20 20" fill="currentColor"><path d="M4 5h12M4 10h12M4 15h12" stroke="currentColor" stroke-width="2"></path></svg></span><span class="mat-focus-indicator"></span><span class="mat-mdc-button-touch-target"></span><span class="mat-ripple mat-mdc-button-ripple"></span>`;
        setSafeInnerHTML(btn, svgHTML);
        createCustomTooltip(btn, getTranslation('prompt'));
        return btn;
    }

    // ---LMARENA---
    function createLmarenaButton() {
        const btn = document.createElement('button');
        btn.setAttribute('data-testid', 'composer-button-prompts');
        btn.className = 'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-2 focus-visible:ring-offset-surface-primary disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 text-interactive-active border border-border-faint bg-transparent active:text-text-tertiary touch-hitbox group/modality-button hover:text-interactive-active relative h-8 w-8 rounded-md py-2 pl-2 pr-2 transition-colors duration-150 ease-out active:transition-transform active:duration-75 hover:bg-interactive-normal/10 hover:border-interactive-normal/10';
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Prompts');
        btn.setAttribute('data-state', 'closed');
        btn.setAttribute('data-slot', 'tooltip-trigger');
        setSafeInnerHTML(btn, `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu size-4"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>`);
        createCustomTooltip(btn, getTranslation('prompt'));
        return btn;
    }

    // ---KIMI---
    function createKimiButton() {
        const styleId = 'uni-kimi-style';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `.uni-kimi-btn {display: flex; align-items: center; justify-content: center;width: 32px; height: 32px;border-radius: 8px;cursor: pointer;background: transparent;color: var(--Labels-Secondary, #666);transition: background-color 0.3s ease-in-out;}.uni-kimi-btn:hover {background-color: var(--Fills-F1, rgba(0,0,0,0.05));}.uni-kimi-btn svg { display: block; }`;
            document.head.appendChild(style);
        }
        const btn = document.createElement('div');
        btn.className = 'icon-button toolkit-trigger-btn uni-kimi-btn';
        btn.setAttribute('data-v-10d40aa8', '');
        btn.setAttribute('data-v-7f585946', '');
        btn.style.width = '32px';
        btn.style.height = '32px';
        btn.setAttribute('role', 'button');
        btn.setAttribute('data-testid', 'composer-button-prompts');
        btn.setAttribute('aria-label', getTranslation('prompts'));
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '18'); svg.setAttribute('height', '18');
        svg.setAttribute('viewBox', '0 0 20 20'); svg.setAttribute('fill', 'none');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M4 5h12M4 10h12M4 15h12');
        path.setAttribute('stroke', 'currentColor');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('stroke-linecap', 'round');
        svg.appendChild(path);
        btn.appendChild(svg);
        createCustomTooltip(btn, getTranslation('prompts'));
        return btn;
    }

    // ---CLAUDE---
    function createClaudeButton() {
        const styleId = 'uni-icon-btn-claude';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `.uni-icon-btn-claude {display: inline-flex; align-items: center; justify-content: center;box-sizing: border-box;cursor: pointer;}.uni-icon-btn-claude svg { pointer-events: none; }`;
            document.head.appendChild(style);
        }
        const btn = document.createElement('button');
        btn.className = `uni-icon-btn-claude inline-flex items-center justify-center relative shrink-0 transition-all duration-200 h-8 w-8 rounded-lg text-text-300 hover:text-text-200 hover:bg-bg-200 active:scale-95 can-focus select-none`;
        btn.setAttribute('data-testid', 'composer-button-prompts');
        btn.setAttribute('aria-label', getTranslation('prompts'));
        btn.type = 'button';
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '20');
        svg.setAttribute('height', '20');
        svg.setAttribute('viewBox', '0 0 20 20');
        svg.setAttribute('fill', 'none');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M4 5h12M4 10h12M4 15h12');
        path.setAttribute('stroke', 'currentColor');
        path.setAttribute('stroke-width', '2');
        svg.appendChild(path);
        btn.appendChild(svg);
        createCustomTooltip(btn, getTranslation('prompts'));
        return btn;
    }

    // ---GROK---
    function createGrokButton() {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('data-testid', 'composer-button-prompts');
        const btnHTML = `<svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="stroke-[2] text-primary transition-colors duration-100"><path d="M4 5h12M4 10h12M4 15h12" stroke="currentColor"></path></svg>`;
        setSafeInnerHTML(btn, btnHTML);
        createCustomTooltip(btn, getTranslation('prompts'));
        return btn;
    }

    // ---PERPLEXITY---
    function createPerplexityButton() {
        const span = document.createElement('span');
        span.innerHTML = `<button data-testid="composer-button-prompts" type="button" class="focus-visible:bg-subtle hover:bg-subtle text-quiet hover:text-foreground dark:hover:bg-subtle px-[4px] font-sans focus:outline-none outline-none outline-transparent transition duration-300 ease-out select-none items-center relative group/button font-semimedium justify-center text-center items-center rounded-lg cursor-pointer active:scale-[0.97] active:duration-150 active:ease-outExpo origin-center whitespace-nowrap inline-flex text-sm h-8 aspect-[9/8]" aria-label="Prompts"><div class="flex items-center min-w-0 gap-two justify-center"><div><div class="isolate my-xs flex items-center"><div class="flex items-center"><div class="relative flex items-center justify-center rounded-full size-5" style="z-index: 1;"><div class="flex size-5 items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="inline-flex tabler-icon"><path d="M4 6h16M4 12h16M4 18h16" /></svg></div></div></div></div></div></div></button>`;
        const innerBtn = span.querySelector('button');
        createCustomTooltip(innerBtn, getTranslation('prompts'));
        return span;
    }

    /* ---DOUBAO---
        =================================================
        特别感谢 @xiaolongmr 的贡献！
        了解他的工作：https://greasyfork.org/users/1005301
        感谢合作！🇧🇷🤝🇨🇳
        =================================================
    */
    function createDoubaoButton(variant = 'default') {
        const wrapper = document.createElement('div');
        wrapper.className = '';
        let classes = "semi-button medium-VC3b8a icon-hKywyK icon-only-BL0gii button-EWcT9p semi-button-with-icon semi-button-with-icon-only";
        let extraStyle = "";
        if (variant === 'minimal') {
            classes += " semi-button-tertiary semi-button-borderless";
            extraStyle = "color: #070707ff;";
        } else {
            classes += " semi-button-primary samantha-button-BghSMg tertiary-o1h39p";
        }
        const btnHTML = `<button tabindex="0" data-testid="composer-button-prompts" class="${classes}" type="button" aria-disabled="false" style="${extraStyle}"><span class="semi-button-content"><span role="img" class="semi-icon semi-icon-default block !text-16"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span></span></button>`;
        setSafeInnerHTML(wrapper, btnHTML);
        const btn = wrapper.querySelector('button');
        createCustomTooltip(btn, getTranslation('prompts'));
        return wrapper;
    }

    // ---BOTÃO DE AVISO DOUBAO FIREFOX---
    function createDoubaoWarningButton(variant = 'default') {
        const wrapper = document.createElement('div');
        let classes = "semi-button medium-VC3b8a icon-hKywyK icon-only-BL0gii button-EWcT9p semi-button-with-icon semi-button-with-icon-only";
        let extraStyle = "color: #f97316 !important;";
        if (variant === 'minimal') {
            classes += " semi-button-tertiary semi-button-borderless";
        } else {
            classes += " semi-button-primary samantha-button-BghSMg tertiary-o1h39p";
        }
        const btnHTML = `<button tabindex="0" data-testid="composer-button-warning" data-is-warning="true" class="${classes}" type="button" aria-disabled="false" style="${extraStyle}"><span class="semi-button-content"><span role="img" class="semi-icon semi-icon-default block !text-16"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill="currentColor" d="M19.59 15.86 12.01 1.92C11.5 1.02 10.78.5 9.99.5c-.8 0-1.52.52-2.02 1.43L.41 15.86c-.5.9-.55 1.83-.14 2.53.4.7 1.22 1.11 2.22 1.11h15.02c1 0 1.81-.4 2.22-1.1.4-.71.35-1.63-.14-2.54M10 4.86c.4 0 .72.32.72.72v6.59c0 .4-.33.73-.72.73a.7.7 0 0 1-.71-.73V5.58c0-.39.32-.72.71-.72m0 11.62c-.62 0-1.11-.5-1.11-1.14s.5-1.14 1.11-1.14 1.11.51 1.11 1.14-.5 1.14-1.11 1.14"/></svg></span></span></button>`;
        setSafeInnerHTML(wrapper, btnHTML);
        const btn = wrapper.querySelector('button');
        createCustomTooltip(btn, getTranslation('ffWarningTitle'));
        return wrapper;
    }

    // ---LONGCAT---
    function createLongCatButton() {
        const wrapper = document.createElement('div');
        wrapper.className = 'upload-button-content';
        wrapper.setAttribute('data-v-625d7fb6', '');
        wrapper.setAttribute('data-v-6f28d2aa', '');
        wrapper.setAttribute('data-v-4eeb4222-s', '');
        wrapper.style.flexShrink = '0';
        wrapper.style.cursor = 'pointer';
        const btnHTML = `<div data-v-20f31264="" data-v-625d7fb6="" class="background-mp upload-button" style="--active-color:rgba(17,25,37,0.05);"><div data-v-b0734dc6="" class="upload-file default-upload"><svg data-v-641b0c80="" data-v-b0734dc6="" class="svg-icon icon-size" aria-hidden="true" width="16px" height="16px" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"></path></svg><span data-v-b0734dc6="" class="text"></span></div><input data-v-b0734dc6="" class="upload-input" type="file" hidden=""></div>`;
        setSafeInnerHTML(wrapper, btnHTML);
        const btn = wrapper.querySelector('.background-mp');
        createCustomTooltip(btn, getTranslation('prompts'));
        return wrapper;
    }

    // ---MISTRAL---
    function createMistralButton() {
        const btn = document.createElement('button');
        btn.className = 'flex items-center justify-center text-center font-medium cursor-pointer outline-hidden focus-visible:ring-3 relative whitespace-nowrap transition-colors focus-visible:ring-default focus-visible:ring-offset-1 aria-disabled:cursor-not-allowed aria-busy:cursor-wait aria-busy:text-transparent aria-disabled:aria-busy:text-transparent text-default bg-state-secondary hover:bg-state-secondary-hover active:bg-state-secondary-press aria-busy:bg-state-secondary-loading border-darker border-[0.5px] aria-disabled:text-muted h-9 w-9 text-sm rounded-md shrink-0 gap-0 overflow-hidden p-0';
        btn.setAttribute('data-testid', 'composer-button-prompts');
        btn.type = 'button';
        const iconHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-icon-default"><path d="M4 6h16M4 12h16M4 18h16" /></svg>`;
        setSafeInnerHTML(btn, iconHTML);
        createCustomTooltip(btn, getTranslation('prompts'));
        return btn;
    }

    // ---TENCENT YUANBAO---
    function createYuanbaoButton() {
        const wrapper = document.createElement('div');
        wrapper.className = 'ybc-atomSelect-tools-wrapper';
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        const btn = document.createElement('button');
        btn.className = 'ybc-atomSelect-tools t-button t-button--theme-default t-button--variant-text';
        btn.setAttribute('type', 'button');
        btn.setAttribute('data-testid', 'composer-button-prompts');
        const iconHTML = `<svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="z-index: 1; margin-right: 4px;"><path d="M4 5h12M4 10h12M4 15h12" stroke="currentColor" stroke-width="2"></path></svg>`;
        const textHTML = `<span class="t-button__text" style="z-index: 1;">${getTranslation('prompts')}</span>`;
        setSafeInnerHTML(btn, iconHTML + textHTML);
        wrapper.appendChild(btn);
        return wrapper;
    }

    // ---CHATGLM---
    function createChatGLMButton(type) {
        const wrapper = document.createElement('div');
        wrapper.setAttribute('data-testid', 'composer-button-prompts');
        wrapper.style.cursor = 'pointer';
        const mySvg = `<svg class="model-select-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 20 20" style="z-index: 10; height: 24px;"><path d="M4 5h12M4 10h12M4 15h12" stroke="var(--txt_icon_black_1)" stroke-width="2" fill="none"></path></svg>`;
        let innerHTML = '';
        if (type === 'element1') {
            wrapper.setAttribute('data-v-7dc2591c', '');
            wrapper.setAttribute('data-v-b023d9fa', '');
            wrapper.className = 'prompt-item dark el-tooltip__trigger el-tooltip__trigger';
            innerHTML = mySvg;
        } else if (type === 'element2') {
            wrapper.setAttribute('data-v-7a34b085', '');
            wrapper.className = 'prompt-item el-tooltip__trigger el-tooltip__trigger';
            innerHTML = mySvg;
        } else {
            wrapper.setAttribute('data-v-5170ca64', '');
            wrapper.setAttribute('data-v-b023d9fa', '');
            wrapper.className = 'model-select-container flex flex-y-center flex-x-center';
            innerHTML = `<span data-v-5170ca64="" class="el-tooltip__trigger"><div data-v-5170ca64="" class="model-select-icon-container flex flex-y-center flex-x-center animate-glide el-tooltip__trigger el-tooltip__trigger">${mySvg}</div></span>`;
        }
        setSafeInnerHTML(wrapper, innerHTML);
        createCustomTooltip(wrapper, getTranslation('prompts'));
        return wrapper;
    }

    // ---POE---
    function createPoeButton() {
        const wrapper = document.createElement('div');
        const btnHTML = `<button class="button_root__TL8nv button_ghost__YsMI5 button_sm__hWzjK button_center__RsQ_o button_showIconOnly-always__05Gb5" type="button" aria-label="${getTranslation('prompts')}" data-theme="ghost"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" style="height: 20px; width: 20px; display: block; flex: 0 0 auto;"><path d="M5 5h14M5 12h14M5 19h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg><span class="button_label__mCaDf"></span></button>`;
        setSafeInnerHTML(wrapper, btnHTML);
        const btn = wrapper.querySelector('button');
        createCustomTooltip(btn, getTranslation('prompts'));
        return wrapper;
    }

    // ---GOOGLE MODO IA---
    function createGoogleModoIAButton() {
        const btn = document.createElement('button');
        btn.setAttribute('tabindex', '0');
        btn.className = 'uMMzHc';
        btn.setAttribute('aria-label', getTranslation('prompts'));
        btn.setAttribute('data-testid', 'composer-button-prompts');
        btn.setAttribute('type', 'button');
        const divWilSz = document.createElement('div');
        divWilSz.className = 'wilSz';
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add('EQxvpc', 'wffbD');
        svg.setAttribute('fill', 'currentColor');
        svg.setAttribute('viewBox', '0 -960 960 960');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M120-200v-60h720v60H120Zm0-240v-60h720v60H120Zm0-240v-60h720v60H120Z');
        svg.appendChild(path);
        divWilSz.appendChild(svg);
        const divTXv1xf = document.createElement('div');
        divTXv1xf.className = 'TXv1xf';
        btn.appendChild(divWilSz);
        btn.appendChild(divTXv1xf);
        createCustomTooltip(btn, getTranslation('prompts'));
        return btn;
    }

    // ---NOTEBOOKLM---
    function createNotebookLMButton() {
        const btn = document.createElement('button');
        btn.setAttribute('mat-icon-button', '');
        btn.setAttribute('appearance', 'fill');
        btn.setAttribute('type', 'button');
        btn.setAttribute('aria-label', 'Prompts');
        btn.className = 'mdc-icon-button mat-mdc-icon-button mat-mdc-button-base prompts-button mat-unthemed';
        btn.setAttribute('data-testid', 'composer-button-prompts');
        const icon = document.createElement('mat-icon');
        icon.setAttribute('role', 'img');
        icon.setAttribute('aria-hidden', 'true');
        icon.className = 'mat-icon notranslate mat-icon-rtl-mirror google-symbols mat-icon-no-color';
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('width', '24');
        svg.setAttribute('height', '24');
        svg.setAttribute('viewBox', '0 0 20 20');
        svg.setAttribute('fill', 'currentColor');
        setSafeInnerHTML(svg, `<path d="M4 5h12M4 10h12M4 15h12" stroke="currentColor" stroke-width="2" fill="none"/>`);
        icon.appendChild(svg);
        btn.appendChild(icon);
        createCustomTooltip(btn, getTranslation('prompts'));
        return btn;
    }
    // #endregion BOTÕES DE PROMPT
    // #region MENUS E MODAIS
    // ---PROMPT DINÂMICO PT1---
    function parsePromptInternal(rawText) {
        if (!rawText) return { processedText: '', ignoreMap: new Map(), selectMap: new Map(), inputMap: new Map() };
        let processedText = rawText;
        const ignoreMap   = new Map();
        const selectMap   = new Map();
        const inputMap    = new Map();
        let ignoreCounter = 0;
        let selectCounter = 0;
        let inputCounter  = 0;
        const cleanFenceContent = (content) => {
            if (!content) return '';
            let c = content.replace(/^[ \t]*\r?\n/, '');
            c = c.replace(/\r?\n[ \t]*$/, '');
            return c;
        };
        const blockFenceRegex = /([ \t]*)(#+)ignore[ \t]*(?:\r?\n)?([\s\S]*?)(?:\r?\n)?[ \t]*\2end/g;
        processedText = processedText.replace(blockFenceRegex, (_match, _whitespace, _hashes, content) => {
            const key = `__IGNORE_BLK_${ignoreCounter++}__`;
            ignoreMap.set(key, content);
            return key;
        });
        const valueFenceRegex = /('{2,})((?:(?!\1)[\s\S])*)\1/g;
        processedText = processedText.replace(valueFenceRegex, (_match, _quoteSequence, content) => {
            const key = `__QUOTE_${ignoreCounter++}__`;
            ignoreMap.set(key, content);
            return key;
        });
        processedText = processedText.replace(/\\([#\[\]])/g, (_match, char) => {
            const key = `__ESC_CHAR_${ignoreCounter++}__`;
            ignoreMap.set(key, char);
            return key;
        });
        const regionRegex = /#start([\s\S]*?)#end/g;
        processedText = processedText.replace(regionRegex, (_match, body) => {
            const key = `__SELECT_${selectCounter++}__`;
            const options = [];
            let currentOption = null;
            const tokenRegex = /(?:^\s*#\s*(?!start|end)(.*)$)|(?:^\s*([+\-]|\d+)\s*\[([^\]]*)\])|(?:(__QUOTE_\d+__)|'([^'\\]*(?:\\.[^'\\]*)*)')/gm;
            let m;
            while ((m = tokenRegex.exec(body)) !== null) {
                if (m[1]) {
                    const label = m[1].trim();
                    if (label) {
                        options.push({ type: 'header', label: label });
                        currentOption = null;
                    }
                }
                else if (m[2]) {
                    const prefix  = m[2];
                    const label   = m[3];
                    let type      = prefix === '+' ? 'multi' : (prefix === '-' ? 'sovereign' : 'id');
                    let id        = (type === 'id') ? prefix : null;
                    currentOption = { label, value: label, type, id };
                    options.push(currentOption);
                }
                else if (currentOption) {
                    if (m[4]) {
                        const quoteKey = m[4];
                        if (ignoreMap.has(quoteKey)) {
                            currentOption.value = cleanFenceContent(ignoreMap.get(quoteKey));
                        }
                    }
                    else if (m[5] !== undefined) {
                        let val = m[5];
                        val     = cleanFenceContent(val);
                        val     = val.replace(/\\'/g, "'");
                        currentOption.value = val;
                    }
                }
            }
            selectMap.set(key, { title: (typeof getTranslation !== 'undefined' ? getTranslation('select') : 'Select'), options });
            return key;
        });
        processedText = processedText.replace(/\[([^\]=]+?)\s*=\s*(\$[a-zA-Z0-9_]+)\](?:\(([^)]*)\))?/g, (match, label, varName, comment, _offset, _fullString) => {
            if (label.startsWith('__') && label.endsWith('__')) return match;
            const key = `__INPUT_${inputCounter++}__`;
            let finalContext = comment ? comment : '';
            inputMap.set(key, { label: label.trim(), varName: varName.trim(), context: finalContext });
            return key;
        });
        processedText = processedText.replace(/\[([^\]]+?)\](?:\(([^)]*)\))?/g, (match, label, comment, _offset, _fullString) => {
            if (label.startsWith('__') && label.endsWith('__')) return match;
            if (inputMap.has(match)) return match;
            const key = `__INPUT_${inputCounter++}__`;
            let finalContext = comment ? comment : '';
            inputMap.set(key, { label: label.trim(), varName: null, context: finalContext });
            return key;
        });
        return { processedText, ignoreMap, selectMap, inputMap };
    }

    // ---CRIAR MENU DE PROMPT---
    function createPromptMenu() {
        const menu = document.createElement('div');
        menu.className = 'prompt-menu';
        menu.id = 'prompt-menu-container';
        return menu;
    }

    // ---CRIAR MODAL DE EDITAR/CRIAR PROMPT---
    function createPromptModal() {
        const overlay      = document.createElement('div');
        overlay.className  = 'mp-overlay mp-hidden';
        overlay.id         = '__ap_modal_overlay';
        const box          = document.createElement('div');
        box.className      = 'mp-modal-box';
        box.id             = '__ap_modal_box_el';
        box.style.cssText  = 'overflow-y: auto; padding-bottom: 24px;';
        box.onclick        = e => e.stopPropagation();
        const iconExpand   = `<svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>`;
        const iconCollapse = `<svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>`;
        const iconFolder   = `<svg style="width:16px;height:16px;margin-right:8px;vertical-align:text-bottom;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`;
        const iconChevron  = `<svg class="mp-acc-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6"/></svg>`;
        const iconPlus     = `<svg class="mp-add-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
        setSafeInnerHTML(box, `
            <button id="__ap_expand_btn" class="mp-modal-expand-btn" title="${getTranslation('expand')}">${iconExpand}</button>
            <button id="__ap_info_btn" class="mp-modal-info-btn" title="${getTranslation('infoTitle')}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 14a6 6 0 1 1 0-12 6 6 0 0 1 0 12ZM9 5h2v2H9V5Zm0 4h2v6H9V9Z"/></svg></button>
            <button id="__ap_close_prompt" class="mp-modal-close-btn" title="${getTranslation('close')}"><svg viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg></button>
            <h2 class="modal-title" style="flex-shrink:0;">${getTranslation('newPrompt')}</h2>
            <div class="form-group" style="flex-shrink:0;">
                <label for="__ap_title" class="form-label">${getTranslation('title')}</label>
                <input id="__ap_title" class="form-input" />
            </div>
            <div class="form-group" style="height: 300px; flex-shrink: 0; display: flex; flex-direction: column;">
                <label for="__ap_text" class="form-label">${getTranslation('text')}</label>
                <textarea id="__ap_text" class="form-textarea" spellcheck="false" style="height:100% !important; resize:none;"></textarea>
            </div>
            <div class="mp-files-accordion" id="__ap_accordion">
                <div class="mp-accordion-header" id="__ap_files_header">
                    <div style="display:flex;align-items:center;">
                        ${iconFolder}
                        <span id="__ap_files_label">${getTranslation('filesLabel')}</span>
                    </div>
                    ${iconChevron}
                </div>
                <div class="mp-accordion-content" id="__ap_files_content">
                    <div id="__ap_file_scroll_wrapper" class="mp-file-scroll-wrapper">
                        <div id="__ap_file_grid" class="mp-file-grid"></div>
                    </div>
                    <input type="file" id="__ap_file_input" multiple style="display:none">
                </div>
            </div>
            <div class="mp-switch-container" style="flex-shrink:0;">
                <div class="mp-switch">
                    <input type="checkbox" id="__ap_use_placeholders" />
                    <label for="__ap_use_placeholders">Toggle</label>
                    <span class="switch-text" onclick="document.getElementById('__ap_use_placeholders').click()">${getTranslation('enablePlaceholders')}</span>
                </div>
                <div class="mp-switch">
                    <input type="checkbox" id="__ap_auto_execute" />
                    <label for="__ap_auto_execute">Toggle</label>
                    <span class="switch-text" onclick="document.getElementById('__ap_auto_execute').click()">${getTranslation('autoExecute')}</span>
                </div>
            </div>
            <div class="modal-footer" style="flex-shrink:0; margin-top: auto;">
                <button id="__ap_save" class="save-button">${getTranslation('save')}</button>
            </div>
        `);
        overlay.appendChild(box);
        const textarea = box.querySelector('#__ap_text');
        const fileScrollWrapper = box.querySelector('#__ap_file_scroll_wrapper');
        setTimeout(() => {
            const textWrapper = setupEnhancedScroll(textarea, null, 'var(--mp-border-radius-md)');
            if (textWrapper) textWrapper.classList.add('prompt-editor-scroll-wrapper');
            setupEnhancedScroll(fileScrollWrapper, null, '0');
        }, 0);
        const accordion = box.querySelector('#__ap_accordion');
        const accHeader = box.querySelector('#__ap_files_header');
        const accContent = box.querySelector('#__ap_files_content');
        accHeader.onclick = () => {
            const isOpen = accContent.classList.toggle('open');
            accordion.classList.toggle('open');
            if (isOpen && fileScrollWrapper.updateScrollArrows) {
                setTimeout(() => fileScrollWrapper.updateScrollArrows(), 50);
            }
        };
        const fileInput = box.querySelector('#__ap_file_input');
        const grid = box.querySelector('#__ap_file_grid');
        const label = box.querySelector('#__ap_files_label');
        box.renderGlobalFiles = async () => {
            const files = await getGlobalFiles();
            setSafeInnerHTML(grid, '');
            let activeCount = 0;
            files.forEach(f => { if(currentActiveFileIds.has(f.id)) activeCount++; });
            label.textContent = getTranslation('filesCounter')
                .replace('{active}', activeCount)
                .replace('{total}', files.length);
            const addCard = document.createElement('div');
            addCard.className = 'mp-add-file-card';
            addCard.title = getTranslation('addCardTitle');
            setSafeInnerHTML(addCard, iconPlus);
            addCard.onclick = () => fileInput.click();
            grid.appendChild(addCard);
            files.forEach(file => {
                const isActive = currentActiveFileIds.has(file.id);
                const card = document.createElement('div');
                card.className = `mp-file-card ${isActive ? 'active' : 'inactive'}`;
                card.title = file.name;
                card.onclick = () => {
                    if (currentActiveFileIds.has(file.id)) currentActiveFileIds.delete(file.id);
                    else currentActiveFileIds.add(file.id);
                    box.renderGlobalFiles();
                };
                const delBtn = document.createElement('div');
                delBtn.className = 'mp-file-delete-perm';
                delBtn.textContent = '✕';
                delBtn.onclick = async (e) => {
                    e.stopPropagation();
                    if(confirm(getTranslation('confirmDeleteFile'))) {
                        await deleteGlobalFile(file.id);
                        currentActiveFileIds.delete(file.id);
                        box.renderGlobalFiles();
                    }
                };
                let previewHtml = '';
                if (file.type.startsWith('image/')) previewHtml = `<img src="${file.data}" class="mp-file-thumb">`;
                else previewHtml = `<svg class="mp-file-icon-gen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 28"><path d="m16.5 0 7 7v15.6c0 2.25 0 3.38-.57 4.16a3 3 0 0 1-.67.67c-.79.57-1.91.57-4.16.57H5.9c-2.25 0-3.37 0-4.16-.57a3 3 0 0 1-.67-.67C.5 25.97.5 24.85.5 22.6V5.4c0-2.25 0-3.38.57-4.16a3 3 0 0 1 .67-.67C2.52 0 3.65 0 5.9 0z" fill="url(#a)"/><path d="m16.5 0 7 7h-3.8c-1.12 0-1.68 0-2.1-.22a2 2 0 0 1-.88-.87c-.22-.43-.22-.99-.22-2.11z" fill="#fff" fill-opacity=".55"/><path d="M6 11.78c0-.43.35-.78.78-.78h10.44a.78.78 0 1 1 0 1.57H6.78a.8.8 0 0 1-.78-.79m0 4c0-.43.35-.78.78-.78h10.44a.78.78 0 1 1 0 1.57H6.78a.8.8 0 0 1-.78-.79m.11 4.04c0-.44.35-.79.79-.79h6.32a.78.78 0 1 1 0 1.57H6.9a.8.8 0 0 1-.79-.78" fill="#fff"/><defs><linearGradient id="a" x1="1.5" y1="-1" x2="23.5" y2="28" gradientUnits="userSpaceOnUse"><stop stop-color="#7071fc"/><stop offset="1" stop-color="#595ac9"/></linearGradient></defs></svg>`;
                setSafeInnerHTML(card, previewHtml);
                card.appendChild(delBtn);
                grid.appendChild(card);
            });
            if (fileScrollWrapper.updateScrollArrows) {
                setTimeout(() => fileScrollWrapper.updateScrollArrows(), 50);
            }
        };
        fileScrollWrapper.ondragover = (e) => { e.preventDefault(); };
        fileScrollWrapper.ondrop = async (e) => {
            e.preventDefault();
            handleNewFiles(e.dataTransfer.files);
        };
        fileInput.onchange = (e) => handleNewFiles(e.target.files);
        async function handleNewFiles(fileList) {
            for (const file of fileList) {
                if (file.size > 5 * 1024 * 1024) {
                    const fileSizeMB = (file.size / 1024 / 1024).toFixed(1);
                    if (!confirm(getTranslation('confirmLargeFile').replace('{fileSizeMB}', fileSizeMB))) { continue; }
                }
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const newFile = {
                        id: Date.now() + Math.random().toString(36).substr(2, 9),
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        data: e.target.result
                    };
                    await saveGlobalFile(newFile);
                    currentActiveFileIds.add(newFile.id);
                    if (box.renderGlobalFiles) {
                         if (!accContent.classList.contains('open')) {
                             accContent.classList.add('open');
                             accordion.classList.add('open');
                         }
                         box.renderGlobalFiles();
                    }
                };
                reader.readAsDataURL(file);
            }
        }
        const expandBtn = box.querySelector('#__ap_expand_btn');
        let isExpanded = false;
        expandBtn.onclick = (e) => {
            e.stopPropagation();
            isExpanded = !isExpanded;
            if (isExpanded) {
                box.classList.add('mp-expanded');
                setSafeInnerHTML(expandBtn, iconCollapse);
            } else {
                box.classList.remove('mp-expanded');
                setSafeInnerHTML(expandBtn, iconExpand);
            }
            setTimeout(() => { if (textarea.updateScrollArrows) textarea.updateScrollArrows(); }, 350);
        };
        return overlay;
    }

    // ---CRIAR MODAL DE INFORMAÇÕES---
    function createInfoModal() {
        const overlay     = document.createElement('div');
        overlay.className = 'mp-overlay mp-hidden';
        overlay.id        = '__ap_info_modal_overlay';
        const box         = document.createElement('div');
        box.className     = 'mp-modal-box';
        box.onclick       = e => e.stopPropagation();
        const modalContentHTML = `
            <button id="__ap_close_info" class="mp-modal-close-btn" aria-label="${getTranslation('close')}"><svg viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg></button>
            <h2 class="modal-title">${getTranslation('infoTitle')}</h2>
            <div class="mp-info-table">
                <div class="mp-info-row">
                    <div class="mp-info-col">
                        <h3>${getTranslation('enablePlaceholders')}</h3>
                    </div>
                    <div class="mp-info-col">
                        <h3>${getTranslation('autoExecute')}</h3>
                    </div>
                </div>
                <div class="mp-info-row">
                    <div class="mp-info-col">
                        <p>${getTranslation('infoDPDesc')}</p>
                    </div>
                    <div class="mp-info-col">
                        <p>${getTranslation('infoASDesc')}</p>
                    </div>
                </div>
            </div>
        `;
        setSafeInnerHTML(box, modalContentHTML);
        overlay.appendChild(box);
        return overlay;
    }

    // ---MENU DE SELEÇÃO DE IDIOMA---
    function createLanguageModal() {
        const overlay = document.createElement('div');
        overlay.className = 'mp-overlay mp-hidden lang-overlay';
        overlay.id = '__ap_lang_modal_overlay';
        overlay.onclick = () => hideModal(overlay);
        const box = document.createElement('div');
        box.className = 'mp-modal-box lang-box';
        box.onclick = (e) => e.stopPropagation();
        const searchInput = document.createElement('input');
        searchInput.className = 'lang-search-input';
        searchInput.placeholder = (typeof getTranslation === 'function' && translations[currentLang]?.searchLanguage)
            ? getTranslation('searchLanguage')
            : 'Search language...';
        searchInput.type = 'text';
        searchInput.autocomplete = 'off';
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.flexDirection = 'column';
        buttonsContainer.style.gap = '8px';
        buttonsContainer.style.maxHeight = '400px';
        function renderButtons(filterText = '') {
            setSafeInnerHTML(buttonsContainer, '');
            const term = filterText.toLowerCase();
            Object.keys(translations).forEach((langKey, index) => {
                const langName = translations[langKey].langName;
                if (term && !langName.toLowerCase().includes(term)) return;
                const btn = document.createElement('button');
                btn.className = 'lang-button';
                btn.textContent = langName;
                if (langKey === currentLang) btn.classList.add('selected');
                btn.style.animation = `mp-fade-in-up .3s ease forwards`;
                btn.style.animationDelay = `${Math.min(index * 30, 200)}ms`;
                btn.style.opacity = '0';
                btn.onclick = async () => {
                    await GM_setValue(LANG_STORAGE_KEY, langKey);
                    window.location.reload();
                };
                buttonsContainer.appendChild(btn);
            });
        }
        renderButtons();
        searchInput.oninput = (e) => renderButtons(e.target.value);
        box.appendChild(searchInput);
        box.appendChild(buttonsContainer);
        setupEnhancedScroll(buttonsContainer);
        overlay.appendChild(box);
        const observer = new MutationObserver(() => {
            if (overlay.classList.contains('visible')) {
                setTimeout(() => searchInput.focus(), 50);
            }
        });
        observer.observe(overlay, { attributes: true, attributeFilter: ['class'] });
        return overlay;
    }

    function showModal(modal) {
        if (!modal) return;
        modal.classList.remove('mp-hidden');
        setTimeout(() => modal.classList.add('visible'), 10);
    }

    function hideModal(modal) {
        if (!modal) return;
        modal.classList.remove('visible');
        setTimeout(() => modal.classList.add('mp-hidden'), 200);
    }

    // ---ABRIR MODAL DE EDITAR/CRIAR PROMPT---
    function openPromptModal(item = null, index = -1) {
        if (!currentModal) return;
        const isEditing                                          = !!item;
        currentModal.dataset.index                               = index;
        currentModal.querySelector('.modal-title').textContent   = isEditing ? getTranslation('editPrompt') : getTranslation('newPrompt');
        document.getElementById('__ap_title').value              = item?.title || '';
        document.getElementById('__ap_text').value               = item?.text || '';
        document.getElementById('__ap_use_placeholders').checked = item?.usePlaceholders || false;
        document.getElementById('__ap_auto_execute').checked     = item?.autoExecute || false;
        currentActiveFileIds                                     = new Set(item?.activeFileIds || []);
        const box = currentModal.querySelector('.mp-modal-box');
        if (box && box.renderGlobalFiles) {
            box.renderGlobalFiles();
        }
        showModal(currentModal);
        setTimeout(() => document.getElementById('__ap_title').focus(), 100);
    }

    // ---CRIAR MODAL DE PROMPT DINÂMICO---
    function createPlaceholderModal() {
        const overlay          = document.createElement('div');
        overlay.className      = 'mp-overlay mp-hidden';
        overlay.id             = '__ap_placeholder_modal_overlay';
        const box              = document.createElement('div');
        box.className          = 'mp-modal-box';
        box.onclick            = e => e.stopPropagation();
        const iconExpand       = `<svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>`;
        const iconCollapse     = `<svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>`;
        const modalContentHTML = `
            <button id="__ap_ph_expand_btn" class="mp-modal-expand-btn" title="${getTranslation('expand')}">${iconExpand}</button>
            <button id="__ap_close_placeholder" class="mp-modal-close-btn" aria-label="${getTranslation('close')}"><svg viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg></button>
            <h2 class="modal-title">${getTranslation('fillPlaceholders')}</h2>
            <div id="__ap_placeholders_container"></div>
            <div class="modal-footer">
                <button id="__ap_insert_prompt" class="save-button">${getTranslation('insert')}</button>
            </div>
        `;
        setSafeInnerHTML(box, modalContentHTML);
        overlay.appendChild(box);
        const container = box.querySelector('#__ap_placeholders_container');
        container.style.maxHeight = '350px';
        setupEnhancedScroll(container);
        const expandBtn = box.querySelector('#__ap_ph_expand_btn');
        let isExpanded = false;
        expandBtn.onclick = (e) => {
            e.stopPropagation();
            isExpanded = !isExpanded;
            if (isExpanded) {
                box.classList.add('mp-expanded');
                setSafeInnerHTML(expandBtn, iconCollapse);
                expandBtn.title = getTranslation('collapse');
            } else {
                box.classList.remove('mp-expanded');
                setSafeInnerHTML(expandBtn, iconExpand);
                expandBtn.title = getTranslation('expand');
            }
            setTimeout(() => {
                if (container.updateScrollArrows) container.updateScrollArrows();
            }, 350);
        };

        return overlay;
    }

    // ---AVISO FIREFOX DOUBAO---
    function createFirefoxWarningModal() {
        const overlay     = document.createElement('div');
        overlay.className = 'mp-overlay';
        overlay.id        = '__ap_warning_modal_overlay';
        const box         = document.createElement('div');
        box.className     = 'mp-modal-box';
        box.onclick       = e => e.stopPropagation();
        const modalContentHTML = `<button id="__ap_close_warning" class="mp-modal-close-btn" aria-label="${getTranslation('close')}"><svg viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg></button><div style="display: flex; flex-direction: column; align-items: center; gap: 15px; text-align: center; padding-top: 10px;"><p style="font-size: 0.95rem; color: var(--text-primary, inherit); opacity: 0.9;">${getTranslation('ffWarningText')}</p><p style="font-size: 0.9rem; background: rgba(249, 115, 22, 0.1); padding: 10px; border-radius: 6px; border: 1px solid rgba(249, 115, 22, 0.2);">${getTranslation('ffRecommend')}</p></div><div class="modal-footer" style="margin-top: 20px;"><button id="__ap_dismiss_forever" class="save-button" style="width: 100%; background-color: rgba(128, 128, 128, 0.51);">${getTranslation('dontShowAgain')}</button></div>`;
        setSafeInnerHTML(box, modalContentHTML);
        overlay.appendChild(box);
        const closeBtn   = box.querySelector('#__ap_close_warning');
        const dismissBtn = box.querySelector('#__ap_dismiss_forever');
        const close      = () => hideModal(overlay);
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            close();
        };
        dismissBtn.onclick = async (e) => {
            e.stopPropagation();
            await GM_setValue('doubaoffwarning', true);
            const currentWarningBtn = document.querySelector('button[data-is-warning="true"]');
            if (currentWarningBtn) {
                const wrapper = currentWarningBtn.closest('div');
                if (wrapper) wrapper.remove();
            }
            close();
        };
        return overlay;
    }
    // #endregion MENUS E MODAIS
    // #region FUNÇÕES AUXILIARES
    // --- FUNÇÃO HELPER PARA SCROLL COM SETAS ---
    function setupEnhancedScroll(scrollContainer, customBgVariable = null, borderRadius = null) {
        if (!scrollContainer) return;
        const computedStyle = window.getComputedStyle(scrollContainer);
        const marginBottom = computedStyle.marginBottom;
        const marginTop = computedStyle.marginTop;
        scrollContainer.classList.add('mp-scroll-invisible');
        const wrapper = document.createElement('div');
        wrapper.className = 'mp-scroll-wrapper';
        if (customBgVariable) wrapper.style.setProperty('--scroll-bg', customBgVariable);
        if (borderRadius) wrapper.style.borderRadius = borderRadius;
        wrapper.style.marginBottom = marginBottom;
        wrapper.style.marginTop = marginTop;
        scrollContainer.style.marginBottom = '0';
        scrollContainer.style.marginTop = '0';
        scrollContainer.parentNode.insertBefore(wrapper, scrollContainer);
        wrapper.appendChild(scrollContainer);
        const createArrow = (cls) => {
            const arr = document.createElement('div');
            arr.className = `mp-scroll-arrow ${cls}`;
            setSafeInnerHTML(arr, cls === 'up'
                ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 16"><path fill="currentColor" fill-rule="evenodd" d="M15.81 9.9a1 1 0 0 1-.65-.2L8.93 5.54 2.9 9.74a1.2 1.2 0 0 1-1.63-.33 1.17 1.17 0 0 1 .32-1.63l6.69-4.63a1.2 1.2 0 0 1 1.3 0l6.88 4.59a1.18 1.18 0 0 1-.65 2.16"/></svg>`
                : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17"><path fill="currentColor" fill-rule="evenodd" d="M2.16 6.246c.225 0 .45.062.65.196l6.229 4.156 6.037-4.197a1.175 1.175 0 0 1 1.304 1.958l-6.688 4.63a1.17 1.17 0 0 1-1.304.002l-6.88-4.589a1.178 1.178 0 0 1 .652-2.156"/></svg>`);
            return arr;
        };
        const arrowUp = createArrow('up');
        const arrowDown = createArrow('down');
        wrapper.appendChild(arrowUp);
        wrapper.appendChild(arrowDown);
        const updateArrows = () => {
            const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
            if (scrollTop > 1) arrowUp.classList.add('visible');
            else arrowUp.classList.remove('visible');
            if (scrollHeight - scrollTop - clientHeight > 1) arrowDown.classList.add('visible');
            else arrowDown.classList.remove('visible');
        };
        arrowUp.onclick = (e) => { e.stopPropagation(); scrollContainer.scrollBy({ top: -100, behavior: 'smooth' }); };
        arrowDown.onclick = (e) => { e.stopPropagation(); scrollContainer.scrollBy({ top: 100, behavior: 'smooth' }); };
        scrollContainer.addEventListener('scroll', updateArrows);
        const obs = new MutationObserver(updateArrows);
        obs.observe(scrollContainer, { childList: true, subtree: true });
        const resizeObs = new ResizeObserver(updateArrows);
        resizeObs.observe(scrollContainer);
        scrollContainer.updateScrollArrows = updateArrows;
        setTimeout(updateArrows, 0);
        return wrapper;
    }

    // ---MOVER CURSOR PARA O FIM DO CAMPO DE TEXTO---
    function moveCursorToEnd(editor) {
        setTimeout(() => {
            try {
                editor.focus();
                // --- GEMINI ---
                if (currentPlatform === 'gemini') {
                    const selection = window.getSelection();
                    const range = document.createRange();
                    range.selectNodeContents(editor);
                    range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    editor.scrollTop = editor.scrollHeight;
                }
                // --- MISTRAL ---
                else if (currentPlatform === 'mistral') {
                    const selection = window.getSelection();
                    const range = document.createRange();
                    range.selectNodeContents(editor);
                    range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    let scrollContainer = editor.parentElement;
                    let i = 0;
                    while (scrollContainer && i < 10) {
                        if (scrollContainer.scrollHeight > scrollContainer.clientHeight) {
                            scrollContainer.scrollTop = scrollContainer.scrollHeight;
                        }
                        scrollContainer = scrollContainer.parentElement;
                        i++;
                    }
                }
                // --- CHATGPT / CLAUDE / GROK ---
                else if (currentPlatform === 'chatgpt' || currentPlatform === 'claude' || currentPlatform === 'grok') {
                    const selection = window.getSelection();
                    const range = document.createRange();
                    range.selectNodeContents(editor);
                    range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    if (currentPlatform === 'grok') {
                        editor.scrollTop = editor.scrollHeight;
                    } else {
                        const scrollContainer = editor.parentElement;
                        if (scrollContainer) {
                            scrollContainer.scrollTop = scrollContainer.scrollHeight;
                        }
                    }
                }
                // --- GOOGLE AI STUDIO / GOOGLE MODO IA ---
                else if (currentPlatform === 'googleaistudio' || currentPlatform === 'googleModoIA') {
                    const textLength = editor.value.length;
                    editor.setSelectionRange(textLength, textLength);
                    editor.scrollTop = editor.scrollHeight;
                    editor.blur();
                    editor.focus();
                    editor.setSelectionRange(textLength, textLength);
                }
                // --- PADRÃO ---
                else {
                    const textLength = editor.value.length;
                    if (editor.setSelectionRange) {
                        editor.setSelectionRange(textLength, textLength);
                    } else {
                        editor.selectionStart = editor.selectionEnd = textLength;
                    }
                    editor.scrollTop = editor.scrollHeight;
                }
            } catch (e) {}
        }, 10);
    }

    // ---FECHAR MENU---
    function closeMenu() {
        if (currentMenu && currentMenu.classList.contains('visible')) {
            currentMenu.classList.remove('visible');
        }
    }

    // ---POSICIONAR MENU---
    function positionMenu(menu, button) {
        const btnRect = button.getBoundingClientRect();
        const menuHeight = menu.offsetHeight;
        const menuWidth = menu.offsetWidth;
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const margin = 8;
        let top, left;
        const spaceBelow = viewportHeight - btnRect.bottom - margin;
        const spaceAbove = btnRect.top - margin;
        if (spaceBelow >= menuHeight) {
            top = btnRect.bottom + margin;
        } else if (spaceAbove >= menuHeight) {
            top = btnRect.top - menuHeight - margin;
        } else {
            top = Math.max(margin, viewportHeight - menuHeight - margin);
        }
        const spaceRight = viewportWidth - btnRect.left - margin;
        const spaceLeft = btnRect.right - margin;
        if (spaceRight >= menuWidth) {
            left = btnRect.left;
        } else if (spaceLeft >= menuWidth) {
            left = btnRect.right - menuWidth;
        } else {
            left = (viewportWidth - menuWidth) / 2;
        }
        menu.style.top  = `${Math.max(margin, Math.min(top, viewportHeight - menuHeight - margin))}px`;
        menu.style.left = `${Math.max(margin, Math.min(left, viewportWidth - menuWidth - margin))}px`;
    }

    // ---ATUALIZAR MENU DE PROMPTS---
    async function refreshMenu() {
        if (!currentMenu) return;
        setSafeInnerHTML(currentMenu, '');
        // ---BUSCA---
        const searchContainer = document.createElement('div');
        searchContainer.className = 'menu-search-container';
        const searchInput = document.createElement('input');
        searchInput.className = 'menu-search-input';
        searchInput.placeholder = getTranslation('search');
        searchInput.type = 'text';
        searchInput.autocomplete = 'off';
        searchInput.onclick = (e) => e.stopPropagation();
        searchInput.onkeydown = (e) => e.stopPropagation();
        searchContainer.appendChild(searchInput);
        currentMenu.appendChild(searchContainer);
        // ---LISTA---
        const listContainer = document.createElement('div');
        listContainer.className = 'prompt-menu-list';
        listContainer.id = 'prompt-menu-list-el';
        const items = await getAll();
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.textContent = getTranslation('noSavedPrompts');
        if (items.length === 0) {
            listContainer.appendChild(emptyState);
        } else {
            emptyState.style.display = 'none';
            emptyState.textContent = getTranslation('noSearchResults');
            listContainer.appendChild(emptyState);
            items.forEach((p, index) => {
                const row = document.createElement('div');
                row.className = 'prompt-item-row';
                row.dataset.searchText = (p.title + ' ' + p.text).toLowerCase();
                const titleDiv = document.createElement('div');
                titleDiv.className = 'prompt-title';
                titleDiv.textContent = p.title;
                titleDiv.onclick = (e) => {
                    e.stopPropagation();
                    if (currentPlaceholderModal) currentPlaceholderModal.dataset.fromInline = "false";
                    if (p.usePlaceholders) openPlaceholderModal(p, index);
                    else insertPrompt(p, index);
                    closeMenu();
                };
                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'prompt-actions';
                const createBtn = (cls, icon, title, clickFn) => {
                    const b = document.createElement('button');
                    b.className = `action-btn ${cls}`;
                    b.title = title;
                    setSafeInnerHTML(b, icon);
                    b.onclick = clickFn;
                    return b;
                };
                // ---EDITAR/DELETAR---
                const btnE = createBtn('edit',   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 416 432"><path fill="currentColor" d="m366 237 45 35q7 6 3 14l-43 74q-4 8-13 4l-53-21q-18 13-36 21l-8 56q-1 9-11 9h-85q-9 0-11-9l-8-56q-19-8-36-21l-53 21q-9 3-13-4L1 286q-4-8 3-14l45-35q-1-12-1-21t1-21L4 160q-7-6-3-14l43-74q5-8 13-4l53 21q18-13 36-21l8-56q2-9 11-9h85q10 0 11 9l8 56q19 8 36 21l53-21q9-3 13 4l43 74q4 8-3 14l-45 35q2 12 2 21t-2 21m-158.5 54q30.5 0 52.5-22t22-53-22-53-52.5-22-52.5 22-22 53 22 53 52.5 22"/></svg>`, getTranslation('edit'), (e) => { e.stopPropagation(); openPromptModal(p, index); });
                const btnD = createBtn('delete', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 304 384"><path fill="currentColor" d="M21 341V85h256v256q0 18-12.5 30.5T235 384H64q-18 0-30.5-12.5T21 341M299 21v43H0V21h75L96 0h107l21 21z"/></svg>`, getTranslation('delete'), (e) => { e.stopPropagation(); if (confirm(getTranslation('confirmDelete', { title: p.title }))) remove(index).then(refreshMenu); });
                actionsDiv.appendChild(btnE);
                actionsDiv.appendChild(btnD);
                row.appendChild(titleDiv);
                row.appendChild(actionsDiv);
                listContainer.appendChild(row);
            });
        }
        currentMenu.appendChild(listContainer);
        setupEnhancedScroll(listContainer);
        // ---FILTRO DE BUSCA---
        searchInput.oninput = (e) => {
            const term = e.target.value.toLowerCase();
            const rows = listContainer.querySelectorAll('.prompt-item-row');
            let visibleCount = 0;
            rows.forEach(row => {
                if (row.dataset.searchText && row.dataset.searchText.includes(term)) {
                    row.style.display = 'flex';
                    visibleCount++;
                } else {
                    row.style.display = 'none';
                }
            });
            if (items.length > 0) {
                if (visibleCount === 0) {
                    emptyState.style.display = 'block';
                    emptyState.textContent = getTranslation('noSearchResults');
                } else {
                    emptyState.style.display = 'none';
                }
            }
        };
        // ---BOTÕES DO RODAPÉ---
        const footerGrid = document.createElement('div');
        footerGrid.className = 'menu-footer-grid';
        const createFooterBtn = (cls, icon, title, clickFn) => {
            const b = document.createElement('button');
            b.className = `menu-footer-btn ${cls}`;
            b.title = title;
            setSafeInnerHTML(b, icon);
            b.onclick = clickFn;
            return b;
        };
        // ---EXPORTAR/ADICIONAR/IMPORTAR---
        footerGrid.appendChild(createFooterBtn('btn-export', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M21 14a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4a1 1 0 0 0-2 0v4a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-4a1 1 0 0 0-1-1m-9.71 1.71a1 1 0 0 0 .33.21 1 1 0 0 0 .76 0 1 1 0 0 0 .33-.21l4-4a1 1 0 0 0-1.42-1.42L13 12.59V3a1 1 0 0 0-2 0v9.59l-2.29-2.3a1 1 0 1 0-1.42 1.42Z"/></svg>`, getTranslation('export'), (e) => { e.stopPropagation(); exportPrompts(); }));
        footerGrid.appendChild(createFooterBtn('btn-add',    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"><path fill="currentColor" fill-rule="evenodd" d="M8 1a1 1 0 0 0-2 0v5H1a1 1 0 0 0 0 2h5v5a1 1 0 1 0 2 0V8h5a1 1 0 1 0 0-2H8z" clip-rule="evenodd"/></svg>`, getTranslation('addPrompt'), (e) => { e.stopPropagation(); openPromptModal(); }));
        footerGrid.appendChild(createFooterBtn('btn-import', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M8.71 7.71 11 5.41V15a1 1 0 0 0 2 0V5.41l2.29 2.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-4-4a1 1 0 0 0-.33-.21 1 1 0 0 0-.76 0 1 1 0 0 0-.33.21l-4 4a1 1 0 1 0 1.42 1.42M21 14a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4a1 1 0 0 0-2 0v4a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-4a1 1 0 0 0-1-1"/></svg>`, getTranslation('import'), (e) => { e.stopPropagation(); importPrompts(); }));
        currentMenu.appendChild(footerGrid);
        setTimeout(() => searchInput.focus(), 50);
    }

    // ---PROMPT DINÂMICO PT2---
    function openPlaceholderModal(item, index) {
        const { processedText, ignoreMap, selectMap, inputMap } = parsePromptInternal(item.text);
        if (selectMap.size === 0 && inputMap.size === 0) {
            let finalText = processedText;
            ignoreMap.forEach((val, key) => { finalText = finalText.replace(key, val); });
            const finalItem = { ...item, text: finalText };
            insertPrompt(finalItem, index);
            return;
        }
        if (!currentPlaceholderModal) return;
        const container = document.getElementById('__ap_placeholders_container');
        setSafeInnerHTML(container, '');
        currentPlaceholderModal.dataset.parseData = JSON.stringify({
            processedText,
            ignoreMap: Array.from(ignoreMap.entries()),
            selectMap: Array.from(selectMap.entries()),
            inputMap:  Array.from(inputMap.entries())
        });
        currentPlaceholderModal.dataset.index = index;
        currentPlaceholderModal.dataset.originalItem = JSON.stringify(item);
        inputMap.forEach((data, key) => {
            const labelText = typeof data === 'string' ? data : data.label;
            let contextText = (typeof data === 'object' && data.context) ? data.context : null;
            if (contextText) {
                inputMap.forEach((iData, iKey) => {
                    if (contextText.includes(iKey)) {
                        const iLabel = typeof iData === 'string' ? iData : iData.label;
                        contextText = contextText.split(iKey).join(`[${iLabel}]`);
                    }
                });
                selectMap.forEach((sData, sKey) => {
                    if (contextText.includes(sKey)) {
                        contextText = contextText.split(sKey).join(`[List: ${sData.title}]`);
                    }
                });
                ignoreMap.forEach((val, iKey) => {
                    if (contextText.includes(iKey)) {
                        contextText = contextText.split(iKey).join('[...Code/Block...]');
                    }
                });
            }
            const formGroup              = document.createElement('div');
            formGroup.className          = 'form-group';
            formGroup.style.marginBottom = '12px';
            const labelWrapper           = document.createElement('div');
            labelWrapper.className       = 'mp-label-wrapper';
            const lbl                    = document.createElement('label');
            lbl.className                = 'form-label';
            lbl.textContent              = labelText;
            lbl.style.marginBottom       = '0';
            labelWrapper.appendChild(lbl);
            if (contextText) {
                const icon     = document.createElement('div');
                icon.className = 'mp-help-icon';
                icon.title     = getTranslation('clickToShowContext');
                setSafeInnerHTML(icon, `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>`);
                icon.onclick = (e) => { e.stopPropagation(); formGroup.querySelector('.mp-context-bubble').classList.toggle('visible'); };
                labelWrapper.appendChild(icon);
            }
            formGroup.appendChild(labelWrapper);
            if (contextText) {
                const bubble       = document.createElement('div');
                bubble.className   = 'mp-context-bubble';
                bubble.textContent = contextText;
                formGroup.appendChild(bubble);
            }
            const textarea = document.createElement('textarea');
            textarea.className    = 'form-input dynamic-input';
            textarea.dataset.key  = key;
            textarea.rows         = 1;
            textarea.style.resize = 'vertical';
            textarea.style.height = 'auto';
            textarea.placeholder  = data.varName ? data.varName : '';
            textarea.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    document.getElementById('__ap_insert_prompt').click();
                }
            });
            formGroup.appendChild(textarea);
            container.appendChild(formGroup);
        });
        selectMap.forEach((data, key) => {
            const regionContainer = document.createElement('div');
            regionContainer.dataset.selectKey = key;
            regionContainer.style.marginBottom = '16px';
            let currentOptionGroup = null;
            if (data.options.length > 0 && data.options[0].type !== 'header') {
                const defaultLabel = document.createElement('label');
                defaultLabel.className = 'form-label';
                defaultLabel.textContent = data.title;
                defaultLabel.style.marginBottom = '6px';
                regionContainer.appendChild(defaultLabel);
                currentOptionGroup = document.createElement('div');
                currentOptionGroup.className = 'mp-option-group';
                regionContainer.appendChild(currentOptionGroup);
            }
            data.options.forEach((opt) => {
                if (opt.type === 'header') {
                    if (regionContainer.children.length > 0) {
                        const spacer = document.createElement('div');
                        spacer.style.height = '8px';
                        regionContainer.appendChild(spacer);
                    }
                    const headerLabel       = document.createElement('label');
                    headerLabel.className   = 'form-label';
                    headerLabel.textContent = opt.label;
                    headerLabel.style.color = 'var(--mp-accent-secondary)';
                    regionContainer.appendChild(headerLabel);
                    currentOptionGroup = document.createElement('div');
                    currentOptionGroup.className = 'mp-option-group';
                    regionContainer.appendChild(currentOptionGroup);
                }
                else {
                    if (!currentOptionGroup) {
                        currentOptionGroup = document.createElement('div');
                        currentOptionGroup.className = 'mp-option-group';
                        regionContainer.appendChild(currentOptionGroup);
                    }
                    const optLabel = document.createElement('label');
                    optLabel.className = 'mp-option-item';
                    if (opt.type === 'id' && opt.id) {
                        const color = getColorForId(opt.id);
                        optLabel.style.cssText = `border-left: 5px solid ${color} !important; padding-left: 8px;`;
                        const idGroupText = typeof getTranslation === 'function' ? getTranslation('idGroup') : 'ID Group';
                        optLabel.title = `${idGroupText}: ${opt.id}`;
                    }
                    else if (opt.type === 'sovereign') {
                        optLabel.style.cssText = `border-left: 5px solid #FF4444 !important; padding-left: 8px;`;
                        optLabel.title = typeof getTranslation === 'function' ? getTranslation('uniqueSelection') : 'Unique Selection';
                    }
                    else {
                        optLabel.style.borderLeft = "5px solid transparent";
                    }
                    const checkbox        = document.createElement('input');
                    checkbox.type         = 'checkbox';
                    checkbox.className    = 'mp-checkbox';
                    checkbox.dataset.type = opt.type;
                    if (opt.id) checkbox.dataset.id = opt.id;
                    checkbox.value        = opt.value;
                    checkbox.onchange     = function() {
                        if (!this.checked) return;
                        const myGroup     = this.closest('.mp-option-group');
                        const siblings    = Array.from(myGroup.querySelectorAll('input[type="checkbox"]'));
                        const myType      = this.dataset.type;
                        const myId        = this.dataset.id;
                        siblings.forEach(other => {
                            if (other === this) return;
                            if (myType === 'sovereign') { other.checked = false; return; }
                            if (other.dataset.type === 'sovereign') other.checked = false;
                            if (myType === 'id' && other.dataset.type === 'id' && other.dataset.id === myId) other.checked = false;
                        });
                    };
                    const span = document.createElement('span');
                    span.textContent = opt.label;
                    if (opt.type === 'sovereign') {
                        span.style.fontWeight = '600';
                        span.style.color = 'var(--mp-text-primary)';
                    }
                    optLabel.appendChild(checkbox);
                    optLabel.appendChild(span);
                    currentOptionGroup.appendChild(optLabel);
                }
            });
            container.appendChild(regionContainer);
        });
        showModal(currentPlaceholderModal);
        setTimeout(() => container.querySelector('textarea, input')?.focus(), 100);
    }

    // ---APLICAR PADDING ESPECIAL PARA GROK---
    function applyGrokPadding() {
        const styleId = 'my-prompt-grok-padding';
        if (document.getElementById(styleId)) return;
        const styleElement = document.createElement('style');
        styleElement.id = styleId;
        const cssRule = `div.query-bar > div[class*="ps-11"] {padding-left: 95px !important; padding-right: 95px !important;}`;
        setSafeInnerHTML(styleElement, cssRule);
        document.head.appendChild(styleElement);
    }

    // ---APLICAR ESTILOS ESPECÍFICOS DO CHATGLM---
    function applyChatGLMCustomStyles() {
        const styleId = 'my-prompt-chatglm-left-align';
        if (document.getElementById(styleId)) return;
        const styleElement = document.createElement('style');
        styleElement.id = styleId;
        const cssRule = `body {text-align: left;}`;
        setSafeInnerHTML(styleElement, cssRule);
        document.head.appendChild(styleElement);
    }

    // ---HELPER DE CORES PROMPT DINÂMICO---
    const mpColorPalette = [
        '#4ECDC4', '#45B7D1', '#98D8C8', '#F7DC6F', '#BB8FCE',
        '#82E0AA', '#85C1E9', '#DAF7A6', '#FFC300', '#3498DB',
        '#2ECC71', '#9B59B6', '#F4D03F', '#1ABC9C', '#27AE60',
        '#F39C12', '#16A085', '#34495E', '#F5B041', '#5499C7'
    ];

    function getColorForId(id) {
        if (!id) return 'transparent';
        let str = String(id);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % mpColorPalette.length;
        return mpColorPalette[index];
    }

    // #region BUSCA DIFUSA
    function createInlineMenu() {
        if (inlineMenu) return inlineMenu;
        const menu = document.createElement('div');
        menu.className = 'mp-inline-menu';
        document.body.appendChild(menu);
        inlineMenu = menu;
        return menu;
    }

    function closeInlineMenu() {
        if (inlineMenu) {
            inlineMenu.classList.remove('visible');
            inlineMenuCurrentItems = [];
            inlineMenuIndex = 0;
        }
    }

    // ---RENDERIZAR ITENS DO MENU INLINE---
    function renderInlineList(items, queryRaw) {
        if (!inlineMenu) createInlineMenu();
        setSafeInnerHTML(inlineMenu, '');
        if (items.length === 0) { closeInlineMenu(); return; }
        const scrollWrapper = document.createElement('div');
        scrollWrapper.className = 'mp-inline-list';
        items.forEach((item, idx) => {
            const div = document.createElement('div');
            div.className = `mp-inline-item ${idx === inlineMenuIndex ? 'selected' : ''}`;
            div.onmousedown = (e) => {
                e.preventDefault(); e.stopPropagation();
                completeInlinePrompt(item, queryRaw);
            };
            const title = document.createElement('span');
            title.className = 'mp-inline-title';
            title.textContent = item.title;
            div.appendChild(title);
            scrollWrapper.appendChild(div);
        });
        inlineMenu.appendChild(scrollWrapper);
        setupEnhancedScroll(scrollWrapper);
        const selected = scrollWrapper.children[inlineMenuIndex];
        if (selected) selected.scrollIntoView({ block: 'nearest' });
    }

    // ---ATUALIZAR VISUAIS DO MENU INLINE---
    function updateInlineVisuals() {
        if (!inlineMenu) return;
        const scrollContainer = inlineMenu.querySelector('.mp-inline-list');
        const items = inlineMenu.querySelectorAll('.mp-inline-item');
        if (!scrollContainer) return;
        items.forEach((item, idx) => {
            if (idx === inlineMenuIndex) {
                item.classList.add('selected');
                if (idx === 0) {
                    scrollContainer.scrollTop = 0;
                }
                else if (idx === items.length - 1) {
                    scrollContainer.scrollTop = scrollContainer.scrollHeight;
                }
                else {
                    item.scrollIntoView({ block: 'nearest', behavior: 'auto' });
                }
            } else {
                item.classList.remove('selected');
            }
        });
    }

    // ---POSICIONAR MENU INLINE---
    function positionInlineMenu(editor) {
        if (!inlineMenu) return;
        const rect = editor.getBoundingClientRect();
        const bottom = window.innerHeight - rect.top + 8;
        const left = rect.left;
        inlineMenu.style.bottom = `${bottom}px`;
        inlineMenu.style.left = `${left}px`;
        if (left + 300 > window.innerWidth) {
             inlineMenu.style.left = 'auto';
             inlineMenu.style.right = '20px';
        }
    }

    // ---OBTER TEXTO ANTES DO CARET---
    function getTextBeforeCaret(editor) {
        if (editor.tagName === 'TEXTAREA' || editor.tagName === 'INPUT') {
            return editor.value.substring(0, editor.selectionEnd);
        }
        const sel = window.getSelection();
        if (sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            if   (range.startContainer.nodeType === 3) {return range.startContainer.textContent.substring(0, range.startOffset);}
            else {return '';}
        }
        return '';
    }

    // ---COMPLETAR PROMPT INLINE---
    async function completeInlinePrompt(item, queryRaw) {
        const editor = document.querySelector(platformSelectors[currentPlatform]);
        if (!editor) return;
        editor.focus();
        const textBefore = getTextBeforeCaret(editor);
        const match = textBefore.match(/(?:^|\s)(#[^\s]*)$/);
        let deleteCount = (match && match[1]) ? match[1].length : ((queryRaw ? queryRaw.length : 0) + 1);
        let savedCursor = null;
        if (editor.tagName === 'TEXTAREA' || editor.tagName === 'INPUT') {
            if (typeof editor.selectionEnd === 'number') {
                 const start = Math.max(0, editor.selectionEnd - deleteCount);
                 const end = editor.selectionEnd;
                 if (editor.setRangeText) {
                     editor.setRangeText('', start, end, 'end');
                 } else {
                     editor.value = editor.value.slice(0, start) + editor.value.slice(end);
                     editor.selectionEnd = start;
                 }
                 savedCursor = { type: 'input', start: editor.selectionEnd, end: editor.selectionEnd };
            }
        } else {
            const sel = window.getSelection();
            if (sel.rangeCount > 0) {
                const range = sel.getRangeAt(0);
                if (range.startContainer.nodeType === 3) {
                    const currentPos = range.startOffset;
                    const startPos = Math.max(0, currentPos - deleteCount);
                    range.setStart(range.startContainer, startPos);
                    range.setEnd(range.startContainer, currentPos);
                    range.deleteContents();
                    savedCursor = {
                        type: 'contenteditable',
                        node: range.startContainer,
                        offset: range.startOffset
                    };
                } else {
                    for(let i=0; i < deleteCount; i++) document.execCommand('delete', false, null);
                    try {
                        const r = sel.getRangeAt(0);
                        savedCursor = { type: 'contenteditable', node: r.startContainer, offset: r.startOffset };
                    } catch(e) {}
                }
            }
        }
        closeInlineMenu();
        if (item.usePlaceholders) {
             if (currentPlaceholderModal) {
                 currentPlaceholderModal.dataset.fromInline = "true";
                 currentPlaceholderModal._savedCursor = savedCursor;
             }
             openPlaceholderModal(item, -1);
        } else {
            await insertPrompt(item, -1, true, true);
        }
    }

    // ---CONFIGURAR SUGESTÃO INLINE---
    function setupInlineSuggestion(editor) {
        if (editor.dataset.mpInlineActive) return;
        editor.dataset.mpInlineActive = 'true';
        let ignoreNextEnter = false;
        editor.addEventListener('keydown', (e) => {
            if (inlineMenu && inlineMenu.classList.contains('visible')) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault(); e.stopPropagation();
                    inlineMenuIndex = (inlineMenuIndex + 1) % inlineMenuCurrentItems.length;
                    updateInlineVisuals();
                }
                else if (e.key === 'ArrowUp') {
                    e.preventDefault(); e.stopPropagation();
                    inlineMenuIndex = (inlineMenuIndex - 1 + inlineMenuCurrentItems.length) % inlineMenuCurrentItems.length;
                    updateInlineVisuals();
                }
                else if (e.key === 'Enter' || e.key === 'Tab') {
                    if (inlineMenuCurrentItems[inlineMenuIndex]) {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        ignoreNextEnter = true;
                        const text = getTextBeforeCaret(editor);
                        const match = text.match(/(?:^|\s)(#[^\s]*)$/);
                        const rawQuery = match ? match[1] : '';
                        completeInlinePrompt(inlineMenuCurrentItems[inlineMenuIndex], rawQuery);
                    }
                }
                else if (e.key === 'Escape') {
                    e.preventDefault();
                    closeInlineMenu();
                }
            }
        }, true);
        editor.addEventListener('keypress', (e) => {
            if (ignoreNextEnter && (e.key === 'Enter' || e.key === 'Tab')) {
                e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
            }
        }, true);
        editor.addEventListener('keyup', (e) => {
            if (ignoreNextEnter && (e.key === 'Enter' || e.key === 'Tab')) {
                e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
                ignoreNextEnter = false;
            }
        }, true);
        editor.addEventListener('input', debounce(async (e) => {
            const textBefore = getTextBeforeCaret(editor);
            const match = textBefore.match(/(?:^|\s)#([\w\-]*)$/);
            if (match) {
                const rawQuery = match[1];
                const cleanQuery = rawQuery.toLowerCase().replace(/-/g, ' ');
                const allPrompts = await getAll();
                inlineMenuCurrentItems = allPrompts.filter(p => {
                    const title = p.title.toLowerCase();
                    return title.includes(cleanQuery);
                }).slice(0, 8);
                if (inlineMenuCurrentItems.length > 0) {
                    inlineMenuIndex = 0;
                    renderInlineList(inlineMenuCurrentItems, rawQuery);
                    positionInlineMenu(editor);
                    if (inlineMenu) inlineMenu.classList.add('visible');
                } else {
                    closeInlineMenu();
                }
            } else {
                closeInlineMenu();
            }
        }, 100));
        document.addEventListener('click', (e) => {
            if (inlineMenu && inlineMenu.classList.contains('visible') && !inlineMenu.contains(e.target) && e.target !== editor) {
                closeInlineMenu();
            }
        });
    }
    // #endregion BUSCA DIFUSA
    // #endregion FUNÇÕES AUXILIARES
    // #region INTERAÇÃO COM A PÁGINA
    // ---DETECTAR PLATAFORMA---
    function detectPlatform() {
        const hostname = window.location.hostname;
        if (hostname.includes('chatgpt.com'))           return 'chatgpt';
        if (hostname.includes('deepseek.com'))          return 'deepseek';
        if (hostname.includes('aistudio.google.com'))   return 'googleaistudio';
        if (hostname.includes('chat.qwen.ai'))          return 'qwen';
        if (hostname.includes('chat.z.ai'))             return 'zai';
        if (hostname.includes('gemini.google.com'))     return 'gemini';
        if (hostname.includes('lmarena.ai'))            return 'lmarena';
        if (hostname.includes('kimi.com'))              return 'kimi';
        if (hostname.includes('claude.ai'))             return 'claude';
        if (hostname.includes('grok.com'))              return 'grok';
        if (hostname.includes('www.perplexity.ai'))     return 'perplexity';
        if (hostname.includes('doubao.com'))            return 'doubao';
        if (hostname.includes('longcat.chat'))          return 'longcat';
        if (hostname.includes('mistral.ai'))            return 'mistral';
        if (hostname.includes('yuanbao.tencent.com'))   return 'yuanbao';
        if (hostname.includes('chatglm.cn'))            return 'chatglm';
        if (hostname.includes('poe.com'))               return 'poe';
        if (hostname.includes('notebooklm.google.com')) return 'notebooklm';
        if (hostname.includes('google.com') && window.location.pathname.includes('/search') && window.location.search.includes('udm=50')) return 'googleModoIA';
        return null;
    }

    // ---MOSTRAR AVISO DE UPLOAD---
    function showToast(message, duration = 8000) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = 'position:fixed; top:20px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.8); color:white; padding:8px 16px; border-radius:30px; z-index:99999; font-size:13px; pointer-events:none; font-family: var(--mp-font-family-base) !important;';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), duration);
    }

    // ---BOTÃO DE ENVIO---
    function getSendButton() {
        switch (currentPlatform) {
            case 'chatgpt':         return document.querySelector('[data-testid="send-button"]') || document.querySelector('#composer-submit-button');
            case 'deepseek':        return document.querySelector('div[role="button"]:has(svg path[d^="M8.3125"])');
            case 'googleaistudio':  return document.querySelector('button.run-button');
            case 'qwen':            return document.querySelector('.send-button') || document.querySelector('#send-message-button');
            case 'zai':             return document.querySelector('#send-message-button');
            case 'gemini':          return document.querySelector('button:has(mat-icon[data-mat-icon-name="send"])') || document.querySelector('button:has(mat-icon[fonticon="send"])');
            case 'lmarena':         return document.querySelector('button[type="submit"]:has(svg.lucide-arrow-up)') || document.querySelector('button:has(svg path[d="m5 12 7-7 7 7"])');
            case 'kimi':            return document.querySelector('div:has(> svg[name="Send"])');
            case 'claude':          return document.querySelector('button:has(svg path[d^="M208.49,120.49"])');
            case 'grok':            return document.querySelector('button:has(svg path[d^="M5 11L12 4"])');
            case 'perplexity':      return document.querySelector('button[data-testid="submit-button"]');
            case 'doubao':          return document.querySelector('[data-testid="chat_input_send_button"]') || document.querySelector('#flow-end-msg-send');
            case 'longcat':         return document.querySelector('.send-btn') || document.querySelector('div:has(svg use[href="#icon-send"])');
            case 'mistral':         return document.querySelector('button[type="submit"]:has(svg path[d^="M12 18v4"])');
            case 'yuanbao':         return document.querySelector('#yuanbao-send-btn');
            case 'poe':             return document.querySelector('button[data-button-send="true"]');
            case 'googleModoIA':    return document.querySelector('button[data-xid="input-plate-send-button"]');
            case 'notebooklm':      return document.querySelector('button.submit-button');
            default:                return null;
        }
    }

    // ---VERIFICAR SE O EDITOR ESTÁ VAZIO---
    function isEditorEmpty(editor) {
        if (!editor) return true;
        if (!editor.isConnected) return true;
        let content = '';
        if (editor.tagName.toLowerCase() === 'textarea') {
            content = editor.value;
        } else {
            content = editor.textContent || editor.innerText || '';
        }
        return content.replace(/[\s\u200B\u00A0\r\n]/g, '').length === 0;
    }

    // ---AGUARDAR UPLOAD---
    function waitForUploadAndClick(editor, maxWaitTime = 120000) {
        const startTime = Date.now();
        const interval  = setInterval(() => {
            if (Date.now() - startTime > maxWaitTime) {
                clearInterval(interval);
                return;
            }
            if (isEditorEmpty(editor)) {
                clearInterval(interval);
                return;
            }
            const btn = getSendButton();
            if (!btn) return;
            const isDisabled         = btn.disabled || btn.getAttribute('aria-disabled') === 'true';
            const style              = window.getComputedStyle(btn);
            const isVisuallyDisabled = style.cursor  === 'not-allowed' || parseFloat(style.opacity) < 0.5;
            const isHidden           = style.display === 'none'        || style.visibility === 'hidden';
            if (!isDisabled && !isVisuallyDisabled && !isHidden) {
                btn.click();
            }
        }, 800);
    }

    // TRATAMENTO CHATGLM
    function handleChatGLM(editor, maxWaitTime = 120000) {
        const startTime = Date.now();
        const interval  = setInterval(() => {
            if (Date.now() - startTime > maxWaitTime || isEditorEmpty(editor)) {
                clearInterval(interval);
                return;
            }
            try {
                if(editor.isConnected) editor.focus();
                const enterEvent = new KeyboardEvent('keydown', {key: 'Enter',code: 'Enter',which: 13,keyCode: 13,bubbles: true,cancelable: true});
                editor.dispatchEvent(enterEvent);
            } catch (e) {}
        }, 800);
    }

    // ---INSERIR PROMPT NO CAMPO DE TEXTO---
    async function insertPrompt(promptItem, index, forceNoAutoExecute = false, isInline = false) {
        let editor = document.querySelector(platformSelectors[currentPlatform]);
        if (!editor) { return; }
        editor.focus();
        const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
        // ---CONTROLE DE ARQUIVOS---
        let hasFiles         = false;
        let totalUploadDelay = 0;
        let fileCount        = 0;
        if (promptItem.activeFileIds && promptItem.activeFileIds.length > 0) {
            const allFiles      = await getGlobalFiles();
            const filesToAttach = allFiles
                .filter(f => promptItem.activeFileIds.includes(f.id))
                .map(f => {
                    fileCount++;
                    totalUploadDelay += f.size;
                    return dataURLtoFile(f.data, f.name);
                });
            if (filesToAttach.length > 0) {
                hasFiles = true;
                totalUploadDelay = 1500 + (totalUploadDelay / 1024 / 100 * 100);
                const dt = new DataTransfer();
                filesToAttach.forEach(file => dt.items.add(file));
                // ---TRATAMENTO ESPECIAL PARA O GEMINI---
                if (currentPlatform === 'gemini') {
                    if (isFirefox) {
                        // FIREFOX
                        let dropTarget = document.querySelector('[data-filedrop-id]') || document.querySelector('.chat-window-input-container') || editor;
                        ['dragenter', 'dragover', 'drop'].forEach(eventName => {
                            const evt = new DragEvent(eventName, {
                                bubbles: true,
                                cancelable: true,
                                dataTransfer: dt
                            });
                            dropTarget.dispatchEvent(evt);
                        });
                    }
                    else {
                        // NAVEGADORES CHROMIUM
                        const pasteEvent = new ClipboardEvent('paste', {
                            bubbles: true,
                            cancelable: true,
                            clipboardData: dt
                        });
                        editor.dispatchEvent(pasteEvent);
                    }
                }
                // ---LÓGICA PADRÃO---
                else {
                    let dropHandled = false;
                    const preferDrop = ['deepseek', 'qwen', 'longcat', 'grok', 'mistral', 'googleaistudio', 'yuanbao'];
                    if (preferDrop.includes(currentPlatform)) {
                        let dropTarget = document.querySelector('.chat-input-container') || document.querySelector('form') || editor;
                        ['dragenter', 'dragover', 'drop'].forEach(eventName => {
                            const evt = new DragEvent(eventName, { bubbles: true, cancelable: true, dataTransfer: dt });
                            dropTarget.dispatchEvent(evt);
                        });
                        dropHandled = true;
                    }
                    if (!dropHandled) {
                        let fileInput = document.querySelector('input[type="file"]');
                        if (currentPlatform === 'perplexity') fileInput = document.querySelector('input[data-testid="file-upload-input"]');
                        if (fileInput) {
                            try {
                                fileInput.value = '';
                                fileInput.files = dt.files;
                                fileInput.dispatchEvent(new Event('change', { bubbles: true }));
                                fileInput.dispatchEvent(new Event('input', { bubbles: true }));
                            } catch(e) {}
                        } else {
                            ['dragenter', 'dragover', 'drop'].forEach(eventName => {
                                const evt = new DragEvent(eventName, { bubbles: true, cancelable: true, dataTransfer: dt });
                                editor.dispatchEvent(evt);
                            });
                        }
                    }
                }
                showToast(getTranslation('sendingFiles').replace('{fileCount}', fileCount), totalUploadDelay);
            }
        }

        // ---INSERÇÃO DE TEXTO---
        setTimeout(() => {
            // ---TRATAMENTO ESPECIAL PARA O FIREFOX---
            if (isFirefox && (currentPlatform === 'kimi' || currentPlatform === 'perplexity' || currentPlatform === 'qwen')) {
                editor.focus();
                document.execCommand('insertText', false, promptItem.text);
            }
            else if (isFirefox && (currentPlatform === 'chatgpt' || currentPlatform === 'claude' || currentPlatform === 'grok' || currentPlatform === 'longcat' || currentPlatform === 'mistral' || currentPlatform === 'yuanbao')) {
                const lines = promptItem.text.split('\n');
                lines.forEach(line => {
                    const p = document.createElement('p');
                    if (line.trim() === '') p.appendChild(document.createElement('br'));
                    else p.textContent = line;
                    editor.appendChild(p);
                });
                editor.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
                editor.focus();
                const range = document.createRange();
                range.selectNodeContents(editor);
                range.collapse(false);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
            // ---TRATAMENTO ESPECIAL PARA O GEMINI---
            else if (currentPlatform === 'gemini') {
                editor.focus();
                if (isFirefox) {
                    // FIREFOX
                    let p = editor.querySelector('p') || document.createElement('p');
                    p.textContent += promptItem.text;
                    if (!editor.contains(p)) editor.appendChild(p);
                    editor.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
                }
                else {
                    // NAVEGADORES CHROMIUM
                    const success = document.execCommand('insertText', false, promptItem.text);
                    if (!success) {
                         const textNode = document.createTextNode(promptItem.text);
                         editor.appendChild(textNode);
                    }
                    editor.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
                }
            }
            // ---LÓGICA PADRÃO---
            else {
                const dt = new DataTransfer();
                dt.setData('text/plain', promptItem.text);
                editor.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
                if (editor.value !== undefined && !editor.value.includes(promptItem.text)) {
                    let newVal = editor.value + promptItem.text;
                    if (isInline && typeof editor.selectionStart === 'number') {
                        const start = editor.selectionStart;
                        newVal = editor.value.substring(0, start) + promptItem.text + editor.value.substring(editor.selectionEnd);
                        setTimeout(() => { editor.selectionStart = editor.selectionEnd = start + promptItem.text.length; }, 0);
                    }
                    const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
                    if (setter) {
                        setter.call(editor, newVal);
                    } else {
                        editor.value = newVal;
                    }
                    editor.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
            if (!isInline) {
                moveCursorToEnd(editor);
            }
            // ---ENVIO AUTOMÁTICO---
            if (promptItem.autoExecute && !forceNoAutoExecute) {
                if (currentPlatform === 'chatglm') {
                    handleChatGLM(editor);
                }
                else if (hasFiles) {
                    waitForUploadAndClick(editor);
                }
                else {
                    setTimeout(() => {
                        let sent = false;
                        if (currentPlatform === 'qwen') {
                            try {
                                const sendButton = document.querySelector('.send-button') || document.querySelector('#send-message-button');
                                if (sendButton && !sendButton.disabled) { sendButton.click(); sent = true; }
                            } catch (e) {}
                        }
                        if (currentPlatform === 'googleaistudio') {
                            try {
                                const sendBtn = document.querySelector('button.run-button');
                                if (sendBtn) { sendBtn.click(); sent = true; }
                            } catch (e) {}
                        }
                        if (!sent) {
                            try {
                                const enterEvent = new KeyboardEvent('keydown', {key: 'Enter', code: 'Enter', which: 13, keyCode: 13, bubbles: true, cancelable: true});
                                editor.dispatchEvent(enterEvent);
                            } catch (e) {}
                        }
                    }, 150);
                }
            }
        }, 100);
        // ATUALIZAR LISTA
        let prompts = await getAll();
        if (index > -1) {
            const item = prompts.splice(index, 1)[0];
            prompts.unshift(item);
            await GM_setValue(PROMPT_STORAGE_KEY, prompts);
        }
    }

    // ---MENU DE EXPORTAÇÃO---
    async function openExportMenu() {
        closeMenu();
        const overlay     = document.createElement('div');
        overlay.className = 'mp-overlay';
        overlay.id        = '__ap_export_overlay';
        const box         = document.createElement('div');
        box.className     = 'mp-modal-box';
        box.onclick       = e => e.stopPropagation();
        const prompts = await getAll();
        const htmlStructure = `
            <button id="__ap_close_export" class="mp-modal-close-btn"><svg viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg></button>
            <h2 class="modal-title">${getTranslation('export')}</h2>
            <div class="mp-search-container">
                <input type="text" id="__ap_export_search" class="mp-search-input" placeholder="${getTranslation('search')}" autocomplete="off">
                <div class="mp-export-actions">
                    <label class="mp-checkbox-wrapper" style="cursor:pointer; user-select:none;">
                        <input type="checkbox" id="__ap_select_all" class="mp-checkbox" checked>
                        <span style="margin-left:8px;">${getTranslation('selectAll')}</span>
                    </label>
                    <span id="__ap_count_label">${getTranslation('countPrompts', { count: prompts.length })}</span>
                </div>
            </div>
            <div class="mp-export-list" id="__ap_export_list">
            </div>
            <div class="mp-export-buttons">
                <button id="__ap_do_export_txt" class="save-button mp-btn-secondary" style="margin-right:auto">TXT</button>
                <button id="__ap_do_export_json" class="save-button">JSON</button>
            </div>
        `;
        setSafeInnerHTML(box, htmlStructure);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
        setTimeout(() => overlay.classList.add('visible'), 10);
        const listContainer = box.querySelector('#__ap_export_list');
        listContainer.style.maxHeight = '300px';
        setupEnhancedScroll(listContainer);
        function renderList(filterText = '') {
            listContainer.textContent = '';
            filterText = filterText.toLowerCase();
            let visibleCount = 0;
            if (prompts.length === 0) {
                const emptyMsg = document.createElement('div');
                emptyMsg.className = 'empty-state';
                emptyMsg.textContent = getTranslation('noSavedPrompts');
                listContainer.appendChild(emptyMsg);
                return;
            }
            prompts.forEach((p, index) => {
                const match = p.title.toLowerCase().includes(filterText) || p.text.toLowerCase().includes(filterText);
                if (!match) return;
                visibleCount++;
                const item = document.createElement('div');
                item.className = 'mp-export-item';
                item.onclick = (e) => {
                    if (e.target.type !== 'checkbox') {
                        const cb = item.querySelector('input');
                        cb.checked = !cb.checked;
                        updateSelectAllState();
                    }
                };
                const checkbox         = document.createElement('input');
                checkbox.type          = 'checkbox';
                checkbox.className     = 'mp-checkbox prompt-selector';
                checkbox.checked       = true;
                checkbox.dataset.index = index;
                checkbox.onclick       = (e) => { e.stopPropagation(); updateSelectAllState(); };
                const content          = document.createElement('div');
                content.className      = 'mp-item-content';
                const title            = document.createElement('div');
                title.className        = 'mp-item-title';
                title.textContent      = p.title;
                const preview          = document.createElement('div');
                preview.className      = 'mp-item-preview';
                preview.textContent    = p.text.substring(0, 60).replace(/\n/g, ' ') + '...';
                const cbWrapper        = document.createElement('div');
                cbWrapper.className    = 'mp-checkbox-wrapper';
                cbWrapper.appendChild(checkbox);
                content.appendChild(title);
                content.appendChild(preview);
                item.appendChild(cbWrapper);
                item.appendChild(content);
                listContainer.appendChild(item);
            });
            document.getElementById('__ap_count_label').textContent = getTranslation('countPrompts', { count: visibleCount });
        }
        renderList();
        const searchInput = document.getElementById('__ap_export_search');
        const selectAllCb = document.getElementById('__ap_select_all');
        searchInput.oninput = (e) => {
            renderList(e.target.value);
            updateSelectAllState();
        };
        selectAllCb.onchange = (e) => {
            const checkboxes = listContainer.querySelectorAll('.prompt-selector');
            checkboxes.forEach(cb => cb.checked = e.target.checked);
        };
        function updateSelectAllState() {
            const checkboxes = Array.from(listContainer.querySelectorAll('.prompt-selector'));
            if (checkboxes.length === 0) return;
            const allChecked = checkboxes.every(cb => cb.checked);
            const someChecked = checkboxes.some(cb => cb.checked);
            selectAllCb.checked = allChecked;
            selectAllCb.indeterminate = someChecked && !allChecked;
        }
        const getSelectedPrompts = () => {
            const checkboxes = Array.from(listContainer.querySelectorAll('.prompt-selector:checked'));
            return checkboxes.map(cb => prompts[parseInt(cb.dataset.index)]);
        };
        const closeExportModal = () => {
            overlay.classList.remove('visible');
            setTimeout(() => overlay.remove(), 200);
        };
        box.querySelector('#__ap_close_export').onclick = closeExportModal;
        overlay.onclick = (e) => { if (e.target === overlay) closeExportModal(); };
        document.getElementById('__ap_do_export_json').onclick = () => {
            const selected = getSelectedPrompts();
            if (selected.length === 0) { alert(getTranslation('noPromptsToExport')); return; }

            const a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob([JSON.stringify(selected, null, 2)], { type: 'application/json' }));
            a.download = 'Prompts.json';
            a.click();
            URL.revokeObjectURL(a.href);
            closeExportModal();
        };
        document.getElementById('__ap_do_export_txt').onclick = async () => {
            const selected = getSelectedPrompts();
            if (selected.length === 0) { alert(getTranslation('noPromptsToExport')); return; }
            if (selected.length > 10 && !confirm(getTranslation('confirmDownloads', { count: selected.length }))) return;
            for (let i = 0; i < selected.length; i++) {
                const p = selected[i];
                const a = document.createElement('a');
                const content = p.text;
                a.href = URL.createObjectURL(new Blob([content], { type: 'text/plain' }));
                let rawTitle = p.title || 'prompt';
                const safeTitle = rawTitle.replace(/[<>:"/\\|?*]/g, '').trim();
                a.download = `${safeTitle || 'prompt'}.txt`;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                await new Promise(r => setTimeout(r, 200));
            }
            closeExportModal();
        };
        setTimeout(() => searchInput.focus(), 100);
    }

    // ---ABRIR MENU DE EXPORTAR---
    function exportPrompts() {
        openExportMenu();
    }

    // ---AÇÃO DE IMPORTAÇÃO---
    function importPrompts() {
        const input=document.createElement('input');
        input.type='file';
        input.accept='.json';
        input.onchange=e=>{
            const file=e.target.files[0];
            if(!file)return;
            const reader=new FileReader();
            reader.onload=async event=>{
                try{
                    const imported=JSON.parse(event.target.result);
                    if(!Array.isArray(imported))throw new Error("Not an array.");
                    const current=await getAll();
                    const newPrompts = imported.map(p => ({
                        title: p.title || 'No Title',
                        text: p.text || '',
                        usePlaceholders: p.usePlaceholders || false,
                        autoExecute: p.autoExecute || false
                    }));
                    await GM_setValue(PROMPT_STORAGE_KEY,[...current,...newPrompts]);
                    await refreshMenu();
                    alert(getTranslation('promptsImported',{count:newPrompts.length}));
                }catch(err){alert(getTranslation('errorImporting',{error:err.message}))}
            };
            reader.readAsText(file);
        };
        input.click();
        closeMenu();
    }

    // ---LIMPAR---
    function cleanup() {
        if (currentButton)  { currentButton.remove  (); currentButton   = null; }
        if (currentMenu)    { currentMenu.remove    (); currentMenu     = null; }
        if (currentModal)   { currentModal.remove   (); currentModal    = null; }
        if (languageModal)  { languageModal.remove  (); languageModal   = null; }
        if (currentPlaceholderModal) { currentPlaceholderModal.remove(); currentPlaceholderModal = null; }
        isInitialized = false;
    }
    // #endregion INTERAÇÃO COM A PÁGINA
    // #region INJETAR E OBSERVAR
    // ---INICIALIZAR INTERFACE---
    async function initUI() {
        let warningModal = null;
        if (pageObserver) pageObserver.disconnect();
        cleanup();
        currentPlatform = detectPlatform();
        if (!currentPlatform) return;
        try {
            let btn, elementToInsert, insertionPoint, insertionMethod = 'before';

            // ---CHATGPT---
            if (currentPlatform === 'chatgpt') {
                insertionPoint = await waitFor('div[class*="[grid-area:leading]"]');
                insertionPoint.style.display = 'flex';
                insertionPoint.style.alignItems = 'center';
                btn = createChatGPTButton();
                elementToInsert = btn;
                insertionMethod = 'append';
            }

            // ---DEEPSEEK---
            else if (currentPlatform === 'deepseek') {
                const findAnchor = () => {
                    const SEARCH_ICON_PATH_START = "M7 0.150391C10.7832";
                    const toggles = Array.from(document.querySelectorAll('.ds-toggle-button'));
                    const searchBtn = toggles.find(el => {
                        const path = el.querySelector('path');
                        if (!path) return false;
                        const d = path.getAttribute('d');
                        return d && d.startsWith(SEARCH_ICON_PATH_START);
                    });
                    if (searchBtn) return { element: searchBtn, type: 'icon-fingerprint' };
                    return null;
                };
                let anchorData = findAnchor();
                if (!anchorData) {
                    await new Promise(r => setTimeout(r, 1500));
                    anchorData = findAnchor();
                }
                if (!anchorData) return;
                const anchor = anchorData.element;
                const container = anchor.parentElement;
                if (!container) return;
                let existingBtn = container.querySelector('[data-testid="composer-button-prompts"]');
                if (existingBtn) {
                    btn = existingBtn;
                } else {
                    btn = createDeepseekButton();
                    if (anchor.nextSibling) {
                        container.insertBefore(btn, anchor.nextSibling);
                    } else {
                        container.appendChild(btn);
                    }
                }
                elementToInsert = btn;
                insertionPoint = container;
                insertionMethod = 'handled_manually';
            }

            // ---GOOGLE AI STUDIO---
            else if (currentPlatform === 'googleaistudio') {
                const findAnchor = () => {
                    let el = document.querySelector('ms-add-media-button');
                    if (el) return { element: el, type: 'component' };
                    el = document.querySelector('button[aria-label*="Insert images"], button[aria-label="Run"]');
                    if (el) return { element: el, type: 'aria' };
                    const icons = Array.from(document.querySelectorAll('.material-symbols-outlined, .material-icons'));
                    const targetIcon = icons.find(i => i.textContent.trim() === 'note_add' || i.textContent.trim() === 'keyboard_return');
                    if (targetIcon) return { element: targetIcon, type: 'icon' };
                    return null;
                };
                let anchorData = findAnchor();
                if (!anchorData) {
                    await new Promise(r => setTimeout(r, 1000));
                    anchorData = findAnchor();
                }
                if (!anchorData) return;
                let actionButtonsContainer = null;
                let referenceNode = null;
                if (anchorData.type === 'component') {
                    referenceNode = anchorData.element;
                    actionButtonsContainer = anchorData.element.parentElement;
                } else if (anchorData.type === 'aria' || anchorData.type === 'icon') {
                    const el = anchorData.element;
                    let parent = el.parentElement;
                    for (let i = 0; i < 4; i++) {
                        if (parent && getComputedStyle(parent).display === 'flex') {
                            actionButtonsContainer = parent;
                            referenceNode = parent.querySelector('ms-add-media-button') || el.closest('button') || el;
                            if (referenceNode.innerText.includes('Run') || referenceNode.getAttribute('aria-label') === 'Run') {
                                referenceNode = actionButtonsContainer.firstChild;
                            }
                            break;
                        }
                        parent = parent.parentElement;
                    }
                }
                if (!actionButtonsContainer) return;
                let existingBtn = actionButtonsContainer.querySelector('[data-testid="composer-button-prompts"]');
                if (existingBtn) {
                    btn = existingBtn;
                } else {
                    btn = createGoogleAIStudioButton();
                    if (referenceNode && actionButtonsContainer.contains(referenceNode)) {
                        actionButtonsContainer.insertBefore(btn, referenceNode);
                    } else {
                        actionButtonsContainer.insertBefore(btn, actionButtonsContainer.firstChild);
                    }
                }
                elementToInsert = btn;
                insertionPoint = actionButtonsContainer;
                insertionMethod = 'handled_manually';
                actionButtonsContainer.style.display = 'flex';
                actionButtonsContainer.style.alignItems = 'center';
                if (actionButtonsContainer.style.gap) {
                }
            }

            // ---QWEN---
            else if (currentPlatform === 'qwen') {
                const buttonContainer = await waitFor('.action-bar-left-btns', 5000);
                if (!buttonContainer) return;
                insertionPoint = buttonContainer.firstChild;
                insertionMethod = 'before';
                btn = createQwenButton();
                elementToInsert = btn;
                if (!buttonContainer.contains(btn)) {
                    buttonContainer.prepend(btn);
                }
                const qwenPositionObserver = new MutationObserver(() => {
                    if (document.body.contains(buttonContainer) && !buttonContainer.contains(btn)) {
                        buttonContainer.prepend(btn);
                    }
                });
                qwenPositionObserver.observe(buttonContainer, { childList: true, subtree: true });
            }

            // ---Z.AI---
            else if (currentPlatform === 'zai') {
                const referenceElement = await waitFor('button[data-autothink]', 8000);
                if (referenceElement) {
                    insertionPoint = referenceElement.closest('.flex.gap-\\[8px\\].items-center') || referenceElement.parentElement?.parentElement;
                    if (insertionPoint) {
                        btn = createZaiButton();
                        elementToInsert = btn;
                        insertionMethod = 'append';
                    }
                }
            }

            // ---GEMENI---
            else if (currentPlatform === 'gemini') {
                insertionPoint = await waitFor('uploader', 8000);
                btn = createGeminiButton();
                elementToInsert = btn;
                insertionMethod = 'after';
                const wrapper = insertionPoint.parentElement;
                if (wrapper) {
                    wrapper.style.display = 'flex';
                    wrapper.style.alignItems = 'center';
                    wrapper.style.gap = '3px';
                }
            }

            // ---LMARENA---
            else if (currentPlatform === 'lmarena') {
                insertionPoint = await waitFor('div.mr-1.flex.h-8.flex-none.gap-2 > div.flex.items-center.gap-2', 8000);
                if (!insertionPoint) {
                    insertionPoint = document.querySelector('div.mr-1.flex.h-8.flex-none.gap-2')?.querySelector('div.flex.items-center.gap-2');
                }
                btn = createLmarenaButton();
                elementToInsert = btn;
                insertionMethod = 'append';
            }

            // ---KIMI---
            else if (currentPlatform === 'kimi') {
                const findAnchor = () => {
                    const PATH_NORMAL = "M624.469333";
                    const PATH_ACTIVE = "M512 132.266667";
                    const paths = document.querySelectorAll('svg path');
                    for (let p of paths) {
                        const d = p.getAttribute('d');
                        if (!d) continue;
                        if (d.startsWith(PATH_NORMAL)) {
                            const el = p.closest('.icon-button') || p.closest('.toolkit-trigger-btn');
                            if (el) return { element: el, mode: 'normal' };
                        }
                        if (d.startsWith(PATH_ACTIVE)) {
                            const el = p.closest('.tool-switch');
                            if (el) return { element: el, mode: 'active' };
                        }
                    }
                    return null;
                };
                let anchorData = findAnchor();
                if (!anchorData) {
                    await new Promise(r => setTimeout(r, 1500));
                    anchorData = findAnchor();
                }
                if (!anchorData) return;
                const anchorElement = anchorData.element;
                const mode = anchorData.mode;
                let container = anchorElement.parentElement;
                let insertionReference = anchorElement;
                const leftArea = anchorElement.closest('.left-area');
                if (leftArea) {
                    container = leftArea;
                    let current = anchorElement;
                    while (current.parentElement && current.parentElement !== leftArea) {
                        current = current.parentElement;
                    }
                    insertionReference = current;
                }
                if (!container) return;
                let existingBtn = container.querySelector('[data-testid="composer-button-prompts"]');
                if (existingBtn) {
                    btn = existingBtn;
                } else {
                    btn = createKimiButton();
                    if (mode === 'normal') {
                        if (insertionReference.nextSibling) {
                            container.insertBefore(btn, insertionReference.nextSibling);
                        } else {
                            container.appendChild(btn);
                        }
                    } else {
                        container.insertBefore(btn, insertionReference);
                    }
                }
                elementToInsert = btn;
                insertionPoint = container;
                insertionMethod = 'handled_manually';
            }

            // ---CLAUDE---
            else if (currentPlatform === 'claude') {
                const findAnchor = () => {
                    const ANCHOR_FINGERPRINT = "M10 3C10.2761 3 10.5 3.22386";
                    const candidates = Array.from(document.querySelectorAll('button svg path, div[role="button"] svg path'));
                    const targetPath = candidates.find(path =>
                        path.getAttribute('d')?.startsWith(ANCHOR_FINGERPRINT)
                    );
                    if (targetPath) {
                        const btnEl = targetPath.closest('button, [role="button"]');
                        if (btnEl) return { element: btnEl, type: 'icon-fingerprint' };
                    }
                    return null;
                };
                let anchorData = findAnchor();
                if (!anchorData) {
                    await new Promise(r => setTimeout(r, 1500));
                    anchorData = findAnchor();
                }
                if (!anchorData) return;
                let container = anchorData.element.parentElement;
                if (!container) return;
                let existingBtn = container.querySelector('[data-testid="composer-button-prompts"]');
                if (existingBtn) {
                    btn = existingBtn;
                } else {
                    btn = createClaudeButton();
                    if (anchorData.element.nextSibling) {
                        container.insertBefore(btn, anchorData.element.nextSibling);
                    } else {
                        container.appendChild(btn);
                    }
                }
                elementToInsert = btn;
                insertionPoint = container;
                insertionMethod = 'handled_manually';
            }

            // ---GROK---
            else if (currentPlatform === 'grok') {
                const attachButtonSelector = 'button:has(svg > path[d^="M10 9V15C"])';
                insertionPoint = await waitFor(attachButtonSelector);
                btn = createGrokButton();
                btn.className = insertionPoint.className;
                btn.style.marginLeft = '-6px';
                elementToInsert = btn;
                insertionMethod = 'after';
            }

            // ---PERPLEXITY---
            else if (currentPlatform === 'perplexity') {
                const containerSelector = 'div.flex.items-center.justify-self-end.col-start-3.row-start-2';
                const container = await waitFor(containerSelector);
                const spanWrapper = createPerplexityButton();
                elementToInsert = spanWrapper;
                btn = spanWrapper.querySelector('button');
                if (container.firstElementChild) {
                    insertionPoint = container.firstElementChild;
                    insertionMethod = 'before';
                } else {
                    insertionPoint = container;
                    insertionMethod = 'append';
                }
            }

            // ---DOUBAO---
            else if (currentPlatform === 'doubao') {
                const uploadSelectors = 'div[data-testid="custom-input-file-upload-button"], div[data-testid="write_chat_input_upload_button"]';
                const codeSelector = 'button[data-testid="code-btn-prompt-optimize"]';
                const micSelector = 'div[data-testid="asr_btn"]';
                try {
                    await waitFor(uploadSelectors, 1500);
                    await new Promise(resolve => setTimeout(resolve, 300));
                } catch (e) {
                    await waitFor(`${codeSelector}, ${micSelector}, ${uploadSelectors}`, 1500).catch(() => {});
                    await new Promise(resolve => setTimeout(resolve, 800));
                    await waitFor(uploadSelectors, 500).catch(() => {});
                }
                let target = null;
                let method = 'after';
                let variant = 'default';
                target = document.querySelector(uploadSelectors);
                if (!target) {
                    const codeBtn = document.querySelector(codeSelector);
                    if (codeBtn) {
                        target = codeBtn.closest('span') || codeBtn.parentElement;
                        method = 'after';
                        variant = 'minimal';
                    }
                }
                if (!target) {
                    const mic = document.querySelector(micSelector);
                    if (mic) {
                        target = mic.parentElement || mic.closest('div');
                        method = 'before';
                        variant = 'minimal';
                    }
                }
                if (target) {
                    const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
                    const isSafeSpot = target.matches('div[data-testid="custom-input-file-upload-button"]');
                    if (isFirefox && !isSafeSpot) {
                        const hideWarning = await GM_getValue('doubaoffwarning', false);
                        if (!hideWarning) {
                            insertionPoint = target;
                            btn = createDoubaoWarningButton(variant);
                            elementToInsert = btn;
                            insertionMethod = method;
                        }
                    } else {
                        insertionPoint = target;
                        btn = createDoubaoButton(variant);
                        elementToInsert = btn;
                        insertionMethod = method;
                    }
                }
            }

            // ---LONGCAT---
            else if (currentPlatform === 'longcat') {
                insertionPoint = await waitFor('.chat-input-buttons .upload-button-content', 8000);
                btn = createLongCatButton();
                elementToInsert = btn;
                insertionMethod = 'after';
            }

            // ---MISTRAL---
            else if (currentPlatform === 'mistral') {
                const fileBtn = await waitFor('[data-testid="attach-file-button"]', 8000);
                insertionPoint = fileBtn.parentElement;
                btn = createMistralButton();
                elementToInsert = btn;
                insertionMethod = 'after';
            }

            // ---TENCENT YUANBAO---
            else if (currentPlatform === 'yuanbao') {
                insertionPoint = await waitFor('.ybc-atomSelect-tools-wrapper', 8000);
                if (insertionPoint && insertionPoint.parentElement) {
                    insertionPoint.parentElement.style.display = 'flex';
                    insertionPoint.parentElement.style.alignItems = 'center';
                    insertionPoint.parentElement.style.gap = '8px';
                }
                btn = createYuanbaoButton();
                elementToInsert = btn;
                insertionMethod = 'after';
            }

            // ---CHATGLM---
            else if (currentPlatform === 'chatglm') {
                let container = document.querySelector('div.options-container.flex.flex-y-center');
                let targetType = 'original';
                let anchor = null;
                if (container) {
                    anchor = container.querySelector('.upload-image-wrap');
                }
                if (!container || !anchor) {
                    container = document.querySelector('div.options[data-v-7dc2591c]');
                    if (container) {
                        targetType = 'element1';
                        anchor = container.lastElementChild;
                    }
                }
                if (!container || !anchor) {
                    container = document.querySelector('div.options[data-v-7a34b085]');
                    if (container) {
                        targetType = 'element2';
                        anchor = container.lastElementChild;
                    }
                }
                if (!container || !anchor) {
                    container = await waitFor('.options, .options-container', 5000);
                    if (!container) return;
                    if (container.matches('[data-v-7dc2591c]')) {
                         targetType = 'element1';
                         anchor = container.lastElementChild;
                    } else if (container.matches('[data-v-7a34b085]')) {
                         targetType = 'element2';
                         anchor = container.lastElementChild;
                    } else {
                         targetType = 'original';
                         anchor = container.querySelector('.upload-image-wrap');
                    }
                }
                if (!container || !anchor) return;
                btn = container.querySelector('[data-testid="composer-button-prompts"]');
                if (!btn) {
                    btn = createChatGLMButton(targetType);
                }
                elementToInsert = btn;
                insertionPoint = anchor;
                insertionMethod = 'after';
            }

            // ---POE---
            else if (currentPlatform === 'poe') {
                insertionPoint = await waitFor('div[class*="ChatMessageInputContainer_actionContainerLeft"]', 8000);
                btn = createPoeButton();
                elementToInsert = btn;
                insertionMethod = 'append';
            }

            // ---GOOGLE MODO IA---
            else if (currentPlatform === 'googleModoIA') {
                btn = createGoogleModoIAButton();
                elementToInsert = btn;
                insertionMethod = 'handled_manually';
                insertionPoint = document.body;
                const PARTIAL_ICON_PATH = "M440-440H200";
                setInterval(() => {
                    const candidates = document.querySelectorAll('button.uMMzHc');
                    let targetAnchor = null;
                    for (const candidate of candidates) {
                        if (!candidate.offsetParent) continue;
                        const svgPath = candidate.querySelector('path');
                        if (svgPath) {
                            const dAttr = svgPath.getAttribute('d');
                            if (dAttr && dAttr.includes(PARTIAL_ICON_PATH)) {
                                targetAnchor = candidate;
                                break;
                            }
                        }
                    }
                    if (targetAnchor && targetAnchor.nextSibling !== btn) {
                        targetAnchor.insertAdjacentElement('afterend', btn);
                    }
                }, 500);
            }

            // ---NOTEBOOKLM---
            else if (currentPlatform === 'notebooklm') {
                const sendButton = await waitFor('button.submit-button', 8000);
                if (!sendButton) return;
                btn = createNotebookLMButton();
                sendButton.parentNode.insertBefore(btn, sendButton);
                elementToInsert = btn;
                insertionPoint = sendButton.parentNode;
                insertionMethod = 'handled_manually';
            }

            // ---VERIFICAÇÃO FINAL---
            if (!btn || !insertionPoint) return;
            const editorEl = document.querySelector(platformSelectors[currentPlatform]);
            if (editorEl) {
                setupInlineSuggestion(editorEl);
            } else {
                setTimeout(() => {
                    const retryEditor = document.querySelector(platformSelectors[currentPlatform]);
                    if (retryEditor) setupInlineSuggestion(retryEditor);
                }, 1000);
            }
            currentButton   = elementToInsert;
            const clickable = btn;
            if      (insertionMethod === 'append'){insertionPoint.appendChild(elementToInsert);}
            else if (insertionMethod === 'before'){insertionPoint.parentNode.insertBefore(elementToInsert, insertionPoint);}
            else if (insertionMethod === 'after' ){insertionPoint.parentNode.insertBefore(elementToInsert, insertionPoint.nextSibling);}
            if      (currentPlatform === 'grok'  ){applyGrokPadding();}
            else if (currentPlatform === 'chatglm'){applyChatGLMCustomStyles();}

            // ---INICIALIZAR INTERFACE---
            currentMenu = createPromptMenu();
            currentModal = createPromptModal();
            languageModal = createLanguageModal();
            currentPlaceholderModal = createPlaceholderModal();
            infoModal = createInfoModal();
            warningModal = createFirefoxWarningModal();
            document.body.appendChild(currentMenu);
            document.body.appendChild(currentModal);
            document.body.appendChild(languageModal);
            document.body.appendChild(currentPlaceholderModal);
            document.body.appendChild(infoModal);
            document.body.appendChild(warningModal);
            clickable.addEventListener('click', e => {
                e.stopPropagation();
                e.preventDefault();
                if (clickable.querySelector('[data-is-warning="true"]')) {
                    showModal(warningModal);
                    return;
                }
                const menu = currentMenu;
                if (menu.classList.contains('visible')) {
                    closeMenu();
                    return;
                }
                refreshMenu().then(() => {
                    positionMenu(menu, clickable);
                    menu.classList.add('visible');
                    setTimeout(() => {
                        const list = menu.querySelector('#prompt-menu-list-el');
                        if (list && list.updateScrollArrows) {
                            list.updateScrollArrows();
                        }
                    }, 250);
                });
            });

            currentModal.querySelector('#__ap_save').onclick = async (e) => {
                e.stopPropagation();
                const index = parseInt(currentModal.dataset.index, 10);
                const title = document.getElementById('__ap_title').value.trim();
                const text = document.getElementById('__ap_text').value.trim();
                const usePlaceholders = document.getElementById('__ap_use_placeholders').checked;
                const autoExecute = document.getElementById('__ap_auto_execute').checked;
                if (!title || !text) { alert(getTranslation('requiredFields')); return; }
                const newItem = {
                    title,
                    text,
                    usePlaceholders,
                    autoExecute,
                    activeFileIds: Array.from(currentActiveFileIds)
                };
                const op = index > -1 ? update(index, newItem) : addItem(newItem);
                op.then(() => {
                    hideModal(currentModal);
                    refreshMenu();
                    currentActiveFileIds.clear();
                });
            };

            currentModal.querySelector('#__ap_close_prompt').onclick = (e) => {
                e.stopPropagation();
                hideModal(currentModal);
            };

            // ---PROMPT DINÂMICO PT3---
            currentPlaceholderModal.querySelector('#__ap_insert_prompt').onclick = async (e) => {
                e.stopPropagation();
                const isFromInline = currentPlaceholderModal.dataset.fromInline === "true";
                const parseData = JSON.parse(currentPlaceholderModal.dataset.parseData);
                const originalItem = JSON.parse(currentPlaceholderModal.dataset.originalItem);
                const index = parseInt(currentPlaceholderModal.dataset.index, 10);
                let finalText = parseData.processedText;
                const ignoreMap = new Map(parseData.ignoreMap);
                const selectMap = new Map(parseData.selectMap);
                const inputMap = new Map(parseData.inputMap);
                const variablesToApply = [];
                const container = document.getElementById('__ap_placeholders_container');
                inputMap.forEach((data, key) => {
                    const inputEl = container.querySelector(`textarea[data-key="${key}"]`);
                    const val = inputEl ? inputEl.value : '';
                    finalText = finalText.replace(key, val);
                    if (typeof data === 'object' && data.varName) {
                        variablesToApply.push({ name: data.varName, value: val });
                    }
                });
                selectMap.forEach((_data, key) => {
                    const group = container.querySelector(`div[data-select-key="${key}"]`);
                    const checked = Array.from(group.querySelectorAll('input:checked'));
                    const selectedText = checked.map(cb => cb.value).join('\n');
                    finalText = finalText.replace(key, selectedText);
                });
                variablesToApply.forEach(v => {
                    const escapedVar = v.name.replace(/\$/g, '\\$');
                    const varRegex = new RegExp(escapedVar, 'g');
                    finalText = finalText.replace(varRegex, v.value);
                });
                ignoreMap.forEach((content, key) => {
                    finalText = finalText.replace(key, content);
                });
                if (isFromInline && currentPlaceholderModal._savedCursor) {
                    const saved = currentPlaceholderModal._savedCursor;
                    const editor = document.querySelector(platformSelectors[currentPlatform]);
                    if (editor) {
                        editor.focus();
                        try {
                            if (saved.type === 'input') {
                                if (typeof editor.setSelectionRange === 'function') {
                                    editor.setSelectionRange(saved.start, saved.end);
                                }
                            } else if (saved.type === 'contenteditable' && saved.node) {
                                const sel = window.getSelection();
                                const range = document.createRange();
                                range.setStart(saved.node, saved.offset);
                                range.setEnd(saved.node, saved.offset);
                                sel.removeAllRanges();
                                sel.addRange(range);
                            }
                        } catch(err) {}
                    }
                }
                const finalPrompt = { ...originalItem, text: finalText };
                await insertPrompt(finalPrompt, index, isFromInline, isFromInline);
                currentPlaceholderModal.dataset.fromInline = "false";
                currentPlaceholderModal._savedCursor = null;
                hideModal(currentPlaceholderModal);
            };

            currentPlaceholderModal.querySelector('#__ap_close_placeholder').onclick = (e) => {
                e.stopPropagation();
                hideModal(currentPlaceholderModal);
            };

            currentModal.querySelector('#__ap_info_btn').onclick = (e) => {
                e.stopPropagation();
                showModal(infoModal);
            };
            infoModal.querySelector('#__ap_close_info').onclick = (e) => {
                e.stopPropagation();
                hideModal(infoModal);
            };
            isInitialized = true;
        } catch (error) {
            cleanup();
        } finally {
            setupPageObserver();
        }
    }
    const debouncedTryInit = debounce(tryInit, 500);

    // ---OBSERVAR A PÁGINA---
    function setupPageObserver() {
        if (pageObserver) pageObserver.disconnect();
        pageObserver = new MutationObserver(() => {
            if (!document.body.contains(currentButton)) {
                debouncedTryInit();
            }
        });
        pageObserver.observe(document.body, { childList: true, subtree: true });
    }

    // ---EVENTOS GLOBAIS---
    function setupGlobalEventListeners() {
        document.addEventListener('click', ev => {
            if (!currentMenu || !currentButton) return;
            if (ev.target.closest('#prompt-menu-container, [data-testid="composer-button-prompts"]')) return;
            closeMenu();
        });
        document.addEventListener('keydown', ev => {
            if (ev.key === 'Escape') {
                closeMenu();
                if (currentModal && currentModal.classList.contains('visible')) hideModal(currentModal);
                if (languageModal && languageModal.classList.contains('visible')) hideModal(languageModal);
                if (currentPlaceholderModal && currentPlaceholderModal.classList.contains('visible')) hideModal(currentPlaceholderModal);
            }
        });
        window.addEventListener('resize', debounce(() => {
            if (currentMenu && currentMenu.classList.contains('visible')) {
                positionMenu(currentMenu, currentButton);
            }
        }, 100));
    }

    function tryInit() {
        if (isInitializing) return;
        if (isInitialized && currentButton && document.body.contains(currentButton) && currentPlatform === detectPlatform()) {
            return;
        }
        isInitializing = true;
        initUI().finally(() => { isInitializing = false; });
    }

    async function start() {
        await determineLanguage();
        injectGlobalStyles();
        setupGlobalEventListeners();
        GM_registerMenuCommand(getTranslation('languageSettings'), () => {
            if (!languageModal) {
                languageModal = createLanguageModal();
                document.body.appendChild(languageModal);
            }
            showModal(languageModal);
        });
        tryInit();
    }
    start();
    // #endregion
})();