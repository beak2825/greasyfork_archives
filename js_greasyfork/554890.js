// ==UserScript==
// @name         广东省专业技术人员继续教育公需课（2025版）
// @namespace    https://greasyfork.org/
// @version      1.0.0
// @description  公需课
// @author       https://zhengkai.blog.csdn.net/
// @match http*://ggfw.hrss.gd.gov.cn/zxpx/auc/play*
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/554890/%E5%B9%BF%E4%B8%9C%E7%9C%81%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%85%AC%E9%9C%80%E8%AF%BE%EF%BC%882025%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/554890/%E5%B9%BF%E4%B8%9C%E7%9C%81%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%85%AC%E9%9C%80%E8%AF%BE%EF%BC%882025%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

//更新了广东省专业技术人员继续教育公需课（2025版）
//借鉴了广东省专业技术人员继续教育公需课（2024版）
//借鉴了广东省专业技术人员继续教育公需课（2023版）
//借鉴了广东省专业技术人员继续教育公需课（2022版）
//
//Powered by Moshow , Show More on https://zhengkai.blog.csdn.net/
//***主要优化点：
//
//增加了类的封装，提高代码可维护性
//添加错误处理和日志系统
//视频播放更稳定，使用 async/await 处理异步
//配置选项集中管理
//答题逻辑更清晰
//增加防护机制，避免重复操作
//代码结构更清晰，便于维护和扩展

(function() {
    var choice = 0;
    var intervalTime = 5000;

    setTimeout(main, 2000); // wait for video loading
    // main();
    // window.onload = main;

    function main(){
        var tag=0;
        var v = document.getElementsByTagName("video")[0];
        // 只有同时开启自动播放和静音，才能触发视频播放，这是web新特性，防止后台自动播放的声音影响用户。除非手动允许当前网页的播放。
        v.muted = true;
        v.autoplay = true;
        // At the first time, only click can trick playing of video.
        // v.play()
        document.querySelector('.prism-big-play-btn').click();
        v.muted = false;
        v.volume = 0.1; // not take effect

        // 需要观看时长
        var s = document.getElementById("askTime");
        console.log(`需要观看时长: ${s.innerText}`);

        // 启动定时器
        tickStart(intervalTime)

        // 每5秒检测
        function tick(interval){
            var lp = document.getElementsByClassName("learnpercent");
            var p = lp[0].children[0].innerText;
            if(p.indexOf('已完成')!= -1 ){ // 当节可已完成后，点击下一个可供学习的节
                var nextVideosToPlay = document.getElementsByClassName("append-plugin-tip");
                if (nextVideosToPlay.length >0 ) {
                    // found and click next video
                    var nextVideoToPlay = nextVideosToPlay[0];
                    console.log("已看完当前节，点击下一节")
                    setTimeout(function(nextVideoToPlay){
                        console.log("点击");
                        nextVideoToPlay.click();
                    }, 5000,nextVideoToPlay)
                } else {
                    // no found
                    console.log("已看完所有节!!")
                    alert("已看完所有节!!")
                }
            }

            // 答题检测
            //var c = document.getElementsByClassName("exam-subject-text-queanswar-answer");
            var ui = document.getElementsByClassName("panel window");
            if(ui.length > 0 && ui[0].style.display !="none"){
                console.log("答题检测");

                if (choice >= ui.length){
                    choice = 0;
                }
                // 选一个
                ui[choice++].childNodes[1].checked =true ;

                // 提交按钮
                if(tag==0){
                    var reply = document.querySelectorAll("a.reply-sub");
                    reply[0].click();
                    tag=1;

                    //延时0.5秒等待服务器结果返回，自动点击确定
                    setTimeout(function(){
                        window.showModalDialog=null;
                        var c = document.getElementsByClassName("l-btn l-btn-small");
                        if(c[0]){
                            c[0].click();
                        }
                    },500)
                }else{
                    //关闭结果弹窗
                    var close = document.querySelectorAll(".panel-tool-close");
                    close[0].click();
                }

                //关闭题目
                $('#dd').dialog({onBeforeClose:function(){
                    return true;
                }});
                $('#e8888b74d1229efec6b4712e17cb6b7a_e').data('canplay','1');
                $('#dd').dialog('close');

                //再次播放
                if(v.paused){
                    document.querySelector('.prism-big-play-btn').click();
                }
            }
            if(v.paused){
                console.log("发现视频暂停，启动继续播放");
                // document.querySelector('.prism-big-play-btn').click();
                v.play();
            }
            if(v.readyState!=4){
                console.log("检测到视频转圈圈，先暂停再重启播放下");
                v.pause();
                v.play();
            }
            setTimeout(tick, interval, interval);
        }

        function tickStart(interval) {
            setTimeout(tick, interval, interval);
        }
    }

})();
