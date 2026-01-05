// ==UserScript==
// @name         Jesse Villanueva helper
// @namespace    https://greasyfork.org/en/users/710-tjololo
// @version      0.2
// @description  Helps with the Jesse Villanueva hits by doing them.
// @author       Tjololo
// @match        https://s3.amazonaws.com/mturk_bulk/hits*
// @require      http://code.jquery.com/jquery-git.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/9450/Jesse%20Villanueva%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/9450/Jesse%20Villanueva%20helper.meta.js
// ==/UserScript==
// ------------------------------------------------------------------------------------

//Change this to the number of results you want to see per term (translated, non-translated)
var numResults = 5;

//don't change this, it's used somewhere else.
var query = $('a:visible:first').attr("href")+"&all";
query = query.replace("http","https");

console.log(query);


function httpGet(theUrl)
{
    GM_xmlhttpRequest({
        method: 'GET',
        url: theUrl,
        synchronous: true,
        
        onload: function (xhr,theUrl) {
            r = xhr.responseText;
            var ret="";
            try{
                ret = getResults(r);
		for (var i = 0; i < ret.length; i+=2){
		    $('input[type="text"]').eq(i).val(ret[i][0]);
                    $('input[type="text"]').eq(i+1).val(ret[i][1]);
		}
            }
            catch(err){
                console.log(err);
                console.log(r);
                return r;
            }
        }
    });
}


function getUrl(obj){
    var html = $.parseHTML(obj);
    var el = $( '<div></div>' );
    var finalUrl = [];
    el.html(html);
    
    for (var i = 0; i < numResults; i++){
        var element = $("div.offer", el).eq(i);
        item = [];
	name = element.find("div.column-1").text();
	amount = element.find("div.column-6 div.book-price-normal").text();
	item.push([name, amount]);
        finalUrl.push(item);
    }
    return finalUrl;
}

$('a:visible:first').parent().append(
    $("<button></button>", {
        type: "button",
        text: "Search ",
        id: "search_button"
    }).click(function() {
        var resultURL = httpGet(query);
        //console.log(resultURL);
    }));

//$("#search_button").hide();

//$("#search_button").click();