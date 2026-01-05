// ==UserScript==
// @name        KoL Message Templates
// @namespace   http://greasyfork.org/
// @include     https://www.kingdomofloathing.com/sendmessage.php*
// @include     http://127.0.0.1:60080/sendmessage.php*
// @include     http://localhost:60080/sendmessage.php*
// @include     https://www.kingdomofloathing.com/town_sendgift.php*
// @include     http://127.0.0.1:60080/town_sendgift.php*
// @include     http://localhost:60080/town_sendgift.php*
// @grant       GM_getValue
// @grant       GM_setValue
// @version     1.2
// @description Allows saving predefined templates of kmails and gift packages, including attached items, for the game Kingdom of Loathing.
// @require	http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/6560/KoL%20Message%20Templates.user.js
// @updateURL https://update.greasyfork.org/scripts/6560/KoL%20Message%20Templates.meta.js
// ==/UserScript==

var savedKmails = [];
var savedGifts = [];

function appendLog(entry)
{
	$("p.kmtend").append($("<div class=kmtlog>").html(entry));
}

function saveKmail()
{
	$(".kmtlog").remove();
	var kmail = {};
	var defaultname = "";
	if( $("select.kmt").val() > 0 )
	{
		defaultname = $("select.kmt option:selected").text();
	}
	kmail.name = prompt("Enter name to save as", defaultname);
	if (kmail.name != null && kmail.name != "")
	{
		kmail.text = $("[name=message]").val();
		kmail.num = [];
		kmail.item = [];
		for(var i = 1; i <= 11; i++)
		{
			kmail.num.push($("[name=howmany" + i + "]").val());
			kmail.item.push($("[name=whichitem" + i + "]").val());
		}
		if( kmail.name == defaultname )
		{
			savedKmails[$("select.kmt").val() - 1] = kmail;
			GM_setValue("kmails", JSON.stringify(savedKmails));
			buildForKmail();
			appendLog("<br>Overwrote " + kmail.name + ".");
		}
		else
		{
			savedKmails.push(kmail);
			GM_setValue("kmails", JSON.stringify(savedKmails));
			buildForKmail();
			appendLog("<br>Saved new entry as " + kmail.name + ".");
		}
	}
	else
	{
		appendLog("<br>Cancelled save.");
	}
}

function deleteKmail()
{
	$(".kmtlog").remove();
	if( $("select.kmt").val() > 0 )
	{
		if( confirm("Delete " + $("select.kmt option:selected").text() + "?") )
		{
			savedKmails.splice( $("select.kmt option:selected").val() - 1, 1);
			GM_setValue("kmails", JSON.stringify(savedKmails));
			buildForKmail();
			appendLog("<br>Deleted.");
		}
		else
		{
			appendLog("<br>Cancelled delete.");
		}
	}
	else
	{
		appendLog("<br>Please select a preset.");
		$("select.kmt").focus();
	}
}

function applyKmail()
{
	$(".kmtlog").remove();
	var selected = $("select.kmt").val();
	if( selected > 0 )
	{
		$("[name=message]").val(savedKmails[selected - 1].text);
		var missingitems = [];
		var insufficientitems = [];
		for(var i = 1; i <= 11; i++)
		{
			var howmany = parseInt(savedKmails[selected - 1].num[i - 1]);
			var whichitem = savedKmails[selected - 1].item[i - 1];
			$("[name=howmany" + i + "]").val(howmany);
			$("[name=whichitem" + i + "]").val(whichitem);
			if($("[name=whichitem" + i + "]").val() == null)
			{
				missingitems.push(whichitem);
			}
			else if (whichitem > 0)
			{
				var itemtext = $("[name=whichitem" + i + "] option[value=" + whichitem + "]").text();
				actualamount = parseInt(itemtext.replace(/.*\((\d*)\)$/, "$1"));
				if(howmany > actualamount)
				{
					insufficientitems.push(itemtext.replace(/(.*) \(\d*\)$/, "$1"));
				}
			}
		}
		if(missingitems.length > 0)
		{
			appendLog("<br>Missing items:");
		}
		for(var i = 0; i < missingitems.length; i++)
		{
			var url = "http://kol.coldfront.net/thekolwiki/index.php/Items_by_number_(" + Math.max(1,missingitems[i] - (missingitems[i] % 100)) + "-" + (missingitems[i] - (missingitems[i] % 100) + 99) + ")";
			appendLog("<a target='_blank' href='" + url + "'>ID: " + missingitems[i] + "</a>");
		}
		if (insufficientitems.length > 0)
		{
			appendLog("<br>Insufficient items:");
		}
		for(var i = 0; i < insufficientitems.length; i++)
		{
			appendLog(insufficientitems[i]);
		}
	}
	else
	{
		appendLog("<br>Please select a preset.");
		$("select.kmt").focus();
	}
}

