// ==UserScript==
// @name         NsaneForum Sharecode Fixer
// @namespace    https://nsaneforums.com/
// @version      1.4.3
// @description  A sharecode fixer that hyperlinks the fixed links directly in the browser without any user interaction required. More info at https://nsaneforums.com/topic/378180-sharecode-fixer-and-generator-by-bl4ckcyb3renigm4/
// @author       Bl4ckCyb3rEnigm4 at https://nsaneforums.com/profile/117489-bl4ckcyb3renigm4/
// @license MIT
// @match        https://nsaneforums.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nsaneforums.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563705/NsaneForum%20Sharecode%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/563705/NsaneForum%20Sharecode%20Fixer.meta.js
// ==/UserScript==

//Changes:
//    - Fixed errors in specific cases

(function() {
    (async () => {
            var dereferrer="https://refhide.com/?"
            
            //Change this variable to:
            //true - if you want to open a new tab when you click on the fixed link
            //false - if you want to open the fixed link in the current tab WITHOUT opening a new tab
            //DEFAULT: true
            var Newpage=true;

            //Change this variable to:
            //true - if you use a download manager and so you prefer not having the "Fixed link: " on the left of the fixed link
            //false - if you want to keep the "Fixed link: " on the left of the fixed link
            //DEFAULT: false
            var DownMan=false;

            //Change this variable to:
            //true - if you want to have a quick way to copy the link by using a button on the side of the fixed links
            //false - if you want no button to be on the side of the links
            //DEFAULT: true
            var Easycopy=true;

            //Change this variable to:
            //true - if you want the button for copying the link to display the copy icon
            //false - if you want the button for copying the link to display "Copy"
            //DEFAULT: true
            var CopyIcon=true;

            //Change this variable to:
            //true - if you want the button for copying the link to display the "Copy" text
            //false - if you want the button for copying the link to display no text
            //DEFAULT: true
            var CopyText=true;

            //Change this variable to:
            //L - if you want the button to be on the left of the fixed link
            //R - if you want the button to be on the right of the fixed link
            //DEFAULT: "L"
            var ButtonPos="L";

            //Change this variable to:
            //true - if you want two buttons, added in the top right corner, to fix
            //       sharecoded links that aren't fixed automatically by the
            //       script(special cases)
            //       Usage: Select the sharecoded link and press the button
            //       "Open fixed link" or "Copy fixed link" in the top right corner
            //false - if you want no button to fix special cases
            //DEFAULT: true
            var ManFix=true;

            //Change this variable to:
            //The time, in milliseconds (thousandths of a second), the scripts should
            //wait between checks, to see if you changed the page on a topic
            //Lower is better()
            //0.1 sec=100 milliseconds
            //0.2 sec=200 milliseconds
            //0.5 sec=500 milliseconds
            //1 sec=1000 milliseconds
            //DEFAULT: 250
            var CheckDelay=250;

            var Settings=[Newpage, DownMan, Easycopy, ButtonPos, CopyIcon, CopyText, dereferrer];

            if (Easycopy) {
                    var Elem=document.createElement('script');
                    Elem.text="function Copytoclip(text) {text=decodeURIComponent(text);var Elem=document.createElement('textarea');Elem.value=text;document.body.appendChild(Elem);Elem.select();document.execCommand('copy');document.body.removeChild(Elem);document.getElementById('Notification').classList.toggle('fade');setTimeout(function() {document.getElementById('Notification').classList.toggle('fade');}, 3000);}";
                    document.body.appendChild(Elem);
            }

            if (ManFix) {
                    var Elem=document.createElement('script');
                    Elem.text="function ManFix(n){var LINK='';var Selvar=window.getSelection().toString();var i=1;var SelAr=Selvar.split(/\\r\\n|\\r|\\n/g, 3);function f(){window.open('"+Settings[6]+"'+LINK.replace('#', '%23').replace('?', '%3F').replace('&', '%26'));};if (SelAr[1].replace(/ /g,'')==''){i=2};if (Selvar.indexOf('http')!=-1){LINK='http'+Selvar.split('http', 2)[1].split(/\\r\\n|\\r|\\n/g, 2)[0]+SelAr[i].slice(SelAr[i].indexOf('/'), SelAr[i].length);}else{LINK='http://'+Selvar.split(' ', 2)[1].split(/\\r\\n|\\r|\\n/g, 2)[0]+SelAr[i].slice(SelAr[i].indexOf('/'), SelAr[i].length);};if(n==0){f();}else if (n==1){Copytoclip(LINK);};}";
                    document.body.appendChild(Elem);
                    document.getElementById('elUserNav').innerHTML='<li><button type="button" class="ipsButton ipsButton_important ipsButton_verySmall" onclick="ManFix(1)">Copy fixed link</button></li><li><button type="button" class="ipsButton ipsButton_important ipsButton_verySmall" onclick="ManFix(0)">Open fixed link</button></li>'+document.getElementById('elUserNav').innerHTML;
                    document.getElementsByClassName("ipsList_inline")[1].innerHTML='<li><button type="button" class="ipsButton ipsButton_important ipsButton_verySmall" onclick="ManFix(1)">Copy fixed link</button></li><li><button type="button" class="ipsButton ipsButton_important ipsButton_verySmall" onclick="ManFix(0)">Open fixed link</button></li>'+document.getElementsByClassName("ipsList_inline")[1].innerHTML;
            }
            if (Easycopy || ManFix) {
                 var Elem=document.createElement('style');
                 Elem.innerText=`#Notification {
                   opacity: 1;
                   transition: opacity 1s;
                 }

                 #Notification.fade {
                   opacity: 0;
                 }`;
                 document.head.appendChild(Elem);

                 var Elem=document.createElement('div');
                 Elem.id="Notification";
                 document.body.appendChild(Elem);
                 Notification=document.getElementById("Notification");
                 Notification.classList.toggle('fade');
                 
                 Notification.innerHTML="<div><h3>Link copied to the clipboard</h3></div>";
                 Notification.classList.add('ipsMenu');
                 Notification.classList.add('ipsMenu_auto');
                 Notification.classList.add('ipsHide');
                 Notification.classList.add('ipsMenu_bottomCenter');

                 Notification.style.margin="auto";
                 Notification.style.position="fixed";
                 Notification.style.left="10%";
                 Notification.style.right="10%";
                 Notification.style.bottom="5%";
                 Notification.style.zIndex="5500";
                 Notification.style.display="block";
                 Notification.style.textAlign="center";
                 Notification.style.verticalAlign="middle";



            }

            if (window.location.href.indexOf("https://nsaneforums.com/topic/378180-sharecode-fixer-and-generator-by-bl4ckcyb3renigm4/")!=-1){
                var Elem=document.createElement('script');
                    Elem.text="function CopyScripttoclip(text) {text=document.getElementById(text).textContent;var Elem=document.createElement('textarea');Elem.value=text;document.body.appendChild(Elem);Elem.select();document.execCommand('copy');document.body.removeChild(Elem);document.getElementById('NotificationScript').classList.toggle('fade');setTimeout(function() {document.getElementById('NotificationScript').classList.toggle('fade');}, 3000);}";
                    document.body.appendChild(Elem);
                var Elem=document.createElement('style');
                 Elem.innerText=`#NotificationScript {
                   opacity: 1;
                   transition: opacity 1s;
                 }

                 #NotificationScript.fade {
                   opacity: 0;
                 }`;
                 document.head.appendChild(Elem);

                 var Elem=document.createElement('div');
                 Elem.id="NotificationScript";
                 document.body.appendChild(Elem);
                 Notification=document.getElementById("NotificationScript");
                 Notification.classList.toggle('fade');
                 
                 Notification.innerHTML="<div><h3>Script copied to the clipboard</h3></div>";
                 Notification.classList.add('ipsMenu');
                 Notification.classList.add('ipsMenu_auto');
                 Notification.classList.add('ipsHide');
                 Notification.classList.add('ipsMenu_bottomCenter');

                 Notification.style.margin="auto";
                 Notification.style.position="fixed";
                 Notification.style.left="10%";
                 Notification.style.right="10%";
                 Notification.style.bottom="5%";
                 Notification.style.zIndex="5500";
                 Notification.style.display="block";
                 Notification.style.textAlign="center";
                 Notification.style.verticalAlign="middle";
                 let currentPage = location.href;
                    var loadingStarted=false;
                    var loadingEnded=false;
                    setInterval(function()
                        {
                                if (currentPage !=location.href){
                                try {
                                        var checkLoading=document.getElementById("elAjaxLoading").style["display"];
                                }
                                catch {
                                        var checkLoading="none";
                                }
                                //Loading started
                                if(checkLoading=="" && !loadingStarted && !loadingEnded)
                                {
                                        loadingStarted=true;
                                }

                                if(checkLoading=="none" && loadingStarted && !loadingEnded) {
                                        loadingEnded=true;
                                }
                                if(loadingStarted && loadingEnded)
                                {
                                        easycopyscript(Settings);
                                        currentPage=location.href;
                                        loadingStarted=false;
                                        loadingEnded=false;
                                }
                        }
                        }, CheckDelay);
                easycopyscript(Settings);
            }

            if (window.location.href.indexOf("https://nsaneforums.com/topic/378180-sharecode-fixer-and-generator-by-bl4ckcyb3renigm4/")==-1){
                var childold="";
            var lineold="";
            var posts=document.getElementsByClassName("cPost_contentWrap");
            checkeverypost(posts, Settings, childold, lineold)
            let currentPage = location.href;
            var loadingStarted=false;
            var loadingEnded=false;
            setInterval(function()
                {
                        if (currentPage !=location.href){
                        try {
                                var checkLoading=document.getElementById("elAjaxLoading").style["display"];
                        }
                        catch {
                                var checkLoading="none";
                        }
                        //Loading started
                        if(checkLoading=="" && !loadingStarted && !loadingEnded)
                        {
                                loadingStarted=true;
                        }

                        if(checkLoading=="none" && loadingStarted && !loadingEnded) {
                                loadingEnded=true;
                        }
                        if(loadingStarted && loadingEnded)
                        {
                                var childold="";
                                var lineold="";
                                var posts=document.getElementsByClassName("cPost_contentWrap");
                                checkeverypost(posts, Settings, childold, lineold)
                                currentPage = location.href;
                                loadingStarted=false;
                                loadingEnded=false;
                        }
                }
                }, CheckDelay);
            }
    })();
})();

