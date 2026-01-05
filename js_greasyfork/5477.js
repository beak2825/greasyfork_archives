// ==UserScript==
// @name       jc_Image_Zoomer_2
// @namespace  http://jiichen.at.home/
// @description  Zoom Image
// @description  Support domain/Host: wretch.cc , yam.com , qing.weibo.com , facebook(link)
// @require    http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.9.1.min.js
// @include    http://www.wretch.cc/album/*
// @include    http://album.blog.yam.com/*
// @include    http://*.weibo.com/*
// @include    http://photo.pchome.com.tw/*
// @include    http://*.pixnet.net/album/set/*
// @include    http://*/thread*
// @include    http://*.4chan.org/*
// @include    http://www.*.com/*viewthread*
// @exclude    http://www.youtube.com/
// @exclude    https://www.facebook.com/
// @exclude    https://app.facebook.com/
// @version    0.1.11
// @modified_date    2014.12.17
// @copyright  2012, jc
// @grant		GM_log
// @grant		GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/5477/jc_Image_Zoomer_2.user.js
// @updateURL https://update.greasyfork.org/scripts/5477/jc_Image_Zoomer_2.meta.js
// ==/UserScript==

//GM_addStyle("#jcZoomImgArea {position:fixed; top:0px; left:100px; border:3px solid #66CCFF; background-color:gray; padding:2px; z-index:2147483647;}");
GM_addStyle("#jcZoomImgArea2 {position:fixed; top:0px; left:100px; border:3px solid #66CCFF; background-color:gray; padding:2px; z-index:1000000;}");

var globalImageMinWidth = 190; // mouseenter 時圖的最小寬度
var globalImageMinHeight = 150; // mouseenter 時圖的最小高度
var globalMouseStatus = 0; // 0: mouseleave ; 1: mouseenter
var globalGrabUrl = ''; // 正在抓的網址
var globalDivShowing = 0; // Div 是否顯示中
var globalMouseInDiv = 0; // mouse 是否在 Div 內
var globalDivId = 'jcZoomImgArea2';
var globalMouseOverObj = null; // 滑鼠 mouseenter 的物件
var globalHost, globalDomain;
var globalLastEnterObj = null; // 上次 mouse enter 時的物件

