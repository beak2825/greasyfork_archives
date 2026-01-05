// ==UserScript==
// @name       Enhanced Lady Ayumi shop info
// @namespace  http://use.i.E.your.homepage/
// @version    1.2.1
// @description  displays more details in shop
// @match      http://www.ghost-trappers.com/fb/scotch_ninth_floor.php*
// @copyright  2015+, GTNoAPI
// @grant      GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/9593/Enhanced%20Lady%20Ayumi%20shop%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/9593/Enhanced%20Lady%20Ayumi%20shop%20info.meta.js
// ==/UserScript==

getSpecialItems();
getCurrency();
function getSpecialItems(){
    GM_xmlhttpRequest({
			method: 'GET',
			url: 'http://www.ghost-trappers.com/fb/setup.php?type=special',
			headers: {
				"Accept": "text/html",
				"Pragma": "no-cache",
				"Cache-Control": "no-cache"
			},
			onload: function(rD) {
                var text = rD.responseText;

                var result = text.match(/<div class="itemHeadline">[A-Za-z0-9'`._%+-\s]+/ig);

                for(var x = 0; x< result.length; x++){
                    result[x] = result[x].substr(result[x].indexOf('>')+1, result[x].lastIndexOf(' '));
                    result[x] = result[x].trim();
                }
                
                have_dontHaveItems(result);
			}
		});
};

function getCurrency(){
    GM_xmlhttpRequest({
			method: 'GET',
			url: 'http://www.ghost-trappers.com/fb/setup.php?type=currency',
			headers: {
				"Accept": "text/html",
				"Pragma": "no-cache",
				"Cache-Control": "no-cache"
			},
			onload: function(rD) {
                var text = rD.responseText;

                var result = text.match(/<div class="itemHeadline">\n*.*<\/div>|<div class="itemSpecialText">[A-Za-z0-9'`._%+-\s]+/ig);
                var gbpHolder = document.getElementById('profile_gbp').innerHTML;

                var dictionary = [];
              	
                for(var x = 0; x < result.length-1; x+=2){
                  	
                    var temp = result[x].match(/[A-Z0-9.-_\s]+>/ig);
                  	
                    var key = temp[0].substring(1, temp[0].indexOf('</')).trim().toLowerCase();
                    var value = result[x+1].substring(result[x+1].indexOf('itemSpecialText'), result[x+1].indexOf('.'));
                    value = value.match(/[0-9]+/ig);
                   
                    dictionary[key] = parseInt(value);
                } 
                
              	
                dictionary['great british pounds, that goes without saying'] = gbpHolder;
              	
                priceIn(dictionary);
			}
		});
};


function insertCommas(string,text){
    var result = text.toString();
    if (result.length > 3){
        for(var x = result.length-3; x>0; x-=3){
            result = result.substring(0, x) + string + result.substring(x, result.length);
        }  
    }

    return result;
}

function priceIn(dictionary){
     var elements = $(".itemCurrency");
    
    for(var x= 0; x< elements.length; x++){
        var currencyHolder = elements[x].childNodes;
        currencyHolder[3].style.width = '360px';
        
        var temp = currencyHolder[1].childNodes[0].title;
        var priceIn = temp.substr(temp.indexOf('-')+4).trim().toLowerCase();
        var price= currencyHolder[3].innerHTML;

        if(priceIn == 'great british pounds, that goes without saying'){
            price = parseInt(price.replace(/,/ig,''));
            var gbp = parseInt(dictionary[priceIn].replace(/,/ig,''));
            var leftOvers = parseInt(price)-gbp < 0 ? 0:parseInt(price)-gbp;
            var howMuch = gbp/price;
            var temp = insertCommas(',',leftOvers);
            currencyHolder[3].innerHTML = currencyHolder[3].innerHTML +'('+dictionary[priceIn] +')/' + temp+'(can buy: '+howMuch.toFixed(2)+')';
        }
        else if(dictionary[priceIn] == undefined){
            continue;
        }
        else{
            var leftOvers = parseInt(currencyHolder[3].innerHTML)-dictionary[priceIn];
            var howMuch = dictionary[priceIn]/parseInt(currencyHolder[3].innerHTML)
            currencyHolder[3].innerHTML = currencyHolder[3].innerHTML+'('+dictionary[priceIn] +')/' + (leftOvers< 0 ? 0:leftOvers)+'(can buy: '+howMuch.toFixed(2)+')';
		
        }
    }
}

function have_dontHaveItems(items){
    var elements = $(".itemHeadline");
	var missingItem;
	var missingItemArr = [];
    for(var x= 0; x< elements.length; x++){
        for(var y = 0; y < items.length; y++){
            var temp = elements[x].innerHTML.substr(1);
            if(items.indexOf(temp) == -1){
               if(missingItemArr.indexOf(temp) == -1){
					missingItemArr.push(temp);
				}
            }
        }
    }
	
	return missingItemArr;
};
