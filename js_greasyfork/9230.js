// ==UserScript==
// @name           Fix Google Search Options
// @description    Google検索で検索オプションのメニューをサイドバーへ移して表示します
// @namespace      https://pcvogel.sarakura.net/
// @include        http://*.google.*/search?*
// @include        https://*.google.*/search?*
// @include        http://*.google.*/images?*
// @include        https://*.google.*/images?*
// @exclude        https://*.google.*/*tbm=shop*
// @exclude        https://*.google.*/*tbm=bks*
// @exclude        https://*.google.*/*tbm=app*
// @exclude        https://*.google.*/*tbm=lcl*
// @exclude        https://*.google.*/preferences?*
// @grant          GM_addStyle
// @version        1.4.8
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/9230/Fix%20Google%20Search%20Options.user.js
// @updateURL https://update.greasyfork.org/scripts/9230/Fix%20Google%20Search%20Options.meta.js
// ==/UserScript==

(function() {

    var CSS =
        '#center_col{ margin-left:20px !important; }';
    GM_addStyle(CSS);


    //lr:検索範囲
    function get_form_lr(){

        var list = ['lang_ja', 'lang_en',''];
        var strlist = ['日本語のページ', '英語のページ','ウェブ全体'];

        var baseurl = document.location.href.replace(/lr=([^(&#)]+)[&#]?/, '');
        var current = (RegExp.$1)? RegExp.$1 : '';
        var generateOption = function(v) {
            var i;
            var valuestr;
            for( i = 0 ; i < list.length ; i++ ){
                if( v == list[i] ){
                    valuestr = strlist[i];
                }
            }
            return '<option value="' + v + '"'
                 + ((v == current)? ' selected="1"' : '') + '>' + valuestr + '</option>';
        };
        var opts = list.map(generateOption).join("\n");

        return '<select id="get_form_lr" style="width:110px" size="3" name="lr2" >' + opts + '</select>';

    }



    //検索期間
    function get_form_qdr(){

        var list = ['', 'qdr%3Ah','qdr%3Ad','qdr%3Aw','qdr%3Am','qdr%3Am3','qdr%3Am6','qdr%3Ay','qdr%3Ay3',];
        var strlist = ['期間指定なし','1 時間以内','24 時間以内','1 週間以内','1 か月以内','3 か月以内','6 か月以内','1 年以内','3 年以内'];

        var baseurl = document.location.href.replace(/tbs=([^&]+)&?/, '');
        var currenttbs = (RegExp.$1)? RegExp.$1 : '';

        currenttbs = currenttbs.replace(/\:/, '%3A');
        var notqdr_tbs = currenttbs.replace(/,?(qdr%3A[^(&#)^,]+)[&#,]?/, '');

        var currentqdr;
        if( notqdr_tbs == currenttbs ){
            currentqdr = '';
        }else{
            currentqdr = RegExp.$1;
        }
        currentqdr = currentqdr.replace(/%2C.+/, '');
        currentqdr = currentqdr.replace(/,.+/, '');

        var generateOption = function(v) {
            var i;
            var valuestr;
            for( i = 0 ; i < list.length ; i++ ){
                if( v == list[i] ){
                    valuestr = strlist[i];
                }
            }
            var newtbs;
            if( currenttbs == '' ){
                if( v == '' ){
                    newtbs = '';
                }else{
                    newtbs = 'tbs=' + v;
                }
            }else{
                if( currentqdr == '' ){
                    if( v == '' ){
                        newtbs = 'tbs=' + currenttbs;
                    }else{
                        newtbs = 'tbs=' + currenttbs + ',' + v;
                    }
                }else{
                    if( v == '' ){
                        newtbs = 'tbs=' + notqdr_tbs;
                    }else{
                        newtbs = 'tbs=' + notqdr_tbs + ',' + v;
                    }
                }
            }
            newtbs = newtbs.replace( /tbs=,/ , 'tbs=');
            return '<option value="' + newtbs
                + ((v == currentqdr)? '" selected="1"' : '"') + '>' + valuestr + '</option>';
        };
        var opts = list.map(generateOption).join("\n");

        return '<select id="get_form_qdr" style="width:110px" size="9" name="qdr2">' + opts + '</select>';

    }



    function get_form_iXX( regstr , argstr , list , strlist ){

        var baseurl = document.location.href.replace(/tbs=([^&]+)&?/, '');
        var currenttbs = (RegExp.$1)? RegExp.$1 : '';

        currenttbs = currenttbs.replace(/\:/g, '%3A');
        currenttbs = currenttbs.replace(/,,/, ',');
        var notiXX_tbs = currenttbs.replace( regstr , '' );

        var currentiXX;
        if( notiXX_tbs == currenttbs ){
            currentiXX = '';
        }else{
            currentiXX = RegExp.$1;
        }
        currentiXX = currentiXX.replace(/%2C.+/, '');
        currentiXX = currentiXX.replace(/,.+/, '');

        var generateOption = function(v) {
            var i;
            var valuestr;
            for( i = 0 ; i < list.length ; i++ ){
                if( v == list[i] ){
                    valuestr = strlist[i];
                }
            }
            var newtbs;
            if( currenttbs == '' ){
                if( v == '' ){
                    newtbs = '';
                }else{
                    newtbs = 'tbs=' + v;
                }
            }else{
                if( currentiXX == '' ){
                    if( v == '' ){
                        newtbs = 'tbs=' + currenttbs;
                    }else{
                        newtbs = 'tbs=' + currenttbs + ',' + v;
                    }
                }else{
                    if( v == '' ){
                        newtbs = 'tbs=' + notiXX_tbs;
                    }else{
                        newtbs = 'tbs=' + notiXX_tbs + ',' + v;
                    }
                }
            }
            newtbs = newtbs.replace( /tbs=,/ , 'tbs=');
            return '<option value="' + newtbs
                + ((v == currentiXX)? '" selected="1"' : '"') + '>' + valuestr + '</option>';
        };
        var opts = list.map(generateOption).join("\n");

        return '<select class="D7EDBF8C40" style="width:110px" size="' + list.length + '" name="' + argstr + '2" >' + opts + '</select>';

    }

    function get_form_imagesearch( type ){
		var str = "" , bstr;
		if( type == 1 ){
			bstr = "<br><br>";
		}else{
			bstr = "<br>";
		}

		str = "<div style=\"position:fixed;margin-left:0px; margin-top:60px; display\"><form>" +
				get_form_iXX( /(isz%3A[^&^,]+)[&]?/ , 'isz' , ['', 'isz%3Al','isz%3Am','isz%3Ai'],['すべてのサイズ','大','中','アイコンサイズ']) +
				bstr +
				get_form_iXX(/(ic%3A[^&^,]+)[&]?/ , 'ic' , ['', 'ic%3Acolor','ic%3Agray','ic%3Atrans'],['すべての色','フルカラー','白黒','透明']) +
				bstr +
				get_form_iXX(/(itp%3A[^&^,]+)[&]?/ , 'itp' , ['', 'itp%3Aclipart','itp%3Alineart','itp%3Aanimated'],['すべての種類','クリップアート','線画','GIF']) +
				bstr +
				get_form_iXX(/(qdr%3A[^&^,]+)[&]?/ , 'qdr' , ['', 'qdr%3Ad','qdr%3Aw','qdr%3Am','qdr%3Ay',],['期間指定なし','24 時間以内','1 週間以内','1 か月以内','1 年以内']) +
				bstr +
				get_form_iXX(/(il%3A[^&^,]+)[&]?/ , 'qdr' , ['','il%3Acl','il%3Aol' ],['すべて','クリエイティブ・コモンズ ライセンス','商用およびその他のライセンス']) +
            "</form></div>";
		return str;
    }


    var e;
    var style;

    var targetElement , newDiv , parentDiv;



	if( document.URL.indexOf("tbm=isch") > 0 || document.URL.indexOf("udm=2") > 0 ){

        trustedTypes.createPolicy('default', {
            createHTML: (unsafeValue) => {
                return unsafeValue;
            }
        });

        e = document.getElementById('rso');
        e.style.marginLeft = "150px";

        newDiv = document.createElement("div");
        newDiv.style.position = "fixed";
        newDiv.style.left = "30px";
        newDiv.style.top = "200px";
        newDiv.style.zIndex = 90000;
        newDiv.innerHTML = get_form_imagesearch(1);
        e.appendChild(newDiv);

        style = document.createElement("style");
        style.setAttribute( "type" , "text/css" );
        style.appendChild( document.createTextNode("") );
        document.getElementsByTagName("head")[0].appendChild(style);
        style.sheet.insertRule(".islrc {padding-left:160px !important; width:90% !important;}" , style.sheet.cssRules.length );


        e = document.getElementsByClassName('D7EDBF8C40');
        for( var i = 0; i < e.length ; i++ ){
            e[i].addEventListener('click', function() {
                var baseurl = document.location.href.replace(/&+tbs=([^&]+|)(&+|$)/, '&');
                var url = baseurl.replace(/https*:\/\/www.google.co.jp\/search\?/, 'search?');
                url = url + '&' + this.options[ this.selectedIndex ].value;
                url = url.replace( /,,/ , ',' );
                url = url.replace( /,$/ , '' );
                location.href = url;
            });
        }
        return;
    }



    if( document.URL.indexOf("tbm=") == -1 ){

        targetElement = document.getElementById('center_col');
        newDiv = document.createElement("div");
        newDiv.id = "fix_menu";
        newDiv.style.position = "fixed";
        newDiv.style.left = "30px";
        newDiv.style.top = "160px";
        newDiv.style.zIndex = 90000;
        newDiv.innerHTML = "<form>" + get_form_lr() + "<br><br>" + get_form_qdr() + "</form>";
        parentDiv =targetElement.parentNode;
        parentDiv.insertBefore(newDiv, targetElement );

        const style = document.createElement("style");
        style.textContent = `
@media (max-width: 1300px) {
  #center_col {
    left: 120px !important;
  }
}
`;
        document.head.appendChild(style);


        //document.getElementById('rcnt').style.paddingLeft = (newDiv.clientWidth-120).toString(10) + "px";

        var entryElement;
        entryElement = document.getElementById('get_form_qdr');
        entryElement.addEventListener('change', function() {
            var baseurl = document.location.href.replace(/&+tbs=([^&]+|)(&+|$)/, '&');
            var url = baseurl.replace(/https*:\/\/www\.google\.co\.jp\/search\?/, 'search?');

            if (url.includes("#ip=")) {
                url = url.replace("#ip=", '&' + this.options[ this.selectedIndex ].value + "#ip=");
            }else{
                url = url + '&' + this.options[ this.selectedIndex ].value;
            }

            location.href = url;
            url = url.replace( /,,/ , ',' );
            url = url.replace( /,$/ , '' );
        });
        entryElement = document.getElementById('get_form_lr');
        entryElement.addEventListener('change', function() {
            var baseurl = document.location.href.replace(/&+lr=([^&]+|)(&+|$)/, '&');
            baseurl = baseurl.replace( /\?lr=.+?&/ , '?' );
            var url = baseurl.replace(/https*:\/\/www\.google\.co\.jp\/search\?/, 'search?');
            if (url.includes("#ip=")) {
                url = url.replace("#ip=", '&lr=' + this.options[ this.selectedIndex ].value + "#ip=");
            }else{
                url = url + '&lr=' + this.options[ this.selectedIndex ].value;
            }

            location.href = url;
        });
    }


})();




