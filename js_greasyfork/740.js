// ==UserScript==
// @name        bili_fix_player
// @namespace   bili
// @description B站播放器增强脚本，下载视频，可使用另外两种H5播放器，可弹窗播放等
// @include     /^.*\.bilibili\.(tv|com|cn)\/(video|search|sp).*$/
// @include     /^.*bilibili\.kankanews\.com\/(video|search|sp).*$/
// @include     /http://www.bilibili.com/(#page=*)?/
// @include     http://www.bilibili.com/bangumi/*
// @include     http://bangumi.bilibili.com/anime/v/*
// @include  	  http://search.bilibili.com*
// @version     4.0.3
// @require http://static.hdslb.com/js/jquery.min.js
// @require https://greasyfork.org/scripts/19694-abplayer/code/ABPlayer.js?version=125788
// @require https://greasyfork.org/scripts/19695-commentcorelibrary/code/CommentCoreLibrary.js?version=125789
// @require http://static.hdslb.com/js/md5.js
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       unsafeWindow
// @author     绯色
// @downloadURL https://update.greasyfork.org/scripts/740/bili_fix_player.user.js
// @updateURL https://update.greasyfork.org/scripts/740/bili_fix_player.meta.js
// ==/UserScript==
/**
出现无法播放情况先关闭自动修复

RE2：v4.0.3版新增功能[20160912]：
1：修复视频源API获取问题！
2：移除略为鸡肋的弹窗功能
3：由于B站现在自带HTML5播放器，本脚本的作用会越来越小，更新可能慢
4：博主拖延症MAX233333

v4.0.2版说明[20160607]：
1：祝君高考成功！
2：修复弹窗开启关闭故障，原因：博主把参数名更换，然后有一个参数是play忘记改成player
3：脚本存储改回原来的GM存储，原因：localStorage在跨域的时候（比如B站二级域名）都会导致脚本存储不统一
4：增加对bangumi新番页面的支持，至于弹窗功能，是个大坑，很少人需要，故此页面不再增加弹窗功能
5：增加小型播放器与其他功能组合的选项

v4.0.1版新增功能[20160530]：
1：自动网页全屏、默认关闭弹幕（已经删除），来自火狐吧谷歌卫士的bilibili_autowide脚本、修复appkey失效
2：增加一个ABP-HTML5播放器，来自脚本https://greasyfork.org/zh-CN/scripts/19696-bili-html5
3：修改脚本存储位置为localStorage，清理cookie会导致存储丢失
B站官方的弹幕播放器摘自http://tieba.baidu.com/p/4355490187谷歌卫士
license by bangumi.ga

*/
(function() {
	//初始化 init
	if (GM_getValue("bfp_config") ==undefined) {
		var _config = {
			'init' : 1,
			'compatible_360' : 0, //360兼容
			'version' : 0, //版本号
			'enable' : 1,
			'fix_type' : 0, //按需修复;强制修复
			'pagebox_display_mode' : 0,
			'pagebox_show_secret' : 0,
			'window_player_left_position' : 100, //初始化播放器外框位置
			'window_player_width' : 950, //初始化播放器宽高
			'window_player_height' : 480,
			'flash_player_auto_wide' : 0, //自动宽屏-来自牙刷科技冻猫
			'flash_player_auto_focus' : 1, //自动定位播放器--来自火狐吧友
			'enable_window_player' : 0, //视频弹窗功能-ajax重新渲染会导致渲染卡顿
			'flash_player_showComments' : 1, //默认弹幕显示-来自贴吧谷歌卫士
			'flash_player_auto_fullwindow' : 0, //自动网页全屏-来自谷歌卫士
		};
		GM_setValue('bfp_config', JSON.stringify(_config));
	}

	//欢迎屏幕
	var version = '4.0.3';
	var local_version = get_bfp_config('version');
	if (version != local_version) {
		alert('感谢使用Bili Fix Player版本号v4.0.3版RE2：v4.0.3版新增功能[20160912]：\n\
1：修复视频源API获取问题！\n\
2：移除略为鸡肋的弹窗功能\n\
3：由于B站现在自带HTML5播放器，本脚本的作用会越来越小，更新可能慢\n\
4：博主拖延症MAX233333');
		set_bfp_config('version', version);
	}
	/**
	数据存储IO
	 */
	function get_bfp_config(key) {
		//console.log(JSON.parse(localStorage.getItem("bfp_config"))[key]);
		//return JSON.parse(localStorage.getItem("bfp_config"))[key];
		//console.log(GM_getValue("bfp_config"));
		return JSON.parse(GM_getValue("bfp_config"))[key];
		
	}

	function set_bfp_config(key, value) {
		//var current_config = JSON.parse(localStorage.getItem("bfp_config"));
		var current_config = JSON.parse(GM_getValue("bfp_config"));
		current_config[key] = value;
		//console.log(current_config);
		//localStorage.setItem('bfp_config', JSON.stringify(current_config));
		GM_setValue('bfp_config', JSON.stringify(current_config));
		return true;
	}
	/**
	-------------------------------用户界面GUI View-------------------------------------
	 */
	//函数，插入可视化操作视图

	function insert_html(type, mode) {
		var enable = get_bfp_config('enable') ? '已打开' : '已关闭';
		switch (get_bfp_config('fix_type')) {
		case 2:
			var fix_type = '强制默认B站播放器[与其他功能组合]';
			break;
		case 3:
			var fix_type = '小型B站FLASH播放器[兼容火狐魔镜、与其他功能组合]';
			break;
		case 4:
			var fix_type = '原版B站HTML5弹幕播放器[谷歌卫士提供]';
			break;
		case 5:
			var fix_type = 'ABP-HTML5播放器[BY颜太虾]';
			break;
		default:
			var fix_type = '按需替换[替换非B站播放器,此时自动宽屏功能无效]';
		}
		var display = get_bfp_config('pagebox_display_mode') ? '悬浮' : '默认不悬浮';
		var harm = get_bfp_config('pagebox_show_secret') ? '和谐娘打酱油中' : '默认[和谐娘和谐中]';
		var compatible_360 = get_bfp_config('compatible_360') ? '已打开' : '已关闭';
		var flash_player_auto_focus = get_bfp_config('flash_player_auto_focus') ? '已打开自动聚焦播放器' : '已关闭自动聚焦播放器';
		var flash_player_auto_wide = get_bfp_config('flash_player_auto_wide') ? '已打开自动宽屏' : '已关闭自动宽屏';
		var enable_window_player = get_bfp_config('enable_window_player') ? '已打开弹窗功能' : '已关闭弹窗功能';
		var flash_player_showComments = get_bfp_config('flash_player_showComments') ? '已默认打开弹幕' : '已默认关闭弹幕';
		var flash_player_auto_fullwindow = get_bfp_config('flash_player_auto_fullwindow') ? '已默认网页全屏' : '已关闭网页全屏';
		var div = '<li class="m-i home" id="bili-fix-player-installed"><a class="i-link"><em style="color:red;font-weight:bold">脚本</em></a><div >\
															<ul class="i_num i_num_a blborder" id="bili_fix_script">\
															<li><a target="_blank" href="http://bangumi.ga">B站播放器增强脚本V4.0.2:©妖夏&&百度火狐吧出品</a><em></em></li>\
															<li><a target="_blank" href="http://bangumi.ga/361.html">若无限小电视则尝试关闭修复-BUG反馈</a><em></em></li>\
															<li><a><b>360</b>浏览器兼容[非360勿开]:<bl id="init360" class="bfpbtn">' + compatible_360 + '</bl></a><em></em></li>\
															<li><a><b>开启修复</b>(修改后请刷新页面):<bl id="bili_fix" class="bfpbtn">' + enable + '</bl></a><em></em></li>\
															<li><a><b>修复类型</b>选择:<bl id="fix-type" class="bfpbtn">' + fix_type + '</bl></a><em></em></li>\
															<li><a>视频页<b>自动聚焦</b>到播放器位置:<bl id="auto-locate" class="bfpbtn">' + flash_player_auto_focus + '</bl></a><em></em></li>\
															<li><a>播放器<b>自动宽屏</b>[自动切换成强制修复]:<bl id="auto-wide" class="bfpbtn">' + flash_player_auto_wide + '</bl></a><em></em></li>\
															<li><a>FLASH播放器<b>网页全屏</b>[自动切换成强制修复]:<bl id="flash_player_auto_fullwindow" class="bfpbtn">' + flash_player_auto_fullwindow + '</bl></a><em></em></li>\
															<li><a>评论区<b>分页导航</b>:<bl id="pagebox-display" class="bfpbtn">' + display + '</bl></a><em></em></li>\
															<li><a>评论区<b>和谐娘</b>:<bl id="pagebox-harm" class="bfpbtn">' + harm + '</bl></a><em></em></li>\
															<li><a id="bili_set_status"><bl class="bfpbtn font">~窝似状态栏~⁄(⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄</bl></a><em></em></li>';
		if (mode == 'video_page') { //视频页面专有的设置
			div += '<li><a>本页视频源:<bl style="color:#F489AD">' + type + '</bl></a><em></em></li>\
															<li><a class="font">视频下载[点击后,会产生分段列表,然后点击分段列表即可]</a><div class="m_num" id="av_source" cid="">\
															<a  id="hd_av_download">高清[原画]</a>\
															<a  id="ld_av_download">手机[720P]</a>\
															<div id="HD-Down" class="m_num"></div>\
															</div><em></em></li>\
															<li><a id="down_cid_xml" target="_blank">弹幕下载</a><em></em></li>'; //<li><a>FLASH播放器<b>默认弹幕显示</b>[自动切换成强制修复]:<bl id="flash_player_showComments" class="bfpbtn">' + flash_player_showComments + '</bl></a><em></em></li>
		}
		//															<li><a><b>弹窗播放</b>功能[如果卡顿请关闭]:<bl id="window_play" class="bfpbtn">' + enable_window_player + '</bl></a><em></em></li>
		div += '</ul>\
								</div>';
		$('.m-i.home').prop('outerHTML', div);
		//下载高清
		$('#hd_av_download').click(function () {
			download_bili_av('HD');
		});
		//下载渣画质
		$('#ld_av_download').click(function () {
			download_bili_av('LD');
		});
		//设置
		var event_control = {
			Listener : function (selector, config_val, notice1, notice2) {
				$(selector).click(function () {
					event_control.Control(config_val, selector, notice1, notice2);
				});
			},
			Control : function (config_val, selector, notice1, notice2) {
				var notice = 1;
				var other_lock = get_bfp_config('flash_player_auto_wide') || !get_bfp_config('flash_player_showComments') || get_bfp_config('flash_player_auto_fullwindow');
				if (config_val == 'fix_type') {
					if (other_lock) {
						ac_alert('warn', '当【自动宽屏】或【自动网页全屏】或者【自动关闭弹幕】任意一个或以上功能打开时，替换模式只能为FLASH播放器！', 6000);
						var notice = 0;
						if(get_bfp_config('fix_type')==3){
						set_bfp_config('fix_type', 2);
						var j='现在替换为大型B站FLASH播放器！';
						ac_alert('success', j, 6000);
						}else{
						set_bfp_config('fix_type', 3);
						var j='现在替换为小型B站FLASH播放器！';
						ac_alert('success', j, 6000);
						}
						$(selector).html(j);
						$(selector).toggleClass("active");
					} else {
						if (get_bfp_config('fix_type') >= 5 || typeof(get_bfp_config('fix_type')) == 'undefined') { //超过4自动复位成按需替换
							set_bfp_config('fix_type', 1);
						} else {
							set_bfp_config('fix_type', get_bfp_config('fix_type') + 1);
						}
						var s = '当前设置为-';
						switch (get_bfp_config('fix_type')) {
						case 2:
							s += '强制默认B站FLASH播放器[与其他功能组合]';
							break;
						case 3:
							s += '小型B站FLASH播放器[兼容火狐魔镜、与其他功能组合]';
							break;
						case 4:
							s += '原版B站HTML5弹幕播放器[谷歌卫士提供]';
							break;
						case 5:
							s += 'ABP-HTML5播放器';
							break;
						default:
							s += '按需替换[替换非B站播放器,此时自动宽屏等其他组合功能均无效]';
						}
					}
				} else {
					get_bfp_config(config_val) ? set_bfp_config(config_val, 0) : set_bfp_config(config_val, 1);
					if ((get_bfp_config('flash_player_auto_wide') || !get_bfp_config('flash_player_showComments') || get_bfp_config('flash_player_auto_fullwindow'))&&get_bfp_config('fix_type')!=3){
					set_bfp_config('fix_type', 2);
					}
						
					var s = get_bfp_config(config_val) ? notice1 : notice2;
				}
				if (notice) {
					$(selector).html(s);
					$(selector).toggleClass("active");
					var suf_str = ['←◡←', '⁄(⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄', '╮(￣▽￣)╭', '▔▽▔ ', '^∇^', '￣ω￣', '・-・', ' ﾟДﾟ', '>▽<', '｀へ´', '>д<', '・∀・', '≧Д≦', 'T.T', '￣～￣', '_(:3」∠)_'];
					$('#bili_set_status .bfpbtn').html('已更改,刷新生效' + suf_str[random(0, 15)] + '');
					$('#bili_set_status .bfpbtn').toggleClass('notice');
					ac_alert('normal', s, 3000);
				}
			}
		};
		//随机区间
		function random(min, max) {
			return Math.floor(min + Math.random() * (max - min));
		}
		//监听修复按钮
		event_control.Listener('#bili_fix', 'enable', '已打开自动修复', '已关闭自动修复');
		//监听评论分页功能显示切换
		event_control.Listener('#pagebox-display', 'pagebox_display_mode', '已设置评论分页悬浮', '已设置评论分页默认[取消悬浮]');
		//监听评论和谐娘功能切换
		event_control.Listener('#pagebox-harm', 'pagebox_show_secret', '已设置和谐娘打酱油中', '已设置默认[和谐娘和谐中]');
		//360火星
		event_control.Listener('#init360', 'compatible_360', '360兼容已打开,请刷新', '360兼容已关闭，请刷新');
		//自动定位播放器
		event_control.Listener('#auto-locate', 'flash_player_auto_focus', '自动定位播放器已打开,请刷新', '自动定位播放器已关闭，请刷新');
		//自动宽屏
		event_control.Listener('#auto-wide', 'flash_player_auto_wide', '自动宽屏已打开', '自动宽屏已关闭');
		//修复模式
		event_control.Listener('#fix-type', 'fix_type', '', '');
		//弹窗播放功能
		event_control.Listener('#window_play', 'enable_window_player', '当前打开弹窗播放功能,请刷新', '当前关闭弹窗播放功能,请刷新');
		//默认弹幕显示
		event_control.Listener('#flash_player_showComments', 'flash_player_showComments', '当前已默认打开弹幕,请刷新', '当前已默认关闭弹幕,请刷新');
		//自动网页全屏
		event_control.Listener('#flash_player_auto_fullwindow', 'flash_player_auto_fullwindow', '当前已默认网页全屏,请刷新', '当前已关闭网页全屏,请刷新');
	}

	//弹窗播放器
	var window_player = {
		init : function (aid, cid) {
			this.width = get_bfp_config('window_player_width');
			this.height = get_bfp_config('window_player_height');
			this.wide = '';
			if (get_bfp_config('flash_player_auto_wide') == 1)
				this.wide = '&as_wide=1';
		},
		fix_letv : function (aid, cid) {
			window_player.init(aid, cid);
			ac_alert('info', '修复乐视专用弹窗播放中....', 3000);
			return '<embed id="window-player" class="player" allowfullscreeninteractive="true" pluginspage="http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash" allowscriptaccess="always" rel="noreferrer" flashvars="cid=' + cid + '&aid=' + aid + this.wide + '" src="https://nightlyfantasy.github.io/Bili_Fix_Player/biliplus/player.swf" type="application/x-shockwave-flash" allowfullscreen="true" quality="high" wmode="window" height="' + this.height + '" width="' + this.width + '">';
		}
	};

	//下载

	function download_bili_av(type) {
		if ($('#av_source').attr('cid') == '') {
			//alert('错误，请再试一次，多次错误请报修');
			ac_alert('info', '错误，请再试一次，多次错误请报修....', 3000);
		} else {
			var cid = $('#av_source').attr('cid');
			if (type == 'HD') {
				if (!$('#HD-Down').attr('HD')) {
					ac_alert('info', '正在解析高清下载地址....', 3000);
					var params='appkey=85eb6835b0a1034e&cid=' + cid + '&otype=json&platform=android&quality=3&type=mp4';
					var sign=hex_md5(params + '2ad42749773c441109bdc0191257a664');
					var url = 'http://interface.bilibili.com/playurl?'+params+'&sign='+sign;
					GM_xmlhttpRequest({
						method : 'GET',
						url : url,
						synchronous : false,
						onload : function (responseDetails) {
							if (responseDetails.status == 200) {
								var content = responseDetails.responseText;
								var c = eval('(' + content + ')');
								var durl = c.durl;
								if (typeof(durl) == 'undefined') {
									ac_alert('error', 'bili脚本提示：API返回错误：api调用失败，无法下载....', 3000);
								} else {
									for (var i in durl) {
										if (durl[i]['url'] != 'undefined')
											insert_download_button('HD', durl[i]['url'], parseInt(i) + 1);
									}
								}
							}
						}
					});
				} else {
					ac_alert('warn', '已经解析过<高清>下载地址....', 3000);
				}
			} else {
				if (!$('#HD-Down').attr('LD')) {
					ac_alert('info', '正在解析手机良心画质[最大720P]下载地址....', 3000);
					var params='appkey=85eb6835b0a1034e&cid=' + cid + '&otype=json&platform=android&quality=3&type=mp4';
					var sign=hex_md5(params + '2ad42749773c441109bdc0191257a664');
					var url = 'http://interface.bilibili.com/playurl?'+params+'&sign='+sign;
					GM_xmlhttpRequest({
						method : 'GET',
						url : url,
						synchronous : false,
						onload : function (responseDetails) {
							if (responseDetails.status == 200) {
								var content = responseDetails.responseText;
								var c = eval('(' + content + ')');
								var durl = c.durl;
								if (typeof(durl) == 'undefined') {
									ac_alert('error', 'bili脚本提示：API返回错误：api调用失败，无法下载....', 3000);
								} else {
									for (var i in durl) {
										if (!isNaN(i)) { //擦，遍历这个数组居然跑出多两个bsearch和binsert字段，明明是数字，处理掉
											var url = durl[i]['url'];
											insert_download_button('LD', url, parseInt(i) + 1);
										}
									}
								}
							}
						}
					});
				} else {
					ac_alert('warn', '已经解析过<手机良心画质[最大720P]>下载地址....', 3000);
				}
			}
		}
	}
	//函数，插入下载按钮 20141031 接口更换成json

	function insert_download_button(type, url, count) {
		if (type == 'HD') {
			$('#HD-Down').append('<a href="' + url + '" target="blank">高清分段<bl style="color:purple;display:inline">' + count + '</bl></a>');
			$('#HD-Down').attr('HD', '1');
		} else {
			$('#HD-Down').append('<a href="' + url + '" target="blank">720P分段<bl style="color:purple;display:inline>' + count + '</bl></a>');
			$('#HD-Down').attr('LD', '1');
		}
	}

	/**
	-------------------------------函数 Model-------------------------------------
	 */
	//函数，替换播放器

	function Replace_player(aid, cid, div, page, type) {
		var wide = '';
		var w = 0;
		if (get_bfp_config('flash_player_auto_wide') == 1) {
			var wide = '&as_wide=1'; //自动宽屏
			var w = 1;
		}
		if (type) {
			var width = '1160px';
			var height = '650px'; //类型1在视频页面。宽度高度固定不变
			if (get_bfp_config('flash_player_auto_fullwindow')) {
				var width = '';
				var height = '';//600px
			}
		} else {
			var width = get_bfp_config('window_player_width') + 'px';
			var height = get_bfp_config('window_player_height') + 'px'; //弹窗模式，类型0，宽度高度是自己设置的
		}
		//console.log(width,height);
		switch (get_bfp_config('fix_type')) {
		case 2:
			$(div).html('<iframe id="bofqi_embed" class="player" src="https://secure.bilibili.com/secure,cid=' + cid + '&amp;aid=' + aid + wide + '" scrolling="no" border="0" framespacing="0" onload="window.securePlayerFrameLoaded=true" frameborder="no" style="width:' + width + ';height:' + height + '"></iframe>');
			fix_player_fullwin.fix_page();
			if (type && get_bfp_config('flash_player_auto_fullwindow')) {
				setTimeout(function () {
					unsafeWindow.player_fullwin(1);
				}, 6000);
			}
			ac_alert('normal', '正在强制替换->[强制默认B站播放器[与其他功能组合]]', 000);
			break;
		case 3:
			$(div).html('<embed class="player" quality="high" allowfullscreen="true" allowscriptaccess="always" type="application/x-shockwave-flash" src="https://static-s.bilibili.com/play.swf" flashvars="cid=' + cid + '&aid=' + aid + wide + '" allowfullscreeninteractive="true" pluginspage="http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash" style="width:100%;height:100%;" id="bofqi_embed">');
			$(div).css({
				width : width.replace('px',''),
				height : height.replace('px','')
			});
			//fix_player_fullwin.fix_page();
			if (type && get_bfp_config('flash_player_auto_fullwindow')) {
				setTimeout(function () {
					unsafeWindow.player_fullwin(1);
				}, 6000);
			}
			ac_alert('normal', '正在强制替换->小型B站FLASH播放器[兼容火狐魔镜、与其他功能组合]', 3000);
			break;
		case 4:
			html5_cm_play(aid, cid, div, 1, page, width, height, type);
			window.location.hash = "page=" + page;
			//$(div).css('height', "600px");
			ac_alert('normal', '正在强制替换->原版B站HTML5弹幕播放器[谷歌卫士提供]', 3000);
			break;
		case 5:
			html5_cm_play(aid, cid, div, 0, page, width, height, type);
			ac_alert('normal', '正在强制替换->ABP-HTML5播放器', 3000);
			break;
		default:
			if (div == '#bofqi') { // $(div).html().match
				var need_replace_player = (/static\.hdslb\.com\/play\.swf|secure\.bilibili\.com\/secure,cid=/).test($(div).html());
			}
			if (!need_replace_player || div == '#player_content #bofqi') {
				$(div).html('<iframe class="player" src="https://secure.bilibili.com/secure,cid=' + cid + '&amp;aid=' + aid + wide + '" scrolling="no" border="0" framespacing="0" onload="window.securePlayerFrameLoaded=true" frameborder="no" height="' + height + '" width="' + width + '" style="width:' + width + ';height:' + height + '"></iframe>');
				fix_player_fullwin.fix_page();
				ac_alert('normal', '正在按需替换->[替换非B站播放器,此时自动宽屏功能无效]', 3000);
			}
		}
	}

	//特殊！当用户不能登录的情况下获取cid，途径，从http://www.bilibilijj.com/
	function special_get_cids(aid, page) {
		GM_xmlhttpRequest({
			method : 'GET',
			url : 'http://www.bilibilijj.com/video/av' + aid,
			synchronous : false,
			onload : function (responseDetails) {
				if (responseDetails.status == 200) {
					var Content = responseDetails.responseText;
					var patt = /<span class='Width-2 Box PBox' data-cid='(\d+)' data-p='\d+'>/g;
					var result;
					var arr = new Array();
					while ((result = patt.exec(Content)) != null) {
						arr.push(result[1]);
					}
					if (arr.length == 0) {
						ac_alert('error', 'bili脚本提示：特殊API返回错误，无法继续执行脚本', 5000);
					} else {
						ac_alert('success', '请求特殊api成功重构播放器', 3000);
						var div = '';
						for (var i in arr) {
							div += '<a href="/video/av' + aid + '/index_' + (parseInt(i) + 1) + '.html">' + (parseInt(i) + 1) + 'P</a>';
						}
						$('div.b-page-body').html('<div class="main-inner"><div id="heimu"></div><div class="viewbox"> <div class="alist"><div class="alist-content clearfix" id="alist">' + div + '</div></div>    </div>    </div><div class="player-wrapper"><div class="scontent" id="bofqi"></div></div>');
						var cid = arr[(parseInt(page) - 1)];
						Replace_player(aid, cid, '#bofqi', page, 1); //自动修复--在视频页面，宽度高度是固定值
					}
				}
			}
		});
	}

	//api获取cid

	function api_get_cid(aid, cid, page) {
		if ($("#bofqi_embed,#bofqi").size() == 0) {
			special_get_cids(aid, page);
			init_video_page('未获取[本页面使用了特殊替换功能]', aid, cid, page);
			ac_alert('success', '本页面使用了特殊替换功能[比如原本需要登录才能查看的视频]', 3000);
		} else {
			if (cid) { //cid已知的情况下不请求api
				init_video_page('未获取[由于已知cid不请求api]', aid, cid, page);
				ac_alert('success', '此页面cid已知的情况下不请求api', 3000);
			} else { //cid无法获取的时候请求api
				var url = 'http://api.bilibili.com/view?type=json&appkey=8e9fc618fbd41e28&batch=1&id=' + aid;
				GM_xmlhttpRequest({
					method : 'GET',
					url : url,
					synchronous : false,
					onload : function (responseDetails) {
						if (responseDetails.status == 200) {
							var Content = eval('(' + responseDetails.responseText + ')');
							var list = Content.list;
							var p = page - 1;
							if (typeof(list) != 'undefined') {
								var lp = (typeof(list[p]) == 'undefined') ? list[0] : list[p]; //针对某些aid只有一个cid但是有分P的情况
								var cid = lp.cid;
								var type = lp.type;
								init_video_page(type, aid, cid, page);
								ac_alert('success', '请求api得到了相关信息', 3000);
							} else {
								//alert('bili脚本提示：API返回错误');
								ac_alert('error', 'bili脚本提示：API返回错误', 3000);
							}
						}
					}
				});
			}
			if (get_bfp_config('flash_player_auto_focus') == 1) { //自动滚动功能前置，以便api缓慢的时候也能及时响应
				$('html,body').animate({
					scrollTop : $("#bofqi_embed,#bofqi").offset().top - 30
				}, 500);
			}
		}
	}

	function init_video_page(type, aid, cid, page) {
		insert_html(type, 'video_page'); //UI
		//修复360浏览器flash霸占脚本设置区域
		if (get_bfp_config('compatible_360') == 1) {
			$("#bili_fix_script,#bili-fix-player-installed").mouseover(function () {
				$("#bofqi,#bofqi_embed").addClass("hide");
			});
			$("#bili_fix_script,#bili-fix-player-installed").mouseout(function () {
				$("#bofqi,#bofqi_embed").removeClass("hide");
			});
		}
		var cid_xml_url = 'http://comment.bilibili.com/' + cid + '.xml';
		$('#down_cid_xml').attr('href', cid_xml_url); //弹幕下载
		if (get_bfp_config('enable') == '1') { //如果打开了自动修复
			Replace_player(aid, cid, '#bofqi', page, 1); //自动修复--在视频页面，宽度高度是固定值
		}
		$('#av_source').attr('cid', cid); //给av_source设置cid
		$("#app_qrcode_box").before('<div class="block">视频不能播时<b style="color:red"><a href="javascript:void(0)" id="div_fix_letv_button">点我尝试治疗</a></b></div>');
/* 		$('#div_fix_letv_button').click(function () {
			$('#bofqi').html(window_player.fix_letv(aid, cid));
		}); */
	}

	
	/**
	-------------------------------控制 Control-------------------------------------
	 */


	//模仿AC娘的消息通知效果

	function ac_alert(type, text, time) {
		switch (type) {
		case 'success':
			$('#notice_area').append('<div class=" notice_item notice_success"><i class="icon icon-ok icon-white"></i>&nbsp;' + text + '</div>');
			element_action(time);
			break;

		case 'error':
			$('#notice_area').append('<div class=" notice_item notice_error"><i class="icon icon-remove icon-white"></i>&nbsp;' + text + '</div>');
			element_action(time);
			break;

		case 'info':
			$('#notice_area').append('<div class=" notice_item notice_info"><i class="icon icon-info-sign icon-white"></i>&nbsp;' + text + '</div>');
			element_action(time);
			break;

		case 'warn':
			$('#notice_area').append('<div class=" notice_item notice_warn"><i class="icon icon-warning-sign icon-white"></i>&nbsp;' + text + '</div>');
			element_action(time);
			break;

		case 'inverse':
			$('#notice_area').append('<div class=" notice_item notice_inverse"><i class="icon icon-certificate icon-white"></i>&nbsp;' + text + '</div>');
			element_action(time);
			break;

		case 'normal':
			$('#notice_area').append('<div class=" notice_item notice_normal"><i class="icon icon-bullhorn icon-white"></i>&nbsp;' + text + '</div>');
			element_action(time);
			break;

		default:
			return false;
		}
	}

	function element_action(time) {
		$(".notice_item:last-child").each(function () {
			var t = $(this);
			setTimeout(function () {
				t.css({
					'margin-left' : 0,
					'margin-bottom' : '8px'
				});
			}, 10);
			setTimeout(function () {
				t.css({
					'margin-left' : '-' + t.width() - 40 + "px",
					opacity : "0.3"
				});
			}, time);
			setTimeout(function () {
				t.remove();
			}, time + 1000);
		});
	}

	//替换播放器----------------------------
	//取出aid和分P
	var url = document.location.href;
	if(url.match(/(?:bangumi\.bilibili\.com\/anime\/v\/(\d+))/)){
		url=$('.v-av-link').attr('href');//bangumi页面
	}
	var aid_reg = /\/av(\d+)\/(?:index_(\d+)\.html)?/ig;
	var aid_array = aid_reg.exec(url);

	var aid = aid_array === null ? '' : aid_array[1]; //aid
	var page = aid_array === null ? '1' : typeof(aid_array[2]) == 'undefined' ? '1' : aid_array[2]; //分p

	//模仿AC娘的消息通知效果
	var html = '<div id="notice_area"><div class=" notice_item notice_success" style="display: none">NOTICE-AREA-BASIC-BEGIN</div></div>';
	$('body').append(html);
	//console.log(aid);
	//播放器的html
	if (aid == '') {
		insert_html('', '');
/* 		if (get_bfp_config('enable_window_player')) {
			//ac_alert('info', '弹窗使能初始化...', 3000);
			window_player_init(); //执行弹窗函数
			addNodeInsertedListener('.vidbox.v-list li a,.bgm-calendar.bgmbox li a,.rlist li a,.rm-list li a,.r-list li a,.top-list li a,.vidbox.zt  .t,#video-list li a', function () {
				window_player_init(); //ajax重新渲染,有可能导致浏览器卡顿，若卡顿请删除此行(仅此一行)
			});
		} */
	} else { //cid=3841639
		//ac_alert('info', '视频页面使能初始化...', 3000);
		var content = $('#bofqi').html();
		var cid_reg = /cid=(\d+)/;
		var cid_array = cid_reg.exec(content);
		var cid = cid_array === null ? '' : cid_array[1]; //cid
		api_get_cid(aid, cid, page); //按照aid和分p获取cid并且替换播放器
		//当设置悬浮评论分页栏时，增加css
		if (get_bfp_config('pagebox_display_mode') == 1) {
			if (url.indexOf('video/av') > -1) {
				var css = '.pagelistbox{z-index:999;position:fixed;bottom:10px;  left:0px;background-image:url("http://nightlyfantasy.github.io/Bili_Fix_Player/bg.png");box-shadow: 3px 3px 13px rgba(34, 25, 25, 0.4);}';
				GM_addStyle(css);
			}
		}

		//当设置评论移除和谐娘时，增加css
		if (get_bfp_config('pagebox_show_secret') == 1) {
			if (url.indexOf('video/av') > -1) {
				var css = '.quote{display:block!important;}span.content a,.content>a[href="javascript:;"]{display:none!important;}';
				GM_addStyle(css);
			}
		}
	}

	//HTML5弹幕播放

	function html5_cm_play(aid, cid, div, cm, page, width, height, type) {
		if (typeof(cid) == 'undefined') {
			cid = $('#div_fix_letv_button').attr('cid');
		}
		//ac_alert('inverse', 'HTML5弹幕播放', 3000);
		var params='appkey=85eb6835b0a1034e&cid=' + cid + '&otype=json&platform=android&quality=3&type=mp4';
		var sign=hex_md5(params + '2ad42749773c441109bdc0191257a664');
		var url = 'http://interface.bilibili.com/playurl?'+params+'&sign='+sign;
		//console.log(url);
		GM_xmlhttpRequest({
			method : 'GET',
			url : url,
			synchronous : false,
			onload : function (responseDetails) {
				if (responseDetails.status == 200) {
					var content = responseDetails.responseText;
					var c = eval('(' + content + ')');
					//console.log(c);
					var durl = c.durl;
					if (typeof(durl) == 'undefined') {
						ac_alert('error', 'bili脚本提示：API返回错误：api调用失败，无法解析，请重试一次！', 3000);
					} else {
						var url = durl[0]['url'];
						if (cm) { //B站HTML5弹幕播放
							if (div == '#bofqi') { //视频页面
								//摘自http://tieba.baidu.com/p/4355490187
								unsafeWindow.location.href = ['javascript:(function(d){window.loadHTML5=function(g,f){var h=1==Number(f)?"":"#page="+f;$.getJSON("http://www.bilibili.com/m/html5?aid="+g+"&page="+f+"&sid="+__GetCookie("sid"),function(a){a.src&&(window.html5data=a,$("#bofqi").html(\'<link type="text/css" href="http://static.hdslb.com/css/simple.v2.min.css" rel="stylesheet"/>\'),$.getScript("http://static.hdslb.com/js/simple.v2.min.js",function(){(new BiliH5Player).create({get_from_local:!0,comment:window.html5data.cid,image:window.html5data.img,video_url:\'' + url + '\'})}))})};d&&loadHTML5(d[0].split(\'=\')[1],d[1].split(\'=\')[1])})(document.querySelector(\'[itemprop="embedURL"]\').content.match(/(aid=[^&]*|page=[^&]*)/g));void(0)'].join('');
							} else { //弹窗页面
								unsafeWindow.location.href = ['javascript:function loadHTML5(){$.getJSON("http://www.bilibili.com/m/html5?aid=' + aid + '&page=' + page + '&sid="+__GetCookie("sid"),function(a){a.src&&(window.html5data=a,$("#bofqi").html(\'<link type="text/css" href="http://static.hdslb.com/css/simple.v2.min.css" rel="stylesheet"/>\'),$.getScript("http://static.hdslb.com/js/simple.v2.min.js",function(){(new BiliH5Player).create({get_from_local:!0,comment:\'http://comment.bilibili.com/' + cid + '.xml\',image:window.html5data.img,video_url:\'' + url + '\'})}))})};loadHTML5();void(0)'].join('');
								console.log(width, height, $('#bofqi'));
								setTimeout(function () {
									$('#bofqi').css({
										width : width.replace('px',''),
										height : height.replace('px','')
									});
								}, 1500);

							}
						} else { //ABP-H5弹幕播放
							/* 			name = document.querySelector('.v-title>h1').title;
							document.querySelector('.v-title>h1').innerHTML = [
							'<a href="' + url + '" target="_blank" >' + name + '</a>'
							].join(''); */
							var player = document.querySelector('#bofqi');
							player.innerHTML = [
								'<video id="video" ><source src="' + url + '"></video><div id="load-player"></div>'
							].join('');
							var css3 = '.widescreen #bofqi{height:656.5px}#bofqi.float{height:184px!important;width:320px!important;}#bofqi{height:555px}#load-player{height:100%}.ABP-Unit{background-color:rgba(0,0,0,1);position:relative;color:#fff;outline:0;height:100%!important;width:100%!important;cursor: pointer;}.ABP-Unit.ABP-FullScreen{top:0;left:0;right:0;bottom:0;width:auto!important;height:auto!important;position:fixed;z-index:2147483646}.ABP-Unit .ABP-Video{margin:auto;position:absolute;overflow:hidden;top:0;left:0;right:0;background:#000;bottom:4px}.ABP-Unit .ABP-Video video{width:100%;height:100%}.ABP-Unit .ABP-Video .ABP-Container{transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);position:absolute;display:block;overflow:hidden;margin:0;border:0;top:0;left:0;bottom:0;right:0;-moz-user-select:none}.ABP-FullScreen .ABP-Video .ABP-Container .cmt{font-size:30px!important}.ABP-Unit .ABP-Video .ABP-Container .cmt{position:absolute;padding:3px 0 0 0;margin:0;color:#fff;text-decoration:none;text-shadow:0 0 2px #000;line-height:100%;letter-spacing:0;word-break:keep-all;white-space:pre}.ABP-Unit .ABP-Video .ABP-Container .cmt.rshadow{text-shadow:0 0 3px #fff}.ABP-Unit .ABP-Text{display:none}.ABP-Unit .ABP-Control{position:absolute;bottom:0;left:0;right:0;height:24px;opacity:1;-moz-user-select:-moz-none;background-color:transparent;transition:background-color .5s}.ABP-Unit .ABP-Control:hover{background-color:rgba(0,0,0,1);transition:background-color .5s}.ABP-Unit .ABP-Control .button{cursor: pointer;position:absolute;overflow:hidden;width:0;top:0;bottom:0;background-size:auto;background-repeat:no-repeat;background-position:center center;opacity:0;transition:opacity .5s,width .5s}.ABP-Unit .ABP-Control:hover .button{width:24px;opacity:1;transition:opacity .5s .1s,width .5s}.ABP-Unit .ABP-Control .button:hover{opacity:.4}.ABP-Unit .ABP-Control .ABP-Play{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA8SURBVDhPY2CgFvj3758vEL8G4udAHEiyuUBND/9DAYhNqQGPyDGAMi+QbCOpGkYDmYgQGw0kIgIJhxIA2LG0KMxz/c0AAAAASUVORK5CYII=);left:0}.ABP-Unit .ABP-Control .ABP-Play.ABP-Pause{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABISURBVDhPY2AYVODfv3+tQPwZRKM7DJ8cXC1Q0c//QAAyBIsBOOXgakGaYQDdAHxyowYghdYwCESKExI0uX7Bk5Sxyg1sfgQAuHMabrlJ2XUAAAAASUVORK5CYII=)}.ABP-Unit .ABP-Control .ABP-FullScreen{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAB3SURBVDhPY2CgBvj3758HED/7DwVA9mF0c0FiSPLPQHrgapA1gxQB+UfwGQBV8wyuBmYysb7BUE+xASD/YXM2LheRqp5Ynw1pddBAwUg8BAIRoZ7iaKTYACxJGW9egCbl58h5wQtoyHOkzII3LwDVPgZiL6pEPACBc/dQWTskKQAAAABJRU5ErkJggg==);right:0}.ABP-Unit .ABP-Control .ABP-CommentShow{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA9SURBVDhPY2CgBvj379/h/0QCkFoMO0k04Ag1HD3szCAlEGGRhRIbZBowGhvISYmYQMSaB2CGEGkAbUIdACBVG/9yH6KxAAAAAElFTkSuQmCC);right:24px}.ABP-Unit .ABP-Control .progress-bar{position:absolute;overflow:hidden;cursor:default;background-color:rgba(0,0,0,.7);top:20px;right:0;bottom:0;left:0;transition:all .5s}.ABP-Unit .ABP-Control:hover .progress-bar{top:0;right:48px;left:24px;transition:all .5s}.ABP-Unit .ABP-Control .progress-bar .bar{position:absolute;left:0;top:0;bottom:0;background:#4399ee;opacity:.4;transition:top .5s}.ABP-Unit .ABP-Control .progress-bar .bar.dark{background:#09c;opacity:1}';
							GM_addStyle(css3);
							var inst = ABP.create(document.getElementById('load-player'), {
									'src' : document.getElementById('video'),
									'width' : '640',
									'height' : '480'
								});
							//console.log(div);
							if (div == '#player_content #bofqi') {
								setTimeout(function () {
									$('#bofqi').css({
										width : width.replace('px',''),
										height : height.replace('px','')
									});
								}, 1500);
							}
							CommentLoader('http://comment.bilibili.com/' + cid + '.xml', inst.cmManager);
							(new CommentLoader(inst.cmManager)).setParser(BilibiliParser).load('GET', 'http://comment.bilibili.com/' + cid + '.xml');
							inst.cmManager.options.scroll.scale = 3;
							inst.cmManager.options.global.opacity = .7;
							document.querySelector('.ABP-Video').onclick = function () {
								document.getElementsByClassName('ABP-Play')[0].click();
							};
							var fullStatus = false;
							document.querySelector('.ABP-FullScreen').onclick = function () {
								if (!fullStatus) {
									document.querySelector('body').style.cssText = 'overflow: hidden;';
									fullStatus = true;
								} else {
									document.querySelector('body').style.cssText = 'overflow: auto;';
									fullStatus = false;
								}

							}
						}
					}
				}
			}
		});
	}
	
								
	//css插入
	var css = '#load_manual_window{z-index:300;width:30px;cursor: pointer;left:40px;bottom:50px;position:fixed;padding: 0px 0px 10px;transition: all 0.1s linear 0s;background: none repeat scroll 0% 0% rgba(0, 0, 0, 0.5);color: #FFF;border: medium none;}#load_manual_window:hover{background-color: rgba(0, 0, 0, 0.7);}.singleplaybtn{cursor:pointer;box-shadow: 0px 1px 1px rgba(34, 25, 25, 0.4);background:none repeat scroll 0% 0% #684D75!important;border-radius: 4px;line-height: 14px;padding: 1px 3px;text-align: center;font-family: Calibri;font-size: 12px;min-width: 18px;}.bfpbtn{font-size:12px;height:25.6px;line-height:25.6px;padding:0px 2px;transition-property:#000,color;transition-duration:0.3s;box-shadow:none;color:#FFF;text-shadow:none;border:medium none;background:none repeat scroll 0% 0% #00A1D6!important;}.bfpbtn.active{background:none repeat scroll 0% 0%  #F489AD!important;}.bfpbtn.normal{background:none repeat scroll 0% 0%  #B9B9B9!important;}.bfpbtn.notice{background-color:#FCC630!important;}#window_play_list li{float:left;position:relative;width:30em;border-bottom:1px solid #B0C4DE;font:100% Verdana,Geneva,Arial,Helvetica,sans-serif;}.ui.corner.label{height:0px;border-width:0px 3em 3em 0px;border-style:solid;border-top:0px solid transparent;border-bottom:3em solid transparent;border-left:0px solid transparent;border-right-color:rgb(217,92,92)!important;transition:border-color 0.2s ease 0s;position:absolute;content:"";right:0px;top:0px;z-index:-1;width:0px;}.ui.corner.label i{display:inline-block;margin:3px 0.25em 0px 17px;width:1.23em;height:1em;font-weight:800!important;}.dialogcontainter{z-index:20000!important;}.dialogcontainter{height:400px;width:400px;border:1px solid #14495f;position:fixed;font-size:13px;}.dialogtitle{height:26px;width:auto;background-color:#C6C6C6;}.dialogtitleinfo{float:left;height:20px;margin-top:2px;margin-left:10px;line-height:20px;vertical-align:middle;color:#FFFFFF;font-weight:bold;}.dialogtitleico{float:right;height:20px;width:21px;margin-top:2px;margin-right:5px;text-align:center;line-height:20px;vertical-align:middle;background-image:url("http://nightlyfantasy.github.io/Bili_Fix_Player/bg.gif");background-position:-21px 0px}.dialogbody{padding:10px;width:auto;background-color:#FFFFFF;background-image:url("http://nightlyfantasy.github.io/Bili_Fix_Player/bg.png");}.dialogbottom{bottom:1px;right:1px;cursor:nw-resize;position:absolute;background-image:url("http://nightlyfantasy.github.io/Bili_Fix_Player/bg.gif");background-position:-42px -10px;width:10px;height:10px;font-size:0;}.button-small{font-size:12px;height:25.6px;line-height:25.6px;padding:0px 5px;}.button-flat-action{transition-duration:0.3s;box-shadow:none;background:none repeat scroll 0% 0% #7DB500;color:#FFF!important;text-shadow:none;border:medium none;border-radius:3px;}.player-list{box-shadow: 3px 3px 13px rgba(34, 25, 25, 0.4);position:fixed;z-index:1000;left:10px;top:50px;width:400px!important;background-image:url("http://nightlyfantasy.github.io/Bili_Fix_Player/bg.png");min-height:200px;max-height:400px;overflow: auto;}#player_content #bofqi{position:absolute;top:65px;left:10px;right:10px;bottom:10px;}#window-player{bottom:0;height:100%;left:0;right:0;top:0;width:100%;}.title:hover .single_player{display:inline;}.t:hover .single_player{display:inline;}a.single_player{display:none;}#bofqi_embed.hide,#bofqi.hide,#player_content.hide{margin-left:3000px!important;transition:0.5s;-moz-transition:0.5s;-webkit-transition:0.5s;-o-transition:0.5s;}#bofqi_embed,#bofqi,#player_content{transition:0.5s;-moz-transition:0.5s;-webkit-transition:0.5s;-o-transition:0.5s;}';
	var css1='#notice_area{position:fixed;bottom:24px;left:0;z-index:10;margin:0;padding:0;width:auto;text-align:left;z-index:9999}.notice_item{position:relative;z-index:11;display:table;margin:0 -500px 0;padding:0 8px 0 2px;width:auto;height:auto;border-left:4px solid #288ECF;border-radius:1px;background-color:#3A9BD9;box-shadow:0 1px 3px rgba(0,0,0,.302);color:#FFF;white-space:pre-wrap;word-break:break-all;font-weight:700;font-size:12px;line-height:24px;transition:all .5s ease 0s}.notice_success{background:#54A954 none repeat scroll 0 0;border-left:4px solid #54A954}.notice_error{background:#C13932 none repeat scroll 0 0;border-left:4px solid #C13932}.notice_info{background:#58BDDB none repeat scroll 0 0;border-left:4px solid #58BDDB}.notice_warn{background:#F9A125 none repeat scroll 0 0;border-left:4px solid #F9A125}.notice_inverse{background:#262626 none repeat scroll 0 0;border-left:4px solid #262626}.notice_normal{background:#004FCC none repeat scroll 0 0;border-left:4px solid #004FCC}.m-i.home li a b{color: #F25D8E;font-weight:bold!important;}';//这是仿ac娘消息框的UI
	GM_addStyle(css);GM_addStyle(css1);

	//高大上的拖动DIV和改变DIV大小功能，来自互联网脚本之家www.jb51.net，还有大花猫的元素监听
var z=1,i=1,left=10;var isIE=(document.all)?true:false;var Extend=function(destination,source){for(var property in source){destination[property]=source[property];}}
var Bind=function(object,fun,args){return function(){return fun.apply(object,args||[]);}}
var BindAsEventListener=function(object,fun){var args=Array.prototype.slice.call(arguments).slice(2);return function(event){return fun.apply(object,[event||window.event].concat(args));}}
var CurrentStyle=function(element){return element.currentStyle||document.defaultView.getComputedStyle(element,null);}
function create(elm,parent,fn){var element=document.createElement(elm);fn&&fn(element);parent&&parent.appendChild(element);return element};function addListener(element,e,fn){element.addEventListener?element.addEventListener(e,fn,false):element.attachEvent("on"+e,fn)};function removeListener(element,e,fn){element.removeEventListener?element.removeEventListener(e,fn,false):element.detachEvent("on"+e,fn)};var Class=function(properties){var _class=function(){return(arguments[0]!==null&&this.initialize&&typeof(this.initialize)=='function')?this.initialize.apply(this,arguments):this;};_class.prototype=properties;return _class;};var Dialog=new Class({options:{Width:400,Height:400,Left:100,Top:10,Titleheight:26,Minwidth:200,Minheight:200,CancelIco:true,ResizeIco:true,Info:"标题",Content:"无内容",Zindex:2},initialize:function(options){this._dragobj=null;this._resize=null;this._cancel=null;this._body=null;this._x=0;this._y=0;this._fM=BindAsEventListener(this,this.Move);this._fS=Bind(this,this.Stop);this._isdrag=null;this._Css=null;this.Width=this.options.Width;this.Height=this.options.Height;this.Left=this.options.Left;this.Top=this.options.Top;this.CancelIco=this.options.CancelIco;this.Info=this.options.Info;this.Content=this.options.Content;this.Minwidth=this.options.Minwidth;this.Minheight=this.options.Minheight;this.Titleheight=this.options.Titleheight;this.Zindex=this.options.Zindex;Extend(this,options);Dialog.Zindex=this.Zindex
var obj=['dialogcontainter','dialogtitle','dialogtitleinfo','dialogtitleico','dialogbody','dialogbottom'];for(var i=0;i<obj.length;i++){obj[i]=create('div',null,function(elm){elm.className=obj[i];});}
obj[2].innerHTML=this.Info;obj[4].innerHTML=this.Content;obj[1].appendChild(obj[2]);obj[1].appendChild(obj[3]);obj[0].appendChild(obj[1]);obj[0].appendChild(obj[4]);obj[0].appendChild(obj[5]);document.body.appendChild(obj[0]);this._dragobj=obj[0];this._resize=obj[5];this._cancel=obj[3];this._body=obj[4];with(this._dragobj.style){height=this.Height+"px";top=this.Top+"px";width=this.Width+"px";left=this.Left+"px";zIndex=this.Zindex;}
this._body.style.height=this.Height-this.Titleheight-parseInt(CurrentStyle(this._body).paddingLeft)*2+'px';addListener(this._dragobj,'mousedown',BindAsEventListener(this,this.Start,true));addListener(this._cancel,'mouseover',Bind(this,this.Changebg,[this._cancel,'0px 0px','-21px 0px']));addListener(this._cancel,'mouseout',Bind(this,this.Changebg,[this._cancel,'0px 0px','-21px 0px']));addListener(this._cancel,'mousedown',BindAsEventListener(this,this.Disappear));addListener(this._body,'mousedown',BindAsEventListener(this,this.Cancelbubble));addListener(this._resize,'mousedown',BindAsEventListener(this,this.Start,false));},Disappear:function(e){this.Cancelbubble(e);document.body.removeChild(this._dragobj);$('.player-list').remove();},Cancelbubble:function(e){this._dragobj.style.zIndex=++Dialog.Zindex;document.all?(e.cancelBubble=true):(e.stopPropagation())},Changebg:function(o,x1,x2){o.style.backgroundPosition=(o.style.backgroundPosition==x1)?x2:x1;},Start:function(e,isdrag){if(!isdrag){this.Cancelbubble(e);}
this._Css=isdrag?{x:"left",y:"top"}:{x:"width",y:"height"}
this._dragobj.style.zIndex=++Dialog.Zindex;this._isdrag=isdrag;this._x=isdrag?(e.clientX-this._dragobj.offsetLeft||0):(this._dragobj.offsetLeft||0);this._y=isdrag?(e.clientY-this._dragobj.offsetTop||0):(this._dragobj.offsetTop||0);if(isIE){addListener(this._dragobj,"losecapture",this._fS);this._dragobj.setCapture();}else{e.preventDefault();addListener(window,"blur",this._fS);}
addListener(document,'mousemove',this._fM);addListener(document,'mouseup',this._fS);if(get_bfp_config('compatible_360')==1)$("#player_content").addClass("hide");},Move:function(e){window.getSelection?window.getSelection().removeAllRanges():document.selection.empty();var i_x=e.clientX-this._x,i_y=e.clientY-this._y;this._dragobj.style[this._Css.x]=(this._isdrag?Math.max(i_x,0):Math.max(i_x,this.Minwidth))+'px';this._dragobj.style[this._Css.y]=(this._isdrag?Math.max(i_y,0):Math.max(i_y,this.Minheight))+'px'
if(!this._isdrag)this._body.style.height=Math.max(i_y-this.Titleheight,this.Minheight-this.Titleheight)-2*parseInt(CurrentStyle(this._body).paddingLeft)+'px';},Stop:function(){$("#player_content").removeClass("hide");removeListener(document,'mousemove',this._fM);removeListener(document,'mouseup',this._fS);$('#player_content #bofqi').attr('width',$('.dialogcontainter').width()-20);$('#player_content #bofqi').css('width',$('.dialogcontainter').width()-20+'px');$('#player_content .player').css('width',$('.dialogcontainter').width()-20);set_bfp_config('window_player_width',($('.dialogcontainter').width()-20));$('#player_content #bofqi').attr('height',$('.dialogcontainter').height()-70);$('#player_content #bofqi').css('height',$('.dialogcontainter').height()-70+'px');$('#player_content .player').css('height',$('.dialogcontainter').height()-70);set_bfp_config('window_player_height',($('.dialogcontainter').height()-70));set_bfp_config('window_player_left_position',($('.dialogcontainter').offset().left));if(isIE){removeListener(this._dragobj,"losecapture",this._fS);this._dragobj.releaseCapture();}else{removeListener(window,"blur",this._fS);};}})
function creat(title,content){$('.dialogcontainter').remove();new Dialog({Info:title=title,Left:get_bfp_config('window_player_left_position'),Top:50,Width:(get_bfp_config('window_player_width')+20),Height:(get_bfp_config('window_player_height')+90),Content:content,Zindex:(2000)});i++;left+=10;}

	function addNodeInsertedListener(elCssPath,handler,executeOnce,noStyle){var animName="anilanim",prefixList=["-o-","-ms-","-khtml-","-moz-","-webkit-",""],eventTypeList=["animationstart","webkitAnimationStart","MSAnimationStart","oAnimationStart"],forEach=function(array,func){for(var i=0,l=array.length;i<l;i++){func(array[i]);}};if(!noStyle){var css=elCssPath+"{",css2="";forEach(prefixList,function(prefix){css+=prefix+"animation-duration:.001s;"+prefix+"animation-name:"+animName+";";css2+="@"+prefix+"keyframes "+animName+"{from{opacity:.9;}to{opacity:1;}}";});css+="}"+css2;GM_addStyle(css);}
	if(handler){var bindedFunc=function(e){var els=document.querySelectorAll(elCssPath),tar=e.target,match=false;if(els.length!==0){forEach(els,function(el){if(tar===el){if(executeOnce){removeNodeInsertedListener(bindedFunc);}
	handler.call(tar,e);return;}});}};forEach(eventTypeList,function(eventType){document.addEventListener(eventType,bindedFunc,false);});return bindedFunc;}}
	function removeNodeInsertedListener(bindedFunc){var eventTypeList=["animationstart","webkitAnimationStart","MSAnimationStart","oAnimationStart"],forEach=function(array,func){for(var i=0,l=array.length;i<l;i++){func(array[i]);}};forEach(eventTypeList,function(eventType){document.removeEventListener(eventType,bindedFunc,false);});}
})();