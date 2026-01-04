// ==UserScript==
// @name         Nyaa Batch Copy + Send to Deluge Efficient Select
// @namespace    https://greasyfork.org/en/users/1466117
// @license      MIT
// @version      0.5
// @description  Batch copy magnet links or send to remote deluge client
// @author       Mocha
// @include      http*://nyaa.*
// @include      http*://nya.*
// @grant        GM_xmlhttpRequest
// @grant        GM_cookie
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-body
// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.11/clipboard.min.js
// @require      http://code.jquery.com/jquery-3.1.0.slim.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/markdown-it/8.3.1/markdown-it.min.js
// @downloadURL https://update.greasyfork.org/scripts/560319/Nyaa%20Batch%20Copy%20%2B%20Send%20to%20Deluge%20Efficient%20Select.user.js
// @updateURL https://update.greasyfork.org/scripts/560319/Nyaa%20Batch%20Copy%20%2B%20Send%20to%20Deluge%20Efficient%20Select.meta.js
// ==/UserScript==

(function() {
	"use strict";
	var $ = window.jQuery;
	var delugeConnected = false;
	var delugeCookie = null;

	// ===== DELUGE CONFIGURATION =====
	// These will be loaded from Tampermonkey storage or prompted from user
	let DELUGE_URL = GM_getValue('deluge_url', null);
	let DELUGE_PASSWORD = GM_getValue('deluge_password', null);
	// ================================

	// Drag selection state
	var isDragging = false;
	var dragMode = null; // 'check' or 'uncheck'
	var dragStarted = false;

	function promptForSettings() {
		// Create modal overlay
		var overlay = $('<div>')
		.attr('id', 'deluge-settings-overlay')
		.css({
			position: 'fixed',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			backgroundColor: 'rgba(0, 0, 0, 0.7)',
			zIndex: 10000,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center'
		});

		// Create modal content
		var modal = $('<div>')
		.css({
			backgroundColor: '#2b2b2b',
			padding: '30px',
			borderRadius: '10px',
			maxWidth: '500px',
			width: '90%',
			boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)'
		});

		var title = $('<h2>')
		.text('Deluge WebUI Configuration')
		.css({
			marginTop: 0,
			marginBottom: '20px',
			color: '#ffffff'
		});

		var urlLabel = $('<label>')
		.text('Deluge WebUI URL:')
		.css({
			display: 'block',
			marginBottom: '5px',
			fontWeight: 'bold',
			color: '#e0e0e0'
		});

		var urlInput = $('<input>')
		.attr('type', 'text')
		.attr('id', 'deluge-url-input')
		.attr('placeholder', 'http://localhost:8112')
		.val(DELUGE_URL || '')
		.css({
			width: '100%',
			padding: '10px',
			marginBottom: '15px',
			border: '1px solid #555',
			borderRadius: '5px',
			boxSizing: 'border-box',
			fontSize: '14px',
			backgroundColor: '#1a1a1a',
			color: '#ffffff'
		});

		var passwordLabel = $('<label>')
		.text('Deluge Password:')
		.css({
			display: 'block',
			marginBottom: '5px',
			fontWeight: 'bold',
			color: '#e0e0e0'
		});

		var passwordInput = $('<input>')
		.attr('type', 'password')
		.attr('id', 'deluge-password-input')
		.attr('placeholder', 'Your Deluge password')
		.val(DELUGE_PASSWORD || '')
		.css({
			width: '100%',
			padding: '10px',
			marginBottom: '20px',
			border: '1px solid #555',
			borderRadius: '5px',
			boxSizing: 'border-box',
			fontSize: '14px',
			backgroundColor: '#1a1a1a',
			color: '#ffffff'
		});

		var buttonContainer = $('<div>')
		.css({
			display: 'flex',
			justifyContent: 'space-between',
			gap: '10px'
		});

		var testButton = $('<button>')
		.text('Test Connection')
		.css({
			padding: '10px 20px',
			backgroundColor: '#17a2b8',
			color: 'white',
			border: 'none',
			borderRadius: '5px',
			cursor: 'pointer',
			fontSize: '14px',
			transition: 'background-color 0.3s ease'
		})
		.hover(
			function() {
				if (!$(this).prop('disabled')) {
					$(this).css('backgroundColor', '#138496');
				}
			},
			function() {
				if (!$(this).prop('disabled')) {
					$(this).css('backgroundColor', '#17a2b8');
				}
			}
		)
		.click(async function() {
			var url = $('#deluge-url-input').val().trim();
			var password = $('#deluge-password-input').val().trim();

			if (!url || !password) {
				showToast('Please enter both URL and password!', 'error');
				return;
			}

			// Disable button and change text
			testButton.prop('disabled', true).text('Testing...').css({
				cursor: 'not-allowed',
				opacity: '0.7'
			});

			try {
				// Test the connection
				const result = await testDelugeConnection(url, password);

				if (result.success) {
					// Flash green
					testButton.css('backgroundColor', '#28a745').text('Success!');

					// Fade back to normal after 1.5 seconds
					setTimeout(() => {
						testButton.css('backgroundColor', '#17a2b8').text('Test Connection')
							.prop('disabled', false).css({
							cursor: 'pointer',
							opacity: '1'
						});
					}, 1500);
				} else {
					// Flash red
					testButton.css('backgroundColor', '#dc3545').text('Failed!');

					// Show error toast
					showToast(result.error, 'error');

					// Fade back to normal after 1.5 seconds
					setTimeout(() => {
						testButton.css('backgroundColor', '#17a2b8').text('Test Connection')
							.prop('disabled', false).css({
							cursor: 'pointer',
							opacity: '1'
						});
					}, 1500);
				}
			} catch (error) {
				// Flash red on exception
				testButton.css('backgroundColor', '#dc3545').text('Failed!');
				showToast('Unexpected error: ' + error.message, 'error');

				setTimeout(() => {
					testButton.css('backgroundColor', '#17a2b8').text('Test Connection')
						.prop('disabled', false).css({
						cursor: 'pointer',
						opacity: '1'
					});
				}, 1500);
			}
		});

		var rightButtonContainer = $('<div>')
		.css({
			display: 'flex',
			gap: '10px'
		});

		var cancelButton = $('<button>')
		.text('Cancel')
		.css({
			padding: '10px 20px',
			backgroundColor: '#6c757d',
			color: 'white',
			border: 'none',
			borderRadius: '5px',
			cursor: 'pointer',
			fontSize: '14px'
		})
		.hover(
			function() { $(this).css('backgroundColor', '#545b62'); },
			function() { $(this).css('backgroundColor', '#6c757d'); }
		)
		.click(function() {
			overlay.remove();
		});

		var saveButton = $('<button>')
		.text('Save')
		.css({
			padding: '10px 20px',
			backgroundColor: '#007bff',
			color: 'white',
			border: 'none',
			borderRadius: '5px',
			cursor: 'pointer',
			fontSize: '14px'
		})
		.hover(
			function() { $(this).css('backgroundColor', '#0056b3'); },
			function() { $(this).css('backgroundColor', '#007bff'); }
		)
		.click(function() {
			var url = $('#deluge-url-input').val().trim();
			var password = $('#deluge-password-input').val().trim();

			if (!url || !password) {
				alert('Both fields are required!');
				return;
			}

			// Save to Tampermonkey storage
			GM_setValue('deluge_url', url);
			GM_setValue('deluge_password', password);

			// Update variables
			DELUGE_URL = url;
			DELUGE_PASSWORD = password;

			// Close modal
			overlay.remove();
			showNotification('Settings saved successfully!');
		});

		rightButtonContainer.append(cancelButton, saveButton);
		buttonContainer.append(testButton, rightButtonContainer);
		modal.append(title, urlLabel, urlInput, passwordLabel, passwordInput, buttonContainer);
		overlay.append(modal);
		$('body').append(overlay);

		// Focus on first input
		urlInput.focus();

		// Close modal on Escape key
		$(document).on('keydown.delugeModal', function(e) {
			if (e.key === 'Escape' || e.keyCode === 27) {
				overlay.remove();
				$(document).off('keydown.delugeModal');
			}
		});

		// Clean up event listener when modal is removed
		overlay.on('remove', function() {
			$(document).off('keydown.delugeModal');
		});
	}

	function showToast(message, type = 'info') {
		// Remove any existing toasts
		$('.toast-notification').remove();

		var bgColor = type === 'error' ? 'rgba(220, 53, 69, 0.95)' : 'rgba(40, 167, 69, 0.95)';

		var toast = $('<div>')
		.addClass('toast-notification')
		.text(message)
		.css({
			position: 'fixed',
			bottom: '80px',
			left: '50%',
			transform: 'translateX(-50%)',
			background: bgColor,
			color: 'white',
			padding: '12px 20px',
			borderRadius: '5px',
			zIndex: 10001,
			boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
			maxWidth: '350px',
			fontSize: '13px',
			opacity: '0',
			transition: 'opacity 0.3s ease',
			textAlign: 'center'
		});

		$('body').append(toast);

		// Fade in
		setTimeout(() => {
			toast.css('opacity', '1');
		}, 10);

		// Fade out and remove after 4 seconds
		setTimeout(() => {
			toast.css('opacity', '0');
			setTimeout(() => {
				toast.remove();
			}, 300);
		}, 4000);
	}

	async function testDelugeConnection(url, password) {
		return new Promise((resolve) => {
			GM_xmlhttpRequest({
				method: 'POST',
				url: `${url}/json`,
				headers: {
					'Content-Type': 'application/json',
				},
				data: JSON.stringify({
					method: 'auth.login',
					params: [password],
					id: Math.floor(Math.random() * 1000000)
				}),
				timeout: 5000,
				onload: function(response) {
					try {
						const data = JSON.parse(response.responseText);
						if (data.result === true) {
							resolve({ success: true });
						} else {
							resolve({ success: false, error: 'Authentication failed - incorrect password' });
						}
					} catch (error) {
						resolve({ success: false, error: 'Invalid response from server' });
					}
				},
				onerror: function(error) {
					resolve({ success: false, error: 'Connection refused - check URL and ensure Deluge WebUI is running' });
				},
				ontimeout: function() {
					resolve({ success: false, error: 'Connection timeout - server not responding' });
				}
			});
		});
	}

	function insertCheckbox() {
		var headRow = $(".table thead tr");
		headRow.prepend(
			$("<th>").append(
				$('<input type="checkbox" id="checkall" />')
				.attr("checked", false)
				.css("display", "block")
				.css("margin", "0 auto")
				.change(function() {
					$("tbody input").prop("checked", this.checked);
				})
			)
		);

		var bodyRows = $(".table tbody tr");
		bodyRows.each(function() {
			var checkbox = $('<input type="checkbox" />')
			.attr("checked", false)
			.css("display", "block")
			.css("margin", "0 auto");

			$(this).prepend($("<td>").append(checkbox));
		});

		// Initialize drag selection
		initializeDragSelection();
	}

	function initializeDragSelection() {
		var bodyRows = $(".table tbody tr");
		var startRow = null;
		var currentRow = null;
		var selectionOverlay = null;

		// Prevent text selection during drag
		$(".table tbody").css({
			'user-select': 'none',
			'-webkit-user-select': 'none',
			'-moz-user-select': 'none',
			'-ms-user-select': 'none'
		});

		// Create selection overlay (initially hidden)
		selectionOverlay = $('<div>')
			.attr('id', 'drag-selection-overlay')
			.css({
			position: 'fixed',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			backgroundColor: 'rgba(100, 149, 237, 0.1)',
			border: '2px dashed rgba(100, 149, 237, 0.5)',
			pointerEvents: 'none',
			zIndex: 9998,
			display: 'none'
		})
			.appendTo('body');

		// Mouse down on checkbox or row - start drag selection
		bodyRows.on('mousedown', function(e) {
			startRow = $(this);
			isDragging = true;
			dragStarted = false;

			// Determine drag mode based on current state of the starting row
			var startCheckbox = startRow.find('input[type="checkbox"]');

			// If clicking directly on checkbox, use the NEW state (after the click)
			// Otherwise, toggle to opposite of current state
			if ($(e.target).is('input[type="checkbox"]')) {
				// The checkbox will toggle naturally, so we check its NEW state
				setTimeout(() => {
					dragMode = startCheckbox.prop('checked') ? 'check' : 'uncheck';
				}, 0);
			} else {
				dragMode = !startCheckbox.prop('checked') ? 'check' : 'uncheck';
				startCheckbox.prop('checked', dragMode === 'check');
			}

			e.preventDefault();
		});

		// Mouse move - track current row and show overlay
		bodyRows.on('mouseenter', function() {
			if (isDragging) {
				currentRow = $(this);

				// Show overlay if not already visible
				if (!dragStarted) {
					selectionOverlay.show();
					dragStarted = true;
				}

				// Visual feedback: highlight rows between start and current
				updateSelectionPreview();
			}
		});

		// Helper function to update visual preview during drag
		function updateSelectionPreview() {
			if (!startRow || !currentRow) return;

			var allRows = bodyRows.toArray();
			var startIndex = allRows.indexOf(startRow[0]);
			var currentIndex = allRows.indexOf(currentRow[0]);

			var minIndex = Math.min(startIndex, currentIndex);
			var maxIndex = Math.max(startIndex, currentIndex);

			// Remove previous preview highlighting
			bodyRows.css('backgroundColor', '');

			// Add subtle highlight to rows in selection range
			for (var i = minIndex; i <= maxIndex; i++) {
				$(allRows[i]).css('backgroundColor', 'rgba(100, 149, 237, 0.15)');
			}
		}

		// Mouse up anywhere - complete the selection
		$(document).on('mouseup', function() {
			if (isDragging && startRow) {
				// Hide overlay
				selectionOverlay.hide();

				// If we have a valid drag (moved to a different row or stayed on same row)
				if (dragStarted || !currentRow) {
					currentRow = currentRow || startRow;
					selectRowRange(startRow, currentRow, dragMode);
				}

				// Clear highlighting
				bodyRows.css('backgroundColor', '');

				// Reset state
				isDragging = false;
				dragMode = null;
				dragStarted = false;
				startRow = null;
				currentRow = null;
			}
		});

		// Also handle mouse leave from table
		$(".table").on('mouseleave', function() {
			if (isDragging) {
				selectionOverlay.hide();
				bodyRows.css('backgroundColor', '');
				isDragging = false;
				dragMode = null;
				dragStarted = false;
				startRow = null;
				currentRow = null;
			}
		});

		// Function to select all rows between start and end
		function selectRowRange(start, end, mode) {
			var allRows = bodyRows.toArray();
			var startIndex = allRows.indexOf(start[0]);
			var endIndex = allRows.indexOf(end[0]);

			// Ensure we go from lower to higher index
			var minIndex = Math.min(startIndex, endIndex);
			var maxIndex = Math.max(startIndex, endIndex);

			// Select all checkboxes in the range
			for (var i = minIndex; i <= maxIndex; i++) {
				var checkbox = $(allRows[i]).find('input[type="checkbox"]');
				checkbox.prop('checked', mode === 'check');
			}
		}
	}

	function getCheckedList() {
		var checkboxList = $("tbody input");
		return $.map(checkboxList, x => x.checked);
	}

	function getMagnetLinks() {
		var bodyRows = $("tbody a");
		var links = $.map(bodyRows, x => x.href);
		return links.filter(link => link.includes("magnet:"));
	}

	function insertCopyButton() {
		var navBar = $("ul.nav");
		var button = document.createElement("li");
		var a = document.createElement("a");
		$(a)
			.attr("href", "")
			.text("Copy Link")
			.attr("id", "copyMagnet")
			.attr("title", "Copy selected links")
			.click(e => {
			e.preventDefault();
		});
		button.append(a);
		navBar[0].append(button);
	}

	function insertDelugeButton() {
		var navBar = $("ul.nav");
		var button = document.createElement("li");
		var a = document.createElement("a");
		$(a)
			.attr("href", "")
			.text("Send to Deluge")
			.attr("id", "sendToDeluge")
			.attr("title", "Send selected links to Deluge")
			.click(async function(e) {
			e.preventDefault();
			await sendToDeluge();
		});
		button.append(a);
		navBar[0].append(button);
	}

	function insertSettingsButton() {
		var navBar = $("ul.nav");
		var button = document.createElement("li");
		var a = document.createElement("a");
		$(a)
			.attr("href", "")
			.text("⚙️")
			.attr("id", "delugeSettings")
			.attr("title", "Configure Deluge WebUI settings")
			.click(function(e) {
			e.preventDefault();
			promptForSettings();
		});
		button.append(a);
		navBar[0].append(button);
	}

	function showNotification(message) {
		// Remove any existing notifications first
		$('.custom-notification').remove();

		var notification = $("<div>")
		.addClass('custom-notification')
		.text(message)
		.css({
			position: "fixed",
			top: "20px",
			left: "50%",
			transform: "translateX(-50%)",
			background: "rgba(0, 0, 0, 0.8)",
			color: "white",
			padding: "15px 25px",
			borderRadius: "5px",
			zIndex: 9999,
			boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
			maxWidth: "80%",
			textAlign: "center",
			opacity: "1",
			transition: "opacity 0.5s ease"
		});

		// Append to body
		$("body").append(notification);

		// Force a reflow to ensure the element is rendered
		notification[0].offsetHeight;

		// Set timeout to fade out and remove
		setTimeout(function() {
			// Fade out using CSS opacity
			notification.css('opacity', '0');

			// Remove after fade completes
			setTimeout(function() {
				notification.remove();
			}, 500);
		}, 3000);
	}

	async function delugeRequest(method, params = []) {
		return new Promise((resolve, reject) => {
			GM_xmlhttpRequest({
				method: 'POST',
				url: `${DELUGE_URL}/json`,
				headers: {
					'Content-Type': 'application/json',
				},
				data: JSON.stringify({
					method: method,
					params: params,
					id: Math.floor(Math.random() * 1000000)
				}),
				onload: function(response) {
					try {
						const data = JSON.parse(response.responseText);
						resolve(data);
					} catch (error) {
						reject(new Error('Failed to parse response'));
					}
				},
				onerror: function(error) {
					reject(new Error('Network request failed'));
				}
			});
		});
	}

	async function authenticateDeluge() {
		try {
			const result = await delugeRequest('auth.login', [DELUGE_PASSWORD]);
			if (result.result === true) {
				delugeConnected = true;
				return true;
			} else {
				showNotification("Deluge authentication failed!");
				return false;
			}
		} catch (error) {
			showNotification("Error connecting to Deluge: " + error.message);
			return false;
		}
	}

	async function sendToDeluge() {
		// Check if settings are configured
		if (!DELUGE_URL || !DELUGE_PASSWORD) {
			showNotification("Please configure Deluge settings first!");
			promptForSettings();
			return;
		}

		var links = getMagnetLinks();
		var checkedList = getCheckedList();

		links = links.filter(function(val, i) {
			return checkedList[i];
		});

		if (links.length === 0) {
			showNotification("No links selected!");
			return;
		}

		showNotification("Connecting to Deluge...");

		// Authenticate if not already connected
		if (!delugeConnected) {
			const authenticated = await authenticateDeluge();
			if (!authenticated) {
				return;
			}
		}

		// Send each magnet link to Deluge
		let successCount = 0;
		let failCount = 0;

		for (const magnet of links) {
			try {
				const result = await delugeRequest('core.add_torrent_magnet', [magnet, {}]);
				if (result.result) {
					successCount++;
				} else {
					failCount++;
				}
			} catch (error) {
				failCount++;
			}
		}

		if (failCount === 0) {
			showNotification(`Successfully sent ${successCount} torrent(s) to Deluge!`);
		} else {
			showNotification(`Sent ${successCount} torrent(s), ${failCount} failed.`);
		}
	}

	// Initialize buttons
	insertCopyButton();
	insertDelugeButton();
	insertSettingsButton();
	insertCheckbox();

	// Prompt for settings if not configured
	if (!DELUGE_URL || !DELUGE_PASSWORD) {
		setTimeout(() => {
			promptForSettings();
		}, 1000);
	}

	// eslint-disable-next-line no-undef
	new ClipboardJS("#copyMagnet", {
		text: function() {
			var links = getMagnetLinks();
			var checkedList = getCheckedList();

			links = links.filter(function(val, i) {
				return checkedList[i];
			});
			showNotification("Copied " + links.length + " magnet links to clipboard.");
			return links.join("\n");
		}
	});
})();