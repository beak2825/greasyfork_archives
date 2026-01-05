// ==UserScript==
// @name            douban_shenzhenLib
// @name:zh-CN      深圳图书馆图书信息豆瓣脚本
// @namespace       http://www.douban.com/note/180166013/
// @description     Show book available info in douban book page, adds "Search in Douban" in Shenzhen Libaray opac search page
// @description:zh-cn  为豆瓣书籍页面(book.douban.com)添加书籍在深圳图书馆的信息，预借链接，为深圳图书馆查询页面添加“在豆瓣搜索”
// @license         MIT License
// @supportURL      http://www.douban.com/note/180166013/
// @version         1.24.14
// @require         http://code.jquery.com/jquery-1.4.4.min.js
// @match           https://book.douban.com/*
// @match           https://search.douban.com/book/subject_search*
// @match           https://www.szlib.org.cn/opac/searchShow*
// @grant           GM_addStyle
// @grant           GM_xmlhttpRequest
// @grant           GM_registerMenuCommand
// @grant           GM_getValue
// @grant           GM_setValue
// @author          morningSky
// refer            books_recommend_THU, bean vine (49911) and others...
// @downloadURL https://update.greasyfork.org/scripts/5898/douban_shenzhenLib.user.js
// @updateURL https://update.greasyfork.org/scripts/5898/douban_shenzhenLib.meta.js
// ==/UserScript==

// updateDate       2023-11-09
/* reason
1. 更新罗湖、宝安图书馆链接
*/


var fDebug = false;
var title, isbn, isbn10;

var SZLIB_HOST = 'https://www.szlib.org.cn/';
var LIBOPAC_URL = SZLIB_HOST + 'opac/searchShow?library=all&v_tablearray=bibliosm,serbibm,apabibibm,mmbibm,&sortfield=ptitle&sorttype=desc&pageNum=10';

var LIB_API_PARAM_URL = SZLIB_HOST + 'api/opacservice/getQueryResult?library=all&v_tablearray=bibliosm,serbibm,apabibibm,mmbibm,&sortfield=ptitle&sorttype=desc&pageNum=10&v_page=1&v_secondquery=&client_id=t1';

var LIB_API_RESERVABLE_URL = SZLIB_HOST + 'api/opacservice/canPreborrowlist?client_id=t1&';

// 查询索书号
var LIB_API_PREHOLDING_URL = SZLIB_HOST + 'api/opacservice/getpreholding?metaTable=bibliosm&library=all&client_id=t1&metaId=';

var LIBBOOK_URL = SZLIB_HOST + 'opac/searchDetail?tablename=bibliosm&library=all&recordid=';

var LIB_RESERVE_URL = SZLIB_HOST + 'MyLibrary/Reader-Access.jsp?destPage=' + SZLIB_HOST + 'MyLibrary/ReserveSubmit.jsp&v_tablearray=bibliosm&v_TableName=80000002&v_recno=';
var LIB_EXPRESS_URL = SZLIB_HOST + 'MyLibrary/Reader-Access.jsp?destPage=' + SZLIB_HOST + 'opac/searchShow?library=all&v_tablearray=bibliosm,serbibm,apabibibm,mmbibm,&sortfield=ptitle&sorttype=desc&pageNum=10&v_index=isbn&v_value=';

var HTML_LOADING = '<font color="grey">正在查询图书馆馆藏情况&nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;· </font>';
var LIBSEARCH_LINK_PRE = '<a title="点击前往图书馆搜索" target="_blank" ';
var LIBSEARCH_LINK_SUF = '在深圳图书馆搜索</a>';


// main body of the script

function isEmptyStr(vStr) {
	return vStr == null || vStr.length == 0 || /^\s*$/.test(vStr);
}

// 仅用于从缓存中解析值，所以只检查string，boolean两种类型，值只检查小写
function isTrue(vVal) {
    var flag = false;
    if (typeof vVal == "string") {
        if (!isEmptyStr(vVal) && vVal === "true") {
            flag = true;
        }
    }
    if (typeof vVal == "boolean") {
        flag = vVal;
    }
    if(fDebug) console.log("param:" + vVal + ", boolean: " + flag);
    return flag;
}

function getLibIsbnUrl(vIsbn) {
    return LIBOPAC_URL + '&v_index=isbn&v_value=' + vIsbn;
}

function getLibTitleUrl(vTitle) {
    return LIBOPAC_URL + '&v_index=title&v_value=' + encodeURIComponent(vTitle);
}

