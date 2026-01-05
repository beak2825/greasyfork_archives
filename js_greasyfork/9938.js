// ==UserScript==
// @name      HV Potion bar
// @namespace  Potionbar
// @version    0.82.0
// @description  吃药
// @match      http://hentaiverse.org/?s=Battle*
// @copyright  2015, ggxxsol
// @downloadURL https://update.greasyfork.org/scripts/9938/HV%20Potion%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/9938/HV%20Potion%20bar.meta.js
// ==/UserScript==
if (!document.getElementById("togpane_log"))return
if (document.querySelector(".btcp"))return
function itembar(itemno)
{
    if(tempb=document.getElementById('ikey_'+(itemno*1+1)))return tempb;
    else return false;
}
array = ['HPD', 'HP', 'MPD','MP','SPD','SP'];    //可修改名称,最多就六个,对应1-6的药水
array1 = ['green', 'green', 'blue','blue','red','red'];//可修改颜色,最多就六个
for (var i = 0; i < 6 ; i++ )
{
    ccc = document.createElement('div');
    ccc.style.cssText = "font-size:15pt;line-height:2.5;color:"+array1[i]+";z-index:100;width: 50px;height: 45px;position:absolute;left:"+(500+i*60)+"px;top:5px"//可调整位置
    ccc.innerHTML=array[i]
    if(itembar(i))
    {
        ccc.value=i*1+1
        ccc.onclick=function(){document.getElementById('ikey_'+this.value).onclick()}
        ccc.onmouseover=function(){this.style.background='rgba(63,237,208,0.50)'}
        ccc.onmouseout=function(){this.style.background=''}
        ccc.style.cursor='pointer'
    }
    else
    {
        ccc.style.background="white"
    }
    document.body.appendChild(ccc);
}