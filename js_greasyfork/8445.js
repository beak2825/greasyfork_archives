// ==UserScript==
// @name        txt reader
// @namespace   txt reader
// @description 小说阅读助手，文本清理修复、排版、生成索引等功能，方便阅读，也可用于初步较对
// @include     *.txt
// @include     *.txt#*
// @exclude     http://www.rfc-editor.org/*
// @exclude     *gfwlist.txt*
// @version     1.0.2

// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8445/txt%20reader.user.js
// @updateURL https://update.greasyfork.org/scripts/8445/txt%20reader.meta.js
// ==/UserScript==

/*
 * 只在firefox下测试过
 * 暂只支持中文
 *
 */

 /*
  * ===敏感词匹配===
  * 最大正向匹配，不符则回溯到上一个匹配的最长的子串。
  * 分前中后缀，优先词根、然后前缀、然后后缀
  * 优先搜索前后缀，其次归纳
  *
  * 匹配算法：
  * 1. 循环搜索词根
  * 	1. 成功则将输入字符串的词根部分替换为结果中的替换字符串
  * 	2. 失败则将将起始位置后移一位重新开始搜索词根
  * 2. 直到起始位置超出字符串，停止
  *
  * 词根搜索：
  * 1. 循环匹配下一个字符
  * 	1. 如果该节点有result、prefix、suffix子节点，将该节点及该字符所对应的位置压入栈中
  * 2. 直到匹配失败
  * 	1. 循环对栈中节点进行操作
  * 		1. 如果该节点有prefix子节点，则对其进行前缀搜索
  * 			1. 搜索成功，则返回搜索到的替换字符串以及该节点（词根栈中的节点）对应字符的位置
  * 		2. 如果该节点有suffix子节点，则对其进行后缀搜索
  * 			1. 搜索成功，则返回搜索到的替换字符串以及该节点（词根栈中的节点）对应字符的位置
  * 		3. 如果该节点有result子节点，则返回result节点中的内容作为替换字符串以及该节点（词根栈中的节点）对应字符的位置
  * 		4. 如果以上都没成功，则弹出下一个节点继续匹配
  * 	2. 直到栈为空，还没有搜索到替换字符串的话，返回匹配失败
  *
  * 前缀搜索：
  * 1. 循环匹配下一个字符
  * 	1. 如果该节点有result、suffix子节点，将该节点及该字符所对应的位置压入栈中
  * 2. 直到匹配失败
  * 	1. 循环对栈中节点进行操作
  * 		1. 如果该节点有suffix子节点，则对其进行后缀搜索
  * 			1. 搜索成功，则返回搜索到的替换字符串
  * 		2. 如果该节点有result子节点，则返回result节点中的内容作为替换字符串
  * 		3. 如果以上都没成功，则弹出下一个节点继续匹配
  * 	2. 直到栈为空，还没有搜索到替换字符串的话，返回匹配失败
  *
  * 后缀搜索：
  * 1. 循环匹配下一个字符
  * 	1. 如果该节点有result子节点，将该节点及该字符所对应的位置压入栈中
  * 2. 直到匹配失败
  * 	1. 循环对栈中节点进行操作
  * 		1. 如果该节点有result子节点，则返回result节点中的内容作为替换字符串
  * 		2. 如果以上都没成功，则弹出下一个节点继续匹配
  * 	2. 直到栈为空，还没有搜索到替换字符串的话，返回匹配失败
  */

