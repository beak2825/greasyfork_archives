// ==UserScript==
// @name           Waze Forum Filter France
// @namespace      https://greasyfork.org/fr/scripts/6388-waze-forum-filter-france/code
// @description    Tidies up the Waze Forum interface for users
// @match          http://*.waze.com/forum/*
// @match          https://*.waze.com/forum/*
// @author         Yopinet grace à timbones
// @version        1.5
// @downloadURL https://update.greasyfork.org/scripts/6388/Waze%20Forum%20Filter%20France.user.js
// @updateURL https://update.greasyfork.org/scripts/6388/Waze%20Forum%20Filter%20France.meta.js
// ==/UserScript==

// enable this variable to hide the Waze banner and navigation bar
var hideWazeBanner = true;

// enable this variable to hide Unlock or Update Requests that have been replied to
var hideURReplies = false;

// ======================================================================================

// alias for unsafeWindow in Chrome
if(typeof(unsafeWindow) == "undefined") {
  unsafeWindow = window;
}

function $(id)
{
  return document.getElementById(id);
}

function getElementsByClassName(classname, node)
{
  if(!node) node = document.getElementsByTagName("body")[0];
  var a = [];
  var re = new RegExp('\\b' + classname + '\\b');
  var els = node.getElementsByTagName("*");
  for (var i=0,j=els.length; i<j; i++)
    if (re.test(els[i].className)) a.push(els[i]);
  return a;
}

function getVisible(index)
{
  index = parseInt(index, 10);
  if (localStorage.WazeForumFilter) {
    var visible = JSON.parse(localStorage.WazeForumFilter);
    if (visible != null) {
      console.log("getVisible("+index+") = " + visible[index]);
      return visible[index];
    }
  }
  console.log("getVisible("+index+") = false (not found)");
  return false;
}

function setVisible(index, value)
{
  index = parseInt(index, 10);
  var visible = null;
  if (localStorage.WazeForumFilter)
    visible = JSON.parse(localStorage.WazeForumFilter);

  if (visible == null)
    visible = [];

  visible[index] = value;
  console.log("setVisible("+index+", "+value+")");
  localStorage.WazeForumFilter = JSON.stringify(visible);
}

function toggleVisible()
{
  var currentforum = location.search.match(/.f=([0-9]*)/);
  var visible = !getVisible(currentforum[1]);
  setVisible(currentforum[1], visible);
  if (visible)
    $('viscontrol').innerHTML = "<i>This forum will now appear in search results</i>";
  else
    $('viscontrol').innerHTML = "<i>This forum will now be hidden from search results</i>";
    
  return false;
}

function showHiddenThreads()
{
  rows = getElementsByClassName('row', $('page-body'));
  for (var i=0,j=rows.length; i<j; i++)
    rows[i].style.display = 'block';
    
  $('viscontrol').innerHTML = "<i>All threads now shown</i>";
   
  return false;
}


// first-time initialisation
if (!localStorage.WazeForumFilter) {
  // show these forums from the search results (others are hidden)
  var defaults = new Array();
  defaults[18]  = 1;   // Official Announcements  
      
  defaults[211] = 1;  // WME Beta Testing
  defaults[819] = 1;   // Addons, Extensions, and Scripts
    
    
  defaults[34]  = 1;  // France [Français]
    
  		defaults[1045]   = 1; // Annonces 
    
  		defaults[69]   = 1;  // Waze App
    
  			defaults[220] = 1;  // Android
  			defaults[221] = 1;  // IOS
  			defaults[1024] = 1;   // Windows Phone
  			defaults[222] = 1;   //Les autres 
  			defaults[223] = 1;   // Bugs
    
 	 	 defaults[68] = 1;   // Waze Map Editor
   
			defaults[218]  = 1;   // L'éditeur de Carte WME
      		defaults[71]  = 1;   // Bugs
  			defaults[244]  = 1;   // Demandes de delockage
  			defaults[549]  = 1;   // Demande de mise a jour
  			defaults[955] = 1;   // Restrictions programmees
  			defaults[775] = 1;  // Radars
    		defaults[1316] = 1;  // Scripts
    	
    	defaults[1254] = 1;   // France's Mega Traffic Events
    
  			defaults[1250] = 1;  // Fermetures pour travaux
  			defaults[1255] = 1;  // Fermetures Événementielles
        
                defaults[1345] = 1;   // MapRaid / Mapathon

  		defaults[1266] = 1;   // Community Management
    
  			defaults[1264]  = 1;   // Demandes d'Area Manager
  			defaults[1257] = 1;   // Mentoring
    
   				 defaults[1258] = 1;   // Mentors - France
  
 			defaults[1134] = 1;   // Demandes de rangs
    
  		defaults[194] = 1;   // Nouveau ? Besoin d'aide ? Venez ici en premier !
    
  			defaults[216] = 1;   // Tutos et astuces
  			defaults[217] = 1;   // F.A.Q.
    
    	defaults[70] = 1;   // Les Régions Françaises
    
  			defaults[228] = 1;   // NORD
  			defaults[229] = 1;   // EST
  			defaults[230] = 1;   // OUEST
			defaults[231] = 1;   // ÎLE-DE-FRANCE
  			defaults[232] = 1;   // CENTRE
  			defaults[234] = 1;   // SUD-OUEST
  			defaults[235] = 1;   // SUD-EST
    		defaults[236] = 1;   // D.O.M.
    
   		defaults[1256] = 1;   // Forum
  		
    	defaults[106] = 1;   // Traductions
    
		defaults[224] = 1;   // Pour parler d'autre chose 

		defaults[378] = 1;   // Country Manager France 
  			defaults[1259] = 1;   // Meetup
  			defaults[1301] = 1;   // Suivi des éditeursRefonte Wiki
                        defaults[1352] = 1;   // Refonte Wiki
                
                defaults[1414] = 1;   // State/Regional Manager France

        defaults[1060] = 1;   // Maroc

		defaults[1139] = 1;   // English Forum
		defaults[1137] = 1;   // Devenir Area Manager en Maroc
		defaults[1207] = 1;   // Demandes de déblocage
		defaults[1267] = 1;   // Radar
		defaults[1206] = 1;   // Règles d' édition
		defaults[1268] = 1;   // Villes traitées

    
localStorage.WazeForumFilter = JSON.stringify(defaults);
}

