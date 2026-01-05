// ==UserScript==
// @name         Export Weibo Album to List or Image
// @namespace    https://greasyfork.org/zh-CN/users/10666-sbdx
// @version      0.9.20231214
// @description  批量导出新浪微博相册图片，用于保存、下载
// @author       sbdx
// @include        http*://t.sina.com.cn/*
// @include        http*://weibo.com/*
// @include        http*://www.weibo.com/*
// @include        http*://s.weibo.com/*
// @include        http*://photo.weibo.com/*
// @include        http*://d.weibo.com/*
// @exclude        http://weibo.com/app/*
// @exclude        http://weibo.com/app
// @require        https://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/9803/Export%20Weibo%20Album%20to%20List%20or%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/9803/Export%20Weibo%20Album%20to%20List%20or%20Image.meta.js
// ==/UserScript==
/*
WGET最新版下载地址：https://eternallybored.org/misc/wget/

@echo off
REM wget批量下载并且重命名 批处理文件
REM 将URL保存到url.txt文件里，然后执行本批处理
setlocal enabledelayedexpansion
set /a num=0
set zero=00000
FOR /F %%i in (url.txt) do (
 set /a num+=1
 title !num!
 set "name=!zero!!num!"
 wget -c -nv %%i -O !name:~-4!.jpg
)
*/
jQuery(function(){
    var nw,UID,AlbumID,Type,total_pic,imgCountInPage,boolShowPicOrLink;
    //$.ajaxSetup({async:false,cache:false});
    function ProcessAlbum()
    {
        for (var p=1,lens=Math.ceil(total_pic/imgCountInPage); p<=lens; p++)
        {
            //console.log('正在获取第'+p+'页');
            let url=document.location.origin+'/photos/get_all?uid=' + UID + '&album_id=' + AlbumID + '&count=' + imgCountInPage + '&page=' + p + '&type=' + Type + '&__rnd='+(new Date().getTime());
            console.log('Get '+url);
            $.getJSON(url,function(rtn){
                //异步调用，返回顺序不一致
                plist=rtn.data.photo_list;
                for(i=0,plist_len=plist.length;i<plist_len;i++)
                {
                    obj=plist[i];
                    //only for me
                    obj.pic_hos='https://ww3.sinaimg.cn';
                    picurl=obj.pic_host + '/large/' + obj.pic_name;
                    if(boolShowPicOrLink)
                    {
                        nw.document.writeln('<img src="'+picurl+'" border="0" /><br>');
                    }
                    else
                    {
                        nw.document.writeln('<a href="'+picurl+'" target="_blank">'+picurl+'</a><br>');
                    }
                }
            });
        }
        nw.document.title='加载完成';
    }
    function GetAlbumPic()
    {
        UID=$GLOBAL_DETAIL.album_info.uid;                //博主ID
        AlbumID=$GLOBAL_DETAIL.album_info.album_id;        //相册ID
        Type=$GLOBAL_DETAIL.type;
        total_pic=$GLOBAL_DETAIL.album_info.count.photos;        //相片总数
        imgCountInPage=30;    //每页显示数量
        boolShowPicOrLink=true;	//显示图片或地址
        if(total_pic>10)
        {
            boolShowPicOrLink=confirm("图片数量过多，请选择显示 图片 或 连接！\n是 - 显示图片 否 - 显示连接");
        }
        nw=window.open('','output');
        nw.document.title='正在载入......';
        ProcessAlbum();
    }
    //单条微博页九宫格大图
    function ShowLargeImageInSinglePage()
    {
        $('.WB_media_wrap .media_box img').each(function(i){this.src=this.src.replace(/(http[s]*:\/\/.+?\/)(.+?)(\/.*)/i,'$1large$3');});
        $('.wbpro-feed-content .picture .woo-picture-slot img').each(function(i){this.src=this.src.replace(/(http[s]*:\/\/.+?\/)(.+?)(\/.*)/i,'$1large$3');});
    }
    //显示相册列表页单页大图
    function ShowLargeImageInAlbumPage()
    {
        console.log('显示相册列表页单页大图');
        $('.photoList dt.photo img').each(function(i){
            console.log(this.src);
            this.src=this.src.replace(/(http[s]*:\/\/.+?\/)(.+?)(\/.*)/i,'$1large$3');
        });
    }
    if (document.location.host == "photo.weibo.com")
    {
        $("body").append("<div id='sbdx_tools_getAllImage' style='position:absolute;right:10px;top:100px;'><button>显示相册全部图片</button></div>");$("#sbdx_tools_getAllImage").on("click",GetAlbumPic);
        $("body").append("<div id='sbdx_tools_AlbumList' style='position:absolute;right:10px;top:130px;'><button>显示单页相册大图</button></div>");$("#sbdx_tools_AlbumList").on("click",ShowLargeImageInAlbumPage);
    }
    else
    {
        $("body").append("<div id='sbdx_tools_for9' style='position:absolute;right:10px;top:130px;'><button>单页显示九宫格大图</button></div>");$("#sbdx_tools_for9").on("click",ShowLargeImageInSinglePage);
    }

    $(window).scroll(function(){$("div[id^=sbdx]").each(function(i){$(this).offset({top:$(document).scrollTop()+100+i*30});});});
});