/*
 * 段落解析
 *
 * line_break_char		= "\n" | "\r"
 * space_char			= <UNICODE coded character 9, 20, 3000 hexadecimal>
 * control_char			= <UNICODE coded characters 0001-0008, 001B, 001C, 001E-001F and 007F hexadecimal>
 * comm_char			= <UNICODE coded characters 0021-007E ,0080-2FFF and 3001-FFFF hexadecimal>
 *
 * paragraph_break		= *( control_char | line_break_char | space_char ) line_break_char *( control_char | line_break_char | space_char )
 * paragraph			= 1*comm_char *( comm_char | control_char | space_char ) 1*comm_char
 * novel				= [paragraph_break paragraph] ( paragraph_break paragraph )* [paragraph_break]
 *
 * In the context of paragraph
 * paragraph			= novel_title | preface_heading | postscript_heading | section_heading | comm_paragraph
 *
 * novel_title			= "《" 1*( space_char | comm_char ) "》"
 *
 * preface_heading		= "序" |
 *							"序" *space_char "章" |
 *							"序" *space_char "言" |
 *							"前" *space_char "言" |
 *							"引" *space_char "言" |
 *							"引" *space_char "子" |
 *							"摘" *space_char "要" |
 *							"楔" *space_char "子" | 
 *							"背景简介";
 *
 * postscript_heading	= "后" *space_char "记" |	
 *							"附" *space_char "言" |
 *							"结" *space_char "语"
 *
 * section_kw			= "章" | "节" | "回" | "卷" | "折" | "篇" | "幕" | "集"
 * digit				= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
 * chinese_num_kw		= "〇" | "零" | "一" | "二" | "三" | "四" | "五" | "六" | "七" | "八" | "九" |
 *							"十" | "百" | "千" | "万" | "亿" | "萬" | "億"        ??
 * section_digit_num	= 1*digit [ "." 1*digit ]
 * section_chinese_num	= 1*chinese_num_kw
 * section_heading		= [*"第" *space_char ] ( section_digit_num | section_chinese_num ) *space_char section_kw *50( space_char | comm_char )
 *
 * Grammers of title. A novel text have only one title even if it contains more than one story
 * novel = [ no title ] *title [ no title ]
 *
 * Grammers of sections, for generating index. The earlier section has the higher level
 * novel = *( preface | top_level_section | postscript )
 * section = *( child_section) 
 *
 * 实际情况控制字符已在文本清理时去除
 *
 */

//是否是开发模式
var devmode = false;
var timestamp;

//-------------------------------辅助方法----------------------------------
String.prototype.trim = function () {
	return this.replace(/(^\s*)|(\s*$)/g, "");
};

Array.prototype.contains = function (item) {
	for(var i = 0; i < this.length; i++) {
		if (this[i] == item) {
			return true;
		}
	}
	return false;
};
//--------------------------------标题-----------------------------------
document.title = decodeURI(window.location.pathname).match(/[^\\\/]*(?=.txt$)/);

//--------------------------------整体布局--------------------------------
document.body.style.margin = "0";
document.body.style.padding = "0";
var pageLayout = document.createElement("div");
pageLayout.style.margin = "0 auto";
pageLayout.style.padding = "0";
pageLayout.style.height = "100%";
pageLayout.style.width = "1224px";
pageLayout.style.borderLeft = "1px solid #999";
pageLayout.style.borderRight = "1px solid #999";
document.body.appendChild(pageLayout);

//创建索引显示框，向左浮动
var index_containter = document.createElement("div");
var index_box = document.createElement("div");
index_containter.id = "index_containter";
index_containter.style.height = "100%";
index_containter.style.cssFloat = "left";
index_containter.style.overflow = "auto";
index_containter.style.backgroundColor = "#F3F2EE";
index_containter.style.width = "219px";
index_containter.appendChild(index_box);
index_box.id = "index_box";
index_box.style.margin = "0 10px";
index_box.style.paddingTop = "5px";
pageLayout.appendChild(index_containter);

//分割线
var split_line = document.createElement("div");
split_line.style.width = "1px";
split_line.style.height = "100%";
split_line.style.cssFloat = "left";
split_line.style.backgroundColor = "#999";
pageLayout.appendChild(split_line);

//创建正文显示框，外边距浏览器默认
var text_containter = document.createElement("div");
var text_box = document.createElement("div");
text_containter.id = "text_containter";
text_box.id = "text_box";
text_containter.style.cssFloat = "left";
text_containter.style.width = "1002px";
text_containter.style.height = "100%";
text_containter.style.margin = "0 1px";
text_containter.style.overflowY = "auto";
text_containter.style.overflowX = "hidden";
text_box.style.width = "904px";
text_box.style.padding = "24px 50px 24px 48px";
text_box.style.backgroundColor = "#F3F2EE";
//text_box.style.backgroundImage = "url(file:///home/zbfs/Desktop/bg.png)";
text_containter.appendChild(text_box);
pageLayout.appendChild(text_containter);

//--------------------------------文本获取----------------------------
//获取原始文本
var originalText = document.getElementsByTagName("pre")[0].innerHTML;
if (devmode) {
	alert("文本长度" + originalText.length);
}

