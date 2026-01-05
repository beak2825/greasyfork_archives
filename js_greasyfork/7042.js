GM_addStyle("\
    [id^=\"POdata\"]{display:block;}\
    [id^=\"POimage\"]{display:block;float:left;border:2px solid #fff;border-radius:30px;background-color:#fff;width:55px;height:55px;overflow:hidden;position:relative;}\
    [id^=\"POimage\"] img {float:left;height:70px;max-width:inherit;position:absolute;left:-20px}\
    [id^=\"POdetail\"]{float:left;width:60%;height:51px;padding:0 0 4px;margin-left:9px;}\
    .link-button i, .quick-button i, .user i {margin:0 5px 0 0;}\
    .red, .red:hover {color:red;}\
    .vanish{display:none}\
    .edit {padding-right:100px;padding-bottom:30px}\
    .short {width:58% !important;}\
    .dwarf {width:23% !important;}\
    .rightControl{position:absolute;width:100px;height:30px;top:0;right:0;}\
    .rightControl a {float:right;}\
    #__tRowDesc {position:relative;}\
    #__tDescription a {color:#0D96CC;}\
    #projectDescription, #taskDescription, #activityDescription{width:90%;}\
    #quickActionWrapper.stickyPanel {position:fixed; top:0px;}\
    #quickActionPanel {display:block; width:250px; position:absolute; top:142px; right:350px; box-shadow:0px 0px 10px 3px #999}\
    .stickyPanel #quickActionPanel { position:fixed; top:15px}\
    #quickActionWrapper .sub-control-groups {margin-bottom:7px;}\
    #quickActionWrapper select {height:25px; width:74px;}\
    #quickActionWrapper .expanded {width:117px;}\
    @media screen and (max-width:1366px){\
        #quickActionPanel { right:60px;}\
    }\
");

var $imageServer = "http://www.fotoagent.dk/single_picture/11612/20/small/";
var $noImage = "http://production.mcb.dk/images/employeeNoImage.png";

