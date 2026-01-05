// ==UserScript==
// @name     AutoPrice (No-GA, Autonomous, revised)
// @description Stuff
// @version 1.00
// @include        *subeta.net/myshop.php?shopid=*
// @include        *subeta.net/myshop.php?&shopid=*&page=*
// @include        *subeta.net/myshop.php?&shopid=*
// @exclude        *subeta.net/myshop.php?shopid=*&act=quickstock
// @exclude        *subeta.net/myshop.php?shopid=*&act=editshop
// @exclude        *subeta.net/myshop.php?shopid=*&act=cats
// @exclude        *subeta.net/myshop.php?shopid=*&act=quickstock
// @exclude        *subeta.net/myshop.php?shopid=*&act=profits
// @exclude		   *subeta.net/myshop.php?shopid=*&act=quickstock&p=1
// @exclude		   *subeta.net/myshop.php?shopid=*&act=shoplog
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant    GM_addStyle
// @namespace https://greasyfork.org/users/7211
// @downloadURL https://update.greasyfork.org/scripts/7038/AutoPrice%20%28No-GA%2C%20Autonomous%2C%20revised%29.user.js
// @updateURL https://update.greasyfork.org/scripts/7038/AutoPrice%20%28No-GA%2C%20Autonomous%2C%20revised%29.meta.js
// ==/UserScript==
/*- The @grant directive is needed to work around a design change
    introduced in GM 1.0.   It restores the sandbox.
*/
window.scrollBy(0, 160);
// count number of items in shop //
var ItemsChecked = 0;
var wordCount = (document.querySelectorAll('input[type="hidden"]').length - 5);
var itemCount = (document.querySelectorAll('input[type="hidden"]').length - 5);
if (itemCount < 0)
{
    window.location.reload(1);
}
// count number of items in shop //

// gets current page number and shop number //
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (1);
}
triple();

var page = parseInt(getQueryVariable("page"));
var shopid = parseInt(getQueryVariable("shopid"));
// gets current page number and shop number //

// sets the initial cycle time used for time differential calculation //
if (sessionStorage["CycleTime"] === null || undefined || (isNaN(sessionStorage["CycleTime"]) && page !== 1)) {
    sessionStorage["CycleTime"] = new Date();
}
// sets the initial cycle time used for time differential calculation //

// retrieve shop Delay time and shop Cycle count
if (isNaN(sessionStorage[shopid])) {
    sessionStorage["Key"] = 0;

    var shopDelay = prompt("Enter the delay time you want in minutes in repricing your entire shop. Must be greater or equal to 1.", "");
    var shopCycles = prompt("Enter the amount of times you want to want to re-price your shop in total", "");
    var minPrice = prompt("Choose a price point, where if any of your items fall below this point, it is considered underpriced and will be priced at 0.")
    var minRatio = prompt("Enter the lowest percentage without the percent sign (from 1 to 99) of your initially priced items that you are willing to accept, if you are severely undercut. \n\n For example, if the initial marketplace's lowest price is 10000 and you enter 30, the lowest price that you will go is 10000x30% or 3000.","60");
    var minRatio = minRatio/100;
    if (parseFloat(shopDelay) < 1 || isNaN(parseInt(shopDelay))) {
        var shopDelay = 5;
        // if input is not a number or is less than 1, set delay time to 5 minutes by default //
    }

    if (parseFloat(shopCycles) < 1 || isNaN(parseInt(shopCycles))) {
        var shopCycles = 6;
        // if input is not a number or is less than 1, set shop price-checking cycle count to 6 by default //
    }
    
    if (parseFloat(minPrice) < 1 || isNaN(parseInt(minPrice))) {
        var minPrice = 1000;
    }
    
    if (parseFloat(minRatio) < 0.01 || parseFloat(minRatio) > 1.00 || isNaN(parseInt(minRatio))) {
        var minRatio = 0.3;
    }

    if (isNaN(sessionStorage[shopid]))
    // if input exists for delay, and shopid not set //
    {
        sessionStorage[shopid] = shopid;
    }

    if (shopCycles !== null || shopCycles > 0)
    // if input exists for cycles, and shopid is set //
    {
        sessionStorage["Key"] = 1;
        // key is true //
        sessionStorage["shopDelay"] = shopDelay;
        // delay exists //
        sessionStorage["shopCycles"] = shopCycles;
        // cycle exists //
        sessionStorage["CountLoop"] = 0;
        // loop count initialized //
        ItemsChecked = 0;
        // items checked initialized //
        sessionStorage["CyclesLoop"] = 0;
        // cycles loop initialized //
         sessionStorage["Looped"] = 0;
        // loop stuck initialized //
        sessionStorage["MinPrice"] = minPrice
        // min price initialized //
        sessionStorage["minRatio"] = minRatio
        // min ratio initialized // 
        sessionStorage["CycleTime"] = new Date();
        // date initialized //
        
        for (i = 1; i < 10; i++) {
            sessionStorage[i] = 0
            // flags initialized //
        }
    }
}
// retrieve shop Delay time and shop Cycle co unt //

