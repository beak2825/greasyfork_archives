// ==UserScript==
// @name         人人影视优化
// @namespace    https://bestlzk.cn/
// @version      1.2
// @description  a标签添加target=_blank属性，增加下载按钮
// @author       bestlzk
// @license      MIT
// @match        *://*.yysub.cc/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552885/%E4%BA%BA%E4%BA%BA%E5%BD%B1%E8%A7%86%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/552885/%E4%BA%BA%E4%BA%BA%E5%BD%B1%E8%A7%86%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // import('https://static.geetest.com/static/tools/gt.js');

    function addDownloadLinks() {
        const links = document.querySelectorAll('.search-result ul li .t a');

        links.forEach(link => {
            link.setAttribute('target', '_blank');

            const downloadLink = document.createElement('a');
            downloadLink.textContent = '下载';
            downloadLink.href = link.href.replace('subtitle/', 'subtitle/file/');
            downloadLink.style.marginLeft = '10px';
            downloadLink.style.borderRadius = '5px';
            downloadLink.style.backgroundColor = '#007bff';
            downloadLink.style.color = '#fff';
            downloadLink.style.textDecoration = 'none';
            downloadLink.style.display = 'inline-block';
            downloadLink.style.padding = '0px 10px 0px 10px';
            downloadLink.addEventListener('click', function (event) {
                event.preventDefault();
                const href = this.href;
                handleLinkClick(href);
            });

            link.parentNode.appendChild(downloadLink);
        });
    }

    function handleLinkClick(href){
        GLOBAL.Loading()
        $.get(href, {action:'check'}, function(R){
            GLOBAL.Loading('hide')
            if (R.status == 1001){
                GLOBAL.ShowMsg('请先登录');
            } else if (R.status == 5001){
                // GLOBAL.Geetest.init({success_callback: function(){download(href)}});
                window.open(href.replace('subtitle/file/', 'subtitle/'))
            } else if (R.status == 1){
                download(href)
            }
        })
    }

    function download(href){
        var dload = document.createElement("a");
        dload.download = '';
        dload.href = href;
        document.body.appendChild(dload);
        dload.click();
        dload.remove();
    }

    addDownloadLinks();

})();