// ==UserScript==
// @name            Produs (Proddable Pardus)
// @namespace       Produs
// @description     Makes Pardus a little more touch-friendly.
// @grant           GM_getValue
// @grant			GM_setValue
// @include         http*://*.pardus.at/*
// @version         8
// @author          Richard Broker (Beigeman)
// @license         MIT License
// @downloadURL https://update.greasyfork.org/scripts/7631/Produs%20%28Proddable%20Pardus%29.user.js
// @updateURL https://update.greasyfork.org/scripts/7631/Produs%20%28Proddable%20Pardus%29.meta.js
// ==/UserScript==

var TEXT_NODE = 3;
var PRODUS_CMD_ID_SUFFIX = "ProdusCommand";
var mod = { STARBASE : 0, PLANET : 1, BUILDING : 2,  MY_BUILDING : 3, NEW_BUILDING : 4, WARP : 5, AMBUSH : 6, RETREAT : 7, REFUEL : 8, DOCK : 9, HARVEST : 10, XWARP : 11, WRECK : 12, EXITSB : 13, VIEWAMBUSH : 14};
var PROT = { UNKNOWN : 0, YES : 1, NO : 2 };

var my_document = document;
var nav_size_ver = unsafeWindow.navSizeVer;
var nav_size_hor = unsafeWindow.navSizeHor;
var img_dir = unsafeWindow.imgDir;
var tile_res = unsafeWindow.tileRes;
var current_url = my_document.URL;
var sector, coords, aps_left, field_res, fuel;
var ap_img, res_img, fuel_img;
var starbase, planet, building, my_building, new_building, ambush, retreat, dock, harvest, refuel, warp, xwarp, xwarp_menu, wreck, exitsb, view_ambush;
var partial_refresh = false;
var in_callback = false;

universe();

/* Add a callback to support partial page refreshes. */
if (unsafeWindow.addUserFunction !== undefined) {
    unsafeWindow.addUserFunction(reflowNav);
}

/*
 * Reflow Pardus web pages.
 */
function universe()
{
    reflowButtons();
    reflowLinks();
    reflowNav();
    reflowStarbase();
    reflowPlanet();
    reflowTrade();    
}

function reflowNav()
{
    if (current_url.indexOf("main.php") == -1)
        return;
	
    if (my_document.getElementById("nav"))
        partial_refresh = true;

    /* Get rid of the left column as soon as possible, so the popping is less noticeable. */
    var left_column = my_document.getElementById("tdTabsLeft");
    var middle_column = my_document.getElementById("tdSpaceChart");
    var right_column = my_document.getElementById("tdTabsRight");

    middle_column.setAttribute('width', ((tile_res * nav_size_hor) + 50) + "px");
    left_column.setAttribute('style', 'display:none;');
    middle_column.childNodes[2].setAttribute('align', 'center');
    right_column.setAttribute('align', 'left');

    /* Add ship status & remove previously modded cmd elements. */
    if (partial_refresh)
    {
        var previous_clone = my_document.getElementById('yourship_clone');
        if (previous_clone)
        {
            previous_clone.parentNode.removeChild(previous_clone);
        }
    }
    
    var your_ship = getClone("yourship");
    your_ship.id = "yourship_clone";

    var produs_br = my_document.getElementById('produs_br');
    if (produs_br)
    {
        right_column.insertBefore(your_ship, produs_br);
    }
    else
    {
		var otherships = my_document.getElementById('otherships');
        right_column.insertBefore(your_ship, otherships);
        var br_container = my_document.createElement('div');
        br_container.id = "produs_br";
        br_container.appendChild(my_document.createElement('br'));
        br_container.appendChild(my_document.createElement('br'));
        right_column.insertBefore(br_container, otherships);
    }
	
	display_nav_lock_button(your_ship);	

    /* Grab the page elements we're interested in moving. */
    sector = getClone("sector");
    coords = getClone("coords");
    aps_left = getClone("apsleft");
    field_res = getClone("fieldres");
    fuel = getClone("fuel");

    ap_img = getClone("tdStatusApsImg");
    res_img = getClone("tdStatusResImg");
    fuel_img = getClone("tdStatusFuelImg");

    var status_box = getClone("status");    

    starbase = modNode(my_document.getElementById("aCmdStarbase"), mod.STARBASE);
    planet = modNode(my_document.getElementById("aCmdPlanet"), mod.PLANET);
    building = modNode(my_document.getElementById("aCmdBuilding"), mod.BUILDING);
    my_building = modNode(my_document.getElementById("aCmdOwnBuilding"), mod.MY_BUILDING);
    new_building = modNode(my_document.getElementById("aCmdBuild"), mod.NEW_BUILDING);
    warp = modNode(my_document.getElementById("aCmdWarp"), mod.WARP);
    xwarp = modNode(my_document.getElementById("aCmdWarpX"), mod.XWARP);
    ambush = modNode(my_document.getElementById("aCmdAmbush"), mod.AMBUSH);
    retreat = modNode(my_document.getElementById("aCmdRetreatInfo"), mod.RETREAT);
    refuel = modNode(my_document.getElementById("aCmdTank"), mod.REFUEL);
    dock = modNode(my_document.getElementById("aCmdDock"), mod.DOCK);
    harvest = modNode(my_document.getElementById("aCmdCollect"), mod.HARVEST);
    wreck = modNode(my_document.getElementById("aCmdWreck"), mod.WRECK);
    exitsb = modNode(my_document.getElementById("aCmdExitSb"), mod.EXITSB);
    view_ambush = modNode(my_document.getElementById("aCmdAmbushSettings"), mod.VIEWAMBUSH);    

    /* Reflow the elements we've manipulated. */
	var nav_table = getNavTable();
    prepend_status(nav_table);
    append_commands(nav_table);	
	apply_nav_lock(nav_table);
	
	reflowButtons();
    reflowLinks();
}

