// ==UserScript==
// @description JoyClub: remove unwanted elements
// @name        JC Mein Remove Unwanted Elements
// @namespace   JC Mein Remove Unwanted Elements
// @include     http://www.joyclub.de/mein/*
// @version     1
// @grant       none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/9511/JC%20Mein%20Remove%20Unwanted%20Elements.user.js
// @updateURL https://update.greasyfork.org/scripts/9511/JC%20Mein%20Remove%20Unwanted%20Elements.meta.js
// ==/UserScript==

var deleteList = new Array();

removeHeader();
removeFooter();
changeDates();
changeUserList();

//addListener();

execDeleteList();

//alert("Ende!");


function addListener () {
  window.addEventListener ("load", myOnload, false);
}


function changeUserList () {
  var userlists;
  var userlist;
  var lis;
  var i;
  var j;

  userlists = document.getElementsByClassName("user_list");

  for (j=0; j<userlists.length; j++) {
    userlist = userlists[j];
    //alert(userlist.innerHTML);

    lis = userlist.getElementsByTagName("li");
    for (i=0; i<lis.length; i++) {
      changeUser(lis[i]);
    }
  }
}


function changeUser (user) {
  var UserObject = {Online:"", Title:"", Age:"", Gender:"", Verified:"", Location:"", Voting:""};
  var strongElements;
  var strongElement;
  var smallElements;
  var smallElement;
  var p1;
  var p2;
  var s;
  var imgs;
  var img;
  var k;
  var spanElements;
  var spanElement;
  var votings;
  var vote;
  
  UserObject.Online = user.className;

  //alert(user.innerHTML);
  
  strongElements = user.getElementsByTagName("strong");
  if (strongElements.length >= 1) {
    strongElement = strongElements[0];
    UserObject.Title = strongElement.innerHTML;
  }

  var smallElements = user.getElementsByTagName("small");
  if (smallElements.length >= 1) {
    smallElement = smallElements[0];
    s = smallElement.innerHTML;
    p1 = s.indexOf("&");
    if (p1 < 0) p1 = s.length;
    p2 = s.indexOf("<");
    if (p2 < 0) p2 = s.length;
    if (p2<p1) p1=p2;
    UserObject.Age = s.substr(0,p1).trim();
    
    imgs = smallElement.getElementsByTagName("img");
    if (imgs.length >= 1) {
      for (k=0; k<imgs.length; k++) {
        img = imgs[k];
        if (img.alt.indexOf("geprüft") < 0)
          UserObject.Gender = img.alt;
        else
          UserObject.Verified = img.alt;
      }
    }
  }
  
  spanElements = user.getElementsByTagName("span");
  if (spanElements.length >= 1) {
    spanElement = spanElements[0];
    UserObject.Location = spanElement.innerHTML.trim();
  }
  
  votings = user.getElementsByClassName("voting");
  if (votings.length > 0) {
    vote = votings[0];
    
    UserObject.Voting = vote.title;
    if (UserObject.Voting.substr(0,5) == "Sorry")
      deleteList.push(user);
  }

  //alert("Online: " + UserObject.Online + "\r\nTitle: " + UserObject.Title + "\r\nAge: " + UserObject.Age + "\r\nGender: " + UserObject.Gender + "\r\nVerified: " + UserObject.Verified + "\r\nLocation: " + UserObject.Location + "\r\nVoting: " + UserObject.Voting);
}


function changeDates () {
  // Analyze "Aktuelle Dates"
  var my_dates;
  var date_list;
  var dates;
  var num_dates;
  var i;
  
  my_dates = document.getElementById("my_date");
  if (!my_dates) return;
  
  date_list = my_dates.getElementsByClassName("date_list");
  if (date_list.length <= 0) return;
  
  dates = date_list[0].getElementsByClassName("ha_2");
  if (dates.length <= 0) return;
  
  num_dates = dates.length;

  for (i=0; i<num_dates; i++)
    changeDate(dates[i]);
}


function changeDate (date) {
  var DateObject = {Title:"", Text:"", Nick:"", Age:"", Gender:"", Verified:"", Location:"", Distance:"", Voting:""};

  // make box smaller
  date.style.height="210px";
  
  //alert(date.innerHTML);
  changeAvatar(date, DateObject);
  changeDateInfo(date, DateObject);
  
  //alert("Nick: " + DateObject.Nick + "\r\nAge: " + DateObject.Age + "\r\nGender: " + DateObject.Gender + "\r\nverified: " + DateObject.Verified + "\r\nLocation: " + DateObject.Location + "\r\nDistance: " + DateObject.Distance + "\r\nVoting: " + DateObject.Voting);
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
  
  moreinfos = date_info.getElementsByClassName("date_moreinfo");
  if (moreinfos.length <= 0) return;
  
  moreinfo = moreinfos[0];
  //alert(moreinfo.innerHTML);
  
  strongElements = moreinfo.getElementsByTagName("strong");
  if (strongElements.length >= 1) {
    strongElement = strongElements[0];
    DateObject.Title = strongElement.innerHTML;
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
  //alert(s);

  p1 = s.indexOf("&");
  if (p1 < 0) p1 = s.length;
  p2 = s.indexOf("<");
  if (p2 < 0) p2 = s.length;
  if (p2<p1) p1=p2;
  DateObject.Nick = s.substr(0,p1).trim();

  p1 = s.lastIndexOf(";");
  if (p1 < 0) p1 = s.length;
  p2 = s.lastIndexOf(">");
  if (p2 < 0) p2 = s.length;
  if (p2>p1) p1=p2;
  DateObject.Age = s.substring(p1+1).trim();

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


function myOnload () {
}
