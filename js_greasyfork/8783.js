// ==UserScript==
// @name               8Comic.com image list
// @description        Lists all images in a chapter/volume
// @name:zh-TW         8Comic 漫畫列表
// @description:zh-TW  列出章節內所有圖片
// @version            1.6.10
// @include            /^https?\:\/\/(.*?\.)?comicvip\.com\/show\//
// @include            /^https?\:\/\/(.*?\.)?comicbus\..*\//
// @include            /^https?\:\/\/(.*?\.)?nowcomic\.com\//
// @include            /^https?\:\/\/(.*?\.)?comicgood\.com\//
// @include            /^https?\:\/\/(.*?\.)?comic.aya.click\//
// @include            /^https?\:\/\/(.*?\.)?8899\.click\//
// @include            /^https?\:\/\/.*?\/online\/manga_\d*.html/
// @include            /^https?\:\/\/.*?\/online\/new-\d*.html/
// @author             willy_sunny
// @license            GPL version 2 or any later version; http://www.gnu.org/licenses/gpl-2.0.txt
// @namespace https://greasyfork.org/users/9968
// @downloadURL https://update.greasyfork.org/scripts/8783/8Comiccom%20image%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/8783/8Comiccom%20image%20list.meta.js
// ==/UserScript==
//
// ************************
// Own Variable Declaration
// ************************
// imgList: the output result
// 
// ***********************************
// Site function/variable Declearation
// many can be found in the nview.js
// http://new.comicvip.com/js/nview.js
// ***********************************
//
// ps: total page count, it's also auto stored when nview.js was done loading
//
var imgList = ""; 
var encStr=document.getElementById('TheImg').src.split("_")[1].substr(0,3);
console.log("ImgFileName=" + encStr);
var theCode="";
var ch=request("ch");var p=1;if(ch.indexOf("-")>0) {p=parseInt(ch.split('-')[1]);ch=ch.split('-')[0];}

// Bruteforcing Script tag
var me = null;
var scripts = document.getElementsByTagName("script")
var re=new RegExp(".*\=\'.*\'\;"); // Define RegEx
var cs=null;
var varItem=null;
for (var i=0;i<scripts.length;i++) {
    // console.log("i = " + i);
    // console.log(scripts[i]);
    if ("function request" == scripts[i].innerHTML.substring(1,17)) {
        var targetScript = scripts[i].innerHTML;
        var varList = targetScript.split('var ');
        for (var x=1;x<varList.length;x++) {
            if(varList[x].match(re)) {
                // console.log("x = " + x);
                // console.log(varList[x]);
                tmpItem = varList[x].split('=')[0];
                tmpStr = eval(tmpItem);
                //console.log(tmpItem + " = " + tmpStr.length);
                if(tmpStr.length > 50) {
                    console.log("Using var " + tmpItem);
                    varItem = tmpItem;
                }
            }
        }
    }

}
cs = eval(varItem);
console.log(cs);

function getStr(inputStr, i, c) {
    if(c==null) { c=40; }
    var tmpStr = inputStr.substring(i,i+c);
    return tmpStr;
}

function bruteCode(inputStr) {
    //brute force code
    //for(var x=60;x>=0;x--){
    for(var x=0;x<=1000;x++){
        for(var varConst=0;varConst<=10;varConst++) {
            var testCode=lc(getStr(cs,x*ci+varConst));
            //console.log("Testing with: " + testCode);
            if (getStr(testCode,mm(p),3) == encStr) {
                console.log("We got at winner @ x = " + x + " & varConst = " + varConst);
                console.log("With string\n" + testCode);
                return testCode;
            }
        }
    }
}

theCode = bruteCode(cs);

var imgRoot=document.getElementById('TheImg').src.substr(0,document.getElementById('TheImg').src.lastIndexOf("/")+1); // server root is always the same
console.log("imgRoot = " + imgRoot);
for (var p = 1; p <= ps; p++) {
    var picUrl = imgRoot + nn(p) + '_' + getStr(theCode,mm(p),3) + '.jpg';
    imgList = imgList + '<a href="'+picUrl+'"><img src="'+picUrl+'"></a><br>';
}

imgList += '<a href="#" onClick="jv(ni)">Next >>'; // this enables the user to click the next chapter link on the bottom to follow to the next chapter
document.write("<center>"+imgList+"</center>"); // outputs the list