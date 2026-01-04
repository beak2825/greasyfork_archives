// ==UserScript==
// @name         GPX+: Proxy buttons
// @match        *gpx.plus/info/*
// @match        *www.croxyproxy.com*
// @match        *proxypal.net*
// @match        *proxyium.com*
// @match        *hide.me/*
// @match        *.hideproxy.me/*
// @version      1.0.1
// @license      MIT
// @grant        none
// @namespace Squornshellous Beta
// @description Add proxy buttons
// @downloadURL https://update.greasyfork.org/scripts/552718/GPX%2B%3A%20Proxy%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/552718/GPX%2B%3A%20Proxy%20buttons.meta.js
// ==/UserScript==

if (window.location.href.search("gpx.plus")!=-1) {
    if (window.location.href.search("/feeder")==-1) {
        function addButtons() {
            var proxyButtons=document.querySelector("#addedProxyButtons");
            if (!proxyButtons) {
                var buttons=document.createElement("div");
                buttons.id="addedProxyButtons";
                document.querySelector("#content").append(buttons);
                var pid=window.location.href.replace("https://gpx.plus/info/","").replace(/\/.*/,"");
                buttons.innerHTML+=`<h3 style="margin-bottom:0;">Proxies</h3><div class="buttonGroup">
                    <a href="https://proxypal.net/#p&`+pid+`" target="_blank" style="margin:2.5px; border-radius:12px;"><div>1</div></a>
                    <a href="https://proxyium.com/#p&`+pid+`&0" target="_blank" style="margin:2.5px; border-radius:12px;"><div>2</div></a>
                    <a href="https://proxyium.com/#p&`+pid+`&1" target="_blank" style="margin:2.5px; border-radius:12px;"><div>3</div></a><br />
                    <a href="https://proxyium.com/#p&`+pid+`&2" target="_blank" style="margin:2.5px; border-radius:12px;"><div>4</div></a>
                    <a href="https://proxyium.com/#p&`+pid+`&3" target="_blank" style="margin:2.5px; border-radius:12px;"><div>5</div></a>
                    <a href="https://www.croxyproxy.com/#p&`+pid+`" target="_blank" style="margin:2.5px; border-radius:12px;"><div>6</div></a>
                </div>`;
                var buttonGroup=buttons.querySelector(".buttonGroup");
                buttons.style="position:absolute; top:110px; right:185px; width:126px; text-align:center; max-height:calc(100% - 110px);";
            }
        }
        var proxyLoop=setInterval(addButtons,250);
    }
}
else {
    if (window.location.href.search("hideproxy")!=-1) window.addEventListener("message", (event) => {
        var image=document.querySelector("img[src*='hideproxy']");
        if (image) {
            //console.log(event.data.id);
            //image.classList.remove("shrinkToFit");
            //window.parent.postMessage({id:event.data.id,size:image.getBoundingClientRect()},"*");
            window.parent.postMessage({id:event.data.id,src:image.src},"*");
        }
    });

    var sites={
        "www.croxyproxy.com":{
            input:'input[name="url"]',
            button:'button#requestSubmit'
        },
        "proxypal.net":{
            input:'input[name="url"]',
            button:'button.check-button'
        },
        "proxyium.com":{
            input:'input[name="url"]',
            button:'button[value="Send"]',
            list:'ul.list',
            listItems:'.option'
        },
        "hide.me":{
            input:'input[name="u"]',
            button:'button[id="hide_register_save"]'
        }
    };
    var params=location.hash.split("&");
    if (params[0]) {
        var site=sites[window.location.hostname];
        if (params[0].search("#p")==0) {
            if (params[0]=="#party") document.querySelector(site.input).value="https://gpx.plus/user/Squornshellous+Beta";
            else document.querySelector(site.input).value="https://gpx.plus/info/"+params[1];

            if (site.list) {
                var list=document.querySelector(site.list);
                list.querySelector(".selected").classList.remove("selected");
                list.querySelectorAll(site.listItems)[params[2]].classList.add("selected");
            }

            if (window.location.hostname=="www.croxyproxy.com") document.querySelector("head").innerHTML+="<style>#infoBar, #header, #logoContainer, #contentBody p, #zapperSquare {display:none !important;}</style>";

            document.querySelector(site.button).click();
        }
        else if (params[0]=="#img") {
            console.log(site);
            document.querySelector(site.input).value=params[1];
            document.querySelector(site.button).click();
        }
    }
}