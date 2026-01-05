// ==UserScript==
// @name        Flash Accelerate
// @namespace   fengwn1997@163.com
// @description 开启FlashPlayer硬件渲染加速
// @include     http://*
// @include     https://*
// @exclude     http://www.imdb.com/*
// @exclude     http://www.xiami.com/play*
// @version     1.16
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6479/Flash%20Accelerate.user.js
// @updateURL https://update.greasyfork.org/scripts/6479/Flash%20Accelerate.meta.js
// ==/UserScript==
//创意来自 gpu-accelerated-flash-player 扩展！
//是否有加速效果作者也不知道。
//关于wmode参数的解释：http://helpx.adobe.com/flash/kb/flash-object-embed-tag-attributes.html
//如果你使用的是firefox，可以在about:config将plugins.force.wmode修改(新建)为 gpu 或 direct
//如果你发现平时正常浏览的网页无法正常使用，请优先禁用此脚本以排查问题
//
var run_time_max = 2; //最大运行次数
var wmode_value = 'gpu'; //默认 gpu，可以是 direct。一般不需要更改

var debug = false;
function main(){
	['object','embed'].forEach(function(tagname){
		[].slice.call(document.querySelectorAll(tagname) || []).forEach(function(element){
			//debug?console.log(element):null;
			if( !element || element.type != 'application/x-shockwave-flash' || (element.clientWidth<300 || element.clientHeight<300))
			{
				return;
			}
			else
			{
				debug?console.log(element):null;
				if(tagname == 'object')
				{
					debug?console.log(element.children):null;
					[].slice.call(element.children || []).forEach(function(node){
						if(node && node.name && node.name.toLowerCase() == 'wmode')
						{
							node.parentElement.removeChild(node);
						}
					});
					var e = document.createElement('param');
					e.name = 'wmode';
					e.value = wmode_value;
					element.appendChild(e);
				}
				else
				{
					element.setAttribute('wmode',wmode_value);
				}
				if(!element.getAttribute('fa-sign'))
				{
					element.setAttribute('fa-sign',1);
					element.parentElement.replaceChild(element.cloneNode(true),element);
				}
			}
		});
	});
}

var run_time = 1;
var interval = setInterval(function () {
  console.log('run_time', run_time, location);
  if (run_time == run_time_max) {
    clearInterval(interval);
  }
  run_time += 1;
  main();
  
}, 1500);
