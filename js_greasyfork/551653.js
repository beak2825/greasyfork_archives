// ==UserScript==
// @name        YT會員貼圖移入顯示大圖
// @match       https://www.youtube.com/live_chat*
// @version     1.0
// @license     MIT
// @description bigger emote preview
// @namespace https://greasyfork.org/users/1121708
// @icon      https://www.youtube.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/551653/YT%E6%9C%83%E5%93%A1%E8%B2%BC%E5%9C%96%E7%A7%BB%E5%85%A5%E9%A1%AF%E7%A4%BA%E5%A4%A7%E5%9C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/551653/YT%E6%9C%83%E5%93%A1%E8%B2%BC%E5%9C%96%E7%A7%BB%E5%85%A5%E9%A1%AF%E7%A4%BA%E5%A4%A7%E5%9C%96.meta.js
// ==/UserScript==

addEventListener("mouseover", (event)=>{
  if(event.target.tagName == 'IMG'){
    switch(location.host){
      /*case "www.twitch.tv":
        // use url in srcset
        if(event.target.hasAttribute('srcset')){
          let url= ["",""];
          event.target.srcset.split(/,/).forEach((e)=>{
            let arr= e.trim().split(/ /);
            if(url[1] < arr[1])url[0]= arr[0];
          });
          addImg(url[0], event);
        }
        break;*/
      case "www.youtube.com":
        if(event.target.classList.contains('yt-emoji-picker-upsell-category-renderer')
           ||event.target.classList.contains('yt-emoji-picker-category-renderer')
           //||event.target.classList.contains('yt-live-chat-text-message-renderer')
           //||event.target.classList.contains('yt-live-chat-author-badge-renderer')
          ){
          addImg(event.target.src.split(/=/)[0]+"=w64-h64-c", event);
          // w24-h24-c-k-nd
          // single w, h, s also work
          // add -c can be resize
          // add -k no playing frame
          // dont know -nd doing
        }
    }
  }
});



function addImg(src, event){
  let img= document.createElement('IMG');
  let offset= (location.host == "www.youtube.com")? 28 : 32;

  img.onmouseleave= ()=>{img.remove();};
  img.onload= ()=>{
    if(img){
      img.style.setProperty('left', (event.clientX+offset+img.width  > innerWidth ? event.clientX-offset-img.width : event.clientX+offset)+'px');
      img.style.setProperty( 'top', (event.clientY+offset+img.height > innerHeight? event.clientY-offset-img.height: event.clientY+offset)+'px');
      document.body.append(img);
    }
  };

  img.style.setProperty('z-index', '20250304');
  img.style.setProperty('position', 'fixed');
  img.src= src;
  event.target.onmouseleave= ()=>{
    img.remove();
    if(!img.complate)img=undefined;
  };
}
