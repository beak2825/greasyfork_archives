// ==UserScript==
// @name           改变网页背景为淡灰色
// @namespace      pecial Links Converter
// @description    只改变网页中背景的白色和接近白色的为淡灰色。
// @version        1.0
// @include        http*
// @include        ftp
// @exclude        
// @downloadURL https://update.greasyfork.org/scripts/6491/%E6%94%B9%E5%8F%98%E7%BD%91%E9%A1%B5%E8%83%8C%E6%99%AF%E4%B8%BA%E6%B7%A1%E7%81%B0%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/6491/%E6%94%B9%E5%8F%98%E7%BD%91%E9%A1%B5%E8%83%8C%E6%99%AF%E4%B8%BA%E6%B7%A1%E7%81%B0%E8%89%B2.meta.js
// ==/UserScript==

(function() {

    var Gr1 = 240; //RGB中的R值...当网页的背景颜色的rgb值分别大于Gr1,Gg1,Gb1时此脚本将把颜色改成目标颜色color
    var Gg1 = 240; //RGB中的G值
    var Gb1 = 240; //RGB中的B值
    var color = "#F2F2F2" //改变后的背景颜色
    //**********以下代码用户无需修改***********//
    var Gr, Gg, Gb; //全局变量记录当前标签的rgb值,用于比较
    //以下函数用于分解获取的"rgb(255, 255, 255)"格式的rgb

    function FGrgb(Grgb) {
        Grgb = Grgb.replace(/[rgba\(\)]/g, '');
        var kaisi = Grgb.split(",");
        if (kaisi < 3) return;
        Gr = parseInt(kaisi[0]);
        Gg = parseInt(kaisi[1]);
        Gb = parseInt(kaisi[2]);
        //alert(Gr+"|"+Gb+"|"+Gg);
    }


    var Lcolor = ""; //用于记录网页中获取的背景颜色
    //获取并修改body的背景颜色.


    try {
        Lcolor = document.defaultView.getComputedStyle(document.body, "").getPropertyValue("background-Color");
    } catch (e) {
        return;
    }

    FGrgb(Lcolor);

    if ((Gr > Gr1 && Gg > Gg1 && Gb > Gb1) || Lcolor == "transparent" || Gr == 0 && Gg == 0 && Gb == 0) //transparent表示透明
    {
        document.body.style.backgroundColor = color;
    }

    changeAllElementsColor();

    fixAutoPage();


    function changeAllElementsColor() {
        //获取并修改所有标签的背景颜色
        var alltags = document.getElementsByTagName("*");
        var len = alltags.length;
        for (var i = 0; i < len; i++) {

            if (alltags[i].style.backgroundColor == color) {
                continue;
            }

            Lcolor = document.defaultView.getComputedStyle(alltags[i], "").getPropertyValue("background-Color");
            FGrgb(Lcolor);
            if (Gr > Gr1 && Gg > Gg1 && Gb > Gb1) {
                alltags[i].style.backgroundColor = color;
            }
        }
    }

    function fixAutoPage() {
        var _bodyHeight = document.body.clientHeight;
        // 创建观察者对象
        var observer = new window.MutationObserver(function(mutations) {
            if (mutations[0].addedNodes) {
                if (document.body.clientHeight > _bodyHeight) {

                    // console.log("--------addedNodes---------");

                    setTimeout(function() {
                        changeAllElementsColor();
                    }, 200);

                    _bodyHeight = document.body.clientHeight;
                }
            }
        });
        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }

})();