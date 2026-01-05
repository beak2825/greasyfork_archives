// ==UserScript==
// @name       Navigate_streamallthis.is
// @namespace  http://use.i.E.your.homepage/
// @version    0.1.4
// @description  A little script to navigate trough series at the streaming host <a href="http://streamallthis.is">streamallthis.is</a>
// @match      http://streamallthis.is/watch/*/s*
// @require    http://code.jquery.com/jquery-1.11.2.min.js
// @copyright  2012+, greenhalos
// @downloadURL https://update.greasyfork.org/scripts/5675/Navigate_streamallthisis.user.js
// @updateURL https://update.greasyfork.org/scripts/5675/Navigate_streamallthisis.meta.js
// ==/UserScript==

$(document).ready(function(){
    var url = window.location.pathname;
    var filename = url.substring(url.lastIndexOf('/')+1);
    filename = filename.replace(".html","");
    filename = filename.replace("s","");
    var series = filename.substr(0,filename.indexOf('e'));
    var episode = filename.substr(filename.indexOf('e') + 1); 
    if(document.title == '404 Not Found'){
        changeSerie();
    } else {
        
        var p = document.createElement("P");
        p.align = "center";
        
        
        var prev=document.createElement("input");
        prev.type="button";
        prev.value="<<= PREV";
        prev.onclick = function(){changeEpisode(false)};
        p.appendChild(prev);
        
        var next=document.createElement("input");
        next.type="button";
        
        next.value="NEXT =>>";
        next.id = "next";
        p.appendChild(next);
        
        $(".fa").append(p);
        $('#next').hide();
        
        $.ajax({
            url: genLink(series, parseInt(episode)+1)
        }).done(function(){
         	$("#next").show();
            $("#next").click(function(){changeEpisode(true)});
        }).fail(function(){
            console.log('checking next serie?')
            $.ajax({
                url: genLink(addMissingZero(parseInt(series)+1), 1 )
            }).done(function() {
            	$("#next").show();
            	$("#next").click(function(){changeSerie()});
            });
        });
    }
    
    function changeSerie(){
        var next = episode > 1;
        if (next){
            series++;
            episode = 1;
            window.location.assign(genLink(addMissingZero(series),episode));
        } else {
            series --;
            //TODO
        }
    }
    
    function genLink(genSer, genEpi){
        genEpi = addMissingZero(genEpi);
    	return url.substring(0,url.lastIndexOf('/') + 1) + 's' + genSer + 'e' + genEpi + '.html';
    }
    
    
    function changeEpisode(next) {
		next ? episode++ : episode--;
        window.location.assign(genLink(series,episode));
        
    }
    
    function addMissingZero(number) {
        return (parseInt(number) < 10  ? "0" + number : number);
    }
});
