// ==UserScript==
// @name            駿河屋内容可跳转到doujinshi搜索[E绅士+放大搜索封面版]
// @namespace       http://weibo.com/myimagination
// @author          @MyImagination
// @homepageURL     https://greasyfork.org/users/2805-myimagination
// @version			0.2.1
// @description     [E绅士版]駿河屋页面添加至doujinshi的快速查询按钮 可以在doujinshi获得更多信息
// @include         http://www.suruga-ya.jp/search*
// @include         http://www.suruga-ya.jp/product/detail*
// @run-at          document-end
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/9031/%E9%A7%BF%E6%B2%B3%E5%B1%8B%E5%86%85%E5%AE%B9%E5%8F%AF%E8%B7%B3%E8%BD%AC%E5%88%B0doujinshi%E6%90%9C%E7%B4%A2%5BE%E7%BB%85%E5%A3%AB%2B%E6%94%BE%E5%A4%A7%E6%90%9C%E7%B4%A2%E5%B0%81%E9%9D%A2%E7%89%88%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/9031/%E9%A7%BF%E6%B2%B3%E5%B1%8B%E5%86%85%E5%AE%B9%E5%8F%AF%E8%B7%B3%E8%BD%AC%E5%88%B0doujinshi%E6%90%9C%E7%B4%A2%5BE%E7%BB%85%E5%A3%AB%2B%E6%94%BE%E5%A4%A7%E6%90%9C%E7%B4%A2%E5%B0%81%E9%9D%A2%E7%89%88%5D.meta.js
// ==/UserScript==

(function(){
	if (window.location.href.indexOf('/search') > 0) {
	$(".table1").each(function(){
	    $(this).find("td.text1 img").attr('src', $(this).find("td.text1 img").attr("src").replace(/size=ss/,"size=s"));
		var xc = $(this).find("a.link b").text();
		xc=xc.replace(/\([^\)]*\)/g,"");
		xc=xc.replace(/\（[^\）]*\）/g,"");
		xc=xc.replace(/\【[^\】]*\】/g,"");
		xc=xc.replace(/\<[^\>]*\>>/g,"");
		if(xc.split("/").length-1 > 1)
		{
			xc=xc.substr(0,xc.lastIndexOf("/")-1);
		}else{
				xc=xc.replace(/[/].*/g,"");
			}
		$(this).find("tr:eq(0) td:eq(3) div a").attr('href', 'http://www.doujinshi.org/search/simple/?T=objects&sn=' + xc);
		$(this).find("tr:eq(0) td:eq(3) div a").attr('target', '_blank');
		var xv = $(this).find("tr:eq(2) td:eq(0)").text().replace(/(^[\s]*)|([\s]*$)/g,"");
		$(this).find("tr:eq(2) td:eq(0)").html('<a href="http://www.suruga-ya.jp/search?category=&search_word=&restrict[]=brand(text)=' + xv.slice(1,xv.length-1) + '" target="_blank" >' + xv + '</a>' + ' | <a href="http://www.doujinshi.org/search/simple/?T=circle&sn=' + xv.slice(1,xv.length-1) + '" target="_blank" > [搜索] </a> | <a href="http://exhentai.org/?f_doujinshi=1&f_manga=1&f_artistcg=1&f_gamecg=1&f_western=1&f_non-h=1&f_imageset=1&f_cosplay=1&f_asianporn=1&f_misc=1&f_search=' + xv.slice(1,xv.length-1) + '&f_apply=Apply+Filter" target="_blank" > [E搜索] </a>' + ' | <a href="http://exhentai.org/?f_doujinshi=1&f_manga=1&f_artistcg=1&f_gamecg=1&f_western=1&f_non-h=1&f_imageset=1&f_cosplay=1&f_asianporn=1&f_misc=1&f_search=' + xc + '&f_apply=Apply+Filter" target="_blank" > [标题E搜索]');
		
	}); 
	}else{
		//$("#item_title").remove("span");
		var xc = $("#item_title").text();
		xc=xc.replace(/\([^\)]*\)/g,"");
		xc=xc.replace(/\（[^\）]*\）/g,"");
		xc=xc.replace(/\【[^\】]*\】/g,"");
		xc=xc.replace(/\<[^\>]*\>>/g,"");
		if(xc.split("/").length-1 > 1)
		{
			xc=xc.substr(0,xc.lastIndexOf("/")-1);
		}else{
				xc=xc.replace(/[/].*/g,"");
			}
		xc=xc.replace($("#item_title span").text(), "");
		$("#item_title span").append(' | <a href="http://www.doujinshi.org/search/simple/?T=objects&sn=' + xc + '" target="_blank" > [搜索标题] </a>' + ' | <a href="http://exhentai.org/?f_doujinshi=1&f_manga=1&f_artistcg=1&f_gamecg=1&f_western=1&f_non-h=1&f_imageset=1&f_cosplay=1&f_asianporn=1&f_misc=1&f_search=' + xc + '&f_apply=Apply+Filter" target="_blank" > [E搜索] </a>');
		$("#datasheet tr:eq(1) td:eq(1)").append(' | <a href="http://www.doujinshi.org/search/simple/?T=circle&sn=' + $("#datasheet tr:eq(1) td:eq(1) a").text() + '" target="_blank" > [搜索] </a>' + ' | <a href="http://exhentai.org/?f_doujinshi=1&f_manga=1&f_artistcg=1&f_gamecg=1&f_western=1&f_non-h=1&f_imageset=1&f_cosplay=1&f_asianporn=1&f_misc=1&f_search=' + $("#datasheet tr:eq(1) td:eq(1) a").text() + '&f_apply=Apply+Filter" target="_blank" > [E搜索] </a>');
		$(".t_title:contains('画')").each(function(){
			$(this).next().append(' | <a href' + '="' + 'http://www.doujinshi.org/search/simple/?T=author&sn=' + $(this).next().find('a').text() + '" target="_blank" > [搜索] </a>' + ' | <a href' + '="' + 'http://exhentai.org/?f_doujinshi=1&f_manga=1&f_artistcg=1&f_gamecg=1&f_western=1&f_non-h=1&f_imageset=1&f_cosplay=1&f_asianporn=1&f_misc=1&f_search=' + $(this).next().find('a').text() + '&f_apply=Apply+Filter" target="_blank" > [E搜索] </a>')}
			);		 
	}   
})();