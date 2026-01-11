// ==UserScript==
// @name                 Temporary-Script-Storage
// @namespace            github.com/JasonAMelancon
// @version              1.0.2
// @description          Sets a maximum age (minimum one day) for script storage values, after which they are deleted
// @description:af       Stel 'n maksimum ouderdom (minimum een dag) vir skripbergingwaardes, waarna dit verwyder word
// @description:am       ለስክሪፕት መ stor ዋጋዎች ከዚህ በኋላ የሚያጥፉትን የከፍተኛ ዕድሜ (አንድ ቀን የመነሳት ከፍተኛ) ማስተካከያ ይቀርባል
// @description:ar       يضع حدًا أقصى للعمر (لا يقل عن يوم واحد) لقيم تخزين البرامج النصية، وبعد ذلك يتم حذفها
// @description:az       Skript yaddaş dəyərləri üçün maksimum yaş (ən azı bir gün) təyin edir, ondan sonra silinir
// @description:be       Усталёўвае максімальны ўзрост (мінімум адзін дзень) для значэнняў сховішча скрыптоў, пасля якога яны выдаляюцца
// @description:bg       Задава максимална възраст (най-малко един ден) за стойностите на съхранение на скриптове, след което те се изтриват
// @description:bn       স্ক্রিপ্ট স্টোরেজ মানগুলির জন্য সর্বোচ্চ বয়স (সর্বনিম্ন এক দিন) নির্ধারণ করে, এরপর সেগুলি মুছে দেওয়া হয়
// @description:bs       Postavlja maksimalnu starost (najmanje jedan dan) za vrijednosti spremišta skripti, nakon čega se brišu
// @description:ca       Estableix una edat màxima (mínim un dia) per als valors d'emmagatzematge d'scripts, després de la qual s'eliminen
// @description:cs       Nastaví maximální věk (minimálně jeden den) pro hodnoty úložiště skriptů, po kterém jsou smazány
// @description:cy       Gosod maes o oedran uchaf (lleiaf un diwrnod) ar gyfer gwerthoedd storfa sgriptiau, ar ôl hynny caiff eu dileu
// @description:da       Angiver en maksimal alder (mindst en dag) for script-lagringsværdier, hvorefter de slettes
// @description:de       Legt ein Höchstalter (mindestens ein Tag) für Skript-Speicherwerte fest, nach dem sie gelöscht werden
// @description:el       Ορίζει μέγιστη ηλικία (τουλάχιστον μία ημέρα) για τις τιμές αποθήκευσης σεναρίων, μετά την οποία διαγράφονται
// @description:es       Establece una edad máxima (mínimo un día) para los valores de almacenamiento de scripts, tras la cual se eliminan
// @description:et       Määrab skriptide salvestusväärtustele maksimaalse vanuse (vähemalt üks päev), pärast mida need kustutatakse
// @description:fa       حداکثر سن (حداقل یک روز) را برای مقادیر ذخیره‌سازی اسکریپت تعیین می‌کند، پس از آن حذف می‌شوند
// @description:fi       Asettaa enimmäis iän (vähintään yksi päivä) skriptien tallennusarvoille, minkä jälkeen ne poistetaan
// @description:fil      Nagtatakda ng pinakamataas na edad (minimum isang araw) para sa mga halaga ng imbakan ng script, pagkatapos ay tinatanggal ang mga ito
// @description:fr       Définit un âge maximal (au moins un jour) pour les valeurs de stockage des scripts, après quoi elles sont supprimées
// @description:ga       Socraíonn sé aois uasta (lá ar a laghad) do luachanna stórála scriptí, tar éis a scriostar iad
// @description:gl       Establece unha idade máxima (mínimo un día) para os valores de almacenamento de scripts, despois das cales se eliminan
// @description:gu       સ્ક્રિપ્ટ સંગ્રહ મૂલ્યો માટે મહત્તમ ઉમર (ઓછામાં ઓછું એક દિવસ) સેટ કરે છે, ત્યારબાદ તે દૂર કરવામાં આવે છે
// @description:he       קובע גיל מקסימלי (לפחות יום אחד) לערכי אחסון הסקריפטים, לאחריו יימחקו
// @description:hi       स्क्रिप्ट संग्रह मानों के लिए अधिकतम आयु (न्यूनतम एक दिन) सेट करता है, जिसके बाद वे हटा दिए जाते हैं
// @description:hr       Postavlja maksimalnu starost (najmanje jedan dan) za vrijednosti spremišta skripti, nakon čega se brišu
// @description:hu       Maximális életkort állít be (minimum egy nap) a szkript-tárolási értékekhez, amely után törlésre kerülnek
// @description:hy       Օգտագործվում է սցենարների պահպանման արժեքների առավելագույն տարիք (նվազագույնը մեկ օր) սահմանելու համար՝ որից հետո դրանք ջնջվում են
// @description:id       Menetapkan usia maksimum (minimal satu hari) untuk nilai penyimpanan skrip, setelah itu dihapus
// @description:is       Stillir hámarksaldur (að minnsta kosti einn dag) fyrir skriftageymslugildi, eftir það eru þau eytt
// @description:it       Imposta un'età massima (minimo un giorno) per i valori di archiviazione degli script, dopo la quale vengono eliminati
// @description:ja       スクリプトの保存値に対する最大保存期間（最短1日）を設定し、それを過ぎると削除されます
// @description:ka       ადგენს სკრიპტის შესანახი მნიშვნელობების მაქსიმალურ ასაკს (უმცირესად ერთი დღე), რომლის შემდეგაც ისინი წაიშლება
// @description:kk       Скрипт сақтау мәндері үшін ең жоғары жасты (кемінде бір күн) белгілейді, содан кейін олар жойылады
// @description:km       កំណត់អាយុកាលអតិបរិមា (យ៉ាងហោចណាស់មួយថ្ងៃ) សម្រាប់តម្លៃការផ្ទុកកូដស្គ្រីប ដែលបន្ទាប់មកនឹងត្រូវបានលុបចោល
// @description:kn       ಸ್ಕ್ರಿಪ್ಟ್ ಸಂಗ್ರಹ ಮೌಲ್ಯಗಳಿಗೆ ಗರಿಷ್ಠ ವಯಸ್ಸು (ಕನಿಷ್ಠ ಒಂದು ದಿನ) ಅನ್ನು ಸ್ಥಾಪಿಸುತ್ತದೆ, ನಂತರ ಅವು ಅಳಿಸಲಾಗುತ್ತದೆ
// @description:ko       스크립트 저장 값에 대해 최대 보관 기간(최소 1일)을 설정하며, 그 이후에는 삭제됩니다
// @description:ku       Bo nirxên hilanînê ya skrîptan maksimum temenê (herî kêm rojek) diyar dike, piştî wê wextê jê têne jêkirin
// @description:lo       ກຳນົດອາຍຸໃຫຍ່ສຸດ (ເທົ່ານ້ອຍ 1 ມື້) ສໍາລັບຄ່າການຈັບຮອງສະກຣິບ, ຫຼັງຈາກນັ້ນຈະຖືກລຶບ
// @description:lt       Nustato didžiausią amžių (mažiausiai vieną dieną) skriptų saugojimo reikšmėms, po kurio jos ištrinamos
// @description:lv       Nosaka maksimālo vecumu (vismaz vienu dienu) skriptu glabāšanas vērtībām, pēc kura tās tiek dzēstas
// @description:mk       Поставува максимална возраст (најмалку еден ден) за вредностите за складирање на скрипти, по која се бришат
// @description:ml       സ്ക്രിപ്റ്റ് സംഭരണ വിലകൾക്കായി പരമാവധി പ്രായം (കുറഞ്ഞത് ഒരു ദിവസം) സജ്ജമാക്കുന്നു, അതിന് ശേഷമാണ് അവ ഇല്ലാതാക്കപ്പെടുന്നത്
// @description:mn       Скриптийн хадгалалтын утгуудын хамгийн их нас (хамгийн багадаа нэг өдөр) тогтооно, тэгээд устгана
// @description:mr       स्क्रिप्ट संग्रह मूल्यांसाठी कमाल वय (किमान एक दिवस) सेट करते, त्यानंतर ती हटविली जातात
// @description:ms       Menetapkan umur maksimum (minimum satu hari) untuk nilai storan skrip, selepas itu ia dipadam
// @description:mt       Jistabbilix xiħaġġa massima (minimu jum wieħed) għal valuri ta' ħażna tas-skripts, wara li dawn jitħassru
// @description:nb       Setter en maksimal alder (minst én dag) for skriptlagringsverdier, hvoretter de slettes
// @description:ne       स्क्रिप्ट भण्डारण मानहरूको लागि अधिकतम उमेर (कम्तिमा एक दिन) सेट गर्दछ, त्यसपछि तिनीहरू मेटाइन्छन्
// @description:nl       Stelt een maximale leeftijd in (minimaal één dag) voor script-opslagwaarden, waarna ze worden verwijderd
// @description:nn       Set ein maksimal alder (minst éin dag) for skriptlagringsverdiar, deretter vert dei blir slette
// @description:or       ସ୍କ୍ରିପ୍ଟ ସଞ୍ଚୟ ମୂଲ୍ୟଗୁଡିକ ପାଇଁ ଅଧିକତମ ବୟସ (କମପାଖାତି ଗୋଟିଏ ଦିନ) ସେଟ୍ କରେ, ଯାହା ପରେ ସେଗୁଡିକୁ ହଟାଯାଇଥାଏ
// @description:pa       ਸਕ੍ਰਿਪਟ ਸਟੋਰੇਜ ਮੁੱਲਾਂ ਲਈ ਵੱਧ ਤੋਂ ਵੱਧ ਉਮਰ (ਘੱਟੋ-ਘੱਟ ਇੱਕ ਦਿਨ) ਸੈੱਟ ਕਰਦਾ ਹੈ, ਜਿਸ ਤੋਂ ਬਾਅਦ ਉਹ ਮਿਟਾ ਦਿੱਤੇ ਜਾਂਦੇ ਹਨ
// @description:pl       Ustala maksymalny wiek (co najmniej jeden dzień) dla wartości przechowywania skryptów, po którym są usuwane
// @description:ps       د سکریپټ ذخیرې ارزښتونو لپاره اعظمي عمر (لږ تر لږه یو ورځ) ټاکي، وروسته له هغه حذف کیږي
// @description:pt       Define uma idade máxima (mínimo um dia) para valores de armazenamento de scripts, após a qual são eliminados
// @description:ro       Setează o vârstă maximă (minimum o zi) pentru valorile de stocare ale scripturilor, după care acestea sunt șterse
// @description:ru       Устанавливает максимальный возраст (не менее одного дня) для значений хранения скриптов, после которого они удаляются
// @description:si       පරිගණක කේත ගබඩා අගයන් සඳහා අවම වශයෙන් එක් දිනකට උපරිම වයසක් සකසයි, එවිට ඒවා ඉවත් කරනු ලැබේ
// @description:sk       Nastaví maximálny vek (minimálne jeden deň) pre hodnoty ukladania skriptov, po ktorom sú vymazané
// @description:sl       Nastavi največjo starost (vsaj en dan) za vrednosti shranjevanja skript, po kateri so izbrisane
// @description:sq       Vendos një moshë maksimale (të paktën një ditë) për vlerat e ruajtjes së skripteve, pas së cilës fshihen
// @description:sr       Поставља максималну старост (најмање један дан) за вредности складишта скрипти, након чега се бришу
// @description:sv       Anger en maximal ålder (minst en dag) för skriptlagringsvärden, varefter de raderas
// @description:sw       Weka umri wa juu kwa thamani za hifadhi za script (chini ya siku moja angalau), kisha zinafutwa
// @description:ta       ஸ்கிரிப்ட் சேமிப்புப் மதிப்புகளுக்கு அதிகபட்ச வயதை (குறைந்தது ஒரு நாள்) அமைக்கிறது, அதன் பிறகு அவை அழிக்கப்படுகின்றன
// @description:te       స్క్రిప్ట్ నిల్వ విలువల కోసం గరిష్ట వయసు (కనీసం ఒక రోజు) సెట్ చేస్తుంది, తద్వారా అవి తీసివేయబడతాయి
// @description:th       ตั้งอายุสูงสุด (อย่างน้อยหนึ่งวัน) สำหรับค่าการจัดเก็บสคริปต์ ซึ่งหลังจากนั้นจะถูกลบ
// @description:tl       Nagtatakda ng pinakamataas na edad (minimum isang araw) para sa mga halaga ng imbakan ng script, pagkatapos ay tinatanggal ang mga ito
// @description:tr       Betik depolama değerleri için azami yaş (en az bir gün) ayarlar, ardından silinirler
// @description:uk       Встановлює максимальний вік (не менше одного дня) для значень сховища скриптів, після якого вони видаляються
// @description:ur       اسکرپٹ اسٹوریج اقدار کے لیے زیادہ سے زیادہ عمر (کم از کم ایک دن) مقرر کرتا ہے، جس کے بعد وہ حذف کر دی جاتی ہیں
// @description:uz       Skript saqlash qiymatlari uchun maksimal yosh (kamida bir kun) belgilaydi, undan so'ng o'chiriladi
// @description:vi       Đặt tuổi tối đa (tối thiểu một ngày) cho các giá trị lưu trữ script, sau đó chúng bị xóa
// @description:xh       Misela ubudala obuninzi (ubuncinane usuku olunye) kwiimbalelo zokugcina zeskripthi, emva koko ziyayikhohlwa
// @description:yi       באַשטעטיקט אַ מאַקסימום אַלט (מינימום איין טאָג) פֿאַר סקריפּט סטאָרידזש ווערטס, נאָך וואָס זיי ווערן געשטראפּט
// @description:zh-CN    为脚本存储值设置最大保留期（至少一天），过期后将被删除
// @description:zh-TW    為腳本儲存值設定最大保留期限（至少一天），到期後將被刪除
// @name:af              Tydelike-Skrip-Beraging
// @name:am              ጊዜያዊ-ስክሪፕት-የማከማቻ
// @name:ar              تخزين-السكريبت-المؤقت
// @name:az              Müvəqqəti-Skript-Saxlama
// @name:be              Часовае-скрыптавое-захаванне
// @name:bg              Временен-скриптов-склад
// @name:bn              অস্থায়ী-স্ক্রিপ্ট-সংগ্রহ
// @name:bs              Privremeno-Skript-Skladište
// @name:ca              Emmagatzematge-Temporal-Scripts
// @name:cs              Dočasné-Ukládání-Skriptů
// @name:cy              Storfa-Sgript-Dros-Byr
// @name:da              Midlertidig-Skript-Lager
// @name:de              Temporärer-Skript-Speicher
// @name:el              Προσωρινή-Αποθήκη-Σκριπτών
// @name:es              Almacenamiento-Temporal-de-Scripts
// @name:et              Ajutine-Skriptide-Salvestus
// @name:fa              ذخیره‌سازی-اسکریپت-موقت
// @name:fi              Väliaikainen-Skripti-Tallennus
// @name:fil             Pansamantalang-Taguan-Script
// @name:fr              Stockage-Temporaire-Scripts
// @name:ga              Stóras- Sealadach-Scriptí
// @name:gl              Almacenamento-Temporal-Scripts
// @name:gu              તાત્કાલિક-સ્ક્રીપ્ટ-જંગમ
// @name:he              אחסון-סקריפט-זמני
// @name:hi              अस्थायी-स्क्रिप्ट-संग्रह
// @name:hr              Privremeno-Skladište-Skripti
// @name:hu              Ideiglenes-Szkript-Tárolás
// @name:hy              Ժամանակավոր-Սցենար-Պահոց
// @name:id              Penyimpanan-Skrip-Sementara
// @name:is              Bráðabirgða-Skripta-Geymsla
// @name:it              Archiviazione-Temporanea-Script
// @name:ja              一時スクリプトストレージ
// @name:ka              დროებითი-სკრიპტის-შენახვა
// @name:kk              Уақытша-Скрипт-Сақтау
// @name:km              ការផ្ទុក-ស្គ្រីប- προσωρινή
// @name:kn              ತಾತ್ಕಾಲಿಕ-ಸ್ಕ್ರಿಪ್ಟ್-ಸಂಗ୍ରହ
// @name:ko              임시-스크립트-저장소
// @name:ku              Hîna-Demkî-Skrîpt-Parastin
// @name:lo              ການຈັດການ-ສະກຣິບ-ຊົ່ວຄາວ
// @name:lt              Laikinas-Skriptų-Saugykla
// @name:lv              Pagaidu-Skriptu-Glabātuve
// @name:mk              Временско-Складиште-на-Скрипти
// @name:ml              താൽക്കാലിക-സ്ക്രിപ്റ്റ്-സ്റ്റോറെജ്
// @name:mn              Түр-скрипт-хадгалах
// @name:mr              तात्काळ-स्क्रिप्ट-साठवण
// @name:ms              Penyimpanan-Skrip-Sementara
// @name:mt              Ħażna-Proviżorja-Skripts
// @name:nb              Midlertidig-Skript-Lagring
// @name:ne              अस्थायी-स्क्रिप्ट-स्टोरेज
// @name:nl              Tijdelijke-Script-Opslag
// @name:nn              Mellombels-Skript-Lagring
// @name:or              ସ୍ଥାୟୀ-ନୁହେଁ-ସ୍କ୍ରିପ୍ଟ-ସଞ୍ଚୟ
// @name:pa              ਅਸਥਾਈ-ਸਕ੍ਰਿਪਟ-ਸਟੋਰੇਜ
// @name:pl              Tymczasowe-Przechowywanie-Skryptów
// @name:ps              لنډمهالی-سکرپټ-زخیره
// @name:pt              Armazenamento-Temporário-de-Scripts
// @name:ro              Stocare-Temporară-Scripturi
// @name:ru              Временное-Хранилище-Скриптов
// @name:si              තාවකාලික-ස්ක්‍රිප්ට්-ගබඩාව
// @name:sk              Dočasné-Ukladanie-Skriptov
// @name:sl              Začasno-Shranjevanje-Skript
// @name:sq              Ruajtje-E-Përkohshme-Skriptesh
// @name:sr              Привремено-складиште-скрипти
// @name:sv              Tillfällig-Skript-Lagring
// @name:sw              Hifadhi-Ya-Muda-Skripti
// @name:ta              தற்காலிக-ஸ்கிரிப்ட்-சேமிப்பு
// @name:te              తాత్కాలిక-స్క్రిప్ట్-అభివృద్ధి
// @name:th              ที่เก็บ-สคริปต์-ชั่วคราว
// @name:tl              Pansamantalang-Taguan-Script
// @name:tr              Geçici-Skript-Depolama
// @name:uk              Тимчасове-Сховище-Скриптів
// @name:ur              عارضی-اسکرپٹ-اسٹوریج
// @name:uz              Vaqtincha-Skript-Saqlash
// @name:vi              Lưu-Trữ-Script-Tạm-Thời
// @name:xh              Ulondolozo-Lwesikhashana-Skripthi
// @name:yi              צייַטווייליקער-סקריפט-באַלעכטער
// @name:zh-CN           临时-脚本-存储
// @name:zh-TW           臨時-腳本-儲存
// @author               Jason Melancon
// @license              MIT (https://mit-license.org/)
// @grant                GM.getValue
// @grant                GM.setValue
// @grant                GM.deleteValue
// @grant                GM.listValues
// @supportURL           https://greasyfork.org/en/scripts/562172-temporary-script-storage/feedback
// @homepageURL          https://greasyfork.org/en/scripts/562172-temporary-script-storage
// ==/UserScript==

