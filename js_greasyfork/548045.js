// ==UserScript==
// @name         Battleship AI for Papergames
// @namespace    github.io/longkidkoolstar
// @version      4.1.9
// @description  Advanced AI for Battleship on papergames.io with strategic weapon selection, Bayesian inference, and probability visualization
// @author       longkidkoolstar
// @match        https://papergames.io/*
// @grant        GM.setValue
// @grant        GM.getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548045/Battleship%20AI%20for%20Papergames.user.js
// @updateURL https://update.greasyfork.org/scripts/548045/Battleship%20AI%20for%20Papergames.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Game state variables for probability calculations
    let confirmedHits = []; // Still needed for probability bonuses
    let visualizationEnabled = true; // Toggle for probability visualization
    
    // Auto queue variables
    let isAutoQueueOn = false;
    let autoQueueToggleButton = null;
    
    // Ship tracking system
    let remainingShips = [5, 4, 3, 3, 2]; // Standard Battleship ships: Carrier, Battleship, Cruiser, Submarine, Destroyer
    let sunkShips = [];
    let totalHitsOnBoard = 0;
    let totalSunkCells = 0;
    
    // Weapon system variables
    let availableWeapons = {
        default: true,
        missile: 0,
        fragmentBomb: 0,
        nuclearBomb: 0
    };

    // Weapon detection system
    function detectAvailableWeapons() {
        const weaponButtons = document.querySelectorAll('.weapon-button');
        console.log(`Found ${weaponButtons.length} weapon buttons`);
        
        availableWeapons = {
            default: true,
            missile: 0,
            fragmentBomb: 0,
            nuclearBomb: 0
        };
        
        weaponButtons.forEach((button, index) => {
            const img = button.querySelector('img');
            const badge = button.querySelector('.badge');
            const isDisabled = button.hasAttribute('disabled');
            
            console.log(`Button ${index}: img=${!!img}, badge=${!!badge}, disabled=${isDisabled}`);
            
            if (img && badge) {
                const weaponType = img.getAttribute('alt');
                const count = parseInt(badge.textContent) || 0;
                
                console.log(`  Weapon type: ${weaponType}, count: ${count}, badge text: '${badge.textContent}'`);
                
                switch(weaponType) {
                    case 'missile':
                        availableWeapons.missile = isDisabled ? 0 : count;
                        console.log(`  Set missile count to: ${availableWeapons.missile}`);
                        break;
                    case 'fragment-bomb':
                        availableWeapons.fragmentBomb = isDisabled ? 0 : count;
                        break;
                    case 'nuclear-bomb':
                        availableWeapons.nuclearBomb = isDisabled ? 0 : count;
                        break;
                    case 'default':
                        availableWeapons.default = true;
                        break;
                }
            } else {
                console.log(`  Button ${index} missing img or badge`);
            }
        });
        
        console.log('Final available weapons:', availableWeapons);
        return availableWeapons;
    }
    
    // Strategic weapon selection system
    function selectOptimalWeapon(targetRow, targetCol, board, probabilityScores) {
        detectAvailableWeapons();
        
        const gameProgress = (totalSunkCells + totalHitsOnBoard) / 17;
        const hasConfirmedHits = confirmedHits.length > 0;
        
        console.log(`=== WEAPON SELECTION DEBUG ===`);
        console.log(`Target: [${targetRow},${targetCol}], Game Progress: ${gameProgress.toFixed(2)}, Has Hits: ${hasConfirmedHits}`);
        console.log(`Available weapons:`, availableWeapons);
        
        // Nuclear bomb strategy - maximum area coverage
        if (availableWeapons.nuclearBomb > 0) {
            console.log(`Checking nuclear bomb...`);
            if (shouldUseNuclearBomb(targetRow, targetCol, board, probabilityScores, gameProgress)) {
                console.log(`NUCLEAR BOMB SELECTED!`);
                return 'nuclear-bomb';
            }
        }
        
        // Fragment bomb strategy - high probability clusters
        if (availableWeapons.fragmentBomb > 0) {
            console.log(`Checking fragment bomb...`);
            if (shouldUseFragmentBomb(targetRow, targetCol, board, probabilityScores, gameProgress)) {
                console.log(`FRAGMENT BOMB SELECTED!`);
                return 'fragment-bomb';
            }
        }
        
        // Missile strategy - confirmed hits and surrounding area
        if (availableWeapons.missile > 0) {
            console.log(`Checking missile (count: ${availableWeapons.missile})...`);
            if (shouldUseMissile(targetRow, targetCol, board, hasConfirmedHits, gameProgress)) {
                console.log(`MISSILE SELECTED!`);
                return 'missile';
            } else {
                console.log(`Missile not selected - conditions not met`);
            }
        } else {
            console.log(`No missiles available (count: ${availableWeapons.missile})`);
        }
        
        // Default to single shot
        console.log(`Defaulting to single shot`);
        return 'default';
    }
    
    // Nuclear bomb strategy: 3x3 area with corners
    function shouldUseNuclearBomb(targetRow, targetCol, board, probabilityScores, gameProgress) {
        // Early game: use only for maximum coverage in completely unexplored areas
        if (gameProgress < 0.2) {
            const coverageScore = calculateNuclearCoverage(targetRow, targetCol, board);
            return coverageScore >= 8; // At least 8 unknown cells in pattern (nearly full coverage)
        }
        
        // Mid-late game: use only when extremely high probability cluster detected
        if (gameProgress >= 0.2) {
            const clusterScore = calculateClusterProbability(targetRow, targetCol, probabilityScores, 'nuclear');
            return clusterScore >= 20; // Very high combined probability in nuclear pattern
        }
        
        return false;
    }
    
    // Fragment bomb strategy: 4 hits in cross pattern
    function shouldUseFragmentBomb(targetRow, targetCol, board, probabilityScores, gameProgress) {
        // Best for confirmed hits to clear surrounding area efficiently
        if (confirmedHits.length > 0) {
            const nearHit = isNearConfirmedHit(targetRow, targetCol, 1); // More precise targeting
            if (nearHit) {
                const coverageScore = calculateFragmentCoverage(targetRow, targetCol, board);
                return coverageScore >= 4; // Require full coverage for efficiency
            }
        }
        
        // High probability cross pattern - more restrictive
        const clusterScore = calculateClusterProbability(targetRow, targetCol, probabilityScores, 'fragment');
        return clusterScore >= 16; // Higher threshold for probability-based usage
    }
    
    // Missile strategy: 5 hits in plus pattern
    function shouldUseMissile(targetRow, targetCol, board, hasConfirmedHits, gameProgress) {
        const coverageScore = calculateMissileCoverage(targetRow, targetCol, board);
        console.log(`Missile evaluation at [${targetRow},${targetCol}]: coverage=${coverageScore}, hasHits=${hasConfirmedHits}, progress=${gameProgress.toFixed(2)}`);
        
        // Perfect for finishing off damaged ships
        if (hasConfirmedHits) {
            const nearHit = isNearConfirmedHit(targetRow, targetCol, 1);
            if (nearHit && coverageScore >= 3) {
                console.log(`Missile selected: Near confirmed hit with coverage ${coverageScore}`);
                return true; // Use missile near hits with good coverage
            }
        }
        
        // Early game exploration with excellent coverage
        if (gameProgress < 0.4 && coverageScore >= 4) {
            console.log(`Missile selected: Early game exploration with coverage ${coverageScore}`);
            return true; // Use missiles for early exploration with full coverage
        }
        
        // Question mark targeting: missiles are effective for question marks
        const centerCell = getCellByCoordinates(targetRow, targetCol);
        if (centerCell && hasQuestionMark(centerCell) && coverageScore >= 3) {
            console.log(`Missile selected: Question mark targeting with coverage ${coverageScore}`);
            return true; // Use missile on question marks with good coverage
        }
        
        // High value areas: use missiles when they provide maximum benefit
        if (coverageScore >= 5) {
            console.log(`Missile selected: Maximum coverage area with coverage ${coverageScore}`);
            return true; // Only use missiles when they can hit all 5 cells
        }
        
        return false;
    }
    
    // Helper functions for weapon coverage calculations
    function calculateNuclearCoverage(row, col, board) {
        // Nuclear bomb pattern: center + 4 adjacent + 4 corners
        const positions = [
            [row, col], // center
            [row-1, col], [row+1, col], [row, col-1], [row, col+1], // adjacent
            [row-1, col-1], [row-1, col+1], [row+1, col-1], [row+1, col+1] // corners
        ];
        
        return positions.filter(([r, c]) => 
            r >= 0 && r < 10 && c >= 0 && c < 10 && 
            (board[r][c] === 'available' || board[r][c] === 'question')
        ).length;
    }
    
    function calculateFragmentCoverage(row, col, board) {
        // Fragment bomb pattern: center + 3 bombs above
        const positions = [
            [row, col], // center
            [row-1, col], [row-2, col], [row-3, col] // 3 above
        ];
        
        return positions.filter(([r, c]) => 
            r >= 0 && r < 10 && c >= 0 && c < 10 && 
            (board[r][c] === 'available' || board[r][c] === 'question')
        ).length;
    }
    
    function calculateMissileCoverage(row, col, board) {
        // Missile pattern: center + 4 adjacent (plus shape)
        const positions = [
            [row, col], // center
            [row-1, col], [row+1, col], [row, col-1], [row, col+1] // adjacent
        ];
        
        console.log(`=== MISSILE COVERAGE DEBUG at [${row},${col}] ===`);
        positions.forEach(([r, c]) => {
            if (r >= 0 && r < 10 && c >= 0 && c < 10) {
                console.log(`  Position [${r},${c}]: ${board[r][c]}`);
            } else {
                console.log(`  Position [${r},${c}]: out of bounds`);
            }
        });
        
        const validTargets = positions.filter(([r, c]) => 
            r >= 0 && r < 10 && c >= 0 && c < 10 && 
            (board[r][c] === 'available' || board[r][c] === 'question')
        );
        
        console.log(`  Valid targets: ${validTargets.length}`);
        return validTargets.length;
    }
    
    function calculateClusterProbability(row, col, probabilityScores, weaponType) {
        let positions = [];
        
        switch(weaponType) {
            case 'nuclear':
                positions = [
                    [row, col], [row-1, col], [row+1, col], [row, col-1], [row, col+1],
                    [row-1, col-1], [row-1, col+1], [row+1, col-1], [row+1, col+1]
                ];
                break;
            case 'fragment':
                positions = [[row, col], [row-1, col], [row-2, col], [row-3, col]];
                break;
            case 'missile':
                positions = [[row, col], [row-1, col], [row+1, col], [row, col-1], [row, col+1]];
                break;
        }
        
        return positions.reduce((total, [r, c]) => {
            if (r >= 0 && r < 10 && c >= 0 && c < 10 && probabilityScores[r] && probabilityScores[r][c]) {
                return total + probabilityScores[r][c];
            }
            return total;
        }, 0);
    }
    
    function isNearConfirmedHit(row, col, maxDistance) {
        return confirmedHits.some(hit => {
            const distance = Math.abs(hit.row - row) + Math.abs(hit.col - col);
            return distance <= maxDistance;
        });
    }
    
    // Weapon execution system
    function selectAndUseWeapon(weaponType) {
        console.log(`=== WEAPON EXECUTION DEBUG ===`);
        console.log(`Attempting to select weapon: ${weaponType}`);
        
        const weaponButtons = document.querySelectorAll('.weapon-button');
        console.log(`Found ${weaponButtons.length} weapon buttons for selection`);
        
        let weaponFound = false;
        let weaponSelected = false;
        
        weaponButtons.forEach((button, index) => {
            const img = button.querySelector('img');
            if (img) {
                const currentWeapon = img.getAttribute('alt');
                console.log(`Button ${index}: weapon type = ${currentWeapon}`);
                
                // Remove current selection
                button.classList.remove('is-selected');
                
                // Select the desired weapon
                if (currentWeapon === weaponType) {
                    weaponFound = true;
                    button.classList.add('is-selected');
                    button.click();
                    console.log(`Successfully selected weapon: ${weaponType}`);
                    weaponSelected = true;
                    return true;
                }
            } else {
                console.log(`Button ${index}: no img found`);
            }
        });
        
        if (!weaponFound) {
            console.log(`ERROR: Weapon type '${weaponType}' not found in available buttons`);
        }
        
        return weaponSelected;
    }
    
    // Helper function to get cell coordinates
    function getCellCoordinates(cellElement) {
        // First try data attributes
        let row = parseInt(cellElement.getAttribute('data-row'));
        let col = parseInt(cellElement.getAttribute('data-col'));
        
        // If data attributes don't exist, try class name pattern
        if (isNaN(row) || isNaN(col)) {
            const classNames = cellElement.className.match(/cell-(\d+)-(\d+)/);
            if (classNames && classNames.length >= 3) {
                row = parseInt(classNames[1]);
                col = parseInt(classNames[2]);
            } else {
                // Fallback: try extracting from any numeric classes
                const numbers = cellElement.className.match(/\d+/g);
                if (numbers && numbers.length >= 2) {
                    row = parseInt(numbers[0]);
                    col = parseInt(numbers[1]);
                }
            }
        }
        
        return [row || 0, col || 0];
    }
    
    // Enhanced function to analyze the current board state for probability calculations
    function analyzeBoardState() {
        const board = Array(10).fill().map(() => Array(10).fill('unknown'));
        let hitCount = 0;
        let missCount = 0;
        let destroyedCount = 0;
        let availableCount = 0;

        // Specifically analyze the opponent's board
        const opponentBoard = document.querySelector('.opponent app-battleship-board table');
        if (!opponentBoard) {
            console.log('Warning: Cannot find opponent board for analysis');
            return board;
        }

        opponentBoard.querySelectorAll('td[class*="cell-"]').forEach(cell => {
            const [row, col] = cell.className.match(/\d+/g).map(Number);

            // Check for previously tried cell (miss)
            if (cell.querySelector('svg.intersection.no-hit')) {
                board[row][col] = 'miss';
                missCount++;
            }
            // Check for hit
            else if (cell.querySelector('.hit.fire')) {
                board[row][col] = 'hit';
                hitCount++;
            }
            // Check for destroyed ship
            else if (cell.querySelector('.magictime.opacityIn.ship-cell.circle-dark')) {
                board[row][col] = 'destroyed';
                destroyedCount++;
            }
            // Normal untried cell
            else if (cell.querySelector('svg.intersection:not(.no-hit)')) {
                board[row][col] = 'available';
                availableCount++;
            }
        });

        // Log board analysis for debugging
        console.log(`Board Analysis - Hits: ${hitCount}, Misses: ${missCount}, Destroyed: ${destroyedCount}, Available: ${availableCount}`);
        
        return board;
    }

    // Enhanced function to get all available cells with probability-based scoring
    function getAvailableCells() {
        const cells = [];
        const board = analyzeBoardState();
        let questionMarkCount = 0;

        // Specifically target the opponent's board
        const opponentBoard = document.querySelector('.opponent app-battleship-board table');
        if (!opponentBoard) {
            console.log('Error: Cannot find opponent board for cell analysis');
            return [];
        }

        opponentBoard.querySelectorAll('td[class*="cell-"]').forEach(cell => {
            // Consider both regular untried cells and question mark cells
            const isRegularCell = cell.classList.contains('null') && cell.querySelector('svg.intersection:not(.no-hit)');
            const isQuestionMark = hasQuestionMark(cell);
            
            if (isRegularCell || isQuestionMark) {
                const [row, col] = cell.className.match(/\d+/g).map(Number);
                let score = calculateProbabilityScore(row, col, board);
                
                if (isQuestionMark) {
                    questionMarkCount++;
                    console.log(`Question mark found at [${row},${col}] with score: ${score}`);
                }
                
                cells.push({ cell, score, row, col, isQuestionMark });
            }
        });

        // Sort cells by probability score (highest first)
        const sortedCells = cells.sort((a, b) => b.score - a.score);
        
        // Log top candidates for debugging
        console.log(`Found ${cells.length} available cells (${questionMarkCount} question marks)`);
        if (sortedCells.length > 0) {
            const topCells = sortedCells.slice(0, 3);
            console.log('Top 3 probability targets:', topCells.map(c => `[${c.row},${c.col}]:${c.score.toFixed(1)}${c.isQuestionMark ? '(?)' : ''}`).join(', '));
        }
        
        // Update probability visualization
        updateProbabilityVisualization(board);
        
        return sortedCells.map(item => item.cell);
    }

    // Function to create and update probability visualization overlay
    function updateProbabilityVisualization(board) {
        const opponentBoard = document.querySelector('.opponent app-battleship-board table');
        if (!opponentBoard || !visualizationEnabled) return;

        // Remove existing probability overlays
        document.querySelectorAll('.probability-overlay').forEach(overlay => overlay.remove());

        let maxScore = 0;
        const cellScores = [];

        // Calculate scores for all cells and find maximum
        opponentBoard.querySelectorAll('td[class*="cell-"]').forEach(cell => {
            const [row, col] = cell.className.match(/\d+/g).map(Number);
            const score = calculateProbabilityScore(row, col, board);
            cellScores.push({ cell, score, row, col });
            if (score > maxScore) maxScore = score;
        });

        // Create probability overlays for each cell
        cellScores.forEach(({ cell, score, row, col }) => {
            // Skip cells that are already hit, missed, or destroyed
            if (score === 0) return;

            const overlay = document.createElement('div');
            overlay.className = 'probability-overlay';
            overlay.style.cssText = `
                position: absolute;
                bottom: 2px;
                right: 2px;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                font-size: 10px;
                font-weight: bold;
                padding: 1px 3px;
                border-radius: 3px;
                pointer-events: none;
                z-index: 1000;
                font-family: monospace;
            `;
            
            // Color code based on probability (green = high, yellow = medium, red = low)
            const intensity = maxScore > 0 ? score / maxScore : 0;
            if (intensity > 0.7) {
                overlay.style.background = 'rgba(0, 150, 0, 0.8)';
            } else if (intensity > 0.4) {
                overlay.style.background = 'rgba(200, 150, 0, 0.8)';
            } else {
                overlay.style.background = 'rgba(150, 0, 0, 0.8)';
            }
            
            overlay.textContent = score.toFixed(1);
            
            // Position the overlay relative to the cell
            cell.style.position = 'relative';
            cell.appendChild(overlay);
        });

        console.log(`Probability visualization updated. Max score: ${maxScore.toFixed(1)}`);
    }

    // Ship sizes in standard Battleship
    const SHIP_SIZES = [5, 4, 3, 3, 2]; // Carrier, Battleship, Cruiser, Submarine, Destroyer
    
    // Function to update ship tracking based on board analysis
    function updateShipTracking(board) {
        let currentHits = 0;
        let currentSunk = 0;
        
        // Count current hits and sunk cells
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
                if (board[row][col] === 'hit') currentHits++;
                if (board[row][col] === 'destroyed') currentSunk++;
            }
        }
        
        // If sunk cells increased, a ship was destroyed
        if (currentSunk > totalSunkCells) {
            const newSunkCells = currentSunk - totalSunkCells;
            
            // Try to determine which ship was sunk based on size
            // Find the largest remaining ship that matches the sunk size
            for (let i = 0; i < remainingShips.length; i++) {
                if (remainingShips[i] === newSunkCells) {
                    sunkShips.push(remainingShips[i]);
                    remainingShips.splice(i, 1);
                    console.log(`Ship of size ${newSunkCells} sunk! Remaining ships:`, remainingShips);
                    break;
                }
            }
            
            totalSunkCells = currentSunk;
            confirmedHits = []; // Clear hits when ship is sunk
        }
        
        totalHitsOnBoard = currentHits;
        
        return {
            remainingShips: remainingShips.slice(),
            sunkShips: sunkShips.slice(),
            totalHits: currentHits,
            totalSunk: currentSunk
        };
    }
    
    // Enhanced probability calculation based on ship placement possibilities and density
    function calculateProbabilityScore(row, col, board) {
        let totalProbability = 0;
        let densityBonus = 0;
        
        // Update ship tracking first
        const shipInfo = updateShipTracking(board);
        
        // Only calculate probabilities for remaining ships
        remainingShips.forEach(shipSize => {
            let shipPlacements = 0;
            
            // Check horizontal placements
            for (let startCol = Math.max(0, col - shipSize + 1); startCol <= Math.min(9, col); startCol++) {
                if (startCol + shipSize <= 10) {
                    if (canPlaceShip(row, startCol, shipSize, 'horizontal', board)) {
                        shipPlacements += 1;
                    }
                }
            }
            
            // Check vertical placements
            for (let startRow = Math.max(0, row - shipSize + 1); startRow <= Math.min(9, row); startRow++) {
                if (startRow + shipSize <= 10) {
                    if (canPlaceShip(startRow, col, shipSize, 'vertical', board)) {
                        shipPlacements += 1;
                    }
                }
            }
            
            // Weight larger ships more heavily as they're harder to place
        // Apply Bayesian inference - adjust probability based on game state
        const bayesianWeight = calculateBayesianWeight(shipSize, shipPlacements, board);
        totalProbability += shipPlacements * bayesianWeight;
        });
        
        // Calculate density bonus - cells in areas with more possible ship placements
        const surroundingPositions = [
            [row-2, col], [row-1, col-1], [row-1, col], [row-1, col+1],
            [row, col-2], [row, col-1], [row, col+1], [row, col+2],
            [row+1, col-1], [row+1, col], [row+1, col+1], [row+2, col]
        ];
        
        surroundingPositions.forEach(([r, c]) => {
            if (r >= 0 && r < 10 && c >= 0 && c < 10) {
                if (board[r] && (board[r][c] === 'unknown' || board[r][c] === 'available')) {
                    densityBonus += 0.5; // Small bonus for each available nearby cell
                }
            }
        });
        
        // Bonus for cells adjacent to confirmed hits (but not already hit)
        const adjacentCells = [
            [row-1, col], [row+1, col], [row, col-1], [row, col+1]
        ];
        
        let hitBonus = 0;
        adjacentCells.forEach(([r, c]) => {
            if (r >= 0 && r < 10 && c >= 0 && c < 10) {
                if (board[r] && board[r][c] === 'hit') {
                    hitBonus += 100; // Very large bonus for adjacent cells
                }
            }
        });
        
        // Add bonus for cells 2 away from hits (potential ship continuation)
        const nearbyPositions = [
            [row-2, col], [row+2, col], [row, col-2], [row, col+2]
        ];
        
        nearbyPositions.forEach(([r, c]) => {
            if (r >= 0 && r < 10 && c >= 0 && c < 10) {
                if (board[r] && board[r][c] === 'hit') {
                    hitBonus += 20; // Smaller bonus for cells 2 away
                }
            }
        });
        
        // Check if this cell has a question mark and add bonus score
        const cell = getCellByCoordinates(row, col);
        if (cell && hasQuestionMark(cell)) {
            const qmValue = evaluateQuestionMarkValue(cell);
            console.log(`Question mark detected at [${row},${col}] - qmValue: ${qmValue}, adding bonus: ${qmValue * 2 + 25}`);
            totalProbability += qmValue * 2; // Double the question mark value
            totalProbability += 25; // Additional base bonus for question marks to ensure higher priority
        }
        
        // Add parity bonus for hunt mode (checkerboard pattern)
        // This is most effective when no ships have been hit yet
        if (totalHitsOnBoard === 0 && remainingShips.length === 5) {
            // Use parity pattern - prefer cells where (row + col) % 2 === 0
            // This ensures we hit every ship of size 2 or larger
            if ((row + col) % 2 === 0) {
                totalProbability += 10; // Significant bonus for parity cells
            }
        }
        
        // Endgame optimization - when few ships remain, be more aggressive
        const endgameBonus = calculateEndgameBonus(row, col, board);
        
        return totalProbability + hitBonus + densityBonus + endgameBonus;
    }
    
    // Endgame optimization function
    function calculateEndgameBonus(row, col, board) {
        let bonus = 0;
        const remainingShipCount = remainingShips.length;
        const smallestShip = remainingShips.length > 0 ? Math.min(...remainingShips) : 2;
        
        // When only 1-2 ships remain, focus on isolated areas
        if (remainingShipCount <= 2) {
            // Check if this cell is in an isolated area (good for finding last ships)
            let isolationScore = 0;
            const checkRadius = 2;
            
            for (let r = row - checkRadius; r <= row + checkRadius; r++) {
                for (let c = col - checkRadius; c <= col + checkRadius; c++) {
                    if (r >= 0 && r < 10 && c >= 0 && c < 10 && board[r] && board[r][c]) {
                        if (board[r][c] === 'available' || board[r][c] === 'unknown') {
                            isolationScore++;
                        }
                    }
                }
            }
            
            // Prefer areas with more available cells (potential ship hiding spots)
            bonus += isolationScore * 2;
        }
        
        // When only the smallest ships remain, use different parity
        if (remainingShipCount <= 3 && smallestShip === 2) {
            // For destroyer hunting, any parity works, but prefer corners and edges
            if (row === 0 || row === 9 || col === 0 || col === 9) {
                bonus += 5; // Edge bonus
            }
            if ((row === 0 || row === 9) && (col === 0 || col === 9)) {
                bonus += 3; // Corner bonus
            }
        }
        
        // When many ships are sunk, increase aggression in unexplored areas
        if (sunkShips.length >= 3) {
            // Count nearby misses - avoid areas with many misses
            let nearbyMisses = 0;
            for (let r = row - 1; r <= row + 1; r++) {
                for (let c = col - 1; c <= col + 1; c++) {
                    if (r >= 0 && r < 10 && c >= 0 && c < 10 && board[r] && board[r][c] === 'miss') {
                        nearbyMisses++;
                    }
                }
            }
            
            // Penalize cells near many misses
            bonus -= nearbyMisses * 3;
        }
        
        return bonus;
    }
    
    // Bayesian inference for probability weighting
    function calculateBayesianWeight(shipSize, shipPlacements, board) {
        let baseWeight = shipSize / 3; // Original weighting
        
        // Prior probability adjustments based on ship size
        const shipSizeMultiplier = {
            5: 1.5, // Carrier is hardest to place
            4: 1.3, // Battleship
            3: 1.1, // Cruiser/Submarine
            2: 0.9  // Destroyer is easiest to place
        };
        
        baseWeight *= (shipSizeMultiplier[shipSize] || 1.0);
        
        // Likelihood adjustments based on current board state
        const gameProgress = (totalSunkCells + totalHitsOnBoard) / 17; // Total ship cells = 17
        
        // Early game: prefer larger ships (they're more likely to be hit first)
        if (gameProgress < 0.3) {
            if (shipSize >= 4) {
                baseWeight *= 1.2;
            }
        }
        // Mid game: balanced approach
        else if (gameProgress < 0.7) {
            baseWeight *= 1.0; // No adjustment
        }
        // Late game: focus on remaining ships
        else {
            // If this is one of the few remaining ships, increase its weight
            if (remainingShips.includes(shipSize)) {
                const rarityBonus = 5.0 / remainingShips.length; // More rare = higher weight
                baseWeight *= (1.0 + rarityBonus);
            }
        }
        
        // Posterior probability: adjust based on observed hit patterns
        if (totalHitsOnBoard > 0) {
            // If we have hits, ships near hits are more likely
            // This is handled in the hit bonus, but we can adjust the base weight too
            if (shipPlacements > 0) {
                baseWeight *= 1.1; // Small bonus for ships that can be placed
            }
        }
        
        // Constraint satisfaction: heavily penalize impossible placements
        if (shipPlacements === 0) {
            return 0; // Impossible placement
        }
        
        return baseWeight;
    }
    
    // Enhanced function to check if a ship can be placed at a specific position with pattern recognition
    function canPlaceShip(startRow, startCol, shipSize, orientation, board) {
        // First check basic placement validity
        for (let i = 0; i < shipSize; i++) {
            const checkRow = orientation === 'vertical' ? startRow + i : startRow;
            const checkCol = orientation === 'horizontal' ? startCol + i : startCol;
            
            // Check bounds
            if (checkRow < 0 || checkRow >= 10 || checkCol < 0 || checkCol >= 10) {
                return false;
            }
            
            // Check if cell is already hit, missed, or destroyed
            if (board[checkRow] && (board[checkRow][checkCol] === 'miss' || board[checkRow][checkCol] === 'destroyed')) {
                return false;
            }
        }
        
        // Advanced pattern recognition: Check ship spacing constraints
        // Most Battleship variants don't allow ships to touch each other
        for (let i = 0; i < shipSize; i++) {
            const shipRow = orientation === 'vertical' ? startRow + i : startRow;
            const shipCol = orientation === 'horizontal' ? startCol + i : startCol;
            
            // Check all 8 adjacent cells for destroyed ships (diagonal touching rule)
            const adjacentPositions = [
                [shipRow-1, shipCol-1], [shipRow-1, shipCol], [shipRow-1, shipCol+1],
                [shipRow, shipCol-1],                          [shipRow, shipCol+1],
                [shipRow+1, shipCol-1], [shipRow+1, shipCol], [shipRow+1, shipCol+1]
            ];
            
            for (const [adjRow, adjCol] of adjacentPositions) {
                if (adjRow >= 0 && adjRow < 10 && adjCol >= 0 && adjCol < 10) {
                    if (board[adjRow] && board[adjRow][adjCol] === 'destroyed') {
                        // Check if this destroyed cell could be part of our current ship
                        let isPartOfCurrentShip = false;
                        for (let j = 0; j < shipSize; j++) {
                            const currentShipRow = orientation === 'vertical' ? startRow + j : startRow;
                            const currentShipCol = orientation === 'horizontal' ? startCol + j : startCol;
                            if (adjRow === currentShipRow && adjCol === currentShipCol) {
                                isPartOfCurrentShip = true;
                                break;
                            }
                        }
                        
                        // If it's not part of our ship, this placement violates spacing rules
                        if (!isPartOfCurrentShip) {
                            return false;
                        }
                    }
                }
            }
        }
        
        // Check for consistency with existing hits
        // If there are hits that should be part of this ship, ensure they align
        let hitsInShip = 0;
        for (let i = 0; i < shipSize; i++) {
            const checkRow = orientation === 'vertical' ? startRow + i : startRow;
            const checkCol = orientation === 'horizontal' ? startCol + i : startCol;
            
            if (board[checkRow] && board[checkRow][checkCol] === 'hit') {
                hitsInShip++;
            }
        }
        
        // If this ship placement would include hits, it's more likely to be correct
        // This is handled in the probability calculation as a bonus
        
        return true;
    }