/*
* Reflows the starbase screen.
*/
function reflowStarbase()
{
    if (current_url.indexOf("starbase.php") == -1)
        return;

    var popularity_value = my_document.getElementById("popularity_value");

    if (popularity_value)
    {
        var popularity_greeting = my_document.getElementById("popularity_greeting");
        popularity_value.parentNode.removeChild(popularity_value);
        popularity_greeting.parentNode.removeChild(popularity_greeting);
    }

    var table = firstEChild(my_document.body);
    var tbody = firstEChild(table);
    var content = tbody.childNodes[1];
    var content_td = content.childNodes[1];

    /* Remove gossiper portraits. */
    var tables = my_document.getElementsByTagName('table');
    var content_div = my_document.getElementsByTagName('div')[0];
    content_div.removeChild(content_div.childNodes[1]); /* Gossipers 1&2. */
    content_div.removeChild(content_div.childNodes[4]); /* Gossipers 3&4 (empty innerHTML if missing, just remove anyway).*/
    
    /* Remove short range scanner notification */
    var table_headers = my_document.getElementsByTagName('th');
    if (table_headers)
    {
        for (var i = 0; i < table_headers.length; i++)
        {
            if (table_headers[i].textContent == "Short Range Scan")
            {
                var srs_table = table_headers[i].parentNode.parentNode.parentNode.parentNode;
                srs_table.parentNode.removeChild(srs_table);                
            }
        }
    }

    /* Remove starbase population display. */
    var popSpan = my_document.getElementsByTagName('span')[1];
    popSpan.parentNode.removeChild(popSpan);

    /* Only NPC starbases have popularity, so we use that to determine conditional actions. */
    if (!popularity_value)
    {
        /* Remove commander name, alliance links. */
        var commander = tables[4];
        commander.parentNode.removeChild(commander);

        /* Remove the custom welcome message. */
        if (tables.length  > 5)
        {
            var welcome_message = tables[5];
            welcome_message.parentNode.removeChild(welcome_message);
        }
    }

    /* Align things properly. */
    content_div.setAttribute('style', 'clear:both');
    tables[3].setAttribute('align', 'left');

    /* Make the service links touch-friendly */
    padLinks();
}

/*
* Reflows planet screens.
*/
function reflowPlanet()
{
    if (current_url.indexOf("planet.php") == -1)
        return;

    var popularity_value = my_document.getElementById("popularity_value");

    if (popularity_value)
    {
        var popularity_greeting = my_document.getElementById("popularity_greeting");
        popularity_value.parentNode.removeChild(popularity_value);
        popularity_greeting.parentNode.removeChild(popularity_greeting);
    }

    var table = firstEChild(my_document.body);
    var tbody = firstEChild(table);
    var content = tbody.childNodes[1];
    var content_tbl = content.childNodes[1];
    content_tbl.setAttribute('align', 'left');
    var links = firstEChild(firstEChild(firstEChild((content_tbl.childNodes[3]))));

    /* Remove gossiper portraits. */
    var tables = document.getElementsByTagName('table');
    var content_div = document.getElementsByTagName('div')[0];
    content_div.removeChild(content_div.childNodes[1]); /* Gossipers 1&2. */
    content_div.removeChild(content_div.childNodes[4]); /* Gossipers 3&4 (empty innerHTML if missing, just remove anyway).*/

    /* Remove starbase population display. */
    var popSpan = document.getElementsByTagName('span')[1];
    popSpan.parentNode.removeChild(popSpan);

    links.setAttribute('align', 'left');
    links.removeChild(links.childNodes[2]);
    links.childNodes[1].setAttribute('align', 'left');

    padLinks();
}

function reflowTrade()
{
    if ((current_url.indexOf("_trade.php") == -1) && (current_url.indexOf("blackmarket.php") == -1))
        return;

    var els = my_document.querySelectorAll("input[type=text]");

    for (var i = 0; i < els.length; i++)
    {
        els[i].type = "number";
        els[i].style.height = "35px";
        els[i].style.width = "50px";
    }
}

function reflowButtons()
{
    var els = my_document.querySelectorAll("input[type=submit]");

    for (var i = 0; i < els.length; i++)
    {        
        els[i].style.height = "45px";
        els[i].style.width = (((els[i].value.length) * 6) + 35) + "px";
    }
}

function reflowLinks()
{
    var els = my_document.querySelectorAll("a");

    for (var i = 0; i < els.length; i++)
    {
        if (els[i].querySelector("img"))
            continue;

        improveClickability(els[i]);
        els[i].style.padding = "1em";
    }
}

/* Clones node "node_str" from original document. */
function getClone(node_str)
{
    var node = my_document.getElementById(node_str);

    if (node != null)
        return node.cloneNode(true);

    return null;
}

/*
 * Generic link padding for better clickability on planets/starbases.
 */
function padLinks()
{
    var images = my_document.getElementsByTagName('img');
    for(var i = 0; i < images.length; i++)
    {
        if (images[i].src.indexOf("/factions/sign_") == -1)
            continue;

        if (images[i].parentNode.childNodes.length < 2)
            images[i].parentNode.parentNode.removeChild(images[i].parentNode);
        else
            images[i].parentNode.removeChild(images[i]);

        /* We just removed an element, so adjust our index accordingly. */
        i--;
    }

    var separators = my_document.getElementsByTagName('hr');

    for(var i = 0; i < separators.length; i++)
    {
        separators[i].setAttribute('style', 'display:none');
    }

    var links = my_document.getElementsByTagName('a');

    for(var i = 0; i < links.length; i++)
    {
        if (links[i].href != "javascript:showStory();")
        {
            links[i].setAttribute('style', 'display:block;padding:15px 0;border-top-style:solid;border-bottom-style:solid;border-width:1px;');
        }
        else
        {
            links[i].setAttribute('style', 'display:none');
        }
    }

    var br = my_document.getElementsByTagName('br');
    while(br.length > 0)
    {
        br[0].parentNode.removeChild(br[0]);
    }
}

/*
 * Gets the first child node which is not a text node.
 */
function firstEChild(node)
{
    for (var i = 0; i < node.childNodes.length; i++)
    {
        if (node.childNodes[i].nodeType != TEXT_NODE)
            return node.childNodes[i];
    }

    return null;
}

/*
 * Replaces the given node with a modified version.
 */
function modNode(node, mod_desired)
{
    if (!node)
        return null;

    if (node.childNodes.length <= 0 )
        return null;

    var mod = getModElement(mod_desired);
    removeChildNodes(node);
    node.appendChild(mod);
    node.id += PRODUS_CMD_ID_SUFFIX;
    improveClickability(node);
    return node;
}

/*
 * Makes the entire containing TD clickable.
 */
function improveClickability(node)
{
    node.setAttribute('style', 'display:inline-block');
    node.setAttribute('width', '100%');
    node.setAttribute('height', '100%');
}

/*
 * Returns true, if the script has detected that there is protection on this tile.
 */
function getProtectionStatus()
{
    var protection_node = my_document.getElementById("tdStatusTerritory");

    if (!protection_node)
        return PROT.UNKNOWN;

    var protection_text = firstEChild(protection_node);

    if (!protection_text)
        return PROT.UNKNOWN;

    switch (protection_text.textContent)
    {
        case "You cannot be attacked here.":
            return PROT.YES;
        case "You can be attacked here.":
            return PROT.NO;
        default:
            return PROT.UNKNOWN;
    }
}

/*
 * Destroys all child nodes of the given node.
 * - Assumes "hasChildNodes" has already been called.
 */
function removeChildNodes(node)
{
    while (node.childNodes.length > 0)
    {
        node.removeChild(node.firstChild );
    }
}

/*
 * Returns an element representing the desired modification.
 */