/* jshint esversion: 11 */
/* jshint moz: true */

/**
 * Storage set and accessed through this class will only live as long as the lifetime you set 
 * in the constructor. After that time, it will expire and be deleted on sweepExpiredEntries().
 * Storage set directly through GM's setValue() will function normally.
 */
class TTLStorage {
    #INDEX_KEY = '__ttl_index__';
    #LOCK_KEY = '__ttl_lock__';
    #LAST_SWEEP_KEY = '__ttl_last_sweep__';
    #DATA_PREFIX = '_TTL_';
    #TTL_MS = 1000 * 60 * 60 * 24 * 30; // default 30 days

    #cache = new Map();

    /**
     * Instantiate the storage class.
     * @param lifetime The length of time in ms that must elapse after setting a value before it
     * will be deleted by a call to sweepExpiredEntries(). Must be at least one day; 30 days is the default. 
     */
    constructor(lifetime) {
        if (lifetime !== undefined) {
            const numLifetime = Number(lifetime);
            if (!Number.isFinite(numLifetime)) {
                throw new TypeError(`${this.constructor.name}: Lifetime parameter ("${lifetime}") invalid`);
            }
            if (numLifetime < 1000 * 60 * 60 * 24) {
                throw new TypeError(`${this.constructor.name}: Lifetime parameter ("${lifetime}") must be at least one day`);
            }
            this.#TTL_MS = Math.floor(numLifetime);
        }
    }