// Simplified handleAttackResult for probability-based system
function handleAttackResult(cell) {
    // Extract row and column from cell class name
    const [row, col] = getCellCoordinates(cell);

    // Check if this was a question mark that got resolved
    const wasQuestionMark = hasQuestionMark(cell);
    
    // Check for hit (including fire hit and skull hit)
    if (cell.querySelector('.hit.fire') || isHitWithSkull(cell)) {
        const hitCoord = {
            row: row,
            col: col
        };
        confirmedHits.push(hitCoord);
        console.log('Confirmed hit at:', hitCoord);
        
        if (wasQuestionMark) {
            console.log(`Question mark at [${row},${col}] resolved to HIT`);
        }
    } 
    // Check for miss (including no-hit intersection)
    else if (cell.querySelector('.miss') || cell.querySelector('svg.intersection.no-hit')) {
        console.log('Miss on cell:', getCellCoordinates(cell));
        
        if (wasQuestionMark) {
            console.log(`Question mark at [${row},${col}] resolved to MISS`);
        }
    }
    // If it's still a question mark after clicking, log this for debugging
    else if (wasQuestionMark) {
        console.log(`Question mark at [${row},${col}] was clicked but still appears as question mark`);
    }

    // Check if ship was sunk and clear hits if so
    if (cell.querySelector('.magictime.opacityIn.ship-cell.circle-dark')) {
        console.log('Ship sunk! Removing sunk ship hits from confirmed hits.');
        confirmedHits = [];
    }
}

