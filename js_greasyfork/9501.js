// ==UserScript==
// @name       hide movies downloaded
// @namespace  torrentbutler.eu
// @version    0.1
// @description  Hide movies you have downloaded from torrentbutler
// @match      http://torrentbutler.eu/*
// @copyright  2015+, Atomic
// @downloadURL https://update.greasyfork.org/scripts/9501/hide%20movies%20downloaded.user.js
// @updateURL https://update.greasyfork.org/scripts/9501/hide%20movies%20downloaded.meta.js
// ==/UserScript==

$(function(){   
    function Movie(that){
        this.that = that;
        this.id = $(this.that).prop('href').split('/').pop();
        this.seen = localStorage.getItem(this.id) ? true : false;
        this.button_check = $('<input>').prop('type', 'checkbox').attr('style', 'float:right;');
        this.init();
    }
    
    Movie.prototype = {
        add_event_click: function(){
            var that = this;
            $(this.check_button).click(function(){
                if($(this).prop('checked')) {
                    localStorage.setItem(that.id, true);
                    $(that.that).addClass('hide').hide();
                } else {
                    localStorage.removeItem(that.id);
                    $(that.that).removeClass('hide').hide();
                }
            });
        },
        add_check_button: function(checked){
            this.check_button = this.button_check.clone().prop('id', this.id).prop('checked', this.seen).addClass('movie-seen-check');
            $("strong.title span", $(this.that)).after(this.check_button);
            this.add_event_click();
        },
        hide_movie: function(){
            if ($('#show-movie-seen').data('click-show-hidden')) {
                if (!this.seen) $(this.that).hide();
            } else {
                if (this.seen) $(this.that).addClass('hide').hide();
            }
        },
        init: function(){
            this.add_check_button();
            this.hide_movie();
            $(this.that).addClass("with-init");
        }
    }
    
    function MovieInit(){
        this.button_movies_seen();
        this.init();
    }
    MovieInit.prototype = {
        add_event_button: function(button){
            $(button).click(function(e){
                e.preventDefault();
                var data_name = 'click-show-hidden';
                $(this).data(data_name) ? $(this).data(data_name, false) : $(this).data(data_name, true);
                if ($(this).data(data_name)) {
                    $('.movie').hide();
                    $('.movie.hide').show();
                } else {
                    $('.movie.hide').hide();
                    $('.movie').not('.hide').show();
                }
            });
        },
        button_movies_seen: function(){
            var switcher_content = $('<div>').prop('class', 'switcher').prop('id', 'show-movie-seen').attr('data-click-show-hidden', false);
            var switcher_button = $('<a>').prop('href', '#').text('Show movie seen');
            switcher_content.html(switcher_button.clone());
            var button = switcher_content.clone()
            $('#priority_switcher').after(button);
            this.add_event_button(button);
        },
        init: function(){
            $(".movie").each(function() {
                new Movie($(this));
            });
            $(document).ajaxComplete(function(event, xhr, settings) {
                if (settings.url.search(/\/page\//) != -1) {
                    $(".movie").not(".with-init").each(function(){
                        new Movie($(this));
                    });
                }
            });
            $(document).ajaxSend(function(event, xhr, settings) {
                if (settings.url.search(/\/page\//) != -1 && $('#show-movie-seen').data('click-show-hidden')) {
                    $('#loading').hide();
                }
            });
        }
    }
    
    new MovieInit();
});
