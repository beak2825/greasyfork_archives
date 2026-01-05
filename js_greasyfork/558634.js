// ==UserScript==
// @name         КиноКлик
// @namespace    https://greasyfork.org/ru/scripts/558634-киноклик
// @author       4c5688
// @license      CC BY-SA
// @version      1.0
// @description  Добавляет кнопки для просмотра и поиска на популярных трекерах фильмов и сериалов
// @match        *://*.kinopoisk.ru/*
// @grant        none
// @icon         https://www.kinopoisk.ru/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/558634/%D0%9A%D0%B8%D0%BD%D0%BE%D0%9A%D0%BB%D0%B8%D0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/558634/%D0%9A%D0%B8%D0%BD%D0%BE%D0%9A%D0%BB%D0%B8%D0%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SAFE_RESOURCES = [
        { title: "SSpoisk", url: "http://flcksbr.top/film/%id/", icon: "https://favicon.yandex.net/favicon/kinopoisk.ru" },
        { title: "Kinobox", url: "https://kinohost.web.app/movie/%id/", icon: "https://favicon.yandex.net/favicon/kinobox.tv" },
        { title: "YouTube", url: "https://www.youtube.com/results?search_query=%text %year", icon: "https://favicon.yandex.net/favicon/youtube.com" },
        { title: "VKVideo", url: "https://vkvideo.ru/?q=%text %year", icon: "https://favicon.yandex.net/favicon/vkvideo.ru" },
        { title: "Rutube", url: "https://rutube.ru/search/?query=%text %year", icon: "https://favicon.yandex.net/favicon/rutube.ru" },
        { title: "MyMail Video", url: "https://my.mail.ru/video/search?q=%text %year", icon: "https://favicon.yandex.net/favicon/my.mail.ru" },
        { title: "Flixomo", url: "https://flixmomo.org/search?q=%text", icon: "https://favicon.yandex.net/favicon/flixmomo.org" },
        { title: "Rutracker", url: "https://rutracker.net/forum/tracker.php?nm=%text %year", icon: "https://favicon.yandex.net/favicon/rutracker.net" },
        { title: "Rutor", url: "https://rutor.org/search/0/0/100/0/%cleantext %year", icon: "https://favicon.yandex.net/favicon/rutor.org" },
        { title: "Kinozal", url: "https://kinozal.tv/browse.php?s=%text&d=%year", icon: "https://favicon.yandex.net/favicon/kinozal.tv" },
        { title: "NNMClub", url: "https://nnmclub.to/forum/tracker.php?nm=%text %year", icon: "https://favicon.yandex.net/favicon/nnmclub.to" },
        { title: "The Pirate Bay", url: "https://thepiratebay.org/search.php?q=%engcleantext %year", icon: "https://favicon.yandex.net/favicon/thepiratebay.org" },
        { title: "Nyaa", url: "https://nyaa.land/?f=0&c=0_0&q=%text", icon: "https://favicon.yandex.net/favicon/nyaa.land" },
    ];

    const QUERY_DATA = {};
    const REYO = "https://reyohoho-gitlab.vercel.app/#";

    function cleanQuery(str, lang='ru') {
        if(!str) return "";
        const stop = lang==='ru' ? ["в","во","на","по","и","с","со","к","ко","за","из","у","для","от","до","о","об","а"] : [];
        const regex = lang==='ru' ? /[^а-яё0-9\s]/gi : /[^a-z0-9\s]/gi;
        return str.toLowerCase()
                  .replace(regex," ")
                  .split(/\s+/)
                  .filter(w => w.length>2 && !stop.includes(w))
                  .join(" ");
    }

    function querystring(str) {
        return str.replace(/%(\w+)/g, (_,w) => QUERY_DATA[w.toLowerCase()] ? encodeURIComponent(QUERY_DATA[w.toLowerCase()]) : _ );
    }

    function extractQueryData() {
        try {
            const script = document.querySelector('#__NEXT_DATA__');
            const { props, query } = JSON.parse(script.textContent);
            const data = props.apolloState.data;
            const id = query.id;
            const item = data[`TvSeries:${id}`] || data[`Film:${id}`];
            const yr = Array.isArray(item.releaseYears) ? item.releaseYears[0] : item.productionYear;
            const year = typeof yr==="object" ? yr.start : yr;

            QUERY_DATA.text = item.title.russian;
            QUERY_DATA.engtext = item.title.original || item.title.russian;
            QUERY_DATA.year = year;
            QUERY_DATA.id = id;
            QUERY_DATA.cleantext = cleanQuery(QUERY_DATA.text, 'ru');
            QUERY_DATA.engcleantext = cleanQuery(QUERY_DATA.engtext, 'en');
        } catch{}
    }

    const style=document.createElement('style');
    style.textContent=`
        button.kinopoisk-watch-online-button,
        .styles_subscriptionOffer__eau7V,
        .styles_root__J2PUZ,
        .styles_hdMetaTableContainer__coI3m,
        .styles_watchingServices__EeMSa,
        .styles_plusBadgeCounter__ztZqV,
        .style_root__UUsUH.style_container__gsfKM { display:none!important; }
        .kp-alt-wrapper { margin-top:8px; position:relative; display:inline-block; justify-content:center; }
        .kp-alt-btn { cursor:pointer; padding:6px 12px; border-radius:9999px; font-weight:550; display:flex; align-items:center; gap:6px; transition:background .2s, transform .15s; }
        .kp-alt-btn:hover { background:rgba(0,0,0,0.08); transform:scale(1.05); }
        .kp-alt-arrow { transition: transform .25s ease; }
        .kp-alt-body { position:absolute; top:calc(100% + 6px); left:0; transform-origin:top; transform:scaleY(0); border-radius:10px; padding:10px; display:flex; flex-direction:column; box-shadow:0 4px 12px rgba(0,0,0,.15); transition: transform .25s ease; z-index:100; }
        .kp-alt-body.open { transform:scaleY(1); }
        .kp-row { display:flex; align-items:center; gap:10px; padding:8px 12px; border-radius:8px; cursor:pointer; transition:background .2s, transform .15s; }
        .kp-row:hover { background:rgba(0,0,0,0.08); transform:scale(1.03); }
        .kp-row a { color:inherit!important; text-decoration:none; font-size:16px; font-weight:500; }
    `;
    document.head.appendChild(style);

    let lastUrl = location.href;

    let lastId = location.pathname.match(/\/(film|series)\/(\d+)/)?.[2] || null;
    setInterval(() => {
        const newId = location.pathname.match(/\/(film|series)\/(\d+)/)?.[2] || null;
        if (newId && lastId && newId !== lastId) {
            lastId = newId;
            location.reload();
        }
    }, 300);


    const observer = new MutationObserver(()=>{
        const urlChanged = location.href !== lastUrl;
        if(urlChanged) { lastUrl = location.href; extractQueryData(); }

        let watchBtn = document.getElementById("rk-watch-btn");
        if(!watchBtn){
            const originalBtn = document.querySelector("button[title='Буду смотреть']");
            const buttonRoot = originalBtn?.closest(".style_root__1_tXA");
            const id = location.pathname.match(/\/(film|series)\/(\d+)/)?.[2];
            if(originalBtn && buttonRoot?.parentElement && id){
                const newBtn=document.createElement("button");
                newBtn.id="rk-watch-btn";
                newBtn.textContent="Смотреть онлайн";
                newBtn.title="Смотреть";
                newBtn.setAttribute("aria-pressed","false");
                newBtn.className="style_button__Awsrq style_buttonSize52__MBeHC style_buttonPrimary__Qn_9l";
                if(originalBtn.classList.contains("style_buttonLight__C8cK7")) newBtn.classList.add("style_buttonLight__C8cK7");
                if(originalBtn.classList.contains("style_buttonDark__pBW5l")) newBtn.classList.add("style_buttonDark__pBW5l");
                const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
                newBtn.onclick = () => {
                    const url = REYO+id;
                    if(isSafari) window.open(url,"_blank");
                    else { const w=720,h=720,left=(screen.width-w)/2,top=(screen.height-h)/2; window.open(url,"reyohoho_player",`width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=yes,popup=yes`); }
                };
                const wrapper=document.createElement("div");
                wrapper.className=buttonRoot.parentElement.className;
                wrapper.appendChild(newBtn);
                buttonRoot.parentElement.before(wrapper);
                watchBtn = newBtn;
            }
        }

        if(watchBtn && QUERY_DATA.text && !document.querySelector(".kp-alt-wrapper")){
            const wrapper=document.createElement("div");
            wrapper.className="kp-alt-wrapper";
            wrapper.style.display="flex"; wrapper.style.justifyContent="center"; wrapper.style.marginTop="6px";

            const altBtn=document.createElement("div");
            altBtn.className="kp-alt-btn";

            const btnStyle = getComputedStyle(watchBtn);
            altBtn.style.background = btnStyle.backgroundColor;
            altBtn.style.color = watchBtn.classList.contains("style_buttonDark__pBW5l") ? "#fff" : "#111";
            altBtn.innerHTML=`<span>Альтернативы</span><span class="kp-alt-arrow">▶</span>`;

            const body=document.createElement("div");
            body.className="kp-alt-body";
            body.style.backgroundColor = watchBtn.classList.contains("style_buttonDark__pBW5l") ? btnStyle.backgroundColor : "rgba(255,255,255,0.98)";
            body.style.color = watchBtn.classList.contains("style_buttonDark__pBW5l") ? "#fff" : "#111";

            SAFE_RESOURCES.forEach(site=>{
                const row=document.createElement("div");
                row.className="kp-row";
                row.innerHTML=`<img src="${site.icon}" width="20" height="20"><a href="${querystring(site.url)}" target="_blank">${site.title}</a>`;
                body.appendChild(row);
            });

            altBtn.onmouseenter=()=>altBtn.style.background="rgba(0,0,0,0.08)";
            altBtn.onmouseleave=()=>altBtn.style.background=btnStyle.backgroundColor;
            altBtn.onclick=e=>{
                e.stopPropagation();
                body.classList.toggle("open");
                altBtn.querySelector(".kp-alt-arrow").style.transform = body.classList.contains("open") ? "rotate(90deg)" : "rotate(0)";
            };

            document.addEventListener("click", e=>{
                if(!wrapper.contains(e.target)){
                    body.classList.remove("open");
                    altBtn.querySelector(".kp-alt-arrow").style.transform = "rotate(0)";
                }
            });

            wrapper.appendChild(altBtn);
            wrapper.appendChild(body);
            const resize = ()=>body.style.minWidth = watchBtn.offsetWidth + "px";
            resize(); window.addEventListener("resize", resize);
            watchBtn.insertAdjacentElement("afterend", wrapper);
        }
    });

    observer.observe(document.body,{childList:true,subtree:true});
    extractQueryData();
})();