// Function to get adjacent cells with optional radius for probability calculations
function getAdjacentCells(cell, radius = 1) {
    const [row, col] = getCellCoordinates(cell);
    let adjacentCells = [];

    if (radius === 1) {
        // Standard adjacent cells (up, down, left, right)
        adjacentCells.push(
            getCellByCoordinates(row-1, col),
            getCellByCoordinates(row+1, col),
            getCellByCoordinates(row, col-1),
            getCellByCoordinates(row, col+1)
        );
    } else {
        // For larger radius, get all cells within the specified distance
        for (let dRow = -radius; dRow <= radius; dRow++) {
            for (let dCol = -radius; dCol <= radius; dCol++) {
                if (dRow === 0 && dCol === 0) continue; // Skip the center cell
                
                const newRow = row + dRow;
                const newCol = col + dCol;

                // Check if the new position is within bounds
                if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10) {
                    const adjacentCell = getCellByCoordinates(newRow, newCol);
                    if (adjacentCell) {
                        adjacentCells.push(adjacentCell);
                    }
                }
            }
        }
    }

    // Filter out null cells and already attacked cells, but include question marks
    return adjacentCells.filter(cell => {
        if (!cell) return false;
        
        // Include question mark cells as valid targets
        if (hasQuestionMark(cell)) {
            return true;
        }
        
        // Include regular null cells that haven't been attacked
        return cell.classList.contains('null') && cell.querySelector('svg.intersection:not(.no-hit)');
    });
}

