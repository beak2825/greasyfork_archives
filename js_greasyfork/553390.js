// ==UserScript==
// @name         Subastas DARLEY - sort lots by price
// @namespace    http://tampermonkey.net/
// @version      2025-10-22
// @description  It rerenders lots sorted by price
// @author       You
// @license      MIT
// @match        https://www.subastasdarley.com/es/salas/detalles/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=subastasdarley.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553390/Subastas%20DARLEY%20-%20sort%20lots%20by%20price.user.js
// @updateURL https://update.greasyfork.org/scripts/553390/Subastas%20DARLEY%20-%20sort%20lots%20by%20price.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var btn1 = document.createElement('div');
    btn1.innerHTML = '<a href="#" onclick="displayLotes();">Display Ordered</a>';
    document.querySelector('#migas_pan').appendChild(btn1);
})();

window.extractData = function(lote) {
    let k = lote.querySelector('.datos_subasta_lote');
    let lotNr = k.children[0].querySelector('span').textContent;
    let label = k.children[2].querySelector('span').textContent;
    let fullPrice = k.children[2].querySelector('span').parentElement.textContent.replaceAll(".", "");
    if (label !== "Precio de Salida.") {
        console.error("Precio de salida not found");
    }
    let startPrice = parseInt(fullPrice.match(/\d+/)[0]);

    return {"lot": lotNr, "startPrice": startPrice};
}

window.displayLotes = function() {
    let lotes = [];
    document.querySelectorAll('.item_lote').forEach(lote => {
        let data = window.extractData(lote);
        let img = lote.querySelector('.img_subasta_lote a img');
        let ahref = lote.querySelector('.tit_subasta_lote a');

        data.title = ahref.textContent;
        data.href = ahref.getAttribute('href');
        data.img = img.getAttribute('src');
        lotes.push(data);
        //const node = document.createElement("<img src='" + data.img + "' />");
    });
    lotes.sort((a, b) => a.startPrice - b.startPrice);
    console.log(lotes);


    var mainDiv = document.createElement('div');
    mainDiv.style.cssText = 'margin-left: 20px;';

    lotes.forEach(data => {
        var div = document.createElement('div');
        div.className = 'item_lote';
        div.style.cssText = 'display:inline-block;width: 320px;padding: 8px;border-right: 1px #bbb solid;border-bottom: 1px #bbb solid;';

        div.innerHTML = "<a target='_blank' href='" + data.href + "'><img src='" + data.img +"' /></a><p style='font-size: 16px'>" + data.title + "<br />" + data.lot + "<br />Start Price: " + data.startPrice + "<br /></p>";
        mainDiv.appendChild(div);
    });

    document.querySelector('#migas_pan').appendChild(mainDiv);
}