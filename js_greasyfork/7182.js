// ==UserScript==
// @name           	乃木坂46官方博客图高清批量保存
// @description    	博客高清图单独及批量下载,隐藏文章，只显示图片
// @include        	http://blog.nogizaka46.com*
// @include        	http://img.nogizaka46.com*
// @include        	http://dcimg.awalker.jp/*
// @author         	yechenyin
// @version        	0.9.7
// @namespace 	   	https://greasyfork.org/users/3586-yechenyin
// @require         https://code.jquery.com/jquery-1.11.2.min.js
// @grant           GM_xmlhttpRequest
// @grant           GM_download
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/7182/%E4%B9%83%E6%9C%A8%E5%9D%8246%E5%AE%98%E6%96%B9%E5%8D%9A%E5%AE%A2%E5%9B%BE%E9%AB%98%E6%B8%85%E6%89%B9%E9%87%8F%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/7182/%E4%B9%83%E6%9C%A8%E5%9D%8246%E5%AE%98%E6%96%B9%E5%8D%9A%E5%AE%A2%E5%9B%BE%E9%AB%98%E6%B8%85%E6%89%B9%E9%87%8F%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==




/****************************************************/

if (location.href.match("http://blog.nogizaka46.com")) {
    var script = document.createElement('script');
    script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js";
    document.getElementsByTagName("head")[0].appendChild(script);

    var keepRightKeyAlive = document.getElementsByTagName('body')[0];
    keepRightKeyAlive.setAttribute('oncontextmenu','');
    if (localStorage.blog_display === undefined)
	localStorage.blog_display = "all";
    var expired = "";
    $(window).on('message', function (e) {
      console.log(e.data);
    });


    if ($(".relnavi").length > 0) {
	$(".relnavi").append($("<div>", {css:{display:"block", height:"14px", position:"relative", margin:"4px 0 0px"}}));
	var download_images = $("<a>", {text:"下载本页图片", click:saveImages, css:{right:"8px", position:"absolute", "text-decoration":"none", cursor:"pointer"}});
	$(".relnavi").first().children().last().append(download_images);
	var to_bottom = $("<a>", {text:"跳转至评论", href:"#comments-open", css:{left:"8px", position:"absolute", "text-decoration":"none", cursor:"pointer"}});
	$(".relnavi").first().children().last().append(to_bottom);
    } else {

    $(".paginate").append($("<div>", {css:{display:"block", height:"14px", position:"relative", margin:"4px 0 0px"}}));
    var to_bottom = $("<a>", {text:"跳转至底部", href:"#footer", css:{right:"8px", position:"absolute", "text-decoration":"none", cursor:"pointer"}});
    $(".paginate").first().children().last().append(to_bottom);
    var download_images = $("<a>", {text:"下载本页图片", click:saveImages, css:{right:"8px", position:"absolute", "text-decoration":"none", cursor:"pointer"}});
    $(".paginate").last().children().last().append(download_images);
    var to_top = $("<a>", {text:"返回到顶部", href:"#sheet", css:{left:"8px", position:"absolute", "text-decoration":"none", cursor:"pointer"}});
    $(".paginate").last().children().last().prepend(to_top);

    switch_display = function() {
	if($(this).text() == "只显示图片") {
	    $(".entrybody div").contents().filter(function() {return this.nodeType === 3;}).wrap($("<div>"));
	    $(".entrybody span").contents().filter(function() {return this.nodeType === 3;}).wrap($("<div>"));
	    $(".entrybody p, .entrybody div, .entrybody span").each(function() {
		if ($(this).find("img").length === 0)
		    $(this).hide();
	    });
	    $(".entrybody br").hide();
	    localStorage.blog_display = "images_only";
	    blog_display.text("显示全文");
	} else {
	    $(".entrybody div, .entrybody p, .entrybody span, .entrybody br").show();
	    localStorage.blog_display = "all";
	    blog_display.text("只显示图片");
	}
    }
    var blog_display = $("<a>", {click:switch_display, css:{left:"8px", position:"absolute", "text-decoration":"none", cursor:"pointer"}});
    if (localStorage.blog_display == "images_only") {
        $(".entrybody p, .entrybody div, .entrybody span").contents().filter(function() {return this.nodeType === 3;}).wrap($("<div>"));
	$(".entrybody span").contents().filter(function() {return this.nodeType === 3;}).wrap($("<div>"));
	$(".entrybody div").each(function() {
	    if ($(this).find("img").length == 0)
		$(this).hide()
	});
	    $(".entrybody br").hide();
	blog_display.text("显示全文");
    }
    else {
	$(".entrybody div, .entrybody p, .entrybody span, .entrybody br").show();
	blog_display.text("只显示图片");
    }
    $(".paginate").first().children().last().prepend(blog_display);

    }


    /*
    var iframe_i = 0;
    var load_iframe = function() {
	if (iframe_i != $("#sheet a>img").length-1) {
	    var iframe = $("<iframe>", {load:load_iframe, class:"expand", src:$("#sheet a>img")[iframe_i].parentNode.href, css:{display:"block"}});
	    iframe.src = $("#sheet a>img")[iframe_i].parentNode.href;
	    $("#sheet a>img").eq(iframe_i).after(iframe);
	    iframe_i++;
	}
    };
    load_iframe();
    getImages();

    for (var i=0; i<$("#sheet a>img").length-1; i++) {
	var img = $("#sheet a>img").eq(i);
	var img_iframe = $("<iframe>", {src:img.parent().attr("href"), css:{display:"block"}});
	img_iframe.load(function() {
	    if (this.src != "http://blog.nogizaka46.com/proxy/")
		this.src = "http://blog.nogizaka46.com/proxy/"
	     else
		this.previousSibling.src = this.contentWindow.name;
	});
	img_iframe.load(function(i) {
		GM_xmlhttpRequest({
		    method: "GET",
		    synchronous:false,
		    url: $("#sheet a>img").eq(i).parent().attr("href"),
		    onload: function(response) {
			var image = response.responseText.match(/<img.+?>/)[0];
			var src = image.match(/src=".+?"/)[0];
			$("#sheet a>img")[i].src = src.substring('src="'.length, src.length-1);
		    }
		});
	});
	img.after(img_iframe);
    }
    */


    hide = function() {
	var p = $(this).parent().parent();
	p.next().next().next().remove();
	p.next().next().remove();
	p.next().remove();
	p.remove();
    }
    $(".heading .author").after($("<span>", {text:"隐藏", click:hide, css:{float:"right", margin:"-21px 10px 0", cursor:"pointer"}}));
    $(".heading .author").attr("title", "appended");

    if (location.href.indexOf("?p=")>0) {
	next_page = parseInt(location.href.substr(location.href.indexOf("?p=")+("?p=").length)) + 1;
    } else
	next_page = 2;

    page_loaded = function() {
	$(".author[title!='appended']").after($("<span>", {text:"隐藏", click:hide, css:{float:"right", margin:"-21px 10px 0", cursor:"pointer"}}));
	$(".author").attr("title", "appended");
	clearInterval(loading);
	$(".next_page").text("加载下一页");

	if (localStorage.blog_display == "images_only") {
	    $(".entrybody div").contents().filter(function() {return this.nodeType === 3;}).wrap($("<div>"));
	    $(".entrybody div").each(function() {
		if ($(this).find("img").length == 0)
		    $(this).hide()
	    });
	    $(".entrybody p, br").hide();
	}
	else {
	    $(".entrybody div, p, br").show();
	}

    }
    load_next_page = function() {
    $(this).before($("<div>", {css:{display:"block"}}));
    url = location.href.substring(0, location.href.indexOf("?p="))+"?p=" + next_page;
    next_page++;
    changeLoadingText = function(){
	if ($(".next_page").html() == "加载下一页") {
	    $(".next_page").html("加载中…");
	} else if ($(".next_page").html() == "加载中…") {
	    $(".next_page").html("加载中&nbsp;&nbsp;&nbsp;&nbsp;");
	} else if ($(".next_page").html() == "加载中&nbsp;&nbsp;&nbsp;&nbsp;") {
	    $(".next_page").html("加载中…");
	}
    }
    loading = setInterval(changeLoadingText, 800);
    $(this).prev().load(url + " #sheet>.clearfix, .fkd, .entrybody, .entrybottom", page_loaded);
    $(".author[title!='appended']").after($("<span>", {text:"隐藏", click:hide, css:{float:"right", margin:"-21px 10px 0", cursor:"pointer"}}));
    };

    var load_next_page_btn = $("<div>", {text:"加载下一页", class:"next_page", click:load_next_page, css:{width:"240px", height:"18px", cursor:"pointer", margin:"-20px auto 20px", padding:"5px", fontSize:"13px", color:"#7e1083", "text-align":"center", border:"1px solid #7e1083", "border-radius":"4px"}});
    $(".paginate").last().before(load_next_page_btn);

    setImagesName();
    $(".entrybody  img").click(saveBlogImage);

}

