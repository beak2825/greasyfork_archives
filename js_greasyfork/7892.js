// ==UserScript==
// @name        SGW Fixer - old - DEPRECATED
// @namespace   https://greasyfork.org
// @include     https://sellers.shopgoodwill.com/sellers/newAuctionItem-catsel.asp*
// @include     https://sellers.shopgoodwill.com/sellers/reviewItem-label.asp*
// @include     https://sellers.shopgoodwill.com/sellers/reviewItem-label.asp?state=2
// @include     http://localhost/sgw.html
// @version     5.7.0.10
// @description Implements numerous improvements to the functionality of the Shopgoodwill seller site.
// @grant       none
// @require     https://greasyfork.org/scripts/10208-gm-api-script/code/GM%20API%20script.js?version=54964
// @require     https://greasyfork.org/scripts/19381-sgw-shelves-cats/code/SGW%20Shelves%20%20Cats.user.js?version=126258
// @downloadURL https://update.greasyfork.org/scripts/7892/SGW%20Fixer%20-%20old%20-%20DEPRECATED.user.js
// @updateURL https://update.greasyfork.org/scripts/7892/SGW%20Fixer%20-%20old%20-%20DEPRECATED.meta.js
// ==/UserScript==
                 

window.addEventListener ("message", receiveMessage, false);
var url = document.URL;

function receiveMessage (event) {
    var messageJSON;
    try {
        messageJSON = JSON.parse (event.data);
    }
    catch (zError) {
        // Do nothing
    }
    var safeValue = JSON.stringify(messageJSON);
    if (typeof(messageJSON['lastLocation'])!== "undefined") {
      GM_setValue("lastLocation", safeValue);
    } else {
      GM_setValue("storedPresets", safeValue);
    }
}

if (url == "https://sellers.shopgoodwill.com/sellers/reviewItem-label.asp?state=2") {
    var myLastLoc = JSON.parse(GM_getValue("lastLocation", ""));
    if (typeof myLastLoc !== "undefined") {
        $('a:contains("Add")').before("<span id='lastLoc' style='font-size:18px; position:relative; top:-15px;'>Location: " + myLastLoc['lastLocation'] + "</span><br>");
        $('p').first().before("<p id='lastTitle'><b> " + myLastLoc['lastTitle'] + "</b></p>");
      GM_deleteValue("lastLocation");
    }
}




if (GM_getValue("lastLocation")) {
    myLastLoc = JSON.parse(GM_getValue("lastLocation", ""));
//    console.log(url + ": Last location stored as " + myLastLoc['lastLocation']);
//    console.log(url + ": Last title: " +  myLastLoc['lastTitle'])
}

// The name as listed is what the script looks for at the top of the page, as in "Welcome Firstname Lastname". 
//      (Any piece of that is fine: "John L", "John Linnell", and "hn Lin" would all pick out John Linnell)
// "buttonLock" : "yes" causes the shipping buttons to have a lock over them for that user
// "unlockY" : [number] is an optional argument that allows you to set the height of the unlock button (with icon): a larger number makes the
//      button lower on the page

var posters = {
    "Alicia V" : {
        "name" : "Alicia",
        "delay" : 1,
    },
    "Hetal S" : {
        "name" : "Hetal",
        "duration" : 4,
        "delay" : 1,
    },
    "Jacob L" : {
        "name" : "Jacob",
        "skip" : "allow",
        "CM" : "yes",
        "delay" : 0,
        "duration" : 4,
    },
    "Jackie C" : {
        "name" : "Jackie",
        "CM" : "yes",
        "delay" : 0,
        "duration" : 4,
    },
    "Jeff H" : {
        "name" : "Jeff",
        "skip" : "allow",
        "CM" : "BIN",
        "delay" : 0,
    },
    "Jeremy J" : {
        "name" : "Jeremy",
        "skip" : "allow",
        "duration" : 4,
        "CM" : "yes",
        "delay" : 0,
    },
    "Jessica G" : {
        "name" : "Jessica",
        "delay" : 1,
    },
    "Joanne H" : {
        "name" : "Joanne",
        "delay" : 1,
    },
    "Kathy O" : {
        "name" : "Kathy",
        "skip" : "allow",
        "delay" : 0,
        "duration" : 4,
    },
    "Nick Q" : {
        "name" : "Nick",
        "delay" : 0,
    },
    "Phalada X" : {
        "name" : "Phalada",
        "skip" : "allow",
        "CM" : "yes",
        "delay" : 0,
        "duration" : 4,
    },
    "Peter N" : {
        "name" : "Peter",
        "delay" : 1,
    },
    "Phillip S" : {
        "name" : "Phillip",
        "delay" : 0,
    },
    "Poppy P" : {
        "name" : "Poppy",
        "delay" : 1,
    },
    "Tanya K" : {
        "name" : "Tanya",
        "delay" : 0,
    },
    "Thomas L Butler" : {
        "name" : "Tom",
        "delay" : 0,
    },
    "Valerie W" : {
        "name" : "Valerie",
        "duration" : 4,
        "skip" : "allow",
        "CM" : "yes",
        "delay" : 0,
    },
    "Zainab M" : {
        "name" : "Zainab",
        "delay" : 1,
    },
}


var thisPoster = "";
var posterDelay = 0;

$.each(posters, function(name, info) { //working 10/27
    re = new RegExp(name,"gi");
    if(re.exec($(".smtext").html())) {
        thisPoster = name.replace(/ /gi,"");
//        posterDelay = info['delay'];
        console.log(thisPoster);
    }
});


      
var presetTypes = {
      "Store" : "",
      "Shipping Weight" : "",
      "Display Weight" : "",
      "Location" : "",
      "Duration" : "",
      "Ship Charge" : "",
      "Ship Type" : "", 
  //               ^^^   general, guitar, art, lot, long, Media <---- note the capital M!
      "Ship in own box/between cardboard" : "", 
  //                                        ^^^ yes for yes, any other value defaults to no
      "Dimension 1" : "",
      "Dimension 2" : "",
      "Dimension 3" : "",  
      "Skip" : "",
      "Owner" : "",
}

if (GM_getValue("storedPresets")) {
  var presets = JSON.parse (GM_getValue("storedPresets"));
  if (!presets.hasOwnProperty('Owner') || presets['Owner'] != thisPoster) {
       if(presets['Skip'] == 'skip') {
//          console.log('Skip==skip');
          $("head").append("<script id='docready3'>$(document).ready(function() {"
                              + "myURL = document.URL;"
                              + "if (myURL.indexOf('reviewItem') > 0) {"
                                 + "$('input[name=\"submit\"]').trigger('click');"
                              + "}"
                           + "});</script>");
      } else {
      }
      presets = {
          "Store" : "",
          "Shipping Weight" : "",
          "Display Weight" : "",
          "Location" : "",
          "Duration" : "",
          "Ship Charge" : "",
          "Ship Type" : "", 
      //               ^^^   general, guitar, art, lot, long, Media <---- note the capital M!
          "Ship in own box/between cardboard" : "", 
      //                                        ^^^ yes for yes, any other value defaults to no
          "Dimension 1" : "",
          "Dimension 2" : "",
          "Dimension 3" : "",
          "Skip" : "",
          "Owner" : thisPoster,
     };
  } else {
      if (!presets.hasOwnProperty('Duration')) {
          presets['Duration'] = "";

      } else {
      }
      if(presets['Skip'] == 'skip') {
          $("head").append("<script id='docready3'>$(document).ready(function() {"
                              + "myURL = document.URL;"
                              + "if (myURL.indexOf('reviewItem') > 0) {"
                                 + "$('input[name=\"submit\"]').trigger('click');"
                              + "}"
                           + "});</script>");
      } else {
          console.log('Skip!=skip');
      }
  }
} else { 
  var presets = {
      "Store" : "",
      "Shipping Weight" : "",
      "Display Weight" : "",
      "Location" : "",
      "Duration" : "",
      "Ship Charge" : "",
      "Ship Type" : "", 
  //               ^^^   general, guitar, art, lot, long, Media <---- note the capital M!
      "Ship in own box/between cardboard" : "", 
  //                                        ^^^ yes for yes, any other value defaults to no
      "Dimension 1" : "",
      "Dimension 2" : "",
      "Dimension 3" : "",
      "Skip" : "",
      "Owner" : thisPoster,
  };
}

var myPresets = "";

var presetBox = "<div id='presetBox' style='position:relative; left:15px; display:none;'><b style='font-size:22px;'>Set presets:</b><br><br></div><br>";
$('p:contains("photos are uploaded")').after(presetBox);
$.each(presetTypes, function(key, value){
    var myVal = presets[key];
    if (myVal && myVal.length) {
        myPresets += "<div id='presetSpan" + key + "' class='presetSpan' ><b>" + key + ":</b> " + myVal + "<br></div>";
    }

    key2 = "<b>" + key + "</b>"
    if (key == 'Ship Type') {
       key2 += " (general, guitar, art, long, <b><u>M</u></b>edia, pickup)";
    } else if (key == "Ship in own box/between cardboard") {
        key2 = "<b>Own box/cardboard:</b> (yes or blank/no)";
    }
    key2 += ": ";
    $('#presetBox').append("<span id='presetInput" + key + "'>" + key2 + "<input id='preset" + key + "' value=" + myVal + "><br></span>");
});

$('#presetInputOwner').hide();

/*console.log('-----------------> crap in a hat!');
  console.log('-----------------> crap in a hat!');
  console.log('-----------------> crap in a hat!');*/


if (myPresets.length) {
    myPresets = "<div id='myPresets' style='width:300px; border: 3px solid red; background-color:#FFFF11; padding:25px;'><b style='font-size:24px;'>Presets:</b><br>" + myPresets + "</div><br>";
    $('#presetBox').before(myPresets);
    $('#myPresets').data("data", presets);
}

if(myPresets['Ship Type'] == "media") {
    myPresets['Ship Type'] = "Media";
}


$('#presetBox').append("<br><span id='updatePresetsButton' style='border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 3px;' onclick='javascript:updatePresets();$(\"#presetBox\").hide();$(\"#presetBoxButton\").show();'><b>Update presets</b></span>");
$('#presetBox').after("<br><span id='presetBoxButton' style='border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 3px;' onclick='javascript:$(\"#presetBox\").show();$(\"#presetBoxButton\").hide(); addShelves();'><b>Edit presets</b></span>");

$('#presetLocation').attr('id', 'tempLoc');

$('#tempLoc').after("<select id='presetLocation'></select>");
$('#tempLoc').remove();

$('#presetLocation').append("<option value=''>&nbsp;</option>");
$.each(jsondata2, function(shelfIndex, shelfArray){
    $('#presetLocation').append("<option value='" + shelfArray['value'] + "'>" + shelfArray['name'] + "</option>");
});