// style hacks
if (hideWazeBanner) {
  document.body.style.backgroundImage = 'none';
  var navigation = getElementsByClassName('navigation', $('content_wrapper'));
  if (navigation.length > 0)
    navigation[0].style.display = 'none';
}

// add missing login button
var navbar = getElementsByClassName('navbar', $('wrap'));
if (navbar.length > 0) {
  var linklist = getElementsByClassName('linklist', navbar[0]);

  if (linklist.length > 1) {
    var iconucp = getElementsByClassName('icon-ucp', linklist[1]);

    if (iconucp.length == 0) {
      login = document.createElement('li');
      login.className = 'icon-ucp leftside';
      login.innerHTML = '<a href="/forum/ucp.php">Login</a>';
      linklist[1].appendChild(login);
    }
  }
}

// fix the title to be useful
if (document.title.match(/ View topic - /))
  document.title = document.title.replace(/.* View topic - /, '') + ' | Waze.com';

// hide threads for hidden forums
if (location.pathname == '/forum/search.php' &&
    location.search.indexOf('search_id') > 0 &&
    location.search.indexOf('egosearch') == -1) {
  rows = getElementsByClassName('row', $('page-body'));
  var num = 0;
  for (var i=0,j=rows.length; i<j; i++) {
    var found = rows[i].innerHTML.match(/viewforum.php.f=([0-9]*)"/);
    if (found == null)
      continue;

    // don't hide any threads I've posted to
    mythread = rows[i].innerHTML.match(/topic_unread_mine.gif|topic_read_mine.gif/);
    if (mythread != null)
      continue;

    // hide Update requests and Unlock requests with more than 1 replies
    if (hideURReplies) {
      noreplies = rows[i].innerHTML.match(/class="posts">0/);
      if (noreplies == null && (found[1] == 199)) {
        rows[i].style.display = 'none';
      }
    }

    // hide any threads from forums not in whitelist
    if (!getVisible(found[1])) {
      rows[i].style.display = 'none';
      num++;
    }
  }
  
  var vislink = document.createElement('a');    
  vislink.innerHTML = "show all";
  vislink.href = "#";
  vislink.onclick = showHiddenThreads;
  
  var viscontrol = document.createElement('p');
  viscontrol.style.cssFloat = "right";
  viscontrol.id = "viscontrol";
  viscontrol.appendChild(document.createTextNode('[ Hidden ' + num + ' threads - '));
  viscontrol.appendChild(vislink);
  viscontrol.appendChild(document.createTextNode(" ]"));
 
  var pagebody = $('page-body');
  pagebody.insertBefore(viscontrol, pagebody.firstChild);
}

// hide [Share] button
if (location.pathname == '/forum/viewtopic.php') {
  posts = getElementsByClassName('postbody', $('page-body'));
  for (var i=0,j=posts.length; i<j; i++) {
   divs = posts[i].getElementsByTagName('div');
   if (divs[0].innerHTML.match(/www.addthis.com/))
      divs[0].style.display = 'none';
  }
}

// add controls to hide/show forums
if (location.pathname == "/forum/viewforum.php") {
  var currentforum = location.search.match(/.f=([0-9]*)/);
  var pagebody = $('page-body');

  if (currentforum != null && pagebody != null) {
    var visible = getVisible(currentforum[1]);
        
    var vislink = document.createElement('a');    
    if (visible)
      vislink.innerHTML = "Hide this forum from search results";
    else
      vislink.innerHTML = "Show this forum in search results";
    vislink.href = "#";
    vislink.onclick = toggleVisible;
      
    var viscontrol = document.createElement('p');
    viscontrol.style.cssFloat = "right";
    viscontrol.id = "viscontrol";
    viscontrol.appendChild(document.createTextNode("[ "));
    viscontrol.appendChild(vislink);
    viscontrol.appendChild(document.createTextNode(" ]"));
    
    pagebody.insertBefore(viscontrol, pagebody.firstChild);
  }
}
// end    
  