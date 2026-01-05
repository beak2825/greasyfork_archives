// ==UserScript==
// @name        auto mark
// @namespace   华理评选教系统自动评分
// @description 华理评选教系统轻松评分
// @version     1.425
// @include     http://pjb.ecust.edu.cn/pingce/*
// @downloadURL https://update.greasyfork.org/scripts/7146/auto%20mark.user.js
// @updateURL https://update.greasyfork.org/scripts/7146/auto%20mark.meta.js
// ==/UserScript==


//辅助函数
function loadStyle(css){
    if(typeof GM_addStyle!='undefined')    {
        GM_addStyle(css);
    }
	else{
        var heads=document.getElementsByTagName('head');
        if(heads.length>0){
            var node=document.createElement('style');
            node.type='text/css';
            node.appendChild(document.createTextNode(css));
            heads[0].appendChild(node);
        }
    }
}
function $(id){
	'use script';
	if(typeof id != 'undefined'){
		return document.getElementById(id);
	}
}


var b = document.getElementsByTagName('input');
var table = document.getElementsByTagName('table')[1];
var k = 0 , sum = 0;
var a = [b[0]];
for(var i = 0, l = b.length; i < l; i++){
    if(b[i].type == 'radio')    {
        a[++k] = b[i];
    }
}
var LastVote = document.getElementsByName('yq17');
var a = a.splice(0,a.length - LastVote.length);
for (var i = 1, len = a.length, dif = a[1].value - a[0].value; i < len ; i++){
	dif = Math.abs(a[i].value - a[i == 0 ? 0 : i - 1].value) > dif ? dif : Math.abs(a[i].value - a[i - 1].value);
}

var isopen = 'closed';


//添加按钮
var float_window = document.createElement('div');
var float_button = document.createElement('div');
var float_content = document.createElement('div');
float_button.id = 'float_button';
float_window.id = 'float_window';
float_content.id = 'float_content';
float_button.innerHTML = '<';
document.body.appendChild(float_window);
float_window.appendChild(float_button);
float_window.appendChild(float_content);
var box = '<div id = "score"></div>';
    box += '<div>';
    box += '<input type = "button" id = "haoping" value="好评"/>';
    box += '<input type = "button" id = "chaping" value="差评"/>';
	box += '<input type = "button" id = "submit" value="提交"/>';
    box += '</div>';
    box += '<p></p>';
    box += '<div>';
    box += '<input type = "checkbox" id = "noF" checked = true/>';
    box += '<label onclick="document.getElementById(' + ' \'noF\'' + ').click()" style="-moz-user-select:none" onselectstart="return false">不要差ですぅ</label>'
    box += '<input type = "button" id = "goodbtn" value="大于80"/>';
    box += '<div>';
    box += '<input type = "button" id = "suiji" value="随机"/>';
    box += '<label>大于等于</label>';
    box += '<input id = "range_low" class = "range" type="text" maxlength = 3></input>';
    box += '<label>小于等于</label>';
    box += '<input id = "range_upper" class = "range" type="text" maxlength = 3></input>';
	box += '</div>';
	box += '</div>';
float_content.innerHTML = box;
var hpbtn = $('haoping');
var cpbtn = $('chaping');
var randbtn = $('suiji');
var goodbtn = $('goodbtn');
var score = $('score');

var css = "@namespace url(http://www.w3.org/1999/xhtml);";
    css += '#float_window{ background-color:#FCFCFC;width:14px;height:14px;top:20%;right:10px;position:fixed;padding:4px;border:2px;border-radius:4px;box-shadow:0px 0px 8px #dddddd;z-index:9999; }';
    css += '#float_window >*{margin:2px;}';
    css += '#float_window input[type="button"]:not(#submit){border:1px solid #BBBBBB;border-radius:3px;background-color:#FCFCFC;margin:3px;}';
	css += '#float_content{background-color:#f7f7f7;padding:1px;border:1px solid rgb(221,221,221);border-radius:4px;display:none;overflow:hidden; }';
	css += '#float_button{background-color:whitesmoke;width:16px;height:16px;position:absolute;top:0px;right:0px;border:1px solid #BBBBBB;border-radius:4px;text-align:center;cursor:pointer;z-Index:9 }';
	css += '#float_window p{margin:4px;border:1px solid rgba(140, 140, 140, 0.7);}'
    css += '#score{margin:3px;position: relative;left:6px;font-size:14px;cursor:default;}';
    css += 'input.range{width:30px;}';
    css += '#noF{height:12px;}';
    css += '#noF+label{font-size:14px !important;padding-right:10px;}'
	css += '#submit{margin:3px 3px 3px 50px;border:1px solid #BBBBBB;border-radius:3px;background-color:#FCFCFC;}';
