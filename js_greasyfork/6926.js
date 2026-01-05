// ==UserScript==
// @name         Rainbow Text
// @version      1.1
// @description  Make text into rainbow
// @namespace    awkward_potato:3
// @include      https://forums.oneplus.net/threads/*
// @include      https://forums.oneplus.net/conversations/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/6926/Rainbow%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/6926/Rainbow%20Text.meta.js
// ==/UserScript==

function tohex(decval) {
    var l, h;
    var str = "";
    l = Math.floor(decval % 16);
    h = Math.floor(decval / 16);
    if (h < 10) {
        str = "" + h;
    }
    if (h > 9) {
        switch (h) {
            case 10:
                str = "A";
                break;
            case 11:
                str = "B";
                break;
            case 12:
                str = "C";
                break;
            case 13:
                str = "D";
                break;
            case 14:
                str = "E";
                break;
            case 15:
                str = "F";
                break;
            default:
                str = "X";
                break;
        }
    }
    if (l < 10) {
        str = str + "" + l;
    }
    if (l > 9) {
        switch (l) {
            case 10:
                str += "A";
                break;
            case 11:
                str += "B";
                break;
            case 12:
                str += "C";
                break;
            case 13:
                str += "D";
                break;
            case 14:
                str += "E";
                break;
            case 15:
                str += "F";
                break;
            default:
                str += "X";
                break;
        }
    }
    return str;
}

function todec(hexval) {
    var l, h;
    hexstr = new String(hexval).toUpperCase();
    switch (hexstr.charAt(0)) {
        case "A":
            h = 10;
            break;
        case "B":
            h = 11;
            break;
        case "C":
            h = 12;
            break;
        case "D":
            h = 13;
            break;
        case "E":
            h = 14;
            break;
        case "F":
            h = 15;
            break;
        default:
            h = eval(hexstr.charAt(0));
    }
    switch (hexstr.charAt(1)) {
        case "A":
            l = 10;
            break;
        case "B":
            l = 11;
            break;
        case "C":
            l = 12;
            break;
        case "D":
            l = 13;
            break;
        case "E":
            l = 14;
            break;
        case "F":
            l = 15;
            break;
        default:
            l = eval(hexstr.charAt(1));
    }
    return l + 16 * h;
}

function hexToRGB(hexval) {
    str = new String(hexval).toUpperCase();
    if (str.charAt(0) == "#") str = str.substr(1);
    g_r = todec(str.substr(0, 2));
    g_g = todec(str.substr(2, 2));
    g_b = todec(str.substr(4, 2));
}

function getSFXColor(k) {
    var r, g, b, k1, min, max;
    //if (g_cstyle == 0) {
    k1 = k;
    r = 127 + 127 * Math.cos(k1 - .5);
    g = 127 + 127 * Math.cos(k1 - 2.5);
    b = 127 + 127 * Math.cos(k1 - 4.5);
    min = r;
    if (g < min) min = g;
    if (b < min) min = b;
    r -= min;
    g -= min;
    b -= min;
    max = r;
    if (g > max) max = g;
    if (b > max) max = b;
    max = 255.0 / max;
    r *= max;
    g *= max;
    b *= max;
    var tekBright = 200;
    var tekContrast = 255;
    max = (tekBright / 255) * (tekContrast / 255);
    min = (255 - tekContrast) * (tekBright / 255);
    r = r * max + min;
    g = g * max + min;
    b = b * max + min;
    if (r < 0) r = 0;
    if (g < 0) g = 0;
    if (b < 0) b = 0;
    if (r > 255) r = 255;
    if (g > 255) g = 255;
    if (b > 255) b = 255;
    /*}
	if (g_cstyle == 1) {
		k -= Math.floor(k);
		r = r1 + k * dr;
		g = g1 + k * dg;
		b = b1 + k * db;
	}
	if (g_cstyle == 2) {
		k -= 2 * Math.floor(k / 2);
		if (k < 1) {
			r = r1 + k * dr;
			g = g1 + k * dg;
			b = b1 + k * db;
		}
		if (k >= 1) {
			k -= 2;
			r = r1 - k * dr;
			g = g1 - k * dg;
			b = b1 - k * db;
		}
	}
	if (g_cstyle == 3) {
		k -= 3 * Math.floor(k / 3);
		if (k < 1) {
			r = r1 + k * dr;
			g = g1 + k * dg;
			b = b1 + k * db;
		}
		if (k >= 1 && k < 2) {
			k -= 1;
			r = r2 + k * dr1;
			g = g2 + k * dg1;
			b = b2 + k * db1;
		}
		if (k >= 2) {
			k -= 2;
			r = r3 + k * dr2;
			g = g3 + k * dg2;
			b = b3 + k * db2;
		}
	}*/
    g_r = r;
    g_g = g;
    g_b = b;
}