function getLibIsbnApiUrl(vIsbn) {
	return LIB_API_PARAM_URL + '&v_index=isbn&v_value=' + vIsbn;
}

function getLibTitleApiUrl(vTitle) {
	return LIB_API_PARAM_URL + '&v_index=title&v_value=' + encodeURIComponent(vTitle);
}

function getLibBookUrl(bookRecNo) {
	return LIBBOOK_URL + bookRecNo;
}

function getDoubanSearchUrl(keyword) {
    return 'http://search.douban.com/book/subject_search?cat=1001&cat=&search_text=' + keyword;
}

function getLibHeadHtml() {
    var htmlStr = '<ul>';
    // http://www.szln.gov.cn/lib/library.do
    /*htmlStr += '<li><a style="float:right" target="_blank"  href="http://www.szlib.gov.cn">深圳图书馆</a></li>';*/
    //<span class="membArrow">&nbsp;</span>
    htmlStr += '<li><div class="libMem">';
    htmlStr += '<a class="libMemLink" href="#more" >成员馆</a>';
    htmlStr += '<ul class="libMemMenu">';
    htmlStr += '<li><a href="https://www.szlib.org.cn" target="_blank" title="深圳图书馆">深圳图书馆</a></li>';
    htmlStr += '<li><a href="https://www.szclib.org.cn" target="_blank" title="深圳少年儿童图书馆">少年儿童图书馆</a></li>';
    htmlStr += '<li><a href="https://www.utszlib.edu.cn" target="_blank" title="深圳市大学城图书馆即科技图书馆">大学城图书馆</a></li>';
    htmlStr += '<li><a href="https://www.szlhlib.org.cn" target="_blank" title="深圳市罗湖区图书馆">罗湖区图书馆</a></li>';
    htmlStr += '<li><a href="https://www.szftlib.org.cn" target="_blank" title="深圳市福田区图书馆">福田区图书馆</a></li>';
    htmlStr += '<li><a href="https://www.nslib.cn" target="_blank" title="深圳市南山区图书馆">南山区图书馆</a></li>';
    htmlStr += '<li><a href="http://ytlib.yantian.org.cn" target="_blank" title="深圳市盐田区图书馆">盐田区图书馆</a></li>';
    htmlStr += '<li><a href="https://www.balib.cn/" target="_blank" title="深圳市宝安区图书馆">宝安区图书馆</a></li>';
    htmlStr += '<li><a href="http://www.szlglib.com.cn" target="_blank" title="深圳市龙岗区图书馆">龙岗区图书馆</a></li>';
    htmlStr += '<li><a href="https://www.szgmlib.com.cn" target="_blank" title="深圳市光明区图书馆">光明区图书馆</a></li>';
    htmlStr += '<li><a href="https://www.szpslib.org.cn" target="_blank" title="深圳市坪山区图书馆">坪山区图书馆</a></li>';
    htmlStr += '</ul></div></li>';
    htmlStr += '<li><h2>在深圳图书馆借阅  ·  ·  ·  ·  ·  · </h2></li>';
    htmlStr += '</ul>';
    
    return htmlStr;
}

function setLibMemberStyle() {
    GM_addStyle('\
        #libInfo {\
            overflow: visible;\
        }\
        .libMem {\
            z-index: 97;\
            position: relative;\
            float: right;\
        }\
        .libMemMenu {\
            position: absolute;\
            top: -5px;\
            left: 0px;\
            visibility: hidden;\
        }\
        .libMem a {\
            -moz-border-radius: 7px;\
            -webkit-border-radius: 7px;\
            border-radius: 7px;\
            display: block;\
            background: #f6f6f1;\
            padding: 5px;\
            width: 90px;\
            line-height: 160%;\
            border: 1px solid #fff;\
        }\
        .libMem a:hover {\
            background: #FFF;\
            border: 1px solid #aaa;\
            color: #000;\
        }\
        .libMem:hover .libMemMenu {\
            visibility: visible;\
        }\
        .libMem .libMemLink {\
            border: 1px solid #aaa;\
            line-height: 100%;\
            width: 90px;\
        }\
    ');
}

// api/opacservice/canPreborrowlist?tablelist=bibliosm,bibliosm,bibliosm,&metaidlist=934991,1209378,698561,
function getReservableQryUrl(bookRecNos) {
    var qryParam = 'tablelist=';
    for (var i = 0; i < bookRecNos.length; i++) {
        qryParam += 'bibliosm,';
    }
    // array.toString: arr[0],arr[1],...
    qryParam += '&metaidlist=' + bookRecNos + ',';
	var url = LIB_API_RESERVABLE_URL + qryParam;
    if (fDebug) console.log('Reservable qryUrl: ' + url);
    return url;
}

