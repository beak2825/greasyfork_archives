// ==UserScript==
// @name            Indie Gala Show Key
// @namespace       iFantz7E.GalaShowKey
// @version         1.16
// @description     Show your keys instantly
// @match           http://www.indiegala.com/profile?user_id=*
// @match           https://www.indiegala.com/profile?user_id=*
// @match           http://www.indiegala.com/gift?gift_id=*
// @match           https://www.indiegala.com/gift?gift_id=*
// @icon            http://www.indiegala.com/favicon.ico
// @grant           GM_addStyle
// @run-at          document-end
// @license         GPL-3.0-only
// @copyright       2014, 7-elephant
// @supportURL      https://steamcommunity.com/id/7-elephant/
// @contributionURL https://www.paypal.me/iFantz7E
// @downloadURL https://update.greasyfork.org/scripts/6597/Indie%20Gala%20Show%20Key.user.js
// @updateURL https://update.greasyfork.org/scripts/6597/Indie%20Gala%20Show%20Key.meta.js
// ==/UserScript==

// License: GPL-3.0-only - https://spdx.org/licenses/GPL-3.0-only.html

// Since 5 Feb 2014
// http://userscripts.org/scripts/show/331276
// https://greasyfork.org/en/scripts/6597-indie-gala-show-key

GM_addStyle(
	"   .span-key.steam-btn > .option.desura-key > input { width: 300px; } "
	+ " .span-key.steam-btn > div > input { text-align: center; } "
	+ " .info_key_text, .option[id^='fetching_'], .option[id^='linking_'] "
	+ "  { display: none !important; } "
	+ " #icon-gift { display: inline-block; } "
	+ " .span-key.option { display: auto; } "
	+ " .order-button-profile-press { cursor: auto; } "
	+ " a[id^='fetchlink_'] { float: left !important; } "
	+ " .igsk_fetchAll { width: auto !important; margin-left: 10px; padding-left: 10px; padding-right: 10px; } "
);

var displayNone = "none";
var displayAuto = "";

var mainTmId = 0;

function main()
{
	clearTimeout(mainTmId);
	mainTmId = setTimeout(function()
	{
		var as = document.querySelectorAll(".span-key.steam-btn > a");
		for (var i = 0; i < as.length; i++)
		{
			if (as[i].getAttribute("id").indexOf("fetchlink_") != 0)
			{
				if (as[i].style.display != displayNone)
				{
					as[i].style.display = displayNone;
				}
			}
		}
		
		var aRedeems = document.querySelectorAll(".span-key.steam-btn > a[id^='fetchlink_']");
		for (var i = 0; i < aRedeems.length; i++)
		{
			if (aRedeems[i].style.display != displayNone)
			{
				var btn = aRedeems[i].parentElement.querySelector(".order-button-profile-press");
				if (btn != null)
				{
					btn.style.display = displayNone;
				}
				
				aRedeems[i].param = i;
				aRedeems[i].addEventListener("DOMAttrModified", function(ev)
				{
					setTimeout(function()
					{
						var index = ev.target.param;
						if (aRedeems[index].style.display == displayNone)
						{
							var btn = aRedeems[index].parentElement.querySelector(".order-button-profile-press");
							if (btn != null)
							{
								btn.style.display = displayAuto;
							}
						}				
					}, 1000);
				});
			}
		}

		// remove how to redeem
		var strHowTo = "activate";
		as = document.querySelectorAll(".span-key.steam-btn > div > a");
		for (var i = 0; i < as.length; i++)
		{
			if (as[i].textContent.indexOf(strHowTo) > -1)
			{
				if (as[i].style.display != displayNone)
				{
					as[i].style.display = displayNone;
				}
			}
		}

		// show keys
		var divs = document.querySelectorAll(".span-key.steam-btn > div");
		for (var i = 0; i < divs.length; i++)
		{
			if (divs[i].style.display != displayAuto)
			{
				divs[i].style.display = displayAuto;
			}
		}

		// auto select text
		var inputs = document.querySelectorAll(".span-key.steam-btn > div > input");
		for (var i = 0; i < inputs.length; i++)
		{
			if (inputs[i].getAttribute("onclick") == null)
			{
				inputs[i].setAttribute("onclick","this.select();");
			}
		}
		
		// prepare for auto fetching
		var divGames = document.querySelectorAll(".in .in .in #steam-key-games, #this_your_gift");
		for (var i = 0; i < divGames.length; i++)
		{
			var isEdit = false;
			var aRedeems = divGames[i].querySelectorAll(".span-key.steam-btn > a[id^='fetchlink_']");
			for (var j = 0; j < aRedeems.length; j++)
			{
				if (aRedeems[j].style.display != displayNone)
				{
					isEdit = true;
					break;
				}
			}
			if (isEdit)
			{
				if (divGames[i].querySelector(".game-keys-title .igsk_fetchAll") == null)
				{
					var h3 = divGames[i].querySelector(".game-keys-title h3");
					h3.innerHTML = h3.innerHTML + " <input type='button' class='button igsk_fetchAll' "
						+ " value='Fetch All Keys' onclick='igsk_autoFetch(); this.style.display = \"none\"; return false;' >";
				}
			}
		}
	}, 300);
}

document.addEventListener("DOMNodeInserted", main);


var clientScript = ' \
	confirm = function(msg) \
	{ \
		if (msg.indexOf("permalink") < 0) \
			console.log(msg); \
		return true; \
	}; \
	 \
	function igsk_autoFetch() \
	{ \
		var tmId = setInterval(function() \
		{ \
			var isEdit = false; \
			var aRedeems = document.querySelectorAll(".span-key.steam-btn > a[id^=\'fetchlink_\']"); \
			for (var i = 0; i < aRedeems.length; i++) \
			{ \
				if (aRedeems[i].style.display != "none") \
				{ \
					var attrOnClick = aRedeems[i].getAttribute("onclick"); \
					if (attrOnClick.indexOf("fn_fetchserial_2(") == 0) \
					{ \
						var param = attrOnClick.replace("fn_fetchserial_2(\'", "").replace("\', this); return false;", ""); \
						var params = param.split("\', \'"); \
						var serial = params[0]; \
						var store = params[1]; \
						globalAjaxSemaphore = false; \
						fn_fetchserial_2(serial, store, aRedeems[i]); \
						isEdit = true; \
						break; \
					} \
				} \
			} \
			if (!isEdit) \
			{ \
				clearInterval(tmId); \
			} \
		}, 300); \
	} \
';

var eleClientScript = document.createElement("script");
eleClientScript.innerHTML = clientScript;
document.head.appendChild(eleClientScript);