//清除页面文本
document.body.removeChild(document.getElementsByTagName("pre")[0]);

//-------------------------------文本清理----------------------------
if (devmode) {
	timestamp = new Date();
}

cleanedText = originalText.replace(/[\u0001-\u0009\u001B\u001C\u001E\u001F\u007F]|((<|(&lt;))[a-z\/\u0021\u0025\u002D][\u0000-\u003D\u003F-\uFFFF]{0,200}(>|(&gt;)))/ig, "");

if (devmode) {
	alert("文本清理完成，耗时：" + (new Date().getTime() - timestamp.getTime()) + "毫秒");
}
//-------------------------------文本清理完成----------------------------

//-------------------------------敏感词修复----------------------------
if (devmode) {
	timestamp = new Date();
}
//定义词法树原型
function LexTree() {};
LexTree.prototype.attributeWords = ["suffix", "prefix", "result"];
LexTree.prototype.addRule = function (rule) {

	if (rule == null) {
		return this;
	}

	var substring;
	var prefix;
	var suffix;

	var strings1 = rule.split("=>");
	var replaceText = strings1[1].trim();
	var lstr = strings1[0].trim();
	var fl = lstr.indexOf("(");
	var ll = lstr.lastIndexOf(")");
	if (fl >= 0 && ll >= 0) {
		prefix = lstr.substr(0, fl);
		suffix = lstr.substr(ll + 1);
		substring = lstr.slice(fl + 1, ll)
	} else {
		substring = lstr;
	}
	if (substring == "") {
		return this;
	}
	var node = this;
	function addSubstring(str) {
		if (str) {
			if (node[str.charAt(0)] == null) {
				node[str.charAt(0)] = {};
			}
			node = node[str.charAt(0)];
			addSubstring(str.substr(1));
		}
	}
	addSubstring(substring);
	function addPrefix(str) {
		if (str) {
			if (node[str.charAt(str.length - 1)] == null) {
				node[str.charAt(str.length - 1)] = {};
			}
			node = node[str.charAt(str.length - 1)];
			addPrefix(str.substr(0, str.length - 1));
		}
	}
	if (prefix) {
		if (node["prefix"] == null) {
			node["prefix"] = {};
		}
		node = node["prefix"];
		addPrefix(prefix);
	}
	function addSuffix(str) {
		if (str) {
			if (node[str.charAt(0)] == null) {
				node[str.charAt(0)] = {};
			}
			node = node[str.charAt(0)];
			addSuffix(str.substr(1));
		}
	}
	if (suffix) {
		if (node["suffix"] == null) {
			node["suffix"] = {};
		}
		node = node["suffix"];
		addSuffix(suffix);
	}
	node.result = replaceText;
	return this;
}
LexTree.prototype.toJsonString = function () {
	var lexTree = this;
	function isTreeAttribute(str) {
		if (str) {
			if (str.length == 1) {
				return true;
			} else if (lexTree.attributeWords.contains(str)) {
				return true;
			}
		}
		return false;
	}
	function getFieldStr(i) {
		var reg = /^[A-Za-z]+$/;
		if (reg.test(i)) {
			return i;
		} else if (lexTree.attributeWords.contains(i)) {
			return i;
		}
		return "\"" + i + "\"";
	}
	function _toJsonString(element) {
		if (element == null) {
			return "";
		}
		if (typeof element == "string") {
			return "\"" + element + "\""
		}
		var str = "{";
		var hasFlagStr = "";
		for (var i in element) {
			if (isTreeAttribute(i)) {
				str = str + hasFlagStr + getFieldStr(i) + ": " + _toJsonString(element[i]);
				hasFlagStr = ",";
			}
		}
		str = str + "}"
        return str;
	}
	return _toJsonString(this);
}
//定义替换器原型
function TextReplacer() {};
TextReplacer.prototype.addLexTree = function (lexTree) {
	this.lexTree = lexTree;
	return this;
}
TextReplacer.prototype.parse = function (str) {
	if (this.lexTree == null) {
		throw new Exception("LexTree Not Found");
	}

	if (str == null) {
		return null;
	}

	this.inStr = str; //输入字符串
	this.inputStrLength = str.length; //输入字符串长度

	this.rootAnchor = 0; //匹配词根的起始位置
	this.rootFocus = 0; //匹配词根的当前位置
	var outStr = ""; //输出字符串
	var result = null; //暂存匹配词根的结果

	while (this.rootAnchor < this.inputStrLength) {
		result = this.matchRoot(this.rootAnchor);
		if (result) {
			outStr = outStr + result;
			this.rootAnchor = this.rootFocus + 1;
		} else {
			outStr = outStr + this.inStr[this.rootAnchor];
			this.rootAnchor = this.rootAnchor + 1;
		}
		this.rootFocus = this.rootAnchor;
	}
	return outStr;
}
TextReplacer.prototype.matchRoot = function () {
	var stack = [];
	var current = this.lexTree;
	var focus = this.rootAnchor;
	var item = null;
	var node = null;
	var result = null;
	while (focus < this.inputStrLength) {
		current = current[this.inStr[focus]];
		if (current == null) {
			break;
		}
		if (current.result == null && current.prefix == null && current.suffix == null) {
			;
		} else {
			stack.push({index: focus, node: current});
		}
		focus++;
	}
	while (stack.length > 0) {
		item = stack.pop();
		node = item.node;
		this.rootFocus = item.index;
		if (node.prefix != null) {
			result = this.matchPrefix(node.prefix);
			if (result) {
				return result;
			}
		}
		if (node.suffix != null) {
			result = this.matchSuffix(node.suffix);
			if (result) {
				return result;
			}
		}
		if (node.result != null) {
			return node.result;
		}
	}
	return null;
}
TextReplacer.prototype.matchPrefix = function (root) {
	var stack = [];
	var focus = this.rootAnchor - 1;
	var current = root;
	var node;
	while (focus >= 0) {
		current = current[this.inStr[focus]];
		if (current == null) {
			break;
		}
		if (current.result == null && current.suffix == null) {
			;
		} else {
			stack.push(current);
		}
		focus--;
	}
	while (stack.length > 0) {
		node = stack.pop();
		if (node.suffix != null) {
			return this.matchSuffix(node.suffix);
		} else if (node.result != null) {
			return node.result;
		}
	}
	return null;
}
TextReplacer.prototype.matchSuffix = function (root) {
	var stack = [];
	var focus = this.rootFocus + 1;
	var current = root;
	var node;
	while (focus >= 0) {
		current = current[this.inStr[focus]];
		if (current == null) {
			break;
		}
		if (current.result == null && current.suffix == null) {
			;
		} else {
			stack.push(current);
		}
		focus++;
	}
	while (stack.length > 0) {
		node = stack.pop();
		if (node.result != null) {
			return node.result;
		}
	}
	return null;
}

