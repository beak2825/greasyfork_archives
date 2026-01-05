// ==UserScript==
// @name        jovi
// @namespace   http://zemlyaozer.com
// @include     http://ovipets.com/*
// @include     https://ovipets.com/*
// @description OviPets Grease Monkey script providing enhanced UI
// @version     1.27.9
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_listValues
// @grant           GM_registerMenuCommand
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/867/jovi.user.js
// @updateURL https://update.greasyfork.org/scripts/867/jovi.meta.js
// ==/UserScript==

function joviC() {
    // Egg Turning
    var turnq = new Array;
    this.turn = function () { turn(); };
    function turn() {
        console.log('turning');
        var petc = $('.pet');
        addturnq(petc);
        if (turnq.length > 0) {
            setTimeout(window.jovi.parseturnq, 1000);
        } else {
            setTimeout( function() { 
                // if we are on the egg turning tab then reload
              if(getCurrentTab() == 'hatchery')
                location.reload(); 
            }, 50000 );
        }
    }
    function addturnq(petc) {
        for (var p = 0; p < petc.length; p++) {
            var cp = petc[p];
            var foundEgg = false;
            var turnpat = new RegExp('Turn');
            if (turnpat.test(cp.parentNode.innerHTML)) {
                console.log('found egg');
                foundEgg = true;
            }
            if (!foundEgg) {
                console.log('No more eggs found continuing');
                continue;
            }
            var petlA = cp.toString().split('&');
            for (var q = 0; q < petlA.length; q++) {
                if (petlA[q].match('pet')) {
                    var petA = petlA[q].split('=');
                }
            }
            turnq.push({ id: petA[1] });
        }
    }
    this.parseturnq = function () {
        parseturnq();
    };
    this.goodtq = false;
    function parseturnq() {
        if (turnq.length > 0) {
            this.goodtq = true;
            console.log('turning busy state start ' + isbusy);
            if (!isbusy)
                busy();
            var pet = turnq.pop();
            console.log('cmd=pet_turn_egg&PetID=' + pet.id);
            if (!config.testing) {
                $.post('/cmd.php',{cmd: "pet_turn_egg",PetID: pet.id});
            }
            else "testing mode";
            setTimeout(window.jovi.parseturnq, 1000);
        } else {
            console.log('turning busy state stop ' + isbusy);
            if (isbusy)
                busy();
            if (alwaysturn) {
                console.log('alwaysturn');
            }  
            if (this.goodtq) {
               setTimeout( function() { location.reload(); }, 5000);
            }
        }
    }
    // Always turn
    var alwaysturn = false;
    this.alwaysturnset = function() {
        alwaysturnset();
    };
    function alwaysturnset() {
        console.log('alwaysturnset: ');
        if (!alwaysturn)
            console.log("enable %s",GM_setValue('alwaysturn', true));
        else
            console.log("disable %s",GM_setValue('alwaysturn', false));
        turn();
    }
    function alwaysturninit() {
        alwaysturn = GM_getValue('alwaysturn',false);
        var awaysturnchecked = alwaysturn ? 'checked' : '';
        if($('#jovitab').length > 0) return;
        var tabsright = document.getElementsByClassName('tabs right')[0];
        tabsright.insertAdjacentHTML('beforeend', '<li id="jovitab"><span id="jovitabsp" class="search" title="Turn Eggs\nClick to turn eggs on this page.\nPage will refresh when done.\n\nDoes not hatch egss,\nso if there are still egg showing the turn symbol\nit likely means they need to be hatched."><a id="jovitaba" style="background-repeat: no-repeat;background-position: center;background-image:url(data:image/gif;base64,' + eggturnimage + ');"><span style="display: none;">Jovi</span></a></span></li>');
        var jt = document.getElementById('jovitab');
        jt.onclick=function() { window.jovi.turn(); };
        var maincontent = document.getElementById('main_content');
        maincontent.insertAdjacentHTML('afterbegin','<div id="jovialwaysturn"><input type="checkbox" title="Always Turn\n Continuously turns eggs every 5 minutes." style="float:right;" ' + awaysturnchecked + ' ></div>');
        var at = document.getElementById('jovialwaysturn');
        at.onclick=function() { window.jovi.alwaysturnset(); };
        at.style.position = "absolute";
        at.style.right = "3px";
        at.style.top = "3px";
        at.onmouseover = '';
        if(alwaysturn) setTimeout(turn, 1000);
    }
    
    // Feed 
    var feedq = new Array;
    this.feed = function () {
        feed();
    };
    function feed() {
        console.log('feeding');
        var tab = getCurrentTab();
        var petc = tab.getElementsByClassName('pet');
        addfeedq(petc);
        if (feedq.length > 0) {
            console.log('feed set parsefeedq');
            setTimeout(window.jovi.parsefeedq, 1000);
        }
    }
    function hasClass(element, cls) {
      return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }
    function addfeedq(petc) {
        for (var p = 0; p < petc.length; p++) {
          var pets = petc[p];
          if(hasClass(pets,'name')) {
            var petlA = pets.toString().split('&');
            for (var q = 0; q < petlA.length; q++) {
                if (petlA[q].match('pet')) {
                    var petA = petlA[q].split('=');
                }
            }
            feedq.push({
                id: petA[1]
            });
          }
        }
    }
    this.parsefeedq = function () {
        parsefeedq();
    };
    function parsefeedq() {
        if (feedq.length > 0) {
            if (!isbusy)
                busy();
            var pet = feedq.pop();
            if (!config.testing)
                $.post('/cmd.php', {
                    cmd: 'pet_feed',
                    PetID: pet.id
                });
            setTimeout(window.jovi.parsefeedq, 1000);
        } else {
            if (isbusy)
                busy();
            this.isbulkfeeding = false;
        }
    }
    function feedalltabscb(idx) {
        var tab = getCurrentTab();
        if(tab === 0) return (idx - 1);
        if(tab.id == 'edit') {console.log('edit tab found exiting');return idx;} 
        var petc = tab.getElementsByClassName('pet');
        addfeedq(petc);
        if (feedq.length > 0) {
            console.log('feed set parsefeedq');
            setTimeout(window.jovi.parsefeedq, 1000);
        }
        return idx;
    }
    function feedalltabsret() {
        if (feedq.length > 1) {
            console.log('feedalltabsret set parsefeedq');
            setTimeout(window.jovi.parsefeedq, 1000);
        }
    }
    this.feedalltabs = function() { feedalltabs(); };
    function feedalltabs() {
        doalltabs(feedalltabscb,feedalltabsret,0);
    }

    // Check starving button
    this.checkstarving = function () { checkstarving(); };
    function checkstarving() {
        doalltabs(function(idx) { console.log('cb idx ' + idx); return idx; },function() { checkstarvingp2(); },0);
    }
    this.checkstarvingp2 = function() { checkstarvingp2(); };
    function checkstarvingp2() {
        console.log('checkstarvingp2');
        var alerts = document.getElementsByClassName('alert');
        this.starvetabidx = 0;
       // if(alerts.length > 0) {
            // get pet class
           // for(p=0;p<alerts.length;p++) {
            //    var pet = alerts[p].getElementsByClassName('pet');
                
           // }
         //   alert("There are "+alerts.length+" pets starving.");

        //}
        var starvebtn = document.getElementById('jovistarvebtn');
        var pets = document.getElementsByClassName('pet');
        starvebtn.setAttribute('title','Starving pets '+alerts.length+' of '+pets.length);
    }
    function stravingbtn() {
        if($('#jovistarvebtn').length > 0) return;
        var content = document.getElementById('main_content');
        content.insertAdjacentHTML('afterbegin','<img id="jovistarvebtn" title="Starving Pet Patrol\nCheck for starving pets on all tabs\nWhen complete it will stop changing tabs\nMouseover this again for information" src="//cdn.ovipets.com/famfamfam/exclamation.png" title="Check Starving" >');
        var starvebtn = document.getElementById('jovistarvebtn');
        starvebtn.style.position = "absolute";
        starvebtn.style.right = "3px";
        starvebtn.style.top = "3px";
        starvebtn.onmouseover = '';
     
        starvebtn.onclick = function(e){ window.jovi.checkstarving(); };
    }
    
    // Resurect pets
    function resurectbtn() {
        // Add a button to check for starving pets
        // http://cdn.ovipets.com/famfamfam/exclamation.png 
        var content = document.getElementById('main_content');
        // insert at the top of content
        var tabsright = document.getElementsByClassName('tabs right')[0];
        tabsright.insertAdjacentHTML('beforeend', '<li id="jovitab"><span id="jovitabsp" class="search" title="Resurect pets in search.  To use, do a search on dead pets, then click the resurect button and it will resurect them."><a id="jovitaba" style="background-repeat: no-repeat;background-position: center;background-image:url(data:image/gif;base64,' + resurectimage + ');"><span style="display: none;">Jovi</span></a></span></li>');
        var resurectbtn = document.getElementById('jovitab');
        resurectbtn.onmouseover = '';
// no window.jovi in src search mode
        resurectbtn.onclick = function(e) { window.jovi.resurect(); };
    }
    function resurect() {
        console.log("Awaken the dead...");
        // get all class pets
        var pets = $(".pet").not("img");
        pets.each( function(idx,cpet) { var lpetA = cpet.href.split("?")[1].split("&"); var resurectPetId = lpetA[3].split("=")[1]; setTimeout(function() { console.log("Resurecting, " + resurectPetId); $.post('/cmd.php', { cmd: 'pet_resurrect', PetID: resurectPetId }); },(idx * 1000)); });
    }
    this.resurect = function() { resurect(); }
    // Utility functions
    var isbusy = false;
    this.busy = function () {
        busy();
    };
    this.doalltabs = function(cb,ret,idx) { doalltabs(cb,ret,idx); };
    // Do cb on all tabs and compelete with ret
    function doalltabs(cb,ret,idx) {
        var tabs = document.getElementsByClassName('ui-tabs-anchor');
        if(idx < tabs.length) {
            var tab = tabs.item(idx);
            tab.click();
            idx++;
            var doallidx = idx;
            setTimeout(function() { doalltabs(cb,ret,cb(idx)); },1000);
        } else {
            tabs.item(0).click();
            setTimeout(ret,1000);
        }
    }
    // Change the state of the icon to show loader image
    function busy() {
        console.log('busy state: ' + isbusy);
        if (!isbusy) {
            document.getElementById('jovitaba').style.backgroundImage = 'url(data:image/gif;base64,' + ajaxloader + ')';
            isbusy = true;
        } else {
            var revertImage;
            if (sub == 'overview')
                revertImage = feedimage;
            else if (sub == 'hatchery')
                revertImage = eggturnimage;
            document.getElementById('jovitaba').style.backgroundImage = 'url(data:image/gif;base64,' + revertImage + ')';
            isbusy = false;
        }
    }
    // Get friends
    function getfriends() {
        console.log('checking friends');
        var fs = document.getElementsByClassName('friends');
        console.log(fs);
    }
    // Decode search
    function getQueryVariable(variable) {
        var query = window.location.toString().split('?');
        if(query.length < 2) return 0;
        var vars = query[1].split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == variable) {
                return decodeURIComponent(pair[1]);
            }
        }
        return 0;
    }
    var ctab = 0;
    // Get the current ovipets tab
    function getCurrentTab(p) {
        p = typeof p !== 'undefined' ? p : 0;
        var panels = document.getElementsByClassName('ui-tabs-panel');
        var elem;
        for (p; p < panels.length; p++) {
            if (panels[p].style.display != 'none') {
                if(panels[p].childNodes.length > 0)
                    elem = panels[p].childNodes[0].childNodes[0];
                else { 
                    console.log('failed to retrieve tab info on tab ' + p );
                    return 0;
                }
                return elem;
            }
        }
        console.log('fail getting current tab');
        return 0;
    }
    this.isbulkfeeding = false;
    function feedswitch() {
        console.log('feedswitch isbulkfeeding currenty isbusy '+isbusy);
        if(!isbusy) window.jovi.feed();
    }

    // Random number generator
    function shuffle(o) {
      for(var j, x, i = o.length; i; j = Math.floor(Math.random()*i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
    }
    function randlist(le,lo) {
      var a = new Array();
      a = le.val().split("\n");
      a = a.filter(function(n){if(n.length > 0){return true;}});
      if($("#addnumbers").is(":checked")) for(var i=0;i<a.length;i++) { a[i] = (i+1) +  " " + a[i];}
      a = shuffle(a);
      var r = a.join("\n");
      lo.val(r+"\n\nThere were "+a.length+" items in your list.\n"+"\nGenerated "+new Date().toUTCString());
    }
    function randnum(lo,up,out) {
      var len = up.val() - lo.val() + 1;
      var rn = Math.floor(Math.random()*len);
      out.val(parseFloat(rn) + parseFloat(lo.val()));
    }
    function showrng() {
      if($("#rngcontainer").length) {
        $("#rngcontainer").remove();
      } else {
        var rnghtml = '<div id="rngcontainer" style="display: block; width: 800px;height: 400px; top: 200px;position:relative;top:80px;"><div id="randlist"  style="height: 350px;  width: 400px;  box-shadow: 2px 2px 20px 2px #1e223e;  border-radius: 7px;padding: 10px;background-color: #FFF;float: left;" ><div style="border: solid 1px;padding: 5px; margin: 5px; border-radius: 7px;"><div><b>The Shuffler</b></div><textarea id="listentry" placeholder="Enter a list to be shuffled here." style="height: 200px;width: 48%"></textarea><textarea id="listout" style="height:200px;width: 48%" placeholder="After clicking &quot;Shuffle List&quot; the results will appear here, click on the results to select then copy the selection." readonly onclick="this.select();"></textarea>Prefix lines with numbers <input type="checkbox" id="addnumbers" checked style="width: 15%;"><input type="button" style="float: right;width: 35%;" value="Shuffle List" id="shufflebtn"></div><div style="border: solid 1px; border-radius: 7px; padding: 5px; margin: 5px;">Random Number Generator<br><input type="text" style="width: 40%;" value="1" size="4" id="lower">-<input style="width: 40%;" type="text" value="100" size="4" id="upper"><input type="button" id="rndbtn" value="Pick" style="width: 40%;">&nbsp;&nbsp;<input type="text" size="4" readonly id="out" style="width: 40%;"></div></div><div style="height: 330px; position: relative; width: 250px; display: block; box-shadow: 2px 2px 20px 2px #1e223e;  border-radius: 7px;padding: 10px;background-color: #FFF;float: left;margin-left: 10px;"><div><b>Settings</b></div><div><div title="When checked the egg turner is visible in the hatchery.">Show Hatchery&nbsp;<input type="checkbox" id="jsetshowhatchery"></div><br><div title="By default the message composition boxes expand dynamically, the keystroke event checks the height on every keystroke, which is heavy on cpu.  This option causes the box to scroll and disables the keystroke event.">Disable Typing Event&nbsp;<input type="checkbox" id="jsettypeevt"></div><br><div title="Pushes comments to the bottom of the message thread for faster access to the comment button.  Currently this does not update ajax loads only effecting the first load of comments.">Bottom Comments&nbsp;<input type="checkbox" id="jsetbtmcmt"></div><br><div title="Sometimes it can be difficult to select the entire comment, this adds a button to automatically select the text in the comment.">Comment Selector&nbsp;<input type="checkbox" id="jsetslctcmt"></div><br>  <div title="Make the pets in the enclosure more condensed for less scrolling.">Shrink Enclosure&nbsp;<input type="checkbox" id="jsetshrnkenc"></div> <br>  <div title="Open the pet page in an iframe in the enclosure, this is still buggy, off by default.">Open Pets In Enclosure&nbsp;<input type="checkbox" id="jsetopnnwc"></div> <br> <div style="position: absolute;bottom: 0;">Settings save automatically, for changes to be applied reload the page.</div></div></div><button id="closerng" style="position: relative; display: block; float: left;">X</button></div>';
        document.getElementById("wrapper").insertAdjacentHTML('afterbegin', rnghtml);
        $("#shufflebtn").on('click',function() { randlist($('#listentry'),$('#listout')); });
        $("#rndbtn").on('click',function() { randnum($('#lower'),$('#upper'),$('#out')); });
        $("#closerng").on('click',function() { showrng(); });
        // load config settings into gui
        $("#jsetshowhatchery").prop("checked",config.showhatchery);
        $("#jsettypeevt").prop("checked",config.typeevt);
        $("#jsetbtmcmt").prop("checked",config.btmcmt);
        $("#jsetslctcmt").prop("checked",config.slctcmt);
        $("#jsetshrnkenc").prop("checked",config.shrnkenc);
        $("#jsetopnnw").prop("checked",config.opnnw);
        // apply events for state changes
        document.getElementById("jsetshowhatchery").addEventListener("click",function() { GM_setValue("showhatchery",$("#jsetshowhatchery").prop("checked")); },true);
        document.getElementById("jsettypeevt").addEventListener("click",function() { GM_setValue("typeevt",$("#jsettypeevt").prop("checked")); },true);
        document.getElementById("jsetbtmcmt").addEventListener("click",function() { GM_setValue("btmcmt",$("#jsetbtmcmt").prop("checked")); },true);
        document.getElementById("jsetslctcmt").addEventListener("click",function() { GM_setValue("slctcmt",$("#jsetslctcmt").prop("checked")); },true);
        document.getElementById("jsetshrnkenc").addEventListener("click",function() { GM_setValue("shrnkenc",$("#jsetshrnkenc").prop("checked")); },true);
        document.getElementById("jsetopnnw").addEventListener("click",function() { GM_setValue("opnnw",$("#jsetopnnw").prop("checked")); },true);
      }
    }
    function getStyleRule(name) {
      for(var i=0; i<document.styleSheets.length; i++) {
        var ix, sheet = document.styleSheets[i];
        for (ix=0; ix<sheet.cssRules.length; ix++) {
            if (sheet.cssRules[ix].selectorText === name)
                return sheet.cssRules[ix].style;
        }
      }
      return null;
    }
    function showpetframe(e) {
        $("#petframeC").css("display","block").css("position","fixed");
        var pos = $(e.target).position;
    }
    function shrinkEnclosure() {
        if(config.shrnkenc != true) return;
        $("img[width=150]").prop("width","75");
        $("img[height=150]").prop("height","75");
        $("#src_pets #sub_overview #enclosures .ui-section li").css("width", "75px");
        $("#src_pets #sub_overview #enclosures .ui-section li").css("height", "90px");
    }
    function openNow() {
        if(config.opnnw != true) return;
        // onclick append iframe to document with link of pet
        $("#src_pets #sub_overview #enclosures .ui-section li").off("click").unbind("click");
        //$("#src_pets #sub_overview #enclosures .ui-section li").on("click",function(e) { e.stopPropagation(); });
        //$("#src_pets .pet").prop("href","javascript:void(0)").on("click",function(e) { e.stopPropagation(); console.log(e); });
        $("#content").append("<div id='petframeC' style='top: 100px; margin: auto;' class='ui-dialog ui-widget ui-widget-content ui-corner-all ui-front ui-dialog-buttons ui-draggable ui-resizable' ><div id='petframeK' class='selectallmessage btn ui-button ui-input ui-button ui-widget ui-state-default ui-corner-all' style='padding: 10px;float: right; position: relative;'>X</div><iframe id='petframe' name='petframe' src='#' width='800' height='600'></iframe></div>");
        $(".pet").prop("target","petframe").on("click", showpetframe);
        $("#petframeK").on("click",function() { $("#petframeC").css("display","none"); });
    }
    function bottomComments() {
      if(config.btmcmt != true) return;
      // check config
      var commentDiv = $("button[title='Comment']").parent()
      commentDiv.css("position","absolute").css("bottom", "10px");
      commentDiv.parent().css("position","relative");
    }
    function showCommentSelector() {
        if(config.slctcmt != true) return;
        if($(".selectallmessage").length > 0 ) return;
        var parsed=$("div.parsed_txt")
        parsed.parent().prepend("<div class='selectallmessage btn ui-button ui-input ui-button ui-widget ui-state-default ui-corner-all' style='float: right;cursor:pointer;' >S</div>");
        $("div.selectallmessage").click( function(e) {  
          var container = $(e.target).siblings()[0];
          if (document.selection) {
              var range = document.body.createTextRange();
              range.moveToElementText(container);
              range.select();
          } else if (window.getSelection) {
              var range = document.createRange();
              range.selectNode(container);
              window.getSelection().addRange(range);
          }
        } );
    }
    function showToolbox() {
        // check config
        var tabsright = document.getElementsByClassName('tabs right')[0];
        if($("#showrng").length == 0) {
          tabsright.insertAdjacentHTML('beforeend','<li id="showrng" title="Show Random Tools and Settings" style="cursor: pointer; float: right;"><span class="search"><a id="showrngd"  style="background-repeat: no-repeat;background-position: center;background-image:url(data:image/gif;base64,' + randomhat + ');"><span style="display: none;">Jovi</span></a></span></li>');
          $("#showrng").on('click',function() { showrng(); });
        }
    }

    this.effectuis = function() { effectuis(); };
    function effectuis() {
      if(config.typeevt != true) return;
      unsafeWindow.$("textarea").unbind('keyup').off('keyup').removeAttr('keyup');
      $("textarea").click(function(e){ e.target.style.height = '100px';e.target.style.resize = 'vertical';});
      $('.ui-button').click(function(e) {
        setTimeout(function() { unsafeWindow.$("textarea").unbind('keyup').off('keyup').removeAttr('keyup').click(function(e){ e.target.style.height = '100px';e.target.style.resize = 'vertical';});},1000);
      });
    }
    var ta = 0;
    this.editor = function() { editor(); };
    function editor() {
        var dialog = $('#dialog');
        if(dialog.style.display == 'none') return;
        ta = document.getElementById('dialog').parentNode.removeChild(dialog);
        document.getElementById('wrapper').insertAdjacentHTML('afterend','<div id="jovitawrap" style="position: fixed; top: 10px; left: 10px;z-index: 10000;" ><textarea cols="120" rows="30" id="jovita"></textarea> <input type="button" onclick="window.jovi.editorsave();" value="Ok"></div>');
    }
    this.editorsave = function() {editorsave();};
    function editorsave() {
        console.log('editorsave');
        var dialog = document.getElementById('dialog');
        ta.value = document.getElementById('jovita').value;
        var wr = document.getElementById('jovitawrap');
        document.getElementById('wrapper').removeChild(wr);
    }
    var sub = '';
    this.subsw = function () { subsw(); };
    function subsw() {
        console.log('subsw');
//style="background-repeat: no-repeat;background-position: center;background-image:url(data:image/gif;base64,' + joviimage + ' );"
        var tabsright = document.getElementsByClassName('tabs right')[0];
        switch (getQueryVariable('sub')) {
        case 'overview':
            sub = 'overview';
            stravingbtn();
            shrinkEnclosure();
            openNow();
            if($('#jovitab').length > 0) return;
            tabsright.insertAdjacentHTML('beforeend', '<li id="jovitab" title="Feed Time!\nClick to feed all pets on the current tab.\nDouble Click to feed all tabs.\n\nFeed all pets seems to stall on larger enclosure sets, stopping feeding after 2000 or so pets, to continue turning do not refresh the page and double click again, it should continue where you stopped.  If you notice this bug, please comment on the ticket with the number that it is stopping on currently written to the console as qlen."><span id="jovitabsp" class="search"><a id="jovitaba"  style="background-repeat: no-repeat;background-position: center;background-image:url(data:image/gif;base64,' + feedimage + ');"><span style="display: none;">Jovi</span></a></span></li>');
            var jt = document.getElementById('jovitab');
            jt.onclick=function() {  setTimeout(feedswitch,1000); };
            jt.ondblclick=function() { this.isbulkfeeding = true; window.jovi.feedalltabs(); };
            break;
        case 'hatchery':
            sub = 'hatchery';
            if (config.showhatchery) {
                alwaysturninit();
            }
            break;
        case 'profile':
            if($("#joviproact").length > 0) return;
            sub = 'profile';
            var title = document.getElementById('profile').getElementsByClassName('ui-section-next')[0];
            title.insertAdjacentHTML('beforebegin', '<img id="joviproact" title="Feed Pet\nOr first action from the left\nThis makes it quick to burn through a few pets and feed, don\'t move your mouse." onclick="getElementById(\'profile\').getElementsByClassName(\'ui-button\')[0].click();" style="cursor: pointer;float: right;" src="data:image/png;base64,'+action+'" />');
            break;
        default:
            showToolbox();
            showCommentSelector();
            bottomComments();
            break;
        }

    }
    this.init = function () { init(); };
    function init() {
        console.log('init oppw');
        loadconfig();
        effectuis();
        switch (getQueryVariable('src')) {
        case 'pets':
            subsw();
            break;
        case 'search':
            resurectbtn();
            break;
        default:
            showToolbox();
            showCommentSelector();
            bottomComments();
          break;
        }
    }
    // config
    this.config = config;
    var config = {
      testing: false,
      showhatchery: true,
      typeevt: true,
      btmcmt: true,
      slctcmt: true,
      shrnkenc: true,
      opnnw: false
    };
    function loadconfig() {
        var lconf = GM_listValues();
        for(var dprop in config) {
            config[dprop] = GM_getValue(dprop,config[dprop]);
        }
    }
    // Images
    var feedimage = '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';
    var eggturnimage = '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';
    var ajaxloader = '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';
    var randomhat = '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';
    var action = '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';
    var joviimage = '';
    var resurectimage = 'iVBORw0KGgoAAAANSUhEUgAAADIAAAApCAIAAAD4TO2+AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAOwwAADsMBx2+oZAAAEoFJREFUWMNtl8mPptd13u+58zt+Y301dg3srm52cxJFUpTYokQJtITIiQ0YdgzF8YQg8MLwNllmQhbJKousAiQ7ZQACBDYiR4NpK6KkiGKryW6S6map56quqm+ob3rnO2bRsk0bfv6CH+45z/OcC4xL9NfyAF5SlsgAPOq24k4rlZIJQaXkkZQrvTSJgtPxYjydF7VOIsEpJZRWTTMaz7KicdZeenpnMp4PR1PvPQAAgLUWAABBHIaEgNbWGIMxRh4Jzhxyi6xYZlnRGIRAO4MREELoXzEhQAQRQWgieTuNhWBxHHJOMMGtOOx2W+v9FmEkLxtjHSaw2mtzwSjBWmvjPAa8vbN19Qsv5ZWbjCcIIYyx9x4hxAgNAykDiTzCGBDy3iNKSRgyxkggGMaEYRxKbq0ngD+JhQAhAGCESEbSONpY64eSM0I5o1EYRKGQgnFBvHNAyJWnzyOAdhJQRp1xAIAxnuX1nfuje/eOOPaAEKb86hdfbbfTuswpoc55jIFSKiU1Vte1ooymaRQGMuBMSp5G4fFkWln911iAEEIIAwoYS5Oo005aSSiEwABAcBgIwSnnDAP2HhUaKu1u3318YXuAkCcEAwDFMF2U01nhnU9CFsfibF4dHo1u//xhrxNRgr2zGAPGiDLinOeMa20k50rpTiuWgZgusrNZbqyln1gsBIAYIZQQKUUYCsYYIVgbTTHlnBJCAQNgzAV/56fXq8YVRf3Kc7thKLhgjDNCCGN50yydcaLb7qThwYPj4fHSeXdpZ4VTwhh2znvvrXHeI8aoc3aeLaUU1jltzGq/c/9oXBn1SSxACBFCCAbnrEc+q2qMkeBMcEYpEVxQzlYGbWPt6qDz3bevA8DHdx9//jOXs6wMw4BRsijM2vrKfJZhrwIpAIOxChAmmDBKldKAwVuvjceArbWAQUoWhTIQIhCcUkwZIQ35JJZH/skcgXNRlApDkySxRxhjsM6XTc0lBoQCIfvdGACev/yUlGEcB85ZSmlZlvNFluX1dDo/v7fWaaedpEUoH47PACEg9OLlnXt3H9am9g45h4wxgCEQst9OgiDgFKRgL1za/fDgAf0EFHjwxloAaBplrWOMcW4E94QQpYxzLoqEds5ZvbOx+uZrr3bb8clovrnWb6dRVTVSUEpZWS2t81pbj9zDxyPJmbM2DOTpvPZHZ/OsCTjG2GhtEUKY4DDk3XZsPVJKrfXaX/3CC5curONP7hbyoIytrdXKGOsQQtq6SilrnDK2anTV6KY2zrlOJzk6HlmMz2aL4Xi6Nuh10qTVSox365u9Xr/TbsdhKKMgSJKUMcEFP7h77/r7t08mE8YIAmiaRilFMWBMjUNF0ZSVPhxO5lmJ3N/IrV/IegeAJOeBFK007LUTxqkQPE3CdisKpJCCB1L+8N3bGPxnX32BYvTU9hryvmpMqdGzz55fHfSxM3mlFrmaLpaU4vM7a9dv3THGRoHYGHQ9Qs76vCwbbbrteDJbKG2VMY2ynPPtzd7fgeWcUxZJzjrtZGOtO+illBLBWZpEjFLOaRgIGYiidlc/98IrL+4j7ztpYKzNijqK01YSXLv+cRzQ7d3NwUqHEArOJAH3jqatlGK/0kkxxgCglOn20vVB52Q0HU7mqjHauKKq97YHGP0d8tbZqlZZXlBKW62k30tWVvuEUowxIVhKLhmzph4Nz5qqns4Kh4AQao2jGBmlhsMzGQhM6PbWKqds99zKyXhBKXPGrq10nviaMiIDDgilcRSF4Wg8Pzwd50Xx4Gj4w2sf/20seOJGhErVLPPSWaeVUp7LKJ6WxiEgBBNMRCCefXrn5kd3jHFK68PjM+/9fFl4Y61xRtfjSfbe9Y8PDg7fuXbjU5ef8oiezZfLLD+3PsAIee8Jgf2nNl58Zm86X84XufU+K+r7R8PDk8nb7/7sbw3R/yUWCM767XR7ayAD8e3v3fQIKmWHo/nuVp8zKiRrJfGffvvHaRx1Oq2irBvj68YVpVLGbmwM8qwcjs9Oh9Pze2vdbidXbjbLttfbu1urGHCShJtrvcv751b66eOTaaV0UVaV0rXWldLaWfo338kjhAABxhgDdh5NF3m/l672wu//4L1Wkqyu9WZZmcaBNTYKeRQHDw+H7VbsnQeHjHXLZT4azzY3+leunH/p01fGZzOt1PFokcahQ/aXf+lVb83mWieJg8Pj8cOjcRgw55B3KInj09myVhqQQ9b/VSE6hJ6cIZhhyimhGGtllDKU0qsvX75152GWg3msHj5eWe2ngfPEofN7W9YgAKydaZS2zt17cDidFVXddLrpzvbahb1N7/3J6P0f/ujGhad6K93IKLO11j0eze49mhydTKqyzrI6K6vJ2UIbSwlBCBOMCSH0yeAIJhjjgPMklIyQVhTu7K1vrvbXVlqC0089s/f9/3fzMy9e2dxYyRb13laPMzJd1mmrncSyKOtA8iQWUoQ/fe/2fFl454yyCLlWKh+dzu/ce/DP//DX7t4/PTqZLovy4ePJIivHk/nobNkoU9eN1qax1ntPCUXeE0LxL24HRDilnLE4lEkcdDutbjftd9N+JwpC1uum2+dW/+Q7P/YGndte6/fTNA6Px8vBoIMJCQKe5+XkbFmWVbuTjMaz0WT64OHjw5PRcFLc+Oju13/ltcsXto5Ozu7cP7l15/FwPJ/OsrPJPM/Lum6cQ4SQUinnPPIIY/yJ8gHvkEcIKW3aSfLEce00ZJxIKQjBL1ze3d1e2dxcCQN559E0kkG329LaDE+mgmPBxWwxGo8Xda02N/o7W+txJG/fO7x3/zEY+5UvvJiXxWxRzIuiLBUAUEoQBm1sozUAcgiUVgCAgHjvCSXkL8EwAoQRUAKMkigKPvXs7vqgFYUyTSJKYJmVURi89YObuzvrG6u9u0cT59ydg0cAKJCiqhshhAwEQujkZFI1zfr6yqufvtTutQmFZy+sO4c+Ojg8Hc7KoqYEE0KEoAjAaKOMUdYpbZxzGDClmFJCrHNPji3kkUOIErI66F48v9ltRQiQ4DQOOGO01Uo2Vvvf/9GH77z78dpKp9eJm1qvrq4opRtjhZRVVUdRgBD0+y0ZSkIJ4+zw5CwNOfK+rhvvXV2rplEYYw9oOp1b64JAamM98owypZV3FiFCdtYGxnqMseSMYMwoTcJg/6nNvXOrSSxbSdhL4zgKpBDIO0AIMPrO997Pa0MJ7nYSpU1jtBDMAXDGKIWyaqz1QvI0DSvVHNw93j+3sjZIz2b5cLK8d3iqGt0opRrlnCvyCmMMyAMCANDOAwDDGHNK00A6Z87127tr/Ujy9bXe2qCdpEEcySQUYSQ454RS55wI+JtfeClO2OPHw+Ph/MNb9zEhu1uDbjf1HuZ5gTDmnLU7SRjKJJYPj6Znk3mrFdTaWI+0sq0oBAxKqapuvPWMMWOsc0gKlgYiFpxgar0nOxvrUSSrsnluf3t9tbsomgu7GxfPr8eR5JwmgWSMMMoIhmVRaeuss4Fgb/3gfexpt9+21hBKnEfLrDw+nVEMBOMw4GEo4jC4fzi6e/+xFJwSfOfByeloPprOZlnWKGONA0CEYmstxlhrgxAAAYzAeU8ns5n3SDk7z6undtcKbeJYMko4JZwSjAEAc84xIELIbJEDwPPP7H3ptef+4kcflmWxvrFy099vGhVGYRIHabxalbVzTgZstliCdxR7j/zb126fnWWqao4ej/O6oYRwAG0MsqC0JoABgFIcMeFt7REl2rtEcuLhxct73TT64Na923cevvLCpU4rTKKAEhBCSCkohUabrCyRh0DSZ5/etdZe/+DnZdGUZaOUqsp6b3c9n+dxLBDymJK6Ntffu7251tpYaRdlU2bF4fFoPM8AEMWUAjjvlHXGeeMdwZgSCgCN0tpZIqjYWe0JxmqtnrtwznuggJ+9vBtFUnIqpYyjkHMCyGd5MzpbpHG43utQii+e35wu8tt3DrXWAKjbbd2/d5zEcrksKOME4Pjk7Pp7t5+7vHu2zO89PJmcLUazhUeIYUwBU4K188oY5/2TGEAIOWudR8Y5QjlL4ujlT+3ni+LyhS1PaNpJHIJONwk5D8OAM8YZQR7Ns+LxaC4Y4YwCoIePp1Eor9382BqfJnGeV7pR4/F0PJk1WlWNOToZl0W1udm/c+94PJplWa6tlZRSghmlAFBprYx5kpndNKkahRwy3lnnCMG4rNXZNNte7+9s9BtrMefddrSx0maUhGFACBGcNE1zNJqOp9ksq6aL4sODozsPT7NS5UU9nWW60cZa511e1ePZoiqaplGCS6U1An9yMsmWBcIYMDBCGCHGO++Rsc4hlITBM/tby2WOMa611k+a0XnfKD3Pq9mimC7yIJABpxuDlrPOI9BKh5Ihj8bz/ODuSVaqxpjpIp/PcoKxkCwQPImiKAoR8k1dc0KCVjLPFotFFgi+OmidTZZPwmlaZM/s73Rb0aOjkdJuOJ3vbK7FIXfOjyfzvGkapRlhGGOEEKGUYgAMoJr6ws5GHLJCWYdQrbS2No6k4EwZO18WJ+NFXjazebaY5846ACQEV40pK721tdqKQqM0IGin0dMX9y5d2uWMYfyL3yehsMjLxSL/9HMXG2MPHhzWyjRG3zs8ravGOrvWaw9nmUPII/+LqsYYO+dX+x3rHCW0nC8BSBQJynDVNKkN5lm5zEvnfBoFWpuzaVZUdRwGWhmEfFmURVFe2NuQglrrAPmybrKyKbJifb1dVUop3eSNc15r8z+/+TahBDnEMZ4vs34cv/TM3upKZ7YsBGcPTiZZUSLnCWcMA46DwBh94+AwL8uqatIkDqNAG3M6zZJYHjwcqsYWVc0ZpQSqSk9n8zQJO2lMMNx9cNLpttYHvSSSkaT9fotgGPRbVdMwAkoZBBAHohUJjIETwjElgCghHkHM2dqgE0h+dDzRSnfiMA4Fp4wEjBOMG2NjyVuxnEyXy6zSyiRpyChJAh5HEmOSlRUgzxk/PhljgqvaLJb51nq/rJuj46lzDgNYg+IodN6120nV2MloIgWz3iHwBEMcBtmyaLQpmyZrlLKuFcqzvKhrvb0xiAKptJacE0aUNuRzz11c7aYhpyvd1FgXcI4pyWt989b9+w+GT22vBYGom6YoG6M9JoApvf9oKDjd3BwobapKTWYZpTSJIkZxlhdBGHiEjHXz2YIycN5ZaxfLYjSZnkyXy7JpjHPeOeQbYwjGgAFjWCyXx8NZIAVnBBCQp/fW86K6cuEcwaC14YLtnetPl2WtTF41HqGmVs4jaxDGYIxTyszmmbaOEGydy4pyPFmkafIkjZI4ohTXja5rXRRl09RK6apsDo8nkZAACANEkmtjCUArlLHg/Xa6MWgDQiHjSuvpdJHlFbmyt7nSTZkMzz995YUXrtRV1k7Coqj3twd13XgHL7/+5o13r9VVtVwWW/vPtbrda9dvMCaaulHaLBbFMquSJEriCBDK84Iy1un2Xv/Slw9+9mGWFRgTwDCfZxTjbq//+//0nxw9vLvISkbwxkrrM89f2FrtEvBvfPXvI2Su3bzlnFvWNQ0EPZ0usuP5v/9P3/jGf/1v//B3Xx6NJhdeqg/e+8Ef/tpvVvnyzX/wGwypVhL8+NpHv/MHf/TuOz95/awKApHEEZfygxsffm1za2Nj4/DRoyQU3/yT//3P/sW/ufXBe6+89iXvzc9vf1zV5tKVp997+88Aiy9+7Zdf//JXTh59/PXfeR7pZSvphEny1jf/+Fd+/be39y8WTZn98XeUdWEgqPVuMl3mhSrqenNtcDKehknvlddfPH/+wnIyvPvg8HVtXrz6xn/+j//hT9+69q/+XfUv//W//e/f+C/fe+vPXnnlM+/85N033vyl55/ZP7jzaHhy8lu/99vf+l//o1H2J//3uy+/9sXFbP6bv/WPN3f3v/vtb73y+atrW/u3PrpptPnV3/g6YNLrD27c+HB7f/9Xe6vdJDr4+V0A1E+jN68+n8QCf+vHHw3n2WBrIxDcGH1ue+fq1c/my+VwPH7m05+NO4MwkFqjX/9Hv7d/cc859JUvf1FrfeOdv8jKevPcucnolFLZStuXrlx2iMZxfDYefe5LXxWcX7h0KUnb16+9m4b81vs/PT269/k3vtzU1dl0tjoYfP/P/8/f+9pXqrIAZzZ3djfX13e299747BUp2PFwDlEQNtaHAiOPIs4IoDCUZ1lJAEVSxqGIQvGz+ydJKKvGdGPZSiJMSbbMd7ZWL+6tlXnjMaqqxmNvtet10uF4Nl/kaRxFks6zUmvb66btJMCYyoARQrz3xhkAJLm8/sFdzshwmutGT/OCEhIKFgj2/wHJskro2ZK93gAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNS0wNy0xOVQxMToxMTo1NS0wNDowMAwlP10AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTQtMDYtMTJUMDM6NTY6NDgtMDQ6MDDlQhVcAAAAEXRFWHRqcGVnOmNvbG9yc3BhY2UAMix1VZ8AAAAgdEVYdGpwZWc6c2FtcGxpbmctZmFjdG9yADJ4MiwxeDEsMXgxSfqmtAAAAABJRU5ErkJggg==';
}

window.jovi = new joviC;
function attach() { 

  $( window ).load(function(){ $(setTimeout(window.jovi.init, 3000)); });
  $( window ).on("hashchange",function(){ $(setTimeout(window.jovi.init, 3000)); });
  $(".ui-tabs-anchor").on("click",function(){ $(setTimeout(window.jovi.init, 3000)); });

  if($("#menu").length)
    $(function() { window.jovi.init(); });
  else
    setTimeout(attach,1000);

}
attach();

// Register click implement for restoring buttons onload doesn't fire
GM_registerMenuCommand('Manually Load Jovi',jovi.init);



