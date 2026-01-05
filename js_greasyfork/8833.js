// ==UserScript==
// @name               77mh.com image list
// @description        Lists all images in a chapter/volume
// @name:zh-TW         77mh 漫畫列表
// @description:zh-TW  列出章節內所有圖片
// @version            1.1.2
// @include            /^http\:\/\/.*?\.77mh\.com\//
// @author             willy_sunny
// @license            GPL version 2 or any later version; http://www.gnu.org/licenses/gpl-2.0.txt
// @namespace https://greasyfork.org/users/9968
// @downloadURL https://update.greasyfork.org/scripts/8833/77mhcom%20image%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/8833/77mhcom%20image%20list.meta.js
// ==/UserScript==
//
// ************************
// Own Variable Declaration
// ************************
// imgList: the output result
// 
// *************************************************
// Site function/variable Declearation
// The manga's page list and info are stored inside
// the 8 hash letter js file like this:
// http://css.177mh.com/coojs/201411/f529f09a.js
// *************************************************
// However, the js file that actually processes
// it is located inside another js file as:
// http://css.177mh.com/img_v1/v17ql_cont_v150213.js
// *************************************************
// The nextLink_ba variable is the next page link
// *************************************************
//
// The imgList code is a direct modification on the above mentioned js file
// "img.src=img_qianz+arr[page];"
// This should be quite obvious, just use arr.length to get the total page count
// And just write a loop, poof, done.

var imgList=""; // declear image list
for(var i=0;i<arr.length;i++){ // looping pages
    imgList+='<img src="'+img_qianz+arr[i]+'"><br>'; // addes pages to the list
}
document.write(imgList+nextLink_ba); // output images + next chapter link