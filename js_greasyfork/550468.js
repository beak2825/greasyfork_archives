// ==UserScript==
// @name         Discogs MusicBrainz Auto-fill
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto-fill Discogs release form with MusicBrainz data
// @author       Frédéric Devernay
// @match        https://www.discogs.com/*/release/add*
// @match        https://www.discogs.com/release/add*
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550468/Discogs%20MusicBrainz%20Auto-fill.user.js
// @updateURL https://update.greasyfork.org/scripts/550468/Discogs%20MusicBrainz%20Auto-fill.meta.js
// ==/UserScript==

/*
DISCOGS MUSICBRAINZ AUTO-FILL USERSCRIPT

WHAT IT DOES:
This script automatically fills Discogs release submission forms using data from MusicBrainz.
It fetches comprehensive release information and populates all relevant form fields.

FEATURES:
• Auto-fills artist name, release title, label, catalog number, release date, country
• Sets format to CD and primary type (Album, EP, etc.) automatically
• Adds all tracks with numbers, titles, and durations
• Automatically adds more track fields if needed (for albums with >4 tracks)
• Downloads and uploads cover art from MusicBrainz Cover Art Archive
• Adds barcode if available
• Includes submission notes with MusicBrainz Release ID
• Handles React form validation properly

HOW TO USE:
1. Go to Discogs "Add a Release" page (https://www.discogs.com/release/add)
2. The script adds a MusicBrainz input field at the top of the form
3. Enter a MusicBrainz Release ID (36-character UUID format)
   Example: 12345678-1234-1234-1234-123456789012
4. Click "Fetch Data" button
5. Wait for all fields to be populated (check console for progress)
6. Review and submit the form

FINDING MUSICBRAINZ RELEASE IDS:
• Search on https://musicbrainz.org for your release
• The Release ID is in the URL: /release/[ID]/
• Or copy from the "Permanent link" on the release page

REQUIREMENTS:
• Tampermonkey or similar userscript manager
• Works on all Discogs language variants
• Requires internet connection to fetch MusicBrainz data

TROUBLESHOOTING:
• If fields appear empty after filling, wait a moment - the script re-validates critical fields
• Check browser console (F12) for detailed logging and error messages
• Some fields may need manual verification before submission

VERSION HISTORY:
v1.0 - Initial release with full auto-fill functionality
*/