if (devmode) {
	timestamp = new Date();
}
//根据替换规则构造词法树
var lexTree = new LexTree()
	.addRule("&gt; => >").addRule("&lt; => <")
	.addRule("bàng => 棒").addRule("bào => 爆").addRule("bī => 逼").addRule("bō => 波")
	.addRule("cāo => 操").addRule("cǎo => 草").addRule("cào => 操").addRule("chā => 插").addRule("chāng => 娼").addRule("cháo => 潮").addRule("chōu => 抽").addRule("chuáng => 床").addRule("chūn => 春").addRule("cuō => 搓").addRule("cū => 粗")
	.addRule("dàn => 弹").addRule("dǎng => 党").addRule("dàng => 荡").addRule("diao => 屌").addRule("dòng => 洞")
	.addRule("fǎ => 法").addRule("fù => 妇")
	.addRule("guān => 官")
	.addRule("hán => 含")
	.addRule("jing => 精")
	.addRule("jī => 激").addRule("jiān => 奸").addRule("jiāng => 江").addRule("jiāo => 交").addRule("jìn => 禁").addRule("jīng => 精").addRule("jǐng => 警").addRule("jū => 拘")
	.addRule("kù => 裤")
	.addRule("làng => 浪").addRule("liáo => 撩").addRule("luàn => 乱").addRule("lún => 伦").addRule("luǒ => 裸").addRule("lù => 露")
	.addRule("máo => 毛").addRule("mí => 迷").addRule("mō => 摸")
	.addRule("pào => 炮").addRule("piàn => 片")
	.addRule("qiāng => 枪").addRule("qíng => 情")
	.addRule("ri => 日")
	.addRule("rì => 日").addRule("rǔ => 乳")
	.addRule("se => 色")
	.addRule("sāo => 骚").addRule("sè => 色").addRule("sè => 色").addRule("shā => 杀").addRule("shēn => 呻").addRule("shén => 神").addRule("shè => 射").addRule("shǐ => 屎").addRule("shǔn => 吮").addRule("sǐ => 死").addRule("sū => 酥")
	.addRule("ting => 挺")
	.addRule("tài => 态").addRule("tān => 贪").addRule("tǐ => 体").addRule("tiǎn => 舔").addRule("tiáo => 调").addRule("tǐng => 挺").addRule("tǒng => 捅").addRule("tōu => 偷").addRule("tuǐ => 腿").addRule("tūn => 吞").addRule("tún => 臀")
	.addRule("wēn => 温").addRule("wěn => 吻")
	.addRule("xing => 性")
	.addRule("xī => 吸").addRule("xí => 习").addRule("xìng => 性").addRule("xiōng => 胸").addRule("xué => 穴")
	.addRule("yu => 欲")
	.addRule("yàn => 艳").addRule("yāng => 央").addRule("yào => 药").addRule("yín => 淫").addRule("yòu => 诱").addRule("yù => 欲")
	.addRule("zàng => 藏").addRule("zhà => 炸").addRule("zhèng => 政").addRule("zhōng => 中").addRule("zuì => 罪").addRule("zuò => 做")
	.addRule("德(xing) => 行")
	.addRule("碧(yu) => 玉").addRule("美(yu) => 玉").addRule("(yu)石 => 玉")
	.addRule("十之(**) => 八九").addRule("十有(**) => 八九").addRule("(**)不离十 => 八九")
	.addRule("赤身(**) => 裸体")
	.addRule("感(**)彩 => 情色")
	.addRule("本(*)难移 => 性")
	.addRule("(dang)然无存 => 荡");