function buildForKmail()
{
	$(".kmt, .kmtend, .kmtlog").remove();
	while( $("[name=howmany11]").val() === undefined )
	{
		unsafeWindow.addlist();
	}
	$("body").prepend($("<p class=kmtend>"));
	var sel = $("<select class=kmt />");
	$(sel).append($("<option />", {value: 0, text: "-Select a preset-"}));
	for(var i = 0; i < savedKmails.length; i++)
	{
		$(sel).append($("<option />", {value: i+1, text: savedKmails[i].name}));
	}
	$("p.kmtend").append(sel);
	$("p.kmtend").append($("<button>Apply</button>").click(applyKmail));
	$("p.kmtend").append($("<button>Save</button>").click(saveKmail));
	$("p.kmtend").append($("<button>Delete</button>").click(deleteKmail));
	$("p.kmtend").append($("<button>Export</button>").click(exportSavedKmails));
	$("p.kmtend").append($("<button>Import</button>").click(importSavedKmails));
}

function applyGift()
{
	$(".kmtlog").remove();
	var prefix = (unsafeWindow.swapper == '2' ? "hagnks_" : "");
	var selected = $("select.kmt").val();
	if( selected > 0 )
	{
		$("[name=note]").val(savedGifts[selected - 1].note);
		$("[name=insidenote]").val(savedGifts[selected - 1].insidenote);
		$("input[name=whichpackage][value=" + savedGifts[selected - 1].packagetype + "]").prop('checked','checked');
		var missingitems = [];
		var insufficientitems = [];
		for(var i = 1; i <= 11; i++)
		{
			var howmany = parseInt(savedGifts[selected - 1].num[i - 1]);
			var whichitem = savedGifts[selected - 1].item[i - 1];
			$("[name=" + prefix  + "howmany" + i + "]").val(howmany);
			$("[name=" + prefix  + "whichitem" + i + "]").val(whichitem);
			if($("[name=" + prefix  + "whichitem" + i + "]").val() == null)
			{
				missingitems.push(whichitem);
			}
			else if (whichitem > 0)
			{
				var itemtext = $("[name=" + prefix  + "whichitem" + i + "] option[value=" + whichitem + "]").text();
				actualamount = parseInt(itemtext.replace(/.*\((\d*)\)$/, "$1"));
				if(howmany > actualamount)
				{
					insufficientitems.push(itemtext.replace(/(.*) \(\d*\)$/, "$1"));
				}
			}
		}
		if(missingitems.length > 0)
		{
			appendLog("<br>Missing items:");
		}
		for(var i = 0; i < missingitems.length; i++)
		{
			var url = "http://kol.coldfront.net/thekolwiki/index.php/Items_by_number_(" + Math.max(1,missingitems[i] - (missingitems[i] % 100)) + "-" + (missingitems[i] - (missingitems[i] % 100) + 99) + ")";
			appendLog("<a target='_blank' href='" + url + "'>ID: " + missingitems[i] + "</a>");
		}
		if (insufficientitems.length > 0)
		{
			appendLog("<br>Insufficient items:");
		}
		for(var i = 0; i < insufficientitems.length; i++)
		{
			appendLog(insufficientitems[i]);
		}
	}
	else
	{
		appendLog("<br>Please select a preset.");
		$("select.kmt").focus();
	}
}

function saveGift()
{
	$(".kmtlog").remove();
	var prefix = (unsafeWindow.swapper == '2' ? "hagnks_" : "");
	var gift = {};
	var defaultname = "";
	if( $("select.kmt").val() > 0 )
	{
		defaultname = $("select.kmt option:selected").text();
	}
	gift.name = prompt("Enter name to save as", defaultname);
	if (gift.name != null && gift.name != "")
	{
		gift.note = $("[name=note]").val();
		gift.insidenote = $("[name=insidenote]").val();
		gift.packagetype = $("input[name=whichpackage]:checked").val();
		gift.num = [];
		gift.item = [];
		for(var i = 1; i <= 11; i++)
		{
			gift.num.push($("[name=" + prefix  + "howmany" + i + "]").val());
			gift.item.push($("[name=" + prefix  + "whichitem" + i + "]").val());
		}
		if( gift.name == defaultname )
		{
			savedGifts[$("select.kmt").val() - 1] = gift;
			GM_setValue("gifts", JSON.stringify(savedGifts));
			buildForGift();
			appendLog("<br>Overwrote " + gift.name + ".");
		}
		else
		{
			savedGifts.push(gift);
			GM_setValue("gifts", JSON.stringify(savedGifts));
			buildForGift();
			appendLog("<br>Saved new entry as " + gift.name + ".");
		}
	}
	else
	{
		appendLog("<br>Cancelled save.");
	}
}