function getModElement(mod_desired)
{
    var new_element = my_document.createElement('img');

    switch (mod_desired)
    {
        case mod.STARBASE:
            new_element.setAttribute('src', getImgSrcByPartName("/foregrounds/starbase"));
        break;

        case mod.PLANET:
            new_element.setAttribute('src', getImgSrcByPartName("/foregrounds/planet"));
        break;

        case mod.BUILDING:
        case mod.MY_BUILDING:
            new_element.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gwWDwoCS9/8JgAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAACvklEQVR42u2aPZLqMAzH5bcchD0EtXwVDkFtpecQew+KyE0aanr7IvErsDMmSxLnbchmHvrPZIZJhD9+SLIdBCASiUQi0dtKLdiWjtda4nj9SLslASCi0fr1DJgZrLWwBIAlRcaYsIaMMQEAaIlB/3n3HCAA3h3AkkkQmBmIpkNTaw3PkiUzAzMX9bNFAGytTdl5arnEIQBVVdnC7M6bA1A4KAIAnGiHJAcIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIgGW1+41Oh/5EXfJPz1KpX5i/hvFaIoaNlb6I/mepH7jqWq7bH8ei/YwlweKytxeXrXXjWLs8rrjsbcmytbFxvKKf3ZzlKtX29Gt54mc9MLjkskMh1Xfpvp3+hzAtDpMxAP2aHw2xtudJLY9GRNRaY3JTxHsVTPZ9ijb90EngEqTOLnP5ocmXtLmKK3bP6rruQgMRQ/ZrBET8Fj7RhuKEGBFDXdcP7aTPWb+d7TNl/U4msMW3wilMlFLWWlvF2xi9wSqlrFKqC63s19OIiOk+EYFSCgaScGcb7axSqlJK2XQP7y64PgAiAnv3W8quCgA6X0bEpxPLc0xso7LW2mdb5KFaw6lna50F8iT0kCdm7Pc5A4hjwIkIk03bttC27aYOQ12yYmbQWoO1FowxRVWlJTqdTt/uXa/X7QBIk8/CA2C8WDJfVvVUyJ3PZ5slPZwzuFXeB5TGY9pfaK1TEjP9Za5v2xcidkvwZgCkwRIRhBAwhIBElE9Ap1UiXwVCCEPvCDjZZm2aEAIeDodkU1Rz/DH3UOKcA2YG7/3DRmjkGXjvP51z+/SciOB4PIJzDpxz4L3fxwF/JdsEIbfL2v4CAOe9/2Tm/e12g8vlAk3TQNM0+So0CUDNBTCQ6adObCUny6ktc0m/8lJFJJqnv3TcgKkE1HFuAAAAAElFTkSuQmCC');
        break;

        case mod.WARP:

            var src = getImgSrcByPartName("wormhole.png");

            if (src == null)
            {
                src = getImgSrcByPartName("foregrounds/wormholeseal_");
            }

            new_element.setAttribute('src', src);
        break;

        case mod.XWARP:
            var src = getImgSrcByPartName("foregrounds/xhole.png");

            if (src === null)
            {
                src = getImgSrcByPartName("foregrounds/yhole.png");
            }
            new_element.setAttribute('src', src);
        break;

        case mod.WRECK:
            new_element.setAttribute('src', getImgSrcByPartName(img_dir + "/foregrounds/wreck_"));
        break;



        case mod.AMBUSH:
            new_element.setAttribute('src', "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QAdAB0AHTxgYjZAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gwWDwsKXB9FVQAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAADbklEQVR42u1aW47rIAw1KPuydxa6spqV+X4U5noojyQFkpmJJaSWEgzmHD9IAW655ZZbbrnlz4qZqItCawmHNkWWmQZAxJWobANmBu89zDTATHHrukpN1nWVsHmatSh7JfgTESAi/koDICLW4B8NEMbQLCPYaQ7g/+YuhQJ7FvyZGZxzwMyHDPWjDJCDPzPD4/F4M8CBsHlpA9DrUPed6kwa2LNOP568/nwGDYZTILeZkPB4AHh47/2ZNLCj4d9IeV0p65tFA3sm/Gt9s2hgT4R/3DGfSQN7Ivy5Vf3NoIGdCf9R2eMlKVCCfwnqtd9G0sDOhH+G/9DyA6NpYE+Af47zVT8wkgb2CvA/kwb2AvA/lQbLZPgfOsmIqHBfeFkDVCu/0IehVTe7wXgMFxSHiPJ8PmWEPJ9PQUQJ9cM1fcBIjz1qbtsT/pOQ1lVXNwP0SH3PuClaRkN0S/zfOt+IaLCMhGS8+W3E/+yczIzOuRLvLxUNit7/g1ddBACce5XWOxrYkfBv5fkb7wuGRgM7Cv49ZEZt8LEBSt7/qPObXRvYUfDfUPxcggZ2MPwZxnrqj2mwfKgcY6jLIaCXH6jMj5+GQ3NxBFwBZbf8ajENyPWCl553FmQP6XSIKCLS+/LBIeKQC41PdS4Nh9Ot6IhRwZh5/83conNJszpmBmMMiAgQEXrvtQFqXlmPqVGIkhPhwvyt/tJatujMjnOx4gIAUZ9dAVaS0IUBgDN9lM5dGFODbdpPWleULToLel8Tqh+/HkgXGEvSnBQW5PRzOxbtCofjtK/KraGlU4+zGv4A8O2vKwBQLDqICIwx3hjjdfGT9uV4GccQETDzocJG8zu2Un2gdD5Ka9MW5mBBzpxGOo429LnCGMroOISAiNrQaut6m8tqZ8LMICIoIquIoLJSzuHknM2WeMtJO1wqxxMPKIIA4l3p8qLhn7uEjDQI0aB3gkI7x38T7z1ESItI3MOutS4Jn9L6nSISesTvyHfvvVP+pXbx6XR4VuO0z/ryBSICe9e6ROuGyTnlHhFFKnRBQNjIF73CNXc0PEXHGE4Ua+W1KonfULvHANr7c4ZrBOqlZuXFZ7Uvfvfew8v/fNu8i7pf1H4zUMpvTseVjFm6UdLFkGs4ilbG1crSuMH3VG/rDmBrJrg1q7zlllv+sPwDc6U2Rgd+YvUAAAAASUVORK5CYII=");
        break;

        case mod.RETREAT:
            new_element.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gwWDwcAEH/jRwAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAEYUlEQVR42u2a/3HzIAyG5S8ZhE4Co3QTK5vkmyRiEzyJ+0fBJyv8SgKu05q73LWJjdFjSYgXAI52tKMd7Wh/tw0bPsv4T6mR//wKANxoo7XWxqQZEBFYay0D0B3G0Nl45EYbY6AEgIhiMDb1ilbGk9Z6vt1u8zPtdrvN4zjOWuvZG2/+jPESxDtBaGr8FhBa5wDUWo+ImIx1Hud39DI5gogAEcFaewEA3O3bH8exNqZRfIqeM47jvFfjw9uPGiBcGBNuXAwfD2C3uQBTb/+BgWchMJDNvODfhoBq5nICALTW2lieKNURz7TzD5TCNRCIiDQiRpPh2wEwxgARaWvtkvBKEKy18F0IJiG9Tw5IJELcQzI7tXZxpRQope5+DN8rpZT5DmQzTdMHACixaHLvCgCmafrwBkZ/V0otiYzDSADZBEZLAC4MPuUFKRgSiIDRFcSpdYfTNH0451QNhJJ3bAGiNQAHAO5ZCBJGBIRrDeHUwatWEJxzi1GvgHDOqR4QTp1CK0CYrLVDCxC9IPQCECBQDARfEtcCERCmVsVQTwApEKGtgNTA8ADAWju08oItAEgQFAHyEIzWXrAXMeVHhJFTJ2M+WXlbU9U54RnZaTSyf/Djq0Fu6GoDxA/2kRVc0ASQiHTr9X83AFrrMbYB4oXMWi1Aiie6d+w11QNiig3TAh4BYLZaKreSxKhCxqo1yoDYUpPx31oV6i6IVKrCwfhNleFNBBEuhiSEkPD51Frr0saKtfY/AFxbDHpoDABrDMi58K/eHdrj/mAPPUABgHll9Zd58xbqVOVdlLUv7xJvcUZgVydEZI7Y4pTIrs4IJep86unyezwl1t3oox0tHwI5V33FNXm/uX5qQ4X3UXNP9Jnn2oWIT07myXl46RcASvrAammdSZR8LNl7aseeXYi8WIktx2cq5CwsVZKRsTyyM21SHmBCHR+EDFmjIyIgolzbp9yP2ANNqAH8HM/fBtXUBIWxZO/JjH0dAmGQiAiXy4XPxSYhT61Cxj9EupyRxRAAaC+SQAmAGEd45rLgkocoIvdkr69WhLx8zYuTO+OD5/i/w4mQXbdzzH3CWwqaHKvOuGuvlr7DMATqZp5n7RcwOuyCBA8Sb4hKEhsfh5DZkuEh78ldfxaylkFEzfftGRjNtD3M1fbBC7zLhadqkR+K3hHrPxgiSmZTuoetJikJAL7laGOtvYt5lh+iiWee55XHNBEa2VvjSfRyuQAA8KWxySVBBgtzAFbZXMR8NpHEZo0W4iULFwjH5gKE1AmyROKsKoSWYkLE/CMDDW+jpZ5PPjwREXUIr9iU9miIRWcB5mrFRBL+99Pm8r0v+HLn/KrqgEh4IvcEtuHSZBZYkiCbyrKJhCdNngNCLeDjlHwdsZphauqAmCf4ZCwPXzbRBB2Ioy08416vV5lIlusB4O56mXRCv8vDnINpmmKxaoKmSER31/B+fB/K65CQuqf3arBUCueuq+mvpp9DUDnak+0LX2/I7fo9xIkAAAAASUVORK5CYII=');
        break;

        case mod.NEW_BUILDING:
            new_element.setAttribute('src', "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gwWDQIiu+yCiAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAC4ElEQVR42u1b27HcIAzVfRSSVCJ1Zm0n24mlTnAlm4+Ahzjgp2DwXTTjH8bWmmMh6RxYgG7dunXr1u1t7cPID/nL2sRfxezbCgBEHIjsMBARUFWKACgChhUAQETAzKYAiAgCAEZgcOmIOGs8DMOrlI3j+ELEl5+86VL7vEOiCtGFiOijgN4KgAQI1FwO2FjLhyebSqhh3OcDssgHVQB4PB564GVJRJCZsyCICC4qRLtJcBiGl1+3R3oKQcTXOI5WPm+VAwQAWFX16NL5SUlQaoX3barAuwGQ5RZnqsrdACAAYETEVBXwbbFaLZHvmpM6QKySZTD6+nIbAPwk0F+nGyERAWY2/frVALhCk8NXj0KfbwWAUSdZrDw2D0CInkgTaKoFrqIHlNQEbsMGAx1mZlRVtsoFzbLBAEIMxAKEH80GeY0Rep8mS6FZNrjGCInITBlqmQxlS97V3qKzwQ7APQAgKLPd1nwnGCZOa5TYShNolg6n+oASmsBt6HApTaB5OlxaEbpVFbilImQ5ceuv3zwAmYlLkwAEzc4agFITD9b6GSGAirtE3d7RPoxD/Gy4Lv1LNL7HNx2491QS3DwGd/Ek1+zf+wEAgMSYHHjeFIDNY3C+CpgKlpEGOINice+lMphjYgnBMhfCyXBX1SMvvvRxugKdAiCh8hIAzBuafiK5sMyFOyzH1phlYIw77q/HBZbREaIip/GnJO8N4jRPPr43gFclAtbo7WL3tkRjNG+dR78HfwViqAdACu0o+UhBAObfj8FW1XkzpUoOyMlRiBhvYFbhS77i8BHBpUgSHIYBE1WgefssEZ4VSVNovKhqDkglwVCSVtRaghWl9+gSjI7MYvUqkFNql1Ugflnwf3y4uuZVlZg5LLfLGsTXkc7LOfePShNfz+fzvzM80zT9ds79Ck6cc6Cq4JyD4GuaptDF0I6xJwC42O+Kz11ol2aDe57LMb81Nrjlt4so3brtsz/AtXPP5JvNxAAAAABJRU5ErkJggg==");
        break;

        case mod.REFUEL:
            new_element.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gwWDwYQFNPCYgAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAADdUlEQVR42u1abXLjIAxVdnuQ9iTSVXoSqzfpTSJugk/C/gjqYAoB25DFiTXj6UzaoPJ4evrAAKeddtppp532snZptA75p7WJf7rZWysAEHEiaoeBiIAxhgIAuoDRCgAgImDmpgCICAIABmBwb0ZsNZ6myfWy6/XqENH5zTcNtT9HECplFyKiZwG9FAAJEGg4DSjE8urNpgRVP/d6QC304CEAfH19mRX/LIkIMnMWBBHBKEOMK4LTNDkft2tqCkFEd71eW615KA0QAGBjjFkbOs8kgvIoeh8mC7waAL16i0MAQADAiIipLLAlrf7XNBhuakVjlU2Dvi8wrTSiOwB+E+ifXYVQcPoPE8khmqGeDdEhsoCIADMr9Zu2xG+jb1yfHpsfFoDExmX4idDabjAndEEDBQDQ5dRH6AZJRFBBiIHwHR/cDv8YtrYb1Log2/X1HIONkAXEA5Dt+nqOwUZKg3KLkrxO9AZhhDpAjDGGmWtAeE4ANBTugeCFsnmXOEolWJwCEdHTj8XX6MHT9gJSYkHrUBgOgHssiELhKQGoygotWXDIsXhLQRx6LP4IQRx5IPKQUGjWDerUJvX5zlBgZs5OiOE2a6StLfOj3hHaM8yoOeEuw5LTXsEuG+jWi9I9aBz7+uUjFsHi624739giSFx7BeOv5gDofnI+3nI5tqD2aIzhDSD8XHvtzBD1Dv1+/L1CfRosFSEehDD9lKhNt6/Tzxp+8rtgR+o7GQo3CaW7AKSmuQDwc3EZILqgtiIehQuF1NefSk3/O4yomqNwjb8qEP40EhpGRAyLIQWptmbXjaRG5NHnvza/xV+RAblbXT2NIDwWcX25XJQ15JzDQDOMb3BQ1wgYRlB/e7y4Pr/jbz8A8WlkrqwWcZ1bxxijiGFc7vpn9fV5wd9+DdBT1kUzV1YU0XXVuwANFH6XvxoRhPDFxdKVVeOGqGh7/ZW6QfFtKTMzqtomUmAqc9BOJhSr0hb+arLAYkKT6sM1XOLTQES4ifL2zJI74Vb+atPgYkITpRvQwQUzg3MOnXOTcy4sd4svNYVr+zUwU4xJC39qf1O0s9aCiMA8z4uF5nn+sNa+AwBYa2Ge53fv7Hue5w8AeNfvZt7syK4frq2n+/n5CdZaiP7+GwDsXn+13aAkKkG6V+oWStMtpS2s/Ptaf6eddhrAP2FlQCgKYtGgAAAAAElFTkSuQmCC');
        break;

        case mod.DOCK:
            new_element.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gwWDwc3qMJGSAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAADDUlEQVR42u1aUbLbIAzctD6IexLpZpZPFnGT5iTuR8FDGOxgRzBOHprxvCQPO7DsCkkR0K1bt27duv1Yuxk9h/1lZeqv6jZYAUBEE/P7GKgqnHMcgaCfwCSZpmmxsPv9vkzTtBDR4hcvxux6st9WDPD29oPGcQQzYxxHjOM4AuDH4/EHwF9/fTcDcoyI2GDOhF9X1xYzQ0RARFRDDkPtBagqVLV4sTkZBRBEhCIH+TkAzPPsCibNqkoBhBSI8JkHwBSEqj5gmqbFU7cklhAASkTL/X7f8wfyjT4gHHninHM52UTMMAu8rugE9b9y8r6DmYND/FoAAEALWPDVx+AuCyzzjyvHAbsssJLBpQHYOuosZXD5SLC2dQA6AB2ADkAHoAPQAbikbYa6R4osHw0AEVEu4vOl85Iiy2dL4EXIq98MQBP6XxUABiAt6A80KIqe2HUmIhKR6vRvCQDjdSFzdXpb2remfxMA/ELIX6ednqpCREzpb2nVfhqr/fPY5SPBZOfFeveHKy88XLUWfzkAYieXHHdaS/eDNVXffUbi5KotPNgVe4SqL7pbt26nfECJzlvoN53HW9955BTY7QVs2N+3zsN/J1o5zd1wN+nvkxbzONB9YhsH5LKyqJEp18ezJZ8cU3JjSxh1ShqnAUgan1hV1xxeVeNurmyBI5KMJEA9jd0Yt1lEARBkYS6NPeoxAM38nxE1PQWZhNdJhvc0NrZkXDoPDfdlxjbLBrfotlZ3AEBEMM8z4vdRo8NTJYiZcbvd4vrAVkMEERGpamijO5Q4NSmIBP8Q4nzn3JNkAmW3xvrFu3RnAzjJPYeyxtbZoPoJSkGFSCMZxccr5ypIZ0tlVhKwTIYOZ6Dh75m+oeHNRUus9RCcvOjsksJJxmMJmcKqP43W7zzTSjuc1TWSQmdOv/54XCfnj0ciIuTACu/9rq5j/dG2tbvOOQcRoeg+RoXo8Ewk2OIYFB8DpEdjkRSOJENSkAvkSlh7gZArDITicZLkAnP0eRwIzSVhcqts0DIU3gp5TbPEbj/F/gElRPopq5cMoQAAAABJRU5ErkJggg==');
        break;

        case mod.HARVEST:
            new_element.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gwWDDIrHLRm6AAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAEB0lEQVR42u1a65HiMAz+9o5CTCVSKekkopNQCXIndiXcD+ycMXHeQFiiGWZ2vI4UfZZkPQLstNNOO+30vfTzYnkcfkOk4fcrAEiVZiIi5jIGqgprrU0AeCoYPy9Q/E5pZsYQAKqagyGvsog1lVciutZ1fb1cLtc5dLlcrkR0DcrLSPfZjvJzFc9BqOs6BYK/Rvkea+AtxgAGIEREIlL089THHxiMiA8iAmvtKbjEpkj6Tr7DlCX7jYoZdV1v0hUYgNZ1vSSYcQpEH5CBl3zE6c/w3cE4sjUrKJ7+gsA11qIWW8FhDQBK2d2CREZvjyupahsY+wLoOwEYit5zU1m11rKIUApAR5r8VgCKxc0Kp6UAxFrLN51fXygtCn5bva5y+rNR8/8cAD6ddgB2AHYAdgB2AHYAlqRr/RkfL0yEOOkXPCWh+ruUgff+aIwxXcmQc8547/2CZKgiotoYw977IwCTAOG2UAzFTI9KGWKWx0+uMyIfVSUAFAoiTmTrOwGYUjBNfdG2zE7T7eBypKoUwNW3ukBU0BgDY0zJDY7BZN0EnlVVVaaqqrt/RBmqCu+93UKtMbZ7M7YyZHxYS6y3LP6WpiiPefGlbfFnDEc+ajAiIjidTpselg5awgqjMcHGaVUQPm04+gDC1sfjX/+BxP6JzBtcY4wZP1XpnXYadoEuU11iljk/TdZfYfap/Ds5hzGRe4UanImoDnV92yPoWNMnKS9ERAB65RTv7iwZmZOJSawWQyUnhbWnFmpdcg55A0JEHu5jZoaIxA+U8gZHKbKv6TJ9PPvcNe8q3VWdAPSQt59i0ZHcxayqLTCh/cWJAMnv9sRl5iQwU3g+7M32PSRhoa3WdpP+5AlKln0JbjN6KyIRQZsrn1Z/0VqCz01NXzuVj3wznkX5c2QP+SPjsT3d+laSs1871mRCDMj9NdYAGuNSyrMkP/4dzTyTc1dXjJ0LpA0Mzev3xGpO1lobv+vpS3mLJtDzXP6/kvxg3qUaQtP1w4ygVApuKUi0+O4K/hp5jQBTM/fQMeXzodCp4a5AF+5RfkdTIr7fs74SU2stq2oMhGStjWbSXo/B1GigqclrKRzaX/EQaEwATfaOOqhDatYRgKDsnfkl92h6PSL6ewCNiKjdO+e0Ss8FA7ybNJXkh31DB6UA9G4w4r0/OudMVLqqKjAznHNomiYOI84AmnR/BMgYgzjISHKJBoDhG6UBCx1rGnkaY8DM8TljjIFzLg5DGgCuS37HPoNkcGNukxWOM8sUABeYemvtj3POOOegqmiaBufz2QblFf+nPC4FDUALVtbJYQAc+YWXQ8daqxgQ3xWl7lCn/K4uUtc7xqnSGtXgmLR1ajW4Vir8rOp2p51+C/0DkzjscRhTcjIAAAAASUVORK5CYII=');
        break;

        case mod.EXITSB:
            new_element.setAttribute('src', 'data:image/png;base64,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');
        break;
        
        case mod.VIEWAMBUSH:
            new_element.setAttribute('src', 'data:image/png;base64,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');
        break;

        default:
            alert("Undefined desired mod: " + mod_desired);
        break;
    }

    new_element.setAttribute('height', '48');
    new_element.setAttribute('width', '48');

    return new_element;
}

