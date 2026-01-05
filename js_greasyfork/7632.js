// ==UserScript==
// @name       Bupt GPA Clac
// @namespace  http://edward-zhu.github.io/
// @version    0.3
// @description  a avg score calculator for bupt students.
// @match      http://jwxt.bupt.edu.cn/gradeLnAllAction.do?type=ln&oper=qbinfo*
// @match      http://jwxt.bupt.edu.cn/gradeLnAllAction.do?type=ln&oper=fainfo*
// @match      http://jwxt.bupt.edu.cn/bxqcjcxAction.do*
// @copyright  2015, Edward Zhu
// @downloadURL https://update.greasyfork.org/scripts/7632/Bupt%20GPA%20Clac.user.js
// @updateURL https://update.greasyfork.org/scripts/7632/Bupt%20GPA%20Clac.meta.js
// ==/UserScript==
function getScores() {
	var scores = [];
    var point = 0;
   	rows = document.getElementsByClassName("odd");
    for (i = 0; i < rows.length; i++) {
        cells = rows[i].cells;
        if (cells[6].textContent.trim() == "免修") {
            continue;
        }
        point_str = cells[4].textContent.trim();
        if (point_str.indexOf(".") == -1) {
  			point = parseInt(point_str) * 10;      
        }
        else {
        	tmp = point_str.split(".");
        	point = parseInt(tmp.join(""));
        }
        scores.push({
            "course" : cells[2].textContent.trim(),
            "point" : point,
            "score" : parseInt(cells[6].textContent)
        });
        
    }
    
    var sum = 0.0;
    var pointSum = 0;
    
    for (i = 0; i < scores.length; i++) {
        pointSum += scores[i].point;
        sum = sum + scores[i].score * scores[i].point;
    }
    
    var avgScore = (sum / pointSum).toFixed(2);
    
    var node = document.createElement("span");
    node.setAttribute("style", "font-size: 14px; color: #5EEF80; ");
    node.innerHTML = "平均成绩 = " + avgScore;
    document.getElementsByTagName("body")[0].insertBefore(node, document.getElementsByTagName("body")[0].childNodes[0]);
    
    console.log("total courses: " + scores.length);
    console.log("sum = " + sum + " pointSum = " + pointSum + " avg = " + (sum / pointSum));
}

window.addEventListener('load', function() {
    window.setTimeout(function() { getScores(); }, 500);
     },
	true);
