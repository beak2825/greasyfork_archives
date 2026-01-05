// ==UserScript==
// @name:hu             WME MapRaider
// @name:en             WME MapRaider
// @description:hu      Magyar MapRaid Segéd
// @description:en      WME MapRaid Helper
// @copyright           2014-2017, ragacs
// @name                WME MapRaider
// @description         WME MapRaid Helper
// @version             0.6
// @include             https://www.waze.com/editor*
// @include             https://www.waze.com/*/editor*
// @include             https://beta.waze.com/editor*
// @include             https://beta.waze.com/*/editor*
// @namespace https://greasyfork.org/users/6330
// @downloadURL https://update.greasyfork.org/scripts/6609/WME%20MapRaider.user.js
// @updateURL https://update.greasyfork.org/scripts/6609/WME%20MapRaider.meta.js
// ==/UserScript==

var wmemr_version = "0.6";
var wmemr_col_num = 20;
var wmemr_col_str = 6;
var wmemr_col_title = 7;

/* bootstrap, will call initialiseMapRaider() */
function bootstrapMapRaider()
{
    var bGreasemonkeyServiceDefined = false;

    try {
        bGreasemonkeyServiceDefined = (typeof Components.interfaces.gmIGreasemonkeyService === "object");
    }
    catch (err) { /* Ignore */ }

    if (typeof unsafeWindow === "undefined" || ! bGreasemonkeyServiceDefined) {
        unsafeWindow    = ( function () {
            var dummyElem = document.createElement('p');
            dummyElem.setAttribute('onclick', 'return window;');
            return dummyElem.onclick();
        }) ();
    }

    /* begin running the code! */
    setTimeout(initialiseMapRaider, 999);
}

/* helper function */
function getElementsByClassName(classname, node) {
    if(!node) node = document.getElementsByTagName("body")[0];
    var a = [];
    var re = new RegExp('\\b' + classname + '\\b');
    var els = node.getElementsByTagName("*");
    for (var i=0,j=els.length; i<j; i++)
        if (re.test(els[i].className)) a.push(els[i]);
    return a;
}

function getId(node) {
    return document.getElementById(node);
}