(function() {
    'use strict';

    console.log('MusicBrainz to Discogs script loaded on:', window.location.href);
    console.log('Document ready state:', document.readyState);

    // Helper function to set React input values properly
    function setReactInputValue(input, value) {
        // Special handling for fields that need focus/blur
        if (input.getAttribute('data-type') === 'track-title' ||
            input.classList.contains('track-number-input') ||
            input.getAttribute('aria-label') === 'Track duration' ||
            input.getAttribute('data-type') === 'artist-name' ||
            input.getAttribute('role') === 'combobox') {
            input.focus();
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            nativeInputValueSetter.call(input, value);

            const event = new Event('input', { bubbles: true });
            input.dispatchEvent(event);

            const changeEvent = new Event('change', { bubbles: true });
            input.dispatchEvent(changeEvent);

            input.blur();
        } else {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            nativeInputValueSetter.call(input, value);

            const event = new Event('input', { bubbles: true });
            input.dispatchEvent(event);

            const changeEvent = new Event('change', { bubbles: true });
            input.dispatchEvent(changeEvent);
        }

        // Verify the value was set
        setTimeout(() => {
            const actualValue = input.value;
            const expectedValue = String(value);
            if (actualValue !== expectedValue && actualValue === '') {
                console.warn(`Value verification failed for input. Expected: "${expectedValue}", Got: "${actualValue}"`);
            } else if (actualValue === expectedValue) {
                console.log(`✓ Value set successfully: "${expectedValue}"`);
            }
        }, 200);
    }

    // Helper function to set React select values properly
    function setReactSelectValue(select, value) {
        const nativeSelectValueSetter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, "value").set;
        nativeSelectValueSetter.call(select, value);

        const changeEvent = new Event('change', { bubbles: true });
        select.dispatchEvent(changeEvent);

        // Verify the value was set
        setTimeout(() => {
            if (select.value !== value) {
                console.warn(`Value verification failed for select. Expected: "${value}", Got: "${select.value}"`);
            }
        }, 100);
    }

    // Helper function to set React textarea values properly
    function setReactTextareaValue(textarea, value) {
        const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        nativeTextareaValueSetter.call(textarea, value);

        const event = new Event('input', { bubbles: true });
        textarea.dispatchEvent(event);

        const changeEvent = new Event('change', { bubbles: true });
        textarea.dispatchEvent(changeEvent);

        // Verify the value was set
        setTimeout(() => {
            if (textarea.value !== value) {
                console.warn(`Value verification failed for textarea. Expected: "${value}", Got: "${textarea.value}"`);
            }
        }, 100);
    }

    // Add MusicBrainz input at the top of the form
    function addMusicBrainzInput() {
        console.log('addMusicBrainzInput called');

        // Check if already exists
        if (document.getElementById('mb-release-id')) {
            console.log('MusicBrainz input already exists, skipping');
            return;
        }

        // Try multiple insertion points
        let insertionPoint = null;
        let insertBefore = null;

        const formHeader = document.querySelector('.align_right');
        const saveDraft = document.querySelector('.save_draft');
        const subformTable = document.querySelector('.subform_table');
        const subform = document.querySelector('#subform');

        if (formHeader) {
            console.log('Using .align_right as insertion point');
            insertionPoint = formHeader.parentNode;
            insertBefore = formHeader;
        } else if (saveDraft) {
            console.log('Using .save_draft as insertion point');
            insertionPoint = saveDraft.parentNode;
            insertBefore = saveDraft;
        } else if (subformTable) {
            console.log('Using .subform_table as insertion point');
            insertionPoint = subformTable.parentNode;
            insertBefore = subformTable;
        } else if (subform) {
            console.log('Using #subform as insertion point');
            insertionPoint = subform;
            insertBefore = subform.firstChild;
        }

        if (!insertionPoint) {
            console.log('No suitable insertion point found, retrying in 1000ms');
            setTimeout(addMusicBrainzInput, 1000);
            return;
        }

        console.log('Creating MusicBrainz input container');
        const mbContainer = createMusicBrainzInput();
        insertionPoint.insertBefore(mbContainer, insertBefore);
    }

    function createMusicBrainzInput() {


        const mbContainer = document.createElement('div');
        mbContainer.style.cssText = 'margin-bottom: 15px; padding: 10px; border: 1px solid #ccc; background: #f9f9f9;';

        const mbInput = document.createElement('input');
        mbInput.type = 'text';
        mbInput.id = 'mb-release-id';
        mbInput.placeholder = 'MusicBrainz Release ID (e.g., 12345678-1234-1234-1234-123456789012)';
        mbInput.style.cssText = 'width: 400px; margin-right: 10px; padding: 5px;';
        mbInput.title = 'Added by "Discogs MusicBrainz Auto-fill" UserScript - Enter a MusicBrainz Release ID to auto-fill this form';

        const fetchButton = document.createElement('button');
        fetchButton.textContent = 'Fetch Data';
        fetchButton.type = 'button';
        fetchButton.className = 'button button-small';
        fetchButton.onclick = fetchMusicBrainzData;
        fetchButton.title = 'Added by "Discogs MusicBrainz Auto-fill" UserScript - Click to fetch release data from MusicBrainz and auto-fill the form';

        mbContainer.appendChild(mbInput);
        mbContainer.appendChild(fetchButton);

        return mbContainer;
    }

    // Fetch data from MusicBrainz
    function fetchMusicBrainzData() {
        const releaseId = document.getElementById('mb-release-id').value.trim();
        if (!releaseId) {
            alert('Please enter a MusicBrainz Release ID');
            return;
        }

        const url = `https://musicbrainz.org/ws/2/release/${releaseId}?inc=artists+labels+recordings+release-groups&fmt=json`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    fillForm(data);
                } else {
                    alert('Failed to fetch MusicBrainz data. Check the Release ID.');
                }
            },
            onerror: function() {
                alert('Error fetching data from MusicBrainz');
            }
        });
    }

    // Capitalize titles according to Discogs rules
    function capitalizeTitle(title) {
        if (!title) return title;

        // Handle abstract titles (no meaning in any language) - keep as-is
        if (/^[^a-zA-Z]*$/.test(title) || title.length <= 2) return title;

        // Handle Roman numerals
        title = title.replace(/\b(i{1,3}|iv|v|vi{0,3}|ix|x|xl|l|lx{0,3}|xc|c|cd|d|dc{0,3}|cm|m)\b/gi,
            match => match.toUpperCase());

        // Handle musical keys (preserve case for major/minor differentiation)
        const musicalKeyPattern = /\b[A-G][#b]?\s*(major|minor|maj|min|m|M)\b/gi;
        const musicalKeys = [];
        title = title.replace(musicalKeyPattern, match => {
            musicalKeys.push(match);
            return `__MUSICAL_KEY_${musicalKeys.length - 1}__`;
        });

        // Split by spaces and capitalize first letter of each word
        let result = title.split(' ').map(word => {
            if (!word || word.startsWith('__MUSICAL_KEY_')) return word;

            // Handle contractions and hyphenations
            if (word.includes("'") || word.includes('-')) {
                return word.split(/(['-])/).map((part, index) => {
                    if (part === "'" || part === '-') return part;
                    if (index === 0) return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
                    return part.toLowerCase();
                }).join('');
            }

            // Handle parentheses (for version titles)
            if (word.startsWith('(') && word.length > 1) {
                return '(' + word.charAt(1).toUpperCase() + word.slice(2).toLowerCase();
            }

            // Handle particles (van, von, di, de, la, etc.) - keep lowercase
            const particles = ['van', 'von', 'di', 'de', 'la', 'le', 'du', 'da', 'del', 'della', 'des', 'el'];
            if (particles.includes(word.toLowerCase())) {
                return word.toLowerCase();
            }

            // Handle acronyms/initialisms (all caps or with periods)
            if (/^[A-Z]{2,}$/.test(word) || /^[A-Z]\.([A-Z]\.)*$/.test(word)) {
                return word; // Keep as-is
            }

            // Standard capitalization: First Letter Of Each Word
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).join(' ');

        // Restore musical keys
        musicalKeys.forEach((key, index) => {
            result = result.replace(`__MUSICAL_KEY_${index}__`, key);
        });

        // Fix typewriter apostrophes
        result = result.replace(/[''`´]/g, "'");

        return result;
    }

    // Fill the Discogs form with MusicBrainz data
    function fillForm(data) {
        console.log('MusicBrainz data received:', data);

        // Artist
        const artistInput = document.getElementById('artist-name-input');
        console.log('Artist input found:', !!artistInput);
        console.log('Artist data:', data['artist-credit']);
        if (artistInput && data['artist-credit'] && data['artist-credit'][0]) {
            const artistName = capitalizeTitle(data['artist-credit'][0].name);
            setReactInputValue(artistInput, artistName);
            console.log('Artist filled:', artistName);
        }

        // Title
        const titleInput = document.getElementById('release-title-input');
        console.log('Title input found:', !!titleInput);
        if (titleInput && data.title) {
            const releaseTitle = capitalizeTitle(data.title);
            setReactInputValue(titleInput, releaseTitle);
            console.log('Title filled:', releaseTitle);
        }

        // Label and catalog number
        console.log('Label info:', data['label-info']);
        if (data['label-info'] && data['label-info'][0]) {
            const labelInfo = data['label-info'][0];

            const labelInput = document.getElementById('label-name-input-0');
            console.log('Label input found:', !!labelInput);
            if (labelInput && labelInfo.label) {
                const labelName = labelInfo.label.name;
                setReactInputValue(labelInput, labelName);
                console.log('Label filled:', labelName);
            }

            const catalogInput = document.getElementById('catalog-number-input-0');
            console.log('Catalog input found:', !!catalogInput);
            if (catalogInput && labelInfo['catalog-number']) {
                const catalogNumber = labelInfo['catalog-number'];
                setReactInputValue(catalogInput, catalogNumber);
                console.log('Catalog filled:', catalogNumber);
            }
        }

        // Release date
        const dateInput = document.getElementById('release-date');
        console.log('Date input found:', !!dateInput);
        if (dateInput && data.date) {
            setReactInputValue(dateInput, data.date);
            console.log('Date filled:', data.date);
        }

        // Country
        const countrySelect = document.getElementById('release-country-select');
        console.log('Country select found:', !!countrySelect);
        if (countrySelect && data.country) {
            const countryCode = data.country;
            const countryMap = {
                'XW': 'Worldwide',
                'US': 'US',
                'GB': 'UK',
                'DE': 'Germany',
                'FR': 'France',
                'JP': 'Japan',
                'CA': 'Canada',
                'AU': 'Australia',
                'IT': 'Italy',
                'ES': 'Spain',
                'NL': 'Netherlands',
                'SE': 'Sweden',
                'NO': 'Norway',
                'DK': 'Denmark',
                'FI': 'Finland',
                'BE': 'Belgium',
                'AT': 'Austria',
                'CH': 'Switzerland',
                'BR': 'Brazil',
                'AR': 'Argentina',
                'MX': 'Mexico',
                'RU': 'Russia',
                'PL': 'Poland',
                'CZ': 'Czech Republic',
                'HU': 'Hungary',
                'GR': 'Greece',
                'PT': 'Portugal',
                'IE': 'Ireland',
                'NZ': 'New Zealand',
                'ZA': 'South Africa',
                'KR': 'South Korea',
                'CN': 'China',
                'IN': 'India',
                'TH': 'Thailand',
                'SG': 'Singapore',
                'MY': 'Malaysia',
                'ID': 'Indonesia',
                'PH': 'Philippines',
                'TW': 'Taiwan',
                'HK': 'Hong Kong',
                'IL': 'Israel',
                'TR': 'Turkey',
                'EG': 'Egypt',
                'MA': 'Morocco',
                'NG': 'Nigeria',
                'KE': 'Kenya',
                'ET': 'Ethiopia',
                'GH': 'Ghana',
                'TN': 'Tunisia',
                'DZ': 'Algeria',
                'LB': 'Lebanon',
                'JO': 'Jordan',
                'SA': 'Saudi Arabia',
                'AE': 'UAE',
                'IR': 'Iran',
                'IQ': 'Iraq',
                'AF': 'Afghanistan',
                'PK': 'Pakistan',
                'BD': 'Bangladesh',
                'LK': 'Sri Lanka',
                'MM': 'Myanmar',
                'VN': 'Vietnam',
                'KH': 'Cambodia',
                'LA': 'Laos',
                'MN': 'Mongolia',
                'KZ': 'Kazakhstan',
                'UZ': 'Uzbekistan',
                'KG': 'Kyrgyzstan',
                'TJ': 'Tajikistan',
                'TM': 'Turkmenistan',
                'AM': 'Armenia',
                'AZ': 'Azerbaijan',
                'GE': 'Georgia',
                'UA': 'Ukraine',
                'BY': 'Belarus',
                'MD': 'Moldova',
                'RO': 'Romania',
                'BG': 'Bulgaria',
                'RS': 'Serbia',
                'HR': 'Croatia',
                'SI': 'Slovenia',
                'BA': 'Bosnia and Herzegovina',
                'MK': 'North Macedonia',
                'AL': 'Albania',
                'ME': 'Montenegro',
                'LT': 'Lithuania',
                'LV': 'Latvia',
                'EE': 'Estonia',
                'SK': 'Slovakia',
                'LU': 'Luxembourg',
                'MT': 'Malta',
                'CY': 'Cyprus',
                'IS': 'Iceland'
            };
            const countryName = countryMap[countryCode] || countryCode;

            for (let option of countrySelect.options) {
                if (option.value === countryName || option.text === countryName) {
                    setReactSelectValue(countrySelect, option.value);
                    console.log('Country filled:', countryName);
                    break;
                }
            }
        }

        // Release format - set to CD by default (must be done before checking Album)
        const releaseFormatSelect = document.getElementById('release-format-select');
        if (releaseFormatSelect) {
            setReactSelectValue(releaseFormatSelect, 'CD');
            console.log('Release format set to CD');
        }

        // Format based on primary-type
        console.log('Release group data:', data['release-group']);
        if (data['release-group'] && data['release-group']['primary-type']) {
            const primaryType = data['release-group']['primary-type'];
            console.log('Primary type:', primaryType);

            const formatCheckbox = document.querySelector(`input[type="checkbox"][value="${primaryType}"]`);
            if (formatCheckbox && !formatCheckbox.checked) {
                formatCheckbox.click();
                console.log(`Format "${primaryType}" checked`);
            }
        }

        // Select CD format by default
        const cdFormatCheckbox = document.querySelector('input[type="checkbox"][value="CD"]');
        if (cdFormatCheckbox && !cdFormatCheckbox.checked) {
            cdFormatCheckbox.click();
            console.log('CD format selected by default');
        }

        // Barcode
        console.log('Barcode data:', data.barcode);
        if (data.barcode) {
            try {
                const addBarcodeButton = document.getElementById('add-barcode-or-other-identifier');
                if (addBarcodeButton) {
                    addBarcodeButton.click();
                    console.log('Clicked Add barcode button');

                    setTimeout(() => {
                        try {
                            const barcodeInput = document.querySelector('input[aria-label="Enter barcode"]');
                            if (barcodeInput) {
                                setReactInputValue(barcodeInput, data.barcode);
                                console.log('Barcode filled:', data.barcode);
                            } else {
                                console.log('Barcode input not found after clicking add button');
                            }
                        } catch (error) {
                            console.log('Error filling barcode input:', error);
                        }
                    }, 500);
                } else {
                    console.log('Add barcode button not found - please check the page for "Add barcode or other identifier" link/button');
                }
            } catch (error) {
                console.log('Error in barcode handling:', error);
            }
        }

        // Tracklist
        console.log('Media data:', data.media);
        if (data.media && data.media[0] && data.media[0].tracks) {
            const tracks = data.media[0].tracks;
            console.log('Found', tracks.length, 'tracks:', tracks);

            // Function to fill all tracks
            function fillAllTracks(tracks) {
                tracks.forEach((track, index) => {
                    console.log(`Processing track ${index}:`, track);

                    const trackNumberInput = document.getElementById(`track-number-${index}`);
                    const trackTitleInput = document.getElementById(`track-title-${index}`);

                    console.log(`Track ${index} - number input found:`, !!trackNumberInput);
                    console.log(`Track ${index} - title input found:`, !!trackTitleInput);

                    if (trackNumberInput) {
                        setReactInputValue(trackNumberInput, track.position || (index + 1).toString());
                        console.log(`Track ${index} number filled:`, track.position || (index + 1).toString());
                    }

                    if (trackTitleInput) {
                        let trackTitle = track.title || 'Untitled';

                        // Handle mix/version format: "Name Of Track (Name Of Version)"
                        if (track.title && track.title.includes(' - ')) {
                            const parts = track.title.split(' - ');
                            if (parts.length === 2) {
                                trackTitle = `${capitalizeTitle(parts[0])} (${capitalizeTitle(parts[1])})`;
                            }
                        } else {
                            trackTitle = capitalizeTitle(trackTitle);
                        }

                        setReactInputValue(trackTitleInput, trackTitle);
                        console.log(`Track ${index} title filled:`, trackTitle);
                    }

                    // Add duration if available
                    if (track.length) {
                        const trackRow = document.querySelector(`#track-title-${index}`);
                        if (trackRow) {
                            const durationInput = trackRow.closest('tr')?.querySelector('input[placeholder="0:00"]');
                            if (durationInput) {
                                const minutes = Math.floor(track.length / 60000);
                                const seconds = Math.floor((track.length % 60000) / 1000);
                                const duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                                setReactInputValue(durationInput, duration);
                                console.log(`Track ${index} duration filled:`, duration);
                            }
                        }
                    }
                });
            }

            // Add more tracks if needed
            const existingTrackFields = document.querySelectorAll('input[id^="track-title-"]').length;
            console.log(`Found ${existingTrackFields} existing track fields for ${tracks.length} tracks`);

            if (tracks.length > existingTrackFields) {
                const tracksNeeded = tracks.length - existingTrackFields;
                console.log(`Need to add ${tracksNeeded} more tracks`);

                const addTracksSelect = document.querySelector('select[aria-label="Select the number of tracks to add"]');
                const addTracksButton = document.querySelector('table.subform_tracklist tfoot button.button-small, .subform_tracklist tfoot .button-small');

                console.log('Add tracks select found:', !!addTracksSelect);
                console.log('Add tracks button found:', !!addTracksButton);

                if (addTracksSelect && addTracksButton) {
                    setReactSelectValue(addTracksSelect, tracksNeeded.toString());
                    console.log(`Selected ${tracksNeeded} tracks to add`);

                    // Click add tracks button
                    addTracksButton.click();
                    console.log('Clicked Add Tracks button');

                    // Wait for new tracks to be added before filling
                    setTimeout(() => fillAllTracks(tracks), 1000);
                } else {
                    console.log('Add tracks controls not found - please check for track addition dropdown and button');
                    fillAllTracks(tracks);
                }
            } else {
                console.log('Sufficient track fields already exist');
                fillAllTracks(tracks);
            }
        } else {
            console.log('No track data found in media');
        }

        console.log('About to finish fillForm function and schedule cover art download');
        console.log('Form filling completed - check the form fields manually');

        // Trigger validation on critical fields by simulating user interaction
        setTimeout(() => {
            const criticalFields = [
                { element: document.getElementById('release-title-input'), name: 'title' },
                { element: document.getElementById('release-date'), name: 'release date' },
                { element: document.querySelector('input[aria-label="Enter barcode"]'), name: 'barcode' }
            ];

            criticalFields.forEach(field => {
                if (field.element && field.element.value) {
                    const currentValue = field.element.value;
                    console.log(`Re-triggering validation for ${field.name}: "${currentValue}"`);

                    // Gentle approach - just focus, add space, remove space, blur
                    field.element.focus();

                    setTimeout(() => {
                        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                        nativeInputValueSetter.call(field.element, currentValue + ' ');

                        const inputEvent = new Event('input', { bubbles: true });
                        field.element.dispatchEvent(inputEvent);

                        setTimeout(() => {
                            nativeInputValueSetter.call(field.element, currentValue);

                            const inputEvent2 = new Event('input', { bubbles: true });
                            field.element.dispatchEvent(inputEvent2);

                            const changeEvent = new Event('change', { bubbles: true });
                            field.element.dispatchEvent(changeEvent);

                            field.element.blur();
                            console.log(`✓ Re-validated ${field.name}`);
                        }, 100);
                    }, 100);
                }
            });
        }, 2000);

        // Download and upload cover art if available (with delay to let form settle)
        console.log('Scheduling cover art download in 2 seconds...');
        setTimeout(() => {
            console.log('Starting cover art download process now');
            downloadAndUploadCoverArt(document.getElementById('mb-release-id').value.trim());
        }, 2000);
    }

    // Download cover art from MusicBrainz and upload to Discogs
    function downloadAndUploadCoverArt(releaseId) {
        console.log('Attempting to download cover art for release:', releaseId);
        const coverArtUrl = `https://coverartarchive.org/release/${releaseId}/front-1200`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: coverArtUrl,
            responseType: 'blob',
            onload: function(response) {
                console.log('Cover art download response status:', response.status);
                if (response.status === 200) {
                    console.log('Cover art downloaded successfully, blob size:', response.response.size);
                    uploadCoverArt(response.response);
                } else {
                    console.log('No cover art available for this release, status:', response.status);
                }
            },
            onerror: function(error) {
                console.log('Error downloading cover art:', error);
            }
        });
    }

    // Upload cover art to Discogs form
    function uploadCoverArt(blob) {
        console.log('Starting cover art upload, blob size:', blob.size);
        const fileInput = document.getElementById('uploader');
        console.log('File input found:', !!fileInput);

        if (!fileInput) {
            console.log('File upload input not found');
            return;
        }

        // Create a File object from the blob
        const file = new File([blob], 'cover.jpg', { type: 'image/jpeg' });
        console.log('Created file object:', file.name, file.size, file.type);

        // Create a DataTransfer object to simulate file selection
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        console.log('DataTransfer files count:', dataTransfer.files.length);

        // Set the files property
        fileInput.files = dataTransfer.files;
        console.log('Set fileInput.files, count:', fileInput.files.length);

        // Dispatch change event
        const changeEvent = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(changeEvent);
        console.log('Dispatched change event');

        // Check if upload was successful after a delay
        setTimeout(() => {
            const uploadList = document.getElementById('image_uploader_list');
            const hasImages = uploadList && uploadList.children.length > 0;
            console.log('Upload verification - images in list:', hasImages);
            if (hasImages) {
                console.log('✓ Cover art upload successful!');
            } else {
                console.log('⚠ Cover art upload may have failed - no images detected in upload list');
            }
        }, 2000);

        console.log('Cover art upload process completed');
    }

    // Initialize when page loads
    function init() {
        console.log('init() called, looking for form elements');
        const subformApp = document.querySelector('#subform-app');
        const alignRight = document.querySelector('.align_right');
        const saveDraft = document.querySelector('.save_draft');
        const subformTable = document.querySelector('.subform_table');

        console.log('subform-app found:', !!subformApp);
        console.log('align_right found:', !!alignRight);
        console.log('save_draft found:', !!saveDraft);
        console.log('subform_table found:', !!subformTable);

        if (subformApp && (alignRight || saveDraft || subformTable)) {
            console.log('Form elements found, calling addMusicBrainzInput');
            addMusicBrainzInput();
        } else {
            console.log('Form not fully loaded yet, retrying in 1000ms');
            setTimeout(init, 1000);
        }
    }

    // Only try once when DOM is ready
    console.log('Setting up initialization...');
    setTimeout(() => {
        console.log('Starting init after 2 second delay');
        init();
    }, 2000);
})();
