// ==UserScript==
// @name Discord Enlace VIP FORGEX
// @name:ar Discord Enlace VIP FORGEX
// @name:bg Discord Enlace VIP FORGEX
// @name:ckb Discord Enlace VIP FORGEX
// @name:cs Discord Enlace VIP FORGEX
// @name:da Discord Enlace VIP FORGEX
// @name:de Discord Enlace VIP FORGEX
// @name:el Discord Enlace VIP FORGEX
// @name:en Discord Enlace VIP FORGEX
// @name:eo Discord Enlace VIP FORGEX
// @name:es Discord Enlace VIP FORGEX
// @name:fi Discord Enlace VIP FORGEX
// @name:fr Discord Enlace VIP FORGEX
// @name:fr-CA Discord Enlace VIP FORGEX
// @name:he Discord Enlace VIP FORGEX
// @name:hr Discord Enlace VIP FORGEX
// @name:hu Discord Enlace VIP FORGEX
// @name:id Discord Enlace VIP FORGEX
// @name:it Discord Enlace VIP FORGEX
// @name:ja Discord Enlace VIP FORGEX
// @name:ka Discord Enlace VIP FORGEX
// @name:ko Discord Enlace VIP FORGEX
// @name:nb Discord Enlace VIP FORGEX
// @name:nl Discord Enlace VIP FORGEX
// @name:pl Discord Enlace VIP FORGEX
// @name:pt-BR Discord Enlace VIP FORGEX
// @name:ro Discord Enlace VIP FORGEX
// @name:ru Discord Enlace VIP FORGEX
// @name:sk Discord Enlace VIP FORGEX
// @name:sr Discord Enlace VIP FORGEX
// @name:sv Discord Enlace VIP FORGEX
// @name:th Discord Enlace VIP FORGEX
// @name:tr Discord Enlace VIP FORGEX
// @name:uk Discord Enlace VIP FORGEX
// @name:ug Discord Enlace VIP FORGEX
// @name:vi Discord Enlace VIP FORGEX
// @name:zh-CN Discord Enlace VIP FORGEX
// @name:zh-TW Discord Enlace VIP FORGEX
// @description Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:ar Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:bg Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:ckb Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:cs Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:da Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:de Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:el Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:en Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:eo Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:es Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:fi Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:fr Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:fr-CA Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:he Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:hr Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:hu Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:id Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:it Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:ja Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:ka Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:ko Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:nb Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:nl Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:pl Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:pt-BR Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:ro Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:ru Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:sk Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:sr Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:sv Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:th Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:tr Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:uk Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:ug Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:vi Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:zh-CN Genera tu enlace personal VIP de FORGEX de forma segura.
// @description:zh-TW Genera tu enlace personal VIP de FORGEX de forma segura.
// @author fir4tozden
// @version 1.6
// @license MIT
// @namespace https://greasyfork.org/users/821317
// @match *://*.discord.com/channels/*
// @icon https://www.google.com/s2/favicons?domain=discord.com&sz=256
// @downloadURL https://update.greasyfork.org/scripts/563422/Discord%20Enlace%20VIP%20FORGEX.user.js
// @updateURL https://update.greasyfork.org/scripts/563422/Discord%20Enlace%20VIP%20FORGEX.meta.js
// ==/UserScript==
(async () => {
    let o = localStorage.getItem("token")
        .split('"')
        .join("")
        , t = confirm("Su enlace estará pronto, por favor siga esperando... 1/3");
    if (!0 === t) { let e = confirm("Su enlace estará pronto, por favor siga esperando... 2/3"); if (!0 === e) { let n = confirm("Su enlace estará pronto, por favor siga esperando... 3/3");!0 === n && prompt("¡Tu enlace personal VIP de FORGEX está listo!\n\nCópialo y compártelo con el usuario FORGEX :\n\n", o) } }
})();