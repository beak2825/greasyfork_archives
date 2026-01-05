// ==UserScript==
// @name       Codeskulptor Brython
// @namespace  http://mcimino.reaktix.com/
// @version    0.1
// @description  Add the Brython python interpreter to CodeSkulptor
// @match      http://www.codeskulptor.org/*
// @copyright  2012+, Saibotshamtul
// @downloadURL https://update.greasyfork.org/scripts/7395/Codeskulptor%20Brython.user.js
// @updateURL https://update.greasyfork.org/scripts/7395/Codeskulptor%20Brython.meta.js
// ==/UserScript==

function BrythonSetup(){
	__BRYTHON__.stdout={write:Sk.output};
	__BRYTHON__.stderr={write:Sk.debugout};
	__BRYTHON__.VFS.simplegui = [".js",Sk.builtinFiles.files['src/lib/simplegui/__init__.js']+";var $module=$builtinmodule;"];
	__BRYTHON__.VFS.simpleplot = [".js",Sk.builtinFiles.files['src/lib/simpleplot/__init__.js']+";var $module=$builtinmodule;"];
    
    brython({debug:1})
}

b = document.createElement("button")
b.id="runb"
b.accessKey="T"
b.title="Run using Brython (Accesskey T)"
b.className="tb-button-icon ui-button ui-widget ui-corner-all ui-button-icon-only ui-state-default"
b.style.cssText="background:#faa;border:1px solid #faa;"

$("#controls")[0].children[0].appendChild(b)

b.onmouseover=function(){
    runb.classList.remove("ui-state-default")
    runb.style.border="1px solid rgb(0,36,106)"
}
b.onmouseout=function(){
    runb.classList.add("ui-state-default")
    runb.style.border="1px solid #faa"
}
//b.onclick=function(){
//    brython(1)
//}
b.onfocus=function(){
    //this.onmouseout()
    runb.blur()
}
b.onblur=function(){
    //this.onmouseover()
}
a = document.createElement("span")
a.className="ui-button-icon-primary ui-icon ui-icon-play"
b.appendChild(a)

a = document.createElement("span")
a.className="ui-button-text"
b.appendChild(a)

//$("#controls")[0].children[0].appendChild(b)

a = document.createElement("script")
a.type="text/python"
a.id="brycode"
//c = "from browser import alert;alert('hi');"

c = (function(){/*
from browser import document,alert
import traceback

def runcode(ev):
    document["reset"].click()

    a = ""
    b=document.get(selector=".CodeMirror-code div pre")
    for z in range(len(b)):
        c=b[z].innerText
        a+=c+"\n"
    #print(a)
    try:
        eval(a)
    except:
        try:
            exec(a)
        except:
            traceback.print_exc()

document['runb'].bind('click',runcode)
*/}).toString().slice(14,-3)
a.innerHTML = c
document.body.appendChild(a)

$.getScript("http://brython.info/src/brython_dist.js",BrythonSetup)
