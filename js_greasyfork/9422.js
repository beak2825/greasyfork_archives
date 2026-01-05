// ==UserScript==
// @name        iks: virtonomica форум
// @namespace   virtonomica
// @description Добавление кнопки ответить как прочитанные на верх страницы. Так-же скрывает сообщения, подпись и информацию пользователя под spoiler, в зависимости от ваших настроек.
// @include     http*://*virtonomic*.*/*/forum/forum_new/*/view*
// @include     http*://*virtonomic*.*/*/forum/forum_new/*/topic/*/view*
// @version     1.33
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9422/iks%3A%20virtonomica%20%D1%84%D0%BE%D1%80%D1%83%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/9422/iks%3A%20virtonomica%20%D1%84%D0%BE%D1%80%D1%83%D0%BC.meta.js
// ==/UserScript==

var run = function() {
    $("div#content > table").each(function() {
        if($(this).html().indexOf('Создать тему') + 1 )
            $(this).append( $('div#content > table.pagingContainer > tbody > tr').html() );
    });
},

strCss = '.forumIks_exit { background: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'10\'><path fill=\'none\' stroke=\'rgb(142,143,143)\' stroke-width=\'2\' d=\'M0,0 L10,10 M0,10 L10,0\' /></svg>") no-repeat;'
            +' position: absolute; top:-5px; right:0; margin:0; padding:0; width:10px; height:10px; border: 4px solid gray; border-radius:50%; font-size:18px; color:darkred; cursor:pointer}'
        +' .forumIks_but { width:50%;  margin-top:10px; cursor:pointer; color:white; border:1px solid #708090; border-radius: 10px; background: #708090;'
            +' background: linear-gradient(top, #e1e1e1, #708090, #e1e1e1);'
            +' background: -webkit-linear-gradient(top, #e1e1e1, #708090, #e1e1e1);'
            +' background: -moz-linear-gradient(top, #e1e1e1, #708090, #e1e1e1);'
            +' background: -ms-linear-gradient(top, #e1e1e1, #708090, #e1e1e1);'
            +' background: -o-linear-gradient(top, #e1e1e1, #708090, #e1e1e1) }',
str = '<div id="forumSettings" style="position:fixed; margin:0 auto; padding:0; display:none; background: #EEE none repeat;'
     +' border: 2px solid #b4b4b4; box-shadow: 0 0 0 2px #708090, 0 0 0 4px #b4b4b4; border-radius:11px;"><div style="position:relative; margin:0; padding:0">'
     +'<h1 style="width:100%; text-align:center">Настройки форума</h1><table style="margin:5px">'
     +'<tr><td>Скрывать большие сообщения в форуме:</td><td>'
         +'<select name="topic">'
             +'<option value=0>Не скрывать</option>'
             +'<option value=1>Только первое</option>'
             +'<option value=2>По всему форуму</option>'
         +'</select>'
     +'</td></tr>'
     +'<tr name="topic"><td>Сколько символов скрывать:</td><td>'
             +'<input type="text" name="topic1" size="4" value="250" style="width:95%; border:2px solid #708090; border-radius:3px; background:#e1e1e1; text-align:right">'
     +'</td></tr>'
     +'<tr><td>Скрывать информацию об авторе:</td><td>'
         +'<select name="user">'
             +'<option value=0>Не скрывать</option>'
             +'<option value=1>Только первое</option>'
             +'<option value=2>По всему форуму</option>'
         +'</select>'
     +'</td></tr>'
     +'<tr name="user"><td>Как скрывать информацию об авторе:</td><td>'
         +'<select name="user1" style="width:100%">'
             +'<option value=0>С аватором</option>'
             +'<option value=1>Ниже аватора</option>'
         +'</select>'
     +'</td></tr>'
     +'<tr><td>Подпись:</td><td>'
         +'<select name="signature" style="width:100%">'
             +'<option value=0>Не скрывать</option>'
             +'<option value=1>Скрывать</option>'
             +'<option value=2>Удалять</option>'
         +'</select>'
     +'</td></tr>'
     +'</td></tr>'
     +'<tr><td align="center" colspan="2"><input type="button" value="Сохранить" class="forumIks_but"></td></tr>'
     +'</table>'
     +'<div id="forumExitBloc" title="Закрыть" class="forumIks_exit"></div>'
     +'</div></div>',

