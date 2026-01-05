// ==UserScript==
// @name            Custom Styles Kaskus
// @description     custom tampilan kaskus + bukan Quick Reply
// @author          ndi
// @version         1.3.2
// @compatible      Greasemonkey
// @require         http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @grant           GM_addStyle
// @include         *.kaskus.co.id/*
// @exclude         *.kaskus.co.id
// @exclude         *.kaskus.co.id/
// @exclude         *.kaskus.co.id/forum
// @exclude         *.kaskus.co.id/myforum
// @exclude         *.kaskus.co.id/fjb
// @exclude         *infokost.kaskus.co.id/
// @exclude         *.kaskus.co.id/group
// @namespace       https://greasyfork.org/en/scripts/7732-custom-styles-kaskus
// @downloadURL https://update.greasyfork.org/scripts/7732/Custom%20Styles%20Kaskus.user.js
// @updateURL https://update.greasyfork.org/scripts/7732/Custom%20Styles%20Kaskus.meta.js
// ==/UserScript==

$(function(){
var tom = $('a.btn:contains("Post Reply"), a.btn:contains("Reply")');
var lin = tom.attr('href');
var mg = document.createElement('div');
mg.setAttribute('id','form-replei');
document.body.appendChild(mg);
mg.innerHTML = ''
+'<div class="repl">'
+'<a class="tutup thumbnail-close" style="position:relative"></a>'
+'<iframe id="fram" scrolling="auto" name="myFram" src="'+lin+'"></iframe>'
+'</div>';

GM_addStyle(''
//kuik replei
+'#form-replei{display:none;width:100%;height:100%;background:rgba(0,0,0,0.6);position:fixed; top:0;z-index:999;overflow:hidden}'
+'.repl{width:700px;height:550px;margin:30px auto 0;background:#e4e4e4}'
+'.tutup{float:right;top:0;right:0;cursor:pointer;}'
+'#fram{width:100%;height:100%;border:0}'
//kaskus
+'body{background:#e3e3e3}'
+'.navbar{background:#eee;border-bottom:1px solid #fff}'
+'.related-thread, .sidebar-wrap,.ads-lb-wrap{display:none;}'
+'.main-content{width:100%}'
+'.container{width:1024px !important}'
+'.user-control-stick{width:1024px}'
+'.post-entry td.icon{width:50px}'
+'body.response #thread_post_list .row.nor-post .postlist .entry-body{width:890px}'
+'body.response #thread_post_list .row.nor-post .postlist .author{width:130px}'
+'body.response #thread_post_list .row.nor-post .postlist .author figure{width:110px;height:110px}'
+'body.response #thread_post_list .row.nor-post .postlist .user-avatar{width:110px;height:110px;border:0}'
+'body.response #thread_post_list .row.nor-post .postlist .author .photo{max-width:110px;max-height:110px}'
);

tom.delay(1000).removeAttr('href');
$('.listing-table .post-title a').attr('target','_blank');//open thread new tab
$('.tutup').click(function(){$('#form-replei').css('display','none');});

$(document).keypress('z',function (e) {
 if(e.ctrlKey){
    tom.click();
    return false;  
  }
});   

tom.click(function(e){
	e.preventDefault();
	csss();
	var ifr = $('#fram').contents();
	ifr.find('textarea#reply-messsage').focus();
	var ifra = ifr.find('#button-reply');

	ifra.click(function(){
		var set = setInterval(function(){
			var reff = $('#fram').contents().find('.message a').attr('href');
			if (reff.length){
			top.location.href=''+reff+'';
			clearInterval(set);
				}
			else {
			csss();
			var ifr = $('#fram').contents();
			ifr.find('input#recaptcha_response_field').focus();
				}
		},2000);
		})

});

function csss(){
	var ifr = $('#fram').contents(),
	fg2 = ifr.find('.form-group:nth-child(2)'),
	fg3 = ifr.find('.form-group:nth-child(3)'),
	fg4 = ifr.find('.form-group:nth-child(4)'),
	fg5 = ifr.find('.form-group:nth-child(5)'),
	fgac = ifr.find('.actions');
	$('#form-replei').show();
	ifr.find('body').css('overflow-x','hidden');
	ifr.find(' #main .row:nth-child(-n+2), #feedback, .sidebar, .form-group:nth-child(3),.form-group:nth-child(4), .form-group:nth-child(n+7), .form-group:last-child, hr').css('display','none');
	ifr.find('header,.site-footer ,#preview-post,#floating_notice').remove();
	ifr.find('.reply-form, .main').css({'margin':'0','width':'680px','margin-left':'5px'});
    ifr.find('.main-content').css({'width':'680px'});
	ifr.find('.form-group').css('margin','0 0 5px');
	
var txtLen = ifr.find('#txtLen').hasClass('Len');
if(!txtLen){
	ifr.find('#txtLen').addClass('Len');
	ifr.find('#txtLen').after('<ul class="ul"><li class="smili"></li><li class="uplod"></li></ul>');
	ifr.find('.ul').css({'height':'20px','float':'right','list-style-type':'none'});
	ifr.find('.smili').addClass('btn-orange').text('Smiley').css({'margin':'5px 5px 0 0','padding':'0 5px','float':'left','cursor':'pointer'});
	ifr.find('.uplod').addClass('btn-orange').text('Upload').css({'margin-top':'5px','padding':'0 5px','float':'left','cursor':'pointer'})
	ifr.find('.smili').click(function(){
	ifr.find('html,body').animate({scrollTop:550});
	fg3.toggle();
	ifr.find('.opensmilies').css('right','40px').after('<div class="thumbnail-close smil" style="margin-right:10px;margin-top:10px;cursor:pointer" title="close smiley"/>');
	ifr.find('.smil').click(function(){fg3.css('display','none')});
	});
	
	ifr.find('.uplod').click(function(){
	var liUpd = ifr.find('.form-group:nth-child(4) .control-label,.form-group:nth-child(4) .col-xs-10');
	ifr.find('html,body').animate({scrollTop:550});
	fg4.toggle();
	fg4.css('padding','10px');
	ifr.find('.form-group:nth-child(4)').html('<div id="upd"/>');
	ifr.find('#upd').append(liUpd);
	ifr.find('.form-group:nth-child(4) .col-xs-10').prepend('<div class="thumbnail-close tupUpl" style="margin-right:5px;margin-top:5px;cursor:pointer" title="close uploader"/>')
	ifr.find('#upd').css({'border':'1px solid #d4d4d4','padding':'5px','overflow':'hidden'});
	ifr.find('.tupUpl').click(function(){fg4.css('display','none')});
	});
	}
	}
//end
})();