//var shelves=["", "01-01","01-02","01-03","01-04","01-05","01-06","01-07","01-08","01-09","01-10","02-01","02-02","02-03","02-04","02-05","02-06","02-07","02-08","02-09","02-10","02-11","02-12","02-13","02-14","02-15","03-01","03-02","03-03","03-04","03-05","03-06","03-07","03-08","03-09","03-10","03-11","03-12","03-13","03-14","03-15","04-01","04-02","04-03","04-04","04-05","04-06","04-07","04-08","04-09","04-10","04-11","04-12","04-13","04-14","04-15","05-01","05-02","05-03","05-04","05-05","05-06","05-07","05-08","05-09","05-10","05-11","05-12","05-13","05-14","06-01","06-02","06-03","06-04","06-05","06-06","06-07","06-08","06-09","06-10","06-11","06-12","06-13","06-14","06-15","06-16","06-17","06-18","06-19","06-20","06-21","06-22","06-23","06-24","06-25","07-01","07-02","07-03","07-04","07-05","07-06","07-07","07-08","07-09","07-10","07-11","07-12","07-13","07-14","07-15","07-16","07-17","07-18","07-19","07-20","07-21","07-22","07-23","07-24","07-25","08-01","08-02","08-03","08-04","08-05","08-06","08-07","08-08","08-09","08-10","08-11","08-12","08-13","08-14","08-15","08-16","08-17","08-18","08-19","08-20","08-21","08-22","08-23","08-24","08-25","09-01","09-02","09-03","09-04","09-05","09-06","09-07","09-08","09-09","09-10","09-11","09-12","09-13","09-14","09-15","09-16","09-17","09-18","09-19","09-20","09-21","09-22","09-23","09-24","09-25","10-01","10-02","10-03","10-04","10-05","10-06","10-07","10-08","10-09","10-10","10-11","10-12","10-13","10-14","10-15","10-16","10-17","10-18","10-19","10-20","10-21","10-22","10-23","10-24","10-25","11-01","11-02","11-03","11-04","11-05","11-06","11-07","11-08","11-09","11-10","11-11","11-12","11-13","11-14","11-15","11-16","11-17","11-18","11-19","11-20","11-21","11-22","11-23","11-24","11-25","12-01","12-02","12-03","12-04","12-05","12-06","12-07","12-08","12-09","12-10","12-11","12-12","12-13","12-14","12-15","12-16","12-17","12-18","12-19","12-20","12-21","12-22","12-23","12-24","12-25","13-01","13-02","13-03","13-04","13-05","13-06","13-07","13-08","13-09","13-10","13-11","13-12","13-13","13-14","13-15","13-16","13-17","13-18","13-19","13-20","13-21","13-22","13-23","13-24","13-25","14-01","14-02","14-03","14-04","14-05","14-06","14-07","14-08","14-09","14-10","14-11","14-12","14-13","14-14","14-15","14-16","14-17","14-18","14-19","14-20","14-21","14-22","14-23","14-24","14-25","15-01","15-02","15-03","15-04","15-05","15-06","15-07","15-08","15-09","15-10","15-11","15-12","15-13","15-14","15-15","15-16","15-17","15-18","15-19","15-20","15-21","15-22","15-23","15-24","15-25","16-01","16-02","16-03","16-04","16-05","16-06","16-07","16-08","16-09","16-10","16-11","16-12","16-13","16-14","16-15","16-16","16-17","16-18","16-19","16-20","16-21","16-22","16-23","16-24","16-25","16-26","16-27","16-28","16-29","16-30","17-01","17-02","17-03","17-04","17-05","17-06","17-07","17-08","17-09","17-10","17-11","17-12","17-13","17-14","17-15","17-16","17-17","17-18","17-19","17-20","17-21","17-22","17-23","17-24","17-25","17-26","17-27","17-28","17-29","17-30","18-01","18-02","18-03","18-04","18-05","18-06","18-07","18-08","18-09","18-10","18-11","18-12","18-13","18-14","18-15","18-16","18-17","18-18","18-19","18-20","18-21","18-22","18-23","18-24","18-25","19-01","19-02","19-03","19-04","19-05","19-06","19-07","19-08","19-09","19-10","19-11","19-12","19-13","19-14","19-15","19-16","19-17","19-18","19-19","19-20","19-21","19-22","19-23","19-24","19-25","20-01","20-02","20-03","20-04","20-05","20-06","20-07","20-08","20-09","20-10","20-11","20-12","20-13","20-14","20-15","20-16","20-17","20-18","20-19","20-20","20-21","20-22","20-23","20-24","20-25","21-01","21-02","21-03","21-04","21-05","21-06","21-07","21-08","21-09","21-10","21-11","21-12","21-13","21-14","21-15","21-16","21-17","21-18","21-19","21-20","21-21","21-22","21-23","21-24","21-25","22-01","22-02","22-03","22-04","22-05","22-06","22-07","22-08","22-09","22-10","22-11","22-12","22-13","22-14","22-15","22-16","22-17","22-18","22-19","22-20","22-21","22-22","22-23","22-24","22-25","22-26","22-27","22-28","23-01","23-02","23-03","23-04","23-05","23-06","23-07","23-08","23-09","23-10","23-11","23-12","23-13","23-14","23-15","23-16","23-17","23-18","23-19","23-20","23-21","23-22","23-23","23-24","23-25","23-26","23-27","23-28","24-01","24-02","24-03","24-04","24-05","24-06","24-07","24-08","24-09","24-10","24-11","24-12","24-13","24-14","24-15","24-16","24-17","24-18","24-19","24-20","24-21","24-22","24-23","24-24","24-25","24-26","24-27","24-28","25-01","25-02","25-03","25-04","25-05","25-06","25-07","25-08","25-09","25-10","25-11","25-12","25-13","25-14","25-15","25-16","25-17","25-18","25-19","25-20","25-21","25-22","25-23","25-24","25-25","25-26","25-27","25-28","26-01","26-02","26-03","26-04","26-05","26-06","26-07","26-08","26-09","26-10","26-11","26-12","26-13","26-14","26-15","26-16","26-17","26-18","26-19","26-20","26-21","26-22","26-23","26-24","26-25","26-26","26-27","26-28","27-01","27-02","27-03","27-04","27-05","27-06","27-07","27-08","27-09","27-10","27-11","27-12","27-13","27-14","27-15","27-16","27-17","27-18","27-19","27-20","27-21","27-22","27-23","27-24","27-25","27-26","27-27","27-28","28-01","28-02","28-03","28-04","28-05","28-06","28-07","28-08","28-09","28-10","28-11","28-12","28-13","28-14","28-15","28-16","28-17","28-18","28-19","28-20","28-21","28-22","28-23","28-24","28-25","28-26","28-27","28-28","29-01","29-02","29-03","29-04","29-05","29-06","29-07","29-08","29-09","29-10","29-11","29-12","29-13","29-14","29-15","29-16","29-17","29-18","29-19","29-20","29-21","29-22","29-23","29-24","29-25","29-26","29-27","29-28","A-01","A-02","A-03","AA-01","AA-02","AA-03","AA-04","AA-05","AA-06","AA-07","AA-08","AA-09","AA-10","AA-11","AA-12","AA-13","AA-14","AA-15","AA-16","AA-17","AA-18","AA-19","AA-20","AA-21","AA-22","AA-23","AA-24","AA-25","Art1- Top","Art1-Bottom","Art2- Top","Art2-Bottom","Art3- Top","Art3-Bottom","ARTBLUE-BOTTOM","ARTBLUE-TOP","ARTSILVER-BOTTOM","ARTSILVER-TOP","B-01","B-02","B-03","BB-01","BB-02","BB-03","BB-04","BB-05","BB-06","BB-07","BB-08","BB-09","BB-10","BB-11","BB-12","BB-13","BB-14","BB-15","BB-16","BB-17","BB-18","BB-19","BB-20","BB-21","BB-22","BB-23","BB-24","BB-25","C","CC-01","CC-02","CC-03","CC-04","CC-05","CC-06","CC-07","CC-08","CC-09","CC-10","CC-11","CC-12","CC-13","CC-14","CC-15","CC-16","CC-17","CC-18","CC-19","CC-20","CC-21","CC-22","CC-23","CC-24","CC-25","CC-26","CC-27","CC-28","CC-29","CC-30","D","DD-01","DD-02","DD-03","DD-04","DD-05","DD-06","DD-07","DD-08","DD-09","DD-10","DD-11","DD-12","DD-13","DD-14","DD-15","DD-16","DD-17","DD-18","DD-19","DD-20","DD-21","DD-22","DD-23","DD-24","DD-25","DD-26","DD-27","DD-28","DD-29","DD-30","E","EE-01","EE-02","EE-03","EE-04","EE-05","EE-06","EE-07","EE-08","EE-09","EE-10","EE-11","EE-12","EE-13","EE-14","EE-15","EE-16","EE-17","EE-18","EE-19","EE-20","EE-21","EE-22","EE-23","EE-24","EE-25","EE-26","EE-27","EE-28","EE-29","EE-30","F","FF-01","FF-02","FF-03","FF-04","FF-05","FF-06","FF-07","FF-08","FF-09","FF-10","FF-11","FF-12","FF-13","FF-14","FF-15","FF-16","FF-17","FF-18","FF-19","FF-20","FF-21","FF-22","FF-23","FF-24","FF-25","FF-26","FF-27","FF-28","FF-29","FF-30","Floor1","G-01","G-02","G-03","G-04","GG-01","GG-02","GG-03","GG-04","GG-05","GG-06","GG-07","GG-08","GG-09","GG-10","GG-11","GG-12","GG-13","GG-14","GG-15","H-01","H-02","H-03","H-04","HH-01","HH-02","HH-03","HH-04","HH-05","HH-06","HH-07","HH-08","HH-09","HH-10","HH-11","HH-12","HH-13","HH-14","HH-15","HOLD-01","HOLD-02","HOLD-03","HOLD-04","HOLD-05","HOLD-06","HOLD-07","HOLD-08","HOLD-09","HOLD-10","HOLD-11","Hold-Floor","Hold_A-H","Hold_I-P","Hold_Q-Z","I-01","I-02","I-03","I-04","II-01","II-02","II-03","II-04","II-05","II-06","II-07","II-08","II-09","II-10","II-11","II-12","II-13","II-14","II-15","J-01","J-02","J-03","J-04","J01-01","J01-02","J01-03","J01-04","J01-05","J01-06","J01-07","J01-08","J01-09","J01-10","J01-11","J01-12","J01-13","J01-14","J01-15","J01-16","J01-17","J01-18","J01-19","J01-20","J01-21","J01-22","J01-23","J01-24","J01-25","J01-26","J01-27","J01-28","J01-29","J01-30","J02-01","J02-02","J02-03","J02-04","J02-05","J02-06","J02-07","J02-08","J02-09","J02-10","J02-11","J02-12","J02-13","J02-14","J02-15","J02-16","J02-17","J02-18","J02-19","J02-20","J02-21","J02-22","J02-23","J02-24","J02-25","J02-26","J02-27","J02-28","J02-29","J02-30","J03-01","J03-02","J03-03","J03-04","J03-05","J03-06","J03-07","J03-08","J03-09","J03-10","J03-11","J03-12","J03-13","J03-14","J03-15","J03-16","J03-17","J03-18","J03-19","J03-20","J03-21","J03-22","J03-23","J03-24","J03-25","J03-26","J03-27","J03-28","J03-29","J03-30","J04-01","J04-02","J04-03","J04-04","J04-05","J04-06","J04-07","J04-08","J04-09","J04-10","J04-11","J04-12","J04-13","J04-14","J04-15","J04-16","J04-17","J04-18","J04-19","J04-20","J04-21","J04-22","J04-23","J04-24","J04-25","J04-26","J04-27","J04-28","J04-29","J04-30","Jewelry","JJ-1","JJ-10","JJ-11","JJ-12","JJ-13","JJ-14","JJ-15","JJ-2","JJ-3","JJ-4","JJ-5","JJ-6","JJ-7","JJ-8","JJ-9","K-01","K-02","K-03","K-04","KK-1","KK-10","KK-2","KK-3","KK-4","KK-5","KK-6","KK-7","KK-8","KK-9","L-01","L-02","L-03","L-04","L-05","LL-1","LL-10","LL-2","LL-3","LL-4","LL-5","LL-6","LL-7","LL-8","LL-9","M-01","M-02","M-03","M-04","M-05","MM-01","MM-02","MM-03","MM-04","MM-05","MM-06","MM-07","MM-08","MM-09","MM-10","MM-11","MM-12","MM-13","MM-14","MM-15","MM-16","MM-17","MM-18","MM-19","MM-20","MM-21","MM-22","MM-23","MM-24","MM-25","N-01","N-02","N-03","N-04","N-05","NN-01","NN-02","NN-03","NN-04","NN-05","NN-06","NN-07","NN-08","NN-09","NN-10","NN-11","NN-12","NN-13","NN-14","NN-15","NN-16","NN-17","NN-18","NN-19","NN-20","NN-21","NN-22","NN-23","NN-24","NN-25","O-1","O-2","O-3","O-4","O-5","OO-01","OO-02","OO-03","OO-04","OO-05","OO-06","OO-07","OO-08","OO-09","OO-10","OO-11","OO-12","OO-13","OO-14","OO-15","OO-16","OO-17","OO-18","OO-19","OO-20","OO-21","OO-22","OO-23","OO-24","OO-25","P-1","P-2","P-3","P-4","P-5","PP-01","PP-02","PP-03","PP-04","PP-05","PP-06","PP-07","PP-08","PP-09","PP-10","PP-11","PP-12","PP-13","PP-14","PP-15","PP-16","PP-17","PP-18","PP-19","PP-20","PP-21","PP-22","PP-23","PP-24","PP-25","Q-1","Q-2","Q-3","Q-4","Q-5","QQ-01","QQ-02","QQ-03","QQ-04","QQ-05","QQ-06","QQ-07","QQ-08","QQ-09","QQ-10","QQ-11","QQ-12","QQ-13","QQ-14","QQ-15","QQ-16","QQ-17","QQ-18","QQ-19","QQ-20","QQ-21","QQ-22","QQ-23","QQ-24","QQ-25","R-1","R-2","R-3","R-4","R-5","Rack1","Rack1-A","Rack1-B","Rack2-A","Rack2-B","Rack3-A","Rack3-B","Rack4-A","Rack4-B","RR-01","RR-02","RR-03","RR-04","RR-05","RR-06","RR-07","RR-08","RR-09","RR-10","RR-11","RR-12","RR-13","RR-14","RR-15","RR-16","RR-17","RR-18","RR-19","RR-20","RR-21","RR-22","RR-23","RR-24","RR-25","Rugs","Safe","SS-01","SS-02","SS-03","SS-04","SS-05","SS-06","SS-07","SS-08","SS-09","SS-10","SS-11","SS-12","SS-13","SS-14","SS-15","SS-16","SS-17","SS-18","SS-19","SS-20","SS-21","SS-22","SS-23","SS-24","SS-25","TT-01","TT-02","TT-03","TT-04","TT-05","TT-06","TT-07","TT-08","TT-09","TT-10","TT-11","TT-12","TT-13","TT-14","TT-15","TT-16","TT-17","TT-18","TT-19","TT-20","TT-21","TT-22","TT-23","TT-24","TT-25","UU-01","UU-02","UU-03","UU-04","UU-05","UU-06","UU-07","UU-08","UU-09","UU-10","UU-11","UU-12","UU-13","UU-14","UU-15","UU-16","UU-17","UU-18","UU-19","UU-20","UU-21","UU-22","UU-23","UU-24","UU-25","VV-01","VV-02","VV-03","VV-04","VV-05","VV-06","VV-07","VV-08","VV-09","VV-10","VV-11","VV-12","VV-13","VV-14","VV-15","VV-16","VV-17","VV-18","VV-19","VV-20","VV-21","VV-22","VV-23","VV-24","VV-25","WW-01","WW-02","WW-03","WW-04","WW-05","WW-06","WW-07","WW-08","WW-09","WW-10","WW-11","WW-12","WW-13","WW-14","WW-15","WW-16","WW-17","WW-18","WW-19","WW-20","WW-21","WW-22","WW-23","WW-24","WW-25","XX-01","XX-02","XX-03","XX-04","XX-05","XX-06","XX-07","XX-08","XX-09","XX-10","XX-11","XX-12","XX-13","XX-14","XX-15","XX-16","XX-17","XX-18","XX-19","XX-20","XX-21","XX-22","XX-23","XX-24","XX-25"];
//$.each(shelves, function(key, val){
//    $('#presetLocation').append("<option value='" + val + "'>" + val + "</option>");
//});