async function easycopyscript(Settings) {
        var posts=document.getElementsByClassName("ipsComment");
        for(var i1=0; i1<posts.length; i1++){
               if (posts[i1].getElementsByClassName("cAuthorPane_author")[0].textContent.indexOf("Bl4ckCyb3rEnigm4")!=-1){
                spoilers=posts[i1].getElementsByClassName("cPost_contentWrap")[0].getElementsByClassName("ipsCode prettyprint");
                if (spoilers.length>0){
                        for(var i2=0; i2<spoilers.length; i2++){
                                if(spoilers[i2].innerHTML.indexOf("// ==UserScript==")!=1) {
                                      var scriptId="script"+i1.toString()+i2.toString();
                                      spoilers[i2].id=scriptId;
                                        button=document.createElement("span");
                                        button.innerHTML='<button type="button" class="ipsButton ipsButton_important ipsButton_verySmall" onclick="CopyScripttoclip('+"'"+scriptId+"'"+')">' + (Settings[4] ? '<i class="fa fa-copy"></i>' : '') + ' ' + (Settings[5] ? 'Copy the below script' : '') +' '+ (Settings[4] ? '<i class="fa fa-code"></i>' : '') +'</button>';
                                        spoilers[i2].parentNode.parentNode.insertAdjacentElement('beforebegin', button);
                                }
                        }
                }
               }
        }
}


