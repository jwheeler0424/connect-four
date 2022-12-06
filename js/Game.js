/**
 * --------------------------------------------------------------------------------
 * Connect Four - Game Class
 * --------------------------------------------------------------------------------
 * 
 */
import { Player } from "./Player.js";
import { postRequest } from "./request.js";

export class Game
{
    constructor(size = 'regular')
    {
        let rows, cols;
        switch (size) {
            case 'regular':
                rows = 6;
                cols = 7;
                break;
            case 'large':
                rows = 8;
                cols = 9;
                break;
            default:
                rows = 6;
                cols = 7;
        }
        let savedGame = JSON.parse(localStorage.getItem('game'));
        localStorage.setItem('superflip', JSON.stringify({
            player1: true,
            player2: true
        }))
        
        if (savedGame) {
            this.rows = savedGame.rows;
            this.cols = savedGame.cols;
            this.currentPlayer = savedGame.currentPlayer;
            this.board = savedGame.board;
        } else {
            this.rows = rows - 1;
            this.cols = cols - 1;
            this.currentPlayer = 1;
            this.board = [];
            for (let r = 0; r < rows; r++) {
                this.board[r] = [];
                for (let c = 0; c < cols; c++) {
                    this.board[r][c] = 0;
                }
            }
        }
    }

    drawBoard(state = 'playing')
    {
        const player1title = document.getElementById('player1');
        const player2title = document.getElementById('player2')
        const gameSpace = document.getElementById('game');
        const container = document.createElement('table');
        const board = document.createElement('tbody');
        gameSpace.innerHTML = '';

        let superBtn = document.getElementById('super-btn');
        let superflip = false;

        let gameOver = !!localStorage.getItem('win') ?? false;
        if (gameOver) {
            localStorage.setItem('superflip', JSON.stringify({
                player1: false,
                player2: false
            }))
            if (this.currentPlayer === 1) {
                player1title.classList.add('activeWinner');
                player2title.classList.remove('activeWinner');
            } else {
                player1title.classList.remove('activeWinner');
                player2title.classList.add('activeWinner');
            }
        } else {
            if (this.currentPlayer === 1) {
                superflip = JSON.parse(localStorage.getItem('superflip')).player1;
                player1title.classList.add('activePlayer1');
                player2title.classList.remove('activePlayer2');
            } else {
                superflip = JSON.parse(localStorage.getItem('superflip')).player2;
                player1title.classList.remove('activePlayer1');
                player2title.classList.add('activePlayer2');
            }
        }

        if (!superflip) {
            superBtn.disabled = true;
            superBtn.style.visibility = 'hidden';
        } else  {
            superBtn.disabled = false;
            superBtn.style.visibility = 'visible'
        }

        for (let r = 0; r <= this.rows; r++) {
            const tr = document.createElement('tr');
            for (let c = 0; c <= this.cols; c++) {
                const td = document.createElement('td');
                td.setAttribute('id', `pos_${r}_${c}`)
                td.setAttribute('data-col', c);
                td.setAttribute('data-row', r)
                td.innerHTML = this.board[r][c] !== 0 
                    ? this.board[r][c].player === 1 
                        ? `<div class="player1_piece">${this.board[r][c].currentMove}</div>`
                        : `<div class="player2_piece">${this.board[r][c].currentMove}</div>` 
                    : '';
                tr.appendChild(td);
            }
            board.appendChild(tr);
        }
        container.appendChild(board)
        gameSpace.appendChild(container);
        
        if (state !== 'gameover' && !gameOver) {
            this.getHints(this.currentPlayer);

            let cells = board.querySelectorAll('td');

            cells.forEach(cell => {
                cell.addEventListener('click', e => {
                    let column = parseInt(e.target.dataset.col);
                    let win = this.setPiece(this.currentPlayer, column);
                    
                    if (win) {
                        localStorage.setItem('win', JSON.stringify(win));
                        clearInterval(this.interval);
                        localStorage.setItem('superflip', JSON.stringify({
                            player1: false,
                            player2: false
                        }))
                        localStorage.setItem('game', JSON.stringify(this));
                        this.saveGame(this.currentPlayer);
                        this.drawBoard('gameover');
                    } else {
                        this.currentPlayer === 1 ? this.currentPlayer = 2 : this.currentPlayer = 1;
                        this.drawBoard();
                    }

                    
                })
                cell.addEventListener('mouseover', e => {
                    let column = e.target.dataset.col;
                    let activeCells = document.querySelectorAll(`[data-col="${column}"]`);
                    activeCells.forEach(ac => {
                        ac.classList.add('activeColumn')
                    })
                })
                cell.addEventListener('mouseout', e => {
                    let column = e.target.dataset.col;
                    let activeCells = document.querySelectorAll(`[data-col="${column}"]`);
                    activeCells.forEach(ac => {
                        ac.classList.remove('activeColumn')
                    })
                })
            })
        } else {
            let win = JSON.parse(localStorage.getItem('win'));
            win.forEach(cell => {
                let r = cell[0], c = cell[1];
                let winCell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                winCell.classList.add('activeWin');
            })
        }
    }

