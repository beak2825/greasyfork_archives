// ==UserScript==
// @name       a button to search only no translated files for g.hentai(E-Hentai) 
// @namespace  namespace
// @version    0.4
// @description  Create a button to search only no translated files for g.hentai(E-Hentai) 
// @require http://code.jquery.com/jquery-2.1.1.min.js
// @include    http://g.e-hentai.org/*
// @copyright  2014+, yoyoi
// @downloadURL https://update.greasyfork.org/scripts/5668/a%20button%20to%20search%20only%20no%20translated%20files%20for%20ghentai%28E-Hentai%29.user.js
// @updateURL https://update.greasyfork.org/scripts/5668/a%20button%20to%20search%20only%20no%20translated%20files%20for%20ghentai%28E-Hentai%29.meta.js
// ==/UserScript==

$(function() {

//create form 
frm = $("<input>");
frm
  .attr("type", "button")
  .attr("name", "no_translated")
  .attr("value", "no translated")
  .attr("class", "stdbtn")
  .attr('onclick', "this.className='stdbtn_clicked'");
$("input[name=f_apply]").after(frm);

// command setting 
$(window).keydown(function(e) {
  if(e.ctrlKey) {
    if(e.keyCode ===  13) {
      notrans_filter();
      return false;
    }
  }
});


frm.click(function() {
  notrans_filter();  
});


//define function 
function notrans_filter() {
  search_val = $("input[name=f_search]").val();
 
  if(!search_val.match(/(-translated)/)) {
    value = search_val + " -translated";
    $("input[name=f_search]").val(value);
  } 
  
  $("input[name=f_apply]").click();
   
}


  
});

