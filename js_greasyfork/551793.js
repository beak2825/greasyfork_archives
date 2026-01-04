// ==UserScript==
// @name         知乎下载器
// @namespace    http://howardzhangdqs.eu.org/
// @source       https://github.com/Howardzhangdqs/zhihu-copy-as-markdown
// @version      0.3.36-7b6761
// @description  一键复制知乎文章/回答为Markdown，下载文章/回答为zip（包含素材图片与文章/回答信息），备份你珍贵的回答与文章。
// @author       HowardZhangdqs
// @match        *://www.zhihu.com/*
// @match        *://zhuanlan.zhihu.com/*
// @license      MIT
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/551793/%E7%9F%A5%E4%B9%8E%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/551793/%E7%9F%A5%E4%B9%8E%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

/** 更新日志
 * 23.10.30: 脚本开写
 * 
 * 23.10.31:
 *     feat: 解析、渲染表格
 *     feat: 解析、渲染链接
 *     fix: 加了一个被忘掉的break，但是我忘了是哪忘了加了
 *     fix: 修复编辑框会被加上`复制为Markdown`的按钮
 *     doc: 给types加了完整的注释
 *     doc: 给Lexer和Parser函数添加完整的注释
 *     chore: 更改触发方式
 *     feat: 链接解析为直达链接
 *     feat: 下载内容为zip
 *     feat: 下载的zip中包含内容信息（`info.txt`）
 *     fix: 修复回答详情里图片无法下载
 *     fix: 首页按钮无法正常加载
 * 
 * 23.11.1:
 *     feat: `info.txt`加入作者信息
 *     chore: `info.txt`更名为`info.json`
 *     fix: 主页中`info.json > url`字段获取错误
 *     chore: `info.json`中`url`字段改为`link`
 *     fix: 主页文章作者信息获取错误
 *     chore: 发布在Github上
 *     fix: 无素材内容下来的zip中没有`index.md`
 * 
 * 23.11.3:
 *     feat: 解析想法
 *     feat: 解析、渲染、下载视频（回答/文章中的视频）
 * 
 * 23.11.4:
 *     fix: 按钮无法正常加载
 *     fix: 想法在未展开时就被解析
 *     fix: 修复部分内容同时出现一堆下载按钮以及不出现下载按钮的问题
 *     fix: 修复行内代码无法正确被解析的问题
 * 
 * 23.11.5:
 *     feat: 解析Gif
 *     chore: 更方便的测试
 * 
 * 23.12.5:
 *     feat: 单独成段的内联公式升级为行间公式 [来源](https://zhuanlan.zhihu.com/p/665008681#comment-10744866371)
 *     fix: 表格换行符解析错误
 * 
 * 24.1.19:
 *     feat: 回答批量下载 [Issue](https://github.com/Howardzhangdqs/zhihu-copy-as-markdown/issues/1)
 * 
 * 24.3.22:
 *     fix: 修复部分回答无法下载的问题 [Issue](https://github.com/Howardzhangdqs/zhihu-copy-as-markdown/issues/2)
 *     fix: 修改批量下载中问题描述文件夹名称为"问题描述" https://github.com/Howardzhangdqs/zhihu-copy-as-markdown/issues/2#issuecomment-2014496716
 * 
 * 25.10.7:
 *     feat: 支持保存到本地 Obsidian vault
 *     feat: 使用 File System Access API 直接保存文件到本地文件系统
 *     feat: 自动创建 Attachments 文件夹保存图片和视频
 *     feat: Markdown 中图片链接自动转换为 Obsidian 兼容的相对路径格式
 *     feat: 支持中文路径和文件名
 *     feat: 单个回答保存到 Obsidian
 *     feat: 批量保存问题下所有回答到统一文件夹
 *     feat: 文件名自动清理非法字符，确保跨平台兼容
 *     feat: 为所有 Markdown 添加作者信息头部（作者、链接、来源、版权声明）
 *     fix: 修复 Gif 和 Video 类型文件可能不被下载的问题
 *     fix: 修复图片路径与实际保存文件名不一致的问题
 *     fix: 修复 ZIP 文件路径被包含在文件名中导致引用错误的问题
 *     chore: 添加 Obsidian 功能详细技术文档 (OBSIDIAN_FEATURE.md)
 * 
 */

