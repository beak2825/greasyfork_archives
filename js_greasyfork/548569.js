// ==UserScript==
// @name         国立アイヌ民族博物館アイヌ語アーカイブの辞書の強化
// @namespace    https://lit.link/toracatman
// @version      2026-01-15
// @description  国立アイヌ民族博物館アイヌ語アーカイブの 辞書の 機能を 強化します。
// @author       トラネコマン
// @match        https://ainugo.nam.go.jp/dic*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548569/%E5%9B%BD%E7%AB%8B%E3%82%A2%E3%82%A4%E3%83%8C%E6%B0%91%E6%97%8F%E5%8D%9A%E7%89%A9%E9%A4%A8%E3%82%A2%E3%82%A4%E3%83%8C%E8%AA%9E%E3%82%A2%E3%83%BC%E3%82%AB%E3%82%A4%E3%83%96%E3%81%AE%E8%BE%9E%E6%9B%B8%E3%81%AE%E5%BC%B7%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/548569/%E5%9B%BD%E7%AB%8B%E3%82%A2%E3%82%A4%E3%83%8C%E6%B0%91%E6%97%8F%E5%8D%9A%E7%89%A9%E9%A4%A8%E3%82%A2%E3%82%A4%E3%83%8C%E8%AA%9E%E3%82%A2%E3%83%BC%E3%82%AB%E3%82%A4%E3%83%96%E3%81%AE%E8%BE%9E%E6%9B%B8%E3%81%AE%E5%BC%B7%E5%8C%96.meta.js
// ==/UserScript==

let css = `
@font-face {
	font-family: "Mkana+";
	src: local("Mkana+"),
	     url("https://toracatman.github.io/fonts/mkanaplus.woff2") format("woff2"),
	     url("https://toracatman.github.io/fonts/mkanaplus.woff") format("woff");
	font-display:swap;
}
label {
	font-weight: normal;
}
dd {
	white-space:pre-line;
}
.newkana {
	font-family: "Mkana+";
}
.js-modal {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	font-size: 0;
	text-align: center;
	background-color: rgba(0, 0, 0, 0.5);
	padding: 12px;
	overflow: auto;
	opacity: 0;
	visibility: hidden;
	transition: all .2s ease 0s;
}
.js-modal:before {
	content: "";
	display: inline-block;
	vertical-align: middle;
	height: 100%;
}
.js-modal.is-active {
	opacity: 1;
	visibility: visible;
}
.js-modal-container {
	position: relative;
	display: inline-block;
	vertical-align: middle;
	max-width: 600px;
}
.js-modal-close {
	position: absolute;
	display: flex;
	justify-content: center;
	align-items: center;
	top: -12px;
	right: -12px;
	width: 24px;
	height: 24px;
	border-radius: 12px;
	background-color: #000;
	color: #fff;
	cursor: pointer;
}
.js-modal-content {
	background-color: #fff;
	color: #000;
	font-size: 14px;
	text-align: left;
	padding: 12px;
}
th {
	text-align: center;
}
th,td {
	padding: 0 0.2em;
}
.float {
	float: left;
	margin-left: 10px;
}
.float:first-child {
	margin-left: 0;
}
.float-wrapper:after {
	content: "";
	display: block;
	clear: both;
}
`;
let css_phone = `
footer {
	position: static;
}
`;

