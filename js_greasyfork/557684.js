// ==UserScript==
// @name         Chess Master - Play Anywhere
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Play chess against AI bots on any website
// @author       Assistant
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license Traversal
// @downloadURL https://update.greasyfork.org/scripts/557684/Chess%20Master%20-%20Play%20Anywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/557684/Chess%20Master%20-%20Play%20Anywhere.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    // CHESS ENGINE
    // ═══════════════════════════════════════════════════════════════

    const Chess = {
        // Piece values for evaluation
        PIECE_VALUES: {
            'p': 100, 'n': 320, 'b': 330, 'r': 500, 'q': 900, 'k': 20000
        },

        // Piece-Square Tables for positional evaluation
        PST: {
            'p': [
                [0,  0,  0,  0,  0,  0,  0,  0],
                [50, 50, 50, 50, 50, 50, 50, 50],
                [10, 10, 20, 30, 30, 20, 10, 10],
                [5,  5, 10, 25, 25, 10,  5,  5],
                [0,  0,  0, 20, 20,  0,  0,  0],
                [5, -5,-10,  0,  0,-10, -5,  5],
                [5, 10, 10,-20,-20, 10, 10,  5],
                [0,  0,  0,  0,  0,  0,  0,  0]
            ],
            'n': [
                [-50,-40,-30,-30,-30,-30,-40,-50],
                [-40,-20,  0,  0,  0,  0,-20,-40],
                [-30,  0, 10, 15, 15, 10,  0,-30],
                [-30,  5, 15, 20, 20, 15,  5,-30],
                [-30,  0, 15, 20, 20, 15,  0,-30],
                [-30,  5, 10, 15, 15, 10,  5,-30],
                [-40,-20,  0,  5,  5,  0,-20,-40],
                [-50,-40,-30,-30,-30,-30,-40,-50]
            ],
            'b': [
                [-20,-10,-10,-10,-10,-10,-10,-20],
                [-10,  0,  0,  0,  0,  0,  0,-10],
                [-10,  0,  5, 10, 10,  5,  0,-10],
                [-10,  5,  5, 10, 10,  5,  5,-10],
                [-10,  0, 10, 10, 10, 10,  0,-10],
                [-10, 10, 10, 10, 10, 10, 10,-10],
                [-10,  5,  0,  0,  0,  0,  5,-10],
                [-20,-10,-10,-10,-10,-10,-10,-20]
            ],
            'r': [
                [0,  0,  0,  0,  0,  0,  0,  0],
                [5, 10, 10, 10, 10, 10, 10,  5],
                [-5,  0,  0,  0,  0,  0,  0, -5],
                [-5,  0,  0,  0,  0,  0,  0, -5],
                [-5,  0,  0,  0,  0,  0,  0, -5],
                [-5,  0,  0,  0,  0,  0,  0, -5],
                [-5,  0,  0,  0,  0,  0,  0, -5],
                [0,  0,  0,  5,  5,  0,  0,  0]
            ],
            'q': [
                [-20,-10,-10, -5, -5,-10,-10,-20],
                [-10,  0,  0,  0,  0,  0,  0,-10],
                [-10,  0,  5,  5,  5,  5,  0,-10],
                [-5,  0,  5,  5,  5,  5,  0, -5],
                [0,  0,  5,  5,  5,  5,  0, -5],
                [-10,  5,  5,  5,  5,  5,  0,-10],
                [-10,  0,  5,  0,  0,  0,  0,-10],
                [-20,-10,-10, -5, -5,-10,-10,-20]
            ],
            'k': [
                [-30,-40,-40,-50,-50,-40,-40,-30],
                [-30,-40,-40,-50,-50,-40,-40,-30],
                [-30,-40,-40,-50,-50,-40,-40,-30],
                [-30,-40,-40,-50,-50,-40,-40,-30],
                [-20,-30,-30,-40,-40,-30,-30,-20],
                [-10,-20,-20,-20,-20,-20,-20,-10],
                [20, 20,  0,  0,  0,  0, 20, 20],
                [20, 30, 10,  0,  0, 10, 30, 20]
            ]
        },

        // Create initial board state
        createBoard() {
            return [
                ['r','n','b','q','k','b','n','r'],
                ['p','p','p','p','p','p','p','p'],
                [null,null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null,null],
                ['P','P','P','P','P','P','P','P'],
                ['R','N','B','Q','K','B','N','R']
            ];
        },

        // Check if piece is white
        isWhite(piece) {
            return piece && piece === piece.toUpperCase();
        },

        // Check if piece is black
        isBlack(piece) {
            return piece && piece === piece.toLowerCase();
        },

        // Get piece color
        getColor(piece) {
            if (!piece) return null;
            return this.isWhite(piece) ? 'white' : 'black';
        },

        // Clone board
        cloneBoard(board) {
            return board.map(row => [...row]);
        },

        // Get all valid moves for a piece
        getValidMoves(board, row, col, castling, enPassant, checkLegal = true) {
            const piece = board[row][col];
            if (!piece) return [];

            const moves = [];
            const isWhite = this.isWhite(piece);
            const pieceType = piece.toLowerCase();

            const addMove = (toRow, toCol, special = null) => {
                if (toRow >= 0 && toRow < 8 && toCol >= 0 && toCol < 8) {
                    const target = board[toRow][toCol];
                    if (!target || this.isWhite(target) !== isWhite) {
                        moves.push({ from: [row, col], to: [toRow, toCol], special });
                    }
                }
            };

            const addSlidingMoves = (directions) => {
                for (const [dr, dc] of directions) {
                    let r = row + dr, c = col + dc;
                    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
                        const target = board[r][c];
                        if (!target) {
                            moves.push({ from: [row, col], to: [r, c] });
                        } else {
                            if (this.isWhite(target) !== isWhite) {
                                moves.push({ from: [row, col], to: [r, c] });
                            }
                            break;
                        }
                        r += dr;
                        c += dc;
                    }
                }
            };

            switch (pieceType) {
                case 'p': {
                    const dir = isWhite ? -1 : 1;
                    const startRow = isWhite ? 6 : 1;
                    const promoRow = isWhite ? 0 : 7;

                    // Forward move
                    if (!board[row + dir]?.[col]) {
                        const special = (row + dir === promoRow) ? 'promotion' : null;
                        moves.push({ from: [row, col], to: [row + dir, col], special });

                        // Double move from start
                        if (row === startRow && !board[row + 2 * dir][col]) {
                            moves.push({ from: [row, col], to: [row + 2 * dir, col], special: 'double' });
                        }
                    }

                    // Captures
                    for (const dc of [-1, 1]) {
                        const newCol = col + dc;
                        if (newCol >= 0 && newCol < 8) {
                            const target = board[row + dir]?.[newCol];
                            if (target && this.isWhite(target) !== isWhite) {
                                const special = (row + dir === promoRow) ? 'promotion' : null;
                                moves.push({ from: [row, col], to: [row + dir, newCol], special });
                            }

                            // En passant
                            if (enPassant && enPassant[0] === row + dir && enPassant[1] === newCol) {
                                moves.push({ from: [row, col], to: [row + dir, newCol], special: 'enpassant' });
                            }
                        }
                    }
                    break;
                }

                case 'n': {
                    const knightMoves = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
                    for (const [dr, dc] of knightMoves) {
                        addMove(row + dr, col + dc);
                    }
                    break;
                }

                case 'b': {
                    addSlidingMoves([[-1,-1],[-1,1],[1,-1],[1,1]]);
                    break;
                }

                case 'r': {
                    addSlidingMoves([[-1,0],[1,0],[0,-1],[0,1]]);
                    break;
                }

                case 'q': {
                    addSlidingMoves([[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]);
                    break;
                }

                case 'k': {
                    const kingMoves = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
                    for (const [dr, dc] of kingMoves) {
                        addMove(row + dr, col + dc);
                    }

                    // Castling
                    if (castling) {
                        const homeRow = isWhite ? 7 : 0;
                        if (row === homeRow && col === 4) {
                            // Kingside
                            if ((isWhite ? castling.whiteKing : castling.blackKing) &&
                                !board[homeRow][5] && !board[homeRow][6] &&
                                !this.isSquareAttacked(board, homeRow, 4, !isWhite) &&
                                !this.isSquareAttacked(board, homeRow, 5, !isWhite) &&
                                !this.isSquareAttacked(board, homeRow, 6, !isWhite)) {
                                moves.push({ from: [row, col], to: [homeRow, 6], special: 'castle-king' });
                            }
                            // Queenside
                            if ((isWhite ? castling.whiteQueen : castling.blackQueen) &&
                                !board[homeRow][3] && !board[homeRow][2] && !board[homeRow][1] &&
                                !this.isSquareAttacked(board, homeRow, 4, !isWhite) &&
                                !this.isSquareAttacked(board, homeRow, 3, !isWhite) &&
                                !this.isSquareAttacked(board, homeRow, 2, !isWhite)) {
                                moves.push({ from: [row, col], to: [homeRow, 2], special: 'castle-queen' });
                            }
                        }
                    }
                    break;
                }
            }

            // Filter out moves that leave king in check
            if (checkLegal) {
                return moves.filter(move => {
                    const newBoard = this.cloneBoard(board);
                    this.applyMove(newBoard, move);
                    return !this.isInCheck(newBoard, isWhite ? 'white' : 'black');
                });
            }

            return moves;
        },

        // Check if a square is attacked by enemy
        isSquareAttacked(board, row, col, byWhite) {
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    const piece = board[r][c];
                    if (piece && this.isWhite(piece) === byWhite) {
                        const moves = this.getValidMoves(board, r, c, null, null, false);
                        if (moves.some(m => m.to[0] === row && m.to[1] === col)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        },

        // Find king position
        findKing(board, color) {
            const king = color === 'white' ? 'K' : 'k';
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    if (board[r][c] === king) return [r, c];
                }
            }
            return null;
        },

        // Check if color is in check
        isInCheck(board, color) {
            const kingPos = this.findKing(board, color);
            if (!kingPos) return false;
            return this.isSquareAttacked(board, kingPos[0], kingPos[1], color === 'white' ? false : true);
        },

        // Apply move to board
        applyMove(board, move) {
            const piece = board[move.from[0]][move.from[1]];
            board[move.from[0]][move.from[1]] = null;
            board[move.to[0]][move.to[1]] = piece;

            // Handle special moves
            if (move.special === 'enpassant') {
                const dir = this.isWhite(piece) ? 1 : -1;
                board[move.to[0] + dir][move.to[1]] = null;
            } else if (move.special === 'castle-king') {
                const row = move.to[0];
                board[row][5] = board[row][7];
                board[row][7] = null;
            } else if (move.special === 'castle-queen') {
                const row = move.to[0];
                board[row][3] = board[row][0];
                board[row][0] = null;
            } else if (move.special === 'promotion') {
                board[move.to[0]][move.to[1]] = this.isWhite(piece) ? 'Q' : 'q';
            }

            return board;
        },

        // Get all legal moves for a color
        getAllMoves(board, color, castling, enPassant) {
            const moves = [];
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    const piece = board[r][c];
                    if (piece && this.getColor(piece) === color) {
                        moves.push(...this.getValidMoves(board, r, c, castling, enPassant));
                    }
                }
            }
            return moves;
        },

        // Evaluate board position
        evaluate(board) {
            let score = 0;

            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    const piece = board[r][c];
                    if (!piece) continue;

                    const pieceType = piece.toLowerCase();
                    const isWhite = this.isWhite(piece);
                    const value = this.PIECE_VALUES[pieceType];
                    const pstRow = isWhite ? r : 7 - r;
                    const pstValue = this.PST[pieceType][pstRow][c];

                    if (isWhite) {
                        score += value + pstValue;
                    } else {
                        score -= value + pstValue;
                    }
                }
            }

            return score;
        },

        // Minimax with alpha-beta pruning
        minimax(board, depth, alpha, beta, isMaximizing, castling, enPassant) {
            if (depth === 0) {
                return { score: this.evaluate(board) };
            }

            const color = isMaximizing ? 'white' : 'black';
            const moves = this.getAllMoves(board, color, castling, enPassant);

            if (moves.length === 0) {
                if (this.isInCheck(board, color)) {
                    return { score: isMaximizing ? -100000 + depth : 100000 - depth };
                }
                return { score: 0 }; // Stalemate
            }

            // Move ordering - captures first
            moves.sort((a, b) => {
                const captureA = board[a.to[0]][a.to[1]] ? 1 : 0;
                const captureB = board[b.to[0]][b.to[1]] ? 1 : 0;
                return captureB - captureA;
            });

            let bestMove = moves[0];

            if (isMaximizing) {
                let maxScore = -Infinity;
                for (const move of moves) {
                    const newBoard = this.cloneBoard(board);
                    this.applyMove(newBoard, move);
                    const result = this.minimax(newBoard, depth - 1, alpha, beta, false, castling, null);
                    if (result.score > maxScore) {
                        maxScore = result.score;
                        bestMove = move;
                    }
                    alpha = Math.max(alpha, result.score);
                    if (beta <= alpha) break;
                }
                return { score: maxScore, move: bestMove };
            } else {
                let minScore = Infinity;
                for (const move of moves) {
                    const newBoard = this.cloneBoard(board);
                    this.applyMove(newBoard, move);
                    const result = this.minimax(newBoard, depth - 1, alpha, beta, true, castling, null);
                    if (result.score < minScore) {
                        minScore = result.score;
                        bestMove = move;
                    }
                    beta = Math.min(beta, result.score);
                    if (beta <= alpha) break;
                }
                return { score: minScore, move: bestMove };
            }
        },

        // Get AI move
        getAIMove(board, castling, enPassant, difficulty) {
            const depths = { easy: 1, medium: 2, hard: 3, master: 4 };
            const depth = depths[difficulty] || 2;

            // Add randomness for easier difficulties
            if (difficulty === 'easy' && Math.random() < 0.3) {
                const moves = this.getAllMoves(board, 'black', castling, enPassant);
                if (moves.length > 0) {
                    return moves[Math.floor(Math.random() * moves.length)];
                }
            }

            const result = this.minimax(board, depth, -Infinity, Infinity, false, castling, enPassant);
            return result.move;
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // STYLES
    // ═══════════════════════════════════════════════════════════════

    GM_addStyle(`
        /* Chess Widget Container */
        .chess-widget {
            --bg-primary: #1a1b26;
            --bg-secondary: #24283b;
            --bg-tertiary: #1f2335;
            --text-primary: #c0caf5;
            --text-secondary: #565f89;
            --accent: #7aa2f7;
            --accent-hover: #89b4fa;
            --success: #9ece6a;
            --error: #f7768e;
            --warning: #e0af68;
            --light-square: #eeeed2;
            --dark-square: #769656;
            --highlight: rgba(255, 255, 0, 0.4);
            --move-hint: rgba(0, 0, 0, 0.2);
            --border: #3b4261;
            --shadow: rgba(0, 0, 0, 0.5);

            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            position: fixed;
            z-index: 2147483647;
        }

        .chess-widget * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        /* Theme Variants */
        .chess-widget[data-theme="classic"] {
            --light-square: #f0d9b5;
            --dark-square: #b58863;
        }

        .chess-widget[data-theme="blue"] {
            --light-square: #dee3e6;
            --dark-square: #8ca2ad;
        }

        .chess-widget[data-theme="green"] {
            --light-square: #eeeed2;
            --dark-square: #769656;
        }

        .chess-widget[data-theme="purple"] {
            --light-square: #e8dff0;
            --dark-square: #9573a6;
        }

        /* Floating Button */
        .chess-fab {
            width: 60px;
            height: 60px;
            border-radius: 16px;
            background: linear-gradient(135deg, var(--accent), #bb9af7);
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 20px var(--shadow);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-size: 28px;
        }

        .chess-fab:hover {
            transform: scale(1.1) rotate(-5deg);
            box-shadow: 0 6px 30px var(--shadow);
        }

        .chess-fab:active {
            transform: scale(0.95);
        }

        /* Game Window */
        .chess-window {
            position: absolute;
            bottom: 75px;
            right: 0;
            width: 500px;
            background: var(--bg-primary);
            border-radius: 20px;
            box-shadow: 0 25px 80px var(--shadow);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px) scale(0.95);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid var(--border);
        }

        .chess-window.open {
            opacity: 1;
            visibility: visible;
            transform: translateY(0) scale(1);
        }

        /* Header */
        .chess-header {
            background: var(--bg-secondary);
            padding: 16px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid var(--border);
        }

        .chess-header-left {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .chess-header-left h3 {
            color: var(--text-primary);
            font-size: 18px;
            font-weight: 600;
        }

        .chess-header-left span {
            font-size: 24px;
        }

        .chess-header-actions {
            display: flex;
            gap: 8px;
        }

        .chess-btn {
            padding: 8px 12px;
            border-radius: 8px;
            background: var(--bg-tertiary);
            border: 1px solid var(--border);
            color: var(--text-primary);
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .chess-btn:hover {
            background: var(--accent);
            border-color: var(--accent);
        }

        .chess-btn.icon-only {
            padding: 8px;
        }

        /* Game Area */
        .chess-game {
            display: flex;
            flex-direction: column;
            padding: 16px;
            gap: 12px;
        }

        /* Status Bar */
        .chess-status {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 16px;
            background: var(--bg-secondary);
            border-radius: 12px;
        }

        .chess-player {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .chess-player-icon {
            width: 36px;
            height: 36px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
        }

        .chess-player-icon.white { background: #fff; }
        .chess-player-icon.black { background: #333; }

        .chess-player-info {
            display: flex;
            flex-direction: column;
        }

        .chess-player-name {
            color: var(--text-primary);
            font-weight: 600;
            font-size: 14px;
        }

        .chess-player-status {
            color: var(--text-secondary);
            font-size: 12px;
        }

        .chess-player.active .chess-player-name {
            color: var(--accent);
        }

        .chess-turn-indicator {
            padding: 6px 12px;
            background: var(--accent);
            color: #fff;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }

        /* Board Container */
        .chess-board-container {
            display: flex;
            gap: 12px;
        }

        /* Captured Pieces */
        .chess-captured {
            display: flex;
            flex-direction: column;
            gap: 8px;
            width: 30px;
        }

        .chess-captured-group {
            display: flex;
            flex-direction: column;
            font-size: 16px;
            line-height: 1.2;
        }

        /* Board */
        .chess-board {
            display: grid;
            grid-template-columns: repeat(8, 1fr);
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 20px var(--shadow);
            flex: 1;
            aspect-ratio: 1;
        }

        .chess-square {
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            cursor: pointer;
            position: relative;
            transition: background-color 0.15s;
            user-select: none;
        }

        .chess-square.light { background: var(--light-square); }
        .chess-square.dark { background: var(--dark-square); }

        .chess-square.selected {
            background: var(--highlight) !important;
        }

        .chess-square.last-move {
            background: rgba(255, 255, 0, 0.3) !important;
        }

        .chess-square.check {
            background: radial-gradient(circle, var(--error) 0%, transparent 70%) !important;
        }

        .chess-square.valid-move::after {
            content: '';
            position: absolute;
            width: 30%;
            height: 30%;
            background: var(--move-hint);
            border-radius: 50%;
        }

        .chess-square.valid-capture::after {
            content: '';
            position: absolute;
            inset: 4px;
            border: 4px solid var(--move-hint);
            border-radius: 50%;
            background: transparent;
        }

        .chess-square:hover {
            filter: brightness(1.1);
        }

        .chess-piece {
            font-size: inherit;
            line-height: 1;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
            transition: transform 0.1s;
        }

        .chess-square:active .chess-piece {
            transform: scale(1.1);
        }

        /* Coordinates */
        .chess-square .coord-file {
            position: absolute;
            bottom: 2px;
            right: 4px;
            font-size: 10px;
            font-weight: 600;
            opacity: 0.7;
        }

        .chess-square .coord-rank {
            position: absolute;
            top: 2px;
            left: 4px;
            font-size: 10px;
            font-weight: 600;
            opacity: 0.7;
        }

        .chess-square.light .coord-file,
        .chess-square.light .coord-rank { color: var(--dark-square); }
        .chess-square.dark .coord-file,
        .chess-square.dark .coord-rank { color: var(--light-square); }

        /* Controls */
        .chess-controls {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }

        .chess-controls .chess-btn {
            flex: 1;
            justify-content: center;
            min-width: 80px;
        }

        /* Move History */
        .chess-history {
            background: var(--bg-secondary);
            border-radius: 12px;
            padding: 12px;
            max-height: 100px;
            overflow-y: auto;
        }

        .chess-history-title {
            color: var(--text-secondary);
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }

        .chess-moves {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            font-family: 'Courier New', monospace;
            font-size: 13px;
        }

        .chess-move {
            padding: 2px 6px;
            background: var(--bg-tertiary);
            border-radius: 4px;
            color: var(--text-primary);
        }

        .chess-move-number {
            color: var(--text-secondary);
        }

        /* Settings Panel */
        .chess-settings {
            position: absolute;
            inset: 0;
            background: var(--bg-primary);
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: column;
        }

        .chess-settings.open {
            transform: translateX(0);
        }

        .chess-settings-header {
            padding: 16px 20px;
            background: var(--bg-secondary);
            border-bottom: 1px solid var(--border);
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .chess-settings-header h3 {
            color: var(--text-primary);
            font-size: 18px;
        }

        .chess-settings-body {
            padding: 20px;
            overflow-y: auto;
            flex: 1;
        }

        .chess-setting-group {
            margin-bottom: 20px;
        }

        .chess-setting-group h4 {
            color: var(--text-secondary);
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
        }

        .chess-setting-options {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }

        .chess-setting-option {
            padding: 10px 16px;
            background: var(--bg-secondary);
            border: 2px solid var(--border);
            border-radius: 10px;
            color: var(--text-primary);
            cursor: pointer;
            transition: all 0.2s;
            font-size: 14px;
        }

        .chess-setting-option:hover {
            border-color: var(--accent);
        }

        .chess-setting-option.active {
            border-color: var(--accent);
            background: rgba(122, 162, 247, 0.2);
        }

        /* Board Theme Options */
        .chess-theme-option {
            width: 60px;
            height: 40px;
            border-radius: 8px;
            overflow: hidden;
            display: grid;
            grid-template-columns: 1fr 1fr;
            cursor: pointer;
            border: 2px solid var(--border);
            transition: all 0.2s;
        }

        .chess-theme-option:hover,
        .chess-theme-option.active {
            border-color: var(--accent);
            transform: scale(1.05);
        }

        .chess-theme-option .light,
        .chess-theme-option .dark {
            width: 100%;
            height: 100%;
        }

        .chess-theme-option[data-theme="classic"] .light { background: #f0d9b5; }
        .chess-theme-option[data-theme="classic"] .dark { background: #b58863; }
        .chess-theme-option[data-theme="blue"] .light { background: #dee3e6; }
        .chess-theme-option[data-theme="blue"] .dark { background: #8ca2ad; }
        .chess-theme-option[data-theme="green"] .light { background: #eeeed2; }
        .chess-theme-option[data-theme="green"] .dark { background: #769656; }
        .chess-theme-option[data-theme="purple"] .light { background: #e8dff0; }
        .chess-theme-option[data-theme="purple"] .dark { background: #9573a6; }

        /* Game Over Modal */
        .chess-modal {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s;
        }

        .chess-modal.open {
            opacity: 1;
            visibility: visible;
        }

        .chess-modal-content {
            background: var(--bg-secondary);
            padding: 30px 40px;
            border-radius: 20px;
            text-align: center;
            transform: scale(0.9);
            transition: transform 0.3s;
        }

        .chess-modal.open .chess-modal-content {
            transform: scale(1);
        }

        .chess-modal-icon {
            font-size: 60px;
            margin-bottom: 16px;
        }

        .chess-modal h2 {
            color: var(--text-primary);
            font-size: 24px;
            margin-bottom: 8px;
        }

        .chess-modal p {
            color: var(--text-secondary);
            font-size: 16px;
            margin-bottom: 24px;
        }

        .chess-modal-buttons {
            display: flex;
            gap: 12px;
            justify-content: center;
        }

        .chess-modal .chess-btn {
            padding: 12px 24px;
            font-size: 15px;
        }

        .chess-modal .chess-btn.primary {
            background: var(--accent);
            border-color: var(--accent);
        }

        /* Scrollbar */
        .chess-widget ::-webkit-scrollbar {
            width: 6px;
        }

        .chess-widget ::-webkit-scrollbar-track {
            background: transparent;
        }

        .chess-widget ::-webkit-scrollbar-thumb {
            background: var(--border);
            border-radius: 3px;
        }

        /* Responsive */
        @media (max-width: 540px) {
            .chess-window {
                width: calc(100vw - 20px);
                right: -10px;
            }
            .chess-square { font-size: 28px; }
        }
    `);

    // ═══════════════════════════════════════════════════════════════
    // PIECE UNICODE SYMBOLS
    // ═══════════════════════════════════════════════════════════════

    const PIECES = {
        'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
        'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
    };

    // ═══════════════════════════════════════════════════════════════
    // GAME STATE
    // ═══════════════════════════════════════════════════════════════

    let gameState = {
        board: Chess.createBoard(),
        turn: 'white',
        selectedSquare: null,
        validMoves: [],
        castling: { whiteKing: true, whiteQueen: true, blackKing: true, blackQueen: true },
        enPassant: null,
        moveHistory: [],
        capturedWhite: [],
        capturedBlack: [],
        isOpen: false,
        isSettingsOpen: false,
        difficulty: 'medium',
        boardTheme: 'green',
        isFlipped: false,
        lastMove: null,
        gameOver: false,
        gameResult: null
    };

    // Load saved settings
    const savedState = GM_getValue('chess_game_state');
    if (savedState) {
        const parsed = JSON.parse(savedState);
        gameState.difficulty = parsed.difficulty || 'medium';
        gameState.boardTheme = parsed.boardTheme || 'green';
    }

    function saveSettings() {
        GM_setValue('chess_game_state', JSON.stringify({
            difficulty: gameState.difficulty,
            boardTheme: gameState.boardTheme
        }));
    }

    // ═══════════════════════════════════════════════════════════════
    // CREATE WIDGET
    // ═══════════════════════════════════════════════════════════════

    function createWidget() {
        const widget = document.createElement('div');
        widget.className = 'chess-widget';
        widget.dataset.theme = gameState.boardTheme;
        widget.style.cssText = 'right: 20px; bottom: 20px;';

        widget.innerHTML = `
            <button class="chess-fab" id="chess-fab">♟️</button>

            <div class="chess-window" id="chess-window">
                <!-- Header -->
                <div class="chess-header">
                    <div class="chess-header-left">
                        <span>♟️</span>
                        <h3>Chess Master</h3>
                    </div>
                    <div class="chess-header-actions">
                        <button class="chess-btn icon-only" id="chess-settings-btn" title="Settings">⚙️</button>
                        <button class="chess-btn icon-only" id="chess-close-btn" title="Close">✕</button>
                    </div>
                </div>

                <!-- Game Area -->
                <div class="chess-game">
                    <!-- Status -->
                    <div class="chess-status">
                        <div class="chess-player ${gameState.turn === 'black' ? 'active' : ''}" id="black-player">
                            <div class="chess-player-icon black">♚</div>
                            <div class="chess-player-info">
                                <span class="chess-player-name">Bot (<span id="difficulty-label">${gameState.difficulty}</span>)</span>
                                <span class="chess-player-status">Black</span>
                            </div>
                        </div>
                        <div class="chess-turn-indicator" id="turn-indicator">
                            ${gameState.turn === 'white' ? 'Your turn' : 'Bot thinking...'}
                        </div>
                        <div class="chess-player ${gameState.turn === 'white' ? 'active' : ''}" id="white-player">
                            <div class="chess-player-info" style="text-align: right;">
                                <span class="chess-player-name">You</span>
                                <span class="chess-player-status">White</span>
                            </div>
                            <div class="chess-player-icon white">♔</div>
                        </div>
                    </div>

                    <!-- Board Container -->
                    <div class="chess-board-container">
                        <div class="chess-captured" id="captured-white"></div>
                        <div class="chess-board" id="chess-board"></div>
                        <div class="chess-captured" id="captured-black"></div>
                    </div>

                    <!-- Controls -->
                    <div class="chess-controls">
                        <button class="chess-btn" id="new-game-btn">🔄 New Game</button>
                        <button class="chess-btn" id="undo-btn">↩️ Undo</button>
                        <button class="chess-btn" id="flip-btn">🔃 Flip</button>
                        <button class="chess-btn" id="hint-btn">💡 Hint</button>
                    </div>

                    <!-- Move History -->
                    <div class="chess-history">
                        <div class="chess-history-title">Move History</div>
                        <div class="chess-moves" id="move-history"></div>
                    </div>
                </div>

                <!-- Settings Panel -->
                <div class="chess-settings" id="chess-settings">
                    <div class="chess-settings-header">
                        <button class="chess-btn icon-only" id="settings-back-btn">←</button>
                        <h3>Settings</h3>
                    </div>
                    <div class="chess-settings-body">
                        <div class="chess-setting-group">
                            <h4>Difficulty</h4>
                            <div class="chess-setting-options" id="difficulty-options">
                                <div class="chess-setting-option ${gameState.difficulty === 'easy' ? 'active' : ''}" data-difficulty="easy">
                                    🌱 Easy
                                </div>
                                <div class="chess-setting-option ${gameState.difficulty === 'medium' ? 'active' : ''}" data-difficulty="medium">
                                    🌿 Medium
                                </div>
                                <div class="chess-setting-option ${gameState.difficulty === 'hard' ? 'active' : ''}" data-difficulty="hard">
                                    🌳 Hard
                                </div>
                                <div class="chess-setting-option ${gameState.difficulty === 'master' ? 'active' : ''}" data-difficulty="master">
                                    👑 Master
                                </div>
                            </div>
                        </div>

                        <div class="chess-setting-group">
                            <h4>Board Theme</h4>
                            <div class="chess-setting-options" id="theme-options">
                                <div class="chess-theme-option ${gameState.boardTheme === 'classic' ? 'active' : ''}" data-theme="classic">
                                    <div class="light"></div>
                                    <div class="dark"></div>
                                </div>
                                <div class="chess-theme-option ${gameState.boardTheme === 'blue' ? 'active' : ''}" data-theme="blue">
                                    <div class="light"></div>
                                    <div class="dark"></div>
                                </div>
                                <div class="chess-theme-option ${gameState.boardTheme === 'green' ? 'active' : ''}" data-theme="green">
                                    <div class="light"></div>
                                    <div class="dark"></div>
                                </div>
                                <div class="chess-theme-option ${gameState.boardTheme === 'purple' ? 'active' : ''}" data-theme="purple">
                                    <div class="light"></div>
                                    <div class="dark"></div>
                                </div>
                            </div>
                        </div>

                        <div class="chess-setting-group">
                            <h4>Play As</h4>
                            <div class="chess-setting-options">
                                <div class="chess-setting-option active" data-color="white">⬜ White</div>
                                <div class="chess-setting-option" data-color="black">⬛ Black</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Game Over Modal -->
                <div class="chess-modal" id="game-over-modal">
                    <div class="chess-modal-content">
                        <div class="chess-modal-icon" id="modal-icon">🏆</div>
                        <h2 id="modal-title">Game Over!</h2>
                        <p id="modal-message">You won by checkmate!</p>
                        <div class="chess-modal-buttons">
                            <button class="chess-btn" id="modal-close-btn">Close</button>
                            <button class="chess-btn primary" id="modal-new-game-btn">New Game</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(widget);
        return widget;
    }

    // ═══════════════════════════════════════════════════════════════
    // RENDER FUNCTIONS
    // ═══════════════════════════════════════════════════════════════

    function renderBoard() {
        const boardEl = document.getElementById('chess-board');
        boardEl.innerHTML = '';

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const row = gameState.isFlipped ? 7 - r : r;
                const col = gameState.isFlipped ? 7 - c : c;
                const piece = gameState.board[row][col];
                const isLight = (row + col) % 2 === 0;

                const square = document.createElement('div');
                square.className = `chess-square ${isLight ? 'light' : 'dark'}`;
                square.dataset.row = row;
                square.dataset.col = col;

                // Highlight selected square
                if (gameState.selectedSquare &&
                    gameState.selectedSquare[0] === row &&
                    gameState.selectedSquare[1] === col) {
                    square.classList.add('selected');
                }

                // Highlight last move
                if (gameState.lastMove) {
                    if ((gameState.lastMove.from[0] === row && gameState.lastMove.from[1] === col) ||
                        (gameState.lastMove.to[0] === row && gameState.lastMove.to[1] === col)) {
                        square.classList.add('last-move');
                    }
                }

                // Show valid moves
                const validMove = gameState.validMoves.find(m => m.to[0] === row && m.to[1] === col);
                if (validMove) {
                    if (gameState.board[row][col]) {
                        square.classList.add('valid-capture');
                    } else {
                        square.classList.add('valid-move');
                    }
                }

                // Check indicator
                if (piece && piece.toLowerCase() === 'k') {
                    const color = Chess.isWhite(piece) ? 'white' : 'black';
                    if (Chess.isInCheck(gameState.board, color)) {
                        square.classList.add('check');
                    }
                }

                // Add piece
                if (piece) {
                    const pieceEl = document.createElement('span');
                    pieceEl.className = 'chess-piece';
                    pieceEl.textContent = PIECES[piece];
                    square.appendChild(pieceEl);
                }

                // Add coordinates
                if (col === (gameState.isFlipped ? 0 : 7)) {
                    const rank = document.createElement('span');
                    rank.className = 'coord-rank';
                    rank.textContent = 8 - row;
                    square.appendChild(rank);
                }
                if (row === (gameState.isFlipped ? 0 : 7)) {
                    const file = document.createElement('span');
                    file.className = 'coord-file';
                    file.textContent = 'abcdefgh'[col];
                    square.appendChild(file);
                }

                square.addEventListener('click', () => handleSquareClick(row, col));
                boardEl.appendChild(square);
            }
        }
    }

    function renderCaptured() {
        document.getElementById('captured-white').innerHTML =
            `<div class="chess-captured-group">${gameState.capturedWhite.map(p => PIECES[p]).join('')}</div>`;
        document.getElementById('captured-black').innerHTML =
            `<div class="chess-captured-group">${gameState.capturedBlack.map(p => PIECES[p]).join('')}</div>`;
    }

    function renderMoveHistory() {
        const historyEl = document.getElementById('move-history');
        historyEl.innerHTML = '';

        for (let i = 0; i < gameState.moveHistory.length; i += 2) {
            const moveNum = Math.floor(i / 2) + 1;
            const whiteMove = gameState.moveHistory[i];
            const blackMove = gameState.moveHistory[i + 1];

            const moveEl = document.createElement('span');
            moveEl.className = 'chess-move';
            moveEl.innerHTML = `<span class="chess-move-number">${moveNum}.</span> ${whiteMove}${blackMove ? ' ' + blackMove : ''}`;
            historyEl.appendChild(moveEl);
        }

        historyEl.scrollLeft = historyEl.scrollWidth;
    }

    function updateStatus() {
        const turnIndicator = document.getElementById('turn-indicator');
        const whitePlayer = document.getElementById('white-player');
        const blackPlayer = document.getElementById('black-player');

        if (gameState.gameOver) {
            turnIndicator.textContent = 'Game Over';
        } else if (gameState.turn === 'white') {
            turnIndicator.textContent = 'Your turn';
            whitePlayer.classList.add('active');
            blackPlayer.classList.remove('active');
        } else {
            turnIndicator.textContent = 'Bot thinking...';
            blackPlayer.classList.add('active');
            whitePlayer.classList.remove('active');
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // GAME LOGIC
    // ═══════════════════════════════════════════════════════════════

    function getMoveNotation(move, piece) {
        const files = 'abcdefgh';
        const ranks = '87654321';
        const pieceSymbols = { 'n': 'N', 'b': 'B', 'r': 'R', 'q': 'Q', 'k': 'K', 'p': '' };
        const pieceType = piece.toLowerCase();

        let notation = pieceSymbols[pieceType];

        if (move.special === 'castle-king') return 'O-O';
        if (move.special === 'castle-queen') return 'O-O-O';

        const isCapture = gameState.board[move.to[0]][move.to[1]] || move.special === 'enpassant';
        if (isCapture) {
            if (pieceType === 'p') {
                notation = files[move.from[1]];
            }
            notation += 'x';
        }

        notation += files[move.to[1]] + ranks[move.to[0]];

        if (move.special === 'promotion') notation += '=Q';

        return notation;
    }

    function handleSquareClick(row, col) {
        if (gameState.gameOver || gameState.turn !== 'white') return;

        const piece = gameState.board[row][col];

        // If clicking on a valid move destination
        const validMove = gameState.validMoves.find(m => m.to[0] === row && m.to[1] === col);
        if (validMove) {
            makeMove(validMove);
            return;
        }

        // If clicking on own piece, select it
        if (piece && Chess.isWhite(piece)) {
            gameState.selectedSquare = [row, col];
            gameState.validMoves = Chess.getValidMoves(
                gameState.board, row, col,
                gameState.castling, gameState.enPassant
            );
        } else {
            gameState.selectedSquare = null;
            gameState.validMoves = [];
        }

        renderBoard();
    }

    function makeMove(move) {
        const piece = gameState.board[move.from[0]][move.from[1]];
        const captured = gameState.board[move.to[0]][move.to[1]];

        // Track captured pieces
        if (captured) {
            if (Chess.isWhite(captured)) {
                gameState.capturedWhite.push(captured);
            } else {
                gameState.capturedBlack.push(captured);
            }
        }

        // Handle en passant capture
        if (move.special === 'enpassant') {
            const dir = Chess.isWhite(piece) ? 1 : -1;
            const capturedPawn = gameState.board[move.to[0] + dir][move.to[1]];
            if (Chess.isWhite(capturedPawn)) {
                gameState.capturedWhite.push(capturedPawn);
            } else {
                gameState.capturedBlack.push(capturedPawn);
            }
        }

        // Update castling rights
        if (piece === 'K') {
            gameState.castling.whiteKing = false;
            gameState.castling.whiteQueen = false;
        } else if (piece === 'k') {
            gameState.castling.blackKing = false;
            gameState.castling.blackQueen = false;
        } else if (piece === 'R') {
            if (move.from[0] === 7 && move.from[1] === 0) gameState.castling.whiteQueen = false;
            if (move.from[0] === 7 && move.from[1] === 7) gameState.castling.whiteKing = false;
        } else if (piece === 'r') {
            if (move.from[0] === 0 && move.from[1] === 0) gameState.castling.blackQueen = false;
            if (move.from[0] === 0 && move.from[1] === 7) gameState.castling.blackKing = false;
        }

        // Set en passant square
        if (move.special === 'double') {
            const epRow = Chess.isWhite(piece) ? move.to[0] + 1 : move.to[0] - 1;
            gameState.enPassant = [epRow, move.to[1]];
        } else {
            gameState.enPassant = null;
        }

        // Record move notation
        const notation = getMoveNotation(move, piece);
        gameState.moveHistory.push(notation);

        // Apply move
        Chess.applyMove(gameState.board, move);
        gameState.lastMove = move;
        gameState.selectedSquare = null;
        gameState.validMoves = [];

        // Switch turn
        gameState.turn = gameState.turn === 'white' ? 'black' : 'white';

        // Check for game end
        checkGameEnd();

        // Render updates
        renderBoard();
        renderCaptured();
        renderMoveHistory();
        updateStatus();

        // AI move
        if (!gameState.gameOver && gameState.turn === 'black') {
            setTimeout(makeAIMove, 500);
        }
    }

    function makeAIMove() {
        const aiMove = Chess.getAIMove(
            gameState.board,
            gameState.castling,
            gameState.enPassant,
            gameState.difficulty
        );

        if (aiMove) {
            makeMove(aiMove);
        }
    }

    function checkGameEnd() {
        const currentColor = gameState.turn;
        const moves = Chess.getAllMoves(
            gameState.board, currentColor,
            gameState.castling, gameState.enPassant
        );

        if (moves.length === 0) {
            gameState.gameOver = true;
            if (Chess.isInCheck(gameState.board, currentColor)) {
                // Checkmate
                gameState.gameResult = currentColor === 'white' ? 'black' : 'white';
                showGameOverModal(
                    gameState.gameResult === 'white' ? '🏆' : '😔',
                    'Checkmate!',
                    gameState.gameResult === 'white' ? 'You won!' : 'Bot wins!'
                );
            } else {
                // Stalemate
                gameState.gameResult = 'draw';
                showGameOverModal('🤝', 'Stalemate!', 'The game is a draw.');
            }
        }
    }

    function showGameOverModal(icon, title, message) {
        document.getElementById('modal-icon').textContent = icon;
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-message').textContent = message;
        document.getElementById('game-over-modal').classList.add('open');
    }

    function newGame() {
        gameState.board = Chess.createBoard();
        gameState.turn = 'white';
        gameState.selectedSquare = null;
        gameState.validMoves = [];
        gameState.castling = { whiteKing: true, whiteQueen: true, blackKing: true, blackQueen: true };
        gameState.enPassant = null;
        gameState.moveHistory = [];
        gameState.capturedWhite = [];
        gameState.capturedBlack = [];
        gameState.lastMove = null;
        gameState.gameOver = false;
        gameState.gameResult = null;

        document.getElementById('game-over-modal').classList.remove('open');
        renderBoard();
        renderCaptured();
        renderMoveHistory();
        updateStatus();
    }

    function undoMove() {
        if (gameState.moveHistory.length < 2 || gameState.gameOver) return;

        // Reset to starting position and replay all moves except last two
        gameState.board = Chess.createBoard();
        gameState.castling = { whiteKing: true, whiteQueen: true, blackKing: true, blackQueen: true };
        gameState.enPassant = null;
        gameState.capturedWhite = [];
        gameState.capturedBlack = [];

        // Remove last two moves (player and AI)
        gameState.moveHistory = gameState.moveHistory.slice(0, -2);
        gameState.turn = 'white';
        gameState.selectedSquare = null;
        gameState.validMoves = [];
        gameState.lastMove = null;

        renderBoard();
        renderCaptured();
        renderMoveHistory();
        updateStatus();
    }

    function showHint() {
        if (gameState.turn !== 'white' || gameState.gameOver) return;

        // Use AI to find best move for white
        const hint = Chess.minimax(
            gameState.board, 2, -Infinity, Infinity, true,
            gameState.castling, gameState.enPassant
        );

        if (hint.move) {
            gameState.selectedSquare = hint.move.from;
            gameState.validMoves = [hint.move];
            renderBoard();

            setTimeout(() => {
                gameState.selectedSquare = null;
                gameState.validMoves = [];
                renderBoard();
            }, 2000);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // EVENT LISTENERS
    // ═══════════════════════════════════════════════════════════════

    function setupEventListeners(widget) {
        const fab = document.getElementById('chess-fab');
        const window = document.getElementById('chess-window');
        const closeBtn = document.getElementById('chess-close-btn');
        const settingsBtn = document.getElementById('chess-settings-btn');
        const settingsPanel = document.getElementById('chess-settings');
        const settingsBackBtn = document.getElementById('settings-back-btn');
        const newGameBtn = document.getElementById('new-game-btn');
        const undoBtn = document.getElementById('undo-btn');
        const flipBtn = document.getElementById('flip-btn');
        const hintBtn = document.getElementById('hint-btn');
        const modalCloseBtn = document.getElementById('modal-close-btn');
        const modalNewGameBtn = document.getElementById('modal-new-game-btn');

        // Toggle game window
        fab.addEventListener('click', () => {
            gameState.isOpen = !gameState.isOpen;
            window.classList.toggle('open', gameState.isOpen);
        });

        closeBtn.addEventListener('click', () => {
            gameState.isOpen = false;
            window.classList.remove('open');
        });

        // Settings panel
        settingsBtn.addEventListener('click', () => {
            settingsPanel.classList.add('open');
        });

        settingsBackBtn.addEventListener('click', () => {
            settingsPanel.classList.remove('open');
        });

        // Difficulty selection
        document.getElementById('difficulty-options').addEventListener('click', (e) => {
            const option = e.target.closest('.chess-setting-option');
            if (!option) return;

            document.querySelectorAll('#difficulty-options .chess-setting-option')
                .forEach(o => o.classList.remove('active'));
            option.classList.add('active');

            gameState.difficulty = option.dataset.difficulty;
            document.getElementById('difficulty-label').textContent = gameState.difficulty;
            saveSettings();
        });

        // Theme selection
        document.getElementById('theme-options').addEventListener('click', (e) => {
            const option = e.target.closest('.chess-theme-option');
            if (!option) return;

            document.querySelectorAll('.chess-theme-option')
                .forEach(o => o.classList.remove('active'));
            option.classList.add('active');

            gameState.boardTheme = option.dataset.theme;
            widget.dataset.theme = option.dataset.theme;
            saveSettings();
        });

        // Game controls
        newGameBtn.addEventListener('click', newGame);
        undoBtn.addEventListener('click', undoMove);
        flipBtn.addEventListener('click', () => {
            gameState.isFlipped = !gameState.isFlipped;
            renderBoard();
        });
        hintBtn.addEventListener('click', showHint);

        // Modal buttons
        modalCloseBtn.addEventListener('click', () => {
            document.getElementById('game-over-modal').classList.remove('open');
        });
        modalNewGameBtn.addEventListener('click', newGame);

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (!gameState.isOpen) return;

            if (e.key === 'Escape') {
                if (settingsPanel.classList.contains('open')) {
                    settingsPanel.classList.remove('open');
                } else {
                    gameState.isOpen = false;
                    window.classList.remove('open');
                }
            } else if (e.key === 'n' && e.ctrlKey) {
                e.preventDefault();
                newGame();
            } else if (e.key === 'z' && e.ctrlKey) {
                e.preventDefault();
                undoMove();
            } else if (e.key === 'h' && e.ctrlKey) {
                e.preventDefault();
                showHint();
            }
        });

        // Draggable widget
        let isDragging = false;
        let startX, startY, startRight, startBottom;

        fab.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startRight = parseInt(widget.style.right);
            startBottom = parseInt(widget.style.bottom);
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const deltaX = startX - e.clientX;
            const deltaY = startY - e.clientY;
            widget.style.right = Math.max(0, startRight + deltaX) + 'px';
            widget.style.bottom = Math.max(0, startBottom + deltaY) + 'px';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════

    function init() {
        const widget = createWidget();
        setupEventListeners(widget);
        renderBoard();
        renderCaptured();
        renderMoveHistory();
        updateStatus();

        console.log('%c♟️ Chess Master loaded! Click the floating button to play.',
            'color: #7aa2f7; font-weight: bold; font-size: 14px;');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();