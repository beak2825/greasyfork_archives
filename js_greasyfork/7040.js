// ==UserScript==
// @name       subeta item price comparer
// @version    0.1
// @description  Displays how much profit we could make by buying items and selling them on the market at the lowest asking price
// @match      http://*subeta.net/shop.php?shopid=*
// @match      http://subeta.net/myshop.php?shopid=*&act=quickstock&p=1
// @include *subeta.net/shop.php?shopid=*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @copyright  2012+, You
// @grant GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/7211
// @downloadURL https://update.greasyfork.org/scripts/7040/subeta%20item%20price%20comparer.user.js
// @updateURL https://update.greasyfork.org/scripts/7040/subeta%20item%20price%20comparer.meta.js
// ==/UserScript==

if ($('.container-fluid:contains("There are no items stocked")').length > 0)
{
    window.location.href = 'http://subeta.net/shop.php?shopid=34';
}

window.scrollBy(0, 180);
if ((sessionStorage.getItem("tshopid") === "null" || isNaN(sessionStorage["tshopid"])) && location.pathname !== "/myshop.php") {
    var restock_shop = prompt("Enter your shop ID that you wish to re-stock at if your inventory reaches 100 items.", "");
    sessionStorage.setItem("tshopid", restock_shop);
    if (restock_shop !== null && sessionStorage.getItem("tshopid") === undefined) {
        sessionStorage.setItem("tshopid", restock_shop);
    }
};

if ((sessionStorage.getItem("traversal_mode") === "null" || isNaN(sessionStorage["traversal_mode"])) && location.pathname !== "/myshop.php") {
    var traversal_mode = prompt("There are two modes to this script, traversal and browsing. \n\n In traversal, the script will automatically surf random shops and cache the prices of items, while alerting you of items that are worth more than a certain amount of sP. \n\n If you wish to just cache items' prices, set a high sP number.\n\n In browsing, this beaviour is delayed so that it does not affect your restocking operations. \n\nType 0 or leave the field blank for traversal mode and 1 otherwise.","1");
    if (parseInt(traversal_mode) !== 1 || traversal_mode === '') {
        traversal_mode = 0;
    }
    sessionStorage.setItem("traversal_mode", traversal_mode);
    if (traversal_mode !== null && sessionStorage.getItem("traversal_mode") === undefined) {
        sessionStorage.setItem("traversal_mode", traversal_mode);
    }
}

if ((parseInt(sessionStorage.getItem("traversal_mode")) === 0) && isNaN(sessionStorage["traversal_price"]) && location.pathname !== "/myshop.php") {
    var traversal_price = prompt("You have chosen traversal mode. \n\n Please specify the threshhold price to alert you of an item that is worth more than this amount of sP.", "200000");
    if (isNaN(parseInt(traversal_price)) || traversal_price < 0) {
        traversal_price = 200000;
    }
    sessionStorage.setItem("traversal_price", traversal_price);
    if (traversal_price !== null && sessionStorage.getItem("traversal_price") === undefined) {
        sessionStorage.setItem("traversal_price", traversal_price);
    }
}

if ((sessionStorage.getItem("profitable") === "null" || isNaN(sessionStorage["profitable"])) && location.pathname !== "/myshop.php") {
    var profitable = prompt("Enter the minimum profit for all items that you desire.", "25000");
    sessionStorage.setItem("profitable", profitable);
    if (isNaN(parseInt(profitable)) || profitable < 0) {
        sessionStorage.setItem("profitable", 25000);
    }
};


function RetroForward() {
    if (ItemC > 0 || ItemC === curNum) {
        setTimeout(
        window.location.replace("http://subeta.net/shop.php?shopid=" + shopNum, 1100));
    }

    if (document.body.innerHTML.split('Restocked')[1]) {
        setTimeout(
        window.location.replace("http://subeta.net/shop.php?shopid=" + shopNum, 1100))
    }

}

var GlobalCount = 0;
GlobalTime = 0;
if (parseInt(sessionStorage["traversal_mode"]) === 1) {GlobalTime = 600000;}
var asyncLoop = function (o) {
    var i = -1;

    var loop = function () {
        i++;
        if (i == o.length) {
            o.callback();
            return;
        }
        o.functionToLoop(loop, i);
    };
    loop(); //init
};