loadStyle(css);

float_button.addEventListener('click',showmenu,false);

function showmenu(){
	var floatWindowWidthMax = 220;
	var floatWindowHeightMax = 128;
	var floatWindowWidthMin = 14;
	var floatWindowHeightMin = 14;
	if(isopen == 'closed'){
		float_button.innerHTML = '>';
		float_content.style.display = 'block';
		
		var w_width = floatWindowWidthMin;
		var w_height = floatWindowHeightMin;
		
		var timer = setInterval(function(){
		
			if(w_height < floatWindowHeightMax){
				float_window.style.width = w_width + 'px';
				float_window.style.height = w_height + 'px';
				float_content.style.width = w_width - 8 + 'px';
				float_content.style.height = w_height - 8 + 'px';
				w_width += (floatWindowWidthMax - floatWindowWidthMin) / 100;
				w_height += (floatWindowHeightMax - floatWindowHeightMin) / 100;
			}else{
				clearInterval(timer);
			}
		},5)
		float_window.addEventListener('mouseleave',fadeout,false);
		float_window.addEventListener('mouseenter',fadein,false);
		isopen = 'opened';
	}
	else if (isopen == 'opened'){
		float_window.removeEventListener('mouseleave',fadeout,false);
		float_window.removeEventListener('mouseenter',fadein,false);
		float_button.innerHTML = '<';
		w_width = floatWindowWidthMax;
		w_height = floatWindowHeightMax;
		var timer = setInterval(function(){
			if(w_width > floatWindowWidthMin){
				w_width -= (floatWindowWidthMax - floatWindowWidthMin) / 100;
				w_height -= (floatWindowHeightMax - floatWindowHeightMin) / 100;
				float_window.style.width = w_width + 'px';
				float_window.style.height = w_height + 'px';
				float_content.style.width = w_width - 8 + 'px';
				float_content.style.height = w_height - 8 + 'px';
			}else{
				clearInterval(timer);
			}
		},5)
		isopen = 'closed';
	}
}

function fadeout(){
	var opac = float_window.style.opacity >= 1 ? float_window.style.opacity * 1 : 1;
	var timer = setInterval(function(){
		if(opac > 0.4){
			opac -= 0.1;
			float_window.style.opacity = opac;
		}
		else{
			clearInterval(timer);
		}
	},30)
}
function fadein(){
	var opac = float_window.style.opacity * 1;
	var timer = setInterval(function(){	
		if(opac < 1.0){
			opac += 0.1;
			float_window.style.opacity = opac;
		}
		else{
			clearInterval(timer);
		}
	},30)
}

//评价函数
var noFail = $('noF').checked ? 1 : 0;
score.innerHTML = '分数在' + (noFail ? '60' : '40') + '到100之间';
hpbtn.addEventListener('click',haoping,false);
cpbtn.addEventListener('click',chaping,false);
randbtn.addEventListener('click',suiji,false);
goodbtn.addEventListener('click',function(){
	$('range_upper').value = 100;
	$('range_low').value = 80;
	suiji();
},false);
$('noF').addEventListener('click',function(){
	noFail = $('noF').checked ? 1 : 0;
	score.innerHTML = '分数在' + (noFail ? '60' : '40') + '到100之间';
},false)
$('submit').addEventListener('click',tijiao,false);

function haoping(){
    sum = 0;
    for (var i = 1, l = a.length; i < l - 1; i++)    {
        if(i == 1 ? 1 : (a[i].value * 1 > a[i + 1].value * 1) && a[i].value * 1 > a[i - 1].value * 1){
            a[i].checked = 'checked';
            sum += a[i].value * 1;
        }
    }
    score.innerHTML = '总分：'  + sum;
}

