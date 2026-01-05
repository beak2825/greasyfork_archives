// ==UserScript==
// @name        swagbuck cont search
// @namespace   swagbucksearch
// @description swagbuck search and captcha resolver
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @include     http://www.swagbucks.com/*q=*
// @include http://www.swagbucks.com/*magicword=retsam*
// @include     http://www.swagbucks.com/z/*
// @require https://greasyfork.org/scripts/1706-gocr-library/code/GOCR%20Library.js?version=4235
// @version     0.1
// @grant		GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/7851/swagbuck%20cont%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/7851/swagbuck%20cont%20search.meta.js
// ==/UserScript==



var searchcountlimit;
searchcountlimit = 50;
window.addEventListener ("load", localMain(), false);

function localMain(){
    var now = new Date(); 
    now.setHours(now.getHours()-15);
    var nowutc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    var searchcount = getCookie("searchcount");
    getCookie("searchautoflag") ? "" : setCookie("searchautoflag",0 ,365, "/")
    var searchautoflag = getCookie("searchautoflag");
    //console.log(searchcount);
    if (window.opener != null && window.location.href.indexOf("retsam") > -1) {
        console.log("in");
        console.log(window.opener);
        window.opener.postMessage("Child Frame Loaded", "*");
        var pic = document.getElementsByTagName("img")[0];
        var image = getBase64Image(pic);
        var ocrString = GOCR(image);
        ocrString = ocrString.replace(/\s+/g, '');
        console.log(ocrString.toUpperCase());
        window.opener.postMessage({magicword: "retsam", string: ocrString}, "*");
    }else if(getCookie("searchdate") < nowutc){
        setCookie("searchdate",nowutc ,365);
        setCookie("searchcount",0 ,365);
        checkCode();
    }else{
        if(+searchautoflag != 0){
            if(searchcount < searchcountlimit){
                searchcount = searchcount*1 + 1;
                setCookie("searchcount",searchcount,365);
                checkCode();
                $('.newSearchButton').parent().append("<input class='newSearchButton' type='button' id='resetsearch' value='search stop'>").bind('click', function() {
                    setCookie("searchautoflag",0 ,365, "/");
                    document.location.href = document.location.href
                });
            }else{
                //alert("search end");
                console.log("search end");
                $('.newSearchButton').val("search end");
                $('.newSearchButton').parent().append("<input class='newSearchButton' type='button' id='resetsearch' value='reset search'>").bind('click', function() {
                    setCookie("searchcount",0 ,365);
                    checkCode();
                });
            }
        }else{
            $('.newSearchButton').parent().append("<input class='newSearchButton' type='button' id='resetsearch' value='search auto'>").bind('click', function() {
                setCookie("searchautoflag",1 ,365, "/")
                checkCode();
            });
            if (document.getElementById("captchaImg")) {
                console.log("Captcha");
                document.title = "Captcha";
                pic = document.getElementById("captchaImg");
                pic.crossOrigin = 'anonymous';
                var string = getCaptchaText(pic);
            }
        }
        //if
    }
}

function simulateClick(obj) {
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window,
                       0, 0, 0, 0, 0, false, false, false, false, 0, null);
    var canceled = !obj.dispatchEvent(evt);      
}

function checkCode(){
    GM_xmlhttpRequest({
        method: "GET",
        url: "http://www.pogocheats.net/bing-rewards-bot/dictionary.txt",
        headers: {
            "User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
            //   "Accept": "text/xml"            // If not specified, browser defaults will be used.
        },
        onload: function(data) {		 
            process(data.responseText);
        }
    });
}

var doWebSearch2 = unsafeWindow.doWebSearch;

function process(data){
    var words = data.split("\n");
    var idx1 = Math.floor(words.length * Math.random());
    var idx2 = Math.floor(words.length * Math.random());
    searchQuery = words[idx1];
    searchQuery2 = words[idx2];
    console.log(searchQuery+' '+searchQuery2);
    $('.inputfield').val(searchQuery+' '+searchQuery2);
    //<div id="contCongratsCont">
    if (document.getElementById("captchaImg")) {
        console.log("Captcha");
        document.title = "Captcha";
        pic = document.getElementById("captchaImg");
        pic.crossOrigin = 'anonymous';
        var string = getCaptchaText(pic);
    }else{
        var timeout2 = setTimeout(doWebSearch2, 10000);
    }
}


window.addEventListener("message", function(e) {
    if (e.data.magicword === "retsam") {
        console.log("Message Received");
        console.log(e.data);
        var ocrString = e.data.string.toUpperCase();
        console.log("string");
        console.log(ocrString);
        console.log("string");
        if (childWindow)
            childWindow.close();
        if (ocrString.indexOf('_') === -1){
            if (document.getElementsByClassName("catpthcaInput") && ocrString.length>2){
                document.getElementsByClassName("catpthcaInput")[0].value = ocrString;
                //alert("REAY TO click:"+ocrString);
                document.title = "REAY TO click:"+ocrString;
                document.getElementsByClassName("btnClaim")[0].click();
                setTimeout(function() {
                    if (!document.getElementById("captchaImg")){
                        var timeout2 = setTimeout(doWebSearch2, 1000);
                    }
                    else{
                        //alert("Opened 1");
                        var pic = document.getElementById("captchaImg");
                        childWindow = window.open(pic.src+"&magicword=retsam");
                    }
                }, 20000);
            }else{
                var pic = document.getElementById("captchaImg");
                childWindow = window.open(pic.src+"&magicword=retsam");
            }
        }else{
            //alert("Opened 2");
            var pic = document.getElementById("captchaImg");
            childWindow = window.open(pic.src+"&magicword=retsam");
        }
    }else{
        //console.log("Also message received");
        //console.log(e.data);
    }
}, false);

function getCookie(c_name){
    var i,x,y,ARRcookies=document.cookie.split(";");
    for (i=0;i<ARRcookies.length;i++)
    {
        x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
        y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
        x=x.replace(/^\s+|\s+$/g,"");
        if (x==c_name)
        {
            return unescape(y);
        }
    }
}

function getCaptchaText(pic){
    var pic = document.getElementById("captchaImg");
    childWindow = window.open(pic.src+"&magicword=retsam");
}

function setCookie(c_name,value,exdays){
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie=c_name + "=" + c_value;
}

function getBase64Image(img) {
    /* // Create an empty canvas element
    var pic = document.createElement("img");
    pic.src = img;
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(pic, 0, 0);
    var pic2 = document.createElement("img");
    pic2.src=canvas.toDataURL("image/png");
    console.log(canvas.toDataURL("image/png"));
    ctx.drawImage(pic2,0,0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = ctx.getImageData(0,0,canvas.width,canvas.height);

    return dataURL;//.replace(/^data:image\/(png|jpg);base64,/, "");*/
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    
    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = ctx.getImageData(0,0,canvas.width,canvas.height);
    
    return dataURL;//.replace(/^data:image\/(png|jpg);base64,/, "");
}



