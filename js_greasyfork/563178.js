// ==UserScript==
// @name         DM Color Contrast Checker
// @namespace    http://tampermonkey.net/
// @version      2026-01-18
// @description  Check contrast between colors.
// @author       Faro
// @license      MIT 
// @match        https://www.derbymanager.com/competitions?view=teams-tab
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563178/DM%20Color%20Contrast%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/563178/DM%20Color%20Contrast%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Min Contrast ratio allowed for a Jersey (foreground/background)
    const minContrast = 1.5;

    // Min Contrast ratio allowed for comparing teams colors (background/background)
    const minContrastBetweenJerseys = 1.75;

    // Function to calculate luminance of a color
    function luminance(color) {
        // Helper function to convert HEX to RGB
        function hexToRgb(hex) {
            let r = parseInt(hex.slice(1, 3), 16);
            let g = parseInt(hex.slice(3, 5), 16);
            let b = parseInt(hex.slice(5, 7), 16);
            return [r, g, b];
        }

        // Handle both HEX and RGB input
        if (color.startsWith('#')) {
            color = hexToRgb(color);
        } else {
            color = color.replace(/rgba?\(/, '').replace(/\)/, '').split(',').map(Number); // Normalize RGB
        }

        const [r, g, b] = color.map(value => {
            // Normalize and apply luminance formula
            value /= 255;
            return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
        });

        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    // Function to calculate contrast ratio between 2 colors
    function getContrast(a, b) {
        const lum = {
            a: luminance(a),
            b: luminance(b)
        }

        return (Math.max(lum.a, lum.b) + 0.05) / (Math.min(lum.a, lum.b) + 0.05);
    }
    window.getContrast = function(a, b) {
        return getContrast(a, b);
    }

    // Function to convert a RGB color to Hex
    String.prototype.toHex = function() {

        if (this.startsWith("rgb(")) {
            const rgbValues = this.replace(/^rgb\(\s*|\s*\)$/g, '').split(',');

            if (rgbValues.length !== 3) {
                throw new Error("Invalid RGB string format.");
            }

            const [r, g, b] = rgbValues.map(Number);

            return `#${[r, g, b].map(num =>
                                     num.toString(16).padStart(2, '0')
                                    ).join('')}`;
        }
        return this;
    };

    // Test function to print in Console with colors
    function colorTrace(msg, bg, color) {
        console.log("%c" + msg, "background-color:" + bg + ";color:" + color + ";font-weight:bold;");
    }

    // Test function to get the row of a team from the Table given a teamID
    function getTeam(teamID) {
        const teamsTable = document.querySelector("#teamsTable");
        let colors = {};
        if (!teamsTable) {
            console.error("Table not found");
            return [];
        }

        for (let i = 0; i < teamsTable.rows.length; i++) {
            const row = teamsTable.rows[i];
            const rowTeamID = row.cells[1];
            if (rowTeamID && rowTeamID.innerText === String(teamID)) {
                return row;
            }
        }

        return null;
    }

    // Test function to get the name of a team from the teamRow (extracted from the Table)
    function getTeamName(teamRow) {
        return teamRow.cells[2]?.querySelector('a')?.innerText;
    }

    // Test function to get the colors of a team given the teamRow (extracted from the Table)
    function getTeamColors(teamRow) {
        const teamName = teamRow.cells[2]?.querySelector('a')?.innerText;
        const colors = {
            light: {
                bg: teamRow.cells[2]?.style.backgroundColor?.toHex() || "#ffffff", // Get background color of LIGHT
                color: teamRow.cells[2]?.querySelector('a')?.style.color?.toHex() || "#000000" // Get text color of LIGHT
            },
            dark: {
                bg: teamRow.cells[3]?.style.backgroundColor?.toHex() || "#ffffff", // Get background color of DARK
                color: teamRow.cells[3]?.querySelector('a')?.style.color?.toHex() || "#000000" // Get text color of DARK
            }
        };

        return colors;
    }
    window.getTeamColors = function(teamID) {
        return getTeamColors(teamID);
    }

    // Test fuction to calculate the best colors to use on a Match
    // It tries to favor the Home main color (light) and picks the better contrast for the Away team.
    // And if there's not enough contrast, then it choses the other color for Home (dark) and matches vs the better contrasting Away color.
    function matchColors(homeID, awayID) {
        const home = getTeam(homeID);
        const away = getTeam(awayID);

        if (home && away) {
            const homeName = getTeamName(home);
            const awayName = getTeamName(away);
            const homeColors = getTeamColors(home);
            const awayColors = getTeamColors(away);
            let homeSelectedColor = null;
            let awaySelectedColor = null;

            const contrasts = {
                hlal: getContrast(homeColors.light.bg, awayColors.light.bg),
                hlad: getContrast(homeColors.light.bg, awayColors.dark.bg),
                hdal: getContrast(homeColors.dark.bg, awayColors.light.bg),
                hdad: getContrast(homeColors.dark.bg, awayColors.dark.bg)
            }

            // if Home Light background color has enough contrast with either Away background color
            if (contrasts.hlal >= minContrastBetweenJerseys || contrasts.hlad >= minContrastBetweenJerseys) {
                homeSelectedColor = homeColors.light;

                if (contrasts.hlal >= contrasts.hlad) {
                    awaySelectedColor = awayColors.light;
                }
                else {
                    awaySelectedColor = awayColors.dark;
                }
            }
            // if Home Ligth background color doesn't have enough contrast, use Home Dark instead
            else {
                const bestContrast = Math.max(contrasts.hdal, contrasts.hdad);
                if (contrasts.hdal == bestContrast) {
                    homeSelectedColor = homeColors.dark;
                    awaySelectedColor = awayColors.light;
                }
                else {
                    homeSelectedColor = homeColors.dark;
                    awaySelectedColor = awayColors.dark;
                }
            }
            console.log(contrasts);
            colorTrace(homeName, homeSelectedColor.bg, homeSelectedColor.color);
            colorTrace(awayName, awaySelectedColor.bg, awaySelectedColor.color);
            return {
                home: homeSelectedColor,
                away: awaySelectedColor
            };
        }
        else {
            console.log("Couldn't find teams", home, away);
        }
    }
    window.matchColors = function(homeID, awayID) {
        return matchColors(homeID, awayID);
    }


    // Test function applicable to Teams Tab view. Check all contrasts of a given row.
    function checkAllContrasts(row) {
        const colors = {
            light: {
                bg: row.cells[2]?.style.backgroundColor.toHex() || "#ffffff", // Get background color of LIGHT
                color: row.cells[2]?.querySelector('a')?.style.color.toHex() || "#000000" // Get text color of LIGHT
            },
            dark: {
                bg: row.cells[3]?.style.backgroundColor.toHex() || "#ffffff", // Get background color of DARK
                color: row.cells[3]?.querySelector('a')?.style.color.toHex() || "#000000" // Get text color of DARK
            }
        };

        function getFormattedContrast(a, b, betweenJerseys = false) {
            const contrast = getContrast(a, b);
            const minC = betweenJerseys ? minContrastBetweenJerseys : minContrast;

            const element = document.createElement('span');
            element.textContent = contrast.toFixed(2);

            if (contrast < minC) {
                element.setAttribute("style", `color: red; background:linear-gradient(0deg, yellow, orange); padding: 2px 5px; font-weight: bold;`);
            }

            return element.outerHTML;
        }

        // Calculate contrast ratio
        const lightContrast = getFormattedContrast(colors.light.bg, colors.light.color);
        const darkContrast = getFormattedContrast(colors.dark.bg, colors.dark.color);
        const contrastRatio = getFormattedContrast(colors.light.bg, colors.dark.bg, true);

        // Add new Light contrast value
        const lightContrastHtml = document.createElement("a");
        lightContrastHtml.innerHTML = lightContrast;
        lightContrastHtml.setAttribute("style", `color: ${colors.light.color}; float:right; margin-right: 1rem;`);
        row.cells[2].appendChild(lightContrastHtml);

        // Add new Dark contrast value
        const darkContrastHtml = document.createElement("a");
        darkContrastHtml.innerHTML = darkContrast;
        darkContrastHtml.setAttribute("style", `color: ${colors.dark.color}; float:right; margin-right: 1rem;`);
        row.cells[3].appendChild(darkContrastHtml);

        // Add new Contrast cell
        const newCell = document.createElement("td");
        newCell.innerHTML = `${contrastRatio}`; // Set the contrast value
        row.insertBefore(newCell, row.children[9]);
    }

    // Main script to update the table
    (() => {
        // Select the table
        const teamsTable = document.getElementById("teamsTable");

        // Insert the header for the new column
        const headerRow = teamsTable.querySelector("thead tr");
        const newHeaderCell = document.createElement("th");
        newHeaderCell.textContent = "Light/Dark"; // Set the text for the new header
        headerRow.insertBefore(newHeaderCell, headerRow.children[9]);

        // Insert a new cell for each row in the body
        const rows = teamsTable.querySelectorAll("tbody tr");
        rows.forEach(row => {
            checkAllContrasts(row);
        });
    })();

})();