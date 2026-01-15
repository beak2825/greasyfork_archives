// ==UserScript==
// @name                 Weed Out Reddit Posts
// @namespace            github.com/JasonAMelancon
// @version              2026-01-14
// @description          Filter posts you don't want from your (new) Reddit feed with regular expressions
// @description:af       Filtreer plasings wat jy nie wil hê nie uit jou (nuwe) Reddit-feed met gewone uitdrukkings
// @description:am       ከ(አዲሱ) Reddit ፊድህ የምታለምን ልጥፎችን በመደበቅ ሐረግ (regular expressions) አጠቃሽ አስወግድ
// @description:ar       قم بتصفية المنشورات التي لا تريدها من خلاصتك (الجديدة) على Reddit باستخدام التعابير النمطية
// @description:az       (yeni) Reddit lentənizdə istəmədiyiniz yazıları müntəzəm ifadələrlə (regular expressions) süzün
// @description:be       Фільтруйце паведамленні, якія вы не жадаеце бачыць, у вашай (новай) стужцы Reddit з дапамогай рэгулярных выразаў
// @description:bg       Филтрирайте публикации, които не искате, от вашия (нов) Reddit емисия с регулярни изрази
// @description:bn       আপনার (নতুন) Reddit ফিড থেকে নিয়মিত অভিব্যক্তি (regular expressions) ব্যবহার করে এমন পোস্টগুলি ফিল্টার করুন যা আপনি চান না
// @description:bs       Filtrirajte objave koje ne želite iz svoje (nove) Reddit vremenske linije pomoću regularnih izraza
// @description:ca       Filtra les publicacions que no vols del teu feed (nou) de Reddit amb expressions regulars
// @description:cs       Filtrovat příspěvky, které nechcete, ve vašem (novém) Reddit kanálu pomocí regulárních výrazů
// @description:cy       Hidlo bosti nad ydych eisiau eu dileu o'ch ffryd (new) Reddit gan ddefnyddio mynegiadau rheolaidd
// @description:da       Filtrer indlæg, du ikke ønsker, fra din (nye) Reddit-feed med regulære udtryk
// @description:de       Filtere Beiträge, die du nicht willst, aus deinem (neuen) Reddit-Feed mit regulären Ausdrücken
// @description:el       Φιλτράρετε τις δημοσιεύσεις που δεν θέλετε από τη (νέα) ροή Reddit σας με κανονικές εκφράσεις
// @description:es       Filtra las publicaciones que no quieres de tu feed (nuevo) de Reddit con expresiones regulares
// @description:et       Filtreeri postitused, mida sa ei taha, oma (uues) Reddit-voos regulaarsümbolite abil
// @description:fa       پست‌هایی که نمی‌خواهید را از فید (جدید) Reddit خود با عبارات منظم فیلتر کنید
// @description:fi       Suodata pois viestit, joita et halua (uusista) Reddit-syötteestäsi käyttäen säännöllisiä lausekkeita
// @description:fil      Salain ang mga post na ayaw mo mula sa iyong (bagong) Reddit feed gamit ang regular expressions
// @description:fr       Filtrez les publications indésirables de votre flux (nouveau) Reddit avec des expressions régulières
// @description:ga       Scag na poist nach dteastaíonn uait ó do fhotha (nua) Reddit le haistriúcháin rialta
// @description:gl       Filtra as publicacións que non queres do teu feed (novo) de Reddit con expresións regulares
// @description:gu       તમારા (નવા) Reddit ફીડમાંથી નિયમિત અભિવ્યક્તિઓનો ઉપયોગ કરીને તમે ન માંગતા એવા પોસ્ટ્સને ફિલ્ટર કરો
// @description:he       סנן פוסטים שאינך רוצה מהפיד (החדש) שלך ב‑Reddit באמצעות ביטויים רגולריים
// @description:hi       अपने (नए) Reddit फ़ीड से उन पोस्टों को नियमित अभिव्यक्तियों (regular expressions) से फ़िल्टर करें जिन्हें आप नहीं चाहते
// @description:hr       Filtrirajte objave koje ne želite iz svog (novog) Reddit feeda pomoću regularnih izraza
// @description:hu       Szűrd ki a nem kívánt bejegyzéseket az (új) Reddit-hírcsövegedből reguláris kifejezésekkel
// @description:hy       Ֆիլտրեք այն հրապարակումները, որոնք չեք ցանկանում ձեր (նոր) Reddit հոսքից՝ օգտագործելով կանոնավոր արտահայտություններ
// @description:id       Saring postingan yang tidak kamu inginkan dari (baru) feed Reddit-mu dengan ekspresi reguler
// @description:is       Síttu út færslur sem þú vilt ekki úr (nýja) Reddit-fæði með reglulegum segðum
// @description:it       Filtra i post che non vuoi dal tuo feed (nuovo) di Reddit con espressioni regolari
// @description:ja       正規表現を使って、(新しい) Redditフィードから望ましくない投稿をフィルタリングします
// @description:ka       ფილტრავს პოსტებს, якія არ გსურთ თქვენი (ახალი) Reddit ფიდიდან რეგულარული გამოხატულებებით
// @description:kk       (жаңа) Reddit ілмегіңізден қалаусыз жарияланымдарды тұрақты өрнектермен сүзгілеңіз
// @description:km       ប្រាក់ចម្រាញ់បញ្ជីប្រកាសដែលអ្នកមិនចង់បានពីផ្លាទីថ៍ (ថ្មី) Reddit របស់អ្នកដោយប្រើ​ regular expressions
// @description:kn       ನಿಯಮಿತ ಅಭಿವ್ಯಕ್ತಿಗಳನ್ನು ಬಳಸಿ ನಿಮ್ಮ (ಹೊಸ) Reddit ಫೀಡ್‌ನಿಂದ ನೀವು ಇಚ್ಛಿಸದ ಪೋಸ್ಟ್ಗಳನ್ನು ಫಿಲ್ಟರ್ ಮಾಡಿ
// @description:ko       정규 표현식으로 (새) Reddit 피드에서 원하지 않는 게시물 필터링
// @description:ku       Ji hêla hevokên rêzgirtî ve ji feed‑a (nû) Reddit xwe postên ku nîn dixwazin filtre bikin
// @description:lo       ກອກກວດຫົວຂໍ້ທີ່ທ່ານບໍ່ຕ້ອງການອອກຈາກແຟັດ (ໃໝ່) Reddit ຂອງທ່ານໂດຍໃຊ້ຄຳສອບທີ່ສາມາດທໍາຊ້ຳ
// @description:lt       Filtruokite įrašus, kurių nenorite iš savo (naujo) Reddit srauto naudodami reguliarias išraiškas
// @description:lv       Filtrējiet ierakstus, kurus nevēlaties savā (jaunajā) Reddit plūsmā, izmantojot regulārās izteiksmes
// @description:mk       Филтрирајте ги објавите што не ги сакате од вашата (нова) Reddit-стрим со регулярни изрази
// @description:ml       നിങ്ങളുടെ (പുതിയ) Reddit ഫീഡിൽ നിന്ന് നിങ്ങൾക്ക് ആവശ്യമില്ലാത്ത പോസ്റ്റുകൾ തിരിച്ചറിയാനായി റെഗുലർ എക്സ്പ്രെഷനുകൾ ഉപയോഗിച്ച് ഫിൽട്ടർ ചെയ്യുക
// @description:mn       (шинэ) Reddit фийдээс хүсээгүй бичлэгүүдийг тогтмол илэрхийлэлүүдээр шүүж гарга
// @description:mr       आपल्या (नवीन) Reddit फीडमधील तुम्हाला नको असलेले पोस्ट नियमित अभिव्यक्ती वापरून फिल्टर करा
// @description:ms       Tapis pos yang anda tidak mahu dari feed (baru) Reddit anda dengan ekspresi biasa
// @description:mt       Filtra l-postijiet li ma tridx mill-feed (ġdid) ta’ Reddit tiegħek bl-espressjonijiet regolari
// @description:nb       Filtrer innlegg du ikke ønsker fra din (nye) Reddit-feed med regulære uttrykk
// @description:ne       आफ्नो (नयाँ) Reddit फीडबाट तपाईँ नचाहने पोस्टहरू नियमित अभिव्यक्तिहरू प्रयोग गरी फिल्टर गर्नुहोस्
// @description:nl       Filter berichten die je niet wilt uit je (nieuwe) Reddit-feed met reguliere expressies
// @description:nn       Filtrer innlegg du ikkje ønskjer frå din (nye) Reddit‑feed med regulære uttrykk
// @description:or       ନିୟମିତ ଅଭିବ୍ୟକ୍ତିଗୁଡ଼ିକୁ ବ୍ୟବହାର କରି ଆପଣଙ୍କର (ନୂତନ) Reddit ଫିଡ୍‌ରୁ ଆପଣ ଚାହାଁନଥିବା ପୋଷ୍ଟଗୁଡ଼ିକୁ ଫିଲ୍ଟର କରନ୍ତୁ
// @description:pa       ਆਪਣੇ (ਨਵੇਂ) Reddit ਫੀਡ ਤੋਂ ਨਿਯਮਤ ਅਭਿਵ੍ਯਕਤੀਆਂ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਉਹਨਾਂ ਪੋਸਟਾਂ ਨੂੰ ਫਿਲਟਰ ਕਰੋ ਜੋ ਤੁਸੀਂ ਨਹੀਂ ਚਾਹੁੰਦੇ
// @description:pl       Filtruj posty, których nie chcesz, z twojego (nowego) kanału Reddit przy użyciu wyrażeń regularnych
// @description:ps       د خپل (نوي) Reddit فیډ څخه هغه پوسټونه چې نه یې غواړئ د منظم څرګندونو په کارولو سره فلټر کړئ
// @description:pt       Filtre publicações que não quer do seu feed (novo) do Reddit com expressões regulares
// @description:ro       Filtrează postările pe care nu le dorești din feed‑ul (nou) Reddit folosind expresii regulate
// @description:ru       Фильтруйте посты, которые вы не хотите видеть, в вашей (новой) ленте Reddit с помощью регулярных выражений
// @description:si       ඔබට අවශ්‍ය නැති පෝස්ට් ඔබේ (නව්‍ය) Reddit ෆීඩ් එකෙන් නියමිත ප්‍රකාශ (regular expressions) භාවිතයෙන් විෂ්කම්භ කරන්න
// @description:sk       Filtrovať príspevky, ktoré nechcete, vo vašom (novom) Reddit feede pomocou regulárnych výrazov
// @description:sl       Filtrirajte objave, ki jih ne želite, iz vašega (novega) Reddit vira z regulrnimi izrazi
// @description:sq       Filtroni postimet që nuk i dëshironi nga feed‑i (i ri) Reddit me shprehje të rregullta
// @description:sr       Филтрирајте објаве које не желите из свог (новог) Reddit фида помоћу регуларних израза
// @description:sv       Filtrera inlägg du inte vill ha från din (nya) Reddit‑feed med reguljära uttryck
// @description:sw       Chuja posti ambazo hupendi kutoka kwenye feed yako ya (mpya) Reddit kwa kutumia regex
// @description:ta       உங்கள் (புதிய) Reddit ஊடகப் பகுதியிலிருந்து நீங்கள் விரும்பாத பதிவுகளை নিয়মப் பகுதிகளால் (regular expressions) வடிகட்டவும்
// @description:te       మీ (కొత్త) Reddit ఫీడ్ నుండి మీరు ఇష్టపడని పోస్ట్‌లను నియమిత వ్యక్తీకరణలు ఉపయోగించి ఫిల్టర్ చేయండి
// @description:th       กรองโพสต์ที่คุณไม่ต้องการจากฟีด (ใหม่) ของ Reddit ของคุณด้วยนิพจน์ปกติ
// @description:tl       I‑filter ang mga post na ayaw mo mula sa iyong (bagong) Reddit feed gamit ang regular expressions
// @description:tr       (yeni) Reddit akışınızdan istemediğiniz gönderileri düzenli ifadelerle filtreleyin
// @description:uk       Фільтруйте дописи, яких не хочете, у вашій (новій) стрічці Reddit за допомогою регулярних виразів
// @description:ur       اپنے (نئے) Reddit فیڈ سے وہ پوسٹس فلٹر کریں جو آپ نہیں چاہتے، ریگولر ایکسپریشنز استعمال کرکے
// @description:uz       (yangi) Reddit feed’ingizdan istamagan postlarni muntazam ifodalar bilan filtrlash
// @description:vi       Lọc các bài bạn không muốn từ nguồn (mới) Reddit của bạn bằng biểu thức chính quy
// @description:xh       Hluza iiposti ongafuniyo kwifidi (entsha) yakho yeReddit usebenzisa iirekhweshi eziqhelekileyo
// @description:yi       פֿילטער פּאָסטן וואָס איר טאָן ניט ווילן פֿון דיין (נײַע) Reddit פֿיד מיט רעגולערע אויסדרוקן
// @description:zh-CN    使用正则表达式从你的（新）Reddit 订阅源中过滤你不想要的帖子
// @description:zh-TW    使用正規表達式從你的（新）Reddit 訂閱源中过濾你不想要的貼文
// @name:af              Week Uit Reddit‑plasings
// @name:am              ከReddit ልጥፎች ማስወገድ
// @name:ar              فرز منشورات Reddit
// @name:az              Reddit yazılarını süzün
// @name:be              Адфільтраваць паведамленні Reddit
// @name:bg              Пречисти публикации в Reddit
// @name:bn              Reddit পোস্ট ফিল্টার করুন
// @name:bs              Izdvojite neželjene Reddit objave
// @name:ca              Filtra publicacions de Reddit
// @name:cs              Filtrovat příspěvky Reddit
// @name:cy              Gwahanu postiadau Reddit
// @name:da              Fjern Reddit‑indlæg
// @name:de              Reddit‑Beiträge aussortieren
// @name:el              Φιλτράρισμα δημοσιεύσεων Reddit
// @name:es              Filtrar publicaciones de Reddit
// @name:et              Sorteeri Redditi postitused välja
// @name:fa              پالایش پست‌های Reddit
// @name:fi              Suodata Reddit‑julkaisut
// @name:fil             Salain ang mga post ng Reddit
// @name:fr              Filtrer les publications Reddit
// @name:ga              Scag postanna Reddit
// @name:gl              Filtrar publicacións de Reddit
// @name:gu              Reddit પોસ્ટોને ફિલ્ટર કરો
// @name:he              סינון פוסטים של Reddit
// @name:hi              Reddit पोस्ट फ़िल्टर करें
// @name:hr              Izdvoji neželjene Reddit objave
// @name:hu              Reddit‑bejegyzések kiszűrése
// @name:hy              Reddit գրառումներ ֆիլտրել
// @name:id              Saring postingan Reddit
// @name:is              Sía Reddit‑færslur
// @name:it              Filtra i post di Reddit
// @name:ja              Reddit の投稿をフィルター
// @name:ka              Reddit პოსტების ფილტრი
// @name:kk              Reddit жазбаларын сүзу
// @name:km              ស្វែងយកបដិសេធចេញពី Reddit
// @name:kn              Reddit ಪೋಸ್ಟ್‌ಗಳನ್ನು ಫಿಲ್ಟರ್ ಮಾಡಿ
// @name:ko              Reddit 게시물 필터
// @name:ku              Postên Redditê filtre bike
// @name:lo              ກວດເອົາໂພສ Reddit
// @name:lt              Filtruoti Reddit įrašus
// @name:lv              Filtrēt Reddit ierakstus
// @name:mk              Филтрирај Reddit објави
// @name:ml              Reddit പോസ്റ്റുകൾ ഫിൽറ്റർ ചെയ്യുക
// @name:mn              Reddit постуудыг шүүж гаргах
// @name:mr              Reddit पोस्ट फिल्टर करा
// @name:ms              Tapis siaran Reddit
// @name:mt              Naddaf il‑postijiet taʼ Reddit
// @name:nb              Filtrer Reddit‑innlegg
// @name:ne              Reddit पोस्टहरू फिल्टर गर्नुहोस्
// @name:nl              Reddit‑berichten filteren
// @name:nn              Filtrer Reddit‑innlegg
// @name:or              Reddit ପୋଷ୍ଟଗୁଡିକୁ ଫିଲ୍ଟର କରନ୍ତୁ
// @name:pa              Reddit ਪੋਸਟਾਂ ਫਿਲਟਰ ਕਰੋ
// @name:pl              Filtrowanie postów Reddit
// @name:ps              د Reddit پوستونه فلټر کړئ
// @name:pt              Filtrar publicações do Reddit
// @name:ro              Filtrează postări Reddit
// @name:ru              Фильтровать посты Reddit
// @name:si              Reddit පෝස්ට් ෆිල්ටර් කරන්න
// @name:sk              Filtrovať príspevky Reddit
// @name:sl              Filtriraj Reddit objave
// @name:sq              Filtroni postimet e Reddit
// @name:sr              Филтрирај Reddit постове
// @name:sv              Filtrera Reddit‑inlägg
// @name:sw              Chuja machapisho ya Reddit
// @name:ta              Reddit பதிவுகளை வடிகட்டவும்
// @name:te              Reddit పోస్టులను ఫిల్టర్ చేయండి
// @name:th              กรองโพสต์ Reddit
// @name:tl              I‑filter ang mga post ng Reddit
// @name:tr              Reddit gönderilerini filtrele
// @name:uk              Фільтрувати пости Reddit
// @name:ur              Reddit پوسٹس فلٹر کریں
// @name:uz              Reddit postlarini filtrlash
// @name:vi              Lọc bài viết Reddit
// @name:xh              Cwangcisa izithuba ze‑Reddit
// @name:yi              פילטר זײַטנס Reddit פּאָסטן
// @name:zh-CN           过滤 Reddit 帖子
// @name:zh-TW           過濾 Reddit 帖文
// @author               Jason Melancon
// @license              GNU AGPLv3
// @match                http*://www.reddit.com/*
// @supportURL           https://greasyfork.org/en/scripts/548300-weed-out-reddit-posts/feedback
// @homepageURL          https://greasyfork.org/en/scripts/548300-weed-out-reddit-posts
// @grant                GM.getValue
// @grant                GM.setValue
// @grant                GM.deleteValue
// @grant                GM.listValues
// @grant                GM.registerMenuCommand
// @grant                GM.xmlHttpRequest
// @require              https://update.greasyfork.org/scripts/559642/1722326/Denque-on-Greasy-Fork.js
// @require              https://update.greasyfork.org/scripts/559799/1722338/Real-Time-Rate-Limiting-Queue.js
// @require              https://update.greasyfork.org/scripts/562172/1732034/Temporary-Script-Storage.js
// @downloadURL https://update.greasyfork.org/scripts/548300/Weed%20Out%20Reddit%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/548300/Weed%20Out%20Reddit%20Posts.meta.js
// ==/UserScript==