/*
 * 图书馆图书查询页面获取图书是否与，是否可快递修改为返回json的形式
 */
function appendLibBookInfo(bookRecNos) {
    if (bookRecNos == null || bookRecNos.length == 0) {
        return ;
    }
    
    var fMore = (bookRecNos.length > 1);
    var reservableQry_url = getReservableQryUrl(bookRecNos);
    
    GM_xmlhttpRequest({
        method: 'GET',
        url: reservableQry_url,
        headers: {
            'User-agent': 'Mozilla/5.0 (compatible) Greasemonkey'
        },
        onload: function(res) {
            // the reservable query return is a xml document
            var fHasReservable = false;
            var fHasExpress = false;
            
            if (fDebug) console.log('preloan : ' + res.responseText);
            var jsonData = null;

            try {
                jsonData = JSON.parse(res.responseText);
            } catch(ex) {
                console.log('reservable json parse, ' + ex.message);
                return ;
            }
            
            var preloanExps = jsonData.data;
            for (var i = 0; i < preloanExps.length;i++) {
                if (fDebug) console.log('preloan : ' + i + ',  ' + preloanExps[i]);
                if (preloanExps[i].preloan) {
                    fHasReservable = true;
                }
				if (preloanExps[i].express) {
					fHasExpress = true;
				}
				if (fHasReservable && fHasExpress) {
					break;
				}
            }

            var bookRecNo = bookRecNos[0];// set the first book as default
            var cacheInfo = '{"bookRecNo":"' + bookRecNo + '", "hasMore":"'+ fMore + '", "reservable":"' + fHasReservable + '", "expressable":"' + fHasExpress + '"}';
            GM_setValue(isbn, cacheInfo);
            appendLibBookHtml(bookRecNo, fMore, fHasReservable, fHasExpress);

        } // end function(res)
    }
    );
    
} // end appendLibBookInfo

function getLibBizLink(linkUrl, linkTitle, linkStr) {
	return '<a class="collect_btn colbutt ll" href="' + linkUrl
	    + '" target="_blank" title="' + linkTitle
		+ '"><span >' + linkStr + '</span></a>';
}

function appendLibBookHtml(bookRecNo, fMore, fHasReservable, fHasExpress) {
    if (fDebug) console.log('book recNo: ' + bookRecNo + ', fMore: ' + fMore + ', fHasReservable: ' + fHasReservable + ', fHasExpress:' + fHasExpress);
    
    var book_url = getLibBookUrl(bookRecNo);
    var hasMore = isTrue(fMore);
    var hasReservable = isTrue(fHasReservable);
    var hasExpress = isTrue(fHasExpress);
    var htmlStr = '';
    htmlStr += '<ul id="libLinks" class="bs" >';//<div class="indent">
    htmlStr += '<li style="border:none"><a id=libBookLink href="' + book_url;
    //title="点击前往图书馆查看"
    htmlStr += '" target="_blank" >到深圳图书馆查看本书</a>';
    if (hasMore) {
        htmlStr += '<a class="rr" href="' + getLibIsbnUrl(isbn);
        htmlStr += '" target="_blank" title="查看所有搜索结果">更多. . .</a>';
    }
    htmlStr += '</li>';
    if (hasReservable || hasExpress) {
        htmlStr += '<li style="border:none">';
        if (hasReservable) {
			htmlStr += getLibBizLink(LIB_RESERVE_URL + bookRecNo, "登陆我的图书馆办理预借登记", "预借登记");
        }
        if (hasExpress) {
            htmlStr += (hasReservable ? '&nbsp;&nbsp;' : '');
			htmlStr += getLibBizLink(LIB_EXPRESS_URL + isbn, "登陆我的图书馆办理快递到家", "快递到家");
        }
        htmlStr += '</li>';
    }
    
    htmlStr += '</ul>'; //</div></div>
    $("#libInfo").html(htmlStr);
    
    appendBookCallNumbers(bookRecNo);
}


/**
 * 图书馆查询系统中查询图书在馆信息调整为返回json数据，从返回值中构建json对象获取值即可
 * 
 * {"districtList":[{}, ...], "CanLoanBook": ["notes": "可外借馆藏",...], }
 */
