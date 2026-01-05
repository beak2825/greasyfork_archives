// ==UserScript==
// @name         BigTime Enhancements
// @namespace    http://mikebranski.com/
// @version      2.1.3
// @description  Adds keyboard shortcuts and displays a running weekly total for each project.
// @author       Mike Branski (@mikebranski)
// @match        https://*.bthost.com/*
// @grant        none
// @homepage     https://github.com/mikebranski/userscripts
// @downloadURL https://update.greasyfork.org/scripts/8357/BigTime%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/8357/BigTime%20Enhancements.meta.js
// ==/UserScript==

(function(window, undefined) {

	WeeklyTotalsCalculator = {

		// An array of all external script dependencies to be loaded.
		dependencies: [
			'https://cdnjs.cloudflare.com/ajax/libs/mousetrap/1.4.6/mousetrap.min.js'
		],

		dependencies_to_load: [],

		timesheet: document.getElementById('tblGrid'),

		rows: null,

		init: function() {
			// Load external resources.
			this.fetchDependencies();

			// Run the initial calculation.
			this.calculateTotals();

			// Bind event listeners.
			this.bindEventListeners();
		},

		fetchDependencies: function() {
			// Identify the injection point for the scripts.
			this.script_target = document.getElementsByTagName('head')[0];

			// Copy the depencies property to a mutable array we'll cycle through.
			this.dependencies_to_load = this.dependencies;

			// Kick over the first domino.
			this.loadNextDependency();
		},

		loadNextDependency: function() {
			var self, script, url;

			// Safety net.
			if (!this.dependencies_to_load.length) {
				return;
			}

			// Needed for the onload callback.
			self = this;

			// Shift the next dependency off the chain for loading.
			url = this.dependencies_to_load.shift();

			// Create the script element we're going to inject.
			script = document.createElement('script');
			script.src = url;

			// Bind the callback to fire once the script has loaded.
			script.onload = function() {
				// If we've finished loading dependencies, let the app know.
				if (!self.dependencies_to_load.length) {
					self.dependenciesLoaded();
					return;
				}

				// Otherwise, load the next dependency.
				self.loadNextDependency();
			}

			// Insert the script.
			this.script_target.appendChild(script);
		},

		/**
		 * This runs when all dependencies have finished loading, typically used
		 * to set up additional app functionality and event bindings.
		 */
		dependenciesLoaded: function() {

			// Override the stopCallback function so that it always returns false.
			// This ensures Mousetrap fires even when the user is in text fields
			// and other content editable elements.
			Mousetrap.stopCallback = function(e, element, combo) {
				return false;
			}

			// Go to the current week's timesheet when Cmd + Shift + C is pressed.
			Mousetrap.bind('command+shift+c', function(e) {
				var submission_uri;

				// @todo: Create a URL generator function so we don't need to
				//        do this parsing silliness every time.

				// Build the URI to the current week's timesheet view.
				current_timesheet_uri = window.location.pathname;

				// If the URI begins with a slash, remove it for now to make
				// splitting on slashes easier.
				if (current_timesheet_uri.substring(0, 1) === '/') {
					current_timesheet_uri = current_timesheet_uri.substring(1);
				}

				// Determine the account URL identifier: split on slashes and grab
				// the first part, and add a leading slash.
				current_timesheet_uri = '/' + current_timesheet_uri.split('/')[0];

				// Tack on the current week's timesheet page.
				current_timesheet_uri += '/EAPSA_MGMT.ASP?WCI=eaMain&WCE=tplTableDef&HTML=TSWKEI.htm&ObjectType=EATimesheet';

				// And away we go!
				window.location.href = current_timesheet_uri;

				// Flerp flerp.
				return false;
			});

			// Save the timesheet when Cmd + S is pressed.
			Mousetrap.bind('command+s', function(e) {
				var save_btn = document.querySelector('img[src="images/buttons/save_sm.gif"]');

				save_btn.click();

				return false;
			});

			// Go to the timesheet submission page when Cmd + Shift + S is pressed.
			Mousetrap.bind('command+shift+s', function(e) {
				var submission_uri;

				// Build the URI we'll send the user to where they can submit their
				// timesheet.
				submission_uri = window.location.pathname;

				// If the URI begins with a slash, remove it for now to make
				// splitting on slashes easier.
				if (submission_uri.substring(0, 1) === '/') {
					submission_uri = submission_uri.substring(1);
				}

				// Determine the account URL identifier: split on slashes and grab
				// the first part, and add a leading slash.
				submission_uri = '/' + submission_uri.split('/')[0];

				// Tack on the timesheet submission page.
				submission_uri += '/EAPSA_MGMT.ASP?WCI=eaMAIN&WCE=tplBasic&HTML=Daily_511.htm';

				// And away we go!
				window.location.href = submission_uri;

				// Flerp flerp.
				return false;
			});
		},

		calculateTotals: function() {
			// Get the current rows that contain timesheet data.
			this.rows = this.timesheet.querySelectorAll('tr[isdatarow="TRUE"]');

			for (var i = 0; i < this.rows.length; i++) {
				var
					row = this.rows[i],

					// These hold the time values for each day.
					entries = row.querySelectorAll('.list-item-frm .ea-input-item-sm'),

					// The total project hours logged for the week.
					total = 0,

					// This is where we'll plop the total, alongside the delete icon. Because that's easier than adding a new th/td to every row.
					total_parent = row.children[9].querySelector('p'),

					total_element = total_parent.querySelector('b.total');

					// Loop over each of the entries and add up the time.
					for (var n = 0; n < entries.length; n++) {
						var entry_value = entries[n].value.trim();

						// Skip empty cells and non-numbers.
						if (!entry_value || Number.isNaN(entry_value)) {
							continue;
						}

						// Add this entry to the running total.
						total += parseFloat(entry_value);
					}

					// Create the total element if it doesn't exist.
					if (!total_element) {
						total_element = document.createElement('b');

						// This is for querying later.
						total_element.classList.add('total');

						// Make it look not terrible.
						total_element.style.display   = 'inline-block';
						total_element.style.width     = '25px';
						total_element.style.textAlign = 'right';

						// Prepend it to the parent, before the delete button.
						total_parent.insertBefore(total_element, total_parent.firstChild);
					}

					// Update the total.
					total_element.innerHTML = total;
				}
		},

		bindEventListeners: function() {
			var self = this;

			// Every time an entry changes, re-calculate.
			self.timesheet.addEventListener('change', function(event) {
				// We're only interested in time entries.
				if (event.target.classList.contains('ea-input-item-sm')) {
						self.calculateTotals();
				}
			});
		}
	};

	WeeklyTotalsCalculator.init();

})(window);
