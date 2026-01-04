// ==UserScript==
// @name         🧠 X.com Heavy JS Optimizer+
// @name:vi      🧠 Trình tối ưu JavaScript nặng cho X.com+
// @name:en      🧠 X.com Heavy JS Optimizer+
// @name:zh-CN   🧠 X.com 高级 JavaScript 优化器+
// @name:zh-TW   🧠 X.com 高級 JavaScript 優化器+
// @name:ja      🧠 X.com 高性能 JavaScript オプティマイザー+
// @name:ko      🧠 X.com 고급 JS 최적화기+
// @name:fr      🧠 Optimiseur JavaScript Avancé pour X.com+
// @name:de      🧠 X.com Erweiterter JS-Optimierer+
// @name:es      🧠 Optimizador JS Avanzado para X.com+
// @name:pt      🧠 Otimizador JS Avançado para X.com+
// @name:it      🧠 Ottimizzatore JS Avanzato per X.com+
// @name:ru      🧠 Расширенный оптимизатор JS для X.com+
// @name:pl      🧠 Zaawansowany optymalizator JS dla X.com+
// @name:tr      🧠 X.com Gelişmiş JS Optimize Edici+
// @name:ar      🧠 مُحسِّن JavaScript متقدم لـ X.com+
// @name:hi      🧠 X.com के लिए उन्नत JS ऑप्टिमाइज़र+
// @name:th      🧠 ตัวเพิ่มประสิทธิภาพ JS ระดับสูงสำหรับ X.com+
// @name:id      🧠 Pengoptimal JS Tingkat Lanjut untuk X.com+
// @name:nl      🧠 Geavanceerde JS-Optimizer voor X.com+
// @name:uk      🧠 Розширений оптимізатор JS для X.com+
// @name:sv      🧠 X.com Tung JS-optimerare+
// @name:no      🧠 X.com Tung JS-optimaliserer+
// @name:da      🧠 X.com Tung JS-optimerer+
// @name:fi      🧠 X.com Raskas JS-optimoija+
// @name:el      🧠 Βελτιστοποιητής βαρέων JS του X.com+
// @name:cs      🧠 Těžký JS optimalizátor pro X.com+
// @name:hu      🧠 X.com Nehéz JS Optimalizáló+
// @name:ro      🧠 Optimizator JS Greu pentru X.com+
// @name:bg      🧠 Тежък JS оптимизатор за X.com+
// @name:sr      🧠 Тешки ЈС оптимизатор за X.com+
// @name:hr      🧠 Teški JS optimizator za X.com+
// @name:sk      🧠 Ťažký JS optimalizátor pre X.com+
// @name:sl      🧠 Težki JS optimizator za X.com+
// @name:lt      🧠 Sunkus JS optimizatorius, skirtas X.com+
// @name:lv      🧠 Smagais JS optimizētājs vietnei X.com+
// @name:et      🧠 Raske JS-i optimeerija X.com-i jaoks+
// @name:fil     🧠 Malakas na JS Optimizer para sa X.com+
// @name:ms      🧠 Pengoptimum JS Berat X.com+
// @name:bn      🧠 X.com ভারী জেএস অপটিমাইজার+
// @name:pa      🧠 X.com ਹੈਵੀ ਜੇਐਸ ਆਪਟੀਮਾਈਜ਼ਰ+
// @name:jv      🧠 Optimizer JS Abot kanggo X.com+
// @name:te      🧠 X.com హెవీ JS ఆప్టిమైజర్+
// @name:mr      🧠 X.com हेवी जेएस ऑप्टિમાઇઝર+
// @name:ta      🧠 X.com கனமான ஜேஎஸ் ஆப்டிమైజర్+
// @name:ur      🧠 X.com ہیوی جے ایس آپٹیمائزر+
// @name:fa      🧠 بهینه ساز سنگین جاوا اسکریپت X.com+
// @name:he      🧠 מייעל JS כבד של X.com+
// @name:sw      🧠 Kiongeza kasi cha JS Kizito cha X.com+
// @name:af      🧠 X.com Swaar JS-optimeerder+

