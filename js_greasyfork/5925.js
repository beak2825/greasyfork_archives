// ==UserScript==
// @name       Waimai-M-jiesuan
// @namespace  http://iamued.com
// @version    0.6
// @description  Waimai结算审核图片增强
// @include    http://waimai.sankuai.com/paysetting/setting_check/list
// @include    http://waimai.sankuai.com/paysetting/setting/edit?wmpoiid=*
// @copyright  2014
// @downloadURL https://update.greasyfork.org/scripts/5925/Waimai-M-jiesuan.user.js
// @updateURL https://update.greasyfork.org/scripts/5925/Waimai-M-jiesuan.meta.js
// ==/UserScript==


function loadCss(file){ 
    var cssTag=document.getElementById('loadCss'); 
    var head=document.getElementsByTagName('head').item(0); 
    if(cssTag)head.removeChild(cssTag); 
    css=document.createElement('link'); 
    css.href=file; 
    css.rel='stylesheet'; 
    css.type='text/css'; 
    css.id='loadCss'; 
    head.appendChild(css); 
} 
isPicShowState=false;
$.ajaxSetup({
  cache: true
});
$(function() {
    function loadImage(a){
        alert('change'+$(this).attr('path'));   
    }
    $.getScript('http://code.jquery.com/jquery-migrate-1.1.1.js');
    $.getScript('http://www.ablanxue.com/uploadfile/201303/13645430974376335/ablanxue/js/easydrag.js',function(){
        //alert('加载完成');
        
        //$("body").append('<div  style="width:400px;height:300px;color:red;background-color:#ccc;border:2px;position: absolute;top:200px;right:150px;" id="okdiv"><div class="viewer" id="viewerdiv" style="width:400px;height:400px;"></div></div>');
        
        $("body").append('<div id="dragdiv" style="width:600px;height:300px;position: fixed;top:50px;right:50px;border:1px solid #eee;"><div id="divTitle"style=“height:70px;background-color:#eee;width:600px;”>合同图片</div><div style="background-color:#eee;width:600px;">图片列表:<span class="picarea"></span></div><div  style="width:600px;height:260px;color:red;background-color:#ccc;border:2px;position: absolute;" id="okdiv"></div></div>');
        $("#dragdiv").easydrag().hide();
        
        $("#dragdiv").setHandler("divTitle");
        
    });
    //$.include(['http://test.dpetroff.ru/jquery.iviewer/jquery.iviewer.csss']);
    loadCss('http://test.dpetroff.ru/jquery.iviewer/jquery.iviewer.css');
    $.getScript('http://test.dpetroff.ru/jquery.iviewer/jquery.iviewer.js');
    $.getScript('http://test.dpetroff.ru/jquery.iviewer/test/jquery.mousewheel.min.js');
    $.getScript('http://test.dpetroff.ru/jquery.iviewer/test/jqueryui.js');
    
    if(window.location.href.indexOf('paysetting/setting_check/list')>1){
        $.getScript('http://test.dpetroff.ru/jquery.iviewer/jquery.iviewer.js',function(){
            var picIvewer;
            picIvewer1=$("#okdiv").iviewer(
                {
                    src: "",
                    update_on_resize:false,
                    zoom:100,
                    zoom_max:200,
                    mousewheel: true,
                    onStartDrag: function(ev, coords) {return true;}, //this image will not be dragged
                    onDrag: function(ev, coords) {},
                    initCallback: function()
                    {
                        picIvewer = this;
                    }
                });
            
            //console.log(picIvewer);
            $("a:contains('合同快照')").bind('click',function(event){
                console.log('ok');
                //var thisval=eval($(this).attr('data-ref'));
                var picData=$.parseJSON($(this).attr('data-ref'));
                //console.log(a1);
                //$(this).attr('href')='#';
                //console.log(thisval);
                html="";
                $('.picarea').html('');
                $(picData['list']).each(function(index) {
                    //console.log(picData['list'][index]);
                    var aobj=$('<a href="javascript:void(0)" class="imgUrl"></a>&nbsp;&nbsp;').text(picData['list'][index].filename).attr('path',picData['list'][index].url);
                    console.log(aobj);
                    if(index==0){
                        if(!isPicShowState){
                            $("#dragdiv").show();
                        }
                        isPicShowState=true;
                        picIvewer1.iviewer('loadImage',picData['list'][index].url);
                        picIvewer1.iviewer('zoom_by','100');
                        
                    }
                    $('.picarea').append(aobj);
                    
                })
                
                $('.imgUrl').bind('click',function(event){
                    
                    //console.log(picIvewer);
                    picIvewer1.iviewer('loadImage',$(this).attr('path'));
                    event.stopPropagation();
                    //picIvewer1.loadImage($(this).attr('path'));
                })
                console.log(picData);
                
                return false;
            })
            //console.log('ivewerOK;');
        })
    }
    
    if(window.location.href.indexOf('paysetting/setting/edit?wmpoiid=')>1){
        $.getScript('http://test.dpetroff.ru/jquery.iviewer/jquery.iviewer.js',function(){
            var picIvewer;
            picIvewer1=$("#okdiv").iviewer(
                {
                    src: "",
                    update_on_resize:false,
                    zoom:100,
                    zoom_max:200,
                    mousewheel: true,
                    onStartDrag: function(ev, coords) {return true}, //this image will not be dragged
                    onDrag: function(ev, coords) {},
                    initCallback: function()
                    {
                        picIvewer = this;
                    }
                });
            
            
            html="";
            $('.picarea').html('');
            $('.fileNameA').each(function(i,v) {
                
                //console.log(picData['list'][index]);
                var aobj=$('<a href="javascript:void(0)" class="imgUrl"></a>&nbsp;&nbsp;').text('图片'+i).attr('path',$(this).attr('data-url'));
                console.log(aobj);
                if(i==0){
                    if(!isPicShowState){
                        $("#dragdiv").show();
                    }
                    isPicShowState=true;
                    picIvewer1.iviewer('loadImage',$(this).attr('data-url'));
                    picIvewer1.iviewer('zoom_by','100');
                    
                }
                $('.picarea').append(aobj);
                
            })
            
            $('.imgUrl').bind('click',function(){
                //console.log(picIvewer);
                picIvewer1.iviewer('loadImage',$(this).attr('path'));
                //picIvewer1.loadImage($(this).attr('path'));
                
            })
        })
    }
    
    
});
