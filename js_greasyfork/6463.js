// ==UserScript==
// @name           HSBC - Better Account History
// @description    Better readability, forever transactions retention and a chart display
// @namespace      http://github.com/jobwat/
// @author         Joseph Boiteau
// @version        2014.11.15
// @homepage       https://github.com/jobwat/hsbc-account-history-rerender.user.js
// @include        https://*.hsbc.com/*
// @include        https://*.hsbc.com.au/*
// @include        https://*.hsbc.co.uk/*
// @grant          none
// @require        https://code.jquery.com/jquery-1.11.1.min.js
// @require        http://cdnjs.cloudflare.com/ajax/libs/flot/0.8.2/jquery.flot.min.js
// @require        http://cdnjs.cloudflare.com/ajax/libs/flot/0.8.2/jquery.flot.time.min.js
// @downloadURL https://update.greasyfork.org/scripts/6463/HSBC%20-%20Better%20Account%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/6463/HSBC%20-%20Better%20Account%20History.meta.js
// ==/UserScript==

// this script is only for the "Account History" page
if(document.getElementsByTagName('title')[0].text.match("Account History")){

  // centering function used in final display
  // Thx Tony L. - http://stackoverflow.com/questions/210717/what-is-the-best-way-to-center-a-div-on-the-screen-using-jquery
  $.fn.center = function () {
    this.css("position","absolute");
    this.css("top", ( $(window).height() - this.height() ) / 2+$(window).scrollTop() + "px");
    this.css("left", ( $(window).width() - this.width() ) / 2+$(window).scrollLeft() + "px");
    return this;
  };

  // set some style (no need to have wide spaces around lines)
  $('<style type="text/css">table.hsbcTableStyle07 tr td{ padding:0px 5px 0px 5px; line-height: 1em; white-space: nowrap; } </style>').prependTo($('head'));

  var graphData = [];   // array containing values for the graph
  var the_table = $("table.hsbcTableStyle07");  // the interesting table object of the page

  // We will first go through all lines of the table
  // Get their content, load our objects and rewrite all, but lighter

  clearTable = function(){
    trs = $('tr', the_table);
    trs.each(function(index, tr){ if(index!==0 && index!=(trs.length-1)){ $(tr).addClass('to_del'); } });
    $('tr.to_del', the_table).remove();
  };

  Line = function() {
    this.timestamp = undefined;
  };
  Line.prototype.populate = function(line_data_array) {
    this.timestamp = line_data_array.timestamp;
    this.details = line_data_array.details;
    this.debit = line_data_array.debit;
    this.credit = line_data_array.credit;
    this.balance = line_data_array.balance;
  };
  Line.prototype.setDate = function(dateString) {
    this.timestamp = new Date(dateString).getTime();
  };
  Line.prototype.hasDate = function() {
    return !(this.timestamp === undefined || isNaN(this.timestamp));
  };
  Line.prototype.getDate = function(){ // reformat the date column
    if(this.hasDate()){
      date = new Date(this.timestamp);
      return '<span style="float:right">'+weekdayArray[date.getDay()]+', '+date.getDate()+' '+monthArray[date.getMonth()].slice(0,3)+' '+date.getFullYear()+'</span>';
    }
    else{
      return undefined;
    }
  };
  Line.prototype.setDetails = function(detailsHTML) { // remove some non-useful data from details column and make it 1 line only
    tmp=detailsHTML.split('<br>');
    this.details = this.cleanStrings(tmp[0] + ' - ' + tmp[2] + ' - ' + tmp[3] + ' ' + tmp[4]);
  };
  Line.prototype.getDetails = function(){
    return this.details;
  };
  Line.prototype.setDebit = function(debit){
    this.debit = this.cleanAmounts(debit);
  };
  Line.prototype.getDebit = function(){
    return this.displayDigits(this.emptyIfZero(this.debit));
  };
  Line.prototype.setCredit = function(credit){
    this.credit = this.cleanAmounts(credit);
  };
  Line.prototype.getCredit = function(){
    return this.displayDigits(this.emptyIfZero(this.credit));
  };
  Line.prototype.setBalance = function(balance){
    this.balance = this.cleanAmounts(balance);
  };
  Line.prototype.getBalance = function(){
    return this.displayDigits(this.balance);
  };
  Line.prototype.cleanAmounts = function(value){
    tmp = parseFloat(this.cleanStrings(value).replace(/[^0-9\.]/g,''));
    if(isNaN(tmp)) return 0;
    else return tmp;
  };
  Line.prototype.cleanStrings = function(value){
    return value.replace(/[\t\n\r   ]+/g,' ');
  };
  Line.prototype.displayDigits = function(value){
   return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  };
  Line.prototype.emptyIfZero = function(value){
    if(value===0) return '&nbsp;';
    else return value+'&nbsp;';
  };

  History = function(){
    this.lines = [];
  };
  History.prototype.add = function(line){
    this.lines.push(line);
  };
  History.prototype.toJSON = function(){
    return JSON.stringify(this.lines);
  };
  History.prototype.merge = function(anotherHistory){
    var merged = $.merge(this.lines, anotherHistory.lines);
    merged.sort(function(a,b){
      if(a.timestamp < b.timestamp) return 1;
      else if(a.timestamp > b.timestamp) return -1;
      else{
        if(a.balance == b.balance + b.credit) return 1;
        if(a.balance == b.balance - b.debit) return 1;
        return -1;
      }
    });

    var ind = 1;
    while(ind < merged.length){
      if(merged[ind-1].timestamp == merged[ind].timestamp && merged[ind-1].details == merged[ind].details){
        merged.splice(ind, 1);
      }
      else
        ind++;
    }

    this.lines = merged;
  };
  History.prototype.testMerge = function(){
    console.log('before merge: ' + this.lines.length + 'lines');
    history.merge(this);
    console.log('after merge: ' + this.lines.length + 'lines');
  };
  History.prototype.displayAll = function(){
    clearTable();
    last_tr = $('tr', the_table).last(); // the greyed line with sorting arrows at the bottom

    $(this.lines).each(function(index, line_data_array){
      var line = new Line();
      line.populate(line_data_array);
      graphData.push([line.timestamp, line.balance]);
      /*jshint multistr: true */
      tr = $('<tr class="hsbcTableRow0'+((index%2===0)?'3':'4')+'">\
        <td class="hsbcTableColumn03" headers="header1">'+line.getDate()+'</td>\
        <td class="" headers="header2">'+line.getDetails()+'</td>\
        <td class="hsbcTableColumn03" headers="header3">'+line.getDebit()+'</td>\
        <td class="hsbcTableColumn03" headers="header4">'+line.getCredit()+'</td>\
        <td class="hsbcTableColumn03" headers="header5">'+line.getBalance()+'</td>\
        <td class="hsbcTableColumn03" headers="header6">&nbsp;</td>\
      </tr>');
      tr.insertBefore(last_tr);
    });
  };

  var previous_history = new History();
  var account_history = new History();

  // recover the account name
  var account_name = $('#LongSelection1 option[value="'+$('#LongSelection1').val()+'"]').text().replace(/[^a-zA-Z]/g, '');
  console.log('account_name: ', account_name);

  // recover existing history
  previous_history_JSON = localStorage.getItem(account_name);
  if (previous_history_JSON){
    previous_history.lines = JSON.parse(previous_history_JSON);
    console.log('previous history from localStorage: ', previous_history.lines.length);
  }
  else{
    previous_history.lines = [];
  }

  // Drop the right panel containing mostly ads
  $('.containerRightTools').remove();

  // loop through table lines
  var prev_line = new Line();
  $.each($("tr", the_table), function(TRind, TRval) { // each tr

    line = new Line();

    var mytd = $(this).children("td").each(function(index, td){ // each td

      if(td.headers=="header1"){ // the date
        line.setDate(td.innerHTML);
        if(line.hasDate()){ td.innerHTML=line.getDate(); }
        else { return false; }
      }
      else if(td.headers=="header2"){ // the details
        line.setDetails(td.innerHTML);
        if(line.getDetails() == prev_line.getDetails()){ line.details = prev_line.getDetails() + ' (2x)'; }
        td.innerHTML = line.getDetails();
      }
      else if(td.headers=="header3"){ // debit
        line.setDebit(td.innerHTML);
        td.innerHTML = line.getDebit();
      }
      else if(td.headers=="header4"){ // credit
        line.setCredit(td.innerHTML);
        td.innerHTML = line.getCredit();
      }
      else if(td.headers=="header5"){ // balance
        line.setBalance(td.innerHTML);
        td.innerHTML = line.getBalance();
      }
      else if(td.headers=="header6"){ // empty last column
        td.innerHTML = account_history.lines.length + 1;
      }
    });

    if(line.getDate()!==undefined && line.getBalance()!==undefined){ // the first and last tr of the array are the sorting arrows
      account_history.add(line);
    }

    prev_line = line;

  });
  console.log('lines parsed: ', account_history.lines.length);

  // merging previous history with actual one and save it locally
  //account_history.merge(previous_history);

  // saving new merged history to localStorage
  localStorage.setItem(account_name, JSON.stringify(account_history.lines));
  console.log('lines saved after merge: ', account_history.lines.length);

  // rewrite the whole thing
  account_history.displayAll();

  // 2e part: draw a chart

  // add a div somewhere in the DOM
  $('<div id="chartwrap" style="border: 1px solid #AAA; background-color:white; position: absolute;"></div>').appendTo("body");
  $('<div id="placeholder" style="width:650px; height:300px;"></div>').appendTo("#chartwrap");

  // draw the chart in its div
  // TODO: do way better ! watch here: http://people.iola.dk/olau/flot/examples/stacking.html
  $.plot("#placeholder", [graphData], { xaxis: { mode: "time" } });

  toggleChartDisplay = function(show_or_hide){
      if($("#chartwrap").is(':hidden')) $("#chartwrap").center();
      $("#chartwrap").toggle(show_or_hide);
  };

  // display a button to toggle chart visibility
  $('<a class="hsbcLinkStyle06">Display chart</a>')
    .prependTo($('td.hsbcTableColumn03')[0])
    .css('cursor', 'pointer')
    .click(toggleChartDisplay);

  // click on the chart hides it
  $('#placeholder').click(toggleChartDisplay);

  // start with Chart hidden
  toggleChartDisplay(false);
}
