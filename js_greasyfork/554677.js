// ==UserScript==
// @name         Epic Blue XXVI
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @description  Ogame's first version assets integration
// @author       raionard
// @match        https://*.ogame.gameforge.com/game/*
// @icon         https://i.imgur.com/0vNLRPa.png
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554677/Epic%20Blue%20XXVI.user.js
// @updateURL https://update.greasyfork.org/scripts/554677/Epic%20Blue%20XXVI.meta.js
// ==/UserScript==

// ==============================================================================================
// 🌌🌕🪐🛰🚀
// ___________      .__         __________.__                  ____  _______  _______   ____.___
// \_   _____/_____ |__| ____   \______   \  |  __ __   ____   \   \/  /\   \/  /\   \ /   /|   |
//  |    __)_\____ \|  |/ ___\   |    |  _/  | |  |  \_/ __ \   \     /  \     /  \   Y   / |   |
//  |        \  |_> >  \  \___   |    |   \  |_|  |  /\  ___/   /     \  /     \   \     /  |   |
// /_______  /   __/|__|\___  >  |______  /____/____/  \___  > /___/\  \/___/\  \   \___/   |___|
//         \/|__|           \/          \/                 \/        \_/      \_/
//                                                                raionard's nostalgic project
// ==============================================================================================

(function () {
    'use strict';

    // ==========================
    // 🪐 PLANETS CONFIGURATION 👇
    // ==========================
    const planetImages = [
        "https://i.imgur.com/l7GNcXA.jpeg", // Planet 1
        "https://i.imgur.com/4xBve6A.jpeg", // Planet 2
        "https://i.imgur.com/oaunU1E.jpeg", // Planet 3
        "https://i.imgur.com/OxabIaA.jpeg", // Planet 4
        "https://i.imgur.com/7TzBYuj.jpeg", // Planet 5
        "https://i.imgur.com/wnC8HTR.jpeg", // Planet 6
        "https://i.imgur.com/bxhUOyB.jpeg" // Planet 7
    ];

    function replacePlanetImages() {
        const planets = document.querySelectorAll('img.planetPic');
        if (planets.length === 0) return false;

        planets.forEach((planet, i) => {
            const newSrc = planetImages[i];
            if (newSrc) {
                planet.src = newSrc;
                console.log(`[OGame Planet Image] ✅ Planet #${i + 1} → ${newSrc}`);
            } else {
                console.warn(`[OGame Planet Image] ⚠️ No image selected for Planet #${i + 1}`);
            }
        });
        return true;
    }

    function waitForPlanets(retries = 15) {
        if (!replacePlanetImages() && retries > 0) {
            setTimeout(() => waitForPlanets(retries - 1), 500);
        }
    }

    waitForPlanets();

    // === CSS INJECTION ===
    const style = document.createElement('style');
    style.textContent = `
    body {
        background-image: url(https://i.imgur.com/tPn6EAu.jpeg) !important;
        background-size: cover !important;
    }
    body:before {
        content: '';
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba(0,0,0,0.3);
        pointer-events: none;
    }

    #suppliescomponent  header {
       background: url(https://i.imgur.com/6zhmyaq.jpeg) !important;
    }
    .sprite.metalMine    { background-image: url(https://i.imgur.com/qLbelK6.jpeg) !important; background-size: cover !important; }
    .sprite.crystalMine    { background-image: url(https://i.imgur.com/BipaWzU.jpeg) !important; background-size: cover !important; }
    .sprite.deuteriumSynthesizer    { background-image: url(https://i.imgur.com/1JKN6JB.jpeg) !important; background-size: cover !important; }
    .sprite.solarPlant    { background-image: url(https://i.imgur.com/3Tg0IRN.jpeg) !important; background-size: cover !important; }
    .sprite.fusionPlant    { background-image: url(https://i.imgur.com/MsKZNU4.jpeg) !important; background-size: cover !important; }
    .sprite.metalStorage    { background-image: url(https://i.imgur.com/AAO4dEf.jpeg) !important; background-size: cover !important; }
    .sprite.crystalStorage    { background-image: url(https://i.imgur.com/Gi0nq58.jpeg) !important; background-size: cover !important; }
    .sprite.deuteriumStorage    { background-image: url(https://i.imgur.com/boWVEEM.jpeg) !important; background-size: cover !important; }


    #facilitiescomponent  header {
       background: url(https://i.imgur.com/k7fdkCx.jpeg) !important;
    }
    .sprite.roboticsFactory    { background-image: url(https://i.imgur.com/Cio8W3M.jpeg) !important; background-size: cover !important; }
    .sprite.shipyard    { background-image: url(https://i.imgur.com/xDswZ3F.jpeg) !important; background-size: cover !important; }
    .sprite.researchLaboratory    { background-image: url(https://i.imgur.com/tyZGe3s.jpeg) !important; background-size: cover !important; }
    .sprite.allianceDepot    { background-image: url(https://i.imgur.com/RZOounZ.jpeg) !important; background-size: cover !important; }
    .sprite.missileSilo    { background-image: url(https://i.imgur.com/wk7dm9t.jpeg) !important; background-size: cover !important; }
    .sprite.naniteFactory    { background-image: url(https://i.imgur.com/ppYCWjG.jpeg) !important; background-size: cover !important; }
    .sprite.terraformer    { background-image: url(https://i.imgur.com/39u7vkg.jpeg) !important; background-size: cover !important; }
    .sprite.repairDock    { background-image: url(https://i.imgur.com/YvK4CL9.jpeg) !important; background-size: cover !important; }


    #shipyardcomponent  header {
       background: url(https://i.imgur.com/S3iU9VA.jpeg) !important;
    }
    .sprite.fighterLight    { background-image: url(https://i.imgur.com/hJZlecJ.jpeg) !important; background-size: cover !important; }
    .sprite.fighterHeavy    { background-image: url(https://i.imgur.com/iRx8gKN.jpeg) !important; background-size: cover !important; }
    .sprite.cruiser         { background-image: url(https://i.imgur.com/zahz5y0.jpeg) !important; background-size: cover !important; }
    .sprite.battleship      { background-image: url(https://i.imgur.com/nYBGlfS.jpeg) !important; background-size: cover !important; }
    .sprite.interceptor     { background-image: url(https://i.imgur.com/aDvJcO1.jpeg) !important; background-size: cover !important; }
    .sprite.bomber          { background-image: url(https://i.imgur.com/IrquNkk.jpeg) !important; background-size: cover !important; }
    .sprite.destroyer       { background-image: url(https://i.imgur.com/rWQn5zt.jpeg) !important; background-size: cover !important; }
    .sprite.deathstar       { background-image: url(https://i.imgur.com/f6ELOFm.jpeg) !important; background-size: cover !important; }
    .sprite.reaper          { background-image: url(https://i.imgur.com/7evw0iU.jpeg) !important; background-size: cover !important; }
    .sprite.explorer        { background-image: url(https://i.imgur.com/SPO2HZ0.jpeg) !important; background-size: cover !important; }

    .sprite.transporterSmall { background-image: url(https://i.imgur.com/rFhOFFX.gif) !important; background-size: cover !important; }
    .sprite.transporterLarge { background-image: url(https://i.imgur.com/lnwiveJ.jpeg) !important; background-size: cover !important; }
    .sprite.colonyShip       { background-image: url(https://i.imgur.com/hsat4Rd.jpeg) !important; background-size: cover !important; }
    .sprite.recycler         { background-image: url(https://i.imgur.com/BuaUO5F.jpeg) !important; background-size: cover !important; }
    .sprite.espionageProbe   { background-image: url(https://i.imgur.com/XrwHFZz.jpeg) !important; background-size: cover !important; }
    .sprite.solarSatellite   { background-image: url(https://i.imgur.com/0pJAZIa.jpeg) !important; background-size: cover !important; }
    .sprite.resbuggy         { background-image: url(https://i.imgur.com/txaJvDh.jpeg) !important; background-size: cover !important; }

    #defensescomponent  header {
       background: url(https://i.imgur.com/ul0hKkk.jpeg) !important;
    }
    .sprite.rocketLauncher { background-image: url(https://i.imgur.com/gH8FpTC.jpeg) !important; background-size: cover !important; }
    .sprite.laserCannonLight, technology-icon.lasercannoLight  { background-image: url(https://i.imgur.com/ydvwu6n.jpeg) !important; background-size: cover !important; }
    .sprite.laserCannonHeavy  { background-image: url(https://i.imgur.com/j82glRh.jpeg) !important; background-size: cover !important; }
    .sprite.gaussCannon  { background-image: url(https://i.imgur.com/KjEjhoJ.jpeg) !important; background-size: cover !important; }
    .sprite.ionCannon  { background-image: url(https://i.imgur.com/Itad21z.jpeg) !important; background-size: cover !important; }
    .sprite.plasmaCannon  { background-image: url(https://i.imgur.com/KDNYsKA.jpeg) !important; background-size: cover !important; }
    .sprite.shieldDomeSmall  { background-image: url(https://i.imgur.com/wVdGk30.jpeg) !important; background-size: cover !important; }
    .sprite.shieldDomeLarge  { background-image: url(https://i.imgur.com/HUUvc55.jpeg) !important; background-size: cover !important; }
    .sprite.missileInterceptor  { background-image: url(https://i.imgur.com/5hsLCyN.jpeg) !important; background-size: cover !important; }
    .sprite.missileInterplanetary  { background-image: url(https://i.imgur.com/snWOu6L.jpeg) !important; background-size: cover !important; }

/*
    #researchcomponent  header {
       background: url(https://i.imgur.com/mkEfYS1.jpeg) !important;
    }*/
    .sprite.espionageTechnology { background-image: url(https://i.imgur.com/wt3BWDo.jpeg) !important; background-size: cover !important; }
    .sprite.gravitonTechnology  { background-image: url(https://i.imgur.com/A8F8dRy.jpeg) !important; background-size: cover !important; }
    .sprite.computerTechnology  { background-image: url(https://i.imgur.com/3criNhn.jpeg) !important; background-size: cover !important; }
    .sprite.laserTechnology  { background-image: url(https://i.imgur.com/2rqDglz.jpeg) !important; background-size: cover !important; }
    .sprite.weaponsTechnology  { background-image: url(https://i.imgur.com/3OwJBYe.jpeg) !important; background-size: cover !important; }
    .sprite.shieldingTechnology  { background-image: url(https://i.imgur.com/XOkkDxW.jpeg) !important; background-size: cover !important; }
    .sprite.armorTechnology  { background-image: url(https://i.imgur.com/scyt60Y.jpeg) !important; background-size: cover !important; }
    .sprite.ionTechnology  { background-image: url(https://i.imgur.com/tuVmK2F.jpeg) !important; background-size: cover !important; }
    .sprite.hyperspaceTechnology  { background-image: url(https://i.imgur.com/R7moFs6.jpeg) !important; background-size: cover !important; }
    .sprite.plasmaTechnology  { background-image: url(https://i.imgur.com/wApQ5lQ.jpeg) !important; background-size: cover !important; }
    .sprite.combustionDriveTechnology  { background-image: url(https://i.imgur.com/TRcZaoC.jpeg) !important; background-size: cover !important; }
    .sprite.impulseDriveTechnology  { background-image: url(https://i.imgur.com/hDIgOVt.jpeg) !important; background-size: cover !important; }
    .sprite.hyperspaceDriveTechnology  { background-image: url(https://i.imgur.com/2IH6THz.jpeg) !important; background-size: cover !important; }
    .sprite.gravitationTechnology  { background-image: url(https://i.imgur.com/A8F8dRy.jpeg) !important; background-size: cover !important; }
    .sprite.energyTechnology  { background-image: url(https://i.imgur.com/eE60E70.jpeg) !important; background-size: cover !important; }
    .sprite.researchNetworkTechnology  { background-image: url(https://i.imgur.com/gS2oC42.jpeg) !important; background-size: cover !important; }

    .sprite.moonbase   { background-image: url(https://i.imgur.com/KHzGgWQ.jpeg) !important; background-size: cover !important; }
    .sprite.sensorPhalanx   { background-image: url(https://i.imgur.com/clwwy8J.jpeg) !important; background-size: cover !important; }
    .sprite.jumpGate   { background-image: url(https://i.imgur.com/l9Julgk.jpeg) !important; background-size: cover !important; }

    .resourceIcon.metal{background: url(https://i.imgur.com/wHgslde.jpeg) 0px 0px no-repeat!important; background-size: cover!important;}
    .resourceIcon.crystal{background: url(https://i.imgur.com/U5NT7qM.jpeg) 0px 0px no-repeat!important; background-size: cover!important;}
    .resourceIcon.deuterium{background: url(https://i.imgur.com/J8DQH0W.jpeg) 0px 0px no-repeat!important; background-size: cover!important;}
    .resourceIcon.energy{background: url(https://i.imgur.com/gXtLOoL.jpeg) 0px 0px no-repeat!important; background-size: cover!important;}

    /* ================================
       Misc
       ================================ */
    .planetPic {
        border-radius: 0px !important;
    }
    `;
    document.head.appendChild(style);

    document.querySelector('#menuTable > li:nth-child(2) > a > span').textContent = 'Infrastrutture';
})();
