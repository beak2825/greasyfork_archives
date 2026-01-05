
// ==UserScript==
// @name        KissAnime Cleaner
// @namespace   http://www.hackforums.net/member.php?action=profile&uid=2217295
// @description Fixes KissAnime Anti-Adblock issue.
// @include     http://kissanime.com/*
// @version     qt3.14  
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/6208/KissAnime%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/6208/KissAnime%20Cleaner.meta.js
// ==/UserScript==
var $ = unsafeWindow.jQuery;
var pause_option = GM_getValue("pause", true);
var quality_option = GM_getValue("quality", true);
var autoplay_option = GM_getValue("auto", true);
var autoscroll_option = GM_getValue("scroll", true);
if(window.top != window.self) {return;}
var url = document.location.href;
var home = /http:\/\/kissanime\.com\/$/;
var anime_list = /http:\/\/kissanime\.com\/(AnimeList)|(Status)|(Genre)|(Search)/;
var anime_page = /http:\/\/kissanime\.com\/Anime\/[\w-]*$/;
var video_page = /http:\/\/kissanime\.com\/Anime\/[\w-]*\/[\w-]*\?id=\n*/;
if (home.test(url)) {
    console.log('Performing Cleaning for Home Page');
    var rightside = document.getElementById('rightside');
    if (rightside) {
        for (var i = 0; i < rightside.childElementCount; i++) {
            if (rightside.children[i].childElementCount > 0) {
                if (rightside.children[i].children[0].textContent.search('Remove ads') > 0 ||
                rightside.children[i].children[0].textContent.search('Like me please') > 0 ||
                rightside.children[i].children[0].textContent.search('omments') > 0) {
                    rightside.removeChild(rightside.children[i--]);
                    if (i + 1 > - 1 && i + 1 < rightside.childElementCount) {
                        if (rightside.children[i + 1].className == 'clear2') {
                            rightside.removeChild(rightside.children[i + 1]);
                        }
                    }
                }
            }
        }
    }
    var leftad = document.getElementById('divFloatLeft');
    if (leftad) {
        leftad.remove();
    }
    var rightad = document.getElementById('divFloatRight');
    if (rightad) {
        rightad.remove();
    }
    var middlead2 = document.getElementById('divAds2');
    if (middlead2) {
        middlead2.remove();
    }
    var middlead = document.getElementById('divAds');
    if (middlead) {
        middlead.remove();
    }
    var adspace1 = document.getElementById('adsIfrme1');
    if (adspace1) {
        adspace1.remove();
    }
}
if (anime_list.test(url)) {
    console.log('Performing Cleaning for Anime List Pages');
    var adspace = document.getElementById('adsIfrme1');
    if (adspace) {
        if (adspace.parentElement.previousElementSibling && adspace.parentElement.previousElementSibling.className == 'clear') {
            adspace.parentElement.previousElementSibling.remove();
        }
        if (adspace.parentElement.nextElementSibling && adspace.parentElement.nextElementSibling.nextElementSibling &&
            adspace.parentElement.nextElementSibling.nextElementSibling.nextElementSibling &&
            adspace.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.className == 'clear') {
            adspace.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.remove();
        }
        adspace.parentElement.remove();
    }
    var leftad = document.getElementById('divFloatLeft');
    if (leftad) {
        leftad.remove();
    }
    var rightad = document.getElementById('divFloatRight');
    if (rightad) {
        rightad.remove();
    }
    var adspace2 = document.getElementById('adsIfrme2');
    if (adspace2) {
        adspace2.remove();
    }
}
if (anime_page.test(url)) {
    console.log('Performing Cleaning for Episode List Pages');
    var adspace = document.getElementById('adsIfrme1');
    if (adspace) {
        if (adspace.parentElement.previousElementSibling && adspace.parentElement.previousElementSibling.className == 'clear') {
            adspace.parentElement.previousElementSibling.remove();
        }
        if (adspace.parentElement.nextElementSibling && adspace.parentElement.nextElementSibling.nextElementSibling &&
            adspace.parentElement.nextElementSibling.nextElementSibling.nextElementSibling &&
            adspace.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.className == 'clear') {
            adspace.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.remove();
        }
        adspace.parentElement.remove();
    }
    var leftad = document.getElementById('divFloatLeft');
    if (leftad) {
        leftad.remove();
    }
    var rightad = document.getElementById('divFloatRight');
    if (rightad) {
        rightad.remove();
    }
    var middlead = document.getElementById('divAds');
    if (middlead) {
        middlead.remove();
    }
    var leftside = document.getElementById('leftside');
    if (leftside) {
        var count = 0;
        for (var i = 0; i < leftside.childElementCount; i++) {
            if (leftside.children[i].className == 'bigBarContainer') {
                if (count == 0) {
                }
                else if (count == 1) {
                    for (var j = 0; j < leftside.children[i].childElementCount; j++) {
                       if (leftside.children[i].children[j].className == 'barContent episodeList') {
                           var eplist = leftside.children[i].children[j];
                           if (eplist) {
                                eplist.children[1].children[0].remove();
                                eplist.children[1].children[0].remove();
                                eplist.children[1].children[0].remove();
                                eplist.children[1].children[0].remove();
                                eplist.children[1].children[0].remove();
                                eplist.children[1].children[0].remove();
                           }
                           break;
                       }
                   }
                }
                else if (count == 2) {
                    leftside.children[i].remove();
                }
                count++
            }
        } 
    }
    
    var bookmark_link = document.getElementById('spanBookmark');
    if (bookmark_link) {
        bookmark_link.remove();
    }
}
if (video_page.test(url)) {
    console.log('Performing Cleaning for Video Page');
    unsafeWindow.DoHideFake();
    var script = document.createElement('script'); 
    script.type = "text/javascript"; 
    script.innerHTML = 'DoHideFake = function() {} \n DoDetect2 = function() {}';
    document.getElementsByTagName('head')[0].appendChild(script);
    var adspace1 = document.getElementById('adsIfrme1');
    if (adspace1) {
        adspace1.remove();
    }
    var adspace2 = document.getElementById('adsIfrme2');
    if (adspace2) {
        adspace2.remove();
    }
    var adspace6 = document.getElementById('adsIfrme6');
    if (adspace6) {
        adspace6.remove();
    }
    var adspace7 = document.getElementById('adsIfrme7');
    if (adspace7) {
        adspace7.remove();
    }
    var adspace8 = document.getElementById('adsIfrme8');
    if (adspace8) {
        adspace8.remove();
    }
    var adspace9 = document.getElementById('adsIfrme9');
    if (adspace9) {
        adspace9.remove();
    }
    var adspace_side = document.getElementById('stats');
    if (adspace_side) {
        adspace_side.previousElementSibling.remove();
    }
    var comments = document.getElementById('disqus_thread');
    if (comments) {
        comments = comments.parentElement.parentElement;
        comments.previousElementSibling.remove();
        comments.previousElementSibling.remove();
        comments.remove();
    }
    var vid_parent = document.getElementById('centerDivVideo').parentElement;
    for (var i = 0; i < vid_parent.childElementCount; i++) {
        if(vid_parent.children[i].className == 'clear' || vid_parent.children[i].className == 'clear2') {
            vid_parent.removeChild(vid_parent.children[i--]);
        }
    }
    var html5_option = document.getElementById('playerChoose');
    if (html5_option) {
        html5_option.nextElementSibling.remove();
        html5_option.nextElementSibling.remove();
        html5_option.insertAdjacentHTML('afterend', '<br><br>');
        html5_option.remove();
    }
    var wait_for_playback; 
    var wait_for_end;
    var check_for_playback = function() {
        if(unsafeWindow.embedVideo.getPlayerState && unsafeWindow.embedVideo.getPlayerState() == 1) {
            clearInterval(wait_for_playback);
            if (pause_option) {
                unsafeWindow.embedVideo.pauseVideo();
                unsafeWindow.embedVideo.seekTo(0);
            }
            if (quality_option) {
                unsafeWindow.embedVideo.setPlaybackQuality(unsafeWindow.embedVideo.getAvailableQualityLevels()[0]);
            }
            if (autoplay_option) {
                wait_for_end = setInterval(check_for_end, 100);
            }
        }
    }
    var check_for_end = function() {
        if (unsafeWindow.embedVideo.getPlayerState() == 0) {
            clearInterval(wait_for_end);
            button = document.getElementById('btnNext');
            if (button) {
               link = button.parentElement;
               document.location.href = link.href;
            }
        }
    }
    wait_for_playback = setInterval(check_for_playback, 500);
    var LEFT_ARROW_KEY = 37;
    var RIGHT_ARROW_KEY = 39;
    var key_listener = function(event) {
        var key_pressed = event.which;
        if (key_pressed == LEFT_ARROW_KEY) {
            button = document.getElementById('btnPrevious');
            if (button) {
               link = button.parentElement;
               document.location.href = link.href;
            }
            event.preventDefault();
        }
        else if (key_pressed == RIGHT_ARROW_KEY) {
            button = document.getElementById('btnNext');
            if (button) {
               link = button.parentElement;
               document.location.href = link.href;
            }
            event.preventDefault();
        }
    }
    document.addEventListener("keydown", key_listener);
    if (autoscroll_option) {
       document.getElementById('container').scrollIntoView(true);
    }
}
console.log('Performing Cleaning for All Pages')
var search = document.getElementById('search');
if (search) {
    search.children[0].children[2].remove();
}
if($('div.divCloseBut')) {
    $('div.divCloseBut') .remove();
}
var HOME_KEY = 36;
var menu_open = false;
var global_key_listener = function(event) {
    var key_pressed = event.which;
    if (key_pressed == HOME_KEY) {
        event.preventDefault();
        if (!menu_open) {
            menu_open = true;
            var menu = document.createElement('div');
            menu.style = 'color:black;width:250px;height:175px;background-color:white;position:fixed;top:0;bottom:0;left:0;right:0;margin:auto;border:5px solid;border-radius:10px;border-color:#7FCA03;padding:10px;';
            menu.innerHTML = '<center><h1>KissAnime Cleaner Options</h1></center>' +
                '<form><input type="checkbox" name="pause" value="true" id="pause_option_box">Pause Videos on Page Load <br>' +
                '<input type="checkbox" name="quality" value="true" id="quality_option_box">Automatically Switch to Highest Quality <br>' +
                '<input type="checkbox" name="autoplay" value="true" id="autoplay_option_box">Automatically Play Next Video <br>' +
                '<input type="checkbox" name="autoscroll" value="true" id="autoscroll_option_box">Automatically Scroll Down to Video Area <br><br>' +
                '<center><input type="button" value="Save" id="menu_sumbit_button"></center></form>';
            document.getElementById('containerRoot').appendChild(menu);
            var pause_option_box = document.getElementById('pause_option_box');
            if (pause_option) {
                pause_option_box.checked = true;
            }
            var quality_option_box = document.getElementById('quality_option_box');
            if (quality_option) {
                quality_option_box.checked = true;
            }
            var autoplay_option_box = document.getElementById('autoplay_option_box');
            if (autoplay_option) {
                autoplay_option_box.checked = true;
            }
            var autoscroll_option_box = document.getElementById('autoscroll_option_box');
            if (autoscroll_option) {
                autoscroll_option_box.checked = true;
            }
            var submit_button = document.getElementById('menu_sumbit_button');
            submit_button.onclick = function() {
                GM_setValue("pause", pause_option_box.checked);
                GM_setValue("quality", quality_option_box.checked);
                GM_setValue("auto", autoplay_option_box.checked);
                GM_setValue("scroll", autoscroll_option_box.checked);
                pause_option = pause_option_box.checked;
                quality_option = quality_option_box.checked;
                autoplay_option = autoplay_option_box.checked;
                autoscroll_option = autoscroll_option_box.checked;
                menu.remove();
                menu_open = false;
            }
        }
    }
}
document.addEventListener("keydown", global_key_listener); 