(() => {
 	"use strict";


const external_saveAs_namespaceObject = saveAs;


const ZhihuLink2NormalLink = (link) => {
    console.log(link);
    const url = new URL(link);
    if (url.hostname == "link.zhihu.com") {
        const target = new URLSearchParams(url.search).get("target");
        console.log(decodeURIComponent(target));
        return decodeURIComponent(target);
    }
    return link;
};

const getParent = (dom, className) => {
    if (dom == null)
        return false;
    if (dom.classList.contains(className))
        return dom;
    else
        return getParent(dom.parentElement, className);
};

const getTitle = (dom) => {
    let title_dom;
   
    title_dom = getParent(dom, "AnswerItem");
    if (title_dom) {
        title_dom = title_dom.querySelector(".ContentItem-title > div > a");
        if (title_dom != null)
            return title_dom.innerText;
    }
   
    title_dom = getParent(dom, "QuestionPage");
    if (title_dom) {
        title_dom = title_dom.querySelector("meta[itemprop=name]");
        if (title_dom != null)
            return title_dom.content;
    }
   
    title_dom = getParent(dom, "ArticleItem");
    if (title_dom) {
        title_dom = title_dom.querySelector("h2.ContentItem-title a");
        if (title_dom != null)
            return title_dom.innerText;
    }
   
    title_dom = getParent(dom, "Post-NormalMain");
    if (title_dom) {
        title_dom = title_dom.querySelector("header > h1.Post-Title");
        if (title_dom != null)
            return title_dom.innerText;
    }
    return "无标题";
};

const getAuthor = (dom) => {
    let author, author_dom;
    try {
       
        author_dom = getParent(dom, "AnswerItem");
       
        if (!author_dom) {
            author_dom = getParent(dom, "ArticleItem");
            if (author_dom)
                author_dom = author_dom.querySelector(".AuthorInfo-content");
        }
       
        if (!author_dom) {
            author_dom = getParent(dom, "Post-Main");
            if (author_dom)
                author_dom = author_dom.querySelector(".Post-Author");
        }
       
        if (!author_dom) {
            author_dom = getParent(dom, "PinItem");
            if (author_dom)
                author_dom = author_dom.querySelector(".PinItem-author");
        }
        if (author_dom) {
            let authorName_dom = author_dom.querySelector(".AuthorInfo-name .UserLink-link");
            let authorBadge_dom = author_dom.querySelector(".AuthorInfo-badgeText");
            console.log("authorName_dom", authorName_dom);
            if (author_dom != null)
                return {
                    name: authorName_dom.innerText || authorName_dom.children[0].getAttribute("alt"),
                    url: authorName_dom.href,
                    badge: authorBadge_dom ? authorBadge_dom.innerText : ""
                };
        }
    }
    catch (e) {
        console.log(e);
    }
    return null;
};

const getURL = (dom) => {
    const currentURL = window.location.origin + window.location.pathname;
    try {
       
        if (window.location.pathname == "/") {
            let content_dom = getParent(dom, "AnswerItem");
            if (!content_dom)
                content_dom = getParent(dom, "ArticleItem");
            if (!content_dom)
                return currentURL + "#WARNING_Failed_to_get_URL";
            return content_dom.querySelector("a[data-za-detail-view-id]").href;
        }
    }
    catch { }
    return currentURL;
};

const MakeButton = () => {
    const $button = document.createElement("button");
    $button.setAttribute("type", "button");
    $button.classList.add("zhihucopier-button");
    $button.innerText = "";
    $button.style.right = "0";
    $button.style.top = "-2em";
    $button.style.zIndex = "999";
    $button.style.width = "120px";
    $button.style.height = "2em";
    $button.style.backgroundColor = "rgba(85, 85, 85, 0.9)";
    $button.style.color = "white";
    $button.style.outline = "none";
    $button.style.cursor = "pointer";
    $button.style.borderRadius = "1em";
    $button.style.margin = "0 .2em 1em .2em";
    $button.style.fontSize = ".8em";
    return $button;
};



var TokenType;
(function (TokenType) {
    TokenType[TokenType["H1"] = 0] = "H1";
    TokenType[TokenType["H2"] = 1] = "H2";
    TokenType[TokenType["Text"] = 2] = "Text";
    TokenType[TokenType["Figure"] = 3] = "Figure";
    TokenType[TokenType["Gif"] = 4] = "Gif";
    TokenType[TokenType["InlineLink"] = 5] = "InlineLink";
    TokenType[TokenType["InlineCode"] = 6] = "InlineCode";
    TokenType[TokenType["Math"] = 7] = "Math";
    TokenType[TokenType["Italic"] = 8] = "Italic";
    TokenType[TokenType["Bold"] = 9] = "Bold";
    TokenType[TokenType["PlainText"] = 10] = "PlainText";
    TokenType[TokenType["UList"] = 11] = "UList";
    TokenType[TokenType["Olist"] = 12] = "Olist";
    TokenType[TokenType["BR"] = 13] = "BR";
    TokenType[TokenType["HR"] = 14] = "HR";
    TokenType[TokenType["Blockquote"] = 15] = "Blockquote";
    TokenType[TokenType["Code"] = 16] = "Code";
    TokenType[TokenType["Link"] = 17] = "Link";
    TokenType[TokenType["Table"] = 18] = "Table";
    TokenType[TokenType["Video"] = 19] = "Video";
})(TokenType || (TokenType = {}));





const lexer = (input) => {
    const tokens = [];
    for (let i = 0; i < input.length; i++) {
        const node = input[i];
        const tagName = node.tagName.toLowerCase();
       
        switch (tagName) {
            case "h2": {
                tokens.push({
                    type: TokenType.H1,
                    text: node.textContent,
                    dom: node
                });
                break;
            }
            case "h3": {
                tokens.push({
                    type: TokenType.H2,
                    text: node.textContent,
                    dom: node
                });
                break;
            }
            case "div": {
                if (node.classList.contains("highlight")) {
                    tokens.push({
                        type: TokenType.Code,
                        content: node.textContent,
                        language: node.querySelector("pre > code").classList.value.slice(9),
                        dom: node
                    });
                }
                else if (node.classList.contains("RichText-LinkCardContainer")) {
                    const link = node.firstChild;
                    tokens.push({
                        type: TokenType.Link,
                        text: link.getAttribute("data-text"),
                        href: ZhihuLink2NormalLink(link.href),
                        dom: node
                    });
                }
                else if (node.querySelector("video")) {
                    tokens.push({
                        type: TokenType.Video,
                        src: node.querySelector("video").getAttribute("src"),
                        local: false,
                        dom: node
                    });
                }
                break;
            }
            case "blockquote": {
                tokens.push({
                    type: TokenType.Blockquote,
                    content: Tokenize(node),
                    dom: node
                });
                break;
            }
            case "figure": {
                const img = node.querySelector("img");
                if (img.classList.contains("ztext-gif")) {
                    const guessSrc = (src) => {
                        return src.replace(/\..{3,4}$/g, ".gif");
                    };
                    const src = guessSrc(img.getAttribute("src") || img.getAttribute("data-thumbnail"));
                    if (src) {
                        tokens.push({
                            type: TokenType.Gif,
                            src,
                            local: false,
                            dom: node
                        });
                    }
                }
                else {
                    const src = img.getAttribute("data-actualsrc") || img.getAttribute("data-original");
                    if (src) {
                        tokens.push({
                            type: TokenType.Figure, src,
                            local: false,
                            dom: node
                        });
                    }
                }
                break;
            }
            case "ul": {
                const childNodes = Array.from(node.querySelectorAll("li"));
                tokens.push({
                    type: TokenType.UList,
                    content: childNodes.map((el) => Tokenize(el)),
                    dom: node,
                });
                break;
            }
            case "ol": {
                const childNodes = Array.from(node.querySelectorAll("li"));
                tokens.push({
                    type: TokenType.Olist,
                    content: childNodes.map((el) => Tokenize(el)),
                    dom: node,
                });
                break;
            }
            case "p": {
                tokens.push({
                    type: TokenType.Text,
                    content: Tokenize(node),
                    dom: node
                });
                break;
            }
            case "hr": {
                tokens.push({
                    type: TokenType.HR,
                    dom: node
                });
                break;
            }
            case "table": {
                const el = node;
                const table2array = (table) => {
                    const res = [];
                    const rows = Array.from(table.rows);
                    for (let row of rows) {
                        const cells = Array.from(row.cells);
                        res.push(cells.map((cell) => cell.innerHTML.replace(/<a.*?href.*?>(.*?)<svg.*?>.*?<\/svg><\/a>/gms, "$1").replace(/<span>(.*?)<\/span>/gms, "$1")));
                    }
                    return res;
                };
                const table = table2array(el);
                tokens.push({
                    type: TokenType.Table,
                    content: table,
                    dom: node,
                });
                break;
            }
        }
       
    }
    console.log(tokens);
    return tokens;
};

const Tokenize = (node) => {
    if (typeof node == "string") {
        return [{
                type: TokenType.PlainText,
                text: node,
            }];
    }
    let childs = Array.from(node.childNodes);
    const res = [];
   
    try {
        if (childs.length == 1 && childs[0].tagName.toLowerCase() == "p") {
            childs = Array.from(childs[0].childNodes);
        }
    }
    catch { }
    for (let child of childs) {
        if (child.nodeType == child.TEXT_NODE) {
            res.push({
                type: TokenType.PlainText,
                text: child.textContent,
                dom: child,
            });
        }
        else {
            let el = child;
            switch (el.tagName.toLowerCase()) {
                case "b": {
                    res.push({
                        type: TokenType.Bold,
                        content: Tokenize(el),
                        dom: el,
                    });
                    break;
                }
                case "i": {
                    res.push({
                        type: TokenType.Italic,
                        content: Tokenize(el),
                        dom: el,
                    });
                    break;
                }
                case "br": {
                    res.push({
                        type: TokenType.BR,
                        dom: el,
                    });
                    break;
                }
                case "code": {
                    res.push({
                        type: TokenType.InlineCode,
                        content: el.innerText,
                        dom: el,
                    });
                    break;
                }
                case "span": {
                    try {
                        if (el.classList.contains("ztext-math")) {
                            res.push({
                                type: TokenType.Math,
                                content: el.getAttribute("data-tex"),
                                dom: el,
                            });
                        }
                        else {
                            if (el.children[0].classList.contains("RichContent-EntityWord")) {
                                res.push({
                                    type: TokenType.PlainText,
                                    text: el.innerText,
                                    dom: el,
                                });
                            }
                        }
                    }
                    catch {
                        res.push({
                            type: TokenType.PlainText,
                            text: el.innerText,
                            dom: el,
                        });
                    }
                    break;
                }
                case "a": {
                    res.push({
                        type: TokenType.InlineLink,
                        text: el.textContent,
                        href: ZhihuLink2NormalLink(el.href),
                        dom: el,
                    });
                    break;
                }
            }
        }
    }
    return res;
};




const parser = (input) => {
    const output = [];
    for (let i = 0; i < input.length; i++) {
        const token = input[i];
        switch (token.type) {
            case TokenType.Code:
                {
                    output.push(`\`\`\`${token.language ? token.language : ""}\n${token.content}${token.content.endsWith("\n") ? "" : "\n"}\`\`\``);
                    break;
                }
                ;
            case TokenType.UList:
                {
                    output.push(token.content.map((item) => `- ${renderRich(item)}`).join("\n"));
                    break;
                }
                ;
            case TokenType.Olist:
                {
                    output.push(token.content.map((item, index) => `${index + 1}. ${renderRich(item)}`).join("\n"));
                    break;
                }
                ;
            case TokenType.H1:
                {
                    output.push(`# ${token.text}`);
                    break;
                }
                ;
            case TokenType.H2:
                {
                    output.push(`## ${token.text}`);
                    break;
                }
                ;
            case TokenType.Blockquote:
                {
                    output.push(renderRich(token.content, "> "));
                    break;
                }
                ;
            case TokenType.Text:
                {
                    output.push(renderRich(token.content));
                    break;
                }
                ;
            case TokenType.HR:
                {
                    output.push("\n---\n");
                    break;
                }
                ;
            case TokenType.Link:
                {
                    output.push(`[${token.text}](${token.href})`);
                    break;
                }
                ;
            case TokenType.Figure:
                {
                    output.push(`![](${token.local ? token.localSrc : token.src})`);
                    break;
                }
                ;
            case TokenType.Gif:
                {
                    output.push(`![](${token.local ? token.localSrc : token.src})`);
                    break;
                }
                ;
            case TokenType.Video:
                {
                   
                    const dom = document.createElement("video");
                    dom.setAttribute("src", token.local ? token.localSrc : token.src);
                    if (!token.local)
                        dom.setAttribute("data-info", "文件还未下载，随时可能失效，请使用`下载全文为Zip`将视频一同下载下来");
                    output.push(dom.outerHTML);
                    break;
                }
                ;
            case TokenType.Table:
                {
                    console.log(token);
                    const rows = token.content;
                    const cols = rows[0].length;
                    const widths = new Array(cols).fill(0);
                    const res = [];
                    for (let i in rows) {
                        for (let j in rows[i]) {
                            widths[j] = Math.max(widths[j], rows[i][j].length);
                        }
                    }
                    const renderRow = (row) => {
                        let res = "";
                        for (let i = 0; i < cols; i++) {
                            res += `| ${row[i].padEnd(widths[i])} `;
                        }
                        res += "|";
                        return res;
                    };
                    const renderSep = () => {
                        let res = "";
                        for (let i = 0; i < cols; i++) {
                            res += `| ${"-".repeat(widths[i])} `;
                        }
                        res += "|";
                        return res;
                    };
                    res.push(renderRow(rows[0]));
                    res.push(renderSep());
                    for (let i = 1; i < rows.length; i++) {
                        res.push(renderRow(rows[i]));
                    }
                    output.push(res.join("\n"));
                    break;
                }
                ;
        }
    }
    return output;
};

const renderRich = (input, joint = "") => {
    let res = "";
    for (let el of input) {
        switch (el.type) {
            case TokenType.Bold:
                {
                    res += `**${renderRich(el.content)}**`;
                    break;
                }
                ;
            case TokenType.Italic:
                {
                    res += `*${renderRich(el.content)}*`;
                    break;
                }
                ;
            case TokenType.InlineLink:
                {
                    res += `[${el.text}](${el.href})`;
                    break;
                }
                ;
            case TokenType.PlainText:
                {
                    res += el.text;
                    break;
                }
                ;
            case TokenType.BR:
                {
                    res += "\n" + joint;
                    break;
                }
                ;
            case TokenType.InlineCode:
                {
                    res += `\`${el.content}\``;
                    break;
                }
                ;
            case TokenType.Math:
                {
                    if (input.length == 1)
                        res += `$$\n${el.content}\n$$`;
                    else
                        res += `$${el.content}$`;
                    break;
                }
                ;
        }
    }
    return joint + res;
};


const external_JSZip_namespaceObject = JSZip;


async function downloadAndZip(url, zip) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const fileName = url.replace(/\?.*?$/g, "").split("/").pop();
   
    zip.file(fileName, arrayBuffer);
    return { zip, file_name: fileName };
}

async function downloadAndZipAll(urls, zip) {
    for (let url of urls)
        zip = (await downloadAndZip(url, zip)).zip;
    return zip;
}






 const savelex = (async (lex, assetsPath = "assets") => {
    const zip = new external_JSZip_namespaceObject();
   
    let hasMedia = false;
    for (let token of lex) {
        if (token.type === TokenType.Figure || token.type === TokenType.Gif || token.type === TokenType.Video) {
            hasMedia = true;
            break;
        }
    }
    if (hasMedia) {
        const assetsFolder = zip.folder(assetsPath);
        for (let token of lex) {
            if (token.type === TokenType.Figure) {
                const { file_name } = await downloadAndZip(token.src, assetsFolder);
                token.localSrc = `./${assetsPath}/${file_name}`;
                token.local = true;
            }
            else if (token.type === TokenType.Video) {
                const { file_name } = await downloadAndZip(token.src, assetsFolder);
                token.localSrc = `./${assetsPath}/${file_name}`;
                token.local = true;
            }
            else if (token.type === TokenType.Gif) {
                const { file_name } = await downloadAndZip(token.src, assetsFolder);
                token.localSrc = `./${assetsPath}/${file_name}`;
                token.local = true;
            }
        }
        ;
    }
    const markdown = parser(lex).join("\n\n");
    zip.file("index.md", markdown);
    return zip;
});






const getUUID = () => {
    return "xxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0, v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
 const NormalItem = (async (dom) => {
    const lex = lexer(dom.childNodes);
    const zopQuestion = (() => {
        const element = document.querySelector("[data-zop-question]");
        try {
            if (element instanceof HTMLElement)
                return JSON.parse(decodeURIComponent(element.getAttribute("data-zop-question")));
        }
        catch { }
        return null;
    })();
    const zop = (() => {
        let element = getParent(dom, "AnswerItem");
        if (!element)
            element = getParent(dom, "Post-content");
        try {
            if (element instanceof HTMLElement)
                return JSON.parse(decodeURIComponent(element.getAttribute("data-zop")));
        }
        catch { }
        return null;
    })();
    const zaExtra = (() => {
        const element = document.querySelector("[data-za-extra-module]");
        try {
            if (element instanceof HTMLElement)
                return JSON.parse(decodeURIComponent(element.getAttribute("data-za-extra-module")));
        }
        catch { }
        return null;
    })();
    const title = getTitle(dom), author = getAuthor(dom);
    const url = getURL(dom);
   
    const contentMarkdown = parser(lex);
   
    const authorName = author?.name || "未知作者";
    const header = [
        `作者：${authorName}`,
        `链接：${url}`,
        `来源：知乎`,
        `著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。`,
        `---`
    ];
   
    const markdown = [...header, ...contentMarkdown];
    const zip = await savelex(lex);
    zip.file("info.json", JSON.stringify({
        title, url, author,
        zop,
        "zop-question": zopQuestion,
        "zop-extra-module": zaExtra,
    }, null, 4));
    const itemId = (zop || {}).itemId || getUUID();
    return { lex, markdown, zip, title: title, itemId };
});




const pinsLexer_lexer = (dom) => {
    const res = {
        type: TokenType.Text,
        content: [],
    };
    const text = dom.innerText;
    text.split("\n").forEach((line) => {
        res.content.push({
            type: TokenType.PlainText,
            text: line,
        });
        res.content.push({
            type: TokenType.BR,
        });
    });
    return [res];
};







 const PinItem = (async (dom) => {
    const lex = pinsLexer_lexer(dom);
    const pinItem = getParent(dom, "PinItem");
    if (pinItem) {
       
        const imgs = Array.from(pinItem.querySelectorAll(".Image-PreviewVague > img"));
        imgs.forEach((img) => {
            lex.push({
                type: TokenType.Figure,
                src: img.getAttribute("data-original") || img.getAttribute("data-actualsrc"),
            });
        });
    }
   
    const contentMarkdown = parser(lex);
    const { zop, zaExtra } = (() => {
        let el = getParent(dom, "PinItem");
        try {
            if (el)
                return {
                    zop: JSON.parse(decodeURIComponent(el.getAttribute("data-zop"))),
                    zaExtra: JSON.parse(decodeURIComponent(el.getAttribute("data-za-extra-module")))
                };
        }
        catch { }
        return { zop: null, zaExtra: null };
    })();
    const author = getAuthor(dom), url = "https://www.zhihu.com/pin/" + zop.itemId;
   
    const authorName = author?.name || "未知作者";
    const header = [
        `作者：${authorName}`,
        `链接：${url}`,
        `来源：知乎`,
        `著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。`,
        `---`
    ];
   
    const markdown = [...header, ...contentMarkdown];
    const zip = await savelex(lex);
    zip.file("info.json", JSON.stringify({
        author, url: "https://www.zhihu.com/pin/" + zop.itemId,
        zop,
        "zop-extra-module": zaExtra,
    }, null, 4));
    return {
        lex,
        markdown,
        zip,
        title: "想法",
        itemId: zop.itemId,
    };
});




function loadObsidianConfig() {
    const config = localStorage.getItem("zhihu-obsidian-config");
    if (config) {
        const parsed = JSON.parse(config);
        return {
            attachmentFolder: parsed.attachmentFolder || "Attachments",
        };
    }
    return {
        attachmentFolder: "Attachments",
    };
}

function saveObsidianConfig(config) {
    const current = loadObsidianConfig();
    const updated = { ...current, ...config };
    localStorage.setItem("zhihu-obsidian-config", JSON.stringify(updated));
}

function sanitizeFilename(filename) {
    if (!filename || typeof filename !== 'string') {
        return 'untitled';
    }
    return filename
       
        .replace(/[\x00-\x1f\x7f-\x9f]/g, '')
       
        .replace(/[<>:"/\\|?*]/g, '-')
       
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
       
        .replace(/\s+/g, ' ')
       
        .trim()
       
        .replace(/\.{2,}/g, '.')
       
        .replace(/^[.\s]+|[.\s]+$/g, '')
       
        .substring(0, 200)
       
        .replace(/[.\s]+$/, '')
       
        || 'untitled';
}

async function selectObsidianVault() {
    try {
       
        if (!("showDirectoryPicker" in window)) {
            alert("您的浏览器不支持文件系统访问功能，请使用 Chrome 或 Edge 浏览器");
            return null;
        }
        const dirHandle = await window.showDirectoryPicker({
            mode: "readwrite",
        });
        return dirHandle;
    }
    catch (err) {
        if (err.name !== "AbortError") {
            console.error("选择目录失败:", err);
        }
        return null;
    }
}

function generateObsidianMarkdown(markdown, lex, config) {
    let result = markdown.join("\n\n");
   
    const safeAttachmentFolder = sanitizeFilename(config.attachmentFolder);
   
    for (const token of lex) {
        if (token.type === TokenType.Figure || token.type === TokenType.Gif) {
           
            const originalSrc = token.local && token.localSrc ? token.localSrc : token.src;
            if (originalSrc) {
               
                const filename = originalSrc.split("/").pop();
               
                const safeFilename = sanitizeFilename(filename);
                const obsidianPath = `${safeAttachmentFolder}/${safeFilename}`;
               
                result = result.replace(`![](${originalSrc})`, `![](${obsidianPath})`);
                result = result.replace(`![](${token.src})`, `![](${obsidianPath})`);
            }
        }
        else if (token.type === TokenType.Video) {
            const originalSrc = token.local && token.localSrc ? token.localSrc : token.src;
            if (originalSrc) {
                const filename = originalSrc.split("/").pop();
               
                const safeFilename = sanitizeFilename(filename);
                const obsidianPath = `${safeAttachmentFolder}/${safeFilename}`;
                result = result.replace(originalSrc, obsidianPath);
                result = result.replace(token.src, obsidianPath);
            }
        }
    }
    return result;
}

async function saveToObsidian(zip, title, markdown, lex, vaultHandle, config) {
    try {
       
        const safeAttachmentFolder = sanitizeFilename(config.attachmentFolder);
        const attachmentDirHandle = await vaultHandle.getDirectoryHandle(safeAttachmentFolder, { create: true });
       
        const files = Object.keys(zip.files);
        const attachmentFiles = files.filter((name) => !name.endsWith("info.json") && !name.endsWith(".md"));
        for (const filename of attachmentFiles) {
            const file = zip.files[filename];
            if (!file.dir) {
                const content = await file.async("uint8array");
               
                const pureFilename = filename.split("/").pop();
               
                const safeFilename = sanitizeFilename(pureFilename);
                const fileHandle = await attachmentDirHandle.getFileHandle(safeFilename, {
                    create: true,
                });
                const writable = await fileHandle.createWritable();
                await writable.write(content);
                await writable.close();
            }
        }
       
        const obsidianMarkdown = generateObsidianMarkdown(markdown, lex, config);
       
        const safeTitle = sanitizeFilename(title);
        const mdFilename = `${safeTitle}.md`;
        const mdFileHandle = await vaultHandle.getFileHandle(mdFilename, {
            create: true,
        });
        const writable = await mdFileHandle.createWritable();
        await writable.write(obsidianMarkdown);
        await writable.close();
        return {
            success: true,
            message: `已保存到 Obsidian: ${mdFilename}`,
            mdPath: mdFilename,
        };
    }
    catch (err) {
        console.error("保存到 Obsidian 失败:", err);
        return {
            success: false,
            message: `保存失败: ${err.message}`,
        };
    }
}

async function batchSaveToObsidian(items, vaultHandle, questionTitle) {
    try {
        const config = loadObsidianConfig();
       
        const safeQuestionTitle = sanitizeFilename(questionTitle);
        const questionDirHandle = await vaultHandle.getDirectoryHandle(safeQuestionTitle, { create: true });
       
        const safeAttachmentFolder = sanitizeFilename(config.attachmentFolder);
        const attachmentDirHandle = await questionDirHandle.getDirectoryHandle(safeAttachmentFolder, { create: true });
       
        for (const item of items) {
           
            const files = Object.keys(item.zip.files);
            const attachmentFiles = files.filter((name) => !name.endsWith("info.json") && !name.endsWith(".md"));
            for (const filename of attachmentFiles) {
                const file = item.zip.files[filename];
                if (!file.dir) {
                    const content = await file.async("uint8array");
                   
                    const pureFilename = filename.split("/").pop();
                   
                    const safeFilename = sanitizeFilename(pureFilename);
                    const fileHandle = await attachmentDirHandle.getFileHandle(safeFilename, {
                        create: true,
                    });
                    const writable = await fileHandle.createWritable();
                    await writable.write(content);
                    await writable.close();
                }
            }
           
            const obsidianMarkdown = generateObsidianMarkdown(item.markdown, item.lex, config);
            const combinedTitle = `${item.title}-${item.itemId || "unknown"}`;
            const safeTitle = sanitizeFilename(combinedTitle);
            const mdFilename = `${safeTitle}.md`;
            const mdFileHandle = await questionDirHandle.getFileHandle(mdFilename, {
                create: true,
            });
            const writable = await mdFileHandle.createWritable();
            await writable.write(obsidianMarkdown);
            await writable.close();
        }
        return {
            success: true,
            message: `已保存 ${items.length} 个回答到 Obsidian`,
        };
    }
    catch (err) {
        console.error("批量保存到 Obsidian 失败:", err);
        return {
            success: false,
            message: `保存失败: ${err.message}`,
        };
    }
}








const allResults = [];
let obsidianVaultHandle = null;
const AddResult = (result) => {
   
    if (allResults.every((item) => item.dom !== result.dom))
        allResults.push(result);
};
const downloadAllResults = async () => {
    const zip = new external_JSZip_namespaceObject();
    allResults.forEach((item) => {
        const folderName = `${item.title}-${item.itemId}`;
        Object.keys(item.zip.files).forEach(val => {
            zip.files[folderName + "/" + val] = item.zip.files[val];
        });
    });
    (0,external_saveAs_namespaceObject.saveAs)(await zip.generateAsync({ type: "blob" }), `问题『${allResults[0].title}』下的${allResults.length}个回答.zip`);
    console.log(zip);
    return zip;
};
const main = async () => {
    console.log("Starting…");
    const RichTexts = Array.from(document.querySelectorAll(".RichText"));
    const Titles = Array.from(document.getElementsByClassName("QuestionHeader-title"));
    for (let RichText of RichTexts) {
        try {
           
            let RichTextChilren = Array.from(RichText.children);
            for (let i = 1; i < RichTextChilren.length; i++) {
                const el = RichTextChilren[i];
                if (el.classList.contains("zhihucopier-button"))
                    el.remove();
                else
                    break;
            }
        }
        catch { }
        try {
            try {
                if (RichText.parentElement.classList.contains("Editable"))
                    continue;
                if (RichText.children[0].classList.contains("zhihucopier-button"))
                    continue;
                if (RichText.children[0].classList.contains("Image-Wrapper-Preview"))
                    continue;
                if (getParent(RichText, "PinItem")) {
                    const richInner = getParent(RichText, "RichContent-inner");
                    if (richInner && richInner.querySelector(".ContentItem-more"))
                        continue;
                }
                ;
            }
            catch { }
           
            const ButtonContainer = document.createElement("div");
            RichText.prepend(ButtonContainer);
            ButtonContainer.classList.add("zhihucopier-button");
            let result;
            if (getParent(RichText, "PinItem")) {
               
                const richInner = getParent(RichText, "RichContent-inner");
                if (richInner && richInner.querySelector(".ContentItem-more"))
                    continue;
                const res = await PinItem(RichText);
                result = {
                    markdown: res.markdown,
                    zip: res.zip,
                    title: res.title,
                    dom: RichText,
                    itemId: res.itemId,
                    lex: res.lex,
                };
            }
            else {
               
                const res = await NormalItem(RichText);
                result = {
                    markdown: res.markdown,
                    zip: res.zip,
                    title: res.title,
                    dom: RichText,
                    itemId: res.itemId,
                    lex: res.lex,
                };
                if (getParent(RichText, "QuestionRichText")) {
                    result.question = true;
                    result.itemId = "问题描述";
                }
            }
            ;
            AddResult(result);
           
            const ButtonObsidian = MakeButton();
            ButtonObsidian.innerHTML = "保存到Obsidian";
            ButtonObsidian.style.width = "100px";
            ButtonObsidian.style.marginLeft = ".2em";
            ButtonContainer.prepend(ButtonObsidian);
            ButtonObsidian.addEventListener("click", async () => {
                try {
                   
                    if (!obsidianVaultHandle) {
                        ButtonObsidian.innerHTML = "选择Obsidian路径...";
                        obsidianVaultHandle = await selectObsidianVault();
                        if (!obsidianVaultHandle) {
                            ButtonObsidian.innerHTML = "保存到Obsidian";
                            return;
                        }
                    }
                    ButtonObsidian.innerHTML = "保存中...";
                    const config = loadObsidianConfig();
                    const saveResult = await saveToObsidian(result.zip, result.title, result.markdown, result.lex, obsidianVaultHandle, config);
                    if (saveResult.success) {
                        ButtonObsidian.innerHTML = "保存成功✅";
                        setTimeout(() => {
                            ButtonObsidian.innerHTML = "保存到Obsidian";
                        }, 2000);
                    }
                    else {
                        ButtonObsidian.innerHTML = "保存失败❌";
                        alert(saveResult.message);
                        setTimeout(() => {
                            ButtonObsidian.innerHTML = "保存到Obsidian";
                        }, 2000);
                    }
                }
                catch (err) {
                    console.error(err);
                    ButtonObsidian.innerHTML = "发生错误";
                    setTimeout(() => {
                        ButtonObsidian.innerHTML = "保存到Obsidian";
                    }, 2000);
                }
            });
           
            const ButtonZipDownload = MakeButton();
            ButtonZipDownload.innerHTML = "下载全文为Zip";
            ButtonZipDownload.style.borderRadius = "0 1em 1em 0";
            ButtonZipDownload.style.width = "100px";
            ButtonZipDownload.style.paddingRight = ".4em";
            ButtonContainer.prepend(ButtonZipDownload);
            ButtonZipDownload.addEventListener("click", async () => {
                try {
                    const blob = await result.zip.generateAsync({ type: "blob" });
                    (0,external_saveAs_namespaceObject.saveAs)(blob, result.title + "-" + result.itemId + ".zip");
                    ButtonZipDownload.innerHTML = "下载成功✅";
                    setTimeout(() => {
                        ButtonZipDownload.innerHTML = "下载全文为Zip";
                    }, 1000);
                }
                catch {
                    ButtonZipDownload.innerHTML = "发生未知错误<br>请联系开发者";
                    ButtonZipDownload.style.height = "4em";
                    setTimeout(() => {
                        ButtonZipDownload.style.height = "2em";
                        ButtonZipDownload.innerHTML = "下载全文为Zip";
                    }, 1000);
                }
            });
           
            const ButtonCopyMarkdown = MakeButton();
            ButtonCopyMarkdown.innerHTML = "复制为Markdown";
            ButtonCopyMarkdown.style.borderRadius = "1em 0 0 1em";
            ButtonCopyMarkdown.style.paddingLeft = ".4em";
            ButtonContainer.prepend(ButtonCopyMarkdown);
            ButtonCopyMarkdown.addEventListener("click", () => {
                try {
                    navigator.clipboard.writeText(result.markdown.join("\n\n"));
                    ButtonCopyMarkdown.innerHTML = "复制成功✅";
                    setTimeout(() => {
                        ButtonCopyMarkdown.innerHTML = "复制为Markdown";
                    }, 1000);
                }
                catch {
                    ButtonCopyMarkdown.innerHTML = "发生未知错误<br>请联系开发者";
                    ButtonCopyMarkdown.style.height = "4em";
                    setTimeout(() => {
                        ButtonCopyMarkdown.style.height = "2em";
                        ButtonCopyMarkdown.innerHTML = "复制为Markdown";
                    }, 1000);
                }
            });
        }
        catch (e) {
            console.log(e);
        }
    }
   
    Titles.forEach((titleItem) => {
        if (titleItem.querySelector(".zhihucopier-button"))
            return;
       
        const ButtonBatchObsidian = MakeButton();
        ButtonBatchObsidian.style.width = "105px";
        ButtonBatchObsidian.style.fontSize = "13px";
        ButtonBatchObsidian.style.lineHeight = "13px";
        ButtonBatchObsidian.style.margin = "0";
        ButtonBatchObsidian.style.marginRight = ".4em";
        ButtonBatchObsidian.innerHTML = "批量保存到Obsidian";
        ButtonBatchObsidian.classList.add("zhihucopier-button");
       
        const Button = MakeButton();
        Button.style.width = "75px";
       
        Button.style.fontSize = "13px";
        Button.style.lineHeight = "13px";
        Button.style.margin = "0";
        Button.innerHTML = "批量下载";
        Button.classList.add("zhihucopier-button");
        if (getParent(titleItem, "App-main")) {
            titleItem.append(ButtonBatchObsidian);
            titleItem.append(Button);
        }
        else {
            Button.style.marginRight = ".4em";
            titleItem.prepend(Button);
            titleItem.prepend(ButtonBatchObsidian);
        }
       
        ButtonBatchObsidian.addEventListener("click", async (e) => {
            e.stopPropagation();
            e.preventDefault();
            try {
               
                if (!obsidianVaultHandle) {
                    ButtonBatchObsidian.innerHTML = "选择Obsidian路径...";
                    obsidianVaultHandle = await selectObsidianVault();
                    if (!obsidianVaultHandle) {
                        ButtonBatchObsidian.innerHTML = "批量保存到Obsidian";
                        return;
                    }
                }
                ButtonBatchObsidian.innerHTML = "保存中...";
                const questionTitle = titleItem.textContent.trim();
               
                const itemsToSave = allResults.map((item) => ({
                    zip: item.zip,
                    title: item.title,
                    markdown: item.markdown,
                    lex: item.lex,
                    itemId: item.itemId,
                }));
                const saveResult = await batchSaveToObsidian(itemsToSave, obsidianVaultHandle, questionTitle);
                if (saveResult.success) {
                    ButtonBatchObsidian.style.width = "130px";
                    ButtonBatchObsidian.innerHTML = "保存成功✅";
                    setTimeout(() => {
                        ButtonBatchObsidian.innerHTML = "批量保存到Obsidian";
                        ButtonBatchObsidian.style.width = "105px";
                    }, 2000);
                }
                else {
                    ButtonBatchObsidian.style.width = "130px";
                    ButtonBatchObsidian.innerHTML = "保存失败❌";
                    alert(saveResult.message);
                    setTimeout(() => {
                        ButtonBatchObsidian.innerHTML = "批量保存到Obsidian";
                        ButtonBatchObsidian.style.width = "105px";
                    }, 2000);
                }
            }
            catch (err) {
                console.error(err);
                ButtonBatchObsidian.style.width = "190px";
                ButtonBatchObsidian.innerHTML = "发生未知错误，请联系开发者";
                setTimeout(() => {
                    ButtonBatchObsidian.innerHTML = "批量保存到Obsidian";
                    ButtonBatchObsidian.style.width = "105px";
                }, 2000);
            }
        });
       
        Button.addEventListener("click", (e) => {
            e.stopPropagation();
            e.preventDefault();
            try {
                downloadAllResults();
                Button.style.width = "90px";
                Button.innerHTML = "下载成功✅";
                setTimeout(() => {
                    Button.innerHTML = "批量下载";
                    Button.style.width = "75px";
                }, 1000);
            }
            catch {
                Button.style.width = "190px";
                Button.innerHTML = "发生未知错误，请联系开发者";
                setTimeout(() => {
                    Button.innerHTML = "批量下载";
                    Button.style.width = "75px";
                }, 1000);
            }
        });
    });
};
setTimeout(main, 300);
setInterval(main, 1000);




 })()
;