    async saveGame(winner)
    {
        let player = await new Player().getPlayer();
        
        if (player.loggedIn) {
            let game = JSON.parse(localStorage.getItem('game'));
            let gameTime = new Date(game.gameTime).getTime();
            let playerMoves = this.getPlayerMoves(1);

            let data = new FormData();
            data.append('api', 'addGameData');
            data.append('user_id', player.id);
            data.append('win', winner === 1);
            data.append('time', gameTime);
            data.append('moves', playerMoves);

            //await postRequest("../server/api.php", data);
            this.end();
        }
    }

    setPiece(player, col)
    {
        let row = this.rows;
        
        while (this.board[row][col] !== 0) {
            row --;
        }
        this.board[row][col] = {
            player,
            currentMove: this.getPlayerMoves(player) + 1
        };

        return this.connectFour(this.currentPlayer, row, col);
    }

    getHints()
    {
        let connect3 = this.getMatchThreeMoves();
        let connect2 = this.getMatchTwoMoves();

        // Get vertical hints
        this.getVerticalHints(connect3);

        // Get horizontal hints
        this.getHorizontalHints(connect3);
        this.getHorizontalSplitHints(connect2);

        // Set forward diagonal hints
        this.getDiagForwardHints(connect3);
        this.getDiagForwardSplitHints(connect2);

        // Set backward diagonal hints
        this.getDiagBackwardHints(connect3);
        this.getDiagBackwardSplitHints(connect2);
    }

    getPlayerMoves(player)
    {
        let playerMoves = [];
        this.board.forEach((row, r) => {
            row.forEach((column, c) => {
                if (player === this.board[r][c].player) playerMoves.push([r,c])
            })
        })

        return playerMoves.length;
    }

    getMatchThreeMoves()
    {
        let playerMoves = [];
        let connect3 = {
            vertical: [],
            horizontal: [],
            diagForward: [],
            diagBackward: []
        };
        this.board.forEach((row, r) => {
            row.forEach((column, c) => {
                if (this.currentPlayer === this.board[r][c].player) playerMoves.push([r,c])
            })
        })
        
        playerMoves.forEach(move => {
            let match = this.connectThree(this.currentPlayer, move[0], move[1]);
            if (match) {
                if (match.vertical) {
                    if (connect3.vertical.length <= 0) {
                        connect3.vertical.push(match.vertical);
                    } else {
                        connect3.vertical.forEach(array => {
                            let test = array.length === match.vertical.length && array.every((value, index) => value === match.vertical[index]);
                            if (test) connect3.vertical.push(match.vertical);
                        });
                    }
                }

                if (match.horizontal) {
                    if (connect3.horizontal.length <= 0) {
                        connect3.horizontal.push(match.horizontal);
                    } else {
                        connect3.horizontal.forEach(array => {
                            let test = array.length === match.horizontal.length && array.every((value, index) => value === match.horizontal[index]);
                            if (test) connect3.horizontal.push(match.horizontal);
                        });
                    }
                }

                if (match.diagForward) {
                    if (connect3.diagForward.length <= 0) {
                        connect3.diagForward.push(match.diagForward);
                    } else {
                        connect3.diagForward.forEach(array => {
                            let test = array.length === match.diagForward.length && array.every((value, index) => value === match.diagForward[index]);
                            if (test) connect3.diagForward.push(match.diagForward);
                        });
                    }
                }

                if (match.diagBackward) {
                    if (connect3.diagBackward.length <= 0) {
                        connect3.diagBackward.push(match.diagBackward);
                    } else {
                        connect3.diagBackward.forEach(array => {
                            let test = array.length === match.diagBackward.length && array.every((value, index) => value === match.diagBackward[index]);
                            if (test) connect3.diagBackward.push(match.diagBackward);
                        });
                    }
                }
            } 
        });

        return connect3;
    }

