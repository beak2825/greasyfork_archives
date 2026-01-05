// ==UserScript==
// @name        TiebaOldUserCard
// @namespace   TiebaOldUserCard@tieba.com
// @description 贴吧旧名片
// @include     http://tieba.baidu.com/p/*
// @include     http://tieba.baidu.com/f?*
// @include     http://tieba.baidu.com/f/*
// @version     0.1
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/6383/TiebaOldUserCard.user.js
// @updateURL https://update.greasyfork.org/scripts/6383/TiebaOldUserCard.meta.js
// ==/UserScript==

(function(){
	var cardList = {},
		hideCardTimeout = null,
		showCardTimeout = null,
		ucp = document.createElement('div');
	ucp.id = 'users_card_panel';
	ucp.style.cssText = 'display:none; height:140px; border:1px solid #666; width:330px;'
				+ 'position:absolute; z-index:100000000; background:#fff; overflow:hidden;';
	document.body.appendChild(ucp);

	document.addEventListener('mouseover', function(event){
		var target = event.target;
		if((target.className 
				&& !!~target.className.indexOf('j_user_card' ) 
				&& target.nodeName == 'A') ||
		ucp.contains(target)){
			event.stopPropagation();
			clearTimeout(hideCardTimeout);
			if(!ucp.contains(target)){
				clearTimeout(showCardTimeout);
				showCardTimeout = setTimeout(function(){
					var rects = target.getBoundingClientRect(),
						scrollTop = document.documentElement.scrollTop,
						card = getUserCard(
							JSON.parse(target.dataset.field.replace(/'/g,'"')).un);
					for(i in cardList){
						if(cardList[i] != card)
							cardList[i].style.display = 'none';
					}
					card.style.display = ucp.style.display = 'block';

					if(/at|lzl_p_p/.test(target.className) || unsafeWindow.hasOwnProperty('frsPage')){
						if(rects.top > 140 + 20){
							ucp.style.top = scrollTop + rects.top - 140 - rects.height + 'px';
						}else{
							ucp.style.top = scrollTop + rects.top + rects.height + 5 + 'px';
						}
						ucp.style.left = rects.left + 'px';
					}else{
						ucp.style.top = scrollTop + rects.top - 60 + 'px';
						ucp.style.left = rects.right + 20 + 'px';
					}
				}, 350);
			}
		}
	}, true);

	document.addEventListener('mouseout', function(event){
		var target = event.target;
		if((target.className 
				&& !!~target.className.indexOf('j_user_card') 
				&& target.nodeName == 'A') 
			|| ucp.contains(target)
		){
			clearTimeout(showCardTimeout);
			clearTimeout(hideCardTimeout);
			hideCardTimeout = setTimeout(function(){
				ucp.style.display = 'none';
			}, 200);
		}
	}, true);

	function getUserCard(userName){
		if(userName in cardList){
			return cardList[userName];
		}else{
			var iframe = document.createElement('iframe');
			iframe.src = '/i/data/panel?ie=utf-8&un=' + encodeURIComponent(userName);
			iframe.style.width = '100%';
			cardList[userName] = iframe;
			ucp.appendChild(iframe);
			iframe.contentWindow.addEventListener('DOMContentLoaded', function(){
				GM_xmlhttpRequest({
					method: 'GET',
					url: 'http://pan.baidu.com/inbox/friend/queryuser?query_uname={"'+userName+'": 0}',
					onload: function (re) {
						var json = JSON.parse(re.responseText);
						if(json.errno != 0) return;
						iframe.contentWindow.document
							.getElementById('icon_right')
							.insertAdjacentHTML('beforeend', 
                            " <a target=\"_blank\" href=\"http://yun.baidu.com/share/home?uk="
                            + json.user_list[0].uk +"\">盘</a>,"
                            + "<a target=\"_blank\" href=\"http://xiangce.baidu.com/u/"
                            + json.user_list[0].uk +"\">册</a>,"
                            + "<a target=\"_blank\" href=\"http://www.tieba.com/f/search/ures?ie=utf-8&kw=&qw=&rn=100&sm=0&un="
                            + userName +"\">黑</a>");
					}
				});
			});
			return iframe;
		}
	}
})();