// ==UserScript==
// @name         MegaHelper
// @namespace    http://tampermonkey.net/
// @version      20251209
// @description  Helper to choose best Mega Evolution for Pokemon Go Events.
// @author       MichaelWingull
// @match        https://leekduck.com/events/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leekduck.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557230/MegaHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/557230/MegaHelper.meta.js
// ==/UserScript==

const variants = {
  "Galarian": "_GALARIAN",
  "Alolan": "_ALOLA",
  "Hisuian": "_HISUIAN"
}

const hiddenBoosts = {
  "GROUDON_PRIMAL": ["POKEMON_TYPE_GRASS"],
  "KYOGRE_PRIMAL": ["POKEMON_TYPE_ELECTRIC", "POKEMON_TYPE_BUG"],
  "RAYQUAZA_MEGA": ["POKEMON_TYPE_PSYCHIC"]
}

//ignore megas with less than MIN_BOOST boosts
const MIN_BOOST = 2

var eventSpawns

// This whole section is grabbed from https://code.google.com/p/jsonpath/
// Not sure if i can load it a better way

function jsonPath(obj, expr, arg) {
   var P = {
      resultType: arg && arg.resultType || "VALUE",
      result: [],
      normalize: function(expr) {
         var subx = [];
         return expr.replace(/[\['](\??\(.*?\))[\]']/g, function($0,$1){return "[#"+(subx.push($1)-1)+"]";})
                    .replace(/'?\.'?|\['?/g, ";")
                    .replace(/;;;|;;/g, ";..;")
                    .replace(/;$|'?\]|'$/g, "")
                    .replace(/#([0-9]+)/g, function($0,$1){return subx[$1];});
      },
      asPath: function(path) {
         var x = path.split(";"), p = "$";
         for (var i=1,n=x.length; i<n; i++)
            p += /^[0-9*]+$/.test(x[i]) ? ("["+x[i]+"]") : ("['"+x[i]+"']");
         return p;
      },
      store: function(p, v) {
         if (p) P.result[P.result.length] = P.resultType == "PATH" ? P.asPath(p) : v;
         return !!p;
      },
      trace: function(expr, val, path) {
         if (expr) {
            var x = expr.split(";"), loc = x.shift();
            x = x.join(";");
            if (val && val.hasOwnProperty(loc))
               P.trace(x, val[loc], path + ";" + loc);
            else if (loc === "*")
               P.walk(loc, x, val, path, function(m,l,x,v,p) { P.trace(m+";"+x,v,p); });
            else if (loc === "..") {
               P.trace(x, val, path);
               P.walk(loc, x, val, path, function(m,l,x,v,p) { typeof v[m] === "object" && P.trace("..;"+x,v[m],p+";"+m); });
            }
            else if (/,/.test(loc)) { // [name1,name2,...]
               for (var s=loc.split(/'?,'?/),i=0,n=s.length; i<n; i++)
                  P.trace(s[i]+";"+x, val, path);
            }
            else if (/^\(.*?\)$/.test(loc)) // [(expr)]
               P.trace(P.eval(loc, val, path.substr(path.lastIndexOf(";")+1))+";"+x, val, path);
            else if (/^\?\(.*?\)$/.test(loc)) // [?(expr)]
               P.walk(loc, x, val, path, function(m,l,x,v,p) { if (P.eval(l.replace(/^\?\((.*?)\)$/,"$1"),v[m],m)) P.trace(m+";"+x,v,p); });
            else if (/^(-?[0-9]*):(-?[0-9]*):?([0-9]*)$/.test(loc)) // [start:end:step]  phyton slice syntax
               P.slice(loc, x, val, path);
         }
         else
            P.store(path, val);
      },
      walk: function(loc, expr, val, path, f) {
         if (val instanceof Array) {
            for (var i=0,n=val.length; i<n; i++)
               if (i in val)
                  f(i,loc,expr,val,path);
         }
         else if (typeof val === "object") {
            for (var m in val)
               if (val.hasOwnProperty(m))
                  f(m,loc,expr,val,path);
         }
      },
      slice: function(loc, expr, val, path) {
         if (val instanceof Array) {
            var len=val.length, start=0, end=len, step=1;
            loc.replace(/^(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)$/g, function($0,$1,$2,$3){start=parseInt($1||start);end=parseInt($2||end);step=parseInt($3||step);});
            start = (start < 0) ? Math.max(0,start+len) : Math.min(len,start);
            end   = (end < 0)   ? Math.max(0,end+len)   : Math.min(len,end);
            for (var i=start; i<end; i+=step)
               P.trace(i+";"+expr, val, path);
         }
      },
      eval: function(x, _v, _vname) {
         try { return $ && _v && eval(x.replace(/@/g, "_v")); }
         catch(e) { throw new SyntaxError("jsonPath: " + e.message + ": " + x.replace(/@/g, "_v").replace(/\^/g, "_a")); }
      }
   };

   var $ = obj;
   if (expr && obj && (P.resultType == "VALUE" || P.resultType == "PATH")) {
      P.trace(P.normalize(expr).replace(/^\$;/,""), obj, "$");
      return P.result.length ? P.result : false;
   }
}

// default stolen block on how to get data
// maybe cooler to get it with await

var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};

async function loadPokeData(){
    // was planning to cache the data into local browser string variable but i got fartbuckled
    // by JS callback hell only giving me promises instead of just the god dang string
    getJSON('https://pokemon-go-api.github.io/pokemon-go-api/api/pokedex.json',
            function(err, data) {
        if (err !== null) {
            alert('Something went wrong: ' + err);
        } else {
            processPokeData(data)
        }
    });
}

function checkTypes(currentMega, types){
    if (types.includes(currentMega.primaryType.type) ||
        currentMega.secondaryType != null && types.includes(currentMega.secondaryType.type) ||
        hiddenBoosts.hasOwnProperty(currentMega.id) && types.includes(hiddenBoosts[currentMega.id])
    ) {
        return true
    }
    return false
}

function processPokeData(data) {
    eventSpawns = getEventSpawns(data)
    var megaMatches = []
    var megas = jsonPath(data, "$[*].megaEvolutions.*")
    for (var i = 0; i < megas.length; ++i) {
        var hits = []
        for (var j = 0; j < eventSpawns.length; ++j) {
            if (checkTypes(megas[i], eventSpawns[j].types)) {
                hits.push(eventSpawns[j])
            }
        }
        if (hits.length>=MIN_BOOST) {
            megaMatches.push({
                name: megas[i].names.English,
                hits: hits
            })
        }

    }
    megaMatches.sort(function(a, b){
        return b.hits.length-a.hits.length
    })
    insertHTML(megaMatches)
}

function insertHTML(megaMatches) {
    //this is a complete hacky mess for the proof of concept
    var p = document.getElementById("spawns").nextSibling.nextSibling;
    p.innerHTML=""
    var list = document.createElement("ul")
    p.appendChild(list)
    for (var i = 0; i < megaMatches.length; ++i) {
        var item = document.createElement("li")
        item.appendChild(document.createTextNode(megaMatches[i].hits.length + " " + megaMatches[i].name))
        item.style["list-style-type"] = "none"
        item.style.float = "left"
        item.style.border = "1px solid black"
        item.style.margin = "2px"
        item.match = megaMatches[i]
        list.appendChild(item)
        item.onmouseover = function(){
            this.style["background-color"] = "grey"
            for (var j = 0; j < this.match.hits.length; ++j) {
                highLight(this.match.hits[j].listElement)
            }
        };
        item.onmouseout = function(){
             this.style.removeProperty("background-color")
            for (var j = 0; j < this.match.hits.length; ++j) {
                downLight(this.match.hits[j].listElement)
            }
        };
    }
    var breaker = document.createElement("p");
    breaker.style.display = "block";
    breaker.style.clear = "both";
    p.appendChild(breaker)
}

function getFormId(name) {
  var formId = name.toUpperCase().replace("-","_");
  var isVariant = false
  for (const [key, value] of Object.entries(variants)) {
    if (name.startsWith(key)) {
      formId = formId.slice(key.length+1)+value
      isVariant = true
    }
  }
  return [formId, isVariant]
}

function getPkmnNamesFromUL(list, data) {
    var items = list.getElementsByTagName("li");
    var result = []
    for (var i = 0; i < items.length; ++i) {
        var name = items[i].getElementsByClassName("pkmn-name")[0].innerText
        const [formId, isVariant] = getFormId(name)

        var jPath = isVariant ? "$.[?(@.formId=='"+formId+"')]" : "$[?(@.formId=='"+formId+"')]"
        console.log(jPath)
        var pkmn = jsonPath(data, jPath)[0]
        var types = [pkmn.primaryType.type]

        if (pkmn.secondaryType != null) {
            types.push(pkmn.secondaryType.type);
        }

        result.push({
            name: name,
            listElement: items[i],
            types: types
        })
    }
    return result
}

function getEventSpawns(data){
    var xpath = '//h2[@id="spawns"]/following-sibling::h2[contains(@class, "event-section-header")][1]/preceding-sibling::ul[count(.|//h2[@id="spawns"]/following-sibling::ul) = count(//h2[@id="spawns"]/following-sibling::ul)]';
    var nodes = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null)
    var result = nodes.iterateNext();
    var eventSpawns = []
    while (result) {
        eventSpawns = eventSpawns.concat(getPkmnNamesFromUL(result, data))
        result = nodes.iterateNext();
    }
    return eventSpawns
}

function highLight(element) {
    var nameElement = element.getElementsByClassName("pkmn-name")[0]
    nameElement.style["font-weight"] = "bolder";
    nameElement.style.color= "antiquewhite";
    nameElement.style["text-shadow"] = "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000";
    var imgElement = element.childNodes[0].style["background-color"] = "red";
}

function downLight(element) {
    var nameElement = element.getElementsByClassName("pkmn-name")[0]
    nameElement.style.removeProperty("font-weight")
    nameElement.style.removeProperty("color");
    nameElement.style.removeProperty("text-shadow")
    element.childNodes[0].style.removeProperty("background-color")
}

(function() {
    'use strict';
    loadPokeData();
})();