// ==UserScript==
// @name            BBC iPlayer video download
// @name:it         BBC iPlayer - Download dei video
// @namespace       http://andrealazzarotto.com/
// @include         http://www.bbc.co.uk/*
// @include         https://www.bbc.co.uk/*
// @version         4.1.6
// @description     Easily download videos from BBC iPlayer (with youtube-dl)
// @description:it  Scarica facilmente i video da BBC iPlayer (con youtube-dl)
// @author          Andrea Lazzarotto
// @require         https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @grant           GM_xmlhttpRequest
// @grant           GM.xmlHttpRequest
// @connect         bbc.co.uk
// @connect         akamaized.net
// @connect         llnwd.net
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/8161/BBC%20iPlayer%20video%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/8161/BBC%20iPlayer%20video%20download.meta.js
// ==/UserScript==

/* Greasemonkey 4 wrapper */
if (typeof GM !== "undefined" && !!GM.xmlHttpRequest)
  GM_xmlhttpRequest = GM.xmlHttpRequest;

var count = 0;

var containers = '.playback-content > button,' +
    '.content-item-description__text-container,' +
    '.episode-panel__intro,' +
    '.vxp-media__summary,' +
    '#programme-clip,' +
    '[class*="__media-asset"],' +
    '.msc-media-player-wrapper';

var get_title = function(name) {
	var title = name || $('meta[property="og:title"]').attr('content') || 'output';
	return title.replace(/\W+/g, '_');
};

var get_JSON = function(url, callback) {
    GM_xmlhttpRequest({
			method: 'GET',
			url: url,
			onload: function(responseDetails) {
				var r = responseDetails.responseText;
				var json = $.parseJSON(r);
                callback(json);
            }
    });
};

var place_link_box = function(element, id) {
	element.after('<div class="gel-wrap" id="' + id + '" />');
	$('#' + id).css({
		'padding': '.75em',
		'margin': '25px auto',
		//'width': $('#player-outer-outer').width(),
		'border': '1px solid #2C2C2C',
		'background-color': '#0A0C16',
		'color': 'white',
		'font-family': 'sans-serif',
		'box-sizing': 'border-box',
		'font-size': '0.9rem'
	});
};

var render_piece = function(html) {
	var tree = $(html);
	if (!tree.length)
		return '';
	var output = [];
	var nodes = tree[0].childNodes;
	var hyph = html.toString().indexOf('<span') > 0 ? '- ' : '';
	for (var o = 0; o < nodes.length; o++) {
		if (nodes[o].toString().indexOf('Text') > 0)
			output.push(hyph + nodes[o].textContent);
		else {
			var name = nodes[o].tagName.toLowerCase();
			switch(name) {
				case 'br':
					output.push(' ');
					break;
				case 'span':
					output.push('\n' + hyph);
					output.push(render_piece(nodes[o]));
					output.push('\n');
					break;
			}
		}
	}
	var joined = output.join('');
	joined = joined.replace(/\s+\n/, '\n').replace(/(^\n|\n$)/, '');
	joined = joined.replace(/\n+/, '\n').replace(/\s+/, ' ');
	return joined;
};

var render_part = function(html, id) {
	var tree = $(html);
	var begin = tree.attr('begin').replace('.', ',');
	var end = tree.attr('end').replace('.', ',');
	return id + '\n' +
		begin + ' --> ' + end + '\n' +
		render_piece(html);
};

var handle_subtitles = function(subURL, element_id, title) {
	if (!subURL)
		return;

    GM_xmlhttpRequest({
		method: 'GET',
		url: subURL,
		onload: function(responseDetails) {
			var r = responseDetails.responseText;
			var doc = $.parseXML(r);
			var $xml = $(doc);

			var srt_list = [];
			$xml.find('p').each(function(index, value){
				srt_list.push(render_part(value.outerHTML, index+1));
			});

            $('#' + element_id + ' #subtitles').remove();
			$('#' + element_id + ' p:last-child').css('margin-bottom', 'auto');
			$('#' + element_id).append('<ul id="subtitles"><li><a id="srt-link">Download converted subtitles (SRT)</a></li>' +
									   '<li><a href="' + subURL + '">Download original subtitles (TTML)</a></li></ul>');
			$('#srt-link').attr('href', 'data:text/plain;charset=utf-8,' +
				encodeURIComponent(srt_list.join('\n\n'))).attr('download', get_title(title) + '.srt');
			$('#' + element_id + ' a').css({
				'color': 'white',
				'font-weight': 'bold'
			});
			$('#' + element_id + ' ul').css({
				'list-style': 'initial',
				'padding-left': '2em',
				'margin-top': '.5em'
			});
		}
	});
};

