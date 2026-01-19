// ==UserScript==
// @name            SnorlaX Mod
// @author          Murka, SaVeGe, & Snorlax
// @description     op
// @icon            https://imagizer.imageshack.com/img924/3497/SedB2D.png
// @version         12.X
// @match           *://moomoo.io/*
// @match           *://*.moomoo.io/*
// @run-at          document-start
// @grant           GM_info
// @grant           unsafeWindow
// @namespace https://greasyfork.org/users/1546426
// @downloadURL https://update.greasyfork.org/scripts/559977/SnorlaX%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/559977/SnorlaX%20Mod.meta.js
// ==/UserScript==

/*
Snorlax discord: Snorlax_X12

"uncrackable mod"
- Murka (Jake)
*/

var STR_CACHE;
var STR_TABLE;
var GLOBAL;
var TextDecoderRef;
var Uint8ArrayRef;
var BufferRef;
var __String;
var __Array;
var utf8ArrayToStr;
var __p_Xysf_globalVar;
function rotateArray(arr, shift, i) {
  for (i = 0; i < shift; i++) {
    arr.push(arr.shift());
  }
  return arr;
}
const DLR = [0, 1, 8, 255, "length", "undefined", 63, 6, "fromCodePoint", 7, 12, "push", 91, 8191, 88, 13, 14, 99, 127, 128, 223, 239, "P", "V", 16, "a", 512, 256, 15, 3, 2, 4, 268, 1023, 271, 192, 31, 224, 240, 18, 32, 5, 24, 10, 19, 279, 64, 65535, 289, 65536, 291, "i", 298, "=", 299, 300, 297, 313, "D", "e", 326, 286, false, 100, 370, "t", 380, 909522486, 1549556828, 385, 55296, 56319, 56320, 57343, 2047, 387, 2097151, 386, 22, 11, 25, 17, 28, 34, 39, 41, 61, 1116352408, 1899447441, 1245643825, 373957723, 961987163, 1508970993, 1841331548, 1424204075, 670586216, 310598401, 607225278, 1426881987, 1925078388, 2132889090, 1680079193, 1046744716, 459576895, 272742522, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 1740746414, 1473132947, 1341970488, 1084653625, 958395405, 710438585, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2117940946, 1838011259, 1564481375, 1474664885, 1035236496, 949202525, 778901479, 694614492, 200395387, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2067236844, 1933114872, 1866530822, 1538233109, 1090935817, 965641998, 388, 1779033703, 1150833019, 1013904242, 1521486534, 1359893119, 1694144372, 528734635, 1541459225, 9, "o", "l", null, 1000, "m", 464, 468, 469, "p", "u", "k", "s", true, 476, 474, 497, 496, "S", 498, 499, "C", "j", 492, 520, 524, 525, "N", "R", 530, 528, "H", "B", "z", "L", 533, "g", 357, "O", 544, 545, "G", 552, "I", 548, 562, 538, 563, 566, "_", "K", 453, 579, "X", 598, 604, ";", 600, 618, 652, "d", 625, 669, 696, 697, ")", 647, 597, 759, 768, "n", 787, 325, 869, 870, "1", "r", 871, 925, 926, 150, 849, 850, 526, 960, "A", "U", 3000, 500, 373, "PI", 35, 724, 114, 160, 165, 175, 95, 80, 85, 2400, 40, "x", "y", 980, 564, "F", 473, 992, "Wt", "At", 995, 1004, 2048, 248, 986, 1011, 374, 1012, 1013, 180, 1019, 824, "ck", 541, 1066, 1069, 1080, 1088, 1089, "Lt", "St", 352, 983, 1920, "w", "h", 1015, 1093, "tn", "nn", "sn", 1.1, 504, 1094, 1105, 1103, 1104, 587, 140, 60, "id", "ln", 1113, "cn", 1114, 1116, 1119, "hn", "pn", "un", "dn", 1120, "mn", 1121, 400, "fn", 1112, 1122, "pe", 1.3, 130, 210, 110, "gn", "yn", "bn", 118, 53, 142, 700, "kn", 20, "wn", 204, 0.8, 0.1, 65, 70, 966, 965, 967, 120, 0.75, 1126, 75, 0.2, 0.7, "xn", "vn", 1155, "zn", "Sn", 230, 1200, 250, 125, 205, 0.6, 30, "Gn", "En", "Nn", 1204, "Rn", 1209, 27, 1161, 1162, 1206, 50, "Bn", 900, "Ln", 1500, 52, "_n", 23, 1233, 45, 0.0016, "Xn", 1242, "Vn", 1251, 800, 47, "An", 1.5, 200, 2200, "Zn", 43, 21, "ee", "se", "ie", 1284, 5000, 1.18, 103, 1.6, 1196, 1290, 1400, "ae", "oe", 51, 29, 1307, 36, 37, 38, 1312, 1313, 44, 42, 49, 57, 1327, 2000, 48, 26, "et", 4000, 0.5, "ue", 6000, 46, 10000, 1244, "xe", 1265, 2500, 12000, 1342, 58, 0.4, 968, 1348, 15000, 0.3, 1393, 55, "ze", 0.25, "ge", 56, 20000, 1296, 105, 90, 97, 1430, 8000, 115, "de", "ve", 138, 1357, 178, 1453, 1454, 1455, 1456, 1457, 1458, "ou", undefined, 1081, "Oe", 451, 452, 1010, "Je", "Qe", 1021, "Nt", "ts", "rs", "Fe", "es", "ss", "b", 1487, 1488, 1486, "Qn", 111, "ls", "$e", "qe", "te", "ns", "fs", 501, "ys", 1492, "gs", "bs", 985, 1493, 1501, 1507, 1102, 571, 1491, 1426, 506, 537, "Ts", 1504, 1515, "Ms", "vs", "Re", "Ps", "ks", 1528, 1505, 1516, 1544, "\"]", "Ss", "zs", 1527, 1495, 1496, 1497, "js", "Is", 586, "ws", 1547, "xs", 1554, "ut", 911, 1581, 536, "Vs", "Xt", 1586, 1587, 1588, "ei", 353, "-v", 356, "As", "Zs", "si", 1548, 1592, "er", "/", "Ns", "Bs", "Js", 1545, 1617, 1614, 1615, "ai", 1499, 1580, "ng", 1532, 1533, 1629, "ii", "oi", "pi", 1624, "qs", "Ys", 1590, 1648, 491, "ri", "Ks", "Qs", "ni", 1650, 1651, 14400, 1659, "Ls", "Xs", 1647, 1087, 875, "$s", "Hi", 927, "ji", "ci", 523, "Us", 1672, "Bi", "_i", "lt", "Cs", "Xi", "Qt", "Vi", "Ft", "$t", "Ue", "Wi", "Jt", "Vt", "br", "_r", 1680, "qi", "Br", "Pr", "wr", "Mr", "Tr", "vr", "$i", "tr", "nr", "sr", "ir", "rr", "ar", "lr", "cr", "hr", "dr", "pr", "ur", "gr", "mr", "yr", "kr", "zr", "Sr", "Rr", "Dr", "Cr", "jr", "Ir", "Gr", "Er", "Nr", "Or", "Lr", "Kr", "Xr", "Hr", 1681, 1682, "Wr", "Ut", "Zr", "Fr", "Qr", "qr", "Ui", "ra", "ia", "da", "Ur", 1535, 1536, "ga", "Yi", "ds", "ha", "us", "ps", "cs", "hs", "Ma", "Fi", 1110, 1481, "Ji", "Sa", 1687, "va", "Da", "Ia", "La", "ua", "ca", "ea", "ya", "ja", "Pa", "za", 841, "Ya", "ma", 1685, "fa", "wi", "Mi", "Ti", ", ", "xi", "Qa", "no", 1694, 1692, 1485, "ba", "pa", "oa", "la", "Oo", "Lo", "Va", 1111, "Zo", "yo", "bo", 1696, 1700, 1686, "Wo", "Fo", "ko", "wo", "Mo", "Ha", "aa", "Go", "Eo", "Ka", "Co", 1693, "Ko", "Ai", "io", "Yo", "ro", "ao", "ho", "do", "vo", 1520, 1673, "eo", "To", "so", "po", "co", "Ho", "Po", "zo", "So", "jo", "uo", 1016, "Do", "Io", "No", "Ro", "Bo", "qo", "Jo", "tl", "Vo", "el", "Qo", "sl", "il", "nl", "ll", "Ja", "cl", "Uo", "Ke", "dl", 1699, "ul", "pl", "Ta", "ml", "Tn", "De", "xa", "Xe", "fl", "Pe", 1489, "rl", "he", "Ca", "Pn", "Ae", "Be", "Aa", 1688, "on", "Wa", "Za", "Fa", 1689, 1690, "sa", 425, "Ml", "Pl", "zl", 503, "an", "Dl", "Cl", "ui", 1656, 1658, "en", 1702, 1710, 1724, 1738, "ct", 1718, 1719, 1742, 1740, "Ci", "Di", "wa", "ka", 1748, 881, 882, 883, 879, 1746, 1747, 1750, 17.5, 1757, 1759, 1753, 1754, 1761, 1755, "jl", "Hl", 1.04, 1721, 1762, 1763, 1756, 1769, 1758, 1764, 1765, 1766, 1767, 1741, 1728, 1715, 1711, 1729, 1730, 1770, 1771, 1723, 884, 877, 878, 873, 874, 1779, 1780, "Ol", 141, "Rl", "Nl", "[", 1698, 886, 887, "Ll", 892, 894, "Vl", 1768, "$", 897, 898, 901, 1697, "$a", "J", 1777, 1706, "Wl", "Zl", 909, 899, 1796, 902, "yt", "Fl", 1662, "Yl", " ", 1772, "ne", 1789, 1775, 1248, 1249, "nc", "ec", "sc", 0.001, 72, 1812, 1800, 0.45, "rc", "ac", "oc", 0.01, 1.8, 0.9, "re", "lc", "hc", "dc", "uc", "mc", "cc", 30000, 7000, 0.002, 1827, "bc", 60000, 0.0015, 0.0025, 94, 1440, 0.85, 1819, "kc", "wc", 1817, 0.00115, 502, 1701, 919, "Gl", "2", 924, "Jl", "ql", "Ul", "gc", 1835, "El", "Ga", 1832, 918, 1774, "Mc", "xc", "Sc", 1841, "vc", 920, 921, 922, "Tc", "_l", "Kl", "Pc", "Il", "Hc", 1674, 1845, 1097, 1847, 1848, 1670, 1671, 1751, "Lc", 1849, 1851, 1854, "_c", "qa", "al", "Fc", "Jr", "Uc", 1853, "hl", "Qc", "Ua", 984, "ol", "Wc", "Yc", 1490, 865, "Vc", "Ye", 1691, "mi", "ah", 591, "kl", 776, "ih", "Ei", "Ni", 1537, "c", "li", "6", "9", "M", "0", "zh", "Sh", "zc", "Ea", "Ih", "Ch", "jh", 1675, "Oh", "Bh", 1883, 1024, 1889, "nt", 1869, 1897, 1901, 1906, 1907, "]", "ot", 1623, "rp", "'", "_h", 1095, 1280, 1096, 720, "Eh", 1509, 1739, 1609, "px", 750, "Vh", 371, 1956, 1961, 1679, "cp", 1899, 935, 1976, "Ah", "dp", 1646, 1618, 1977, 1978, "Wh", 1979, "Fh", 1986, "Zh", 1616, 1981, 2014, "np", "Kh", 2024, 2021, 1948, 1655, "Y", "Qh", "sp", "Xh", 1931, 1514, "ip", "wp", 1935, 1785, "$h", "ep", "oh", "xp", "vp", "rh", "bp", 2055, "zp", "Ri", "kp", 2053, "Pp", "Hh", "v", 2061, 2060, 2062, 1954, "Gh", "Cp", "jp", "Jh", "Uh", 1971, "']", 2070, 1997, "Yh", "qh", "tp", 771, 772, 773, 1511, 1919, 1676, 1677, 1856, "ap", 1092, "hp", "pp", ".", "Dc", 2093, 2083, 3125, "Lh", "Gp", "lp", "up", "mp", "fp", "gp", "yp", "Dp", "Ip", "op", 1678, "Ql", "Li", "Ap", "me", "td", "Bp", "Lp", "Op", "ed", "nd", "sh", "ad", "Xp", "Zp", "Up", "Qp", "$p", "eh", "$o", "yd", "xh", "Mp", "Sp", "Pd", "Sd", "Dd", "Wp", "jd", "Yp", "Jp", 1868, "Hd", "hi", "_p", "Rp", 2105, "yi", "Rd", "Mh", 1619, "_d", "Bd", "Od", "Ld", "Kp", "Vp", "qp", "bi", "bd", "Xl", "lo", "Md", "oo", "Cd", "uh", "Xd", "_o", "Ud", "yl", "gl", "Zc", "Kd", "Vd", "Ad", "Na", "_a", "gd", "tu", "$l", "Sl", "xd", "vd", "wt", "Xa", "Ao", "su", "bl", "fo", "iu", "hu", "cu", "pu", "lu", "hh", "Ph", 2052, "mu", "di", "gu", 2063, "Th", 518, 519, 2101, "fu", "yu", "Fd", "Si", 1091, "uu", "Ed", "Zd", 2108, "bu", "Vr", 2114, "qd", "Jc", "Q", "$c", "qc", "Qd", "eu", "qt", ":", "au", "du", "ru", "4", "Gd", "T", "Id", "5", "Ds", "Yd", 945, 946, 947, 948, 949, 950, 951, 952, 954, 956, "Nd", 953, 955, 957, 958, 959, "Mu", "xu", "vu", 843, "Tu", 2134, "Pu", "zu", "Su", 2136, "Du", 2143, 2144, 2139, 2140, 2145, 2146, 2135, 2137, 1865, 1760, "Ic", "Iu", "Cu", "Gu", 2094, "Ep", "Np", 2091, "Ru", 1510, "rn", "Ou", "Hu", "ju", 936, "Lu", 937, 938, 939, "_u", 794, 1099, 806, 804, "Rh", "Hp", 822, "Nh", "Oi", 783, "Bu", 785, 791, 793, 797, 799, 801, 803, 805, "Xu", 807, 808, "Au", 813, "Ku", 825, 826, 817, "Gs", "Ki", "Eu", 1098, 1076, 1075, 1077, "zd", "Td", "Nu", 2026, 1657, 2157, 2158, "Zu", "Ju", "Yu", 942, 940, "qu", "sm", "im", "$u", "rm", "Vu", "om", "am", "Jd", "mh", "dh", "ld", "hd", 866, "lm", "hm", "pm", 860, 2172, "Oa", 864, "bm", "Xo", "sd", "ym", "Ba", "km", "fm", "Zi", "dm", "um", "gm", 2165, "wm", "ta", 848, 847, "Yr", 846, "Ra", 856, "Mm", "Qu", "Rc", 220, "Bc", 245, "Tl", "xm", "vm", "zm", "Dm", "jm", 1804, "Sm", "Nm", 1864, "fh", "Gm", "Em", "$r", "Km", "od", "dd", "Vm", "Xm", "Fm", "Pm", "Jm", "Tm", "Uu", "Qm", "Am", "na", "nf", "qm", "Hm", 831, 832, "Um", 837, 828, 836, "rf", "if", "af", 867, 2194, "lf", "df", "pf", "hf", "kd", "uf", 931, "Ii", "Gi", "mf", "ff", 1863, "wu", 868, "yf", "gf", 1972, 2224, 859, "rd", "kf", "wf", "Mf", 840, 852, "Cc", "Kc", "Ec", 660, "Nc", "vf", 2103, 2104, 861, 854, 858, "Im", "zf", "Sf", "Df", "Bm", "$m", "_m", "Rm", "xf", "cf", "Fu", "jc", "Oc", "Gc", "wd", "bf", "Tf", "Nf", "Ef", "Pf", "Rf", "Bf", "Of", "Lf", "_f", "Kf", "Xf", "Vf", "Af", "Zf", "Wf", "Ff", "Yf", "Jf", "Uf", "Qf", "$f", "qf", "tg", "eg", "sg", "ig", "rg", "ag", "og", "lg", "cg", "hg", "pg", "dg", "ug", "mg", "fg", "gg", "yg", "bg", "kg", "ef", "Hf", "If", "Wu", "Cf", "jf", "Le", "gh", "Ne", "Tg", "Lm", "Om", "wh", "wg", "tm", 941, "Pg", "zg", "fi", "gi", "ki", "Pi", "ku", "nm", "f", "$d", 2041, 2042, "Dg", "Cg", 913, "tc", 907, 908, 1809, 1842, 1797, 1837, 923, 1707, "Al", "Ig", "Gg", "Eg", "Ng", "Rg", "Bg", "Bl", 872, 1882, 2284, 2253, 2254, 1736, 1799, "zi", 2296, 777, 1622, 1625, 2310, 1893, 2314, 2019, 1599, 2315, 2326, 2327, 2328, 2118, 1866, 2329, 345, 1877, "ce", 2013, 2361, 1530, 1518, 2387, 2381, 2382, 414, 2420, 2426, 2334, 2335, 1649, 767, 769, 770, 2432, "Lg"];
function __p_SuKx_MAIN_STR_decode(str) {
  var table = "C<(~NU>`QT{;]ARg6/^:O}!j_?bJ0)V\"*[=|,+@MYa.#BEeGvyW9wmFsopLXz75ISdlt3xhP81uD2nZ4irHkKqfc$%&";
  var raw;
  var len;
  var ret;
  var b;
  var n;
  var v;
  var i;
  __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
  for (i = 0; i < len; i++) {
    var p = table.indexOf(raw[i]);
    if (p === -1) {
      continue;
    }
    if (v < 0) {
      v = p;
    } else {
      __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
      do {
        __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
      } while (n > 7);
      v = -1;
    }
  }
  if (v > -1) {
    ret.push((b | v << n) & 255);
  }
  return __p_1oWr_bufferToString(ret);
}
function __p_SuKx_MAIN_STR(index) {
  if (typeof STR_CACHE[index] === "undefined") {
    return STR_CACHE[index] = __p_SuKx_MAIN_STR_decode(STR_TABLE[index]);
  }
  return STR_CACHE[index];
}
__p_vU9y_ast(STR_CACHE = {}, STR_TABLE = rotateArray(["eN*u9Flw=D&sjMDf;A0iN@rz/_Ci}o6)cS0iUNVK9jKX$xz~!fc;EU>", "m3B^EU+Q:9~UP8I~Thx=T@*F}?", "s3I;F4f8", "nNX^EUxx", "n%}vQ|sx", "Tb*2VNWx", "n~\"%Pc(8", "Cei<iFxx", "m3B^EU+Q:9~UP8I~Th^vF4S6t", "eN*u9Flw=D&sjMDf;A0iN@rz/_M@[XY}9Ny2@vH\"59|1Al~&/NP+li\"8", "m3B^EU+Q:9~UP8I~Th2AT@*F}?", "eN*u9Flw=D&sjMDf;A0iN@rz^DSk^ykf>HAC`|%DFjijAAk}#f_%", "/NF/;~_8", "#fc;EU>", "m3B^EU+Q:9~UP8I~Th2AYRYYqzXE#M0", "<NM_MFC{29Wo:.{", "?dBiVM.8us:BgAYfD0.2wq{DqzBR8r", "^NBPoV08", "Myz@CkPFn?<|Avtey+E@@49Fu_", "Y3<Hk4O\"29BS:VI~ddC_", "jW;^JkXY:9;1OJ*}", ".A5@9qQ/59", "Ap#%\"2(8", "AN{DPzW(", "7YV\"<8`rD/W", "y=9n[i<m*gv5a61@0P5wHZx)vpWXMH5VV)fNeiU`7oP;EN", ")36Z\"|c)XRNFA,.b|u)\"WDK]J5:x?U", "@/e0CK9<ElJdp,^0|pQV#IU<", "*~jy,qA`dgHe/6qJ0)_VcE#x[T!=<", "!g[>,Z|:HF1oFys=;pwnLeZfG}11Vb=/:^w{L8gxX/lRkbc!", "U)|)Y|CL`", "33.9\"G;?xA8z&yl,M3^nkX_w3Ft|nz}apvf0qX6Lz;%h|b}0JO^9<vb(", "Yv(8y9~mt:V\"jbF=9+(*`4=w=FT~@A>#", "iO!spKueTsR>CPN#n?Bn%q~m/TBs}vubn5C[lv!,=:0/C~{", "VgDnRxTrCzAO$|u?[YBuBI~?T/xip?z.MO(9RskpHT|xo~X.z3Wn_wC", "7R0{J|kpXO<+?vI.:zsw_pj:WFrrnz#?{y=)bZYY^I~j$gq!bFqbyy@^@A", "d+!NZWi>&RXX#(>_7R\"y]xLLKFi;WyL.7\"A\"S46,)^Esog{", "[F=J@yda0/hIx_K0BpxbY3bSa/\"xhR(V;Y9)++PacLL|\"@(V3>SF6s5u>{h0<", "L+;n^k33Q{#`8k%)u;P1.|r)pdi<},>_uC", "\"z.)1v9Ii]\"s}zKJ!zB)\"11ABR`G;bY^qhq`cx{Q`", "|3*1kk&fLRle6~~,a9}u{x*w:F(VNPpj:*?Fpe;:Ggce(?;:%m3)>WC", "S5hsjxC", ":z.Jd8[`e^AA]gc0~I[8s9mjw:>LBkT", "pEY1GH7aDd>3lH=VNgF2}YB]}LHQ9L?jJgPyFm(QJdXo|Rb.vFoTjq6,4^@", "%=P0yDLV,AO4Nz6Y]#~", "8E;u`s#xq:A8[A1:#P42EHC.US8|Jb5VZ/~", "+)5\"wH)G<T}H!UQ@>FhsmH<AeIC[}8P+", "d3e0=|Qe6l<ZV(%j39a*Dr.VFA", "RzN`R2jmJOj=<", "e3uQAvB_9F!A1N", "`)C[{usIBQ(6=?:J<z[9ze=fk:rg~Ht?_u!0:", "`F`VoI~Ak]Elg@C_y#E{VPBiII`TlA;", "7+kU58mA2/c?sRIjg]h0le}|YA!\"0kgbad(", "Up@1Ax=uv]*2oz,_jT&9ZW&wXQ^JGHV.RPTDQrReG}CFNgt^VesN+|pj_A", "E5^no8fe,Swi~h7|>N2m:5D)*pPhGgeY", "PEDb)qz_FL;V#@maY#vy.7X|1RV=(rrMIdx{ZuvS<IfrBk5VsY`2.iv(", "HRC>EDXq#X%e|Ry=}>!N;5qqggZI_~", "BbtQ3s*SE;rQhx{?[]7\"%@tp=I|l2P~/{b^*?", ",j)\">88_MS[~n,,VgyCV\"Po(0XvX7,U?|Tz{)PUD\"}$S>+fYt.zn\"F\"aX;", "l=UspmBevl={7vj=d1J)++<:dgum)vJ.Oj#*RW<DEmb", "rh8185B]3F1;1z+\"", "l5@1ux/|;XDe)N|+9pc0f[KeJRGR*kt?", "@+81_pKf<TGxWH!YB5ey_pE<", "$R#nJqgA;d@/<vpaQbST#+Ke9](8rN%=", "adj>+D_,oO]v5A,/P.kUKxLe(T\"5q_]", "ZoDQH@Sudp/_fr?0{*,)(m$=Z^,_<6D:\"g@sDxn4i^bx`Mj=PC", ":p6[OkY,wF[4C", ":>R`|ZifN", "sF#*h8OedT8*dN7|=TeN`f<AElqmQMqJKC", "Qpx0.12e`s2Q.A{ONj$1NuO(", "c/]u<v&]>", "%5Nn#FM`VlxI<", "B5Zw[GLez;,", ":pHmDvRe*p4Q<", "Z06[[7Kfv^GsIL^=oT[>MyWwQ/|_4R]@l9nbWy$=8do2hA7j", "69CJ!ZP`V^Ms$~\",", "hTTJ[|V_ZQ~ZSvY:<pE2.7fe#5ZN~ho|)]I2m+I<8/:v_X&01.~*BH=(", "%9+wKwu=rz4<q,P:Z9Us2knpkFM~BJ&aU3GTQ4M:JdxhC", "}FkU1rsDKFW1nvAOl1FsqWn`3FE5qN", "5vLmjXi=eI(TsRmaAyl9[ZmqOFT3pzrYpbN{sH]w<^s", "E9/J%kx`rT*=Ly[ju5`[u,9APAKt]k,VQpM1`,rpQOpw<", "{jA{}Wy:SIBNKXc=jg81eH@(", "H=e2qPB^0R9x\"W{bN)m{N4*(cOawsHF=mEZ05uj)ZQV_5rU#71KWc@],`", "%QJ)DkC.8dtg*PM+70}`2x?|^F2nZ@_0d\"(", "Z/bDxvsAlz.ifydjiRP2wMSfB5qhQk5/$d9{/pC", "A]tU^xC", "%;F\"5mC", "rRy>0ia|9T)ARU8\"^<", "H=y9~e%4.Rd?ey!=IRJ*J|n`D5;{8J+^u3rQ6p~r5QPi!@(^;I/9nub(", "RPIwSsYV~", "=+TZR5+|VX}LmN<Voj*V15i]Rgzi<8>", "GTTZIK=i;XlXxva:WPu*&FOfp/{6_~b0(z6F]s3>8Ow2C", "1+W8^x}`/T", "<yYFtv6(d]}\"PbX06euU^5#p4QXRV7ka|g9nYFBY6pCZ~k.buC", "|FhPmmP<~]+lP@N^,9/9,|i]|FktW?NVvbS1r[KwZg", "b)~)TfJm8dF", "x9<F%k\"xQ{JL_Gl+%.{8Yosj0/jv,kT:2=R\"Ar/`4]((~WP@M)~)oh*wU", "?z,sn2.(2mUL|H^=7X`24pC", "Yu@00@eY^:;+0Xz,oP*1?X]wq:Hzj(cY_d4>.1X<L;Xy$knM]P\"y&2wfG}Xn<", "p/[V{u]hYOxly6/Mb3Gw?Y8^)l>33_/O\"]+`?", "@3b8qW3>Vg,~l?x^p=<>NmUa<z;4*J6JiC", "O>F\"#7/)JX+{&?*_$;nbi2ffU:|{x8J/b<", "ZduQFn*_XR", "UPDn]2PD*l:~=?U\"*uJ)Rxuu<Ix0F7T", "y9q`9+5L.dceHyt/e\"=J%wV]&;W0D@)/2\"wn}p)GhA", "sj2U@+{egl@23~#@8E(", "=+Bn1pCVlI8ecR,/Tewn:5MAS]", "[z]n*Y=_DQ!snvsai~8Fqx_VwA]AZyDbOTtm%q9AHTd^G@I/15C[x,C", "5v?F*FpD`s//SXx+G9CF+|D<R}0J6kn:t>l*Fm::JX{~>7\"j", "D5<*r@?G]RR4*Nnbu9`wNu0_zoe`|b@?h9/Vyye]kzFl|h(+", "4dN{9ysa>Si^qvmY(z.*R21`]}{vkRk0h9dQ", "##aJ8zl]jSe2H@6=%;19.i[xH]kn3z|?.Y_[bX))2Xlnfb}aKX/*_@2=Z;Y", "`eXmDx*SU:neYX9={]Fw&q+p:Tqn7_RO#Pr9FM9q[g", "BdMT4Ei]%Oj5?6O=O>o1#h&w`Sb9[6Q", "|zu9r[D<CIxg[6l_|b,u`5!QBmyiq,d_FRRs1,OiYOhyG(", "kM3{)ii_STjABX)/0P%9?XIG#RSROG3_", "jY)\"6uG<~FXXb7p0pXqbQu3_@Lq)Dh7|9F7NoIf]{Xv", "}O3WIM%|NA", "a3>\"FM;xSz]+>UrJ{32m&2D<", "q,U[QFx;x*Si@\"", "52)9S", "DMym(fkk0gR", "SI{eqq]*N=LrAx", "A%~.p", "*i%PsD`T", "3\"@=UoACv(y", "hS<$F1X.", "(w?#]f]*", "_u|)V8kxs", "bS}88r!.", "S/m8g#I*", "b6WDp\"3.", "={Oika?*", "P%)ZPgNFs", "?bR1@e.e&", "3u4:Nx\"Y1,e53yA;K{V$b", "]{)ZpMe.", "RlUI!eQJ&", "RHB$QNS.", "IrrI>!<", "Fu=6F1as&", "W7.ot9n%:", "ooI1[uL.", "_Hcg|oa.", "a9~4voj.", "&&Z#|S3eoV25.", "1/#sNrr.", "J/EbS6+Z3", "[%wb9Wj.", ">rSE_lDKs", "lbRdt9:Z:", "?mWNUigl3", "%W|)l08.", "4WGss81.", "f~RZSB3.", "9:f|0eg*", "1]ur}gB.", "5yI5IWU%/", "VE[|91cZ/", "o:nb4AHl:", "IyC$Pe}*", "DLqEw0R;/", "%SjN%=%*", "7/?#ESM%%7!M.", "N7J:#9m*", "3u4:jym)}VR7D3", "4G;NTeH,s", "+AK$uMw.", "q/rI\"WU*", "MGcb3am*", "R(V$V\"\".", "ar:|)", "`1j6vCr.", "}Suo)f]*", "Co3sgrZ*", "C_#gvf@.", "[(y1QA5.", "KoXr@", "Y&DiSAg*", "u(V$|fp*", "[u;bJul*", "Fr4$\"!<", "7_msS8S.", "r/jI^", "|uWsF0%*", "]_sdES<", "|u/3)!R.", "*&zIQ4xKo@u", "bA[Zt97R&", "vw}|XdtJU?", "WWYDyMP.", "A/J$", "TU~:kSS.", "8oW30a.@>L~r.", "m_g40e#.", "ZrV:", "Qo}E2B?*", "FrvIY6A):", ".{V:>f3.", "ro#g2rj.", "CuK5oN!.", "3u4:/y:=@%xZ:26C^.", "xSP#p48.", "BrE#vSy*", "QUqZqgk*", "a/=bKdp*", "31xbF1yZ/", ";w}|#aVT_@", "2Wp13as.", "v{:8|fhiP~d1O&", "<[5of6Wxs", "H+o|NcU*", ".Q_Z*A#.", "#]C|lJnZ}VAQ{g+", ".15o)S2;s", "){[Ds6y)oVS5.", "P,N8k6[.", "3u4:ANsaaLKG7AA;wu/", "fh;#JaP.", "chjI#aVTCVRy)2?l>{3D", "a9VrXdLbs", "3u4:)F%*", "$Lsddy]*", "G_cNJa<", "_:]IW8qO:", "*{{d(fk*", "}{[D", "rr(vT>N.", "=rZ#wJO.", "vAV$9Wm*", "X]?D74F.", "+wZ#bSm*", "frRd1_r.", ")u5oK", "4:(ifus.", "n]5oK", "w(AbDu?m:", "T7i(;5f,:", "]o@6cSF.", "~{W#_5<", "Z?)siCl%:", ":(YDKdMZ5xiLO&", "6G}s0Z]=:", "1_V:Sag*mhweC2Zl^.", "aE)|CJA*", "=rZ#wJ<", "z7}d>JYs3", "3u4:(h[Fn7GMV{=KR{PIx#g*", "Yu#dfdj.", "A/[D(", ",Sp5+a)=3", "kurIh#K*", "2|u:n0EZ:", "8o=bP8<", ";$j#1#m*", ",{W#5akMdGu", "_o;4!>}*", "hGcNJa<", "ySC$F1fK3", "`w(v{zi.", "}oL5wMB.", "!huovSm*", "0:1vcZx*", "X+[D", "%%MsTgP.", "|uvIK", "!hb6kGL.", "3&@4(Cy*", "t7)1XS$e&", "#+3sLAx*", "+L_8(o]*", "#h?##aVT_@", "17gboc(*", "3u4:grC*h?2s*2UC9l[D", "2W*#4A{.", "){jIr#g*", "WrzI?d<", "<&od1Me.", "b{)|aeG)h~", "3Aq$uM=*", "i]l580}*", "+#8T7M=VN", "I>tQ", "syz$qVe%;lP}V\"6V`w*T{VkE:o5|KC#]%we>0]V%/T;Qp\":Vskm0Y(8Eo{[b|\"N:;l~0zjo?+}YY@>%", "j$4TlmP<", "j$4Tlmy|U", "*vKPS,g<", "JdYJ4Ea<", "%XB0^", "}WwPLbw_LB!d6SN_rrVB", "M(w!#&H^#;2@<&E4!\"{<W;)rD5iQ:5RMl(UXpo;.,lsst]\"G}\"AQ8Jf`sy$F]E(\"Q&HoN_H*N98JjJ!", "_Xl:D>eN", "_Xl:D>BW$", "G[RSHSgN", ":#M1w^z&", "KOewiwN>", "^Po1RrV,U", "D5\"1CGJ(", "D5\"1CG+{W", "[nAE_5.#", "g9P#<D^p/", "L&n/jBb1?", ">a~o(8)pc", "o(J.FMZ{B", "{x0Ml.LY)", "XPCTGyow>", "l$+D2P/%", "EEt<Kb=S}g&1yOrw>%", "+E=blzOS", "};.AA2m", "O\"ge&a[>ugARSdu", "jgOnZrb(", "3~Bg(A`[", "559;^", "NnHp?", "[I?8Yah(", "p>DtOBCO", "x*n:v3x\"", "x*n:v3]D:", "v+Q;tpTz4", ":=qcN1jd", "yh)TB0uoH=k0]y\"Fd5", "A+OJN7Gd", "cA#\"d^{d", "F.(GjYTj", "2H4~S", "}f.qx7zyP", "v=U&;xT}%0hCeY+", "I,_<}", "?DB;Qihn=", "R$}Phlyq<%", "l/&@0", "l/zb0", "l/&@^", "PtrQ", "l/&@%", "U8xi?yx{QD`Pwj]~}.", "49Km*PK_NpCFyz]@?<", "^`i:<#$s3bmS@,URy(uk", "](Uk:ERx)", "?.LoDC5y{L{z7u", "XQ{nJwPi(p21ZC?e", "r%<ZHp]6", "Jpa+zEd.", "iRqKC7?.", "=;Bo\"O}r{98es", "BFSEx+}8", "KmR5UC@6", "Jpa+zENB%", "@BtP>k#+WcY", "{pR4ECc6", "Apn2Z2t<", "cVCj=cJ", "TBjRDR4;", ":`vzuD.)", "&f7<E", "HwtR", "e~q0mq}", "D3;ZIKEe", "H.QXq!h<", "AmgH228=_]9O<*", "~~sP57G=hg", "CI9QJ", "nXOnnrSf+:", "xeJxxv1o.d", "b#Onrre(", "lT3n#iC", "b#OnrrLVB/3l(U", ">NST\"Z,(", "?jH~obj||zxC)J6qX)5._90d!4GExJ;^DK3k;29t=QvO^M|%m:&\"O3:mi\"MVGU*@^}]\"E*ipgj8g*hKJz5B9R56m!4p!URwpH>o|F5gZ&Qzh`M#A]%HY;1@8\"(5IL{E@^9W9}ertu~zhrU&Fac6c~Z;", "/dE@biL/u(toq+", "t0%;tnF{t", "iy+{:pM2", "!}E/{6]2", "0|91nbOX", "..S\"l,~2", "x}Y1KbZ2", "Vtv=O1|8", "|J:i#U[x", "teF@6KdDDz[", "4k:uvBO\":9mRulay", "4k8iOq5q&P", ">*S;4HB|P", "eGa,kDZU}YHC:", "/@QyB", ";PxBXP2F_", "/GQyH#`VV6", "ptK;=MU0`?.9EX2zGd:,oBz{d?Pl[|c)|neP=.AG$(Fx%!&7isxU6#QQc#gzcA89rNw1#V?G_[a*lKr", "W](nj1)l", "SWrw^;VvPD*#[", "PYvTr9u7QF*5f", "Y$qhSVZa", "pix5MVva", "jz3\"k9s/Uo_!Wd+", "XIP2,JZj2L!", "7pk^(2/\";z+oS!0", "nNb@5i\"8", "?!(iiFmYez", "{Ni242Ex", "oAm%", "^NWr/wIx", "gWruhM7{iLpR[.&6FbODOq!8", "U;[n4xX)B", "7zwj", "LOCm]uFR<$bJu.8u\"S_jEuGzskQ(TcZ0RSF[d0uRPj<WK.suLGvdIolzkE1/(.Ms<$AdCYk*)JIIg[R", ")8R9HF5I`", "l;2dTD2yT9c!?%7)MC]V", "l;2dTD2yT9c!Qu6yvvA9", ",Vo`b;2tbX+C*;]4`E/*mX&rAvklYvQ,WVaN^dX}?W77H5Ex@EIlc!|%7(=q5]VEl;2dTD2yT9c!0!`", ")8R9HFd=", "hXnLqLa=", "_dijCm&D`", "1I?Lhnl+e", "|OKVUh[@b", "7dA9\"5i:V", ")v(nqmuS", "Y$@=4Oy$@=4Oy$@=", "q/)L5@/=", ".bt&`gvm>F!ldp;u>yy4/nCpo0r|I1}%k>yk9XT6LNxg:0:4,|3&tPi.47~/KS1f,w([:iz\"mW`P2\"r^#/h,u7crh7U%F0,&qQJ:Vmz\"L7w0,u#4[.G:hgEI>F!DnDI3<XndEz6pp3UlOu/41>|1E5|%.vIgEo=EtYFMPX4kMCA/4P6^7@x:\"Qh}ECk_{urIFb~:x#i!X3UlOu{4//MN@z`hZh@,@e7*v#,L&j,{lHKXNoY(s|S44tq_q_J1Y|;fxd_4{g_:GWrUpCz&Cepl&\"A+thd=&z0)=HbVP>zkLi=q?;6~L@fj=2]rcio_HmA+NY)j+#5=)(]V~m^Iu)Dn?J/JZhmaXzy@[XU/Kgdk=X#!l|J^|e%&>Ppr3X@<878][X=k]Z8:.<zOIP)y5@MlN;~:2h@BnUAEedsVckGwTY/H%e_49e\"^4t(r]YK{gD,+s^?&AZz\";Fy[r4mum()e47x:8hR=QgAE_XRVqg|%1YNwivj_Zt@B;2sX|0,(2v$+9Y6^FFLYFTuy07ryBd54u7N&whd=Qgy@%M>Mi2GV1Y]Pi7?D:>o*^J_r47,(pz$]s^N9RZ*\"\"Fy[r4mum(>[47D_whCz.zAE4#dV,#|%1YNwivj_U@@BJJ_r4C1_87s]s^)LFFLYFTuy07ryVu54u7t.ihCzgU=rM>u*G2GV1Y]Pi7?Dl.o*VDsXih?<)CS_$^8jpQ:.QTb![m:4g>V?=6A&2hq0pzp*L7WVRXVN108Mu5s*_@n,Jo_rvW6_fxW+49:[lwBg\"<bWe4_^A0]q|;tpUh5ImUu*&.`LhL_Q(T4U;;yr2f.^6?(r!W6_J0>f,)wM\"wBkXbdWjU},A#e`{1uS>G{ky19%9dkN7yGV1Y]Pi7vuLOu/|6Q.c7S\"h0~}Yv|*EQ*I.<:^XD*Iu)Dn?J^MYGSkB49%BWtk_Xg)1YNwivj_1dQ:%q?}^78Y87;tU(v9JgU&{TuyQ%&Ig>0,&\"pS9G%GI1fx&MM/X/`=;vX!EdI&id\"5$q@h3#s.0|;f,)KjJg]Qa9nW,CL%q7hZMMB=U34|r4b3z(/NMmHp;W<pOxP^he3&.nRX\"FM~n;}f/#2Bog/hU(r[4Cz&1>O[l7B=}p?Rr4+x[.`L:2&SL7bn(03(%lQ^*t_rt(9)t7}{Cd<[eFL.M(Uls0},`)WL\"kEIo0&,2\"W)PyhMEkyMk75jSuGr@d]qc!trzNw<jeQ{s^w`WZ../Tf,i4\"u#XkN477*:hyR_`I@{/{Mx5U:,HKQm;$]m@,9zfsXipx;NfY{(MA?$#c:?9Ybu`5yZX|1u7tpUhurLIV%DV?&{m\"\"kCt!P%s^~Vg[I&_rPXUIj;f@Cd<[5is*&HGOjUu^fXx5wM(p}pkN:vz+P/QB$?dkG_,RJ%(4kV3qrx|}P#A(J0,3$jR:`Fqt]HeVH%3ubwq9e;X\"ihgn1z=r6je*1k{FnNLiOx:4tM%/7.B{C_9]Ep>f%#:[Ez~M9b&g?hC4$;>Z{1OWNCiB^\"V%DV?&{m\"\"kC|RP%bD~Vg[I&_rPXu(J05tRG<Z|Fv%03:^4C64^w@[QMDYehwII1V%DV?&{m\"\"kC|RP%bDAtn,RLU:PWb.KCpDkb9kJgqya#!lWPM%;dw,2LCp0GShFe7*i7XVoX*{~TeUsmH_tYGZ@56!Bh!5Xe]fNX([ZW*\"p(Plefu^J>;4ppySN3+C{1G+j76BRg\"h;vF!Bxa%|etj8x\"}b0]@!v}x\"#W5{g<*c<jO\"C?,_/onMMW/[7PNNf+xn7h:d00p({7!BPa@)VX#9D?Ivvt;9]D_@w|*2GkW#T)4cob,EwQZip}=o0fZ,x?r9d~,;5Gw{{]P:|hu0d%klq={e{gFIC}xg,W^KgCDy#hb`0U,NW0[RLpp{0cGQ5G+C.hMEk8r1Yw!Bx!ygVX#9Da*]0m5`]X+\"(B9eUjWp(I[`0j,_/d9QMK=`paIh]z*i76BRgQrnOw![@lr)lk*Zy/}+C{/D7hf\"#J,oG_p&H~yco\"uq,ReJL]:oY!0um,3sFaN7yv\"kCJWBxa%?M@Bko$YsCA(2v}{Cd<[eFtr!F~y$m#y:;ynDIDrA_gn=2|_MVK:$?7JMC}:Bxu+=Hf5/QrrAvSyje{(59W5!G2.^b0OIP)y5@7n[MPp%p(Ryh9%&MH/d0!p5YPab@GD)l*BNy\"}|{13`]ju.wSlMG5BNZ%4u`]y5yg[RL.&*G5,&`4*+bbVRXVN108MRupDF9X#ck<}]v+;gra_DwI*cQCD&H~[Uvw%KyLnP1m=!X%GX]V%r0&,;5CNy04Z@eBx}Mk*Bmtp\"FD;brLfWb!VE/&S`[jO;oj,ud9lL1_S*Go%{1G++MVBF/5)qNhkaPY(g+W9@ti_Fp?4%U8I6>v#&#+&nNAw&S`,UO5Vckj=30kI/xx%YdfVg;q6=9giivl)_.&:uJr:H0D;brLfWb!VE/&S`[jO;oj,ud9lL1<g^G1I:4@@|)~,Z@d*GFt^27lrbtx:sdaWN[W^8v,rUG1Us74F<TWWQh)yNW,9D\"~:9Cj%9D9%LG}&T.>{~TI78|14E*r#Jo*kN[C@DdAE(t6B2g3ma{RQLr3u4MAq2L\"Xmv](I1dxwywFCZbhRFRmi7d_tMQ^oxxpN[])n;:tb/\"V{g>=V{BpWPKyv5wZfzdk)hZj+hV,>(0FNyv{lHgvAv[(y##^uJ(r!vW^8v6IP>|1u7.:2hAwJ5Yucdr#fI)Bo0v(yhy@qQjNCL!p?0ZW$m*3tM?/[mq_b0x;NvT@jb:[wFCD{#I[Qh&I?@pl*7W/mv1,@]`_o>0FTD^SL7date&)MVJuGU?}]0=\"90exYu+kFW]pw{LW=0},d;x9h1#:RYQ_oxNxa3.B%j#MWWUQR|T_Dw)5/pgWyY)yXr,&n,K:876:<T9b`0j,zG[l}zGwP0ShFe`,s7<Lz0qp\"_]|!dvu{v\":0yOkmvk5XeD3&#KjE#c:><`V)u>4|<_4fzmXP0&,`]S@Hj)LF28rqi<pECQ@#d)?`g]rmYl(gD=3OYj/$#!t4b`V@;n4BdAq&\"!pihM5s!0)kwM/fjbgbXg!&uL%uy.^lI]rvWo_N|.t,Y,5x#s*h<.77Ch4$;Aq&\"X\"8hq0qg=r,#RVCXCQ=Xdn};b@o@n,8?sX(Xo_YfW+[X)j!Zs*|##!.z>4<v_U|;3\"UhR_&zp*pbsVtkrM=XYkpC=+bt.^|6sXipK{X]D_NYtVAZ^N=9.77C~4<vpl=6#:Uh0_/pp*si4MRokkk7%gc;&D9@.^VmsX.i/_2v&3s^aN#FX*>F>7J;n4MC_U|;`{ih60nUp*v#KV,#5JLik!@;@,P@\"jLDKX>OC3)CG3[XhBTZ!t]HeVC@<40ugd|;~:ihO&/p0)}MsV,#(M.H6n};6~BI.^ooKXoX6_2ve_AMzM+#8:.FAP&@h439Ze|;,}Uh<ZgUAE^d>MRomR.H;!};A&d+.^Nm_rmY?<87*39Y#^c#W}]</^Avh4t(#ZgM$:th@B[mp*GbP/)X/J=X(UP%|&2f.^4J_rC_:_DoT+OYtVmZpM>FAPL7UuVuW5u7a*2hXI/p=rF#M/z/dk=X3RP%+,Y@LMO6KXih8{+@&+OYf9dFpMzF`VkCh4q(S4u7D_ih>Bh2p*t/KVck_Q=XAP>;g%9@2M1@#_s(8{2vSE9Y<,c#X*%(=PRu#4~u_Uu7C:th@B92p*,#RVqg}m.HYU@;348fn,gDKXoX:_fPl+$^6,u#<}\"<=Ppm!uMC_U|;{hwhiBgUp*{#M/M;mR.H;!6%(4[@fjxJ(r$Cy<87W39Y^MFFY:S#APRSn4k734gMD_ihtZ#z=r1bM/)Xdk77<PP%|&8f)?Po~rci;3r7AE[Y=k$#KBS9=PjD<4x0FZgMGYwh*ZjU7+}MP/A.gk.Hp!>;6~uy.^oo~r^7K{pzH_9Y6L+#{{GN`VH%~4v5~e|;epih|hnUAE<M@MRo(M=X|kt;^DO@o*OmsXS0:_)C8}OX.:FF!t(#APs0>4|<;5^Jw&wh*Z1zAEA5!/q;zkk7#!P%?DP@n,#2i_8(l(87|_9Y~^c#Y:.<eVjD>439i5=6:_whCz&zp*A5RV=0~MWW:!7C$}P@.^K?_rcO?<r7*3NY6^c#{{e#APRS>4~uplgM6Y:h*Zfpy@(d@MRofm=X5jt;v4Jf\"jSy]rmX8{KC`_$jCBmZy_4bAP$mF4/|)?u70_JpMnpzAE!7U/z/(MWWHjX@^+%.9kCM\"}vv6YDoB@>w|*2GkW;_peS@)y{YenYDx:tpfC,xMx*)x,%:,X({IGivvuqyQ^^t5BcFKYh0~}zyP/`0V.Gi>7)u=,Z7eBAyv=c7*,)xNxx@`M\"55{<{JMZ7Oxv5Q:4J8.e{gFKSl)Et5V*dK*aT`w&CsyB_Ge@zZB%Gu(yhH&T7XVvX#&|94G@e,&KV%#Og@h`p3@lds]RCG^KgCD?9{4EC{^w;1*PLsgH03rox}%TG,L%t3*5v)GRQs^y0\"5*J\"}y9c3*UzDQ(AqXQ$w9ZY4~`U,Hw+4NGk*zCu(g0$]QVj/V0[..FU~!|Gr$7t#cWJ=ehU%(4arWy`1s7b/,0$*U|hu4M,jXnp.LG;Czr}xwy~,/@,{GN=w8|uI>32`T.6!Bhi:)u&3/@6B2gt&aT+gK|j,@9`1ZnS&a0#%t4b3Q+,LYLN_<{$aDehuZu[lAM%k3v(/{Ch(Dwa*Qg*Ij(vpoSNu4M~eRL)BR0v@\"x`@1@,L}@Mr?vUW8|U%id2utP`{+74/lds];#J^xiEB7i~br|0IV*,5PL>gE3OwWo|_>)~,T.}=lvxg:0:4,|3&tP|}RWe\"8\"c{0@#B+Q_pXb~[(v;yFtwu}zI*rh`h_zV_:ykNG0oh;_oM8|JyIY2`lq1_3XO]2743d(<BiQW*FT{pr4~yK>unNGb/DhX5S%jxS0ykjXbhqNDH|xNxqOX#uJ$tvW(rfP`@g(FBc/*\"dT5^yz]ucdulN;b/rp~Z*]**3.<MXU{FS94G2|K^_.G:Ty4kdhG.Nv(}r9|nQgCD>N^y;7k%q7.9yJ}=<pR0}U**\"EH/d0!p5YPa8;,3}Y3&WMF}|{E;XeS3,wHlXW3hGFLWVm~yM7nL2LP.0G2*7xu*@;<LqXUr/X:HvxVxk+f5<oM:l_tIYv*D(*Qd!Zg/m9ge9Dj,|0G9{17}<pjjNfe,o/LBF/h{;HAU#@Nu4Exe{gjBcF(r0|eE;(f9eU_p|{jOevXydVU#7p%Fh7e@zr+xR>`L*t+TbX]U|xNxqOX#uJi.mX!DIuWD\"9F,ogCDC<Pl=]M,Z({l[Dg*t3b%T47+>uhMi2GSlvjQGPK}5uT#CL3\"]vn5Vzhf}/S*fW0p`T{p?e!u^*,5PL>gcG<h65V%rd5Nif3{qNLiP%M%n%qLhMfh*_q_J0W3OuN?Fi]pzNLWt|]yudMnY1lSL3vG/x0)KjkN~:bh~T{p5;,3#Cd:YL@hW0s.z;W+.wa*ggPrCW{pnrKyNWv9{1;:Wv](7xV%6>H/d0!p5YPab@GD$y210yF}Wv6YIxu}G(;##WT!>FXe|PU,0(dL%71So0Liv1H&Q#VB$?!V5vfR003(yMx^Rorr.FH.z;S3:)5/7Qohi()yYo8^9*zZYDA6YGn03D+xK>jNu:{F5XYkfu[(H9;5*JF}QhN;.hh(hX,5jgGp,WN&\"Cb,,M|n[M9krpR0S%+xD#t/z0bhxTFj/|hu0d%klq={R_>3/Qp+0@W^#Fog;H_y\"C+,o,4lppI\"sGMNNf+xn7h:d00p({7!i7Ox<WZ9)LL:?_N]!|q{\"#W5{g<*c<jO\"C?,_/onMMW/9CQ_LI`@b^~,d0Ur1YYh2|14vlQ^ARt!_0(@7Q8]t#z,iWM_3Wb!Fe;uq,&Z]1hmmv](!I0)=E6BGU_TMCYwVPb@[_xBxJ$.c7>5M5uD+tQdpQKB_{Plnr^I5yxZ[MuS@p~Z_zV_:ykNG0oh;_0W]ow_xY%VuoU:?W53t7cf/#\"VXQ,I&<{p]7j,@9#,pp2:}p~Z*]p*H>H/d0!p5YPab@GDulFBByM_v_V#!|.t[MnuXQe&z_D[%Uiy0)QdNGjhGvhhUver]/OM(:Tp50<pl|F^fEJd/PL_ehgIIuNxFbt&`gvm>F!ldp;uE(IlhDhg73,,L4`@j76BRgmB0CGHl|F^[_&BDqt!_0(@7Q8])XLuXQe&z_D[%Uiy0))eh1lSnG,CQ5}%%dC,T.Kg{{Z!aPHrzj*Bey;_I#>5p%GDU(=k\"w,g9ZgQEd8y0)JuYG$tE39wA2|_*whL}@Up?0$T]o^D1,0[xJ0.}(tIYv*D<Mqd>zIXpGgQB46y1>S`OM1pth^r}UB,:ykNG0oh;_EH.5PtuyT#%J|{}Cu/3;$}t#34ggMY,_D[AvH,9WMl[Dj=^3xjm5W)mb`LkGBF\"v/H%e_4fMZ9FP,}C<0:*Ua@,w<ZHG::vW)45]4^Z/_U_17Io0I|m!G3g@hM(:3%HY2aF0KyEu@B(tM:VTb.NvCfy@14.wCDW_Qe(|%^w;vqNG_6cGQ!>hV%,y&,w.x_@{?LivbDvl@BNRi:?W%/L|ZthXwucQ$w\"FdOdQ*IKV*ZYG/}cC1CL4V_AEBLfkLVy0#H(vt,}Yf^WM@hl9^/G%&3f#<:6g&S`[s*,CsyB_34Fn|kP05,Nfe,(dY,d0g/lY$aLdX^D;Q:4J8.!W~/bDc{WbFZXWBha{vp5e\"up3]q2Lz*@pcGX]`,hdqB>k6rnO?R)oI,&*t#uJ*kIX_r?Utx/@9&dFog\"<QWQ5^IL)Qd:plSzG7iL4V_d(C,d0g/]Y7!X03(%ldjeR$YqW8Y{uY(/@14BFnXlW{px%muq7hZMMtt}pCR\"\"W)|#+k.@2r/X4UJ;,3,|%V96MMNp};Hg3t<MalFi:.b#vy[`j,0)gu_1pp}pqi,xb3Py+kQGuTTY/H%e_49eu/$J\"}]0N)27u+;(3/x#5=`[D[Fe8y@0)#_1\"XYGfRlo=ED/wBWyz}.<S/4PHr7@\"9(tbI%(fyKCpD9M~B5izI%3y,yhy,D#fe*7N.?v^/@eT&DV$/6?m/30]k!;,3nb)?!otrzN2lpzu+<X&eEzM&*<i^vSa&@vw[*7N.?vTBOS0*e)W:q;N.kCXnV@^+]lG:<oM:l_9)IuhfFw4*6gyYlW~b,P;yGwxZeM>gYC5Im!7+P/C,~Lz}qF60Suvus3\"^m?vhl9`)A|j_9M^*#WT_O(i^O1Zy]tSlY1aI>GLige`,9E/ND#}{|9bi!dX^<Vl9*or:mv9))CA3_dCZ<g_T#TOPvSUuFtulYGYr%3#%=]`,NEC,5k+SSX1!>;Y(nb2uE&SpBhA#)C8+YYB?&zkk{{(4:49,J>g[e;$tUh<ZLIV%DV6BjDNMeT|R%@&D\"Ex:Fftp<#2{IxL{I);#x#2p`TF!O1qu037F*7|W/h\"g+S4*7wM/fjA!WWbWivU@X>lV(g&:PvV],1*INX!##iX*GF>7(4JI^wg[QMGVwhK_pg=rM+R:MmySW_+!!|8}:,.^4JH.h<])G5r+vut9xi9g^G#!s;\"u#XkNh1UYmvZjCpBx`w/M0UdkG_,Rqu}_qfg,@I&:m_M~3;Zy]d6BeFv%03r[#%d,3X4uvLN.[7^Z1zy@0w!/t#%{lHlR\"|Bx7@zZ_Lu:E(S]EP]f<Mr5$#s*.<9pLo\"uMC$lgMLMcGhzESSr+bA9b;gkWWbWvxH_s|u/uJ|hVZC@rd8]r9hZ<g_Tg{r[#%d,3X4uvLN.[7^ZnU=r~wHFPDNMk7Bw5;u+ub)?RLq_%(Iy0|aD#/Akyi#pX33Vm!(4~uZ5o1FWNCiBL4y@OMXV2o?*_0{P;7|&_l&e=mbI}(9)G5i+cw$lP:X*&HGOU44^fXx5wM(prhknapy&@Me*B0DT0NAUtdPt_.,9~J6.$bdvr7p+y)>Zu#2p\"H5^~`#ID#QZqLOh%pdaWo|_9E/ND#kh1Y8mz0[uLOu/%:4kcCp:)Cex,)wM\"wBkXb3bgeb,5@e[@zyrzG7iWxG+Hj,Lx5v%nO1G|uS3JfAV(qF}&_n5#z$DQ(e1.w^N&W`P1%=,fwgu_1ppth4(yhV,k>/M=0*mWW]U]o0Dz9]?{q8.dpB]bDFtU(v9JgU&/T~y{PU,d;54%7f=8h2%h]B,27)LjXv{xTi!K|l3EMQ:Gy*k(#_/Y|;fxd_4*d3h`TOP4Sh4[lQdu7L_:hVzzrS@]E,L&j,{lHDHNdOxzjr&I!Q.c7S\"h0~}?t;9fWBkU(`Vc7>4W,t5=6a*wh6nap0)&.`LhL_Q{{KMvo&&l.Q:uqh\"ZpjIq5S3.wUVCZY:?9`V(4>40uW5`M<{zG7iWxV_RQWVvX}{HY?L]oY(#Cd:YLMMmvt;*U;tFwR9/i]pzNLWt|]yudMn*\"g}9GpIh]e,9E/ND#Lp({hkWP^+4vX#ck0.}(G.h;eE@@6B<gCD%buy65U,g>0,|;jhGvhh15er1>`LhL_Q{{hUku>4W9z[9RQ.c7S\"h0~}Q(3/0QdX?9D[4u/yL/Sl9;1S&vTB{S0*1>`LhL_Q{{hUku>4=I?/hgpr{#\"_=]g{Fbm/x#2pw{{4u`]y5yg[RL._^38{S``,;VjV;Wbg5XVz;;A&G^g,^qF}&_n5#z9f>wDM#WvhP9MOIP)y5@Ml_1jXhG(Z65x%;VM/6?g)1YNwivj_dVd^TMQ:]<ilpzz3<X&e*ztDX3_yOu{4_.S`.5Up1vIg!!=ECYVBoX2!vvt!od;tVwo*m?]p03`)Iu:yw3wucQx_D9i^vS0&@vc[*7B=&vTBu`0*1>z:q;z\"L7da&ufrqwo*m?]p{YSyKC6]9MZ^SGn=8bY4u`0&@v~e*7B=9G%GI1fxF9PNoX){;HxRh@r+,|%V96MMNp217Q=E=*OUr#(Tu($NV`#4K>S`{1uS>G{k!0B,0ywFS2yM*<]w|oVx9IZ9fjfhCWB]Yv[(,)7*6gnXU(D[\"SFI#V\"9RL4\"E3YZS%jxS0ykjXbhqNDH^|ot!Qr&pUB{h<>3Pm:t@u#ZdFW*%({pjU!unChZUMB=9G%GI1fxLbbVs7g)1YNwivj_U@*B!MQ.c7S\"h0~}*YKj,dEBcFy[r4mum(g[h1)FXG7iWxG+d+@M:2lS;v/H%e_49e\"^[murzNG.h;eE@@9#FF+_N[D[Fe8y@0d#^J%FYCj%h]B,27?&W2<FnN(P$%b,a9r9eyrr3Yy<.hj{$^zMm:v%;Fgl8v}u~)g[@z!Y0G!aUU,&5>B:qDbR=9~P5;J}bt*B&d0.#pa~G5r+y)FZ#i!t]<7eSz6yZXU|QM:_Y3mapxx%]dLB!m:wMCe/*;D_c>n,`D)\"FhM~r7*3bG[U2g3%#B\"7^7JI?@6ee;dXrhSk?`I@\",dV6>vFe{Cw!;,3qb=4jm_r!vS]8I<tay<[FFlr0GaQ;e{^/|R5PLm/%pxB;\"**O*bVvXDMAYCw;;I,H+=4D!rr4C)/Y|;fxd_4\"w_p><]V~m^Iu)Dn?Jv=c3&hnU=rM+6B$?kk=XbnP%L%\"Yg[_qtpTF2l!4)I9XNVu#$M*</^y5h4R,!9u7hB:hd=Gg=r=0KV2oyMkO{k\"|_4k@n,i2sX>G,(Yfk{YYa`RZ*\"`{:^YoF439nuu7Ptsp(R)S4*uMFM%:4klY@jP%@r!@n,s?KX^Cgv0|r+OXtV3Z!tqN/^D|_^}b>[n1$:}GDUjU=rc/KV_XnRWW<R;;6~$y?/uqh\"Zp{@M5W+5#p*>/s*wT9pFeu^x)i9QM|W/hyRjeSr}M*MYL[T5X80Suf_m@.e$Lrr8(g<z;0I\"(?kyiLr*HOb1z%^}bN?&\"<{c39wI40*[@1/B0E\"<TdW]vT_PyRjlt9{ubL5X]A_CdWL/iL.u(\"7`Dc4Hwh[e;)Fjp+G{xV%)l`:qDdk\"vDU5;J}P@*B&d|}sba~G5i+ywNq:i!t`#Y4(4;ucbX#E5`WrGJDzDu*sb_kjXNTLN<;2d8]~.\"j=2G.RW55Nf3f\"#HlBF<}J#peExryJ>%ll7|WNC7Capz*kwU/e.E\"\"_OkSuf_e@x:#fHrs(#_+@;fuuG,@iLrZ:>7r|#IXb+4u7f=th`h%DV%PQ@L\"WuT]0LMQQI&)M*Bw.h}#h9]t7h(,#7n\"w>=1{YP`D3^^M6eB6X\":hwIJee@##`:qDNMMCCRPu=+3@n,Kq::?Wd~G53vs^#BcQV+29Z!be;uL);5qLQ&A_L5^4G)M/wFQm6G><S/M%Nu&YtjT2M_R_M~)C;t&XgdeFTMBZb!Lo)y]X3q%7X\"Fpn0P=I@PQ\"L,#<=SXdnkQD_1dw[I&Sp_YO#D7U{YY#^m:Dr/TVP`D3^cuzZ{1T.9C@BAfu*7dFM?j#S?0bW{xNxtdzZPLBk(#_@)C43Cd3##i5B[b)[Uv}ukCj|QMDYsG@BESSrt/i/jDVNkCQ0Su@r__Z^:frr!YY]j;9fCX[Uyi8:0N#Be|{^39Dn:p26*7S@)Sjx{V|*$olT=93;vx;tnw*BvMU_%Co_ge}fYYAqQF}W9ZXeLv_^5@/nY1Zh>G`zESSrH>B:qDNMI{Fg;;J}o@o`&d0.A0a~G5r+4#V?Di!t3HC4Sz.uR7j|QMd/ihyRvSSrkw*Mfk@{T_yHJ;,3z^[lsqT!S0p:`0/};($l}W3{ZTOP2I;uL)U9#p]TYCHj@gdxrlVB!ofm._p:BP:^c>,952T.vHN)QmT+4#SlSF3BiB\"71h#4cwt9e;>{<pJ0dxV%+@v:.@{XLO<U`@Pt=H=4D!*BENUIQ5|38jmVSF<}J#pe1z%^5@/nY1Zh>G`zESSrxb*L&j,{lHDH@;*3,|%V96MM3WO]+hM{YY)jpQ:.QTb![m(4w;au_1pp}p}Zef|_}weBP>|%1YNwivj_U@n,m?\"}|{13:oG++/dVxiOBr(D[Fe8y@0%l=6B=9G%GI1fx%MhMIk<=SXNU]o0Dz9]?{q(r0NG.h;eE@@N9!:ct29VVXD*Iu)Dn?J/JdhIg?h9%&M(*aU8GnF{R;;6~\"Y%V`RM:@#4(2v6]g(;#dFd}RF2a||{^/|Y[{1uS>G{kDUAE1>`LhL_Q(T4U`@!yX>=/rtG.47R5G%#}U(|`vd3h|{bW#50I:;#9+zfX0G%GT4`@h.fLjXVN108M<0OxidzB9R?kS0B]b;a3>wKjZQOBcFy[r4mum(>[h1$:XG7iWxG+d+*Mi2tS;v/H%e_49e\"^BmtpGNG.h;eE@@9#dFHMV[D[Fe8y@0d#&\"CQYCj%h]B,27/N87dhbWda|oVx9IOntI`}P#61Y|;fxd{UCZz\"?__y4u4I=X4ugM@kZh@,vx|_:VkNgDNMWWaW@;l&el\"5CgTr_#\"_2vxx[XFBSF!yu3]V`DY4)d[lu7Drrp(,&5er\",dV:/5kMC[/V@^&&Y=VI&i_Wvl(U|Ct$G([DiLrENc74C=,]Xqd|6hBeh2%vx|_:V/NjDNMWWqW@;l&el\"5Cgpr{#\"_2vtx[XFBSF!y4G0^`DY4s|[lu7Drrp(,:vz*\",dVkG5kMC[/V@^&m|xBI&_rPX!_(d%I%#F:cwlrZ:7e2|#4K>|[g01ShCHjiry@F;rkjm+t\"H4g\"7Oxel\"5Cgpr_#\"_to+x[XFBSF!y4GCV`DY4$;[lu7Drrp(,:ver\",U/A.5kMC[/V@^&m|=VI&_rb0!_(d%I%#F:cwArZ:1^c7(4MG&LVDhhO3\"j0!0)>wP/$?=%3vwH|uf_0^n,7yM_+bilpz*3I@]9SF!y4Gi7`DY4q(Olu7Drrp(,Bx@@\",U/)X5kMC[/V@^&\"9l9I&KX.i!_(d%I%#F:mgLrZ:1^30(4MG&LVDhhE3HjCpp*y@jVb0NT=94;Ruf_z+x^p2EI>Nr/j;T+=*Ze]:+&0N{4?]0&@v,5/nYrrp(,Bx|E\",U/HU5kMC[/V@^&\"9g[I&KX*7!_(d%I%#F:mg3%Z:>7Y7(4MG&LVDhhE3MjCpp*1@jVb0NT=94;Ru}_e@o*qL_r]vS]Qg:y<MOUzZ[:C<y,Xr*I{Xg[QMh=ehiBvS^*95z:q;,XI{V/V@^&(M@BI&KX3W!_(d%I%#F:/WlrZ:>7L7(4MG&LVDhhmvZjCpy@u@jVb0NT=94;s;D_e@o*PL_r]vS]Qg:y)X[Ur#c:(T1^j;.u}G7F*7|W2p;IjU,&v/LFMmySW_jag%@r`w*Bdy]p(X&C*U%I%#F:3gLrZ:>7j0(4MG&LVDhh43HjCpy@+@jVb0NT=94;kuf_e@n,LL_r]vS]Qg:y{*OUr#c:<T1^j;.u}G7FMM|W/hOhVzp*_YhMi0@hT_Q0<@I,TtFB^!KI+bh)G56]6^Z^SG&rTF`P4CNu%0*LBDhg73,,L4`@a>`LhL_Q{{]PP%M%@3!jIqL_ub61j;7}=*[4mZ[:C<y,Xr*I{X@[QMd/jp;IjU,&v/LFMm#SW_+!C@I,TtFB^!KI}(C)G5r+]uqB3Zm=B(>,XUu^fXV?`M8.Uh$aS1y&vWB:qD@XWW4gX@Pt~bxeD&Sp*7!_(d%I%#F:x#s*({+g[S!u03|`n1o*c3+C{19%p>mN0.mgI{@L.@P^he3&.nQ.^7R5G%#}U(|`vd3h|{bW#50I)w)e:nN:*G#%{1}%mb+k>@sB?vtGOx1^QjT#\"PL_}Ct;(\"9f,w([lwBg\"<bW8|iyB_plCGsgrpn0t\"+x9d}VvXg)1YNwivj_U@o`9RQ.c7S\"h0~}*YZj;wOBcFy[r4mum(z[n1~:XG7iWxG+d+^*H2GS;v/H%e_49e\"^9mcrzNG.h;eE@@#,FFVr`[D[Fe8y@0d#`MDDhCj%h]B,27/NMgvFL7N;x5y_e@n,!LKXS0h3fC<v=*[/]:8:0NC4u`_^fX#5wM<BgpMnnUp*.@,L:2+SW_+!_@I,bto*[mpr{#\"_KC}xs^=&FF}WXB\"7j0(4~0&e|;<BgpS@65V%Bl`:X/*XWW*g3@^+<.,952l:H0l(871t*Y[UzZ[:&</^.@<4~0,5qLh{c3HjCpy@+@M/V0#wbX!0Su@rG^n,0y#_vHv)G5l_6^K^$#{}l</^=0Kyzwg[QMd/jp;InUp*I#wFPDNMk7dWP%|&4yq^}&Sp3W!_J0,3NY6^$#Np.<r[.@3^cu)5wM<Bgp(RgeI@NwD*!Gfmk7_Us;D_z+x^,J(r=0o_J0,3I@Sk<gLrZ:>7L7(4~0&eh1|WNCiBbry@X;IMi2:SW_fjg%M%2fLMxJ(r=0x;ge@{0@#B+Q_pXb7OIP)y5@MlCG&:ihP%$g9%L7aNG0^NnO;L|uf_btx^,J(r=0};I13v[Xl&}#+&zNr[<D3^q(OlgM>BDh|hGgu*!GhMi2eD0C]wqQl)KV;5{o{\"eT(@27pDEt5V*dEBENObvCXy_/D[o1g}o0AkKvH&qy)L9X|%qi7nX03(CV;5>@/}A0jIIu7+>w|n.Q]p({)yECH,9WMl[Dj=^3xjpxe,u.`LhL_Q{{=wF0grBeQBrL;_RWJ1*Up+^)7*BgCD|#fB,CsyB_34Fn|kP05,Nfx%9E/ND#_N10#!P%X^N@qL)xKXoY>3mD3(7@[kE/QY,_D[qm(ynGSUL1d=sp,CQ5}%%dC,T.sgI{*G2d&&qV{lS6&:3W;3G%hfFw4*5wOBa{r[s08ytG)5xz.&030_Nf=r,#,L&j,{lHDHC@a@BeL*6J$.ECm.906]$j8jqZc.;Fy[r4mum(3q:ppSth4(Q5wrK>0FrXkk\"W&R7C,+,|%V96MM]_h]0|1f(tmVXQ4Iw{~bBu~4n(#Z`MpS9G%GI1fxh.OMi2sgI{*G2d&&qV{lS6&:3W6_KSe3g(;#dFd}WFY4u`!u#t\"9.5m=^3\"rpzS@+d@M:2GV1Y]Pi7?D>,*BNy\"}|{13M5eEs^}VRd#.Q{Ob};^I0G!#XnepXpfZ920)&.`LhL_Q(T4U`@^+@3&B9Rt!Gic;grZ}Z)|niWEBZ()yYo4I)w!9:nN:*G#%{1}%mb+k>@SNy01iNoVxajo*ULF}y9(/h;p}DuN9,diw~T0OL78y2^D[{1)=U34|Q5fxA.C,;5CN5v.Gi7:4QVUjIqF}&_n5NfFtU(v9JgU&H{LWl\"KyoyRe{1uS>G{kf4+x,ywFeyfkMC8Qo|U%6|2*m?\"}|{13*Up+0@W^m:?Wa9Qenrt,Ew0nL1_6O3Q_B19%C.~,Z@,{;H:!_@u+,|%V96t!UpQIIuBx`v&e(g1:*H%4Ex*Iu)Dn?JUV}GT%#59%YE,L&j,{lH~Lvu^&07%/tk;_C<G.h;eE(t[kiW*IcN(4Fe;ufw)e:nN:*G#%{1}%mb+k>@SNy01iNoVxajk*WM,}vH9]G%hfFwUVeUJ=T9nW,CL%Bu|`yJrS8h2Yoxb37)M/V09==0YUkCd_Ced^uJKX*76192TDu96L%Xt&>Hy[4C#4)dMl_1N.bv#g~x0)X#0*/@^N/X1!P%X^9ed^%j(pWN|](7J}%#FZFiHVd(wO1@j,$7=lo1{Ic32%y`A&WGZVl#}{qNLiP%|&/>A&cPfh*_q_J0W3,)4*6g[.?W>7(|_^)uknfI4\"Zh~hY\"V%&@e*8Xpp({hkH@GD}Y3&WMF}|{E;Do\"f/#\"VXQ,I&<{pzDKIq,m#7prSsp}6GS", "Y$@=4Oy$@=4Oy$]!F][yoNk~3\"O3cG8d?D[=y`}nNQ`{)>^][x%=y`}nNQVTIC@=4Oy$@=4Oy$@=ctRy=#3q/kLG?Ueo7IJm&%d~[!z1aCA", "y$@=4Oy$@=4Oy$@=4OUNj#]m1SZ3sJzX^]o|alg}(AkS#~TAkS#~TAkS#~TA)#d~I)vF%bp5:C^L?Q@j7gVT)bj0IOW$odRyK|;9&dj}k3", "z$^][x%=y`xQm3Y3ajZSYtyX&Zzn4=A~V>@=4Oy$@=4Oy$@=4Oy$Ookx;X?QL~|%Y3Qj6=/I+Yl%n~,=iGIC@=4Oy$@=4Oy$@=4Oy$2wvf", ")=;|&d1Sc_sJvI6tT/wn0~^SFZ,>Kd^Iz$yx]vE$o4rOy$@=4Oy$@=4Oy$@=4Oy$@=8DO=ed}jIhl9/i^][x%=U|JjPA!4VEF3?WxGSzMx", "_vp|#6(AkS#~TAkS#~TAkS#~TAkS#~TAkS#~q6u(2_{x#tg(oNKjUGU=3>@=4Oy$@=4Oy$@=4Oy$@=4Oy$@=YtyX&Zzn/XX`3>@=4Oy$@=", "y$@=4Oy$@=4OJmoA4Oy$@=4Oy$@=4Oy$@=AcY$@=4Oy$@=4Oy$@=4Oy$WoFtn@xL3m\"}k32Tv1Ox@LmA4Oy$@=4Oy$@=4O&nmA4Oy$@=e", ".@1UPgn=", "H/x,nm(S", ">Vq,Pg1S", ":/TV", "UVukqXB=", "ZdIl%", "B.!9hMjBEbGHio&@KGBLJghFg{p", "^0h[u", "sy([bU;.B", "fEh[E#9{^bIZ}e", "5tr9*", "#)/N)L$!3W1", "Be;9*", "~;zHOJox", "eN*u9F&x", "MS<K3Q..", "mI)%|o?A", "c:jVB6aA", "=iL1#", "fF!F)", ";5.154dO{C<", "GUw60", "$U;ZrvSQe{F", "QFy484E$", "q%R6o", "h;&zl!IJ", "l7W>:LG$", "9+]|", "0+.@97{^[", "%#zLFLXG", "bxo7", "gSi2]p]6A5Q", "wZX2)", "RKlJsYO<", "a1*:", "11f~LwU!{", "BVHC@r|9", "11~2B", "p+(N{KvO", "a1=~qKfs03AJG", "gSUW@KSO", "<1%~1y7P+3*g;l", "_#uWppR", "}S06", "_~Q{ca+>\"", "[AQ{}B0<", "=N7:", "LAZzGlq<", "`cYXSVz/", "_A3zY5ru^+NgUhO=oU<", "AIb,LnL8", "7%Eiviq{+", "Y39t}JJx", ">+;2vXqx", "rrZ,5ibD#", "L:*zkEO}", "*6pH!yw&", "+YX^", "dvqx\"Fe&", "N?ac", "I?;e:{jv+", "u?p~?x%F`8i", "u?p~?x3&", "M3o~", ",#*c2", "A:cuGbi&", "jpo~", "A:cuGbV)rli", ":E6u|N.&", "\"\"ey:", "C~k[y", "ls![AMpx", "UL7DYq_8", "UL7DYqh?P", "49I1Jcrx", "mU\"QCwH=", "j4R7#7EV", "I,!Tr3`D", "vq|YpS<<b0z(H5i^guti)BhD", "rr:_xw=m@7Dye^ih;B", ";r~@", "br~@", "^O7\"D4>m", "g`)+=U=m", "%/4B8+gD", "v>}K6z{D", "tt\"?Iy,;~P*ESVW]JD", "Qt:~", "Jt:~", "VLP0*BcJxP&d;jx", "u+W@@JEx", "ddQ^5i(8us:BgAYf/x", "/d*u", "L~pY", "/T0S)X4bk0Q?f7k", "5J>%ovZx", "7p_%", "5J>%ov#1t", "Bb1ipK>", ":+t[=", "^d{u,", "BB{unX:x", "nN1DFF>", "lB#vrFPx", "ep`u", "`fC_", "gW{u", "}9>E", "Zk~+p1{]", "`9LR", ",(lR", "((;@Y1?G", "?d*u", "I\"8Dv2~N", ">;SZ!y]Uf<\"s329", "{:mbva=DP", "dt^#n23A", "\"\"cjZv}", "*AnvR!Sx", "nNb@5iV1xj!", "{+uCJ!a8", "M%`p=ogdnm.O6Ut", "g73VSN{hT", "ddW@4F(8", "7pk^(2Cx", "ppb@mU(8", "gW!iVM.8us:BgAYf/x", "916YH0KOeCYB,", "Ap/^&", "5gNU@RWoo_bj++Qz^e9_+s<B\"l,|>", "cbOD:H|8", "yt\"vu", "+B\"vu", ">*S;4HT8", "5gur", "x+K%", "pp/P`KPF}?", "]p&;=", ",dK%oB</t", "kjBa0h>", "5gur/JtX2s4X()d)!;E@u", ",dK%oB}8", "2=Do|Q_Vb%vf6`Dx5D", "QiWZO(,yozoPH&Qj;l@$0@!", "@?E0]K;s:", "!z1XnRKm%", "9Q;R,;<&mqChD", "7vxb", ",pb@oBa8", ")ef{FH}B2", "w*k03VZy$", "v;V{", "aqAw6kQ^", "\"q?*h", "a*FN", "[|c*PiMJ$", "LOj5@", "/qAL?", "M]yxqV[", "HN.{AYK^", "44E{SYX^", "a``2g", "x+BieS>", "87J2=J>", "Id(i4FA8", "(Mhxeb7*", ".MT+/", "&Zba{SW", "(d6>eb<T_", "W~SgyUb5[", "F=z]sDsh*", "PQ7@|i?8", "k!ubD#Y\"P", "K_V=oCGB9k8b>", "8!g&FJlcZuJD>", "j5HDf#HH?mkbx", "+7)24JVY*z", "7HT^LiL\"aj<s8{<pu+ru<B^C_9@Y*&?y,0>v(fUL`?C#3QA}zivW.w;/Dz1`XAD*TWC_1~Z9I1^", ",dE@`K.8Z5RvXe0@[IpA(fFb7ltn&\"Y}V&j/3gTGtl11&\"?y)L\"=Y<wj6L\"U6+D,m3aC\"mtmpL0bW|A9gX:A`/zoY1Niv{q@>I*2dqQt!DZN@!:y+iH_q^sbt[x6k{rzK&:A`/\"/%PS#dorzX&9_c]+HquS#lqez!gS_q^g9TDSF$Q?y,nD+Z<>", "vf/^lO>", "M%4Xxk=g", "cbM_^JO\"t", ";N?b!iN,r", "bbA=Y]Dx", "1(/PC.f0t", "Ybb_<", "vf\"%,", "VbE_", "HLkPV1~Gt", "*QOD=", "iyeP", "/dm%&", "Ap(i~4~8", "yYuTLd#}", "/=h]wEvu", "9|/lmTtu", "kp~j(:e}", "h@;l)", "WH[]1Ttu", "GnqXk0q:D?H?C58_", "}fow2J.u", ";hR;`Q:E~WB1ZE)S39L]]2suAc/c``,]vGVZ", "j=d9Re^IS3kQcCvYinW`.#@aJ?NnFhv\",V|", "_@aZ&z&#Cm#E>eB_f|", "}fow2Ji1W", "QQJ(DbHbtBR_DHaYU8D]\"IB~rbGOw):=:p>~JbHbAcv", "lv(T#I!u", "3YP*1Ttu", "inqXC]gu", "cwNRk0su", "pp{Zx<^|", "|`#9r#vu", "$\"b9<0Hu", "AG}2x<d#ub)Qv5(,+zmluR|Dcf~xRu", "j=d9Re^IY\"", "yY;lS#@ap~", "|`#9r#@aJ?", "g/qXY<s6NW", "Gn5~l0q:6", "x(>]Kn{Xgv", "tCvTTIbx,AYKJe)pvGj(x5gi:Wy5De)prYKDn;(7Ac/cS4/", "j=d9Re^IaODObp0ssz,Mne^A@QmPT`p=,Vb):<E!,Rc5}", "(@kVFzx:/?<1,dbkHhqX#I}", "*pL]y#suAc/cJe_]AGqu", "*pL]y#suH/bP=cwYW,?2/VY;,AlQ\"e<[`[5~siq:6b#Ed[)SInqX#It#Bt1!Ru", "*p#97iBu", "6h3]?4H;y3hdgjf^ZO5~(JHu", "QQ*hGbvE(Nz_}_,]FXqXzE(7}6GT,:r]S}", "9t7Vl0Mu", "QQT0e+,S\"XT$EH$Sd)={x5gi$WGT5H3BU_<0^<,S3!uxJe)pX,KDn;sxDX*", "j=d9Re^Itb#`|BC[@z(", "W,cZBVE!V?;Qrd}r;p(", "CYz]2I!!~W>4xHz?,V|", "*pb9<01;[A<1+Bp", "QQJ(R]s;>?Lo9dH^H,VZ`$em9>R_}_@\"rY.lNVkAgQMmQCa\"QQ*h|@]HAc/co|", "lv(T#ISAp~mP3sXY!\"O9pJ?XH3kQcCvYin~jl0q:D?IKV/jp(n#($[dm%msm;cyas}", "*pb9<0aXSQTOd3wYa|", "&NKDn;sia~_m3s4,ine(x5QGw!cE^p,]S}", "Bv(T#ISAp~y!2j3[*p6R^#&#Cm#E&),,M9iTC]w;^vVKV/.\"", "*pb9<0Hu", "6zsl^", "Ky#(T+I?]9B1HH>\"QQ*hg]lUvc/c^p{", "Bv(T#ISAp~mP3sXY", "bg3X*0m:H3kQcCvY", "in~jl0q:D?IKV/.\"", "$\"/Th5vu", "%\"b9&ysu", "I=5~", "T=El1TMu", "%\"b9xz/u", "lpz;Z", "^?.lvV8u", "*p#97i<;6", "F(b9fV];qb<1U`", "QQJ(R]C;,AU_):r]k]}(#+%yAc/cJH>\"QQ*hJbe}", "j=d9Re^Itb#`|BC[@zXh)2;;Wbo>d0<[kp6R\"0K;jt#K~:jpv8#(y#b;oW$EscM\"", "F(b9fV@azQC", "QQJ(R]C;,AU_):r]k]}(X=%yAc/cJH>\"QQ*hJbe}", "j=d9Re^Itb#`|BC[@zXh)2;;Wbo>d0<[kp6R`4AXZW8ExH)?iKn]]0e}", "Gn5~l0su", "$\"/Th5vu7tgRA\"Zs?|", "QQD8DhBu", "kp!X[3<u", ":p^]eI}", "*pL]y#su", "$\"/Th5vu7tgRc8:=lp(", "kpfZdbHb4Rp4}", "8?;Rq4?XXAKy}", "QQJ([<C!Acc", "*pL]y#<b(", "GnqXk0q:D?z", "AG}2x<uu", ":=)w;05|", ",/fZ?@Q|", "H,VZ{$$}", "j=d9Re^I*OQP@s;By62le4oaJ?NnFhc[1YGwl0U*,Aw!u{Q/2)t{", "$\"b9<0IS9QAn|", "66w)K=,aK?+80[{", "|hj8l2)Iw!|1EH>", "k]ZX}IoaRbz!J|", "v8OE/", "^H9w8i;;e/m!o`", "73rTS#1:VmjoQC*BmF0wq4|X.mhQC#y\"QQJ(R]C;,AU_):r]k]}(k<,S3!R_DHW.", "v8k6+2m;^vMO~_6svpb9c]~xCm8mS`A=g/(]S#a*0bIEhj3[6zsl_<`/k!m", "|`iT,o}", "J\"n~goO|", "bnxlS#}", "FE8^NYem9>R_}_@\"YGVZ>Sri&Qez}", "&=6l+0|)7O?n|", "U3<JsYIn6RZx>E)S39L]]2suAc/c``,]vGVZ", "(t60aVx:CQ;Q*cqYwhvT\"I,U>m0o3sj_EQA]Kx}", "zVwR\"", "ui,h>S}", "VEj2;#P:3v;Q:_W", "^H;lTI&#nA<1ipF=;z0VCTU*NbnVS`", "QQ*hGb74,Bz_}_Hf$VK;iS=;_bmor5Ds>G}2Jbri&Q>mJe)p;hKD;", "wk_V7DT|", ";CaZ]0tu", "akKDn;e}", "wk_V7D9a3v", "8z5~6S4?>?", "x=\"lI4&!iZ", "?keX]0q:hW", "6UvlvVza>?", "(]{h:5&#gv", "*p/Th5vu", "2l)wBI}", "AGj(~*uu", "ch8(;0Mu", ">G}2|@i}", ";VyV@#uu", "t=5~\"*}", "v8j]2IDa_bFMtu", "cY`Tq4.;CmjoQCXY", "QQJ(R]|XhvuYuj$SNGt~R]QaTm/x}", "5nD].FPu", "x(>]r7Yu", "[@{Z", "xv\"l$b#}", "h=DuWlb}", "Ky#(T+||", "13R;Z", "xv\"lr<i6EW94^7<>s8#(T+a*Qwv", "*pb9<0Hu{bb#Fh\"", "tCvTTIbx,AYKJe)pvGj(x5giAc/c^p,]>#}2|@,S1Weq6j7]k]#(", "j=d9Re8u", "|k<TMD8u", "anqXzEvu", ":Hu]+Uvu", "Vem)zS}", "|`CT7jo|", "zhb9l2Ku", "rYBnbCo|", ",nw!v", "b9n~;05|", ",/fZh", "y8(MI+}", "+v(T#ISAp~RP\"cg)SYD~;0)IkQFHuc<BV,<T#I{Ixv", "b9n~;0Q*jODKZ{", "y8f`5+}", "+v(T#ISAp~RP\"cg)SYD~;0)IkQFHuc<BV,<T#I{I<t", "|`CTLXvu", "C(fZ&b||", "kp{ZuHsu", "_kFo(L;:xa2|r3:Bkp{ZuHoS6bM", "h@vTII~Y(A", ".zVTA@kX,A", "^@HR{MExgv", "Lwv{<0H;gv", "Z|%]3Twx&v", "tv(T#ISASZ", "xnn~<", "*?;Rq4?XXAKyO(E)>$*WdR_Wjz1Kn[%=RYaZDNd/Bpkx.BDs^@HR]jn[.3FMgjC[lp+EpJq:wb]QX)];2V|", "Oh(hRS}", "h/#)RWTS0\"&5Tt!", "!1>B:}#l<", "2<:6WG[%", "Bg*`{", "q/y)REYcDa{8%", "hp?5$I8F,", "Mfwqsl`^,Os1VgkZ", "OAf`xdtP", "ufo]", "&>t2ucs%", "Mfwqsl_m{\"G5R.,^pRP", "S/f]{", "[&*`~s[Sq1ra>,", "7pb_:HS6t", ",!*1$`sI+", ",db_~wCx", "_+E@&", ",0/^}M(8", "pN(,dFa8", "`fOD<", ",db_~wW&09L1]+I~V(M_", "7pb_:H.8", ",db_~w/\"09L1x", "[fk^&", "rQb@Y27{@*", "tA;^cFPx", "`;)2/4.8", "MWb@/", "tA;^cF%x", "O9<iNX>", "Fy}](", "Bsb_I2>", "tA;^cF{x", "`;7@vC(8", "Fy94}", "Bs&;NXWDrz;", "FyL[*", "O91Dh2>", "Fylu*", "<Nb@Wc>", "O`P2=J>", "<N/[TKR\"P", "FyL[9", "`;7@gM.8", "Fy949", ":!K%", "Fy94*", "S~OD4F>", "Fy}]}", "=0<iLi>", "Fy94(", "LbJ2.Sa8", "Fylu9", "4W,u7408", "vNP2oC>", "Fy}]9", "S~<ioCQ8", "TNb_dHf8", "Fyluk", "S~<ioCiw3(aR,}wf@pm%", "FyL[k", "<N<isUQ/i:$Qur", "{fE@6K>", "<N<isUQ/!yLRw+", ".I&;4FS,>?|", "<N<isUQ/i:xoi+", "w3m%`Kf8", "Y~MD4F>", "<N<isU~8", "LeMDDV>", "z;k^Wc(8", "]A(iFF08", "`An%=", "FyL[(", "ltJ2g2*o:9~Ux", "4W,u74]Cqz", "LbP2<J_Y!La", "4Wm%dH(8", "&d:@/", "`;U%NX<8", "Bbo<xU08", "+7*u", "4Wm%dHVKvjxoq+", "4Wm%dHn8ajN1x", "ud#%0nZ7C9^U6+", "4W,u74A8", "OWn%", "4W,u7431)mv", "wLM_]4H1psU<7.qe", "kJ(iVa08", "XeOD<", "kJ(i\"", "`;7@vCR\"nj8lx", "$^(iOq[{0L8lgyg~fNa@Wc>", "$^(iOq[{0L8lgyg~LIr^g2p{P", "$^(iOq@8", "FWI2]5<8", "<N<iI2CxiL4XEXDf_+W", "4W,u74/\"iL.Lx", "4W,u74F,=(1", "<N/[TKR\"lyL1Av{", "iy1D5b.8", "nNb_", "4Wm%dHw,3(+ow+", "<N/[TKR\"L5]s]+", "4W,u74WDrz;", "4W,u74Zq0LD18r", "rQW@Fq]CC9BS\"5>G`f5@&", "rQb@+c~8", "Q%OD<", "4W,u74Zq0LD1n=(~.A2i<", "rQW@FqiPf(L1S+Yf\"x", "4W,u74e{iLxlx", "`;1D<JvPtmD", "4W,u74H0v?kbx", "udz@w2!8", "bbP2=JQ8", "m%J%]4Q8", "C_k^[~dx", "<N.^O28_psL<&}Y~Bb{u", "<N.^O28_psL<&}Y~Bb!ik4XYu(", "VEe2Fqdx", "4Wz@Y25q2y+oN!(f\"x", "4Wz@Y208", "6Na@Fq(8", "m;fSI2f8", "35,+Jqrzt", ")fU%dHk8", ";%b_dHf8", "pNa@Fq(8", ")fU%dHK1TLlSGMC.bbP2=J7zc#`LG=y", "\"9j+]fdx", "]AE@w2,P:sN1J.y", "]AE@w2,P:sN1J.sIZ~S;<", "VE;v;XG0t", "<N.^O2G8", "/N.^)BQ8", "kd1i<", "<N.^O28_ps2?JAJeBb!ik4XYu(", "xt2DR~G0t", "udz@w2SC%9ulgA;f", "!W1i,JQ8", "xtb_*fJbW", "Bs.^WczFvdIWJAy", "rQW@]wp{45hXAlOfhy+ioB6{%9N", "rQW@]wp{45hXAlOfhy+ioB6{%9i+Vv})Ix", "C_o2[~{x", "Bs.^WczF`5fL{}=7vWru", "Bs.^WczF`5fL{}=7vW1ik4XYu(", "35CA.erzt", "LbODNXp{E0f", "`;E@FqT/59UQr}@Gux", "kp!D,JL\"45hXAlOfhy+ioB6{%9N", "kp!D,J}8", "vN,[TK(8", "MbV_]408", "RtbD)of8", "7pru", "&Lq+]fF7t", "]AE@w2s,:9ES_=?~Ix", "]AE@w2Dx", "OWn%3S6x", "mbfSI2f8", "&LN_sG7,t", "=0J2Pc>_^*/LndL7t+zi*2(8", "Bs.^WczFENsS_M^3", "T%U%I2<8", "DAS;wa<8", "VtU%/", "rQW@Fq]CC9BS)ywf&pDu", "rQ<i9Fb{tmrIx}Y~LeODKF>", "$^\"%I2jx", "b;5@mU(8", "$yDu,", "v~U%[Vn8S:\"|hJwf]>", "4W,u74n8", "++Q[=", "4W,u74xzTLtBur", "<NM_MF18", ",d7@Fq@8", "aI\"%<JDx", "#eODDV%{09^U9}(f`fk^/", "O9U%I2C6c#hX2M*f", "#eS;@JG8", "`fk[fB?8", "*!{u", "T%&;wqQ/7NwXr}Of@pm%", "T%&;wqQ/`5BSAvPe[fW", "T%&;wqQ/`5dbF!;f", "`;BipK(8", "tN.^}F>", "<NU%vB\"mQ?TLtr", "E(+i(q5q\"|3Lo.y", "=0.^iFdzP", "4W,u7431)ml<F!!7\"x", "wLM_]4}8", ".NluPH}8", "fNq^/Jn8", "`;7@vC%z/*2v)y3.\"druPHn/A(", "kJ(i^5<8", "\"d{u", "`;7@vCR\"nj8lgyp.b;W", "$^(iOq[{0L8lgyg~fNa@WcT1kmAUx", "W@c<O2G8", "BbO,Y2(8", "W@O,Y2(8", "v~U%[Vn8", "S9p,PFezW", "F)yv^JCPp9L1OJ/e\"x", "x+%4iq|/C9g@|vOf{x", "x+%4iq|/C94:md]GeNW", "QpU%&", ",pU%&", "nNS;/J>", ")p&;KFn8", "xt>%FJdx", "C_!D8~KtW", "VEWaXqG0t", "\"9b_`BPzt", "6yk^Vq%zt", "C_WUxG_?W", "5#s_Xq8?t", "6yk^>Uk8", "_s`+JqrzW", "VE{20G_?W", "sX/v^7`x", "_8qHIHy?", "a(_,", "6amD", ",0C_", "^!5_", ".Aeu", "pJGiKF>", ":,$bd[(8", "Ih\"tX[PP.|:Tf5HAYyBHWE_8", "S(I]ev(8", "k;jSpXcx", "QcZ8V89T", "/d*u2L>", "$~<HVMZ6W", "?J#SyF/Gr", "F</^.K!8", "Wpz@Jk!/:(ERUdOfux>Cu", "<*.2%Iyo", "*)xfU!|o", "tcn7b~`o", "tct;*", "9fM@(2<8", "%x0^MF(8", "l&m%<J|8", "9fM@(2H\"ma5R4vPeA!b_dHzFjrsK~l0", "9fM@(2H\"jrsK~l7:vf/^lO>", "%pVq.mQOKSg2q45!JcV\"quZOm%S", "Y)kvK]>", "lf/^xU<8", "&dC_", "6f_%/J>", "/N1D37>", "Ap{u", "DAm%", "[;[<;V5qt", "x+Du", "jt{u", "0JED0G08", ",d0iAMZ7uLXSb8s&30M_2k1/p(AR`+0f6f;^&", ")pK%", "|B`uRFa8", "Ihc%RDv7r", "Q%E@&M@/+mijhJwf", ",!*1$`zx", "&p/^/", "vsa,;OA8", "Msk2]K{Pr", "vWI2dF38", "Q%M_", "z;Mr", "HyW@4F(8", "Hymt", "dAz@?F>", "DnC@(2>", "]bP2oCR\"6|>;ur", "]bP2oCR\"Q5)[;vy", "l~P26S>", "vWI2dF>_A(1", "h5U%@J>", "vWI2qc18", "TNM_", "Zy:@Mqf8", "7pm%", "w3:@oB>", "Yyb@@4?8", "aWGiqDf8", "aW1H(", "w3m%@J{&N|Isyr", ">N\"/Ensx", "w5#%&4tmt", "Wp)S?", "+Qt2<J>", "A0X2:Ha8", "S5*u74O\"8", "$#Kt", "Z^e^/", "vI<P0HB\"FRpR4vkfZ~f]029DrPHOcy*}s:x", "WbL&0", "w3m%`Kgqt", ">N*Pz", "iWr[~4#8", ".fH@tc|\"t", "w5Ut", "Hyk^Y208", "HyMr", "=dL>_r7t", "h^CySarR[", "$WW;gLOT<`", "$Wv.", "=dL>_r&):", ":9Nc!H`t", ":91[", "eWK>da4P,^", "eWb:^", "EEY[[lEul!]MIx", "3t.1z", "pt.1z", "nt.1z", "@t.1z", "Gt.1z", "S5*u74.8", ".yr[~4Q8", "O(e^", "}(94c{>^", "~URy:K9j", "c?Ry=0=j", "\"\"Cd", "DsKti`Q8", "i~P29F<1A(|", ",d0iAM(8", "!0b`", "e;7Uw]k8", ",d5@_Y(8", "m%b_/J>", "2e<iKFA8", "vfz@6Ka159V#x", "vfz@6Ks,vjC#ur", "_+1i<Ja8", "F`mbZ2j,P", "@Nru+D41P", "XI&;4FJ,^*", "C~Bi*J!8", "ddn%vBgx", ",dm%<JQ8", "}N1DFF>", "seQPJ[Jx", "oA^vPc|?W", ",dm%<J7z3s4Xur", "NBK%", ".A{unB)z]j/2hJwf", "cbX^oB{DP", "/dI2!iCP:s!", ".N.^~5!829", "[J7@&", "8+:@&", "ppU%SkMPkm|18r", "dd!ifK<8TsLRi+", "ppU%Sk|Yu(W[AvRGBb&;EU/trz[`&l1f=!1i=Jn8", "gW:@/JVYl_", "NAC_3S>", "t+(i<J>", "&Q.^[X>", ".N.^~5!8", "gWm%Jk{o29", "YW*u,J7zmrl12MA6j%)2Hk|\"sav`Cd]Gzdru\"K|\"29", "DB)2s~>", "Xb.^iFm>", "DBM_", "ddb_SkUY:sb`5d3.q(M_<BO\"maZQur!7IxuipK(8PsAUylkfyd{u", "Xb.^iFsP}RyTd8", "XIS;FFD9xRwXe+", "vfBD^Jxz29b`&vYfQ%f%44C629|`1!YfSD+i$Mp{samR3l7:&Q.^[X>", "hsS;|XsPW", "$WE@Ni08", "Xb.^iFp{mr+o#M57dWm%JkCPkm7[6+", "P+:@`K08", "]h/+", ")pW@`B5Ct", "7p(iJkQ8", "6f;^JkG8", "c~.^Jk#8", "OWGi!i>", "&Q.^fKsPW", "FW*u", "wW{uCkXY.m1`\"}H.?d@&/JQ/C9vimdo)[fW", "FWBis~>", "MW[2<J7zP", ",db_I2!8hL\"UurTf^pruCk0_.m[19Kl7PQS;=", "MW[2<JVYl_", "nNJ2oC>", "Xb.^iF3~Dz|`JdOfzdb@5i\"8\"LJSwBl7DJ]X@J8mt", "nNJ2oCsPW", "(!m%dHS6jr5Rkr", "&p`u~V!/59NDG=e:t+(i<J?8fLVj1dOfdWm%Jk./.z<|#M0", "&px4s~>", "/pn%&", "gW:@/JQ8", "gW:@/JQ8[sl1e+M74bi8<JW&0sJK{U]GSDk[;VL\"5(l1tr", "Xb.^iF%o0LFjgAb]v>", "QpU%<J.8", "SDL^,J~8", "dd!ifK<8", "`NJ2!i>", "2~<ioCn8szERw!Y~&x", "M~)2HkVK59QX3v&6_x", "b;@&/JQ/C9Hav!I~0x", "XIX^*2;Yl_", "Rb<i9FaY$(", "ddb_}FiSDz", ",di8`B8_}?", "uxaDNXs`:9", "\"xP;^J|\"29", "Ixv@NiG/t", "Rb<i9FaY>Rfq>", ",d7@`BL/u(evUMDfFt<i,", "3A_%UkK1:sKX&+", "^d]XfK,z=(5Rkr", "rs\"%3Sg:29%C]+", "]0i8`B8_9ja", "Rb<i9FaY>RiX>", "|%]X6K7{<L!", "nN.^(2n8PsAUylkfyd{uCJVY*z(1ul3.(d{u", "Xb1DPEPx", "&!!i,Ja8", "87<iCkK1u(", "Bbb_@Jg:|(", "&x!^RUA8[9", "|eP2<J/tez", "%xv@NiG/t", "&!!i,JYYl_", "XWn%=", "O`J2,J>", "&Am%w2Cqrz", "dAz@&", "bbb_<", "O3<iFF>", ">!t[^Ja8", "|~1D4Fj{kz", "4yb_{HS6jrWoe+", "O`P2Li>", "RWK%{HS6t", "T~<ioCp{P", "$yW@+cj{TsKXx", "PQK%/J>", ",d{u74Q8", "b;4oF]m>", "zdb_KFA8", "rsL^|im>", "Ap(i;VG8", ",d{u74|/t", "Ap<i0H(8", ",d{u74|/A(,Su8#GOWn%3S_f~jIs}7d)!;C@/J?8", ";I.^yF(8", ",d{u74|/A(MJu8#GOWn%3S/tezb`JJ})JIODHkdxlab2gAe:[$,lY~[f^2<", "QpU%Jk#8", "C~n%", "cbS;dH//A(}", "cbU%@JL\"aj[", "zx`2pK^b[m|", "IxF@k2>_9ja", "nNS;/Jm>", ":+n%=", "cbS;dH?8", "b;@&Y238", "6pM@[Xm>", "cbU%@J}8", ";AS;Skk8", "4b@&G418", "IxF@k2~8", "q(M_", "VW{u&2(8gs.Lq+", "cbS;dH//A(jE!Ml70?,uSks{;zL1~vPe[f4o^4Q8<RyC8rv6M~W@mU(8", "&QJ2,Jn8", "MW:@mU%zsaIss!teb;]X3S$KjrV#md.:pp2ieSzI~jijx", "Xb.^iFp{sa{B7.!7\"x", "MW:@mU%zsaIss!{", "(d{uJM./ez,Si!0", "/xRiDV9ojrV#s!{", ")pJ2~4.8", "SD7@vC(8", ")pJ2~4=zsaIss!teb;]X3S$KjrV#md.:pp2ieSzI~jijx", "&Q&;!iPF}?MJ9}Xeb;W", "@!t[l|;/C9a", "NAm%w2Cqrz", "?dz@6K08", "^d{unUf8", "f0]XAM(8", "Ixs@Y2(8", "@!t[l|38", "}dC_", "wW{u@JQ8gs&sl!teY~W", "?dz@6K|\"iL|`bM*fuxD2I2?8vzj18r2fReM_", ")p>]6KiSn?TLx", "oAz@&", "C~+i$Mn8<RyC)Q9)OG&;/JD9Ts<s6+", "P+K%{HS6t", "C~+i$Mn8", "LX=@Cka8", "(xT^fKG8", "rs<iNX>", "aA*ulF0_qz", "aA*ulFMP3(,S&}o)\"xVD/JWD2L|`0U7:JI.^2kk_tm;`GUl7Ixk%,", "&p<iFFm>", "++C_", "cbS;dH//A(>n!MDf&xpu,J.8k(L1w+l7%xJ;=", "@!t[^Ja8", "ddQ^|in8", "+jM_hKa8", "/!E_[VQ8", "uxzuQBa8", "SDj2]4a8", "\"xv_Ck(8", "&d:@,Jn8", "$~b_rUf8", "$~b_rUj{kz,SF+Tf^pU%Ck?G29|`T}u.|;@&Ni?8)9ERC.e:ujODHkk_psKXx", "!Aj%<J|8", "zdb_{HS6jrWoe+", "nN1DNXPF}?ARi+hG&xZ@k2~8k(mRIaj34k.^(2^b[m|", "&QP2LiR$b_&", "np,uJMCqrzMJ9}Z6zx!^6K(8Y(#1i+;3=!i8:H(8\"LJSl0wfrs\"%I2zIvj]U&+l7mbW", "2~<ioC(8", "2~<ioCn8\"L<|XvreV(@&5ig:09(|M.y", "^dW@+cj{TsKXx", "^dW@+cj{Ts|`_OA6##U%<Bg:09kbylG:)p&;KF%wez,Si!7:x+K%", "Ap+ipK>", "_se2}JIx", "\"97U>U{x", "&L<^#~){t", "xt.^sGlIW", "c5m%dHS6jr5Rkr", "mb1i$MsPW", "~b<i9FaY$(", "hy7@`BL/u(evUMDfFt<i,", "O5!i,Ja8", "y!n%/JYYl_", ",f.^;V<8P", "rpz@&", ".It^/JR>", "gWI2dF/t:sb`IM*fu~<i^J7zP", "+pU%zo08P", "ApU%/JW&samRyl(fdW1iDVO\"t", "R`K%/JD9%9#", "PQK%/Jm>", "wWb@}Fm>", ",d:@w2y8", "Bb{u", "+pU%RaiP59", "ep@&xU~/p9|", "?A_%RaiP59", "n~/[xUs`HLdbx", "jWm%^418", "4ke^;X>", "ep@&xUk8", "a%*u", "Uy1DHks,:9a", "+p(i,J!8jNhQe+", "PpW@fKs`HLdbx", "2yquRa|\"P", "{fJ2w208jNlSx", "]p&;SkboC9(1%}]Gx+@&fKWDP", "T~\"%:Ys`%9|", "zdlu:JR/:sTnVvL3l&h&Sklqn?(Vx", "O35_Zlk1K0):Avy", "QAY^JkVK59MJ!=1fRb&;=J>", "g5#%bC<8", "O`<i]4/m^*", "S5:@I2(8", "4ka_,", "}Nb@gMm>", "[W*u", "&Am%@JQ8H#+Bx", "C~+i$Mn8<RyC)Q9)OGS;@J/t3(KmG=T.C~]XPc@/59iNi+Tfep`u", "w3Q[/4!8", "sW(i<JQ8jNlSx", "&BK%]4|/u():Avy", "n~\"%Pcp{mrHQur", "gWM@JkG8", "4bM_sqf8", "pN1iI2m>", "HI\"%/Jm>", "vf]XvBa8", "!W1idF8_ezG+&+y", "vfBD^J08", "/d{u<BQ8", "6p`uhK38", "}dC_<B.8", "%xv@Ni\"8", "S5{uUkbx", "OWru", "C~+i$Mn8<RyC)Q9)[:J2BUzD=sb`_OA6m;M_WU/tA(;QOI&6XIW", "[W+i=", "upn%:H(8", "Ixi<*2G8", ",d/^Yq%zmrhQr}@Guxs@oC$Kjr_CurTf7px4HkUYCsijhJwf", "%fE@Uk8/.mVj9K[7mbW", "x+Y^yF^b[m5`K!p.lfM_lFf8Rm&|2MC.", "My/^Mq_fHL4Xx", "87<i&2!8Pse[hJ!7t+E@yFs`2L.LurG:ujODHk9Dkma", "dAz@6Kn8", "4kV_g2(8", "OWt[SkPxJ9SS&}7:/pn%Jk;/u(QXz.9)Obk^&", "O5!i,JL/C9|`.yOf", ",d/^Yq%zsa5RPae:%?i8TKm|2LLS|v!7\"x", "S5n%Sks,tm|1ur", "vfBD^JxziL|`5d3.q(M_.XzFC9>ndae:Ebt^5in8,jhQXvRG", "/eK%Ra(8", "qeM_,", "@!t[^J)zsaqR#M2fdW*uvBtmjr_Cur;3=!@&]4R/maoL!Ml7Ix", "O3<iFFp{mrHQur", "vfBD^JxziL|`_OA6IxuiAM]CC9BS}7v)}dC_", "vWt[TB{D:9#`]&T.4bW", "bf<ioCn8", "ZrP2oCm>", "`f.^{H(8", "\"xzuQBa8", "dW*uvB}8", "}xd4DV>", "|~P2bV(81|\"Us+", "\"dW@<J/t3(ro:.Df[:.^(2R$=@dFzFjrhQr}@Gux", "S5n%Sk,P=sD", "y!n%}F_f;z", "V(zulF7{9?", "~N@&G418;(", "h~)29F^b;z", "Axv_VFxzK?", "##L^w2>", "&Am%w2<8", "Y~i8.Ba8", "^d{u44f8", "vfBiHk#8", "3AW@Jk#8", "4bm%", "O`J2,Jm>", "iy1D<", "ddb_SkCP*z", "q(M_lFf8sz", ">+}]6Kn8.(", "gW*u.X&C:9", "?d@&G418", ">!t[^Ja8oNhQ8r", "np,uxq%zt", "UeM_<B_fP", "C~Y^5i\"88", "t+E@&", "RW:@`KX1maLX1M*f", "/dC_<Ba8", "_+I2Ukn8", "=dM_Jk08", "304o:HQ8", "uxv@iF(8", "bW1iUk.KvjC#ur", ",d{u74|/A(f#mdu.JI]X3S$KmaXRyrz7OWn%.X&C0L[1x", "@%1D@JS6C9|`75k~Ix", "OWt[Sk?8", "=!5_/Jm>", "*9S;Hk(8", "Q%}%^C<8", "EW(iUkbx", "vfBD^Jxz29b`5d3.q(M_lFf8\"L<|XvreV({uxqP&saoL!Ml7IxuiAM]CC9BSx", ")IX^xUm>", "nN.^(2s`:9+;9KxGdWi8\"2X129]U9Kd)f0]X3S$KmaXRyrleM~n%lF./*z", "T~<iNXbon?]U~l(f", "hy{u74|/jrf1Avwf{xpu,J.8#LhQx}C.0x<^O2o6C9\"`~X<7l&(ifKiP=s9b)Qk~x+;^&", "d;5@{Fn8", "vf]X(J08", "Z3@&5i*D=sGn8l7:HIODSkHY3(pjeUPeV(P+zoVKOt5`jdOfn$RXg~,dP2^J?8k(!13v0", ",f.^;V<8", "=f<ikq5qrz", "bb.^Jk%PXma", "}NS;/Jm>", "aW7@&", "w3<i0H(8H#+B6+", "w3`uzo0829", "+p(i,J!8S5?|q+", "$57@6KD9Jm;1e+Q~aN4o^J//`L9b)Qk~x+;^&", "R`K%/Jg:uLul3vy", "87<i&2!8Pse[hJ{", "Bbb_@Jn8,jhQXvy", "{xJ;@JQ8)scj6+", "&Am%@JQ8H#+B6+", "4^,uI2m>", "bW{uUkpx", "PQM_", "7bP2^4.8", "U_a_^J>", "$57@6Km>", "bbU%I2D9%9!1x", ")IS;lin8", "T~<ioC08", "dd{u", "HyM@k2n8", "##r^k2>", "RWQ[(208", "ddb_Sk?8", "|eP2<Jm>", "ppi8\"208", "Gd1iHka8", "gW*u.X08", "x+;^Jk!8", "%f;^*2_fo?3[tr", ".Ib_^4#8", "rs\";EUn8", "vfBD^Jxz29b`bM|6LeODKFD9Jm;1e+", "T~<iNX_fo?3[tr", "\"x!^`BK\"P", "{xpu,J.88", "np,u.XiPt", "9x<^O2o6t", "w3t[;V38", "&xBP&l<8", "V({u", "1JnS\"4}1P", "?dBiSFf8", ",d6t@JG8", "!$@}a)ux", "G$~.e:ep*u.XZ7n?51e+", "?dE@JF(8", "4s+^Wcz{r", "NB7@3K%zSu", "!`b_3SEw8", "[;P1yHG8", "mblu", "W+2i);k8", "<ft2FNQ|P", ":pWUN|ox", "x+Du*J5q3(1", ",d+ioB?8", "x+Du*J08", "6N}%", "yd\"%=", "?dE@JF]Ct", "nNS;^J>", "QA{u,", "Rb.^iF@/+mijhJwf", "nNS;^Jcwezro{U!7Ix", "nNlu/J>", ".A{u\"208", "epz@&", "pp[2*2%z3swX3v!3=dW", "^dDufof8", "pNODKF>", "[WBi<", "y%k^yFn8", "4bX^yF>", "[f0iDV!/!Lhii+", "^dDufozFpsIsur", "y%k^yFOY:s#1tr", "PQ7@|iPz^j3Le+", ".N.^wagq!LKXx", ",0/^}M$K3(_|Pal7&dru", "HI.^*2>", "cbOD@JO\"+N>;v!0.&x", "DA%;=", "m%1iI2~8", "m%1iI2K\"1z#", "kI\"%NX>", "DnC@rc>", "S5lu", "gWBi]]A8", "Q%k^yFOY:s#12Md~n%)29F>", "<!{uA", "0$ex=:~$ex=:~$.Qk7+j]X(2xz<synta9),d6t@J&zbzBSndC.BbWn?Pm>C8;km>C8;km>C8;k(BQj6[}7u.o;5@P\"W&;zl1)yOfG$b=h~=t1JhSJ6/_", "o`(i9\"NNNr9`ex=:~$ex+", "~$ex=::c:unB.8)9xoC.y", "=t:u74|/V0L1,Uz~\"dWnd", "43:unB9FUx9`ex=:~$ex=:~$ex=::c<^&MD9tm\"U/lW0wnC@rcD,p(BR@==:MWE@M^H\"Uu9", "43<^&MNNNr9`ex=:~$ex=::c{+:H]FUx9`ex=:~$ex", "vfz@6K_\";{.", ",!ODewg,tmJvKM*f", "gDBipK*o%9|", "m3B^EUWx", "o`(i&", ",!ODewCx", "c~)2iFf8", "1yp@dHs{#(JSeU{", "+p/^&2(8", "[Wm%*2(8", "wnC@rc>", "fA1iFFox", "Id:@|ia8", "vfz@6KDx", "`emt", "`;BipK416sijtr", "wnI2hN;8", "1yp@dHs{#(JSeU{@MWE@M^H\"Uu9", ".A{u\"2X1P", "i~<i^J216sijx", "GAm%&", ",!ODewg,tmJvKM*fp~n%", "P(t^/J%Peztotr", "C_L^iFZwrz;18r", "2DBipK*obz*bgAy", "C_L^iF6x", "2DBipK]CS9yCx", "?Wn%{H08", "5%.^kJ.8", "2DBipK%zbzBSndC.BbW", "m&E@w2Zwrz;18r", "P(t^/JQ1+", "?Wn%{HVKTL2?hJA6", "2DBipKp{#(JSeU{", "5%OD3Va8", "ppm%", "2DM_[V^z%9\"bx", "2DOD=Mp{L:ER>)l7Ix", "2DY^5icwtmwXYF:.ddru", "gDM_VF<8", "V(B,;X<8", "G`&;EU01A(QLndd", "6ym%@JQ8", ";W:@&", "X)t^/J[x", "(Q,u,", "5%.^bi38", "?Wn%{HVKTL]WdaYf[fW", "X)U%dHSPpsLR4vxe&QW@]w>", "X)b_dHR/`5AUVvA6;AS;=", "2Dj2$Mqx", "vf_%", "gGb_0n9zXzxo/r", "pp/P`K<8", "z@&;uE1YtmwXx", "/dW@Vqa8", "4^&;.of8", "z@&;wagq!LKXx", "z@&;.ogqDzA{~l3.", "i~P29Flx", "[;*u", "Q%E@&M%zKj&sx", "FWI2RUVY|(kbRF:.4bW", "[fE_{Htmt", ";I\"%NXuY!LAUx", ".N\"S;Dwx", "Hn)<=NA8", "rp4o^J?8", "Q%E@[Xm>", "++*uUk38", "6pM@#X(8", "teF@6Kn8", "@pm%", "4k:uvB.8", "MW+i!i(8", "F~U%[Vez3slStr", "0$ex=:~$ex=:~$.Qof++s;)#~Kn0/`GGv)6f@&#X;00?mR~l;f?A(i9\"KB<D{BUJY*5;CU>F__ezeyex=:~$ex=:~$ex{*&Q1DVpvx5y/`GGv)6f@&#X;00?mR~l;fJ`/1jpswk(Wo]U}*hD7@NiNNNr9`ex=:~$ex=::c:unB9Fu51+15N,rHC8+F__eziNl!W0F~U%[Vn8:L8l3v;fXOSU>F__ez^", "43:unB9FUx9`ex=:~$ex=:~$GGv)6f`aeBW&,y/`GGv)6f@&#X;00?mR~l;fDW{uANocZL.L/l**hD7@NiKB<D{BUJY*0$ex=:~$ex=:~$.Qof++s;)#>_TLAUb8{*&Q1DSkH\"Uu+[nMwfE;tPoB</A(Gg:o[}&Q1DVpswk(Wo]U;W~$ex=:~$ex=:~$GGv)6fTr=4}_rz5d|v:.eHC8+F__eziNl!P", "t(+iKF6z45BSAvoAM~+i(\"]x;[$J9}H.6c!JPcVKhut`ex=:~$ex=:~$.Qof++s;$oiP3(<Ub8{*&Q1DSkH\"Uu+[nMwfE;wHKF5qWNhQurDfXO*+(]n809HgeF`f++s;?Pm>C8;km>C8;km>SUPcVKZ[nRl!0.IHC8+F__eziNl!W0F~U%[Vy_69<|3lz=p0,u/Joc7mnLXv[}&Q1DVpswk(Wo]U;W@>", "~$ex=:~$ex=::c:unB9FNyA|Z!+\"F(0rA3n809#`NvD*t(+iKF6zlyA|Z!+\"|eP2<Joc;[$J9}H.6c!JPcVKhut`ex=:~$ex=:~$.Qof++s;)#Y\"+N6[b8{*&Q1DSkH\"Uu+[nMwfE;DHKF$Kps$QXv?~x+;^9\"KB<D{BUJY*43:unB9FUx9`ex=:~$ex=:~$GGv)6fTreBS6C9zV.Qof++m%wS^C8bb", "7pE@?F:P.m[1J.Vf/NODjpswk(Wo]U}*hD7@NiNNNr9`ex=:~$ex=::c:unB9FmNlSb8{*&Q1DSkH\"Uu+[nMwfE;[<;V<8BNlS8qg}43:unB9F;[$J9}H.H<H8;km>C8;km>C8A3n809HgsF:.QA/^5|%DFj0V.Qof++m%wS^C8b6LVv=6m%J%I2H\"2LhE7.!7XOSU>F__ezEOC7v)6f`ankm>C8;km>", ".AOi_H3|q[NQ~vPe[f^<fKu\"iL6[>", "&Q1D=", ".N.^.of8", "lfE@6K>", "/dE@qFS{v?_C~l0", "MWE@M^<8", "Ap/[KF>", "nJtPoB!8", "[f5_DVQ8", "u+W@@J>", "[fE_QBS6C9", "Gp<i#i&CC9", "&Q1D5@H\"iLH+yl2.^d1i1X|\"{LMNl!U{", "6ym%@JF6uL|1x", "457iKF:x", ".A!i/49F2LLSx", "7pb_&", "it5@6KR/t", "/Nk[yHy8", "aN)2<", "P(+iKF6zy5&sv+", "P(+iKF18", "{?1H(", "P(+iKF6zy5qvZ!Of\"x", "P(+iKF6zGN\"U]}u", "P(+iKF6z{yxoN!1f", "P(+iKF6z45BSAvoAM~+i<", "P(+iKF6z45BSAvr\"OW*udF>", "P(+iKF6zo#LS{Ul7+p/^&2(8", "s;~@vC(8", "bW:@mU(8", "&QJ%@J.8", ";Ab_:n08", "x+;^&", "P(+iKF6zc#`Lx}<7b;~@vC(8", "o0bDEU(8", "m;R@iF(8", "P(+iKF6z(NdCN+p&/NW", ";I)2oCR\"t", "i~J2oC>", "[fE_{H}8", "Aps;:HG/0s@n8l0", ",d5@4F>", "PQK%Gw>", "?dk[k4^Ft", ".A(iGoxDt", "`fk[IJL\"P", "i~X^|ibor", "Id>%,", "i~X^|i9Dr", "ppK%", "+p/^&2*o%9kb8l(f", "VWn%=", "C_L^iFZwrz;1Wa<:2DBipK]CS9yCYx@0C~W@QB=z2L31ulNdU_:u74|/4#<s]}re&dru", "C_k^[~UtW", "4_t]5~8?.u", "4_t]1)h~eu", "epE@8UD,p(BRi+", "Z&]X(2xz<syn+}OfBbX^(2NbTL<s1==:nNlu/J;0hL<s~l`f=HOD,7*x9R/`:M:.4b0r", "&t3r", "43I;d", "2~<ioC>", "epE@8U<8", "VWE@@4.8", "nJtPoBU/u(", "XI&;4F>", "Q%E@&M(8", "o~.^/J.8", "cbOD@J.8", "n0MD`B18", ",pk^?F>", "2~/[<", ")f.^fK%zTsPss!j3", ")f.^fK(8", "nNub/JG8", "LbP2<Jjx", "p0M_", ",!ODew>", "/dI2!i?8", "o;&;=", ")p5@cF<8", ",d/^Yq(8", "fAn%=", "fAn%@JQ8", "nAI25i&CC9", "=Q/^iF(8", "i~.^fK>", "lf6;]47Ft", "u+b@QB.8", "[;tPoBU/u(", "Osz@6K>", "cbX^oBQ8", "u+b@QBO\"P", "nNM_<", "6p/[NX>", "[;P1yH8_:s!", "obX^oB{Dsa<U9K9630OD:Ha/!L%LOB\"~\"!M_B26zp(>n6+y~&xx@`BW&saMmda:.6$7=e:H)C@(qp{wt", "ZyI2!iCP:sl`~.e:Q5m%<JK1.m9bEQ<:u+W@@JiS5sXSOI57dW*u+2iPA(5`*qA6Y~3Wy4Q8KtyC<=57Y(x", "&dDu,", ",dm%<JVY&9N1~v;f", "cbODIJO\"C9N", ")p{u$N$K!LKXx", "P+M@&", ",pm%,", "[`*+I7rx}*MJUJDfYDODyHk8", "^dDuWQ~8", "i(m%", "^dDuEQxz29\"|ul0", "/d*ueK08", "!;o2pKG8", "fAn%l|a8", "_7M_", "\"9@vE~cPW", "nN1iaC%z3saL6+", "zn(^qqPx", "QAz@3lH\"3(1", "F~S;TB>_WzK#&+", "Id*u@JQ8", "O`P2uH.8", "D`Du", "QAz@,1PDez", "nN1iaCR\"H9SSx", "fAn%~5*op(", "P(t^/Jpx", "6fM@{F>", "?dBik4O\"29SSx", "4bI2vebx", "vb1[5X^7Q*", "]d1iyHf8", "x+K%GKp{H9kbgAy", "VWs;vBn8", "zdJ2.Sa8", "fAn%l|9DPma", "\"9x;&", "fAn%hN(8", "|:d2k.Y~W", "sX/v)7?8", "C_YJo)NIt", "{d;^5iqx", "/N}%", "mbE_", "|:Kv}J?8", "{d;^5i7P3(1", "epE@8U9z:9<|eUDf", "VE6U;~BtW", "Mb1D}F~8", "/NM_", "6pE@iF(8", "GpM@@5f8", "QAz@@5f8", "i~<i^J7P3(1", "6pE@iFmYez", "6pE@iF<8", "%?o2^Ja8", "Mb1D}F>_psa", ",dE_,", "QAz@3l<8", "]N}%", "nN1iaC(8", "i~<i^Jqx", "6p/[NXw,p9|", "mbE_=4>", "F~S;TB~8", "p~K%QB>", "2D,2cJG0W", "BBi8.BvCC9]Ur}wf{xhb/J>", "QAz@&", "QAz@Go08P", "QAz@Go08", "[;I<?", "4Wz@Y25q2y+oN!(fm%J%]4Q8", "[;tPoB!8", "DAC_", "udz@w2d&usqvgA;f", "udz@w2d&usqvgA;fw3+ipK>", "F`9U=;Ex", "ppj<LOR\"t", "dHC8", "A!N;=JQ8", "<N.^O28_ps2?JAJeBb{u", "udz@w2SC%9ulgA;fw3+ipK>", "8RX2sUQ/t", "WRX2sUQ/t", "}Nlu/J>", "2D{2rq~0t", "2D,2cJ{x", "rQW@]w(8", "oN,[TK(8", "RtbD<", "Bs.^Wcf8", "ibV_]408", "Aps;:H\"8", "VEe2FqUtW", "LbODNX(8", "qIrP", "S`28", "K~<ipK>", "QAz@,1f8", "cX4%2kDx", "|e:@6Kn8", "oA*uUkEx", "WRX2sU~8", "2D{2rq:x", "Apx4s~>", "EbU%<", "aA[2s~>", "S5n%=", "y!n%uE%x", "S5n%Gw>", "y!n%uEPx", "ypv;&", "Qpv;_EPx", "h5P2oC>", ";IJ2oC$KJl\"", "+pTH=5)x", "`f.^Gw>", "bb.^{F18", "Rbb_@JsPW", "+pZbnbox", "Qpv;_E%x", "iZK0Q;0Y@0", "iZK0vlgq>?", "iZK0XQ_Xtm!", "4b1DEU(8", ",dC_", "FnC@\"", "2~C@&", "\"9zU9q{x", "VEEA[Xk8", "2DZ_}JL\"W", "Xb.^|i>", "6ya=;Xk8W", "Gdn%]4#8", "HI\"%@J>", "C_KvxU`{W", "5#YvW~30W", "&Ln=>Gg9W", "6y/^8~(8", "6ywA[~h~W", ";A:@^4P&P", "6fX^oBL/t", "Xb\"%&", "E(M_tD(8", "E(M_tD41P", "qb=@=", "DA\"]&", ")p5@cFmYez", ")fU%dHK1TLlSGMC.bbP2=J7zP", "vfE_DV//A(", "Q%<i<", "3p:@&", "3pru,", "lB8iU!dx", "K`%bz", "`fI2NX(8", "y!lu", "/NE@Fq@8", "GpM@&", "GpS;^4Fqt", "z@&;=", "=Q%;nB//V0L1S+", "qbt^/J>", "0$ex=:~$ex=:~$.QL:Y3MrCLF,lrsSHvY*0$ex=:~$ex=:~$.Qof[JW@Kp+1*zRRWae:Kk*u_cU|<DmDeUwf5fD2]4Jq2L+B7./}Ap0iBqezKDUDv!teoJea&4YY|1cQ[.a(>*}%/`{xTD&2u8H(N`kv)X9zXzxo;lof:+F;D6a#7PdM_I\":~$lN;fBbQJ^JQ/p9(VOB})&dR=tPFCqx#1Av57Ix/]tPm>C8.X9zXzxo2=/:K~M_C6a#Nr9`MIA6nN&;~wc9DzBShJwf!$rr\"~yd>v=Jw6iLIsc|nW~$exy~QA%;Y^H\"iL/Ub84~`fE@6KfHqx9`ex#G)A_%cF&x};SE+)5+0$ex=:FWI2RUVY|(kbb8@0}b/v;~$L,8t`ex=:++C_:HS6\"u%qu8@3(eK>=:~$PM*fddb@=K|\"vj~Ub8WzBBR=tPFCqx#1Av57Ixr+nBG/ZP<|:a!7<29Qnkm>2o^4O\">D=||ln($a1JdJAm,84w_IDGOW/^6KD9)9l1!dwf\"x/]tPm>C8.X9zXzxo2=/:K~M_C6a#Nr9`MIA6nN&;~wc9DzBShJwf!$rr\"~yd>v=Jw6iLIsc|nW~$ex\"GPQ0ra~rx9R[?f>5r9`2!re|Ik[!k&,Rz5MPIhp&<5^`B//u(ev4Al7.ABiHk38!R0yex=:OG1DBUPFZPBRf=/:{!BiU6a#$R0y2!k~ddrum\"XY9j#`llnW~$exz7[;K%oBO|!r)L5.qe(eK>=:~$T}<7JI0r<BP&[m[?f>5r9`2!re|Ik[!kPxTD9MPI\":~$d7h~C~OD!kicCD[?m#E+#k.^;Xp{sa.vnMDfLe0^VFYYezdM_I\":~$.Qre&QW@]w&xI9mR:.F(&<H8;k3~n?TLb8@0,0b_`B_m,8t`ex=:d!1i~4X|!rRR{UwfBbR=tPm>C8JMH\"3(yV!0&6ppR=tPm>C8*S41}?sSb8&9v`JX=%(>C8;kS{09^U|vPe[f0rCJCqrzQXu8G.(idQwga#=jhQl!(fU_s_]4!/ZP_C:a9)@Hl2AMp{sag?f>5r9`Ed:./H^X:JA/<L~nc|nWYeK>sefJx;nBn/A(QXN+v)Id]Xp%(>C8;k`{[m[`llnW~$ex=:~$}Kn)Q%\"%.w&x5D[?f>5r9`ex=:##b@NiAGDzOjb8TfVWW@e<jbe[0yex=:wF9Qnkm>C874;L]8t`ex=:~$exP)++k^cFO|!rIMPI\":~$ex=:~$[=\"~!;o2pK!|la4vAv!76`1JZ<fHqx9`ex>T&<`]tPvc:9pnJAZdApm%vBPFC9|`llnW~$exz7[;K%oBO|!r6L6+M(&<H8;k3~tm,c>ore,dE_dHzF\"uevVvA6DfR=tPm>C8xqxzFjFXyl2.kH^Xa~Rt2D;X4|nW~$ex)),0/^5in|laJEO+M(&<H8;kg:Dz\"bgAZdt+/^1VU|!rHE+)5+0$ex=:6p>]bU08&uMJO+M(&<`]tPvc:9pnJAZdApm%vBPFC9|`UKn)`f`A/Ja/sag?f>5r9`jMDf.NJ2!i&xPsfLAvPe]dR=tPm>C8JMH\"3(yVexI}5y0i=%(>C8;k./vjC##=/:Y)MAw2fHqx9`exQ~Q%g26K1/.z0Vd7O}uQS_3XfHqx9`exM7[fE@HM41}?sSb8Ezv`m=tPm>C8CJzFpsZJ0=L7!$lq$9LeR=tPm>C8y4R/u(6L!Ma(4k\"%[X$K6[0yex=:##b@NidDpsLR@=/:C~n%!Grxzm#MPID+0$ex=:.A{u\"2X1&uND8l/3(eK>=:~$O!;f;AQ^Z^1YezL14va(u~OD4FfHqx9`exy~QA%;Y^H\"iL/Ub84~`fE@6KfHqx9`ex)),0/^5in|!rJEArN9;`%4=%(>C8;kaYu(;1Al{f,0X^?F&x$_7cc|nW~$exQ~4b/^6K&x|_7c}79)QAC_\"Ko{:9aX;|vd$a}=_^g:];}Lexk}[50J=%]S]8^?gE_)=dz@J2$K|(7gd7v)6f]Xp%(>C8;k21A(QLndb(*9W@lOfHqx9`ex,eE;E@8USCfL<s~lH..HC8/JB\"3[0yex=:dWW@RUbCT?L1b.a(U_ODKFp{3[0yex=:+(b_%6/tp_7cc|nW~$ex2ft+(iyH9DDz9V!0u.9x`+F]&z3[0yex=:]`=@5iL/:sA13lH.R;0r6izF2L[?m#E+LGF`94;/.mvjhJA6{IS;@JQ8!R0yex=:ZrP2oCo{[m^sMA/:2D,23XNI6[0yqlnW&<bJtc$K$1|1ula(^pM@6KD9Jm*s}7E+0$ex=:Mb1D}F|Y:s}V.Qkf6f{uoBL/sdoj?8@3e2dQwga#A8qmK+l7Je%@|i^F_LLS{Ul7<29Qnkm>2oTBtm}?ERlU<7!$=7*7H:o+X6a#Nr9`ex9)vfE@6K:,CsIsc.a(E)S;/JfHXQh??~R.gLy^fKc9DzBSndC.Bb4o94;/.mvjhJA60tU%VFDC$1.LGMH.<29Qnkm>/&oBF6n?VjcMn)!$n!Yf}idQwga#yt8om=k~Ce*2!i}_n?518r(}*QODY^n/.m5`n\"PekQW@JkiCqx9`ex))l;\"%dHzF\"u;QP.9)\"!E@X6a#Nr9`MI$dvf/^lO&x@;[?f>5r9`bdY~c(1iDVO\"\"uQX+=k~Pb}=_^g:];}LMIm?^~C8T@Jbe[0yex=:##U%%6R$m=tPm>C8+2Z73(/`c75+0$ex=:&pru<J5CPsdbF!;f!$/8P{(eK>=:~$K+\"~eAE@:6R$m=tPm>C8<BrDkmlSGMC.!$\"}n)$~M_p)rxzm#MPI\":~$ex9)vfE@6K:,CsIsc.a(E)S;/JfHXQh?f>cjRK>=\"~\"d{ulF,ztm^U6+=p&<H8;k3~:sVj}7E+0$ex=:~$exP)++k^cFO|laIMPI\":~$ex=:~$[=\"~!;o2pK!|la4vAv!7\"n0J=%(>C8;kFCqx9`ex2f(x/]tPm>C8;km>^Xtcxzn?HKb8O}(eK>=:~$ex=:##b@NiAGDzOjb8TfVWW@e<jbe[0yex=:wF9Qwga#\"#N1iU(f|e)2HkYYDz!1i+=p&<H8;k3~:sVj}7E+0$ex=:~$exP)++k^cFO|!rIMPI\":~$ex=:~$[=\"~!;o2pK!|la4vAv!76`0J=%(>C8;kFCqx9`ex2f(x/]tPm>C8;km>^Xtcxzn?HKb8&9(eK>=:~$ex=:##b@NiAGDzOjb8TfVWW@e<sbe[0yex=:wF9Qwga#\"#N1iU(f|e)2Hk08JmhQ8r=p&<H8;k3~:sVj}7E+0$ex=:~$exP)++k^cFO|!rIMPI\":~$lNE+0$ex=:pp]Xp%(>C8;km>C8y4__TLsS2=/:`2dQnkm>/&T%]S]8Av}}@GLe*2!i}_n?518r=p&<H8;k_fv?jS_=/:a`EA;6a#Nr9`ex!7i(}%u6/tp_<14|nW~$exP)]dt[*2C6>DkVd7h~6pn%U6a#$R0yA|!7A!$WnBG/mag?f>5r9`bdY~c(1iDVO\"\"uev!\"=9~nOJ=%(>C8;k__59(|#Mn(}n*+mOfHqx9`exQ~4b/^6Kk009(|M.a(kL4%C6a#Nr9`.Qre&QW@]w&x~m<sz.5+jF9Q~@n/.mwj}}@G`fX%^Ja/59dM_I\":~$.Qre&QW@]w&xI9mR:.F(&<`]tPyHC9yC$x\"~?d4oF4o62L7S|v0.ux/]tPm>C8CJzFpsZJ0=L7!$sqBzLeR=tPFCqxajhJA6Q`P2<Jpc!r$Jz.Of@pm%;Ya#Nr9`lNI~Y(&;Y^YYqz/`?86)&idQnkm>2oTBtm}?ERlU<7!$vx*7J:I+X6a#Nr9`ex\"~@0&;EU&x5DSE+)5+0$ex=:&pru<J5CPsdbF!;f!$~8@3(e7IT%$4?mIs.lf)q(M_jppcIsJv]}})zx1J^JL\"aj<s>oPeW7M_;Ya#Nr9`OBd)pNQJ@Jj6@?(Vexg}T2dQnkm>2o^4O\">D=||ln(}nr+9JAm,8t`ex=:Ap+ipK&x9bTK\"G5+0$ex=:x+1i:HbC\"LBSKMp.!$y86)&idQwga#%Dl1~vPe[fQJ/4O\"29BS}7E+0$ex=:.A{u\"2X1&uND8l/3(eK>=:~$`v!7Fe<^3K%zpsLR@=/:ApW@Z2<m,8t`ex=:YWF;!kdx9R[?m#E+`)N@oBFq$1l1~vPe[f]Xp%(>C8;kFPqz/`u8@3(eK>=:~$IMC.ieN@_YT|!rhmR|yfLeR=tPFCqxajhJA6Q`P2<Jpc!r$Jz.Of@pm%f@!/p9<|eUhdApm%@JO\"}D{Bx}wf<29Qnkm>C8:Hn8PmmKb8M7Id%4=%(>C8;k3/=(<|Bd$dApm%@JO\"&uMJ9}Y~Le0^4FB/C9;MPI\":~$OBu.NB$W:H|/p9<|eUv($a<iH6a#Nr9`d7d)\"!N;Y^FPqz/`k86)&idQwga#%D|1ulZd++;^Jk]x:Dl1~vPe[f4o>F%zpsLRulc~[fE@|ia8:D5R4vl7pNQJPcxD3(dM_I\":~$}KPe]N9;!kdxab[?f>5r9`5dDf$~t^:63~tm,cc|nW~$exM7Id_]6Xb{iLLSGMC.!$:M:.4e(i=%(>C8;kVY>R%[&+a(}n*+mOfHXQh?gE7.`fC@F4o6C97gOB`fa%E@@4.8:Dl1~vPe[fQJ/4O\"29BSwBc~[fE@|ijCvzqSGMC.<29Qnkm>C8:Hn8PmmKb8M7Id%4=%(>C8;k3/=(<|Bd$dApm%@JO\"&uMJ9}Y~Le0^4FB/C9;MPI\":~$!0u.i(z@hSL/kmzVd757pNODS6a#Nr9`lNteJe!^:H&o3(/`A86)&idQnkm>C8nBm\"n?3[b8Z9BB@&F]po3[0yex=:##b@NidDpsLR@=/:FWI2RUVY|(kb}7Y}%e!i=%(>C8;kaYu(;1Al{f,0X^?F&xc%7cc|nWYeF`BqzFpsIs~l_)`NJ2!iAQDzj18r=p&<H8;kg:0L8l+=9)lf2D!kF6<LU#||vdkLl+Nk,,XPjEn\"m?e2dQwga#%D:B]}})Je<^yF){v?qSGMC.<29Qnkm>C8~4dDpsLR@=/:jt!iI2P&iL[?f>5r9`NlZG30M_:6^bt[[?f>5r9`f}DfJt\"%{H9D&uf#|v=7`fR=tPm>C8xqxzFjFXyl2.kH^XI77{_9jQc|nW~$ex)),0/^5in|!rCE+)5+0$ex=:&pru<J5CPsdbF!;f!$~8@3(eK>=:~$IMC.ieZ@:H&o3(/`~8Y}(eK>=:~$jMtepNODg^Z729BS1=/:epz@X6a#Nr9`lNI~FeZ@#Xbo\"uMJu86)&idQwga#__;1C.(fdQE@@4bCk(LRkr=p&<H8;k3~aj=|1d:..NL[!k*D=sGn8lK(&<`]tPyHC9yC$x\"~?d4olkF9iLLSGMC.E)*2!iL/ezwjK+Yf@ps;Bq$KpsKX3v7:OeK>=:~$5dDf$~t^:63~tm,cc|nW~$ex,eE;E@8USCfL<s~lH..H^X=JO\"29#MPIhp&<aA/Ja/$PWoS!7:m$J7l7@NJ2!ipcIsJv]}})Je*2!iL/ez5`J7d)pNODKF7wqz<|eUG:m3K%dHzFZP<|:a!7<29Qnkm>2o^4O\">Dj1GMmG.HC8M]YL,8t`ex=:,pm%h^dDnR0V!0k}|y0i=%(>C8;k1YtmwXb8@0%Bl+)e:j,8t`ex=:Mb1D}FH\"aj<sb84~Z~S;Hk:xTD/Uc|nWYeF`J2$K5sqE+M57BO2o>F%zpsLRi+(}/dE_dHzF$15R4vl7pN4oBqzFpsIs~l_)`NJ2!ipcvzqSGMC.w_S;KF$K3(dM_I\":~$.Qre&QW@]w&xg9|1+)5+0$ex=:k!{udHK1>D5R4vl7pN0rsq$KpsKXc|nW~$exy~QA%;Y^H\"iL/Ub84~`fE@6KfHqx9`ex4~Z~C@!i~f:9?V!0Y}BBR=tPFCqxajhJA6Q`P2<Jpc!r$Jz.Of@pm%f@!/p9<|eUhdApm%@JO\"mrTveUwf`fE@94h\"aj<swB(7[;I2!ia/p9wj1!Yfppm%;Ya#Nr9`}KPe]N9;!k:xRz5MPI\":~$ex!7i(}%u6D9p_7cc|nW~$ex4~Ob!ipK&xRm&|4vl7zidQnkm>2o:HFq\"uQX+=k~\"n.vP^zIruI`v{ad]`r+C.EIx;>UO\"m?e2dQnkm>C8`KVK=ssSGMC.!$Ed:.9x`+F]&z3[0yqlnWPeODDV$>{L[1wB/:gD)2iFmYezKm,lY~;AS;Y^1YezL14ve:Y_S;KF$Kps@RYvPe[f0r@4R/u(KmK+Yf@pz@mFH\"Pmb`llnW~$ex4~Z~S;%6D9m;MidM*7(e7IT%$4?mIs.lf)q(M_jppcIsJv]}})zx1J^JL\"aj<sB7d)pNODKFpcfL<s~lH.ieX%FFmYezD#eUl7Ixr+:HezDz<sz.Of:t,uVFzFmag?f>5r9`Ed:./H^XX.xz!D?q4|nWYeF`J2$K5sqE+M57BO2o>F%zpsLRi+(}/dE_dHzF$15R4vl7pN4oBqzFpsIs~l_)`NJ2!iAQDzj18r(}.A!i/49F2LLS`\"&6vNS;_6LYCsKX}7E+0$ex=:fAn%_6D9K;+U>G>?(e7IT%$4?mIs.lf)q(M_jppcIsJv]}})zx1J^JL\"aj<sB7d)pNODKFpc)s,cur=p&<H8;kzIvj{Bx}L3!$`v!7&idQnkm>2o1VW&v?EKB7d)pNODKF&x8m>;c.5+0$ex=:YWF;!kPxRz5MPIhp&<aA/Ja/$PWoS!7:m$J7l7@NJ2!ipcIsJv]}})Je*2!iL/ez5`Wol7DN4omF*oTs?2AvA6ux/]tPm>C8sqgqDzzVd7EzAs`2KJfHqx9`exM7[fE@HM41}?sSb8Ezv`m=tPm>C8CJzFpsZJ0=L7!$lqj?LeR=tPFCqx$JF!n)QAQ^,J?8!R0yex=:*9S;KF~fiL)[;va(kL*+^I6CXmwX]}H.*idQnkm>2o^4O\">D=||ln(}ntvdJ8_`juBG=Yf6fBi=%(>C8;kxgu(ijrr\"~eA(it6g:Rz5MPIhp&<++0H&otm)[;ve:OeK>=:~$:M:.4b0rm\"JP<Lun%G5+jF9Q~@n/.mwj}}@Gux3rf@!/p9<|eUG:m3K%dHzFZP_C:a9)zx/]tPm>C8JMH\"3(yV!0=9#`%4=%(>C8;k./vjC##=/:554%C6a#Nr9`MIk~W@%;~4^F59/`=7Y}1``+N6a#Nr9`MId)Q0OD%62<Rzl`CM:.e0]XI7f0n%*24|nW~$exQ~4b/^6Kk009(|M.a(kL4%C6a#Nr9`OBd)pNQJ@Jj6@?(Vexg}T2dQnkm>2o^4O\">D=||ln(}nbAdJAm,8t`ex=:Ap+ipK&x9b^1fopzridQnkm>C8`KVK=ssSGMC.!$bdY~c(1iDVO\"maUE~|DfQ$PM*fddb@BqgqDz|`k8Y}5;R=tPFCXQxnVvZdApm%vBPFC9|`llnW~$ex~.mb;^5i`I;z?V!0Y}BBR=tPFCqxajhJA6Q`P2<Jpc!r$Jz.Of@pm%f@f8TsLRulo~aNBi!iAQDzj18r=p&<H8;kg:0L8l+=9)lf2D!k59F;+ck8C(&<H8;kg:Dz\"bgAZdAp+ipK&x}tQvh7s9+idQwga#%D|1ulZd++;^Jk]x:Dl1~vPe[f4o>F%zpsLRulc~[fE@|ia8u_LRc.!75Aj%;Va8!R0yex=:rs\"%4Fa|laCEO+M(&<H8;ks`2L)[;va(##*+mOfHqx9`exQ~Q%g26K1/.z0Vd7Z9ZDBJF]fHqx9`exQ~4b/^6K&x^%7c}79)QAC_m\"4~C_NX0G5+0$ex=:&pru<J5CPsdbF!;f!$~8@3(eK>=:~$IMC.ieZ@:H&o3(/`38Y}(eK>=:~$IMC.ieN@_YT|lahm.|3.(eK>=:~$:M:.4b0rm\"^,E%Miy.5+0$ex=:.A{u\"2X1&uND8l/3(eK>=:~$O!;f;AQ^Z^1YezL14va(U_ODKFp{3[0yex=:dWW@RUbCT?L1b.a(U_ODKFp{3[0yex=:##b@NidDpsLR@=/:FWI2RUVY|(kb}7Y}%e{uNkaYu(;1Alc~Z~S;Hk:xTD/UYx4~Z~S;Hk:xTD/Uc|nWYeF`J2$K5sqE+M57BO2o>F%zpsLRi+(}/dE_dHzF$15R4vl7pN4o\"SY\"VjRKEXn)aN0r@4R/u(dM_I\":~$MIk~W@%;~4^F59/`=7qzPB`+56a#Nr9`MId)Q0ODg^1YtmwXb8@0$_YJ)7tm,84w_I9}\"dz@h^__9jb`R8(}/dE_dHzFjr$Jz.Of@pz@BqzFpsIsur(}^pBi,J=D7zdCNUd~@N&;@J;L]8t`ex=:FWI2RUVY|(kbb8@0D`D+mGYL,8t`ex=:&pru<J5CfL`LG=a(U_`+>Gw9TD[?m#E+`)%@|isCRm7[6+i*E)N@Vq9DDz#`J7l7@NJ2!ic9DzBShJwfE)l2KFT/@R%s?lYf{bM_JkiCqx9`exQ~Q%g26K1/.z0Vd77zo;2J;~fHqx9`exQ~4b/^6Kc9DzmRn=/:&L4v(fEb.[0yex=:U_U%]4X|laxnuF59kbm=tPFCqxajhJA6Q`P2<Jpc!r$Jz.Of@pm%f@!/p9<|eUhdApm%@JO\"mro#VvJefJ3btcP&d_l1MA5GujODHkiCqx9`exQ~Q%g26K1/.z0Vd7EzP;xU>GfHqx9`exQ~4b/^6Kc9DzmRn=/:_s/v3X[I6[0yqlnWPeODDV$>{L[1wB/:gD)2iFmYezKm,lY~;AS;Y^1YezL14ve:xIU%1C41M0:Bda/},d2D^BL\"v?j1}7E+0$ex=:FWI2RUVY|(kbb8@0\"b>=8G{j,8t`ex=:&pru<J5CfL`LG=a(U_@==76{NL[?m#E+`)%@|isCRm7[6+i*E)N@Vq9DDz#`J7l7@NJ2!ic9DzBShJwfE)|idH)z]jpvi!Y~StU%2kiCqx9`ex))l;\"%dHzF\"uQX3vI~;AM@X6a#Nr9`}KPe]N9;!kIxRz5MPI\":~$ex!7i(}%u6D9}%7cc|nWYeF`J2$K5sqE+M57BO2o>F%zpsLRi+(}/dE_dHzF$15R4vl7pN4o>FIDpsS#B7mGa%6;/4|8T?:Bdae:OeK>=:~$T}<7JI0ri]fHqx9`ex#G)A_%cF&xpD[?f>5r9`K+\"~eAE@:6R$m=tPFCqxONi+=6&x/]tPm>C8y4P&Pm&sgA/:1`DuhKgqn?b`[=\"~!;7@fK$Kps[?f>5r9`PM*fddt[!kHY.mvMPI\":~$.Ql7DN`A(2j6ez/`#!H.^d1i=%(>C8;k__59(|#Mn(]`m=tPm>C8B27{?j&sb8O}(e7ItPm>C8JMH\"3(yVMI59;`%4=%(>C8;k./vjC##=/:1`4%C6a#Nr9`MIk~W@%;~4^F59/`=7Y}1``+N6a#Nr9`MId)Fe:uQB;Y$(/`u8@3OGq+mOR$4%2krx}*evsq59*bq+wS=z29NMPI\":~$MId)Q0ODg^0_!L:C1=/:[`%4=%(>C8;k|Yezwj`lre|Ik[!k*xTD[?f>5r9`IMC.ieN@_YT|lahm.|3.(eK>=:~$:M:.4b0rm\"^,E%Miy.5+0$ex=:.A{u\"2X1&uND8l/3(eK>=:~$O!;f;AQ^Z^1YezL14va(U_ODKFp{3[0yex=:dWW@RUbCT?L1b.a(U_ODKFp{3[0yex=:##b@NidDpsLR@=/:FWI2RUVY|(kb}7Y}%e{uNkaYu(;1Alc~Z~S;Hk:xTD/UYx4~Z~S;Hk:xTD/UYxP)aNW@5i(8$_JEa.V(&<`]tP5bezdC#=Y7!%2iHkiCqx9`exP)aNW@5iT|laUEArTfZ~\"%Jkn~U9^15|K(&<`]tPyHC9yC$x\"~?d4olkF9iLLSGMC.E)N@Vq9DDzVj:MC.^dm%CkF9xRsS]+hd;I)2oCaYd*iNi+=6.Hs_,JtmC9b`FxTf++m%;Ya#Nr9`MIk~W@%;~4^F59/`aQY}D`D+N6a#Nr9`MId)Fe:uQB;Y$(/`u8@3OG2JM4|83_7c.x6),x[XeeI,x;=`0UDf~NR=tPFCqxajhJA6Q`P2<Jpc!r$Jz.Of@pm%f@!/p9<|eUhdApm%@JO\"mr$J`}wf;IQJeS%zK?5RArhG(Q,uu69o2L8l3v7:`$rr\"~@H0^xUj{29dM_I\":~$.Qkf6fy[^45C\"u,S&}H.87b_@JYQ^%JEv}<:m%b_/JV$tvZ<fHqx9`exQ~Q%g26K1/.z0Vd77zHs,2pXfHXQh?gE7.`fC@F4o6C97gOB`fa%E@@4.8:Dl1~vPe[fQJ/4O\"29BSwB`fNABieSc9]jJv(=d),x:unB.8!R0yex=:]`<iyH9DDz9V!0;~3pW@VFum,8t`ex=:d!1i~4X|!rRR{UwfBbR=tPm>C8lFf8&ujE4|nW~$ex8.$9k[!kYL,8t`ex=:&p*u74!|!rIMPI\":~$MIPe|Ik[!kYL,8t`ex=:NAC_3S&x|_JE775+0$ex=:zdJ2.SH|laJE~|U(&<H8;kzIvj{Bx}L3!$`v!7&idQnkm>/&(2j6.mMN~l3.eH^X=JO\"29#MPI\":~$MIk~W@%;~4^F59/`=7Y}1``+N6a#Nr9`MId)Q0ODg^0_!L:C1=/:[`%4=%(>C8;kaY}RZJ2d=7Os0ri]posadq.8@3]`4%2krx}*ev6{s9mbv_wS=z29NMPIhp&<aA/Ja/$PWoS!7:m$J7l7@NJ2!ipcIsJv]}})Je*2!iL/ez5`J7>3.NE_w^9o2L8l_M^3SD7@Nin0C9lRAl7:OeK>=:~$jMDf.NJ2!i&xP9&UVvA6^dR=tPm>C8sqzFpsIs#=/:>tm=tPm>C8lF0_.mP;G=T.!$H.k~IdaWT@Cbe[0yex=:##b@NidDpsLR@=/:Mb1D}F|Y:s[`k8Y}5;R=tPm>C8JMH\"3(yV.QY}BBR=tPm>C8*S41}?sSb8/?v`%4=%(>C8;kaYu(;1Al{f,0X^?F&xo%7cc|nW~$exQ~Q%g26K1/.z0Vd7L?j5f=n)fHXQh?gE7.`fC@F4o6C97gOB`fa%E@@4.8:Dl1~vPe[fQJ/4O\"29BSl0C.<!Bi_H^Cr}HK?lD*H_U%]4q{~}dM_I\":~$}KPe]N9;!k9xRz5MPI\":~$ex!7i(}%u6D9>%$J>G>?x;xU>G:x9R[?f>5r9`{lYfQAz@t6pcDz51c|nW~$exQ~4b/^6K&x~m<sz.5+0$ex=:++C_:HS6\"uMJO+M(&<H8;kiS:9T[{Uv(]`m=tPm>C8xqxzFjFXyl2.kH^Xg7w9TDUE4|nW~$exQ~4b/^6Kk009(|M.a(kL4%C6a#Nr9`d7&6m;S;%6R$=@5iL/:s[?m#E+`)%@|isCRm7[6+i*E)N@Vq9DDz#`J7l7@NJ2!ic9DzBShJwfE)v@yFR\">D5RnM*f<29Qnkm>2oTBtm}?ERlU<7!$f}(fxehW`B}_$15RnM*fe2dQnkm>^XdHm\"]?/`y86)&idQnkm>C8,Jj6@?(V!0Y}BBR=tPm>C8xqj{lLKX`\"\"~.A2i%62<TD9MPIhp&<aA/Ja/$PWoS!7:m$J7l7@NJ2!ipcIsJv]}})Je*2!iL/ez5`J70.e0ODHkiCqx9`ex))l;\"%dHzF\"uQX3vI~;AM@X6a#Nr9`.Qre&QW@]w&xg9|1+)5+0$ex=:C~J2|iNbpsij1=/:ydm%@JGm,8t`ex=:k!{udHK1>D5R4vl7pN0rhK__TLij1!Of~dODU6a#Nr9`}Kk~~H/&F]po3[0yqlnWPeODDV$>{L[1wB/:gD)2iFmYezKm,lY~;AS;Y^1YezL14ve:gDW@#Xp{sa&s?lYf<29Qnkm>/&Wc;/:9+o[.57!$[MC.tidQnkm>^XDVtXn?51b8R.[f)2=%(>C8;k</0sERn=/:)p&;KFp{3[0yex=:]`b_[XPF}?/`c75+0$ex=:x+1i:HL|!rIMPI\":~$MId)Q0OD%6pcDz51c|nW~$exF6e0*uP6/t}%SE+)5+0$ex=:zdJ2.SH|laUEO+M(&<H8;kg:0L8l+=9)lf2D!k&Ip_SEA8H(&<H8;kg:DzgjrrI~=pQ[!krx}*pj.|6),x*+mOR$4%2k59];CHQ|,:vf5@4FfHqx9`exQ~4b/^6Kk009(|M.a(kL4%C6a#$R0yA|!7A!$WnBG/jr@`J7l7@NJ2!ipcIsJv]}})Je*2!iL/ez5`J70.e0ODHkPFXmJSt&Vd~dd20HjCk(\"|l!(fq#L^Z2y8!R0yex=:OGZ@?q$1ps!Qw+l7mb1DOqT|!rsRulK(&<H8;kzI0s*sDUd)Ce0rhKSPtmH#NqGze2dQnkm>^XdHm\"]?/`k86)&idQnkm>C8,Jj6@?(Vd7Y}BBR=tPm>C8xqxzFjFXyl2.kH^XX.[6NLwac|nW~$exQ~4b/^6Kk009(|M.a(kL4%C6a#$R0yA|!7A!$WnBG/jr@`J7l7@NJ2!ipcIsJv]}})Je*2!iL/ez5`J70.e0ODHkF9PmzbgAZdu+W@@J;L]8t`ex=:Ap+ipK&x9brc/8s?12dQnkm>2o^4O\">Dj1GMmG.HC8M]YL,8t`ex=:,pm%h^dDnR0V!0k}|y0i=%(>C8;kf8{Lz|]}b(]`r+|6a#$R0y1G!7z?b@O2%zmrBR~v})/d]Xp%(>C8;k`{[m[`llnW~$ex=:~$}Kn)Q%\"%.w&x5D[?f>5r9`ex=:##b@NiAGDzOjb8TfVWW@e<sbe[0yex=:wF9Qnkm>C874;L]8t`ex=:~$exP)++k^cFO|!rIMPI\":~$ex=:~$[=\"~!;o2pK!|la4vAv!76`0J=%(>C8;kFCXQh?f>cjRK>=\"~\"d{ulF2YXmIs}7E+0$ex=:qb=@SkiCqx9`ex=:~$}Kn)Q%\"%.w&xpD[?f>5r9`ex=:##b@NiAGDzOjb8TfVWW@e<jbe[0yex=:wF9Qnkm>C874;L]8t`ex=:~$exP)++k^cFO|laIMPI\":~$ex=:~$[=\"~!;o2pK!|la4vAv!7\"n0J=%(>C8;kFCXQh?f>cjRK>=\"~\"d{u<B38iL4X}7E+0$ex=:qb=@SkiCqx9`ex=:~$}Kn)Q%\"%.w&xpD[?f>5r9`qlnW~$ex2f(x/]tPm>C8;km>^Xtcxzn?HKb8&9(eK>=:~$qlnWYeF`P2Z7psjD8l/3<29Qnkm>C8:Hn8PmmKb8M7Id%4=%(>C8;k3/=(<|Bd$dApm%@JO\"&utLhJOfL&#%~4x&09BSc|nW~$ex\"GPQ0ra~rx9R[?m#E+#kE@I2uHqx5R!d.:OeK>=:~$+}(f6As;!kYL,8t`ex=:++C_:HS6\"ujE4|nW~$exTfRbU%I2JP:s[i|vOfAHC83SPF6[0yex=:SDBD~4Fq<L4X>okfQ%Y^BqgqDzzVd7Z9ZDBJF]fHqx9`exTfRbU%I2JP:sjDW.57w_U%]4X|laoXK\"rzfLm=tPm>C8y4R/u(6L!Ma(4k\"%[X$K6[0yqlnWT$llnW~$exM7[fE@4J&Cn?XKb8>0rpBiSk6P.m6nwxTf6f5@>Fp{v?aMPI\":~$d7d)7pt[!kn~L_TqEdH(&<`]tPMPXPKm}}@GLes@cFQ/mag?f>5r9`IMC.ieZ@:H&o3(/`38Y}(eK>=:~$+}(f6As;!kYL,84w_IDG1$llnW~$ex~.mb;^5i&xpD[?m#E+:`]Xp%(>C8;k|Yezwj`lre|Ik[!k*xTD[?f>5r9`IMC.ieN@_YT|lahm!\"l7yidQnkm>/&oBF6n?9VexH(&<H8;kD9DzmRn=/:xthv5)do.[0yqlnWy!*u74.8!R0yex=:ZrS;|Xp{&uKmeU!7(eK>=:~${lYfQAz@t6pcDz51c|nW~$ex4~Ob!ipK&xRm&|4vl7zidQwga#db|1ulZdApm%vBPFC9|`llnW~$ex))l;\"%dHzF\"u;QP.9)\"!E@X6a#Nr9`.Q9)~H/&V]mL,8t`ex=:Id>%u62<TD9MPI\":~$.Qkf6fy[^45C\"u,S&}H.87b_@J8H^%<1wxcd;`X&[6a#Nr9`}KPe]N9;!k/0K%JE+)5+0$ex=:zdJ2.SH|laNXu8@3(eK>=:~$5dDf$~t^:63~tm,cc|nW~$ex,eE;E@8USCfL<s~lH..H^X=JO\"29#MPI\":~$!0u.i(z@hSL/kmzVd757pNODS6a#$R0ySN!7A!QJ/4O\"{L&sgA/}Mb1D}F__:sIsur@0\"dz@h^c{090BgAe:OeK>=:~$bdY~c(1iDVO\"\"uQX+=k~gEKWp)h>w+NkCcn;zMPI\":~$MIk~W@2D~4[ChL3L~l(f!$,vA6qI`+mOUL,8t`ex=:&p_]>FMP!Lhib8O}]`/&eepomrT[1d?yA~C8P^R$KWi]oII1[?m#E+a_%@|isCfL<s]}re&dt[mF0_.m{BJAl7pNi8,J|\"C9oLPI,0\"dz@h^1Yezro{U!7|f([nB=zJm4XhJwfE)%@|isCRm7[3vN+a_%@|isCfL<s]}re&dt[mF0_.m{BJAl7pN]X6iF7,L4XB7d)pNt^5ip{sag?f>5r9`bdY~c(1iDVO\"\"uQX+=k~\"nw+Nk_QXP%qpo<:M)l+v)Z9@%6Kv{Ty(e7IT%%9?mIs.lc~[fE@uHa/u(GS&}H.&Q1D^JO\"mr$Jz.Of@pm%;Ya#Nr9`MIk~W@%;~4^F59/`JM;~1I2JP^/t>%I`M7vd]`r+:.Tf9;SEQ8`y(e7IT%%9?mIs.lc~[fE@uHa/u(GS&}H.&Q1D^JO\"mr]R?lH.teODDV;L]8t`ex=:FWI2RUVY|(kbb80fqtb_1~|B!a>Uwx&9,~C8T@V~2DfS/8u(w&m=tPFCXQTjhJA6w_S;KFX1.mKX+okf6f{unB|/ez5`UKn)`f`A/Ja/&uLR3l(freGBB2$K5spveUwf7Az@6KoI0s*str\"~,dm%CkewXmIsI|!7A!DAFq9DCsb`llnW~$exQ~Q%g26K1/.z0VMI~GFWbn[~h>\"=P^3~5_I`Nq+zZDWa;~O~K%hN4|nWYeGBB2$K5s[i&}o)=dru;Ya#Nr9`ex9)DAE@@4L|!rl1x}Of+j)2=%(>C8;k21A(QLndb(*9W@lOfHqx9`exM7Id_]6Xb{iLLSGMC.!$:M:.4e(i=%(>C8;kVY>R%[&+a()54%C6a#Nr9`}KPe]N9;!k],ab[?f>5r9`2!re|Ik[!k],ab[?f>5r9`}}=7.A(it6/tp_7cc|nW~$exQ~4b/^6Kk009(|M.a(kL4%C6a#Nr9`MIk~W@%;~4^F59/`vxqz+B*+56a#$R0ySN!7A!QJ`K08JmKX+o9)i~<i^J;L]8t`ex=:6fX^oB9DDz9V!0m?%e{u:JxziLMNi+2f!%+i}F(8hLwX`}(fa;R=tPFCXQTjhJA6?sb@Wc;/u(GS!Mn)`f]Xp%(>C8;kVKvjxo]}})@H/&ee?HA((1W.l7H&m%lF2YXmIswBd)gs1D|X.m,84w_I^.7Am%;Ya#Nr9`.Qre&QW@]w&xg9|1+)5+0$ex=:ApW@Z2bC{j+Bb8&9v`%4=%(>C8;kID59V#b8&9v`JX=%(>C8;k./vjC##=/:VW+iG<PxTDz`Zx7z;`_][6a#$R0yr&Vd~dd20HjCIscXVv:.FWru;Ya#Nr9`}KPe]N9;!k/0Rz5MPIhp&<uaS^B/<LI|~l`fRbU%I2JP:s7S&}Y~}x/]tPm>C8xqxzFjFXyl2.kH^Xg7w9TDUE4|nW~$exQ~4b/^6Kk009(|M.a(kL4%C6a#$R0yr&Vd~dd20HjCIscXVv:.FWb@mF./kza`llnW~$exQ~Q%g26K1/.z0Vd7N9*bXvu.fHqx9`exQ~4b/^6Kk009(|M.a(kL4%C6a#$R0y&{g~[f]Xp%(>C8;kID59V#b8L?v`%4=%(>C8;k./vjC##=/:;`4%C6a#$R0yJ7T.C~W@hS1YezdM_I\":~$}KPe]N9;!k@0Rz5MPI\":~$ex!7i(}%u6g:C_7cc|nW{K!JFF}XC9eyex=:~$ex=:~$ex{*.AeuwS^C8b|1ulZdApm%vBPFC96nd7u.o;5@P\"S{09^U9}(f`fk[jp(>C8;km>C8;km>C8;km>Ar:H;8T?@YqN!7A!QJ`K08JmKX8q;W~$ex=:~$ex=:~$ex=:~$ex=:dI.^;Xp{$[0yex=::c<^&M^b!Lyn4Al7.ABi(\"QHqx9`ex=:~$.Qof$(4o@J7zaj<s?&&9/n>WwS^CxtmR<M%0kLX^hMiw}Rynu8O}}nkvmG/tp_.S`xk3g~(izpq`3(yB/FD}xRQ[HMFcvzT[D\"Y}v`!J=Mo{w[0yex=:~$ex=:l`b_3SzI0s*sDUd)CeealF0_.moLAvl7gEq+Q@tQlaJEZqj?Y&>W.X;09z&`c7x9zs*+:.\"H3_XENqez?b`+a~oITD+UZxk}@n`+:.dxH_}qQ|59Q`r+=7bITD&`Fq^?`Le+i]|t2DJEA8&9O)BJeeg:0DJEFq,:#51Jn):xo%GSsqezkL1JxG=,la>slqqz[$wq^?/sl+a~wc5DiH}Kk}Is\"=!k[I0D(q3|w}gDe+#~*xo%#i`{m?,nbA0.],la>U&{=9}eQvS.DI}%%q8X+zQ`1J(f,,>%%qA|5955hWT@ibC_zqd7k}U#WaJ^ic|_li.8/?D5i+U^z,0DeSy8L?$)i+C.c9>%DX6{,:]n;vS.<H@;hm.|,:ks/v%.~H3_#i}G>?5$sq^?pL\"=D~{,9;5i.Qk}6n>=U^cc>;Ni387zgDi+ee`I:_CEzo,:#5tvH.\"H+uz2Q|u(SDkvGeI,g1eS88g}5$a|k}uB@=K]{,!Dzqk8&9D5OJC.$>0DzqD{>?}nbA<7;fg1hm:oY}N$qqw}QLMAGe8Qv;Ni!0rz2X,+S^wcc%(q.8&9Z)n=o)#tC_DX=o,:9bbA#~~H3_z2)o=9|$Nq+z(bOJU^ic$_rcA8&9gD*+.ek0:_eSk8&92X4v:.#t0DI2X|,:O)>=v)AH|_#iN{s?}n1J(fEIg1Zmwqu([$lq$9{B;vT7,CH_XEhK>?}n1J<7NIYP$mNqm?D$qq$9PBCA%.|tF;iH.Qk}P;@=U^McK;WUA8Z9zsD+<7Nb:_iHOK,:$)}=:.<H|_$m`{59}n/vGef0YP$mrF=9SDr+8GXtg1xsc759rsbA[~_?g1>Uvqqz|$e{k}}b}=jG5bru)Sd7k},sLvU^8Kj%SE?87z2Xe+<7#t}%$JQ8/:}btvF]\"H$_$J&FrzSDr+ee?QYP>soo@?N$iq%($Dn=D~Cc};\"2exI}:Bn=J^Fcm;.Sk8Z9o`_=RG~f:_SE/8Wz/ni+=7#t5_XE9F,:xfMARGkH$_GS2\"=9$abA8GtQYP>soo>?)5r+M]=,g1JEWorz#$Zq+zenCAjGGf2D(qd7k}K#MAzf\"0p_tc}Kk}|`\"=S^g9:_tc38&9w)BJ;~c9:_6K\"G,:w)n=sGB~0DfS_G,:h)&U*f/H|_hmm\"ezcEr+[~Xtg1ZmU\">?$a1JC.(Ho%z2Sq=9)51JsG~0g1xss{Xz;$ZqGza`n=A7X~TDtcMIk}?bCAU^wcH_|XQ8/?D5.v:.>Q!r>sl{qz9e;vS.h~K%MJ88tz7npAQ@:xC_vi&{]?)LpA>G8QC_%qsqA9dbZnT@jI2DA`sq$9)n>=GeF99;*q.Qk}.n>=U^>K5DNi?8Wz8B>=*f`I:_UE`{,:Y)`+v)GHc%}q*F=9kLbA8GsIg1;X&{59[$y8k}*b}=jGGfs;;X.Qk}3L@=S^8Kn;pKy8EzGL&U:.#t}%#iR|,:}b1J.eAH$_)KR|@?SDtv(f30g1>s}GezkLr+,7ibg19qA|,:a`1JH.<HH_DXdoqz}nr+2.mtYPZm6{@?|$lqBz)nCAjG\"05_rc!0k},sCA:MZ9$1hmm\"59N$lq|9OX}=D~\"0C_|i!0k}fLn=U^Fc3_NX/8N98B/vee$>0DNX%F@?]`tv[~sIv;dqWom?#5/&T@Z99;[jsqA9gXe+a~8Qs;9qZxk}|`QvxGR$1J:.5I!Ddq88g}r;/&T@.0K%[jsqGzPB`+I7F95_fST\"k}3L>=5kcc5DfK$Qk}6nvU|kMcH_k2X|GzgD@=5kgc>;iHZxk}l5;v5kCc^%iHQ8VdO)`+(f%x|_}qB\"FdO)8r8G9x|_#i.|=9YDtv:.\"QlaZmOKqz{e4v$7Lt}%02J7u(]npAF]8Qt[&`8X+zMXn=$7\"0C_liMIk}P;,+S^gc@;[X~8L?zs/vu.Nb0D+UL|,:>f%UH.<H^%$Jzoqz##1JF]9,g1JEn\"ezD$Zq%(x;pAee\"0>%,`M7k}+;@=jGX~2D=`Sq$9Asn=zfF9K%!iexI}D`MAD~Mcd%>U!059gD*+S^ccpD\"2Q8&98Bkvo)c9:_(qv{/:Y)}=,7AH^%}ql{u()5r+0.30la$m?8qz$a1J=7tQlaJEWom?#$Sq|9x;q+a~wcK;iHOB,:g)}=sGzx|_SH.Qk}!5%U5kic^%0288<9As2oT@[I@%=`lq+z@nl+i]{,2DxU?8Z9{bEAC./t:_>Uh\",:g)f==7/t0D)S7o,:M)w+mG(Q!rhm3|qz9b/&T@9xru<`Nqj?)L%U|kcc};+c.8O}zsYvmGzx3_#i6{g}[$Nq|91``+5kic};rcy8O}X#q+u.*xH_DX]{!9]`tv*f*xH_z2e{<9}nr+>GfflaZmq{s?b$sq+zC#`+]e8Q9;6S.Qk}kbi+!kicCDpK?8O}2Xl+.ePxH_SHO\"m?}nr+kf<0laZm*Fm?$ar+#~*,la>s_G595$iqj?t;,+a~ic+u?q!0=9GL`+a~Fcr[+cMIY}2X`+!kic|_)S.8&9Y)&U=7:,0D\"2!\",:fL1JC.#t}%}q38/:\"sbAo)~H5D$mk8rz}n4vjGt?g1|iA|59D$>Gk}7n_=Ge>Ko%CH.Q>?o`Xv&Sk0WmdqMIK~CXr+8G%x$_$J`{!90bkvjGaflaZme{x?YDEAD~Nb:_Wc)oFdg)w+V]kH5D>s#\"u(,n/vGe&,YPCH*{qz,nr+F]_QYPhms{Y}zbpAT@rx5_[jNqBza`;vJ^cc3_xUX|A9GLxU<7c9:_#XwqFdw)]U.e<Ho%8c;|j?D59UxG#tp_DXN{Vd>f`+xG\"Hd%SHa|>?YD1JV]I,g1xs]{]?ye4v$7Fbs;dqqqGz*spA;~xx2DqEvq@??b_=K]{,5_8Ua|A9{bYv.e#t:_;X*FFdO)8r*fkH|_SH/8tzYDtv[~$~YPZm9FY}?eXvjG_Q!D7S88<9oLpA;~xx];bjSq^?Gn_=$7xx}%iH!0k}F#CAJ^wcd%iH.Qk}2#QvJ^*xm;qE88:(3L,+i]8Qm%9q3|A9zsf=,7/t0DfS#\"Fdw)@=F]IxH_z2qqezq#tv.eUt!r$m%F59:eWaD~DI}%@Kn\">?i#pA>GF9}%,`dok}b`>=A7{,}%CHMIk}Ibn=Ge\"0>%<`iq^?,sf=S.5b9;eSexI})LkvJ^FcH_[Xy8Z9/nYv(fB~0D6K~|,:Z)`+:.GH+u$J!\"m?LXr+#~*,YP$mKK@?b$SqGz{B_=Q)X~p_=`8XA9i#MAD~FcpD4H!0>?D5l+S^Fc|_xU38Z9o`f=eeB~0D>U]{/:Z)CAkf(Hc%)Kq{,:xfLvo)(Hd%XEKKqz##tvsGu?YPxsQ|59N$Zq%(N5>=D~ccj%|i!0>?{bOJU^cc+u+U/8N92X`+.e:,0D6S;|,:h)w+0.<Hc%8cL|,:>f6U.e$>0D)Sl{x?]`bAsGBtg1hm]{s?5$lqw}QLMAD~X~n%eS!0k}4#l+S^ccd%?qk8N9D56UH.c90D?qk8/:g),+C.GH$_#i%Frzrstv*fXt!rhmKKrz[5l+a~|tF;NXexk}#5MA;~g:0D|ia|,:M)OJF]nflaZmD{.zN$Nqw}&s6UsG/t0DxU%F,:M)*+v)w95_QXvqezksC8T@/05_fK.Qk}v`i+!kCcpDNi38tz]`tvC.afrujE88>?As@=|kic>;zq~8O}o`l+[~Fb!rZm:oez5$NqA96LD+!k@0:_8UR|%(8Be+2.zIC_z2g7FdN5tv>G*x^%xsk8tz,nXv%.qblaHH88s??e`+Q@sb}%QXlqA9:eq+T@af}%QXNqGz}eQvT@nf9;qE&{<9&s}=Ge>K+uNi*{m?2XCAU^4t0D+cQ|$9>f>=<7#tm%z2doFdrB1J:.k0n%DXIoFd8;bA#~AHCD>s:o>?7LWa$7Sb!rhms{qz@nZneeoITD<`y8k}U#MAjGgc+uHHMIqzX#`+S^jI:_NX/8&9w)/vo)#tp_z26{/:Is1J=7kH5D>s2\"59##QvD~|fYPUE88qzN$Zq%(+B}=D~oIm%!i!0>?zsw+U^FcH_6Sk8&9xf}=J^Px0DfS/8O}GL8rn)$>0DPcQ|m?}n1Jo)x7g1hm8Xezb$sqA9[5}=A75bK%HH!0k}zb}=S^icm;3K/8N98B&UmGc90DSE8X,:g)>==7<H^%DX/8O}zse+8GkH3_)K]{Y}[$lq^?pL\"=D~8Qp_?qMIk}b`@=A7Gf>%HH}Kk}N5/vU^>Kc%|i/8&9g)f=[~#tm%$JL|,:9bbA[~/HCD$mpo@?SDbAv)T0YP$mv{rzD$wqBzj5}=Q)5bp_TK!0=9zs}=D~Fc};.S!0k}dbn=S^icH_HH38N9o`}=kfk0:_zq.|,:Y)*+kf~H$_z2OK59]`bA[~x7];qEvqY}j5e+a~xxx;+U*{k}~ni+a~{,m%5i*{k}K#D+g7xx2D|XE7k}W;4v|kgc|_9qR|Gzo`e+*f^b:_xU.8Vda`r+:.Ixd%z2xFqz15bA;~s`0DTKdoFda`r+xG{x5DZm`{59,nLvQ)/0lahmu8Xzde/v$79,C_%q88qzQLpAT@:x@%A`sqA9gXMAA7X~>%!iMIk}OXXvU^Fc@;6Kd7k}fL/vU^gcc%(2.8Z9/nvUo)#t5_DXqqFdM)i+xGLtYP$m#\"Y}deQvjGUtt[?2A|Y}l5Zn`@%x@%;j8X$9<shWT@}QF;tcZxk}4#}=U^ic5D!i||A9{bn=J^icj%6S3|A92XLv[~#t0DtcIoFdO)8rn)/H$_SHQ8u(YDr+2.Z9g1$mA8>?0eLvS.0?t[dqWorz:BpAT@}Qn%;jsq%(0eQvD~(QYP$m`{<9{e;vS.zx];dqJ7m?ZDpAT@nfp_DjsqGz.LZnT@0?];[jSqw}.nf=jGoITDeSE7k}9bEAS^Fc@;I2;|+z{bOJ(f~f0DUEU\"FdxfOJo)\"H5Dhm~|m?0br+n)sbYPZmQ8<9}eLvK]7,!DUH88<9,sTJ`@sIv;bjZq+z_B_=D~icm;|X*{59GL4vU^Rt0DTKT\"@?8BEAS^Rt:_rc$Q>?o`Xv5kFcd%NiT\"ezD5,+!kTf:_>UX|+zZ)\"=kfzIm%)Ky8VdK#bA.eIx^%)Kl{qzq#bA[~/0la;Xn\"Y}?e4vD~x7n%%q8XBz{eXvQ)nfm%%qwqw}F#2oT@^,!D&`Iok}ZDD+a~Zcd%\"2.Q@?o`8r!k:x0D+U38/?{bf=*f3~:_8Us{,:$)Qvo)dx5DZme{<9}nkvK]f0!rUEWo=9rsr+,7AH+uSH_G=9}nLvGe4~g1fK&{ez$a>=A7IxH_XEs{ez0b1JxGbI!r$mlqm?deLvjGSb5_02n\"m?xBbAo)^,!rhms{>?pLpAT@H~];<`NqBz$DLvU^ic3_iH.8&9GL%Uu.k00DHH?8/:g)*+v)AH^%$JA8/:>fMAeeGH|_hmFq@?}n.v$7O~g1HH&{.z1$Sq+zv`}=Ge8Qru\"2!0I}S#EAS^mt:_+Uk8&9Y)q+(f#tm%8cB\",:w)>=xG/H$_}q`{tz##1JsG4~YP>szou(|$wqA9D`\"=zfF9];2Hd7k}0Be+U^wc3_6K387zzsBJxG#tp_XEq{/:]nbAV]~H5D$me{<9}nr+kf_QYPZm2\">?1$qqBz4XpA`@<0@%,`iqGzC#_=S.{,2D.S}Kk};`}=J^8Kn;Wc387zD5EA[~Nb:_(q38/:S#1J;~/H5Dxs}G,:O)Qv(f~H|_8cX|m?$a1JxGCbg1Zm/8:(;$Sq|9W;n=GeF9x;3Kd7k}a`EAU^Fc@;NXlNk}F#*+S^ZcCDCE38Ezzs}=D~icpD6S!0k}[5@=S^icd%?qy8N9/n/v.ek0:_6Slq,:Y)2J.e~Hd%DXN{ez]`bAxGx7x;qEUK596Ll+a~xxs;+U*{k}2#]U|kicn;CHQ||9/nWa(fg::_HEM7FdY)%U[~%x^%DXxFrz7LbA#~+?la>s*Frzye,+T@I,K%jEA|59oL_=K]X~t[Wc?8&9o`}=8G#t0D+cqq,:O)q+eek0:_fK7o,:w)xU[~c9:_fKFq,:g)i+xG(Ho%}qx&59rsbA;~30g1xs?8tz;$Fq%(\"bMAzf|t!D<`M7k}/s>=D~>KH_.SMIY}D5WaJ^Tf:_(q.8Z9o`.v:.`I:_+c6{,:Z)CA8G<Hc%GSk8.zLXr+[~4~g1;XA|ezN$qq+zm5>=jGGfv;pK}Kk}fLn=S^8Ko%UEy8&9M)6Uu.#t}%GSR|,:h)CAxG(Hj%XE?8s?}nkv$7qIg1>U&{Xzb$.|k}#`f=A7Ccc%TKMIk}F#xUU^FcK;xUy8L?8BD+>G~f:_pKKK,:>fXvC.<H5DhmN{=9$abARG@Hd%XE(G@?)5bARG;fYPxs!\",:?e/vT@/0@%jEUKu(wX>=D~xx9;+U!0k}MX}=S^ccpDPc~8N9X#,+S^Fc5DpK.87zgDi+.eNb:_NiKK,:)LbAeeGH|_$m7o=9$a4vA7;fg1Wc&{59b$sq|9m5CAK]X~C_Nik8N9{bn=[~$>:_NXKK>?SDbA;~30YPZmh\"@?1$lqBz55MAK]\"0C_2Hd7k}OX,+U^Ccd%#XD{,:h)l+V]AH3_z2B\"qzb$SqBz~nn=K]Gf!DPc~8_(X#EA<7k00D|iqq,:S#r+>GAH$_8c{F59}nbA;~$>0DCHe{]?$atv;~FbYPhm.8>?YX^XT@K~x;Djlqw}TLl+g7{,F;8U*{k}$DYv|kZc|_!i;||9{bf=*f/tp_#i;|$9X#xUeeg::_2Hl{FdM)i+#~+?!r$mq{@?ye/vGef0>%viJ7ez~nZnT@NI2DA`SqBzS#CAD~{,C_+U!0I}*bi+U^FcpD3K?8&9g)D+U^Mc@;|Xk87z2XEA*fk00Dzqiq,:#5r+,7<Hd%)K38:($aQvS.<Hj%GSA8@?}nr+o)cbYPhm>Gezr;2oT@3fs;;jNq+zL5%U5kFcCDTK||A9o`OJmG/t0D|X*FFdM)}=2.bIlaZmR|qzue/vD~Q0la$m.8Xz0e/vS.EIC_%q88x?\"shWT@O~>%;Xd7k}TLLvU^ic5D?q.8L?X#Wa[~#t0DHED{,:M)f=)e*,YPhmhKrzt;/&T@ibTDDjNqj?W;\"=5kccm;;XX|w}8B`+v)zx3_#i*F59?ekvA7&,s;A`lqj?c#\"=K]oIt[eS~8N9gDf=C.$>0DfSSq>?$ar+u.sIYPhm2\"qzfn2oT@H~m%DjNqj?tBf=|kwc3_!ia|w}D5e+v);BjD1X4Ak}.L>=U^Ccn;8Us{,:w)kvxG<H3_z2_Gqzb$SqBz|`\"=D~\"0s;.SlNk}1`.vJ^icCDzq/8&9M)l+o)k0:_tc/8/:#51J[~GHd%DX||rz]`1J*f(H3_DX`{tz}nbAn)kH3_GSl{!9$a1J(f@H3_#isqY}#$lq+z6n}=K]{,!D6K/8Z9gDYvu.#t:_;XQ8L?o`]Uee#t0D)S/8N9zsl+sG$>:_6S~|ez)5bA[~#t:_!i}G,:>f.v.eGHH_SHM7>?cEbA<7>", "AsZnT@}Qs;,`OKk}U#f=Ge|tK%WUMIm?D5@=S.GfK%fS!0>?/nBJJ^Fcr[li/8N9Z)MAJ^Zc+u4Hy8Z9xfQvu.#t5_)KA8Wzo`*+U^icK;9q?8&9w)*+>Gc9:_WUO\",:ksbAkf/H^%GSR|,:Y)2Jn)$>0DliA8tzkL1Ju.2~g1hm\"GY}[$8Xj?&s_=A78Qs;li!0k}FX}=S^Cc};fK&F,:w)i+kf<H3_8crFezb$SqA9N`MAD~\"0K%k2}Kk}GnvUU^cc$_*2k8&9g)Qv.ec9:_fS||,:9bbA;~@H$_#iNqezht2o:HFqUu.vQ|>?9;Lv{]QHqx9`ex=:~$.Q3)/N}%lF0_.mP;G=T.=t([nB=zPmlS6+Bz8;7Au.jb>tHa?&~.a$c7x98B@=M]Ix$_}q}Gqz]`bAv)Ix>%,S&{tz3LC8T@H~n%SE~8Ez/nD+RG$>0D.S\"Gqz}ntv>G#fYPhmIou(PB/&T@Z9F;;jNqGz[5f=|kcc^%;Xa|w}gDn=V]9x|_$JA8]?Q`1J(fdxn%%qJ7@?K#hWT@ibF;&`sqGzH#CAK]{,@%6SQ8&92X]Uu.#t0D9q%F,:Y)8rC./H|_z2l{u()5bA,7sbYPhmk8>?As/&T@H~t[1jNq+z*sCA5kcc5D+c||w}2XCAkf%x$_DXA859,nbA*f1fla$mN{tz:eQvD~3f}%%qlq^?$DhW`@t?m%A`OKk}$DhWT@dxm%6S!0k}|`f=S^icpDWc?8Z98B2J[~#t0D#XR|,:h)4vee\"H|_GS7oqz)5r+*ftQYPZmQ8ez}nkvzfu?YP$msq59}nXvGe<0g1hmporz|$wq^?6L>=$75bx;3K!0@?8BkvJ^gc3_8UMI59/nq+S^CcCDHH*F,:M)@=sGqIYPhm+G=9c#/&T@dxt[[jNq+zi#,+5kccH_liL|Bzo`/vu.g:m%)KD{Fdksr+u.{x@;$mD{590bXvGeSb!r|X&{:(0br+RGib!rxs3|ez}eLvGex7n%%qFqj?_BhWQ@:xK%<`zok}j5CAD~Gfv;5ilNk}|5vUU^Fco%Wcy8&9M)\"=S^wc^%SE/8&9h)n=,7$>0D6K`{rz}nr+o)30YPhm.8tzx;2oT@3f9;DjlqA96nD+g7\"0ru5iZxk}Gn/v;~R$r+8GRts;qE88!9H#e+a~X~n%8U*{k}H#\"=|kcc^%?qL|$9GLn=:./t:_xUe{Vdg)l+RGIx3_z2m\"=9yeYvD~g9x;qE88x?MX_=D~xxTDbjNq^?U#]UU^cc3_9qX|w}8BEA)e\"H$_XE>G59,ntv=7Y~g1hm:o@?9ekvjG>?5_1jsqw}YX\"=K]8Qn%NX;|$9/nXvU^ic>;;X;||9o`LvxG$>:_6SFqm?q#bA;~Jbg1hm~8Xz7LbAH.}QYPZm2\">?{ekvzfg9p_;jNq$9:B,+S^icc%*2.|w}zsLvxG/HH_#iFqqz,nbAmG/HH_)KKK@?,nr+;~Rtg1$m.8Y}{e/vGe~0t[xcUK@?VXpAT@7,@%<`lq$9x;l+a~F9x;CHMIk}t;*+!kccCD4H.8/?gDYvC.D90D*2>G,:M)\"=#~}Q!rhmrFm?db/&T@0Q>%A`Nq%(;`*+5kccpD4H.8&9X#>=)eR$1J<7h~K%jEWou(Ibe+a~oI];)Sexk}gXq+.eg::_UED{,:O)l+(f*x3_#iu8x?;$Nq^?QLXv|kic};(2.8O}2X]U=7{xH_}qSqm?}nr+C.V~!r$mc7m?D$sqGzuBl+p)xxF;WUlNk};`6U5k/00D(2~8Ez{b/v(f#t0DSEm\",:Y)]Uo)GH$_z2]{ez)5bAsGjbYP>sL|,:9e;vjG\"QruMJA|qzdbhWQ@Ixp_,`wq|9FX}=D~FcCD=`e{Fdg)8rv)9xd%$Ju8rz,nkvK]G0!rxs/8@??eCA`@z,n%%qsq+zpLTJT@0?2D=`qq|9GnCAS.GfF;<`Fqj?OXf=D~ico%k2!0I}YX@=S^Fc^%|X38Z9o`6U;~~f:_UE)o,:Z),+;~(H|_hm38s?LXr+H.tQg1Zml{rz5$qqw}S#n=S.\"0F;+UOBk}$Dl+S^Px:_*q?8_(gD@=U^Mc>;CEk8/?o`QvxG>Q0D*qy8/:$)w+V]\"H5DZm;|=9}n/vGe$~g1Zmqq595$sqGz(b@=%.X~@%4HlNk}Asl+S^8K+u3K?8EzX#,+[~`I0DJEm\",:Y)9Uu.kHc%DX?8/:$)kvo)/H|_Zm+Gqz}nkvjG0Qg1$m~|=9|$SqA9db>=zf5bv;k2exI}C#n=U^DI:_lik8&9w)Xv>G`I:_HH(G,:Y)9U=7kHc%}q`{x?rsr+>G8?g1;Xn\"m?1$y8k};`MAD~ccr[zq!0Y}2X*+U^/00D4Hy8&9M)8rmGk0@%z23|,:9bbA=7<H$_DXv{!9$abA)e0QYP>s%F=91$iqGzAspAF]s`0DDjFqw}l5i+!G5bp_CH*{=9GL8r5kPx:_xU;|A9$)QvC./t@%SHh\"FdY)/veezxH_)K+G>?7L1J;~{x^%#iQ8XzCXbA:.jI!rxs~8=9de;vK]DIm%MJWoqz[5TJ`@0?@%vi88rzQLpA;~8Qs;,`y8k}*bn=D~X~n%fS!0k};`BJJ^Fc>;xUy8Z9o`*+>G:,!r$m;|w}8Be+v)zx3_#iSq>?}e/v%.afm%%qWou(IsZnT@Ut!D<`sq|9.n@=D~X~C_<`lq^?*b@=$7\"0];*2MIk}\"bxUU^Mcc%|X38/?gDYvo)>Q0DxU~|,:$);v*fkH|_>siq,:#5r+mG@HH_$ml{=9$a.vS.mtYPhmN{:()LC8T@,,m%*2*{k}FX6U|kic>;eS;||9/n,+2./t0DTKOKFdO)`+*f:x|_DXN{Xz0btv*f_?!rZm^oY}?e;vK]8?ruMJ88<9|5hW`@yQ@%A`Sq|9>;}=zfxxK%eSexI}1`EAU^g90DWU?8&9w)xU(f#t:_I238/:O)%U:.~H$_$JQ|u($abA)elIg1=`Sq^?\"s}=K]Gfv;?q?8O}GL@=8GAH|_SHsq59}n1Jee#fYPZm`{59[$sqw}%B\"=K]8Qx;8Uy8O}zsD+sG\"H3_8cQ|>?b$NqGz2#%UJ^ico%li/8&9D5BJ(fc90DSE(GFdO)LvF]~H^%)K2\"ezYDbA*fx7YPxsL|FdZ),+2.<HH_)Kv{]?0b1JV]lIg1$ms{:(}eLv$7qIx;xc&{x?L5hWS^Mco%fK;|^?o`2JeeNb:_eSx&Fd>fe+H.~H5DZm/8u(,n.v$7$~g1$ms{x?deLvGe%xs;dqlqBzFXpAF]5bF;1jOKk}N`_=D~gcd%|ilNk}@nxUU^wc+uNXk8&9M).v:.#t5_z2\"G,:#5bAsGAH5D>sv{u($a1J=7BtYPZm2\"59#$Sq+zFXpA`@9,!D,`Fq%(!5\"=S.{,K%(2exk}\"bEA:.#t:_JE`{/:O)w+[~(HH_XEKKqz$a1J:.3fg1Zm]{=9N$lqGzoLCAD~5b];|Xd7k}MXTJT@Q0TD=`iq$9Ibf=Ge8QK%+clNk})L]UJ^wcn;zq/8&9M)xU[~#t5_DXFq,:#5tvV]<H|_>sR|m?##r+eeBtYP$mB\"u(1$Zqw}!5_=Q)X~F;HH!0=92X.vU^g90DNi~8N9X#vUn)k0:_6S]{,:h)kv:.GH^%z2e{qzrstvxG1fYPxsk8tzN$8X%(v`_=D~Ccn;fS!0I}|`*+U^Px:_!iA8&9xfLv<7k05_SHK\",:Y)q+H.\"Hd%}q^o@?rs1JmG4tYPxsy8!91$e{k}4Xn=D~ccH_NiMIk}OX_=S^ccK;TKQ8L?gDQvC.:,:_+U2\",:$)vU=7(Hc%8czoez##bA(fQ0YP$mh\"59b$Zqj?6n@=zfoI@%.S!0592Xw+S^DI:_fKA8Z9zsq+mGc90DPcN{,:$);v>G\"Hc%XEIo,:a`bAkf/H|_Zmy8:(}ntvxGQ0g1hmpo@?SD1JmG#fg1Zm/8!9|$iqA94X_=GeF95_HHMIk}KXxUJ^ccCDrc.Qk}3L%UJ^Mc^%<`Fqj?*b}=S.2<0D(2poFdh)8r)ezx|_hmK\"rz,n/vS.tQla(288>?de2J`@nf}%%q88tzkspAT@\"Q9;&`qqGz~n\"=$75bv;PclNk}%BCAJ^wcr[k2y8Z9/n2J=7c90D[XrF,:Z).v(f\"Ho%z2SqrzLX1JmG1fg1xs8XezD$lq$9[`}=D~oI9;liMIk}kbEAU^cc+u,S88qz@nhW`@I,p_<`sqA91`CAA7\"0m%|i.Qk}fL2JU^Mc^%8UQ8WzgDvUu.B~:_*qv{/:M)q+:.\"H3_z2Q8=9D$lq|9\"b\"=D~F9K%>U!0k}m5f=U^ccpD*qk8Z9o`9Ueec9:_.S8X,:Z)2JmGGHo%GS/8!9LXtv(f0?g1xs~8Y}b$sq$9}b_=A7\"0ruiH.Qk}enWaU^Mco%xUQ8WzGL2J<7~f0D;Xe{,:w)}=#~\"H$_XE]{.z)5tv(f^,g1$m(Gm?5$ZqA9N5hWQ@f0@%QXUKqz*bZnT@sIK%<`iq^?W;CAGe{,C_\"2exVd>fl+g7|tF;ZJUK=9@n2o`@}Qm%;jwqA9KXw+a~CcpD6S*{Y}D5>=|kicr[3Ka||9o`,+>GD90Dtc38Vdg)*+*fdx^%z2OK597LbAH.}Q!r$m]{g}ue;vS.g9C_Y4WoezF#pAQ@jb>%<`!\"k}6n_=D~Fcd%,`NqGzj5*+U^Ccj%CE_G,:O)9UV](H|_SHN{=9$a1JH.cbYPZmqqm?1$iq%(KXMAGe8Qru#XlNk}\"bWaJ^wcK;6S?8Ez/n/v*f>Q:_;XZq,:Y)e+8GGH$_DXy8tz)5tvo)^,g1$m{F59;$iq^?3L>=D~Cc};?qZxk}v`@=2.HtYPhml{=9?bhWT@Lt];4H3|A9X#.vu.$>:_;Xv{ez0bbAee=,YPhm]{@?rBpAT@4~}%;jNqw}tB>=*fk00D#Xq{FdM)*+<7x7t[ZJ88x?:ekvQ)T0n%jEJ7qzx;>=D~Gfv;#Xexk}`LXvC.k0:_!iSq,:O)/v[~/H$_DXs{<9}nr+<7u?YP>s%Fqz#$sqBz!5\"=zf8Qn%|X.Qk}tBOJU^icd%?qexk}.nXv[~k0:_6Se{/:O)OJ>G<Hd%DXK\"ez}nr+)eH~YPZm:oez#$NqBzYX`+U^McpD4H.8&9zs]Un)B~0DeSk8/:w)Xv:.$>:_WU:o=9]`tvH.{x9;dqn\"rz+BC8T@lIK%Ni*{k}6nBJ|kCcK;UEv{Fdw)\"=sG/t0DHH]{Fdh)`+F]9xH_DX~8x?xBr+;~2~laZmhKqzye.vS.fflahmy8!99e.vzfqIn%QXn\"ezcXhW`@/0F;,`Sq%(1`MAD~oIK%HH!0k}4#kvU^icd%CE/8&9GLD+u.c90DWcL|,:Y)MAU^FcH_9q38Z9o`MARGB~:_HH=o,:Z)MA2.GHc%)Kv{59LXtv<74~YPZmoo591$qq$92#n=Ge5bt[+UOBk}As]UU^8KpDrc38_(8B,+*f#t0D[X>G,:O)D+eeGHH_z2Sq59$ar+#~Rtg1Zm8Xqz|$Sq|9rBf=K]X~9;\"2Q8O}GL8r(fAH|_DXq{]?}n1Jo)sbg1hm8Xqz|$sqw}P;f=A7Gfp_[XMIk}0BOJJ^wc$_4H?8L?zsYvJ^>K3_NX/8EzGL6U.e$>:_rcD{/:M)LvH.z,YPhm&F=9wX/&T@9,9;1jlq^?kbD+a~{,t[fS*{k}\"be+I7xxK%fSE7k}K#OJ5kMc5DfSk|k}`LMA5kgcH_NX;|Bz/n,+!k>Kc%6KX|A9Z)QvmG/tm%SH)oFdH#bA.e%xH_>sk85915tvn);f!r>sc7qzdeCAT@I,m%%qsqw}m5pAH.xxC_<`y8I}#5CAK]X~p_(q38O}GL%UsG\"H|_DX!\"@?}ntv(fJbg1hm(Grz5$lq%(.nn=%.8Q];+U}Kk}?bYvU^g9:_pK!0@?GLYvJ^%x:_k2A8N9w)*+kf~f0Dtc:o,:>fl+;~(H5D$mK\",:)LbARG/HCDZmv{/:N51Ju.<H$_#ik8u(SDbAkfI,g1>s=om?[$Zqw}@n>=D~ic|_5i!059o`.vJ^wcm;(2OBk}b`XvJ^mt:_rc.8&9w)QvU^3f:_*2?8&9>f}==7~f0D6S/8/:>f;v.eAH5D$m*F>?}nXvzfyQYPxUUK>?|$3|k}_Bf=S.X~TDliexI}fLCAD~wc$_fK!0rzX#`+S^@00DTKQ8N9g)XvmG#t0D*q)o,:w)*+[~/H$_8cIo@?##r+o)K~g1$mL|=9kLbA=7/H3_z26{=9N$Nq+z.n\"=S^icH_#Xk8&9gDOJmG#t:_Pcg7,:w)*+ee(H$_)Ks{59##tvmGf0g1>s\"G=9[$Zqj?cX_=D~icc%tc!0598BBJU^Mcd%JEA8/?zsn=>G>Q0DCE]{/:xf;v[~~H5DZmiq59}n_=Ge8Q}%xU$Qk}]nf=J^mt0DbjZqGztBCAD~gc>;2H*{>?D5XvU^Mco%UE;|^?{bLvJ^8K>;HER|BzgD%UsG#t}%}qa|Fd}br+<7/H3_z2sqez0ekvGeI,s;;jlq|9W;}=D~xxs;HH*{k}YXWaJ^ico%xU;|A9{bl+<7#t:_NiM7Fdw)l+(f/HH_}qv{>?YD1J:.Htg1Zm6{FdM)l+M]x7YPhmv{s?fnpAT@2~!D[jNq%(6n\"=J^icj%HE;|A9D5kvmG$>0Dzqq{VdM)D+<7nfg1hmc7u(9ekvQ)EIruDjlqj?L5_=D~F9}%Wc*{k}pLe+U^ic$_li;|$9o`>=C.k0:_+UQ8Vdg)_=v)~Hd%$J`{=9}ntv<7?Qg1Zm||>?5$qqBzTLn=%.{,ru<`Fq$9}b}=zfGf@%jEWo>?2#CAK]{,n%NiA8O}8Bq+v)\"H|_}q6{m?}n1J;~jIg1hmN{:(1$SqA9dbf=Ge\"0n%tcexI}?b_=U^Px:_8U~8&9w)}=U^z,:_HEA8Z9gD\"=ee`I0D;X]{/:Z)\"=*f<Hc%DX38_(8B6Uo)#tC_SH]{/:Y)Lv:.\"Hd%z2)o>?rsbA(fK~g1xs6{g}|$y8k},s}=D~FcK;iHlNk}r;6UU^Zc|_rc!0=9X#,+S^DI0D.S!0ezo`XvJ^Rt0Dk2?8O}D5.vo)~H3_z2~8x?|$lqw}55f=D~F9>%tc!0k}%B_=U^cc3_CHA8EzgDe+#~#tp_z22\",:)LbA.eAHCDhmxFqz$a;vS.K~g1[X&{@?D$sq%(#5\"=$78Q>%)SlNk}j5`+S^Zco%3K38Ez8B*+C.#t5_GS%F,:g)LvF]<H^%8cN{rzcEr+kf^,g19q88!9;$M7k}Is>=D~Zcm;6S.Qk}i#l+S^gc|_\"2Q8_(/nYvu.#tC_DXq{/:$Dr+)ekH|_xs`{x?##1JsGuQYP>se{!9;$8X^?@n>=D~cc};fK!0>?8Bw+U^_Q:_CE?8Z98B,+0.:,0D6K8X,:$)w+xG#tp_z2xF,:]nr+0./H5D$m38s?##r+RGT0YP>sB\"m?#$8X+z>;CAD~ccn;pK!0@?{b/vJ^sb0DfK/8Z9D5w+sG:,:_(2X|,:$)`+mG#tp_XE>G,:]nr+>G~H|_$mq{x?}nQvK]tQg1Nin\"qzD$3|k}L5}=$7Mcj%3Kd7qzgDD+S^.00DxU~8O}D58r>G(H3_8cm\">?;$lqA9N`\"=D~X~}%5i!0k}:Bw+S^cc};*qQ8&9/nQv;~#t0D5iO\",:w).v[~GH$_}qiq=9SD1Jo)Q0YP$m}Grz|$Nqj?4Xi+U^Ccj%fK;|,:O)EA(f<H|_GSe{<9}nbAsGnfYPZm.|Y}b$Nq^?3L,+S^Cco%xU(G,:M)f=,7I,g1hmzoezN$lq$9(bCAD~8QrueSMIk}&sl+S^Fc|_+U38/?gDvUJ^Mc+uPc38Ez{bn=#~B~0D(2L|,:M)f=;~>?YPhmzou(/s/&T@f02D;jNq^?gX8r5kcc};rc||w}zs9UsGIx3_8c\"G59uekvA7jIv;&`lqGzQL_=K]{,2D|Xy8N9zskvC.$>:_CEy8x?]`bA)e>?v;qEn\"u(+B`+a~5bp_!iZxk}%B/v:.g::_PcX|w}8Bf=>GD9:_?qR|w}2X@=RG%xo%GS`{:(,nbARG+?laxsFq=99e.vzfmtm%QXn\"u(gXhWT@Cbm%2H.Qk}MXWaU^ic>;4HQ8Wz8B8rkfk0:_fK2\",:g)`+8GGH|_$JB\">?cE1J:.#fYPZmFq=9#$M7k}#5}=$75bK%tc!0I}\"s]UU^ccK;xU.8&9>fi+C.:,:_pKrF,:tBbA;~AHc%SHK\"m?}nbAxGtQYPhmSqqz%B^XT@H~!DDjNq%(\"sCA5kMc@;|XQ|A9X#EAC.R$1J:.g9s;qEn\">?1`q+a~{,C_|iZxk}3L\"=;~g:0DUEO\"FdM)i+u.Z9!rhmwq>?zbhWT@Z9>%tc!0k}(bq+S^Ccd%!iqq,:w)>=>GAH3_#iu8<91$NqGz4#n=S^CcCD.Sy8/:O)9UJ^Ccd%tcqq,:w)>=o)kH3_#i]{tz;$Zqj?KXf=A7X~5_Wc!0ezo`XvJ^wcCDeS/8N9h)}=RG~f:_*ql{/:>fWao)\"HH_#izo@?}n4vQ)O~g1$ma|,:fL1Jn)(Hc%}qR|59SD.v$7G0g1xsq{Y}[$7ok}:B>=D~8Kd%,`&Fk}>;f=A78KpDiFQxM7M~W@P\"yf9;o+?F80MOdQnkm>C8;km>ArnBbojrhXUJDf,pb@?pII0s*sPaI~^daWRG|B|_NX<\"=:LVQ&r~R$(^K]8Qs;*qA8O}D5l+mG\"H|_#i/8x?}nbAF]jbYPZmFq@?b$lq+zuBTJT@EbK%,`sq|9v`f=Ge5b@%8U.Qk}:B\"=S^>Km;JEQ87zGLD+.ec90DeSlq,:Y).v>GB~0DUE]{/:Z)>=<7@H+u#i/8_({b}=A78Q!D6SMIk}D`9UJ^wcCDNXA8/?2X;v=7~f0DHE.87zzs`+sG:,:_pKoo,:Z)`+2.(H5Dhm}Grz}n.vjG@0g1NiUKu(|$y8I}3L>=D~5b>%iH!0k}P;CAJ^Fcc%!i/8Z98B&U.e:,0DpKs{,:h)w+mGAH^%SH>Gm?)5bAxGf0g19q88@?5$e{k}db@=D~ZcpDNi!0rzo`n=S^cc5D.S38&98B>=[~`I:_fKiq,:Y)f=H.B~:_HHv{/:h)6Uu.@H$_GSc7ezSDr+.e9,YP>sx&@?;$Fq+zTL_=D~Cco%;X!0I}IbBJJ^cc};2HMIk}ksMAJ^Mcj%+c38/?X#vU[~~f:_;XIo,:Z)6UeeGH|_8cy8u(}n1Jn)ffg1Zm{Frz;$qq^?55f=GeX~TD(2lNk}a`/vU^Mc|_5iA8Z9GLEA*f>Q0DHH^o,:$)`+<7#tC_}qA8/:]nbA;~@H|_GSe{=9}n1J=7kHH_8cm\"rz$atvsGK~YP$mg7@?;$qq%(4#f=A7\"0>%TKMIk}4Xf=S^Mc};k2.8/?{bCAJ^gcn;k2?8WzgD}=u.#tC_#iiq,:}bbAmGAH$_hm{Fez}nWaS.cbYP5in\">?;$3|k}1`n=K]X~t[\"2A8&9gD/vxG#t0D*2k8N9GLLv=7k0!rDjlq^?N`l+a~X~}%(2*{k}_BEA5kico%SE||$9/n6U.eD9:_CHE7k}b`,+!kFc3_6Ka|+zo`l+sG3~:_6Kl{Vd>f8r[~%x+uz2m\"rz0bbARG@0laZmIo@??eLvzfFb>%02A|ez<spAQ@9,K%,`8XBzS#n=D~F92DxU!0k}D`}=S^cco%k2?8N98B/v;~c90D\"238/:g)MAo)~H3_z2v{tz5$Nq+z|`8rU^icCDTKA8&9gDf=(f#t0D\"238/:w)EA8G~HH_#i#\"59$ar+v)Z9g1$mk8s?1$iqGzIbhWQ@H~2D=`Zq+z,s}=K]oIF;3Kexk}(b@=ee$>0DliOKu(}nr+ee8?g1hmrF59;$lqj?/s_=D~5bC_A`sqw}QL_=$78Q}%|i.Qk}ks_=GeGfn%CHOBk}fLMAU^>K5DWcexI}Ibn=S^2~0D[XA8&9$)9UsGk0}%SH2\",:fL1JF]kH^%z2*FezkLr+>G$~g19qJ7m?N$!\"k}4X}=D~Zc3_*2!0qz/n}=J^Cco%(2y8/:M)q+C.8?g1hm6{59;$lq|9F#n=D~8Q>%pK!0k}oLCAS^gcK;3Kk87zgDe+0.#t>%z2Q8&9g)q+,7k0p_GS7o,:9br+o)GHj%#i38@?cEbAV]mtg1HHvq59}nXvzfV~YPxUWou($aLv$7,,g1Zm}GY}5$qq%(P;}=S.oI9;2HexI}v`2JJ^mt0DeS.8&9w)kv=7:,0D(q~8Wz{bkv<7#t5_GS*F,:}b1Ju.#tm%DXK\",:rBbA[~kHj%)Ka|qzcEr+:.lIg1HH88.zD$lqk}F#f=A7Fcm;+cMIm?X#w+S^Zco%fK.8Ez{b\"=J^z,0DUEQ8&9Z)%Uo)k0C_)Kq{/:H#tv<7AH|_)KOK@?$ar+mG2~g1Zm(G@?;$Sqw}t;\"=GeGf];&`FqA9fLhWT@f0!DNiexk}TL/v*f#t:_.Sg7,:O)Qv>GAH|_8ch\">?$ar+F]Utg1ZmQ8<91$Sq|93LMAS.5bx;HHexI}en8rU^mt:_\"238&9w)w+H.`I:_SE:o,:g)@=#~\"Hc%)Ku8u(LXr+:._Qg1>UA|rz1$doFdh)w+<7\"Hd%}qy8<9,n/vD~>Q0DNXs{Fd)L1Jee<H5DZmiqrzq#tv<79,YP$m3|59CX1JH.tQYPxsIoez{e,+`@DI];dqsq^?fLhWT@f0v;WUZxk}W;9UC.#t:_CHQ|FdO)BJ[~<H|_8cq{!9,ntv<7I,g1hm3|@?:e/vK]2tx;1XA|Y}oLZnT@DI!D1jqqGzTLCA$7\"0!DqEA|qz4X\"=K]oIt[rc.|A9/n\"=(f$>0DTKlq=9,n1J:.9,g1hm/859{ekvGesbt[qEWo@?H#@=D~xxx;PcZxk}0B_=RG#t0D5i^oFdO)`+V]~H|_SHK\"@?,n1Jo)^,g1Zmc7m?}e.vQ)qbF;7SWou(0BhW`@>?!D&`lq+zfLf=$7X~];6Kd7k}QL\"=S^gc@;\"2OBk}7nMAU^8Km;=`Nq^?C#_=J^Cc^%HE)o,:M)Yvn)u?g1hm!\"=9[$lq$9)L_=D~X~t[|X.Qk}a`e+S^wcH_I238EzgDe+.e#tp_GSqq,:}bbA.e#t@%z2:o,:Y)Qv[~<Hd%}q?8u(kLtv.e7,YPxs?8/:xfw+8G~H|_Zm/8u(SDbA:.t?YP$m{F@?D$wqA9P;\"=zf\"0ruWc!0Y}8B@=U^g9:_li/8L?zs`+2.~f0DeS38&9O)_=o)#t}%$JA8&9$)kv<7k05_SHK\",:M)Lv=7kQYPhmFqqzPB/&T@bI@%[jlq$96Lw+a~{,K%2HT\"k}dbl+5k>K$_+c.|A9M)\"=<7/tn%SH^oFd~n1JH.*xH_$m}GrzYD.vD~8?!rZmq{m?deQvQ)NI}%RH88s?PBTJ`@jIru,`ZqBzU#@=D~ic};5i.Qk}(bEAU^wcc%(q~8Ez8BvU.e#t5_8czo,:$DtvH.\"H5D>sl{]?##bAsG}QYP>sy8tz5$8XA9Ib\"=D~ccCDTK!0>?8BLvJ^_Q0D6Kk8/?zs;vo)B~0DfKzo,:xfD+;~\"H|_Zmv{u(}nQvQ)EIg1Wc88g}1$qqBzrB\"=GeF9t[\"2}Kk}K#>=D~Ccn;|i!0=98BXvU^z,:_Pc/8/?8BD+,7B~0D[Xiq,:xfXv>G(H|_Zm{Fu(}n;vA7/0g1fK&{u([$qqj?K#_=Gexxv;4H}Kk}1`_=D~CcpDxU!0=9o``+S^DI0DTKk8&9Y)*+o)#tm%DX(G,:N51J.e<H$_$m)ou(SDYv$7yQg1#XJ7>?#$Nqj?|`>=J^Ccc%[XIo,:O),+M]/H|_z2=oez}n1Jn)kQYPZmv{<95$lqA9?bCAD~{,s;NXMIk}fLCAS^Fc5Dk2y8Z9gDf=,7`I0DWU~8/:M)l+(fsIYPhm.8u(!5/&T@Ltt[Djlq^?cX,+a~{,}%5iT\"k}#5EA|kCcd%k2y8VdM)Xv>Gu?!rhms{!9|5pAT@[Is;<`lq$9(bCAD~8QrueSMIk}&sl+S^Fc|_+U38/?gDvUJ^Mc+uPc38Ez{bn=#~B~0D(2L|,:M)f=;~>?YPhmzou(/s/&T@f02D;jNq^?gX8r5kcc};rc||w}zs9UsGIx3_8c\"G59uekvA7jIv;&`lqGzQL_=K]{,2D|Xy8N9zskvC.$>:_CEy8x?]`bA)e>?v;qEn\"u(+B`+a~5bp_!iZxk}%B/v:.g::_PcX|w}8Bf=>GD9:_?qR|w}2X@=RG%xo%GS`{:(,nbARG+?laxsFq=99e.vzfmtm%QXn\"u(gXhWT@Cbm%2H.Qk}MXWaU^ic>;4HQ8Wz8B8rkfk0:_fK2\",:g)`+8GGH|_$JB\">?cE1J:.#fYPZmFq=9#$M7k}#5}=$75bK%tc!0I}\"s]UU^ccK;xU.8&9>fi+C.:,:_pKrF,:tBbA;~AHc%SHK\"m?SDr+H./0YPhmooY}}b2o`@DIC_DjlqBzN`e+}f\"0!D*2T\"k}IbBJ|kic|_5i;|w}gD}==7Ix|_}qrFm?Q`1Jee/0ruQXJ7=9t;hWT@zxrutc!0I}tB*+U^ccc%SE/8&9>fLvxG:,:_!izo,:Isr+RG/Hc%SH:oqzcEtvF]~0YPZm/8>?b$lqk}D`\"=Gexxp_PcMI@?GLEAU^Zc^%xU.8N9O)MA:.B~0Dzqq{,:zbbAsG\"H|_Zm\"G@?kLQvQ)f0g1fKn\"@?b$sq+zzb}=K]GfF;fK.8L?{b6Uo)#t0Dk2.8/:$)WamGkHH_$J%F,:Y)XvC./H|_XEX|u(rs1J>G0?YPZmOKez[$e{k}@nMA$7\"0];!i!0k}TLEAU^Cc};Pcwq,:O)XvV]<H3_GSQ8.z#$qq$9i#_=D~xxTDI2!0k}@nD+U^CcCD4H(G,:w)kvo)GH3_SHq{rz#$qqw}c#hWT@cbn%2Hexk}0B_=0.$>:_*2?8&9zs\"=kf$>0D#X`{:($atvn)3fYPhml{x?P;2oT@*,x;bjNq^?1`Wa|kccCD8U.|w}X#`+(f%x^%DX_G=9]`bA:.IxK%`nOBreY~eam\"fQp#qxl\"1}IeK>=:~$ex=::c]@iFA8.(+o[.8G4b:@P\"S{09^Ux}Of#IYvn)xxK%%qu8I}MXNn;k^C8buBexK~M)i+mGt?YPhmu8rzr;OJ|kicd%fKQ|w}o`2JmG,,!rZmM7m?:ekvK]%x}%9qOBk}&sXv|kCc|_?q:o,:]nr+>GdxH_}qNqrz}nLvS.u?!r>sU\"rzN$FqGz|5l+X.|tn%4H}Kk}VX@=5kz,0DNi/87z{b4v*fg:}%#i!\"FdM)Qvo)_Q!r>s}G=9ye/vzf?Q@%%qqqA9ksTJT@2t}%=`e{I}dekv$7x7];A`lqj?H#}=K]Gfru.Sy8Z9o`_=,7#t0DWc9F,:g)9UsG#t@%}qv{,:As1JsG@H>;Zmm\"=9}n,+`@^,g1zq&{m?}n@=T@?QYPhm9F>?FX2oT@&,n%;jlqj?55i+!G5b!DCHT\"k}7ni+!kZc>;HE;|^?8BkvmG/t@%DX}GFdxf&UeeIx$_hm_Gm?,n;vQ)jb!r2Hvqqz}ekvGez,!DA`lqj?Is@=K]{,!Dzqk8&9D5OJC.#t:_eSKK,:Y)*+0.kH^%8cN{ez}nXvzf_Qg1$mZq=9N$lqk}6nf=D~ccH_)SMI592X,+S^Ccn;fSy8/:M)\"=<7Tfg1hmIoqz;$lq$9U#}=A7xx9;A`lq%(`L\"=D~Gfv;4H!0k}FXw+U^icj%pK/8&9gD8rRGc90DI2X|,:O)>=v)V~KD2jsqw}Is`+a~Gf2D.S$Qk}.L9U|kFc>;+c.|+z/n6U.ezI0D+UL|Fdg)6UxG{x$_#i=o59CXtv.e3fla>s;|rzye,+`@BtC_%qlqj?*bhW`@nf5_MJ88x?GnpAQ@w9C_viA|=9r;pA>GX~K%,`e{k}}b}=jG5bru)Sd7k},sLvU^8Kj%SE?87z2Xe+<7#t}%$JQ8/:}btvF]\"H$_$J&FrzSDr+ee?QYP>soo@?N$iq%($Dn=D~Cc};\"2exI}:Bn=J^Fcm;.Sk8Z9o`_=RG~f:_SE/8Wz/ni+=7#t5_XE9F,:xfMARGkH$_GS2\"=9$abA8GtQYP>soo>?)5r+M]=,g1JEWorz#$Zq+zenCAjGGf2D(qd7k}K#MAzf\"0p_tc}Kk}|`\"=S^g9:_tc38&9w)BJ;~c9:_6K\"G,:w)n=sGB~0DfS_G,:h)&U*f/H|_hmm\"ezcEr+[~Xtg1ZmU\">?$a1JC.(Ho%z2Sq=9)51JsG~0g1xss{Xz;$ZqGza`n=A7X~TDtcMIk}?bCAU^wcH_|XQ8/?D5.v:.>Q!r>sl{qz9e;vS.h~K%MJ88tz7npAQ@:xC_vi&{]?)LpA>G8QC_%qsqA9dbZnT@jI2DA`sq$9)n>=GeF99;*q.Qk}.n>=U^>K5DNi?8Wz8B>=*f`I:_UE`{,:Y)`+v)GHc%}q*F=9kLbA8GsIg1;X&{59[$y8k}*b}=jGGfs;;X.Qk}3L@=S^8Kn;pKy8EzGL&U:.#t}%#iR|,:}b1J.eAH$_)KR|@?SDtv(f30g1>s}GezkLr+,7ibg19qA|,:a`1JH.<HH_DXdoqz}nr+2.mtYPZm6{@?|$lqBz)nCAjG\"05_rc!0k},sCA:MZ9$1hmm\"59N$lq|9OX}=D~\"0C_|i!0k}fLn=U^Fc3_NX/8N98B/vee$>0DNX%F@?]`tv[~sIv;dqWom?#5/&T@Z99;[jsqA9gXe+a~8Qs;9qZxk}|`QvxGR$1J:.5I!Ddq88g}r;/&T@.0K%[jsqGzPB`+I7F95_fST\"k}3L>=5kcc5DfK$Qk}6nvU|kMcH_k2X|GzgD@=5kgc>;iHZxk}l5;v5kCc^%iHQ8VdO)`+(f%x|_}qB\"FdO)8r8G9x|_#i.|=9YDtv:.\"QlaZmOKqz{e4v$7Lt}%02J7u(]npAF]8Qt[&`8X+zMXn=$7\"0C_liMIk}P;,+S^gc@;[X~8L?zs/vu.Nb0D+UL|,:>f%UH.<H^%$Jzoqz##1JF]9,g1JEn\"ezD$Zq%(x;pAee\"0>%,`M7k}+;@=jGX~2D=`Sq$9Asn=zfF9K%!iexI}D`MAD~Mcd%>U!059gD*+S^ccpD\"2Q8&98Bkvo)c9:_(qv{/:Y)}=,7AH^%}ql{u()5r+0.30la$m?8qz$a1J=7tQlaJEWom?#$Sq|9x;q+a~wcK;iHOB,:g)}=sGzx|_SH.Qk}!5%U5kic^%0288<9As2oT@[I@%=`lq+z@nl+i]{,2DxU?8Z9{bEAC./t:_>Uh\",:g)f==7/t0D)S7o,:M)w+mG(Q!rhm3|qz9b/&T@9xru<`Nqj?)L%U|kcc};+c.8O}zsYvmGzx3_#i6{g}[$Nq|91``+5kic};rcy8O}X#q+u.*xH_DX]{!9]`tv*f*xH_z2e{<9}nr+>GfflaZmq{s?b$sq+zC#`+]e8Q9;6S.Qk}kbi+!kicCDpK?8O}2Xl+.ePxH_SHO\"m?}nr+kf<0laZm*Fm?$ar+#~*,la>s_G595$iqj?t;,+a~ic+u?q!0=9GL`+a~Fcr[+cMIY}2X`+!kic|_)S.8&9Y)&U=7:,0D\"2!\",:fL1JC.#t}%}q38/:\"sbAo)~H5D$mk8rz}n4vjGt?g1|iA|59D$>Gk}7n_=Ge>Ko%CH.Q>?o`Xv&Sk0WmdqMIK~CXr+8G%x$_$J`{!90bkvjGaflaZme{x?YDEAD~Nb:_Wc)oFdg)w+V]kH5D>s#\"u(,n/vGe&,YPCH*{qz,nr+F]_QYPhms{Y}zbpAT@rx5_[jNqBza`;vJ^cc3_xUX|A9GLxU<7c9:_#XwqFdw)]U.e<Ho%8c;|j?D59UxG#tp_DXN{Vd>f`+xG\"Hd%SHa|>?YD1JV]I,g1xs]{]?ye4v$7Fbs;dqqqGz*spA;~xx2DqEvq@??b_=K]{,5_8Ua|A9{bYv.e#t:_;X*FFdO)8r*fkH|_SH/8tzYDtv[~$~YPZm9FY}?eXvjG_Q!D7S88<9oLpA;~xx];bjSq^?Gn_=$7xx}%iH!0k}F#CAJ^wcd%iH.Qk}2#QvJ^*xm;qE88:(3L,+i]8Qm%9q3|A9zsf=,7/t0DfS#\"Fdw)@=F]IxH_z2qqezq#tv.eUt!r$m%F59:eWaD~DI}%@Kn\">?i#pA>GF9}%,`dok}b`>=A7{,}%CHMIk}Ibn=Ge\"0>%<`iq^?,sf=S.5b9;eSexI})LkvJ^FcH_[Xy8Z9/nYv(fB~0D6K~|,:Z)`+:.GH+u$J!\"m?LXr+#~*,YP$mKK@?b$SqGz{B_=Q)X~p_=`8XA9i#MAD~FcpD4H!0>?D5l+S^Fc|_xU38Z9o`f=eeB~0D>U]{/:Z)CAkf(Hc%)Kq{,:xfLvo)(Hd%XEKKqz##tvsGu?YPxsQ|59N$Zq%(N5>=D~ccj%|i!0>?{bOJU^cc+u+U/8N92X`+.e:,0D6S;|,:h)w+0.<Hc%8cL|,:>f6U.e$>0D)Sl{x?]`bAsGBtg1hm]{s?5$lqw}QLMAD~X~n%eS!0k}4#l+S^ccd%?qk8N9D56UH.c90D?qk8/:g),+C.GH$_#i%Frzrstv*fXt!rhmKKrz[5l+a~|tF;NXexk}#5MA;~g:0D|ia|,:M)OJF]nflaZmD{.zN$Nqw}&s6UsG/t0DxU%F,:M)*+v)w95_QXvqezksC8T@/05_fK.Qk}v`i+!kCcpDNi38tz]`tvC.afrujE88>?As@=|kic>;zq~8O}o`l+[~Fb!rZm:oez5$NqA96LD+!k@0:_8UR|%(8Be+2.zIC_z2g7FdN5tv>G*x^%xsk8tz,nXv%.qblaHH88s??e`+Q@sb}%QXlqA9:eq+T@af}%QXNqGz}eQvT@nf9;qE&{<9&s}=Ge>K+uNi*{m?2XCAU^4t0D+cQ|$9>f>=<7#tm%z2doFdrB1J:.k0n%DXIoFd8;bA#~AHCD>s:o>?7LWa$7Sb!rhms{qz@nZneeoITD<`y8k}U#MAjGgc+uHHMIqzX#`+S^jI:_NX/8&9w)/vo)#tp_z26{/:Is1J=7kH5D>s2\"59##QvD~|fYPUE88qzN$Zq%(+B}=D~oIm%!i!0>?zsw+U^FcH_6Sk8&9xf}=J^Px0DfS/8O}GL8rn)$>0DPcQ|m?}n1Jo)x7g1hm8Xezb$sqA9[5}=A75bK%HH!0k}zb}=S^icm;3K/8N98B&UmGc90DSE8X,:g)>==7<H^%DX/8O}zse+8GkH3_)K]{Y}[$lq^?pL\"=D~8Qp_?qMIk}b`@=A7Gf>%HH}Kk}N5/vU^>Kc%|i/8&9g)f=[~#tm%$JL|,:9bbA[~/HCD$mpo@?SDbAv)T0YP$mv{rzD$wqBzj5}=Q)5bp_TK!0=9zs}=D~Fc};.S!0k}dbn=S^icH_HH38N9o`}=kfk0:_zq.|,:Y)*+kf~H$_z2OK59]`bA[~x7];qEvqY}j5e+a~xxx;+U*{k}~ni+a~{,m%5i*{k}K#D+g7xx2D|XE7k}W;4v|kgc|_9qR|Gzo`e+*f^b:_xU.8Vda`r+:.Ixd%z2xFqz15bA;~s`0DTKdoFda`r+xG{x5DZm`{59,nLvQ)/0lahmu8Xzde/v$79,C_%q88qzQLpAT@:x@%A`sqA9gXMAA7X~>%!iMIk}OXXvU^Fc@;6Kd7k}fL/vU^gcc%(2.8Z9/nvUo)#t5_DXqqFdM)i+xGLtYP$m#\"Y}deQvjGUtt[?2A|Y}l5Zn`@%x@%;j8X$9<shWT@}QF;tcZxk}4#}=U^ic5D!i||A9{bn=J^icj%6S3|A92XLv[~#t0DtcIoFdO)8rn)/H$_SHQ8u(YDr+2.Z9g1$mA8>?0eLvS.0?t[dqWorz:BpAT@}Qn%;jsq%(0eQvD~(QYP$m`{<9{e;vS.zx];dqJ7m?ZDpAT@nfp_DjsqGz.LZnT@0?];[jSqw}.nf=jGoITDeSE7k}9bEAS^Fc@;I2;|+z{bOJ(f~f0DUEU\"FdxfOJo)\"H5Dhm~|m?0br+n)sbYPZmQ8<9}eLvK]7,!DUH88<9,sTJ`@sIv;bjZq+z_B_=D~icm;|X*{59GL4vU^Rt0DTKT\"@?8BEAS^Rt:_rc$Q>?o`Xv5kFcd%NiT\"ezD5,+!kTf:_>UX|+zZ)\"=kfzIm%)Ky8VdK#bA.eIx^%)Kl{qzq#bA[~/0la;Xn\"Y}?e4vD~x7n%%q8XBz{eXvQ)nfm%%qwqw}F#2oT@^,!D&`Iok}ZDD+a~Zcd%\"2.Q@?o`8r!k:x0D+U38/?{bf=*f3~:_8Us{,:$)Qvo)dx5DZme{<9}nkvK]f0!rUEWo=9rsr+,7AH+uSH_G=9}nLvGe4~g1fK&{ez$a>=A7IxH_XEs{ez0b1JxGbI!r$mlqm?deLvjGSb5_02n\"m?xBbAo)^,!rhms{>?pLpAT@H~];<`NqBz$DLvU^ic3_iH.8&9GL%Uu.k00DHH?8/:g)*+v)AH^%$JA8/:>fMAeeGH|_hmFq@?}n.v$7O~g1HH&{.z1$Sq+zv`}=Ge8Qru\"2!0I}S#EAS^mt:_+Uk8&9Y)q+(f#tm%8cB\",:w)>=xG/H$_}q`{tz##1JsG4~YP>szou(|$wqA9D`\"=zfF9];2Hd7k}0Be+U^wc3_6K387zzsBJxG#tp_XEq{/:]nbAV]~H5D$me{<9}nr+kf_QYPZm2\">?1$qqBz4XpA`@<0@%,`iqGzC#_=S.{,2D.S}Kk};`}=J^8Kn;Wc387zD5EA[~Nb:_(q38/:S#1J;~/H5Dxs}G,:O)Qv(f~H|_8cX|m?$a1JxGCbg1Zm/8:(;$Sq|9W;n=GeF9x;3Kd7k}a`EAU^Fc@;NXlNk}F#*+S^ZcCDCE38Ezzs}=D~icpD6S!0k}[5@=S^icd%?qy8N9/n/v.ek0:_6Slq,:Y)2J.e~Hd%DXN{ez]`bAxGx7x;qEUK596Ll+a~xxs;+U*{k}2#]U|kicn;CHQ||9/nWa(fg::_HEM7FdY)%U[~%x^%DXxFrz7LbA#~+?la>s*Frzye,+T@I,K%jEA|59oL_=K]X~t[Wc?8&9o`}=8G#t0D+cqq,:O)q+eek0:_fK7o,:w)xU[~c9:_fKFq,:g)i+xG(Ho%}qx&59rsbA;~30g1xs?8tz;$Fq%(\"bMAzf|t!D<`M7k}/s>=D~>KH_.SMIY}D5WaJ^Tf:_(q.8Z9o`.v:.`I:_+c6{,:Z)CA8G<Hc%GSk8.zLXr+[~4~g1;XA|ezN$qq+zm5>=jGGfv;pK}Kk}fLn=S^8Ko%UEy8&9M)6Uu.#t}%GSR|,:h)CAxG(Hj%XE?8s?}nkv$7qIg1>U&{Xzb$.|k}#`f=A7Ccc%TKMIk}F#xUU^FcK;xUy8L?8BD+>G~f:_pKKK,:>fXvC.<H5DhmN{=9$abARG@Hd%XE(G@?)5bARG;fYPxs!\",:?e/vT@/0@%jEUKu(wX>=D~xx9;+U!0k}MX}=S^ccpDPc~8N9X#,+S^Fc5DpK.87zgDi+.eNb:_NiKK,:)LbAeeGH|_$m7o=9$a4vA7;fg1Wc&{59b$sq|9m5CAK]X~C_Nik8N9{bn=[~$>:_NXKK>?SDbA;~30YPZmh\"@?1$lqBz55MAK]\"0C_2Hd7k}OX,+U^Ccd%#XD{,:h)l+V]AH3_z2B\"qzb$SqBz~nn=K]Gf!DPc~8_(X#EA<7k00D|iqq,:S#r+>GAH$_8c{F59}nbA;~$>0DCHe{]?$atv;~FbYPhm.8>?YX^XT@K~x;Djlqw}TLl+g7{,F;8U*{k}$DYv|kZc|_!i;||9{bf=*f/tp_#i;|$9X#xUeeg::_2Hl{FdM)i+#~+?!r$mq{@?ye/vGef0>%viJ7ez~nZnT@NI2DA`SqBzS#CAD~{,C_+U!0I}*bi+U^FcpD3K?8&9g)D+U^Mc@;|Xk87z2XEA*fk00Dzqiq,:#5r+,7<Hd%)K38:($aQvS.<Hj%GSA8@?}nr+o)cbYPhm>Gezr;2oT@3fs;;jNq+zL5%U5kFcCDTK||A9o`OJmG/t0D|X*FFdM)}=2.bIlaZmR|qzue/vD~Q0la$m.8Xz0e/vS.EIC_%q88x?\"shWT@O~>%;Xd7k}TLLvU^ic5D?q.8L?X#Wa[~#t0DHED{,:M)f=)e*,YPhmhKrzt;/&T@ibTDDjNqj?W;\"=5kccm;;XX|w}8B`+v)zx3_#i*F59?ekvA7&,s;A`lqj?c#\"=K]oIt[eS~8N9gDf=C.$>0DfSSq>?$ar+u.sIYPhm2\"qzfn2oT@H~m%DjNqj?tBf=|kwc3_!ia|w}D5e+v);BjD1X4Ak}.L>=U^Ccn;8Us{,:w)kvxG<H3_z2_Gqzb$SqBz|`\"=D~\"0s;.SlNk}1`.vJ^icCDzq/8&9M)l+o)k0:_tc/8/:#51J[~GHd%DX||rz]`1J*f(H3_DX`{tz}nbAn)kH3_GSl{!9$a1J(f@H3_#isqY}#$lq+z6n}=K]{,!D6K/8Z9gDYvu.#t:_;XQ8L?o`]Uee#t0D)S/8N9zsl+sG$>:_6S~|ez)5bA[~#t:_!i}G,:>f.v.eGHH_SHM7>?cEbA<7afYPZm/8.z5$OKk}U#f=Ge|tK%WUMIm?D5@=S.GfK%fS!0>?/nBJJ^Fcr[li/8N9Z)MAJ^Zc+u4Hy8Z9xfQvu.#t5_)KA8Wzo`*+U^icK;9q?8&9w)*+>Gc9:_WUO\",:ksbAkf/H^%GSR|,:Y)2Jn)$>0DliA8tzkL1Ju.2~g1hm\"GY}[$8Xj?&s_=A78Qs;li!0k}FX}=S^Cc};fK&F,:w)i+kf<H3_8crFezb$SqA9N`MAD~\"0K%k2}Kk}GnvUU^cc$_*2k8&9g)Qv.ec9:_fS||,:9bbA;~@H$_#iNqezMe>vF]5bruA`OKk}c#OJM^ic^%3KQ8O}X#Lv[~GH$_}qu8=9]`bA#~/0F;7Svqm?*s/&T@K~];1jSqw}fL8ra~|tF;[XZxI}U#6U5kcc$_+U3|A9w)kv*fD90Drcs{Vdw)e+RG9x3_z2po59ue;vGezx}%%qJ7rz55Zn`@],n%,`sqw}8;pAQ@=,m%<`sqBz6L_=D~8K|_HHlNk}#`@=J^uQ:_fS.8EzD58rn)k00DCHN{/:M)@==7FbYP$ml{@?b$lq^?N5TJ`@ff!DA`sqA96Lf=A7>KCD\"2exI}i#_=U^O~0Dk2~8&9$)2JxG>Q}%#iX|,:N5bA8G<H|_XEc7m?]`1J;~g9];1X88Y}OXC8T@f02D;jqqw}D`w+i]5b9;.SR|A9O)n=0.D90DNXQ||9Y)8r0._f:_k2a|$9h)WaC./t5_DX>GFdZ).veePx|_)K%Fez,n.vjG=,laZmQ8Y}}e,+Q@?Qm%RH88x?pLhW`@uQ9;=`lq$9?bn=Q){,v;5iMIk}=s\"=D~ccc%k2.Qk}dbCAU^cc3_UE.8O}GLQv(f~Hd%XEU\"ez}ntvu.kHo%XEFq,:O)w+0.<HCDZmrF,:$)kv*f~HCDZmrF,:$)kv*f~H};hm`{x?$aQvK]~H3_SH]{:(5$Nq+z`LD+U^ic3_A`lq$9(bn=D~{,9;)SMIk}U#8rS^Fco%UEQ8/?8B.v(f~f0DNi/8/:xf\"=,7#tp_#ie{/:S#bAC.kHH_SH=o59SDr+n)lIg1$mM7ez;$Fq%(?bn=S.Gfx;rc!0Y}gDi+S^McCD*qA8L?GLn=8G>Q0D8Uc7,:]nr+xG<H|_ZmL|,:ksbAo)~H^%8ce{59rsbA#~sIg19qUK@?D$.|k}r;f=D~Zcm;&`g7k}W;f=$7\"0C_li.Qk}9b_=S^gc};|i/8EzX#}=C.Nb0D)S!059zs@=U^Fcj%pK.8L?{b%UC.~f:_pKoo,:a`1Ju.GH5DhmK\"m?}nLvGe:,0DfKu8/:Z)i+0.<H|_hmB\"ez}nQv%.ffg1HHJ7ez[$?8k}yeXvQ)CbK%@KJ7ez0e2JT@Ix@%%qZq+z#5ZnF]5bn%,`hKk}K#>=$7F9@%HH.Qk}PBEAS^gcn;CEQ8Ezzs\"=RG#tp_XEB\",:$DbAee@Hd%XE38@?)51Jee1fYPxslq=9|$y8k})n>=D~ccH_k2!0rzo`XvU^gcCD3K/8Ez{bBJU^/00DSE38&9Z);vJ^_Q:_tc38N9g)q+v)c90Dk20G,:g)]U(fAHj%}q\"Gm?LXr+xGsbg1JE88<9|$dok}}b@=A7xxp_=`sqj?{Bf=jGxxp_>UlNk}b``+U^wcr[Pc/87z8Bkv:.`I:_I2{F,:Z)BJxGNb0D|ilq,:}bbA;~/H|_$mKKez}nYvD~SbYP$m?8=9)51J(f_?YPxsxFez1$y8k}fn>=D~cc^%=`lqk}H#ZnT@Lt9;&`sq+zrBf=jGxx9;+clNk}9b}=%.xxm%*q}Kk}Ibf=J^gc$_|iA8Ezo`8r0.#tC_z2u8/:)LtvF](H|_xs;|m?$a;vGe$~YP>sX|j?2X_=H.>Q:_\"2ooFd}b1J.ekH|_hm;||9O)Lv<7c90DeSM7Fd)L1JsG\"H5D$mO\"m?0bYvA70?YP+c&{:(de`+Q@~09;7S&{.zU#TJT@~0v;Dj8Xw},s@=Gexx];8U*{m?/nMAS^Mco%?q.|%(o`.vo)/t0D|Xx&Fd#51JmGIx+u)KxF@?0bkvA73flaNin\"qz?e/vQ)QfruMJ88rzyeQv%.bIm%02&{m?gXpA`@NI];<`8X|9fnhWT@t?m%6S!0k}}b&UU^icCDiH.8N9{b9UmG#t0D+U6{/:Y)_=mG\"H|_)KwqezSDr+*f],g1Zmx&qz;$wqw}a`_=Ge8Qs;\"2!0Y}D5OJJ^Cco%[XK\",:O)CA=7(H|_DXa|59$atv=78?g1hm38tzN$qq$9#`CAD~Gfm%lid7k}rBe+S^Fc^%8UOBk}\"s>=GeF9p_Wc!0I}pLi+U^Cc^%+ce{,:M)n=V]h~g1hm~|rz1$lq%(@n}=D~X~p_>UMIk}0BCAJ^wc$_|XQ8_(2X,+(f#tp_DX8X,:cXr+,7GHj%#i`{s?SD/v$7<0laZm6{.z5$y8k}$D,+a~cc3_\"2!0qz/n.v5k_Q0D|X?8N9Z)EA(f/t0D5i`{/:O)Yv>G:x$_}qk8x?SDtv.e8?!r$mN{:(1$iq^?0Bw+!GX~2D;XlNk}zb@=!k8KH_pKy8&9M)w+(f/t}%XEoo,:)Lr+eeIxd%XEc7=9##1Ju.zxj%8c#\"u(cEr+)e<0la9qWoqz|$M7k}_Bw+a~X~F;9qMIk}U#e+!kFc$_WUQ8Z92Xl+<72<0DNi&F,:h)YvC.%xo%)K~|qzrsr+V]O~!r>sQ8m?|$wq^?[5q+X.{,TD6K!0=9{bvUJ^Cc};!i}G,:w)_=V]/H|_DX&F59##r+V]G0YPZmQ|u(;$Fq+z4#CAK]F9}%+cQ8O}2X}=M]/H3_z2R|ez|$lq%(rBCAD~xxx;*qMIk}|`XvJ^Fcr[HE38&9M)\"=2.#tp_#i}G,:ksbAv)\"H|_xsv{,:fLtvee~HH_SH!\",:w)@=,7~Hd%8cpoez)5tv.eGHj%DXk8x?cEbAn)SbYPZmA8x?#$qqw}wX_=jG5bn%!iOBk}v`e+U^ZcK;;X/8Ezzs}=A7GfF;zqMIk}uBvUU^wcH_HHlNk}W;vUU^Zco%CHexI}pLMAU^Fcn;HH~8/?X#vU*f~f:_zq.8/:>f]Uo)AH5DhmxFm?}n.vzf0QYP$m~8.z|$Sq%(wXMAzf|t5_xU!0Y}o`YvJ^g90D6Ky8&9h);v=7k0:_|X}G,:Y)_=.e/H^%8cQ|@?kL1J<7|fYPxspo>?|$y8k}db@=$7|tv;*qex", "Y)Lvn)B~0DeS&F,:$)OJC.@H+u}q3|,:]nr+F]~H3_#iNq@?b$NqBzFX,+S^ic};;X38&9GLi+RGk00DeSNq,:w)l+xG#t0D>U/8&9gD&U=7#t0D>U/8&9gD&U=7k0:_6Kk8N9zs9U(fc90D.Sm\",:w)]UxG(Ho%XE\"G=9SDbAF]kQg1JEn\"ezSD1JH.mtg1hm+Gu(D$NqA9D`YvU^ccK;tcy8O}{bYvC.\"Hd%$Jlq@?]`r+xG^,g1hm~|rz]`bAF]t?];dq88m?#$NqA9.L>=U^cc5DxUk8O}{b,+n)AH|_>s38m?}nr+v)[Ig1UEWoqz5$y8k}tB>=jGic+uPcMI59{bOJJ^Ccn;iHrF,:M)\"=:.g9g1hmQ|Y}5$lq$9}b>=A7xx}%pK!0k}{B6UJ^/00DI2~8&9Y)CAS^2~0DrcA8Z9w)*+;~#tn%GS?8/:VX1J[~{x3_#i8X>?;$3|k}C#i+a~icm;5i.QqzX#n=|k:x0DNiOBm?8BQv5kZ90D)SQ8&9xfvU*fzIru)Kqq,:Istv>G*xc%hmk8m?$aLvjGHtlaHH88=99e/vS.ib>%QXwq^?.nhWQ@BtF;,`k8VdcXo;T@_Qs;DjsqA9pLOJR~icm;3K*{59{bvU|k2~0D*2Q||9>f\"=o)/tn%}qxFFd551JeekH3_$J]{!9}eQv$7Bt2Ddq88qzF#pA`@x7!DDjsqA96L@=zf|t!DNXZxk}Asf==7k0:_NXe{FdM)9Un)/0YPZmK\"=9uekvD~#f];UHJ7ez[$qqw}~n@=jG{,x;;X}Kk}|5QvJ^>KpDxU?8&9O);vu.#t5_SH38/:O)Yvee(H|_z2xF=9SD1J(f^,g1Zmk8:(|$Sq%(_B@=Ge\"0K%I2d7k}&s@=U^Mc|_(2~87zgD*+C.~f:_6S.|,:]nbA=7<H5DhmK\"m?)5tvC.<H^%SHR|@?)5tvC.<H^%SHR|@?}nCAD~ic^%MJ&{:()nhW`@sIn%<`Zq^?fnMAzfxx>%;X!0592X*+S^g90D|iy8Z9/nQv.ec9:_fKA8Wz/n}=<7B~:_[XD{/:xfkv(f\"H+uSHFq@?##r+:.0?g1$my8x?1$8X$9TL_=zf5b5_k2!0@?{b;vU^DI0DHE.8/?GL&U>G`I:_(qhK,:xf*+V](H+u$Jpo59}nQv$72~g1eSJ7m?[$iqBzN`n=%.{,>%A`e{k}db_=D~icH_TK!0u(2X`+S^/00Dk2?8EzgDxUsGR$r+C.3fm%%qiq+zm5^X`@~0t[,`6{k}P;w+a~cc>;;Xexk}:B]Uo)R$tv<79,C_%qA|ez_B/&T@[I5_QXJ7qz#$lqBzN`D+]e5bs;eS.Qk})n8ra~icc%fS!0I}W;*+!k3f0DWUQ8&9g)xU5k3f0D(q38&9h)]UH./tm%#iy8/:#51JxGzxd%&`?8,:b`r+(f\"Hd%8cL|,:FXbA8G(HCDhm/8rz)5}=$7dx3_z2R|ez9ekvGeIxx;,`lq$9)n\"=D~|tK%WcMIk}*sf=J^icj%TKy87zzs_=(f~f:_Ni\"G,:$Dr+,7AH5D>sg7@?}nLvA7}QYP|ivqm?1$NqA9S#;vU^gcCDHH3|A9X#*+sGNb:_)S)oFdh)]Uo)\"H|_$m:oezCX1J=7kQYPxsh\"ezueMAT@Kts;dqsq|9$DTJmGxxru[j.|k}a`}=S.|t@%[X*{k}F#2JJ^/0:_;XL|+zD56Uee#tm%SH*{=9X#kvU^icH_CH;|A9o`MA<7k0:_2H`{Vdw)*+C.(H$_z2*Fm?YDr+u.*,Wm1XJ7=9N5pAT@0?s;ovHqA9(b_=jGF9n%I2exI}Gn4vJ^>Kd%?qk8&9Y)/vee#tC_}q38/:g)D+#~c90D3KQ|,:>f\"=v)@Hj%$Jwq@?}n.vQ)^,g19qJ7=91$Sqw}%B\"=$78QC_xUexI}S#>=S.{,5_)S!059D5pA;~2<:_pKdoFdg)}=:.{x|_hm8X@?CXbAV]ibla(2n\"ez}e,+`@JbC_MJ88@?{e.vQ)+?>%02&{m?>;pA`@Htt[<`8X$9}b}=Q)F99;+cMIk}Is.vJ^icr[pK/8/?X#8rn)`I:_JEq{/:Z)4v=7@Ho%XE`{<9SDr+sGg9g1Zme{Y}D$Fq%(;`@=%.xxF;Pc!0Y}D5XvJ^Ix^%}qrFm?q#bAu.V~laJE88Y}?eYvGe(Q5_%qSqBz+;pA>Gxxm%=`Sqj?VXMAjG\"0TDWc!0I}9bl+U^>KH_2H?8&9Y)8r[~#tC_DX/8/:h)@=C.(Hd%)K:o59}n/vjG1fg1xs(G59D$OKk}v`f=D~Mc+u,`Sqj?&shW`@@0x;A`8X|9+;n=Q)|ts;rc!0@?o`8rS^/0:_(2~8N98BMAu.k00DxU=o,:h)LvF]~Hd%#iFq,:>fMAmG~Hj%DXSq=9##1JH.3fYP$m]{u(N$ZqBz<sn=S.Gft[TK!0>?X#WaU^mt0D8Uy8L?X#\"=xG`I:_3KOK,:a`1J:.~H+u}q}G>?}nXvD~w9g1>U88<9|$!\"k}9bpAF]X~!DA`zok}W;\"=A7ic|_?qd7ezo`w+S^Bt0DxU38Z9/n`+eek00D5iA8Wz{be+<7:,0DWch\",:xf>==7<Hj%8c!\"m?##r+)e_QYP$m!\"595$8XGz!5hWQ@3f9;<`dok}OX}=D~cc5D*qMIk}W;i+U^cc3_Pc~8L?o`;v;~`I:_UE*F,:$)9U(f~Ho%$J=o59##r+v)AHd%}qL|=9LXr+,7^,YPxs6{595$dok}m5MAD~cc3_TK!0=9gDMAQ)X~TD9q!0u({b`+U^z,0DNXy8N9Y)i+:.k0ru$J]{,:M)>=>G^,YPhmx&=9fnC8T@f0s;DjlqBz8;q+i]5b@%Ni|||9zsvUmG/t:_;XO\"FdY)kvo)g::_eSu8VdZ)kvV]{x$_XE_G=9CXr+(fNI!rhmO\"=92#ZnT@DIx;=`lq^?8;CAjG\"0K%pKMIk})L}=%.oI>%;XOBk})nw+S^%x:_JE38&9Y),+.e`Ip_}q!0u(gDvUU^9x:_CH.8O}D5l+<7<H|_#ipom?]`bA.eG0];dqUKqz55/&T@mtt[;jqq+z[5,+a~Mc$_iH$Qrz{bl+5kuQ:_fSQ|%(w)Lv=7zIp_8cR|A9FX1J(fR$1J>G~02Ddqn\"ez]`tv:.jI];1XA|@?@n/&T@rxru[jqqBz_Bq+i]8QF;\"2.|$9X#MA=7/t0DiHl{VdZ)w+:.IxH_z2.|59,nkvA7h~!rhmzoez{BhWT@7,K%#Xexk}VX}=2.#t0D*q~8/:M)@=[~V~YPZmQ8@?D$lqBzS#>=S.oIs;9qd7k}D``+S^z,:_5i3|w}/nw+kf/HH_Zm_G>?0bbAeeh~YPZmA8@?:eQvQ)G0t[7S&{u(GnTJ`@PxK%;jSqGzj5MAQ)oITD4HZxk}ksf=n)#tn%XE`{,:w)e+2.k0>%)Ks{/:g)q+8GpNrtND|v:.=t;&1)<?s;_nDq5+0$ex=:~$ex{*++*uUkS{09^U\"M*fJV>W`KVKA(xo~l?y7ni+jGY~kP?`!!W0zQC8qq>Kj%k2?8_(zs,+!kPx:_TK/8N9O)i+o)/t>%z23|,:C#r+u.%x3_SH}G@?;$sqj?eni+a~|t@%NilNk}a`e+5kicm;[X/87zGLLv=7R$1JeeEIC_%qA|ezVXC8T@2t!DNXd7k}#5,+a~xx@%li.Qk}kbw+5kMcm;<`6{k}cXe+I7Cc|_(qd7@?X#OJ|kI,:_|iy8/?xf,+,7/t0DCEFq,:O)n=n)Px$_z2Zq@?SDbARG.0la$ma|ezkLr+=7NI!rhm_Grz@nC8T@f0K%*2!0k}*se+a~\"0@%iH!0k}*b%U|kic+u>U38O}X#kvxGR$r+C.;fn%jE88<9N58ri]5b];2H?8&9{b>==7/t:_)S.8VdM)MA:.0?YPhm;|qzr;hWT@Ut>%4H*{k}]n@=U^Ccm;tciqFdO)\"=8G(H|_}qh\"qz0bbAC.0?YPZmQ|qz{eLvD~HtF;ZJA|>?FXTJ`@sI}%DjNq^?U#/vJ^CcK;tc;|w}8B*+,7AH|_#i%FFdO).vmG/HH_z2K\"=9151J>GLtg19qUK@?{eLv$7:x!DdqlqGz2#Zn`@V~2D[jlqk}7~iAA7}8:_rcSqu(]`r+*ff0rujE&{tzP;w+i]5bruCH38&9X#q+v)/t0DSE`{/:g)EA*f*xd%}qdom?cEtv;~=,!rxs]{@?b$!\"k}MXw+a~icj%*q!0k}0Bf=5kicn;fSQ8Z9GL\"=<7D9:_zq+G,:h)%U>G9x^%DXdoqz$abA)e2~!rZmq{XzkLr+mGG0la$mwq591$8X|9fLq+p){,!DNi!0I}{BXv5k>Km;.S!0u(D5f=5k3f0D|X.8N9xfOJxGg:n%)K38/:kstv<7{x|_>sA8<9}n4v%.[Ila(2Woqzb$Q|k}3L8rg7ccj%xU!0>?gDCA5kmt0DPc!0>?gDCA5kmt0DPc!0u(/nLv5k3f0D\"2/8/?X#\"==7zI0D8UA8/:xfxUF]zxc%GSrFez}n;v$7^,la;XJ7=9<~>v|kg9ZPZmzou(:ekvzfsbp_DjSq$93LpAT@cb5_1jFqj?YDhWT@f0}%xUZxk}7n}=v)#t:_.SR|FdM)&U;~x7g1hms{<9dekvzfaf@%1jSqBz(b@=A7{,!D3K*{I}7n4vU^wc};JE;|A9Y)@=o)>Q:_iH&FFdO)w+<7\"H|_GS?8!9,nr+RGZ9g1hmU\"qz:eQvQ)Ixv;1XJ7qztB/&`@~05_,`Sq%(1`q+a~Cco%5i!0I}<s\"=!k2~0D?q?8&9g)>==7zI:_zq!\",:Y)}=.e{xc%SH||>?rs1JF]30la;Xvqqz|$e{k}rBw+]eGfru*2lNk}2#q+5kmt0DtcA8&9M)9U(f/tK%%qiqj?$ar+u.zx|_z2h\"=9##bA=7CblaZmxF59[$FqA9,sl+]exxn%CHexk}\"b/vn)R$1J.eXtlahmpo>?;$lqj?+Be+I7Gft[A`sq|9j5e+i]X~n%fS/8O}D5_=<7zx|_$JB\"u(}nr+(f9,!rZm]{u([$lq+z(b>=K]{,s;iHZxk}Ib}=D~|t];Djlq+zye/vS.<HH_SHT\"k}2#w+S^Fcn;2HL|^?gD9U*f~f0D8UrFFdZ)MAU^mt0D=`Sq^?%Bl+a~oITD<`Zq+zOXD+g7|t5_WU!0592X`+]exxx;*qexk}+;Lv|kCcH_4HO\",:O)OJV]{x3_SHl{@?;$lq%(H#w+i]8Qv;rcy8N9o`*+#~R$bAM]qbru,S88=98;/&T@4tC_028859[52oT@30TD&`lq$9OXi+i]X~!DfS/8N9zs>=)e/t:_xUSq,:g),+(f{x|_8cD{rzSD1J>GFblahm/8@?|$Fq+z:Be+g7xx!D?q!0Y}o`/v5kMc^%xUSqE9!e/vGeIxn%%qJ7>?P;TJT@*,C_,`sqj?P;\"=jG5bx;iHd7k}fnMAU^ic|_eSQ8O}8B*+v)~HH_DX]{/:O)\"=o)~H$_$J!\"m?$ar+<7|fYPhm~8=9gXC8T@5ITD)S*{k}b`D+i]8QF;JEL|A98Be+<7/t0DxU;|$9X#6UsGg:0D5i{FFdZ)Wa=7Ix^%DX6{@?,nkv$7t?la>sZqY}{e/vK]^,K%jE88!9\"sCAD~xxs;rcexk}IbxU[~k00DNi>G,:O)XvsG(Ho%GSl{,:g)n=.eGH|_Zm\"G59LXbA,7AH5Dxsk8:(}n;vQ)\"Qg1Zmzo@?de/vjGzxF;UH88g}!5TJT@Bt}%1jZqj?*b}=Ge{,n%CHxl|9GL@=(fk00DNie{F~,n1Ju.GH|_}q6{m?,n1Ju.GH|_}q6{m?0b1J:.O~YPZmsqm?@~>vT@jIp_;jsqA9D`&UM^gcn;|ik|k}FX}=D~Fc5DNX*{Y}2XEAU^sb:_tcX|A9Z)D+xG#t:_!iU\"FdO)_=(fkH$_$J_G=90br+8G*,g1$mc7>?}e;vA75I!D7S&{Xz?e;vD~7,g1xs\"Gu(9eYvjGjb!DdqSqGz*bpA=7Gft[;jqq$9x;@=$7xx>%*2`qk}c#BJU^wc+u[X;|A9M)MAU^>Km;Djiqj?`LCAjG{,5_Pc*{Y}8B_=S^8K$_?q*{rzo`vUU^DI:_?q*{k}_B*+S^ic>;(qT\"k}/s@=A7Gf2D)S$Qk}&sQvU^McpDpK.|Gz8BvU(f~f0DeS8XFd#5r+<7AH|_$m0G@?0b.vzfk0C_DXe{Vdg)MAV]/Hd%DXX|Fd>fLv<7@Hc%GS~|u(,nQvD~nfg1;XJ7@?ueQvQ)Jbs;ZJWoY}MXTJ`@5Iv;[i88ez]npA;~xxs;dqNqGzS#hWT@h~x;!iZxk}L5n=S^ic^%|i;|A9D5CAv)k00D?qa|Fdw)`+=7@H$_GS3859YDr+n)f0YP>s*Fez9eXvzfqIt[dqNqw}0BpAF]Gf>%1jSqw}/s>=jGGf@%\"2ZxI}pLMAJ^8K|_.SX|A9Y)BJee#t>%SHhKFdh)e+=7kH^%}q3|A9M)OJU^Px:_*2Q|A9h)kvee#t@%8cc7FdO)]Uee@H|_)K&FezYDbAC./0g1ZmR|u(yeLvjGsIv;UHvqu(r;TJT@DIs;[jqqA9[5n=%.xxs;I2`qk}?bCAS^>Kr[5i*{I}=sl+S^ccpD|Xa||9gDw+ee`I:_.SdoFdg)\"=2.<Ho%GS~|Fd$)EA=7GHd%8c8X=915tvmGH~g1xs^o=9,nkvGe/H5DZmX|@?,nXvA7RtYPZmNqezye.vGeY~9;7SJ759$DhW`@ibs;?2vqqz6LTJ`@tQru[j3|$90bTJJ^icm;!i||j?X#kvo)R$1J*f#fF;1XvqrzwX/&T@*xs;1jSqGz!5`+g7\"0!D[jwqA9en8ri]oIt[fS3|w}8Bl+C.:x3_)Kooqz0e/vS.jb@%%qA|Y}r;ZnT@SbTD&`Nqj??bl+U^Cc+uJE&F,:O)kv.e(H|_8c]{u(}ntv[~0QYPZm}GY}1$lqw}gX>=D~8Qt[&`sqA9oLn=$7GfK%6Kd7k}KX>=GeX~s;rcexk}W;w+=7$>0D|Xwq@?}nr+H./H|_8c;|>?}ntvxGbIYPZms{=9)5bA.e[Ig1xs{F@?1$y8k}MX_=D~8Kn;?q!0m?D5,+U^Eb:_WUh\":0*9\"%I2;0}tfS0GPzztyv<%(>C8;km>C8A3__3(D`[=\"~!;o2pKvCxthXUJDf>+E@e<EI>%dqK\"TyG$!!W0zQC8J^zx};dq*{K~0b1J[~=,!rhm/8tzr;pA`@QfF;<`lq|9KX>=Q)xxn%CH!0k}P;@=U^Ccm;rcN{,:M)CA)eEbg1hmD{ez1$Nq$9|`}=S^ccCDPc38O}D5n=o)#t:_Pc]{/:M)D+)eLtg1Zmwq,:M)vUC.kH^%z2k8.z}nr+C.ffYPhmM759<sC8T@_?>%xUZxk}fL}=.e/t:_k2||FdM)D+=7NI!rZmm\"=9?e/vK]g9}%,SUK=9ZDZnT@[IC_=`Zq|9#5}=Ge{,t[!i!0=9zsi+S^wc5D>U?8N9GLl+.e#tp_GS38/:g)CA8GAH|_<`iqBz}b}=D~X~5_*2exk};`,+eec9:_[XU\",:O)*+ee<Hd%8cIoez}nbA[~~0g1ZmqqY}|$lqw}!5Zn`@30v;A`sqw}\"b\"=D~CcpD\"2d7k}]n4vJ^Mcc%*q~8&9X#8r=7Nb0DWUl{/:Y)EAV]GH|_$m/8Xz##tvxGQ0YPhm9FY}$DC8T@*,2D>U*{k}i#BJ|kCc^%eSsqFdw)xU>Gzx3_#i7oY}:e/vGeV~K%jEA|Y}=sTJT@jbx;=`lqw}$D\"=jGX~}%;X!0k}(bBJU^FcK;!iQ8&9{bq+S^Zcj%HE/8N9D5MA;~#t5_z2+G,:Y)]UxGGH3_#i^o=9|$Nq|98;D+U^ic^%WcA8O}X#Yvn)@HH_DXR|@?]`1JxGh~t[7SUKrz$D/&T@+?v;Dj8Xj?>;,+g7xxs;>U*{@?{bf=5kMco%(2.|A9{b.vn)R$1J(flI2D1XWom?6LC8T@ibp_6SE7k})n@=5kic5DPc3||9X#4v:.R$1J*f*x2D7S&{s?x;/&T@Sb];Djwq^?1`e+I7F9ru*2BKk}zb4v5kcc>;*qX|A9g)w+n)zI:_CE7oFd9btvu.%xj%DXxF>?,nYvA7=,la$mQ8<90eQv`@.0ru%qlqBzYXpAsG8QF;A`OKk}pLMAK]8Q}%iHQ8O}{b&U;~(H|_z2\"G59]`bA<7f02D1XA|rzi#C8T@ibs;1jsq$9kbq+i]Gf>%WU3|^?zs%U5kicd%I2L|Gz/n.v;~g:0DfKv{VdM)i+;~Lt!rhm6{qz@npAT@{xC_jEWo>?[`>=A7|tC_8Uexk}TLkvsGk0:_6Sh\",:M)Yv.eu?g1$me{<9;$lq^?kbMAQ)|tK%|X!0k}&s.v|kCcCDNX7o,:M)vUn)kQ!rhmhK594#C8T@|fK%Pcexk}!5BJn)/t0DliL|,:Y)n=#~zx|_$mN{=9kL1Ju.>?!r|i88.z1$iq^?VXe+!GFc3_[X2!|9!eLvK]Ht!D.K88]?(bpAQ@,,!D1je{I}IbMAD~AH$_bjSq^?j5`+!G|tF;CHBKk}/s6U|k>Kc%3KQ|A9O)Lv<7/t>%8c!\"FdO)MAxG{x|_#iOKqz0bbAV]_?laZm+Gm?0eQvS.Htm%RH&{m?>;hWT@f05_*qexk}j5QvJ^icH_8U~8&9zskvsG#t:_Pc+G,:w)l+)eAHH_SHk8rzSDr+:.bIg1$m]{!9;$FqBzoL\"=S.X~n%iH!0Y}gDMAU^Cc};!ipo,:M)&Uu.~H3_)K;|rz|$lq|9r;\"=D~oI}%,`lq%(KX@=jG8Q>%=`Fq^?Is>=zfGfC_<`!\"k}fnpAmGX~5_%q8X|9q#r+:.bIla$mpou({eYvQ)yQK%%qlqGz3LpA>G|truA`OKk}uB>=Ge|tx;8U}Kk}@nLvU^Px:_SE/8&9Y)n=J^z,0DI2~8N9M)@=.ec90DI2B\",:g)w+(f\"Hj%GSN{m?LXtv:.<0g19q&{Y}5$dok}!5f=jG\"0!DpKlNk}TLxUU^>K^%UEy8&9O)MAxG#tC_8cL|,:)Lr+#~kHd%8cs{=9kLtv>GyQg1xs0Gqz}n.vGeV~g1eSJ7=91$y8I}P;f=GeF9v;6K}Kk}x;QvJ^Px:_PcA8&9g)}=>G#tn%SH>G,:~ntv<7~HH_}qe{x?$atvn)30YP$me{Xz5$iq^?U#@=%.\"0s;+UexI}}bMAJ^Fcd%tcy8/?D5MA:.B~0Dli]{/:xfkv;~~H|_hm/8&9Y)}=$78Qm%=`Sq%()Ln=S.Gf!DWc!0I}j5n=U^mt0D#X?8&9g)Yvu.Nb0D>U.|,:]nr+kf/H|_xsxFm?$aQvS.9,YP|ivqm?1$Q|k}_Bf=A7\"0s;iHMIk}YXQvU^Mc@;zqQ8L?zsf=2.B~:_|X{F,:>fq+)e<HH_#i8X=9SDbA.eQ0g1$mD{!9#$wqA9rBCAQ)F9ru(2!0Y}GL4vU^wcpD)S?8WzX#OJC.#tp_}q!0598BXvJ^z,0DJEQ8&9xfQvmGR$bAkf/t:_iH!0k}{B^XT@:x$_RH$Qk}}b;vJ^ico%(qL|Gzo`\"=.e`I:_NXIoFda`tvee~f:_NX;|w}D5l+xG$>0Dzqiq59,nbAF]$~g1hmc7=9:e/v%.ibs;dqA|rzN5pAT@K~p_;jlq|9TLf=A7Gf5_;jsqj?FXCAjGxxm%>UE7k}fnMA5kico%*2R|$9GL9U(fD9:_\"2N{VdZ)}=0.3~0D?q3|Fdxf@=5kCc};.Sv{FdM)LvV]sI!rhmZqqzt;pAT@/0!D=`lq$9)L_=D~X~t[|X.Qk}a`e+S^wcH_I238EzgDe+.e#tp_GSqq,:}bbA.e#t@%z2:o,:Y)Qv[~<Hd%}q?8u(kLtv.e7,YPxs?8/:xfw+8G~H|_Zm/8u(SDbA:.t?YP$m{F@?D$wqA9P;\"=zf\"0ruWc!0Y}8B@=U^g9:_li/8L?zs`+2.~f0DeS38&9O)_=o)#t}%$JA8&9$)kv<7k05_SHK\",:M)Lv=7kQYPhmFqqzPB/&T@bI@%[jlq$96Lw+a~{,K%2HT\"k}dbl+5k>K$_+c.|A9M)\"=<7/tn%SH^oFd~n1JH.*xH_$m}GrzYD.vD~8?!rZmq{m?deQvQ)NI}%RH88s?PBTJ`@jIru,`ZqBzU#@=D~ic};5i.Qk}(bEAU^wcc%(q~8Ez8BvU.e#t5_8czo,:$DtvH.\"H5D>sl{]?##bAsG}QYP>sy8tz5$8XA9Ib\"=D~ccCDTK!0>?8BLvJ^_Q0D6Kk8/?zs;vo)B~0DfKzo,:xfD+;~\"H|_Zmv{u(}nQvQ)EIg1Wc88g}1$qqBzrB\"=GeF9t[\"2}Kk}K#>=D~Ccn;|i!0=98BXvU^z,:_Pc/8/?8BD+,7B~0D[Xiq,:xfXv>G(H|_Zm{Fu(}n;vA7/0g1fK&{u([$qqj?K#_=Gexxv;4H}Kk}1`_=D~CcpDxU!0=9o``+S^DI0DTKk8&9Y)*+o)#tm%DX(G,:N51J.e<H$_$m)ou(SDYv$7yQg1#XJ7>?#$Nqj?|`>=J^Ccc%[XIo,:O),+M]/H|_z2=oez}n1Jn)kQYPZmv{<95$lqA9?bCAD~{,s;NXMIk}fLCAS^Fc5Dk2y8Z9gDf=,7`I0DWU~8/:M)l+(fsIYPhm.8u(!5/&T@Ltt[Djlq^?cX,+a~{,}%5iT\"k}#5EA|kCcd%k2y8VdM)Xv>Gu?!rhms{!9|5pAT@[Is;<`lq$9(bCAD~8QrueSMIk}&sl+S^Fc|_+U38/?gDvUJ^Mc+uPc38Ez{bn=#~B~0D(2L|,:M)f=;~>?YPhmzou(/s/&T@f02D;jNq^?gX8r5kcc};rc||w}zs9UsGIx3_8c\"G59uekvA7jIv;&`lqGzQL_=K]{,2D|Xy8N9zskvC.$>:_CEy8x?]`bA)e>?v;qEn\"u(+B`+a~5bp_!iZxk}%B/v:.g::_PcX|w}8Bf=>GD9:_?qR|w}2X@=RG%xo%GS`{:(,nbARG+?laxsFq=99e.vzfmtm%QXn\"u(gXhWT@Cbm%2H.Qk}MXWaU^ic>;4HQ8Wz8B8rkfk0:_fK2\",:g)`+8GGH|_$JB\">?cE1J:.#fYPZmFq=9#$M7k}#5}=$75bK%tc!0I}\"s]UU^ccK;xU.8&9>fi+C.:,:_pKrF,:tBbA;~AHc%SHK\"m?SDr+H./0YPhmooY}}b2o`@DIC_DjlqBzN`e+}f\"0!D*2T\"k}IbBJ|kic|_5i;|w}gD}==7Ix|_}qrFm?Q`1Jee/0ruQXJ7=9t;hWT@zxrutc!0I}tB*+U^ccc%SE/8&9>fLvxG:,:_!izo,:Isr+RG/Hc%SH:oqzcEtvF]~0YPZm/8>?b$lqk}D`\"=Gexxp_PcMI@?GLEAU^Zc^%xU.8N9O)MA:.B~0Dzqq{,:zbbAsG\"H|_Zm\"G@?kLQvQ)f0g1fKn\"@?b$sq+zzb}=K]GfF;fK.8L?{b6Uo)#t0Dk2.8/:$)WamGkHH_$J%F,:Y)XvC./H|_XEX|u(rs1J>G0?YPZmOKez[$e{k}@nMA$7\"0];!i!0k}TLEAU^Cc};Pcwq,:O)XvV]<H3_GSQ8.z#$qq$9i#_=D~xxTDI2!0k}@nD+U^CcCD4H(G,:w)kvo)GH3_SHq{rz#$qqw}c#hWT@cbn%2Hexk}0B_=0.$>:_*2?8&9zs\"=kf$>0D#X`{:($atvn)3fYPhml{x?P;2oT@*,x;bjNq^?1`Wa|kccCD8U.|w}X#`+(f%x^%DX_G=9]`bA:.IxK%`nOBreY~eam\"N,>0D+.&1}IeK>=:~$ex=::c]@iFA8.(+o[.8G4b:@P\"S{09^Ux}Of#I.v=7@f@%YN`xz7=t;%|kw9Q_XE&Fu(OX/&T@@0TD<`NqA9m58r5kccd%zq/8O}{bWan)*x$_z2q{!9}n1JH.],laHHUKrz|$Sqj?QLD+I7>K5D)S!0>?zsBJ|kXt0DUEy8O}X#q+=7R$tvC.*x@%jE&{!9ZD8ra~F9@%(q!0k}FX_=5kccpD)S.8EzX#q+kf/t5_}q:o,:H#bAmG{x|_xs~8s?SD4v%.9,!rUE&{]?[$qq+zkb`+i]\"02D9q~87zgD.vo)R$bA(fjb}%%qy8O}/nMA5kCc+uiHD{FdM)*+(f<0>%=`lq%(7nhWT@LtK%eS.8N92XMAn)$>:_;X}G@?;$sq$9%B>=K]xx2DxU/8/?zs/v[~$>:_HH~8u(#$wqw}c#MAK]xxt[I2iq,:M)2J.eJb!r$mh\">?Q`tv>G^,m%Y4vq59wXpAT@4t2D=`M7k}rBf=K]F9>%fS/8&9o`*+<7$>:_!i?8:($ar+F]EIg1hm]{u([$qqw}8;pAT@z,];<`sqGzD`>=A7|t@%k2.Qk}MX/vU^Mc|_tcOBk}`Ln=U^cc5D8U38O}D5EAH.(HH_}q_Gqz]`bAV]3f!D7Svq@?K#C8T@Jbn%fK*{k}\"sD+5kCc3_eS(G@?,n1JH.5I!rhmu8@?t;_=A7Gfm%I2exk}v`vU:.O~YPhm&F>?_BhWT@<02D2HX|A92X%UU^Cc3_2He{ez0bbA)e$>:_(2(Gm??ekvzf\"Qn%1jNqw})LCA>G#t0DTKO\"FdM)BJ=7@0s;ZJ8859.nhWT@bIK%|XR|A9>fCAS^Ccd%6S]{Vd|5bA(f(Ho%8c38tzq#YvGeFbg1fKJ7qz?e/vD~Bt2DqE&{:(%BpAT@g95_1jNq%(m5f=A7\"0F;#XT\"k}@n2JU^z,0D#X*{@?X#kvJ^[I:_*2Q|$9h)`+C.k0@%DX9FFdpL1Ju.\"H3_XEFq@?.LZnT@V~TD[jNqw}TLD+u.k0:_k2]{/:M)Lv<7<Hd%z23|,:Y);v=7kH$_GS]{tzrsr+H.~H^%XEFq@?}n/vGef0YP>sL|,:O)CAee$>:_#Xl{.z$atv>GLtYPhmR|m?F#^XT@QfF;[jlq|9oL8rg7xx@%\"2Zxk}m5>==7D9:_HHZqFdM)n=xG/0la>s~|qzdekvzf+?5_4FQxM7M~W@P\"&Ia;^PrG80MOdQnkm>C8;km>ArnBbojrhXUJDf,pb@?pII0s*sPaI~^dtJF]1Bn;pK<\"=:LVQ&r~R$*2T@w9!D<`qq+zzb,+]e{,s;;X}Kk}D`n=5k>K3_NX/8&9O)%Uo)/t5_)K!0qzzskv|kTf:_?q?8Z9h)MA|k5I0D+U38/?>fLv<7k00Dtck8/?GL`+8GB~:_eS&F,:>f/v[~kH+u)K6{u(}n/vzf4~g1hmQ8g};$lq%(`L@=$78Q5_|X.Qk}@n;vU^wco%SE~8Wz/nQvC.k00D.Sqq,:w)\"=0.@Hd%z238!9)51Jo)Cbg1>s!\"m?cEhWT@lITD;Xexk}%Bn=J^ic3_CE?8&9/ni+,7#t:_WU{F,:O)i+)ekH|_z2L|qz}nbAeeZ9g1hm{Fm?|$lqA9(b>=$7X~2D9q!0k}db`+U^_Q0DeSQ|GzGLWaJ^~00D(qE7=9{b&UU^qb:_li||^?>ff=#~:,:_JE%FFd$DbA=7~H^%XE~|ez,nQvD~uQYP$mOKqz}e,+Q@\"Qlahmoo=9{e.vS.Pxru%q&{]?S#ZnT@2tTD,`Sqj?*b}=GeF9s;=`lq$9+;MAD~oI!DWU!0k}6LQvJ^ic};Nik8N9zs9U(fk0:_\"2>G,:M)w+)eSbYPhmq{=9\"s/&T@;f5_1jlqBz9bi+I7X~F;*2T\"k}`L2J5kic$_)SR|A9D5,+H.g::_!iQ8VdY)BJF]%x};7SA|rzN5/&T@f0v;bjlqBzN`e+g7\"09;bjqq+z:Bl+]e:,:_8UL|h3G$Ed:.XVoX]e|fp#8U\"K4*&<H8;km>C8;k,x09V#)Qkf6fy[^45CUu/S&}H.87b_@J\"fTD?L6{:(PtC8}pFSQ_jECdK~M)MAF]zxd%SHA8>?Q`1JH.h~5_vi&{Xz(bpAT@0?s;=`!\"k}N5hWT@I,ruiH!0k}ZDq+U^Ccm;fKk8N9o`4vo)#t:_WcQ8/:Y),+V]/H^%8cD{@?}n.vD~#fg1fKvq@?N$m\"k}6L>=A78KpDPcd7=9zs`+U^FcCD>UQ8Z9/n6U[~B~:_#X=o,:Z)xUC.@H+uz2B\"qzLXbAC.w9YPhmO\">?4XC8T@2t}%[jlq^?3Le+a~oI2D\"2T\"k}cX/v|kcc|_I2$Qk}ZDkv5kMcpD9qa|Gz8Bi+xGs`0D;XKKFd]nbAC.dx|_Zm=oFdO)f=M]9xH_}qL|ezYDbAM]u?!r$me{!9}eLvzfh~@%02&{u(6nZnT@Y~2D<`sq+zIsCAGe\"05_*2lNk}fL]UJ^Zco%CHexI}}b}=$7{,m%5i.Qk}ksw+S^Zc};HE~8Ezo`*+RG#t5_$JL|,:]nr+2.<Hd%GSk8@?##1Jo)h~YPxs)o>?b$ZqGz<sn=D~ccj%I2!0>?D5%UU^ccm;#Xk8Z9o`n=RG:,0DWUzo,:h)vU[~<Hc%z2s{u(cEr+v)mtg1Zm6{x?#$qq|9TL>=%.F9v;I2OBk}l52JJ^8K>;I2.8&9M)2JC.k0:_)Sg7,:w)4v[~(H^%XEs{>?)51JF]Q0g1>s.8ezrsr+kf&,g1hmQ8qz#$lq%(PBn=$7X~t[3Kd7k}P;@=GeoIn%PcOBFdw)>=0.*xH_#is{Vdg)6U*f9x^%GSe{:(?sbA5k~HH_GS&F=9$ar+.eKtYP$mZqY}#$Sq%(;`n=S.|t2D=`wq+zN5TJT@G0m%,`qq%(oL}=S.|tx;8U}Kk}=s%UJ^Px:_li/8&9O)xU.e`I:_6KN{/:g)MA<7(Hc%GS;|59cEbA<7;fg1;XJ7rzD$M7k}S#}=D~5b];5iMIk}~n@=J^McpD[Xk8/?{b@=,7B~0D>U{F,:Z)>=.e<HH_z2K\"ez$atv<72tg1$m6{59#$iq|9=s>=S.X~2D=`ZqA9N5hW`@DIru<`SqBz;`n=Q)Gf2D<`8X|9:B}=D~FcH_|X!0>?zs_=U^Fc5D)S.8Z9/n/vJ^gc|_CE~8Wz{bXv=7Nb:_(2?8_(GL`+mG`I0DNi>G,:g)6U(fGHc%8c/8=9LXr+u.<0g1>UA|ez}nQv$7=,YP$m]{tzSD1JC._Qg1>sZqqzb$wq+zr;\"=D~ic};pK!0=92X,+U^Fcd%Wcy8Z92X@=2.~f:_CHl{/:$)_=v)(H5Dhmy8ez}n/vK]8?g1hmM7>?b$lqw}3LCAD~|tx;?q!0k}U#\"=J^ccH_TKy8N9/n2J>Gk0:_WcD{/:O)9UsGkHH_XER|u(}nbAC.G0g1$mu8s?5$lqj?c#MAA7xxrurc!0k}OX,+S^ccpD6S38&9GLn=o)`I0D;X/8Z98B@=U^icpD2H.8&9o`i+kf#t:_HH%F,:O)BJn)GHH_}qB\"qz$abAH.|fg1hml{tz1$lqBzx;\"=D~GfruNX!0k}t;QvU^ccj%#X?8Z92X_=xGoCCDdq#!k}.L}=S^wc+u(q!0Y}gDWaU^mt:_I2A8&9h)i+.e#tm%$J.8Z9{bq+0.c9:_3K~|,:Z)l+(f~Ho%)KQ8tzLXtv*f4~g1JEA|rz|$Sqj?oL}=Ge|t}%6S!0I}?bn=J^Px0D(2~8&9g)BJ<7#t@%}ql{/:Y)\"=v)GH$_)Km\"m?rstv(fG0g1>sq{m?b$y8k}Ibn=D~ic+u\"2MIk}8;w+S^ccj%4H38/?2X}=u.:,:_3K8X,:$)%UxG/Hc%DXy8&9o`;vJ^ic|_.S.8N9o`6Uu.k0:_.S&F,:Y)/veec90D|i/8O}D52JF]<H3_SH^o>?}nr+=7Htg1hmy8qz#$lqj?i#@=D~X~s;lilNk}dbXvU^wcd%8Uk8&9M)BJ;~#tp_)Ku8/:S#r+v)\"H|_>s/8qzSDtvV]_?YP$m.|@?;$wq$9_BCAQ)|tK%[X!0=9o`n=S^/0:_UE.8N9GL8r*fk0:_TKq{/:h)xUu.@H^%8cQ|59rsbA8GRtYPxsh\"@?N$SqA9gXMAjG8QC_?qexI}MX2JU^8K};#XA8&9w)8rv)#t}%XEoo,:Y)4vV]AH$_)KZq=9rsr+<7>?YPxsc7@?}nkvzfx7g1;X&{qz5$lq+zFXMAD~8Q}%=`qq$9_B@=$7{,K%+clNk}a`8rU^wc>;JE/8N9{bvU>Gk0:_CH38/?X#q+xG`I0Dk2OBk}pLMAU^zx^%}q~8]?15bAv)aflaJEvq59deCAT@zxK%%qFqw}6LpAH.oIm%=`lqBz.n@=D~5bK%zqd7k}kb/vU^Fc+upK38L?D5f=;~:,0D4HN{,:Y)CA>GkH$_$JzoezkLtv=70?YP>s7orz#$8X$93L@=zf5bv;WU!0k}6LEAU^icd%3K.8N9zse+eek00D,`Sqw}N`CAjGF9@%(2MIk}$DEAJ^ccCDNX.8/?{b\"=H.`I0D)S`{/:Z)>=8G/Ho%8cdou(]`tvsGt?YPhmN{g}$D/&T@EbC_;jlq$9N``+a~5b@%4HT\"k}4X2J|kFcpD8U;|$9{b_=0.3~0D>Uv{VdZ)_=n)%x+uDXq{x?CXtvV]Lt!rZm`{59{e.vA7x7@%,SA|=9oLhW`@f0x;,`Fq+zksMAS.|t2D9qMIk}MX2JJ^Fc3_fK.8L?{bvU.e:,:_+UD{/:>f/vee>Q:_NX/8N9zsYv<7k00DfSZq,:h)_=xG(H^%SH?8tzcEhWQ@dx$_}qR|$9zs,+;~3~0DrcwqFd$)/v(f*x|_hm]{]?,nkvGeBtlahmX|u({e.vK]Px>%MJUKqz0BhW`@bIt[=`iq+zksMA%.|ts;rc.Qk}4XEAJ^Mcm;>U?8EzX#@=RGNb:_fKqq,:}bbA#~AH5DZmA8/:O)2JC./H|_}q.8qz}nbAH.h~g1hmOKY}|$sq$9:Bn=A7F9v;#X!0k};`_=U^ic};4H~8Z9o`CAA75bru>U.Qk}enXvU^Mcd%+UQ8N9gDxU>Gk00D?q=o,:g)\"=C.~Hd%z2xF>?kLbA2.7,YP>s8X>?/~wAA7w{5r*|Xv;*H_n=kfy1@%=R$|nW~$ex=:~$.Q3)/N}%lF0_.mP;G=T.=t([nB=zPmlS6+$91`FnsGCb>tHa?&~.a$c7t?o`q+xGg::_liZq,:h)i+>G%x^%8c`{x?cEtvee^b0DWcL|,:$Dr+0.%x|_xs:oezSDkvQ)Cbla[X&{!9;$A8I}L5C8:.8Q5_1jqq^?[58r!G8QTD[X`qk}oL.v|k8K|_Ni3|A9O)CA)e/t>%}qq{Vdw)l+RG:xH_SH.8Xzq#bARGzx^%$JB\"ez?s1J=7G0!rxsy8=9de/vD~/0C_%qn\"ezl5ZnT@uQx;A`sqj?dbTJT@yQTD=`qq+zgXMAjGF9TD*2Zxk}$D\"=S.\"09;Djqq^?KX\"=D~Cc>;;X`qk}}b}=K]X~p_*q3|w}D5MAv)GH|_DXlq59,nr+ee\"Qg1hmpo599e/v%.9,s;dqFqj?MXpAmGX~!D[jQ|k}>;f=$7cc|_CH$QY}8B_=U^lI:_*2Q8O}D5q+RG~H3_SHiqqz|$lqA9\"spAT@mt>%,`lqGz9b@=D~X~F;iH.Qk}&sOJJ^Mcd%A`ZqGzfnf=Q)5bp_+c!0598B&UU^g9:_tcA8&9o`YvsG#t:_CH/8N9{bQvsGk0:_2H2\",:Y)_=F]kH$_z2?8:(ht2o:HFqUu.v;|ez55kv{]QHqx9`ex=:~$.Q3)/N}%lF0_.mP;G=T.=t([nB=zPmlS6+|9OXGJ[~Sb>tHa?&~.a$c7]98B/vC.g:0DNXD{,:w)6U>GIx^%}qO\"59SDbAM]2~!rxszo=91$wq+z*sl+I7icj%+UMI59o`>=|kXt0D+c.8/?M)EAv)2<@%#iD{VdO)xU;~Ix$_)K=o@?0bbARG,,!r>sk8m??eLvzfDI5_@Kn\"Y}}ekvS.9x];=`NqGz;`w+S^ic^%?qy8&9D5EAo)k00DUErF,:w)OJ.eAH3_#iooY}#$NqGzuBvUJ^ic^%Pcy8&9D5xU*fk0:_SEK\",:w)xUF](H3_8c]{qz]`1Jn)T0v;dqvqY}6L/&T@afv;Djsq^?KXi+I7F9K%li*{k}/sLv|kicr[6KX|$92X9U5kFcK;NXa|j?2X_=xG2<0DpK38Vdw)q+,7AH|_DX;|qzq#bA#~g9YPZmD{x?0e4vD~2tt[7SA|Y}FXhWT@afs;[jNq^?0BOJJ^ic5D2HR|w}2X4vsG/H|_#iD{59,nr+C.7,g1eS88s?ye/vT@EIYP|in\"u(}ee+Q@2~9;ZJNqGz4#hWn)xxs;[jNqA9KX}=U^Cco%*qhKFdM)MA*f(H|_$JK\"m?Q`1J(f*,F;1X88rz55hWT@I,x;Pc*{k}F#vUU^Ccn;+c%FFdY)n=;~/H3_)Ke{:(:eLvQ)_?YPhm.|ezIspAT@rxn%[jNq$9S#9UJ^ccpD>U;|w}X#4v.e/H$_XE/8qz]`1JxG_?];7SA|rz7n^XT@}Q5_;jFq%(U#`+t.GfF;*q*{Y}o`i+5kic|_4H.|A9{bEA)eg:0D*2*FFdw);vF]{x$_SH/8qzYDtvxGuQ!rhmh\"rzj5hWT@u?ruI2exk}Ibq+)e$>:_+U8Xrz}ntvC.bIg1hmN{tzD$lq+z(b\"=D~Gf}%xUd7k}a`>=S^Fc^%tc.8/?X#XvxG:,0D)SD{Z3G$Ed:.XVoX]e1fv;zq\"K4*&<H8;km>C8;k,x09V#)Qkf6fy[^45CUu/S&}H.87b_@JQtrudLwqu(PtC8}pFSQ_jECdK~M),+:.7,lahmrF=9[$NqA93Ln=5kic};(q/8O}{bWan)*xH_)KO\"ez$atv:.ib!r.S88.z[$e{k}FXC8C.\"0t[A`k8k}N`8rt.FcK;Pc!0ez8Be+5kg90D9qd7rz/nw+5k3f:_Wc?8L?$)f=)e/tK%}q6{VdY)&U>GIx$_}ql{tz7LbAv)Ltla$m]{>?}eCAT@dxo%z2*Fm?,nbAF]NI!rhmv{rz\"sZnT@%xv;,`NqBz?b]UJ^Fc$_8U38&9{b\"=H.#t@%SH+G,:h)2JsG@H>;hmFqqz$atv;~NIYPk2n\"@?:e;v$7I,t[dqwqBz*spAQ@Px2D[j6{I}~nf=A7FcH_+UE7rzo`i+S^Xt0DfS||^?gDkv*f#t}%#iO\"Fdw)%U>G\"HCDxs)o=9##bA#~XtYP8U&{qz]`1JxG30x;dqn\">?OX/&T@yQ2D1XWorzm52oT@*,g1Zm~8.zRS8WCJCqtmynaQ=IZ#_=r\"Sc,8t`ex=:~$ex{*++*uUkS{09^U\"M*fJV>W`KVKA(xo~l?y|5*+%.%xkP?`!!W0zQC8qqMc|_*2~8&9D5YvsG3~:_WUm\",:g)}=,7:x+uSH}Kk}fnMA5kicpDNXQ8&9/nYvmGg:0DeS/8/:w)QvsG9x$_DXy8XzSDbAsGCb!rhm^om?IsC8T@9x@%?q!0k}4XEA5kicCDJEA8&9GLLv>G/t:_+UA8&9M)*+kf/t5_}qQ8N9M)OJ5k@00D*2Q8Z9O)@=sGD9C_}q^o,:Y)_=C.zx$_XErF=9kLtvsGEI!r>sqq@?N$8XBzL5/&Q@,,2DdL=8/?,n,+a~g9$1Zmc7@?9e/vGe3f9;UH88rztBZnT@zxt[Djwq+z4X_=jGGft[1jlqw}@n@=K]8Q!D5iQ|A9o`EAH.$>:_*q%F>?0br+=7Qfg1hm7oez?e/vK]nft[qE88tz55\"=D~xx9;pKZxk}QL_=:.k00D9qN{VdO)i+:./H3_#ig7ez0ekvGeqI}%1jlq^?&s}=D~|tK%PcT\"k}cX>=J^icc%9qQ||9o`.vo)#t:_I2/8Vdg)*+[~(H$_$Jqqqz7Lr+eeCbg1$m]{=9:ekvS.DIC_1jNqj?|`6UU^icd%+ca|A9/nf=H.k00D(2+GFdO)@=M]<H|_$m?8.z,n/vzf4~YP|iWoez0e.v`@H~F;ZJFqBz6LhW<7\"0TD,`qq|9*s\"=$78Qp_fSOBk}D`@=U^Zc^%2H~8&9%eCAwwB>T^k2oC8bEHqqL\"69nXRpa#Nr9`ex=:~$|8\"~JIi8`KVKA(lRAl;*|#b@Ni+X:9L1W|@?=~D+,7y05r@YqN89]`s_T@4t2D=`sqA9,sl+i]8Q5_CHMIk}rB@=5kPx@;1XJ7=9N52oT@<HH_$J!\"m?$abAU^dx@;qEn\"u(*bD+i]GfK%UE||w}D5WamGIx|_SH7o=9Q`r+kf;f5_QXJ7rzgXpAT@~05_<`qqA9W;}=A75bs;6S.Qk}t;_=J^wcd%*2/87z{b/v=7$>:_\"2+G59]`r+)eLt9;dqUK59QL/&T@zxTD1jsq+zcX,+I7{,m%NXZxk}|`}=C.R$r+2.Sb2Ddq88<9]n/&T@^,5_[jsqGz2#,+I7X~@%8UBKk}cXw+t.5bn%TKBKk}cXw+t.5bn%TK*{>?2X9U5kDI0DCH;|^?/n*+eezI0DpK+GFd>f]Uee%xc%)KrFez,nQv$77,la>U&{qz9e;vK]x7laZm9F=99e4vQ)?Q5_vivqez6LpA;~oIs;,`e{k}6n_=$7oIp_*qd7k}/svUU^ZcCD5iQ87zX#8r#~#t5_}qKK,:]nr+mG\"H3_#i;|>?5$Nq+z/s`+S^ic@;JE38&9gD8rn)k0:_+cq{,:w)CA>G\"HH_XER|u(}nbAC.G0YPZmu8s?5$lqj?c#MAGexxF;3K!0k}As;vJ^ccpD6S38&9GLn=o)k0:_fKA8/:O)\"=#~~Hd%}q3|,:Y)6U.e#t:_HH%F,:O)BJn)GH|_XE;|ez}nr+H.cbYPZmM759|$sqA9wX@=D~GfruNX!0k}t;QvU^icm;\"2?8&98BxUu.k00DfSm\",:Y)8r.e|BZP1jM7X?o`\"=*f:,0D\"2y8&9M)>=0.#t5_z27o,:#51JsG<H5D>sxF,:Y).vn)/H$_GSQ8m?kLbAV]\"QYP>sq{Xz#$8X+z\"b\"=D~Cc^%tc.Qk}MX\"=U^wc|_rcA8_(gDMA#~#tp_}qFq,:S#r+H.kH5D$mOKu(SDtv*fcbg1Zmx&59[$wq|9F#MAS.5b!Dzq!0Y}8BMAS^mt0DPc~8N9X#`+v)k00Dtc/8/:g)n=[~kH^%SH}Kk}&sQvU^>KCD&`sq%(6n>=$7\"0C_RH&{.zoLZn`@5ITD&`Zq%(db>=zfGfC_|i!0>?gD}=S^DI0D\"2/8&9Y)>=*f#t}%)K||,:kstvo)<H|_$m8Xm?ht2o:HFqUu.vZq0(%B>b{]QHqx9`ex=:~$.Q3)/N}%lF0_.mP;G=T.=t([nB=zPmlS6+$9S#KWC.Eb>tHa?&~.a$u8&9$a(^K]GfTD6Kk8&9GL}=H.#t:_zq+G,:Y)`+;~k00DHHh\",:g)vUee(H|_GSooqzSDtv:.1fYPZmm\"59;$wqj?H#>=$7xxt[Wc!0=9gD]UU^ccH_>Uy8_(gD2JU^wc>;3K/8&9>f*+=7Nb:_9qB\",:fLr+8G<H|_XEsq59$abAn)<0g1hm*F@?;$iq|9S#ZnT@_?n%,`wqBz(bl+Y^PxCD2jsq+z&s}=A7{,s;tc$Qk}F#%UJ^Mcr[(2;|GzxBC8T@NI2DeSE7k}OX&U|kic@;WUR|+zgDw+<7D9:_)SdoFdxf}=sGzx3_GS&FrzdekvQ)=,2D&`Nq%(m5QvJ^icm;JEA8&9D5*+#~k00D3Klq,:M)@=v)&,g1hmQ|Y}N$NqGz{B_=U^ic>;SE.8&9GL2JJ^ccj%+c38&9o`n=sG#t:_Pc`{,:w),+kfkH$_#i{F>?SDtvo)/0g1$m||59D$Nqj?\"sl+U^Cc+u*2{F,:O)BJ.e(H|_8c_G>?}ntv<7cbYPZm38qzb$Sq^?FX>=S.Gf}%5iexI}!58rS^z,:_I2Q8&9w)LvH.k0>%z2||h3G$Ed:.XVoX}f{PiDPc\"K4*&<H8;km>C8;k,x09V#)Qkf6fy[^45CUu/S&}H.87b_@JF`x;}Llq@?PtC8}pFSQ_jE!0,:>%`AmG\"05_=`dok}&s\"=D~McCDeS!0@?X#4vU^RtlafK6l$9qeMAD~rz0DWcy8Vd]n1J;~Ix$_}qs{qz,n/v$7sbla>sR|@?ye,+`@Pxn%,SA|rz=spAT@kQn%=`8X$9.LMAA75b@%!i!0@?/n;vU^FcK;+UK\":0*9\"%I2;0}t}WlGYk7tyv<%(>C8;km>C8A3__3(D`[=\"~!;o2pKvCxthXUJDf>+E@e<yQruUHxFTyG$!!W0zQC8|kPx>;2jNq%(5$Nq$90e/vzf*x3_z2||$9}nQ%T@Qf@%QX&{qzL5(^K]F9s;=`sqBz}b}=K]F9s;=`sqBz}b}=$7xxn%CHlNk}7nMAU^Cc@;SE+G,:M)_==7<H|_}qu8u(]`r+,7<H|_z2~8/:O)MAU^icK;HE?8&9gD&U;~#t:_li#\",:O)QvxG(Hd%}q=om?SD1J.ek00DNXlq,:w)4v;~/H^%GSN{ez)5bA>GCbYPxs/87zD5!^A7,C|_)KQ8!9}n1J[~+?g1hmq{Xz1$lqGz#5>=jGxxn%CHd7k},s}=K]Gf5_+c/8O}zsCA8G#t:_#X%F,:O)%Uo)/HH_}q~859$abAH.|fg1hm(G59D$lqBzIs\"=D~8Q>%xU!0k}Ib4vU^ccm;!ik8Z92X_=xGoCCDdq]vk}AsWaU^wc$_Pc38_(gD&U>G#tp_SHs{,:S#bAo)~H5D$mL|,:M)q+u.<0YPhm7ou(<s/&T@Rt2Ddqn\"u(m5/&T@u?n%Djlq%(OXC8`@tQv;DjSq$9TLw+p)|t@%3KZxI}TL>=|k/00DNX||A9w)9U;~>_:_4HooFdO)9Un)Px|_$JQ8rz,nbAH.sbT*?`Ed:.XVoXp)t15_Pc\"K4*&<H8;km>C8;k,x09V#)Qkf6fy[^45CUu/S&}H.87b_@Jx,TD9L2\"m?PtC8}pFSQ_jE@+,:D$u8Z9,nbA:.9,!r$mZqu({ekvS./02D&`Nq+zt;]UU^icd%.SA8&9gD&U.ek00DHHh\",:w)BJ<7#t0DHH~|,:O)/v=7<H|_}q/8m?}nbA=7*,YPZmB\"@?1$sq|9=s\"=D~\"05_NX!0k})L}=D~\"05_NX!0k})L}=A7oI];<`sq$9W;}=D~{,ru*q!0k}W;w+U^Fc5D|Xy8Z9o`f==7`I0Dtc!\",:g)Xvo)GH3_#i!\"59b$Nq+zIbq+U^icd%.SA8&9gD\"=xGk00DHHh\",:w)kvn)/H|_#i(G=9}nbA*f$~g1hm.8x?b$lqj?{B\"=D~{,n%HHd7k}c#!^$7oC3_DX/8&98B@=Xq$>0DTKa|59$ar+#~(QYPZm!\"rz#$sqBz|5MAjGGf@%,S&{59ye/vS.5IC_%qWom?l5pAT@sI}%A`lq^?pL}=$7F9K%+cd7k}#5OJJ^Cco%fK}G,:M)\"=;~Y~g1hm6{u([$lq|9>;>=D~8Q9;!i!0k}j5>=U^Cco%CH?8O}GLxUsGAH|_DX/8@?}ntvH.Jbg1hms{]?[$lq%(7n\"=K]X~>%6Kk8O}GLxUee@H|_DX||u(}ntvu.2tg1hmq{qz}nbA#~FbYPZmN{m?|$sq+zD`f=jG8QF;rclNk}ZD9UU^gcr[5iexI}S#.vU^Ccr[[jNq$90e/vzf~H3_z2||$9,nC8T@G09;bjNq^?}bl+i]8Q}%|XZxk}Ibl+a~\"0F;#X*{k}N5^XT@kQx;;jqqBzH#^X`@.0ru1jwqGz<sD+a~icpD[je{k}|`e+I7|tp_3KT\"k}FXxU|kMc$_#X$Qk}*b%U5kgco%CH`qk}K#]U5kccm;CER||9zsf=|kwc^%pK.|j?D5i+5k>K>;6KR|BzgD@=5kic5D<", "\"bpAT@%xK%=`sq$9{B_=A7oI5_!id7k}MX]UU^Fco%CHexk}MX_=S^Cco%>U?8/:O),+kf~H|_DXNqrz}nr+M]Tfg1hmh\"qzb$qqj?{B\"=$7X~5_+U}Kk}tBXvJ^gc+utc38&9O).vU^Px0DNim\":0*9\"%I2;0}tI2||Pzktyv<%(>C8;km>C8A3__3(D`[=\"~!;o2pKvCxthXUJDf>+E@e<Btm%7SFqTyG$!!W0zQC8qq>Km;[XQ8_(zsBJ=7/tp_8cq{/:~n1J<7*x5DZmK\"m?SD;vK]f0!rhm%F>?2#2oT@=,!D<`lqA9;`i+]e|tp_.S!0k}r;MA5kZcn;#X?8O}gDl+RG%x|_SH)ou(]`1J[~3fC_MJ&{m?b$lqw}%Bi+!GGfC_6SMIk})L]U5kPx0D#X38N9/n&UC./tp_SH?8/:$)l+8G*x5Dxs;|ezqe,+I7,Cc%$Jg7>??stv<7|fg1xs`{m?deMAT@NIg19qE759see+Y^CcCDDjqqj?*b9UM^icpD9qL|%(/nEA:.c9:_SE\"GFdrB1Ju.AHj%#i;||9Z)%Uo))Cd%OX`qh3G$Ed:.XVoXp)cbp_Pc\"K4*&<H8;km>C8;k,x09V#)Qkf6fy[^45CUu/S&}H.87b_@J00C_dLL|59PtC8}pFSQ_jEf}m?!e.vA7jb!DZJJ7=9\"sZnT@@0}%[jSq$92#\"=A7|t2DDjZqA9,sl+i]xx5_CErFFdM)8r;~9,!rhmc7rz4X_=D~8Qp_?qexk}[5;vn)~HH_#ik8m?]`r+=7~0TD1jNq+z,sBJ5kCc3_k2A8rz,n1JH.Xt!rhmKKY}7nMAA7xxK%1jlqBz{B`+i]{,rufSQ|$9zsvUee/t:_UE3|Fdh)q+2.dx|_8c!\"m?,nr+eeaf!rhm>Grz55ZnT@mt!D=`Nq+zkbf=S^Fc5DTK?8&9o`CA)e`I0D.S38/:O)9U*fGHd%$JA8Xz}nbAC.FbYPxse{>?D$SqA9uBhWT@lI}%NXMIk}L5QvJ^Ccj%TKIo,:g)vU;~AH3_8c!\"m?rstvn)^,YPhm#\"m?$Di+i]GfTDWcX|w}o`l+=7_?lahmA8>?9ekvK]h~!DNXMIk}}b@=K]xx@%li}G,:O)4vH.GH3_XE*Fu(PB^XT@&,n%[jNqA9]nxU|kwc|_4H/8R9xv/&=7,C^%GSs{!915r+n)Q0g1$mB\"=9?e2J`@[Ix;UHA|u(PBZnmGX~t[=`NqBzQL/vU^Fc};6K.8N9GL9UxG`I:_SE]{,:h)}=8G~Ho%$J:oezSDbA(fDIg1hmA8]?;$qqA96n_=D~oIK%)SOBk}pLMAU^ccm;=`lqA9#5hWT@G0s;liMIk}>;EAJ^CcK;2Hoo,:Y)xUn)GH|_DX8Xu(SDr+ee$~YPhmX|>?}b^XT@9,K%;jNq%(W;/v|kZcpDrc||w}2X9U;~]NrtND|v:.=t%n@7*7~;%nDq5+0$ex=:~$ex{*++*uUkS{09^U\"M*fJV>W`KVKA(xo~l?y+;*+A7?QkP?`!!W0zQC8:M%x/j1X#!A9{be+RGk0:_.S.||9X#Qv>G`I:_3K]{FdY)XveeB~0DiHZxk}|5kv<7$>:_WUU\"59Q`1JV]/0];dqn\"rzK#pAT@H~2DDjlq%(~nn=K]5bm%iH||A98B@=U^Ccr[I2iqFdO)6U.ek00D?q3|Fdh)Qvo)Px3_#is{g}de.vjG+?5_jEUKqz|`\"=A7oI];?qMIFd;$Nq%(5$Nq$9D$lq%(|$Nq+z#$k8&9]`r+C.8?F;qEWou([$Nq%(_B@=U^Ccr[,`lq^?\"s}=D~{,lahmiq59ye/vGe/t0Dk23|FdO)l+I7{,n%CH*{k}RS8WCJCqtmynaQ~?7bVr+\"Sc,8t`ex=:~$ex{*++*uUkS{09^U\"M*fJV>W`KVKA(xo~l?y9b,+Q)FbkP?`!!W0zQC8qqgc$_6Kexk}Ib}=<73~0D[XQ8O}8BMA.e%xc%)Ku8@?}nr+*fXtlaxsu8!9|$sq|9YXD+a~>K};[X!0k}kbMA|kTf0DNX/8&9GL`+(f/t0Dtc2\"FdM)EAF]bIruMJA|ezZDhWT@Ltt[Niy8L?gD}=.e$>:_;X}G@?;$Sq$9{ekvK]RtK%fSexI}=svUU^CcpDk2?8Xz}nQvK]kH3_XE&FrzpLpAmG|t}%=`wq+z/sn=$7>Kj%9qMIk}Ib\"=GeFc|_?q*{k}Gn_=J^Cco%UE:oFdM)CA8GK~g1hmzoY}uekv$7$~m%1jlqBz:Bn=K]{,F;3KSqZdLS8WCJCqtmynU0Pzkb;v%\"Sc,8t`ex=:~$ex{*++*uUkS{09^U\"M*fJV>W`KVKA(xo~l?y3L`+%.XtkP?`!!W0zQC8qqFc3_liQ8&9X#>=sG2<:_pK\"G,:Y)/v*fzxc%GSxFm?)5bAo)^,la$ms{Xz;$SqA9oLw+a~cc5D+c}Kk}VXn=5k_Q0Dk2?8&9M)f==7c9:_9qc7,:M)vUmG[Ig1ZmZqrz[$lqw}2#}=S.R$C8T@FblahmB\",:O)8r!kcco%=`k8/?YDbA)e/0g1hmK\"597L1J.e4tYP$mQ|rzdeWaQ)/0];[in\"m?,nr+u.EbYPhmq{x?$DZnT@/0v;;jlq%(j5>=$7|tt[eST\"k}/sXvU^Cc@;9qx&FdM)%UC.uQg1hm#\">?9ekvzflI];Djlqj?en>=D~oI}%WU*{k}j5%UU^icj%>UL|$9zs\"=[~c90DxUU\"Fdh)\"=RG~Hd%)K2\"=9qe.vS.<HH_$JL|b6,nB[;kK1rzGYI7N9*bCau.{ww[0yex=:~$ex=:l`b_3SzI0s*sDUd)CeealF0_.moLAvl7PbQvP^],t[+n.QD*YGI+i]}80D|Xoo=9]`bAeeNIlahmR|qz|$Nq$9.Lw+I78Q5_fSexk}3LD+RG2<:_9q&F,:M)@=H.jblaJE88m?5$NqBzQL\"=|kz,0D;Xy8&9o`vUC.R$bA2.rxC_jE88@?7nw+5kic+u=`Nqw}QLQvC.g:0D+UX|,:M)2JF]$~!rZmxF@?1$NqA9[5.v5kMcj%rc~8O}{bBJsG_f0D;Xk8O}gDkv:.!B$1&`>GgdY)*+8G:x3_XE/8!9N5Zn`@2~n%=`Nqw}P;&U[~Nb:_CHexk}}b}=D~F9TD,`Nqw}N52JH.#t0DUEQ8O}o`MA[~QfYPZm7o@?[$Nqw};`i+#~$>:_6S+G@?]`r+F]jI9;8U*{k}uB6U5kCcpD;Xs{<90bbA.e$~!rhm]{u(W;CAK]Gfs;SE/8O}o`,+mGsIg1hm;|Y}b$Nqw}b`8rC.k00D.SZq,:M)BJ;~_?F;7S&{>?t;hWT@G0m%)S`qk}gXYvJ^ccm;;XL|A9M)CAv):,:_[Xl{h3G$Ed:.XVoXMoCb}Ns_&K4*&<H8;km>C8;k,x09V#)Qkf6fy[^45CUu/S&}H.87b_@Jx,ru}L`{g}PtC8}pFSQ_jE@+,:D$u8Z9,nr+kfEIla$mu8s??e/v%.&,n%%qA|59ueQvA7Kt@%MJ88@?cXhW`@0?s;=`Sqj?*b}=A7\"0>%6SMIk}8;e+U^FcpD(2A8/?{bn=8G`I0D(2v{,:$)>=[~/H$_DXpoez##bA=7$~YP>s38>?|$wqj?Ibf=D~%x+u%qWoqzGnTJT@yQv;=`qq^?*bCAGeX~9;fKOBk}rB@=U^>KCD=`qq+zdbMA$7{,!D2HOBk}oLe+U^Zc5DCHy8&9M)OJo)#tp_)K_G,:w)*+2./HH_$Jh\"u(##1JF]H~YP$mD{!9b$Fqj?c#MA%.GfrupKc==:fAn%?pN95DjXe{ZI13h=tPm>C8;km>C8w4|\"]?,S&}H.{?S;h2;0.(+o[.0./NM_7erxJ1#X`{x0[:eaB2rxpDrBd7,:a$Q||9kLViqq#t:_#X/8/:O)YvmGkH|_GS3|qz}nr+,7G0g1Zm`{59[$qq+z,s}=K]5bC_xU?8O}2XxU(f\"H3_)Km\">?1$Nq%(x;vUJ^icc%WUk8&98BYvC.#t:_|XU\",:O);vee~H|_8czo59}nr+<7}QYP$mh\"@?1$lq^?N5f=D~X~];=`lqw}<s>=D~X~];=`lqw}<s>=$7|tF;iHMIk}^~>vT@4t2D=`sqj?Mnr+n)Xtg1ZmA8tz[$qq^?*bCAGeX~9;fKOBk}rB@=U^>KCD=`SqA9#`n=jGxxv;liexI}U#q+U^>K$_HH38&9O)f==7#tC_#i2\":0*9\"%I2;09bPc8X0(ztyv<%(>C8;km>C8A3__3(D`[=\"~!;o2pKvCxthXUJDf>+E@e<Bt}%7SO\"TyG$!!W0zQC8|kPxCD2jNqGz.L]U|kicn;rc3|A9X#CA2.D90D?qa||9/n&U.ezI0D4Hv{FdO)4veePxd%DX`{x?0br+.eDI!rxsl{VdY)`+#~:x5DZm3|ezQ`r+<7Sb}%%q&{]?x;hWT@0?2DNid7k}QLYvU^ic};zq?8L?zsf=#~oCH_%q6lGzqe`+g7SP0D2H||Fdh)>=xGzx$_)Ks{qz,nkvK]<0!r>sK\"m?,n;vQ)^,!rhmU\"Y}>;hWT@(Qx;iHexk}K#*+C.#t0Dk2L|,:O)OJxGAHH_$JL|,:O)kv(f@H|_)Ky8:($ar+u.<H$_8cIoqzSDbAF]2~g1$mL|h3G$Ed:.XVoXS`U0iDsi\"K4*&<H8;km>C8;k,x09V#)Qkf6fy[^45CUu/S&}H.87b_@Jq92DyL||rzPtC8}pFSQ_jE@+,:D$u8Z9,nr+[~*xd%SHKKqzQ`r+2.SbC_jE88g}[5CAK]8Qs;3K?8O}8B*+ee(H|_#iN{s?}ntv[~30YPZmQ|ez#$sq+zS#\"=A7F9];I2MIk}.n;vU^ccm;8UQ8L?2Xw+eeg::_xU>G,:$)/v(f3~:_#XL|,:S#r+M]zx5Dhmoo=9}nWaQ)7,Wmdqd7K~151JsGQfg1>shK@?{eCAT@I,t[dqiqw}dbpAmGk0}%jE&{.zpL>=$7F99;I2d7k}S#6UJ^wc$_iHlNk}*b}=S.Gf@%jEvq>?)L_=K]X~!DCHQ8&9{b&U>G#t:_[XO\",:O)n=mG(H|_8cD{]?]`1J<7Btv;qEvqqzt;q+i]Gf2D?q||w}GLw+8G9x|_GS~8u(,n1J(fH~T*?`Ed:.XVoXt.Sbp_HE\"K4*&<H8;km>C8;k,x09V#)Qkf6fy[^45CUu/S&}H.87b_@JF`9;dLlq59PtC8}pFSQ_jEBK,:{eCAD~,C|_}qX|@?]`1JH.g9s;dq&{u(i#C8T@Qf!D|iT\"k}Gnl+i]Gf@%;Xa||92Xq+.eR$bA#~O~s;UH&{x?ks/&T@T0C_1jZq%(v`8rI7GfC_|i*{k}6n`+!kCc^%+Uv{FdY)YvmG:x|_}q9F>?151JxGJblahm9F=9:e/vQ)ffrujEA|@?*b_=D~8QTDpKexk}i#XvmGc9:_iHg7,:O),+>G<H|_z2||>?]`bA[~9,t[dqvqrzW;C8T@UtTD3KE7k}6L%U|kicpD?q;||98B`+v)R$tvV]jbt[7Sn\"m?:BC8T@f0];?q`qk}P;.vU^Cc>;pK.|,:>fq+)e(H$_XE.|=9}n4vjGTfg1$ml{!9D$sqk}N5hWQ@Qf@%%qJ7ezenhWT@Xt2D&`lq$9L5CAK]oI5_?qMIk}<sf=J^CcK;[X2\",:M)Yv<7DIYPhmzoqz+;/&T@309;1jNq^?/s.v5kccn;;X;|w}zs9UmG%x3_#i~8tzQ`tv=7nfK%%qA|>?kbhWT@5It[k2MIk}?bn=J^Cco%*q.|,:w)BJF]\"H3_$J%Fu(b$sqw}1`>=K]F9];pKy8L?o``+>GR$tvsG%xru`nOBreY~eam\"5,9NePw\"1}IeK>=:~$ex=::c]@iFA8.(+o[.8G4b:@P\"S{09^Ux}Of#IQvxG%,x;ZN`xz7=t;%|kw94_GSx&qz$abA(f(QlaZmv{<9|$qqBzt;8r!GF9ru(2}Kk}.Lq+5kic+u;X~8Wz/n>==7zI0Dtc6{,:]n1J[~{xj%z2=om?}n4vjG8?!rhm`{s?c#C8T@4tTDWcexk}wX,+n)/t:_NX:o,:O)CAkf%xH_GS;|=9]`1Ju.BtrujEUK59IbD+i]GfC_WUQ8&9X#Lv.e/t0DJENq,:w)e+u.*x3_DXe{]?#$Nq+zZDQv5kCc};+c\"G,:O)e+u.zx3_z2||Y};$lqBztBD+Y^PxCD2jsq$9ue.v%.AHd%z23|j?{bf=S.>Q8z1jM7gdM)4v>G2~g1hmSqezdekvS.Z95_;jlq^?=s\"=D~oIn%fKT\"k}oLD+S^Fc$_I2a|+z2X;vsGB~0D[X=oFd$D1JmG\"Hj%SH`{<90b/vK]I,T*?`Ed:.XVoXI7<0@%UE\"K4*&<H8;km>C8;k,x09V#)Qkf6fy[^45CUu/S&}H.87b_@J7I>%}L.8@?PtC8}pFSQ_jEMI,::e.vD~*,YPhmdoY}*bZnT@#f];qE&{Y}P;6UM^ic>;|X3|w}o`\"=0.jbg1hm`{!9:ekvK]Cbn%fKT\"k}fnMAU^Cc|_SEK\"Fd>fQv[~{x|_XEzoez,nQvGe0?!r>s3|rzyeCAQ@_QK%%qsqA9GnhWT@1ft[.Sexk}OX]Uo)#t0DCH*F,:O)>=RG~HH_XE/8tz$abA;~>?g1hm||rzN$lqGzZD_=$7F9TDxUd7k}Gnl+U^Mc+uzqA8L?/nQvC.oCCDZJ@+k})nl+xG$>0D+c?8s?}nr+xGjbYPhmwqm?N$sqA9uBpAT@2~p_A`qq|9b`MAA7xxruA`iqj?b`CAjGoIm%|XexI}S#_=U^ZcCD!ik87zo`YvxG~f:_*2a|,:$DbA(f@H5Dhmg7u($aQv%.kQg1xsiq59RS8WCJCqtmynvxNIyt^v+\"Sc,8t`ex=:~$ex{*++*uUkS{09^U\"M*fJV>W`KVKA(xo~l?y(b8rGe<0kP?`!!W0zQC8qqrx$_jEd7FdO)_=0.Pxd%#iy8XzQ`bA0.Px3_8cs{ez:ekvzfHt!rhm38<9kbpAT@qI5_=`lqGzfnMAA7oIF;6KMIk}tBYvJ^Fc};(qk8Z9{b.vsG`I0Dk23|,:Z)}=$7F9ru2Hd7k}uBl+U^Zc|_xUk8Wz8BD+.e#t5_%q:ohd:e2J)7F9s;xUT\"k}i#xU|kMcj%rcX|j?o`w+xG_f0D;X;|GzGLMA5kCco%iHlqFdM)@==7],lahm>GY}0e/vjG*,m%QX88=9pLZnT@2~p_A`qqBzIbhW`@DIK%=`wqBz)Lf=Q)\"0C_|i!0=98B}=S^/0:_?q2\":0*9\"%I2;09bR_Vqrz}tyv<%(>C8;km>C8A3__3(D`[=\"~!;o2pKvCxthXUJDf>+E@e<t?n%ZJs{`yG$!!W0zQC8|kPxCD2jsqGzK#D+g7X~TD+Uk|k}`LEA5kgcm;liL|%(}nEAK]5bv;2Hexk}oL_=(f#t0D+Uc7,:O)Wa(fk0:_TKa|,:w)f=RGLBZPxsy8m?[$ZqA9[5}=A7#tf9ZmxF>?0e.vGe8?>%,SUK@?YXpA`@tQ9;A`wqA9N5TJ`@f0@%jEvqrzen\"=K]Gf5_+c/8&9gD`+>G#t:_#X%F,:w)EAee/HH_}q~859SDr+v)kHd%}qA8]?rsr+#~?QYPxsm\"59N$e{k}j5n=D~ccCDHHc==:fAn%?pN9n;liNqNI13h=tPm>C8;km>C8w4|\"]?,S&}H.{?S;h2;0.(+o[.0./NM_U.V~J1*2N{x0[:eaB2rxpDLS88x?+;C8T@Fbp_)S!0I}&sXv|kicr[5i!0@?##TJ|k(H$_%qk|,:b$Nq%(gXkv|kCcn;Pc{F,:O)n=v)/t0D6K}G,:Y)kvH.:xH_}qOK59}n1JF]I,!rhmq{u([52oT@9xv;,`lqBzPB`+g75b5_;XMIk}L5i+!kCcn;3Kqq,:M);vV]%x|_$Jy8.z]`bA,7w9ru%q&{:(|$lq$9F#l+!G5b];;Xd7k};`>=!kMcr[zq?8Z9D5BJ(f3~:_(2a|,:h)]UF]<H$_)KO\"rz,n1J(f}QYP>s8X59YDtvH.Y~g1JEJ7=9:eLvQ)/0];ZJJ7qz:e.vGe*,!D?2UK@?oLhW`@Ix!DDjy8k}\"s}=S.xxn%CHxl$9gD/veek00D;XiqZdjS8WCJCqtmynU0/\">;CA%\"Sc,8t`ex=:~$ex{*++*uUkS{09^U\"M*fJV>W`KVKA(xo~l?ytBi+%.{xkP?`!!W0zQC8qqrx$_$Je{qzQ`bAsGQfK%,SJ7=90e.vA7dxj%XEK\"m?Q`tv<7jIK%%q88>?t;hWT@f0n%rc!0k}ZD6UJ^icH_iH~8N9o`vUC.#t:_tcdo,:w)*+RGc90DJE%F,:w)&U.eAH^%GSpo@?SDr+8G\"Qg1hmR|u(b$lqBzuBCAD~8Q];*q!0k}QLf=J^Fc^%NX/8/?0bbA;~mt!rZm;|ez}eQv%.QfC_,S&{>?7nZn`@8?s;=`~8&9GL6U=7`I:_xUk8/:g)4v=7AHj%}q`{ezrsr+#~*,g1JEJ7ez[$qqBz<s_=jG|tp_|i}Kk}.nD+U^>KCD#X38&9O),+v)#tC_z23|h3G$Ed:.XVoXQQ3fC#k2\"K4*&<H8;km>C8;k,x09V#)Qkf6fy[^45CUu/S&}H.87b_@J00v;?Ll{m?PtC8}pFSQ_jE[dk}r;\"=!kcco%HHA8N9GLn=|kMc^%+UA8Z9GL6U.e_f0D=`Nq|9)nn=!kCcm;WU=o,:M)l+xG\"Qlahm^orz5$NqBzH#.v|kcc$_8U38O}X#w+,7*xH_}qiq59]`r+n)T0K%QX&{m?*bhWT@Ut!DNXlNk}#5Xv_2`Ig1[jqqBz}bl+I78Qs;ov`\"k}6L`+5kicj%|X3|^?zs.vu.D9:_rcy8Vd$),+2.dx^%}q3|,:O)9UC.~H$_#iy8m?SDbAM]@Ho%DXq{<9kLtv<7<H+uDX/8O}8B2J<7@H3_8cx&Y}D$lq+zC#}=D~GfK%zqMIk}&sXvU^ccj%>Uy8O}GL.vsG~H3_z2L|@?N$lq|9W;pAT@I,TD,`lqBz{B_=A7xx}%pKc==:fAn%?pN9n;3KqqY}13h=tPm>C8;km>C8w4|\"]?,S&}H.{?S;h2;0.(+o[.0./NM_7eqbJ1rc`{x0[:eaB2rx3_QX!0K~0b1J:.lI!rZm(Gu(deLvGe{xn%RHvqrz\"bhWQ@~0@%A`Zq^??e/vjGjbru%qWo>?H#ZnT@4t!D,`sqBzkb}=jG\"0!D6K.Qk}7nOJU^Ccc%TKa|,:M)f=kf/0g1hm9Fqz5$lqGz{BMAA7X~t[8UMIk}kb;vU^CcK;(2oo,:M)6U=7,,g1hm0G>?5$lq+zl5>=A7oIs;k2MIk}(bQvJ^ccH_UE.8&98B8reec9:_)S6{/:w)l+M]@Ho%DXQ8N92X_=)ezI0DeS38Vdh)2J;~{xc%z2`{s?CXr+n)Ltla>UA|qzde2JT@EI}%QX&{!9%BZnT@Htx;A`iq+z<sCAGeF99;WUexI}Gn_=J^>K5Dk2m\":0*9\"%I2;0}tCH6{l9?tyv<%(>C8;km>C8A3__3(D`[=\"~!;o2pKvCxthXUJDf>+E@e<f0}%1XO\"TyG$!!W0zQC8qqicr[|i/8O}D5Xvee/t0D+UL|,:M)Lv<7dxd%QXexk}uB@=5kFc|_li/8O}GL6U.eD90DWcL|,:b$)o~9rs!^A7,CH_z2\"Gu(q#1JC.=,YP$m`{>?yeWaGe,,];UH*{m?xvpAwwB>T^k2oC8be+NGJzkBoXRpa#Nr9`ex=:~$|8\"~JIi8`KVKA(lRAl;*|#b@Ni+X:9L1n7rz^~}=kfy05r@YqN89]`d;qqic};JE?8&9X#q+v)/t:_zq#\",:O);vn)*x$_XEK\"m?SDbA5kcco%*qk8Z9/n@=5kwcd%I2A8L?2XMA[~s`:_NX/8EzGLMA5kFc@;NiA8Z9o`xU<73~:_JEe{,:h)f=.e%xc%$J!\"m?LXr+2.<H$_GSqq=9,nr+n)Z9g1$m~8.zYDr+<77,YPxsB\"qzueXvK]f0];qEUKu(\"bMAK]GfruI2a|A9D58rRG#t0D3K>GFdw);v;~GHH_GSdo=9Q`r+,7<H3_8cB\"ez0e/v%.<H|_z2||m?0bbAU^cc^%xUa|w}8BD+mG@H3_8cB\"ez0e/v%.*xt[dqvqrz!5ZnT@lIv;[jsqj?>;_=K]GfruSE||w}zsWa:.AH|_SH38<9,nbA*f>?YPZmA8rz:e.vjGDI!Ddq88u(0e/vK]x7x;dq88u(0e/vK]x7x;1Xn\"Y}9e.vA7DIF;dqA|qzYXpAT@EIs;;jlqj?0Bn=D~8Q9;!i*{k}%Bf=S^Fcc%5iO\":0*9\"%I2;0}tmx9Grz@tyv<%(>C8;km>C8A3__3(D`[=\"~!;o2pKvCxthXUJDf>+E@e<*xru1X*FTyG$!!W0zQC8qqicr[*qQ8Wz2XMAU^icpD2HQ8&9g)D+2.`I0DWcL|,:b`1J.eoC|_8c!\"m?SDtvee,C|_}q\"G=9YDr+sG5IYPhm38@?IbpA`@Qfv;A`Nq^?x;}=S^>Kj%iH~8O}gDCAM]AH3_8cs{]?[$Nq+zPBEAS^icm;tcQ8O}2XXvn)k0:_pK_G,:M)`+<7*,YPhmx&Y}FXC8T@?Q}%3K*{k}K#*+!kicpD|i.||9zsf=#~R$1J>Gu?F;qE&{x?%Bq+i]X~m%!i||A98B@=H./t:_;X^oFdw)6UeeIx3_8cqq=9?e.v$7tQ>%%qvqqz~nhW`@HtC_<`sqj?\"sCA%.5b5_zqc==:fAn%?pN9CDNX`&qz13h=tPm>C8;km>C8w4|\"]?,S&}H.{?S;h2;0.(+o[.0./NM_&7jIXP4Hv{x0[:eaB2rx3_`q(Ggdg);vV]dx$_SH~8]?7Lr+)ecbla$me{<9ue/v|k@H3_)KX|w}gD>=D~5bF;qEvqrzYDpA|kcc>;bjNq%(5$Sq+z:e/vzf*xm;ZJxlA9%e.vh^^NrtND|v:.=t;&sn/?9%:nDq5+0$ex=:~$ex{*++*uUkS{09^U\"M*fJV>W`KVKA(xo~l?y:Be+$7f0kP?`!!W0zQC8qqicH_SEk8Z9zse+(fR$bAC.sb!r$mq{]?dekvS.dxc%z23|FdM)}=o)%x|_GS}G@?Q`bA[~T0lahmrF>?{e/vK]V~ruQX&{.zTLpAT@%xx;&`sq$9{B_=D~\"0TD?qMIk}FXw+U^McH_>Uy8Z9gD8rRGk0:_pKx&FdM)n=0.jbYPZmN{:(:ekvzfx7TD[jiq+z,s}=A7oIx;iHZxk}gX`+2.$>:_5ik8u(,nbAv);fYPhmoorzksTJT@Lt!D;jlq^?x;\"=K]Gf];|X||w}gD4veeAH|_SHy8s?Q`1JsGdxF;1XJ7Y}+BpAT@/0F;,`qq^?:B@=D~|t];\"2.Qk}C#.vJ^Ccm;fS%F,:$)q+2.dx3_GSxFm?]`r+M]T0}%jEn\"qzc#q+a~X~5_iHexk}As_=,7g::_)Sx&,:M)6U[~jb!rhmN{@?0BC8T@@0F;(2!0k}9b8r!kCc};k2>G,:O)YvxG:x3_z2q{@?)L>v&SZ9Q_)KX|$9gD/&T@\"QYP>s~8Z9,nkvk\"3~n?TL?&@0QLf=1)Q0A_N?f>5r9`ex=::c]@iFA8.(+o[.8G4b:@P\"S{09^Ux}Of#I]UmGi9C_wN`xz7=t;%|krx$_QX@+k}rB@=5kcco%CHexk}rB@=5kcco%CHex,:_I)+Y^Px$_cjSqZd>%$WT@FbYPhm>GFdO)8rS^Cco%;jQ|A9ce9U8~5brujEJ7>?}nbAv)R$tv:.D9la(2`\"h3G$Ed:.XVoXX.3Q2D/P&K4*&<H8;km>C8;k,x09V#)Qkf6fy[^45CUu/S&}H.87b_@Jq9@%yLK\"Y}PtC8}pFSQ_jE4Ak}QLkv5kic>;3KA8/?8B}=8Gg::_fS2\",:N$^ohdb$3|j?q#(^K]oIK%?qy8O}D5EAxG(H3_)K7o591$lqw}a`\"=D~oIn%fK!0k}W;/vJ^Ccn;?q7o,:M)q+*fCbg1hmsq>?D$lq|9gX_=D~5b5_zq!0k}oLw+S^Cco%*2A8/:M)q+*fCbg1hm3|>?}ntv(fqIg1hms{Xz;$lq%(uBf=D~GfC_I2!0k}W;/vJ^icj%*2~8&9D5>==7c90DNXFq,:O)9U;~#B$1&`g7x9YDC8J^:x|_)K~8Xz15tvu.3flahm3|>?,ntvF]tQlahm3|>?,ntvF]tQ!rZm_G=9:e.vjG*,K%jE88x?W;CAK]8Qp_|XA8&9GLi+u.#t:_(q||,:w)9U;~kHH_GSv{!9]`tvsGx7t[qEvq=9_Bw+a~\"0t[6S*{k}9b8r!kic+utcR|A98B&U>Gw{5r*|Xv;*H_Lv1)&,3:=R$|nW~$ex=:~$.Q3)/N}%lF0_.mP;G=T.=t([nB=zPmlS6+A9P;GJ:.Cb>tHa?&~.a$c7s9$a2o|k%xH_DX/8L?D5hWT@*,laZm;|w}{bl+g7{,YPZm3|,:h)l+Y^(Hm;2jlq%(|$qq+z0eQvzf9xj%DX||+z}n,+Y^(HCDrB88:(.LMAA7\"0s;WUexk}YXkv<7k0:_|i}G,:w)MAU^Mcr[|i/8O}X#`+,7~H3_8cL|59N$NqBz`LLvU^icm;SE/8&9gDe+#~k0:_iHg7,:O)MARGGHH_}qooqz$abAxGz,g1ZmO\"m?[$Sq^?~nn=GeoI5_;Xc==:fAn%?pN9|_mX#\"&I13h=tPm>C8;km>C8w4|\"]?,S&}H.{?S;h2;0.(+o[.0./NM_U.~0XP*2N{x0[:eaB2rx3_QX!0K~,nbA0.4tlahm8XqzueQvzfK~}%MJ&{x?deLvzfH~C_RH&{g}>;pAT@9x>%=`lq+z.L_=$7|tru3Kd7k}9b_=U^Mcj%*q?8/?8B%UC.k00D[XIo,:w).vV]/Hd%#irF=9##tvH.(Hj%$J!\"m?kLtveeoCCDdq@+k}8;Yvn)$>:_SE(Gu(]`r+2._?s;qE88<9=sw+a~F92D+U*{k}>;@=5kicr[6SX|A98B9Un)D90DPcX|$9zs/vxG2<0DPcB\"Fdh)9U.e/t:_>U^oFdM)WaxGIx|_XEQ|@?Q`bA0.qb!rZm]{<99e/vzfnf>%jEvqrz#`n=K]X~2DfK.8&9gD`+<7#t:_.S`{/:w)kv;~<H|_8cpoqz]`bA#~Ixv;qE88s?*be+i]5b!DCE||w}8BLv<7%x|_8ciqez,n1J<7|flahm~8=9ue/vGez,@%MJ&{rz)nTJT@9,F;<`SqGzks}=jGX~2D5ic==:fAn%?pN9n;liNqZI13h=tPm>C8;km>C8w4|\"]?,S&}H.{?S;h2;0.(+o[.0./NM_7e?QXPk2e{x0[:eaB2rx3_?C#!A9X#q+(f/t0DWcqqFdO);vV]Ix|_}q(GrzYD1JH.dxH_GSxFm?0b1J[~jblahm9Fu({eQvS.+?!rZmL|@?{eLv%.*,la$miq59ye/vS.4~n%%qJ7qz=spAT@30n%<`lq$9QL@=$7X~2D=`sq+z,s}=K]5b9;fS~8O}GL}=sGGH3_)KrF@?#$Nq+z!5_=S^icr[eSy8&9gDe+<7$>0DNX`{rz]`r+n)Q0YPhmO\">?)LC8T@yQru1jlq^?[`8ri]5bK%|X38&9gDl+RGc9:_eS>G,:w)w+RG/H^%}qg7=9)5tvee(Qg1>sa|>?b$Nq+zN5MAK]X~5_li/8&9{bl+mG#t:_xUL|,:O)f=RG<H|_8cL|,:M)\"=V]\"QYPhm0G@?9b/&T@:x2Ddqn\"rzK#/&T@|f2D;jlq%(~n8ri]X~@%li.|w}GL_=0.Ix|_$JOK@?,ntv(fqIlahmq{tzue/vzf?QK%%qvq59cXpAT@SbK%=`qq|9_BMA$7|tt[fK.Qk},sf=S^Mcj%*qm\":0*9\"%I2;0}ttcFqPz@tyv<%(>C8;km>C8A3__3(D`[=\"~!;o2pKvCxthXUJDf>+E@e<[IC_?2x&TyG$!!W0zQC8|kPx>;dq&{x?L5/&T@*,6L1Xn\"=9pL/&T@.0}%Djsq|9#5q+a~{,C_)ST\"k}[$qq+z,s}=K]8Qn%HH~8Z9/n}=sGk00D+U9F,:g)OJU^wc^%NX/8Wzo`Xvee)CCD3qA|ez:BTJT@2tTD=`qq%(*sZn`@Ebt[&`Fq+zN5pAQ@*,!rhms{ezIshWT@cbC_>U!0k}+;_=U^icj%6Sy8N9X#4v:.k00DHE`{,:M)Xvu.yQYPhm{Fm?&s/&T@*,x;dqJ7m?4X/&T@cbK%Djsqw}3LWak\"3~n?TL?&@0|Ln=:.f0A_N?f>5r9`ex=::c]@iFA8.(+o[.8G4b:@P\"S{09^Ux}Of#I`+(fR~5_hN`xz7=t;%|kw9Q_MJA|=9TLhWT@1fm%li.Qk}7nf=U^ccm;=`wqw}*b}=K]{,5_eS.8O}GLWa=7\"H|_XE?8u(}n1Jo)&,g1hm^orz5$sqw}/s@=D~Gfruli!0k}F#>=J^Fc>;)S?8N9GLf=,7:,0DHE`{,:Y)6U(fBBZPA`Q||9,n(^T@0Qt[bjlqGz!5`+I7GfK%I2E7k};`D+!G|tF;iHk|k}N5C8T@;fs;1jNq%(c#9U|kic@;)S||A92X_=#~g:0DCH;|Fdw)n=xGPxH_$J!\"ez0btvxG4~!r$m||m?ue;vS.H~n%viWom?}eXvS.x7ru`nOBreY~eam\"[,K%MHD&1}IeK>=:~$ex=::c]@iFA8.(+o[.8G4b:@P\"S{09^Ux}Of#IMA0.Z`C_wN`xz7=t;%|kw9Q_}q3|,:Y)xU.eR$bA=7dx$_$JL|,:a$)ohd1$sqZduI>vF]EC5DcX&{<9TLhWT@2~K%>UlNk}t;xUJ^Cc>;.SA8/:>f@=U^Cc^%%qn\">?L5hWT@ff!D)Sk8&9{bxU.e$>:_Ni.|@?D$sqj?Q`bAmG&,>%%q&{u(0BhWT@H~m%!i~8&9/n8rv)$>:_(2wqez#$sq^?~nn=K]|t>%!i?8O}zsxU;~<H3_XEv{qzm5/&T@V~v;1jNqw}t;i+kfg::_[XOKFdM)/vu.7,!rZmc7>?9ekvK]kQv;A`Sqw}#`@=K]xxt[Ni&F,:Z),+u.AH3_XEq{ez/sB[;kK1rzGYI7<\"~tErsG{ww[0yex=:~$ex=:l`b_3SzI0s*sDUd)CeealF0_.moLAvl7FD\"=_^lITD+n.QD*YGI+i]SP0D;Xs{/:M)vU=7sI!rZm3|>?}nr+2.DIlaZmxFm?$ar+#~*,!rhmK\"rz_BC8T@.0C_Ni!0k}N5`+a~xx}%zq!0k}YXw+5kic^%|X!0k}kbXv5kico%HH/8&9zs.v:./t:_HE;|,:Y)4vu.9xd%z2~|m?seD+Y^%xCD2jNqj?ZDq+S^ic};5i.|A9o`kvo)k00D*q%FFdO)}=jGF9s;DjNq|9:BD+U^CcK;;Xe{FdM)}=:.kQg1hmK\"@?:ekvQ)8?s;Djsq^?[`n=K]X~@%NX;||9/nq+[~$>:_iHK\"m?0bbAu.XtYPhm||rzN5hW`@2~9;iFQxM7M~W@P\"yf$:\"2wq+0MOdQnkm>C8;km>ArnBbojrhXUJDf,pb@?pII0s*sPaI~^dtJ[~1BCDTK<\"=:LVQ&r~R$s_T@4~ruCH.Qk}N`e+S^Cc^%!iK\",:>fe+,7\"HH_$J!\"m?}n.vS.<H3_z2+Gqz5$lq+zP;f=K]X~9;+cQ8&9GLvUo)#t0DUEu8/:Y);v;~GH|_$JZqez$ar+,74tg1hmk8tzN$sqBztBCAjGF9K%!i.Qk}Ibf=|kicc%!i||j?zs.v;~D9:_4H6{Vd]n1JH.zxn;dq)ohd:e2J)78Qs;Djk8N98B@=U^:x};ZJc==:fAn%?pN93#LxR{j\"13h=tPm>C8;km>C8w4|\"]?,S&}H.{?S;h2;0.(+o[.0./NM_`)9,XP.S6{x0[:eaB2rx3_sS#!A9X#Lvu.D9:_|XX|FdY);v(f2<0D;X~|FdN$)ohd:eOJM^Ccr[[jNq$90e/vzf~H3_z2||$9,nx@J^Z9L_)Kx&u(Q`1JH.K~n%MJ&{:(6LhWT@zxm%zqOBFd=~iAD~w{5r*|Xv;*H_4vb)Tf^0=R$|nW~$ex=:~$.Q3)/N}%lF0_.mP;G=T.=t([nB=zPmlS6+j?2#FnsGib>tHa?&~.a$c7X?GLq+8GR$bA*fV~K%%qNq+zZD2oT@jbC_=`.|k}P;w+!Gxxn%CHexk}<sWamGR$tvo)2~n%%qA|m?j5C8T@O~x;[XMIk}6L2J|kCcK;8U2\",:O)8r=79x3_z238tz#$qqBzdbe+a~F9F;2HlNk}#`/v|kcc3_6SE7k}&sYv|kic5D3Ka|j?X#}=!kCcj%Wc6{Fd5$NqZd$_$WT@Kt@%xUZxk}cXxUu.#t:_+U~|FdM)`+0.30YPZm9F>?{ekvGe],ruDjlqA90B}=K]\"0n%>UX||9gD]UU^Cc^%UE.8VdY)q+;~/H3_#is{g}de/vD~u?9;qEn\"m?(b>=A7F9n%!iZxk}en*+C.c90DrcD{VdM)]UxG5Ig1Zmc7u(uekvQ)Ut@%;jqqw}FXCAK]8Q];HH||j?o`>=#~k0:_4Hlqh3G$Ed:.XVoXS`nf2DSE\"K4*&<H8;km>C8;k,x09V#)Qkf6fy[^45CUu/S&}H.87b_@J7Is;9L;|@?PtC8}pFSQ_jEMI,:Z_$WT@;fp_\"2exk}t;,+.e#t0D)SOK,:O)Xv<7GHH_$JQ|u($abA[~7,g1hm]{>?b$lqw}/s\"=A7xxC_(qMIk}cXLvJ^FcpD6Ky8Z9{bvUJ^Cc^%Nis{/:M)l+C.Rtg1hm]{m?|$lqw}F#_=D~{,x;*q!0k}l5YvJ^ccCD+cy8N9X#MA)e`I:_.S&F,:g)]U.eB~:_WcD{/:$)Lv(f\"H3_)KX|w}gD>=D~5bF;qEvqrzYDpA|kCcn;*2.|FdM)\"=o)^,!rhm0Grz#5hWT@HtF;iH!0k}tBLvJ^icCD=`Sq^?=sMAjGF9ru4HexI}4#OJU^>K+u6S.8&9w)@=ee#t>%#i2\":0*9\"%I2;0}tHE{Frz}tyv<%(>C8;km>C8A3__3(D`[=\"~!;o2pKvCxthXUJDf>+E@e<+?K%[iiqTyG$!!W0zQC8qqk0:_+c*F,:O)xUo)/Hd%SH38ez$atvC.(Ho%8cL|,:{ekv%.dxru,`Nq$9fnLvU^ic$_;Xexk}`L>==7#t0DlihK,:O)CA:.kHd%)K3|qz$ar+RG0QYP$mx&m?|$sqBz8;f=S.|t@%xUMIk}K#`+u2#t!r1j3||9Mntvo)KtYPhm{F=9!52oT@}Q5_Djlq$9\"s,+g78Qs;Dj?8O}zsCA8G$>0D|i!\"m?}nr+xG$~YPhm)o59[$sqA9wX@=D~|t2D=`lq%(55>=K]8Qs;=`lq%(55>=K]8Qs;=`qq%(55>=K]8Qs;}L)|$9d!r+V]Z9YPZm6{Xz5$iq^?db>=A7\"0ruTKexVdLS8WCJCqtmynU00(L5}=+\"Sc,8t`ex=:~$ex{*++*uUkS{09^U\"M*fJV>W`KVKA(xo~l?y7n,+jG4tkP?`!!W0zQC8&S>?ZPhmiqqz~n/&`@&,}%[jlq%(3LD+}f5b5_(2$Q,:#5x@A7k0f9hmSqY}F#TJT@w9t[&`Nq^?[`8rU^FcpD6Ky8&9gD@=U^gco%CHexk}KXq+n)#t0DWcR|,:M)}=,7|fYPZmxFez]`r+kfEI9;ZJvqY})LC8T@Z9t[!iZxk}6nLv>GR$r+C.7,x;dq88x?[5C8T@30v;k2T\"k}<s`+YwB>T^k2oC8baiKKez#`oXRpa#Nr9`ex=:~$|8\"~JIi8`KVKA(lRAl;*|#b@Ni+X:9L1Aqu(]~/vV]y05r@YqN89]`(^A7\"0K%*qMIk}tBf=J^Fcc%Ni/8N9zsl+.eB~:_li/8Z9GL6U.e$>:_\"2qqez]`tvH.sbt[dqUK59r;C8T@lIx;PcT\"k}.n4v|kCcc%.Sm\"Fdw)}=RG*x3_SH~|59ue;vK]0Qn%jEJ7@?PBn=%.{,TDtcZxk}en2J<7v{Us1X]vk}\"bi+U^icr[HEQ8Ezzsw+=7k00DWc!0@?0bB[;kK1rzGYI7gIFXWan){ww[0yex=:~$ex=:l`b_3SzI0s*sDUd)CeealF0_.moLAvl7Pb@=_^,,v;+n.QD*YGI+i]g:la`v$xk}_BMA;~R$r+C.9,!DqE&{tzzbe+i]5b9;JE3|A9X#q+(f/t:_#X/8VdM)&U;~jI!rhmK\"59*bpAT@4~x;A`lq|955MAD~5b5_zq!0k}0B&UU^Cco%*2A8/:M)\"=mGkQg1hm3|>?}ntv=7\"Qg1hms{Xz;$lqBz+;>=D~5bTDfS!0k}6nOJJ^ic+uNiA8&92X/v>Gc90DNXFq,:g)YvmGkH|_)K{Fm?}nr+u.*,g1Zm8Xm?5$sqw})n_=%.D9lahmiqm?9e;vK]QfC_,SWo@?ksZn`@nfTD<`wq+zN5pAQ@*,Wmhmiq59ye/v$7Ixv;3qn\"rzde/vD~*,>%QXA|>?QLZnT@[Ix;&`qqBz}b}=$7F9];6Sc==:fAn%?pN9Z:6Kiqrz13h=tPm>C8;km>C8w4|\"]?,S&}H.{?S;h2;0.(+o[.0./NM_LGcbJ18Ul{x0[:eaB2rx3_%qd7K~Q`bAkfR$1J>G#t0DPcexk}TLTJ|kPx3_XEN{qzL5C8T@(Qx;iHexk}}bxU.e/t0Dk2L|,:M),+2.dxH_$JL|+.Q`bAo)^,!rZmK\"m?YD2oJ^kHd%viBKh3Xew+p)/tla1j3|A9}nZnwwB>T^k2oC8baiWW]?+%nXRpa#Nr9`ex=:~$|8\"~JIi8`KVKA(lRAl;*|#b@Ni+X:9L1n7u(^~D+*fy05r@YqN89]`/&|k\"H|_&`\"Gx9YDbA<7{x3_SHD{=9ye;vK]z,!rZms{59yeXvGef0@%jEUKqz7nCAK]8Qt[*q?8O}zs6U;~(H3_8cq{<91$lqj?IbpAT@4tn%=`lq+z[5}=D~X~2D9q!0k}[`}=U^ico%?qy8/?GLEA.ec9:_NXe{h3G$Ed:.XVoXzofQ^0WU\"K4*&<H8;km>C8;k,x09V#)Qkf6fy[^45CUu/S&}H.87b_@J|~];?LQ|=9PtC8}pFSQ_jE!0,:{e.vGef0@%%qA|rzN5(^$75bs;PcMIk}+;CAS.|tn%<`iq%(6nf=D~Cc};+c!0I}8;@=5k?H$_jEE7,:w)Xvee:,0D*q38&9/n2J.e#t:_fKL|,:w)e+<7GHH_}q*F=9SD1JH.<H$_DXN{s?]`bAC.Z99;qEA|m?0B,+a~|t}%5i*{k}]n4v5kicm;.Sa|A9GLvUmG/t:_zq_GFdO)xU*fIxH_8c`{tz0b1J.ebI!r$msqm?de;vD~sb5_`nOBreY~eam\"/?|:sxa&1}IeK>=:~$ex=::c]@iFA8.(+o[.8G4b:@P\"S{09^Ux}Of#IMA)epI>%gN`xz7=t;%|krxH_%q#!|98BMA<7zI:_!i3|Fdh)&UC.9xj%z2||A9a$e{,:%eQvzfHt>%%qJ7@?0BhW`@T0t[&`a|GzGL6U.eR$1JsG*,YPhm38qzH#/&T@yQ];dqvq=9l52oT@*,YPZm=ou(1$Nqj?<s}=K]X~5_rc38&9/n}=U^icH_6K38&9zs}=D~8Qv;xUc==:fAn%?pN93#Eid5rz13h=tPm>C8;km>C8w4|\"]?,S&}H.{?S;h2;0.(+o[.0./NM_U..0J1*2q{x0[:eaB2rxpD<cn\"qz1$Nq$9&sMA5k>KH_|Xexk}C#4vee/t5_XEK\",:w)6U.eR$bA8G^,!rZm!\"m?]`bA8G^,!rZm!\"m?]`bA8G^,la$m!\"m?q#bA.e1fg1hmD{qz?eYv$73f2DZJ&{s?{e/vJ^h~>DiFQxM7M~W@P\"59$:)SQ|+0MOdQnkm>C8;km>ArnBbojrhXUJDf,pb@?pII0s*sPaI~^drA(fRBc%Pc<\"=:LVQ&r~R$*2T@2tF;,`Nqj?*s/v|kgcm;.S/8&9/n/v[~/tp_MJj=K~O)8r!kCco%<`qq%(#$lq$91$~8N9YD/&J^:x5D?2&{>?=shWT@8?x;3K*{k}rBvUJ^Ccn;5i9FFdw)xU<7@H|_$Jsq59YDbA.etQYPZmu8>??ekv%.H~];qEJ7>?t;f=D~\"0!D1jNq+z`L4vU^icK;|iX|A9o`MAsG#t:_3KFqFdM)6Uu.CbYPZmQ8tz0e/v%.],s;7SWoez3LZnT@+?s;(2k{h3G$Ed:.XVoXQQ\"Q2Djx&K4*&<H8;km>C8;k,x09V#)Qkf6fy[^45CUu/S&}H.87b_@Jx,];yLN{>?PtC8}pFSQ_jEMI,:ue/v|kmtYP1jM7]9gDkv;~#t:_3K)o,:w)q+mGkHH_)KooqzSDbAM]f0YP$mv{!91$lq|9YX}=D~oIv;NX!0k}tBn=U^icd%!i?8&9o`vUo)c90DSE.8/:M)i+8G^,YPhm!\">?L5/&T@O~s;DjNq|9&sl+I7F9s;DjNq$9L52oT@h~@%;jNq^?)L,+!kccj%iH||w}X#/v[~*xd%z23|Fdw)Xveew{5r*|Xv;*H_CA5~%Pd0=R$|nW~$ex=:~$.Q3)/N}%lF0_.mP;G=T.=t([nB=zPmlS6+^?pL7AC.sb>tHa?&~.a$u8N9SDZn5k{x^%vi#!$9zsn=<7#t:_3K.|j?GL,+mGc90DiHL|Bz?s8iU^pNrtND|v:.=t_W)e],V;unDq5+0$ex=:~$ex{*++*uUkS{09^U\"M*fJV>W`KVKA(xo~l?ytBe+GeUtkP?`!!W0zQC8qqic+u,`Nq+z#$qq%(#$lq$91$~8N9?Qtveeg::_CH@+k}0BWa*fD9:_*2m\",:w)OJeezI0D2HX|,:g)@=5kgcm;}Lk{,:$_`AT@1fC_[jlqGzQL>=$7F9>%|XE7k}Asf=U^<H^%$JL|FdM)@=ee8?YPhmwq=9K#hWT@2t@%8UZxk}`L,+RG#t:_)S_GFdO)9U(f(H$_SH^oezYDr+)eqIg1Zm;|@?}eQvQ)Sb9;ZJA|m?&sZn`@tQ];FFQxM7M~W@P\"Gtt[PW}o+0MOdQnkm>C8;km>ArnBbojrhXUJDf,pb@?pII0s*sPaI~^dtJ;~RBd%I2<\"=:LVQ&r~R$*2T@0Qv;=`qqBz#`e+t.F92D4HexI}a`2J|k*x5DdLk{,:0e}=D~tQZP}Lp|+zht2o:HFqUu.vx&u(rJ.v{]QHqx9`ex=:~$.Q3)/N}%lF0_.mP;G=T.=t([nB=zPmlS6+BzrB7AH.Cb>tHa?&~.a$c7s9SD2o|k:x|_8cL|,:ye/vD~DI!rZm^orz0e.vGezx@%MJA|=9?bhW`@#f@%RH6l$9qeMAD~g:YP=`y8N9,n2o&S#BjD?2c==:fAn%?pN9N::WX{>\"13h=tPm>C8;km>C8w4|\"]?,S&}H.{?S;h2;0.(+o[.0./NM_Z7@0XP+Us{x0[:eaB2rx3_`q#!w}o`q+>G/t0D*qL|FdM),+*f3flaZm(G@?:ekvA7dx^%#i^ohdM),+V]f0laZmg7@?x%$WT@2t@%|id7k}W;vUU^icc%iH?8/?zsl+sG`I:_HEoo,:$)EAee9x|_}q/8rz151J(f*xH_GSzo59,nkvS.Px};dqK\":0*9\"%I2;0}tnS?yqz}tyv<%(>C8;km>C8A3__3(D`[=\"~!;o2pKvCxthXUJDf>+E@e<EI>%dqK\"TyG$!!W0zQC8J^zx};dq*{K~,nbA,7DI!rhmB\"ez2#pAT@Q05_=`Nq$9IsD+U^Mc3_NX/8O}2XxU.e$>0DWUIoqz]`bA(fV~];dqWorzN$Nq$9YX>=A7\"0C_|iexk}%B8rRG$>0Dk2D{/:M)CA.e\"Qg1hmM7=9|$Nq$9]nn=U^icm;eS38O}X#4vu.mB$1bjg7s9{bq+#~$>:_pK38u(##bAxG#fg1hmk8x?N$FqBz}b}=A7xxn%CHexk}4#.vU^Cc5DTKlq,:O)e+)ekH3_$JQ8x?1$lq%(&s>=K]X~TDCH?8/?2X*+mG#t:_)S}G,:g)8rF]AH|_GSrF>?cEtvmG<0YPhm>G>?{BB[;kK1rzGYI7gIZ:>tY]{ww[0yex=:~$ex=:l`b_3SzI0s*sDUd)CeealF0_.moLAvl7o5_=_^nf];+n.QD*YGI+i]MPWmqE88rzN52oT@4t2Dov$xk}4X}=(f9x$_DXy8@?Q`r+(fUtru<`qq|9a`D+a~xxn%CHOBk}rB@=%2`IlaQv7|A9a$~|A9a$3|A9jS8WCJCqtmynvx^\"F#Yv_\"Sc,8t`ex=:~$ex{*++*uUkS{09^U\"M*fJV>W`KVKA(xo~l?ycX,+S._?kP?`!!W0zQC8&S;BL_Y4Cdb6@~`AJ^0QZPdL$xk}\"s}=D~5bx;iHZxk}*b}=A7xxn%CHT\"Fdb$Q|+zht2o:HFqUu.v+n&I2#_b{]QHqx9`ex=:~$.Q3)/N}%lF0_.mP;G=T.=t([nB=zPmlS6+$9N`KW:.cb>tHa?&~.a$c7x9SDbAn)KtYPhmFq@?\"sC8`@PxK%;jk8WzGL6U.e$>0D2H~8Xz]`tv<74~2Ddq&{=9PB/&T@[I@%1jlq+z,sl+a~8QK%!iZxk}8;>==7R$r+C.9,!DqE88tz*bl+i]5b9;JE3|A9gD/vee/t:_#X/8r.,nhW5k@Ho%`nOBreY~eam\"QQt[<2]&1}IeK>=:~$ex=::c]@iFA8.(+o[.8G4b:@P\"S{09^Ux}Of#Ii+:.i9n%hN`xz7=t;%|kw9z%8cqq>?]`bAkfbI}%@KWoez*b/&T@7,m%%qA8/?YDbA>GI,lahm:o@?yeQvzfcbm%jE&{x?zb_=S.R$x@D~g:6L1X88>?t;pAT@Tf9;7S88>?j5ZnT@Htp_;j||^?ce.vk\"3~n?TL?&@0]W)v@7m0A_N?f>5r9`ex=::c]@iFA8.(+o[.8G4b:@P\"S{09^Ux}Of#I\"=F](0v;wN`xz7=t;%|krx|_QX#!w}2XOJxGdx|_GSR|rz,nr+0.30!rZm8X>?0e.vQ)/0@%,SWo>?L5hWT@(Qx;9q!0k}>;LvU^Ccj%+Ue{,:O)OJee/H|_SHh\",:w)_=0.(H|_z2~|m?$ar+u.jIg1hm~8m?[$sqw}TL_=jGX~TD2Hd7k}.Lq+5kicd%fKR|$9o``+)eD9:_Wc*FFdh)}=RG2<0D;X;|Bz{bl+i]8Qp_|Xa|A9o`}=0.R$r+M]T09;dq88m?oL/&T@t?C_[jsqA9D`q+i]oITDTK3|w}D5>=F]Ix3_8ce{Xz{e/vK]f0C_%qn\"@?9bpAT@9xrucFQxM7M~W@P\"eb}NB_WX80MOdQnkm>C8;km>ArnBbojrhXUJDf,pb@?pII0s*sPaI~^daW,7#BCD+c<\"=:LVQ&r~R$(^T@O~x;,`qq%(r;w+i]F9v;eS/8Wz8B2Jo)$>0D+UL|,:a`1J.e$>0D+c#\"ez}nbAH.9,YPhmwqY}!52oT@NITD[jlqA9(b`+g7{,}%pKZxk}1`BJeeR$r+kf%xx;qEvqY}*s/&T@(Q9;bjNq%(a`/v5kccj%>Uy8hdZ_$WT@V~rueS`qk}4X@=5kicCD*qa|A9O)l+8GzIg1Nic==:fAn%?pN9+ufKs{!913h=tPm>C8;km>C8w4|\"]?,S&}H.{?S;h2;0.(+o[.0./NM_U.tQXPUE]{x0[:eaB2rxpD2jy8N9,n2oJ^Mc>;;X/8Z9/n6U.ec9:_*2>", "7nC8T@2tF;TK$Qk}uBBJ|kicpDHHa|GzGL6U.e$>0DWcL||GfL>vqqgcH_4HL||9X#e+0.3~:_+c%FFdw);vo)9x|_bj!\":0*9\"%I2;0}t|im\"l9(tyv<%(>C8;km>C8A3__3(D`[=\"~!;o2pKvCxthXUJDf>+E@e<TfruxciqTyG$!!W0zQC8|k%x5D2jSqGz[$Q|^?zsl+g7~fla*2h7gdY)e+2.R$1J*f7,x;7SUK=9db/&T@jbn%;j38O}$abA=7bIg1hmc7Y}D$Sq|93L}=A7xx9;,`Fq$9L5TJT@H~2D=`lqA9t;_=K]{,n%6S38N9gDXvC.#t0D>U.8Z9D5f=*f#t0DNXhK,:O)*+=7GH3_GSu8u($ar+F]}QYPhm38=9|$qqw}FXCAD~\"05_rcc==:fAn%?pN9|_(qx&u(13h=tPm>C8;km>C8w4|\"]?,S&}H.{?S;h2;0.(+o[.0./NM_1~\"QJ1(qq{x0[:eaB2rxpD7S!0b6,~`A5kkHCDZJ[dk}fL;vJ^Ccn;TK||,:w)9Uu.@H|_$Jpo>?SDr+#~*,YPZmNq59[$NqGz*s@=K]F9K%+c/8&9X#CAsG$>0DI2%F,:w),+sG<H|_}q~859$ar+mG\"H3_#i9F>?;$sqw}8;hWT@;fs;.SlNk}U#`+i]\"0C_*2K\":0*9\"%I2;0}tS_p8s?7tyv<%(>C8;km>C8A3__3(D`[=\"~!;o2pKvCxthXUJDf>+E@e<nfm%ZJv{TyG$!!W0zQC8|kPxCD2jsq+zVXq+g7X~>%fKk|k}@nYv|kwcK;Pc;|%(cEx@D~k0f9ZmR|599e.vzf~0la$m||Y}9eLv%.8?C_@KZxZ3G$Ed:.XVoXzoyQ|:HE\"K4*&<H8;km>C8;k,x09V#)Qkf6fy[^45CUu/S&}H.87b_@JF`5_yLm\"m?PtC8}pFSQ_jElN,::e`+I7v{J(v#`\"b6rI>vqq$>0DpKX|>?YDtvo)@H|_XE8Xrzq#1J[~<0!rbjh\":0*9\"%I2;09buWZ\"ezGtyv<%(>C8;km>C8A3__3(D`[=\"~!;o2pKvCxthXUJDf>+E@e<V~ruUHD{`yG$!!W0zQC8|k%x>;UHlNK~Q`bAkf$>0DxU*{k}{BhWT@Y~g11jy8&92Xf=A7F95_MJ&{tzq#tv<73~g1KFQxM7M~W@P\"yfs;/PYq80MOdQnkm>C8;km>ArnBbojrhXUJDf,pb@?pII0s*sPaI~^drAxGmB^%k2<\"=:LVQ&r~R$s_`@1fv;,`lq^?`L8r!GX~m%pK!0k}&s\"=!kgc>;;X/8/?/nMA5kCcH_*238/:M)\"=o)^,!rhma|>?L5/&T@Z9s;=`Nq+z,sl+a~8Qs;a#>oK~YDhW`@3fK%;jQ|^?/ni+0.c9YPKFQxM7M~W@P\"n~>NiH.880MOdQnkm>C8;km>ArnBbojrhXUJDf,pb@?pII0s*sPaI~^dtJV]RB>;;X<\"=:LVQ&r~R$(^|k%x|_QXexk}\"sl+!G8Q5_CH*{k}!5&U|kFco%NiR|$9X#q+RG2<0Drc~8VdZ)xU.es`0DWcL|+.0bpAqqCcj%WU!\"FdM)Yv:.*,lahm2\"rz:e/vS.~0@%QXJ7=9N5ZnT@f0@%QXWo>?/sZnT@Kt5_,S&{=9L5pA`@Ix}%=`iq+z,s}=zfF9s;cFQxM7M~W@P\"n~5#NX||+0MOdQnkm>C8;km>ArnBbojrhXUJDf,pb@?pII0s*sPaI~^dtJeeLB};8U<\"=:LVQ&r~R$RD`@zx}%<`qq%(pLe+t.Gfp_k2d7k}m5Xv|kZcr[|i/8EzgD/vee~8:_(23|,:w)q+2.+?$1$m3859ueLv%.&,2DUH88g}~npA`@jI@%1jR|%(ce.vk\"3~n?TL?&@09%Eru.B0A_N?f>5r9`ex=::c]@iFA8.(+o[.8G4b:@P\"S{09^Ux}Of#IXvee(0s;hN`xz7=t;%|kw94_#i6{tz$a1JeesIlaZm38Xz5$Sqj?fn`+]es`Usv#`\"K~0bbAeeBtg1ZmR|ezdeQv$7Q0];?2A|m?$DTJJ^mtT*?`Ed:.XVoXzog9T_Aq\"K4*&<H8;km>C8;k,x09V#)Qkf6fy[^45CUu/S&}H.87b_@J\"fru?Lm\"m?PtC8}pFSQ_jEd7,:fL)+Y^{xCD1Xk|K~M)n=S^Cc>;A`lq%(9ekv%.9x>;dqNlhd[$k8Z9$a!^$7ECH_`nOBreY~eam\"_?F%rc#\"1}IeK>=:~$ex=::c]@iFA8.(+o[.8G4b:@P\"S{09^Ux}Of#ICA[~@fn%wN`xz7=t;%|ktQjDrB&{59[$iqGz[$NqA9N5/&`@^,g1&`38hd<~`A|kt?$1hmxF=9YDtv*fbIYPhm~8Y}]npA`@zxK%,`Nq%(\"s}=zf\"0@%jEJ7qzdb@=K]8QruUEk8O}zsq+ee<H|_#ipo=9}nbAeeZ9YPZm.8>?b$Nq$9v`>=U^Ccn;iHrF,:M)q+F]@H|_$J/8u(]`bA#~Ltv;1X88@?OXB[;kK1rzGYI7Vk6s,<:.{ww[0yex=:~$ex=:l`b_3SzI0s*sDUd)CeealF0_.moLAvl7o5e+P^Utx;+n.QD*YGI+i]/t!r1j3|A9}npAwwvC^%RHY.K~0bbA5kcc|_li;||9D52oT@_Qs;Dj/8/?qeMAD~_fYPKFQxM7M~W@P\"n~m%/P|{+0MOdQnkm>C8;km>ArnBbojrhXUJDf,pb@?pII0s*sPaI~^drAsG!Bd%\"2<\"=:LVQ&r~R$s_|kFcm;pK.|w}2XvUV]{xd%GSN{=9YDbA5kZc|_li;|w}GL_=0.Ix3_#i.|@?0e/vA7Fb}%%qWo>?4XpAT@x7K%,`sqA9uBhWT@dx];?qexk}i#OJU^icpDJE~8&9o`f=sG#t0D8U!\",:O)q+sGLBZP1jM7]9/ne+[~#t:_6Kzo,:w)e+*f\"HH_SH(Gu(SD1JH.<H$_8cL|,:M)Xvu.yQYPhml{u(D$lq|9W;pAT@8?K%<`lqBz{B_=A7|ts;li!0k}b`*+S^ic>;8UMIk}2#i+U^cco%I2y8Z9zs.v:.c90D6S_Gh3G$Ed:.XVoXt.V~|:!i\"K4*&<H8;km>C8;k,x09V#)Qkf6fy[^45CUu/S&}H.87b_@J\"fs;dLB\"rzPtC8}pFSQ_jE4Ak}/sCA!kic|_.S/8L?gD`+sGg::_[X6{/:|$=ohdb$Q|A9zs}=D~oIx;iH#!|9/n@=n)#t0Dzq.|$9GL4vU^cc|_;XX|+z{b}=A7{,n%CH>}FdmS8WCJCqtmyn<K&IIb@=%\"Sc,8t`ex=:~$ex{*++*uUkS{09^U\"M*fJV>W`KVKA(xo~l?yen,+A7x7kP?`!!W0zQC8|kPxCD2jsq$9YXq+g7\"09;1jSq|9U#w+]e{,TD[j387z}nbA.e<H$_8clqqz##r+>G/Ho%}qx&,:}eWak\"3~n?TL?&@0NLw+d./0A_N?f>5r9`ex=::c]@iFA8.(+o[.8G4b:@P\"S{09^Ux}Of#Il+,7(0C_YN`xz7=t;%|kw9Q_MJ88m?9bhWT@~02D+U.Qk}U#9UJ^icm;=`Fq+zN5hWT@~0}%6Sexk}.n,+=7$>:_fS8Xu(}ntv=7kH3_)Kpo>?|$lqBzen\"=D~X~TD;X!0k}\"b]UJ^ccK;CHA8N9/n_=:.:,:_*2iq,:w)Lv>G{x3_)K;|@?ye/vjG9xC_%q&{<955ZnT@KtF;&`sqBzL5hW`@Qf@%jEA|>?6L@=K]8Q5_?qy8&9o`&UxG#t:_NXU\",:O)\"=H.kHH_GS~8u(}nbAV](QYPZmlq@?b$lqj?*sf=A7|tn%zqd7k};`i+S^Mc|_fS!\":0*9\"%I2;09bPWO7,9Gtyv<%(>C8;km>C8A3__3(D`[=\"~!;o2pKvCxthXUJDf>+E@e<~0@%xc7oTyG$!!W0zQC8|kPxCD?2!0Vduee+a~c9,?dL|q$9L5ZnT@8?s;=`Nq+zN5ZnT@O~2D=`3|A9ht2o:HFqUu.v.Xez254v{]QHqx9`ex=:~$.Q3)/N}%lF0_.mP;G=T.=t([nB=zPmlS6+A9uBKW0.qb>tHa?&~.a$u8&98B/vee/t0DovRqA9Asw+a~GfK%+cMIk}#5i+!kicj%|X38L?/n6U.e/t0D}Ld8Z90b2oqq#t:_JE||w}2XLvF]@HH_XE:orz,nbA#~sbg11jsqBzL5hWT@=,n%PcZxk}W;QvC.#t0D9qk8VdO)kvC.\"H|_z2*Fm?,ntv[~30g1hm`{59ye/vGeffF;dqJ7=9N5pAT@dxm%[jlq$9}b}=$7{,TDtcc==:fAn%?pN9N:{c3|u(13h=tPm>C8;km>C8w4|\"]?,S&}H.{?S;h2;0.(+o[.0./NM_Z7uQXP4HD{x0[:eaB2rx3_`q@+k}N52oT@^,!rhm3|,:w)@=5krxn;1XMIk}\"s}=A7g:0D|i;|^?##x@D~k0f9hm9FezC#pAT@qI];A`NqGz<s`+U^ic+u2Hk8&92XxU.e`I0D;X/8O}D5i+mG(H|_XEZqez]`bAC.bI!Ddq88qz=s/&T@z,2D1jsqA9m5`+i]F9p_>U;|w}D5l+xGR$tvV]ffg1hmy8qz#$Nq%(a`/vU^icn;pKO\":0*9\"%I2;0}tEiq{tzItyv<%(>C8;km>C8A3__3(D`[=\"~!;o2pKvCxthXUJDf>+E@e<Xt@%7S6{TyG$!!W0zQC8|kPx};?2lNK~%e;v$7cbm%QX&{59fnpA`@h~t[&`;|%(ht2o:HFqUu.vd5qz#5Ea{]QHqx9`ex=:~$.Q3)/N}%lF0_.mP;G=T.=t([nB=zPmlS6++zx;GJ(fjb>tHa?&~.a$c7x9SDC8|k\"H|_SH`{59##r+,7G0YPhm7ou(OXC8T@Ht}%Pc*{k}KX8r5kicH_6KR|A92Xq+v)/t:_\"2>GFdM)q+*fCb!rhmK\"59*bpAT@Ebru=`lq|955MAD~5bn%Pc!0k}0B&UU^Cc^%HH`{,:M)%UV]Utg1hm]{Y}#$Nq%(GnkvJ^ic@;?q?8&9X#MAn)R$TJ|k?H$_QX`qb60bx@T@0?s;DjNq^?\"s9U)7xx>%[jNq$9kb9U5kccpD+cZxk}\"sMAC.D9:_(23|FdO)Lv<7)NrtND|v:.=t;&7vwIru9nDq5+0$ex=:~$ex{*++*uUkS{09^U\"M*fJV>W`KVKA(xo~l?y;`*+$7jbkP?`!!W0zQC8|kPx};?2lNK~%e;v$7cbm%QX&{59fnpA`@h~t[&`;|%(ht2o:HFqUu.vyyXz|5Ca{]QHqx9`ex=:~$.Q3)/N}%lF0_.mP;G=T.=t([nB=zPmlS6+Bz+BFn;~sb>tHa?&~.a$u8&9$ad;_2(HCDrB&{:(}ntv.e/t0DPcd7k}D$k8L?,n1J>G>?!rhmFqrz=sZnT@Y~v;<`lq$9x;>=jGg:Wm7S`q,:ue/vk\"3~n?TL?&@04:Y+n)<0A_N?f>5r9`ex=::c]@iFA8.(+o[.8G4b:@P\"S{09^Ux}Of#I}=o)R~K%hN`xz7=t;%|kw94_SHMIk}7nMA5kcc^%QXJ7=9N5/&5kO~+%FjL|+z$aZnwwB>T^k2oC8boX2\"Ok>;oXRpa#Nr9`ex=:~$|8\"~JIi8`KVKA(lRAl;*|#b@Ni+X:9L1JQqz~~LvC.y05r@YqN89]`RDT@/0@%jEJ7ez[$sqA9N5C8T@Qf@%,S!0b6tI>v_2k0!r1j3|^?$aZnwwB>T^k2oC8b{2NF=9W%nXRpa#Nr9`ex=:~$|8\"~JIi8`KVKA(lRAl;*|#b@Ni+X:9L1W|Y}]~}=V]y05r@YqN89]`d;:M0QW%oqd7Fd;$M7gd:eLvQ)^,YP1jiqBzL5ZnJ^pNrtND|v:.=t%n4`30v;9nDq5+0$ex=:~$ex{*++*uUkS{09^U\"M*fJV>W`KVKA(xo~l?y55`+$72tkP?`!!W0zQC8|kPx};[ilNK~O)LvH.(H$_GSqq,:Y)}=kf\"Ho%}qe{<9kLpAgwB>T^k2oC8b>WI8g}%BoXRpa#Nr9`ex=:~$|8\"~JIi8`KVKA(lRAl;*|#b@Ni+X:9L1JQrz@~>=sGy05r@YqN89]`/&|kAH^%,S@+FdY)8ro){x|_SH~|ez15bA;~Sb!rDjh\":0*9\"%I2;0}t0c(Gm?@tyv<%(>C8;km>C8A3__3(D`[=\"~!;o2pKvCxthXUJDf>+E@e<Cbn%ZJ!\"TyG$!!W0zQC8|k%x};?2.QK~O)@=U^wcm;=`lqGzyeLvS.dx};xcc==:fAn%?pN93#LxL{^\"13h=tPm>C8;km>C8w4|\"]?,S&}H.{?S;h2;0.(+o[.0./NM_`)mtXP?qq{x0[:eaB2rx3_QX88.z[$lqw}*b9U)75bt[k2!0k}tBi+!kccr[4H~8&9{b6Un)2<0D;X;|w}o`XveeoCH_,ST\"Fdue,+I7#tYPa#`\"b60bB[;kK1rzGYI77zIBD+M]{ww[0yex=:~$ex=:l`b_3SzI0s*sDUd)CeealF0_.moLAvl7Pbe+P^],9;+n.QD*YGk+i]D9!_GS~8rz)nn=!kCc};SEh\"@?OX2oT@KtK%rcc759]`bA#~jbx;8U.8/?gD@=5kic>;iHd7R?/n6U[~jb>%,`lq+z1`OJmGQfla$mq{:(~n6U.e/t:_Pc^orz,sl+t.8Qx;3KxFm?$abAmGEIx;iHd70(SD/&!k:x5D&`/8[Ig)\"=H.jIm%(2lNk}VXEA)e<0>%,Svq=9`L%UV]9x^%GSQ8u(;`OJ|kic^%NX/8Z9o`XveeD9T_%qex,:b$u8O}`Sio;kK1rzGYI7[I%J8rV]{ww[0yex=:~$ex=:l`b_3SzI0s*sDUd)CeealF0_.moLAvl7o5CA_^1ft[+n.QD*YGI+i]2<la&`y8/?YD2oqq$>0DTKT\"k}7npAT@\"QYP$mK\"Fd0e4vk\"3~n?TL?&@0ztX+.em0A_N?f>5r9`ex=::c]@iFA8.(+o[.8G4b:@P\"S{09^Ux}Of#I;vxGpI>%wN`xz7=t;%|kw9Q_MJn\"qzrBhWT@nfF;*2lNk}a`f=S^%xK;1X&{59[$NqBz}b}=A7|t2D=`NqBz}b}=jG/tlahm2\"ezueQvjGK~laZmD{:(0eXvD~sb5_02*{Z3G$Ed:.XVoX#nl,]NEi\"K4*&<H8;km>C8;k,x09V#)Qkf6fy[^45CUu/S&}H.87b_@Jx,p_9Lk8>?PtC8}pFSQ_jE@+,:D$u8Z90bbA5kwco%li^ohdw)l+I7F95_CH@+k}|5EAU^FcH_#Xy8O}D5Xv=7(Hd%z2.|>?SDr+u.*,YP>ss{59[$Nq+zFX`+S^Cc>;*q38/:O)OJn)~H3_#i(Gez[$lq%(\"s}=D~|tF;iHc==:fAn%?pN9Z:TK.Xu(13h=tPm>C8;km>C8w4|\"]?,S&}H.{?S;h2;0.(+o[.0./NM_LG^,J1iH`{x0[:eaB2rxpDcXJ7=9N5C8T@_Qs;=`sq$9}bl+i]|tF;iHlN,:b$lqBz}bl+I7{,n%CH!0k}fnMA5kcc^%NX/8Z9)5TJT@K~];[jlq^?zb}=Ge{,5_HHE7k}x;.vU^~Ho%`nOBreY~eam\"_1F;CH]&1}IeK>=:~$ex=::c]@iFA8.(+o[.8G4b:@P\"S{09^Ux}Of#I/v<7@f9;YN`xz7=t;%|krx|_QX#!A9{bl+I7{,n%CH*{k}N52oT@O~2DDjk8L?Q`bAkfR$1J>G#t0DPcexk}TLTJ|kPx|_}qR|qzYD1JH.dxH_DXL|ez15tvsG30laDjh\":0*9\"%I2;0}tQSwqR?ktyv<%(>C8;km>C8A3__3(D`[=\"~!;o2pKvCxthXUJDf>+E@e<_Q5_[ihKTyG$!!W0zQC8|kPxCD2jlqGz[$lqj?*b}=D~Gf@%%qA|rzN5hW5k\"HH_DX;|w}gD/veek0:_CHZxk}7nMAU^AH|_QX&{ezzbZnT@dxp_=`qqGz1`}=$7oI>%WU}KFdsS8WCJCqtmyn=70(|`q+r\"Sc,8t`ex=:~$ex{*++*uUkS{09^U\"M*fJV>W`KVKA(xo~l?yH#e+%.Q0kP?`!!W0zQC8|kPx>;2jsq$9}bl+I7{,YPZm`{59[$sqj?15/&ASc9f9Zm`{Fdw)q+5kMco%1jiq|9|$L|Bzht2o:HFqUu.v:5)zS5Lv{]QHqx9`ex=:~$.Q3)/N}%lF0_.mP;G=T.=t([nB=zPmlS6+$9#`KW*fFb>tHa?&~.a$c7x9SDC8|k\"H|_SH.Qk}uB@=%2#t0D=`lq$9}b9UM^ic@;dqJ7ezye/vGe#t0D|i;|$9YDF@A7>_:_li/8O}GLMA5kcc|_CHexk}\"sl+I7k0T*?`Ed:.XVoX#nf0}04H\"K4*&<H8;km>C8;k,x09V#)Qkf6fy[^45CUu/S&}H.87b_@J00m%dLSqezPtC8}pFSQ_jE!0,:$_$WT@0?];pKMIk}|58rS^icr[xU/8/?GLWaxGc9lab#`\"K~O)EAn)~H$_GSc7=9$ar+F]GHo%XEM7m?##pAgwB>T^k2oC8b>W^8g}GWnXRpa#Nr9`ex=:~$|8\"~JIi8`KVKA(lRAl;*|#b@Ni+X:9L1&\"ez]~_=n)y05r@YqN89]`(^|k%x|_QXexk}N5/&`@H~2D}Lk{k}N52oT@0?s;ov$xk}gXC8T@>?g1hmQ8/:M)XvU^:x|_%q88m?0BTJT@{xx;&`sqw}4XZn`@Ltx;=`a|%(ht2o:HFqUu.v~X)zH54v{]QHqx9`ex=:~$.Q3)/N}%lF0_.mP;G=T.=t([nB=zPmlS6+^?\"sGJ(fEb>tHa?&~.a$u8&9##Zn5k8?L_$Jl{m?0bbA)eXt!rZmQ8XzdeLvjG{x5_RHZxZ3G$Ed:.XVoXQQ_Q!D3K\"K4*&<H8;km>C8;k,x09V#)Qkf6fy[^45CUu/S&}H.87b_@Jx,];dL`{Y}PtC8}pFSQ_jE!0,:{eD+g7k0g1&`;|+zht2o:HFqUu.vWW^\"4:xb{]QHqx9`ex=:~$.Q3)/N}%lF0_.mP;G=T.=t([nB=zPmlS6+j?fLFnH.Jb>tHa?&~.a$u8&9##Zn5k8?L_$Jl{m?0bbA)eXt!rZmQ8XzdeLvjG{x5_RHZxZ3G$Ed:.XVoXQQQf@N5i\"K4*&<H8;km>C8;k,x09V#)Qkf6fy[^45CUu/S&}H.87b_@Jx,v;}Lm\"59PtC8}pFSQ_jE[dk}}bl+g7Gf@%%q&{59[$qqGz[$u8Wz,ntvsGK~!rhmO\"=9MXTJT@BtTD=`lq$9P;}=Geg:lahmxF=9ye.vzflI5_QX&{XzQLpA`@5ITD&`;|Bzht2o:HFqUu.vyyXz#5Yv{]QHqx9`ex=:~$.Q3)/N}%lF0_.mP;G=T.=t([nB=zPmlS6+^?*sGJ[~ib>tHa?&~.a$c7x9SDC8|k\"H|_$J!\"m?##1Jo)1fg1hmiq59[$lq|9U#_=$7|t2D=`sq^?+Bn=jGX~F;iHd7k}.nxU_2#tg1A`sq$9L5pAT@Qf];cXvqrz:e/vGejb>%QXvqrz:e/vGejb>%,Svq59yeQv%.*,T*?`Ed:.XVoXa~mtv;PW&K4*&<H8;km>C8;k,x09V#)Qkf6fy[^45CUu/S&}H.87b_@J7Is;9Lqq59PtC8}pFSQ_jE!0,:$_$WT@0?>%(2MIk})nD+U^ico%*2.8Z9zsw+mG`I0D;X/8L?{bl+Y^icK;iHexk}L5(^T@_Q@%[jqq$9L52oT@Tf];;jiq+z&se+]e>QT*?`Ed:.XVoXa~KtC#m_&K4*&<H8;km>C8;k,x09V#)Qkf6fy[^45CUu/S&}H.87b_@J7In%dLqq=9PtC8}pFSQ_jE!0,::el+]e}80D?q3|Fdw)xU.eR$1J;~*,YPZmxFm?}npA%2\"HH_`nOBreY~eam\"N,ru\"2h\"1}IeK>=:~$ex=::c]@iFA8.(+o[.8G4b:@P\"S{09^Ux}Of#I9U;~(0ruwN`xz7=t;%|krxH_%q#!A9o`D+2.g::_NXe{VdO)q+*f:x$_#i\"Gezq#bA=7dx^%DX^ohdO)6U.eR$1J.eSP:_Nia||92XCA<7/t0D!is{Fdg)]Un)Px};[ic==:fAn%?pN9H_;Xm\">?13h=tPm>C8;km>C8w4|\"]?,S&}H.{?S;h2;0.(+o[.0./NM_U.0?XPUEq{x0[:eaB2rxpDrB&{:(]`1J>G/t0DPcexk}TL^X|k;BZP<`;||9,n/&U^)NrtND|v:.=t%n4`zxv;?nDq5+0$ex=:~$ex{*++*uUkS{09^U\"M*fJV>W`KVKA(xo~l?y3Ll+S.yQkP?`!!W0zQC8qqCcr[,`Nq$9D$lq%(|$Nq+z#$k8&9wb(^K]5bt[qEJ7>?,nbAv)$>:_I2E7Fd)L>vwwB>T^k2oC8be+)8wk39nXRpa#Nr9`ex=:~$|8\"~JIi8`KVKA(lRAl;*|#b@Ni+X:9L1&\"@?7~9U;~y05r@YqN89]`2o|kAHCDdq6l$9ht2o:HFqUu.vV8Xz|5Ma{]QHqx9`ex=:~$.Q3)/N}%lF0_.mP;G=T.=t([nB=zPmlS6+$9#`KWC.Eb>tHa?&~.a$u8Z9$a!^$7ECH_`nOBreY~eam\"Kft[k2]&1}IeK>=:~$ex=::c]@iFA8.(+o[.8G4b:@P\"S{09^Ux}Of#I/v<7Z`];ZN`xz7=t;%|krxH_%q*{,::eCA$7w{5r*|Xv;*H_/Sb)I,3:=R$|nW~$ex=:~$.Q3)/N}%lF0_.mP;G=T.=t([nB=zPmlS6+A93LKW,7Fb>tHa?&~.a$u8R9qe,+g7#tg14FQxM7M~W@P\"80p:*qD{+0MOdQnkm>C8;km>ArnBbojrhXUJDf,pb@?pII0s*sPaI~^daW8GmB$_SE<\"=:LVQ&r~R$/&|keNrtND|v:.=t[X\"fu?v%%nDq5+0$ex=:~$ex{*++*uUkS{09^U\"M*fJV>W`KVKA(xo~l?y&se+$7XtkP?`!!W0zQC8|k%x5D1XMIb6YDB[;kK1rzGYI7[ItBn=~v{ww[0yex=:~$ex=:l`b_3SzI0s*sDUd)CeealF0_.moLAvl7Pb]U_^Ixx;+n.QD*YGI+i]rzla&`k8&9SD/&wwB>T^k2oC8b>W_W]?GWnXRpa#Nr9`ex=:~$|8\"~JIi8`KVKA(lRAl;*|#b@Ni+X:9L1&\"59~~8r>Gy05r@YqN89]`*2|kPx$_%qd7,:LS8WCJCqtmyn+\"@\"j5Lv_\"Sc,8t`ex=:~$ex{*++*uUkS{09^U\"M*fJV>W`KVKA(xo~l?y!5l+%.yQkP?`!!W0zQC8qq:x|_MJ!0,:D$!\":0*9\"%I2;0}tmXQ8rz9tyv<%(>C8;km>C8A3__3(D`[=\"~!;o2pKvCxthXUJDf>+E@e<:xn%?2#\"TyG$!!W0zQC8|k%xH_cjsqZdjS8WCJCqtmyn=7@\"`9AU+\"Sc,8t`ex=:~$ex{*++*uUkS{09^U\"M*fJV>W`KVKA(xo~l?y0BD+D~T0kP?`!!W0zQC8|k%xH_cjsqZdjS8WCJCqtmyn=7~?YX\"=+\"Sc,8t`ex=:~$ex{*++*uUkS{09^U\"M*fJV>W`KVKA(xo~l?y+;e+D~h~kP?`!!W0zQC8qq:x|_MJ!0,:D$!\":0*9\"%I2;09bS_$qPz}tyv<%(>C8;km>C8A3__3(D`[=\"~!;o2pKvCxthXUJDf>+E@e<1fC_dq0GTyG$!!W0zQC8qq:x|_MJ!0,:D$!\":0*9\"%I2;09bRih\"Pzytyv<%(>C8;km>C8A3__3(D`[=\"~!;o2pKvCxthXUJDf>+E@e<u?}%dqdoTyG$!!W0zQC8qq:x|_MJ!0,:D$!\":0*9\"%I2;09bXxZ\"R?Gtyv<%(>C8;km>C8A3__3(D`[=\"~!;o2pKvCxthXUJDf>+E@e<@0}%.K#\"TyG$!!W0zQC8|k%x|_`nOBreY~eam\"/?V;CHe&1}IeK>=:~$ex=::c]@iFA8.(+o[.8G4b:@P\"S{09^Ux}Of#I_=#~@fn%hN`xz7=t;%|krxH_%qc==:fAn%?pN9S:+c;|&I13h=tPm>C8;km>C8w4|\"]?,S&}H.{?S;h2;0.(+o[.0./NM_LG~0J1NXD{x0[:eaB2rx3_QX!0h3G$Ed:.XVoXMojb5_fS\"K4*&<H8;km>C8;k,x09V#)Qkf6fy[^45CUu/S&}H.87b_@JQtt[dLl{ezPtC8}pFSQ_jEMI,:LS8WCJCqtmyn=7PzktX++\"Sc,8t`ex=:~$ex{*++*uUkS{09^U\"M*fJV>W`KVKA(xo~l?yMXl+S.rxkP?`!!W0zQC8|k%x|_`nOBreY~eam\"PPF%HH]&1}IeK>=:~$ex=::c]@iFA8.(+o[.8G4b:@P\"S{09^Ux}Of#I.vn)R~@%ZN`xz7=t;%|krxH_%qc==:fAn%?pN9S:Pc.XY}13h=tPm>C8;km>C8w4|\"]?,S&}H.{?S;h2;0.(+o[.0./NM_7ejIXPiHe{x0[:eaB2rx3_QX!0h3G$Ed:.XVoXMoJbC_I2\"K4*&<H8;km>C8;k,x09V#)Qkf6fy[^45CUu/S&}H.87b_@Jq9p_}L~8=9PtC8}pFSQ_jEMI,:LS8WCJCqtmyn=75Ic:Jv+\"Sc,8t`ex=:~$ex{*++*uUkS{09^U\"M*fJV>W`KVKA(xo~l?y[`*+GeKtkP?`!!W0zQC8|k%x|_`nOBreY~eam\"[,V;/2!\"1}IeK>=:~$ex=::c]@iFA8.(+o[.8G4b:@P\"S{09^Ux}Of#Iq+mG%,K%ZN`xz7=t;%|krxH_%qc==:fAn%?pN9S:{cQX=913h=tPm>C8;km>C8w4|\"]?,S&}H.{?S;h2;0.(+o[.0./NM_&7_?J1k2D{x0[:eaB2rx3_QX!0h3G$Ed:.XVoXzofQH:WU\"K4*&<H8;km>C8;k,x09V#)Qkf6fy[^45CUu/S&}H.87b_@J\"fs;?L+GqzPtC8}pFSQ_jEMI,:LS8WCJCqtmyn=7R?)WX++\"Sc,8t`ex=:~$ex{*++*uUkS{09^U\"M*fJV>W`KVKA(xo~l?yVXq+$7bIkP?`!!W0zQC8|k%x|_`nOBreY~eam\"D,V;iHv&1}IeK>=:~$ex=::c]@iFA8.(+o[.8G4b:@P\"S{09^Ux}Of#IYvC.(0x;ZN`xz7=t;%|krxH_%qc==:fAn%?pN9S:Pc3X@?13h=tPm>C8;km>C8w4|\"]?,S&}H.{?S;h2;0.(+o[.0./NM__.4~J1Nis{x0[:eaB2rx3_QX!0h3G$Ed:.XVoXzokQp#,P&K4*&<H8;km>C8;k,x09V#)Qkf6fy[^45CUu/S&}H.87b_@J|~];9LlqqzPtC8}pFSQ_jEMI,:LS8WCJCqtmyn=7>\"`9&=r\"Sc,8t`ex=:~$ex{*++*uUkS{09^U\"M*fJV>W`KVKA(xo~l?y#`8rD~.0kP?`!!W0zQC8|k%x|_`nOBreY~eam\"R0V;VHv&1}IeK>=:~$ex=::c]@iFA8.(+o[.8G4b:@P\"S{09^Ux}Of#I]U:.;tx;wN`xz7=t;%|krxH_%qc==:fAn%?pN9H#tcX|L\"13h=tPm>C8;km>C8(]AG9?N?m#nW~$ex=:~$.Q5Gb$]vI~s;ea44o62L7S|v0.EtZU{2Y\"!s|`gote`f*u(]MPY[0yex=:~$ex=:l`@&#X;0IscXN+YfB:)2wq{Dqz<|eU%0U_W@{FlCxtWoS!gddd!ifK<8TsLR@=i*43c;<%(>C8;ksw#Ln2>5nW&<H8;k(BI(Q[_I\":~$ex=:~$NvD*H_+i}F]C\"LJSKMC.YGK>=:~$ex=:U_W@{FlC8bSveU%0&<H8;km>C8;kJCrz^U?&#GvNF;z].fxR@s$.k}4b[2A7rxTD$JhM_0&<H8;km>C8;k*D2L3WF+#*7`C8|k:xlaUEqNnW~$exi*&<H8;km>C8;k,x09V#)QD*YG@X5k{xS:02UK@?GnMA5k{xo%GS*Fu(uBi+!Gxxt[fS~8.zkLtv(fEbn%Pc.Qk}KXMA0.kQ!r)`Sq|9\"bWan)*xo%DXx&u(uBw+zoD90DCEe{tz,s2o`@?Qx;\"238/:Y)8r;~x7F;<`wq$9ksBJ;~:xd%DXx&u(uBw+X.GfTDHE`{59u~^&;~{,F;3Kk8/:#5C8skMcCD|X8Xqz|$m\"k}KXMA0.IxS:MJ&{g}cXq+2.g:C_z2(Gu(OX^XT@Ix!D\"2*F,:>;1J;~zxx;&`Sq|9\"bWan)*xCDZm.8ezZD,+vD3~:_6K6{tz0B2oeeGfTDHE`{,:q$Fq+zt;Wan)*xH_>s]{XzZD,+X.F9!DHE`{>?$aXvK]\"QTD?q}Kk}#`i+>G/0!rCHUKY}#`>=|klx5D=`y8I}GnD+u.%x7{QXsq|9\"bWa*fg:@%#iKKY}7n^XLk@0:_tc6{tz5$sqk}4Xw+>GPxCDZm`{ezZD,+I7gcpDPcc7=9$aQvS.ffTD?qMIm?zsBJV]Bt!r)`3|k}#`i+>GPxCDZm.8ezZD,+zog:n%XEQ8g}7n2o>GF95_HE`{,:fLr+(f*xx;&`m\"k}uBMA0.IxCD$m.8ezZD,+I7ccCD|X8Xu(u~^&o)oI5_SEK\",:#5C8sk*,0DHE.8>?b$wqGz*sBJ;~%xS:QXFqw}{BBJ;~_f0D?q.8>?}b2ou.xxruCE`{,:Z)q+,7x7K%,`3|k}#`i+>GPxo%DXx&u(uBw+vDg:>%#iKKY}7nC8`@Eb2D\"238/:q$g7k}7nq+>GPx$_)K]{u(uBi+I7cco%|X8Xu(SDbAM]sbn%liMI59{bWa(fCb!r$m6{!9oLw+!klx5D=`e{k}%B}=8G*x7{viUKY}#`>==7zI:_6K6{tz0B^XLkZc@;9q_G=91$Sqw}/s;vn)zxj%DX;|qzL5C85kzxd%qF&K4*&<H8;k(B<DD2rU5+K4{+,J|\"C92gYk\":~$ex=:~$ex=:~$ex=:~$ex{*x+&;Vp(>C8;km>C8;km>C8;km>C8;km>C8;kCIn?!`NvD*q)1Dkq7{>D5R4v\"~vfOD(\"QHqx9`ex{*y!*u74.8#LlSv!ZGLV>W+\"D9tm\"U/lW0*QODY^n/.m5`8.Of+jODjpa#Nr9`ex=:~$GGv)6f$=tPm>C8;km>C8;km>SU=M\"8)9xoC.[*CD:@(2oC`j5R@==:Fev;}F;0<?JSf=[}(sx4l@`z0DwX<M|9v`BJ>FZ6+tvi|vOfRVQ&[~@05r#1GMmG4VQ&[~@05r,|(M]IEBeai]R$/&[~%x@;;Xxq}*++*uUkK1rzGYI7&6FbODKFcwtmwXQxz7=tUbmGrxo%}q[dI}ueYvA7g:C_)KZxI}1$B\",:A~YJ=7g:p_vvWX%(cEr+!kPx0D<`zo,:O)w+g7Fcr[Ojzo,:a`1JU^>?0D,`lqBzqef=S.\"0J(UEiq$9%Q^XeeF9YP+cUK,:4#ZnsG3~}%cj?8Xz!e>=`@:xpD?2a||9>f@=%.AHo%*^(o59GLx@Q)_f:_Qvk{I}5$ZqBz0bl+p)c9>%)K*{k}t;$WS^*,lahmR|$9Y)Wa$22~laSE&{UAoL/&(f8Kj%#SA8F~a$ZqBzrstv|k2~la(2!0rzeNYv%G9xf9bj`{I}|$B\"k}:e4v|k30g1NXDvqzv;WaQ)R$^X<7D9C_DX}K59rs.vJ~bI,?rc@+I}|$u8&9de4vA7/tv;dqFq^9gX1J;D*,n%RHFq$9Me.+o)zIn%a#WX</6LBJ8~#t>%$J*{Y}zsZnmGk09;1XA8hd_B(^D~Fc$_jET\"@?}nkvS.k0}%QXU\":0MOSU>FZ6Z[0yex=:~$ex=:~$ex]&Ue.^tPm>C8;km>C8(]n809HgPI\":~$.Q[}y!*u749F,8t`ex=:At,uVFzFjrhQ]}gde0eaa~B>s_oBezSu=R?lH.teODDVoc,8t`ex=:~$ex{*&Q1DVpa#Nr9`ex=:~$ex=::c0[qUD9tm\"U/lW02eb_I2NbTL<sQxk3g~(izpq`3(yB/FD}xRQ[HMFcvzT[D\"Y}v`!J=Mo{!a,|.vRG=te+r\"s`2L)[;v[*xb;v;k*D2L3WF+#*7`C8|k[I!r.Sxq}*++*uUkK1rzGYI7&6FbODKFcwtmwXQxz7=tUb`@Rtla>Un\"u(6fWazfR$C8|k?H:DxU`q|9@W^+a~R$C8|k?H:DI2ex}~2XbA!krx3_jE`qj?g)l+]BPx|_jE!0,:a$lqBz;$]{]9}nC8|krxpDYm6{FdgD>=l~Fc^%%qy8~9Fn/&|krx3_jEexFdrI`A@BPx|_jEex,:a$u8N9XeD+i]MP%L&`y8O}]`C8|k?HH_cje{]9}nC8|krx3_jEMIG.YDZn&S#t%L&`y8O}]`C8|krxH_`qod,:b$u8O}]`C8J^kH2_&`/87?o;^X|krx3_jEE7,:6L3=0GD9!r&`u8O}SD^X&S2~%LA`k8O}]`C8|k\"H$_kc8.,:D$u8O}]`TJJ^\"HL_%qe{]9}nC8|krx5Ddq!07&7W^+a~R$C8|k(H5DdqJW9~b$y8O}]`/&|k(H|_`qN{]9}nC8|krx|_%q!0s^Xe\"=$7(1%L&`y8O}]`C8|krxH_n2od,:b$u8O}]`C8J^kHW%SH$Q|G,n+^|kPx3_jEex,:a$?8~9Fn/&|krx3_jEexFd:e;J[~zI:_6Kod,:b$u8O}]`Zn$7\"Hu_?qod,:b$u8O}]`ZnS.9xpD*s8X%(]`C8|k?H:DxUn\"=9Fn/&|krx3_jE`q|9O)xU@BPx|_jE!0,:a$lq%(w)`+~B8Q}%8cA8O}]`C8J^xxF;Ymk89~b$y8O}]`C8J^\"0!DYm>G80MOSU>FZ6Z[0yex=:~$ex=:~$ex.AfJy^5iPz]8t`ex=:~$ex{*hD7@NiQHqx9`ex{*{t,uVFzFZ[0yex=::c0^VFYYezHaAv\"~H&/^P\"@0!a)LW.;f=tX%^JbC?mIs!=i*&<H8;km>C8;k??Jm*s>5nW~$ex=:~$ex=:~$GG560xs_oBezSuOJr}u.qeq2/4l{5rgj&UDf=ty%VFR|<D#ixO/}q;1JpK!YH_JEKK`f$(8WJMH\"3(~Y>\"@?G$2!re|IE@P\"[Ixt02F!Z6O3_]P\"rx3_QXA8N9?t3rw4|\"]?ND|v:.=t(^`K|/ez4+Vv})KtC8}pFSjDxs~|,:~ntv%2k00D|X;||92Xx@A7\"0!rZmzohdzsZnS.NC:D5i;|*}As}=p@af];dqWo59i#DAC.<H|_GS3|+.g).vee`I:_[XD{/}As}=p@af@%%qWo59yebAC.lIj_GS3|k}Asl+5@Zcj%Fjsq|9$atv_2cc+uQX&{!9en;JT@Fc$_#i]l*}Y)i+Y^icCD=`lq|9en>v$7F9YP#iJ74fK)@=p@\"H2_A`iq%(!nkv%.dx5D>s3|+./nMA`@mt}D5iiqj?L5bAC.dx|_GS3|4fK)9U.e/t:_#X^ohdzs1J%2k0:_1jsq|9qe.vzf*,!rZmq{ZdgD1JJ^Gf0D.SQqGzK)`+~7F9!rUEJ7m?He1JJ^F9YP$J`qGz!f>=p@RB4_)KT\"k}\"bl+Y^ccCD1Xn\"+.zsZnS.IF@;iH`qj?L5/&T@G0];Ym%Fm?%vr+<7wc@;iH\"UA9/nMA;D_QlahmQ8)?MeJvzfdx|_hmR|UA1$iq%(ceD+4GK\"0D4H.Qk}m5B[{]KB<DD2rU5+0$ex=:~$ex=:~$d7:)Ctb_3%(>C8;km>C8A3M9Jm*s>5nW~$ex{*{t,uVFzFZ[0yex=::c0^VFYYezHaAv\"~H&/^P\"~0!a)LW.;f=tX%^JbC?mIs!=i*&<H8;km>C8;k??Jm*s>5nW~$ex=:~$ex=:~$GG560xs_oBezSuOJr}u.qeq2/4l{5rgj&UDf=ty%VFR|<D#ixO/}q;1JpK!YH_JEKK`f$(8WJMH\"3(~Y>\"@?G$2!re|IE@P\"[Ixt02F!Z6O3_]P\"rx3_QXA8N9?t3r[U3~n?TL?&R.[fOD;kW&0s_ls!W0d!t[^JO\"c#`LG=u0SDk[~4T/ZP\"|ulY~PQea\"K1/.z~nd7Yf6pY^O^xD.mN5{}C.=taiDVO\"+tMJ#=9)kdQJdHm\"~jynm\"i*l`b_3SzIUup?l\",:8%>v`@:xm%jE*{I}6Li+]eX~F;1j8X%(b$FqBz+BaDjGMcd%=`u8O}]`C8|kF9K%Q+Rq+z?b/&>GF9!D<`iq+z\"b/&(f/tC_%q\"G?(gD&UU^wco%+U!0I}6nZn`@*xF;*s=ok}2#C8|krx3_jE`q$9K#Ma;~F9n%,`y8k}uB`+a~>K$_WclN,:}b/&r\"Sc;[z|J.u.uxs_*p~tC_?`[d#*?n.v;k5C8b%nDq}*z(Tr(]AG9?N?f>5r9`ex=:~$ex=:\"A5@vBIz]8t`ex=:~$ex{*hD7@NiQHqx9`ex{*{t,uVFzFZ[0yex=::c0^VFYYezHaAv\"~H&/^P\"G0!a)LW.;f=tX%^JbC?mIs!=i*&<H8;km>C8;k??Jm*s>5nW~$ex=:~$ex=:~$GG560xs_oBezSuOJr}u.qeq2/4l{5rgj&UDf=ty%VFR|<D#ixO/}q;1JpK!YH_JEKK`f$(8WJMH\"3(~Y>\"@?G$2!re|IE@P\"[Ixt02F!Z6O3_]P\"rx3_QXA8N9?t3rw4|\"]?ND|v:.=t(^`K|/ez4+Vv})KtC8}pFS2_%q38Tzwb@bwwG8g1b#WXE9)bk]r~~f,?UEj=7&jS:@o)X~m%=`8Xw}N5x@T@z,v;Ym`{<9xv/&T@_?C_Fj&{<9Z)w+ee|\"!r=`u8O}}nC8|kicn;rc\"U%()Lr+M]LB$1&`lqGz?bx@D~|t@%;jJ7u(@W[+!GR$C8|k(H|_GSQ|k}t;?,(fg:5_cjzohd{b_=D~|trusQ=8/?]`C8|k(H|_GSIoFd8B`+Y^ic5Dk2J7u(<~`AJ^icm;[X\"U%()LZnQ)9,_9=`A8O}]`/&|k?H|_z2/8r.K)n=u.qcc%HH>}FdO)]U=7>_0DHHFq$96nRDjG(H:D|i88:(9etv.edx|_GSQ|Fd8B`+l~zx5Dn#(o,}H#/&T@sbv;lS.Q,:a$u8&9}nr+xGMcK;b?d8/:ks+^|kPx3_%qex,:%eMAR~/t!r&`u8O}]`2o+\"Sc;[$JhMw*&<H8;km>C8;km>C8k;9z`L0yex=:~$ex=:43:unB9F,8t`ex=:430^VFYYezN?f>5r9`{&&6vNS;SkCPpsCjNvD*65>Wsq>_=s)Y\"Kn)`f`A/Ja/rtN?f>5r9`ex=::c:unB9F,8t`ex=:~$ex=:~$.Qof$(]X(2xz<syn,lI~Y~`AMqzF+tY4HvC.iV>WcFa8A[]R>O>3zsnv94F6/_UEu8;}yj%;;kID59V#?&N9?tC8,Jj6@?fY>\"@?G$f}!7wtJ%*pX$C8|k[I!r.Sxq}*++*uUkK1rzGYI7&6FbODKFcwtmwXQxz7=tUb=7/t}%cjM7x9YDr+2.c90D>UBKFd}ei+w^2~~%#i`{l9$aC8|kPx3_%qu8/?%Q2oS.Mcd%%qJ7u(}n/&T@_?d!b#k{K~YDr+2.R$TJ5kFc5D1j.87z)b(^p@=,!rbjy8(}55pA|k2~r;rBOBj?h)_=5kPx|_%qCdb6@W)+I7R$C8|krxH_QXCd@?MnbA;~R$2oJ^8QruQXT\"b6,n!^qq{,@%jE!0FdX#l+a~#tUsZJ@+FdD5}=p@&,g1bj.|A9Xe,+g7)CH_7U)5b6YD4S:M#t,?*2`\"K~%e.vS.9xH_DXa|j?)5pAAS8?4_#i~8O})52oT@[Ila=`iqE9Jbk]Y^Fc@;dqA|K~a$lqA9uer+kfg:YPA`g7gd2Xi+i]#t0D!i`q+z?e/vzf/H|_z2I=k}oLZnT@/0f9z2J7m?}n2ozf*x|_%qUK59Xe,+J^icj%dLRq%(#$sqA9$_>vD~>Kr[bj&{:(}ntvU^ic+u<`lq+zmb2o|krx3_%qT\"Fd$_qAp@sI:_Djlq$9N$.|A9zs.v{]KB<DD2rU5+0$ex=:~$ex=:~$MI:)R;9Qnkm>C8;km>SU>F__ezN?f>5r9`eFo~aNBi!iQHqx9`ex{*y!*u74.8#LlSv!ZGLVxnr\"D9tm\"U/lW0*QODY^n/.m5`PMwfpp:@^BxD}?)n$|nW~$ex=:~$.Qof++s;<%(>C8;km>C8;km>C8+FZ6ma)LW.;f=tN@oBFq$1SveU%0cE#%!ilCxtsSura(s3$ixOGf+%]RUM!}b`*+9]AG9??`T}<7JIeaI7G05r#1GMmG4VxnmGB>F@,Jc{bz3Y`x,:a$zo,:H#xn]3__3(D`Ed:.XVoXaVq{29BSRF:.4b8W.X;0?mfKA|@?#$wqj?r;x@D~{,x;bjlqj?]~`AT@5IC_%qn\"u(=~>vzfSb:_\"2Q.k},sq+g75bF;9L`\"k}zbq+I7oIru9Lk{k}55,+a~oIruQv=|m?X#n=!kicpD*q&{:(}ntvsG/t:_rc7o,}`L;v%.qI8zZm6{Fdw)OJC.O0}%%qsqA93L>vK]Lt`RBX&{:(1$8Xw}kbjt|k/00DeS4Ak}@n2oT@ff>%MJ&{:(D$SqA9#5/&`@\"Q}%02&{rz]~DA[~qcd%fS>}k}YX>=D~Gf!Dd9Vq%(;$dok}4#x@A7oIx;1XA|+.Y),+(fc90DfK7o,}`L@=p@(Qt[2jWo>?{e1J(fqcc%;jUKez:e/vA7kQg1hm.|@?M5bAv){xo%@su8=9Me@vT@}Q];?288>?~~2AT@t?C_QXlq+zqebA(f/Hu_>UoohdY)kv(fqc@;4HI=k}!5}=D~cc3_y9l\"k}|5`+I7oIT*=REo[}yj%;<%(>C8;km>C8;km>C8(J%&[m`L_I\":~$ex=:~$eF`f++s;<%(>C8;ksw\"LJSKMC.IeV$[}.A.[?Pm>C8;km>C8;km>C8;km>C8;km>C8:Pm>C8;km>C8;km>C8;km>C8;km>C8A321H(iNl!W0++;^O^1Yezro{U!7Ktpankm>C8;km>C8;km>C8;km>C8;km>C8;km>Ar:H;8)9xoC.[*YGODDV$>{L[19Kn)`fM_9\"zI:9rok{<7=tkvjpa#Nr9`.Qk7+j]X(2xz<syn}}@GLes@cFQ/+t;:yl!743<^&MQHXQ0yex=::c<^&MD9tm\"U/lW0/dE_dHzF+tN?f>5r9`ex=::c<^&MD9tm\"U/lW0/dE_dHzFZP<|:a!7XOd/*21Ykmb`cMG:JIM_8aXYps~U}7t.(dm%nIsw#Ln2>5nW~$ex=:~$.Qk7+j]X(2xz<syn,lY~;AS;Y^1YezL14vu0Ie7ItPm>C8;km>C8;km>Ar:H;8)9xoC.[*H_S;KF$Kps@RYvPe[fi8@J{&rtN?f>5r9`ex=:~$ex=:~$ex{*&Q1DSkjq0L]U?&2fNBE@uM5q5sb`<}p.$~&;:HR\"+tN?/r~.7Am%nUt_rziNi+4~,db_dHS6jrV#7.e:gWI2Ukk_A(,SF+y~aN=@oBL/ma@n2M:.aNM_Gw2<CsKX^aRGvf%;Nk(Yjr!R#M2fZrM_hKC{Xz=|/l=7ZrlulF./jrxo:.G:%?4oDVn/:syCtr#GTNY^~wn8wPKmVve:>jODSk|Yu(MJ`}wf;I&;EU_fiL+BeUDfn$jWte\"xs_{H$K3(iNtrz7b;J2|iR\"jrlR8rTfReK%/J(BI(Woi+4~>+!izpq`vjC#x}]GeNWn@l<?x0fRrr\"~[w/&]4R/kmIsury~30i8TK6C:9oL/r{*&Q1DSkjq0L]U?&#Gi(}%{H&o3(GgjM:.OWb@SkY>!^O2n/u(fRrr\"~[wKWJMO1p9D`~.e:HIb_Ck8_FjAUl0wf+(b@`B,F5rR#gAl7KD4o]4pc2L9b)Q9)$a.^/J5{C9|`dM+p`f{uy4k8,jBSZ!L387^XeS|\"sa5RtlI~30{uNkj{sa*s^aRGvf_%:JIz295OC7v)6f$=tPm>C8;km>C8;km>SU6XtG$[0yPI\":~$ex=:~$ex=::c<^&MD9tm\"U/lW0Apm%@JO\">D:B]}})zxs@lOS{w[0yex=:~$ex=:~$ex=:~$.Qof++m%sq>_=s)YQQl7DN>vvBQ/29MJF!n)QAQ^,J6{w[vSl0DfSDE@k2~8T?#`!!N6c~U%h2$K3(I`CMG:$~.^{FEq5rl1mM*f&xaD/4P&sa.Lq+hGs;C@yFxxG|jS)QRGuxs_{H$K3(!!s!o)+(1i$MPF9j1OC7v)6f$=tPm>C8;km>C8;km>SU6XtG$[0yex=:~$ex=:43<^&MQHqx9`ex{*X:&;Opa#A8t`ex=:M:&;Ckjq0L]U?&Tfa%E@@4l{w[0yPI\":~$ex=:~$5ore=xs_oBezSuOJz.Of@pz@BqzFpsIs#=i*&<yQnkm>C8;km>C8;k(BNLn2}7u.o;5@P\"1YezL14vZd*QE@@4.88m>;~lO7IdDulF*op(GgPI\":~$ex=:~$ex=:~$ex=:u;7@NiD9tm\"U/lW0*QE@@4bC)ssS8l_0`W<u3Sj{&u1OC7v)6f$=tPm>C8;km>C8;km>C8;k(BI(Woi+hGLVQ&aVboDz6nd7u.o;5@P\"L/d*wjf}u.@dWn,;C{VjOOC7v)6f$=tPm>C8;km>C8;km>SU6XtG$[0yPI\":~$ex=:~$ex=::c<^&MD9tm\"U/lW0Apm%@JO\">D:B]}})zxx@xUjCg9|1Ar2fNBk[jpa#Nr9`ex=:~$ex=:~$ex=:pWi83KZ7Uu6#:av)eH!J6X9z`LwXOJ&G/ps_FN+\"p9Z!3v+0U_W@{FlCxtL1=aZdu+W@@JB>s@fKG/psynLAu.6f6;jpa#Nr9`ex=:~$ex=:~$ex=:~$ex{*yj_%sq>_=s)YB0g~[fi8{H<m+tY4HvC.iV>WcFa8A[]R>O>3zsnv94F6/_UEu8;}yj%;;kID59V#?&N9?tC8,Jj6@?fY>\"@?G$f}!7wtJ%*pX$C8|k[I!r.Sxq}*++*uUkK1rzGYI7&6FbODKFcwtmwXQxz7=tA,(fF9TDA`iq$9\"s*<H.F9laNiJ7,:a$u8O}}n;vzft?!rovQqA96n1J=7GHu_SEqqGzL5ZnGe.0lahm!\"m?FnXv%./tn%z2ex,:a$~|^?8B*+!kw9tuGS^o,:g)]U.e^b:_xU.Qk}?b8r}fxx@%,Sodez}ni+i]R$C8J^Mc$_#X!0k}x;]U|~5bv;&`8X$96n/&T@RtK%%qqq$9[$lqj?5$OKk}N5}=R~Zcj%%qwqGz]`C8|krx^%$Jy8/:w)XvsGqP>%%qk8O}]`C8|kic5D*2*{k}t;&UM^X~2D;jn\">?{e/vA7kH:D#X*{k}wX_=p@$~f9}qv{Vd/nkv`@Ebs;Ymm\">?X#>=U^F99;&UWorz}nbAn)%xj%DXKK,:O)l+,7/tp_z2zo,:h_DAmG8K5DNin\"qz$)OJmGoIx;$mIoK~K)9UxGF99;dq&{rz$)Xvu.#t0DpKqqBzeW4J|kg9!r&`u8O}}nbA>Gdx|_8cqq}~kstv5k3f:_<`u8O}]`/&`@BtF;1Xvqrzx%P+.e@Hd%SH3|*}kbMAQ)oI}%[jqqA9,n/vzf_Q1{xs2\",:S#r+RGt?$1hm:o,:%e/vQ)cbYP)Ka|FdO)w+kfk00DJEM7/}Ibf=A7|tp_A`lqBz?e.vD~<06Lhm~|,:a$lq%(O)8r.e/t:_Pc38N9/nkvqqrx|_}qiqFd8B`+!kcc5Ddq88Xz5$sqA9_jr+", "/sD+i],C|_XEA8O},nr+kfqc+u2H*{k}YXZnT@Px!D/sh\"qz0bbAF]%x|_8cX||9/nkvqqicpD=`u8&92X/vzf&,lahm38:($abAF]Z9Q_%q&{m?der+,7*xH_}q*{k}YX2oT@/0A_N?f>5r9`ex=:~$ex=:~$ex=:~$.Q[}yj%;<%(>C8;km>C8;km>C8;km>SU^BQHXQ0yex=:~$ex=:~$ex=:~$.Q9~4kb@xU;0<?JSj.a(s31^cF./<9Tvyll}O51iQBrxs;%unMwfE;QJ02f/ez3nd7u.o;5@P\"L/d*wjf}u.@d8WlF7{?jjS?&6]2~1DaCoc,8t`ex=:~$ex=:~$ex=:~$ex=::c0[qUD9tm\"U/lW0;%S;SkxD.menex`.1f5@P\"U\"p(?V2KV6xR;J9Gew:slR?8Y}R30[qUB>Z@#XboUuoXU\"=:zdJ2.SjCxt.S`xv6(dQ[k4JCxt&`u8N9;$zo806c]@iFA8hL3L8lW0d!t[^JO\"c#`LG=u0[:eak;/0!rLxd8,:a`C8|krx3_QX!059%QC8`@G0!rZm*F,:>f2J5kgcc%=`8Xj?pfLvK]>Ko%;jn\">?GL\"=p@O~>DhmN{F~0b1JC.X~g1ZmqqFdO)`+U^Fc$_;jlq$9x%>vjG/H|_}q||A9/nCAD~oIs;dq&{=9,nr+C.,C:D*q`q+zw)BJU^X~:_Ni`q+zMn2oK]zx|_SHk8&9o``+a~{,>%%q88>?pf6U5kic^%A`sq$9;$lqw}N$sq%(O)6Uqqxxt[Ym||k}|5pAT@jb:_WU*{k}C#(^A7\"02DYm3|Fdg)}=U^ic5DbjSqj?ye;vzfZ9oDdq&{=9gDf=A7/t:_>UT\"k})n(^p@(Hu_CH`q^?ye/vA78K5D1Xvq@?%QC8|k8Q9;YmhK,:w)@=5kic3_QvSKu(K).v|kicn;DjJ7>?$abAU^F9x;aqUK=9/n,+I7{,0DxU[dk}6npAT@Eb!rZmL|FdO)kv|kccm;Djlqw}$_DA.e/t0DCHn\",:w)>=Q@PxH_z2+G<}l51J[~/t:_>U!0k}#$lqw}D$sqGzZ_I+g78Q2D1XJ7@?##tv:.`I0D5i.Qk}6nRD$7gc>;hmN{I}\"btv*f/t:_4HAA=9%Q2oA7Zc|_>sD{I}=sbA\"osb0DeSMIY}/nq+I7%x|_>sU\",:9b/&=7rPp_%qu8O}]`C8|k/0!r%nDq}*hDOiKpa#Nr9`ex=:~$ex=:~$ex=:43aD<%]Sqx9`ex=:~$ex=:~$ex=::cv_*S|/xjynDvYfL;5U}]o{iL\"UiUd)?@;JpK!YJ9sRV.l7m;lA#~x7x;1jrlkf$WI+H.B>s_oBezSu/S6+gf7Lb_DVp{5rroUM574VoX}q>_.men$|nW~$ex=:~$ex=:~$ex=:~$ex=:u;OiJkjq0L]U?&hGApm%+2PFK??`6l(fDAS;?p~t0D_nOBPeHs@SjO;03_jE!0tzLXXv;kJCrz^U?&#GvNF;z].fxR@s$.k}4b[2A7rxTD$JhM_0IeK>=:~$ex=:~$ex=:~$ex=:~$.QF~UbE_/JD9}RynA8W0U_}]P\"yQxtQX?&/?ktyv<%(>C8;km>C8;km>C8;km>C8;k(Bf9\"|w+(~JI@&#X;0P9GgPI\":~$ex=:~$ex=:~$ex=:~$ex{*eA1i(2(8)93YQQqzG$[d#*|#Yv;k5Cxt5i\"K4*&<H8;km>C8;km>C8;km>C8;km>SUBqxDqz4QurY*&<H8;km>C8;km>C8;km>C8;km>Ar@J{&sa)LN+Zd++*u9pK<:(4#U0ayG$Ed:.XVoXCJ>G+tNDeUwf~9t^{HxDSu+[I5eegL<u3|VK=s%LOBN7Q01DoBh>EayH5qSPW[;y[~Bbb_dHzFmacQ[.c{Q$<}H.2eN@6KtG+tNDeUwfYD&;]J;0|_0n.Q!7vNODg^n8{Lz|#MD*YG1J.eB>~i{HO\"29OjgJl7pN5@P\"HY.m~n.Ql7DN`ANi9oDz)YqNte@0W@9\"D9TsaLs!W0teS;Z^6z29Oj,lu.a%k[oizF2L#ja.ZdE;ODg^!/tmJv#=q.[f)2S^B/<LI|~l?6/db@>FEq2LLSPX})&dR=?Fp{>Dl18lY~.H?i!ip{OupStr\"~zxt]P\"Utxt@K?&&99tC8@J{&6|IsavRG=t9Ur\"QH!ryCXvF(43RiPcVKhu1O4.v)6fi8*pK<n%?`DlW0|5>WlF*op(31#MOfRVQ&v)ocZL^s~vPe[f@&5iH\"|[GStr\"~[wC8BFn809#`vlW0VX>W9w;0@;:n.Ql7DN(,|iX\"~jyne{>?XO`2pKs`fL<sPae:yx~ri]HB=_~U9}H.m$5o;f++m%TO;0^%_n!0#*PsWa;kL/d*o9hJ]GJIeaa~9,xt%~Hv3&vNF;IJ>X=_~U9}H.m$5o;f++m%TO;0d%0n!0#*?nEA+\"zI29SS#5H.GNL^P\"*xxtqQw+l730OrT3vI=(Wo]U}*J#M_MFQHqx9`ex=:~$ex=:~$ex=:~$ex=:l`b_3SzIUuTj<o,:KXaD`@K~}%02J7rz;$u8O}}nC8|kXBW%<`qq}~Y)MA5kFcCD=`u8O}}nZn`@dxo%SHxl$9deQv]Bgc$_fSOBk}6LD+i]R$/&J^Ix3_Fje{VdcX+^T@h~m%,`lqGz=sw+i]R$/&|k?HH_SH>}>?,n>=R~Gfv;tc!0k}`Li+!krx3_%qMIk}[$#\":0SDk[~4T/Uu.vu8Y}G$takfd@.^HMH\"3(~YQQ80MOdQnkm>C8;km>C8;km>C8;km>C8A3__3(D`!!W03ND+I7Ktb%$J7o,:Z)QvsGR$C8|kPx3_@KQ.rzSD\"=0G\"0@%MJn\"m?]`C8|k(Ho%SHOBk}^~QJu.c9v;T2J7rz;$Fq$94#C8|krx5D.Kex+.,nn=D~KtL_#i{Fqz}n1J:.(Q!r&`u8&9$abAU^cc^%oqA8&9;$a|^?,n_=D~XtL_#i{Fqz}n1J:.(Q!r&`u8&9$abAU^cc^%oqA8&9;$a|^?,n_=D~XtL_#i{Fqz}n1J:.(Q!r&`u8&9$abAU^cc^%`nOBreY~eam\">G>?=R$|nW~$ex=:~$ex=:~$ex=:~$ex=:430[qUQHqx9`ex=:~$ex=:~$ex=::c5Acpa#A8t`ex=:~$ex=:~$.Q[}.A.[<%]Sqx9`ex=:~$ex=:~$5ore=xs_oBezSu.veUwf`fE@94h\"aj<s)Q!77N>v*2*omrL1=au0IeK>=:~$ex=:~$ex=:~$ex{*&Q1DSkjq0L]U?&P)`NJ2!i`Iv?nLgAi*S5\"%NXPF}?f#W.RG!$eF`f++s;<%(>C8;km>C8;km>C8;km>SUPcVKmazb?&y~aNj2pKB>s_oBezSu/S6+gf7Lb_DVp{Ou$ifo8?F5e+*foPnN}ceF`f++s;<%(>C8;km>C8;km>C8(]21H(N?m#nW~$ex=:~$.Q[}.A.[<%(>C8;ksw#Ln2>5nW&<UU6XtGZut`ex=:~$ex=:~$ex=:~$ex=:~$ex=:~$ex{*.Aeusq>_=s)YqN!7A!$WnBG/+tHaAv\"~H&/^P\"/0w[0yex=::c<^&MD9tm\"U/lW0++;^O^9D3(|18q6AfJy^5iPz|[Fa{Ug*&<H8;k(BRzevx}1fiV>WnBG/ZP;1C.(fdQE@@4l{w[`1~lv)=^.^IqPF!L|`IM*fl&E@w2+X!aj1&+9)!;@&Ni?8,jlSPa[}NwdQd%(>C8;kYtY1I`(nl75;4o[k+/:9RR[.e:teh=tPm>C8A321H(evx}1fiVoX^JL\"aj<s8q5+0$ex=:~$ex{*.Aeusq>_=s)YI7l7@NJ2!i`Iv?nLgAi*tN.^}F3~!ao1&+9)!;CU6XtG$[0yex=:~$ex=:M:&;Ckjq0L]U?&Tfa%E@@4bCfL<s~lH.&x:u\"2H\"rtN?m#nW~$ex=:~$ex=:~$5ore=xs_oBezSu.veUwf`fE@>FZqn?3n$|nW~$ex=:~$ex=:~$ex=::c<^&MD9tm\"U/lW0Apm%@JO\">D:B]}})2th=tPm>C8;km>C8;km>C8;km>C8;k??Jm*s}7u.o;5@P\"f8TsLRulif.NW@9\":71mkb.F`f++s;<%(>C8;km>C8;km>C8;km>C8;k(B&LJSKMC.l&/^P\"i7;mkbQx4~>+!izpq`Dz:lmd2&(Q,u*\"KB=__C:a9)[wdQnkm>C8;km>C8;km>C8;ksw#Ln2>5nW&<H8;km>C8;km>C8;km>C8`XtGsa)LW.;f=t*2!iL/ezwjK+Yf@ps;jpa#Nr9`ex=:~$ex=:~$ex=:~$ex{*&Q1DSkjq0L]U?&P)`NJ2!i`Iv?nLgAi*XWn%`3M9Jm*s>5nW~$ex=:~$ex=:~$ex=:~$ex=:At,uVFzFmazb?&6]:+n%z\"D9tm\"U/lW0^pBi,J=D7zdC#=i*430^VFYYezN?f>5r9`ex=:~$ex=:~$ex{*X:&;Opa#A8t`ex=:~$ex=:~$ex=:~$5ore=xs_oBezSu.veUwf`fE@94h\"aj<s8q5+0$ex=:~$ex=:~$ex=:~$ex=::c:unB.8)9xoC.[*13K%dHzFZP<|:a!7XO<PyHT/N[$J9}H.IeK>=:~$ex=:~$ex=:~$ex=:~$.Qv~aNBi!i^b!Lynwev)%@OD;kjq0L]U?&#GTNY^~w~KXmJS8q}*{t,uVFzFZ[0yex=:~$ex=:~$ex=:~$.Q[}.A.[<%]Sqx9`ex=:~$ex=:~$ex=::c<^&MD9tm\"U/lW0Apm%@JO\">D:B]}})2th=tPm>C8;km>C8;km>C8;km>C8;k??Jm*s}7u.o;5@P\"f8TsLRulif.NW@9\"Bfo?kbr}:.gc!JPcVKZ[0yex=:~$ex=:~$ex=:~$ex=:~${&&6vNS;SkH\"UuUp`}C.le\"%I2B>s_oBezSu6#VvJefJ3btcP&rtEO1\"&6vNS;Vpa#Nr9`ex=:~$ex=:~$ex=:43<^&MQHqx9`ex=:~$ex=:~$eF(7+j$=tPa#Nr9`ex=:~$ex=::c<^&MD9tm\"U/lW0Apm%@JO\">D{Bx}wfXOdQnkm>C8;km>C8;km>C8;kCIn?!`]vI~s;easqzFpsIs~l_)`NJ2!ioc,8t`ex=:~$ex=:~$ex=:~$ex=::c:unB.8)9xoC.[*13K%dHzFZP<|:a!7XOl<fKMq<D{BUJY*&<H8;km>C8;km>C8;km>C8;km>=aaVr&;z#`NvD*Dg`^fK5{!a)LW.;f=tl2KFT/@R%s?lYfXOSU+qP&Ts<s>5nW~$ex=:~$ex=:~$ex=::c{+:H]F,8^?f>5r9`ex=:~$ex=:~$ex{*.Aeusq>_=s)YI7d)pNODKF7wqz<|eU%0IeK>=:~$ex=:~$ex=:~$ex=:~$.Qof++m%sq>_=s)Y\"Kn);AS;Y^9D3(|18q#,t+K%(]n809HgPI\":~$ex=:~$ex=:~$ex=:~$ex{*y!*u74.8T?@Y\"KMft+F;;kjq0L]U?&#GTNY^~w~KXmJS8q}*{t,uVFzFZ[0yex=:~$ex=:~$ex=:~$.Q[}.A.[<%]Sqx9`ex=:~$ex=:~$ex=::c<^&MD9tm\"U/lW0Apm%@JO\">D:B]}})2th=tPm>C8;km>C8;km>C8;km>C8;k??Jm*s}7u.o;5@P\"f8TsLRulif.NW@9\"cIN(gX3vI*hD7@NiQHqx9`ex=:~$ex=:~$ex=:~$ex=:At,uVFzFmazb?&6]@!t[^JS{!a)LW.;f=tl2KFT/@R%s?lYfXOSU+qP&Ts<s>5nW~$ex=:~$ex=:~$ex=::c{+:H]F,8^?f>5r9`ex=:~$ex=:~$ex{*.Aeusq>_=s)YI7d)pNODKF7wqz<|eU%0IeK>=:~$ex=:~$ex=:~$ex=:~$.Qof++m%sq>_=s)Y\"Kn);AS;Y^9D3(|18q\",++Q[`3M9Jm*s>5nW~$ex=:~$ex=:~$ex=:~$ex=:At,uVFzFmazb?&6]&QP2LiB>s_oBezSu6#VvJefJ3btcP&rtEO1\"&6vNS;Vpa#Nr9`ex=:~$ex=:~$ex=:43<^&MQHqx9`ex=:~$ex=:~$eF(7+j$=tPm>C8;km>C8(]21H(N?f>5r9`eF(7+j$=tPa#Nr9`.QL:te^Xk4O\"0s`Ltre{OGU;@Jn/ez5`k|4*&<H8;k(BNLn2}7u.o;5@P\"!/p9<|eU%0IeK>=:~$ex=::c<^&MD9tm\"U/lW0/dE_dHzFZP<|:a!7XO.S!iS{;z/UwB=:+pM@w2$K3(fR5d|6IeK>=:~$ex=::c<^&MD9tm\"U/lW0/dE_dHzF$15R4vl7pNWn<%]Sqx9`ex=:~$ex=:~$5ore=xs_oBezSu.veUwf`fE@>FZqn?3n$|nW&<H8;km>C8;km>C8;km>C8`XtGsa)LW.;f=t*2!iL/ezwjK+Yf@ps;jpa#Nr9`ex=:~$ex=:~$ex=:~$ex{*&Q1DSkjq0L]U?&P)`NJ2!i`Iv?nLgAi*WpI2UkaY3(jE5.Pe;AS;`3M9Jm*s>5nW~$ex=:~$ex=:~$ex=:~$ex=:At,uVFzFmazb?&6]7pI2mQY\"y5^U|vPe[f8Wsq>_=s)Y`x})(@.^lb.85(3nEo[}y!*u749F,8t`ex=:~$ex=:~$ex=:~$eF(7+j$=tPa#Nr9`ex=:~$ex=:~$ex=:M:&;Ckjq0L]U?&4~[fE@|ijCvzqSGMC.XOdQnkm>C8;km>C8;km>C8;km>C8A3n809#`]vI~s;eay4h\"aj<s>oPeW7ODjpkY9j6L6+*,^pK%(]n809HgPI\":~$ex=:~$ex=:~$ex=:~$ex{*y!*u74.8T?@Y\"KMfM(_%/J2QDzfnd7u.o;5@P\"LYpsN1D}J.<!k[jpsw\"LJSKMC.IeK>=:~$ex=:~$ex=:~$ex{*X:&;Opa#A8t`ex=:~$ex=:~$ex=:~$5ore=xs_oBezSu.veUwf`fE@94h\"aj<s8q5+0$ex=:~$ex=:~$ex=:~$ex=::c:unB.8)9xoC.[*13K%dHzFZP<|:a!7XOMHEUJqC9G+x}H.43:unB9F,8t`ex=:~$ex=:~$ex=:~$ex=::c0^VFYYeziNl!W0<N<isUQ/i:xo@==:i~P29F;0,jBSZ!L39f7@VFoc;[PndaYf[f$=tPm>C8;km>C8;km>C8;k(B=_(|sU5+LGK>=:~$ex=:~$ex=:~$ex{*.Aeusq>_=s)YI7d)pNODKF7wqz<|eU%0IeK>=:~$ex=:~$ex=:~$ex=:~$.Qof++m%sq>_=s)Y\"Kn);AS;Y^9D3(|18q#,M(_%/JiSS9yC.F`f++s;<%(>C8;km>C8;km>C8;km>C8;k(B&LJSKMC.l&/^P\";\"[m.[8lz=`f/[;kjq0L]U?&#GTNY^~w~KXmJS8q}*{t,uVFzFZ[0yex=:~$ex=:~$ex=:~$.Q[}.A.[<%]Sqx9`ex=:~$ex=:~$ex=::c<^&MD9tm\"U/lW0Apm%@JO\">D:B]}})2th=tPm>C8;km>C8;km>C8;km>C8;k??Jm*s}7u.o;5@P\"f8TsLRulif.NW@9\">1GmXSW.teY~CU>F__ezN?f>5r9`ex=:~$ex=:~$ex=:~$.Qv~aNBi!i^b!Lyn)dC.nNP20HFq+tevx}1fiV>W@4fm2L,{i+=6Vt3r(]A/p(BR]U5+0$ex=:~$ex=:~$ex=:~$eF(7+j$=tPa#Nr9`ex=:~$ex=::c{+:H]F,8t`ex=:~$ex{*X:&;Opa#Nr9`.Q[}.A.[<%EE=_(|sU;W~$ex=:~$ex=:~$ex=:~$ex=:~$ex=:~$.Qk7+j]X(2xz<synrlH.4e]@mUp{5rhQ]}gde0eaI7oc,8t`ex=:M:&;Ckjq0L]U?&))q(.^mFH\"Pm~nTG:)Ctb_o3vIn?4gPI\":~$.Q3)U_W@{FlCxtWoS!gddd!ifK<8TsLR@=i*+p/^8U!8fLVj1dOfSDM_VFPF9joLd7mG6f;^Jk(GXz>n6+I~#AS;Q3Wx$[0yPI\":~$.QL:teC8(J~/.ml1LNKdIeK>=:~$5ore=xs_oBezSuOJz.Of@ps;jpa#Nr9`ex=:~$5ore=xs_oBezSuOJz.Of@pz@mFH\"Pm~nEo[79d(i^Jsw#Ln2>5nW~$ex=:~$.Qk7+j]X(2xz<syn,lY~;AS;Y^1YezL14vu0Ie7ItPm>C8;km>C8;km>U=E^$>1u(|?r4~>+!izpN9DzBShJwfj3K%dHzF+tN?f>5r9`ex=:~$ex=:~$ex{*&Q1DSkjq0L]U?&P)`NJ2!i`Iv?nLgAi*+A=@/Js`:9~U.F`f++s;<%(>C8;km>C8;km>C8;km>AroBA/rzevx}1fiVoX>OH\"T9cj@+!7W@d2jOoc,8t`ex=:~$ex=:~$ex=:~$ex=::cI;tcP&sazb?&6]GA=@/JMPps6n.Qm3=deasq./TLenF+:06c5A5i;/p(N?f>5r9`ex=:~$ex=:~$ex=:~$.Qof++s;]3M9Jm*s>5nW~$ex=:~$ex=:~$ex=::c{+oBA/rzN?f>5r9`ex=:~$ex=:43<^&M]xY16gPID+0$ex=:~$ex=:~$.QL:teC8`XtGsa)LW.;f=t*2!iL/ezwjK+Yf@ps;jpa#Nr9`ex=:~$ex=:~$ex=:u;7@NiD9tm\"U/lW0*QE@@4bC)ssS8l_0`W<u742<*zxwC7v)6f$=tPm>C8;km>C8;km>C8;k(BWm@n3vG:i~P29F;0Is,|c.mGw_L^Vq[{DzTn$|nW~$ex=:~$ex=:~$ex=:~$ex=:Z&m%;Va8T?@Y\"K*~aN=@w2s{5rHK?lD*H_L^Vq[{DzTnEo[}vf7@VFQHqx9`ex=:~$ex=:~$ex=:~$ex=:u;7@NiKB<D{BUJY*&<H8;km>C8;km>C8;km>C8(]>_<LfL>5nW~$ex=:~$ex=:~$eF(7+jTrE^qc,8^?f>5r9`ex=:~$ex=:M:&;Ckjq0L]U?&4~[fE@|ijCvzqSGMC.XOdQnkm>C8;km>C8;km>C8;k??Jm*s}7u.o;5@P\"f8TsLRulif.NW@9\"#0:L[1LN})ddCU>F__ezN?f>5r9`ex=:~$ex=:~$ex{*>+y^*2D9tm\"U/lW0hs\"%Yq)C)9#1:.[~EBWn<%(>C8;km>C8;km>C8;km>C8;k(B`?:Bdae:e0eaVR0_9j2?Vv57G$@}a)jVoXeS%zK?5RU=i*43I;tcP&$[0yex=:~$ex=:~$ex=:~$ex=:~$GGv)6fTr(]n809HgPI\":~$ex=:~$ex=:~$ex=:43x@9qEqZ[0yex=:~$ex=:~$ex=:~$.Qof++m%sq>_=s)Y\"Kn);AS;Y^//=scXN+Yf@ps;jp01=s@n8l1fdWn%Sk//xjIs,}|6uxT^`BL/0sAUYxM7!%2iyHS6ma<s9KxG9d(i^JxxL!yCLNI~/x<^,J/t!sSvZ!(fQ$1!Yf=^\"%I23~0LXSgAq:43:unB9F,8t`ex=:~$ex=:~$.Q[}.A.[<%]Sqx9`ex=:~$ex=:~$5ore=xs_oBezSu.veUwf`fE@94h\"aj<s8q5+0$ex=:~$ex=:~$ex=:~$GGv)6f]X(2xz<synK+Yf@pz@mFH\"Pm~nZ{X.;A@&|i]C^*fRrr\"~[wdQnkm>C8;km>C8;km>C8;k2B:9D1q+4~>+!izpN9xRsS]+hd;I)2oCaYd*GgPI\":~$ex=:~$ex=:~$ex=:~$ex{*vf7@VF^b!Lyn)dH.;AOD/JWDrt,S/rl7=ts_,Jtm<L~c8q}*2&m%;V,F,8t`ex=:~$ex=:~$ex=:~$ex=::c:unB9F;[$J9}H.IeK>=:~$ex=:~$ex=:~$ex{*&~1D=J{F,8t`ex=:~$ex=:~$ex=:~$GGv)6f]X(2xz<synK+Yf@pz@6X%zT9=|YvPe[fWnDQxzaja`CM:..AODHkiP!s_BtlH.&x`2pK/trz[`@}a)b;]XWU/tez<|Pa[}&Q1DVpa#Nr9`ex=:~$ex=::c{+:H]F,8^?f>5r9`ex=:~$ex=:pWpANkCIn?!`]vI~s;easqzFpsIs~l_)`NJ2!ioc,8t`ex=:~$ex=:~$ex=:~$GGv)6f]X(2xz<synK+Yf@pz@mFH\"Pm~nTG{)f0X^6KzIC9ZQdawf43:unB9F,8t`ex=:~$ex=:~$ex=:~$5oI~{dn%sq>_=s)YI7>3.NE_w^9o2L8l_M^3XOdQnkm>C8;km>C8;km>C8;km>C8A3PFXmJSl0<7=tKC~4K\"vjKX\"5>G{!n%*\"zI@*!1?&4~zdI2zq6ortEO,{C.<!k[<%(>C8;km>C8;km>C8;km>C8;k(BI(Wo]U}*hD7@NiQHqx9`ex=:~$ex=:~$ex=::c{+oBA/rzN?m#nW~$ex=:~$ex=:~$ex=::c:unB.8)9xoC.[*13K%dHzFZP;1C.(fdQE@@4l{w[=qe}n)\"x|iI221C9|`bd.:ddQ^aVK\"HPvii!H.dWm%dHn8hL?|q+2f(x,2SkH\"=(viG=Je43:unB9F,8t`ex=:~$ex=:~$.Q[}.A.[lk0Hw[0yPI\":~$ex=:~$ex=::c.&X^(BNLn2}7u.o;5@P\"1YezL14vZd*QE@@4l{w[0yex=:~$ex=:~$ex=:~$.Qof++m%sq>_=s)Y\"Kn);AS;Y^9D3(|18qwkpN\"%<BrDkm.L.F`f++s;<%(>C8;km>C8;km>C8;km>AroBA/rzevx}1fiVoX>OH\"T9cj@+!7W@d2jOoc,8t`ex=:~$ex=:~$ex=:~$ex=::cI;tcP&sazb?&6]6fE@QBrDkm.LQx2f^Q.^P\"9o2L8l_M^3XOSUhS.85(igPI\":~$ex=:~$ex=:~$ex=:~$ex{*&Q1DVpswk(Wo]U5+0$ex=:~$ex=:~$ex=:~$eFW.jtM_Vpa#Nr9`ex=:~$ex=:~$ex=:u;7@NiD9tm\"U/lW0*QE@@4bC#LAUcAPe`NJ2!ioc}NdCN+;fdW]X~4K\"vjKX9KRG`fi8`BS6C9|`JJtex+n%wSn8~mhQn=L343:unB9F,8t`ex=:~$ex=:~$.Q[}.A.[lk0Hw[0yPI\":~$ex=:~$ex=::c<^&MD9tm\"U/lW0Apm%@JO\">D:B]}})2th=tPm>C8;km>C8;km>C8;k(BI(Woi+4~>+!izp{wqz<|eUhd;A*u/Joc3:BSN+TfaAY^p3M9Jm*s>5nW~$ex=:~$ex=:~$ex=::cx@9qEqma)LW.;f=t|idH)z]jpvi!Y~StU%k\"QHqx9`ex=:~$ex=:~$ex=:~$ex=:Z&m%;Va8T?@Y\"K*~pNJ2Pc?mC9?`@}a)jVoXeS%zK?5RU=i*43I;tcP&$[0yex=:~$ex=:~$ex=:~$ex=:~$GGv)6fTr(]n809HgPI\":~$ex=:~$ex=:~$ex=:43x@9qEqZ[0yex=:~$ex=:~$ex=:~$.Qof++m%sq>_=s)Y\"Kn);AS;Y^//=scXN+Yf@ps;jpwI!L|`&v=7.NJ2!i5qjrxo;l(fa3>%44VYpsJv]}})zxr2`BPFA(5`rrPekd{u(]n809HgPI\":~$ex=:~$ex=::c{+:H]F,8^?f>5r9`ex=:~$ex=:M:&;Ckjq0L]U?&4~[fE@|ijCvzqSGMC.XOdQnkm>C8;km>C8;km>C8;k??Jm*s}7u.o;5@P\"f8TsLRulif.NW@9\"`,zzN`I5>G`f5@p3M9Jm*s>5nW~$ex=:~$ex=:~$ex=::cx@9qEqma)LW.;f=t|idH)z]jpvi!Y~StU%k\"QHqx9`ex=:~$ex=:~$ex=:~$ex=:Z&m%;Va8T?@Y\"K|7zQo<xU$K=s~n.Qm3=deasq./TLenF+:06c5A5i;/p(N?f>5r9`ex=:~$ex=:~$ex=:~$.Qof++s;]3M9Jm*s>5nW~$ex=:~$ex=:~$ex=::c{+oBA/rzN?f>5r9`ex=:~$ex=:~$ex{*&Q1DSkjq0L]U?&P)`NJ2!i`I2L4v&}n);AS;z\"`,Om<|j.e:LeK%xq!8#L>;v!0.&xpu,J.8<RyCl0(fux?iKFiSDz,|#M**hD7@NiQHqx9`ex=:~$ex=:~$eF(7+j$=tPa#Nr9`ex=:~$ex=::c<^&MD9tm\"U/lW0Apm%@JO\">D:B]}})2th=tPm>C8;km>C8;km>C8;k(BI(Woi+4~>+!izp{wqz<|eUhd;A*u/Jocp#JSF+!7C~CU>F__ezN?f>5r9`ex=:~$ex=:~$ex{*>+y^*2D9tm\"U/lW0hs\"%Yq)C)9#1:.[~EBWn<%(>C8;km>C8;km>C8;km>C8;k(B`?:Bdae:e0eaVR\"/Tsc#mdu.G$@}a)jVoXeS%zK?5RU=i*43I;tcP&$[0yex=:~$ex=:~$ex=:~$ex=:~$GGv)6fTr(]n809HgPI\":~$ex=:~$ex=:~$ex=:43x@9qEqZ[0yex=:~$ex=:~$ex{*X:&;Opa#Nr9`ex=:~$ex=:OGK>=:~$ex=:~$ex=:M:&;Ckjq0L]U?&4~[fE@|ijCvzqSGMC.XOdQnkm>C8;km>C8;km>C8;k??Jm*s}7u.o;5@P\"f8TsLRulif.NW@9\"$t#(BRCAl7x@CU>F__ezN?f>5r9`ex=:~$ex=:~$ex{*>+y^*2D9tm\"U/lW0hs\"%Yq)C)9#1:.[~EBWn<%(>C8;km>C8;km>C8;km>C8;k(B`?:Bdae:e0eaVR\"/Ts)nAlk~StC8.w;/Uu.vi!Y~StU%k\"KB<D&s?lYfIeK>=:~$ex=:~$ex=:~$ex=:~$.Qof++s;]3M9Jm*s>5nW~$ex=:~$ex=:~$ex=::c{+oBA/rzN?f>5r9`ex=:~$ex=:~$ex{*&Q1DSkjq0L]U?&P)`NJ2!i`I2L4v&}n);AS;z\"cIHLXSUMj3\"x9@`Bq{^*(1ul3./x([nB^zsa*se+TfaAY^yFswk(Wo]U5+0$ex=:~$ex=:~$.Q[}.A.[<%]Sqx9`ex=:~$ex=:~$5ore=xs_oBezSu.veUwf`fE@94h\"aj<s8q5+0$ex=:~$ex=:~$ex=:~$GGv)6f]X(2xz<synK+Yf@pz@mFH\"Pm~nTG(~9d]XvB\"mN[$J9}H.IeK>=:~$ex=:~$ex=:~$ex{*>+y^*2D9tm\"U/lW0hs\"%Yq)C)9#1:.[~EBWn<%(>C8;km>C8;km>C8;km>C8;k(B`?:Bdae:e0eaVRy_xjV@AvXeG$@}a)jVoXeS%zK?5RU=i*43I;tcP&$[0yex=:~$ex=:~$ex=:~$ex=:~$GGv)6fTr(]n809HgPI\":~$ex=:~$ex=:~$ex=:43x@9qEqZ[0yex=:~$ex=:~$ex=:~$.Qof++m%sq>_=s)Y\"Kn);AS;Y^//=scXN+Yf@ps;jpx{29j14v;f*91ig2D9DzTL|vreV(@&|i]C^*MJ9}Xeb;VWsqxzps~Uz.NdZr<i}Fa809AU.F`f++s;<%(>C8;km>C8;km>C8(]21H(N?f>5r9`ex=::c{+:H]F,8t`ex=:43<^&MQHXQ0yex=::c.&X^R$8@Fq]CC9BSLNKdIeK>=:~$.Qk7+j]X(2xz<syn,lY~;AS;z\"QHqx9`ex=:~$.Qk7+j]X(2xz<syn,lY~;AS;Y^9D3(|18qz<>+k^w2$K3(fR5d|6Ie7ItPm>C8;km>C8`XtGsa)LW.;f=tN@Vq9DDzVj:MC.^dm%*\"QHqx9`ex=:~$ex=:~$5ore=xs_oBezSu.veUwf`fE@94h\"aj<s8q5+0$ex=:~$ex=:~$ex=:~$GGv)6f]X(2xz<synK+Yf@pz@mFH\"Pm~nZ{*6ppK%oB</u(fRrr\"~[wdQnkm>C8;km>C8;km>C8;k2B:9D1q+4~>+!izpN9xRsS]+hd;I)2oCaYd*GgPI\":~$ex=:~$ex=:~$ex=:~$ex{*vf7@VF^b!Lyn)d&6ppK%oB</u(?`@}a)jVoXeS%zK?5RU=i*43I;tcP&$[0yex=:~$ex=:~$ex=:~$ex=:~$GGv)6fTr(]n809HgPI\":~$ex=:~$ex=:~$ex=:43x@9qEqZ[0yex=:~$ex=:~$ex=:~$.Qof++m%sq>_=s)Y\"Kn);AS;Y^//=scXN+Yf@ps;jpb,TsVjAvPeVWn%GwR$W@Fq%zmrhX&+;fdWm%Jkn8ajN1trF6zdm%:Ja/kml`~.e:&d1D*q}X<D{BUJY*&<H8;km>C8;km>C8A3vIn?4gPID+0$ex=:~$ex=:~$.QL:teC8`XtGsa)LW.;f=t*2!iL/ezwjK+Yf@ps;jpa#Nr9`ex=:~$ex=:~$ex=:u;7@NiD9tm\"U/lW0*QE@@4bC)ssS8l_0j`a@+c>_TLKX.F`f++s;<%(>C8;km>C8;km>C8;km>AroBA/rzevx}1fiVoX>OH\"T9cj@+!7W@d2jOoc,8t`ex=:~$ex=:~$ex=:~$ex=::cI;tcP&sazb?&6]cbM_\"2xzC96n.Qm3=deasq./TLenF+:06c5A5i;/p(N?f>5r9`ex=:~$ex=:~$ex=:~$.Qof++s;]3M9Jm*s>5nW~$ex=:~$ex=:~$ex=::c{+oBA/rzN?f>5r9`ex=:~$ex=:43<^&M]xY16gPID+0$ex=:~$ex=:~$.Qk7+j]X(2xz<syn:MC.^dm%h^f8TsLR@=i*&<H8;km>C8;km>C8;km>C8+F__ezevx}1fiVoXtc9DDzVj@}wfIdWnK`P&;zQLW.57Ixv@;Xf/=(fRrr\"~[wdQnkm>C8;km>C8;km>C8;k2B:9D1q+4~>+!izpN9PmzbgAu0IeK>=:~$ex=:~$ex=:~$ex=:~$.Qof++m%sq>_=s)YI70.e0ODg^(_tmL18q}*hD7@NiQHqx9`ex=:~$ex=:~$ex=:~$ex=:Z&m%;Va8T?@Y\"K*~aNU%\"2xzC9Y&AvreE;8WlF!8iLyn\"}H.?d8WhKL/Xmyn3|80OG&;?p~tp__nlNI~VV>W.e<0w[0yex=:~$ex=:~$ex=:~$.Q[}>+y^*2QHqx9`ex=:~$ex=:~$eF(7+j$=tPa#Nr9`ex=:~$ex=::c<^&MD9tm\"U/lW0Apm%@JO\">D:B]}})2th=tPm>C8;km>C8;km>C8;k(BI(Woi+4~>+!izp{wqz<|eUhd;A*u/Joc%yxoN!3.`f*u<Brz|(+o#d\"*hD7@NiQHqx9`ex=:~$ex=:~$ex=::cx@9qEqma)LW.;f=t:u{H//u(GgPI\":~$ex=:~$ex=:~$ex=:~$ex{*&Q1DSkjq0L]U?&TfQA/^6KB~09{CgAi*43:unB9F,8t`ex=:~$ex=:~$ex=:~$ex=::cI;tcP&sazb?&6]$~P2=JwITsijYv;fG$@}a)jVxnnBS6C9?`+}C.=t/v;k8_}Ryny880IeK>=:~$ex=:~$ex=:~$ex{*&~1D=J{F,8t`ex=:~$ex=:~$ex=:~$GGv)6f]X(2xz<synK+Yf@pz@6X%zT9=|YvPe[fWnK`q6Dz=|urp.U_b_Oq_X:9L1try~Y~i83S(8Rm^U,}[~Id@&iFL/*zqSDU<:S5*u+2|\"29|`%rte\"xF@(2m/jr;1cAl7o;)2HkPFmawXl!(f##U%<B$Yn?b`>}@G5fSU>F__ezN?f>5r9`ex=:~$ex=:43<^&MQHXQ0yex=:~$ex=:~$ex{*.Aeusq>_=s)YI7d)pNODKF7wqz<|eU%0IeK>=:~$ex=:~$ex=:~$ex{*&Q1DSkjq0L]U?&P)`NJ2!i`Iv?nLgAi*U5Big2CqrzfRrr\"~[wdQnkm>C8;km>C8;km>C8;k2B:9D1q+4~>+!izpN9xRsS]+hd;I)2oCaYd*GgPI\":~$ex=:~$ex=:~$ex=:~$ex{*vf7@VF^b!Lyn)d&6pp:@k2N{5rHK?lD*H_L^Vq[{DzTnEo[}vf7@VFQHqx9`ex=:~$ex=:~$ex=:~$ex=:u;7@NiKB<D{BUJY*&<H8;km>C8;km>C8;km>C8(]>_<LfL>5nW~$ex=:~$ex=:~$ex=::c:unB.8)9xoC.[*13K%dHzFZP;1C.(fdQE@@4l{w[VHKMp./NJ2TBFq^*jEx}Y~b;]XnO_fv?kbr}:.|;4o=JO1ezb`_OA6Ix0^Fqcq<D{BUJY*&<H8;km>C8;km>C8A3vIn?4gPID+0$ex=:~$ex=:~$.Qk7+j]X(2xz<syn:MC.^dm%h^f8TsLR@=i*&<H8;km>C8;km>C8;km>C8+F__ezevx}1fiVoXtc9DDzVj@}wfIdWnK`P&;zW[&}C.cc!JPcVKZ[0yex=:~$ex=:~$ex=:~$.Qr.jtM_Skjq0L]U?&TfNABieSc9]jJv(=d)Yth=tPm>C8;km>C8;km>C8;km>C8;kgbezdCurhGLVoXpBP&[msX{U<7G$@}a)jVoXeS%zK?5RU=i*43I;tcP&$[0yex=:~$ex=:~$ex=:~$ex=:~$GGv)6fTr(]n809HgPI\":~$ex=:~$ex=:~$ex=:43x@9qEqZ[0yex=:~$ex=:~$ex=:~$.Qof++m%sq>_=s)Y\"Kn);AS;Y^//=scXN+Yf@ps;jp/\"{Ll`taPeY~i874_fC95`n!YfM(b@5i?8gswXhdC.Vc!JPcVKZ[0yex=:~$ex=:~$ex{*X:&;Opa#A8t`ex=:~$ex=:~$.Qk7+j]X(2xz<syn:MC.^dm%h^f8TsLR@=i*&<H8;km>C8;km>C8;km>C8+F__ezevx}1fiVoXtc9DDzVj@}wfIdWn)#>_TLijhJwf[:MD<J=z29fRrr\"~[wdQnkm>C8;km>C8;km>C8;k2B:9D1q+4~>+!izpN9xRsS]+hd;I)2oCaYd*GgPI\":~$ex=:~$ex=:~$ex=:~$ex{*vf7@VF^b!Lyn}+0.Q%.^/JO\"+N>;hJDfEtC8.w;/Uu.vi!Y~StU%k\"KB<D&s?lYfIeK>=:~$ex=:~$ex=:~$ex=:~$.Qof++s;]3M9Jm*s>5nW~$ex=:~$ex=:~$ex=::c{+oBA/rzN?f>5r9`ex=:~$ex=:~$ex{*&Q1DSkjq0L]U?&P)`NJ2!i`I2L4v&}n);AS;z\"]xrmqvz.e:txZ@(2XYgs&sl!teY~]X!iR$1iiH%zps3L6+2fJb.^iF+X<D{BUJY*&<H8;km>C8;km>C8A3vIn?4gPI\":~$ex=:~$eF(7+j$=tPm>C8A3vIn?4gPI\":~$lNnW~$ex{*wGhW)b=zTsxl|v:.\"xpARpa#Nr9`.Qk7+j]X(2xz<syn,lY~;AS;z\"QHqx9`ex=:~$.Qk7+j]X(2xz<syn,lY~;AS;Y^9D3(|18qB&!;E@oCCqtm8wPorejwdQd%(>C8;km>C8A321H(evx}1fiVoX^JL\"aj<sB7d)pNODKFoc,8t`ex=:~$ex=:~$.Qk7+j]X(2xz<syn:MC.^dm%h^f8TsLR@=i*&<H8;km>C8;km>C8;km>C8+F__ezevx}1fiVoXtc9DDzVj@}wfIdWnK`P&;zMJiUg~43:unB9F,8t`ex=:~$ex=:~$ex=:~$5oI~{dn%sq>_=s)YI7>3.NE_w^9o2L8l_M^3XOdQnkm>C8;km>C8;km>C8;km>C8A3PFXmJSl0<7=tc/aVYYl5]scA=:[J7@}pN9]jJv(=d)Yt3r(]PFXmJS>5nW~$ex=:~$ex=:~$ex=:~$ex=:u;7@NiKB<D{BUJY*&<H8;km>C8;km>C8;km>C8(]>_<LfL>5nW~$ex=:~$ex=:~$ex=::c:unB.8)9xoC.[*13K%dHzFZP;1C.(fdQE@@4l{w[`S]}Y~N;]X3S$KmasSl0Df]`<i9Fb{tmb`cMG:;J(iXk$K2LXK9KPeJI4o|ks{ajxo&}.:~db_~4=z|[$J9}H.IeK>=:~$ex=:~$ex=:43<^&MQHXQ0yex=:~$ex=:~$ex{*.Aeusq>_=s)YI7d)pNODKF7wqz<|eU%0IeK>=:~$ex=:~$ex=:~$ex{*&Q1DSkjq0L]U?&P)`NJ2!i`Iv?nLgAi*xd+iOqH\"@*,S7.qe43:unB9F,8t`ex=:~$ex=:~$ex=:~$5oI~{dn%sq>_=s)YI7>3.NE_w^9o2L8l_M^3XOdQnkm>C8;km>C8;km>C8;km>C8A3PFXmJSl0<7=t~D@JXYTLsS^aWeW@8WlF!8iLyn@+!7W@d2jOoc;[ONi+=6lwdQnkm>C8;km>C8;km>C8;km>C8A3n809HgeF`f++s;<%(>C8;km>C8;km>C8;km>SUP27{C9SgPI\":~$ex=:~$ex=:~$ex=:u;7@NiD9tm\"U/lW0*QE@@4bC#LAUcAPe`NJ2!ioc3:JSW.qe\"xHiyHS6jr9Cn=l7&xUW.XwPkm<se+))Z~.^fKG8T?#`GU!7##J2oCswk(Wo]U5+0$ex=:~$ex=:~$.Q[}.A.[<%]Sqx9`ex=:~$ex=:~$5ore=xs_oBezSu.veUwf`fE@94h\"aj<s8q5+0$ex=:~$ex=:~$ex=:~$GGv)6f]X(2xz<synK+Yf@pz@mFH\"Pm~nTG`)%@M_lF9zK?fRrr\"~[wdQnkm>C8;km>C8;km>C8;k2B:9D1q+4~>+!izpN9xRsS]+hd;I)2oCaYd*GgPI\":~$ex=:~$ex=:~$ex=:~$ex{*vf7@VF^b!Lynwev)%@M_PHtm+t,S/rl7=ts_,Jtm<L~c8q}*2&m%;V,F,8t`ex=:~$ex=:~$ex=:~$ex=::c:unB9F;[$J9}H.IeK>=:~$ex=:~$ex=:~$ex{*&~1D=J{F,8t`ex=:~$ex=:~$ex=:~$GGv)6f]X(2xz<synK+Yf@pz@6X%zT9=|YvPe[fWn@l./ez(1ul3./xq2Hk7{;mJS)Q9)U_U%I2H\"C9;Q}7v)%@M_Nk|\"Tsqvp.e:NA*uUks{ajxo&}.:~db_~4wq<D{BUJY*&<H8;km>C8;km>C8A3vIn?4gPID+0$ex=:~$ex=:~$.Qk7+j]X(2xz<syn:MC.^dm%h^f8TsLR@=i*&<H8;km>C8;km>C8;km>C8+F__ezevx}1fiVoXtc9DDzVj@}wfIdWnv|%DFjb`<}i.4c!JPcVKZ[0yex=:~$ex=:~$ex=:~$.Qr.jtM_Skjq0L]U?&TfNABieSc9]jJv(=d)Yth=tPm>C8;km>C8;km>C8;km>C8;kgbezdCurhGLVoX0F%DFj&=iUg~G$@}a)jVoXeS%zK?5RU=i*43I;tcP&$[0yex=:~$ex=:~$ex=:~$ex=:~$GGv)6fTr(]n809HgPI\":~$ex=:~$ex=:~$ex=:43x@9qEqZ[0yex=:~$ex=:~$ex{*X:&;Opa#A8t`ex=:~$ex=:~$.Qk7+j]X(2xz<syn:MC.^dm%h^f8TsLR@=i*&<H8;km>C8;km>C8;km>C8+F__ezevx}1fiVoXtc9DDzVj@}wfIdWnv|%DFjb`<}i._x!^O2n/u(fRrr\"~[wdQnkm>C8;km>C8;km>C8;k2B:9D1q+4~>+!izpN9xRsS]+hd;I)2oCaYd*GgPI\":~$ex=:~$ex=:~$ex=:~$ex{*vf7@VF^b!Lynwev)%@)2,w=zENCjtl(fG$@}a)jVoXeS%zK?5RU=i*43I;tcP&$[0yex=:~$ex=:~$ex=:~$ex=:~$GGv)6fTr(]n809HgPI\":~$ex=:~$ex=:~$ex=:43x@9qEqZ[0yex=:~$ex=:~$ex{*X:&;Opa#A8t`ex=:~$ex=:~$.Qk7+j]X(2xz<syn:MC.^dm%h^f8TsLR@=i*&<H8;km>C8;km>C8;km>C8+F__ezevx}1fiVoXtc9DDzVj@}wfIdWnM1HYTLenW.qe##J2oCswk(Wo]U5+0$ex=:~$ex=:~$ex=:~$5oI~{dn%sq>_=s)YI7>3.NE_w^9o2L8l_M^3XOdQnkm>C8;km>C8;km>C8;km>C8A3PFXmJSl0<7=tKC5i,zK?gQ:.L,;%6;;k9DJm@YI7mGa%6;/4F{OufR0Un)aN$=tPm>C8;km>C8;km>C8;km>C8;k??Jm*sBo[}&Q1DVpa#Nr9`ex=:~$ex=:~$ex=:43x@9qEqZ[0yex=:~$ex=:~$ex=:~$.Qof++m%sq>_=s)Y\"Kn);AS;Y^//=scXN+Yf@ps;jpwITsqvp.e:`f.^Gw_f~jIsl0wf\"x~i}FdD=9|1)Q9)=^(iOq[{0L8l9KC.SD7@vCEq<D{BUJY*&<H8;km>C8;km>C8A3vIn?4gPID+0$ex=:~$ex=:~$.Qk7+j]X(2xz<syn:MC.^dm%h^f8TsLR@=i*&<H8;km>C8;km>C8;km>C8+F__ezevx}1fiVoXtc9DDzVj@}wfIdWnM1HYTLenW.qe##J2oCs`0LFjgAI*hD7@NiQHqx9`ex=:~$ex=:~$ex=::cx@9qEqma)LW.;f=t|idH)z]jpvi!Y~StU%k\"QHqx9`ex=:~$ex=:~$ex=:~$ex=:Z&m%;Va8T?@Y\"KBeepI2zqxzK?0|:.3&|e:@6KB>s@%c]C8bS#z.qe&p;[jpswT?:Bdag*&<H8;km>C8;km>C8;km>C8;km>SUPcVKhufRrr\"~[wdQnkm>C8;km>C8;km>C8;ksw8m@n3vY*&<H8;km>C8;km>C8;km>C8+F__ezevx}1fiVoXtc9DDzVj!!1fRb\"%FFmYezGgHX})W@y^Fq*zsaIss!j3)55@5i\"8,jCjtl(f=^C8[Vq{295`Fx))1A:@fK!8gshQmMC.a3m%hK%DFjYOC7v)6f$=tPm>C8;km>C8;km>SU6XtG$[0yPI\":~$ex=:~$ex=::c<^&MD9tm\"U/lW0Apm%@JO\">D:B]}})2th=tPm>C8;km>C8;km>C8;k(BI(Woi+4~>+!izp{wqz<|eUhd;A*u/Joc({sR:.[~Q%f%lF9zK?,S&}o)43:unB9F,8t`ex=:~$ex=:~$ex=:~$5oI~{dn%sq>_=s)YI7>3.NE_w^9o2L8l_M^3XOdQnkm>C8;km>C8;km>C8;km>C8A3PFXmJSl0<7=tKC5i,zK?gQ:.L,;%f%eK08rt,S/rl7=ts_,Jtm<L~c8q}*2&m%;V,F,8t`ex=:~$ex=:~$ex=:~$ex=::c:unB9F;[$J9}H.IeK>=:~$ex=:~$ex=:~$ex{*&~1D=J{F,8t`ex=:~$ex=:~$ex=:~$GGv)6f]X(2xz<synK+Yf@pz@6X%zT9=|YvPe[fWn$o%zp(ER_)e:tx([nB38P9kb}7C.!%6;TBtmA((1ul3./xJ;Skn8ajN1.F`f++s;<%(>C8;km>C8;km>C8(]21H(N?m#nW~$ex=:~$ex=:~$5ore=xs_oBezSu.veUwf`fE@94h\"aj<s8q5+0$ex=:~$ex=:~$ex=:~$GGv)6f]X(2xz<synK+Yf@pz@mFH\"Pm~nZ{X.;A4oIJS{09xwC7v)6f$=tPm>C8;km>C8;km>C8;k(BWm@n3vG:i~P29F;0Is,|c.mGw_L^Vq[{DzTn$|nW~$ex=:~$ex=:~$ex=:~$ex=:Z&m%;Va8T?@Y\"K*~pN&;IJS{09fn.Qm3=deasq./TLenF+:06c5A5i;/p(N?f>5r9`ex=:~$ex=:~$ex=:~$.Qof++s;]3M9Jm*s>5nW~$ex=:~$ex=:~$ex=::c{+oBA/rzN?f>5r9`ex=:~$ex=:~$ex{*&Q1DSkjq0L]U?&P)`NJ2!i`I2L4v&}n);AS;z\"Bf@jIsl0?)AxaD^JzI0s+B?l=7Q$&vYfQ%g2Hk$K2LXK9KPeJIi8TK6C:9SK9Kl7PQS;SkYYjrdCtrG:.N@&gMX1|[$J9}H.IeK>=:~$ex=:~$ex=:43<^&MQHXQ0yex=:~$ex=:~$ex{*wGhWA321H(evx}1fiVoX/4O\"29BSqKn);AS;z\"QHqx9`ex=:~$ex=:~$ex=::c:unB.8)9xoC.[*13K%dHzFZP<|:a!7XOMH]4~8#y!1JAe:9f{uvBswk(Wo]U5+0$ex=:~$ex=:~$ex=:~$5oI~{dn%sq>_=s)YI7>3.NE_w^9o2L8l_M^3XOdQnkm>C8;km>C8;km>C8;km>C8A3PFXmJSl0<7=t]_74gq!y!1JAC&!;E@}\"zI@*!1?&4~zdI2zq6ortEO,{C.<!k[<%(>C8;km>C8;km>C8;km>C8;k(BI(Wo]U}*hD7@NiQHqx9`ex=:~$ex=:~$ex=::c{+oBA/rzN?f>5r9`ex=:~$ex=:43<^&M]xY16gPID+0$ex=:~$ex=:~$.Qk7+j]X(2xz<syn:MC.^dm%h^f8TsLR@=i*&<H8;km>C8;km>C8;km>C8+F__ezevx}1fiVoXtc9DDzVj@}wfIdWnK`P&[mXSmdu.43:unB9F,8t`ex=:~$ex=:~$ex=:~$5oI~{dn%sq>_=s)YI7>3.NE_w^9o2L8l_M^3XOdQnkm>C8;km>C8;km>C8;km>C8A3PFXmJSl0<7=tc/aVYY!yL1Av%0##lu^J;0)9#1:.[~EBWn]3lbezdCNU5+0$ex=:~$ex=:~$ex=:~$ex=::c:unB9F;[$J9}H.IeK>=:~$ex=:~$ex=:~$ex{*&~1D=J{F,8t`ex=:~$ex=:~$ex=:~$GGv)6f]X(2xz<synK+Yf@pz@6X%zT9=|YvPe[fWnv|L/:9/U}7teY~!i^BrDkm.LtrM76p#%y4boC9|`wvI~Gd1iQ3M9Jm*s>5nW~$ex=:~$ex=:~$eF(7+j$=tPa#Nr9`ex=:~$ex=::c<^&MD9tm\"U/lW0Apm%@JO\">D:B]}})2th=tPm>C8;km>C8;km>C8;k(BI(Woi+4~>+!izp{wqz<|eUhd;A*u/Jocp#JSF+=6XICU>F__ezN?f>5r9`ex=:~$ex=:~$ex{*>+y^*2D9tm\"U/lW0hs\"%Yq)C)9#1:.[~EBWn<%(>C8;km>C8;km>C8;km>C8;k(B`?:Bdae:e0eaVR\"/TsuIM.RGG$@}a)jVoXeS%zK?5RU=i*43I;tcP&$[0yex=:~$ex=:~$ex=:~$ex=:~$GGv)6fTr(]n809HgPI\":~$ex=:~$ex=:~$ex=:43x@9qEqZ[0yex=:~$ex=:~$ex{*X:&;Opa#A8t`ex=:~$ex=:~$.Qk7+j]X(2xz<syn:MC.^dm%h^f8TsLR@=i*&<H8;km>C8;km>C8;km>C8+F__ezevx}1fiVoXtc9DDzVj@}wfIdWnk5C{0sjS}7YfOWn%(]n809HgPI\":~$ex=:~$ex=:~$ex=:.~1D=J~8)9xoC.[*CD>]cF9o$1S#z.qe&p;[jpa#Nr9`ex=:~$ex=:~$ex=:~$ex{*vf7@VF^b!Lyn9v=6FbM_j|L/:9.n.Qm3=deasq./TLenF+:06c5A5i;/p(N?f>5r9`ex=:~$ex=:~$ex=:~$.Qof++s;]3M9Jm*s>5nW~$ex=:~$ex=:~$ex=::c{+oBA/rzN?f>5r9`ex=:~$ex=:~$ex{*&Q1DSkjq0L]U?&P)`NJ2!i`I2L4v&}n);AS;z\"`,Om<|j.e:txs@`K|/3(f#Ave:W?i8~4ezv?)L6+2f(xO^k2~8gssSD+hG+K!JPcVKZ[0yex+", "~$ex=:~$ex=:43<^&MQHXQ0yex=:~$ex=:~$ex{*.Aeusq>_=s)YI7d)pNODKF7wqz<|eU%0IeK>=:~$ex=:~$ex=:~$ex{*&Q1DSkjq0L]U?&P)`NJ2!i`Iv?nLgAi*O`J2,J_fHL4Xl0J.nNb_(]n809HgPI\":~$ex=:~$ex=:~$ex=:.~1D=J~8)9xoC.[*CD>]cF9o$1S#z.qe&p;[jpa#Nr9`ex=:~$ex=:~$ex=:~$ex{*vf7@VF^b!Lynwev)%@)2(J7{M0^U]}_0##lu^J;0)9#1:.[~EBWn]3lbezdCNU5+0$ex=:~$ex=:~$ex=:~$ex=::c:unB9F;[$J9}H.IeK>=:~$ex=:~$ex=:~$ex{*&~1D=J{F,8t`ex=:~$ex=:~$.Q[}.A.[<%]Sqx9`ex=:~$ex=:~$5ore=xs_oBezSu.veUwf`fE@94h\"aj<s8q5+0$ex=:~$ex=:~$ex=:~$GGv)6f]X(2xz<synK+Yf@pz@mFH\"Pm~nEoI6FbM_Ck31)mwOC7v)6f$=tPm>C8;km>C8;km>C8;k(BWm@n3vG:i~P29F;0Is,|c.mGw_L^Vq[{DzTn$|nW~$ex=:~$ex=:~$ex=:~$ex=:Z&m%;Va8T?@Y\"KMfObb@4F31)m]n.Qm3=deasq./TLenF+:06c5A5i;/p(N?f>5r9`ex=:~$ex=:~$ex=:~$.Qof++s;]3M9Jm*s>5nW~$ex=:~$ex=:~$ex=::c{+oBA/rzN?f>5r9`ex=:~$ex=:~$ex{*&Q1DSkjq0L]U?&P)`NJ2!i`I2L4v&}n);AS;z\"$tf(ro:.Df)55@5i\"8sz=|r}(f/xI;SkdD)ma`T}wf{xX%3Sp{mr9Cn=l7&xJ;HH%zps8wC7v)6f$=tPm>C8;km>C8;km>SU6XtG$[0yex=:~$ex=:43<^&MQHqx9`ex{*X:&;Opa#A86OPorejwF>=:~$ex=:~$ex=:~$ex=:~$ex=:~$ex=::c<^&MD9tm\"U/lW0\"dz@h^__9j~n.Qk~_+`A#X;0$_GgPI\":~$.Qk7+j]X(2xz<syn}}@GLes@cFQ/+tA^7.=6C~{u(]21H(N?f>5r9`|8e:i~P29F;0Rm7[s!(7b;BDyHh\"aj<s8q|IE;Big21|29@KylkfkLJ2;V5qA(I`7=e:np,usqVKjr(|,};~Id@&cF3~Dz|`9l(f,pb@oB=zC9fRfU5+LGK>=:~$F{cdo$?A\"~yd1iHk0Hw[0yex=::c<^&MD9tm\"U/lW0/dE_dHzF+tN?f>5r9`ex=::c<^&MD9tm\"U/lW0/dE_dHzFZP<|:a!7XOe1nB</:s8wPorejwdQnkm>C8;km>Ar:H;8)9xoC.[*CD)2iFmY.mpveUwf`fk[jpa#A8t`ex=:~$ex=:~$.Qk7+j]X(2xz<syn:MC.^dm%h^f8TsLR@=i*&<H8;km>C8;km>C8;km>C8+F__ezevx}1fiVoXtc9DDzVj@}wfIdWnjna/km#1Pa[}&Q1DVpa#Nr9`ex=:~$ex=:~$ex=:M:&;Ckjq0L]U?&P)`NJ2!ic9DzBShJwfXOdQnkm>C8;km>C8;km>C8;km>C8A3A/p(BRi+4~>+!izp>0iLl1~lc~Z~S;(\"zIv?nLs!W0hy5@4FD9bzmRn=i*430^VFYYezN?f>5r9`ex=:~$ex=:~$ex=:~$.Q>e(Q,uCkH\"UuUphJ!7nJ)1nB</:si+Vv})KtC8.w;/Uu.vVv})KtC8dHtX2LynM5u.a%*uzogqDz6n$|nW~$ex=:~$ex=:~$ex=:~$ex=:.~1D=J~8)9xoC.[*CD>]cF9o$1S#z.qe&p;[jpa#Nr9`ex=:~$ex=:~$ex=:~$ex=:~$.Q>e(Q,uCkH\"UuUphJ!7nJ)1nB</:s6n.Qm3=deasq./TLenF+:06c5A5i;/p(N?f>5r9`ex=:~$ex=:~$ex=:~$ex=:~$GGv)6fTr(]n809HgPI\":~$ex=:~$ex=:~$ex=:~$ex{*&~1D=J{F,8t`ex=:~$ex=:~$ex=:~$eF(7+j$=tPm>C8;km>C8;km>SU6XtG$[0yPI\":~$ex=:~$ex=::c<^&MD9tm\"U/lW0Apm%@JO\">D:B]}})2th=tPm>C8;km>C8;km>C8;km>C8;k??Jm*s}7u.o;5@P\"f8TsLRulif.NW@9\"cICLCjr}Ofb;CU>F__ezN?f>5r9`ex=:~$ex=:~$ex=:~$.Qk7+j]X(2xz<synK+Yf@pz@BqzFpsIs#=i*&<H8;km>C8;km>C8;km>C8;km>C8;k(B&LJSKMC.U_W@{FlCxtl1/lOfw_U%]4q{5r<|:a!7=tR,yFR\"sapRnM*fXOSU+qP&Ts<s>5nW~$ex=:~$ex=:~$ex=:~$ex=:~$ex{*vf7@VF^b!Lyn9vl7|e:@iFR\"usqvgA;fw3+ipKB>s@%c]C8b5RnM*fG$@}wfIdea3|Eq2LLS}7:)7pt[jpa#Nr9`ex=:~$ex=:~$ex=:~$ex=:~$.Qr.jtM_Skjq0L]U?&TfNABieSc9]jJv(=d)Yth=tPm>C8;km>C8;km>C8;km>C8;km>C8;km>C8xH.85(5`NvD*DgR@`BvC:9L1zA\"~yd1i(\"zI@*!1?&4~zdI2zq6ortEO,{C.<!k[<%(>C8;km>C8;km>C8;km>C8;km>C8;km>C8A3n809HgeF`f++s;<%(>C8;km>C8;km>C8;km>C8;km>C8;ksw8m@n3vY*&<H8;km>C8;km>C8;km>C8;km>SU6XtG$[0yex=:~$ex=:~$ex=:~$.Q[}.A.[<%]Sqx9`ex=:~$ex=:~$ex=::c<^&MD9tm\"U/lW0Apm%@JO\">D:B]}})2th=tPm>C8;km>C8;km>C8;km>C8;k??Jm*s}7u.o;5@P\"f8TsLRulif.NW@9\"$tGmcjAvk*hD7@NiQHqx9`ex=:~$ex=:~$ex=:~$ex=:M:&;Ckjq0L]U?&P)`NJ2!ic9DzBShJwfXOdQnkm>C8;km>C8;km>C8;km>C8;km>C8_qP&Ts<s}7u.o;5@P\"|/=sjSB7d)7pt[;k9D3(|1?&K<b;M_CkcwtmwX8q}*{t,uVFzFZ[0yex=:~$ex=:~$ex=:~$ex=:~$ex=::cI;tcP&sazb?&6]6fX^oBK\"usqvgA;fw3+ipKB>s@%c]C8b5RnM*fG$@}wfIdea3|Eq2LLS}7:)7pt[jpa#Nr9`ex=:~$ex=:~$ex=:~$ex=:~$.Qr.jtM_Skjq0L]U?&TfNABieSc9]jJv(=d)Yth=tPm>C8;km>C8;km>C8;km>C8;km>C8;km>C8xH.85(5`NvD*DgbD{H8_rzUXW.57m;8WlF!8iLyn@+!7W@d2jOoc;[ONi+=6lwdQnkm>C8;km>C8;km>C8;km>C8;km>C8;km>SUPcVKhufRrr\"~[wdQnkm>C8;km>C8;km>C8;km>C8;km>C8(]>_<LfL>5nW~$ex=:~$ex=:~$ex=:~$ex=:43<^&MQHqx9`ex=:~$ex=:~$ex=::c{+:H]F,8^?f>5r9`ex=:~$ex=:~$ex{*.Aeusq>_=s)YI7d)pNODKF7wqz<|eU%0IeK>=:~$ex=:~$ex=:~$ex=:~$.Qof++m%sq>_=s)Y\"Kn);AS;Y^9D3(|18qQ=TN&;:HSPpsLR4v[}&Q1DVpa#Nr9`ex=:~$ex=:~$ex=:~$ex{*.Aeusq>_=s)Y\"Kn);AS;Y^1YezL14vu0IeK>=:~$ex=:~$ex=:~$ex=:~$ex=:~${&&6vNS;Skjq0L]U?&0fb;M_h^1YtmwXQx2f.NW@}p>0CLl1ur[IZ~S;(\"KB=__C:a9)[wdQnkm>C8;km>C8;km>C8;km>C8;km>C8xH.85(5`NvD*DgziKFtGvjgQ]}})pNa@Fqp{<spRnM*fG$@}a)jVoX/4XYu(?`@}wfIdea3|Eq2LLS}7:)7pt[jpa#Nr9`ex=:~$ex=:~$ex=:~$ex=:~$.Qr.jtM_Skjq0L]U?&TfNABieSc9]jJv(=d)Yth=tPm>C8;km>C8;km>C8;km>C8;km>C8;km>C8xH.85(5`NvD*DgziKFtGvjgQ]}})pNa@Fqp{=(?`@}a)jVoXeS%zK?5RU=i*43I;tcP&$[0yex=:~$ex=:~$ex=:~$ex=:~$ex=:~$ex=:u;7@NiKB<D{BUJY*&<H8;km>C8;km>C8;km>C8;km>C8;k(B=_xoD!u.IeK>=:~$ex=:~$ex=:~$ex=:~$.Q[}.A.[<%(>C8;km>C8;km>C8;km>SU6XtG$[0yPI\":~$ex=:~$eF(7+j$=tPm>C8A3vIn?4gPID+0$ex=:pWpANk,P:sN1J.e:teh=tPm>C8A321H(evx}1fiVoX^JL\"aj<s8q5+0$ex=:~$ex{*.Aeusq>_=s)YI7l7@NJ2!i`Iv?nLgAi*!W1i,J7z|[Fa{Ug*&<yQnkm>C8;km>Ar:H;8)9xoC.[*CD)2iFmY.mpveUwf`fk[jpa#A8t`ex=:~$ex=:~$.Qk7+j]X(2xz<syn:MC.^dm%h^f8TsLR@=i*&<H8;km>C8;km>C8;km>C8+F__ezevx}1fiVoXtc9DDzVj@}wfIdWnQbL/*z3?JAJeBb{u(]n809HgPI\":~$ex=:~$ex=:~$ex=:M:&;Ckjq0L]U?&P)`NJ2!ic9DzBShJwfXOdQnkm>C8;km>C8;km>C8;km>C8A3A/p(BRi+4~>+!izp>0iLl1~lc~Z~S;(\"zIv?nLs!W0hy5@4FD9bzmRn=i*430^VFYYezN?f>5r9`ex=:~$ex=:~$ex=:~$.Q>e(Q,uCkH\"UuUp|vl7XebDbCp{<spRnM*fG$@}a)jVoX/4XYu(?`@}wfIdea3|Eq2LLS}7:)7pt[jpa#Nr9`ex=:~$ex=:~$ex=:~$ex{*>+y^*2D9tm\"U/lW0hs\"%Yq)C)9#1:.[~EBWn<%(>C8;km>C8;km>C8;km>C8;km>C8;kgbezdCurhGLVoX%HL/km2QJ.!7m;8WlF!8iLyn@+!7W@d2jOoc;[ONi+=6lwdQnkm>C8;km>C8;km>C8;km>C8;km>C8+F__ezEOC7v)6f$=tPm>C8;km>C8;km>C8;km>C8;ksw8m@n3vY*&<H8;km>C8;km>C8;km>C8(]21H(N?f>5r9`ex=:~$ex=:43<^&MQHXQ0yex=:~$ex=:~$ex{*.Aeusq>_=s)YI7d)pNODKF7wqz<|eU%0IeK>=:~$ex=:~$ex=:~$ex{*&Q1DSkjq0L]U?&P)`NJ2!i`Iv?nLgAi*$yt^g2|\"iL8wC7v)6f$=tPm>C8;km>C8;km>C8;k(BNLn2}7u.o;5@P\"f8TsLRulc~[fE@|iS{w[0yex=:~$ex=:~$ex=:~$ex=:~${&&6vNS;Skjq0L]U?&0fb;M_h^1YtmwXQx2f.NW@}p>0CLl1ur[IZ~S;(\"KB=__C:a9)[wdQnkm>C8;km>C8;km>C8;km>C8A3PFXmJSl0<7=t]_@J&CkmlSs!z~?@OD9FcwtmwXQx2f^Q.^P\"1YtmwXQx2f.NW@}pN9H9|1~ve:w3+ipKoc,8t`ex=:~$ex=:~$ex=:~$ex=::cx@9qEqma)LW.;f=t|idH)z]jpvi!Y~StU%k\"QHqx9`ex=:~$ex=:~$ex=:~$ex=:~$ex{*vf7@VF^b!Lyn9vl7|e:@iF]C%9ulgA;fG$@}a)jVoXeS%zK?5RU=i*43I;tcP&$[0yex=:~$ex=:~$ex=:~$ex=:~$ex=::c:unB9F;[$J9}H.IeK>=:~$ex=:~$ex=:~$ex=:~$.Q[}>+y^*2QHqx9`ex=:~$ex=:~$ex=::c{+:H]F,8t`ex=:~$ex=:~$.Q[}.A.[<%]Sqx9`ex=:~$ex=:~$5ore=xs_oBezSu.veUwf`fE@94h\"aj<s8q5+0$ex=:~$ex=:~$ex=:~$GGv)6f]X(2xz<synK+Yf@pz@mFH\"Pm~n$|X.LeX^yFswk(Wo]U5+0$ex=:~$ex=:~$ex=:~$5ore=xs_oBezSu=RYvPe[fQJ/4O\"29BS8q5+0$ex=:~$ex=:~$ex=:~$ex=::c0^VFYYezevx}1fiVxn^J!/pspvVv})KtC8dHtX2Lync51f~N]Xk4XYu(GgeFo~aNBi!iQHqx9`ex=:~$ex=:~$ex=:~$ex=:Z&m%;Va8T?@Y\"K|7&d:@T;7{VjKXC.:)7pt[;k9DJm@YI7d)7pt[;k9D3(|1?&*,c~)2iFD9bzmRn=i*&<H8;km>C8;km>C8;km>C8;km>AroBA/rzevx}1fiVoX>OH\"T9cj@+!7W@d2jOoc,8t`ex=:~$ex=:~$ex=:~$ex=:~$ex=:Z&m%;Va8T?@Y\"K|7&d:@T;7{VjKX1==:[J7@}pN9]jJv(=d)Yt3r(]PFXmJS>5nW~$ex=:~$ex=:~$ex=:~$ex=:~$ex{*&Q1DVpswk(Wo]U5+0$ex=:~$ex=:~$ex=:~$ex=::c{+oBA/rzN?f>5r9`ex=:~$ex=:~$ex{*X:&;Opa#Nr9`ex=:~$ex=::c{+:H]F,8t`ex=:~$ex=:~$ex=:~$PI\":~$ex=:~$eF(7+j$=tPm>C8A3vIn?4gPID+0$ex=:pWpANk&q0Lm18rcdFOdQnkm>C8`XtGsa)LW.;f=tN@Vq9DDz)n$|nW~$ex=:~$.Qk7+j]X(2xz<syn,lY~;AS;Y^9D3(|18qz<>+}]6Ksw#Ln2>5nW&<H8;km>C8;kCIn?!`]vI~s;eahK%zpsLRulc~[fE@|iS{w[0yPI\":~$ex=:~$ex=::c<^&MD9tm\"U/lW0Apm%@JO\">D:B]}})2th=tPm>C8;km>C8;km>C8;k(BI(Woi+4~>+!izp{wqz<|eUhd;A*u/Joc^!hQmMC.cErPQQ7{|[$J9}H.IeK>=:~$ex=:~$ex=:~$ex{*>+y^*2D9tm\"U/lW0hs\"%Yq)C)9#1:.[~EBWn<%(>C8;km>C8;km>C8;km>C8;k(B`?:Bdae:e0eaVRB/:9RRi+I<vWt[;k9DJm@YI7mGa%6;/4F{OufR0Un)aN$=tPm>C8;km>C8;km>C8;km>C8;k??Jm*sBo[}&Q1DVpa#Nr9`ex=:~$ex=:~$ex=:43x@9qEqZ[0yex=:~$ex=:~$ex{*X:&;Opa#A8t`ex=:~$ex=:~$.Qk7+j]X(2xz<syn:MC.^dm%h^f8TsLR@=i*&<H8;km>C8;km>C8;km>C8+F__ezevx}1fiVoXtc9DDzVj@}wfIdWnk5C{0sjSOIN77pb_JkPPu(fRrr\"~[wdQnkm>C8;km>C8;km>C8;kCIn?!`]vI~s;eay4h\"aj<sB7d)pNODKFoc,8t`ex=:~$ex=:~$ex=:~$ex=::c0^VFYYezevx}1fiVxn^J!/pspvVv})KtC8dHtX2Lync51f~N]Xk4XYu(GgeFo~aNBi!iQHqx9`ex=:~$ex=:~$ex=:~$ex=:Z&m%;Va8T?@Y\"KQ)>+}]6KZ,:(l1#=N77pb_jQ7{c#`LG=u0##lu^J;0fL`LG=u0##\"%&2]C8b`18lY~&x.SI2j{rtN?f>5r9`ex=:~$ex=:~$ex=:~$.Qr.jtM_Skjq0L]U?&TfNABieSc9]jJv(=d)Yth=tPm>C8;km>C8;km>C8;km>C8;km>C8A3PFXmJSl0<7=t]_\"2X129q<!=kf~NB,*2t_59JQn==:[J7@}pN9]jJv(=d)Yt3r(]PFXmJS>5nW~$ex=:~$ex=:~$ex=:~$ex=:~$ex{*&Q1DVpswk(Wo]U5+0$ex=:~$ex=:~$ex=:~$ex=::c{+oBA/rzN?f>5r9`ex=:~$ex=:~$ex{*X:&;Opa#Nr9`ex=:~$ex=::c{+:H]F,8^?f>5r9`ex=:~$ex=:M:&;Ckjq0L]U?&4~[fE@|ijCvzqSGMC.XOdQnkm>C8;km>C8;km>C8;k??Jm*s}7u.o;5@P\"f8TsLRulif.NW@9\"BfCL+BeUG:hy+ioB?8|#4X.F`f++s;<%(>C8;km>C8;km>C8;km>Ar:H;8)9xoC.[*13K%dHzF$15R4vl7pNWn<%(>C8;km>C8;km>C8;km>C8;k(B&LJSKMC.U_W@{FlCxtl1/lOfw_U%]4q{5r<|:a!7=tR,yFR\"sapRnM*fXOSU+qP&Ts<s>5nW~$ex=:~$ex=:~$ex=:~$ex=:Z&m%;Va8T?@Y\"Kh6OWGi!iw,tm8oMA?~j%J%]4q{5rHK?lD*H_U%]4q{5r<|:a!7=tH,*2%z3(G+Vv})Kth=tPm>C8;km>C8;km>C8;km>C8;k2B:9D1q+4~>+!izpN9xRsS]+hd;I)2oCaYd*GgPI\":~$ex=:~$ex=:~$ex=:~$ex=:~$.Q>e(Q,uCkH\"UuUpQlk~)ps;IJXY:9]WJAu0##lu^J;0)9#1:.[~EBWn]3lbezdCNU5+0$ex=:~$ex=:~$ex=:~$ex=:~$ex=:u;7@NiKB<D{BUJY*&<H8;km>C8;km>C8;km>C8;km>SUP27{C9SgPI\":~$ex=:~$ex=:~$ex=:43<^&MQHqx9`ex=:~$ex=:~$eF(7+j$=tPa#Nr9`ex=:~$ex=::c<^&MD9tm\"U/lW0Apm%@JO\">D:B]}})2th=tPm>C8;km>C8;km>C8;k(BI(Woi+4~>+!izp{wqz<|eUhd;A*u/Joc35Isl!(f4krP(]n809HgPI\":~$ex=:~$ex=:~$ex=:.~1D=J~8)9xoC.[*CD>]cF9o$1S#z.qe&p;[jpa#Nr9`ex=:~$ex=:~$ex=:~$ex{*vf7@VF^b!LynLAl730ODYax{5rHK?lD*H_L^Vq[{DzTnEo[}vf7@VFQHqx9`ex=:~$ex=:~$ex=:~$ex=:u;7@NiKB<D{BUJY*&<H8;km>C8;km>C8;km>C8(]>_<LfL>5nW~$ex=:~$ex=:~$eF(7+j$=tPa#Nr9`ex=:~$ex=::c.&X^(BNLn2}7u.o;5@P\"1YezL14vZd*QE@@4l{w[0yex=:~$ex=:~$ex=:~$.Qof++m%sq>_=s)Y\"Kn);AS;Y^9D3(|18q\",_+I2,J?8$#Cj+M5743:unB9F,8t`ex=:~$ex=:~$ex=:~$5oI~{dn%sq>_=s)YI7>3.NE_w^9o2L8l_M^3XOdQnkm>C8;km>C8;km>C8;km>C8A3PFXmJSl0<7=tKCFFxzFj9bIy3.q(OD;k9DJm@YI7mGa%6;/4F{OufR0Un)aN$=tPm>C8;km>C8;km>C8;km>C8;k??Jm*sBo[}&Q1DVpa#Nr9`ex=:~$ex=:~$ex=:43x@9qEqZ[0yex=:~$ex=:~$ex{*X:&;OpiSwPN?f>5r9`ex=::c{+:H]F,8t`ex=:43<^&MQHXQ0yex=::c.&X^%w&9N1~ve:teh=tPm>C8A321H(evx}1fiVoX^JL\"aj<s8q5+0$ex=:~$ex{*.Aeusq>_=s)YI7l7@NJ2!i`Iv?nLgAi*`t4^VqtX=_(|sU5+LGK>=:~$ex=::c<^&MD9tm\"U/lW0/dE_dHzF$15R4vl7pNWn<%]Sqx9`ex=:~$ex=:~$5ore=xs_oBezSu.veUwf`fE@94h\"aj<s8q5+0$ex=:~$ex=:~$ex=:~$GGv)6f]X(2xz<synK+Yf@pz@mFH\"Pm~nEoI6FbM_Ckw,tm8oe+IImbCU>F__ezN?f>5r9`ex=:~$ex=:~$ex{*.Aeusq>_=s)Y\"Kn);AS;Y^1YezL14vu0IeK>=:~$ex=:~$ex=:~$ex=:~$.Qv~aNBi!iD9tm\"U/lW0,d5@4Fc9DzmRn==:;A*u/J;065AU3ve:w3+ipKoc;[PndaYf[f$=tPm>C8;km>C8;km>C8;km>C8;kgbezdCurhGLVoX,4.|2LLSh5kf,dk[IJXY:9]WJAsIZ~S;(\"zI@*!1?&4~Z~S;(\"zIv?nLs!W0ZyW@Vqa8H#`LG=u0IeK>=:~$ex=:~$ex=:~$ex=:~$.Qr.jtM_Skjq0L]U?&TfNABieSc9]jJv(=d)Yth=tPm>C8;km>C8;km>C8;km>C8;km>C8A3PFXmJSl0<7=tKC(q3/p9X<!=kf~NB,*2t_59JQn==:[J7@}pN9]jJv(=d)Yt3r(]PFXmJS>5nW~$ex=:~$ex=:~$ex=:~$ex=:~$ex{*&Q1DVpswk(Wo]U5+0$ex=:~$ex=:~$ex=:~$ex=::c{+oBA/rzN?f>5r9`ex=:~$ex=:~$ex{*X:&;Opa#Nr9`ex=:~$ex=::c{+:H]F,8^?f>5r9`ex=:~$ex=:M:&;Ckjq0L]U?&4~[fE@|ijCvzqSGMC.XOdQnkm>C8;km>C8;km>C8;k??Jm*s}7u.o;5@P\"f8TsLRulif.NW@9\">16sij.x#7C~*uUkPPu(fRrr\"~[wdQnkm>C8;km>C8;km>C8;kCIn?!`]vI~s;eay4h\"aj<sB7d)pNODKFoc,8t`ex=:~$ex=:~$ex=:~$ex=::c0^VFYYezevx}1fiVxn^J!/pspvVv})KtC8dHtX2Lync51f~N]Xk4XYu(GgeFo~aNBi!iQHqx9`ex=:~$ex=:~$ex=:~$ex=:Z&m%;Va8T?@Y\"K+e^d#%*J5q3(7WJAsIZ~S;(\"zI@*!1?&4~Z~S;(\"zIv?nLs!W0ZyW@Vqa8H#`LG=u0IeK>=:~$ex=:~$ex=:~$ex=:~$.Qr.jtM_Skjq0L]U?&TfNABieSc9]jJv(=d)Yth=tPm>C8;km>C8;km>C8;km>C8;km>C8A3PFXmJSl0<7=tc/cF]CENhQXvRGvWt[;k9DJm@YI7mGa%6;/4F{OufR0Un)aN$=tPm>C8;km>C8;km>C8;km>C8;km>C8A3n809HgeF`f++s;<%(>C8;km>C8;km>C8;km>C8;k(B=_xoD!u.IeK>=:~$ex=:~$ex=:~$ex{*X:&;Opa#Nr9`ex=:~$ex=::c{+:H]F,8^?f>5r9`ex=::c{+:H]F,8t`ex=:43<^&MQHXQ0yeF(7+j`ankm>C8;km>C8;km>C8;km>C8;km>C8;km>Ar:H;8)9xoC.[*YGODDV$>{L[1Qxz7/Nt^hS^Cxtun$|nW~$ex{*.Aeusq>_=s)Y`x\"~?d$WdHtXC9Gg|yDf4c{+:H]F,8t`ex=:l`]X(2xz<syn}}@GLe<^yF){v?qSGMC.XOe<?FYYkmyV6+~.[;E_hKR\"Ts&s=.NddWC_Jk\"/Ts2v2dOfOG)29Fo62LoLMIl7/d*uhKR\"Ts&s=.I*n`$=tPa#Nr9`.QL:te^XUF./u(pj`q5+0$ex=:M:&;Ckjq0L]U?&Tfa%E@@4l{w[0yex=:~$ex=:dI)+sq>_=s)YI7l7@NJ2!i`Iv?nLgAi*0NL^6Ksw<?TgPID+0$ex=:~$ex{*.Aeusq>_=s)YI7l7@NJ2!ic9DzBShJwfXOdQd%(>C8;km>C8;km>C8`XtGsa)LW.;f=t*2!iL/ezwjK+Yf@ps;jpa#Nr9`ex=:~$ex=:~$ex=:u;7@NiD9tm\"U/lW0*QE@@4bC)ssS8l_0N^I%I2iSHL]U+M5743:unB9F,8t`ex=:~$ex=:~$ex=:~$5ore=xs_oBezSu=RYvPe[fQJ/4O\"29BS8q5+0$ex=:~$ex=:~$ex=:~$ex=::cI;tcP&sazb?&6]`An%6;%z<s7[3vN7DN8Wsq>_=s)YB0C.<!k[;k9DJm@YQQl7DN8WB2{oPmIsavRG=t`++\"QHqx9`ex=:~$ex=:~$ex=:~$ex=:.~1D=J~8)9xoC.[*CD>]cF9o$1S#z.qe&p;[jpa#Nr9`ex=:~$ex=:~$ex=:~$ex=:~$.Q>e(Q,uCkH\"UuUphd:.qe.29Fo6C9?`@}a)jVoXeS%zK?5RU=i*&<H8;km>C8;km>C8;km>C8;km>C8;k(BI(Wo]U}*hD7@NiQHqx9`ex=:~$ex=:~$ex=:~$ex=:43x@9qEqZ[0yex=:~$ex=:~$ex=:~$.Q[}.A.[<%(>C8;km>C8;km>C8(]21H(N?m#nW~$ex=:~$ex=:~$5ore=xs_oBezSu.veUwf`fE@94h\"aj<s8q5+0$ex=:~$ex=:~$ex=:~$GGv)6f]X(2xz<synK+Yf@pz@mFH\"Pm~nZ{*6pp{unB7FN[$J9}H.IeK>=:~$ex=:~$ex=:~$ex{*>+y^*2D9tm\"U/lW0hs\"%Yq)C)9#1:.[~EBWn<%(>C8;km>C8;km>C8;km>C8;k(B`?:Bdae:e0eaVR\"/Ts^U9}Z62tC8.w;/Uu.vi!Y~StU%k\"KB<D&s?lYfIeK>=:~$ex=:~$ex=:~$ex=:~$.Qof++s;]3M9Jm*s>5nW~$ex=:~$ex=:~$ex=::c{+oBA/rzN?f>5r9`ex=:~$ex=:43<^&MQHXQ0yex=:~$ex=:~$ex{*.Aeusq>_=s)YI7d)pNODKF7wqz<|eU%0IeK>=:~$ex=:~$ex=:~$ex{*&Q1DSkjq0L]U?&P)`NJ2!i`Iv?nLgAi*U5BioBrzC9qS.F`f++s;<%(>C8;km>C8;km>C8;km>AroBA/rzevx}1fiVoX>OH\"T9cj@+!7W@d2jOoc,8t`ex=:~$ex=:~$ex=:~$ex=::cI;tcP&sazb?&6]{!BioBrzC9qSQx2f^Q.^P\"9o2L8l_M^3XOSUhS.85(igPI\":~$ex=:~$ex=:~$ex=:~$ex{*&Q1DVpswk(Wo]U5+0$ex=:~$ex=:~$ex=:~$eFW.jtM_Vpa#Nr9`ex=:~$ex=::c{+:H]F,8^?f>5r9`ex=:~$ex=:M:&;Ckjq0L]U?&4~[fE@|ijCvzqSGMC.XOdQnkm>C8;km>C8;km>C8;k??Jm*s}7u.o;5@P\"f8TsLRulif.NW@9\"cIH9SS!=l7]`P2oCswk(Wo]U5+0$ex=:~$ex=:~$ex=:~$5oI~{dn%sq>_=s)YI7>3.NE_w^9o2L8l_M^3XOdQnkm>C8;km>C8;km>C8;km>C8A3PFXmJSl0<7=t]_@J{&5(l19}Y~StC8.w;/Uu.vi!Y~StU%k\"KB<D&s?lYfIeK>=:~$ex=:~$ex=:~$ex=:~$.Qof++s;]3M9Jm*s>5nW~$ex=:~$ex=:~$ex=::c{+oBA/rzN?f>5r9`ex=:~$ex=:~$ex{*&Q1DSkjq0L]U?&P)`NJ2!i`I2L4v&}n);AS;z\"k?Dm|19K:.%x8i]4$1.m1`]l/3@!b@Jk__TLAsMIN77pb_JkboC9jE+M57##U%B28mC9iNurF64bY^;kMbD[$J9}H.IeK>=:~$ex=:~$ex=:43<^&MQHXQ0yex=:~$ex=:~$ex{*.Aeusq>_=s)YI7d)pNODKF7wqz<|eU%0IeK>=:~$ex=:~$ex=:~$ex{*&Q1DSkjq0L]U?&P)`NJ2!i`Iv?nLgAi*uA/^JkFPkmb`)58\"43:unB9F,8t`ex=:~$ex=:~$ex=:~$5oI~{dn%sq>_=s)YI7>3.NE_w^9o2L8l_M^3XOdQnkm>C8;km>C8;km>C8;km>C8A3PFXmJSl0<7=t]_0H//EN_tQx2f^Q.^P\"9o2L8l_M^3XOSUhS.85(igPI\":~$ex=:~$ex=:~$ex=:~$ex{*&Q1DVpswk(Wo]U5+0$ex=:~$ex=:~$ex=:~$eFW.jtM_Vpa#Nr9`ex=:~$ex=::c{+:H]F,8^?f>5r9`ex=::c{+:H]F,8t`ex=:43<^&MQHXQ0yPI\":~$.QL:te/&kJa/savj$|nW~$ex{*wGhWA321H(evx}1fiVoX^JL\"aj<s8q5+0$ex=:~$ex{*Jb^X(2xz<syn,lY~;AS;Y^9D3(|18qy=`f,u(]v{Y[0yPI\":~$ex=:~$5ore=xs_oBezSuOJz.Of@pz@BqzFpsIs#=i*&<yQnkm>C8;km>C8;k(BNLn2}7u.o;5@P\"1YezL14vZd*QE@@4l{w[0yex=:~$ex=:~$ex=:~$.Qof++m%sq>_=s)Y\"Kn);AS;Y^9D3(|18q#,t+(iPc7{292v^a[}&Q1DVpa#Nr9`ex=:~$ex=:~$ex=:.~1D=J~8)9xoC.[*CD>]cF9o$1S#z.qe&p;[jpa#Nr9`ex=:~$ex=:~$ex=:~$ex{*vf7@VF^b!Lynf!!7A!)1nB=zJm4XhJg~gtC8.w;/Uu.vi!Y~StU%k\"KB<D&s?lYfIeK>=:~$ex=:~$ex=:~$ex=:~$.Qof++s;]3M9Jm*s>5nW~$ex=:~$ex=:~$ex=::c{+oBA/rzN?f>5r9`ex=:~$ex=:43<^&MQHXQ0yex=:~$ex=:43<^&MQHqx9`ex{*X:&;OpiSwPN?m#nW43<^&MNNNr9`ex=:~$ex=:~$ex=:~$ex=:~$ex=:~$5ore=xs_oBezSuTjhJA6Q`P2<JB><^iF&CT?@Yxq80IeK>=:~$5ore=xs_oBezSumE+M57q#\"%&2p{Ou.1za9)Z~CU6XtG$[0yex=::c4%sq>_=s)Y`x\"~?d$W<Jez:s_B]}})2t3r\"JW&sa&LVv=6\"xVr{H$K3(;Q4v7:,dGipKa8P95Rdae:y![2oIswszN?m#nW&<H8;k(BiavjlNj3|~t^]JQ8Y16gPI\":~$.Qk7+j]X(2xz<syn,lY~;AS;z\"QHqx9`ex=:~$.Q5G1$]vI~s;eahK%zpsLRulif.NW@9\"QH^*/LndL78K{+67QHXQ0yex=:~$ex=:M:&;Ckjq0L]U?&Tfa%E@@4bCfL<s~lH.Vth=tPa#Nr9`ex=:~$ex=::c<^&MD9tm\"U/lW0Apm%@JO\">D:B]}})2th=tPm>C8;km>C8;km>C8;k(BI(Woi+4~>+!izp{wqz<|eUhd;A*u/Joc>N<UYvI~/x4%oBU/u(;Q#Mu.Kc!JPcVKZ[0yex=:~$ex=:~$ex=:~$.Qr.jtM_Skjq0L]U?&TfNABieSc9]jJv(=d)Yth=tPm>C8;km>C8;km>C8;km>C8;kgbezdCurhGLVoXDX9zXzxo/r_.GJOD8QS6tm~n.Qm3=deasq./TLenF+:06c5A5i;/p(N?f>5r9`ex=:~$ex=:~$ex=:~$.Qof++s;]3M9Jm*s>5nW~$ex=:~$ex=:~$ex=::c{+oBA/rzN?f>5r9`ex=:~$ex=:43<^&MQHXQ0yex=:~$ex=:43<^&MQHqx9`ex{*X:&;Opa#A8^?f>5r9`F{cdo$.ywf&p_]yFiSwPN?f>5r9`5ore=xs_oBezSuOJz.Of@ps;jpa#Nr9`ex=:~$|8R9U_W@{FlC8bl1~vPe[f$WdHtXC9Gg.ywf&p_]yFsw<?TgPID+0$ex=:~$ex{*.Aeusq>_=s)YI7l7@NJ2!ic9DzBShJwfXOdQd%(>C8;km>C8;km>C8`XtGsa)LW.;f=t*2!iL/ezwjK+Yf@ps;jpa#Nr9`ex=:~$ex=:~$ex=:u;7@NiD9tm\"U/lW0*QE@@4bC)ssS8l_07se^WczFjrk|#=d)_K!JPcVKZ[0yex=:~$ex=:~$ex=:~$.Qr.jtM_Skjq0L]U?&TfNABieSc9]jJv(=d)Yth=tPm>C8;km>C8;km>C8;km>C8;kgbezdCurhGLVoXYMiPXm<s)ywf&p;[;k9DJm@YI7mGa%6;/4F{OufR0Un)aN$=tPm>C8;km>C8;km>C8;km>C8;k??Jm*sBo[}&Q1DVpa#Nr9`ex=:~$ex=:~$ex=:43x@9qEqZ[0yex=:~$ex=:~$ex{*X:&;Opa#A8t`ex=:~$ex=:~$.Qk7+j]X(2xz<syn:MC.^dm%h^f8TsLR@=i*&<H8;km>C8;km>C8;km>C8+F__ezevx}1fiVoXtc9DDzVj@}wfIdWnAogqtm<UGMC.4k\"%kq6o|[$J9}H.IeK>=:~$ex=:~$ex=:~$ex{*>+y^*2D9tm\"U/lW0hs\"%Yq)C)9#1:.[~EBWn<%(>C8;km>C8;km>C8;km>C8;k(B`?:Bdae:e0eaVR1Yrz\"|,}})sII%kq6ort,S/rl7=ts_,Jtm<L~c8q}*2&m%;V,F,8t`ex=:~$ex=:~$ex=:~$ex=::c:unB9F;[$J9}H.IeK>=:~$ex=:~$ex=:~$ex{*&~1D=J{F,8t`ex=:~$ex=:~$.Q[}.A.[<%]Sqx9`ex=:~$ex=:~$5ore=xs_oBezSu.veUwf`fE@94h\"aj<s8q5+0$ex=:~$ex=:~$ex=:~$GGv)6f]X(2xz<synK+Yf@pz@mFH\"Pm~nR8_.Q%.^/JO\"mrk|#=d)_K!JPcVKZ[0yex=:~$ex=:~$ex=:~$.Qr.jtM_Skjq0L]U?&TfNABieSc9]jJv(=d)Yth=tPm>C8;km>C8;km>C8;km>C8;kgbezdCurhGLVoX8c>_TLijhJwfuAk[/4F{5rHK?lD*H_L^Vq[{DzTnEo[}vf7@VFQHqx9`ex=:~$ex=:~$ex=:~$ex=:u;7@NiKB<D{BUJY*&<H8;km>C8;km>C8;km>C8(]>_<LfL>5nW~$ex=:~$ex=:~$eF(7+j$=tPa#Nr9`ex=:~$ex=::c<^&MD9tm\"U/lW0Apm%@JO\">D:B]}})2th=tPm>C8;km>C8;km>C8;k(BI(Woi+4~>+!izp{wqz<|eUhd;A*u/Jocu5^U,}[~Idi8\"2xz2L|14vI*hD7@NiQHqx9`ex=:~$ex=:~$ex=::cx@9qEqma)LW.;f=t|idH)z]jpvi!Y~StU%k\"QHqx9`ex=:~$ex=:~$ex=:~$ex=:Z&m%;Va8T?@Y\"KQ)l;5@zqQ/0yxoN!3.`fk[;k9DJm@YI7mGa%6;/4F{OufR0Un)aN$=tPm>C8;km>C8;km>C8;km>C8;k??Jm*sBo[}&Q1DVpa#Nr9`ex=:~$ex=:~$ex=:43x@9qEqZ[0yex=:~$ex=:~$ex{*X:&;Opa#Nr9`ex=:~$PI\":~$ex=:~$eF(7+j$=tPm>C8A3vIn?4gPID+0$ex=:pWpANk/\"09<|PaPev;@&X^QHqx9`ex{*.Aeusq>_=s)YI7l7@NJ2!ioc,8t`ex=:~$ex{*Jb^X(2xz<syn,lY~;AS;Y^9D3(|18q\",_+E@dF9DTL8wt8R9Ie7ItPm>C8;km>C8`XtGsa)LW.;f=tN@Vq9DDzVj:MC.^dm%CklC:9TLB7l7@NJ2!ioc,8^?f>5r9`ex=:~$ex=:M:&;Ckjq0L]U?&4~[fE@|ijCvzqSGMC.u~OD4FB~tm,c)Ql7DNWn<%(>C8;km>C8;km>C8;km>SUPcVKma)LW.;f=tX%FFmY.m7S|v0.Et3r=4}_rz!!|v:.eHC8(]n809HgPI\":~$ex=:~$ex=:~$ex=:u;7@Ni^b!Lyn9v9)_++i+HFqA(?`]vI~s;ealF*oTs?2AvA6Et3r/3M9Jm*s>5nW~$ex=:~$ex=:~$eF(7+j$=tPa#Nr9`ex=:~$ex=::c<^&MD9tm\"U/lW0Apm%@JO\">D:B]}})zxx@xUjCg9|1Ar2fNBk[jpa#Nr9`ex=:~$ex=:~$ex=:u;7@NiD9tm\"U/lW0*QE@@4bC)ssS8l_0~(Wi(q5qmaI|XvDfrs\"%3Sg:Dz~Ub8{*hD7@NiQHqx9`ex=:~$ex=:~$ex=::c:unB.8T?@Y\"K^G7py^(2A1rz/UQx4~>+!izpII29SSQq\"~\"!ODjp1B<D{BUJY*&<H8;km>C8;km>C8A3vIn?4gPID+0$ex=:~$ex=:~$.Qk7+j]X(2xz<syn:MC.^dm%h^f8TsLRi+8.$9E@4JQ/d*,S6+gfXOdQnkm>C8;km>C8;km>C8;k??Jm*s}7u.o;5@P\"f8TsLRulif.NW@9\"cIHLlS^.a(:c!JPcVKZ[0yex=:~$ex=:~$ex=:~$.Qof++m%wS^C8bybmdOf;;8Wsq>_=s)YQQl7DN>vvBQ/29Gg:o[}&Q1DVpa#Nr9`ex=:~$ex=::c{+:H]F,8^?f>5r9`ex=:~$ex=:M:&;Ckjq0L]U?&4~[fE@|ijCvzqSGMC.u~OD4FB~tm,c)Ql7DNWn<%(>C8;km>C8;km>C8;km>SUPcVKma)LW.;f=tX%FFmY.m7S|v0.Eth=3VYY=s]scA/:43:unB9F,8t`ex=:~$ex=:~$ex=:~$GGv)6f@&#X;0ElPCKM/,sfE_PHn/A(?`]vI~s;ealF*oTs?2AvA6Et3r/3M9Jm*s>5nW~$ex=:~$ex=:~$eF(7+j$=tPa#Nr9`ex=:~$ex=::c<^&MD9tm\"U/lW0Apm%@JO\">D:B]}})zxx@xUjCg9|1Ar2fNBk[jpa#Nr9`ex=:~$ex=:~$ex=:u;7@NiD9tm\"U/lW0*QE@@4bC)ssS8l_01LV_]4H1psl`@}g~,HC8(]n809HgPI\":~$ex=:~$ex=:~$ex=:u;7@Ni^b!LynjJl77pk^cFd&nj8lgyp.b;8Wsq>_=s)YQQl7DN>vvBQ/29Gg:o[}&Q1DVpa#Nr9`ex=:~$ex=::c{+:H]F,8^?f>5r9`ex=:~$ex=:M:&;Ckjq0L]U?&4~[fE@|ijCvzqSGMC.u~OD4FB~tm,c)Ql7DNWn<%(>C8;km>C8;km>C8;km>SUPcVKma)LW.;f=tX%FFmY.m7S|v0.EtZU;|zPkm|1n=/:43:unB9F,8t`ex=:~$ex=:~$ex=:~$GGv)6f@&#X;0El{B7.!7kJ(iVa&CkmKXgyp.b;8Wsq>_=s)YQQl7DN>vvBQ/29Gg:o[}&Q1DVpa#Nr9`ex=:~$ex=::c{+:H]F,8^?f>5r9`ex=:~$ex=:M:&;Ckjq0L]U?&4~[fE@|ijCvzqSGMC.u~OD4FB~tm,c)Ql7DNWn<%(>C8;km>C8;km>C8;km>SUPcVKma)LW.;f=tX%FFmY.m7S|v0.EtZU$4?mC9MJiUg~!$eF`f++s;<%(>C8;km>C8;km>C8;km>SUPcVKmazb?&6]&QJ2,J31)ml<F!!7Ft^X(2xz<syn]l/3ieF@(2m/+t4EeF`f++s;<%(>C8;km>C8;km>C8(]21H(N?m#nW~$ex=:~$ex=:~$5ore=xs_oBezSu.veUwf`fE@94h\"aj<s)Q!77N>v*2*omrL1=au0IeK>=:~$ex=:~$ex=:~$ex{*&Q1DSkjq0L]U?&P)`NJ2!i`Iv?nLgAi*O`J2,JzIaj8lb8{*hD7@NiQHqx9`ex=:~$ex=:~$ex=::c:unB.8T?@Y\"KbfaAY^@59zK?0|tl1fG$]vI~s;ealF*oTs?2AvA6Et3r/3M9Jm*s>5nW~$ex=:~$ex=:~$eF(7+j$=tPa#Nr9`ex=:~$ex=::c<^&MD9tm\"U/lW0Apm%@JO\">D:B]}})zxx@xUjCg9|1Ar2fNBk[jpa#Nr9`ex=:~$ex=:~$ex=:u;7@NiD9tm\"U/lW0*QE@@4bC)ssS8l_0N^CreK08&u1OC7v)6f$=tPm>C8;km>C8;km>C8;k(BI(Woi+hGLVoXQCHYTLenW.qekAI2]50_qz0|tl1fG$]vI~s;ealF*oTs?2AvA6Et3r/3M9Jm*s>5nW~$ex=:~$ex=:~$eF(7+j$=tPa#Nr9`ex=:~$ex=::c<^&MD9tm\"U/lW0Apm%@JO\">D:B]}})zxx@xUjCg9|1Ar2fNBk[jpa#Nr9`ex=:~$ex=:~$ex=:u;7@NiD9tm\"U/lW0*QE@@4bC)ssS8l_0N^Cr.BvCC9zV.Q[}&Q1DVpa#Nr9`ex=:~$ex=:~$ex=:u;7@Ni^b!LynweC.!%6;TBtmi5Svs+z~XeOD756C2L6nd7u.o;5@P\"L/d*wjf}u.@dWnO]swk(Wo]U5+0$ex=:~$ex=:~$.Q[}.A.[<%]Sqx9`ex=:~$ex=:~$5ore=xs_oBezSu.veUwf`fE@94h\"aj<s)Q!77N>v*2*omrL1=au0IeK>=:~$ex=:~$ex=:~$ex{*&Q1DSkjq0L]U?&P)`NJ2!i`Iv?nLgAi*6tioIJn|!rfRrr\"~[wdQnkm>C8;km>C8;km>C8;k??Jm*sl0<7=tKC5i,zK?gQ:.L,;%f%PHn/A(?`]vI~s;ealF*oTs?2AvA6Et3r/3M9Jm*s>5nW~$ex=:~$ex=:~$eF(7+j$=tPa#Nr9`ex=:~$eF(7+j$=tPm>C8A3vIn?4gPID+K4{+:H]FUx9`ex=:~$ex=:~$ex=:~$ex=:~$ex=:~$.Qk7+j]X(2xz<synrlH.4e]@mUp{5rhQ]}gde0ea]eoc,8t`ex=:M:&;Ckjq0L]U?&))q(.^mFH\"Pm~n*&:)R;CU6XtG$[0yex=::c4%sq>_=s)Y`x\"~?d$W<Jez:s_B]}})2tZU@KiPpsb`PMwf87^X/4O\"0s`L)QRGLe@&Ni?8#LVj{UI~^di83S(8J9BS0=l7SDOD=Mp{|[XE>5nW&<H8;k(Biavjd7:)pN1iI2Q/u(pj`q5+0$ex=:M:&;Ckjq0L]U?&Tfa%E@@4l{w[0yex=:~$ex=:M:&;Ckjq0L]U?&Tfa%E@@4bC)ssS8l_0:%U;KFVYrz|1Wa[}.A.[<%]Sqx9`ex=:~$.Qk7+j]X(2xz<syn,lY~;AS;Y^1YezL14vu0IeK>=:~$ex=:~$ex=:M:&;Ckjq0L]U?&4~[fE@|ijCvzqSGMC.XOdQnkm>C8;km>C8;km>C8;k??Jm*s}7u.o;5@P\"f8TsLRulif.NW@9\":7bzTL!Me:d!1i~48X<D{BUJY*&<H8;km>C8;km>C8;km>C8:27{C9[`]vI~s;eahKIDpsS#B7mGa%6;/4F{w[0yex=:~$ex=:~$ex=:~$ex=:~$F{C.<!*uwS^C8bhDVv:.Os)<`KOYu(?`@}a)jVoXeS%zK?5RU=i*43I;tcP&$[0yex=:~$ex=:~$ex=:~$ex=:~$GGv)6fTr(]n809HgPI\":~$ex=:~$ex=:~$ex=:43x@9qEqZ[0yex=:~$ex=:~$ex=:~$.Qof++m%sq>_=s)Y\"Kn);AS;Y^//=scXN+Yf@ps;jpiwps|`XAl7+(=@5i\"8)s#`IM:.7p`u9w1/:(ev!=;f4b@&5iW&iLdb9KxGU_L^fKxzpsKX.F`f++s;<%(>C8;km>C8;km>C8(]21H(N?m#nW~$ex=:~$ex=:~$5ore=xs_oBezSu.veUwf`fE@94h\"aj<s8q5+0$ex=:~$ex=:~$ex=:~$GGv)6f]X(2xz<synK+Yf@pz@mFH\"Pm~nTGVf*Q@&]4R/kmIsur0f,0X^?Fswk(Wo]U5+0$ex=:~$ex=:~$ex=:~$5oI~{dn%sq>_=s)YI70.e0OD(\"QHqx9`ex=:~$ex=:~$ex=:~$ex=:u;7@NiD9tm\"U/lW087\"%<J5CJs.L.l_06c!JPcVKZ[0yex=:~$ex=:~$ex=:~$ex=:~$F{C.<!*uwS^C8bHjeUl7\"dm%$N|\"vj~UQx2f^Q.^P\"0_.m[1QxTf^d7@P\"*,xtpj{U;*xbLv;k8_}Ryn3|Y}XOdQnkm>C8;km>C8;km>C8;ksw8m@n3vY*&<H8;km>C8;km>C8;km>C8+F__ezevx}1fiVoXtc9DDzVj!!1fRb\"%FFmYezGglFwf\"xZ@k2~8k(BRw+~.uj.^/JO\"salS)QRG[;4onB215s8wC7v)6f$=tPm>C8;km>C8;km>SU6XtG$[0yPI\":~$ex=:~$ex=::c<^&MD9tm\"U/lW0Apm%@JO\">D:B]}})2th=tPm>C8;km>C8;km>C8;k(BI(Woi+4~>+!izp{wqz<|eUhd;A*u/JocC#VX~v!7*9S;h2|\"aj<s.F`f++s;<%(>C8;km>C8;km>C8;km>AroBA/rzevx}1fiVoX>OH\"T9cj@+!7W@d2jOoc,8t`ex=:~$ex=:~$ex=:~$ex=::cI;tcP&sazb?&6]eA1i(2Z7bzOjAvPe[f8WlF!8iLyn@+!7W@d2jOoc;[ONi+=6lwdQnkm>C8;km>C8;km>C8;km>C8A3n809HgeF`f++s;<%(>C8;km>C8;km>C8;km>SUP27{C9SgPI\":~$ex=:~$ex=:~$ex=:u;7@NiD9tm\"U/lW0*QE@@4bC#LAUcAPe`NJ2!ioc5#BStrF6M~n%CJj{kz;Q}7rej%W@Jk7{[m^se+;3=!CU>F__ezN?f>5r9`ex=:~$ex=:43<^&MQHXQ0yex=:~$ex=:~$ex{*.Aeusq>_=s)YI7d)pNODKF7wqz<|eU%0IeK>=:~$ex=:~$ex=:~$ex{*&Q1DSkjq0L]U?&P)`NJ2!i`Iv?nLgAi*rA1i(2(8PsBSAvPe[fCU>F__ezN?f>5r9`ex=:~$ex=:~$ex{*>+y^*2D9tm\"U/lW0hs\"%Yq)C)9#1:.[~EBWn<%(>C8;km>C8;km>C8;km>C8;k(B`?:Bdae:e0eaVRH1:s)LgA{)_+E@@4l{5rHK?lD*H_L^Vq[{DzTnEo[}vf7@VFQHqx9`ex=:~$ex=:~$ex=:~$ex=:u;7@NiKB<D{BUJY*&<H8;km>C8;km>C8;km>C8(]>_<LfL>5nW~$ex=:~$ex=:~$ex=::c:unB.8)9xoC.[*13K%dHzFZP;1C.(fdQE@@4l{OupRc.e:NAn%SkUYCsb`0UG:tx(^3K</Pm4X9K\"~/xaD~4^F59@KylI*hD7@NiQHqx9`ex=:~$ex=:~$eF(7+j$=tPa#Nr9`ex=:~$ex=::c<^&MD9tm\"U/lW0Apm%@JO\">D:B]}})2th=tPm>C8;km>C8;km>C8;k(BI(Woi+4~>+!izp{wqz<|eUhd;A*u/JocC#VX~v!7$ab_:H6z|[$J9}H.IeK>=:~$ex=:~$ex=:~$ex{*>+y^*2D9tm\"U/lW087\"%<Jq{w[0yex=:~$ex=:~$ex=:~$ex=:~$GGv)6f]X(2xz<syntateddb@uM5q5s~nEo[}&Q1DVpa#Nr9`ex=:~$ex=:~$ex=:~$ex{*vf7@VF^b!Lynwerej%W@YN|\"vj~UQx2f^Q.^P\"0_.m[1QxTf^d7@P\"*,xtpj{U;*65kv;k8_}Ryn~8Y}XOdQnkm>C8;km>C8;km>C8;ksw8m@n3vY*&<H8;km>C8;km>C8A3vIn?4gPI\":~$ex=:~$eF(7+j$=tPa#Nr9`ex=:~$5ore=xk%}p>0Dzwj:MC._+&;/Jq{!a)LW.;f=tN@Vq9DDzVj:MC.^dm%*\"KB=_(|sU5+LGK>=:~$ex=::c<^&MD9tm\"U/lW0Apm%@JO\">D:B]}})zx(^|iL/:s9b8q5+0$ex=:~$ex=:~$.Qv~aNBi!i^b!Lyn&v=7:tU%*\"D9tm\"U/lW0*QE@@4bC\"LJSKMC.XORr[Xg:bzWw1\"&6vNS;Vpa#Nr9`ex=:~$eF(7+j$=tPm>C8A3vIn?4gPID+K4{+:H]FUx9`ex=:~$ex=:~$ex=:~$ex=:~$ex{*X:&;Op(>C8;km>C8;km>C8;km>C8;k(B<Dxo{UY*0$ex=:~$ex=:~$ex=:~$eF(7+j`ankm>C8;km>C8;k(B=_(|sU;W~$ex=:~$>", "Rb.^iF(8", "m&x;nBn/$15R4v\"~vfODHkiCqx9`ex))l;\"%dHzF\"u;QP.9)\"!E@X6a#Nr9`.Q9)~HC8N6a#Nr9`.Q!77N0ri]fHqx9`exQ~TNBig2&xpD[?f>5r9`\"}]GeN0ri]fHqx9`exF6e0*uP6/tp_<14|nW~$ex#G)A_%cF&x|_JE775+0$ex=:&pru<JX|!rsRulK(&<H8;k%w|(nL{U!7!$[MC.tidQnkm>2oZ^PF!L,cb8&9T2dQwga#A8Av)=9)Gpg<EUZwrz;1WaN+`)%@|iDoHLdbgANd&<aA/Ja/45,c:aN+a_1^dH//4#4X.vN+a_v_KFg,u(j1WaN+a_1^O2$KuL|1z|nWG`&;EU01A(QLnd|d&<PWnBx&@*MH:a9)h~dQ|\"zFC9hXM.Yfw_S;}F$KpsZJd.#d&<aA;XC,.m4+JA,7reGBlFf8M0r;F+0)f0ODHk]x#Ln2PX})JIo/#XL1(usRurr@i~P29FL1X10yaQ9)R%L^BqzF3(ERo.Zd?!n%}F){iLIsz|nW?Wn%YqMPH10y+\"})vf1,fK9Dj#JSKMC.<29Qnkm>C8:Hn8PmmKb8R.[f.^wSG8;zXSUJwf(e7IT%]SqxajhJA6aWruJkiCqx9`exQ~EBQJ6S|\";m*VOB})&dR=tPFCXQ0y=7l7@!GiGBx&mag?f>5r9`5dDf$~t^:63~tm,cc|nW~$exM7Id_]6Xb{iLLSGMC.!$:M:.4e(i=%(>C8;kFPqz/`!\"6)&idQnkm>2oTBtm}?ERlU<7!$rq*7i:J+g.%j,8t`ex=:x+_]\"S41}?sSb8y~aN<i=%(>C8;kID59V#b8N9N`4%C6a#$R0yPI,0/dE@_c%Pu(b`R8Hy<29Qnkm>/&oBF6n?9Vexl:ReGipK}_ezNMPIhp&<yQ|\"xD.m,URFC._+&;/Jq{lag?f>5r9`bdY~c(1iDVO\"\"uev7o:z$L,2C.fHXQh?m#nWxtU%VFDC4#<s]}re&dru;Ya#Nr9`MId)vN=@_6g:p_7cc|nWYe7ItP&I;z&{]Ud)$3n%<JQ8!R0yex=:[:J2<", "$~t^:63~tm,cc|nW~$exM7Id_]6Xb{iLLSGMC.!$:M:.4e(i=%(>C8;k3/=(<|Bd$dApm%@JO\"&uQXGMmG*idQnkm>/&(2j6.mMN~l3.eH2o*2*o>DIsd.5+0$ex=:YWF;!kPxRz5MPIhp&<yQ|\"$1rzH+yl2.^druNk&I;zroo.8eY~fSDVO\"29|`llnW~$ex))l;\"%dHzF\"uMJ]}Of;%R=tPm>C8B27{?j&sb8O}(eK>=:~$bdY~c(1iDVO\"$1cj+M57!$5=0.C)1JhSJ6^DSveUDfhDY^&2{Fsz3[175+jF9Qd%$4_LLSGMC.vWb@JF]Cmag?f>5r9`jMDf.NJ2!i&xPsfLAvPe]dR=tPFCXQ0y&{wfLefSDVO\"29|`llnW~$ex))l;\"%dHzF\"u;QP.9)\"!E@X6a#Nr9`.Q9)~H^XV4nm,8t`ex=:1A_%cF&x$_7cc|nW~$exM7[fE@>F1|29/`Nq%(5y0i=%(>C8;k1YtmwXb8F63AE@X6a#Nr9`.Ql7DNQJ6S|\";m*Vd7Z9a;Z_<7g:Rzl`u8@3]`4%&^D9$_AU`v59}n1J.eUtm%7c.xk}m5w+)ePx}*jEO+|dU_`+{GB\"C_%q88qz.L4%2kico%|Xoo6),x*+mOh>[X3XK~z%A`NqA9Gn%UsGposahmq{]?gX4%2krx}*I`=7*7f9#v|k$>:_+Um\"u(D`Dua~8Q5_4HQ8@3]`4%&^D9$_AU`v59OG/v%.<02DCEAr&9/nWa*f{x}*jEO+|dU_`+{GB\"C_pjlq%(wX8rO4|83_DXh\"59D`Dui]poHPevIot?7Ne+E^icK;NXq{6),xhWT@zx!Dk2~8@3]`4%&^D9$_AU`v59OG/v$7ff2DCEArcdO)}=>G9x}*jEO+|dU_`+{GB\"C_pjNq^?~n}=,7posadq&{s?;`q+mOR$4%&^D9$_AU`v59]`bA:._?C_SEArcdO)n=H.],Rzl`u8@3Q$=7*7f9#v|kic};NiIo6),xpAT@Xt5_WcO+.:v`DuNk59NLRDS\",:O)WaF]NIRzl`Zxk}!5w+8GPxP", ",x*+mOfHXQh?m#nWC&E@w2cw|(BSgA/}3AC_<J.8!R0yex=:[:J2Pc>_^*/`[MC.tidQwga#A8Avvv})@!!iSF|\"=(dM_I\":~$ex9)DAE@@4L|la@n2M:.aN)2=%(>C8;k1YtmwXb80fqtbn=7;B5r[Xdo<:9bCA[6a#Nr9`OBd)pN0ra~:x}*>n.y3.\"d1ih2H\"]?&*ul_0(eK>=:~$PMwfppN;!kRtp_7cc|nW~$ex8.$9k[!k%xRz5MPID+0$ex=:.A{u\"2X1&uND8l/3(eK>=:~$`v!7Fe<^3K%zpsLR@=/:ApW@Z2<m,8t`ex=:YWF;!kdx9R[?m#E+LGF`\"SH\"!LIs}7E+0$ex=:.A{u\"2X1&uKmeU!7L&#%~4x&09BSc|nWH%:u74|/4#<s]}re&dru;Ya#Nr9`.Qre&QW@]w&xg9|1+)5+0$ex=:K~M_Z^21:sJv]}})@H^X/4Q/kz;MPI\":~$}Kk~~H/&F]po3[0yex=:OGb_Z^ID59V#b8/?v`4%C6a#Nr9`}KPe]N9;!kPxTD9MPID+0$ex=:)p5@cFmYez/`XA1fZ~,u@JfHqx9`ex2f*Q0r]e9,e[0yex=:u~OD4F&x^%<14|nW~$ex2ft+(i+Uj{kz/`[=\"~!;W@iF*oY1SE|Q<:15EAw<D9`L.L6+w}2X0J=%]S]8^??~2fM(_%/J/\";zl1gya)ux/]tPm>C8.X9zXzxo2=/:K~M_C6a#Nr9`MIA6nN&;~wc9DzBShJwf!$#!H.^d1i=%(>C8;k5qvj\"sk{wfLey[!k</ezL1J.5+0$ex=:++C_:HS6\"u%qu8@3(eK>=:~$bdY~c(1iDVO\"$15RnM*f!$JM;~1I*+Nk1B5ryLexk}#50J=%(>C8;k1YtmwXb8@0>?o2=%(>C8;kaYu(;1Al{f,0X^?F&xd%7cc|nW~$ex4~Ob!ipK&xRm&|4vl7zidQnkm>2o^4O\">D=||ln($a*+mOfHqx9`ex))vAm%@J5CJ9j14v;f!$&v:.(e7IT%]SXQ4N~l3.$3n%<JQ8!R0yex=:ZrP2oC\"8", "6p/[NXc9DzmRn=/:Y(y^G<1B5ryLexvd]`bAeeUL,8t`ex=:x+_]\"S41}?sSb8N9v`4%C6a#Nr9`ex!7i(}%u6/tp_<14|nW~$ex)),0/^5in|laJEO+M(&<H8;k%wCsKXQv})Ke![!kez:s`Lo.5+0$ex=:&pru<J5CPsdbF!;f!$A8@3(eK>=:~$jMtepNODg^Z729BS1=/:C~+i=%(>C8;kez:s`L\"=k~CeZ@#Xbo\"uKmeU!7(e7IT%]SXQ4N~l3.$3n%<JX|k[[igAqe.NQJwqVYrz.nJAe:OeK>=:~$5dDf$~t^:6pcDz51c|nW~$exF6e0*uP6R$m=tPm>C8*S41}?sSb8O}(eK>=:~$bdY~c(1iDVO\"\"u,S&}H.&Q1D^JO\"3[0yqlnW&<bJFFj{iLvSs!mI[fE@uHa/u(dM_I\":~$.Qre&QW@]w&xg9|1+)5+0$ex=:C~J2|iNbpsij1=/:ydm%@JGm,8t`ex=:YWF;!kPxRz5MPI\":~$ex\"~@0&;EU&x^%7cc|nW~$ex#G)A_%cF&x^%JE+)5+0$ex=:&p_]>F1|v?3[b8Q~4b/^6Kk0Dz5MPI\":~$}K|6Bb>%]4K|!rk|.v57didQwga#A8qmta9),dc<iF;L]8t`ex=:.A{u\"2X1&uND8l/3(eK>=:~$O!;f;AQ^Z^1YezL14va(U_ODKFp{3[0yex=:dWW@RUbCT?L1b.a(U_ODKFp{3[0yex=:rs\"%4Fa|!r2HO+M(&<H8;ks`2L)[;va(##l+mOfHqx9`ex~.mb;^5i`I;z?VlNj?BBR=tPm>C844PDezL1Al17]dm%?F&x~m<sz.5+jF9Qd%$4k(BRAlS&^dN;)Bn/mag?f>5r9`:M:.4b0rm\">Gxj[?f>5r9`IMC.ieN@_YT|!rUEO+M(&<`]tPa#%Dpqe}n)S5*u74.8!R0yex=:OG1DBUPFZP|1Qva(dW,u74fHqx9`ex4~Z~S;%6D9c%<1hJY~(eK>=:~$#!kf3pt[!k4Yn?BSgAV(&<H8;k3~DzBSB7Peed0rg7dx9R[?m#d", "zdb_&", "W?b@O2(8", "UtAC4NPx", "^dDu~]A8", "ie+i!k}8", "gW1i^Ja8", "B5k[O^*x", "QeaUVqix", "Rb.^iF#Y&9N1~v+/!~8", "w_S;KF08", "vfOD<", "R;k<lc(8", "[f+ioB?8", "Apm%@J.8", "Zs\";NXf8", "=pk^Z2$K3(", ",dOiaC#Y&9N1~v+/!~8", "NAm%^4#8", "=pk^Z2(8", "t+o%=", "gGODDVc9DzBSndC.BbW", "gGODDV~f0s+B?l(f", "G`P2<Jc9DzBSndC.BbW", "xIU%1C41M0:Bday@e0z_", "vf7@VF>8", "[J7@}p4>", ";I)2oCy8", "EBh&Im<8", "Ap+ipK4>", "Z2I%Ls>", "vf7@VFQ\"@*!13F2fNBBiQs|1!LQ", "vf7@VFQ\"@*!13F0f6f;^m=wjo?^6x", "C_+i}F]C\"LJSKMC.", "m37@|i0HC9yC8vk~_+`A#X+8", "PeODDV$>", "++;^&m?8", "/Nt^hS?8", "y!*u74.8", "m3K%dHzFZP_C:a9)diI%Ls>", "xtU%h^1Yezro{U!7Ix", "C_S;!i%zps&s+=:)&x", "2DBDyH38", "ie<^yF}8", "1AK%dHf8", "?W,u3Sj{P", "m3K%dHzFZP;1C.(fdQE@@4.8", "?WC_O^y8", "Y_S;KF$Kps@Rx", "`NJ2!iQ\":9rox", ":tU%h^H\"Uu9", "m3K%dHf8", "Jes@cF~8", "q:J2wqzF.mJv~lo~aNBi!i>", ";A*u/J>", "=Q/^iF%zr", "_+BiHkX0P", "6pt[!kSPt", "V(zuCJPFt", "%xaDSkEqt", "LeODKF_fP", ".N}%)bqNW", "Mb1D}F|Y:s;", "/NM_q^dx", ";yKWE^dx", ";y#WhK}8", "C~M_u", "?dk[k4^F!L&s=.t.(dm%$N%z3(", "x+1i:HO\"1z#", "x+1i:HwqS9mSx", "%?o2^Jbor", "%?o2^J9Dr", "1AK%\"2(8", "xvS;/Jl7P", "/NE@Fq=obz:lmd2&(Q,u?F2<_(ERn=/:obU%^Jx&@*>n>", "G$dM!7\"x?iKF2<}R<UurhGzxN@4F9D.m=Ux", ";I)2oCwwu(`1w+", "OWBiHkX00swXb8", "]`bitcp{Tsl``x", "vWI2dF__TLa", "F)r+", "PQK%Gwcwt", "dd@&]KVYt", "GHC8GKf8P", "BbE@2kB>", "rNUtNQP&Ts<srn!7\"dm%,", "Apm%vBPFA(", "^pBi,J!8", "9f7@VF>", "gW5@qFa8", "1Ay^VF(8", "pp[2*2(8", "Mb1D}F38", "mbODKF>", "aI\"%<Js,x0", "3AC_<J.8", ";I)2oC(8", "/NE@Fqdz^jJv(=d)7d{u#nq{;zzVex?f*QODFF!8>t", "G$T}1f[:M_/JL/59NDUMp.SDM_VFPF9jN", "/NE@FqdzbzmR8rWeW@OD9F2<_(ERn=/:obU%^Jx&@*>n>", "[fE_QB.8", "/NE@Fqdzbz;", "4b1,MqT/:sN", ".yr[~4X|!rf", "6p7@6K9Dmr9", "cbODdH1/<s\"Ls!!7pN2,zqxD.mb", "rNUtNQ18", "vNS;Cn~8", "LeODKF>", "/d*uGKf829XS/r", "te<^iF&CfL`LG=y", ",d5@4Fpx", "Z~S;Hkox", "FbS;%6m>", "obU%^JQ8", "[J4o_", "/NE@FqA8", "l~\"%<JQ8", "\"x_bTKf8", "GHC8GKf8", "=dru.wm>", "G$dM!7\"x", "E)U%Ck(8", "|A{uCk<8", "zxN@4Fa8", "vf[2<", "rNUtD|__.m\"Ls!!7pNW", "[f&;tcP&P", "/NE@FqdzrmzbgA;f.yr[~4X|!rXXF+l7oNlu>\">", "[f&;tc18", "Gwu_`7rx", "\"c_4ln+8", "[fo2Oq6zP", "/NE@FqU\"H9SSEXn)aN{u#nq{;zzVex?f*QODFF!8>t", "++b@|iL/+mijhJwf", "[f0iDVn8", "}dm%@JQ8", "`NJ2!i$>", "XI<i,", "[f0iDV!/tmhQ3l0", "dd!ifK<8TsLRul`f^p`u", "[f0iDV!/kmb26+", "Apm%@JO\">D:B]}})zx", "i~P29F^Pkma", "*QE@@4bC)ssS8l0", "i~X^|ia8", "0$ex=:~$ex+", "~$ex{*.Aeu_", "i~P29F;0fL[", "pNODKF7wqz|", "@ps;;kCPpsn", "XOF>=:~$ex=:~$ex=:~$ex{*&Q1DSkjq0L]U?&P)`NJ2!i`Iv?nLgAi*43:unB9FUx9`ex=:~$ex=:~$ex=::c0[qU(>C8;km>C8;km>C8;km>C8;kD9tm\"U/lW0;%S;Sk21=s5R]U!7@N>vaVr&;z)nf>5r9`ex=:~$ex=:~$ex=:~$ex`.1f5@P\"U\"p(?V2KV6", "xR;J9Gew:slR?8Y}R30[qUxNNr9`ex=:~$ex=:~$ex=:~$exv6(dQ[k4JCxt&`u8Z9a$k8800$ex=:~$ex=:~$ex=:~$ex=:##\"%&2]C8bP|:.G:&pk[:Pm>C8;km>C8;km>C8;kpcUx9`ex=:~$ex=:~$ex=:~$ex=:l`b_3SzIUup?9K,:;$Y8WzzsD+[~*,!r", ";$Fq^?,sWan)zxd%XE&F@?uBi+t.\"0ru6K~8Xz##tv(fEbn%Pc.Q@:g)MA,7x7K%,`Fq|9\"bWan)*xS:MJ&{g}cXq+2.3~:_tc`{tz0B^XT@Ix!D\"2*F,:$)>=H.w9!DA`Sq|9\"bWan)*xj%#iKKY}7ne+vD/t5_SHR|u(PB/&ee(Blr$m6{!9oLw+!k@0:_6K6{tz", "5$Y8Z92XEA(f?Qm%QXsq+zt;Wa*fD90DCEe{tz,s2o>GF9!DHE`{,:g)MA,7x7K%,`g7k}#`i+>GPx7{02n\"u(KXq+v)g:@%#iKKY}7n^XLkgco%+U8Xqz|$sqk}4Xw+>GPxj%$JOKY}7n`+I7gcpDPcc7=9rs1JV]zxx;;XMIm?zsBJV]Bt!r)`.|,:rBr+[~{xn%", "1$^WN9w)MA,7x7ruQXiqGz*sBJ;~D9lr[XvqqzKX\"=!k4~:_fK38>?b$g7k}7ni+>GPxH_>s]{XzZD,+I7Fcj%Nic7=9$aLvS.ffTD?q.Q@:N51JV]zxx;&`g7k}#`i+>GPxS:QXFqw}{BBJ;~g:>%$JlqY}7n2ou.xxruCE`{,:9btvn)Ebv;,`3|k}#`i+>GPxH_", "w)MA,7x7rur9l0qzX#,+V]f0laHH.Q@:N51JV]zxx;&`wqGz*sBJ;~%xS:QXFqw}{BBJ;~_f0D?q.8>?}b2ou.xxruCE`{,:Z)q+,7x7K%,`3|k}#`i+>GPxo%DXx&u(uBw+vDg:>%#iKKY}7nC8`@Eb2D\"238/:q$g7k}7nq+>GPx$_)K]{u(uBi+I7cco%|X8Xu(", "SDbAM]sbn%liMI59{bWa(fCb!r$m6{!9oLw+!klx5D=`e{k}%B}=8G*x7{viUKY}#`>==7zI:_6K6{tz0B^XLkZc@;9q_G=91$Sqw}/s;vn)zxj%DX;|qzL5C85kzxd%qF&K4*0$ex=:~$ex=:~$ex=:~$eF`f$(`ankm>C8;km>C8;k(B=_(|sU;W~$ex=:~$ex", "fA1iFFWq2L|14vsI3An%&", "m%1iI27oHL)[;vy", ".A!i/4.8", "&dE_,", "Aps;/JL\"v?3[LFwf", "w3s;/JL\"v?3[aq*}", "Gp=@]4f8", "4bJ2:H.8", "RgRiaC$KUu", "et~@B[g6t", "GAz@fK!8", "IJ7@&", "mbb@]wA/x?[18r", "Obn%", "i~<i^J>", "[fU%^J.8", "Aps;/JL\"29a", "5LODKFlx", "[;E@|i(8", "y!*u74=zP", ",0/^+qf8", "ppU%^J.8", "ppE_]4!/t", "xRe18![7W", "xvS;/JMx", ",d0iAMiPf(hX0=&6^dW", "?dE@qFa8", "MWE@M^H\"t", "PeODDV$>{L[18vk~_+`A#XRf8", "rNUtWn<8", "]d8@w2(8", "*QOD/J?8", "K`OD6;(8", "A!@&]KQ8", "4b0rzo08", ";fU%Ckk8", "vfC_>\">", "G$rlH.Ax", "Apm%@J|8", "ieODDV>", "Gp2i^J?8", "Osm%", "Gp2i^J18", "]d1iyHzFt", "/NS;\"", "`(W,Tb{P!D2jur{", "gGODDV~f0s+B?l(f[:&;,mH\".}", "vfz@6KZ,d*|", "GwNCRs>", "pp*H$Mp{c#\"U6+", ",dM@6K!/t", "x@b@Z2>", "Gp2i^J18P", "XW\"%l@xx", "kd}]_c>", "kdlu^47Ft", "fB_/aB*,Xu", "m37@|i$>", "\"dz@,", "Mb1D}F__:sIsur", "P+m%?qf8", "rv|,ovn1W", "^p{uLi08", "vfE_DV?8", "=Q%;nB?8", ")AR@w2>", "`An%}F>", "Ap(iFFQ8", "R%BipK>", "nAI25i08", "4W,u74n8{L@sx", "[;ub/JWDj#,{>W", ".yr[~4X|!rSQN+", "IdC_lFf8hL&se+", "dWm%y47FC9+o>", "Q%E@@4.8", "7pk^(2LYA(|", "\"d!inBG/t", "eN*u9Flw=DPCurhdcb&;vBL/ZPYXVv&6@NJ2!i{,XzDXnd:.:+L[^B38P", "9dBieS>", "hD7@gM.8", "\"d*u@4?8", "Pp,P*", "zdb_<J7zP", "w3m%@JO\"$P|K?l0", "^dDu~]Zq0L&sx", "00XPYaBt+", "MWE@\"", "ddI2NX(8", "XLO,rFQ8", "@p`A5iH\"P", ".A{unBa8", ";Iub@J.8", "xRe18!ix", "^dt^}F>", "`;7@vC%z/*2vgyp.b;W", "kAI2]5<8", "$^(iOq[{0L8lgyg~LIr^g2p{45cjz.y", "$^(iOq[{0L8lgyg~fNq^/Jn8", "=0.^iFA8", "4W,u74Cx", "sfE_PHG8", "<NU%vB~8", "{An%}F>", "E(+i(q08", "0@I%I2n8", "wLM_]4H1psU<7.qekA:@yF>", "XeOD75<8", "W@)1nB38", "kA:@yF>", "$^(iOq[{:9", "W@O,Mq]o%9", "XeOD756CC9", "Gp2i^J;Y$([", "Gp2i^JUYCsa", "Gp2i^J?G29N", "vfz@6KMx", "e0*uA", "d!t[^J.8", "_+zi*2(8", "O3Q<k", "_+%;)BG8", ",d7@`Ba8", "<N<isUQ/#|Isyr", "a%l^iF>", "Bs&;NXG8", "M~n%", "<N/[TK(8", "S~<ioCVYpslSGMC.", "a%8@Ni>", "x+K%WHn8PmmKx", "^d#%0n|\"09", "GpM@w2$K3(", "d!t[^JO\"Q:3[8l0", "#eS;@Jn/ezg&AvreE;W", "i~1D^1PD.mKXx", "{!BisQ|/0LD", "{!Bib#>_TLKXx", "{!Bil|)Fp9", "vf{uvB@8", "6fE@gNR\"0s+Bx", "4Wm%dHSx", "~Nb@Wc>", "bf<ioCJPTLs<7.qe", "bf<ioCJPTLs<7.qe[W:@/JQ8", "bf<ioCJPTLs<7.qebbb_<", "&QJ2,J31)mv", "`;7@vC%z/*2vx", "&QJ2,J31)mU:v!p.BbW", "`;7@vC%z/*2v)y3.\"dru", "&QJ2,JT1TLD", "ppU%wa&CkmKX!Wl7mb3b}F}_t", "<N<iI2Cx", "=d1D5b.8", "]d+iOqH\"@*0|:.{", ".A5@9qQ/t", "$~P2=JQ8", "cb.^qF}_TLD", ",d+ioB21.mb", "%f_%/J>", "=Q/^iFiPf(ro:.{", "E;.^qFa8", "Q%Y^5i\"8", "E;M_(JW&0sJK{U]G", "E;ODeBW&iLXSx", "aN\"%{H9DBNlSx", "6fE@Nb=zTsn", "4W,u74./:9;", "{!Biwa|\"P", "ddQ^aV~8", "_+k2\"", "4Wm%dH$K2LXKx", "ddQ^aVK\"BNlSx", "ud#%0n(8", "9d(i^J>", "ltJ2g2(8", "gWBi<", "P+Q^3l08", "XIt^/Jw,=sjSx", "{!BixQ}8", "ydK%,", "n%M_FF>", "{!BisQ18", "{!Bi*aQ8", "vfC_", "[;\"SiFtG29", "{!Bi6;<8", "{!Bil|a8", "{!Bib#18", "4W,u74qx", "E;}%", ",dM@6K!/V0^U]}qeM~n%", "&p>]bin8", "$~P2=Jn/ez\"thJ57!;M_", "@!t[^J)z3shQq+", "`An%.oMP3(", "$^\"%I2C,=s+oS!0", "$^\"%I2C,=s+oS!l,NB*u", "MbX^=", "hsS;|X5x", "/N1DoB[x", "!;E@\"", "&QJ2,Jbx", "OWb@bin8", "`;7@vC[6HL4XEXDf_+W", "^dt^g2|\"iLhE7.!7bbb_<", ">jODew>", "&QJ2,J%{09#", "@!t[^J)z/*2vx", ".A5@9q~8", "Q$ex", "vf/^lOEx", "*QP2uH9DP", "35MA<7dx", "^p<idF>", "|~t^]JQ8", "~db_~4rD7z;1Ar", "y!\"%NX~K!L,cx", "_+\"%|bO\"C9!", "z@&;|bO\"C9!", "~db_~4}Gu9=|UJwf", "z@&;.of8", "z@&;.ogqDzN", "]AE@w2s,:9ES_=?~j%J%]4Q8", "kp!D,JL\"45hXAlOfhy+ioB6{%9i+Vv})Ix", "T%U%I29zaj<s)ywf&pDu", "6yBDxU!\"t", "sII%kqf8", "_sQv@fJPt", "xto23Xdx", "\"9g+~BXth9b", "cbODIJ.8", "ddru", "g)l+", "Hyeu", "v~U%[Vn8S:\"|hJwfu~=@;XPF}?viJA2.vf_%", "7$(ne:[;]X<Ja/:s.Lx}.:,dI2g2n/ez;1e+", "##U%~V!/jrZQPal7IxI;iH%zpsLRi+~.p0M_", "v~U%[Vn8S:", "QAODKF^bez", ".NX^(21|09", ";AS;5@xx", "8dd2A4}8", "kd*u", "obU%)w>", "8dd2A4tmC9|", "Ap(iFF|/T9|", "h3/[NXD9[m8l3vq:SD=ioCR\"sa&s|vPeC~&;aB9DDz<s88", "nJOr{H$K3(", "/d*udHS6A(", "hym%<JQ8", "9p=@waVK59|18r", "{fE@cFM{H9kbgAl7Ix", "`t4^VqS{H9kbgAl7Ix", "XI<iG5*op(", "gW{uA", "gsc+rGq,C_3KWdW&^Bx", "YW:@#brD3(", "{do2pK%zT9=|Yvl77dk^VF(8", "(,Ivzq`x", ":?D[}H*x", "qb.[oggP!sKX^aEGOsW@6K@_=sl1c.qpAp<i0HEq<sJv!=l7<!y^;X+X?jsRav!7}+^2<", "JbOD&", "o;5@4F=FDPzs..H0", "h3/[NXD9T9=|Yve:c~.^/JO\"HPQXz.9)Pj&;EUJc8", ",0/^[Xsx", "p0)2<", "(,Ivzqxq+", ";I\"%NX<1A(|", "^!5_`K@/t", "m%b@rca8", ",pb@eB}8", "QA(iA", ",pb@eB9ot", "[fy^xUj{iL^snMI~%x", "qb.[L|_mV0&|ur?fUeJ2^J>", "eb;1(", "&pU%?Fa8", "t+K%^JQ8", "Ap#%\"2R\"29", "MbP2oCp{P", "IdM@*2/\"09XSx", ",0{u", ";I1D!iEqi:$Q&}Y~^db@dF9DTLN", "C~+i$Msx", "gLJ2`Ba8", "/dBi,SVK.mfLx", "d!{u74n/+mijhJwf\"x", "ddQ^5i(8", ",dp@@JW&Q:&|,U}f|eM_", "*N7,KNf8", "aA(i&", "z@&;uE}8", "Z~S;<", "kdlu^4#8", "cbU%74a8", "^QM_", "pp2ieS$>", "Apm%`Kf8", "|;>vbV~8", "|;BD^J(8", "[e=@?F(8", "=Q?W", "Apru^4(_t", "*QODBDPFK?", "?,A@5iw,wz", ",pn%g22Yt", "`AI2ovVYkmILUJ{", "/dm%,1PDez", "Id1D@JYBtm$Q[.57", "p~W@QB.8", "nNS;^JD,@*", "nNS;^Jox", ",!\"%<", "XI<i!bL/km%s\"M{", "/dW@Vq)zKj&sRF:.4bW", "C~BieSxz%shQ~lR/4bY^6K>", "VWK%YqMP4#.L\"=k~W@KS]4@8", "XI<iD#Q8", "OWH_", "/dE@uFPF}?1RM.mG", "[fo2Oq18", "cbU%749DJma", "vf\"%dH5qL#_;q!(f*A\"]&", "x+_]DOtXS93[ur{", "m3B^EU+Q:9~UP8I~Th^vT@*F}?", "eN*u9Flw=D&sjMDf;A0iN@rz/_&\"+JmGDsnSvQ2YA(L1Al=/w)c;EU>", "m3B^EU+Q:9~UP8I~ThwJT@*F}?", "eN*u9Flw=D&sjMDf;A0iN@rz^D$E}W%zq;OH2`O\"aj9^hJ})Xeq<`B&Fsz3[x", "m3B^EU+Q:9~UP8I~ThJvF4S6t", "eN*u9Flw=D&sjMDf;A0iN@rz/_I2m\"(<GBd4`|gq!L#1Al~&c~:@4Fxx)mb", "m3B^EU+Q:9~UP8I~Th2A`@*F}?", "eN*u9Flw=D&sjMDf;A0iN@rz/_~~H&m/vJMi<lPFpsKXB7?~#fc;EU>", "m3B^EU+Q:9~UP8I~ThcvF4S6t", "eN*u9Flw=D&sjMDf;A0iN@rz/_ou@=a=~fJSvQ_Xtm`:3vp.~N>vG7xx)mb", "m3B^EU+Q:9~UP8I~ThL+Q@*F}?", "eN*u9Flw=D&sjMDf;A0iN@rz/_,2O\"`)PN<HvQ6z~jzbylMkCeS;!@*F}?", "m3B^EU+Q:9~UP8I~ThgvF4S6t", "eN*u9Flw=D&sjMDf;A0iN@rz/_aywny(j%bivQsCkmfL$xz~!fc;EU>", "m3B^EU+Q:9~UP8I~ThjvF4S6t", "eN*u9Flw=D&sjMDf;A0iN@rz/_n2JX>?)e;2koC6,LJK$xz~!fc;EU>", "m3B^EU+Q:9~UP8I~ThL+T@*F}?", "eN*u9Flw=D&s>", ")p{udHJ6dDXvx", "iXg+be<H@?oR>", "$3z@~w){aj{Bx", ">Ia_l@*F}?", "/NF/o)xx", "#f_%", "eN*u9Flw=D&sjMDf;A0iN@rz/_s#OdIfetBi5n|8PmwXgAZd[WE@[!ccsz3[x", "/NGDH.xx", "eN*u9Flw=D&sjMDf;A0iN@rz^DPl_W^,~bD2`|SPCsIsS!(f9(e^fKxx)mb", "m3B^EU+Q:9~UP8I~Th)v`@*F}?", "eN*u9Flw=D&sjMDf;A0iN@rz/_JS]{Sz!~k2vQ7{,L4XKdH.<Wa@]4&Fsz3[x", "/NGDF]xx", "eN*u9Flw=D&sjMDf;A0iN@rz/_lj(=n)+B,2`|&C|(+oF!~&/NP+li\"8", "m3B^EU+Q:9~UP8I~Th)vT@*F}?", "eN*u9Flw=D&sjMDf;A0iN@rz^D)SI83&#L*25nG8$Pf18l!7!fc;EU>", "/NF/>Gxx", "eN*u9Flw8", "2&P+~4W&P", "Re%;Bq1Y8", "#Lp@\"a%F+", "GpA,[X9zt", "9(e^fKB~r", "w)c;EU>", "m3B^EU+Q:9~UP8I~Th+aF4S6t", "z(\"vF.b6C5mR>", "dAz@6Kxx)mb", "m3B^EU+Q:9~UP8I~Th[vF4S6t"], 25));
function getGlobal2() {
  var array = [function () {
    return globalThis;
  }, function () {
    return global;
  }, function () {
    return window;
  }, function () {
    return new Function("return this")();
  }];
  var bestMatch;
  var itemsToSearch;
  var i;
  __p_vU9y_ast(bestMatch = undefined, itemsToSearch = []);
  try {
    __p_vU9y_ast(bestMatch = Object, itemsToSearch.push("".__proto__.constructor.name));
  } catch (e) {}
  a: for (i = 0; i < array.length; i++) {
    try {
      var j;
      bestMatch = array[i]();
      for (j = 0; j < itemsToSearch.length; j++) {
        if (typeof bestMatch[itemsToSearch[j]] === "undefined") {
          continue a;
        }
      }
      return bestMatch;
    } catch (e) {}
  }
  return bestMatch || this;
}
__p_vU9y_ast(GLOBAL = getGlobal2() || {}, TextDecoderRef = GLOBAL.TextDecoder, Uint8ArrayRef = GLOBAL.Uint8Array, BufferRef = GLOBAL.Buffer, __String = GLOBAL.String || String, __Array = GLOBAL.Array || Array, utf8ArrayToStr = function () {
  var charCache = new __Array(128);
  var charFromCodePt;
  var result;
  __p_vU9y_ast(charFromCodePt = __String.fromCodePoint || __String.fromCharCode, result = []);
  return function (array) {
    var codePt;
    var byte1;
    var buffLen;
    var i;
    __p_vU9y_ast(byte1 = undefined, buffLen = array.length, result.length = 0);
    for (i = 0; i < buffLen;) {
      byte1 = array[i++];
      if (byte1 <= 127) {
        codePt = byte1;
      } else if (byte1 <= 223) {
        codePt = (byte1 & 31) << 6 | array[i++] & 63;
      } else if (byte1 <= 239) {
        codePt = (byte1 & 15) << 12 | (array[i++] & 63) << 6 | array[i++] & 63;
      } else if (__String.fromCodePoint) {
        codePt = (byte1 & 7) << 18 | (array[i++] & 63) << 12 | (array[i++] & 63) << 6 | array[i++] & 63;
      } else {
        __p_vU9y_ast(codePt = 63, i += 3);
      }
      result.push(charCache[codePt] ||= charFromCodePt(codePt));
    }
    return result.join("");
  };
}());
function __p_1oWr_bufferToString(buffer) {
  if (typeof TextDecoderRef !== "undefined" && TextDecoderRef) {
    return new TextDecoderRef().decode(new Uint8ArrayRef(buffer));
  } else if (typeof BufferRef !== "undefined" && BufferRef) {
    return BufferRef.from(buffer).toString("utf-8");
  } else {
    return utf8ArrayToStr(buffer);
  }
}
__p_Xysf_globalVar = __p_aFyq_getGlobalVarFn();
try {
  if (typeof unsafeWindow !== "undefined" && unsafeWindow) {
    __p_Xysf_globalVar = unsafeWindow;
  }
} catch (_) {}
function __p_aFyq_getGlobalVarFn() {
  var array;
  var bestMatch;
  var itemsToSearch;
  var i;
  function __p_NweM_STR_3_decode(str) {
    var table = ",#TFcu+fR\"|Uqd@iaAvl%p$*)Q`]~}N0/?{r9LkGjJ>[&Ih._Z(g:<;b=xt^YyB2CH86zS3WO7M5mPs!VDwoKn14eEX";
    var raw;
    var len;
    var ret;
    var b;
    var n;
    var v;
    var i;
    __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
    for (i = 0; i < len; i++) {
      var p = table.indexOf(raw[i]);
      if (p === -1) {
        continue;
      }
      if (v < 0) {
        v = p;
      } else {
        __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
        do {
          __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
        } while (n > 7);
        v = -1;
      }
    }
    if (v > -1) {
      ret.push((b | v << n) & 255);
    }
    return __p_1oWr_bufferToString(ret);
  }
  function __p_NweM_STR_3(index) {
    if (typeof STR_CACHE[index] === "undefined") {
      return STR_CACHE[index] = __p_NweM_STR_3_decode(STR_TABLE[index]);
    }
    return STR_CACHE[index];
  }
  __p_vU9y_ast(array = [function () {
    return globalThis;
  }, function () {
    return global;
  }, function () {
    return window;
  }, function () {
    function __p_JLME_STR_1_decode(str) {
      var table = "(0;63\"@%]`AJ/_m,^I&|*7SoG!f+wq)=[>C}~<x.Y:{D?Q9HryKvLejMgsilbaNW#18UnBRkPpdhZEcTF245tOVuXz$";
      var raw;
      var len;
      var ret;
      var b;
      var n;
      var v;
      var i;
      __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
      for (i = 0; i < len; i++) {
        var p = table.indexOf(raw[i]);
        if (p === -1) {
          continue;
        }
        if (v < 0) {
          v = p;
        } else {
          __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
          do {
            __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
          } while (n > 7);
          v = -1;
        }
      }
      if (v > -1) {
        ret.push((b | v << n) & 255);
      }
      return __p_1oWr_bufferToString(ret);
    }
    function __p_JLME_STR_1(index) {
      if (typeof STR_CACHE[index] === "undefined") {
        return STR_CACHE[index] = __p_JLME_STR_1_decode(STR_TABLE[index]);
      }
      return STR_CACHE[index];
    }
    return new Function("return this")();
  }], bestMatch = undefined, itemsToSearch = []);
  try {
    function __p_qY2z_STR_2_decode(str) {
      var table = "O;A>%x^/i89~u)dJ@=Kc{\"lD7pS,5Y*&.|(`Fvh$+#bIN}_RC?:Ho<m4[Q]V2gWaszrGL!E0nUtXTefjyqPZ36k1MBw";
      var raw;
      var len;
      var ret;
      var b;
      var n;
      var v;
      var i;
      __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
      for (i = 0; i < len; i++) {
        var p = table.indexOf(raw[i]);
        if (p === -1) {
          continue;
        }
        if (v < 0) {
          v = p;
        } else {
          __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
          do {
            __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
          } while (n > 7);
          v = -1;
        }
      }
      if (v > -1) {
        ret.push((b | v << n) & 255);
      }
      return __p_1oWr_bufferToString(ret);
    }
    function __p_qY2z_STR_2(index) {
      if (typeof STR_CACHE[index] === "undefined") {
        return STR_CACHE[index] = __p_qY2z_STR_2_decode(STR_TABLE[index]);
      }
      return STR_CACHE[index];
    }
    __p_vU9y_ast(bestMatch = Object, itemsToSearch.push("".__proto__.constructor.name));
  } catch (e) {}
  b: for (i = 0; i < array.length; i++) {
    try {
      var j;
      bestMatch = array[i]();
      for (j = 0; j < itemsToSearch.length; j++) {
        function __p_lI0e_STR_4_decode(str) {
          var table = "[U.~+rKAE:}u`]GpF(L;6/{s^B7iq_@=|?*)><Na\"VXIt,Shzly#xH4mdZwfP3QJ9n50beRcoYkvMWj!TCD82Og1$%&";
          var raw;
          var len;
          var ret;
          var b;
          var n;
          var v;
          var i;
          __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
          for (i = 0; i < len; i++) {
            var p = table.indexOf(raw[i]);
            if (p === -1) {
              continue;
            }
            if (v < 0) {
              v = p;
            } else {
              __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
              do {
                __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
              } while (n > 7);
              v = -1;
            }
          }
          if (v > -1) {
            ret.push((b | v << n) & 255);
          }
          return __p_1oWr_bufferToString(ret);
        }
        function __p_lI0e_STR_4(index) {
          if (typeof STR_CACHE[index] === "undefined") {
            return STR_CACHE[index] = __p_lI0e_STR_4_decode(STR_TABLE[index]);
          }
          return STR_CACHE[index];
        }
        if (typeof bestMatch[itemsToSearch[j]] === "undefined") {
          continue b;
        }
      }
      return bestMatch;
    } catch (e) {}
  }
  return bestMatch || this;
}
function getGlobal(mapping) {
  function __p_odXl_STR_5_decode(str) {
    var table = "<.*/&3:s`$DP%Y+{k~,@?[}RK^(vEb)|I>];=_C\"lOUwn9mFy1grZNo8puxhA2GLV7QjWeMS456id#fBJa0zc!TqHXt";
    var raw;
    var len;
    var ret;
    var b;
    var n;
    var v;
    var i;
    __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
    for (i = 0; i < len; i++) {
      var p = table.indexOf(raw[i]);
      if (p === -1) {
        continue;
      }
      if (v < 0) {
        v = p;
      } else {
        __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
        do {
          __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
        } while (n > 7);
        v = -1;
      }
    }
    if (v > -1) {
      ret.push((b | v << n) & 255);
    }
    return __p_1oWr_bufferToString(ret);
  }
  function __p_odXl_STR_5(index) {
    if (typeof STR_CACHE[index] === "undefined") {
      return STR_CACHE[index] = __p_odXl_STR_5_decode(STR_TABLE[index]);
    }
    return STR_CACHE[index];
  }
  switch (mapping) {
    case "xyfhFZi":
      return __p_Xysf_globalVar.console;
    case "h4Y5OWz":
      return __p_Xysf_globalVar.ZytbIX;
    case "XawFnk":
      return __p_Xysf_globalVar.kZzT80;
    case "yEZose":
      return __p_Xysf_globalVar.ODSFGux;
    case "cJ0jbDL":
      return __p_Xysf_globalVar.HTMLScriptElement;
    case "wESjdP":
      return __p_Xysf_globalVar.ONqqcYN;
    case "__pdLQV":
      return __p_Xysf_globalVar.Array;
    case "rTNkFgA":
      return __p_Xysf_globalVar._wffA8b;
    case "hs1bQMt":
      return __p_Xysf_globalVar.m_CFMV;
    case "P057MO":
      return __p_Xysf_globalVar.parseFloat;
    case "BAYXIG":
      return __p_Xysf_globalVar.aaMUjEY;
    case "YDOeaO":
      return __p_Xysf_globalVar.BrGu9It;
    case "wjcgAAi":
      return __p_Xysf_globalVar.npcNk5W;
    case "88Y9uI":
      return __p_Xysf_globalVar.txWPNFD;
    case "YfRrq0":
      return __p_Xysf_globalVar.Object;
    case "GLKrGUL":
      return __p_Xysf_globalVar.YqB3a72;
    case "4JcaFh9":
      return __p_Xysf_globalVar.XbOqVHg;
    case "01kHbf":
      return __p_Xysf_globalVar.ovIEuD6;
    case "IYcb3a":
      return __p_Xysf_globalVar.RangeError;
    case "PWN0Ar":
      return __p_Xysf_globalVar.HTMLElement;
    case "RV_vc_s":
      return __p_Xysf_globalVar.buildCharMap;
    case "PvTAsr":
      return __p_Xysf_globalVar.Uint8Array;
    case "s1Rw6G":
      return __p_Xysf_globalVar.Symbol;
    case "XSPLIu":
      return __p_Xysf_globalVar.MmBVo7;
    case "Si3ZVR":
      return __p_Xysf_globalVar.JSON;
    case "yaVoVt":
      return __p_Xysf_globalVar.window;
    case "XTNMRo":
      return __p_Xysf_globalVar.Proxy;
    case "hmUPOQ":
      return __p_Xysf_globalVar.Date;
    case "b4XTua":
      return __p_Xysf_globalVar.Image;
    case "bT9Ty9":
      return __p_Xysf_globalVar.navigator;
    case "q5RfA7D":
      return __p_Xysf_globalVar.document;
    case "pxsHd3":
      return __p_Xysf_globalVar.Map;
    case "DoF4eQ":
      return __p_Xysf_globalVar.isAttached;
    case "UM9gcT":
      return __p_Xysf_globalVar.URL;
    case "tSAIqe":
      return __p_Xysf_globalVar.Promise;
    case "VELlo0U":
      return __p_Xysf_globalVar.esBzIO;
    case "itA7LX":
      return __p_Xysf_globalVar.HTMLDivElement;
    case "wYmCgI":
      return __p_Xysf_globalVar.process;
    case "0oZvHc9":
      return __p_Xysf_globalVar.baNqlw;
    case "p1QiFV9":
      return __p_Xysf_globalVar.location;
    case "ix4Bs1":
      return __p_Xysf_globalVar.performance;
    case "wgorjqz":
      return __p_Xysf_globalVar.RegExp;
    case "w7TZUT6":
      return __p_Xysf_globalVar.clearTimeout;
    case "lqoneWv":
      return __p_Xysf_globalVar.setTimeout;
    case "qFxzi8":
      return __p_Xysf_globalVar.HTMLLinkElement;
    case "GUpot3":
      return __p_Xysf_globalVar.MutationObserver;
    case "P0LvmGu":
      return __p_Xysf_globalVar.HTMLCanvasElement;
    case "GBpEOug":
      return __p_Xysf_globalVar.WebSocket;
    case "Tr6E0H":
      return __p_Xysf_globalVar.ErrorBoundary;
    case "oLtdgEx":
      return __p_Xysf_globalVar.Worker;
    case "orcc5G":
      return __p_Xysf_globalVar.atob;
    case "jbXGR1":
      return __p_Xysf_globalVar.Blob;
    case "iiQ5Q7h":
      return __p_Xysf_globalVar.q71YhZc;
    case "T3LGfE":
      return __p_Xysf_globalVar.fetch;
    case "PgS476b":
      return __p_Xysf_globalVar.DisplayName;
    case "TvR8Kwf":
      return __p_Xysf_globalVar.XMLHttpRequest;
    case "EjdYry":
      return __p_Xysf_globalVar.Error;
    case "nWcGrEQ":
      return __p_Xysf_globalVar.HTMLTextAreaElement;
    case "P4jKmO":
      return __p_Xysf_globalVar.Math;
    case "OyEgsuV":
      return __p_Xysf_globalVar.String;
    case "BkKHuLi":
      return __p_Xysf_globalVar.isNaN;
    case "VCtCnrB":
      return __p_Xysf_globalVar.getStyles;
    case "Ws7C0f":
      return __p_Xysf_globalVar.Event;
    case "m9khFkT":
      return __p_Xysf_globalVar.Qo6AvS;
    case "HSF7dU":
      return __p_Xysf_globalVar.Number;
    case "tB9AKx":
      return __p_Xysf_globalVar.Set;
    case "PdXpH3A":
      return __p_Xysf_globalVar.btoa;
    case "NuMkXMP":
      return __p_Xysf_globalVar.qa5s6s;
    case "u71ZfHL":
      return __p_Xysf_globalVar.GEPLVx;
    case "sVv2Mln":
      return __p_Xysf_globalVar.Function;
    case "L7PIxh":
      return __p_Xysf_globalVar.HTMLInputElement;
    case "i8lsV5":
      return __p_Xysf_globalVar.setInterval;
    case "lAgOdPP":
      return __p_Xysf_globalVar.redacted;
    case "YUqldm":
      return __p_Xysf_globalVar.alCwuf;
  }
}
function __p_ZIaZ_calc(operator, a, b) {
  switch (operator) {
    case "a":
      return a + b;
    case "b":
      return a / b;
  }
}
function __p_DklD_dummyFunction() {}
function __p_3zEF_d_fnLength(fn, length = 1) {
  function __p_e5ky_STR_19_decode(str) {
    var table = "m%S.;/c:|~}&uo#E0$?^=,@+p]OT*X><A`)_[(L{wM3\"BstnRYIJD7e4Q85KxdfZNgVi1CW2FHaU6blPvz!jGqry9kh";
    var raw;
    var len;
    var ret;
    var b;
    var n;
    var v;
    var i;
    __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
    for (i = 0; i < len; i++) {
      var p = table.indexOf(raw[i]);
      if (p === -1) {
        continue;
      }
      if (v < 0) {
        v = p;
      } else {
        __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
        do {
          __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
        } while (n > 7);
        v = -1;
      }
    }
    if (v > -1) {
      ret.push((b | v << n) & 255);
    }
    return __p_1oWr_bufferToString(ret);
  }
  function __p_e5ky_STR_19(index) {
    if (typeof STR_CACHE[index] === "undefined") {
      return STR_CACHE[index] = __p_e5ky_STR_19_decode(STR_TABLE[index]);
    }
    return STR_CACHE[index];
  }
  if ("nooh8fE" in __p_DklD_dummyFunction) {
    __p_bTf1_dead_1();
  }
  function __p_bTf1_dead_1() {
    var sha256 = function () {
      var hexcase;
      var b64pad;
      var sha256_K;
      function __p_c01J_STR_17_decode(str) {
        var table = "?A0:NB#gV.^@L;+~]4fDa\"<ornw_yQ`T,=C{eIbO/v}6>U2|HZ[E9MPS3dtW1qz!i7Fmpu5GKckRhsYJ8xXjl$%&()*";
        var raw;
        var len;
        var ret;
        var b;
        var n;
        var v;
        var i;
        __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
        for (i = 0; i < len; i++) {
          var p = table.indexOf(raw[i]);
          if (p === -1) {
            continue;
          }
          if (v < 0) {
            v = p;
          } else {
            __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
            do {
              __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
            } while (n > 7);
            v = -1;
          }
        }
        if (v > -1) {
          ret.push((b | v << n) & 255);
        }
        return __p_1oWr_bufferToString(ret);
      }
      function __p_c01J_STR_17(index) {
        if (typeof STR_CACHE[index] === "undefined") {
          return STR_CACHE[index] = __p_c01J_STR_17_decode(STR_TABLE[index]);
        }
        return STR_CACHE[index];
      }
      __p_vU9y_ast(hexcase = 0, b64pad = "");
      function hex_sha256(s) {
        return rstr2hex(rstr_sha256(str2rstr_utf8(s)));
      }
      function b64_sha256(s) {
        return rstr2b64(rstr_sha256(str2rstr_utf8(s)));
      }
      function any_sha256(s, e) {
        return rstr2any(rstr_sha256(str2rstr_utf8(s)), e);
      }
      function hex_hmac_sha256(k, d) {
        return rstr2hex(rstr_hmac_sha256(str2rstr_utf8(k), str2rstr_utf8(d)));
      }
      function b64_hmac_sha256(k, d) {
        return rstr2b64(rstr_hmac_sha256(str2rstr_utf8(k), str2rstr_utf8(d)));
      }
      function any_hmac_sha256(k, d, e) {
        return rstr2any(rstr_hmac_sha256(str2rstr_utf8(k), str2rstr_utf8(d)), e);
      }
      function sha256_vm_test() {
        function __p_xoCG_STR_6_decode(str) {
          var table = ";?<y$OE9To.7%\"Aw:`lhI#HJm@~0d)FD=[V]^!(,erZ4+&/_b>|*B}u{qpvRC2U3LKGngPkjQiYM8aSz6s5x1fNctXW";
          var raw;
          var len;
          var ret;
          var b;
          var n;
          var v;
          var i;
          __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
          for (i = 0; i < len; i++) {
            var p = table.indexOf(raw[i]);
            if (p === -1) {
              continue;
            }
            if (v < 0) {
              v = p;
            } else {
              __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
              do {
                __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
              } while (n > 7);
              v = -1;
            }
          }
          if (v > -1) {
            ret.push((b | v << n) & 255);
          }
          return __p_1oWr_bufferToString(ret);
        }
        function __p_xoCG_STR_6(index) {
          if (typeof STR_CACHE[index] === "undefined") {
            return STR_CACHE[index] = __p_xoCG_STR_6_decode(STR_TABLE[index]);
          }
          return STR_CACHE[index];
        }
        return hex_sha256("abc").toLowerCase() == "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad";
      }
      function rstr_sha256(s) {
        return binb2rstr(binb_sha256(rstr2binb(s), s.length * 8));
      }
      function rstr_hmac_sha256(key, data) {
        var bkey = rstr2binb(key);
        var i;
        var hash;
        if (bkey.length > 16) {
          bkey = binb_sha256(bkey, key.length * 8);
        }
        var ipad = getGlobal("__pdLQV")(16);
        var opad = getGlobal("__pdLQV")(16);
        for (i = 0; i < 16; i++) {
          __p_vU9y_ast(ipad[i] = bkey[i] ^ 909522486, opad[i] = bkey[i] ^ 1549556828);
        }
        hash = binb_sha256(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
        return binb2rstr(binb_sha256(opad.concat(hash), __p_ZIaZ_calc("a", 512, 256)));
      }
      function rstr2hex(input) {
        var hex_tab;
        var output;
        var x;
        var i;
        function __p_MkZE_STR_7_decode(str) {
          var table = "VfZ&A[/\"*B7Xy|ar~^,l+8{:?DS>g.J;}j_2b)m<(C`]!=@uWUo041MYHOTEReI9LG#Qqv6PhKpt3ickd5nzwFNxs$%";
          var raw;
          var len;
          var ret;
          var b;
          var n;
          var v;
          var i;
          __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
          for (i = 0; i < len; i++) {
            var p = table.indexOf(raw[i]);
            if (p === -1) {
              continue;
            }
            if (v < 0) {
              v = p;
            } else {
              __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
              do {
                __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
              } while (n > 7);
              v = -1;
            }
          }
          if (v > -1) {
            ret.push((b | v << n) & 255);
          }
          return __p_1oWr_bufferToString(ret);
        }
        function __p_MkZE_STR_7(index) {
          if (typeof STR_CACHE[index] === "undefined") {
            return STR_CACHE[index] = __p_MkZE_STR_7_decode(STR_TABLE[index]);
          }
          return STR_CACHE[index];
        }
        try {
          hexcase;
        } catch (e) {
          hexcase = 0;
        }
        __p_vU9y_ast(hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef", output = "", x = undefined);
        for (i = 0; i < input.length; i++) {
          __p_vU9y_ast(x = input.charCodeAt(i), output += hex_tab.charAt(x >>> 4 & 15) + hex_tab.charAt(x & 15));
        }
        return output;
      }
      function rstr2b64(input) {
        var tab;
        var output;
        var len;
        var i;
        function __p_BvqO_STR_8_decode(str) {
          var table = "D$Bfg!(YX9/q:%@5E?0xyVv|r`[4p<)MQ,*A_}G=^.2\"8Z~e&]>{d+Tub;zsjSclN#tU7nRoPaLiCmFhJWKwH31Ik6O";
          var raw;
          var len;
          var ret;
          var b;
          var n;
          var v;
          var i;
          __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
          for (i = 0; i < len; i++) {
            var p = table.indexOf(raw[i]);
            if (p === -1) {
              continue;
            }
            if (v < 0) {
              v = p;
            } else {
              __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
              do {
                __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
              } while (n > 7);
              v = -1;
            }
          }
          if (v > -1) {
            ret.push((b | v << n) & 255);
          }
          return __p_1oWr_bufferToString(ret);
        }
        function __p_BvqO_STR_8(index) {
          if (typeof STR_CACHE[index] === "undefined") {
            return STR_CACHE[index] = __p_BvqO_STR_8_decode(STR_TABLE[index]);
          }
          return STR_CACHE[index];
        }
        try {
          b64pad;
        } catch (e) {
          b64pad = "";
        }
        __p_vU9y_ast(tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", output = "", len = input.length);
        for (i = 0; i < len; i += 3) {
          var triplet = input.charCodeAt(i) << 16 | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
          var j;
          for (j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > input.length * 8) {
              output += b64pad;
            } else {
              output += tab.charAt(triplet >>> (3 - j) * 6 & 63);
            }
          }
        }
        return output;
      }
      function rstr2any(input, encoding) {
        var divisor;
        var remainders;
        var dividend;
        var output;
        var full_length;
        function __p_ZOOW_STR_9_decode(str) {
          var table = "3NE|w$0*J:I2(G,}@M=.)Pj_ubv&%Qsda+/Wt4c;?<]6\"7o~{B^qF>`z8[AZOTxf5UDgnp9eKLYCSRHl1h!krm#iXyV";
          var raw;
          var len;
          var ret;
          var b;
          var n;
          var v;
          var i;
          __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
          for (i = 0; i < len; i++) {
            var p = table.indexOf(raw[i]);
            if (p === -1) {
              continue;
            }
            if (v < 0) {
              v = p;
            } else {
              __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
              do {
                __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
              } while (n > 7);
              v = -1;
            }
          }
          if (v > -1) {
            ret.push((b | v << n) & 255);
          }
          return __p_1oWr_bufferToString(ret);
        }
        function __p_ZOOW_STR_9(index) {
          if (typeof STR_CACHE[index] === "undefined") {
            return STR_CACHE[index] = __p_ZOOW_STR_9_decode(STR_TABLE[index]);
          }
          return STR_CACHE[index];
        }
        __p_vU9y_ast(divisor = encoding.length, remainders = getGlobal("__pdLQV")());
        var i;
        var q;
        var x;
        var quotient;
        dividend = getGlobal("__pdLQV")(getGlobal("P4jKmO").ceil(input.length / 2));
        for (i = 0; i < dividend.length; i++) {
          dividend[i] = input.charCodeAt(i * 2) << 8 | input.charCodeAt(i * 2 + 1);
        }
        while (dividend.length > 0) {
          function __p_CIwk_STR_10_decode(str) {
            var table = ",&0@`b<xA1?/[}*yqlB\"h_W:](E)Gt7!5~LHS>.+Xmp|;%J{n=FO9^Qr4sdDeuig8CwIfZRzV3jkvKcMUTaPo26N#Y$";
            var raw;
            var len;
            var ret;
            var b;
            var n;
            var v;
            var i;
            __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
            for (i = 0; i < len; i++) {
              var p = table.indexOf(raw[i]);
              if (p === -1) {
                continue;
              }
              if (v < 0) {
                v = p;
              } else {
                __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
                do {
                  __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
                } while (n > 7);
                v = -1;
              }
            }
            if (v > -1) {
              ret.push((b | v << n) & 255);
            }
            return __p_1oWr_bufferToString(ret);
          }
          function __p_CIwk_STR_10(index) {
            if (typeof STR_CACHE[index] === "undefined") {
              return STR_CACHE[index] = __p_CIwk_STR_10_decode(STR_TABLE[index]);
            }
            return STR_CACHE[index];
          }
          __p_vU9y_ast(quotient = getGlobal("__pdLQV")(), x = 0);
          for (i = 0; i < dividend.length; i++) {
            function __p_zRLL_STR_11_decode(str) {
              var table = ":>1AG7\",ou]4PK_n?ME<Y.!q}^{~d;D9zS/@Z5`x[Ig3|=#lXvQpyCcFkO6Tsm2HaBLNt0UVRJWfweirhjb8$%&()*+";
              var raw;
              var len;
              var ret;
              var b;
              var n;
              var v;
              var i;
              __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
              for (i = 0; i < len; i++) {
                var p = table.indexOf(raw[i]);
                if (p === -1) {
                  continue;
                }
                if (v < 0) {
                  v = p;
                } else {
                  __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
                  do {
                    __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
                  } while (n > 7);
                  v = -1;
                }
              }
              if (v > -1) {
                ret.push((b | v << n) & 255);
              }
              return __p_1oWr_bufferToString(ret);
            }
            function __p_zRLL_STR_11(index) {
              if (typeof STR_CACHE[index] === "undefined") {
                return STR_CACHE[index] = __p_zRLL_STR_11_decode(STR_TABLE[index]);
              }
              return STR_CACHE[index];
            }
            __p_vU9y_ast(x = (x << 16) + dividend[i], q = getGlobal("P4jKmO").floor(x / divisor), x -= q * divisor);
            if (quotient.length > 0 || q > 0) {
              quotient[quotient.length] = q;
            }
          }
          __p_vU9y_ast(remainders[remainders.length] = x, dividend = quotient);
        }
        output = "";
        for (i = remainders.length - 1; i >= 0; i--) {
          output += encoding.charAt(remainders[i]);
        }
        full_length = getGlobal("P4jKmO").ceil(input.length * 8 / (getGlobal("P4jKmO").log(encoding.length) / getGlobal("P4jKmO").log(2)));
        for (i = output.length; i < full_length; i++) {
          output = encoding[0] + output;
        }
        return output;
      }
      function str2rstr_utf8(input) {
        var output = "";
        var i;
        i = -1;
        var x;
        var y;
        while (++i < input.length) {
          function __p_GJLs_STR_12_decode(str) {
            var table = ",g(#BWm|z%n^_XCMc$DY)`.w>@p;NU+~2V]s{HKeo/}:?T[<b*=EJ&Ia\"PuyAd7hFjZ630q5t1xl9Q8rSGOfkLiR!v4";
            var raw;
            var len;
            var ret;
            var b;
            var n;
            var v;
            var i;
            __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
            for (i = 0; i < len; i++) {
              var p = table.indexOf(raw[i]);
              if (p === -1) {
                continue;
              }
              if (v < 0) {
                v = p;
              } else {
                __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
                do {
                  __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
                } while (n > 7);
                v = -1;
              }
            }
            if (v > -1) {
              ret.push((b | v << n) & 255);
            }
            return __p_1oWr_bufferToString(ret);
          }
          function __p_GJLs_STR_12(index) {
            if (typeof STR_CACHE[index] === "undefined") {
              return STR_CACHE[index] = __p_GJLs_STR_12_decode(STR_TABLE[index]);
            }
            return STR_CACHE[index];
          }
          __p_vU9y_ast(x = input.charCodeAt(i), y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0);
          if (x >= 55296 && x <= 56319 && y >= 56320 && y <= 57343) {
            __p_vU9y_ast(x = 65536 + ((x & 1023) << 10) + (y & 1023), i++);
          }
          if (x <= 127) {
            output += getGlobal("OyEgsuV").fromCharCode(x);
          } else if (x <= 2047) {
            output += getGlobal("OyEgsuV").fromCharCode(x >>> 6 & 31 | 192, x & 63 | 128);
          } else if (x <= 65535) {
            output += getGlobal("OyEgsuV").fromCharCode(x >>> 12 & 15 | 224, x >>> 6 & 63 | 128, x & 63 | 128);
          } else if (x <= 2097151) {
            output += getGlobal("OyEgsuV").fromCharCode(x >>> 18 & 7 | 240, x >>> 12 & 63 | 128, x >>> 6 & 63 | 128, x & 63 | 128);
          } // eGeVaS
        }
        return output;
      }
      function str2rstr_utf16le(input) {
        var output;
        var i;
        function __p_DJA4_STR_13_decode(str) {
          var table = "%,#;oS&Z~1g?7T_XJq[]\">39/@j<ye^k{}6+bf=DQzpN(Pl`4)|v.:*CAYhVc!wFdtBHiMInUELG8RrmW52xasuKO0$";
          var raw;
          var len;
          var ret;
          var b;
          var n;
          var v;
          var i;
          __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
          for (i = 0; i < len; i++) { // eGeVaS
            var p = table.indexOf(raw[i]);
            if (p === -1) {
              continue;
            }
            if (v < 0) {
              v = p;
            } else {
              __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
              do {
                __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
              } while (n > 7);
              v = -1;
            }
          }
          if (v > -1) {
            ret.push((b | v << n) & 255);
          }
          return __p_1oWr_bufferToString(ret);
        }
        function __p_DJA4_STR_13(index) {
          if (typeof STR_CACHE[index] === "undefined") {
            return STR_CACHE[index] = __p_DJA4_STR_13_decode(STR_TABLE[index]);
          }
          return STR_CACHE[index];
        }
        output = "";
        for (i = 0; i < input.length; i++) {
          output += getGlobal("OyEgsuV").fromCharCode(input.charCodeAt(i) & 255, input.charCodeAt(i) >>> 8 & 255);
        }
        return output;
      }
      function str2rstr_utf16be(input) {
        var output;
        var i;
        function __p_roL3_STR_14_decode(str) {
          var table = "sW%*F/?:![.&mH<@nyg+]3,`Q$x)=u^;whLUp1T~_8{2>\"(|}G0SoelCPqEkbftOajv4dZ79M#XViKYrADcRNJ5zBI6";
          var raw;
          var len;
          var ret;
          var b;
          var n;
          var v;
          var i;
          __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
          for (i = 0; i < len; i++) {
            var p = table.indexOf(raw[i]);
            if (p === -1) {
              continue;
            }
            if (v < 0) {
              v = p;
            } else {
              __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
              do {
                __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
              } while (n > 7);
              v = -1;
            }
          }
          if (v > -1) {
            ret.push((b | v << n) & 255);
          }
          return __p_1oWr_bufferToString(ret);
        }
        function __p_roL3_STR_14(index) {
          if (typeof STR_CACHE[index] === "undefined") {
            return STR_CACHE[index] = __p_roL3_STR_14_decode(STR_TABLE[index]);
          }
          return STR_CACHE[index];
        }
        output = "";
        for (i = 0; i < input.length; i++) {
          output += getGlobal("OyEgsuV").fromCharCode(input.charCodeAt(i) >>> 8 & 255, input.charCodeAt(i) & 255);
        }
        return output;
      }
      function rstr2binb(input) {
        var output;
        var i;
        function __p_XyaI_STR_15_decode(str) {
          var table = "!*wf{?[Q#/Ag}^+=O>uR.T:L],<`6_M|FJZ1EI@Di\"q;t~5zKbs2lB84m0YxW3CUGojaPSpHcvV9yXknNrhed7$%&()";
          var raw;
          var len;
          var ret;
          var b;
          var n;
          var v;
          var i; // eGeVaS
          __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1); // eGeVaS
          for (i = 0; i < len; i++) { // eGeVaS
            var p = table.indexOf(raw[i]); // eGeVaS
            if (p === -1) { // eGeVaS
              continue; // eGeVaS
            } // eGeVaS
            if (v < 0) { // eGeVaS
              v = p;
            } else {
              __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
              do {
                __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
              } while (n > 7);
              v = -1;
            }
          }
          if (v > -1) {
            ret.push((b | v << n) & 255);
          }
          return __p_1oWr_bufferToString(ret);
        }
        function __p_XyaI_STR_15(index) {
          if (typeof STR_CACHE[index] === "undefined") {
            return STR_CACHE[index] = __p_XyaI_STR_15_decode(STR_TABLE[index]);
          }
          return STR_CACHE[index];
        }
        output = getGlobal("__pdLQV")(input.length >> 2);
        for (i = 0; i < output.length; i++) {
          output[i] = 0;
        }
        for (i = 0; i < input.length * 8; i += 8) {
          output[i >> 5] |= (input.charCodeAt(i / 8) & 255) << 24 - i % 32;
        }
        return output;
      }
      function binb2rstr(input) {
        var output;
        var i;
        function __p_ep28_STR_16_decode(str) {
          var table = "2^?9yc<1%iAJf!(wU\">_h&`/}[:.zI)Vq|MKp*+ZWX4]tG{,=OesEQ;7~YSr@DmH6LxdbuPavoR0njlNC8Fk5TBg3#$";
          var raw;
          var len;
          var ret;
          var b;
          var n;
          var v;
          var i;
          __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
          for (i = 0; i < len; i++) {
            var p = table.indexOf(raw[i]);
            if (p === -1) {
              continue;
            }
            if (v < 0) {
              v = p;
            } else {
              __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
              do {
                __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
              } while (n > 7);
              v = -1;
            }
          }
          if (v > -1) {
            ret.push((b | v << n) & 255);
          }
          return __p_1oWr_bufferToString(ret);
        }
        function __p_ep28_STR_16(index) {
          if (typeof STR_CACHE[index] === "undefined") {
            return STR_CACHE[index] = __p_ep28_STR_16_decode(STR_TABLE[index]);
          }
          return STR_CACHE[index];
        }
        output = "";
        for (i = 0; i < input.length * 32; i += 8) {
          output += getGlobal("OyEgsuV").fromCharCode(input[i >> 5] >>> 24 - i % 32 & 255);
        }
        return output;
      }
      function sha256_S(X, n) {
        return X >>> n | X << 32 - n;
      }
      function sha256_R(X, n) {
        return X >>> n;
      }
      function sha256_Ch(x, y, z) {
        return x & y ^ ~x & z;
      }
      function sha256_Maj(x, y, z) {
        return x & y ^ x & z ^ y & z;
      }
      function sha256_Sigma0256(x) {
        return sha256_S(x, 2) ^ sha256_S(x, 13) ^ sha256_S(x, 22);
      }
      function sha256_Sigma1256(x) {
        return sha256_S(x, 6) ^ sha256_S(x, 11) ^ sha256_S(x, 25);
      }
      function sha256_Gamma0256(x) {
        return sha256_S(x, 7) ^ sha256_S(x, 18) ^ sha256_R(x, 3);
      }
      function sha256_Gamma1256(x) {
        return sha256_S(x, 17) ^ sha256_S(x, 19) ^ sha256_R(x, 10);
      }
      function sha256_Sigma0512(x) {
        return sha256_S(x, 28) ^ sha256_S(x, 34) ^ sha256_S(x, 39);
      }
      function sha256_Sigma1512(x) {
        return sha256_S(x, 14) ^ sha256_S(x, 18) ^ sha256_S(x, 41);
      }
      function sha256_Gamma0512(x) {
        return sha256_S(x, 1) ^ sha256_S(x, 8) ^ sha256_R(x, 7);
      }
      function sha256_Gamma1512(x) {
        return sha256_S(x, 19) ^ sha256_S(x, 61) ^ sha256_R(x, 6);
      }
      sha256_K = new (getGlobal("__pdLQV"))(1116352408, 1899447441, -1245643825, -373957723, 961987163, 1508970993, -1841331548, -1424204075, -670586216, 310598401, 607225278, 1426881987, 1925078388, -2132889090, -1680079193, -1046744716, -459576895, -272742522, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, -1740746414, -1473132947, -1341970488, -1084653625, -958395405, -710438585, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, -2117940946, -1838011259, -1564481375, -1474664885, -1035236496, -949202525, -778901479, -694614492, -200395387, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, -2067236844, -1933114872, -1866530822, -1538233109, -1090935817, -965641998);
      function binb_sha256(m, l) {
        var HASH;
        var W;
        function __p_8vXG_STR_18_decode(str) {
          var table = ";3/Dz)18*McSRC7^`}XZ:v>{k+[I%|(6],_YPiAgj=?T24<~eL@w&.h\"VtoFE5GOarlmHuByqNK#9Ud0fpQJbWn!xs$";
          var raw;
          var len;
          var ret;
          var b;
          var n;
          var v;
          var i;
          __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
          for (i = 0; i < len; i++) {
            var p = table.indexOf(raw[i]);
            if (p === -1) {
              continue;
            }
            if (v < 0) {
              v = p;
            } else {
              __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
              do {
                __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
              } while (n > 7);
              v = -1;
            }
          }
          if (v > -1) {
            ret.push((b | v << n) & 255);
          }
          return __p_1oWr_bufferToString(ret);
        }
        function __p_8vXG_STR_18(index) {
          if (typeof STR_CACHE[index] === "undefined") {
            return STR_CACHE[index] = __p_8vXG_STR_18_decode(STR_TABLE[index]);
          }
          return STR_CACHE[index];
        }
        __p_vU9y_ast(HASH = new (getGlobal("__pdLQV"))(1779033703, -1150833019, 1013904242, -1521486534, 1359893119, -1694144372, 528734635, 1541459225), W = new (getGlobal("__pdLQV"))(64));
        var a;
        var b;
        var c;
        var d;
        var e;
        var f;
        var g;
        var h;
        var i;
        var j;
        var T1;
        var T2;
        __p_vU9y_ast(m[l >> 5] |= 128 << 24 - l % 32, m[(l + 64 >> 9 << 4) + 15] = l);
        for (i = 0; i < m.length; i += 16) {
          __p_vU9y_ast(a = HASH[0], b = HASH[1], c = HASH[2], d = HASH[3], e = HASH[4], f = HASH[5], g = HASH[6], h = HASH[7]);
          for (j = 0; j < 64; j++) {
            if (j < 16) {
              W[j] = m[j + i];
            } else {
              W[j] = safe_add(safe_add(safe_add(sha256_Gamma1256(W[j - 2]), W[j - 7]), sha256_Gamma0256(W[j - 15])), W[j - 16]);
            }
            __p_vU9y_ast(T1 = safe_add(safe_add(safe_add(safe_add(h, sha256_Sigma1256(e)), sha256_Ch(e, f, g)), sha256_K[j]), W[j]), T2 = safe_add(sha256_Sigma0256(a), sha256_Maj(a, b, c)), h = g, g = f, f = e, e = safe_add(d, T1), d = c, c = b, b = a, a = safe_add(T1, T2));
          }
          __p_vU9y_ast(HASH[0] = safe_add(a, HASH[0]), HASH[1] = safe_add(b, HASH[1]), HASH[2] = safe_add(c, HASH[2]), HASH[3] = safe_add(d, HASH[3]), HASH[4] = safe_add(e, HASH[4]), HASH[5] = safe_add(f, HASH[5]), HASH[6] = safe_add(g, HASH[6]), HASH[7] = safe_add(h, HASH[7]));
        }
        return HASH;
      }
      function safe_add(x, y) {
        var lsw = (x & 65535) + (y & 65535);
        var msw;
        msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return msw << 16 | lsw & 65535;
      }
      return {
        hex: hex_sha256,
        b64: b64_hmac_sha256,
        any: any_hmac_sha256,
        hex_hmac: hex_hmac_sha256,
        b64_hmac: b64_hmac_sha256,
        any_hmac: any_hmac_sha256
      };
    }();
    getGlobal("xyfhFZi").log(sha256);
  }
  getGlobal("YfRrq0").defineProperty(fn, "length", {
    value: length,
    configurable: false
  });
  return fn;
}
function __p_vU9y_ast() {
  __p_vU9y_ast = function () {};
}
(function (t, n) {
  function __p_Jjhp_STR_37_decode(str) {
    var table = ">x8W+rtP_%u:0{yd}9?z(*kI\"&A=<,/^@]~7Ge.)f63pT`Qonvab1D;[#N|5!lLjmsREBqXJUSHC2i4cKFVMOwYghZ$";
    var raw;
    var len;
    var ret;
    var b;
    var n;
    var v;
    var i;
    __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
    for (i = 0; i < len; i++) {
      var p = table.indexOf(raw[i]);
      if (p === -1) {
        continue;
      }
      if (v < 0) {
        v = p;
      } else {
        __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
        do {
          __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
        } while (n > 7);
        v = -1;
      }
    }
    if (v > -1) {
      ret.push((b | v << n) & 255);
    }
    return __p_1oWr_bufferToString(ret);
  }
  function __p_Jjhp_STR_37(index) {
    if (typeof STR_CACHE[index] === "undefined") {
      return STR_CACHE[index] = __p_Jjhp_STR_37_decode(STR_TABLE[index]);
    }
    return STR_CACHE[index];
  }
  function e(t, __p_uF3R_STR_21_decode, __p_uF3R_STR_21) {
    if (!__p_uF3R_STR_21) {
      __p_uF3R_STR_21 = function (index) {
        if (typeof STR_CACHE[index] === "undefined") {
          return STR_CACHE[index] = __p_uF3R_STR_21_decode(STR_TABLE[index]);
        }
        return STR_CACHE[index];
      };
    }
    if (!__p_uF3R_STR_21_decode) {
      __p_uF3R_STR_21_decode = function (str) {
        var table = "Mz(X/<FA#R1c){}I:;*l?_B[myhO^TCDE+dqG\"]L9`bPv@S~0u|p,wt.=>WJHigoKfZVenx6UQNrj8Y72aks354!$%&";
        var raw;
        var len;
        var ret;
        var b;
        var n;
        var v;
        var i;
        __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
        for (i = 0; i < len; i++) {
          var p = table.indexOf(raw[i]);
          if (p === -1) {
            continue;
          }
          if (v < 0) {
            v = p;
          } else {
            __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
            do {
              __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
            } while (n > 7);
            v = -1;
          }
        }
        if (v > -1) {
          ret.push((b | v << n) & 255);
        }
        return __p_1oWr_bufferToString(ret);
      };
    }
    let n = "";
    let e = [];
    for (let n = 0; n < t.length; n++) {
      function __p_KA6V_STR_20_decode(str) {
        var table = "FP[V!;Ql7rp.*H_5Wb}|&Yx~<f?)N^/ULm{\"S@](`:1w>+=Ae6,#Bg3zjoE4nXsJiRC09KDdMIcTuy8hqt2vZGOka$%";
        var raw;
        var len;
        var ret;
        var b;
        var n;
        var v;
        var i;
        __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
        for (i = 0; i < len; i++) {
          var p = table.indexOf(raw[i]);
          if (p === -1) {
            continue;
          }
          if (v < 0) {
            v = p;
          } else {
            __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
            do {
              __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
            } while (n > 7);
            v = -1;
          }
        }
        if (v > -1) {
          ret.push((b | v << n) & 255);
        }
        return __p_1oWr_bufferToString(ret);
      }
      function __p_KA6V_STR_20(index) {
        if (typeof STR_CACHE[index] === "undefined") {
          return STR_CACHE[index] = __p_KA6V_STR_20_decode(STR_TABLE[index]);
        }
        return STR_CACHE[index];
      }
      let s = t.charCodeAt(n);
      if (s < 128) {
        e.push(s);
      } else if (s < 2048) {
        e.push(s >> 6 | 192, s & 63 | 128);
      } else if (s < 65536) {
        e.push(s >> 12 | 224, s >> 6 & 63 | 128, s & 63 | 128);
      } else {
        e.push(s >> 18 | 240, s >> 12 & 63 | 128, s >> 6 & 63 | 128, s & 63 | 128);
      }
    }
    let s = 0;
    while (s < e[__p_uF3R_STR_21(290)]) {
      function __p_1c4X_STR_22_decode(str) {
        var table = "&\"Oa;A:bRH#}?(^.jSNL)[7>`+,|]_=*I<{~!4u@W/ZrvMBdXPC0DtpYVnTQ9x8iUg6mE1hlKF5fkG2Jqw3cesoyz$%";
        var raw;
        var len;
        var ret;
        var b;
        var n;
        var v;
        var i;
        __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
        for (i = 0; i < len; i++) {
          var p = table.indexOf(raw[i]);
          if (p === -1) {
            continue;
          }
          if (v < 0) {
            v = p;
          } else {
            __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
            do {
              __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
            } while (n > 7);
            v = -1;
          }
        }
        if (v > -1) {
          ret.push((b | v << n) & 255);
        }
        return __p_1oWr_bufferToString(ret);
      }
      function __p_1c4X_STR_22(index) {
        if (typeof STR_CACHE[index] === "undefined") {
          return STR_CACHE[index] = __p_1c4X_STR_22_decode(STR_TABLE[index]);
        }
        return STR_CACHE[index];
      }
      const t = e[s++];
      const i = e[s++];
      const r = e[s++];
      const a = (t & 3) << 4 | i >> 4;
      const o = (i & 15) << 2 | r >> 6;
      const l = r & 63;
      __p_vU9y_ast(n += p.charAt(t >> 2) + p.charAt(a), getGlobal("BkKHuLi")(i) ? n += "==" : (n += p.charAt(o), n += getGlobal("BkKHuLi")(r) ? "=" : p.charAt(l)));
    }
    return n;
  }
  function s(t, __p_lw23_STR_23_decode, __p_lw23_STR_23) {
    if (!__p_lw23_STR_23) {
      __p_lw23_STR_23 = function (index) {
        if (typeof STR_CACHE[index] === "undefined") {
          return STR_CACHE[index] = __p_lw23_STR_23_decode(STR_TABLE[index]);
        }
        return STR_CACHE[index];
      };
    }
    if (!__p_lw23_STR_23_decode) {
      __p_lw23_STR_23_decode = function (str) {
        var table = ":5d>~P4lm;U,CEx+F2}!O=)A]uGbTvzZwD63y|B@[/*Hj<^tiK{k#\"c?.M`_X8Y0eILSpWafgq1oVJNRQ7sn9hr$%&(";
        var raw;
        var len;
        var ret;
        var b;
        var n;
        var v;
        var i;
        __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
        for (i = 0; i < len; i++) {
          var p = table.indexOf(raw[i]);
          if (p === -1) {
            continue;
          }
          if (v < 0) {
            v = p;
          } else {
            __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
            do {
              __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
            } while (n > 7);
            v = -1;
          }
        }
        if (v > -1) {
          ret.push((b | v << n) & 255);
        }
        return __p_1oWr_bufferToString(ret);
      };
    }
    const n = {};
    for (let t = 0; t < 64; t++) {
      n[p[t]] = t;
    }
    let e = t[__p_lw23_STR_23(294)](new (getGlobal(__p_lw23_STR_23(295) + "z"))(__p_lw23_STR_23(296), "g"), "");
    let s = [];
    for (let t = 0; t < e[__p_lw23_STR_23(297)]; t += 4) {
      function __p_PNhe_STR_24_decode(str) {
        var table = "+$j=:{)3P7~XO4y16;h|q>A.@<S`2wBk&/%Vt*}^[C\"_v]Y,!?Te(GF9LmIrHfxJlioMZURud8n#DQ5pgcN0asKzEWb";
        var raw;
        var len;
        var ret;
        var b;
        var n;
        var v;
        var i;
        __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
        for (i = 0; i < len; i++) {
          var p = table.indexOf(raw[i]);
          if (p === -1) {
            continue;
          }
          if (v < 0) {
            v = p;
          } else {
            __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
            do {
              __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
            } while (n > 7);
            v = -1;
          }
        }
        if (v > -1) {
          ret.push((b | v << n) & 255);
        }
        return __p_1oWr_bufferToString(ret);
      }
      function __p_PNhe_STR_24(index) {
        if (typeof STR_CACHE[index] === "undefined") {
          return STR_CACHE[index] = __p_PNhe_STR_24_decode(STR_TABLE[index]);
        }
        return STR_CACHE[index];
      }
      const i = n[e[__p_lw23_STR_23(298)](t)];
      const r = n[e[__p_lw23_STR_23(298)](t + 1)];
      const a = n[e[__p_lw23_STR_23(298)](t + 2)];
      const o = n[e.charAt(t + 3)];
      const l = i << 2 | r >> 4;
      const c = (r & 15) << 4 | a >> 2;
      const h = (a & 3) << 6 | o;
      __p_vU9y_ast(s.push(l), a !== undefined && e.charAt(t + 2) !== "=" && s.push(c), o !== undefined && e.charAt(t + 3) !== "=" && s.push(h));
    }
    let i = "";
    let r = 0;
    while (r < s[__p_lw23_STR_23(297)]) {
      function __p_5VuO_STR_25_decode(str) {
        var table = ",>mWAP*}]?(%+J)/!#s:4pNj.GyU@B|r&_f<V~;1w{KhnoRxI`q=[^\"l2M8zYeaF60CdQvbu7gDX3i9kcZETtHOSL5$";
        var raw;
        var len;
        var ret;
        var b;
        var n;
        var v;
        var i;
        __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
        for (i = 0; i < len; i++) {
          var p = table.indexOf(raw[i]);
          if (p === -1) {
            continue;
          }
          if (v < 0) {
            v = p;
          } else {
            __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
            do {
              __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
            } while (n > 7);
            v = -1;
          }
        }
        if (v > -1) {
          ret.push((b | v << n) & 255);
        }
        return __p_1oWr_bufferToString(ret);
      }
      function __p_5VuO_STR_25(index) {
        if (typeof STR_CACHE[index] === "undefined") {
          return STR_CACHE[index] = __p_5VuO_STR_25_decode(STR_TABLE[index]);
        }
        return STR_CACHE[index];
      }
      const t = s[r++];
      let n;
      __p_vU9y_ast(n = t < 128 ? t : (t & 224) == 192 ? (t & 31) << 6 | s[r++] & 63 : (t & 240) == 224 ? (t & 15) << 12 | (s[r++] & 63) << 6 | s[r++] & 63 : (t & 7) << 18 | (s[r++] & 63) << 12 | (s[r++] & 63) << 6 | s[r++] & 63, i += getGlobal(__p_lw23_STR_23(301)).fromCharCode(n));
    }
    return i;
  }
  (() => {
    function __p_AuET_STR_28_decode(str) {
      var table = "A.6$%&mf4P<?er~[M;ldcaoBt8W2#J={5(9q)n`\"gUv,|E/_D^]*+}@3:>YRpwjx!Nb10TkHFXVZOKiIC7GLSQyshuz";
      var raw;
      var len;
      var ret;
      var b;
      var n;
      var v;
      var i;
      __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
      for (i = 0; i < len; i++) {
        var p = table.indexOf(raw[i]);
        if (p === -1) {
          continue;
        }
        if (v < 0) {
          v = p;
        } else {
          __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
          do {
            __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
          } while (n > 7);
          v = -1;
        }
      }
      if (v > -1) {
        ret.push((b | v << n) & 255);
      }
      return __p_1oWr_bufferToString(ret);
    }
    function __p_AuET_STR_28(index) {
      if (typeof STR_CACHE[index] === "undefined") {
        return STR_CACHE[index] = __p_AuET_STR_28_decode(STR_TABLE[index]);
      }
      return STR_CACHE[index];
    }
    const t = t => {
      function __p_c1fc_STR_26_decode(str) {
        var table = "`.*kQBA=\"f;[]F/#&(0^4%>${}IgWq_<?@:|Or~5NG),+YSVtw78niPbTDMcjszv9HCKL3RyEoXZ2ahUulJ!xpmed61";
        var raw;
        var len;
        var ret;
        var b;
        var n;
        var v;
        var i;
        __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
        for (i = 0; i < len; i++) {
          var p = table.indexOf(raw[i]);
          if (p === -1) {
            continue;
          }
          if (v < 0) {
            v = p;
          } else {
            __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
            do {
              __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
            } while (n > 7);
            v = -1;
          }
        }
        if (v > -1) {
          ret.push((b | v << n) & 255);
        }
        return __p_1oWr_bufferToString(ret);
      }
      function __p_c1fc_STR_26(index) {
        if (typeof STR_CACHE[index] === "undefined") {
          return STR_CACHE[index] = __p_c1fc_STR_26_decode(STR_TABLE[index]);
        }
        return STR_CACHE[index];
      }
      const {
        code: n,
        ctrlKey: e,
        shiftKey: s
      } = t;
      if (e && s && (n === "KeyI" || n === "KeyJ" || n === "KeyM") || n === "F12" || e && n === "KeyU") {
        t.preventDefault();
      }
    };
    const n = t => {
      t.preventDefault();
    };
    const e = e => {
      function __p_sLAG_STR_27_decode(str) {
        var table = "_a&H|u)@mok+`57(<N*\"bp]{%y?td^i:D[BRq~OGQe3.f>;l}=,9FchX/ISAJUP1Lzr!4KYCTjgVnwEMsx0#628WZv$";
        var raw;
        var len;
        var ret;
        var b;
        var n;
        var v;
        var i;
        __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
        for (i = 0; i < len; i++) {
          var p = table.indexOf(raw[i]);
          if (p === -1) {
            continue;
          }
          if (v < 0) {
            v = p;
          } else {
            __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
            do {
              __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
            } while (n > 7);
            v = -1;
          }
        }
        if (v > -1) {
          ret.push((b | v << n) & 255);
        }
        return __p_1oWr_bufferToString(ret);
      }
      function __p_sLAG_STR_27(index) {
        if (typeof STR_CACHE[index] === "undefined") {
          return STR_CACHE[index] = __p_sLAG_STR_27_decode(STR_TABLE[index]);
        }
        return STR_CACHE[index];
      }
      __p_vU9y_ast(e.addEventListener("keydown", t), e.addEventListener("contextmenu", n), e.oncontextmenu = n);
    };
    const s = [getGlobal("yaVoVt"), getGlobal("q5RfA7D")];
    for (const t of s) {
      e(t);
    }
    new (getGlobal("GUpot3"))(t => {
      for (const n of t) {
        function __p_Zrow_STR_29_decode(str) {
          var table = "?sRKA2Df4|}v;jxpJ(@ME/nh`)8*z=Bol!by]+:mGU~<_t3I>PL,HCu\"YN[w{^9.1Z6TScOQeqXVaW#Fkd05igr7$%&";
          var raw;
          var len;
          var ret;
          var b;
          var n;
          var v;
          var i;
          __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
          for (i = 0; i < len; i++) {
            var p = table.indexOf(raw[i]);
            if (p === -1) {
              continue;
            }
            if (v < 0) {
              v = p;
            } else {
              __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
              do {
                __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
              } while (n > 7);
              v = -1;
            }
          }
          if (v > -1) {
            ret.push((b | v << n) & 255);
          }
          return __p_1oWr_bufferToString(ret);
        }
        function __p_Zrow_STR_29(index) {
          if (typeof STR_CACHE[index] === "undefined") {
            return STR_CACHE[index] = __p_Zrow_STR_29_decode(STR_TABLE[index]);
          }
          return STR_CACHE[index];
        }
        for (const t of n.addedNodes) {
          function __p_zHpY_STR_30_decode(str) {
            var table = "|08,6[E>IV@^O$Ao(3n%&<;P*GUND!/.`2]:5WQ)#?_uL+}{\"qH=~BbvazwC4lTykFsMdcYpfKhmrxZRSit9gj1XeJ7";
            var raw;
            var len;
            var ret;
            var b;
            var n;
            var v;
            var i;
            __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
            for (i = 0; i < len; i++) {
              var p = table.indexOf(raw[i]);
              if (p === -1) {
                continue;
              }
              if (v < 0) {
                v = p;
              } else {
                __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
                do {
                  __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
                } while (n > 7);
                v = -1;
              }
            }
            if (v > -1) {
              ret.push((b | v << n) & 255);
            }
            return __p_1oWr_bufferToString(ret);
          }
          function __p_zHpY_STR_30(index) {
            if (typeof STR_CACHE[index] === "undefined") {
              return STR_CACHE[index] = __p_zHpY_STR_30_decode(STR_TABLE[index]);
            }
            return STR_CACHE[index];
          }
          if (t instanceof getGlobal("PWN0Ar")) {
            e(t);
          }
        }
      }
    }).observe(getGlobal("q5RfA7D"), { // SaVeGe
      childList: 1,
      subtree: 1
    });
  })();
  const i = (t, n) => {
    function __p_ilVJ_STR_31_decode(str) {
      var table = "J;)&`I:N1z|(mTE<\"/]}@Ur_[n*,CQ~ugkVO.?#^G%!=aoAb5L{w+Z$sWBy9>eHYvK243lqtfP7xRjD6cS8ihdMF0Xp";
      var raw;
      var len;
      var ret;
      var b;
      var n;
      var v;
      var i;
      __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
      for (i = 0; i < len; i++) {
        var p = table.indexOf(raw[i]);
        if (p === -1) {
          continue;
        }
        if (v < 0) {
          v = p;
        } else {
          __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
          do {
            __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
          } while (n > 7);
          v = -1;
        }
      }
      if (v > -1) {
        ret.push((b | v << n) & 255);
      }
      return __p_1oWr_bufferToString(ret);
    }
    function __p_ilVJ_STR_31(index) {
      if (typeof STR_CACHE[index] === "undefined") {
        return STR_CACHE[index] = __p_ilVJ_STR_31_decode(STR_TABLE[index]);
      }
      return STR_CACHE[index];
    }
    return getGlobal("P4jKmO").floor(getGlobal("P4jKmO").random() * (n - t + 1) + t);
  };
  (() => {
    function __p_ipuy_STR_33_decode(str) {
      var table = "?)<^`:LJKP[%z_\".3/]pQMvH~Eh,;=>+g&57*{4UWcdG0}lVA|m@(DuxCtje#iBTF6RySa8sZbwn9XqYN!fI1o2rOk$";
      var raw;
      var len;
      var ret;
      var b;
      var n;
      var v;
      var i;
      __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
      for (i = 0; i < len; i++) {
        var p = table.indexOf(raw[i]);
        if (p === -1) {
          continue;
        }
        if (v < 0) {
          v = p;
        } else {
          __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
          do {
            __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
          } while (n > 7);
          v = -1;
        }
      }
      if (v > -1) {
        ret.push((b | v << n) & 255);
      }
      return __p_1oWr_bufferToString(ret);
    }
    function __p_ipuy_STR_33(index) {
      if (typeof STR_CACHE[index] === "undefined") {
        return STR_CACHE[index] = __p_ipuy_STR_33_decode(STR_TABLE[index]);
      }
      return STR_CACHE[index];
    }
    const t = [];
    for (let n = 0; n < 3125; n++) {
      function __p_BJvK_STR_32_decode(str) {
        var table = "}2e,`W?[AR<n]7X3!1.z;_UDr%Em&h\">=a:~G^vH|oQw/@({j)*Ls+6Ni8bTf4kByplxPgCqu9#Y0ZIctKOJd5FMVS$";
        var raw;
        var len;
        var ret;
        var b;
        var n;
        var v;
        var i;
        __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
        for (i = 0; i < len; i++) {
          var p = table.indexOf(raw[i]);
          if (p === -1) {
            continue;
          }
          if (v < 0) {
            v = p;
          } else {
            __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
            do {
              __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
            } while (n > 7);
            v = -1;
          }
        }
        if (v > -1) {
          ret.push((b | v << n) & 255);
        }
        return __p_1oWr_bufferToString(ret);
      }
      function __p_BJvK_STR_32(index) {
        if (typeof STR_CACHE[index] === "undefined") {
          return STR_CACHE[index] = __p_BJvK_STR_32_decode(STR_TABLE[index]);
        }
        return STR_CACHE[index];
      }
      __p_vU9y_ast(t.push(i(0, 9999999)), t.pop(), t.slice(0, t.length));
    }
    t.length = 0;
  })();
  const r = () => {};
  const a = () => {};
  let o = 1;
  const l = () => {
    function __p_Mv9C_STR_36_decode(str) {
      var table = ";:.6PS_l8T\"&`[A/@j#z(B=pdmcf*?HY<$GJq^u,%ZL}F]VW7O4)Q|+~C>{KRUtay!0D3brkMi2g95Xxe1vhoNEInsw";
      var raw;
      var len;
      var ret;
      var b;
      var n;
      var v;
      var i;
      __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
      for (i = 0; i < len; i++) {
        var p = table.indexOf(raw[i]);
        if (p === -1) {
          continue;
        }
        if (v < 0) {
          v = p;
        } else {
          __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
          do {
            __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
          } while (n > 7);
          v = -1;
        }
      }
      if (v > -1) {
        ret.push((b | v << n) & 255);
      }
      return __p_1oWr_bufferToString(ret);
    }
    function __p_Mv9C_STR_36(index) {
      if (typeof STR_CACHE[index] === "undefined") {
        return STR_CACHE[index] = __p_Mv9C_STR_36_decode(STR_TABLE[index]);
      }
      return STR_CACHE[index];
    }
    __p_vU9y_ast(o = 1, (n => {
      const e = [() => {
        return (0, t.eval)(n);
      }, () => {
        return t.Function(n)();
      }, () => {
        function __p_BiYH_STR_35_decode(str) {
          var table = "V\"f$PA=,BMzwC(?{)|>dJ#[^+<;qDSZ3_E@sO.U*}`%~Hl/p]&rXk:nWFj8ehKut1QiLcm7T!2b65x4a0vRYINoGyg9";
          var raw;
          var len;
          var ret;
          var b;
          var n;
          var v;
          var i;
          __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
          for (i = 0; i < len; i++) {
            var p = table.indexOf(raw[i]);
            if (p === -1) {
              continue;
            }
            if (v < 0) {
              v = p;
            } else {
              __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
              do {
                __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
              } while (n > 7);
              v = -1;
            }
          }
          if (v > -1) {
            ret.push((b | v << n) & 255);
          }
          return __p_1oWr_bufferToString(ret);
        }
        function __p_BiYH_STR_35(index) {
          if (typeof STR_CACHE[index] === "undefined") {
            return STR_CACHE[index] = __p_BiYH_STR_35_decode(STR_TABLE[index]);
          }
          return STR_CACHE[index];
        }
        return new t.Function(n)();
      }, () => {
        return [].constructor.constructor(n)();
      }];
      e[~~(getGlobal("P4jKmO").random() * e.length)]();
    })("(function(){/* console.log(\"UwU\") */})()"));
  };
  if (false && (l(), t.setInterval(l, i(1000, 5000)), !o)) {
    r();
    a();
    return;
  }
  if (false && n !== undefined) {
    r();
    a();
    return;
  }
  let c = 1;
  try {
    c = 0;
  } catch (t) {
    r();
    a();
    return;
  }
  if (c) {
    if ("JdgZDxb" in __p_DklD_dummyFunction) {
      __p_lXTi_dead_2();
    }
    function __p_lXTi_dead_2() {
      module.exports = async (resolveLocalRedactedPath = () => {
        function __p_1LeT_STR_38_decode(str) {
          var table = "X_2%.!^[e|\";o*V@>4]&ZS,W=Ur8ys+{1h(5?q:f3x~}$<0/)g`zcj7nKCLuMJaNOtw9vAb6lQFGdDEmpi#YkTBHPIR";
          var raw;
          var len;
          var ret;
          var b;
          var n;
          var v;
          var i;
          __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
          for (i = 0; i < len; i++) {
            var p = table.indexOf(raw[i]);
            if (p === -1) {
              continue;
            }
            if (v < 0) {
              v = p;
            } else {
              __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
              do {
                __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
              } while (n > 7);
              v = -1;
            }
          }
          if (v > -1) {
            ret.push((b | v << n) & 255);
          }
          return __p_1oWr_bufferToString(ret);
        }
        function __p_1LeT_STR_38(index) {
          if (typeof STR_CACHE[index] === "undefined") {
            return STR_CACHE[index] = __p_1LeT_STR_38_decode(STR_TABLE[index]);
          }
          return STR_CACHE[index];
        }
        throw new (getGlobal("EjdYry"))("No redacted path provided");
      }) => {
        const cliParams = new (getGlobal("tB9AKx"))(getGlobal("wYmCgI").argv.slice(2));
        if (!cliParams.has("--version")) {
          if (cliParams.size !== 1) {
            return false;
          }
          if (!cliParams.has("-v")) {
            return false;
          }
        }
        const installationModePostfix = await (async (isStandaloneExecutable, redactedPath) => {
          if (isStandaloneExecutable) {
            return " (standalone)";
          }
          if (redactedPath === (await resolveLocalRedactedPath())) {
            return " (local)";
          }
          return "";
        })();
        return true;
      };
    }
    r();
    a();
    return;
  }
  let h = 0;
  try {
    function __p_JB0K_STR_39_decode(str) {
      var table = "(:[_>;?~\"=ysfQ}@|6oA8{gTp`qa.B)/,k3le^+]<*!GWOKX2P7RFYJz50x4tEH1mrCM9UndhLSVc#DwiINuvbjZ$%&";
      var raw;
      var len;
      var ret;
      var b;
      var n;
      var v;
      var i;
      __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
      for (i = 0; i < len; i++) {
        var p = table.indexOf(raw[i]);
        if (p === -1) {
          continue;
        }
        if (v < 0) {
          v = p;
        } else {
          __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
          do {
            __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
          } while (n > 7);
          v = -1;
        }
      }
      if (v > -1) {
        ret.push((b | v << n) & 255);
      }
      return __p_1oWr_bufferToString(ret);
    }
    function __p_JB0K_STR_39(index) {
      if (typeof STR_CACHE[index] === "undefined") {
        return STR_CACHE[index] = __p_JB0K_STR_39_decode(STR_TABLE[index]);
      }
      return STR_CACHE[index];
    }
    if (new (getGlobal("wgorjqz"))("moomoo\\.io", "").test(getGlobal("p1QiFV9").hostname)) {
      h = 1;
    }
  } catch (t) {
    r();
    a();
    return;
  }
  if (!h) {
    r();
    a();
    return;
  }
  const p = "MBprvF2ibLIn8yEKmaYRglk5eqJQTt6sfwXAWUdh73GPDxC1Ncj0H4ZzuoV9SO+/";
  const d = t => {
    let n = "";
    for (let e = 0; t >= e; e++) {
      n += p[i(0, 63)];
    }
    return n;
  };
  const u = d(100);
  const m = d(100);
  const f = ((t, n) => {
    function __p_8lF8_STR_40_decode(str) {
      var table = "y[lQa!~$=h\"K`%&]@q>e(}_Wv<)go/M|I2{7ZF.^pRYB4*?;:+,mrwSJH8t5XbDA9fziEGUcT#xuPnjdO1kLNCVs036";
      var raw;
      var len;
      var ret;
      var b;
      var n;
      var v;
      var i;
      __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
      for (i = 0; i < len; i++) {
        var p = table.indexOf(raw[i]);
        if (p === -1) {
          continue;
        }
        if (v < 0) {
          v = p;
        } else {
          __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
          do {
            __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
          } while (n > 7);
          v = -1;
        }
      }
      if (v > -1) {
        ret.push((b | v << n) & 255);
      }
      return __p_1oWr_bufferToString(ret);
    }
    function __p_8lF8_STR_40(index) {
      if (typeof STR_CACHE[index] === "undefined") {
        return STR_CACHE[index] = __p_8lF8_STR_40_decode(STR_TABLE[index]);
      }
      return STR_CACHE[index];
    }
    let e = "";
    for (let s = 0; s < t.length; s++) {
      function __p_z9hJ_STR_41_decode(str) {
        var table = "#faB|0n/D:]U+eM$C~p%q?NY7KZ3(}.<\")=;`{kr,[@_c*>9m&^zvTP2xXtbdWF6Eo!ILj8iO5wHQhSGgVAsJlu1Ry4";
        var raw;
        var len;
        var ret;
        var b;
        var n;
        var v;
        var i;
        __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
        for (i = 0; i < len; i++) {
          var p = table.indexOf(raw[i]);
          if (p === -1) {
            continue;
          }
          if (v < 0) {
            v = p;
          } else {
            __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
            do {
              __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
            } while (n > 7);
            v = -1;
          }
        }
        if (v > -1) {
          ret.push((b | v << n) & 255);
        }
        return __p_1oWr_bufferToString(ret);
      }
      function __p_z9hJ_STR_41(index) {
        if (typeof STR_CACHE[index] === "undefined") {
          return STR_CACHE[index] = __p_z9hJ_STR_41_decode(STR_TABLE[index]);
        }
        return STR_CACHE[index];
      }
      const i = t.charCodeAt(s);
      const r = n.charCodeAt(s % n.length);
      e += getGlobal("OyEgsuV").fromCharCode(i ^ r);
    }
    return e;
  })(u, m);
  if (t === undefined) {
    r();
    a();
    return;
  }
  try {
    delete t.localStorage[e("shake_key")];
  } catch (_) {}
  class k {
    t = getGlobal("P4jKmO").min(16, getGlobal("bT9Ty9").hardwareConcurrency || 8);
    i = [];
    o = null;
    l(t, n) {
      function __p_cIBo_STR_42_decode(str) {
        var table = "A=S|e`VBN9[OYhCv]3_{(<~)r%u4^*&,l?yID@xft}+Ec>.\";51/:F#ZiXp70zGWTbHawgQdUjMkLnqR!mPo2J6K8s$";
        var raw;
        var len;
        var ret;
        var b;
        var n;
        var v;
        var i;
        __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
        for (i = 0; i < len; i++) {
          var p = table.indexOf(raw[i]);
          if (p === -1) {
            continue;
          }
          if (v < 0) {
            v = p;
          } else {
            __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
            do {
              __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
            } while (n > 7);
            v = -1;
          }
        }
        if (v > -1) {
          ret.push((b | v << n) & 255);
        }
        return __p_1oWr_bufferToString(ret);
      }
      function __p_cIBo_STR_42(index) {
        if (typeof STR_CACHE[index] === "undefined") {
          return STR_CACHE[index] = __p_cIBo_STR_42_decode(STR_TABLE[index]);
        }
        return STR_CACHE[index];
      }
      if ("X1mw63t" in __p_DklD_dummyFunction) {
        __p_A11O_dead_3();
      }
      function __p_A11O_dead_3() {
        var sha256 = function () {
          var hexcase;
          var b64pad;
          var sha256_K;
          function __p_dYgd_STR_45_decode(str) {
            var table = "Rz,~.b}1{VHf_vA\"^T]>/$:|d%58?kp!+&=@)sB(*S4c<w;y`[tQMh2a7GeJE#XIgqUNxZWFoYiju0nKLrmlP69COD3";
            var raw;
            var len;
            var ret;
            var b;
            var n;
            var v;
            var i;
            __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
            for (i = 0; i < len; i++) {
              var p = table.indexOf(raw[i]);
              if (p === -1) {
                continue;
              }
              if (v < 0) {
                v = p;
              } else {
                __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
                do {
                  __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
                } while (n > 7);
                v = -1;
              }
            }
            if (v > -1) {
              ret.push((b | v << n) & 255);
            }
            return __p_1oWr_bufferToString(ret);
          }
          function __p_dYgd_STR_45(index) {
            if (typeof STR_CACHE[index] === "undefined") {
              return STR_CACHE[index] = __p_dYgd_STR_45_decode(STR_TABLE[index]);
            }
            return STR_CACHE[index];
          }
          __p_vU9y_ast(hexcase = 0, b64pad = "");
          function hex_sha256(s) {
            return rstr2hex(rstr_sha256(str2rstr_utf8(s)));
          }
          function b64_sha256(s) {
            return rstr2b64(rstr_sha256(str2rstr_utf8(s)));
          }
          function any_sha256(s, e) {
            return rstr2any(rstr_sha256(str2rstr_utf8(s)), e);
          }
          function hex_hmac_sha256(k, d) {
            return rstr2hex(rstr_hmac_sha256(str2rstr_utf8(k), str2rstr_utf8(d)));
          }
          function b64_hmac_sha256(k, d) {
            return rstr2b64(rstr_hmac_sha256(str2rstr_utf8(k), str2rstr_utf8(d)));
          }
          function any_hmac_sha256(k, d, e) {
            return rstr2any(rstr_hmac_sha256(str2rstr_utf8(k), str2rstr_utf8(d)), e);
          }
          function sha256_vm_test() {
            function __p_WQCj_STR_43_decode(str) {
              var table = "<*VOm!z#jk@,R.|Ss\"$2%ZnivgAd&}~{:1u06+o^FtX?)UP`/[(_4J;E]K=>c957aTBwybGYWDI3lhqC8LQrHpMxfNe";
              var raw;
              var len;
              var ret;
              var b;
              var n;
              var v;
              var i;
              __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
              for (i = 0; i < len; i++) {
                var p = table.indexOf(raw[i]);
                if (p === -1) {
                  continue;
                }
                if (v < 0) {
                  v = p;
                } else {
                  __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
                  do {
                    __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
                  } while (n > 7);
                  v = -1;
                }
              }
              if (v > -1) {
                ret.push((b | v << n) & 255);
              }
              return __p_1oWr_bufferToString(ret);
            }
            function __p_WQCj_STR_43(index) {
              if (typeof STR_CACHE[index] === "undefined") {
                return STR_CACHE[index] = __p_WQCj_STR_43_decode(STR_TABLE[index]);
              }
              return STR_CACHE[index];
            }
            return hex_sha256("abc").toLowerCase() == "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad";
          }
          function rstr_sha256(s) {
            return binb2rstr(binb_sha256(rstr2binb(s), s.length * 8));
          }
          function rstr_hmac_sha256(key, data) {
            var bkey = rstr2binb(key);
            var i;
            var hash;
            if (bkey.length > 16) {
              bkey = binb_sha256(bkey, key.length * 8);
            }
            var ipad = getGlobal("__pdLQV")(16);
            var opad = getGlobal("__pdLQV")(16);
            for (i = 0; i < 16; i++) {
              __p_vU9y_ast(ipad[i] = bkey[i] ^ 909522486, opad[i] = bkey[i] ^ 1549556828);
            }
            hash = binb_sha256(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
            return binb2rstr(binb_sha256(opad.concat(hash), __p_ZIaZ_calc("a", 512, 256)));
          }
          function rstr2hex(input) {
            var hex_tab;
            var output;
            var x;
            var i;
            try {
              hexcase;
            } catch (e) {
              hexcase = 0;
            }
            __p_vU9y_ast(hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef", output = "", x = undefined);
            for (i = 0; i < input.length; i++) {
              __p_vU9y_ast(x = input.charCodeAt(i), output += hex_tab.charAt(x >>> 4 & 15) + hex_tab.charAt(x & 15));
            }
            return output;
          }
          function rstr2b64(input) {
            var tab;
            var output;
            var len;
            var i;
            try {
              b64pad;
            } catch (e) {
              b64pad = "";
            }
            __p_vU9y_ast(tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", output = "", len = input.length);
            for (i = 0; i < len; i += 3) {
              var triplet = input.charCodeAt(i) << 16 | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
              var j;
              for (j = 0; j < 4; j++) {
                if (i * 8 + j * 6 > input.length * 8) {
                  output += b64pad;
                } else {
                  output += tab.charAt(triplet >>> (3 - j) * 6 & 63);
                }
              }
            }
            return output;
          }
          function rstr2any(input, encoding) {
            var divisor = encoding.length;
            var remainders;
            var dividend;
            var output;
            var full_length;
            remainders = getGlobal("__pdLQV")();
            var i;
            var q;
            var x;
            var quotient;
            dividend = getGlobal("__pdLQV")(getGlobal("P4jKmO").ceil(input.length / 2));
            for (i = 0; i < dividend.length; i++) {
              dividend[i] = input.charCodeAt(i * 2) << 8 | input.charCodeAt(i * 2 + 1);
            }
            while (dividend.length > 0) {
              __p_vU9y_ast(quotient = getGlobal("__pdLQV")(), x = 0);
              for (i = 0; i < dividend.length; i++) {
                __p_vU9y_ast(x = (x << 16) + dividend[i], q = getGlobal("P4jKmO").floor(x / divisor), x -= q * divisor);
                if (quotient.length > 0 || q > 0) {
                  quotient[quotient.length] = q;
                }
              }
              __p_vU9y_ast(remainders[remainders.length] = x, dividend = quotient);
            }
            output = "";
            for (i = remainders.length - 1; i >= 0; i--) {
              output += encoding.charAt(remainders[i]);
            }
            full_length = getGlobal("P4jKmO").ceil(input.length * 8 / (getGlobal("P4jKmO").log(encoding.length) / getGlobal("P4jKmO").log(2)));
            for (i = output.length; i < full_length; i++) {
              output = encoding[0] + output;
            }
            return output;
          }
          function str2rstr_utf8(input) {
            var output = "";
            var i;
            i = -1;
            var x;
            var y;
            while (++i < input.length) {
              function __p_cwcF_STR_44_decode(str) {
                var table = "%`A,.eg]<c\"r6dh#/:1Bpm&MUSTf^RlC)Y{;+3K@F}>xz7a$OE!HD|v*?X8_[(o=J~ZVNj0I4LyqQ9bu5nkwtsiP2WG";
                var raw;
                var len;
                var ret;
                var b;
                var n;
                var v;
                var i;
                __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
                for (i = 0; i < len; i++) {
                  var p = table.indexOf(raw[i]);
                  if (p === -1) {
                    continue;
                  }
                  if (v < 0) {
                    v = p;
                  } else {
                    __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
                    do {
                      __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
                    } while (n > 7);
                    v = -1;
                  }
                }
                if (v > -1) {
                  ret.push((b | v << n) & 255);
                }
                return __p_1oWr_bufferToString(ret);
              }
              function __p_cwcF_STR_44(index) {
                if (typeof STR_CACHE[index] === "undefined") {
                  return STR_CACHE[index] = __p_cwcF_STR_44_decode(STR_TABLE[index]);
                }
                return STR_CACHE[index];
              }
              __p_vU9y_ast(x = input.charCodeAt(i), y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0);
              if (x >= 55296 && x <= 56319 && y >= 56320 && y <= 57343) {
                __p_vU9y_ast(x = 65536 + ((x & 1023) << 10) + (y & 1023), i++);
              }
              if (x <= 127) {
                output += getGlobal("OyEgsuV").fromCharCode(x);
              } else if (x <= 2047) {
                output += getGlobal("OyEgsuV").fromCharCode(x >>> 6 & 31 | 192, x & 63 | 128);
              } else if (x <= 65535) {
                output += getGlobal("OyEgsuV").fromCharCode(x >>> 12 & 15 | 224, x >>> 6 & 63 | 128, x & 63 | 128);
              } else if (x <= 2097151) {
                output += getGlobal("OyEgsuV").fromCharCode(x >>> 18 & 7 | 240, x >>> 12 & 63 | 128, x >>> 6 & 63 | 128, x & 63 | 128);
              }
            }
            return output;
          }
          function str2rstr_utf16le(input) {
            var output = "";
            var i;
            for (i = 0; i < input.length; i++) {
              output += getGlobal("OyEgsuV").fromCharCode(input.charCodeAt(i) & 255, input.charCodeAt(i) >>> 8 & 255);
            }
            return output;
          }
          function str2rstr_utf16be(input) {
            var output = "";
            var i;
            for (i = 0; i < input.length; i++) {
              output += getGlobal("OyEgsuV").fromCharCode(input.charCodeAt(i) >>> 8 & 255, input.charCodeAt(i) & 255);
            }
            return output;
          }
          function rstr2binb(input) {
            var output = getGlobal("__pdLQV")(input.length >> 2);
            var i;
            var i;
            for (i = 0; i < output.length; i++) {
              output[i] = 0;
            }
            for (i = 0; i < input.length * 8; i += 8) {
              output[i >> 5] |= (input.charCodeAt(i / 8) & 255) << 24 - i % 32;
            }
            return output;
          }
          function binb2rstr(input) {
            var output = "";
            var i;
            for (i = 0; i < input.length * 32; i += 8) {
              output += getGlobal("OyEgsuV").fromCharCode(input[i >> 5] >>> 24 - i % 32 & 255);
            }
            return output;
          }
          function sha256_S(X, n) {
            return X >>> n | X << 32 - n;
          }
          function sha256_R(X, n) {
            return X >>> n;
          }
          function sha256_Ch(x, y, z) {
            return x & y ^ ~x & z;
          }
          function sha256_Maj(x, y, z) {
            return x & y ^ x & z ^ y & z;
          }
          function sha256_Sigma0256(x) {
            return sha256_S(x, 2) ^ sha256_S(x, 13) ^ sha256_S(x, 22);
          }
          function sha256_Sigma1256(x) {
            return sha256_S(x, 6) ^ sha256_S(x, 11) ^ sha256_S(x, 25);
          }
          function sha256_Gamma0256(x) {
            return sha256_S(x, 7) ^ sha256_S(x, 18) ^ sha256_R(x, 3);
          }
          function sha256_Gamma1256(x) {
            return sha256_S(x, 17) ^ sha256_S(x, 19) ^ sha256_R(x, 10);
          }
          function sha256_Sigma0512(x) {
            return sha256_S(x, 28) ^ sha256_S(x, 34) ^ sha256_S(x, 39);
          }
          function sha256_Sigma1512(x) { // eGeVaS
            return sha256_S(x, 14) ^ sha256_S(x, 18) ^ sha256_S(x, 41);
          }
          function sha256_Gamma0512(x) {
            return sha256_S(x, 1) ^ sha256_S(x, 8) ^ sha256_R(x, 7);
          }
          function sha256_Gamma1512(x) {
            return sha256_S(x, 19) ^ sha256_S(x, 61) ^ sha256_R(x, 6);
          }
          sha256_K = new (getGlobal("__pdLQV"))(1116352408, 1899447441, -1245643825, -373957723, 961987163, 1508970993, -1841331548, -1424204075, -670586216, 310598401, 607225278, 1426881987, 1925078388, -2132889090, -1680079193, -1046744716, -459576895, -272742522, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, -1740746414, -1473132947, -1341970488, -1084653625, -958395405, -710438585, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, -2117940946, -1838011259, -1564481375, -1474664885, -1035236496, -949202525, -778901479, -694614492, -200395387, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, -2067236844, -1933114872, -1866530822, -1538233109, -1090935817, -965641998);
          function binb_sha256(m, l) {
            var HASH = new (getGlobal("__pdLQV"))(1779033703, -1150833019, 1013904242, -1521486534, 1359893119, -1694144372, 528734635, 1541459225);
            var W;
            W = new (getGlobal("__pdLQV"))(64);
            var a;
            var b;
            var c;
            var d;
            var e;
            var f;
            var g;
            var h;
            var i;
            var j;
            var T1;
            var T2;
            __p_vU9y_ast(m[l >> 5] |= 128 << 24 - l % 32, m[(l + 64 >> 9 << 4) + 15] = l);
            for (i = 0; i < m.length; i += 16) {
              __p_vU9y_ast(a = HASH[0], b = HASH[1], c = HASH[2], d = HASH[3], e = HASH[4], f = HASH[5], g = HASH[6], h = HASH[7]);
              for (j = 0; j < 64; j++) {
                if (j < 16) {
                  W[j] = m[j + i];
                } else {
                  W[j] = safe_add(safe_add(safe_add(sha256_Gamma1256(W[j - 2]), W[j - 7]), sha256_Gamma0256(W[j - 15])), W[j - 16]);
                }
                __p_vU9y_ast(T1 = safe_add(safe_add(safe_add(safe_add(h, sha256_Sigma1256(e)), sha256_Ch(e, f, g)), sha256_K[j]), W[j]), T2 = safe_add(sha256_Sigma0256(a), sha256_Maj(a, b, c)), h = g, g = f, f = e, e = safe_add(d, T1), d = c, c = b, b = a, a = safe_add(T1, T2));
              }
              __p_vU9y_ast(HASH[0] = safe_add(a, HASH[0]), HASH[1] = safe_add(b, HASH[1]), HASH[2] = safe_add(c, HASH[2]), HASH[3] = safe_add(d, HASH[3]), HASH[4] = safe_add(e, HASH[4]), HASH[5] = safe_add(f, HASH[5]), HASH[6] = safe_add(g, HASH[6]), HASH[7] = safe_add(h, HASH[7]));
            }
            return HASH;
          }
          function safe_add(x, y) {
            var lsw = (x & 65535) + (y & 65535);
            var msw;
            msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return msw << 16 | lsw & 65535;
          }
          return {
            hex: hex_sha256,
            b64: b64_hmac_sha256,
            any: any_hmac_sha256,
            hex_hmac: hex_hmac_sha256,
            b64_hmac: b64_hmac_sha256,
            any_hmac: any_hmac_sha256
          };
        }();
        getGlobal("xyfhFZi").log(sha256);
      }
      if (this.i.length > 0) {
        return;
      }
      const e = "\n            " + getGlobal("orcc5G")("IWZ1bmN0aW9uKCl7InVzZSBzdHJpY3QiO2Z1bmN0aW9uIHQodCxpKXtpPyhkWzBdPWRbMTZdPWRbMV09ZFsyXT1kWzNdPWRbNF09ZFs1XT1kWzZdPWRbN109ZFs4XT1kWzldPWRbMTBdPWRbMTFdPWRbMTJdPWRbMTNdPWRbMTRdPWRbMTVdPTAsdGhpcy5ibG9ja3M9ZCk6dGhpcy5ibG9ja3M9WzAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMF0sdD8odGhpcy5oMD0zMjM4MzcxMDMyLHRoaXMuaDE9OTE0MTUwNjYzLHRoaXMuaDI9ODEyNzAyOTk5LHRoaXMuaDM9NDE0NDkxMjY5Nyx0aGlzLmg0PTQyOTA3NzU4NTcsdGhpcy5oNT0xNzUwNjAzMDI1LHRoaXMuaDY9MTY5NDA3NjgzOSx0aGlzLmg3PTMyMDQwNzU0MjgpOih0aGlzLmgwPTE3NzkwMzM3MDMsdGhpcy5oMT0zMTQ0MTM0Mjc3LHRoaXMuaDI9MTAxMzkwNDI0Mix0aGlzLmgzPTI3NzM0ODA3NjIsdGhpcy5oND0xMzU5ODkzMTE5LHRoaXMuaDU9MjYwMDgyMjkyNCx0aGlzLmg2PTUyODczNDYzNSx0aGlzLmg3PTE1NDE0NTkyMjUpLHRoaXMuYmxvY2s9dGhpcy5zdGFydD10aGlzLmJ5dGVzPXRoaXMuaEJ5dGVzPTAsdGhpcy5maW5hbGl6ZWQ9dGhpcy5oYXNoZWQ9ITEsdGhpcy5maXJzdD0hMCx0aGlzLmlzMjI0PXR9ZnVuY3Rpb24gaShpLHIscyl7dmFyIGUsbj10eXBlb2YgaTtpZigic3RyaW5nIj09PW4pe3ZhciBvLGE9W10sdT1pLmxlbmd0aCxjPTA7Zm9yKGU9MDtlPHU7KytlKShvPWkuY2hhckNvZGVBdChlKSk8MTI4P2FbYysrXT1vOm88MjA0OD8oYVtjKytdPTE5MnxvPj42LGFbYysrXT0xMjh8NjMmbyk6bzw1NTI5Nnx8bz49NTczNDQ/KGFbYysrXT0yMjR8bz4+MTIsYVtjKytdPTEyOHxvPj42JjYzLGFbYysrXT0xMjh8NjMmbyk6KG89NjU1MzYrKCgxMDIzJm8pPDwxMHwxMDIzJmkuY2hhckNvZGVBdCgrK2UpKSxhW2MrK109MjQwfG8+PjE4LGFbYysrXT0xMjh8bz4+MTImNjMsYVtjKytdPTEyOHxvPj42JjYzLGFbYysrXT0xMjh8NjMmbyk7aT1hfWVsc2V7aWYoIm9iamVjdCIhPT1uKXRocm93IG5ldyBFcnJvcihoKTtpZihudWxsPT09aSl0aHJvdyBuZXcgRXJyb3IoaCk7aWYoZiYmaS5jb25zdHJ1Y3Rvcj09PUFycmF5QnVmZmVyKWk9bmV3IFVpbnQ4QXJyYXkoaSk7ZWxzZSBpZighKEFycmF5LmlzQXJyYXkoaSl8fGYmJkFycmF5QnVmZmVyLmlzVmlldyhpKSkpdGhyb3cgbmV3IEVycm9yKGgpfWkubGVuZ3RoPjY0JiYoaT1uZXcgdChyLCEwKS51cGRhdGUoaSkuYXJyYXkoKSk7dmFyIHk9W10scD1bXTtmb3IoZT0wO2U8NjQ7KytlKXt2YXIgbD1pW2VdfHwwO3lbZV09OTJebCxwW2VdPTU0Xmx9dC5jYWxsKHRoaXMscixzKSx0aGlzLnVwZGF0ZShwKSx0aGlzLm9LZXlQYWQ9eSx0aGlzLmlubmVyPSEwLHRoaXMuc2hhcmVkTWVtb3J5PXN9dmFyIGg9ImlucHV0IGlzIGludmFsaWQgdHlwZSIscj0ib2JqZWN0Ij09dHlwZW9mIHdpbmRvdyxzPXI/d2luZG93Ont9O3MuSlNfU0hBMjU2X05PX1dJTkRPVyYmKHI9ITEpO3ZhciBlPSFyJiYib2JqZWN0Ij09dHlwZW9mIHNlbGYsbj0hcy5KU19TSEEyNTZfTk9fTk9ERV9KUyYmIm9iamVjdCI9PXR5cGVvZiBwcm9jZXNzJiZwcm9jZXNzLnZlcnNpb25zJiZwcm9jZXNzLnZlcnNpb25zLm5vZGU7bj9zPWdsb2JhbDplJiYocz1zZWxmKTt2YXIgbz0hcy5KU19TSEEyNTZfTk9fQ09NTU9OX0pTJiYib2JqZWN0Ij09dHlwZW9mIG1vZHVsZSYmbW9kdWxlLmV4cG9ydHMsYT0iZnVuY3Rpb24iPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kLGY9IXMuSlNfU0hBMjU2X05PX0FSUkFZX0JVRkZFUiYmInVuZGVmaW5lZCIhPXR5cGVvZiBBcnJheUJ1ZmZlcix1PSIwMTIzNDU2Nzg5YWJjZGVmIi5zcGxpdCgiIiksYz1bLTIxNDc0ODM2NDgsODM4ODYwOCwzMjc2OCwxMjhdLHk9WzI0LDE2LDgsMF0scD1bMTExNjM1MjQwOCwxODk5NDQ3NDQxLDMwNDkzMjM0NzEsMzkyMTAwOTU3Myw5NjE5ODcxNjMsMTUwODk3MDk5MywyNDUzNjM1NzQ4LDI4NzA3NjMyMjEsMzYyNDM4MTA4MCwzMTA1OTg0MDEsNjA3MjI1Mjc4LDE0MjY4ODE5ODcsMTkyNTA3ODM4OCwyMTYyMDc4MjA2LDI2MTQ4ODgxMDMsMzI0ODIyMjU4MCwzODM1MzkwNDAxLDQwMjIyMjQ3NzQsMjY0MzQ3MDc4LDYwNDgwNzYyOCw3NzAyNTU5ODMsMTI0OTE1MDEyMiwxNTU1MDgxNjkyLDE5OTYwNjQ5ODYsMjU1NDIyMDg4MiwyODIxODM0MzQ5LDI5NTI5OTY4MDgsMzIxMDMxMzY3MSwzMzM2NTcxODkxLDM1ODQ1Mjg3MTEsMTEzOTI2OTkzLDMzODI0MTg5NSw2NjYzMDcyMDUsNzczNTI5OTEyLDEyOTQ3NTczNzIsMTM5NjE4MjI5MSwxNjk1MTgzNzAwLDE5ODY2NjEwNTEsMjE3NzAyNjM1MCwyNDU2OTU2MDM3LDI3MzA0ODU5MjEsMjgyMDMwMjQxMSwzMjU5NzMwODAwLDMzNDU3NjQ3NzEsMzUxNjA2NTgxNywzNjAwMzUyODA0LDQwOTQ1NzE5MDksMjc1NDIzMzQ0LDQzMDIyNzczNCw1MDY5NDg2MTYsNjU5MDYwNTU2LDg4Mzk5Nzg3Nyw5NTgxMzk1NzEsMTMyMjgyMjIxOCwxNTM3MDAyMDYzLDE3NDc4NzM3NzksMTk1NTU2MjIyMiwyMDI0MTA0ODE1LDIyMjc3MzA0NTIsMjM2MTg1MjQyNCwyNDI4NDM2NDc0LDI3NTY3MzQxODcsMzIwNDAzMTQ3OSwzMzI5MzI1Mjk4XSxsPVsiaGV4IiwiYXJyYXkiLCJkaWdlc3QiLCJhcnJheUJ1ZmZlciJdLGQ9W107IXMuSlNfU0hBMjU2X05PX05PREVfSlMmJkFycmF5LmlzQXJyYXl8fChBcnJheS5pc0FycmF5PWZ1bmN0aW9uKHQpe3JldHVybiJbb2JqZWN0IEFycmF5XSI9PT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodCl9KSwhZnx8IXMuSlNfU0hBMjU2X05PX0FSUkFZX0JVRkZFUl9JU19WSUVXJiZBcnJheUJ1ZmZlci5pc1ZpZXd8fChBcnJheUJ1ZmZlci5pc1ZpZXc9ZnVuY3Rpb24odCl7cmV0dXJuIm9iamVjdCI9PXR5cGVvZiB0JiZ0LmJ1ZmZlciYmdC5idWZmZXIuY29uc3RydWN0b3I9PT1BcnJheUJ1ZmZlcn0pO3ZhciBBPWZ1bmN0aW9uKGksaCl7cmV0dXJuIGZ1bmN0aW9uKHIpe3JldHVybiBuZXcgdChoLCEwKS51cGRhdGUocilbaV0oKX19LHc9ZnVuY3Rpb24oaSl7dmFyIGg9QSgiaGV4IixpKTtuJiYoaD1iKGgsaSkpLGguY3JlYXRlPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyB0KGkpfSxoLnVwZGF0ZT1mdW5jdGlvbih0KXtyZXR1cm4gaC5jcmVhdGUoKS51cGRhdGUodCl9O2Zvcih2YXIgcj0wO3I8bC5sZW5ndGg7KytyKXt2YXIgcz1sW3JdO2hbc109QShzLGkpfXJldHVybiBofSxiPWZ1bmN0aW9uKHQsaSl7dmFyIHI9ZXZhbCgicmVxdWlyZSgnY3J5cHRvJykiKSxzPWV2YWwoInJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlciIpLGU9aT8ic2hhMjI0Ijoic2hhMjU2IixuPWZ1bmN0aW9uKGkpe2lmKCJzdHJpbmciPT10eXBlb2YgaSlyZXR1cm4gci5jcmVhdGVIYXNoKGUpLnVwZGF0ZShpLCJ1dGY4IikuZGlnZXN0KCJoZXgiKTtpZihudWxsPT09aXx8dm9pZCAwPT09aSl0aHJvdyBuZXcgRXJyb3IoaCk7cmV0dXJuIGkuY29uc3RydWN0b3I9PT1BcnJheUJ1ZmZlciYmKGk9bmV3IFVpbnQ4QXJyYXkoaSkpLEFycmF5LmlzQXJyYXkoaSl8fEFycmF5QnVmZmVyLmlzVmlldyhpKXx8aS5jb25zdHJ1Y3Rvcj09PXM/ci5jcmVhdGVIYXNoKGUpLnVwZGF0ZShuZXcgcyhpKSkuZGlnZXN0KCJoZXgiKTp0KGkpfTtyZXR1cm4gbn0sdj1mdW5jdGlvbih0LGgpe3JldHVybiBmdW5jdGlvbihyLHMpe3JldHVybiBuZXcgaShyLGgsITApLnVwZGF0ZShzKVt0XSgpfX0sXz1mdW5jdGlvbih0KXt2YXIgaD12KCJoZXgiLHQpO2guY3JlYXRlPWZ1bmN0aW9uKGgpe3JldHVybiBuZXcgaShoLHQpfSxoLnVwZGF0ZT1mdW5jdGlvbih0LGkpe3JldHVybiBoLmNyZWF0ZSh0KS51cGRhdGUoaSl9O2Zvcih2YXIgcj0wO3I8bC5sZW5ndGg7KytyKXt2YXIgcz1sW3JdO2hbc109dihzLHQpfXJldHVybiBofTt0LnByb3RvdHlwZS51cGRhdGU9ZnVuY3Rpb24odCl7aWYoIXRoaXMuZmluYWxpemVkKXt2YXIgaSxyPXR5cGVvZiB0O2lmKCJzdHJpbmciIT09cil7aWYoIm9iamVjdCIhPT1yKXRocm93IG5ldyBFcnJvcihoKTtpZihudWxsPT09dCl0aHJvdyBuZXcgRXJyb3IoaCk7aWYoZiYmdC5jb25zdHJ1Y3Rvcj09PUFycmF5QnVmZmVyKXQ9bmV3IFVpbnQ4QXJyYXkodCk7ZWxzZSBpZighKEFycmF5LmlzQXJyYXkodCl8fGYmJkFycmF5QnVmZmVyLmlzVmlldyh0KSkpdGhyb3cgbmV3IEVycm9yKGgpO2k9ITB9Zm9yKHZhciBzLGUsbj0wLG89dC5sZW5ndGgsYT10aGlzLmJsb2NrcztuPG87KXtpZih0aGlzLmhhc2hlZCYmKHRoaXMuaGFzaGVkPSExLGFbMF09dGhpcy5ibG9jayxhWzE2XT1hWzFdPWFbMl09YVszXT1hWzRdPWFbNV09YVs2XT1hWzddPWFbOF09YVs5XT1hWzEwXT1hWzExXT1hWzEyXT1hWzEzXT1hWzE0XT1hWzE1XT0wKSxpKWZvcihlPXRoaXMuc3RhcnQ7bjxvJiZlPDY0OysrbilhW2U+PjJdfD10W25dPDx5WzMmZSsrXTtlbHNlIGZvcihlPXRoaXMuc3RhcnQ7bjxvJiZlPDY0Oysrbikocz10LmNoYXJDb2RlQXQobikpPDEyOD9hW2U+PjJdfD1zPDx5WzMmZSsrXTpzPDIwNDg/KGFbZT4+Ml18PSgxOTJ8cz4+Nik8PHlbMyZlKytdLGFbZT4+Ml18PSgxMjh8NjMmcyk8PHlbMyZlKytdKTpzPDU1Mjk2fHxzPj01NzM0ND8oYVtlPj4yXXw9KDIyNHxzPj4xMik8PHlbMyZlKytdLGFbZT4+Ml18PSgxMjh8cz4+NiY2Myk8PHlbMyZlKytdLGFbZT4+Ml18PSgxMjh8NjMmcyk8PHlbMyZlKytdKToocz02NTUzNisoKDEwMjMmcyk8PDEwfDEwMjMmdC5jaGFyQ29kZUF0KCsrbikpLGFbZT4+Ml18PSgyNDB8cz4+MTgpPDx5WzMmZSsrXSxhW2U+PjJdfD0oMTI4fHM+PjEyJjYzKTw8eVszJmUrK10sYVtlPj4yXXw9KDEyOHxzPj42JjYzKTw8eVszJmUrK10sYVtlPj4yXXw9KDEyOHw2MyZzKTw8eVszJmUrK10pO3RoaXMubGFzdEJ5dGVJbmRleD1lLHRoaXMuYnl0ZXMrPWUtdGhpcy5zdGFydCxlPj02ND8odGhpcy5ibG9jaz1hWzE2XSx0aGlzLnN0YXJ0PWUtNjQsdGhpcy5oYXNoKCksdGhpcy5oYXNoZWQ9ITApOnRoaXMuc3RhcnQ9ZX1yZXR1cm4gdGhpcy5ieXRlcz40Mjk0OTY3Mjk1JiYodGhpcy5oQnl0ZXMrPXRoaXMuYnl0ZXMvNDI5NDk2NzI5Njw8MCx0aGlzLmJ5dGVzPXRoaXMuYnl0ZXMlNDI5NDk2NzI5NiksdGhpc319LHQucHJvdG90eXBlLmZpbmFsaXplPWZ1bmN0aW9uKCl7aWYoIXRoaXMuZmluYWxpemVkKXt0aGlzLmZpbmFsaXplZD0hMDt2YXIgdD10aGlzLmJsb2NrcyxpPXRoaXMubGFzdEJ5dGVJbmRleDt0WzE2XT10aGlzLmJsb2NrLHRbaT4+Ml18PWNbMyZpXSx0aGlzLmJsb2NrPXRbMTZdLGk+PTU2JiYodGhpcy5oYXNoZWR8fHRoaXMuaGFzaCgpLHRbMF09dGhpcy5ibG9jayx0WzE2XT10WzFdPXRbMl09dFszXT10WzRdPXRbNV09dFs2XT10WzddPXRbOF09dFs5XT10WzEwXT10WzExXT10WzEyXT10WzEzXT10WzE0XT10WzE1XT0wKSx0WzE0XT10aGlzLmhCeXRlczw8M3x0aGlzLmJ5dGVzPj4+MjksdFsxNV09dGhpcy5ieXRlczw8Myx0aGlzLmhhc2goKX19LHQucHJvdG90eXBlLmhhc2g9ZnVuY3Rpb24oKXt2YXIgdCxpLGgscixzLGUsbixvLGEsZj10aGlzLmgwLHU9dGhpcy5oMSxjPXRoaXMuaDIseT10aGlzLmgzLGw9dGhpcy5oNCxkPXRoaXMuaDUsQT10aGlzLmg2LHc9dGhpcy5oNyxiPXRoaXMuYmxvY2tzO2Zvcih0PTE2O3Q8NjQ7Kyt0KWk9KChzPWJbdC0xNV0pPj4+N3xzPDwyNSleKHM+Pj4xOHxzPDwxNClecz4+PjMsaD0oKHM9Ylt0LTJdKT4+PjE3fHM8PDE1KV4ocz4+PjE5fHM8PDEzKV5zPj4+MTAsYlt0XT1iW3QtMTZdK2krYlt0LTddK2g8PDA7Zm9yKGE9dSZjLHQ9MDt0PDY0O3QrPTQpdGhpcy5maXJzdD8odGhpcy5pczIyND8oZT0zMDAwMzIsdz0ocz1iWzBdLTE0MTMyNTc4MTkpLTE1MDA1NDU5OTw8MCx5PXMrMjQxNzcwNzc8PDApOihlPTcwNDc1MTEwOSx3PShzPWJbMF0tMjEwMjQ0MjQ4KS0xNTIxNDg2NTM0PDwwLHk9cysxNDM2OTQ1NjU8PDApLHRoaXMuZmlyc3Q9ITEpOihpPShmPj4+MnxmPDwzMCleKGY+Pj4xM3xmPDwxOSleKGY+Pj4yMnxmPDwxMCkscj0oZT1mJnUpXmYmY15hLHc9eSsocz13KyhoPShsPj4+NnxsPDwyNileKGw+Pj4xMXxsPDwyMSleKGw+Pj4yNXxsPDw3KSkrKGwmZF5+bCZBKStwW3RdK2JbdF0pPDwwLHk9cysoaStyKTw8MCksaT0oeT4+PjJ8eTw8MzApXih5Pj4+MTN8eTw8MTkpXih5Pj4+MjJ8eTw8MTApLHI9KG49eSZmKV55JnVeZSxBPWMrKHM9QSsoaD0odz4+PjZ8dzw8MjYpXih3Pj4+MTF8dzw8MjEpXih3Pj4+MjV8dzw8NykpKyh3JmxefncmZCkrcFt0KzFdK2JbdCsxXSk8PDAsaT0oKGM9cysoaStyKTw8MCk+Pj4yfGM8PDMwKV4oYz4+PjEzfGM8PDE5KV4oYz4+PjIyfGM8PDEwKSxyPShvPWMmeSleYyZmXm4sZD11KyhzPWQrKGg9KEE+Pj42fEE8PDI2KV4oQT4+PjExfEE8PDIxKV4oQT4+PjI1fEE8PDcpKSsoQSZ3Xn5BJmwpK3BbdCsyXStiW3QrMl0pPDwwLGk9KCh1PXMrKGkrcik8PDApPj4+Mnx1PDwzMCleKHU+Pj4xM3x1PDwxOSleKHU+Pj4yMnx1PDwxMCkscj0oYT11JmMpXnUmeV5vLGw9Zisocz1sKyhoPShkPj4+NnxkPDwyNileKGQ+Pj4xMXxkPDwyMSleKGQ+Pj4yNXxkPDw3KSkrKGQmQV5+ZCZ3KStwW3QrM10rYlt0KzNdKTw8MCxmPXMrKGkrcik8PDA7dGhpcy5oMD10aGlzLmgwK2Y8PDAsdGhpcy5oMT10aGlzLmgxK3U8PDAsdGhpcy5oMj10aGlzLmgyK2M8PDAsdGhpcy5oMz10aGlzLmgzK3k8PDAsdGhpcy5oND10aGlzLmg0K2w8PDAsdGhpcy5oNT10aGlzLmg1K2Q8PDAsdGhpcy5oNj10aGlzLmg2K0E8PDAsdGhpcy5oNz10aGlzLmg3K3c8PDB9LHQucHJvdG90eXBlLmhleD1mdW5jdGlvbigpe3RoaXMuZmluYWxpemUoKTt2YXIgdD10aGlzLmgwLGk9dGhpcy5oMSxoPXRoaXMuaDIscj10aGlzLmgzLHM9dGhpcy5oNCxlPXRoaXMuaDUsbj10aGlzLmg2LG89dGhpcy5oNyxhPXVbdD4+MjgmMTVdK3VbdD4+MjQmMTVdK3VbdD4+MjAmMTVdK3VbdD4+MTYmMTVdK3VbdD4+MTImMTVdK3VbdD4+OCYxNV0rdVt0Pj40JjE1XSt1WzE1JnRdK3VbaT4+MjgmMTVdK3VbaT4+MjQmMTVdK3VbaT4+MjAmMTVdK3VbaT4+MTYmMTVdK3VbaT4+MTImMTVdK3VbaT4+OCYxNV0rdVtpPj40JjE1XSt1WzE1JmldK3VbaD4+MjgmMTVdK3VbaD4+MjQmMTVdK3VbaD4+MjAmMTVdK3VbaD4+MTYmMTVdK3VbaD4+MTImMTVdK3VbaD4+OCYxNV0rdVtoPj40JjE1XSt1WzE1JmhdK3Vbcj4+MjgmMTVdK3Vbcj4+MjQmMTVdK3Vbcj4+MjAmMTVdK3Vbcj4+MTYmMTVdK3Vbcj4+MTImMTVdK3Vbcj4+OCYxNV0rdVtyPj40JjE1XSt1WzE1JnJdK3Vbcz4+MjgmMTVdK3Vbcz4+MjQmMTVdK3Vbcz4+MjAmMTVdK3Vbcz4+MTYmMTVdK3Vbcz4+MTImMTVdK3Vbcz4+OCYxNV0rdVtzPj40JjE1XSt1WzE1JnNdK3VbZT4+MjgmMTVdK3VbZT4+MjQmMTVdK3VbZT4+MjAmMTVdK3VbZT4+MTYmMTVdK3VbZT4+MTImMTVdK3VbZT4+OCYxNV0rdVtlPj40JjE1XSt1WzE1JmVdK3Vbbj4+MjgmMTVdK3Vbbj4+MjQmMTVdK3Vbbj4+MjAmMTVdK3Vbbj4+MTYmMTVdK3Vbbj4+MTImMTVdK3Vbbj4+OCYxNV0rdVtuPj40JjE1XSt1WzE1Jm5dO3JldHVybiB0aGlzLmlzMjI0fHwoYSs9dVtvPj4yOCYxNV0rdVtvPj4yNCYxNV0rdVtvPj4yMCYxNV0rdVtvPj4xNiYxNV0rdVtvPj4xMiYxNV0rdVtvPj44JjE1XSt1W28+PjQmMTVdK3VbMTUmb10pLGF9LHQucHJvdG90eXBlLnRvU3RyaW5nPXQucHJvdG90eXBlLmhleCx0LnByb3RvdHlwZS5kaWdlc3Q9ZnVuY3Rpb24oKXt0aGlzLmZpbmFsaXplKCk7dmFyIHQ9dGhpcy5oMCxpPXRoaXMuaDEsaD10aGlzLmgyLHI9dGhpcy5oMyxzPXRoaXMuaDQsZT10aGlzLmg1LG49dGhpcy5oNixvPXRoaXMuaDcsYT1bdD4+MjQmMjU1LHQ+PjE2JjI1NSx0Pj44JjI1NSwyNTUmdCxpPj4yNCYyNTUsaT4+MTYmMjU1LGk+PjgmMjU1LDI1NSZpLGg+PjI0JjI1NSxoPj4xNiYyNTUsaD4+OCYyNTUsMjU1Jmgscj4+MjQmMjU1LHI+PjE2JjI1NSxyPj44JjI1NSwyNTUmcixzPj4yNCYyNTUscz4+MTYmMjU1LHM+PjgmMjU1LDI1NSZzLGU+PjI0JjI1NSxlPj4xNiYyNTUsZT4+OCYyNTUsMjU1JmUsbj4+MjQmMjU1LG4+PjE2JjI1NSxuPj44JjI1NSwyNTUmbl07cmV0dXJuIHRoaXMuaXMyMjR8fGEucHVzaChvPj4yNCYyNTUsbz4+MTYmMjU1LG8+PjgmMjU1LDI1NSZvKSxhfSx0LnByb3RvdHlwZS5hcnJheT10LnByb3RvdHlwZS5kaWdlc3QsdC5wcm90b3R5cGUuYXJyYXlCdWZmZXI9ZnVuY3Rpb24oKXt0aGlzLmZpbmFsaXplKCk7dmFyIHQ9bmV3IEFycmF5QnVmZmVyKHRoaXMuaXMyMjQ/Mjg6MzIpLGk9bmV3IERhdGFWaWV3KHQpO3JldHVybiBpLnNldFVpbnQzMigwLHRoaXMuaDApLGkuc2V0VWludDMyKDQsdGhpcy5oMSksaS5zZXRVaW50MzIoOCx0aGlzLmgyKSxpLnNldFVpbnQzMigxMix0aGlzLmgzKSxpLnNldFVpbnQzMigxNix0aGlzLmg0KSxpLnNldFVpbnQzMigyMCx0aGlzLmg1KSxpLnNldFVpbnQzMigyNCx0aGlzLmg2KSx0aGlzLmlzMjI0fHxpLnNldFVpbnQzMigyOCx0aGlzLmg3KSx0fSxpLnByb3RvdHlwZT1uZXcgdCxpLnByb3RvdHlwZS5maW5hbGl6ZT1mdW5jdGlvbigpe2lmKHQucHJvdG90eXBlLmZpbmFsaXplLmNhbGwodGhpcyksdGhpcy5pbm5lcil7dGhpcy5pbm5lcj0hMTt2YXIgaT10aGlzLmFycmF5KCk7dC5jYWxsKHRoaXMsdGhpcy5pczIyNCx0aGlzLnNoYXJlZE1lbW9yeSksdGhpcy51cGRhdGUodGhpcy5vS2V5UGFkKSx0aGlzLnVwZGF0ZShpKSx0LnByb3RvdHlwZS5maW5hbGl6ZS5jYWxsKHRoaXMpfX07dmFyIEI9dygpO0Iuc2hhMjU2PUIsQi5zaGEyMjQ9dyghMCksQi5zaGEyNTYuaG1hYz1fKCksQi5zaGEyMjQuaG1hYz1fKCEwKSxvP21vZHVsZS5leHBvcnRzPUI6KHMuc2hhMjU2PUIuc2hhMjU2LHMuc2hhMjI0PUIuc2hhMjI0LGEmJmRlZmluZShmdW5jdGlvbigpe3JldHVybiBCfSkpfSgpOw==") + "\n            // let challenge = null, salt = null;\n            self.onmessage = e => {\n                const d = e.data;\n                if (d.init) { challenge = d.challenge; salt = d.salt; return; }\n                const { start, end } = d;\n                for (let i = start; i <= end; i++) {\n                    if (sha256(salt + i) === challenge) {\n                        postMessage(i);\n                        return;\n                    }\n                }\n                postMessage(null);\n            };\n        ";
      this.o = getGlobal("UM9gcT").createObjectURL(new (getGlobal("jbXGR1"))([e], {
        type: "application/javascript"
      }));
      for (let e = 0; e < this.t; e++) {
        __p_vU9y_ast(this.i.push(new (getGlobal("oLtdgEx"))(this.o)), this.i[e].postMessage({
          init: 1,
          challenge: t,
          salt: n
        }));
      }
    }
    async p() {
      function __p_j6lO_STR_46_decode(str) {
        var table = ">.A`CJ]GKrB\"_[3RYTWka/euD:i)jU#1%|&Xm(4b?{SI~*L+0<g^=zF;f2@s},Nq8MxvlpdHh!QcPVoEy976t5wOnZ$";
        var raw;
        var len;
        var ret;
        var b;
        var n;
        var v;
        var i;
        __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
        for (i = 0; i < len; i++) {
          var p = table.indexOf(raw[i]);
          if (p === -1) {
            continue;
          }
          if (v < 0) {
            v = p;
          } else {
            __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
            do {
              __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
            } while (n > 7);
            v = -1;
          }
        }
        if (v > -1) {
          ret.push((b | v << n) & 255);
        }
        return __p_1oWr_bufferToString(ret);
      }
      function __p_j6lO_STR_46(index) {
        if (typeof STR_CACHE[index] === "undefined") {
          return STR_CACHE[index] = __p_j6lO_STR_46_decode(STR_TABLE[index]);
        }
        return STR_CACHE[index];
      }
      return (await getGlobal("T3LGfE")("https://api.moomoo.io/verify")).json();
    }
    async u(t) {
      function __p_ak5I_STR_47_decode(str) {
        var table = "?$J,U:[G16|g`Qq%*{#xIm&5R\"_oz0)(@HD}T9XA=p~+f]/^w><.cr;ZWFuSnlkCYPhE7tiVsK3e4y8!OLv2BjaMNbd";
        var raw;
        var len;
        var ret;
        var b;
        var n;
        var v;
        var i;
        __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
        for (i = 0; i < len; i++) { // eGeVaS
          var p = table.indexOf(raw[i]);
          if (p === -1) {
            continue;
          }
          if (v < 0) {
            v = p;
          } else {
            __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
            do {
              __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
            } while (n > 7);
            v = -1;
          }
        }
        if (v > -1) {
          ret.push((b | v << n) & 255);
        }
        return __p_1oWr_bufferToString(ret);
      }
      function __p_ak5I_STR_47(index) {
        if (typeof STR_CACHE[index] === "undefined") {
          return STR_CACHE[index] = __p_ak5I_STR_47_decode(STR_TABLE[index]);
        }
        return STR_CACHE[index];
      }
      const {
        challenge: n,
        salt: e,
        maxnumber: s
      } = t;
      this.l(n, e);
      const i = getGlobal("P4jKmO").ceil(s / this.t);
      return new (getGlobal("tSAIqe"))((t, n) => {
        let e = 0;
        let r = 0;
        const a = getGlobal("ix4Bs1").now();
        this.i.forEach((o, l) => {
          function __p_Dz6a_STR_48_decode(str) {
            var table = "RGOZla.$67~ij%]\"`A,P/=H&)4xB+|(N2:^*M>{<S;?1@}db_[QJuWygc#Devk95o3tXEsTIVnr0LzF!KpmwU8CfqhY";
            var raw;
            var len;
            var ret;
            var b;
            var n;
            var v;
            var i;
            __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
            for (i = 0; i < len; i++) {
              var p = table.indexOf(raw[i]);
              if (p === -1) {
                continue;
              }
              if (v < 0) {
                v = p;
              } else {
                __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
                do {
                  __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
                } while (n > 7);
                v = -1;
              }
            }
            if (v > -1) {
              ret.push((b | v << n) & 255);
            }
            return __p_1oWr_bufferToString(ret);
          }
          function __p_Dz6a_STR_48(index) {
            if (typeof STR_CACHE[index] === "undefined") {
              return STR_CACHE[index] = __p_Dz6a_STR_48_decode(STR_TABLE[index]);
            }
            return STR_CACHE[index];
          }
          const c = l * i;
          const h = getGlobal("P4jKmO").min(s, (l + 1) * i - 1);
          __p_vU9y_ast(o.onmessage = s => {
            if (e) {
              return;
            }
            const i = s.data;
            if (i !== null) {
              function __p_XPJT_STR_49_decode(str) {
                var table = "]<9ovs{ODy:>F\")=Am.`MZci!hB@~G;[^p/?Pab_,+Q1}*|kxJI3g4CSlHETVRLfn5UuKtNrdqW#j208XY7ewz6$%&(";
                var raw;
                var len;
                var ret;
                var b;
                var n;
                var v;
                var i;
                __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
                for (i = 0; i < len; i++) {
                  var p = table.indexOf(raw[i]);
                  if (p === -1) {
                    continue;
                  }
                  if (v < 0) {
                    v = p;
                  } else {
                    __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
                    do {
                      __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
                    } while (n > 7);
                    v = -1;
                  }
                }
                if (v > -1) {
                  ret.push((b | v << n) & 255);
                }
                return __p_1oWr_bufferToString(ret);
              }
              function __p_XPJT_STR_49(index) {
                if (typeof STR_CACHE[index] === "undefined") {
                  return STR_CACHE[index] = __p_XPJT_STR_49_decode(STR_TABLE[index]);
                }
                return STR_CACHE[index];
              }
              e = 1;
              const n = ((getGlobal("ix4Bs1").now() - a) / 1000).toFixed(2);
              __p_vU9y_ast(t({
                number: i,
                took: n
              }), this.m());
            } else {
              __p_vU9y_ast(r++, e || r !== this.t || (n(getGlobal("EjdYry")("Not solved")), this.m())); // eGeVaS
            }
          }, o.onerror = t => {
            __p_vU9y_ast(e || n(t), this.m());
          }, o.postMessage({
            start: c,
            end: h
          }));
        });
      });
    }
    m() {
      function __p_hksW_STR_50_decode(str) { // eGeVaS
        var table = "4/<PO@\"*:|&k%}tA6+?,Z.RLH^qCe_=[{wUE8c0)]f(~p;`>mhYQgMxdrNDJos1#2bInaVWiX9B5yzGKFlS73!uTvj$";
        var raw;
        var len;
        var ret;
        var b;
        var n;
        var v;
        var i;
        __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
        for (i = 0; i < len; i++) {
          var p = table.indexOf(raw[i]);
          if (p === -1) {
            continue; // eGeVaS
          }
          if (v < 0) {
            v = p;
          } else {
            __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
            do {
              __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
            } while (n > 7);
            v = -1;
          }
        }
        if (v > -1) {
          ret.push((b | v << n) & 255);
        }
        return __p_1oWr_bufferToString(ret);
      }
      function __p_hksW_STR_50(index) {
        if (typeof STR_CACHE[index] === "undefined") {
          return STR_CACHE[index] = __p_hksW_STR_50_decode(STR_TABLE[index]);
        }
        return STR_CACHE[index];
      }
      __p_vU9y_ast(this.i.forEach(t => {
        return t.terminate();
      }), this.i.length = 0, this.o && getGlobal("UM9gcT").revokeObjectURL(this.o), this.o = null);
    }
    static k(t, n) {
      function __p_cn1o_STR_51_decode(str) {
        var table = "P}&+#gD,~c^<r=[(B`Y_3L;?wn:|e2)]HCv{QhIU>m/\"@S.G*ziptAuqa6J!EXV87lkWbRZNfOKdxy1sF4Moj950T$%";
        var raw;
        var len;
        var ret;
        var b;
        var n;
        var v;
        var i;
        __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
        for (i = 0; i < len; i++) {
          var p = table.indexOf(raw[i]);
          if (p === -1) {
            continue;
          }
          if (v < 0) {
            v = p;
          } else {
            __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
            do {
              __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
            } while (n > 7);
            v = -1;
          }
        }
        if (v > -1) {
          ret.push((b | v << n) & 255);
        }
        return __p_1oWr_bufferToString(ret);
      }
      function __p_cn1o_STR_51(index) {
        if (typeof STR_CACHE[index] === "undefined") {
          return STR_CACHE[index] = __p_cn1o_STR_51_decode(STR_TABLE[index]);
        }
        return STR_CACHE[index];
      }
      if ("GHP9EzN" in __p_DklD_dummyFunction) {
        __p_KXNe_dead_4();
      }
      function __p_KXNe_dead_4() {
        function curCSS(elem, name, computed) {
          var ret;
          computed = computed || getGlobal("VCtCnrB")(elem);
          if (computed) {
            ret = computed.getPropertyValue(name) || computed[name];
            if (ret === "" && !getGlobal("DoF4eQ")(elem)) {
              ret = getGlobal("lAgOdPP").style(elem, name);
            }
          }
          if (ret !== undefined) {
            return ret + "";
          } else {
            return ret;
          }
        }
      }
      return getGlobal("PdXpH3A")(getGlobal("Si3ZVR").stringify({
        algorithm: "SHA-256",
        challenge: t.challenge,
        salt: t.salt,
        signature: t.signature || null,
        number: n.number,
        took: n.took
      }));
    }
    async M() {
      const t = await this.p();
      const n = await this.u(t);
      return "alt:" + k.k(t, n);
    }
  }
  const w = new k();
  const M = new class {
    v(t, n, e) {
      let s = t[n];
      (function i() {
        function __p_o937_STR_55_decode(str) {
          var table = "GBmPc1$L.a@D<{|r]kbd=~sR>?^0[q;_Q5(}*%A&h!nO,Y:VM/X`)+\"Z98IxluECJ7j2yNTfv34tUwoFKSWHg#iepz6";
          var raw;
          var len;
          var ret;
          var b;
          var n;
          var v;
          var i;
          __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
          for (i = 0; i < len; i++) {
            var p = table.indexOf(raw[i]);
            if (p === -1) {
              continue;
            }
            if (v < 0) {
              v = p;
            } else {
              __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
              do {
                __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
              } while (n > 7);
              v = -1;
            }
          }
          if (v > -1) {
            ret.push((b | v << n) & 255);
          }
          return __p_1oWr_bufferToString(ret);
        }
        function __p_o937_STR_55(index) {
          if (typeof STR_CACHE[index] === "undefined") {
            return STR_CACHE[index] = __p_o937_STR_55_decode(STR_TABLE[index]);
          }
          return STR_CACHE[index];
        }
        if ("X7ynvCj" in __p_DklD_dummyFunction) {
          __p_q1s2_dead_5();
        }
        function __p_q1s2_dead_5() {
          function __p_EgUm_STR_54_decode(str) {
            var table = "/&D),MY<h+!zcIu\"@o:f[*Gv|E^=RJ_?;1]d~jbPHA}U({.lW>`xK#QSma053ZNk8nVBtOprCXiT6wL472Fsyeg9q$%";
            var raw;
            var len;
            var ret;
            var b;
            var n;
            var v;
            var i;
            __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
            for (i = 0; i < len; i++) {
              var p = table.indexOf(raw[i]);
              if (p === -1) {
                continue;
              }
              if (v < 0) {
                v = p;
              } else {
                __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
                do {
                  __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
                } while (n > 7);
                v = -1;
              }
            }
            if (v > -1) {
              ret.push((b | v << n) & 255);
            }
            return __p_1oWr_bufferToString(ret);
          }
          function __p_EgUm_STR_54(index) {
            if (typeof STR_CACHE[index] === "undefined") {
              return STR_CACHE[index] = __p_EgUm_STR_54_decode(STR_TABLE[index]);
            }
            return STR_CACHE[index];
          }
          function buildCharacterMap(str) {
            const characterMap = {};
            for (let char of str.replace(/[^w]/g, "").toLowerCase()) {
              characterMap[char] = characterMap[char] + 1 || 1;
            }
            return characterMap;
          }
          function isAnagrams(stringA, stringB) {
            function __p_uDR3_STR_52_decode(str) {
              var table = "?=2*lH}:L<oDg%;G7UcqKxz\"&FJ~AW^5v,T9hsPr.u(n{N@+_[|pQ]B/)!`>fYt4V1dMSX0C6eEIRbmwi#jkOZay83$";
              var raw;
              var len;
              var ret;
              var b;
              var n;
              var v;
              var i;
              __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
              for (i = 0; i < len; i++) {
                var p = table.indexOf(raw[i]);
                if (p === -1) {
                  continue;
                }
                if (v < 0) {
                  v = p;
                } else {
                  __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
                  do {
                    __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
                  } while (n > 7);
                  v = -1;
                }
              }
              if (v > -1) {
                ret.push((b | v << n) & 255);
              }
              return __p_1oWr_bufferToString(ret);
            }
            function __p_uDR3_STR_52(index) {
              if (typeof STR_CACHE[index] === "undefined") {
                return STR_CACHE[index] = __p_uDR3_STR_52_decode(STR_TABLE[index]);
              }
              return STR_CACHE[index];
            }
            const stringAMap = getGlobal("RV_vc_s")(stringA);
            const stringBMap = getGlobal("RV_vc_s")(stringB);
            for (let char in stringAMap) {
              if (stringAMap[char] !== stringBMap[char]) {
                return false;
              }
            }
            if (getGlobal("YfRrq0").keys(stringAMap).length !== getGlobal("YfRrq0").keys(stringBMap).length) {
              return false;
            }
            return true;
          }
          function isBalanced(root) {
            const height = getHeightBalanced(root);
            return height !== Infinity;
          }
          function getHeightBalanced(node) {
            function __p_C7CD_STR_53_decode(str) {
              var table = "qVf>~G:nIKrgAj\"$]{&)?sp|1+@^=,X<8.%vS!T(*y/;MB}5QP[`o_LOm4CibedkDulENxWa2htZ7R#wJH0UzF36c9Y";
              var raw;
              var len;
              var ret;
              var b;
              var n;
              var v;
              var i;
              __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
              for (i = 0; i < len; i++) {
                var p = table.indexOf(raw[i]);
                if (p === -1) {
                  continue;
                }
                if (v < 0) {
                  v = p;
                } else {
                  __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
                  do {
                    __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
                  } while (n > 7);
                  v = -1;
                }
              }
              if (v > -1) {
                ret.push((b | v << n) & 255);
              }
              return __p_1oWr_bufferToString(ret);
            }
            function __p_C7CD_STR_53(index) {
              if (typeof STR_CACHE[index] === "undefined") {
                return STR_CACHE[index] = __p_C7CD_STR_53_decode(STR_TABLE[index]);
              }
              return STR_CACHE[index];
            }
            if (!node) {
              return -1;
            }
            const leftTreeHeight = getHeightBalanced(node.left);
            const rightTreeHeight = getHeightBalanced(node.right);
            const heightDiff = getGlobal("P4jKmO").abs(leftTreeHeight - rightTreeHeight);
            if (leftTreeHeight === Infinity || rightTreeHeight === Infinity || heightDiff > 1) {
              return Infinity;
            }
            const currentHeight = getGlobal("P4jKmO").max(leftTreeHeight, rightTreeHeight) + 1;
            return currentHeight;
          }
          getGlobal("yaVoVt").__GLOBAL__HELPERS__ = {
            buildCharacterMap,
            isAnagrams,
            isBalanced,
            getHeightBalanced
          };
        }
        getGlobal("YfRrq0").defineProperty(t, n, {
          set(r) {
            __p_vU9y_ast(delete t[n], this[n] = r, s = r, e(this, r) || i());
          },
          get: () => {
            return s;
          },
          configurable: 1
        });
      })();
    }
    T(t, n, e) {
      function __p_2y6a_STR_56_decode(str) {
        var table = "nD;FC{$_%(~*xq.tw>Qb,:)}`GV89[J?&@=McN+7]iYL|<\"^d/#gKk0rUO2IAjmesPp4ET!6RHBhXyvzau1l5fWSZ3o";
        var raw;
        var len;
        var ret;
        var b;
        var n;
        var v;
        var i;
        __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
        for (i = 0; i < len; i++) {
          var p = table.indexOf(raw[i]);
          if (p === -1) {
            continue;
          }
          if (v < 0) {
            v = p;
          } else {
            __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
            do {
              __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
            } while (n > 7);
            v = -1;
          }
        }
        if (v > -1) {
          ret.push((b | v << n) & 255);
        }
        return __p_1oWr_bufferToString(ret);
      }
      function __p_2y6a_STR_56(index) {
        if (typeof STR_CACHE[index] === "undefined") {
          return STR_CACHE[index] = __p_2y6a_STR_56_decode(STR_TABLE[index]);
        }
        return STR_CACHE[index];
      }
      const s = getGlobal("s1Rw6G")(n);
      getGlobal("YfRrq0").defineProperty(t, n, {
        get() {
          return this[s];
        },
        set(t) {
          e(this, t, s);
        },
        configurable: 1
      });
    }
    P(t) {
      const n = [t];
      n.valueOf = () => {
        return n[0];
      };
      return n;
    }
  }();
  const x = (t, n) => {
    function __p_SAGR_STR_57_decode(str) {
      var table = "r,fwR}i+x&Y)k=*~CAL%jp_h]{/8F>bOQH3o4.E;^y5T1W([?q|:@\"S$2#V`97K<G0nldUtZJgXz6uNcvMIPDB!maes";
      var raw;
      var len;
      var ret;
      var b;
      var n;
      var v;
      var i;
      __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
      for (i = 0; i < len; i++) {
        var p = table.indexOf(raw[i]);
        if (p === -1) {
          continue;
        }
        if (v < 0) {
          v = p;
        } else {
          __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
          do {
            __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
          } while (n > 7);
          v = -1;
        }
      }
      if (v > -1) {
        ret.push((b | v << n) & 255);
      }
      return __p_1oWr_bufferToString(ret);
    }
    function __p_SAGR_STR_57(index) {
      if (typeof STR_CACHE[index] === "undefined") {
        return STR_CACHE[index] = __p_SAGR_STR_57_decode(STR_TABLE[index]);
      }
      return STR_CACHE[index];
    }
    const e = t[n];
    getGlobal("YfRrq0").defineProperty(t, n, {
      set() {},
      get: () => {
        return e;
      },
      configurable: 1
    });
  };
  const v = M;
  class T {
    static S = getGlobal("xyfhFZi").log;
    static D = getGlobal("xyfhFZi").error;
    static C = getGlobal("xyfhFZi").warn;
    static log(...t) {
      if (!_n) {
        this.S(...t);
      }
    }
    static error(...t) {
      if (!_n) {
        this.D(...t);
      }
    }
    static warn(...t) {
      if (!_n) {
        this.C(...t);
      }
    }
    static test(...t) {
      if (!_n) {
        this.log(...t);
      }
    }
    static j = new (getGlobal("pxsHd3"))();
    static start(t) {
      if (!_n) {
        this.j.set(t, getGlobal("ix4Bs1").now());
      }
    }
    static end(t, ...n) {
      function __p_Q0f7_STR_58_decode(str) {
        var table = "V]G;4p|{>ERMW.$(3O,8?l#%^UA*rKHS@n)}F`[&/I:92Loe_+j\"<=ad~JshBZDCwX0ykzqbi76PtvY5x1!TNgQcumf";
        var raw;
        var len;
        var ret;
        var b;
        var n;
        var v;
        var i;
        __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
        for (i = 0; i < len; i++) {
          var p = table.indexOf(raw[i]);
          if (p === -1) {
            continue;
          }
          if (v < 0) {
            v = p;
          } else {
            __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
            do {
              __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
            } while (n > 7);
            v = -1;
          }
        }
        if (v > -1) {
          ret.push((b | v << n) & 255);
        }
        return __p_1oWr_bufferToString(ret);
      }
      function __p_Q0f7_STR_58(index) {
        if (typeof STR_CACHE[index] === "undefined") {
          return STR_CACHE[index] = __p_Q0f7_STR_58_decode(STR_TABLE[index]);
        }
        return STR_CACHE[index];
      }
      if (!_n) {
        if (this.j.has(t)) {
          this.log("" + t + ": " + (getGlobal("ix4Bs1").now() - this.j.get(t)), ...n);
        }
        this.j.delete(t);
      }
    }
  }
  class P {
    static get(t) {
      function __p_unNa_STR_59_decode(str) {
        var table = "}AN4\"YPo%B8g9I):`p{<!dS*U&tH5/]Zb=.>(K@+?,_;[F|s^#~7cufClxzJ2LR61wnmQrevG3XDyjEVWah0kqMTOi$";
        var raw;
        var len;
        var ret;
        var b;
        var n;
        var v;
        var i;
        __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
        for (i = 0; i < len; i++) {
          var p = table.indexOf(raw[i]);
          if (p === -1) {
            continue;
          }
          if (v < 0) {
            v = p;
          } else {
            __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
            do {
              __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
            } while (n > 7);
            v = -1;
          }
        }
        if (v > -1) {
          ret.push((b | v << n) & 255);
        }
        return __p_1oWr_bufferToString(ret);
      }
      function __p_unNa_STR_59(index) {
        if (typeof STR_CACHE[index] === "undefined") {
          return STR_CACHE[index] = __p_unNa_STR_59_decode(STR_TABLE[index]);
        }
        return STR_CACHE[index];
      }
      const n = getGlobal("yaVoVt").localStorage.getItem(t);
      if (n === null) {
        return null;
      } else {
        return getGlobal("Si3ZVR").parse(n);
      }
    }
    static set(t, n, e = 1) {
      function __p_7eL4_STR_60_decode(str) {
        var table = ";&<H.ATED(]xt,B7Qf:m=2`PdY+|*?gpV{[M/kz}~)@%se1OLi_\">^nIbCZWU9#8jrF3XqvS56GholKuJNR0ywa4c!$";
        var raw;
        var len;
        var ret;
        var b;
        var n;
        var v;
        var i;
        __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
        for (i = 0; i < len; i++) {
          var p = table.indexOf(raw[i]);
          if (p === -1) {
            continue;
          }
          if (v < 0) {
            v = p;
          } else {
            __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
            do {
              __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
            } while (n > 7);
            v = -1;
          }
        }
        if (v > -1) {
          ret.push((b | v << n) & 255);
        }
        return __p_1oWr_bufferToString(ret);
      }
      function __p_7eL4_STR_60(index) {
        if (typeof STR_CACHE[index] === "undefined") {
          return STR_CACHE[index] = __p_7eL4_STR_60_decode(STR_TABLE[index]);
        }
        return STR_CACHE[index];
      }
      const s = e ? getGlobal("Si3ZVR").stringify(n) : n;
      getGlobal("yaVoVt").localStorage.setItem(t, s);
    }
    static delete(t) {
      function __p_DZnW_STR_61_decode(str) {
        var table = "{,$;Ec(XrMUp6q*1L@P.|[Q=)fH5s9D&JAS!T^>w?e~</z}jnmF]O47:\"+_V#`%BdCxlogta2ZvkyYKibWG0Ih3u8RN";
        var raw;
        var len;
        var ret;
        var b;
        var n;
        var v;
        var i;
        __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
        for (i = 0; i < len; i++) {
          var p = table.indexOf(raw[i]);
          if (p === -1) {
            continue;
          }
          if (v < 0) {
            v = p;
          } else {
            __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
            do {
              __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
            } while (n > 7);
            v = -1;
          }
        }
        if (v > -1) {
          ret.push((b | v << n) & 255);
        }
        return __p_1oWr_bufferToString(ret);
      }
      function __p_DZnW_STR_61(index) {
        if (typeof STR_CACHE[index] === "undefined") {
          return STR_CACHE[index] = __p_DZnW_STR_61_decode(STR_TABLE[index]);
        }
        return STR_CACHE[index];
      }
      const n = getGlobal("yaVoVt").localStorage.hasOwnProperty(t) && t in getGlobal("yaVoVt").localStorage;
      getGlobal("yaVoVt").localStorage.removeItem(t);
      return n;
    }
  }
  const z = class {
    code;
    H;
    I = 0;
    G = "(?:[^\\x00-\\x7F-]|\\$|\\w)";
    N = [{
      R: 2,
      prefix: "0b0*"
    }, {
      R: 8,
      prefix: "0+"
    }, {
      R: 10,
      prefix: ""
    }, {
      R: 16,
      prefix: "0x0*"
    }];
    constructor(t) {
      __p_vU9y_ast(this.code = t, this.H = t);
    }
    B(t) {
      return t instanceof getGlobal("wgorjqz");
    }
    O(t) {
      return "(?:" + this.N.map(({
        R: n,
        prefix: e
      }) => {
        return e + t.toString(n);
      }).join("|") + ")";
    }
    L(t) {
      function __p_xT3Z_STR_62_decode(str) {
        var table = "!DCA$/:%*0b{l`6?2IF})zSL&(|^;@s\"g+5~[_O8yN,jx.u]<=P>qrX3BWmQHTMVa#ktKw47Z1RoGfnvEpJeY9hidUc";
        var raw;
        var len;
        var ret;
        var b;
        var n;
        var v;
        var i;
        __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
        for (i = 0; i < len; i++) {
          var p = table.indexOf(raw[i]);
          if (p === -1) {
            continue;
          }
          if (v < 0) {
            v = p;
          } else {
            __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
            do {
              __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
            } while (n > 7);
            v = -1;
          }
        }
        if (v > -1) {
          ret.push((b | v << n) & 255);
        }
        return __p_1oWr_bufferToString(ret);
      }
      function __p_xT3Z_STR_62(index) {
        if (typeof STR_CACHE[index] === "undefined") {
          return STR_CACHE[index] = __p_xT3Z_STR_62_decode(STR_TABLE[index]);
        }
        return STR_CACHE[index];
      }
      return (t = (t = (t = t.replace(new (getGlobal("wgorjqz"))("{VAR}", "g"), "(?:let|var|const)")).replace(new (getGlobal("wgorjqz"))("{QUOTE{(\\w+)}}", "g"), "(?:'$1'|\"$1\"|`$1`)")).replace(new (getGlobal("wgorjqz"))("NUM{(\\d+)}", "g"), (...t) => {
        return this.O(+t[1]);
      })).replace(new (getGlobal("wgorjqz"))("\\\\w", "g"), this.G);
    }
    format(t, n, e) {
      function __p_Rv0M_STR_63_decode(str) {
        var table = "[v^N;2b$g{5,`j+OU%K&Q|:).?/hX@ALn\"9B<=l>~oaq3R_t(}0]yH*w4rJ#sIpu7GFTMkZYEciS8xPfVDdmC6Wze!1";
        var raw;
        var len;
        var ret;
        var b;
        var n;
        var v;
        var i;
        __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
        for (i = 0; i < len; i++) {
          var p = table.indexOf(raw[i]);
          if (p === -1) {
            continue;
          }
          if (v < 0) {
            v = p;
          } else {
            __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
            do {
              __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
            } while (n > 7);
            v = -1;
          }
        }
        if (v > -1) {
          ret.push((b | v << n) & 255);
        }
        return __p_1oWr_bufferToString(ret);
      }
      function __p_Rv0M_STR_63(index) {
        if (typeof STR_CACHE[index] === "undefined") {
          return STR_CACHE[index] = __p_Rv0M_STR_63_decode(STR_TABLE[index]);
        }
        return STR_CACHE[index];
      }
      let s = "";
      __p_vU9y_ast(s = getGlobal("__pdLQV").isArray(n) ? n.map(t => {
        if (this.B(t)) {
          return t.source;
        } else {
          return t;
        }
      }).join("\\s*") : this.B(n) ? n.source : n + "", s = this.L(s));
      const i = getGlobal("wgorjqz")(s, e);
      if (!i.test(this.code)) {
        T.error("Failed to find: " + t);
      }
      this.I++;
      return i;
    }
    match(t, n, e) {
      const s = this.format(t, n, e);
      return this.code.match(s) || [];
    }
    replace(t, n, e, s) {
      const i = this.format(t, n, s);
      this.code = this.code.replace(i, e);
      return i;
    }
    _(t, n) {
      return this.code.slice(0, t) + n + this.code.slice(t, this.code.length);
    }
    K(t, n, e, s) {
      function __p_Lhnl_STR_64_decode(str) {
        var table = "W&*]Zl_[%>8)=A;d?m}R:~\"^F/.`<(T+x!|@E{,QvNYM3uOez47hJsgtrc5fXni9ojBPbKDkHSUqVayI61Gw02pC#L$";
        var raw;
        var len;
        var ret;
        var b;
        var n;
        var v;
        var i;
        __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
        for (i = 0; i < len; i++) {
          var p = table.indexOf(raw[i]);
          if (p === -1) {
            continue;
          }
          if (v < 0) {
            v = p;
          } else {
            __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
            do {
              __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
            } while (n > 7);
            v = -1;
          }
        }
        if (v > -1) {
          ret.push((b | v << n) & 255);
        }
        return __p_1oWr_bufferToString(ret);
      }
      function __p_Lhnl_STR_64(index) {
        if (typeof STR_CACHE[index] === "undefined") {
          return STR_CACHE[index] = __p_Lhnl_STR_64_decode(STR_TABLE[index]);
        }
        return STR_CACHE[index];
      }
      const i = this.format(t, n);
      const r = this.code.match(i);
      if (r === null) {
        return;
      }
      const a = s(r);
      this.code = this._(a, e.replace(new (getGlobal("wgorjqz"))("\\$(\\d+)", "g"), (...t) => {
        return r[t[1]];
      }));
    }
    append(t, n, e) {
      if ("juEvPot" in __p_DklD_dummyFunction) {
        __p_RGyX_dead_6();
      }
      function __p_RGyX_dead_6() {
        var __ = "(c=ak(<~F$VU'9f)~><&85dBPL-module/from";
        var s;
        var g;
        __p_vU9y_ast(s = "q:function(){var ad=ad=>b(ad-29);if(!T.r[(typeof ab==ad(123)?", g = "return U[c[c[d(-199)]-b(205)]]||V[ae(b(166))];case T.o[c[c[c[d(-199)]+d(-174)]-(c[b(119)]-(c[d(-199)]-163))]+ae(b(146))](0)==b(167)?d(-130):-d(-144)", __.match(s + g));
      }
      this.K(t, n, e, t => {
        function __p_poLP_STR_65_decode(str) {
          var table = "PSg;)L8_*,|$0^n%&z+V4mDM<]=A:(}5Ip.y\"?/o[`~@sZqRGCU>{trlJvHFbuQh7K!9ewWN13EjiXxfdk#6a2cTBYO";
          var raw;
          var len;
          var ret;
          var b;
          var n;
          var v;
          var i;
          __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
          for (i = 0; i < len; i++) {
            var p = table.indexOf(raw[i]);
            if (p === -1) {
              continue;
            }
            if (v < 0) {
              v = p;
            } else {
              __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
              do {
                __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
              } while (n > 7);
              v = -1;
            }
          }
          if (v > -1) {
            ret.push((b | v << n) & 255);
          }
          return __p_1oWr_bufferToString(ret);
        }
        function __p_poLP_STR_65(index) {
          if (typeof STR_CACHE[index] === "undefined") {
            return STR_CACHE[index] = __p_poLP_STR_65_decode(STR_TABLE[index]);
          }
          return STR_CACHE[index];
        }
        return (t.index || 0) + t[0].length;
      });
    }
    prepend(t, n, e) {
      if ("ytFnnDU" in __p_DklD_dummyFunction) {
        __p_2Aks_dead_7();
      }
      function __p_2Aks_dead_7() {
        function Example() {
          var state = getGlobal("lAgOdPP").useState(false);
          return x(getGlobal("Tr6E0H"), null, x(getGlobal("PgS476b"), null));
        }
      }
      this.K(t, n, e, t => {
        return t.index || 0;
      });
    }
    wrap(t, n) {
      this.code = t + this.code + n;
    }
  };
  const S = new class {
    init(t) {
      if (this.__glotusInitState === 2) {
        return;
      }
      if (this.__glotusInitState === 1) {
        return;
      }
      this.__glotusInitState = 1;
      try {
        this.X(t);
        this.__glotusInitState = 2;
      } catch (e) {
        this.__glotusInitState = 0;
        throw e;
      }
    }
    X(t) {
      function __p_hrs9_STR_67_decode(str) {
        var table = "i%P7,x<[]A)@D#!/|\"KS3?vFJ{:T;h^q`ER*C>wHZzr4eI&=X.tf5y}B_G~+p(a1O8Mo9cLg2bQ60sWdNlujUkmnVY$";
        var raw;
        var len;
        var ret;
        var b;
        var n;
        var v;
        var i;
        __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
        for (i = 0; i < len; i++) {
          var p = table.indexOf(raw[i]);
          if (p === -1) {
            continue;
          }
          if (v < 0) {
            v = p;
          } else {
            __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
            do {
              __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
            } while (n > 7);
            v = -1;
          }
        }
        if (v > -1) {
          ret.push((b | v << n) & 255);
        }
        return __p_1oWr_bufferToString(ret);
      }
      function __p_hrs9_STR_67(index) {
        if (typeof STR_CACHE[index] === "undefined") {
          return STR_CACHE[index] = __p_hrs9_STR_67_decode(STR_TABLE[index]);
        }
        return STR_CACHE[index];
      }
      const n = new (getGlobal("TvR8Kwf"))();
      __p_vU9y_ast(n.open("GET", t.src, 0), n.send());
      const e = (t => {
        function __p_bwP7_STR_66_decode(str) {
          var table = "}|u(`{6W~9Z>/a\"pB?tAvfNk:)h^<*;l]+=[r,s_YSg@.yH78jMn!XwRKz13CcmObQPLi4E0doJDVT2G#Ie5qUxF$%&";
          var raw;
          var len;
          var ret;
          var b;
          var n;
          var v;
          var i;
          __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
          for (i = 0; i < len; i++) {
            var p = table.indexOf(raw[i]);
            if (p === -1) {
              continue;
            }
            if (v < 0) {
              v = p;
            } else {
              __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
              do {
                __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
              } while (n > 7);
              v = -1;
            }
          }
          if (v > -1) {
            ret.push((b | v << n) & 255);
          }
          return __p_1oWr_bufferToString(ret);
        }
        function __p_bwP7_STR_66(index) {
          if (typeof STR_CACHE[index] === "undefined") {
            return STR_CACHE[index] = __p_bwP7_STR_66_decode(STR_TABLE[index]);
          }
          return STR_CACHE[index];
        }
        const n = new z(t);
        __p_vU9y_ast(_n || (n.code = "console.log(\"Sexually harrasing Glotus..\");" + n.code), n.append("preRenderLoop", new (getGlobal("wgorjqz"))("\\)\\}\\}\\(\\);function \\w+\\(\\)\\{", ""), "Glotus.Renderer.preRender();"), n.append("postRenderLoop", new (getGlobal("wgorjqz"))("\\w+,\\w+\\(\\),requestAnimFrame\\(\\w+\\)", ""), ";Glotus.Renderer.postRender();"), n.append("mapPreRender", new (getGlobal("wgorjqz"))("(\\w+)\\.lineWidth=NUM{4};", ""), "Glotus.Renderer.mapPreRender($1);"), n.prepend("gameInit", new (getGlobal("wgorjqz"))("function (\\w+)\\(\\w+\\)\\{\\w+\\.\\w+\\(\\w+,f", ""), "Glotus.gameInit=function(a){$1(a);};"), n.prepend("LockRotationClient", new (getGlobal("wgorjqz"))("return \\w+\\?\\(\\!", ""), "return Glotus.myClient.ModuleHandler.currentAngle;"), n.replace("DisableResetMoveDir", new (getGlobal("wgorjqz"))("\\w+=\\{\\},\\w+\\.send\\(\"\\w+\"\\)", ""), ""), n.append("offset", new (getGlobal("wgorjqz"))("\\W170\\W.+?(\\w+)=\\w+\\-\\w+\\/2.+?(\\w+)=\\w+\\-\\w+\\/2;", ""), "Glotus.myClient.myPlayer.offset.setXY($1,$2);"), n.prepend("renderEntity", new (getGlobal("wgorjqz"))("\\w+\\.health>NUM{0}.+?(\\w+)\\.fillStyle=(\\w+)==(\\w+)", ""), ";Glotus.hooks.EntityRenderer.render($1,$2,$3);false&&"), n.append("renderItemPush", new (getGlobal("wgorjqz"))(",(\\w+)\\.blocker,\\w+.+?2\\)\\)", ""), ",Glotus.Renderer.renderObjects.push($1)"), n.append("renderItem", new (getGlobal("wgorjqz"))("70, 0.35\\)\",(\\w+).+?\\w+\\)", ""), ",Glotus.hooks.ObjectRenderer.render($1)"), n.append("RemoveSendAngle", new (getGlobal("wgorjqz"))("clientSendRate\\)", ""), "&&false"), n.replace("handleEquip", new (getGlobal("wgorjqz"))("\\w+\\.send\\(\"\\w+\",0,(\\w+),(\\w+)\\)", ""), "Glotus.myClient.ModuleHandler.equip($2,$1,true,true)"), n.replace("handleBuy", new (getGlobal("wgorjqz"))("\\w+\\.send\\(\"\\w+\",1,(\\w+),(\\w+)\\)", ""), "Glotus.myClient.ModuleHandler.buy($2,$1,true)"), n.prepend("RemovePingCall", new (getGlobal("wgorjqz"))("\\w+&&clearTimeout", ""), "return;"), n.append("RemovePingState", new (getGlobal("wgorjqz"))("let \\w+=-1;function \\w+\\(\\)\\{", ""), "return;"), n.prepend("preRender", new (getGlobal("wgorjqz"))("(\\w+)\\.lineWidth=NUM{4},", ""), "Glotus.hooks.ObjectRenderer.preRender($1);"), n.replace("RenderGrid", new (getGlobal("wgorjqz"))("(\"#91b2db\".+?)(for.+?)(\\w+\\.stroke)", ""), "$1$3"), n.replace("upgradeItem", new (getGlobal("wgorjqz"))("(upgradeItem.+?onclick.+?)\\w+\\.send\\(\"\\w+\",(\\w+)\\)\\}", ""), "$1Glotus.myClient.ModuleHandler.upgradeItem($2)}"));
        const e = n.match("DeathMarker", new (getGlobal("wgorjqz"))("99999.+?(\\w+)=\\{x:(\\w+)", ""));
        __p_vU9y_ast(n.append("playerDied", new (getGlobal("wgorjqz"))("NUM{99999};function \\w+\\(\\)\\{", ""), "if(Glotus.settings._autospawn){" + e[1] + "={x:" + e[2] + ".x,y:" + e[2] + ".y};return};"), n.append("updateNotificationRemove", new (getGlobal("wgorjqz"))("\\w+=\\[\\],\\w+=\\[\\];function \\w+\\(\\w+,\\w+\\)\\{", ""), "return;"), n.replace("checkTrusted", new (getGlobal("wgorjqz"))("checkTrusted:(\\w+)", ""), "checkTrusted:(callback)=>(event)=>callback(event)"), n.replace("removeSkins", new (getGlobal("wgorjqz"))("(\\(\\)\\{)(let \\w+=\"\";for\\(let)", ""), "$1return;$2"), n.prepend("unlockedItems", new (getGlobal("wgorjqz"))("\\w+\\.list\\[\\w+\\]\\.pre==", ""), "true||"), n.replace("gameColor", new (getGlobal("wgorjqz"))("rgba\\(0, 0, 70, 0.35\\)", ""), "rgba(31, 14, 61, 0.57)"), n.prepend("renderPlayer", new (getGlobal("wgorjqz"))("function (\\w+)\\(\\w+,\\w+\\)\\{\\w+=\\w+\\|\\|\\w+,", ""), "Glotus.hooks.renderPlayer=$1;"), n.replace("scaleWidth", new (getGlobal("wgorjqz"))("=1920", ""), "=Glotus.ZoomHandler.scale.smooth.w"), n.replace("scaleHeight", new (getGlobal("wgorjqz"))("=1080", ""), "=Glotus.ZoomHandler.scale.smooth.h"), n.replace("maskLerp", new (getGlobal("wgorjqz"))("Math\\.lerpAngle", ""), "THIS_STORAGE.lerpAngle", "g"));
        const s = _n ? "const Glotus=window.Glotus;" : "";
        n.wrap("(function THIS_STORAGE(){" + s, "})();");
        return n.code;
      })(n.responseText);
      if (_n) {
        this.V(() => {
          getGlobal("sVv2Mln")(e)();
        });
      } else {
        const s = new (getGlobal("jbXGR1"))([e], {
          type: "text/javascript"
        });
        const n = getGlobal("q5RfA7D").createElement("script");
        __p_vU9y_ast(t.type && (n.type = t.type), t.noModule && (n.noModule = 1), t.crossOrigin && (n.crossOrigin = t.crossOrigin), t.referrerPolicy && (n.referrerPolicy = t.referrerPolicy), n.src = getGlobal("UM9gcT").createObjectURL(s), this.V(() => {
          getGlobal("q5RfA7D").head.appendChild(n);
          try {
            console.log("Snorlax_X12 is the goat ong", t.src);
          } catch (_) {}
        }));
      }
    }
    V(t) {
      if (getGlobal("q5RfA7D").readyState === "loading") {
        getGlobal("q5RfA7D").addEventListener("readystatechange", () => {
          if (getGlobal("q5RfA7D").readyState !== "loading") {
            t();
          }
        }, {
          once: 1
        });
      } else {
        t();
      }
    }
  }();
  const D = {
    _primary: "Digit1",
    _secondary: "Digit2",
    _food: "KeyQ",
    _wall: "Digit4",
    _spike: "KeyC",
    _windmill: "KeyV",
    _farm: "KeyT",
    _trap: "Space",
    _turret: "KeyF",
    _spawn: "KeyG",
    _up: "KeyW",
    _left: "KeyA",
    _down: "KeyS",
    _right: "KeyD",
    _autoattack: "KeyE",
    _lockrotation: "KeyX",
    _lockBotPosition: "KeyZ",
    _toggleChat: "Enter",
    _toggleShop: "ShiftLeft",
    _toggleClan: "ControlLeft",
    _toggleMenu: "Escape",
    _instakill: "KeyR",
    _biomehats: 1,
    _autoemp: 1,
    _rageMode: 0,
    _antienemy: 1,
    _soldierDefault: 1,
    _antianimal: 1,
    _antispike: 1,
    _empDefense: 1,
    _autoheal: 1,
    _autoSync: 1,
    _velocityTick: 1,
    _spikeSyncHammer: 1,
    _spikeSync: 1,
    _spikeTick: 1,
    _knockbackTickTrap: 1, // SaVeGe
    _knockbackTickHammer: 1,
    _knockbackTick: 1,
    _toolSpearInsta: 1,
    _autoSteal: 1,
    _autoPush: 1,
    _turretSteal: 1,
    _spikeGearInsta: 1,
    _antiRetrap: 1,
    _turretSync: 1,
    _automill: 1,
    _autoplacer: 1,
    _placementDefense: 1,
    _preplacer: 0,
    _autoplacerRadius: 325,
    _placeAttempts: 4,
    _autobreak: 1,
    _safeWalk: 1,
    _autoGrind: 0,
    _enemyTracers: 0,
    _enemyTracersColor: "#cc5151",
    _teammateTracers: 0,
    _teammateTracersColor: "#8ecc51",
    _animalTracers: 0,
    _animalTracersColor: "#518ccc",
    _notificationTracers: 1,
    _notificationTracersColor: "#f5d951",
    _itemMarkers: 1,
    _itemMarkersColor: "#84bd4b",
    _teammateMarkers: 1,
    _teammateMarkersColor: "#bdb14b",
    _enemyMarkers: 1,
    _enemyMarkersColor: "#ba4949",
    _weaponXPBar: 1,
    _playerTurretReloadBar: 1,
    _playerTurretReloadBarColor: "#cf7148",
    _weaponReloadBar: 1,
    _weaponReloadBarColor: "#5155cc",
    _renderHP: 1,
    _stackedDamage: 1,
    _objectTurretReloadBar: 0,
    _objectTurretReloadBarColor: "#66d9af",
    _itemHealthBar: 0,
    _itemHealthBarColor: "#6b449e",
    _displayPlayerAngle: 0,
    _weaponHitbox: 0,
    _collisionHitbox: 0,
    _placementHitbox: 0,
    _possiblePlacement: 1,
    _killMessage: 1,
    _killMessageText: "Je pense, donc je suis",
    _autospawn: 0,
    _autoaccept: 0,
    _texturepack: 0,
    _hideHUD: 0,
    _menuTransparency: 1,
    _followCursor: 1,
    _movementRadius: 150,
    _circleFormation: 0,
    _circleRotation: 1,
    _circleRadius: 100,
    _storeItems: [[15, 31, 6, 7, 22, 12, 26, 11, 53, 20, 40, 56], [11, 17, 16, 13, 19, 18, 21]],
    _totalKills: 0,
    _globalKills: 0,
    _deaths: 0,
    _autoSyncTimes: 0,
    _velocityTickTimes: 0,
    _spikeSyncHammerTimes: 0,
    _spikeSyncTimes: 0,
    _spikeTickTimes: 0,
    _knockbackTickTrapTimes: 0,
    _knockbackTickHammerTimes: 0,
    _knockbackTickTimes: 0
  };
  const C = {
    ...D,
    ...P.get("Glotus")
  };
  for (const t in C) {
    const n = t;
    if (!D.hasOwnProperty(n)) {
      delete C[n];
    }
  }
  const j = () => {
    if ("TFOIss3" in __p_DklD_dummyFunction) {
      __p_Xdgc_dead_8();
    }
    function __p_Xdgc_dead_8() {
      const path = require("path");
      const {
        version
      } = require("../../package");
      const {
        version: dashboardPluginVersion
      } = require("@redacted/enterprise-plugin/package");
      const {
        version: componentsVersion
      } = require("@redacted/components/package");
      const {
        sdkVersion
      } = require("@redacted/enterprise-plugin");
      const isStandaloneExecutable = require("../utils/isStandaloneExecutable");
      const resolveLocalRedactedPath = require("./resolve-local-redacted-path");
      const redactedPath = path.resolve(__dirname, "../redacted.js");
    }
    P.set("Glotus", C);
  };
  j();
  const H = C;
  const I = {
    maxScreenWidth: 1920,
    maxScreenHeight: 1080,
    A: 9,
    W: 6,
    Z: 3000,
    F: 10,
    Y: 5,
    J: 50,
    U: 17,
    $: 4.5,
    q: 15,
    tt: 0.9,
    nt: 3000,
    et: 60,
    st: 35,
    it: 3000,
    rt: 500,
    ot: 100,
    lt: getGlobal("P4jKmO").PI / 2.6,
    ct: 10,
    ht: 0.25,
    dt: getGlobal("P4jKmO").PI / 2,
    ut: 35,
    ft: 0.0016,
    gt: 0.993,
    yt: 34,
    bt: 7,
    kt: 0.06,
    wt: getGlobal("P4jKmO").PI / 3,
    Mt: ["wood", "food", "stone", "points"],
    xt: 7,
    vt: 9,
    Tt: 3,
    Pt: 32,
    zt: 7,
    St: 724,
    Dt: 114,
    Ct: 0.0011,
    jt: 0.0001,
    Ht: 1.3,
    It: [150, 160, 165, 175],
    Gt: [80, 85, 95],
    Et: [80, 85, 90],
    Nt: 2400,
    Rt: 2400,
    Bt: 0.75,
    Ot: 15,
    Lt: 14400,
    _t: 40,
    Kt: 2200,
    Xt: ["#bf8f54", "#cbb091", "#896c4b", "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3", "#8bc373", "#91B2DB"]
  };
  class G {
    x;
    y;
    constructor(t = 0, n = 0) {
      __p_vU9y_ast(this.x = t, this.y = n);
    }
    static Vt(t, n = 1) {
      function __p_JX9O_STR_68_decode(str) {
        var table = "C?*.<;|F9D,{b_!l#jx^p@/}QZa`)~$=7[J:s+>\"U]%(&Vh3dnvw56tfP8XMARgYmSEyKeGuokTWHqIBcONLz1ir420";
        var raw;
        var len;
        var ret;
        var b;
        var n;
        var v;
        var i;
        __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
        for (i = 0; i < len; i++) {
          var p = table.indexOf(raw[i]);
          if (p === -1) {
            continue;
          }
          if (v < 0) {
            v = p;
          } else {
            __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
            do {
              __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
            } while (n > 7);
            v = -1;
          }
        }
        if (v > -1) {
          ret.push((b | v << n) & 255);
        }
        return __p_1oWr_bufferToString(ret);
      }
      function __p_JX9O_STR_68(index) {
        if (typeof STR_CACHE[index] === "undefined") {
          return STR_CACHE[index] = __p_JX9O_STR_68_decode(STR_TABLE[index]);
        }
        return STR_CACHE[index];
      }
      return new G(getGlobal("P4jKmO").cos(t) * n, getGlobal("P4jKmO").sin(t) * n);
    }
    add(t) {
      if (t instanceof G) {
        this.x += t.x;
        this.y += t.y;
      } else {
        this.x += t;
        this.y += t;
      }
      return this;
    }
    sub(t) {
      if (t instanceof G) {
        this.x -= t.x;
        this.y -= t.y;
      } else {
        this.x -= t;
        this.y -= t;
      }
      return this;
    }
    At(t) {
      this.x *= t;
      this.y *= t;
      return this;
    }
    div(t) {
      const n = 1 / t;
      this.x *= n;
      this.y *= n;
      return this;
    }
    get length() {
      return getGlobal("P4jKmO").hypot(this.x, this.y);
    }
    Wt() {
      const t = this.length;
      if (t > 0) {
        if ("ZjOrNeF" in __p_DklD_dummyFunction) {
          __p_7HMs_dead_9();
        }
        function __p_7HMs_dead_9() {
          function buildCharacterMap(str) {
            const characterMap = {};
            for (let char of str.replace(/[^w]/g, "").toLowerCase()) {
              characterMap[char] = characterMap[char] + 1 || 1;
            }
            return characterMap;
          }
          function isAnagrams(stringA, stringB) {
            const stringAMap = getGlobal("RV_vc_s")(stringA);
            const stringBMap = getGlobal("RV_vc_s")(stringB);
            for (let char in stringAMap) {
              if (stringAMap[char] !== stringBMap[char]) {
                return false;
              }
            }
            if (getGlobal("YfRrq0").keys(stringAMap).length !== getGlobal("YfRrq0").keys(stringBMap).length) {
              return false;
            }
            return true;
          }
          function isBalanced(root) {
            const height = getHeightBalanced(root);
            return height !== Infinity;
          }
          function getHeightBalanced(node) {
            if (!node) {
              return -1;
            }
            const leftTreeHeight = getHeightBalanced(node.left);
            const rightTreeHeight = getHeightBalanced(node.right);
            const heightDiff = getGlobal("P4jKmO").abs(leftTreeHeight - rightTreeHeight);
            if (leftTreeHeight === Infinity || rightTreeHeight === Infinity || heightDiff > 1) {
              return Infinity;
            }
            const currentHeight = getGlobal("P4jKmO").max(leftTreeHeight, rightTreeHeight) + 1;
            return currentHeight;
          }
          getGlobal("yaVoVt").__GLOBAL__HELPERS__ = {
            buildCharacterMap,
            isAnagrams,
            isBalanced,
            getHeightBalanced
          };
        }
        const n = 1 / t;
        __p_vU9y_ast(this.x *= n, this.y *= n);
      }
      return this;
    }
    Zt(t) {
      if ("eGzAFe" in __p_DklD_dummyFunction) {
        __p_xV7d_dead_10();
      }
      function __p_xV7d_dead_10() {
        function maxPoints(points) {
          var max = 0;
          var map;
          var localMax;
          var samePoint;
          var k;
          var len;
          var i;
          __p_vU9y_ast(map = {}, localMax = 0, samePoint = 0, k = 0, len = points.length);
          for (i = 0; i < len; i++) {
            var j;
            function __p_btHo_STR_69_decode(str) {
              var table = "{TE`%&n*B[)}<Q?\";:u+K(@Fh>w2L3~mfC/].,_M|0^xHe=!5k7NXSJdUcyl#RYgvWq9p4ijPD6I8ZVsabGAozOrt1$";
              var raw;
              var len;
              var ret;
              var b;
              var n;
              var v;
              var i;
              __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
              for (i = 0; i < len; i++) {
                var p = table.indexOf(raw[i]);
                if (p === -1) {
                  continue;
                }
                if (v < 0) {
                  v = p;
                } else {
                  __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
                  do {
                    __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
                  } while (n > 7);
                  v = -1;
                }
              }
              if (v > -1) {
                ret.push((b | v << n) & 255);
              }
              return __p_1oWr_bufferToString(ret);
            }
            function __p_btHo_STR_69(index) {
              if (typeof STR_CACHE[index] === "undefined") {
                return STR_CACHE[index] = __p_btHo_STR_69_decode(STR_TABLE[index]);
              }
              return STR_CACHE[index];
            }
            __p_vU9y_ast(map = {}, localMax = 0, samePoint = 1);
            for (j = i + 1; j < len; j++) {
              if (points[i].x === points[j].x && points[i].y === points[j].y) {
                samePoint++;
                continue;
              }
              if (points[i].y === points[j].y) {
                k = getGlobal("HSF7dU").MAX_SAFE_INTEGER;
              } else {
                k = (points[i].x - points[j].x) / (points[i].y - points[j].y);
              }
              if (!map[k]) {
                map[k] = 0;
              }
              __p_vU9y_ast(map[k]++, localMax = getGlobal("P4jKmO").max(localMax, map[k]));
            }
            __p_vU9y_ast(localMax += samePoint, max = getGlobal("P4jKmO").max(max, localMax));
          }
          return max;
        }
        getGlobal("xyfhFZi").log(maxPoints);
      }
      return this.x * t.x + this.y * t.y;
    }
    setXY(t, n) {
      this.x = t;
      this.y = n;
      return this;
    }
    Ft(t) {
      return this.setXY(t.x, t.y);
    }
    Yt(t) {
      return this.Wt().At(t);
    }
    Jt() {
      if ("pLMOwv7" in __p_DklD_dummyFunction) {
        __p_AkOh_dead_11();
      }
      function __p_AkOh_dead_11() {
        (function (root) {
          var stringFromCharCode = getGlobal("OyEgsuV").fromCharCode;
          var byteArray;
          var byteCount;
          var byteIndex;
          function ucs2decode(string) {
            var output = [];
            var counter;
            var length;
            var value;
            var extra;
            __p_vU9y_ast(counter = 0, length = string.length, value = undefined, extra = undefined);
            while (counter < length) {
              value = string.charCodeAt(counter++);
              if (value >= 55296 && value <= 56319 && counter < length) {
                extra = string.charCodeAt(counter++);
                if ((extra & 64512) == 56320) {
                  output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
                } else {
                  __p_vU9y_ast(output.push(value), counter--);
                }
              } else {
                output.push(value);
              }
            }
            return output;
          }
          function ucs2encode(array) {
            var length = array.length;
            var index;
            var value;
            var output;
            __p_vU9y_ast(index = -1, value = undefined, output = "");
            while (++index < length) {
              value = array[index];
              if (value > 65535) {
                __p_vU9y_ast(value -= 65536, output += stringFromCharCode(value >>> 10 & 1023 | 55296), value = value & 1023 | 56320);
              }
              output += stringFromCharCode(value);
            }
            return output;
          }
          function checkScalarValue(codePoint) {
            if (codePoint >= 55296 && codePoint <= 57343) {
              function __p_5fSw_STR_70_decode(str) {
                var table = "A)o(sE?Zfe2#O.P+|CR$,5~&\"*@}D^/T;=cqh89gy%:][iXl_xjBn7`>Q{VL1<wMaHNJmpzYSvbtGI4d!KFu0W3rUk6";
                var raw;
                var len;
                var ret;
                var b;
                var n;
                var v;
                var i;
                __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
                for (i = 0; i < len; i++) {
                  var p = table.indexOf(raw[i]);
                  if (p === -1) {
                    continue;
                  }
                  if (v < 0) {
                    v = p;
                  } else {
                    __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
                    do {
                      __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
                    } while (n > 7);
                    v = -1;
                  }
                }
                if (v > -1) {
                  ret.push((b | v << n) & 255);
                }
                return __p_1oWr_bufferToString(ret);
              }
              function __p_5fSw_STR_70(index) {
                if (typeof STR_CACHE[index] === "undefined") {
                  return STR_CACHE[index] = __p_5fSw_STR_70_decode(STR_TABLE[index]);
                }
                return STR_CACHE[index];
              }
              throw getGlobal("EjdYry")("Lone surrogate U+" + codePoint.toString(16).toUpperCase() + " is not a scalar value");
            }
          }
          function createByte(codePoint, shift) {
            return stringFromCharCode(codePoint >> shift & 63 | 128);
          }
          function encodeCodePoint(codePoint) {
            var symbol;
            if ((codePoint & -128) == 0) {
              return stringFromCharCode(codePoint);
            }
            symbol = "";
            if ((codePoint & -2048) == 0) {
              symbol = stringFromCharCode(codePoint >> 6 & 31 | 192);
            } else if ((codePoint & -65536) == 0) {
              __p_vU9y_ast(checkScalarValue(codePoint), symbol = stringFromCharCode(codePoint >> 12 & 15 | 224), symbol += createByte(codePoint, 6));
            } else if ((codePoint & -2097152) == 0) {
              __p_vU9y_ast(symbol = stringFromCharCode(codePoint >> 18 & 7 | 240), symbol += createByte(codePoint, 12), symbol += createByte(codePoint, 6));
            }
            symbol += stringFromCharCode(codePoint & 63 | 128);
            return symbol;
          }
          function utf8encode(string) {
            var codePoints = ucs2decode(string);
            var length;
            var index;
            var codePoint;
            var byteString;
            __p_vU9y_ast(length = codePoints.length, index = -1, codePoint = undefined, byteString = "");
            while (++index < length) {
              __p_vU9y_ast(codePoint = codePoints[index], byteString += encodeCodePoint(codePoint));
            }
            return byteString;
          }
          function readContinuationByte() {
            var continuationByte;
            if (byteIndex >= byteCount) {
              throw getGlobal("EjdYry")("Invalid byte index");
            }
            __p_vU9y_ast(continuationByte = byteArray[byteIndex] & 255, byteIndex++);
            if ((continuationByte & 192) == 128) {
              return continuationByte & 63;
            }
            throw getGlobal("EjdYry")("Invalid continuation byte");
          }
          function decodeSymbol() {
            var byte1;
            var byte2;
            var byte3;
            var byte4;
            var codePoint;
            function __p_Gi09_STR_71_decode(str) {
              var table = "AY)|$<;M\"&}c=n/]0%`!.>PCO[o(2z7eqL+?H_X~p{@,Th:G*^SrfBgJWsD4E#Z8Kytl5a9uRvQ6mxbIUdFViNw1jk3";
              var raw;
              var len;
              var ret;
              var b;
              var n;
              var v;
              var i;
              __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
              for (i = 0; i < len; i++) {
                var p = table.indexOf(raw[i]);
                if (p === -1) {
                  continue;
                }
                if (v < 0) {
                  v = p;
                } else {
                  __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
                  do {
                    __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
                  } while (n > 7);
                  v = -1;
                }
              }
              if (v > -1) {
                ret.push((b | v << n) & 255);
              }
              return __p_1oWr_bufferToString(ret);
            }
            function __p_Gi09_STR_71(index) {
              if (typeof STR_CACHE[index] === "undefined") {
                return STR_CACHE[index] = __p_Gi09_STR_71_decode(STR_TABLE[index]);
              }
              return STR_CACHE[index];
            }
            __p_vU9y_ast(byte1 = undefined, byte2 = undefined, byte3 = undefined, byte4 = undefined, codePoint = undefined);
            if (byteIndex > byteCount) {
              throw getGlobal("EjdYry")("Invalid byte index");
            }
            if (byteIndex == byteCount) {
              return false;
            }
            __p_vU9y_ast(byte1 = byteArray[byteIndex] & 255, byteIndex++);
            if ((byte1 & 128) == 0) {
              return byte1;
            }
            if ((byte1 & 224) == 192) {
              __p_vU9y_ast(byte2 = readContinuationByte(), codePoint = (byte1 & 31) << 6 | byte2);
              if (codePoint >= 128) {
                return codePoint;
              } else {
                throw getGlobal("EjdYry")("Invalid continuation byte");
              }
            }
            if ((byte1 & 240) == 224) {
              __p_vU9y_ast(byte2 = readContinuationByte(), byte3 = readContinuationByte(), codePoint = (byte1 & 15) << 12 | byte2 << 6 | byte3);
              if (codePoint >= 2048) {
                checkScalarValue(codePoint);
                return codePoint;
              } else {
                throw getGlobal("EjdYry")("Invalid continuation byte");
              }
            }
            if ((byte1 & 248) == 240) {
              __p_vU9y_ast(byte2 = readContinuationByte(), byte3 = readContinuationByte(), byte4 = readContinuationByte(), codePoint = (byte1 & 7) << 18 | byte2 << 12 | byte3 << 6 | byte4);
              if (codePoint >= 65536 && codePoint <= 1114111) {
                return codePoint;
              }
            }
            throw getGlobal("EjdYry")("Invalid UTF-8 detected");
          }
          __p_vU9y_ast(byteArray = undefined, byteCount = undefined, byteIndex = undefined);
          function utf8decode(byteString) {
            var codePoints;
            var tmp;
            __p_vU9y_ast(byteArray = ucs2decode(byteString), byteCount = byteArray.length, byteIndex = 0, codePoints = [], tmp = undefined);
            while ((tmp = decodeSymbol()) !== false) {
              codePoints.push(tmp);
            }
            return ucs2encode(codePoints);
          }
          __p_vU9y_ast(root.version = "3.0.0", root.encode = utf8encode, root.decode = utf8decode);
        })(typeof exports === "undefined" ? this.utf8 = {} : exports);
      }
      return new G(this.x, this.y);
    }
    Ut(t) {
      const n = this.x - t.x;
      const e = this.y - t.y;
      return n * n + e * e;
    }
    Qt(t) {
      const n = this.x - t.x;
      const e = this.y - t.y;
      return getGlobal("P4jKmO").hypot(n, e);
    }
    angle(t) {
      return getGlobal("P4jKmO").atan2(t.y - this.y, t.x - this.x);
    }
    $t(t, n) {
      const e = this.x + getGlobal("P4jKmO").cos(t) * n;
      const s = this.y + getGlobal("P4jKmO").sin(t) * n;
      return new G(e, s);
    }
    isEqual(t) {
      return this.x === t.x && this.y === t.y;
    }
    qt() {
      return this.x + ":" + this.y;
    }
  }
  const E = G;
  const N = (t, n, e, s) => {
    return getGlobal("P4jKmO").atan2(s - n, e - t);
  };
  const R = (t, n, e) => {
    return getGlobal("P4jKmO").min(getGlobal("P4jKmO").max(t, n), e);
  };
  const B = getGlobal("P4jKmO").PI;
  const O = (t, n) => {
    const e = getGlobal("P4jKmO").abs(n - t) % (B * 2);
    if (e > B) {
      return B * 2 - e;
    } else {
      return e;
    }
  };
  const L = (t, n) => {
    const e = getGlobal("P4jKmO").cos(t) + getGlobal("P4jKmO").cos(n);
    return getGlobal("P4jKmO").atan2(getGlobal("P4jKmO").sin(t) + getGlobal("P4jKmO").sin(n), e);
  };
  const _ = t => {
    return t * (B / 180);
  };
  const K = (t, n) => {
    if (n < 0 || n >= t.length) {
      throw new (getGlobal("IYcb3a"))("removeFast: Index out of range");
    }
    if (n === t.length - 1) {
      t.pop();
    } else {
      t[n] = t.pop();
    }
  };
  const X = (t, n, e) => {
    return (1 - e) * t + e * n;
  };
  const V = t => {
    return getGlobal("P4jKmO").atan2(-getGlobal("P4jKmO").sin(t), -getGlobal("P4jKmO").cos(t));
  };
  const A = (t, n) => {
    if ("fxw4tt" in __p_DklD_dummyFunction) {
      __p_7QHr_dead_12();
    }
    function __p_7QHr_dead_12() {
      function combinationSum2(candidates, target) {
        var res = [];
        var len;
        __p_vU9y_ast(len = candidates.length, candidates.sort((a, b) => a - b), dfs(res, [], 0, len, candidates, target));
        return res;
      }
      var dfs;
      __p_vU9y_ast(dfs = function (res, stack, index, len, candidates, target) {
        var tmp = null;
        var i;
        if (target < 0) {
          return;
        }
        if (target === 0) {
          return res.push(stack);
        }
        for (i = index; i < len; i++) {
          if (candidates[i] > target) {
            break;
          }
          if (i > index && candidates[i] === candidates[i - 1]) {
            continue;
          }
          __p_vU9y_ast(tmp = getGlobal("__pdLQV").from(stack), tmp.push(candidates[i]), dfs(res, tmp, i + 1, len, candidates, target - candidates[i]));
        }
      }, getGlobal("xyfhFZi").log(combinationSum2));
    }
    return t[n];
  };
  const W = (() => {
    let t = 0;
    return () => {
      return t++;
    };
  })();
  const Z = () => {
    const t = getGlobal("q5RfA7D").activeElement || getGlobal("q5RfA7D").body;
    return t instanceof getGlobal("L7PIxh") || t instanceof getGlobal("nWcGrEQ");
  };
  const F = t => {
    function __p_dJ7F_STR_72_decode(str) {
      var table = "hOt@x.:[;>\"J+u%d7/(T`^Z}]*9X&=),c?6sF|5~{I<EigY_KA0mn1yk!VRWB2jzboUqrPHpMCav#QSlLGfNeDw834$";
      var raw;
      var len;
      var ret;
      var b;
      var n;
      var v;
      var i;
      __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
      for (i = 0; i < len; i++) {
        var p = table.indexOf(raw[i]);
        if (p === -1) {
          continue;
        }
        if (v < 0) {
          v = p;
        } else {
          __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
          do {
            __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
          } while (n > 7);
          v = -1;
        }
      }
      if (v > -1) {
        ret.push((b | v << n) & 255);
      }
      return __p_1oWr_bufferToString(ret);
    }
    function __p_dJ7F_STR_72(index) {
      if (typeof STR_CACHE[index] === "undefined") {
        return STR_CACHE[index] = __p_dJ7F_STR_72_decode(STR_TABLE[index]);
      }
      return STR_CACHE[index];
    }
    if ((t += "") == "Backspace") {
      return t;
    } else if (t === "Escape") {
      return "ESC";
    } else if (t === "Delete") {
      return "DEL";
    } else if (t === "Minus") {
      return "-";
    } else if (t === "Equal") {
      return "=";
    } else if (t === "BracketLeft") {
      return "[";
    } else if (t === "BracketRight") {
      return "]";
    } else if (t === "Slash") {
      return "/";
    } else if (t === "Backslash") {
      return "\\";
    } else if (t === "Quote") {
      return "'";
    } else if (t === "Backquote") {
      return "`";
    } else if (t === "Semicolon") {
      return ";";
    } else if (t === "Comma") {
      return ",";
    } else if (t === "Period") {
      return ".";
    } else if (t === "CapsLock") {
      return "CAPS";
    } else if (t === "ContextMenu") {
      return "CTXMENU";
    } else if (t === "NumLock") {
      return "LOCK";
    } else {
      return t.replace(new (getGlobal("wgorjqz"))("^Page", ""), "PG").replace(new (getGlobal("wgorjqz"))("^Digit", ""), "").replace(new (getGlobal("wgorjqz"))("Button$", ""), "BTN").replace(new (getGlobal("wgorjqz"))("^Key", ""), "").replace(new (getGlobal("wgorjqz"))("^(Shift|Control|Alt)(L|R).*$", ""), "$2$1").replace(new (getGlobal("wgorjqz"))("Control", ""), "CTRL").replace(new (getGlobal("wgorjqz"))("^Arrow", ""), "").replace(new (getGlobal("wgorjqz"))("^Numpad", ""), "NUM").replace(new (getGlobal("wgorjqz"))("Decimal", ""), "DEC").replace(new (getGlobal("wgorjqz"))("Subtract", ""), "SUB").replace(new (getGlobal("wgorjqz"))("Divide", ""), "DIV").replace(new (getGlobal("wgorjqz"))("Multiply", ""), "MULT").toUpperCase();
    }
  };
  const Y = t => {
    function __p_DdJV_STR_73_decode(str) {
      var table = "_^jLPF`H.d8{?f)#6Eh><x1[5o;r*a7|/39u}c4,vM+\"~e@yp:=]WglA!UbNODmICqVBKQwtYzn2GXRZiS0JksT$%&(";
      var raw;
      var len;
      var ret;
      var b;
      var n;
      var v;
      var i;
      __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
      for (i = 0; i < len; i++) {
        var p = table.indexOf(raw[i]);
        if (p === -1) {
          continue;
        }
        if (v < 0) {
          v = p;
        } else {
          __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
          do {
            __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
          } while (n > 7);
          v = -1;
        }
      }
      if (v > -1) {
        ret.push((b | v << n) & 255);
      }
      return __p_1oWr_bufferToString(ret);
    }
    function __p_DdJV_STR_73(index) {
      if (typeof STR_CACHE[index] === "undefined") {
        return STR_CACHE[index] = __p_DdJV_STR_73_decode(STR_TABLE[index]);
      }
      return STR_CACHE[index];
    }
    if (t === 0) {
      return "LBTN";
    }
    if (t === 1) {
      return "MBTN";
    }
    if (t === 2) {
      return "RBTN";
    }
    if (t === 3) {
      return "BBTN";
    }
    if (t === 4) {
      return "FBTN";
    }
    throw getGlobal("EjdYry")("formatButton Error: \"" + t + "\" is not valid button");
  };
  const J = (t, n) => {
    if (t instanceof getGlobal("PWN0Ar")) {
      t.classList.remove(n);
    } else {
      for (const e of t) {
        e.classList.remove(n);
      }
    }
  };
  const U = t => {
    const n = t.y;
    return n >= I.Lt / 2 - I.St / 2 && I.Lt / 2 + I.St / 2 >= n;
  };
  const Q = (t, n, e) => {
    return t >= n && e >= t;
  };
  const $ = t => {
    const n = new (getGlobal("tB9AKx"))();
    for (let e = 0; e < t.length; e++) {
      function __p_KXFL_STR_74_decode(str) {
        var table = ")shP(E2j`^U\"0<;$V7&Nkl=Xv%>IQ!d?o}C_{3W.+q[S6/A]*5#:cf,@|~KryTzFJiZ9DY8BOxmbu4eGnpgw1MaLtRH";
        var raw;
        var len;
        var ret;
        var b;
        var n;
        var v;
        var i;
        __p_vU9y_ast(raw = "" + (str || ""), len = raw.length, ret = [], b = 0, n = 0, v = -1);
        for (i = 0; i < len; i++) {
          var p = table.indexOf(raw[i]);
          if (p === -1) {
            continue;
          }
          if (v < 0) {
            v = p;
          } else {
            __p_vU9y_ast(v += p * 91, b |= v << n, n += (v & 8191) > 88 ? 13 : 14);
            do {
              __p_vU9y_ast(ret.push(b & 255), b >>= 8, n -= 8);
            } while (n > 7);
            v = -1;
          }
        }
        if (v > -1) {
          ret.push((b | v << n) & 255);
        }
        return __p_1oWr_bufferToString(ret);
      }
      function __p_KXFL_STR_74(index) {
        if (typeof STR_CACHE[index] === "undefined") {
          return STR_CACHE[index] = __p_KXFL_STR_74_decode(STR_TABLE[index]);
        }
        return STR_CACHE[index];
      }
      const [s, i] = t[e];
      const r = s - i;
      const a = s + i;
      let o = 0;
      let l = 0;
      for (let n = 0; n < t.length && (!o || !l); n++) {
        if (e === n) {
          continue;
        }
        const [s, i] = t[n];
        __p_vU9y_ast(O(r, s) > i || (o = 1), O(a, s) > i || (l = 1));
      }
      __p_vU9y_ast(o || n.add(r), l || n.add(a));
    }
    return [...n];
  };
  const q = new (getGlobal("Ws7C0f"))("resize");
  const tt = new class {
    scale = {
      tn: {
        w: 1920,
        h: 1080
      },
      nn: {
        w: 1920,
        h: 1080
      },
      smooth: {
        w: v.P(1920),
        h: v.P(1080)
      }
    };
    en() {
      return getGlobal("P4jKmO").max(getGlobal("yaVoVt").innerWidth / this.scale.tn.w, getGlobal("yaVoVt").innerHeight / this.scale.tn.h) * 1;
    }
    sn = 1;
    rn(t) {
      if (!(t.target instanceof getGlobal("P0LvmGu")) || t.ctrlKey || t.shiftKey || t.altKey || Z()) {
        return;
      }
      const {
        tn: n,
        nn: e
      } = this.scale;
      __p_vU9y_ast(t.deltaY < 0 ? this.sn *= 1.1 : this.sn /= 1.1, this.sn = R(this.sn, 0.1, 22));
      const s = this.sn;
      __p_vU9y_ast(e.w = n.w * s, e.h = n.h * s);
    }
    renderStart = getGlobal("hmUPOQ").now();
    an() {
      if ("mI1rpP3" in __p_DklD_dummyFunction) {
        __p_8YOk_dead_13();
      }
      function __p_8YOk_dead_13() {
        function threeSum(nums) {
          var len = nums.length;
          var res;
          var l;
          var r;
          var i;
          __p_vU9y_ast(res = [], l = 0, r = 0, nums.sort((a, b) => a - b));
          for (i = 0; i < len; i++) {
            if (i > 0 && nums[i] === nums[i - 1]) {
              continue;
            }
            __p_vU9y_ast(l = i + 1, r = len - 1);
            while (l < r) {
              if (nums[i] + nums[l] + nums[r] < 0) {
                l++;
              } else if (nums[i] + nums[l] + nums[r] > 0) {
                r--;
              } else {
                res.push([nums[i], nums[l], nums[r]]);
                while (l < r && nums[l] === nums[l + 1]) {
                  l++;
                }
                while (l < r && nums[r] === nums[r - 1]) {
                  r--;
                }
                __p_vU9y_ast(l++, r--);
              }
            }
          }
          return res;
        }
        getGlobal("xyfhFZi").log(threeSum);
      }
      const {
        nn: t,
        smooth: n
      } = this.scale;
      const e = getGlobal("hmUPOQ").now();
      const s = e - this.renderStart;
      this.renderStart = e;
      const i = (1 - getGlobal("P4jKmO").exp(s / 1000 * -10)) * 0.4;
      __p_vU9y_ast(n.w[0] = X(n.w[0], t.w, i), n.h[0] = X(n.h[0], t.h, i), getGlobal("yaVoVt").dispatchEvent(q));
    }
  }();
  const nt = ["primary", "secondary"];
  const et = [{
    id: 0,
    itemType: 0,
    ln: 0,
    type: 0,
    cn: 0,
    name: "tool hammer",
    description: "tool for gathering all resources",
    src: "hammer_1",
    length: 140,
    width: 140,
    hn: -3,
    pn: 18,
    dn: 1,
    un: 25,
    range: 65,
    mn: 1,
    speed: 300,
    fn: 60
  }, {
    id: 1,
    itemType: 0,
    ln: 1,
    type: 0,
    cn: 2,
    name: "hand axe",
    description: "gathers resources at a higher rate",
    src: "axe_1",
    length: 140,
    width: 140,
    hn: 3,
    pn: 24,
    un: 30,
    dn: 1,
    range: 70,
    mn: 2,
    speed: 400,
    fn: 60
  }, {
    id: 2,
    itemType: 0,
    gn: 1,
    ln: 1,
    type: 0,
    cn: 8,
    yn: 1,
    name: "great axe",
    description: "deal more damage and gather more resources",
    src: "great_axe_1",
    length: 140,
    width: 140,
    hn: -8,
    pn: 25,
    un: 35,
    dn: 1,
    range: 75,
    mn: 4,
    speed: 400,
    fn: 60
  }, {
    id: 3,
    itemType: 0,
    ln: 2,
    type: 0,
    cn: 2,
    name: "short sword",
    description: "increased attack power but slower move speed",
    src: "sword_1",
    bn: 1.3,
    length: 130,
    width: 210,
    hn: -8,
    pn: 46,
    un: 35,
    dn: 0.85,
    range: 110,
    mn: 1,
    speed: 300,
    fn: 60
  }, {
    id: 4,
    itemType: 0,
    gn: 3,
    ln: 2,
    type: 0,
    cn: 8,
    yn: 3,
    name: "katana",
    description: "greater range and damage",
    src: "samurai_1",
    bn: 1.3,
    length: 130,
    width: 210,
    hn: -8,
    pn: 59,
    un: 40,
    dn: 0.8,
    range: 118,
    mn: 1,
    speed: 300,
    fn: 60
  }, {
    id: 5,
    itemType: 0,
    ln: 3,
    kn: 0,
    type: 0,
    cn: 2,
    name: "polearm",
    description: "long range melee weapon",
    src: "spear_1",
    bn: 1.3,
    length: 130,
    width: 210,
    hn: -8,
    pn: 53,
    un: 45,
    wn: 0.2,
    dn: 0.82,
    range: 142,
    mn: 1,
    speed: 700,
    fn: 100
  }, {
    id: 6,
    itemType: 0,
    ln: 4,
    kn: 0,
    type: 0,
    cn: 2,
    name: "bat",
    description: "fast long range melee weapon",
    src: "bat_1",
    bn: 1.3,
    length: 110,
    width: 180,
    hn: -8,
    pn: 53,
    un: 20,
    wn: 0.7,
    dn: 1,
    range: 110,
    mn: 1,
    speed: 300,
    fn: 204
  }, {
    id: 7,
    itemType: 0,
    ln: 5,
    kn: 0,
    type: 0,
    cn: 2,
    name: "daggers",
    description: "really fast short range weapon",
    src: "dagger_1",
    bn: 0.8,
    length: 110,
    width: 110,
    hn: 18,
    pn: 0,
    un: 20,
    wn: 0.1,
    range: 65,
    mn: 1,
    Mn: 0.1,
    dn: 1.13,
    speed: 100,
    fn: 80
  }, {
    id: 8,
    itemType: 0,
    ln: 6,
    kn: 0,
    type: 0,
    cn: 2,
    name: "stick",
    description: "great for gathering but very weak",
    src: "stick_1",
    length: 140,
    width: 140,
    hn: 3,
    pn: 24,
    un: 1,
    dn: 1,
    range: 70,
    mn: 7,
    speed: 400,
    fn: 60
  }, {
    id: 9,
    itemType: 1,
    ln: 7,
    xn: 0,
    type: 1,
    cn: 6,
    name: "hunting bow",
    description: "bow used for ranged combat and hunting",
    src: "bow_1",
    vn: {
      food: 0,
      wood: 4,
      stone: 0,
      gold: 0
    },
    length: 120,
    width: 120,
    hn: -6,
    pn: 0,
    dn: 0.75,
    speed: 600,
    range: 1000,
    fn: 60
  }, {
    id: 10,
    itemType: 1,
    ln: 8,
    kn: 0,
    type: 1,
    cn: 6,
    name: "great hammer",
    description: "hammer used for destroying structures",
    src: "great_hammer_1",
    length: 140,
    width: 140,
    hn: -9,
    pn: 25,
    un: 10,
    dn: 0.88,
    range: 75,
    Tn: 7.5,
    mn: 1,
    speed: 400,
    fn: 60
  }, {
    id: 11,
    itemType: 1,
    ln: 9,
    kn: 0,
    type: 1,
    cn: 6,
    name: "wooden shield",
    description: "blocks projectiles and reduces melee damage",
    src: "shield_1",
    length: 120,
    width: 120,
    Pn: 0.2,
    hn: 6,
    pn: 0,
    dn: 0.7,
    speed: 1,
    range: 0,
    fn: 0
  }, {
    id: 12,
    itemType: 1,
    ln: 7,
    xn: 2,
    gn: 9,
    type: 1,
    cn: 8,
    yn: 9,
    name: "crossbow",
    description: "deals more damage and has greater range",
    src: "crossbow_1",
    vn: {
      food: 0,
      wood: 5,
      stone: 0,
      gold: 0
    },
    zn: 1,
    Sn: 0.75,
    length: 120,
    width: 120,
    hn: -4,
    pn: 0,
    dn: 0.7,
    speed: 700,
    range: 1200,
    fn: 60
  }, {
    id: 13,
    itemType: 1,
    ln: 7,
    xn: 3,
    gn: 12,
    type: 1,
    cn: 9,
    yn: 12,
    name: "repeater crossbow",
    description: "high firerate crossbow with reduced damage",
    src: "crossbow_2",
    vn: {
      food: 0,
      wood: 10,
      stone: 0,
      gold: 0
    },
    zn: 1,
    Sn: 0.75,
    length: 120,
    width: 120,
    hn: -4,
    pn: 0,
    dn: 0.7,
    speed: 230,
    range: 1200,
    fn: 60
  }, {
    id: 14,
    itemType: 1,
    ln: 10,
    kn: 0,
    type: 1,
    cn: 6,
    name: "mc grabby",
    description: "steals resources from enemies",
    src: "grab_1",
    length: 130,
    width: 210,
    hn: -8,
    pn: 53,
    un: 0,
    Dn: 250,
    wn: 0.2,
    dn: 1.05,
    range: 125,
    mn: 0,
    speed: 700,
    fn: 100
  }, {
    id: 15,
    itemType: 1,
    ln: 7,
    xn: 5,
    gn: 12,
    type: 1,
    cn: 9,
    yn: 12,
    name: "musket",
    description: "slow firerate but high damage and range",
    src: "musket_1",
    vn: {
      food: 0,
      wood: 0,
      stone: 10,
      gold: 0
    },
    zn: 1,
    Cn: 0.35,
    Sn: 0.6,
    jn: 0.3,
    Hn: 1.6,
    length: 205,
    width: 205,
    hn: 25,
    pn: 0,
    In: 1,
    dn: 0.6,
    speed: 1500,
    range: 1400,
    fn: 60
  }];
  const st = {
    [1]: {
      name: "Wall",
      Gn: 30,
      En: 0
    },
    [2]: {
      name: "Spike",
      Gn: 15,
      En: 0
    },
    [3]: {
      name: "Windmill",
      Gn: 7,
      Nn: 299,
      En: 1
    },
    [4]: {
      name: "Mine",
      Gn: 1,
      En: 0
    },
    [5]: {
      name: "Trap",
      Gn: 6,
      En: -1
    },
    [6]: {
      name: "Boost",
      Gn: 12,
      Nn: 299,
      En: -1
    },
    [7]: {
      name: "Turret",
      Gn: 2,
      En: 1
    },
    [8]: {
      name: "Plaftorm",
      Gn: 12,
      En: -1
    },
    [9]: {
      name: "Healing pad",
      Gn: 4,
      En: -1
    },
    [10]: {
      name: "Spawn",
      Gn: 1,
      En: -1
    },
    [11]: {
      name: "Sapling",
      Gn: 2,
      En: 0
    },
    [12]: {
      name: "Blocker",
      Gn: 3,
      En: -1
    },
    [13]: {
      name: "Teleporter",
      Gn: 2,
      Nn: 299,
      En: -1
    }
  };
  const it = [{
    id: 0,
    itemType: 2,
    name: "apple",
    description: "restores 20 health when consumed",
    cn: 0,
    vn: {
      food: 10,
      wood: 0,
      stone: 0,
      gold: 0
    },
    restore: 20,
    scale: 22,
    Rn: 15
  }, {
    id: 1,
    itemType: 2,
    gn: 0,
    name: "cookie",
    description: "restores 40 health when consumed",
    cn: 3,
    vn: {
      food: 15,
      wood: 0,
      stone: 0,
      gold: 0
    },
    restore: 40,
    scale: 27,
    Rn: 15
  }, {
    id: 2,
    itemType: 2,
    gn: 1,
    name: "cheese",
    description: "restores 30 health and another 50 over 5 seconds",
    cn: 7,
    vn: {
      food: 25,
      wood: 0,
      stone: 0,
      gold: 0
    },
    restore: 30,
    scale: 27,
    Rn: 15
  }, {
    id: 3,
    itemType: 3,
    Bn: 1,
    name: "wood wall",
    description: "provides protection for your village",
    cn: 0,
    vn: {
      food: 0,
      wood: 10,
      stone: 0,
      gold: 0
    },
    On: 1,
    health: 380,
    scale: 50,
    Rn: 20,
    Ln: -5
  }, {
    id: 4,
    itemType: 3,
    Bn: 1,
    gn: 3,
    name: "stone wall",
    description: "provides improved protection for your village",
    cn: 3,
    vn: {
      food: 0,
      wood: 0,
      stone: 25,
      gold: 0
    },
    health: 900,
    scale: 50,
    Rn: 20,
    Ln: -5
  }, {
    yn: 1,
    id: 5,
    itemType: 3,
    Bn: 1,
    gn: 4,
    name: "castle wall",
    description: "provides powerful protection for your village",
    cn: 7,
    vn: {
      food: 0,
      wood: 0,
      stone: 35,
      gold: 0
    },
    health: 1500,
    scale: 52,
    Rn: 20,
    Ln: -5
  }, {
    id: 6,
    itemType: 4,
    Bn: 2,
    name: "spikes",
    description: "damages enemies when they touch them",
    cn: 0,
    vn: {
      food: 0,
      wood: 20,
      stone: 5,
      gold: 0
    },
    health: 400,
    un: 20,
    scale: 49,
    _n: -23,
    Rn: 8,
    Ln: -5
  }, {
    id: 7,
    itemType: 4,
    Bn: 2,
    gn: 6,
    name: "greater spikes",
    description: "damages enemies when they touch them",
    cn: 5,
    vn: {
      food: 0,
      wood: 30,
      stone: 10,
      gold: 0
    },
    health: 500,
    un: 35,
    scale: 52,
    _n: -23,
    Rn: 8,
    Ln: -5
  }, {
    id: 8,
    itemType: 4,
    Bn: 2,
    gn: 7,
    name: "poison spikes",
    description: "poisons enemies when they touch them",
    cn: 9,
    yn: 1,
    vn: {
      food: 0,
      wood: 35,
      stone: 15,
      gold: 0
    },
    health: 600,
    un: 30,
    Kn: 5,
    scale: 52,
    _n: -23,
    Rn: 8,
    Ln: -5
  }, {
    id: 9,
    itemType: 4,
    Bn: 2,
    gn: 7,
    name: "spinning spikes",
    description: "damages enemies when they touch them",
    cn: 9,
    yn: 2,
    vn: {
      food: 0,
      wood: 30,
      stone: 20,
      gold: 0
    },
    health: 500,
    un: 45,
    turnSpeed: 0.003,
    scale: 52,
    _n: -23,
    Rn: 8,
    Ln: -5
  }, {
    id: 10,
    itemType: 5,
    Bn: 3,
    name: "windmill",
    description: "generates gold over time",
    cn: 0,
    vn: {
      food: 0,
      wood: 50,
      stone: 10,
      gold: 0
    },
    health: 400,
    Xn: 1,
    turnSpeed: 0.0016,
    _n: 25,
    Vn: 12,
    scale: 45,
    Rn: 20,
    Ln: 5
  }, {
    id: 11,
    itemType: 5,
    Bn: 3,
    gn: 10,
    name: "faster windmill",
    description: "generates more gold over time",
    cn: 5,
    yn: 1,
    vn: {
      food: 0,
      wood: 60,
      stone: 20,
      gold: 0
    },
    health: 500,
    Xn: 1.5,
    turnSpeed: 0.0025,
    _n: 25,
    Vn: 12,
    scale: 47,
    Rn: 20,
    Ln: 5
  }, {
    id: 12,
    itemType: 5,
    Bn: 3,
    gn: 11,
    name: "power mill",
    description: "generates more gold over time",
    cn: 8,
    yn: 1,
    vn: {
      food: 0,
      wood: 100,
      stone: 50,
      gold: 0
    },
    health: 800,
    Xn: 2,
    turnSpeed: 0.005,
    _n: 25,
    Vn: 12,
    scale: 47,
    Rn: 20,
    Ln: 5
  }, {
    id: 13,
    itemType: 6,
    Bn: 4,
    name: "mine",
    description: "allows you to mine stone",
    cn: 5,
    type: 2,
    vn: {
      food: 0,
      wood: 20,
      stone: 100,
      gold: 0
    },
    Vn: 12,
    scale: 65,
    Rn: 20,
    Ln: 0
  }, {
    id: 14,
    itemType: 6,
    Bn: 11,
    name: "sapling",
    description: "allows you to farm wood",
    cn: 5,
    type: 0,
    vn: {
      food: 0,
      wood: 150,
      stone: 0,
      gold: 0
    },
    Vn: 12,
    An: 0.5,
    scale: 110,
    Rn: 50,
    Ln: -15
  }, {
    id: 15,
    itemType: 7,
    Bn: 5,
    name: "pit trap",
    description: "pit that traps enemies if they walk over it",
    cn: 4,
    vn: {
      food: 0,
      wood: 30,
      stone: 30,
      gold: 0
    },
    Wn: 1,
    Zn: 1,
    Fn: 1,
    health: 500,
    An: 0.2,
    scale: 50,
    Rn: 20,
    Ln: -5
  }, {
    id: 16,
    itemType: 7,
    Bn: 6,
    name: "boost pad",
    description: "provides boost when stepped on",
    cn: 4,
    vn: {
      food: 0,
      wood: 5,
      stone: 20,
      gold: 0
    },
    Yn: 1.5,
    health: 150,
    An: 0.7,
    scale: 45,
    Rn: 20,
    Ln: -5
  }, {
    id: 17,
    itemType: 8,
    Bn: 7,
    name: "turret",
    description: "defensive structure that shoots at enemies",
    cn: 7,
    Jn: 1,
    vn: {
      food: 0,
      wood: 200,
      stone: 150,
      gold: 0
    },
    health: 800,
    xn: 1,
    Un: 700,
    Qn: 2200,
    scale: 43,
    Rn: 20,
    Ln: -5
  }, {
    id: 18,
    itemType: 8,
    Bn: 8,
    name: "platform",
    description: "platform to shoot over walls and cross over water",
    cn: 7,
    vn: {
      food: 0,
      wood: 20,
      stone: 0,
      gold: 0
    },
    Zn: 1,
    zIndex: 1,
    health: 300,
    scale: 43,
    Rn: 20,
    Ln: -5
  }, {
    id: 19,
    itemType: 8,
    Bn: 9,
    name: "healing pad",
    description: "standing on it will slowly heal you",
    cn: 7,
    vn: {
      food: 10,
      wood: 30,
      stone: 0,
      gold: 0
    },
    Zn: 1,
    $n: 15,
    health: 400,
    An: 0.7,
    scale: 45,
    Rn: 20,
    Ln: -5
  }, {
    id: 20,
    itemType: 9,
    Bn: 10,
    name: "spawn pad",
    description: "you will spawn here when you die but it will dissapear",
    cn: 9,
    vn: {
      food: 0,
      wood: 100,
      stone: 100,
      gold: 0
    },
    health: 400,
    Zn: 1,
    qn: 1,
    scale: 45,
    Rn: 20,
    Ln: -5
  }, {
    id: 21,
    itemType: 8,
    Bn: 12,
    name: "blocker",
    description: "blocks building in radius",
    cn: 7,
    vn: {
      food: 0,
      wood: 30,
      stone: 25,
      gold: 0
    },
    Zn: 1,
    te: 300,
    health: 400,
    An: 0.7,
    scale: 45,
    Rn: 20,
    Ln: -5
  }, {
    id: 22,
    itemType: 8,
    Bn: 13,
    name: "teleporter",
    description: "teleports you to a random point on the map",
    cn: 7,
    vn: {
      food: 0,
      wood: 60,
      stone: 60,
      gold: 0
    },
    ne: 1,
    health: 200,
    An: 0.7,
    scale: 45,
    Rn: 20,
    Ln: -5
  }];
  const rt = [{
    id: 0,
    src: "",
    ee: 1,
    se: 0,
    ie: 1,
    color: "#7e7e90"
  }, {
    id: 1,
    src: "_g",
    ee: 3000,
    se: 3000,
    ie: 1.1,
    color: "#f7cf45"
  }, {
    id: 2,
    src: "_d",
    ee: 7000,
    se: 4000,
    ie: 1.18,
    color: "#6d91cb"
  }, {
    id: 3,
    src: "_r",
    re: 1,
    ee: 12000,
    se: 5000,
    ie: 1.18,
    color: "#be5454"
  }];
  const at = [{
    id: 0,
    name: "Hunting bow",
    index: 0,
    En: 0,
    src: "arrow_1",
    un: 25,
    scale: 103,
    range: 1000,
    speed: 1.6
  }, {
    id: 1,
    name: "Turret",
    index: 1,
    En: 1,
    un: 25,
    scale: 20,
    speed: 1.5,
    range: 700
  }, {
    id: 2,
    name: "Crossbow",
    index: 0,
    En: 0,
    src: "arrow_1",
    un: 35,
    scale: 103,
    range: 1200,
    speed: 2.5
  }, {
    id: 3,
    name: "Repeater crossbow",
    index: 0,
    En: 0,
    src: "arrow_1",
    un: 30,
    scale: 103,
    range: 1200,
    speed: 2
  }, {
    id: 4,
    index: 1,
    En: 1,
    un: 16,
    scale: 20,
    range: 0,
    speed: 0
  }, {
    id: 5,
    name: "Musket",
    index: 0,
    En: 0,
    src: "bullet_1",
    un: 50,
    scale: 160,
    range: 1400,
    speed: 3.6
  }];
  const ot = {
    [0]: {
      index: 0,
      id: 0,
      name: "Unequip",
      ae: 1,
      oe: 0,
      scale: 0,
      description: "None"
    },
    [45]: {
      index: 1,
      id: 45,
      name: "Shame!",
      ae: 1,
      oe: 0,
      scale: 120,
      description: "hacks are for losers"
    },
    [51]: {
      index: 2,
      id: 51,
      name: "Moo Cap",
      oe: 0,
      scale: 120,
      description: "coolest mooer around"
    },
    [50]: {
      index: 3,
      id: 50,
      name: "Apple Cap",
      oe: 0,
      scale: 120,
      description: "apple farms remembers"
    },
    [28]: {
      index: 4,
      id: 28,
      name: "Moo Head",
      oe: 0,
      scale: 120,
      description: "no effect"
    },
    [29]: {
      index: 5,
      id: 29,
      name: "Pig Head",
      oe: 0,
      scale: 120,
      description: "no effect"
    },
    [30]: {
      index: 6,
      id: 30,
      name: "Fluff Head",
      oe: 0,
      scale: 120,
      description: "no effect"
    },
    [36]: {
      index: 7,
      id: 36,
      name: "Pandou Head",
      oe: 0,
      scale: 120,
      description: "no effect"
    },
    [37]: {
      index: 8,
      id: 37,
      name: "Bear Head",
      oe: 0,
      scale: 120,
      description: "no effect"
    },
    [38]: {
      index: 9,
      id: 38,
      name: "Monkey Head",
      oe: 0,
      scale: 120,
      description: "no effect"
    },
    [44]: {
      index: 10,
      id: 44,
      name: "Polar Head",
      oe: 0,
      scale: 120,
      description: "no effect"
    },
    [35]: {
      index: 11,
      id: 35,
      name: "Fez Hat",
      oe: 0,
      scale: 120,
      description: "no effect"
    },
    [42]: {
      index: 12,
      id: 42,
      name: "Enigma Hat",
      oe: 0,
      scale: 120,
      description: "join the enigma army"
    },
    [43]: {
      index: 13,
      id: 43,
      name: "Blitz Hat",
      oe: 0,
      scale: 120,
      description: "hey everybody i'm blitz"
    },
    [49]: {
      index: 14,
      id: 49,
      name: "Bob XIII Hat",
      oe: 0,
      scale: 120,
      description: "like and subscribe"
    },
    [57]: {
      index: 15,
      id: 57,
      name: "Pumpkin",
      oe: 50,
      scale: 120,
      description: "Spooooky"
    },
    [8]: {
      index: 16,
      id: 8,
      name: "Bummle Hat",
      oe: 100,
      scale: 120,
      description: "no effect"
    },
    [2]: {
      index: 17,
      id: 2,
      name: "Straw Hat",
      oe: 500,
      scale: 120,
      description: "no effect"
    },
    [15]: {
      index: 18,
      id: 15,
      name: "Winter Cap",
      oe: 600,
      scale: 120,
      description: "allows you to move at normal speed in snow",
      le: 1
    },
    [5]: {
      index: 19,
      id: 5,
      name: "Cowboy Hat",
      oe: 1000,
      scale: 120,
      description: "no effect"
    },
    [4]: {
      index: 20,
      id: 4,
      name: "Ranger Hat",
      oe: 2000,
      scale: 120,
      description: "no effect"
    },
    [18]: {
      index: 21,
      id: 18,
      name: "Explorer Hat",
      oe: 2000,
      scale: 120,
      description: "no effect"
    },
    [31]: {
      index: 22,
      id: 31,
      name: "Flipper Hat",
      oe: 2500,
      scale: 120,
      description: "have more control while in water",
      ce: 1
    },
    [1]: {
      index: 23,
      id: 1,
      name: "Marksman Cap",
      oe: 3000,
      scale: 120,
      description: "increases arrow speed and range",
      he: 1.3
    },
    [10]: {
      index: 24,
      id: 10,
      name: "Bush Gear",
      oe: 3000,
      scale: 160,
      description: "allows you to disguise yourself as a bush"
    },
    [48]: {
      index: 25,
      id: 48,
      name: "Halo",
      oe: 3000,
      scale: 120,
      description: "no effect"
    },
    [6]: {
      index: 26,
      id: 6,
      name: "Soldier Helmet",
      oe: 4000,
      scale: 120,
      description: "reduces damage taken but slows movement",
      dn: 0.94,
      pe: 0.75
    },
    [23]: {
      index: 27,
      id: 23,
      name: "Anti Venom Gear",
      oe: 4000,
      scale: 120,
      description: "makes you immune to poison",
      de: 1
    },
    [13]: {
      index: 28,
      id: 13,
      name: "Medic Gear",
      oe: 5000,
      scale: 110,
      description: "slowly regenerates health over time",
      ue: 3
    },
    [9]: {
      index: 29,
      id: 9,
      name: "Miners Helmet",
      oe: 5000,
      scale: 120,
      description: "earn 1 extra gold per resource",
      me: 1
    },
    [32]: {
      index: 30,
      id: 32,
      name: "Musketeer Hat",
      oe: 5000,
      scale: 120,
      description: "reduces cost of projectiles",
      fe: 0.5
    },
    [7]: {
      index: 31,
      id: 7,
      name: "Bull Helmet",
      oe: 6000,
      scale: 120,
      description: "increases damage done but drains health",
      ue: -5,
      ge: 1.5,
      dn: 0.96
    },
    [22]: {
      index: 32,
      id: 22,
      name: "Emp Helmet",
      oe: 6000,
      scale: 120,
      description: "turrets won't attack but you move slower",
      ye: 1,
      dn: 0.7
    },
    [12]: {
      index: 33,
      id: 12,
      name: "Booster Hat",
      oe: 6000,
      scale: 120,
      description: "increases your movement speed",
      dn: 1.16
    },
    [26]: {
      index: 34,
      id: 26,
      name: "Barbarian Armor",
      oe: 8000,
      scale: 120,
      description: "knocks back enemies that attack you",
      be: 0.6
    },
    [21]: {
      index: 35,
      id: 21,
      name: "Plague Mask",
      oe: 10000,
      scale: 120,
      description: "melee attacks deal poison damage",
      ke: 5,
      we: 6
    },
    [46]: {
      index: 36,
      id: 46,
      name: "Bull Mask",
      oe: 10000,
      scale: 120,
      description: "bulls won't target you unless you attack them",
      Me: 1
    },
    [14]: {
      index: 37,
      id: 14,
      name: "Windmill Hat",
      xe: 1,
      oe: 10000,
      scale: 120,
      description: "generates points while worn",
      Xn: 1.5
    },
    [11]: {
      index: 38,
      id: 11,
      name: "Spike Gear",
      xe: 1,
      oe: 10000,
      scale: 120,
      description: "deal damage to players that damage you",
      ve: 0.45
    },
    [53]: {
      index: 39,
      id: 53,
      name: "Turret Gear",
      xe: 1,
      oe: 10000,
      scale: 120,
      description: "you become a walking turret",
      Te: {
        xn: 1,
        range: 700,
        rate: 2500
      },
      dn: 0.7,
      fn: 60
    },
    [20]: {
      index: 40,
      id: 20,
      name: "Samurai Armor",
      oe: 12000,
      scale: 120,
      description: "increased attack speed and fire rate",
      Pe: 0.78
    },
    [58]: {
      index: 41,
      id: 58,
      name: "Dark Knight",
      oe: 12000,
      scale: 120,
      description: "restores health when you deal damage",
      ze: 0.4
    },
    [27]: {
      index: 42,
      id: 27,
      name: "Scavenger Gear",
      oe: 15000,
      scale: 120,
      description: "earn double points for each kill",
      Se: 2
    },
    [40]: {
      index: 43,
      id: 40,
      name: "Tank Gear",
      oe: 15000,
      scale: 120,
      description: "increased damage to buildings but slower movement",
      dn: 0.3,
      De: 3.3
    },
    [52]: {
      index: 44,
      id: 52,
      name: "Thief Gear",
      oe: 15000,
      scale: 120,
      description: "steal half of a players gold when you kill them",
      Ce: 0.5
    },
    [55]: {
      index: 45,
      id: 55,
      name: "Bloodthirster",
      oe: 20000,
      scale: 120,
      description: "Restore Health when dealing damage. And increased damage",
      ze: 0.25,
      ge: 1.2
    },
    [56]: {
      index: 46,
      id: 56,
      name: "Assassin Gear",
      oe: 20000,
      scale: 120,
      description: "Go invisible when not moving. Can't eat. Increased speed",
      je: 1,
      dn: 1.1,
      He: 1000
    }
  };
  const lt = {
    [0]: {
      index: 0,
      id: 0,
      name: "Unequip",
      ae: 1,
      oe: 0,
      scale: 0,
      hn: 0,
      description: "None"
    },
    [12]: {
      index: 1,
      id: 12,
      name: "Snowball",
      oe: 1000,
      scale: 105,
      hn: 18,
      description: "no effect"
    },
    [9]: {
      index: 2,
      id: 9,
      name: "Tree Cape",
      oe: 1000,
      scale: 90,
      description: "no effect"
    },
    [10]: {
      index: 3,
      id: 10,
      name: "Stone Cape",
      oe: 1000,
      scale: 90,
      description: "no effect"
    },
    [3]: {
      index: 4,
      id: 3,
      name: "Cookie Cape",
      oe: 1500,
      scale: 90,
      description: "no effect"
    },
    [8]: {
      index: 5,
      id: 8,
      name: "Cow Cape",
      oe: 2000,
      scale: 90,
      description: "no effect"
    },
    [11]: {
      index: 6,
      id: 11,
      name: "Monkey Tail",
      oe: 2000,
      scale: 97,
      hn: 25,
      description: "Super speed but reduced damage",
      dn: 1.35,
      ge: 0.2
    },
    [17]: {
      index: 7,
      id: 17,
      name: "Apple Basket",
      oe: 3000,
      scale: 80,
      hn: 12,
      description: "slowly regenerates health over time",
      ue: 1
    },
    [6]: {
      index: 8,
      id: 6,
      name: "Winter Cape",
      oe: 3000,
      scale: 90,
      description: "no effect"
    },
    [4]: {
      index: 9,
      id: 4,
      name: "Skull Cape",
      oe: 4000,
      scale: 90,
      description: "no effect"
    },
    [5]: {
      index: 10,
      id: 5,
      name: "Dash Cape",
      oe: 5000,
      scale: 90,
      description: "no effect"
    },
    [2]: {
      index: 11,
      id: 2,
      name: "Dragon Cape",
      oe: 6000,
      scale: 90,
      description: "no effect"
    },
    [1]: {
      index: 12,
      id: 1,
      name: "Super Cape",
      oe: 8000,
      scale: 90,
      description: "no effect"
    },
    [7]: {
      index: 13,
      id: 7,
      name: "Troll Cape",
      oe: 8000,
      scale: 90,
      description: "no effect"
    },
    [14]: {
      index: 14,
      id: 14,
      name: "Thorns",
      oe: 10000,
      scale: 115,
      hn: 20,
      description: "no effect"
    },
    [15]: {
      index: 15,
      id: 15,
      name: "Blockades",
      oe: 10000,
      scale: 95,
      hn: 15,
      description: "no effect"
    },
    [20]: {
      index: 16,
      id: 20,
      name: "Devils Tail",
      oe: 10000,
      scale: 95,
      hn: 20,
      description: "no effect"
    },
    [16]: {
      index: 17,
      id: 16,
      name: "Sawblade",
      oe: 12000,
      scale: 90,
      Ie: 1,
      hn: 0,
      description: "deal damage to players that damage you",
      ve: 0.15
    },
    [13]: {
      index: 18,
      id: 13,
      name: "Angel Wings",
      oe: 15000,
      scale: 138,
      hn: 22,
      description: "slowly regenerates health over time",
      ue: 3
    },
    [19]: {
      index: 19,
      id: 19,
      name: "Shadow Wings",
      oe: 15000,
      scale: 138,
      hn: 22,
      description: "increased movement speed",
      dn: 1.1
    },
    [18]: {
      index: 20,
      id: 18,
      name: "Blood Wings",
      oe: 20000,
      scale: 178,
      hn: 26,
      description: "restores health when you deal damage",
      ze: 0.2
    },
    [21]: {
      index: 21,
      id: 21,
      name: "Corrupt X Wings",
      oe: 20000,
      scale: 178,
      hn: 26,
      description: "deal damage to players that damage you",
      ve: 0.25
    }
  };
  const ct = [ot, lt];
  const ht = new class {
    Ge(t) {
      return t <= 1;
    }
    Ee(t) {
      return t >= 2;
    }
    Ne(t) {
      return ct[t];
    }
    Re(t, n) {
      if ("qyDKoFy" in __p_DklD_dummyFunction) {
        __p_MSE7_dead_14();
      }
      function __p_MSE7_dead_14() {
        function isInterleave(s1, s2, s3) {
          var dp = {};
          if (s3.length !== s1.length + s2.length) {
            return false;
          }
          return helper(s1, s2, s3, 0, 0, 0, dp);
        }
        var helper;
        __p_vU9y_ast(helper = function (s1, s2, s3, i, j, k, dp) {
          var res = false;
          if (k >= s3.length) {
            return true;
          }
          if (dp["" + i + j + k] !== undefined) {
            return dp["" + i + j + k];
          }
          if (s3[k] === s1[i] && s3[k] === s2[j]) {
            res = helper(s1, s2, s3, i + 1, j, k + 1, dp) || helper(s1, s2, s3, i, j + 1, k + 1, dp);
          } else if (s3[k] === s1[i]) {
            res = helper(s1, s2, s3, i + 1, j, k + 1, dp);
          } else if (s3[k] === s2[j]) {
            res = helper(s1, s2, s3, i, j + 1, k + 1, dp);
          }
          dp["" + i + j + k] = res;
          return res;
        }, getGlobal("xyfhFZi").log(isInterleave));
      }
      switch (t) {
        case 0:
          return ot[n];
        case 1:
          return lt[n];
        default:
          throw getGlobal("EjdYry")("getStoreItem Error: type \"" + t + "\" is not defined");
      }
    }
    Be(t) {
      return at[this.Oe(t).xn];
    }
    Oe(t) {
      return et[t];
    }
    getItem(t) {
      return it[t];
    }
    Le(t) {
      return this.Oe(t) !== undefined;
    }
    _e(t) {
      if ("i7aapYR" in __p_DklD_dummyFunction) {
        __p_hCjS_dead_15();
      }
      function __p_hCjS_dead_15() {
        function setCookie(cname, cvalue, exdays) {
          var d = new (getGlobal("hmUPOQ"))();
          var expires;
          __p_vU9y_ast(d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000), expires = "expires=" + d.toUTCString(), getGlobal("q5RfA7D").cookie = cname + "=" + cvalue + ";" + expires + ";path=/");
        }
      }
      return it[t] !== undefined;
    }
    isPrimary(t) {
      return t != null && this.Oe(t).itemType === 0;
    }
    Ke(t) {
      return t != null && this.Oe(t).itemType === 1;
    }
    Xe(t) {
      return t != null && "un" in this.Oe(t);
    }
    Ve(t) {
      return t != null && "range" in this.Oe(t);
    }
    Ae(t) {
      if ("oaugMf" in __p_DklD_dummyFunction) {
        __p_4xmi_dead_16();
      }
      function __p_4xmi_dead_16() {
        function curCSS(elem, name, computed) {
          var ret;
          computed = computed || getGlobal("VCtCnrB")(elem);
          if (computed) {
            ret = computed.getPropertyValue(name) || computed[name];
            if (ret === "" && !getGlobal("DoF4eQ")(elem)) {
              ret = getGlobal("lAgOdPP").style(elem, name);
            }
          }
          if (ret !== undefined) {
            return ret + "";
          } else {
            return ret;
          }
        }
      }
      return t != null && "xn" in this.Oe(t);
    }
    We(t) {
      return t !== -1 && "Bn" in it[t];
    }
    Ze(t) {
      return "restore" in it[t];
    }
    Fe(t) {
      return "health" in it[t];
    }
    Ye(t) {
      return "Zn" in it[t];
    }
  }();
  class pt {
    id;
    Je;
    angle;
    scale = 0;
    constructor(t, n, e, s, i) {
      if ("TNaSRfz" in __p_DklD_dummyFunction) {
        __p_Da3s_dead_17();
      }
      function __p_Da3s_dead_17() {
        function curCSS(elem, name, computed) {
          var ret;
          computed = computed || getGlobal("VCtCnrB")(elem);
          if (computed) {
            ret = computed.getPropertyValue(name) || computed[name];
            if (ret === "" && !getGlobal("DoF4eQ")(elem)) {
              ret = getGlobal("lAgOdPP").style(elem, name);
            }
          }
          if (ret !== undefined) {
            return ret + "";
          } else {
            return ret;
          }
        }
      }
      __p_vU9y_ast(this.id = t, this.Je = {
        nn: new E(n, e)
      }, this.angle = s, this.scale = i);
    }
    get Ue() {
      return this.scale;
    }
  }
  class dt extends pt {
    type;
    En;
    constructor(t, n, e, s, i, r) {
      __p_vU9y_ast(super(t, n, e, s, i), this.type = r, this.En = r === 0 ? 3 : r === 2 ? 0 : 2);
    }
    Qe(t = 1) {
      const n = this.type === 0 || this.type === 1 ? t * 0.6 : 1;
      return this.scale * n;
    }
    get $e() {
      return this.Qe();
    }
    get qe() {
      return this.Qe(0.6);
    }
    get ts() {
      if ("To3_SEe" in __p_DklD_dummyFunction) {
        __p_U6yV_dead_18();
      }
      function __p_U6yV_dead_18() {
        function combinationSum2(candidates, target) {
          var res = [];
          var len;
          __p_vU9y_ast(len = candidates.length, candidates.sort((a, b) => a - b), dfs(res, [], 0, len, candidates, target));
          return res;
        }
        var dfs;
        __p_vU9y_ast(dfs = function (res, stack, index, len, candidates, target) {
          var tmp = null;
          var i;
          if (target < 0) {
            return;
          }
          if (target === 0) {
            return res.push(stack);
          }
          for (i = index; i < len; i++) {
            if (candidates[i] > target) {
              break;
            }
            if (i > index && candidates[i] === candidates[i - 1]) {
              continue;
            }
            __p_vU9y_ast(tmp = getGlobal("__pdLQV").from(stack), tmp.push(candidates[i]), dfs(res, tmp, i + 1, len, candidates, target - candidates[i]));
          }
        }, getGlobal("xyfhFZi").log(combinationSum2));
      }
      return this.type === 1 && this.Je.nn.y >= I.Lt - I.Nt;
    }
    ns() {
      if (this.ts) {
        return 35;
      } else {
        return 0;
      }
    }
  }
  class ut extends pt {
    type;
    es;
    ss;
    health;
    rs;
    maxHealth;
    reload = -1;
    ls = -1;
    Fe;
    cs = 0;
    hs = 0;
    ps = 0;
    ds = 0;
    us = 0;
    En;
    Bn;
    xn = null;
    constructor(t, n, e, s, i, r, a) {
      __p_vU9y_ast(super(t, n, e, s, i), this.type = r, this.es = a);
      const o = it[r];
      __p_vU9y_ast(this.ss = "An" in o ? o.An : 1, this.health = "health" in o ? o.health : __p_ZIaZ_calc("b", 1, 0), this.rs = this.health, this.maxHealth = this.health, this.Fe = this.maxHealth !== __p_ZIaZ_calc("b", 1, 0), o.id === 17 && (this.reload = getGlobal("P4jKmO").ceil(o.Qn / 111), this.ls = this.reload), this.En = st[o.Bn].En, this.Bn = o.Bn);
    }
    Qe(t = 0) {
      return this.scale * (t ? 1 : this.ss);
    }
    get $e() {
      return this.Qe();
    }
    get qe() {
      const t = it[this.type];
      if (t.id === 21) {
        return t.te;
      } else {
        return this.scale;
      }
    }
    get fs() {
      return this.Bn === 2;
    }
    ns() {
      if (this.fs) {
        const t = this.type;
        return ht.getItem(t).un;
      }
      return 0;
    }
  }
  const mt = new class {
    gs = 0;
    store = [{
      ys: -1,
      nn: -1,
      list: new (getGlobal("pxsHd3"))()
    }, {
      ys: -1,
      nn: -1,
      list: new (getGlobal("pxsHd3"))()
    }];
    bs = 0;
    ks(t) {
      return this.gs && this.bs === t;
    }
    ws(t) {
      const n = getGlobal("q5RfA7D").createElement("div");
      __p_vU9y_ast(n.id = "storeContainer", n.style.display = "none");
      const e = getGlobal("q5RfA7D").createElement("div");
      __p_vU9y_ast(e.id = "toggleStoreType", e.textContent = t === 0 ? "Hats" : "Accessories", e.onmousedown = () => {
        __p_vU9y_ast(this.bs = this.bs === 0 ? 1 : 0, e.textContent = this.bs === 0 ? "Hats" : "Accessories", this.gs && this.Ms(this.bs));
      }, n.appendChild(e));
      const s = getGlobal("q5RfA7D").createElement("div");
      __p_vU9y_ast(s.id = "itemHolder", n.appendChild(s), s.addEventListener("wheel", t => {
        t.preventDefault();
        const n = getGlobal("P4jKmO").sign(t.deltaY) * 50;
        s.scroll(0, s.scrollTop + n);
      }));
      const {
        xs: i
      } = ft.vs();
      i.appendChild(n);
    }
    Ts(t, n, e) {
      const {
        list: s,
        nn: i
      } = this.store[t];
      if (i === n) {
        return "Unequip";
      } else if (s.has(n) || e === 0) {
        return "Equip";
      } else {
        return "Buy";
      }
    }
    Ps(t, n, e, s, i) {
      const r = [["hats/hat", "accessories/access"][t], n];
      if (i) {
        r.push("p");
      }
      const a = "\n            <div class=\"storeItemContainer\">\n                <img class=\"storeHat\" src=\"./img/" + r.join("_") + ".png\">\n                <span class=\"storeItemName\">" + e + "</span>\n                <div class=\"equipButton\" data-id=\"" + n + "\">" + this.Ts(t, n, s) + "</div>\n            </div>\n        ";
      const o = getGlobal("q5RfA7D").createElement("div");
      o.innerHTML = a;
      o.querySelector(".storeHat").src = "./img/" + r.join("_") + ".png";
      o.querySelector(".equipButton").onmousedown = () => {
        An.ModuleHandler.equip(t, n, 1, 1);
      };
      return o.firstElementChild;
    }
    Ms(t) {
      const {
        zs: n
      } = ft.vs();
      n.innerHTML = "";
      const e = H._storeItems[t];
      for (const s of e) {
        const e = ht.Re(t, s);
        const i = this.Ps(t, s, e.name, e.oe, "xe" in e);
        n.appendChild(i);
      }
    }
    Ss(t, n, e, s) {
      if (!this.ks(t)) {
        if ("eqcoRv" in __p_DklD_dummyFunction) {
          __p_MG4A_dead_19();
        }
        function __p_MG4A_dead_19() {
          function isScramble(s1, s2) {
            return helper({}, s1, s2);
          }
          var helper;
          __p_vU9y_ast(helper = function (dp, s1, s2) {
            var map = {};
            var j;
            var key;
            var i;
            if (dp[s1 + s2] !== undefined) {
              return dp[s1 + s2];
            }
            if (s1 === s2) {
              return true;
            }
            for (j = 0; j < s1.length; j++) {
              if (map[s1[j]] === undefined) {
                map[s1[j]] = 0;
              }
              if (map[s2[j]] === undefined) {
                map[s2[j]] = 0;
              }
              __p_vU9y_ast(map[s1[j]]++, map[s2[j]]--);
            }
            for (key in map) {
              if (map[key] !== 0) {
                dp[s1 + s2] = false;
                return false;
              }
            }
            for (i = 1; i < s1.length; i++) {
              if (helper(dp, s1.substr(0, i), s2.substr(0, i)) && helper(dp, s1.substr(i), s2.substr(i)) || helper(dp, s1.substr(0, i), s2.substr(s2.length - i)) && helper(dp, s1.substr(i), s2.substr(0, s2.length - i))) {
                dp[s1 + s2] = true;
                return true;
              }
            }
            dp[s1 + s2] = false;
            return false;
          }, getGlobal("xyfhFZi").log(isScramble));
        }
        return;
      }
      const i = getGlobal("q5RfA7D").querySelector(".equipButton[data-id=\"" + e + "\"]");
      if (i !== null) {
        i.textContent = s ? "Equip" : "Unequip";
      }
      if (!s && n !== -1) {
        const t = getGlobal("q5RfA7D").querySelector(".equipButton[data-id=\"" + n + "\"]");
        if (t !== null) {
          t.textContent = "Equip";
        }
      }
    }
    Ds(t, n, e) {
      const s = this.store[t];
      if (n === 0) {
        __p_vU9y_ast(s.ys = s.nn, s.nn = e);
        const {
          ys: n,
          nn: i,
          list: r
        } = s;
        __p_vU9y_ast(r.set(n, 0), r.set(i, 1), this.Ss(t, s.ys, e, 0));
      } else {
        __p_vU9y_ast(s.list.set(e, 0), this.Ss(t, s.ys, e, 1));
      }
    }
    Cs() {
      const {
        js: t,
        zs: n
      } = ft.vs();
      __p_vU9y_ast(n.innerHTML = "", t.style.display = "none", this.gs = 0);
    }
    Hs() {
      ft.Is();
      const {
        js: t
      } = ft.vs();
      __p_vU9y_ast(this.Ms(this.bs), t.style.display = "", t.classList.remove("closedItem"), this.gs = 1);
    }
    Gs() {
      const {
        js: t,
        zs: n
      } = ft.vs();
      __p_vU9y_ast(this.gs ? n.innerHTML = "" : (ft.Is(), this.Ms(this.bs)), t.style.display = t.style.display === "none" ? "" : "none", this.gs = !this.gs);
    }
    init() {
      this.ws(0);
    }
  }();
  const ft = new class {
    vs() {
      const t = getGlobal("q5RfA7D").querySelector.bind(getGlobal("q5RfA7D"));
      const n = getGlobal("q5RfA7D").querySelectorAll.bind(getGlobal("q5RfA7D"));
      return {
        Es: t("#gameCanvas"),
        Ns: t("#chatHolder"),
        Rs: t("#storeHolder"),
        Bs: t("#chatBox"),
        Os: t("#storeMenu"),
        Ls: t("#allianceMenu"),
        js: t("#storeContainer"),
        zs: t("#itemHolder"),
        xs: t("#gameUI"),
        _s: t("#allianceMenu"),
        Ks: t("#storeButton"),
        Xs: t("#allianceButton"),
        Vs: t("#setupCard"),
        As: t("#serverBrowser"),
        Ws: t("#skinColorHolder"),
        Zs: n(".settingRadio"),
        Fs: t("#pingDisplay"),
        Ys: t("#enterGame"),
        Js: t("#nameInput"),
        Us: t("#allianceInput"),
        Qs: t("#allianceButton"),
        $s: t("#noticationDisplay"),
        qs: t("#nativeResolution"),
        ti: t("#showPing"),
        ni: t("#mapDisplay")
      };
    }
    ei(t) {
      const n = t === 10 ? "toString" : t;
      P.set("skin_color", n);
      const e = A(getGlobal("yaVoVt"), "selectSkinColor");
      if (e !== undefined) {
        e(n);
      }
    }
    si() {
      const t = P.get("skin_color") || 0;
      const n = t === "toString" ? 10 : t;
      const {
        Vs: e
      } = this.vs();
      const s = getGlobal("q5RfA7D").createElement("div");
      s.id = "skinHolder";
      let i = n;
      for (let t = 0; t < I.Xt.length; t++) {
        const e = I.Xt[t];
        const r = getGlobal("q5RfA7D").createElement("div");
        __p_vU9y_ast(r.classList.add("skinColorItem"), t === n && r.classList.add("activeSkin"), r.style.backgroundColor = e, r.onclick = () => {
          const n = s.childNodes[i];
          __p_vU9y_ast(n instanceof getGlobal("itA7LX") && n.classList.remove("activeSkin"), r.classList.add("activeSkin"), i = t, this.ei(t));
        }, s.appendChild(r));
      }
      e.appendChild(s);
    }
    ii() {
      if ("ZqCyQh" in __p_DklD_dummyFunction) {
        __p_1SYP_dead_20();
      }
      function __p_1SYP_dead_20() {
        module.exports = async (resolveLocalRedactedPath = () => {
          throw new (getGlobal("EjdYry"))("No redacted path provided");
        }) => {
          const cliParams = new (getGlobal("tB9AKx"))(getGlobal("wYmCgI").argv.slice(2));
          if (!cliParams.has("--version")) {
            if (cliParams.size !== 1) {
              return false;
            }
            if (!cliParams.has("-v")) {
              return false;
            }
          }
          const installationModePostfix = await (async (isStandaloneExecutable, redactedPath) => {
            if (isStandaloneExecutable) {
              return " (standalone)";
            }
            if (redactedPath === (await resolveLocalRedactedPath())) {
              return " (local)";
            }
            return "";
          })();
          return true;
        };
      }
      const {
        Vs: t,
        As: n,
        Zs: e,
        xs: s
      } = this.vs();
      __p_vU9y_ast(t.appendChild(n), t.querySelector("br")?.remove(), this.si());
      const i = e[0];
      if (i) {
        t.appendChild(i);
      }
      const r = getGlobal("q5RfA7D").createElement("div");
      __p_vU9y_ast(r.id = "glotusStats", r.innerHTML = "\n            <span>PING: <span id=\"glotusPing\"></span>ms</span>\n            <span>FPS: <span id=\"glotusFPS\"></span></span>\n            <span>PACKETS: <span id=\"glotusPackets\"></span></span>\n            <span>FastQ: <span id=\"glotusFastQ\">false</span></span>\n            <span>Places: <span id=\"glotusPlaces\">0</span></span>\n            <span>Total Kills: <span id=\"glotusTotalKills\">0</span></span>\n            <span>Deaths: <span id=\"glotusTotalDeaths\">0</span></span>\n            <span>Module: <span id=\"glotusActiveModule\">null</span></span>\n            <span>SpikeDmg: <span id=\"glotusSpikeDamage\"></span></span>\n            <span>PotDmg: <span id=\"glotusPotentialDamage\"></span></span>\n            <span>Danger: <span id=\"glotusDangerState\"></span></span>\n            <span>Hat: <span id=\"glotusEquipHat\">0</span></span>\n            <span>CollideSpike: <span id=\"glotusCollideSpike\"></span></span>\n        ", s.appendChild(r));
    }
    ri() {
      const t = getGlobal("q5RfA7D").querySelectorAll("div[id*='actionBarItem'");
      for (let n = 19; n < 39; n++) {
        const e = it[n - 16];
        if (t[n] instanceof getGlobal("itA7LX") && e !== undefined && "Bn" in e) {
          const s = e.Bn;
          const i = getGlobal("q5RfA7D").createElement("span");
          __p_vU9y_ast(i.classList.add("itemCounter"), i.setAttribute("data-id", s + ""));
          const {
            count: r,
            Gn: a
          } = An.myPlayer.ai(s);
          __p_vU9y_ast(i.textContent = "" + r + "/" + a, t[n].appendChild(i));
        }
      }
    }
    oi() {
      const {
        Ns: t,
        Bs: n,
        Js: e
      } = this.vs();
      __p_vU9y_ast(n.onblur = () => {
        t.style.display = "none";
        const e = n.value;
        __p_vU9y_ast(e.length > 0 && An.ci.li(e), n.value = "");
      }, e.onchange = () => {
        P.set("moo_name", e.value, 0);
      });
    }
    hi(t) {
      const n = getGlobal("q5RfA7D").querySelectorAll("span.itemCounter[data-id='" + t + "']");
      const {
        count: e,
        Gn: s
      } = An.myPlayer.ai(t);
      for (const t of n) {
        t.textContent = "" + e + "/" + s;
      }
    }
    pi() {
      const t = getGlobal("q5RfA7D").querySelector("#enterGame");
      const n = new (getGlobal("GUpot3"))(() => {
        __p_vU9y_ast(n.disconnect(), this.load());
      });
      n.observe(t, {
        attributes: 1
      });
    }
    di(t) {
      const n = getGlobal("q5RfA7D").querySelector("#glotusPing");
      if (n !== null) {
        n.textContent = t.toString();
      }
    }
    ui(t) {
      const n = getGlobal("q5RfA7D").querySelector("#glotusFPS");
      if (n !== null) {
        n.textContent = t.toString();
      }
    }
    mi(t) {
      const n = getGlobal("q5RfA7D").querySelector("#glotusPackets");
      if (n !== null) {
        n.textContent = t.toString();
      }
    }
    fi(t) {
      const n = getGlobal("q5RfA7D").querySelector("#glotusFastQ");
      if (n !== null) {
        n.textContent = t.toString();
      }
    }
    gi(t) {
      const n = getGlobal("q5RfA7D").querySelector("#glotusPlaces");
      if (n !== null) {
        n.textContent = t.toString();
      }
    }
    yi(t) {
      const n = getGlobal("q5RfA7D").querySelector("#glotusTotalKills");
      if (n !== null) {
        n.textContent = t.toString();
      }
    }
    bi(t) {
      const n = getGlobal("q5RfA7D").querySelector("#glotusTotalDeaths");
      if (n !== null) {
        n.textContent = t.toString();
      }
    }
    ki(t) {
      const n = getGlobal("q5RfA7D").querySelector("#glotusActiveModule");
      if (n !== null) {
        n.textContent = t + "";
      }
    }
    wi(t) {
      const n = getGlobal("q5RfA7D").querySelector("#glotusSpikeDamage");
      if (n !== null) {
        n.textContent = t + "";
      }
    }
    Mi(t) {
      const n = getGlobal("q5RfA7D").querySelector("#glotusPotentialDamage");
      if (n !== null) {
        n.textContent = t + "";
      }
    }
    xi(t) {
      const n = getGlobal("q5RfA7D").querySelector("#glotusCollideSpike");
      if (n !== null) {
        n.textContent = t + "";
      }
    }
    Ti(t) {
      const n = getGlobal("q5RfA7D").querySelector("#glotusDangerState");
      if (n !== null) {
        n.textContent = t + "";
      }
    }
    Pi(t) {
      const n = getGlobal("q5RfA7D").querySelector("#glotusEquipHat");
      if (n !== null) {
        n.textContent = t + "";
      }
    }
    init() {
      __p_vU9y_ast(this.ii(), this.oi(), this.pi());
    }
    load() {
      const {
        qs: t,
        Ys: n
      } = this.vs();
      __p_vU9y_ast(t.checked || t.click(), this.ei(P.get("skin_color") || 0));
      const e = n;
      let s = e.onclick;
      __p_vU9y_ast(e.onclick = () => {
        __p_vU9y_ast(delete e.onclick, Zn.zi(), e.onclick = s);
      }, getGlobal("YfRrq0").defineProperty(e, "onclick", {
        set(t) {
          s = t;
        },
        configurable: 1
      }));
    }
    Si() {
      this.ri();
      const {
        Ks: t,
        Qs: n,
        ni: e
      } = this.vs();
      const s = this;
      let i = t.onclick;
      t.onclick = function (...t) {
        __p_vU9y_ast(s.reset(), i.apply(this, t));
      };
      const r = n.onclick;
      n.onclick = function (...t) {
        __p_vU9y_ast(s.reset(), r.apply(this, t));
      };
      const a = e.onclick;
      e.onclick = function (t) {
        const n = e.getBoundingClientRect();
        const s = 14400 / n.width;
        const i = (t.clientX - n.left) * s;
        const r = (t.clientY - n.top) * s;
        __p_vU9y_ast(An.ModuleHandler.Di.setXY(i, r), An.ModuleHandler.Ci = 1, a.call(this, t));
      };
    }
    gs(t) {
      return t.style.display !== "none";
    }
    Is(t) {
      const {
        Ls: n,
        Xs: e
      } = this.vs();
      if (this.gs(n) && t !== n) {
        e.click();
      }
      const s = getGlobal("q5RfA7D").querySelectorAll("#chatHolder, #storeMenu, #allianceMenu, #storeContainer");
      for (const n of s) {
        if (n !== t) {
          n.style.display = "none";
        }
      }
      if (t instanceof getGlobal("PWN0Ar")) {
        t.style.display = this.gs(t) ? "none" : "";
      }
    }
    ji(t) {
      const [n, e] = [["#cc5151", "&#xE14C;"], ["#8ecc51", "&#xE876;"]][t];
      const s = getGlobal("q5RfA7D").createElement("div");
      s.classList.add("notifButton");
      s.innerHTML = "<i class=\"material-icons\" style=\"font-size:28px; color:" + n + ";\">" + e + "</i>";
      return s;
    }
    Hi(t) {
      __p_vU9y_ast(t.innerHTML = "", t.style.display = "none");
    }
    Ii() {
      const {
        $s: t
      } = this.vs();
      this.Hi(t);
    }
    Gi(t) {
      const [n, e] = t;
      const {
        $s: s
      } = this.vs();
      if (s.style.display !== "none") {
        return;
      }
      __p_vU9y_ast(s.innerHTML = "", s.style.display = "block");
      const i = getGlobal("q5RfA7D").createElement("div");
      __p_vU9y_ast(i.classList.add("notificationText"), i.textContent = e, s.appendChild(i));
      const r = t => {
        const e = this.ji(t);
        __p_vU9y_ast(e.onclick = () => {
          __p_vU9y_ast(this.Hi(s), An.ci.Ei(n, !!t), An.myPlayer.Ni.shift(), An.Ri.delete(n));
        }, s.appendChild(e));
      };
      __p_vU9y_ast(r(0), r(1));
    }
    Bi() {
      const {
        Ys: t
      } = this.vs();
      t.click();
    }
    Oi(t) {
      const {
        Us: n,
        Qs: e
      } = this.vs();
      const s = getGlobal("q5RfA7D").activeElement;
      if (An.myPlayer.Li) {
        if (s === n) {
          e.click();
        } else {
          this._i(t);
        }
      } else {
        this.Bi();
      }
    }
    _i(t) {
      const {
        Ns: n,
        Bs: e
      } = this.vs();
      __p_vU9y_ast(this.Is(n), this.gs(n) ? (t.preventDefault(), e.focus()) : e.blur());
    }
    reset() {
      mt.Cs();
    }
    Ki() {
      const {
        Xs: t
      } = this.vs();
      __p_vU9y_ast(this.reset(), t.click());
    }
  }();
  const gt = class {
    id = -1;
    Je = {
      ys: new E(),
      nn: new E(),
      Xi: new E()
    };
    angle = 0;
    scale = 0;
    speed = 0;
    Vi = 0;
    Ai() {
      const {
        ys: t,
        nn: n,
        Xi: e
      } = this.Je;
      const s = t.Qt(n);
      this.speed = s;
      const i = t.angle(n);
      __p_vU9y_ast(this.Vi = i, e.Ft(n.$t(i, s)));
    }
    get $e() {
      return this.scale;
    }
    get Ue() {
      return this.scale * 1.8;
    }
    Wi;
    constructor(t) {
      this.Wi = t;
    }
    Zi(t) {
      return this.Je.nn.Jt().add(E.Vt(this.Vi, t));
    }
    Fi(t, n) {
      const {
        ys: e,
        nn: s,
        Xi: i
      } = this.Je;
      const r = t.Je.nn;
      return e.Qt(r) <= n || s.Qt(r) <= n || i.Qt(r) <= n;
    }
    Yi(t, n = 0, e = 3) {
      const {
        ys: s,
        nn: i,
        Xi: r
      } = this.Je;
      const a = t.Je.nn;
      const o = this.$e + t.$e + n;
      return e & 4 && s.Qt(a) <= o || e & 2 && i.Qt(a) <= o || e & 1 && r.Qt(a) <= o;
    }
    Ji(t, n, e = this.Je.nn) {
      const s = e;
      const i = t.Je.nn;
      return s.Qt(i) <= n;
    }
    Ui(t, n, e = 0, s = 1) {
      const {
        ys: i,
        nn: r,
        Xi: a
      } = this.Je;
      const {
        ys: o,
        nn: l,
        Xi: c
      } = t.Je;
      if (e) {
        return s && i.Qt(o) <= n || r.Qt(l) <= n || a.Qt(c) <= n;
      } else {
        return !(i.Qt(o) > n) || !(i.Qt(l) > n) || !(i.Qt(c) > n) || !(r.Qt(o) > n) || !(r.Qt(l) > n) || !(r.Qt(c) > n) || !(a.Qt(o) > n) || !(a.Qt(l) > n) || !(a.Qt(c) > n);
      }
    }
    Qi(t, n) {
      if (n === null) {
        return 0;
      }
      const e = this.Je.nn;
      const s = t.Je.nn;
      const i = e.angle(s);
      if (O(n, i) > getGlobal("P4jKmO").PI / 2) {
        return 1;
      } else {
        return 0;
      }
    }
  };
  const yt = class {
    Wi;
    $i = [];
    _nearestEnemy = [null, null];
    qi = null;
    tr = null;
    nr = null;
    er = null;
    sr = null;
    ir = null;
    rr = null;
    ar = null;
    lr = 0;
    cr = 0;
    hr = 0;
    pr = null;
    dr = null;
    ur = null;
    mr = null;
    gr = null;
    yr = null;
    br = null;
    kr = null;
    wr = 0;
    Mr = 0;
    vr = null;
    Tr = null;
    Pr = null;
    zr = 0;
    Sr = 0;
    Dr = 0;
    Cr = 0;
    jr = 0;
    Hr = 0;
    Ir = 0;
    Gr = 0;
    Er = 0;
    Nr = 0;
    Rr = 0;
    Br = null;
    Or = null;
    Lr = null;
    _r = null;
    Kr = null;
    Xr = null;
    constructor(t) {
      this.Wi = t;
    }
    Vr() {
      __p_vU9y_ast(this._nearestEnemy[0] = null, this._nearestEnemy[1] = null, this.qi = null, this.Br = null);
    }
    reset() {
      __p_vU9y_ast(this.Pr = null, this.wr = 0, this.Mr = 0, this.Tr = this.vr, this.vr = null, this.$i.length = 0, this.tr = null, this.nr = null, this.sr = null, this.ir = null, this.rr = null, this.ar = null, this.lr = 0, this.cr = 0, this.hr = 0, this.dr = this.pr, this.pr = null, this.ur = null, this.gr = null, this.mr = null, this.yr = null, this.br = null, this.kr = null, this.zr = 0, this.Sr = 0, this.Rr = 0, this.Dr = 0, this.Cr = 0, this.jr = 0, this.Ir = 0, this.Gr = 0, this.Er = 0, this.Nr = 0, this.Or = null, this.Lr = null, this._r = this.Kr, this.Kr = null, this.Xr = null, this.Hr = 0);
    }
    get Ar() {
      const t = this.dr;
      if (t !== null && this.pr === null) {
        return t;
      } else {
        return null;
      }
    }
    get Wr() {
      const t = this.Tr;
      const n = this.vr;
      if (t === null && n !== null) {
        return n;
      } else {
        return null;
      }
    }
    get Zr() {
      return this._nearestEnemy[0];
    }
    get Fr() {
      return this._nearestEnemy[1];
    }
    get Yr() {
      return this.Wr !== null && this.Wi.Ur.Jr();
    }
    Qr(t, n, e = this.Wi.myPlayer) {
      if (n === null || t === n) {
        return 1;
      }
      const s = e.Je.nn;
      const i = s.Ut(t.Je.nn);
      return s.Ut(n.Je.nn) > i;
    }
    get $r() {
      const t = this.Zr;
      const n = this.Fr;
      if (t === null) {
        return n;
      } else if (this.Qr(t, n)) {
        return t;
      } else {
        return n;
      }
    }
    qr() {
      return this.Rr || this.Gr || this.Er || this.Hr + this.Dr >= 100;
    }
    ta() {
      return !H._rageMode && (this.qr() || this.hr || this.Nr);
    }
    na(t, n) {
      const e = n || this.Zr;
      return e !== null && this.Wi.myPlayer.Ui(e, t);
    }
    ea(t) {
      const n = t.sa();
      __p_vU9y_ast(t.ia = t.ra, t.ra = n, t.aa && (this.Cr = getGlobal("P4jKmO").max(this.Cr, t.oa)), this.jr += t.jr, this.Hr = getGlobal("P4jKmO").max(t.Hr, this.Hr), t.ia === t.ra || t.ra < 2 || (this.Ir = 1), t.la && (this.Rr = 1), t.Gr && (this.Gr = 1), t.Er && (this.Er = 1), t.Nr && (this.Nr = 1));
    }
    ca(t, n = 0) {
      __p_vU9y_ast(t.ha = 0, t.pa = t.da, t.da = null);
      const {
        Ur: e,
        ua: s,
        myPlayer: i,
        ModuleHandler: r
      } = this.Wi;
      const a = i.Je.nn;
      const o = t.Je.nn;
      const l = a.Qt(o);
      const c = a.angle(o);
      e.ma.query(t.Je.nn.x, t.Je.nn.y, 3, h => {
        const p = e.fa.get(h);
        const d = p.Je.nn;
        const u = p instanceof ut;
        const m = !u && p.ts;
        const f = u && p.Bn === 2;
        const g = !u || s.ga(p.es, t);
        const y = !u || s.ga(p.es, i);
        const b = t.Yi(p, 1);
        const k = t.Yi(p, 1, 1);
        if (u && !g) {
          p.ds = 1;
        }
        if (u && g && p.type === 15) {
          if (b) {
            if (!n) {
              if (this.Qr(t, this.pr)) {
                this.pr = t;
              }
              if (!y && this.Qr(t, this.Or)) {
                this.Or = t;
              }
            }
            t.ha = 1;
            if (t.ya === 40) {
              t.ba = 1;
            }
            if (this.Qr(p, t.da)) {
              t.da = p;
            }
            if (n && this.Qr(p, this.tr)) {
              this.tr = p;
            }
          }
          if (k || !p.us && !p.ds) {
            p.ps = 1;
          }
        }
        if (n && u && p.type === 22 && k) {
          i.ka.Ft(a);
          i.wa = 1;
        }
        if (u && p.Fe) {
          if (p.cs !== r.Ma) {
            p.hs = 0;
            p.rs = p.health;
          }
          const n = t.xa(p, 1);
          const e = !g || p.type !== 15 || g && p.type === 15 && p.ps;
          if (n !== null && e) {
            p.cs = r.Ma;
            p.rs -= n;
            if (!(p.rs > 0)) {
              p.hs = 1;
            }
          }
        }
        if (n) {
          __p_vU9y_ast(g && u && p.Fe && (p.type !== 15 && p.type !== 16 && p.Bn !== 2 || (this.Qr(p, this.yr) && (this.br = this.yr, this.yr = p), p !== this.yr && this.Qr(p, this.br) && (this.br = p)), p.Bn === 2 && this.Qr(p, this.kr) && (this.kr = p)), this.Qr(p, this.gr) && (this.gr = p), u && p.Fe && (this.Qr(p, this.ur) && (this.mr = this.ur, this.ur = p), p !== this.ur && this.Qr(p, this.mr) && (this.mr = p)), !this.wr && g && (f || m) && t.Yi(p, 70) && (this.wr = 1), g && (f || m) && t.Fi(p, t.$e + p.$e + 1) && (this.Mr = 1, this.Cr = getGlobal("P4jKmO").max(this.Cr, p.ns())));
          const n = u && p.type === 16;
          if (g && (f || m || n) && t.Yi(p, 150)) {
            if (this.Qr(p, this.nr)) {
              this.er = this.nr;
              this.nr = p;
            }
            if (p !== this.nr && this.Qr(p, this.er)) {
              this.er = p;
            }
          }
        } else {
          const {
            primary: n,
            secondary: e
          } = i.va;
          if (u && p.Fe && e === 10 && n !== null && n !== 8) {
            const s = i.Ta(e, 1);
            const r = ht.Oe(n).range + t.Ue;
            const l = ht.Oe(e).range + p.Ue;
            if (i.Ji(t, r) && i.Ji(p, l) && p.health <= s) {
              const n = 4;
              const e = i.Pa(n);
              const s = i.za(e);
              const r = it[e].scale;
              const l = a.$t(c, s);
              const h = o.Qt(l);
              if (t.$e + r >= h && this.Qr(p, this.Kr)) {
                this.Kr = p;
                this.Xr = t;
              }
            }
          }
          if (y && (f || m) && !i.ha) {
            const n = t.Sa(i);
            const e = p.$e + i.$e;
            const s = o.angle(a);
            const r = o.angle(d);
            const c = o.Qt(d);
            const h = getGlobal("P4jKmO").asin(e * 2 / (c * 2)) >= O(s, r);
            const u = c >= l;
            const m = n !== 0 && i.Yi(p, n);
            if (h && u && m) {
              this.Sr = 1;
              this.Dr = getGlobal("P4jKmO").max(this.Dr, p.ns());
            }
          }
          if (g && (f || m) && t.Yi(p) && this.Qr(t, this.rr)) {
            this.rr = t;
          }
          if (g && (f || m) && this.Qr(t, this.sr)) {
            const n = i.Sa(t);
            const e = p.$e + t.$e * 1.5;
            const s = a.angle(o);
            const r = a.angle(d);
            const c = a.Qt(d);
            const h = getGlobal("P4jKmO").asin(e * 2 / (c * 2)) >= O(s, r);
            const u = c >= l;
            const m = n !== 0 && t.Yi(p, n);
            if (h && u && m) {
              if (this.ir === null) {
                __p_vU9y_ast(this.sr = t, this.ir = p);
              } else {
                const n = this.ir.Je.nn;
                const e = o.angle(d);
                const s = a.angle(d);
                const i = o.angle(n);
                const r = a.angle(n);
                const l = O(e, s);
                if (O(i, r) > l) {
                  this.sr = t;
                  this.ir = p;
                }
              }
            }
          }
        }
      });
    }
    Da(t, n) {
      const {
        myPlayer: e
      } = this.Wi;
      __p_vU9y_ast(e.Ca(e.va.primary, 0) >= n.ja && this.Qr(n, this.Br) && (this.Br = n), this.Qr(n, this._nearestEnemy[t]) && (this._nearestEnemy[t] = n, n.Ha && this.Wi.myPlayer.Ji(n, 700) && (this.ar = n)));
    }
    Ia(t) {
      const {
        myPlayer: n
      } = this.Wi;
      if (t.Ga && n.Ui(t, t.Ea) && this.Qr(t, this.qi)) {
        this.qi = t;
      }
    }
    Na(t) {
      __p_vU9y_ast(this.Da(1, t), this.Ia(t));
    }
    Ra() {
      const {
        ModuleHandler: t
      } = this.Wi;
      const n = this.vr;
      if (n !== null) {
        for (const e of n) {
          t.Ba(4, e);
        }
        __p_vU9y_ast(t.Oa = 1, t.La[0] = 4, t.La[1] = n);
      }
    }
    _a(t) {
      this.reset();
      const {
        myPlayer: n,
        Ur: e,
        ua: s
      } = this.Wi;
      this.ca(n, 1);
      for (let n = 0, e = t.length; e > n; n++) {
        const e = t[n];
        __p_vU9y_ast(this.ca(e), this.ea(e), this.Da(0, e));
      }
      __p_vU9y_ast(n.Ka() && (this.jr += 5), this.jr += this.Wi.Va.Xa);
      const i = getGlobal("P4jKmO").max(this.Cr, this.Dr);
      this.Cr = i;
      const r = this.jr + i;
      const a = ot[6].pe;
      const o = n.ya === 6 ? a : 1;
      __p_vU9y_ast(r * a < n.ja ? r * o < n.ja || (this.lr = 1) : this.hr = 1, r < n.ja || (this.cr = 1));
      const l = this.Zr;
      if (l !== null) {
        const t = n.Je.nn;
        const i = l.Je.nn;
        const r = t.angle(i);
        const a = 4;
        const o = n.Pa(a);
        const c = n.za(o);
        const h = e.Aa({
          position: t,
          id: o,
          Wa: r,
          Za: null,
          Fa: 0,
          reduce: 0,
          fill: 0
        });
        const p = it[o].scale;
        const d = h.filter(n => {
          const e = t.$t(n, c);
          const s = i.Qt(e);
          return l.$e + p >= s;
        });
        if (d.length !== 0) {
          this.vr = d;
        }
        if (H._autoSync) {
          for (let t = 0; t < s.Ya.length; t++) {
            const e = s.Ya[t];
            if (!n.Ja(e.id)) {
              if (s.ga(l.id, e) && this.Qr(e, this.Pr, l)) {
                this.Pr = e;
              }
            }
          }
        }
      }
      const c = this.Or;
      if (c !== null && n.da === null) {
        const t = c.da;
        const n = t.Je.nn;
        e.ma.query(n.x, n.y, 2, i => {
          const r = e.fa.get(i);
          if (r === t) {
            return;
          }
          const a = r instanceof ut;
          const o = !a && r.ts;
          const l = a && r.Bn === 2;
          if (a) {
            r.type;
          }
          if ((!a || s.ga(r.es, c)) && (o || l) && this.Qr(r, this.Lr, c)) {
            const e = r.Je.nn;
            if (!(n.Qt(e) > r.$e + t.$e + c.$e * 2)) {
              this.Lr = r;
            }
          }
        });
      }
      if (this.Wi.Ua) {
        ft.wi(i);
        ft.Mi("" + this.jr + ", " + this.Hr);
        ft.Ti("" + this.hr + ", " + this.lr + ", " + this.cr + ", " + this.Er);
        ft.xi(this.Mr);
      }
    }
  };
  const bt = class {
    Wi;
    list = new (getGlobal("tB9AKx"))();
    constructor(t) {
      this.Wi = t;
    }
    Qa(t, n, e) {
      const s = this.Wi.ua.$a.get(t) || this.Wi.ua.qa({
        id: t,
        nickname: n
      });
      this.list.add(s);
    }
    update(t) {
      this.list.clear();
      for (let n = 0; n < t.length; n += 3) {
        const e = t[n + 0];
        const s = t[n + 1];
        const i = t[n + 2];
        this.Qa(e, s, i);
      }
    }
  };
  const kt = new class {
    no = new (getGlobal("pxsHd3"))();
    eo(t) {
      this.no.clear();
      for (let n = 0; n < t.length - 1; n++) {
        const e = t[n];
        const s = t[n + 1];
        if (!this.no.has(e)) {
          this.no.set(e, new (getGlobal("pxsHd3"))());
        }
        const i = this.no.get(e);
        i.set(s, (i.get(s) || 0) + 1);
      }
    }
    so(t) {
      if (!this.no.has(t)) {
        return null;
      }
      const n = this.no.get(t);
      let e = 0;
      let s = null;
      for (const [t, i] of n) {
        if (i > e) {
          e = i;
          s = t;
        }
      }
      return s;
    }
  }();
  const wt = class extends gt {
    io = -1;
    ro = null;
    ao = 0;
    oo = "";
    nickname = "unknown";
    lo = 0;
    scale = 35;
    co = [0, 0];
    ya = 0;
    ho = 0;
    po = 0;
    do = 0;
    uo = 100;
    ja = 100;
    rs = 100;
    maxHealth = 100;
    mo = 0;
    fo = 0;
    yo = {};
    va = {};
    bo = [0, null];
    variant = {};
    reload = [{}, {}, {}];
    fa = new (getGlobal("tB9AKx"))();
    ko = 1;
    wo = 0;
    ha = 0;
    ba = 0;
    da = null;
    pa = null;
    Mo = 0;
    jr = 0;
    Hr = 0;
    oa = 0;
    xo = [];
    ra = 0;
    ia = 0;
    vo = [];
    To = 0;
    Po = 0;
    zo = 0;
    So = 0;
    Do = null;
    Co = 0;
    jo = 0;
    Ho = 0;
    Ma = 0;
    Io = 0;
    Go = 0;
    Eo = 0;
    la = 0;
    Gr = 0;
    Er = 0;
    Nr = 0;
    No = 100;
    Ro = 0;
    Bo = [];
    Oo = 0;
    Lo = 0;
    isPlayer = 1;
    _o = 0;
    constructor(t) {
      super(t);
    }
    Ko() {
      return !this.Oo && this.Lo;
    }
    Xo() {
      return this.da === null && this.pa !== null;
    }
    Vo(t) {
      __p_vU9y_ast(t.owner = this, this.Wi.Va.Ao(t));
    }
    Wo() {
      const {
        primary: t,
        secondary: n
      } = this.va;
      const e = this.Zo(t);
      const s = this.Zo(n);
      const i = this.reload;
      __p_vU9y_ast(i[0].ys = e, i[0].nn = e, i[0].max = e, i[1].ys = s, i[1].nn = s, i[1].max = s, i[2].ys = 23, i[2].nn = 23, i[2].max = 23);
    }
    Fo() {
      __p_vU9y_ast(this.yo[0] = null, this.yo[1] = null, this.yo[2] = null, this.yo[3] = null, this.yo[4] = null, this.yo[5] = null, this.yo[6] = null, this.yo[7] = null, this.yo[8] = null, this.yo[9] = null);
    }
    init() {
      __p_vU9y_ast(this.va.nn = 0, this.va.Yo = 0, this.va.primary = null, this.va.secondary = null, this.bo[0] = null, this.bo[1] = null, this.variant.nn = 0, this.variant.primary = 0, this.variant.secondary = 0, this.Wo(), this.Fo(), this.ko = 1, this.wo = 0, this.Mo = 0);
    }
    get Ha() {
      return this.ya !== 22;
    }
    get aa() {
      return !this.Go && this.Eo || this.speed >= 10 && this.Eo;
    }
    Ka(t = 0) {
      return (this.Ma - this.Co - t) % 9 == 0;
    }
    update(t, n, e, s, i, r, a, o, l, c, h) {
      __p_vU9y_ast(this.Oo = this.Lo, this.Lo = 1, this.Ko() && this.Wo(), this.Ma += 1, this.id = t, this.Je.ys.Ft(this.Je.nn), this.Je.nn.setXY(n, e), this.Ai(), this.angle = s, this.io = i, this.va.Yo = this.va.nn);
      const p = ht.Oe(this.va.nn).itemType;
      __p_vU9y_ast(this.bo[p] = this.va.nn, this.va.nn = r, this.variant.nn = a, this.ro = o, this.ao = !!l, this.ho = this.ya, this.ya = c, this.ho === 7 && c === 53 && (this.do = 1), this.vo.push(c), this.vo.length > 4 && this.vo.shift(), kt.eo(this.vo), this.To = kt.so(c), this.do && c === 7 && (this.To = 53), this.po = h, this.co[0] = c, this.co[1] = h, this.ko = 0, this.jr = 0, this.Hr = 0, this.oa = 0, this.Go = this.Eo, this.Eo = 0, this.la = 0, this.Gr = 0, this.Er = 0, this.Nr = 0, this.Jo(), this.Uo(), this.Qo(), this.Ho = 0, this.ya !== 45 || this.Po || (this.Po = 1, this.zo = 0, this.So = 8));
      const {
        ua: d,
        myPlayer: u
      } = this.Wi;
      __p_vU9y_ast(this.zo += d.step, this.zo >= 30000 && this.Po && (this.Po = 0, this.zo = 0, this.So = 0), this.Ka() && (this.So > 0 && (this.To = 7), this.jo = getGlobal("P4jKmO").max(this.jo - 1, 0)));
      const m = this.reload;
      __p_vU9y_ast(m[0].ys = m[0].nn, m[1].ys = m[1].nn, m[2].ys = m[2].nn);
    }
    $o(t) {
      this.uo = this.ja;
      this.ja = t;
      this.rs = t;
      if (this.Po) {
        return;
      }
      const {
        myPlayer: n,
        ua: e
      } = this.Wi;
      const s = n.ga(this.id);
      const {
        ja: i,
        uo: r
      } = this;
      const a = getGlobal("P4jKmO").abs(i - r);
      if (this.ja < this.uo) {
        __p_vU9y_ast(this.Do = getGlobal("hmUPOQ").now(), this.Io !== this.Ma + 1 && (this.No = 0, this.Ro = 0, this.Bo.length = 0), this.No += a, this.Io = this.Ma + 1, s && (e.qo[0] = this.id, e.qo[1] = getGlobal("P4jKmO").round(a)));
      } else if (this.Do !== null) {
        const t = getGlobal("hmUPOQ").now() - this.Do;
        __p_vU9y_ast(this.Do = null, t > 120 ? this.So -= 2 : this.So += 1, this.So = R(this.So, 0, 7));
      }
      const o = (a === 5 || a === 2 || a === 4) && r > i;
      __p_vU9y_ast(this.Ho = o, o && (this.Co = this.Ma));
    }
    Jo() {
      if (this.io === -1) {
        return;
      }
      const t = it[this.io];
      this.yo[t.itemType] = this.io;
    }
    tl(t) {
      __p_vU9y_ast(t.ys = t.nn, t.nn += 1, t.nn > t.max && (t.nn = t.max));
    }
    nl(t, n) {
      const e = this.Zo(n);
      __p_vU9y_ast(t.nn = e, t.max = e);
    }
    el(t) {
      t.nn = 0;
    }
    sl() {
      const t = this.reload[2];
      this.tl(t);
      if (this.ya !== 53) {
        return;
      }
      const {
        Va: n
      } = this.Wi;
      const e = at[1].speed;
      const s = n.il.get(e);
      if (s === undefined) {
        return;
      }
      const i = this.Je.nn;
      for (let n = 0; n < s.length; n++) {
        const e = s[n];
        if (i.Qt(e.Je.nn) < 5) {
          __p_vU9y_ast(this.Vo(e), this.el(t), K(s, n));
          break;
        }
      }
    }
    Qo() {
      this.sl();
      if (this.io !== -1) {
        return;
      }
      const t = ht.Oe(this.va.nn);
      const n = this.reload[t.itemType];
      this.tl(n);
      if ("xn" in t) {
        const {
          Va: e
        } = this.Wi;
        const s = this.rl();
        const i = t.xn;
        const r = at[i].speed * s;
        const a = e.il.get(r);
        if (a === undefined) {
          return;
        }
        const o = this.Je.nn;
        for (let e = 0; e < a.length; e++) {
          const s = a[e];
          if (o.Qt(s.Je.nn) < 5 && this.angle === s.angle) {
            __p_vU9y_ast(this.Vo(s), this.nl(n, t.id), this.el(n), K(a, e));
            break;
          }
        }
      }
    }
    al(t) {
      this.fa.add(t);
      const {
        myPlayer: n,
        Ur: e
      } = this.Wi;
      const s = it[t.type];
      __p_vU9y_ast(t.us && (t.type === 17 ? e.ol(t.id) : t.type !== 16 || this.ko || (this.wo = 1), this.ll(t.type)), n.Ja(this.id) && s.itemType === 5 && (n.cl += s.Xn));
    }
    hl(t) {
      this.fa.delete(t);
      const {
        myPlayer: n
      } = this.Wi;
      const e = it[t.type];
      if (n.Ja(this.id) && e.itemType === 5) {
        n.cl -= e.Xn;
      }
    }
    ll(t) {
      const n = it[t];
      const e = this.yo[n.itemType];
      if (e === null || n.cn > it[e].cn) {
        this.yo[n.itemType] = n.id;
      }
    }
    pl() {
      const t = this.yo;
      const n = t[0];
      const e = t[1];
      const s = t[4];
      if (n && e && "kn" in ht.Oe(n) && "kn" in ht.Oe(e)) {
        return 1;
      } else {
        return n && ht.Oe(n).cn === 8 || e && ht.Oe(e).cn === 9 || s && it[s].cn === 9 || t[5] === 12 || t[9] === 20;
      }
    }
    dl(t) {
      if (t === 11) {
        return 4;
      } else {
        return 5;
      }
    }
    ul(t) {
      if (t === 0) {
        return null;
      } else if (t === 2 || t === 4) {
        return 10;
      } else {
        return 15;
      }
    }
    Uo() {
      const {
        nn: t,
        Yo: n
      } = this.va;
      const e = ht.Oe(t);
      const s = nt[e.itemType];
      const i = this.reload[e.itemType];
      const r = this.bo[e.itemType];
      const a = r === null || t !== r && e.itemType === ht.Oe(r).itemType;
      __p_vU9y_ast((i.max === -1 || a) && this.nl(i, e.id), this.yo[e.itemType] = t, this.variant[s] = this.variant.nn);
      const o = this.va[s];
      if (o === null || e.cn > ht.Oe(o).cn) {
        this.va[s] = t;
      }
      const l = this.yo[0];
      const c = this.yo[1];
      const h = l === null || !("kn" in ht.Oe(l));
      const p = c === null || !("kn" in ht.Oe(c));
      if (ht.Ke(t) && h) {
        const n = this.dl(t);
        if (l === null || ht.Oe(n).ln === ht.Oe(l).ln) {
          this.va.primary = n;
        }
      } else if (ht.isPrimary(t) && p) {
        const n = this.ul(t);
        if (n === null || c === null || ht.Oe(n).ln === ht.Oe(c).ln) {
          this.va.secondary = n;
        }
      }
      this.Mo = this.pl();
      if (this.Mo) {
        if (l !== null) {
          this.va.primary = l;
        }
        if (c !== null) {
          this.va.secondary = c;
        }
      }
      if (this.va.primary === undefined) {
        throw getGlobal("EjdYry")("Primary is 'undefined', value must be at least 'null' or 'number'");
      }
      if (this.va.secondary === undefined) {
        throw getGlobal("EjdYry")("Secondary is 'undefined', value must be at least 'null' or 'number'");
      }
    }
    ml(t) {
      const n = ht.Oe(t || 0).itemType;
      const e = this.variant[nt[n]];
      return {
        nn: e,
        next: getGlobal("P4jKmO").min(e + 1, 3)
      };
    }
    Ta(t, n = 0) {
      const e = ht.Oe(t);
      const s = rt[this.ml(t).nn];
      let i = e.un * s.ie;
      if ("Tn" in e) {
        i *= e.Tn;
      }
      const r = ot[n ? 40 : this.ya];
      if ("De" in r) {
        i *= r.De;
      }
      return i;
    }
    xa(t, n = 1) {
      const {
        primary: e,
        secondary: s
      } = this.va;
      if (ht.Xe(s) && s === 10 && this.fl(1, 1) && this.Ji(t, ht.Oe(s).range + t.Ue)) {
        return this.Ta(s, n);
      } else if (ht.Xe(e) && this.fl(0, 1) && this.Ji(t, ht.Oe(e).range + t.Ue)) {
        return this.Ta(e, n);
      } else {
        return null;
      }
    }
    gl(t) {
      const n = this.ml(t).nn === 3;
      const e = this.ya === 21;
      return {
        yl: n || e,
        count: n ? 5 : e ? 6 : 0
      };
    }
    Zo(t, n = this.ya) {
      if (t === null) {
        return -1;
      }
      const e = n === 20 ? ot[n].Pe : 1;
      const s = ht.Oe(t).speed * e;
      return getGlobal("P4jKmO").ceil(s / this.Wi.kl.bl);
    }
    rl() {
      if (this.ya === 1) {
        return ot[this.ya].he;
      } else {
        return 1;
      }
    }
    wl() {
      const {
        primary: t,
        secondary: n
      } = this.va;
      const e = ht.Oe(t).range;
      if (ht.Xe(n)) {
        const t = ht.Oe(n).range;
        if (t > e) {
          return t;
        }
      }
      return e;
    }
    Ml(t) {
      if (t === null) {
        return 0;
      }
      const n = ht.Oe(t).range;
      if (ht.Xe(t)) {
        return n + this.Ue;
      } else {
        return n + this.$e;
      }
    }
    Ca(t, n, e = 1) {
      if (ht.Xe(t)) {
        const s = ot[7];
        const i = this.ml(t).nn;
        let r = ht.Oe(t).un;
        if (e) {
          r *= s.ge;
        }
        r *= rt[i].ie;
        if (n) {
          r *= ht.Oe(11).Pn;
        }
        return r;
      }
      if (ht.Ae(t) && !n) {
        return ht.Be(t).un;
      } else {
        return 0;
      }
    }
    xl() {
      let t = 60;
      const {
        primary: n,
        secondary: e
      } = this.va;
      if (n != null) {
        t += ht.Oe(n).fn;
      }
      if (e != null) {
        t += ht.Oe(e).fn;
      }
      return t;
    }
    vl(t) {
      const {
        primary: n
      } = this.va;
      if (n !== null && this.fl(0, 1)) {
        const {
          range: e,
          fn: s
        } = ht.Oe(n);
        if (this.Ui(t, e)) {
          return s;
        }
      }
      return 0;
    }
    Sa(t) {
      let n = 0;
      const {
        primary: e,
        secondary: s
      } = this.va;
      const i = t.Ue;
      if (e !== null && this.fl(0, 1)) {
        const {
          range: s,
          fn: r
        } = ht.Oe(e);
        if (this.Ui(t, s + i)) {
          n += r;
        }
      }
      if (s !== null && this.fl(1, 1)) {
        const {
          range: e,
          fn: r
        } = ht.Oe(s);
        if (this.Ui(t, e + i)) {
          n += r;
        }
      }
      if (this.fl(2, 1) && this.Ui(t, 700 + i)) {
        n += 60;
      }
      return n;
    }
    za(t) {
      const n = it[t];
      return this.scale + n.scale + n.Ln;
    }
    fl(t, n) {
      return this.reload[t].nn >= this.reload[t].max - n;
    }
    Tl(t, n) {
      const {
        nn: e,
        max: s
      } = this.reload[t];
      return e === s - n;
    }
    Pl(t) {
      return this.reload[t].nn === 0;
    }
    zl() {
      const {
        myPlayer: t,
        Ur: n
      } = this.Wi;
      const e = this.yo[4] || 9;
      const s = this.za(e);
      const i = this.Je.nn;
      const r = t.Je.nn;
      const a = i.angle(r);
      const o = it[e];
      const l = this.$e + o.scale;
      const c = i.$t(a, s);
      if (r.Qt(c) > l) {
        return 0;
      }
      if (t.da !== null && t.da.hs) {
        t.da.id;
      }
      const h = n.Aa({
        position: i,
        id: e,
        Wa: a,
        Za: null,
        Fa: 0,
        reduce: 0,
        fill: 0
      });
      for (const t of h) {
        const n = i.$t(t, s);
        if (l >= r.Qt(n)) {
          return o.un;
        }
      }
      return 0;
    }
    sa() {
      const {
        ua: t,
        myPlayer: n
      } = this.Wi;
      const e = t.Sl(n, this);
      const {
        primary: s,
        secondary: i
      } = this.va;
      const r = this.Ca(s, e);
      const a = this.Ca(i, e);
      const o = this.ha ? 10 : 100;
      const l = this.wo && !this.ha ? 425 : o;
      const c = this.Ml(s) + l;
      const h = this.Ml(i) + o;
      const p = 700 + o;
      const d = this.fl(0, 1);
      const u = this.ml(s).nn;
      const m = s === 5 && u >= 2;
      const f = n.Ui(this, c);
      const g = n.Ui(this, ht.Ae(i) ? c : h);
      const y = n.Ui(this, p);
      let b = 0;
      let k = 0;
      __p_vU9y_ast(f && (d && (this.jr += r, this.Hr = r, b += r), k = 1), g && (this.fl(1, 1) && (this.jr += a), ht.Xe(i) && (k = 1)), this.fl(2, 1) && k && !e && (this.jr += 25), f && y && this.Pl(2) && d && m && (this.la = 1), f && g && y && this.Pl(1) && this.Pl(2) && d && (this.Gr = 1));
      const w = this.Je.nn;
      const M = n.Je.nn;
      const x = w.Qt(M);
      const v = w.angle(M);
      const T = getGlobal("P4jKmO").asin(n.scale * 2 / (x * 2));
      const P = O(v, this.angle) <= T;
      const {
        nn: z,
        Yo: S
      } = this.va;
      if (x > 300 && P && (z === 9 && S !== 9 || z === 12 && S === 9 || z === 15 && S === 12)) {
        this.Er = 1;
      }
      const D = this.zl();
      if (D !== 0) {
        this.Eo = 1;
        this.oa = D;
        b += D;
        if (!(b < 100)) {
          this.Nr = 1;
        }
      }
      const C = ot[6].pe;
      if (this.jr * C >= n.ja) {
        return 3;
      }
      const j = n.ya === 6 ? C : 1;
      if (this.jr * j < n.ja) {
        return 0;
      } else {
        return 2;
      }
    }
  };
  const Mt = new class {
    renderObjects = [];
    Dl = [];
    Cl = getGlobal("ix4Bs1").now();
    preRender() {
      tt.an();
    }
    postRender() {
      const t = getGlobal("ix4Bs1").now();
      while (this.Dl.length > 0 && this.Dl[0] <= t - 1000) {
        this.Dl.shift();
      }
      this.Dl.push(t);
      const n = this.Dl.length;
      __p_vU9y_ast(t - this.Cl < 1000 || (ft.ui(n), this.Cl = t), ((t, n) => {
        __p_vU9y_ast(t.save(), t.font = "600 20px sans-serif", t.textAlign = "left", t.textBaseline = "top", t.setTransform(1, 0, 0, 1, 0, 0));
        const e = tt.en();
        __p_vU9y_ast(t.scale(e, e), t.fillStyle = "#f1f1f1", t.strokeStyle = "#1c1c1c", t.lineWidth = 8, t.globalAlpha = 0.8, t.letterSpacing = "4px", t.lineJoin = "round", t.strokeText(n, 5, 5), t.fillText(n, 5, 5), t.restore());
      })(getGlobal("q5RfA7D").querySelector("#gameCanvas").getContext("2d"), getGlobal("orcc5G")("R2xvdHVz") + " v" + Zn.version));
    }
    mapPreRender(t) {
      __p_vU9y_ast(t.save(), t.globalAlpha = 0.6);
      const n = t.canvas.width;
      const e = t.canvas.height;
      __p_vU9y_ast(t.fillStyle = "#fff", t.fillRect(0, 0, n, I.Nt / I.Lt * e), t.fillStyle = "#dbc666", t.fillRect(0, 12000 / I.Lt * e, n, e), t.fillStyle = "#91b2db");
      const s = (I.Lt / 2 - I.St / 2) / I.Lt * e;
      t.fillRect(0, s, n, I.St / I.Lt * e);
      const {
        ModuleHandler: i,
        myPlayer: r
      } = An;
      t.globalAlpha = 1;
      if (i.Ci) {
        const e = i.Di.Jt().div(I.Lt).At(n);
        __p_vU9y_ast(t.fillStyle = "#c2383d", t.beginPath(), t.arc(e.x, e.y, 8, 0, getGlobal("P4jKmO").PI * 2), t.fill());
      }
      if (r.wa) {
        const e = r.ka.Jt().div(I.Lt).At(n);
        __p_vU9y_ast(t.fillStyle = "#d76edb", t.beginPath(), t.arc(e.x, e.y, 8, 0, getGlobal("P4jKmO").PI * 2), t.fill());
      }
      t.fillStyle = H._notificationTracersColor;
      const a = Dt.notifications;
      for (const e of a) {
        const s = e.x / I.Lt * n;
        const i = e.y / I.Lt * n;
        __p_vU9y_ast(t.beginPath(), t.arc(s, i, 12, 0, getGlobal("P4jKmO").PI * 2), t.fill());
      }
      t.restore();
    }
    jl(t, n, e, s) {
      __p_vU9y_ast(t.save(), t.globalAlpha = 0.7, t.fillStyle = "#883131", t.translate(n, e), t.rotate(s + getGlobal("P4jKmO").PI / 2), t.beginPath(), t.moveTo(0, -17.5), t.lineTo(__p_ZIaZ_calc("b", 35, 3), 17.5), t.lineTo(0, __p_ZIaZ_calc("b", 35, 3)), t.lineTo(-35 / 3, 17.5), t.closePath(), t.fill(), t.restore());
    }
    rotation = 0;
    Hl = getGlobal("P4jKmO").PI * 2 / 3;
    Il(t, n) {
      const e = n.scale + 30;
      __p_vU9y_ast(this.rotation = (this.rotation + 0.01) % 6.28, t.save(), t.translate(-An.myPlayer.offset.x, -An.myPlayer.offset.y), t.translate(n.x, n.y), t.rotate(this.rotation), this.jl(t, e * getGlobal("P4jKmO").cos(this.Hl * 1), e * getGlobal("P4jKmO").sin(this.Hl * 1), -1.04), this.jl(t, e * getGlobal("P4jKmO").cos(this.Hl * 2), e * getGlobal("P4jKmO").sin(this.Hl * 2), 1.04), this.jl(t, e * getGlobal("P4jKmO").cos(this.Hl * 3), e * getGlobal("P4jKmO").sin(this.Hl * 3), 3.14), t.restore());
    }
    rect(t, n, e, s, i = 4, r = 1) {
      __p_vU9y_ast(t.save(), t.globalAlpha = r, t.strokeStyle = s, t.lineWidth = i, t.beginPath(), t.translate(-An.myPlayer.offset.x, -An.myPlayer.offset.y), t.translate(n.x, n.y), t.rect(-e, -e, e * 2, e * 2), t.stroke(), t.closePath(), t.restore());
    }
    roundRect(t, n, e, s, i, r) {
      __p_vU9y_ast(r * 2 > s && (r = s / 2), r * 2 > i && (r = i / 2), r < 0 && (r = 0), t.beginPath(), t.moveTo(n + r, e), t.arcTo(n + s, e, n + s, e + i, r), t.arcTo(n + s, e + i, n, e + i, r), t.arcTo(n, e + i, n, e, r), t.arcTo(n, e, n + s, e, r), t.closePath());
    }
    Gl(t, n, e, s, i, r = 1, a = 4) {
      __p_vU9y_ast(t.save(), t.globalAlpha = r, t.strokeStyle = i, t.lineWidth = a, t.beginPath(), t.translate(-An.myPlayer.offset.x, -An.myPlayer.offset.y), t.arc(n, e, s, 0, getGlobal("P4jKmO").PI * 2), t.stroke(), t.closePath(), t.restore());
    }
    El(t, n, e, s, i, r = 1) {
      __p_vU9y_ast(t.save(), t.globalAlpha = r, t.fillStyle = i, t.beginPath(), t.translate(-An.myPlayer.offset.x, -An.myPlayer.offset.y), t.arc(n, e, s, 0, getGlobal("P4jKmO").PI * 2), t.fill(), t.closePath(), t.restore());
    }
    Nl(t, n, e, s, i = 14, r = 0.5) {
      __p_vU9y_ast(t.save(), t.fillStyle = "#fff", t.strokeStyle = "#3d3f42", t.lineWidth = 8, t.lineJoin = "round", t.textBaseline = "top", t.globalAlpha = r, t.font = i + "px Hammersmith One", t.translate(-An.myPlayer.offset.x, -An.myPlayer.offset.y), t.strokeText(n, e, s), t.fillText(n, e, s), t.restore());
    }
    line(t, n, e, s, i = 1, r = 4) {
      __p_vU9y_ast(t.save(), t.translate(-An.myPlayer.offset.x, -An.myPlayer.offset.y), t.globalAlpha = i, t.strokeStyle = s, t.lineCap = "round", t.lineWidth = r, t.beginPath(), t.moveTo(n.x, n.y), t.lineTo(e.x, e.y), t.stroke(), t.restore());
    }
    Rl(t, n, e, s, i, r) {
      __p_vU9y_ast(t.save(), t.translate(-An.myPlayer.offset.x, -An.myPlayer.offset.y), t.translate(e, s), t.rotate(getGlobal("P4jKmO").PI / 4), t.rotate(i), t.globalAlpha = 0.75, t.strokeStyle = r, t.lineCap = "round", t.lineWidth = 8, t.beginPath(), t.moveTo(-n, -n), t.lineTo(n, -n), t.lineTo(n, n), t.stroke(), t.restore());
    }
    Bl(t, n, e, s, i, r) {
      __p_vU9y_ast(t.save(), t.globalAlpha = 1, t.lineWidth = i, t.strokeStyle = r, t.translate(n - An.myPlayer.offset.x, e - An.myPlayer.offset.y));
      const a = s / 2;
      __p_vU9y_ast(t.beginPath(), t.moveTo(-a, -a), t.lineTo(a, a), t.stroke(), t.beginPath(), t.moveTo(a, -a), t.lineTo(-a, a), t.stroke(), t.restore());
    }
    Ol(t) {
      if (t instanceof zt) {
        return H._notificationTracersColor;
      } else if (H._animalTracers && t.isAI) {
        return H._animalTracersColor;
      } else if (H._teammateTracers && t.isPlayer && An.myPlayer.Ll(t.sid)) {
        return H._teammateTracersColor;
      } else if (H._enemyTracers && t.isPlayer && An.myPlayer.ga(t.sid)) {
        return H._enemyTracersColor;
      } else {
        return null;
      }
    }
    _l(t, n, e) {
      const s = this.Ol(n);
      if (s === null) {
        return;
      }
      const i = new E(e.x, e.y);
      const r = new E(n.x, n.y);
      const a = getGlobal("P4jKmO").min(141, i.Qt(r) - 16);
      const o = i.angle(r);
      const l = i.$t(o, a);
      this.Rl(t, 8, l.x, l.y, o, s);
    }
    Kl(t, n, e) {
      var c;
      const s = new E(e.x, e.y);
      const i = new E(n.x, n.y);
      const r = An.ua.Xl(n.sid, !!n.isPlayer);
      if (r === null) {
        return;
      }
      const a = An.myPlayer.Je.nn;
      const o = r.Je.nn;
      c = a.Qt(o);
      const l = getGlobal("P057MO")(c.toFixed(2));
      c = undefined;
      const h = s.$t(s.angle(i), s.Qt(i) / 2);
      this.Nl(t, "[" + n.sid + "]: " + l, h.x, h.y);
    }
    Vl(t) {
      const n = t.owner?.sid;
      if (typeof n != "number") {
        return null;
      } else if (H._itemMarkers && An.myPlayer.Ja(n)) {
        return H._itemMarkersColor;
      } else if (H._teammateMarkers && An.myPlayer.Ll(n)) {
        return H._teammateMarkersColor;
      } else if (H._enemyMarkers && An.myPlayer.ga(n)) {
        return H._enemyMarkersColor;
      } else {
        return null;
      }
    }
    Al(t, n) {
      const e = this.Vl(n);
      if (e === null) {
        return;
      }
      const s = n.x + n.xWiggle - An.myPlayer.offset.x;
      const i = n.y + n.yWiggle - An.myPlayer.offset.y;
      __p_vU9y_ast(t.save(), t.strokeStyle = "#3b3b3b", t.lineWidth = 3, t.fillStyle = e, t.beginPath(), t.arc(s, i, 9, 0, getGlobal("P4jKmO").PI * 2), t.fill(), t.stroke(), t.closePath(), t.restore());
    }
    Wl(t, n, e, s, i, r = 8) {
      __p_vU9y_ast(t.fillStyle = "#3d3f42", this.roundRect(t, n, e, s, i, r), t.fill());
    }
    Zl(t, n, e, s, i, r, a) {
      const o = I.$;
      __p_vU9y_ast(t.fillStyle = a, this.roundRect(t, n + o, e + o, (s - o * 2) * r, i - o * 2, 7), t.fill());
    }
    Fl(t) {
      let n = 34;
      if (t === An.myPlayer && H._weaponXPBar) {
        n += 5;
      }
      if (H._playerTurretReloadBar) {
        n += 5;
      }
      if (H._weaponReloadBar) {
        n += 5;
      }
      return n;
    }
    Yl(t) {
      const {
        U: n,
        $: e
      } = I;
      let s = n;
      if (t.isPlayer) {
        const i = n - 4;
        const r = An.ua.$a.get(t.sid);
        if (r === undefined) {
          return s;
        }
        __p_vU9y_ast(r === An.myPlayer && H._weaponXPBar && (s += i - e), H._playerTurretReloadBar && (s += i - e), H._weaponReloadBar && (s += n - e));
      }
      return s;
    }
    Jl(t, n) {
      const {
        J: e,
        U: s,
        $: i
      } = I;
      const r = s - 4;
      const a = e + i;
      const o = n.scale + 34;
      const {
        myPlayer: l,
        ua: c
      } = An;
      let h = n.x - l.offset.x - a;
      let p = n.y - l.offset.y + o;
      t.save();
      const d = n.isPlayer && c.$a.get(n.sid);
      const u = n.isAI && c.Ul.get(n.sid);
      let m = 0;
      if (d instanceof wt) {
        const [n, e, o] = d.reload;
        if (d === l && H._weaponXPBar) {
          const n = ht.Oe(l.va.nn);
          const e = rt[l.ml(n.id).nn].color;
          const s = rt[l.ml(n.id).next].color;
          const o = l.Ql[n.itemType];
          __p_vU9y_ast(this.Wl(t, h, p, a * 2, r), this.Zl(t, h, p, a * 2, r, 1, e), this.Zl(t, h, p, a * 2, r, R(o.nn / o.max, 0, 1), s), m += r - i);
        }
        if (H._playerTurretReloadBar) {
          this.Wl(t, h, p + m, a * 2, r);
          this.Zl(t, h, p + m, a * 2, r, o.nn / o.max, H._playerTurretReloadBarColor);
          m += r - i;
        }
        if (H._weaponReloadBar) {
          const r = 2.25;
          __p_vU9y_ast(this.Wl(t, h, p + m, a * 2, s), this.Zl(t, h, p + m, a + r, s, n.nn / n.max, H._weaponReloadBarColor), this.Zl(t, h + a - r, p + m, a + r, s, e.nn / e.max, H._weaponReloadBarColor), m += s - i);
        }
      }
      const f = d || u;
      if (f) {
        ((t, n, e) => {
          t.yt = e;
        })(A(Zn, "config"), 0, this.Fl(f));
        const {
          ja: n,
          maxHealth: e
        } = f;
        const i = u ? e : 100;
        const r = c.$l(l, f) ? "#cc5151" : "#8ecc51";
        __p_vU9y_ast(this.Wl(t, h, p + m, a * 2, s), this.Zl(t, h, p + m, a * 2, s, n / i, r), m += s);
      }
      t.restore();
    }
    ql(t, n) {
      if (!H._renderHP) {
        return;
      }
      const {
        $: e,
        yt: s
      } = I;
      const i = this.Yl(n);
      let r = "HP " + getGlobal("P4jKmO").floor(n.health) + "/" + n.maxHealth;
      const a = n.scale + s + e + i;
      const {
        myPlayer: o
      } = An;
      const l = n.x - o.offset.x;
      const c = n.y - o.offset.y + a;
      __p_vU9y_ast(n.isPlayer && o.Ja(n.sid) && (r += " " + o.So + "/8"), t.save(), t.fillStyle = "#fff", t.strokeStyle = "#3d3f42", t.lineWidth = 8, t.lineJoin = "round", t.textBaseline = "top", t.font = "19px Hammersmith One", t.strokeText(r, l, c), t.fillText(r, l, c), t.restore());
    }
    tc(t, n, e, s, i, r = 0) {
      const a = n.x + n.xWiggle - An.myPlayer.offset.x;
      const o = n.y + n.yWiggle - An.myPlayer.offset.y;
      const l = I.U * 0.5;
      const c = 10 + l / 2;
      const h = c + 1 + r;
      t.save();
      t.translate(a, o);
      t.rotate(s);
      t.lineCap = "round";
      t.strokeStyle = "#3b3b3b";
      t.lineWidth = l;
      t.beginPath();
      t.arc(0, 0, h, 0, e * 2 * getGlobal("P4jKmO").PI);
      t.stroke();
      t.closePath();
      t.strokeStyle = i;
      t.lineWidth = l / 3;
      t.beginPath();
      t.arc(0, 0, h, 0, e * 2 * getGlobal("P4jKmO").PI);
      t.stroke();
      t.closePath();
      t.restore();
      return c - 3;
    }
  }();
  const xt = [{
    id: 0,
    src: "cow_1",
    nc: 0,
    ec: 150,
    health: 500,
    sc: 0.8,
    speed: 0.00095,
    turnSpeed: 0.001,
    scale: 72,
    drop: ["food", 50]
  }, {
    id: 1,
    src: "pig_1",
    nc: 0,
    ec: 200,
    health: 800,
    sc: 0.6,
    speed: 0.00085,
    turnSpeed: 0.001,
    scale: 72,
    drop: ["food", 80]
  }, {
    id: 2,
    name: "Bull",
    src: "bull_2",
    nc: 1,
    ve: 20,
    ec: 1000,
    health: 1800,
    sc: 0.5,
    speed: 0.00094,
    turnSpeed: 0.00074,
    scale: 78,
    rc: 800,
    ac: 1,
    drop: ["food", 100]
  }, {
    id: 3,
    name: "Bully",
    src: "bull_1",
    nc: 1,
    ve: 20,
    ec: 2000,
    health: 2800,
    sc: 0.45,
    speed: 0.001,
    turnSpeed: 0.0008,
    scale: 90,
    rc: 900,
    ac: 1,
    drop: ["food", 400]
  }, {
    id: 4,
    name: "Wolf",
    src: "wolf_1",
    nc: 1,
    ve: 8,
    ec: 500,
    health: 300,
    sc: 0.45,
    speed: 0.001,
    turnSpeed: 0.002,
    scale: 84,
    rc: 800,
    ac: 1,
    drop: ["food", 200]
  }, {
    id: 5,
    name: "Quack",
    src: "chicken_1",
    nc: 0,
    ve: 8,
    ec: 2000,
    oc: 1,
    health: 300,
    sc: 0.2,
    speed: 0.0018,
    turnSpeed: 0.006,
    scale: 70,
    drop: ["food", 100]
  }, {
    id: 6,
    name: "MOOSTAFA",
    lc: 50,
    src: "enemy",
    nc: 1,
    cc: 1,
    hc: 1,
    dc: 60000,
    oc: 1,
    uc: 100,
    ve: 40,
    ec: 8000, // eGeVaS
    health: 18000,
    sc: 0.4,
    speed: 0.0007,
    turnSpeed: 0.01,
    scale: 80,
    mc: 1.8,
    fc: 0.9,
    rc: 1000,
    gc: 210,
    yc: 1000,
    ac: 1,
    drop: ["food", 100]
  }, {
    id: 7,
    name: "Treasure",
    nc: 1,
    lc: 35,
    src: "crate_1",
    hc: 1,
    dc: 120000,
    uc: 200,
    ec: 5000,
    health: 20000,
    sc: 0.1,
    speed: 0,
    turnSpeed: 0,
    scale: 70,
    mc: 1
  }, {
    id: 8,
    name: "MOOFIE",
    src: "wolf_2",
    nc: 1,
    hc: 1,
    cc: 1,
    bc: 4,
    dc: 30000,
    oc: 1,
    lc: 35,
    ve: 10,
    uc: 100,
    ec: 3000,
    health: 7000,
    sc: 0.45,
    speed: 0.0015,
    turnSpeed: 0.002,
    scale: 90,
    rc: 800,
    ac: 1,
    drop: ["food", 1000]
  }, { // SaVeGe
    id: 9,
    name: "💀MOOFIE",
    src: "wolf_2",
    nc: 1,
    hc: 1,
    cc: 1,
    bc: 50,
    dc: 60000,
    oc: 1,
    lc: 35,
    ve: 12,
    uc: 100,
    ec: 3000,
    health: 9000,
    sc: 0.45,
    speed: 0.0015,
    turnSpeed: 0.0025,
    scale: 94,
    rc: 1440,
    ac: 1,
    drop: ["food", 3000],
    kc: 0.85,
    wc: 0.9
  }, {
    id: 10,
    name: "💀Wolf",
    src: "wolf_1",
    nc: 1,
    hc: 1,
    cc: 1,
    bc: 50,
    dc: 30000,
    ve: 10,
    ec: 700,
    health: 500,
    sc: 0.45,
    speed: 0.00115,
    turnSpeed: 0.0025,
    scale: 88,
    rc: 1440,
    ac: 1,
    drop: ["food", 400],
    kc: 0.85,
    wc: 0.9
  }, {
    id: 11,
    name: "💀Bully",
    src: "bull_1",
    nc: 1,
    hc: 1,
    cc: 1,
    bc: 50,
    ve: 20,
    ec: 5000,
    health: 5000,
    dc: 100000,
    sc: 0.45,
    speed: 0.00115,
    turnSpeed: 0.0025,
    scale: 94,
    rc: 1440,
    ac: 1,
    drop: ["food", 800],
    kc: 0.85,
    wc: 0.9
  }];
  const vt = [["orange", "red"], ["aqua", "blue"]];
  const Tt = new class {
    start = getGlobal("hmUPOQ").now();
    step = 0;
    Mc(t, n) {
      if (!H._weaponHitbox) {
        return;
      }
      const {
        myPlayer: e
      } = An;
      const s = e.va.nn;
      if (ht.Xe(s)) {
        const e = ht.Oe(s);
        Mt.Gl(t, n.x, n.y, e.range, "#f5cb42", 0.5, 1);
      }
    }
    xc(t) {
      if (!H._possiblePlacement) {
        return;
      }
      const {
        myPlayer: n,
        ModuleHandler: e
      } = An;
      const [s, i] = e.La;
      if (s === null || i === null) {
        return;
      }
      const r = n.Pa(s);
      if (r === null) {
        return;
      }
      const a = n.za(r);
      const o = it[r]; // eGeVaS
      for (let e = 0; e < i.length; e++) {
        const s = i[e];
        const r = n.Je.nn.$t(s, a);
        Mt.Gl(t, r.x, r.y, o.scale, "#80edf2", 0.4, 1);
      }
    }
    vc(t, n) {
      __p_vU9y_ast(Mt.Jl(t, n), Mt.ql(t, n));
    }
    Tc(t, n) {
      if (!H._weaponHitbox) {
        return;
      }
      const {
        ua: e
      } = An;
      const s = (n.isPlayer ? e.$a : e.Ul).get(n.sid);
      if (s !== undefined) {
        Mt.Gl(t, n.x, n.y, s.Ue, "#3f4ec4", 0.5, 1);
      }
      if (n.isAI && n.index === 6) {
        const e = xt[6];
        Mt.Gl(t, n.x, n.y, e.gc, "#f5cb42", 0.5, 1);
      }
    }
    Pc(t, n) {
      const {
        ua: e
      } = An;
      if (n.isPlayer) {
        const s = e.$a.get(n.sid);
        if (s !== undefined && s.ra !== 0) {
          const e = +s.wo;
          const i = +(s.ra >= 3);
          Mt.El(t, n.x, n.y, s.scale, vt[e][i], 0.3);
        }
      }
      if (n.isAI) {
        const s = e.Ul.get(n.sid);
        if (s) {
          const e = s.Ga ? "red" : "green";
          Mt.El(t, n.x, n.y, s.zc, e, 0.3);
        }
      }
    }
    render(t, n, e) {
      const s = getGlobal("hmUPOQ").now();
      __p_vU9y_ast(this.step = s - this.start, this.start = s);
      const {
        myPlayer: i,
        Sc: r,
        ModuleHandler: a,
        Ur: o,
        Dc: l
      } = An;
      const c = n === e;
      if (c) {
        const n = new E(e.x, e.y);
        __p_vU9y_ast(H._displayPlayerAngle && Mt.line(t, n, n.$t(An.myPlayer.angle, 70), "#e9adf0"), this.Mc(t, e), this.xc(t), i.ha && Mt.El(t, n.x, n.y, 35, "yellow", 0.5));
        const {
          Cc: s
        } = a.Hc.jc;
        const r = An.Sc.Lr;
        if (s !== null && r !== null) {
          Mt.line(t, n, s, "white", 0.6, 1);
          Mt.line(t, s, r.Je.nn, "white", 0.6, 1);
        }
      }
      this.vc(t, n);
      if (H._collisionHitbox) {
        Mt.Gl(t, n.x, n.y, n.scale, "#c7fff2", 0.5, 1);
      }
      if (!c) {
        __p_vU9y_ast(this.Tc(t, n), Mt._l(t, n, e), Mt.Kl(t, n, e));
        const s = r.Pr;
        if (s === null || n.isAI || n.sid !== s.id) {
          this.Pc(t, n);
        } else {
          Mt.El(t, n.x, n.y, 35, "#48f072", 0.5);
        }
        const i = r.rr;
        if (i && !n.isAI && n.sid === i.id) {
          Mt.El(t, n.x, n.y, 10, "#691313");
        }
      }
      if (c) {
        Dt.render(t, e);
      }
      const h = l.Ic;
      if (n.isPlayer && h !== null && n.sid === h.id) {
        Mt.Il(t, n);
        const {
          Gc: e
        } = a.Hc;
        if (e.active) {
          Mt.Gl(t, n.x, n.y, e.Ec, "#eda0ee", 0.4, 1);
          Mt.Gl(t, n.x, n.y, e.Nc, "#eda0ee", 0.4, 1);
        }
      }
      const {
        target: p,
        Rc: d,
        Bc: u
      } = a.Hc.Oc;
      if (n.isPlayer && p !== null && n.sid === p.id) {
        const s = getGlobal("P4jKmO").abs(u - d);
        const i = d + (u - d) / 2;
        const r = N(n.x, n.y, e.x, e.y);
        const a = n.x + getGlobal("P4jKmO").cos(r) * i;
        const o = n.y + getGlobal("P4jKmO").sin(r) * i;
        Mt.Gl(t, a, o, s, "#e25176", 0.5, 1);
      }
    }
  }();
  const Pt = Tt;
  class zt { // eGeVaS
    x;
    y;
    timeout = {
      value: 0,
      max: 2000
    };
    constructor(t, n) {
      __p_vU9y_ast(this.x = t, this.y = n);
    }
    animate() {
      const {
        value: t,
        max: n
      } = this.timeout;
      if (n > t) {
        this.timeout.value += Pt.step;
      } else {
        St.remove(this);
      }
    }
    render(t, n) {
      __p_vU9y_ast(this.animate(), Mt._l(t, this, n));
    }
  }
  const St = new class {
    notifications = new (getGlobal("tB9AKx"))();
    remove(t) {
      this.notifications.delete(t);
    }
    add(t) {
      const {
        x: n,
        y: e
      } = t.Je.nn;
      const s = new zt(n, e);
      this.notifications.add(s);
    }
    render(t, n) {
      for (const e of this.notifications) {
        e.render(t, n);
      }
    }
  }();
  const Dt = St;
  class Ct {
    Lc = 0;
    grid = new (getGlobal("pxsHd3"))();
    constructor(t) {
      this.Lc = t;
    }
    _getKey(t, n) {
      return t << 16 | n;
    }
    clear() {
      this.grid.clear();
    }
    _c(t, n, e, s) {
      const i = (t - e) / this.Lc | 0;
      const r = (n - e) / this.Lc | 0;
      const a = (t + e) / this.Lc | 0;
      const o = (n + e) / this.Lc | 0;
      for (let t = i; a >= t; t++) {
        for (let n = r; o >= n; n++) {
          const e = this._getKey(t, n);
          __p_vU9y_ast(this.grid.has(e) || this.grid.set(e, new (getGlobal("tB9AKx"))()), this.grid.get(e).add(s));
        }
      }
    }
    query(t, n, e = 1, s) {
      const i = t / this.Lc | 0;
      const r = n / this.Lc | 0;
      const a = new (getGlobal("tB9AKx"))();
      let o = 0;
      c: for (let t = -e; e >= t; t++) {
        for (let n = -e; e >= n; n++) {
          const e = this._getKey(i + t, r + n);
          if (this.grid.has(e)) {
            for (const t of this.grid.get(e)) {
              if (!a.has(t) && (a.add(t), s(t))) {
                o = 1;
                break c;
              }
            }
          }
        }
      }
      return o;
    }
    Kc(t, n, e = 1) {
      const s = t / this.Lc | 0;
      const i = n / this.Lc | 0;
      const r = new (getGlobal("tB9AKx"))();
      for (let t = -e; e >= t; t++) {
        for (let n = -e; e >= n; n++) {
          const e = this._getKey(s + t, i + n);
          if (this.grid.has(e)) {
            for (const t of this.grid.get(e)) {
              r.add(t);
            }
          }
        }
      }
      return getGlobal("__pdLQV").from(r);
    }
    remove(t, n, e, s) {
      const i = (t - e) / this.Lc | 0;
      const r = (n - e) / this.Lc | 0;
      const a = (t + e) / this.Lc | 0;
      const o = (n + e) / this.Lc | 0;
      for (let t = i; a >= t; t++) {
        for (let n = r; o >= n; n++) {
          const e = this._getKey(t, n);
          if (this.grid.has(e)) {
            const t = this.grid.get(e);
            __p_vU9y_ast(t.delete(s), t.size === 0 && this.grid.delete(e));
          }
        }
      }
    }
  }
  const jt = class {
    static Xc(t, n, e) {
      return (s, i) => {
        return t.position[n].Ut(s.position[e]) - t.position[n].Ut(i.position[e]);
      };
    }
    static Vc(t) {
      return (n, e) => {
        return O(n, t) - O(e, t);
      };
    }
    static Ac(t, n) {
      return n.ra - t.ra;
    }
  };
  const Ht = class {
    fa = new (getGlobal("pxsHd3"))();
    ma = new Ct(100);
    Wc = new (getGlobal("pxsHd3"))();
    Zc = new (getGlobal("pxsHd3"))();
    Wi;
    constructor(t) {
      this.Wi = t;
    }
    Fc(t) {
      this.ma._c(t.Je.nn.x, t.Je.nn.y, t.$e, t.id);
      this.fa.set(t.id, t);
      if (t instanceof ut) {
        const {
          ua: n,
          myPlayer: e
        } = this.Wi;
        const s = n.$a.get(t.es) || n.qa({
          id: t.es
        });
        __p_vU9y_ast(t.us = this.Yc(t), s.al(t), t.type === 22 && (e.Yi(t, 1) || e.Yi(t, 4)) && (e.ka.Ft(t.Je.nn), e.wa = 1));
      }
    }
    Jc(t) {
      for (let n = 0; n < t.length; n += 8) {
        const e = t[n + 6] === null;
        const s = [t[n + 0], t[n + 1], t[n + 2], t[n + 3], t[n + 4]];
        this.Fc(e ? new dt(...s, t[n + 5]) : new ut(...s, t[n + 6], t[n + 7]));
      }
    }
    Uc = new (getGlobal("tB9AKx"))();
    Jr() {
      return this.Uc.size !== 0;
    }
    Qc(t) {
      this.ma.remove(t.Je.nn.x, t.Je.nn.y, t.$e, t.id);
      this.fa.delete(t.id);
      if (t instanceof ut) {
        const n = this.Wi.ua.$a.get(t.es);
        if (n !== undefined) {
          n.hl(t);
          const {
            myPlayer: e
          } = this.Wi;
          const s = t.Je.nn.Jt();
          const i = this.Wi.myPlayer.Je.nn.Jt();
          const r = s.Qt(i);
          const a = e.Pa(4);
          if (!(r > e.za(a) + t.qe + e.speed + 25)) {
            this.Uc.add(t);
          }
        }
      }
    }
    $c(t) {
      const n = this.fa.get(t);
      if (n !== undefined && (this.Qc(n), this.Wi.Ua)) {
        const t = n.Je.nn.Jt();
        const e = this.Wi.myPlayer.Je.nn.Jt();
        if (H._notificationTracers && !((t, n, e) => {
          var i;
          var r;
          var a;
          const s = new E(1920, 1080).div(2).add(e);
          i = t;
          r = n.Jt().sub(s);
          a = n.Jt().add(s);
          return !(i.x < r.x) && !(i.x > a.x) && !(i.y < r.y) && !(i.y > a.y);
          __p_vU9y_ast(i = undefined, r = undefined, a = undefined);
        })(t, e, n.scale)) {
          Dt.add(n);
        }
      }
    }
    qc(t) {
      for (const n of t.fa) {
        this.Qc(n);
      }
    }
    ol(t) {
      const n = this.fa.get(t);
      if (n instanceof ut) {
        n.reload = 0;
        this.Wc.set(t, n);
      }
    }
    th(t) {
      if (t instanceof ut && !this.Wi.myPlayer.ga(t.es)) {
        return 0;
      } else {
        return 1;
      }
    }
    nh(t, n = 1) {
      const e = this.Wc.get(t.id);
      if (e === undefined) {
        return 1;
      } else {
        return e.reload > e.ls - n;
      }
    }
    eh() {
      for (const [t, n] of this.Wc) {
        __p_vU9y_ast(n.reload += 1, n.reload < n.ls || (n.reload = n.ls, this.Wc.delete(t)));
      }
    }
    sh(t, n, e = 0) {
      if (t !== 18 && U(n)) {
        return 0;
      }
      const s = it[t];
      return !this.ma.query(n.x, n.y, 1, t => {
        const i = this.fa.get(t);
        const r = s.scale + i.qe + e;
        if (n.Qt(i.Je.nn) < r) {
          return 1;
        }
      });
    }
    Yc(t) {
      const n = this.Wi.ua.$a.get(t.es);
      if (n === undefined || !this.Wi.ua.Ya.includes(n)) {
        return 0;
      }
      const {
        ys: e,
        nn: s,
        Xi: i
      } = n.Je;
      const r = t.Je.nn;
      const a = it[t.type];
      const o = n.scale * 2 + a.scale + a.Ln;
      return e.Qt(r) <= o || s.Qt(r) <= o || i.Qt(r) <= o;
    }
    Aa(t) {
      const {
        position: n,
        id: e,
        Wa: s,
        Za: i,
        reduce: r,
        Fa: a,
        fill: o
      } = t;
      const l = ht.getItem(e);
      const {
        myPlayer: c,
        ModuleHandler: h
      } = this.Wi;
      const p = c.za(e);
      const d = [];
      const u = [];
      this.ma.query(n.x, n.y, 1, t => {
        const e = this.fa.get(t);
        if (i !== null && i === e.id) {
          return;
        }
        const s = e.Je.nn;
        const r = n.angle(s);
        const o = e.qe + l.scale + 1;
        const c = n.Qt(s);
        const h = (c * c + p * p - o * o) / (c * 2 * p);
        let m;
        if (h < -1) {
          m = getGlobal("P4jKmO").PI;
        } else {
          if (h > 1) {
            return;
          }
          m = getGlobal("P4jKmO").acos(h);
        }
        if (a && e instanceof ut && e.hs) {
          u.push([r, m]);
        } else {
          d.push([r, m]);
        }
      });
      let m = $(d);
      if (a && u.length > 0) {
        const t = $([...d, ...u]);
        m = [...new (getGlobal("tB9AKx"))([...m, ...t])];
      }
      if (!d.some(([t, n]) => {
        return O(s, t) <= n;
      }) && (m.push(s), m.length === 1 && o)) {
        if (l.itemType === 4) {
          return [];
        }
        const t = getGlobal("P4jKmO").asin((l.scale * 2 + 1) / (p * 2)) * 2;
        m.push(s - t);
        m.push(s + t);
        m.push(V(s));
        return m.slice(0, H._placeAttempts);
      }
      let f = m.sort(jt.Vc(s));
      if (r) {
        if (!ht.Ye(e) && h.Vi !== null && c.speed !== 0) {
          const t = l.scale;
          const n = getGlobal("P4jKmO").asin(t * 2 / (p * 2));
          f = f.filter(t => {
            return O(t, h.Vi) > n;
          });
        }
        return f.slice(0, H._placeAttempts);
      }
      return f;
    }
  };
  class It {
    Wi;
    ih = null;
    rh = null;
    ah = 0;
    constructor(t) {
      __p_vU9y_ast(this.Wi = t, this.Wi.Ua && getGlobal("i8lsV5")(() => {
        __p_vU9y_ast(ft.mi(this.ah), this.ah = 0);
      }, 1000));
    }
    send(t) {
      const {
        oh: n,
        hh: e
      } = this.Wi.kl;
      if (n === null || n.readyState !== n.OPEN || this.ih === null || e === null) {
        return;
      }
      const [s, ...i] = t;
      __p_vU9y_ast(e(this.ih.encode([s, i])), this.Wi.Ua && (this.ah += 1));
    }
    Ei(t, n) {
      this.send(["P", t, +n]);
    }
    ph(t) {
      this.send(["Q", t]);
    }
    dh(t) {
      this.send(["b", t]);
    }
    uh(t) {
      this.send(["L", t]);
    }
    mh() {
      __p_vU9y_ast(this.Wi.myPlayer.Ni.length = 0, this.send(["N"]));
    }
    equip(t, n) {
      this.send(["c", 0, n, t]);
    }
    buy(t, n) {
      this.send(["c", 1, n, t]);
    }
    li(t) {
      this.send(["6", t]);
    }
    attack(t) {
      this.send(["F", 1, t]);
    }
    fh() {
      this.send(["F", 0, null]);
    }
    gh() {
      this.send(["e"]);
    }
    move(t) {
      this.send(["9", t]);
    }
    yh() {
      this.send(["K", 1]);
    }
    bh() {
      this.send(["K", 0]);
    }
    kh() {
      this.send(["S"]);
    }
    wh(t, n) {
      this.send(["z", t, n]);
    }
    Mh(t, n, e) {
      this.send(["M", {
        name: t,
        moofoll: n,
        skin: e
      }]);
    }
    upgradeItem(t) {
      this.send(["H", t]);
    }
    xh(t) {
      this.send(["D", t]);
    }
    Th() {
      __p_vU9y_ast(this.Wi.kl.Ph = getGlobal("ix4Bs1").now(), this.send(["0"]));
    }
  }
  const Gt = class extends gt {
    type;
    zh = 0;
    ja = 0;
    Do = 0;
    maxHealth = 0;
    Ga = 0;
    Sh = 0;
    isPlayer = 0;
    constructor(t) {
      super(t);
    }
    Dh() {
      return !("oc" in xt[this.type]);
    }
    update(t, n, e, s, i, r, a) {
      __p_vU9y_ast(this.id = t, this.type = n, this.Je.ys.Ft(this.Je.nn), this.Je.nn.setXY(e, s), this.Ai());
      const o = xt[n];
      __p_vU9y_ast(this.angle = i, this.zh = this.ja, this.ja = r, this.maxHealth = o.health, this.scale = o.scale);
      const l = o.nc && n !== 7;
      __p_vU9y_ast(this.Sh = o.nc, this.Ga = l, this.Do = 0);
      const c = getGlobal("P4jKmO").abs(this.ja - this.zh);
      if (this.ja < this.zh) {
        this.Do = c;
      }
    }
    get zc() {
      if (this.type === 6) {
        return xt[this.type].gc + I.ut;
      } else {
        return this.scale;
      }
    }
    get Ea() {
      if (this.type === 6) {
        return xt[this.type].gc + I.ut;
      } else {
        return this.scale + 60;
      }
    }
    get Ha() {
      return this.Sh;
    }
  };
  const Et = new class {
    frame;
    Ch = null;
    jh = null;
    Hh;
    Ih = 0;
    Gh = 0;
    Eh = 1;
    get Nh() {
      return this.Ih;
    }
    Rh() {
      return this.Ch || this.jh;
    }
    Bh() {
      return "\n            <!DOCTYPE html>\n            <style>@import \"https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;600;800&display=swap\";\r\n* {\r\n    user-select: none;\r\n}\r\nheader {\r\n    display: flex;\r\n    justify-content: space-between;\r\n    align-items: center;\r\n    height: 45px;\r\n    background: #121212;\r\n    padding: 10px;\r\n    border-radius: 6px;\r\n}\r\nheader .page-title {\r\n    font-size: 2.3em;\r\n}\r\nheader #credits {\r\n    display: flex;\r\n    justify-content: space-between;\r\n    gap: 10px;\r\n    height: 45px;\r\n}\r\nheader #credits p {\r\n    margin-top: auto;\r\n}\r\nheader #logo {\r\n    display: block;\r\n    width: auto;\r\n    height: 100%;\r\n    scale: 1.2;\r\n}\r\nheader #close-button {\r\n    display: block;\r\n    fill: #adadad;\r\n    cursor: pointer;\r\n    width: auto;\r\n    height: 100%;\r\n    transition: fill 200ms;\r\n}\r\nheader #close-button:hover {\r\n    fill: #ebebeb;\r\n}\r\n@keyframes ripple {\r\n    from {\r\n        opacity: 1;\r\n        transform: scale(0);\r\n    }\r\n    to {\r\n        opacity: 0;\r\n        transform: scale(0.7);\r\n    }\r\n}\r\n#navbar-container {\r\n    display: flex;\r\n    flex-direction: column;\r\n    background: #121212;\r\n    padding: 10px;\r\n    border-radius: 6px;\r\n    row-gap: 3px;\r\n}\r\n#navbar-container .open-menu {\r\n    position: relative;\r\n    width: 8.5em;\r\n    height: 3.2em;\r\n    background: #0d0d0d;\r\n    font-weight: 800;\r\n    font-size: 1.3em;\r\n    overflow: hidden;\r\n    transition: all 400ms;\r\n\r\n    display: flex;\r\n    justify-content: left;\r\n    align-items: center;\r\n    padding: 0px 25px;\r\n    border-radius: 3px;\r\n    border: 1px solid rgba(255, 255, 255, 0.05);\r\n}\r\n\r\n.open-menu > span {\r\n    display: flex;\r\n    justify-content: left;\r\n    align-items: center;\r\n    gap: 10px;\r\n    transition: all 300ms;\r\n    pointer-events: none;\r\n}\r\n\r\n.open-menu:hover {\r\n    background: #3d3d3d;\r\n}\r\n\r\n.open-menu:hover span {\r\n    transform: translateY(-2px);\r\n}\r\n\r\n.open-menu.active {\r\n    background: #3d3d3d;\r\n    pointer-events: none;\r\n}\r\n#navbar-container .open-menu.bottom-align {\r\n    margin-top: auto;\r\n}\r\n#navbar-container .open-menu .ripple {\r\n    position: absolute;\r\n    z-index: 5;\r\n    background: rgba(255, 255, 255, 0.4);\r\n    top: 0;\r\n    left: 0;\r\n    border-radius: 50%;\r\n    opacity: 0;\r\n    animation: ripple 800ms;\r\n    pointer-events: none;\r\n}\r\n@keyframes toclose {\r\n    from {\r\n        opacity: 1;\r\n        transform: scale(1);\r\n    }\r\n    to {\r\n        opacity: 0;\r\n        transform: scale(0);\r\n    }\r\n}\r\n@keyframes toopen {\r\n    from {\r\n        opacity: 0;\r\n        transform: scale(0);\r\n    }\r\n    to {\r\n        opacity: 1;\r\n        transform: scale(1);\r\n    }\r\n}\r\n@keyframes appear {\r\n    from {\r\n        opacity: 0;\r\n    }\r\n    to {\r\n        opacity: 1;\r\n    }\r\n}\r\n#page-container {\r\n    width: 100%;\r\n    height: 100%;\r\n    overflow-y: scroll;\r\n}\r\n.menu-page {\r\n    background: #121212;\r\n    padding: 10px;\r\n    border-radius: 6px;\r\n    display: none;\r\n}\r\n.menu-page.opened {\r\n    display: block;\r\n}\r\n.menu-page .page-title {\r\n    font-size: 2.8em;\r\n}\r\n.menu-page > .section {\r\n    margin-top: 20px;\r\n    background: #0d0d0d;\r\n    padding: 15px;\r\n    border-radius: 6px;\r\n}\r\n.menu-page > .section .section-title {\r\n    font-weight: 800;\r\n    font-size: 1.8em;\r\n    color: #999;\r\n    margin-bottom: 10px;\r\n}\r\n.section-content {\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 5px;\r\n}\r\n.small-section {\r\n    gap: 0px;\r\n    font-size: 0.85rem;\r\n}\r\n.menu-page > .section .section-content.split {\r\n    display: flex;\r\n    justify-content: space-between;\r\n    flex-direction: row;\r\n    column-gap: 30px;\r\n}\r\n.menu-page > .section .section-content .content-split {\r\n    width: 50%;\r\n    display: flex;\r\n    flex-direction: column;\r\n    row-gap: 10px;\r\n}\r\n.menu-page > .section .section-content .content-option {\r\n    display: flex;\r\n    justify-content: space-between;\r\n    align-items: center;\r\n    min-height: 40px;\r\n    padding: 3px 10px;\r\n    transition: background 300ms;\r\n    border-radius: 8px;\r\n}\r\n.content-option:hover {\r\n    background: rgba(65, 65, 65, 0.25);\r\n}\r\n.option-description {\r\n    position: absolute;\r\n    z-index: 99;\r\n    visibility: hidden;\r\n    background: #2a2a2a;\r\n    padding: 8px;\r\n    border-radius: 6px;\r\n    font-weight: 600;\r\n    pointer-events: none;\r\n    max-width: 300px;\r\n}\r\n.description-show {\r\n    visibility: visible;\r\n}\r\n.menu-page > .section .content-option.centered {\r\n    display: flex;\r\n    justify-content: center;\r\n}\r\n.menu-page > .section .section-content .content-option .option-title {\r\n    font-weight: 800;\r\n    font-size: 1.4em;\r\n    color: #585858;\r\n    transition: color 300ms;\r\n}\r\n.menu-page > .section .section-content .content-option .option-content {\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n    column-gap: 10px;\r\n}\r\n.menu-page > .section .section-content .content-option .disconnect-button {\r\n    width: 30px;\r\n    height: 30px;\r\n    cursor: pointer;\r\n    fill: rgba(122, 49, 49, 0.4784313725);\r\n    transition: fill 300ms;\r\n}\r\n.menu-page > .section .section-content .content-option:hover .option-title {\r\n    color: #7e7d7d;\r\n}\r\n.menu-page > .section .section-content .content-option:hover .disconnect-button {\r\n    fill: #7a3131;\r\n}\r\n.menu-page > .section .section-content .content-option:hover .disconnect-button:hover {\r\n    fill: #893333;\r\n}\r\n.menu-page > .section .section-content .text {\r\n    display: flex;\r\n    justify-content: left;\r\n    gap: 10px;\r\n}\r\n.menu-page > .section .section-content .text .text-value {\r\n    color: #857f7f;\r\n    font-weight: 800;\r\n    font-size: 1.5em;\r\n}\r\n.simplified {\r\n    font-weight: 600!important;\r\n    font-size: 1.2em!important;\r\n    word-spacing: 2px;\r\n}\r\n.highlight {\r\n    color: #bab5b5;\r\n}\r\n.menu-page > .section .option-button {\r\n    width: 117px;\r\n    height: 45px;\r\n    background: #303030;\r\n    border: 5px solid #262626;\r\n    border-radius: 6px;\r\n    font-weight: 800;\r\n    font-size: 1.1em;\r\n    color: #7e7d7d;\r\n    transition: background 300ms, border-color 300ms;\r\n}\r\n#bot-container {\r\n    margin-top: 10px;\r\n}\r\n.menu-page > .section .option-button:hover {\r\n    background: #383838;\r\n    border-color: #2c2c2c;\r\n}\r\n.menu-page > .section .section-content .hotkeyInput {\r\n    width: 90px;\r\n    height: 40px;\r\n    background: #303030;\r\n    border: 5px solid #262626;\r\n    border-radius: 6px;\r\n    font-weight: 800;\r\n    font-size: 1.1em;\r\n    color: #7e7d7d;\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n    transition: background 300ms, border-color 300ms, color 300ms;\r\n}\r\n.menu-page > .section .section-content .hotkeyInput:hover {\r\n    background: #383838;\r\n    border-color: #2c2c2c;\r\n}\r\n.menu-page > .section .section-content .hotkeyInput.active {\r\n    background: #404040;\r\n    border-color: #303030;\r\n}\r\n.menu-page > .section .section-content .hotkeyInput.red {\r\n    background: #7a3131;\r\n    border-color: #672929;\r\n    color: #b57272;\r\n}\r\n.menu-page > .section .section-content .hotkeyInput.red:hover {\r\n    background: #893333;\r\n    border-color: #712d2d;\r\n}\r\n.menu-page > .section .section-content .hotkeyInput.red.active {\r\n    background: #923939;\r\n    border-color: #712d2d;\r\n}\r\n.menu-page > .section .section-content .switch-checkbox {\r\n    position: relative;\r\n    width: 90px;\r\n    height: 34px;\r\n}\r\n.menu-page > .section .section-content .switch-checkbox input {\r\n    width: 0;\r\n    height: 0;\r\n    opacity: 0;\r\n}\r\n.input {\r\n    outline: 3px solid transparent;\r\n    border: none;\r\n    text-align: center;\r\n    padding: 0;\r\n    margin: 0;\r\n\r\n    width: 225px;\r\n    height: 30px;\r\n    background: #303030;\r\n    box-shadow: 0px -6px 0px 0px #262626 inset;\r\n    border-radius: 6px;\r\n    font-weight: 800;\r\n    font-size: 1.1em;\r\n    color: #7e7d7d;\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n    transition: background 300ms, border-color 300ms, color 300ms, outline 300ms;\r\n}\r\n.input:focus {\r\n    outline: 3px solid #6e6e6e;\r\n}\r\n.menu-page > .section .section-content .switch-checkbox input:checked + span {\r\n    background: #404040;\r\n    box-shadow: 0px -17px 0px 0px #353535 inset;\r\n}\r\n.menu-page > .section .section-content .switch-checkbox input:checked + span:before {\r\n    transform: translateX(50px) scale(0.6);\r\n    background: #7e7d7d;\r\n}\r\n.menu-page > .section .section-content .switch-checkbox span {\r\n    position: absolute;\r\n    cursor: pointer;\r\n    top: 0;\r\n    left: 0;\r\n    bottom: 0;\r\n    right: 0;\r\n    width: 100%;\r\n    height: 100%;\r\n    display: flex;\r\n    align-items: center;\r\n    background: #303030;\r\n    border-radius: 6px;\r\n    box-shadow: 0px -17px 0px 0px #2a2a2a inset;\r\n}\r\n.menu-page > .section .section-content .switch-checkbox span:before {\r\n    position: absolute;\r\n    content: \"\";\r\n    transform: scale(0.6);\r\n    transition: transform 300ms;\r\n    width: 40px;\r\n    height: 40px;\r\n    border-radius: 6px;\r\n    background: #585858;\r\n}\r\n.menu-page > .section .section-content input[id][type=\"color\"] {\r\n    width: 60px;\r\n    height: 33.3333333333px;\r\n    outline: none;\r\n    border: none;\r\n    padding: 3px;\r\n    margin: 0;\r\n    background: #303030;\r\n    border-radius: 6px;\r\n    cursor: pointer;\r\n}\r\n.menu-page > .section .section-content .reset-color {\r\n    background: var(--data-color);\r\n    width: 10px;\r\n    height: 10px;\r\n    border-radius: 50%;\r\n}\r\n.menu-page > .section .section-content .slider {\r\n    position: relative;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    gap: 10px;\r\n}\r\n.menu-page > .section .section-content .slider input {\r\n    appearance: none;\r\n    outline: none;\r\n    cursor: pointer;\r\n    padding: 0;\r\n    margin: 0;\r\n    border: none;\r\n    width: 144px;\r\n    height: 30px;\r\n    background: #404040;\r\n    box-shadow: 0px -15px 0px 0px #353535 inset;\r\n    border-radius: 6px;\r\n}\r\n.menu-page > .section .section-content .slider input::-webkit-slider-thumb {\r\n    -webkit-appearance: none;\r\n    transform: scale(0.7);\r\n    width: 30px;\r\n    height: 30px;\r\n    background: #7e7d7d;\r\n    border-radius: 6px;\r\n}\r\n.menu-page > .section .section-content .slider .slider-value {\r\n    color: #585858;\r\n    font-weight: 800;\r\n    font-size: 1.4em;\r\n    opacity: 0.4;\r\n}\r\n@keyframes toclose {\r\n    from {\r\n        opacity: 1;\r\n        transform: scale(1);\r\n    }\r\n    to {\r\n        opacity: 0;\r\n        transform: scale(0);\r\n    }\r\n}\r\n@keyframes toopen {\r\n    from {\r\n        opacity: 0;\r\n        transform: scale(0);\r\n    }\r\n    to {\r\n        opacity: 1;\r\n        transform: scale(1);\r\n    }\r\n}\r\n@keyframes appear {\r\n    from {\r\n        opacity: 0;\r\n    }\r\n    to {\r\n        opacity: 1;\r\n    }\r\n}\r\n.left-flex {\r\n    display: flex;\r\n    justify-content: left!important;\r\n    gap: 10px;\r\n}\r\nhtml,\r\nbody {\r\n    margin: 0;\r\n    padding: 0;\r\n    scrollbar-width: thin;\r\n    scrollbar-track-color: #303030;\r\n    scrollbar-face-color: #262626;\r\n    overflow: hidden;\r\n}\r\n* {\r\n    font-family: \"Noto Sans\", sans-serif;\r\n    color: #f1f1f1;\r\n}\r\nh1, .page-title {\r\n    font-weight: 800;\r\n    margin: 0;\r\n}\r\nh2 {\r\n    margin: 0;\r\n}\r\np {\r\n    font-weight: 800;\r\n    font-size: 1.1rem;\r\n    margin: 0;\r\n    color: #b8b8b8;\r\n}\r\nbutton {\r\n    border: none;\r\n    outline: none;\r\n    cursor: pointer;\r\n}\r\n#menu-container {\r\n    position: absolute;\r\n    top: 50%;\r\n    left: 50%;\r\n    transform: translate(-50%, -50%);\r\n    width: 1280px;\r\n    height: 720px;\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n}\r\n#menu-container.transparent #menu-wrapper {\r\n    background: rgba(8, 8, 8, 0.6);\r\n    backdrop-filter: blur(3px);\r\n    box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);\r\n}\r\n#menu-container.transparent header,\r\n#menu-container.transparent .menu-page,\r\n#menu-container.transparent #navbar-container {\r\n    background: rgba(18, 18, 18, 0.5882352941);\r\n}\r\n#menu-container.transparent .section {\r\n    background: rgba(13, 13, 13, 0.462745098);\r\n}\r\n#menu-container.transparent .open-menu {\r\n    background: rgba(13, 13, 13, 0.462745098);\r\n}\r\n#menu-container.transparent .open-menu:hover,\r\n#menu-container.transparent .open-menu.active {\r\n    background: rgba(61, 61, 61, 0.6039215686);\r\n}\r\n#menu-wrapper {\r\n    position: relative;\r\n    display: flex;\r\n    flex-direction: column;\r\n    row-gap: 5px;\r\n    width: 85%;\r\n    height: 85%;\r\n    padding: 10px;\r\n    border-radius: 6px;\r\n    background: #080808;\r\n}\r\n#menu-wrapper.toclose {\r\n    animation: 150ms ease-in toclose forwards;\r\n}\r\n#menu-wrapper.toopen {\r\n    animation: 150ms ease-in toopen forwards;\r\n}\r\nmain {\r\n    display: flex;\r\n    column-gap: 10px;\r\n    width: 100%;\r\n    height: calc(100% - 75px);\r\n}\r\n::-webkit-scrollbar {\r\n    width: 12px;\r\n}\r\n::-webkit-scrollbar-track {\r\n    background: #303030;\r\n    border-radius: 6px;\r\n}\r\n::-webkit-scrollbar-thumb {\r\n    background: #262626;\r\n    border-radius: 6px;\r\n}\r\n.icon {\r\n    width: 50px;\r\n    height: 50px;\r\n}\r\n.small-icon {\r\n    width: 22px;\r\n    height: 22px;\r\n}</style>\n            <div id=\"menu-container\" class=\"transparent\">\n                <div id=\"menu-wrapper\">\n                    <header>\r\n    <div id=\"credits\">\r\n        <svg version=\"1.1\" id=\"logo\" viewBox=\"0 0 1024 1024\" xmlns=\"http://www.w3.org/2000/svg\">\r\n        <path transform=\"translate(868.08 108.59)\" d=\"m0 0c0.70463-0.0067323 1.4093-0.013465 2.1352-0.020401 6.4762 0.12104 11.035 2.1066 15.783 6.4267 6.7355 7.1685 7.4975 15.175 7.2769 24.712-0.32818 6.7315-1.9685 13.117-3.7144 19.6-0.39653 1.5245-0.79241 3.0492-1.1877 4.574-15.141 57.747-33.221 114.75-51.15 171.68-0.77339 2.4566-1.5457 4.9135-2.3178 7.3705-4.8024 15.273-9.6359 30.535-14.809 45.687-0.51513 1.5277-0.51513 1.5277-1.0407 3.0862-5.8617 16.918-5.8617 16.918-12.244 22.918-0.67418 0.65227-1.3484 1.3045-2.043 1.9766-1.7695 1.3984-1.7695 1.3984-3.7695 1.3984v2c-2.0273 1.7234-4.0653 3.3381-6.1875 4.9375-4.8734 3.7442-9.6517 7.5565-14.312 11.562-4.471 3.8341-9.032 7.5173-13.688 11.125-4.9944 3.8756-9.7402 7.9242-14.398 12.203-3.3976 3.0568-6.9447 5.9139-10.496 8.7891-3.7343 3.0494-7.405 6.1702-11.077 9.2942-3.4521 2.9308-6.943 5.8055-10.466 8.6511-4.7271 3.842-9.2068 7.9069-13.688 12.031-3.2993 2.954-6.7453 5.6796-10.227 8.4141-3.423 2.771-6.6461 5.7432-9.8984 8.7109-2.6078 2.3215-5.2829 4.5266-8 6.7188-4.7768 3.8631-9.302 7.9416-13.82 12.102-2.6423 2.3713-5.3491 4.6135-8.1172 6.8359-4.2031 3.3889-8.1871 6.9374-12.125 10.625-4.7712 4.4679-9.6791 8.6676-14.785 12.754-3.9854 3.2972-7.737 6.8279-11.5 10.375-2.2148 1.8711-2.2148 1.8711-4.2148 1.8711v2c-1.2227 1.2695-1.2227 1.2695-3.0625 2.8125-0.72574 0.61746-1.4515 1.2349-2.1992 1.8711-0.90363 0.76441-1.8073 1.5288-2.7383 2.3164-2.4635 2.119-4.9193 4.2469-7.375 6.375-0.6546 0.56598-1.3092 1.132-1.9836 1.7151-3.6698 3.1784-7.3014 6.3911-10.891 9.6599-3.2287 2.9318-6.5326 5.7126-9.9375 8.4375-5.3248 4.3005-10.273 8.933-15.238 13.637-4.625 4.3579-9.3867 8.402-14.403 12.308-2.0969 1.8028-3.6149 3.5924-5.1719 5.8672 5.208 2.3208 10.456 4.2336 15.875 6 4.5547 1.5 4.5547 1.5 6.8157 2.2454 1.6015 0.52332 3.2057 1.0382 4.812 1.5464 0.80478 0.25822 1.6096 0.51643 2.4387 0.78247 0.72905 0.23034 1.4581 0.46068 2.2092 0.698 2.6191 1.0307 3.9951 2.6343 5.8494 4.7278 1.2792 0.95451 2.5725 1.8902 3.875 2.8125 7.5329 5.5831 11.921 11.63 13.938 20.938 1.1447 13.632-5.9612 26.77-14.188 37.188-15.306 17.463-37.523 33.314-58.625 43.062h-2l-1 2c-9.832 3.3392-20.457 3.193-30-1-9.0874-4.8402-17.029-11.545-25-18-1.0018-0.81042-1.0018-0.81042-2.0239-1.6372-3.4276-2.7755-6.85-5.5573-10.269-8.3433-4.5453-3.7035-9.0945-7.3997-13.707-11.02-0.64324-0.51434-1.2865-1.0287-1.9492-1.5586-3.6186-2.7709-6.4181-4.8196-11.051-4.4414-3.0465 1.9411-5.465 4.4432-8 7-0.89461 0.87012-1.7892 1.7402-2.7109 2.6367-4.6551 4.5722-9.1144 9.2354-13.348 14.203-2.5425 2.829-5.236 5.4878-7.9414 8.1602-3.2221 3.1829-6.3905 6.3469-9.3125 9.8125-4.0741 4.7984-8.604 9.1542-13.095 13.558-3.1238 3.0815-6.1309 6.1991-8.991 9.5281-4.0078 4.6483-8.3527 8.9253-12.727 13.227-2.9835 2.9345-5.9455 5.8865-8.875 8.875-0.54793 0.5431-1.0959 1.0862-1.6604 1.6458-2.4213 2.5837-3.3138 4.1479-3.7576 7.6941 0.076055 1.1872 0.15211 2.3745 0.23047 3.5977 0.047874 1.3357 0.088031 2.6717 0.12109 4.0078 0.017886 0.67579 0.035771 1.3516 0.054199 2.0479 0.13648 22.438-9.8287 42.623-25.238 58.386-16.639 15.859-38.194 21.12-60.574 20.77-32.474-0.91475-58.907-15.915-81.383-38.352-17.614-18.76-26.234-43.914-27.043-69.359 0.81801-25.407 10.042-46.905 28.438-64.625 12.128-10.629 27.322-17.522 43.197-20.087 8.9085-1.4767 13.784-3.2843 19.51-10.745 0.6948-0.98355 1.3896-1.9671 2.1055-2.9805 1.4259-1.7595 2.8634-3.5096 4.3125-5.25 0.72832-0.90105 1.4566-1.8021 2.207-2.7305 7.2516-8.8275 14.851-17.375 22.516-25.844 3.9882-4.4163 7.8855-8.9089 11.75-13.434 1.0299-1.2058 2.0599-2.4115 3.0898-3.6172 0.51965-0.60852 1.0393-1.217 1.5747-1.844 3.0292-3.5372 6.1018-7.0249 9.2378-10.469 4.6378-5.11 8.9914-10.434 13.312-15.812 1.0886-1.3052 1.0886-1.3052 2.1992-2.6367 2.6966-3.539 3.2616-6.8067 3.1938-11.236-0.74301-4.0206-3.4519-6.5065-6.2056-9.377-0.58878-0.6455-1.1776-1.291-1.7842-1.9561-1.7834-1.9486-3.5909-3.8723-5.4033-5.7939-1.4678-1.5866-2.93-3.178-4.3914-4.7705-1.3503-1.4704-2.706-2.9359-4.0618-4.4014-3.2209-3.5765-6.2239-7.3042-9.2383-11.055-2.4819-2.9817-5.0951-5.8187-7.7461-8.6484-11.792-12.676-21.99-24.809-21.48-43.066 3.407-27.518 27.039-66.699 47.918-84.559 5.9718-4.5112 12.209-7.1966 19.84-6.8477 17.094 2.7511 34.034 17.486 44.098 30.938 4.2859 6.4381 7.3285 13.191 10.062 20.41 7.824-9.5531 15.526-19.17 23-29 2.0817-2.7304 4.1656-5.4591 6.25-8.1875 0.81356-1.0657 0.81356-1.0657 1.6436-2.1528 4.0884-5.348 8.2159-10.664 12.356-15.972 4.6005-5.8986 9.1409-11.833 13.609-17.832 2.3536-3.1396 4.7426-6.2498 7.1406-9.3555 3.8824-5.0298 7.7073-10.099 11.508-15.191 1.8918-2.5232 3.809-5.0258 5.7344-7.5234 7.5051-9.6188 7.5051-9.6188 14.316-19.73 1.3298-1.8955 2.7369-3.5894 4.2539-5.3359 3.1005-3.572 5.9408-7.2908 8.75-11.094 1.0579-1.4211 2.1165-2.8416 3.1758-4.2617 0.53963-0.72365 1.0793-1.4473 1.6353-2.1929 2.6013-3.4712 5.2376-6.9153 7.8765-10.358 0.52964-0.69182 1.0593-1.3836 1.605-2.0964 2.371-3.0966 4.7431-6.1922 7.1172-9.2864 6.9922-9.117 13.973-18.224 20.592-27.617 3.0266-4.2821 6.1935-8.4387 9.4126-12.577 3.6953-4.7679 7.2699-9.6201 10.836-14.485 5.1531-7.0285 10.394-13.981 15.708-20.889 2.9437-3.8331 5.8403-7.6907 8.6675-11.611 2.947-4.0834 5.9477-8.12 9-12.125 0.79793-1.0493 1.5959-2.0986 2.418-3.1797 7.3745-9.0707 16.159-14.641 27.277-18.121 2.2951-0.62073 2.2951-0.62073 3.1172-2.8242 1.8452-0.2245 3.6914-0.44251 5.5404-0.63281 4.8219-0.71986 9.4052-2.3736 14.034-3.8672 1.11-0.35194 2.2199-0.70389 3.3635-1.0665 3.5853-1.1382 7.1675-2.2859 10.75-3.4335 2.4571-0.78153 4.9145-1.5623 7.3721-2.3423 4.8141-1.5283 9.6274-3.0592 14.44-4.5923 7.9059-2.5156 15.825-4.9889 23.75-7.4404 1.0889-0.33773 2.1777-0.67547 3.2996-1.0234 1.9287-0.59704 3.8581-1.192 5.7883-1.7842 1.8337-0.56302 3.6656-1.1317 5.4961-1.7051 0.89525-0.27683 1.7905-0.55365 2.7129-0.83887 0.78729-0.24573 1.5746-0.49146 2.3857-0.74463 2.0674-0.52881 2.0674-0.52881 5.0674-0.52881l1-2c2.0635-0.65381 2.0635-0.65381 4.8906-1.2734 5.3022-1.2515 10.508-2.6858 15.719-4.2656 0.791-0.2396 1.582-0.4792 2.397-0.72606 1.6915-0.51395 3.3826-1.029 5.0735-1.545 2.7544-0.84057 5.51-1.6773 8.2659-2.5133 8.5257-2.5879 17.048-5.1863 25.57-7.7864 13.103-3.9975 26.21-7.9851 39.326-11.94 6.004-1.8112 12.003-3.6372 17.996-5.485 3.178-0.97486 6.3616-1.9305 9.5474-2.8797 1.3959-0.41997 2.7895-0.84771 4.1802-1.2846 7.4197-2.3263 14.365-3.6465 22.117-3.7067z\" fill=\"#353C35\"/>\r\n        <path transform=\"translate(843,160)\" d=\"m0 0c0.87909 3.1738 0.98903 4.9646 0.066406 8.1484-0.34938 1.2387-0.34938 1.2387-0.70581 2.5024-0.39506 1.3484-0.39506 1.3484-0.7981 2.7241-0.55849 1.9736-1.1157 3.9476-1.6719 5.9219-0.30357 1.0693-0.60715 2.1386-0.91992 3.2402-1.5967 5.6962-3.1174 11.413-4.6372 17.13-0.50784 1.9089-1.0182 3.8171-1.5285 5.7253-1.4648 5.4908-2.907 10.983-4.262 16.502-1.8468 7.4363-3.9359 14.802-6.043 22.168-0.21587 0.75494-0.43174 1.5099-0.65414 2.2877-8.0126 27.951-17.064 55.512-26.559 82.99-2.8479 8.2577-5.5966 16.548-8.3086 24.851-1.7657 5.3597-3.6081 10.69-5.5405 15.992-0.39316 1.0872-0.78633 2.1745-1.1914 3.2947-0.41121 0.83217-0.82242 1.6643-1.2461 2.5217-3.6956 1.2319-4.5849 0.62215-8.1133-0.83594-1.001-0.40477-2.0019-0.80953-3.0332-1.2266-1.0448-0.43312-2.0896-0.86625-3.166-1.3125-2.0563-0.84665-4.1149-1.688-6.1758-2.5234-0.91306-0.37818-1.8261-0.75636-2.7668-1.146-2.9074-1.0121-5.7004-1.5329-8.7449-1.9556 1.3335 1.3335 2.8308 2.2957 4.3867 3.3633 0.69158 0.47502 1.3832 0.95004 2.0957 1.4395 0.72768 0.49822 1.4554 0.99645 2.2051 1.5098 0.70834 0.48662 1.4167 0.97324 2.1465 1.4746 4.0353 2.7685 8.0873 5.5087 12.166 8.2129-1.5022 3.7389-3.6017 5.5409-6.75 8-4.4989 3.5802-8.9008 7.2395-13.25 11-4.9886 4.3006-10.042 8.5049-15.156 12.656-3.9325 3.2411-7.787 6.5698-11.646 9.8979-3.5828 3.0831-7.2074 6.1011-10.885 9.0708-3.7169 3.0149-7.2893 6.1358-10.812 9.375-4.3903 4.0363-8.9118 7.8403-13.551 11.586-3.3629 2.7527-6.6585 5.5758-9.9492 8.4141-4.1022 3.5362-8.228 7.0286-12.438 10.438-5.0518 4.1023-9.9656 8.3495-14.873 12.623-4.0583 3.5322-8.1393 7.0343-12.252 10.502-12.951 10.904-12.951 10.904-25.625 22.125-3.2492 2.9538-6.5712 5.757-10 8.5-6.0657 4.9025-11.694 10.235-17.367 15.582-3.1257 2.9433-6.314 5.7988-9.5664 8.6016-4.0147 3.4805-7.935 7.0686-11.879 10.629-1.6664 1.5003-3.3331 3.0003-5 4.5-0.82887 0.74637-1.6577 1.4927-2.5117 2.2617-1.626 1.4627-3.2536 2.9237-4.8828 4.3828-8.3305 7.4692-16.56 15.047-24.711 22.711-0.69916 0.65726-1.3983 1.3145-2.1187 1.9917-1.3493 1.2698-2.6973 2.5409-4.0439 3.8135-4.4852 4.2235-9.0804 8.3005-13.732 12.339-1.6688 1.4768-3.3359 2.9554-5 4.4375-0.76312 0.67934-1.5262 1.3587-2.3125 2.0586-0.83531 0.74443-0.83531 0.74443-1.6875 1.5039-3.5083-1.5208-5.9527-3.5996-8.75-6.1875-2.9494-2.7054-5.8997-5.3943-8.9375-8-4.6095-4.0135-9.0492-8.2078-13.509-12.386-5.8936-5.5207-11.839-10.983-17.804-16.427 5.0137-5.9623 10.266-11.693 15.544-17.419 2.3231-2.5226 4.639-5.0519 6.9556-7.5806 0.92056-1.0039 1.8411-2.0078 2.7617-3.0117 1.7961-1.9592 3.59-3.9205 5.3828-5.8828 5.1673-5.6515 10.371-11.266 15.605-16.855 4.0531-4.3292 8.0554-8.6815 11.926-13.176 2.4978-2.8401 5.0669-5.6118 7.6367-8.3867 9.9004-10.674 9.9004-10.674 19.562-21.562 3.6073-4.1544 7.3481-8.1822 11.099-12.207 2.6949-2.8999 5.3367-5.8352 7.9321-8.8247 4.1992-4.8221 8.5917-9.4524 12.988-14.094 3.7604-3.9861 7.4233-8.034 10.996-12.189 1.6392-1.844 3.3487-3.5828 5.1094-5.3105 2.2933-2.258 4.4643-4.56 6.5625-7 5.1684-5.9857 10.626-11.708 16.036-17.474 1.8617-1.9841 3.7216-3.9698 5.5811-5.9561 3.1132-3.3247 6.2293-6.6466 9.3467-9.9673 1.3605-1.4497 2.7205-2.9 4.0801-4.3506 2.1301-2.2727 4.2617-4.5439 6.3936-6.8149 0.6463-0.69013 1.2926-1.3803 1.9585-2.0913 3.0535-3.2496 6.1349-6.4582 9.2993-9.6001 2.3124-2.2965 4.5196-4.6239 6.6172-7.1211 2.5913-3.0097 5.2975-5.8359 8.125-8.625 2.7862-2.7486 5.4531-5.5286 8-8.5 3.18-3.7101 6.5876-7.1298 10.094-10.531 1.9594-2.0103 3.7888-4.0495 5.6172-6.1758 4.0901-4.7132 8.4794-9.0936 12.914-13.48 0.78504-0.78053 1.5701-1.5611 2.3789-2.3652 5.9292-5.8942 5.9292-5.8942 8.1169-8.0286 3.2839-3.2186 5.2875-5.6724 5.4463-10.431-0.0079761-0.71132-0.015952-1.4226-0.02417-2.1555-0.01418-1.2646-0.028359-2.5291-0.042969-3.832-0.8826 0.38333-1.7652 0.76667-2.6746 1.1616-3.2891 1.4283-6.5786 2.8556-9.8682 4.2827-1.421 0.61661-2.8419 1.2335-4.2627 1.8506-2.0476 0.88934-4.0957 1.7778-6.1438 2.666-0.63041 0.27404-1.2608 0.54807-1.9103 0.83041-2.654 1.1501-5.3006 2.2683-8.0116 3.2785-2.707 1.1828-2.9946 2.2719-4.1289 4.9302-1.4805 1.6406-1.4805 1.6406-3.1875 3.25-3.2018 3.0294-6.0544 6.2979-8.9412 9.6226-2.9422 3.3449-5.9993 6.5777-9.0588 9.8149-1.3233 1.4059-2.6462 2.8121-3.9688 4.2188-0.64969 0.69094-1.2994 1.3819-1.9688 2.0938-2.7022 2.8823-5.3852 5.782-8.0625 8.6875-0.4859 0.52715-0.97179 1.0543-1.4724 1.5974-1.922 2.0864-3.8427 4.174-5.7625 6.2625-8.118 8.8299-16.324 17.574-24.552 26.302-5.6877 6.0386-11.357 12.095-17.026 18.151-0.60618 0.64743-1.2124 1.2949-1.8369 1.9619-6.8593 7.3286-13.69 14.682-20.464 22.089-7.7804 8.5011-15.62 16.946-23.49 25.365-3.7309 3.9935-7.4455 8.0013-11.147 12.022-5.716 6.2062-11.487 12.36-17.262 18.512-7.9458 8.4654-15.873 16.948-23.738 25.488-7.6097 8.261-15.309 16.438-22.999 24.624-1.9174 2.0416-3.8344 4.0836-5.751 6.126-0.62117 0.66169-1.2423 1.3234-1.8823 2.0051-3.9812 4.2462-7.9315 8.5194-11.868 12.807-4.4004 4.7913-8.9009 9.4618-13.562 14-5.8423-4.1181-11.1-8.7281-16.355-13.566-4.6205-4.252-9.3708-8.3474-14.145-12.426-0.62673-0.53577-1.2535-1.0715-1.8992-1.6235-1.2542-1.0713-2.5096-2.1413-3.7661-3.21-0.58096-0.49581-1.1619-0.99161-1.7605-1.5024-0.5199-0.44247-1.0398-0.88494-1.5754-1.3408-1.5624-1.3875-3.0357-2.8398-4.4988-4.3311 1.6268-3.6539 3.8669-6.596 6.3125-9.75 0.43441-0.56074 0.86883-1.1215 1.3164-1.6992 4.1028-5.2668 8.3245-10.436 12.55-15.604 3.3615-4.1209 6.6595-8.28 9.8838-12.509 3.5663-4.6743 7.1936-9.2908 10.875-13.875 5.7387-7.148 11.418-14.34 17.062-21.562 0.52288-0.66838 1.0458-1.3368 1.5845-2.0254 8.3281-10.652 16.554-21.378 24.736-32.143 2.9156-3.8344 5.8538-7.6498 8.8047-11.457 4.5205-5.8616 8.8975-11.824 13.273-17.794 4.5458-6.1869 9.1826-12.299 13.852-18.393 4.7428-6.1924 9.4013-12.419 13.884-18.802 3.8186-5.3996 7.843-10.637 11.866-15.885 4.8482-6.3256 9.6231-12.679 14.212-19.195 3.5844-5.0695 7.304-10.033 11.038-14.993 13.008-17.283 25.755-34.749 38.348-52.336 0.59031-0.82234 1.1806-1.6447 1.7888-2.4919 1.1321-1.5772 2.2619-3.1561 3.3892-4.7368 0.50974-0.70955 1.0195-1.4191 1.5447-2.1501 0.44618-0.62383 0.89235-1.2477 1.3521-1.8904 2.4758-3.1838 4.393-4.9888 8.2991-6.1675 0.81133-0.24997 1.6227-0.49994 2.4586-0.75749 0.89321-0.26461 1.7864-0.52921 2.7067-0.80183 0.95336-0.29083 1.9067-0.58166 2.889-0.8813 3.218-0.97942 6.4399-1.9453 9.6618-2.9117 2.2999-0.69745 4.5996-1.3959 6.8989-2.0952 4.3839-1.3323 8.7687-2.6616 13.155-3.9868 9.3777-2.8337 18.747-5.6947 28.114-8.5625 1.5308-0.46858 3.0615-0.93715 4.5923-1.4057 0.76137-0.23306 1.5227-0.46611 2.3072-0.70623 0.76342-0.23368 1.5268-0.46736 2.3134-0.70812 0.76499-0.23418 1.53-0.46836 2.3182-0.70964 8.5298-2.6108 17.062-5.2145 25.594-7.8179 8.9283-2.7244 17.856-5.45 26.781-8.1852 32.342-9.9105 64.783-19.48 97.238-29.01z\" fill=\"#747C77\"/>\r\n        <path transform=\"translate(843,162)\" d=\"m0 0c-0.87914 0.55043-1.7583 1.1009-2.6641 1.668-3.2988 2.2008-5.9543 4.7869-8.7109 7.6445-3.1416 3.223-6.3009 6.3527-9.75 9.25-2.8194 2.4053-5.2724 4.9422-7.707 7.7344-5.6994 6.3871-11.736 12.422-17.798 18.463-1.9365 1.9311-3.8675 3.8675-5.7981 5.8044-5.5335 5.5362-11.049 11.027-17.017 16.099-2.1348 1.8351-4.0956 3.817-6.0549 5.8367-3.4037 3.4505-6.9244 6.6664-10.602 9.8203-2.455 2.1721-4.7288 4.4971-7.0234 6.8359-1.8109 1.7807-3.6764 3.4458-5.6016 5.1016-4.1474 3.6059-8.1554 7.342-12.148 11.117-1.4111 1.322-2.8226 2.6436-4.2344 3.9648-2.2389 2.0989-4.4567 4.211-6.6562 6.3516-12.756 12.144-30.677 19.789-47.234 25.309-0.69964 1.3163-1.363 2.6522-2 4-1.4805 1.6406-1.4805 1.6406-3.1875 3.25-3.2018 3.0294-6.0544 6.2979-8.9412 9.6226-2.9422 3.3449-5.9993 6.5777-9.0588 9.8149-1.3233 1.4059-2.6462 2.8121-3.9688 4.2188-0.64969 0.69094-1.2994 1.3819-1.9688 2.0938-2.7022 2.8823-5.3852 5.782-8.0625 8.6875-0.4859 0.52715-0.97179 1.0543-1.4724 1.5974-1.922 2.0864-3.8427 4.174-5.7625 6.2625-8.118 8.8299-16.324 17.574-24.552 26.302-5.6877 6.0386-11.357 12.095-17.026 18.151-0.60618 0.64743-1.2124 1.2949-1.8369 1.9619-6.8593 7.3286-13.69 14.682-20.464 22.089-7.7804 8.5011-15.62 16.946-23.49 25.365-3.7309 3.9935-7.4455 8.0013-11.147 12.022-5.716 6.2062-11.487 12.36-17.262 18.512-7.9458 8.4654-15.873 16.948-23.738 25.488-7.6097 8.261-15.309 16.438-22.999 24.624-1.9174 2.0416-3.8344 4.0836-5.751 6.126-0.62117 0.66169-1.2423 1.3234-1.8823 2.0051-3.9812 4.2462-7.9315 8.5194-11.868 12.807-4.4004 4.7913-8.9009 9.4618-13.562 14-5.8423-4.1181-11.1-8.7281-16.355-13.566-4.6205-4.252-9.3708-8.3474-14.145-12.426-0.62673-0.53577-1.2535-1.0715-1.8992-1.6235-1.2542-1.0713-2.5096-2.1413-3.7661-3.21-0.58096-0.49581-1.1619-0.99161-1.7605-1.5024-0.5199-0.44247-1.0398-0.88494-1.5754-1.3408-1.5624-1.3875-3.0357-2.8398-4.4988-4.3311 1.6268-3.6539 3.8669-6.596 6.3125-9.75 0.43441-0.56074 0.86883-1.1215 1.3164-1.6992 4.1028-5.2668 8.3245-10.436 12.55-15.604 3.3615-4.1209 6.6595-8.28 9.8838-12.509 3.5663-4.6743 7.1936-9.2908 10.875-13.875 5.7387-7.148 11.418-14.34 17.062-21.562 0.52288-0.66838 1.0458-1.3368 1.5845-2.0254 8.3281-10.652 16.554-21.378 24.736-32.143 2.9156-3.8344 5.8538-7.6498 8.8047-11.457 4.5205-5.8616 8.8975-11.824 13.273-17.794 4.5458-6.1869 9.1826-12.299 13.852-18.393 4.7428-6.1924 9.4013-12.419 13.884-18.802 3.8186-5.3996 7.843-10.637 11.866-15.885 4.8482-6.3256 9.6231-12.679 14.212-19.195 3.5844-5.0695 7.304-10.033 11.038-14.993 13.008-17.283 25.755-34.749 38.348-52.336 0.59031-0.82234 1.1806-1.6447 1.7888-2.4919 1.1321-1.5772 2.2619-3.1561 3.3892-4.7368 0.50974-0.70955 1.0195-1.4191 1.5447-2.1501 0.44618-0.62383 0.89235-1.2477 1.3521-1.8904 2.4758-3.1838 4.393-4.9888 8.2991-6.1675 0.81133-0.24997 1.6227-0.49994 2.4586-0.75749 0.89321-0.26461 1.7864-0.52921 2.7067-0.80183 0.95336-0.29083 1.9067-0.58166 2.889-0.8813 3.218-0.97942 6.4399-1.9453 9.6618-2.9117 2.2999-0.69745 4.5996-1.3959 6.8989-2.0952 4.3839-1.3323 8.7687-2.6616 13.155-3.9868 9.3777-2.8337 18.747-5.6947 28.114-8.5625 3.0712-0.94012 6.1424-1.8802 9.2136-2.8203 1.1475-0.35129 1.1475-0.35129 2.3183-0.70968 9.2804-2.8405 18.563-5.6724 27.846-8.5048 8.2032-2.5031 16.406-5.0088 24.605-7.5237 21.256-6.5191 42.543-12.934 63.862-19.241 2.6425-0.78197 5.2838-1.5678 7.9242-2.357 3.6676-1.0959 7.3393-2.1775 11.012-3.2577 1.6605-0.49876 1.6605-0.49876 3.3544-1.0076 1.0144-0.29583 2.0289-0.59166 3.074-0.89645 0.88496-0.262 1.7699-0.52399 2.6817-0.79393 2.2531-0.43092 2.2531-0.43092 5.2531 0.56908z\" fill=\"#A8AAA1\"/>\r\n        <path transform=\"translate(868.08 108.59)\" d=\"m0 0c0.70463-0.0067323 1.4093-0.013465 2.1352-0.020401 6.4762 0.12104 11.035 2.1066 15.783 6.4267 6.7355 7.1685 7.4975 15.175 7.2769 24.712-0.32818 6.7315-1.9685 13.117-3.7144 19.6-0.39653 1.5245-0.79241 3.0492-1.1877 4.574-15.141 57.747-33.221 114.75-51.15 171.68-0.77339 2.4566-1.5457 4.9135-2.3178 7.3705-4.8024 15.273-9.6359 30.535-14.809 45.687-0.51513 1.5277-0.51513 1.5277-1.0407 3.0862-5.8617 16.918-5.8617 16.918-12.244 22.918-0.67418 0.65227-1.3484 1.3045-2.043 1.9766-1.7695 1.3984-1.7695 1.3984-3.7695 1.3984v2c-2.0273 1.7234-4.0653 3.3381-6.1875 4.9375-4.8734 3.7442-9.6517 7.5565-14.312 11.562-4.471 3.8341-9.032 7.5173-13.688 11.125-4.9944 3.8756-9.7402 7.9242-14.398 12.203-3.3976 3.0568-6.9447 5.9139-10.496 8.7891-3.7343 3.0494-7.405 6.1702-11.077 9.2942-3.4521 2.9308-6.943 5.8055-10.466 8.6511-4.7271 3.842-9.2068 7.9069-13.688 12.031-3.2993 2.954-6.7453 5.6796-10.227 8.4141-3.423 2.771-6.6461 5.7432-9.8984 8.7109-2.6078 2.3215-5.2829 4.5266-8 6.7188-4.7768 3.8631-9.302 7.9416-13.82 12.102-2.6423 2.3713-5.3491 4.6135-8.1172 6.8359-4.2031 3.3889-8.1871 6.9374-12.125 10.625-4.7712 4.4679-9.6791 8.6676-14.785 12.754-3.9854 3.2972-7.737 6.8279-11.5 10.375-2.2148 1.8711-2.2148 1.8711-4.2148 1.8711v2c-1.2227 1.2695-1.2227 1.2695-3.0625 2.8125-0.72574 0.61746-1.4515 1.2349-2.1992 1.8711-0.90363 0.76441-1.8073 1.5288-2.7383 2.3164-2.4635 2.119-4.9193 4.2469-7.375 6.375-0.6546 0.56598-1.3092 1.132-1.9836 1.7151-3.6698 3.1784-7.3014 6.3911-10.891 9.6599-3.2287 2.9318-6.5326 5.7126-9.9375 8.4375-5.3248 4.3005-10.273 8.933-15.238 13.637-4.625 4.3579-9.3867 8.402-14.403 12.308-2.0969 1.8028-3.6149 3.5924-5.1719 5.8672 5.208 2.3208 10.456 4.2336 15.875 6 4.5547 1.5 4.5547 1.5 6.8157 2.2454 1.6015 0.52332 3.2057 1.0382 4.812 1.5464 0.80478 0.25822 1.6096 0.51643 2.4387 0.78247 0.72905 0.23034 1.4581 0.46068 2.2092 0.698 2.6191 1.0307 3.9951 2.6343 5.8494 4.7278 1.2792 0.95451 2.5725 1.8902 3.875 2.8125 7.5329 5.5831 11.921 11.63 13.938 20.938 1.1447 13.632-5.9612 26.77-14.188 37.188-15.306 17.463-37.523 33.314-58.625 43.062h-2l-1 2c-9.832 3.3392-20.457 3.193-30-1-9.0874-4.8402-17.029-11.545-25-18-1.0018-0.81042-1.0018-0.81042-2.0239-1.6372-3.4276-2.7755-6.85-5.5573-10.269-8.3433-4.5453-3.7035-9.0945-7.3997-13.707-11.02-0.64324-0.51434-1.2865-1.0287-1.9492-1.5586-3.6186-2.7709-6.4181-4.8196-11.051-4.4414-3.0465 1.9411-5.465 4.4432-8 7-0.89461 0.87012-1.7892 1.7402-2.7109 2.6367-4.6551 4.5722-9.1144 9.2354-13.348 14.203-2.5425 2.829-5.236 5.4878-7.9414 8.1602-3.2221 3.1829-6.3905 6.3469-9.3125 9.8125-4.0741 4.7984-8.604 9.1542-13.095 13.558-3.1238 3.0815-6.1309 6.1991-8.991 9.5281-4.0078 4.6483-8.3527 8.9253-12.727 13.227-2.9835 2.9345-5.9455 5.8865-8.875 8.875-0.54793 0.5431-1.0959 1.0862-1.6604 1.6458-2.4213 2.5837-3.3138 4.1479-3.7576 7.6941 0.076055 1.1872 0.15211 2.3745 0.23047 3.5977 0.047874 1.3357 0.088031 2.6717 0.12109 4.0078 0.017886 0.67579 0.035771 1.3516 0.054199 2.0479 0.13648 22.438-9.8287 42.623-25.238 58.386-16.639 15.859-38.194 21.12-60.574 20.77-32.474-0.91475-58.907-15.915-81.383-38.352-17.614-18.76-26.234-43.914-27.043-69.359 0.81801-25.407 10.042-46.905 28.438-64.625 12.128-10.629 27.322-17.522 43.197-20.087 8.9085-1.4767 13.784-3.2843 19.51-10.745 0.6948-0.98355 1.3896-1.9671 2.1055-2.9805 1.4259-1.7595 2.8634-3.5096 4.3125-5.25 0.72832-0.90105 1.4566-1.8021 2.207-2.7305 7.2516-8.8275 14.851-17.375 22.516-25.844 3.9882-4.4163 7.8855-8.9089 11.75-13.434 1.0299-1.2058 2.0599-2.4115 3.0898-3.6172 0.51965-0.60852 1.0393-1.217 1.5747-1.844 3.0292-3.5372 6.1018-7.0249 9.2378-10.469 4.6378-5.11 8.9914-10.434 13.312-15.812 1.0886-1.3052 1.0886-1.3052 2.1992-2.6367 2.6966-3.539 3.2616-6.8067 3.1938-11.236-0.74301-4.0206-3.4519-6.5065-6.2056-9.377-0.58878-0.6455-1.1776-1.291-1.7842-1.9561-1.7834-1.9486-3.5909-3.8723-5.4033-5.7939-1.4678-1.5866-2.93-3.178-4.3914-4.7705-1.3503-1.4704-2.706-2.9359-4.0618-4.4014-3.2209-3.5765-6.2239-7.3042-9.2383-11.055-2.4819-2.9817-5.0951-5.8187-7.7461-8.6484-11.792-12.676-21.99-24.809-21.48-43.066 3.407-27.518 27.039-66.699 47.918-84.559 5.9718-4.5112 12.209-7.1966 19.84-6.8477 17.094 2.7511 34.034 17.486 44.098 30.938 4.2859 6.4381 7.3285 13.191 10.062 20.41 7.824-9.5531 15.526-19.17 23-29 2.0817-2.7304 4.1656-5.4591 6.25-8.1875 0.81356-1.0657 0.81356-1.0657 1.6436-2.1528 4.0884-5.348 8.2159-10.664 12.356-15.972 4.6005-5.8986 9.1409-11.833 13.609-17.832 2.3536-3.1396 4.7426-6.2498 7.1406-9.3555 3.8824-5.0298 7.7073-10.099 11.508-15.191 1.8918-2.5232 3.809-5.0258 5.7344-7.5234 7.5051-9.6188 7.5051-9.6188 14.316-19.73 1.3298-1.8955 2.7369-3.5894 4.2539-5.3359 3.1005-3.572 5.9408-7.2908 8.75-11.094 1.0579-1.4211 2.1165-2.8416 3.1758-4.2617 0.53963-0.72365 1.0793-1.4473 1.6353-2.1929 2.6013-3.4712 5.2376-6.9153 7.8765-10.358 0.52964-0.69182 1.0593-1.3836 1.605-2.0964 2.371-3.0966 4.7431-6.1922 7.1172-9.2864 6.9922-9.117 13.973-18.224 20.592-27.617 3.0266-4.2821 6.1935-8.4387 9.4126-12.577 3.6953-4.7679 7.2699-9.6201 10.836-14.485 5.1531-7.0285 10.394-13.981 15.708-20.889 2.9437-3.8331 5.8403-7.6907 8.6675-11.611 2.947-4.0834 5.9477-8.12 9-12.125 0.79793-1.0493 1.5959-2.0986 2.418-3.1797 7.3745-9.0707 16.159-14.641 27.277-18.121 2.2951-0.62073 2.2951-0.62073 3.1172-2.8242 1.8452-0.2245 3.6914-0.44251 5.5404-0.63281 4.8219-0.71986 9.4052-2.3736 14.034-3.8672 1.11-0.35194 2.2199-0.70389 3.3635-1.0665 3.5853-1.1382 7.1675-2.2859 10.75-3.4335 2.4571-0.78153 4.9145-1.5623 7.3721-2.3423 4.8141-1.5283 9.6274-3.0592 14.44-4.5923 7.9059-2.5156 15.825-4.9889 23.75-7.4404 1.0889-0.33773 2.1777-0.67547 3.2996-1.0234 1.9287-0.59704 3.8581-1.192 5.7883-1.7842 1.8337-0.56302 3.6656-1.1317 5.4961-1.7051 0.89525-0.27683 1.7905-0.55365 2.7129-0.83887 0.78729-0.24573 1.5746-0.49146 2.3857-0.74463 2.0674-0.52881 2.0674-0.52881 5.0674-0.52881l1-2c2.0635-0.65381 2.0635-0.65381 4.8906-1.2734 5.3022-1.2515 10.508-2.6858 15.719-4.2656 0.791-0.2396 1.582-0.4792 2.397-0.72606 1.6915-0.51395 3.3826-1.029 5.0735-1.545 2.7544-0.84057 5.51-1.6773 8.2659-2.5133 8.5257-2.5879 17.048-5.1863 25.57-7.7864 13.103-3.9975 26.21-7.9851 39.326-11.94 6.004-1.8112 12.003-3.6372 17.996-5.485 3.178-0.97486 6.3616-1.9305 9.5474-2.8797 1.3959-0.41997 2.7895-0.84771 4.1802-1.2846 7.4197-2.3263 14.365-3.6465 22.117-3.7067zm-20.992 17.742c-1.5499 0.45619-3.1001 0.91128-4.6507 1.3653-4.0269 1.1832-8.0487 2.3832-12.069 3.5889-2.2846 0.68421-4.5704 1.3645-6.8568 2.043-9.5576 2.8364-19.105 5.7071-28.647 8.5948-2.3569 0.71299-4.7141 1.425-7.0713 2.1368-28.296 8.5445-56.566 17.173-84.795 25.935-1.0035 0.31135-2.0069 0.6227-3.0408 0.94348-11.996 3.723-23.986 7.464-35.967 11.233-6.2251 1.9577-12.455 3.9007-18.687 5.8356-4.2845 1.3329-8.5657 2.676-12.846 4.0215-2.0207 0.63298-4.0427 1.262-6.066 1.8865-23.47 7.0698-23.47 7.0698-41.393 23.08-0.50999 0.67644-1.02 1.3529-1.5454 2.0498-3.6209 4.8229-7.1758 9.692-10.719 14.572-2.5442 3.4854-5.1374 6.9329-7.7358 10.378-4.2914 5.6993-8.5303 11.435-12.75 17.188-5.8112 7.9174-11.743 15.738-17.71 23.538-3.2287 4.2249-6.4375 8.4557-9.54 12.775-3.7697 5.2477-7.6994 10.369-11.625 15.5-5.1908 6.7865-10.327 13.607-15.375 20.5-6.8698 9.373-13.905 18.615-20.968 27.843-3.3505 4.3809-6.6909 8.7694-10.032 13.157-4.0804 5.3567-8.1618 10.713-12.246 16.066-6.2595 8.207-12.508 16.42-18.688 24.688-3.5663 4.7394-7.1935 9.4319-10.818 14.127-2.004 2.5988-4.0003 5.2034-5.9985 7.8066-4.6667 6.073-9.3716 12.116-14.077 18.159-4.201 5.3973-8.3772 10.813-12.54 16.24-2.0141 2.6188-4.0438 5.225-6.0781 7.8281-6.3274 8.0986-12.608 16.201-18.555 24.586-6.9-5.9417-8.8694-12.752-10.5-21.562-3.1413-16.743-15.725-28.293-28.996-38.324-4.9704-3.3265-9.0877-5.0553-15.129-4.6211-9.0228 1.9292-15.349 9.9374-20.217 17.289-1.8379 3.065-3.6047 6.1599-5.3457 9.281-0.63784 1.1267-1.2757 2.2534-1.9329 3.4143-1.9767 3.4985-3.9284 7.0104-5.8796 10.523-0.62262 1.1121-1.2452 2.2243-1.8867 3.3701-1.7787 3.1828-3.543 6.373-5.3008 9.5674-0.52811 0.95076-1.0562 1.9015-1.6003 2.8811-5.3829 9.9109-10.296 19.829-7.7395 31.302 3.2979 10.131 12.086 18.126 18.922 26.019 1.5739 1.8233 3.1383 3.6543 4.6992 5.4888 4.6212 5.4279 9.2691 10.809 14.094 16.059 4.0031 4.367 7.8029 8.8502 11.488 13.488 1.6811 2.0428 3.3639 3.9542 5.1797 5.8672 6.9058 7.4056 6.9058 7.4056 7.5039 11.293-0.47773 2.4506-1.2972 4.4042-2.3594 6.6641-0.34289 0.95906-0.68578 1.9181-1.0391 2.9062-3.9708 10.697-10.773 17.983-18.41 26.258-2.512 2.7928-4.8847 5.659-7.2383 8.5859-2.4836 3.0794-4.9667 6.0024-7.8125 8.75-2.7851 2.6897-5.205 5.5397-7.625 8.5625-3.6156 4.4979-7.4178 8.7384-11.375 12.938-4.6878 4.9792-9.1123 10.082-13.391 15.422-2.8273 3.4556-5.8354 6.7297-8.8438 10.027-3.1691 3.568-6.1497 7.2777-9.125 11.008-0.70641 0.83918-1.4128 1.6784-2.1406 2.543-1.135 1.3632-1.135 1.3632-2.293 2.7539-3.3422 2.7731-6.0931 3.1088-10.27 3.3711-1.4393 0.14086-2.8781 0.28673-4.3164 0.4375-1.056 0.10635-1.056 0.10635-2.1333 0.21484-16.805 1.8824-30.489 10.283-41.988 22.223-0.67547 0.65613-1.3509 1.3123-2.0469 1.9883-12.766 13.19-16.584 32.001-16.428 49.714 0.79634 25.347 11.757 48.491 30.17 65.836 23.549 19.979 49.936 27.238 80.305 25.461 15.018-1.7793 27.461-8.3189 38-19l2.1875-2.1562c11.759-12.293 16.363-28.618 16.137-45.352-0.30927-3.3312-1.0894-5.9615-2.1367-9.1172-0.57812-2.6211-0.57812-2.6211-0.1875-5.375 3.0217-4.5312 7.3532-8.0332 11.426-11.588 1.8251-1.6371 3.3975-3.3898 4.9487-5.2866 3.4775-4.1066 7.3047-7.8415 11.125-11.625 5.675-5.5854 5.675-5.5854 11-11.5 3.9971-4.7466 8.4812-9.0302 12.908-13.371 3.1365-3.094 6.1552-6.2259 9.0293-9.5664 4.4693-5.1832 9.3664-9.9146 14.246-14.707 4.6633-4.6127 9.0401-9.3842 13.316-14.355 5.8809-6.532 11.024-11.289 19.938-12.562 8.3374 0.47177 15.695 7.3299 21.938 12.312 0.78738 0.62052 1.5748 1.241 2.386 1.8804 5.9714 4.719 11.864 9.5308 17.739 14.37 17.718 15.737 17.718 15.737 40 20 20.093-4.875 39.931-21.506 55-35 0.68578-0.59039 1.3716-1.1808 2.0781-1.7891 7.7419-7.0793 13.824-17.234 15.258-27.652 0.11446-6.2152-1.4044-9.4474-5.7383-14.047-9.3288-8.8271-21.917-12.213-34.098-15.105-7.1522-1.9413-12.027-6.5835-17.5-11.406-1.2255-1.0252-2.4539-2.0471-3.6875-3.0625l-2.3125-1.9375c4.1524-4.3666 8.4172-8.4213 13.125-12.188 4.481-3.5935 8.6987-7.3764 12.875-11.312 4.0586-3.8223 8.143-7.5144 12.5-11 5.6914-4.5564 10.964-9.5079 16.277-14.492 3.044-2.8533 6.1523-5.6197 9.3125-8.3438 2.2722-1.9795 4.4948-4.0099 6.7227-6.0391 3.4413-3.1103 6.9507-6.0898 10.562-9 5.1475-4.1646 10.009-8.5781 14.863-13.074 4.5492-4.2018 9.2254-8.2452 13.941-12.258 5.7571-4.9042 11.467-9.8323 17.008-14.98 4.547-4.2233 9.2639-8.1758 14.098-12.066 2.8216-2.3344 5.5208-4.766 8.2148-7.2461 4.3717-4.0197 8.8779-7.7999 13.496-11.531 5.4653-4.4917 10.768-9.1733 16.103-13.818 12.22-10.613 24.536-21.121 37.088-31.338 3.1305-2.574 6.2242-5.1882 9.3125-7.8125 4.8518-4.1229 9.755-8.1747 14.695-12.191 2.5374-2.0886 5.0421-4.2087 7.5398-6.3442 4.884-4.1751 9.8275-8.2129 14.952-12.089 11.32-8.6011 19.234-15.721 23.746-29.301 0.31375-0.92181 0.6275-1.8436 0.95076-2.7934 1.0272-3.028 2.0408-6.0604 3.0531-9.0934 0.72144-2.1435 1.4431-4.2869 2.165-6.4302 6.7188-20.008 13.145-40.1 19.397-60.257 0.55425-1.7845 0.55425-1.7845 1.1197-3.6051 14.365-46.254 28.643-92.522 40.88-139.39 0.33322-1.27 0.66645-2.5401 1.0098-3.8486 0.88961-3.4212 1.7579-6.8469 2.6152-10.276 0.24798-0.95842 0.49597-1.9168 0.75146-2.9043 1.8143-7.4711 3.4038-15.472-0.18896-22.533-2.1576-2.4042-3.8429-4.1941-7.1086-4.7852-8.4095-0.17858-16.031 2.287-23.989 4.6837z\" fill=\"#E8A371\"/>\r\n        <path transform=\"translate(317,466)\" d=\"m0 0c8.7462 9.718 10.895 21.708 13.625 34.062 0.57344 2.5517 1.1507 5.1024 1.7325 7.6522 0.35842 1.5749 0.71172 3.151 1.0587 4.7284 4.77 21.192 20.161 34.423 35.271 49.182 1.9066 1.9581 3.6864 3.9452 5.457 6.0234 0.53601 0.62826 1.072 1.2565 1.6243 1.9038 0.4063 0.47776 0.81259 0.95552 1.2312 1.4478-0.25693-0.55873-0.51385-1.1175-0.77856-1.6931-1.1828-2.5793-2.3584-5.1618-3.5339-7.7444-0.40412-0.8785-0.80824-1.757-1.2246-2.6621-5.3301-11.744-5.3301-11.744-6.4629-16.9l1-2c0.48469 0.49629 0.96938 0.99258 1.4688 1.5039 4.0598 4.1145 8.2155 8.0141 12.598 11.781 1.8885 1.6749 3.6652 3.4143 5.4336 5.2148 2.9516 2.998 6.0442 5.7622 9.2266 8.5117 9.9866 8.734 19.585 17.927 29.273 26.988 17.624 16.481 17.624 16.481 35.469 32.723 13.315 11.98 13.315 11.98 19.156 17.965 4.4612 4.5348 9.3307 8.4477 14.375 12.312l-2 1c-2.2492-0.91904-4.346-1.8912-6.5-3-0.62423-0.31598-1.2485-0.63196-1.8916-0.95752-4.8527-2.5159-9.3176-5.4105-13.718-8.6597-1.8423-1.4282-1.8423-1.4282-3.8906-2.3828 5.3218 4.9306 10.647 9.7769 16.312 14.312 4.4112 3.5554 8.5653 7.3072 12.688 11.188 5.7926 5.4464 11.784 10.539 18 15.5 2.067 1.6821 4.1269 3.3725 6.1875 5.0625 0.92168 0.7541 1.8434 1.5082 2.793 2.2852 0.66645 0.54527 1.3329 1.0905 2.0195 1.6523-0.5775-0.825-1.155-1.65-1.75-2.5-2.4488-3.6557-4.3579-7.5347-6.25-11.5 4.4585 1.407 8.6694 3.1163 12.93 5.0391 0.6352 0.28572 1.2704 0.57144 1.9248 0.86581 2.0081 0.90399 4.0143 1.812 6.0205 2.7201 1.3697 0.61745 2.7395 1.2346 4.1094 1.8516 3.3399 1.5048 6.6782 3.0131 10.016 4.5234v2c-1.5906 1.3393-3.2528 2.5936-4.9375 3.8125-1.1049 0.80888-2.209 1.6188-3.3125 2.4297-0.60199 0.44054-1.204 0.88107-1.8242 1.335-3.4874 2.5767-6.9229 5.2214-10.363 7.8604-1.0758 0.82371-1.0758 0.82371-2.1733 1.6641-6.471 4.9559-12.932 9.924-19.389 14.898-3.2446-1.4708-5.8055-3.3142-8.5625-5.5625l-2.6719-2.1719c-1.369-1.1215-1.369-1.1215-2.7656-2.2656l-2.6406-2.1406c-6.637-5.395-13.172-10.905-19.689-16.443-1.6742-1.4192-3.3531-2.8325-5.0337-4.2441-4.989-4.195-9.9398-8.4091-14.762-12.797-3.3337-3.0326-6.7407-5.9225-10.25-8.75-5.5761-4.5188-10.849-9.321-16.097-14.21-1.4808-1.371-2.977-2.7254-4.4736-4.0791-7.8939-7.1496-15.424-14.634-22.9-22.219-4.2506-4.295-8.5627-8.4059-13.147-12.341-3.8497-3.4059-7.446-7.0711-11.07-10.714-0.76377-0.7599-1.5275-1.5198-2.3145-2.3027-3.4802-3.4862-6.8778-6.9949-10.088-10.732-4.0973-4.7586-8.5621-9.1249-13.035-13.527-5.2022-5.12-10.27-10.263-15.025-15.803-1.7357-1.9977-3.5712-3.8595-5.4746-5.6973-3.1479-3.1059-6.0776-6.3219-8.957-9.6758-2.0924-2.3805-4.2414-4.6975-6.405-7.0129-4.8961-5.2406-9.541-10.56-13.954-16.221-2.0675-2.5664-4.3213-4.797-6.6836-7.0898-2-3-2-3-1.7776-5.4028 0.79878-2.6679 1.8073-4.7553 3.219-7.1519 0.49742-0.85473 0.99483-1.7095 1.5073-2.5901 0.53254-0.90097 1.0651-1.8019 1.6138-2.7302 1.0993-1.891 2.1969-3.7829 3.293-5.6758 0.53802-0.92764 1.076-1.8553 1.6304-2.811 5.5524-9.6742 10.594-19.631 15.514-29.638z\" fill=\"#646C65\"/>\r\n        <path transform=\"translate(843,162)\" d=\"m0 0-7 4-1-1c-2.7155 0.58673-5.3787 1.2293-8.0625 1.9375-0.75861 0.19529-1.5172 0.39059-2.2988 0.5918-1.8809 0.48501-3.76 0.9772-5.6387 1.4707-0.13277 0.73323-0.26555 1.4665-0.40234 2.2219-1.0134 4.7103-2.2424 8.2155-5.5977 11.778-5.1132 2.6545-10.488 4.1934-16 5.8125-1.6126 0.50105-3.2242 1.0055-4.8347 1.5132-3.3608 1.055-6.7263 2.0926-10.096 3.1172-4.8816 1.4902-9.7379 3.0509-14.588 4.6392-0.77013 0.25213-1.5403 0.50426-2.3337 0.76402-1.5468 0.5067-3.0935 1.0136-4.6402 1.5207-3.8779 1.268-7.7605 2.5211-11.643 3.7739-0.75418 0.24344-1.5084 0.48687-2.2854 0.73769-4.7613 1.5365-9.5231 3.0713-14.285 4.6061-1.2268 0.39542-2.4536 0.79084-3.7175 1.1982-2.4766 0.79802-4.9533 1.5955-7.4302 2.3926-7.4276 2.3919-14.848 4.8064-22.262 7.2373-18.255 5.9813-36.529 11.889-54.883 17.562-0.84659 0.26311-1.6932 0.52622-2.5654 0.7973-2.3726 0.73632-4.747 1.4667-7.1221 2.1949-0.70101 0.21801-1.402 0.43603-2.1243 0.66064-2.8482 0.86583-5.1914 1.4722-8.1882 1.4722 0.27264 0.97888 0.27264 0.97888 0.55078 1.9775 3.9917 14.611 6.3633 27.872 5.4492 43.022h-2c-5.0611-9.8452-9.6513-19.822-14-30-4.4853 4.1835-7.9783 8.8493-11.562 13.812-1.2534 1.7178-2.5073 3.4353-3.7617 5.1523-0.62181 0.8532-1.2436 1.7064-1.8843 2.5854-2.5306 3.4604-5.0924 6.8966-7.6665 10.325-0.47784 0.6368-0.95568 1.2736-1.448 1.9297-4.834 6.4273-9.726 12.81-14.61 19.2-4.4604 5.8494-8.8488 11.746-13.192 17.683-5.1353 7.0156-10.405 13.91-15.766 20.755-3.7632 4.8093-7.4615 9.6602-11.109 14.558-4.2179 5.6637-8.5201 11.253-12.875 16.812-4.8811 6.2348-9.638 12.546-14.312 18.938-5.3639 7.3332-10.884 14.513-16.533 21.628-2.1193 2.6872-4.1989 5.4047-6.2793 8.1221-3.4681 4.5256-6.9709 9.0218-10.5 13.5-3.874 4.9169-7.7118 9.8595-11.522 14.826-9.1315 11.896-18.375 23.705-27.652 35.488-2.2775 2.8936-4.5519 5.7897-6.8267 8.6855-2.7961 3.5592-5.5926 7.1181-8.3906 10.676-5.0542 6.4277-10.1 12.862-15.109 19.324 0.99 1.65 1.98 3.3 3 5-4.1242-1.6617-7.0655-4.6234-10.25-7.625-0.5543-0.51562-1.1086-1.0312-1.6797-1.5625-1.3606-1.2668-2.716-2.5391-4.0703-3.8125 1.6268-3.6539 3.8669-6.596 6.3125-9.75 0.43441-0.56074 0.86883-1.1215 1.3164-1.6992 4.1028-5.2668 8.3245-10.436 12.55-15.604 3.3615-4.1209 6.6595-8.28 9.8838-12.509 3.5663-4.6743 7.1936-9.2908 10.875-13.875 5.7387-7.148 11.418-14.34 17.062-21.562 0.52288-0.66838 1.0458-1.3368 1.5845-2.0254 8.3281-10.652 16.554-21.378 24.736-32.143 2.9156-3.8344 5.8538-7.6498 8.8047-11.457 4.5205-5.8616 8.8975-11.824 13.273-17.794 4.5458-6.1869 9.1826-12.299 13.852-18.393 4.7428-6.1924 9.4013-12.419 13.884-18.802 3.8186-5.3996 7.843-10.637 11.866-15.885 4.8482-6.3256 9.6231-12.679 14.212-19.195 3.5844-5.0695 7.304-10.033 11.038-14.993 13.008-17.283 25.755-34.749 38.348-52.336 0.59031-0.82234 1.1806-1.6447 1.7888-2.4919 1.1321-1.5772 2.2619-3.1561 3.3892-4.7368 0.50974-0.70955 1.0195-1.4191 1.5447-2.1501 0.44618-0.62383 0.89235-1.2477 1.3521-1.8904 2.4758-3.1838 4.393-4.9888 8.2991-6.1675 0.81133-0.24997 1.6227-0.49994 2.4586-0.75749 0.89321-0.26461 1.7864-0.52921 2.7067-0.80183 0.95336-0.29083 1.9067-0.58166 2.889-0.8813 3.218-0.97942 6.4399-1.9453 9.6618-2.9117 2.2999-0.69745 4.5996-1.3959 6.8989-2.0952 4.3839-1.3323 8.7687-2.6616 13.155-3.9868 9.3777-2.8337 18.747-5.6947 28.114-8.5625 3.0712-0.94012 6.1424-1.8802 9.2136-2.8203 1.1475-0.35129 1.1475-0.35129 2.3183-0.70968 9.2804-2.8405 18.563-5.6724 27.846-8.5048 8.2032-2.5031 16.406-5.0088 24.605-7.5237 21.256-6.5191 42.543-12.934 63.862-19.241 2.6425-0.78197 5.2838-1.5678 7.9242-2.357 3.6676-1.0959 7.3393-2.1775 11.012-3.2577 1.6605-0.49876 1.6605-0.49876 3.3544-1.0076 1.0144-0.29583 2.0289-0.59166 3.074-0.89645 0.88496-0.262 1.7699-0.52399 2.6817-0.79393 2.2531-0.43092 2.2531-0.43092 5.2531 0.56908z\" fill=\"#DEDBCB\"/>\r\n        <path transform=\"translate(222,752)\" d=\"m0 0c0.097969 1.2207 0.19594 2.4415 0.29688 3.6992 1.3785 15.768 4.5864 28.154 13.703 41.301 0.4602 0.67805 0.92039 1.3561 1.3945 2.0547 8.4689 11.104 24.144 18.685 37.605 20.945 3.6723 0.22116 7.3228 0.19094 11 0.125 0.96551-0.0090234 1.931-0.018047 2.9258-0.027344 2.3583-0.02335 4.7161-0.056096 7.0742-0.097656 0.17549 4.823-0.23757 8.6279-1.8125 13.188-0.33645 1.0042-0.67289 2.0084-1.0195 3.043-1.1557 2.7403-2.1546 4.5916-4.168 6.7695-2.1538 0.50171-2.1538 0.50171-4.6484 0.49609-1.3744 0.004834-1.3744 0.004834-2.7766 0.0097656-0.97348-0.022559-1.947-0.045117-2.95-0.068359-0.99862-0.016113-1.9972-0.032227-3.0261-0.048828-18.19-0.48409-35.191-6.8886-48.599-19.389-1.1312-0.9958-1.1312-0.9958-2.2852-2.0117-15.52-14.402-24.263-35.347-25.277-56.363-0.066406-2.4609-0.066406-2.4609 0.5625-4.625 3.4222-3.4096 7.078-5.0664 11.562-6.75 1.115-0.42797 2.2301-0.85594 3.3789-1.2969 3.0586-0.95312 3.0586-0.95312 7.0586-0.95312z\" fill=\"#D69E43\"/>\r\n        <path transform=\"translate(300,679)\" d=\"m0 0c3.0317 3.6421 5.5712 7.4095 8.0625 11.438 11.9 18.702 27.212 35.21 44.938 48.562-2.783 4.6383-6.0497 8.1612-9.9219 11.926-1.9804 1.9767-3.8182 4.0146-5.6406 6.1367-2.3436 2.6967-4.6882 5.3869-7.125 8-0.54012 0.5891-1.0802 1.1782-1.6367 1.7852-1.6758 1.1523-1.6758 1.1523-3.6211 1.0234-18.143-7.692-32.71-31.267-39.876-48.891-5.0057-13.128-5.0057-13.128-4.1787-18.98 1.9414-2.7109 1.9414-2.7109 4.5625-5.375 1.3632-1.4173 1.3632-1.4173 2.7539-2.8633 0.88559-0.91137 1.7712-1.8227 2.6836-2.7617 1.3448-1.5107 2.6798-3.0302 4-4.5625 1.6261-1.8802 3.241-3.6785 5-5.4375z\" fill=\"#597A53\"/>\r\n        <path transform=\"translate(709,299)\" d=\"m0 0h1c0.2107 4.5403-0.37761 7.9852-1.9375 12.25-0.35965 1.0364-0.7193 2.0728-1.0898 3.1406-5.8514 12.187-19.647 22.363-29.098 31.734-3.2139 3.1871-6.4244 6.3777-9.6328 9.5703-0.72309 0.7148-1.4462 1.4296-2.1912 2.166-4.0306 4.0114-7.8743 8.1207-11.575 12.44-1.8906 2.1757-3.9083 4.1927-5.9765 6.1991-2.6627 2.6271-5.2126 5.2673-7.625 8.125-3.5747 4.1788-7.4706 8.0084-11.375 11.875-4.4304 4.3876-8.7431 8.7779-12.766 13.547-2.7523 3.0994-5.7324 5.9715-8.6819 8.8811-3.2936 3.2663-6.3676 6.6513-9.3767 10.177-2.4423 2.7611-5.0813 5.3092-7.707 7.8945-1.9086 1.9389-3.6959 3.937-5.4688 6-2.3968 2.789-4.8796 5.4199-7.5 8-2.4971 2.4591-4.8606 4.9509-7.125 7.625-3.4278 3.9965-7.1353 7.6743-10.875 11.375-4.2969 4.2521-8.4552 8.5277-12.363 13.145-1.9557 2.2171-4.0323 4.2792-6.1367 6.3555-2.6627 2.6271-5.2126 5.2673-7.625 8.125-4.1496 4.8509-8.727 9.2785-13.282 13.745-3.1547 3.112-6.1806 6.2622-9.062 9.6304-4.1733 4.8399-8.8501 9.0602-13.57 13.355-4.096 3.7718-7.8681 7.6736-11.479 11.914-3.4081 3.9797-7.2579 7.4981-11.107 11.043-1.1331 1.0461-1.1331 1.0461-2.2891 2.1133-2.0859 1.5742-2.0859 1.5742-5.0859 1.5742-2.0948 1.6918-2.0948 1.6918-4.125 3.875-1.0557 1.0789-1.0557 1.0789-2.1328 2.1797-1.7962 1.8336-1.7962 1.8336-2.7422 3.9453l-2-1c5.0659-5.961 10.396-11.664 15.745-17.37 3.2686-3.4905 6.5098-6.9986 9.6926-10.568 4.5965-5.1484 9.3291-10.166 14.072-15.179 3.6989-3.9225 7.2942-7.9151 10.829-11.986 2.4388-2.7858 4.9516-5.4996 7.4736-8.21 1.042-1.1247 2.0836-2.2497 3.125-3.375 0.51305-0.5543 1.0261-1.1086 1.5547-1.6797 5.0266-5.4433 10.031-10.908 14.883-16.508 3.6073-4.1544 7.3481-8.1822 11.099-12.207 2.6949-2.8999 5.3367-5.8352 7.9321-8.8247 4.1992-4.8221 8.5917-9.4524 12.988-14.094 3.7604-3.9861 7.4233-8.034 10.996-12.189 1.6392-1.844 3.3487-3.5828 5.1094-5.3105 2.2933-2.258 4.4643-4.56 6.5625-7 5.1684-5.9857 10.626-11.708 16.036-17.474 1.8617-1.9841 3.7216-3.9698 5.5811-5.9561 3.1132-3.3247 6.2293-6.6466 9.3467-9.9673 1.3605-1.4497 2.7205-2.9 4.0801-4.3506 2.1301-2.2727 4.2617-4.5439 6.3936-6.8149 0.6463-0.69013 1.2926-1.3803 1.9585-2.0913 3.0535-3.2496 6.1349-6.4582 9.2993-9.6001 2.3124-2.2965 4.5196-4.6239 6.6172-7.1211 2.5913-3.0097 5.2975-5.8359 8.125-8.625 2.7862-2.7486 5.4531-5.5286 8-8.5 3.18-3.7101 6.5876-7.1298 10.094-10.531 1.9594-2.0103 3.7888-4.0495 5.6172-6.1758 4.0901-4.7132 8.4794-9.0936 12.914-13.48 1.1776-1.1708 1.1776-1.1708 2.3789-2.3652 1.5045-1.4956 3.01-2.9903 4.5166-4.4839 2.3333-2.3144 4.6578-4.6373 6.9795-6.9634l2-2z\" fill=\"#999E95\"/>\r\n        <path transform=\"translate(330,646)\" d=\"m0 0c3.0643 2.8786 5.7032 5.8393 8.25 9.1875 13.862 18.047 30.869 32.924 48.75 46.812-3.4059 4.8032-6.9622 9.1072-11.195 13.199-2.5843 2.5788-4.947 5.3327-7.3242 8.1016-1.1122 1.2765-2.2833 2.502-3.4805 3.6992-4.3036-0.136-7.245-3.4296-10.312-6.125-0.60812-0.52989-1.2162-1.0598-1.8428-1.6057-16.559-14.619-35.238-32.125-40.845-54.269 0.56848-0.55688 1.137-1.1138 1.7227-1.6875 4.4723-4.42 8.7818-8.9028 12.867-13.684 1.0864-1.255 2.2364-2.4552 3.4102-3.6289z\" fill=\"#557450\"/>\r\n        <path transform=\"translate(269,715)\" d=\"m0 0c1.8167 2.7251 2.8339 5.1722 3.9016 8.2412 7.6075 21.783 22.031 41.387 40.098 55.759-1.3319 3.9444-2.9465 6.3059-5.9141 9.207-0.76055 0.75088-1.5211 1.5018-2.3047 2.2754-0.79406 0.76893-1.5881 1.5379-2.4062 2.3301-0.8018 0.78826-1.6036 1.5765-2.4297 2.3887-1.9752 1.9399-3.957 3.8724-5.9453 5.7988-2.6824-1.2558-4.9113-2.5933-7.1719-4.5039-0.5779-0.48823-1.1558-0.97646-1.7512-1.4795-14.855-12.84-27.297-28.164-30.764-48.079-0.12955-0.68127-0.2591-1.3625-0.39258-2.0645-0.35398-1.9497-0.63857-3.9116-0.91992-5.873-0.15727-1.0068-0.31453-2.0135-0.47656-3.0508 0.73735-4.5631 3.5816-6.9043 6.7891-10.074 1.1851-1.2095 2.3687-2.4204 3.5508-3.6328 0.82685-0.83966 0.82685-0.83966 1.6704-1.6963 1.6526-1.7423 3.1039-3.5687 4.4663-5.5459z\" fill=\"#567651\"/>\r\n        <path transform=\"translate(192,769)\" d=\"m0 0h1c0.14695 1.4715 0.14695 1.4715 0.29688 2.9727 2.6679 24.875 11.39 47.293 30.809 63.898 17.824 13.11 36.184 17.082 57.895 18.129-3.6339 3.1796-6.9801 5.0137-11.5 6.6875-1.1034 0.41637-2.2069 0.83273-3.3438 1.2617-15.543 5.1747-31.668 2.2134-46.242-4.3359-17.807-9.1029-29.218-23.283-36.078-41.746-4.3069-14.772-2.4333-29.741 4.9141-43.18 0.73723-1.2369 1.482-2.4695 2.25-3.6875z\" fill=\"#DBA445\"/>\r\n        <path transform=\"translate(350,620)\" d=\"m0 0c4.1266 1.5864 6.6322 4.5923 9.5 7.8125 1.0729 1.1824 2.1458 2.3646 3.2188 3.5469 0.54527 0.60521 1.0905 1.2104 1.6523 1.834 10.089 11.19 20.27 22.369 31.754 32.154 3.4577 3.0471 6.6484 6.3647 9.875 9.6523l4 4-11 11c-3.0348-1.5174-5.0628-2.7095-7.6094-4.793-1.0017-0.81573-1.0017-0.81573-2.0237-1.6479-1.0479-0.86456-1.0479-0.86456-2.1169-1.7466-0.72373-0.59442-1.4475-1.1888-2.1931-1.8013-2.0228-1.6658-4.0411-3.3368-6.0569-5.0112-0.71422-0.59087-1.4284-1.1817-2.1643-1.7905-14.287-11.926-27.473-26.068-36.836-42.209 3.2076-3.8064 6.4075-7.5456 10-11z\" fill=\"#536F4F\"/>\r\n        <path transform=\"translate(541,482)\" d=\"m0 0c0.8125 2.1875 0.8125 2.1875 1 5-2.3125 2.5-2.3125 2.5-5 5-0.29624 0.78206-0.59249 1.5641-0.89771 2.3699-1.3216 3.1535-2.9794 4.8341-5.4265 7.2122-0.86432 0.85014-1.7286 1.7003-2.6191 2.5762-0.90557 0.87592-1.8111 1.7518-2.7441 2.6543-7.198 6.9689-7.198 6.9689-13.957 14.355-4.1005 4.7943-8.7352 8.9477-13.395 13.188-4.096 3.7718-7.8681 7.6736-11.479 11.914-3.4081 3.9797-7.2579 7.4981-11.107 11.043-0.75539 0.69738-1.5108 1.3948-2.2891 2.1133-2.0859 1.5742-2.0859 1.5742-5.0859 1.5742-2.0948 1.6918-2.0948 1.6918-4.125 3.875-1.0557 1.0789-1.0557 1.0789-2.1328 2.1797-1.7962 1.8336-1.7962 1.8336-2.7422 3.9453l-2-1c5.0659-5.961 10.396-11.664 15.745-17.37 3.2686-3.4905 6.5098-6.9986 9.6926-10.568 4.5965-5.1484 9.3291-10.166 14.072-15.179 3.6989-3.9225 7.2942-7.9151 10.829-11.986 2.4388-2.7858 4.9512-5.5 7.4736-8.21 2.9913-3.22 5.9796-6.4401 8.9023-9.7227 13.359-14.965 13.359-14.965 17.285-14.965z\" fill=\"#8F958D\"/>\r\n        <path transform=\"translate(314,472)\" d=\"m0 0 1 2c-0.70393 1.6517-1.4143 3.301-2.1582 4.9351-1.4948 3.6667-2.2224 7.5243-3.0918 11.377-2.2031 9.317-5.3595 18.002-9.0132 26.835-1.0262 2.5802-1.8744 5.214-2.7368 7.8525l-1 2c-2.6475-2.5778-4.9443-4.9165-7-8 0.34214-3.6963 1.5738-6.3842 3.4414-9.5547 0.49766-0.85521 0.99532-1.7104 1.5081-2.5916 0.79845-1.3507 0.79845-1.3507 1.613-2.7288 1.0954-1.8831 2.1892-3.7673 3.2812-5.6523 0.53754-0.92667 1.0751-1.8533 1.6289-2.8081 4.4393-7.7447 8.5598-15.669 12.527-23.665z\" fill=\"#9EA298\"/>\r\n        <path transform=\"translate(835,164)\" d=\"m0 0 1 3c-14.214 14.476-14.214 14.476-21 19v-3l-2-1c3.1818-11.319 3.1818-11.319 7.8545-14.106 4.5667-1.8864 9.3062-2.9567 14.146-3.8936z\" fill=\"#BBBCAE\"/>\r\n        <path transform=\"translate(489,537)\" d=\"m0 0 1 3c-0.99 0.33-1.98 0.66-3 1l0.375 2.1875c-0.375 2.8125-0.375 2.8125-3.0625 5.3125-0.55043 0.4125-1.1009 0.825-1.668 1.25-1.8702 1.3631-1.8702 1.3631-4.1445 3.75-2.7216 2.7216-5.4617 5.1369-8.5 7.5h-2c-1.9982 1.7153-1.9982 1.7153-4.0625 3.875-0.71285 0.7193-1.4257 1.4386-2.1602 2.1797-1.8323 1.8276-1.8323 1.8276-2.7773 3.9453l-2-1c4.5796-5.3888 9.3633-10.581 14.188-15.75 0.60602-0.64977 1.212-1.2995 1.8364-1.969 4.0865-4.3668 8.1549-8.6631 12.726-12.531l1.8594-1.5781 1.3906-1.1719z\" fill=\"#8A9188\"/>\r\n        <path transform=\"translate(507,525)\" d=\"m0 0c0 3 0 3-1.5605 4.8694-0.71221 0.68377-1.4244 1.3675-2.1582 2.072-1.1505 1.1225-1.1505 1.1225-2.3242 2.2676-1.2162 1.165-1.2162 1.165-2.457 2.3535-1.5981 1.5384-3.1921 3.0812-4.7812 4.6289-0.71221 0.68264-1.4244 1.3653-2.1582 2.0686-1.7831 1.5986-1.7831 1.5986-1.5605 3.74h-3l-0.25 1.875c-0.99452 2.8178-2.1266 2.8352-4.75 4.125-1.7442 1.4565-1.7442 1.4565-3.3828 3.1523-0.60973 0.61166-1.2195 1.2233-1.8477 1.8535-0.6252 0.63744-1.2504 1.2749-1.8945 1.9316-0.63293 0.63357-1.2659 1.2671-1.918 1.9199-2.6158 2.6408-4.8858 5.0357-6.957 8.1426-0.99-0.33-1.98-0.66-3-1 0.4241-0.4125 0.8482-0.825 1.2852-1.25 3.8837-3.824 7.5292-7.7774 11.09-11.902 2.1049-2.3933 4.342-4.6247 6.625-6.8477 2.7908-2.781 5.5691-5.574 8.3398-8.375 1.1992-1.2084 2.3984-2.4167 3.5977-3.625 0.5949-0.60328 1.1898-1.2066 1.8027-1.8281 3.5986-3.6183 7.2862-6.9688 11.26-10.172z\" fill=\"#666E68\"/>\r\n        <path transform=\"translate(317,466)\" d=\"m0 0c8.7329 9.7032 10.899 21.728 13.625 34.062 0.57344 2.5517 1.1507 5.1024 1.7325 7.6522 0.35842 1.5749 0.71172 3.151 1.0587 4.7284 2.1677 10.528 2.1677 10.528 7.5838 19.557l-1 2c-8.3233-7.6297-9.3156-21.34-11-32h-2l-0.25-3.5625c-1.0117-9.1056-3.4093-18.364-7.75-26.438h-4l2-6z\" fill=\"#889088\"/>\r\n        <path transform=\"translate(222,752)\" d=\"m0 0v15c-2.2091-3.3137-2.2248-4.3446-2.125-8.1875 0.018047-0.90105 0.036094-1.8021 0.054688-2.7305 0.023203-0.68707 0.046406-1.3741 0.070312-2.082-1.8983 0.59643-3.7935 1.2025-5.6875 1.8125-1.0557 0.33645-2.1115 0.67289-3.1992 1.0195-4.3488 1.5799-4.3488 1.5799-8.1133 4.168-0.54462 2.7532-0.78934 4.9314-0.8125 7.6875-0.025137 0.70189-0.050273 1.4038-0.076172 2.127-0.058773 1.7279-0.087938 3.4568-0.11133 5.1855h2l1 12c-5.4892-5.4892-5.3219-17.243-5.5938-24.695 0.88616-3.4397 2.6573-4.4001 5.5938-6.3047 3.1914-1.4844 3.1914-1.4844 6.5625-2.75 1.115-0.42797 2.2301-0.85594 3.3789-1.2969 3.0586-0.95312 3.0586-0.95312 7.0586-0.95312z\" fill=\"#F2CF53\"/>\r\n        <path transform=\"translate(630,268)\" d=\"m0 0v20h-2c-1.2284-2.241-2.4323-4.4901-3.625-6.75-0.35062-0.63422-0.70125-1.2684-1.0625-1.9219-0.97656-1.875-0.97656-1.875-2.3125-5.3281 0.78906-2.4531 0.78906-2.4531 2-4 0.99 0.33 1.98 0.66 3 1 0.47438-0.495 0.94875-0.99 1.4375-1.5 1.5625-1.5 1.5625-1.5 2.5625-1.5z\" fill=\"#D4D2C0\"/>\r\n        <path transform=\"translate(221,899)\" d=\"m0 0c6.329 0.82552 6.329 0.82552 8.9004 1.4941 9.0828 2.2894 18.432 1.7221 27.725 1.6309 1.7852-0.010049 3.5703-0.019171 5.3555-0.027344 4.34-0.021864 8.6797-0.056288 13.02-0.097656-14.144 7.6979-38.701 2.826-53.121-1.4141-0.62004-0.19336-1.2401-0.38672-1.8789-0.58594v-1z\" fill=\"#A6724F\"/>\r\n        <path transform=\"translate(463,641)\" d=\"m0 0c3.0879 1.4354 5.6993 3.1697 8.4375 5.1875 5.8984 4.1968 12.138 7.4995 18.562 10.812-3.0103 0.93424-3.8665 1.0445-7 0 0.99 1.32 1.98 2.64 3 4-3.9512-1.622-6.7581-4.3566-9.8125-7.25-1.0629-0.99313-2.1267-1.9853-3.1914-2.9766-0.51192-0.47728-1.0238-0.95455-1.5513-1.4463-1.8547-1.7037-3.7651-3.3342-5.6948-4.9521l-2.75-2.375v-1z\" fill=\"#262B26\"/>\r\n        <path transform=\"translate(232,859)\" d=\"m0 0c0.92941 0.1534 1.8588 0.3068 2.8164 0.46484 5.0197 0.71709 10.059 0.88661 15.121 1.0977 0.97002 0.043184 1.94 0.086367 2.9395 0.13086 2.3742 0.10526 4.7486 0.2074 7.123 0.30664l-1 3c-3.0833 0.058225-6.1664 0.093671-9.25 0.125-1.309 0.025137-1.309 0.025137-2.6445 0.050781-0.84434 0.0064453-1.6887 0.012891-2.5586 0.019531-0.77505 0.010474-1.5501 0.020947-2.3486 0.031738-4.1383-0.42744-6.9982-2.7127-10.198-5.2271z\" fill=\"#D69E3F\"/>\r\n        <path transform=\"translate(594,390)\" d=\"m0 0c0 3 0 3-1.8984 5.0859-1.6456 1.521-3.2915 3.0419-4.9375 4.5625-2.2384 2.4324-3.0164 4.2993-4.1641 7.3516-3.2847 4.1286-6.8038 7.5828-12 9 1.4841-3.4865 3.4621-5.6419 6.1875-8.25 3.6022-3.5155 6.9624-7.1351 10.238-10.953 2.0876-2.3829 4.3006-4.5921 6.5742-6.7969z\" fill=\"#1C211D\"/>\r\n        <path transform=\"translate(500,523)\" d=\"m0 0c0 3 0 3-2 6v3c-1.4258 1.8242-1.4258 1.8242-3.3125 3.6875-0.92232 0.93393-0.92232 0.93393-1.8633 1.8867-1.8242 1.4258-1.8242 1.4258-4.8242 1.4258-1.655 1.0773-1.655 1.0773-3.1875 2.5l-2.8125 2.5c1.4841-3.4865 3.4621-5.6419 6.1875-8.25 4.1709-4.0697 8.0464-8.3058 11.812-12.75z\" fill=\"#989F95\"/>\r\n        <path transform=\"translate(314,472)\" d=\"m0 0 1 2c-0.70673 1.6582-1.4197 3.314-2.1675 4.9541-1.7251 4.2393-2.4514 8.79-3.3813 13.257-0.42594 1.9433-0.93217 3.8686-1.4512 5.7891l-2 1v-7l-3 3c1.5565-5.3537 3.9818-10.002 6.625-14.875 0.42023-0.78375 0.84047-1.5675 1.2734-2.375 1.0297-1.9189 2.065-3.8348 3.1016-5.75z\" fill=\"#AFB2A7\"/>\r\n        <path transform=\"translate(321,656)\" d=\"m0 0c0 3 0 3-1.418 4.5078-0.87592 0.80051-0.87592 0.80051-1.7695 1.6172-2.3576 2.6146-2.3576 2.6146-2.7539 5.9805 2.2333 7.129 6.4275 14.807 11.941 19.895l-1 3c-5.7437-7.2744-11.359-15.002-14-24 0.97563-3.3476 3.1483-5.365 5.625-7.75 0.63164-0.61359 1.2633-1.2272 1.9141-1.8594 0.72316-0.68836 0.72316-0.68836 1.4609-1.3906z\" fill=\"#659060\"/>\r\n        <path transform=\"translate(843,162)\" d=\"m0 0-7 4-1-1c-1.1954 0.37137-1.1954 0.37137-2.415 0.75024-2.9645 0.91567-5.9317 1.8222-8.9009 2.7227-1.9138 0.58341-3.8243 1.1773-5.7349 1.7712-1.8079 0.54624-1.8079 0.54624-3.6523 1.1035-1.6653 0.51059-1.6653 0.51059-3.3643 1.0315-2.8388 0.60099-4.2578 0.62531-6.9326-0.37915 8.6851-3.0151 17.427-5.7923 26.25-8.375 1.3751-0.4121 1.3751-0.4121 2.7781-0.83252 0.86214-0.24863 1.7243-0.49726 2.6125-0.75342 0.7686-0.22478 1.5372-0.44956 2.3291-0.68115 2.0303-0.35791 2.0303-0.35791 5.0303 0.64209z\" fill=\"#EEEEE7\"/>\r\n        <path transform=\"translate(363,539)\" d=\"m0 0c2.4928 2.1978 3.4918 3.8839 4.3906 7.0664 1.9026 6.1312 4.7821 11.714 7.6445 17.443 0.39574 0.81018 0.79148 1.6204 1.1992 2.4551 0.36319 0.72824 0.72639 1.4565 1.1006 2.2068 0.21946 0.60336 0.43893 1.2067 0.66504 1.8284l-1 2c-2.31-2.64-4.62-5.28-7-8l2-1c-0.72316-1.4676-0.72316-1.4676-1.4609-2.9648-3.3664-6.9464-6.3244-13.343-7.5391-21.035z\" fill=\"#202520\"/>\r\n        <path transform=\"translate(434,704)\" d=\"m0 0 2 2-2.125-0.14062-2.875-0.10938c-1.3922-0.069609-1.3922-0.069609-2.8125-0.14062-8.3614 1.0247-13.593 6.2565-19.188 12.141-0.67934 0.69738-1.3587 1.3948-2.0586 2.1133-1.6567 1.7034-3.3033 3.4154-4.9414 5.1367l-2-3c0.71543-0.38285 1.4309-0.7657 2.168-1.1602 3.2202-2.092 5.5201-4.4782 8.1445-7.2773 7.0863-7.2645 13.197-11.239 23.688-9.5625z\" fill=\"#0C0B12\"/>\r\n        <path transform=\"translate(529,502)\" d=\"m0 0c0 3 0 3-1.4961 4.7188-0.961 0.88172-0.961 0.88172-1.9414 1.7812-2.4839 2.2882-3.4713 3.2264-4.5625 6.5-3.3945 3.6854-7.1233 6.8445-11 10l-2-1c2.3733-2.5433 4.7489-5.0843 7.125-7.625 0.66516-0.71285 1.3303-1.4257 2.0156-2.1602 3.882-4.1484 7.8168-8.2227 11.859-12.215z\" fill=\"#5F6662\"/>\r\n        <path transform=\"translate(636,389)\" d=\"m0 0 1 2c-2.7844 3.6093-5.7605 6.7977-9 10-0.9655 0.96419-1.9303 1.929-2.8945 2.8945l-8.1055 8.1055-2-1c2.3733-2.5433 4.7489-5.0843 7.125-7.625 0.66516-0.71285 1.3303-1.4257 2.0156-2.1602 3.882-4.1484 7.8168-8.2227 11.859-12.215z\" fill=\"#69706C\"/>\r\n        <path transform=\"translate(746,366)\" d=\"m0 0c4.8363 0.99044 9.4762 1.957 14 4-3 1-3 1-5 1 0.99902 0.69867 1.998 1.3973 3.0273 2.1172 1.3035 0.91905 2.6069 1.8383 3.9102 2.7578 0.65936 0.4602 1.3187 0.92039 1.998 1.3945 4.9512 3.5039 4.9512 3.5039 6.0645 5.7305-3.9726-1.3958-6.962-3.2766-10.312-5.8125-3.382-2.5251-6.7496-4.9015-10.375-7.0625l-3.3125-2.125v-2z\" fill=\"#1E231E\"/>\r\n        <path transform=\"translate(287,640)\" d=\"m0 0c0 3.3118-0.54378 4.313-2.25 7.0625-0.62648 1.0383-0.62648 1.0383-1.2656 2.0977-1.6814 2.084-3.1057 2.6754-5.4844 3.8398-1.8591 1.8681-1.8591 1.8681-3.5625 4-2.1111 2.5577-3.6372 4.1331-6.4375 6 1.6832-4.2338 4.7224-7.1317 7.8125-10.375 3.8774-4.1027 7.6144-8.2528 11.188-12.625z\" fill=\"#B17C56\"/>\r\n        <path transform=\"translate(269,715)\" d=\"m0 0c1.7369 2.6054 2.691 4.5834 3.6875 7.5 0.27199 0.77344 0.54398 1.5469 0.82422 2.3438 0.48828 2.1562 0.48828 2.1562-0.51172 5.1562l-4-9-3.8125 2.875c-2.3634 1.7822-4.7226 3.4818-7.1875 5.125 1.5778-3.7105 3.907-6.2991 6.625-9.25 0.81727-0.89203 1.6345-1.7841 2.4766-2.7031 0.62648-0.67547 1.253-1.3509 1.8984-2.0469z\" fill=\"#659360\"/>\r\n        <path transform=\"translate(539,583)\" d=\"m0 0 2 1c-2.7654 2.8396-5.5406 5.6692-8.3252 8.49-1.4099 1.4324-2.8119 2.8725-4.2139 4.3127-0.88945 0.89912-1.7789 1.7982-2.6953 2.7246-0.81694 0.83265-1.6339 1.6653-2.4756 2.5232-2.2207 1.8905-3.4429 2.5807-6.29 2.9495 4.1488-5.1314 8.6395-9.4801 13.586-13.844 2.9258-2.6133 5.6771-5.3473 8.4141-8.1562z\" fill=\"#252A24\"/>\r\n        <path transform=\"translate(624,272)\" d=\"m0 0c1.9375 0.5625 1.9375 0.5625 4 2 0.6875 3.1875 0.6875 3.1875 1 7l1 7h-2c-2.6939-4.7755-4.3135-9.5655-5-15l1-1z\" fill=\"#CAC8B8\"/>\r\n        <path transform=\"translate(365,599)\" d=\"m0 0h2c1.4102 1.4688 1.4102 1.4688 3.0625 3.5 2.6813 3.175 5.4664 5.9251 8.625 8.625 3.5174 3.0372 6.0011 5.8552 8.3125 9.875-3.4361-1.4823-5.687-3.4295-8.3281-6.0625-0.79922-0.79664-1.5984-1.5933-2.4219-2.4141-0.825-0.83273-1.65-1.6655-2.5-2.5234-0.84047-0.83273-1.6809-1.6655-2.5469-2.5234-0.79406-0.79664-1.5881-1.5933-2.4062-2.4141-1.093-1.0963-1.093-1.0963-2.208-2.2148-1.5889-1.8477-1.5889-1.8477-1.5889-3.8477z\" fill=\"#6A736B\"/>\r\n        <path transform=\"translate(809,287)\" d=\"m0 0c1.9919 6.925-1.0559 14.487-4.1875 20.75l-1.8125 3.25c-1.1931-3.4444-0.80482-5.3763 0.43359-8.7656 0.31904-0.88945 0.63809-1.7789 0.9668-2.6953 0.34225-0.92039 0.68449-1.8408 1.0371-2.7891 0.33838-0.93586 0.67676-1.8717 1.0254-2.8359 0.83619-2.3083 1.6821-4.6126 2.5371-6.9141z\" fill=\"#272D28\"/>\r\n        <path transform=\"translate(264,854)\" d=\"m0 0h18c-4.4605 3.5684-6.8589 5.1911-12 7-0.99-0.33-1.98-0.66-3-1 2.31-0.99 4.62-1.98 7-3l-10-2v-1z\" fill=\"#EEBC46\"/>\r\n        <path transform=\"translate(782,362)\" d=\"m0 0c1.2403 3.7209 0.5719 4.9946-0.75 8.625-0.5182 1.4734-0.5182 1.4734-1.0469 2.9766-1.2031 2.3984-1.2031 2.3984-4.2031 3.3984-2.6992-0.99609-2.6992-0.99609-5.6875-2.4375-0.99387-0.47309-1.9877-0.94617-3.0117-1.4336-0.75926-0.37254-1.5185-0.74508-2.3008-1.1289 3.4787-1.1596 4.3422-0.77457 7.6875 0.4375 0.80824 0.28746 1.6165 0.57492 2.4492 0.87109 0.61488 0.22816 1.2298 0.45633 1.8633 0.69141v-2h2c0.99-3.3 1.98-6.6 3-10z\" fill=\"#868E89\"/>\r\n        <path transform=\"translate(734,320)\" d=\"m0 0 3 2c0.1875 2.625 0.1875 2.625 0 5h2l-1 3h-4v-3c-0.99-0.33-1.98-0.66-3-1v-5c0.99 0.33 1.98 0.66 3 1v-2z\" fill=\"#7B827E\"/>\r\n        <path transform=\"translate(350,620)\" d=\"m0 0c2.8606 1.3594 4.8593 2.6452 7 5l-1 2-5-4c-0.48211 0.50531-0.96422 1.0106-1.4609 1.5312-0.63164 0.64969-1.2633 1.2994-1.9141 1.9688-0.62648 0.64969-1.253 1.2994-1.8984 1.9688-1.7266 1.5312-1.7266 1.5312-3.7266 1.5312l-1 2c0-3 0-3 1.9688-5.2617 1.253-1.2008 1.253-1.2008 2.5312-2.4258 0.83531-0.80824 1.6706-1.6165 2.5312-2.4492 0.64969-0.61488 1.2994-1.2298 1.9688-1.8633z\" fill=\"#5F845A\"/>\r\n        <path transform=\"translate(193,766)\" d=\"m0 0c2 2 2 2 2.25 5.5-0.25 3.5-0.25 3.5-2.25 5.5l-1-7c-1.98 3.63-3.96 7.26-6 11l-1-2c0.89062-2.2773 0.89062-2.2773 2.25-4.9375 0.43828-0.87527 0.87656-1.7505 1.3281-2.6523 1.2949-2.1948 2.5315-3.7255 4.4219-5.4102z\" fill=\"#1D202B\"/>\r\n        <path transform=\"translate(732,266)\" d=\"m0 0 2 1c-1.9681 1.9681-3.9364 3.936-5.9062 5.9023-1.6034 1.6064-3.1949 3.2245-4.7812 4.8477-2.3234 2.2606-4.7471 4.271-7.3125 6.25l-2-1c0.43868-0.40839 0.87737-0.81678 1.3293-1.2375 1.9949-1.8578 3.989-3.7163 5.9832-5.575 1.0354-0.9639 1.0354-0.9639 2.0918-1.9473 0.66709-0.62197 1.3342-1.2439 2.0215-1.8848 0.91906-0.85622 0.91906-0.85622 1.8567-1.7297 1.6011-1.5155 3.1671-3.0587 4.7175-4.6257z\" fill=\"#69706D\"/>\r\n        <path transform=\"translate(568,461)\" d=\"m0 0v5c-1.4609 1.1836-1.4609 1.1836-3.375 2.4375-2.7109 1.7794-3.753 2.7544-5.625 5.5625-1.7266 1.3867-1.7266 1.3867-3.625 2.6875-0.94746 0.65549-0.94746 0.65549-1.9141 1.3242-0.72316 0.4892-0.72316 0.4892-1.4609 0.98828 1.3584-3.0433 2.8846-5.1231 5.2578-7.4531 0.6252-0.61875 1.2504-1.2375 1.8945-1.875 0.65098-0.63422 1.302-1.2684 1.9727-1.9219 0.65871-0.64969 1.3174-1.2994 1.9961-1.9688 1.6219-1.5984 3.2482-3.1919 4.8789-4.7812z\" fill=\"#686F6B\"/>\r\n        <path transform=\"translate(242,692)\" d=\"m0 0 1 3-1.9375 1.25c-2.2156 1.5244-2.2156 1.5244-2.5 3.6875-0.86056 3.1554-2.9377 4.27-5.5625 6.0625h-2c1.5778-3.7105 3.907-6.2991 6.625-9.25 0.81727-0.89203 1.6345-1.7841 2.4766-2.7031 0.62648-0.67547 1.253-1.3509 1.8984-2.0469z\" fill=\"#D69566\"/>\r\n        <path transform=\"translate(309,616)\" d=\"m0 0c0 3.5166-0.67787 4.3185-2.75 7.0625-0.51047 0.69223-1.0209 1.3845-1.5469 2.0977-1.7987 1.9431-3.3542 2.6892-5.7031 3.8398l-2 3-2-1c1.3891-1.7553 2.7866-3.504 4.1875-5.25 0.7773-0.97453 1.5546-1.9491 2.3555-2.9531 2.3127-2.6326 4.6551-4.7066 7.457-6.7969z\" fill=\"#C58B5F\"/>\r\n        <path transform=\"translate(296,820)\" d=\"m0 0c0.125 3.375 0.125 3.375 0 7l-2 2v-7h-20v-1c2.9166-0.16803 5.8333-0.33448 8.75-0.5 1.2375-0.071543 1.2375-0.071543 2.5-0.14453 1.1988-0.067676 1.1988-0.067676 2.4219-0.13672 0.73315-0.041895 1.4663-0.083789 2.2217-0.12695 2.0338-0.08863 4.0707-0.091797 6.1064-0.091797z\" fill=\"#EDBA44\"/>\r\n        <path transform=\"translate(365,540)\" d=\"m0 0c1.1289 0.93274 2.253 1.8714 3.375 2.8125 0.62648 0.52207 1.253 1.0441 1.8984 1.582 1.7266 1.6055 1.7266 1.6055 3.7266 4.6055h-4l-2 2c-0.50368-1.4571-1.0028-2.9157-1.5-4.375-0.27844-0.81211-0.55688-1.6242-0.84375-2.4609-0.65625-2.1641-0.65625-2.1641-0.65625-4.1641z\" fill=\"#7D867F\"/>\r\n        <path transform=\"translate(710,299)\" d=\"m0 0c0.26925 4.8028-0.56762 8.2823-2.3125 12.75-0.64389 1.6938-0.64389 1.6938-1.3008 3.4219-1.3867 2.8281-1.3867 2.8281-4.3867 4.8281 1.8676-5.7221 3.8529-11.377 6-17l-2-1c2.875-3 2.875-3 4-3z\" fill=\"#A3A89F\"/>\r\n        <path transform=\"translate(805,242)\" d=\"m0 0h4c-1.4526 3.8295-3.429 5.1205-7 7l-2-2c-0.99-0.33-1.98-0.66-3-1l1-2c1.9929-0.37366 3.9936-0.70741 6-1l1-1z\" fill=\"#7B827F\"/>\r\n        <path transform=\"translate(544,647)\" d=\"m0 0c5.6683 0.59468 10.603 2.0924 15.938 4.0625 0.77924 0.28166 1.5585 0.56332 2.3613 0.85352 1.9026 0.68866 3.8022 1.3855 5.7012 2.084-3.4782 1.1594-5.459 0.70821-9 0v-2c-0.91523-0.19336-1.8305-0.38672-2.7734-0.58594-1.1885-0.26039-2.377-0.52078-3.6016-0.78906-1.1834-0.25523-2.3667-0.51047-3.5859-0.77344-3.0391-0.85156-3.0391-0.85156-5.0391-2.8516z\" fill=\"#A47250\"/>\r\n        <path transform=\"translate(477,554)\" d=\"m0 0 2 1c-0.77086 0.83145-1.5417 1.6629-2.3359 2.5195-1.0131 1.0976-2.0261 2.1952-3.0391 3.293-0.50789 0.54721-1.0158 1.0944-1.5391 1.6582-2.2381 2.4295-4.2497 4.775-6.0859 7.5293-0.99-0.33-1.98-0.66-3-1 0.63615-0.61875 0.63615-0.61875 1.2852-1.25 4.4672-4.3985 8.6427-8.9847 12.715-13.75z\" fill=\"#606762\"/>\r\n        <path transform=\"translate(538,756)\" d=\"m0 0c-2.2887 1.3386-4.5807 2.671-6.875 4-0.65098 0.38156-1.302 0.76312-1.9727 1.1562-4.9258 2.8438-4.9258 2.8438-7.1523 2.8438l-1 2-2-2c1.2891-0.67155 2.5814-1.3371 3.875-2 0.7193-0.37125 1.4386-0.7425 2.1797-1.125 1.9453-0.875 1.9453-0.875 3.9453-0.875l1-3c5.4023-2.2989 5.4023-2.2989 8-1z\" fill=\"#A97551\"/>\r\n        <path transform=\"translate(311,481)\" d=\"m0 0h3c-0.56821 5.4548-1.9464 9.9106-4 15l-2-2c0.46094-3.0391 0.46094-3.0391 1.375-6.625 0.29648-1.1885 0.59297-2.377 0.89844-3.6016 0.23977-0.91523 0.47953-1.8305 0.72656-2.7734z\" fill=\"#707770\"/>\r\n        <path transform=\"translate(697,160)\" d=\"m0 0c-2.2881 2.2881-3.8075 2.7545-6.875 3.6875-0.86367 0.27199-1.7273 0.54398-2.6172 0.82422-2.5948 0.50521-4.0386 0.34389-6.5078-0.51172h2v-2c4.9274-1.9709 8.7802-2.18 14-2z\" fill=\"#D39968\"/>\r\n        <path transform=\"translate(275,656)\" d=\"m0 0 2 1c-0.48211 0.47051-0.96422 0.94102-1.4609 1.4258-0.63164 0.62262-1.2633 1.2452-1.9141 1.8867-0.62648 0.61488-1.253 1.2298-1.8984 1.8633-1.9074 1.9123-1.9074 1.9123-3.7266 4.8242-1.9675 1.0625-3.9659 2.0714-6 3 1.5658-4.0372 4.4417-6.4707 7.625-9.25l1.5625-1.3906c1.266-1.1253 2.5386-2.2431 3.8125-3.3594z\" fill=\"#D29566\"/>\r\n        <path transform=\"translate(489,537)\" d=\"m0 0 1 3c-0.99 0.33-1.98 0.66-3 1 0.061875 0.78375 0.12375 1.5675 0.1875 2.375l-0.1875 2.625-3 2-2-4 7-7zm-8 8 1 3-2-1 1-2z\" fill=\"#7E847C\"/>\r\n        <path transform=\"translate(395,449)\" d=\"m0 0 1 3-10 9c0-3.524 0.55115-4.015 2.8125-6.5625 0.78311-0.89912 0.78311-0.89912 1.582-1.8164 1.6055-1.6211 1.6055-1.6211 4.6055-3.6211z\" fill=\"#CA8F63\"/>\r\n        <path transform=\"translate(659,351)\" d=\"m0 0 1 4-2.5625 1.5625c-3.9798 2.631-7.166 5.9918-10.438 9.4375 0-3 0-3 2.625-5.918 1.1175-1.0975 2.2429-2.1871 3.375-3.2695 0.57234-0.55881 1.1447-1.1176 1.7344-1.6934 1.4153-1.3799 2.8396-2.7504 4.2656-4.1191z\" fill=\"#B3B8AE\"/>\r\n        <path transform=\"translate(295,434)\" d=\"m0 0 2 1c-2.8252 4.6725-5.6776 7.66-10 11 0-3.9613 1.3488-4.8291 4-7.6875 0.7425-0.80824 1.485-1.6165 2.25-2.4492 0.5775-0.61488 1.155-1.2298 1.75-1.8633z\" fill=\"#AE7B56\"/>\r\n        <path transform=\"translate(752,369)\" d=\"m0 0c8.282 0.34725 8.282 0.34725 11.062 2.875 0.9375 2.125 0.9375 2.125 0.9375 5.125-4.5567-1.5189-8.3172-3.954-12-7v-1z\" fill=\"#3D443E\"/>\r\n        <path transform=\"translate(197,888)\" d=\"m0 0c3.7189 0.50712 6.7345 1.1161 10 3v2c1.98 0.66 3.96 1.32 6 2-3 1-3 1-6.1367-0.43359-1.1893-0.65777-2.3727-1.3262-3.5508-2.0039-0.6065-0.33838-1.213-0.67676-1.8379-1.0254-1.4966-0.83669-2.9863-1.6857-4.4746-2.5371v-1z\" fill=\"#B9825A\"/>\r\n        <path transform=\"translate(551,613)\" d=\"m0 0 2 1-12 11-2-1c1.3021-1.4974 2.6042-2.9948 3.9062-4.4922 1.2895-1.4672 1.2895-1.4672 1.0938-3.5078 0.78375-0.12375 1.5675-0.2475 2.375-0.375 2.7656-0.41618 2.7656-0.41618 4.625-2.625z\" fill=\"#1E1C1E\"/>\r\n        <path transform=\"translate(456,571)\" d=\"m0 0 2 3-6 4 5 7c-3.7952-1.491-5.6104-3.757-8-7l7-7z\" fill=\"#858E85\"/>\r\n        <path transform=\"translate(282,551)\" d=\"m0 0c1.98 0.66 3.96 1.32 6 2l0.25 2.25c0.88969 3.2622 2.235 4.5595 4.75 6.75l-1 2c-1.6728-1.7863-3.3382-3.5785-5-5.375-0.71543-0.76184-0.71543-0.76184-1.4453-1.5391-3.5547-3.8594-3.5547-3.8594-3.5547-6.0859z\" fill=\"#191B1D\"/>\r\n        <path transform=\"translate(317,466)\" d=\"m0 0c3.3865 3.8702 6.3295 8.1013 8 13l-1 3-5-10h-4l2-6z\" fill=\"#929B92\"/>\r\n        <path transform=\"translate(818,176)\" d=\"m0 0c2 3 2 3 1.875 5-1.114 2.5463-2.5705 3.5132-4.875 5v-3l-2-1 2-4 1 2-1 2h2l1-6z\" fill=\"#B8B9AD\"/>\r\n        <path transform=\"translate(322,838)\" d=\"m0 0h1c-0.0603 1.9175-0.14917 3.8342-0.25 5.75l-0.14062 3.2344c-0.71527 3.5397-1.8652 4.7544-4.6094 7.0156 1.1506-5.398 2.4242-10.71 4-16z\" fill=\"#F4C182\"/>\r\n        <path transform=\"translate(843,162)\" d=\"m0 0-7 4-1-1c-1.9214 0.32744-1.9214 0.32744-4.0625 0.9375-0.73348 0.19465-1.467 0.3893-2.2227 0.58984-0.5659 0.15598-1.1318 0.31195-1.7148 0.47266l-1-2c2.2681-0.69809 4.5387-1.3837 6.8125-2.0625 0.6426-0.19916 1.2852-0.39832 1.9473-0.60352 4.9004-1.4473 4.9004-1.4473 8.2402-0.33398z\" fill=\"#DBDDD0\"/>\r\n        <path transform=\"translate(545,475)\" d=\"m0 0h1l-0.0625 2.8125c-0.095196 3.2104-0.095196 3.2104 1.0625 6.1875l-4 3c0-10 0-10 2-12z\" fill=\"#8E948B\"/>\r\n        <path transform=\"translate(191,773)\" d=\"m0 0h1l1 8h1v6l-1-3h-2l-0.375-1.9375-0.625-2.0625-2-1 3-6z\" fill=\"#E4B44E\"/>\r\n        <path transform=\"translate(380,468)\" d=\"m0 0c0 3.5891-0.66437 4.1086-3 6.6875-0.55688 0.62262-1.1138 1.2452-1.6875 1.8867-0.43312 0.47051-0.86625 0.94102-1.3125 1.4258l-1-4 7-6z\" fill=\"#D89A6A\"/>\r\n        <path transform=\"translate(746,366)\" d=\"m0 0c4.8363 0.99044 9.4762 1.957 14 4-3.1335 1.0445-3.9897 0.93424-7 0l-1 2c-2.0383-1.274-4.0385-2.6106-6-4v-2z\" fill=\"#2A2F2B\"/>\r\n        <path transform=\"translate(610,261)\" d=\"m0 0 1 2c-0.92735 1.4856-1.8672 2.9633-2.8125 4.4375-0.78311 1.2356-0.78311 1.2356-1.582 2.4961-1.6055 2.0664-1.6055 2.0664-4.6055 3.0664 1.4098-3.0385 3.0887-5.594 5.125-8.25 0.80824-1.0596 0.80824-1.0596 1.6328-2.1406 0.40992-0.53109 0.81984-1.0622 1.2422-1.6094z\" fill=\"#9E9F96\"/>\r\n        <path transform=\"translate(822,238)\" d=\"m0 0c1.5639 3.9738 0.36145 6.8138-0.9375 10.75-0.38027 1.1705-0.76055 2.3409-1.1523 3.5469-0.30035 0.89203-0.6007 1.7841-0.91016 2.7031h-1c-0.46904-6.0975 1.2914-11.583 4-17z\" fill=\"#909892\"/>\r\n        <path transform=\"translate(708,200)\" d=\"m0 0c-1 2-1 2-4.3125 3.1875-3.2631 0.71899-4.6803 1.0154-7.6875-0.1875h2v-2c6.2857-2.4286 6.2857-2.4286 10-1z\" fill=\"#272B26\"/>\r\n        <path transform=\"translate(279,856)\" d=\"m0 0 2 1c-4.75 3-4.75 3-7 3v2c-3.287 0.79953-4.7102 1.0966-8 0 2.1204-1.0303 4.2465-2.049 6.375-3.0625 1.1834-0.56848 2.3667-1.137 3.5859-1.7227 1.0029-0.4009 2.0058-0.8018 3.0391-1.2148z\" fill=\"#161929\"/>\r\n        <path transform=\"translate(198,719)\" d=\"m0 0-4 1v3l-5 2-2-3c1.2642-0.69965 2.5367-1.3843 3.8125-2.0625 0.7077-0.38285 1.4154-0.7657 2.1445-1.1602 2.043-0.77734 2.043-0.77734 5.043 0.22266z\" fill=\"#BF885E\"/>\r\n        <path transform=\"translate(477,341)\" d=\"m0 0 1 2c-2.6496 3.6309-5.0182 5.8985-9 8l-1-2c2.8528-2.932 5.6508-5.6432 9-8z\" fill=\"#C48B60\"/>\r\n        <path transform=\"translate(810,225)\" d=\"m0 0 5 2-3 2h2v2h-2v2h-2c-0.79953-3.287-1.0966-4.7102 0-8z\" fill=\"#7B827F\"/>\r\n        <path transform=\"translate(469,559)\" d=\"m0 0 2 3-5 5c-0.99-0.33-1.98-0.66-3-1 1.98-2.31 3.96-4.62 6-7z\" fill=\"#777E76\"/>\r\n        <path transform=\"translate(536,546)\" d=\"m0 0c4.6769 1.4769 4.6769 1.4769 6.3125 4.125 0.22688 0.61875 0.45375 1.2375 0.6875 1.875h-4c-3-4.1786-3-4.1786-3-6z\" fill=\"#6D7570\"/>\r\n        <path transform=\"translate(707,312)\" d=\"m0 0c1 2 1 2 0.375 4.8125-1.5563 3.6078-3.4684 5.5868-6.375 8.1875l-2-1c0.76312-0.86625 1.5262-1.7325 2.3125-2.625 2.4397-2.911 4.1175-5.9044 5.6875-9.375z\" fill=\"#6B726E\"/>\r\n        <path transform=\"translate(355,453)\" d=\"m0 0c6.7046 3.9562 6.7046 3.9562 7.9375 8.3125l0.0625 2.6875c-5.8021-5.6452-5.8021-5.6452-8-9v-2z\" fill=\"#DCA06D\"/>\r\n        <path transform=\"translate(625,277)\" d=\"m0 0c2.7296 2.3574 3.8889 4.5813 5 8v3h-2c-2.1531-3.8576-3.3925-6.5513-3-11z\" fill=\"#C1C0B1\"/>\r\n        <path transform=\"translate(798,225)\" d=\"m0 0 3 2v2l-4 2-2-5c0.99-0.33 1.98-0.66 3-1zm-5 3 3 2h-3v-2z\" fill=\"#7C8480\"/>\r\n        <path transform=\"translate(151,760)\" d=\"m0 0h1c0.125 5.75 0.125 5.75-1 8h-2l-1 6c-1.371-3.6904-0.60011-5.7088 0.9375-9.25 0.38027-0.89203 0.76055-1.7841 1.1523-2.7031 0.30035-0.67547 0.6007-1.3509 0.91016-2.0469z\" fill=\"#AD7B56\"/>\r\n        <path transform=\"translate(520,513)\" d=\"m0 0 1 2-2-1 1-1zm-5 5v3c-2.5 2.1875-2.5 2.1875-5 4l-2-1 7-6z\" fill=\"#676E6A\"/>\r\n        <path transform=\"translate(544,486)\" d=\"m0 0c0 3.7791-0.99704 4.4611-3.5 7.1875-0.64969 0.71543-1.2994 1.4309-1.9688 2.168-0.50531 0.5427-1.0106 1.0854-1.5312 1.6445l-2-1c1.1241-1.2924 2.2493-2.5839 3.375-3.875 0.62648-0.7193 1.253-1.4386 1.8984-2.1797 1.2008-1.353 2.4474-2.6661 3.7266-3.9453z\" fill=\"#646B67\"/>\r\n        <path transform=\"translate(773,326)\" d=\"m0 0c2.9719 1.1245 5.3344 2.2229 8 4l-1 3-1.75-1.4375c-2.1758-1.511-3.676-2.1029-6.25-2.5625l1-3z\" fill=\"#7B827E\"/>\r\n        <path transform=\"translate(511,296)\" d=\"m0 0 1 2c-2.3896 3.243-4.2048 5.509-8 7 1.555-3.8168 4.036-6.192 7-9z\" fill=\"#C68D61\"/>\r\n        <path transform=\"translate(582,222)\" d=\"m0 0c0 3.0522-0.32293 4.0453-1.75 6.625-0.32484 0.61102-0.64969 1.222-0.98438 1.8516-1.6012 1.9273-2.8354 2.1456-5.2656 2.5234 0.95545-1.4602 1.9145-2.9181 2.875-4.375 0.53367-0.81211 1.0673-1.6242 1.6172-2.4609 1.5078-2.1641 1.5078-2.1641 3.5078-4.1641z\" fill=\"#1B1C1F\"/>\r\n        <path transform=\"translate(325,864)\" d=\"m0 0 1 2-6 9-1-2 1-3h2l0.375-2.4375 0.625-2.5625 2-1z\" fill=\"#B67E57\"/>\r\n        <path transform=\"translate(168,863)\" d=\"m0 0 1.8125 1.5c2.1578 1.7828 2.1578 1.7828 5.1875 1.5l1 3-2 2c-1.006-0.95207-2.0046-1.9119-3-2.875-0.55688-0.53367-1.1138-1.0673-1.6875-1.6172-1.3125-1.5078-1.3125-1.5078-1.3125-3.5078z\" fill=\"#BD8259\"/>\r\n        <path transform=\"translate(328,855)\" d=\"m0 0h1c0.25 2.75 0.25 2.75 0 6-2 2.375-2 2.375-4 4l-1-2c0.77734-1.9453 0.77734-1.9453 1.9375-4.125 0.57041-1.0867 0.57041-1.0867 1.1523-2.1953 0.30035-0.5543 0.6007-1.1086 0.91016-1.6797z\" fill=\"#D79969\"/>\r\n        <path transform=\"translate(415,421)\" d=\"m0 0 1 4-6 5c0-4.3897 2.1281-5.7691 5-9z\" fill=\"#B5815A\"/>\r\n        <path transform=\"translate(633,390)\" d=\"m0 0c0 3 0 3-1.5312 4.8242-0.64969 0.61488-1.2994 1.2298-1.9688 1.8633-0.64969 0.62262-1.2994 1.2452-1.9688 1.8867-0.50531 0.47051-1.0106 0.94102-1.5312 1.4258 0-3 0-3 2-6v-2l1.9375-0.4375c2.038-0.37257 2.038-0.37257 3.0625-1.5625z\" fill=\"#9FA49B\"/>\r\n        <path transform=\"translate(500,309)\" d=\"m0 0 1 4-6 5c0-4.3897 2.1281-5.7691 5-9z\" fill=\"#B9835B\"/>\r\n        <path transform=\"translate(808,211)\" d=\"m0 0 1 2h2l1-2c0.99 1.65 1.98 3.3 3 5-1.3333 0.66667-2.6667 1.3333-4 2l-4-6 1-1z\" fill=\"#7D8480\"/>\r\n        <path transform=\"translate(518,686)\" d=\"m0 0c2.5 2.3125 2.5 2.3125 5 5v3l-7-6 2-2z\" fill=\"#252A23\"/>\r\n        <path transform=\"translate(488,567)\" d=\"m0 0c2.125 0.375 2.125 0.375 4 1v3h-2l-2 2-2-4 2-2z\" fill=\"#6A716C\"/>\r\n        <path transform=\"translate(507,550)\" d=\"m0 0h2v3h3l1 3-4 1c-2-5.875-2-5.875-2-7z\" fill=\"#6A726C\"/>\r\n        <path transform=\"translate(453,371)\" d=\"m0 0 1 4-7 5c1.5271-3.436 3.5993-6.1191 6-9z\" fill=\"#B38058\"/>\r\n        <path transform=\"translate(466,354)\" d=\"m0 0 1 4-5 4c0-3.9084 1.5057-5.1159 4-8z\" fill=\"#B8835B\"/>\r\n        <path transform=\"translate(696,312)\" d=\"m0 0 2 4-6 4c1.75-5.75 1.75-5.75 4-8z\" fill=\"#A3A79E\"/>\r\n        <path transform=\"translate(811,219)\" d=\"m0 0 2.875 1.0625c2.9956 1.2878 2.9956 1.2878 5.125-0.0625l-2 4-2-1-1 2-1-4h-2v-2z\" fill=\"#7C8480\"/>\r\n        <path transform=\"translate(220,854)\" d=\"M0 0 C1.46067199 0.45082469 2.91848032 0.91093537 4.375 1.375 C5.18710938 1.63023437 5.99921875 1.88546875 6.8359375 2.1484375 C9 3 9 3 11 5 C4.61764706 5.49095023 4.61764706 5.49095023 1.5625 3.0625 C0 1 0 1 0 0 Z \" fill=\"#CF9940\"/>\r\n        <path transform=\"translate(515,679)\" d=\"m0 0 5 1 1 4-3 2c-0.99-2.31-1.98-4.62-3-7z\" fill=\"#5B645B\"/>\r\n        <path transform=\"translate(463,430)\" d=\"m0 0c0 3.2818-0.47836 5.1089-2 8-2.125 0.8125-2.125 0.8125-4 1 1.5271-3.436 3.5993-6.1191 6-9z\" fill=\"#EFEFE7\"/>\r\n        <path transform=\"translate(506,303)\" d=\"m0 0c0 3 0 3-2.5 5.6875l-2.5 2.3125c0.3505-3.2421 0.56221-4.6153 3.0625-6.8125 0.63938-0.39188 1.2788-0.78375 1.9375-1.1875z\" fill=\"#D89B69\"/>\r\n        <path transform=\"translate(475,753)\" d=\"m0 0c2.3125 0.1875 2.3125 0.1875 5 1 1.8125 2.5625 1.8125 2.5625 3 5-3.3659-1.4425-5.5105-3.3326-8-6z\" fill=\"#B9835A\"/>\r\n        <path transform=\"translate(162,743)\" d=\"m0 0 1 2c-1.25 2.5625-1.25 2.5625-3 5-0.99 0.33-1.98 0.66-3 1 1.1858-3.375 2.2757-5.6472 5-8z\" fill=\"#B47F58\"/>\r\n        <path transform=\"translate(181,727)\" d=\"m0 0 1 2c-1.75 1.5625-1.75 1.5625-4 3-2.25-0.3125-2.25-0.3125-4-1 2.1742-2.5004 3.7305-3.4363 7-4z\" fill=\"#C99064\"/>\r\n        <path transform=\"translate(242,692)\" d=\"m0 0 1 3c-2.3125 2.5-2.3125 2.5-5 5h-3c2.31-2.64 4.62-5.28 7-8z\" fill=\"#AE7B55\"/>\r\n        <path transform=\"translate(370,499)\" d=\"m0 0c0 3 0 3-1.5 4.6875l-1.5 1.3125c-1.5-1.375-1.5-1.375-3-3v-2l1.875 0.625 2.125 0.375 2-2z\" fill=\"#E6BE85\"/>\r\n        <path transform=\"translate(272,467)\" d=\"m0 0 1 2c-0.93579 2.3598-1.9335 4.6963-3 7h-2c1.0588-3.4031 2.009-6.0135 4-9z\" fill=\"#B5805A\"/>\r\n        <path transform=\"translate(277,458)\" d=\"m0 0c1 2 1 2 0.25 5.0625l-1.25 2.9375c-0.99 0.33-1.98 0.66-3 1 1.0588-3.4031 2.009-6.0135 4-9z\" fill=\"#AF7C57\"/>\r\n        <path transform=\"translate(437,392)\" d=\"m0 0 1 4-6 4c1.3715-2.9541 2.9886-5.4401 5-8z\" fill=\"#B18159\"/>\r\n        <path transform=\"translate(553,310)\" d=\"m0 0 1 4-4 3-2-1 5-6z\" fill=\"#E8E7DD\"/>\r\n        <path transform=\"translate(526,274)\" d=\"m0 0 1 4-6 4c1.3715-2.9541 2.9886-5.4401 5-8z\" fill=\"#B37F57\"/>\r\n        <path transform=\"translate(565,222)\" d=\"m0 0c1.125 3.75 1.125 3.75 0 6-1.6436 0.72159-3.3105 1.3935-5 2 1.3715-2.9541 2.9886-5.4401 5-8z\" fill=\"#B98158\"/>\r\n        <path transform=\"translate(407,717)\" d=\"m0 0c0 3 0 3-1.3125 4.3867-1.5625 1.2044-3.125 2.4089-4.6875 3.6133l-1-3 2.375-1.375c2.662-1.5093 2.662-1.5093 4.625-3.625z\" fill=\"#11161B\"/>\r\n        <path transform=\"translate(477,362)\" d=\"m0 0 1 2c-0.93306 2.7144-1.6267 3.7804-4.125 5.25l-1.875 0.75c1.1858-3.375 2.2757-5.6472 5-8z\" fill=\"#191C1F\"/>\r\n        <path transform=\"translate(462,361)\" d=\"m0 0 1 2-5 5c0.3125-2.375 0.3125-2.375 1-5l3-2z\" fill=\"#D59868\"/>\r\n        <path transform=\"translate(531,290)\" d=\"m0 0 2 1c-1.0487 2.6219-1.6493 3.7937-4.125 5.25l-1.875 0.75c1.074-2.9152 1.7781-4.7781 4-7z\" fill=\"#202223\"/>\r\n        <path transform=\"translate(793,209)\" d=\"m0 0c0.99 0.33 1.98 0.66 3 1l-6 5-2-1 5-5z\" fill=\"#6A706E\"/>\r\n        <path transform=\"translate(465,748)\" d=\"m0 0c0.99 0.33 1.98 0.66 3 1v2c-0.99-0.33-1.98-0.66-3-1v-2z\" fill=\"#C78A5F\"/>\r\n        <path transform=\"translate(249,531)\" d=\"m0 0 2 4-2-1v-3z\" fill=\"#B8835C\"/>\r\n        <path transform=\"translate(370,472)\" d=\"m0 0 3 2h-3v-2z\" fill=\"#D7956A\"/>\r\n        <path transform=\"translate(162,859)\" d=\"m0 0 2 1-1 2-1-3z\" fill=\"#BC835A\"/>\r\n        <path transform=\"translate(146,829)\" d=\"m0 0h2l-1 3-1-3z\" fill=\"#BA815A\"/>\r\n        <path transform=\"translate(836,340)\" d=\"m0 0 1 4z\" fill=\"#C98C62\"/>\r\n        <path transform=\"translate(472,341)\" d=\"m0 0 2 1-2 2v-3z\" fill=\"#C2895F\"/>\r\n        <path transform=\"translate(277,903)\" d=\"m0 0c3 1 3 1 3 1z\" fill=\"#BF845A\"/>\r\n        <path transform=\"translate(228,903)\" d=\"m0 0c3 1 3 1 3 1z\" fill=\"#BE855B\"/>\r\n        <path transform=\"translate(555,648)\" d=\"m0 0c3 1 3 1 3 1z\" fill=\"#D29063\"/>\r\n        <path transform=\"translate(306,602)\" d=\"m0 0 2 2h-2v-2z\" fill=\"#CE8F63\"/>\r\n        <path transform=\"translate(884,182)\" d=\"m0 0 2 2h-2v-2z\" fill=\"#C48961\"/>\r\n        <path transform=\"translate(632,176)\" d=\"m0 0c3 1 3 1 3 1z\" fill=\"#CF8F62\"/>\r\n        <path transform=\"translate(672,163)\" d=\"m0 0c3 1 3 1 3 1z\" fill=\"#C78B60\"/>\r\n        <path transform=\"translate(834,114)\" d=\"m0 0c3 1 3 1 3 1z\" fill=\"#CA8B5F\"/>\r\n        <path transform=\"translate(224,902)\" d=\"m0 0 2 1z\" fill=\"#BC835B\"/>\r\n        <path transform=\"translate(491,766)\" d=\"m0 0 2 1z\" fill=\"#C2855B\"/>\r\n        <path transform=\"translate(432,725)\" d=\"m0 0 2 1z\" fill=\"#D09164\"/>\r\n        <path transform=\"translate(193,717)\" d=\"m0 0 2 1z\" fill=\"#C68B60\"/>\r\n        <path transform=\"translate(595,700)\" d=\"m0 0 2 1z\" fill=\"#BA805A\"/>\r\n        <path transform=\"translate(268,658)\" d=\"m0 0 2 1z\" fill=\"#C88B60\"/>\r\n        <path transform=\"translate(564,651)\" d=\"m0 0 2 1z\" fill=\"#D49266\"/>\r\n        <path transform=\"translate(304,601)\" d=\"m0 0 2 1z\" fill=\"#CC8D62\"/>\r\n        <path transform=\"translate(600,591)\" d=\"m0 0 2 1z\" fill=\"#CE8E61\"/>\r\n        <path transform=\"translate(604,588)\" d=\"m0 0 2 1z\" fill=\"#CD8D61\"/>\r\n        <path transform=\"translate(273,565)\" d=\"m0 0 2 1z\" fill=\"#CA8C63\"/>\r\n        <path transform=\"translate(779,438)\" d=\"m0 0 2 1z\" fill=\"#C58A60\"/>\r\n        <path transform=\"translate(496,304)\" d=\"m0 0 2 1z\" fill=\"#BE875E\"/>\r\n        <path transform=\"translate(867,239)\" d=\"m0 0 2 1z\" fill=\"#C88C64\"/>\r\n        <path transform=\"translate(626,178)\" d=\"m0 0 2 1z\" fill=\"#C88A5E\"/>\r\n        <path transform=\"translate(657,168)\" d=\"m0 0 2 1z\" fill=\"#CD8F65\"/>\r\n        <path transform=\"translate(709,152)\" d=\"m0 0 2 1z\" fill=\"#CB8A5E\"/>\r\n        <path transform=\"translate(776,131)\" d=\"m0 0 2 1z\" fill=\"#C7895F\"/>\r\n        </svg>\r\n\r\n        <h1 class=\"page-title\">Glotus Client</h1>\r\n        <p id=\"script-description\" class=\"page-description\"></p>\r\n    </div>\r\n\r\n    <svg\r\n        id=\"close-button\"\r\n        class=\"icon\"\r\n        xmlns=\"http://www.w3.org/2000/svg\"\r\n        viewBox=\"0 0 30 30\"\r\n    >\r\n        <path d=\"M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z\"/>\r\n    </svg>\r\n</header>\n\n                    <main>\n                        <div id=\"navbar-container\">\r\n    <button data-id=\"0\" class=\"open-menu active\">\r\n        <span>\r\n            <svg class=\"small-icon\" xmlns=\"http://www.w3.org/2000/svg\" width=\"512\" height=\"512\" viewBox=\"0 0 512 512\"><path fill=\"currentColor\" d=\"M240 6.1c9.1-8.2 22.9-8.2 32 0l232 208c9.9 8.8 10.7 24 1.8 33.9s-24 10.7-33.9 1.8l-8-7.2v205.3c0 35.3-28.7 64-64 64h-288c-35.3 0-64-28.7-64-64V242.6l-8 7.2c-9.9 8.8-25 8-33.9-1.8s-8-25 1.8-33.9zm16 50.1L96 199.7V448c0 8.8 7.2 16 16 16h48V360c0-39.8 32.2-72 72-72h48c39.8 0 72 32.2 72 72v104h48c8.8 0 16-7.2 16-16V199.7L256 56.3zM208 464h96V360c0-13.3-10.7-24-24-24h-48c-13.3 0-24 10.7-24 24z\"/></svg>\r\n            Home\r\n        </span>\r\n    </button>\r\n    <button data-id=\"1\" class=\"open-menu\">\r\n        <span>\r\n            <svg class=\"small-icon\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M6.21 13.29a.9.9 0 0 0-.33-.21a1 1 0 0 0-.76 0a.9.9 0 0 0-.54.54a1 1 0 1 0 1.84 0a1 1 0 0 0-.21-.33M13.5 11h1a1 1 0 0 0 0-2h-1a1 1 0 0 0 0 2m-4 0h1a1 1 0 0 0 0-2h-1a1 1 0 0 0 0 2m-3-2h-1a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2M20 5H4a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3m1 11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1Zm-6-3H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2m3.5-4h-1a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2m.71 4.29a1 1 0 0 0-.33-.21a1 1 0 0 0-.76 0a.9.9 0 0 0-.33.21a1 1 0 0 0-.21.33a1 1 0 1 0 1.92.38a.84.84 0 0 0-.08-.38a1 1 0 0 0-.21-.33\"/></svg>\r\n            Keybinds\r\n        </span>\r\n    </button>\r\n    <button data-id=\"2\" class=\"open-menu\">\r\n        <span>\r\n            <svg class=\"small-icon\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"m19.05 21.6l-2.925-2.9l-2.2 2.2l-.7-.7q-.575-.575-.575-1.425t.575-1.425l4.225-4.225q.575-.575 1.425-.575t1.425.575l.7.7l-2.2 2.2l2.9 2.925q.3.3.3.7t-.3.7l-1.25 1.25q-.3.3-.7.3t-.7-.3M22 5.9L10.65 17.25l.125.1q.575.575.575 1.425t-.575 1.425l-.7.7l-2.2-2.2l-2.925 2.9q-.3.3-.7.3t-.7-.3L2.3 20.35q-.3-.3-.3-.7t.3-.7l2.9-2.925l-2.2-2.2l.7-.7q.575-.575 1.425-.575t1.425.575l.1.125L18 1.9h4zM6.95 10.85L2 5.9v-4h4l4.95 4.95z\"/></svg>\r\n            Combat\r\n        </span>\r\n    </button>\r\n    <button data-id=\"3\" class=\"open-menu\">\r\n        <span>\r\n            <svg class=\"small-icon\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"M12 5c-6.307 0-9.367 5.683-9.91 6.808a.44.44 0 0 0 0 .384C2.632 13.317 5.692 19 12 19s9.367-5.683 9.91-6.808a.44.44 0 0 0 0-.384C21.368 10.683 18.308 5 12 5\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/></g></svg>\r\n            Visuals\r\n        </span>\r\n    </button>\r\n    <button data-id=\"4\" class=\"open-menu\">\r\n        <span>\r\n            <svg class=\"small-icon\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M2 18h7v2H2zm0-7h9v2H2zm0-7h20v2H2zm18.674 9.025l1.156-.391l1 1.732l-.916.805a4 4 0 0 1 0 1.658l.916.805l-1 1.732l-1.156-.391a4 4 0 0 1-1.435.83L19 21h-2l-.24-1.196a4 4 0 0 1-1.434-.83l-1.156.392l-1-1.732l.916-.805a4 4 0 0 1 0-1.658l-.916-.805l1-1.732l1.156.391c.41-.37.898-.655 1.435-.83L17 11h2l.24 1.196a4 4 0 0 1 1.434.83M18 17a1 1 0 1 0 0-2a1 1 0 0 0 0 2\"/></svg>\r\n            Misc\r\n        </span>\r\n    </button>\r\n    <button data-id=\"5\" class=\"open-menu\">\r\n        <span>\r\n            <svg class=\"small-icon\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M22 14h-1c0-3.87-3.13-7-7-7h-1V5.73A2 2 0 1 0 10 4c0 .74.4 1.39 1 1.73V7h-1c-3.87 0-7 3.13-7 7H2c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h1v1a2 2 0 0 0 2 2h14c1.11 0 2-.89 2-2v-1h1c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1m-1 3h-2v3H5v-3H3v-1h2v-2c0-2.76 2.24-5 5-5h4c2.76 0 5 2.24 5 5v2h2zm-3.5-1.5c0 1.11-.89 2-2 2c-.97 0-1.77-.69-1.96-1.6l2.96-2.12c.6.35 1 .98 1 1.72m-10-1.72l2.96 2.12c-.18.91-.99 1.6-1.96 1.6a2 2 0 0 1-2-2c0-.74.4-1.37 1-1.72\"/></svg>\r\n            Bots\r\n        </span>\r\n    </button>\r\n    <button data-id=\"6\" class=\"open-menu bottom-align\">\r\n        <span>\r\n            <svg class=\"small-icon\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"m19.546 7.573l-1.531-1.57l-1.442 1.291l-.959.86l3.876 3.987l-2.426 2.496l-1.451 1.492c.55.499 1.091.99 1.64 1.486l.764.694l2.21-2.277L24 12.14v-.001zM2.992 9.072L0 12.14c2.01 2.073 3.993 4.115 5.984 6.167l.51-.464l1.893-1.715L6.94 14.64l-2.43-2.5l3.109-3.196l.767-.789c-.434-.39-.86-.772-1.288-1.154L5.984 6v.001zm12.585-6.038L11.632 21.6l-.196-.039l-3.029-.595l2.555-12.02L12.353 2.4z\"/></svg>\r\n            Devtool\r\n        </span>\r\n    </button>\r\n</div>\n                        \n                        <div id=\"page-container\">\n                            <div class=\"menu-page opened\" data-id=\"0\">\r\n    <div class=\"page-title\">Home</div>\r\n\r\n    <div class=\"section\">\r\n        <div class=\"section-title\">Welcome to the Glotus Client!</div>\r\n        <div class=\"section-content\">\r\n\r\n            <div class=\"content-option text\">\r\n                <span class=\"text-value simplified\">My main goal in creating this hack was to automate absolutely everything. So don't be surprised by the lack of numerous hotkeys - not even for switching weapons. This client is designed for simple <span class=\"highlight\">WASD</span> movement and primarly <span class=\"highlight\">polearm + hammer</span>, which is what makes it great. There's no need to remember dozens of hotkeys, chat commands, or anything else.</span>\r\n            </div>\r\n\r\n            <div class=\"content-option text\">\r\n                <span class=\"text-value simplified\">It is still in development, so please, report about all issues. Let the client keep growing!</span>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <div class=\"section\">\r\n\r\n        <div class=\"section-content\">\r\n\r\n            <div class=\"content-option left-flex text\">\r\n                <span class=\"option-title\">Author: </span>\r\n                <span id=\"author\" class=\"text-value\">Murka</span>\r\n            </div>\r\n\r\n            <div class=\"content-option left-flex text\">\r\n                <a href=\"https://discord.gg/cPRFdcZkeD\" class=\"text-value\" target=\"_blank\">\r\n                    <svg class=\"icon link\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M19.303 5.337A17.3 17.3 0 0 0 14.963 4c-.191.329-.403.775-.552 1.125a16.6 16.6 0 0 0-4.808 0C9.454 4.775 9.23 4.329 9.05 4a17 17 0 0 0-4.342 1.337C1.961 9.391 1.218 13.35 1.59 17.255a17.7 17.7 0 0 0 5.318 2.664a13 13 0 0 0 1.136-1.836c-.627-.234-1.22-.52-1.794-.86c.149-.106.297-.223.435-.34c3.46 1.582 7.207 1.582 10.624 0c.149.117.287.234.435.34c-.573.34-1.167.626-1.793.86a13 13 0 0 0 1.135 1.836a17.6 17.6 0 0 0 5.318-2.664c.457-4.52-.722-8.448-3.1-11.918M8.52 14.846c-1.04 0-1.889-.945-1.889-2.101s.828-2.102 1.89-2.102c1.05 0 1.91.945 1.888 2.102c0 1.156-.838 2.1-1.889 2.1m6.974 0c-1.04 0-1.89-.945-1.89-2.101s.828-2.102 1.89-2.102c1.05 0 1.91.945 1.889 2.102c0 1.156-.828 2.1-1.89 2.1\"/>\r\n                    </svg>\r\n                </a>\r\n\r\n                <a href=\"https://github.com/Murka007/Glotus-Client\" class=\"text-value\" target=\"_blank\">\r\n                    <svg class=\"icon link\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2\"/></svg>\r\n                </a>\r\n\r\n                <a href=\"https://greasyfork.org/en/users/919633-murka007\" class=\"text-value\" target=\"_blank\">\r\n                    <svg class=\"icon link\" version=\"1.1\" viewBox=\"0 0 96 96\" xmlns=\"http://www.w3.org/2000/svg\">\r\n                    <circle cx=\"48\" cy=\"48\" r=\"48\"/>\r\n                    <clipPath id=\"a\">\r\n                    <circle cx=\"48\" cy=\"48\" r=\"47\"/>\r\n                    </clipPath>\r\n                    <text clip-path=\"url(#a)\" fill=\"#fff\" font-family=\"'DejaVu Sans', Verdana, Arial, 'Liberation Sans', sans-serif\" font-size=\"18\" letter-spacing=\"-.75\" pointer-events=\"none\" text-anchor=\"middle\" style=\"-moz-user-select:none;-ms-user-select:none;-webkit-user-select:none;user-select:none\"><tspan x=\"51\" y=\"13\" textLength=\"57\">= null;</tspan> <tspan x=\"56\" y=\"35\" textLength=\"98\">function init</tspan> <tspan x=\"49\" y=\"57\" textLength=\"113\">for (const i = 0;</tspan> <tspan x=\"50\" y=\"79\" textLength=\"105\">XmlHttpReq</tspan> <tspan x=\"48\" y=\"101\" textLength=\"80\">appendCh</tspan></text>\r\n                    <path d=\"m44 29a6.364 6.364 0 0 1 0 9l36 36a3.25 3.25 0 0 1-6.5 6.5l-36-36a6.364 6.364 0 0 1-9 0l-19-19a1.7678 1.7678 0 0 1 0-2.5l13-13a1.7678 1.7678 0 0 1 2.5 0z\" stroke=\"#000\" stroke-width=\"4\"/>\r\n                    <path d=\"m44 29a6.364 6.364 0 0 1 0 9l36 36a3.25 3.25 0 0 1-6.5 6.5l-36-36a6.364 6.364 0 0 1-9 0l-19-19a1.7678 1.7678 0 0 1 2.5-2.5l14 14 4-4-14-14a1.7678 1.7678 0 0 1 2.5-2.5l14 14 4-4-14-14a1.7678 1.7678 0 0 1 2.5-2.5z\" fill=\"#fff\"/>\r\n                    </svg>\r\n                </a>\r\n\r\n            </div>\r\n\r\n            <div class=\"content-option left-flex text\">\r\n                <span class=\"option-title\">Building hash: </span>\r\n                <span id=\"author\" class=\"text-value\">rw7D3J5249V1GK8</span>\r\n            </div>\r\n\r\n        </div>\r\n    </div>\r\n\r\n</div>\n                            <div class=\"menu-page\" data-id=\"1\">\r\n    <div class=\"page-title\">Keybinds</div>\r\n    <p class=\"page-description\">Setup keybinds for items, weapons and hats</p>\r\n\r\n    <!-- Items & Weapons -->\r\n    <div class=\"section\">\r\n        <div class=\"section-title\">Items & Weapons</div>\r\n        <div class=\"section-content split\">\r\n\r\n            <div class=\"content-split\">\r\n                <div class=\"content-option\">\r\n                    <span class=\"option-title\">Food</span>\r\n                    <button id=\"_food\" class=\"hotkeyInput\"></button>\r\n                </div>\r\n\r\n                <div class=\"content-option\">\r\n                    <span class=\"option-title\">Wall</span>\r\n                    <button id=\"_wall\" class=\"hotkeyInput\"></button>\r\n                </div>\r\n\r\n                <div class=\"content-option\">\r\n                    <span class=\"option-title\">Spike</span>\r\n                    <button id=\"_spike\" class=\"hotkeyInput\"></button>\r\n                </div>\r\n\r\n                <div class=\"content-option\">\r\n                    <span class=\"option-title\">Windmill</span>\r\n                    <button id=\"_windmill\" class=\"hotkeyInput\"></button>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"content-split\">\r\n                <div class=\"content-option\">\r\n                    <span class=\"option-title\">Farm</span>\r\n                    <button id=\"_farm\" class=\"hotkeyInput\"></button>\r\n                </div>\r\n\r\n                <div class=\"content-option\">\r\n                    <span class=\"option-title\">Trap</span>\r\n                    <button id=\"_trap\" class=\"hotkeyInput\"></button>\r\n                </div>\r\n\r\n                <div class=\"content-option\">\r\n                    <span class=\"option-title\">Turret</span>\r\n                    <button id=\"_turret\" class=\"hotkeyInput\"></button>\r\n                </div>\r\n\r\n                <div class=\"content-option\">\r\n                    <span class=\"option-title\">Spawn</span>\r\n                    <button id=\"_spawn\" class=\"hotkeyInput\"></button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <!-- Controls & Movement -->\r\n    <div class=\"section\">\r\n        <div class=\"section-title\">Controls & Movement</div>\r\n        <div class=\"section-content\">\r\n\r\n            <div class=\"content-split\">\r\n\r\n                <div class=\"content-option\">\r\n                    <span class=\"option-title\">Lock bot position</span>\r\n                    <button id=\"_lockBotPosition\" class=\"hotkeyInput\"></button>\r\n                </div>\r\n\r\n                <div class=\"content-option\">\r\n                    <span class=\"option-title\">Toggle Shop</span>\r\n                    <button id=\"_toggleShop\" class=\"hotkeyInput\"></button>\r\n                </div>\r\n\r\n                <div class=\"content-option\">\r\n                    <span class=\"option-title\">Toggle Clan</span>\r\n                    <button id=\"_toggleClan\" class=\"hotkeyInput\"></button>\r\n                </div>\r\n\r\n                <div class=\"content-option\">\r\n                    <span class=\"option-title\">Toggle Menu</span>\r\n                    <button id=\"_toggleMenu\" class=\"hotkeyInput\"></button>\r\n                </div>\r\n\r\n                <div class=\"content-option\">\r\n                    <span class=\"option-title\">Instakill</span>\r\n                    <button id=\"_instakill\" class=\"hotkeyInput\"></button>\r\n                </div>\r\n\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\n                            <div class=\"menu-page\" data-id=\"2\">\r\n    <div class=\"page-title\">Combat</div>\r\n    <p class=\"page-description\">Modify combat settings, change pvp behavior</p>\r\n\r\n    <!-- Defense -->\r\n    <div class=\"section\">\r\n        <div class=\"section-title\">Defense</div>\r\n        <div class=\"section-content\">\r\n\r\n            <!-- <div class=\"content-option\">\r\n                <span class=\"option-title\">Biome hats</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_biomehats\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n            </div> -->\r\n\r\n            <!-- <div class=\"content-option\">\r\n                <span class=\"option-title\">Auto emp</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_autoemp\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n            </div> -->\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Rage mode</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_rageMode\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n                <span class=\"option-description\">Disables all defensive features, focusing on offense. You may die quicker, but kill faster!</span>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Anti enemy</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_antienemy\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n                <span class=\"option-description\">Basic soldier equipment for all types of antis</span>\r\n            </div>\r\n\r\n            <!-- <div class=\"content-option\">\r\n                <span class=\"option-title\">Soldier default</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_soldierDefault\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n\r\n                <span class=\"option-description\">Equips soldier by default, when antis fail to do its work</span>\r\n            </div> -->\r\n\r\n            <!-- <div class=\"content-option\">\r\n                <span class=\"option-title\">Anti animal</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_antianimal\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n                <span class=\"option-description\">Equips a soldier when danger animal is nearby</span>\r\n            </div> -->\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Anti spike</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_antispike\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n                <span class=\"option-description\">Adds additional layer of protection against spikes</span>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Emp Defense</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_empDefense\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n                <span class=\"option-description\">Equips emp by default when you are not moving</span>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Autoheal</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_autoheal\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n            </div>\r\n            \r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Autobreak</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_autobreak\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n                <span class=\"option-description\">Destroys nearby enemy traps and spikes</span>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Safe walk</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_safeWalk\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n                <span class=\"option-description\">Prevents from colliding enemy spikes, cactuses, boostpads</span>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <!-- Placement -->\r\n     <div class=\"section\">\r\n        <div class=\"section-title\">Placement</div>\r\n\r\n        <div class=\"section-content\">\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Autoplacer</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_autoplacer\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n                <span class=\"option-description\">Automatically places traps and spikes when enemy is nearby</span>\r\n            </div>\r\n\r\n            <!-- <div class=\"content-option\">\r\n                <span class=\"option-title\">Preplacer</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_preplacer\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n            </div> -->\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Autoplacer radius</span>\r\n                <label class=\"slider\">\r\n                    <span class=\"slider-value\"></span>\r\n                    <input id=\"_autoplacerRadius\" type=\"range\" step=\"25\" min=\"100\" max=\"450\">\r\n                </label>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Placement accuracy</span>\r\n                <label class=\"slider\">\r\n                    <span class=\"slider-value\"></span>\r\n                    <input id=\"_placeAttempts\" type=\"range\" min=\"1\" max=\"10\">\r\n                </label>\r\n                <span class=\"option-description\">Algorithm calculates all the possible attempts. But later this value decreases in order to avoid lags.</span>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Automill</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_automill\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n                <span class=\"option-description\">Automatically places 3x windmills behind your back</span>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Auto grind</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_autoGrind\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n                <span class=\"option-description\">Stay still to get autogrind working</span>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Placement Defense</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_placementDefense\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n                <span class=\"option-description\">Places a wall/windmill on projectile threats</span>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    \r\n    <!-- Instakills -->\r\n    <div class=\"section\">\r\n        <div class=\"section-title\">Instakills</div>\r\n\r\n        <div class=\"section-content\">\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Auto sync</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_autoSync\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n                <span class=\"option-description\">Attacks when it is possible to sync enemy with 2 primary weapons</span>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Velocity tick</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_velocityTick\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n                <span class=\"option-description\">Attacks using turret + diamond polearm in one tick</span>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Spike tick</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_spikeTick\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n                <span class=\"option-description\">When enemy is about to collide a spike, attacks with primary weapon</span>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Spike sync</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_spikeSync\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Spike sync hammer</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_spikeSyncHammer\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Knockback tick</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_knockbackTick\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n                <span class=\"option-description\">Attacks enemy when its possible to knockback on spike</span>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Knockback tick hammer</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_knockbackTickHammer\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n                <span class=\"option-description\">Knockbacks enemy using hammer + turret + primary weapon on spike</span>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Knockback tick trap</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_knockbackTickTrap\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n                <span class=\"option-description\">Destroys a trap and knockbacks enemy on spike</span>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Anti Retrap</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_antiRetrap\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n                <span class=\"option-description\">When you are trapped, attacks enemy with primary weapon to push it away</span>\r\n            </div>\r\n\r\n            <!-- <div class=\"content-option\">\r\n                <span class=\"option-title\">Tool Spear Insta</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_toolSpearInsta\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n            </div> -->\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Autosteal</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_autoSteal\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n                <span class=\"option-description\">Steals kills/animals from other players</span>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Autopush</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_autoPush\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Turret steal</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_turretSteal\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n                <span class=\"option-description\">Equips a turret hat if possible to kill with it</span>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Spike Gear Insta</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_spikeGearInsta\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Turret Sync</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_turretSync\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n                <span class=\"option-description\">Attacks using primary in sync with other turret objects</span>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n</div>\n                            <div class=\"menu-page\" data-id=\"3\">\r\n    <div class=\"page-title\">Visuals</div>\r\n    <p class=\"page-description\">Customize your visuals, or you can disable it for performance</p>\r\n\r\n    <!-- Tracers -->\r\n    <div class=\"section\">\r\n        <div class=\"section-title\">Tracers</div>\r\n        <div class=\"section-content\">\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Enemies</span>\r\n                <div class=\"option-content\">\r\n                    <button class=\"reset-color\" title=\"Reset Color\"></button>\r\n                    <input id=\"_enemyTracersColor\" type=\"color\" title=\"Select Color\">\r\n                    <label class=\"switch-checkbox\">\r\n                        <input id=\"_enemyTracers\" type=\"checkbox\"></input>\r\n                        <span></span>\r\n                    </label>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                    <span class=\"option-title\">Teammates</span>\r\n                    <div class=\"option-content\">\r\n                        <button class=\"reset-color\" title=\"Reset Color\"></button>\r\n                        <input id=\"_teammateTracersColor\" type=\"color\" title=\"Select Color\">\r\n                        <label class=\"switch-checkbox\">\r\n                            <input id=\"_teammateTracers\" type=\"checkbox\"></input>\r\n                            <span></span>\r\n                        </label>\r\n                    </div>\r\n                </div>\r\n\r\n                <div class=\"content-option\">\r\n                    <span class=\"option-title\">Animal</span>\r\n                    <div class=\"option-content\">\r\n                        <button class=\"reset-color\" title=\"Reset Color\"></button>\r\n                        <input id=\"_animalTracersColor\" type=\"color\" title=\"Select Color\">\r\n                        <label class=\"switch-checkbox\">\r\n                            <input id=\"_animalTracers\" type=\"checkbox\"></input>\r\n                            <span></span>\r\n                        </label>\r\n                    </div>\r\n                </div>\r\n\r\n                <div class=\"content-option\">\r\n                    <span class=\"option-title\">Notification</span>\r\n                    <div class=\"option-content\">\r\n                        <button class=\"reset-color\" title=\"Reset Color\"></button>\r\n                        <input id=\"_notificationTracersColor\" type=\"color\" title=\"Select Color\">\r\n                        <label class=\"switch-checkbox\">\r\n                            <input id=\"_notificationTracers\" type=\"checkbox\"></input>\r\n                            <span></span>\r\n                        </label>\r\n                    </div>\r\n                </div>\r\n\r\n        </div>\r\n    </div>\r\n\r\n    <!-- Markers -->\r\n    <div class=\"section\">\r\n        <div class=\"section-title\">Markers</div>\r\n\r\n        <div class=\"section-content\">\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Item Markers</span>\r\n                <div class=\"option-content\">\r\n                    <button class=\"reset-color\" title=\"Reset Color\"></button>\r\n                    <input id=\"_itemMarkersColor\" type=\"color\" title=\"Select Color\">\r\n                    <label class=\"switch-checkbox\">\r\n                        <input id=\"_itemMarkers\" type=\"checkbox\"></input>\r\n                        <span></span>\r\n                    </label>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Teammates</span>\r\n                <div class=\"option-content\">\r\n                    <button class=\"reset-color\" title=\"Reset Color\"></button>\r\n                    <input id=\"_teammateMarkersColor\" type=\"color\" title=\"Select Color\">\r\n                    <label class=\"switch-checkbox\">\r\n                        <input id=\"_teammateMarkers\" type=\"checkbox\"></input>\r\n                        <span></span>\r\n                    </label>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Enemies</span>\r\n                <div class=\"option-content\">\r\n                    <button class=\"reset-color\" title=\"Reset Color\"></button>\r\n                    <input id=\"_enemyMarkersColor\" type=\"color\" title=\"Select Color\">\r\n                    <label class=\"switch-checkbox\">\r\n                        <input id=\"_enemyMarkers\" type=\"checkbox\"></input>\r\n                        <span></span>\r\n                    </label>\r\n                </div>\r\n            </div>\r\n                \r\n        </div>\r\n    </div>\r\n\r\n    <!-- Player -->\r\n    <div class=\"section\">\r\n        <div class=\"section-title\">Player</div>\r\n\r\n        <div class=\"section-content\">\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Weapon XP Bar</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_weaponXPBar\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Turret Reload Bar</span>\r\n                <div class=\"option-content\">\r\n                    <button class=\"reset-color\" title=\"Reset Color\"></button>\r\n                    <input id=\"_playerTurretReloadBarColor\" type=\"color\" title=\"Select Color\">\r\n                    <label class=\"switch-checkbox\">\r\n                        <input id=\"_playerTurretReloadBar\" type=\"checkbox\"></input>\r\n                        <span></span>\r\n                    </label>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Weapon Reload Bar</span>\r\n                <div class=\"option-content\">\r\n                    <button class=\"reset-color\" title=\"Reset Color\"></button>\r\n                    <input id=\"_weaponReloadBarColor\" type=\"color\" title=\"Select Color\">\r\n                    <label class=\"switch-checkbox\">\r\n                        <input id=\"_weaponReloadBar\" type=\"checkbox\"></input>\r\n                        <span></span>\r\n                    </label>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Render HP</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_renderHP\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n            </div>\r\n\r\n            <!-- <div class=\"content-option\">\r\n                <span class=\"option-title\">Stacked Damage</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_stackedDamage\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n            </div> -->\r\n        </div>\r\n    </div>\r\n\r\n    <!-- Object -->\r\n    <div class=\"section\">\r\n        <div class=\"section-title\">Object</div>\r\n\r\n        <div class=\"section-content\">\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Turret Reload Bar</span>\r\n                <div class=\"option-content\">\r\n                    <button class=\"reset-color\" title=\"Reset Color\"></button>\r\n                    <input id=\"_objectTurretReloadBarColor\" type=\"color\" title=\"Select Color\">\r\n                    <label class=\"switch-checkbox\">\r\n                        <input id=\"_objectTurretReloadBar\" type=\"checkbox\"></input>\r\n                        <span></span>\r\n                    </label>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Item Health Bar</span>\r\n                <div class=\"option-content\">\r\n                    <button class=\"reset-color\" title=\"Reset Color\"></button>\r\n                    <input id=\"_itemHealthBarColor\" type=\"color\" title=\"Select Color\">\r\n                    <label class=\"switch-checkbox\">\r\n                        <input id=\"_itemHealthBar\" type=\"checkbox\"></input>\r\n                        <span></span>\r\n                    </label>\r\n                </div>\r\n            </div>\r\n\r\n        </div>\r\n    </div>\r\n\r\n</div>\n                            <div class=\"menu-page\" data-id=\"4\">\r\n    <div class=\"page-title\">Misc</div>\r\n    <p class=\"page-description\">Customize misc settings, add autochat messages, reset settings</p>\r\n\r\n    <!-- Other -->\r\n    <div class=\"section\">\r\n        <h2 class=\"section-title\">Other</h2>\r\n\r\n        <div class=\"section-content\">\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Kill Message</span>\r\n                <div class=\"option-content\">\r\n                    <input id=\"_killMessageText\" class=\"input\" type=\"text\" maxlength=\"30\">\r\n                    <label class=\"switch-checkbox\">\r\n                        <input id=\"_killMessage\" type=\"checkbox\">\r\n                        <span></span>\r\n                    </label>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Autospawn</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_autospawn\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Autoaccept</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_autoaccept\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Texture pack</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_texturepack\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n                <span class=\"option-description\">Some old looking texture pack. Reload the page to make it work! :)</span>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Hide game HUD</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_hideHUD\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n            </div>\r\n\r\n        </div>\r\n    </div>\r\n\r\n\r\n    <!-- Menu -->\r\n    <!-- <div class=\"section\">\r\n        <h2 class=\"section-title\">Menu</h2>\r\n\r\n        <div class=\"section-content\">\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Transparency</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_menuTransparency\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n            </div>\r\n\r\n        </div>\r\n    </div> -->\r\n\r\n</div>\n                            <div class=\"menu-page\" data-id=\"6\">\r\n    <div class=\"page-title\">Devtool</div>\r\n    <p class=\"page-description\">Test Glotus Client and report about bugs!</p>\r\n\r\n\r\n    <!-- myPlayer -->\r\n    <div class=\"section\">\r\n        <h2 class=\"section-title\">myPlayer</h2>\r\n\r\n        <div class=\"section-content\">\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Display player angle</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_displayPlayerAngle\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n            </div>\r\n\r\n        </div>\r\n    </div>\r\n\r\n\r\n    <!-- Hitboxes -->\r\n    <div class=\"section\">\r\n        <h2 class=\"section-title\">Hitboxes</h2>\r\n\r\n        <div class=\"section-content\">\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Weapon hitbox</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_weaponHitbox\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Collision hitbox</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_collisionHitbox\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Placement hitbox</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_placementHitbox\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Possible placement</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_possiblePlacement\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n            </div>\r\n        \r\n        </div>\r\n    </div>\r\n\r\n    <!-- Statistics -->\r\n    <div class=\"section\">\r\n        <h2 class=\"section-title\">Statistics</h2>\r\n\r\n        <div class=\"section-content small-section\">\r\n\r\n            <div class=\"content-option left-flex text\">\r\n                <span class=\"option-title\">Total kills: </span>\r\n                <span id=\"_totalKills\" class=\"text-value\">0</span>\r\n            </div>\r\n\r\n            <div class=\"content-option left-flex text\">\r\n                <span class=\"option-title\">Global kills with bots: </span>\r\n                <span id=\"_globalKills\" class=\"text-value\">0</span>\r\n            </div>\r\n\r\n            <div class=\"content-option left-flex text\">\r\n                <span class=\"option-title\">Deaths: </span>\r\n                <span id=\"_deaths\" class=\"text-value\">0</span>\r\n            </div>\r\n\r\n            <div class=\"content-option left-flex text\">\r\n                <span class=\"option-title\">Autosync: </span>\r\n                <span id=\"_autoSyncTimes\" class=\"text-value\">0</span>\r\n            </div>\r\n\r\n            <div class=\"content-option left-flex text\">\r\n                <span class=\"option-title\">Velocity tick: </span>\r\n                <span id=\"_velocityTickTimes\" class=\"text-value\">0</span>\r\n            </div>\r\n\r\n            <div class=\"content-option left-flex text\">\r\n                <span class=\"option-title\">SSHammer: </span>\r\n                <span id=\"_spikeSyncHammerTimes\" class=\"text-value\">0</span>\r\n            </div>\r\n\r\n            <div class=\"content-option left-flex text\">\r\n                <span class=\"option-title\">Spike sync: </span>\r\n                <span id=\"_spikeSyncTimes\" class=\"text-value\">0</span>\r\n            </div>\r\n\r\n            <div class=\"content-option left-flex text\">\r\n                <span class=\"option-title\">Spike tick: </span>\r\n                <span id=\"_spikeTickTimes\" class=\"text-value\">0</span>\r\n            </div>\r\n\r\n            <div class=\"content-option left-flex text\">\r\n                <span class=\"option-title\">KBTrap: </span>\r\n                <span id=\"_knockbackTickTrapTimes\" class=\"text-value\">0</span>\r\n            </div>\r\n\r\n            <div class=\"content-option left-flex text\">\r\n                <span class=\"option-title\">KBHammer: </span>\r\n                <span id=\"_knockbackTickHammerTimes\" class=\"text-value\">0</span>\r\n            </div>\r\n\r\n            <div class=\"content-option left-flex text\">\r\n                <span class=\"option-title\">KB Reg: </span>\r\n                <span id=\"_knockbackTickTimes\" class=\"text-value\">0</span>\r\n            </div>\r\n\r\n        </div>\r\n    </div>\r\n\r\n</div>\n                            <div class=\"menu-page\" data-id=\"5\">\r\n    <div class=\"page-title\">Bots</div>\r\n    <p class=\"page-description\">Create bots, control them and dominate the entire server</p>\r\n\r\n    <!-- Controller -->\r\n    <div class=\"section\">\r\n        <div class=\"section-title\">Controller</div>\r\n\r\n        <div class=\"section-content\">\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Follow cursor</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_followCursor\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n                <span class=\"option-description\">Bots are going to follow your cursor instead of character</span>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Stop movement radius</span>\r\n                <label class=\"slider\">\r\n                    <span class=\"slider-value\"></span>\r\n                    <input id=\"_movementRadius\" type=\"range\" step=\"25\" min=\"25\" max=\"250\">\r\n                </label>\r\n                <span class=\"option-description\">Bots will stop movement at this radius</span>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Circle formation</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_circleFormation\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n                <span class=\"option-description\">Bots will form a circle around you</span>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Circle rotation</span>\r\n                <label class=\"switch-checkbox\">\r\n                    <input id=\"_circleRotation\" type=\"checkbox\"></input>\r\n                    <span></span>\r\n                </label>\r\n                <span class=\"option-description\">Bots will move in a circular way around you</span>\r\n            </div>\r\n\r\n            <div class=\"content-option\">\r\n                <span class=\"option-title\">Circle radius</span>\r\n                <label class=\"slider\">\r\n                    <span class=\"slider-value\"></span>\r\n                    <input id=\"_circleRadius\" type=\"range\" step=\"25\" min=\"50\" max=\"600\">\r\n                </label>\r\n            </div>\r\n        </div>\r\n\r\n        <div id=\"bot-container\" class=\"section-content\"></div>\r\n\r\n        <div class=\"content-option centered\">\r\n            <button id=\"add-bot\" class=\"option-button\">Add Bot</button>\r\n        </div>\r\n    </div>\r\n\r\n</div>\n                        </div>\n                    </main>\n                </div>\n            </div>\n        ";
    }
    Oh() {
      const t = getGlobal("q5RfA7D").createElement("style");
      __p_vU9y_ast(t.innerHTML = "#iframe-container {\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    bottom: 0;\r\n    right: 0;\r\n    width: 100%;\r\n    height: 100%;\r\n    border: none;\r\n    outline: none;\r\n    z-index: 10;\r\n}\r\n\r\n#promoImgHolder,\r\n.menuHeader,\r\n.menuText,\r\n#guideCard,\r\n#altServer,\r\n#gameName,\r\n#pingDisplay,\r\n#partyButton,\r\n#onetrust-consent-sdk,\r\n.adMenuCard,\r\n#topInfoHolder > div:not([id]):not([class]),\r\n#touch-controls-fullscreen,\r\n#joinPartyButton {\r\n    display: none!important;\r\n}\r\n\r\n.menuCard {\r\n    box-shadow: none;\r\n}\r\n\r\n#setupCard {\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 12px;\r\n    background: #6d6d6d77;\r\n    max-height: auto;\r\n    width: 280px;\r\n}\r\n\r\n#setupCard > * {\r\n    margin: 0!important;\r\n}\r\n\r\n#linksContainer2 {\r\n    background: #6d6d6d77;\r\n}\r\n\r\n#bottomContainer {\r\n    bottom: 20px;\r\n}\r\n\r\n#topInfoHolder {\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: right;\r\n    align-items: flex-end;\r\n    gap: 10px;\r\n}\r\n\r\n#killCounter, #totalKillCounter {\r\n    position: static;\r\n    margin: 0;\r\n    background-image: url(../img/icons/skull.png);\r\n}\r\n\r\n.actionBarItem {\r\n    position: relative;\r\n}\r\n\r\n.itemCounter {\r\n    position: absolute;\r\n    top: 3px;\r\n    right: 3px;\r\n    font-size: 0.95em;\r\n    color: white;\r\n    text-shadow: #3d3f42 2px 0px 0px, #3d3f42 1.75517px 0.958851px 0px, #3d3f42 1.0806px 1.68294px 0px, #3d3f42 0.141474px 1.99499px 0px, #3d3f42 -0.832294px 1.81859px 0px, #3d3f42 -1.60229px 1.19694px 0px, #3d3f42 -1.97998px 0.28224px 0px, #3d3f42 -1.87291px -0.701566px 0px, #3d3f42 -1.30729px -1.5136px 0px, #3d3f42 -0.421592px -1.95506px 0px, #3d3f42 0.567324px -1.91785px 0px, #3d3f42 1.41734px -1.41108px 0px, #3d3f42 1.92034px -0.558831px 0px;\r\n}\r\n\r\n.itemCounter.hidden {\r\n    display: none;\r\n}\r\n\r\n#glotusStats {\r\n    position: absolute;\r\n    color: rgb(221, 221, 221);\r\n    font: 13px \"Hammersmith One\";\r\n    bottom: 210px;\r\n    left: 20px;\r\n\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 5px;\r\n}\r\n\r\n.hidden {\r\n    display: none!important;\r\n}#storeContainer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 10px;\r\n    max-width: 400px;\r\n    width: 100%;\r\n\r\n    position: absolute;\r\n    top: 50%;\r\n    left: 50%;\r\n    transform: translate(-50%, -50%) scale(0.9);\r\n}\r\n\r\n#toggleStoreType {\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n    padding: 10px;\r\n    background-color: rgba(0, 0, 0, 0.15);\r\n    color: #fff;\r\n    border-radius: 4px;\r\n    cursor: pointer;\r\n    font-size: 20px;\r\n    pointer-events: all;\r\n}\r\n\r\n#itemHolder {\r\n    background-color: rgba(0, 0, 0, 0.15);\r\n    max-height: 200px;\r\n    height: 100%;\r\n    padding: 10px;\r\n    overflow-y: scroll;\r\n    border-radius: 4px;\r\n    pointer-events: all;\r\n    scrollbar-width: none;\r\n}\r\n\r\n#itemHolder::-webkit-scrollbar {\r\n    display: none;\r\n    width: 0;\r\n    height: 0;\r\n    background: transparent;\r\n}\r\n\r\n.storeItemContainer {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 10px;\r\n    padding: 5px;\r\n    height: 50px;\r\n    box-sizing: border-box;\r\n    overflow: hidden;\r\n}\r\n\r\n.storeHat {\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n    width: 45px;\r\n    height: 45px;\r\n    margin-top: -5px;\r\n    pointer-events: none;\r\n}\r\n\r\n.storeItemName {\r\n    color: #fff;\r\n    font-size: 20px;\r\n}\r\n\r\n.equipButton {\r\n    margin-left: auto;\r\n    color: #80eefc;\r\n    cursor: pointer;\r\n    font-size: 35px;\r\n}", getGlobal("q5RfA7D").head.appendChild(t));
    }
    Lh() {
      this.Oh();
      const t = getGlobal("q5RfA7D").createElement("iframe");
      const n = new (getGlobal("jbXGR1"))([this.Bh()], {
        type: "text/html; charset=utf-8"
      });
      t.src = getGlobal("UM9gcT").createObjectURL(n);
      t.id = "iframe-container";
      t.style.display = "none";
      getGlobal("q5RfA7D").body.appendChild(t);
      return new (getGlobal("tSAIqe"))(n => {
        t.onload = () => {
          const e = t.contentWindow;
          const s = e.document;
          __p_vU9y_ast(getGlobal("UM9gcT").revokeObjectURL(t.src), n({
            target: t,
            window: e,
            document: s
          }));
        };
      });
    }
    querySelector(t) {
      return this.frame.document.querySelector(t);
    }
    querySelectorAll(t) {
      return this.frame.document.querySelectorAll(t);
    }
    vs() {
      const t = this;
      return {
        _h: this.querySelector("#menu-container"),
        Kh: this.querySelector("#menu-wrapper"),
        Xh: this.querySelector("#page-container"),
        Vh: this.querySelectorAll(".hotkeyInput[id]"),
        Ah: this.querySelectorAll("input[type='checkbox'][id]"),
        Wh: this.querySelectorAll("input[type='color'][id]"),
        Zh: this.querySelectorAll("input[type='text'][id]"),
        Fh: this.querySelectorAll("input[type='range'][id]"),
        Yh: this.querySelector("#close-button"),
        Jh: this.querySelectorAll(".open-menu[data-id]"),
        Uh: this.querySelectorAll(".menu-page[data-id]"),
        buttons: this.querySelectorAll(".option-button[id]"),
        Qh: this.querySelector("#bot-container"),
        $h: this.querySelector("#connectingBot"),
        qh: this.querySelector("#script-description"),
        tp: this.querySelector("#author"),
        np: this.querySelectorAll(".option-description"),
        ep: this.querySelector("#add-bot"),
        sp(n) {
          const e = t.querySelector(".content-option[data-bot-id=\"" + n + "\"]");
          const s = e.querySelector(".option-title");
          const i = e.querySelector(".disconnect-button");
          return {
            ip: e,
            title: s,
            disconnect: i
          };
        }
      };
    }
    rp(t, n) {
      const e = this.querySelector("#" + t);
      if (e == null) {
        throw getGlobal("EjdYry")("updateStats Error: can't find an element with ID: '" + t + "'");
      }
      __p_vU9y_ast(e.textContent = n, t in H && (H[t] = n, j()));
    }
    ap() {
      const {
        _h: t
      } = this.vs();
      const n = getGlobal("P4jKmO").min(0.9, getGlobal("P4jKmO").min(getGlobal("yaVoVt").innerWidth / 1280, getGlobal("yaVoVt").innerHeight / 720));
      __p_vU9y_ast(this.Eh = n, t.style.transform = "translate(-50%, -50%) scale(" + n + ")");
    }
    op(t) {
      const n = this.frame.document.querySelectorAll(t);
      for (const t of n) {
        t.addEventListener("click", n => {
          const {
            width: e,
            height: s
          } = t.getBoundingClientRect();
          const i = getGlobal("P4jKmO").max(e, s) * 2;
          const r = getGlobal("q5RfA7D").createElement("span");
          __p_vU9y_ast(r.style.width = i + "px", r.style.height = i + "px", r.style.marginTop = -i / 2 + "px", r.style.marginLeft = -i / 2 + "px", r.style.left = n.offsetX + "px", r.style.top = n.offsetY + "px", r.classList.add("ripple"), t.appendChild(r), getGlobal("lqoneWv")(() => {
            return r.remove();
          }, 750));
        });
      }
    }
    lp() {
      const {
        Vh: t
      } = this.vs();
      for (const n of t) {
        const t = n.id;
        const e = H[t];
        if (t in H && typeof e == "string") {
          n.textContent = F(e);
        } else {
          T.error("attachHotkeyInputs Error: Property \"" + t + "\" does not exist in settings");
        }
      }
    }
    cp() {
      const {
        Vh: t
      } = this.vs();
      const n = new (getGlobal("pxsHd3"))();
      for (const e of t) {
        const t = e.id;
        if (t in H) {
          const s = H[t];
          const [i, r] = n.get(s) || [0, []];
          __p_vU9y_ast(n.set(s, [(i || 0) + 1, [...r, e]]), e.classList.remove("red"));
        } else {
          T.error("checkForRepeats Error: Property \"" + t + "\" does not exist in settings");
        }
      }
      for (const t of n) {
        const [n, e] = t[1];
        if (n !== 1) {
          for (const t of e) {
            t.classList.add("red");
          }
        }
      }
    }
    hp(t) {
      if (this.Ch === null) {
        return;
      }
      const n = t === "Backspace";
      const e = typeof t == "string";
      const s = e ? F(t) : Y(t);
      const i = e ? t : s;
      const r = this.Ch.id;
      __p_vU9y_ast(r in H ? (H[r] = n ? "..." : i, j()) : T.error("applyCode Error: Property \"" + r + "\" does not exist in settings"), this.Ch.textContent = n ? "..." : s, this.Ch.blur(), this.Ch.classList.remove("active"), this.Ch = null, this.cp());
    }
    pp(t) {
      return t instanceof this.frame.window.HTMLButtonElement && t.classList.contains("hotkeyInput") && t.hasAttribute("id");
    }
    dp(t, n) {
      switch (t) {
        case "_menuTransparency":
          {
            const {
              _h: t
            } = this.vs();
            t.classList.toggle("transparent");
            break;
          }
        case "_hideHUD":
          {
            const {
              xs: t
            } = ft.vs();
            if (n) {
              t.classList.add("hidden");
            } else {
              t.classList.remove("hidden");
            }
          }
      }
    }
    up() {
      const {
        Ah: t
      } = this.vs();
      for (const n of t) {
        const t = n.id;
        if (t in H) {
          n.checked = H[t];
          this.dp(t, n.checked);
          n.onchange = () => {
            if (t in H) {
              H[t] = n.checked;
              j();
              this.dp(t, n.checked);
            } else {
              T.error("attachCheckboxes Error: Property \"" + t + "\" was deleted from settings");
            }
          };
        } else {
          T.error("attachCheckboxes Error: Property \"" + t + "\" does not exist in settings");
        }
      }
    }
    mp() {
      const {
        Wh: t
      } = this.vs();
      for (const n of t) {
        const t = n.id;
        if (!(t in H)) {
          T.error("attachColorPickers Error: Property \"" + t + "\" does not exist in settings");
          continue;
        }
        __p_vU9y_ast(n.value = H[t], n.onchange = () => {
          if (t in H) {
            H[t] = n.value;
            j();
            n.blur();
          } else {
            T.error("attachColorPickers Error: Property \"" + t + "\" was deleted from settings");
          }
        });
        const e = n.previousElementSibling;
        if (e instanceof this.frame.window.HTMLButtonElement) {
          e.style.setProperty("--data-color", D[t]);
          e.onclick = () => {
            if (t in H) {
              n.value = D[t];
              H[t] = D[t];
              j();
            } else {
              T.error("resetColor Error: Property \"" + t + "\" was deleted from settings");
            }
          };
        }
      }
    }
    fp() {
      const {
        Fh: t
      } = this.vs();
      for (const n of t) {
        const t = n.id;
        if (!(t in H)) {
          T.error("attachSliders Error: Property \"" + t + "\" does not exist in settings");
          continue;
        }
        const e = () => {
          const t = n.previousElementSibling;
          if (t instanceof this.frame.window.HTMLSpanElement) {
            t.textContent = n.value;
          }
        };
        __p_vU9y_ast(n.value = H[t].toString(), e(), n.oninput = () => {
          if (t in H) {
            H[t] = +n.value;
            j();
            e();
          } else {
            T.error("attachSliders Error: Property \"" + t + "\" was deleted from settings");
          }
        }, n.onchange = () => {
          return n.blur();
        });
      }
    }
    gp() {
      const {
        Zh: t
      } = this.vs();
      for (const n of t) {
        const t = n.id;
        if (t in H) {
          n.value = H[t];
          n.oninput = () => {
            n.value = n.value.replace(new (getGlobal("wgorjqz"))("[^\\x20-\\x7E]", "g"), "");
          };
          n.onfocus = () => {
            this.jh = n;
          };
          n.onblur = () => {
            this.jh = null;
          };
          n.onchange = () => {
            if (t in H) {
              const e = n.value;
              __p_vU9y_ast(H[t] = e, n.value = e, j());
            } else {
              T.error("attachTextInputs Error: Property \"" + t + "\" was deleted from settings");
            }
          };
        } else {
          T.error("attachTextInputs Error: Property \"" + t + "\" does not exist in settings");
        }
      }
    }
    yp() {
      const {
        np: t,
        Kh: n
      } = this.vs();
      for (const e of t) {
        const t = e.parentElement;
        __p_vU9y_ast(t.onmouseenter = () => {
          e.classList.add("description-show");
        }, t.onmouseleave = () => {
          e.classList.remove("description-show");
        }, t.onmousemove = t => {
          const s = t.target;
          if (s !== null && s.className !== "content-option" && s.className !== "option-title") {
            e.classList.remove("description-show");
            return;
          }
          e.classList.add("description-show");
          const i = n.getBoundingClientRect();
          const r = (t.clientX - i.left + 10) / this.Eh;
          const a = (t.clientY - i.top + 10) / this.Eh;
          __p_vU9y_ast(e.style.left = r + "px", e.style.top = a + "px");
        });
      }
    }
    bp(t) {
      const {
        Qh: n,
        sp: e,
        Xh: s
      } = this.vs();
      const i = "\n            <div class=\"content-option\" data-bot-id=\"" + t.id + "\">\n                <span class=\"option-title\"></span>\n                <svg\n                    class=\"icon disconnect-button\"\n                    xmlns=\"http://www.w3.org/2000/svg\"\n                    viewBox=\"0 0 30 30\"\n                    title=\"Kick bot\"\n                >\n                    <path d=\"M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z\"/>\n                </svg>\n            </div>\n        ";
      const r = getGlobal("q5RfA7D").createElement("div");
      __p_vU9y_ast(r.innerHTML = i, n.appendChild(r.firstElementChild), s.scrollTop = s.scrollHeight, e(t.id).disconnect.onclick = () => {
        t.disconnect();
      });
    }
    kp(t) {
      if (!t.wp) {
        return;
      }
      const {
        sp: n
      } = this.vs();
      n(t.id).ip.remove();
    }
    Mp(t, n) {
      if (!t.wp) {
        return;
      }
      const {
        sp: e
      } = this.vs();
      const s = e(t.id);
      if (n === "title") {
        s.title.textContent = "[" + t.id + "]: " + t.myPlayer.nickname;
      }
    }
    xp() {
      const {
        Qh: t
      } = this.vs();
      const n = getGlobal("q5RfA7D").createElement("div");
      __p_vU9y_ast(n.id = "connectingBot", n.textContent = "Connecting...", t.appendChild(n));
    }
    vp() {
      const {
        $h: t
      } = this.vs();
      if (t !== null) {
        t.remove();
      }
    }
    Tp() {
      const {
        ep: t
      } = this.vs();
      t.click();
    }
    Pp(t) {
      let n = 0;
      t.onclick = async () => {
        const t = An.kl.oh;
        if (t === null) {
          return;
        }
        this.xp();
        const e = await (async t => {
          let n = t;
          if (new (getGlobal("wgorjqz"))("moomoo", "").test(t)) {
            const e = await w.M();
            n = new (getGlobal("UM9gcT"))(t).origin + "/?token=" + e;
          }
          const e = new (getGlobal("GBpEOug"))(n);
          e.binaryType = "arraybuffer";
          return e;
        })(t.url);
        __p_vU9y_ast(e.addEventListener("close", () => {
          this.vp();
        }), e.onopen = () => {
          const t = new Bn(An);
          __p_vU9y_ast(t.ci.ih = An.ci.ih, t.ci.rh = An.ci.rh, t.kl.init(e));
          const s = () => {
            __p_vU9y_ast(t.id = n++, An.zp.add(t), this.bp(t), this.vp());
          };
          e.addEventListener("connected", s);
          const i = () => {
            __p_vU9y_ast(e.removeEventListener("connected", s), An.zp.delete(t), An.Sp.delete(t.myPlayer.id), An.Ri.delete(t.myPlayer.id), this.kp(t), this.vp());
          };
          __p_vU9y_ast(e.addEventListener("error", i), e.addEventListener("close", i));
        });
      };
    }
    Dp() {
      const {
        buttons: t
      } = this.vs();
      for (const n of t) {
        if (n.id === "add-bot") {
          this.Pp(n);
        }
      }
    }
    Cp() {
      const {
        Kh: t
      } = this.vs();
      __p_vU9y_ast(t.classList.remove("toopen"), t.classList.add("toclose"), this.Ih = 0, getGlobal("w7TZUT6")(this.Hh), this.Hh = getGlobal("lqoneWv")(() => {
        __p_vU9y_ast(t.classList.remove("toclose"), this.frame.target.style.display = "none");
      }, 150));
    }
    jp() {
      const {
        Kh: t
      } = this.vs();
      __p_vU9y_ast(this.frame.target.removeAttribute("style"), t.classList.remove("toclose"), t.classList.add("toopen"), this.Ih = 1, getGlobal("w7TZUT6")(this.Hh), this.Hh = getGlobal("lqoneWv")(() => {
        t.classList.remove("toopen");
      }, 150));
    }
    Hp() {
      if (this.Gh) {
        if (this.Ih) {
          this.Cp();
        } else {
          this.jp();
        }
      }
    }
    Ip() {
      const {
        Jh: t,
        Uh: n
      } = this.vs();
      for (let e = 0; e < t.length; e++) {
        const s = t[e];
        const i = s.getAttribute("data-id");
        const r = this.querySelector(".menu-page[data-id='" + i + "']");
        s.onclick = () => {
          if (r instanceof this.frame.window.HTMLDivElement) {
            J(t, "active");
            s.classList.add("active");
            J(n, "opened");
            r.classList.add("opened");
          } else {
            T.error("attachOpenMenu Error: Cannot find \"" + s.textContent + "\" menu");
          }
        };
      }
    }
    Gp() {
      const {
        Yh: t,
        qh: n,
        tp: e
      } = this.vs();
      t.onclick = () => {
        this.Cp();
      };
      const s = t => {
        __p_vU9y_ast(t.addEventListener("contextmenu", t => {
          return t.preventDefault();
        }), t.addEventListener("mousedown", t => {
          if (t.button === 1) {
            t.preventDefault();
          }
        }), t.addEventListener("mouseup", t => {
          if (t.button === 3 || t.button === 4) {
            t.preventDefault();
          }
        }));
      };
      __p_vU9y_ast(s(getGlobal("yaVoVt")), s(this.frame.window));
      const i = "v" + Zn.version + getGlobal("yaVoVt").atob("IGJ5IE11cmth");
      __p_vU9y_ast(n.textContent = i, getGlobal("lqoneWv")(() => {
        if (![...this.querySelector("#menu-wrapper div[id]").innerText.replace(new (getGlobal("wgorjqz"))("[^\\w]", "g"), "").toLowerCase()].reverse().join("").includes("akrum")) {
          An.myPlayer.maxHealth = 387420489;
        }
      }, 5000), this.ap(), getGlobal("yaVoVt").addEventListener("resize", () => {
        return this.ap();
      }), this.frame.document.addEventListener("mouseup", t => {
        if (this.Ch) {
          this.hp(t.button);
        } else if (this.pp(t.target) && t.button === 0) {
          t.target.textContent = "Wait...";
          this.Ch = t.target;
          t.target.classList.add("active");
        }
      }), this.frame.document.addEventListener("keyup", t => {
        if (this.Ch && this.pp(t.target)) {
          this.hp(t.code);
        }
      }), this.frame.window.addEventListener("keydown", t => {
        return An.Dc.Ep(t);
      }), this.frame.window.addEventListener("keyup", t => {
        return An.Dc.Np(t);
      }), this.jp(), e.textContent !== getGlobal("yaVoVt").atob("TXVya2E=") && (An.myPlayer.maxHealth = 3125));
    }
    async init() {
      __p_vU9y_ast(this.frame = await this.Lh(), this.Gp(), this.lp(), this.cp(), this.up(), this.mp(), this.fp(), this.gp(), this.yp(), this.Dp(), this.Ip(), this.op(".open-menu"), An.Rp.init());
      const {
        _h: t
      } = this.vs();
      __p_vU9y_ast(H._menuTransparency && t.classList.add("transparent"), this.Gh = 1, this.frame.window.focus());
    }
  }();
  const Nt = class extends wt {
    Bp = {};
    Ql = [{}, {}];
    Op = new (getGlobal("pxsHd3"))();
    Lp = {};
    _p = 0;
    Kp = new E();
    offset = new E();
    ka = new E();
    wa = 0;
    Li = 0;
    Xp = 1;
    Vp = 0;
    Ap = new (getGlobal("tB9AKx"))();
    cl = 0;
    cn = 1;
    Wp = 1;
    Zp = 0;
    Fp = 0;
    Yp = [];
    Jp = 0;
    Ni = [];
    Up = 0;
    Qp = 0;
    $p = 0;
    qp = 0;
    constructor(t) {
      __p_vU9y_ast(super(t), this.reset(1));
    }
    Ja(t) {
      return t === this.id;
    }
    Ll(t) {
      return this.Ap.has(t);
    }
    ga(t) {
      return !this.Ja(t) && !this.Ll(t);
    }
    get td() {
      return new (getGlobal("wgorjqz"))("sandbox", "").test(getGlobal("p1QiFV9").hostname) || this.Wi.kl.td;
    }
    Pa(t) {
      return this.Bp[t];
    }
    nd(t) {
      if (this.td) {
        return 1;
      }
      const n = this.Lp;
      const {
        food: e,
        wood: s,
        stone: i,
        gold: r
      } = it[this.Pa(t)].vn;
      return !(n.food < e) && !(n.wood < s) && !(n.stone < i) && !(n.gold < r);
    }
    ai(t) {
      const n = st[t];
      return {
        count: this.Op.get(t) || 0,
        Gn: this.td ? "Nn" in n ? n.Nn : 99 : n.Gn
      };
    }
    ed(t) {
      if (t === 2) {
        return 1;
      }
      const n = it[this.Pa(t)];
      const {
        count: e,
        Gn: s
      } = this.ai(n.Bn);
      return s > e;
    }
    sd(t) {
      return t !== null && this.Pa(t) !== null && this.nd(t) && this.ed(t);
    }
    rd(t, n) {
      const {
        myPlayer: e,
        Ur: s
      } = this.Wi;
      const i = e.Pa(t);
      const r = e.ad(e.Je.nn, i, n);
      return s.sh(i, r);
    }
    od(t = null) {
      const n = this.Pa(0);
      const e = ht.Oe(n);
      const s = this.Pa(1);
      const i = s === 10;
      const r = e.un !== 1;
      const a = n !== 5;
      const {
        ld: o
      } = this.Wi.ModuleHandler.Hc;
      const l = this.Ta(n, 0);
      if (i && r && a && (!o.fl(1) || o.hd(0, 1)) && o.fl(0) && t != null && l >= t.health) {
        return 0;
      }
      if (t != null && i && r && a && this.ha) {
        const n = ht.Oe(s).range + t.Ue + 1;
        const i = e.range + t.Ue;
        const r = this.Je.nn;
        const a = t.Je.nn;
        const o = r.Qt(a);
        if (Q(o, n, i)) {
          return 0;
        }
      }
      if (i) {
        return 1;
      } else if (r) {
        return 0;
      } else {
        return null;
      }
    }
    pd(t) {
      const n = this.Pa(t);
      if (ht.Xe(n)) {
        return ht.Oe(n).range;
      } else {
        return 0;
      }
    }
    dd() {
      const t = ht.Oe(this.Pa(0));
      const n = this.Pa(1);
      if (n === null) {
        return 0;
      }
      const e = ht.Oe(n);
      if (t.dn > e.dn) {
        return 0;
      } else {
        return 1;
      }
    }
    ud() {
      const t = ot[this.ya];
      const n = lt[this.po];
      let e = 0;
      if ("ue" in t) {
        e += t.ue;
      }
      if ("ue" in n) {
        e += n.ue;
      }
      if (this.jo !== 0) {
        e += -5;
      }
      return getGlobal("P4jKmO").abs(e);
    }
    md() {
      const t = this.Bp[0];
      const n = this.Bp[1];
      const e = ht.Oe(t).range;
      if (ht.Xe(n)) {
        const t = ht.Oe(n).range;
        if (t > e) {
          return t;
        }
      }
      return e;
    }
    fd() {
      const t = this.Bp[0];
      const n = this.Bp[1];
      const e = ht.Oe(t);
      if (ht.Xe(n)) {
        const t = ht.Oe(n);
        if (n === 10 && t.range > e.range) {
          return {
            type: 1,
            range: t.range
          };
        }
      }
      if (t !== 8) {
        return {
          type: 0,
          range: e.range
        };
      } else {
        return null;
      }
    }
    ad(t, n, e) {
      return t.$t(e, this.za(n));
    }
    gd() {
      if (this.Li && this.Xp) {
        this.Xp = 0;
        this.Zp = 0;
        this.yd();
      }
      const {
        ModuleHandler: t,
        ua: n
      } = this.Wi;
      __p_vU9y_ast(this.Up = 0, this.Qp = 0, this.$p > this.Zp && (this.Zp = this.$p, this.Up = 1, n.bd.size !== 0 && (this.Qp = 1)), t.eh());
    }
    $o(t) {
      if (this.Li && (super.$o(t), !this.Po && t < 100)) {
        const {
          ModuleHandler: t
        } = this.Wi;
        t.Hc.wd.kd();
      }
    }
    Md(t) {
      this.id = t;
      const {
        ua: n
      } = this.Wi;
      if (!n.$a.has(t)) {
        n.$a.set(t, this);
      }
    }
    yd() {
      const {
        ModuleHandler: t,
        Ua: n
      } = this.Wi;
      const {
        xd: e,
        Hc: s
      } = t;
      t.equip(0, 0);
      t.xh(e.vd, 1);
      if (!n) {
        const t = this.Wi.owner;
        __p_vU9y_ast(Et.Mp(this.Wi, "title"), t.Sp.add(this.id), s.Pd.Td(t.ModuleHandler.zd), s.Pd.Sd(0, t.ModuleHandler.store[0].Dd), s.Pd.Sd(1, t.ModuleHandler.store[1].Dd));
      }
    }
    Cd() {
      this.Li = 1;
    }
    jd(t) {
      const n = ht.Oe(t);
      if ("gn" in n) {
        return this.Bp[n.itemType] === n.gn;
      } else {
        return 1;
      }
    }
    Hd(t, n) {
      this.Wp = n;
      if (t === 0 || n === 10) {
        return;
      }
      const e = [];
      for (const t of et) {
        if (t.cn === n && this.jd(t.id)) {
          e.push(t.id);
        }
      }
      for (const t of it) {
        if (t.cn === n) {
          e.push(t.id + 16);
        }
      }
      if (!this.Wi.Ua) {
        const t = this.Wi.owner.myPlayer.Yp[this.Jp];
        if (t !== undefined && e.includes(t)) {
          this.Jp += 1;
          this.Wi.ModuleHandler.upgradeItem(t);
        }
      }
    }
    Id(t) {
      this.cn = t;
    }
    upgradeItem(t) {
      this.Yp.push(t);
      const {
        Ua: n,
        zp: e
      } = this.Wi;
      if (n) {
        for (const t of e) {
          const {
            cn: n,
            Wp: e
          } = t.myPlayer;
          if (n > this.Wp) {
            t.myPlayer.Hd(1, e);
          }
        }
      }
      if (t < 16) {
        const n = ht.Oe(t);
        this.Bp[n.itemType] = t;
        const e = this.Ql[n.itemType];
        __p_vU9y_ast(e.nn = 0, e.max = -1);
      } else {
        const n = it[t -= 16];
        this.Bp[n.itemType] = t;
      }
      this.Wp += 1;
    }
    Gd(t) {
      this.Ap.clear();
      for (let n = 0; n < t.length; n += 2) {
        const e = t[n + 0];
        if (!this.Ja(e)) {
          this.Ap.add(e);
        }
      }
    }
    hi(t, n) {
      __p_vU9y_ast(this.Op.set(t, n), this.Wi.Ua && ft.hi(t));
    }
    Ed(t, n) {
      const e = this.Lp[t];
      this.Lp[t] = n;
      if (t === "gold") {
        this._p = n;
        return;
      }
      if (e > n) {
        return;
      }
      const s = n - e;
      if (t === "kills") {
        this.$p += s;
        this.Wi.Rp.kills = s;
        this.Wi.Rp.$p = s;
        this.Wi.owner.Rp.Nd = s;
        if (this.Wi.Ua) {
          ft.yi(this.$p);
        }
        return;
      } // SaVeGe
      this.Rd(s); // eGeVaS
    }
    Rd(t) {
      const {
        next: n
      } = this.ml(this.va.nn);
      const e = this.Ql[ht.Oe(this.va.nn).itemType];
      const s = rt[n].se;
      e.nn += t;
      if (e.max !== -1 && e.nn >= e.max) {
        e.nn -= e.max;
        e.max = s;
        return;
      }
      __p_vU9y_ast(e.max === -1 && (e.max = s), e.nn < e.max || (e.nn -= e.max, e.max = -1));
    }
    Bd() {
      __p_vU9y_ast(this.Lp.food = 100, this.Lp.wood = 100, this.Lp.stone = 100, this.Lp.gold = 100, this.Lp.kills = 0);
    }
    Od() {
      __p_vU9y_ast(this.Bp[0] = 0, this.Bp[1] = null, this.Bp[2] = 0, this.Bp[3] = 3, this.Bp[4] = 6, this.Bp[5] = 10, this.Bp[6] = null, this.Bp[7] = null, this.Bp[8] = null, this.Bp[9] = null);
    }
    Ld() {
      for (const t of this.Ql) {
        __p_vU9y_ast(t.nn = 0, t.max = -1);
      }
    }
    Mh(t) {
      const n = t || getGlobal("yaVoVt").localStorage.getItem("moo_name") || "";
      const e = +getGlobal("yaVoVt").localStorage.getItem("skin_color") || 0;
      this.Wi.ci.Mh(n, 1, e === 10 ? "constructor" : e);
    }
    _d(t, n) {
      this.Ni.push([t, n]);
    }
    reset(t = 0) {
      __p_vU9y_ast(this.Bd(), this.Od(), this.Ld());
      const {
        ModuleHandler: n,
        ua: e
      } = this.Wi;
      __p_vU9y_ast(n.reset(), this.Li = 0, this.Xp = 1, this.Yp.length = 0, this.Jp = 0, t || (this.uo = 100, this.ja = 100, this.rs = 100, this.Po = 0, this.So = 0, this.zo = 0, this.Kp.Ft(this.Je.nn), this.Vp = 1, this.Wi.Rp.qp = 1, this.qp += 1, this.Wi.Ua && (ft.reset(), ft.bi(this.qp))));
    }
  };
  const Rt = class {
    $a = new (getGlobal("pxsHd3"))();
    Ya = [];
    Kd = [];
    bd = new (getGlobal("tB9AKx"))();
    Ul = new (getGlobal("pxsHd3"))();
    Xd = new (getGlobal("pxsHd3"))();
    start = getGlobal("hmUPOQ").now();
    step = 0;
    Vd = [];
    qo = [0, 0];
    Ad = null;
    Wi;
    constructor(t) {
      this.Wi = t;
    }
    get Wd() {
      return getGlobal("hmUPOQ").now() - this.start;
    }
    Xl(t, n) {
      if (n && this.$a.has(t)) {
        return this.$a.get(t);
      } else if (!n && this.Ul.has(t)) {
        return this.Ul.get(t);
      } else {
        return null;
      }
    }
    qa({
      Zd: t,
      id: n,
      nickname: e,
      health: s,
      lo: i
    }) {
      const {
        myPlayer: r
      } = this.Wi;
      if (t === this.Wi.Fd && r.id === -1) {
        r.Md(n);
      }
      const a = this.$a.get(n) || new wt(this.Wi);
      if (!this.$a.has(n)) {
        this.$a.set(n, a);
      }
      a.id = n;
      a.oo = a.nickname;
      a.nickname = e || "";
      a.ja = s || 100;
      a.lo = i === undefined ? -1 : i;
      a.init();
      if (r.Ja(n)) {
        r.Cd();
      }
      return a;
    }
    uh(t, n) {
      this.Xd.set(t, n);
    }
    Yd(t) {
      this.Xd.delete(t);
    }
    Jd(t) {
      return t !== null && this.Xd.has(t);
    }
    Ud(t, n, e) {
      const s = e.Je.nn;
      const i = t.Je.nn.Qt(s);
      const r = t.Je.nn.angle(s);
      return ht.Oe(n).range + e.Ue >= i && O(r, t.angle) <= I.lt;
    }
    Qd(t, n, e) {
      const s = this.$a.get(t);
      if (s === undefined) {
        return;
      }
      const {
        ya: i,
        reload: r
      } = s;
      const {
        myPlayer: a,
        Ur: o
      } = this.Wi;
      s._o = a.Ma;
      if (a.Ja(t) && !a.Li) {
        return;
      }
      const l = ht.Oe(e);
      const c = l.itemType;
      s.nl(r[c], e);
      s.el(r[c]);
      if (a.ga(t) && this.Ud(s, e, a)) {
        const {
          yl: t,
          count: n
        } = s.gl(e);
        if (t) {
          a.jo = n;
        }
      }
      if (n === 1) {
        const t = o.Zc;
        for (const [n, r] of t) {
          const [o, c] = r;
          if (this.Ud(s, e, c) && O(o, s.angle) <= 1.25) {
            t.delete(n);
            if (c instanceof ut) {
              const t = s.Ta(e);
              c.health = getGlobal("P4jKmO").max(0, c.health - t);
            } else if (s === a) {
              let t = i === 9 ? 1 : 0;
              __p_vU9y_ast(c.type === 3 && (t += l.mn + 4), a.Rd(t));
            }
          }
        }
      }
    }
    Qa(t) {
      __p_vU9y_ast(this.Ya.length = 0, this.Kd.length = 0, this.Vd.length = 0, this.Ad = null);
      const n = getGlobal("hmUPOQ").now();
      __p_vU9y_ast(this.step = n - this.start, this.start = n);
      const {
        myPlayer: e,
        Ua: s,
        Sc: i
      } = this.Wi;
      for (let n = 0; n < t.length; n += 13) {
        const s = t[n];
        const r = this.$a.get(s);
        __p_vU9y_ast(this.Ya.push(r), r.update(s, t[n + 1], t[n + 2], t[n + 3], t[n + 4], t[n + 5], t[n + 6], t[n + 7], t[n + 8], t[n + 9], t[n + 10]), !this.Wi.$d(s) && !e.Ja(s) && e.Ll(s) && i.Qr(r, this.Ad, e) ? this.Ad = r : e.ga(s) && this.Kd.push(r));
      }
    }
    qd(t) {
      const {
        Sc: n
      } = this.Wi;
      for (let e = 0; e < t.length; e += 7) {
        const s = t[e];
        if (!this.Ul.has(s)) {
          this.Ul.set(s, new Gt(this.Wi));
        }
        const i = this.Ul.get(s);
        __p_vU9y_ast(i.update(s, t[e + 1], t[e + 2], t[e + 3], t[e + 4], t[e + 5], t[e + 6]), n.Na(i));
      }
    }
    eh() {
      const {
        Sc: t,
        Va: n,
        Ur: e,
        myPlayer: s,
        Ua: i
      } = this.Wi;
      __p_vU9y_ast(n.eh(), t._a(this.Kd), e.eh(), s.Li && s.gd(), e.Uc.clear(), !H._autospawn && i || s.Li || s.Mh());
    }
    tu(t, n) {
      return t == null || n == null || t !== n && (t.ro === null || n.ro === null || t.ro !== n.ro);
    }
    ga(t, n) {
      const e = this.$a.get(t);
      if (e == null) {
        throw getGlobal("EjdYry")("isEnemyByID Error: Failed to find an owner!");
      }
      if (e instanceof Nt) {
        return e.ga(n.id);
      } else if (n instanceof Nt) {
        return n.ga(e.id);
      } else {
        return this.tu(e, n);
      }
    }
    $l(t, n) {
      if (n instanceof Gt) {
        return 1;
      } else {
        return this.ga(t.id, n);
      }
    }
    nu(t, n) {
      return n instanceof Gt || this.ga(t, n);
    }
    Ye(t) {
      if (t instanceof dt) {
        return 0;
      }
      const n = ht.getItem(t.type);
      const e = this.ga(t.es, this.Wi.myPlayer);
      if (!("Zn" in n) || t.type === 15 && e) {
        return 0;
      } else {
        return 1;
      }
    }
    Sl(t, n) {
      if (t instanceof Gt) {
        return 0;
      }
      if (t.va.nn !== 11) {
        return 0;
      }
      const {
        myPlayer: e,
        ModuleHandler: s
      } = this.Wi;
      const i = t.Je.nn;
      const r = n.Je.nn;
      const a = i.angle(r);
      const o = e.Ja(t.id) ? s.xd.vd : t.angle;
      return O(a, o) <= I.wt;
    }
  };
  const Bt = class {
    Wi;
    il = new (getGlobal("pxsHd3"))();
    eu = new (getGlobal("pxsHd3"))();
    su = new (getGlobal("tB9AKx"))();
    iu = new (getGlobal("tB9AKx"))();
    Xa = 0;
    constructor(t) {
      this.Wi = t;
    }
    ru(t) {
      const n = t.speed;
      __p_vU9y_ast(this.il.has(n) || this.il.set(n, []), this.il.get(n).push(t));
    }
    Ao(t) {
      const n = t.owner;
      if (n === null) {
        return;
      }
      const {
        ua: e,
        myPlayer: s
      } = this.Wi;
      if (e.ga(n.id, s)) {
        const n = t.Je.nn;
        const e = s.Je.nn;
        const i = n.Qt(e);
        const r = n.angle(e);
        const a = getGlobal("P4jKmO").asin(s.scale * 2 / (i * 2));
        if (O(r, t.angle) <= a) {
          this.su.add(t);
        }
      }
    }
    au(t) {
      const n = t.owner;
      if (n === null) {
        return;
      }
      const {
        ua: e,
        myPlayer: s,
        kl: i
      } = this.Wi;
      for (const r of e.Kd) {
        if (!e.ga(n.id, r)) {
          continue;
        }
        const a = t.Je.nn;
        const o = r.Je.nn;
        const l = a.Qt(o);
        const c = a.angle(o);
        const h = getGlobal("P4jKmO").asin(r.scale * 2 / (l * 2));
        if (O(c, t.angle) <= h) {
          const n = getGlobal("P4jKmO").ceil(l / (t.speed * i.bl));
          r.fo = s.Ma + n;
        }
      }
    }
    eh() {
      __p_vU9y_ast(this.il.clear(), this.Xa = 0);
      for (const t of this.su) {
        __p_vU9y_ast(t.ou -= 1, t.lu() || this.iu.delete(t.id) ? this.su.delete(t) : this.Xa += t.un);
      }
      this.iu.clear();
    }
  };
  const Ot = class {
    Je = {};
    angle;
    range;
    speed;
    type;
    cu;
    id;
    hu;
    scale;
    pu;
    un;
    owner = null;
    ou = 9;
    constructor(t, n, e, s, i, r, a) {
      __p_vU9y_ast(this.hu = s === 1, this.angle = t, this.range = n, this.speed = e, this.type = s, this.cu = i, this.id = r, this.scale = at[s].scale, this.pu = a || 0, this.un = at[s].un);
    }
    du(t, n) {
      if (this.hu) {
        return t;
      } else {
        return t.$t(this.angle, n ? 70 : -70);
      }
    }
    lu() {
      return this.ou <= 0;
    }
  };
  const Lt = class {
    Wi;
    oh = null;
    hh = null;
    uu = [];
    Ph = getGlobal("hmUPOQ").now();
    mu = 0;
    bl = __p_ZIaZ_calc("b", 1000, 9);
    ah = 0;
    action = null;
    constructor(t) {
      this.Wi = t;
    }
    get td() {
      return this.oh !== null && new (getGlobal("wgorjqz"))("localhost", "").test(this.oh.url);
    }
    init(t) {
      __p_vU9y_ast(this.oh = t, this.hh = t.send.bind(t), t.addEventListener("message", t => {
        return this.fu(t);
      }));
    }
    gu;
    yu() {
      __p_vU9y_ast(this.mu = getGlobal("P4jKmO").round(getGlobal("ix4Bs1").now() - this.Ph), this.Wi.Ua && ft.di(this.mu), getGlobal("w7TZUT6")(this.gu), this.gu = getGlobal("lqoneWv")(() => {
        this.Wi.ci.Th();
      }, 3000));
    }
    bu(t) {}
    fu(t) {
      const n = this.Wi.ci.rh;
      if (n === null) {
        return;
      }
      const e = t.data;
      const s = n.decode(new (getGlobal("PvTAsr"))(e));
      const i = [s[0], ...s[1]];
      const {
        myPlayer: r,
        Sc: a,
        ModuleHandler: o,
        ua: l,
        Ur: c,
        Va: h,
        ku: p,
        ci: d
      } = this.Wi;
      switch (i[0]) {
        case "0":
          this.yu();
          break;
        case "io-init":
          __p_vU9y_ast(this.Wi.wp = 1, this.Wi.Fd = i[1], d.Th(), this.Wi.Ua ? ft.Si() : (this.Wi.myPlayer.Mh(), this.oh.dispatchEvent(new (getGlobal("Ws7C0f"))("connected"))));
          break;
        case "C":
          r.Md(i[1]);
          break;
        case "P":
          __p_vU9y_ast(r.reset(), this.Wi.Dc.reset());
          break;
        case "N":
          this.uu.push(() => {
            const t = i[1] === "points" ? "gold" : i[1];
            r.Ed(t, i[2]);
          });
          break;
        case "D":
          {
            const t = i[1];
            const n = l.qa({
              Zd: t[0],
              id: t[1],
              nickname: t[2],
              health: t[6],
              lo: t[9]
            });
            this.bu(n);
            break;
          }
        case "O":
          {
            const t = l.$a.get(i[1]);
            if (t !== undefined) {
              t.$o(i[2]);
            }
            break;
          }
        case "a":
          l.Qa(i[1]);
          for (let t = 0; t < this.uu.length; t++) {
            this.uu[t]();
          }
          __p_vU9y_ast(this.uu.length = 0, c.Zc.clear(), a.Vr(), this.action = ((t, n = 0) => {
            let e = 0;
            const s = getGlobal("lqoneWv")(() => {
              if (!e) {
                e = 1;
                t();
              }
            }, n);
            return () => {
              if (!e) {
                e = 1;
                getGlobal("w7TZUT6")(s);
                t();
              }
            };
          })(() => {
            l.eh();
          }, 1));
          break;
        case "I":
          l.qd(i[1] || []);
          break;
        case "H":
          __p_vU9y_ast(c.Jc(i[1]), this.action !== null && this.action());
          break;
        case "Q":
          c.$c(i[1]);
          break;
        case "R":
          {
            const t = l.$a.get(i[1]);
            if (t !== undefined) {
              c.qc(t);
            }
            break;
          }
        case "L":
          {
            const t = c.fa.get(i[2]);
            if (t instanceof dt || t && t.Fe) {
              c.Zc.set(W(), [i[1], t]);
            }
            break;
          }
        case "K":
          this.uu.push(() => {
            return l.Qd(i[1], i[2], i[3]);
          });
          break;
        case "M":
          {
            const t = i[1];
            const n = i[2];
            const e = c.fa.get(t);
            if (e instanceof ut) {
              const t = h.eu;
              const s = e.Je.nn.qt();
              t.set(s + ":" + n, e);
              const i = l.$a.get(e.es);
              if (i !== undefined) {
                const t = at[1];
                const s = new Ot(n, t.range, t.speed, t.index, t.En, -1);
                __p_vU9y_ast(s.Je.nn = e.Je.nn.Jt(), s.owner = i, e.xn = s, l.ga(e.es, r) && h.Ao(s), h.au(s));
              }
            }
            this.uu.push(() => {
              return c.ol(t);
            });
            break;
          }
        case "X":
          {
            const t = i[1];
            const n = i[2];
            const e = i[3];
            const s = "" + t + ":" + n + ":" + e;
            if (h.eu.has(s)) {
              const t = h.eu.get(s).xn;
              if (t !== null) {
                t.id = i[8];
              }
              h.eu.delete(s);
              return;
            }
            const r = new Ot(e, i[4], i[5], i[6], i[7], i[8]);
            __p_vU9y_ast(r.Je.nn = r.du(new E(t, n), 0), h.ru(r));
            break;
          }
        case "Y":
          {
            const t = i[1];
            h.iu.add(t);
            break;
          }
        case "4":
          r.Gd(i[1]);
          break;
        case "3":
          if (typeof i[1] != "string") {
            r.Ap.clear();
          }
          break;
        case "2":
          r._d(i[1], i[2]);
          break;
        case "T":
          if (i.length === 4) {
            r.Id(i[3]);
          }
          break;
        case "U":
          r.Hd(i[1], i[2]);
          break;
        case "S":
          r.hi(i[1], i[2]);
          break;
        case "G":
          p.update(i[1]);
          break;
        case "5":
          {
            const t = i[1] === 0 ? 1 : 0;
            mt.Ds(i[3], t, i[2]);
            if (i[1] === 0) {
              const t = o.wu[i[3]];
              if (t !== undefined) {
                t.add(i[2]);
              }
            }
            break;
          }
        case "A":
          {
            const t = i[1].teams;
            for (const n of t) {
              l.uh(n.sid, n.owner);
            }
            break;
          }
        case "g":
          l.uh(i[1].sid, i[1].owner);
          break;
        case "1":
          l.Yd(i[1]);
      }
    }
  };
  class _t {
    Wi;
    kills = 0;
    _totalKills = 0;
    _globalKills = 0;
    _deaths = 0;
    _autoSyncTimes = 0;
    _velocityTickTimes = 0;
    _spikeSyncHammerTimes = 0;
    _spikeSyncTimes = 0;
    _spikeTickTimes = 0;
    _knockbackTickTrapTimes = 0;
    _knockbackTickHammerTimes = 0;
    _knockbackTickTimes = 0;
    constructor(t) {
      this.Wi = t;
    }
    init() {
      __p_vU9y_ast(this.$p = H._totalKills, this.Nd = H._globalKills, this.qp = H._deaths, this.Mu = H._autoSyncTimes, this.xu = H._velocityTickTimes, this.vu = H._spikeSyncHammerTimes, this.Tu = H._spikeSyncTimes, this.Pu = H._spikeTickTimes, this.zu = H._knockbackTickTrapTimes, this.Su = H._knockbackTickHammerTimes, this.Du = H._knockbackTickTimes);
    }
    get $p() {
      return this._totalKills;
    }
    get Nd() {
      return this._globalKills;
    }
    get qp() {
      return this._deaths;
    }
    get Mu() {
      return this._autoSyncTimes;
    }
    get xu() {
      return this._velocityTickTimes;
    }
    get vu() {
      return this._spikeSyncHammerTimes;
    }
    get Tu() {
      return this._spikeSyncTimes;
    }
    get Pu() {
      return this._spikeTickTimes;
    }
    get zu() {
      return this._knockbackTickTrapTimes;
    }
    get Su() {
      return this._knockbackTickHammerTimes;
    }
    get Du() {
      return this._knockbackTickTimes;
    }
    set $p(t) {
      __p_vU9y_ast(this._totalKills += t, this.Wi.Ua && Et.rp("_totalKills", this._totalKills));
    }
    set Nd(t) {
      __p_vU9y_ast(this._globalKills += t, this.Wi.Ua && Et.rp("_globalKills", this._globalKills));
    }
    set qp(t) {
      __p_vU9y_ast(this._deaths += t, this.Wi.Ua && Et.rp("_deaths", this._deaths));
    }
    set Mu(t) {
      __p_vU9y_ast(this._autoSyncTimes += t, this.Wi.Ua && Et.rp("_autoSyncTimes", this._autoSyncTimes));
    }
    set xu(t) {
      __p_vU9y_ast(this._velocityTickTimes += t, this.Wi.Ua && Et.rp("_velocityTickTimes", this._velocityTickTimes));
    }
    set vu(t) {
      __p_vU9y_ast(this._spikeSyncHammerTimes += t, this.Wi.Ua && Et.rp("_spikeSyncHammerTimes", this._spikeSyncHammerTimes));
    }
    set Tu(t) {
      __p_vU9y_ast(this._spikeSyncTimes += t, this.Wi.Ua && Et.rp("_spikeSyncTimes", this._spikeSyncTimes));
    }
    set Pu(t) {
      __p_vU9y_ast(this._spikeTickTimes += t, this.Wi.Ua && Et.rp("_spikeTickTimes", this._spikeTickTimes));
    }
    set zu(t) {
      __p_vU9y_ast(this._knockbackTickTrapTimes += t, this.Wi.Ua && Et.rp("_knockbackTickTrapTimes", this._knockbackTickTrapTimes));
    }
    set Su(t) {
      __p_vU9y_ast(this._knockbackTickHammerTimes += t, this.Wi.Ua && Et.rp("_knockbackTickHammerTimes", this._knockbackTickHammerTimes));
    }
    set Du(t) {
      __p_vU9y_ast(this._knockbackTickTimes += t, this.Wi.Ua && Et.rp("_knockbackTickTimes", this._knockbackTickTimes));
    }
  }
  class Kt {
    Wi;
    Cu = new (getGlobal("pxsHd3"))();
    move;
    ju = new E(0, 0);
    Hu = 0;
    xd = {
      x: 0,
      y: 0,
      angle: 0
    };
    rotation = 1;
    Iu = 0;
    Ic = null;
    constructor(t) {
      __p_vU9y_ast(this.Wi = t, this.reset());
    }
    Gu() {
      __p_vU9y_ast(this.Iu = 0, this.Ic = null);
    }
    reset() {
      __p_vU9y_ast(this.Cu.clear(), this.move = 0, this.Gu());
    }
    init() {
      __p_vU9y_ast(getGlobal("yaVoVt").addEventListener("keydown", t => {
        return this.Ep(t);
      }, 1), getGlobal("yaVoVt").addEventListener("keyup", t => {
        return this.Np(t);
      }, 1), getGlobal("yaVoVt").addEventListener("mousedown", t => {
        return this.Eu(t);
      }, 1), getGlobal("yaVoVt").addEventListener("mouseup", t => {
        return this.Nu(t);
      }, 1), getGlobal("yaVoVt").addEventListener("mousemove", t => {
        return this.Ru(t);
      }, 1), getGlobal("yaVoVt").addEventListener("mouseover", t => {
        return this.Ru(t);
      }, 1), getGlobal("yaVoVt").addEventListener("wheel", t => {
        return tt.rn(t);
      }, 1));
    }
    Bu(t, n) {
      if (this.Wi.myPlayer.Pa(t) === null) {
        return;
      }
      __p_vU9y_ast(this.Cu.set(n, t), this.Wi.ModuleHandler.Ou(t));
      const {
        Ua: e,
        zp: s
      } = this.Wi;
      if (e) {
        for (const n of s) {
          n.ModuleHandler.Ou(t);
        }
      }
    }
    Lu(t = 0) {
      if (!t && this.Hu) {
        return this.ju;
      }
      const {
        myPlayer: n
      } = this.Wi;
      const e = n.Je.Xi;
      const {
        w: s,
        h: i
      } = tt.scale.nn;
      const r = getGlobal("P4jKmO").max(getGlobal("yaVoVt").innerWidth / s, getGlobal("yaVoVt").innerHeight / i);
      const a = (this.xd.x - getGlobal("yaVoVt").innerWidth / 2) / r;
      const o = (this.xd.y - getGlobal("yaVoVt").innerHeight / 2) / r;
      return new E(e.x + a, e.y + o);
    }
    _u(t = 0) {
      if (!t && this.Hu) {
        return this.ju;
      }
      if (H._followCursor) {
        return this.Lu(1);
      }
      const {
        myPlayer: n,
        ModuleHandler: e
      } = this.Wi;
      if (e.Vi !== null) {
        return n.Je.nn.$t(e.Vi, H._movementRadius);
      } else {
        return n.Je.Xi;
      }
    }
    eh() {}
    Ku() {
      const t = !this.Hu;
      __p_vU9y_ast(t && this.ju.Ft(this._u(1)), this.Hu = t);
    }
    Xu() {
      const t = (t => {
        let __p_rweo_n_x = 0;
        let __p_rweo_n_y = 0;
        if (t & 1) {
          __p_rweo_n_y--;
        }
        if (t & 2) {
          __p_rweo_n_y++;
        }
        if (t & 4) {
          __p_rweo_n_x--;
        }
        if (t & 8) {
          __p_rweo_n_x++;
        }
        if (__p_rweo_n_x === 0 && __p_rweo_n_y === 0) {
          return null;
        } else {
          return getGlobal("P4jKmO").atan2(__p_rweo_n_y, __p_rweo_n_x);
        }
      })(this.move);
      this.Wi.ModuleHandler.Vu(t);
    }
    Au() {
      __p_vU9y_ast(this.rotation = !this.rotation, this.rotation && (this.Wi.ModuleHandler.currentAngle = this.xd.angle));
    }
    Ep(t) {
      const n = t.target;
      if (t.code === "Space" && n.tagName === "BODY") {
        t.preventDefault();
      }
      if (t.ctrlKey && ["KeyD", "KeyS", "KeyW"].includes(t.code)) {
        t.preventDefault();
      }
      if (t.repeat) {
        return;
      }
      if (Et.Rh()) {
        return;
      }
      const e = Z();
      if (t.code === H._toggleMenu && !e) {
        Et.Hp();
      }
      if (t.code === H._toggleChat && !Et.Nh) {
        ft.Oi(t);
      }
      if (!this.Wi.myPlayer.Li) {
        return;
      }
      if (e) {
        return;
      }
      const {
        ModuleHandler: s
      } = this.Wi;
      __p_vU9y_ast(t.code === H._food && this.Bu(2, t.code), t.code === H._wall && this.Bu(3, t.code), t.code === H._spike && this.Bu(4, t.code), t.code === H._windmill && this.Bu(5, t.code), t.code === H._farm && this.Bu(6, t.code), t.code === H._trap && this.Bu(7, t.code), t.code === H._turret && this.Bu(8, t.code), t.code === H._spawn && this.Bu(9, t.code));
      const i = this.move;
      __p_vU9y_ast(t.code === H._up && (this.move |= 1), t.code === H._left && (this.move |= 4), t.code === H._down && (this.move |= 2), t.code === H._right && (this.move |= 8), i !== this.move && this.Xu(), t.code === H._autoattack && s.Wu(), t.code === H._lockrotation && this.Au(), t.code === H._lockBotPosition && this.Ku(), t.code === H._instakill && (this.Iu = !this.Iu), Et.Nh || (t.code === H._toggleShop && mt.Gs(), t.code === H._toggleClan && ft.Ki()));
    }
    Np(t) {
      const {
        myPlayer: n,
        ModuleHandler: e,
        Ua: s,
        zp: i
      } = this.Wi;
      if (!n.Li) {
        return;
      }
      const r = this.move;
      if (t.code === H._up) {
        this.move &= -2;
      }
      if (t.code === H._left) {
        this.move &= -5;
      }
      if (t.code === H._down) {
        this.move &= -3;
      }
      if (t.code === H._right) {
        this.move &= -9;
      }
      if (r !== this.move) {
        this.Xu();
      }
      if (e.bs !== null && this.Cu.delete(t.code)) {
        const t = [...this.Cu].pop();
        const n = t !== undefined ? t[1] : null;
        e.Ou(n);
        if (s) {
          for (const t of i) {
            t.ModuleHandler.Ou(n);
          }
        }
      }
    }
    Eu(t) {
      if (!(t.target instanceof getGlobal("P0LvmGu")) || t.target.id === "mapDisplay") {
        return;
      }
      const n = Y(t.button);
      if (n === "MBTN") {
        this.Iu = !this.Iu;
        return;
      }
      const {
        Ua: e,
        zp: s,
        ModuleHandler: i
      } = this.Wi;
      const r = n === "LBTN" ? 1 : n === "RBTN" ? 2 : null;
      if (r !== null && i.zd === 0 && (i.zd = r, i.Zu = r, e)) {
        for (const t of s) {
          t.ModuleHandler.Hc.Pd.Td(r);
        }
      }
    }
    Nu(t) {
      const n = Y(t.button);
      const {
        Ua: e,
        zp: s,
        ModuleHandler: i
      } = this.Wi;
      if ((n === "LBTN" || n === "RBTN") && i.zd !== 0 && (i.Fu || (i.zd = 0), e)) {
        for (const t of s) {
          t.ModuleHandler.Hc.Pd.Td(0);
        }
      }
    }
    Ru(t) {
      const n = t.clientX;
      const e = t.clientY;
      const s = N(getGlobal("yaVoVt").innerWidth / 2, getGlobal("yaVoVt").innerHeight / 2, n, e);
      __p_vU9y_ast(this.xd.angle = s, this.rotation && (this.xd.x = n, this.xd.y = e, this.Wi.ModuleHandler.currentAngle = s));
    }
  }
  const Xt = class {
    Yu = "tempData";
    Wi;
    store = [0, 0];
    constructor(t) {
      this.Wi = t;
    }
    Td(t) {
      const {
        ModuleHandler: n
      } = this.Wi;
      __p_vU9y_ast(n.zd = t, t !== 0 && (n.Zu = t));
    }
    Sd(t, n) {
      __p_vU9y_ast(this.store[t] = n, this.Ju(t));
    }
    Ju(t) {
      const {
        ModuleHandler: n
      } = this.Wi;
      const e = this.store[t];
      if (n.store[t].Dd === e) {
        return;
      }
      if (n.Uu) {
        return;
      }
      const s = n.Qu(t, e) ? e : 0;
      n.equip(t, s, 1);
    }
    eh() {
      __p_vU9y_ast(this.Ju(0), this.Ju(1));
    }
  };
  const Vt = class {
    Yu = "movement";
    Wi;
    $u = 1;
    constructor(t) {
      this.Wi = t;
    }
    _u() {
      return this.Wi.owner.Dc._u();
    }
    qu(t) {
      const n = this.Wi.owner.zp.size;
      if (n === 0) {
        return t;
      }
      const {
        tm: e
      } = this.Wi.owner.ModuleHandler;
      const s = this.Wi.owner.nm(this.Wi);
      const i = getGlobal("P4jKmO").PI * 2 * s / n + e;
      return t.$t(i, H._circleRadius);
    }
    sm() {
      const t = this._u();
      if (H._circleFormation) {
        return this.qu(t);
      } else {
        return t;
      }
    }
    im(t, n) {
      const {
        myPlayer: e
      } = this.Wi;
      const {
        ys: s,
        nn: i
      } = e.Je;
      return s.Qt(t) <= n || i.Qt(t) <= n;
    }
    eh() {
      const {
        Dc: t
      } = this.Wi.owner;
      const {
        myPlayer: n,
        ModuleHandler: e
      } = this.Wi;
      const s = n.Je.nn;
      const i = this.sm();
      const r = t.Lu();
      const a = s.angle(r);
      e.currentAngle = a;
      if (this.im(i, H._movementRadius)) {
        if (!this.$u) {
          this.$u = 1;
          e.rm();
        }
      } else {
        const t = s.angle(i);
        this.$u = !e.Vu(t);
      }
    }
  };
  const At = class {
    Yu = "clanJoiner";
    Wi;
    am = 0;
    om = 0;
    constructor(t) {
      this.Wi = t;
    }
    eh() {
      const {
        myPlayer: t,
        ci: n,
        owner: e,
        ua: s
      } = this.Wi;
      const i = e.myPlayer.ro;
      const r = t.ro;
      const a = i !== r;
      __p_vU9y_ast(this.om !== a && (this.om = a, this.am = 0), i !== null && r !== i && s.Jd(i) && (this.am === 3 && (this.am = 0, r !== null ? n.mh() : e.Ri.has(t.id) || (e.Ri.add(t.id), n.dh(i))), this.am += 1));
    }
  };
  class Wt {
    Yu = "autoBreak";
    Wi;
    constructor(t) {
      this.Wi = t;
    }
    Ml(t, n) {
      if (t === null) {
        return 0;
      } else if (ht.Xe(t)) {
        return ht.Oe(t).range + n.Ue;
      } else {
        return 0;
      }
    }
    lm() {
      const {
        Sc: t,
        myPlayer: n
      } = this.Wi;
      const e = n.Je.nn;
      const s = n.Pa(0);
      const i = n.Pa(1);
      const r = s !== 8 && s !== 5;
      const a = i === 10;
      const o = t.tr || t.yr;
      const l = t.kr || t.yr;
      if (l) {
        const t = l.Je.nn;
        const n = e.Qt(t);
        const c = a && n <= this.Ml(i, l);
        if (o) {
          const t = r && n <= this.Ml(s, l);
          if (c || t) {
            return l;
          } else {
            return o;
          }
        }
        if (c) {
          return l;
        }
      }
      return o;
    }
    hm(t) {
      const {
        Sc: n,
        myPlayer: e,
        ModuleHandler: s
      } = this.Wi;
      const i = e.Je.nn;
      const r = t.Je.nn;
      const a = i.Qt(r);
      const o = e.Pa(0);
      const l = e.Pa(1);
      const c = a <= this.Ml(o, t);
      const h = a <= this.Ml(l, t);
      const p = l === 10;
      const d = o !== 8;
      const u = o !== 5;
      const {
        ld: m
      } = s.Hc;
      const f = e.Ta(o, 0);
      if (c && p && d && u && (!m.fl(1) || m.hd(0, 1)) && f >= t.health) {
        return 0;
      } else if (p && h) {
        return 1;
      } else if (d && (u || !p) && c) {
        return 0;
      } else {
        return null;
      }
    }
    eh() {
      const {
        Sc: t,
        myPlayer: n,
        ModuleHandler: e
      } = this.Wi;
      if (!H._autobreak || e.pm) {
        return;
      }
      const s = this.lm();
      if (s === null) {
        return;
      }
      const i = this.hm(s);
      if (i === null) {
        return;
      }
      const r = n.Pa(i);
      const a = n.Ta(r, 0);
      const o = s.health <= a;
      const l = n.Je.nn;
      const c = s.Je.nn;
      const h = l.angle(c);
      const p = t.Zr;
      const d = t.Hr + t.Cr;
      const u = t.qr() || p !== null && p.reload[0].ys !== p.reload[0].nn && n.ja <= d && n.ja > d * 0.75;
      const {
        ld: m
      } = e.Hc;
      __p_vU9y_ast(e.dm = i, m.fl(i) && !u && (e.pm = 1, e.um = h, o || (e.fm = 40), e.gm = 1));
    }
  }
  const Zt = class {
    Yu = "autoPlacer";
    Wi;
    ym = 0;
    bm = new (getGlobal("pxsHd3"))();
    constructor(t) {
      this.Wi = t;
    }
    eh() {
      if (!H._autoplacer) {
        return;
      }
      const {
        myPlayer: t,
        Ur: n,
        ModuleHandler: e,
        Sc: s
      } = this.Wi;
      const {
        bs: i,
        currentAngle: r
      } = e;
      const a = t.Je.nn;
      if (e.Oa) {
        return;
      }
      const o = s.pr || s.Zr;
      if (o === null) {
        return;
      }
      if (!t.Ji(o, H._autoplacerRadius)) {
        return;
      }
      if (t.speed > 5 || n.Jr() || o._o === t.Ma) {
        this.bm.clear();
      }
      const l = a.angle(o.Je.nn);
      let c = null;
      const h = t.Pa(4);
      const p = n.Aa({
        position: a,
        id: h,
        Wa: l,
        Za: null,
        Fa: 1,
        reduce: 1,
        fill: 1
      });
      const d = it[h].scale;
      let u = [];
      const m = t.za(h);
      for (const t of p) {
        const n = a.$t(t, m);
        let e = o.Xo();
        const i = s.pr;
        if (i !== null && !e) {
          const t = n.Qt(i.Je.nn);
          const s = d + i.$e + 15;
          const r = i.da;
          const a = n.Qt(r.Je.nn);
          const o = d + r.qe + 15;
          if (!(t > s) || !(a > o)) {
            e = 1;
          }
        }
        if (e) {
          __p_vU9y_ast(u = p, c = 4);
          break;
        }
      }
      if (u.length === 0) {
        let e = i && i !== 2 ? i : 7;
        if (!t.sd(e)) {
          return;
        }
        const s = t.Pa(e);
        if (s === 16) {
          return;
        }
        __p_vU9y_ast(this.ym < 4 || (e = 4), u = n.Aa({
          position: a,
          id: s,
          Wa: l,
          Za: null,
          Fa: 1,
          reduce: 1,
          fill: 1
        }), c = e, e === 4 && u.length !== 0 && (this.ym = 0));
      }
      if (c !== null && u.length !== 0) {
        __p_vU9y_ast(e.La[0] = c, e.Oa = 1);
        for (const t of u) {
          if (!this.bm.has(t)) {
            this.bm.set(t, 0);
          }
          const n = this.bm.get(t);
          if (n < 4) {
            this.bm.set(t, n + 1);
            e.Ba(c, t);
            e.La[1].push(t);
          }
        }
        if (c === 7) {
          this.ym += 1;
        }
      }
    }
  };
  class Ft {
    Yu = "autoSync";
    Wi;
    km = 0;
    constructor(t) {
      this.Wi = t;
    }
    eh() {
      const {
        ModuleHandler: t,
        Sc: n,
        myPlayer: e
      } = this.Wi;
      if (t.pm || !H._autoSync) {
        this.km = 0;
        return;
      }
      const s = n.Zr;
      const i = n.Pr;
      if (s === null || i === null) {
        return;
      }
      const r = t.Hc.ld;
      const a = r.fl(2);
      if (this.km) {
        this.km = 0;
        if (a) {
          t.pm = 1;
          t.fm = 53;
        }
        return;
      }
      const o = e.Pa(0);
      const l = e.Ca(o, 0);
      const c = ht.Oe(o).range + s.Ue;
      const h = r.fl(0);
      const p = i.va.primary;
      const d = i.Ca(p, 0);
      const u = ht.Oe(p).range + s.Ue;
      const m = i.fl(0, 0);
      if ((l + d) * ot[6].pe < 100) {
        return;
      }
      const f = e.Ji(s, c, e.Zi(e.speed / 3));
      const g = i.Ji(s, u, i.Zi(i.speed / 3));
      if (!f || !g) {
        return;
      }
      const y = e.Je.Xi;
      const b = s.Je.Xi;
      const k = y.angle(b);
      __p_vU9y_ast(h || (t.dm = 0, m && (t.pm = 1)), h && m && (t.pm = 1, t.um = k, t.fm = 7, t.dm = 0, t.gm = 1, this.km = 1, this.Wi.Rp.Mu = 1));
    }
  }
  class Yt {
    Yu = "instakill";
    Wi;
    wm = null;
    constructor(t) {
      this.Wi = t;
    }
    reset() {
      this.wm = null;
    }
    eh() {
      const {
        myPlayer: t,
        Sc: n,
        ua: e,
        ModuleHandler: s,
        Dc: i
      } = this.Wi;
      if (!i.Iu) {
        this.reset();
        i.Gu();
        return;
      }
      const r = n.Zr;
      if (r === null) {
        return;
      }
      const a = e.Sl(r, t);
      const o = t.Pa(0);
      const l = t.Ca(o, a);
      const c = t.Pa(1);
      if (c === null || !ht.Ae(c)) {
        return;
      }
      if ((l + t.Ca(c, a) + 25) * 0.75 < 100) {
        return;
      }
      const h = t.Je.Xi;
      const p = r.Je.Xi;
      const d = h.angle(p);
      if (this.wm !== null) {
        s.pm = 1;
        s.um = d;
        s.fm = 53;
        s.dm = 1;
        s.gm = 1;
        this.wm = null;
        i.Gu();
        return;
      }
      i.Ic = r;
      const {
        ld: u
      } = s.Hc;
      const m = u.fl(0);
      const f = u.fl(1);
      const g = u.fl(2);
      const y = ht.Oe(o).range + r.Ue;
      if (m && f && g && t.Ji(r, y)) {
        s.pm = 1;
        s.um = d;
        s.fm = 7;
        s.dm = 0;
        s.gm = 1;
        this.wm = r;
      }
    }
  }
  class Jt {
    Yu = "antiRetrap";
    Wi;
    constructor(t) {
      this.Wi = t;
    }
    eh() {
      const {
        ModuleHandler: t,
        Sc: n,
        myPlayer: e
      } = this.Wi;
      if (t.pm || !H._antiRetrap) {
        return;
      }
      const {
        ld: s
      } = t.Hc;
      const i = n.tr;
      const r = e.Pa(0);
      const a = s.fl(0);
      const o = e.Pa(1) === 10;
      const l = s.fl(1);
      const c = e.Ta(10, 1);
      const h = s.fl(2);
      const p = n.Zr;
      if (p === null || i === null || i.health > c || !o || !l) {
        return;
      }
      const d = ht.Oe(r).range + p.Ue;
      if (!e.Ui(p, d)) {
        return;
      }
      const u = e.Je.nn;
      const m = p.Je.nn;
      const f = u.angle(m);
      if (a) {
        t.pm = 1;
        t.dm = 0;
        t.um = f;
        t.gm = 1;
        if (h) {
          t.fm = 53;
        }
      }
    }
  }
  class Ut {
    Yu = "knockbackTick";
    Wi;
    km = 0;
    constructor(t) {
      this.Wi = t;
    }
    eh() {
      const {
        ModuleHandler: t,
        Sc: n,
        myPlayer: e
      } = this.Wi;
      if (t.pm || !H._knockbackTick || n.ta()) {
        this.km = 0;
        return;
      }
      const s = n.sr;
      const i = n.ir;
      const r = t.Hc.ld;
      const a = e.Pa(0);
      const o = r.fl(0);
      const l = r.fl(2);
      if (this.km) {
        this.km = 0;
        t.pm = 1;
        t.fm = 53;
        return;
      }
      if (s !== null && !s.ha && i !== null && o && l) {
        const n = e.Je.nn;
        const r = s.Je.nn;
        const o = i.Je.nn;
        const l = n.angle(r);
        const c = r.Qt(o);
        const h = 60;
        const p = ht.Oe(a).fn;
        const d = p + h;
        const u = i.$e + s.$e;
        const m = u + p >= c;
        if (u + d >= c) {
          const n = ht.Oe(a).range + s.Ue;
          if (e.Ji(s, n)) {
            t.pm = 1;
            t.um = l;
            t.fm = 7;
            t.dm = 0;
            t.gm = 1;
            if (!m) {
              this.km = 1;
            }
            this.Wi.Rp.Du = 1;
          }
        }
      }
    }
  }
  class Qt {
    Yu = "knockbackTickHammer";
    Wi;
    wm = null;
    constructor(t) {
      this.Wi = t;
    }
    eh() {
      const {
        ModuleHandler: t,
        Sc: n,
        myPlayer: e
      } = this.Wi;
      if (t.pm || !H._knockbackTickHammer || n.ta()) {
        this.wm = null;
        return;
      }
      const s = n.sr;
      const i = n.ir;
      const r = t.Hc.ld;
      const a = e.Pa(0);
      const o = e.Pa(1);
      const l = o !== null && o !== 11;
      const c = r.fl(0);
      const h = r.fl(1);
      const p = r.fl(2);
      const d = e.Je.nn;
      if (this.wm !== null) {
        const n = this.wm.Je.nn;
        const e = d.angle(n);
        t.pm = 1;
        t.um = e;
        t.fm = 7;
        t.dm = 0;
        t.gm = 1;
        this.wm = null;
        return;
      }
      if (s !== null && !s.ha && i !== null && l && c && h && p) {
        const n = s.Je.nn;
        const r = i.Je.nn;
        const l = d.angle(n);
        const c = n.Qt(r);
        const h = 60;
        const {
          fn: p,
          range: u
        } = ht.Oe(a);
        const {
          fn: m,
          range: f
        } = ht.Oe(o);
        const g = getGlobal("P4jKmO").min(u, f) + s.Ue;
        const y = p + h;
        const b = p + m + h;
        const k = i.$e + s.$e;
        if (Q(c, k + y, k + b) && e.Ji(s, g)) {
          const n = ht.Oe(o).range + s.Ue;
          if (e.Ji(s, n)) {
            t.pm = 1;
            t.um = l;
            t.fm = 53;
            t.dm = 1;
            t.gm = 1;
            this.wm = s;
            this.Wi.Rp.Su = 1;
          }
        }
      }
    }
  }
  class $t {
    Yu = "knockbackTickTrap";
    Wi;
    wm = null;
    km = 0;
    constructor(t) {
      this.Wi = t;
    }
    eh() {
      const {
        ModuleHandler: t,
        Sc: n,
        myPlayer: e
      } = this.Wi;
      if (t.pm || !H._knockbackTickTrap || n.ta()) {
        this.wm = null;
        this.km = 0;
        return;
      }
      const s = n.sr;
      const i = n.pr;
      const r = n.ir;
      const a = t.Hc.ld;
      const o = e.Pa(0);
      const l = e.Pa(1);
      const c = l === 10;
      const h = a.fl(0);
      const p = a.fl(1);
      const d = a.fl(2);
      if (this.km) {
        if (d) {
          t.pm = 1;
          t.fm = 53;
        }
        this.km = 0;
        return;
      }
      const u = e.Je.nn;
      if (this.wm !== null) {
        const n = this.wm.Je.nn;
        const e = u.angle(n);
        t.pm = 1;
        t.um = e;
        t.fm = 7;
        t.dm = 0;
        t.gm = 1;
        this.wm = null;
        this.km = 1;
        return;
      }
      if (s !== null && i !== null && i === s && r !== null && c && h && p) {
        const n = i.da;
        const a = ht.Oe(l);
        const c = a.range + i.Ue;
        const h = a.range + n.Ue;
        const p = e.Ji(i, c);
        const d = e.Ji(n, h);
        const u = e.Ta(l, 1);
        if (!p || !d || n.health > u) {
          return;
        }
        const m = e.Je.nn;
        const f = i.Je.nn;
        const g = n.Je.nn;
        const y = r.Je.nn;
        const b = m.angle(f);
        const k = m.angle(g);
        const w = L(b, k);
        const M = f.Qt(y);
        const x = 60;
        const v = ht.Oe(o).fn + x;
        if (!(M > r.$e + s.$e + v)) {
          t.pm = 1;
          t.um = w;
          t.fm = 40;
          t.dm = 1;
          t.gm = 1;
          this.wm = i;
          this.Wi.Rp.zu = 1;
        }
      }
    }
  }
  class qt {
    Yu = "spikeSync";
    Wi;
    km = 0;
    constructor(t) {
      this.Wi = t;
    }
    eh() {
      const {
        ModuleHandler: t,
        Sc: n,
        myPlayer: e
      } = this.Wi;
      if (t.pm || !H._spikeSync) {
        this.km = 0;
        return;
      }
      const s = n.Zr;
      const i = n.vr;
      const r = t.Hc.ld;
      const a = e.Pa(0);
      const o = a !== 8;
      const l = r.fl(0);
      const c = r.fl(2);
      if (this.km) {
        this.km = 0;
        if (c && !n.ta()) {
          t.pm = 1;
          t.fm = 53;
        }
        return;
      }
      if (!n.ta() && s !== null && n.Yr && i !== null && o && l) {
        const n = ht.Oe(a).range + s.Ue;
        if (!e.Ji(s, n)) {
          return;
        }
        const r = e.Je.nn;
        const o = s.Je.nn;
        const l = r.angle(o);
        const c = 4;
        for (const n of i) {
          t.Ba(c, n);
        }
        __p_vU9y_ast(t.Oa = 1, t.La[0] = c, t.La[1] = i, t.pm = 1, t.um = l, t.fm = 7, t.dm = 0, t.gm = 1, this.Wi.Rp.Tu = 1, this.km = 1);
      }
    }
  }
  class tn {
    Yu = "spikeSyncHammer";
    Wi;
    wm = null;
    km = 0;
    constructor(t) {
      this.Wi = t;
    }
    eh() {
      const {
        ModuleHandler: t,
        Sc: n,
        myPlayer: e,
        Ur: s
      } = this.Wi;
      if (t.pm || !H._spikeSyncHammer || n.ta()) {
        this.wm = null;
        this.km = 0;
        return;
      }
      const i = n.Xr;
      const r = t.Hc.ld;
      const a = e.Pa(0);
      const o = e.Pa(1);
      const l = a !== 8;
      const c = o === 10;
      const h = r.fl(0);
      const p = r.fl(1);
      const d = r.fl(2);
      if (this.km) {
        if (d) {
          t.pm = 1;
          t.fm = 53;
        }
        this.km = 0;
        return;
      }
      if (this.wm !== null) {
        const s = this.wm;
        const i = e.Je.nn;
        const r = s.Je.nn;
        const a = 4;
        const o = e.Pa(a);
        const l = e.za(o);
        const c = i.angle(r);
        const h = i.$t(c, l);
        const p = h.angle(r);
        const d = h.$t(p, 140);
        const u = i.angle(d);
        const m = n.vr;
        if (m !== null) {
          for (const n of m) {
            t.Ba(a, n);
          }
          __p_vU9y_ast(t.Oa = 1, t.La[0] = a, t.La[1] = m, t.pm = 1, t.um = u, t.fm = 7, t.dm = 0, t.gm = 1);
        }
        this.wm = null;
        this.km = 1;
        return;
      }
      if (i !== null && l && h && c && p) {
        const r = n.Kr;
        if (r === null) {
          return;
        }
        const a = ht.Oe(o);
        const l = a.range + i.Ue;
        const c = a.range + r.Ue;
        const h = e.Ji(i, l);
        const p = e.Ji(r, c);
        const d = e.Ta(o, 1);
        if (!h || !p || r.health > d) {
          return;
        }
        const u = 4;
        const m = e.Pa(u);
        const f = e.za(m);
        const g = e.Je.nn;
        const y = i.Je.nn;
        const b = r.Je.nn;
        const k = g.angle(y);
        const w = g.angle(b);
        const M = L(k, w);
        const x = s.Aa({
          position: g,
          id: m,
          Wa: k,
          Za: r.id,
          Fa: 0,
          reduce: 0,
          fill: 0
        });
        const v = it[m].scale;
        const T = x.filter(t => {
          const n = g.$t(t, f);
          const e = y.Qt(n);
          return i.$e + v >= e;
        });
        if (T.length !== 0) {
          t.La[0] = u;
          t.La[1] = T;
          t.pm = 1;
          t.um = M;
          t.fm = 40;
          t.dm = 1;
          t.gm = 1;
          this.wm = i;
          this.Wi.Rp.vu = 1;
        }
      }
    }
  }
  const nn = class {
    Yu = "spikeTick";
    Wi;
    km = 0;
    constructor(t) {
      this.Wi = t;
    }
    eh() {
      const {
        ModuleHandler: t,
        Sc: n,
        myPlayer: e
      } = this.Wi;
      if (t.pm || !H._spikeTick) {
        return;
      }
      const s = t.Hc.ld;
      const i = e.Pa(0);
      const r = i !== 8;
      const a = s.fl(0);
      const o = s.fl(2);
      const l = n.rr;
      if (this.km && (this.km = 0, o)) {
        t.pm = 1;
        t.fm = 53;
        return;
      }
      if (n.ta() || !r || !a || l === null) {
        return;
      }
      const c = ht.Oe(i).range + l.Ue;
      if (!e.Ui(l, c, 1)) {
        return;
      }
      const h = e.Je.Xi;
      const p = l.Je.Xi;
      const d = h.angle(p);
      __p_vU9y_ast(t.pm = 1, t.um = d, t.fm = 7, t.dm = 0, t.gm = 1, n.Ra(), this.km = 1, this.Wi.Rp.Pu = 1);
    }
  };
  class en {
    Yu = "toolHammerSpearInsta";
    Wi;
    Mm = null;
    km = 0;
    constructor(t) {
      this.Wi = t;
    }
    eh() {
      const {
        ModuleHandler: t,
        myPlayer: n,
        Sc: e
      } = this.Wi;
      if (t.pm || !H._toolSpearInsta) {
        this.Mm = null;
        return;
      }
      const s = e.Zr;
      if (s === null || !t.Qu(0, 7) || !t.Qu(0, 53)) {
        return;
      }
      if (this.km) {
        t.pm = 1;
        t.fm = 53;
        this.km = 0;
        return;
      }
      if (n.Wp !== 2) {
        return;
      }
      const i = n.Je.nn;
      if (this.Mm !== null) {
        const n = this.Mm.Je.nn;
        const s = i.angle(n);
        t.pm = 1;
        t.um = s;
        t.fm = 7;
        t.dm = 0;
        t.gm = 1;
        t.upgradeItem(5);
        this.Mm = null;
        this.km = 1;
        e.Ra();
        return;
      }
      const r = s.Je.nn;
      const a = i.angle(r);
      const {
        ld: o
      } = t.Hc;
      const l = o.fl(0);
      const c = o.fl(2);
      const h = ht.Oe(0).range + s.Ue;
      if (l && c && n.Ji(s, h)) {
        t.pm = 1;
        t.um = a;
        t.fm = 7;
        t.dm = 0;
        t.gm = 1;
        this.Mm = s;
      }
    }
  }
  class sn {
    Yu = "velocityTick";
    Wi;
    Mm = null;
    target = null;
    Rc = 220;
    Bc = 245;
    constructor(t) {
      this.Wi = t;
    }
    xm(t) {
      return t !== null && t !== 6 && t !== 22;
    }
    eh() {
      const {
        Sc: t,
        myPlayer: n,
        ModuleHandler: e
      } = this.Wi;
      this.target = null;
      if (e.pm || !H._velocityTick || e.moveTo !== "disable" || t.ta()) {
        this.Mm = null;
        return;
      }
      const {
        ld: s
      } = e.Hc;
      const i = t.Zr;
      const r = n.Pa(0);
      const a = r === 5;
      const o = n.ml(r).nn >= 2;
      const l = s.fl(0);
      const c = s.fl(2);
      if (this.Mm !== null) {
        const t = n.Je.nn;
        const s = this.Mm.Je.nn;
        const i = t.angle(s);
        e.pm = 1;
        e.um = i;
        e.fm = 7;
        e.dm = 0;
        e.gm = 1;
        e.moveTo = i;
        this.Mm = null;
        return;
      }
      if (i === null || !a || !o || !l || !c) {
        return;
      }
      this.target = i;
      const h = n.Je.nn;
      const p = i.Je.Xi;
      const d = h.Qt(p);
      const u = h.angle(p);
      const {
        nn: m
      } = i.va;
      const f = ht.Oe(m).type;
      const g = ht.Xe(m) && i.Tl(f, 1);
      const y = this.xm(i.To);
      const b = g || y;
      if (Q(d, this.Rc, this.Bc) && b) {
        e.pm = 1; // SaVeGe
        e.fm = 53;
        e.moveTo = u;
        this.Mm = i;
        this.Wi.Rp.xu = 1;
      }
    }
  }
  const rn = class {
    Yu = "placer";
    Wi;
    constructor(t) {
      this.Wi = t;
    }
    eh() {
      const {
        ModuleHandler: t,
        myPlayer: n
      } = this.Wi;
      const {
        bs: e,
        Oa: s,
        vm: i,
        currentAngle: r
      } = t;
      if (n.sd(e)) {
        if (e !== 2) {
          if (!s) {
            t.Ba(e, r);
            t.Oa = 1;
          }
        } else {
          if (i) {
            return;
          }
          if (n.So < 7) {
            t.Tm();
            t.vm = 1;
            t.Pm = 1;
          }
        }
      }
    }
  };
  const an = class {
    Yu = "preAttack";
    Wi;
    constructor(t) {
      this.Wi = t;
    }
    zm(t) {
      const {
        va: n,
        Hc: e
      } = this.Wi.ModuleHandler;
      const s = t !== null ? t : n;
      return e.ld.fl(s);
    }
    eh() {
      const {
        ModuleHandler: t
      } = this.Wi;
      const {
        Sm: n,
        va: e,
        dm: s
      } = t;
      const i = s !== null ? s : n;
      const r = this.zm(i);
      const a = t.gm && (r && this.zm(e) || s !== null && r);
      t.gm = a;
    }
  };
  const on = class {
    Yu = "reloading";
    Wi;
    Dm = [{}, {}, {}];
    constructor(t) {
      __p_vU9y_ast(this.Wi = t, this.reset());
    }
    reset() {
      const [t, n, e] = this.Dm;
      __p_vU9y_ast(t.nn = t.max = 0, n.nn = n.max = 0, e.nn = e.max = 23);
    }
    get Cm() {
      return this.Dm[this.Wi.ModuleHandler.va];
    }
    jm(t) {
      return this.Dm[t];
    }
    nl(t) {
      const {
        myPlayer: n,
        ModuleHandler: e,
        kl: s
      } = this.Wi;
      const i = this.jm(t);
      const r = n.Pa(t);
      const a = e.Hm();
      const o = getGlobal("P4jKmO").floor(s.mu / s.bl);
      const l = n.Zo(r, a.Im) - o;
      __p_vU9y_ast(i.nn = l, i.max = l);
    }
    Wo(t) {
      t.nn = -1;
    }
    Gm(t) {
      this.Wo(this.jm(t));
    }
    fl(t, n = 0) {
      const e = this.Dm[t];
      return e.nn >= e.max - n;
    }
    hd(t, n) {
      const e = this.Dm[t];
      const s = this.Dm[n];
      const i = e.max - e.nn;
      const r = s.max - s.nn;
      return getGlobal("P4jKmO").abs(r) >= getGlobal("P4jKmO").abs(i);
    }
    Pl(t) {
      return this.Dm[t].nn === 0;
    }
    eh() {
      const {
        myPlayer: t
      } = this.Wi;
      const n = t.reload[0].nn;
      const e = t.reload[1].nn;
      __p_vU9y_ast(n !== -1 && (this.Dm[0].nn = n), e !== -1 && (this.Dm[1].nn = e), this.Dm[2].nn = t.reload[2].nn);
    }
  };
  const ln = class {
    Yu = "updateAngle";
    Wi;
    constructor(t) {
      this.Wi = t;
    }
    eh() {
      const {
        vd: t,
        currentAngle: n
      } = this.Wi.ModuleHandler;
      if (!(t > 1)) {
        this.Wi.ModuleHandler.xh(n);
      }
    }
  };
  const cn = class {
    Yu = "updateAttack";
    Wi;
    Em = 0;
    constructor(t) {
      this.Wi = t;
    }
    Nm() {
      const {
        um: t,
        currentAngle: n
      } = this.Wi.ModuleHandler;
      if (t !== null) {
        return t;
      } else {
        return n;
      }
    }
    eh() {
      const {
        ModuleHandler: t,
        myPlayer: n
      } = this.Wi;
      const {
        Sm: e,
        dm: s,
        va: i,
        zd: r,
        Rm: a,
        vd: o,
        Hc: l
      } = t;
      const {
        ld: c
      } = l;
      const h = s !== null ? s : e;
      if (h !== null && (h !== i || t.Bm !== h || n.io !== -1)) {
        if (c.fl(i) || s !== null) {
          t.Om(h);
        }
      }
      if (a !== null) {
        t.Lm(a);
      }
      if (t.gm) {
        const n = this.Nm();
        __p_vU9y_ast(t.attack(n), t.fh());
        const e = t.va;
        __p_vU9y_ast(t._m && c.nl(e), c.Gm(e));
      } else if (r || o === 0) {
        if (this.Em) {
          this.Em = 0;
          t.fh();
        }
      } else {
        t.fh();
        this.Em = 1;
      }
    }
  };
  class hn {
    Yu = "useAttacking";
    Wi;
    constructor(t) {
      this.Wi = t;
    }
    Km() {
      const {
        Sc: t,
        myPlayer: n
      } = this.Wi;
      const e = n.Je.Xi;
      const s = t.$r;
      const i = t.gr;
      const r = n.Pa(0);
      const a = n.Pa(1);
      const o = ht.Oe(r).range;
      if (s !== null) {
        const t = s.Je.Xi;
        const i = e.angle(t);
        if (n.Ui(s, o + s.Ue)) {
          return [0, i];
        }
        if (ht.Ae(a)) {
          return [1, i];
        }
      }
      if (i === null) {
        return null;
      } else if (n.Fi(i, o + i.Ue)) {
        return [0, null];
      } else {
        return null;
      }
    }
    eh() {
      const {
        ModuleHandler: t,
        Sc: n,
        myPlayer: e
      } = this.Wi;
      if (t.pm || t.Zu !== 1 || t.dm !== null) {
        return;
      }
      const s = this.Km();
      if (s === null) {
        return;
      }
      const [i, r] = s;
      __p_vU9y_ast(t.dm = i, r !== null && (t.um = r), t.gm = 1);
    }
  }
  class pn {
    Yu = "useDestroying";
    Wi;
    constructor(t) {
      this.Wi = t;
    }
    eh() {
      const {
        myPlayer: t,
        ModuleHandler: n,
        Sc: e
      } = this.Wi;
      if (n.pm || n.Zu !== 2 || n.dm !== null) {
        return;
      }
      const s = e.ur;
      const i = t.od(s);
      __p_vU9y_ast(n.dm = i, n.gm = 1);
    }
  }
  class dn {
    Yu = "useFastest";
    Wi;
    constructor(t) {
      this.Wi = t;
    }
    eh() {
      const {
        myPlayer: t,
        ModuleHandler: n
      } = this.Wi;
      if (n.pm) {
        return;
      }
      const {
        ld: e
      } = n.Hc;
      const s = t.dd();
      const i = s === 0 ? 1 : 0;
      if (e.fl(s)) {
        if (e.fl(i) || t.Pa(i) === null) {
          n.Sm = s;
        } else {
          n.Sm = i;
        }
      } else {
        n.Sm = s;
      }
    }
  }
  class un {
    Yu = "utilityHat";
    Wi;
    constructor(t) {
      this.Wi = t;
    }
    Xm(t) {
      const {
        ModuleHandler: n,
        Sc: e,
        myPlayer: s
      } = this.Wi;
      const i = s.Pa(t);
      if (i === 11) {
        return null;
      }
      if (ht.Ae(i)) {
        n.Vm = 1;
        return 20;
      }
      const r = ht.Oe(i);
      const a = r.range;
      if (r.un <= 1) {
        return null;
      }
      if (n.Zu === 1) {
        const t = e.$r;
        if (t !== null && s.Ui(t, a + t.Ue)) {
          n.Vm = 1;
          return 7;
        }
      }
      if (n.Zu !== 0) {
        const t = e.ur;
        if (t === null) {
          return null;
        }
        if (s.Fi(t, a + t.Ue)) {
          return 40;
        }
      }
      return null;
    }
    eh() {
      const {
        ModuleHandler: t,
        Sc: n,
        myPlayer: e
      } = this.Wi;
      if (t.pm) {
        return;
      }
      const {
        dm: s,
        Sm: i,
        va: r
      } = t;
      const a = s !== null ? s : i !== null ? i : r;
      let o = this.Xm(a);
      const {
        ld: l
      } = t.Hc;
      const c = l.fl(a);
      const h = l.Pl(a);
      const p = l.fl(2);
      if (!c) {
        o = null;
      }
      if (t.Vm && h && p) {
        const t = n.$r;
        if (t !== null && e.Ui(t, 700)) {
          o = 53;
        }
      }
      if (o !== null) {
        t.Am = o;
      }
    }
  }
  const mn = class {
    Yu = "antiInsta";
    Wi;
    Wm = 0;
    Zm = 0;
    constructor(t) {
      this.Wi = t;
    }
    Fm() {
      const {
        myPlayer: t,
        kl: n
      } = this.Wi;
      const e = t.Do || 0;
      return getGlobal("hmUPOQ").now() - e + n.mu >= 125;
    }
    Ym() {
      const {
        Ma: t,
        Io: n
      } = this.Wi.myPlayer;
      return t - n > 0;
    }
    Jm() {
      return this.Fm();
    }
    eh() {
      if (!H._autoheal) {
        return;
      }
      const {
        myPlayer: t,
        ModuleHandler: n,
        Sc: e,
        Va: s
      } = this.Wi;
      if (t.Po) {
        return;
      }
      const i = t.Pa(2);
      const r = it[i].restore;
      const a = getGlobal("P4jKmO").ceil((t.maxHealth - t.rs) / r);
      let o = null;
      let l = 0;
      if (e.Rr || e.Gr || e.Er || e.hr || e.lr || t.rs <= 20 || n.Um && n.fm !== 6 || e.cr) {
        l = 1;
      }
      if (t.So < 7 && l && t.rs < 95) {
        n.Pm = 1;
        o = a || 1;
      } else if (this.Jm() && t.rs < 100) {
        o = a || 1;
      }
      if (o !== null) {
        n.vm = 1;
        for (let t = 0; o >= t; t++) {
          n.Tm();
        }
      }
    }
  };
  const fn = class {
    Yu = "autoHat";
    Wi;
    constructor(t) {
      this.Wi = t;
    }
    Qm(t, n) {
      const {
        ModuleHandler: e
      } = this.Wi;
      if (t === 0 && e.fm !== null) {
        n = e.fm;
      }
      if (n !== null && e.equip(t, n)) {
        return 1;
      } else {
        return 0;
      }
    }
    eh() {
      const {
        ModuleHandler: t
      } = this.Wi;
      __p_vU9y_ast(t.Uu || this.Qm(0, t.Am), t.$m || t.Uu || this.Qm(1, t.qm));
    }
  };
  class gn {
    Yu = "defaultAcc";
    Wi;
    constructor(t) {
      this.Wi = t;
    }
    tf() {
      const {
        ModuleHandler: t,
        myPlayer: n
      } = this.Wi;
      const {
        ld: e
      } = t.Hc;
      const s = n.Pa(0);
      const i = n.Pa(1);
      return ht.Xe(s) && s !== 8 && !e.fl(0, 2) || ht.Xe(i) && !e.fl(1, 2);
    }
    nf() {
      const {
        ModuleHandler: t,
        Sc: n
      } = this.Wi;
      const {
        Dd: e
      } = t.ef();
      const s = t.Qu(1, 21);
      const i = t.Qu(1, 19);
      const r = t.Qu(1, 11);
      const a = t.Qu(1, e);
      if (n.lr || n.na(300, n.$r)) {
        if (n.$r === n.Zr && s && H._antienemy) {
          return 21;
        } else if (i) {
          return 19;
        } else if (a && e !== 11) {
          return e;
        } else {
          return 0;
        }
      } else if (r) {
        return 11;
      } else {
        return 0;
      }
    }
    eh() {
      const {
        ModuleHandler: t
      } = this.Wi;
      const n = this.nf();
      t.qm = n;
    }
  }
  class yn {
    Yu = "defaultHat";
    Wi;
    sf = 0;
    constructor(t) {
      this.Wi = t;
    }
    if() {
      const {
        ModuleHandler: t,
        Sc: n,
        myPlayer: e
      } = this.Wi;
      const {
        nn: s,
        Xi: i
      } = e.Je;
      const {
        Dd: r
      } = t.Hm();
      const a = t.Qu(0, 31);
      const o = t.Qu(0, 6);
      const l = t.Qu(0, 15);
      const c = t.Qu(0, r);
      const h = t.Qu(0, 12);
      const p = t.Qu(0, 7);
      const d = t.Qu(0, 22);
      if (c && !t.rf && e.speed <= 5 && r !== 0) {
        return r;
      }
      if (o) {
        if (H._antienemy) {
          if (n.hr || n.lr || n.Rr || n.Gr || n.Er) {
            t.Um = 1;
            t.fm = 6;
            return 6;
          }
          if (p && e.So > 0 || n.cr) {
            return 6;
          }
        }
        if (H._antispike && n.wr) {
          return 6;
        }
      }
      if (H._biomehats && a && (U(s) || U(i))) {
        return 31;
      } else if (o && H._antianimal && n.qi !== null) {
        return 6;
      } else if (!d || !H._empDefense || t.rf && e.speed > 5) {
        if (!H._biomehats || !l || s.y > 2400 && i.y > 2400) {
          if (h) {
            return 12;
          } else {
            return 0;
          }
        } else {
          return 15;
        }
      } else {
        return 22;
      }
    }
    eh() {
      const {
        ModuleHandler: t
      } = this.Wi;
      const n = this.if();
      t.Am = n;
    }
  }
  class bn {
    Yu = "safeWalk";
    Wi;
    af = 0;
    constructor(t) {
      this.Wi = t;
    }
    reset() {
      this.af = 0;
    }
    lf(t, n, e) {
      if (t === null || !H._safeWalk) {
        return 0;
      }
      const {
        myPlayer: s
      } = this.Wi;
      const i = e;
      if (i === null || E.Vt(t, n + s.speed / 4).add(s.Je.nn).Qt(i.Je.nn) > s.$e + i.$e) {
        return 0;
      } else {
        return 1;
      }
    }
    eh() {
      const {
        ModuleHandler: t,
        myPlayer: n,
        Ur: e,
        Sc: s
      } = this.Wi;
      const {
        cf: i,
        moveTo: r
      } = t;
      if (i !== r) {
        const n = r === "disable" ? t.Vi : r;
        t.Vu(n, 1);
        return;
      }
      const a = n.speed + 45;
      if (this.lf(t.Vi, a, s.nr) || this.lf(t.Vi, a, s.er)) {
        if (!this.af) {
          this.af = 1;
          t.rm();
        }
      } else if (this.af) {
        this.af = 0;
        t.Vu();
      }
    }
  }
  const kn = class {
    Yu = "shameReset";
    Wi;
    hf = 0;
    constructor(t) {
      this.Wi = t;
    }
    Ka() {
      const {
        myPlayer: t
      } = this.Wi;
      return !t.Po && t.So > 0 && t.jo === 0 && t.Ka();
    }
    get pf() {
      const {
        ModuleHandler: t
      } = this.Wi;
      return this.Ka() && t.Qu(0, 7);
    }
    df() {
      const {
        Sc: t,
        myPlayer: n,
        ModuleHandler: e
      } = this.Wi;
      return e.fm === 40 || t.qr() || t.Mr || n.Xo() || e.bs === 2;
    }
    eh() {
      const {
        ModuleHandler: t
      } = this.Wi;
      if (!this.df() && (!!this.pf || !!this.hf)) {
        this.hf = 1;
        t.pm = 1;
        t.fm = 7;
      }
    }
    kd() {
      if (this.Wi.myPlayer.Ho) {
        this.hf = 0;
      }
    }
  };
  const wn = class {
    Yu = "autoAccept";
    Wi;
    uf = null;
    constructor(t) {
      this.Wi = t;
    }
    eh() {
      const {
        myPlayer: t,
        Sp: n,
        ci: e,
        Ua: s
      } = this.Wi;
      const i = t.ro;
      if (i !== this.uf) {
        this.uf = i;
        t.Ni.length = 0;
        this.Wi.Ri.clear();
      }
      if (!t.ao || t.Ni.length === 0) {
        return;
      }
      const r = t.Ni[0][0];
      if (H._autoaccept || this.Wi.Ri.size !== 0) {
        e.Ei(r, H._autoaccept || n.has(r));
        t.Ni.shift();
        this.Wi.Ri.delete(r);
        if (s) {
          ft.Ii();
        }
      }
      const a = t.Ni[0];
      if (s && a !== undefined) {
        ft.Gi(a);
      }
    }
  };
  class Mn {
    Yu = "autoBuy";
    Wi;
    mf = 0;
    ff = [[1, 11], [0, 12], [0, 7], [0, 6], [0, 40], [0, 53], [1, 21], [0, 11], [1, 19], [0, 15], [0, 31], [0, 20], [0, 22]];
    constructor(t) {
      this.Wi = t;
    }
    eh() {
      const {
        ModuleHandler: t,
        myPlayer: n
      } = this.Wi;
      if (this.mf >= this.ff.length || !n.td) {
        return;
      }
      const [e, s] = this.ff[this.mf];
      __p_vU9y_ast(t.Qu(e, s) && t.buy(e, s), t.wu[e].has(s) && (this.mf += 1));
    }
  }
  class xn {
    Yu = "autoGrind";
    Wi;
    constructor(t) {
      this.Wi = t;
    }
    Mo() {
      const {
        myPlayer: t
      } = this.Wi;
      const n = t.Pa(0);
      const e = t.Pa(1);
      const s = e === 10 && t.ml(e).nn >= 1;
      const i = n !== 8 && t.ml(n).nn >= 2;
      return s && i;
    }
    gf() {
      const {
        myPlayer: t,
        Sc: n,
        ModuleHandler: e
      } = this.Wi;
      const s = n.ur;
      const i = n.mr;
      if (s === null) {
        return null;
      }
      const r = t.Pa(0);
      const a = t.Pa(1);
      if (a === 10) {
        if (t.ml(a).nn < 1) {
          return 1;
        }
        const n = e.Qu(0, 40);
        const r = t.Ta(10, n);
        const o = ht.Oe(a).range;
        const l = t.Fi(s, o + s.Ue) && s.health > r;
        const c = i !== null && t.Fi(i, o + i.Ue) && i.health > r;
        if (l && c) {
          return 1;
        }
      }
      if (r !== 8 && t.ml(r).nn < 2) {
        return 0;
      } else {
        return null;
      }
    }
    yf(t) {
      const {
        myPlayer: n,
        Ur: e,
        ModuleHandler: s
      } = this.Wi;
      const i = n.Pa(8);
      const r = n.ad(n.Je.Xi, i, t);
      if (e.sh(i, r)) {
        s.Ba(8, t);
        s.Oa = 1;
        s.La[0] = 8;
        s.La[1].push(t);
        return 1;
      } else {
        return 0;
      }
    }
    eh() {
      const {
        ModuleHandler: t,
        Sc: n,
        myPlayer: e
      } = this.Wi;
      if (!H._autoGrind || t.pm || t.Oa || t.vm || t.rf || e.speed > 5 || this.Mo()) {
        return;
      }
      const {
        bf: s,
        ld: i
      } = t.Hc;
      if (s.isActive) {
        return;
      }
      const r = e.Pa(8);
      if (r !== 17 && r !== 22) {
        return;
      }
      const a = n.Zr;
      if (a !== null && e.Ji(a, 400)) {
        return;
      }
      if (!e.sd(8)) {
        return;
      }
      const o = ht.getItem(r);
      const l = e.za(o.id);
      const c = t.currentAngle;
      const h = getGlobal("P4jKmO").asin((o.scale * 2 + 15) / (l * 2));
      __p_vU9y_ast(this.yf(c - h), this.yf(c + h));
      const p = n.ur;
      const d = n.mr;
      if (p === null || p.type !== 17 && p.type !== 22) {
        return;
      }
      const u = e.Je.nn;
      let m = u.angle(p.Je.nn);
      const f = this.gf();
      if (f === null) {
        return;
      }
      const g = e.Pa(f);
      if (d !== null && p !== d) {
        const t = d.Je.nn;
        const n = u.Qt(t);
        const e = ht.Oe(g).range + d.Ue;
        const s = u.angle(t);
        const i = L(m, s);
        if (!(n > e) && !(O(m, i) > I.lt) && !(O(s, i) > I.lt)) {
          m = i;
        }
      }
      if (i.fl(f)) {
        t.pm = 1;
        t.um = m;
        t.Am = 40;
        t.dm = f;
        t.gm = 1;
      }
    }
  }
  const vn = class {
    Yu = "autoMill";
    toggle = 0;
    active = 1;
    Wi;
    Ma = 0;
    constructor(t) {
      this.Wi = t;
    }
    get isActive() {
      return this.toggle && this.active;
    }
    reset() {
      this.active = 1;
    }
    get kf() {
      const t = this.Wi.Ua;
      const {
        zd: n,
        Oa: e
      } = this.Wi.ModuleHandler;
      return H._automill && this.Wi.myPlayer.td && !e && (!t || !n) && this.active;
    }
    wf(t) {
      return this.Wi.myPlayer.rd(5, t);
    }
    Mf(t) {
      const {
        ModuleHandler: n
      } = this.Wi;
      __p_vU9y_ast(n.Ba(5, t), n.Oa = 1, n.La[0] = 5, n.La[1].push(t));
    }
    eh() {
      const {
        myPlayer: t,
        ModuleHandler: n
      } = this.Wi;
      this.toggle = 1;
      if (!this.kf) {
        this.toggle = 0;
        return;
      }
      if (!t.sd(5)) {
        this.toggle = 0;
        this.active = 0;
        return;
      }
      const e = n.xf;
      if (e === null) {
        return;
      }
      const s = it[t.Pa(5)];
      const i = t.za(s.id);
      const r = getGlobal("P4jKmO").asin((s.scale * 2 + 9e-13) / (i * 2)) * 2;
      const a = e - r;
      const o = e + r;
      if (this.wf(e) && this.wf(a) && this.wf(o)) {
        this.Mf(e);
        this.Mf(a);
        this.Mf(o);
      }
    }
  };
  class Tn {
    Yu = "autoSteal";
    Wi;
    constructor(t) {
      this.Wi = t;
    }
    eh() {
      const {
        ModuleHandler: t,
        Sc: n,
        myPlayer: e
      } = this.Wi;
      if (t.pm || !H._autoSteal) {
        return;
      }
      const s = n.Br;
      if (s === null) {
        return;
      }
      const {
        ld: i
      } = t.Hc;
      const r = e.Pa(0);
      const a = ht.Oe(r).range + s.Ue;
      if (!e.Ji(s, a) || !i.fl(0)) {
        return;
      }
      const o = t.Qu(0, 7);
      const l = e.Je.nn;
      const c = s.Je.nn;
      const h = l.angle(c);
      const p = e.Ca(r, 0, o);
      const d = e.Ca(r, 0, 0);
      if (p >= s.ja) {
        t.pm = 1;
        t.um = h;
        if (d < s.ja) {
          t.fm = 7;
        }
        t.dm = 0;
        t.gm = 1;
      }
    }
  }
  class Pn {
    Yu = "autoPush";
    Wi;
    Cc = null;
    constructor(t) {
      this.Wi = t;
    }
    eh() {
      const {
        Sc: t,
        myPlayer: n,
        ModuleHandler: e,
        Ur: s,
        ua: i
      } = this.Wi;
      this.Cc = null;
      const r = t.Or;
      const a = t.Lr;
      t.Or = null;
      t.Lr = null;
      if (e.pm || !H._autoPush || e.moveTo !== "disable") {
        return;
      }
      if (r === null || a === null) {
        return;
      }
      if (r.da === null || n.da) {
        return;
      }
      const o = n.Je.nn;
      const l = r.Je.nn;
      const c = a.Je.nn;
      if (!n.Ji(r, 250) || r.Fi(a, r.$e + a.$e + 1)) {
        return;
      }
      const h = c.Qt(l);
      const p = c.angle(l);
      const d = o.angle(l);
      const u = o.angle(c);
      const m = o.Qt(c);
      const f = c.$t(p, h + r.$e + 7);
      const g = s.ma.Kc(f.x, f.y, 1);
      for (const t of g) {
        const e = s.fa.get(t);
        if (i.Ye(e)) {
          continue;
        }
        const r = e.Je.nn;
        const a = f.Qt(r);
        const o = n.$e * 1.3;
        if (e.$e + o >= a) {
          return;
        }
      }
      __p_vU9y_ast(this.Cc = c.$t(p, h + 250), e.moveTo = o.angle(this.Cc), t.Or = r, t.Lr = a);
      const y = r.$e * 3.2;
      if (getGlobal("P4jKmO").asin(y * 2 / (m * 2)) >= O(d, u)) {
        this.Cc = f;
        e.moveTo = o.angle(this.Cc);
      }
    }
  }
  class zn {
    Yu = "reverseInstakill";
    Wi;
    wm = null; // eGeVaS
    constructor(t) {
      this.Wi = t;
    }
    reset() {
      this.wm = null;
    } // eGeVaS
    eh() {
      const {
        myPlayer: t,
        Sc: n,
        ua: e,
        ModuleHandler: s,
        Dc: i
      } = this.Wi;
      if (!i.Iu) {
        this.reset();
        i.Gu();
        return; // eGeVaS
      }
      const r = n.Zr;
      if (r === null) {
        return;
      }
      const a = e.Sl(r, t);
      const o = t.Pa(0);
      const l = t.Ca(o, a);
      const c = t.Pa(1);
      if (c !== 10) {
        return;
      }
      if (l + t.Ca(c, a) + 25 < 100) {
        return;
      }
      const h = t.Je.nn;
      const p = r.Je.nn;
      const d = h.angle(p);
      if (this.wm !== null) {
        s.pm = 1;
        s.um = d;
        s.fm = 7;
        s.dm = 0;
        s.gm = 1;
        this.wm = null;
        i.Gu();
        n.Ra();
        return;
      }
      i.Ic = r;
      const {
        ld: u
      } = s.Hc;
      const m = u.fl(0);
      const f = u.fl(1);
      const g = u.fl(2);
      const y = ht.Oe(o).range + r.Ue;
      if (m && f && g && t.Ji(r, y)) {
        s.pm = 1;
        s.um = d;
        s.fm = 53;
        s.dm = 1;
        s.gm = 1;
        this.wm = r;
      }
    }
  }
  class Sn {
    Yu = "bowInsta";
    Wi;
    wm = null;
    vf = 0;
    Ec = 660;
    Nc = 700;
    active = 0;
    constructor(t) {
      this.Wi = t;
    }
    reset() {
      __p_vU9y_ast(this.wm = null, this.vf = 0, this.active = 0);
    }
    eh() {
      const {
        Sc: t,
        ModuleHandler: n,
        myPlayer: e,
        Dc: s
      } = this.Wi;
      if (!s.Iu) {
        this.reset();
        s.Gu();
        return;
      }
      const i = t.Zr;
      const r = this.wm || i;
      if (r === null) {
        this.reset();
        return;
      }
      const a = e.Je.nn;
      const o = r.Je.nn;
      const l = a.angle(o);
      const c = a.Qt(o);
      s.Ic = r;
      if (this.wm !== null) {
        if (this.vf === 2) {
          n.pm = 1;
          n.um = l;
          n.dm = 1;
          n.gm = 1;
          n.moveTo = null;
          n.upgradeItem(15);
          this.reset();
          s.Gu();
          return;
        } else if (this.vf === 1) {
          n.pm = 1;
          n.um = l;
          n.dm = 1;
          n.gm = 1;
          n.moveTo = null;
          n.upgradeItem(12);
          this.vf = 2;
          return;
        } else {
          return undefined;
        }
      }
      if (!Q(e.Wp, 6, 8) || e.cn < 9) {
        return;
      }
      this.active = 1;
      const {
        ld: h
      } = n.Hc;
      if (n.Qu(0, 53) && h.fl(2) && Q(c, this.Ec, this.Nc)) {
        n.moveTo = null;
        n.pm = 1;
        n.um = l;
        n.fm = 53;
        n.dm = 1;
        n.gm = 1;
        if (e.Wp === 6) { // SaVeGe
          n.upgradeItem(9);
        }
        if (e.Wp === 7) {
          n.upgradeItem(18, 1);
        }
        if (e.Wp === 8 && e.Pa(8) === 18) {
          n.Ba(8, l);
          n.Ba(8, l - _(90));
          n.Ba(8, l + _(90));
          n.Ba(8, V(l));
        }
        this.vf = 1;
        this.wm = i;
      }
    }
  }
  class Dn {
    Yu = "placementDefense";
    Wi;
    constructor(t) {
      this.Wi = t;
    }
    eh() {
      const {
        Sc: t,
        myPlayer: n,
        ModuleHandler: e,
        Va: s
      } = this.Wi;
      const i = t.Zr;
      if (i !== null && H._placementDefense && (t.Er || s.Xa >= n.ja)) {
        const t = n.Je.nn;
        const s = i.Je.nn;
        const r = t.angle(s);
        let a = 3;
        __p_vU9y_ast(n.sd(5) && (a = 5), e.Ba(a, r), e.Oa = 1, e.La[0] = a, e.La[1] = [r]);
      }
    }
  }
  class Cn {
    Yu = "turretSteal";
    Wi;
    constructor(t) {
      this.Wi = t;
    }
    eh() {
      const {
        ModuleHandler: t,
        myPlayer: n,
        Sc: e
      } = this.Wi;
      if (t.pm || !H._turretSteal) {
        return;
      }
      const s = e.ar;
      if (s === null || s.ja > 25 || !t.Qu(0, 53)) {
        return;
      }
      const i = n.Je.nn;
      const r = s.Je.nn;
      if (i.Qt(r) > 700) {
        return;
      }
      const {
        ld: a
      } = t.Hc;
      if (a.fl(2, 0)) {
        t.pm = 1;
        t.fm = 53;
      }
    }
  }
  class jn {
    Yu = "killChat";
    Wi;
    constructor(t) {
      this.Wi = t;
    }
    eh() {
      const {
        myPlayer: t,
        ci: n
      } = this.Wi;
      if (!H._killMessage || !t.Up || t.Lp.kills === 0) {
        return;
      }
      const e = (H._killMessageText || "").trim();
      if (e.length !== 0) {
        n.li(e);
      }
    }
  }
  class Hn {
    Yu = "swordKatanaInsta";
    Wi;
    Mm = null;
    km = 0;
    constructor(t) {
      this.Wi = t;
    }
    eh() {
      const {
        myPlayer: t,
        ModuleHandler: n,
        Sc: e
      } = this.Wi;
      const s = e.Zr;
      if (n.pm || !s) {
        this.Mm = null;
        this.km = 0;
        return;
      }
      const {
        ld: i
      } = n.Hc;
      const r = i.fl(0);
      const a = i.fl(2);
      if (this.km) {
        this.km = 0;
        if (a) {
          n.pm = 1;
          n.fm = 53;
        }
        return;
      }
      const o = t.Pa(0);
      const l = o === 3;
      const c = t.Je.nn;
      const h = this.Mm;
      if (h !== null) {
        const s = h.Je.nn;
        const i = c.angle(s);
        __p_vU9y_ast(n.um = i, n.fm = 7, n.dm = 0, n.gm = 1, t.Wp === 3 && n.upgradeItem(1, 1), t.Wp === 4 && n.upgradeItem(15, 1), t.Wp === 5 && n.upgradeItem(7, 1), t.Wp === 6 && n.upgradeItem(10), t.Wp === 7 && n.upgradeItem(22, 1), t.Wp === 8 && n.upgradeItem(4), this.Mm = null, n.Qu(0, 53) && (this.km = 1), e.Ra());
      }
      if (t.cn < 8 || !l || !r || !n.Qu(0, 7)) {
        return;
      }
      const p = ht.Oe(o).range + s.Ue;
      if (!t.Ji(s, p)) {
        return;
      }
      const d = s.Je.nn;
      const u = c.angle(d);
      __p_vU9y_ast(n.um = u, n.fm = 7, n.dm = 0, n.gm = 1, this.Mm = s);
    }
  }
  class In {
    Yu = "spikeGearInsta";
    Wi;
    constructor(t) {
      this.Wi = t;
    }
    eh() {
      const {
        ModuleHandler: t,
        Sc: n,
        myPlayer: e
      } = this.Wi;
      if (t.pm || n.qr() || n.Nr || !H._spikeGearInsta) {
        return;
      }
      const s = n.Zr;
      if (s === null || !t.Qu(0, 11) || !t.Qu(1, 21) || e.po !== 21 || s.variant.primary !== 0) {
        return;
      }
      const i = e.Je.nn;
      const r = s.Je.nn;
      const a = i.angle(r);
      const o = e.Pa(0);
      const l = s.va.primary;
      if (l === null) {
        return;
      }
      const c = ht.Oe(o).range + s.Ue;
      const h = ht.Oe(l).range + e.Ue;
      if (e.Ji(s, c) && s.Ji(e, h)) {
        t.fm = 11;
        if (s.ya === 7 && s.Pl(0) && e.ya === 11) {
          t.pm = 1;
          t.um = a;
          t.fm = 7;
          t.dm = 0;
          t.gm = 1;
        }
      }
    }
  }
  class Gn {
    Yu = "teammateSpikeTrap";
    Wi;
    constructor(t) {
      this.Wi = t;
    }
    eh() {
      const {
        ModuleHandler: t,
        Dc: n,
        ua: e,
        myPlayer: s,
        ci: i
      } = this.Wi;
      if (t.pm) {
        return;
      }
      if (!n.Iu) {
        n.Gu();
        return;
      }
      const r = e.Ad;
      if (!r) {
        return;
      }
      const a = s.Je.nn;
      const o = r.Je.nn;
      const l = a.Qt(o);
      const c = a.angle(o);
      if (l > 500) {
        return;
      }
      n.Ic = r;
      if (l > 175) {
        return;
      }
      const h = [c, c - _(90), c + _(90), c + _(180)];
      const p = s.Pa(4);
      const d = s.ad(a, p, c).Qt(a);
      t.La[0] = 4;
      t.La[1] = h;
      if (d >= l && h.every(t => {
        return s.rd(4, t);
      })) {
        __p_vU9y_ast(n.Gu(), i.mh());
        for (const n of h) {
          t.Ba(4, n);
        }
      }
    }
  }
  class En {
    Yu = "spikeTrap";
    Wi;
    constructor(t) {
      this.Wi = t;
    }
    eh() {
      const {
        ModuleHandler: t,
        myPlayer: n,
        Sc: e
      } = this.Wi;
      if (t.pm) {
        return;
      }
      const s = n.Pa(7);
      const i = e.Zr;
      if (!i || n.ha || s !== 16) {
        return;
      }
      const r = n.Je.nn;
      const a = i.Je.nn;
      const o = r.Qt(a);
      const l = r.angle(a);
      if (o > 175) {
        return;
      }
      const c = [l, l - _(90), l + _(90), l + _(180)];
      const h = n.Pa(4);
      const p = t.bs === 7 ? 30 : 0;
      const d = n.ad(r, h, l).Qt(r) + p;
      t.La[0] = 4;
      t.La[1] = c;
      if (d >= o) {
        for (const n of c) {
          t.Ba(4, n);
        }
      }
    }
  }
  class Nn {
    Yu = "turretSync";
    Wi;
    constructor(t) {
      this.Wi = t;
    }
    eh() {
      const {
        ModuleHandler: t,
        Sc: n,
        myPlayer: e
      } = this.Wi;
      if (t.pm || !H._turretSync) {
        return;
      }
      const s = n.Zr;
      if (s === null) {
        return;
      }
      const i = e.Pa(0);
      const r = ht.Oe(i);
      if (r.un < 20) {
        return;
      }
      const a = r.range + s.Ue;
      const {
        ld: o
      } = t.Hc;
      if (!e.Ji(s, a) || !o.fl(0) || s.fo !== e.Ma + 2) {
        return;
      }
      const l = e.Je.nn;
      const c = s.Je.nn;
      const h = l.angle(c);
      __p_vU9y_ast(t.pm = 1, t.um = h, t.fm = 7, t.dm = 0, t.gm = 1);
    }
  }
  const Rn = class {
    Wi;
    Hc = {};
    Tf;
    Pf;
    store = [{
      zf: new (getGlobal("pxsHd3"))(),
      Sf: null,
      nn: 0,
      Df: 0,
      Dd: -1,
      Im: 0
    }, {
      zf: new (getGlobal("pxsHd3"))(),
      Sf: null,
      nn: 0,
      Df: 0,
      Dd: -1,
      Im: 0
    }];
    wu = [new (getGlobal("tB9AKx"))(), new (getGlobal("tB9AKx"))()];
    Cf = new E(0, 0);
    jf = new E(0, 0);
    Di = new E(0, 0);
    Ci = 0;
    Ma = 0;
    Bm = 0;
    va;
    bs;
    zd;
    Zu;
    vd;
    Uu;
    $m;
    Hf;
    Pm;
    Oa;
    vm;
    If;
    _m;
    Vm = 0;
    pm = 0;
    um = null;
    Sm = null;
    Rm = null;
    dm = null;
    Am = null;
    fm = null;
    Um = 0;
    qm = null;
    Gf = null;
    currentAngle = 0;
    Vi = null;
    xf = null;
    moveTo = "disable";
    cf = "disable";
    Fu = 0;
    gm = 0;
    xd = {
      vd: 0
    };
    La = [null, []];
    constructor(t) {
      __p_vU9y_ast(this.Wi = t, this.Hc = {
        Pd: new Xt(t),
        Ef: new Vt(t),
        Nf: new At(t),
        Rf: new wn(t),
        Bf: new Mn(t),
        Of: new yn(t),
        ld: new on(t),
        Lf: new gn(t),
        _f: new Ft(t),
        Kf: new tn(t),
        Xf: new qt(t),
        Vf: new nn(t),
        Af: new $t(t),
        Wf: new Ut(t),
        Zf: new Qt(t),
        Ff: new Jt(t),
        jc: new Pn(t),
        Oc: new sn(t),
        Yf: new En(t),
        Jf: new Gn(t),
        Uf: new Nn(t),
        Qf: new en(t),
        $f: new Hn(t),
        Gc: new Sn(t),
        qf: new Yt(t),
        tg: new zn(t),
        ng: new Wt(t),
        eg: new Tn(t),
        sg: new Cn(t),
        ig: new In(t),
        rg: new dn(t),
        ag: new pn(t),
        og: new hn(t),
        lg: new un(t),
        cg: new mn(t),
        wd: new kn(t),
        hg: new bn(t),
        pg: new Dn(t),
        dg: new Zt(t),
        ug: new rn(t),
        bf: new vn(t),
        mg: new xn(t),
        fg: new an(t),
        gg: new fn(t),
        yg: new cn(t),
        xh: new ln(t),
        bg: new jn(t)
      }, this.Tf = [this.Hc.Pd, this.Hc.Nf, this.Hc.Ef], this.Pf = [this.Hc.Rf, this.Hc.Bf, this.Hc.Of, this.Hc.ld, this.Hc.Lf, this.Hc._f, this.Hc.Kf, this.Hc.Xf, this.Hc.Vf, this.Hc.Af, this.Hc.Zf, this.Hc.Wf, this.Hc.Ff, this.Hc.jc, this.Hc.Oc, this.Hc.Yf, this.Hc.Jf, this.Hc.Uf, this.Hc.Qf, this.Hc.$f, this.Hc.Gc, this.Hc.qf, this.Hc.tg, this.Hc.ng, this.Hc.eg, this.Hc.sg, this.Hc.ig, this.Hc.rg, this.Hc.ag, this.Hc.og, this.Hc.lg, this.Hc.cg, this.Hc.wd, this.Hc.hg, this.Hc.pg, this.Hc.dg, this.Hc.ug, this.Hc.bf, this.Hc.mg, this.Hc.fg, this.Hc.gg, this.Hc.yg, this.Hc.xh, this.Hc.bg], this.reset());
    }
    kg() {
      __p_vU9y_ast(this.Bm = 0, this.va = 0, this.bs = null, this.zd = 0, this.Zu = 0, this.Vi = null, this.xf = null);
    }
    reset() {
      const {
        Ua: t,
        zp: n
      } = this.Wi;
      __p_vU9y_ast(this.kg(), this.Hm().zf.clear(), this.ef().zf.clear(), this.vd = 0, this.Uu = 0, this.$m = 0, this.Hf = 0, this.Pm = 0, this.Oa = 0, this.vm = 0, this.If = 0, this._m = 0, this.Vm = 0, this.Fu = 0);
      for (const t of this.Pf) {
        if ("reset" in t) {
          t.reset();
        }
      }
      if (t) {
        for (const t of n) {
          __p_vU9y_ast(t.ModuleHandler.kg(), t.ModuleHandler.Wu(0));
        }
      }
    }
    get wg() {
      return this.Bm <= 1;
    }
    get rf() {
      return this.Vi !== null;
    }
    Mg(t) {
      if (this.fm === null || t === null) {
        this.fm = t;
      }
    }
    Hm() {
      return this.store[0];
    }
    ef() {
      return this.store[1];
    }
    xg(t, n) {
      this.Cf.setXY(t, n);
    }
    vg(t, n) {
      this.jf.setXY(t, n);
    }
    Tg(t) {
      if (this.vd < t) {
        this.vd = t;
      }
    }
    upgradeItem(t, n = 0) {
      if (n) {
        t += 16;
      }
      this.Wi.ci.upgradeItem(t);
      this.Wi.myPlayer.upgradeItem(t);
      if (ht.Le(t)) {
        const n = ht.Oe(t).type;
        const {
          ld: e
        } = this.Hc;
        e.nl(n);
      }
    }
    Vu(t = this.Vi, n = 0) {
      if (!n && (this.Vi = t, this.xf = t === null ? null : V(t), this.moveTo !== "disable")) {
        return;
      }
      const {
        Sc: e
      } = this.Wi;
      const {
        hg: s
      } = this.Hc;
      if (s.lf(t, 45, e.nr) || s.lf(t, 45, e.er)) {
        return 0;
      } else {
        this.Wi.ci.move(t);
        return 1;
      }
    }
    rm() {
      this.Wi.ci.gh();
    }
    Ou(t) {
      this.bs = t;
    }
    Qu(t, n) {
      if (n === -1) {
        return 0;
      }
      const e = ht.Ne(t)[n].oe;
      return this.wu[t].has(n) || this.Wi.myPlayer._p >= e && this.Wi.myPlayer.td;
    }
    buy(t, n, e = 0) {
      const s = ht.Ne(t);
      const {
        Ua: i,
        zp: r,
        myPlayer: a,
        ci: o
      } = this.Wi;
      if (!a.Li) {
        return 0;
      }
      if (e && i) {
        for (const s of r) {
          s.ModuleHandler.buy(t, n, e);
        }
      }
      const l = s[n].oe;
      const c = this.wu[t];
      if (l === 0) {
        c.add(n);
        return 1;
      } else if (c.has(n) || a._p < l || !a.td && !e) {
        return c.has(n);
      } else {
        o.buy(t, n);
        a._p -= l;
        return 0;
      }
    }
    equip(t, n, e = 0, s = 0) {
      const i = this.store[t];
      const {
        myPlayer: r,
        ci: a,
        Sc: o,
        Ua: l,
        zp: c
      } = this.Wi;
      if (s && i.Im === n && n !== 0) {
        n = 0;
      }
      if (!r.Li || !this.buy(t, n, e)) {
        return 0;
      }
      if (i.Im === n && r.co[t] === n) {
        return 0;
      }
      i.Im = n;
      a.equip(t, n);
      if (t === 0) {
        this.Uu = 1;
      } else {
        this.$m = 1;
      }
      if (e && (i.Dd = n, l)) {
        for (const e of c) {
          e.ModuleHandler.Hc.Pd.Sd(t, n);
        }
      }
      const h = o.ar;
      const p = this.Hc.ld;
      if (h !== null && p.fl(2) && t === 0 && n === 53) {
        p.Gm(2);
      }
      return 1;
    }
    xh(t, n = 0) {
      if (n || t !== this.xd.vd) {
        this.xd.vd = t;
        this.Tg(3);
        this.Wi.ci.xh(t);
      }
    }
    Lm(t) {
      const {
        myPlayer: n
      } = this.Wi;
      const e = n.Pa(t);
      __p_vU9y_ast(n.io !== -1 && (n.io = -1, this.Om()), this.Wi.ci.wh(e, 0), this.Bm = t);
    }
    attack(t, n = 2) {
      __p_vU9y_ast(t !== null && (this.xd.vd = t), this.Tg(n), this.Wi.ci.attack(t), this.wg && (this._m = 1));
    }
    fh() {
      this.Wi.ci.fh();
    }
    Wu(t = !this.Fu) {
      __p_vU9y_ast(this.Fu = t, this.zd = t ? 1 : 0);
    }
    Om(t = this.va) {
      const n = this.Wi.myPlayer.Pa(t);
      if (n !== null) {
        this.Bm = t;
        this.va = t;
        this.Wi.ci.wh(n, 1);
      }
    }
    Ba(t, n = this.currentAngle) {
      __p_vU9y_ast(this.If += 1, this.Lm(t), this.attack(n, 1), this.Om());
    }
    Tm() {
      __p_vU9y_ast(this.Lm(2), this.attack(null, 1), this.Om());
    }
    tm = 0;
    Pg = 65;
    zg = null;
    eh() {
      if (H._circleRotation && this.Vi === null) {
        const t = this.Pg / H._circleRadius;
        this.tm = (this.tm + t) % (getGlobal("P4jKmO").PI * 2);
      }
      const {
        Ua: t
      } = this.Wi;
      this.La[0] = null;
      this.La[1].length = 0;
      this.zg = null;
      this.Ma += 1;
      this.vd = 0;
      this.Uu = 0;
      this.$m = 0;
      this.Pm = 0;
      this.Oa = 0;
      this.vm = 0;
      this.If = 0;
      this._m = 0;
      this.Vm = 0;
      this.pm = 0;
      this.Sm = null;
      this.Rm = null;
      this.dm = null;
      this.Am = null;
      this.fm = null;
      this.Um = 0;
      this.qm = null;
      this.um = null;
      this.gm = 0;
      this.cf = this.moveTo;
      this.moveTo = "disable";
      if (!t) {
        for (const t of this.Tf) {
          t.eh();
        }
      }
      for (const t of this.Pf) {
        const n = this.pm;
        __p_vU9y_ast(t.eh(), !n && this.pm && (this.zg = t.Yu));
      }
      __p_vU9y_ast(this.Zu = this.zd, t && (this.Wi.Dc.eh(), ft.fi(this.Pm), ft.gi(this.If), ft.ki(this.zg + ", " + this.Ma), ft.Pi("" + this.store[0].Im + ",  " + this.Um)));
    }
  };
  const Bn = class {
    id = -1;
    wp = 0;
    Fd = null;
    owner;
    kl;
    Ur;
    ua;
    Va;
    ku;
    Sc;
    ModuleHandler;
    myPlayer;
    ci;
    Dc;
    Rp;
    Ri = new (getGlobal("tB9AKx"))();
    Sp = new (getGlobal("tB9AKx"))();
    zp = new (getGlobal("tB9AKx"))();
    constructor(t) {
      __p_vU9y_ast(this.owner = t || this, this.kl = new Lt(this), this.Ur = new Ht(this), this.ua = new Rt(this), this.Va = new Bt(this), this.ku = new bt(this), this.Sc = new yt(this), this.ModuleHandler = new Rn(this), this.myPlayer = new Nt(this), this.ci = new It(this), this.Dc = new Kt(this), this.Rp = new _t(this));
    } // eGeVaS
    nm(t) {
      return [...this.zp].indexOf(t);
    }
    get Ua() {
      return this.owner === this;
    }
    $d(t) {
      return this.Sp.has(t);
    }
    disconnect() {
      const t = this.kl.oh;
      if (t !== null) {
        t.close();
      }
    }
    Sg() {
      for (const t of this.zp) {
        t.disconnect(); // eGeVaS
      }
    } // eGeVaS
    Mh() {
      this.myPlayer.Mh();
    }
  };
  const On = new class {
    Dg = new (getGlobal("tB9AKx"))();
    start = getGlobal("hmUPOQ").now();
    add(t) {
      this.Dg.add(t);
    }
    update(t) {
      const n = getGlobal("hmUPOQ").now();
      const e = n - this.start;
      this.start = n;
      const s = An.myPlayer.offset;
      for (const n of this.Dg) {
        __p_vU9y_ast(n.update(e), t.save(), t.translate(n.Cg.x - s.x, n.Cg.y - s.y), t.rotate(n.rotation), t.globalAlpha = n.opacity, t.strokeStyle = "#525252", Zn.hooks.renderPlayer({
          weaponIndex: n.va,
          buildIndex: -1,
          tailIndex: n.jg,
          skinIndex: n.ya,
          weaponVariant: n.variant,
          skinColor: n.skinColor,
          scale: 35
        }, t), t.restore(), n.Hg() && this.Dg.delete(n));
      }
    }
  }();
  const Ln = new class {
    Ig(t, n, e) {
      if (!H._itemHealthBar || !e.us || !e.Fe) {
        return 0;
      }
      const {
        health: s,
        maxHealth: i,
        angle: r
      } = e;
      const a = s / i;
      const o = H._itemHealthBarColor;
      return Mt.tc(t, n, a, r, o);
    }
    Gg(t, n, e, s) {
      if (e.type === 17 && H._objectTurretReloadBar) {
        const {
          reload: i,
          ls: r,
          angle: a
        } = e;
        const o = i / r;
        const l = H._objectTurretReloadBarColor;
        Mt.tc(t, n, o, a, l, s);
      }
    }
    Eg(t) {
      if (it[t.id].itemType === 5) {
        t.turnSpeed = 0;
      }
    }
    Ng(t, n, e) {
      const s = n.x + n.xWiggle;
      const i = n.y + n.yWiggle;
      __p_vU9y_ast(H._collisionHitbox && (Mt.Gl(t, s, i, e.$e, "#c7fff2", 0.5, 1), Mt.rect(t, new E(s, i), e.$e, "#ecffbd", 1, 0.5)), H._weaponHitbox && Mt.Gl(t, s, i, e.Ue, "#3f4ec4", 0.5, 1), H._placementHitbox && Mt.Gl(t, s, i, e.qe, "#73b9ba", 0.5, 1));
      const r = An.Sc.ir;
      if (r === e) {
        const n = r.scale * 0.3;
        Mt.El(t, s, i, n, "#bf3d59", 0.6);
      }
      if (e instanceof ut && e.hs) {
        Mt.El(t, s, i, 10, "#f88a41ff", 0.3);
      }
    }
    render(t) {
      if (Mt.renderObjects.length === 0) {
        return;
      }
      const {
        Ur: n,
        ModuleHandler: e,
        myPlayer: s
      } = An;
      for (const e of Mt.renderObjects) {
        const s = n.fa.get(e.sid);
        if (s !== undefined) {
          Mt.Al(t, e);
          if (s instanceof ut) {
            const n = this.Ig(t, e, s);
            __p_vU9y_ast(this.Gg(t, e, s, n), this.Eg(e));
          }
          this.Ng(t, e, s);
        }
      }
      Mt.renderObjects.length = 0;
    }
    Rg = 940;
    Bg = new E(14400, 14400).sub(this.Rg);
    preRender(t) {
      Mt.rect(t, this.Bg, this.Rg, "red", 1, 0.5);
      if (An.myPlayer.Vp) {
        const {
          x: n,
          y: e
        } = An.myPlayer.Kp;
        Mt.Bl(t, n, e, 50, 15, "#cc5151");
      }
      On.update(t);
    }
  }();
  const _n = 0;
  const Kn = _n ? "12.X" : "SnorlaX Mode";
  const Xn = getGlobal("q5RfA7D").head === null;
  __p_vU9y_ast(Xn || T.warn("SnorlaX Client loading warning! It is generally recommended to use faster injection mode."), T.test("SnorlaX Client initialization.."));
  const Vn = w.M();
  const An = new Bn();
  getGlobal("yaVoVt").WebSocket = new (getGlobal("yaVoVt").Proxy)(getGlobal("yaVoVt").WebSocket, {
    construct(t, n) {
      const e = new t(...n);
      T.test("Found socket! Socket initialization..");
      An.kl.init(e);
      getGlobal("yaVoVt").WebSocket = t;
      return e;
    }
  });
  const Wn = getGlobal("yaVoVt");
  const Zn = {
    myClient: An,
    settings: H,
    Renderer: Mt,
    Og: ht,
    ZoomHandler: tt,
    hooks: {
      EntityRenderer: Pt,
      ObjectRenderer: Ln,
      renderPlayer() {},
      showText() {}
    },
    version: Kn,
    hash: "rw7D3J5249V1GK8",
    config: {},
    gameInit(t) {},
    async zi() {
      this.gameInit(await Vn);
    }
  };
  __p_vU9y_ast(Wn.Glotus = Zn, (t => {
    const n = t => {
      __p_vU9y_ast(t.addEventListener("beforescriptexecute", t => {
        t.preventDefault();
      }, {
        once: 1
      }), t.remove());
    };
    let e = null;
    const s = s => {
      const i = s instanceof getGlobal("cJ0jbDL");
      __p_vU9y_ast(i && new (getGlobal("wgorjqz"))("(assets.+\\.js$|index.+\\.js$)", "").test(s.src) && e === null && (e = s, (() => {
        try {
          console.log("SnorlaX: intercept bundl- SnorlaX is the goat", s.src, "type=", s.type || "(classic)");
        } catch (_) {}
      })(), T.test("SnorlaX mod on top"), n(s), S.init(s)));
    };
    __p_vU9y_ast(new (getGlobal("GUpot3"))(t => {
      for (const n of t) {
        if (n.type === "childList") {
          for (const t of n.addedNodes) {
            if (t instanceof getGlobal("cJ0jbDL") || t instanceof getGlobal("qFxzi8")) {
              s(t);
            }
          }
        } else if (n.type === "attributes") {
          const t = n.target;
          if (t instanceof getGlobal("cJ0jbDL") || t instanceof getGlobal("qFxzi8")) {
            s(t);
          }
        }
      }
    }).observe(getGlobal("q5RfA7D"), {
      childList: 1,
      subtree: 1,
      attributes: 1,
      attributeFilter: ["src", "href"]
    }), getGlobal("q5RfA7D").querySelectorAll("script").forEach(s), getGlobal("q5RfA7D").querySelectorAll("link").forEach(s));
    const i = t => {
      return new (getGlobal("tSAIqe"))(n => {
        n(t);
      });
    };
    const r = getGlobal("yaVoVt");
    if (!t) {
      const t = r.customElements.define;
      __p_vU9y_ast(r.customElements.define = () => {
        r.customElements.define = t;
      }, r.requestAnimFrame = () => {
        __p_vU9y_ast(delete r.requestAnimFrame, e !== null && S.init(e));
      }, x(r, "requestAnimFrame"));
    }
    const a = getGlobal("yaVoVt").fetch;
    __p_vU9y_ast(getGlobal("yaVoVt").fetch = new (getGlobal("XTNMRo"))(a, {
      apply(t, n, e) {
        const s = e[0];
        if (typeof s == "string" && new (getGlobal("wgorjqz"))("ping", "").test(s)) {
          return i();
        } else {
          return t.apply(n, e);
        }
      }
    }), P.set("moofoll", 1), P.get("skin_color") === null && P.set("skin_color", "toString"), getGlobal("yaVoVt").addEventListener = new (getGlobal("XTNMRo"))(getGlobal("yaVoVt").addEventListener, {
      apply: (n, e, s) => {
        if (["keydown", "keyup"].includes(s[0]) && s[2] === undefined) {
          if (s[0] === "keyup" && t) {
            getGlobal("yaVoVt").addEventListener = n;
          }
          return null;
        } else {
          return n.apply(e, s);
        }
      }
    }));
    const o = getGlobal("itA7LX").prototype;
    __p_vU9y_ast(o.addEventListener = new (getGlobal("XTNMRo"))(o.addEventListener, {
      apply: (n, e, s) => {
        if (e.id === "touch-controls-fullscreen" && new (getGlobal("wgorjqz"))("^mouse", "").test(s[0]) && s[2] == 0) {
          if (new (getGlobal("wgorjqz"))("up$", "").test(s[0]) && t) {
            o.addEventListener = n;
          }
          return null;
        } else {
          return n.apply(e, s);
        }
      }
    }), getGlobal("yaVoVt").setInterval = new (getGlobal("XTNMRo"))(getGlobal("yaVoVt").setInterval, {
      apply: (n, e, s) => {
        if (new (getGlobal("wgorjqz"))("cordova", "").test(s[0].toString()) && s[1] === 1000) {
          if (t) {
            getGlobal("yaVoVt").setInterval = n;
          }
          return null;
        } else {
          return n.apply(e, s);
        }
      }
    }));
    const l = (t, n) => {
      delete t[n];
    };
    __p_vU9y_ast(v.v(getGlobal("yaVoVt"), "config", (n, e) => {
      l(n, "openLink");
      l(n, "aJoinReq");
      l(n, "follmoo");
      l(n, "kickFromClan");
      l(n, "sendJoin");
      l(n, "leaveAlliance");
      l(n, "createAlliance");
      l(n, "storeBuy");
      l(n, "storeEquip");
      l(n, "showItemInfo");
      l(n, "selectSkinColor");
      l(n, "config");
      l(n, "captchaCallbackHook");
      l(n, "showPreAd");
      l(n, "setUsingTouch");
      n.addEventListener("blur", n.onblur);
      l(n, "onblur");
      n.addEventListener("focus", n.onfocus);
      l(n, "onfocus");
      Zn.config = e;
      return t;
    }), v.v(getGlobal("YfRrq0").prototype, "initialBufferSize", t => {
      An.ci.ih = t;
      return 1;
    }), v.v(getGlobal("YfRrq0").prototype, "maxExtLength", t => {
      An.ci.rh = t;
      return 1;
    }));
    const c = {
      ["./img/hats/hat_12.png"]: "https://i.postimg.cc/BQPfhPwD/Booster-V2.png",
      ["./img/hats/hat_23.png"]: "https://i.postimg.cc/WpHP6wST/Anti-Venom-Gear.png",
      ["./img/hats/hat_6.png"]: "https://i.postimg.cc/662BPP8y/Soldier-Helmet.png",
      ["./img/hats/hat_15.png"]: "https://i.postimg.cc/pXKRWnYv/Winter-Cap.png",
      ["./img/hats/hat_7.png"]: "https://i.postimg.cc/zGnZNZNG/Bull-Helmet-V2.png",
      ["./img/hats/hat_58.png"]: "https://i.postimg.cc/B67RpJTM/Bushido-Armor.png",
      ["./img/hats/hat_8.png"]: "https://i.postimg.cc/XJYT9rCr/Bummel-Hat.png",
      ["./img/hats/hat_5.png"]: "https://i.postimg.cc/hvJ63NMg/Cowboy-Hat.png",
      ["./img/hats/hat_50.png"]: "https://i.postimg.cc/y8h55mhJ/Honeycrisp-Hat.png",
      ["./img/hats/hat_18.png"]: "https://i.postimg.cc/RhjyrGbt/Explorer-Hat-V2.png",
      ["./img/hats/hat_27.png"]: "https://i.postimg.cc/mkFpSC2g/Scavenger-Gear.png",
      ["./img/hats/hat_26.png"]: "https://i.postimg.cc/t40Q8RLc/Barbarian-Armor.png",
      ["./img/hats/hat_20.png"]: "https://i.postimg.cc/Dmkjp08d/Samurai-Hat.png",
      ["./img/hats/hat_22.png"]: "https://i.postimg.cc/5t3hHB6c/Emp-Helmet.png",
      ["./img/hats/hat_13.png"]: "https://i.postimg.cc/BvqyGjNm/Medic-Gear-V2.png",
      ["./img/hats/hat_9.png"]: "https://i.postimg.cc/g0N7cGTm/Miner.png",
      ["./img/hats/hat_4.png"]: "https://i.postimg.cc/Tw14pBzm/Ranger-Hat.png",
      ["./img/hats/hat_31.png"]: "https://i.postimg.cc/2SNM2cWR/Flipper-Hat.png",
      ["./img/hats/hat_1.png"]: "https://i.postimg.cc/fWF60TTb/Fiddler-Hat.png",
      ["./img/hats/hat_11.png"]: "https://i.postimg.cc/7PFqrNzX/Spike-V2.png",
      ["./img/hats/hat_11_p.png"]: "https://i.postimg.cc/7PFqrNzX/Spike-V2.png",
      ["./img/hats/hat_11_top.png"]: ""
    };
    if (H._texturepack) {
      const t = getGlobal("YfRrq0").getOwnPropertyDescriptor(getGlobal("b4XTua").prototype, "src");
      getGlobal("YfRrq0").defineProperty(getGlobal("b4XTua").prototype, "src", {
        get() {
          return t.get?.call(this);
        },
        set(n) {
          if (n in c) {
            n = c[n];
          }
          if (n !== "") {
            return t.set?.call(this, n);
          }
        },
        configurable: 1
      });
    }
  })(Xn));
  const Fn = () => {
    __p_vU9y_ast(T.test("SnorlaX mod initialization..."), An.Dc.init(), ft.init(), Et.init(), mt.init());
  };
  const FnOnce = (() => {
    let ran = false;
    let attempts = 0;
    let warned = false;
    const maxAttempts = 200;
    const retryDelayMs = 50;
    return () => {
      if (ran) {
        return;
      }
      attempts++;
      try {
        const result = Fn();
        ran = true;
        return result;
      } catch (e) {
        if (!warned) {
          warned = true;
        }
        if (attempts < maxAttempts) {
          setTimeout(() => {
            try {
              FnOnce();
            } catch (_) {}
          }, retryDelayMs);
        }
      }
    };
  })();
  __p_vU9y_ast(getGlobal("yaVoVt").addEventListener("DOMContentLoaded", FnOnce), getGlobal("yaVoVt").addEventListener("load", FnOnce), getGlobal("q5RfA7D").readyState !== "loading" && FnOnce());
  const Yn = () => { // SaVeGe
    T.test("SnorlaX is cool");
    const {
      Ys: t
    } = ft.vs();
    t.classList.remove("disabled");
    try {
      ft.load();
    } catch (_) {}
  };
  __p_vU9y_ast(getGlobal("yaVoVt").addEventListener("load", Yn), getGlobal("yaVoVt").addEventListener("DOMContentLoaded", Yn), getGlobal("q5RfA7D").readyState !== "loading" && Yn());
})(getGlobal("yaVoVt"), GM_info = this.Lg || getGlobal("yaVoVt").Lg || typeof GM_info != "undefined" ? GM_info : undefined);