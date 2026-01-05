// ==UserScript==
// @name         Xchan Gold Alpha
// @version      0.0.1.0
// @description  Experimental script to enhance xchan.pw
// @include      https://xchan.pw/*
// @include      http://xchan.pw/*
// @require 	 https://cdn.jsdelivr.net/jquery.timeago/1.4.1/jquery.timeago.js
// @namespace https://greasyfork.org/users/2657
// @downloadURL https://update.greasyfork.org/scripts/7221/Xchan%20Gold%20Alpha.user.js
// @updateURL https://update.greasyfork.org/scripts/7221/Xchan%20Gold%20Alpha.meta.js
// ==/UserScript==

//////////////////////////////////////////


$("<style>").text("iframe{display:inline-block;} .canfly{position:fixed;left:-600px;}.contentview {position:fixed;top:10px;left:-2048px;} iframe{display:inline-block;} .previewbox{position:fixed;bottom:10px;left:-150px;} .mbutton:hover{color:orange;width:100%;} .mbutton, .tbutton{cursor:pointer;cursor:hand;transition: color 0.5s ease;transition: width 0.5s ease;background: black;margin: 2px;padding: 2px;color: grey;font-size: 15px;font-weight: bold;    display: inline-block;    width: 90%;    font-family: monospace;} .tbutton{color:gold;font-size: 17px;width:100%;} .woptions{width:65px;height:63px;position:fixed;top:10px;right:30px;cursor:pointer;cursor:hand;transition: background-image 0.5s ease;} .selm{color:white;width:100%;} .wmenu{position:fixed;width:250px;height:900px;top:-900px;right:100px;background:grey;}").appendTo("head");

//Menu and Options System
//Images
var wrenchhover = 'data:image/png;base64,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';
var wrench = 'data:image/png;base64,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';

var button = $('<div class="woptions"></div>').css("background-image", "url("+wrench+")");
$('body').append(button);

$(document).on('mouseenter', ".woptions", function () {
    $(this).css("background-image", "url("+wrenchhover+")");
});

$(document).on('mouseleave', ".woptions", function () {
    $(this).css("background-image", "url("+wrench+")");
});

//Menu
var menu = $('<div class="wmenu"><div class="tbutton">XGold:</div><br><br></div>');
var menuoptions = ['Catálogo', 'Backlinks', 'Formatador de Texto','Pré-exibir Imagens', 'Detector de Batatas','Trip Checkbox', 'Tempo Relativo', 'Exibir 50 posts', 'Fundir /e/', 'Mostrar títulos de Youtube', 'Meta Hovers'];

for (i = 0; i < menuoptions.length; i++) {
    $(menu).append('<div class="mbutton" id="m'+i+'">'+menuoptions[i]+'</div><br>');
}

$('body').append(menu);

$(document).on('click', ".woptions", function () {
    if ($(this).hasClass('wopen')){
        $('.wmenu').animate({top: "-900px", }, 1000 );
        $(this).removeClass('wopen');
    } else {
        $('.wmenu').animate({top: "0px", }, 1000 );
        $(this).addClass('wopen');
    }
});

$(document).on('click', ".mbutton", function () {
    if ($(this).hasClass('selm')){
        $(this).removeClass('selm');
        if (fun[$(this).attr('id')]){
            fun[$(this).attr('id')]('r');
        };
    }else{
        $(this).addClass('selm');
        if (fun[$(this).attr('id')]){
            fun[$(this).attr('id')]();
        };
    }

    saveoptions();
});

//OptionLoader
var activeoptions = "none,m1,m2,m3,m4,m5,m6,m9"; //Default Options

if (localStorage.getItem("xgoptions")) { activeoptions = localStorage.getItem("xgoptions");}
activeoptions = activeoptions.split(',');
for (n = 0; n < activeoptions.length; n++) {
    $('#'+activeoptions[n]+'').addClass('selm');
}

//OptionSaver
function saveoptions(){
    var ids = ["none"];
    $('.selm').each(function(){ids.push($(this).attr('id'))});
    localStorage.setItem("xgoptions", ids.toString())
}
saveoptions();

