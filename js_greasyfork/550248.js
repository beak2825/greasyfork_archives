// ==UserScript==
// @name         美化知乎
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  beautify zhihu
// @author       dabenfeng
// @match        https://www.zhihu.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550248/%E7%BE%8E%E5%8C%96%E7%9F%A5%E4%B9%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/550248/%E7%BE%8E%E5%8C%96%E7%9F%A5%E4%B9%8E.meta.js
// ==/UserScript==

(function() {
    'use strict';
    {
        // 移除知乎首页的“推荐”部分，设置主内容宽度为100%
        const mainContent = document.querySelector(".Topstory-container");

        mainContent.children[1].remove();
        mainContent.children[0].style.width = "100%";
    }
    {
        // 隐藏知乎顶部导航栏，滚动时显示
        const header = document.querySelector(".AppHeader");
        header.style.transition = "opacity 0.5s ease-in-out";
        window.addEventListener("wheel", (event) => {
            if (event.deltaY > 0) {
                header.style.opacity = "0";
                setTimeout(() => {
                    header.style.display = "none";
                }, 500);

            } else {
                header.style.display = "block";
                header.style.opacity = "1";


            }
        });
    }
    {
        // 移除知乎顶部文本编辑器部分
        const writeArea = document.querySelector(".WriteArea");
        writeArea.remove();
    }
    {
        // const answerContent = document.querySelectorAll('.RichContent')
        // answerContent.forEach(content => {
        // //  content.children[0].remove()
        // })
    }
    {
        const answerContents = document.querySelectorAll(".TopstoryItem");
        answerContents.forEach((content) => {
            content.addEventListener("mouseenter", function () {
                content.style.border= "1px solid #fccff8";
                content.style.borderRadius = "8px";
                content.style.boxSizing = "border-box";
            });

            content.addEventListener("mouseleave", function () {
                content.style.border = "none";
            });
        });
    }

})();