var C1b = sessionStorage["CyclesLoop"];
var C2b = sessionStorage["shopCycles"];
jQuery("body").append('<div id="a1b" style="position: fixed; right:10px; width: 210px; bottom:40px;z-index:100000; background-color: rgba(0,0,0,0.5); color: #FFFFFF;">'+ '</div>');
jQuery("body").append('<div id="a2b" style="position: fixed; right:10px; width: 210px; bottom:28px;z-index:100000; background-color: rgba(0,0,0,0.5); color: #FFFFFF;">'+ '</div>');

// calculates time differential and reloads function as necessary //
setInterval(function newDate() {
    var diffTime;
    var delayTime = sessionStorage["shopDelay"];
    var newTime = new Date;

    if (parseInt(sessionStorage["Key"]) === 1 || diffTime === undefined)
    // where key is set to 1 or diffTime was undefined //
    {
        diffTime = ((newTime.getTime() - Date.parse(sessionStorage["CycleTime"])) / 60000);
        // calculate the difference in time //
        jQuery("#a1b").text('Full-Shop Price Checks : '+C1b+' / '+C2b+'');   
        
          if ( $('#a2b').length > -1)
        {
            jQuery("#a2b").text('Time : '+ Math.max(((parseInt(sessionStorage["shopDelay"])*60) - Math.round(diffTime*60)),0)+' seconds');   
        }
    }

    if ((diffTime > delayTime) && ItemsChecked < 1 && (parseInt(sessionStorage["Key"])) === 0) {
        console.log("Execute function");
        sessionStorage["Key"] = 1;
        window.location.reload(1);
        // where time has elapsed, where items are unchecked and key is unset //
    }
    console.log("page flag :" + parseInt(sessionStorage[page]));
    console.log("Flagsum :" + parseInt(sessionStorage["FlagSum"]));
    console.log("Time Difference : " + diffTime + " out of " + delayTime + " minutes");
    console.log("Items Checked : " + ItemsChecked + " out of " + itemCount);
    console.log("Key : " + parseInt(sessionStorage["Key"]));
}, 1000);
// calculates time differential and reloads function as necessary //

var countReport = '';
countReport = ItemsChecked + ' out of ' + wordCount + ' items were price-checked.'
$("#gmWordCount").text(countReport);
$("body").append('<div id="gmWordCount"></div>');
//--- Position and style the display output for UI,
GM_addStyle("                                 \
    #gmWordCount {                              \
        background:         orange;             \
        position:           fixed;              \
        top:                0;                  \
        left:               0;                  \
        width:              100%;               \
        z-index:            6666;               \
    }                                           \
");

sessionStorage["FlagSum"] = parseInt(sessionStorage.getItem(1)) + parseInt(sessionStorage.getItem(2)) + parseInt(sessionStorage.getItem(3)) + parseInt(sessionStorage.getItem(4)) + parseInt(sessionStorage.getItem(5)) + parseInt(sessionStorage.getItem(6)) + parseInt(sessionStorage.getItem(7)) + parseInt(sessionStorage.getItem(8)) + parseInt(sessionStorage.getItem(9));
// count sum of flags

