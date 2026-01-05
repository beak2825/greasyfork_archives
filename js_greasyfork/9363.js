// ==UserScript==
// @name        SGW Lister Postings/Sales Filterer - DEPRECATED
// @namespace   greasyfork.org
// @version     2.3.2
// @grant       none
// @require     http://code.jquery.com/jquery-2.1.3.js
// @require     https://greasyfork.org/scripts/13969-sgw-fixer-users/code/SGW%20Fixer%20-%20Users.js?upDate=20160914
// @include     https://sellers.shopgoodwill.com/sellers/listerpostings.asp*
// @include     https://sellers.shopgoodwill.com/sellers/listersales.asp*
// @description Filters the lister postings screen to one's own listings.
// @downloadURL https://update.greasyfork.org/scripts/9363/SGW%20Lister%20PostingsSales%20Filterer%20-%20DEPRECATED.user.js
// @updateURL https://update.greasyfork.org/scripts/9363/SGW%20Lister%20PostingsSales%20Filterer%20-%20DEPRECATED.meta.js
// ==/UserScript==

//var posters = JSON.parse();
//console.dir(posters);
//console.log($('#posterData').html());
var userNames = {
  "Alicia" : "ALICIAV",
  "Hetal" : "HETALS",
  "Jackie" : "JACKIEC",
  "Jacob" : "JACOB",
  "Jeff" : "JEFF",
  "Jeremy" : "JEREMYJ",
  "Jessica" : "JESSICAG",
  "Hetal" : "HETALS",
  "Joanne" : "JOANNEH",
  "Kathy" : "KATHYO",
  "Peter" : "PETERN",
  "Phalada" : "PHALADAX",
  "Phillip" : "PHILLIPS",
  "Poppy" : "POPPYP",
  "Tanya" : "TANYAK",
  "Tom" : "TOMB",
  "Valerie" : "VALERIEW",
};

var userInfoByUsername = {};
$.each(posters, function(name, info){
  var userName = info['username'].toUpperCase();
  userInfoByUsername[userName] = Object.assign({}, info);
});

var thisPoster = "";
var posterDelay = 0;

var url = document.URL;
var vars = [], hash;
var q = document.URL.split('?')[1];
if(q != undefined){
  q = q.split('&');
  for(var i = 0; i < q.length; i++){
    hash = q[i].split('=');
    vars.push(hash[1]);
    vars[hash[0]] = hash[1];
  }
}

var page = '';

if (url.indexOf('listerSales') >= 0) {
  page = 'listerSales';
  $('th:contains("Order")').parent().parent().parent().append('<tr class=""><td colspan="7">&nbsp;</td></tr><tr class="grandTotals collectibles jewelry" bgcolor="#c0c0c0"><td colspan="2">Grand Total Sales</td><td id="totalSales"></td><td>Total Items</td><td id="totalItems"></td><td>PPI</td><td id="PPI"></td></tr>');
  function calculateGrandTotal(){
    var totals = $('td:contains("Lister Total"):visible');
    var totalSales = 0;
    var totalItems = 0;
    var PPI = 0;
    $.each(totals, function(){
      numbers = $(this).html().match(/(\d{1}[\d|\.]*)/g);
      totalSales += Math.ceil(numbers[0]*100)/100;
      totalItems += Math.ceil(numbers[1]*100)/100;
    });
    totalSales = totalSales.toFixed(2)
    if (totalItems > 0) {
      PPI = (totalSales / totalItems).toFixed(2);
    } else {
      PPI = 0;
    }
    $('#totalSales').html('$'+totalSales);
    $('#totalItems').html(totalItems);
    $('#PPI').html('$'+PPI);
  }
  calculateGrandTotal();
} else {
  page = 'listerPostings';
  $('td:contains("Grand Total=")').addClass('jewelry collectibles');
}

var myInfo = {};

