// ==UserScript==
// @name           DS-Aktivitaetskontrolle
// @namespace      ds
// @include        *.die-staemme.de/game.php*screenmode=view_thread*
// @include        *.die-staemme.de/game.php*mode=members*
// @include        *.die-staemme.de/game.php*
// @author         Dummbroesel
// @description    Aktivitaetskontrolle für die-Staemme Stammesmitglieder.
// @version        0.9.4
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/6439/DS-Aktivitaetskontrolle.user.js
// @updateURL https://update.greasyfork.org/scripts/6439/DS-Aktivitaetskontrolle.meta.js
// ==/UserScript==

// Einstellungen veränderbare Werte nach bedarf
var greenMarkHours = 72; //Stundenbereich in dem die Markierung Grün ist
var yellowMarkHours = 240; //Stundenbereich in dem die Markierung Gelb ist
//Alles über den Wert in der Variabel yellowMarkHours wird mit Rot markiert.

// Ab hier nichts ändern! 
//Javascript Objekt/Type prototyping

/**
 * Erweitert Objekte vom Type String um die Funktion format(arg1,arg2,arg3..) 
 * Ersetzt im String vorhandene {0}, {1}, {2}.. Platzhalter
 * 
 * @param(n) {string} Erster Paremeter ersetzt {n}
 * 
 * @return {string} Gibt den formatierten String zurück.
 */
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  };
}

/**
 * Erweitert Objekte vom Type Date um die Funktion getLocaleDate
 * 
 * @return {string} Gibt den einen formatierten Date(dd.MM.YYYY) String zurück.
 */
if (!Date.prototype.getLocaleDate) {
  Date.prototype.getLocaleDate = function () {
    return "{0}.{1}.{2}".format(this.getDate(), (this.getMonth()+1), this.getFullYear());
  };
}

/**
 * Erweitert Objekte vom Type Date um die Funktion getLocaleDateOfYesterday
 * 
 * @return {string} Gibt den einen formatierten Date(dd.MM.YYYY) String vom Vortag zurück.
 */
if (!Date.prototype.getLocaleDateOfYesterday) {
  Date.prototype.getLocaleDateOfYesterday = function () {
    return "{0}.{1}.{2}".format((this.getDate() -1), (this.getMonth()+1), this.getFullYear());
  };
}

/**
 * Erweitert Objekte vom Type Date um die Funktion getLocaleTime
 * 
 * @return {string} Gibt den einen formatierten Date(hh:mm:ss) String zurück.
 */
if (!Date.prototype.getLocaleTime) {
  Date.prototype.getLocaleTime = function () {
    return "{0}:{1}:{2}".format(this.getHours(), this.getMinutes(), this.getSeconds());
  };
}

/**
 * Erweitert Objekte vom Type Date um die Funktion getLocaleFullDate
 * 
 * @return {string} Gibt den einen formatierten Date(dd.MM.YYYY hh:mm) String zurück.
 */
if (!Date.prototype.getLocaleFullDate) {
  Date.prototype.getLocaleFullDate = function () {
    return "{0}.{1}.{2} {3}:{4}".format(this.getDate(), (this.getMonth()+1), this.getFullYear(), this.getHours(), this.getMinutes());//, this.getSeconds());
  };
}

/**
 * Erweitert Objekte vom Type Date um die Funktion parseLocaleFullDate
 * 
 * @param input {string} Nimmt einen Datestring im Format (dd.MM.YYYY hh:mm:ss) entgegen
 * 
 * @return {Date} Gibt ein Objekt vom Type Date zurück
 */
if (!Date.prototype.parseLocaleFullDate) {
  Date.prototype.parseLocaleFullDate = function (input) {
    var parts = input.split(/([\.\ :])\b/g);
    
    return new Date(parts[4], parts[2]-1, parts[0], parts[6], parts[8]);
  };
}

/**
 * Erweitert Objekte vom Type Date um die Funktion getLocaleParsedFullDate
 * Prüft einen Datestring auf richtigkeit, fehlt die Jahresangabe im Format(dd.MM.YYYY hh:mm:ss)
 * wird das aktuelle Jahr hinzugefügt.
 * 
 * @param input {string} Nimmt einen Datestring im Format (dd.MM.YYYY hh:mm:ss) entgegen
 * 
 * @return {string} Gibt einen Optimierten String im Format (dd.MM.YYYY hh:mm) zurück
 */  
