// ==UserScript==
// @name            FapFun
// @namespace   	https://greasyfork.org/scripts/7156-fapfun/code/FapFun.user.js
// @description 	Userscript for Motherless.com. Provide direct links for pictures and video files. Download all Images on one site with DownThemAll(firefox) or Download Master(Chrome).
// @require			https://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js
// @include         htt*://motherless.com*
// @version         4.9
// @grant           GM.xmlHttpRequest
// @grant           GM.setClipboard
// @grant           GM.setValue
// @grant           GM.getValue
// @grant           GM.deleteValue
// @grant           UnsafeWindow
// @author          sodomgomora
// @license         GPLv3
// @downloadURL https://update.greasyfork.org/scripts/7156/FapFun.user.js
// @updateURL https://update.greasyfork.org/scripts/7156/FapFun.meta.js
// ==/UserScript==
// Some of this script based on Pornifier2 script by Jesscold 
// This script is realesed under GPL v3
// Globals
var debug = false;
var images = [];
var ids = [];
var imagesUrl = [];
var siteurls = [];
var thisurl = '';
var protocol = document.location.protocol;
// Start the magic
main();
function fapLog(log) {
    if (debug === true) {
        console.log(log);
        return;
    }
    return;
}
function main() {
    fapLog('entered main');
    fapLog(protocol);
    var turl = thisurl = window.location.href;
    var casesn = turl.indexOf('/',7);
    var cases = turl.substring(casesn + 1, casesn + 2);
    fapLog('main: m= ' + cases + ": :" + turl);
    if (cases == "m") {
        var uploads = document.createElement('input');
        uploads.type = 'button';
        uploads.value = 'Uploads';
        uploads.name = 'useruploads';
        //fapLog('main: entered m= ' + turl);
        uploads.onclick = uploss;
        uploads.setAttribute('style', 'font-size:18px;position:fixed;top:160px;right:20px;z-index:10000;');
        document.body.appendChild(uploads);
    }
    
    var inputName = document.createElement('input');
    inputName.type = 'text';
    inputName.value = '';
    inputName.name = 'newname';
    inputName.id = 'newname';
    //inputName.onclick = getImageList;
    inputName.setAttribute('style', 'font-size:16px;position:fixed;top:60px;right:20px;z-index:10000;');
    document.body.appendChild(inputName);
  
    var inputList = document.createElement('input');
    inputList.type = 'button';
    inputList.value = 'Images URLs';
    inputList.name = 'imagesurl';
    inputList.onclick = getImageList;
    inputList.setAttribute('style', 'font-size:18px;position:fixed;top:100px;right:20px;z-index:10000;');
    document.body.appendChild(inputList);
  
    addSinglePreview();
    if (cases == "u"){
        var t = turl.lastIndexOf("/");
        var tt = turl.lastIndexOf("?");
        if (tt < 1){
            tt = turl.length;
        }
        document.getElementById("newname").value = turl.substring(t+1, tt);
    }
    checkForPaginationLinks(function (hasOne) {
        fapLog('main: haseOne= ' + hasOne);
        if (hasOne > 0) {
            var inputAllImages = document.createElement('input');
            inputAllImages.type = 'button';
            inputAllImages.value = 'Get all Images';
            inputAllImages.name = 'getallimages';
            inputAllImages.onclick = getAllImages;
            inputAllImages.setAttribute('style', 'font-size:18px;position:fixed;top:140px;right:20px;z-index:10000;');
            document.body.appendChild(inputAllImages);
        }
        return;
    });
    return;
}

function uploss() {
    //alert("Hello! I am an alert box!");
    var turl = window.location.href;
    var newurl = turl.replace("/m/","/u/");    
    window.location = newurl;
    //return;
}