function appendBookCallNumbers(bookRecNo) {
    if (bookRecNo == -1)
        return ;
    
    var qryCallNoUrl = LIB_API_PREHOLDING_URL + bookRecNo;
    if (fDebug) console.log('qryCallNoUrl: ' + qryCallNoUrl);
    
    GM_xmlhttpRequest({
        method: 'GET',
        url: qryCallNoUrl,
        headers: {
            'User-agent': 'Mozilla/5.0 (compatible) Greasemonkey'
        },
        onload: function(res) {
            if (fDebug) console.log('res: ' + res.responseText);
            
            try
            {
                var respJson = JSON.parse(res.responseText);
                var libLocs = respJson.CanLoanBook;
            
                var htmlStr = getBookCallNumberHtml(libLocs);
                if (fDebug) console.log('call No html: ' + htmlStr);
                
                if (!isEmptyStr(htmlStr))
                    $("#libInfo").append(htmlStr);
            } catch (ex) {
                console.log('book callNo parse has exception, ' + ex.message);
                return ;
            }
        } // end function(res)
    });
    
} // end appendBookCallNumber

function getBookCallNumberHtml(libLocs) {
    if (libLocs == null) {
        return null;
    }
    
    var callNumHtml = '';
    // libLocs 可能不是数组，是普通对象——opac系统的bug，这种情况下搜索页面的图书信息行没有图书在馆信息按钮
	// 对应的图书：为什么学生不喜欢上学?， https://book.douban.com/subject/4864832/ 
    if (libLocs.recordList) {
        if (fDebug) console.log('libLocs.recordList: ' + libLocs.recordList);
        callNumHtml = getBookShelfLocsHtml(libLocs.recordList);
    } else {
        for (var i = 0; i < libLocs.length; i++) {
            var libLoc = libLocs[i];
            var shelfLocs = libLoc.recordList;
            var subLibName = libLoc.serviceaddrnotes;
            if (fDebug) console.log('subLib: ' + subLibName); 
            
            callNumHtml += getBookShelfLocsHtml(shelfLocs);
        } // end libLocs
    }
    if (fDebug) console.log('  callNumHtml: ' + callNumHtml);
    
    var htmlStr = null;
    //if (fDebug) console.log('callNumHtml: ' + callNumHtml);
    if (isEmptyStr(callNumHtml)) {
        htmlStr = '<div class="indent"></div>';
    } else {
        htmlStr = '<div class="indent"><table width="100%" title="部分在馆书籍">';
        htmlStr += '<thead><tr style="border-bottom:1px solid #CCC;">'
            + '<td width=30%>&nbsp;索 书 号</td><td width=70%>馆藏地点</td>'
            + '</tr></thead><tbody>';
        htmlStr += callNumHtml;
        htmlStr += '</tbody></table></div>';
    }
    
    return htmlStr;
}// end getBookCallNumberHtml

function getBookShelfLocsHtml(shelfLocs) {
    var shelfLocsHtml = '';

    var callNoArr = new Array();
    for (var j = 0; j < shelfLocs.length; j++) {
        // extract the 索书号, 馆内位置
        try{
            var callNoStr = shelfLocs[j].callno;
            var shelfLocStr = shelfLocs[j].local;
            // 图书馆是”物流转运”的不显示 
            if (shelfLocStr === "物流转运") {
                continue;
            }
            
            if (fDebug) console.log('  callNo : ' + callNoStr + ', loc: ' + shelfLocStr + ', ' + callNoArr.length);
            
            // 索 书 号+馆藏地点 相同的不重复显示——不同图书馆的内容不会重复，所以放在该方法中初始化callNoArr
            if (callNoArr.indexOf(callNoStr + shelfLocStr) == -1) {
                callNoArr.push(callNoStr + shelfLocStr);

                shelfLocsHtml += '<tr style="border-bottom:1px dashed #DDDDDD;"><td>' + callNoStr + '</td><td>';
                shelfLocsHtml += shelfLocStr + '</td></tr>';
                if (fDebug) console.log('  shelfLocsHtml: ' + shelfLocsHtml);
            }
        } catch(ex) {
            console.log('failed to parse callNo, shelfLoc, subLibName, ' + ex.message);
        }
    }
    return shelfLocsHtml;
}

function getDoubanBookTitle() {
    // get book title
    title = $('h1 span').text();
}

