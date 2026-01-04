// ==UserScript==
// @name        ShopeeLAB: Shocking Sales
// @namespace   flashsale.apphub.ga
// @author      Rizuwan
// @description Semak diskaun dan harga lepas diskaun item flash-sale
// @match       https://shopee.com.my/shocking_sale*
// @match       https://shopee.com.my/mall-flash-sale*
// @match       https://shopee.com.my/product/*
// @match       https://shopee.com.my/*-i.*
// @version     1.3.0
// @require     http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// @run-at      document-start
// @grant       unsafeWindow
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/549851/ShopeeLAB%3A%20Shocking%20Sales.user.js
// @updateURL https://update.greasyfork.org/scripts/549851/ShopeeLAB%3A%20Shocking%20Sales.meta.js
// ==/UserScript==

GM_addStyle('.xprice { margin-left: 30px; color: #066bc8; position:absolute; right: 100px;}.xdiscount { position: absolute; right: 100px; color:#009032}.xreminder{font-size: smaller;color: #919191;}')

'use strict';
const { fetch: originalFetch } = unsafeWindow;
unsafeWindow.fetch = async (...args) => {
    let [resource, config] = args;
    let response = await originalFetch(resource, config);

    const json = () =>
    response
    .clone()
    .json()
    .then((data) => {
        data = { ...data };


        return data
    })

   response.json = json;

    if(response.url == 'https://shopee.com.my/api/v4/flash_sale/flash_sale_batch_get_items') {

        response.json().then( data => {
            console.log('FLASHHHHHHH',data.data.items)
            setTimeout(() => {

                data.data.items.forEach(item => {
                    if(item.hidden_price_display) {
                        let priceAfterDiscount = (item.price_before_discount / 100000 - (item.price_before_discount / 100000 * item.raw_discount / 100)).toFixed(2)
                        $div = $(`div[data-id='${item.itemid}'] > div:eq(1) > div:eq(2) > div:first`)
                        $div.children('div:first').append(`<div class="EKx6p6 XIDjSW"><div class="rAzUrb n7BB4I"><svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.30769 0H3.80769L0 6.84444L3 8V14L9 4.97778L5.88462 4.04444L8.30769 0Z" fill="url(#paint0_linear_5322_104717)"></path><defs><linearGradient id="paint0_linear_5322_104717" x1="0" y1="0" x2="0" y2="14" gradientUnits="userSpaceOnUse"><stop stop-color="#EE4D2D"></stop><stop offset="1" stop-color="#FF7337"></stop></linearGradient></defs></svg></div>-${item.discount}</div>`)
                        $div.children(':eq(1)').children().append($(`<div  class="xprice">${priceAfterDiscount}</div>`).click(function(e) {
                            e.stopPropagation()
                            item.rawPriceAfterDiscount = item.price_before_discount - (item.price_before_discount * item.raw_discount / 100);
                            item.priceAfterDiscount = priceAfterDiscount;
                            localStorage.tmpFlashsaleItem = JSON.stringify(item);
                            window.open(`https://shopee.com.my/shockingsale-i.${item.shopid}.${item.itemid}`)
                        }))
                        $div.append(`<div class="xreminder">${item.reminder_count} reminder(s) set</div>`)
                    }
                });
            }, 1300);
        })
    }

    if(response.url.includes('/api/v4/pdp/get_rw')) {

        response.json().then( data => {
            objFlash = localStorage.tmpFlashsaleItem ? JSON.parse(localStorage.tmpFlashsaleItem) : null;
            if(data.data.item.models.map(m => m.model_id).some(id => (objFlash?.modelids ?? []).map(Number).includes(id))) {
                setTimeout(() => {
                    alert(objFlash ? `Harga Jualan:  RM${(data.data.item.price / 100000).toFixed(2)} ( RM${(data.data.item.price_min / 100000).toFixed(2)} -  RM${(data.data.item.price_max / 100000).toFixed(2)})\nHarga FlashSale: RM${objFlash.hidden_price_display} ( RM${objFlash.priceAfterDiscount} )\nDiskaun: ${objFlash.discount} | Jimat: ~RM${((data.data.item.price_min - objFlash.rawPriceAfterDiscount) / 100000).toFixed(2)}\n\nVarian : ${objFlash.modelids.map( mid => data.data.item.models.find( m => m.model_id == mid ).name ).join(' | ')}` : 'Item bukan dari flash sale')
                }, 800);
            }

        })
    }

    return response;
};
