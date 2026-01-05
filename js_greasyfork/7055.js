// ==UserScript==
// @name            ODInfo
// @namespace       varb
// @version         0.3
// @description     Parses OD listings.
// @license         WTFPL Version 2; http:www.wtfpl.net/txt/copying/
// ==/UserScript==

// @param {string|Document} source - url to an OD listing or a Document object of one
// @param {object[]} tasks - single 'attribute' or 'private' key disables the given task,
//   otherwise one is extended or appended to the chain
// @returns {object} Q promise which fulfills with an object of parsed 'attributes'
var OD_getInfo = (function ($) {

'use strict';

var ctx = {
    tasks: [
    {
        attribute: 'odid',
        get: function () {
            return this.$doc.find('meta[property="od:id"]').attr('content')
                || this.rawdoc.match(/meta.+?od:id.+?content=\"([-\w]+)\"/i)[1];
        },
        test: function (odid) {
            return typeof odid === 'string' && odid.length;
        }
    },
    {
        attribute: 'authors',
        get: function () {
            var authors = this.$meta.find('span:contains(Creators)').next().find('dd');
            return authors.length
                    ? authors.list()
                    : this.$doc.find('.creator a[href^="/creators/"]').list();
        },
        test: function (authors) {
            return Array.isArray(authors) && authors.length;
        }
    },
    {
        attribute: 'title',
        get: function () {
            var suffix = [null, 'st', 'nd', 'rd'],
                title, subtitle, ed, series;
            subtitle = this.$doc.find('.pageHeader .subtitle').contents()[0];
            subtitle = subtitle && subtitle.textContent.trim();
            ed = this.$meta.find('dt:contains(Edition)').next().text();
            if (ed) {
                ed += (ed.search(/([^1]|\b)[123]$/) !== -1) ? suffix[ed.substr(-1)] : 'th';
            }
            series = this.$meta.find('dt:contains(Series)').next().text().trim();
            return this.$doc.find('h1.title').text().trim()
                + (subtitle ? ': ' + subtitle : '')
                + (series ? ' (' + series + ')' : '')
                + (ed ? ' (' + ed + ' Edition)' : '');
        },
        test: function (title) {
            return typeof title === 'string' && title.length;
        }
    },
    {
        attribute: 'publisher',
        get: function () {
            return this.$meta.find('dt:contains(Publisher)').next().text().trim();
        },
        test: function (publisher) {
            return typeof publisher === 'string' && publisher.length;
        }
    },
    {
        attribute: 'pubyear',
        get: function () {
            return +this.$meta.find('dt:contains(Publication Date)').next().text();
        },
        test: function (pubyear) {
            return typeof pubyear === 'number' && pubyear;
        }
    },
    {
        attribute: 'formats',
        get: function () {
            var formats = this.$meta.find('span:contains(Format)').next().text().toLowerCase();
            return formats.match(/(\w+)(?=\s(audio|e)?book)/g).filter(function (f, i, a) {
                return i === 0 || a.slice(0, i).indexOf(f) === -1;
            });
        },
        test: function (formats) {
            return Array.isArray(formats) && formats.length;
        }
    },
    {
        // prepare access to supplemental data
        private: 'suppresp',
        get: function () {
            var that = this;

            return Q.Promise(function (ok, fail) {
                var requests = [];

                that.attrs.formats.forEach(function (format) {
                    requests.push(suppRequest(that.attrs.odid, format));
                });

                Q.allSettled(requests).then(function (results) {
                    var suppresp = {};
                    results.forEach(function (result) {
                        if (result.state === 'fulfilled') {
                            suppresp[result.value.format] = $(result.value.page);
                        } else {
                            console.error('odinfo: Supplemental request: ' + result.reason);
                        }
                    });
                    return suppresp;
                }).then(function (suppresp) {
                    ok(suppresp);
                }).catch(function (err) {
                    fail(err);
                });
            });
        },
        test: function (suppresp) {
            return typeof suppresp === 'object' && this.attrs.formats.every(function (f) {
                return typeof suppresp[f] === 'object';
            });
        }
    },
    {
        attribute: 'isbnbyformat',
        get: function () {
            var format, $page, ia, result = {};
            for (format in this.suppresp) {
                $page = this.suppresp[format];
                ia = $page.find('td:contains(ISBN):last').next().text().trim()
                    || $page.find('td:contains(ASIN)').next().text().trim();
                if (ia) {
                    result[format] = ia;
                } else {
                    console.error('odinfo: failed to extract isbn or asin.');
                }
            }
            return result;
        },
        test: function (isbnbyformat) {
            return typeof isbnbyformat === 'object' && Object.keys(this.suppresp).some(function (f) {
                return typeof isbnbyformat[f] === 'string' && isbnbyformat[f].length;
            });
        }
    },
    {
        attribute: 'tags',
        get: function () {
            return this.$doc.find('.tags a').list();
        },
        test: function (tags) {
            return Array.isArray(tags) && tags.length;
        }
    },
    {
        attribute: 'coverurl',
        get: function () {
            var f, $page;
            for (f in this.suppresp) {
                $page = this.suppresp[f];
                try {
                    return $page.find('.nav-link-admin').attr('href').match(/\('(http.+)'\);$/)[1];
                } catch (err) {
                    console.error(err);
                }
            }
        },
        test: function (coverurl) {
            return typeof coverurl === 'string' && coverurl.length;
        }
    },
    {
        attribute: 'description',
        get: function () {
            var $desc = this.$doc.find('.description').clone();
            $desc.children().remove('.tags, .meta').andSelf()
                .find('span:contains(»)').next().andSelf().remove();
            return $desc.toBBCode().trim();
        },
        test: function (desc) {
            return typeof desc === 'string' && desc.length;
        }
    }]
};

ctx.indexFor = ctx.tasks.reduce(function (o, t, i) {
    o[t.attribute || t.private] = i;
    return o;
}, {});

return function (args) {
    extendTasks(args.tasks || []);

    return fetch(args.source)
        .then(parse);
};

function extendTasks(tk) {
    tk.forEach(function (task) {
        var i = ctx.indexFor[task.attribute || task.private];
        if (!i) {
            ctx.tasks.push(task);
        } else if (Object.keys(task).length === 1) {
            ctx.tasks.splice(i, 1);
        } else {
            $.extend(ctx.tasks[i], task);
        }
    });
}

function suppRequest(odid, format) {
    var codeFor = {wma: 25, mp3: 425, epub: 410, pdf: 50, kindle: 420};
    return Q.Promise(function (ok, fail) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://www.contentreserve.com/TitleInfo.asp?ID={' + odid + '}&Format=' + codeFor[format],
            onload: function (res) {
                ok({page: res.responseText, format: format});
            },
            onerror: function (res) {
                fail('Failed requesting ia: ' + res.status + ' ' + res.statusText);
            }
        });
    });
}

