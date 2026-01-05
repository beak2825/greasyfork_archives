// ==UserScript==
// @name         Movieguy's emotes
// @namespace    Movie room
// @version      2.0.2
// @description  more maymays
// @grant        none
// @copyright    2015
// @include     *://*.instasynch.com/*
// @include     *://instasynch.com/*
// @include     *://*.instasync.com/*
// @include     *://instasync.com/*
// @downloadURL https://update.greasyfork.org/scripts/8441/Movieguy%27s%20emotes.user.js
// @updateURL https://update.greasyfork.org/scripts/8441/Movieguy%27s%20emotes.meta.js
// ==/UserScript==

var emotes = [
    { src:"http://i.imgur.com/pD9mmDF.jpg", width:80, height:45, title:'smug'},
    { src:"http://i.imgur.com/dU4xGQZ.png", width:70, height:78, title:'manbewbs'},
    { src:"http://i.imgur.com/Zn5ZKVH.png", width:70, height:56, title:'wob'},
    { src:"http://i.imgur.com/Gx5wmqn.gif", width:67, height:50, title:'wow'},
    { src:"http://i.imgur.com/2s1ZdDJ.gif", width:67, height:50, title:'bro'},
    { src:"http://i.imgur.com/8Nk1zDe.png", width:72, height:58, title:'nice'},
    { src:"http://i.imgur.com/dBUYFTU.jpg", width:70, height:58, title:'blue'},
    { src:"http://i.imgur.com/A216z9V.gif", width:55, height:46, title:'moobie'},
    { src:"http://i.imgur.com/wMiBxCA.png", width:80, height:40, title:'this'},
    { src:"http://i.imgur.com/rMKG2gV.jpg", width:55, height:55, title:'ohboy'},
    { src:"http://i.imgur.com/fX1hacf.jpg", width:55, height:49, title:'ulike'},
    { src:"http://i.imgur.com/NLTY3Ls.gif", width:36, height:36, title:'br'},
    { src:"http://i.imgur.com/2FawAAO.gif", width:36, height:36, title:'aus'},
    { src:"http://i.imgur.com/gg0ZTvT.gif", width:36, height:36, title:'ca'},
    { src:"http://i.imgur.com/gr6LNCP.gif", width:36, height:36, title:'co'},
    { src:"http://i.imgur.com/mZYVKbK.gif", width:36, height:36, title:'fin'},
    { src:"http://i.imgur.com/JzQOwoA.gif", width:36, height:36, title:'fr'},
    { src:"http://i.imgur.com/3iqjsR4.jpg", width:90, height:58, title:'riiight'},
    { src:"http://i.imgur.com/84uiuhW.png", width:85, height:50, title:'hemad'},
    { src:"http://i.imgur.com/c4ckfKc.png", width:50, height:50, title:'sohigh'},
    { src:"http://i.imgur.com/o92A4QS.jpg", width:65, height:65, title:'icame'},
    { src:"http://i.imgur.com/0D2gTbj.png", width:55, height:55, title:'bored'},
    { src:"http://i.imgur.com/G91Tgpi.png", width:90, height:63, title:'uwot'},
    { src:"http://i.imgur.com/lR91jS1.gif", width:36, height:26, title:'jp'},
    { src:"http://i.imgur.com/KzY8uce.gif", width:55, height:55, title:'ban'},
    { src:"http://i.imgur.com/iTqAwhm.gif", width:39, height:54, title:'vegi'},
    { src:"http://i.imgur.com/gweIcL3.gif", width:36, height:26, title:'isr'},
    { src:"http://i.imgur.com/2G6aQv7.gif", width:36, height:26, title:'mex'},
    { src:"http://i.imgur.com/aWsh9Vw.gif", width:36, height:26, title:'ru'},
    { src:"http://i.imgur.com/Uz11JAn.gif", width:36, height:26, title:'nz'},
    { src:"http://i.imgur.com/EB6AQ0e.gif", width:36, height:26, title:'sco'},
    { src:"http://i.imgur.com/TO55L79.gif", width:36, height:26, title:'som'},
    { src:"http://i.imgur.com/CSUvnYQ.gif", width:36, height:26, title:'sk'},
    { src:"http://i.imgur.com/DyliBef.gif", width:36, height:26, title:'uk'},
    { src:"http://i.imgur.com/0JAOzbm.gif", width:36, height:26, title:'il'},
    { src:"http://i.imgur.com/VfY14D6.gif", width:36, height:26, title:'nor'},
    { src:"http://i.imgur.com/KEzxg4W.gif", width:80, height:52, title:'topkek'},
    { src:"http://i.imgur.com/VnVUDMw.png", width:75, height:27, title:'lenny'},
    { src:"http://i.imgur.com/rwmoUIq.png", width:80, height:31, title:'idk'},
    { src:"http://i.imgur.com/aOeM1nj.gif", width:69, height:40, title:'vimeo'},
    { src:"http://i.imgur.com/j91llW7.png", width:55, height:55, title:'b8'},
    { src:"http://i.imgur.com/ZsqW0Le.png", width:58, height:58, title:'banme'},
    { src:"http://i.imgur.com/3JOZDfo.jpg", width:65, height:58, title:'believe'},
    { src:"http://i.imgur.com/IPBqxxa.gif", width:75, height:75, title:'fu'},
    { src:"http://i.imgur.com/dLI77zk.png", width:57, height:73, title:'brah'},
    { src:"http://i.imgur.com/dfKm6sx.gif", width:36, height:36, title:'disgust'},
    { src:"http://i.imgur.com/FlNRkeG.gif", width:65, height:65, title:'dancebros'},
    { src:"http://i.imgur.com/kPBbovR.png", width:50, height:77, title:'indeed'},
    { src:"http://i.imgur.com/ZfWEMTo.gif", width:65, height:65, title:'obama'},
    { src:"http://i.imgur.com/0zOGxNn.gif", width:45, height:45, title:'rage'},
    { src:"http://i.imgur.com/4wjSpfk.jpg", width:60, height:72, title:'trig'},
    { src:"http://i.imgur.com/euooWbk.gif", width:100, height:50, title:'youfail'},
    { src:"http://i.imgur.com/IdcGxOZ.png", width:70, height:70, title:'sogood'},
    { src:"http://i.imgur.com/yibayZE.gif", width:75, height:40, title:'lolol'},
    { src:"http://i.imgur.com/15jeZG3.gif", width:80, height:52, title:'cage'},
    { src:"http://i.imgur.com/6vH6Awd.gif", width:92, height:50, title:'hug'},
    { src:"http://i.imgur.com/kSVgFm1.gif", width:66, height:62, title:'mario'},
    { src:"http://i.imgur.com/vFeJpco.gif", width:50, height:64, title:'lick'},
    { src:"http://i.imgur.com/Cci7dEu.gif", width:65, height:58, title:'dude'},
    { src:"http://i.imgur.com/VRAl2k3.gif", width:90, height:55, title:'squee'},
    { src:"http://i.imgur.com/b22qMCA.gif", width:45, height:45, title:'wtf'},
    { src:"http://i.imgur.com/ANUGZRb.png", width:47, height:59, title:'cia'},
    { src:"http://i.imgur.com/U26T4vh.png", width:65, height:65, title:'frogfeels'},
    { src:"http://i.imgur.com/FtTlxWq.gif", width:75, height:50, title:'popcorn'},
    { src:"http://i.imgur.com/8DMel0Z.png", width:63, height:63, title:':3'},
    { src:"http://i.imgur.com/NTBhYK4.png", width:70, height:74, title:'edgy'},
    { src:"http://i.imgur.com/IEV1cID.gif", width:90, height:55, title:'overtheline'},
    { src:"http://i.imgur.com/4IBFIUP.png", width:65, height:50, title:'dolan'},
    { src:"http://i.imgur.com/OLqyZkz.gif", width:44, height:76, title:'aliz'},
    { src:"http://i.imgur.com/Bj2NB0q.gif", width:70, height:60, title:'welcome'},
    { src:"http://i.imgur.com/SAHw9Cr.gif", width:75, height:71, title:'carlton'},
    { src:"http://i.imgur.com/fz7b6PK.gif", width:80, height:60, title:'maxrus'},
    { src:"http://i.imgur.com/y3VVIa8.png", width:54, height:70, title:'pls'},
    { src:"http://i.imgur.com/AuybVDh.png", width:41, height:58, title:'stanza'},
    { src:"http://i.imgur.com/6FAZcis.gif", width:65, height:50, title:'realnigga'},
    { src:"http://i.imgur.com/lP6THhw.gif", width:70, height:55, title:'autism'},
    { src:"http://i.imgur.com/wOBLOTD.png", width:70, height:70, title:'trustory'},
    { src:"http://i.imgur.com/LCIRJmN.gif", width:65, height:73, title:'trolld'},
    { src:"http://i.imgur.com/fM96UxS.png", width:70, height:70, title:'yuno'},
    { src:"http://i.imgur.com/AsiRdx2.png", width:70, height:75, title:'doubledare'},
    { src:"http://i.imgur.com/vAo0TOK.jpg", width:95, height:55, title:'larry'},
//frog
    { src:"http://i.imgur.com/NGGdRIR.jpg", width:50, height:50, title:'animefrog'},
    { src:"http://i.imgur.com/of7zEEs.png", width:55, height:46, title:'bedfrog'},
    { src:"http://i.imgur.com/Er4PZbQ.png", width:50, height:60, title:'beefrog'},
    { src:"http://i.imgur.com/Rd6gdlT.jpg", width:55, height:51, title:'coolfrog'},
    { src:"http://i.imgur.com/7DcmUoX.jpg", width:50, height:53, title:'fedorafrog'},
    { src:"http://i.imgur.com/H4Eur5e.png", width:40, height:37, title:'feelsfrog'},
    { src:"http://i.imgur.com/N77gVg8.png", width:40, height:37, title:'feelsgood'},
    { src:"http://i.imgur.com/Uj7QVT8.gif", width:89, height:50, title:'feelshd'},
    { src:"http://i.imgur.com/ciCmM39.jpg", width:50, height:43, title:'feelsmad'},
    { src:"http://i.imgur.com/t9WGcrU.gif", width:50, height:38, title:'go'},
    { src:"http://i.imgur.com/lT7J8Er.jpg", width:55, height:57, title:'greenfeels'},
    { src:"http://i.imgur.com/13sBQ6Q.jpg", width:55, height:55, title:'grillfeels'},
    { src:"http://i.imgur.com/ySnOinb.jpg", width:50, height:49, title:'happyfrog'},
    { src:"http://i.imgur.com/67rrEd5.gif", width:71, height:48, title:'happening'},
    { src:"http://i.imgur.com/QNGCAAH.jpg", width:65, height:44, title:'guesswho'},
    { src:"http://i.imgur.com/afgxDQd.jpg", width:47, height:55, title:'jewfrog'},
    { src:"http://i.imgur.com/QttRBGs.jpg", width:49, height:49, title:'kawaiifrog'},
    { src:"http://i.imgur.com/ah5UZSH.png", width:55, height:50, title:'kenya'},
    { src:"http://i.imgur.com/akoXY1x.png", width:42, height:55, title:'michelle'},
    { src:"http://i.imgur.com/L58NWhB.png", width:41, height:30, title:'no'},
    { src:"http://i.imgur.com/eZBnzJ6.jpg", width:50, height:50, title:'normies'},
    { src:"http://i.imgur.com/xDEoDXD.gif", width:55, height:48, title:'o-o'},
    { src:"http://i.imgur.com/Pu1TimZ.jpg", width:60, height:52, title:'katyperry'},
    { src:"http://i.imgur.com/8P2tZ2i.png", width:25, height:25, title:'peka'},
    { src:"http://i.imgur.com/8afz3Tp.png", width:55, height:44, title:'reddit'},
    { src:"http://i.imgur.com/YMBljj3.png", width:55, height:60, title:'spacefeels'},
    { src:"http://i.imgur.com/q7ldsDW.jpg", width:50, height:47, title:'worryfrog'},
    { src:"http://i.imgur.com/4q3Zc9k.jpg", width:50, height:50, title:'pepe'},
    { src:"http://i.imgur.com/GDZjehE.jpg", width:42, height:55, title:'youtoo'},
    { src:"http://i.imgur.com/ZtqjVDC.jpg", width:37, height:50, title:'yee'},
    { src:"http://i.imgur.com/Xy7kUph.jpg", width:55, height:55, title:'wut'},
    { src:"http://i.imgur.com/rflhJtC.gif", width:58, height:55, title:'chaika'}

    ];

function addEmotes(){
    for(var i = 0; i < emotes.length; i += 1){
        var parameter = emotes[i];
        window.$codes[parameter.title] = $('<img>', parameter)[0].outerHTML;
        window.$codes[parameter.name] = $('<img>', parameter)[0].outerHTML;
    }
}

function main(){
    var oldOnConnected;
    function onConnected(){
    	oldOnConnected.apply(undefined, arguments);
        addEmotes();
    }
    if (!!window.global){ //old.instasync
        oldOnConnected = window.global.onConnected;
        window.global.onConnected = onConnected;
    }else if(!!window.room){ //InstaSync 2.0
        oldOnConnected = window.room.onConnected;
        window.room.onConnected = onConnected;
    }
}

if (window.document.readyState === 'complete') {
  main();
} else {
  window.addEventListener('load', main, false);
}