var $userList = [
{"UserID":"119","Initial":"ABL","Username":"Anne Bank Lindberg","Email":"anne@mcb.dk","Photo":"anne.jpg","Skype":"ablindberg"},
{"UserID":"142","Initial":"ADN","Username":"Anh Duong Ngoc","Email":"anhdn@mcb.vn","Photo":"Dang_Duong_Ng_c_Anh.jpg","Skype":"loaken8x"},
{"UserID":"118","Initial":"AJ","Username":"Anders Jonsson","Email":"aj@mcb.dk","Photo":"anders__2_.jpg","Skype":"anders.jonsson78"},
{"UserID":"143","Initial":"ALH","Username":"Anh Hoang Le","Email":"anhlh@mcb.vn","Photo":"Le_Hoang_Anh.jpg","Skype":"anhlh3"},
{"UserID":"117","Initial":"ALL","Username":"Allan Lund Lauridsen","Email":"all@mcb.dk","Photo":"allan_l.jpg","Skype":"allan-mcb"},
{"UserID":"144","Initial":"ANV","Username":"Anh Nguyen Viet","Email":"anv@mcb.vn","Photo":"Nguyen_Viet_Anh.jpg","Skype":"cwc_nva"},
{"UserID":"116","Initial":"AWC","Username":"Allan Weyhe Cloos","Email":"awc@mcb.dk","Photo":"Allan_C.jpg","Skype":"allan.cloos"},
{"UserID":"190","Initial":"BB","Username":"Bo Bundgaard","Email":"bb@mcb.dk","Photo":"bo_b.jpg","Skype":"BB-MCB"},
{"UserID":"172","Initial":"BHK","Username":"Bo Hedegaard Kristensen","Email":"bo@mcb.dk","Photo":"bo.jpg","Skype":"bo-mcb"},
{"UserID":"145","Initial":"CLH","Username":"Cuong Le Hung","Email":"cuong@mcb.vn","Photo":"Le_Hung_Cuong.jpg","Skype":"le.hung.cuong.89"},
{"UserID":"121","Initial":"CP","Username":"Costin Popescu","Email":"costy@mcb.dk","Photo":"costi.jpg","Skype":"ssj_costy"},
{"UserID":"176","Initial":"DBS","Username":"Dan Bastrup Sørensen","Email":"dbs@mcb.dk","Photo":"dan.jpg","Skype":"danbastrupmcb"},
{"UserID":"4","Initial":"DHE","Username":"Daniel Esbersen","Email":"dhe@mcb.dk","Photo":"daniel.jpg","Skype":"dhe.mcb"},
{"UserID":"147","Initial":"DHV","Username":"Dinh Ha Van","Email":"dinh@mcb.vn","Photo":"Dinh.jpg","Skype":"hadinhhd"},
{"UserID":"162","Initial":"DXD","Username":"Dzung Dinh Xuan ","Email":"dzung@mcb.vn","Photo":"Dinh_Xuan_Dzung.jpg","Skype":"scottdinh"},
{"UserID":"181","Initial":"FB","Username":"Finn Brose","Email":"fb@mcb.dk","Photo":"finn.jpg","Skype":"fbrose"},
{"UserID":"124","Initial":"FCL","Username":"Flemming Clausen Lund","Email":"fcl@mcb.dk","Photo":"flemmeing.jpg","Skype":"flemmingclund"},
{"UserID":"159","Initial":"HD","Username":"Huong Do Lan","Email":"huong@mcb.vn","Photo":"Do_Lan_Huong.jpg","Skype":"wonkyass06"},
{"UserID":"125","Initial":"HK","Username":"Helle Krogh","Email":"hk@mcb.dk","Photo":"","Skype":""},
{"UserID":"183","Initial":"HKD","Username":"Heinrich Dalager","Email":"hkd@mcb.dk","Photo":"heinrich_1_.jpg","Skype":"dalager1"},
{"UserID":"160","Initial":"HLD","Username":"Hoa Luu Duc","Email":"hoald@mcb.vn","Photo":"Luu_Thi_Duc_Hoa.jpg","Skype":"luuduchoa8"},
{"UserID":"171","Initial":"HMF","Username":"Henrik Semback Much-Fals","Email":"hmf@mcb.dk","Photo":"henrik.jpg","Skype":""},
{"UserID":"158","Initial":"HNH","Username":"Hoa Nguyen Hong","Email":"hoa@mcb.vn","Photo":"Nguyen_Hong_Hoa(1).jpg","Skype":"nicekitty09"},
{"UserID":"149","Initial":"HTN","Username":"Hieu Nguyen Thanh","Email":"hieu@mcb.vn","Photo":"","Skype":"sweet_boy0301"},
{"UserID":"154","Initial":"HTT","Username":"Ha Tran Thi","Email":"ha@mcb.vn","Photo":"","Skype":"tranthiha"},
{"UserID":"126","Initial":"ILF","Username":"Ignacio López Flores","Email":"","Photo":"","Skype":""},
{"UserID":"126","Initial":"JAC","Username":"Jacob Knutsson Sandhøj","Email":"jacob@mcb.dk","Photo":"jacob_a.jpg","Skype":"quaserqual"},
{"UserID":"5","Initial":"JKL","Username":"Janus Klok Matthesen","Email":"janus@mcb.dk","Photo":"janus.jpg","Skype":"janusklok"},
{"UserID":"129","Initial":"JN","Username":"John Nielsen","Email":"jn@mcb.dk","Photo":"John.jpg","Skype":"john.nielsen30"},
{"UserID":"128","Initial":"JSP","Username":"Jesper Splidsboel","Email":"jsp@mcb.dk","Photo":"Jesper.jpg","Skype":" jsplidsboel"},
{"UserID":"174","Initial":"KBJ","Username":"Kasper Brøndum Jensen","Email":"kbj@mcb.dk","Photo":"Kasper_Br_ndum_Jensen.jpg","Skype":"kbjensen83"},
{"UserID":"180","Initial":"KD","Username":"Kasper Dorby","Email":"kd@mcb.dk","Photo":"KasperD.jpg","Skype":""},
{"UserID":"184","Initial":"KHT","Username":"Kristoffer Hauge Tarp","Email":"kht@mcb.dk","Photo":"kristoffer.jpg","Skype":"kristoffer_hauge_tarp"},
{"UserID":"131","Initial":"LBE","Username":"Lasse Bech Eiler","Email":"lasse@mcb.dk","Photo":"lasse.jpg","Skype":"lasse_bech_eiler"},
{"UserID":"130","Initial":"LDS","Username":"Lars Duelund Sørensen","Email":"lds@mcb.dk","Photo":"lars.jpg","Skype":"lars.duelund.sorensen"},
{"UserID":"150","Initial":"LKD","Username":"Linh Dang Khanh","Email":"linhdk@mcb.vn","Photo":"Dang_Khanh_Linh.jpg","Skype":"linhdtk"},
{"UserID":"165","Initial":"LM","Username":"Line Meier Degnbol","Email":"lm@mcb.dk","Photo":"line.jpg","Skype":"line-mcb"},
{"UserID":"165","Initial":"LMD","Username":"Ly Mai Dao","Email":"ly@mcb.vn","Photo":"dao_mai_ly.jpg","Skype":"peachapricot89"},
{"UserID":"165","Initial":"LMN","Username":"Luan Nguyen Minh","Email":"luan@mcb.vn","Photo":"","Skype":"nm_luan"},
{"UserID":"132","Initial":"LP","Username":"Leif Pedersen","Email":"lp@mcb.dk","Photo":"Leif.jpg","Skype":"lp_mcb"},
{"UserID":"136","Initial":"MAP","Username":"Morten Arp Pedersen","Email":"map@mcb.dk","Photo":"morten_arp.jpg","Skype":"mortenarp"},
{"UserID":"175","Initial":"MB","Username":"Michael Bille","Email":"mb@mcb.dk","Photo":"bille.jpg","Skype":"michael_bille107"},
{"UserID":"133","Initial":"MBH","Username":"Malte Bolvig Hansen","Email":"mbh@mcb.dk","Photo":"malte__eb.jpg","Skype":"malte_mcb"},
{"UserID":"187","Initial":"MO","Username":"Marie Odgaard","Email":"mo@mcb.dk","Photo":"Marie_Odgaard.jpg","Skype":"marie.odgaard2"},
{"UserID":"187","Initial":"MOV","Username":"Morten Overgaard Mønsted","Email":"mov@mcb.dk","Photo":"mov.jpg","Skype":"djoike"},
{"UserID":"178","Initial":"MSK","Username":"Mie Sejer Kristensen","Email":"mie@mcb.dk","Photo":"mie__3_.jpg","Skype":""},
{"UserID":"188","Initial":"NHB","Username":"Nina Hildebrandt Birkmose","Email":"nhb@mcb.dk","Photo":"","Skype":"nina.hildebrandt.birkmose"},
{"UserID":"137","Initial":"NJN","Username":"Nicolas Jægergaard Nielsen","Email":"njn@mcb.dk","Photo":"","Skype":"njn-mcb"},
{"UserID":"173","Initial":"PB","Username":"Peter Bjerregaard","Email":"pb@mcb.dk","Photo":"peter.jpg","Skype":"mrpeterbjerregaard"},
{"UserID":"200","Initial":"PER","Username":"Peter Engelst Rasmussen","Email":"per@mcb.dk","Photo":"peter(1).jpg","Skype":"live:per_323"},
{"UserID":"186","Initial":"PTA","Username":"Preben Thrige Andersen","Email":"pta@mcb.dk","Photo":"preben.jpg","Skype":"preben.t.andersen"},
{"UserID":"185","Initial":"QVV","Username":"Quyet Vu Van","Email":"quyetvv@mcb.vn","Photo":"Vu_Van_Quyet(1).jpg","Skype":"quyetvv"},
{"UserID":"195","Initial":"SH","Username":"Sara Hernes","Email":"sh@mcb.dk","Photo":"","Skype":""},
{"UserID":"177","Initial":"SHS","Username":"Shiela Smed","Email":"shs@mcb.dk","Photo":"","Skype":"shiela.smed"},
{"UserID":"139","Initial":"SP","Username":"Stine Pedersen","Email":"sp@mcb.dk","Photo":"stine.jpg","Skype":"stine_pedersen"},
{"UserID":"169","Initial":"THK","Username":"Thanh Hoang Kim","Email":"thanh@mcb.vn","Photo":"Hoang_Kim_Thanh.jpg","Skype":"hkthanh2"},
{"UserID":"140","Initial":"TP","Username":"Thomas Pedersen","Email":"tp@mcb.dk","Photo":"tp__1_(1).jpg","Skype":""},
{"UserID":"202","Initial":"TTMT","Username":"Trieu Thi Mai Trang","Email":"trang@mcb.vn","Photo":"Trieu_Thi_Mai_Trang.jpg","Skype":"trieuthimaitrang"},
{"UserID":"164","Initial":"TVP","Username":"Truong Phan Van","Email":"truong@mcb.vn","Photo":"","Skype":"igooglevn"},
{"UserID":"157","Initial":"XNH","Username":"Xuan Nguyen Hong","Email":"xuan@mcb.vn","Photo":"","Skype":"aht_xuannh87"},
{"UserID":"194","Initial":"AAS","Username":"Alex Asp Sørensen","Email":"aas@mcb.dk","Photo":"alex.jpg","Skype":"Alex.AspSorensenMCB"}];

