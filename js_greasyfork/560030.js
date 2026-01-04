// ==UserScript==
// @name         Download all cards on CardConjurer
// @namespace    mandreko_cardconjurer_bulkdownload
// @version      2025-12-23
// @description  Downloads all cards from a saved list as a single ZIP file instead of individual downloads.
// @author       Matt Andreko
// @match        https://cardconjurer.app/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cardconjurer.app
// @grant        none
// @license      MIT
// @require https://code.jquery.com/jquery-3.7.1.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/560030/Download%20all%20cards%20on%20CardConjurer.user.js
// @updateURL https://update.greasyfork.org/scripts/560030/Download%20all%20cards%20on%20CardConjurer.meta.js
// ==/UserScript==



  (()=>{
      function createProgressModal() {
          const modal = $(`
              <div id="download-progress-modal" style="
                  position: fixed;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  background: white;
                  border: 2px solid #333;
                  border-radius: 8px;
                  padding: 20px;
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
                  z-index: 10000;
                  min-width: 400px;
                  font-family: Arial, sans-serif;
              ">
                  <h3 style="margin: 0 0 15px 0; text-align: center;">Downloading Cards</h3>
                  <div id="progress-text" style="margin-bottom: 10px; text-align: center; font-size: 14px;">
                      Preparing...
                  </div>
                  <div style="width: 100%; background: #e0e0e0; border-radius: 4px; height: 30px; overflow: hidden;">
                      <div id="progress-bar" style="
                          width: 0%;
                          height: 100%;
                          background: linear-gradient(90deg, #4CAF50, #45a049);
                          transition: width 0.3s ease;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          color: white;
                          font-weight: bold;
                      ">
                          0%
                      </div>
                  </div>
                  <div id="current-card" style="margin-top: 10px; text-align: center; font-size: 12px; color: #666;">
                  </div>
              </div>
              <div id="download-progress-overlay" style="
                  position: fixed;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  background: rgba(0, 0, 0, 0.5);
                  z-index: 9999;
              "></div>
          `);
          $('body').append(modal);
          return modal;
      }

      function updateProgress(current, total, cardName) {
          const percentage = Math.round((current / total) * 100);
          $('#progress-bar').css('width', `${percentage}%`).text(`${percentage}%`);
          $('#progress-text').text(`Processing ${current} of ${total} cards`);
          $('#current-card').text(`Current: ${cardName}`);
      }

      function removeProgressModal() {
          $('#download-progress-modal').remove();
          $('#download-progress-overlay').remove();
      }

      async function downloadAllCards() {
          // Select all option elements inside the load-card dropdown
          const options = $('#load-card-options option');
          const totalCards = options.length - 1;

          console.log(`Found ${totalCards} cards to download`);

          // Create progress modal
          createProgressModal();

          // Create a new JSZip instance
          const zip = new JSZip();

          for (let i = 1; i < options.length; i++) {
              const element = options[i];
              const cardName = element.value;
              const cardNumber = i;

              console.log(`Processing card ${cardNumber}/${totalCards}: ${cardName}`);
              updateProgress(cardNumber, totalCards, cardName);

              // Load the card
              loadCard(cardName);

              // Wait for the card to load
              await new Promise(resolve => setTimeout(resolve, 2000));

              // Just to ensure the watermark is centered, since it's been problematic.
              resetWatermark();

              // Capture the card image instead of downloading
              const canvas = document.querySelector('canvas');
              if (canvas) {
                  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                  if (blob) {
                      // Sanitize filename and add to zip
                      const filename = `${cardName.replace(/[^a-z0-9]/gi, '_')}.png`;
                      zip.file(filename, blob);
                      console.log(`Added ${filename} to zip`);
                  }
              }

              // Wait before loading next card
              await new Promise(resolve => setTimeout(resolve, 500));
          }

          // Update progress to show zip generation
          $('#progress-text').text('Generating ZIP file...');
          $('#current-card').text('Please wait...');
          console.log('Generating zip file...');

          // Generate and download the zip file
          const zipBlob = await zip.generateAsync({ type: 'blob' });
          const downloadLink = document.createElement('a');
          downloadLink.href = URL.createObjectURL(zipBlob);
          downloadLink.download = 'cardconjurer-cards.zip';
          downloadLink.click();

          console.log('All cards downloaded!');

          // Show completion message briefly before removing modal
          $('#progress-text').text('Complete!');
          $('#current-card').text('Your download should begin shortly.');
          await new Promise(resolve => setTimeout(resolve, 2000));

          removeProgressModal();
      }

      // Create the button and attach event listener (instead of inline onclick)
      const downloadButton = $('<h3 class="download padding">Download all your card images</h3>');
      downloadButton.on('click', downloadAllCards);
      downloadButton.insertBefore("#downloadJpg");
  })();