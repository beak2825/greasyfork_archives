// ==UserScript==
// @name         Telegram t.me/s/ Full Date Enabler
// @namespace    https://violentmonkey.github.io/
// @version      1.0
// @description  Replaces time in all posts with full date like "21 november 2025, 13:45". Supports 20 languages.
// @author       Streampunk
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGI0lEQVR4nO1bW2xURRg+8q6A92eC9MwWKGJE4hW5vHhJeJBEJaSJiQnBFxPffKkS0whRLiaiJOKLIEHFIu7MbukFLakFuZZSWrrdtmzphZbednfmnO1efvOfugvt3s5t97TJfsmfNHtm5+z3zT//zPzzV5JKKKGEEkooPFb+EXqKMGWTzPgumfE9hIrDhPFjmlFxGD/DZ9gG20oLHlWwSKbKFpmKQ4TyDsIEGDGZ8ZuEim9REOxLWihYzoJPEMZ3y1T0GyWdVQzKA4Tyz1ecDj4uzVesck8uJVTskykP20U8gxBhwvhXFTUTS6R5A4CHZCYqZSruFop4+vQQw8QtdjhNXVrO4BGZ8RPFIp5BiBr0PEfIE0+onFDe4xT5+8b95W6VFJW8y8vXESZGnSef8oTxFVS8VBTyZW7xosw4d5p0mgiUh2XG1xfc7WUqxpwmm9WouOdiqqsg5CtqJpbMjzmf1xO6l9WNL7ZdAELFSafJ6RdB/GoreZmJSqdJGTUXE9ttIb/KPbm0mJucXPZmkwIfXoxAhVeHFzAxbMuOkVCxz0nS6+oU+KJ9GjqDcUhi58WIzqnA91oiL9dNPSZTHnKC+DvNKpwIREHEIA1vNSl6BQhbOkARxncXdbTPKFDVNnu050KJAaz0GOiX8s8snOd5oJijjeTy4cp43FDfMuO3TeUTZKpsKeho182M9q0co50JR/uiht9V5lZeNyGAOOTUaEdjMQgMjUBHbyDt2afX9QXAWV5AxTeGBSCUd9pF+uUGBapvToMvlH+0Ryem4LqvB652dmt/z8XWc6qZ39BmiLzLHX7aKulyj4APLqjgHYrBtA4v54oKt/ruaMSv3fLD2GQwrU0kDrDKSABMGuWJ1bWhJ/WPvkfZbJb4Kw0KfN05DQGeyM8aAGKxONy5O6oRR2vt8sNUmGds2zZpLACajgMy5R+ZHe2oPt4axqaC0ObrTZG/3tUDYaFkbY+xw7RXUr7TiAB79XT66v+j3S8MsE65e3+KOFpbdy8IVc35PVw1zAqA9w4GBBDf5+ps81kF6odjEDPGO83dk9bu7wM1Mp33+9uaVfMCUHHIiAcczdXZ8dtRY8wzuHvSOnoCMB3N3x9OrTU6DkHZBeA/2SbA1nMq3JiMm3b3pOHnuObrAW6PTc9/4wKInFPgwfX94ysRLTgNzokDSCyTuyfNFxiAeFz/LvBkf8yiAMamwF4zL3m7SdU2PJcGg1pEz0a+d2AYEgljAQSPxFYEIJR/WbBlkMyxnU33spLvHx4BM3i/RbUqgP5lkDBlk5WXrfWG4cJNfxr5gZF7psjHEwDP1Vogjxshj7LB2F0+5QkrLzx8eWAW+VNtARgKR0wJ4A8lrI5+Am+tdQuAMHOn/6BV/jU+S4AjLT442vgvXBlK3+Pnw+kBawHQ8GEIMVOcYP6lqz0cmtvvT4Mfz7XDqcZm+KXxPHh9o4YE2NNhLQDKVByUjIJYOBAlbf/FwZQAx/++rAmAVtPYDEdah3ULUHneWgCUmXjNkZTYtrMTGvmWDr9GOinAwfpr8CwLwSdXI3nTYLhYYvbIPHmTKTEElqVYEQBPiQ03euF0a2+K/IH6a7DGE0q1efcfFUbV7HuCvrC1ACgzUSU5mRavvjAExy7NCHCgoXUW+aRtaFS0s34msEHzAdByWhyBNTlWBNhYF4QfznfD/vpWqGDp5JO2tlbAmeH0+YDH7aLs/nKVwRAqBq2I8EbtGKz2hPO2czEB3/mi2rxPYrvJHaDMxJBtt8TELXZYEcCo7boUgd/6Y9YSIB7xni3kkyCU/1xMEawYFm5JdmNZ3fhiLEhaAOS7cNpKhQD5U31mvlyVZ7HRFV5VlgoJmfH1hawGNT3yuFy7+QtSMVDO+POEipH5Q16MYfVaUcgngcWJWJDkOHnGu8o8apnkBMpOwcOE8uOOCUDF7/OicNrFxHbceBSR+KDt67wdyyQmUwtbUsODuL0t2DJnB/AAhWUpeAy1cZ7fxlOdyzv5qLRgUAWL8EYWixNkKm4Yc3GewO9gJkdLZiykf5nJBkxKuqiyEdPThPFqvHzBG6gZw4sYXo3PUDTDCcwSSiihhBIkU/gPl+NAtPTy4YcAAAAASUVORK5CYII=
// @match        https://t.me/s/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556509/Telegram%20tmes%20Full%20Date%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/556509/Telegram%20tmes%20Full%20Date%20Enabler.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Month names in correct form and case for each language (all lowercase where applicable)
    const months = {
        ru: ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'],
        uk: ['січня','лютого','березня','квітня','травня','червня','липня','серпня','вересня','жовтня','листопада','грудня'],
        be: ['студзеня','лютага','сакавіка','красавіка','траўня','чэрвеня','ліпеня','жніўня','верасня','кастрычніка','лістапада','снежня'],
        kk: ['қаңтар','ақпан','наурыз','сәуір','мамыр','маусым','шілде','тамыз','қыркүйек','қазан','қараша','желтоқсан'],
        ky: ['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октябрь','ноябрь','декабрь'],
        tg: ['январ','феврал','март','апрел','май','июн','июл','август','сентябр','октябр','ноябр','декабр'],
        uz: ['yanvar','fevral','mart','aprel','may','iyun','iyul','avgust','sentabr','oktabr','noyabr','dekabr'],
        pl: ['stycznia','lutego','marca','kwietnia','maja','czerwca','lipca','sierpnia','września','października','listopada','grudnia'],
        en: ['january','february','march','april','may','june','july','august','september','october','november','december'],
        es: ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'],
        fr: ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'],
        de: ['januar','februar','märz','april','mai','juni','juli','august','september','oktober','november','dezember'],
        pt: ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'],
        it: ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'],
        tr: ['ocak','şubat','mart','nisan','mayıs','haziran','temmuz','ağustos','eylül','ekim','kasım','aralık'],
        ar: ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'],
        hi: ['जनवरी','फ़रवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितंबर','अक्टूबर','नवंबर','दिसंबर'],
        zh: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'], // Chinese – year month day order (most common on the web)
        ja: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'], // Japanese – format: 2025年11月21日 13:45 (year-month-day order)
        ko: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'], // Korean – format: 2025년 11월 21일 13:45 (year-month-day order)
    };

    // Detect page language from <html lang="…">
    function detectLanguage() {
        const htmlLang = (document.documentElement.lang || '').toLowerCase().split('-')[0];
        return months.hasOwnProperty(htmlLang) ? htmlLang : 'en';
    }

    const lang = detectLanguage();
    const monthList = months[lang];

    // Format date differently for East-Asian languages (ja, ko, zh)
    function formatDate(isoString) {
        const d = new Date(isoString);

        const year  = d.getUTCFullYear();
        const month = monthList[d.getUTCMonth()];
        const day   = d.getUTCDate();
        const hours   = d.getUTCHours().toString().padStart(2, '0');
        const minutes = d.getUTCMinutes().toString().padStart(2, '0');

        // Japanese, Korean, Chinese – year month day order (most common on the web)
        if (lang === 'ja' || lang === 'ko' || lang === 'zh') {
            return `${year}년 ${month} ${day}일 ${hours}:${minutes}`.replace('년', '년'); // ko
            // ja and zh use the same numeric months, only "年" changes, but Telegram uses Arabic numerals anyway
        }

        // All other languages – day month year order
        return `${day} ${month} ${year}, ${hours}:${minutes}`;
    }

    // Process <time class="time"> elements
    function process() {
        document.querySelectorAll('time.time:not([data-full-date])').forEach(el => {
            const iso = el.getAttribute('datetime');
            if (!iso) return;

            el.textContent = formatDate(iso);
            el.dataset.fullDate = '1';
        });
    }

    const observer = new MutationObserver(process);
    observer.observe(document.body, { childList: true, subtree: true });

    process();
    const timer = setInterval(process, 1000);
    setTimeout(() => clearInterval(timer), 15000);

    window.addEventListener('scroll', () => setTimeout(process, 150), { passive: true });

    // console.log(`Telegram t.me full localized date enabled – detected language: ${lang.toUpperCase()}`);
})();