topic = function(){
    var str, str1,
        o = { 'top': '5px', 'left': '5px', 'topic': 1, 'topic1': 250, 'user': 2, 'user1': 1, 'signature': 0 },
        workTopic = function(id, p) {
            str = $(id).html();
            if(str.length > o['topic1']) {
                $(id).html( '<div class="bbSpoiler" style="padding:0; border:none"><div class="bbSpoilerTitle">'
                           +'<a href="#" onclick="return xbbSpoiler(this)" style="text-decoration:none"><span><strong><u>[+] Развернуть</u></strong>'
                           +'<p style="color:#000; font-weight:normal">' + str.replace(/<[^>]+>/g,'').replace(/\[\+\] spoiler/g,'').replace(/\[-\] spoiler/g,' ').substring(0, o['topic1']) + '...</p>'
                           +'</span><span style="display:none"><strong><u>[-] Свернуть</u></strong></span></a></div>'
                           +'<div class="bbSpoilerText" style="display: none"><hr>'+ str + '</div></div>');
            }
        },
        work = function(id, p) {
            str = '';
            $(id).find('script').remove();
            $(id).parent().css('width','170');
            if(o['user1']==1 && p) {
                str = '<table width="164" cellspacing="0" cellpadding="0" border="0" style="margin-left:4px;margin-bottom:5px;">' + $(id).find('table:first').html() + '</table>';
                $(id).find('table:first').remove();
            }
            $(id).html( str +'<div class="bbSpoiler" style="padding:0; border:none"><div class="bbSpoilerTitle">'
                       +'<a href="#" onclick="return xbbSpoiler(this)" style="text-decoration:none"><span><small><u>[+] Показать</u></small>'
                       +'</span><span style="display:none"><small><u>[-] Скрыть</u></small></span></a></div>'
                       +'<div class="bbSpoilerText" style="padding:0; display: none;">' + $(id).html() + '</div></div>' );
        };
    
    if( window.localStorage.getItem('forumSettings') ) {
        o = JSON.parse( window.localStorage.getItem('forumSettings') );
        if(!o.signature) o.signature = 0;
    }
    
    // Сообщения
    switch ( o['topic'] ) {
        case '1':
            workTopic( $('table.message_color2:first tr:nth-child(3) > td[id]'), true );
            break;
        case '2':
            $('table.message_color2 tr:nth-child(3) > td[id]').each(function(){
                workTopic( $(this), true );
            });
            break;
        default:
    }
    // Автор соообщения
    switch ( o['user'] ) {
        case '1':
            work( $('table.message_color2:first tr:nth-child(2) > td:nth-child(1) > noindex'), true );
            break;
        case '2':
            $('table.message_color2 tr:nth-child(2) > td:nth-child(1) > noindex').each(function() {
                work( $(this), true );
            });
            break;
        default:
    }
    // Подпись
    switch ( o['signature'] ) {
        case '1':
            $('table.message_color2 tr:nth-child(4) > td.signature').each(function(){
                work( $(this), false );
            });
            break;
        case '2':
            $('table.message_color2 tr:nth-child(4)').remove();
            break;
        default:
    }
    
    /* Настройки */
    $('#forumSettings').css({'top': ($('body').height()/2-$('#forumSettings').height()/2-5) + 'px',
                             'left': ($('body').width()/2-$('#forumSettings').width()/2-5) + 'px',
                             'display':'none'});
    $('#forumSettings select[name="topic"]').val(o['topic']).change();
    $('#forumSettings input[name="topic1"]').val(o['topic1']);
    $('#forumSettings select[name="user"]').val(o['user']).change();
    $('#forumSettings select[name="user1"]').val(o['user1']).change();
    $('#forumSettings select[name="signature"]').val(o['signature']).change();
    if( $('#forumSettings select[name="topic"]').val() == 0 ) $('#forumSettings tr[name="topic"]').css('display', 'none');
    if( $('#forumSettings select[name="user"]').val() == 0 ) $('#forumSettings tr[name="user"]').css('display', 'none');
    
    // Показать/Скрыть
    $('div.forumIks_exit').click( function() {
        $('#forumSettings').css('display', 'none');
    });
    $('#forumLinkSettings').click( function() {
        if( $('#forumSettings').css('display') == 'block' ) $('#forumSettings').css('display', 'none');
        else $('#forumSettings').css('display', 'block');
    });
    // Только цифры
    $('#forumSettings inputnput[name]').bind("change keyup input click", function() {
        $(this).val( parseInt( $(this).val().replace(/[^0-9]/g, '') ) | 0 );
    });
    // Отследим выбор select
    $('#forumSettings select').change(function() {
        switch ( $(this).attr('name') ) {
            case 'topic':
                if( $(this).val() > 0 ) $('#forumSettings tr[name="topic"]').removeAttr('style');
                else  $('#forumSettings tr[name="topic"]').css('display', 'none');
                break;
            case 'user':
                if( $(this).val() > 0 ) $('#forumSettings tr[name="user"]').removeAttr('style');
                else  $('#forumSettings tr[name="user"]').css('display', 'none');
                break;
            case 'signature':
                if( $(this).val() > 0 ) $('#forumSettings tr[name="signature"]').removeAttr('style');
                else  $('#forumSettings tr[name="signature"]').css('display', 'none');
                break;
            default:
        }
    });
    // Сохранить
    $('#forumSettings input.forumIks_but').click( function() {
        window.localStorage.setItem('forumSettings',
                                    JSON.stringify( {'top': $('#forumSettings').css('top') + 'px',
                                                     'left': $('#forumSettings').css('left') + 'px',
                                                     'topic': $('#forumSettings select[name="topic"]').val(),
                                                     'topic1': $('#forumSettings input[name]').val(),
                                                     'user': $('#forumSettings select[name="user"]').val(),
                                                     'user1': $('#forumSettings select[name="user1"]').val(),
                                                     'signature': $('#forumSettings select[name="signature"]').val()
                                                    } ));
        $('#forumSettings').css('display', 'none');
        location.reload();
    });
}

if(window.top == window) {
    if( window.location.href.indexOf('/topic') + 1 ) {
        $( '<style/>', {text: strCss } ).appendTo('head');
        $('#user_info.relams.user > div.floatright > span.menu').append('<span class="linka"><a id="forumLinkSettings" href="#">Настройки форума</a></span>');
        $('body').append( str );
        $( '<script/>', { text: '(' + topic.toString() + ')()' } ).appendTo('head');
    } else
        $( '<script/>', { text: '(' + run.toString() + ')()' } ).appendTo('head');
}