// ==UserScript==
// @name           Bulk delete
// @description    Delete multiple items in your database
// @match          https://*.memrise.com/course/*/*/edit/database/*
// @run-at         document-end
// @version        1.0.0
// @grant          none
// @namespace      https://greasyfork.org/users/213706
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/549144/Bulk%20delete.user.js
// @updateURL https://update.greasyfork.org/scripts/549144/Bulk%20delete.meta.js
// ==/UserScript==

/* jshint esversion:6 */

function main() {

  var BulkEditer = {
    isOn: false,
    
    /**
     * Entrypoint
     */
    init: function() {
			var $form = $('#content .pool-header .pull-right form').last();

      this.addBtn($form);
    },

    /**
     * Add btn "Bulk delete" to the button list
     * @param element $form
     */
    addBtn: function($form) {
      if(!$form) {
        return;
      }

      var btn = document.createElement('button');
      btn.setAttribute('type', 'button');
      btn.setAttribute('class', 'btn btn-icos-active bulk-delete');
      btn.innerHTML = '<i class="ico ico-plus"></i>Bulk delete';

      setTimeout(function(){
        var $firstBtn = $('.btn', $form).first();

        $(btn).insertBefore($firstBtn);

        btn.addEventListener('click', this.handleClickBtn.bind(this));
      }.bind(this), 0);
    },

    /**
     * When "Bulk delete" is clicked,
     * either display the checkboxes or delete all lines that are checked
     */
    handleClickBtn: function() {
      BulkEditer.isOn = !BulkEditer.isOn;

      if (BulkEditer.isOn) {
        BulkEditer.showCheckboxes();
      } else {
        BulkEditer.handleDelete();
      }
    },

    /**
     * Display checkbox at the beggining of each row
     */
    showCheckboxes: function() {
      $('tr.thing td:first-child').each(function(){
        var html = `<input
          class="bulk-delete"
          type="checkbox"
          title="Select word"
        />`;
        $(this).prepend(html);
      });
    },

    /**
     * Retrieve all lines with checked checkboxes
     * Trigger line deletion
     * And remove all checkboxes
     */
    handleDelete: function() {
      $('.bulk-delete:checked').each(function(){
        var $tr = $(this).closest('tr');

      	BulkEditer.deleteItem($tr);
      });
      $('tr input.bulk-delete').remove();
    },

    /**
     * Delete the given row
     */
    deleteItem: function($tr) {
      if (!$tr) {
      	return;
      }
      var thingId = $tr.data('thing-id');

      $.ajax('/ajax/thing/delete/', {
        method: 'POST',
        data: {
        	thing_id: thingId,
        },
        xhrFields: {
           withCredentials: true
        },
      }).done(function(){
      	$tr.remove();
      });
    },
  };

  BulkEditer.init();
}


// Add CSS
var css = document.createElement('style');
css.textContent = `
    .bulk-delete {
      min-width: unset !important;
    }
    .bulk-delete + .ico-close {
    	display: none !important;
    }`;
document.head.appendChild(css);

// Inject JS directly in page to prevent limitations of access
var script = document.createElement('script');

script.setAttribute("type", "application/javascript");
script.appendChild(document.createTextNode('('+ main +')();'));
document.body.appendChild(script);