function chaping(){
    sum = 0;
    for (var i = 1, l = a.length; i < l ; i++){
        if(i == l - 1 ? 1 : (a[i].value * 1 < a[i + 1].value * 1) && a[i].value * 1 < a[i - 1].value * 1){
            a[i].checked = 'checked';
            sum += a[i].value * 1;
        }
    }
    score.innerHTML = '总分：'  + sum;
}

function suiji(){
	var upper = $('range_upper').value;
	var low = $('range_low').value;

	upper = parseInt(upper == '' ? 100 : upper);
	low = parseInt(low == '' ? 40 : low);

	var judge_value = judge(upper,low);
	if(judge_value){
		warning(Math.floor(Math.random() * 2 + 1),judge_value);
		$('range_upper').value = '';
		$('range_low').value = '';
		score.innerHTML = '分数在' + (noFail ? '60' : '40') + '到100之间';
	}
	else{
		random(upper,low);
	}
}

function judge(upper,low){
	var sum = 0;
	if(!(upper <= 100 && upper >= 40 && low >= 40 && low <= 100)){return 1;}
	if(low > upper){return 2;}
	if (noFail == 1 && upper < 60) {return 3};
	for (var i = 0; i <= 60/dif; ++i) {
		if(dif > 1 && upper < 40 + dif * i && low > 40 + dif * (i - 1)){
			return 4;
		}
	}
	return 0;
}

function random(upper,low){
	sum = 0;
    for(var j = 0 , l = (a.length - 1) / 4; j < l; j++){
        var index = Math.floor(Math.random() * (4 - noFail) + 1);
        a[4 * j + index].checked = true;
        sum += a[4 * j + index].value * 1;
    }
    var row;
    var line;
    
    while(sum < low || sum > upper){
        row = Math.floor(Math.random() * l);
        for(var i = 1; i < 5; i++){
            if(a[4 * row + i].checked == true) line = i;
        }
        if(sum < low){
            var min = a[4 * row + line].value * 1;
            line = Math.floor(Math.random() * (line - noFail) + 1);
			a[4 * row + line].checked = true;
            sum += a[4 * row + line].value * 1 - min;
        }
        if(sum > upper){
            var max = a[4 * row + line].value * 1;
            line = Math.floor(Math.random() * (5 - line - noFail) + line);
			a[4 * row + line].checked = true;
            sum -= max - a[4 * row + line].value * 1;
        }
    }
    score.innerHTML = '总分：'  + sum;
}

//提交
function tijiao(){
	var submitbutton = new Array;
	for(var i = 0,n = 0,l = b .length;i < l;i++){
		if(b[i].type == 'submit'){
			submitbutton[n++] = b[i];
		}
        
	}
	submitbutton[0].click();
}

//警告
function warning(style,id){
	switch(style){
	case 1:
		switch(id){
		case 1:
			alert('魂淡，都说了是' + (noFail ? '60' : '40') + '到100之间的数字啊o(￣ヘ￣o＃)');
			break;
		case 2:
			alert('魂淡，给我分清大小啊喂Σ(っ °Д °;)っ ');
			break;
        case 3:
        	alert('魂淡，又要低分又不要差不管你了啦ヽ(*。>Д<)o゜');
        	break;
        case 4:
			alert('魂淡，给我把范围扩大啊打不了分啦(￣△￣；) ');
			break;
        	}
		break;
	case 2:
		switch(id){
		case 1:
			alert('要填在' + (noFail ? '60' : '40') + '到100之间的数字哦(●ܫ●)');
			break;
		case 2:
			alert('大小什么的搞错了哦(*￣︿￣)');
			break;
		case 3:
			$('noF').checked = false;
			alert('偷偷摸摸把勾去掉 啊被发现了ε=ε=┏( >_<)┛ ');
			break;
		case 4:
			alert('啊咧这个范围里面不能打分诶 把范围扩大试试╮(￣▽￣")╭ ');
			break;
            }
		break;
	}
}