// function subject() {
//    var price = null;
//    $("#page tbody tr").each(function (i, e) {
//        var $col1 = $(e).find("td:eq(0)"),
//            $col2 = $(e).find("td:eq(1)");
//        if ($col1.html().indexOf("NPC") === -1) {
//            var rowPrice = parseFloat($col2.html().replace(/[^0-9\.]+/g, ""));
//            if (!price || price.price > rowPrice) price = {
//                name: $col1.find("a").html(),
//                price: rowPrice
//            };
 //           return price.price;
//        }
//    });
// }


function updateItem(curNum) {
    var realNum = curNum;
    var itemInfo = itemList[curNum].innerHTML.split("<br>");
    var itemName = itemInfo[1].trim();
    var itemPrice = itemInfo[2].split("<b>")[1].split("</b>")[0].replace(',', '').replace(',', '');
    var lowestPrice;
    var profitCheck;

    var Rand = Math.random();


    if (localStorage.getItem(itemName) !== null) {
        lowestPrice = localStorage[itemName];
        profit = (lowestPrice - itemPrice);
        profitCheck = ((lowestPrice - itemPrice) / 80000);

        if ((parseInt(profit)) > parseInt(sessionStorage["traversal_price"])) {
            GlobalCount = GlobalCount + 1;
            GlobalTime = 30000;
        }

        if (parseInt(profit) > 3000 && parseFloat(Rand) < parseFloat(profitCheck)) {
            localStorage.removeItem(itemName);
        }


        percentage = ((lowestPrice - itemPrice) / 1000);
        profitText = (profit > parseInt(sessionStorage["profitable"])) ? '<span style="color:green; background-color: #FFFF00">' + percentage.toFixed(1) + 'k' + '</span>' : '<span style="color:red;">' + percentage.toFixed(1) + 'k' + '</span>';
        itemList[realNum].innerHTML = itemList[realNum].innerHTML.replace(/<b>[^A-z](.+)sP[^A-z]/, 'Profit: <b>' + profitText + "</b>");
    } else {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://subeta.net/ushop.php?act=dosearch&itemname=' + itemName + '&type=shops',
            onload: function (responseDetails) {
                // lowestPrice = responseDetails.subject();
                lowestPrice = responseDetails.responseText.match(/(.+) sP/)[1].split("<td>")[1].trim().replace(',','').replace(',','');
                localStorage[itemName] = lowestPrice;
                profit = (lowestPrice - itemPrice);
                percentage = ((lowestPrice - itemPrice) / 1000);
                profitText = (profit > parseInt(sessionStorage["profitable"])) ? '<span style="color:green; background-color: #FFFF00">' + percentage.toFixed(1) + 'k' + '</span>' : '<span style="color:red;">' + percentage.toFixed(1) + 'k' + '</span>';
                itemList[realNum].innerHTML = itemList[realNum].innerHTML.replace(/<b>[^a-z](.+)sP[^a-z]/, 'Profit: <b>' + profitText + "</b>");

                if (profit > parseInt(sessionStorage["traversal_price"])) {
                    GlobalCount = GlobalCount + 1;
                    GlobalTime = 30000;
                }
            }
        });
    }

    var ItemC = parseInt((document.querySelectorAll('input[type="image"]').length - 0));
    if (ItemC > 20) {
        mob = 15;
    }
    if (ItemC < 21 && ItemC > 10) {
        mob = 50;
    }
    if (ItemC < 11) {
        mob = 210;
    }

    setTimeout(function () {
        curNum += 1;
        if (curNum < ItemC) {
            updateItem(curNum);
        } else {
            //complete update
            sortItem();
        }
    }, mob);



}

var g_itemlist = [];
var g_itemcount = 0;

