// ==UserScript==
// @name         github links in jira
// @namespace    http://your.homepage
// @version      0.1
// @description  awesome github links in jira
// @author       Inez Korczyński
// @match        https://wikia-inc.atlassian.net/secure/RapidBoard.jspa?rapidView=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9973/github%20links%20in%20jira.user.js
// @updateURL https://update.greasyfork.org/scripts/9973/github%20links%20in%20jira.meta.js
// ==/UserScript==

var cb = Math.round(new Date().getTime() / 1000);
var waitCount = 0;

function go() {
    if(!$ || !$('div.js-detailview').length) {
        if(waitCount < 100) {
            waitCount++;
            setTimeout(go, 150);
        }
        return;
    }
    $('div.js-detailview').each(loadData);
}

function loadData(index,element) {
    var $element = $(element);
    $.getJSON('https://wikia-inc.atlassian.net/rest/dev-status/1.0/issue/detail?issueId=' + $element.data('issue-id') + '&applicationType=github&dataType=pullrequest&_=' + cb,  function(data) {
        var pullRequests = null;
        var branches = null;

        try {
            pullRequests = data.detail[0].pullRequests;
        } catch(e) {
            console.log("EXCEPTION1", e);
        }
        try {
            branches = data.detail[0].branches ;
        } catch(e) {
            console.log("EXCEPTION2", e);
        }
        
        /* --- */
        
        var strings = [];
        if ( pullRequests ) {
            for(var i = 0; i < pullRequests.length; i++) {
                strings.push('<a href="'+pullRequests[i].url+'">'+pullRequests[i].id+'</a>');
            }
        }
        if ( branches ) {
            for(var i = 0; i < branches.length; i++) {
                strings.push('<a href="'+branches[i].url+'">'+branches[i].name+'</a>');
            }
        }

        /* --- */
        
        if(strings.length) {
            $span = $('<span>').html(strings.join(' ')).css({position: 'absolute', left: '6px', bottom: '-4px', 'font-size': '12px'}).appendTo($element);
            $span.on('click', function(e) {
                window.open(e.target.href);
                return false;
            });
        }

    });
}

go();