$('#presetStore').attr('id', 'tempStore');
$('#tempStore').after($('#itemsellerstore').clone().attr('id', 'presetStore'));
$('#tempStore').remove();
$('#presetStore').prepend("<option val=''></option>");


if(url == "https://sellers.shopgoodwill.com/sellers/newAuctionItem-catsel.asp?clear=yes") {
    // Hides form if photos are not uploaded
       // the return URL from the photo uploader is:
       // https://sellers.shopgoodwill.com/sellers/newauctionitem-catsel.asp?btnSubmit=Return+to+item+entry
    $('#form1').hide(); //hide form1
} else {
    $('#presetBoxButton').parent().append("<p>Gallery: <input type='checkbox' id='galleryCB2' onclick='$(\"#itemGallery\").trigger(\"click\");'></p>");
}

$("#form1").append("<script id='jqueryui' src='https://code.jquery.com/ui/1.11.4/jquery-ui.js'></script>");
$("#form1").append("<div id='combineCheck' style='display:none;'>false</div>");
var upsDivisor = 225;

// These are editable! Format is as follows:
//
// "Button name" : price,
//
// Important notes:
// 1. Name MUST be in quotation marks.
// 2. A comma MUST follow the price, 

var shippingMethods = {
    "Sm flat rate box" : {
        "price" : 6.80,
        "note" : "Small flat rate box",
        "method" : "USPS",
        "tooltip" : "Interior dimensions: 5x8.5x1.5 - NOTE: remember room for packing material!",
    },
    "Bubble mailer" : {
        "price" : 6.80,
        "note" : "Bubble mailer",
        "tooltip" : "Bubble mailers are padded, but consider if your item needs extra padding as well.",
        "method" : "USPS"
    },
    "Med flat rate box" : {
        "price" : 13.00,
        "note" : "Medium flat rate box",
        "method" : "USPS",
        "tooltip" : "Interior dimensions: 12x13.5x3.5 OR 11x8.5x5.5 - NOTE: remember room for packing material!"
    },
    "Media" : {
        "note" : "Media",
        "tooltip" : "Any: book; movie (VHS, DVD, Blu-Ray, laserdisc, film reel); music (record, 8-track, tape, CD) - regardless of size or weight. NOT comic books, magazines, newspapers, or video games.",
        "method" : "USPS"
    },
    "Lt clothing" : {
        "price" : 4.99,
        "note" : "Poly-mailer",
        "tooltip" : "Poly-mailer. Use if a clothing item is light - like a t-shirt.",
        "method" : "USPS"
    },
    "Med clothing" : {
        "price" : 6.99,
        "note" : "Poly-mailer",
        "tooltip" : "Poly-mailer. Use if a clothing item is a bit heavier - like a pair of jeans.",
        "method" : "USPS"
    },
    "Sm guitar box" : {
        "note" : "6x18x44 guitar box",
        "tooltip" : "Interior dimensions: 6x18x44; shipping weight: " + Math.ceil((7*19*45)/upsDivisor),
        "weight" : Math.ceil((7*19*45)/upsDivisor),
        "method" : "UPS"
    },
    "Lg guitar box" : {
        "note" : "8x20x50 guitar box",
        "tooltip" : "Interior dimensions: 8x20x50; shipping weight: " + Math.ceil((9*21*51)/upsDivisor),
        "weight" : Math.ceil((9*21*51)/upsDivisor),
        "method" : "UPS"
    },
    "Sm print box" : {
        "note" : "5x24x30 print box",
        "tooltip" : "Interior dimensions: 5x24x30; shipping weight: " + Math.ceil((6*24*31)/upsDivisor),
        "weight" : Math.ceil((6*24*31)/upsDivisor),
        "method" : "UPS"
    },
    "Lg print box" : {
        "note" : "5x30x36 print box",
        "tooltip" : "Interior dimensions: 5x30x36; shipping weight: " + Math.ceil((6*31*37)/upsDivisor),
        "weight" : Math.ceil((6*31*37)/upsDivisor),
        "method" : "UPS"
    },
/*    "Huge print box" : {
        "note" : "5.5x36x48 print box",
        "tooltip" : "Interior dimensions: 5.5x36x48; shipping weight: " + Math.ceil((7*37*49)/upsDivisor),
        "weight" : Math.ceil((7*37*49)/upsDivisor),
        "method" : "UPS"
    },*/
/*    "8x8 long box" : {
        "note" : "8x8 long box",
        "tooltip" : "Interior dimensions: 8x8x?",
        "method" : "UPS"
    },
    "12x12 long box" : {
        "note" : "12x12 long box",
        "tooltip" : "Interior dimensions: 8x8x?",
        "method" : "UPS"
    },*/
    "Sm coat box" : {
        "note" : "9x12x12 coat box",
        "tooltip" : "Interior dimensions: 9x12x12; shipping weight: " + Math.ceil((10*13*13)/upsDivisor),
        "weight" : Math.ceil((10*13*13)/upsDivisor),
        "method" : "UPS"
    },
    "Med coat box" : {
        "note" : "6x14x18 coat box",
        "tooltip" : "Interior dimensions: 6x14x18; shipping weight: " + Math.ceil((7*15*19)/upsDivisor),
        "weight" : Math.ceil((7*15*19)/upsDivisor),
        "method" : "UPS"
    },
    "Very lg coat box" : {
        "note" : "10x14x18 coat box",
        "tooltip" : "Interior dimensions: 10x14x18; shipping weight: " + Math.ceil((11*15*19)/upsDivisor),
        "weight" : Math.ceil((11*15*19)/upsDivisor),
        "method" : "UPS"
    },
    "Standard sm UPS box" : {
       "note" : "6.25x7.25x10.25 small box",
       "tooltip" : "Interior dimensions: 6.25x7.25x10.25; shipping weight: " + Math.ceil((7*8*11)/upsDivisor),
       "weight" : Math.ceil((7*8*11)/upsDivisor),
       "method" : "UPS",
    },
    "1-2 games/few cards" : {
       "price" : 2.99,
       "note" : "Game/cards",
       "tooltip" : "One or two small games (or several Gameboy games), or a small stack of cards",
       "method" : "USPS",
    },
/*    "Sew mchn w/case" : {
       "note" : "20x14x18 box",
       "tooltip" : "Interior dimensions: 14x18x20; shipping weight: " + Math.ceil((15*19*21)/upsDivisor),
       "weight" : Math.ceil((15*19*21)/upsDivisor),
       "method" : "UPS",
    },
    "Sew mchn, no case" : {
       "note" : "10x14x18 box",
       "tooltip" : "Interior dimensions: 10x14x18; shipping weight: " + Math.ceil((11*15*19)/upsDivisor),
       "weight" : Math.ceil((11*15*19)/upsDivisor),
       "method" : "UPS",
    }*/
};

var minimumWeight = 3; // This is the minimum weight we'll charge.


// This next section sets up our default boxes.

// It's CRITICALLY IMPORTANT that the dimensions for these boxes get listed in ascending order (e.g. 8, 17, 36).

// "Interior" is the interior dimensions of the box - how large an item can fit inside. "Exterior" is the set of dimensions used to calculate the weight.
// The reason that these are defined separately is so that we can require a varying amount of padding per dimension and per box.

var guitarBoxes = {
	"default" : {
		0 : 8,
		1 : 17,
		2 : 36
		/* The interior/exterior doesn't matter here: the default "box" is used to decide "this doesn't need to go in a special box, and should be treated like a regular item". */
	},
	"boxes" : {
		1 : {
			"interior" : {
				0 : 6,
				1 : 17,
				2 : 42,
			},
			"exterior" : {
				0 : 7,
				1 : 19,
				2 : 45
			},
			"name" : "Small guitar box",
      "corresponds" : "Sm guitar box"
		},
		2 : {
			"interior" : {
				0 : 8,
				1 : 20,
				2 : 48
			},
			"exterior" : {
				0 : 9,
				1 : 21,
				2 : 51
			},
			"name" : "Large guitar box",
      "corresponds" : "Lg guitar box"
		}
	}
};

var artBoxes = {
	"default" : {
		0 : 6,
		1 : 18,
		2 : 20
	},
	"boxes" : {
		1 : {
			"interior" : {
				0 : 3,
				1 : 20,
				2 : 20
			},
			"exterior" : {
				0 : 6,
				1 : 25,
				2 : 25
			}
		},
		2 : {
			"interior" : {
				0 : 3,
				1 : 20,
				2 : 26
			},
			"exterior" : {
				0 : 6,
				1 : 25,
				2 : 31
			},
			"name" : "Small print box",
      "corresponds" : "Sm print box"
		},
		3 : {
			"interior" : {
				0 : 3,
				1 : 26,
				2 : 32
			},
			"exterior" : {
				0 : 6,
				1 : 31,
				2 : 37
			},
			"name" : "Large print box",
      "corresponds" : "Lg print box"
		},
/*    4 : {
			"interior" : {
				0 : 3.5,
				1 : 36,
				2 : 48
			},
			"exterior" : {
				0 : 7,
				1 : 37,
				2 : 49
			},
			"name" : "Huge print box",
      "corresponds" : "Huge print box"
		},*/
	}
};

var uspsBoxes = {
	"smallFlat1" : {
	/* Because these are billed at a flat rate, they also don't need two separate sets of dimensions. All we need to know is if the item will fit. */
		0 : 1.25,
		1 : 4.75,
		2 : 8.25,
		"name" : "small ($6.80) flat rate box",
    "corresponds" : "Sm flat rate box"
	},
	"medFlat1" : {
		0 : 3.25,
		1 : 11.75,
		2 : 13.25,
		"name" : "medium ($13.00) flat rate box",
    "corresponds" : "Med flat rate box"
	},
	"medFlat2" : {
		0 : 5.25,
		1 : 8.25,
		2 : 10.75,
		"name" : "medium ($13.00) flat rate box",
    "corresponds" : "Med flat rate box"
	},
}



// Okay, please don't mess with anything below here, though, if you aren't up on your javascript.
// If you ARE up on your javascript... please don't judge. I learned as I went and vice-versa. >.>

var button1 = "<span style='border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 3px;'";
var button2 = "</span>&nbsp;";
             
if ($('input[name="authentic"]').length) {
    $('input[name="authentic"]').attr('checked', true);
}