/* jshint esversion: 11 */
/* jshint moz: true */

// Real-Time-Rate-Limiting-Queue library uses Mike Diarmid's Denque (https://github.com/Salakar) — copyright (c) 2018 Invertase Limited (https://github.com/invertase/denque)

(async function() {
    "use strict";

    const DEBUG = false;
    // the msg is in a lambda expression body so that string interpolation only happens if we
    // actually print the message (lazy evaluation)
    function debugLog(lambdifiedMsg, ...args) {
        if (DEBUG) console.log(lambdifiedMsg(...args));
    }

    // Limit background fetches for things like post flair
    const RateLimitQueue = getRtrlqClass();
    const opt = { requests: 10, interval: RateLimitQueue.seconds(10), concurrent: false }; // 60 req/min equivalent
    const requestQueue = new RateLimitQueue(opt.requests, opt.interval, opt.concurrent);

    // Memoize fetched data to obviate re-fetches, but don't keep forever
    const persistentStorage = new TTLStorage();
    await persistentStorage.ready();
    setInterval(() => persistentStorage.sweepExpiredEntries(), 1000 * 60 * 60 * 24);

    /* REMOVE UNWANTED ELEMENTS */

    let regexList = await GM.getValue("regexList", /*default = */[]);
    let logRemovals = await GM.getValue("logRemovals", /*default = */true);
    let namedSubredditLists = {};
    let articles = document.querySelectorAll("article");
    const Target = Object.freeze({ // these are the things the user can currently search within
        Title: "Title", // enum value
        Flair: "Flair"  // enum value
    });

    // try to get named lists of subreddits from options
    function parseNamedSubredditLists(lines) {
        namedSubredditLists = {};
        for (let line of lines) {
            let matches = line.match(/(\w+)\s*=\s*\{\s*(.*?)\s*}\s*$/);
            if (matches) {
                let stringSplit = matches[2].split(/[,;| ]/).map(x => x.trim()).filter(x => !!x);
                namedSubredditLists["_" + matches[1]] = stringSplit;
            }
        }
    }

    // get subreddit list and pattern-target pairs from input line --
    // each pattern is paired with which target property of the post to search in
    // (they all must match), and each line has a list of subreddits it applies to
    //     options lines have these parts: (pattern %=target=%)... {subreddits}
    //     everything is optional; if the pattern is absent, it will be ""
    function parseRegExpLine(line) {
        // already handled by previous parse for named lists
        if (/\s*\w+\s*=\s*{.*}/.test(line)) {
            return [null, null];
        }

        // first, split off the list of subreddits, if present;
        // subreddits list must be separated from the rest by at least one space
        let matches = line.match(/^\s*(?:(.*?)\s+)?\{\s*(.*?)\s*\}\s*$/);
        if (matches) { // subreddit list was found
            var pairsPart = matches[1] ?? "";
            var subredditsPart = matches[2] ?? "";
        } else {
            var pairsPart = line;
            var subredditsPart = "";
        }

        let patternTargetPairs = parsePatternTargetPairs(pairsPart);

        // determine what to search in
        for (let i = 0; i < patternTargetPairs.length; ++i) {
            let target = patternTargetPairs[i][1];
            // get key by value
            let key = Object.keys(Target)
                            .find(key => Target[key].toLowerCase() === target.toLowerCase());
            // default to searching for matching title, if user specified no target or bogus target
            let realTarget = Target[key] ?? Target.Title;

            // substitute corrected target based on what's actually available
            patternTargetPairs[i][1] = realTarget;
        }

        let subredditList = parseSubredditList(subredditsPart);

        return [patternTargetPairs, subredditList];
    }

    // return a list of subreddits
    function parseSubredditList(list) {
        if (list) {
            var subredditList = list.split(/[,;| ]/).map(x => x.trim()).filter(x => !!x);
        } else {
            return [];
        }

        // replace named list with its contents
        let token;
        let subredditListLen = subredditList.length;
        for (let i = 0; i < subredditListLen; i++) {
            token = "_" + subredditList[i];
            if (namedSubredditLists[token]) {
                subredditList.splice(i, 1);
                subredditList.push(...namedSubredditLists[token]);
                // you can't put one named group inside another, so stop
                // before you reach the replaced ones
                i--; subredditListLen--;
            }
        }
        return subredditList;
    }

    // return a list of pattern target pairs
    function parsePatternTargetPairs(ptPairsString, accumList = []) {
        // use recursion
        //
        // if pattern and target are both optional, and this parses a list of pairs of them,
        // how would we know how many pairs there are?
        // answer: only push an empty pair onto the list if the list and string are both empty;
        // the only reason to use more than one pair is if at least one pair has a target specified
        //
        // there's no reason to submit multiple patterns each with no accompanying target, since
        // that would mean both patterns must match in order to have an overall post match, but
        // that can be accomplished with a single pattern; fortunately, with no intervening target
        // group, and no pattern delimiters, there's no way to tell two adjacent patterns apart from
        // one big one anyway
        //
        // the above implies that only one of the pairs can have no target, and it must be the last
        // pair, so that the last two patterns can be separated by a target token
        //
        // no target means the title is the target; no pattern means an empty target is being sought;
        // there's no such thing as a blank title, but if the user really wants to try to find one,
        // that's fine
        //
        // the foregoing means that if you want to look for an empty title (which can't exist) and
        // something else at the same time, you have to specify all targets

        // break off the first pair and leave the rest (the "tail") for the next call
        // (the subreddit list is not part of this string)
        let pattern, target, tail; // (pattern)? %=(target)=% (tail)?
        // pattern and tail are optional and must be separated from the target group by at least one space
        let matches = ptPairsString.match(/^\s*(?:((?!%=).*?(?!=%))\s+)?%=\s*(\w+)\s*=%(?:\s+(\S.*?)?\s*)?$/);
        if (matches) { // target found
            pattern = matches[1] ?? "";
            target = matches[2] ?? "";
            tail = matches[3];
        } else { // no target found, so it's all one big pattern
            pattern = ptPairsString.trim();
            target = tail = "";
        }
        accumList.push([pattern, target]);
        if (tail) {
            return parsePatternTargetPairs(tail, accumList);
        } else return accumList;

        // the only way to have an empty pattern and an empty target is if the tail is also empty,
        // because otherwise what matched the tail would have been picked up by the pattern;
        // and if there's no tail, there's no recursive call; this implies that a blank pattern
        // and target are only possible with an entirely blank input, and cannot but be the only pair
    }

    const BAD_FLAIR_PREFIX = Math.random().toString(36).slice(2);
    const BAD_FLAIR_STATUS = BAD_FLAIR_PREFIX + "_STATUS_";

    // get flair either from the feed card or by loading the post page
    function getPostFlair(post) {
        const postTitle = post.getAttribute("post-title");
        const viewContext = post.getAttribute("view-context") ||
                            console.log(`Post viewing context not listed for "${postTitle}"`);

        function queryFlair(domObj) {
            return Array.from(domObj.querySelectorAll("shreddit-post-flair .flair-content"))
                                    .map(el => el.textContent);
        }

        if (viewContext == "SubredditFeed") { // viewing the post within its own subreddit,
            const flairs = queryFlair(post);  // which is the only way the flair would be on the post already
            return Promise.resolve(flairs);
        }

        let postUrl = post.getAttribute("permalink");

        const executor = (resolve, reject) => {
            GM.xmlHttpRequest({
                method: "GET",
                url: postUrl,
                //synchronous: true,
                headers: {
                    // "User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
                    // "Accept": "text/xml"            // If not specified, browser defaults will be used.
                },
                onload: function(response) {
                    const status = response.status;

                    debugLog(() => `"${postTitle}" GM.XHR st: ${status}`);
                    if (status < 200 || status > 299) {
                        console.error(`Post "${postTitle}" contains bad "permalink" attribute: ${postUrl}`);
                        // server will still count the request toward the limit, so we must resolve
                        resolve([BAD_FLAIR_STATUS + status]);
                        return;
                    }

                    let responseXML;
                    if (!response.responseXML) {
                        responseXML = new DOMParser().parseFromString(response.responseText, "text/xml");
                    } else {
                        responseXML = response.responseXML;
                    }

                    const flairs = queryFlair(responseXML);
                    resolve(flairs);
                },
                onerror: function(error) {
                    console.error(`Problem fetching "${postTitle}" to get flair:\n${error}`);
                    reject(error); // will not count toward rate limit
                }
            });
        };

        let queueItem = requestQueue.enqueue({ executor: executor });
        return queueItem.then(item => item.promise);
    }

    class StatusError extends Error {
        constructor(message) {
            super(message);
            this.name = "StatusError";
        }
    }

    function flairRetryDecorator(getFlair) {
        return async function(post) {
            let retries = 0;
            let flairList, firstFlair;
            while (retries < 3) {
                if (retries > 0) {
                    console.log(`Retry ${retries}...`)
                    const delay = Math.floor(Math.random() * 500) + 500; // between 0.5 and 1 second
                    await new Promise(r => setTimeout(r, delay));
                }
                try {
                    flairList = await getFlair(post);
                    firstFlair = flairList[0];
                    if (firstFlair?.startsWith(BAD_FLAIR_STATUS)) {
                        const status = firstFlair.slice(BAD_FLAIR_STATUS.length);
                        throw new StatusError("Bad status " + status);
                    }
                    return flairList;
                } catch (err) {
                    if (err instanceof StatusError) throw err;
                    retries++;
                }
            }
            throw new Error(`No more retries; tried ${retries} times`);
        };
    }

    getPostFlair = flairRetryDecorator(getPostFlair);

    // parse lines of regexes, forcing patterns with target="flair" to the end
    // to try to avoid flair comparisons, since those require loading the whole
    // post when looking at the main feed; maybe an earlier target will fail
    // and obviate the need (all targets in a line must match to remove a post)
    function parseAndSortOptionsLines(optionsLines) {
        const parsedLinesList = [];
        optionsLines.forEach(line => {
            const tuple = parseRegExpLine(line);
            if (tuple[0] === null) return; // not a regex line
            const parsedLine = {
                patternTargetPairs: tuple[0],
                subredditList: tuple[1]
            };

            // force pairs with "flair" to the end of the pairs for that line
            function pairCompare(a, b) {
                const targetA = a[1];
                const targetB = b[1];
                if (!targetA && !targetB) return 0;
                if (!targetA && targetB) return -1;
                if (targetA && !targetB) return 1;
                // if (targetA && targetB):
                if (targetA == targetB) return 0;
                if (targetA == Target.Flair) return 1;
                if (targetB == Target.Flair) return -1;
            }
            parsedLine.patternTargetPairs.sort(pairCompare);

            var targetSet = new Set();
            for (let i = parsedLine.patternTargetPairs.length - 1; i >= 0; --i) { // backwards!
                let [pattern, targetEnum] = parsedLine.patternTargetPairs[i];

                // eliminate pairs with bad regex
                let goodRegex = true;
                try {
                    new RegExp(pattern); // validate RegExp
                } catch (_) {
                    goodRegex = false;
                    let err = `[SCRIPT USER ERROR] Invalid regular expression: /${pattern}/`;
                    console.log(err);
                }
                // the user can enter lines with multiple patterns all paired with the same
                // target, which doesn't make sense; therefore, only the lattermost pair with a given
                // target will be kept (first encountered, but this iteration direction is backwards)
                if (!goodRegex || targetSet.has(targetEnum)) {
                    // delete the pair
                    parsedLine.patternTargetPairs.splice(i, 1);
                    if (targetSet.has(targetEnum)) {
                        console.log(`[SCRIPT USER ERROR] Multiple uses of ${targetEnum} target; only using the last one given`);
                    }
                }
                targetSet.add(targetEnum);
            }
            parsedLinesList.push(parsedLine);
        });

        // force lines that have at least one "flair" pair to the end of the list of options lines,
        // so that maybe a previous line will remove the post and flair doesn't have to be checked
        function lineCompare(a, b) {
            const targetA = a.patternTargetPairs.some(pair => pair[1] == Target.Flair);
            const targetB = b.patternTargetPairs.some(pair => pair[1] == Target.Flair);
            if (targetA == targetB) return 0;
            if (!targetA && targetB) return -1;
            if (targetA && !targetB) return 1;
        }
        return parsedLinesList.sort(lineCompare);
    }

    async function removeArticles(articles, optionsLines) {
        const parsedLinesList = parseAndSortOptionsLines(optionsLines);
        const ABBREV_LENGTH = 20;

        for (let i = 0; i < articles.length; i++) {
            // these things don't change for a given article
            const post = articles[i].querySelector("shreddit-post");
            const postId = post.getAttribute("id");
            const postTitle = post.getAttribute("post-title");
            const subreddit = post.getAttribute("subreddit-name") ??        // posts to a followed u/user have no true r/subreddit,
                              post.getAttribute("subreddit-prefixed-name"); // but they have this string beginning with "u_"
            let flairList, flairListSanitized;

            let deletePost = false;
            for (let line of parsedLinesList) {

                // before anything else, check that the post's subreddit is in the provided subreddit list
                if (line.subredditList.length > 0) {
                    if (!line.subredditList.map(x => x.toLowerCase()).includes(subreddit.toLowerCase())) {
                        debugLog(() => `article ${i}: "${postTitle.substring(0, ABBREV_LENGTH)
                                       }...": r/${subreddit} not among ` + line.subredditList.map(x => "r/" + x).join(", "))
                        continue; // to next line; subreddit list doesn't include this post's subreddit
                    }
                }

                // there may be many things the user wants to match before removing a post,
                // and they all must be tested in a big logical conjunction
                deletePost = true;
                let currentPairMatch;
                const targetSet = new Set();
                for (let [pattern, target] of line.patternTargetPairs) {
                    currentPairMatch = false;
                    targetSet.add(target);
                    let targetText = "";
                    switch (target) {
                        case Target.Flair:
                            // this is complicated by the fact that Reddit posts can have
                            //   - no flair
                            //   - empty flair
                            //   - multiple flairs, any of which can be empty

                            if (flairList === undefined) {
                                // apparently, flairs are only put on posts in their subreddit of origin,
                                // so if the post is in its subreddit, get the flair from the article, and
                                // if the post is in the Reddit feed (i.e., on the home page), try to
                                // slyly load the post and get the flair, but only do it once per post
                                if (persistentStorage.has(postId)) {
                                    flairList = persistentStorage.get(postId);
                                    debugLog(() => `Persistent storage: ${postId} -> ${flairList.map(f => f.trim()).join(", ")}`);
                                } else {
                                    try {
                                        flairList = await getPostFlair(post);
                                    } catch (err) {
                                        console.error(err);
                                        currentPairMatch = false; // no match possible on error
                                        targetText = err.name;
                                        break;
                                    }
                                    persistentStorage.set(postId, flairList); // stored for limited time
                                }
                                if (!flairList.length) debugLog(() => `article ${i}: Empty flair for "${postTitle}"`);
                            }

                            // if the pattern is length 0 and the post has no flair,
                            // remove the post (this is the only way to remove posts with no flair)
                            if (flairList.length === 0 && pattern.length === 0) {
                                targetText = "";
                                currentPairMatch = true;
                                break;
                            }
                            // get rid of all empty flair (including strange unprintable things)
                            if (flairListSanitized === undefined) {
                                flairListSanitized = flairList.map(f => f.trim())
                                .filter(f => !f.match(/^[^a-zA-Z0-9!@#%&\$\^\*\(\)\[\]\{\}\?\.;,\+\-\\\/':"`~<>]*$/));
                            }

                            // if the flairs are all empty and the pattern matches an empty string,
                            // remove the post
                            if (flairListSanitized.length === 0 && "".match(pattern)) {
                                targetText = "";
                                currentPairMatch = true;
                                break;
                            }
                            // from here onward, an empty pattern isn't helpful
                            if (pattern.length === 0) {
                                break;
                            }
                            // if there is at least one non-empty flair that matches the non-empty pattern,
                            // remove the post
                            for (let j = 0; j < flairListSanitized.length; ++j) {
                                if (flairListSanitized[j].match(pattern)) {
                                    targetText = flairListSanitized[j];
                                    currentPairMatch = true;
                                    break;
                                }
                            }
                            targetText = flairListSanitized.join(",");
                            break;
                        case Target.Title:
                        default:
                            targetText = postTitle;
                            if (pattern && postTitle.match(pattern) ||
                                !pattern && postTitle.trim().length === 0)
                            {
                                currentPairMatch = true;
                            }
                            break;
                    }
                    debugLog(() => `Testing ${target.toLowerCase()} (${targetText}) vs. ${pattern}: ${currentPairMatch}`); // DEBUG

                    // in order to remove a post, all patterns in the line must match their targets,
                    // so as soon as a pattern fails to match, continue to next options line
                    if (!currentPairMatch) {
                        deletePost = false;
                        break; // out of pairs loop
                    }
                }
                debugLog(() => `article ${i}: ${postTitle}|${line.patternTargetPairs}|${flairListSanitized}|{${line.subredditList}}`); // DEBUG
                if (!deletePost) continue; // to next options line

                const hr = articles[i].nextElementSibling;
                if (hr && hr.tagName == "HR") {
                    hr.remove();
                }
                articles[i].remove();
                if (logRemovals || DEBUG) {
                    let flairs = (targetSet.has(Target.Flair)) ? ` (flair:${flairListSanitized.join(", ")})` : "";
                    console.log(`Userscript removed "${postTitle}"${flairs} in r/${subreddit}`);
                }
                break; // it's certain that this line removes this article, so skip to next article
            }
            if (!deletePost) {
                debugLog(() => `article ${i}: "${ postTitle.substring(0, ABBREV_LENGTH)
                                                }..." not removed: No matching line of patterns`); // DEBUG
            }
        }
    }

    // get named lists of subreddits
    parseNamedSubredditLists(regexList);

    // remove articles from initial page load, before scrolling
    removeArticles(articles, regexList); // async

    // remove articles that appear when scrolling
    new MutationObserver(async mutationList => {
        for (let mutation of mutationList) {
            if (mutation.type == "childList") {
                const additions = Array.from(mutation.addedNodes);
                articles = additions.reduce((accumulator, currentNode) => {
                    // added nodes could be articles, elements that contain articles, or neither
                    if (currentNode.nodeType === Node.ELEMENT_NODE) {
                        if (currentNode.tagName === "ARTICLE") {
                            return accumulator.concat(currentNode); // added node is article
                        }
                        const containedArticles = Array.from(currentNode.querySelectorAll("article"));
                        return accumulator.concat(containedArticles); // added node has possible descendent articles
                    }
                    return accumulator; // added node is not an element
                }, []);
                if (articles.length == 0) {
                    continue;
                }
                debugLog(() => `${articles.length} new articles`); // DEBUG

                // make local copy of articles list, since execution leaves this function
                // at "await" and something happens to the list before execution resumes
                const localArticlesCopy = Array.from(articles);

                // refresh in case user updated options in the meantime
                regexList = await GM.getValue("regexList", /*default = */[]);
                logRemovals = await GM.getValue("logRemovals", /*default = */true);
                parseNamedSubredditLists(regexList);
                await removeArticles(localArticlesCopy, regexList); // async
            }
        }
    }).observe(document.body, { childList: true, subtree: true });

    /* SET SCRIPT OPTIONS */

    // create the options page
    const optionsHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Script Options</title>
            <style>
                #options {
                    /* for some reason this is required for checkbox alignment */
                }
                #options label {
                    all: unset;
                    font-size: 9pt;
                }
                #options label[for="regexList"] {
                    display: block;
                    margin-bottom: 10px;
                }
                #options textarea {
                    background-color: black;
                    display: block;
                    margin-bottom: 5px;
                    font-size: 9pt;
                    font-family: 'Lucida Console', Monaco, monospace;
                }
                #options button {
                    margin-top: 10px;
                    border-radius: 4px;
                    padding-left: 10px;
                    padding-right: 10px;
                }
                #options input[type="checkbox"],
                #options input[type="checkbox"] + label {
                    margin-top: 12px;
                    display: inline-block;
                }
                #options input[type="checkbox"] {
                    margin-left: 0px;
                    position: relative;
                    top: -6px;
                }
                #options p {
                    line-height: initial;
                    font-size: 8pt;
                    margin-top: 5pt;
                    margin-bottom: 5pt;
                }
                #options p#note {
                    color: color-mix(in srgb, currentColor, red 20%);
                }
                #options p > span {
                    font-family: 'Lucida Console', Monaco, monospace;
                }
                #options p > span#jokes {
                    font-family: unset;
                    white-space: nowrap;
                }
                #options form div {
                    max-width: 350px;
                    box-sizing: border-box;
                }
                #options div:has( > code) {
                    line-height: initial;
                    background-color: black;
                }
                #options code {
                    all: unset;
                    font-size: 8pt;
                    font-family: 'Lucida Console', Monaco, monospace;
                    color: inherit;
                    background-color: inherit;
                    border: 0px;
                }
            </style>
        </head>
        <body>
            <div id="options">
                <h1>Script Options</h1>
                <form id="optionsForm">
                    <label for="regexList">
                        Posts will be hidden if title matches one of these <a><strong>reg</strong>ular <strong>ex</strong>pressions</a>:
                    </label>
                    <textarea id="regexList" name="regexList" rows="5" cols="33" spellcheck="false"></textarea>
                    <div>
                        <p>You can follow a <a><strong>regex</strong></a> with a list of subreddits in curly braces. In that case,
                            the pattern will only be used to remove posts from those subreddits.</p>
                        <p>Not only that, but you can add lines that create named lists of subreddits, and then put
                            these names after a regex in place of the list they represent, like so:</p>
                        <div>
                            <code>favorites = { funny, politics }<br>
                                  [tT]rump { favorites, rant }</code>
                        </div>
                        <p>If you'd rather search in something other than the post title, enclose the alternative search target like
                            <span>%= this =%</span> after the regex but before any list of subreddits. Currently, the target can either be
                            <span>title</span> or <span>flair</span>. The following example removes all jokes except ones with "long" flair in
                            <span id="jokes">r/jokes:</span></p>
                        <div>
                            <code>^(?!\\s*[Ll]ong\\s*$)(?!\\s*$).+ %= flair=% {jokes}<br>
                                  %= flair<wbr>&nbsp;<wbr>&nbsp;<wbr>=%<wbr>&nbsp;<wbr>&nbsp;<wbr>&nbsp;<wbr>{ jokes }</code>
                        </div>
                        <p>The second line above takes care of removing posts with no flair at all.</p>
                        <p>Each line can have one regex pattern for each possible search target. A line with multiple targets requires
                            that all patterns match their targets in order to remove a post. If a pattern has no target following it,
                            it is assumed to be targeting the title. Separate targets and patterns from each other and from subreddit lists
                            by a space.</p>
                        <p>The following example removes posts about football stadiums:</p>
                        <div>
                            <code>[Ff]ootball %= flair =% [Ss]tadium { sports }</code>
                        </div>
                        <p id="note">Note: Do not enclose your regex in <span>/slashes/</span> unless the slashes are part of the search!</p>
                    </div>
                    <input id="logCheckbox" name="logCheckbox" type="checkbox">
                    <label for="logCheckbox">
                        Log filtered posts to the Developer Tools console
                    </label>
                    <div>
                        <button type="submit">Save</button>
                        <button id="closeOptions">Close</button>
                    </div>
                </form>
            <div>
        </body>
        </html>
    `;

    async function openOptionsInterface() {
        // create a modal for the options interface. Use an in-page modal because
        // - it doesn't use GM_openInTab because Firefox doesn't allow data: URLs,
        //   so the HTML would have to be in a separate file
        // - it doesn't use a separate HTML file, because I have no idea how to install
        //   that along with a userscript, and the userscript can't generate one
        // - it doesn't use a popup window, because those are typically blocked on a
        //   per-site basis by the browser settings
        const modal = document.createElement("div");
        modal.style.position = "fixed";
        modal.style.top = "0";
        modal.style.left = "0";
        modal.style.width = "100%";
        modal.style.height = "100%";
        modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        modal.style.zIndex = "9999";
        modal.style.display = "flex";
        modal.style.justifyContent = "center";
        modal.style.alignItems = "center";

        const scrollBox = document.createElement("div");
        scrollBox.style.maxHeight = "100vh";
        scrollBox.style.overflowY = "auto";
        scrollBox.style.scrollbarGutter = "stable";
        scrollBox.style.padding = "0px";
        scrollBox.style.border = "0px";
        scrollBox.style.margin = "0px";

        const optionsBox = document.createElement("div");
        optionsBox.id = "options";
        optionsBox.style.backgroundColor = "hsl(from thistle h s calc(l - .90*l))";
        optionsBox.style.padding = "20px";
        optionsBox.style.borderRadius = "5px";
        optionsBox.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.8)";
        optionsBox.innerHTML = optionsHtml;

        // fill text entry with saved value, if any
        const regexArea = optionsBox.querySelector("textarea");
        regexArea.value = (await GM.getValue("regexList", /*default = */[])).join("\n");
        // place text entry cursor
        if (typeof regexArea.setSelectionRange === "function") {
            regexArea.focus();
            regexArea.setSelectionRange(0, 0);
        } else if (typeof regexArea.createTextRange === "function") {
            const range = regexArea.createTextRange();
            range.moveStart('character', 0);
            range.select();
        }

        // set checkbox to saved value (defaults to checked)
        const logCheckbox = optionsBox.querySelector("input#logCheckbox");
        logCheckbox.checked = await GM.getValue("logRemovals", /*default = */true);

        // set up explanatory links about regular expressions
        const regexLinks = optionsBox.querySelectorAll("a");
        regexLinks.forEach(a => {
            a.href = "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions";
            a.target = "_blank";
            a.style.color = "inherit";
        });

        modal.appendChild(scrollBox);
        scrollBox.appendChild(optionsBox);
        document.body.appendChild(modal);

        regexArea.focus();

        // set up example text style
        optionsBox.querySelectorAll("#options div:has( > code)").forEach(el => {
            el.style.width = "100%";
            el.style.padding = "10px";
            el.style.paddingTop = "3px";
            el.style.paddingBottom = "6px";
        });

        // add button event listeners to set handlers
        // (button listeners are removed when the modal is removed/closed)
        function addButtonHandlers() {
            const form = document.getElementById("optionsForm");
            if (form) {
                // handle form submission (save options)
                form.addEventListener("submit", async function handleFormSubmit(event) {
                    event.preventDefault();
                    let newRegexList = document.getElementById("regexList").value.split("\n");
                    newRegexList = newRegexList.filter(item => item.trim() !== "");
                    await GM.setValue("regexList", newRegexList);
                    await GM.setValue("logRemovals", logCheckbox.checked);
                    alert("Options saved!");
                });
                // close modal
                document.getElementById("closeOptions").addEventListener("click", async function() {
                    document.body.removeChild(modal);
                    // update display using new settings
                    regexList = await GM.getValue("regexList", /*default = */[]);
                    logRemovals = await GM.getValue("logRemovals", /*default = */true);
                    parseNamedSubredditLists(regexList);
                    await removeArticles(articles, regexList); // async
                });
            }
        }

        // decide when to add form's event listeners
        if (document.readyState === "loading") {
            // loading hasn't finished yet
            document.addEventListener("DOMContentLoaded", addButtonHandlers, { once: true });
        } else {
            // DOMContentLoaded has already fired
            addButtonHandlers();
        }
    }

    // set the options handler
    GM.registerMenuCommand("Options", openOptionsInterface);

})();