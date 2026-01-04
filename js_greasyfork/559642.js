// ==UserScript==
// @name        Denque-on-Greasy-Fork
// @namespace   github.com/JasonAMelancon
// @version     2.1.0h
// @author      Jason Melancon
// @license     Apache License 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
// @description (https://github.com/Salakar) Fast, well-tested double-ended queue implementation based on ring buffer
// @description:af       (https://github.com/Salakar) Vinnige, goed-getoetste dubbel-einde wagimplementering gebaseer op 'n ringbuffer
// @description:am       (https://github.com/Salakar) ፈጣን፣ ጥራት ያለው የሁለት-ጫፍ ተሰናዳይ ክስተት ማስፈጻሚ በሪንግ ባፈር ተመሠረተ
// @description:ar       (https://github.com/Salakar) تنفيذ طابور ذو طرفين سريع ومُختبر جيدًا يستند إلى حلقة مؤقتة
// @description:az       (https://github.com/Salakar) Halqa buferinə əsaslanan, sürətli və yaxşı sınanmış iki uclu növbə tətbiqi
// @description:be       (https://github.com/Salakar) Хуткая, добра пратэставаная рэалізацыя двухканцовай чаргі, заснаваная на кольцавым буферы
// @description:bg       (https://github.com/Salakar) Бърза, добре тествана реализация на двустранна опашка, базирана на кръгов буфер
// @description:bn       (https://github.com/Salakar) রিং বাফারের উপর ভিত্তি করে দ্রুত, ভাল-পরীক্ষিত ডাবল-এন্ডেড কিউ বাস্তবায়ন
// @description:bs       (https://github.com/Salakar) Brza, dobro testirana implementacija dvostruke reda zasnovana na kružnom baferu
// @description:ca       (https://github.com/Salakar) Implementació ràpida i ben provada de cua de doble extrem basada en un buffer circular
// @description:cs       (https://github.com/Salakar) Rychlá, dobře otestovaná implementace obousměrné fronty založená na kruhovém bufferu
// @description:cy       (https://github.com/Salakar) Gweithredu ciwdi dwyran gyflym, wedi'i brofi'n dda yn seiliedig ar gronfa cylch
// @description:da       (https://github.com/Salakar) Hurtig, veldokumenteret dobbelt-ended kø-implementation baseret på ringbuffer
// @description:de       (https://github.com/Salakar) Schnelle, gut getestete Implementierung einer doppelt-enden Warteschlange basierend auf einem Ringpuffer
// @description:el       (https://github.com/Salakar) Γρήγορη, καλά δοκιμασμένη υλοποίηση διπλής ουράς βασισμένη σε κυκλικό buffer
// @description:es       (https://github.com/Salakar) Implementación rápida y bien probada de una cola de doble extremo basada en un búfer circular
// @description:et       (https://github.com/Salakar) Kiire, hästi testitud kaheotsaline järjekorra teostus, mis põhineb ringpuhvril
// @description:fa       (https://github.com/Salakar) پیاده‌سازی سریع و خوب‌آزمایش‌شده‌ی صف دوطرفه بر پایه‌ی حلقه بافر
// @description:fi       (https://github.com/Salakar) Nopea, hyvin testattu kaksipäinen jono -toteutus rengaspuskurin pohjalta
// @description:fil      (https://github.com/Salakar) Mabilis, mahusay na nasubok na implementasyon ng double-ended queue batay sa ring buffer
// @description:fr       (https://github.com/Salakar) Implémentation rapide et bien testée d'une file double extrémité basée sur un tampon circulaire
// @description:ga       (https://github.com/Salakar) Cur i bhfeidhm tapa, deimhnithe go maith ar chlib dhúbailte bunaithe ar bhuafr fáinne
// @description:gl       (https://github.com/Salakar) Implementación rápida e ben probada dunha cola dobre baseada nun buffer circular
// @description:gu       (https://github.com/Salakar) રિંગ બફર આધારિત, ઝડપી અને સારી રીતે પરીक्षित ડબલ-એન્ડેડ ક્યુ અમલ
// @description:he       (https://github.com/Salakar) מימוש מהיר ומנוסה של תור דו-קצוות המבוסס על חוצץ טבעתי
// @description:hi       (https://github.com/Salakar) रिंग बफर पर आधारित तेज़, अच्छी तरह परखा गया डबल-एंडेड क्यू का कार्यान्वयन
// @description:hr       (https://github.com/Salakar) Brza, dobro testirana implementacija dvostrukog reda bazirana na kružnom međuspremniku
// @description:hu       (https://github.com/Salakar) Gyors, jól letesztelt kétszélű sor megvalósítás gyűrűpuffer alapján
// @description:hy       (https://github.com/Salakar) Արագ, լավ փորձարկված երկվայրանի հերթի իրագործում՝ հիմնված օղակաձև բուֆերի վրա
// @description:id       (https://github.com/Salakar) Implementasi antrian dua ujung yang cepat dan teruji dengan baik berbasis ring buffer
// @description:is       (https://github.com/Salakar) Hraðvirk, vel prófuð útfærsla á tvíenda biðröð byggð á hringbakka
// @description:it       (https://github.com/Salakar) Implementazione veloce e ben testata di una coda a doppia estremità basata su buffer circolare
// @description:ja       (https://github.com/Salakar) リングバッファに基づく、高速で十分にテストされた両端キューの実装
// @description:ka       (https://github.com/Salakar) სწრაფი, კარგად შემოწმებული ორი-მხრივი რიგის იმპლემენტაცია ქიმბუფერზე დაფუძნებით
// @description:kk       (https://github.com/Salakar) Тез, жақсы тексерілген екі ұштық кезек іске асыруы, шеңбер буферіне негізделген
// @description:km       (https://github.com/Salakar) ការអនុវត្ត queue ទាំងពីរប៉ាន់ ដែលលឿន និងបានសាកល្បងល្អ ដាក់លើ ring buffer
// @description:kn       (https://github.com/Salakar) ರಿಂಗ್ ಬಫರ್ ಆಧರಿತ ವೇಗದ, ಚೆನ್ನಾಗಿ ಪರೀಕ್ಷಿಸಲಾದ ಡಬಲ್-ಎಂಡೆಡ್ ಕ್ಯೂ ಅನುಷ್ಠಾನ
// @description:ko       (https://github.com/Salakar) 링 버퍼 기반의 빠르고 충분히 테스트된 양끝 큐 구현
// @description:ku       (https://github.com/Salakar) Cihaza ring-bufferê li ser bingehîn, rêza double-endedê zû û baş testkirî
// @description:lo       (https://github.com/Salakar) ການນໍາໃຊ້ຄວບຄຸມ queue ທີ່ມີສອງທາງ ຄົບຖ້ວນ ແລະ ໄວ ອີກທັງ ທີ່ສ້າງຈາກ ring buffer
// @description:lt       (https://github.com/Salakar) Greitai, gerai išbandyta dvipusės eilės implementacija, paremta žiediniu buferiu
// @description:lv       (https://github.com/Salakar) Ātra, labi pārbaudīta divpusējas rindas īstenošana, balstīta uz apļveida buferi
// @description:mk       (https://github.com/Salakar) Брза, добро тестиранa реализација на двострана редица заснована на кружен бафер
// @description:ml       (https://github.com/Salakar) റിംഗ് ബഫറിനെ അടിസ്ഥാനമാക്കി വേഗമുള്ള, നന്നായി പരിശോധിച്ച ഡബിൾ-എൻഡഡ് ക്യൂ നിർവഹണം
// @description:mn       (https://github.com/Salakar) Шингэн буфер дээр суурилсан хурдан, сайн шалгасан хоёр үзүүртэй дараалал хэрэгжүүлэлт
// @description:mr       (https://github.com/Salakar) रिंग बफरवर आधारित वेगवान, चांगले तपासलेले डबल-एंडेड क्यू अंमलबजावणी
// @description:ms       (https://github.com/Salakar) Pelaksanaan antrean dua hujung yang pantas dan diuji dengan baik berdasarkan penimbal cincin
// @description:mt       (https://github.com/Salakar) Implimentazzjoni mgħaġġla u tajba ttestjata ta' queue bi tmiem doppju bbażata fuq ring buffer
// @description:nb       (https://github.com/Salakar) Rask, godt testet implementering av dobbelt-ended kø basert på ringbuffer
// @description:ne       (https://github.com/Salakar) रिंग बफरमा आधारित छिटो, राम्रोसँग परीक्षण गरिएको डबल-एन्डेड क्यू कार्यान्वयन
// @description:nl       (https://github.com/Salakar) Snelle, goed-geteste implementatie van een double-ended queue gebaseerd op een ringbuffer
// @description:nn       (https://github.com/Salakar) Rask, godt testa implementering av dobbel-ended kø basert på ringbuffer
// @description:or       (https://github.com/Salakar) ରିଙ୍ଗ ବଫର୍ ଉପରେ ଆଧାରିତ ଦ୍ବି-ଶେଷ କ୍ୟୁର ତତ୍କ୍ଷଣାତ୍ ଏବଂ ଭଲ ଭାବରେ ପରୀକ୍ଷିତ କରାଯାଇଛି
// @description:pa       (https://github.com/Salakar) ਰਿੰਗ ਬਫਰ ਅਧਾਰਿਤ ਤੇਜ਼, ਚੰਗੀ ਤਰ੍ਹਾਂ ਟੈਸਟ ਕੀਤੀ ਡਬਲ-ਏਂਡਿਡ ਕਿਊ ਇੰਪਲੀਮੇੰਟੇਸ਼ਨ
// @description:pl       (https://github.com/Salakar) Szybka, dobrze przetestowana implementacja kolejki obustronnej oparta na buforze pierścieniowym
// @description:ps       (https://github.com/Salakar) د رینګ بفر پراساس چټک، ښه ازمویل شوې دوه اړخیزه قطار پلي کول
// @description:pt       (https://github.com/Salakar) Implementação rápida e bem testada de fila com extremidades duplas baseada em buffer circular
// @description:ro       (https://github.com/Salakar) Implementare rapidă, bine testată, de coadă cu două capete bazată pe buffer circular
// @description:ru       (https://github.com/Salakar) Быстрая, хорошо протестированная реализация двусторонней очереди на основе кольцевого буфера
// @description:si       (https://github.com/Salakar) රිං බෆර් මත පදනම්ව නිරතුරු පරීක්ෂාකල ඉක්මන් දෙ-අන්තය කේටිය ක්‍රියාත්මක කිරීම
// @description:sk       (https://github.com/Salakar) Rýchla, dobre otestovaná implementácia obojstrannej fronty založená na kruhovom buffri
// @description:sl       (https://github.com/Salakar) Hitro, dobro preizkušena implementacija dvostranskega čakalnega seznama, osnovana na krožnem predpomnilniku
// @description:sq       (https://github.com/Salakar) Zbatim i shpejtë, i provuar mirë i radhës me dy skaje bazuar në buffer unazor
// @description:sr       (https://github.com/Salakar) Brza, dobro testirana implementacija dvostranog reda bazirana na kružnom baferu
// @description:sv       (https://github.com/Salakar) Snabb, väl testad implementering av dubbeländad kö baserad på ringbuffert
// @description:sw       (https://github.com/Salakar) Utekelezaji wa foleni yenye mwisho mara mbili, haraka na iliyojaribiwa vizuri, msingi wake ni ring buffer
// @description:ta       (https://github.com/Salakar) ரிங் பப்பருக்கு அடிப்படையாகக் கொண்டு வேகமான, நன்கு சோதிக்கப்பட்ட இரு முனை வரிசை செயலாக்கம்
// @description:te       (https://github.com/Salakar) రింగ్ బఫర్ ఆధారంగా వేగవంతమైన, బాగా పరీక్షించిన డబుల్-ఎండెಡ್ క్యూఇ అమలు
// @description:th       (https://github.com/Salakar) การนำคิวสองด้านไปใช้ที่รวดเร็วและทดสอบอย่างดี โดยอิงจากบัฟเฟอร์แบบวงแหวน
// @description:tl       (https://github.com/Salakar) Mabilis, mahusay na nasubok na implementasyon ng double-ended queue na nakabase sa ring buffer
// @description:tr       (https://github.com/Salakar) Halka arabelleğine dayalı, hızlı ve iyi test edilmiş çift uçlu kuyruk uygulaması
// @description:uk       (https://github.com/Salakar) Швидка, добре протестована реалізація двобічної черги на основі кільцевого буфера
// @description:ur       (https://github.com/Salakar) رِنگ بفر پر مبنی تیز، اچھی طرح جانچی گئی ڈبل-اینڈڈ قطار کا نفاذ
// @description:uz       (https://github.com/Salakar) Ring bufferga asoslangan, tez va yaxshi sinovdan o'tgan ikki uchli navbat ishlanmasi
// @description:vi       (https://github.com/Salakar) Triển khai hàng đợi hai đầu nhanh, được kiểm thử kỹ dựa trên bộ đệm vòng
// @description:xh       (https://github.com/Salakar) Ukuphunyezwa kweqoqo elinee-ntambo ezimbini okukhawulezayo, okuvivinyiweyo okuhle, esekwe kwi-ring buffer
// @description:yi       (https://github.com/Salakar) שנעלזאַמיגע, גוט־טעסטירטע דאַבאַל-ענדעד קיו ימפלאַמענטאַטיאָן באַזירט אויף רינג בופער
// @description:zh-CN    (https://github.com/Salakar) 基于环形缓冲区的快速且经过充分测试的双端队列实现
// @description:zh-TW    (https://github.com/Salakar) 基於環形緩衝區的快速且經充分測試的雙端隊列實作
// @description:zh-HK    (https://github.com/Salakar) 基於環形緩衝區的快速且經充分測試的雙端隊列實作
// @name:af     Denque-on-Greasy-Fork
// @name:am     Denque-on-Greasy-Fork
// @name:ar     Denque-on-Greasy-Fork
// @name:az     Denque-on-Greasy-Fork
// @name:be     Denque-on-Greasy-Fork
// @name:bg     Denque-on-Greasy-Fork
// @name:bn     Denque-on-Greasy-Fork
// @name:bs     Denque-on-Greasy-Fork
// @name:ca     Denque-on-Greasy-Fork
// @name:cs     Denque-on-Greasy-Fork
// @name:cy     Denque-on-Greasy-Fork
// @name:da     Denque-on-Greasy-Fork
// @name:de     Denque-on-Greasy-Fork
// @name:el     Denque-on-Greasy-Fork
// @name:es     Denque-on-Greasy-Fork
// @name:et     Denque-on-Greasy-Fork
// @name:fa     Denque-on-Greasy-Fork
// @name:fi     Denque-on-Greasy-Fork
// @name:fil    Denque-on-Greasy-Fork
// @name:fr     Denque-on-Greasy-Fork
// @name:ga     Denque-on-Greasy-Fork
// @name:gl     Denque-on-Greasy-Fork
// @name:gu     Denque-on-Greasy-Fork
// @name:he     Denque-on-Greasy-Fork
// @name:hi     Denque-on-Greasy-Fork
// @name:hr     Denque-on-Greasy-Fork
// @name:hu     Denque-on-Greasy-Fork
// @name:hy     Denque-on-Greasy-Fork
// @name:id     Denque-on-Greasy-Fork
// @name:is     Denque-on-Greasy-Fork
// @name:it     Denque-on-Greasy-Fork
// @name:ja     Denque-on-Greasy-Fork
// @name:ka     Denque-on-Greasy-Fork
// @name:kk     Denque-on-Greasy-Fork
// @name:km     Denque-on-Greasy-Fork
// @name:kn     Denque-on-Greasy-Fork
// @name:ko     Denque-on-Greasy-Fork
// @name:ku     Denque-on-Greasy-Fork
// @name:lo     Denque-on-Greasy-Fork
// @name:lt     Denque-on-Greasy-Fork
// @name:lv     Denque-on-Greasy-Fork
// @name:mk     Denque-on-Greasy-Fork
// @name:ml     Denque-on-Greasy-Fork
// @name:mn     Denque-on-Greasy-Fork
// @name:mr     Denque-on-Greasy-Fork
// @name:ms     Denque-on-Greasy-Fork
// @name:mt     Denque-on-Greasy-Fork
// @name:nb     Denque-on-Greasy-Fork
// @name:ne     Denque-on-Greasy-Fork
// @name:nl     Denque-on-Greasy-Fork
// @name:nn     Denque-on-Greasy-Fork
// @name:or     Denque-on-Greasy-Fork
// @name:pa     Denque-on-Greasy-Fork
// @name:pl     Denque-on-Greasy-Fork
// @name:ps     Denque-on-Greasy-Fork
// @name:pt     Denque-on-Greasy-Fork
// @name:ro     Denque-on-Greasy-Fork
// @name:ru     Denque-on-Greasy-Fork
// @name:si     Denque-on-Greasy-Fork
// @name:sk     Denque-on-Greasy-Fork
// @name:sl     Denque-on-Greasy-Fork
// @name:sq     Denque-on-Greasy-Fork
// @name:sr     Denque-on-Greasy-Fork
// @name:sv     Denque-on-Greasy-Fork
// @name:sw     Denque-on-Greasy-Fork
// @name:ta     Denque-on-Greasy-Fork
// @name:te     Denque-on-Greasy-Fork
// @name:th     Denque-on-Greasy-Fork
// @name:tl     Denque-on-Greasy-Fork
// @name:tr     Denque-on-Greasy-Fork
// @name:uk     Denque-on-Greasy-Fork
// @name:ur     Denque-on-Greasy-Fork
// @name:uz     Denque-on-Greasy-Fork
// @name:vi     Denque-on-Greasy-Fork
// @name:xh     Denque-on-Greasy-Fork
// @name:yi     Denque-on-Greasy-Fork
// @name:zh-CN  Denque-on-Greasy-Fork
// @name:zh-TW  Denque-on-Greasy-Fork
// @name:zh-HK  Denque-on-Greasy-Fork
// @supportURL  https://greasyfork.org/en/scripts/559642-denque-on-greasy-fork/feedback
// @homepageURL https://greasyfork.org/en/scripts/559642-denque-on-greasy-fork
// ==/UserScript==

