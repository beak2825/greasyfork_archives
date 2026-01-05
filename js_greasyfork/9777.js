// ==UserScript==
// @name        Inoreader Masonry Extended View
// @description Changes The Extended View to a nice card view which is nice
// @namespace	http://www.inoreader.com/
// @version		0.6
// @copyright	Zoltan Wacha
// @include		http://*.inoreader.com/*
// @include		https://*.inoreader.com/*
// @require		http://code.jquery.com/jquery-latest.js
// @grant		GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/9777/Inoreader%20Masonry%20Extended%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/9777/Inoreader%20Masonry%20Extended%20View.meta.js
// ==/UserScript==


GM_addStyle ( "\
  .reader_pane_view_style_1 .article_card {\
	float: left; \
	}\
  .reader_pane_view_style_1 .article_card .article_footer_buttons{\
	font-size: 0; \
	}\
" );

document.getElementById('reader_pane').addEventListener('DOMNodeInserted', gmAddedChecker, false);
document.getElementById('reader_pane').addEventListener('scroll', gmMain, false);

function gmAddedChecker() {
	if($('#reader_pane').hasClass('reader_pane_view_style_1'))
	{
		if(!$('#reader_pane #z_m_lastoid').length > 0)
		{
			$('<div id="z_m_lastoid" style="display:none;">0</div>').prependTo('#reader_pane');
		}
		var lastoid = $('#z_m_lastoid').text();
		
		$lastelem = $('#reader_pane .article_card:last');
		if($lastelem.data('oid') != lastoid)
		{	
			//console.log('run added');
			lastoid = $lastelem.data('oid');
			$('#z_m_lastoid').text(lastoid);
			
			gmMain();
		}
	}
}

function gmMain() {
	
	if($('#reader_pane').hasClass('reader_pane_view_style_1'))
	{
		if(!$('#reader_pane #z_m_originaltop').length > 0)
		{
			$('<div id="z_m_originaltop" style="display:none;">'+$('#reader_pane .article_card:first').position().top+'</div>').prependTo('#reader_pane');
		}
		var originaltop = parseInt($('#z_m_originaltop').text());
		
		if(!$('#reader_pane #z_m_articlesheightsum').length > 0)
		{
			$('<div id="z_m_articlesheightsum" style="display:none;">-1</div>').prependTo('#reader_pane');
		}
		var articlesheightsum_prev = parseInt($('#z_m_articlesheightsum').text());
		var articlesheight_current = 0;
		
		{			
			$('#reader_pane .article_card').each( function(index) {
				articlesheight_current = articlesheight_current + $(this).outerHeight();
			});
			
			if(articlesheightsum_prev != articlesheight_current && !$('#z_m_articlesheightsum').hasClass('running'))
			{
				//console.log('run change');
				$('#z_m_articlesheightsum').text(articlesheight_current);
				$('#z_m_articlesheightsum').addClass('running');
				
                if($('div#sinner_container').length > 0)
                {
                    $sideadwidth = $('div#sinner_container').outerWidth();
                }
                else
                {
                    $sideadwidth = 0;
                }
                
				column1top = originaltop;
				column2top = originaltop;
				
				$('#reader_pane .article_card').each( function(index) {
					if(column1top <= column2top)
					{
						$(this).css('left', 0);
						$(this).css('top',column1top);
                        $(this).css('width','calc(50% - ' + (35 + ($sideadwidth / 2)) + 'px)');
						column1top = column1top + $(this).outerHeight() + 12;
                        $(this).children('.article_full_contents').children('.article_content').children('div').css('width', '');
					}
					else
					{
						$(this).css('left', 'calc(50% - ' + (0 + ($sideadwidth / 2)) + 'px)');
						$(this).css('top',column2top);
                        $(this).css('width','calc(50% - ' + (35 + ($sideadwidth / 2)) + 'px)');
						column2top = column2top + $(this).outerHeight() + 12;
                        $(this).children('.article_full_contents').children('.article_content').children('div').css('width', '');
					}
					$(this).css('position','absolute');
				});
				
				$('#no_more_div').css('top',Math.max(column1top,column2top));
				$('#no_more_div').css('position','absolute');
				$('#no_more_div').css('width','100%');
				
				$('#z_m_articlesheightsum').removeClass('running');
			}
		}
	}
}
