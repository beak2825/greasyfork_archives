// ==UserScript==
// @name        click_to_play@youtube
// @namespace   click_to_play@youtube
// @namespace   https://greasyfork.org/ja/scripts/9886
// @homepageURL https://greasyfork.org/ja/scripts/9886
// @license     http://creativecommons.org/licenses/by-nc-sa/4.0/
// @description disable autoplay and unload player
// @include     http://*
// @include     https://*
// @exclude     https://www.youtube.com/*
// @author      noi
// @version     1.10
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/9886/click_to_play%40youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/9886/click_to_play%40youtube.meta.js
// ==/UserScript==


/**************************************************************
[about]
Stop youtube video autoplay, and unload the players.
It will display a thumbnail image instead.

youtubeの埋め込み動画を読みこまないように変更し、
代わりにサムネイル画像を表示します。

Firefoxのプラグイン「click-to-play」はHTML5をブロックしないので、
スクリプトを作成。

****************************
References

No Embed Youtube @author eight
https://greasyfork.org/ja/scripts/1590

****************************
history

06/19/2016 - v1.10 一部微調整
06/18/2016 - v1.09 同一ページに複数動画がある場合の指定ミス修正
06/16/2016 - v1.08 サイト側のcssにより動画の位置ずれが生じる場合に対応
07/03/2015 - v1.07 動画iframeの取得エラー時の動作修正
06/07/2015 - v1.06 起動にディレイ追加
05/17/2015 - v1.04 DOM操作削減
05/15/2015 - v1.03 サムネ画像のサイズ修正
05/15/2015 - v1.02 v1.01のバグ修正
05/15/2015 - v1.01 再生ボタンを変更
05/15/2015 - v1.00 release
**************************************************************/

"use strict";
var number = 0;

var xpath = [
	'//iframe[contains(@src,"youtube.com/embed/")]|',
	'//iframe[contains(@src,"youtube.com/v/")]|',
	'//embed[contains(@src,"youtube.com/v/") and not(ancestor::object)]|',
	'//object[./param[contains(@value,"youtube.com/v/")]]',
].join('');

var playButton = '<div style="width:100%;height:100%;background:url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAA8CAMAAADG+c2+AAAAsVBMVEUAAAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAApKSnOzs47OzsAAAD8/Pytra0aGhqSkpKHh4cDAwPh4eFcXFzGxsYxMTH7+/ukpKQSEhLv7+99fX0CAgLb29tQUFD+/v6+vr7m5ub5+fmbm5sNDQ3r6+tycnLV1dVGRkb///+2trYICAj29vZmZmYhISEAAADz8/MgICDz8/P///91kYKsAAAAOnRSTlOZACQBgkZyiwSRTzGHU1Rko+GoiP3Rn8bCmeyy3aX7zZ30vpnpr/7Z7/rKnPK65av+1Zv4tqEy96H2cK1dPgAAARxJREFUeF7N2OlOwkAUR/E/XZdpi4oLKOAGuIGKu/P+D6aN6YifjOkxmd8DnISktPde9VphUCdRrj/Lo6QKQpdpg1mcqoM0zn4GXwbqqDSbwUKA4jvYF6LfBgtBiq+gEcY0wawUpsw+g7FAcU9hKlAaKhAqUC1UpUSoRJFQkXKRfs1t74hld/f22aC1r8MRGWwcHqHBxngCB+30+AQKOqdn51DQmc3hoL2/2IKCztX1DRR0lisq6NzewUG7WD9DQefx4AEKOpdPeNDnn7xYv/n82CxX9F/P55fDbE6/YH3+BIwnPn9G34cjD0YRcFjCxzl84ORH4kqoCl8r8MWHXs3w5ZFfb/kFnD8R8EeMhinV0cD80yEIOVXVG6eqD/g5Xi0pxQ0LAAAAAElFTkSuQmCC\') no-repeat center center;"></div>';

var players = {};