    getMatchTwoMoves()
    {
        let playerMoves = [];
        let connect2 = {
            vertical: [],
            horizontal: [],
            diagForward: [],
            diagBackward: []
        };
        this.board.forEach((row, r) => {
            row.forEach((column, c) => {
                if (this.currentPlayer === this.board[r][c].player) playerMoves.push([r,c])
            })
        })
        
        playerMoves.forEach(move => {
            let match = this.connectTwo(this.currentPlayer, move[0], move[1]);
            if (match) {
                if (match.vertical) {
                    if (connect2.vertical.length <= 0) {
                        connect2.vertical.push(match.vertical);
                    } else {
                        connect2.vertical.forEach(array => {
                            let test = array.length === match.vertical.length && array.every((value, index) => value === match.vertical[index]);
                            if (test) connect2.vertical.push(match.vertical);
                        });
                    }
                }

                if (match.horizontal) {
                    if (connect2.horizontal.length <= 0) {
                        connect2.horizontal.push(match.horizontal);
                    } else {
                        connect2.horizontal.forEach(array => {
                            let test = array.length === match.horizontal.length && array.every((value, index) => value === match.horizontal[index]);
                            if (test) connect2.horizontal.push(match.horizontal);
                        });
                    }
                }

                if (match.diagForward) {
                    if (connect2.diagForward.length <= 0) {
                        connect2.diagForward.push(match.diagForward);
                    } else {
                        connect2.diagForward.forEach(array => {
                            let test = array.length === match.diagForward.length && array.every((value, index) => value === match.diagForward[index]);
                            if (test) connect2.diagForward.push(match.diagForward);
                        });
                    }
                }

                if (match.diagBackward) {
                    if (connect2.diagBackward.length <= 0) {
                        connect2.diagBackward.push(match.diagBackward);
                    } else {
                        connect2.diagBackward.forEach(array => {
                            let test = array.length === match.diagBackward.length && array.every((value, index) => value === match.diagBackward[index]);
                            if (test) connect2.diagBackward.push(match.diagBackward);
                        });
                    }
                }
            } 
        });
        
        return connect2;
    }

    flipBoardX()
    {
        for (let c = 0; c <= this.cols; c++) {
            let tempAr = [], row = this.rows;
            while (this.board[row][c] !== 0) {
                tempAr.push(this.board[row][c]);
                this.board[row][c] = 0;
                row --;
            }
            while (tempAr.length > 0) {
                this.setPiece(tempAr.pop().player, c)
            }
        }
    }

    flipBoardY()
    {
        for (let r = this.rows; r >= 0; r--) {
            let tempAr = [];
            for (let c = 0; c <= this.cols; c++) {
                tempAr.push(this.board[r].pop())
            }
            this.board[r] = tempAr;
        }
    }

    superflip()
    {
        this.flipBoardX();
        let superflip = JSON.parse(localStorage.getItem('superflip'));
        this.currentPlayer === 1 ? superflip.player1 = false : superflip.player2 = false;
        localStorage.setItem('superflip', JSON.stringify(superflip));
        this.drawBoard();
    }

