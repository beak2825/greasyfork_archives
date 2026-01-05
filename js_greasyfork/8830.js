// ==UserScript==
// @name 	SwagTv script+mod edited for "globalvideo.swagbucks.com"
// @namespace 	swagtv+mod edited for "globalvideo.swagbucks.com"
// @description	this script will automatically fetch and go to the next video after the meter goes up. [mod: next category when end, solve another captcha, restore last video, fix some bug from duplicate watch, speed up for next video after meter increase, checking new server date] [Edited for "globalvideo.swagbucks.com"]
// @version 1.0
// @include	http://globalvideo.swagbucks.com/channel/*
// @include	http://globalvideo.swagbucks.com/video/*
// @include http://www.swagbucks.com/?cmd=cp-get-captcha-image*
// @exclude	http://globalvideo.swagbucks.com/ad*
// @require https://greasyfork.org/scripts/1706-gocr-library/code/GOCR%20Library.js?version=4235
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/8830/SwagTv%20script%2Bmod%20edited%20for%20%22globalvideoswagbuckscom%22.user.js
// @updateURL https://update.greasyfork.org/scripts/8830/SwagTv%20script%2Bmod%20edited%20for%20%22globalvideoswagbuckscom%22.meta.js
// ==/UserScript==
// Original from https://greasyfork.org/scripts/7311-swagtv-script-mod
// --------------------------------------------------------------------

var channel = [];
channel[1] = "http://globalvideo.swagbucks.com/channel/comedy-time/150";
channel[2] = "http://globalvideo.swagbucks.com/channel/celebrity/151";
channel[3] = "http://globalvideo.swagbucks.com/channel/vegtv-celebrities/152";
channel[4] = "http://globalvideo.swagbucks.com/channel/country-jazz-videos/153";
channel[5] = "http://globalvideo.swagbucks.com/channel/top-box-office/154";
channel[6] = "http://globalvideo.swagbucks.com/channel/appetizers/159";
channel[7] = "http://globalvideo.swagbucks.com/channel/kitchen-tips/160";
channel[8] = "http://globalvideo.swagbucks.com/channel/desserts/161";
channel[9] = "http://globalvideo.swagbucks.com/channel/stretching-exercises/163";
channel[10] = "http://globalvideo.swagbucks.com/channel/pilates/164";
channel[11] = "http://globalvideo.swagbucks.com/channel/alternative-fitness/165";
channel[12] = "http://globalvideo.swagbucks.com/channel/yoga/166";
channel[13] = "http://globalvideo.swagbucks.com/channel/global-fitness/167";
channel[14] = "http://globalvideo.swagbucks.com/channel/tai-chi/168";
channel[15] = "http://globalvideo.swagbucks.com/channel/editors-pick/149";
var now = new Date();
// I'm +7 UTC, use -15 : set yours
now.setHours(now.getHours()-15);
var nowutc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

if (window.opener != null && window.location.href.indexOf("mumbojumbo") > -1) {
    console.log("in");
    console.log(window.opener);
    window.opener.postMessage("Child Frame Loaded", "*");
    var pic = document.getElementsByTagName("img")[0];
    var image = getBase64Image(pic);
    var ocrString = GOCR(image);
    ocrString = ocrString.replace(/\s+/g, '');
    console.log(ocrString.toUpperCase());
    window.opener.postMessage({magicword: "mumbojumbo", string: ocrString}, "*");
    window.setInterval(window.close,1000);
}else if(window.location.href.indexOf("globalvideo.swagbucks.com/channel") > -1){
    if(getCookie("videodate") < nowutc){
        console.log("new date");
        setCookie("videodate",nowutc ,365, "/");
        setCookie("videoindex",1 ,365, "/");
        document.location.href = channel[1];
    }else{
        // select first video
        console.log("select first video");
        document.location.href = $(".thumb-link").first().attr('href');
    }
}else if(window.location.href == "http://globalvideo.swagbucks.com/"){
    // start running here
    checkLimit();
    getCookie("videodate") ? "" : setCookie("videodate",nowutc ,365, "/")
    getCookie("videoindex") ? "" : setCookie("videoindex",1 ,365, "/")
    if(getCookie("videodate") < nowutc){
        // new day start new
        console.log("new date");
        setCookie("videodate",nowutc ,365, "/");
        setCookie("videoindex",1 ,365, "/");
        document.location.href = channel[1];
    }else{
        //resume last video
        document.location.href = getCookie("videolast");
    }
}else if(window.location.href.indexOf("www.swagbucks.com") > -1){
}else{
    if(window.location.href.indexOf("http://globalvideo.swagbucks.com/video") > -1){
        setCookie("videolast",document.location.href ,365, "/");
    }
    var iLoops = 0;
    var randomNum = 0;
    var strPercentStart = null;
    var strPercentStart2 = null;
    var temp123 = null;
    var link = null;
    var div = null;
    var doc = document.getElementById("feed-ajax-div");
    var notes = false;
    var dup = false;
    var _class = document.getElementsByClassName("thumb-container");
    window.setInterval(reloadTimer,2000);
    
    /*for (var i = 0; i < _class.length; i++) {
        if (_class[i].className == "thumb-container active") {
                var k = i;
                break;			
        }

    } */
    var k = getK();
    $('#item_title').parent().append("<input class='newCategory' type='button' id='newcat' value='New Category'>").bind('click', function() {
        selectNewCat();
    });/**/
}

