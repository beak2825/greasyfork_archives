// ==UserScript==
// @name        Kidoku for Reddit
// @namespace   kidoku-for-reddit
// @include     http://www.reddit.com*
// @include     https://www.reddit.com*
// @description redditに既読つけます。http://redd.it/2yrx0l
// @version     0.505.5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8638/Kidoku%20for%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/8638/Kidoku%20for%20Reddit.meta.js
// ==/UserScript==

var url = location.href;
if( url.indexOf("http://www.reddit.com/tb/") != -1)return;
if( url.indexOf("http://www.reddit.com/toolbar/") != -1)return;
if( url.indexOf("https://www.reddit.com/live/") != -1)return;


//プロトコルが別だとストレージも別になってしまうので移動
if( url.indexOf("http://") === 0){
    location.href = "https://" + url.substring(7);
    return;
}

// 携帯版なら「読んだ」ボタンを埋め込んで終了
var timeForMobile = 0;
if( url.indexOf(".compact") != -1 ){
    if( document.body.getAttribute("class").indexOf("comments-page") == -1 )return; //　コメントページ以外でも終了

    timeForMobile = Math.floor(Date.now()/1000);
    var button = document.createElement("button");
    button.innerHTML = "読んだ";
    button.style.float = "right";
    button.addEventListener("click", function(){
        var sComment, c, count = 0;
        var temp = document.querySelectorAll(".title-button");
        var temp2 = document.querySelectorAll("span.title");
        if( temp[0] ){
            sComment = temp[0].innerHTML;
            count = sComment.match(/\d+/); // コメントがすべて表示されていない場合
        }
        else if( temp2[0] ){
            sComment = temp2[0].innerHTML;
            count = sComment.match(/\d+/); // コメントがすべて表示されている場合
            if(!count)count = 0;
        }
        else count = 0;
        count = parseInt(count);

        var json = {
            "count": count,
            "time": timeForMobile,
        };

        var key = "kidoku_" + document.querySelectorAll("link[rel=shorturl]")[0].getAttribute("href").split("/")[3];
        localStorage.setItem(key, JSON.stringify(json));
        // 保存
        button.style.display = "none";
    });
    document.querySelectorAll(".tabmenu")[0].appendChild( button );

    return;
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  
// URLからIDを取り出す
var getKey = function(arglink){
    var list = arglink.split("/");
    var key = "kidoku_" + list[6]; //　サブミID

    if(!list[6])return false;
    return key;
};

// NEW!をクリックすると次へジャンプ
var jumpNextNew = function(){
    var targ, i;
    var list = document.querySelectorAll(".kidoku_new");
    for(i = 0; i< list.length; i++){
        if(list[i] == this)break;
    }
    targ = list[i+1] || list[0];
    
    $('html, body').animate({
        scrollTop: $( targ ).offset().top - 200
    }, 200);
};

// コメント数を開くときlimitを指定して開くボタン
var popupLimit = {
    element: null,
    nowElement: null,
    setup:function(){
        var div = document.createElement("DIV");
        var button0 = document.createElement("BUTTON");
        div.setAttribute("style", "display:block;position:absolute;width:60px;");
        button0.setAttribute("style", "width:30px;height:15px;font-size:10px;padding:0px;");
        button1 = button0.cloneNode();
        button0.innerHTML = "50";
        button1.innerHTML = "500";
        div.appendChild( button0 );
        div.appendChild( button1 );
        this.element = div;
        
        // クリックで表示を消す
        document.body.addEventListener("click", function(){
            if( !popupLimit.nowElement )return;
            popupLimit.nowElement.style.display = "none";
        });
    },
    append: function( targetEl ){
        var url = targetEl.getAttribute("href");
        var bounds = targetEl.getBoundingClientRect();
        var l = Math.max( document.body.scrollLeft, document.documentElement.scrollLeft);
        var t = Math.max( document.body.scrollTop, document.documentElement.scrollTop);
        var x = bounds.left + l;
        var y = bounds.bottom + t;
        
        if(this.nowElement)document.body.removeChild( this.nowElement );
        var div = this.element.cloneNode(true);
        div.addEventListener("click", function(){
            targetEl.parentNode.style.textDecoration = "line-through";
        });
        document.body.appendChild( div );
        var buttons = div.querySelectorAll("button");
        
        if(url.indexOf("?") == -1)url += "?";
        buttons[0].addEventListener("click", function(){
            window.open( url + "&limit=50");
        });
        buttons[1].addEventListener("click", function(){
            window.open( url + "&limit=500");
        });
        div.style.left = x + "px";
        div.style.top = y + "px";
        this.nowElement = div;
        
    },
};

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++　
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++　ソート
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  リストページの既読sort
var submiList = [];  //  num, bKidoku, bSintyaku, node 既読スレのみ
var sortKidoku = {
    sorted: false,
    sort : function (){
        if(document.querySelectorAll(".thing.link, .thing.comment").length > submiList.length)listPageFunc(); // 全部取得できていなければ取得

        sortedListSintyaku = [];
        sortedList = [];
        sortedListMidoku = [];
        var container = submiList[submiList.length-1].node.parentNode;
        var navi = document.querySelectorAll(".nav-buttons")[0];

        if(this.sorted){
            submiList.sort(function(a,b){ return(a.num>b.num)? 1 : -1; });// 元の順に戻す
        }
        else{
            //　既読を上にソート
            for(var i = 0; i< submiList.length; i++){
                if(submiList[i].bKidoku){
                    if(submiList[i].bSintyaku) sortedListSintyaku.push(submiList[i]);
                    else sortedList.push(submiList[i]);
                }
                else sortedListMidoku.push(submiList[i]);

            }
            submiList = sortedListSintyaku.concat(sortedList, sortedListMidoku);
        }
        for(var i = 0; i< submiList.length; i++){
            container.appendChild(submiList[i].node);
        }
        if(navi)container.appendChild(navi);


        this.sorted = !this.sorted;
        var sepalist = document.querySelectorAll(".NERPageMarker");
        if(sepalist){
            for(var i = 0; i < sepalist.length; i++){
                sepalist[i].style.display = "none";
            }
        }
    }
};
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  コメントページの新着2ソート
var commentPage = {
    "commentArea":null,
    "pjson":null,
    "comments":[],        // obj, time, num, nest, nestTime
    "sorted":false,
    "sorter":function(){
        var box = this.commentArea.querySelectorAll(".sitetable")[0];
        if(box.lastChild.getAttribute("class") == "clearleft")box.removeChild(box.lastChild);
        var last = box.lastChild;

        if(!this.sorted){
            //新着2
            this.comments.sort(function(a,b){
                var x = a.nestTime || a.time;
                var y = b.nestTime || b.time;
                if( x > y ) return -1;
                else return 1 ;
            });
        }
        else{
            this.comments.sort(function(a,b){return(a.num>b.num)?1:-1;});
        }

        for(var i = 0; i < this.comments.length; i++){
            if(this.comments[i].nest)continue;
            box.appendChild(this.comments[i].obj);
        }

        if(last.getAttribute("class").indexOf("morechildren") != -1)box.appendChild(last);
        this.sorted = !this.sorted;
    }
};
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 長さが変わるかチェック。never ending reddit用。
var neverEnding = {
    pSubmiListLength: 0,
    waiting: false,
    checkTime: Date.now(),
    check: function(){
        // マウスが動くと一秒に一回チェック
        if(!this.waiting){
            this.checkTime = Date.now() + 1000;
            this.waiting = true;
        }
        else if(Date.now() > this.checkTime){
            if(!commentPage.commentArea){
                if(document.querySelectorAll(".thing.link, .thing.comment").length > submiList.length)listPageFunc();
            }
            else if(document.querySelectorAll(".thing.comment").length > commentPage.comments.length){
                commentFunc();
            }

            this.waiting = false;
        }
    },
};

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 読み込み時、エンドレスRESで表示数が伸びる度に使う関数
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ コメントページにいろいろ追加してソート用に保存
var commentFunc = function(){

    // 新着コメントを確認するため時間を確認
    var commentElList = document.querySelectorAll(".thing.comment");
    var newMark = function(){
        if(timeEl.parentNode.lastChild.getAttribute("class") == "kidoku_new")return;
        var newEl = document.createElement("span");
        newEl.innerHTML = "NEW!";
        newEl.setAttribute("class", "kidoku_new");
        newEl.setAttribute("style", "color:red; text-decoration:underline; cursor:pointer");
        newEl.addEventListener("click",jumpNextNew );
        timeEl.parentNode.appendChild(newEl);
    };

    commentPage.comments = [];
    for(var i = commentPage.comments.length; i < commentElList.length; i++){
        var timeEl = commentElList[i].querySelectorAll("time")[0];
        var time = Date.parse(timeEl.getAttribute("datetime"))/1000;

        //入れ子の中ならtrue
        var nest = false;
        if(commentElList[i].parentNode.getAttribute("class") == "sitetable listing")nest = true;

        //一番外なら一番早い時間を取得
        var nestTime = false;
        if(!nest){
            var nestTimeElList = commentElList[i].querySelectorAll("time");
            if(nestTimeElList.length != 1){
                var array = [];
                for(var j = 0; j< nestTimeElList.length; j++){
                    array.push( Date.parse(nestTimeElList[j].getAttribute("datetime")) );
                }
                nestTime = array.sort().reverse()[0]/1000;
            }
        }

        commentPage.comments.push({"obj":commentElList[i], "time":time, "num": i, "nest":nest, "nestTime":nestTime });

        if(commentPage.pjson){
            var jsonobj = JSON.parse(commentPage.pjson);
            if(jsonobj.time < time)newMark();// 印をつける
        }
        else newMark();
    }
};

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ リストページにいろいろ追加してソート用に保存
var listPageFunc = function(){
    popupLimit.setup();
    var temp = document.querySelectorAll(".first");
    var linklist = [];
    for(var i = 0; i< temp.length; i++){
        var el = temp[i].querySelectorAll(".may-blank")[0];
        if(el)linklist.push( el );
    }

    var submiNodeList = document.querySelectorAll(".thing.link, .thing.comment");//既読ソート用

    for(var i = neverEnding.pSubmiListLength; i< linklist.length ; i++ ){
        //既読コメント数をストレージから取得
        var value = null;
        var key = getKey(linklist[i].getAttribute("href"));
        var json = localStorage.getItem(key);
        if(json){
            var obj = JSON.parse(json);
            value =obj.count;
        }

        //ソート用
        var subm ={
            num:i,
            node:submiNodeList[i],
            bKidoku:false,
            bSintyaku:false
        };
        submiList.push(subm);

        // 現在のコメント数と比べて増えていれば赤線を引く
        if(value !== null){
            subm.bKidoku = true;
            var element = document.createElement('span');
            element.innerHTML = "既読" + value + "/" ;
            linklist[i].parentNode.insertBefore(element, linklist[i]);

            linklist[i].parentNode.style.borderBottom = "1px solid gray";
            var nowValue = linklist[i].innerHTML.match(/\d+/);

            value = parseInt(value);
            nowValue = parseInt(nowValue);
            if( !nowValue ); 
            else if(nowValue <= value);
            else{
                subm.bSintyaku = true;
                linklist[i].parentNode.style.borderBottom = "1px solid red";
            }
        }

        linklist[i].setAttribute("target", "_blank");　// key にすればターゲット固定

        // ベストで開いたりnewで開いたり
        var addLink = function( txt, type ){
            var link = linklist[i].cloneNode();
            link.innerHTML = txt;
            link.setAttribute("href", link.getAttribute("href") + type );
            linklist[i].parentNode.appendChild( link );
            link.addEventListener( "mouseover", function( event ){
                popupLimit.append( event.target );
            });
        };
        addLink("　best", "?sort=confidence" );
        addLink("　new", "?sort=new" );
        addLink("　小", ".compact?sort=new" );

        // 削除したり
        if( subm.bKidoku ){
            var delf = (function() {
                var key2 = key;
                return function(){
                    localStorage.removeItem(key2);
                };
            })();
            var delkey = document.createElement("button");
            delkey.innerHTML = "del";
            delkey.setAttribute("style", "margin:0px 0px 0px 10px; padding:0px;max-height:15px; vertical-align:bottom; font-size:12px; line-height:100%;");
            delkey.addEventListener("click", delf);
            linklist[i].parentNode.appendChild(delkey);
        }

        // クリックイベントで雑に打ち消し線をつける
        var f = (function() {
            var ii = i;
            return function(){
                linklist[ii].parentNode.style.textDecoration = "line-through";
            };
        })();
        linklist[i].parentNode.addEventListener("click",f);
    }

    neverEnding.pSubmiListLength = submiList.length;
};

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 以下読み込み時に一度
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 
var bSearchPage = false, bCommentsPage = false;
var pageTypeCss = document.body.getAttribute("class");
if( pageTypeCss ){
    if( pageTypeCss.indexOf("search-page") != -1 )bSearchPage = true;
    if( pageTypeCss.indexOf("comments-page") != -1 )bCommentsPage = true;
    //if(document.body.getAttribute("class").indexOf("related-page") != -1)return;
}
if( bCommentsPage ){
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ コメントページの場合
    commentPage.commentArea = document.querySelectorAll(".commentarea")[0];

    var key = getKey(url);
    commentPage.pjson = localStorage.getItem(key);
    document.body.addEventListener("mousemove", neverEnding.check);

    commentFunc();

    // 既読コメント数と時間をストレージに保存
    var setStorage = function (postComment){
        if(key){
            var sComment = document.querySelectorAll(".comments.may-blank")[0].innerHTML;

            var count = sComment.match(/\d+/);
            if(count === null)count = 0;
            count = parseInt( count );

            var json = {
                "count": count,
                "time": Math.floor(Date.now()/1000),
            };
            localStorage.setItem(key, JSON.stringify(json));
        }
    };
    setStorage(false);


    //　新着ソートボタン
    var newElem = document.createElement("button");
    newElem.setAttribute("style", "margin:10px 5px 0px 0px; padding:0px; width: 60px;vertical-align:bottom; font-size:11px; line-height:100%;");
    newElem.innerHTML = "新着2";
    newElem.addEventListener("click", function(){
        commentPage.sorter();
        if(this.innerHTML == "新着2")this.innerHTML = "戻す";
        else this.innerHTML = "新着2";
    });
    var drop = document.querySelectorAll(".dropdown-title.lightdrop")[0];
    drop.parentNode.appendChild(newElem);


    // ニューにジャンプ
    if(document.querySelectorAll(".kidoku_new")[0]){
        var newEl = document.createElement("span");
        newEl.innerHTML = "NEW!へジャンプ";
        newEl.setAttribute("style", "color:red; text-decoration:underline; cursor:pointer; font-size:11px");
        newEl.addEventListener("click",jumpNextNew );
        drop.parentNode.appendChild(newEl);
    }

}
else if( document.querySelectorAll(".first")[1] ){
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ リストページの場合

    listPageFunc();
    document.body.addEventListener("mousemove", neverEnding.check);
    

    function setTabButton( button ){
            if( !bSearchPage ){
                var tab1 = document.querySelectorAll(".tabmenu > li")[0];
                tab1.parentNode.insertBefore( button , tab1);
            }
            else document.querySelectorAll(".menuarea")[0].appendChild(button);
        }
    
    //　既読ソートボタン
    var newElem = document.createElement("button");
    newElem.setAttribute("style", "font-size:11px;line-height:100%;padding:0px;max-height:15px;min-width:65px; vertical-align:bottom;");

    newElem.innerHTML = "既読sort";

    newElem.addEventListener("click",function(){
        sortKidoku.sort();
        if(this.innerHTML == "既読sort")this.innerHTML = "戻す";
        else this.innerHTML = "既読sort";
    });
    
    setTabButton( newElem );
    
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 全ページ
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 右上 既読　最近開いたスレをリストで開く
var getRecentButton = document.createElement("span");
getRecentButton.innerHTML = "　既読";
getRecentButton.style.cursor = "pointer";
getRecentButton.addEventListener("mouseup", function(event){
    var array =[], idnames = "";
    for(var i = localStorage.length-1 ; i > 0; i--){
        var k = localStorage.key(i);
        if(k.indexOf("kidoku_") === 0){
            array.push( { time:JSON.parse(localStorage[k]).time, key:k.split("kidoku_")[1] } );
        }
    }
    array.sort(function(a,b){return (a.time < b.time)? 1: -1;});
    for(var i = 0; i < array.length; i++){
        idnames += "t3_" + array[i].key + ",";
        if (idnames.length > 5000)break; //　多すぎると拒否される？ので500スレ分くらいだけにする
    }

    if( event.button === 0 )location.href = "https://www.reddit.com/by_id/" + idnames;
    else if( event.button == 2 )setTimeout(function(){alert( array.length + "記憶中" );},1);
    else if( event.button == 1 || true )window.open( "https://www.reddit.com/by_id/" + idnames );
    event.preventDefault();

});
var topbar = document.querySelector("#header-bottom-right");
//if( !topbar )topbar = document.body;
if( topbar )topbar.appendChild( getRecentButton );

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 下部　削除ボタン
var s = document.querySelectorAll(".bottommenu")[0];
if(s){
    var newElem = document.createElement("button");
    newElem.innerHTML = "削除";
    newElem.style.margin = "10px 0px";
    var inputEl = document.createElement("input");
    inputEl.setAttribute("type", "number");
    inputEl.setAttribute("id", "kidoku_delete_day");
    inputEl.setAttribute("style", "text-align:right;width:40px;");
    inputEl.setAttribute("value", "0");

    s.parentNode.appendChild(inputEl);
    s.parentNode.appendChild(document.createTextNode("日以上前の既読履歴を"));
    s.parentNode.appendChild(newElem);

    newElem.addEventListener("click", function(){
        var day = document.querySelector("#kidoku_delete_day").value;
        var pDay = Math.floor( ( Date.now() - (day * 24 * 60 * 60 * 1000) ) / 1000);

        var delCount = 0;
        var count = 0;
        if(window.confirm( "既読データを消します" )){
            for(var i = localStorage.length-1 ; i > 0; i--){
                var k = localStorage.key(i);
                if(k.indexOf("kidoku_") === 0){
                    count++;
                    if(JSON.parse(localStorage[k]).time < pDay){
                        delCount++;
                        localStorage.removeItem(k);
                    }
                }
            }
            alert(delCount + "/" + count + "削除しました");
        }
    });
}

