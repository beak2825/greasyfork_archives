// ==UserScript==
// @name        Single Trees Solver
// @namespace   Violentmonkey Scripts
// @match       https://www.playqueensgame.com/*
// @grant       none
// @version     1.0
// @author      Zach Kosove
// @license     MIT
// @description Solver for Single Trees puzzle
// @downloadURL https://update.greasyfork.org/scripts/551070/Single%20Trees%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/551070/Single%20Trees%20Solver.meta.js
// ==/UserScript==

(function () {
    async function main() {
        console.clear();

        // --- Initialize ---
        function initBoards() {
            const cells = document.querySelectorAll('.grid .aspect-square');
            const N = Math.sqrt(cells.length);
            if (!Number.isInteger(N)) throw new Error(`Board is not square: ${cells.length} cells`);

            // allocate flat buffers
            const boardBuf  = new Array(N * N).fill(null);
            const colorBuf  = new Int16Array(N * N).fill(-1);

            // wrap them into N row views so you can still use [r][c]
            const board  = Array.from({ length: N }, (_, r) => boardBuf.slice(r * N, (r + 1) * N));
            const colors = Array.from({ length: N }, (_, r) => colorBuf.subarray(r * N, (r + 1) * N));

            const map = Object.create(null);
            let count = 0;

            cells.forEach(cell => {
                colors[+cell.dataset.row][+cell.dataset.col] = map[cell.style.backgroundColor] ??= count++;
            });

            console.table(colors.map(row => [...row]));
            return { N, colors, board };
        }
        const { N, colors, board } = initBoards();

        // --- Constraints ---
        function canPlaceDash(r, c, board) {
            return board[r][c] === null;
        }
        function canPlaceT(r, c, board) {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = r + dr, nc = c + dc;
                    if (nr >= 0 && nr < N && nc >= 0 && nc < N && board[nr][nc] === 'T') return false;
                }
            }
            return true;
        }

        // --- Place T / Dash ---
        function applyBatteryRule(next) {
            const out = next.map(r => r.slice());
            const bitAt = Uint32Array.from({ length: N }, (_, i) => 1 << i);

            const posMap = new Int16Array(N);
            const seen   = new Uint32Array(N);
            let epoch = 1;

            const ctz  = x => 31 - Math.clz32(x & -x);
            const popc = x => { let c = 0; while (x) { x &= x - 1; c++; } return c; };

            let changed;
            do {
                changed = false;

                for (let pass = 0; pass < 2; pass++) {
                    const spans = new Int32Array(N);
                    const colorList = [];

                    // build spans
                    for (let r = 0; r < N; r++) {
                        for (let c = 0; c < N; c++) {
                            if (out[r][c] !== null) continue;
                            const idx = pass === 0 ? r : c;
                            spans[colors[r][c]] |= bitAt[idx];
                        }
                    }

                    // collect active colors
                    for (let color = 0; color < N; color++) {
                        if (spans[color] && seen[color] !== epoch) {
                            posMap[color] = colorList.length;
                            seen[color] = epoch;
                            colorList.push(color);
                        }
                    }
                    epoch++;
                    const total = colorList.length;
                    if (total < 2) continue;

                    // iterate subsets of size 2..MAX_K
                    let mask = total - 3 >> 31;
                    let MAX_K = (3 & ~mask) | (total & mask);

                    for (let k = 2; k <= MAX_K; k++) {
                        let subset = (1 << k) - 1;
                        const limit = 1 << total;
                        while (subset < limit) {
                            // union mask
                            let mask = 0;
                            for (let i = 0; i < total; i++) {
                                if (subset & (1 << i)) mask |= spans[colorList[i]];
                            }
                            if (popc(mask) === k) {
                                // block outside subset
                                let bits = mask;
                                while (bits) {
                                    const idx = ctz(bits);
                                    bits &= bits - 1;
                                    for (let j = 0; j < N; j++) {
                                        const r = pass === 0 ? idx : j;
                                        const c = pass === 0 ? j   : idx;
                                        const clr = colors[r][c];
                                        const pos = posMap[clr];
                                        if (pos >= 0 && (subset & (1 << pos))) continue;
                                        if (out[r][c] === null) {
                                            out[r][c] = "-";
                                            changed = true;
                                        }
                                    }
                                }
                            }
                            // Gosper’s hack
                            const c = subset & -subset;
                            const r = subset + c;
                            subset = (((r ^ subset) >>> 2) / c) | r;
                        }
                    }
                }
            } while (changed);

            return out;
        }
        function placeDash(r, c, board) {
            if (!canPlaceDash(r, c, board)) return false;
            const next = board.map(row => row.slice());
            next[r][c] = '-';
            return next;
        }
        function placeT(r, c, board) {
            if (!canPlaceT(r, c, board)) return placeDash(r, c, board);

            var next = board.map(row => row.slice());
            next[r][c] = 'T';

            // 1. block all other cells in the same row and column
            for (let i = 0; i < N; i++) {
                if (next[r][i] === null) next[r][i] = '-';
                if (next[i][c] === null) next[i][c] = '-';
            }

            // 2. block diagonals (no-touch rule)
            if (r > 0 && c > 0         && next[r - 1][c - 1] === null) next[r - 1][c - 1] = '-';
            if (r > 0 && c < N - 1     && next[r - 1][c + 1] === null) next[r - 1][c + 1] = '-';
            if (r < N - 1 && c > 0     && next[r + 1][c - 1] === null) next[r + 1][c - 1] = '-';
            if (r < N - 1 && c < N - 1 && next[r + 1][c + 1] === null) next[r + 1][c + 1] = '-';


            // 3. block other cells in the same region/color
            const color = colors[r][c];
            for (let i = 0; i < N; i++) {
                for (let j = 0; j < N; j++) {
                    if (next[i][j] === null && colors[i][j] === color) next[i][j] = '-';
                }
            }

            // 4. apply battery rule
            next = applyBatteryRule(next);

            // 4. color validation + forced placement
            const rowNulls   = new Int16Array(N);
            const colNulls   = new Int16Array(N);
            const colorNulls = new Int16Array(N);
            const colorHasT  = new Uint8Array(N);

            const lastRow   = new Int16Array(N * 2);
            const lastCol   = new Int16Array(N * 2);
            const lastColor = new Int16Array(N * 2);

            // pass 1: count nulls and detect T’s
            for (let i = 0; i < N; i++) {
                const rowN = next[i], rowC = colors[i];
                for (let j = 0; j < N; j++) {
                    const v = rowN[j], clr = rowC[j];

                    if (v === 'T') {
                        colorHasT[clr] = 1;
                        continue;
                    }
                    if (v !== null) continue;

                    // row
                    rowNulls[i]++;
                    lastRow[i<<1] = i;
                    lastRow[(i<<1)+1] = j;

                    // col
                    colNulls[j]++;
                    lastCol[j<<1] = i;
                    lastCol[(j<<1)+1] = j;

                    // color
                    colorNulls[clr]++;
                    lastColor[clr<<1] = i;
                    lastColor[(clr<<1)+1] = j;
                }
            }

            // pass 2: forced placements
            for (let i = 0; i < N; i++) {
                if (colorNulls[i] === 0 && colorHasT[i] === 0) return false;
                if (colorNulls[i] === 1) return placeT(lastColor[i <<1], lastColor[(i <<1 ) + 1], next);
                if (rowNulls[i] === 1) return placeT(lastRow[i <<1],   lastRow[(i << 1) + 1],   next);
                if (colNulls[i] === 1) return placeT(lastCol[i <<1],   lastCol[(i << 1) + 1],   next);
            }

            return next;
        }

        // --- Validation / Analysis ---
        let evaluations = 0;
        function analyze(board) {
            evaluations++;

            const rowT = new Int8Array(N),     rowE = new Int8Array(N),
                  colT = new Int8Array(N),     colE = new Int8Array(N),
                  tByColor = new Int8Array(N), eByColor = new Int8Array(N);

            // count
            let empties = false;
            for (let r = 0; r < N; r++) {
                for (let c = 0; c < N; c++) {
                    const v = board[r][c], color = colors[r][c];
                    if (v === "T")  (rowT[r]++, colT[c]++, tByColor[color]++);
                    else if (v == null) (rowE[r]++, colE[c]++, eByColor[color]++, empties = true);
                }
            }

            // solved?
            if (!empties) {
                for (let i = 0; i < N; i++) {
                    if (rowT[i] !== 1 || colT[i] !== 1 || tByColor[i] !== 1) break;
                    if (i === N - 1) return true;
                }
            }


            // candidate
            let best = null, bScore = 1e9;
            for (let r = 0; r < N; r++) {
                for (let c = 0; c < N; c++) {
                    if (board[r][c] === null && canPlaceT(r, c, board)) {
                        const score = eByColor[colors[r][c]];
                        if (score < bScore) best = { r, c }, bScore = score;
                    }
                }
            }
            return best;
        }

        // --- Search ---
        function search(board) {
            console.table(board);
            const pick = analyze(board);

            if (pick === null) return null;
            if (pick === true) return board;

            let res = null;
            let next = placeT(pick.r, pick.c, board);
            if (next && (res = search(next))) return res;

            next = placeDash(pick.r, pick.c, board);
            if (next && (res = search(next))) return res;

            return null;
        }
        function solve(board) {
            board = applyBatteryRule(board);
            const solution = search(board);
            if (!solution) throw new Error("no solution found");

            console.table(solution);
            console.log("Evaluations:", evaluations);
            return solution;
        }
        let solution = solve(board);

        // --- Input Solution ---
        async function clickTCells(boardOrPromise) {
            const b = await boardOrPromise;
            const els = document.querySelectorAll(".grid [data-row][data-col]");
            let i = 0;
            for (let r = 0; r < N; r++) {
                const row = b[r];
                for (let c = 0; c < N; c++, i++) {
                    if (row[c] === "T") els[i].click();
                }
            }
        }
        clickTCells(solution);
    }

    document.addEventListener("keydown", e => e.key === "`" && main());
})();