function setOutSizeIndicator(divtext) {
    document.getElementById("charssub").setAttribute("id", "oldsub");
    var newdiv = document.createElement("div");
    newdiv.setAttribute("id", "charssub");
    var newtext = document.createTextNode(divtext);
    newdiv.appendChild(newtext);
    document.getElementById("chars").appendChild(newdiv);
    document.getElementById("chars").removeChild(document.getElementById("oldsub"));
}

function preview() {}

function MakeSFX(inputString, outputHTML) {
    var r, g, b;
    var i, j, k, l;
    var x, scale, res;
    var min, max;
    var in_tag = 0;
    var oignumi = 0;
    temp = new String("");
    var numreps = 1;//parseInt($("#gradient_repeat").val());
    if (numreps < 1) numreps = 1;
    if (numreps > 10) numreps = 10;
    instr = inputString;
    outstr = new String("");
    tempstr = new String("");
    res = 1;
    j = instr.length;
    //if (gradientType == "rainbow") {
    scale = Math.PI * (2 * eval(numreps) - .21) / j;
    g_cstyle = 0;
    /*}
	if (gradientType == "oneway") {
		scale = numreps / j;
		g_cstyle = 1;
	}
	if (gradientType == "backandforth") {
		scale = 2.0 * numreps / j;
		g_cstyle = 2;
	}
	if (gradientType == "tricolor") {
		scale = 3.0 * numreps / j;
		g_cstyle = 3;
	}
	if (gradientType == 'oneway' || gradientType == 'backandforth') {
		hexToRGB($("#gradient_1").val());
		r1 = g_r;
		g1 = g_g;
		b1 = g_b;
		hexToRGB($("#gradient_2").val());
		r2 = g_r;
		g2 = g_g;
		b2 = g_b;
		dr = 0.0 + r2 - r1;
		dg = 0.0 + g2 - g1;
		db = 0.0 + b2 - b1;
	}*/
    for (i = 0; i < j; i++) {
        if (instr.charAt(i) == "<") in_tag = 1;
        if (in_tag == 0) {
            k = scale * i;
            getSFXColor(k);
            r = g_r;
            g = g_g;
            b = g_b;
            tempstr = tohex(r) + tohex(g) + tohex(b);
            temp = instr.charAt(i);
            if (instr.charAt(i) == "&") {
                for (l = i + 1; l < j; l++) {
                    if (instr.charAt(l) == " ") break;
                    if (instr.charAt(l) == "<") break;
                    if (instr.charAt(l) == ">") break;
                    if (instr.charAt(l) == ";") break;
                }
                if (instr.charAt(l) == ";") {
                    temp = instr.substr(i, l - i + 1);
                }
            }
            if (outputHTML) {
                if (i % res == 0) {
                    outstr = outstr + "<font color='#" + tempstr + "'>";
                    oignumi = 1;
                }
                outstr = outstr + temp;
                if ((i + 1) % res == 0) {
                    outstr = outstr + "</font>";
                    oignumi = 0;
                }
            } else {
                if (i % res == 0) {
                    outstr = outstr + "[color=#" + tempstr + "]";
                    oignumi = 1;
                }
                outstr = outstr + temp;
                if ((i + 1) % res == 0) {
                    outstr = outstr + "[/color]";
                    oignumi = 0;
                }
            }
            if (temp.length > 1) i += (temp.length - 1);
        }
        if (in_tag == 1) outstr = outstr + instr.charAt(i);
        if (instr.charAt(i) == ">") in_tag = 0;
    }
    if (oignumi > 0) {
        if (document.colorform.out_format.value == "html") outstr = outstr + "</font>";
        if (document.colorform.out_format.value == "bbc") outstr = outstr + "[/color]";
    }
    return outstr;
}

function UpdateRGB(ctl) {
    var lum;
    ctl.style.backgroundColor = ctl.value;
    hexToRGB(ctl.value);
    lum = .29 * g_r + .57 * g_g + .14 * g_b;
    if (lum < 96) {
        ctl.style.color = "#FFFFFF";
    } else {
        ctl.style.color = "#000000";
    }
    preview();
}

function flipbkg(ctl) {
    if (prevbkc == "#FFFFFF") prevbkc = "#000000";
    else prevbkc = "#FFFFFF";
    ctl.style.backgroundColor = prevbkc;
}

