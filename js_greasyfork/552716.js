// ==UserScript==
// @name GPX+: Party proxy buttons
// @include *gpx.plus/main*
// @include *gpx.plus/
// @include *gpx.plus/#
// @version      1.0.1
// @license      MIT
// @grant        none
// @namespace Squornshellous Beta
// @description Add proxy buttons to party
// @downloadURL https://update.greasyfork.org/scripts/552716/GPX%2B%3A%20Party%20proxy%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/552716/GPX%2B%3A%20Party%20proxy%20buttons.meta.js
// ==/UserScript==

if (window.top == window.self) {
    var textBox=getComputedStyle(document.querySelector("#content h1 aside"));
    var bg=textBox.backgroundColor;
    var border=textBox.borderTopColor;
    var color=textBox.color;
    var header=getComputedStyle(document.querySelector("#headerLogo a"));
    var btn=header.color;
    document.head.insertAdjacentHTML("beforeend",`<style>
    #adLeaderboard1 {
        display:flex;
        justify-content:space-between;
        gap:20px;
    }
    .userscriptButton {
        background:`+color+`;
        cursor:pointer;
        border-radius:12px;
        color:`+btn+`;
        font-weight:bold;
        font-size:500%;
        margin-bottom:5px;
        padding:10px 0;
        text-align:center;
        flex-grow:1;
        opacity:0.5;
        width:20%;

        &.selected {
            opacity:1;
        }
    }
    .PartyPoke.selected {
        background:`+color+`;
        color:`+border+`;
    }
    .PartyPoke>.pokeSelectButton {
        height:100%;
        width:100%;
        position:absolute;
        top:0;
        left:0;
        z-index:1;
    }
    .PartyPoke>:not(section), .PartyPoke>section>a {
        z-index:2;
        position:relative;
    }
    .PartyPoke>:is(.ui-icon-unlocked, .ui-icon-locked) {
        z-index:3;
    }
    .pokeFrame {
        border:none;
        width:700px;
        height:210px;
    }
    .PartyPoke {
        overflow-x:visible !important;
        margin-bottom:5em;

        & .proxyButtons {
            position:absolute;
            bottom:0;
            left:0;
            transform:translate(50%,calc(100% + 10px));

            & a:nth-child(5) {
                margin-left:15px !important;
            }
        }
    }
    </style>`);
    var buttonHead=document.querySelector("#adLeaderboard1");
    buttonHead.innerHTML="<a onClick=\"selectButton('-1'); recalcFrame();\" id='selectorButton-1' class=\"userscriptButton selectorButton\" value=\"-1\">All</a>";
    for (var i=0;i<4;i++) buttonHead.innerHTML+="<a onClick=\"selectButton("+i+"); recalcFrame();\" id='selectorButton"+i+"' class=\"userscriptButton selectorButton\" value=\""+i+"\">"+i+"</a>";

    window.addButtons = function() {
        if (!document.querySelector(".pokeSelectButton")) {
            var party=document.querySelectorAll(".PartyPoke");
            for (var i=0;i<6;i++) {
                var newDiv=document.createElement("div");
                newDiv.id="pokeSelectButton"+i;
                newDiv.className="pokeSelectButton";
                newDiv.setAttribute("onClick","selectPokemon("+i+"); recalcFrame();");
                party[i].append(newDiv);

                var pid=party[i].id.replace("PartyPoke_","");
                var div2=document.createElement("div");
                div2.className="buttonGroup proxyButtons";
                div2.innerHTML=`<a href="https://proxyium.com/#p&`+pid+`&0" target="_blank" style="margin:2.5px; border-radius:12px;"><div>1</div></a>
                    <a href="https://proxyium.com/#p&`+pid+`&1" target="_blank" style="margin:2.5px; border-radius:12px;"><div>2</div></a>
                    <a href="https://proxyium.com/#p&`+pid+`&2" target="_blank" style="margin:2.5px; border-radius:12px;"><div>3</div></a><br />
                    <a href="https://proxypal.net/#p&`+pid+`" target="_blank" style="margin:2.5px; border-radius:12px;"><div>4</div></a>
                    <a href="https://www.croxyproxy.com/#p&`+pid+`" target="_blank" style="margin:2.5px; border-radius:12px;"><div>5</div>`;
                party[i].append(div2);
            }
        }
    }
    setInterval(addButtons,500);

    window.selectButton = function(i) {
        document.querySelectorAll(".selectorButton.selected").forEach(button=>{button.classList.remove("selected")});
        document.querySelector("#selectorButton"+i).classList.add("selected");
    }
    window.selectPokemon = function(i) {
        document.querySelectorAll(".PartyPoke.selected").forEach(button=>{button.classList.remove("selected")});
        document.querySelectorAll(".PartyPoke")[i].classList.add("selected");
    }
    window.recalcFrame = function() {
        var sel=document.querySelector(".selectorButton.selected");
        var mon=document.querySelector(".PartyPoke.selected");
        var pid=mon.querySelector("section a").href.replace("https://gpx.plus/info/","");
        if (sel&&mon) {
            var val=document.querySelector(".selectorButton.selected").getAttribute("value");
            var proxies=[`https://proxyium.com/#p&`+pid+`&0`,`https://proxyium.com/#p&`+pid+`&1`,`https://proxyium.com/#p&`+pid+`&2`,`https://www.croxyproxy.com/#p&`+pid];
            if (val!="-1") proxies=[proxies[val]];
            var output="";
            proxies.forEach(proxy=>{output+="<iframe class='pokeFrame' src='"+proxy+"'></iframe>"});
            document.querySelector("#journalDiv").innerHTML=output;
        }
    }

    //syncContainer.innerHTML+="<a onClick=\"document.querySelectorAll('.syncCustomButton').forEach(button=>{button.classList.toggle('hide')});\" id='syncToggleButton' class=\"userscriptButton\">Sync custom</a><a onClick=\"loadCustom();\" id='syncLoadButton' class=\"syncCustomButton userscriptButton hide\">Load</a><a onClick=\"saveCustom();\" id='syncSaveButton' class=\"syncCustomButton userscriptButton hide\">Save</a>";
}