// Function to determine orientation based on confirmed hits
function determineOrientation(hitsToCheck) {
    // If no hits are provided, use the confirmed hits
    if (!hitsToCheck) {
        hitsToCheck = confirmedHits.slice();
    }

    // Need at least 2 hits to determine orientation
    if (!hitsToCheck || hitsToCheck.length < 2) {
        console.log('Not enough hits to determine orientation');
        return null;
    }

    // Create copies of the arrays to avoid modifying the original
    const sortedByRow = [...hitsToCheck].sort((a, b) => a.row - b.row);
    const sortedByCol = [...hitsToCheck].sort((a, b) => a.col - b.col);

    // Check if all hits are in the same column (vertical orientation)
    let sameColumn = true;
    for (let i = 1; i < sortedByCol.length; i++) {
        if (sortedByCol[i].col !== sortedByCol[0].col) {
            sameColumn = false;
            break;
        }
    }

    // Check if all hits are in the same row (horizontal orientation)
    let sameRow = true;
    for (let i = 1; i < sortedByRow.length; i++) {
        if (sortedByRow[i].row !== sortedByRow[0].row) {
            sameRow = false;
            break;
        }
    }

    if (sameColumn) {
        console.log('Determined vertical orientation');
        return 'vertical';
    }
    if (sameRow) {
        console.log('Determined horizontal orientation');
        return 'horizontal';
    }

    console.log('Could not determine orientation');
    return null;
}

    // Function to simulate a click on a cell and handle results
    function attackCell(cell) {
        if (cell) {
            cell.click();  // Simulate clicking the cell
            console.log('Attacked cell:', cell);
            
            // After attack, check if it was a hit
            setTimeout(() => handleAttackResult(cell), 1000);  // Slight delay to allow DOM to update
        }
    }

    let lastAttackTime = 0; // Track the last attack time

    // Function to check if a cell is a confirmed hit with skull
    function isHitWithSkull(cell) {
        return cell.querySelector('.hit.skull') !== null;
    }

    // Function to check if a cell has a question mark
    function hasQuestionMark(cell) {
        // First check if the cell has been resolved to a hit or miss
        const isHit = cell.querySelector('.hit.fire') || cell.querySelector('.hit.skull');
        const isMiss = cell.querySelector('.miss') || cell.querySelector('svg.intersection.no-hit');
        const isDestroyed = cell.querySelector('.magictime.opacityIn.ship-cell.circle-dark');
        
        // If the cell has been resolved, it's no longer a question mark
        if (isHit || isMiss || isDestroyed) {
            return false;
        }
        
        const hasGift = cell.querySelector('.gift.animated.tin-in') !== null;
        const hasGiftTaken = cell.querySelector('.gift-taken') !== null;
        const result = hasGift || hasGiftTaken;
        
        if (result) {
            const [row, col] = getCellCoordinates(cell);
            console.log(`Question mark found at [${row},${col}] - hasGift: ${hasGift}, hasGiftTaken: ${hasGiftTaken}`);
        }
        
        return result;
    }

    // Function to evaluate the strategic value of a question mark
    function evaluateQuestionMarkValue(cell) {
        if (!hasQuestionMark(cell)) return 0;

        const [row, col] = getCellCoordinates(cell);
        let value = 5; // Base value for question marks

        // Check surrounding cells for hits or misses to determine strategic value
        const surroundingCells = getSurroundingCells(row, col);
        let hitCount = 0;
        let missCount = 0;

        surroundingCells.forEach(coords => {
            const surroundingCell = getCellByCoordinates(coords.row, coords.col);
            if (surroundingCell) {
                if (isHitWithSkull(surroundingCell)) {
                    hitCount++;
                    value += 3; // Increase value if near a hit
                } else if (surroundingCell.querySelector('.miss')) {
                    missCount++;
                    value -= 1; // Decrease value if near a miss
                }
            }
        });

        // If the question mark is surrounded by many misses, it's less valuable
        if (missCount > 2) value -= 3;

        // If the question mark is near hits, it's more valuable
        if (hitCount > 0) value += hitCount * 2;

        // Check if the question mark is in a strategic position (center or edges)
        if ((row > 2 && row < 7) && (col > 2 && col < 7)) {
            value += 2; // Center positions are more valuable
        }

        // Check if the question mark is aligned with confirmed hits
        if (confirmedHits.length >= 2) {
            const shipOrientation = determineOrientation(confirmedHits);
            let isAligned = false;

            if (shipOrientation && shipOrientation === 'horizontal') {
                // Check if question mark is in the same row as any confirmed hit
                for (const hit of confirmedHits) {
                    if (hit.row === row) {
                        isAligned = true;
                        break;
                    }
                }
            } else if (shipOrientation && shipOrientation === 'vertical') {
                // Check if question mark is in the same column as any confirmed hit
                for (const hit of confirmedHits) {
                    if (hit.col === col) {
                        isAligned = true;
                        break;
                    }
                }
            }

            // If aligned with confirmed hits, give it a significant bonus
            if (isAligned) {
                value += 8;
                console.log(`Question mark at [${row},${col}] is aligned with ship orientation, adding bonus value`);
            }
        }

        return value;
    }

    // Helper function to get cell coordinates (removed duplicate - using the one above that checks data attributes first)

    // Helper function to get surrounding cells (8 directions)
    function getSurroundingCells(row, col) {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];

        return directions.map(([dx, dy]) => {
            const newRow = row + dx;
            const newCol = col + dy;
            if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10) {
                return { row: newRow, col: newCol };
            }
            return null;
        }).filter(coords => coords !== null);
    }

    // Helper function to get cell by coordinates
    function getCellByCoordinates(row, col) {
        // Find the opponent board first
        const opponentBoard = document.querySelector('.opponent app-battleship-board table');
        if (!opponentBoard) return null;
        
        // Search through all cells to find the one with matching coordinates
        const cells = opponentBoard.querySelectorAll('td[class*="cell-"]');
        for (const cell of cells) {
            const [cellRow, cellCol] = getCellCoordinates(cell);
            if (cellRow === row && cellCol === col) {
                return cell;
            }
        }
        return null;
    }

    // Function to check if the game is in a ready state for an attack
    function isGameReady() {
        let opponentBoard = document.querySelector('.opponent app-battleship-board table');  // Opponent's board ID
        return opponentBoard && !opponentBoard.classList.contains('inactive'); // Adjust the class as per game state
    }