if (!Date.prototype.getLocaleParsedFullDate) {
  Date.prototype.getLocaleParsedFullDate = function (input) {
    var parts = input.split(/([\.\ :])\b/g);
    
    var tDay = (parts[0]) ? parts[0] : 1;
    var tMonth = (parts[2]) ? parts[2] : 1;
    var tYear = (parts[4]) ? parts[4] : 1900;
        
    var tHours = (parts[6]) ? parts[6] : 1;
    var tMinutes = (parts[8]) ? parts[8] : 1;
    var tSeconds = (parts[10]) ? parts[10] : 1;
        
    if(parts[4] <2000) {
      tYear = 2014;
      
      tHours = (parts[4]) ? parts[4] : 1;
      tMinutes = (parts[6]) ? parts[6] : 1;
      tSeconds = (parts[8]) ? parts[8] : 1;
    }
    
	var tDate = new Date(tYear, tMonth-1, tDay, tHours, tMinutes);
    
    return "{0}.{1}.{2} {3}:{4}".format(
      (tDate.getDate() <10) ? "0"+tDate.getDate() : tDate.getDate(), 
      ((tDate.getMonth()+1) <10) ? "0"+(tDate.getMonth()+1):(tDate.getMonth()+1), 
      tDate.getFullYear(), 
      (tDate.getHours() <10)?"0"+tDate.getHours():tDate.getHours(), 
      (tDate.getMinutes() <10)?"0"+tDate.getMinutes():tDate.getMinutes()
    );//, this.getSeconds());
  };
}

// "date" als globale Variabel setzen
var date = new Date();

/**
 * Benutzt den jquery Eventlistener ready
 * um fest zu stellen ob das Dokument fertig geladen
 * Wurde es fertig geladen, wird der Querystring nach Erkennungsmerkmalen abgesucht, 
 * und die entsprechenden Funktionen ausgeführt
 */ 
jQuery(document).ready(function () {
  if (window.location.search.indexOf('mode=members') > 0) { 
    // Greift wenn man sich seine Stammesmitgliederliste anschaut.
    CompareActiveMembers();
  }
  else if (window.location.search.indexOf('screenmode=view_thread') > 0) { 
    // Greift wenn man ein Thema liest.
    EvaluatePosts();
  }
});

/**
 * Benutzt den jquery Eventlistener keypress um Tasteneingaben abzufangen.
 * Horcht bei Tasteneingaben auf das kleine "C" und das kleine "X",
 * außer es befindet sich ein Textfeld im Fokus.
 *
 * "c" für die export Funktion
 * "x" für die import Funktion
 */
jQuery(document).keypress(function(event) {
  if($('input[type=text], textarea').is(":focus")) return;
  var eCode = (event.keyCode == 0)? event.charCode : event.keyCode;
  console.log(eCode);
  switch (eCode) {
    case 120: //x 
      ImportActiveMemberList();
      return false;
      break;
    case 99: //c
      ExportActiveMemberList();
      break;
    default:
      break;
  }
});


/**
 * Speichert ein Objekt mit der Json stringify Funktion in der lokalen Browserdatenbank
 * 
 * @param object {Object} Nimmt ein Objekt entgegen
  */
function SetActiveAllyMemberListFromObject(object) {
  var memberList = object;
  
  localStorage.setItem('ActiveMemberList', JSON.stringify(memberList));
}

/**
 * Prüft ob sich eine Mitspielerliste vom Type Objekt in der Browserdatenbank befindet.
 * Ist dies nicht der Fall wird eine neue Mitgliederliste vom Type Objekt erstellt.
 * Prüft ob sich @memberName im Objekt befindet, wenn nicht fügt @memberName hinzu.
 * Speichert weitere Daten zu @memberName, @currentDate, @currentAction.
 * 
 * @param memberName {string}
 * @param currentDate {string}
 * @param currentAction {string}
 */