function getDoubanBookIsbn() {
    // get book isbn
    try
    {
        var liTxt = null;
        $("#info span.pl").each(function(){
            liTxt = $(this).text();
            //if (fDebug) console.log('lib book attr txt:' + liTxt);
            if (liTxt == 'ISBN:' && $(this)[0].nextSibling != null){
                isbn = $(this)[0].nextSibling.nodeValue.trim();
                if (fDebug) console.log('book isbn txt: [' + isbn + ']');
            }
        });
    } catch(ex) {
        console.log('In getDoubanBookIsbn, exception: ' + ex.message);
    }
    isbn10 = getIsbn10();
    if (fDebug) console.log("book isbn10: \'" + isbn10 + "\'");
}

function appendTitleLink_Loading(){
    var htmlStr = '';
    htmlStr += '<div id="libArea">' + getLibHeadHtml();
    htmlStr += '<div id="libInfo"><div class="indent">'
        + LIBSEARCH_LINK_PRE + ' href="' + getLibTitleUrl(title)
        + '" >' + LIBSEARCH_LINK_SUF;
    
    if (!isEmptyStr(isbn)) {
        htmlStr += '<ul id="libLoading">' + HTML_LOADING + '</ul>';
    }
    htmlStr += '</div></div></div>';
    $('.aside').prepend(htmlStr);
    setLibMemberStyle();
}

function queryLibByIsbn(vIsbn){

    var fLoadCache = loadLibInfoFromCache(vIsbn);
	if (fLoadCache) return;
	
	var libQryUrl = getLibIsbnApiUrl(vIsbn);
    if (fDebug) console.log("libIsbnApiUrl : " + libQryUrl);
    
    GM_xmlhttpRequest({
        method: 'GET',
        url: libQryUrl,
            headers: {
                'User-agent': 'Mozilla/5.0 (compatible) Greasemonkey',
        },
        //onload: loadLibInfo
        onload: function(res) {
            var respTxt = res.responseText;
            if (fDebug) console.log("respTxt : " + respTxt);
			
			var found = false;
			if (!isEmptyStr(respTxt)) {
				try {
					var books = JSON.parse(respTxt);
					var count = books.data.numFound;
					if (count > 0) {
						var bookRecNos = new Array(books.data.docs.length);
						for (var i = 0; i < count; i++) {
							bookRecNos[i] = books.data.docs[i].recordid;
						}
						if (fDebug) console.log("bookRecNos : " + bookRecNos);
						found = true;
						appendLibBookInfo(bookRecNos);
					}
				} catch(ex) {
					console.log('In queryLibByIsbn, exception: ' + ex.message);
				}
			}
			if (!found) {
                if (vIsbn.length == 13) {
                    if (fDebug) console.log('try another value again');
                    if (isbn10) {
                        queryLibByIsbn(isbn10);
                    } else {
                        $('#libLoading').remove();
                    }
                } else {
                    $('#libLoading').remove();
                }
            }
        }
    });
}

function loadLibInfoFromCache(vIsbn) {

	var fLoadCache = false;
    var cacheInfo = GM_getValue(vIsbn);
    if (!cacheInfo && isbn10) {
        if (fDebug) console.log("check cache for isbn10 also ");
        cacheInfo = GM_getValue(isbn10);
    }
    if (cacheInfo) {
        var bookInfo = JSON.parse(cacheInfo);
        // '{"bookRecNo":' + bookRecNo + ', "hasMore":'+ fMore + ', "reservable":' + fHasReservable + ', "expressable":' + fHasExpress + '}';
        var bookRecNo = bookInfo.bookRecNo;
        var fMore = bookInfo.hasMore;
        var fReservable = bookInfo.reservable;
        var fHasExpress = bookInfo.expressable;
        if (fDebug) console.log(vIsbn + " cached, bookRecNo:" + bookRecNo + ", hasMore:" + fMore + ", reservable:" + fReservable + ", expressable:" + fHasExpress);
        appendLibBookHtml(bookRecNo, fMore, fReservable, fHasExpress);
        fLoadCache = true;
    }
	return fLoadCache;
}

function getIsbn10() {
    var isbn10 = null;
    var borrowDiv = document.getElementById("borrowinfo");
    // div -> ul -> li -> a
    if (borrowDiv ) {
        if (borrowDiv.children[1] && borrowDiv.children[1].children[0]
            && borrowDiv.children[1].children[0].children[0]) {
            var libLink = borrowDiv.children[1].children[0].children[0].href;
            if (fDebug) console.log('libLink: ' + libLink);
            var m = libLink.match(/&subject=.*&type=/igm);
            if (m) {
                isbn10 = m[0];
                isbn10 = isbn10.substring("&subject=".length, isbn10.length - "&type=".length);
                if (fDebug) console.log('isbn10: ' + isbn10);
                return isbn10;
            }
        }
    }
}

