// ==UserScript==
// @name          Great GPA For ZJU JWBINFOSYS
// @namespace     http://zzeyu.com
// @description   麻麻再也不用担心我的GPA
// @include       http://jwbinfosys.zju.edu.cn/*


// @version 0.0.1.20150410032319
// @downloadURL https://update.greasyfork.org/scripts/9119/Great%20GPA%20For%20ZJU%20JWBINFOSYS.user.js
// @updateURL https://update.greasyfork.org/scripts/9119/Great%20GPA%20For%20ZJU%20JWBINFOSYS.meta.js
// ==/UserScript==
var tab = document.getElementById("DataGrid1");  //找到这个表格
var rows = tab.rows;               //取得这个table下的所有行
for(var i=1;i<rows.length;i++)
{
   for(var j=0;j<rows[i].cells.length;j++)
   {   
     if(j!=2 && j!=4 && j!=5) continue;
     var cell=rows[i].cells[j];
     if(j==2) cell.innerHTML="100";
     if(j==4) cell.innerHTML="5";
	 if(j==5) cell.innerHTML="&nbsp";
   }
}
