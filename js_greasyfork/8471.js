// ==UserScript==
// @name         我的bilibili排行榜脚本
// @version      1.3
// @description  1、排行榜过滤已阅视频
// @author       Zz_子于子乐
// @include      *://www.bilibili.com/ranking
// @include      *://www.bilibili.com/ranking/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @namespace    https://greasyfork.org/users/9579
// @downloadURL https://update.greasyfork.org/scripts/8471/%E6%88%91%E7%9A%84bilibili%E6%8E%92%E8%A1%8C%E6%A6%9C%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/8471/%E6%88%91%E7%9A%84bilibili%E6%8E%92%E8%A1%8C%E6%A6%9C%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
/////////////////////
///<<脚本初始化>>///
///////////////////
var MyRankZz = '<input id="MyRankButton" type="button" style="float:left;background:#00a1d6;color:#fff;border-radius:4px;padding:0 5px;height:25px;font-size:12px;margin-right:5px;margin-top:7px;cursor:pointer;" value="添加我的排行" />'
+ '<div style="float:left;background:#00a1d6;color:#fff;border-radius:4px;padding: 4px 5px;margin-top:1px;position: relative;top: 7px;">'
+ '<input id="MyRankCheck" type="checkbox" style="float:left;line-height:20px;margin-left:5px;cursor:pointer;text-align:center;transition:0.2s all;" />'
+ '<label for="MyRankCheck" style="cursor:pointer;">我的排行过滤</label>'
+ '</div>';
$(MyRankZz).insertAfter(".rank-tab");	//在页面插入控件
var MyRankCheck = localStorage.getItem("MyRankCheck");	//获取过滤参数
if(MyRankCheck && MyRankCheck==1){
    $("#MyRankCheck").attr("checked",true); //设置选项
}
var d = new Date();
var dMon = d.getMonth() + 1;
if(!MyRankCheck && MyRanking!=0){
    localStorage.setItem("MyRankCheck",0);	//初始化参数
    localStorage.setItem("MyRanking"+dMon,"");	//初始化存储
    alert("排行榜脚本初始化成功！\n——bilibili排行榜脚本 by Zz");
    location.reload(); //刷新页面
}
var MyRanking = localStorage.getItem("MyRanking"+dMon);	//获取存储排行
if(!MyRanking && MyRanking!=""){
    localStorage.setItem("MyRanking"+dMon,"");	//添加新一月存储
    alert("又是新的一个月！——bilibili排行榜脚本");
}
///////////////////////////////
//==函数递归等待排行榜加载==//
/////////////////////////////
function loadStart(){
    if($(".dyn_list").html() == '<li class="rank-loading">loading...</li>'){
        console.info("网速慢……只能等");
        setTimeout(function(){
            loadStart();
        },100);
    }else{
        rankShow(0);	//启动排行比较过滤
    }
}

///////////////////////////////
//==排行榜比较·过滤·添加==//
/////////////////////////////
function rankShow(a){
    var rankList = MyRanking.split("｜");	//存储排行分割后存放
    var rankItem = new Array(100);	//当前页面排行
    $(".info .title").each(function(i){
        rankItem[i] = $(this).html();
    });
    //--开始循环比较页面排行与存储排行--//
    for(var n=0;n<100;n++){
        var unRead = 1;	//已阅否?
        for(var m=0;m<rankList.length;m++){
            if(rankItem[n] == rankList[m]){
                unRead = 0;	//已阅～
                if(MyRankCheck==1){
                    $(".rank-list li:eq("+n+")").slideUp(); //隐藏已阅
                }else{
                    $(".rank-list li:eq("+n+")").css("background","#c4e4b3");	//已阅视频过滤后变绿
                }
            }
        }
        if(unRead==1){
            if(a==0){
                $(".rank-list li:eq("+n+")").css("background","#edf2f9");	//未阅视频过滤后变蓝
            }else{
                MyRanking += "｜" + rankItem[n];	//添加未阅
                console.info(rankItem[n]);
            }
        }
    }
    if(a==1){
        localStorage.setItem("MyRanking"+dMon,MyRanking);
        //alert("成功添加当前排行到已阅存储！——bilibili排行榜脚本");
        location.reload();
    }
}
//++点击我的排行过滤++//
$("#MyRankCheck").click(function(){
    if($("#MyRankCheck").is(":checked")){
        MyRankCheck = 1;
        localStorage.setItem("MyRankCheck",1); //存储过滤参数1
        rankShow(0); //点击比较显示排行
    }else{
        localStorage.setItem("MyRankCheck",0); //存储过滤参数0
        location.reload(); //还原直接刷新...偷个懒
    }
});
//++切换各个排行++//
$("#rank_range_tab li,#rank_catalogy_tab li,#rank_menu li").click(function(){
    setTimeout(function(){
        loadStart();
    },200);
});
//++点击添加我的排行++//
$("#MyRankButton").click(function(){
    rankShow(1);
});
/////////////////////
//<<脚本开始加载>>//
///////////////////
loadStart();