let c = {
    "roman": {
        n: "ローマ字",
        t: `
		アイヌ語のローマ字表記の方式はほぼ1種類ですが、「ッ」が「t」か子音の連続かのように、アイヌ語の音韻体系に合わない表記からの変換後の文字がはっきりしない場合、当ユーザースクリプトは曖昧表記をします。<br>
		これらは後で人の手で直すことを想定した仮表記なので、普段アイヌ語を書くときには使いません。
		<table border="1">
			<tr><th>変換前</th><th>可能性</th><th>曖昧表記</th></tr>
			<tr><td>ッ（語中）</td><td>t、子音の連続</td><td>ƭ</td></tr>
			<tr><td>ン（パ行、マ行の前）</td><td>n、m</td><td>ƞ</td></tr>
			<tr><td>イ（語中語尾）</td><td>i、y</td><td>ĭ</td></tr>
			<tr><td>ウ（語中語尾）</td><td>u、w</td><td>ŭ</td></tr>
		</table>
		「m、p」の前の「n、m」は書き手によって次のように書かれます。
		<ol>
			<li>すべて「n」（出典：田村）</li>
			<li>語源に合わせる、わからないものは「n」</li>
			<li>語源に合わせる、わからないものは「m」（出典：萱野）</li>
			<li>すべて「m」（出典：知里）</li>
		</ol>
		推奨されるのは3です。3を基準にすると、1、2の「n」は「m」、4の「m」は「n」の可能性があるので、当ユーザースクリプトはこれらを曖昧表記「ƞ」に変換します。
	`
    },
    "katakana": {
        n: "カタカナ",
        c: [
            ["á", "a"], ["í", "i"], ["ú", "u"], ["é", "e"], ["ó", "o"], ["ń", "n"],
            [", ?", "、"], ["\\. ?", "。"], ["! ?", "！"], ["\\? ?", "？"],
            [" ?“", "「"], ["” ?", "」"],
            ["(?<=[a-z])-(?=[a-z])", "・"], ["(?<=[a-z])=|=(?=[a-z])", "゠"],
            ["ih", "iㇶ"], ["uh", "uㇷ"], ["eh", "eㇸ"], ["oh", "oㇹ"], ["h", "ㇵ"],
            ["ar", "aㇻ"], ["ir", "iㇼ"], ["er", "eㇾ"], ["or", "oㇿ"], ["r", "ㇽ"],
            ["[ㇵ-ㇹ]a", "ハ"], ["[ㇵ-ㇹ]i", "ヒ"], ["[ㇵ-ㇹ]u", "フ"], ["[ㇵ-ㇹ]e", "ヘ"], ["[ㇵ-ㇹ]o", "ホ"],
            ["[ㇻ-ㇿ]a", "ラ"], ["[ㇻ-ㇿ]i", "リ"], ["[ㇻ-ㇿ]u", "ル"], ["[ㇻ-ㇿ]e", "レ"], ["[ㇻ-ㇿ]o", "ロ"],
            ["ka", "カ"], ["ki", "キ"], ["ku", "ク"], ["ke", "ケ"], ["ko", "コ"], ["k", "ㇰ"],
            ["ga", "ガ"], ["gi", "ギ"], ["gu", "グ"], ["ge", "ゲ"], ["go", "ゴ"], ["g", "ㇰ゙"],
            ["sa", "サ"], ["si", "シ"], ["su", "ス"], ["se", "セ"], ["so", "ソ"], ["s", "ㇱ"],
            ["za", "ザ"], ["zi", "ジ"], ["zu", "ズ"], ["ze", "ゼ"], ["zo", "ゾ"], ["z", "ㇱ゙"],
            ["ca", ""], ["ci", "チ"], ["cu", ""], ["ce", ""], ["co", ""], ["c", "𛅚"],
            ["ta", "タ"], ["ti", ""], ["tu", ""], ["te", "テ"], ["to", "ト"], ["t", "ㇳ"],
            ["na", "ナ"], ["ni", "ニ"], ["nu", "ヌ"], ["ne", "ネ"], ["no", "ノ"], ["n(?=゠[aiueo])", "ㇴ"], ["n", "ン"],
            ["pa", "パ"], ["pi", "ピ"], ["pu", "プ"], ["pe", "ペ"], ["po", "ポ"], ["p", ""],
            ["ma", "マ"], ["mi", "ミ"], ["mu", "ム"], ["me", "メ"], ["mo", "モ"], ["m", "ㇺ"],
            ["ya", "ヤ"], ["yi", "𛄠"], ["yu", "ユ"], ["ye", "𛄡"], ["yo", "ヨ"], ["y", ""],
            ["wa", "ワ"], ["wi", "ヰ"], ["wu", "𛄢"], ["we", "ヱ"], ["wo", "ヲ"], ["w", ""],
            ["a", "ア"],  ["i", "イ"],  ["u", "ウ"],  ["e", "エ"],  ["o", "オ"],
            ["ĭ", "イ"], ["ŭ", "ウ"], ["ƞ", "𛅧"], ["ƭ", "ッ"],
            ["['ʼ]", ""]
        ],
        f: "ig",
        m: true,
        t: `
		アイヌ語の音韻体系に合わせたカタカナ表記。<br>
		現代の日本語で使わないカタカナも使います。
		<table border="1" class="newkana">
			<tr><th></th><th>a</th><th>i</th><th>u</th><th>e</th><th>o</th><th>-</th></tr>
			<tr><th>-</th><td>ア</td><td>イ</td><td>ウ</td><td>エ</td><td>オ</td><td></td></tr>
			<tr><th>k</th><td>カ</td><td>キ</td><td>ク</td><td>ケ</td><td>コ</td><td>ㇰ</td></tr>
			<tr><th>s</th><td>サ</td><td>シ</td><td>ス</td><td>セ</td><td>ソ</td><td>ㇱ</td></tr>
			<tr><th>t</th><td>タ</td><td></td><td></td><td>テ</td><td>ト</td><td>ㇳ</td></tr>
			<tr><th>c</th><td></td><td>チ</td><td></td><td></td><td></td><td>𛅚</td></tr>
			<tr><th>n</th><td>ナ</td><td>ニ</td><td>ヌ</td><td>ネ</td><td>ノ</td><td>ン、ㇴ※1</td></tr>
			<tr><th>h</th><td>ハ</td><td>ヒ</td><td>フ</td><td>ヘ</td><td>ホ</td><td>ㇵ、ㇶ、ㇷ、ㇸ、ㇹ</td></tr>
			<tr><th>p</th><td>パ</td><td>ピ</td><td>プ</td><td>ペ</td><td>ポ</td><td></td></tr>
			<tr><th>m</th><td>マ</td><td>ミ</td><td>ム</td><td>メ</td><td>モ</td><td>ㇺ</td></tr>
			<tr><th>y</th><td>ヤ</td><td>𛄠</td><td>ユ</td><td>𛄡</td><td>ヨ</td><td>※2</td></tr>
			<tr><th>r</th><td>ラ</td><td>リ</td><td>ル</td><td>レ</td><td>ロ</td><td>ㇻ、ㇼ、ㇽ、ㇾ、ㇿ</td></tr>
			<tr><th>w</th><td>ワ</td><td>ヰ</td><td>𛄢</td><td>ヱ</td><td>ヲ</td><td>※2</td></tr>
		</table>
		※1: 「ン」は「゠」を挟んで「ア、イ、ウ、エ、オ」が続くときに「ㇴ」になります。<br>
		※2: 「<span class="newkana">、</span>」は独立の文字であることを示すために、下に点をつけます。<br>
		曖昧表記は目印として下アクサンテギュ「ˏ」を付けます。
		<table border="1" class="newkana">
			<tr><th>ローマ字</th><td>ƭ</td><td>ƞ</td><td>ĭ</td><td>ŭ</td></tr>
			<tr><th>カタカナ</th><td>ッ</td><td>𛅧</td><td>イ</td><td>ウ</td></tr>
		</table>
	`
    },
    "katakana-substitute": {
        n: "カタカナ（代用表記）",
        c: [
            ["á", "a"], ["í", "i"], ["ú", "u"], ["é", "e"], ["ó", "o"], ["ń", "n"],
            [", ?", "、"], ["\\. ?", "。"], ["! ?", "！"], ["\\? ?", "？"],
            [" ?“", "「"], ["” ?", "」"],
            ["(?<=[a-z])-(?=[a-z])", "・"], ["(?<=[a-z])=|=(?=[a-z])", "゠"],
            ["ih", "iㇶ"], ["uh", "uㇷ"], ["eh", "eㇸ"], ["oh", "oㇹ"], ["h", "ㇵ"],
            ["ar", "aㇻ"], ["ir", "iㇼ"], ["er", "eㇾ"], ["or", "oㇿ"], ["r", "ㇽ"],
            ["[ㇵ-ㇹ]a", "ハ"], ["[ㇵ-ㇹ]i", "ヒ"], ["[ㇵ-ㇹ]u", "フ"], ["[ㇵ-ㇹ]e", "ヘ"], ["[ㇵ-ㇹ]o", "ホ"],
            ["[ㇻ-ㇿ]a", "ラ"], ["[ㇻ-ㇿ]i", "リ"], ["[ㇻ-ㇿ]u", "ル"], ["[ㇻ-ㇿ]e", "レ"], ["[ㇻ-ㇿ]o", "ロ"],
            ["ka", "カ"], ["ki", "キ"], ["ku", "ク"], ["ke", "ケ"], ["ko", "コ"], ["k", "ㇰ"],
            ["ga", "ガ"], ["gi", "ギ"], ["gu", "グ"], ["ge", "ゲ"], ["go", "ゴ"], ["g", "ㇰ゙"],
            ["sa", "サ"], ["si", "シ"], ["su", "ス"], ["se", "セ"], ["so", "ソ"], ["s", "ㇱ"],
            ["za", "ザ"], ["zi", "ジ"], ["zu", "ズ"], ["ze", "ゼ"], ["zo", "ゾ"], ["z", "ㇱ゙"],
            ["ca", "チｬ"], ["ci", "チ"], ["cu", "チｭ"], ["ce", "チｪ"], ["co", "チｮ"], ["c", "ﾁチ"],
            ["ta", "タ"], ["ti", "テｨ"], ["tu", "トｩ"], ["te", "テ"], ["to", "ト"], ["t", "ㇳ"],
            ["na", "ナ"], ["ni", "ニ"], ["nu", "ヌ"], ["ne", "ネ"], ["no", "ノ"], ["n(?=゠[aiueo])", "ㇴ"], ["n", "ン"],
            ["pa", "パ"], ["pi", "ピ"], ["pu", "プ"], ["pe", "ペ"], ["po", "ポ"], ["p", "ㇷ゚"],
            ["ma", "マ"], ["mi", "ミ"], ["mu", "ム"], ["me", "メ"], ["mo", "モ"], ["m", "ㇺ"],
            ["ya", "ヤ"], ["yi", "イｨ"], ["yu", "ユ"], ["ye", "イｪ"], ["yo", "ヨ"], ["y", "ィ‌̣"],
            ["wa", "ワ"], ["wi", "ヰ"], ["wu", "ウｩ"], ["we", "ヱ"], ["wo", "ヲ"], ["w", "ゥ‌̣"],
            ["a", "ア"],  ["i", "イ"],  ["u", "ウ"],  ["e", "エ"],  ["o", "オ"],
            ["ĭ", "イ‌̗"], ["ŭ", "ウ‌̗"], ["ƞ", "ﾁン‌̗"], ["ƭ", "ッ‌̗"],
            ["['ʼ]", ""]
        ],
        f: "ig",
        m: false,
        t: `
		カタカナ表記にはフォントによっては表示されない文字があり、どんな環境でも使えるわけではないので、半角カナを使った代用表記も用意しました。<br>
		半角カナを幅が狭いカタカナや小書きとして使うのではなく、代用表記の目印として使います。<br>
		「ﾁ」は次の文字が小書きであることを表し、小書きの半角カナは前の文字とセットで現代の日本語で使わないカタカナを表します。<br>
		読み手にこのことを確実に伝える場合、「※ﾁ●: 小書き」「※半角カナ付き: 代用表記」のように文章のどこかに注釈を入れれば伝わると思います。<br>
		<table border="1">
			<tr><th></th><th>a</th><th>i</th><th>u</th><th>e</th><th>o</th><th>-</th></tr>
			<tr><th>-</th><td>ア</td><td>イ</td><td>ウ</td><td>エ</td><td>オ</td><td></td></tr>
			<tr><th>k</th><td>カ</td><td>キ</td><td>ク</td><td>ケ</td><td>コ</td><td>ㇰ</td></tr>
			<tr><th>s</th><td>サ</td><td>シ</td><td>ス</td><td>セ</td><td>ソ</td><td>ㇱ</td></tr>
			<tr><th>t</th><td>タ</td><td>テｨ</td><td>トｩ</td><td>テ</td><td>ト</td><td>ㇳ</td></tr>
			<tr><th>c</th><td>チｬ</td><td>チ</td><td>チｭ</td><td>チｪ</td><td>チｮ</td><td>ﾁチ</td></tr>
			<tr><th>n</th><td>ナ</td><td>ニ</td><td>ヌ</td><td>ネ</td><td>ノ</td><td>ン、ㇴ</td></tr>
			<tr><th>h</th><td>ハ</td><td>ヒ</td><td>フ</td><td>ヘ</td><td>ホ</td><td>ㇵ、ㇶ、ㇷ、ㇸ、ㇹ</td></tr>
			<tr><th>p</th><td>パ</td><td>ピ</td><td>プ</td><td>ペ</td><td>ポ</td><td>ㇷ゚</td></tr>
			<tr><th>m</th><td>マ</td><td>ミ</td><td>ム</td><td>メ</td><td>モ</td><td>ㇺ</td></tr>
			<tr><th>y</th><td>ヤ</td><td>イｨ</td><td>ユ</td><td>イｪ</td><td>ヨ</td><td>ィ‌̣</td></tr>
			<tr><th>r</th><td>ラ</td><td>リ</td><td>ル</td><td>レ</td><td>ロ</td><td>ㇻ、ㇼ、ㇽ、ㇾ、ㇿ</td></tr>
			<tr><th>w</th><td>ワ</td><td>ヰ</td><td>ウｩ</td><td>ヱ</td><td>ヲ</td><td>ゥ‌̣</td></tr>
		</table>
		曖昧表記
		<table border="1">
			<tr><th>ローマ字</th><td>ƭ</td><td>ƞ</td><td>ĭ</td><td>ŭ</td></tr>
			<tr><th>カタカナ</th><td>ッ‌̗</td><td>ﾁン‌̗</td><td>イ‌̗</td><td>ウ‌̗</td></tr>
		</table>
	`
    },
    "cyrillic": {
        n: "キリル文字",
        c: [
            ["Á", "Á"], ["á", "á"], ["Í", "Í"], ["í", "í"],
            ["Ú", "Ú"], ["ú", "ú"], ["É", "É"], ["é", "é"],
            ["Ó", "Ó"], ["ó", "ó"], ["Ń", "Ń"], ["ń", "ń"],
            ["A", "А"], ["a", "а"], ["I", "И"], ["i", "и"],
            ["U", "У"], ["u", "у"], ["E", "Э"], ["e", "э"],
            ["O", "О"], ["o", "о"],
            ["K", "К"], ["k", "к"], ["G", "Г"], ["g", "г"],
            ["S", "С"], ["s", "с"], ["Z", "З"], ["z", "з"],
            ["C", "Ч"], ["c", "ч"],
            ["T", "Т"], ["t", "т"], ["N", "Н"], ["n", "н"],
            ["H", "Һ"], ["h", "һ"], ["P", "П"], ["p", "п"],
            ["M", "М"], ["m", "м"], ["Y", "Ј"], ["y", "ј"],
            ["R", "Р"], ["r", "р"], ["W", "Ԝ"], ["w", "ԝ"],
            ["Ĭ", "Й"], ["ĭ", "й"], ["Ŭ", "Ў"], ["ŭ", "ў"],
            ["Ƞ", "Ԣ"], ["ƞ", "ԣ"], ["Ƭ", "Ꚍ"], ["ƭ", "ꚍ"]
        ],
        f: "g",
        m: false,
        t: `
		アイヌ語の音韻体系に合わせたキリル文字表記。
		<div class="float-wrapper">
			<table border="1" class="float">
				<tr><th>ローマ字</th><th>キリル文字</th></tr>
				<tr><td>A、a</td><td>А、а</td></tr>
				<tr><td>I、i</td><td>И、и</td></tr>
				<tr><td>U、u</td><td>У、у</td></tr>
				<tr><td>E、e</td><td>Э、э</td></tr>
				<tr><td>O、o</td><td>О、о</td></tr>
				<tr><td>K、k</td><td>К、к</td></tr>
				<tr><td>S、s</td><td>С、с</td></tr>
				<tr><td>T、t</td><td>Т、т</td></tr>
			</table>
			<table border="1" class="float">
				<tr><th>ローマ字</th><th>キリル文字</th></tr>
				<tr><td>C、c</td><td>Ч、ч</td></tr>
				<tr><td>N、n</td><td>Н、н</td></tr>
				<tr><td>H、h</td><td>Һ、һ</td></tr>
				<tr><td>P、p</td><td>П、п</td></tr>
				<tr><td>M、m</td><td>М、м</td></tr>
				<tr><td>Y、y</td><td>Ј、ј</td></tr>
				<tr><td>R、r</td><td>Р、р</td></tr>
				<tr><td>W、w</td><td>Ԝ、ԝ</td></tr>
			</table>
		</div>
		曖昧表記
		<div class="float-wrapper">
			<table border="1" class="float">
				<tr><th>ローマ字</th><th>キリル文字</th></tr>
				<tr><td>Ƭ、ƭ</td><td>Ꚍ、ꚍ</td></tr>
				<tr><td>Ƞ、ƞ</td><td>Ԣ、ԣ</td></tr>
			</table>
			<table border="1" class="float">
				<tr><th>ローマ字</th><th>キリル文字</th></tr>
				<tr><td>Ĭ、ĭ</td><td>Й、й</td></tr>
				<tr><td>Ŭ、ŭ</td><td>Ў、ў</td></tr>
			</table>
		</div>
	`
    }
};
let kayano_back = [
    ["ヤイペレ", "yayipere"], ["アウン", "awun"],
    ["　", " "], ["，", ", "], ["．", ". "], ["！", "! "], ["？", "? "], ["・", "="], ["ュ[−ー]", "w"], ["[−ー]", ""],
    ["カ", "ka"], ["キ", "ki"], ["ク", "ku"], ["ケ", "ke"], ["コ", "ko"], ["ㇰ", "k"],
    ["シャ", "sa"], ["シュ", "su"], ["シェ", "se"], ["ショ", "so"],
    ["サ", "sa"], ["シ", "si"], ["ス", "su"], ["セ", "se"], ["ソ", "so"], ["ㇱ", "s"],
    ["チャ", "ca"], ["チュ", "cu"], ["チェ", "ce"], ["チョ", "co"], ["チ", "ci"],
    ["タ", "ta"], ["トゥ", "tu"], ["テ", "te"], ["ト", "to"],
    ["ナ", "na"], ["ニ", "ni"], ["ヌ", "nu"], ["ネ", "ne"], ["ノ", "no"], ["ン", "n"],
    ["パ", "pa"], ["ピ", "pi"], ["プ", "pu"], ["ペ", "pe"], ["ポ", "po"], ["ㇷ゚", "p"],
    ["ハ", "ha"], ["ヒ", "hi"], ["フ", "hu"], ["ヘ", "he"], ["ホ", "ho"], ["[ㇵ-ㇹ]", "h"],
    ["マ", "ma"], ["ミ", "mi"], ["ム", "mu"], ["メ", "me"], ["モ", "mo"], ["ㇺ", "m"], ["n(?=[mp])", "ƞ"],
    ["[ヤャ]", "ya"], ["[ユュ]", "yu"], ["イェ", "ye"], ["[ヨョ]", "yo"],
    ["ラ", "ra"], ["リ", "ri"], ["ル", "ru"], ["レ", "re"], ["ロ", "ro"], ["[ㇻ-ㇿ]", "r"],
    ["ワ", "wa"], ["ウェ", "we"], ["ウォ", "wo"],
    ["ッ", "t"], ["t(?=[hkprs])", "ƭ"],
    ["(?<=[hkmnprst])(?=[アイウエオ])", "ʼ"],
    ["[アァ]", "a"], ["[エェ]", "e"], ["[オォ]", "o"],
    ["ィ", "y"], ["ゥ", "w"],
    ["^イ|(?<=[\x1e \"\(=ʼイ])イ|イ(?=[hkmnprst][\x1e \"\)=hkmnprst])", "i"], ["イ([hkmnprst])$", "i$1"], ["イ", "ĭ"],
    ["^ウ|(?<=[\x1e \"\(=ʼウ])ウ|ウ(?=[hkmnprst][\x1e \"\)=hkmnprst])", "u"], ["ウ([hkmnprst])$", "u$1"], ["ウ", "ŭ"],
    ["ĭŭ", "ĭu"], ["ŭĭ", "ŭi"],
    ["\"(.+?)\"", "“$1”"]
];
let source = {
    tamura: {name: "田村", mark: "出典：田村", format_func: (html) => {
        html = html.replace(/(?<!\{[^\}]*)[①-⑳☆](?![^\{]*\})/g, "\n$&").replace(/\{E:/, "\n{E:");
        return html;
    }, check_func: (html) => {
        html = html.replace(/｢[ \x0f!/\?…゚へぺァ-タチッテトナ-ハパヒピフプヘペホポ-ロワン・ーㇰ-ㇿ／｡､]+｣/g, (m) => {
            if (/ |｢…[^｣]/.test(m)) return "";
            return m;
        }).replace(/(?<=[-!\),\.:=\?A-Za-zÁÉÍÓÚáéíóúŃńəː“”…Ｘ]|所\]) [ \x0f!/\?…゚へぺァ-タチッテトナ-ハパヒピフプヘペホポ-ロワン・ーㇰ-ㇿ／｡､]+(?=[\n \(\)/\[\{…。《【〔])/g, (m) => {
            let e = m[m.length - 1];
            if (" ｢､".indexOf(e) !== -1) return e;
            return "";
        }).replace(/(?<=[-!\),\.:=\?A-Za-zÁÉÍÓÚáéíóúŃńəː“”…Ｘ]|所\]) ?\([へぺァ-タチッテトナ-ハパヒピフプヘペホポ-ロワン・ーㇰ-ㇿ]+\??\)\??/g, "")
            .replace(/(?<!\{[^\}]*)[-,\.:=A-Za-zÁÉÍÓÚáéíóúŃńəː“”…]+[!\?]*(?![^\{]*\})/g, (m) => {
            if (!(/[A-Za-zÁÉÍÓÚáéíóúŃńəː“”]/.test(m)) || m == "p.") return m;
            return `\x1bSS${m}\x1bSE`;
        }).replace(/\(\x1bSS([^\x1b]+?)\x1bSE\)/g, "\x1bSS($1)\x1bSE").replace(/\x1bSE( ?)\x1bSS/g, "$1")
            .replace(/\x1bSS(.+?)\x1bSE/g, '<span lang="ain">$1</span>');
        return html;
    }, convert_func: (s) => {
        s = s.replace(/n(?=[mp])/g, "ƞ");
        return s;
    }},
    kayano: {name: "萱野", mark: "出典：萱野", format_func: (html) => {
        html = html.replace(/(?<!\n)[▷＊]/g, "\n$&");
        return html;
    }, check_func: (html) => {
        let pl = html.indexOf("\n", html.indexOf("\n") + 1);
        let p = html.slice(0, pl).search(/[ →▷　．！＝？]/);
        if (p === -1) p = pl;
        let h = html.slice(p);
        h = h.replace(/(?<=[\n →▷　，．！＊＝？])["…−　゚ァ-カキクケコサシスセソタチッテトナ-ハパヒピフプヘペホポ-ロワン・ーㇰ-ㇿ！（），．？]+(?=[\n=　（＝])/g, (m) => {
            m = m.replace(/([゚ァ-カキクケコサシスセソタチッテトナ-ハパヒピフプヘペホポ-ロワン・ーㇰ-ㇿ]+)（(.+?)）/g, (_, p1, p2) => {
                if (/[　・]/.test(p2)) return p2;
                return `${p1}(${p2})`;
            });
            return `<span lang="ain">${m}</span>`;
        }).replace(/　/g, " ");
        html = html.slice(0, p) + h;
        return html;
    }, convert_func: (s) => {
        for (let i = 0; i < kayano_back.length; i++) {
            s = s.replace(new RegExp(kayano_back[i][0], "g"), kayano_back[i][1]);
        }
        return s;
    }},
    cxiri: {name: "知里", mark: "", format_func: (html) => {
        return html;
    }, check_func: (html) => {
        html = html.replace(/「.+?」/, "")
            .replace(/(?<=〔)[^〔〕]*?[A-Za-zÁÉÍÓÚáéíóúŃń“”][^〔〕]*?(?=〕)/g, (m) => m.replace(/[ ぁ-ゖ゚ァ-ーㇰ-ㇿ･]/g, ""))
            .replace(/(?<=（出典：.*?、方言：.*?）).+/s, "")
            .replace(/ \(/g, "\x1bP")
            .replace(/[A-Za-zÁÉÍÓÚáéíóúŃń“”]([- \(\)A-Za-zÁÉÍÓÚáéíóúŃń“”])*/, '\x1bSS$&\x1bSE')
            .replace(/\x1bP/g, " (")
            .replace(/(?<=\[[^\]]*)[-A-Za-zÁÉÍÓÚáéíóúŃń“”]+(?=[^\[]*\])/g, '\x1bSS$&\x1bSE')
            .replace(/\x1bSS(.+?)\x1bSE/g, '<span lang="ain">$1</span>');
        return html;
    }, convert_func: (s) => {
        s = s.replace(/m(?=[mp])/g, "ƞ");
        return s;
    }}
};
for (let a in source) {
    source[a].enable = (localStorage.getItem(a) ?? "true") == "true";
}
let display;
let add_display;