/*
 * Tries to find the correct image for a link by a part filepath match.
 */
function getImgSrcByPartName(match)
{
    var imgs = my_document.getElementsByTagName('img');

    for(var i = 0; i < imgs.length; i++)
    {
        if (imgs[i].src.indexOf(match) != -1)
        {
            return imgs[i].src;
        }
    }

    return null;
}

/*
 * Retrieves a reference to the ship information area.
 */
function getShipInfoTable()
{
    var tables = my_document.getElementsByTagName("table");

    for(i = 0; i < tables.length; i++)
    {
        if ((tables[i].border == 0) && (tables[i].align == "center"))
            return tables[i];
    }
}

/*
 * Retrieves a reference to the nav tiles.
 */
function getNavTable()
{
    var area = my_document.getElementById("navareatransition");

    if (area)
        return area;
    else
        return my_document.getElementById("navarea");
}

function createMaxWidthSpacer(spacer_tr)
{
    for(var i = 0; i < nav_size_hor; i++)
    {
        create_spacer(spacer_tr);
    }
}

function addProtectionStatusImage(protection_td)
{

    var protection_href = my_document.createElement('a');
    var protection_img;
    var protection = getProtectionStatus();

     // Add the link to check for current protection status, and apply relevant image.
    if (protection == PROT.UNKNOWN)
    {
        protection_img = my_document.createElement('img');
        protection_img.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAg9JREFUSMetleFt2zAQhT8JHkAjqBPEBu5/lAnqThB7gsQTuJqg6QR2Jqg3iP3/AKsTVCNog/bPk8HQlC2neQABiTzeI98d7zKuwN1LoALugTJaboEDsDez9pKf7AJBBaxFMgZ7oDaz/Sgidy+ADTAPpnfAbzkLUQF3CdulmXWDRO4+Bd6AQlM1sL0mi+RdSAGADngws+aMKCJpdKqGGyAfG2Aak2WBXG8yaGTQJU69DhKiVUzahPRnvnKtP0enSJEcJU+lsQCOWjtBex/kayrf5DrBk+xWMYmwlqS1mWVmlil+RRCXmGyl3yd3L3JlTAG0ZrYdkL+Ug++Bs/57mtogX618zyd6iACvF+K8CjIxxGxgnsDnGrifBMHdD2TSsT+1uw9lW2Nms4FHvAbKfETWTj/DJud21Bo3IVcajj15/366kba9zy5X9QX4OnJzeYNtb3fIVQQBKlXsa3hMtIuh6t/72+UqIf37+ZHY0yRuVF6xCX1tzawNa90fvYmtmS35D7j7RiWqA2YnIi3OgV/6fTGz1QcICt1koalvZrZ7l96aqG/MwJBkERRe1Gb6+DOJ7O+GNHf3Km7TQcAfo/axjG2zhK4AX/o+M9DaU+iAn5L97J1NErouzazV/LNayFDhbDQOwG6gxZykC0legE63mwcEH2rt76Rz979Xyk19oU+NxkS3mCuYXSRFwyfhH7CD3j/Lh+YKAAAAB3RJTUUH3AUIEBwxD/MvfAAAAABJRU5ErkJggg==');

        if (partial_refresh)
            protection_href.setAttribute('href', 'javascript:clusterprot()');
        else
            protection_href.setAttribute('href', current_url + '?ccp=1');

        protection_href.appendChild(protection_img);
        protection_td.appendChild(protection_href);
        improveClickability(protection_href);
    }
    else if (protection == PROT.NO)
    {
        protection_img = my_document.createElement('img');
        protection_img.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAASFJREFUSMfVltFRwzAMhj9zHSAjdAQeNIA7QckGjAATpEwAmaTdgAyg3GUERmCD9EXmfAHnEtfhQE+ypNxnW7/tOCJT1T3QAB7YW/gD6IBWRAYyzUWQk0Hm7EVETtkgVX0CXhd+8ywib2tBd6paTVYyALWIOBFxQG2xYI1t8ToQ8AhUUT8OInIJBeYfLIfVPuSAjtG4FZHPaZHF2ih0zAH5aNzN1MY5nwOKZ56U7y3S/gba0nZzyXEck+fuh1z6DDmXBqlq1ff9Oacf096qau2mM3POBdB7AcgXbK5HvmCL/C6sYGv7NdXdAhrsHpzehevlveDJuJhwAM7/fuuahF8cdJ/wt9k6ezjZUgzhP4PNQUt686dU1xXkzF6qdSFYB9RXqCRS5RA5dcAAAAAHdElNRQfcBQgQHR69OSNkAAAAAElFTkSuQmCC');
        protection_td.appendChild(protection_img);
    }
    else if (protection == PROT.YES)
    {
        protection_img = my_document.createElement('img');
        protection_img.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAARRJREFUSMfVltFtgzAQhj9HHYARMkIf/gGSCVo26AjtBCQTJEySjuABDokROkI3IC+2hBAgQ0zV/E+nuzMfnH8Zu67rGJNzbjRvZnugAg7APqR/AA/UktrR5y0BmdkpQOZ0lnRaDTKzT+BCmr4kXfuJXcoqMysGX9ICpSQnyQFlyEVVYcTLQMAHUPT24yjpOxZDfAw1Qu/7GtBbL64l/Q4bQq6eWJMMOvRiP9PnJ9Ykg/pv3q6pLQat1ay9p2pZQU3TFMBtOOsV8kA5N7ockGiK2y7RaQ/D/swMTwFqwxk3POdG9fIA6BzPOzOL5nnu0VUTcXbQ60S8zejCT5EtzRDvEGwOStmbf+U6n5Hj50BlJpgHyjuee1TKj0wZywAAAAd0SU1FB9wFCBAdN/+LuwgAAAAASUVORK5CYII=');
        protection_td.appendChild(protection_img);
    }

    return protection_td;
}