var append = function(elements, id, parsed, title) {
	var type = parsed.kind || 'video';
	var tool = 'youtube-dl';
	var safe_title = get_title(title);
    var element = $(elements.get(0));

    var objects = parsed[type];
    if (objects.length === 0)
        return;

    $("#" + id).remove();
	element.after('<div id=' + id + '"></div>');
	place_link_box(element, id);

    if (objects.length > 1)
		$('#' + id).append('<h4>Quality level: <select /></h4>');
    $('#' + id).append('<p>To record the ' + type + ', use <code>' + tool + '</code> with the following command line:</p>');

    for (var i in objects) {
        var label = parseInt(objects[i].bitrate);
        var url = objects[i].connection[0].href;
        var format = parsed.kind == 'video' ? 'bestvideo+bestaudio' : 'bestaudio';
        $('#' + id).append('<div id="wrapper-' + i + '"><pre>' + tool + ' -f ' + format + ' "' + url + '" -o ' + safe_title + '</pre></div>');
        $('#' + id + ' select').append('<option value="' + i + '">' + label + "</option>");
    }
    if (location.href.indexOf('iplayer/episode/') > 0) {
        $('#' + id).append('<p><b>Good news!</b> This page is supported by <code>' + tool + '</code>. You can use it directly:</p>');
        $('#' + id).append('<pre>' + tool + ' "' + location.href + '"</pre>');
    }
    $('#' + id + ' div[id*=wrapper]').hide();
    $('#' + id + ' #wrapper-0').show();

    $('#' + id + ' select').css('color', 'black').on('change', function() {
        var index = this.value;
        $('#' + id + ' div[id*=wrapper]').hide();
        $('#' + id + ' #wrapper-' + index).show();
    });

	$('#' + id + ' pre, #' + id + ' code').css({
		'white-space': 'normal',
		'word-break': 'break-all',
		'font-size': $('#direct-link p').css('font-size'),
		'margin': '.75em 0',
		'padding': '.75em',
		'background-color': '#2C2C2C',
		'font-family': '"DejaVu Sans Mono", Menlo, "Andale Mono", monospace'
	});
	$('#' + id + ' code').css('padding','.25em');
	$('#' + id + ' p:last-child').css('margin-bottom', '0');
    $('#' + id + ' *').css({
        'color': 'white',
        'line-height': '1em',
        'font-size': '.9rem'
    });

	return id;
};

var comparator = function(a,b) { return parseInt(b.bitrate)-parseInt(a.bitrate); };

var filter = function(media) {
    if (!media.hasOwnProperty('connection'))
        return;
    if (media.kind != 'video' && media.kind != 'audio')
        return;
    for (var i = media.connection.length - 1; i >= 0; i--) {
        var format = media.connection[i].transferFormat || media.connection[i].format;
        if (format !== 'dash')
            media.connection.splice(i, 1);
    }
};

var classify = function(media) {
    var results = {
        video: [],
        audio: [],
        captions: []
    };
    for (var i = 0; i < media.length; i++) {
        var element = media[i];
        filter(element);
        if(results.hasOwnProperty(element.kind) && ((!element.hasOwnProperty('connection') || element.connection.length)))
            results[element.kind].push(element);
    }
    results.video.sort(comparator);
    results.audio.sort(comparator);
    results.hasCaptions = results.captions.length > 0;
    results.kind = results.video.length ? "video" : "audio";
    return results;
};

var handle_player = function(player) {
    var container = player._container;
    var title = player.playlist.title;
    var vpid, type, kind;

    for (var i = player.playlist.items.length - 1; i >= 0; i--) {
        vpid = vpid || player.playlist.items[i].vpid || player.playlist.items[i].identifier;
        type = type || player.playlist.items[i].type;
        kind = kind || player.playlist.items[i].kind;
        if (vpid !== null)
            break;
    }

    if (vpid === null)
        return false;

    var elements = $(containers);
    if (elements.length === 0)
        elements = container.closest('figure, .play');

    if (kind === 'trailer' || kind === 'ident') {
        try {
            var contents = $('script:contains(window.mediatorDefer = mediator.bind)').html().split('mediator.bind(')[1].split(', docu')[0];
            var data = JSON.parse(contents);
            vpid = data.episode.versions[0].id;
        }
        catch(e) {
            var id = 'video-trailer-warning-' + vpid;
            if (!$('#' + id).length) {
                place_link_box(elements, id);
                $('#' + id).append('<p>To download this ' + type + ', press <i>Play</i> and skip the trailer.</p>');
            }
            return false;
        }
    }

    get_JSON('http://open.live.bbc.co.uk/mediaselector/5/select/version/2.0/mediaset/pc/vpid/' + vpid + '/format/json/', function(data) {
        var parsed = classify(data.media);
        var id = append(elements, 'video-download-' + vpid, parsed, title);
        if (parsed.hasCaptions)
            handle_subtitles(parsed.captions[0].connection[0].href, id, title);
    });

    return true;
};

var monitor = function() {
    if(!unsafeWindow.embeddedMedia)
        return;

    var players = unsafeWindow.embeddedMedia.players;
    if (players.length != count && players[0].playlist) {
        if (count === 0) {
            for (var i = 0; i < players.length; i++)
                if (handle_player(players[i]))
                    count++;
        }
        else
            if (handle_player(players[players.length - 1]))
                count++;
    }
};

$(document).ready(function(){
    setInterval(monitor, 1000);
});