//Functions

//floatcontent
function float(){
    $('.thumb').each(function(){
        url = $(this).parent().parent().attr('href');
        $(this).parent().unwrap().wrap('<div class="nthumb" href="'+url+'" style="cursor: pointer; cursor: hand;"></div>');
    });
    $('.filesize').find('a').attr('onclick', '').attr('target', '_blank');
}



$(document).on('click', ".nthumb", function () {
    if ($(this).attr('href').indexOf('.webm') >= 1){
        var content = $('<div class="contentview"></div>')    
        $(content).css('left', '-2000px').html('').append('<div class="fimg" style="cursor: pointer; cursor: hand;color:grey;background-color:black;font-weight:bold;font-family: monospace;    font-size: 15px;    display: inline-block;    float: right;">[Fechar]</div><br><video src="'+$(this).attr('href')+'" loop controls style="min-width:50px;min-heigth:50px;max-width:99%;max-height:99vh;">').animate({left: "10px", }, 1000 );
        $('body').append(content);
    } else{
        var content = $('<div class="contentview"></div>')    
        $(content).css('left', '-2000px').html('').append('<img class="fimg" src="'+$(this).attr('href')+'" style="min-width:50px;min-heigth:50px;max-width:99%;max-height:99vh;background-color: rgba(196, 196, 196, 0.5);">').animate({left: "10px", }, 1000 );
        $('body').append(content);
    };
$('.contentview').draggable();
});

$(document).on('click', ".fimg", function () {
    //$(this).parent().animate({left: "-2000px", }, 1000 );
    //setTimeout("$(this).parent().remove()", 1000)
    $(this).parent().remove();
});

//TimeAgo

function reltime(r) {
    if (r){
        $('.time').remove();
    } else {
        $('.time').remove();
        $( "label:contains('@')" ).each(function() {
            var vovar = $(this).contents().map(function() {
                if( this.nodeType === 3 ) {
                    return this.data;
                }
            }).get().join('');

            vovar1 = vovar.split("@");
            vovardate = vovar1[0].split("/");
            vovaryear = vovardate[2].split(" ");
            vovarmonth = vovardate[1] - 1;
            vovartime = vovar1[1].split(":");
            tiem = new Date(vovaryear[0], vovarmonth, vovardate[0], vovartime[0], vovartime[1])
            tiemiso = tiem.toISOString();
            tiemago = jQuery.timeago(tiemiso); 

            $( this ).append( '<span class="time">( <bold>' + tiemago + ' </bold>)</span>' );
        });    
    };
};



//Detector de Batatas


function batata(r){ 
    if (r){
        $('.reply').css('background-image', '');
    } else {
        $('.postername:contains("Semi"), .postername:contains("Se‭‭mi")').parent().parent().css('background-image', 'url(\"http://a.pomf.se/rcqfit.png\")');
        $('.postertrip:contains("hKvr")').parent().parent().css('background-image', 'url(\"http://a.pomf.se/ndnvht.png\")');
        $('blockquote:contains("…"), blockquote:contains("daí"), blockquote:contains("Coë")' ).parent().css('background-image', 'url(\"http://a.pomf.se/aopqpg.jpg\")');
    };
}; 

//Catalogo
$("<style>").text(".catalogimg > img {max-width:100%;max-height:100%;} .catalogitem {margin-bottom:10px;}").appendTo("head");