if (devmode) {
	alert("构造词法树完成，耗时：" + (new Date().getTime() - timestamp.getTime()) + "毫秒");
}

if (devmode) {
	timestamp = new Date();
}

var decensoredText = new TextReplacer().addLexTree(lexTree).parse(cleanedText);

if (devmode) {
	alert("敏感词修复完成，耗时：" + (new Date().getTime() - timestamp.getTime()) + "毫秒");
}
//-----------------------------------敏感词修复完成----------------------------

//-----------------------------------解析段落工作开始------------------------------
if (devmode) {
	timestamp = new Date();
}

function parseParagraph(source) {
	var tempStr;
	var sectionTagStack = []; //匹配到的章节关键字列表
	var postscript; //后记节点
	var allowTitle = true;
	var box = document.createElement("div");
		box.className = "para_box" 
	var state = "go";

	var indexRootNode = { //索引根节点
		name: "索引",
		level: -1,
		children: []
	};
	var cursorIndex = indexRootNode; //指向索引树的游标

	var action = {};
	action["go"] = {}
	action["go"]["title"] = function (str) {
		var p = document.createElement("p");
		p.appendChild(document.createTextNode(str.replace(/[《》]/g, "")));
		p.className = "title"
		box.appendChild(p);
		var hr = document.createElement("hr");
		hr.className = "h-dec";
		hr.style.margin = "0px -20px";
		box.appendChild(hr);
		allowTitle = false;
	}
	action["go"]["prefaceHead"] = function (str) {
		var p = document.createElement("p");
		p.appendChild(document.createTextNode(str));
		p.className = "sectionHead prefaceHead";
		box.appendChild(p);
		var hr = document.createElement("hr");
		hr.className = "h-dec";
		box.appendChild(hr);

		indexRootNode.children.push(cursorIndex = {
			name: str,
			level: 0,
			children: [],
			parent: indexRootNode,
			dom: p,
			aname: str
		});

		allowTitle = false;
	}
	action["go"]["sectionHead"] = function (str, tag) {
		var p = document.createElement("p");
		p.appendChild(document.createTextNode(str));
		var level = sectionTagStack.indexOf(tag);
		if (level == -1) {
			sectionTagStack.push(tag);
			level = sectionTagStack.indexOf(tag);
		}
		p.className = "sectionHead sectionHead" + level;
		box.appendChild(p);
		var hr = document.createElement("hr");
		hr.className = "h-dec";
		box.appendChild(hr);

		while (cursorIndex.level >= level) {
			cursorIndex = cursorIndex.parent;
		}
		var indexNode = {
			name: str,
			level: level,
			children: [],
			parent: cursorIndex,
			dom: p,
			aname: (cursorIndex.level == -1 ? str : cursorIndex.aname + " -> " + str)
		};
		cursorIndex.children.push(indexNode);
		cursorIndex = indexNode;

		allowTitle = false;
	}
	action["go"]["postscriptHead"] = function (str) {
		var p = document.createElement("p");
		p.appendChild(document.createTextNode(str));
		p.className = "sectionHead postscriptHead";
		box.appendChild(p);
		var hr = document.createElement("hr");
		hr.className = "h-dec";
		box.appendChild(hr);

		indexRootNode.children.push(cursorIndex = {
			name: str,
			level: 0,
			children: [],
			parent: indexRootNode,
			dom: p,
			aname: str
		});

		allowTitle = false;
	}
	action["go"]["paragraph"] = function (str) {
		var p = document.createElement("p");
		p.appendChild(document.createTextNode(str));
		p.className = "paragraph"
		box.appendChild(p);
	}

	var pr = /^[\u0020\u3000\t\n\r]*(?:(《[^\n\r]+》)|(序|序[\u0020\u3000\t]*章|序[\u0020\u3000\t]*言|前[\u0020\u3000\t]*言|引[\u0020\u3000\t]*言|引[\u0020\u3000\t]*子|摘[\u0020\u3000\t]*要|楔[\u0020\u3000\t]*子|背景简介|内容简介)|((?:第[\u0020\u3000\t]*)?(?:(?:[0-9]+(?:.[0-9]+)?)|(?:[〇零一壹二贰三叁四肆五伍六陆七柒八捌九玖十拾百佰千仟万亿萬億廿卅卌]+))[\u0020\u3000\t]*([章节回卷折篇幕集])(?:[\u0020\u3000\t][^\n\r]{1,20}[^\n\r\u0020\u3000\t])?)|(后[\u0020\u3000\t]*记|附[\u0020\u3000\t]*言|结[\u0020\t]*语)|([^\n\r]+))(?=[\u0020\u3000\t]*[\n\r]+)/;
	var r;

	while (true) {
		r = pr.exec(source);
		if (r == null) {
			break;
		}
		// r[0]匹配到的包含分段符的字符串
		if (r[1]) { // r[1]匹配到标题，只匹配一次
			if (allowTitle) {
				action[state]["title"](r[1]);
			} else {
				action[state]["paragraph"](r[1]);
			}
		} else if (r[2]) { // r[2]匹配到的前言
			action[state]["prefaceHead"](r[2]);
		} else if (r[3]) { // r[3]匹配到的段落标题,r[4]匹配到段落关键字
			action[state]["sectionHead"](r[3], r[4]);
		} else if (r[5]) { // r[5]匹配到的后记
			action[state]["postscriptHead"](r[5]);
		} else { // r[6]匹配到的普通段落
			action[state]["paragraph"](r[6]);
		}
		source = source.slice(r[0].length);
	}

	return {box: box, index: indexRootNode};
}

