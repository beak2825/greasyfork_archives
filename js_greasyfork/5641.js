// MAL Voice Actor Filter!
// version 1.2
// 2010-06-14
// Copyright (c) 2009, Bastvera <bastvera@gmail.com>
// Released under the GPL license
// http://www.gnu.org/copyleft/gpl.html
//
// --------------------------------------------------------------------
//
// This is a Greasemonkey user script.
//
// To install, you need Greasemonkey: http://greasemonkey.mozdev.org/
// Then restart Firefox and revisit this script.
// Under Tools, there will be a new menu item to "Install User Script".
// Accept the default configuration and install.
//
// To uninstall, go to Tools/Manage User Scripts,
// select "MAL Voice Actor Filter", and click Uninstall.
//
// --------------------------------------------------------------------
//
// ==UserScript==
// @name           MAL Voice Actor Filter
// @namespace      http://thayanger.neostrada.pl
// @include        http://myanimelist.net/people/*
// @include        http://myanimelist.net/people.php?id=*
// @include        https://myanimelist.net/people/*
// @include        https://myanimelist.net/people.php?id=*
// @description    This script filters voice actor: "Voice Acting Roles" and anime staff: "Anime Staff Positions" by your anime list entries
// @author         Bastvera <bastvera@gmail.com>
// @version        1.2.17
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/5641/MAL%20Voice%20Actor%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/5641/MAL%20Voice%20Actor%20Filter.meta.js
// ==/UserScript==

