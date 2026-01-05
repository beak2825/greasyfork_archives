// ==UserScript==
// @author         	hd49
// @version         1.0.2
// @name 			Alkışlarla Yaşıyorum İçerik Güncelleme.
// @require 		http://code.jquery.com/jquery-latest.min.js
// @include 		http://alkislarlayasiyorum.com/icerik/*
// @include 		http://*.alkislarlayasiyorum.com/icerik/*
// @description		popüler yorumları oylama, yorumlar kısmı için otomatik kaydırma, kötü yorumları seri eksileme, sekme geçişinde durdurmayı engelleme.
// @run-at 			document-end
// @grant       	none
// @namespace https://greasyfork.org/users/9588
// @downloadURL https://update.greasyfork.org/scripts/8453/Alk%C4%B1%C5%9Flarla%20Ya%C5%9F%C4%B1yorum%20%C4%B0%C3%A7erik%20G%C3%BCncelleme.user.js
// @updateURL https://update.greasyfork.org/scripts/8453/Alk%C4%B1%C5%9Flarla%20Ya%C5%9F%C4%B1yorum%20%C4%B0%C3%A7erik%20G%C3%BCncelleme.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

// Remove Player APIs
setTimeout(function () {
  PLAYER_OBJECT.resume = null;
  PLAYER_OBJECT.pause = null;
  PLAYER_OBJECT.replay = null;
  PLAYER_OBJECT.seekTo = null;
  PLAYER_OBJECT.mute = null;
  PLAYER_OBJECT.unmute = null;
  PLAYER_OBJECT.setVolume = null;
  PLAYER_OBJECT.getTime = null;
}, 1000);

var popComment = document.evaluate ("//div[@class='populerYorumlar']", document, null,

XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

if (popComment && popComment.children.length) {
	var yorumList = popComment.children[2];
	yorumList.id = "populerYorumcuk";
	var popYorum = yorumList.children[0];
	var socialYorum = popYorum.children[2];
	addRateIds(socialYorum);
	popYorum = yorumList.children[2];
	socialYorum = popYorum.children[2];
	addRateIds(socialYorum);
}

function addRateIds(sNode) {
	if (!sNode) {
		return;
	}
	var rateIdNode = sNode.children[0];
	console.log(rateIdNode);
	var arr = rateIdNode.getAttribute("id").split("_");
	var popCommentId = arr[1];
	var str = '<div><a href="javascript:;" onclick="rateComment(' + popCommentId + ', \'up\')"'+
		'class="rateUp fl" title="Bu yorum iyidir." id="rate_up_' + popCommentId + '"></a>'+
		'<a href="javascript:;" onclick="rateComment(' + popCommentId + ', \'down\')"'+
		'class="rateDown fl" title="Bu yorum kötüdür." id="rate_down_' + popCommentId + '"></a></div>';
	$("#rateId_" + popCommentId).after(str);
}

rateComment = function(b, a) {
    if (member_id < 1) {
        $("#login_dialog").show();
        e.preventDefault();
    }
	
	var goodComment = false;
	var rateContent = $("#rateId_" + b).html();
	if (rateContent.length && rateContent[0] == "+") {
		goodComment = true;
	}
	
    if (goodComment && a == "down" && getCookie("down_rate_enabled") != null) {
        alert("Bu kadar sık eksi veremesiniz!");
        return false
    }
	
    $.ajax({type: "POST",url: ajaxurl + "/comment/rateComment",data: "contentId=" + content_id + "&commentId=" + b + "&rateType=" + a,success: function(c) {
            if (c != "") {
                $("#rateId_" + b).removeClass();
                if (c == "0") {
                    $("#rateId_" + b).addClass("rateItZero")
                } else {
                    if (c[0] == "-") {
                        $("#rateId_" + b).addClass("rateItBad")
                    } else {
                        $("#rateId_" + b).addClass("rateIt")
                    }
                }
                $("#rateId_" + b).html(c)
            }
            if (goodComment && a == "down") {
                var d = new Date();
                d.setTime(d.getTime() + (10 * 1000));
                document.cookie = "down_rate_enabled=1; expires=" + d.toUTCString() + "; path=/"
            }
        }})
}

loadAjaxComment = function(a) {
    $.ajax({type: "POST",url: ajaxurl + "/comment/loadNewComment",data: "page=" + a + "&contentId=" + content_id,success: function(b) {
            json = JSON.parse(b);
            $(".populerYorumlar").hide();
            $("#tumYorumlar").html(json.comments);
            $(".comment-paginator").remove();
            $("#paginatorclr").html(json.paginator);
			$("html, body").animate({scrollTop: $(".yorumlar").position().top}, "slow");
			//$(window).scrollTop($(".yorumlar").position().top);
        }})
}
