// ==UserScript==
// @name       jawz Matt Tyner
// @version    1.0
// @description  Find Product Name
// @match      https://www.mturkcontent.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_xmlhttpRequest
// @grant		GM_setClipboard
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/9792/jawz%20Matt%20Tyner.user.js
// @updateURL https://update.greasyfork.org/scripts/9792/jawz%20Matt%20Tyner.meta.js
// ==/UserScript==
if ($("label:contains('Amazon.com ASIN:')")) {
    var label = $("label:contains('Amazon.com ASIN:')");
    label = label.closest('tr').find('td:nth-(2)').html();
    var turl = "https://www.amazon.com/gp/product/" + label;
    
    GM_xmlhttpRequest
    ({
        method: "GET",
        url: turl,
        onload: function (results)
        	{
                rdata = results.response.replace(/(\r\n|\n|\r)/gm,"");
                var emp;
                //GM_setClipboard(results.response)
                if (rdata.indexOf('<span id="productTitle" class="a-size-large">') >= 0) {
                    emp = rdata.split('<span id="productTitle" class="a-size-large">')[1].split('</span>')[0];
                    emp = emp.replace(/&#39;/g, "'").replace(/&quot;/g, '"'); 
                } else
                    emp = "None";
                    
                $( "input[name='amazon_asin']" ).val(emp);
            }
	});        

}