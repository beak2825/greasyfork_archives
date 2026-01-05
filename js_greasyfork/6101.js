// ==UserScript==
// @name            GoodReads2BB
// @namespace       varb
// @version         0.4
// @description     Creates requests for GoodReads titles
// @match           *://www.goodreads.com/book/show/*
// @match           *://bibliotik.org/requests/create/ebooks*
// @require         https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.pack.js
// @grant           GM_addStyle
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @grant           GM_openInTab
// @license         WTFPL Version 2; http://www.wtfpl.net/txt/copying/
// @downloadURL https://update.greasyfork.org/scripts/6101/GoodReads2BB.user.js
// @updateURL https://update.greasyfork.org/scripts/6101/GoodReads2BB.meta.js
// ==/UserScript==

var $jq = jQuery.noConflict();

$jq(function () {
    console.log('gr2bb: initialized');
    if (location.hostname.indexOf('goodreads') !== -1)
        onGR($jq);
    else
        onReq($jq);
});

function onGR($) {
    var reqid = Math.random().toString(16).substr(2);

    // book metadata
    var book = scrapeBookData();

    // request form
    var reqhtml = '<div id="bbreqwrap"><form>' +
                    '<div><textarea name="notes"></textarea></div>' +
                    '<div>' +
                      '<ul></ul>' +
                      '<button type="submit">Request</button>' +
                    '</div>' +
                  '</form></div>';
    var $req = $(reqhtml).appendTo('body').on('submit', 'form', function () {
        book.notes = this.notes.value;
        GM_setValue('book' + reqid, JSON.stringify(book));
        GM_openInTab('http://bibliotik.org/requests/create/ebooks?reqid=' + reqid);
        $.fancybox.close();
        return false;
    });
    var $notes = $('textarea', $req).on('refresh', function () {
        $(this).val(
            '[img]' + book.cover + '[/img]\n\n' +
            (book.isbn ? '[b]ISBN[/b]: ' + book.isbn + '\n' : '') +
            (book.pubyear ? '[b]Published[/b]: ' + book.pubyear + '\n' : '') +
            (book.pages ? '[b]Pages[/b]: ' + book.pages + '\n' : '') +
            '\n[url=' + document.location + ']GoodReads[/url]\n' +
            '[url=' + stores.Libraries.url + ']Libraries[/url]\n\n' +
            '[b]Online Stores[/b]\n' +
            listStores(stores) + '\n' +
            '[quote]' + book.about + '[/quote]'
        );
    });

    // external resources
    var stores = {};
    var $storelist = $('ul', $req);
    $('#findit').find('a[href*="/follow"]').each(function () {
        stores[this.textContent] = {url: deref(this.href), chk: false};

        if (this.textContent == 'Libraries') return;

        $('<input>', {  'type': 'checkbox',
                        'class': 'store',
                        'data-store': this.textContent,
                        'data-href': this.href
        }).appendTo($storelist).wrap('<li></li>').after($('<a/>', {
                        'href': this.href,
                        'text': this.textContent,
                        'target': '_blank'
        }));
    });
    $storelist.on('change', '.store', function () {
        var $self = $(this);
        stores[$self.data('store')].chk = $self.is(':checked');
        $notes.trigger('refresh');
    });

    // request link
    $('<a/>', { id: 'bbreq', href: '#bbreqwrap' }).text('B').appendTo('body')
        .fancybox({
            afterLoad: function () {
                $notes.trigger('refresh');
            }
        });

    function listStores(s) {
        var list = '';
        for (var store in s) {
            if (store === 'Libraries' || !s[store].chk) continue;
            list += '[url=' + s[store].url + ']' + store + '[/url]\n';
        }
        return list;
    }

    function scrapeBookData() {
        var pubdetails = $('#details .row:contains(Published)').contents()[0].textContent
            .match(/(\d{4})\s+by\s+(.+)/);
        return {
            authors: $('#bookAuthors a').map(function () { return this.text })
                .toArray().join(', '),
            title: $('#bookTitle').text().trim().replace(/\s+/g, ' '),
            pubyear: pubdetails[1],
            publisher: pubdetails[2],
            tags: $('.stacked:contains(Genres)').find('.elementList .left a')
                .map(function () { return this.text.toLowerCase()
                .replace('non fiction', 'nonfiction') }).toArray()
                .filter(function (v, i, a) { return a.indexOf(v) === i }).join(', '),
            about: $('#description').children('span').last().contents().toArray()
                .reduce(function (p, c) { return p + stripNode(c) }, ''),
            cover: $('#coverImage').attr('src'),
            isbn: $('[itemprop=isbn]').text(),
            pages: $('[itemprop=numberOfPages]').text().match(/\d+/).toString()
        };
    }

    function stripNode(n) {
        if (n.nodeType === 3)
            return n.textContent;
        if (n.nodeType === 1)
            switch (n.nodeName) {
                case 'P':
                    if (n.textContent.trim())
                        return '\n' + stripChildNodes(n) + '\n';
                    break;
                case 'BR':
                    return '\n';
                case 'I':
                case 'EM':
                case 'STRONG': // evidently used mainly on titles
                    return '[i]' + stripChildNodes(n) + '[/i]';
                case 'B':
                    return '[b]' + stripChildNodes(n) + '[/b]';
                case 'UL':
                    return '\n[ul]' + stripChildNodes(n) + '[/ul]\n';
                case 'OL':
                    return '\n[ol]' + stripChildNodes(n) + '[/ol]\n';
                case 'LI':
                    return '[*]' + stripChildNodes(n) + '\n';
                case 'A':
                    return '[url=' + n.href + ']' + stripChildNodes(n) + '[/url]';
            }
        return '';

        function stripChildNodes(n) {
            return $(n.childNodes).toArray()
            .reduce(function (p, c) { return p + stripNode(c) }, '');
        }
    }

    function deref(uri) {
        return 'http://www.dereferer.org/?' + encodeURIComponent(uri);
    }
}

