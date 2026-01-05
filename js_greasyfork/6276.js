// ==UserScript==
// @name         BrickLink - Wanted List: Automatically Load Images
// @namespace    http://badwing.com/
// @homepage     https://github.com/boneskull/bricklink-scripts
// @version      0.1.2
// @description  Automatically load images when adding items to wanted list
// @author       Christopher Hiller <chiller@badwing.com>
// @include      http://www.bricklink.com/wantedAddDetail.asp?*
// @require      //code.jquery.com/jquery-1.11.1.min.js
// @require      //cdnjs.cloudflare.com/ajax/libs/spin.js/2.0.1/jquery.spin.min.js
// @downloadURL https://update.greasyfork.org/scripts/6276/BrickLink%20-%20Wanted%20List%3A%20Automatically%20Load%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/6276/BrickLink%20-%20Wanted%20List%3A%20Automatically%20Load%20Images.meta.js
// ==/UserScript==
// AjaxQ jQuery Plugin
// Copyright (c) 2012 Foliotek Inc.
// MIT License
// https://github.com/Foliotek/ajaxq

(function($) {

    var queues = {};
    var activeReqs = {};

    // Register an $.ajaxq function, which follows the $.ajax interface, but allows a queue name which will force only one request per queue to fire.
    $.ajaxq = function(qname, opts) {

        if (typeof opts === "undefined") {
            throw ("AjaxQ: queue name is not provided");
        }

        // Will return a Deferred promise object extended with success/error/callback, so that this function matches the interface of $.ajax
        var deferred = $.Deferred(),
            promise = deferred.promise();

        promise.success = promise.done;
        promise.error = promise.fail;
        promise.complete = promise.always;

        // Create a deep copy of the arguments, and enqueue this request.
        var clonedOptions = $.extend(true, {}, opts);
        enqueue(function() {
            // Send off the ajax request now that the item has been removed from the queue
            var jqXHR = $.ajax.apply(window, [clonedOptions]);

            // Notify the returned deferred object with the correct context when the jqXHR is done or fails
            // Note that 'always' will automatically be fired once one of these are called: http://api.jquery.com/category/deferred-object/.
            jqXHR.done(function() {
                deferred.resolve.apply(this, arguments);
            });
            jqXHR.fail(function() {
                deferred.reject.apply(this, arguments);
            });

            jqXHR.always(dequeue); // make sure to dequeue the next request AFTER the done and fail callbacks are fired
            return jqXHR;
        });

        return promise;


        // If there is no queue, create an empty one and instantly process this item.
        // Otherwise, just add this item onto it for later processing.
        function enqueue(cb) {
            if (!queues[qname]) {
                queues[qname] = [];
                var xhr = cb();
                activeReqs[qname] = xhr;
            }
            else {
                queues[qname].push(cb);
            }
        }

        // Remove the next callback from the queue and fire it off.
        // If the queue was empty (this was the last item), delete it from memory so the next one can be instantly processed.
        function dequeue() {
            if (!queues[qname]) {
                return;
            }
            var nextCallback = queues[qname].shift();
            if (nextCallback) {
                var xhr = nextCallback();
                activeReqs[qname] = xhr;
            }
            else {
                delete queues[qname];
                delete activeReqs[qname];
            }
        }
    };

    // Register a $.postq and $.getq method to provide shortcuts for $.get and $.post
    // Copied from jQuery source to make sure the functions share the same defaults as $.get and $.post.
    $.each( [ "getq", "postq" ], function( i, method ) {
        $[ method ] = function( qname, url, data, callback, type ) {

            if ( $.isFunction( data ) ) {
                type = type || callback;
                callback = data;
                data = undefined;
            }

            return $.ajaxq(qname, {
                type: method === "postq" ? "post" : "get",
                url: url,
                data: data,
                success: callback,
                dataType: type
            });
        };
    });

    var isQueueRunning = function(qname) {
        return queues.hasOwnProperty(qname);
    };

    var isAnyQueueRunning = function() {
        for (var i in queues) {
            if (isQueueRunning(i)) return true;
        }
        return false;
    };

    $.ajaxq.isRunning = function(qname) {
        if (qname) return isQueueRunning(qname);
        else return isAnyQueueRunning();
    };

    $.ajaxq.getActiveRequest = function(qname) {
        if (!qname) throw ("AjaxQ: queue name is required");

        return activeReqs[qname];
    };

    $.ajaxq.abort = function(qname) {
        if (!qname) throw ("AjaxQ: queue name is required");
        
        var current = $.ajaxq.getActiveRequest(qname);
        delete queues[qname];
        delete activeReqs[qname];
        if (current) current.abort();
    };

    $.ajaxq.clear = function(qname) {
        if (!qname) {
            for (var i in queues) {
                if (queues.hasOwnProperty(i)) {
                    queues[i] = [];
                }
            }
        }
        else {
            if (queues[qname]) {
                queues[qname] = [];
            }
        }
    };

})(jQuery);

(function () {
  'use strict';

  var img_thumb,
    getImage,
    getUrlParam;

  /**
   * Given a Location object oTarget, parse the value of a particular parameter
   * of its search string.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Location
   * @see https://developer.mozilla.org/en-US/docs/Web/API/URLUtils.search
   * @param {Location} oTarget Location object
   * @param {string} sVar String to parse
   * @returns {string}
   */
  getUrlParam = function getURLParam(oTarget, sVar) {
    return decodeURI(oTarget.search.replace(new RegExp('^(?:.*[&\\?]' +
    encodeURI(sVar).replace(/[\.\+\*]/g, '\\$&') + '(?:\\=([^&]*))?)?.*$', 'i'),
      '$1'));
  };

  /**
   * Given an ID, put the image in the placeholder.
   * @param {string} id Part ID
   */
  getImage = function getImage(id) {
    var item_type = getUrlParam(window.location, 'a').toUpperCase(),
      src = '/getPic.asp?itemType=' + item_type + '&itemNo=' + id;

    $.getq(src).done(function (src) {
      return function () {
        img_thumb.attr('src', src);
      };
    }(src));
  };

  $(function () {
    var txt_itemId = $('input[name="p_selecteditemID"]'),
      val = txt_itemId.val(),
      anchor = $('<a href="#" title="Click to Refresh"></a>')
        .click(function () {
          getImage(txt_itemId.val());
        });

    img_thumb = $('img[name="img1"]');

    // remove error handler; no longer necessary
    // wrap in anchor and bind the click event to refresh.
    img_thumb.removeAttr('onerror')
      .wrap(anchor);

    // if we already have a value, get the image for it
    if (val) {
      getImage(val);
    }

    // update the img as the user types
    txt_itemId.keyup(function () {
      var val = this.value;
      if (val) {
        getImage(this.value);
      }
    });

    // hide unneccessary garbage
    $('input[name="imageType"]').next().css('visibility', 'hidden');
  });


})();
