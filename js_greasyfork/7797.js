// ==UserScript== 
// @name GotoTop
// @version 0.1
// @description 给每个网页增加返回顶部按钮
// @match http://*
// @match https://*
// @copyright scott qian

// @namespace https://greasyfork.org/users/8717
// @downloadURL https://update.greasyfork.org/scripts/7797/GotoTop.user.js
// @updateURL https://update.greasyfork.org/scripts/7797/GotoTop.meta.js
// ==/UserScript==

ImportCss();
ScriptWithJquery();
BindHotKey();

function ImportCss() {
    var jqueryScriptBlock = document.createElement('style');
    jqueryScriptBlock.type = 'text/css';
    jqueryScriptBlock.innerHTML = "#gototop{position:fixed;bottom:20%;right:1px;border:1px solid gray;padding:3px;width:12px;font-size:12px;cursor:pointer;border-radius: 3px;text-shadow: 1px 1px 3px #676767;}";
    document.getElementsByTagName('head')[0].appendChild(jqueryScriptBlock);
}


function ScriptWithJquery() {
     $(document.body).append("<div id='gototop' title='快捷键： alt + up alt+鼠标滚轮向上'> 返 回 顶 部 </div>");
     $('#gototop').click(function () { $('html,body').animate({ scrollTop: '0px' }, 800); return false; });
}

function BindHotKey(){
    document.onkeydown = function(){
        var a = window.event.keyCode; 
        if((a == 38)&&(event.altKey)) 
        { 
            //alt + up
            $('html,body').animate({ scrollTop: '0px' }, 800);
        }
    };

    //绑定alt+鼠标向上滚轮事件
    window.addEventListener('mousewheel', function(event){
        if(event.wheelDelta > 0 && event.altKey)
        {
            $('html,body').animate({ scrollTop: '0px' }, 800);
            //防止滚动条向上滚动，导致多重效果
            window.event.preventDefault();
        }
    }, false);
}