var res = parseParagraph(decensoredText);

if (devmode) {
	alert("解析段落完成，耗时：" + (new Date().getTime() - timestamp.getTime()) + "毫秒");
}
//------------------------解析段落工作完成------------------------------

//------------------------绘制文本工作开始-------------------------------
if (devmode) {
	timestamp = new Date();
}
text_box.appendChild(res.box);

//可自定义样式
var style = document.createElement('style');
style.type = "text/css";
var head = document.head || document.getElementsByTagName('head')[0];
head.appendChild(style);
function setCSSText(str) {
	if (style.styleSheet) {
		style.styleSheet.cssText = str;
	} else {
		style.appendChild(document.createTextNode(str));
	}
}
setCSSText(".paragraph {\n" +
	"\tfont-family: 微软雅黑,文泉驿正黑,苹果丽黑,黑体;\n" +
	"\tfont-size: 18px;\n" +
	"\tline-height: 2em;\n" +
	"}\n" +
	".title {\n" +
	"\tfont-family: 华文新魏,华文魏碑,微软雅黑,文泉驿正黑,苹果丽黑,黑体;\n" +
	"\tfont-size: 44px;\n" +
	"\tfont-weight: bold;\n" +
	"\tmargin: 6 -20px;\n" +
	"}\n" +
	".sectionHead {\n" +
	"\tfont-family: 微软雅黑,文泉驿正黑,苹果丽黑,黑体;\n" +
	"\tfont-size: 19px;\n" +
	"\tmargin: 2em 0 0 0;\n" +
	"}\n" +
	".sectionHead0, .prefaceHead, .postscriptHead {\n" +
	"\tfont-size: 24px;\n" +
	"}\n" +
	".sectionHead1 {\n" +
	"\tfont-size: 22px;\n" +
	"}\n" +
	".sectionHead2 {\n" +
	"\tfont-size: 21px;\n" +
	"}\n" +
	".sectionHead3 {\n" +
	"\tfont-size: 20px;\n" +
	"}\n" +
	".h-dec {\n" +
	"\tcolor: rgba(0, 0, 0, 0.35);\n" +
	"\tmargin: 4px -4px;\n" +
	"}\n"
);
if (devmode) {
	alert("绘制文本工作完成，耗时：" + (new Date().getTime() - timestamp.getTime()) + "毫秒");
}
//------------------------绘制文本工作完成------------------------------