function addResetButton() {
    var resetButton = document.createElement('input');
    resetButton.type = 'button';
    resetButton.value = 'Reset';
    resetButton.name = 'deletevalue';
    resetButton.onclick = deleteGMValue;
    resetButton.setAttribute('style', 'font-size:18px;position:fixed;top:220px;right:20px;z-index:10000;');
    document.body.appendChild(resetButton);
    return;
}
function checkForPaginationLinks(cb) {
    var ret = '';
    ret = $('.pagination_link').contents().text();
    fapLog('checkForPaginationLinks: entered!');
    fapLog('checkForPaginationLinks: ret= ' + ret);
    if (ret === '') {
        cb(0);
        return;
    } else {
        cb(1);
        return;
    }
}
//----- Button onclick functions -----

function deleteGMValue() {
    fapLog('deleteGMValue: thisurl= ' + thisurl);
    GM.deleteValue(thisurl);
    $('input[name*=\'deletevalue\']').remove();
    $('input[name*=\'stopvalue\']').remove();
}
function getAllImages() {
    var href = '';
    var lasttmp = 0;
    ids = [
    ];
    href = window.location.href;
    href = href.replace(/^(http|https):\/\//i, '');
    fapLog('getAllImages: href= ' + href);
    var url = getUrl(href);
    if (GM.getValue(url.allsites) == thisurl) {
        fapLog('getAllImages: was processed earlyer!');
        fapLog(GM.getValue(url.allsites));
        addResetButton();
        displayOverlay(imagesUrl, 'lasti', url.allsites);
        thisurl = url.allsites;
        return;
    }
    thisurl = url.allsites;
    sneakyXHR(url.onesite, function (src) {
        fapLog('getAllImages: callback from sneakyXHR = ' + src);
        var urlwithoutpagenumber = url.onesite.substring(0, url.onesite.length - 1);
        $firstids = $('<div>' + src + '</div');
        $firstsite = $('<div>' + src + '</div').find('.pagination_link a');
        fapLog($firstsite);
        $firstsite.each(function () {
            var tmp = parseInt($(this).text());
            if (tmp > lasttmp) {
                lasttmp = tmp;
            }
        });
        var headers = {
			'Accept': 'text/xml',
            'Range': 'bytes=0-300'
        };
        //load last paginationsite if last is realy true
        GM.xmlHttpRequest({
            method: 'get',
            'url': urlwithoutpagenumber + lasttmp,
            headers: $.extend({
            }, {
                'User-agent': 'Mozilla/4.0',
                'Accept': 'text/xml',
				'Range': 'bytes=0-300',
                'Cookie': document.cookie
            }, headers || {
            }),
            onload: function (responseDetails) {
                var lastsitetmp = 1;
                var text = responseDetails.responseText;
                $lastsite = $('<div>' + text + '</div').find('.pagination_link a');
                fapLog($lastsite);
                $lastsite.each(function () {
                    var tmp = parseInt($(this).text());
                    if (tmp > lastsitetmp) {
                        lastsitetmp = tmp;
                    }
                });
                fapLog('getAllImages: lasttmp= ' + lasttmp + ' lastsitetmp=' + lastsitetmp);
                if (lasttmp < lastsitetmp) {
                    lasttmp = lastsitetmp;
                }
                $test = $firstids.find('img[src^="' + protocol + '//cdn5-thumbs.motherlessmedia.com/thumbs/"]');
                $test.each(function () {
                    try {
                        var id = $(this).attr('data-strip-src').match('thumbs/([^?]+)');
                    }
                    catch (err) {
                        return;
                    }
                    ids.push(id[1]);
                });
                fapLog('getAllImages: lasttmp= ' + lasttmp);
                //paginationsite shown but has no link
                if (lasttmp == 0) {
                    getImages('getallimages', ids);
                    return;
                }
                var urlwithoutpagenumber = url.onesite.substring(0, url.onesite.length - 1);
                for (var i = 2; i < lasttmp + 1; i++) {
                    var lenght = siteurls.push(urlwithoutpagenumber + i);
                }
                fapLog('getAllImages: siteURLs= ' + siteurls);
                addStop();
                parralelizeTask(siteurls, loopGetSites, 'getallimages', function () {
                    getImages('getallimages', ids);
					ids = [];
                    return;
                });
            }
        });
    }, 'get', {
		'Accept': 'text/xml',
        'Range': 'bytes=0-300' //grab first 3k
    });
    return;
}
// retrun URLs for user,group,galleries and search page
function getUrl(href) {
    var url = '';
    var urlall = '';
    var parthref = '';
    var n = href.indexOf('?');
    if (n != -1) {
        parthref = href.substring(0, n);
    } else {
        parthref = href;
    }
    fapLog('getUrl: parthref= ' + parthref);
    var casesn = parthref.indexOf('/');
    var cases = parthref.substring(casesn + 1, casesn + 2);
    fapLog('getUrl: cases= ' + cases);
    switch (cases) {
        case 'G':
            var gup = parthref.substring(casesn + 3, parthref.lenght);
            fapLog('getUrl: gup= ' + gup);
            url = protocol +'//motherless.com/GI' + gup + '?page=1';
            urlall = protocol +'//motherless.com/GI' + gup;
            break;
        case 'g':
            var g = parthref.substring(casesn + 3, parthref.lenght);
            fapLog('getUrl: g= ' + g);
            url = protocol +'//motherless.com/gi' + g + '?page=1';
            urlall = protocol +'//motherless.com/gi' + g;
            break;
        case 'u':
            var u = parthref.substring(casesn, parthref.lenght);
            fapLog('getUrl: u= ' + u);
            url = protocol +'//motherless.com' + u + '?t=i&page=1';
            urlall = protocol +'//motherless.com' + u;
            break;
        case 't':
            var t = parthref.substring(casesn, parthref.lenght);
            fapLog('getUrl: t= ' + t);
            url = protocol +'//motherless.com' + t + '?range=0&size=0&sort=relevance&page=1';
            urlall = protocol +'//motherless.com' + t;
            break;
    }
    return {
        onesite: url,
        allsites: urlall
    };
}
function getImageList() {
    fapLog('getImageList: pressed');
    thisurl = window.location.href;
    if (thisurl.indexOf('?') == -1) {
        thisurl = thisurl + '?page=1';
    }
    //if (GM.getValue(thisurl) != undefined) {
    //    addResetButton();
    //    displayOverlay(data = [], 'lasti', thisurl);
    //    return false;
    //}
    getImages('imagesurl', images);
    return;
}
function getVideoUrl() {
    alert('not jet implemented!');
    return;
}

// Get url for full image and add url under thumbnail

function addSinglePreview() {
    var data = [];
    var i = 0;
    var imgs = $('img[src^="' + protocol + '//cdn5-thumbs.motherlessmedia.com/thumbs/"]');
    if (typeof unsafeWindow.__fileurl != "undefined") {
        fapLog('Script url found: ' + unsafeWindow.__fileurl);
        var $wrap = $('.media-action-networks');
        fapLog('TEst' + $wrap.toSource());
        var videourl = $('<strong>Video URL: </strong><a href=\'' + unsafeWindow.__fileurl + '\' class=\'pop\'>Download</a>');
        $wrap.after(videourl);
    }
    fapLog('image urls found: ' + imgs.length);
    imgs.each(function () {
        var $wrap = $(this);
        var $a = $wrap.closest('a');
            var vid = $wrap.attr('src').match('thumbs/([^.]+)');
            // test for video preview and not an image
            var vlink = vid[1];
            var n = vlink.indexOf('-');
            fapLog('vlink: ' + vlink);
            const regex = new RegExp(/-[s]/i);
        if (regex.test(vlink)) {
            var videoClicky = $('<a href=\'javascript;\' class=\'p2-single-preview\'><font color="#bb00ff" size="4">View Video</font></a>');
            $a.after(videoClicky);
            var href = $a.attr('href');
            fapLog("HREF video: " + href);
            if (typeof href == 'undefined') return;
            href = href.match(/\.com\/(\w)(\w+)/) ? [
              RegExp.$1,
              RegExp.$2
            ] : false;
            videoClicky.click(function (e, single) {
                var $this = $(this);
                //$this.text('loading...');
                var id = $wrap.attr('data-strip-src').match('thumbs/([^.]+)');
                var vl = id[1];
                var n = vl.indexOf('-');
                id[1] = vl.substring(0, n);
                fapLog('addSinglePreview: found url for video: ' + id[1]);
                //if (!id) {
                //    $this.text('cant load :P');
                //    return;
                //}
                //var timer = setTimeout(function () {
                //    $this.text('cant load :P');
                //}, 8000);
				data[0] = {url: protocol +  "//cdn5-videos.motherlessmedia.com/videos/" + id[1] +".mp4?fs=opencloud"}
				fapLog('addSinglePreview: video src: ' + data.toString());
				displayOverlay(data, 'video');
				//$this.text('View Video');
                //clearTimeout(timer);
                return false;
            });
        }
        else {
            try {
                var id = $wrap.attr('data-strip-src').match('thumbs/([^?]+)');
            }
            catch (err) {
                fapLog(err.message);
                return;
            }
            images[i] = id[1];
            i++;
            fapLog('fill images: image=' + images[i - 1] + ' index=' + i);
            var imageClicky = $('<a href=\'javascript;\' class=\'p2-single-preview\'><font color="#5500ff" size="4">View</font></a>');
            $a.after(imageClicky);
            href = $a.attr('href');
            fapLog("HREF image: " + href);
            if (typeof href == 'undefined') return;
            href = href.match(/\.com\/(\w)(\w+)/) ? [
              RegExp.$1,
              RegExp.$2
            ] : false;
            imageClicky.click(function (e, single) {
                var $this = $(this);
                //$this.text('loading...');
                fapLog('found url for image: ' + id[1]);
                //if (!id) {
                //    $this.text('cant load :P');
                //    return;
                //}
                //var timer = setTimeout(function () {
                //    $this.text('cant load :P');
                //}, 8000);
				data[0] = {url: protocol +  "//cdn5-images.motherlessmedia.com/images/" + id[1] +"?fs=opencloud"}
				fapLog('addSinglePreview: image src: ' + data.toString());
				displayOverlay(data, 'image');
				//$this.text('View');
                //clearTimeout(timer);
                return false;
            });
        }
    });
}

function getImages(buttonname, arrimg)
{
	fapLog('getImagesJPG: arrimg.length=' + arrimg.length);
    fapLog(arrimg);
    $button = $('input[name*=\'' + buttonname + '\']');
    $button.val('working...');
	arrimg.forEach( function (value) {
		imagesUrl.push(protocol + "//cdn5-images.motherlessmedia.com/images/" + value +"?fs=opencloud");
	});
	displayOverlay(imagesUrl, 'images', thisurl);
	$('input[name*=\'stopvalue\']').remove();
	return;
}

function sneakyXHR(url, cb, method, headers) {
    method = method || 'GET';
    fapLog('sneaky requesting: ' + url);
    setTimeout(function () {
        GM.xmlHttpRequest({
            method: method,
            url: url,
            headers: $.extend({
            }, {
                'User-agent': 'Mozilla/4.0',
                'Accept': 'text/xml',
				'Range': 'bytes=0-300',
                'Cookie': document.cookie
            }, headers || {
            }),
            onload: function (responseDetails) {
                var text = responseDetails.responseText;
                cb(text, responseDetails);
            }
        });
    }, 1);
    return;
}

//-- handler for Overlay (jquery)

function removeOverlay() {
    $('#overlay').remove();
    return;
}
// show the full image as overlay and shrink it to screen resolution

function displayOverlay(data, type, url) {
    var mywidht = window.innerWidth;
    var myheight = window.innerHeight;
    var html = '';
    fapLog('monitor resolution: ' + window.innerWidth + ':' + window.innerHeight);
    switch (type) {
        case 'lasti':
            fapLog('displayOverlay: lasti: url= ' + url);
            html = GM.getValue(url);
            GM.setClipboard(GM.getValue(url + 'clipboard'));
            break;
        case 'image':
            html = '<table id=\'overlay\'><tbody><tr><td><div id="close"><img src=\'' + data[0].url + '\' style=\'width:auto; hight:auto; max-height:' + myheight + 'px; max-width:' + mywidht + 'px\'></div></td></tr></tbody></table>';
            break;
        case 'video':
            html = '<table id=\'overlay\'><tbody><tr><td><video src="'+ data[0].url +'" type="video/mp4" controls></video><br><a href=\'' + data[0].url + '\'>Video Link</a><br><br><div id="close">Close</div></td></tr></tbody></table>';
            break;
        case 'images':
            var clipboard = '';
            var count = 1;
            $('input[name*=\'getallimages\']').val('Get all Images');
            $('input[name*=\'imagesurl\']').val('Images URLs');
            var newname = document.getElementById("newname").value;
            html = '<table id=\'overlay\'><tbody><tr><td><br><div id="close">Close</div>';
            data.forEach(function (value) {
                var extension = value.substr(value.lastIndexOf('.')+1, 3);
                html += '<a class=\'changeColorLink\' href=\'' + value + '\' download= '+ newname + count + '.' + extension +' >link ' + count + '</a> ';
                clipboard += value + ' \n';
                count++;
            });
            html += '</td></tr></tbody></table>';
            GM.setClipboard(clipboard);
            GM.setValue(url, html.toString());
            GM.setValue(url + 'clipboard', clipboard.toString());
            break;
    }
    fapLog('displayOverlay: type= ' + type + ': html=' + html.toString());
    setTimeout(function () {
        var $el = $(html).css({
			'overlay':'before',
            'position': 'fixed',
            'top': 0,
            'left': 0,
            'width': '90%',
            'height': '100%',
            'background-color': 'rgba(0,0,0,.7)',
            'z-index': 300000,
            'vertical-align': 'middle',
            'text-align': 'center',
            'color': '#fff',
            'font-size': '30px',
            'font-weight': 'bold',
            'overflow': 'hidden',
            'cursor': 'auto'
        });
        $('a.changeColorLink', $el).hover(function () {
            $(this).css('color', 'blue');
        }, function () {
            $(this).css('color', 'pink');
        });
        $el.appendTo('body');
		$("#close").click(function () {
			fapLog("BUTTON CLICK");
			if ($('#overlay').length > 0) {
				removeOverlay();
				return;
			}
		});
    }, 50);
    return;
}
//----- PARALELLIZISE -----
//paralellize for getting all sites within pagination 

function loopGetSites(doneTask, value) {
	var timeout = setTimeout(function (){
		fapLog("Timeout is called");
		doneTask();
	}, 120000);
    sneakyXHR(value, function (src) {
		clearTimeout(timeout);
        $firstids = $('<div>' + src + '</div');
        $test = $firstids.find('img[src^="' + protocol +'//cdn5-thumbs.motherlessmedia.com/thumbs/"]');
        $test.each(function () {
            try {
				var id = $(this).attr('data-strip-src').match('thumbs/([^?]+)');
				fapLog(id[1]);
            }
            catch (err) {
                fapLog(err.message);
                return;
            }
            if (id[1].lastIndexOf('-strip') != -1) {
                fapLog('loopGetSites: Falsche parameter. Enthält -strip');
                return;
            }
            ids.push(id[1]);
            return;
        });
        doneTask();
        return;
    }, 'get', {
        'Range': 'bytes=0-3000' //grab first 3k);		
    });
}

//helper function for parralelize functions

function parralelizeTask(arr, fn, buttonname, done) {
    fapLog('parralelizeTask: arr= ' + arr);
    var total = arr.length;
    var maxtotal = total;
	
    fapLog('parralelizeTask: arr.length= ' + total);
    doneTask = function () {
        if (--total === 0) {
            done();
            return;
        }
        $('input[name*=\'' + buttonname + '\']').val('processed:' + total);
        return;
    };
    arr.forEach(function (value) {
        fn(doneTask, value);
    });
    return;
}

function addStop() {
    var stopButton = document.createElement('input');
    stopButton.type = 'button';
    stopButton.value = 'Stop';
    stopButton.name = 'stopvalue';
    stopButton.onclick = stop;
    stopButton.setAttribute('style', 'font-size:18px;position:fixed;top:260px;right:20px;z-index:10000;');
    document.body.appendChild(stopButton);
    return;
}

function stop() {
    displayOverlay(imagesUrl, 'images', thisurl);
}
