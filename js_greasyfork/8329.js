// ==UserScript==
// @id             forums.whirlpool.net.au-54dbf10e-a3ae-45a2-81cb-2028810cf729@WP
// @name           WP - has anyone responded to me?
// @version        1.1
// @namespace      WP
// @author         Yansky
// @description      WP - has anyone responded to me ?
// @include        http://forums.whirlpool.net.au/user/*
// @run-at         document-end
// @grant           GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/8329/WP%20-%20has%20anyone%20responded%20to%20me.user.js
// @updateURL https://update.greasyfork.org/scripts/8329/WP%20-%20has%20anyone%20responded%20to%20me.meta.js
// ==/UserScript==

var threads = document.querySelector('#threads');

var newColG = document.createElement('col');
newColG.setAttribute('style','width: 2em;');

var colG = threads.querySelector('colgroup');

colG.appendChild(newColG);

var th = threads.querySelector('thead');
var thtr = th.querySelector('tr');
var newtd1 = document.createElement('td');

var newtdButt = document.createElement('button');
newtdButt.innerHTML='>';
newtdButt.setAttribute('title','Check for replies');

newtd1.appendChild(newtdButt);

thtr.appendChild(newtd1);


newtdButt.addEventListener('mouseup',function(e){

    var titleLinks = document.querySelectorAll('#threads tr:not(.section) td.title>a');

    [].forEach.call(titleLinks, function (item, index, array) {

        GM_xmlhttpRequest({
            storedItem: item,
            method: "GET",
            responseType: "document",
            url:"http://webcache.googleusercontent.com/search?q=cache:forums.whirlpool.net.au/archive/"+item.href.split('/forum-replies.cfm?t=')[1],
            onload: function(response) {

                let storedItem=this.storedItem;

                var newTD = document.createElement('td');

                if(response.status===200){
                    var uInfo = document.querySelector('.userinfo a>span');

                    var refAs = [].filter.call(response.responseXML.querySelectorAll('.reference'), function(elem, index, arr){
                        if(elem.textContent.startsWith((uInfo.textContent+' writes...'))){
                            return elem;
                        }
                    });

                    if(refAs.length>0){

                        var lastResponse = refAs.length-1;

                        var postLink = refAs[lastResponse].parentNode.previousElementSibling.querySelector('a[href^="http://whrl.pl/"]');
                        var shortPostLink = window.location.protocol+"//whrl.pl/"+postLink.href.split("http://whrl.pl/")[1];
                        newTD.innerHTML = '<a href="'+shortPostLink+'" title="Takes you to the most recent response">&nbsp;'+
                                            refAs.length+'</a>';
                    }
                    else{
                        newTD.innerHTML = '&nbsp; 0 ';
                    }
                }
                else if(response.status===404 || response.status===304){
                    newTD.innerHTML = ' N/A ';
                    newTD.title = 'Information Not Available';
                }

                storedItem.parentNode.parentNode.appendChild(newTD);

            }
        });

    });

},false);