async function divcheck(divs, Settings, childold, lineold) {
        for(var i3=divs.length-1; i3>-1; i3--){
                check(divs[i3], Settings, childold, lineold)
        }
}

async function checkeverypost(posts, Settings, childold, lineold) {
        var post="";
        var spoilers;
        for(var i1=0; i1<posts.length; i1++){
                post=posts[i1].getElementsByClassName("ipsType_normal ipsType_richText ipsPadding_bottom ipsContained")[0];
                if (post.getElementsByClassName("ipsSpoiler_contents ipsClearfix").length>0) {
                        spoilers=post.getElementsByClassName("ipsSpoiler_contents ipsClearfix");
                        for(var i2=0; i2<spoilers.length; i2++){
                                if (spoilers[i2].getElementsByClassName("ipsSpoiler_contents ipsClearfix").length>0) {
                                        check(spoilers[i2].getElementsByClassName("ipsSpoiler_contents ipsClearfix")[0], Settings, childold, lineold);
                                }
                                else {
                                        check(spoilers[i2], Settings, childold, lineold);
                                }
                        }
                }
                if (post.getElementsByTagName("div").length>0) {
                        divcheck(post.getElementsByTagName("div"), Settings, childold, lineold);
                }
                check(post, Settings, childold, lineold);
        }
}

function sanitize(string){
        return string.replace(" ", " ").replace("&nbsp;", "").replace("</span>", "").replace(" ", "").replace("<span>", "").replace("</em>", "").replace("<em>", "").replace("</b>", "").replace("<strong>", "").replace("</strong>", "");
}

