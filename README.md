# Connect-Four
## Description
Connect Four is a two-player connection board game, in which the players choose a color and then take turns dropping colored tokens into a seven-column, six-row vertically suspended grid. Click on the preferred column and the pieces fall straight down, occupying the lowest available space within the column. The objective of the game is to be the first to form a horizontal, vertical, or diagonal line of four of one's own tokens.

The game is played with 2 players on the same screen. We will consider that the player who is logged into the game will be the first player. The second player will be played by another person on the same machine, same screen.

At the end of the game, we will only record the information from Player 1. At the end of each game, the score, the duration of the game, and the number of turns will be saved in the RDBMS on the server side, so they can be displayed in the leaderboard page. The server side will be only used to save the results of each game, keep information about Player 1.

## Installation
Unzip files into connect-four folder within the htdocs folder of the xampp installation folder.  Next go into the server folder and open the config.php file. It is important to use the correct settings for your database installation to allow the program to connect to the database. In the web browser go to http://localhost/connect-four/ and the game will automatically install.

## Usage
You may register from the main menu which will log you in upon successful completion of registration. You may also login from the main menu once registered or logout from the main menu. You may play as a guest, but your games will not be saved. If you are logged in your games will be saved and their is a change you may end up on the leaderboard. You can view the leaderboard page, the help page, and the contact page using the top navigation bar. 

On the game menu page you may start a regular or large board game. You may also access the game's options settings and change the player colors as well as the board color. Once ready to start the game click on of the start links. The goal is to connect four in a row either vertically, horizontally, or diagonally. Hints have been implemented to show where a user may connect four. Each player also has a superpower to flip the board horizontally once during the game. 