function fetch(from) {
    return Q.Promise(function (ok, fail) {
        if (typeof from === 'object' && from.nodeType && from.nodeType === 9) {
            ok(from);
        } else if (typeof from === 'string') {
            GM_xmlhttpRequest({
                url: from,
                method: 'GET',
                onload: function (res) {
                    ok(res.responseText);
                },
                onerror: function (res) {
                    fail(new Error('Failed fetching od listing: ' + res.status + ' ' + res.statusText));
                }
            });
        } else {
            fail(new TypeError('Invalid source. URL or Document expected.'));
        }
    });
}

function TaskError(message, task) {
    this.name = 'TaskError';
    this.message = message;
    this.taskName = task.attribute || task.private;
    this.returned = task.returned;
}
TaskError.prototype = new Error();
TaskError.prototype.constructor = TaskError;

// task objects are used for retrieving specific bits of information from a given listing.
// the 'get' methods are provided a context with access to the raw and jQuery-wrapped Document.
// the context can be extended directly with 'private' getters; 'attribute' values are grouped
//   in an object to be fulfilled by the resulting promise.
// 'test' methods are not required; returning false, depending on the value of an optional
//   'required' boolean, will either terminate the chain or log and carry on.
function parse(doc) {
    return Q.Promise(function (ok, fail) {
        var $doc = $(doc),
            p = Q(), attr;

        $.extend(ctx, {
            attrs: {},
            rawdoc: doc,
            $doc: $doc,
            $meta: $doc.find('.meta-accordion')
        });

        ctx.tasks.forEach(function (task) {
            p = p.then(function () {
                return task.get.call(ctx);
            }).then(function (val) {
                var passed = task.test ? task.test.call(ctx, val) : true;
                if (passed) {
                    if (task.attribute) {
                        ctx.attrs[task.attribute] = val;
                    } else if (task.private) {
                        ctx[task.private] = val;
                    }
                } else {
                    throw new TaskError('Test failed.', $.extend({}, task, {returned: val}));
                }
            }).catch(function (err) {
                var tn = err.taskName || task.attribute || task.private,
                    m = 'odinfo: %s in %s: %s',
                    errargs = [m, err.name, tn, err.message];

                if (task.required) {
                    fail(err instanceof TaskError ? err : new TaskError(err.message, task));
                } else {
                    if (err.returned !== undefined) {
                        errargs[0] += ' Task returned %o';
                        errargs.push(err.returned);
                    }
                    console.error.apply(console, errargs);
                }
            });
        });

        p.then(function () {
            if (Object.keys(ctx.attrs).length) {
                ok(ctx.attrs);
            } else {
                fail(new Error('Failed to parse listing'));
            }
        });
    });
}

})(jQuery);


(function ($) {

// retrieve an array of text contents from the set of matched elements
$.fn.list = function () {
    return $.map(this, function (e) {
        return e.textContent;
    });
};

// flatten a set of matched elements wrapping content in bbcode entities
$.fn.toBBCode = function () {
    var nodes = this.get(),
        frag = document.createDocumentFragment();
    nodes.forEach(function (node) {
        frag.appendChild(node.cloneNode(true));
    });
    return strip(frag);
};

var entityFor = {
    P:      function (s)    { return '\n' + s + '\n'; },
    BR:     function ()     { return '\n'; },
    I:      function (s)    { return '[i]' + s + '[/i]'; },
    EM:     function (s)    { return this.I(s); },
    B:      function (s)    { return '[b]' + s + '[/b]'; },
    STRONG: function (s)    { return this.B(s); },
    UL:     function (s)    { return '\n[ul]' + s + '[/ul]\n'; },
    OL:     function (s)    { return '\n[ol]' + s + '[/ol]\n'; },
    LI:     function (s)    { return '[*]' + s + '\n'; },
    A:      function (s, n) { return '[url=' + n.href + ']' + s + '[/url]'; }
};

function strip(node) {
    var result = '',
        parent = node;
    if (node.nodeType === 3) {
        return node.textContent;
    }
    if (node.nodeType !== 1 && node.nodeType !== 11) {
        return '';
    }
    node = node.firstChild;
    while (node) {
        result += strip(node);
        node = node.nextSibling;
    }
    return entityFor[parent.nodeName] ? entityFor[parent.nodeName](result, parent) : result;
}

})(jQuery);
