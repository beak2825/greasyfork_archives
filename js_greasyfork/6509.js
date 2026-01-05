// ==UserScript==
// @name        Find unused keys @Groupees Mod for PG
// @namespace   https://greasyfork.org/users/726
// @version     0.92
// @author      Deparsoul
// @description Find unused keys at groupees.com
// @include     /^https?:\/\/groupees\.com\/users\/\d+/
// @license     GPL version 3 or any later version
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6509/Find%20unused%20keys%20%40Groupees%20Mod%20for%20PG.user.js
// @updateURL https://update.greasyfork.org/scripts/6509/Find%20unused%20keys%20%40Groupees%20Mod%20for%20PG.meta.js
// ==/UserScript==

function main(){

var fuk_button_pg = jQuery('<button id="find_unused_keys" class="button" style="padding:10px;margin:10px;">Find specific games</button>');
jQuery('#profile_content').prepend(fuk_button_pg);

fuk_button_pg.click(function(){
    fuk_button_pg.text('Loading ...').prop("disabled", true);;
    fuk_load_pg(0);
});

function match_game(product){
    //---Game list---
    var list = [
        'Gray Matter',
        'Akane the Kunoichi',
        'Ku: Shroud of the Morrigan',
    ];

    var name = product.find('.details>h3:eq(0)').text();

    for(var i=0;i<list.length;++i){
        if(name.search(list[i])>-1)
            return true;
    }

    return false;
}

function fuk_load_pg(i){
    var item = $('.profile-item:eq('+i+')');
    
    if(item.length<1){
        fuk_button_pg.text('Done');
        return;
    }

    var id = item.data('id');
    jQuery.get('/orders/'+id, {user_id:ProfileApp.user.id}, function(data){
        eval(data);
        item.find('.product').each(function(){
            var product = jQuery(this);

            if(!match_game(product))
                product.remove();

            //---Remove following lines if you want to keep games without key---
            if(product.find('input.code:enabled').length==0)
                product.remove();
            //------------------------------------------------------------------
        });
        if(item.find('.product').length==0)
            item.slideUp();
    });

    setTimeout('fuk_load_pg('+(i+1)+')', 1000);
}

}

var script = main.toString();
script = script.slice(script.indexOf('{')+1, -1);
var newElem = document.createElement('script');
newElem.type = 'text/javascript';
newElem.innerHTML = script;
document.body.appendChild(newElem);
