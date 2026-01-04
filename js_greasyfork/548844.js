// ==UserScript==
// @name		Imtely - Immediately Invoked Gallery
// @description		A Fusker-based URL in your address bar instantly creates live galleries in your browser.
// @version		1.5
// @description:es	Una URL basada en Fusker en su barra de direcciones crea instantáneamente galerías en vivo en su navegador.
// @description:de	Eine Fusker-basierte URL in Ihrer Adressleiste erstellt sofort Live-Galerien in Ihrem Browser.
// @description:fr	Une URL basée sur Fusker dans votre barre d'adresse crée instantanément des galeries en direct dans votre navigateur.
// @description:it	Un URL basato su Fusker nella barra degli indirizzi crea immediatamente gallerie live nel tuo browser.
// @description:pt	Um URL baseado no Fusker na sua barra de endereço cria instantaneamente galerias ao vivo no seu browser.
// @author		Edvaldo
// @match		*://*/*
// @run-at		document-idle
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/548844/Imtely%20-%20Immediately%20Invoked%20Gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/548844/Imtely%20-%20Immediately%20Invoked%20Gallery.meta.js
// ==/UserScript==

( () => {
    "use strict";
    if (/\[(\d+)-(\d+)\]/.test(location)) {
        const {hostname, pathname, search, hash} = location
          , q = (hash || search || pathname).slice(1)
          , n = () => document.title = `${document.images.length}@${hostname}`
          , o = q.split("[")
          , m = o[1].split("]")
          , p = m[0].split("-")
          , e = m[1].split(",");
        let c = `<style>
		  body{background:#000;padding:8px;text-align:center}
		  body:not(:hover) img{opacity:1}
		  img:not([title]){display:none}
		  img{will-change:transform,opacity;margin:1px;border:1px solid #000;position:relative;max-width:256px;max-height:256px;vertical-align:middle;border-radius:8px;opacity:.9;transition:transform .1s,opacity .1s}
		  img:hover{z-index:1;opacity:1;filter:drop-shadow(0 0 4px #000);transform:scale(1.1)}
		  </style>
		  <base target="${Date.now()}">`;
        for (let u = +p[0]; u <= +p[1]; u++) {
            const t = u.toString().padStart(p[0].length, "0")
              , i = o[0] + t + e[0]
              , l = e.length > 2 ? i.replaceAll(e[1], e[2]) : i;
            c += `<a href="/${l}"><img src="/${i}"></a>`;
        }
        document.contentType === "text/html" ? document.documentElement.innerHTML = c : document.replaceChild(document.adoptNode(new DOMParser().parseFromString(c, "text/html").documentElement), document.documentElement);
        for (const r of document.images)
            r.onerror = () => (r.parentElement?.remove(),
            n()),
            r.onload = () => fetch(r.src, {
                method: "HEAD"
            }).then(h => {
                const d = h.headers.get("last-modified")
                  , s = h.headers.get("content-length")
                  , f = d ? new Date(d) : 0
                  , a = f ? `${f.getDate()}. ${f.toLocaleString("en-US", {
                    month: "long"
                })} ${f.getFullYear()}` : "-"
                  , k = s ? (s / 1024).toFixed(2) : "-";
                r.title = `\t𝗛𝗼𝘀𝘁𝗻𝗮𝗺𝗲⠆${hostname}\n𝗜𝗺𝗮𝗴𝗲⠆${decodeURI(r.src.split("/").pop())}\n𝗙𝗶𝗹𝗲𝘀𝗶𝘇𝗲⠆${k} KB\n𝗗𝗶𝗺𝗲𝗻𝘀𝗶𝗼𝗻𝘀⠆${r.naturalWidth} × ${r.naturalHeight} Pixel\n𝗨𝗽𝗹𝗼𝗮𝗱𝗲𝗱⠆${a}`;
                n();
            }
            ).catch( () => r.title = "Error fetching headers");
    }
}
)();
