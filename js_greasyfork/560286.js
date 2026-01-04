// ==UserScript==
// @name          youtube BIG emote preview
// @match         https://www.youtube.com/*
// @license       MIT
// @description   游標移到圖片上可以看更大的圖
// @version 0.0.1.20251226072200
// @namespace https://greasyfork.org/users/1121708
// @downloadURL https://update.greasyfork.org/scripts/560286/youtube%20BIG%20emote%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/560286/youtube%20BIG%20emote%20preview.meta.js
// ==/UserScript==

imgContainer = {
    idExp   : /com(?:\/ytc)?\/(.*?)=/,
    imgSize : 192, // 圖片尺寸，可自行更改
    root : function (){
        let e = document.createElement('DIV');
        document.body.append(e);
      return e;
    }(),
    getImg : function (src){
        return this[src.match(this.idExp)[1]];
    },
    newImg : function (src){
        let img = document.createElement('IMG');
        img.style.setProperty('position', 'fixed');
        img.style.setProperty('z-index', '20251226');
        img.src = src.split(/=/)[0] + '=s'+ this.imgSize +'-c';
    // 避免圖片沒隱藏的補救措施
        img.onmouseover  = function(){ img.hidden = true; };
        img.onmouseleave = function(){ img.hidden = true; };

        this[src.match(this.idExp)[1]] = img;
        this.root.append(img);
      return img;
    },
    setPosition : function (img, x, y){
        img.style.setProperty('left', (x+this.imgSize > document.scrollingElement.clientWidth ? x-this.imgSize : x)+'px');
        img.style.setProperty( 'top', (y+this.imgSize > document.scrollingElement.clientHeight? y-this.imgSize : y)+'px');
    },
};


addEventListener('mouseover', function(event){
    let e = event.target;
    if(e.parentElement && e.parentElement.className &&
        (e.parentElement.className.includes('ytImageBanner') ||
         e.parentElement.classList.contains('ytd-thumbnail') ||
         e.parentElement.classList.contains('ytThumbnailViewModelImage')
        )
      )
        return;


    if(e.nodeName == "IMG" && e.src.includes('=')){
        let img = imgContainer.getImg(e.src);
        if(img){
            imgContainer.setPosition(img, event.clientX, event.clientY);
            e.onmouseleave = function(){ img.hidden = true; e.onmouseleave = undefined;};
            img.hidden = false;
        }else{
            img = imgContainer.newImg(e.src);
            imgContainer.setPosition(img, event.clientX, event.clientY);
            e.onmouseleave = function(){ img.hidden = true; e.onmouseleave = undefined;};
        }
    }
});



/*
// -c can be resize
// -k no playing frames
// -nd ?

   s32-c-k-c0x00ffffff-no-rj
*/