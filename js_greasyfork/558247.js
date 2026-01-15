// ==UserScript==
// @name         現代アイヌ語翻訳用語集の表記変換
// @namespace    https://lit.link/toracatman
// @version      2026-01-15
// @description  現代アイヌ語翻訳用語集の 表記を 変換します。
// @author       トラネコマン
// @match        https://itak.aynu.org/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558247/%E7%8F%BE%E4%BB%A3%E3%82%A2%E3%82%A4%E3%83%8C%E8%AA%9E%E7%BF%BB%E8%A8%B3%E7%94%A8%E8%AA%9E%E9%9B%86%E3%81%AE%E8%A1%A8%E8%A8%98%E5%A4%89%E6%8F%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/558247/%E7%8F%BE%E4%BB%A3%E3%82%A2%E3%82%A4%E3%83%8C%E8%AA%9E%E7%BF%BB%E8%A8%B3%E7%94%A8%E8%AA%9E%E9%9B%86%E3%81%AE%E8%A1%A8%E8%A8%98%E5%A4%89%E6%8F%9B.meta.js
// ==/UserScript==

let css = `
@font-face {
	font-family: "Mkana+";
	src: local("Mkana+"),
	     url("https://toracatman.github.io/fonts/mkanaplus.woff2") format("woff2"),
	     url("https://toracatman.github.io/fonts/mkanaplus.woff") format("woff");
	font-display:swap;
}
.newkana {
	font-family: "Mkana+";
}

.js-modal {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1000;
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
.js-modal-content :is(table,th,td)  {
	border: 1px solid #000;
}
.js-modal-content table {
	border-collapse: collapse;
}
.js-modal-content th {
	text-align: center;
}
.js-modal-content :is(th,td) {
	padding: 2px;
}
.js-modal-content ol {
	list-style: revert;
	padding: revert;
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

let c = {
    "roman": {
        n: {jp: "ローマ字", en: "Roman"},
        t: {jp: `
		アイヌ語のローマ字表記の方式はほぼ1種類ですが、「ッ」が「t」か子音の連続かのように、アイヌ語の音韻体系に合わない表記からの変換後の文字がはっきりしない場合、当ユーザースクリプトは曖昧表記をします。（この辞典にはそのようなことはないですが）<br>
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
			<li>すべて「n」</li>
			<li>語源に合わせる、わからないものは「n」</li>
			<li>語源に合わせる、わからないものは「m」（この辞典はこれ）</li>
			<li>すべて「m」</li>
		</ol>
		推奨されるのは3です。3を基準にすると、1、2の「n」は「m」、4の「m」は「n」の可能性があるので、当ユーザースクリプトはこれらを曖昧表記「ƞ」に変換します。
	`, en: `
	    There is almost only one way to romanize Ainu, but if the resulting character is unclear because it is not in line with the Ainu phonological system, such as when “ッ” is a “t” or a series of consonants, this user script will use ambiguous notations (though this is not the case in this dictionary).<br>
        These are temporary notations intended to be corrected by hand later, so they are not normally used when writing Ainu.
		<table border="1">
			<tr><th>Before conversion</th><th>Possibility</th><th>Ambiguous notation</th></tr>
			<tr><td>ッ（middle）</td><td>t, a series of consonants</td><td>ƭ</td></tr>
			<tr><td>ン（before the パ row, マ row）</td><td>n, m</td><td>ƞ</td></tr>
			<tr><td>イ（middle, end）</td><td>i, y</td><td>ĭ</td></tr>
			<tr><td>ウ（middle, end）</td><td>u, w</td><td>ŭ</td></tr>
		</table>
		The “n, m” before the “m, p” is written by the writer as follows:
		<ol>
			<li>All “n”</li>
			<li>Go with the etymology, if we don't know, “n”</li>
			<li>Go with the etymology, if we don't know, “m” (This dictionary is this)</li>
			<li>All “m”</li>
		</ol>
		The recommended number is 3. If we use 3 as the standard, the “n” in 1 and 2 may be “m”, and the “m” in 4 may be “n”, so this user script converts these into the ambiguous notation “ƞ”.
	`}
    },
    "katakana": {
        n: {jp: "カタカナ", en: "Katakana"},
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
            ["sa", "サ"], ["si", "シ"], ["su", "ス"], ["se", "セ"], ["so", "ソ"], ["s", "ㇱ"],
            ["ca", ""], ["ci", "チ"], ["cu", ""], ["ce", ""], ["co", ""], ["c", "𛅚"],
            ["ta", "タ"], ["ti", ""], ["tu", ""], ["te", "テ"], ["to", "ト"], ["t", "ㇳ"],
            ["na", "ナ"], ["ni", "ニ"], ["nu", "ヌ"], ["ne", "ネ"], ["no", "ノ"], ["n(?=゠[aiueo])", "ㇴ"], ["n", "ン"],
            ["pa", "パ"], ["pi", "ピ"], ["pu", "プ"], ["pe", "ペ"], ["po", "ポ"], ["p", ""],
            ["ma", "マ"], ["mi", "ミ"], ["mu", "ム"], ["me", "メ"], ["mo", "モ"], ["m", "ㇺ"],
            ["ya", "ヤ"], ["yi", "𛄠"], ["yu", "ユ"], ["ye", "𛄡"], ["yo", "ヨ"], ["y", ""],
            ["wa", "ワ"], ["wi", "ヰ"], ["wu", "𛄢"], ["we", "ヱ"], ["wo", "ヲ"], ["w", ""],
            ["a", "ア"],  ["i", "イ"],  ["u", "ウ"],  ["e", "エ"],  ["o", "オ"],
            ["'", ""]
        ],
        f: "ig",
        m: "Mkana+",
        t: {jp: `
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
	`, en: `
	    Katakana notation that matches the phonological system of the Ainu language.<br>
	    Katakana not used in modern Japanese is also used.
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
		※1: “ン” becomes “ㇴ” when “ア, イ, ウ, エ, オ” follow each other with "゠" in between.<br>
		※2: “<span class="newkana">, </span>” have a dot underneath them to indicate that they are independent letters.<br>
		Ambiguous notations are marked with a lower accent “ˏ”.
		<table border="1" class="newkana">
			<tr><th>Roman</th><td>ƭ</td><td>ƞ</td><td>ĭ</td><td>ŭ</td></tr>
			<tr><th>Katakana</th><td>ッ</td><td>𛅧</td><td>イ</td><td>ウ</td></tr>
		</table>
	`}
    },
    "katakana-substitute": {
        n: {jp: "カタカナ（代用表記）", en: "Katakana (substitute)"},
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
            ["sa", "サ"], ["si", "シ"], ["su", "ス"], ["se", "セ"], ["so", "ソ"], ["s", "ㇱ"],
            ["ca", "チｬ"], ["ci", "チ"], ["cu", "チｭ"], ["ce", "チｪ"], ["co", "チｮ"], ["c", "ﾁチ"],
            ["ta", "タ"], ["ti", "テｨ"], ["tu", "トｩ"], ["te", "テ"], ["to", "ト"], ["t", "ㇳ"],
            ["na", "ナ"], ["ni", "ニ"], ["nu", "ヌ"], ["ne", "ネ"], ["no", "ノ"], ["n(?=゠[aiueo])", "ㇴ"], ["n", "ン"],
            ["pa", "パ"], ["pi", "ピ"], ["pu", "プ"], ["pe", "ペ"], ["po", "ポ"], ["p", "ㇷ゚"],
            ["ma", "マ"], ["mi", "ミ"], ["mu", "ム"], ["me", "メ"], ["mo", "モ"], ["m", "ㇺ"],
            ["ya", "ヤ"], ["yi", "イｨ"], ["yu", "ユ"], ["ye", "イｪ"], ["yo", "ヨ"], ["y", "ィ‌̣"],
            ["wa", "ワ"], ["wi", "ヰ"], ["wu", "ウｩ"], ["we", "ヱ"], ["wo", "ヲ"], ["w", "ゥ‌̣"],
            ["a", "ア"],  ["i", "イ"],  ["u", "ウ"],  ["e", "エ"],  ["o", "オ"],
            ["'", ""]
        ],
        f: "ig",
        m: "",
        t: {jp: `
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
	`, en: `
		Katakana notation includes characters that cannot be displayed depending on the font, and it cannot be used in all environments, so we have also provided an substitute notation using half-width kana.<br>
		Half-width kana are not used as narrow katakana or small letters, but as markers for substitute notation.<br>
		“ﾁ” indicates that the next character is small, and the small half-width kana, when combined with the previous character, represents a katakana character that is not used in modern Japanese.<br>
		If you want to make sure that your readers understand this, I think you can do so by adding an annotation like “※ﾁ●: small” “※half-width kana: substitute” somewhere in the text.<br>
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
		Ambiguous notations
		<table border="1">
			<tr><th>Roman</th><td>ƭ</td><td>ƞ</td><td>ĭ</td><td>ŭ</td></tr>
			<tr><th>Katakana</th><td>ッ‌̗</td><td>ﾁン‌̗</td><td>イ‌̗</td><td>ウ‌̗</td></tr>
		</table>
	`}
    },
    "cyrillic": {
        n: {jp: "キリル文字", en: "Cyrillic"},
        c: [
            ["Á", "Á"], ["á", "á"], ["Í", "Í"], ["í", "í"],
            ["Ú", "Ú"], ["ú", "ú"], ["É", "É"], ["é", "é"],
            ["Ó", "Ó"], ["ó", "ó"], ["Ń", "Ń"], ["ń", "ń"],
            ["A", "А"], ["a", "а"], ["I", "И"], ["i", "и"],
            ["U", "У"], ["u", "у"], ["E", "Э"], ["e", "э"],
            ["O", "О"], ["o", "о"], ["K", "К"], ["k", "к"],
            ["S", "С"], ["s", "с"], ["C", "Ч"], ["c", "ч"],
            ["T", "Т"], ["t", "т"], ["N", "Н"], ["n", "н"],
            ["H", "Һ"], ["h", "һ"], ["P", "П"], ["p", "п"],
            ["M", "М"], ["m", "м"], ["Y", "Ј"], ["y", "ј"],
            ["R", "Р"], ["r", "р"], ["W", "Ԝ"], ["w", "ԝ"],
        ],
        f: "g",
        m: "Arial",
        t: {jp: `
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
	`, en: `
		Cyrillic notation based on the Ainu phonological system.
		<div class="float-wrapper">
			<table border="1" class="float">
				<tr><th>Roman</th><th>Cyrillic</th></tr>
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
				<tr><th>Roman</th><th>Cyrillic</th></tr>
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
		Ambiguous notations
		<div class="float-wrapper">
			<table border="1" class="float">
				<tr><th>Roman</th><th>Cyrillic</th></tr>
				<tr><td>Ƭ、ƭ</td><td>Ꚍ、ꚍ</td></tr>
				<tr><td>Ƞ、ƞ</td><td>Ԣ、ԣ</td></tr>
			</table>
			<table border="1" class="float">
				<tr><th>Roman</th><th>Cyrillic</th></tr>
				<tr><td>Ĭ、ĭ</td><td>Й、й</td></tr>
				<tr><td>Ŭ、ŭ</td><td>Ў、ў</td></tr>
			</table>
		</div>
	`}
    }
};

let add_display;

//表記変換
function changeNotation(notation) {
    let ainu = document.querySelectorAll('.font-ain,p:not([lang]):not([class]):not([title]),[lang="ain-Latn"]:not(html) a');
    if (ainu.length == 0) return;
    if (notation == "roman") {
        for (let i = 0; i < ainu.length; i++) {
            let roman = ainu[i].getAttribute("data-roman");
            if (roman == null) continue;
            ainu[i].textContent = roman;
            ainu[i].removeAttribute("data-roman");
        }
        add_display.textContent = "";
    }
    else {
        for (let i = 0; i < ainu.length; i++) {
            let roman = ainu[i].getAttribute("data-roman");
            if (roman != null) continue;
            roman = ainu[i].textContent;
            ainu[i].setAttribute("data-roman", roman);
        }
        let s = ainu[0].getAttribute("data-roman") ?? ainu[0].textContent;
        for (let i = 1; i < ainu.length; i++) {
            s += "\x1e" + (ainu[i].getAttribute("data-roman") ?? ainu[i].textContent);
        }
        let p = [];
        s = s.replace(/[A-Z]+\d|[A-Z]{2,}/g, (m) => {
            p.push(m);
            return "\x1a";
        });
        for (let i = 0; i < c[notation].c.length; i++) {
            s = s.replace(new RegExp(c[notation].c[i][0], c[notation].f), c[notation].c[i][1]);
        }
        let ss = s.split("\x1a");
        s = "";
        for (let i = 0; i < p.length; i++) {
            s += ss[i] + p[i];
        }
        s += ss[p.length];
        s = s.split("\x1e");
        for (let i = 0; i < ainu.length; i++) {
            ainu[i].textContent = s[i];
        }
        let add_display_css = "";
        if (c[notation].m != "") add_display_css = `.font-ain,p:not([lang]):not([class]):not([title]),[lang="ain-Latn"]:not(html) a{font-family:"${c[notation].m}";}`;
        add_display.textContent = add_display_css;
    }
}

function mainProc() {
    let style = document.createElement("style");
    style.textContent = css;
    document.body.appendChild(style);

    //任意の表記のCSS
    add_display = document.createElement("style");
    document.body.appendChild(add_display);

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

    //検索、分類の削除
    let a = document.querySelectorAll(".query-form.contents");
    for (let i = 0; i < a.length; i++) a[i].remove();

    //表記オプションの作成
    let toolbar = document.querySelector('[title^="Romanci"]').parentNode.parentNode.parentNode.parentNode;
    html = `
