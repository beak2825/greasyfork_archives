// ==UserScript==
// @name       A-Medical Center img reload
// @version    1.03
// @namespace  A-Meial Center
// @description  메디칼 센터 이미지 주소변경 & 로딩실패시 재로딩(페이지,사진)
// @include    *ame.org*/*
// @copyright  by. 달귀
// @downloadURL https://update.greasyfork.org/scripts/5595/A-Medical%20Center%20img%20reload.user.js
// @updateURL https://update.greasyfork.org/scripts/5595/A-Medical%20Center%20img%20reload.meta.js
// ==/UserScript==

//페이지 로딩실패시 새로고침
var str = document.body.innerHTML;
if(str.match(/MySQL server has gone away/) && !str.match(/good\.php/)){
    location.reload();
}

//아이디와 비밀번호 입력시 자동로그인됩니다.
//아이디가 달귀 라면 var id = '달귀'; 이렇게해주시면됩니다.
var id = '';
var pw = '';


function login() {	//로그인
    if( id != '' || pw != '' ) {
        if( $('form[name=fhead],form[name=flogin]').each(
            function() {
                $('input[name=mb_id]').val(id);
                $('input[name=mb_password]').val(pw);
                this.action = '/bbs/login_check.php';
                this.submit();
            }).length == 0
          ){} 
    }
}

(function($) {
    try {
        login();    
        switch(location.pathname) {
            case '/main.php' : //메인페이지 링크변경
                $('a[href*="ame.org/bbs"]').each(function() {
                    var path = $(this).attr('pathname')+$(this).attr('search');
                    // console.log('link Modify ['+ path + ']');
                    $(this).attr('href', path);
                });
                break;
            case '/bbs/board.php' :
                //이미지 주소변경
                img_reload();
                
                //이미지 로딩실패시 재로딩
                var check = 0;
                var date = new Date();
                var time = 10;
                
                var run = setInterval(check_img_loaded, time*1000);
                function check_img_loaded() {
                    var tmp = check;
                    $(document).ready(function (){
                        $('img[name^="target_resize_image[]"]').each(function() {
                            //var url = $.url($(this).attr('src'));
                            var url = $(this).attr('src');
                            $(this).error(function(){
                                $(this).attr('src', $(this).attr('src'));
                            });
                            if( ((this).naturalHeight==0 || (this).naturalWidth==0) && $(this).attr('protocol') == undefined )	{
                                $(this).attr("src", $(this).attr('src').match(/.+(jpg|jpeg|bmp|png|gif)/i)[0] + "?t=" + new Date().getTime());
                                console.log(' check ImgLoaded ['+ $(this).attr('src') + ']');
                                check++;
                            }
                        });
                    });
                    curDate = new Date();
                    if( (check == tmp) && ((curDate-date) > time*1000) ){
                        clearInterval(run);
                    }
                }
                break;
            case '/skin/board/mw.basic/mw.proc/mw.print.php' :
                $('body').replaceWith( $('body').html().replace(/<br>\s<b>Deprecated<\/b>.+<br>/m, '') )
                img_reload();
                break;
        }        
    }catch(e) {}
})(unsafeWindow.jQuery);

function img_reload(){
    $('img[name^="target_resize_image[]"]').each(function() {
        var origin = $(this).attr('src').match(/.+.\.org:\d*[^\/]|.+.\.org*[^\/]/);        
        var bo_list = ['E00', 'E01', 'E02', 'E03', 'E04', 'D00', 'D01', 'D02','D03', 'D04', 'D05', 'D07'];
               
        if( origin != location.origin && ($.inArray(g4_bo_table, bo_list) <= 0)) {
            var list = ['.+ame', '.+viewac', '.+feelac', '.+amedical', '.+amecenter'];
            for(var i in list)	{
                if( $(this).attr('src').indexOf(list[i]) ) {
               		var path = $(this).attr('src').replace(origin, '');
                    if(path)	{
                        console.log('img reload ['+ path + ']');
                        $(this).attr('src', path);
                        return;
                    }
                }
            }
        }
    });
}