/**
 * --------------------------------------------------------------------------------
 * Connect Four - Game Class
 * --------------------------------------------------------------------------------
 * 
 */

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

    drawBoard()
    {
        const gameSpace = document.getElementById('game');
        const container = document.createElement('table');
        const board = document.createElement('tbody');
        gameSpace.innerHTML = '';

        for (let r = 0; r <= this.rows; r++) {
            const tr = document.createElement('tr');
            for (let c = 0; c <= this.cols; c++) {
                const td = document.createElement('td');
                td.setAttribute('id', `pos_${r}_${c}`)
                td.setAttribute('data-col', c);
                td.setAttribute('data-row', r)
                td.innerHTML = this.board[r][c] !== 0 ? this.board[r][c] : '&nbsp';
                tr.appendChild(td);
            }
            board.appendChild(tr);
        }
        container.appendChild(board)
        gameSpace.appendChild(container);

        let cells = board.querySelectorAll('td');

        cells.forEach(cell => {
            cell.addEventListener('click', e => {
                let column = e.target.dataset.col;
                this.setPiece(this.currentPlayer, column);
                this.currentPlayer === 1 ? this.currentPlayer = 2 : this.currentPlayer = 1;
                this.drawBoard();
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
    }

    setPiece(player, col)
    {
        let row = this.rows;
        while (this.board[row][col] !== 0) {
            row --;
        }
        this.board[row][col] = player;
        let hint = this.connectThree(player, row, col);
        let win = this.connectFour(player, row, col);

        // if (hint) console.log(player, hint);
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
                this.setPiece(tempAr.pop(), c)
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

    connectThree(player, row, col)
    {
        // check vertical space
        let vertical = this.checkVertical(player, row, col);
        if (vertical.length === 3) {
            return vertical
        }

        // check horizontal space
        let horizontal = this.checkHorizontal(player, row, col);
        if (horizontal.length === 3) {
            return horizontal
        }

        // check forward diagonal
        let diagForward = this.checkDiagForward(player, row, col);
        if (diagForward.length === 3) {
            return diagForward
        }

        // check backward diagonal
        let diagBackward = this.checkDiagBackward(player, row, col);
        if (diagBackward.length === 3) {
            return diagBackward
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
            if (this.board[row][col] === player) {
                connected.push([row, col]);
            } else {
                break;
            }
            row ++;
        }

        return connected;
    }

    checkHorizontal(player, row, col)
    {
        let connected = [];
        connected.push([row, col]);
        let maxWidth = this.cols;

        let tempCol = col - 1;
        while (tempCol >= 0) {
            if (this.board[row][tempCol] === player) {
                connected.push([row, tempCol]);
            } else {
                break;
            }
            tempCol --;
        }

        tempCol = col + 1;
        while (tempCol <= maxWidth) {
            if (this.board[row][tempCol] === player) {
                connected.push([row, tempCol]);
            } else {
                break;
            }
            tempCol ++;
        }

        return connected;
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
            if (this.board[tempRow][tempCol] === player) {
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
            if (this.board[tempRow][tempCol] === player) {
                connected.push([tempRow, tempCol]);
            } else {
                break;
            }
            tempCol ++;
            tempRow --;
        }

        return connected;
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
            if (this.board[tempRow][tempCol] === player) {
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
            if (this.board[tempRow][tempCol] === player) {
                connected.push([tempRow, tempCol]);
            } else {
                break;
            }
            tempCol ++;
            tempRow ++;
        }
        
        return connected;
    }
}