function catalog(r){
    if (r){
        $('.catalog').remove();
    } else {
        $('.catalog').remove();
        $('body').prepend('<div class="catalog" style="background: dimgray;border: solid 1px;overflow-y:scroll;overflow-x:hidden;width:240px;height:650px;position:fixed;top:100px;left:-300px;"><table id="catalogt"><tbody><div class="closecat hov" style="font-size: 15px;font-weight: bold;position:fixed;top:80px;left:10px;color:red;font-size:11px;cursor: pointer; cursor: hand;">Abrindo catálogo...</div></tbody></table></div>');
        $.get("https://xchan.pw/b/catalog.html", function (data) {
            $(data).find('a[class^="ref|"]').each(function () {
                var href = $(this).attr('href');
                var c = $(this).attr("class").split('|'); 
                var d = $("<span></span>").addClass('catalogimg').attr({
                    style : "max-width:220px;background:#F7F7F7;"
                });
                var g = $("<div></div>").addClass('catalogtext').attr({
                    style : "overflow-x:hidden;overflow-y:scroll;max-height:200px;max-width:220px;background:#F7F7F7;"
                });
                $.get(ku_boardspath + '/read.php?b=' + c[1] + '&t=' + c[2] + '&p=' + c[3] + '&single', {}, function (a, b) {
                    if (b != "success") {
                        alert('wut')
                    } else {

                        if (a) {
                            var z = $('<img />').html(a).find('.thumb').removeClass();
                            var y = $('<blockquote>').html(a).find('blockquote');                        

                            d.html(z);
                            g.html(y);
                            $('.catalog').animate({left: "5px", }, 1000 );
                            $('.closecat').remove();

                        } else {
                            d.html(_("something went wrong (blank response)"))
                        }
                    }
                })       




                var wrap = $("<div></div>").addClass('catalogitem').append(d).wrapInner('<a href='+ href +'>').append(g);
                $('#catalogt').append(wrap);
            });

        });
    };
};



//Text Formatting
jQuery.fn.extend({
    insertAtCaret: function(myValue, myValueE){
        return this.each(function(i) {
            if (document.selection) {
                //For browsers like Internet Explorer
                this.focus();
                sel = document.selection.createRange();
                sel.text = myValue + myValueE;
                this.focus();
            }
            else if (this.selectionStart || this.selectionStart == '0') {
                //For browsers like Firefox and Webkit based
                var startPos = this.selectionStart;
                var endPos = this.selectionEnd;
                var scrollTop = this.scrollTop;
                this.value = this.value.substring(0,     startPos)+myValue+this.value.substring(startPos,endPos)+myValueE+this.value.substring(endPos,this.value.length);
                this.focus();
                this.selectionStart = startPos + myValue.length;
                this.selectionEnd = ((startPos + myValue.length) + this.value.substring(startPos,endPos).length);
                this.scrollTop = scrollTop;
            } else {
                this.value += myValue;
                this.focus();
            }
        })
    }
});

function textformat(r){
    if (r){
        $('.stylebar, .sb').remove();
    } else {
        $('textarea[id="qr_message"]').after('<br class="stylebar">');
        $('.stylebar').after('<input class="formbutton_SS sb" type="button" value="Spoiler" /><input class="formbutton_B sb" type="button" value="B" /><input class="sb formbutton_R" type="button" value=">" /><input class="sb formbutton_S" type="button" value="S" /><input class="sb formbutton_I" type="button" value="I" /><input class="sb formbutton_C" type="button" value="Code" />');
        $('.formbutton_I').css('font-style', 'italic');
        $('.formbutton_S').css('text-decoration', 'line-through');
        $('.formbutton_R').css('color', 'green');
        $('.formbutton_B').css('font-weight', 'bold');
        $('.formbutton_SS').css('font-weight', 'bold');
    };


    $('.formbutton_C').on('click', function(){ 
        $('textarea[id="qr_message"]').insertAtCaret("[code]", "[/code]");
    });
    $('.formbutton_I').on('click', function(){ 
        $('textarea[id="qr_message"]').insertAtCaret("[i]", "[/i]");
    });
    $('.formbutton_S').on('click', function(){ 
        $('textarea[id="qr_message"]').insertAtCaret("[s]", "[/s]");
    });
    $('.formbutton_R').on('click', function(){ 
        $('textarea[id="qr_message"]').insertAtCaret(">", "");
    });
    $('.formbutton_B').on('click', function(){ 
        $('textarea[id="qr_message"]').insertAtCaret("[b]", "[/b]");
    });

    $('.formbutton_SS').on('click', function(){ 
        $('textarea[id="qr_message"]').insertAtCaret("[spoiler]", "[/spoiler]");
    });
};

