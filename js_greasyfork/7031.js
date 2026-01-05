// ==UserScript==
// @name         DoubanMoviePlus
// @namespace    ziz.zway.xyz
// @version      0.2.0
// @description  为豆瓣电影加入IMDB评分、调整布局
// @author       Zzway
// @match        http*://movie.douban.com/subject/*
// @exclude      http*://movie.douban.com/subject/*/questions*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/7031/DoubanMoviePlus.user.js
// @updateURL https://update.greasyfork.org/scripts/7031/DoubanMoviePlus.meta.js
// ==/UserScript==
/* global $ GM_xmlhttpRequest */

$(document).ready(function(){
    //显示IMDB评分
    var imdbtt=$('#info a[href^=\'http://www.imdb.com/title\']').text()
    var ratinghref=$('#info a[href^=\'http://www.imdb.com/title\']').attr('href')+'/ratings'
    if(imdbtt !== ''){
        console.log('imdb:'+imdbtt)
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://p.media-imdb.com/static-content/documents/v1/title/'+imdbtt+'/ratings%3Fjsonp=imdb.rating.run:imdb.api.title.ratings/data.json',
            onload: function(response) {
                //返回格式：imdb.rating.run({"@meta":{"operation":"TitleRatings","requestId":"f4ee7052-5aef-11e7-b6db-e94483cf9b60","serviceTimeMs":2.068922},"resource":{"@type":"imdb.api.title.ratings","id":"/title/tt0112573/","title":"Braveheart","titleType":"movie","year":1995,"bottomRank":18875,"canRate":true,"rating":8.4,"ratingCount":792731,"topRank":76}})
                var imdb={},myImdb
                imdb.rating = {}
                imdb.rating.run=function (response){myImdb=response}//自己定义imdb.rating.run,便于读取数据
                eval(response.responseText)
                console.log('myImdb:'+myImdb.resource.rating)

                $('#interest_sectl .rating_wrap').after('<div class=\'rating_imdb clearbox\'></div>')
                $('#interest_sectl .rating_imdb').append('<span>IMDB评分</span><br />')
                $('#interest_sectl .rating_imdb').append('<div class=\'rating_content_wrap\'></div>')
                $(' .rating_imdb .rating_content_wrap').append('<span id=imdbRating class=rating_avg>'+myImdb.resource.rating+'</span>')
                $(' .rating_imdb .rating_content_wrap').append('<a href='+ratinghref+' class=\'friends_count\' target=_blank >'+myImdb.resource.ratingCount+'人评价</a>')
                $('#imdbRating').css({'color':'#deaa26'})
                $('.rating_imdb span').first().css({'font-size':'12px'})
            }
        })

        $('#interest_sectl .rating_logo').hide()//隐藏“豆瓣评分”四个字
    }

    $('#comments-section i:first').text('短评')
    var comments=$('#comments-section').clone(true)
    $('#comments-section').remove()

    if($('.mr10:contains(看过)').text() !== ''){//看过的片子，简介移到侧栏，短评移到自评下
        if($('.related-info .a_show_full').text() !== ''){
            $('.related-info #link-report').text($('.related-info .hidden').text())//展开简介
        }
        var tempContent=$('.related-info').clone(true)
        $('.related-info').remove()
        $('#subject-others-interests').after(tempContent)
        $('.indent.clearfix').after(comments)
    }else{			//没看过的片子，短评移到图片下
        $('#related-pic').after(comments)
    }

    //豆瓣App讨论移到底
    // var appd=$("#app-discuss").clone(true);
    //  $("#app-discuss").remove();
    //  $(".discussion_link").after(appd);

    //推荐电影移到侧栏，默认隐藏海报
    $('.recommendations-bd dt').hide()
    $('.recommendations-bd').css({'margin-right':'70px'})
    $('.recommendations-bd dd').css({'background-color':'#E5F1FA','border-radius':'3px'})
    $('.recommendations-bd dl').mouseover(function(){
        $(this).children().fadeIn()
        $(this).children('dd').css({'background-color':'#FFFFFF'})
    })
    $('#recommendations h2').click(function(){
        $('.recommendations-bd dt').slideToggle()
    })
    $('.recommendations-bd').mouseleave(function(){
        $(this).children().children('dd').css({'background-color':'#E5F1FA'})
        $('.recommendations-bd dt').slideUp()
    })
    var rcmd=$('#recommendations').clone(true)
    $('#recommendations').remove()
    $('#subject-others-interests').before(rcmd)

    //影评过滤
    var reviews=$('div.review')
    var filter=['文/','题记','烂片','不谢','戳中','微信公号','我的微信']
    //$("body").append('<div id="z-rtext" style="display: none;"></div>');
    if(reviews.length>1 && filter.length>0){
        for (var i=0; i<reviews.length; i++)
        {
            var rhref=$('div.review:eq('+i+') h3 div a:first').attr('href')
            var rmain=$('div.review:eq('+i+') .review-bd span:first')

            $.ajax({
                url: rhref,
                dataType:'text',
                context:rmain
            })
                .done(function(text) {
                    text=text.slice(text.indexOf('main-bd'),text.indexOf('main-ft'))
                    for (var j=0;j<filter.length;j++)
                    {
                        if( text.indexOf(filter[j]) > 0){
                            //console.log(filter[j]);
                            var pos=text.indexOf(filter[j])
                            text=text.slice(pos-6,pos+8)
                            $(this).html(text)
                            break
                        }
                    }
                })

        }
    }
    //可以考虑更多过滤条件，比如：句号超过80个,"我们"超过3个   

})