    #uid() {
        return Math.random().toString(36).slice(2) + '-' + Date.now().toString(36);
    }

    #prefixed(logicalKey) {
        return this.#DATA_PREFIX + logicalKey;
    }

    #plain(persistedKey) {
        return (typeof persistedKey === 'string' && persistedKey.startsWith(this.#DATA_PREFIX))
            ? persistedKey.slice(this.#DATA_PREFIX.length)
            : null;
    }

    // storage mutex: write candidate + confirm ownership by re-reading
    async #acquireLock({ acquireTimeout = 5000, lockTimeout = 8000, retryBase = 50 } = {}) {
        const owner = this.#uid();
        const deadline = Date.now() + acquireTimeout;
        while (Date.now() < deadline) {
            const lockJson = await GM.getValue(this.#LOCK_KEY);
            let lock = null;
            try {
                lock = lockJson ? JSON.parse(lockJson) : null;
            } catch {
                lock = null;
            }
            const nowTime = Date.now();
            if (!lock || (lock.expiresAt && lock.expiresAt <= nowTime)) {
                const candidate = { owner, expiresAt: nowTime + lockTimeout };
                await GM.setValue(this.#LOCK_KEY, JSON.stringify(candidate));
                const confirmLockJson = await GM.getValue(this.#LOCK_KEY);
                try {
                    const confirm = confirmLockJson ? JSON.parse(confirmLockJson) : null;
                    if (confirm && confirm.owner === owner) {
                        return { owner, expiresAt: candidate.expiresAt };
                    }
                } catch {}
            }
            const delay = retryBase + Math.floor(Math.random() * retryBase);
            await new Promise(r => setTimeout(r, delay));
        }
        throw new Error('acquireLock timeout');
    }

    async #releaseLock(token) {
        if (!token || !token.owner) return;
        const lockJson = await GM.getValue(this.#LOCK_KEY);
        try {
            const lock = lockJson ? JSON.parse(lockJson) : null;
            if (lock && lock.owner === token.owner) await GM.deleteValue(this.#LOCK_KEY);
        } catch {
            try { await GM.deleteValue(this.#LOCK_KEY); } catch {}
        }
    }

    // index helpers (index maps logicalKey -> storedAt)
    async #loadIndex() {
        const indexJson = await GM.getValue(this.#INDEX_KEY);
        return indexJson ? indexJson : {};
    }

    async #saveIndex(index) {
        await GM.setValue(this.#INDEX_KEY, index);
    }

    // rebuild in-memory cache from index (reads persisted values using data prefix)
    async #rebuildCacheFromIndex(index) {
        this.#cache.clear();
        const keys = Object.keys(index || {});
        for (const key of keys) {
            const value = await GM.getValue(this.#prefixed(key));
            if (value === undefined) {
                // missing persisted value, so skip (will be cleaned from index on sweep or next save)
                continue;
            }
            this.#cache.set(key, value);
        }
    }

    // attempt to rebuild index from enumerating persisted storage (if manager supports it)
    async #rebuildIndexByEnumeratingStorage() {
        // GM.listValues may not exist on all managers; guard accordingly
        if (typeof GM.listValues !== 'function') return null;
        const allPersistedKeys = await GM.listValues();
        const rebuiltIndex = {};
        const timestamp = Date.now();
        for (const persistedKey of allPersistedKeys) {
            const key = this.#plain(persistedKey);
            if (!key) continue; // filter accepts only ones with our prefix
            const value = await GM.getValue(persistedKey);
            if (value === undefined) continue;
            rebuiltIndex[key] = timestamp;
        }
        await this.#saveIndex(rebuiltIndex);
        return rebuiltIndex;
    }

    async #sweepUsingIndex(index) {
        // only sweep if it's been a day since the last sweep
        const lastSweep = await GM.getValue(this.#LAST_SWEEP_KEY, 0);
        const oneDay = 1000*60*60*24 - 1000*60; // a day less one minute
        if (lastSweep + oneDay > Date.now()) return;

        const cutoff = Date.now() - this.#TTL_MS;
        let changed = false;
        for (const key of Object.keys(index)) {
            const storedAt = index[key];
            if (typeof storedAt !== 'number' || storedAt <= cutoff) {
                try { await GM.deleteValue(this.#prefixed(key)); } catch {}
                delete index[key];
                this.#cache.delete(key);
                changed = true;
            }
        }
        if (changed) await this.#saveIndex(index);
        await GM.setValue(this.#LAST_SWEEP_KEY, String(Date.now()));
    }

    // public API

    /**
     * Initialization is carried out here rather than in the constructor. Should be called on
     * every script load, after instantiation by the constructor. Implicitly executes a sweep
     * to delete expired entries, if more than a day has elapsed since the last sweep.
     * @async
     */
    async ready() {
        let index = await this.#loadIndex();
        if (index === null) {
            // index missing or corrupt: try enumerating storage as a recovery, else start empty
            try {
                const lock = await this.#acquireLock();
                try {
                    const enumeratedIndex = await this.#rebuildIndexByEnumeratingStorage();
                    index = enumeratedIndex || {};
                } finally {
                    await this.#releaseLock(lock);
                }
            } catch {
                index = {};
                try { await this.#saveIndex(index); } catch {}
            }
        }
        try {
            const lock = await this.#acquireLock();
            try {
                await this.#rebuildCacheFromIndex(index);
                await this.#sweepUsingIndex(index);
            } finally { await this.#releaseLock(lock); }
        } catch {
            // fallback: best-effort cache rebuild without lock
            await this.#rebuildCacheFromIndex(index);
        }
    }

    // fast O(1) has/get using in-memory cache

    /** @returns true if the key has been set; false otherwise. */
    has(key) { return this.#cache.has(key); }
    /** @returns the value stored for the key, or undefined if the key has not been set. */
    get(key) { return this.#cache.get(key); }

    // atomic set: write persisted value, update index, update cache
    /** Puts the key into storage and sets its value. @async */
    async set(key, value) {
        const token = await this.#acquireLock();
        try {
            await GM.setValue(this.#prefixed(key), value);
            const index = (await this.#loadIndex()) || {};
            index[key] = Date.now();
            await this.#saveIndex(index);
            this.#cache.set(key, value);
        } finally {
            await this.#releaseLock(token);
        }
    }

    // atomic delete
    /** Deletes the key from storage. @async */
    async delete(key) {
        const token = await this.#acquireLock();
        try {
            try { await GM.deleteValue(this.#prefixed(key)); } catch {}
            const index = (await this.#loadIndex()) || {};
            if (key in index) {
                delete index[key];
                await this.#saveIndex(index);
            }
            this.#cache.delete(key);
        } finally {
            await this.#releaseLock(token);
        }
    }

    // run daily sweep: rebuild index if needed, sweep, rebuild cache
    /** Deletes keys that have expired.
     *
     * Sweeps only run if it has been at least a day since the last sweep. It is therefore
     * suggested to put this in a call to setInterval() with a delay of a day.
     * The ready() method also attempts a sweep implicitly.
     * @async
     */
    async sweepExpiredEntries() {
        const token = await this.#acquireLock({ acquireTimeout: 8000, lockTimeout: 15000 });
        try {
            let index = await this.#loadIndex();
            if (index === null) index = (await this.#rebuildIndexByEnumeratingStorage()) || {};
            await this.#sweepUsingIndex(index);
            await this.#rebuildCacheFromIndex(index);
        } finally {
            await this.#releaseLock(token);
        }
    }
}

