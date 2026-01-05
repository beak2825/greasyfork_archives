// ==UserScript==
// @name        Lichess Chess24 Pack
// @namespace   http://example.com
// @description chess24 style
// @include     http://*.lichess.org/*
// @version     3.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8554/Lichess%20Chess24%20Pack.user.js
// @updateURL https://update.greasyfork.org/scripts/8554/Lichess%20Chess24%20Pack.meta.js
// ==/UserScript==
 
 
 
 
 
 
 
 
 
 
 





function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}







addGlobalStyle('piece.knight.black { background-image: url("https://chess24.com/images/chess/themes/pieces/chess24/black/n.png")!important;} ');
addGlobalStyle('piece.bishop.black { background-image: url("https://chess24.com/images/chess/themes/pieces/chess24/black/b.png")!important;} ');
addGlobalStyle('piece.rook.black { background-image: url("https://chess24.com/images/chess/themes/pieces/chess24/black/r.png")!important;} ');
addGlobalStyle('piece.pawn.black { background-image: url("https://chess24.com/images/chess/themes/pieces/chess24/black/p.png")!important;} ');
addGlobalStyle('piece.king.black { background-image: url("https://chess24.com/images/chess/themes/pieces/chess24/black/k.png")!important;} ');
addGlobalStyle('piece.queen.black { background-image: url("https://chess24.com/images/chess/themes/pieces/chess24/black/q.png")!important;} ');
addGlobalStyle('piece.knight.white { background-image: url("https://chess24.com/images/chess/themes/pieces/chess24/white/n.png")!important;} ');
addGlobalStyle('piece.bishop.white { background-image: url("https://chess24.com/images/chess/themes/pieces/chess24/white/b.png")!important;} ');
addGlobalStyle('piece.rook.white { background-image: url("https://chess24.com/images/chess/themes/pieces/chess24/white/r.png")!important;} ');
addGlobalStyle('piece.pawn.white { background-image: url("https://chess24.com/images/chess/themes/pieces/chess24/white/p.png")!important;} ');
addGlobalStyle('piece.king.white { background-image: url("https://chess24.com/images/chess/themes/pieces/chess24/white/k.png")!important;} ');
addGlobalStyle('piece.queen.white { background-image: url("https://chess24.com/images/chess/themes/pieces/chess24/white/q.png")!important;} ');


//addGlobalStyle('.cg-board { background-image: url("http://images.chesscomfiles.com/chess-themes/boards/marble/80.png")!important;} ');

addGlobalStyle('.cg-board { background-image: url("http://s2.postimg.org/sjz4kstjd/wood640.png")!important;}');

addGlobalStyle('.cg-square.last-move { background-color:rgba(255, 255, 0, 0.41) !important;} ');




$('body').css("background", "url(http://s3.postimg.org/4xq6qmnrn/Background1752_1168.gif) ");




//$('body').css('background','#f4f4f4');

$('.cg-board').css({"border-color": "#824939", 
             "border-radius":"10px",
                 //   "border-with":"20px",
               "border-style":" solid"});

//$(document).ready(function(){
   // $('#favicon').remove();
   // $('head').append('<link href="http://www.flyordie.com/games/images/icon/chess.ico" rel="shortcut icon">');



//});


               
               
      