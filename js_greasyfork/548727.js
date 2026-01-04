// ==UserScript==
// @name         学习通等网课帮看，招代理，QQ：1320845373，权威对接
// @namespace    Anubis Ja
// @version      0.2
// @description  超星/学习通自动抢答！
// @author       Anubis Ja
// @match        *://mobilelearn.chaoxing.com/widget/pcpick/stu/index?*
// @supportURL   https://greasyfork.org/zh-CN/scripts/398151/feedback
// @downloadURL https://update.greasyfork.org/scripts/548727/%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%AD%89%E7%BD%91%E8%AF%BE%E5%B8%AE%E7%9C%8B%EF%BC%8C%E6%8B%9B%E4%BB%A3%E7%90%86%EF%BC%8CQQ%EF%BC%9A1320845373%EF%BC%8C%E6%9D%83%E5%A8%81%E5%AF%B9%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/548727/%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%AD%89%E7%BD%91%E8%AF%BE%E5%B8%AE%E7%9C%8B%EF%BC%8C%E6%8B%9B%E4%BB%A3%E7%90%86%EF%BC%8CQQ%EF%BC%9A1320845373%EF%BC%8C%E6%9D%83%E5%A8%81%E5%AF%B9%E6%8E%A5.meta.js
// ==/UserScript==
 
(function() {
    var name = '系统繁忙'; //在此填写你的真实姓名，会在抢答页面显示！
    var time = 1; //监控频率/秒 请勿低于1，否则你的账号将会被超星屏蔽！
    var autoStop = 1; //抢答成功自动暂停。设置为0即可无限检测抢答。
 
    //以下内容除非你懂javascript，否则请勿修改！
    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return (false);
    }
    var courseId = getQueryVariable("courseId");
    var jclassId = getQueryVariable("jclassId");
    var t = 0;
    console.log('监控课程id：' + courseId + ' 班级id：' + jclassId + ' 抢答人姓名：' + name);
    var interval = setInterval(function() {
        t++;
        console.log('监控抢答第 ' + t + ' 次');
        $.ajaxSettings.async = false;
        $.getJSON('/ppt/activeAPI/taskactivelist?courseId=' + courseId + '&classId=' + jclassId, function(json) {
            //console.log(json.activeList)
            for (var i = json.activeList.length - 1; i >= 0; i--) {
                if (json.activeList[i]['activeType'] == 4 && json.activeList[i]['status'] == 1) {
                    $.getJSON('/pptAnswer/stuAnswer?answerId=' + json.activeList[i]['id'] + '&classId=' + jclassId + '&role=&courseId=' + courseId + '&general=&appType=15&stuMiddlePage=1&stuName=' + name);
                    //console.log(json.activeList[i]);
                    if (autoStop == 1) {
                        console.log('抢答成功！监控抢答已结束，如需继续监控请刷新页面。');
                        alert('抢答成功！监控抢答已结束，如需继续监控请刷新页面。');
                        clearInterval(interval);
                    }
                }
            }
        })
    }, time * 1000);
})();
