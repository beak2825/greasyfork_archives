// ==UserScript==
// @name         Boosteroid Session Keeper
// @name:id      Boosteroid Penjaga Sesi
// @name:ug      Boosteroid مەشغۇلاتنى ساقلىغۇچى
// @name:ar      Boosteroid حافظ الجلسة
// @name:ja      Boosteroid セッションキーパー
// @name:he      Boosteroid שומר הפעלה
// @name:hi      Boosteroid सत्र रक्षक
// @name:ko      Boosteroid 세션 키퍼
// @name:th      Boosteroid ตัวรักษาเซสชัน
// @name:nb      Boosteroid Sesjonsholder
// @name:sv      Boosteroid Sessionshållare
// @name:sr      Boosteroid Čuvar Sesije
// @name:sk      Boosteroid Strážca Relácie
// @name:hu      Boosteroid Munkamenet-tartó
// @name:ro      Boosteroid Păstrător de Sesiune
// @name:fi      Boosteroid Istunnon Pitäjä
// @name:el      Boosteroid Διατηρητής Συνεδρίας
// @name:it      Boosteroid Custode della Sessione
// @name:bg      Boosteroid Пазител на Сесията
// @name:es      Boosteroid Guardián de Sesión
// @name:cs      Boosteroid Strážce Relace
// @name:vi      Boosteroid Người Giữ Phiên
// @name:pl      Boosteroid Strażnik Sesji
// @name:uk      Boosteroid Зберігач Сесії
// @name:ru      Boosteroid Хранитель Сессии
// @name:tr      Boosteroid Oturum Koruyucu
// @name:fr      Boosteroid Gardien de Session
// @name:nl      Boosteroid Sessiebewaker
// @name:da      Boosteroid Sessionsholder
// @name:de      Boosteroid Sitzungs-Wächter
// @name:zh-cn   Boosteroid 会话保持器
// @name:zh-tw   Boosteroid 會話保持器
// @name:pt-br   Boosteroid Guardião de Sessão
// @name:fr-ca   Boosteroid Gardien de Session
// @namespace    ProfessionalScripts
// @version      1.0
// @description  A tool that automatically clicks to extend your session.
// @description:id Alat yang secara otomatis mengklik untuk memperpanjang sesi Anda.
// @description:ug مەشغۇلات ۋاقتىنى ئۇزارتىش ئۈچۈن ئاپتوماتىك چېكىش قورالى.
// @description:ar أداة تنقر تلقائيًا لتمديد الجلسة الخاصة بك.
// @description:ja セッションを延長するために自動的にクリックするツール。
// @description:he כלי שלוחץ אוטומטית כדי להאריך את הפעלה שלך.
// @description:hi एक उपकरण जो आपके सत्र को बढ़ाने के लिए स्वचालित रूप से क्लिक करता है।
// @description:ko 세션을 연장하기 위해 자동으로 클릭하는 도구입니다.
// @description:th เครื่องมือที่คลิกเพื่อขยายเซสชันของคุณโดยอัตโนมัติ
// @description:de Ein Tool, das automatisch klickt, um Ihre Sitzung zu verlängern.
// @description:tr Oturumunuzu uzatmak için otomatik olarak tıklayan bir araç.
// @description:da Et værktøj, der automatisk klikker for at forlænge din session.
// @description:fr Un outil qui clique automatiquement pour prolonger votre session.
// @description:bg Инструмент, който автоматично щраква, за да удължи сесията ви.
// @description:ro Un instrument care dă clic automat pentru a vă prelungi sesiunea.
// @description:fi Työkalu, joka napsauttaa automaattisesti istunnon pidentämiseksi.
// @description:it Uno strumento che clicca automaticamente per estendere la sessione.
// @description:el Ένα εργαλείο που κάνει αυτόματο κλικ για να παρατείνει τη συνεδρία σας.
// @description:es Una herramienta que hace clic automáticamente para extender tu sesión.
// @description:hu Egy eszköz, amely automatikusan rákattint a munkamenet meghosszabbítására.
// @description:nb Et verktøy som automatisk klikker for å forlenge økten din.
// @description:sk Nástroj, ktorý automaticky klikne na predĺženie vašej relácie.
// @description:sv Ett verktyg som automatiskt klickar för att förlänga din session.
// @description:sr Alat koji automatski klikće za produženje vaše sesije.
// @description:pl Narzędzie, které automatycznie klika, aby przedłużyć sesję.
// @description:nl Een tool die automatisch klikt om uw sessie te verlengen.
// @description:cs Nástroj, který automaticky odklikne prodloužení relace.
// @description:uk Інструмент, який автоматично натискає для продовження сесії.
// @description:ru Инструмент, который автоматически нажимает для продления вашей сессии.
// @description:vi Một công cụ tự động nhấp để gia hạn phiên của bạn.
// @description:zh-cn 一个自动点击以延长会话的工具。
// @description:zh-tw 一個自動點擊以延長會話的工具。
// @description:pt-br Uma ferramenta que clica automaticamente para estender sua sessão.
// @description:fr-ca Un outil qui clique automatiquement pour prolonger votre session.
// @author       ShinoYumi
// @match        https://cloud.boosteroid.com/static/streaming/streaming.html?sessionId=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boosteroid.com
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560576/Boosteroid%20Session%20Keeper.user.js
// @updateURL https://update.greasyfork.org/scripts/560576/Boosteroid%20Session%20Keeper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        SCAN_INTERVAL: 10000,
        SELECTORS: {
            BUTTON: "#confirm_btn",
            LABEL: "#confirm_btn span"
        },
        THEME: {
            TOAST: "position:fixed;top:25px;left:50%;transform:translateX(-50%);background:#0f0f0f;color:#00ff88;padding:14px 28px;border-radius:2px;font-family:'Consolas',monospace;font-size:12px;z-index:10000;box-shadow:0 10px 30px rgba(0,0,0,0.8);border-left:4px solid #00ff88;opacity:0;transition:opacity 0.5s ease;pointer-events:none;letter-spacing:1px;text-transform:uppercase;"
        }
    };

    function displayStatus(text) {
        const el = document.createElement("div");
        el.style.cssText = CONFIG.THEME.TOAST;
        el.innerText = `> ${text}`;
        document.body.appendChild(el);

        requestAnimationFrame(() => el.style.opacity = "1");

        setTimeout(() => {
            el.style.opacity = "0";
            setTimeout(() => el.remove(), 600);
        }, 3500);
    }

    function processVerification() {
        const actionTarget = document.querySelector(CONFIG.SELECTORS.BUTTON);

        if (actionTarget) {
            const interaction = new MouseEvent("click", {
                view: window,
                bubbles: true,
                cancelable: true
            });

            actionTarget.dispatchEvent(interaction);

            const subElement = document.querySelector(CONFIG.SELECTORS.LABEL);
            if (subElement) subElement.click();

            displayStatus("SESSION EXTENDED: SUCCESS");
        }
    }

    const bootstrap = () => {
        displayStatus("MONITORING SYSTEM INITIALIZED");
        setInterval(processVerification, CONFIG.SCAN_INTERVAL);
    };

    if (document.readyState === "complete") {
        bootstrap();
    } else {
        window.addEventListener("load", bootstrap);
    }

})();