function processNewPermalinks()
{
    var lines = getId("_taMapRaidInput").value.split("\n");
    var mapRaiderCounter = getId("_inMapRaidStart").value;
    if(lines.length == 1 && lines[0].search(/^CFG:\s*[A-Z]+,\s*[A-Z]+,\s*[A-Z]+$/i) == 0)
    {
        lines[0]=lines[0].toUpperCase();
        var cfg = lines[0].slice(lines[0].indexOf(":") + 1).split(",");
        cfg[0] = cfg[0].trim();
        cfg[1] = cfg[1].trim();
        cfg[2] = cfg[2].trim();
        wmemr_col_num = cfg[0].charCodeAt(0) - 65;
        if(cfg[0].length > 1) wmemr_col_num = (wmemr_col_num + 1) * 26 + cfg[0].charCodeAt(1) - 65;
        wmemr_col_str = cfg[1].charCodeAt(0) - 65;
        if(cfg[1].length > 1) wmemr_col_str = (wmemr_col_str + 1) * 26 + cfg[1].charCodeAt(1) - 65;
        wmemr_col_title = cfg[2].charCodeAt(0) - 65;
        if(cfg[2].length > 1) wmemr_col_title = (wmemr_col_title + 1) * 26 + cfg[2].charCodeAt(1) - 65;
        console.log("WME-MapRaider:" + wmemr_col_num);
        updateMapRaiderConfigStr();
        return;
    }
    if(lines.length < 2) return;

    for(var i=0; i<lines.length; i++)
    {
        var linestr = "";
        var titlestr = "";
        var lon = "", lat = "", zoom = "6", segs = "";
        var cells = lines[i].split("\t");
        if(cells.length < 1) continue;
        for(var c=0; c < cells.length; c++)
        {
            // https://www.waze.com/editor/?lon=19.154683728784565&lat=47.46686402709748&zoom=6&marker=true&segments=102441276
            if(cells[c].search(/https:\/\/(www|beta).waze.com\/.*editor/) == 0)
            {
                lon = cells[c].replace(/.*lon=/,"").replace(/&.*$/,"");
                lat = cells[c].replace(/.*lat=/,"").replace(/&.*$/,"");
                if(cells[c].search("zoom") > 0)
                    zoom = cells[c].replace(/.*zoom=/,"").replace(/&.*$/,"");
                if(cells[c].search("segments") > 0)
                    segs = cells[c].replace(/.*segments=/,"").replace(/&.*$/,"");
            }
            else if(c == wmemr_col_str) linestr = cells[c];
            else if(c == wmemr_col_title) titlestr = cells[c];
            else if(c == wmemr_col_num) mapRaiderCounter = cells[c];
        }
        if(lon.length == 0 || lat.length == 0)
            continue;
        if(linestr.length == 0) linestr = "Bookmark";
        else linestr = mapRaiderCounter++ + ". (*)" + linestr;
        var item = document.createElement('div');
        var redx = document.createElement('img');
        redx.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABE0lEQVQ4jaWTsWoCURRED0EkyBbBDwhBxEJCEAsLf1BEUlgE8QusxMIiRbASEbEQSWURUoQUKUREUgWZNLvZm+tbU2ThFo+dmX0zsxfcI6gIOoKVYB/Ps6ArqHq8JeYEbcGXQBlzFDwILkPk0Rmin6dfIoKWeXkQvAVIO8G7OfcTctlcey9oCq4FLwa8FdRjbCJ+FNz5r68EUSyciGwFdWN1bPA9BHN31akTqRnywGE3CD4Cfn9EzpAl+LzIaLUK3JhzEWhk9b9wqt5zwWVyYsGGuHPkQSCTVx9iydS4FlwFPE8FkSAveDQ11hIbbQNeCoaBwGauwv5/fuWJMvaho7+XqXdCdkIVwb3SdT4oXedbj/8G3YhVhG0/RlMAAAAASUVORK5CYII=");
        redx.onclick = function(event) {
            event = event || window.event;
            var adiv = this.parentNode;
            adiv.parentNode.removeChild(adiv);
            event.stopPropagation();
        };
        var crosshair = document.createElement('img');
        crosshair.setAttribute("src", "data:image/png;base64,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");
        crosshair.setAttribute("width", "16");
        crosshair.onclick = function(event) {
            event = event || window.event;
            var tmplatlon=new OpenLayers.LonLat(this.parentNode.getAttribute("lon"), this.parentNode.getAttribute("lat"));
            tmplatlon.transform(Waze.map.displayProjection, Waze.map.getProjectionObject());
            Waze.map.setCenter(tmplatlon, this.parentNode.getAttribute("zoom"));
            event.stopPropagation();
        };
        item.innerHTML = linestr;
        item.appendChild(redx);
        item.appendChild(crosshair);
        item.setAttribute("lon", lon);
        item.setAttribute("lat", lat);
        item.setAttribute("zoom", zoom);
        item.setAttribute("segs", segs);
        item.setAttribute("title", titlestr);
        item.onclick = function(event) {
            event = event || window.event;
            if (event.ctrlKey)
            {
                this.removeAttribute("style");
                return;
            }
            var tmplatlon=new OpenLayers.LonLat(this.getAttribute("lon"), this.getAttribute("lat"));
            tmplatlon.transform(Waze.map.displayProjection, Waze.map.getProjectionObject());
            Waze.map.setCenter(tmplatlon, this.getAttribute("zoom"));
            var segs = this.getAttribute("segs");
            try
            {
                if(segs.length)
                {
                    var segstrarray = segs.split(",");
                    var segarray = [];
                    var good = 0, bad = 0;
                    for(var s=0; s < segstrarray.length; s++)
                    {
                        var aseg = Waze.model.segments.get(segstrarray[s]);
                        if(aseg === undefined)
                            bad++;
                        else
                        {
                            good++;
                            segarray.push(aseg);
                        }
                    }
                    Waze.selectionManager.select(segarray);
                    if(bad)
                    {
                        if(good)
                            this.style.backgroundColor = "#dddd20";
                        else
                            this.style.backgroundColor = "#bb5020";
                    }
                    else
                        this.style.backgroundColor = "#50bb20";
                }
            }
            catch(err)
            {
                this.style.backgroundColor = "#bb5020";
            }
        };
        getId("_divMapRaidPermalinks").appendChild(item);
    }
    getId("_taMapRaidInput").value = "";
    getId("_inMapRaidStart").value = mapRaiderCounter;
}

