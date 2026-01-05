// ==UserScript==
// @name Video wipe ADs
// @version 9
// @namespace Shuangya
// @author Shuangya,edit by Andy
// @description 去除国内视频网站的广告(修改为仅限youku)
// @include http://v.youku.com/v_show/id*
// @exclude http://www.letv.com/ptv/vplay*
// @exclude http://v.ku6.com/show/*
// @grant GM_xmlhttpRequest
// @grant GM_addStyle
// @grant GM_getResourceText
// @grant GM_getResourceURL
// @require http://libs.baidu.com/jquery/1.11.1/jquery.min.js
// @resource ckjs http://git.oschina.net/sy/shuangya/raw/master/userjs/wipeads/ckplayer.js
// @icon http://tb.himg.baidu.com/sys/portrait/item/0b43e3f1d1c4501a
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/7320/Video%20wipe%20ADs.user.js
// @updateURL https://update.greasyfork.org/scripts/7320/Video%20wipe%20ADs.meta.js
// ==/UserScript==
(function() {
	console.info('Video wipe ADs:start!');
	var sites = [
	//[名称,地址,选择,显示清晰度选择]
	['youku', /v.youku.com\/v_show/, '#player', '#ab_pip'], ['letv', /www.letv.com\/ptv\/vplay/, '#fla_box', '.Player'], ['ku6', /v.ku6.com\/show/, '#kplayer', '.Player']],
	url = window.location.href,
	player = null,
	videoboxid,
	qxboxid,
	hasgq = false,
	hascq = false;
	//添加元素
	//$('body').append("<script>" + GM_getResourceText('http://git.oschina.net/sy/shuangya/raw/master/userjs/wipeads/ckplayer.js') + "<script>");
	GM_xmlhttpRequest({
		method: "GET",
		url: 'http://www.ckplayer.com/ckplayer/6.6/ckplayer.js',
		onload: function(jdata) {
			$('body').append("<script>" + jdata.responseText.replace("1,1,1,1,1,2,0,1,2","1,1,1,1,1,2,0,1,0").replace("cklogo.png","null") + "</script>");
		}
	});
	GM_addStyle('#syqxdiv{backgroundColor:white;padding:2px;font-size:20px;line-height:30px;}#syqxdiv input[type="button"]{border-radius:5px;border:1px solid rgb(221,221,221);background:white;width:60px;height:30px;margin-right:5px;}');
	//判断网站
	console.info('Video wipe ADs:Get site setting');
	console.info('Video wipe ADs:The url is ' + url);
	for (var i = 0,
	len = sites.length; i < len; i++) {
		if (url.match(sites[i][1]) != null) {
			player = $(sites[i][2]);
			qxbox = $(sites[i][3]);
			if (sites[i][2][0] != '#') {
				player.attr('id', 'syplayerbox');
				videoboxid = 'syplayerbox';
			} else {
				videoboxid = sites[i][2].substr(1);
			}
			if (sites[i][3][0] != '#') {
				qxbox.id = 'syqxbox';
				qxboxid = 'syqxbox';
			} else {
				qxboxid = sites[i][3].substr(1);
			}
			console.info('Video wipe ADs:The qxboxid is ' + qxboxid + ',The videoboxid is ' + videoboxid);
			break;
		}
	}
	player.css({
		"background": 'black',
		"color": 'white',
		"text-align": 'center',
		"font-size": '15px'
	});
	var yuanhtml = player.html();
	player.html('<p>播放器加载中，请稍候</p><p>如果出错，请将console(Chrome或Firebug的控制台)中以“Video wipe ADs:”开头的记录发送给作者</p><p>PS：切换清晰度的按钮在附近～找找看</p>');
	console.info('Video wipe ADs:Start Load');
	GM_xmlhttpRequest({
		method: "GET",
		url: 'http://www.flvcd.com/parse.php?kw=' + encodeURIComponent(url),
		overrideMimeType: 'text/html; charset=gb2312',
		onload: function(vdata) {
			console.info('Video wipe ADs:Load Success');
			vdata = vdata.responseText;
			if (vdata.match(/<input type="hidden" name="inf"/i) == null) { //解析失败
				console.info('Video wipe ADs:Fail to Parse video Real url(s)');
				player.innerHTML = yuanhtml;
				return false;
			}
			var burls = vdata.match(/<input type="hidden" name="inf" value="(.*?)"\/>/)[1];
			console.info('Video wipe ADs:Get burl Success');
			var qxdiv = document.createElement('div');
			$('#' + qxboxid).append(qxdiv);
			$(qxdiv).attr('id', 'syqxdiv');
			$(qxdiv).html('<input type="button" onclick="CKobject.getObjectById(\'syplayer\').newAddress(\'{f->' + burls.replace(/\|$/gi, '') + '}\');" value="标清">');
			if (vdata.match(/<b>高清版解析/i) != null) {
				console.info('Video Wipe ADs Log:has GaoQing');
				GM_xmlhttpRequest({
					method: "GET",
					overrideMimeType: 'text/html; charset=gb2312',
					url: 'http://www.flvcd.com/parse.php?format=high&kw=' + encodeURIComponent(url),
					onload: function(gvdata) {
						gvdata = gvdata.responseText;
						var gurls = gvdata.match(/<input type="hidden" name="inf" value="(.*?)"\/>/)[1];
						$(qxdiv).append('<input type="button"  onclick="CKobject.getObjectById(\'syplayer\').newAddress(\'{f->' + gurls.replace(/\|$/gi, '') + '}\');" value="高清">');
						hasgq = true;
					}
				});
			}
			if (vdata.match(/<b>超清版解析/i) != null) {
				console.info('Video wipe ADs Log:has ChaoQing');
				GM_xmlhttpRequest({
					method: "GET",
					overrideMimeType: 'text/html; charset=gb2312',
					url: 'http://www.flvcd.com/parse.php?format=super&kw=' + encodeURIComponent(url),
					onload: function(cvdata) {
						cvdata = cvdata.responseText;
						var curls = cvdata.match(/<input type="hidden" name="inf" value="(.*?)"\/>/)[1];
						$(qxdiv).append('<input type="button"  onclick="CKobject.getObjectById(\'syplayer\').newAddress(\'{f->' + curls.replace(/\|$/gi, '') + '}\');" value="超清">');
						hascq = true;
					}
				});
			}
			console.info('Video wipe ADs:Load Player');
			$('body').append("<script>var flashvars={f:'" + burls.replace(/\|$/gi, '') + "',c:0,v:100,b:0};var params={bgcolor:'#FFF',allowFullScreen:true,allowScriptAccess:'always'};CKobject.embedSWF('http://www.ckplayer.com/ckplayer/6.6/ckplayer.swf','" + videoboxid + "','syplayer','100%','100%',flashvars,params);</script>");
		},
		onerror: function() { //请求失败
			console.info('Video wipe ADs:Error occurs during the process of request');
			player.html(yuanhtml);
			return false;
		}
	});

})();