if (location.href.match("http://dcimg.awalker.jp/") || location.href.match("http://img.nogizaka46.com") || location.href.match("#download=")) {
    var scripts = document.querySelectorAll("script");
    for (var i=0; i<scripts.length; i++) {
	var script = scripts[i];
	script.parentNode.removeChild(script);
    }
    /*
    window.onhashchange = function() {
	var filename = location.href.substr(location.href.indexOf("#download=")+("#download=").length);
	var url = document.querySelector("img").src;
	if(url.match("\.gif"))
	    return;
	var a = document.createElement('a');
	a.href = url;
	a.download = filename;
	a.style.display = 'none';
	document.body.appendChild(a);
	a.click();
    }
    */
    console.log('frame:'+location.href);
    window.parent.postMessage(location.href, '*');
    if (location.href.indexOf("#download=") > 0) {
	var filename = location.href.substr(location.href.indexOf("#download=")+("#download=").length);
	//$("img").wrap($("<a>", {href:$("img")[0].src, download:filename}));
	//$("img").parent().click();
	GM_download(document.querySelector("img").src, decodeURIComponent(filename));
    } else {
	$("img").click(function() {
	    var myDate = new Date();
	    GM_download(this.src, myDate.getYear()+myDate.getMonth()+myDate.getDay()+"_"+myDate.getHours()+myDate.getMinutes()+myDate.getSeconds()+".jpeg");
	});
    }

}

