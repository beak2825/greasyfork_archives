// ==UserScript==
// @name         北理工-实验选课助手
// @namespace    http://tampermonkey.net/
// @version      2025-11-13
// @description  bit 实验选课平台一点前端优化
// @author       You
// @match        https://xk.bit.edu.cn/xsxkapp/sys/xsxkapp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bit.edu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555729/%E5%8C%97%E7%90%86%E5%B7%A5-%E5%AE%9E%E9%AA%8C%E9%80%89%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/555729/%E5%8C%97%E7%90%86%E5%B7%A5-%E5%AE%9E%E9%AA%8C%E9%80%89%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 更改pageSize以显示更多选课
    pageSize = 1000;
    let hideInvalidExperimentFlag = true;
    // 自动隐藏无法操作课程
    $("#expCvCourse").on("click",".program-item,.mission-success-tip-restart-option", ()=>{
        $(".mission-success-tip-restart-option").remove();
        let waitLoopCount = 0;
        const waitExpListUpdate = setInterval(()=>{
            let removedBlocks = 0;
            $(".group-item").each((index,block)=>{
                if(block.firstElementChild.firstElementChild.classList.contains('cv-hide')){
                    if(block.style.display != 'none'){
                        block.style.display = 'none'; removedBlocks++;
                    }
                }
            });
            if(removedBlocks!=0){
                console.log("removed",removedBlocks,"invalid experiments!");
                $(".detail-group-list>.cv-foot").prepend("<div class='mission-success-tip'>已自动隐藏无效实验，共 <b style='font-size:1.5em;'>"+removedBlocks+"</b> 个，<b class='mission-success-tip-cancel-option'>点我取消隐藏</b></div>");
                clearInterval(waitExpListUpdate);
            }
            if(++waitLoopCount>500){
                console.log("reached auto remove expired time");
                clearInterval(waitExpListUpdate);
            }else{
                console.log("continue");
            }
        },1)
    });
    // 重新显示无法操作课程
    $("#expCvCourse").on("click",".mission-success-tip-cancel-option",()=>{
        console.log("resuming hiding status...");
        $(".mission-success-tip").remove();
        $(".group-item").each((index,block)=>{
            if(block.firstElementChild.firstElementChild.classList.contains('cv-hide')){
                if(block.style.display == 'none'){
                    block.style.display = 'initial';
                }
            }
        });
        $(".detail-group-list>.cv-foot").prepend("<div class='mission-success-tip-restart-option'>已取消自动隐藏无效实验，点我重新隐藏</div>");
    });
})();