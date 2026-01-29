// ==UserScript==
// @name         Chess.com Custom Pieces
// @namespace    https://greasyfork.org/en/users/1376827-dezywezzy
// @version      1.1
// @license         MIT
// @description  Random images/GIFs I found funny to use as chess pieces
// @author       Dezywezzy
// @match        https://*.chess.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/564384/Chesscom%20Custom%20Pieces.user.js
// @updateURL https://update.greasyfork.org/scripts/564384/Chesscom%20Custom%20Pieces.meta.js
// ==/UserScript==


(function () {
  'use strict';

  // Debugging log to confirm the script is running
  console.log("Custom chess pieces script is running!");

  // Create a container for the sidebar
  const sidebar = document.createElement('div');
  sidebar.id = 'pieceSidebar';
  sidebar.style.position = 'fixed';
  sidebar.style.top = '10px';
  sidebar.style.right = '10px';
  sidebar.style.zIndex = '1000';
  sidebar.style.background = 'white';
  sidebar.style.border = '2px solid black';
  sidebar.style.padding = '10px';
  sidebar.style.display = 'none';
  sidebar.style.flexDirection = 'column';
  sidebar.style.alignItems = 'center';
  sidebar.style.maxHeight = '90vh';
  sidebar.style.overflowY = 'auto';

  // Create a button to toggle the sidebar
  const toggleButton = document.createElement('button');
  toggleButton.innerText = 'Toggle Image Selector';
  toggleButton.style.position = 'fixed';
  toggleButton.style.top = '10px';
  toggleButton.style.right = '10px';
  toggleButton.style.zIndex = '1000';
  toggleButton.style.background = 'gray';
  toggleButton.style.padding = '5px 10px';
  toggleButton.addEventListener('click', () => {
    sidebar.style.display = sidebar.style.display === 'none' ? 'flex' : 'none';
  });
  document.body.appendChild(toggleButton);

  // Add pieces to the sidebar (you can add up to 12 pieces here)
  const pieceImages = {
  wq: [
    'https://i.pinimg.com/originals/a7/52/e1/a752e1ff10b2e81db710d667d2b79819.gif',  // White Queen (Image 1)
    'https://upload.chess.com/images/pieces/standard/queen_w.svg'  // White Queen (Image 2 - Chess.com original)
  ],
  bq: [
    'https://cdna.artstation.com/p/assets/images/images/003/971/686/large/monable-kakaotalk-20161019-034232769103-recovered4-23.jpg?1479066673',  // Black Queen (Image 1)
    'https://upload.chess.com/images/pieces/standard/queen_b.svg'  // Black Queen (Image 2 - Chess.com original)
  ],
  wp: [
    'https://classic.runescape.wiki/images/Whiteknightanim.gif?fafd3',  // White Pawn (Image 1)
    'https://upload.chess.com/images/pieces/standard/pawn_w.svg'  // White Pawn (Image 2 - Chess.com original)
  ],
  bp: [
    'https://images6.fanpop.com/image/photos/38400000/lord-of-the-rings-gifs-lord-of-the-rings-38409569-245-140.gif',  // Black Pawn (Image 1)
    'https://upload.chess.com/images/pieces/standard/pawn_b.svg'  // Black Pawn (Image 2 - Chess.com original)
  ],
  wr: [
    'http://media.chesskidfiles.com/images/user/videos/1357_a127e.png',  // White Rook (Image 1)
    'https://upload.chess.com/images/pieces/standard/rook_w.svg'  // White Rook (Image 2 - Chess.com original)
  ],
  br: [
    'https://cdn.openart.ai/uploads/image_54gnv16h_1697033366191_512.webp',  // Black Rook (Image 1)
    'https://upload.chess.com/images/pieces/standard/rook_b.svg'  // Black Rook (Image 2 - Chess.com original)
  ],
  wn: [
    'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.SjluSeuyRylr-eZ2NC8g6AAAAA%26pid%3DApi&f=1&ipt=4eda086ad60727c99da20bbe110fe4c849b77ee306ab587b7593a2dfcc651b14&ipo=images',  // White Knight (Image 1)
    'https://upload.chess.com/images/pieces/standard/knight_w.svg'  // White Knight (Image 2 - Chess.com original)
  ],
  bn: [
    'https://media.giphy.com/media/26BRuo6sLetdllPAQ/giphy.gif',  // Black Knight (Image 1)
    'https://upload.chess.com/images/pieces/standard/knight_b.svg'  // Black Knight (Image 2 - Chess.com original)
  ],
  wb: [
    'https://media.tenor.com/zN8HHZJoYkAAAAAi/aiming-jett.gif',  // White Bishop (Image 1)
    'https://upload.chess.com/images/pieces/standard/bishop_w.svg'  // White Bishop (Image 2 - Chess.com original)
  ],
  bb: [
    'https://i.pinimg.com/originals/70/58/ff/7058ffafc90550d6aa4af19108008063.gif',  // Black Bishop (Image 1)
    'https://upload.chess.com/images/pieces/standard/bishop_b.svg'  // Black Bishop (Image 2 - Chess.com original)
  ],
  wk: [
    'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.YAlIodhpWbC78EpyP9UryQAAAA%26pid%3DApi&f=1&ipt=27f0daf0ed3a9ba914a6a39d846c3fc62e757af598652390cf4150101b55e232&ipo=images',  // White King (Image 1)
    'https://upload.chess.com/images/pieces/standard/king_w.svg'  // White King (Image 2 - Chess.com original)
  ],
  bk: [
    'http://steve-lovelace.com/wordpress/wp-content/uploads/2013/02/burger-king-logo-in-helvetica.png',  // Black King (Image 1)
    'https://upload.chess.com/images/pieces/standard/king_b.svg'  // Black King (Image 2 - Chess.com original)
  ]
};

  // Function to create a button for each piece type
  function createPieceButton(pieceType) {
    const button = document.createElement('button');
    button.innerText = pieceType.toUpperCase();
    button.style.margin = '5px';
    button.addEventListener('click', () => {
      selectedPiece = pieceType; // Store the selected piece type (e.g., 'wq')
    });
    sidebar.appendChild(button);
  }

  // Add the buttons to the sidebar
  for (const pieceType in pieceImages) {
    createPieceButton(pieceType);
  }

  // Append the sidebar to the body
  document.body.appendChild(sidebar);

  // Track the selected piece type (e.g., 'wq', 'bk', etc.)
  let selectedPiece = '';

  // Function to apply custom styles for pieces and board
  function applyCustomStyles() {
    const css = `
      /* Set chessboard size */
      .board {
        width: 560px !important; /* 8 squares * 70px */
        height: 560px !important; /* 8 squares * 70px */
      }

      /* Set each square to 70px by 70px */
      .square {
        width: 70px !important;
        height: 70px !important;
      }

      /* General reset for chess pieces to make them symmetric */
      .piece {
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
        display: block !important;
      }

      /* White Queen */
      .piece.wq {
        background-image: url('https://i.pinimg.com/originals/a7/52/e1/a752e1ff10b2e81db710d667d2b79819.gif') !important;
        background-size: cover !important;
        background-position: center !important;
        width: 70px !important;
        height: 70px !important;
      }

      /* Black Queen */
      .piece.bq {
        background-image: url('https://cdna.artstation.com/p/assets/images/images/003/971/686/large/monable-kakaotalk-20161019-034232769103-recovered4-23.jpg?1479066673') !important;
        background-size: cover !important;
        background-position: center !important;
        width: 70px !important;
        height: 70px !important;
      }

      /* White Pawn */
      .piece.wp {
        background-image: url('https://classic.runescape.wiki/images/Whiteknightanim.gif?fafd3') !important;
        background-size: cover !important;
        background-position: center !important;
        width: 70px !important;
        height: 70px !important;
      }

      /* Black Pawn */
      .piece.bp {
        background-image: url('https://images6.fanpop.com/image/photos/38400000/lord-of-the-rings-gifs-lord-of-the-rings-38409569-245-140.gif') !important;
        background-size: cover !important;
        background-position: center !important;
        width: 70px !important;
        height: 70px !important;
        visibility: visible !important;
      }

      /* White Rook */
      .piece.wr {
        background-image: url('http://media.chesskidfiles.com/images/user/videos/1357_a127e.png') !important;
        background-size: cover !important;
        background-position: center !important;
        width: 70px !important;
        height: 70px !important;
        visibility: visible !important;
      }

      /* Black Rook */
      .piece.br {
        background-image: url('https://cdn.openart.ai/uploads/image_54gnv16h_1697033366191_512.webp') !important;
        background-size: cover !important;
        background-position: center !important;
        width: 70px !important;
        height: 70px !important;
        visibility: visible !important;
      }

      /* White Knight */
      .piece.wn {
        background-image: url('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.SjluSeuyRylr-eZ2NC8g6AAAAA%26pid%3DApi&f=1&ipt=4eda086ad60727c99da20bbe110fe4c849b77ee306ab587b7593a2dfcc651b14&ipo=images') !important;
        background-size: cover !important;
        background-position: center !important;
        width: 70px !important;
        height: 70px !important;
        visibility: visible !important;
      }

      /* Black Knight */
      .piece.bn {
        background-image: url('https://media.giphy.com/media/26BRuo6sLetdllPAQ/giphy.gif') !important;
        background-size: cover !important;
        background-position: center !important;
        width: 70px !important;
        height: 70px !important;
      }

      /* White Bishop */
      .piece.wb {
        background-image: url('https://media.tenor.com/zN8HHZJoYkAAAAAi/aiming-jett.gif') !important;
        background-size: cover !important;
        background-position: center !important;
        width: 70px !important;
        height: 70px !important;
        visibility: visible !important;
      }

      /* Black Bishop */
      .piece.bb {
        background-image: url('https://i.pinimg.com/originals/70/58/ff/7058ffafc90550d6aa4af19108008063.gif') !important;
        background-size: cover !important;
        background-position: center !important;
        width: 70px !important;
        height: 70px !important;
        visibility: visible !important;
      }

      /* White King */
      .piece.wk {
        background-image: url('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.YAlIodhpWbC78EpyP9UryQAAAA%26pid%3DApi&f=1&ipt=27f0daf0ed3a9ba914a6a39d846c3fc62e757af598652390cf4150101b55e232&ipo=images') !important;
        background-size: cover !important;
        background-position: center !important;
        width: 70px !important;
        height: 70px !important;
        visibility: visible !important;
      }

      /* Black King */
      .piece.bk {
        background-image: url('https://c.tenor.com/glANwiUFTxEAAAAM/kingcobrajfs.gif') !important;
        background-size: cover !important;
        background-position: center !important;
        width: 70px !important;
        height: 70px !important;
      }
    `;
    GM_addStyle(css);
  }

  // Add a mutation observer to watch for changes in the DOM (in case pieces load dynamically)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(() => {
      // Check if pieces have been loaded and apply styles
      if (document.querySelector('.piece.wp') && document.querySelector('.piece.bp')) {
        applyCustomStyles();
        observer.disconnect(); // Stop observing once styles are applied
      }
    });
  });

  // Start observing the DOM for changes
  observer.observe(document.body, { childList: true, subtree: true });

  // Add event listeners to all pieces on the board to allow image swapping
  function addPieceEventListeners() {
    document.querySelectorAll('.piece').forEach(pieceElement => {
      pieceElement.addEventListener('click', () => {
        if (!selectedPiece) return; // If no piece is selected, do nothing

        const pieceClass = pieceElement.classList[1]; // Extract the piece type (e.g., 'wq', 'bk', etc.)

        // If the piece is the selected type, toggle its image
        if (pieceClass === selectedPiece) {
          togglePieceImage(pieceClass);
        }
      });
    });
  }

  // Function to toggle the image of the selected piece
  function togglePieceImage(pieceClass) {
    const images = pieceImages[pieceClass];
    const currentImage = document.querySelector(`.piece.${pieceClass}`).style.backgroundImage;

    let nextImage = images[0]; // Default to the first image
    for (let i = 0; i < images.length; i++) {
      if (currentImage.includes(images[i])) {
        nextImage = images[(i + 1) % images.length]; // Cycle to the next image
        break;
      }
    }

    // Set the background image to the next image
    document.querySelector(`.piece.${pieceClass}`).style.backgroundImage = `url(${nextImage})`;
  }

  // Add event listeners to all pieces
  addPieceEventListeners();

})();
