// ==UserScript==
// @name        SGW Fixer - DEPRECATED
// @namespace   https://greasyfork.org
// @include     https://sellers.shopgoodwill.com/sellers/newAuctionItem-catsel.asp*
// @include     https://sellers.shopgoodwill.com/sellers/reviewItem-label.asp*
// @include     https://sellers.shopgoodwill.com/sellers/reviewItem-label.asp?state=2
// @include     http://localhost/sgw.html
// @version     6.6.1.10
// @description Implements numerous improvements to the functionality of the Shopgoodwill seller site.
// @grant       none
// @require     https://greasyfork.org/scripts/10208-gm-api-script/code/GM%20API%20script.js?version=54964
// @require     https://greasyfork.org/scripts/19381-sgw-shelves-cats/code/SGW%20Shelves%20%20Cats.user.js?upDate=20160902
// @require     https://greasyfork.org/scripts/13969-sgw-fixer-users/code/SGW%20Fixer%20-%20Users.js?upDate=20160919
// @downloadURL https://update.greasyfork.org/scripts/7850/SGW%20Fixer%20-%20DEPRECATED.user.js
// @updateURL https://update.greasyfork.org/scripts/7850/SGW%20Fixer%20-%20DEPRECATED.meta.js
// ==/UserScript==

$('*[name]').not('[id]').each(function(){
  $(this).attr('id', $(this).attr('name'));
});

window.addEventListener ("message", receiveMessage, false);
var url = document.URL;
var premium = false;
var baseDuration = 0;

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
}

// The name as listed is what the script looks for at the top of the page, as in "Welcome Firstname Lastname". 
//      (Any piece of that is fine: "John L", "John Linnell", and "hn Lin" would all pick out John Linnell)
// "buttonLock" : "yes" causes the shipping buttons to have a lock over them for that user
// "unlockY" : [number] is an optional argument that allows you to set the height of the unlock button (with icon): a larger number makes the
//      button lower on the page


var thisPoster = "";
var myPosterName = "";
var posterDelay = 0;

$.each(posters, function(name, info) { //working 10/27
    re = new RegExp(name,"gi");
    if(re.exec($(".smtext").html())) {
        thisPoster = name.replace(/ /gi,"");
        myPosterName = name;
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

$('body').append('<input id="reviewSkip" type="hidden" value="no">');

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
       key2 += " (guitar, art, long, media, clothing, pickup)";
    } else if (key == "Ship in own box/between cardboard") {
        key2 = "<b>Own box/cardboard:</b> (yes or blank/no)";
    }
    key2 += ": ";
    $('#presetBox').append("<span id='presetInput" + key + "'>" + key2 + "<input id='preset" + key + "' value=" + myVal + "><br></span>");
});

$('#presetInputOwner').hide();


if (myPresets.length) {
    myPresets = "<div id='myPresets' style='width:300px; border: 3px solid red; background-color:#FFFF11; padding:25px;'><b style='font-size:24px;'>Presets:</b><br>" + myPresets + "</div><br>";
    $('#presetBox').before(myPresets);
    $('#myPresets').data("data", presets);
}

if(myPresets['Ship Type'] == "media") {
    myPresets['Ship Type'] = "Media";
}


$('#presetBox').append("<br><span id='updatePresetsButton' style='border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 3px;' onclick='javascript:updatePresets();$(\"#presetBox\").hide();$(\"#presetBoxButton\").show();'><b>Update presets</b></span>");
$('#presetBox').after("<br><span id='presetBoxButton' style='border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 3px; position: relative; top: -4px;' onclick='javascript:$(\"#presetBox\").show();$(\"#presetBoxButton\").hide();'><b>Edit presets</b></span>");

$('#presetLocation').attr('id', 'tempLoc');

$('#tempLoc').after("<select id='presetLocation'></select>");
$('#tempLoc').remove();

$('#presetLocation').append("<option value=''>&nbsp;</option>");
$.each(jsondata2, function(shelfIndex, shelfArray){
    $('#presetLocation').append("<option value='" + shelfArray['value'] + "'>" + shelfArray['name'] + "</option>");
});


$('#presetStore').attr('id', 'tempStore');
$('#tempStore').after($('#itemsellerstore').clone().attr('id', 'presetStore'));
$('#tempStore').remove();
$('#presetStore').prepend("<option val=''></option>");


if(url == "https://sellers.shopgoodwill.com/sellers/newAuctionItem-catsel.asp?clear=yes") {
    // Hides form if photos are not uploaded
    // the return URL from the photo uploader is:
    // https://sellers.shopgoodwill.com/sellers/newauctionitem-catsel.asp?btnSubmit=Return+to+item+entry
    $('#form1').hide();
} else if (url != "https://sellers.shopgoodwill.com/sellers/reviewItem-label.asp") {
    $('#itemTitle').parent().parent().prepend("<table style='width:400px; margin-top: 4px;'><th><td colspan=999 style='width:100%; background-color:rgb(144, 247, 23); text-align: center; font-weight: bold; color: #000;'>Listing upgrades</td></th><tr><td id='listingUpgrades'></td></tr></table>");
    $('#listingUpgrades').append("<td style='padding: 5px;'>Gallery ($8) <input type='checkbox' id='galleryCB2'></td>");
    $('#listingUpgrades').append("<td style='padding: 5px; text-align: center;'>Feature ($5) <input type='checkbox' id='featureCB2'></td>");
    $('#listingUpgrades').append("<td style='padding: 5px; text-align: right;'>Premium item <input type='checkbox' id='premiumItem'></td>");
    $('#listingUpgrades').parent().append("<tr style='display:none;' id='itemDurationRow'><td style='padding-left: 10px;' colspan=999'>Duration: <input id='durationInput' size=2 disabled=true> <div style='display:inline-block; width:150px;'>(ends on a <span id='endDay'></span>)</div> <input id='unlockDuration' type='checkbox'></td></tr>");
    $('#listingUpgrades').parent().append("<tr style='display:none;' id='itemStartingPriceRow'><td style='padding-left: 10px;' colspan=999'>Starting Price: <input id='startingPriceInput' size=4 disabled=true> <input id='unlockStartingPrice' type='checkbox'></td></tr>");
} 





