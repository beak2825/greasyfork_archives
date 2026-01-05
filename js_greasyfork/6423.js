// ==UserScript==
// @name           osu! Alternative Add Friend Button
// @description    osu! Alternative Add Friend Button. ts8zs' request
// @author         JebwizOscar
// @icon           http://osu.ppy.sh/favicon.ico
// @include        http://osu.ppy.sh/u/*
// @include        https://osu.ppy.sh/u/*
// @grant          GM_setValue
// @grant          GM_getValue
// @version        1.0.0.3
// @namespace https://greasyfork.org/users/3079
// @downloadURL https://update.greasyfork.org/scripts/6423/osu%21%20Alternative%20Add%20Friend%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/6423/osu%21%20Alternative%20Add%20Friend%20Button.meta.js
// ==/UserScript==
function AddFriend(){
	$.post('//osu.ppy.sh/forum/ucp.php?i=zebra&mode=friends',
		{localUserCheck:localUserCheck,add:$('.profile-username').text().replace(/\n/g,''),submit:'Submit'},
		function(data){
			j = data;
			sid = j.match(/name="sid" value="([0-9a-f]*)"/)[1];
			add = j.match(/name="add" value="(.*?)"/)[1];
			uid = j.match(/name="user_id" value="([0-9]*)"/)[1];
			cky = j.match(/friends&amp;&amp;confirm_key=(.*?)"/)[1];
			$.post('//osu.ppy.sh/forum/ucp.php?i=zebra&mode=friends&&confirm_key='+cky,{
					confirm:'Yes',
					localUserCheck:localUserCheck,
					sid:sid,
					mode:'friends',
					sess:sid,
					add:add,
					user_id:uid,
					submit:1
				},function(data){
					location.reload();
				}
			);
		}
	);
}
script = document.createElement("script"), 
script.innerHTML = AddFriend;
document.body.appendChild(script);

$( document ).ready( function(){
	$($('a>i.icon-plus-sign').parent()).attr('href','#').attr('onclick','AddFriend()');
});