(function($){
    'use strict';

    /**
    * addEmployeeDetail plugin
    *
    * Transforms a simple username string into rich user information, 
    * including Picture, Fullname, Email, and Skype ID.
    *
    * User data structure is organized as a JSON object named $userList.
    *
    * Option(s): {initial:false}
    *
    * Simple usage: 
    * $('div').addEmployeeDetail();
    *
    * With optional parameter:
    * $('div').addEmployeeDetail({initial:true})
    *
    * Default parameter(s) can be changed anywhere by assigning value to:
    * $.fn.addEmployeeDetail.defaults
    *
    **/
    $.fn.addEmployeeDetail = function(useOnlyInitial){
        
        var settings = $.extend({}, $.fn.addEmployeeDetail.defaults, useOnlyInitial);
        
        var $data = $.trim(this.text()), $initial;
        
        if($data !== ''){
            // Use user's initial as input
            if(settings.initial){
                $initial = $data;
            }
            else{
                // Use user's full name string as input (f.x.: JKL (Janus Klok Matthesen)) and take the leading characters as Initial
                $initial = $data.substr(0, $data.indexOf(' '));
            }
            
            // Iterate the user object list to find a match of Initial
            var $POdata = $.grep($userList, function(i){
                return i.Initial === $initial;
            });
            
            if($POdata.length > 0){
                var rnd = Math.floor(Math.random()*100000000000000000);
                if ($POdata[0].Username != null){
                    this.text('').prepend($('<div/>').attr({
                        'id':'POdata' + rnd,
                        'data-userguid':$POdata[0].UserID,
                        'data-user-initial':$initial
                    }));
                }
                
                $('<div class="user"><div id="POimage' + rnd + '" class="img"></div><div id="POdetail' + rnd + '" class="detail"></div></div>').appendTo($('#POdata'+rnd));
                if($.trim($POdata[0].Photo) !== ""){
                    $('<img/>').attr('src',$imageServer + $POdata[0].Photo).appendTo($('#POimage'+rnd));
                }
                else{
                    $('<img/>').attr('src',$noImage).appendTo($('#POimage'+rnd));
                }
                
                $('<div/>').attr('id','POname'+rnd).text($POdata[0].Username).appendTo($('#POdetail'+rnd));
                $('<div/>').attr('id','POemail'+rnd).html('<i class="icon-envelope"></i><a href="mailto:' + $POdata[0].Email + '">' + $POdata[0].Email + '</a>').appendTo($('#POdetail'+rnd));
                
                if($.trim($POdata[0].Skype) !== ""){
                    $('<div/>').attr('id','POskype'+rnd).html('<i class="icon-bullhorn"></i><a href="skype:' + $POdata[0].Skype + '?chat">' + $POdata[0].Skype + '</a>').appendTo($('#POdetail'+rnd));
                }
                return this;
            }
        }
    };

    //Default configuration of addEmployeeDetail()
    $.fn.addEmployeeDetail.defaults = { 
        //Parse data using only user's Initial or not
        initial : false 
    };


    /**
    * urlToLink plugin
    *
    * Transforms URLs in text into HTML <a> elements.
    *
    * Example: Lorem ipsum dolor sit amet consecter adpsim elit http://loremipsum.com
    * Result:  Lorem ipsum dolor sit amet consecter adpsim elit <a href="http://loremipsum.com">http://loremipsum.com</a>
    *
    * HOW TO USE   
    *
    * Assuming that you have already inserted jquery.js and jquery.urlToLink.js in your code
    * and that $ is your jQuery object reference.
    *
    * Simple usage:
    * $('p').urlToLink();
    *
    * Changing the parameters:
    * $('p').urlToLink({target:'_blank'});
    *
    * You can change the default parameters by calling
    * $.fn.urlToLink.defaults anywhere in your script.
    *
    * Optional parameters:
    * Allow long links to be compressed to a given length
    * by sampling the start and end of the link
    * and compressing them with a given string,
    * and, optionally, stripping the protocol prefix from the link first.
    * {
    *    compressTo: 30,        //The length that long links will be compressed to.
    *    compressWith: '...'    //The string that long links will be compressed with, '...' by default.
    *    removeHttp: true       //Remove the protocol prefix of the link.
    * }
    *
    *
    * LICENSE
    *
    * This plugin was inspired by John Gruber's regex at
    * http://daringfireball.net/2010/07/improved_regex_for_matching_urls
    *
    * Copyright (c) 2011 Gabriel Izaias (gabrielizaias.com)
    * Dual licensed under the MIT and GPL licenses:
    * http://www.opensource.org/licenses/mit-license.php
    * http://www.gnu.org/licenses/gpl.html
    *
    * Source: https://github.com/gabrielizaias/urlToLink/blob/master/jquery.urlToLink.js
    *
    * Email address and domain matching functionalities added
    * 2014-03-19 by ALH
    *
    */
    

    /*$.fn.urlToLink = function(options) {
        var options = $.extend({}, $.fn.urlToLink.defaults, options); 
        return this.each(function(){
            var element = $(this),
                expression = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
            // The magic
            return element.html(element.html().replace(expression, "<a href='$1' target='"+options.target+"'>$1</a>"));
        });
    };
    
    //Default configuration
    $.fn.urlToLink.defaults = {
        target : '_blank'         // Link target
    };*/

    var emailMatchingRegEx = /([a-z0-9_\.\-]+)@([\da-z\.\-]+)\.([a-z\.]{2,6})/ig, 
        linkMatchingRegEx = /(\b(?:https?|ftp|file):\/\/[\-A-Z0-9+&@#\/%?=~_|!:,.;]*[\-A-Z0-9+&@#\/%=~_|])/ig,
        domainMatchingRegEx = /(?:^|\n|\s)(\w.?(?:[\w\-]+[^\W])+(?:[\.]+[\w\-]+)(?:[\.]+(?:[\w\-])*)*?(?:\s|$|\r))/ig;


    $.fn.urlToLink = function (options) {
        options = $.extend({}, $.fn.urlToLink.defaults, options);
        return this.each(function () {
            
            if(options.cleanupHTML){
                $(this).HTMLCleanup({preserveLineBreak:options.preserveLineBreak});
            }

            //Convert Email addresses to actual Links
            $(this).html($(this).html().replace(emailMatchingRegEx, function($0, $1){
                return '<a href="mailto:' + $0 + '" title="' + $0 + '">' + $0 + '</a>';
            }));

            //Convert URL to actual Links
            $(this).html($(this).html().replace(
                linkMatchingRegEx,
                function (match, contents, offset, s) {
                    var href = match,
                        linkText = '',
                        lengthToSplit = 0;

                    if (options.removeHttp)
                        href = href.replace("http://", "").replace("https://", "");

                    linkText = href;

                    if (options.compressTo) {
                        if (href.length > options.compressTo) {
                            lengthToSplit = (options.compressTo - options.compressWith.length) / 2;
                            linkText = href.substring(0, lengthToSplit) +
                                        options.compressWith +
                                        href.slice(-lengthToSplit);
                        }
                    }

                    return '<a href="' + match + '" title="' + match + '" target="' + options.target + '">' + linkText + '</a>';
                }
            ));
            
            /*
            * Convert standalone domain names to actual links
            */
            //Break the content using '<br>' as delimiter into an array of string
            var c = $(this).html().toString().split('<br>'),
                t = [];
            
            //iterate the content array
            $.each(c, function(index,value) {
                var k = $.trim(value);
                if(k.length > 0) {
                    //break the string into words using ' ' as delimeter
                    //to avoid matching unusual long string of continuos word characters
                    var p = k.split(' '), q = [];
                    $.each(p, function(x,y) {
                        var s = y.toString();
                        if(y.length < 64) {
                            s = s.replace(domainMatchingRegEx, function($0, $1) {
                                var href= $.trim($0).toString().toLowerCase();
                                var ret = '<a href="http://' + href + '" title="http://' + href + '" target="' + options.target + '">' + $.trim($0) + '</a>';
                                return ret;
                            });
                        }
                        q.push(s);
                    });  
                    k = q.join(' ');
                    //push the processed data into the temporary array
                    t.push(k);
                }
                else
                    t.push(k);
                k = null;
            });
            //join the array members together using <br> as delimiter
            $(this).html(t.join('<br>'));
        });
    };

    /**
     * Default configuration of urlToLink()
     */
    $.fn.urlToLink.defaults = {
        // Clean-up HTML tags
        cleanupHTML: true,
        // Preserve line breaks
        preserveLineBreak: false,
        // Link target
        target : '_blank',
        // Text to add when compressedTo is set, '...' by default
        compressWith: '&hellip;'
    };

    /*
    * Clean-up HTML tags inside the processed element. 
    * <br> tags are replaced with '\n' before stripping off HTML tags
    * and put back after stripping.
    */
    $.fn.HTMLCleanup = function(preserveLineBreak){
        var settings = $.extend({}, $.fn.HTMLCleanup.defaults, preserveLineBreak);

        var stripHTMLRegex = /(<([^>]+)>)/ig;
        var a = $.trim($(this).html()).replace(/(\<br\>)/ig,'\n').replace(stripHTMLRegex, "");

        if(settings.preserveLineBreak){
            a = a.replace(/(\n)/ig,'<br>');
        }
        return $(this).html(a);
    };

    $.fn.HTMLCleanup.defaults = {
        //Put back <br> tags after stripping off HTML tags
        preserveLineBreak: false
    };

}(jQuery));