/**
 * append the library link to douban book page
 * a) if the lib isbn query return books, the link is the first book page;
 * b) if the query results has more than one book, add query result link
 * c) if the first ten books has preservable book, set it as the book link
 * d) otherwise append title query link of Shenzhen Library
 */
function appendLibraryLink() {
    
    title = null;
    isbn  = null;
    
    getDoubanBookTitle();
    if (fDebug) console.log("book title: \'" + title + "\'");
    getDoubanBookIsbn();
    if (fDebug) console.log("book isbn: \'" + isbn + "\'");
    // it might not be book page, or douban changed the page structure
    if (isEmptyStr(title) && isEmptyStr(isbn) )
        return ;
    
    appendTitleLink_Loading();
    
    if (!isEmptyStr(isbn)) {
        // query library, append link to library
        setTimeout(function(){
            queryLibByIsbn(isbn);
        }, 200); // end of setTimeout
    }
} // end of appendLibraryLink()

function appendLibraryInSearchPage() {
    var keyword = $(":text").val();
    keyword = keyword.replace(/-/g, '');
    if (fDebug) console.log('keyword: [' + keyword + ']');
    if (isEmptyStr(keyword))
        return ;
    
    var htmlStr =
        '<div class="link">' + LIBSEARCH_LINK_PRE
        + ' href="' + getLibTitleUrl(keyword)
        + '" >&gt;&nbsp;'+ LIBSEARCH_LINK_SUF + '</div>';

    $("div.link:last").after(htmlStr);
}

function appendDoubanInSearchPage() {
    
    try
    {
        var searchUrl = document.URL;
		var keyword = extractLibarySearchValue(searchUrl);
        if (fDebug) console.log('keyword: [' + keyword + ']');
        if (isEmptyStr(keyword)) {
            return ;
		}
        
        var rsltSearchLink = $("div.pages_schform a:last");
        if (fDebug) console.log('find search in result link');
        var dbSearchLink = rsltSearchLink.clone();
        var dbSearchUrl = getDoubanSearchUrl(keyword);
        if (fDebug) console.log('copy it, new dbSearchBtn, dbSearchUrl: ' + dbSearchUrl);
        dbSearchLink.attr('title','在豆瓣搜索');
        dbSearchLink.attr('href', dbSearchUrl);
        dbSearchLink.attr('innerText', '在豆瓣搜索');
		dbSearchLink.attr('target', '_blank');

        if (fDebug) console.log('created douban search link');
		rsltSearchLink.attr('innerHTML', '结果中检索&nbsp;&nbsp;|');
        rsltSearchLink.after(dbSearchLink);
    } catch(ex) {
        console.log('In Library search page, exception: ' + ex.message);
        console.log('In Library search page, cannot find keyword, page struct may changed');
    }
}

function extractLibarySearchValue(libSearchUrl) {
	var keyword;
	var valIdx = libSearchUrl.indexOf("&v_value=");
    console.log('valIdx:' + valIdx);
	if (valIdx > 0) {
		var valSubstr = libSearchUrl.substring(valIdx + "&v_value=".length);
		var ampIdx = valSubstr.indexOf("&");
        console.log('valSubstr:' + valSubstr + ', ampIdx:' + ampIdx);
		if (ampIdx > 0) {
			keyword = valSubstr.substring(0, ampIdx);
		} else {
			keyword = valSubstr;
		}
	}
	return keyword;
}


(function() {

    var thisScript = {
    name: "douban_shenzhenLib",
    id: "116332",
    version:"1.24.11"
    };

    if (typeof(Updater)!='undefined') {
        var updater = new Updater(thisScript);
        updater.check(24);
    }
    
    if (fDebug) console.log('url host:' + document.URL);
    
    var vUrl = document.URL;
    if (vUrl.indexOf("douban.com/subject/") > 0) {
        if (fDebug) console.log('in douban page');
        appendLibraryLink();
    } else if (vUrl.indexOf("search.douban.com/book/subject_search") > 0) {
        appendLibraryInSearchPage();
    } else if (vUrl.indexOf("/opac/searchShow") > 0) {
        appendDoubanInSearchPage();
    }
})();