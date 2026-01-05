// ==UserScript==
// @name            The West - Fancy Market
// @name:it         The West - Fancy Market
// @description     Market Utilities [Best bids and total value sold]
// @description:it  Market Utilities [Best bids and total value sold]
// @namespace       Esperiano
// @author	    	Esperiano            
// @include         http*://*.the-west.*/game.php*
// @version         0.1.4
// @exclude         http://www.the-west.*
// @exclude         http*://forum.the-west.*
// @downloadURL https://update.greasyfork.org/scripts/8600/The%20West%20-%20Fancy%20Market.user.js
// @updateURL https://update.greasyfork.org/scripts/8600/The%20West%20-%20Fancy%20Market.meta.js
// ==/UserScript==

TWFM_inject = function(){
    if (document.getElementById('TWFM_js'))
    { alert("Script già installato"); return; }
    var TWFMjs = document.createElement('script');
    TWFMjs.setAttribute('type', 'text/javascript');
    TWFMjs.setAttribute('language', 'javascript'); 
    TWFMjs.setAttribute('id', 'TWFM_js');
    TWFMjs.innerHTML = "("+(function(){

        /*inizio corpo script*/

        var TWFM_api = TheWestApi.register('tw-fancymarket', 'TW - Fancy Market', '2.2', Game.version.toString(), 'Esperiano [aka Neper]', 'https://greasyfork.org/it/scripts/8600');
        TWFM_api.setGui('<br><i>Version 0.1.4</i><br><br>Updated version of the original script <a target=\'_blanck\' href="http://userscripts-mirror.org/scripts/show/139937">The West - Market best bids</a>'
                        +' with a new feature that show you the total amount of money from sold items at the market.<br><br><b>BEST AUCTION</b><br>At the market "buy" tab, it shows the best price for each auction '
                        +'highlighting the best price and the item for sale with:'
                        +'<br>-<font color="blue"><b>BLUE</b></font>: the selling price is lower or equal of the 75% of the purchase price;'
                        +'<br>-<font color="green"><b>GREEN</b></font>: the selling price is lower of the 100% and higher of the 75% of the purchase price;'
                        +'<br>-<b>BLACK</b> [just bold]: the selling price is equal of the purchase price;'
                        +'<br>-<font color="red"><b>RED</b></font>: the selling price is higher of the purchase price.'
                        +'<br><br><b>MONEY TO COLLECT</b><br>A the market "sell" tab, it shows the total amount of money to collect from sold items. It is not considered the money from running auctions.');     



        // DATABASE OGGETTI
        var Oggetti_array = [];
        for (var i = 0; i < 999999; i++) {
            var item = ItemManager.getByBaseId(i);
            if (item !== undefined && localStorage.getItem('Id_'+i)!== undefined){
                Oggetti_array[i] = [item.name,item.price];
                localStorage.setItem("Id_"+i, Oggetti_array[i]);
            }
        }
        // FINE DATABASE OGGETTI



        var money = 0;
        $('#windows').on('DOMNodeInserted', function(e) {
            var element = e.target;
            setTimeout( function(){

                /*            INIZIO COLORIZE MARKET            */
                if($(element).is("div[class*='marketOffersData']")) {
                    var prezzoggetto;
                    var asta = $(element).children()[4];
                    var compraora = $(element).children()[3];
                    var qta = $(element).children()[2].textContent;
                    var nomeoggetto = $(element).children()[1];
                    var miglior_prezzo;
                    //alert (nomeoggetto.textContent);
                    for (var key in localStorage) {
                        if (typeof key === 'string' && key.indexOf('Id_') === 0) {
                            var index = key.split('_') [1];
                            if (localStorage.getItem('Id_'+index).split(',') [0] === nomeoggetto.textContent || localStorage.getItem('Id_'+index).split(',') [0].split(':') [1] === nomeoggetto.textContent){
                                prezzoggetto=localStorage.getItem('Id_'+index).split(',')[1];
                            }
                        }
                    }
                    if (asta.textContent){
                        var asta_original=asta.textContent.replace("$","");
                        asta_original=asta_original.replace(/\./g,"");
                        asta_original=asta_original.replace(/\,/g,"");											//PREZZO COMPRA ORA SENZA PUNTI(ITA), VIRGOLE(ENG) E $
                        miglior_prezzo=asta_original/qta;
                        if (miglior_prezzo == prezzoggetto){
                            asta.style.fontWeight = 'bold';
                            nomeoggetto.style.fontWeight = 'bold';
                        }
                        if (miglior_prezzo < prezzoggetto){
                            nomeoggetto.style.color='green';
                            asta.style.color='green';
                            asta.style.fontWeight = 'bold';
                            nomeoggetto.style.fontWeight = 'bold';
                        }
                        if (miglior_prezzo > prezzoggetto){
                            nomeoggetto.style.color='red';
                            asta.style.color='red';
                            asta.style.fontWeight = 'bold';
                            nomeoggetto.style.fontWeight = 'bold';
                        }
                        if (miglior_prezzo <= prezzoggetto*0.75){
                            nomeoggetto.style.color='blue';
                            asta.style.color='blue';
                            asta.style.fontWeight = 'bold';
                            nomeoggetto.style.fontWeight = 'bold';
                        }
                    }else{
                        var compraora_original = compraora.textContent.replace("$","");
                        compraora_original = compraora_original.replace(/\./g,"");
                        compraora_original = compraora_original.replace(/\,/g,"");								//PREZZO COMPRA ORA SENZA PUNTI(ITA), VIRGOLE(ENG) E $
                        miglior_prezzo=compraora_original/qta;
                        if (miglior_prezzo == prezzoggetto){
                            compraora.style.fontWeight = 'bold';
                            nomeoggetto.style.fontWeight = 'bold';
                        }
                        if (miglior_prezzo < prezzoggetto){
                            nomeoggetto.style.color='green';
                            compraora.style.color='green';
                            compraora.style.fontWeight = 'bold';
                            nomeoggetto.style.fontWeight = 'bold';
                        }
                        if (miglior_prezzo > prezzoggetto){
                            nomeoggetto.style.color='red';
                            compraora.style.color='red';
                            compraora.style.fontWeight = 'bold';
                            nomeoggetto.style.fontWeight = 'bold';
                        }
                        if (miglior_prezzo <= prezzoggetto*0.75){
                            nomeoggetto.style.color='blue';
                            compraora.style.color='blue';
                            compraora.style.fontWeight = 'bold';
                            nomeoggetto.style.fontWeight = 'bold';
                        }
                    }
                }
            },250);
            /*            FINE COLORIZE MARKET            */

            /*            INIZIO TOTAL MONEY            */
            if($(element).is("div[class*='marketSellsData']")) {
                if ($("div[class*='marketSellsData']").length == 1)
                    money=0;
                var terminato = $(element).children()[6].textContent;
                var offerta = $(element).children()[4].textContent;

                if (offerta){
                    offerta=offerta.replace("$","");
                    offerta=offerta.replace(/\./g,"");
                    offerta=offerta.replace(/\,/g,"");
                    offerta=parseInt(offerta);
                }else {
                    offerta = 0;
                }
                if (!terminato.match(/\d+/g))
                    money = money + offerta;
                $('div#market_selltable > div.trows > div.tfoot > div.row_foot > div.cell_4').text(money);
            }
            /*            FINE TOTAL MONEY            */

        });
        /*fine corpo script*/
    }
                           ).toString()+")();";
    document.body.appendChild(TWFMjs);
};

if (location.href.indexOf(".the-west.") != -1 && location.href.indexOf("game.php") != -1)
    setTimeout(TWFM_inject, 5000, false);
