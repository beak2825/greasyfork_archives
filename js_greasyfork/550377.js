// ==UserScript==
// @name         客優雲-貨品管理
// @namespace    http://tampermonkey.net/
// @version      2025-12-11
// @description  客優雲-貨品管理 功能
// @author       You
// @match        https://world.keyouyun.com/depot/goods
// @match        https://erp.keyouyun.com/depot/goods
// @icon         https://www.google.com/s2/favicons?sz=64&domain=keyouyun.com
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/550377/%E5%AE%A2%E5%84%AA%E9%9B%B2-%E8%B2%A8%E5%93%81%E7%AE%A1%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/550377/%E5%AE%A2%E5%84%AA%E9%9B%B2-%E8%B2%A8%E5%93%81%E7%AE%A1%E7%90%86.meta.js
// ==/UserScript==

(function() {
 'use strict';
    setTimeout(()=>{
        var button = $('button:contains("批量採購")').last();
        button.after(`
        <button type="button" class="v-btn" style="" id="updateCost"><div class="v-btn__content">批次更新貨品成本 </div></button>
        <button type="button" class="v-btn" style="" id="updatePolyWellSku"><div class="v-btn__content">批次更新寶利威爾編碼 </div></button>
    `);
        function checkProdName(prodName){


            var message = prodName;
            console.log($('.v-input'));
            var block=$('.v-input').first();
            var target = block.find('input').first();
            //target.val(message);
            //console.log(target);
            target.click();
            inputChangeValue(target.get(0), message);
            target.click();
            block.find('.v-icon.v-icon--link.material-icons.theme--light').click();

        }
        $('#updateCost').click(function(){

            var prodName =  prompt('請輸入批次更新成本貨品名稱');
            if (!prodName){
                alert("沒輸入名稱");
                return;
            }else{
                var cost =  prompt('請輸入成本');
                if (!cost){
                    alert("沒輸入成本");
                    return;
                }
                var prods;
                $.ajax({
                    url:`https://world.keyouyun.com/vn/api/sc-item?itemSkuCode=&title=${prodName}&keyword=&beginDate=&endDate=&ubenginDate=&uendDate=&page=1&size=100&providerId=&source=&type=0`,
                    type:"GET",
                    contentType:"application/json; charset=utf-8",
                    //dataType:"json",
                    success: function(data){
                        prods = data;
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    async: false
                });

                console.log(prods);

                for(var prod of prods){


                    if(prod.costPrice==cost && prod.currency=="TWD"){
                        continue;
                    }
                    var param = {
                        "title":prod.title,
                        "skuCode":prod.skuCode,
                        "productSkuCode":prod.productSkuCode,
                        "costPrice":cost,
                        "skuName": prod.skuName,
                        "weight":prod.weight,
                        "loginId":prod.loginId,
                        "currency":"TWD",
                        "images":prod.images,
                        "skuImage":prod.skuImage,
                        "scItemId":prod.scItemId,
                        "originalPlatform":prod.originalPlatform,
                        "sourceUrl":prod.sourceUrl??"",
                        "skuValue":prod.skuValue??"",
                        "providerId":prod.providerId??""
                    }
                    console.log(param);

                    $.ajax({
                        url:'https://world.keyouyun.com/vn/api/sc-item',
                        type:"PUT",
                        data:JSON.stringify(param),
                        contentType:"application/json; charset=utf-8",
                        dataType:"json",
                        success: function(data){
                            console.log(data);
                            if(data){
                                //alert(`更新成功`);
                            }else{
                                //alert(`更新失敗`);
                            }
                        },
                        xhrFields: {
                            withCredentials: true
                        },
                        async: false
                    });
                }
                checkProdName(prodName);
                alert("更新完成");
            }
        });

        $('#updatePolyWellSku').click(function(){

            var prodName =  prompt('請輸入寶利威爾貨品名稱');
            if (!prodName){
                alert("沒輸入名稱");
                return;
            }else{
                var prods;
                $.ajax({
                    url:`https://world.keyouyun.com/vn/api/sc-item?itemSkuCode=&title=${prodName}&keyword=&beginDate=&endDate=&ubenginDate=&uendDate=&page=1&size=100&providerId=&source=&type=0`,
                    type:"GET",
                    contentType:"application/json; charset=utf-8",
                    //dataType:"json",
                    success: function(data){
                        prods = data;
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    async: false
                });


                for(var prod of prods){


                    if(!prod.skuName.startsWith("P1")){
                        continue;
                    }
                    var insertSkuCode = `${prod.skuName.replace(/,/gi,"-")}-${prod.skuTitle.slice(-13)}`;
                    if(prod.productSkuCode.includes(insertSkuCode)){
                        continue;
                    }else{
                        prod.productSkuCode.push(insertSkuCode);
                    }
                    var param = {
                        "title":prod.title,
                        "skuCode":prod.skuCode,
                        "productSkuCode":prod.productSkuCode,
                        "costPrice":prod.costPrice,
                        "skuName": prod.skuName,
                        "weight":prod.weight,
                        "loginId":prod.loginId,
                        "currency":"TWD",
                        "images":prod.images,
                        "skuImage":prod.skuImage,
                        "scItemId":prod.scItemId,
                        "originalPlatform":prod.originalPlatform,
                        "sourceUrl":prod.sourceUrl??"",
                        "skuValue":prod.skuValue??"",
                        "providerId":prod.providerId??""
                    }
                    console.log(param);

                    $.ajax({
                        url:'https://world.keyouyun.com/vn/api/sc-item',
                        type:"PUT",
                        data:JSON.stringify(param),
                        contentType:"application/json; charset=utf-8",
                        dataType:"json",
                        success: function(data){
                            console.log(data);
                            if(data){
                                //alert(`更新成功`);
                            }else{
                                //alert(`更新失敗`);
                            }
                        },
                        xhrFields: {
                            withCredentials: true
                        },
                        async: false
                    });
                }
                checkProdName(prodName);
                alert("更新完成");
            }
        });

    },3000);

    function inputChangeValue(input, newValue){
        let lastValue = input.value;
        input.value = newValue;
        let event = new Event('input', { bubbles: true });
        // hack React15
        event.simulated = true;
        // hack React16 内部定义了descriptor拦截value，此处重置状态
        let tracker = input._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }
        input.dispatchEvent(event);
    }
})();