function AddActiveAllyMemberToList(memberName, currentDate, currentAction) {
  var memberList = (!GetActiveAllyMemberList()) ? new Object() : GetActiveAllyMemberList();
  if(!memberList[memberName]) { 
    //wenn sich @memberName nicht in der Liste befindet
    //fügt @memberName folgende informationen hinzu
    memberList[memberName] = 
      { 
        postCount: (currentAction == 'post') ? new Array(date.getLocaleParsedFullDate(currentDate)) : new Array(), // Fügt @postCount @currentDate hinzu wenn die Aktion ein Beitrag ist
        thanksCount: (currentAction == 'thanks') ? new Array(date.getLocaleParsedFullDate(currentDate)) : new Array(), // Fügt @thanksCount @currentDate hinzu wenn die Aktion ein bedanken ist
        latestAction: {dateTime: date.getLocaleParsedFullDate(currentDate), action: currentAction} // Fügt @latestAction eine @action @currentAction und @dateTime @currentDate hinzu
      };
  } else { //wenn @memberName vorhanden 
    var cDate = date.getLocaleParsedFullDate(currentDate); //@currentDate vereinheitlichen
    if(currentAction == 'post') { //wenn die @currentAction ein Beitrag ist
      if(memberList[memberName].postCount.indexOf(cDate) < 0) { //Überprüft ob das Datum schon im Array vorhanden ist, wenn nicht fügt das Datum hinzu
        memberList[memberName].postCount.push(cDate);
      }
    }
    else if(currentAction == 'thanks'){ //wenn die @currentAction ein bedanken klick ist
      if(memberList[memberName].thanksCount.indexOf(cDate) < 0) { //Überprüft ob das Datum schon im Array vorhanden ist, wenn nicht fügt das Datum hinzu
        memberList[memberName].thanksCount.push(cDate);
      }
    }
    if(memberList[memberName].latestAction.dateTime != currentDate) //Überprüft ob das Datum sich von der zuletzt gespeicherten Aktion unterscheidet
    {
      var ccDate = date.parseLocaleFullDate(cDate);
      var lDate = date.parseLocaleFullDate(memberList[memberName].latestAction.dateTime);
      //Prüft ob das Datum aktueller ist, wenn ja wird die letze Aktion und das Datum der letzten Aktion überschrieben
      if(ccDate > lDate) {
        memberList[memberName].latestAction.dateTime = date.getLocaleParsedFullDate(currentDate);
        memberList[memberName].latestAction.action = currentAction;
      }
    }
  }
  //Object in lokaler Browserdatenbank speichern
  localStorage.setItem('ActiveMemberList', JSON.stringify(memberList));
}

/**
 * Holt die Mitspielerliste aus der Browserdatenbank.
 */
function GetActiveAllyMemberList() {
  return JSON.parse(localStorage.getItem('ActiveMemberList'));
}

/**
 * Schaut ob sich ein Spieler in der aktuell gespeicherten Mitgliederliste befindet.
 * 
 * @return Gibt ein Spielerobjekt zurück
 */
function GetMemberFromActiveAllyMemberList(pName) {
  var memberList = (!GetActiveAllyMemberList()) ? false : GetActiveAllyMemberList();
  if(!memberList) return false;
  if(!memberList[pName]) return false;
  
  return memberList[pName];
}

/**
 * Prüft ob das Thema Beiträge beinhaltet, arbeitet diese ab.
 */
function EvaluatePosts() {
  var postList = $('.post');
  if(!postList) return console.log('Keine Foreneinträge vorhanden!');
  
  postList.each(function (){
  	post = jQuery(this);
    GetActiveMembersFromPost(post);
  });
}

/**
 * Holt aus dem HTML Dokument, die Beiträge und bedanken Klicks ab,
 * diese werden in der lokalen Browserdatenbank gespeichert.
 */
function GetActiveMembersFromPost(post) {
  var fMember = jQuery(post).find('span.postheader_left');
  var fMemberName = fMember.find('a').text();
  var fMemberFormatedName = EvaluateName(fMemberName);
  var fMemberDate = fMember.text().replace(fMemberName,"");
  var fMemberFormatedDate = EvaluateDate(fMemberDate);
  AddActiveAllyMemberToList(fMemberFormatedName, fMemberFormatedDate, 'post');
  
  var memberThanks = jQuery(post).find('div.post_thanks_who');
  var thanks = memberThanks.text().split(',');
  for (var val in thanks) {
    if(!thanks[val]) return;
    var bMember = thanks[val].split(" (");
    var bMemberName = bMember[0];
    var bMemberFormatedName = EvaluateName(bMemberName);
    var bMemberDate = bMember[1].replace(")", "");
    var bMemberFormatedDate = EvaluateDate(bMemberDate);
    AddActiveAllyMemberToList(bMemberFormatedName, bMemberFormatedDate, 'thanks');
  }
}

/**
 * Sorgt dafür, dass der Stammesmitgliedsname, dem gewünschten Format entspricht.
 * 
 * @param pName {string} Zu prüfender Stammesmitgliedname
 * 
 * @return Gibt den Stammesmitgliedsnamen im gewünschten Format zurück
 */