$("body").prepend("<div id='upsDivisor' style='display:none;'>" + upsDivisor + "</div>");
var shippingOptions = "";
var buttonCount = 0;
$.each( shippingMethods, function( key, value ) {
       shippingOptions = shippingOptions + "<div name='" + key + "' style='border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 3px; width: auto; float: left; margin: 2px;' id='" + key + "' class='shipCharge shipType'>" + key + "</div>";
       if (key == 'Med clothing' || key == 'Med coat box') {
           shippingOptions = shippingOptions + "<br><br>";
       }
       buttonCount++;
}); 
             
$('.shipType').css('font-size','4');
$("b:contains('Shipping Charge')").before("<div id='shippingOptions' style='position:relative; bottom:20px;font-size:14px'></div>");

$('#shippingOptions').after("<br><br>");

$("body").prepend("<div id='boxDefinitions' style='display:none;'></div>");
$("#boxDefinitions").data(shippingMethods);


//$('input[name="itemNoCombineShipping"]').attr('checked', true);
$('input[name="itemAutoInsurance"]').attr( "disabled", false );
if ($('font:contains(\"Uploading images\")').length) {
    $('input[name="itemAutoInsurance"]').before('<div style="position:relative;"><div style="position: absolute;top:0;left:0;width: 200px;height:40px;background-color: blue;z-index:99;opacity:0;filter: alpha(opacity = 50)"></div></div>');
    $('input[name="itemShippingPrice"]').before('<div id="shipPriceLock" style="position:relative;"><div style="position: absolute;top:0;left:0;width: 90px;height:22px;background-color: gray;z-index:99;opacity:0.2;filter: alpha(opacity = 50)"></div></div>');
    $('#itemShipMethod').before('<div id="shipMethodLock" style="position:relative;"><div style="position: absolute;top:0;left:0;width: 100px;height:22px;background-color: gray;z-index:99;opacity:0.2;filter: alpha(opacity = 50)"></div></div>');
    $('#itemShipMethod').after("<br><br>" + button1 + "<span onclick=\"$('#shipMethodLock').remove();\" style='position:relative; left: 50px; margin:10px;'>Unlock shipping method</span>" + button2 + "<br>");
}
var currentDur = $('select[name=\"itemDuration\"]').val();
             
var cmAllow = "no";
var cmBIN = "no";
$('select[name=\"itemDuration\"]').replaceWith("<input name='itemDuration' id='itemDuration' value='" + currentDur + "' min='0' max='15'>");




    $("select[name=itemStartOffset]").attr('tabindex', "-1");
		$("select[name=itemstarttime]").attr('tabindex', "-1");
		$("select[name=itemDuration]").attr('tabindex', "-1");
		$("select[name=itemEndTime]").attr('tabindex', "-1");
		$("#itemShipMethod").attr('tabindex', "-1");
    $('input[name="itemShippingPrice"]').attr('tabindex', "-1");
    $('input[name="itemNoCombineShipping"]').attr('tabindex', "-1");
    $("#itemAutoInsurance").attr('tabindex', "-1");

// Something is broken: having the above lines where they were (toward the bottom), they suddenly stopped working when the counter was fixed - moving them up caused them to work again... IDFK

$("#WebWizRTE, #itemDescription").height(700);
$("#WebWizRTE, #itemDescription").width(810);
re = new RegExp("(ry Sn)","gi");
if(re.exec($(".smtext").html())) {
    $("#itemDescription").width(800);
}
$("#s1").attr("size", 100);



$("strong:contains('Item Title')").prepend("<script type=text/javascript>function capsButton(){ var myText = $('input[name=itemTitle]').val(); var small = ['the', 'by', 'iPod', 'iPad', 'iMac', 'iTunes', 'w/', 'ft', 'in', 'at', 'or', 'lb', 'lbs']; var titleCase = function(str, glue){ glue = (glue) ? glue : ['of', 'for', 'and']; return str.replace(/(\w)(\w*)/g, function(_, i, r){ var j = i.toUpperCase() + (r != null ? r : ''); return (glue.indexOf(j.toLowerCase())<0)?j:j.toLowerCase(); }); }; var myNewTitle = titleCase(myText, small); var myNewTitle = myNewTitle.replace('•	', '');  $('input[name=itemTitle]').val(myNewTitle); $('input[name=itemTitle]').val(); }</script>");    
$("strong:contains('Item Title')").prepend("<br>");
$("input[name=itemTitle]").attr("maxlength",50);
$("input[name=itemTitle]").attr("onkeyup", "javascript: var length=$('input[name=itemTitle]').val().length,remaining=50-length;$('#myCounter').html(remaining);");
$("input[name=itemTitle]").attr("onkeypress", "");
$("#myCounter").html("50");
//$("input[name=itemTitle]").after("&nbsp;<span style='border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 3px;' onclick='javascript:$(\"input[name=itemTitle]\").css(\"text-transform\", \"capitalize\");'>Capitalize</span><br>");
//$("input[name=itemTitle]").after("&nbsp;<span style='border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 3px;' onclick='capsButton();'>Capitalize</span><br>");   



$('font:contains("Numbers and decimal point")').after("<br><br>" + button1 + "<span onclick=\"$('#shipPriceLock').remove();\" style='position:relative; left: 50px; margin:10px;'>Unlock shipping charge</span>" + button2 + "<br>");

$('strong:contains("Private Description")').hide();
$('#itemSellerInfo').hide();

$('p:contains("optimization")').hide();

shippingOptions = shippingOptions + "<br><br>" + button1 + "class='shipType' id='UPS'><b>UPS</b>" + button2;
shippingOptions = shippingOptions + "" + button1 + "class='shipType' id='pickupOnly' name='pickupOnly'><b>Pickup Only</b>" + button2;

$("#shippingOptions").html(shippingOptions);



//    var html = document.getElementById('form1').children[0].children[0].children[1].children[1];
//    var html2 = document.getElementById('form1').children[2].children[0].children[0].children[0];

    var html = $('#form1 > table > tbody > tr:eq(1) > td:eq(1)')[0];
    var html2 = $('#form1 > table:eq(1) > tbody > tr > td')[0];

    



    html2.innerHTML = html2.innerHTML.replace(/You will be advised[\s\S]*place your listing[\s\S]*will be assessed[\s\S]*in the next screen\./g,"");
    $("p:contains('Make sure you know')").hide();
    $("p:contains('Please review the')").hide();
    $("p:contains('read shopgoodwill')").hide();

    $("hr").hide();
    

    $('p:contains("Starting Bid")').addClass("bidStartDurBox");
    $('p:contains("Auction Duration")').addClass("bidStartDurBox").after("<br><br>");
    $('p:contains("Auction Duration")').after("<span style='border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 2px; font-size:12px;' id='bidStartDurBoxButton' onclick='javascript:$(\".bidStartDurBox\").show().after();$(\"#bidStartDurBoxButton\").hide();'>Starting bid, start time, duration</span><br>")
    $('#bidStartDurBoxButton').after("<span style='border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 2px; font-size:12px;' id='BINBoxShowButton' onclick='javascript:binButton();'>Buy now price</span>");
    $('.bidStartDurBox').hide();

    $('select[name="itemStartOffset"]').attr("id", "itemStartOffset");
    $('select[name="itemstarttime"]').attr("id", "itemstarttime");
    $('input[name="itemDuration"]').attr("id", "itemDuration");








// Cyber Monday buttons
/*
    now = new Date();
    currentDate = now.getDate();
    cyberMondayStart = 20;
    daysTillCMStart = cyberMondayStart - currentDate;
    cyberMonday = 30;
    daysTillCM = cyberMonday - currentDate;
    if (cmAllow == "yes") {
        $('#BINBoxShowButton').after("<br><br><span style='border: 1px solid #CCCCCC; background-color:#ffbf80; padding: 5px; font-size:14px;' id='cyberMondayDurButton' onclick='javascript:$(\"#itemDuration\").val(" + daysTillCM + "); $(\".bidStartDurBox\").show(); $(\"#bidStartDurBoxButton\").hide();'>Cyber Monday</span>");
        if (daysTillCMStart > 0) {
///            $('#cyberMondayDurButton').after("&nbsp;<span style='border: 1px solid #CCCCCC; background-color:#ffbf80; padding: 5px; font-size:14px;' id='cyberMondayDelayedButton' onclick='javascript:$(\"#itemStartOffset\").val(" + daysTillCMStart + "); $(\"#itemstarttime\").val(\"6:00\"); $(\"#itemDuration\").val(10); $(\".bidStartDurBox\").show(); $(\"#bidStartDurBoxButton\").hide();'>Cyber Monday (pre-post)</span>");
        }
        if (cmBIN == "yes") {
            $('#cyberMondayDurButton').after("&nbsp;<span style='border: 1px solid #CCCCCC; background-color:#ffb3b3; padding: 5px; font-size:14px;' id='cyberMondayBINButton' onclick='javascript:$(\"#itemStartOffset\").val(" + daysTillCM + "); $(\"#itemstarttime\").val(\"6:00\"); $(\"#itemDuration\").val(7); $(\".bidStartDurBox\").show(); $(\"#bidStartDurBoxButton\").hide(); binButton();'>Cyber Monday BIN</span>");
        }
    }
*/



    html.innerHTML = html.innerHTML.replace("onblur", "alt");
    html.innerHTML = html.innerHTML.replace(/<hr align="center" noshade="" width="350">/g,"");
    html.innerHTML = html.innerHTML.replace(/pounds((.|\n)*)oversized packages\./g,"");
    html.innerHTML = html.innerHTML.replace(/Shipping Charge allows((.|\n)*)United States\./g,"");
    $('b:contains("Set the Shipping Charge")').hide();
    html.innerHTML = html.innerHTML.replace(/to use the default shipper's rate calculator\./g,"");
    html.innerHTML = html.innerHTML.replace(/This is the number((.|\n)*)become active\./g,"");
    html.innerHTML = html.innerHTML.replace(/This is the number((.|\n)*)will end\./g,"");
    $('font:contains("UPS dimensional weight calculator click")').hide();
    html.innerHTML = html.innerHTML.replace(/Select this option to change the shipping method from your default method\./g,"");
    html.innerHTML = html.innerHTML.replace(/One line((.|\n)*)find your item\.|You may use((.|\n)*)do not use HTML\.|For |Dutch auctions((.|\n)*)selling a single set\.|This is the price((.|\n)*)and commas \(','\)|Bid increment is((.|\n)*)each bid\.|Reserve Price is((.|\n)*)Reserve Price!|Buy Now allows((.|\n)*)Buy Now!/g, "");
    html.innerHTML = html.innerHTML.replace(/Item Quantity((.|\n)*)itemQuantity" size="3" value="1">/g, "<span id=\"qtyBox\" style=\"display:none;\"><input maxlength=\"3\" name=\"itemQuantity\" size=\"3\" value=\"1\"></span></strong>");
    html.innerHTML = html.innerHTML.replace(/per item((.|\n)*): 3\.00/g, "");    
    html.innerHTML = html.innerHTML.replace(/Bid Increment((.|\n)*)10\.00/g, "<span id=\"incrementReserveBox\" style=\"display:none;\"><b>Bid increment:</b> <input maxlength=\"11\" name=\"itemBidIncrement\" size=\"9\" value=\"1\"><br><b>Reserve price:</b> <input maxlength=\"11\" name=\"itemReserve\" size=\"9\" value=\"0\"><br></span><span id=\"BINBox\" style=\"display:none;\"><b>Buy now price:</b> <input maxlength=\"11\" name=\"itemBuyNowPrice\" size=\"9\" value=\"0\"> </strong>(leave at 0 to not have buy-it-now as an option)</span></strong>");
//    html.innerHTML = html.innerHTML.replace(/<input maxlength="6" name="itemWeight" size="6">/g, "<input maxlength=\"6\" name=\"itemWeight\" size=\"6\" REQUIRED>");
//    html.innerHTML = html.innerHTML.replace(/<input maxlength="6" name="itemDisplayWeight" size="6">/g, "<input maxlength=\"6\" name=\"itemDisplayWeight\" size=\"6\" REQUIRED>");
//    $("input[name='itemTitle']").attr("required", true);
    html.innerHTML = html.innerHTML.replace(/Box Selection((.|\n)*)willing to ship your item\./g, "<span id=\"boxBox\" style=\"display:none;\"><select name=\"itembox\"><option value=\"-1\">No Boxes Defined</option></select><select name=\"itemShipping\" id=\"itemShipping\" size=\"1\"><option value=\"2\">U.S. and Canada Only</option><option value=\"0\" selected=\"\">No international shipments (U.S. Only)</option><option value=\"1\">Will ship internationally</option></select></span></strong></b>")
    html.innerHTML = html.innerHTML.replace(/Handling Charge((.|\n)*)final item selling price\)\./g, "</strong><span id=\"handleBox\" style=\"display:none;\"><input maxlength=\"11\" name=\"itemHandlingPrice\" size=\"11\" value=\"2\"></span></b>");
