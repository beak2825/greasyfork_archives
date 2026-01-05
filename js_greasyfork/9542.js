// ==UserScript==
// @name         Steve Sears
// @namespace    https://greasyfork.org/en/users/10782
// @version      0.3001
// @description  Added buttons that auto fill yes, no and n/a. Also makes instructions hidable.
// @author       tismyname
// @include      https://www.mturkcontent.com/dynamic/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/9542/Steve%20Sears.user.js
// @updateURL https://update.greasyfork.org/scripts/9542/Steve%20Sears.meta.js
// ==/UserScript==

$(".panel-heading").before('<label><input type="checkbox" id="toggler">Show/Hide Instructions</input><br></label>')
$(".panel-heading").hide();
$(".panel-body").hide();

$('#toggler').click(function() {
    $(".panel-heading").toggle();
    $(".panel-body").toggle();
});    
               

var link = $('a[href]').attr('href');


// Grabs parent div to manipulate since it has no id
var $parentDiv1 = $('#marketing_company').parent();

$parentDiv1.prepend('<a href="' + link + '" target="_new">'+link+'</a> <br>');
//$parentDiv1.prepend('<button id="button">Show/Hide Instructions</button><br>');

// Radio buttons so you don't have to type
var radioList = [   '<label><input type="radio" name="marketing_company" value="Yes"> Yes</label>',
                    '<label><input type="radio" name="marketing_company" value="No"> No</label>',
                    '<label><input type="radio" name="marketing_company" value="N/A"> N/A</label>', 
                ].join('\n');
// append radio buttons                 
$parentDiv1.append(radioList);
 
var $parentDiv2 = $('#postalcode').parent();
$parentDiv2.append('<label><input type="radio" name="postalcode" value="N/A"> N/A</label>');                 
                 
var $parentDiv3 = $('#country').parent();
$parentDiv3.append('<label><input type="radio" name="country" value="N/A"> N/A</label>');  
                 
// auto fill input based on selection
$('input[type="radio"]').on('change', function() {
    var name = this.name;
    if(name == 'marketing_company')
        $('#marketing_company').val($(this).val());      
    else if(name == 'postalcode')
        $('#postalcode').val($(this).val());
    else                 
        $('#country').val($(this).val());
});
                 
  


                                  