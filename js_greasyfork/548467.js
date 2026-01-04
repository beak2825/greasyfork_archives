// ==UserScript==
// @name         Luogu Chat Plus Beta
// @namespace    https://smkttl.github.io/
// @version      v0.10.6
// @description  Enable markdown in chat
// @author       limesarine
// @match        https://www.luogu.com.cn/chat
// @match        https://www.luogu.com.cn/chat?*
// @license      © 2024 Limesarine. All rights reserved.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @require      https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js
// @grant        none
// @license      CC-BY-NC-ND
// @downloadURL https://update.greasyfork.org/scripts/548467/Luogu%20Chat%20Plus%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/548467/Luogu%20Chat%20Plus%20Beta.meta.js
// ==/UserScript==

function latexToHtml(latex)
{
    return katex.renderToString(latex,{throwOnError:false});
}
function replaceKaTeX(text)
{
    let replacedText=text.replace(/\$\$(.*?)\$\$/g,(match,p1)=>{
        let html=latexToHtml(p1);
        return `<span class="katex-display katex">${html}</span>`;
    });
    replacedText=replacedText.replace(/\$(.*?)\$/g,(match, p1)=>{
        let html=latexToHtml(p1);
        return `<span class="katex">${html}</span>`;
    });
    return replacedText;
}
function markdownToHtmlWithoutCode(markdown)
{
    //console.log(markdown);
    markdown=markdown.replace(/^(#{1,6})\s*(.*)$/gm,function(_,level,text){return '<h'+level.length+'>'+text+'</h'+level.length+'>';});
    markdown=markdown.replace(/^(\s*)(-|\d+\.)\s+(.*)$/gm,function(_,spaces,bullet,text)
    {
        if(bullet==='-')
        {
            return spaces+'<ul><li>'+text+'</li></ul>';
        }
        else
        {
            return spaces+'<ol><li>'+text+'</li></ol>';
        }
    });
    markdown=markdown.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1"></img>');
    markdown=markdown.replace(/\[(.*?)\]\((.*?)\)/g,'<a href="$2">$1</a>');
    markdown=markdown.replace(/\&lt;(.*?)\&gt;/g,'<a href="$1">$1</a>');
    markdown=markdown.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>');
    markdown=markdown.replace(/\*(.*?)\*/g,'<em>$1</em>');
    markdown=markdown.replace(/__(.*?)__/g,'<strong>$1</strong>');
    markdown=markdown.replace(/_(.*?)_/g,'<em>$1</em>');
    markdown=markdown.replace(/~~(.*?)~~/g,'<s>$1</s>');
    markdown=markdown.replace(/^-{3,}$/gm,'<hr>');
    return markdown;
}
function markdownToHtml(markdown,id)
{
    let tmp="",result="";
    for(let i=0;i<markdown.length;i++)
    {
        if(i+2<markdown.length&&markdown[i]=='`'&&markdown[i+1]=='`'&&markdown[i+2]=='`')
        {
            result+=markdownToHtmlWithoutCode(tmp)+'<div style="border: 1px solid black; background-color: aliceblue; border-radius: 10px; padding: 1px;"><code>';
            tmp="";
            i+=3;
            while(i<markdown.length&&markdown[i]!='\n')
            {
                i++;
            }
            i++;
            while(!(i+3<markdown.length&&markdown[i]=='\n'&&markdown[i+1]=='`'&&markdown[i+2]=='`'&&markdown[i+3]=='`'))
            {
                result+=markdown[i++];
            }
            i+=3;
            result+="</code></div>";
        }
        else if(markdown[i]=='`'&&(i==0||markdown[i-1]!='\\'))
        {
            result+=markdownToHtmlWithoutCode(tmp)+'<code style="border: 1px solid black; background-color: aliceblue; border-radius: 10px; padding: 1px;">';
            tmp="";
            i++;
            while(i<markdown.length && !(markdown[i]=='`'&&markdown[i-1]!='\\'))
            {
                result+=markdown[i++];
            }
            result+="</code>";
        }
        else tmp+=markdown[i];
    }
    if(tmp!="")
    {
        result+=markdownToHtmlWithoutCode(tmp);
    }
    result='<div class="mp-preview-content" data-v-a97ae32a="" style="padding:0px">'+result+'</div>';
    if(markdown.startsWith('[encoded-message LS {"version":') && markdown.endsWith('[/encoded-message]'))
    {
        result=markdown+"<br></br><button data-v-5c0627c6 onclick='limesarine_decode_message("+id+")'>解密</button>";
    }
    if(markdown.startsWith('[emLS :'))
    {
        result=markdown+"<br></br><button data-v-5c0627c6 onclick='limesarine_decode_message("+id+")'>解密</button>";
    }
    return result;
}

function insertJS()
{
    let newScript=document.createElement("script");
    newScript.innerHTML=`
let limesarine_seed;
const dict="愛安岸按八把白百般办榜包宝保报悲北备被本比必边变便标表别滨兵丙餅并病渤不布步歩部才材财采参沧藏草測层層查茶柴产昌常償场廠唱超巣朝车辰陳称成承乗城乘程池持尺冲衝銃丑出除处川传窓创創春词詞辞此次从酢村存撮达達打大代带丹单胆旦但弹弾当党刀导島蹈到倒道得德地的灯等邓敌笛敵底帝第点电淀调畳丁定东冬都斗豆度渡短段断队对盾遁多奪恩儿而尔二发法髪繁反范飯方坊防房放飞非飛分份丰风封風凤鳳佛福府妇附阜复富该改甘感干高歌革格个根跟庚更工弓公功宫共构古谷故怪关观官冠莞馆管光广规轨癸鬼贵桂国果过哈还海亥汉航好号合何和河核荷黒很衡红紅虹后候胡湖虎浒琥护花华化划话話怀坏环凰灰輝徽回会惠魂活火或货机积基及吉级即极疾集己计记技际济加家嘉甲菅简见件見建健剣箭江将疆降醤交焦角较教阶接街节结解界今金津尽锦近进京经睛精井景警径境静究鳩九酒旧就局菊具据决觉军菌开鎧看瞰康考科克课空控口苦快况矿昆括拉来嵐蓝廊劳老乐楽了勒雷类离梨里理力历立利例连联恋两辆量辽聊料林麟〇齢岭流瘤六龙竜楼陆路潞旅履律率輪麻马麦猫毛卯贸么没媒每美门們蒙梦夢米密面麺民名明命模魔母目那南难内能你醸鸟鳥宁农奴怒女暖派袍炮配朋片品平珀七期其祈埼麒气器峠千前钱潜黔腔强蕎橋切亲钦青轻清情庆琼秋";
const base64dict='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+=';
function initializeseed(seedValue)
{
	limesarine_seed=seedValue;
}
function getrnd(l,r)
{
	limesarine_seed^=(limesarine_seed<<11);
	limesarine_seed^=(limesarine_seed>>4);
	limesarine_seed^=(limesarine_seed<<5);
	limesarine_seed^=(limesarine_seed>>14);
	return limesarine_seed%(r-l+1)+l;
}
function limesarine_rotation(n,seedValue)
{
	initializeseed(seedValue);
	let a=new Array(n);
	for(let i=0;i<n;i++)
	{
		a[i]=i;
	}
	let times=getrnd(n*2,n*3);
	for(let i=0;i<times;i++)
	{
		let l=getrnd(0,n-1);
		let r=getrnd(0,n-1);
		[a[l],a[r]]=[a[r],a[l]];
	}
	return a;
}
function limesarine_shuffle_encrypt(str,limesarine_seed)
{
	const permutation=limesarine_rotation(str.length,limesarine_seed);
	let result='';
	for (let i=0;i<str.length;i++)
	{
		result+=str[permutation[i]];
	}
	return result;
}
function limesarine_shuffle_decrypt(str,limesarine_seed)
{
	const permutation=limesarine_rotation(str.length,limesarine_seed);
	let result='';
	for (let i=0;i<str.length;i++)
	{
		const index=permutation.indexOf(i);
		result+=str[index];
	}
	return result;
}
function limesarine_fake_md5(string)
{
    function md5_RotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }
    function md5_AddUnsigned(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }
    function md5_F(x, y, z) {
        return (x & y) | ((~x) & z);
    }
    function md5_G(x, y, z) {
        return (x & z) | (y & (~z));
    }
    function md5_H(x, y, z) {
        return (x ^ y ^ z);
    }
    function md5_I(x, y, z) {
        return (y ^ (x | (~z)));
    }
    function md5_FF(a, b, c, d, x, s, ac) {
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    };
    function md5_GG(a, b, c, d, x, s, ac) {
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    };
    function md5_HH(a, b, c, d, x, s, ac) {
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    };
    function md5_II(a, b, c, d, x, s, ac) {
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    };
    function md5_ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };
    function md5_WordToHex(lValue) {
        var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
    };
    function md5_Utf8Encode(string) {
        string = string.replace(/\\r\\n/g, "\\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    };
    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
    string = md5_Utf8Encode(string);
    x = md5_ConvertToWordArray(string);
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
    for (k = 0; k < x.length; k += 16) {
        AA = a; BB = b; CC = c; DD = d;
        a = md5_FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = md5_FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = md5_FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = md5_FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = md5_FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = md5_FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = md5_FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = md5_FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = md5_FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = md5_FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = md5_FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = md5_FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = md5_FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = md5_FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = md5_FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = md5_FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = md5_GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = md5_GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = md5_GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = md5_GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = md5_GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = md5_GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = md5_GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = md5_GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = md5_GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = md5_GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = md5_GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = md5_GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = md5_GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = md5_GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = md5_GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = md5_GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = md5_HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = md5_HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = md5_HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = md5_HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = md5_HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = md5_HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = md5_HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = md5_HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = md5_HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = md5_HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = md5_HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = md5_HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = md5_HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = md5_HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = md5_HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = md5_HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = md5_II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = md5_II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = md5_II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = md5_II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = md5_II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = md5_II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = md5_II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = md5_II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = md5_II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = md5_II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = md5_II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = md5_II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = md5_II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = md5_II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = md5_II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = md5_II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = md5_AddUnsigned(a, AA);
        b = md5_AddUnsigned(b, BB);
        c = md5_AddUnsigned(c, CC);
        d = md5_AddUnsigned(d, DD);
    }
    return (md5_WordToHex(a) + md5_WordToHex(b) + md5_WordToHex(c) + md5_WordToHex(d)).toUpperCase();
}



function strtr(str, from, to) {
  var fr = '',
    i = 0,
    j = 0,
    lenStr = 0,
    lenFrom = 0,
    tmpStrictForIn = false,
    fromTypeStr = '',
    toTypeStr = '',
    istr = '';
  var tmpFrom = [];
  var tmpTo = [];
  var ret = '';
  var match = false;

  // Received replace_pairs?
  // Convert to normal from->to chars
  if (typeof from === 'object') {
    /* tmpStrictForIn = this.ini_set('phpjs.strictForIn', false); // Not thread-safe; temporarily set to true
    from = this.krsort(from);
    this.ini_set('phpjs.strictForIn', tmpStrictForIn); */

    for (fr in from) {
      if (from.hasOwnProperty(fr)) {
        tmpFrom.push(fr);
        tmpTo.push(from[fr]);
      }
    }

    from = tmpFrom;
    to = tmpTo;
  }

  // Walk through subject and replace chars when needed
  lenStr = str.length;
  lenFrom = from.length;
  fromTypeStr = typeof from === 'string';
  toTypeStr = typeof to === 'string';

  for (i = 0; i < lenStr; i++) {
    match = false;
    if (fromTypeStr) {
      istr = str.charAt(i);
      for (j = 0; j < lenFrom; j++) {
        if (istr == from.charAt(j)) {
          match = true;
          break;
        }
      }
    } else {
      for (j = 0; j < lenFrom; j++) {
        if (str.substr(i, from[j].length) == from[j]) {
          match = true;
          // Fast forward
          i = (i + from[j].length) - 1;
          break;
        }
      }
    }
    if (match) {
      ret += toTypeStr ? to.charAt(j) : to[j];
    } else {
      ret += str.charAt(i);
    }
  }

  return ret;
}

function pad(target, n) {
    var len = target.toString().length;
    while (len < n) {
        target = '0' + target;
        len++;
    }
    return target;
}

var hexIn = false;
var hexOut = false;
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

function base64encode(str) {
    var out, i, len;
    var c1, c2, c3;
    var charCode;

    len = str.length;
    i = 0;
    out = "";
    while(i < len) {
    c1 = (hexIn ? str[i++] : str.charCodeAt(i++)) & 0xff;
    if(i == len)
    {
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt((c1 & 0x3) << 4);
        out += "==";
        break;
    }
    c2 = (hexIn ? str[i++] : str.charCodeAt(i++));
    if(i == len)
    {
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt((c2 & 0xF) << 2);
        out += "=";
        break;
    }
    c3 = (hexIn ? str[i++] : str.charCodeAt(i++));
    out += base64EncodeChars.charAt(c1 >> 2);
    out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
    out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
    out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}

function base64decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;
    var charCode;

    len = str.length;
    i = 0;
    out = hexOut ? [] : "";
    while(i < len) {
    /* c1 */
    do {
        c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
    } while(i < len && c1 == -1);
    if(c1 == -1)
        break;

    /* c2 */
    do {
        c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
    } while(i < len && c2 == -1);
    if(c2 == -1)
        break;

    charCode = (c1 << 2) | ((c2 & 0x30) >> 4);
    hexOut ? out.push(charCode) : out += String.fromCharCode(charCode);

    /* c3 */
    do {
        c3 = str.charCodeAt(i++) & 0xff;
        if(c3 == 61)
        return out;
        c3 = base64DecodeChars[c3];
    } while(i < len && c3 == -1);
    if(c3 == -1)
        break;
    charCode = ((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2);
    hexOut ? out.push(charCode) : out += String.fromCharCode(charCode);

    /* c4 */
    do {
        c4 = str.charCodeAt(i++) & 0xff;
        if(c4 == 61)
        return out;
        c4 = base64DecodeChars[c4];
    } while(i < len && c4 == -1);
    if(c4 == -1)
        break;
    charCode = ((c3 & 0x03) << 6) | c4;
    hexOut ? out.push(charCode) : out += String.fromCharCode(charCode);
    }
    return out;
}

function utf16to8(str) {
    var out, i, len, c;
    var charCode;
    out = hexIn ? [] : "";
    len = str.length;
    for(i = 0; i < len; i++) {
    c = hexIn ? str[i] : str.charCodeAt(i);
	if ((c >= 0x0001) && (c <= 0x007F)) {
        hexIn ? out.push(str[i]) : out += str.charAt(i);
    } else if (c > 0x07FF) {
        charCode = (0xE0 | ((c >> 12) & 0x0F)); hexIn ? out.push(charCode) : out += String.fromCharCode(charCode);
        charCode = (0x80 | ((c >>  6) & 0x3F)); hexIn ? out.push(charCode) : out += String.fromCharCode(charCode);
        charCode = (0x80 | ((c >>  0) & 0x3F)); hexIn ? out.push(charCode) : out += String.fromCharCode(charCode);
    } else {
        charCode = (0xC0 | ((c >>  6) & 0x1F)); hexIn ? out.push(charCode) : out += String.fromCharCode(charCode);
        charCode = (0x80 | ((c >>  0) & 0x3F)); hexIn ? out.push(charCode) : out += String.fromCharCode(charCode);
    }
    }
    return out;
}

function utf8to16(str) {
    var out, i, len, c;
    var char2, char3;
    var charCode;

    out = hexOut ? [] : "";
    len = str.length;
    i = 0;
    while(i < len) {
    c = hexOut ? str[i++] : str.charCodeAt(i++);
    switch(c >> 4)
    {
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
        // 0xxxxxxx
        hexOut ? out.push(str[i-1]) : out += str.charAt(i-1);
        break;
      case 12: case 13:
        // 110x xxxx   10xx xxxx
        char2 = hexOut ? str[i++] : str.charCodeAt(i++);
        charCode = ((c & 0x1F) << 6) | (char2 & 0x3F); hexOut ? out.push(charCode) : out += String.fromCharCode(charCode);
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = hexOut ? str[i++] : str.charCodeAt(i++);
        char3 = hexOut ? str[i++] : str.charCodeAt(i++);
        charCode = ((c & 0x0F) << 12) |
                       ((char2 & 0x3F) << 6) |
                       ((char3 & 0x3F) << 0);
        hexOut ? out.push(charCode) : out += String.fromCharCode(charCode);
        break;
    }
    }

    return out;
}

function base64_encode(src, hI) {
	hexIn = hI;
	return base64encode(hexIn ? src : utf16to8(src));
}

function base64_decode(src, hO, out_de) {
	hexOut = hO;
	var ret = base64decode(src);
	if(!hexOut || out_de == 'u' || out_de == 'd'){ ret = utf8to16(ret); }
	return ret;
}


function E64(src)
{
	return base64_encode(src,false);
}
function D64(src)
{
	return base64_decode(src,false,'t');
}




function base64EncodeWithSeed(str,limesarine_seed)
{
	return limesarine_shuffle_encrypt(btoa(encodeURIComponent(str)),limesarine_seed);
}
function base64DecodeWithSeed(str,limesarine_seed,message)
{
  try
  {
  	return decodeURIComponent(atob(limesarine_shuffle_decrypt(str,limesarine_seed)));
  }
  catch
  {
    alert('解码失败。请检查密码是否正确！');
    return message;
  }
}
function base64DecodeWithSeedAuto(str,limesarine_seed,message)
{
  try
  {
  	return decodeURIComponent(atob(limesarine_shuffle_decrypt(str,limesarine_seed)));
  }
  catch
  {
    return message;
  }
}


function E64WithSeed(str,limesarine_seed)
{
	return limesarine_shuffle_encrypt(E64(str),limesarine_seed);
}
function D64WithSeed(str,limesarine_seed,message)
{
  try
  {
  	return D64(limesarine_shuffle_decrypt(str,limesarine_seed));
  }
  catch
  {
    alert('解码失败。请检查密码是否正确！');
    return message;
  }
}
function D64WithSeedAuto(str,limesarine_seed,message)
{
  try
  {
  	return D64(limesarine_shuffle_decrypt(str,limesarine_seed));
  }
  catch
  {
    return message;
  }
}

function base64dictindexOf(x)
{
  if(x=='/')
    x='=';
  return base64dict.indexOf(x);
}
function dictEncode(message)
{
  let log="encoding "+message;
  ret="";
  let fill=3-message.length%3;
  for(let i=0;i<fill;i++)
  {
    message+=base64dict[fill];
  }
  log=log+"\\nfilled with "+fill+" "+base64dict[fill]+"(s)";
  for(let i=0;i<message.length;i+=3)
  {
    log=log+"\\ndealing:"+message.substring(i,3);
    let a1=message[i],a2=message[i+1],a3=message[i+2];
    a1=base64dictindexOf(a1);
    a2=base64dictindexOf(a2);
    a3=base64dictindexOf(a3);
    log=log+" a[]={"+a1+","+a2+","+a3+"}";
    let b1=a1*8+Math.floor(a2/8);
    let b2=(a2%8)*64+a3;
    log=log+" b[]={"+b1+","+b2+"}";
    ret+=dict[b1];
    ret+=dict[b2];
    log=log+" added "+dict[b1]+" "+dict[b2]+" to output";
  }
  //console.log(log);
  return ret;
}
function dictDecode(message)
{
  ret="";
  for(let i=0;i<message.length;i+=2)
  {
    let b1=message[i],b2=message[i+1];
    b1=dict.indexOf(b1);
    b2=dict.indexOf(b2);
    let a1=Math.floor(b1/8);
    let a2=(b1%8)*8+Math.floor(b2/64);
    let a3=b2%64;
    ret+=base64dict[a1];
    ret+=base64dict[a2];
    ret+=base64dict[a3];
  }
  let fill=base64dictindexOf(ret[ret.length-1]);
  ret=ret.substring(0,ret.length-fill);
  return ret;
}
function limesarine_encode()
{
  let password=document.getElementById('limesarine-message-encode-password').value;
  if(password){}
  else
  {
    document.getElementById('limesarine_encode_output').innerHTML='很抱歉，但是密码必须是数字！';
    return;
  }
  let message=document.getElementById('limesarine_encode_input').value;;
  message=E64WithSeed(message,password);
  message=dictEncode(message);
  header=':2.5:'+password+':'+limesarine_fake_md5(password).slice(0,4)+':';
  header="[emLS "+header+"]";
  message=header+message;
  document.getElementById('limesarine_encode_output').innerHTML=message;
}
function limesarine_expand()
{
  document.getElementById('limesarine_lock_icon').style.display="none";
  let dialog=document.createElement("div");
  dialog.style.position="fixed";
  dialog.style.top="50%";
  dialog.style.left="50%";
  dialog.style.transform="translate(-50%, -50%)";
  dialog.style.width="550px";
  dialog.style.height="350px";
  dialog.style.borderRadius="8px";
  dialog.style.boxShadow="0 1px 6px rgba(0, 0, 0, .2)";
  dialog.style.borderColor="#F0F8FF";
  dialog.style.backgroundColor="#E0E8FC";
  dialog.style.fontSize="90%";
  dialog.style.padding="20px";
  dialog.innerHTML=\`
<h2>信息加密</h2>
<div data-v-2add0d3b id="limesarine-message-encode-panel">
    <textarea id="limesarine_encode_input" style="width: 90%; align: center;" placeholder="请输入要加密的信息" data-v-66fcc50b="" data-v-2add0d3b="" rows="4" class="frame lfe-form-sz-middle" onclick="limesarine_encode();" oninput="limesarine_encode();" onchange="limesarine_encode();" onkeyup="limesarine_encode();"></textarea>
    <p>密码：<input id="limesarine-message-encode-password" type="number" style="width: 5em;" onclick="limesarine_encode();" oninput="limesarine_encode();" onchange="limesarine_encode();" onkeyup="limesarine_encode();"></input></p>
	<p class="radio-group">
        密码发送方式：
        <label class="radio"><input type="radio" onchange="limesarine_encode();" name="limesarine-encoding-type" value="plain" checked>明文发送</label>
        <label class="radio"><input type="radio" onchange="limesarine_encode();" name="limesarine-encoding-type" value="encoded">加密后发送</label>
        <label class="radio"><input type="radio" onchange="limesarine_encode();" name="limesarine-encoding-type" value="none">不发送</label>
    </p>
    <textarea id="limesarine_encode_output" style="width: 90%; align: center;" placeholder="预览" data-v-66fcc50b="" data-v-2add0d3b="" rows="4" class="frame lfe-form-sz-middle"></textarea>
    <p><button id="limesarine-message-encode-close" data-v-7ade990c="" data-v-2add0d3b="" type="button" class="lfe-form-sz-middle" style="border-color: rgb(221, 81, 76); background-color: rgb(221, 81, 76);">关闭</button></p>
</div>
\`;
  document.body.appendChild(dialog);
  document.getElementById("limesarine-message-encode-close").onclick=function(){document.getElementById('limesarine_lock_icon').style.display="block";document.body.removeChild(dialog);};
}
function limesarine_decode_v1_0(headers,context,message)
{
  let passwordtype=headers.password.type;
  let password;
  if(passwordtype=='plain')
  {
    password=headers.password.value;
  }
  else if(passwordtype=='encoded')
  {
    password=base64DecodeWithSeed(headers.password.value,114514);
  }
  else if(passwordtype='none')
  {
    password=prompt('请输入密码：');
  }
  else
  {
    alert('"密码传输方式"字段不合法！');
    return message;
  }
  return base64DecodeWithSeed(context,password,message);
}
function limesarine_decode_v1_0_auto(headers,context,message)
{
  let passwordtype=headers.password.type;
  let password;
  if(passwordtype=='plain')
  {
    password=headers.password.value;
  }
  else if(passwordtype=='encoded')
  {
    password=base64DecodeWithSeed(headers.password.value,114514);
  }
  else
  {
    return message;
  }
  return base64DecodeWithSeedAuto(context,password,message);
}
function limesarine_decode_v1_5(headers,context,message)
{
  let passwordtype=headers.password.type;
  let password;
  if(passwordtype=='plain')
  {
    password=headers.password.value;
  }
  else if(passwordtype=='encoded')
  {
    password=base64DecodeWithSeed(headers.password.value,114514);
  }
  else if(passwordtype='none')
  {
    password=prompt('请输入密码：');
  }
  else
  {
    alert('"密码传输方式"字段不合法！');
    return message;
  }
  if(limesarine_fake_md5(password)!=headers.password.digest)
  {
    alert('密码的哈希值与给定值不符！');
    return message;
  }
  return base64DecodeWithSeed(context,password,message);
}
function limesarine_decode_v1_5_auto(headers,context,message)
{
  let passwordtype=headers.password.type;
  let password;
  if(passwordtype=='plain')
  {
    password=headers.password.value;
  }
  else if(passwordtype=='encoded')
  {
    password=base64DecodeWithSeed(headers.password.value,114514);
  }
  else
  {
    return message;
  }
  if(limesarine_fake_md5(password)!=headers.password.digest)
  {
    return message;
  }
  return base64DecodeWithSeedAuto(context,password,message);
}
function limesarine_decode_v2_0(headers,context,message,auto=false)
{
  let password=headers[2];
  if(limesarine_fake_md5(password).slice(0,4)!=headers[3])
  {
    if(!auto)
    {
      alert('密码的哈希值与给定值不符！');
    }
    return message;
  }
  context=dictDecode(context);
  if(auto)
  {
    return base64DecodeWithSeedAuto(context,password,message);
  }
  return base64DecodeWithSeed(context,password,message);
}
function limesarine_decode_v2_5(headers,context,message,auto=false)
{
  let password=headers[2];
  if(limesarine_fake_md5(password).slice(0,4)!=headers[3])
  {
    if(!auto)
    {
      alert('密码的哈希值与给定值不符！');
    }
    return message;
  }
  context=dictDecode(context);
  if(auto)
  {
    return D64WithSeedAuto(context,password,message);
  }
  return D64WithSeedAuto(context,password,message);
}
function limesarine_decode_with_headers_v2(message,auto=false)
{
  let template=/\\[emLS (.*?)\\](.*?)\\s/;
  let match=message.match(template);
  if(!match)
  {
    return message;
  }
  headers=match[1].split(":");
  context=match[2];
  if(headers[1]=='2.0')
  {
    return limesarine_decode_v2_0(headers,context,message,auto);
  }
  else if(headers[1]=='2.5')
  {
    return limesarine_decode_v2_5(headers,context,message,auto);
  }
  else
  {
    if(!auto)
    {
      alert('版本号不合法！');
    }
    return message;
  }
  alert('很抱歉，但是您的电脑似乎认为1+1=3，本脚本无法正常进行解密工作！');
}
function limesarine_decode_with_headers(message)
{
  let template=/\\[encoded-message LS (.*?)\\](.*?)\\[.*?\\]/;
  let match=message.match(template);
  if(!match)
  {
    limesarine_decode_with_headers_v2(message);
    return;
  }
  headers=JSON.parse(match[1]);
  context=match[2];
  if(headers.version=='v1.0')
  {
    return limesarine_decode_v1_0(headers,context,message);
  }
  else if(headers.version=='v1.5')
  {
    return limesarine_decode_v1_5(headers,context,message);
  }
  else
  {
    alert('版本号不合法！');
    return;
  }
  alert('很抱歉，但是您的电脑似乎认为1+1=3，本脚本无法正常进行解密工作！');
}
function limesarine_decode_with_headers_auto(message)
{
  let template=/\\[encoded-message LS (.*?)\\](.*?)\\[.*?\\]/;
  let match=message.match(template);
  if(!match)
  {
    return limesarine_decode_with_headers_v2(message,true);
  }
  headers=JSON.parse(match[1]);
  context=match[2];
  if(headers.version=='v1.0')
  {
    return limesarine_decode_v1_0_auto(headers,context,message);
  }
  else if(headers.version=='v1.5')
  {
    return limesarine_decode_v1_5_auto(headers,context,message);
  }
  return message;
}
function limesarine_decode_message(id)
{
  let div=document.getElementsByClassName('message')[id];
  let message=div.innerText.slice(0,-4);
  let copyofmessage=message;
  message=limesarine_decode_with_headers(message);
  //console.log(message);
  if(message!=copyofmessage)
  {
    div.setAttribute('limesarine_dealt',false);
    message+='<br></br><button>解密成功</button>';
  }
  else
  {
    message+='<br></br><button>解密失败</button>';
  }
  div.innerHTML=message;
}
function limesarine_auto_decode_message(id)
{
  let div=document.getElementsByClassName('message')[id];
  let message=div.innerText;
  let copyofmessage=message;
  message=limesarine_decode_with_headers_auto(message);
  if(message!=copyofmessage)
  {
    div.setAttribute('limesarine_dealt',false);
    message+='<br></br><button>解密成功</button>';
    div.innerHTML=message;
  }
}
`;
    document.head.appendChild(newScript);
}
function insertLockIcon()
{
    let dialog=document.createElement("div");
    dialog.setAttribute("id","limesarine_lock_icon");
    dialog.style.position="fixed";
    dialog.style.bottom="5px";
    dialog.style.right="5px";
    dialog.style.width="45px";
    dialog.style.height="45px";
    dialog.style.background="#fff";
    dialog.style.borderRadius="8px";
    dialog.style.boxShadow="0 1px 6px rgba(0, 0, 0, .2)";
    dialog.style.borderColor="aliceblue";
    dialog.style.backgroundColor="white";
    dialog.style.fontSize="90%";
    dialog.style.padding="5px";
    dialog.style.justifyContent="center";
    dialog.style.align="center";
    dialog.innerHTML=`
<a unselectable="on" onclick="limesarine_expand();">
  <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8.13 2 5 5.13 5 9v3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2v-3c0-3.87-3.13-7-7-7zm0 2c2.76 0 5 2.24 5 5v3H7V9c0-2.76 2.24-5 5-5zm-3 7h6v2h-6v-2z"></path>
  </svg>
</a>
`;
    document.body.appendChild(dialog);
}
(function() {
    'use strict';

    let flag=false;
    const observer=new MutationObserver(function(mutationsList,observer){
        if(document.getElementsByClassName('panel-content')[0] && !flag)
        {
            //document.getElementById('app').style.display="none";
            insertLockIcon();
            insertJS();
            flag=true;
        }
        let messages=document.getElementsByClassName('message');
        for(let i=0;i<messages.length;i++)
        {
            let message=messages[i];
            if(message.className==='message')
            {
                if(message.getAttribute('limesarine_dealt') && message.getAttribute('limesarine_dealt')=='true')
                {
                    continue;
                }
                message.setAttribute('limesarine_dealt','true');
                message.innerHTML=replaceKaTeX(markdownToHtml(message.innerHTML,i));
                limesarine_auto_decode_message(i);
            }
        }
    });
    observer.observe(document,{childList:true,subtree:true});
})();
