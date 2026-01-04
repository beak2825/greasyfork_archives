// ==UserScript==
// @name        Real-Time-Rate-Limiting-Queue
// @namespace   github.com/JasonAMelancon
// @version     1.0.10
// @author      Jason Melancon
// @license     MIT (https://mit-license.org/)
// @description If more requests are made within the specified interval than the specified number, it waits until the oldest one is older than the interval before making the next request in the queue.
// @description:af       As meer versoeke binne die gespesifiseerde interval gemaak word as die gespesifiseerde aantal, wag dit totdat die oudste een ouer as die interval is voordat die volgende versoek in die ry gemaak word
// @description:am       ከታወቀው ትክክለኛ በላይ ብዙ ጥያቄዎች በተገለፀው ጊዜ ከፈለጉ ከፈለጉ ብዙ ከሆነ፣ ከዚያ በፊት እስካሁን ያለው አንዱ ከቆይታው አለፈ ድረስ የቀጣዩን ጥያቄ እንዳይሰጥ ይጠብቃል
// @description:ar       إذا تم إجراء المزيد من الطلبات داخل الفاصل الزمني المحدد أكثر من العدد المحدد، فإنه ينتظر حتى يصبح أقدم طلب أقدم من الفاصل الزمني قبل إجراء الطلب التالي في قائمة الانتظار
// @description:az       Əgər müəyyən edilmiş intervalda göstərilən sayıdan daha çox sorğu edilərsə, növbədə növbəti sorğunu etməzdən əvvəl ən köhnəsinin intervaldan daha köhnə olmasını gözləyir
// @description:be       Калі ў паказаным інтэрвале робіцца больш запытаў, чым паказана, ён чакае, пакуль самы стары не стане старэйшым за інтэрвал, перш чым зрабіць наступны запыт у чарзе
// @description:bg       Ако се направят повече заявки в посочения интервал от зададения брой, той изчаква, докато най-старият не е по-стар от интервала, преди да направи следващата заявка в опашката
// @description:bn       নির্দিষ্ট ইন্টারভালে নির্দিষ্ট সংখ্যার চেয়ে বেশি অনুরোধ করা হলে, এটি কিউতে পরবর্তী অনুরোধটি করার আগে অপেক্ষা করে যতক্ষণ না সবচেয়ে পুরোনো অনুরোধটি ইন্টারভালের চেয়ে বেশি পুরোনো হয়
// @description:bs       Ako se u određenom intervalu izvrši više zahtjeva nego što je navedeni broj, čeka dok najstariji ne bude stariji od intervala prije nego što pošalje sljedeći zahtjev u redu
// @description:ca       Si es fan més sol·licituds dins de l'interval especificat que el nombre especificat, espera fins que la més antiga sigui més antiga que l'interval abans de fer la següent sol·licitud a la cua
// @description:cs       Pokud je v zadaném intervalu prováděno více požadavků než určený počet, čeká, dokud nejstarší nebude starší než interval, než provede následující požadavek ve frontě
// @description:cy       Os ceir mwy o geisiadau yn cael eu h wneud o fewn yr interval penodedig nag y nifer penodedig, mae'n aros tan fod y henaf yn hŷn na'r interval cyn gwneud y cais nesaf yn y ciw
// @description:da       Hvis der foretages flere anmodninger inden for det angivne interval end det angivne antal, venter den, indtil den ældste er ældre end intervallet, før den foretager den næste anmodning i køen
// @description:de       Wenn innerhalb des angegebenen Intervalls mehr Anfragen gestellt werden als die angegebene Anzahl, wartet es, bis die älteste Anfrage älter als das Intervall ist, bevor die nächste Anfrage in der Warteschlange gestellt wird
// @description:el       Εάν γίνουν περισσότερα αιτήματα μέσα στο καθορισμένο διάστημα από τον καθορισμένο αριθμό, περιμένει μέχρι το παλαιότερο να είναι παλαιότερο από το διάστημα πριν κάνει το επόμενο αίτημα στην ουρά
// @description:es       Si se realizan más solicitudes dentro del intervalo especificado que el número especificado, espera hasta que la más antigua sea anterior al intervalo antes de realizar la siguiente solicitud en la cola
// @description:et       Kui määratud intervalli jooksul tehakse rohkem päringuid kui määratud arv, ootab see, kuni vanim on intervallist vanem, enne kui teeb järgmise päringu järjekorras
// @description:fa       اگر در بازهٔ مشخص شده بیش از تعداد مشخص درخواست ارسال شود، تا زمانی که قدیمی‌ترین درخواست از آن بازه قدیمی‌تر شود منتظر می‌ماند و سپس درخواست بعدی را در صف ارسال می‌کند
// @description:fi       Jos määritetyssä jaksossa tehdään enemmän pyyntöjä kuin määritetty määrä, se odottaa, kunnes vanhin on vanhempi kuin jakso, ennen kuin tekee seuraavan pyynnön jonossa
// @description:fil      Kung higit na kahilingan ang ginawa sa loob ng tinukoy na agwat kaysa sa tinukoy na bilang, naghihintay ito hanggang ang pinakaluma ay mas matanda kaysa sa agwat bago gawin ang susunod na kahilingan sa pila
// @description:fr       Si plus de requêtes sont effectuées dentro de l'intervalle spécifié que le nombre spécifié, il attend que la plus ancienne soit plus ancienne que l'intervalle avant d'effectuer la requête suivante dans la file d'attente
// @description:ga       Má dhéanfar tuilleadh iarratas laistigh den eatramh sonraithe ná an líon sonraithe, fanann sé go mbeidh an ceann is sine níos sine ná an eatramh sula ndéanfaidh sé an chéad iarratas eile sa stac
// @description:gl       Se se fan máis solicitudes dentro do intervalo especificado que o número especificado, espera ata que a máis antiga sexa máis antiga que o intervalo antes de facer a seguinte solicitude na cola
// @description:gu       જો નિર્ધારિત વિરુદ્ધમાં નિર્ધારિત સંખ્યાથી વધારે વિનંતીઓ થાય તો તે જૂની વિનંતી ઇન્ટર્વલ કરતા મોટી થાય ત્યાંગાલે કતારમાંથી આગામી વિનંતી કરવાની પહેલાં રાહ જુએ છે
// @description:he       אם מבוצעות בקשות רבות יותר בתוך הטווח המוגדר מאשר המספר שצויין, הוא ממתין עד שהבקשה הבסיסית תהיה ישנה יותר מהטווח לפני שהוא מבצע את הבקשה הבאה בתור
// @description:hi       यदि निर्दिष्ट अंतराल के भीतर निर्दिष्ट संख्या से अधिक अनुरोध किए जाते हैं, तो यह कतार में अगला अनुरोध करने से पहले तब तक प्रतीक्षा करता है जब तक सबसे पुराना अनुरोध उस अंतराल से पुराना न हो जाए
// @description:hr       Ako se u navedenom intervalu izvrši više zahtjeva nego navedeni broj, čeka dok najstariji ne bude stariji od intervala prije nego što pošalje sljedeći zahtjev u redu
// @description:hu       Ha a megadott időközön belül több kérés érkezik, mint a megadott szám, megvárja, amíg a legrégebbi régebbi lesz az időköznél, mielőtt elküldi a következő kérést a sorban
// @description:hy       Եթե նշված միջակայքի ընթացքում կատարվում է նշված թվից ավելի հարցում, այն սպասում է մինչև ամենահնագույնը միջակայքից ավելի հին դառնա, նախքան հաջորդ հարցումը կատարելը շարքում
// @description:id       Jika lebih banyak permintaan dibuat dalam interval yang ditentukan daripada jumlah yang ditentukan, itu menunggu sampai yang tertua lebih tua dari interval sebelum membuat permintaan berikutnya dalam antrean
// @description:is       Ef fleiri fyrirspurnir eru gerðar innan tiltekins bils en tiltekna fjöldann, bíður það þar til það elsta er eldra en bilið áður en það gerir næstu fyrirspurn í biðröðinni
// @description:it       Se vengono effettuate più richieste all'interno dell'intervallo specificato rispetto al numero specificato, attende che la più vecchia sia più vecchia dell'intervallo prima di effettuare la richiesta successiva nella coda
// @description:ja       指定された間隔内に指定された数より多くのリクエストが行われた場合、キュー内の次のリクエストを行う前に、最も古いリクエストがその間隔より古くなるまで待機します
// @description:ka       თუ მითითებულ ინტერვალში მითითებულზე მეტი შეკვეთა გაკეთდება, ის დაელოდება, სანამ ყველაზე ძველი უფრო ძველი გახდება ინტერვალზე, სანამ რიგში შემდეგი მოთხოვნა გაკეთდება
// @description:kk       Егер көрсетілген аралықта көрсетілген саннан көп сұрау жасалса, ол кезектегі келесі сұрауды жасамас бұрын ең ескі сұрау аралықтан үлкен болуын күтеді
// @description:km       ប្រសិនបើបានធ្វើការស្នើរសុំច្រើនជាងចំនួនដែលបានកំណត់ក្នុងរយៈពេលដែលបានកំណត់ វានឹងរង់ចាំរហូតដល់សំណើចាស់បំផុតចាស់ជាងរយៈពេលមុននឹងធ្វើសំណើបន្ទាប់ក្នុងជួរ
// @description:kn       ನಿರ್ದಿಷ್ಟ_INTERVAL ಒಳಗೆ ನಿರ್ದಿಷ್ಟ ಸಂಖ್ಯೆಗೆ ಹೆಚ್ಚು ವಿನಂತಿಗಳು ನಡೆದರೆ, ಕ್ಯೂಯಲ್ಲಿ ಮುಂದಿನ ವಿನಂತಿಯನ್ನು ಮಾಡಲು ಮೊದಲು ಅತಿ ಹಳೆಯದು ಆ ಇಂಟರ್ವಲ್‌ಗಿಂತ ಹಳೆಯದಾಗುವವರೆಗೆ ಅದನ್ನೆ ಕಾಯುತ್ತದೆ
// @description:ko       지정된 간격 내에 지정된 수보다 많은 요청이 발생하면 큐에서 다음 요청을 하기 전에 가장 오래된 요청이 해당 간격보다 오래될 때까지 대기합니다
// @description:ku       Heke di navbera diyarkirî de ji hejmarê diyarkirî zêdetir daxwazên hatine kirin, ew li benda ku herî kevn yê ji navbera mezin be derbas dike berî ku daxwaza din li rêza were kirin
// @description:lo       ໂດຍຫາກມີການຮ້ອງຂໍຫຼາຍກວ່າຈໍານວນທີ່ກໍານົດໃນໄລຍະທີ່ກໍານົດ, ມັນຈະລໍຖ້າຈົນກ່ອນທີ່ຈະເຮັດຄໍາຮ້ອງຂໍຕໍ່ໄປໃນຄັ້ງຕໍ່ໄປ ຈົນການຮ້ອງຂໍເກີນອາຍຸກວ່າໄລຍະທີ່ກໍານົດ
// @description:lt       Jei nurodytame intervale pateikiama daugiau užklausų nei nurodytas skaičius, jis laukia, kol seniausias bus senesnis už intervalą, prieš atlikdamas kitą užklausą eilėje
// @description:lv       Ja norādītajā intervālā veic vairāk pieprasījumu nekā norādītais skaits, tas gaida, kamēr vecākais kļūs vecāks par intervālu, pirms veic nākamo pieprasījumu rindā
// @description:mk       Ако се направат повеќе барања во зададениот интервал отколку зададениот број, тоа чека додека најстарото не биде постаро од интервалот пред да го направи следното барање во редот
// @description:ml       നിർദ്ദിഷ്ട ഇടവേളയ്ക്കുള്ളിൽ നിർദ്ദിഷ്ട സംഖ്യയേക്കാൾ കൂടുതൽ അഭ്യർഥനകൾ ചെയ്താൽ, ക്യൂവിലെ അടുത്ത അഭ്യർഥന നിർവഹിക്കുന്നത് മുൻപ് പഴയ അഭ്യർഥനം ഇടവേളയേക്കാൾ പഴക്കമേറിയവൾ ആകുന്നതുവരെ കാത്തിരിക്കും
// @description:mn       Хэрэв заасан завсарт заасан тооноос илүү хүсэлт ирсэн бол ээргийн дараалал дахь удаагийн хүсэлтийг хийхээс өмнө хамгийн хуучин нь тухайн завсраас хэтэрцгэсэн эсэхийг хүлээнэ
// @description:mr       जर निर्दिष्ट अंतरालात निर्दिष्ट संख्येपेक्षा अधिक विनंत्या केल्या गेल्या तर, ती सर्वात जुन्या विनंती त्या अंतरालापेक्षा जुनी होईपर्यंत पुढील विनंती करण्यापूर्वी थांबते
// @description:ms       Jika lebih banyak permintaan dibuat dalam selang yang ditetapkan daripada bilangan yang ditetapkan, ia menunggu sehingga yang tertua adalah lebih tua daripada selang sebelum membuat permintaan seterusnya dalam barisan
// @description:mt       Jekk ikunu saru aktar tal-mistoqsijiet fl-intervall speċifikat milli n-numru speċifikat, jistenna sa jkun l-iktar antik aktar antik mill-intervall qabel jagħmel it-talba li jmiss fil-kju
// @description:nb       Hvis flere forespørsler gjøres innenfor det angitte intervallet enn det angitte antallet, venter den til den eldste er eldre enn intervallet før den gjør neste forespørsel i køen
// @description:ne       निर्दिष्ट अन्तराल भित्र निर्दिष्ट संख्याभन्दा बढी अनुरोधहरू गरिएमा, यसले क्यूमा अर्को अनुरोध गर्नु अघि सबैभन्दा पुरानो अनुरोध उक्त अन्तराल भन्दा पुरानो नहुन्जेल पर्खन्छ
// @description:nl       Als er binnen het opgegeven interval meer verzoeken worden gedaan dan het opgegeven aantal, wacht het totdat de oudste ouder is dan het interval voordat het het volgende verzoek in de wachtrij doet
// @description:nn       Hvis fleire førespurnader blir gjort innanfor det angivne intervallet enn det angivne talet, ventar det til den eldste er eldre enn intervallet før det gjer neste førespurnad i køa
// @description:or       ନିର୍ଦ୍ଦିଷ୍ଟ ଇଣ୍ଟରଭାଲ ମଧ୍ୟରେ ନିର୍ଦ୍ଦିଷ୍ଟ ସଂଖ୍ୟାଠାରୁ ଅଧିକ ଅନୁରୋଧ ହେଲେ, ଏହା କ୍ୟୁରେ ପରବର୍ତ୍ତୀ ଅନୁରୋଧକୁ କରିବା ପୂର୍ବରୁ ସବୁଠାରୁ ପୁରୁଣାଟି ଇଣ୍ଟରଭାଲଠାରୁ ପୁରୁଣା ନହେଲା ପର୍ଯ୍ୟନ୍ତ ଅପେକ୍ଷା କରେ
// @description:pa       ਜੇ ਨਿਰਧਾਰਤ ਅੰਤਰਾਲ ਦੇ ਅੰਦਰ ਨਿਰਧਾਰਤ ਗਿਣਤੀ ਤੋਂ ਵੱਧ ਬੇਨਤੀਆਂ ਕੀਤੀਆਂ ਜਾਂਦੀਆਂ ਹਨ, ਤਾਂ ਇਹ ਕਤਾਰ ਵਿੱਚ ਅਗਲੀ ਬੇਨਤੀ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਸਭ ਤੋਂ ਪੁਰਾਨੇ ਦੀ ਉਮਰ ਉਸ ਅੰਤਰਾਲ ਤੋਂ ਵੱਧ ਹੋਣ ਤੱਕ ਉਡੀਕ ਕਰਦਾ ਹੈ
// @description:pl       Jeśli w określonym przedziale zostanie wykonanych więcej żądań niż określona liczba, oczekuje, aż najstarsze będzie starsze niż interwał, zanim wykona kolejne żądanie w kolejce
// @description:ps       که په ټاکل شوي فاصله کې د ټاکل شوي شمېر څخه ډیر غوښتنې وشي، نو دا به تر هغه وخته پورې انتظار وباسي تر څو ترټولو زوړ له فاصله څخه زوړ شي مخکې له دې چې په قطار کې بل غوښتنه وکړي
// @description:pt       Se forem feitas mais solicitações dentro do intervalo especificado do que o número especificado, aguarda até que a mais antiga seja mais antiga do que o intervalo antes de fazer a próxima solicitação na fila
// @description:ro       Dacă se fac mai multe cereri în intervalul specificat decât numărul specificat, așteaptă până când cea mai veche este mai veche decât intervalul înainte de a face următoarea cerere din coadă
// @description:ru       Если в заданном интервале сделано больше запросов, чем указанное число, он ждёт, пока самый старый не станет старше интервала, прежде чем выполнить следующий запрос в очереди
// @description:si       එම පරාසය තුළ සඳහන් සංඛ්‍යාවට වඩා වැඩි ඉල්ලීම් සිදු වුවහොත්, එය පේලියේ නැවත ඉල්ලීම කිරීමෙන් පෙර පැරණිම ඉල්ලීම පරාසයට වඩා පැරණියි ද යන්න සඳහා රැඳී සිටී
// @description:sk       Ak sa v určenom intervale vykoná viac požiadaviek než určené množstvo, čaká, kým najstaršia bude staršia ako interval, predtým než vykoná ďalšiu požiadavku v rade
// @description:sl       Če se v določenem časovnem intervalu izvede več zahtevkov, kot je določeno število, čaka, dokler najstarejši ni starejši od obdobja, preden izvede naslednji zahtevček v vrsti
// @description:sq       Nëse brenda intervalit të caktuar bëhen më shumë kërkesa se numri i caktuar, pret derisa e vjetra të jetë më e vjetër se intervali përpara se të bëjë kërkesën tjetër në radhë
// @description:sr       Ako se u određenom intervalu napravi više zahteva nego što je određeno, čeka dok najstariji ne bude stariji od intervala pre nego što napravi sledeći zahtev u redu
// @description:sv       Om fler förfrågningar görs inom det angivna intervallet än det angivna antalet, väntar det tills den äldsta är äldre än intervallet innan det gör nästa förfrågan i kön
// @description:sw       Iki maombi zaidi yamefanywa ndani ya kipindi kilichotajwa kuliko idadi iliyoainishwa, inangoja hadi ile ya zamani iwe na umri zaidi ya kipindi kabla ya kufanya ombi linarofuata katika foleni
// @description:ta       குறிப்பிட்ட காலப்பகுதியுக்குள் குறிப்பிடப்பட்ட எண்ணிக்கையில் மேலும் கோரிக்கைகள் உள்ளளவிற்கு, அப்பாற்பட்டு மிகவும் பழமையானது கால அவகாசத்திற்குப் பழமையானது மூடியே அடுத்த கோரிக்கையை நிறைவேற்றுகிறது.
// @description:te       నిర్ధారించిన కాలపరిమితిలో నిర్ధిష్ట సంఖ్య కంటే ఎక్కువ అభ్యర్థనలు చేయబడితే, తదుపరి అభ్యర్థన అడిగే క్రమంలో పెరుగుదల చేసేటవరకూ అటువంటి అత్యంత పురాతనంగా ఉన్నది కాలపరిమితిని దాటుతుంది
// @description:th       หากมีการทำคำขอมากกว่าหมายเลขที่กำหนดภายในช่วงเวลาที่กำหนด จะรอจนกว่าคำขอที่เก่าที่สุดจะมีอายุมากกว่าช่วงเวลาก่อนที่จะทำคำขอถัดไปในคิว
// @description:tl       Kung mas maraming kahilingan ang nagawa sa loob ng tinakdang agwat kaysa sa tinakdang bilang, naghihintay ito hanggang ang pinakamatanda ay higit sa agwat bago gawin ang susunod na kahilingan sa pila
// @description:tr       Belirtilen aralıkta belirtilen sayıdan daha fazla istek yapıldığında, sıradaki isteği yapmadan önce en yaşlının aralıktan daha eski olmasını bekler
// @description:uk       Якщо в зазначеному інтервалі зроблено більше запитів, ніж зазначена кількість, він чекає, поки найстаріший не стане старшим за інтервал, перш ніж зробити наступний запит у черзі
// @description:ur       اگر متعین شدہ وقفے کے اندر متعین تعداد سے زیادہ درخواستیں کی جائیں تو یہ انتظار کرتا ہے جب تک کہ سب سے پرانی درخواست وقفے سے زیادہ پرانی نہ ہو جائے اس سے پہلے کہ فہرست میں اگلی درخواست کی جائے
// @description:uz       Agar belgilangan interval ichida belgilangan raqamdan ko'proq so'rovlar yuborilsa, navbatdagi so'rovni amalga oshirishdan oldin eng qadimgisi intervaldan katta bo'lishini kutadi
// @description:vi       Nếu nhiều yêu cầu được thực hiện trong khoảng thời gian xác định hơn số lượng xác định, nó sẽ chờ cho đến khi yêu cầu cũ nhất lớn hơn khoảng thời gian trước khi thực hiện yêu cầu tiếp theo trong hàng đợi
// @description:xh       Ukuba kunyulwe iintshukumo ezininzi ngaphakathi kwixesha elichaziwe kuyo, ukhangela kuze kube sekuqalisile ukungena okanye umnqweno oluhamba phambili hot
// @description:yi       אויב מער ערלויבט אין דער באַשטימטער צייט און פאַרשטייער אין דער באַשטימטער צאָל, גייט ער ווי אַזוי, ביז די עלטערסטע איז עלטער ווי דער אינטערוואַל, איידער ער לייסט די ווייַטערדיקע וואָרט אין דער קייער
// @description:zh-CN    如果在指定的时间间隔内发送的请求超过了指定的数量，它会等到最旧的请求比时间间隔更旧，然后再处理队列中的下一个请求
// @description:zh-TW    如果在指定的時間間隔內發出了超過指定數量的請求，它會等待直到最舊的請求比該時間間隔更舊，然後再處理隊列中的下一個請求
// @supportURL  https://greasyfork.org/en/scripts/559799-real-time-rate-limiting-queue/feedback
// @homepageURL https://greasyfork.org/en/scripts/559799-real-time-rate-limiting-queue
// @require     https://update.greasyfork.org/scripts/559642/1722326/Denque-on-Greasy-Fork.js
// ==/UserScript==