//出典の更新
function updateAuthor() {
    let num = document.querySelector("dl");
    if (num == null) return;
    num = num.parentNode.previousElementSibling;

    let n = 0;
    let display_css = "";
    for (let a in source) {
        if (source[a].enable) {
            n += document.getElementsByClassName(a).length;
        }
        else {
            display_css += `.${a}{display:none;}`;
        }
    }
    let dt = document.getElementsByTagName("dt");
    num.textContent = `${n >> 1}/${dt.length}件見つかりました。`;
    display.textContent = display_css;
}

//表記変換
function changeNotation(notation) {
    let ain = Array.from(document.querySelectorAll(":lang(ain)"));
    if (ain.length == 0) return;
    let dl = document.querySelector("dl");
    if (dl == null) return;
    let r = document.createTextNode("");
    dl.replaceWith(r);

    if (notation == "roman") {
        for (let i = 0; i < ain.length; i++) {
            let roman = ain[i].getAttribute("data-roman");
            if (roman == null) continue;
            ain[i].textContent = roman;
            ain[i].removeAttribute("data-roman");
        }
        add_display.textContent = ".additional{display:none;}";
    }
    else {
        for (let i = 0; i < ain.length; i++) {
            let roman = ain[i].getAttribute("data-roman");
            if (roman != null) continue;
            roman = ain[i].textContent;
            ain[i].setAttribute("data-roman", roman);
        }
        let s = ain[0].getAttribute("data-roman") ?? ain[0].textContent;
        for (let i = 1; i < ain.length; i++) {
            s += "\x1e" + (ain[i].getAttribute("data-roman") ?? ain[i].textContent);
        }
        for (let i = 0; i < c[notation].c.length; i++) {
            s = s.replace(new RegExp(c[notation].c[i][0], c[notation].f), c[notation].c[i][1]);
        }
        s = s.split("\x1e");
        for (let i = 0; i < ain.length; i++) {
            ain[i].textContent = s[i];
        }
        let add_display_css = "";
        if (c[notation].m) add_display_css = ':lang(ain){font-family:"Mkana+";}';
        add_display.textContent = add_display_css;
    }

    r.replaceWith(dl);
}

