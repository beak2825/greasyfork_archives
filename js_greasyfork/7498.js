// ==UserScript==
// @name        PtP Average BP/year/GiB
// @namespace   passthepopcorn.me
// @description Calculates a sortable, color-coded measure of torrent value on PtP (3-year average BP per year per GiB). This metric is an improvement on naive BP/yr/GiB, since it takes into account the fact that younger torrents are significantly undervalued. Modification of Dagam's script; uses BH39's formula for BP earned over a period. Handles: bp/hour rates close to 0.0, Golden Popcorn status & partial-day seeding. Not compatible with other BP rate scripts.
// @include     https://*.passthepopcorn.me/bprate.php*
// @include     http://*.passthepopcorn.me/bprate.php*
// @include     http://passthepopcorn.me/bprate.php*
// @include     file://*/*Bonus*point*rates*PassThePopcorn*
// @version     2.00
// @authors     coj, Dagam
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7498/PtP%20Average%20BPyearGiB.user.js
// @updateURL https://update.greasyfork.org/scripts/7498/PtP%20Average%20BPyearGiB.meta.js
// ==/UserScript==

// Constants in the BP/hour formula
var a = 0.25, b = 0.6, c = 0.6, constGoldenMultiplier = 2.0;
var constYears = 3.0; // 3-year horizon (can be changed)
var constDaysPerYear = 365.2422;
var period = constYears * constDaysPerYear;
var arrMetric = new Array();
var tbody;

var tbls = document.getElementsByTagName('table');
for (j = 1; j < tbls.length; j++) {
    var tbl = tbls[j];
    // Position of GB column
    var gbi = j + 1;
    // Add header cell(s)
    var tr = tbl.tHead.children[0];
    
    // Temporary seedtime column
    var th = document.createElement('th');
    th.innerHTML = "Calc'd days seeded";
    tr.appendChild(th);
    
    // Header
    var th = document.createElement('th');
    th.addEventListener("click", sort_table, true);
    th.innerHTML = '<a href="">3-yr avg BP/yr/GiB</a>';
    tr.appendChild(th);
    
    // open loop for each row and append cell
    for (i = 1; i < tbl.rows.length; i++) {
        var row = tbl.rows[i];
        var gb = row.cells[gbi].innerHTML.trim().replace(',', '');
        // Apply factors
        if (gb.split(" ")[1] == "KiB") {
            gb = parseFloat(gb.split(" ")[0]) / 1000000;
        } else if (gb.split(" ")[1] == "MiB") {
            gb = parseFloat(gb.split(" ")[0]) / 1000;
        } else if (gb.split(" ")[1] == "GiB") {
            gb = parseFloat(gb.split(" ")[0]);
        } else if (gb.split(" ")[1] == "TiB") {
            gb = parseFloat(gb.split(" ")[0]) * 1000;
        } else if (gb.split(" ")[1] == "PiB") {
            gb = parseFloat(gb.split(" ")[0]) * 1000000;
        } else {
            gb = parseFloat(gb.split(" ")[0]);
        }
        var goldenMultiplier = row.cells[gbi - 1].children[0] ? constGoldenMultiplier : 1.0; // check if Golden Popcorn
        var bpPerYear = parseFloat(row.cells[row.cells.length - 1].innerHTML.trim().replace(/,/g , '')) / goldenMultiplier;
        var bpPerHour = parseFloat(row.cells[gbi + 3].innerHTML.trim().replace(/,/g , '')) / goldenMultiplier;
        cell_t = row.insertCell(row.cells.length);
        cell = row.insertCell(row.cells.length);
        
        /* Calculate average BP using BH39's formula */
        var avgBpPerHour = bpPerYear / 8765.81; // average hours per year
        // If avgBpPerHour is too close to bpPerHour, use avgBpPerHour instead to ensure precision
        if (avgBpPerHour / bpPerHour > (0.995 - 0.05/bpPerHour)) {
            bpPerHour = avgBpPerHour;
        }
        var fractionOfDaySeeding = Math.round((avgBpPerHour / bpPerHour) * 24) / 24.0;
        var effectivePeriod = fractionOfDaySeeding * period;
        var accurateBpPerHour = avgBpPerHour / fractionOfDaySeeding;
        // Seeds
        var rawSeeds = parseFloat(row.cells[gbi + 1].innerHTML.trim().replace(',', ''));
        var seeds = Math.max(1.0, rawSeeds);
        var Q = b / Math.pow(seeds, c); // intermediate calculation
        // Seedtime in days
        var t = Math.exp( (accurateBpPerHour/gb - a) / Q ) - 1.0;
        cell_t.innerHTML = numbers((t).toFixed(1));        

        // Calculate average BP/year divided by size (g)
        var AvgBpPerYearPerGiB = (24.0 * ( a*effectivePeriod + Q * ((t + 1.0 + effectivePeriod)*(Math.log(t + 1.0 + effectivePeriod)) - (t + 1.0)*(Math.log(t + 1.0)) - effectivePeriod) ) * goldenMultiplier) / constYears;
        cell.innerHTML = numbers((AvgBpPerYearPerGiB).toFixed(1)) + ((rawSeeds < 0.99) ? " <b>?</b>" : "");
        colourizeCellByRate(AvgBpPerYearPerGiB, cell);
        arrMetric[i-1] = AvgBpPerYearPerGiB; // store metric values for sorting later
    }
    tbody = tbl.tBodies[0]; // store tbody for sorting later
}

function colourizeCellByRate(rate, cell) {
    cell.style.color = colourize(rate);
}

function colourize(rate) {
    // Colorize: 0-10k is red/brown, 10-20k is yellow, 20-30k is green, beyond is blue-green/cyan.
    // Requires browser that supports CSS 3.
    rate = rate / 1000.0;
    var hue = Math.min(180, 4.0 * rate);
    var sat = Math.min(100, 50.0 + (4.0/3.0) * rate);
    var light = Math.min(50, 40.0 + 3.0 * rate);
    return 'hsl('+hue+', '+sat+'%, '+light+'%)';
}

// https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function numbers(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Adapted from http://codereview.stackexchange.com/questions/37632/how-should-i-sort-an-html-table-with-javascript-in-a-more-efficient-manner
function sort_table(event) {
    event.preventDefault();
    if (!arrMetric) return;
    var col = tbl.rows[1].cells.length - 1, asc = -1;
    var rows = tbody.rows, rlen = rows.length, arr = new Array(), i, j, cells, clen;
    // fill the array with values from the table
    for(i = 0; i < rlen; i++) {
        cells = rows[i].cells;
        clen = cells.length;
        arr[i] = new Array();
        for(j = 0; j < clen; j++) {
            if (j == col) {
                arr[i][j] = arrMetric[i]; // get metric value from arrMetric
            } else {
                arr[i][j] = cells[j].innerHTML;
            }
        }
    }
    
    // sort the array by the specified column number (col) and order (asc)
    arr.sort(function(a, b){
        return (a[col] == b[col]) ? 0 : ((a[col] > b[col]) ? asc : -1*asc);
    });
    for(i = 0; i < rlen; i++){
        arr[i][col] = "<span style=\"color: " + colourize(arr[i][col]) + "\">" + numbers((arr[i][col]).toFixed(1)) + "</span>";
        arr[i] = "<td>"+arr[i].join("</td><td>")+"</td>";
    }
    tbody.innerHTML = "<tr>"+arr.join("</tr><tr>")+"</tr>";
    arrMetric = null;
}