// Copyright (c) 2025 by Jason Melancon
// uses Mike Diarmid's (https://github.com/Salakar) Denque module (https://github.com/invertase/denque)

/* jshint esversion: 11 */
/* jshint moz: true */

function getRtrlqClass() {

const Deque = getDenqueClass();

/**
 * Real-time, rate-limiting queue (RTRLQ). If more requests are made within the
 * specified interval than the specified number, it waits until the oldest one is
 * older than the interval before making the next request in the queue.
 */
class Rtrlq {
    #executionQueue; // entry queue; only backs up when expiry queue is full
    #expiryQueue; // holds executed items temporarily; if full, blocks execution
    #reqPerInterval = 1; // requests per interval; numerator of queue rate parameter
    #interval = 0; // denominator of queue rate parameter in ms
    #concurrent = true; // false if each item waits for the last to finish before executing
    #maxConcurrent; // maximum number of simultaneous requests in flight

    /**
     * Instantiates the queue.
     * @param reqPerInterval Requests per interval. The numerator of the queue rate
     * parameter. Will be set to the default of 1 if not a valid positive number.
     * @param interval The denominator of the queue rate parameter in milliseconds.
     * Will be set to the default of 0 if not a valid non-negative number. 0 disables
     * rate limit.
     * @param concurrent Pass in false if each item should wait for the last to finish
     * before executing. Only inherently asynchronous operations may be concurrent.
     * @param {Array} array Can be supplied if the desired item queue exists as an
     * array already. Note that queue execution only begins on enqueueing an object.
     * @param {Object} dequeOptions Passed on to internal deque class, which currently
     * ignores it. See Denque module (https://github.com/invertase/denque).
     * @constructor
     */
    constructor(reqPerInterval, interval, concurrent, array, dequeOptions) {
        if (reqPerInterval) {
            const numReqs = Number(reqPerInterval);
            if (Number.isFinite(numReqs) && numReqs > 0) {
                this.#reqPerInterval = Math.floor(numReqs);
            } else {
                console.log(`${this.constructor.name}: Requests per interval ("${reqPerInterval}") invalid; ` +
                            `setting to ${this.#reqPerInterval}`);
            }
        }
        if (interval) {
            const numInterval = Number(interval);
            if (Number.isFinite(numInterval) && numInterval >= 0) {
                this.#interval = Math.floor(numInterval);
            } else {
                console.log(`${this.constructor.name}: Interval ("${interval}") invalid; ` +
                            `setting to ${this.#interval}`);
            }
        }
        if (concurrent !== undefined) this.#concurrent = !!concurrent;
        this.#maxConcurrent = this.#concurrent ? Math.max(1, this.#reqPerInterval) : 1;

        this.#executionQueue = new Deque(array, dequeOptions);
        this.#expiryQueue = new Deque([], { capacity: this.#reqPerInterval });
    }

    /**@returns {Number} the numerator of the requests per interval rate parameter. */
    getReqPerInterval() { return this.#reqPerInterval; }

    /**@returns {Number} the denominator of the rate parameter, in ms. */
    getInterval() { return this.#interval; }

    /**@returns {boolean} the boolean specifying whether requests are executed in parallel. */
    isConcurrent() { return this.#concurrent; }

    /**
     * Enqueue the item object itself (not a copy).
     * @param {Object} item To be useful, this must have a function in its "executor"
     * or "callback" property. This is the request whose rate of calling will be
     * controlled. If supplied, the executor property must contain a function of the
     * kind that Promise() takes. If there is a callback and no executor, the callback
     * should return either a truthy value (which may be a result), or a falsy value
     * indicating failure. In either case, the item will be given a "timestamp"
     * property containing the javascript datetime of the request execution, a boolean
     * "success" property, and a "promise" property containing a Promise,
     * automatically constructed from the executor if supplied, holding the result of
     * the request. Rejected Promises and failed callbacks will not count toward the
     * rate limit. These should result from, for example, fetching an invalid URL or
     * having no network, but not from a 404 Not Found, which would typically still
     * count since it requires server time.
     * @returns a Promise that resolves to the supplied item once its promise
     * property is settled. Do not confuse these two promises! This one resolves to
     * the enqueued item when its request is settled, while the Promise on the item
     * itself contains the result of the request. This is in order to make the other
     * information on the item available when the request result is accessed.
     * @example
     * const queueItem = myRtrlQueue.enqueue({
     *                      executor: (resolve, reject) => fetch(URL).then(resolve, reject),
     *                      id: 42
     *                   });
     * // ...
     * // now examine request result, along with any associated data you put on the queue item
     * queueItem.then(item => item.promise
     *     .then(response => {
     *         if (!response.ok) {
     *             throw new Error(`${response.status} - ${response.statusText}`);
     *         }
     *         return response.text();
     *     })
     *     .then(bodyText => console.log(`Queued request ${item.id} succeeded: ${bodyText}`))
     *     .catch(err =>   console.error(`Queued request ${item.id} failed: ${err}`)));
     */
    enqueue(item) {
        // There's no dequeue() method; items fall out of the queue when they are ready.
        // This method returns a Promise that resolves when this happens.
        const dequeuePromise = new Promise(resolve => item.dequeue = resolve);
        this.#executionQueue.push(item);
        this.#executionLoop();
        return dequeuePromise;
    }

    #activeRequests = 0;
    #loopIsRunning = false;
    #executionLoop() {
        if (this.#loopIsRunning) return;
        this.#loopIsRunning = true;

        try {
            // start items up to concurrency limit
            while (!this.#executionQueue.isEmpty() &&
                   this.#expiryQueue.size() + this.#activeRequests < this.#reqPerInterval &&
                   this.#activeRequests < this.#maxConcurrent) {

                const item = this.#executionQueue.shift();
                const hasExecutor = typeof item.executor === "function";
                const hasCallback = typeof item.callback === "function";

                if (!hasExecutor && !hasCallback) {
                    item.success = null;
                    dequeue(item);
                    continue;
                }

                this.#activeRequests++;

                if (hasExecutor) {
                    item.promise = new Promise(item.executor);
                } else {
                    item.promise = new Promise((resolve, reject) => {
                        try {
                            const cbResult = item.callback();
                            if (cbResult === undefined) resolve(true); // assume void fn succeeds
                            else if (cbResult) resolve(cbResult);
                            else reject(new Error(`Callback returned falsy value: ${cbResult}`));
                        } catch (ex) {
                            reject(ex);
                        }
                    });
                }

                // when promise settles, which could be after loop terminates
                item.promise
                    .then(res => {
                        item.success = true;
                        const now = Date.now();
                        item.timestamp = now;
                        this.#expiryQueue.push({ timestamp: now });
                        if (this.#expiryQueue.size() === 1) this.#startExpireTimer();
                        return res;
                    })
                    .catch(err => {
                        item.success = false;
                        return Promise.reject(err);
                    })
                    .finally(() => {
                        this.#activeRequests--;
                        dequeue(item);
                        // attempt to start more now that slot/rate may have freed
                        this.#executionLoop();
                    });
            }
        } finally {
            this.#loopIsRunning = false;
        }

        function dequeue(item) {
            const dq = item.dequeue;
            delete item.dequeue;
            if (dq) dq(item);
            else throw new Error(`No resolve on item ${item}`);
        }
    }

    #startExpireTimer() {
        const frontItem = this.#expiryQueue.peek();
        if (!frontItem.timerIsRunning) {
            frontItem.timerIsRunning = true;
            const timeRemainingOnQueue = frontItem.timestamp + this.#interval - Date.now();
            setTimeout(() => {
                this.#expiryQueue.shift();
                if (!this.#expiryQueue.isEmpty()) {
                    this.#startExpireTimer();
                }
                // rate slot freed
                this.#executionLoop();
            }, Math.max(0, timeRemainingOnQueue));
        }
    }

    /**@returns the number of ms in n hours */
    static hours(n) { return Rtrlq.minutes(60*n); }

    /**@returns the number of ms in n minutes */
    static minutes(n) { return Rtrlq.seconds(60*n); }

    /**@returns the number of ms in n seconds */
    static seconds(n) { return 1000*n; }
}

return Rtrlq;

}