//検索結果のソート
function sortResults(direction) {
    let dd = Array.from(document.getElementsByTagName("dd"));
    let dl = document.querySelector("dl");
    if (dl == null) return;
    let r = document.createTextNode("");
    dl.replaceWith(r);

    if (direction == "ja-ain") {
        dd.sort((a, b) => Number(a.getAttribute("data-order")) - Number(b.getAttribute("data-order")));
    }
    else {
        dd.sort((a, b) => Number(a.getAttribute("data-order-org")) - Number(b.getAttribute("data-order-org")));
    }

    for (let i = 0; i < dd.length; i++) {
        dl.appendChild(dd[i].previousElementSibling);
        dl.appendChild(dd[i]);
    }

    r.replaceWith(dl);
}

//検索結果の更新
function updateResults(format, unify) {
    let dd = Array.from(document.getElementsByTagName("dd"));
    let dl = document.querySelector("dl");
    if (dl == null) return;
    let r = document.createTextNode("");
    dl.replaceWith(r);

    //本文中のアイヌ語のチェック
    for (let i = 0; i < dd.length; i++) {
        let html = dd[i].innerHTML;
        let author = dd[i].getAttribute("data-author");
        if (format) {
            html = source[author].format_func(html);
        }
        if (unify) {
            html = html.slice(html.indexOf("\n") + 1).trim();
            html = source[author].check_func(html);
        }
        else {
            html = html.replaceAll(document.getElementById("sch-word").value, '<span class="hl">$&</span>');
        }
        html = html.replace(/＜/g, "&lt;").replace(/＞/g, "&gt;");
        dd[i].innerHTML = html;
    }

    r.replaceWith(dl);

    //表記変換
    if (unify) {
        for (let a in source) {
            let ain = Array.from(document.querySelectorAll(`dd.${a} :lang(ain)`));
            if (ain.length > 0) {
                let dl = document.querySelector("dl");
                dl.replaceWith(r);

                let s = ain[0].textContent;
                for (let i = 1; i < ain.length; i++) {
                    s += "\x1e" + ain[i].textContent;
                }
                s = source[a].convert_func(s);
                s = s.split("\x1e");
                for (let i = 0; i < ain.length; i++) {
                    ain[i].textContent = s[i];
                }

                r.replaceWith(dl);
            }
        }
    }

    changeNotation(document.notationForm.notation.value);
}