var blockEmbed = function(node){

	var result = document.evaluate(xpath, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

	for(var i=0,j=result.snapshotLength;i<j;i++){
		var ele = result.snapshotItem(i);
		if(ele.hasAttribute('c2p')) continue;

		var url = ele.src;	//iframe or embed
		//object
		if(!url){

			for(var x=0,y=ele.childNodes.length; x<y; x++){
				var param = ele.childNodes[x];
				if(param.nodeName == "PARAM" && param.getAttribute("name") == "movie"){
					url = param.getAttribute("value");
					break;
				}
			}
		}
		if(!url) continue;


		var parent = ele.parentNode;

		var id = url.match(/(embed|v)\/(.+?)(\?|&|$)/)[2];
		var movieUrl = "https://www.youtube.com/watch?v=" + id;

		var src = location.protocol + '//img.youtube.com/vi/' + id + '/mqdefault.jpg';
		var txt = "";


		var eleW = ele.style.width || ele.width || ele.offsetWidth;
		var eleH = ele.style.height || ele.height || ele.offsetHeight;
try{
		eleW = eleW.replace(/(px|em)/i,"");
		eleH = eleH.replace(/(px|em)/i,"");
}catch(e){}
		var tmpId = ele.id;
		var tmpClass = ele.className;

		if(eleH == 0){
			eleW = eleH = 100.111;
			var tmpNum = number;
			txt = 'width:'+ eleW +'px;height:'+ eleH +'px;';
			var tmpTxt = txt;

			ele.onload = function(){
				var hei = this.offsetHeight;
				var wid = this.offsetWidth;
				this.parentNode.removeChild(this);

				var obj = document.getElementById('c2p_thumbnail' + tmpNum);
				obj.height = hei;
				obj.width = wid;

				obj.contentDocument.body.setAttribute("style",obj.contentDocument.body.getAttribute("style").replace(tmpTxt,'width:'+ wid +'px;height:'+ hei +'px;'))
			}
		}else txt = 'width:'+ eleW +'px;height:'+ eleH +'px;';

		var thumbnail = document.createElement("iframe");
		thumbnail.width = eleW;
		thumbnail.height = eleH;


		thumbnail.id = 'c2p_thumbnail' + number;
		playButton = '<body style="' + txt + 'background:url(' + src + ') no-repeat center center ; background-size: 100% 100%;" title="click to play!"  num="' + number + '"></body>'
			+ playButton
			 + '</div>';
		thumbnail.srcdoc = playButton;
		thumbnail.setAttribute('c2p','thum');
		thumbnail.scrolling="no";
		thumbnail.frameborder="no";
		thumbnail.setAttribute('num',number);

		thumbnail.onload = function(){
			var that = this
			var unBlock = function(e){
				var thumb = e.target;
				if(!thumb.tagName != 'body') thumb = thumb.parentNode;
				thumb.removeEventListener('click',unBlock,false);

				var num = thumb.getAttribute('num');

				that.parentNode.replaceChild(players[num],that);
				delete players[num];
			};
			this.id = tmpId;
			this.className = tmpClass;

			var contentDocument = this.contentDocument || this.contentWindow.document;
			contentDocument.body.addEventListener('click',unBlock,false);

		};

		parent.insertBefore(thumbnail,ele);

		ele.setAttribute('c2p','done')
		players[number] = ele;

		if(eleH != 100.111)parent.removeChild(ele);


		number++;
	}
};

var observer = new MutationObserver(function(mutations){
	for(var i=0,j=mutations.length;i<j;i++){
		var m = mutations[i];
		if(m.type != "childList") return;

		for(var x=0,y=m.addedNodes.length;x<y;x++){
			blockEmbed(m.addedNodes[x]);
		}
	}
});
blockEmbed(document.documentElement);
setTimeout(function(){
	
	observer.observe(document.body, {childList: true,subtree: true});
},1000);


var onEventUnload = function(){
	window.removeEventListener("beforeunload", onEventUnload,false);

	observer.disconnect();
	observer = xpath = blockEmbed = null;
};
window.addEventListener('beforeunload',onEventUnload, false);

