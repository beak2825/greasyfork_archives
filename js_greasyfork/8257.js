// ==UserScript==
// @id             mlpchan-anon@scriptish
// @name           /anon/ anon enforcer
// @version        1.0.1
// @namespace      
// @author         
// @description    what the name says
// @include        https://mlpchan.net/*
// @run-at         document-end
// @grant          GM_getValue
// @grant          GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/8257/anon%20anon%20enforcer.user.js
// @updateURL https://update.greasyfork.org/scripts/8257/anon%20anon%20enforcer.meta.js
// ==/UserScript==

(function() {

/* what the board tells us is name#trip overrides this script, but
   if the board tells us an empty name, or an empty trip this script
   overrides that with its full name and full trip if possible.
   Except on /anon/ depending which boxes are checked.
   */

/* mlpchan.net provides localStorage.name
 * we keep stuff in prefs
 * former overrides the latter, but when mlpchan.net clears the former, the latter remains
 * saved.
 */
 
var doreverse = true;

if(localStorage.name) {
    var match = localStorage.name.match(/([^#]+)#?(.*)/);
    if(match) {
        if(match[1].length > 0) {
            doreverse = false;
            GM_setValue('name',match[1]);
        }
        if(match[2].length > 0) {
            doreverse = false;
            GM_setValue('trip',match[2]);
        }
    }
}

var prefs = {};
prefs.name = GM_getValue('name');
prefs.trip = GM_getValue('trip');

if(doreverse) {
    var nametrip = null;    
    if(prefs.name) {
       nametrip = prefs.name;        
    }
    if(prefs.trip) {
        if(nametrip) {
            nametrip += '#'+prefs.trip;
        } else {
            nametrip = '#'+prefs.trip;
        }
    }    
    if(nametrip)         
        localStorage.name = nametrip;
}

var name;
var forms = document.getElementsByTagName('form');
for(var i=0;i<forms.length;++i) {
    var form = forms[i];
    if (form.getAttribute('action') == '/post.php') {
        var inputs = form.getElementsByTagName("input");
        for(var j=0;j<inputs.length;++j) {
            var input = inputs[j];
            if(input.name == 'name') {
                name = input;
                break;
            }
        }
        if(name) break;
    }
}

var qrname;

var current = {};

function updateInfo() {
    var nametrip = '';
    if(current.name) {
        nametrip = current.name;
    }
    if(current.trip) {
        if(nametrip) {
           nametrip += '#'+current.trip;
        } else {
            nametrip = '#'+current.trip;
        }
    }    
    if(name) 
        name.value = nametrip;
    if(qrname)
       qrname.value = nametrip;
}

function getQRName() {
    qrname = document.getElementById("qrname");
    if(qrname) {
        updateInfo();
        return;
    }
    setTimeout(getQRName,100);
}
    
getQRName();

if(!(new RegExp('/anon/').test(document.location))) {
    current.name = prefs.name;
    current.trip = prefs.trip;
    updateInfo();
    return;
}


var anonlink;
var list = document.getElementsByClassName("boardlist top");
if(list.length > 0) {
    list = list[0];
    var links = list.getElementsByClassName("boardlistactive");
    for(var i = 0; i < links.length; ++i) {
        var link = links[i];
        if (link.firstChild.nodeValue == 'anon') {
            anonlink = link;
            break;
        }
    }
} else {
    console.log('No board list found');
}

var box = document.createElement('span');
box.style.visibility = 'visible';
box.style.border = 'thick solid red';
if(anonlink) {
    anonlink.parentNode.insertBefore(box,anonlink.nextSibling);    
} else {
    console.warn("Couldn't find link to /anon/");
    var body = document.getElementsByTagName('body')[0];
    body.insertBefore(box,body.firstChild);
}

function createCheckbox(ident) {    
    var check = document.createElement('input');
    check.setAttribute('type','checkbox');
    check.setAttribute('title','enable '+ident);
    check.checked = GM_getValue("enabled."+ident);
    function update() {
        if(check.checked) {
            current[ident] = null;
        } else {
            current[ident] = prefs[ident];
        }
        updateInfo();
    }
    update();
    check.addEventListener('change',function(e) {
        GM_setValue("enabled."+ident,check.checked);   
        update();
    },true);    
    box.appendChild(check);
}

createCheckbox('name');
createCheckbox('trip');
    
})();