async function check(postcontent, Settings, childold, lineold) {
        var children = postcontent.children;
        var child;
        var site="";
        var sharecode="";
        var sitelink="";
        var childTEXT="";
        var oldELEM=-1;
        var lines;
        var newlines="";
        var prevData="";
        var reSite = /site(.*?):/i;
        var reSharecode = /sharecode(.*?):/i;
        var firstMatch_i=-1;
        for(var i=0; i<children.length; i++){
                if (firstMatch_i!=-1 || i-firstMatch_i>2){
                        firstMatch_i=-1;
                        site=="";
                        siteDelimiter="";
                }
                child=children[i];
                childTEXT=child.textContent.replace(" ", " ");
                if (child.innerHTML.split("</p>").length>1 && child.innerHTML.split("</p>").length>child.innerHTML.split("<br>").length) {
                        lines;
                        newlines="";
                        lines=child.innerHTML.split("</p>");
                        var firstMatch=-1;
                        for(var i5=0; i5<lines.length; i5++){
                                if (firstMatch_i5!=-1 || i5-firstMatch_i5>2){
                                        firstMatch=-1;
                                        site=="";
                                        siteDelimiter="";
                                }
                                var siteDelimiter="";
                                var sharecodeDelimiter="";
                                if(siteDelimiter=="" && site=="") {
                                        try{
                                                
                                                var reg=new RegExp("site(.*?):", "i");
                                                siteDelimiter = reSite.exec(lines[i5])[0];
                                                if(siteDelimiter=="Site:" || siteDelimiter=="site:") {
                                                        siteDelimiter="";
                                                }
                                                else{
                                                        firstMatch_i5=i5;
                                                }
                                        }
                                        catch  {
                                                siteDelimiter="";
                                        }
                                }
                                if(sharecodeDelimiter=="" && sharecode=="") {
                                        try{
                                                
                                                var reg=new RegExp("sharecode(.*?):", "i");
                                                sharecodeDelimiter = reSharecode.exec(lines[i5])[0];
                                                if(sharecodeDelimiter=="Sharecode:" || sharecodeDelimiter=="sharecode:" || sharecodeDelimiter.indexOf("http") != -1) {
                                                        sharecodeDelimiter="";
                                                }
                                        }
                                        catch  {
                                                sharecodeDelimiter="";
                                        }
                                }
                                if (siteDelimiter != "" && site==""){
                                        try{
                                                firstMatch_i5=i5;
                                                site="http"+lines[i5].split(siteDelimiter)[1].split("http")[1].split('"')[0].split("<")[0].replace("&nbsp;", "");
                                                oldELEM=i4;
                                                siteDelimiter=="";
                                        }
                                        catch {
                                                siteDelimiter=="";
                                                site="";
                                        }
                                }
                                if (sharecodeDelimiter!= "" && sharecode==""){
                                        sharecode=sanitize(lines[i5].split(sharecodeDelimiter)[1]);
                                        sharecodeDelimiter="";

                                }
                                if ((lines[i5].indexOf("Site:") != -1 || lines[i5].indexOf("site:") != -1) && site!="") {
                                        site="";
                                }
                                if (lines[i5].indexOf("Site:") != -1 || lines[i5].indexOf("site:") != -1) {
                                        if (lines[i5].indexOf("Site:") != -1) {
                                                firstMatch_i5=i5;
                                              prevData=lines[i5].split("Site:")[0];
                                              lines[i5]="Site:"+lines[i5].split("Site:")[1];
                                        }else if (childTEXT.indexOf("site:") != -1) {
                                                firstMatch_i5=i5;
                                              prevData=lines[i5].split("site:")[0];
                                              lines[i5]="site:"+lines[i5].split("site:")[1];
                                        }
                                        if (lines[i5].indexOf("http") != -1) {
                                                firstMatch_i5=i5;
                                                oldELEM=i5;
                                                site="http"+lines[i5].split("http")[1].split("<")[0].split('"')[0];
                                                sharecode="";
                                        }
                                        else if (lines[i5].indexOf("www") != -1) {
                                                firstMatch_i5=i5;
                                                oldELEM=i5;
                                                site="www"+lines[i5].split("www")[1].split("<")[0].split('"')[0];
                                                sharecode="";
                                        }
                                }

                                if (lines[i5].indexOf("Sharecode") != -1) {
                                        if (lines[i5].split(">").length>1) {
                                                sharecode=lines[i5].split(">");
                                                for(var i6=sharecode.length-1; i6>-1; i6--){
                                                        if (sharecode[i6].split("/").length>1) {
                                                                sharecode=sharecode[i6];
                                                                i6=-1;
                                                        }
                                                        else if (i6==0) {
                                                                sharecode="";
                                                        }
                                                }
                                        }
                                        else {
                                                sharecode=lines[i5].split(":")
                                                if (sharecode[sharecode.length-1]=="\n") {
                                                        sharecode=sharecode[sharecode.length-2];
                                                }
                                                else {
                                                        sharecode=sharecode[sharecode.length-1];
                                                }
                                        }
                                        sharecode=sharecode.replace("&nbsp;", "").replace("</span>", "").replace(" ", "");
                                }
                                if (sharecode!="" && site!="") {
                                        sharecode=sharecode.replace("&nbsp;", "").replace("</span>", "").replace(" ", "").replace(" ", "").split("<")[0];
                                        if (sharecode.split(":").length>1) {
                                                sharecode=sharecode.split(":")[1];
                                        }
                                        site=site.replace("&nbsp;", "").replace("</span>", "").replace(" ", "").replace(" ", "");
                                        if (site.slice(-1)=="/") {
                                                site = site.slice(0, -1);
                                                firstMatch_i5=i5;
                                        }
                                        if (sharecode.slice(0, 1)!="/") {
                                                sharecode="/"+sharecode;
                                        }
                                        if (site.indexOf("http") == -1) {
                                                site="https://"+site+sharecode;
                                                firstMatch_i5=i5;
                                        }
                                        else {
                                                site=site+sharecode;
                                        }
                                        site=site.replace(/\s+/g, '');
                                        if (Settings[2] && Settings[3]=="L") {
                                                sitelink+='<button type="button" class="ipsButton ipsButton_important ipsButton_verySmall" onclick="Copytoclip('+"'"+site.replace('#', '%23').replace('?', '%3F').replace('&', '%26')+"'"+')">' + (Settings[4] ? '<i class="fa fa-copy"></i>' : '') + ' ' + (Settings[5] ? 'Copy' : '')+'</button>  ';
                                        }
                                        if (! Settings[1]) {
                                                sitelink+='<b>Fixed link<sup><a href="https://nsaneforums.com/topic/378180-sharecode-fixer-and-generator-by-bl4ckcyb3renigm4/" rel="" target="_blank"><span style="color:#003a7e;"> [!]</span></a></sup><sup><a href="https://nsaneforums.com/topic/21385-how-to-work-with-sharecodes/" rel="" target="_blank"><span style="color:#e74c3c;"> [?]</span></a></sup>: </b>';
                                        }
                                        sitelink+='<a href="'+Settings[6]+site.replace('#', '%23').replace('?', '%3F').replace('&', '%26')+'"';
                                        if (Settings[0]) {
                                                sitelink+=' target="_blank">';
                                        }else {
                                                sitelink+=">";
                                        }
                                        sitelink+=site+"</a>";
                                        if (Settings[2] && Settings[3]=="R") {
                                                sitelink+='  <button type="button" class="ipsButton ipsButton_important ipsButton_verySmall" onclick="Copytoclip('+"'"+site.replace('#', '%23').replace('?', '%3F').replace('&', '%26')+"'"+')">'+(Settings[4] ? '<i class="fa fa-copy"></i>' : '') + ' ' + (Settings[5] ? 'Copy' : '')+'</button>';
                                        }

                                        if (prevData.slice(prevData.length-3, prevData.length)=="<b>") {
                                                prevData=prevData.slice(0, prevData.length-3);
                                        }

                                        if (oldELEM!=-1 && oldELEM!=i5){
                                                lines[i5-1]=prevData+" "+sitelink;
                                                lines[i5]="";
                                        }
                                        else {
                                                lines[i5]=prevData+" "+sitelink;
                                        }
                                        oldELEM=-1;
                                        newlines="";
                                        site="";
                                        sharecode="";
                                        sitelink="";
                                        for(i6=0; i6<lines.length; i6++){
                                                if (! lines[i6]=="") {
                                                        newlines+=lines[i6]+"</p>";
                                                }
                                        }
                                        child.innerHTML=newlines;
                                }
                        }
                }
                else if (child.innerHTML.split("<br>").length>1 && !(child.innerHTML.split('onclick="Copytoclip(').length>1)) {
                        newlines="";

                        var siteDelimiter="";
                        var sharecodeDelimiter="";
                        lines=child.innerHTML.split("<br>");
                        var firstMatch_i4=-1;
                        for(var i4=0; i4<lines.length; i4++){
                                if (firstMatch_i4!=-1 || i4-firstMatch_i4>2){
                                        firstMatch_i4=-1;
                                        site=="";
                                        siteDelimiter="";
                                }
                                if ((lines[i4].indexOf("Site:") != -1 || lines[i4].indexOf("site:") != -1) && site!="") {
                                        site="";
                                }
                                if(siteDelimiter=="" && site=="") {
                                        try{
                                                
                                                var reg=new RegExp("site(.*?):", "i");
                                                siteDelimiter = reSite.exec(lines[i4])[0];
                                                if(siteDelimiter=="Site:" || siteDelimiter=="site:") {
                                                        siteDelimiter="";
                                                }else{
                                                        firstMatch_i4=i4;
                                                }
                                        }
                                        catch  {
                                                siteDelimiter="";
                                        }
                                }
                                if(sharecodeDelimiter=="" && sharecode=="") {
                                        try{
                                                
                                                var reg=new RegExp("sharecode(.*?):", "i");
                                                sharecodeDelimiter = reSharecode.exec(lines[i4])[0];
                                                if(sharecodeDelimiter=="Sharecode:" || sharecodeDelimiter=="sharecode:" || sharecodeDelimiter.indexOf("http") != -1) {
                                                        sharecodeDelimiter="";
                                                }
                                        }
                                        catch  {
                                                sharecodeDelimiter="";
                                        }
                                }
                                if (siteDelimiter != "" && site==""){
                                        try{
                                                site="http"+lines[i4].split(siteDelimiter)[1].split("http")[1].split('"')[0].split("<")[0].replace("&nbsp;", "");
                                                oldELEM=i4;
                                                siteDelimiter=="";
                                                firstMatch_i4=i4;
                                        }
                                        catch {
                                                siteDelimiter=="";
                                                site="";
                                        }
                                        
                                }
                                if (sharecodeDelimiter!= "" && sharecode==""){
                                        sharecode=sanitize(lines[i4].split(sharecodeDelimiter)[1]);
                                        sharecodeDelimiter="";
                                }

                                if (site=="" && (lines[i4].indexOf("Site:") != -1 || lines[i4].indexOf("site:") != -1)) {
                                        if (lines[i4].indexOf("Site:") != -1) {
                                                prevData=lines[i4].split("Site:")[0];
                                                lines[i4]="Site:"+lines[i4].split("Site:")[1];
                                                firstMatch_i4=i4;
                                        }else if (lines[i4].indexOf("site:") != -1) {
                                                prevData=lines[i4].split("site:")[0];
                                                lines[i4]="site:"+lines[i4].split("site:")[1];
                                                firstMatch_i4=i4;
                                        }
                                        if (lines[i4].indexOf("http") != -1) {
                                                oldELEM=i4;
                                                site="http"+lines[i4].split("http")[1].split("<")[0].split('"')[0];
                                                sharecode="";
                                                firstMatch_i4=i4;
                                        }
                                        else if (lines[i4].indexOf("www") != -1) {
                                                oldELEM=i4;
                                                site="www"+lines[i4].split("www")[1].split("<")[0].split('"')[0];
                                                sharecode="";
                                                firstMatch_i4=i4;
                                        }
                                }
                                if (sharecode=="" && lines[i4].indexOf("Sharecode") != -1) {
                                        if (lines[i4].split(">").length>1) {
                                                sharecode=lines[i4].split(">");
                                                for(i6=sharecode.length-1; i6>-1; i6--){
                                                        if (sharecode[i6].split("/").length>1) {
                                                                sharecode=sharecode[i6];
                                                                i6=-1;
                                                        }
                                                        else if (i6==0) {
                                                                sharecode="";
                                                        }
                                                }
                                        }
                                        else {
                                                sharecode=lines[i4].split(":")
                                                sharecode=sharecode[sharecode.length-1];
                                        }
                                }
                                if (sharecode!="" && site!="") {
                                        sharecode=sharecode.replace("&nbsp;", "").replace("</span>", "").replace(" ", "").replace(" ", "").split("<")[0];
                                        if (sharecode.split(":").length>1) {
                                                sharecode=sharecode.split(":")[1];
                                        }
                                        site=site.replace("&nbsp;", "").replace("</span>", "").replace(" ", "").replace(" ", "");
                                        if (site.slice(-1)=="/") {
                                                site = site.slice(0, -1);
                                                firstMatch_i4=i4;
                                        }
                                        if (sharecode.slice(0, 1)!="/") {
                                                sharecode="/"+sharecode;
                                        }
                                        if (site.indexOf("http") == -1) {
                                                site="https://"+site+sharecode;
                                                firstMatch_i4=i4;
                                        }
                                        else {
                                                site=site+sharecode;
                                        }
                                        site=site.replace(/\s+/g, '');
                                        if (Settings[2] && Settings[3]=="L") {
                                                sitelink+='<button type="button" class="ipsButton ipsButton_important ipsButton_verySmall" onclick="Copytoclip('+"'"+site.replace('#', '%23').replace('?', '%3F').replace('&', '%26')+"'"+')">'+(Settings[4] ? '<i class="fa fa-copy"></i>' : '') + ' ' + (Settings[5] ? 'Copy' : '')+'</button>  ';
                                        }
                                        if (! Settings[1]) {
                                                sitelink+='<b>Fixed link<sup><a href="https://nsaneforums.com/topic/378180-sharecode-fixer-and-generator-by-bl4ckcyb3renigm4/" rel="" target="_blank"><span style="color:#003a7e;"> [!]</span></a></sup><sup><a href="https://nsaneforums.com/topic/21385-how-to-work-with-sharecodes/" rel="" target="_blank"><span style="color:#e74c3c;"> [?]</span></a></sup>: </b>';
                                        }
                                        sitelink+='<a href="'+Settings[6]+site.replace('#', '%23').replace('?', '%3F').replace('&', '%26')+'"';
                                        if (Settings[0]) {
                                                sitelink+=' target="_blank">';
                                        }else {
                                                sitelink+=">";
                                        }
                                        sitelink+=site+"</a>";
                                        if (Settings[2] && Settings[3]=="R") {
                                                sitelink+='  <button type="button" class="ipsButton ipsButton_important ipsButton_verySmall" onclick="Copytoclip('+"'"+site.replace('#', '%23').replace('?', '%3F').replace('&', '%26')+"'"+')">'+(Settings[4] ? '<i class="fa fa-copy"></i>' : '') + ' ' + (Settings[5] ? 'Copy' : '')+'</button>';
                                        }

                                        if (prevData.slice(prevData.length-3, prevData.length)=="<b>") {
                                                prevData=prevData.slice(0, prevData.length-3);
                                        }

                                        if (oldELEM!=-1 && oldELEM!=i4){
                                                lines[i4-1]=prevData+" "+sitelink;
                                                lines[i4]="";
                                        }
                                        else {
                                                lines[i4]=prevData+" "+sitelink;
                                        }
                                        oldELEM=-1;
                                        newlines="";
                                        site="";
                                        sharecode="";
                                        sitelink="";

                                        siteDelimiter="";
                                        sharecodeDelimiter="";
                                }
                        }
                        for(i4=0; i4<lines.length; i4++){
                                                if (! lines[i4]=="") {
                                                        newlines+=lines[i4]+"<br>";
                                                }
                                        }
                                        child.innerHTML=newlines;
                }
                else if (childTEXT.indexOf("Site:") != -1 || childTEXT.indexOf("site:") != -1) {
                        if (childTEXT.indexOf("Site:") != -1) {
                                prevData=childTEXT.split("Site:")[0];
                                childTEXT="Site:"+childTEXT.split("Site:")[1];
                                firstMatch_i=i;
                        }else if (childTEXT.indexOf("site:") != -1) {
                                prevData=childTEXT.split("site:")[0];
                                childTEXT="site:"+childTEXT.split("site:")[1];
                                firstMatch_i=i;
                        }

                        if (childTEXT.indexOf("http") != -1) {
                                childold=child;
                                site=childTEXT.split("http")[1].split("\n")[0];
                                if (site.split("<").length>1) {
                                        site=site.split("<");
                                        site=site[site.length-2];
                                }
                                site="http"+site;
                                sharecode="";
                                firstMatch_i=i;
                        }
                        else if (childTEXT.indexOf("www") != -1) {
                                childold=child;
                                site=childTEXT.split("www")[1].split("\n")[0];
                                if (site.split("<").length>1) {
                                        site=site.split("<");
                                        site=site[site.length-2];
                                }
                                site="www"+site;
                                sharecode="";
                                firstMatch_i=i;
                        }

                        if (site.indexOf("Sharecode [?") != -1) {
                                site=site.split("Sharecode [?")[0];
                        }else if (site.indexOf("Sharecode:") != -1) {
                                site=site.split("Sharecode:")[0];
                        }else if (site.indexOf("sharecode:") != -1) {
                                site=site.split("sharecode:")[0];
                        }else if (site.indexOf("sharecode [?") != -1) {
                                site=site.split("sharecode [?")[0];
                        }else if (site.indexOf("Sharecode") != -1) {
                                site=site.split("Sharecode")[0];
                        }else if (site.indexOf("sharecode") != -1) {
                                site=site.split("sharecode")[0];
                        }
                }

                if (childTEXT.indexOf("Sharecode [?") != -1) {
                        sharecode=childTEXT.split("Sharecode [?")[1].split(":")[1].split("\n")[0];
                }else if (childTEXT.indexOf("Sharecode:") != -1) {
                        sharecode=childTEXT.split("Sharecode:")[1].split("\n")[0];
                }else if (childTEXT.indexOf("sharecode:") != -1) {
                        sharecode=childTEXT.split("sharecode:")[1].split("\n")[0];
                }else if (childTEXT.indexOf("sharecode [?") != -1) {
                        sharecode=childTEXT.split("sharecode [?")[1].split(":")[1].split("\n")[0];
                }else if (childTEXT.indexOf("Sharecode") != -1) {
                        sharecode=childTEXT.split("Sharecode")[1].split("\n")[0].split(" ")[1];
                }else if (childTEXT.indexOf("sharecode") != -1) {
                        sharecode=childTEXT.split("sharecode")[1].split("\n")[0].split(" ")[1];
                }
                if (sharecode!="" && site!="") {
                        sharecode=sharecode.replace("&nbsp;", "").replace("</span>", "").replace(" ", "").replace(" ", "").replace("//", "").split("<")[0];
                        if (sharecode.split(":").length>1) {
                                sharecode=sharecode.split(":")[1];
                        }
                        site=site.replace("&nbsp;", "").replace("</span>", "").replace(" ", "").replace(" ", "");
                        if (site.slice(-1)=="/") {
                                site = site.slice(0, -1);
                                firstMatch_i=i;
                        }
                        if (sharecode.slice(0, 1)!="/") {
                                sharecode="/"+sharecode;
                        }
                        if (childold!="") {childold.innerHTML="";}
                        if (site.indexOf("http") == -1) {
                                site="https://"+site+sharecode;
                                firstMatch_i=i;
                        }
                        else {
                                site=site+sharecode;
                        }
                        site=site.replace(/\s+/g, '');
                        if (Settings[2] && Settings[3]=="L") {
                                sitelink+='<button type="button" class="ipsButton ipsButton_important ipsButton_verySmall" onclick="Copytoclip('+"'"+site.replace('#', '%23').replace('?', '%3F').replace('&', '%26')+"'"+')">'+(Settings[4] ? '<i class="fa fa-copy"></i>' : '') + ' ' + (Settings[5] ? 'Copy' : '')+'</button>  ';
                        }
                        if (! Settings[1]) {
                                sitelink+='<b>Fixed link<sup><a href="https://nsaneforums.com/topic/378180-sharecode-fixer-and-generator-by-bl4ckcyb3renigm4/" rel="" target="_blank"><span style="color:#003a7e;"> [!]</span></a></sup><sup><a href="https://nsaneforums.com/topic/21385-how-to-work-with-sharecodes/" rel="" target="_blank"><span style="color:#e74c3c;"> [?]</span></a></sup>: </b>';
                        }
                        sitelink+='<a href="'+Settings[6]+site.replace('#', '%23').replace('?', '%3F').replace('&', '%26')+'"';
                        if (Settings[0]) {
                                sitelink+=' target="_blank">';
                        }else {
                                sitelink+=">";
                        }
                        sitelink+=site+"</a>";
                        if (Settings[2] && Settings[3]=="R") {
                                sitelink+='  <button type="button" class="ipsButton ipsButton_important ipsButton_verySmall" onclick="Copytoclip('+"'"+site.replace('#', '%23').replace('?', '%3F').replace('&', '%26')+"'"+')">'+(Settings[4] ? '<i class="fa fa-copy"></i>' : '') + ' ' + (Settings[5] ? 'Copy' : '')+'</button>';
                        }

                        if (prevData.slice(prevData.length-3, prevData.length)=="<b>") {
                                prevData=prevData.slice(0, prevData.length-3);
                        }

                        child.innerHTML=prevData+" "+sitelink;
                        site="";
                        sharecode="";
                        childold="";
                        sitelink="";
                }
        }
}