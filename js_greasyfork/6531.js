// ==UserScript==
// @name         Houzz Endless Scroll
// @namespace    http://www.houzz.com/photos
// @version      0.1
// @description  enter something useful
// @author       You
// @match        http://www.houzz.com/photos/*
// @grant        unsafeWindow
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/6531/Houzz%20Endless%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/6531/Houzz%20Endless%20Scroll.meta.js
// ==/UserScript==

var $ = unsafeWindow.jQuery;
var hzinfo = unsafeWindow.HZ.data.Contexts.getCollection();
var splitURL = document.URL.split('/');
var photoStartNum = parseInt(splitURL.slice(-1).pop());
if(isNaN(photoStartNum)){
    photoStartNum=0;
    splitURL.push('p');
    splitURL.push('0');
}
var urlBase = splitURL.splice(0, splitURL.length-1);
var nextPhotoStartNum;
$.each(hzinfo,function(i,v){
    nextPhotoStartNum = v.getNextPosition();
});
var photoIncrement = nextPhotoStartNum - photoStartNum;
var curPhotoNum = photoStartNum;


$(function(){
var HZScroll = {
    listen:function(){
        var self=this;
        $(window).on('scroll.HZScroll', function(){
            self.fire();
        });
	},
    fire:function(){
        var self=this;
        if($(window).scrollTop() + $(window).height() > $(document).height() - $(window).height()*0.4) {
            $(window).off('scroll.HZScroll');
            curPhotoNum += photoIncrement;
           
            var nextUrl = urlBase.join("/") + "/" + curPhotoNum.toString();
           	
      
            
            $.get(nextUrl,function(data){
               window.history.pushState("", curPhotoNum, nextUrl);
                $('#browseSpacesContext').append(
                    $(data).find('#browseSpacesContext').html()
                );
                self.listen();
                
            });
            

        }
    }
};
    


   HZScroll.listen();

})