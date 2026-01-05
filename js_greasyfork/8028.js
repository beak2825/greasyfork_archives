// ==UserScript==
// @name               Baidu.test.doEva
// @name:zh-CN         百度众测任务辅助
// @description        Baidu.test.doEva Help
// @description:zh-cn  百度众测任务-答题按数字键提交(自用版)
// @version            1.2
// @author             Tan Keung
// @match              http://test.baidu.com/crowdtesteva/eva/doEva/eva_id/*
// @grant              GM_xmlhttpRequest
// @icon               "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACoklEQVQ4jZ2T6UuUURSHzz9QRhCpJJVZERUFmVmp7bZYZiUttpiEVliEtCctJtGHPgQGEm1EUbQHUlCBWSI1NbagJfheX3XG1LSmhWL0NTtPH6ZmEulLF86XcznPPb/7O0eksAYprEEK3iKHqpED1Uj+a2TvK2TXC2SHG8lzIVufILkVyKZyJLsMySpF1t1HpLCG/z2ScQ+Rgre9LqzaTj1S0K7VVR0KYKxOtY2jvQAr7iBysLpH0nGUPTvaGBVTp5kZzWobh2mTGzVljldt4/QEpJcgsr8qmPj8qRuAXXltTB7fQE5mC26Xn7hx9cyd4cHt8vcEpN1GZN9rADyNXWxY26y5Oa1668ZXcjJbKC7yAVBc5KO4yIfb5cfr6QoBFt1EZPdLAK5d+sKQgZYmxjUogG0cOjtCsm3jsGrZO1YuadLWlh8BwPxriOysBOC5y09CbANLFzZxt+QbtnHYvKGFvC2t2Mbh2NGPTBpfT0ykwe3yK4DMvYLI9mcAdHfDjatftbjIp7ZxSE326ogoo2NibNYsf6e2cViW6iVtvlcb6gOOyKxLiGx7Gmyzo+MntnFIm+dlZJTR6HDDn1ixuElt4/D44XfltzKZfhGR3Iog4E1VJymzvYwYVMffxdHhhnHDbbIymrHrQlZK4nlENpUDoAqH89t18ACjQweaXoDBA4yOHWbzqPR78Gdl6jlEssuCgKMFHzS8r6WR/SwiwywN71OrEWEWUf0tHdTf0mERhssXvoQA8WcRySoNtuRp7GJLdivJSR7SU5o4cdzHieM+Zk1tJHZ0PRvXN9P2/kdIQtxpRNY9+Hu4FKgEnvwjKntM4sRTiKy+F1iK9BJkyW0k9Say4HrA49mXkZkXkaQLSMJ5ZMo5JP5M4OXYU8iEk/wC6ZkDX3ssK20AAAAASUVORK5CYII="
// @scriptsource       https://greasyfork.org/zh-CN/scripts/8028-baidu-test-doeva
// @homepageURL        https://greasyfork.org/users/9071
// @namespace          https://github.com/crazythq/userscripts
// @downloadURL https://update.greasyfork.org/scripts/8028/BaidutestdoEva.user.js
// @updateURL https://update.greasyfork.org/scripts/8028/BaidutestdoEva.meta.js
// ==/UserScript==


//引入jQuery
if(!$){
    var scriptNode = document.createElement('script');
    scriptNode.src = "http://cdn.staticfile.org/jquery/1.10.2/jquery.min.js";
    //scriptNode.src = "file:///E:/lib/javascript/jquery1.10.2.min.js";
    document.head.appendChild(scriptNode);
}

console.log("Baidu.test.doEva script start.");

var num = '';//key name
//捕获键盘按键
function keyUp(e) {   
    var currKey=0,e=e||event;   
    currKey=e.keyCode||e.which||e.charCode;
    
    /*
    switch(currKey){
        case 49:
            num = 1;
        case 50:
            num = 2;
        case 51:
            num = 3;
        case 52:
            num = 4;
        case 53:
            num = 5;
        case 54:
            num = 6;
        case 55:
            num = 7;
        case 56:
            num = 8;
        case 57:
            num = 9;
        case 48:
            num = 10;
    }*/
    
    var keyName = String.fromCharCode(currKey);   
    console.log("按键码: " + currKey + " 字符: " + keyName);
    
    if(!isNaN(currKey) && (currKey>48 && currKey<=57)){
        num = currKey - 48;
    }
    if(!isNaN(currKey) && (currKey>96 && currKey<=105)){
        num = currKey - 96;
    }
    if(currKey==48 || currKey==96){
        num = 10;
    }
    //console.log("num="+num);
    
    //选择该选项
    $('.mb5:eq('+ ( num -1 ) +')').find('.checkbox_check_no').click();
    
    //店铺经营内容标注
    $('.multi-item:eq('+ ( num -1 ) +')').click();
    
    //enter提交
    if(currKey==13){
        $('#next_eva').click();
    }
}

document.onkeyup = keyUp;//注册按键事件


var question = $('.question-example a:first').html();
if(question){
    //图片对对碰(旅游)
    if( question.indexOf('旅')>0 || question.indexOf('游')>0 ){
        $('.mb5:eq(1)').find('.checkbox_check_no').click();//选2
    }
    //图片对对碰(加盟)
    if( question.indexOf('加盟')>0 ){
        $('.mb5:eq(2)').find('.checkbox_check_no').click();//选3
    }
}

//添加序号
$('.checkbox_check_no').each(function(k,v){
    $(this).parent().before(k+1);
});
$('.multi-item').each(function(k,v){
    //店铺经营内容标注
    //$('.multi-item').attr('item_id', k);
    $(this).children('label').html((k+1)+" "+$(this).children('label').html());
});

$('iframe').height($('iframe').height()+100);//增加iframe高度

$('.mb5:eq(0)').find('.checkbox_check_no').click();//默认选择第一项

$('body').scrollTop($('.pro-content').offset().top);//滚动到底部

//-----------------------------------------------------------------------------

//症状题
var answer = $('.question-example font:eq(1)').html();
if(answer){
    answer = answer.substr(1, answer.length-2);
    var ckly = $('.question-example font:eq(2)');
    if(ckly){
        ckly.html(ckly.html().replace(answer, "<strong><font color='blue'>"+answer+"</font></strong>"));
    }
}
//症状题 end

//网页搜索或浏览行为
var keyword = $('.question_title font:eq(1)').html();
if(keyword){
    $('.pro-do-eva .question:first').before('<font color="red">'+keyword+'</font>')
}
//网页搜索或浏览行为 end

//用户行为题
var keyword = $('.question_title > div font:eq(1) > b').html();
if(keyword){
    var arr_keyword = keyword.substr(1, keyword.length-2).split('');
    if(arr_keyword.length>0){
        var flag = false;
        //console.log(arr_keyword);
        for(var i in arr_keyword){
            flag = true;
            console.log(i+" "+arr_keyword[i]);
            //$('.question-example > textarea').html($('.question-example > textarea').html().replace(new RegExp(arr_keyword[i], "g"), "<strong><font color='blue'>"+ arr_keyword[i] +"</font></strong>"));
        }
        if(flag){
            //$('.question-example').before("<strong><font color='blue'>有</font></strong>");
        }
    }
}
//用户行为题 end