$.each(posters, function(name, info) { //working 10/27
    re = new RegExp(name,"gi");
    if(re.exec($(".smtext").html())) {
      myInfo = Object.assign({}, info);
//        thisPoster = name.replace(/ /gi,"");
//        console.log(thisPoster);
    }
});

$("tbody:contains('Item Title')").children().addClass("hideable");
$("tbody:contains('Item Title') > tr").first().removeClass('hideable');

if ($('select[name="startMonth"]').val() == $('select[name="endMonth"]').val() && $('select[name="startDay"]').val() == $('select[name="endDay"]').val() && $('select[name="startYear"]').val() == $('select[name="endYear"]').val()) {
  vars['inhOneDay'] = 1;
} else {
  vars['inhOneDay'] = 0;
}
$('#form1').append("<input type='hidden' name='inhOneDay' id='inhOneDay' value='" + vars['inhOneDay'] + "'>");
$('td:contains("From Date")').attr("id", "fromTd");
$('td:contains("To Date")').attr("id", "toID");
$('#fromTD, #toTD').parent().addClass("dontMove");
$('#toID').parent().css({
  "position" : "absolute",
  "top" : "165px",
  "left" : "26px",
});
$('input[name="submit"]').before("<div style='height:25px;'>&nbsp;</div>");
$('body').append("<div id='toolsContainer'><div><input type='checkbox' id='oneDay'> Single day</div></div>");
$('#toolsContainer').css({
	'text-align' : 'left',
	'position' : 'absolute',
	'left' : '250px',
	'top' : '120px',
});
$('#fromTd').css("width","70px");
$('#oneDay').bind("change", function(){
  if ($('#oneDay:checked').length > 0) {
    $('#fromTd').html("Date");
    $('#toID').parent().children().each(function(){
      $(this).contents().hide();
    });
    $('#toID').html("&nbsp;");

    $('select[name="endMonth"]').val( $('select[name="startMonth"]').val());
    $('select[name="endDay"]').val( $('select[name="startDay"]').val());
    $('select[name="endYear"]').val( $('select[name="startYear"]').val());
    $('select[name="startMonth"]').bind("change",function(){
      $('select[name="endMonth"]').val( $('select[name="startMonth"]').val());
    });
    $('select[name="startDay"]').bind("change",function(){
      $('select[name="endDay"]').val( $('select[name="startDay"]').val());
    });
    $('select[name="startYear"]').bind("change",function(){
      $('select[name="endYear"]').val( $('select[name="startYear"]').val());
    });
    $('#inhOneDay').val(1);
  } else {
    $('#fromTd').html("From Date");
    $('#toID').parent().children().each(function(){
      $(this).contents().show();
    });
    $('#toID').html("To Date");

    $('select[name="startMonth"]').unbind("change");
    $('select[name="startDay"]').unbind("change");
    $('select[name="startYear"]').unbind("change");
    $('#inhOneDay').val(0);
  }
});
if ($('#inhOneDay').val()=="1") {
  $('#oneDay').trigger("click");
}

$('#toolsContainer').append("<div style='' id='filterSpan'> <input type='checkbox' id='doFilter'> Just my posts</div>");
$('#doFilter').bind("click", function(){
  $('#doFilterDept, #doFilterUser').prop('checked', false);
  var myWelcome = $("td.smtext:contains('Welcome')").html();

  var res = myWelcome.match(/([^Welcome ])(\S*)/g);
  userName = userNames[res[0]];

  $(".hideable:contains('" + userName + "')").prev().nextUntil(".hideable:contains('Lister ')").removeClass("hideable").addClass("showable");
  var myTotal = $("tr.showable").length - 1;
/*
  foo = $("td:contains('Grand Total=')").html();
  var ress = foo.match(/(Grand Total=)(.*)/g);
  totalTotal = ress[0];
  */
  $(".hideable").show();
  $('#doFilterDept').prop('checked', false);
  if ($('#doFilter:checked').length > 0) {
    $(".hideable").hide();
    $('th:contains("Posting Date")').parent().show();
    $(".showable").last().after("<tr class='showable filterTotals' bgcolor='#ababab'><td colspan=3>Your total: " + myTotal + "</td></tr><br><br>");
    $(".showable").last().after("<tr class='showable filterTotals' bgcolor='#ababab'><td colspan=3> " + totalTotal + "</td></tr><br><br>"); 
  } else {
    $('.filterTotals').remove();
  }
});