$("#form1").append("<script id='jqueryui' src='https://code.jquery.com/ui/1.11.4/jquery-ui.js'></script>");
$("#form1").append("<div id='combineCheck' style='display:none;'>false</div>");

var button1 = "<span style='border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 3px;'";
var button2 = "</span>&nbsp;";
             
if ($('input[name="authentic"]').length) {
    $('input[name="authentic"]').attr('checked', true);
}


$("b:contains('Shipping Charge')").before($('.shippingOptions').first());
$('.shippingOptions').eq(1).remove();
// I have NO IDEA why the shippingOptions div gets duplicated, rather than just moved!

$('#itemAutoInsurance').attr( "disabled", false );
if ($('font:contains(\"Uploading images\")').length) {
//    $('#itemAutoInsurance').before('<div style="position:relative;"><div style="position: absolute;top:0;left:0;width: 200px;height:40px;background-color: blue;z-index:99;opacity:0;filter: alpha(opacity = 50)"></div></div>');
    $('#itemShippingPrice').before('<div id="shipPriceLock" style="position:relative;"><div style="position: absolute;top:0;left:0;width: 90px;height:22px;background-color: gray;z-index:99;opacity:0.2;filter: alpha(opacity = 50)"></div></div>');
    $('#itemShipMethod').before('<div id="shipMethodLock" style="position:relative;"><div style="position: absolute;top:0;left:0;width: 100px;height:22px;background-color: gray;z-index:99;opacity:0.2;filter: alpha(opacity = 50)"></div></div>');
    $('#itemShipMethod').after("<br><br>" + button1 + "<span onclick=\"$('#shipMethodLock').remove();\" style='position:relative; left: 50px; margin:10px;'>Unlock shipping method</span>" + button2 + "<br>");
}
var currentDur = $('#itemDuration').val();
if (url != "https://sellers.shopgoodwill.com/sellers/newauctionitem-catsel.asp?btnSubmit=Return+to+item+entry" && url != "https://sellers.shopgoodwill.com/sellers/reviewItem-label.asp") {
    $('#itemDuration').replaceWith("<input name='itemDuration' id='itemDuration' value='" + currentDur + "' min='0' max='15'>");
}

var cmAllow = "no";
var cmBIN = "no";



$("#itemStartOffset, #itemstarttime, #itemDuration, #itemEndTime, #itemShipMethod, #itemShippingPrice, #itemNoCombineShipping, #itemAutoInsurance").attr('tabindex', "-1");

$("#WebWizRTE, #itemDescription").height(700);
$("#WebWizRTE, #itemDescription").width(810);
$("#s1").attr("size", 100);

$("strong:contains('Item Title')").prepend("<br>");
$("#itemTitle").attr("maxlength",50);
$("#itemTitle").removeAttr('onkeypress').removeAttr('onkeyup');
$('#myCounter').html(50);

//UGH, SHOPGOODWILL

$('font:contains("Numbers and decimal point")').after("<br><br>" + button1 + "<span onclick=\"$('#shipPriceLock').remove();\" style='position:relative; left: 50px; margin:10px;'>Unlock shipping charge</span>" + button2 + "<br>");

$('strong:contains("Private Description")').hide();
$('#itemSellerInfo').hide();

