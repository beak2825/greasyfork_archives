// ==UserScript==
// @name        Puzzling.SE Empuzzler
// @namespace   https://greasyfork.org/users/5615-doppelgreener
// @description Hide answers and comments on Puzzling.SE questions until you want to see them.
// @grant       none
// @include     http://puzzling.stackexchange.com/questions/*
// @version     0.4.1
// @downloadURL https://update.greasyfork.org/scripts/5570/PuzzlingSE%20Empuzzler.user.js
// @updateURL https://update.greasyfork.org/scripts/5570/PuzzlingSE%20Empuzzler.meta.js
// ==/UserScript==

// Changelog:
// 0.4.1    By Joe: don't bother hiding the comments section when there are none, and same for answers
// 0.4      By Joe: less stuff gets hidden (eg. post-answer box), moved hide/show answers beneath #answers-header,
//              fixed English grammar on buttons, show number of comments that have been hidden, stopped a button
//              showing if there is nothing for it to reveal (no answers means show-answer button never appears)
// 0.3      Buttons made larger. Added auto-update. Merged clean-up by Joe (Puzzling.SE user 2518).
// 0.2      Show Everything button added.
// 0.1      First version, with show comments/answers buttons only.
(function() {

    var main = function() {

        var identifiers,
            styles,
            questionCommentsCount = $('#question').find('.comment').length,
            answersCount = $('#answers').find('.answer').length,
            commentsButton,
            answersButton,
            showAllButton;

        if ($('#question').find('.comments-link.js-show-link b').length) {
            questionCommentsCount += parseInt( $('#question').find('.comments-link.js-show-link b').text() );
        }

        identifiers = {
            'comments': 'show-comments',
            'answers': 'show-answers'
        };
        identifiers.both = identifiers.comments + ' ' + identifiers.answers

        styles = {
            'hide-comments': [
                'body:not(.' + identifiers.comments + ') #question .comments            { display: none; }',
                'body:not(.' + identifiers.comments + ') #question .comments-link       { display: none; }',
                'body:not(.' + identifiers.comments + ') #question .comments-link ~ *   { display: none; }',
                'body:not(.' + identifiers.comments + ') #question .bounty-link         { display: none; }',
                'body.' + identifiers.comments + ' .' + identifiers.comments + '        { display: none; }'  // hide the button(s)
            ],
            'hide-answers': [
                'body:not(.' + identifiers.answers + ') #answers .answer                { display: none; }',
                'body:not(.' + identifiers.answers + ') #answers-header + .empuzzler    { margin-top: 1em; }',
                'body.' + identifiers.answers + ' .' + identifiers.answers + '          { display: none; }'  // hide the button(s)
            ],
            'empuzzler-misc': [
                '.empuzzler button { margin: 0.5em; padding: 0.5em; }',
                '.empuzzler button:first-child { margin-left: 0; }'
            ]
        };

        // Creates a button with chosen type, text and affecting certain classes
        function makeButton(buttonText, classesToAdd) {
            return $('<button/>')
                .text(buttonText)
                .addClass(classesToAdd)
                .on('click', function() {
                    $('body').addClass(classesToAdd);
                });
        }

        // Create a container for the buttons and insert it after the question
        if (questionCommentsCount) {
            commentsButton = makeButton(
                'Show the ' + questionCommentsCount + ' comment' + (~-questionCommentsCount ? 's' : '') + ' on this question',
                identifiers.comments
            ).on('click', function() {
                $('#question').find('.comments-link.js-show-link').trigger('click');
            });
            showAllButton = makeButton('Show me everything!', identifiers.both)
                .addClass('button')
                .on('click', function() {
                    commentsButton.trigger('click');
                });

            $('<div/>')
                .addClass('empuzzler ' + identifiers.comments)
                .append(
                    commentsButton,
                    answersCount ? $('<span/>').addClass(identifiers.both).text(' or ') : '',
                    answersCount ? showAllButton : ''
                )
                .insertAfter('#question');
        } else {
            $('body').addClass( identifiers.comments );
        }

        if (answersCount) {
            answersButton = makeButton('Show me the answer' + (~-answersCount ? 's' : ''), identifiers.answers);

            $('<blockquote/>')
                .addClass('empuzzler ' + identifiers.answers)
                .append(
                    $('<p/>').text(
                        (~-answersCount ? 'These answers have' : 'This answer has')
                        + ' been hidden by Empuzzler so you don\'t accidentally spoil the question for yourself. To bring '
                        + (~-answersCount ? 'them' : 'it')
                        + ' back, just click...'
                    ),
                    answersButton
                )
                .insertAfter('#answers-header');
        } else {
            $('body').addClass( identifiers.answers );
        }

        // Add the CSS to the page
        for (var i in styles) {
            if (styles.hasOwnProperty(i)) {
                el = document.createElement('style');
                el.id = 'empuzzler-styles';
                el.type = 'text/css';
                el.textContent = styles[i].join("\n");
                (document.head || document.documentElement).appendChild(el);
            }
        }

    };

    // Add the JS to the page
    var el = document.createElement('script');
    el.type = 'text/javascript';
    el.id = 'empuzzler-script'
    el.textContent = '(' + main.toString() + ')();';
    document.body.appendChild(el);

})();