// ==UserScript==
// @name         直播折扣券
// @namespace    http://tampermonkey.net/
// @version      2025-10-31
// @description  coupou function
// @author       You
// @match        https://live.shopee.tw/pc/live?session=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shopee.tw
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/552009/%E7%9B%B4%E6%92%AD%E6%8A%98%E6%89%A3%E5%88%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/552009/%E7%9B%B4%E6%92%AD%E6%8A%98%E6%89%A3%E5%88%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("COUCOU");
    setTimeout(()=>{
        getVoucherList();
        setInterval(()=>{

            //console.log($('button:contains("顯示")').first());
            console.log("COUCOU");
            //var table = $('table.shopee-react-table__body').first();
            //table.find('button:contains("顯示")').eq(5).click();
            var list = getVoucherList();



        },31000);
    },10000);


    function voucher(list,voucher_code="ETGG39UMX"){
        console.log("voucher");




        const urlParams = new URLSearchParams(window.location.search);
        const session = urlParams.get('session');
        if(urlParams.get('voucher_code')){
            voucher_code =urlParams.get('voucher_code')

        }
        var promotion = list.filter(x=>x.voucher_code==voucher_code)[0];
        var str = JSON.stringify(promotion);
        var param = {"session_id":session,
                     "identifier":{"promotion_id":promotion.promotion_id,"voucher_code":promotion.voucher_code,"signature":promotion.signature},
                     "voucher":str,
                     "end_auto_repeat":false};
        /*
        var param={"session_id":session,
                   "identifier":{"promotion_id":1248349965680640,"voucher_code":"LIVE-1248349965680640","signature":"4130abde8d7f0bb9de70b8969381f3be"},
                   "voucher":"{\"promotion_id\":1248349965680640,\"voucher_code\":\"LIVE-1248349965680640\",\"reward_type\":1,\"discount_value\":\"0\",\"discount_percentage\":0,\"min_spend\":\"1200\",\"end_time\":1759852799,\"discount_cap\":\"0\",\"coin_percentage_real\":6,\"coin_cap\":\"100\",\"shop_id\":0,\"signature\":\"4130abde8d7f0bb9de70b8969381f3be\",\"use_type\":0,\"status\":0,\"resident_pos\":6,\"exclusive\":false,\"stream_exclusive\":false,\"ls_exclusive\":true,\"is_claimed\":false,\"voucher_ui\":{\"non_customise_tag\":[5]},\"user_segment\":\"\",\"has_use_rule\":false,\"start_time\":1759248000,\"multi_reward_info\":{\"multi_reward_display_type\":0,\"max_discount_value\":\"0\",\"min_discount_value\":\"0\",\"max_discount_percentage\":0,\"min_discount_percentage\":0,\"discount_cap\":\"0\",\"max_coin_percentage_real\":0,\"min_coin_percentage_real\":0,\"coin_cap\":\"0\"},\"recommendation_info\":\"\",\"has_streamer_rule\":false,\"live_xtra\":false,\"shop_name\":\"\",\"shop_image\":\"\",\"has_product_limit\":true,\"remaining_claim_count\":199901376}",
                   "end_auto_repeat":false};
                   */

        //console.log(testParam);
        //console.log(param);
        $.ajax({
            url:`https://live.shopee.tw/webapi/v1/session/${session}/voucher/show`,
            type:"POST",
            data:JSON.stringify(param),
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(data){
                console.log(data);

            },
            xhrFields: {
                withCredentials: true
            },
            async: false
        });

    }


    function getVoucherList(){

        const urlParams = new URLSearchParams(window.location.search);
        const session = urlParams.get('session');
        var list;
        $.ajax({
            url:`https://live.shopee.tw/webapi/v1/session/${session}/voucher?scene=0`,
            type:"GET",
            //data:JSON.stringify(param),
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(data){
                list = data.data.shopee_vouchers;
                //console.log(list);
                voucher(list);
            },
            xhrFields: {
                withCredentials: true
            },
            async: true
        });

    }
    function getCookie(cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for(var i = 0; i <ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }
    // Your code here...
})();