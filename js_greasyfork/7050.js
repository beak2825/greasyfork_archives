// ==UserScript==
// @name       baidu waimai get infomation
// @namespace  http://iamued.com
// @version    0.4
// @description  获取饿了么菜单页指定格式
// @include    http://waimai.baidu.com/waimai/shop/*
// @copyright  2014
// @downloadURL https://update.greasyfork.org/scripts/7050/baidu%20waimai%20get%20infomation.user.js
// @updateURL https://update.greasyfork.org/scripts/7050/baidu%20waimai%20get%20infomation.meta.js
// ==/UserScript==

$(function() {
    $(".main-l").append('<div class="getinfomation"><button>获取菜单信息 HOHO</button></div><div><textarea class="infoarea" rows="20" style="width:90%"></textarea></div>');
    $(".main-l").append('<div>有问题反馈给我 liugang02@meituan.com</div>');
    $(".main-l .getinfomation").click(function() {
        $(".infoarea").val('');
        var infotext='';
        $.each($(".list-wrap .title"),function(){
            //console.log($(this).text());
            if($(this).text()!='美食分类'){
                var ftypename=$.trim($(this).text());
                infotext+="#"+ftypename+"\n";
                $.each($(this).parents(".list-wrap").find("ul").children("li"),function(){
                    //console.log($(this));
                    var fname=$(this).find('.info h3').attr('data-title');
                    var fprice=$(this).find('.info .m-price').text();
                    if($.trim(fprice)==''){
                    	fprice=$(this).find('.info .m-break strong').text();
                    }
                    //console.log(fname+ $.trim(fprice).replace('餐厅休息',''));
                    infotext+=$.trim(fname).replace(/\s+/g,"")+" "+$.trim(fprice).replace('¥','').replace('已售完','')+"\n";
                })

            }
        })
        $(".infoarea").val(infotext);
    })


});