function sleep(ms){
  for(var t = Date.now();Date.now() - t <= ms;);
}

function saveFile(url, filename) {
  if(!filename)
    filename = url.substring(url.lastIndexOf("/") + 1).split("?")[0];
  if(url.match("expired.gif"))
      return;
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function() {
    var a = document.createElement('a');
    a.href = window.URL.createObjectURL(xhr.response); // xhr.response is a blob
    a.download = filename;
    a.type = 'image/jpeg';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
  };
  xhr.open('GET', url);
  xhr.send();
}

function saveImage(url, filename) {
  if(!filename)
    filename = url.substring(url.lastIndexOf("/") + 1).split("?")[0];
  if(url.match("\.gif"))
      return;
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    if (location.href.match("http://dcimg.awalker.jp/"))
	document.querySelector("img").onload = function() {a.click();};
    else
	a.click();
}

function setImagesName() {
    var href, num, n=0;
    for (var i=$("#sheet .clearfix").length-1; i>=0; i--) {
	var cn = $("#sheet .clearfix").eq(i);
	var yearmonth = cn.find(".yearmonth").eq(0).text();
	var date = yearmonth.substr(2).replace("/", "") + cn.find(".dd1").eq(0).text();
	var author = cn.find(".author").eq(0).text();
	var m = 0, p = 0;
	for (var k=$("#sheet .clearfix").length-1; k>i; k--) {
	    var cnk = $("#sheet .clearfix").eq(k);
	    var yearmonthk = cnk.find(".yearmonth").eq(0).text();
	    var datek = yearmonth.substr(2).replace("/", "") + cnk.find(".dd1").eq(0).text();
	    var authork = cnk.find(".author").eq(0).text();
	    if (datek == date && authork == author) {
		m++;
	    }
	}
	for (var k=i-1; k>=0; k--) {
	    var cnk = $("#sheet .clearfix").eq(k);
	    var yearmonthk = cnk.find(".yearmonth").eq(0).text();
	    var datek = yearmonth.substr(2).replace("/", "") + cnk.find(".dd1").eq(0).text();
	    var authork = cnk.find(".author").eq(0).text();
	    if (datek == date && authork == author) {
		p++;
	    }
	}
	if (m==0 && p==0)
	    m = "";
	else if (m==0 && p>0)
	    m = "0";
	else
	    m = m.toString();

	var amount = cn.next().next().find("img").length;
	var l=0;
	for (var j=0; j<cn.next().next().find("img").length; j++) {
	    var img = cn.next().next().find("img").eq(j);
	    if (!img.attr("src").match(/\.gif$/)) {
		if (amount>=100) {
		    if (l<10)
			num = "00"+ j;
		    else if (l<100)
			num = "0"+ j;
		} else if (amount>=10) {
		    if (l<10)
			num = "0"+ j;
		}  if (amount==1 || amount==0) {
		    num = "";
		} else
		    num = l;
		l++;
		num = m + num;
		var filename = date + "_" + author + num + img.attr("src").match(/\.\w+?$/)[0];
		img.attr("download", filename);

		if (img.parent().is("a")) {
		    img.parent().click(function(){ return false; });;
		}
	    }

	};
    };

}