setTimeout(function(){
    //All edit buttons in "Voice Acting Roles"
    var allEdits = document.evaluate(
        "//td[@style='padding-left: 5px;']//table[1]//a[@class='Lightbox_AddEdit button_edit']",
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null);
    //All edit buttons in "Anime Staff Positions"
    var allEditsStaff = document.evaluate(
        "//td[@style='padding-left: 5px;']//table[2]//a[@class='Lightbox_AddEdit button_edit']",
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null);

    //Correct Table check
    var antyStaff = allEdits.snapshotItem(0);
    if (antyStaff == null) {
        antyStaff = allEditsStaff.snapshotItem(0);
        var staffIndex = 2;
    } else {
        var staffIndex = 1;
    }
    antyStaff = antyStaff.parentNode.parentNode.parentNode.parentNode.parentNode.previousSibling;
    var convert=antyStaff.innerHTML;
    var finder = convert.search("Voice Acting Roles");
    var finderStaff = convert.search("Anime Staff Positions");

    if(finder!=-1 || finderStaff!=-1){
        var normalHeader = document.evaluate(
            "//div[@class='normal_header']",
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null);
        //Elements placing
        var checkboxAnchor = normalHeader.snapshotItem(0);

        var newElement = document.createElement('BR');
        checkboxAnchor.appendChild(newElement);

        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.defaultChecked = false;
        checkboxAnchor.appendChild(checkbox);

        newElement = document.createElement('label');
        newElement.setAttribute('for','firstName');
        newElement.appendChild(document.createTextNode('Filter entries by your Anime List.'));
        checkboxAnchor.appendChild(newElement);
        newElement.style.fontWeight="normal";
        newElement.style.fontSize="10px";

        var newElement2 = document.createElement('label');
        newElement2.appendChild(document.createTextNode(' (Downloading Plan to Watch entries...)'));
        //checkboxAnchor.appendChild(newElement2);
        newElement2.style.fontWeight="normal";
        newElement2.style.fontSize="10px";

        if (finder!=-1){
            //Arrays for storing elements
            var editdiv = [];	//Edit button Div
            var moe = [];		//Char Name
            var role = [];		//Main/Support Div

            //Edit Entries Segments
            for (var i = 0; i < allEdits.snapshotLength; i++){
                var AnchorLink = allEdits.snapshotItem(i);
                editdiv[i] = AnchorLink.parentNode;									//Edit button Div
                role[i] = editdiv[i].parentNode.nextSibling.nextSibling.lastChild;	//Main/Support Div
                moe[i] = editdiv[i].parentNode.nextSibling.nextSibling.firstChild.firstChild;	//Char Name
            }
        } else {
            if (allEdits.snapshotItem(0) != null) {
                allEditsStaff = allEdits;
            }
        }

        //Arrays for storing elements
        var editdivStaff = [];	//Edit button Div
        var moe2 = [];		//Anime Name

        //Edit Entries Segments
        for (var i = 0; i < allEditsStaff.snapshotLength; i++){
            var AnchorLink = allEditsStaff.snapshotItem(i);
            editdivStaff[i] = AnchorLink;									//Edit button Div
            moe2[i] = editdivStaff[i].parentNode.parentNode.firstChild;	//Anime Name
        }

        //All add buttons in "Voice Acting Roles"
        var	allElements = document.evaluate(
            "//td[@style='padding-left: 5px;']//a[@class='Lightbox_AddEdit button_add']", //"//td[@style='padding-left: 5px;']//table[1]//a[@class='Lightbox_AddEdit button_add']",
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null);

        //Array with add buttons div
        var addbutton = [];
        for (i = 0; i < allElements.snapshotLength; i++){
            AnchorLink = allElements.snapshotItem(i);
            addbutton[i] = AnchorLink.parentNode.parentNode.parentNode;		//Main Div with Add button
        }

        //Div backup
        var backup = [];
        var orginal = [];
        var backpos = 0;

        //Get or Set status of checkbox
        var checkboxmem = (localStorage.getItem('checkboxmem_voice') === "true"); //Get chceckbox status
        if(checkboxmem==null){
            checkboxmem=false;
            localStorage.setItem('checkboxmem_voice', checkboxmem);
            checkbox.checked=checkboxmem;
        }
        else{
            checkbox.checked=checkboxmem;
            if(checkbox.checked==true){
                HideDivs();
            }
        }

        //Collect Plan to Watch divs
        var editPlan = [];
        //CollectPlan();

        //Listener
        checkbox.addEventListener('change',function () {

            if(checkbox.checked==true){
                HideDivs();
            }

            if(checkbox.checked==false){
                RestoreDivs();
            }

            localStorage.setItem('checkboxmem_voice', checkbox.checked);

        },false)
    }

    function CollectPlan(){
        //Get username
        var allNavs = document.evaluate(
            "//div[@id='menu_left']//ul[@id='nav']//a",
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null);

        var userName;
        for (var i = 0; i < allNavs.snapshotLength; i++){
            var linkNav = allNavs.snapshotItem(i);
            var userTest=/\/profile\/.*/;
            var getName = userTest.exec(linkNav);
            getName = "" + getName;
            getName = getName.replace(/\/profile\//,"");
            if(getName!='null')
                userName=getName;
        }

        var rssURL = "http://myanimelist.net/rss.php?type=rw&u=" + userName;

        //RSS change check
        GM_xmlhttpRequest({
            method: 'GET',
            url: rssURL,
            headers: {
                'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
                'Accept': 'application/atom+xml,application/xml,text/xml',
            },
            onload: function(responseDetails){

                //Cache test
                var cacheCheck = 0;

                var lastTime = /<pubDate>.*<\/pubDate>/;
                var modTime = lastTime.exec(responseDetails.responseText);
                var saveTime = localStorage.getItem('saveTime');
                modTime = "" + modTime;
                if(modTime!=saveTime){					//Cache time check
                    localStorage.setItem('saveTime', modTime);
                }
                else
                    cacheCheck++;

                if(cacheCheck==0){
                    //User list
					var animeURL = "http://myanimelist.net/malappinfo.php?u=" + userName + "&status=all";
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: animeURL,
                        headers: {
                            'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
                            'Accept': 'application/atom+xml,application/xml,text/xml',
                        },
                        onload: function(responseDetails){
                            var text = responseDetails.responseText;

                            var key = ";";									//Chaching string

                            //Edit Anime links formating
                            var tagcount = 5000;													//Max number of anime entries
                            var plancount = 0;														//Counter "Plan to Watch" entries
                            var ListLinks = [];														//Array for anime entries storing
                            var anireg=/<series_animedb_id>\d{1,}<\/series_animedb_id>/g;		//Anime entries links
                            var anistatus=/<my_status>\d{1}<\/my_status>/g;		//Anime entries status
                            var exactlink=/\d{1,}/;													//Anime exact link

                            for (var i = 0; i < tagcount; i++){
                                var linkGet = anireg.exec(text);
								if(linkGet==null){
                                    tagcount=i;
                                    break;
                                }
								else {
									var planDetect = anistatus.exec(text);
									if(planDetect=="<my_status>6</my_status>"){
										ListLinks[plancount] = linkGet;
										ListLinks[plancount] = exactlink.exec(ListLinks[plancount]);
										key = key + ListLinks[plancount] + ";";
										ListLinks[plancount] = "http://myanimelist.net/anime/" + ListLinks[plancount] + "/";
										plancount++;
                                    }
								}
							}
                            localStorage.setItem('list', key); //Store Cache string
                            CollectDivs(ListLinks);
                            if(checkbox.checked==true){
                                RestoreDivs();
                                HideDivs();
                            }
                            newElement2.style.display="none";
                        }
                    });
                }

                else{
                    var ListLinks = [];								//Anime Links Array
                    var key = localStorage.getItem('list');					//Fetch link from Cache
                    var exactlink=/\d{1,}/g;
                    var tagcount = 5000;
                    for (var i = 0; i < tagcount; i++){
                        var linkGet = exactlink.exec(key);
                        if(linkGet==null){
                            tagcount=i;
                            break;
                        }
                        else{
                            ListLinks[i]=linkGet;
                            ListLinks[i] = "http://myanimelist.net/anime/" + ListLinks[i] + "/";
                        }
                    }
                    CollectDivs(ListLinks);
                    if(checkbox.checked==true){
                        RestoreDivs();
                        HideDivs();
                    }
                    newElement2.style.display="none";
                }
            }
        });

        function CollectDivs(ListLinks){
            var editSibling = [];		//Anime Link href for comparing

            if(finder!=-1){
                for (var i = 0; i < allEdits.snapshotLength; i++){
                    editSibling[i] = editdiv[i].parentNode.firstChild;	//Anime Name;

                    StorePlan(i);
                }
            }

            for (var i = 0; i < allEditsStaff.snapshotLength; i++){
                editSibling[i] = moe2[i];	//Anime Name;

                StorePlan(i);
            }

            function StorePlan(i){
                //Store "Plan to Watch" Divs
                var convert = editSibling[i].href;
                var exactlink=/\d{1,}/;
                convert = "http://myanimelist.net/anime/" + exactlink.exec(convert) + "/";	//Anime Link;


                for (var tcount in ListLinks){
                    var finderPlan = convert.search(ListLinks[tcount]);
                    if(finderPlan!=-1){
                        editPlan.push(editSibling[i]);
                        break;
                    }
                }
            }
        }
    }

    function HideDivs(){
        //Hide all div with add
        for (var current in addbutton){
            addbutton[current].style.display="none";
        }

        //Hide edit Div
        var current;
        for (current in editdivStaff){
            editdivStaff[current].style.display="none";
        }

        for(current in moe){

            var curpos = current;
            curpos++;

            if(editdiv[current].parentNode.parentNode.getAttribute('style')!="display: none;"){ //Modify root entries only

                //Div backup storage
                backup[backpos] = editdiv[current].parentNode.parentNode.cloneNode(true);
                orginal[backpos] = editdiv[current].parentNode.parentNode;
                backpos++;

                //Root /Main/Support text add
                var temp = role[current].innerHTML;										//Main/Support text
                temp = temp.replace(/&nbsp;/,"");										//Main/Support clear
                var line = document.createTextNode('\n'+ temp);
                editdiv[current].parentNode.appendChild(line);

                //Root hide elements
                role[current].style.display="none";										//Hide Main/Support Div
                editdiv[current].style.display="none";									//Hide edit and airing Div

                var currentPlanned = false;
                for (var i in editPlan){
                    if(editPlan[i] == editdiv[current].parentNode.firstChild.href){
                        currentPlanned = true;
                        editdiv[current].parentNode.parentNode.style.display="none";
                    }
                }

                if (!currentPlanned) {
                    for( curpos ; curpos < allEdits.snapshotLength; curpos++){
                        if(moe[curpos].href==moe[current].href){ //Compare entries by moe name ^_^
                            var planned = false;
                            for (var i in editPlan) {
                                if(editPlan[i] == editdiv[curpos].parentNode.firstChild.href) {
                                    planned = true;
                                }
                            }
                            if (!planned) {
                                var br = document.createElement('br');

                                //Add Similar anime name
                                editdiv[current].parentNode.appendChild(br);
                                var newNode=editdiv[curpos].parentNode.firstChild.cloneNode(true);
                                editdiv[current].parentNode.appendChild(newNode);

                                //Similar /Main/Support text add
                                temp = role[curpos].innerHTML;
                                temp = temp.replace(/&nbsp;/,"");
                                line = document.createTextNode('\n'+temp);
                                editdiv[current].parentNode.appendChild(line);

                                //Hide Similar Div
                                editdiv[curpos].parentNode.parentNode.style.display="none";
                            }
                        }
                    }
                }
            }
        }

        for(current in moe2){

            var curpos = current;
            curpos++;

            if(editdivStaff[current].parentNode.parentNode.parentNode.getAttribute('style')!="display: none;"){ //Modify root entries only

                //Div backup storage
                backup[backpos] = editdivStaff[current].parentNode.parentNode.parentNode.cloneNode(true);
                orginal[backpos] = editdivStaff[current].parentNode.parentNode.parentNode;
                backpos++;

                for( curpos ; curpos < allEditsStaff.snapshotLength; curpos++){
                    if(moe2[curpos].href==moe2[current].href){ //Compare entries by anime name ^_^

                        //Add Similar anime name
                        var newNode=editdivStaff[curpos].parentNode.cloneNode(true);
                        editdivStaff[current].parentNode.parentNode.appendChild(newNode);

                        //Hide Similar Div
                        editdivStaff[curpos].parentNode.parentNode.parentNode.style.display="none";
                    }
                }

                for (var i in editPlan){
                    if(editPlan[i] == moe2[current].href){
                        editdivStaff[current].parentNode.parentNode.parentNode.style.display="none";
                    }
                }
            }
        }
    }

    function RestoreDivs(){

        //Restore Modified Divs
        for(var current in  backup){
            orginal[current].parentNode.replaceChild(backup[current],orginal[current]);
        }

        //Unhide Similar Voice Actor
        for(current in  editdiv){
            editdiv[current].parentNode.parentNode.removeAttribute('style');
        }

        //Unhide Similar Staff
        for(current in  editdivStaff){
            editdivStaff[current].parentNode.parentNode.parentNode.removeAttribute('style');
        }

        //Unhide add entries
        for(current in addbutton){
            addbutton[current].removeAttribute('style');
        }

        if (finder!=-1){
            //Rescan all edit entries
            allEdits = document.evaluate(
                "//td[@style='padding-left: 5px;']//table[1]//a[@class='Lightbox_AddEdit button_edit']",
                document,
                null,
                XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
                null);

            for (var i = 0; i < allEdits.snapshotLength; i++){
                AnchorLink = allEdits.snapshotItem(i);
                editdiv[i] = AnchorLink.parentNode;									//Edit button Div
                role[i] = editdiv[i].parentNode.nextSibling.nextSibling.lastChild;	//Main/Support Div
                moe[i] = editdiv[i].parentNode.nextSibling.nextSibling.firstChild.firstChild;	//Char Name
            }

            //Rescan all edit entries
            allEditsStaff = document.evaluate(
                "//td[@style='padding-left: 5px;']//table[2]//a[@class='Lightbox_AddEdit button_edit']",
                document,
                null,
                XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
                null);
        }

        if (finderStaff!=-1) {
            //Rescan all edit entries
            allEditsStaff = document.evaluate(
                "//td[@style='padding-left: 5px;']//table["+staffIndex+"]//a[@class='Lightbox_AddEdit button_edit']",
                document,
                null,
                XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
                null);
        }

        for (var i = 0; i < allEditsStaff.snapshotLength; i++){
            AnchorLink = allEditsStaff.snapshotItem(i);
            editdivStaff[i] = AnchorLink;									//Edit button Div
        }

        //Unhide edit entries
        for(current in editdivStaff){
            editdivStaff[current].removeAttribute('style');
        }

        //Reset backups
        backup = [];
        orginal = [];
        backpos = 0;
    }
}, 100);