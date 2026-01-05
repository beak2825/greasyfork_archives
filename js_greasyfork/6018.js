// ==UserScript==
// @name         cab.Emoticons
// @namespace    http://facebook.com/kazyma.hoshino
// @version      1.0.5
// @description  cabEmoticons used for CAB
// @copyright    2014+, Dược Nham/K.
// @include      http://cab.vn/c/*
// @icon         http://eemoticons.net/Upload/Cool%20Face%203/victory.png
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/6018/cabEmoticons.user.js
// @updateURL https://update.greasyfork.org/scripts/6018/cabEmoticons.meta.js
// ==/UserScript==


$(function() {
    var style = '#cabEmoticons{padding:5px;border:1px solid #eee;}#cabEmoticons #selectEmo{padding:2px;}#cabEmoticons #selectEmo a{cursor:pointer;background:#08D;margin:2px;color:#fff;padding:3px;}#cabEmoticons #emoList{overflow:hidden;}#cabEmoticons #emoList > div{display:none;height:250px;overflow:auto;width:102%}#cabEmoticons #emoList > div:first-child{display:block;}.hide{display:none;}#cabEmoticons #emoList img{cursor:pointer;margin:2px;border:1px solid #eee;}#cabEmoticons #emoList img:hover{border:1px solid #08d;}';
    var t;
    var w = {
        troll : "",
        onion : "",
        yoyo : "",
        neko : "",
        cutes : "",
        rabit : ""
            };
    var h = ["http://i.imgur.com/", "http://blog.uhm.vn/emo/", "http://eemoticons.net/Upload/"];
    var troll = ["MkYRcXg", "xVqT4Jn", "kKaK0XP", "zXNxdcU", "bjj8N84", "xR1yER6", "JI1auUu", "SlW0Zgh", "zPxZVCM", "zxRIxZc", "daANVbR", "YGAQuwf", "N94HKlh", "CXqxqdc", "bnjXYNd", "xecEMCj", "sch2ePR", "rX7eA1a", "CTf04TE", "bgfvEoJ", "LgPPWEP", "fKOKG35", "nPaFD5v", "kGzsGj9", "oOPSfkX", "ETVqdp1", "scNSOCM", "u2YGG4f", "uUzae95", "6RcmUaD", "mlGa42J", "biDNwVs", "jnZT5Y0", "4pUANWV", "U59cj8i", "CrICTL2", "V0RVovO", "5UI7HSR", "hJTxR7h", "Dnv0GvD", "TXdQEI5", "SmK3YDL", "TurxvQN", "Vxzc5di", "sKr1db7", "2idrat5", "fXahI9E", "bmIjSnU", "IJLTHCv", "Fkg2CE1", "mPyNEh5", "bWiHwlh", "8N0ZS0J", "VaHJqsn", "gKGR7TH", "qYUShOw", "UUhOoT1", "MvIf5jS", "rItlxD6", "Oq6kpFQ", "WIF9yi4", "MKSxGGq", "aDNMs8I", "qGlmthA", "1z7AsXg", "GXeQQdW", "CA6lt5T", "6x82yyL", "tW4KNg7", "Gb8ZwEL", "DcifbzH", "SMY7CCS", "kl2eZ6T", "LCqPUhq", "A7MFXQx", "DaHJPaJ", "sqTUNZ7", "UOANFmO", "d5rbCI8", "nPOo9jT", "aFVyPBc", "HEH9971", "98u2ssB", "HniRs7s", "2R2IDzu", "Xkzai5q", "wrBom3g", "K9DsPDF", "7GSRtHu", "bSyCSQ6", "qZvZ0Bd", "c5DPCj7", "eodieUl", "5fdkO0F", "inHJVlx", "KZ1m7Gx", "EWOw6BX", "HYx0y2k", "MbDZZpB", "tjjBtyO", "o0l7Y2V", "svuk5EB", "GlnkshB", "IzPiH5P", "ntgzxUH", "tlQYUu5", "7mpJX92", "1nZovTW", "ux4emmj", "b89h9pg", "xLiXzy5", "LRlHlHC", "CrScQhG", "RJJ5EmT", "bEtT7Fq", "qOC3oBD", "stXn7JM", "eyCWneV", "yInhEeJ", "SsTXVb9", "8rLntnB", "2D3BKYu", "7Gk4CE0", "NZbdT7V", "dbrRLfJ", "3u6be79", "acFNcFd", "l3AU2gm", "IjBOBmj", "LPJjq26", "VEu1UaX", "r3zgogU", "l5yx4ai", "3vAioGr", "3DoqrBh", "LgOXw41", "pKJYRhu", "XBJDZE6", "zZW9AfM", "3NWUliz", "DJ2GqRD", "VPmTxzk", "Ahr6iOC", "dh2jnkC", "qBTtHnh", "nBoOjyc", "g1Ct4PQ", "Rv7k5bT", "9IDDH4e", "VXaXM81", "ysHB5O2", "Hh0cu1L", "Y0x6YU5", "EQhFUBC", "aVA040S", "S7OOEif", "3OpWGrg"],
        onion = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "100", "101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114", "115", "116", "117", "118", "119", "120", "131", "132", "133", "134", "135", "136", "137", "138", "139"],
        yoyo = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "100", "101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114", "115", "116", "117", "118", "119", "120", "131", "132", "133", "134", "135", "136", "137", "138", "139", "140", "141", "142", "143", "144", "145", "146", "147", "148", "149", "150", "151", "152", "153", "154", "155", "156", "157", "158", "159", "160", "161", "162", "163", "164", "165", "166", "167", "168", "169", "170", "171", "172", "173", "174", "175", "176", "177", "178", "179", "180", "181", "182", "183", "184", "185", "186", "187", "188", "189", "190", "191", "192", "193", "194", "195", "196", "197", "198", "199", "200", "201", "202", "203", "204", "205", "206", "207", "208", "209", "210"],
        neko = ["001", "002", "003", "004", "005", "006", "007", "008", "009", "010", "011", "012", "013", "014", "015", "016", "017", "018", "019", "020", "021", "022", "023", "024", "025", "026", "027", "028", "029", "030", "031", "032", "033", "034", "035", "036", "037", "038", "039", "040", "041", "042", "043", "044", "045", "046", "047", "048", "049", "050", "051", "052", "053", "054", "055", "056"],
        cutes = ["001", "002", "003", "004", "005", "006", "007", "008", "009", "010", "011", "012", "013", "014", "015", "016", "017", "018", "019", "020"],
        rabit = ["10", "11", "12", "13", "14", "15", "16", "17", "2", "20", "21", "22", "23", "24", "25", "26", "27", "28", "3", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "4", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "80", "81", "82", "83", "84", "9", "92", "93", "94", "95", "96", "97", "98", "99"],
        baby = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "100", "101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112"];
    var u = [""];
    var f = [".png", ".jpg", ".gif"];
    for (t = 0; t < troll.length; t++) {w.troll += "<img src='" + h[0] + troll[t] + f[0] + "' />";}
    for (t = 0; t < onion.length; t++) {w.onion += "<img src='" + h[1] + "onion/" + onion[t] + f[2] + "' />";}
    for (t = 0; t < yoyo.length; t++) {w.yoyo += "<img src='" + h[1] + "yoyocici/" + yoyo[t] + f[2] + "' />";}
    for (t = 0; t < neko.length; t++) {w.neko += "<img src='" + h[2] + "Neko/neko " + neko[t] + f[2] + "' />";}
    for (t = 0; t < cutes.length; t++) {w.cutes += "<img src='" + h[2] + "Cute%20Sheep/Cute%20Sheep%20Emoticon%20" + cutes[t] + f[2] + "' />";}
    for (t = 0; t < rabit.length; t++) {w.rabit += "<img src='" + h[2] + "Rabbit/th_" + rabit[t] + f[2] + "' />";}
    for (t = 0; t < rabit.length; t++) {w.baby += "<img src='" + h[1] + "babysoldier/" + baby[t] + f[2] + "' />";}
    
    $('#comment-loading').after('<div id="openEmoticons" style="display:inline-block;padding:4px;border: 1px solid #ddd;cursor:pointer"><img src="http://i.imgur.com/Vf7bSds.png"></div>')
    $('.submit-comment').after('<div id="cabEmoticons" class="hide"><div id="selectEmo"><a id="emoOnion" data-show="sOnio">Onion</a><a id="emoYoyo" data-show="sYoyo">Yoyo & Cici</a><a id="emoTroll" data-show="sTrol">Troll Face</a><a id="emoNeko" data-show="sNeko">Neko</a><a id="emoCutes" data-show="sCute">Cutes Sheep</a><a id="emoRabit" data-show="sRabi">Rabit</a><a id="emoBaby" data-show="sBaby">Baby Soldier</a><a id="showInfo" data-show="sInfo" style="float:right;background:#fff;color:#08d;font-weight:bold;">?</a></div><div id="emoList"><div id="sOnio">' + w.onion + '</div><div id="sYoyo">' + w.yoyo + '</div><div id="sTrol">' + w.troll + '</div><div id="sNeko">' + w.neko + '</div><div id="sCute">' + w.cutes + '</div><div id="sRabi">' + w.rabit + '</div><div id="sBaby">' + w.baby + '</div><div id="sInfo" style="text-align:center"><strong>Infomartion</strong><br />cabEmoticons v1.0.5 ver Beta © Dược Nham - K. 2014+<br />Sử dụng cho Cab.vn, thiết kế bởi <a href="http://www.facebook.com/kazyma.hoshino" target="_blank">Dược Nham</a><br />Số emoticons hiện tại: 7</div></div></div>');
    $('body').append('<style>' + style + '</style>');
    $('#openEmoticons').click(function(){
        if($('#cabEmoticons').hasClass('hide')){
            $('#cabEmoticons').removeClass('hide')
        } else {
            $('#cabEmoticons').addClass('hide')
        }
        $('#cabEmoticons #selectEmo a').click(function(){
            var tab = $(this).attr("data-show");
            $('#cabEmoticons #emoList > div').hide();
            $('#cabEmoticons #emoList > div[id="' + tab + '"]').show();
        });
    });
    $('#cabEmoticons').find('#emoList img').click(function(){
        var iSrc = $(this).attr('src');
        var iDef = $('#comment').val();
        $('#comment').val(iDef + '![title](' + iSrc + ')');
    });
});