function clearMapRaiderVisited()
{
    var listedlinks=getId("_divMapRaidPermalinks").childNodes;
    for(var l = 0; l < listedlinks.length; l++)
    {
        var color = listedlinks.item(l).style.backgroundColor;
        if( color )
        {
            getId("_divMapRaidPermalinks").removeChild(listedlinks.item(l--));
        }
    }
}

function clearMapRaiderAll()
{
    getId("_divMapRaidPermalinks").innerHTML = '';
}

function updateMapRaiderConfigStr()
{ 
    var line = "Cfg: ";
    if(wmemr_col_num > 25) line += String.fromCharCode(~~(wmemr_col_num / 26) + 64);
    line += String.fromCharCode(wmemr_col_num % 26 + 65) + ", ";
    if(wmemr_col_str > 25) line += String.fromCharCode(~~(wmemr_col_str / 26) + 64);
    line += String.fromCharCode(wmemr_col_str % 26 + 65) + ", ";
    if(wmemr_col_title > 25) line += String.fromCharCode(~~(wmemr_col_title / 26) + 64);
    line += String.fromCharCode(wmemr_col_title % 26 + 65);
    getId("_divMapRaidConfig").innerHTML = line;
}

/* =========================================================================== */

function initialiseMapRaider()
{
    // global variables
    betaMode = location.hostname.match(/beta.waze.com/);

    // add new box to left of the map
    var addon = document.createElement('section');
    addon.id = "mapraider-addon";

    if (navigator.userAgent.match(/Chrome/)) {
        addon.innerHTML  = '<b>'
            + 'WME MapRaider</b> &nbsp; v' + wmemr_version;
    } else {
        addon.innerHTML  = '<b>'
            + 'WME MapRaider</b> &nbsp; v' + wmemr_version;
    }

    section = document.createElement('p');
    section.style.padding = "8px 16px";
    //section.style.textIndent = "-16px";
    section.id = "nameMapRaider";
    section.innerHTML  = '<button id="_btnMapRaidClearVisited" title="Tip: Use Ctrl+Click on items to clear visited state">Clear Visited</button>'
        +  '<button id="_btnMapRaidClearAll">Clear All</button>'
        +  '<div><b>Next No.:</b> &nbsp; <input type="number" value="1" title="Starting number (if index column is not found)" id="_inMapRaidStart"/></div>'
        +  '<div><b>Table rows:</b> &nbsp; <textarea rows="500" cols="10" title="Copy here complete rows from the MapRaid table\n'
        +  'or use Cfg:<index column>,<name column>,<description column> to configure. Eg. Cfg: A, E, F" id="_taMapRaidInput"></textarea></div>'
        +  '<div id="_divMapRaidConfig" title="Index Column, Name Column, Description Column"></div>'
        +  '<div id="_divMapRaidPermalinks"></div>';
    addon.appendChild(section);

    var userTabs = getId('user-info');
    var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
    var tabContent = getElementsByClassName('tab-content', userTabs)[0];

    newtab = document.createElement('li');
    newtab.innerHTML = '<a href="#sidepanel-mapraider" data-toggle="tab">MapRaider</a>';
    navTabs.appendChild(newtab);

    addon.id = "sidepanel-mapraider";
    addon.className = "tab-pane";
    tabContent.appendChild(addon);
    updateMapRaiderConfigStr();    

    getId('_taMapRaidInput').oninput = processNewPermalinks;    
    getId('_btnMapRaidClearVisited').onclick = clearMapRaiderVisited;    
    getId('_btnMapRaidClearAll').onclick = clearMapRaiderAll;    
}

/* engage! =================================================================== */
bootstrapMapRaider();

/* end ======================================================================= */