//Tripbox
function tripbox(r){
    if (r){
        $( '#qr_name, input[name="name"]:first' ).unwrap();
        $('.new, .qrnew, .namecheck').remove();
        //$('#qr_name, input[name="name"]').get(0).type = 'text';

    }else{


        $( 'input[name="name"]:first' ).wrap( '<span class="new"></span>' );
        $( '#qr_name' ).wrap( '<span class="qr_new"></span>' );
        $( '.new' ).append( '<input type="checkbox" class="namecheck" value="Bike" checked="checked">' );
        if (localStorage.getItem("namecheck") === null) {}else{$( ".namecheck" ).prop( "checked", false ); $( 'input[name="name"], #qr_name' ).prop('disabled',true);};

        $(document).on('change', ".namecheck", function() {
            if ( $( '.namecheck' ).prop( "checked" ) ) {$( 'input[name="name"], #qr_name' ).prop('disabled',false); localStorage.removeItem('namecheck');}else{$( 'input[name="name"], #qr_name' ).prop('disabled',true); localStorage.setItem('namecheck', '');};
        });
    };
};

//Backlinks

function showpreview(r){
    if (r){
        $('.previewbox').remove();
    } else {
        $('.previewbox').remove();
        $('body').append('<div class="previewbox"></div>');
    };
};

$('input[name="imagefile"]').change(function () {
    if ($('#m3').hasClass('selm')){
        $('.previewbox').css('left', '-150px');
        $('.previewbox').animate({left: "50px", }, 1000 );
        if (window.FileReader) {
            var Reader = new FileReader();
            var file = this.files[0];
            window.file2 = file;
            var previewarea = $('.previewbox');

            if (file.type.indexOf("video") > -1) { 

                previewarea.html('');                
                Reader.onload = function (event) {
                    previewarea.append([' <video width="200" height="200" autoplay muted controls loop><source src="'+ event.target.result +'" type="'+ window.file2.type +'">Your browser does not support the video tag.</video>'].join(''));
                }
                Reader.readAsDataURL(file);    

            } else {

                previewarea.html('');
                Reader.onload = function (event) {
                    previewarea.show().append(['<img style="max-height:200px;max-width:200px;" src="' + event.target.result + '" alt="">'].join(''));
                }
                Reader.readAsDataURL(file);
            };
        }

    };

});

function backlinks(r) {
    if (r){
        $('.protect').removeClass('protect');
        $('a[rem="1"]').remove();
    }else{
        $('#delform').find(".reply").not('.protect').each(function() {
            blink($(this));
        });
        $('.floater, .hold').find(".reply").not('.protect').each(function() {
            blink($(this));
        });
    };
};

function blink(t){   
    t.addClass('protect');
    rid = t.attr('id').replace('reply','');
    datas = t.find('.reflink').find("a:nth-child(2)").attr('href');
    t.find("a[class^='ref|']").each(function() {
        var quoted = $(this).text();            
        quoteds = quoted.replace('>>','');
        backquote(quoteds, rid, datas);
    });   
};

function backquote(quoteds, rid, datas){    
    splicer = datas.replace('.html#i','/');    
    splicer2 = splicer.split('/');
    $(".reflink:contains('" +quoteds+ "')").after('<a rem="1" href="/'+splicer2[1]+'/res/'+splicer2[3]+'.html#'+rid+'" onclick="return highlight(\''+rid+'\', true);" class="ref|'+splicer2[1]+'|'+splicer2[3]+'|'+rid+'">&gt;&gt;'+rid+'</a>');

};

// Youtube Title Loader

$(document).on('mouseenter', 'a[href*="youtube.com/watch?"], a[href*="youtu.be"]', function() {
    if ($('#m9').hasClass('selm')){
        url = extractVideoID($(this).attr('href'));
        $(this).replaceWith('<iframe src="https://www.youtube.com/v/'+url+'" width="300px" height="25px" ></iframe><div class="mask" style="display:inline-block;">OPEN </div>');
    };
});


function extractVideoID(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    if ( match && match[7].length == 11 ){
        return match[7];
    }else{
        return url;
    }
}