function getK(){
    for (var i = 0; i < _class.length; i++) {
        if (_class[i].className == "thumb-container active") {
            var k = i;
            break;			
        }
        
    }
    return k
}

function reloadTimer(){
    iLoops++;
    if (iLoops == 1 || iLoops == 10) {
        if(document.getElementById("meterNumber")!= undefined){
            strPercentStart = document.getElementById("meterNumber").innerHTML;
            strPercentStart2 = document.getElementById("meterNumber").innerHTML;
        }
        temp123 = getCookie("videoindex");
        setCookie("videoindex",+temp123 ,365, "/");
        safeBW();
    }else{
        if(document.getElementById("meterNumber")!= undefined){
            strPercentStart2 = document.getElementById("meterNumber").innerHTML;
        }
    }
    if (iLoops%5==0){
        if(strPercentStart != strPercentStart2){
            if(strPercentStart2 != "99%"){
                iLoops = randomNum;
            }
        }
        document.title = iLoops+":"+strPercentStart+":"+strPercentStart2+":"+temp123;
        if(document.getElementById("sbvd_capText") && iLoops+10 < randomNum){
            iLoops = randomNum-5
        }
        checkLimit();
    }
    if (iLoops == 5) {
        div = document.getElementById("meterDuplicateVideo");
        if (div.style.display == 'none') { // not dup
            randomNum = Math.floor(Math.random()*15 + 50);
        }else { // dup
            dup = true;
            if (k == null) {
                console.log("In K=3");
                //var clickEvent = document.createEvent('MouseEvents');
                //clickEvent.initEvent('click', true, true);
                //document.getElementsByClassName("feed-ajax-next")[0].dispatchEvent(clickEvent);
                if (!document.getElementsByClassName("feed-ajax-next")[0]){
                    notes = true;
                }else{
                    document.getElementsByClassName("feed-ajax-next")[0].click();
                    randomNum = 13;
                }
                k = -1;
            }else{
                randomNum = 8;
            }
            if(document.getElementById("tout").getElementsByTagName("h2")[0].innerHTML == "Editor's Pick"){
                selectNewCat();
            }else if(document.getElementById("tout").getElementsByTagName("h2")[0].innerHTML == "Uzoo"){
                selectNewCat();
            }
        }
        if (k == null) {
            console.log("In K=3");
            if (!document.getElementsByClassName("feed-ajax-next")[0]){
                notes = true;
            }else{
                document.getElementsByClassName("feed-ajax-next")[0].click();
            }
            k = -1;
        }
        if(notes && dup){
                selectNewCat();            
        }
    };
    if (iLoops == randomNum){
        if (document.getElementById("sbvd_capText")) {
            pic = document.getElementById("sbvdcapimg");
            pic.crossOrigin = 'anonymous';
            var string = getCaptchaText(pic);
        }
        else {
            if (notes){
                selectNewCat();
            }else{
                link = document.getElementsByClassName("thumb-link")[k+1].href;
                window.location.href = link;
            }
        }
    }
    if(iLoops > 120){
        window.location.href = document.getElementsByClassName("thumb-link")[0].href;
    }
    if(iLoops > 500){
        selectNewCat();
    }
    
};

var childWindow = null;

