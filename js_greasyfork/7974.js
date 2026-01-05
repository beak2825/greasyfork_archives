// ==UserScript==
// @name          Planets.nu - Alt Resource View
// @description   Uses different methods for graphic display of resources on map
// @include       http://*.planets.nu/*
// @include       http://planets.nu/*
// @version 1.0
// @namespace https://greasyfork.org/users/7189
// @downloadURL https://update.greasyfork.org/scripts/7974/Planetsnu%20-%20Alt%20Resource%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/7974/Planetsnu%20-%20Alt%20Resource%20View.meta.js
// ==/UserScript==

/*------------------------------------------------------------------------------
This add-on cahanges how resources are displayed on the map when using the Map 
Tools. Rsource are shown as 1 or 2 circles with the following characteristics:

Orange Circle:
 - Radius: Represents the total amount of that resource at the planet. For
   minerals this will include ground and surface amounts.
 - Edge Width: For minerals it reresents the density, unless that mineral is
   mined out (5 or less in ground) For other values it represents the expected
   increase in that value (population growth, income, etc.)
Yellow Circle (minerals only):
   Represents the amount of minerals available on the surface. If a planet is
   mined out, this will most likely be the only circle visible.
Natives only:
   When viewing natives a single letter respresenting the native type is
   displayed over the planet. The bigger the letter, the better the
   government.
------------------------------------------------------------------------------*/

function wrapper () { // wrapper for injection

    vgapMap.prototype.renderResource = function(ctx) {

        for (var i = 0; i < vgap.planets.length; i++) {
            var planet = vgap.planets[i];
            var density = 50;
            var surface = 0;
            var amount = planet[this.showresources];
            if (this.showresources == "nativeclans") {
                if (planet.nativeclans <= 0) continue;
                var nativeGrowth = 0;
                var nativeMax = 0;
                if ((planet.nativehappypoints + vgap.nativeTaxChange(planet)) >= 70 && planet.nativeclans > 0 && planet.clans > 0) {
                    if (planet.nativetype == 9) {
                        //siliconoid like it hot
                        nativeMax = planet.temp * 1000;
                        nativeGrowth = nativeGrowth + Math.round(((planet.temp / 100) * (planet.nativeclans / 25) * (5 / (planet.nativetaxrate + 5))));
                    }
                    else {
                        nativeMax = Math.round(Math.sin(3.14 * (100 - planet.temp) / 100) * 150000);
                        nativeGrowth = nativeGrowth + Math.round(Math.sin(3.14 * ((100 - planet.temp) / 100)) * (planet.nativeclans / 25) * (5 / (planet.nativetaxrate + 5)));
                    }
                    //slows down over 6,600,000
                    if (planet.nativeclans > 66000)
                        nativeGrowth = Math.round(nativeGrowth / 2);

                    //check max
                    if (planet.nativeclans > nativeMax)
                        nativeGrowth = 0;
                }                
                amount /= 20;
                density = nativeGrowth/planet.nativeclans*2000;
                
                var nativeletter = planet.nativeracename.substring(0, 1);
                if (planet.nativetype == 4) nativeletter = "V"; //avian
                if (planet.nativetype == 5) nativeletter = "X"; //amorph
                var fontsize = (30 + 3*planet.nativegovernment) / (this.zoom <= 1 ? 1.5 : 1);
                
                ctx.font = fontsize + "px sans-serif";
                ctx.fillStyle = "#ffff00";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";                
                ctx.fillText(nativeletter, this.screenX(planet.x), this.screenY(planet.y));
                ctx.font = "10px sans-serif";
                
            }
            else if (this.showresources == "megacredits") {
                var nativetaxrate = planet.nativetaxrate;
                var player = vgap.getPlayer(planet.ownerid);
                if (player != null) {
                    if (player.raceid == 6 && nativetaxrate > 20)
                        nativetaxrate = 20;
                }

                var val = Math.round(nativetaxrate * planet.nativegovernment * 20 / 100 * planet.nativeclans / 1000);

                if (val > planet.clans)
                    val = planet.clans;

                //player tax rate (fed bonus)
                var taxbonus = 1;
                if (vgap.advActive(2))
                    taxbonus = 2;
                val = val * taxbonus;

                //insectoid bonus
                if (planet.nativetype == 6)
                    val = val * 2;

                var colTax = Math.round(planet.colonisttaxrate * planet.clans / 1000);

                colTax = colTax * taxbonus;

                val += colTax;

                if (val > 5000)
                    val = 5000;
                density = val / 50;
            }
            else if (this.showresources == "supplies") {
                density = planet.factories;
                if (planet.nativetype == 2) //bovinoid
                    density += Math.min(planet.clans, planet.nativeclans/100); 
                density /= 20;
            }
            else if (this.showresources == "clans") {
                var player = vgap.getPlayer(planet.ownerid);
                var raceId = player.raceid;

                var colGrowth = 0;
                if ((planet.colonisthappypoints + vgap.colonistTaxChange(planet)) >= 70 && planet.clans > 0) {

                    var colMax = Math.round(Math.sin(3.14 * (100 - planet.temp) / 100) * 100000);

                    //crystals like it hot
                    if (raceId == 7) {
                        colMax = 1000 * planet.temp;
                        colGrowth = Math.round(((planet.temp / 100) * (planet.clans / 20) * (5 / (planet.colonisttaxrate + 5))));
                        if (vgap.advActive(47))
                            colGrowth = Math.round((((planet.temp * planet.temp) / 4000) * (planet.clans / 20) * (5 / (planet.colonisttaxrate + 5))));
                    }
                    else if (planet.temp >= 15 && planet.temp <= 84)
                        colGrowth = Math.round(Math.sin(3.14 * ((100 - planet.temp) / 100)) * (planet.clans / 20) * (5 / (planet.colonisttaxrate + 5)));

                    //slows down over 6,600,000
                    if (planet.clans > 66000)
                        colGrowth = Math.round(colGrowth / 2);

                    //planetoids do not have an atmosphere
                    if (planet.debrisdisk > 0)
                        colGrowth = 0;

                    //check against max
                    if ((planet.clans + colGrowth) > colMax)
                        colGrowth = colMax - planet.clans;

                    //100 and 0 degree planets
                    if (colGrowth < 0)
                        colGrowth = 0;
                }
                density = colGrowth/planet.clans*2000;
                amount /= 2;
            }            
            else if (this.showresources != "megacredits" && this.showresources != "supplies" && this.showresources != "clans") {
                amount = planet["ground" + this.showresources];
                density = planet["density" + this.showresources];
                surface = planet[this.showresources];
                if (amount > 0) {
                    if (amount <= 5) density = 0;
                    amount += surface;
                }
                else {
                    var total = planet["total" + this.showresources];
                    if (total > 0) amount = total;
                }
            }
            this.drawMineralValue(ctx, this.screenX(planet.x), this.screenY(planet.y), amount, density, surface);
        }

    };

    vgapMap.prototype.drawMineralValue = function (ctx, x, y, total, density, mined) {
        var density = Math.floor(density / 10 * this.zoom) + 1;
        if (density < 1) density = 1;
        if (total > 0)
            this.drawCircle(ctx, x, y, Math.sqrt(total/2) * this.zoom, "rgba(255, 128, 0, 0.5)", density);
        if (mined > 0)
            this.drawCircle(ctx, x, y, Math.sqrt(mined/2) * this.zoom, "rgba(255, 255, 0, 1)", 1);
        
    };
   
} //wrapper for injection

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script); 
document.body.removeChild(script);  