/*
 * Adds status information retrieved earlier and hacks it into a new row above the nav tiles.
 */
function prepend_status(nav_table)
{
    var tbody = firstEChild(nav_table);
    var first_row = tbody.childNodes[0];
    var status_tr_1 = my_document.createElement('tr');
    var status_tr_2 = my_document.createElement('tr');
    var spacer_tr = my_document.createElement('tr');
    var table;
    var sector_td = create_status_td();
    var coords_td = create_status_td();
    var aps_td = create_status_td();
    var res_td = create_status_td();
    var fuel_td = create_status_td();
    var protection_td = create_status_td();

    createMaxWidthSpacer(spacer_tr);

    addProtectionStatusImage(protection_td);

    // Complete the table data cells entry.
    sector_td.appendChild(sector);
    coords_td.appendChild(coords);
    aps_td.appendChild(ap_img);
    aps_td.appendChild(create_spacer_text());
    aps_td.appendChild(aps_left);
    res_td.appendChild(res_img);
    res_td.appendChild(create_spacer_text());
    res_td.appendChild(field_res);
    fuel_td.appendChild(fuel_img);
    fuel_td.appendChild(create_linebreak());
    fuel_td.appendChild(fuel);

    // Add all the TDs to the TRs.
    status_tr_1.appendChild(sector_td);
    status_tr_1.appendChild(coords_td);
    status_tr_1.appendChild(aps_td);
    status_tr_2.appendChild(res_td);
    status_tr_2.appendChild(fuel_td);
    status_tr_2.appendChild(protection_td);

    var status_table = create_status_table();
    status_tr_1.setAttribute("width", "100%");
    status_table.appendChild(status_tr_1);
    status_table.appendChild(status_tr_2);
    status_table.appendChild(spacer_tr);

    // Prepend desired elements. Include hack for different behaviour
    // with partial refreshes enabled.
    if (partial_refresh)
    {
        var previous_status_table = my_document.getElementById("produs_status_table");
        var nav = my_document.getElementById("nav");
        var navtransition = my_document.getElementById("navtransition");

        /* Remove any previously added information before adding more. */
        if    (previous_status_table)
        {
            previous_status_table.parentNode.removeChild(previous_status_table);
        }

        /* Add new status information. */
        status_table.id = "produs_status_table";
        nav.parentNode.id = "produs_nav_id";
        nav.style.top = "92px";
        navtransition.style.top = "92px";
        nav_table.parentNode.parentNode.insertBefore(status_table, nav_table.parentNode);
    }
    else
    {
        nav_table.parentNode.insertBefore(status_table, nav_table);
    }
}