// @description        Enhance X.com/Twitter performance by removing heavy CSS, throttling FPS, limiting feed DOM, blocking analytics, and optimizing offscreen videos.
// @description:vi     Cải thiện hiệu năng X.com/Twitter bằng cách loại bỏ CSS nặng, giới hạn FPS, giảm tải DOM feed, chặn theo dõi và tối ưu video ngoài màn hình.
// @description:en     Improve X.com/Twitter performance: removes heavy CSS, throttles FPS, limits DOM size, pauses offscreen videos, blocks analytics, and auto-enables aggressive mode when lag is detected.
// @description:zh-CN  优化 X.com/Twitter 性能：移除高负载 CSS、限制 FPS、减少 DOM、暂停屏幕外视频、屏蔽分析并在卡顿时自动启用高性能模式。
// @description:zh-TW  優化 X.com/Twitter 效能：移除高負載 CSS、限制 FPS、減少 DOM、暫停螢幕外影片、封鎖分析並在延遲時自動啟用高效模式。
// @description:ja      X.com/Twitter のパフォーマンスを向上: 重い CSS を削除し、FPS を制限し、フィード DOM を縮小し、画面外の動画を一時停止し、分析をブロックし、遅延時に自動的にアグレッシブモードを有効化。
// @description:ko      X.com/Twitter 성능 최적화: 무거운 CSS 제거, FPS 제한, 피드 DOM 축소, 화면 밖 동영상 일시정지, 분석 차단, 렉 발생 시 자동 공격적 모드 전환.
// @description:fr      Améliorez les performances de X.com/Twitter : supprime les filtres CSS lourds, limite les FPS, réduit le DOM, met en pause les vidéos hors écran, bloque l’analytique et active le mode agressif en cas de ralentissement.
// @description:de      Optimiert die Leistung von X.com/Twitter: Entfernt schwere CSS-Filter, begrenzt FPS, reduziert das DOM, pausiert Videos außerhalb des Bildschirms, blockiert Analysen und aktiviert bei Lag den aggressiven Modus automatisch.
// @description:es      Mejora el rendimiento de X.com/Twitter: elimina CSS pesados, limita FPS, reduce DOM, pausa videos fuera de pantalla, bloquea analíticas y activa modo agresivo automáticamente al detectar lag.
// @description:pt      Melhora o desempenho do X.com/Twitter: remove CSS pesado, limita FPS, reduz o DOM, pausa vídeos fora da tela, bloqueia análises e ativa o modo agressivo automaticamente quando há lag.
// @description:it      Migliora le prestazioni di X.com/Twitter: rimuove CSS pesanti, limita FPS, riduce DOM, mette in pausa i video fuori schermo, blocca le analisi e attiva la modalità aggressiva quando rileva lag.
// @description:ru      Оптимизирует X.com/Twitter: удаляет тяжелые CSS, ограничивает FPS, сокращает DOM, приостанавливает видео вне экрана, блокирует аналитику и автоматически включает агрессивный режим при лагах.
// @description:pl      Popraw wydajność X.com/Twitter: usuwa ciężkie style CSS, ogranicza FPS, zmniejsza DOM, wstrzymuje filmy poza ekranem, blokuje analitykę i automatycznie włącza tryb agresywny przy lagach.
// @description:tr      X.com/Twitter performansını artırır: ağır CSS filtrelerini kaldırır, FPS sınırlar, DOM’u küçültür, ekrandışı videoları duraklatır, analitiği engeller ve gecikme durumunda agresif modu otomatik açar.
// @description:ar      تحسين أداء X.com/Twitter: إزالة CSS الثقيل، تحديد معدل الإطارات، تقليل DOM، إيقاف الفيديوهات خارج الشاشة، حظر التحليلات، وتفعيل الوضع العدواني تلقائيًا عند التأخير.
// @description:hi      X.com/Twitter का प्रदर्शन बेहतर करें: भारी CSS हटाएं, FPS सीमित करें, DOM कम करें, ऑफस्क्रीन वीडियो रोकें, एनालिटिक्स ब्लॉक करें और लैग पर स्वतः आक्रामक मोड चालू करें.
// @description:th      ปรับปรุงประสิทธิภาพ X.com/Twitter: ลบ CSS หนัก, จำกัด FPS, ลด DOM, หยุดวิดีโอนอกหน้าจอ, บล็อกการวิเคราะห์ และเปิดโหมดแรงอัตโนมัติเมื่อแลค.
// @description:id      Meningkatkan performa X.com/Twitter: menghapus CSS berat, membatasi FPS, mengurangi DOM, menjeda video di luar layar, memblokir analitik, dan otomatis mengaktifkan mode agresif saat lag terdeteksi.
// @description:nl      Verbeter de prestaties van X.com/Twitter: verwijdert zware CSS, beperkt FPS, vermindert DOM, pauzeert video's buiten beeld, blokkeert analyses en activeert automatisch agressieve modus bij lag.
// @description:uk      Оптимізує X.com/Twitter: видаляє важкі CSS, обмежує FPS, скорочує DOM, призупиняє відео поза екраном, блокує аналітику та автоматично вмикає агресивний режим при лагах.
// @description:sv      Förbättra prestandan för X.com/Twitter: tar bort tung CSS, stryper FPS, begränsar DOM-storleken, pausar videor utanför skärmen, blockerar analyser och aktiverar automatiskt aggressivt läge när fördröjning upptäcks.
// @description:no      Forbedre ytelsen til X.com/Twitter: fjerner tung CSS, struper FPS, begrenser DOM-størrelse, pauser videoer utenfor skjermen, blokkerer analyser og aktiverer automatisk aggressiv modus når etterslep oppdages.
// @description:da      Forbedre ydeevnen for X.com/Twitter: fjerner tung CSS, drosler FPS, begrænser DOM-størrelse, pauser videoer uden for skærmen, blokerer analyser og aktiverer automatisk aggressiv tilstand, når der registreres forsinkelse.
// @description:fi      Paranna X.com/Twitter-suorituskykyä: poistaa raskaat CSS-tyylit, rajoittaa FPS:ää, pienentää DOM-kokoa, keskeyttää ruudun ulkopuoliset videot, estää analytiikan ja ottaa aggressiivisen tilan automaattisesti käyttöön viiveen sattuessa.
// @description:el      Βελτιώστε την απόδοση του X.com/Twitter: αφαιρεί βαριά CSS, περιορίζει τα FPS, μειώνει το μέγεθος του DOM, θέτει σε παύση βίντεο εκτός οθόνης, αποκλείει τα αναλυτικά στοιχεία και ενεργοποιεί αυτόματα την επιθετική λειτουργία όταν εντοπίζεται καθυστέρηση.
// @description:cs      Zlepšete výkon X.com/Twitter: odstraňuje těžké CSS, omezuje FPS, zmenšuje velikost DOM, pozastavuje videa mimo obrazovku, blokuje analytiku a automaticky povoluje agresivní režim při zpoždění.
// @description:hu      Javítsa az X.com/Twitter teljesítményét: eltávolítja a nehéz CSS-t, korlátozza az FPS-t, csökkenti a DOM méretét, szünetelteti a képernyőn kívüli videókat, letiltja az analitikát, és késés esetén automatikusan engedélyezi az agresszív módot.
// @description:ro      Îmbunătățiți performanța X.com/Twitter: elimină CSS-ul greu, limitează FPS-ul, reduce dimensiunea DOM-ului, întrerupe videoclipurile din afara ecranului, blochează analizele și activează automat modul agresiv la detectarea întârzierilor.
// @description:bg      Подобрете производителността на X.com/Twitter: премахва тежък CSS, ограничава FPS, намалява размера на DOM, поставя на пауза видеоклипове извън екрана, блокира анализи и автоматично активира агресивен режим при забавяне.
// @description:sr      Побољшајте перформансе X.com/Twitter-а: уклања тежак ЦСС, ограничава ФПС, смањује величину ДОМ-а, паузира видео снимке ван екрана, блокира аналитику и аутоматски омогућава агресивни режим када се открије кашњење.
// @description:hr      Poboljšajte performanse X.com/Twittera: uklanja teški CSS, ograničava FPS, smanjuje veličinu DOM-a, pauzira videozapise izvan zaslona, blokira analitiku i automatski omogućuje agresivan način rada kada se otkrije kašnjenje.
// @description:sk      Zlepšite výkon X.com/Twitter: odstraňuje ťažké CSS, obmedzuje FPS, zmenšuje veľkosť DOM, pozastavuje videá mimo obrazovky, blokuje analytiku a automaticky povoľuje agresívny režim pri oneskorení.
// @description:sl      Izboljšajte delovanje X.com/Twitter: odstrani težke CSS, omeji FPS, zmanjša velikost DOM, zaustavi videoposnetke zunaj zaslona, blokira analitiko in samodejno omogoči agresiven način ob zaznavi zaostanka.
// @description:lt      Pagerinkite „X.com“ / „Twitter“ našumą: pašalina sunkų CSS, riboja FPS, sumažina DOM dydį, pristabdo vaizdo įrašus už ekrano ribų, blokuoja analizę ir automatiškai įjungia agresyvųjį režimą, kai aptinkamas vėlavimas.
// @description:lv      Uzlabojiet X.com/Twitter veiktspēju: noņem smago CSS, ierobežo FPS, samazina DOM lielumu, aptur video ārpus ekrāna, bloķē analīzi un automātiski ieslēdz agresīvo režīmu, kad tiek konstatēta aizkave.
// @description:et      Parandage X.com/Twitteri jõudlust: eemaldab raske CSS-i, piirab FPS-i, vähendab DOM-i suurust, peatab ekraanivälised videod, blokeerib analüütika ja lubab viivituse tuvastamisel automaatselt agressiivse režiimi.
// @description:fil     Pahusayin ang pagganap ng X.com/Twitter: nag-aalis ng mabibigat na CSS, nag-throttle ng FPS, nililimitahan ang laki ng DOM, ipinapahinga ang mga video na wala sa screen, hinaharangan ang analytics, at awtomatikong pinapagana ang agresibong mode kapag may na-detect na lag.
// @description:ms      Tingkatkan prestasi X.com/Twitter: membuang CSS berat, mengurangkan FPS, mengehadkan saiz DOM, menjedakan video di luar skrin, menyekat analitik dan mengaktifkan mod agresif secara automatik apabila ketinggalan dikesan.
// @description:bn      X.com/Twitter এর পারফরম্যান্স উন্নত করুন: ভারী CSS সরিয়ে দেয়, FPS থ্রোটল করে, DOM আকার সীমিত করে, অফস্ক্রিন ভিডিও পজ করে, বিশ্লেষণ ব্লক করে এবং ল্যাগ সনাক্ত হলে স্বয়ংক্রিয়ভাবে আক্রমণাত্মক মোড সক্ষম করে।
// @description:pa      X.com/Twitter ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਵਿੱਚ ਸੁਧਾਰ ਕਰੋ: ਭਾਰੀ CSS ਨੂੰ ਹਟਾਉਂਦਾ ਹੈ, FPS ਨੂੰ ਥ੍ਰੋਟਲ ਕਰਦਾ ਹੈ, DOM ਆਕਾਰ ਨੂੰ ਸੀਮਿਤ ਕਰਦਾ ਹੈ, ਆਫਸਕ੍ਰੀਨ ਵੀਡੀਓ ਨੂੰ ਰੋਕਦਾ ਹੈ, ਵਿਸ਼ਲੇਸ਼ਣ ਨੂੰ ਬਲੌਕ ਕਰਦਾ ਹੈ, ਅਤੇ ਪਛੜ ਜਾਣ 'ਤੇ ਸਵੈਚਲਿਤ ਤੌਰ 'ਤੇ ਹਮਲਾਵਰ ਮੋਡ ਨੂੰ ਸਮਰੱਥ ਬਣਾਉਂਦਾ ਹੈ।
// @description:jv      Ningkatake kinerja X.com/Twitter: mbusak CSS abot, matesi FPS, matesi ukuran DOM, ngaso video ing njaba layar, mblokir analitik, lan ngaktifake mode agresif kanthi otomatis nalika ana lag.
// @description:te      X.com/Twitter పనితీరును మెరుగుపరచండి: భారీ CSSను తొలగిస్తుంది, FPSని థ్రోటిల్ చేస్తుంది, DOM పరిమాణాన్ని పరిమితం చేస్తుంది, ఆఫ్-స్క్రీన్ వీడియోలను పాజ్ చేస్తుంది, విశ్లేషణలను బ్లాక్ చేస్తుంది మరియు లాగ్ కనుగొనబడినప్పుడు స్వయంచాలకంగా దూకుడు మోడ్‌ను ప్రారంభిస్తుంది.
// @description:mr      X.com/Twitter कार्यप्रदर्शन सुधारा: जड CSS काढते, FPS थ्रॉटल करते, DOM आकार मर्यादित करते, ऑफस्क्रीन व्हिडिओ थांबवते, विश्लेषण ब्लॉक करते आणि लॅग आढळल्यास स्वयंचलितपणे आक्रमक मोड सक्षम करते.
// @description:ta      X.com/Twitter செயல்திறனை மேம்படுத்தவும்: கனமான CSS ஐ நீக்குகிறது, FPS ஐக் கட்டுப்படுத்துகிறது, DOM அளவைக் கட்டுப்படுத்துகிறது, திரைக்கு வெளியே உள்ள வீடியோக்களை இடைநிறுத்துகிறது, பகுப்பாய்வுகளைத் தடுக்கிறது, மற்றும் தாமதம் கண்டறியப்படும்போது தானாகவே தீவிர பயன்முறையை இயக்குகிறது.
// @description:ur      X.com/Twitter کی کارکردگی کو بہتر بنائیں: بھاری CSS کو ہٹاتا ہے، FPS کو تھروٹل کرتا ہے، DOM کے سائز کو محدود کرتا ہے، آف اسکرین ویڈیوز کو روکتا ہے، تجزیات کو بلاک کرتا ہے، اور وقفے کا پتہ چلنے پر خود بخود جارحانہ موڈ کو فعال کرتا ہے۔
// @description:fa      بهبود عملکرد X.com/Twitter: حذف CSS سنگین، محدود کردن FPS، محدود کردن اندازه DOM، توقف ویدیوهای خارج از صفحه، مسدود کردن تجزیه و تحلیل و فعال کردن خودکار حالت تهاجمی هنگام تشخیص تاخیر.
// @description:he      שפר את הביצועים של X.com/Twitter: מסיר CSS כבד, מווסת FPS, מגביל את גודל ה-DOM, משהה סרטונים מחוץ למסך, חוסם אנליטיקה ומפעיל אוטומטית מצב אגרסיבי כאשר מזוהה השהיה.
// @description:sw      Boresha utendaji wa X.com/Twitter: huondoa CSS nzito, hupunguza FPS, hupunguza ukubwa wa DOM, husitisha video zilizo nje ya skrini, huzuia uchanganuzi, na huwasha kiotomatiki hali ya fujo wakati ucheleweshaji unapogunduliwa.
// @description:af      Verbeter X.com/Twitter se werkverrigting: verwyder swaar CSS, smoor FPS, beperk DOM-grootte, onderbreek video's buite die skerm, blokkeer analise, en aktiveer outomaties aggressiewe modus wanneer vertraging bespeur word.