//------------------------绘制索引工作开始-------------------------------
if (devmode) {
	timestamp = new Date();
}

//绘制索引节点函数
function drawIndex(indexNode, container) {
	var indexDiv = document.createElement("div");
	var headDiv = document.createElement("div");
	var iconSpan = document.createElement("span");
	var nameSpan = document.createElement("a");
	indexDiv.style.whiteSpace = "nowrap";
	if (indexNode.children.length > 0) {
		iconSpan.appendChild(document.createTextNode("▶ "));
		iconSpan.style.verticalAlign = ".05em";
		iconSpan.style.cursor = "pointer";
		iconSpan.onclick = function () {
			if (childrenDiv.style.display == "none") {
				childrenDiv.style.display = "block";
				iconSpan.childNodes[0].data = "▼ ";
			} else {
				childrenDiv.style.display = "none";
				iconSpan.childNodes[0].data = "▶ ";
			}
		}
	} else {
		iconSpan.appendChild(document.createTextNode("▶ "));
		iconSpan.style.verticalAlign = ".05em";
		iconSpan.style.visibility = "hidden";
	}
	nameSpan.appendChild(document.createTextNode(indexNode.name));
	nameSpan.style.color = "black";
	nameSpan.style.textDecoration = "none";
	if (indexNode.dom != null) {
		var a = document.createElement("a");
		a.name = indexNode.aname;
		indexNode.dom.insertBefore(a, indexNode.dom.childNodes[0]);
		nameSpan.href = "#" + a.name;
	}
	nameSpan.style.whiteSpace = "nowrap";
	nameSpan.style.width = index_box.style.width.slice(0, -2) + "px";
	headDiv.appendChild(iconSpan);
	headDiv.appendChild(nameSpan);
	headDiv.style.textIndent = new Number(indexNode.level) + "em";
	headDiv.style.verticalAlign = "middle";
	indexDiv.appendChild(headDiv);
	var childrenDiv = document.createElement("div");
	childrenDiv.style.display = "none"
	indexDiv.appendChild(childrenDiv);
	container.appendChild(indexDiv);
	for (var i = 0; i < indexNode.children.length; i++) {
		drawIndex(indexNode.children[i], childrenDiv);
	}
}

//绘制索引
for (var i = 0; i < res.index.children.length; i++) {
	drawIndex(res.index.children[i], index_box);
}

//如果没有索引，则隐藏索引框
if (res.index.children.length == 0) {
	index_containter.style.width = "0px";
	split_line.style.width = "0px";
	pageLayout.style.width = "1004px";
}

if (devmode) {
	alert("索引生成工作完成，耗时：" + (new Date().getTime() - timestamp.getTime()));
}
//--------------------------------索引生成工作完成--------------------------

//--------------------------------关闭后自动恢复功能(HTML5)------------------
var filename = window.location.pathname.split('/').pop();
//保存当前位置
text_containter.onscroll = function () {
	localStorage[filename + "-lastTextPosition"] = this.scrollTop;
}
//滚动到上次位置
if (localStorage[filename + "-lastTextPosition"] != null) {
	text_containter.scrollTop = localStorage[filename + "-lastTextPosition"];
}
//--------------------------------自动恢复功能完成(HTML5)--------------------