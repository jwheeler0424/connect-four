import { Game } from './Game.js'

const gameBoard = document.getElementById('game-board');
gameBoard.style.display = 'block';

let header = document.querySelector('#app > header'), 
    game = new Game('regular');


// Create page header
header.innerHTML = `
<h3 id="player1">Player 1</h3>
<h2 id="timer"></h2>
<h3 id="player2">Player 2</h3>
<nav>
    <button id="reset-btn">Reset Game</button>
    <button id="quit-btn">Quit Game</button>
    <button id="super-btn">Super-Flip</button>
</nav>
`;

// Select quit button
let quitBtn = document.getElementById('quit-btn');
quitBtn.addEventListener('click', e => {
e.preventDefault();
game.end();
game_menu();
});

// Select reset button
let resetBtn = document.getElementById('reset-btn');
resetBtn.addEventListener('click', e => {
e.preventDefault();
game.end();
game_board(size);
});

// Select superflip button
let superBtn = document.getElementById('super-btn');
superBtn.addEventListener('click', e => {
e.preventDefault();
game.superflip();
});

game.drawBoard();
game.start();