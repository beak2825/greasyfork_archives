// ==UserScript==
// @name        users
// @namespace   erepublik
// @description users, users
// @include     http://www.erepublik.com/en
// @version     1.01
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8730/users.user.js
// @updateURL https://update.greasyfork.org/scripts/8730/users.meta.js
// ==/UserScript==
function style(t) {
    $("head").append("<style>" + t + "</style>")
}

function parseOrgs() {
    var ids = [],
        ct = 0;
    src = $("#source").val().split('\n');
    ctl = src.length;
    $.each(src, function(i, el) {
        if (el.match(/profile\//)) {
            id = el.split(/profile\//)[1];
        } else {
            id = undefined;
        }
        if (id != undefined) {
            if ($.inArray(id, ids) === -1) {
                ids.push(id);
                $.ajax({
                        url: "/en/citizen/profile/" + id,
                    })
                    .done(function(t) {
                        var nameh = $(t).find('.citizen_profile_header h2').html();
                        if (nameh.length > 0) {
                            cid = $(t).find(".view_friends").attr("href").split("\/")[4];
                            var name = $.trim(nameh.split('\<\/strong\>')[2]);
                            var exp = $.trim(nameh.split('\<\/strong\>')[1].split("\/")[1].replace(/[^0-9]/g, ""));
                            var level = $.trim($(t).find('.citizen_level').text());
                            var mu = $.trim($(t).find('.citizen_activity .place:nth-child(2) span').text());
                            mu = mu.length ? mu : "Без отряд";
                            var strength = $(t).find(".mb_bottom:first").text().replace(/[^0-9\.]/g, "").replace(/\./g, decimalseparator);
                            $j.ajax({
                                url: "https://docs.google.com/forms/d/1qokC_zZpB5bu5Ly_ajXLwUQ5eCrznqri0OSZsMYF8-s/formResponse",
                                data: {
                                    "entry.964472630":  cid,
                                    "entry.537114761":  name,
                                    "entry.646033409":  strength,
                                    "entry.367202904":  exp,
                                    "entry.76176228":   level,
                                    "entry.2087266672": mu
                                },
                                type: "POST",
                            });
                            ct++;
                            ww = Math.round(ct / ctl * 100);
                            $('#ctProgress div').css("width", ww + "%").text(ww + "%");
                        }
                    })
            }
        }
    })
}

function shownag() {
    style("#orgsnag{margin:5px 0 -5px;width:100%;display:inline-block;cursor:pointer;background:#83B70B;color:white;font:bold 11px Arial;text-align:center;padding:3px 0px;border-radius:1px}#orgsnag:hover,#orgsopts a:hover{background:#FB7E3D}#orgsopts a{cursor:pointer;color:white;font-weight:bold;background:#83B70B;padding:5px;margin:20px;border-radius:1px}")
    style(".belichko{color: white;}#decsep{font-size:14px;}");
    style("#ctProgress { width: 150px; margin: 0 0 10px 0; height: 16px; border: 1px solid #fff !important; background-color: #292929 !important; }");
    style("#ctProgress div { height: 100%; color: #fff; text-align: right; line-height: 16px; width: 0; background-color: #0099ff !important; }");
    $("body").append('<div id="orgsblock" style="display:none;z-index:999998;position:fixed;top:0;width:100%;height:100%;background:rgba(0,0,0,0.6)"></div><div id="orgsopts" style="display:none;width:900px;top:100px;margin:auto;cursor:default;position:fixed;left:' + ($(window).width() - 900) / 2 + 'px;z-index:999999"></div>')
    $("#orgsopts").append('<div id="ctProgress"><div>')
    $("#orgsopts").append('<span class="belichko">Десетичен разделител </span><input id="decsep" type="text" value="' + decimalseparator + '" size="3"><br>')
    $("#orgsopts").append('<span class="belichko">Списък с играчи</span><br><textarea id="source" rows="10" cols="120"></textarea><br>')
    $("#orgsopts").append('<button id="parse">Играчи</button> <button id="close">Затвори</button><br>')
    $("#close").click(function() {
        $("#orgsopts, #orgsblock").hide();
        $("#orgsopts, #orgsblock").remove();
    })
    $("#parse").click(function() {
        decimalseparator = $("#decsep").val();
        columnseparator = $("#colsep").val();
        parseOrgs();
    })
    $("#orgsopts, #orgsblock").show()
}
var $ = jQuery
var m = {};
id = 0;
var decimalseparator = ",";

$("#notify_clone").before("<div style='position: fixed; top: 0; left: 50px; width: 16px; color: #fff; background-color: navy; border : 1px solid navy; cursor: pointer; margin: 7px 0 0 1px; -moz-border-radius: 3px; -webkit-border-radius: 3px; -khtml-border-radius: 3px; border-radius: 3px;'><a id='pitanka' href='javascript:void(0);'> !!!! </a></div>");
$("#pitanka").click(function() {
    shownag();
})