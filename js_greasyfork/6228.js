// ==UserScript==
// @name       DorklyPageOne
// @namespace  digital-utopia.org
// @version    0.1
// @description  combines multi-page Dorkly.com articles into a single page.
// @match      http://www.dorkly.com/*
// @copyright  2014, Digital_Utopia
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/6228/DorklyPageOne.user.js
// @updateURL https://update.greasyfork.org/scripts/6228/DorklyPageOne.meta.js
// ==/UserScript==
var $ = unsafeWindow.jQuery;

var pages=[];
$( document ).ready(function() {
    
    var pag = $(".pagination");
    var pg = $(".selected").html();
    if(pag && pg=="1")
    {
        var pathname = window.location.pathname;
        var pArray=($(".total").html()).split(" ");
        var ps=parseInt(pArray[1]);
        var pe=parseInt(pArray[3]);
                
        for(var i=(ps+1); i <= (pe);i++)
        {
         	pages.push("http://www.dorkly.com/"+pathname+"/page:"+i);   
        }
        loadPage(0);
    }
    function loadPage(index)
    {
        $.get(pages[index],function(data){
            var content=($(".post-content",data));
            $(".post-content").last().after(content);
             $(".pagination").remove();
          if(pages[index+1]!=undefined)
            {
                loadPage(index+1);   
            }
        });
        
    }
    $(".pagination").remove();
 
});