function getImages() {
    var images=[], href, num, n=0;
    for (var i=$(".entrybody  img").length-1; i>=0; i--) {
	    var img = $(".entrybody  img").eq(i);

	    //if (img.parent().is("a")) {
	    //    GM_xmlhttpRequest({
	    //	method: "GET",
	    //	synchronous:false,
	    //	url: img.parent().attr("href"),
	    //	onload: function(response) {
	    //	    if(response.responseText.match("expired.gif"))
	    //		expired = "true";
	    //	    else
	    //		expired = "";
	    //	}
	    //    });
	    //}


	    if (!img.attr("src").match(/\.gif$/)) {
		if (img.parent().is("a"))
		    images[n++] = img.parent().attr("href")+"#download=" + encodeURIComponent(img.attr("download"));
		else
		    images[n++] = img.attr("src")+"#download=" + encodeURIComponent(img.attr("download"));
	    }


    }

    return images;
}

function saveBlogImage() {
    if ($(this).parent().is("a"))
	url = $(this).parent().attr("href")+"#download=" + encodeURIComponent($(this).attr("download"));
    else
	url = $(this).attr("src")+"#download=" + encodeURIComponent($(this).attr("download"));
    var iframe = $("<iframe>", {src:url, css:{display:"none"}});
    $(this).after(iframe);
}

function saveImages() {
    var urls = getImages();
    var i = 0;
    var iframe = $("<iframe>", {src:urls[0], id:"downloads", css:{display:"none"}});
    iframe.load(function() {
	if (i != urls.length-1) {
	    i++;
	    setTimeout(function() {
		$("#downloads")[0].src = urls[i];
	    }, 600);
	}
    });
    $("body").eq(0).after(iframe);
    /*
    var i = 0;
    var saving = setInterval(function() {
	if (i == $("iframe.expand").length-1) {
	    clearInterval(saving);
	} else {
	    $("iframe.expand")[i].src = $("iframe.expand")[i].src + "#download=" + $("iframe.expand")[i].previousSibling.name;
	    i++;
	}
    }, 1000);
    */
}