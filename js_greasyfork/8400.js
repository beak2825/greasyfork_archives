// ==UserScript==
// @name       jawz Peter Hseih
// @author		jawz
// @version    1.8
// @description Petahhh
// @match      https://www.mturkcontent.com/*
// @match      https://s3.amazonaws.com/*
// @match      https://www.google.com/evaluation/endor/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/8400/jawz%20Peter%20Hseih.user.js
// @updateURL https://update.greasyfork.org/scripts/8400/jawz%20Peter%20Hseih.meta.js
// ==/UserScript==

////Not Relevant////
function notRelevant() {
    $(':input').not(':button, :submit, :reset, :hidden, :checkbox, :radio').val('');
    $(':checkbox, :radio').prop('checked', false);
    $( "input[name='relevant'][value='No']" ).prop( "checked", true );
    $( "input[name='native_language'][value='Yes']" ).prop( "checked", true );
}

function demographics() {
    $( "input[name='nature-study'][value='No']" ).prop( "checked", true );
    $( "input[name='dpep-announcement'][value='No']" ).prop( "checked", true );
    $( 'select[name="author-age"]').val("Don\'t know/Unsure");
    $( 'input[name="author-gender"][value="Don\'t know/Unsure"]' ).prop( "checked", true );
    $( 'input[name="author-ethnicity"][value="Don\'t know/Unsure/Not Applicable"]' ).prop( "checked", true );
    $( 'input[name="isDoctor"][value="Don\'t know/Unsure"]' ).prop( "checked", true );
    $( "input[name='native_language'][value='Yes']" ).prop( "checked", true );
}

////Product Use, Recipe////
function productUse() {
    $( "input[name='relevant'][value='Yes']" ).prop( "checked", true );
    $( "input[name='sentiment'][value='5']" ).prop( "checked", true );
    $( 'select[name="topic"]').val("Product Use/Benefits");
    var optgroup = $('select optgroup[label="Product Use/Benefits"]')
    var option = optgroup.find('option[value="Use in Recipe"]')
    option.attr('selected', true)
    demographics();
}

////Health Causes Disease////
function healthBad() {
    $( "input[name='relevant'][value='Yes']" ).prop( "checked", true );
    $( "input[name='sentiment'][value='1']" ).prop( "checked", true );
    $( 'select[name="topic"]').val("Health");
    var optgroup = $('select optgroup[label="Health"]')
    var option = optgroup.find('option[value="Causes Disease/Medical Condition"]')
    option.attr('selected', true)
    demographics();
}

////Causes Weight Gain////
function weightGain() {
    $( "input[name='relevant'][value='Yes']" ).prop( "checked", true );
    $( "input[name='sentiment'][value='1']" ).prop( "checked", true );
    $( 'select[name="topic"]').val("Health");
    var optgroup = $('select optgroup[label="Health"]')
    var option = optgroup.find('option[value="Causes Weight Gain/Obesity"]')
    option.attr('selected', true)
    demographics();
}

////Other Product Marketing////
function otherMarketing() {
    $( "input[name='relevant'][value='Yes']" ).prop( "checked", true );
    $( "input[name='sentiment'][value='4']" ).prop( "checked", true );
    $( 'select[name="topic"]').val("Product Use/Benefits");
    var optgroup = $('select optgroup[label="Product Use/Benefits"]')
    var option = optgroup.find('option[value="Other"]')
    option.attr('selected', true)
    $( "input[name='sub-topic-other']" ).val("Marketing")
    demographics();
}

////Safety Not Safe////
function notSafe() {
    $( "input[name='relevant'][value='Yes']" ).prop( "checked", true );
    $( "input[name='sentiment'][value='1']" ).prop( "checked", true );
    $( 'select[name="topic"]').val("Safety");
    var optgroup = $('select optgroup[label="Safety"]')
    var option = optgroup.find('option[value="Product is Not Safe"]')
    option.attr('selected', true)
    demographics();
}

////Safety Is Safe////
function isSafe() {
    $( "input[name='relevant'][value='Yes']" ).prop( "checked", true );
    $( "input[name='sentiment'][value='5']" ).prop( "checked", true );
    $( 'select[name="topic"]').val("Safety");
    var optgroup = $('select optgroup[label="Safety"]')
    var option = optgroup.find('option[value="Product is Safe"]')
    option.attr('selected', true)
    demographics();
}