    connectTwo(player, row, col)
    {
        let connect2 = {
            vertical: null,
            horizontal: null,
            diagForward: null,
            diagBackward: null
        };

        // check vertical space
        let vertical = this.checkVertical(player, row, col);
        if (vertical.length === 2) {
            connect2.vertical = vertical.sort();
        }

        // check horizontal space
        let horizontal = this.checkHorizontal(player, row, col);
        if (horizontal.length === 2) {
            connect2.horizontal = horizontal.sort();
        }

        // check forward diagonal
        let diagForward = this.checkDiagForward(player, row, col);
        if (diagForward.length === 2) {
            connect2.diagForward = diagForward.sort();
        }

        // check backward diagonal
        let diagBackward = this.checkDiagBackward(player, row, col);
        if (diagBackward.length === 2) {
            connect2.diagBackward = diagBackward.sort();
        }
        
        if (connect2.vertical || connect2.horizontal || connect2.diagForward || connect2.diagBackward){
            return connect2;
        }
        return false;
    }

    connectThree(player, row, col)
    {
        let connect3 = {
            vertical: null,
            horizontal: null,
            diagForward: null,
            diagBackward: null
        };

        // check vertical space
        let vertical = this.checkVertical(player, row, col);
        if (vertical.length === 3) {
            connect3.vertical = vertical.sort();
        }

        // check horizontal space
        let horizontal = this.checkHorizontal(player, row, col);
        if (horizontal.length === 3) {
            connect3.horizontal = horizontal.sort();
        }

        // check forward diagonal
        let diagForward = this.checkDiagForward(player, row, col);
        if (diagForward.length === 3) {
            connect3.diagForward = diagForward.sort();
        }

        // check backward diagonal
        let diagBackward = this.checkDiagBackward(player, row, col);
        if (diagBackward.length === 3) {
            connect3.diagBackward = diagBackward.sort();
        }
        
        if (connect3.vertical || connect3.horizontal || connect3.diagForward || connect3.diagBackward){
            return connect3;
        }
        return false;
    }

    connectFour(player, row, col)
    {
        
        // check vertical space
        let vertical = this.checkVertical(player, row, col);
        if (vertical.length === 4) {
            return vertical
        }

        // check horizontal space
        let horizontal = this.checkHorizontal(player, row, col);
        if (horizontal.length === 4) {
            return horizontal
        }

        // check forward diagonal
        let diagForward = this.checkDiagForward(player, row, col);
        if (diagForward.length === 4) {
            return diagForward
        }

        // check backward diagonal
        let diagBackward = this.checkDiagBackward(player, row, col);
        if (diagBackward.length === 4) {
            return diagBackward
        }
        
        return false;
    }

    checkVertical(player, row, col)
    {
        let connected = [];
        let maxHeight = this.rows;
        
        while (row <= maxHeight) {
            if (this.board[row][col] !== 0 && this.board[row][col].player === player) {
                connected.push([row, col]);
            } else {
                break;
            }
            row ++;
        }

        return connected;
    }

    getVerticalHints(connect3)
    {
        if (connect3.vertical.length >= 1) {
            connect3.vertical.forEach(match => {
                let front = match[0], back = match[2], r, c;

                // Check if left space exists and is empty
                if (
                    this.board[front[0] - 1][front[1]] !== undefined 
                    && this.board[front[0] - 1][front[1]] === 0
                ) {
                    r = front[0] - 1;
                    c = front[1];
                    let hintCell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                    hintCell.classList.add(`activeHint${this.currentPlayer}`);
                }
            })
        }
    }

    checkHorizontal(player, row, col)
    {
        let connected = [];
        connected.push([row, col]);
        let maxWidth = this.cols;

        let tempCol = col - 1;
        while (tempCol >= 0) {
            if (this.board[row][tempCol] && this.board[row][tempCol].player === player) {
                connected.push([row, tempCol]);
            } else {
                break;
            }
            tempCol --;
        }

        tempCol = col + 1;
        while (tempCol <= maxWidth) {
            if (this.board[row][tempCol] && this.board[row][tempCol].player === player) {
                connected.push([row, tempCol]);
            } else {
                break;
            }
            tempCol ++;
        }

        return connected;
    }

