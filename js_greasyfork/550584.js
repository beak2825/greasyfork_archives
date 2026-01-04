// ==UserScript==
// @name         PT签到+首页喊魔力(不会反复跳转)
// @icon      data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjNWMyOThjIiBkPSJNOC41MDIgMTEuNWExLjAwMiAxLjAwMiAwIDEgMSAwIDIuMDA0YTEuMDAyIDEuMDAyIDAgMCAxIDAtMi4wMDVNMTIgNC4zNTN2Ni42NWg3LjQ0MkwxNy43MiA5LjI4YS43NS43NSAwIDAgMS0uMDczLS45NzdsLjA3My0uMDg0YS43NS43NSAwIDAgMSAuOTc2LS4wNzJsLjA4NC4wNzJsMi45OTcgMi45OThhLjc1Ljc1IDAgMCAxIC4wNzMuOTc2bC0uMDczLjA4NGwtMi45OTYgMy4wMDNhLjc1Ljc1IDAgMCAxLTEuMTM0LS45NzVsLjA3Mi0uMDg0bDEuNzEzLTEuNzE3aC03LjQzMUwxMiAxOS4yNWEuNzUuNzUgMCAwIDEtLjg4LjczOGwtOC41LTEuNTAxYS43NS43NSAwIDAgMS0uNjItLjczOVY1Ljc1YS43NS43NSAwIDAgMSAuNjI4LS43NGw4LjUtMS4zOTZhLjc1Ljc1IDAgMCAxIC44NzIuNzRtLTEuNS44ODNsLTcgMS4xNXYxMC43MzJsNyAxLjIzNnpNMTMgMTguNWguNzY1bC4xMDItLjAwN2EuNzUuNzUgMCAwIDAgLjY0OC0uNzQ0bC0uMDA3LTQuMjVIMTN6bS4wMDItOC41TDEzIDguNzI1VjVoLjc0NWEuNzUuNzUgMCAwIDEgLjc0My42NDdsLjAwNy4xMDFsLjAwNyA0LjI1MnoiLz48L3N2Zz4=
// @namespace    https://greasyfork.org/
// @version      1.3
// @license      MIT
// @author       leo_lin
// @description  支持PT站点签到,论坛存在签到字样不会反复跳转（优化部分站点会跳多次问题），增加部分站点自动喊魔力。默认12秒后才跳转签到页面，请等13秒再随便点其他页面就好，由于优化为只跳转一次，如因为网络问题导致跳转卡住没有进入签到页面，需要手动刷新一下。
// @grant GM_setValue
// @grant GM_getValue


// @include *://*.invites.fun/*
// @include *://invites.fun/*
// @include *://*.m-team.cc/*
// @include *://m-team.cc/*
// @include *://*.ptchdbits.co/*
// @include *://ptchdbits.co/*
// @include *://*.totheglory.im/*
// @include *://totheglory.im/*
// @include *://*.hdhome.org/*
// @include *://hdhome.org/*
// @include *://*.hhanclub.top/*
// @include *://hhanclub.top/*
// @include *://*.audiences.me/*
// @include *://audiences.me/*
// @include *://*.keepfrds.com/*
// @include *://keepfrds.com/*
// @include *://*.ourbits.club/*
// @include *://ourbits.club/*
// @include *://*.pterclub.com/*
// @include *://pterclub.com/*
// @include *://*.hddolby.com/*
// @include *://hddolby.com/*
// @include *://*.ubits.club/*
// @include *://ubits.club/*
// @include *://*.tjupt.org/*
// @include *://tjupt.org/*
// @include *://*.blutopia.cc/*
// @include *://blutopia.cc/*
// @include *://*.btschool.club/*
// @include *://btschool.club/*
// @include *://*.hdarea.club/*
// @include *://hdarea.club/*
// @include *://*.zmpt.cc/*
// @include *://zmpt.cc/*
// @include *://*.pthome.net/*
// @include *://pthome.net/*
// @include *://*.haidan.video/*
// @include *://haidan.video/*
// @include *://*.hdfans.org/*
// @include *://hdfans.org/*
// @include *://*.ptvicomo.net/*
// @include *://ptvicomo.net/*
// @include *://*.cyanbug.net/*
// @include *://cyanbug.net/*
// @include *://*.soulvoice.club/*
// @include *://soulvoice.club/*
// @include *://*.qingwapt.com/*
// @include *://qingwapt.com/*
// @include *://*.piggo.me/*
// @include *://piggo.me/*
// @include *://*.u2.dmhy.org/*
// @include *://u2.dmhy.org/*
// @include *://*.monikadesign.uk/*
// @include *://monikadesign.uk/*
// @include *://*.tu88.men/*
// @include *://tu88.men/*
// @include *://*.hdkyl.in/*
// @include *://hdkyl.in/*
// @include *://*.agsvpt.com/*
// @include *://agsvpt.com/*
// @include *://*.agsvpt.cn/*
// @include *://agsvpt.cn/*
// @include *://*.dragonhd.xyz/*
// @include *://dragonhd.xyz/*
// @include *://*.et8.org/*
// @include *://et8.org/*
// @include *://*.eastgame.org/*
// @include *://eastgame.org/*
// @include *://*.star-space.net/*
// @include *://star-space.net/*
// @include *://*.discfan.net/*
// @include *://discfan.net/*
// @include *://*.carpt.net/*
// @include *://carpt.net/*
// @include *://*.hdtime.org/*
// @include *://hdtime.org/*
// @include *://*.ptcafe.club/*
// @include *://ptcafe.club/*
// @include *://*.crabpt.vip/*
// @include *://crabpt.vip/*
// @include *://*.hdupt.com/*
// @include *://hdupt.com/*
// @include *://*.ptsbao.club/*
// @include *://ptsbao.club/*
// @include *://*.hdcity.city/*
// @include *://hdcity.city/*
// @include *://*.lemonhd.club/*
// @include *://lemonhd.club/*
// @include *://*.zhuque.in/*
// @include *://zhuque.in/*
// @include *://*.pandapt.net/*
// @include *://pandapt.net/*
// @include *://*.pttime.org/*
// @include *://pttime.org/*
// @include *://*.rousi.zip/*
// @include *://rousi.zip/*
// @include *://*.ilolicon.com/*
// @include *://ilolicon.com/*
// @include *://*.nicept.net/*
// @include *://nicept.net/*
// @include *://*.greatposterwall.com/*
// @include *://greatposterwall.com/*
// @include *://*.dicmusic.com/*
// @include *://dicmusic.com/*