//    html.innerHTML = html.innerHTML.replace(/<input name="itemNoCombineShipping" value="ON" type="checkbox">/g, "</strong><input name=\"itemNoCombineShipping\" value=\"ON\" type=\"checkbox\" tabindex=\"-1\" CHECKED></strong>");
    html.innerHTML = html.innerHTML.replace(/<input name="itemNoCombineShipping" value="ON" type="checkbox">/g, "</strong><input name=\"itemNoCombineShipping\" value=\"ON\" type=\"checkbox\" tabindex=\"-1\"></strong>");
    html.innerHTML = html.innerHTML.replace(/<i>Example: 1<\/i>/g, "");
    html.innerHTML = html.innerHTML.replace(/<a href="tools\/UPSdimweightcalculator.asp" target="_blank">here<\/a>/g, "<a href=\"tools/UPSdimweightcalculator.asp\" target=\"_blank\" tabindex=\"-1\">here</a>");
		html.innerHTML = html.innerHTML.replace(/<a href="tools\/uspsdimweight1.asp" target="_blank">here<\/a>/g, "<a href=\"tools/uspsdimweight1.asp\" target=\"_blank\" tabindex=\"-1\">here</a>");
		html.innerHTML = html.innerHTML.replace(/<select name="itemStartOffset" size="1">/g, "<select name=\"itemStartOffset\" size=\"1\" tabindex=\"-1\">");
		html.innerHTML = html.innerHTML.replace(/<select name="itemstarttime" size="1">/g, "<select name=\"itemstarttime\" size=\"1\" tabindex=\"-1\">");
		html.innerHTML = html.innerHTML.replace(/<select name="itemDuration" size="1">/g, "<select name=\"itemDuration\" size=\"1\" tabindex=\"-1\">");
		html.innerHTML = html.innerHTML.replace(/<select name="itemEndTime" size="1">/g, "<select name=\"itemEndTime\" size=\"1\" tabindex=\"-1\">");
		html.innerHTML = html.innerHTML.replace(/<select name="itemShipMethod" id="itemShipMethod" onchange="modify()">/g, "<select name=\"itemShipMethod\" id=\"itemShipMethod\" onchange=\"modify()\" tabindex=\"-1\">");
		html.innerHTML = html.innerHTML.replace(/<input id="itemAutoInsurance" name="itemAutoInsurance" value="ON" disabled="true" type="checkbox">/g, "<input id=\"itemAutoInsurance\" name=\"itemAutoInsurance\" value=\"ON\" disabled=\"true\" type=\"checkbox\" tabindex=\"-1\">");
    html.innerHTML = html.innerHTML.replace(/USPS Only/g, 'Post Office Only');
    $("input[name=itemTitle]").val("");

    html2.innerHTML = html2.innerHTML.replace(/Press <input tabindex="-99" id="reset1" name="reset1" type="reset" value="Reset Form">((.|\n)*) to start over\./g, "");
    html2.innerHTML = html2.innerHTML.replace(/<input tabindex="-99" id="reset1" name="reset1" value="Reset Form" type="reset">/g, "<input tabindex=\"-99\" id=\"reset1\" name=\"reset1\" value=\"Reset Form\" type=\"reset\" style=\"display:none;\">");
    html2.innerHTML = html2.innerHTML.replace(/Press to((.|\n)*)start over./g, "");
  	html2.innerHTML = html2.innerHTML.replace(/<input id="submit1" name="submit1" value="Review Item" type="submit">/g, "<input id=\"submit1\" name=\"submit1\" value=\"Review Item\" type=\"submit\">");

    $('p:contains("Auction Gallery")').replaceWith('<br><b>Auction Gallery:</b><input name="itemGallery" id="itemGallery" value="ON" onclick="javascript:SetFeaturedButton();" type="checkbox"> ($7.95 charge)<br>Checking this box causes the auction to appear in the gallery on the site\'s front page.<br><b>Please make sure the photos are square</b>, either by adding white space using Paint, or by cropping them with <a href="http://www.croppola.com" target="_blank">Croppola</a>.<br><br>');
    $('td:contains("Featured Auction")').replaceWith('<td><b>Featured Auction:</b><input name="itemFeatured" id="itemFeatured" value="ON" type="checkbox"> ($4.95 charge)<br>This adds the item to the Featured Auctions in its category.<br>Photos can be used as-is.</td><br>');

    html.innerHTML = html.innerHTML.replace(/Select this((.|\n)*)other items\./g, "<span id='itemNoCombineShippingText'>Select this option if the buyer of this item should not be allowed to combine this item with shipment of other items.</span>");
    html.innerHTML = html.innerHTML.replace(/Select this option if you'd like to have((.|\n)*)in order\./g, "<span id='itemAutoInsuranceText'> Select this option if you'd like to have the system automatically apply the appropriate insurance amount, based on the items current price. In the case of multiple items in the shipment, insurance is calculated on the value of all items in order.</span>");







calcButtonList = {
    "general" : "General",
    "guitar" : "Guitar",
    "art" : "Frame/print",
//    "lot" : "Cub box",
    "long" : "Rug/long"
}

var myCalcButtons = "";

$.each(calcButtonList, function(index, value) {
   myCalcButtons = myCalcButtons
      + ""
      + button1
      + " class='calcType'"
      + " id='" + index + "'"
      + ">"
      + value
      + button2;
});

$('p:contains("Starting Bid")').before("<div style='position:relative; top: -20px;' id='shipCalcContainer'>"
                                       + "<div style='padding: 4px; border: 1px solid #AAA; width:400px;'>"
    + "<b>Shipping calculator</b><br><br>"
    + "<div style='padding:2px; position: relative; top: 4px;'>"
    + "<b>Type:</b>&nbsp;&nbsp;" + myCalcButtons + "</div>"
    + "<div style='padding:2px; position: relative; top: 8px;'><b>Dimensions:</b> <input id='dim1' size=5 style='position:relative; left:2px;'> <input id='dim2' size=5> <input id='dim3' size=5></div>"
    + "<div style='padding:2px; position: relative; top: 8px;'><b>Real weight:</b> <input id='actualWeight' size=5></div>"
    + "<div style='padding:2px; position: relative; top: 8px;'><b id='ownBoxText'>Ship in own (current) box?</b> <input type='checkbox' id='ownBox'></div>"
    + "<div style='padding:2px; position: relative; top: 14px;' id='myDimWeight'></div>"
    + "<div style='padding:8px; position: relative;' id='note'></div>"
    + "</div></div>"
);

$('#shipCalcContainer').before("<div id='step3Header' style='background-color: #ffc700; width: 103%; height: 24px; z-index: 99; position: relative; top: -44px; left: -30px; padding:3px;'><font size='4'><strong>Step 3 - Shipping</strong></font></div>");
$('p:contains(\"Seller Store\")').before("<div id='step4Header' style='background-color: #ffc700; width: 103%; height: 24px; z-index: 99; position: relative; top: -12px; left: -30px; padding:3px;'><font size='4'><strong>Step 4 - Store and location</strong></font></div>");
$('font:contains(\"Step 1\")').html("Step 1 - Images and presets");
$('strong:contains(\"Step 2\")').html("Step 2 - Item information");


myGuitarBoxes = JSON.stringify(guitarBoxes);
myArtBoxes = JSON.stringify(artBoxes);
myUSPSBoxes = JSON.stringify(uspsBoxes);
$("body").append("<div id='guitarBoxes' style='display:none;'>" + myGuitarBoxes + "</div>");
$("#form1").append("<script id='boxDefinitions'>guitarBoxes = JSON.parse('" + myGuitarBoxes + "');"
    + "artBoxes = JSON.parse('" + myArtBoxes + "');"                 
    + "uspsBoxes = JSON.parse('" + myUSPSBoxes + "');"   
+ "</script>");







$.each(posters, function(name, info) { //here2
    re = new RegExp(name,"gi");
    if(re.exec($(".smtext").html())) {
       if (info["buttonLock"] == "yes") {
          var unlockY = 1535;
          if (info["unlockY"]) {
              unlockY = info["unlockY"];
          }
          $('#shippingOptions').before('<div class="shipButtonLock" id="shipButtonLock" title="Click the lock button to unlock" style="position:relative;"><div style="position: absolute;top:-45;left:0;width: 717px;height:122px;background-color: grey;z-index:89;opacity:0.2;filter: alpha(opacity = 50)"></div></div>');
          $('#shippingOptions').before('<div class="shipButtonLock" style="position:absolute; left:696px; top:' + unlockY + 'px; width:50px; height:50px; background-color:#BBBBBB; z-index:999;opacity:100; border: 1px solid #888888; margin-left: auto; margin-right: auto;" onclick="javascript:$(\'.shipButtonLock\').hide(\'explode\');"><img src="http://simpleicon.com/wp-content/uploads/lock-10.png" style="width:40px; height: 40px; position: relative; top: 50%; -webkit-transform: translateY(-50%); -ms-transform: translateY(-50%); transform: translateY(-50%); margin-left: auto; margin-right: auto; left:5px;"></div>');
       }
       if (info['skip'] && info['skip'] == 'allow') {
       } else {
           $('#presetInputSkip').hide();
       }
       if (info['CM'] == 'yes' || info['CM'] == 'BIN') {
           cmAllow = "yes";
           if (info['CM'] == 'BIN') {
               cmBIN = "yes";
           }
       }
       if (info['duration']) {
          $('#itemDuration').attr('value', info['duration']);
// Suck it, javascript. Why do I have to use attr() for this?! Why won't val() freaking work?! God, I hate you.
       }
       console.dir(info);
       delay = info['delay']; // asdfasdf
       
        if (delay > 0) {
        //if (1 == 1) {
            
            
            var d = new Date();
            var today = d.getDay();
            if ((today + delay) == 6) {
                delay += 2;
            } else if ((today + delay) == 7) {
                delay += 3;
            }
//            alert(delay);
            $('select[name="itemStartOffset"]').val(delay); // WTS
            $('#itemstarttime').val('14:00');
        }


    $("body").append("<div id='posterName' style='display:none;'>" + info['name'] + "</div>");
    }
});




















$("#form1").append(
    "<script id='shippingCalc'>"
    + "var myUPSDivisor = Number($('#upsDivisor').html());"
    + "var myCalcType = 'general';"
    + "var dimWeight;"
    + "function compareBoxType(item, boxType) {"
        + "returnArray = {"
            + "'dimWeight' : '',"
            + "'boxName' : '',"
            + "'isInBox' : 'no',"
            + "'corresponds' : 'no',"
            + "'dimensions' : []"
        + "};"
        + "$.each(boxType['boxes'], function(index, value) {"
            + "if (returnArray['isInBox'] == 'no') {"
                + "if (item[0] <= value['interior'][0] && item[1] <= value['interior'][1] && item[2] <= value['interior'][2]) {"
                    + "returnArray['dimWeight'] = (value['exterior'][0] * value['exterior'][1] * value['exterior'][2]) / Number($('#upsDivisor').html());"
                    + "$.each(value['exterior'], function(index, value) { returnArray.dimensions[index] = value });"
                    + "returnArray['isInBox'] = 'yes';"
                    + "if(value['name']){returnArray['boxName'] = value['name'];}"
                    + "if(value['corresponds']){returnArray['corresponds'] = value['corresponds'];}"
                + "}"
            + "}"
        + "});"
        + "return returnArray;"
    + "}"
    + "function updateCalc(){"
       + "var pickup = 0;"
       + "var bigGuitar = 0;"
       + "var boxName = '';"
       + "var calcType = myCalcType;"
        + "var ownBox = $('#ownBox:checked').val(); "
           + "if (calcType == 'lot') {"
             + "$('#dim1').val('18').attr('disabled', 'true');"
             + "$('#dim2').val('24').attr('disabled', 'true');"
           + "} else {"
               + "if ($('#dim1').val() == '--') {"
                  + "$('#dim1').val('').attr('disabled', false);"
                  + "$('#dim2').val('').attr('disabled', false);"
               + "}"
           + "}"
          + "if ($('#dim1').val().length && $('#dim2').val().length && $('#dim3').val().length) {"
             
             + "baseDimensions = [Number($('#dim1').val().replace(/[\D]/g, '')) + 0, Number($('#dim2').val().replace(/[\D]/g, '')) + 0, Number($('#dim3').val().replace(/[\D]/g, '')) + 0];"
             + "baseDimensions.sort(function(a, b){return a-b});"
             + "var list = [];"
             + "$.each(baseDimensions, function(index, value){list[index] = value;});"
             + "if (calcType == 'general') {"
                + "if(ownBox == 'on') {"
                   + "$.each(list, function(index, value) { list[index] = value + 1; });"
                + "} else {"
                   + "$.each(list, function(index, value) { list[index] = value + 4; });"
                + "}"
             + "} else if (calcType == 'guitar') {"
                // do nothing: guitars don't get extra inches
             + "} else if (calcType == 'lot') {"
                + "baseDimensions[0] = 18;"
                + "baseDimensions[1] = 24;"
                + "baseDimensions[2] = Number($('#dim3').val().replace(/[\D]/g, ''));"
                + "$.each(baseDimensions, function(index, value){list[index] = value;});"
                + "list[2] = list[2] + 4;"
                + "calcType = 'general';" // Make sure this is right! Operating under the assumption that lots are basically treated as generals.
             + "} else if (calcType == 'long') {"
                + "list[0] = baseDimensions[0];"
                + "list[1] = baseDimensions[1];"
                + "list[2] = baseDimensions[2] + 4;"
             + "}"
             + "list.sort(function(a, b){return a-b});"
             + "dimWeight = '';"
             + "boxName = '';"
             + "if(calcType =='guitar') {"
                + "if (list[1] <= guitarBoxes['default'][1] && list[2] <= guitarBoxes['default'][2]) {"
             // Which is to say, if the guitar is smaller than the threshold to use a regular box, in  both primary dimensions
                   + "calcType = 'general';"
                   + "$.each(list, function(index, value) { list[index] = value + 4; });"
                + "} else {"
                   + "results = compareBoxType(list, guitarBoxes);"
                   + "if (results['isInBox'] == 'no') {"
                       + "calcType = 'general';"
                       + "$.each(list, function(index, value) { list[index] = value + 4; });"
                       + "bigGuitar = 'yes';"
                   + "} else {"
                      + "dimWeight = results['dimWeight'];"
                      + "boxName = results['boxName'];"
                      + "corresponds = results['corresponds'];"
                      + "$.each(results['dimensions'], function(index, value) { list[index] = value; });"
                   + "}"
                + "}"
             + "} else if(calcType =='art') {"
                + "if (ownBox == 'on'){"
                   + "if (baseDimensions[0] > 1) {"
                      + "alert('This item is too thick to be shipped between cardboard.');"
                      + "$.each(list, function(index, value) { list[index] = value + 4; });"
                      + "$('input#ownBox').attr('checked', false);"
                      + "ownBox = 'off';"
                   + "} else {"
                      + "list[0] = 2;"
                      + "list[1] = (list[1] + 3);"
                      + "list[2] = (list[2] + 3); "
                      + "calcType = 'general';"
                   + "}"
                + "}"
                + "if (ownBox != 'on') {"
                    + "if (list[1] <= artBoxes['default'][1] && list[2] <= artBoxes['default'][2]) {"
                        + "calcType = 'general';"
                        + "$.each(list, function(index, value) { list[index] = value + 4; });"
                    + "} else {"
                        + "results = compareBoxType(list, artBoxes);"
                        + "if (results['isInBox'] == 'no') {"
                            + "calcType = 'general';"
                            + "$.each(list, function(index, value) { list[index] = value + 4; });"
                            + "pickup = 'yes';"
                        + "} else {"
                            + "dimWeight = results['dimWeight'];"
                            + "boxName = results['boxName'];"
                            + "corresponds = results['corresponds'];"
                            + "$.each(results['dimensions'], function(index, value) { list[index] = value; });"
                        + "}"
                    + "}"
                + "}"
             + "} else if(calcType =='long') {"
                + "if (list[1] > 12) {"
                   + "pickup = 'yes';"
                   + "calcType = 'general';"
                + "} else if (list[1] > 8) {"
                   + "list[0] = 13;"
                   + "list[1] = 13;"
                   + "calcType = 'general';"
//                   + "corresponds = '12x12 long box';"
                + "} else {"
                    + "list[0] = 9;"
                    + "list[1] = 9;"
//                    + "corresponds = '8x8 long box';"
                    + "calcType = 'general';"
                + "}"
             + "}"
             + "realWeight = Number($('#actualWeight').val());"
             + "if(!dimWeight) {"
                + "volume = Number(list[0]) * Number(list[1]) * Number(list[2]);"
                + "dimWeight = Number(volume) / Number(myUPSDivisor);"
             + "}"
             + "var sgwDimList = ['itemLength', 'itemWidth', 'itemHeight'];"
             + "$.each(list, function(index, value) { $('#' + sgwDimList[index]).val(value) });"
             + "dimWeight = Math.ceil(Math.max(dimWeight, (realWeight+2), 3));"
             + "note = '';"
             + "if (calcType == 'general') {"
                + "var inUSPSBox = 'no';"
                + "$.each( uspsBoxes, function( key, value ) {"
                    + "if (inUSPSBox == 'no') {"
                       + "if (list[0]-4 <= value[0] && list[1]-3 <= value[1] && list[2]-3 <= value[2]) {"
                           + "note = '<br><b><font color=\"blue\">This item <i><u><font size=4.5>may</font></u></i> fit in a ' + value['name'] + '.</font> <font size=5.5 color=\"red\">Use discretion.</font></b>';"
                           + "note = note + '<span style=\"position:relative; left: 20px; border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 3px; z-index:99;\" onclick=\"javascript:useUSPSBox(\\'' + value['corresponds'] + '\\');\" id=\"useUSPS\">Use this (Post Office)</span><br><br>';"
                           + "inUSPSBox = 'yes';"
    + "} else {"
    + "}"
                    + "}"
                + "});"
            + "}"
            + "if (boxName.length) {"
               + "note = '<br><b><font size=5.5 color=\"blue\">' + boxName + '</font></b>';"
            + "} else if (pickup.length || bigGuitar.length) {"
               + "note = '<span style=\"position:relative; top:15px;\"><b><font color=\"red\">This item should most likely be pickup only.</font></b> Double-check with a manager.<br><br></span>';"
               + "dimWeight = '<s>' + dimWeight + '</s>'"
            + "} else if (!note.length){"
               + "note =''"
            + "}"
            + "if (typeof(corresponds) == 'undefined') { var corresponds = ''; } else if (corresponds.length < 3) { corresponds = ''; }"
            + "dimWeightNote = '<b>Dimensional weight:</b> <span id=\"dimWeightValue\" style=\"position: relative; left: 5px; font-size: 150%;\">';"
            + "dimWeightNote = dimWeightNote + dimWeight;"
            + "dimWeightNote = dimWeightNote + '</span>';"
            + "if (!pickup.length && !bigGuitar.length) { "
               + "dimWeightNote = dimWeightNote + '<br><span style=\"position:relative; left: 140px; top:8px; border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 3px; z-index:99;\" id=\"useUPS\" onclick=\"javascript:useDimWeight(\\'' + corresponds + '\\');\">Use this (UPS)</span><br><br>';"
            + "} else {"
               + "dimWeightNote = dimWeightNote + '<br><span style=\"position:relative; left: 140px; top:8px; border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 3px; z-index:99;\" id=\"useUPS\" onclick=\"javascript:useDimWeight(\\'pickupOnly\\');\">Use this (Pickup)</span><br><br>';"
            + "}"
            + "$('#myDimWeight').html(dimWeightNote);"
            + "$('#note').html(note);"

       + "}"
    + "}"
    + "function useDimWeight(corresponds){"
          + "if ($('#dimWeightValue\').html().length) {"
             + "myRealWeight = Number($('input[name=\"itemDisplayWeight\"]').val()) + 2;"
             + "myShipWeight = Number($('input[name=\"itemWeight\"]').val());"
             + "myOtherRealWeight = Number($('#actualWeight').val()) + 2;"
             + "myOtherShipWeight = Number($('#dimWeightValue\').html());"
             + "if (corresponds == 'pickupOnly'){"
                + "$(\"input[name='itemWeight']\").val(100);"
             + "} else {"
                + "$(\"input[name='itemWeight']\").val(Math.max(myRealWeight, myShipWeight, myOtherRealWeight, myOtherShipWeight, 3));"
             + "}"
             + "$(\"input[name='itemWeight']\").val().length ? animTime = 1000 : animTime = 4000;" // if blah ? then : else

             + "if (corresponds.length > 2){"
                + "$('span#useUPS').css('background-color', '#aaa').animate({'background-color' : '#eee'}, animTime);"
                 + "$('span[name=\"' + corresponds + '\"]').trigger('click');"
             + "} else {"
                + "$('span#useUPS').css('background-color', '#aaa').animate({'background-color' : '#eee'}, animTime);"
                + "$('span#UPS').trigger('click');"
                
             + "}"
             + "if (corresponds != 'pickupOnly'){"
                + "$(\"input[name='itemWeight']\").val(Math.max(myRealWeight, myShipWeight, myOtherRealWeight, myOtherShipWeight, 3));"
                + "$('input[name=\"itemWeight\"]').val(Math.max(myShipWeight, myRealWeight));"
             + "}"
          + "}"
    + "}"
    + "function useUSPSBox(corresponds){"
       + "$(\"input[name='itemWeight']\").val().length ? animTime = 1000 : animTime = 4000;"
       + "$('span#useUSPS').css('background-color', '#aaa').animate({'background-color' : '#eee'}, animTime);"
       + "$('span[name=\"' + corresponds + '\"]').trigger('click');"
    + "}"
    + "function updatePrivateDesc(){"
        + "$('#itemSellerInfo').val('');"
        + "if($('#dim1').val().length && $('#dim2').val().length && $('#dim3').val().length) {"
          + "myString = '<strong>Original Location:</strong> '+$('#itemSellerInventoryLocationID').val()+'<br> {{';"
          + "if (myCalcType == 'general') {"
             + "myString = myString + 'gen';"
          + "} else if (myCalcType == 'guitar') {"
             + "myString = myString + 'guit';"
          + "} else if (myCalcType == 'art') {"
             + "myString = myString + 'art';"
          + "} else if (myCalcType == 'lot') {"
             + "myString = myString + 'lot';"
          + "} else if (myCalcType == 'long') {"
             + "myString = myString + 'lng';"
          + "}"
          + "myString = myString + ':' + $('#dim1').val() + 'x' + $('#dim2').val() + 'x' + $('#dim3').val();"
          + "if ($('#ownBox:checked').val() == 'on') {"
             + "myString = myString + '(own)';"
          + "}"
          + "myString = myString + '}}';"
          + "myDesc = $('#itemSellerInfo').val();"
          + "if ($('#itemSellerInfo').val().search('}}')) {"
             + "myDesc = myDesc.replace(/{{(.*)/, '');"
          + "}"
          + "while (myDesc.indexOf('  ') > (-1)) {"
             + "myDesc = myDesc.replace(/  /g, ' ');"
          + "}"
          + "myString = myDesc + myString;"
          + "$('#itemSellerInfo').val(myString);"
        + "}"
        + "if ($('#noteToShipping').val().length > 0) {"

          + "myShipNote = '<b>Note from ' + $('#posterName').html() + ': </b><br>' + $('#noteToShipping').val() + '<br>';"
          + "if ($('#itemSellerInfo').val().length > 0) {"
             + "myShipNote = '<br><br>' + myShipNote;"
          + "}"
          + "$('#itemSellerInfo').val($('#itemSellerInfo').val() + myShipNote);"
        + "} else {  }"
    + "}"
    + "$(document).ready(function(){"
       
       + "$('#ownBox').change(function(){"
          + "updateCalc();"
       + "});"
       + "$('.calcType').click(function(){"
          + "if (myCalcType == 'lot') { $('#dim1, #dim2').val('').attr('disabled', false); }"
          + "$('.calcType').css('background-color', '#EEEEEE');"
          + "$(this).css('background-color', '#AAAAAA');"
          + "myCalcType = this.id;"
          + "if(myCalcType =='art') {"
             + "$('#ownBoxText').html('Ship between cardboard (check with shipping)? ');"
          + "} else {"
             + "$('#ownBoxText').html('Ship in own (current) box? ');"
          + "}"
          + "updateCalc();"
       + "});"
       + "$('#dim1, #dim2, #dim3, #actualWeight').keyup(function(){"
          + "updateCalc();"
          + "if ($('#actualWeight').val().length) {"
             + "$(\"input[name='itemDisplayWeight']\").val($('#actualWeight').val());"
          + "}"
       + "});"
       + "$('#form1').submit(function(e){"
         + "preventSubmit = false;"
         + "myLoc = $('#itemSellerInventoryLocationID').val();"
         + "if (myLoc = '' || !myLoc) {"
            + "preventSubmit = true;"
         + "}"
         + "updatePrivateDesc();"
         + "if($('input[name=\"itemShippingPrice\"]').val() <= 0 || !$('input[name=\"itemShippingPrice\"]').val().length) {" 
            + "if ($('input[name=\"itemWeight\"]') == 100) {"
                + "$('input[name=\"itemDisplayWeight\"]').val(100);"
            + "} else if($('input[name=\"itemWeight\"]').val > 0) {"
                + "myRealWeight = Number($('input[name=\"itemDisplayWeight\"]').val()) + 2;"
                + "myShipWeight = Number($('input[name=\"itemWeight\"]').val());"
                + "$('input[name=\"itemWeight\"]').val(Math.max(myShipWeight, myRealWeight));" 
            + "}"
         + "}"
         + "myTitle = $('input[name=\"itemTitle\"]').val();"
         + "var myStore = '';"
         + "if (!$('#itemsellerstore').val().length && !$('#presetStore').val().length) {"
            + "myStore = prompt('Store number?');"
            + "$('#itemsellerstore').val(myStore);"
         + "} else { }"
         + "if (!$('#itemSellerInventoryLocationID').val().length && !$('#presetLocation').val().length) {"
            + "$('#itemSellerInventoryLocationID').val(prompt('Inventory location?'));"
         + "}"
         + "myLoc = $('#itemSellerInventoryLocationID').val();"
             + "saveLocation = JSON.stringify({'lastLocation': myLoc, 'lastTitle': myTitle});"
         + "window.postMessage (saveLocation, '*');"
         + "console.log(saveLocation);"
         + "presetData = $('#myPresets').data('data');"
         + "if (presetData['Store'].length) {"
            + "$('#itemsellerstore').val(presetData['Store']);"
         + "}"
         + "if (presetData['Shipping Weight'].length) {"
            + "$('input[name=\"itemWeight\"]').val(presetData['Shipping Weight']);"
         + "}"
         + "if (presetData['Display Weight'].length) {"
            + "$('input[name=\"itemDisplayWeight\"]').val(presetData['Display Weight']);"
         + "}"
         + "if (presetData['Location'].length && presetData['Location'] != '') {"
            + "$('#itemSellerInventoryLocationID').val(presetData['Location']);"
         + "}"
         + "if (presetData['Duration'].length) {"
            + "$('#itemDuration').val(presetData['Duration']);"
         + "}"
         + "if (presetData['Ship Charge'].length) {"
            + "$('input[name=\"itemShippingPrice\"]').val(presetData['Ship Charge']);"
         + "}"
         + "if (presetData['Dimension 1'].length) {"
            + "$('#dim1').val(presetData['Dimension 1']);"
         + "}"
         + "if (presetData['Dimension 2'].length) {"
            + "$('#dim2').val(presetData['Dimension 2']);"
         + "}"
         + "if (presetData['Dimension 3'].length) {"
            + "$('#dim3').val(presetData['Dimension 3']);"
         + "}"
         + "if ($.inArray(presetData['Ship Type'], ['general', 'guitar', 'art', 'long', 'media', 'pickup'])) {"
            + "if (presetData['Ship Type'] == 'pickup') {"
                + "presetData['Ship Type'] += 'Only';"
            + "}"
            + "$('#' + presetData['Ship Type']).trigger('click');"
            + "useThis = 'yes';"
         + "}"
         + "if (presetData['Ship in own box/between cardboard'].length) {"
            + "$('#ownBox').trigger('click');"
            + "useThis = 'yes';"
         + "}"
         + "if (useThis == 'yes') {"
            + "$('#useUPS').trigger('click');"
         + "}"
        + "myCat = $('#s1').val();"
        + "myTitle = $('input[name=\"itemTitle\"]').val();"
        + "if (myCat.indexOf('Sculptures') < 0 && myCat.indexOf('Figurines') < 0 && myCat.indexOf('Cookie Jars') < 0 && myCat.indexOf('Music Boxes') < 0 && myCat.indexOf('Pottery') < 0 && myCat.indexOf('Glass') < 0 && myCat.indexOf('Grabbags') < 0 && myCat.indexOf('Barware') < 0 && myCat.indexOf('China') < 0 && myCat.indexOf('Cookware') < 0 && myCat.indexOf('Serving Pieces') < 0) {"   
           + "if (myTitle.indexOf('Wedding Dress') < 0 && myTitle.indexOf('Gown') < 0){"
              + "if ($('input[name=\"itemWeight\"]').val() < 20 && $('#combineCheck').html() != 'true') {"
                 + "$('#combineCheck').html('true');"
                 + "$('input[name=\"itemNoCombineShipping\"]').attr('checked', !confirm('Allow shipping to be combined?'));"
              + "}"
            + "}"
        + "}"
        + "$('#itemSellerInfo').val($('#itemSellerInfo').val() + '<br><br><strong>Original location:</strong>' + $('#itemSellerInventoryLocationID').val());"
        + "myDisplayWeight = $('input[name=\"itemDisplayWeight\"]').val();"
        + "if (myDisplayWeight == '' || myDisplayWeight <= 0 || !myDisplayWeight) {"
           + "alert('Please enter shipping information!');"
           + "e.preventDefault();"
         + "}"
         + "if (myTitle == '' || !myTitle) {"
           + "alert('Please enter a title!');"
           + "e.preventDefault();"
         + "}"
         + "if (preventSubmit) {"
           + "e.preventDefault();"
           + "$('#form1').submit();"
         + "}"
         + "if ($('#itemsellerstore').val() == '999'| myStore == '999') {"
           + "($('#itemsellerstore').val('999 - Mixed Locations'));"
         + "}"
       + "});"
       + "$('#itemGallery').change(function(){" 
//          + "if ($('#itemFeatured').attr('disabled') == 'disabled') {"
          + "if ($('#itemGallery:checked').length > 0) {"
             + "$('#galleryCB2').prop('checked', true);"
             + "now = new Date();"
             + "currentDate = now.getDate();"
             + "currentWeekDay = now.getDay();" // 0 == Sunday; therefore 7 == Saturday; therefore daysTillSaturday = 6 - currentWeekDay; (7 inclusive, but we want not inclusive)             
             + "daysTillSaturday = 6 - currentWeekDay;"
             + "daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];"
             + "daysThisMonth = daysInMonth[now.getMonth()];" // This gives us the end of the month.
             + "var suggestedDuration;"
             // We want to know is if the next Saturday is the end of the period... but there's no programmatic way to tell that. Crap.
             + "if (daysTillSaturday <= 3) {"
                + "suggestedDuration = daysTillSaturday + 7;"
             + "} else {"
                + "suggestedDuration = 7;"
             + "}"
             + "duration = prompt('                      Auction duration?\\n(Note: if it\\'s close to the end of the period,\\n   you may want to do a shorter auction!)\\n\\n            (Minimum 4, maximum 15)\\n\\n', suggestedDuration);"
             + "$('input[name=\"itemDuration\"]').val(Math.min(Math.max(duration,4),15));"

          + "} else {"
             + "$('#galleryCB2').prop('checked', false);"
          + "}"
       + "});"

    
    + "});"
    +"</script>"
);


$.each( shippingMethods, function( key, value ) {
    if (value['tooltip']) {
        $(".shipType:contains('" + key + "')").attr('title', value['tooltip']);
    }
});

$('p:contains("Description"), strong:contains("Title"), font:contains("characters remaining"), strong:contains("Category"), #s1').addClass('section2');

$('#shipCalcContainer, font:contains("leave at"), #shippingOptions, font:contains("Shipping Charge"), span:contains("Unlock shipping"), b:contains("Shipping"), #shipMethodLock, #itemShipMethod, b:contains("Item Shipment"), input[name="itemNoCombineShipping"], #itemNoCombineShippingText, b:contains("Insurance"), #itemAutoInsurance, #itemAutoInsuranceText').not(':not(:visible)').addClass('section3');



$('#form1').append("<script id='windowShades'>"
    + "$(document).ready(function(){"
        + "$('td:contains(\"Item information\")').click(function(){"
           + "$('.section2').toggle();"
        + "});"
        + "$('div:contains(\"Step 3 - Shipping\")').click(function(){"
           + "$('.section3').toggle();"
           + "$('br+br').toggle();"
        + "});"

    + "});"
+ "</script>");

$('#form1').append("<script id='updatePresets'>"
    + "function updatePresets() {"     
       + "var presetList = ['Store', 'Shipping Weight', 'Display Weight', 'Location', 'Duration', 'Ship Charge', 'Ship Type', 'Ship in own box/between cardboard', 'Dimension 1', 'Dimension 2', 'Dimension 3', 'Skip', 'Owner'];"
       + "var presetVals = {};"
       + "$.each(presetList, function(key, value){"
          + "presetVals[value] = $('[id=\"preset' + value + '\"]').val();"
          + "myValue = $('[id=\"preset' + value + '\"]').val();"
       + "});"
       + "$.each(presetVals, function(key, value){"
          + "console.log(key + '=' + value);"     
       + "});"
       + "$('#myPresets').remove();"
       + "var myPresets = {};"
       + "$.each(presetVals, function(key, value){"
          + "if (value.length) {"
             + "myPresets += '<b>' + key + ':</b> ' + value + '<br>';"
          + "}"
       + "});"
       + "if(myPresets['Ship Type'] == \"media\") {"
          + "myPresets['Ship Type'] = \"Media\";"
       + "}"     
       + "var messageTxt  = JSON.stringify (presetVals);"
       + "window.postMessage (messageTxt, '*');"
       + "if (myPresets.length) {"
          + "myPresets = \"<div id='myPresets' style='width:300px; border: 3px solid red; background-color:#FFFF11; padding:25px;'><b style='font-size:24px;'>Presets:</b><br>\" + myPresets + \"</div><br>\";"
          + "$('#presetBox').before(myPresets);"
          + "$('#myPresets').data('data', presetVals);"
          + "$('#myPresets').html($('#myPresets').html().replace('undefined',''));"
          + "$('#myPresets').html($('#myPresets').html().replace('[object Object]',''));"
       + "}"    
       
       
    + "}"
+ "</script>");

$('#form1').append("<script id='buyItNowScript'>"
    + "function binButton() {"     
       + "$(\"#BINBox\").show();"
       + "$(\"#BINBoxShowButton\").hide();"
       + "var price = Math.ceil(prompt('Price?')) - .01;"
       + "$('input[name=\"itemBuyNowPrice\"]').val(price);"
    + "}"
+ "</script>");

$("#form1").append("<script id='docready2'>$(document).ready(function() {"
    + "$('#UPS, #general').css('background-color', '#AAAAAA');"
    + "$('.shipType').click(function(){"
       + "if (this.id == 'Sm flat rate box') {"
          + "dimArray = [Number($('#dim1').val().replace(/[\D]/g, '')) + 0, Number($('#dim2').val().replace(/[\D]/g, '')) + 0, Number($('#dim3').val().replace(/[\D]/g, '')) + 0];"
          + "dimArray.sort(function(a, b){return a-b});"
          + "if (dimArray[0] > 1.25 || dimArray[1] > 4.75 || dimArray[2] > 8.25) {"
             + "alert('This item is too big to fit in a small flat-rate box!');"
             + "exit;"
          + "}"
       + "} else if (this.id == 'Med flat rate box') {"
          + "dimArray = [Number($('#dim1').val().replace(/[\D]/g, '')) + 0, Number($('#dim2').val().replace(/[\D]/g, '')) + 0, Number($('#dim3').val().replace(/[\D]/g, '')) + 0];"
          + "dimArray.sort(function(a, b){return a-b});"
          + "if ((dimArray[0] <= 3.25 && dimArray[1] <= 11.75 && dimArray[2] <= 13.25) || (dimArray[0] <= 5.25 && dimArray[1] <= 8.25 && dimArray[2] <= 10.75)) {"

          + "} else {"
             + "alert('This item is too big to fit in a medium flat-rate box!');"
             + "exit;"
          + "}"
       + "}"
       + "$('.shipType').css('background-color', '#EEEEEE');"
       + "$(this).css('background-color', '#AAAAAA');"
       + "if (this.id == 'pickupOnly') {"
          + "if ($('input[name=\"itemDuration\"]').val() != 4) {"
             + "duration = prompt('   Auction duration?', 4);"
             + "$('input[name=\"itemDuration\"]').val(Math.min(Math.max(duration,4),15));"
          + "}"
          + "$('#itemSellerInfo').html('Pickup only');"
          + "if (!$('input[name=itemWeight]').val().length){"
             + "$('input[name=itemWeight]').val(100);"
          + "}"
          + "$('input[name=\"itemDisplayWeight\"]').val(100);"
		      + "$('#itemAutoInsurance').attr('disabled', false);"
		      + "$('#itemAutoInsurance').attr('checked', false);"
		      + "$('#itemShipMethod option[value=3]').attr('selected', false);"
		      + "$('#itemShipMethod option[value=2]').attr('selected', false);"
		      + "$('#itemShipMethod option[value=0]').attr('selected', 'selected');"
	      	+ "$('#itemShipMethod').val(0);"
          + "$('input[name=\"itemShippingPrice\"]').val(0);"
       + "} else if (this.id == 'UPS') {"
          + "$('#itemSellerInfo').html('');"
          + "displayWeight = $('input[name=\"itemDisplayWeight\"]').val();"
          + "while (!displayWeight.length || isNaN(displayWeight)) {"
             + "displayWeight = prompt(\"Item's actual weight?\");"
          + "}"
          + "$('input[name=\"itemDisplayWeight\"]').val(displayWeight);"
          + "shippingWeight = $('input[name=\"itemWeight\"]').val();"
          + "while (!shippingWeight.length || isNaN(shippingWeight)) {"
             + "shippingWeight = prompt(\"Item's dimensional weight?\");"
          + "}"
          + "$('input[name=\"itemWeight\"]').val(shippingWeight);"
          + "$('#itemAutoInsurance').attr('disabled', false);"
          + "$('#itemAutoInsurance').attr('checked', false);"
          + "$('#itemShipMethod option[value=3]').attr('selected', false);"
          + "$('#itemShipMethod option[value=2]').attr('selected', 'selected');"
          + "$('#itemShipMethod').val(2);"
          + "$('input[name=\"itemShippingPrice\"]').val(0);"
       + "}"
       + "if(this.id != 'pickupOnly' && $('input[name=\"itemShippingPrice\"]').val() <= 0 || !$('input[name=\"itemShippingPrice\"]').val().length) {" 
          + "myRealWeight = Number($('input[name=\"itemDisplayWeight\"]').val()) + 2;"
          + "myShipWeight = Number($('input[name=\"itemWeight\"]').val());"
          + "$('input[name=\"itemWeight\"]').val(Math.max(myShipWeight, myRealWeight));"
       + "}"
       + "if(this.id == 'Media'){"
          + "$('input[name=\"itemNoCombineShipping\"]').attr('checked', true);"
       + "} else {"
//          + "$('input[name=\"itemNoCombineShipping\"]').attr('checked', true);" // ????
       + "}"
    + "});"
    + "$('#itemsellerstore').change(function(){"
    + "});"
+ "});</script>");


$("#form1").append("<script id='uspsToPostOffice'>"
    + "$(document).ready(function(){"
       + "$('#itemShipMethod option[value=\"3\"]').text('Post Office');"
    + "});"
+ "</script>");


$("#form1").append("<script id='hidePresetsIfApplicable'>"
    + "$(document).ready(function(){"
       + "presetCount = $('.presetSpan').length;"
       + "if (presetCount <= 1) {"
          + "$('#myPresets').hide();"
       + "}"
    + "});"
+ "</script>");
    


$("#itemSellerInfo").after("<b>Note to shipping:</b><br><textarea id='noteToShipping' rows='2' cols='40'></textarea><br>");

$("#form1").append("<script id='doMedia'>"
    + "function getCharge(myWeight) {"
				+ "if (myWeight <= 3) {"
					+ "return '3.99';"
				+ "} else if (myWeight <= 6) {"
					+ "return '5.99';"
				+ "} else if (myWeight <= 10) {"
					+ "return '7.99';"
				+ "} else if (myWeight <= 13) {"
					+ "return '8.99';"
				+ "} else if (myWeight <= 15) {"
					+ "return '9.99';"
				+ "} else if (myWeight <= 19) {"
					+ "return '11.99';"
				+ "} else if (myWeight <= 25) {"
					+ "return '15.99';"
				+ "} else if (myWeight <= 27) {"
					+ "return '16.99';"
				+ "} else if (myWeight <= 29) {"
					+ "return '17.99';"
				+ "} else if (myWeight <= 31) {"
					+ "return '18.99';"
				+ "} else if (myWeight <= 33) {"
					+ "return '19.99';"
				+ "} else if (myWeight <= 35) {"
					+ "return '20.99';"
				+ "} else if (myWeight <= 37) {"
					+ "return '21.99';"
				+ "} else if (myWeight <= 39) {"
					+ "return '22.99';"
				+ "} else if (myWeight <= 41) {"
					+ "return '23.99';"
				+ "} else if (myWeight <= 43) {"
					+ "return '24.99';"
				+ "} else if (myWeight <= 45) {"
					+ "return '25.99';"
				+ "} else if (myWeight <= 47) {"
					+ "return '26.99';"
				+ "} else if (myWeight <= 49) {"
					+ "return '27.99';"
				+ "} else if (myWeight <= 51) {"
					+ "return '28.99';"
				+ "} else if (myWeight <= 53) {"
					+ "return '29.99';"
				+ "} else if (myWeight <= 55) {"
					+ "return '30.99';"
				+ "} else if (myWeight <= 57) {"
					+ "return '31.99';"
				+ "} else if (myWeight <= 59) {"
					+ "return '32.99';"
				+ "} else if (myWeight <= 61) {"
					+ "return '33.99';"
				+ "} else if (myWeight <= 63) {"
					+ "return '34.99';"
				+ "} else if (myWeight <= 65) {"
					+ "return '35.99';"
				+ "} else if (myWeight <= 67) {"
					+ "return '36.99';"
				+ "} else if (myWeight <= 68) {"
					+ "return '37.99';"
				+ "} else if (myWeight <= 69) {"
					+ "return '38.99';"
				+ "} else if (myWeight <= 70) {"
					+ "return '39.99';"
				+ "}"
	  + "}"
    + "function doMedia(weight) {"    
      + "console.log('butts');"
			+ "var myCharge;"
			+ "if (weight < 50) {"
				+ "myCharge = getCharge(weight);"
      + "} else if (weight < 70) {"
        + "myCharge = 2 * getCharge(weight/2);"
			+ "} else {"
				+ "if (weight <= 140) {"
					+ "weight /= 2;"
					+ "myCharge = 2.25 * getCharge(weight);"
				+ "} else if (weight <= 210) {"
					+ "weight /= 3;"
					+ "myCharge = 3.5 * getCharge(weight);"
				+ "}"
				+ "myCharge = (Math.ceil(myCharge) - .01)"
			+ "}"
      + "return myCharge;"            
    + "}"

    + "function addShelves() {"          

    + "}"    
+ "</script>");






//$.click is not a function
$( "#form1" ).append("<script id='docready1'>function doUPS(){if($(\"#itemShipMethod\").val()>0||$(\"input[name='itemShippingPrice']\").val()>0)if(0==$(\"#itemShipMethod\").val()&&$(\"input[name='itemShippingPrice']\").val()>0&&alert(\"This item was set to pickup only - are you sure you want to switch to a flat USPS rate?\"),$(\"input[name='itemShippingPrice']\").val()<1){for(var e=document.getElementsByTagName(\"input\"),t=0;t<e.length;t++)e[t].id&&\"itemAutoInsurance\"==e[t].id&&(e[t].checked=!1);for(var i=document.getElementsByTagName(\"select\"),t=0;t<i.length;t++)i[t].id&&\"itemShipMethod\"==i[t].id&&(i[t].selectedIndex=2);$(\"#itemShipMethod\").val(2)}else{for(var e=document.getElementsByTagName(\"input\"),t=0;t<e.length;t++)e[t].id&&\"itemAutoInsurance\"==e[t].id&&(e[t].checked=!0);for(var i=document.getElementsByTagName(\"select\"),t=0;t<i.length;t++)i[t].id&&\"itemShipMethod\"==i[t].id&&(i[t].selectedIndex=3);$(\"#itemShipMethod\").val(3)}}function unlockShipCharge(){$(\"#shipPriceLock\").remove()}$(document).ready(function(){$(\"input[name=itemShippingPrice]\").change(function(){$(\"input[name=itemShippingPrice]\");doUPS()}),$(\".shipCharge\").click(function(){var e=0;myBoxes=$(\"#boxDefinitions\").data();for(var t=$(\"input[name=itemDisplayWeight]\").val();!t.length||!Number(t);)t=prompt(\"Item's weight?\",\"\"),$(\"input[name=itemDisplayWeight]\").val(t),\"UPS\"!=myBoxes[this.id].method?$(\"input[name=itemWeight]\").val(t):myBoxes[this.id].weight||$(\"input[name=itemWeight]\").val().length||$(\"input[name=itemWeight]\").val(prompt(\"Item's shipping weight?\"));if(\"Media\"==this.id){t > 0 && (e = doMedia(t)), $(\"input[name=itemWeight]\").val().length || $(\"input[name=itemWeight]\").val($(\"input[name=itemDisplayWeight]\").val())}else myBoxes[this.id].price&&(e=myBoxes[this.id].price,$(\"input[name=itemWeight]\").val().length||($(\"input[name=itemDisplayWeight]\").val().length?$(\"input[name=itemWeight]\").val($(\"input[name=itemDisplayWeight]\").val()):($(\"input[name=itemDisplayWeight]\").val(1),$(\"input[name=itemWeight]\").val(1)))),myBoxes[this.id].weight&&(myWeight=Math.max(myBoxes[this.id].weight,Number($(\"input[name=itemDisplayWeight]\").val())+2,3),$(\"input[name=itemWeight]\").val(myWeight));$(\"#itemSellerInfo\").html(\"UPS\"!=this.id&&\"pickupOnly\"!=this.id?myBoxes[this.id].note:\"pickupOnly\"==this.id?\"Pickup only\":\"\"),\"UPS\"==myBoxes[this.id].method&&($(\"#itemAutoInsurance\").attr(\"disabled\",!1),$(\"#itemAutoInsurance\").attr(\"checked\",!1),$(\"#itemShipMethod option[value=3]\").attr(\"selected\",!1),$(\"#itemShipMethod option[value=2]\").attr(\"selected\",\"selected\"),$(\"#itemShipMethod\").val(2)),$(\"input[name=itemShippingPrice]\").val(e),doUPS()}),$(\"#UPS\").click(function(){for(var e=$(\"input[name=itemWeight]\").val(),t=$(\"input[name=itemDisplayWeight]\").val();!t.length||0/0(t)||100==$(\"input[name=itemWeight]\").val()&&100==$(\"input[name=itemDisplayWeight]\").val();)t=prompt(\"Item's actual weight?\");for(;!e.length||0/0(t)||100==$(\"input[name=itemWeight]\").val()&&100==$(\"input[name=itemDisplayWeight]\").val();)e=prompt(\"Item's shipping weight?\");$(\"input[name=itemWeight]\").val(e),$(\"input[name=itemDisplayWeight]\").val(t),$(\"#itemAutoInsurance\").attr(\"disabled\",!1),$(\"#itemAutoInsurance\").attr(\"checked\",!1),$(\"#itemShipMethod option[value=3]\").attr(\"selected\",!1),$(\"#itemShipMethod option[value=2]\").attr(\"selected\",\"selected\"),$(\"#itemShipMethod\").val(2)}),$(\"#pickupOnly\").click(function(){$(\"input[name=itemDisplayWeight]\").val().length||$(\"input[name=itemDisplayWeight]\").val(100),$(\"input[name=itemWeight]\").val().length||$(\"input[name=itemWeight]\").val(100),$(\"#itemAutoInsurance\").attr(\"disabled\",!1),$(\"#itemAutoInsurance\").attr(\"checked\",!1),$(\"#itemShipMethod option[value=3]\").attr(\"selected\",!1),$(\"#itemShipMethod option[value=2]\").attr(\"selected\",!1),$(\"#itemShipMethod option[value=0]\").attr(\"selected\",\"selected\"),$(\"#itemShipMethod\").val(0)}),$(\"input\").focusout(function(){doUPS()}),$.click(function(){$(\"input[name=itemDisplayWeight]\").val().length&&$(\"input[name='itemShippingPrice']\").val()<1&&$(\"input[name=itemWeight]\").val(Math.min(Math.max($(\"input[name=itemWeight]\").val(),Number($(\"input[name=itemDisplayWeight]\").val())+2),100))})});</script>");

$("#form1").append("<script id='availChars'>function titleAvailChars() {var length = $('input[name=itemTitle]').val().length;	var remaining = 50 - length; ('myCounter').html(remaining); }</script>");
$('input[name="itemShippingPrice"]').prop('disabled', false);
$('input[name="itemShippingPrice"]').attr('id', 'itemShippingPrice');



//$('') holy shit this is so terrible
// End