    getHorizontalHints(connect3)
    {
        if (connect3.horizontal.length >= 1) {
            connect3.horizontal.forEach(match => {
                let front = match[0], back = match[2], r, c;

                // Check if left space exists and is empty
                if (
                    this.board[front[0]][front[1] - 1] !== undefined 
                    && this.board[front[0]][front[1] - 1] === 0
                    && (this.board[front[0] + 1] === undefined
                    || this.board[front[0] + 1][front[1] - 1] !== 0)
                ) {
                    r = front[0];
                    c = front[1] - 1;
                    let hintCell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                    hintCell.classList.add(`activeHint${this.currentPlayer}`);
                }

                // Check if right space exists and is empty
                if (
                    this.board[back[0]][back[1] + 1] !== undefined 
                    && this.board[back[0]][back[1] + 1] === 0
                    && (this.board[back[0] + 1] === undefined
                    || this.board[back[0] + 1][back[1] + 1] === undefined
                    || this.board[back[0] + 1][back[1] + 1] !== 0)
                ) {
                    r = back[0];
                    c = back[1] + 1;
                    let hintCell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                    hintCell.classList.add(`activeHint${this.currentPlayer}`);
                }
            })
        }
    }

    getHorizontalSplitHints(connect2)
    {
        if (connect2.horizontal.length >= 1) {
            connect2.horizontal.forEach(match => {
                let front = match[0], back = match[1], r, c;
                
                // Check if left space exists and is empty
                if (
                    this.board[front[0]][front[1] - 1] !== undefined 
                    && this.board[front[0]][front[1] - 1] === 0
                    && this.board[front[0]][front[1] - 2] !== undefined
                    && this.board[front[0]][front[1] - 2].player === this.currentPlayer
                    && (this.board[front[0] + 1] === undefined
                    || this.board[front[0] + 1][front[1] - 1] !== 0)
                ) {
                    r = front[0];
                    c = front[1] - 1;
                    let hintCell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                    hintCell.classList.add(`activeHint${this.currentPlayer}`);
                }

                // Check if right space exists and is empty
                if (
                    this.board[back[0]][back[1] + 1] !== undefined 
                    && this.board[back[0]][back[1] + 1] === 0
                    && this.board[back[0]][back[1] + 2] !== undefined
                    && this.board[back[0]][back[1] + 2].player === this.currentPlayer
                    && (this.board[back[0] + 1] === undefined
                    || this.board[back[0] + 1][back[1] + 1] === undefined
                    || this.board[back[0] + 1][back[1] + 1] !== 0)
                ) {
                    r = back[0];
                    c = back[1] + 1;
                    let hintCell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                    hintCell.classList.add(`activeHint${this.currentPlayer}`);
                }
            })
        }
    }

    checkDiagForward(player, row, col)
    {
        let connected = [];
        let maxHeight = this.rows;
        let maxWidth = this.cols;
        connected.push([row, col]);

        let tempCol = col - 1;
        let tempRow = row + 1;
        while (tempCol >= 0 && tempRow <= maxHeight) {
            if (this.board[tempRow][tempCol] && this.board[tempRow][tempCol].player === player) {
                connected.push([tempRow, tempCol]);
            } else {
                break;
            }
            tempCol --;
            tempRow ++;
        }

        tempCol = col + 1;
        tempRow = row - 1;
        while (tempCol <= maxWidth && tempRow >= 0) {
            if (this.board[tempRow][tempCol] && this.board[tempRow][tempCol].player === player) {
                connected.push([tempRow, tempCol]);
            } else {
                break;
            }
            tempCol ++;
            tempRow --;
        }

        return connected;
    }

