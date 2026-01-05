// ==UserScript==
// @name        Chatango Remove Old Messages and more
// @namespace   Chatango Remove offscreen Images
// @description Removes images that are offscreen once per minute
//              Lifted some code from https://chrome.google.com/webstore/detail/obus-chatango-improvement/kppmmpajlakpalhigmmkbaikoklhgmnb
// @include     *//st.chatango.com/*
// @version     1.20
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.2.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/7686/Chatango%20Remove%20Old%20Messages%20and%20more.user.js
// @updateURL https://update.greasyfork.org/scripts/7686/Chatango%20Remove%20Old%20Messages%20and%20more.meta.js
// ==/UserScript==


this.$ = this.jQuery = jQuery.noConflict(true);
var styling;
var size;
var align;
var user_menu;
var user_menu_cache = {};
$("<style type='text/css'> .msg{ overflow-x:hidden; overflow-y:auto;max-height:140px;} p.msg-date { float: right; }</style>").appendTo("head");
//removeold();
$(function() {
    setInterval(removeold,300000);
    $('.msg-bg').bind('cssClassChanged', function(){
        if (styling == 0){
            return;
        }
        if ($(this).attr('class') == 'msg-bg'){
            return;
        }
        update();
    });
    $('body').append('<div class="user_menu_div" style="display: none; padding: 5px; max-width: 300px; background-color: white; border: 1px solid black; position: absolute;"></div>');
    $('body').on('mouseenter', '.user-thumb', function(event)
                 {
        if (user_menu == 0)
        {
            return;
        }
        var username = $(this).closest('.msg').find('.c_username').html();
        username = username.substring(0, username.length-2).toLowerCase();
        show_user_menu(username, $(this).offset().left, $(this).offset().top+$(this).height());
    });
    $('body').on('mouseleave', '.user-thumb', function(event)
                 {
        hide_user_menu();
    });
});


var timeout;
function removeold(){
    x=$('.msg').length;
    if(x>150){
        timeout=100;
        $('.msg').slice(0,x-150).each(function(){
            var curslice=this;
            setTimeout(function(){
                height=$(curslice).outerHeight(true);
                $.when($(curslice).remove()).then(function(){
                    $("#OM").css("top", parseInt($("#OM").css("top"))+height+"px");
                });
            }, timeout);
            timeout=timeout+100;
        });
    }
}

function show_user_menu(username, x, y)
{
    $('.user_menu_div').html(username);
    $('.user_menu_div').css('top', y);
    $('.user_menu_div').css('left', x);
    $('.user_menu_div').show();

    if (user_menu_cache.hasOwnProperty(username))
    {
        $('.user_menu_div').html(user_menu_cache[username]);
        return;
    }
    $.get('http://pst.chatango.com/profileimg/' + username[0] + '/' + username[1] + '/' + username + '/mod1.xml', function(data)
          {
        var text = "";
        var image = 'http://ust.chatango.com/profileimg/' + username[0] + '/' + username[1] + '/' + username + '/thumb.jpg';
        var name = "No information";
        var age = "Age?";
        var location = "Location?";
        var sex = "Gender?";
        if (data.getElementsByTagName)
        {
            if (data.getElementsByTagName('t').length)
            {
                name = data.getElementsByTagName('t')[0].innerHTML;
            }
            if (data.getElementsByTagName('body').length > 0)
            {
                text = unescape(data.getElementsByTagName('body')[0].innerHTML);
            }
            if (data.getElementsByTagName('b').length > 0)
            {
                age = get_age(data.getElementsByTagName('b')[0].innerHTML);
            }
            if (data.getElementsByTagName('l').length > 0)
            {
                location = data.getElementsByTagName('l')[0].innerHTML;
            }
            if (data.getElementsByTagName('s').length > 0)
            {
                sex = data.getElementsByTagName('s')[0].innerHTML;
            }
        }
        var html = "<div><img src='" + image + "' style='margin-right: 5px; float: left;'/>" + name + "<br/>" + (sex=='M'?'Male':(sex=='F'?'Female':sex)) + ", " + age + "<br/>" + location + "<br/>" + text;
        user_menu_cache[username] = html;
        $('.user_menu_div').html(html);
    });
}

function hide_user_menu()
{
    $('.user_menu_div').hide();
}
function get_age(dateString){
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())){
        age--;
    }
    return age;
}