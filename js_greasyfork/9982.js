// ==UserScript==
// @name        CSDN自动评论
// @author      King.Sollyu 原作:杨自强
// @namespace   Sollyu
// @description 自动评论,返还下载积分
// @require     http://code.jquery.com/jquery-1.9.0.min.js
// @include     http://download.csdn.net/my/downloads
// @include     http://download.csdn.net/my/downloads/*
// @icon        http://tb.himg.baidu.com/sys/portrait/item/d92f6fd8ad5265626f726ee90f
// @version     2.1
// @downloadURL https://update.greasyfork.org/scripts/9982/CSDN%E8%87%AA%E5%8A%A8%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/9982/CSDN%E8%87%AA%E5%8A%A8%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==
// 2015-05-20.2.1    在Chrome中可用
// 2013-01-25.1.0    CSDN自动评论



//多少时间评论一次，单位：秒
var tTime=65;

// 预定义的评论内容,可按照格式自行添加,注意最后一行后面没有逗号
var contentPL=new Array(
    "很全面,很好用,谢谢分享.",
    "挺不错的资料，谢谢分享.",
    "很全,什么都有了,感谢.",
    "比相关书籍介绍的详细,顶一个.",
    "还行,适合于初级入门的学习.",
    "很好的资料,很齐全,谢谢.",
    "还可以,就是感觉有点乱.",
    "感謝LZ收集,用起來挺方便.",
    "感觉还行,只是感觉用着不是特别顺手.",
    "很有学习价值的文档,感谢.",
    "内容很丰富,最可贵的是资源不需要很多积分.",
    "这个真的非常好,借鉴意义蛮大.",
    "有不少例子可以参考,目前正需要.",
    "下载后不能正常使用.",
    "例子简单实用,但如果再全面些就更好了."
);

var queueList = {};

// css
var  csdnHelperCss=document.createElement('style');
csdnHelperCss.type='text/css';
$(csdnHelperCss).html('.popWindow{position:fixed;z-index:10000;top:10px;left:10px;}.popWindow>span{display:block;text-align:left;color:cyan;text-shadow:0 0 2px white;background-color:#555;box-shadow:-1px -1px 4px gray;margin:5px 0 0 0;padding:00 6px 0 6px;cursor:pointer;font-size: 13px;}');

$('body').prepend(csdnHelperCss);
$('body').prepend('<div class="popWindow"></div>');

//将本页待评论资源自动加入评论队列
$(".btn-comment").each(function(){
    if(this.tagName!="A")
        return;
    var reg=/\/([_a-zA-Z0-9]+)\/([0-9]+)#/;
    var src=$(this).attr('href').match(reg);
    addQueue(src[1],src[2],(new Date()).getTime());
    $(this).parent().html("已加入评论队列");
});

// 若待评论数大于0则提示用户滞留在本窗口
console.debug("本次任务总数--->"+getJsonLength(queueList));
if(getJsonLength(queueList) > 0){
    popWindow("待评论任务数："+getJsonLength(queueList),0);
    popWindow("请保持在本界面，以便进行评价",6000);
    setInterval(searchToPost,tTime*1000);
    searchToPost();
}else{
    popWindow("无待评论任务",0);
}

function getJsonLength(jsonData){
    var jsonLength = 0;
    for(var item in jsonData){
        jsonLength++;
    }
    return jsonLength;
}

// 添加评论队列
function addQueue(owner,sourceID,stamp){
    queueList[stamp] = {owner, sourceID};
    console.log(stamp, queueList[stamp]);
    popWindow('已添加到任务队列,['+owner+','+sourceID+']',2000);
}

// 显示消息
function popWindow(str,delayTime){
    var obj = $('.popWindow').append('<span>'+str+'</span>').children().last();
    if(delayTime>0)
        obj.delay(delayTime).hide(1500,function(){$(this).remove();});
}

function searchToPost(){
    // 查询有没有可以评论的资源
    for (var stamp in queueList){
        var res = queueList[stamp];
        post(res['owner'], res['sourceID'], stamp);
        break;
    }
}
// 发送评论
function post(owner,sourceID,stamp){
    $.ajax({
        type:"get",
        url:"http://download.csdn.net/index.php/comment/post_comment",
        headers:{
            "Referer":"http://download.csdn.net/detail/"+owner+"/"+sourceID,
            "Content-type":"application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With":"XMLHttpRequest"
        },
        data:{
            "content":contentPL[Math.round(Math.random()*(contentPL.length-1))],
            "jsonpcallback":"jsonp"+(new Date()).getTime(),
            "rating":"5",
            "sourceid":sourceID,
            "t":(new Date()).getTime()
        },
        success:function(res){
            var index = res.indexOf("({");
            var data = eval(res.substr(index));
            var resMsg="----";
            console.log(data.succ);
            if(data.succ>0){
                delete queueList[stamp];
                resMsg = '任务成功! 已评论['+owner+','+sourceID+']<br/>-----剩余任务数:' + getJsonLength(queueList);
                console.debug(resMsg);
                popWindow(resMsg,(tTime+20)*1000);
                $('.popWindow').children().each(
                    function(){
                        if(this.innerHTML.indexOf("待评论任务数")>=0) 
                            this.innerHTML=("待评论任务数："+getJsonLength(queueList));
                    });
            }
            else{
                resMsg = '任务评论失败['+owner+','+sourceID+']'+"<br/>----原因:"+data.msg;
                console.debug(resMsg.replace(/<br\/>/,""));
                popWindow(resMsg,60000);
                if(data.msg.indexOf("您已经发表过评论")>=0){
                    delete queueList[stamp];
                }
            }
        }
    });
}