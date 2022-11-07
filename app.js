/*
|--------------------------------------------------------------------------------
| Connect Four - CSCI130 Project
|--------------------------------------------------------------------------------
| Group Members: 
| - Aakash Sharma
| - Jonathan Wheeler
| 
| Connect Four is a two-player connection board game, in which the players choose
| a color and then take turns dropping colored tokens into a seven-column, six-row
| vertically suspended grid. The pieces fall straight down, occupying the lowest 
| available space within the column. The objective of the game is to be the first
| to form a horizontal, vertical, or diagonal line of four of one's own tokens.
| 
*/

import { Game } from './js/Game.js'
import { Player } from './js/Player.js'

let game = new Game('large')
let player1 = new Player()
let player2 = new Player()

game.drawBoard();


player1.login('player1', 'password')