// @downloadURL https://update.greasyfork.org/scripts/550584/PT%E7%AD%BE%E5%88%B0%2B%E9%A6%96%E9%A1%B5%E5%96%8A%E9%AD%94%E5%8A%9B%28%E4%B8%8D%E4%BC%9A%E5%8F%8D%E5%A4%8D%E8%B7%B3%E8%BD%AC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550584/PT%E7%AD%BE%E5%88%B0%2B%E9%A6%96%E9%A1%B5%E5%96%8A%E9%AD%94%E5%8A%9B%28%E4%B8%8D%E4%BC%9A%E5%8F%8D%E5%A4%8D%E8%B7%B3%E8%BD%AC%29.meta.js
// ==/UserScript==

(function () {
    const host = window.location.host;
    const href = window.location.href;






    const AttendanceDay = host + 'AttendanceDay';
    const GetMOLIDay = host + 'GetMOLI';
    function formatDate(date) {
        let year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    const today = formatDate(new Date());
    function xpath(query) {
        return document.evaluate(query, document, null,
                                 XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    }
    setTimeout(function () {
        var attendanceTexts = [
            "签到得魔力",
            "簽到得魔力",
            "签到领魔力",
            "簽到领魔力",
            "签到得猫粮",
            "签 到",
            "签到",
            "簽到",
            "每日签到",
            "每日打卡",
        ];
        var lastAttendanceDay = GM_getValue(AttendanceDay);
        if (lastAttendanceDay === today) {
            console.log("今日已签到:"+lastAttendanceDay);
            return;
        }
        for (var index in attendanceTexts) {
            var text = attendanceTexts[index];
            var allElements = xpath("//*[contains(text(), '"+text+"')]");
            for (var i = 0; i < allElements.snapshotLength; i++) {
                var ptSignElements = allElements.snapshotItem(i);
                if (ptSignElements != null) {
                    // console.log(ptSignElements.innerText);
                    if (ptSignElements.innerText.indexOf(text) != -1) {
                        if (ptSignElements.innerText.indexOf("已") != -1 || ptSignElements.innerText.indexOf("详情") != -1) {
                            console.log("已签到:" + window.location.host);
                            GM_setValue(AttendanceDay, today);
                        } else {
                            try{
                                if(host.indexOf("ourbits")!=-1 ){
                                    console.log("href:"+href);
                                    console.log("host:"+host);
                                    if(href.indexOf("attendance.php")==-1){
                                        setTimeout(function(){GM_setValue(AttendanceDay, today);ptSignElements.click();},5000);
                                    }
                                    else{
                                        GM_setValue(AttendanceDay, today);
                                    }
                                }else{
                                    if(href.indexOf("attendance.php")==-1){
                                        GM_setValue(AttendanceDay, today);
                                        ptSignElements.click();
                                    }
                                    else{
                                        GM_setValue(AttendanceDay, today);
                                    }
                                }
                                console.log("签到:" + window.location.host);
                            } catch (error) {
                                // do nothing
                                console.log("error:"+error);
                            }
                        }
                    }
                }
            }
        }
    }, 12000);
    setTimeout(function () {
        var getMOLIDayTexts = [
            ["shbox_text","hbsubmit","qingwapt.com","蛙总，求上传"],
            ["shbox_text","hbsubmit","tosky.club","来点魔力|来点上传"],
            ["shbox_text","hbsubmit","ptvicomo.net","小象求象草"],
            ["shbox_text","hbsubmit","cyanbug.net","青虫娘 求魔力|青虫娘 求上传|青虫娘 求VIP|青虫娘 求彩虹ID"],
        ];
        var lastGetMOLIDay = GM_getValue(GetMOLIDay);
        if (lastGetMOLIDay === today) {
            console.log("今日已求:"+lastGetMOLIDay);
            return;
        }
        for (var index in getMOLIDayTexts) {
            if(getMOLIDayTexts[index]==null || getMOLIDayTexts[index][2]==null || host.indexOf(getMOLIDayTexts[index][2]) == -1){
                continue;
            }
            var input = getMOLIDayTexts[index][0];
            var sayALL = getMOLIDayTexts[index][3];
            var submit = getMOLIDayTexts[index][1];
            var inputElement=document.getElementById(input);
            var submitElement=document.getElementById(submit);
            if(inputElement==null || submitElement==null){
                continue;
            }
            try{
                var sayArr = sayALL.split("|");
                for (let i = 0; i < sayArr.length; i++) {
                    (function (j) {
                        let say=sayArr[j];
                        let stay=500+2000*j;
                        setTimeout(() => {
                            inputElement.value=say;
                            submitElement.click();
                            console.log(window.location.host+"已喊:" +say);
                        },stay);
                    })(i);
                }
                GM_setValue(GetMOLIDay, today);
            } catch (error) {
                console.log("error:"+error);
            }
        }
    }, 500);
})();