function EvaluateName(pName) {
  var reps = {
    "\t": "",
    "\n": ""
  };
  
  var formatedName = pName;
  for (var val in reps) 
  {
    formatedName = formatedName.replace(new RegExp(val, "g"), reps[val]);
  }
  
  return (formatedName[0] == " ") ? formatedName.replace(/[(\ )]/, "") : formatedName;
}

/**
 * Sorgt dafür, dass das Datum dem gewünschten Format entspricht.
 * 
 * @param dsDate {string}
 */
function EvaluateDate(dsDate) {
  var reps = {
    am: "",
    Am: "",
    um: "",
    Um: "",
    uhr: "",
    Uhr: "",
    heute: date.getLocaleDate(),
    Heute: date.getLocaleDate(),
    gestern: date.getLocaleDateOfYesterday(),
    Gestern: date.getLocaleDateOfYesterday(),
    "\t": "",
    "\n": ""
  };
  
  var formatedDate = dsDate;
  for (var val in reps) 
  {
    formatedDate = formatedDate.replace(new RegExp(val, "g"), reps[val]);
  }
  
  return (formatedDate[0] == " ") ? formatedDate.replace(/[(\ )]/, "") : formatedDate;
}

function CompareActiveMembers(){
  var allRows = jQuery('div#ally_content table tr');
  allRows.each(function () {
  	var cRow = jQuery(this);
    if(cRow.find('th').length > 0) {
      cRow.append('<th class="nowrap" width="90">Letzte Aktion</th>')
      cRow.append('<th class="nowrap" width="140">Datum/Uhrzeit</th>');
    }
    else {
      var memberList = GetActiveAllyMemberList();
      var firstTd = cRow.find('td:first a');
      var pName = EvaluateName(firstTd.text());
      var lastAction = (memberList && memberList[pName]) ? memberList[pName].latestAction.action : "";
      var lastActionTitle = (memberList && memberList[pName]) ? BuildLastActionTitle(pName, memberList[pName]) : "";
      lastAction = lastAction.replace("post", "Beitrag").replace("thanks", "Bedankt");
      var lastDate = (memberList && memberList[pName]) ? memberList[pName].latestAction.dateTime : "";
      cRow.append('<td class="lit-item" title="' + lastActionTitle + '">' + lastAction + '</td>');
      var highlight = Highlight(date.parseLocaleFullDate(lastDate));
      cRow.append('<td class="lit-item" style="' + highlight.bgColor + '" title="' + highlight.title + '">' + lastDate + '</td>');
    }
  });
}

function Highlight(lastDate) {
  var redRGBA = 'background-color:rgba(255,120,120,0.8)';
  var yellowRGBA = 'background-color:rgba(255,255,120,0.8)';
  var greenRGBA = 'background-color:rgba(120,255,120,0.8)';
  var goodResult = {bgColor: greenRGBA, title: 'Letzte bekannte Aktion war innheralb der letzten ' + greenMarkHours + 'Stunden!'};
  var okResult = {bgColor: yellowRGBA, title: 'Letzte bekannte Aktion war innheralb der letzten ' + yellowMarkHours + 'Stunden!'};
  var badResult = {bgColor: redRGBA, title: 'Letzte bekannte Aktion war vor mehr als ' + yellowMarkHours + 'Stunden!'}
  var noResult = {bgColor: 'inherit', title: 'Keine Aktion bekannt!'}
    
  var timeDiff = Math.abs(date.getTime() - lastDate.getTime());
  var diffHours = Math.ceil(timeDiff / (1000 * 3600)); 
  
  if(!diffHours) return noResult;
  else if(diffHours < greenMarkHours) return goodResult;
  else if(diffHours < yellowMarkHours) return okResult;
  else return badResult;
}

function BuildLastActionTitle(memberName, memberObject) {
  var postCount = (memberObject.postCount) ? memberObject.postCount.length : 0;
  var thanksCount = (memberObject.thanksCount) ? memberObject.thanksCount.length : 0;
  
  return "Von {0} wurden bisher {1} Beiträge und {2} Bedankungen geloggt.".format(memberName, postCount, thanksCount);
}

function ExportActiveMemberList() {
  var listString = (localStorage.getItem('ActiveMemberList')) ? localStorage.getItem('ActiveMemberList') : 'Keine lokalen Daten vorhanden!';
  CopyToClipboard(listString);
}