function deleteGift()
{
	$(".kmtlog").remove();
	if( $("select.kmt").val() > 0 )
	{
		if( confirm("Delete " + $("select.kmt option:selected").text() + "?") )
		{
			savedGifts.splice( $("select.kmt option:selected").val() - 1, 1);
			GM_setValue("gifts", JSON.stringify(savedGifts));
			buildForGift();
			appendLog("<br>Deleted.");
		}
		else
		{
			appendLog("<br>Cancelled delete.");
		}
	}
	else
	{
		appendLog("<br>Please select a preset.");
		$("select.kmt").focus();
	}
}

function buildForGift()
{
	$(".kmt, .kmtend, .kmtlog").remove();
	var prefix = (unsafeWindow.swapper == '2' ? "hagnks_" : "");
	while( $("[name=" + prefix  + "howmany11]").val() === undefined )
	{
		unsafeWindow.addRow(unsafeWindow.swapper);
	}
	//$("select[name=fromwhere]").prop('disabled', 'disabled');
	$("body").prepend($("<p class=kmtend>"));
	var sel = $("<select class=kmt />");
	$(sel).append($("<option />", {value: 0, text: "-Select a preset-"}));
	for(var i = 0; i < savedGifts.length; i++)
	{
		$(sel).append($("<option />", {value: i+1, text: savedGifts[i].name}));
	}
	$("p.kmtend").append(sel);
	$("p.kmtend").append($("<button>Apply</button>").click(applyGift));
	$("p.kmtend").append($("<button>Save</button>").click(saveGift));
	$("p.kmtend").append($("<button>Delete</button>").click(deleteGift));
	$("p.kmtend").append($("<button>Export</button>").click(exportSavedGifts));
	$("p.kmtend").append($("<button>Import</button>").click(importSavedGifts));
}

function exportSavedKmails()
{
	$(".kmtlog").remove();
	prompt("Copy to save", JSON.stringify(savedKmails));
	appendLog("<br>Kmails exported.");
}

function exportSavedGifts()
{
	$(".kmtlog").remove();
	prompt("Copy to save", JSON.stringify(savedGifts));
	appendLog("<br>Gifts exported.");
}

function importSavedKmails()
{
	$(".kmtlog").remove();
	var presets = "";
	presets = prompt("Paste export string. This clears any current presets!");
	if(presets != null && presets != "")
	{
		savedKmails = JSON.parse(presets);
		GM_setValue("kmails", JSON.stringify(savedKmails));
		buildForKmail();
		appendLog("<br>Kmails imported.");
	}
	else
	{
		appendLog("<br>Cancelled kmail import.");
	}
}

function importSavedGifts()
{
	$(".kmtlog").remove();
	var presets = "";
	presets = prompt("Paste export string. This clears any current presets!");
	if(presets != null && presets != "")
	{
		savedGifts = JSON.parse(presets);
		GM_setValue("gifts", JSON.stringify(savedGifts));
		buildForGift();
		appendLog("<br>Gifts imported.");
	}
	else
	{
		appendLog("<br>Cancelled gift import.");
	}
}

if (window.location.pathname.indexOf("/sendmessage.php") != -1)
{
	savedKmails = JSON.parse(GM_getValue("kmails", "[]"));
	var btn = $("<button class=kmt>Use preset kmail</button><p class=kmt>").click(buildForKmail);
	$("body").prepend($("<p class=kmtend>"));
	$("p.kmtend").append(btn);
}

if (window.location.pathname.indexOf("/town_sendgift.php") != -1)
{
	savedGifts = JSON.parse(GM_getValue("gifts", "[]"));
	var btn;
	$("body").prepend($("<p class=kmtend>"));
	if( $("select[name=fromwhere]").length > 0 )
	{
		$("select[name=fromwhere]").prop('disabled', false);
		btn = $("<button class=kmt>Use preset gift (storage)</button>").click(function(){$("select[name=fromwhere]").val(1);unsafeWindow.swapper='1';unsafeWindow.swap();buildForGift();});
		$("p.kmtend").append(btn);
		btn = $("<button class=kmt>Use preset gift (inventory)</button>").click(function(){$("select[name=fromwhere]").val(0);unsafeWindow.swapper='2';unsafeWindow.swap();buildForGift();});
		$("p.kmtend").append(btn);
	}
	else
	{
		btn = $("<button class=kmt>Use preset gift</button>").click(buildForGift);
		$("p.kmtend").append(btn);
	}
}
