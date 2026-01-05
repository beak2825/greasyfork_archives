// ==UserScript==
// @name           猫超detail自动显示大图地址
// @namespace chaoshidetail
// @description    猫超detail自动显示大图的url地址
// @author         lyzzju@gmail.com
// @include        http://chaoshi.detail.tmall.com/item.htm
// @version        1.1
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/6080/%E7%8C%AB%E8%B6%85detail%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E5%A4%A7%E5%9B%BE%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/6080/%E7%8C%AB%E8%B6%85detail%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E5%A4%A7%E5%9B%BE%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==


$('#content').append('<div style="position:absolute;top:250px;left:150px;width:250px;z-index:9999;"><textarea id="img-url-360" class="img-url" style="width:250px;height:60px;margin-bottom:10px;"></textarea><textarea id="img-url-250" class="img-url" style="width:250px;height:60px;margin-bottom:10px;"></textarea><textarea id="img-url-180" class="img-url" style="width:250px;height:60px;"></textarea></div>');

$('#img-url-360').html($('#J_ImgBooth').attr('src'));

$('#img-url-250').html($('#J_ImgBooth').attr('src').replace('430x430', '250x250'));

$('#img-url-180').html($('#J_ImgBooth').attr('src').replace('430x430', '180x180'));

$('.img-url').hover(function(){
  $(this).select();
},function(){
  $(this).unselect();
})