function doJcGetImageOrHtml(url, x, y) {
	// 抓圖檔，如果是網頁則繼續抓圖

	globalGrabUrl = url;

	GM_log('** grab url = ' + url);

	$.ajax({
		type : "GET",
		url : url,
		complete : function (xhr, textStatus) {
			/*
			if ('success' != textStatus) {
			alert("complete error status : " + textStatus);
			}
			 */
		},
		error : function (xhr, textStatus, errorThrown) {
			/*
			var errMsg = xhr.status + ' , ' + xhr.responseText + ' , ' + textStatus + ' , ' + errorThrown;
			alert("ERROR : " + errMsg + ' ; ' + url );
			 */

			var divObj = $('#' + globalDivId);
			divObj.append('<img data-src="' + url + '" />');

			divObj.find('img').one('load', function () {

				var win_h = $(window).height();
				var win_w = $(window).width() - 30;
				var max_img_w = Math.max(x - 50, parseInt(win_w / 2, 10) - 50);

				var big_img_width = $(this).width();
				var big_img_height = $(this).height();

				var imgRate = (big_img_height / big_img_width);

				if (big_img_width <= globalImageMinWidth) {
					$(this).remove();
				} else if (big_img_height <= globalImageMinHeight) {
					$(this).remove();
				} else {

					var adjust_img_width = big_img_width;
					var adjust_img_height = big_img_height;
					var adjust_img_width1 = big_img_width;
					var adjust_img_height1 = big_img_height;
					var adjust_img_width2 = big_img_width;
					var adjust_img_height2 = big_img_height;
					// 依據 img 寬高調整 div 位置

					var space1 = 10; // 預留之空白或邊框寬度
					if ((big_img_height + space1) > win_h) {
						adjust_img_height1 = (win_h - space1);
						//adjust_img_width1  = parseInt(adjust_img_height1 * (big_img_width / big_img_height) , 10);
						adjust_img_width1 = parseInt(adjust_img_height1 / imgRate, 10);

					}

					if ((big_img_width + space1) > max_img_w) {
						adjust_img_width2 = max_img_w;
						//adjust_img_height2 = parseInt(adjust_img_width2 * (big_img_height / big_img_width) , 10);
						adjust_img_height2 = parseInt(adjust_img_width2 * imgRate, 10);
					}

					adjust_img_width = Math.min(adjust_img_width1, adjust_img_width2);
					adjust_img_height = Math.min(adjust_img_height1, adjust_img_height2);

					$(this).width(adjust_img_width)
					.height(adjust_img_height);

					GM_log("  x = " + x + " , adjust_img_width = " + adjust_img_width + " , win_w = " + win_w);
					GM_log("  y = " + y + " , adjust_img_height = " + adjust_img_height + " , win_h = " + win_h);

					if ((x + 50 + adjust_img_width) > win_w) {
						divObj.css('left', (x - adjust_img_width - 50) + 'px');
					} else {
						divObj.css('left', (win_w - adjust_img_width - 30) + 'px');
						//divObj.css('left' , '30px');
					}
				}

			});

			divObj.find('img').each(function () {
				$(this).attr('src', $(this).attr('data-src'));
			});

		},
		success : function (response, status, xhr) {

			// 由於抓圖需要時間，如果抓完後發現使用者已經在看其他圖(網址不同)，則返回
			if (url != globalGrabUrl) {				return false;			}

			var divObj = $('#' + globalDivId);

			divObj.css('left', (x + 50) + 'px');

			var ct = xhr.getResponseHeader("content-type") || "";

			//alert(ct);

			if (ct.indexOf('html') > -1) {
				// handle html page (如果是 HTML 網頁)
				$(response).find('img').each(function () {

					divObj.append('<img data-src="' + $(this).attr('src') + '" />');
					//divObj.append('<div>' + $(this).width() + ' x ' + $(this).height() + '</div>');

				});

			} else if (ct.indexOf('image') > -1) {
				// handle image here (如果是 image 圖檔)
				divObj.append('<img data-src="' + url + '" />');
			}

			divObj.find('img').one('load', function () {
				var win_h = $(window).height();
				var win_w = $(window).width() - 30;
				var max_img_w = Math.max(x - 50, parseInt(win_w / 2, 10) - 50);

				var big_img_width = $(this).width();
				var big_img_height = $(this).height();

				if (big_img_width <= globalImageMinWidth) {
					$(this).remove();
				} else if (big_img_height <= globalImageMinHeight) {
					$(this).remove();
				} else {

					var adjust_img_width = big_img_width;
					var adjust_img_height = big_img_height;
					// 依據 img 寬高調整 div 位置

					var space1 = 10; // 預留之空白或邊框寬度
					if ((big_img_height + space1) > win_h) {
						adjust_img_height = (win_h - space1);
						adjust_img_width = parseInt(adjust_img_height * (big_img_width / big_img_height), 10);
					}

					if ((big_img_width + space1) > max_img_w) {
						adjust_img_width = max_img_w;
						adjust_img_height = parseInt(adjust_img_width * (big_img_height / big_img_width), 10);
					}

					$(this).width(adjust_img_width)
					.height(adjust_img_height);

					//GM_log("  x = " + x + " , adjust_img_width = " + adjust_img_width + " , win_w = " + win_w);

					if ((x + 50 + adjust_img_width) > win_w) {
						divObj.css('left', (x - adjust_img_width - 50) + 'px');
					} else {
						divObj.css('left', (win_w - adjust_img_width - 30) + 'px');
						//divObj.css('left' , '30px');
					}
				}

			});

			divObj.find('img').each(function () {
				$(this).attr('src', $(this).attr('data-src'));
			});
		}
	});
}
function doJcMouseEnter(url, x, y) {
	// Mouse Enter
	// 抓圖&放大圖檔
	var divObj = $('#' + globalDivId);

	if (divObj.length == 0) {
		$('body').append('<div id="' + globalDivId + '"></div>');

		$(document).on('mouseenter', '#' + globalDivId, function (e) {
			globalMouseInDiv = 1;
		}).on('mouseleave', '#' + globalDivId, function () {
			globalMouseInDiv = 0;
		});

	}

	//divObj = $('#' + globalDivId);
	divObj.show();
	globalDivShowing = 1;

	doJcGetImageOrHtml(url, x, y);

}
function doJcMouseLeave() {
	// Mouse Leave
	var divObj = $('#' + globalDivId);

	if (divObj.length > 0) {

		divObj.hide();
		globalDivShowing = 0;
		divObj.find('*').remove();

	}
}
function JcMouseEnterEvent(thisObj, e) {

  GM_log('  JcMouseEnterEvent() , globalMouseStatus == ' + globalMouseStatus );
  var divObj = $('#' + globalDivId);
  
  if ((0 == globalMouseInDiv) && (thisObj != globalLastEnterObj)) {
    globalMouseStatus = 0;
    if (divObj.length > 0) {
        divObj.find('*').remove();
    }
    GM_log('  JcMouseEnterEvent() , set globalMouseStatus = 0');
  }
  globalLastEnterObj = thisObj;
	if (0 == globalMouseStatus) {
    globalMouseStatus = 1;
		globalMouseOverObj = thisObj;
		var url = "";
		var parentTag = $(thisObj).parent().prop("tagName");
		//GM_log("parent TAG == " + parentTag);
		if ("A" == parentTag) {
			url = $(thisObj).parent().attr('href');
		} else {
			url = $(thisObj).attr('src');

			// http://ww3.sinaimg.cn/square/a01660e0jw1e4enb3e5o0j21kw23u1k3.jpg
			// http://ww3.sinaimg.cn/bmiddle/a01660e0jw1e4enb3e5o0j21kw23u1k3.jpg
			var flags = '';
			var regex = new RegExp('(http://.*?\.sinaimg\.cn/)(square|thumbnail)(/.*?\.jpg|png|gif)', flags);
			var matches = regex.exec(url);
			if ((Object.prototype.toString.call(matches) === '[object Array]') && (null != matches) && (undefined != matches)) {
				url = matches[1] + "bmiddle" + matches[3];
				GM_log('  M2, url = ' + url);
			}

		}

		GM_log('  1. url = ' + url);
		if (-1 != url.indexOf('javascript')) { // 連結有 javascript 字串存在
			url = $(thisObj).attr('src');
			GM_log('  2. url = ' + url);
			if ((-1 != globalHost.indexOf('weibo.com')) && (-1 != location.href.indexOf('/album'))) { // 微博相簿
				// 小圖 http://ww4.sinaimg.cn/cmw205/730b784bjw1ek6c45rfxvj20hs0hqdi8.jpg
                // 小圖 http://ww4.sinaimg.cn/cmw218/730b784bjw1ek6c45rfxvj20hs0hqdi8.jpg
				// 大圖 http://ww4.sinaimg.cn/mw1024/730b784bjw1ek6c45rfxvj20hs0hqdi8.jpg
				// 小圖 http://ww2.sinaimg.cn/square/800639e2jw1ekx7ewhumgj20q00yo0xs.jpg
				// 大圖 http://ww2.sinaimg.cn/bmiddle/800639e2jw1ekx7ewhumgj20q00yo0xs.jpg
				url = url.replace(/\/cmw\d\d\d/, '/mw1024');
				url = url.replace(/square/, 'bmiddle');
			}
		} else if (0 == url.indexOf('//')) { // url 最前頭為 //
			url = 'http:' + url; // ex: //images.4chan.org/vg/src/1369795889369.jpg
			GM_log('  3. url = ' + url);
		} else {
			url = $(thisObj).attr('src');
			GM_log('  4. url = ' + url);
			if ((-1 != globalHost.indexOf('pixnet.net')) && (-1 != location.href.indexOf('/album'))) { //pixnet相簿
				// 小圖 http://pic.pimg.tw/vonnevonne/4bebc41393acb_s.jpg
				// 大圖 http://pic.pimg.tw/vonnevonne/4bebc41393acb.jpg
				url = url.replace(/_s\.jpg/, '.jpg');
				GM_log('  url 4-2 = ' + url);
			} else if (-1 != url.indexOf('sinaimg.cn')) {
				url = url.replace(/\/cmw\d\d\d/, '/mw1024');
				url = url.replace(/square/, 'bmiddle');
				GM_log('  4-3. url = ' + url);
			} else if (-1 != url.indexOf('imgdino.com')) {
                // http://img11.imgdino.com/images/60831517551122016203_thumb.jpg
                url = url.replace(/_thumb/, '');
				GM_log('  4-4. url = ' + url);
            }
		}

		
		doJcMouseEnter(url, e.pageX, e.pageY);
	}
}
function JcMouseLeaveEvent(thisObj) {
    GM_log('  JcMouseLeaveEvent() , globalMouseStatus == ' + globalMouseStatus );
	if (1 == globalMouseStatus) {
		if (0 == globalMouseInDiv) {
			globalMouseStatus = 0;
			doJcMouseLeave();
		}
	}
}
$(document).ready(function () {

	var flags = '';
	var regex = new RegExp('http(s|)://((.*?)(([^.]*?)\.([^.]*?)))/', flags);
	//var regex   = new RegExp('http(s|)://((.*?)(([^.]*?)\.([^.]*?)))//' , flags);
	var matches = regex.exec(location.href);
	globalHost = matches[2]; // ex: www.wretch.cc
	globalDomain = matches[4]; // ex: wretch.cc

	GM_log('Host = ' + globalHost + ' , Domain = ' + globalDomain);

	$('body').append('<div id="' + globalDivId + '"></div>');

	$(document).on('mouseenter', '#' + globalDivId, function (e) {
		globalMouseInDiv = 1;
	}).on('mouseleave', '#' + globalDivId, function (e) {
		globalMouseInDiv = 0;
		window.setTimeout(function () {
			$('#' + globalDivId).hide();
		}, 100);
	});

	var divObj = $('#' + globalDivId);
	divObj.hide();

	$('a').on('mouseenter', 'img', function (e) {
		JcMouseEnterEvent(this, e);
	}).on('mouseleave', 'img', function () {
		var objThis = this;
		window.setTimeout(function () {
			if (globalMouseOverObj == objThis) {
				JcMouseLeaveEvent(objThis);
			}
		}, 100);
	});

	$('div').on('mouseenter', 'img', function (e) {
		JcMouseEnterEvent(this, e);
	}).on('mouseleave', 'img', function () {
		var objThis = this;
		window.setTimeout(function () {
			if (globalMouseOverObj == objThis) {
				JcMouseLeaveEvent(objThis);
			}
		}, 100);
	});

});
