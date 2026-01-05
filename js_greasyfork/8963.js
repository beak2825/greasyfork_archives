// ==UserScript==
// @name               YouTube View Most Popular and Newest Uploader Videos (2018+)
// @namespace          YVMUV
// @version            23.1
// @description        See the user's most 'Popular' and 'Newest' video pages in a sliding-dropdown preview without even having to leave the video page. 
// @run-at             document-start
// @include            *://www.youtube.com/watch?v=*
// @include            *://www.youtube.com/channel/*/videos?*
// @exclude            *://www.youtube.com/tv*
// @exclude            *://www.youtube.com/embed/*
// @exclude            *://www.youtube.com/live_chat*
// @exclude            *://www.youtube.com/feed/subscriptions?flowx=2*
// @require            http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require            https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/js/bootstrap.min.js
// @resource  primefix https://greasyfork.org/scripts/370052-youtube-old-site-design/code/Youtube%20Old%20Site%20Design.user.js
// @resource  primefixb https://greasyfork.org/scripts/32906-get-me-old-youtube/code/Get%20me%20Old%20Youtube.user.js
// @resource spfremove https://greasyfork.org/scripts/16935-disable-spf-youtube/code/Disable%20SPF%20Youtube.user.js
// @grant              GM_getResourceText
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_addStyle
// @author             drhouse
// @contributor        Artain [Get me Old Youtube]
// @downloadURL https://update.greasyfork.org/scripts/8963/YouTube%20View%20Most%20Popular%20and%20Newest%20Uploader%20Videos%20%282018%2B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/8963/YouTube%20View%20Most%20Popular%20and%20Newest%20Uploader%20Videos%20%282018%2B%29.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(function () {

    eval(GM_getResourceText("spfremove"));
    //eval(GM_getResourceText("primefix"));
    eval(GM_getResourceText("primefixb"));


    if(window.location != window.parent.location){
        $('#masthead-positioner').remove();
        $('div.branded-page-v2-top-row').remove();
        $('#appbar-guide-menu').remove();
        $('div#masthead-positioner-height-offset').remove();

        var links = document.getElementById('content').getElementsByTagName('a');

        for(var i=0 ; i<links.length ; i++){
            links[i].setAttribute('target', '_top');
        }
    }
    else {
        //not in frame
    }

    var dest = '#watch7-user-header > div > a';
    var channel = $(dest).attr('href');
    var link = 'https://www.youtube.com' + channel + '/videos?view=0&sort=p&flow=grid';

    var link2 = "'" + link + "'";
    var dest2 = $('#watch8-secondary-actions > div:nth-child(3)');

    var linkdd = 'https://www.youtube.com' + channel + '/videos?view=0&sort=dd&flow=grid';
    var linkdd2 = "'" + linkdd + "'";
    $('<button class="yt-uix-button yt-uix-button-size-default yt-uix-button-has-icon  yt-uix-tooltip addto-button" type="button" title="More actions" aria-pressed="false" id="popular" role="button" aria-haspopup="false" data-tooltip-text="Popular videos" aria-labelledby="yt-uix-tooltip93-arialabel"><span class="yt-uix-button-content"><a href="' + link + '">&nbsp;Most popular videos</a></span></button>').insertAfter(dest2).css('color', '#666')
    $('<button class="yt-uix-button yt-uix-button-size-default yt-uix-button-has-icon  yt-uix-tooltip addto-button" type="button" title="More actions" aria-pressed="false" id="newest" role="button" aria-haspopup="false" data-tooltip-text="Newest videos" aria-labelledby="yt-uix-tooltip93-arialabel"><span class="yt-uix-button-content"><a href="' + linkdd + '">&nbsp;Newest videos</a></span></button>').insertAfter(dest2).css('color', '#666');

    document.getElementById("popular").addEventListener("click", function(event){
        event.preventDefault()
    });
    document.getElementById("newest").addEventListener("click", function(event){
        event.preventDefault()
    });

    $("head").append (
        '<link '
        + 'href="//netdna.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" '
        + 'rel="stylesheet" type="text/css">'
    );

    $("head").append (
        '<link '
        + 'href="//unity.alwaysdata.net/test/push.css" '
        + 'rel="stylesheet" type="text/css">'
    );

    +function ($) {

        // PUSH PLUGIN CLASS DEFINITION
        // ============================

        // variable used to indetify inilitizing of the Push plugin
        var pushAPI = '[data-toggle="push"]' // Default value is '[data-toggle="push"]'

        // Main function to get off canvas element and options
        var Push = function (element, options) {
            this.element = element
            this.options = options
        }

        // Current version
        Push.VERSION = '1.0'

        // Transition duration
        Push.TRANSITION_DURATION = 150

        // Default PUSH plugin settings
        Push.DEFAULTS = {

            // Easing method, used for the element when it (opens / closes).
            easing			: 'cubic-bezier(.2,.7,.5,1)', // Default value is 'cubic-bezier(.2,.7,.5,1)'

            // Duration for an element to (open / close)
            duration		: 1500, // Default value is 300

            // Delay before the element (opens / closes)
            delay			: 1000, // Default value is 0

            // Distance an element (opens / closes)
            distance		: 250, // Default value is 250

            // Enable or disable Anti Scrolling (outside the element)
            antiScroll		: false, // Default value is true

            // Enable or disable keyboard closing (escape key to close the element)
            keyboard		: true, // Default value is true

            // Enable or disable a modal like overlay (outside the element).
            overlay			: false, // Default value is true

            // Canvas element (outside togglable sidebars).
            canvas			: '#body-container' // Default value is '#wrapper'
        }

        // Function to check if the canvas element is open
        Push.prototype.isOpen = function () {

            // Return if the canvas element has the isOpen class
            return $(this.options.canvas).hasClass('isOpen')
        }

        // Function to toggle (open or close)
        Push.prototype.toggle = function () {

            // If canvas is already open
            if (this.isOpen()) {
                this.close() // close canvas and hide element
            }

            // If canvas isn't open
            else {
                this.open() // open canvas and reveal element
            }
        }

        // Function to find all fixed elements
        Push.prototype.findFixed = function () {

            // Filter all elements with position: fixed
            var fixed_elements = $('*').filter(function() {
                return $(this).css("position") === 'fixed';
            }).not(this.element) // Skip sidebar element

            // Return all fixed elements, except the sidebar element
            return fixed_elements
        }

        // Function to disable scrolling outside an element
        Push.prototype.disableScrolling = function () {

            // Add overflow hidden to body, to prevent scrolling
            $(document.body).css('overflow', 'hidden')

            // On touch devices, overflow: hidden, is ignored. So we specefiy another prevention for touch devices.
            if ('ontouchstart' in document.documentElement) {
                $(document).on('touchmove.bs.push', function (e) {
                    e.preventDefault()
                })
            }
        }

        // Function to enable scrolling outside an element
        Push.prototype.enableScrolling = function () {

            // Override the previously added overflow hiddien. To active normal scroll behaviour
            $(document.body).css('overflow', 'auto')

            // Turn off the anti touch functionality for touch devices.
            if ('ontouchstart' in document.documentElement) {
                $(document).off('touchmove.bs.push')
            }
        }

        // Function to disable key press to close an element
        Push.prototype.disableKeyboard = function () {

            // Turn off the previously added keybind to close an open sidebar
            $(window).off('keydown.bs.push')
        }

        // Function to enable key press to close an element
        Push.prototype.enableKeyboard = function () {

            // Add functionality to close a sidebar, with a specefied keybind
            $(window).one('keydown.bs.push', $.proxy(function (e) {
                e.which == 13 && this.close() || e.which == 32 && this.close() // default value is: 27 (ESC key)
            }, this))
        }

        // Function to remove an overlay outside the element
        Push.prototype.disableOverlay = function () {

            // Prepare the overlay variable
            var $overlay = $(".modal-backdrop");

            // Remove previously added overlay effect, from the canvas element
            $overlay.remove();
        }

        // Function to add an overlay outside the element
        Push.prototype.enableOverlay = function () {

            // Prepare the overlay variable
            var $overlay = $('<div class="modal-backdrop in"></div>');

            // Add an overlay effect to the canvas element
            $overlay.appendTo(this.options.canvas);
        }

        // Function to open an element
        Push.prototype.open = function () {

            // Set the (that) variable, for easy access, and to avoid conflict.
            var that = this

            // Get all fixed elements, except the sidebar elements
            var fixedElements = this.findFixed()

            // If options is set to disable scrolling, disable it on opening
            if (this.options.antiScroll) this.disableScrolling()

            // If options is set to enable keyboard, enable it on opening
            if (this.options.keyboard) this.enableKeyboard()

            // If options is set to activate overlay, activate it on opening
            if (this.options.overlay) this.enableOverlay()

            // Reveal the toggled sidebar
            $(this.element).removeClass('hidden')

            // Open the canvas elemen
            $(this.options.canvas)
                .on('click.bs.push', $.proxy(this.close, this)) // If the user clicks on the canvas element, call the close functionality.
                .trigger('open.bs.push') // Trigger the open sequence
                .addClass('isOpen') // adds the isOpen class, to identify that the canvas is open

            // If browser doesn't support CSS3 transitions & translations
            if (!$.support.transition) {

                // Move all specefied fixed elements, when canvas is open
                fixedElements
                    .css({
                    'left': this.options.distance + 'px',
                    'position': 'relative'
                })

                // Move the actual canvas
                $(this.options.canvas)
                    .css({
                    'left': this.options.distance + 'px',
                    'position': 'relative'
                })
                    .trigger('opened.bs.push') // Indicate that the opening sequence is complete
                return
            }

            // Prepare the CSS3 transitioning of the all fixed elements, except for the sidebars
            fixedElements
                .css({
                '-webkit-transition': '-webkit-transform ' + this.options.duration + 'ms ' + this.options.easing,
                '-ms-transition': '-ms-transform ' + this.options.duration + 'ms ' + this.options.easing,
                'transition': 'transform ' + this.options.duration + 'ms ' + this.options.easing
            })

            // Prepare the CSS3 transitioning of the canvas element
            $(this.options.canvas)
                .css({
                '-webkit-transition': '-webkit-transform ' + this.options.duration + 'ms ' + this.options.easing,
                '-ms-transition': '-ms-transform ' + this.options.duration + 'ms ' + this.options.easing,
                'transition': 'transform ' + this.options.duration + 'ms ' + this.options.easing
            })

            this.options.canvas.offsetWidth // Force reflow

            // Move all specefied fixed elements, when the canvas opening sequence is initilised
            fixedElements
                .css({
                '-webkit-transform': 'translateY(' + this.options.distance + 'px)',
                '-ms-transform': 'translateY(' + this.options.distance + 'px)',
                'transform': 'translateY(' + this.options.distance + 'px)'
            })

            // Move the actual canvas element, when the opening sequence is initialised
            $(this.options.canvas)
                .css({
                '-webkit-transform': 'translateY(' + this.options.distance + 'px)',
                '-ms-transform': 'translateY(' + this.options.distance + 'px)',
                'transform': 'translateY(' + this.options.distance + 'px)'
            })
                .one('bsTransitionEnd', function () {
                $(that.options.canvas).trigger('opened.bs.push') // Indicate that the opening sequence is complete
            })
                .emulateTransitionEnd(this.options.duration) // Emulate the ending prosedure of the canvas opening
        }

        // Function to close an element
        Push.prototype.close = function () {

            // Set the (that) variable, for easy access, and to avoid conflict.
            var that = this

            // Get all fixed elements, except the sidebar elements
            var fixedElements = this.findFixed()

            // If options is set to enable keyboard, disable it on closing
            if (this.options.keyboard) this.disableKeyboard()

            // If options is set to activate overlay, deactivate it on closing
            if (this.options.overlay) this.disableOverlay()

            // If options is set to disable scrolling, enable it on clsoing
            if (this.options.antiScroll) this.enableScrolling()

            // Function to finilize the closing prosedure
            function complete () {

                // Hide the toggled sidebar
                $(that.element).addClass('hidden')

                // Reset the CSS3 transitioning and translation, of the all fixed elements back to default.
                fixedElements
                    .css({
                    '-webkit-transition': '',
                    '-ms-transition': '',
                    'transition': '',
                    '-webkit-transform': '',
                    '-ms-transform': '',
                    'transform': ''
                })

                // Reset the CSS3 transitioning and translation, of the canvas element back to default.
                $(that.options.canvas)
                    .removeClass('isOpen') // remove the isOpen class, to identify that the canvas is closed
                    .css({
                    '-webkit-transition': '',
                    '-ms-transition': '',
                    'transition': '',
                    '-webkit-transform': '',
                    '-ms-transform': '',
                    'transform': ''
                })
                    .trigger('closed.bs.push') // Indicate that the closing sequence is complete
            }

            // If browser doesn't support CSS3 transitions & translations
            if (!$.support.transition) {

                // Move back all specefied fixed elements to default.
                fixedElements
                    .css({
                    'left': '',
                    'position': ''
                })

                // Move back the canvas element to default.
                $(this.options.canvas)
                    .trigger('close.bs.push') // Trigger the close sequence
                    .css({
                    'left': '',
                    'position': ''
                })
                    .off('click.bs.push') // Turn off the click indicator for the canvas element

                // Initilise the final closing functionality
                return complete()
            }

            // Remove the CSS3 trasform values for all fixed elements
            fixedElements
                .css({
                '-webkit-transform': 'none',
                '-ms-transform': 'none',
                'transform': 'none'
            })

            // Remove the CSS3 transform values for the canvas element
            $(this.options.canvas)
                .trigger('close.bs.push') // Trigger the close sequence
                .off('click.bs.push') // Turn off the click indicator for the canvas element
                .css({
                '-webkit-transform': 'none',
                '-ms-transform': 'none',
                'transform': 'none'
            })
                .one('bsTransitionEnd', complete) // // Initilize the complete function, to finilise the closing
                .emulateTransitionEnd(this.options.duration) // Emulate the ending prosedure of the canvas closing
        }

        // PUSH PLUGIN DEFINITION
        // ======================

        // Function to initlise the push Plugin
        function Plugin(option) {

            // Begin initilising of the push plugin, for every indicator clicked
            return this.each(function () {

                // Prepare a variable, containing the designated element
                var $this		= $(this)

                // Prepare a variable, containing the data-attributes
                var data		= $this.data('bs.push')

                // Prepare the plugin options
                var options		= $.extend(
                    {
                        // extentions...
                    },
                    Push.DEFAULTS, // Initilise default plugin values
                    $this.data(), // Get the extending options from the plugin indicator
                    typeof option == 'object' && option // Setup an object with the designated options
                )

                // If the push indicatore doesn't contain any data atributes. Use the default values
                if (!data) $this.data('bs.push', (data = new Push(this, options)))

                // If the push indicator has a data attribute, containing a string
                if (typeof option == 'string') data[option]() // Setup the option
            })
        }

        var old = $.fn.push

        $.fn.push				= Plugin
        $.fn.push.Constructor	= Push

        // PUSH AVOID CONFLICT
        // ====================

        $.fn.push.noConflict = function () {

            $.fn.push = old
            return this
        }


        // PUSH DATA-API
        // =============

        // When clicked on a push data API indicator, initilise the plugin
        $(document).on('click', pushAPI, function () {

            // Get all the data options
            var options = $(this).data()

            // Get the designated data-target (sidebar element)
            var $target = $(this.getAttribute('data-target'))

            // If no designated data-target is spcefied, use default value
            if (!$target.data('bs.push')) {
                $target.push(options) // Get all the other data options
            }

            // Toggle the designated data-target (sidebar	)
            $target.push('toggle')
        })
    }(jQuery);

    //----------------------------------------------------------------

    channel = $('#popular > span > a').attr('href');
    var channeln = $('#newest > span > a').attr('href');

    var channel2 = channel + '#browse-items-primary';
    var channel2n = channeln + '#browse-items-primary';

    var ifrm;
    ifrm = document.createElement("iframe");
    ifrm.setAttribute("src", channel2);
    ifrm.setAttribute("id", "ifrmz");
    ifrm.style.width = 1500+"px";
    ifrm.style.height = 548+"px";

    var ifrm2;
    ifrm2 = document.createElement("iframe");
    ifrm2.setAttribute("src", channel2n);
    ifrm2.setAttribute("id", "ifrmz2");
    ifrm2.style.width = 1500+"px";
    ifrm2.style.height = 548+"px";

    $('<nav class="push-sidebar hidden" id="sidebar-left"></nav>').insertBefore('#body-container');
    $('<nav class="push-sidebar hidden" id="sidebar-left2"></nav>').insertBefore('#body-container');
    $( "#body-container" ).wrap( '<section class="canvas" id="canvas"></section>' );

    function newload(){
        $('nav#sidebar-left').append(ifrm);
    }

    function newload2(){
        $('nav#sidebar-left2').append(ifrm2);
    }

    $( "#newest" ).attr({
        'class': "yt-uix-button yt-uix-button-size-default",
        'data-toggle': "push",
        'data-target': "#sidebar-left2",
        'data-distance': "500"
    });

    $( "#newest" ).click(function(e) {
        newload2();

    });

    $( "#popular" ).attr({
        'class': "yt-uix-button yt-uix-button-size-default",
        'data-toggle': "push",
        'data-target': "#sidebar-left",
        'data-distance': "500"
    });

    $( "#popular" ).click(function(e) {
        newload();
    });

});