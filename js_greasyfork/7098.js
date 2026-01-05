// ==UserScript==
// @name         Speedport-Autologin
// @description  Skips Speedport login page
// @namespace //greasyfork.org/users/7597

// @version      1.2
// @date    10.06.2015

// @match       *://speedport.ip
// @match       *://speedport.ip/pub/index.php*


// @icon http://speedport.ip/pub/pic_c_voip_reg.gif
// @downloadURL https://update.greasyfork.org/scripts/7098/Speedport-Autologin.user.js
// @updateURL https://update.greasyfork.org/scripts/7098/Speedport-Autologin.meta.js
// ==/UserScript==

addJQuery(function() {

    /////////////////////////////////////
    //     _____                __  _
    //    / ____|              / _|(_)
    //   | |      ___   _ __  | |_  _   __ _
    //   | |     / _ \ | '_ \ |  _|| | / _` |
    //   | |____| (_) || | | || |  | || (_| |
    //    \_____|\___/ |_| |_||_|  |_| \__, |
    //                                  __/ |
    //                                 |___/

   
    debugger
    
    
	var config = {
		
		Login : {

         /* Enter your password here */
			pwd : "1234"
        }

	}
    // Cool stuff (Tested with Speedport W 723V 1.01.009):
    //
    // #1 Hiddenpage DSL and UMTS Logger
    // 		open //speedport.ip/html/capture.html 
    // 		(or create/Set Cookie for speedport.ip to "capture" = "1" and goto //speedport.ip/pub/index.php)
    //   ->use wireshark to open the *.cap
    //
    // #2 Raw Log
    //   //speedport.ip/auth/logbuch_sicherheit.htm
    //
    // #3 Hiddenpage Reconnect Inet
    //   //speedport.ip/pub/top_sperren.htm
    //   //speedport.ip/pub/top_freischalten.htm
    //
    // #4 In/Out PhoneCalls
    //   //speedport.ip/auth/hcti_status_telanrl.php
    //   //speedport.ip/auth/hcti_status_telgdat.php    
          
    // Enter password
    $('input.stylepwd') .val (config.Login.pwd)
    
    
    // Avoid click loop
    // Don't click if we already came from that page.
    
    // ToDo:Fix double Reload bug by  handle case like this
    //    referrer: //speedport.ip
    //    href:    //speedport.ip/pub/index.php
   if ( (document.referrer != location.href) ) {
       
    
       // Submit Form
       $('Form').submit()
       
   } else {
       debugger
       
      	$('input.stylepwd').parent().append(
            $('<a>')
                .text('Try  Login BugFix')
                .attr('hRef', make_href_url("hcti_startseite.php"))
       )
        
        // It's not a Bug - it's a feature !!!
        
        // So make it more - Add usefull quick links:
        
         $('form')
            .append( 
             $('<a>')
                .text('Phone In | ')
                .attr('hRef', make_href_url("hcti_status_telanrl.php"))
                .attr('target', '_blank')
             )
         
             .append( 
             $('<a>')
                .text('Phone Out | ')
                .attr('hRef', make_href_url("hcti_status_telgdat.php"))
                .attr('target', '_blank')
             )

             .append( 
              $('<a>')
                .text('Capture Traffic | ')
                .attr('hRef',       "//speedport.ip/html/capture.html"))
         
              .append( 
              $('<a>')
                .text('Systemlog')
                .attr('hRef', make_href_url("logbuch_sicherheit.htm"))
                .attr('target', '_blank')
             )
         
         //$('form').class('mbutspez')
 
        
   }

});

//======================================================================

//         _   ____                              _____              _          _  _
//        | | / __ \                            |_   _|            | |        | || |
//        | || |  | | _   _   ___  _ __  _   _    | |   _ __   ___ | |_  __ _ | || |
//    _   | || |  | || | | | / _ \| '__|| | | |   | |  | '_ \ / __|| __|/ _` || || |
//   | |__| || |__| || |_| ||  __/| |   | |_| |  _| |_ | | | |\__ \| |_| (_| || || |
//    \____/  \___\_\ \__,_| \___||_|    \__, | |_____||_| |_||___/ \__|\__,_||_||_|
//                                        __/ |
//                                       |___/
// from  http://erikvold.com/blog/index.cfm/2010/6/14/using-jquery-with-a-user-script


function addJQuery(callback) {
    // create a new <_script> element and insert it into the document.body
    // 'callback'  will be the body of the script

    var fn_scriptInject =
        function() {
            var script;
            script = document.createElement("script");
            script.textContent = "(" + callback.toString() + ")();";
           document.body.appendChild(script);
            
//			$('<script>').text("(" + callback.toString() + ")();").appendTo('<body>')
            
        };
    if (typeof $ !== 'undefined') {
        // jQuery is loaded
 
        // Unload jQuery
        jQuery.noConflict();
            
        // $(fn_scriptInject);
        // $(callback);

    } //else {

        // jQuery is not loaded
        // optional TODO: check jQuery Version
        var script;
        script = document.createElement("script");
        script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js");
    
//      script.addEventListener('load', fn_scriptInject, false);
        script.addEventListener('load', callback, false);

        document.body.appendChild(script);
    //}

}
 //======================================================================