// ==UserScript==
// @name         好医生刷课脚本
// @namespace    https://jiaobenmiao.com/
// @version      1.0
// @description  该油猴脚本用于 好医生 的辅助看课，脚本功能如下：视频自动播放自动切换、自动考试
// @author       脚本喵
// @match        https://www.cmechina.net/cme/*
// @match        https://www.cmechina.net/cme/exam.jsp*
// @match        https://www.cmechina.net/cme/examQuizFail*
// @match        https://www.cmechina.net/cme/examQuizPass*
// @match        https://www.cmechina.net/cme/course.jsp?course_id*
// @match        https://www.cmechina.net/pub/tongzhi.jsp*
// @match        https://www.cmechina.net/webcam/ewmface2.jsp*
// @icon         https://jiaobenmiao.com/img/logo2.jpg
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549940/%E5%A5%BD%E5%8C%BB%E7%94%9F%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/549940/%E5%A5%BD%E5%8C%BB%E7%94%9F%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


(function () {

    var url = window.location.href;
    advis();//广告和操作平台
    if (url.indexOf("https://www.cmechina.net/cme/polyv") != -1 || url.indexOf("https://www.cmechina.net/cme/study2.jsp") != -1) {
        console.log("进入好医生课程");

        window.onload = function () {
            // 移除右键菜单禁用
            document.oncontextmenu = null;

            // 移除F12禁用
            document.onkeydown = null;
            document.onkeyup = null;
            document.onkeypress = null;
            var infoold = console.info;//保存以前的console.info以防万一
            console.info = function () { };//禁止提示错误信息
            console.clear = function () { };//禁止清空控制台


            try {
                var kecheng = document.querySelectorAll("ul[id='s_r_ml']")[0].querySelectorAll("li");
            } catch (e) {
                var kecheng = document.querySelectorAll("ul[id='s_r_ml']")[0].querySelectorAll("li");
            };

            let i = 0;
            while (i < kecheng.length) {
                if (kecheng[i].outerText.includes("未学习") == true && kecheng[i].className != "active") {
                    console.log(kecheng[i].outerText.replace("未学习", ""));
                    window.s2j_onPlayerInitOver = function () {//PV视频加载完毕
                        setTimeout(function () {
                            try {
                                //document.querySelector("video").muted = true;
                                cc_js_Player.play();
                                cc_js_Player.setVolume(0);
                                console.log("运行了这个事件");
                            } catch (error) {
                                document.querySelector("video").play();//传统意义找播放器播放视频
                                document.querySelector("video").muted = true;
                            };
                        }, 1000);//延迟1秒操作，为网页留点时间
                    };

                    setTimeout(function () {
                        setInterval(function () {
                            counttime();
                        }, 10000);
                        kecheng[i].querySelector("a").click();//点击第一个没有播放的视频
                    }, 4000);//延迟4秒，避免网页还没打开
                    break;
                } else if (kecheng[i].outerText.includes("未学习") == true && kecheng[i].className == "active") {
                    console.log(kecheng[i].outerText.replace("未学习", ""));
                    //document.querySelector("video[class='pv-video']").play();//播放视频
                    //document.querySelector("video").play();//播放视频
                    cc_js_Player.play();
                    setTimeout(function () {
                        cc_js_Player.setVolume(0);
                        // document.querySelector("video").muted = true;
                        // document.querySelector("video").volume = 0;
                    }, 300);
                    setInterval(function () {
                        counttime();
                    }, 10000);
                    break;
                };
                //clearInterval(intervalid);
                if (i == kecheng.length - 1) {

                    if (localStorage.getItem("mode") == "2") {
                        setTimeout(function () {
                            document.querySelector("a[class='cur']").click();
                        }, 2000);
                    } else {
                        alert("已经完成全部学习，请自行考试");
                    };

                };
                i++;
            };

            function counttime() {
                clearInterval(intervalPause);//第一招：去掉签到定时器
                pauseSecond = -1;//第二招：去掉签到定时器
                function openPause() { };//第三招：清空弹出签到的功能
                var currenttime = parseInt(cc_js_Player.getPosition());
                var duration = parseInt(cc_js_Player.getDuration());
                var percent = ((currenttime / duration) * 100).toFixed(2) + "%";
                if (currenttime == duration) {
                    console.log("已播放" + percent);
                    location.reload();
                } else {
                    console.log("已播放" + percent);
                    cc_js_Player.play();
                    cc_js_Player.setVolume(0);
                    document.title = "【" + percent + "】" + $("a[class='active']").text();
                    // document.querySelector("video").play();//播放视频
                    // document.querySelector("video").muted = true;
                    // document.querySelector("video").volume = 0;
                };
            };
        };
    } else if (url.indexOf("https://www.cmechina.net/cme/exam.jsp不允许考试") != -1) {
        //这里是考试页面
        let timu = document.querySelectorAll("li");//获取全部考题和选项
        var cishu = localStorage.getItem("cishu");
        var answer = localStorage.getItem("Answer");
        console.log("提取的答案" + answer);
        console.log("次数：" + cishu)

        var i = 0;//用于遍历题号
        var j = 0;//用于遍历选项

        while (i < timu.length) {
            if (answer === null) {
                if (document.querySelectorAll("li")[i].innerText.indexOf("多选") != -1) {//如果是多选题，则全选（虽然不完美）
                    document.querySelectorAll("li")[i].querySelectorAll("input[type='checkbox']").forEach(function (checkbox) { checkbox.checked = true; });
                } else {
                    document.querySelectorAll("li")[i].querySelectorAll("input[type='radio']")[0].click();//如果是空的，那么全部选A
                    localStorage.setItem("cishu", 1);//恢复第一次作答
                };
            } else {
                answer = answer.toString().split(",");
                if (document.querySelectorAll("li")[i].innerText.indexOf("多选") != -1) {//如果是多选题，则全选（虽然不完美）
                    document.querySelectorAll("li")[i].querySelectorAll("input[type='checkbox']").forEach(function (checkbox) { checkbox.checked = true; });
                } else {
                    try {
                        document.querySelectorAll("li")[i].querySelectorAll("input[type='radio']")[thxx(answer[j])].click();//如果不是多选
                    } catch (error) {
                        document.querySelectorAll("li")[i].querySelectorAll("input[type='radio']")[0].click();//如果答案没有E，会出现错误，错误的话重新选A
                    };
                };
                localStorage.setItem("cishu", parseInt(cishu) + 1);//恢复第一次作答
            };
            i++;
            j++;
            if (cishu > 5) {
                cleanKeyStorage();//次数大于说明题目乱了，要重新从A开始选择
                localStorage.setItem("cishu", 1);//恢复第一次作答
            };
        };

        setTimeout(function () {
            document.querySelector("a[id='tjkj']").click();//提交答案按钮
        }, 500);


    } else if (url.indexOf("https://www.cmechina.net/cme/examQuizFail不允许考试") != -1) {
        //答题失败了

        const extractedList = url.match(/error_order=([0-9,]+)/)[1].split(",");//错题列表
        console.log("错题题号" + extractedList); // 输出: ["1", "2", "4", "5"]
        const ansList = url.match(/ansList=([^&]+)/)[1].split(",");//答案列表
        console.log("原本的答案" + ansList)//输出["A","B","C","D","E"]全部题目答案
        var i = 0;
        while (i < extractedList.length) {
            ansList[parseInt(extractedList[i]) - 1] = fthxx(parseInt(thxx(ansList[parseInt(extractedList[i]) - 1])) + 1);//将错题A转换为数字1，代表待会儿选B
            i++;
        };
        localStorage.setItem("Answer", ansList);//存储答案
        console.log("存储的答案" + ansList);

        setTimeout(function () {
            document.querySelector("a[id='cxdt']").click();//重新答题
        }, 500);

    } else if (url.indexOf("https://www.cmechina.net/cme/examQuizPass") != -1) {
        //答题成功
        cleanKeyStorage();
        setTimeout(function () {
            document.querySelector("div[class='show_exam_btns']").querySelector("a").click();//调到下一个章节的考试
        }, 2000);
    } else if (url.indexOf("https://www.cmechina.net/cme/course.jsp?course_id") != -1) {

        try {
            document.querySelector("i[class='fa fa-circle-o']").click()//课程页面点击未学习的进入
        } catch (error) {
            if (localStorage.getItem("mode") == "2") {
                document.querySelector("i[class='fa fa-adjust']").click();//课程页面点击要考试的进入
            };

        };

    } else if (url.indexOf("https://www.cmechina.net/pub/tongzhi.jsp") != -1) {
        //网站的广告通知，直接给他点掉。
        setTimeout(function () {
            try {
                document.querySelector("a[class='newBtn']").click();
            } catch (error) {
                console.log("没有找到推广通知");
            };
        }, 1000);
    } else if (url.indexOf("https://www.cmechina.net/cme/index.jsp") != -1) {
        setTimeout(function () {
            try {
                document.querySelector("div[class='close2']").click();
            } catch (error) {
                console.log("没有找到首页广告");
            };
        }, 1000);
    } else if (url.indexOf("https://www.cmechina.net/webcam/ewmface2.jsp") != -1) {
        console.log("二维码页面");
        var code = setInterval(function () {
            document.querySelector("div[id='wx_pay_ewm']").querySelector("canvas").style = "position:relative;left:-60px;top:-100px;height:300px;width:300px";
            if (document.querySelector("div[id='wx_pay_ewm']").querySelector("canvas").style["height"] == "300px") {
                clearInterval(code);
            };
        }, 100);
        setTimeout(function () {
            let nihao = document.createElement("div");
            nihao.innerText = "二维码已失效，点此刷新";
            nihao.style = "position:relative;top:-270px;left:-35px;width:250px;font-size:22px;text-align:left;color: #ff0000;font-weight: bold;background-color: #FFFFFF"
            document.querySelector("div[id='wx_pay_ewm']").querySelector("canvas").parentNode.append(nihao);
            nihao.onclick = function () {
                location.reload();
            };
        }, 60000);
    };

    //---------------------------------全局函数区------------------------------//

    function thxx(xx) {
        switch (xx) {
            case "A":
                xx = 0;
                break;
            case "B":
                xx = 1;
                break;
            case "C":
                xx = 2;
                break;
            case "D":
                xx = 3;
                break;
            case "E":
                xx = 4;
                break;
        };
        return xx;
    };

    function fthxx(xx) {
        switch (xx) {
            case 0:
                xx = "A";
                break;
            case 1:
                xx = "B";
                break;
            case 2:
                xx = "C";
                break;
            case 3:
                xx = "D";
                break;
            case 4:
                xx = "E";
                break;
        };
        return xx;
    };

    function cleanKeyStorage() {//缓存清理
        localStorage.removeItem("cishu");
        localStorage.removeItem("Answer");
    };

    function advis() {
        let div1 = document.createElement("div");
        let div2 = document.createElement("div");
        div1.innerHTML = `
    <div id='Div1' style="max-width:220px;text-align:left;padding: 10px 10px;font-size: 20px;float: left;position:fixed;top:180px;left: 10px;z-index: 99999; background-color: rgba(184, 247, 255, 0.7); overflow-x: auto;">
    <span id='clo' style="float: right;position: absolute;top:14px;right:5px;cursor:pointer;font-size:16px">❎</span>
    <div style="font-size:22px;font-weight:bold;color:red;">好医生刷课脚本</div>
    <hr style="margin-top: 10px;margin-bottom: 10px;">
    <a id='Autocourse' class="btn btn-default">★只看不考</a><br>
    <a id='Joincourse' class="btn btn-default">★全看遂考</a><br><br>

    
    </div> `;

        div2.innerHTML = `
    <div id='Div2' style = "padding: 10px 10px;font-size: 20px;float: left;position:fixed;top:180px;left: 240px;z-index: 99999; background-color: rgba(184, 247, 255, 0.7); overflow-x: auto;" >

    </div> `;
        document.body.append(div1, div2);
        //document.getElementById("Pic").style.height = document.querySelector("div[id='Div1']").offsetHeight - 20 + "px";//因为虚化上下各10px
        let mode1 = document.querySelector("a[id='Autocourse']");
        let mode2 = document.querySelector("a[id='Joincourse']");
        if (localStorage.getItem("mode") == "" || localStorage.getItem("mode") == "1") {
            mode1.innerHTML = "★只看不考 ✅";

        } else {
            mode2.innerHTML = "★全看遂考 ✅";

        };
        mode1.onclick = function () {
            if (mode1.innerHTML === "★只看不考") {
                mode1.innerHTML = "★只看不考 ✅";
                mode2.innerHTML = "★全看遂考";
                localStorage.setItem("mode", "1");
            };
        };
        mode2.onclick = function () {
            if (mode2.innerHTML === "★全看遂考") {
                mode1.innerHTML = "★只看不考";
                mode2.innerHTML = "★全看遂考 ✅";
                localStorage.setItem("mode", "2");
            };
        };
        clo.onclick = function () {
            document.querySelector("div[id='Div1']").style.display = "none";
            document.querySelector("div[id='Div2']").style.display = "none";
        };


    };
    //---------------------------------全局函数区end------------------------------//

})();
