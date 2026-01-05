// ==UserScript==
// @name        TGFC论坛wap版助手
// @namespace   http://www.taiyuanhitech.com/tgfc/
// @description 增强wap版功能，首先实现每页120贴。
// @require http://cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.0/ScrollMagic.min.js
// @include     http://wap.tgfcer.com/index.php?action=thread*
// @include     http://wap.tgfcer.com/index.php?action=forum*
// @version     1.1
// @grant none
// @license MIT License
// @downloadURL https://update.greasyfork.org/scripts/8492/TGFC%E8%AE%BA%E5%9D%9Bwap%E7%89%88%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/8492/TGFC%E8%AE%BA%E5%9D%9Bwap%E7%89%88%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function(){
    if (typeof jQuery == 'undefined') return;
    var preferredMinPageSize = 100;

    var forum = {
        elementSelector : 'div.dTitle'
    }, thread = {
        elementSelector : 'div.message',
        fragmentCreator : function(elementsObj){
            var f = [];
            elementsObj.each(function(){
                var message = $(this);
                f.push(message.prevAll('a:first').get(0));
                f.push(message.prev('div.infobar').get(0));
                f.push(this);
                f.push(document.createElement('br'));
                f.push(document.createTextNode('==================='));
                f.push(document.createElement('br'));
            });
            return f;
        }
    };

    var scrollMagicController = new ScrollMagic.Controller();
    var currPageIndex, totalPages;
    var elementCount;

    function more(p, config){
        var currPageSpan = p.children('span').first();
        currPageIndex = currPageIndex || parseInt(currPageSpan.text().replace('##' , ''));
        totalPages = totalPages || parseInt(p.last().contents().filter(function(){return this.nodeType == 3;}).first().text().split('/')[1].replace('页',''));
        if (currPageIndex >= totalPages)
            return;
        
        elementCount = elementCount || $(config.elementSelector).length;
        if (elementCount >= preferredMinPageSize)
            return;
        
        var nextHref = currPageSpan.next('a').first().attr('href');
        $.get(nextHref, '', function(data){
            var elements = $(data).find(config.elementSelector);
            var fragment = config.fragmentCreator ? config.fragmentCreator(elements) : elements;
            p.last().prev('br').before(fragment);
            
            var scene = new ScrollMagic.Scene({triggerElement: elements.get(Math.floor(elements.length * 2 / 3)), triggerHook: "onEnter", reverse: false})
            .addTo(scrollMagicController).on('start', function(){ scene.destroy(); more(p, config);});
            
            if (++currPageIndex >= totalPages){
                p.children('span').nextAll().remove();
            } else {
                elementCount += elements.length;  
                var nextPageAnchor = p.children('span').next('a');
                nextPageAnchor.text('下一页').attr('href', replacePageIndex(nextHref, currPageIndex + 1)).nextAll().remove();
                p.append(nextPageAnchor.first().clone().text('尾页').attr('href', replacePageIndex(nextHref, totalPages)));
            }
            p.append($('<span> (wap助手已扩展页码)</span>'));
        }, 'html');
    }

    function replacePageIndex(url, index){
        return url.replace(/page=\d+/, "page=" + index);
    }

    function dowork(){
        var paging = $('div.navbar ~ div:first > span.paging');
        if (paging && paging.length > 0) {
            more(paging, location.href.indexOf('action=forum') > 0 ? forum : thread);
        }
    }
    dowork();
})();