//検索結果の再更新
function reupdateResults() {
    let dd = document.getElementsByTagName("dd");
    for (let i = 0; i < dd.length; i++) {
        dd[i].innerHTML = dd[i].getAttribute("data-org");
    }
    let format = document.querySelector(".schFormat").checked;
    let unify = document.querySelector(".schUnify").checked;
    updateResults(format, unify);
}

(() => {
    //音声の有効化
    let sounds = document.getElementsByClassName("sound");
    for (let i = 0; i < sounds.length; i++) {
        sounds[i].addEventListener("click", function(e) {
            let audio = new Audio(`/${this.getAttribute("data-sound-url")}`);
            audio.play();
            e.preventDefault();
        });
    }

    //PC用サイト判定
    let pcsite = location.pathname == "/dic";

    let limit = Number(localStorage.getItem("limit") ?? 500);
    //件数がlimitを超えたら、ユーザースクリプトを停止する
    if (document.getElementsByTagName("dt").length > limit) {
        let html = `<p>${limit}件を超えたので、ユーザースクリプトを停止します。<a href="${location.pathname}">検索結果のクリア</a></p>`;
        if (pcsite) {
            document.getElementById("wordForm").insertAdjacentHTML("afterend", html);
        }
        else {
            document.getElementById("contentNoNav").insertAdjacentHTML("beforebegin", html);
        }
        return;
    }

    //CSS
    if (!pcsite) css += css_phone;
    let style = document.createElement("style");
    style.textContent = css;
    document.body.appendChild(style);

    //モーダルウィンドウの作成
    let html = `
<div class="js-modal">
	<div class="js-modal-container">
		<div class="js-modal-close"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg></div>
		<div class="js-modal-content"></div>
	</div>
</div>
`;
    document.body.insertAdjacentHTML("beforeend", html);
    let modal = document.querySelector(".js-modal");
    let modal_close = document.querySelector(".js-modal-close");
    let modal_content = document.querySelector(".js-modal-content");
    modal_close.addEventListener("click", () => {
        modal.classList.remove("is-active");
    });
    modal.addEventListener("click", (e) => {
        if (e.target == modal) {
            modal.classList.remove("is-active");
        }
    });

    //オプションの作成
    html = `
<h2>オプション</h2>
<h3>検索方向</h3>
<form name="directionForm">
	<label><input class="schDirection" type="radio" name="direction" value="ain-ja">アイヌ語→日本語</label>
	<a class="js-modal-link" href="#" data-modal-content="#modal-ain-ja">?</a>
	<div id="modal-ain-ja" style="display: none;">
		<b>探している単語が見つからないときは</b><br>
		<br>
		<b>表記が揺れている場合</b>
		<p>
			tanpe（これ）、tumpu（部屋）などにある、「p、m」の前の「n、m」は書き手によって揺れます。（ローマ字のヒントを参照）<br>
			見つからなければ、「n」と「m」を入れ替えてみてください。
		</p>
		<br>
		<b>語源の間に記号が入っている場合</b>
		<p>
			menyo（羊）が「men-yo」になっているように、語源の間に「-」がある可能性があります。<br>
			また、ciyuppap（握り飯）が「ci=yuppap」になっているように、語源の「=」がそのままになっている可能性があります。<br>（「=」やスペースの有無でフレーズと単語を区別するので、本来は単語には不要です）<br>
			見つからなければ、これらの記号を入れてみてください。
		</p>
	</div>
	<label><input class="schDirection" type="radio" name="direction" value="ja-ain">日本語→アイヌ語</label>
	<a class="js-modal-link" href="#" data-title="入力した日本語が最初に来るように検索結果を並べ替えることで、日本語を検索しやすくします。探している単語が見つからなければ、ひらがな、カタカナ、漢字を入れ替えてみてください。">?</a>
</form>
<h3>出典</h3>`;
    for (let a in source) {
        html += `
<label><input class="schSource" type="checkbox" name="${a}">${source[a].name}</label>`;
    }
    html += `
<h3>表記</h3>
<form name="notationForm">
	<label><input class="schFormat" type="checkbox">本文を整形する</label>
	<a class="js-modal-link" href="#" data-title="適度に改行を入れることで、本文を見やすくします。">?</a><br>
	<label><input class="schUnify" type="checkbox">表記を統一する（可能な限り）</label>
	<a class="js-modal-link" href="#" data-title="本文中のアイヌ語を検出し、辞書ごとに異なる表記を任意の表記に統一します。（本文によってはうまく検出できない可能性があります）キーワードのハイライトはなくなります。">?</a><br>`;
    for (let ch in c) {
        html += `
	<label><input class="schNotation" type="radio" name="notation" value="${ch}">${c[ch].n}</label>
	<a class="js-modal-link" href="#" data-modal-content="#modal-word-${ch}">?</a>
	<div id="modal-word-${ch}" style="display: none;">${c[ch].t}</div>`;
    }
    html += `
</form>
<h3>安全</h3>
<label><input class="schLimit" type="number">件を超えたら、ユーザースクリプトを停止する</label>
<a class="js-modal-link" href="#" data-title="件数が多いと動作が重くなるので、設定した件数を超えたらユーザースクリプトを停止します。">?</a><br>
`;
    if (pcsite) {
        document.getElementById("wordForm").insertAdjacentHTML("afterend", html);
    }
    else {
        document.getElementById("contentNoNav").insertAdjacentHTML("beforebegin", html);
    }

    let modal_link = document.getElementsByClassName("js-modal-link");
    for (let i = 0; i < modal_link.length; i++) {
        modal_link[i].addEventListener("click", function(e) {
            let content = this.getAttribute("data-modal-content");
            if (content != null) {
                modal_content.innerHTML = document.querySelector(content).innerHTML;
            }
            else {
                modal_content.innerHTML = this.getAttribute("data-title");
            }
            modal.classList.add("is-active");
            e.preventDefault();
        });
    }

    let direction = localStorage.getItem("direction") ?? "ain-ja";
    let schDirection = document.getElementsByClassName("schDirection");
    for (let i = 0; i < schDirection.length; i++) {
        document.directionForm.direction.value = localStorage.getItem("direction") ?? "ain-ja";
        schDirection[i].addEventListener("change", function() {
            direction = this.value;
            localStorage.setItem("direction", this.value);
            sortResults(direction);
        });
    }
    let schSource = document.getElementsByClassName("schSource");
    for (let i = 0; i < schSource.length; i++) {
        if (source[schSource[i].name].enable) {
            schSource[i].checked = true;
        }
        schSource[i].addEventListener("change", function() {
            source[this.name].enable = this.checked;
            localStorage.setItem(this.name, this.checked);
            updateAuthor();
        });
    }

    let schFormat = document.querySelector(".schFormat");
    if ((localStorage.getItem("format") ?? "false") == "true") {
        schFormat.checked = true;
    }
    schFormat.addEventListener("change", function() {
        localStorage.setItem("format", this.checked);
        reupdateResults();
    });
    let schUnify = document.querySelector(".schUnify");
    if ((localStorage.getItem("unify") ?? "false") == "true") {
        schUnify.checked = true;
    }
    schUnify.addEventListener("change", function() {
        localStorage.setItem("unify", this.checked);
        reupdateResults();
    });
    let schNotation = document.getElementsByClassName("schNotation");
    document.notationForm.notation.value = localStorage.getItem("notation") ?? "roman";
    for (let i = 0; i < schNotation.length; i++) {
        schNotation[i].addEventListener("change", function() {
            localStorage.setItem("notation", this.value);
            changeNotation(this.value);
        });
    }
    let schLimit = document.querySelector(".schLimit");
    schLimit.value = limit;
    schLimit.addEventListener("change", function() {
        localStorage.setItem("limit", this.value);
    });

    let dd = Array.from(document.getElementsByTagName("dd"));
    let dl = document.querySelector("dl");
    if (dl == null) return;
    let r = document.createTextNode("");
    dl.replaceWith(r);

    for (let i = 0; i < dd.length; i++) {
        //バグ修正
        let html = dd[i].innerHTML;
        html = html.trim().replace(/<[^<]+?>|=""/g, "").replace(/<|&lt;/g, "＜").replace(/>|&gt;/g, "＞");
        dd[i].innerHTML = html;

        //オリジナルの本文の記録
        dd[i].setAttribute("data-org", dd[i].innerHTML);

        //出典のチェック
        let text = dd[i].textContent;
        let author;
        for (let a in source) {
            if (text.indexOf(source[a].mark) !== -1) {
                author = a;
                dd[i].setAttribute("data-author", a);
                dd[i].classList.add(a);
                dd[i].previousElementSibling.classList.add(a);
                break;
            }
        }

        //見出しに任意の表記の追加
        let dt = dd[i].previousElementSibling;
        let s = dt.textContent.trim();
        let ns = s;
        if (author == "tamura") ns = s.replace(/n(?=[mp])/g, "ƞ");
        else if (author == "cxiri") ns = s.replace(/m(?=[mp])/g, "ƞ");
        dt.insertAdjacentHTML("beforeend", `<span class="additional${ns != s ? "-different" : ""}"> / <span lang="ain">${ns}</span></span>`);
    }

    r.replaceWith(dl);

    //出典による表示、非表示の切り替え
    display = document.createElement("style");
    updateAuthor();
    document.body.appendChild(display);

    //任意の表記のCSS
    add_display = document.createElement("style");
    document.body.appendChild(add_display);

    //検索結果の順番の設定
    for (let i = 0; i < dd.length; i++) {
        let text = dd[i].textContent;
        let o = text.slice(text.indexOf("\n")).replace(/【.+?】|\[.+?\]|\(.+?\)/g, "").trim()
        .indexOf(document.getElementById("sch-word").value);
        dd[i].setAttribute("data-order", o == -1 ? Number.MAX_SAFE_INTEGER : o);
        dd[i].setAttribute("data-order-org", i);
    }

    //検索結果のソート
    sortResults(direction);

    //検索結果の更新
    updateResults(schFormat.checked, schUnify.checked);
})();