function create_status_td()
{
    var td = my_document.createElement('td');
    td.setAttribute('align', 'center');
    td.setAttribute('width', '33.33%');
    return td;
}

/*
 * Creates a table to fill max width
 */
function create_status_table()
{
    var span_table = my_document.createElement('table');

    span_table.setAttribute('width', '100%');
    span_table.setAttribute('height', '64px');
    span_table.setAttribute('cellspacing', '0');
    span_table.setAttribute('cellpadding', '0');
    span_table.setAttribute('border', '0');

    return span_table;
}


/*
 * Creates a table inside the tr, which spans all of the nav columns, allowing cleaner layout.
 */
function create_max_colspan_table(tr)
{
    var spanning_td = my_document.createElement('td');
    var span_table = my_document.createElement('table');
    var span_tbody = my_document.createElement('tbody');

    span_table.setAttribute('width', '100%');
    spanning_td.setAttribute('colspan', nav_size_hor);

    span_table.appendChild(span_tbody);
    spanning_td.appendChild(span_table);
    tr.appendChild(spanning_td);

    return span_tbody;
}

/*
 * Fills out the row with a separator bar, to separate new areas from the nav tiles.
 */
function create_spacer(tr)
{
    var spacer_td = my_document.createElement('td');
    var spacer_text = my_document.createTextNode('\u00A0');

    spacer_td.setAttribute('style', 'background-image:url(' + img_dir + '/text7.png);background-repeat:repeat-x;');
    spacer_td.appendChild(spacer_text);

    tr.appendChild(spacer_td);
}