// Function to introduce a delay in milliseconds
function waitForAttack(delay) {
    return new Promise(resolve => setTimeout(resolve, delay));
}


// Adjusted performAttack to add a 2-second delay and check board state
async function performAttack(currentElementValue) {
    const now = Date.now();

    // Check if enough time has passed since the last attack (2 seconds)
    if (now - lastAttackTime < 2000) {
        console.log("Waiting for 2 seconds before the next attack.");
        return;
    }

    // Only perform an attack if the game is ready
    if (!isGameReady()) {
        console.log("Game is not ready. Waiting...");
        return;
    }

    console.log('Performing attack based on current element value:', currentElementValue);

    // Wait 2 seconds before the next attack
    await waitForAttack(2000);

    // Select cell to attack based on hunt or target mode
    let cell = huntMode ? huntModeAttack() : targetModeAttack();
    if (cell) {
        attackCell(cell);
        lastAttackTime = now; // Update the last attack time
    } else {
        console.log("No cell available to attack.");
    }
}


    GM.getValue('username').then(function(username) {
        if (!username) {
            username = prompt('Please enter your Papergames username:');
            GM.setValue('username', username);
        }
    });

// Simplified probability-based attack system
function updateBoard() {
    console.log("=== AI Turn Started ===");
    
    // Update probability visualization first
    const board = analyzeBoardState();
    updateProbabilityVisualization(board);
    
    GM.getValue("username").then(function(username) {
        var profileOpener = [...document.querySelectorAll(".text-truncate.cursor-pointer")].find(
            opener => opener.textContent.trim() === username
        );

        var chronometer = document.querySelector("app-chronometer");
        var numberElement = profileOpener.parentNode ? profileOpener.parentNode.querySelectorAll("span")[4] : null;

        var currentElement = chronometer || numberElement;
        console.log("Current Element:", currentElement);

        // Check for error message first
        checkForErrorAndRefresh();

        // Use pure probability-based targeting
        const bestCell = findBestProbabilityCell();
        if (bestCell) {
            console.log("Selected optimal cell based on probability calculations");
            
            // Get cell coordinates for weapon selection
            const [row, col] = getCellCoordinates(bestCell);
            
            // Build probability scores matrix for weapon selection
            const probabilityScores = {};
            for (let r = 0; r < 10; r++) {
                probabilityScores[r] = {};
                for (let c = 0; c < 10; c++) {
                    probabilityScores[r][c] = calculateProbabilityScore(r, c, board);
                }
            }
            
            // Select optimal weapon before attacking
            const optimalWeapon = selectOptimalWeapon(row, col, board, probabilityScores);
            console.log(`Using weapon: ${optimalWeapon}`);
            
            // Select and use the optimal weapon
            selectAndUseWeapon(optimalWeapon);
            
            // Small delay to ensure weapon selection is processed
            setTimeout(() => {
                attackCell(bestCell);
            }, 100);
            return;
        }

        // Fallback if no cells available
        console.log("No valid cells found to attack!");
        performAttack(currentElement.textContent);
    });
}