if (vars['filter'] == "justMe" || vars['filter'] == "totals") {
  $('#form1').append("<input type='hidden' name='filter' value='" + vars['filter'] + "'>");
 
}

if (url.search("listerpostings") && vars['filter']=="justMe") {
  $('#doFilter').trigger("click");
} else if (url.search("listerpostings") && vars['filter']=="totals") {
  $('#form1').attr("action", "listerpostings.asp?filter=totals&relist=");
  $('#form1').append("<input type='hidden' name='filter' value='totals'>");
  $('a').each(function(){
      if ($(this).attr("href").indexOf("zoomItem") > 0) {
          $(this).parent().parent().hide();
      }
  }); 
}

if (myInfo['sup'] == true && myInfo['dept'] != 'all') {
  
  if (page == 'listerSales') {
    var d = '$';
  } else {
    var d = '';
  }
  
  var totalSales = {
    'collectibles' : 0,
    'jewelry' : 0,
  }
  
  var userSales = {
    'collectibles' : {},
    'jewelry' : {},
  }
  
  var grandTotalSales = 0;
  if ($('tr:contains("Lister:")').length > 0){
    $('body').append('<table id="totalsTable"></table>');

    $('#totalsTable').append("<thead><tr><th colspan=5>Totals</th></tr></thead>");
  //  $('#totalsTable').append("<tr><td>Collectibles<td id='collectiblesTotalCell'></td></tr>");
  //  $('#totalsTable').append("<tr><td>Jewelry<td id='jewelryTotalCell'></td></tr>");
    $('#totalsTable').append("<tr id='collectiblesGroupHeading' ><td class='groupHeading' colspan=5>Collectibles</td></tr>");
    $('#totalsTable').append("<tr id='jewelryGroupHeading'><td class='groupHeading' colspan=5>Jewelry</td></tr>");
    $('#totalsTable').append("<tr><td class='groupHeading' colspan=5>Overall</td></tr>");
    $('#totalsTable').append("<tr class='stripeRow'><td>Grand total</td><td id='totalAllCell'></td></tr>");
  }

  
  $('#filterSpan').after('<span id="filterDeptSpan"> <input id="doFilterDept" type="checkbox"> Filter to my department</span>');
  $('#filterDeptSpan').after("<div id='filterUserDiv'><input id='doFilterUser' type='checkbox'> Filter to user: <select id='selectUser'></select></div>");
  $('#filterUserDiv').after("<div id='filterGalleryDiv'><input id='doFilterFeatured' type='checkbox'> Gallery/featured only</div>");
  $('b:contains("Lister:")').each(function(){
    var thisUser = $(this).html().replace("Lister: ", "");
    var dept = userInfoByUsername[thisUser]['dept'];
    $(this).parent().parent().nextUntil('tr:contains("Lister:")').addClass(dept).attr('username', thisUser);
    $(this).parent().parent().addClass(dept).attr('username', thisUser);
    $('#selectUser').append("<option value='"+thisUser+"'>"+userInfoByUsername[thisUser]['name']+"</select>");
  });
  
  $('td:contains("Lister Total=")').each(function(){
    var myText = $(this).text().replace("Lister Total=", "").replace(" ", "");
    if (page == 'listerSales') {
      var sales = ($(this).text().match(/\d*\.?\d{1}?\d{1}?/)[0]*1);
    } else {
      var match = myText.match(/\d*/);
      var sales = (myText.match(/\d*/)[0]*1);
    }
    var thisUser = $(this).parent().attr('username');
    var dept = userInfoByUsername[thisUser]['dept'];
    userSales[dept][thisUser] = sales;
    totalSales[dept] += sales;
    grandTotalSales += sales;
  });
  

  
  $('#collectiblesGroupHeading').after("<tr id='collectiblesGroupFoot' class='stripeRow'><td class='totalLabel'>Total:</td><td class='deptTotal'>"+d+totalSales['collectibles'].toLocaleString()+"</td></tr>");
  $('#jewelryGroupHeading').after("<tr id='jewelryGroupFoot' class='stripeRow'><td class='totalLabel'>Total:</td><td class='deptTotal'>"+d+totalSales['jewelry'].toLocaleString()+"</td></tr>");
  $.each(userSales, function(department, usersObject) {
    $.each(usersObject, function(userName, sales){
      var section = '#' + department + "GroupFoot";
      $(section).before("<tr class='stripeRow'><td class='userLabel'>"+userInfoByUsername[userName]['name']+"</td><td class='userSales'>"+d+sales.toLocaleString()+"</td></tr>");
    });
  });

  $('#totalAllCell').html(d+grandTotalSales.toLocaleString());
  
  $('#totalsTable').css({
    "position" : "absolute",
    "left" : ($('table:contains("Lister:")').width()+20)+"px",
    "top" : "110px",
    "border" : " 2px solid #ccc",
    "padding" : "5px",
    "width" : "200px",
  });
  
  $('#totalsTable th').css({
    'font-size' : '24px',
  });
  
  $('.groupHeading').css({
    'text-align' : 'center',
    'font-weight' : 'bold',
  })
  
  var stripeCounter = 0;
  $('tr').each(function(){
    if ($(this).is('.stripeRow')){ // each section resets
      stripeCounter++;
      if (stripeCounter%2){
        $(this).css({
          'background-color' : '#eee',
        });
      }
    } else {
      stripeCounter = 0;
    }
  });
  
  $('#doFilterFeatured').bind('click', function(){
    $('.hideable').show();
    var myTable = $('td:contains("Lister")').parent().parent();
    if ($('#doFilterFeatured:checked').length > 0) {
      myTable.children().filter(function(){
        if (($(this).find('b:contains("Gallery")').length <= 0 &&  $(this).find('b:contains("Featured")').length <= 0)) {
          return true;
        } else {
          return false;
        }
      }).addClass('hideable').hide();
      $('#totalsTable').addClass('hideable').hide();
    }
    

  });
  
  $('#doFilterDept').bind('click', function(){
    $('.hideable').show();
    $('#doFilter, #doFilterUser').prop('checked', false);
    if ($('#doFilterDept:checked').length > 0) {
      $('.hideable').not('.'+myInfo['dept']).hide();
    }
    
    var grandTotal = 0;
    $('td:contains("Lister Total="):visible').each(function(){
      myTotal = $(this).html();
      myTotal = myTotal.replace(/\D/g, "");
      myTotal = Math.ceil(myTotal);
      grandTotal += myTotal;
    });
    $('td:contains("Grand Total=")').html("Grand Total="+grandTotal);
    $('td:contains("Grand Total=")').parent().show();
    if (url.indexOf('listerSales') >= 0) {
      calculateGrandTotal();
    }
  });
  
  function filterByUser() {
    $('.collectibles, .jewelry').hide();
    $('#doFilter, #doFilterDept').prop('checked', false);
    if ($('#doFilterUser:checked').length > 0) {
      $('.collectibles, .jewelry').each(function(){
        if ($(this).attr('username') == $('#selectUser').val()) {
          $(this).show();
        }
      });
    } else {
      $('.collectibles, .jewelry, .hideable, .showable').show();
    }
  }
  
  $('#doFilterUser').bind('click', function(){
    filterByUser();
  });
  $('#selectUser').bind('change', function(){
    filterByUser();
  });
}

