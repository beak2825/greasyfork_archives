// ==UserScript==
// @name           Startpage.com Autopager
// @namespace      https://greasyfork.org/users/5174-jesuis-parapluie
// @author         jesuis-parapluie
//
// @description    Autopager for startpage.com
//
// @include        /^https?:\/\/(.+\.)?startpage\.com\/do\/.*$/
//
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
//
// @grant          GM_xmlhttpRequest
// @grant          GM_getValue
// @grant          GM_setValue
//
// @version        0.1.5
// @downloadURL https://update.greasyfork.org/scripts/9726/Startpagecom%20Autopager.user.js
// @updateURL https://update.greasyfork.org/scripts/9726/Startpagecom%20Autopager.meta.js
// ==/UserScript==

(function ($) {
    'use strict';
    /*jslint browser: true, regexp: true, newcap: true */
    /*global $, jQuery, GM_xmlhttpRequest, GM_getValue, GM_setValue */
    var autoPager = function () {
        var pos = $(document).height() - $('body').scrollTop() - $('html').scrollTop() - $(window).height(),
            form = $('#nextnavbar form'),
            resultsQuery = '#results, #video_results',
            data = "",
            breaker,
            nr;
        if (!$('#results_content').hasClass('trigger-block') && pos < 50) {
            $('#results_content').addClass('trigger-block');
            breaker = $('<div>', {
                'class': 'breaker',
                'style': 'clear: both; line-height: 21px; text-align: center; margin: 10px; border: 1px solid; opacity: 0.7; font-style: italic;',
                'html': 'loading page <span class="nr"></span> ..'
            });
            breaker.css('width', $('div#first-result').width());
            if ($("div[id*='pagenav'] .active").length !== 0) { // new design
                resultsQuery = '#bottom-result-container';
                nr = parseInt($("div[id*='pagenav'] .active").last().text(), 10) + 1;
                $('#pagenavigation').before(breaker);
            } else {
                nr = parseInt($('#pagenavigation #pnform').html().match(/.*&nbsp;(\d+)&nbsp;.*/).pop(), 10) + 1;
                $(resultsQuery).last().append(breaker);
            }
            if (isNaN(nr) || $('#pagenavigation').find('a[id=' + nr + ']').length === 0) {
                breaker.remove();
                return true;
            }
            breaker.find('.nr').text(nr);
            breaker.data('ipage', nr);
            form.find("input[type=\"hidden\"]").each(function () {
                data += "&" + $(this).attr('name') + "=" + $(this).attr('value');
            });
            data = data.substring(1);
            GM_xmlhttpRequest({
                method: "POST",
                url: form.attr('action'),
                data: data,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                onload: function (response) {
                    var startat,
                        clickWrapper = function () {
                            var obj = $('#pagenav' + $(this).attr('id'));
                            if (obj.size() > 0) {
                                $(document).scrollTop(obj.offset().top);
                            } else {
                                startat = $(this).attr('onclick').match(/\((\d+)\)/).pop();
                                obj = $('form[name=pnform]').last();
                                obj.find('#startat').attr('value', startat);
                                obj.submit();
                            }
                            return false;
                        },
                        newPage = $(response.responseText),
                        isEmpty = (newPage.find(resultsQuery).length === 0),
                        isLastPage = (newPage.find("form[name='nextform']").length === 0);
                    if (isEmpty) {
                        return;
                    }
                    breaker.after(newPage.find(resultsQuery).html());
                    breaker.css('font-style', 'normal');
                    breaker.attr('id', 'pagenav' + breaker.find('span').text());
                    $('.classified').hide();
                    $('.classified').last().show();
                    if (!isLastPage) {
                        if ($('#search_footer').size()) {
                            $('#pagenavigation').html(newPage.find('#pagenavigation').html());
                            breaker.html($('#pagenavigation').clone(true).html());
                        } else { // new design
                            breaker.html($('#pagenavigation').html());
                            $('#pagenavigation').remove();
                            $('#pagenavigation').html(newPage.find('#pagenavigation').html());
                        }

                        $('#pagenavigation #nextnavbar a').attr('id', breaker.data('ipage') + 1);
                        breaker.find('#nextnavbar a').attr('id', breaker.data('ipage') + 1);
                        startat = $('#pagenavigation #nextnavbar input[name="startat"]').attr('value');
                        $('#pagenavigation #nextnavbar a').attr('onclick', 'mysubmit(' + startat  + '); return false;');
                        breaker.find('#nextnavbar a').attr('onclick', 'mysubmit(' + startat + '); return false;');
                        $('#pagenavigation #prevnavbar a').attr('id', breaker.data('ipage') - 1);
                        breaker.find('#prevnavbar a').attr('id', breaker.data('ipage') - 1);
                        startat = $('#pagenavigation #prevnavbar input[name="startat"]').attr('value');
                        $('#pagenavigation #prevnavbar a').attr('onclick', 'mysubmit(' + startat + '); return false;');
                        breaker.find('#prevnavbar a').attr('onclick', 'mysubmit(' + startat + '); return false;');
                        $('#pagenavigation a').click(clickWrapper);
                        breaker.find('a').click(clickWrapper);

                        breaker.find('div').css('display', 'inline');
                        $('#pagenavigation div').css('display', 'inline');
                        breaker.find('span.active').css('padding', breaker.find('#nextnavbar a, #prevnavbar a').first().css('padding'));
                        if ($('#pagenavigation').width() > $('div#first-result').width()) { breaker.css('width', $('#pagenavigation').width()); }
                        $('#results_content').removeClass('trigger-block');
                    } else {
                        breaker.remove();
                        $('#pagenavigation #jumpsbar a').each(function () {
                            if (parseInt($(this).attr('id'), 10) >= nr) {
                                $(this).remove();
                            }
                        });
                        $('#pagenavigation #nextnavbar').remove();
                    }
                },
                onerror: function () {
                    $('.breaker').last().html('loading failed');
                }
            });
        }
    };
    $(function () {
        var link = $('<a>', {
            'class': 'autopager',
            'style': 'cursor:pointer;font-weight:normal;text-align:left;',
            'html': 'Autopager <span style="color:#D5402C;">off</span>'
        }).click(function () {
            if ($(this).find('span').text() === 'on') {
                $(this).find('span').text('off');
                GM_setValue('SP-Autopager', false);
                $(document).off('scroll', autoPager);
            } else {
                $(this).find('span').text('on');
                GM_setValue('SP-Autopager', true);
                $(document).on('scroll', autoPager);
            }
        });
        if ($('#pagenavigation').length) {
            if ($('.navbar-header').length) { // new design
                $('#head_left').before(link);
                link.css('position', 'relative');
                link.css('left', '640px');
                link.css('top', '63px');
            } else {
                $('#head_left').parent().append(link);
            }
            $('body').prepend($('<span>', {'id': 'pagenav1'}));
            if (GM_getValue('SP-Autopager', false)) {
                link.click();
            }
        }
    });
}(jQuery));
