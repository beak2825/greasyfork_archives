// ==UserScript==
// @name         unity
// @version      0.4.1
// @description  hkgalden utilities
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @include      http://*hkgalden.com/*
// @namespace    hkga unity
// @copyright    ignite
// @downloadURL https://update.greasyfork.org/scripts/6596/unity.user.js
// @updateURL https://update.greasyfork.org/scripts/6596/unity.meta.js
// ==/UserScript==
(function(W, D, G, $, $$){
	'use strict';
    $ = W.$;
    $.fn.findAtDepth = function(selector, maxDepth){
        var depths = [], i;
        if(maxDepth > 0){
            for(i = 1; i <= maxDepth; i++) depths.push('> ' + new Array(i).join('* > ') + selector);
            selector = depths.join(', ');
        }
        return this.find(selector);
    };
	$$ = function(q){return D.querySelectorAll(q)};
    
	if(!G.GM_getValue || (G.GM_getValue.toString && G.GM_getValue.toString().indexOf("not supported") > -1)){
		G.GM_getValue=function(key,def){return localStorage[key] || def;};
		G.GM_setValue=function (key,value){return localStorage[key]=value;};
		G.GM_deleteValue=function (key) {return delete localStorage[key];};
	}
    
	var CHKBX_OPTS = ['nextPageHideAuthor', 'lessQuote', 'clickToShowPics', 'adBlock'],
        CHKBX_OPTS_TITLE = {
            nextPageHideAuthor: '只在第一頁顯示 #0',
            lessQuote: '限制Quote數量',
            clickToShowPics: '不自動載入圖片',
            adBlock: '移除廣告'
        },
        CFG = {};
    for(var i = 0, l = CHKBX_OPTS.length; i < l; i++){
        CFG[CHKBX_OPTS[i]]   = G.GM_getValue(CHKBX_OPTS[i], false);
    }
    var API = {}, _exec;
    API.isLoggedIn           = $$('#gb .actp a[href="/my"]').length;
    // topics
    _exec = /\/[A-Za-z]{2}\/(\d+)/.exec(location.href);
    API.topics = {};
    API.topics.is            = location.href.indexOf('topics/') > 0;
    API.topics.page          = API.topics.is ? _exec ? +_exec[1] : 1 : 0;
    // view
    _exec = /\/page\/(\d+)/.exec(location.href);
    API.view = {};
    API.view.is              = location.href.indexOf('view/') > 0;
    API.view.page            = API.view.is ? _exec ? +_exec[1] : 1 : 0;
    API.view.author          = API.view.is ? $$('.gpt.author .dtl>.unm>.name')[0].innerHTML : null;
    // insert config panel
    var panel = $('<a/>', {
        href:'#',
        text:'unity',
    }).on('click', function(e){
        e.preventDefault();
        $('body').append('<div id="unity--panel" style="background:rgba(0,0,0,.4);height:100%;left:0;position:absolute;top:'+D.body.scrollTop+'px;width:100%;z-index:999999">\
            <div style="display:table;height:100%;width:100%">\
                <div style="display:table-cell;height:100%;vertical-align: middle;width:100%">\
                    <div id="unity--config"></div>\
                </div>\
            </div>\
        </div>').css({overflow:'hidden'});
        var chkbxes = '<table class="nxtb" style="background:#cec;width:540px">';
        for(var i = 0, l = CHKBX_OPTS.length; i < l; i++){
            chkbxes += '<tr><td>'+CHKBX_OPTS_TITLE[CHKBX_OPTS[i]]+'</td><td><input id="'+CHKBX_OPTS[i]+'" type="checkbox"'+(G.GM_getValue(CHKBX_OPTS[i]) ? ' checked' : '')+'></td>';
        }
        chkbxes += '</table>';
        $('#unity--config').append([
            $('<h2 style="background:#fe5;border-radius:50%;cursor:pointer;font-weight:700;line-height:64px;margin:0;position:absolute;right:24px;top:24px;width:64px;">×</h2>').on('click', function(){
                $(D).off('.unity');
                $('#unity--panel').remove();
                $('body').css({overflow:'auto'});
            }),
            chkbxes,
            '<br>',
            $('<button style="background:#eee;border-radius:50%;height:64px;margin:32px 0;width:64px">確認</button>').on('click', function(){
                location.reload();
            })
        ]);
        $(D).on('change.unity', '#unity--config :checkbox', function(){
            G.GM_setValue(this.getAttribute('id'), this.checked);
        });
    });
    panel.insertBefore('#gb .actp :first-child');
    // mod
    var DOMwatcher = function(root, callback){
		var __appendChild = document.body.appendChild,
		patch = function(node){
			if(typeof node.appendChild !== 'undefined' && node.nodeName !== '#text'){
				node.appendChild = function(incomingNode){
				callback(node, incomingNode);
				patch(incomingNode);
				walk(incomingNode);
				__appendChild.call(node, incomingNode);
				};
			}
			walk(node);
		},
		walk = function(node){
			var i = node.childNodes.length;
			while(i--) patch(node.childNodes[i]);
		};
		patch(root);
	};
    if(API.view.is){
        if(CFG.nextPageHideAuthor && API.view.page > 1){
            var ctn = $('.gpt.author>.r>.ctn');
            ctn.hide().after($('<div class="ctn"><a href="#" style="color:#499">按此顯示 #0</a></div>').on('click',function(e){
                e.preventDefault();
                $(this).remove() && ctn.show();
            }));
        }
        var hideQuotes = function(){
                if(!CFG.lessQuote) return;
                $.each($$('.gpt>.r>.ctn'), function(i, e){
                    var d = $(e).findAtDepth('blockquote:not(.united)', 3), b;
                    if(d.length === 3){
                        b = $(d[2]);
                        b.hide().addClass('united');
                        $('<blockquote class="united" style="background:#cea;color:#000;cursor:pointer;display:inline-block;margin-bottom:24px">顯示更多引用回覆</blockquote>').on('click',function(){
                            b.show();
                            $(this).remove();
                        }).insertAfter(b);
                    }
                });
            },
            hidePics = function(){
                if(!CFG.clickToShowPics) return;
                $('body').css({overflow:'hidden'});
                $.each($$('.gpt>.r>.ctn img[data-original]'), function(i, e){
                    var i = $('<img alt src="'+this.getAttribute('data-original')+'" style="display:none">');
                    i.on('load', function(){
                        if(i[0].width > 72 && i[0].height > 72){
                            i.parent().after($('<div class="ico" style="cursor:pointer;display:inline-block;font-size:48px;height:48px;line-height:48px;text-align:center;width:48px;"></div>').on('click',function(e){
                                $(this).remove() && i.show();
                            }));
                        }else i.show();
                    });
                    $(this).replaceWith(i);
                });
                $('body').css({overflow:'auto'});
            },
            adBlock = function(){
                if(!CFG.adBlock) return;
                $('.gpt>.r .ad').prev('hr').andSelf().add('.gpt>.r .aderfly-ad').remove();
                $('#main~.adContainer,header~.adContainer').remove();
            };
        hideQuotes();
        hidePics();
        adBlock();
        $(D).on('DOMNodeInserted', '#main>article', function(e){
            if(e.target.className.indexOf('replies') > 0){
                hideQuotes();
                hidePics();
                adBlock();
            }
        });
    }
})(unsafeWindow, document, this);