/*
 * Creates a line break.
 */
function create_linebreak()
{
    return my_document.createElement('BR');
}

/*
 * Used to separate images from text.
 */
function create_spacer_text()
{
    return my_document.createTextNode(" ");
}

/*
 * Attaches commands to the end of the the nav screen tiles.
 */
function append_commands(nav_table)
{
    var rows;
    var tbody = firstEChild(nav_table);
    var commands = new Array();
    var commands_tr = my_document.createElement('tr');
    var table;
    var commands_tr_1 = my_document.createElement('tr');
    var commands_tr_2 = my_document.createElement('tr');
    var commands_tr_3 = my_document.createElement('tr');
    var spacer_tr = my_document.createElement('tr');
    var context_td_1, building_td, ambush_td, harvest_td, dock_td, refuel_td, retreat_td, xwarp_td, view_ambush_td;

    createMaxWidthSpacer(spacer_tr);
    
    context_td_1 = my_document.createElement('td');

    if (starbase)
    {
        context_td_1.appendChild(starbase);
    }
    else if (planet)
    {
        context_td_1.appendChild(planet);
    }
    else if (building)
    {
        context_td_1.appendChild(building);
    }
    else if (my_building)
    {
        context_td_1.appendChild(my_building);
    }
    else if (exitsb)
    {
        context_td_1.appendChild(exitsb);
    }
    else if (warp)
    {
        context_td_1.appendChild(warp);
    }
    else if (xwarp)
    {
        context_td_1.appendChild(xwarp);
        xwarp_td = my_document.createElement('td');
        var warp_box = my_document.getElementById('xholebox');
        warp_box.firstChild.setAttribute('style', 'width:48px;height:48px;text-align:center;padding:12px 0;');
        warp_box.firstChild.firstChild.text = "?";
        xwarp_td.appendChild(warp_box);
    }
    else if (wreck)
    {
        context_td_1.appendChild(wreck);
    }
    else
    {
        var closed_wh = getImgSrcByPartName("wormholeseal_closed");

        if (closed_wh)
        {
            var new_element = my_document.createElement('img');
            new_element.setAttribute('height', '48');
            new_element.setAttribute('width', '48');
            new_element.setAttribute('src', closed_wh);
            context_td_1.appendChild(new_element);
        }
    }

    /* If we're on a nex hole, then ensure that we can select a destination. */
    if (xwarp_td)
    {
        commands.push(xwarp_td);
    }

    /* Add to the command array, there wont be something here if the PR callback is made without the page having changed. */
    if (context_td_1.childNodes.length > 0)
        commands.push(context_td_1);

    if (new_building)
    {
        building_td = my_document.createElement('td');
        building_td.appendChild(new_building);
        commands.push(building_td);
    }

    if (harvest)
    {
        harvest_td = my_document.createElement('td');
        harvest_td.appendChild(harvest);
        commands.push(harvest_td);
    }

    if (refuel)
    {
        refuel_td = my_document.createElement('td');
        refuel_td.appendChild(refuel);
        commands.push(refuel_td);
    }


    /* Add optional commands if they exist. */
    if (ambush)
    {
        ambush_td = my_document.createElement('td');
        ambush_td.appendChild(ambush);
        commands.push(ambush_td);
    }

    if (retreat)
    {
        retreat_td = my_document.createElement('td');
        retreat_td.appendChild(retreat);
        commands.push(retreat_td);
    }
    
    if (view_ambush)
    {
        view_ambush_td = my_document.createElement('td');
        view_ambush_td.appendChild(view_ambush);
        commands.push(view_ambush_td);
    }

    if (dock)
    {
        dock_td = my_document.createElement('td');
        dock_td.appendChild(dock);
        commands.push(dock_td);
    }

    // Make things a little bit tidier.
    tidy_td_arr(commands);

    // Add the new table entries.
    if (commands.length > 0)
    {
        var produs_commands_spacer = my_document.getElementById("produs_commands_spacer");
        if (produs_commands_spacer)
            produs_commands_spacer.parentNode.removeChild(produs_commands_spacer);
    }
            
    tbody.appendChild(spacer_tr);
    table = create_max_colspan_table(commands_tr);

    if (commands.length <= nav_size_hor)
    {
        rows = 1;
        add_one_row(commands, commands_tr_1);
        table.appendChild(commands_tr_1);
    }
    else if (commands.length >= (nav_size_hor * 2))
    {
        rows = 3;
        add_three_rows(commands, commands_tr_1, commands_tr_2, commands_tr_3);
        table.appendChild(commands_tr_1);
        table.appendChild(commands_tr_2);
        table.appendChild(commands_tr_3);
    }
    else
    {
        rows = 2;
        add_two_rows(commands, commands_tr_1, commands_tr_2);
        table.appendChild(commands_tr_1);
        table.appendChild(commands_tr_2);
    }

    /* Hacks for partial refresh. */
    if (partial_refresh && (commands.length > 0))
    {
        /* Remove existing tr before adding new content. */
        var produs_commands = my_document.getElementById("produs_commands");
        if (produs_commands)
            produs_commands.parentNode.removeChild(produs_commands);

        var produs_nav = my_document.getElementById("produs_nav_id");
        produs_nav.style.height = ((tile_res * nav_size_ver) + (rows * 50) + 115) + "px";
        produs_nav.style.backgroundImage = "";

        commands_tr.id = "produs_commands";
        spacer_tr.id = "produs_commands_spacer";
    }

    // Add the new table entries.    
    tbody.appendChild(commands_tr);
}

