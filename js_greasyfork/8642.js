// ==UserScript==
// @name        OpenVBXLibNamer
// @namespace   none.com
// @description OpenVBX - Name Library Recordings
// @include     http://elitecallcenter.com/ivr/*
// @version     1
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/8642/OpenVBXLibNamer.user.js
// @updateURL https://update.greasyfork.org/scripts/8642/OpenVBXLibNamer.meta.js
// ==/UserScript==

window.onload = function () {

    (function(J,r,f){function s(a,b,d){a.addEventListener?a.addEventListener(b,d,!1):a.attachEvent("on"+b,d)}function A(a){if("keypress"==a.type){var b=String.fromCharCode(a.which);a.shiftKey||(b=b.toLowerCase());return b}return h[a.which]?h[a.which]:B[a.which]?B[a.which]:String.fromCharCode(a.which).toLowerCase()}function t(a){a=a||{};var b=!1,d;for(d in n)a[d]?b=!0:n[d]=0;b||(u=!1)}function C(a,b,d,c,e,v){var g,k,f=[],h=d.type;if(!l[a])return[];"keyup"==h&&w(a)&&(b=[a]);for(g=0;g<l[a].length;++g)if(k=
    l[a][g],!(!c&&k.seq&&n[k.seq]!=k.level||h!=k.action||("keypress"!=h||d.metaKey||d.ctrlKey)&&b.sort().join(",")!==k.modifiers.sort().join(","))){var m=c&&k.seq==c&&k.level==v;(!c&&k.combo==e||m)&&l[a].splice(g,1);f.push(k)}return f}function K(a){var b=[];a.shiftKey&&b.push("shift");a.altKey&&b.push("alt");a.ctrlKey&&b.push("ctrl");a.metaKey&&b.push("meta");return b}function x(a,b,d,c){m.stopCallback(b,b.target||b.srcElement,d,c)||!1!==a(b,d)||(b.preventDefault?b.preventDefault():b.returnValue=!1,b.stopPropagation?
    b.stopPropagation():b.cancelBubble=!0)}function y(a){"number"!==typeof a.which&&(a.which=a.keyCode);var b=A(a);b&&("keyup"==a.type&&z===b?z=!1:m.handleKey(b,K(a),a))}function w(a){return"shift"==a||"ctrl"==a||"alt"==a||"meta"==a}function L(a,b,d,c){function e(b){return function(){u=b;++n[a];clearTimeout(D);D=setTimeout(t,1E3)}}function v(b){x(d,b,a);"keyup"!==c&&(z=A(b));setTimeout(t,10)}for(var g=n[a]=0;g<b.length;++g){var f=g+1===b.length?v:e(c||E(b[g+1]).action);F(b[g],f,c,a,g)}}function E(a,b){var d,
    c,e,f=[];d="+"===a?["+"]:a.split("+");for(e=0;e<d.length;++e)c=d[e],G[c]&&(c=G[c]),b&&"keypress"!=b&&H[c]&&(c=H[c],f.push("shift")),w(c)&&f.push(c);d=c;e=b;if(!e){if(!p){p={};for(var g in h)95<g&&112>g||h.hasOwnProperty(g)&&(p[h[g]]=g)}e=p[d]?"keydown":"keypress"}"keypress"==e&&f.length&&(e="keydown");return{key:c,modifiers:f,action:e}}function F(a,b,d,c,e){q[a+":"+d]=b;a=a.replace(/\s+/g," ");var f=a.split(" ");1<f.length?L(a,f,b,d):(d=E(a,d),l[d.key]=l[d.key]||[],C(d.key,d.modifiers,{type:d.action},
    c,a,e),l[d.key][c?"unshift":"push"]({callback:b,modifiers:d.modifiers,action:d.action,seq:c,level:e,combo:a}))}var h={8:"backspace",9:"tab",13:"enter",16:"shift",17:"ctrl",18:"alt",20:"capslock",27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"ins",46:"del",91:"meta",93:"meta",224:"meta"},B={106:"*",107:"+",109:"-",110:".",111:"/",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"},H={"~":"`","!":"1",
    "@":"2","#":"3",$:"4","%":"5","^":"6","&":"7","*":"8","(":"9",")":"0",_:"-","+":"=",":":";",'"':"'","<":",",">":".","?":"/","|":"\\"},G={option:"alt",command:"meta","return":"enter",escape:"esc",mod:/Mac|iPod|iPhone|iPad/.test(navigator.platform)?"meta":"ctrl"},p,l={},q={},n={},D,z=!1,I=!1,u=!1;for(f=1;20>f;++f)h[111+f]="f"+f;for(f=0;9>=f;++f)h[f+96]=f;s(r,"keypress",y);s(r,"keydown",y);s(r,"keyup",y);var m={bind:function(a,b,d){a=a instanceof Array?a:[a];for(var c=0;c<a.length;++c)F(a[c],b,d);return this},
    unbind:function(a,b){return m.bind(a,function(){},b)},trigger:function(a,b){if(q[a+":"+b])q[a+":"+b]({},a);return this},reset:function(){l={};q={};return this},stopCallback:function(a,b){return-1<(" "+b.className+" ").indexOf(" mousetrap ")?!1:"INPUT"==b.tagName||"SELECT"==b.tagName||"TEXTAREA"==b.tagName||b.isContentEditable},handleKey:function(a,b,d){var c=C(a,b,d),e;b={};var f=0,g=!1;for(e=0;e<c.length;++e)c[e].seq&&(f=Math.max(f,c[e].level));for(e=0;e<c.length;++e)c[e].seq?c[e].level==f&&(g=!0,
    b[c[e].seq]=1,x(c[e].callback,d,c[e].combo,c[e].seq)):g||x(c[e].callback,d,c[e].combo);c="keypress"==d.type&&I;d.type!=u||w(a)||c||t(b);I=g&&"keydown"==d.type}};J.Mousetrap=m;"function"===typeof define&&define.amd&&define(m)})(window,document);

    var addEventHandler = function (elem, eventType, handler) {
        if (elem.addEventListener) {
            elem.addEventListener(eventType, handler, false);
        }
        else if (elem.attachEvent) {
            elem.attachEvent('on' + eventType, handler);
        }
    };

    var removeOptions = function(selectbox){
        var i;
        for(i=selectbox.options.length-1;i>=0;i--)
            selectbox.remove(i);
    }

    var InputValues = [];
    var optExists = function (val) {
        o = InputValues.length;
        while (o--) {
            if (InputValues[o].value === val)
                return true;
        }
        return false;
    };

    var InputsLoaded = false;
    var checkInputs = function () {
        //window.alert("Checking Names");
        selects = document.getElementsByName('library');
        c = selects.length;
        while (c--) {
            options = selects[c].options;
            i = options.length;
            totalos = i;
            while (i--) {
                val = options[i].value;
                if(val === "") continue;
                text = options[i].text;
                if (false === optExists(val)) {
                    (function(totalos){
                        thisurl = "http://elitecallcenter.com/ivr/audio_names.php"+
                                    "?do=getName"+
                                    "&val=" + encodeURIComponent(val)+
                                    "&text=" + encodeURIComponent(text);
                        //window.alert(thisurl);
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: thisurl,
                            onload: function (response) {
                                //alert(response.responseText);
                                ix = InputValues.length;
                                resp = JSON.parse(response.responseText);
                                InputValues[ix] = resp;
                                if(ix === totalos){
                                    document.getElementById('nloading').style.display= "none";
                                    selebox = document.getElementById('allRecsgm');
                                    removeOptions(selebox);
                                    opt = document.createElement("option");
                                    opt.setAttribute("value", "");
                                    opt.text = "Choose Recording";
                                    selebox.appendChild(opt);
                                    while(ix--){
                                        opt = document.createElement("option");
                                        opt.setAttribute("value", InputValues[ix].value);
                                        opt.text = InputValues[ix].name;
                                        selebox.appendChild(opt);
                                    }
                                    var InputsLoaded = true;
                                }
                            }
                        });
                    })(totalos);
                }
            }
        }
    };

    var getTextByValue = function(val, text){
        o = InputValues.length;
        while (o--) {
            if (InputValues[o].value === val)
                return InputValues[o].name;
        }
        return text;
    };
    
    var setNames = function(){
        selects = document.getElementsByName('library');
        c = selects.length;
        while (c--) {
            options = selects[c].options;
            i = options.length;
            while (i--) {
                val = options[i].value;
                if(val === "") continue;
                z = options[i].text;
                options[i].text = getTextByValue(val, z);
            }
        }
    };

    var Menu = false;
    var Open = false;

    var createMenu = function () {
        Menu = document.createElement('div');
        Menu.setAttribute('style', 'position:fixed; z-index:99999; display:block; top:0; left:-250px; width:250px; height:100vh; margin:0; padding:0; background:#86C8E9;border-top-right-radius: 20px;border-bottom-right-radius: 20px;');
        bodies = document.getElementsByTagName('body');
        body = bodies[0];
        body.appendChild(Menu);
        mStr = '<div style="padding:1em;"><br><h2>OpenVBXLibNamer</h2><br><br>\
                           <hr><b><big>SELECT RECORDING TO EDIT NAME</big><span id="nloading" style="color:red;"><br>(Loading, wait...)</span></b><br>\
                           <select id="allRecsgm" name="library"></select>\
                           <div id="apbox" style="display:none;"><b>Recording:</b><br><audio id="applayer" style="width:90%; display:block; margin:0 auto;" src="http://elitecallcenter.com/ivr/recs/REba7316c2f3ed6176ba636c1f1036737d.mp3" controls preload="auto" autobuffer></audio></div>\
                           <div id="namebox" style="display:none"><b>Name:</b><br>\
                           <input style="width:90%; display:block; margin:0 auto;" type="text" id="selectedname">\
                           <button style="width:95%; display:block; margin:0 auto;" id="savename">Save Name</button></div>\
                            <hr><br><b>or...<br><br><hr><br><big>CLICK TO SHOW NAMES</big></b><br><button style="width:95%; display:block; margin:0 auto;" id="setnames">Load Names</button><hr>\
                        </div>';
        Menu.innerHTML = mStr;
        addEventHandler(document.getElementById('allRecsgm'), 'change', function(e){
            op = document.getElementById('allRecsgm');
            if(op.options[op.selectedIndex].value !== ""){
                document.getElementById('namebox').style.display="block";
                document.getElementById('selectedname').value = op.options[op.selectedIndex].text;
                document.getElementById('apbox').style.display="block";
                document.getElementById('applayer').setAttribute("src",op.options[op.selectedIndex].value);
            }else{
                document.getElementById('apbox').style.display="none";
                document.getElementById('namebox').style.display="none";
            }
        });
        addEventHandler(document.getElementById('setnames'), 'click', function(e){
            setNames();
        });
        addEventHandler(document.getElementById('savename'), 'click', function(e){
            op = document.getElementById('allRecsgm');
            SELINVAL = op.options[op.selectedIndex].value;
            SELIN = op.selectedIndex;
            NEWVAL = document.getElementById('selectedname').value;
            (function(SELIN, SELINVAL, NEWVAL){
                GM_xmlhttpRequest({
                method: "GET",
                url: "http://elitecallcenter.com/ivr/audio_names.php"+
                        "?do=saveName"+
                        "&val=" + encodeURIComponent(SELINVAL) +
                        "&text=" + encodeURIComponent(NEWVAL),
                onload: function (response) {
                    ix = InputValues.length;
                    resp = JSON.parse(response.responseText);
                    op = document.getElementById('allRecsgm');
                    op.options[SELIN].text = NEWVAL;
                }
                });
            })(SELIN, SELINVAL, NEWVAL);
        });
    };

    var openOpts = function () {
        if (Menu === false)
            createMenu();
        var left = 250;
        var openMenuInterval = setInterval(function () {
            left = left - 2;
            Menu.style.left = "-" + left + "px";
            if (left === 0) {
                clearInterval(openMenuInterval);
                Open = true;
            }
        }, 1);
    };

    var closeOpts = function () {
        if (Menu === false)
            createMenu();
        var left = 0;
        var closeMenuInterval = setInterval(function () {
            left = left + 2;
            Menu.style.left = "-" + left + "px";
            if (left === 250) {
                clearInterval(closeMenuInterval);
                Open = false;
            }
        }, 1);
    };



    Mousetrap.bind('shift+n', function (e) {
        if(InputsLoaded === false)
            checkInputs();
        else
            window.alert('loaded already');
        if (!Open)
            openOpts();
        else
            closeOpts();
    });
};
