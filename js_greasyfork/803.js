// ==UserScript==
// @name       Bodyfashion Cooperatie Checkbox mass toggle script
// @namespace  http://bodyfashion.oswshop.nl/
// @version    0.3.1
// @description  Mass toggle checkboxes
// @match      http://www.burghlingerie.nl/provider/*
// @copyright  2014+, One Stop Webshop
// @author  	Daniel van der Mierden<daniel@one-stop-webshop.nl>
// @require		http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/803/Bodyfashion%20Cooperatie%20Checkbox%20mass%20toggle%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/803/Bodyfashion%20Cooperatie%20Checkbox%20mass%20toggle%20script.meta.js
// ==/UserScript==
$(document).ready(function() {

	// create nos link
    var noslink = "<a href='#' id='toggle_chk_btn'>NOS</a>";
    
    // replace text with link
    $("table.variants th:contains('NOS')").html(noslink);
  
    // add event
    $('#toggle_chk_btn').click(function() {
        // find last column
        $('table.variants tr.row').find('td:last').each(function() {
            // find checkbox and toggle its state
            // please note this only works if 'NOS' is the last column of the table.
        	$(this).find('input[type=checkbox]').attr('checked', !$(this).find('input[type=checkbox]').attr('checked') );
    	})
        return false;
    })

   	// create nos link
    var stocklink = "<a href='#' id='toggle_chk_stock_btn'>Voorraad</a>";
    

    $("table.variants th:contains('Voorraad')").html(stocklink);

    // add event
    $('#toggle_chk_stock_btn').click(function() {
        // find last column
        $('table.variants tr.row').find('td:last').each(function() {
            // find checkbox and toggle its state
            // please note this only works if 'NOS' is the last column of the table.
            if ($(this).find('input[type=checkbox]').attr('checked') ) {

                $(this).parent().find('td:eq(9) input').val(999);
            }    
    	})
        return false;
    })
})
