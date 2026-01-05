// ==UserScript==
// @name        ABPVN VNZ-toolkit
// @namespace   ABPVN
// @author		Hoàng Rio
// @description	Hỗ trợ thêm tính năng trên VNZ
// @homepage    http://abpvn.com
// @icon		http://i.imgur.com/vAI2Rxd.png
// @include     http://www.vn-zoom.com/f*
// @include 	http://www.vn-zoom.com/newreply.php*
// @include		http://www.vn-zoom.com/editpost.php*
// @require     https://cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.min.js
// @version     1.3.8
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9870/ABPVN%20VNZ-toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/9870/ABPVN%20VNZ-toolkit.meta.js
// ==/UserScript==
String.prototype.ismatch = function (regex){
  return this.match(regex)!==null;
};
$.getcookie=function(cookiename){
	  var value = "; " + document.cookie;
	  var parts = value.split("; " + cookiename + "=");
	  if (parts.length == 2) return parts.pop().split(";").shift();
};
var img_count=0;
function VNZ_img_view(){
	$(document).ready(function (){		
		$('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.css" type="text/css" media="screen" />');
		$('.content img').each(function (){
			if(!$(this).attr('src').ismatch("http://www.vn-zoom.com")){
				this.onclick= function () {};
				$(this).css('cursor','zoom-in');
				$(this).wrap('<a class="abpvn" style="cursor: zoom-in;" title="'+$(this).attr("src")+'" rel="group" href="'+$(this).attr("src")+'"></a>');
			}
			
		});
		$("a.abpvn").fancybox({
		'padding' : '0',
		'type' : 'image',
		'transitionIn'	:	'elastic',
		'transitionOut'	:	'elastic',
		'speedIn'		:	300, 
		'speedOut'		:	200, 
		'overlayShow'	:	true,
		'titlePosition'	: 	'over',
		'overlayOpacity': 0.8,
		'hideOnOverlayClick':  	true,
		helpers : {
        overlay : {
            css : {
                'z-index': '0',
            }
        }
    }
	});
	});
	
}
function VNZ_toolkit_options(){
	$(document).ready(function (){
		$('body').append("<div id='VNZ-toolkit-options' accesskey='v' style='width: auto; height: auto; top: 0; left: 0; position: fixed; opacity: 0.75;' title='Cài đặt ABPVN VNZ-toolkit'><img src='https://www.webanh.tk/full/h5EKCO.png' style='border-radius: 50%; box-shadow: 0px 0px 25px 5px black; cursor: pointer; width:30px; height:30px;'></img></div>");
		
		$('#VNZ-toolkit-options').append("<div id='VNZ-toolkit-options-area' style='display: none; color: white; background-color: green; margin-left: 32px; padding: 10px; box-shadow: 0px 0px 25px 5px black; border-radius: 10px; border: 1px white solid; font-size: 14px;'><center><div id='msg' style='color: red; height: 20px;'></div></center></div>");
		
		$('#VNZ-toolkit-options-area').append("<label><input id='VNZ-toolkit-img-view' checked='true' type='checkbox'/>Chế độ xem ảnh</label><br/>");
		
		$('#VNZ-toolkit-options-area').append("<label><input id='VNZ-toolkit-img-qUpload' checked='true' type='checkbox'/>Chế độ up ảnh nhanh</label><br/>");
		
		$('#VNZ-toolkit-options-area').append("<center><button id='VNZ-toolkit-options-save' style='align: center; width: 50px;'>Lưu</button><center>");
		
		$('#VNZ-toolkit-options img').mouseover(function(){
			if($.getcookie('ABPVN VNZ-toolkit')!==undefined){
				var ABPVN_VNZ_options=$.getcookie('ABPVN VNZ-toolkit').split(',');
				if(ABPVN_VNZ_options[0]!='true'){
					$('#VNZ-toolkit-img-view').prop('checked',false);
				}
				if(ABPVN_VNZ_options[1]!='true'){
					$('#VNZ-toolkit-img-qUpload').prop('checked',false);
				}
			}
			$('#msg').html('');
			$('#VNZ-toolkit-options-area').fadeIn('slow');
		});
		$('#VNZ-toolkit-options').mouseleave(function(){
			$('#VNZ-toolkit-options-area').fadeOut('slow');
		});
		$('#VNZ-toolkit-options-save').click(function(){
			var now = new Date();
			var time = now.getTime();
			var expireTime = time + 365*24*3600*1000;
			now.setTime(expireTime);
			var cookie_str='ABPVN VNZ-toolkit=';
			$("#VNZ-toolkit-options-area input[type=checkbox]").each(function (){
				cookie_str+=$(this).prop('checked')+',';
			});
			document.cookie=cookie_str+';expires='+now.toGMTString()+';path=/;';
			$('#msg').html('Đã lưu');
			$('#VNZ-toolkit-options-area').fadeOut('slow');
		});
	});
}
$.VNZ_tookit_upload=function(file, element){
	var fd=new FormData();
	fd.append('file_up',file);
	$.ajax({
		xhr: function() {
			var xhr = new window.XMLHttpRequest();
			xhr.upload.addEventListener("progress", function(e) {
				if (e.lengthComputable) {
					 var percentValue =Math.round((e.loaded / e.total) * 100) + '%';
					 $('#cke_top_'+element+' div.cke_toolbox span#VNZ_img_count').attr("title","Đang upload "+file.name+" : "+percentValue);
				}
		   }, false);

		   xhr.addEventListener("progress", function(e) {
			   if (e.lengthComputable) {
					var percentValue =Math.round((e.loaded / e.total) * 100) + '%';
					$('#cke_top_'+element+' div.cke_toolbox span#VNZ_img_count').attr("title","Đang upload "+file.name+" : "+percentValue);
			   }
			}, false);

		   return xhr;
		},
		type: 'POST',
		crossDomain: true,
		url: 'https://www.webanh.tk/ajax?act=upload&from=vnz',
		data: fd,
		processData: false,
		contentType: false,
		success:function(data){
				//console.log('#cke_top_'+element+' div.cke_toolbox span#VNZ_img_count')
				$('#cke_contents_'+element+' textarea').val($('#cke_contents_'+element+' textarea').val()+'\n'+data.bbcode);
				//console.log(data.bbcode);
				img_count--;
				$('#cke_top_'+element+' div.cke_toolbox span#VNZ_img_count').html("Đang tải lên "+img_count+" ảnh");
				if(img_count===0){
					$(".VNZ_img_qUpload").attr('src','https://www.webanh.tk/css/images/upload.png');
					$('.VNZ_img_qUpload').attr('title','Upload ảnh nhanh lên webanh.tk');
					$('#cke_top_'+element+' div.cke_toolbox span#VNZ_img_count').hide();			
					$('#cke_top_'+element+' div.cke_toolbox span#ABPVN_VNZ span.cke_toolgroup img.VNZ_img_qUpload').bind('click',function(){
							$('#VNZ_img_up_'+element+'').trigger("click");
					});					
				}
		},
		error: function(xhr,status,error){
			/*if(status=='error'){
				$('#progress-'+index+'').attr('class','error');
				$('#progress-'+index+'').attr('style','width: 100%');
				$('#progress-'+index+'').attr('title',status);
			}*/
			alert("Lỗi kết nối");
		}
	});
			
			//console.log(error);
};
function VNZ_img_qUpload(){
	var VNZ_img_up=function (element){
			$('#cke_top_'+element+'  div.cke_toolbox').append('<span id="ABPVN_VNZ" class="cke_toolbar"><span class="cke_toolgroup" style="width: 20px; height: 20px; border-radius: 50%; border: 2px green solid;"><img title="Upload ảnh nhanh lên webanh.tk" class="VNZ_img_qUpload cke_button" style="width: 20px; height: 20px; border-radius: 50%" src="https://www.webanh.tk/css/images/upload.png"></img><input type="file" id="VNZ_img_up_'+element+'" data-element="'+element+'" name="VNZ_img_up" accept="image/*" multiple="true" style="display: none"/></span></span><span class="cke_button" id="VNZ_img_count" style="display: none; color: white; background-color: black;"></span>');
			$('#cke_top_'+element+' div.cke_toolbox span#ABPVN_VNZ span.cke_toolgroup img.VNZ_img_qUpload').bind('click',{element: element},function(event){
				$('#VNZ_img_up_'+event.data.element+'').trigger("click");
			});
			$('#VNZ_img_up_'+element+'').bind('change',function (event){
					var element=$(this).attr('data-element');
					$('#cke_top_'+element+' div.cke_toolbox span#ABPVN_VNZ span.cke_toolgroup img.VNZ_img_qUpload').attr('src','https://www.webanh.tk/css/images/loading.gif');
					$('#cke_top_'+element+' div.cke_toolbox span#ABPVN_VNZ span.cke_toolgroup img.VNZ_img_qUpload').attr('title','Đang upload');
					var acceptext=['jpg','png','gif','bmp','svg','ico'];
					var files=$(this).prop('files');
					var filenames=$.map(files, function(val) { return val.name; });
					for(var i=0;i<files.length;i++){
						var fileext=filenames[i].substr( (filenames[i].lastIndexOf('.') +1) );
						fileext=fileext.toLowerCase();
						if($.inArray(fileext,acceptext)!=-1){
							$('#cke_top_'+element+' div.cke_toolbox span#VNZ_img_count').show();
							$('#cke_top_'+element+' div.cke_toolbox span#VNZ_img_count').html("Đang tải lên "+files.length+" ảnh");
							img_count=files.length;
							$.VNZ_tookit_upload(files[i], element);
							$('#cke_top_'+element+' div.cke_toolbox span#ABPVN_VNZ span.cke_toolgroup img.VNZ_img_qUpload').unbind('click');
						}
					}
			});
	};
	$(window).load(function(){
		VNZ_img_up('vB_Editor_QR_editor');
		VNZ_img_up('vB_Editor_001_editor');
	});
	$('a.editpost').click(function (){
		setTimeout(function(){
			VNZ_img_up('vB_Editor_QE_1_editor');
			VNZ_img_up('vB_Editor_QE_2_editor');
			VNZ_img_up('vB_Editor_QE_3_editor');
			
		},1500);
		
	});
	//console.log("VNZ_img_qUpload fired");
}
(function (){
	VNZ_toolkit_options();
	if($.getcookie('ABPVN VNZ-toolkit')!==undefined){
		var ABPVN_VNZ_options=$.getcookie('ABPVN VNZ-toolkit').split(',');
		if(ABPVN_VNZ_options[0]=='true'){
			VNZ_img_view();
		}
		if(ABPVN_VNZ_options[1]=='true'){
			VNZ_img_qUpload();
		}
	}
	else{
		VNZ_img_view();
		VNZ_img_qUpload();
	}
})();