// ==UserScript==
// @name        FS Economy Enhancement
// @author      Niels Huylebroeck
// @namespace   nightwalkers
// @description Improvements for FS Economy usability
// @include     http://server.fseconomy.net/*
// @include     http://server.fseconomy.net:81/*
// @include     http://www.fseconomy.net:81/*
// @include     http://server.fseconomy.org/*
// @include     https://server.fseconomy.net/*
// @include     https://server.fseconomy.net:81/*
// @include     https://www.fseconomy.net:81/*
// @include     https://server.fseconomy.org/*
// @version     12
// @grant       none
// @update      https://greasyfork.org/scripts/7054-fs-economy-enhancement/code/FS%20Economy%20Enhancement.user.js
// @downloadURL https://update.greasyfork.org/scripts/7054/FS%20Economy%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/7054/FS%20Economy%20Enhancement.meta.js
// ==/UserScript==

function check_table_valid(table) {
    if (table.classList.contains('assigmentTable')) return true;
    if (table.classList.contains('assignmentTable')) return true;
    if (table.classList.contains('holdTable')) return true;
    return false;
}

var tables = document.getElementsByTagName('table');
for (var i = 0; i < tables.length; i++) {
    var table = tables[i];
    if (!check_table_valid(table)) continue;
    // Poor man's jQuery
    console.debug('Table found', table);

    // Adding column header
    var col_head = document.createElement('th');
    col_head.textContent = 'Price per nm/qty';
    table.rows[0].appendChild(col_head);

    var col_pay, col_nm, col_cargo;
    for (var x = 0; x < table.rows.length; x++) {
        var row = table.rows[x];
        if (x == 0) {
            // Parsing the first row (header) to find relevant column numbers
            for (var y = 0; y < row.cells.length; y++) {
                var cell = row.cells[y];
                // Find the table headings
                if (cell.textContent.indexOf('Pay') == 0) {
                    console.debug('Payment is in column', y);
                    col_pay = y;
                }
                if (cell.textContent.indexOf('NM') == 0) {
                    console.debug('Distance is in column', y);
                    col_nm = y;
                }
                if (cell.textContent.indexOf('Cargo') == 0) {
                    console.debug('Cargo is in column', y);
                    col_cargo = y;
                }
            }
            if (col_pay === undefined || col_nm == undefined || col_cargo == undefined) {
                console.error('Unable to find column headers:', col_pay, col_nm, col_cargo);
                break;
            }
        } else {
            var qty = 1, range, price, cargo = false, calc = 0, rounding = 2;
            try {
                if (row.cells[col_cargo].textContent.search(/(\d+) .*$/) != -1) {
                    qty = row.cells[col_cargo].textContent.match(/(\d+) .*$/)[1];
                }
                if (row.cells[col_cargo].textContent.search(/kg$/) != -1) {
                    qty = row.cells[col_cargo].textContent.match(/(\d+)kg$/)[1];
                    cargo = true;
                }
            } catch (e) {
                console.log(e, row.cells[col_cargo.textContent]);
            }
            qty = parseFloat(qty || 1);
            if (cargo) {
                // 77 Kg per person
                console.debug(qty,'kg of cargo counts for', Math.ceil(qty/77), 'persons');
                qty = Math.ceil(qty / 77);
                row.cells[col_cargo].textContent += ' (' + qty + ' passengers)';
            }
            range = parseFloat(row.cells[col_nm].textContent);
            price = parseFloat(row.cells[col_pay].textContent.replace('$', '').replace(',',''));

            if (qty && range && price) {
                while (calc === 0) {
                    calc = Math.round( (price / qty / range) * Math.pow(10, rounding) ) / Math.pow(10, rounding);
                    rounding++;
                }
            } else {
                calc = NaN;
            }

            new_cell = document.createElement('td');
            new_cell.textContent = '$'+calc.toString();
            new_cell.setAttribute('class','numeric');
            row.appendChild(new_cell);
        }
    }

    if (typeof jQuery !== 'undefined') {
        jQuery(table).trigger('updateAll');
    }
}
