// ==UserScript==
// @name        Create Download Links for HACG
// @namespace   https://greasyfork.org/zh-CN/scripts/7762
// @description 琉璃神社神秘代码转换成下载链接
// @author      天涯倦客
// @supportURL http://t.qq.com/HeartBlade
// @include     http*://www.hacg.*/wordpress/*
// @include     http*://hacg.*/wordpress/*
// @include     http*://www.hacg.*/wp/*
// @include     http*://hacg.*/wp/*
// @include     http://pan.baidu.com/share/*
// @include     http://pan.baidu.com/s/*
// @include     http://www.llss.me/wp/*
// @include     https://www.llss.fun/wp/*
// @include     http://www.llss.fun/wp/*
// @include     https://www.llss.pw/wp/*
// @version     3.08
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7762/Create%20Download%20Links%20for%20HACG.user.js
// @updateURL https://update.greasyfork.org/scripts/7762/Create%20Download%20Links%20for%20HACG.meta.js
// ==/UserScript==
(function(){
//度盘填充提取码
if(/baidu/.test(location.href)&&location.hash.slice(1).length!=0){
	document.querySelector("#accessCode").value=decodeURI (location.hash.slice(1));
	//document.querySelector("#submitBtn").click();
	requestToken();
}
var i;
//防爆补丁
	var feiZao=document.getElementsByTagName("p1");
	var fZLength=feiZao.length;
	if (!!fZLength){
		for (i=0;i<fZLength;i++){
			feiZao[0].parentNode.removeChild(feiZao[0]);
		}
	}
//老司机
	var oldDriver = document.getElementsByClassName('entry-content')[0];
	var regObj={	//用于匹配的正则
	btih:/(?:[^\/=\|])(([a-fA-F0-9]{40})|(\w{32}))/g,
	bdshare:/b?\/s\/(\w{8})(?:\s+(\w{4}))?(?![\">])/g,	//度娘 类型：/s/1i31aCbb  b/s/1i31aCbb  >>>其后非?!xxx
	howfile:/@?(?:HF|howfile)\/file\/(\w{4,10})\/(\w{8,})\/?/gi, //好盘 类型I：@HF/file/61dbeea7/0c7f2f56/  @howfile/file/61dbeea7/0c7f2f56/
	tcn:/\bt\/(\w{7})/g, //t.cn短链接 类型I：t/RZEWYLu
	yyw:/(\/lb\/)?(5lb[a-zA-Z0-9]{8,12})/g,  //115礼包：/lb/5lbeo3p8eh02
	mega:/(?:\.co)?(\.nz\/(#[\w!-]{22,}))/g      //.co.nz/#!AZcSmbJA!Q5ZbtIDoQecZc_3Cmc2v_vMaLFJRO6Ctd7uaWdWKqK0
	//.nz/#F!Cw9HSQCR!GgOIg9e9FNQGSplRDNxWDw
	};
	var linkArr=[]; //用于替换的链接
	//linkArr.btih='<a href="magnet:?xt=urn:btih:$1$2">磁链：$1$2</a>';
	linkArr.btih='';//未定义
	linkArr.baidu="<a href='http://pan.baidu.com/s/$1#$2' target='_blank'>度娘：$1</a> $2";
	linkArr.howf="<a href='http://howfile.com/file/$1/$2/' target='_blank'>好盘：howfile.com/file/$1/$2</a>";
	linkArr.tcn="<a href='http://t.cn/$1' target='_blank'>短链：t.cn/$1</a>";
	linkArr.yyw="<a href='http://115.com/lb/$2' target='_blank'>115礼包:$2</a> ";
	linkArr.mega="<a href='https://mega.co$1' target='_blank'>MEGA网盘:$2</a>";
	var txt=oldDriver.innerHTML.toString();
//磁链
function hashFunc(hash){  //hash操作
	hashWord=hash.match(/^\W*/g)[0];
	hash=hash.replace(/[\s\W]*/g, "").toUpperCase();
	console.log("hash="+hash);
	hashStart=hash.slice(0,2);
	hashEnd=hash.slice(-2);
	return [hashStart,hashEnd,hash,hashWord];
}

	if(regObj.btih.test(txt)){
		var magH=txt.match(regObj.btih);
		for (j=0;j<magH.length;j++){
			linkArr.btih=hashFunc(magH[j])[3]+'<a href="magnet:?xt=urn:btih:'+hashFunc(magH[j])[2]+'" >磁力链接 </a>';
			linkArr.btih+=' →<a href="http://www.torrent.org.cn/Home/Convert/magnet2torrent.html?hash='+hashFunc(magH[j])[2]+'" target="_blank" title="需要先注册登陆">【下载种子】</a>';
			//linkArr.btih+=' <a href="http://www.btaia.com/torrent/detail/hash/'+hashFunc(magH[j])[2]+'" target="_blank" title="支持Base32,可查看种子内容,需要验证码,长期Invalid CAPTCHA token">【种子详情】</a>';

			txt=txt.replace(magH[j],linkArr.btih)
		}
	}

//度娘
		txt=txt.replace(regObj.bdshare,linkArr.baidu);
//好盘
		txt=txt.replace(regObj.howfile,linkArr.howf);
//短链接
		txt=txt.replace(regObj.tcn,linkArr.tcn);
//115
		txt=txt.replace(regObj.yyw,linkArr.yyw);
//mega
		txt=txt.replace(regObj.mega,linkArr.mega);
	
	oldDriver.innerHTML=txt;
	
//手动转换文本框
var oD_box=document.createElement("div");
oD_box.id="oD_box";
oD_box.style="position:fixed;top:10px;right:10px;  width:210px;";
var oD_text=document.createElement("input");
oD_text.id="oD_text";
oD_text.type="text";
oD_text.placeholder="粘贴hash值";
oD_text.title='将自动添加"magnet:?xt=urn:btih:"，去除[]中的内容、非字母数字字符、空格';
var oD_button=document.createElement("button");
oD_button.id="oD_button";
oD_button.type="button";
oD_button.textContent="开车";
oD_button.style="padding:4px 0;  position: relative;  top:-1px";
oD_button.onclick=function (){
	var oD_hash=oD_text.value.replace(/(\[.*\])|[\W_]/g,"");
	if (oD_hash.length!==40&&oD_hash.length!==32){
		oD_link.textContent="";
		oD_link2.textContent="";
		alert("长度错误,请重试");
	}else{
		oD_link.href="magnet:?xt=urn:btih:"+oD_hash;
		oD_link.textContent="磁链";
		oD_link2.href="http://www.torrent.org.cn/Home/Convert/magnet2torrent.html?hash="+oD_hash;
		oD_link2.textContent="种子";
		oD_link2.style="margin-left:20px";
	//	oD_link3.href="http://www.btaia.com/torrent/detail/hash/"+oD_hash;
	//	oD_link3.textContent="详情";
	//	oD_link3.style="margin-left:20px";
	}

};
var oD_link=document.createElement("a");
var oD_link2=document.createElement("a");
var oD_link3=document.createElement("a");
oD_link2.target="_blank";
oD_link3.target="_blank";
oD_box.appendChild(oD_text);
oD_box.appendChild(oD_button);
oD_box.appendChild(oD_link);
oD_box.appendChild(oD_link2);
oD_box.appendChild(oD_link3);
document.body.appendChild(oD_box);
//评论区度娘、115、tcn
	var buDang=document.getElementsByClassName('comment-content');
	for (i in buDang){
		buDang[i].innerHTML=buDang[i].innerHTML.replace(/\b(\w{8})\b(?:\s*(?:<br>|密码:|密码：|pw:|提取码:)?\s*(\w{4}|8酱)?)/gi,linkArr.baidu).replace(regObj.yyw,linkArr.yyw).replace(regObj.tcn,linkArr.tcn);
}

})();