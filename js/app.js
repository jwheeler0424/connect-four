/**
 * ------------------------------------------------------------
 * Connect Four - CSCI130 Project
 * ------------------------------------------------------------
 * Group Members:
 *  @author Aakash Sharma       <aakash6177@mail.fresnostate.edu>
 *  @author Jonathan Wheeler    <jwheeler0424@mail.fresnostate.edu>
 * 
 * Connect Four is a two-player connection board game, in which the players choose
 * a color and then take turns dropping colored tokens into a seven-column, six-row
 * vertically suspended grid. The pieces fall straight down, occupying the lowest 
 * available space within the column. The objective of the game is to be the first
 * to form a horizontal, vertical, or diagonal line of four of one's own tokens.
 */

import { checkInstall } from "./install.js";
import { handleDisplay } from "./Display.js";

let installed = localStorage.getItem('installed');
let display = localStorage.getItem('display') ?? 'menu';

if (!installed) {
    installed = await checkInstall;
    localStorage.setItem('installed', installed);
}

handleDisplay(display);

// import { Game } from './Game.js'
// import { Player } from './Player.js'

// let game = new Game('large')
// let player1 = new Player()
// let player2 = new Player()

// game.drawBoard();

// let username = 'player';
// let password = 'password';

// player1.login(username, password)