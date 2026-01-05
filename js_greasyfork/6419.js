// ==UserScript==
// @name         Edit ZapChain Answer inline
// @namespace    https://zapchain.com
// @version      0.1
// @description  Adds a button to edit your ZapChain answer inline into the page | BTC Donations welcome: http://onename.io/jt
// @author       Jess Telford, http://onename.io/jt
// @match        https://www.zapchain.com/a/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/6419/Edit%20ZapChain%20Answer%20inline.user.js
// @updateURL https://update.greasyfork.org/scripts/6419/Edit%20ZapChain%20Answer%20inline.meta.js
// ==/UserScript==
;(function() {

  // Initial timeout, will be increased exponentially
  var timerInterval = 50;

  var answersByUser = {};
  var answerElementSelectors = [];

  // Once the page is loaded
  $(function() {
    var userId = Parse.User.current().id;
    var questionId = window.location.pathname.replace('/a/', '');

    var Question = Parse.Object.extend('Question');
    var query = new Parse.Query(Question);

    query.equalTo('autoquestionid', questionId);
    query.equalTo('askedof', userId);

    query.find({
      success: function(results) {

        $(results).each(function(i, result) {
          var answer = result.toJSON();
          answersByUser[answer.objectId] = answer;
          answerElementSelectors.push('#qanda' + answer.objectId);
        });

        if (answerElementSelectors.length > 0) {
          // Kick off the timeouts
          startTimeout();
        }
      }
    });

  });

  function startTimeout() {
    window.setTimeout(checkForElements, timerInterval);
  }

  function checkForElements() {

    // Ensure the correct number of elements exist in the page before proceeding
    if ($(answerElementSelectors.join(',')).length == answerElementSelectors.length) {

      // Find all the elements and make them editable
      $.each(answersByUser, function(answerId, answer) {

        var answerEl = $('#qanda' + answerId).first();

        if (answerEl.length > 0) {
          makeAnswerEditable(answer, answerId, answerEl);
        }

      });

    } else {
      timerInterval = timerInterval * 2;
      startTimeout();
    }

  }

  function makeAnswerEditable(result, answerId, container) {

    var answerEl = $('#answertext' + answerId, container);

    // The new editable text area
    var textareaEl = $('<textarea>' + result.answer + '</textarea>')
      .attr('id', 'editedanswertext' + answerId)
      .css({
        boxSizing: 'border-box',
        width: '100%',
        fontSize: '18px',
        lineHeight: '160%',
        wordBreak: 'normal',
        display: 'none'
      });

    // Insert it into the page
    textareaEl.insertAfter(answerEl);

    // Build the Edit button's HTML
    var editEl = $('<button>Edit</button>')
      .attr('id', 'edit_button' + answerId)
      .css({
        padding: '10px',
        float: 'right',
        cursor: 'pointer'
      });

    var saveEl = editEl.clone(false)
      .css({
        display: 'none'
      })
      .html('Save');

    // Set up the click handler to start editing the content
    editEl.on('click', function() {
      editEl.hide();
      answerEl.hide();

      saveEl.show();
      textareaEl.show();
    });

    saveEl.on('click', function() {
      saveEl.attr('disabled', 'disabled');
      saveEl.css('pointer', 'auto');
      saveAnswer(textareaEl.val(), answerId);
    });

    // Insert the buttons into the page
    saveEl.prependTo($('#loggedin_like' + answerId, container));
    editEl.prependTo($('#loggedin_like' + answerId, container));

    function saveAnswer(answer, answerId) {

      // Update question with the answer
      var Question = Parse.Object.extend("Question");
      var question = new Question();
      question.id = answerId;

      // Set a new value on quantity
      question.set("answer", answer);

      // Save
      question.save(null, {
        success: function(question) {
          location.reload();
        },
        error: function(point, error) {
          console.error('Error saving answer:', arguments);
        }
      });
    }
    
  };
})()