// advance page when sum of flags is not 9 and flag is set to 1 for current page //
setTimeout(function PageAdvance() {
    if (parseInt(sessionStorage[page]) === 1 && parseInt(sessionStorage["FlagSum"]) < 9) {
        sessionStorage["Looped"] = parseInt(sessionStorage["Looped"]) + 1;
        jQuery('#content').find('i').click();
    }
}, 1290);
// advance page when sum of flags is not 9 and flag is set to 1 for current page //

// where page is 1 and flag sum is 9, reset flags to 0 //
if (parseInt(page) === 1 && parseInt(sessionStorage["FlagSum"]) === 9) {
    for (i = 1; i < 10; i++) {
        sessionStorage[i] = 0;
    }
}
// where page is 1 and flag sum is 9, reset flags to 0 //

// count the number of maximum pages for special case where item count is equal to 100 //
if (sessionStorage["PageTrack"] === null || isNaN(sessionStorage["PageTrack"])) {
    sessionStorage["PageTrack"] = 1;
}

if (parseInt(sessionStorage["PageTrack"]) > (parseInt(sessionStorage["PageTrack"]) - 1)) {
    sessionStorage["PageTrack"] = page;
    sessionStorage["Looped"] = 0 - parseInt(sessionStorage["PageTrack"]);
}
// count the number of maximum pages for special case where item count is equal to 100 //

// asynchronous Looping //
var asyncLoop = function (o) {
    var i = -1,
        length = o.length;
    var loop = function () {
        i++;
        if (i == length && parseInt(sessionStorage["Key"]) === 1) {
            o.callback();
            return;
        }
        o.functionToLoop(loop, i);
    };
    loop();
};
// asynchronous Looping // 

// core code //
function createInstance() {
    if (window.XMLHttpRequest && parseInt(sessionStorage["Key"]) === 1) {
        req = new XMLHttpRequest();
    } else console.log("XHR not created");
    return (req);
}

var arrForms = document.getElementsByTagName('form');
var thisForm;
for (var i = 0; i < arrForms.length; i++) {
	if (arrForms[i].action.indexOf('myshop.php') > -1 && arrForms[i].method == 'post') {
		thisForm = arrForms[i];
	}
}

if (thisForm.getElementsByTagName('tr').length > 4 && parseInt(sessionStorage["Key"]) === 1) {
    var arrItemsTR = new Array();
    for (var i = 1; i < thisForm.getElementsByTagName('tr').length - 3; i++) {
        arrItemsTR.push(thisForm.getElementsByTagName('tr')[i]);
    }
    var arrItemName = new Array();
    var arrItemPriceInput = new Array();
    var arrItemQuantity = new Array();
    var arrRemoveSelect = new Array();
    var arrHTMLRemove = new Array();
    for (var i = 0; i < arrItemsTR.length; i++) {
        var arrTD = arrItemsTR[i].getElementsByTagName('td');
        for (var j = 0; j < arrTD.length; j++) {
            if (arrTD[j].width == '30%' && parseInt(sessionStorage["Key"]) === 1) {
                arrItemName.push(arrTD[j].getElementsByTagName('center')[0].innerHTML);
            }
            if (arrTD[j].getAttribute('width') == '10%') {
                if (arrTD[j].innerHTML.indexOf('Remove All') > -1) {
                    if (arrTD[j].getElementsByTagName('select').length > 0) {
                        arrItemQuantity.push(arrTD[j].getElementsByTagName('center')[0].innerHTML);
                        arrRemoveSelect.push("true");
                        arrHTMLRemove.push(arrTD[j].getElementsByTagName('select')[0]);
                    } else if (arrTD[j].getElementsByTagName('input').length > 0) {
                        arrItemQuantity.push(arrTD[j].getElementsByTagName('center')[0].innerHTML);
                        arrRemoveSelect.push("false");
                        arrHTMLRemove.push(arrTD[j].getElementsByTagName('input')[0]);
                    }
                }
            }
        }
        var arrInput = arrItemsTR[i].getElementsByTagName('input');
        for (var j = 0; j < arrInput.length; j++) {
            if (arrInput[j].name.indexOf('price[') > -1 && arrInput[j].type == 'text') arrItemPriceInput.push(arrInput[j]);
        }
    }
}
// core code //

