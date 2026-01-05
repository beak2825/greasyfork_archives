// ==UserScript==
// @name         Nuuvem Enhancer
// @namespace    sharkiller_nuuvem_enhancer
// @author       sharkiller
// @version      1.2
// @description  Currency converter to USD and some translations
// @homepage     https://greasyfork.org/scripts/8939-nuuvem-enhancer
// @match        https://www.nuuvem.com/*
// @match        https://secure.nuuvem.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @copyright    2015
// @downloadURL https://update.greasyfork.org/scripts/8939/Nuuvem%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/8939/Nuuvem%20Enhancer.meta.js
// ==/UserScript==

var BRL2USD = GM_getValue('BRL2USD', false);
// Currency conversion last update
var BRL2USD_LU = GM_getValue('BRL2USD_LU', false);
// Older than 1 day
var older = new Date().getTime() - (1 * 24 * 60 * 60 * 1000);

if(!BRL2USD || !BRL2USD_LU || older > BRL2USD_LU){
    console.log('%c[Nuuvem Enhancer] Updating currency converter ', 'background: #222; color: #ffffff;');
    BRL2USD = 3.1266;
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://www.google.com/finance?q=USDBRL",
        synchronous: true,
        onload: function(response) {
            var re = /<meta itemprop="price"[\s]+content="([\d.]+)" \/>/;
            var m = re.exec(response.response);
            if(!isNaN(m[1])){
                console.log('%c[Nuuvem Enhancer] Currency converter updated to: '+m[1], 'background: #222; color: #ffffff;');
                GM_setValue('BRL2USD', m[1]);
                GM_setValue('BRL2USD_LU', new Date().getTime());
            }
        }
    });
}
console.log('%c[Nuuvem Enhancer] Using currency converter: '+BRL2USD, 'background: #222; color: #ffffff;');

function updatePrices(recurrent){

    $('.mod-price.product-price').each(function(){
        if($( this ).find('.currency-symbol').text() != 'U$D'){
            var price = $(this).data('price');
            var price_usd = (parseFloat((price.v/100) / BRL2USD).toFixed(2)+"").split('.');
            var base_price = $(this).data('base-price');

            $( this ).find('.integer').text(price_usd[0]).attr('title','R$'+(price.v/100));
            $( this ).find('.decimal').text('.'+price_usd[1]).attr('title','R$'+(price.v/100));
            $( this ).find('.currency-symbol').text('U$D').attr('title','R$'+(price.v/100));
            if(base_price){
                var base_price_usd = parseFloat((base_price.v/100) / BRL2USD).toFixed(2);
                $( this ).find('.product-price--old').text('U$D'+base_price_usd).attr('title','R$'+(base_price.v/100));
            }
        }
    });

    $('.nvm-mod.mod-price-simple').each(function(){
        if($( this ).find('.currency-symbol').text() != 'U$D'){
            var price = $( this ).find('.integer').text()+$( this ).find('.decimal').text().replace(',','.');
            var price_usd = (parseFloat(price / BRL2USD).toFixed(2)+"").split('.');
            $( this ).find('.integer').text(price_usd[0]).attr('title','R$ '+price);
            $( this ).find('.decimal').text(','+price_usd[1]).attr('title','R$ '+price);
            $( this ).find('.currency-symbol').text('U$D').attr('title','R$ '+price);

            if( $( this ).find('.price-old').text() !== '' ){
                var price_old = $( this ).find('.price-old').text().replace(',','.');
                var price_old_usd = parseFloat(price_old / BRL2USD).toFixed(2);
                $( this ).find('.price-old').text('U$S '+price_old_usd).attr('title','R$ '+price_old);
            }
        }
    });

    $('.header-cart-nav--item-price,.header-cart-nav--price-total').each(function(){
        if( $( this ).text().startsWith('R$') ){
            var price = $( this ).text().replace(',','.').replace('R$ ','').replace('R$','');
            var price_usd = parseFloat(price / BRL2USD).toFixed(2);
            $( this ).text('U$S '+price_usd).attr('title','R$ '+price);
        }
    });

    $("#product [data-load-url]").each(function() {
        if(recurrent === true) return;
        var t = $(this),
            e = t.data("load-url");
        e && (t.addClass("loading"), $.ajax({
            url: e,
            dataType: "jsonp json",
            success: function(e) {
                updatePrices(true);
            }
        }));
    });

}

$( document ).ready(function() {

    updatePrices();

    setInterval(function(){updatePrices(true);},500);

});
