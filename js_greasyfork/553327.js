// ==UserScript==
// @name         消防网络学院挂课外挂(2025第三期)
// @namespace    https://wy.cfri.edu.cn/
// @version      2.1
// @description  第三期
// @author       王健权
// @match        https://wy.cfri.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wy.cfri.edu.cn
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      风色本花
// @downloadURL https://update.greasyfork.org/scripts/553327/%E6%B6%88%E9%98%B2%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E6%8C%82%E8%AF%BE%E5%A4%96%E6%8C%82%282025%E7%AC%AC%E4%B8%89%E6%9C%9F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553327/%E6%B6%88%E9%98%B2%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E6%8C%82%E8%AF%BE%E5%A4%96%E6%8C%82%282025%E7%AC%AC%E4%B8%89%E6%9C%9F%29.meta.js
// ==/UserScript==
/*
通过定期刷新，来检查视频是否播放完毕
*/
var msk="";
var msk_index=0;
$(document).ready(function(){
    let wechat_url="https://wy.cfri.edu.cn/app-yjgb/wechat/#/study/course/detail/";
    var urls=["1e738246-192c-40a2-8f28-c771439d0c5a","e32a6e67-7558-4762-895b-62fb67a5ed87","e82bafce-d206-4f65-b1a8-f35056010005","4c361c99-b736-4a81-b471-17e3b89f28a9","196fd806-8526-42d5-814d-1c7b66cdf2af","444ece77-a0f0-4df5-a447-8f3019a1ebab","7a3253db-3c2c-49cc-9bb9-97daac2e1a3f"];
    //在顶部添加一个div，用户引导用户
    var welcome_div=$("<div style='width:120px;height:30px;background-color:red;position:absolute;top:5px;left:50px;z-index:9999;line-height:30px;color:white;font-size:10pt;border-radius:10px;text-align:center;'><a href='"+wechat_url+urls[0]+"' style='color:yellow'>自学外挂</a></div>");
    var btn=$("<input type='button' id='mskbtn' value='暂停' style='margin-left:10px;'/>");
    var workdiv=$("<div id='workdiv' style='width:50%;position:absolute;top:15%;left:25%;background-color:#f8f8f8;border-radius:10px;height:15%;text-align:center;font-size:11pt;vertical-align:middle;opacity:0.9'><br><br>自学中.........</div>");
    $("body").append(welcome_div);
    msk=window.setInterval(function(){
        //学习
        autoStudy(urls,wechat_url);
    },1000*5);
});

function autoStudy(urls,wechat_url){
    var url=window.location.href;
    if(url.indexOf("score-detail")!=-1){
        window.history.go(-1);
    }
    for(var i=0;i<urls.length;i++){
        if(url==wechat_url+urls[i]){
            checkStudyStatus(i,urls);
        }
    }
}


/*
检查当前页面学习状态
*/
function checkStudyStatus(current_index,urls){
    var find_item=0;
    var study_list=jQuery(".c-info-cata").find("li");
       for(var i=0;i<study_list.length;i++){
           var temp=study_list.eq(i);
           if(temp.hasClass("finishOn")){
              find_item++;
           }
       }
    console.log("目前播放完成视频："+find_item+"个，剩余："+(study_list.length-find_item-1)+"个");
    if(study_list.length-find_item<=1){
        if(urls.length-current_index!=1){
            temp=current_index+1;
            window.location.href="https://wy.cfri.edu.cn/app-yjgb/wechat/#/study/course/detail/"+urls[temp];
            //window.location.reload();
        }else{
            window.location.href="https://wy.cfri.edu.cn/app-yjgb/wechat/#/profile/mycourse";
        }
    }

}