// Manual function to refresh probability visualization
function refreshProbabilityVisualization() {
    const board = analyzeBoardState();
    updateProbabilityVisualization(board);
    console.log("Probability visualization manually refreshed");
}

// Expose functions to global scope for manual triggering
window.refreshProbabilityVisualization = refreshProbabilityVisualization;
window.toggleProbabilityVisualization = function() {
    visualizationEnabled = !visualizationEnabled;
    if (visualizationEnabled) {
        console.log('Probability visualization enabled');
        refreshProbabilityVisualization();
    } else {
        console.log('Probability visualization disabled');
        // Remove all existing overlays
        const overlays = document.querySelectorAll('.probability-overlay');
        overlays.forEach(overlay => overlay.remove());
    }
    return visualizationEnabled;
};

// Function to find the cell with the highest probability score
function findBestProbabilityCell() {
    const board = analyzeBoardState();
    const opponentBoard = document.querySelector('.opponent app-battleship-board table');
    if (!opponentBoard) {
        console.log('Cannot find opponent board');
        return null;
    }

    let bestCell = null;
    let bestScore = -1;

    opponentBoard.querySelectorAll('td[class*="cell-"]').forEach(cell => {
        // Only consider cells that haven't been attacked
        if (cell.classList.contains('null') && cell.querySelector('svg.intersection:not(.no-hit)') || hasQuestionMark(cell)) {
            const [row, col] = getCellCoordinates(cell);
            const score = calculateProbabilityScore(row, col, board);
            
            // console.log(`Cell [${row},${col}] probability score: ${score}`);
            
            if (score > bestScore) {
                bestScore = score;
                bestCell = cell;
            }
        }
    });

    console.log(`Best cell found with score: ${bestScore}`);
    return bestCell;
}