function rainbow() {
    var iframe;
    if (document.getElementsByClassName('redactor_textCtrl redactor_MessageEditor redactor_BbCodeWysiwygEditor redactor_NoAutoComplete')[0]) {
        iframe = document.getElementsByClassName('redactor_textCtrl redactor_MessageEditor redactor_BbCodeWysiwygEditor redactor_NoAutoComplete')[0];
    } else if (document.getElementsByClassName('redactor_textCtrl redactor_MessageEditor redactor_BbCodeWysiwygEditor redactor_')[0]) {
        iframe = document.getElementsByClassName('redactor_textCtrl redactor_MessageEditor redactor_BbCodeWysiwygEditor redactor_')[0];
    }
        
        var message = iframe.contentWindow.document.getElementsByTagName('body')[0].innerHTML;
    
    if (message.indexOf("http") == -1 && message.indexOf("www") == -1 && message.indexOf("@") == -1 && message.indexOf("QUOTE") == -1 && message.indexOf("[/color]") == -1 && message.indexOf("<font color") == -1&& message.indexOf(":") == -1 && message.indexOf("[COLOR") == -1) {
        iframe.contentWindow.document.getElementsByTagName('body')[0].innerHTML = MakeSFX(message, false);
    } else {
        var imgregex = /(\<img([\s\S]*?)\>)/igm;
        var linkregex= /(\<a([\s\S]*?)<\/a\>)/igm;
        var urlregex = /(((f|ht)tps?:\/\/)(.*?)[\S][^<>]+)/igm;
        var regex =/(\@(\badam kristo\b|\bHanson Lee\b|[\S]+))|(\[QUOTE\]?[\s\S]*?\[\/QUOTE\])|(\[SPOILER\]?[\s\S]*?\[\/SPOILER\])|(\[IMG\]?[\s\S]*?\[\/IMG\])|(\[MEDIA\]?[\s\S]*?\[\/MEDIA\])|(\[PHP\]?[\s\S]*?\[\/PHP\])|(\[CODE\]?[\s\S]*?\[\/CODE\])|(\[HTML\]?[\s\S]*?\[\/HTML\])|(\[COLOR\]?[\s\S]*?\[\/COLOR\])|\;\)|\:D|\:\(|8\-\)|\:\)|(\:\/)(?![\/])|\:P/igm
        var imgrest = /(\[color=#[\w\d]+\]§\[\/color\])/im;
        var linkrest = /(\[color=#[\w\d]+\]╗\[\/color\])/im;
        var urlrest = /(\[color=#[\w\d]+\]▒\[\/color\])/im;
        var tagrest = /(\[color=#[\w\d]+\]▓\[\/color\])/im;
        
        var imgs = message.match(imgregex);
        var links = message.match(linkregex);
        var urls = message.match(urlregex);
        var misc = message.match(regex);
        
        message = message.replace(imgregex, "§");
        message = message.replace(linkregex, "╗");
        message = message.replace(urlregex, "▒");
        message = message.replace(regex, "▓");
        message = MakeSFX(message, false);
        
        var numImgs = (imgs === null) ? 0 : imgs.length;
        var numLink = (links === null) ? 0 : links.length;
        var numUrls = (urls === null) ? 0 : urls.length;
        var numMisc = (misc === null) ? 0 : misc.length;
        
        for (var u = 0; u < numImgs; u++) {
            message = message.replace(imgrest, imgs[u]);
        }
        for (var u = 0; u < numLink; u++) {
            message = message.replace(linkrest, links[u]);
        }
        for (var u = 0; u < numUrls; u++) {
            message = message.replace(urlrest, " <a href=\"" +urls[u]+ "\">" +urls[u]+ "</a> ");
        }
        for (var i = 0; i < numMisc; i++) {
            message = message.replace(tagrest, misc[i]);
        }
        iframe.contentWindow.document.getElementsByTagName('body')[0].innerHTML = message;
    }
}
    var iframe2;
    if (document.getElementsByClassName('redactor_textCtrl redactor_MessageEditor redactor_BbCodeWysiwygEditor redactor_NoAutoComplete')[0]) {
        iframe2 = document.getElementsByClassName('redactor_textCtrl redactor_MessageEditor redactor_BbCodeWysiwygEditor redactor_NoAutoComplete')[0];
    } else if (document.getElementsByClassName('redactor_textCtrl redactor_MessageEditor redactor_BbCodeWysiwygEditor redactor_')[0]) {
        iframe2 = document.getElementsByClassName('redactor_textCtrl redactor_MessageEditor redactor_BbCodeWysiwygEditor redactor_')[0];
    }
        iframe2=iframe2.contentWindow.document.getElementsByTagName('body')[0];
    //Rainbowfy Text
    if ($('input[value="Post Reply"]').length > 0) {
        var rainbowfyBtn = $('&nbsp;<button class="button">Rainbowfy</button>');
        $('input[value="Post Reply"]').after(rainbowfyBtn);
        
        rainbowfyBtn.click(function(e) {
            e.preventDefault();
            rainbow();
        });
    }