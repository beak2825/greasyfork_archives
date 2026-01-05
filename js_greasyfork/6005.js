// ==UserScript==
// @name            [bib] RequestUpload
// @namespace       varb
// @version         0.7
// @description     Facilitates uploading and filling requests.
// @include         /^https?://bibliotik.org/(request|torrent)s/\d+/
// @include         /^https?://bibliotik.org/upload/\w+/
// @require         https://cdnjs.cloudflare.com/ajax/libs/q.js/1.1.2/q.min.js
// @require         https://code.jquery.com/jquery-2.1.1.min.js
// @require         https://greasyfork.org/scripts/7055-odinfo/code/ODInfo.js?version=28946
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @grant           GM_addStyle
// @grant           GM_listValues
// @grant           GM_xmlhttpRequest
// @license         WTFPL Version 2; http://www.wtfpl.net/txt/copying/
// @downloadURL https://update.greasyfork.org/scripts/6005/%5Bbib%5D%20RequestUpload.user.js
// @updateURL https://update.greasyfork.org/scripts/6005/%5Bbib%5D%20RequestUpload.meta.js
// ==/UserScript==

$(function () {

var requestpage = {
    category: null,
    reqid: null,
    odid: null,
    odformats: null,
    metadata: {},
    scrapeRequestInfo: function () {
        var $reqdetails = $('#requestDetails'),
            $tags = $('#details_tags a'),
            $authors = $('#creatorlist'),
            reqdmatch = $reqdetails.text().match(/(?:(\w+),\s)?(\w+)\scategory/),
            isbnmatch = $('#description').text().match(/Overdrive Listing \((\d+)\)/);

        if (!reqdmatch) {
            console.log('requp: cannot establish request category');
            return;
        }

        this.reqid = location.pathname.split('/').slice(-1);
        this.category = reqdmatch[2];

        this.metadata.fillform = $('#TorrentIdField').parents('form').find(':hidden').serializeArray();
        this.metadata.overdrive = !!$tags.filter(':contains(overdrive)').length;
        this.metadata.lang = reqdmatch[1];
        this.metadata.title = $('h1').text().match(/\/\s*(.+?)(?:\s\[Retail\]$|$)/)[1];
        this.metadata.publishers = $('#published a').list();
        this.metadata.tags = $tags.not(':contains(overdrive)').list();
        this.metadata.reqformats = $reqdetails.find('strong').text().split('/');
        this.metadata.retail = $reqdetails.text().indexOf('Retail') !== -1;
        this.metadata.authors = $authors.find('a').list();
        this.metadata.isbn = isbnmatch ? isbnmatch[1] : null;
        if (this.category === 'Comics') {
            this.metadata.artists = $authors.next('#creatorlist').find('a').list();
        }

        return true;
    },
    fetchODInfo: function () {
        var dfr = new $.Deferred(),
            odurl = $('a:contains(Overdrive Listing)').attr('href'),
            odtasks = [];

        if (!odurl) {
            return dfr.reject('could not find od listing url').promise();
        }

        odtasks.push({attribute: 'tags'});
        if (this.metadata.reqformats.length === 1 && this.metadata.isbn) {
            odtasks.push({attribute: 'isbnbyformat'});
        }
        OD_getInfo({
            source: odurl,
            tasks: odtasks
        }).then(function (info) {
            dfr.resolve(info);
        }, function (err) {
            dfr.reject(err);
        });

        return dfr.promise();
    },
    run: function () {
        var that = this;

        if ($('#filled').length) {
            console.log('requp: nothing to do here');
            return;
        }

        if (!that.scrapeRequestInfo()) {
            console.log('requp: failed to parse the request');
            return;
        }

        // link upload page
        var upurl = location.origin + '/upload/' + that.category.toLowerCase() + '?reqid=' + that.reqid;
        $('<a/>', {id: 'upreq', href: upurl, text: 'Upload Request'})
            .appendTo('#sidebar ul:first')
            .wrap('<li></li>')
            .after('<span></span>')
            .on('click', function (e) {
                var $that = $(this);

                if (!that.metadata.overdrive) {
                    GM_setValue(that.reqid, JSON.stringify(that.metadata));
                    return;
                }

                console.log('requp: od request');
                e.preventDefault();
                $that.next().addClass('loading');

                that.fetchODInfo()
                    .done(function (info) {
                        console.log('requp: OD info %o', info);
                        that.metadata.isbn = that.metadata.isbn
                            || (that.metadata.reqformats.length === 1
                                && info.isbnbyformat[that.metadata.reqformats[0].toLowerCase()])
                            || info.isbnbyformat['epub']
                            || info.isbnbyformat['pdf'];
                        GM_setValue(that.reqid, JSON.stringify($.extend({}, that.metadata, info)));
                        $that.next().removeClass('loading').text('redirecting...');
                        location.href = $that.attr('href');
                    })
                    .fail(function (reason) {
                        console.error('requp: ' + reason);
                        if (confirm('Failed to acquire OverDrive listing.\nProceed to upload page?')) {
                            GM_setValue(that.reqid, JSON.stringify(that.metadata));
                            location.href = $that.attr('href');
                        }
                        $that.next().removeClass('loading');
                    });
            });
    }
};

var handle = {
    requests: function () {
        requestpage.run();
    },
    upload: function () {
        var FORMATS = { 'MP3':  1,      'PDF':  2,      'CBR': 3,
                        'DJVU': 4,      'CBZ':  5,      'CHM': 6,
                        'FLAC': 10,     'SPX':  13,     'TXT': 14,
                        'EPUB': 15,     'MOBI': 16,     'M4A': 17,
                        'M4B':  18,     'AZW3': 21},
            LANGS = {   'English':   1,     'German': 2,    'French':     3,    'Spanish':    4,
                        'Italian':   5,     'Latin':  6,    'Japanese':   7,    'Swedish':    8,
                        'Norwegian': 9,     'Dutch':  12,   'Russian':    13,   'Portuguese': 14,
                        'Danish':    15,    'Korean': 16,   'Chinese':    17,   'Polish':     18,
                        'Arabic':    19,    'Irish':  20,   'Greek':      21,   'Turkish':    22,
                        'Hungarian': 23,    'Thai':   24,   'Indonesian': 25,   'Bulgarian':  26},
            match = location.search.match(/reqid=(\w+)/),
            reqid = match && match[1],
            req = GM_listValues().indexOf(reqid) !== -1 && JSON.parse(GM_getValue(reqid));

        if (!req) {
            return;
        }

        console.log('requp: filling from request %o', req);
        GM_deleteValue(reqid);

        // populate upload form fields
        $('#AuthorsField').val(req.authors.join(', '));
        if (req.artists && req.artists.length) {
            $('#ArtistsField').val(req.artists.join(', '));
        }
        $('#TitleField').val(req.title);
        $('#IsbnField').val(req.isbn);
        $('#PublishersField').val(req.publisher || req.publishers.join(', '));
        $('#YearField').val(req.pubyear);
        if (req.reqformats.length === 1) {
            $('#FormatField').val(FORMATS[req.reqformats[0]]);
        }
        $('#LanguageField').val(LANGS[req.lang]);
        $('#RetailField').prop('checked', req.retail);
        $('#TagsField').val(req.tags.join(', '));
        $('#ImageField').val(req.coverurl);
        $('#DescriptionField').val(req.description);
        if (req.isbnbyformat) {
            $('#FormatField').on('change', function () {
                var format = $(this).find(':selected').text();
                $('#IsbnField').val(req.isbnbyformat[format.toLowerCase()] || req.isbn);
            });
        }

        // save fill request form again for the torrent page
        $('#TitleField').parents('form').on('submit', function (e) {
            if (! (this.IsbnField.value && this.FormatField.value !== 'noformat')) {
                alert('Either ISBN or Format is empty.');
                return;
            }

            var key = this.IsbnField.value + $(this.FormatField).find(':selected').text();
            GM_setValue(key, JSON.stringify({ id: reqid, fillform: req.fillform }));
        });
    },
    torrents: function () {
        var match = $('#details_content_info').text().match(/^\s*(\w+).+?\((\d+)\)/),
            key = match && match[2] + match[1], // isbn + format
            req = GM_listValues().indexOf(key) !== -1 && JSON.parse(GM_getValue(key)),
            torrid = location.pathname.split('/').slice(-1);

        if (!req) {
            return;
        }

        GM_deleteValue(key);

        req.fillform.push({name: 'TorrentIdField', value: torrid});
        console.log('requp: associated request identified %o', req);

        // add fill request link
        $('<a/>', {href: '/requests/' + req.id, text: 'Fill Request', id: 'fillreq'})
            .appendTo('#sidebar ul')
            .wrap('<li></li>')
            .after('<span></span>')
            .on('click', function (e) {
                var $that = $(this);

                e.preventDefault();

                $that.next().addClass('loading').text('');

                $.post(this.href, $.param(req.fillform)).done(function () {
                    location.href = this.url;
                    $that.next().removeClass('loading').text('redirecting...');
                }).fail(function (xhr) {
                    $that.next().removeClass('loading').text(xhr.status + ' ' + xhr.statusText);
                    console.error('requp: failed to fill request');
                });
            });
    }
};

return function () {
    var page = location.pathname.split('/')[1];

    console.log('requp: initialized');

    if (handle[page]) {
        handle[page]();
    } else {
        console.log('requp: unhandled page ' + page);
    }
};

}());

GM_addStyle('#fillreq+span,#upreq+span{margin-left:10px;font-size:0.8em;}.loading{height:12px;width'
+':12px;background-repeat:no-repeat;display:inline-block;background-image:url(data:image/gif;base64'
+',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);}');
