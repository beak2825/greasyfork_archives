// ==UserScript==
// @name       hnust jiaowu
// @namespace  211.67.208.43:3000
// @version    0.2
// @description  解决湖南科技大学教务网不能兼容Chrome和Firefox浏览器的问题
// @match      http://kdjw.hnust.cn/kdjw/framework/main.jsp
// @copyright  2014+, You

// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/5616/hnust%20jiaowu.user.js
// @updateURL https://update.greasyfork.org/scripts/5616/hnust%20jiaowu.meta.js
// ==/UserScript==

function new_send_request(url,SystemBh) 
{
    http_request = false; 
    if(window.XMLHttpRequest) 
    { //for FF or chrome , safari
        http_request = new XMLHttpRequest(); 
        if (http_request.overrideMimeType)
        { 
            http_request.overrideMimeType("text/xml"); 
        } 
    } 
    else
    {// code for IE6, IE5
        http_request=new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (!http_request) 
    { 
        window.alert("不能创建对象!"); 
        return false; 
    }
    
    try 
    {
        http_request.open("POST",url, false); 
        
        http_request.setRequestHeader("CONTENT-TYPE","application/x-www-form-urlencoded");
        
        http_request.send(null); 
        
        var tmpxml = http_request.responseXML;
        //console.log(tmpxml)
        //加载顶层菜单开始
        //var topXml = tmpxml.selectNodes("/Menus/topMenus/Menu");
        var topXml = tmpxml.getElementsByTagName("Menus")[0].getElementsByTagName('topMenus')[0].getElementsByTagName('Menu');
        //console.log(topXml.length)
        for(i=0;i<topXml.length;i++)
        {
            topMenuItems[topMenuLength] = new Array();
            topMenuItems[topMenuLength][0] = topXml[i].getAttribute("parentid");
            //console.log(topXml[i].getAttribute("parentid"));
            topMenuItems[topMenuLength][1] = SystemBh + "_" + topXml[i].getAttribute("id");
            //console.log(topXml[i].getAttribute("id"));
            topMenuItems[topMenuLength][2] = topXml[i].getAttribute("name");
            topMenuItems[topMenuLength][3] = topXml[i].getAttribute("title");
            topMenuItems[topMenuLength][4] = topXml[i].getAttribute("path");
            topMenuItems[topMenuLength][5] = topXml[i].getAttribute("imageUrl");
            topMenuItems[topMenuLength][6] = topXml[i].getAttribute("defaultPage");
            topMenuLength++;
        }
        //console.log(topMenuItems)
        //加载顶层菜单结束
        
        //加载一层菜单开始
        
        //var menuXml = tmpxml.selectNodes("/Menus/Level1Menus/Menu");
        var menuXml = tmpxml.getElementsByTagName("Menus")[0].getElementsByTagName('Level1Menus')[0].getElementsByTagName('Menu');
        for(i=0;i<menuXml.length;i++)
        {
            menuItems[menuLength] = new Array();
            menuItems[menuLength][0] = SystemBh + "_" + menuXml[i].getAttribute("parentid");
            menuItems[menuLength][1] = SystemBh + "_" + menuXml[i].getAttribute("id");
            menuItems[menuLength][2] = menuXml[i].getAttribute("name");
            menuItems[menuLength][3] = menuXml[i].getAttribute("title");
            menuItems[menuLength][4] = menuXml[i].getAttribute("path");
            menuItems[menuLength][5] = menuXml[i].getAttribute("imageUrl");
            menuLength++;
        }
        
        //加载一层菜单结束
        
        //加载二层菜单开始
        // var linkXml = tmpxml.selectNodes("/Menus/Level2Menus/Menu");
        var linkXml = tmpxml.getElementsByTagName("Menus")[0].getElementsByTagName('Level2Menus')[0].getElementsByTagName('Menu');
        for(i=0;i<linkXml.length;i++)
        {
            linkItems[linkLength] = new Array();
            linkItems[linkLength][0] = SystemBh + "_" + linkXml[i].getAttribute("parentid");
            linkItems[linkLength][1] = SystemBh + "_" + linkXml[i].attributes.getNamedItem("id");
            linkItems[linkLength][2] = linkXml[i].getAttribute("name");
            linkItems[linkLength][3] = linkXml[i].getAttribute("title");
            linkItems[linkLength][4] = linkXml[i].getAttribute("path");
            linkItems[linkLength][5] = linkXml[i].getAttribute("imageUrl");
            linkLength++;
        }
        
        //加载二层菜单结束
        
    }
    catch(eii)
    {alert("加载编号为"+SystemBh+"的应用系统失败，可能是网络延迟问题！");}
    
} 



//var oldFunction = unsafeWindow.send_request;
unsafeWindow.send_request = new_send_request;