/*
 * Configures the tds to have a tidy layout for each nav screen size.
 */
function tidy_td_arr(tds)
{
    for(var i = 0; i < tds.length; i++)
    {
        tds[i].setAttribute('align', 'center');
        if (tds.length < nav_size_hor)
        {
            tds[i].setAttribute('width', (100 / tds.length) + "%");
        }
        else
        {
            tds[i].setAttribute('width', (100 / nav_size_hor) + "%");
        }
    }
}

/*
 * Just adds one tr below the nav tiles.
 */
function add_one_row(commands, tr1)
{
    for(var i = 0; i < commands.length; i++)
    {
        tr1.appendChild(commands[i]);
    }
}

/*
 * Splits commands into two trs below the nav tiles, we have too many
 * to fit in one row.
 */
function add_two_rows(commands, tr1, tr2)
{
    for(var i = 0; i < commands.length; i++)
    {
        if (i < nav_size_hor)
        {
            tr1.appendChild(commands[i]);
        }
        else
        {
            tr2.appendChild(commands[i]);
        }
    }
}

/*
 * Adds three rows, only needed when sitting on one's own building.
 */
function add_three_rows(commands, tr1, tr2, tr3)
{
    for( var i = 0; i < commands.length; i++)
    {
        if (i < nav_size_hor)
        {
            tr1.appendChild(commands[i]);
        }
        else if (i >= (nav_size_hor * 2))
        {
            tr3.appendChild(commands[i]);
        }
        else
        {
            tr2.appendChild(commands[i]);
        }
    }
}

function display_nav_lock_button(insertionParent)
{
	// If the browser doesn't support local storage this wont work, so don't show the button.
	if (typeof(Storage) === "undefined")
       return;
   
   var previous_lock_div = my_document.getElementById('produs_nav_lock_div');
   if (previous_lock_div)
	   previous_lock_div.parentNode.removeChild(previous_lock_div);
   
	var insertionPoint = insertionParent.childNodes[0].childNodes[1].childNodes[0].lastChild;
   
    var button = my_document.createElement("input");
    button.type = "submit";
	button.style.height = "45px";
	button.style.width = "125px";	
	button.style.fontSize = "9px";
	
	var appendDiv = my_document.createElement("div");
	appendDiv.id = "produs_nav_lock_div";
	appendDiv.style.width = "100%";
	appendDiv.style.height = "100%";
	appendDiv.style.textAlign = "center";	
	appendDiv.appendChild(button);
	
	if (is_nav_locked() === true) 
	{
		button.value = "Enable Engines";
		button.addEventListener('click', unlock_nav);
	}
	else
	{
		button.value = "Disable Engines";
		button.addEventListener('click', lock_nav);
	}
		
	insertionPoint.appendChild(my_document.createElement('br'));
    insertionPoint.appendChild(appendDiv);
}

function lock_nav()
{	
	if (is_nav_locked() === true)
		return;
	
	GM_setValue("produs_nav_lock", 1);

	window.location.reload();
}

function unlock_nav()
{
	alert("unlocking...");
	if (is_nav_locked() === false)
		return;
	
	GM_setValue("produs_nav_lock", 0);
	
	alert("locked after unlocking? " + is_nav_locked());

	window.location.reload();
}

function is_nav_locked()
{
	var val = (GM_getValue("produs_nav_lock", 0) == 1);
	
	alert("locked: " + val);
	
	return val;
}

function apply_nav_lock(nav_table)
{
	if (is_nav_locked() === false)
		return;
	
	var links = nav_table.getElementsByTagName('a');
	if (!links)
		return;
	
	for (var i = 0; i < links.length; ++i)
	{		
		links[i].removeAttribute("onclick");
		links[i].removeAttribute("href");
	}
}