$('p:contains("optimization")').hide();

    var html = $('#form1 > table > tbody > tr:eq(1) > td:eq(1)')[0];
    var html2 = $('#form1 > table:eq(1) > tbody > tr > td')[0];

    html2.innerHTML = html2.innerHTML.replace(/You will be advised[\s\S]*place your listing[\s\S]*will be assessed[\s\S]*in the next screen\./g,"");
    $("p:contains('Make sure you know')").hide();
    $("p:contains('Please review the')").hide();
    $("p:contains('read shopgoodwill')").hide();

    $("hr").hide();   

    $('p:contains("Starting Bid")').addClass("bidStartDurBox");
    $('p:contains("Auction Duration")').addClass("bidStartDurBox").after("<br><br>");
    $('p:contains("Auction Duration")').after("<span style='border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 2px; font-size:12px; position:relative; top:15px;' id='bidStartDurBoxButton' onclick='javascript:$(\".bidStartDurBox\").show().after();$(\"#bidStartDurBoxButton\").hide();'>Starting bid, start time, duration</span><br>")
    $('#bidStartDurBoxButton').after("<span style='border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 2px; font-size:12px; position:relative; top:15px;' id='BINBoxShowButton' onclick='javascript:binButton();'>Buy now price</span>");
    $('.bidStartDurBox').hide();

    $('#itemStartOffset').attr("id", "itemStartOffset");
    $('#itemstarttime').attr("id", "itemstarttime");
    $('#itemDuration').attr("id", "itemDuration");

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
    html.innerHTML = html.innerHTML.replace(/Box Selection((.|\n)*)willing to ship your item\./g, "<span id=\"boxBox\" style=\"display:none;\"><select name=\"itembox\"><option value=\"-1\">No Boxes Defined</option></select><select name=\"itemShipping\" id=\"itemShipping\" size=\"1\"><option value=\"2\">U.S. and Canada Only</option><option value=\"0\" selected=\"\">No international shipments (U.S. Only)</option><option value=\"1\">Will ship internationally</option></select></span></strong></b>")
    html.innerHTML = html.innerHTML.replace(/Handling Charge((.|\n)*)final item selling price\)\./g, "</strong><span id=\"handleBox\" style=\"display:none;\"><input maxlength=\"11\" name=\"itemHandlingPrice\" size=\"11\" value=\"2\"></span></b>");
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

    html2.innerHTML = html2.innerHTML.replace(/Press <input tabindex="-99" id="reset1" name="reset1" type="reset" value="Reset Form">((.|\n)*) to start over\./g, "");
    html2.innerHTML = html2.innerHTML.replace(/<input tabindex="-99" id="reset1" name="reset1" value="Reset Form" type="reset">/g, "<input tabindex=\"-99\" id=\"reset1\" name=\"reset1\" value=\"Reset Form\" type=\"reset\" style=\"display:none;\">");
    html2.innerHTML = html2.innerHTML.replace(/Press to((.|\n)*)start over./g, "");
  	html2.innerHTML = html2.innerHTML.replace(/<input id="submit1" name="submit1" value="Review Item" type="submit">/g, "<input id=\"submit1\" name=\"submit1\" value=\"Review Item\" type=\"submit\">");

    $('p:contains("Auction Gallery")').replaceWith('<br><b>Auction Gallery:</b><input name="itemGallery" id="itemGallery" value="ON" onclick="javascript:SetFeaturedButton();" type="checkbox"> ($7.95 charge)<br>Checking this box causes the auction to appear in the gallery on the site\'s front page.<br><b>Please make sure the photos are square</b>, either by adding white space using Paint, or by cropping them with <a href="http://www.croppola.com" target="_blank">Croppola</a>.<br><br>');
    $('td:contains("Featured Auction")').replaceWith('<td><b>Featured Auction:</b><input name="itemFeatured" id="itemFeatured" value="ON" type="checkbox"> ($4.95 charge)<br>This adds the item to the Featured Auctions in its category.<br>Photos can be used as-is.</td><br>');

    html.innerHTML = html.innerHTML.replace(/Select this((.|\n)*)other items\./g, "<span id='itemNoCombineShippingText'>Select this option if the buyer of this item should not be allowed to combine this item with shipment of other items.</span>");
    html.innerHTML = html.innerHTML.replace(/Select this option if you'd like to have((.|\n)*)in order\./g, "<span id='itemAutoInsuranceText'> Select this option if you'd like to have the system automatically apply the appropriate insurance amount, based on the items current price. In the case of multiple items in the shipment, insurance is calculated on the value of all items in order.</span>");
      $('#itemIsStock').parent().hide();





$('#itemDescription').parent().after("<br><br><div id='step3Header' style='background-color: #ffc700; width: 103%; height: 24px; z-index: 99; position: relative; top: -44px; left: -30px; padding:3px;'><font size='4'><strong>Step 3 - Shipping</strong></font></div>");
$('#step3Header').after($('#shipCalcContainer'));
$('p:contains(\"Seller Store\")').before("<div id='step4Header' style='background-color: #ffc700; width: 103%; height: 24px; z-index: 99; position: relative; top: -12px; left: -30px; padding:3px;'><font size='4'><strong>Step 4 - Store and location</strong></font></div>");
$('font:contains(\"Step 1\")').html("Step 1 - Images and presets");
$('strong:contains(\"Step 2\")').html("Step 2 - Item information");

$('b:contains("Item Shipment Combining"), #itemNoCombineShipping, #itemNoCombineShippingText, b:contains("Auto Include Insurance"), #itemAutoInsurance, #itemAutoInsuranceText').addClass('hiddenCheckboxes');

//$('.hiddenCheckboxes').insertAfter($('#noteToShipping').parent());
$('.hiddenCheckboxes').each(function(){
    $('#form1').append($(this));
}) // butts
$('b:contains("Item Shipment Combining"), #itemNoCombineShipping, #itemNoCombineShippingText').wrapAll("<p id='noCombineShippingContainer' style='display:none;'></p>");
$('b:contains("Auto Include Insurance"), #itemAutoInsurance, #itemAutoInsuranceText').wrapAll("<p id='autoInsuranceContainer' style='display:none;'></p>");
//$('.hiddenCheckboxes').hide();

$('br + br + br').remove();

var debug = false;
$.each(posters, function(name, info) { //here2
    re = new RegExp(name,"gi");
    if(re.exec($(".smtext").html())) {
       if (info["buttonLock"] == "yes") {
          var unlockY = 1535;
          if (info["unlockY"]) {
              unlockY = info["unlockY"];
          }
          $('.shippingOptions').before('<div class="shipButtonLock" id="shipButtonLock" title="Click the lock button to unlock" style="position:relative;"><div style="position: absolute;top:-45;left:0;width: 717px;height:122px;background-color: grey;z-index:89;opacity:0.2;filter: alpha(opacity = 50)"></div></div>');
          $('.shippingOptions').before('<div class="shipButtonLock" style="position:absolute; left:696px; top:' + unlockY + 'px; width:50px; height:50px; background-color:#BBBBBB; z-index:999;opacity:100; border: 1px solid #888888; margin-left: auto; margin-right: auto;" onclick="javascript:$(\'.shipButtonLock\').hide(\'explode\');"><img src="http://simpleicon.com/wp-content/uploads/lock-10.png" style="width:40px; height: 40px; position: relative; top: 50%; -webkit-transform: translateY(-50%); -ms-transform: translateY(-50%); transform: translateY(-50%); margin-left: auto; margin-right: auto; left:5px;"></div>');
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
      if (info['debug'] == true) {
           debug = true;
       }
       if (info['duration']) {
           $('#itemDuration').val(info['duration']);
       }
       delay = info['delay'];
       if (delay > 0) {
           var d = new Date();
           var today = d.getDay();
           if ((today + delay) == 6) {
               delay += 2;
           } else if ((today + delay) == 7) {
               delay += 3;
           }
           $('#itemStartOffset').val(delay);
           $('#itemstarttime').val('14:00');
       }
       $("body").append("<div id='posterName' style='display:none;'>" + info['name'] + "</div>");
    }
});


$('p:contains("Description"), strong:contains("Title"), font:contains("characters remaining"), strong:contains("Category"), #s1').addClass('section2');
$('#shipCalcContainer, font:contains("leave at"), .shippingOptions, font:contains("Shipping Charge"), span:contains("Unlock shipping"), b:contains("Shipping"), #shipMethodLock, #itemShipMethod, b:contains("Item Shipment"), input[name="itemNoCombineShipping"], #itemNoCombineShippingText, b:contains("Insurance"), #itemAutoInsurance, #itemAutoInsuranceText').not(':not(:visible)').addClass('section3');

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
       + "$('#itemBuyNowPrice').val(price);"
    + "}"
+ "</script>");


$('#itemShipMethod option[value=\"3\"]').text('Post Office');

$("#itemSellerInfo").after("<b>Note to shipping:</b><br><textarea id='noteToShipping' rows='2' cols='40'></textarea><br>");

var sgwTimeouts = window.setTimeout(function(){
    presetCount = $('.presetSpan').length;
    if (presetCount <= 1) {
        $('#myPresets').hide();
    }
    function processPresets(presets){
        function checkPreset(presets, key) {
            if (typeof presets[key] != 'undefined' && presets[key].length > 0) {
                return true;
            } else {
                return false;
            }
        }
        if (checkPreset(presets, 'Dimension 1')) {
            $('#dim1').val(presets['Dimension 1']);
        } else {
        }
        if (checkPreset(presets, 'Dimension 2')) {
            $('#dim2').val(presets['Dimension 2']);
        }
        if (checkPreset(presets, 'Dimension 3')) {
            $('#dim3').val(presets['Dimension 3']);
        }
        if (checkPreset(presets, 'Display Weight')) {
            $('#actualWeight').val(presets['Display Weight']);
            $('#itemDisplayWeight').val(presets['Display Weight']);
        }
        if (checkPreset(presets, 'Duration')) {
            $('#itemDuration').val(presets['Duration']);
        }
        if (checkPreset(presets, 'Location')) {
            $('#itemSellerInventoryLocationID').val(presets['Location']);
        }
        if (checkPreset(presets, 'Ship Charge')) {
            $('#itemShippingPrice').val(presets['Ship Charge']);
            dummyWeight();
            shippingMethod('USPS');
        }
        if (checkPreset(presets, 'Ship Type')) {
             shipType = presets['Ship Type'].toLowerCase();
             if(shipType == 'media') {
                 if ($('#actualWeight').val().length < 1) {
                     weightPrompt();
                 }
                 doMedia($('#actualWeight').val());
             } else if (shipType == 'clothing') {
                 if ($('#actualWeight').val().length < 1) {
                     weightPrompt();
                 }
                 calculateUSPS($('#actualWeight').val());
             } else if (shipType == 'guitar' || shipType == 'art' || shipType == 'long') {
                 $('#currentShipCalcType').val(shipType);
                 $('#calc-'+shipType).css('background-color', '#AAA');
             }
        }
        if (checkPreset(presets, 'Ship in own box/between cardboard') && presets['Ship in own box/between cardboard'].toLowerCase() == 'yes') {
            $('#ownBox:visible:enabled').prop('checked', true);
        }
        if (checkPreset(presets, 'Shipping Weight')) {
            $('#itemWeight').val(presets['Shipping Weight']);
        }
        if (checkPreset(presets, 'Skip') && $('#docready3').length < 1) {
            $("head").append("<script id='docready3'>$(document).ready(function() {"
			    + "myURL = document.URL;"
			    + "if (myURL.indexOf('reviewItem') > 0) {"
				   + "$('#submit').trigger('click');"
			    + "}"
		    + "});</script>");
        }
        if (checkPreset(presets, 'Store')) {
            $('#itemsellerstore').val(presets['Store']);
        }
    }
    processPresets(presets);
    
    $('#galleryCB2').bind('click', function(){
       $("#itemGallery").trigger("click");
    });
    
    $('#featureCB2').bind('click', function(){
       $("#itemFeatured").trigger("click");
    });
    
    $('#premiumItem').bind('click', function(){
       if ($('#premiumItem:checked').length > 0) {
          premiumItem(true);
       } else {
           premiumItem(false);
       }
    });
    
    function premiumItem(willBePremium) {
        $('#premiumItem').prop('checked', willBePremium);
        if (baseDuration == 0) {
            baseDuration = $('#itemDuration').val();
        }
        if (willBePremium) {
            var now = new Date();
            var currentDate = now.getDate();
            var itemStartDay = now.getDay();
            itemStartDay += ($('#itemStartOffset').val()*1); // if it's not starting today...
            var itemDuration = 10 - (itemStartDay%7); // This gets you the number of days from the start day until the FOLLOWING Wednesday - Wednesday of the next week
            if (Math.floor(Math.random() * 2) == 1) {
                itemDuration += 1; // based on a coin flip, end on the Wednesday or add a 1 and end on the Thursday
            }
            $('#itemDuration').val(itemDuration);
            unlockDuration(false);
            unlockStartingPrice(false);
            $('#itemMinimumBid, startingPriceInput').val('9.99');
        } else {
            $('#itemDuration').val(baseDuration);
            $('#galleryCB2, #featureCB2, #itemGallery, #itemFeatured').prop('checked', false).removeProp('disabled');
            unlockDuration(true);
            unlockStartingPrice(false);
            $('#itemMinimumBid, startingPriceInput').val('5.95');
        }
        endDay();
        if ($('#galleryCB2:checked').length > 0) {
            var elements = $('tr, td, div, .colorChanged').filter(function(){
                var color = $(this).css("background-color").toLowerCase();
                return color === "#ffc700" || color === "rgb(255, 199, 0)" || $(this).is('.colorChanged');
            });
            elements.css('background-color' , '#11aaff');
            elements.addClass('colorChanged');
        } else if ($('#featureCB2:checked').length > 0) {
            var elements = $('tr, td, div, .colorChanged').filter(function(){
                var color = $(this).css("background-color").toLowerCase();
                return color === "#ffc700" || color === "rgb(255, 199, 0)" || $(this).is('.colorChanged');
            });
            elements.css('background-color' , '#57e727');
            elements.addClass('colorChanged');
        } else {
            var elements = $('.colorChanged');
            elements.css('background-color' , '#ffc700');
            elements.removeClass('colorChanged');
        }
    }
    
    function endDay() {
        $('#itemDurationRow').show();
        var now = new Date();
        var currentDate = now.getDate();
        var itemStartDay = now.getDay();
        itemStartDay += ($('#itemStartOffset').val()*1); // if it's not starting today...
        var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var endDay = (itemStartDay+$('#itemDuration').val()*1)%7;
        $('#endDay').html(weekdays[endDay]);
        $('#durationInput').val($('#itemDuration').val());
        
        $('#itemStartingPriceRow').show();
        $('#startingPriceInput').val($('#itemMinimumBid').val());
    }
    
    function linkInputs(firstID, secondID) {
        $('#'+firstID).bind('keyup, paste, focusout', function(){
           $('#'+secondID).val($(this).val());
           console.log('butts');
        });
        $('#'+secondID).bind('keyup, paste, focusout', function(){
           $('#'+firstID).val($(this).val());
            console.log('butts');
        });
    }
    
    linkInputs('startingPriceInput', 'itemMinimumBid');
    
    $('#durationInput').bind('keyup', function(){
        var duration = $('#durationInput').val().replace(/\D/, ''); // don't allow characters except digits - no letters, partial numbers, negatives, etc.
        $('#durationInput').val(duration);
        if ($('#durationInput').val().indexOf('NaN') >= 0) {
            $('#durationInput').val('');
        }
        if (duration.length > 0) {
            duration = Math.max(1, Math.min(duration, 30)); // constrain duration between 1 and 30 days
            if (duration > 15) {
                // replace select with input
                $('#itemDuration').replaceWith("<input id='itemDuration' tabindex='-1' name='itemDuration' size='1'>");
            }
            $('#itemDuration').val(duration);
            endDay();
        }
    });
    
    function unlockDuration(unlock) {
        $('#unlockDuration').prop('checked', unlock);
        if (unlock) {
            $('#durationInput').removeProp('disabled');
        } else {
            $('#durationInput').prop('disabled', true);
        }
    }
    
    function unlockStartingPrice(unlock) {
        $('#unlockStartingPrice').prop('checked', unlock);
        if (unlock) {
            $('#startingPriceInput').removeProp('disabled');
        } else {
            $('#startingPriceInput').prop('disabled', true);
        }
    }
    
    $('#unlockDuration').click(function() {
        unlockDuration($('#unlockDuration:checked').length > 0);
    });
    
     $('#unlockStartingPrice').click(function() {
        unlockStartingPrice($('#unlockStartingPrice:checked').length > 0);
    });
    
    $('#itemTitle').bind('keyup', function(){
        $("#myCounter").html(50-$('#itemTitle').val().length);
    });
    
/*    $('td:contains(\"Item information\")').click(function(){
        $('.section2').toggle(); // windowshades
    });
    $('div:contains(\"Step 3 - Shipping\")').click(function(){
        $('.section3').toggle();
        $('br+br').toggle();
        $('p:empty').toggle();
    });
*/ 
    $('#itemGallery').bind('change', function(){
        if ($('#itemGallery:checked').length > 0) {
            $('#galleryCB2').prop('checked', true);
            $('#featureCB2, #itemFeatured').prop('checked', false).prop('disabled', true);
            $('#premiumItem').prop('disabled', true);
            premiumItem(true);
        } else {
            $('#galleryCB2').prop('checked', false);
            $('#featureCB2, #itemFeatured, #premiumItem').removeProp('disabled');
            premiumItem(false);
        }
    });
    
    $('#itemFeatured').bind('change', function(){
        if ($('#itemFeatured:checked').length > 0) {
            $('#featureCB2').prop('checked', true);
            $('#premiumItem').prop('disabled', true);
            premiumItem(true);
        } else {
            $('#featureCB2').prop('checked', false);
            $('#premiumItem').removeProp('disabled');
            premiumItem(false);
        }
    });
    
    $('#submit1').bind('click', function(e){
        e.preventDefault();
        if ($('.shipCalcInput:focus'). length < 1) {
            var submitForm = true;
            var itemDescription = '';
            if (typeof $('#WebWizRTE').contents()[0]['body']['innerText'] != 'undefined') {
               itemDescription = $('#WebWizRTE').contents()[0]['body']['innerText'].replace(/(?:\r\n|\r|\n)/g, '');
               if (itemDescription.length < 10) {
                  alert('Please enter a description!');
                  submitForm = false;
               }
            }
            var myCat = $('#s1').val();
            while ($('#itemTitle').val().length < 1) {
                $('#itemTitle').val(prompt('Item title?'));
            }
            if ($('#itemWeight').val().length < 1) {
                if ($('#currentShipCalcType').val() == 'USPS') {
                    while ($('#itemWeight').val().length < 1) {
                        var weight = prompt("Item's weight?");
                        $('#itemWeight').val(weight);
                        $('#itemDisplayWeight').val(weight);
                    }
                } else if ($('#currentShipCalcType').val() == 'pickup') {
                    $('#itemWeight').val(150);
                } else {
                    alert('Please enter shipping information!');
                    $('.calcInput:empty').first().focus();
                    submitForm = false;
                }
            }
            while ($('#itemDisplayWeight').val().length < 1) {
                $('#itemDisplayWeight').val(prompt('Item\'s actual weight?'));
            }
            while ($('#itemsellerstore').val() == '') {
                var store = prompt('Store number?');
                if (store == '999') {
                    store = '999 - Mixed Locations';
                }
                $('#itemsellerstore').val(store);
            }
            while ($('#itemSellerInventoryLocationID').val().length < 1) {
                $('#itemSellerInventoryLocationID').val(prompt('Location?'));
            }

            if (submitForm === true) {
                if ($('#itemsellerstore').val() == '999') {
                    $('#itemsellerstore').val('999 - Mixed Locations');
                }
                var shipString = '<b>OLoc: ' + $('#itemSellerInventoryLocationID').val()+"</b><br>";
                shipString += '{{';
                if ($('#Clothing').css('background-color') == 'rgb(170, 170, 170)') {
                    shipString += 'clth:'+$('#actualWeight').val()+'#';
                    if ($('#itemShipMethod').val() == 2) {
                        shipString += '/' + $('#dim1').val() + 'x' + $('#dim2').val() + 'x' + $('#dim3').val();
                    }
                } else if ($('#Media').css('background-color') == 'rgb(170, 170, 170)') {
                    shipString += 'mdia:'+$('#actualWeight').val()+'#';
                } else {
                    if ($('#currentShipCalcType').val() == 'general') {
                        shipString += 'gen:';
                    } else if ($('#currentShipCalcType').val() == 'guitar') {
                        shipString += 'guit:';
                    } else if ($('#currentShipCalcType').val() == 'art') {
                        shipString += 'art:';
                    } else if ($('#currentShipCalcType').val() == 'long') {
                        shipString += 'long:';
                    }
                    shipString += $('#actualWeight').val() + '#';
                    if ($('#dim1').val().length > 0 && $('#dim2').val().length > 0 && $('#dim3').val().length > 0) {
                      shipString += '/' + $('#dim1').val() + 'x' + $('#dim2').val() + 'x' + $('#dim3').val();
                    }
                }
                if ($('#ownBox:checked').length > 0) {
                    shipString += ':ownBox';
                }
                shipString += '}}';
                if ($('#currentShippingNote').length > 0) {
                    if ($('#currentShippingNote').val().length > 0) {
                      shipString+= '<br><br>' + $('#currentShippingNote').val();
                    }
                }
                console.log(shipString);
                if ($('#noteToShipping').val().length > 0) {
    //                $('#itemSellerInfo').val($('#itemSellerInfo').val()+'<br><br><b>Note from ' + $('#posterName').html() + ': </b>' + $('#noteToShipping').val());
                    shipString += ('<br><br><b>Note from ' + $('#posterName').html() + ':</b> ' + $('#noteToShipping').val()).substring(0,200);
                }   // .substring() here so that the note doesn't exceed 200 characters, ballsing up the post
                if ($('#premiumItem:checked').length > 0) {
                    shipString += '|P';
                }
                
                $('#itemSellerInfo').val(shipString);

                combineCheck();

                var myLoc = $('#itemSellerInventoryLocationID').val();
                var myTitle = $('input[name=\"itemTitle\"]').val();
                saveLocation = JSON.stringify({'lastLocation': myLoc, 'lastTitle': myTitle});
                window.postMessage (saveLocation, '*');
 
                $('#form1').submit();
            }
        } else {
            if ($('#dim1').val().length && $('#dim2').val().length && $('#dim3').val().length) {
                if ($('#currentShipCalcType').val().length) {
                    $('.useButton:visible').first().trigger('click');
                } else {
                    $('#calc-general').trigger('click');
                }
            } else {
                var switched = false;
                $('.shipCalcInput').each(function(){
                    if ($(this).val().length < 1 && switched == false) {
                        $(this).focus();
                        switched = true;
                    }
                });
            }
        }
    });
    
    
/*    $('#submit1').after("<div id='checkCombine'>check</div>");
    $('#checkCombine').bind('click', function(){
        combineCheck();
    });*/
    
    function combineCheck(){
        console.log('dsf');
        var noCombine = false;
        var myWeight = $('#itemWeight').val();
        if (myWeight >= 20) {
            noCombine = true;
        } else {
            var myCat = $('#s1').val();
            var badCats = ['Paintings', 'Prints', 'Strings', 'Brass', 'Formalwear', 'Outerwear', 'Wedding > Dresses', 'Lamps', 'Dinnerware', 'Sewing Machines', 'Typewriters', 'Receivers', 'Turntables', 'Dinnerware'];
            $.each(badCats, function(index, category){
               if (myCat.indexOf(category) >= 0)  {
                   noCombine = true;
                   console.log('badCat: ' + category);
               }
            });
            if (noCombine == false) {
               var myDescription = '';
               if (typeof $('#WebWizRTE').contents()[0]['body']['innerText'] != 'undefined') {
                  var myDesc = $('#WebWizRTE').contents()[0]['body']['innerText'].replace(/(?:\r\n|\r|\n)/g, '').toLowerCase();
                  var re = new RegExp(".+?(?=check out our other)");
                  var match = myDesc.match(re);
                  if (match !== null) {
                     myDescription = match[0];
                  }
               }
               var myTitle = $('#itemTitle').val().toLowerCase();
               var badWords = ['Framed', 'Saxophone', 'Guitar', 'Keyboard', 'Trombone', 'Telescope', 'Saxophone', 'Lamp', 'Snowboard', 'Skateboard', 'Glass', 'Crystal', 'Cast iron', 'Tool', 'Drum', 'Sewing machine', 'Typewriter', 'Printer', 'Desktop', 'Receiver', 'Turntable', 'Monitor'];
                console.log(myDescription);
                console.log(myTitle);
               $.each(badWords, function(index, word){
                   word = word.toLowerCase();
                   if (myDescription.indexOf(word) >= 0 || myTitle.indexOf(word) >= 0)  {
                       noCombine = true;
                       console.log('badWord: '+word);
                   } else {
                   }
               });
               if (noCombine == false && (myCat.indexOf('Speaker') || myTitle.indexOf('speaker') || myDescription.indexOf('speaker')) && myWeight > 5) {
                   noCombine = true;
                   console.log('badWeight (speaker)');
               }
            }
        }
        if (noCombine == true) {
            $('#itemNoCombineShipping').prop('checked', true);
        } else {
            $('#itemNoCombineShipping').removeProp('checked');
        }
    }
    
    function dummyWeight() {
        if ($('#itemWeight').val().length < 1) {
           $('#itemWeight').val(1);
        }
        if ($('#itemDisplayWeight').val().length < 1) {
            $('#itemDisplayWeight').val(1);
        }
    }
    
    $('.upsButton').bind('click', function(){
        useSuggestion('UPS');
    });
    $('.uspsButton').bind('click', function(){
        useSuggestion('USPS');
    });
    $('.pickupOnlyButton').bind('click', function(){
        useSuggestion('pickup');
    });
    
    function buttonClickAnimate(button) {
           $('.useButton').css({'background-color' : '#cce0ff'});
           button.css({'background-color' : darken(button.css('background-color'), .1)})
    }
    function darken(color, modifier) {
        var parts = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        delete(parts[0]);
        for (var i = 1; i <= 3; ++i) {
            parts[i] = Math.min(Math.ceil(parts[i]*(1-modifier)), 255);
        }
        return 'rgb(' + parts[1] + ',' + parts[2] + ',' + parts[3] + ')';
    }
    function darkenElement(element, modifier) {
        var bgColor = element.css('background-color');
        dark = darken(bgColor, modifier);
        darker = darken(bgColor, modifier*2);
        console.log(dark);
        console.log(darker);
        element.css({'background-color' : darker, /*'border-color' : borderColor*/}).animate({
            'background-color' : dark,
        }, 500);
        
    }
    
    function weightPrompt() {
        var displayWeight = Math.ceil($('#addPounds').html());
        while ($('#actualWeight').val().length < 1) {
           var actualWeight = prompt('Item\'s actual weight?');
           actualWeight = actualWeight.replace(/[^\d.-]/g,'');
           $('#actualWeight').val(actualWeight);
          displayWeight += Math.ceil(actualWeight);
           $('#calc-'+$('#currentShipCalcType').val()).trigger("click");
        }
        
        $('#itemDisplayWeight').val(displayWeight);
    }
    
    $('#calc-media').bind('click', function(){
        $('.fakeButton').css({'background-color' : '#eee'});
        buttonClickAnimate($(this));
        $('#Media') .trigger('click');
    });
    
    $('#calc-clothing').bind('click', function(){
        $('.fakeButton').css({'background-color' : '#eee'});
        buttonClickAnimate($(this));
        weightPrompt();
        var weight = parseFloat($('#actualWeight').val());
        $('#itemDisplayWeight').val(weight);
        calculateUSPS(weight);
    });
    
    function calculateUSPS(weight) {
        if (weight >= 3) {
            $('#UPS').trigger('click');
        } else {
            if (weight < .56) {
                charge = 2.99;
            } else if (weight < 1) {
                charge = 3.99;
            } else if (weight < 2) {
                charge = 6.99;
            } else {
                charge = 8.99;
            }
            $('#itemShippingPrice').val(charge);
            shippingMethod('USPS');
        }
    }
    
    $('.shipCharge').bind('click', function(){
        $('.shipType').css('background-color', '#EEE');
        $(this).css('background-color', '#AAA');
        var thisBox = $(this).text();
        var boxData = $('#boxDefinitions').data()[thisBox];
        weightPrompt();
        if (thisBox == 'Media') {
            doMedia($('#actualWeight').val());
            
        } else if (thisBox == 'Clothing' || thisBox == 'Small&light') {
            $('#calc-clothing').trigger('click');
        } else if (boxData['method'] == 'USPS') {
            $('#itemDisplayWeight').val($('#actualWeight').val());
            $('#itemWeight').val($('#actualWeight').val());
            $('#itemShippingPrice').val(boxData['price']);
            $('#shipTypeNote') == thisBox;
        } else if (boxData['method'] == 'UPS') {
            $('#itemDisplayWeight').val($('#actualWeight').val());
            realWeight = Math.ceil($('#actualWeight').val())+Math.ceil($('#addInches').html());
            if (realWeight > boxData['weight']) {
                $('#itemWeight').val(realWeight);
            } else {
               $('#itemWeight').val(boxData['weight']);
            }
            $('#shipTypeNote') == boxData['note'];
        }
        if (boxData['method'].length > 0) {
//            console.log('.shipCharge():'+boxData['method']);
            shippingMethod(boxData['method']);
        }
    });
    
    function useSuggestion(type) {
        var buttonAnimateString = '.' + type;
        if (type == 'pickup') {
            buttonAnimateString += 'Only';
        }
        buttonAnimateString += 'Button:visible'
        buttonClickAnimate($(buttonAnimateString));
        if (type == 'pickupOnly') {
            type = 'pickup';
        }
        shippingMethod(type);
        weightPrompt();
        $('#itemDisplayWeight').val($('#actualWeight').val());
        if (type == 'UPS') {
            $('#itemWeight').val($('#shipCalcShippingWeight').html());
        } else if (type == 'USPS') {
            $('#itemWeight').val($('#actualWeight').val());
            $('#itemShippingPrice').val($('#uspsSuggPrice').html());
        } else if (type == 'pickup') {
            $('#itemWeight').val(150);
        }
    }
    
    $('#UPS').bind('click', function(){
       weightPrompt();
       dimList = [$('#dim1').val(), $('#dim2').val(), $('#dim3').val()];
       $.each(dimList, function(index, dim){
           index+=1;
           while (dim.length < 1) {
               dim = prompt('Dimension ' + index);
               $('#dim'+index).val(dim);
           }
       });
       $('#calc-'+$('#currentShipCalcType').val()).trigger('click'); 
       if($('.upsButton:visible').length > 0) {
          useSuggestion('UPS');
       } else {
          useSuggestion('pickup');
       }
    });
    
    $('#pickupOnly').bind('click', function(){
       weightPrompt();
       shippingMethod('pickup');
    });
    
    function shippingMethod(method)  {
        $('#UPS, #pickup').css('background-color', '#EEE');
        $('#itemShipMethod > option').removeAttr('selected');
        if (method == 'UPS') {
           $('#itemShipMethod').val(2);
           $('#itemAutoInsurance').removeProp('checked');
           $('#itemShippingPrice').val(0);
           $('#UPS').css('background-color', '#AAA');
        } else if (method =='pickup') {
           $('#itemShipMethod').val(0);
           $('#itemAutoInsurance').removeProp('checked');
           $('#itemShippingPrice').val(0);
           $('#itemWeight').val(150);
           $('#pickupOnly').css('background-color', '#AAA');
        } else if (method == 'USPS') {
           $('#itemShipMethod').val(3);
           $('#itemAutoInsurance').prop('checked', true);
           $('#itemWeight').val(Math.ceil($('#actualWeight').val()) + Math.ceil($('#addPounds').html()));
        }
    }

    function getCharge(myWeight) {
        console.log('getCharge:'+myWeight);
        if (myWeight <= 3) {
            return '3.99';
        } else if (myWeight <= 6) {
            return '5.99';
        } else if (myWeight <= 10) {
            return '7.99';
        } else if (myWeight <= 13) {
            return '8.99';
        } else if (myWeight <= 15) {
            return '9.99';
        } else if (myWeight <= 19) {
            return '11.99';
        } else if (myWeight <= 25) {
            return '15.99';
        } else if (myWeight <= 27) {
            return '16.99';
        } else if (myWeight <= 29) {
            return '17.99';
        } else if (myWeight <= 31) {
            return '18.99';
        } else if (myWeight <= 33) {
            return '19.99';
        } else if (myWeight <= 35) {
            return '20.99';
        } else if (myWeight <= 37) {
            return '21.99';
        } else if (myWeight <= 39) {
            return '22.99';
        } else if (myWeight <= 41) {
            return '23.99';
        } else if (myWeight <= 43) {
            return '24.99';
        } else if (myWeight <= 45) {
            return '25.99';
        } else if (myWeight <= 47) {
            return '26.99';
        } else if (myWeight <= 49) {
            return '27.99';
        } else if (myWeight <= 51) {
            return '28.99';
        } else if (myWeight <= 53) {
            return '29.99';
        } else if (myWeight <= 55) {
            return '30.99';
        } else if (myWeight <= 57) {
            return '31.99';
        } else if (myWeight <= 59) {
            return '32.99';
        } else if (myWeight <= 61) {
            return '33.99';
        } else if (myWeight <= 63) {
            return '34.99';
        } else if (myWeight <= 65) {
            return '35.99';
        } else if (myWeight <= 67) {
            return '36.99';
        } else if (myWeight <= 68) {
            return '37.99';
        } else if (myWeight <= 69) {
            return '38.99';
        } else if (myWeight <= 70) {
            return '39.99';
        }
	}
    function doMedia(weight) {    
        console.log('media:'+weight);
        var myCharge;
        if (weight < 50) {
            myCharge = getCharge(weight);
        } else if (weight < 70) {
            myCharge = 2 * getCharge(weight/2);
        } else {
            if (weight <= 140) {
                weight /= 2;
                myCharge = 2.25 * getCharge(weight);
            } else if (weight <= 210) {
                weight /= 3;
                myCharge = 3.5 * getCharge(weight);
            }
            myCharge = (Math.ceil(myCharge) - .01)
        }
        
        $('#itemDisplayWeight').val(weight);
        $('#itemWeight').val(weight);
        $('#itemShippingPrice').val(myCharge);
        $('#shipTypeNote').val('Media');
        shippingMethod('USPS');
    }
    var gallery = false;
    $('b:contains("Uploaded Files")').parent().parent().siblings().each(function(){
       if($(this).children().first().text().indexOf(' Cropped') >= 0) {
           gallery = true;
       }
    });
    if (gallery) {
        $('#galleryCB2').trigger('click');
    }
    
}, 1100);

if (debug === true) {
    $('body').append("<div id='debugContainer'>Debug <input id='debugBox' type='checkbox'></div>");
    $('#debugContainer').css({
        'position' : 'absolute',
        'top' : '100px',
        'right' : '10px',
    });
    $('#debugBox').bind('click', function(){
        if ($('#debugBox:checked').length>0) {
           if ($('#debugOptionsContainer').length <= 0) {
               $('#form1, #noCombineShippingContainer, #autoInsuranceContainer').show();
               $('#noCombineShippingContainer, #autoInsuranceContainer').wrapAll("<div id='debugOptionsContainer' style='margin: 8px; padding: 10px; border: 1px solid #CCC;'></div>");
               $('#itemLength').parent().parent().appendTo($('#debugOptionsContainer')).show();
               $('#itemShipLength').parent().parent().appendTo($('#debugOptionsContainer')).show();
               $('#debugOptionsContainer span, #debugOptionsContainer br').remove();
           } else {
               $('#debugOptionsContainer').show();
           }
        } else {
            $('#debugOptionsContainer').hide();
        }
    });
}

$('#incrementReserveBox').parent().parent().hide();
$('#UPS').css('background-color', "#AAA");




// End