    getDiagForwardHints(connect3)
    {
        if (connect3.diagForward.length >= 1) {
            connect3.diagForward.forEach(match => {
                let front = match[0], back = match[2], r, c;

                // Check if top right space exists and is empty
                if (
                    this.board[front[0] - 1] !== undefined
                    && this.board[front[0] - 1][front[1] + 1] !== undefined 
                    && this.board[front[0] - 1][front[1] + 1] === 0
                    && this.board[front[0]][front[1] + 1] !== 0
                ) {
                    r = front[0] - 1;
                    c = front[1] + 1;
                    let hintCell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                    hintCell.classList.add(`activeHint${this.currentPlayer}`);
                }
                // Check if bottom left space exists and is empty
                if (
                    this.board[back[0] + 1] !== undefined 
                    && this.board[back[0] + 1][back[1] - 1] !== undefined 
                    && this.board[back[0] + 1][back[1] - 1] === 0
                ) {
                    r = back[0] + 1;
                    c = back[1] - 1;
                    let hintCell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                    hintCell.classList.add(`activeHint${this.currentPlayer}`);
                }
            })
        }
    }

    getDiagForwardSplitHints(connect2)
    {
        if (connect2.diagForward.length >= 1) {
            connect2.diagForward.forEach(match => {
                let front = match[0], back = match[1], r, c;
                
                // Check if top right space exists and is empty
                if (
                    this.board[front[0] - 1] !== undefined
                    && this.board[front[0] - 1][front[1] + 1] !== undefined 
                    && this.board[front[0] - 1][front[1] + 1] === 0
                    && this.board[front[0]][front[1] + 1] !== 0
                    && this.board[front[0] - 2] !== undefined
                    && this.board[front[0] - 2][front[1] + 2] !== undefined
                    && this.board[front[0] - 2][front[1] + 2].player === this.currentPlayer
                    && this.board[front[0] - 1][front[1] + 2] !== 0
                ) {
                    r = front[0] - 1;
                    c = front[1] + 1;
                    let hintCell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                    hintCell.classList.add(`activeHint${this.currentPlayer}`);
                }

                // Check if bottom left space exists and is empty
                if (
                    this.board[back[0] + 1] !== undefined 
                    && this.board[back[0] + 1][back[1] - 1] !== undefined 
                    && this.board[back[0] + 1][back[1] - 1] === 0
                    && this.board[back[0] + 2] !== undefined
                    && this.board[back[0] + 2][back[1] - 2] !== undefined 
                    && this.board[back[0] + 2][back[1] - 2].player === this.currentPlayer
                    && this.board[back[0] + 2][back[1] - 1] !== undefined
                    && this.board[back[0] + 2][back[1] - 1] !== 0
                ) {
                    r = back[0] + 1;
                    c = back[1] - 1;
                    let hintCell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                    hintCell.classList.add(`activeHint${this.currentPlayer}`);
                }
            })
        }
    }

    checkDiagBackward(player, row, col)
    {
        let connected = [];
        let maxHeight = this.rows;
        let maxWidth = this.cols;
        connected.push([row, col]);
        
        let tempCol = col - 1;
        let tempRow = row - 1;
        while (tempCol >= 0 && tempRow >= 0) {
            if (this.board[tempRow][tempCol] && this.board[tempRow][tempCol].player === player) {
                connected.push([tempRow, tempCol]);
            } else {
                break;
            }
            tempCol --;
            tempRow --;
        }

        tempCol = col + 1;
        tempRow = row + 1;
        while (tempCol <= maxWidth && tempRow <= maxHeight) {
            if (this.board[tempRow][tempCol] && this.board[tempRow][tempCol].player === player) {
                connected.push([tempRow, tempCol]);
            } else {
                break;
            }
            tempCol ++;
            tempRow ++;
        }
        
        return connected;
    }

    getDiagBackwardHints(connect3)
    {
        if (connect3.diagBackward.length >= 1) {
            connect3.diagBackward.forEach(match => {
                let front = match[0], back = match[2], r, c;
                
                // Check if top left space exists and is empty
                if (
                    this.board[front[0] - 1] !== undefined 
                    && this.board[front[0] - 1][front[1] - 1] !== undefined
                    && this.board[front[0] - 1][front[1] - 1] === 0
                    && (this.board[front[0]][front[1] - 1] === undefined 
                    || this.board[front[0]][front[1] - 1] !== 0)
                ) {
                    r = front[0] - 1;
                    c = front[1] - 1;
                    
                    let hintCell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                    hintCell.classList.add(`activeHint${this.currentPlayer}`);
                }
                
                // Check if bottom right space exists and is empty
                if (
                    this.board[back[0] + 1] !== undefined
                    && this.board[back[0] + 1][back[1] + 1] !== undefined 
                    && this.board[back[0] + 1][back[1] + 1] === 0
                    && (this.board[back[0] + 2] === undefined 
                    || this.board[back[0] + 2][back[1] + 1] === undefined
                    || this.board[back[0] + 2][frobacknt[1] + 1] !== 0)
                ) {
                    r = back[0] + 1;
                    c = back[1] + 1;
                    let hintCell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                    hintCell.classList.add(`activeHint${this.currentPlayer}`);
                }
            })
        }
    }

