// ==UserScript==
// @name        DinheiroVivo - ler notícias completas
// @namespace   http://domain.com/directory
// @version 1
// @description Por omissão, as notícias do site DinheiroVivo estão fracturadas em várias páginas. Este script serve para ler a notícia completa por omissão.
// @include     http://*.dinheirovivo.pt/*/interior*
// @downloadURL https://update.greasyfork.org/scripts/7350/DinheiroVivo%20-%20ler%20not%C3%ADcias%20completas.user.js
// @updateURL https://update.greasyfork.org/scripts/7350/DinheiroVivo%20-%20ler%20not%C3%ADcias%20completas.meta.js
// ==/UserScript==

if (window.location.href.indexOf("page=-1")==-1)
{
    window.location.href=window.location.href+"&page=-1";
}
  
