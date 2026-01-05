// ==UserScript==
// @name         housejoy print script
// @namespace    http://admin.housejoy.in/get-open-jobs
// @version      0.1
// @description  enter something useful
// @author       Chanakya Gujju (gujju.chanakya@gmail.com)
// @match        http://admin.housejoy.in/get-open-jobs
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9574/housejoy%20print%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/9574/housejoy%20print%20script.meta.js
// ==/UserScript==


function my_print(id) {
    console.log("Print on this called - "+id);
    console.log(id);

    var divToPrint=document.getElementById(id);
    newWin= window.open("");
    newWin.document.write(divToPrint.outerHTML);
    newWin.print();
    newWin.close();
}

var table = document.getElementsByClassName("table table-hover table-striped");

var rows = document.getElementsByTagName("tr");

console.log(table[0]);

console.log(table[0].rows[1]);

var one_row = (table[0].rows[2]).getElementsByTagName("td");

console.log(one_row);

console.log(one_row[1].innerText);

for(var i = 1; i<(rows.length); i++) {
    var table_rem = (i-1)%100;
    var row_rem = (i-1)%10;
    var table_row;
    var table_id;
    var new_table;
    if(table_rem == 0){

        document.body.appendChild(document.createElement("br"));
        table_id = i;
        new_table = document.createElement("TABLE");
        new_table.align = "center";
        new_table.border = 1;
        new_table.setAttribute("id", table_id);
        document.body.appendChild(new_table);

        insrow = new_table.insertRow(0);
        var cell1 = insrow.insertCell(0);
        var btn = document.createElement('button');
        var t = document.createTextNode("PRINT");
        btn.id = table_id;
        btn.appendChild(t);
        btn.addEventListener('click', function(e) {
            console.log(this.parentNode.id);
            console.log(this.id);
            my_print(this.id);
        }, false);
        cell1.appendChild(btn);        

        table_row = table_id+i
        var y = document.createElement("TR");
        y.setAttribute("id", table_row);
        document.getElementById(table_id).appendChild(y);
        var z = document.createElement("TD");

        var one_row = (table[0].rows[i]).getElementsByTagName("td");
        var text = one_row[1].innerText

        var t = document.createTextNode(text);
        z.appendChild(t);
        document.getElementById(table_row).appendChild(z);

    } else {
        if(row_rem == 0) {
            table_row = table_id+i
            var y = document.createElement("TR");
            y.setAttribute("id", table_row);
            document.getElementById(table_id).appendChild(y);
            var z = document.createElement("TD");

            var one_row = (table[0].rows[i]).getElementsByTagName("td");
            var text = one_row[1].innerText

            var t = document.createTextNode(text);
            z.appendChild(t);
            document.getElementById(table_row).appendChild(z);
        } else {
            var z = document.createElement("TD");

            var one_row = (table[0].rows[i]).getElementsByTagName("td");
            var text = one_row[1].innerText

            var t = document.createTextNode(text);
            z.appendChild(t);
            document.getElementById(table_row).appendChild(z);
        }
    }
}