if (document.getElementsByName("topic")) {
    window.onbeforeunload = function (e) {
        popupW.close();
    }
    
    var elink = document.links
    elink = elink[0].href
    console.log(elink);
    
    var halfScreen = screen.width/2; 
    var windowHeight = screen.height; 
    var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";
    popupW = window.open(elink,'remote','height=' + windowHeight + ',width=' + halfScreen + ', left=' + halfScreen + ',top=0' + specs,false);

    var btn = document.createElement("BUTTON");
    btn.innerHTML = "Not Relevant";
    btn.type = "button";
    btn.onclick = function() { notRelevant(); }

    $('p:contains("Here")').append ('<br>');
    $('p:contains("Here")').append (btn);
	
    var btn1 = document.createElement("BUTTON");
    btn1.innerHTML = "Use In Recipe";
    btn1.type = "button";
    btn1.onclick = function() { productUse(); }

    $('p:contains("Here")').append (btn1);

    var btn2 = document.createElement("BUTTON");
    btn2.innerHTML = "Product Is Not Safe";
    btn2.type = "button";
    btn2.onclick = function() { notSafe(); }

    $('p:contains("Here")').append (btn2);

    var btn13 = document.createElement("BUTTON");
    btn13.innerHTML = "Product Is Safe";
    btn13.type = "button";
    btn13.onclick = function() { isSafe(); }

    $('p:contains("Here")').append (btn13);
    
    var btn3 = document.createElement("BUTTON");
    btn3.innerHTML = "Causes Disease";
    btn3.type = "button";
    btn3.onclick = function() { healthBad(); }

    $('p:contains("Here")').append (btn3);
    
    var btn14 = document.createElement("BUTTON");
    btn14.innerHTML = "Causes Weight Gain";
    btn14.type = "button";
    btn14.onclick = function() { weightGain(); }

    $('p:contains("Here")').append (btn14);
    
    var btn14 = document.createElement("BUTTON");
    btn14.innerHTML = "Marketing";
    btn14.type = "button";
    btn14.onclick = function() { otherMarketing(); }

    $('p:contains("Here")').append (btn14);
    
    $('p:contains("Here")').append ('<br><br>');
    $('p:contains("Here")').append ( $( 'select[name="author-age"]') );
    $('p:contains("Here")').append ('<br><br>');
    
    var btn5 = document.createElement("BUTTON");
    btn5.innerHTML = "Male";
    btn5.type = "button";
    btn5.onclick = function() { $( 'input[name="author-gender"][value="Male"]' ).prop( "checked", true ); }

    $('p:contains("Here")').append (btn5);
    
    var btn6 = document.createElement("BUTTON");
    btn6.innerHTML = "Female";
    btn6.type = "button";
    btn6.onclick = function() { $( 'input[name="author-gender"][value="Female"]' ).prop( "checked", true ); }

    $('p:contains("Here")').append (btn6);
    $('p:contains("Here")').append ('<br><br>');
    
    var btn7 = document.createElement("BUTTON");
    btn7.innerHTML = "Hispanic or Latino";
    btn7.type = "button";
    btn7.onclick = function() { $( 'input[name="author-ethnicity"][value="Hispanic or Latino"]' ).prop( "checked", true ); }

    $('p:contains("Here")').append (btn7);    
    
    var btn8 = document.createElement("BUTTON");
    btn8.innerHTML = "American Indian or Alaska Native";
    btn8.type = "button";
    btn8.onclick = function() { $( 'input[name="author-ethnicity"][value="American Indian or Alaska Native"]' ).prop( "checked", true ); }

    $('p:contains("Here")').append (btn8); 

    var btn9 = document.createElement("BUTTON");
    btn9.innerHTML = "Asian";
    btn9.type = "button";
    btn9.onclick = function() { $( 'input[name="author-ethnicity"][value="Asian"]' ).prop( "checked", true ); }

    $('p:contains("Here")').append (btn9); 
    
    var btn10 = document.createElement("BUTTON");
    btn10.innerHTML = "Black or African American";
    btn10.type = "button";
    btn10.onclick = function() { $( 'input[name="author-ethnicity"][value="Black or African American"]' ).prop( "checked", true ); }

    $('p:contains("Here")').append (btn10); 

    var btn11 = document.createElement("BUTTON");
    btn11.innerHTML = "Native Hawaiian or Other Pacific Islander";
    btn11.type = "button";
    btn11.onclick = function() { $( 'input[name="author-ethnicity"][value="Native Hawaiian or Other Pacific Islander"]' ).prop( "checked", true ); }

    $('p:contains("Here")').append (btn11);   
    
    var btn12 = document.createElement("BUTTON");
    btn12.innerHTML = "White";
    btn12.type = "button";
    btn12.onclick = function() { $( 'input[name="author-ethnicity"][value="White"]' ).prop( "checked", true ); }

    $('p:contains("Here")').append (btn12);   
    $('p:contains("Here")').append ('<br><br>');    
    $('p:contains("Here")').append ( $( 'input[name="author-location"]') );
    $('p:contains("Here")').append ('<br><br>');
    
    var btn13 = document.createElement("BUTTON");
    btn13.innerHTML = "Pepsi Yes";
    btn13.type = "button";
    btn13.onclick = function() { $( "input[name='dpep-announcement'][value='Yes']" ).prop( "checked", true ); }
    
    $('p:contains("Here")').append (btn13);  
    
    var btn14 = document.createElement("BUTTON");
    btn14.innerHTML = "Pepsi No";
    btn14.type = "button";
    btn14.onclick = function() { $( "input[name='dpep-announcement'][value='No']" ).prop( "checked", true ); }
    
    $('p:contains("Here")').append (btn14);  
    $('p:contains("Here")').append ('<br><br>');
    
    var btn4 = document.createElement("BUTTON");
    btn4.innerHTML = "Submit";
    btn4.type = "button";
    btn4.onclick = function() { 
        $('#submitButton').click(); 
    }

    $('p:contains("Here")').append (btn4);
    notRelevant()
}
