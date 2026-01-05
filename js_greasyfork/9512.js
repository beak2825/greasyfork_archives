// ==UserScript==
// @name        JC Search Remove Unwanted Elements
// @namespace   JC Search Remove Unwanted Elements
// @description JoyClub SEARCH: remove unwanted elements
// @include     http://www.joyclub.de/mitglieder/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9512/JC%20Search%20Remove%20Unwanted%20Elements.user.js
// @updateURL https://update.greasyfork.org/scripts/9512/JC%20Search%20Remove%20Unwanted%20Elements.meta.js
// ==/UserScript==

var deleteList = new Array();

removeHeader();
removeFooter();
changeDates();

execDeleteList();

//alert("Ende!");


function changeDates () {
  // Analyze "Aktuelle Dates"
  var date_list;
  var dates;
  var num_dates;
  var i;
    
  date_list = document.getElementsByClassName("cards");  // date_list
  if (date_list.length <= 0) return;

  dates = date_list[0].getElementsByClassName("col-lg-3");  // ha_2
  if (dates.length <= 0) return;
  
  num_dates = dates.length;

  for (i=0; i<num_dates; i++)
    changeDate(dates[i]);
}


function changeDate (date) {
  var DateObject = {Title:"", Text:"", Nick:"", Age:"", Gender:"", Verified:"", Location:"", Distance:"", Voting:"", Online:""};

  // make box smaller
  date.style.height="136px";
  date.style.width="136px";
  
  //alert(date.innerHTML);
  changeAvatar(date, DateObject);
  changeDateInfo(date, DateObject);
  
  if ((DateObject.Voting.substr(0,5) == "Sorry") || (DateObject.Online == ""))
    deleteList.push(date);

  //alert("Nick: " + DateObject.Nick + "\r\nAge: " + DateObject.Age + "\r\nGender: " + DateObject.Gender + "\r\nverified: " + DateObject.Verified + "\r\nLocation: " + DateObject.Location + "\r\nDistance: " + DateObject.Distance + "\r\nVoting: " + DateObject.Voting + "\r\nOnline: " + DateObject.Online);
}



function changeAvatar (date, DateObject) {
  var votings;
  var vote;
  
  votings = date.getElementsByClassName("voting");
  if (votings.length > 0) {
    vote = votings[0];
    
    DateObject.Voting = vote.title;
    vote.style.left = "80px";
    vote.style.top = "60px";
  }
  
  // Avatar
  var avatars = date.getElementsByClassName("avatar");
  if (avatars.length > 0) {
    avatars[0].style.width="100px";
    avatars[0].style.height="75px";
    //avatars[0].addEventListener("load",onloadChangeAvatar,false);
  }
}


function onloadChangeAvatar () {
}


function changeDateInfo (date, DateObject) {
  var date_infos;
  var date_info;

  date_infos = date.getElementsByClassName("date_info");
  if (date_infos.length <= 0) return;
  
  date_info = date_infos[0];
  //alert(date_info.innerHTML);

  changeMoreInfo(date_info, DateObject);
  changeDivs(date_info, DateObject);
}


function changeMoreInfo (date_info, DateObject) {
  var moreinfos;
  var moreinfo;
  var strongElements;
  var strongElement;
  var pElement;
  var s;
  var p1;
  var p2;
  var spanElements;
  var spanElement;
  
  moreinfos = date_info.getElementsByClassName("date_moreinfo");
  if (moreinfos.length <= 0) return;
  
  moreinfo = moreinfos[0];
  //alert(moreinfo.innerHTML);
  
  strongElements = moreinfo.getElementsByTagName("strong");
  if (strongElements.length >= 1) {
    strongElement = strongElements[0];
    
    s = strongElement.innerHTML;
    p1 = s.indexOf("&");
    if (p1 < 0) p1 = s.length;
    p2 = s.indexOf("<");
    if (p2 < 0) p2 = s.length;
    if (p2<p1) p1=p2;
    DateObject.Nick = s.substr(0,p1).trim();
    
    spanElements = strongElement.getElementsByTagName("span");
    if (spanElements.length >= 1) {
      spanElement = spanElements[0];
      DateObject.Online = spanElement.innerHTML.trim();
    }
  }
  
  var pElements = moreinfo.getElementsByTagName("p");
  if (pElements.length >= 1) {
    pElement = pElements[0];
    DateObject.Text = pElement.innerHTML;
  }
}


function changeDivs (date_info, DateObject) {
  var divs;

  divs = date_info.getElementsByTagName("div");
  if (divs.length <= 0) return;  

  changeDiv1(divs[1], DateObject);
  changeDiv2(divs[2], DateObject)
}


function changeDiv1 (div, DateObject) {  // Nick, Age, Gender, Verified
  var p1;
  var p2;
  var s;
  var imgs;
  var img;
  var k;
  
  s = div.innerHTML;

  p1 = s.indexOf("&");
  if (p1 < 0) p1 = s.length;
  p2 = s.indexOf("<");
  if (p2 < 0) p2 = s.length;
  if (p2<p1) p1=p2;
  DateObject.Age = s.substr(0,p1).trim();
  
  imgs = div.getElementsByTagName("img");
  if (imgs.length >= 1) {
    for (k=0; k<imgs.length; k++) {
      img = imgs[k];
      if (img.alt.indexOf("geprüft") < 0)
        DateObject.Gender = img.alt;
      else
        DateObject.Verified = img.alt;
    }
  }
}
            
            
function changeDiv2 (div, DateObject) {  // Location, Distance
  var s;
  var sdivs;
  var sdiv;

  s = div.innerHTML;
  //alert(s);

  sdivs = div.getElementsByTagName("div");
  if (sdivs.length >= 1) {
    sdiv = sdivs[0];
    DateObject.Location = sdiv.innerHTML;
  }

  sdivs = div.getElementsByTagName("span");
  if (sdivs.length >= 1) {
    sdiv = sdivs[0];
    DateObject.Distance = sdiv.innerHTML;
  }
}


function removeHeader () {

  // remove complete header
  var header;
  header = document.getElementById("header");
  if (header)
   header.parentNode.removeChild(header);
}


function removeFooter () {
  
  // remove complete footer
  var footer;
  footer = document.getElementById("footer_wrapper");
  if (footer)
   footer.parentNode.removeChild(footer);
}


function execDeleteList () {
  var i;
  for (i=0; i<deleteList.length; i++)
    deleteList[i].parentNode.removeChild(deleteList[i]);
}