$(document).on('click', ".mask", function() {
    $('<br><div class="vp canfly" style="cursor: pointer; cursor: hand;display:inline-block;background:grey;height:500px;"></div>').appendTo('.logo');
    $(this).prev().clone().attr('height', '480x').attr('width', '600px').appendTo('.vp');
    $('.vp').prepend('<div class="killvid" style="background:orange;display:inline;">[Fechar]</div><br>');
    jQuery('html,body').animate({scrollTop:0},0);
    $('.vp').animate({left: "10px", }, 1000 ).draggable();

}); 

$(document).on('click', ".killvid", function() {
    $(this).parent().remove();
    $(this).remove();
}); 



//Save functions in Array
var fun = {
    m1:backlinks,
    m5:tripbox,
    m3:showpreview,
    m2:textformat,
    m0:catalog,
    m4:batata,
    m6:reltime,
}

function start(){
    $('.selm').each(function(){
        if (fun[$(this).attr('id')]){
            fun[$(this).attr('id')]();
        };
    });
    float();
};
start();

var funloop = {
    m1:backlinks,
    m4:batata,
    m6:reltime
};

//Run All Active Options
function loop(){
    $('.selm').each(function(){
        if (funloop[$(this).attr('id')]){
            funloop[$(this).attr('id')]();
        };
    });
    float();
};
//loop();
//Default Stuff

//Protect Trip
$('input[name="name"]').get(0).type = 'password';

$( 'input[name="name"]' ).focus(function() {
    $('#qr_name, input[name="name"]').get(0).type = 'text';
});

$( 'input[name="name"]' ).focusout(function() {
    $('#qr_name, input[name="name"]').get(0).type = 'password';
});


//Live Index

//live index

var window_focus;

$(window).focus(function() {
    window_focus = true;
    unnotify();
})
    .blur(function() {
    window_focus = false;
});


function unnotify(){
    $('link[href*="favicon"]').remove()
    $('#favicon').remove();
    $('head').append('<link href="https://i.imgur.com/AB4G76Z.png" id="favicon" rel="shortcut icon">');
};
unnotify();

function notify(){
    if (window_focus){}else{
        $('#favicon').remove();
        $('head').append('<link href="https://i.imgur.com/TirPmur.png" id="favicon" rel="shortcut icon">');
    };
};
//JavaReset

function loadjscssfile(filename, filetype){
    if (filetype=="js"){ //if filename is a external JavaScript file
        var fileref=document.createElement('script')
        fileref.setAttribute("type","text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype=="css"){ //if filename is an external CSS file
        var fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
        }

function javareset(){
    $('script[src*="xchan.js"], script[src*="kusaba.js"]').remove();
    loadjscssfile("https://xchan.pw/lib/javascript/kusaba.js", "js")
    loadjscssfile("https://xchan.pw/lib/javascript/xchan.js", "js")
    //$('head').append('<script type="text/javascript" src="https://xchan.pw/lib/javascript/kusaba.js"></script>');
    //$('head').append('<script type="text/javascript" src="https://xchan.pw/lib/javascript/xchan.js"></script>');
};



//Updater
var highest = -Infinity;
var compareme = 99999999999999999;
window.updateid = "";

function initupdate(){    
    var highest = -Infinity;
    $('#delform').find("input[name='post[]']").each(function() {
        splice = $(this).attr('value');
        numb = parseInt(splice)
        highest = Math.max(highest, parseFloat(numb));        
    });
    return highest;
};

initupdate();

function update(){
    var compareme = 0;    
    $.get("" + document.location, function (data) {        
        $(data).find("input[name='post[]']").each(function() {
            splice = $(this).attr('value');
            numb = parseInt(splice)

            compareme = Math.max(compareme, parseFloat(numb));
            window.updateid = compareme;
        });
    });
};



setInterval(function () { 
    update();
    if (window.updateid > initupdate()){
        $.get("" + document.location, function (data) {        
            $("#delform").replaceWith($(data).filter("#delform"));
        }).done(function() {
            if (! window_focus){notify();};
            loop();
            javareset()

        });
    };
    reltime();  
}, 10000);