// Function to check for error message and refresh if needed
function checkForErrorAndRefresh() {
    const errorToast = document.querySelector('.toast-error .toast-message');
    if (errorToast && errorToast.textContent.includes('The targeted frame is already played')) {
        location.reload();
    }
}
// Legacy functions removed - now using pure probability-based targeting





    // Auto queue functions
    function toggleAutoQueue() {
        // Toggle the state
        isAutoQueueOn = !isAutoQueueOn;
        GM.setValue('isToggled', isAutoQueueOn);

        // Update the button text and style based on the state
        autoQueueToggleButton.textContent = isAutoQueueOn ? 'Auto Queue On' : 'Auto Queue Off';
        autoQueueToggleButton.style.backgroundColor = isAutoQueueOn ? 'green' : 'red';
    }

    function clickLeaveRoomButton() {
        var leaveRoomButton = document.querySelector('span.front.text.btn.btn-light');
        if (leaveRoomButton && leaveRoomButton.textContent.includes('Leave room')) {
            leaveRoomButton.click();
        }
    }

    function clickPlayOnlineButton() {
        var playOnlineButton = document.querySelector('span.front.text.btn.btn-secondary.btn-lg.text-start.juicy-btn-inner');
        if (playOnlineButton) {
            playOnlineButton.click();
        }
    }

    // Periodically check for buttons when the toggle is on
    function checkButtonsPeriodically() {
        if (isAutoQueueOn) {
            clickLeaveRoomButton();
            clickPlayOnlineButton();
        }
    }

    // Create toggle buttons for probability visualization and auto queue
    function createToggleButton() {
        // Check if buttons already exist
        if (document.getElementById('probability-toggle')) return;
        
        // Probability toggle button
        const probButton = document.createElement('button');
        probButton.id = 'probability-toggle';
        probButton.textContent = 'Toggle Probability View';
        probButton.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 10000;
            padding: 8px 12px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;
        
        probButton.addEventListener('click', function() {
            const enabled = window.toggleProbabilityVisualization();
            probButton.style.background = enabled ? '#4CAF50' : '#f44336';
            probButton.textContent = enabled ? 'Hide Probability View' : 'Show Probability View';
        });
        
        // Auto queue toggle button
        autoQueueToggleButton = document.createElement('button');
        autoQueueToggleButton.id = 'auto-queue-toggle';
        autoQueueToggleButton.textContent = 'Auto Queue Off';
        autoQueueToggleButton.style.cssText = `
            position: fixed;
            top: 50px;
            right: 10px;
            z-index: 10000;
            padding: 8px 12px;
            background: red;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;
        
        autoQueueToggleButton.addEventListener('click', toggleAutoQueue);
        
        // Load saved auto queue state
        GM.getValue('isToggled', false).then(function(savedState) {
            isAutoQueueOn = savedState;
            autoQueueToggleButton.textContent = isAutoQueueOn ? 'Auto Queue On' : 'Auto Queue Off';
            autoQueueToggleButton.style.backgroundColor = isAutoQueueOn ? 'green' : 'red';
        });
        
        document.body.appendChild(probButton);
        document.body.appendChild(autoQueueToggleButton);
    }
    
    // Initialize toggle button when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createToggleButton);
    } else {
        createToggleButton();
    }

// Set up periodic checking for auto queue
setInterval(checkButtonsPeriodically, 1000);

// Set interval to update the board regularly
setInterval(updateBoard, 1000); // Check every second
})();