function onReq($) {
    var reqid, _match;
    if (_match = location.search.match(/reqid=(\w+)/))
        reqid = _match[1];
    else
        return;

    var book = JSON.parse(GM_getValue('book' + reqid));
    GM_deleteValue('book' + reqid);
    console.dir(book);
    $('#AuthorsField').val(book.authors);
    $('#TitleField').val(book.title);
    $('#PublishersField').val(book.publisher);
    $('#TagsField').val(book.tags);
    $('#NotesField').val(book.notes);
}

GM_addStyle('#bbreq{position:fixed;right:10px;bottom:10px;font:4em "Georgia, serif";color:#000}#bbreq:hover{text-decoration:none}#bbreqwrap{display:none;width:700px;overflow:auto}#bbreqwrap div:first-child{width:70%;float:left}#bbreqwrap div:last-child{width:25%;float:right;text-align:center}#bbreqwrap div:last-child button{font:1.5em Georgia,Times,"Times New Roman",serif;margin-top:30px}#bbreqwrap textarea{width:100%;height:500px}#bbreqwrap ul{list-style:none;text-align:left}#bbreqwrap ul li{padding:3px 0;font-size:1.2em}#bbreqwrap ul li input{margin-right:6px}.fancybox-image,.fancybox-inner,.fancybox-nav,.fancybox-nav span,.fancybox-outer,.fancybox-skin,.fancybox-tmp,.fancybox-wrap,.fancybox-wrap iframe,.fancybox-wrap object{padding:0;margin:0;border:0;outline:0;vertical-align:top}.fancybox-wrap{position:absolute;top:0;left:0;z-index:8020}.fancybox-skin{position:relative;background:#f9f9f9;color:#444;text-shadow:none;-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px}.fancybox-opened{z-index:8030}.fancybox-opened .fancybox-skin{-webkit-box-shadow:0 10px 25px rgba(0,0,0,.5);-moz-box-shadow:0 10px 25px rgba(0,0,0,.5);box-shadow:0 10px 25px rgba(0,0,0,.5)}.fancybox-inner,.fancybox-outer{position:relative}.fancybox-inner{overflow:hidden}.fancybox-type-iframe .fancybox-inner{-webkit-overflow-scrolling:touch}.fancybox-error{color:#444;font:14px/20px "Helvetica Neue",Helvetica,Arial,sans-serif;margin:0;padding:15px;white-space:nowrap}.fancybox-iframe,.fancybox-image{display:block;width:100%;height:100%}.fancybox-image{max-width:100%;max-height:100%}#fancybox-loading,.fancybox-close,.fancybox-next span,.fancybox-prev span{background-image:url(data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAACYCAMAAACoAftQAAAAvVBMVEUAAAAAAAAAAAAODg4AAAAAAAAAAADNzc0BAQHZ2dkDAwMHBwcAAADf398CAgI/Pz8BAQEAAACCgoIcHBzl5eUAAAC/v7/x8fEGBgZnZ2cAAADs7OwGBgb4+Pg/Pz/Jycmenp5nZ2f39/eDg4MAAADQ0ND4+Piurq7a2tr8/Pzs7OwAAAD5+fn9/f3e3t4AAAD///9OTk7BwcE1NTWsrKyNjY2cnJx6enpdXV1oaGgsLCy6uroiIiLOzs5BQUFt3PCNAAAAL3RSTlMAAQMIDRIZHSMnLTpESFNVXWlpbG15en+HiZCWoaGssrO2vsDFydPU3uL4+fr9/Ywv6xsAAAQVSURBVHhe7JZbc6JMGIQXAUOQEMi3uMYkrmopZgqs5ujZ//+zvpdNzMsMlli1N3uRvtCbpzo9I+nmhyqN9OO6GNQ6Ha1SG0mcrhskXe90rvKE6kbX7r9MF4vp2887nfBrqPW0xJemD4w32e7jHIj2602SbNZ7Qfgd0zJLtgKi2B0+tSsE3h8u0RX7HGGfHWrK9oiIbrK69SiQHxTliO5VWtP0rrNEemhoj6muaYqx2XuGyJrwbgUKohhb3hIFM6wCC7Zm4+M5Zs5fpKNiTYndEOUHDFRYCeADLvGiy7DtL7E5/12gJPacalPlqEc2eoFAdmCa2UOGyOhoUuQgwo7PxCwJMGXYGcQMlyCVX3DchCkGs3V6h0iFgyUSZsuS6QQLGaYDhueUHxhf3RpzOqB8dRMcz84lf5FS9A1Ngi2PQm8PF7RBZOnEyqFnSC/BKX6bHQmucpB13mRzCJtTsPUowlpl14if2JifUXcwgeqdA2OLn1C+PdsbzCKkW0a3KeKxbbAxF4FJ9EgAaXGqyFORAuLZNrkMZNoNKnNS9PE5dpltFofjB4PJXIAk5rP/HMu4Ukmm7XjEkwLfc2yT66tJk7lp2T2H1LMtk2wVVsWpcE0SlW4DbeLE/xG3eRvfQv7Fptw4KvpDNRKLt1/3rZty/xbjrPef1+5D018ITYttkiTrfAUsrmzK3RTIT/woHxH3DaZl9h2rRH2aX0ydaYb1BVK1zNdA32RvNn7DkVmmoyeVJvYBMcdl5Vg2/lW0zpSbUNIKT12KLV8wVjsmNvGW63feU3qj86veGQmAA1e5qzbStNZdmVTlRzzbSjG+4+t4u1iqjxxjR6pczaiNBCCVXoGx25X7mUNGgJBHM/QsXWp+dk4U5xJjX4EXSM7ACcCxnnnm2zI8rxVoFgMr/lUwUpyNPvYVx/eRfaUSQzkzLWxEOVhiwynCAd2GvCm/2bquBPEo+LxnDv0YXdyfFOHQP+8EV/kY0enSorxyitoLxxwiabDRqDImWF2JJVBIeVNEk2HgsDGn7vkhcPy67lMOiBGF4AGS3tX8yYqAfb5eF/kRiMPX4cDjEDLd8wezJT4lwtHrMHBtbg6V9oLhYDYLw3A2eSVbn0elSdMCecFg+Ee0Kq7dlftLXSCrRxNE8lzH7hp0Nu3qpHQty7Ztq2sabHvtpb/SLauisVTye1O+N2Ubbxhu2xSAq6x1UwoAWfum8P3Gu5ZNYaUA2jaFJYCofVPYOWnZFD4TcLpxU1ZAnN24KRnfxQ2bshEE/Vub8r0p35vi/t9eHRoBDMNQDJUvMLkOkDMM+8D7b9cR+kOKLPy4juojnQeAkWWVAyLLLINVdovj44N8LOqi/3Djxo0bN5ZvdbWJuwHhrw2ILYdqBwDT2fEEXtrZFmVcCWLiAAAAAElFTkSuQmCC)}#fancybox-loading{position:fixed;top:50%;left:50%;margin-top:-22px;margin-left:-22px;background-position:0 -108px;opacity:.8;cursor:pointer;z-index:8060}#fancybox-loading div{width:44px;height:44px;background:url(data:image/gif;base64,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) center center no-repeat}.fancybox-close{position:absolute;top:-18px;right:-18px;width:36px;height:36px;cursor:pointer;z-index:8040}.fancybox-nav{position:absolute;top:0;width:40%;height:100%;cursor:pointer;text-decoration:none;background:0 0;-webkit-tap-highlight-color:transparent;z-index:8040}.fancybox-prev{left:0}.fancybox-next{right:0}.fancybox-nav span{position:absolute;top:50%;width:36px;height:34px;margin-top:-18px;cursor:pointer;z-index:8040;visibility:hidden}.fancybox-prev span{left:10px;background-position:0 -36px}.fancybox-next span{right:10px;background-position:0 -72px}.fancybox-nav:hover span{visibility:visible}.fancybox-tmp{position:absolute;top:-99999px;left:-99999px;visibility:hidden;max-width:99999px;max-height:99999px;overflow:visible!important}.fancybox-lock{overflow:hidden!important;width:auto}.fancybox-lock body{overflow:hidden!important}.fancybox-lock-test{overflow-y:hidden!important}.fancybox-overlay{position:absolute;top:0;left:0;overflow:hidden;display:none;z-index:8010;background:url(data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpCMEM4NDgzQjlDRTNFMTExODE4NUVDOTdFQ0I0RDgxRSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpGREU5OEVCQzAzMjYxMUUyOTg5OURDMDlDRTJDMTc0RSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpGREU5OEVCQjAzMjYxMUUyOTg5OURDMDlDRTJDMTc0RSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkIxQzg0ODNCOUNFM0UxMTE4MTg1RUM5N0VDQjREODFFIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkIwQzg0ODNCOUNFM0UxMTE4MTg1RUM5N0VDQjREODFFIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+s3YRAQAAABtJREFUeNpiFODh2cBABGBiIBKMKqSOQoAAAwBokQDs5F/8FAAAAABJRU5ErkJggg%3D%3D)}.fancybox-overlay-fixed{position:fixed;bottom:0;right:0}.fancybox-lock .fancybox-overlay{overflow:auto;overflow-y:scroll}.fancybox-title{visibility:hidden;font:400 13px/20px "Helvetica Neue",Helvetica,Arial,sans-serif;position:relative;text-shadow:none;z-index:8050}.fancybox-opened .fancybox-title{visibility:visible}.fancybox-title-float-wrap{position:absolute;bottom:0;right:50%;margin-bottom:-35px;z-index:8050;text-align:center}.fancybox-title-float-wrap .child{display:inline-block;margin-right:-100%;padding:2px 20px;background:0 0;background:rgba(0,0,0,.8);-webkit-border-radius:15px;-moz-border-radius:15px;border-radius:15px;text-shadow:0 1px 2px #222;color:#FFF;font-weight:700;line-height:24px;white-space:nowrap}.fancybox-title-outside-wrap{position:relative;margin-top:10px;color:#fff}.fancybox-title-inside-wrap{padding-top:10px}.fancybox-title-over-wrap{position:absolute;bottom:0;left:0;color:#fff;padding:10px;background:#000;background:rgba(0,0,0,.8)}');