// @author       Oppai1442
// @namespace    https://greasyfork.org/users/oppai1442
// @license      MIT
// @homepageURL  https://greasyfork.org/scripts/553367-x-com-heavy-js-optimizer
// @version      1.3.9
// @icon         https://x.com/favicon.ico
// @match        *://x.com/*
// @match        *://twitter.com/*
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @inject-into  auto
// @downloadURL https://update.greasyfork.org/scripts/553367/%F0%9F%A7%A0%20Xcom%20Heavy%20JS%20Optimizer%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/553367/%F0%9F%A7%A0%20Xcom%20Heavy%20JS%20Optimizer%2B.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // =======================
  // 1) CONFIG (userscript context)
  // =======================
  const LS_KEY_MODE = '__x_opt_aggressive__';
  const LS_KEY_LIMIT = '__x_opt_limit__';
  const LS_KEY_BLOCK_METRICS = '__x_opt_block_metrics__';
  const LS_KEY_NUKE_PRELOAD = '__x_opt_nuke_preload__';
  const LS_KEY_LANG = '__x_opt_lang__';

  const LANG = (localStorage.getItem(LS_KEY_LANG) || navigator.language || 'en')
    .toLowerCase().startsWith('vi') ? 'vi' : 'en';

  const readBool = (k, def = false) => {
    const v = localStorage.getItem(k);
    if (v == null) return def;
    return v === '1';
  };

  const I18N = {
    vi: {
      aggressive: (on) => `Aggressive: ${on ? 'ON' : 'OFF'}`,
      limitTitle: (n) => `Giới hạn tweet DOM (hiện: ${n})`,
      limitPrompt: 'Giữ tối đa bao nhiêu tweet trong DOM? (0 = không giới hạn)',
      blockMetrics: (on) => `Block metrics rác: ${on ? 'ON' : 'OFF'}`,
      nukePreload: (on) => `Nuke preload/prefetch: ${on ? 'ON' : 'OFF'}`,
    },
    en: {
      aggressive: (on) => `Aggressive: ${on ? 'ON' : 'OFF'}`,
      limitTitle: (n) => `Tweet DOM limit (current: ${n})`,
      limitPrompt: 'Max tweets to keep in DOM? (0 = unlimited)',
      blockMetrics: (on) => `Block noisy metrics: ${on ? 'ON' : 'OFF'}`,
      nukePreload: (on) => `Nuke preload/prefetch: ${on ? 'ON' : 'OFF'}`,
    }
  };

  const T = I18N[LANG];

  const cfg = {
    AGGRESSIVE: readBool(LS_KEY_MODE, false),
    LIMIT_FEED: Math.max(0, parseInt(localStorage.getItem(LS_KEY_LIMIT) ?? '70', 10) || 0),
    BLOCK_METRICS: readBool(LS_KEY_BLOCK_METRICS, true),
    NUKE_PRELOAD: readBool(LS_KEY_NUKE_PRELOAD, readBool(LS_KEY_MODE, false)),
  };

  // =======================
  // 2) MENU (userscript context)
  // =======================
  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand(T.aggressive(cfg.AGGRESSIVE), () => {
      localStorage.setItem(LS_KEY_MODE, cfg.AGGRESSIVE ? '0' : '1');
      location.reload();
    });

    GM_registerMenuCommand(T.limitTitle(cfg.LIMIT_FEED), () => {
      const v = prompt(T.limitPrompt, String(cfg.LIMIT_FEED));
      if (v == null) return;
      const n = Math.max(0, parseInt(v, 10) || 0);
      localStorage.setItem(LS_KEY_LIMIT, String(n));
      location.reload();
    });

    GM_registerMenuCommand(T.blockMetrics(cfg.BLOCK_METRICS), () => {
      localStorage.setItem(LS_KEY_BLOCK_METRICS, cfg.BLOCK_METRICS ? '0' : '1');
      location.reload();
    });

    GM_registerMenuCommand(T.nukePreload(cfg.NUKE_PRELOAD), () => {
      localStorage.setItem(LS_KEY_NUKE_PRELOAD, cfg.NUKE_PRELOAD ? '0' : '1');
      location.reload();
    });
    GM_registerMenuCommand(`Language: ${LANG.toUpperCase()}`, () => {
      const next = (LANG === 'vi') ? 'en' : 'vi';
      localStorage.setItem(LS_KEY_LANG, next);
      location.reload();
    });
  }

  // =======================
  // 3) CSS (userscript context) — nhẹ, ít rủi ro
  // =======================
  const injectCSSOnce = (css, id) => {
    if (id && document.getElementById(id)) return;
    const el = document.createElement('style');
    if (id) el.id = id;
    el.textContent = css;
    (document.head || document.documentElement).appendChild(el);
  };

  injectCSSOnce(`
    /* Giảm compositor nặng */
    * { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }
    [style*="backdrop-filter"], [style*="filter: blur"], *[style*="blur("] { filter: none !important; }

    html, body { scroll-behavior: auto !important; }

    /* Offscreen render: lợi cho feed dài */
    article[role="article"], [data-testid="cellInnerDiv"], [data-testid="sidebarColumn"] {
      content-visibility: auto !important;
      contain: layout paint style !important;
      contain-intrinsic-size: 800px !important;
    }

    /* Dọn bóng/gradient */
    [class*="shadow"], [style*="box-shadow"] { box-shadow: none !important; }
    [class*="gradient"], [class*="bg-gradient"], [style*="linear-gradient("] { background-image: none !important; }

    video { transform: none !important; will-change: auto !important; background-color: black !important; }
    * { will-change: auto !important; }
    ${cfg.AGGRESSIVE ? '* { animation: none !important; transition: none !important; }' : ''}
  `, 'oppai1442-xopt-css');

  // =======================
  // 4) PAGE CONTEXT INJECTION (ăn chắc)
  // =======================
  function main(cfg) {
    const TAG = '[Oppai1442] X-Optimizer';
    const {
      AGGRESSIVE,
      LIMIT_FEED,
      BLOCK_METRICS,
      NUKE_PRELOAD,
    } = cfg;

    // -------- Config nội bộ --------
    const TARGET_FPS = 45;
    const LONGTASK_AUTO_ON_MS = 1500;
    const LONGTASK_ULTRA_ON_MS = 3000;

    let useRAFCap = !!AGGRESSIVE;
    let minInterval = AGGRESSIVE ? 100 : 0;
    let ultraMode = false;

    const onReady = (fn) =>
      (document.readyState === 'loading')
        ? document.addEventListener('DOMContentLoaded', fn, { once: true })
        : fn();

    const innerInjectCSSOnce = (css, id) => {
      if (id && document.getElementById(id)) return;
      const el = document.createElement('style');
      if (id) el.id = id;
      el.textContent = css;
      (document.head || document.documentElement).appendChild(el);
    };

    console.log(`${TAG} Page Context active`);

    // -------- 0) Kill React DevTools hook (nhẹ) --------
    try {
      delete window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
      Object.defineProperty(window, '__REACT_DEVTOOLS_GLOBAL_HOOK__', {
        value: {},
        writable: false,
        configurable: false
      });
    } catch { }

    // -------- 1) Passive listeners cho scroll/touch/wheel --------
    (function patchEventsPassive() {
      const origAdd = EventTarget.prototype.addEventListener;
      const passiveEvents = new Set(['touchstart', 'touchmove', 'wheel', 'mousewheel', 'scroll']);
      EventTarget.prototype.addEventListener = function (type, listener, options) {
        if (passiveEvents.has(type)) {
          if (options == null) options = { passive: true };
          else if (typeof options === 'boolean') options = { capture: options, passive: true };
          else if (typeof options === 'object' && options.passive == null) options = { ...options, passive: true };
        }
        return origAdd.call(this, type, listener, options);
      };
    })();

    // -------- 2) Nuke preload/prefetch/modulepreload (tuỳ chọn) --------
    const removePreloads = () => {
      document
        .querySelectorAll('link[rel="preload"], link[rel="prefetch"], link[rel="modulepreload"]')
        .forEach(l => l.remove());
    };

    if (NUKE_PRELOAD) {
      // chạy sớm + theo dõi thêm
      onReady(removePreloads);

      // Throttle observer của *mình* (không override global MO)
      let plScheduled = false;
      const plObs = new MutationObserver(() => {
        if (plScheduled) return;
        plScheduled = true;
        requestAnimationFrame(() => {
          plScheduled = false;
          try { removePreloads(); } catch { }
        });
      });
      plObs.observe(document.documentElement, { childList: true, subtree: true });
    }

    // -------- 3) Block metrics (fetch + XHR + sendBeacon) --------
    if (BLOCK_METRICS) {
      const noisy = /\/(client_event|impression|engagement|scribe|metrics|ad_event)/i;

      // fetch
      try {
        const origFetch = window.fetch?.bind(window);
        if (origFetch) {
          window.fetch = (input, init) => {
            try {
              const url = (typeof input === 'string') ? input : (input?.url ?? '');
              if (noisy.test(url)) return Promise.resolve(new Response(null, { status: 204 }));
            } catch { }
            return origFetch(input, init);
          };
        }
      } catch { }

      // XHR
      try {
        const OrigXHR = window.XMLHttpRequest;
        if (OrigXHR && OrigXHR.prototype) {
          const origOpen = OrigXHR.prototype.open;
          const origSend = OrigXHR.prototype.send;

          OrigXHR.prototype.open = function (method, url, ...rest) {
            try { this.__xopt_url = String(url || ''); } catch { }
            return origOpen.call(this, method, url, ...rest);
          };

          OrigXHR.prototype.send = function (...args) {
            try {
              const u = this.__xopt_url || '';
              if (noisy.test(u)) {
                try { this.abort(); } catch { }
                // giả lập "xong" để tránh caller treo
                try {
                  Object.defineProperty(this, 'readyState', { value: 4, configurable: true });
                  Object.defineProperty(this, 'status', { value: 204, configurable: true });
                } catch { }
                return;
              }
            } catch { }
            return origSend.apply(this, args);
          };
        }
      } catch { }

      // sendBeacon: chỉ block metrics, không chặn tất cả (đỡ bể)
      try {
        const origBeacon = navigator.sendBeacon?.bind(navigator);
        if (origBeacon) {
          navigator.sendBeacon = (url, data) => {
            try {
              if (noisy.test(String(url || ''))) return true;
            } catch { }
            try { return origBeacon(url, data); } catch { return true; }
          };
        } else {
          // fallback
          navigator.sendBeacon = () => true;
        }
      } catch { }
    }

    // -------- 4) Throttle timers + rAF cap (aggressive/auto) --------
    const origRAF = window.requestAnimationFrame.bind(window);
    const origSetInterval = window.setInterval.bind(window);
    const origSetTimeout = window.setTimeout.bind(window);

    let lastRAF = 0;

    window.setTimeout = (fn, delay, ...args) => {
      const d = (delay == null || delay < minInterval) ? (minInterval || delay || 0) : delay;
      return origSetTimeout(fn, d, ...args);
    };

    window.setInterval = (fn, delay, ...args) => {
      const d = (delay == null || delay < minInterval) ? (minInterval || delay || 0) : delay;
      return origSetInterval(fn, d, ...args);
    };

    window.requestAnimationFrame = (cb) => {
      if (!useRAFCap) return origRAF(cb);
      return origRAF((ts) => {
        if (ts - lastRAF >= (1000 / TARGET_FPS)) {
          lastRAF = ts;
          try { cb(ts); } catch { }
        } else {
          origRAF(cb);
        }
      });
    };

    // -------- 5) Media optimization: video + img --------
    let playingNow = null;

    const optimizeVideo = (v) => {
      if (!v || v.__xopt_done) return;
      v.__xopt_done = true;

      try {
        v.autoplay = false;
        v.loop = false;
        v.preload = 'metadata';
      } catch { }

      v.addEventListener('play', () => {
        if (playingNow && playingNow !== v) {
          try { playingNow.pause(); } catch { }
        }
        playingNow = v;
      }, { passive: true });
    };

    const tuneImg = (img) => {
      if (!img) return;
      try { img.loading = 'lazy'; } catch { }
      try { img.decoding = 'async'; } catch { }
      try { img.fetchPriority = 'low'; } catch { }
    };

    const scanMedia = (root = document) => {
      if (!root || typeof root.querySelectorAll !== 'function') return;
      root.querySelectorAll('video').forEach(optimizeVideo);
      root.querySelectorAll('img').forEach(tuneImg);
    };

    onReady(scanMedia);

    // Throttle callback observer của mình
    let moBuf = [];
    let moScheduled = false;

    const mediaObs = new MutationObserver((muts) => {
      moBuf.push(...muts);
      if (moScheduled) return;
      moScheduled = true;

      requestAnimationFrame(() => {
        moScheduled = false;
        const batch = moBuf.splice(0);
        for (const m of batch) {
          for (const n of (m.addedNodes || [])) {
            if (n && n.nodeType === 1) {
              if (n.tagName === 'VIDEO') optimizeVideo(n);
              else if (n.tagName === 'IMG') tuneImg(n);
              else scanMedia(n);
            }
          }
        }
      });
    });

    mediaObs.observe(document.documentElement, { childList: true, subtree: true });

    // Pause video offscreen
    try {
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          const v = e.target;
          if (!(v instanceof HTMLVideoElement)) continue;
          if (!e.isIntersecting) {
            try { v.pause(); } catch { }
          }
        }
      }, { root: null, threshold: 0.001 });

      onReady(() => document.querySelectorAll('video').forEach(v => io.observe(v)));
    } catch { }

    // Pause hết khi tab ẩn
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        document.querySelectorAll('video').forEach(v => { try { v.pause(); } catch { } });
      }
    }, { passive: true });

    // -------- 6) Feed GC (không giật scroll) --------
    // Thay vì display:none -> dùng content-visibility:hidden + khóa height.
    // Vừa giảm paint/layout cost, vừa giữ layout để khỏi “tụt mẹ scroll”.
    const pruneTweet = (el) => {
      if (!el || el.__xopt_pruned) return;
      el.__xopt_pruned = true;

      // lock height trước khi hide content
      let h = 0;
      try { h = Math.max(0, Math.floor(el.getBoundingClientRect().height || 0)); } catch { }
      if (!h) h = 800; // fallback

      try {
        el.style.contain = 'layout paint style';
        el.style.contentVisibility = 'hidden';
        el.style.containIntrinsicSize = `${h}px`;
        el.style.height = `${h}px`;
        el.style.overflow = 'hidden';
      } catch { }

      // giải phóng decode
      try {
        el.querySelectorAll('video').forEach(v => { try { v.pause(); } catch { } });
      } catch { }
    };

    const gcFeed = () => {
      if (!LIMIT_FEED) return;

      const nodes = document.querySelectorAll('article[role="article"]');
      if (nodes.length <= LIMIT_FEED) return;

      const over = nodes.length - LIMIT_FEED;

      // Prune những cái cũ nhất (ở top)
      for (let i = 0; i < over; i++) {
        pruneTweet(nodes[i]);
      }
    };

    window.setInterval(gcFeed, 1500);

    // -------- 7) Longtask auto-toggle Aggressive/Ultra --------
    try {
      let bucket = 0;

      const po = new PerformanceObserver((list) => {
        for (const e of list.getEntries()) bucket += (e.duration || 0);
      });

      po.observe({ type: 'longtask', buffered: true });

      window.setInterval(() => {
        const total = bucket; bucket = 0;

        if (!useRAFCap && total > LONGTASK_AUTO_ON_MS) {
          useRAFCap = true;
          minInterval = 100;
          console.warn(`${TAG} Aggressive ON (auto) longtasks=${total | 0}ms`);
        }

        if (!ultraMode && total > LONGTASK_ULTRA_ON_MS) {
          ultraMode = true;
          useRAFCap = true;
          minInterval = 150;

          innerInjectCSSOnce(
            `.xopt-ultra *{ animation:none!important; transition:none!important; }`,
            'oppai1442-xopt-ultra-css'
          );
          document.documentElement.classList.add('xopt-ultra');

          console.warn(`${TAG} ULTRA ON longtasks=${total | 0}ms`);
        }
      }, 5000);
    } catch { }
  }

  function waitForNonceAndInject({ timeoutMs = 3000, intervalMs = 50 } = {}) {
    const start = performance.now();

    const tick = () => {
      const s = document.querySelector('script[nonce]');
      const nonce = s?.nonce || s?.getAttribute('nonce');

      if (nonce) {
        const script = document.createElement('script');
        script.setAttribute('nonce', nonce);
        script.textContent = '(' + main.toString() + ')(' + JSON.stringify(cfg) + ');';
        (document.head || document.documentElement).appendChild(script);
        script.remove();
        return;
      }

      if (performance.now() - start >= timeoutMs) {
        // fallback: inject luôn (có thể bị CSP block, nhưng ít nhất không treo)
        const script = document.createElement('script');
        script.textContent = '(' + main.toString() + ')(' + JSON.stringify(cfg) + ');';
        (document.head || document.documentElement).appendChild(script);
        script.remove();
        return;
      }

      setTimeout(tick, intervalMs);
    };

    tick();
  }

  waitForNonceAndInject({ timeoutMs: 3000, intervalMs: 50 });

})();