<form name="notationForm">`;
    for (let ch in c) {
        html += `
	<input type="radio" name="notation" value="${ch}">${c[ch].n["jp"]}
	<a class="js-modal-link" href="#" data-modal-content="#modal-word-${ch}-jp">?</a>
	<div id="modal-word-${ch}-jp" style="display: none;">${c[ch].t["jp"]}</div>
	/ ${c[ch].n["en"]}
	<a class="js-modal-link" href="#" data-modal-content="#modal-word-${ch}-en">?</a>
	<div id="modal-word-${ch}-en" style="display: none;">${c[ch].t["en"]}</div>
	<br>`;
    }
    html += `
</form>`;
    toolbar.innerHTML = html;
    document.notationForm.notation.value = "roman";
    let notation = document.querySelectorAll('form[name="notationForm"] input[name="notation"]');
    for (let i = 0; i < notation.length; i++) {
        notation[i].addEventListener("change", function(e) {
            if (document.querySelector('[title^="Episno sos"] select').value == "") {
                changeNotation(this.value);
            }
            else {
                alert("先にページごとの項目数をOpittaにしてください。\nFirst, please set Items per page Opitta.");
                document.notationForm.notation.value = "roman";
            }
        });
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
}

(() => {
    let o = new MutationObserver((m) => {
        mainProc();
        o.disconnect();
    });
    o.observe(document.querySelector("div"), { childList: true });
})();