/* jshint esversion: 11 */
/* jshint moz: true */


// import double-ended queue implementation that is based on a ring buffer rather than plain js array;
// unfortunately, it's written as a commonJS (cjs) module for node.js, so this has been automatically
// converted to code that can run in a userscript
function getDenqueClass() {

// Denque module on Github: https://github.com/invertase/denque
// Denque written by Mike Diarmid (a.k.a. Salakar) - https://github.com/Salakar
// Denque source code copyright (c) 2018 Invertase Limited - https://github.com/invertase/
// Repackaged for userscripts instead of a CommonJS module for Node.js

'use strict';

/**
 * Custom implementation of a double ended queue.
 */
function Denque(array, options) {
  var options = options || {};
  this._capacity = options.capacity;

  this._head = 0;
  this._tail = 0;

  if (Array.isArray(array)) {
    this._fromArray(array);
  } else {
    this._capacityMask = 0x3;
    this._list = new Array(4);
  }
}

/**
 * --------------
 *  PUBLIC API
 * -------------
 */

/**
 * Returns the item at the specified index from the list.
 * 0 is the first element, 1 is the second, and so on...
 * Elements at negative values are that many from the end: -1 is one before the end
 * (the last element), -2 is two before the end (one before last), etc.
 * @param index
 * @returns {*}
 */
Denque.prototype.peekAt = function peekAt(index) {
  var i = index;
  // expect a number or return undefined
  if ((i !== (i | 0))) {
    return void 0;
  }
  var len = this.size();
  if (i >= len || i < -len) return undefined;
  if (i < 0) i += len;
  i = (this._head + i) & this._capacityMask;
  return this._list[i];
};

/**
 * Alias for peekAt()
 * @param i
 * @returns {*}
 */
Denque.prototype.get = function get(i) {
  return this.peekAt(i);
};

/**
 * Returns the first item in the list without removing it.
 * @returns {*}
 */
Denque.prototype.peek = function peek() {
  if (this._head === this._tail) return undefined;
  return this._list[this._head];
};

/**
 * Alias for peek()
 * @returns {*}
 */
Denque.prototype.peekFront = function peekFront() {
  return this.peek();
};

/**
 * Returns the item that is at the back of the queue without removing it.
 * Uses peekAt(-1)
 */
Denque.prototype.peekBack = function peekBack() {
  return this.peekAt(-1);
};

/**
 * Returns the current length of the queue
 * @return {Number}
 */
Object.defineProperty(Denque.prototype, 'length', {
  get: function length() {
    return this.size();
  }
});

/**
 * Return the number of items on the list, or 0 if empty.
 * @returns {number}
 */
Denque.prototype.size = function size() {
  if (this._head === this._tail) return 0;
  if (this._head < this._tail) return this._tail - this._head;
  else return this._capacityMask + 1 - (this._head - this._tail);
};

/**
 * Add an item at the beginning of the list.
 * @param item
 */
Denque.prototype.unshift = function unshift(item) {
  if (arguments.length === 0) return this.size();
  var len = this._list.length;
  this._head = (this._head - 1 + len) & this._capacityMask;
  this._list[this._head] = item;
  if (this._tail === this._head) this._growArray();
  if (this._capacity && this.size() > this._capacity) this.pop();
  if (this._head < this._tail) return this._tail - this._head;
  else return this._capacityMask + 1 - (this._head - this._tail);
};

/**
 * Remove and return the first item on the list,
 * Returns undefined if the list is empty.
 * @returns {*}
 */
Denque.prototype.shift = function shift() {
  var head = this._head;
  if (head === this._tail) return undefined;
  var item = this._list[head];
  this._list[head] = undefined;
  this._head = (head + 1) & this._capacityMask;
  if (head < 2 && this._tail > 10000 && this._tail <= this._list.length >>> 2) this._shrinkArray();
  return item;
};

/**
 * Add an item to the bottom of the list.
 * @param item
 */
Denque.prototype.push = function push(item) {
  if (arguments.length === 0) return this.size();
  var tail = this._tail;
  this._list[tail] = item;
  this._tail = (tail + 1) & this._capacityMask;
  if (this._tail === this._head) {
    this._growArray();
  }
  if (this._capacity && this.size() > this._capacity) {
    this.shift();
  }
  if (this._head < this._tail) return this._tail - this._head;
  else return this._capacityMask + 1 - (this._head - this._tail);
};

/**
 * Remove and return the last item on the list.
 * Returns undefined if the list is empty.
 * @returns {*}
 */
Denque.prototype.pop = function pop() {
  var tail = this._tail;
  if (tail === this._head) return undefined;
  var len = this._list.length;
  this._tail = (tail - 1 + len) & this._capacityMask;
  var item = this._list[this._tail];
  this._list[this._tail] = undefined;
  if (this._head < 2 && tail > 10000 && tail <= len >>> 2) this._shrinkArray();
  return item;
};

/**
 * Remove and return the item at the specified index from the list.
 * Returns undefined if the list is empty.
 * @param index
 * @returns {*}
 */
Denque.prototype.removeOne = function removeOne(index) {
  var i = index;
  // expect a number or return undefined
  if ((i !== (i | 0))) {
    return void 0;
  }
  if (this._head === this._tail) return void 0;
  var size = this.size();
  var len = this._list.length;
  if (i >= size || i < -size) return void 0;
  if (i < 0) i += size;
  i = (this._head + i) & this._capacityMask;
  var item = this._list[i];
  var k;
  if (index < size / 2) {
    for (k = index; k > 0; k--) {
      this._list[i] = this._list[i = (i - 1 + len) & this._capacityMask];
    }
    this._list[i] = void 0;
    this._head = (this._head + 1 + len) & this._capacityMask;
  } else {
    for (k = size - 1 - index; k > 0; k--) {
      this._list[i] = this._list[i = (i + 1 + len) & this._capacityMask];
    }
    this._list[i] = void 0;
    this._tail = (this._tail - 1 + len) & this._capacityMask;
  }
  return item;
};

/**
 * Remove number of items from the specified index from the list.
 * Returns array of removed items.
 * Returns undefined if the list is empty.
 * @param index
 * @param count
 * @returns {array}
 */
Denque.prototype.remove = function remove(index, count) {
  var i = index;
  var removed;
  var del_count = count;
  // expect a number or return undefined
  if ((i !== (i | 0))) {
    return void 0;
  }
  if (this._head === this._tail) return void 0;
  var size = this.size();
  var len = this._list.length;
  if (i >= size || i < -size || count < 1) return void 0;
  if (i < 0) i += size;
  if (count === 1 || !count) {
    removed = new Array(1);
    removed[0] = this.removeOne(i);
    return removed;
  }
  if (i === 0 && i + count >= size) {
    removed = this.toArray();
    this.clear();
    return removed;
  }
  if (i + count > size) count = size - i;
  var k;
  removed = new Array(count);
  for (k = 0; k < count; k++) {
    removed[k] = this._list[(this._head + i + k) & this._capacityMask];
  }
  i = (this._head + i) & this._capacityMask;
  if (index + count === size) {
    this._tail = (this._tail - count + len) & this._capacityMask;
    for (k = count; k > 0; k--) {
      this._list[i = (i + 1 + len) & this._capacityMask] = void 0;
    }
    return removed;
  }
  if (index === 0) {
    this._head = (this._head + count + len) & this._capacityMask;
    for (k = count - 1; k > 0; k--) {
      this._list[i = (i + 1 + len) & this._capacityMask] = void 0;
    }
    return removed;
  }
  if (i < size / 2) {
    this._head = (this._head + index + count + len) & this._capacityMask;
    for (k = index; k > 0; k--) {
      this.unshift(this._list[i = (i - 1 + len) & this._capacityMask]);
    }
    i = (this._head - 1 + len) & this._capacityMask;
    while (del_count > 0) {
      this._list[i = (i - 1 + len) & this._capacityMask] = void 0;
      del_count--;
    }
    if (index < 0) this._tail = i;
  } else {
    this._tail = i;
    i = (i + count + len) & this._capacityMask;
    for (k = size - (count + index); k > 0; k--) {
      this.push(this._list[i++]);
    }
    i = this._tail;
    while (del_count > 0) {
      this._list[i = (i + 1 + len) & this._capacityMask] = void 0;
      del_count--;
    }
  }
  if (this._head < 2 && this._tail > 10000 && this._tail <= len >>> 2) this._shrinkArray();
  return removed;
};

/**
 * Native splice implementation.
 * Remove number of items from the specified index from the list and/or add new elements.
 * Returns array of removed items or empty array if count == 0.
 * Returns undefined if the list is empty.
 *
 * @param index
 * @param count
 * @param {...*} [elements]
 * @returns {array}
 */
Denque.prototype.splice = function splice(index, count) {
  var i = index;
  // expect a number or return undefined
  if ((i !== (i | 0))) {
    return void 0;
  }
  var size = this.size();
  if (i < 0) i += size;
  if (i > size) return void 0;
  if (arguments.length > 2) {
    var k;
    var temp;
    var removed;
    var arg_len = arguments.length;
    var len = this._list.length;
    var arguments_index = 2;
    if (!size || i < size / 2) {
      temp = new Array(i);
      for (k = 0; k < i; k++) {
        temp[k] = this._list[(this._head + k) & this._capacityMask];
      }
      if (count === 0) {
        removed = [];
        if (i > 0) {
          this._head = (this._head + i + len) & this._capacityMask;
        }
      } else {
        removed = this.remove(i, count);
        this._head = (this._head + i + len) & this._capacityMask;
      }
      while (arg_len > arguments_index) {
        this.unshift(arguments[--arg_len]);
      }
      for (k = i; k > 0; k--) {
        this.unshift(temp[k - 1]);
      }
    } else {
      temp = new Array(size - (i + count));
      var leng = temp.length;
      for (k = 0; k < leng; k++) {
        temp[k] = this._list[(this._head + i + count + k) & this._capacityMask];
      }
      if (count === 0) {
        removed = [];
        if (i != size) {
          this._tail = (this._head + i + len) & this._capacityMask;
        }
      } else {
        removed = this.remove(i, count);
        this._tail = (this._tail - leng + len) & this._capacityMask;
      }
      while (arguments_index < arg_len) {
        this.push(arguments[arguments_index++]);
      }
      for (k = 0; k < leng; k++) {
        this.push(temp[k]);
      }
    }
    return removed;
  } else {
    return this.remove(i, count);
  }
};

/**
 * Soft clear - does not reset capacity.
 */
Denque.prototype.clear = function clear() {
  this._list = new Array(this._list.length);
  this._head = 0;
  this._tail = 0;
};

/**
 * Returns true or false whether the list is empty.
 * @returns {boolean}
 */
Denque.prototype.isEmpty = function isEmpty() {
  return this._head === this._tail;
};

/**
 * Returns an array of all queue items.
 * @returns {Array}
 */
Denque.prototype.toArray = function toArray() {
  return this._copyArray(false);
};

/**
 * -------------
 *   INTERNALS
 * -------------
 */

/**
 * Fills the queue with items from an array
 * For use in the constructor
 * @param array
 * @private
 */
Denque.prototype._fromArray = function _fromArray(array) {
  var length = array.length;
  var capacity = this._nextPowerOf2(length);

  this._list = new Array(capacity);
  this._capacityMask = capacity - 1;
  this._tail = length;

  for (var i = 0; i < length; i++) this._list[i] = array[i];
};

/**
 *
 * @param fullCopy
 * @param size Initialize the array with a specific size. Will default to the current list size
 * @returns {Array}
 * @private
 */
Denque.prototype._copyArray = function _copyArray(fullCopy, size) {
  var src = this._list;
  var capacity = src.length;
  var length = this.length;
  size = size | length;

  // No prealloc requested and the buffer is contiguous
  if (size == length && this._head < this._tail) {
    // Simply do a fast slice copy
    return this._list.slice(this._head, this._tail);
  }

  var dest = new Array(size);

  var k = 0;
  var i;
  if (fullCopy || this._head > this._tail) {
    for (i = this._head; i < capacity; i++) dest[k++] = src[i];
    for (i = 0; i < this._tail; i++) dest[k++] = src[i];
  } else {
    for (i = this._head; i < this._tail; i++) dest[k++] = src[i];
  }

  return dest;
}

/**
 * Grows the internal list array.
 * @private
 */
Denque.prototype._growArray = function _growArray() {
  if (this._head != 0) {
    // double array size and copy existing data, head to end, then beginning to tail.
    var newList = this._copyArray(true, this._list.length << 1);

    this._tail = this._list.length;
    this._head = 0;

    this._list = newList;
  } else {
    this._tail = this._list.length;
    this._list.length <<= 1;
  }

  this._capacityMask = (this._capacityMask << 1) | 1;
};

/**
 * Shrinks the internal list array.
 * @private
 */
Denque.prototype._shrinkArray = function _shrinkArray() {
  this._list.length >>>= 1;
  this._capacityMask >>>= 1;
};

/**
 * Find the next power of 2, at least 4
 * @private
 * @param {number} num 
 * @returns {number}
 */
Denque.prototype._nextPowerOf2 = function _nextPowerOf2(num) {
  var log2 = Math.log(num) / Math.log(2);
  var nextPow2 = 1 << (log2 + 1);

  return Math.max(nextPow2, 4);
}




return Denque;
}