// request code //
asyncLoop({
    length: arrItemName.length,
    functionToLoop: function (loop, i) {
        setTimeout(function () {
            try {
                var ushopName, ushopURL, ushopPrice, itemid,
                cv, vercode, itemName, itemQuantity,
                RemoveSelect, HTMLRemove;
                HTMLRemove = arrHTMLRemove[i];
                RemoveSelect = arrRemoveSelect[i];
                itemQuantity = arrItemQuantity[i];
                itemQuantity = itemQuantity.trim();
                itemName = arrItemName[i];
                itemName = itemName.trim();
                var req = createInstance();
                req.onreadystatechange = function () {
                    if (req.readyState == 4 && parseInt(sessionStorage["Key"]) === 1) {
                        if (req.status == 200 && parseInt(sessionStorage["Key"]) === 1) {
                            var htmlsrc = req.responseText.substring(req.responseText.indexOf('<b>Shop Name</b>'));
                            ushopURL = htmlsrc.substring(htmlsrc.indexOf('<a href=ushop.php?shopid=') + 8);
                            ushopURL = ushopURL.substring(0, ushopURL.indexOf('>'));
                            ushopName = htmlsrc.substring(htmlsrc.indexOf('<a href=ushop.php?shopid=') + 9 + ushopURL.length);
                            ushopName = ushopName.substring(0, ushopName.indexOf('</a></td>'));
                            ushopPrice = htmlsrc.substring(htmlsrc.indexOf('<a href=ushop.php?shopid=') + 25);
                            ushopPrice = ushopPrice.substring(ushopPrice.indexOf('<td>') + 5);
                            ushopPrice = ushopPrice.substring(0, ushopPrice.indexOf('</td>'));
                            console.log(ushopPrice);
                            var ushopPriceNum = '';
                            for (var j = 0; j < ushopPrice.length; j++) {
                                if (ushopPrice.charAt(j) == '0' || ushopPrice.charAt(j) == '1' || ushopPrice.charAt(j) == '2' || ushopPrice.charAt(j) == '3' || ushopPrice.charAt(j) == '4' || ushopPrice.charAt(j) == '5' || ushopPrice.charAt(j) == '6' || ushopPrice.charAt(j) == '7' || ushopPrice.charAt(j) == '8' || ushopPrice.charAt(j) == '9') {
                                    ushopPriceNum = ushopPriceNum.concat(ushopPrice.charAt(j));
                                }
                            }
                             if (parseInt(sessionStorage["CyclesLoop"]) < 1) {sessionStorage[itemName] = ushopPriceNum;};
                            // initialize price caching for original price comparison for first iteration //
                             if (parseInt(sessionStorage["CyclesLoop"]) > 1 && parseInt(arrItemPriceInput[i].value) === 0 && parseInt(ushopPriceNum) > parseInt(sessionStorage["MinPrice"]) && isNaN(sessionStorage[itemName])) {sessionStorage[itemName] = ushopPriceNum;}
                            // where subsequent items are added, above minimum price, caching is done for original price comparison //
                            if (parseInt(ushopPriceNum) === parseInt(arrItemPriceInput[i].value) && parseInt(ushopPriceNum) > 0 && parseInt(ushopPriceNum) <= 200000 && ((parseInt(sessionStorage[itemName])) * (parseFloat(sessionStorage["minRatio"])) < (parseInt(ushopPriceNum))) ) {
                                if (parseInt(ushopPriceNum) > parseInt(sessionStorage["MinPrice"])) {
                                    arrItemPriceInput[i].value = arrItemPriceInput[i].value - 10;
                                }
                                arrItemPriceInput[i].style.backgroundColor = '#F4FA58';
                                var testcase = 0;
                                // price under 200k, no undercuts
                            } else {
                                if (parseInt(ushopPriceNum) > 0 && parseInt(ushopPriceNum) < parseInt(sessionStorage["MinPrice"])) {
                                    arrItemPriceInput[i].value = '0';
                                    arrItemPriceInput[i].style.backgroundColor = '#505050';
                                    // price under 10k, not very profitable or severely undercut - greyish black
                                } else {
                                    if (parseInt(ushopPriceNum) <= arrItemPriceInput[i].value * 0.8 && (parseInt(ushopPriceNum) <= 200000 || parseInt(arrItemPriceInput[i].value) <= 200000) && ((parseInt(sessionStorage[itemName])) * (parseFloat(sessionStorage["minRatio"])) < (parseInt(ushopPriceNum)))) {
                                        arrItemPriceInput[i].value = Math.ceil((
                                        (arrItemPriceInput[i].value * 0.95) + (((parseInt(ushopPriceNum) - 1) * 0.035))) / 10) * 10
                                        arrItemPriceInput[i].style.backgroundColor = '#C43EB2';
                                        // price under or equal to 200k and undercut by 20% or more - violet
                                    } else {
                                        if (parseInt(ushopPriceNum) > arrItemPriceInput[i].value * 0.8 && (parseInt(ushopPriceNum) <= 200000 || parseInt(arrItemPriceInput[i].value) <= 200000) && ((parseInt(sessionStorage[itemName])) * (parseFloat(sessionStorage["minRatio"])) < (parseInt(ushopPriceNum)))) {
                                            arrItemPriceInput[i].value = Math.ceil(
                                            (parseInt(ushopPriceNum) * 0.999) / 10) * 10;
                                            arrItemPriceInput[i].style.backgroundColor = '#1FE966';
                                            // price under or equal to 200k and undercut by 19.9% or less - green
                                        } else {
                                            if (parseInt(ushopPriceNum) <= arrItemPriceInput[i].value * 0.8 && (parseInt(ushopPriceNum) > 200000 || parseInt(arrItemPriceInput[i].value) > 200000) && (parseInt(arrItemPriceInput[i].value) > parseInt(ushopPriceNum)) && ((parseInt(sessionStorage[itemName])) * (parseFloat(sessionStorage["minRatio"])) < (parseInt(ushopPriceNum)))) {
                                                arrItemPriceInput[i].value = Math.ceil(
                                                (
                                                (arrItemPriceInput[i].value * 0.985) + (
                                                (
                                                (parseInt(ushopPriceNum) - 1) * 0.012))) / 10) * 10
                                                arrItemPriceInput[i].style.backgroundColor = '#FA960A';
                                                var testcase = 0;
                                                // price over 200k and undercut by 20% or more - orange
                                            } else {
                                                if ((parseInt(ushopPriceNum) > arrItemPriceInput[i].value * 0.8 && (parseInt(ushopPriceNum) > 200000 || parseInt(arrItemPriceInput[i].value) > 200000) && (parseInt(arrItemPriceInput[i].value) > parseInt(ushopPriceNum))) && ((parseInt(sessionStorage[itemName])) * (parseFloat(sessionStorage["minRatio"])) < (parseInt(ushopPriceNum)))) {
                                                    arrItemPriceInput[i].value = Math.ceil(
                                                    (parseInt(ushopPriceNum) * 0.9965) / 10) * 10;
                                                    arrItemPriceInput[i].style.backgroundColor = '#108C10';
                                                    // price over 200k and undercut by 19.9% or less - darker green
                                                } else {
                                                    if ((parseInt(ushopPriceNum) === parseInt(arrItemPriceInput[i].value) && (parseInt(ushopPriceNum) > 200000 || parseInt(arrItemPriceInput[i].value) > 200000)) && ((parseInt(sessionStorage[itemName])) * (parseFloat(sessionStorage["minRatio"])) < (parseInt(ushopPriceNum)))) {
                                                        arrItemPriceInput[i].value = Math.ceil(
                                                        (parseInt(ushopPriceNum) * 0.9993) / 10) * 10;
                                                        arrItemPriceInput[i].style.backgroundColor = '#7CA8F0';
                                                        // price over 200k and not undercut at all - blue
                                                    } else {
                                                        arrItemPriceInput[i].value = '0';
                                                        arrItemPriceInput[i].style.backgroundColor = '#FFFFFF';
                                                        // no effect
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                 // var itemCount = (document.querySelectorAll('input[type="hidden"]').length - 5); //
                 ItemsChecked = ItemsChecked + 1
                 window.scrollBy(0, 90);
                 // increments 1 per item checked //
                 
                 if ((parseInt(itemCount) - ItemsChecked === 0) && ItemsChecked < 100 && ItemsChecked > 0)
                     // if items are below 100, the page is the last //
                 {
                     for (i = 1; i < 10; i++) {
                     sessionStorage[i] = 1;
                     sessionStorage["CountLoop"] = parseInt(sessionStorage["CountLoop"]) + 1
                     sessionStorage["Key"] = 0;
                     sessionStorage["CycleTime"] = new Date();
                     sessionStorage["Looped"] = 0;
                     sessionStorage["PageTrack"] = 1;
                         if (parseInt(sessionStorage["CountLoop"]) % 9 === 0) {
                          sessionStorage["CyclesLoop"] = parseInt(sessionStorage["CyclesLoop"]) + 1   
                         }

                     }
                     ItemsChecked = 0;
                     if (ItemsChecked === 0) {
                     jQuery('#content').find('input[type=submit][value="Process Prices and Removals"]').click();
                     }
                 }
                        
                 if ((parseInt(itemCount) - ItemsChecked === 0) && ItemsChecked === 100 && parseInt(sessionStorage["Looped"]) === 2)
                     // if items are equal to 100 and the page has been looped twice, the page is the last //
                 {
                     for (i = 1; i < 10; i++) {
                     sessionStorage[i] = 1;
                     sessionStorage["CountLoop"] = parseInt(sessionStorage["CountLoop"]) + 1
                     sessionStorage["Key"] = 0;
                     sessionStorage["CycleTime"] = new Date();
                     sessionStorage["Looped"] = 0;
                     sessionStorage["PageTrack"] = 1;
                         if (parseInt(sessionStorage["CountLoop"]) % 9 === 0) {
                         sessionStorage["CyclesLoop"] = parseInt(sessionStorage["CyclesLoop"]) + 1
                         }
                     }
                     ItemsChecked = 0
                     jQuery('#content').find('input[type=submit][value="Process Prices and Removals"]').click();
                 }
                  
                 if ((parseInt(itemCount) - ItemsChecked === 0) && parseInt(sessionStorage[page]) === 0 && ItemsChecked === 100)
                     // if items are equal to 100, and the page has not been looped, the page is not the last //
                 {
                     sessionStorage[page] = 1;
                     ItemsChecked = 0;
                     if (ItemsChecked === 0) {
                     jQuery('#content').find('input[type=submit][value="Process Prices and Removals"]').click();
                     }
                 }
                 // where all items are checked, and page is most likely not final, click finish //
                        
                        // update UI //
                        var countReport = '';
                        countReport = ItemsChecked + ' out of ' + wordCount + ' items were price-checked.'
                        $("#gmWordCount").text(countReport);
                        // update UI //
                        
                  
                    }
                }
                req.open("GET", "http://subeta.net/ushop.php?act=dosearch&itemname=" + escape(itemName) + "&type=shops", true);
				req.send(null);
            } catch (e) {}
            loop();
        }, 200/(2*arrItemName.length));
    },
    callback : function() { /* Done */ }
});
                        
function triple() {
	if (parseInt(sessionStorage["CyclesLoop"]) === parseInt(sessionStorage["shopCycles"])) {
		if (parseInt(sessionStorage["shopCycles"]) > 0) {
			var shopid = parseInt(getQueryVariable("shopid"));
			sessionStorage.clear();
			window.close();
			window.prompt = function() {
				return false;
				sessionStorage.clear();
			};
			sessionStorage.removeItem(shopid);
            sessionStorage.removeItem("shopCycles");
            sessionStorage.removeItem("shopDelay");
            sessionStorage.removeItem("Key");
            sessionStorage.removeItem("1");
            if (isNaN(sessionStorage[shopid])) {
			location.replace("http://subeta.net/myshop.php?shopid=" + shopid + "&act=profits");
        }
		}
	}
}                     


setTimeout(function() {
	window.location.reload(1);
}, 320000);
// reloads page after 320 seconds of inactivity