    getDiagBackwardSplitHints(connect2)
    {
        if (connect2.diagBackward.length >= 1) {
            connect2.diagBackward.forEach(match => {
                let front = match[0], back = match[1], r, c;
                console.log(front, back)
                // Check if top left space exists and is empty
                if (
                    this.board[front[0] - 1] !== undefined 
                    && this.board[front[0] - 1][front[1] - 1] !== undefined
                    && this.board[front[0] - 1][front[1] - 1] === 0
                    && this.board[front[0] - 2] !== undefined
                    && this.board[front[0] - 2][front[1] - 2] !== undefined
                    && this.board[front[0] - 2][front[1] - 2].player === this.currentPlayer
                    && (this.board[front[0]][front[1] - 1] === undefined 
                    || this.board[front[0]][front[1] - 1] !== 0)
                ) {
                    r = front[0] - 1;
                    c = front[1] - 1;
                    
                    let hintCell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                    hintCell.classList.add(`activeHint${this.currentPlayer}`);
                }
                
                // Check if bottom right space exists and is empty
                if (
                    this.board[back[0] + 1] !== undefined
                    && this.board[back[0] + 1][back[1] + 1] !== undefined 
                    && this.board[back[0] + 1][back[1] + 1] === 0
                    && this.board[back[0] + 2] !== undefined
                    && this.board[back[0] + 2][back[1] + 2] !== undefined
                    && this.board[back[0] + 2][back[1] + 2].player === this.currentPlayer
                    && (this.board[back[0] + 2] === undefined 
                    || this.board[back[0] + 2][back[1] + 1] === undefined
                    || this.board[back[0] + 2][back[1] + 1] !== 0)
                ) {
                    r = back[0] + 1;
                    c = back[1] + 1;
                    let hintCell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                    hintCell.classList.add(`activeHint${this.currentPlayer}`);
                }
            })
        }
    }

    start()
    {
        const timerContainer = document.getElementById('timer');
        let savedGame = JSON.parse(localStorage.getItem('game'));
        
        if (!localStorage.getItem('win')) {
            this.startTime = savedGame ? new Date(savedGame.startTime) : new Date();
            this.currentTime = new Date();
            this.gameTime = new Date(this.currentTime.getTime() - this.startTime.getTime());
            if (!savedGame) localStorage.setItem('game', JSON.stringify(this));
            timerContainer.innerText = `${this.gameTime.getMinutes().toString().padStart(2, '0')}:${this.gameTime.getSeconds().toString().padStart(2, '0')}`;
            this.interval = setInterval(() => {
                this.currentTime = new Date();
                this.gameTime = new Date(this.currentTime.getTime() - this.startTime.getTime());
                localStorage.setItem('game', JSON.stringify(this));
                timerContainer.innerText = `${this.gameTime.getMinutes().toString().padStart(2, '0')}:${this.gameTime.getSeconds().toString().padStart(2, '0')}`;
            }, 1000);
        } else {
            this.gameTime = new Date(savedGame.gameTime);
            timerContainer.innerText = `${this.gameTime.getMinutes().toString().padStart(2, '0')}:${this.gameTime.getSeconds().toString().padStart(2, '0')}`;
        }
    }

    end()
    {
        this.startTime = 0;
        this.currentTime = 0;
        this.gameTime = 0;
        localStorage.removeItem('game');
        localStorage.removeItem('superflip');
        localStorage.removeItem('win');
        clearInterval(this.interval);
    }
}