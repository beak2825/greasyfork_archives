// ==UserScript==
// @name O Google
// @description Only useful for Portuguese. UserScript/GreaseMonkey p/corrigir referências de gênero ao Google, transformando por exemplo "a Google" em "o Google" (tb c/"na", "da", "pra" e "à"). Altere as urls incluídas p/os sites que te irritam com esse erro.
// @namespace http://juniorjanz.net
// @include http://mobilexpert.com.br/*
// @include https://mobilexpert.com.br/*
// @version 1
// @downloadURL https://update.greasyfork.org/scripts/8515/O%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/8515/O%20Google.meta.js
// ==/UserScript==
document.body.innerHTML = document.body.innerHTML.replace(/( d| n| pr| )(a|à)(?= Google)/gi, function(x, y, z){
if ((z == 'à') || (z == 'À')) {
    var referencia = y + 'ao';
} else {
    var referencia = y + 'o';
}
return (z == z.toLowerCase()) ? referencia : referencia.toUpperCase();
});
