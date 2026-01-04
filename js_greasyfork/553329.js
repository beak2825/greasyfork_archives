// ==UserScript==
// @name         消防网络学院考试外挂(2025第三期)
// @namespace    https://wy.cfri.edu.cn/
// @version      1.2
// @description  2025第三期（综合救援技术基础）
// @author       王健权
// @match        https://wy.cfri.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sset.org.cn
// @grant        none
// @require      https://code.jquery.com/jquery-1.12.4.js
// @license      nadt1988
// @downloadURL https://update.greasyfork.org/scripts/553329/%E6%B6%88%E9%98%B2%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E8%80%83%E8%AF%95%E5%A4%96%E6%8C%82%282025%E7%AC%AC%E4%B8%89%E6%9C%9F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553329/%E6%B6%88%E9%98%B2%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E8%80%83%E8%AF%95%E5%A4%96%E6%8C%82%282025%E7%AC%AC%E4%B8%89%E6%9C%9F%29.meta.js
// ==/UserScript==
/*
通过定期刷新，来检查视频是否播放完毕
*/
var db;
var db_data;
$(document).ready(function(){
    var study_running=0;
    var exam_url="https://wy.cfri.edu.cn/app-yjgb/wechat/#/activity/exam/answer-paper/";
    var exam_answers=[
        {
            id:"1c1b78ce-fa6d-4715-8f03-a8ed720b493d",//城市轨道交通救援技术
            single:"BDDC",
            multiple:"BCD@ABC",
            choice:"BA"
        },
        {
            id:"155d7894-d640-4553-aaba-2e497ad0f349",//特殊灾害事故处置
            single:"BDCA",
            multiple:"ABCD@ABC",
            choice:"AB"
        },
        {
            id:"21f034bf-4544-475a-ae1c-f29c93c6333e",//USAR（城市搜索与救援）技能建设与风险管理
            single:"ACBC",
            multiple:"ABCDE@ABCDE",
            choice:"BA"
        },
{
            id:"1e53fe9b-900f-4f8d-90dc-e22c694fe8db",//城市搜救协调框架与标记信号系统识别
            single:"AACC",
            multiple:"ABC@ABC",
            choice:"AB"
        },
        {
            id:"6f3f5f91-0c30-4805-b3b3-4bbb6bbd580a",//水域救援能力提升的实践与思考
            single:"CDBB",
            multiple:"ABD@ACD",
            choice:"BB"
        },
        {
            id:"0f031f41-e181-4360-ae1a-f4fe952a747b",//救援指挥系统概述与实战应用
            single:"CBCB",
            multiple:"ABC@AB",
            choice:"AB"
        },
        {
            id:"9f8b0976-712f-4a32-922e-5aa42afe4ddf",//城市综合体火灾扑救技术
            single:"CABB",
            multiple:"ABC@AC",
            choice:"AB"
        },
    ];
    //在顶部添加一个div，用户引导用户
    var welcome_div=$("<div id='welcome_div' style='width:120px;;height:30px;background-color:green;position:absolute;top:40px;left:50px;z-index:9999;line-height:30px;color:white;font-size:10pt;border-radius:10px;text-align:center;'><a href='https://wy.cfri.edu.cn/app-yjgb/wechat/#/home/course?homeConfigId=0c179aa1-5a39-4dae-afea-aebb702ae196&name=在线自学&comeFrom=home&icon=false' style='color:yellow'>考试外挂入口</a></div>");
    var checkdiv=$("<div id='getAnswer' style='width:120px;;height:30px;background-color:green;position:absolute;top:40px;left:185px;z-index:9999;line-height:30px;color:white;font-size:10pt;border-radius:10px;text-align:center;'><a href='javascript:void(0)' style='color:yellow'>获取答案</a></div>");
    $("body").append(checkdiv);
    $("body").append(welcome_div);
    $("#getAnswer").click(function(){
        var url=window.location.href;
        if(url.indexOf("answer-paper")!=-1){
            autoExam(exam_answers,exam_url);
        }else{
            alert("请选择进入考试页面");
        }
    });
});
//indexedDB 数据库操作
function getDB(){
    var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
    if(!indexedDB) {
        console.log("你的浏览器不支持IndexedDB");
        return;
    }
    var requestDB = indexedDB.open('localforage', 2);
    requestDB.onsuccess = function (e) {
        db = e.target.result;
        console.log('数据库打开成功');
        getData();
    };
    requestDB.onerror = function (event) {
        console.log('数据库打开报错');
    };
}

function getData(){
    var transaction = db.transaction(["keyvaluepairs"]) // 事务
    var objectStore = transaction.objectStore("keyvaluepairs") // 仓库对象
    var request = objectStore.get("answer_records");
    request.onerror = function(event) {
        console.log('事务失败')
    }
    request.onsuccess = function(event){
        db_data=request.result;
        updateDB();
    }
}

function updateDB(){
    var records=db_data.records;
    for(var i=0;i<records.length;i++){

    }
    //BBDDABBC
    //ABCD@BCD@ABCD
    var id="answer_records";
    var _data={
        examRecordId:db_data.examRecordId,
        lastCacheTime:db_data.lastCacheTime,
        records:records
    };
    var transaction = db.transaction(["keyvaluepairs"],'readwrite') // 事务
    var objectStore = transaction.objectStore("keyvaluepairs") // 仓库对象
    var request = objectStore.get("answer_records");
    request.onsuccess = function() {
        const objectStoreUpdate = objectStore.put(_data,id)
        objectStoreUpdate.onsuccess = function (e) {
            console.log('update success')
        }
    }
    request.onerror = function() {
        console.log('数据更新失败')
    }
}

function autoExam(exam_answers,exam_url){
    var url=window.location.href;
    var indexs=0;
    for(var i=0;i<exam_answers.length;i++){
        console.log(exam_url+exam_answers[i].id);
        if(url==exam_url+exam_answers[i].id){
            var single_answer=exam_answers[i].single;
            var _multiple_answer=exam_answers[i].multiple;
            var multiple_answer=_multiple_answer.split("@");
            var chioce_answer=exam_answers[i].choice;
            var exambody=$(".type-body");
            //单选
            for(var s=0;s<single_answer.length;s++){
                var _answer=convertWordToInt(single_answer[s]);
                $("#rad"+s+_answer).parent().css("color","red");
                $("#rad"+s+_answer).parent().append("[正确答案]");
                $("#rad"+s+_answer).click();
            }
            //多选
            for(s=0;s<multiple_answer.length;s++){
                var temp=multiple_answer[s];
                for(var t=0;t<temp.length;t++){
                    _answer=convertWordToInt(temp[t]);
                    $("#che"+s+_answer).parent().css("color","red");
                    $("#che"+s+_answer).parent().append("[正确答案]");
                }
            }
            //判断
            for(s=0;s<chioce_answer.length;s++){
                if(chioce_answer[s]=="A"){
                    temp="01";
                }else{
                    temp="02";
                }
                $("#opi"+s+temp).parent().css("color","red");
                $("#opi"+s+temp).parent().append("[正确答案]");
                $("#opi"+s+temp).click();
            }
            break;
        }
        indexs++;
    }
    if(indexs==exam_answers.length){
        alert("暂未找到考试答案，请刷新或者稍后重试！！！");
    }
}

function convertWordToInt(code){
    switch(code){
        case "A":return 0;
        case "B":return 1;
        case "C":return 2;
        case "D":return 3;
        case "E":return 4;
    }
}