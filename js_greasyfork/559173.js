// ==UserScript==
// @name        Torn City Based Travel Map
// @namespace   http://tampermonkey.net/
// @version     2026-01-19/2.0
// @description Replaces the plane in Torn travel page with a live location map with curved paths(updated)
// @author      Papanad[3928917]
// @match       https://www.torn.com/page.php?sid=travel
// @icon        https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license     MAT
// @downloadURL https://update.greasyfork.org/scripts/559173/Torn%20City%20Based%20Travel%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/559173/Torn%20City%20Based%20Travel%20Map.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // -------------------------------
    // Pixel-perfect location coordinates (%)
    // -------------------------------
 const locations = {
    torn:            { x: 49.5, y: 47 },// center
    mexico:          { x: 45.5, y: 46.5 },
    'cayman-islands':{ x: 53.5, y: 51 },
    canada:          { x: 54, y: 38 },
    hawaii:          { x: 32, y: 53 },
    uk:              { x: 75.7, y: 33.6 },
    argentina:       { x: 59, y: 81 },
    switzerland:     { x: 78.5, y: 36.5 },
    japan:           { x: 13.5, y: 43.5 },
    uae:             { x: 91.5, y: 50 },
    china:           { x: 7, y: 40 },
    'south-africa':  { x: 83.8, y: 78 },
};


    const normalize = (name) => {
        name = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z\-]/g, '');
        if (name === 'cayman') return 'cayman-islands';
        if (name === 'southafrica') return 'south-africa';
        return name;
    };

    // -------------------------------
    // Render function
    // -------------------------------
    const render = (canvas, ctx) => {
        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;
        canvas.width = w;
        canvas.height = h;

        ctx.clearRect(0, 0, w, h);

        // Map inner bounds to avoid dots outside map image
        const marginX = w * 0.02; // 2% left/right
        const marginY = h * 0.05; // 5% top/bottom
        const mapW = w - 2 * marginX;
        const mapH = h - 2 * marginY;

        // Draw location dots
        ctx.fillStyle = ctx.fillStyle = '#FF0000AA'; // bright semi-transparent red

        Object.values(locations).forEach(loc => {
            const x = marginX + (loc.x / 100) * mapW;
            const y = marginY + (loc.y / 100) * mapH;
            ctx.beginPath();
            ctx.arc(x, y, Math.max(4, w * 0.006), 0, 2 * Math.PI);
            ctx.fill();
        });

        // Flight progress
        const bar = document.querySelector('div[class^="flightProgressBar__"]');
        if (!bar) return;
        let progress = bar.querySelector('div[class^="fill__"]').style.width || '0%';
        progress = Number(progress.replace('%', '')) / 100;

        const wrapper = document.querySelector('div[class^="nodesAndProgress___"]');
        if (!wrapper) return;
        let flags = [...wrapper.querySelectorAll('img[class^="circularFlag___"]')];
        const fillHead = wrapper.querySelector('img[class^="fillHead___"]');
        if (fillHead && fillHead.style.left) flags = flags.reverse();
        if (flags.length < 2) return;

        const dest = normalize(flags[0].src.split('/').at(-1).slice(3, -4));
        const dep = normalize(flags[1].src.split('/').at(-1).slice(3, -4));
        const dep_loc = locations[dep];
        const dest_loc = locations[dest];
        if (!dep_loc || !dest_loc) return;

        const dep_x = marginX + dep_loc.x / 100 * mapW;
        const dep_y = marginY + dep_loc.y / 100 * mapH;
        const dest_x = marginX + dest_loc.x / 100 * mapW;
        const dest_y = marginY + dest_loc.y / 100 * mapH;

        // Draw curved path
        ctx.strokeStyle = '#FF0000AA';
        ctx.lineWidth = Math.max(2.5, w * 0.004);
        ctx.beginPath();
        ctx.moveTo(dep_x, dep_y);
        const ctrl_x = (dep_x + dest_x) / 2;
        const ctrl_y = Math.min(dep_y, dest_y) - Math.abs(dest_x - dep_x) * 0.25;
        ctx.quadraticCurveTo(ctrl_x, ctrl_y, dest_x, dest_y);
        ctx.stroke();

        // Plane position along Bezier
        const t = progress;
        const px = (1 - t) ** 2 * dep_x + 2 * (1 - t) * t * ctrl_x + t ** 2 * dest_x;
        const py = (1 - t) ** 2 * dep_y + 2 * (1 - t) * t * ctrl_y + t ** 2 * dest_y;
        const dx = 2 * (1 - t) * (ctrl_x - dep_x) + 2 * t * (dest_x - ctrl_x);
        const dy = 2 * (1 - t) * (ctrl_y - dep_y) + 2 * t * (dest_y - ctrl_y);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;

        const plane = document.getElementById('plane-indicator');
        if (plane) {
            plane.style.left = `${px - 16}px`;
            plane.style.top = `${py - 16}px`;
            plane.style.transform = `rotate(${angle}deg)`;
        }
    };

    // -------------------------------
    // Create map container
    // -------------------------------
    const createMap = () => {
        const root = document.createElement('div');
        root.id = 'travel-location-map';
        root.style.position = 'relative';
        root.style.width = '100%';
        root.style.maxWidth = '1000px'; // prevent stretching
        root.style.margin = '0 auto';
        root.style.aspectRatio = '1000 / 600';
        root.style.background = 'url("https://github.com/justlucdewit/tampermonkey/blob/main/torn/live-location-travel-map/assets/map.png?raw=true") center center / contain no-repeat';

        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.display = 'block';
        const ctx = canvas.getContext('2d');

        const plane = document.createElement('div');
        plane.id = 'plane-indicator';
        plane.style.position = 'absolute';
        plane.style.width = '36px';
        plane.style.height = '36px';
        plane.style.fontSize = '36px';
        plane.style.display = 'flex';
        plane.style.alignItems = 'center';
        plane.style.justifyContent = 'center';
        plane.style.color = '#F00';
        plane.style.transformOrigin = 'center center';
        plane.innerText = '✈︎';

        root.appendChild(canvas);
        root.appendChild(plane);

        // Redraw on resize
        window.addEventListener('resize', () => render(canvas, ctx));
        setInterval(() => render(canvas, ctx), 1000);
        render(canvas, ctx);

        return root;
    };

    // -------------------------------
    // Initialize map on page
    // -------------------------------
    const initialize = () => {
        const travel_root = document.getElementById('travel-root');
        if (!travel_root) return false;

        const fact = travel_root.querySelector('div[class^="randomFactWrapper"]');
        const original = travel_root.querySelector('figure.airspaceScene___yGSV_');
        if (!(fact && original)) return false;

        const map = createMap();
        fact.remove();
        original.replaceWith(map);
        return true;
    };

    const attempt = () => {
        if (!initialize()) requestAnimationFrame(attempt);
    };

    requestAnimationFrame(attempt);
})();