function ImportActiveMemberList() {
  var container = jQuery('<div id="copytoclipboard" style="position:fixed;background:rgba(255,248,230,0.2);width:100%;height:100%;z-index: 99999;top: 0;"></div>');
  container.click(function(event) {jQuery(this).remove()});
  var cbox = jQuery('<div id="ctcbox" style="background:#fff8e6;width:80%;height:80%;max-width:900px;max-height:540px;margin:50px auto 0;border: 2px solid #804000;"></div>');
  cbox.click(function(event) {event.stopPropagation()});
  var cheader = jQuery('<div id="ctcboxheader" style="min-height:40px;height:40px;box-sizing: border-box;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;background:#efe6c9;border-bottom: 1px solid #804000;font-size: 1.4em;font-weight: bold;padding: 0.5em;">Extern gesammelte Daten importieren</div>');
  var cheaderinfo = jQuery('<span style="font-weight:normal"> (Von Ablage einfügen: Ctrl/Strg+V)</span>');
  var cheaderclose = jQuery('<a href="#" style="float:right; font-size:2.1em;margin:-0.45em 0;">x</a>');
  cheaderclose.click(function(event) {container.remove()});
  var cbody = jQuery('<div id="ctcboxbody" style="min-height:500px;height:500px;box-sizing: border-box;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;"></div>');
  var cbodytextarea = jQuery('<textarea id="ctcimport" style="resize: none;width:100%;height: 470px;box-sizing: border-box;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;"></textarea>');
  cbodytextarea.focus(function() {
    var $this = $(this);
    $this.select();

    // Work around Chrome's little problem
    $this.mouseup(function() {
        // Prevent further mouseup intervention
        $this.unbind("mouseup");
        return false;
    });
  });
  var cbodyimportbtn = jQuery('<a href="#" style="margin:auto 3px; display:block;" class="btn btn-default">Importieren</a>');
  cbodyimportbtn.click(function (event) {
    var importString = jQuery('textarea#ctcimport').val();
    StoreFromClipboard(importString);
    if (window.location.search.indexOf('mode=members') > 0) {
      window.location.reload();
  	}
    container.remove()
  });
  
  cheaderinfo.appendTo(cheader);
  cheaderclose.appendTo(cheader);
  cheader.appendTo(cbox);
  cbodytextarea.appendTo(cbody);
  cbodyimportbtn.appendTo(cbody);
  cbody.appendTo(cbox);
  cbox.appendTo(container);
  container.appendTo(jQuery(document.body));
  cbodytextarea.focus();
}

function CopyToClipboard(text) {
  var container = jQuery('<div id="copytoclipboard" style="position:fixed;background:rgba(255,248,230,0.2);width:100%;height:100%;z-index: 99999;top: 0;"></div>');
  container.click(function(event) {jQuery(this).remove()});
  var cbox = jQuery('<div id="ctcbox" style="background:#fff8e6;width:80%;height:80%;max-width:900px;max-height:540px;margin:50px auto 0;border: 2px solid #804000;"></div>');
  cbox.click(function(event) {event.stopPropagation()});
  var cheader = jQuery('<div id="ctcboxheader" style="min-height:40px;height:40px;box-sizing: border-box;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;background:#efe6c9;border-bottom: 1px solid #804000;font-size: 1.4em;font-weight: bold;padding: 0.5em;">Lokal gesammelte Daten exportieren</div>');
  var cheaderinfo = jQuery('<span style="font-weight:normal"> (In Ablage kopieren: Ctrl/Strg+C)</span>');
  var cheaderclose = jQuery('<a href="#" style="float:right; font-size:2.1em;margin:-0.45em 0;">x</a>');
  cheaderclose.click(function(event) {container.remove()});
  var cbody = jQuery('<div id="ctcboxbody" style="min-height:500px;height:500px;box-sizing: border-box;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;"></div>');
  var cbodytextarea = jQuery('<textarea style="resize: none;width:100%;height: 500px;box-sizing: border-box;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;" readonly="readonly">' + text + '</textarea>');
  cbodytextarea.focus(function() {
    var $this = $(this);
    $this.select();

    // Work around Chrome's little problem
    $this.mouseup(function() {
        // Prevent further mouseup intervention
        $this.unbind("mouseup");
        return false;
    });
  });
  
  cheaderinfo.appendTo(cheader);
  cheaderclose.appendTo(cheader);
  cheader.appendTo(cbox);
  cbodytextarea.appendTo(cbody);
  cbody.appendTo(cbox);
  cbox.appendTo(container);
  container.appendTo(jQuery(document.body));
  cbodytextarea.focus();
}

function StoreFromClipboard(text) {
  var objectToStore = JSON.parse(text);
  SetActiveAllyMemberListFromObject(objectToStore);
}