function sortItem() {
    g_itemlist = [];
    jQuery("div.shop_item").each(function (i, v) {
        var temp = [];

        temp[0] = this;
        //get profit value
        var profit = jQuery(this).find("span").text();

        if (profit.length > 0) {
            profit = profit.replace("k", "");
            profit = parseFloat(profit, 10);

        } else profit = 0;
        temp[1] = profit;

        g_itemlist[g_itemlist.length] = temp;
        if (temp[1] < 20) {
            jQuery(temp[0]).remove();
        }
        console.log("index :" + i + " v:" + profit);
    });



    //Sort it
    for (var k = 0; k < g_itemlist.length - 1; k++)
    for (var i = k + 1; i < g_itemlist.length; i++) {
        var t1 = g_itemlist[k];
        var t2 = g_itemlist[i];

        if (t1[1] < t2[1]) {
            var t = g_itemlist[k];
            g_itemlist[k] = g_itemlist[i];
            g_itemlist[i] = t;
        }
    }
    //Apply to div
    
jQuery(".shop_item_countainer").empty();
    
       // hide all item

      // for (var i=0;i<g_itemlist.length;i++)
      //      { 
         //       var temp = g_itemlist[i];
           //     if (temp[1] < ((parseInt(sessionStorage["profitable"]))/1000))
            //        jQuery(temp[0]).hide();
           // };
    
    

    for (var i = 0; i < g_itemlist.length; i++) {

        var temp = g_itemlist[i];
        jQuery(".shop_item_countainer").append(temp[0]);
        console.log("Item :" + temp[0] + " v:" + temp[1]);
    }


    window.scrollTo(0, 400);

    //Add button
    console.log(GlobalTime);
    console.log(GlobalCount);
    console.log(GlobalCount > 0 && parseInt(sessionStorage["traversal_mode"]) === 0);
    console.log(GlobalCount === 0 && parseInt(sessionStorage["traversal_mode"]) === 0);
    if (GlobalCount > 0 && parseInt(sessionStorage["traversal_mode"]) === 0) {
       setTimeout(RetroForward, 30000 + parseInt(GlobalTime));
       var trued = alert("There's an item worth more than " + parseInt(sessionStorage["traversal_price"]) +" sP!");
    };
    if (GlobalCount === 0 && parseInt(sessionStorage["traversal_mode"]) === 0)
    {
    setTimeout(RetroForward, 6000 + parseInt(GlobalTime));
    };
   

    $.get("http://subeta.net/inventory.php", function (invdata) {
        if (invdata.indexOf('We will only display') > -1) {
            var invhtml = invdata.substring(invdata.indexOf('<h1 class=\'text_center\'>Inventory</h1>') + 38);
            invhtml = invhtml.substring(invhtml.indexOf('You have <b>'), invhtml.indexOf(' items on hand'));
            var invhtml2 = parseInt(invhtml.replace(/<\/b>/, '').replace(/<b>/, '').replace(/You have /, ""));
            console.log(invhtml2);
            if (invhtml2 > 99 && sessionStorage.getItem("tshopid") !== "null") {
                window.open("http://subeta.net/myshop.php?shopid=" + parseInt(sessionStorage.getItem("tshopid")) + "&act=quickstock&p=1", '', 'width=1200');

                // window.location.replace("http://subeta.net/myshop.php?shopid=" + parseInt(sessionStorage.getItem("tshopid")) + "&act=quickstock&p=1");
            }
        }
    });


}

jQuery('#quickstock-container').find('button[class="quickstock-setall"][value="shop"]').click();
if (location.href === "http://subeta.net/myshop.php?shopid=" + parseInt(sessionStorage.getItem("tshopid")) + "&act=quickstock&p=1") {
    var r = confirm("Send all to shop?");
    if (r === true) {
        jQuery('#quickstock-container').find('input[type="submit"][value="Stock"]').click();
        window.close();
    } else {
        window.close();
    }
}

if (document.body.innerHTML.split('Restocked')[1]) {
    var itemList = document.body.getElementsByClassName('shop_item');
    var itemCount = itemList.length;
    var curNum = 0;

    updateItem(curNum);
}

var myArray = [32, 41, 36, 17, 35, 20, 6, 26, 9, 5, 19, 47, 11, 31, 2, 22, 14, 46, 23, 25, 10, 15, 48, 21, 12, 29, 49, 40, 27, 34, 28, 37, 24, 45, 44, 39, 42, 4, 16, 30];
Array.prototype.randomDiffElement = function (last) {
    if (this.length == 0) {
        return;
    } else if (this.length == 1) {
        return this[0];
    } else {
        var num = 0;
        do {
            num = Math.floor(Math.random() * this.length);
        } while (this[num] == last);
        return this[num];
    }
};

var shopNum = myArray.randomDiffElement(myArray);
var ItemC = parseInt((document.querySelectorAll('input[type="image"]').length - 0));





setTimeout(function() {
	window.location.reload(1);
}, 250000);
// reloads page after 320 seconds of inactivity