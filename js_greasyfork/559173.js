// ==UserScript==
// @name         Torn Location Based Travel Map (MAT Responsive)
// @namespace    http://tampermonkey.net/
// @version      2025-12-17
// @description  Replaces the plane in Torn travel page with a live, responsive location map (MAT version)
// @author       justlucdewit
// @match        https://www.torn.com/page.php?sid=travel
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MAT
// @downloadURL https://update.greasyfork.org/scripts/559173/Torn%20Location%20Based%20Travel%20Map%20%28MAT%20Responsive%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559173/Torn%20Location%20Based%20Travel%20Map%20%28MAT%20Responsive%29.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const render_frame = (canvas, ctx) => {
        const canvas_width = canvas.getBoundingClientRect().width;
        const canvas_height = canvas.getBoundingClientRect().height;
        canvas.width = canvas_width;
        canvas.height = canvas_height;

        ctx.clearRect(0, 0, canvas_width, canvas_height);

        const locations = {
            'torn': { 'x': 51, 'y': 47 },
            'mexico': { 'x': 48, 'y': 49 },
            'cayman-islands': { 'x': 54, 'y': 52 },
            'canada': { 'x': 54, 'y': 38 },
            'hawaii': { 'x': 34, 'y': 53 },
            'uk': { 'x': 77, 'y': 31 },
            'argentina': { 'x': 60, 'y': 83 },
            'switzerland': { 'x': 79, 'y': 36 },
            'japan': { 'x': 16, 'y': 42 },
            'uae': { 'x': 92, 'y': 49 },
            'china': { 'x': 9, 'y': 39 },
            'sout-africa': { 'x': 85, 'y': 78 },
        }

        // Draw location dots
        ctx.fillStyle = '#FF0000AA';
        Object.entries(locations).forEach(([name, loc]) => {
            const real_x = canvas.width / 100 * loc.x;
            const real_y = canvas.height / 100 * loc.y;

            // Draw the dot
            ctx.beginPath();
            ctx.arc(real_x, real_y, 5, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
        });

        // Calculate flight percentage
        const flight_progress_bar = document.querySelector('div[class^="flightProgressBar__"]');
        let flight_percentage = flight_progress_bar.querySelector('div[class^="fill__"]').style.width;
        flight_percentage = Number(flight_percentage.slice(0, flight_percentage.length - 1))

        // Calculate destination and departure country
        const country_wrapper = document.querySelector('div[class^="nodesAndProgress___"]');
        let countries = [...country_wrapper.querySelectorAll('img[class^="circularFlag___"]')];
        const fillHead = country_wrapper.querySelector('img[class^="fillHead___"]');

        // If fillHead has value of left, we are going back
        if (fillHead.style.left) {
            countries = countries.reverse();
        }

        const destination = countries[0].src.split('/').at(-1).slice(3, -4);
        const departure = countries[1].src.split('/').at(-1).slice(3, -4);

        const dest_loc = locations[destination];
        const dep_loc = locations[departure];

        if (!dest_loc) {
            console.warn(`Destination ${destination} not found`);
            return
        }

        if (!dep_loc) {
            console.warn(`Departure ${departure} not found`);
            return
        }

        // Calculate real coordinates
        const dep_real_x = canvas.width / 100 * dep_loc.x;
        const dep_real_y = canvas.height / 100 * dep_loc.y;
        const dest_real_x = canvas.width / 100 * dest_loc.x;
        const dest_real_y = canvas.height / 100 * dest_loc.y;

        // Draw line from dep to dest
        ctx.strokeStyle = '#FF0000AA';
        ctx.lineWidth = 1; // Added line width for visibility
        ctx.beginPath();
        ctx.moveTo(dep_real_x, dep_real_y);
        ctx.lineTo(dest_real_x, dest_real_y);
        ctx.stroke();

        // Position plane at correct location (Linear Interpolation)
        const plane_x = dep_real_x + ((dest_real_x - dep_real_x) * flight_percentage / 100);
        const plane_y = dep_real_y + ((dest_real_y - dep_real_y) * flight_percentage / 100);

        // **********************************
        // NEW CODE FOR ROTATION
        // **********************************

        // 1. Calculate the angle in radians (y-axis is inverted in canvas)
        const angle_rad = Math.atan2(dest_real_y - dep_real_y, dest_real_x - dep_real_x);

        // 2. Convert radians to degrees
        const angle_deg = angle_rad * (180 / Math.PI);

        // 3. Adjust for the plane icon's default orientation (assumes plane points right (0 deg))
        //    The plane character '✈︎' points 90 degrees right by default. We correct this.
        const rotation_offset = 0;
        const final_rotation = angle_deg + rotation_offset;

        // 4. Update CSS transformation
        const plane = document.getElementById("plane-indicator");
        if (plane) {
            // Position the center of the plane icon (32px wide/high)
            plane.style.left = `${plane_x - 16}px`;
            plane.style.top = `${plane_y - 16}px`;

            // Apply the rotation
            plane.style.transform = `rotate(${final_rotation}deg)`;
        }
    }

    const create_live_location_map = () => {
        const root = document.createElement("div");
        root.id = "travel-location-map"

        // Set map background image
        root.style.height = '400px';
        root.style.position = 'relative';
        root.style.background = 'url("https://github.com/justlucdewit/tampermonkey/blob/main/torn/live-location-travel-map/assets/map.png?raw=true")';
        root.style.backgroundSize = 'cover';

        // Draw the UI with the current flying location
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext('2d');
        canvas.style.width = '100%';
        canvas.style.height = '100%';

        // Indicator of where you are currently flying
        const map_location_indicator_plane = document.createElement("div");
        map_location_indicator_plane.style.width = "32px";
        map_location_indicator_plane.style.height = "32px";
        map_location_indicator_plane.style.position = "absolute";
        map_location_indicator_plane.style.left = "0px";
        map_location_indicator_plane.style.top = "0px";
        map_location_indicator_plane.innerText = "✈︎"
        map_location_indicator_plane.style.color = "#F00";
        map_location_indicator_plane.style.display = "flex";
        map_location_indicator_plane.style.alignItems = "center";
        map_location_indicator_plane.style.justifyContent = "center";
        map_location_indicator_plane.style.fontSize = "32px";
        map_location_indicator_plane.id = "plane-indicator";

        // Set transform-origin to center so rotation happens correctly
        map_location_indicator_plane.style.transformOrigin = "center center";


        setInterval(() => {
            render_frame(canvas, ctx);
        }, 1000);
        render_frame(canvas, ctx);

        root.appendChild(canvas);
        root.appendChild(map_location_indicator_plane);

        return root;
    }

    const initalize = () => {
        const travel_root = document.getElementById('travel-root');
        const random_fact_box = travel_root.querySelector('div[class^="randomFactWrapper"]');
        const original_flight_animation = travel_root.querySelector("figure");

        if (!(random_fact_box && original_flight_animation)) {
            return false;
        }

        const location_map = create_live_location_map();
        random_fact_box.remove();

        original_flight_animation.replaceWith(location_map);

        return true;
    }

    const attempt_initialization = () => {
        const result = initalize();

        if (!result) {
            requestAnimationFrame(attempt_initialization);
        }
    }

    requestAnimationFrame(attempt_initialization);
    })();