if (window.opener != null && window.location.href.indexOf("mumbojumbo") > -1) {
    console.log("in");
    window.opener.postMessage("Child Frame Loaded", "*");
    var pic = document.getElementsByTagName("img")[0];
    console.log(pic);
    ocrString = ""
    if (pic){     
        setTimeout(function(){
            var image = getBase64Image(pic);
            console.log(image);
            var imageData = image[0];
            var ocrString = GOCR(imageData);meout
            ocrString = ocrString.replace(/\s+/g, '');
            console.log(ocrString.toUpperCase());
        },1500);
    }
    window.opener.postMessage({magicword: "mumbojumbo", string: ocrString}, "*");
    window.opener=window;
    window.close();
    top.window.close();
    window.setInterval(window.close,1000);
}

window.addEventListener("message", function(e) {
    if (e.data.magicword === "mumbojumbo") {
        console.log("Message Received");
        console.log(e.data);
        var ocrString = e.data.string.toUpperCase();
        console.log("string");
        console.log(ocrString);
        console.log("string");
        if (childWindow)
            childWindow.close();
        if (ocrString.indexOf('_') === -1){
            if (document.getElementById("sbvd_capText")){
                document.getElementById("sbvd_capText").value = ocrString;
                document.getElementsByClassName("btnClaim")[0].click();
                setTimeout(function() {
                    if (!document.getElementById("sbvd_capText")){                     
                        k=getK();
                        if (k == null)
                            k=-1;
                        link = document.getElementsByClassName("thumb-link")[k+1].href;
                        //alert("NEXT");
                        window.location.href = link;
                    }
                    else{
                        //alert("Opened 1");
                        var pic = document.getElementById("sbvdcapimg");
                        childWindow = window.open(pic.src+"&magicword=mumbojumbo");
                    }
                }, 1000);
            }
            
        }
        else{
            //alert("Opened 2");
            var pic = document.getElementById("sbvdcapimg");
            childWindow = window.open(pic.src+"&magicword=mumbojumbo");
        }
    }
    else{
        //console.log("Also message received");
        //console.log(e.data);
    }
}, false);

function checkLimit(){
    var limited = document.getElementById("meterOverlimit");
    if(limited.style.display == '') { // reach limited
        document.title = document.title+" REACHED LIMIT";
        document.location.href = "http://www.swagbuck.com/";
    }
}

function selectNewCat(){
    console.log("Pick a new category");
    var videoindex = getCookie("videoindex");
    var c = (isNaN(videoindex) ? 0 : +videoindex);
    videoindex = c + 1;
    if(videoindex+1>channel.length){videoindex = 1}
    setCookie("videoindex",videoindex ,365, "/");
    setTimeout(function() {
        document.location.href = channel[videoindex];
    }, 1000);
}

function safeBW(){
    if(document.getElementById("video-title")!= undefined){
        var video = document.getElementById("video-title");
        video.parentNode.removeChild(video);
    }
    if(document.getElementById("commentsCont")!= undefined){
        var comment = document.getElementById("commentsCont");
        comment.parentNode.removeChild(comment);
    }
    if(document.getElementById("sbFooterWrap")!= undefined){
        var footer = document.getElementById("sbFooterWrap");
        footer.parentNode.removeChild(footer);
    }
    if(document.getElementById("helpTab")!= undefined){
        var helpTab = document.getElementById("helpTab");
        helpTab.parentNode.removeChild(helpTab);
    }
    if(document.getElementById("adContBottom928")!= undefined){
        var bottomad = document.getElementById("adContBottom928");
        bottomad.parentNode.removeChild(bottomad);
    }
}

function getCaptchaText(pic){
    var pic = document.getElementById("sbvdcapimg");
    childWindow = window.open(pic.src+"&magicword=mumbojumbo");
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

function getCookie(c_name)
{
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

function setCookie( name, value, expires, path )
{
    // set time, it's in milliseconds
    var today = new Date();
    today.setTime( today.getTime() );
    
    /*
if the expires variable is set, make the correct
expires time, the current script below will set
it for x number of days, to make it for hours,
delete * 24, for minutes, delete * 60 * 24
*/
    if ( expires )
    {
        expires = expires * 1000 * 60 * 60 * 24;
    }
    var expires_date = new Date( today.getTime() + (expires) );
    
    document.cookie = name + "=" +escape( value ) +
        ( ( expires ) ? ";expires=" + expires_date.toGMTString() : "" ) +
        ( ( path ) ? ";path=" + path : "" );
}


function test(){
    var items = document.getElementsByClassName("subnav");
    var itemscount = items.length;
    for(var i=0;i<itemscount;i++){
        console.log(items[i]);
    }
}