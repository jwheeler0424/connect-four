/**
 * ------------------------------------------------------------
 * Connect Four - Pages JS
 * ------------------------------------------------------------
 * 
 * @author Jonathan Wheeler <jwheeler0424@mail.fresnostate.edu>
 */

import { Game } from './Game.js'
import { Player } from "./Player.js";
import { loginUser, registerUser } from "./Actions.js";
import { postRequest } from "./request.js";

const login_player = () => {
    let loginForm = document.getElementById('login-form'),
        message = document.getElementById('error-msg');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let response = await loginUser(e.target);
        
        if (response === 'failed') {
            message.innerText = 'Incorrect username and/or password.'
            loginForm.reset();
        } else {
            window.location = '../';
        }
    });
}

const register_player = () => {
    let registerForm = document.getElementById('register-form'),
    message = document.getElementById('error-msg');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let response = await registerUser(e.target);
        
        if (response === 'failed') {
            message.innerText = 'An error occured with registering user.'
            registerForm.reset();
        } else {
            window.location = '../';
        }
    });
}

const game_menu = async () => {
    const player = await new Player().getPlayer();
    const gameBoard = document.getElementById('game-board');
    gameBoard.style.display = 'none';
    const gameMenu = document.getElementById('game-menu');
    gameMenu.style.display = 'block';
    let header = document.querySelector('#app > header');
    
    header.innerHTML = `<h2>Game Menu</h2>`;

    let welcomeMessage = document.getElementById('welcome-msg');
    welcomeMessage.innerText = `Make a selection.`;

    // Select menu buttons
    let startLink = document.getElementById('start-link'), 
        startLargeLink = document.getElementById('start-large-link');

    startLink.addEventListener('click', e => {
        e.preventDefault();
        game_board('regular');
    });

    startLargeLink.addEventListener('click', e => {
        e.preventDefault();
        game_board('large');
    });
}

const game_board = async (size = 'regular') => {
    const player = await new Player().getPlayer();

    const gameMenu = document.getElementById('game-menu');
    gameMenu.style.display = 'none';
    const gameBoard = document.getElementById('game-board');
    gameBoard.style.display = 'block';

    let boardStyles = localStorage.getItem('boardStyles') ? JSON.parse(localStorage.getItem('boardStyles')) : undefined;
    if (!boardStyles) {
        boardStyles = {
            tableColor: '#3465f7',
            player1Color: '#ffd700',
            player2Color: '#C41E3A',
            winColor: '#4CBB17'
        };
        localStorage.setItem('boardStyles', JSON.stringify(boardStyles))
    }

    let header = document.querySelector('#app > header'), 
        game = new Game(size);
    
    // Create page header
    header.innerHTML = `
        <h3 id="player1">${player.loggedIn ? player.username : 'Player 1'}</h3>
        <h2 id="timer"></h2>
        <h3 id="player2">Player 2</h3>
        <nav>
            <button id="reset-btn" class="btn">Reset Game</button>
            <button id="quit-btn" class="btn">Quit Game</button>
            <button id="super-btn" class="btn">Super-Flip</button>
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
}

const game_options = () => {
    let boardStyles = localStorage.getItem('boardStyles') ? JSON.parse(localStorage.getItem('boardStyles')) : undefined;
    if (!boardStyles) {
        boardStyles = {
            tableColor: '#3465f7',
            player1Color: '#ffd700',
            player2Color: '#C41E3A',
            winColor: '#4CBB17'
        };
        localStorage.setItem('boardStyles', JSON.stringify(boardStyles))
    }

    let resetSettings = document.getElementById('reset-settings'), 
        saveSettings = document.getElementById('save-settings'), 
        boardPicker = document.getElementById('board-picker'), 
        player1Picker = document.getElementById('player1-picker'), 
        player2Picker = document.getElementById('player2-picker'),
        winnerPicker = document.getElementById('winner-picker'),
        message = document.getElementById('error-msg');

    boardPicker.value = boardStyles.tableColor;
    player1Picker.value = boardStyles.player1Color;
    player2Picker.value = boardStyles.player2Color;
    winnerPicker.value = boardStyles.winColor;

    resetSettings.addEventListener('click', e => {
        e.preventDefault();
        boardStyles = {
            tableColor: '#3465f7',
            player1Color: '#ffd700',
            player2Color: '#C41E3A',
            winColor: '#4CBB17'
        };
        localStorage.setItem('boardStyles', JSON.stringify(boardStyles));
        boardPicker.value = boardStyles.tableColor;
        player1Picker.value = boardStyles.player1Color;
        player2Picker.value = boardStyles.player2Color;
        winnerPicker.value = boardStyles.winColor;
        message.innerText = "Colors have been reset to default values."
        setTimeout(() => {
            message.innerText = "";
        }, 10000)
    })

    saveSettings.addEventListener('click', e => {
        e.preventDefault();
        boardStyles = {
            tableColor: boardPicker.value,
            player1Color: player1Picker.value,
            player2Color: player2Picker.value,
            winColor: winnerPicker.value
        };
        localStorage.setItem('boardStyles', JSON.stringify(boardStyles));
        boardPicker.value = boardStyles.tableColor;
        player1Picker.value = boardStyles.player1Color;
        player2Picker.value = boardStyles.player2Color;
        winnerPicker.value = boardStyles.winColor;
        message.innerText = "Colors have been changed successfully."
        setTimeout(() => {
            message.innerText = "";
        }, 10000)
    })
}

const leader_board = async () => {
    const selectLeaders = document.getElementById('select-leaders');
    const leaderBoardHeader = document.querySelector('#board > thead');
    const leaderBoardBody = document.querySelector('#board > tbody');

    let data = new FormData(), response, leaders;
    switch(selectLeaders.value)
    {
        case 'fastest-games':
            data.append('api', 'getFastestGames');
            response = await postRequest("../server/api.php", data);
            leaders = response.leaders;
            leaderBoardHeader.innerHTML = `
                <tr>
                    <th></th>
                    <th>Player</th>
                    <th>Time</th>
                </tr>
            `;

            leaderBoardBody.innerHTML = '';
            for(let place = 0; place < 10; place++) {
                let leader = leaders[place] ?? {
                    player: '',
                    time: null
                };
                let time = leader.time ? new Date(leader.time) : null;
                let timeString = time ? `${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}.${time.getMilliSeconds().toString().padStart(3, '0')}` : '';
                leaderBoardBody.innerHTML += `
                    <tr>
                        <td>${place + 1}</td>
                        <td>${leader.player}</td>
                        <td>${timeString}</td>
                    </tr>
                `;
            }
            break;
        case 'least-moves':
            data.append('api', 'getLeastMoves');
            response = await postRequest("../server/api.php", data);
            leaders = response.leaders;
            leaderBoardHeader.innerHTML = `
                <tr>
                    <th></th>
                    <th>Player</th>
                    <th>Moves</th>
                </tr>
            `;

            leaderBoardBody.innerHTML = '';
            for(let place = 0; place < 10; place++) {
                let leader = leaders[place] ?? {
                    player: '',
                    moves: ''
                };
                leaderBoardBody.innerHTML += `
                    <tr>
                        <td>${place + 1}</td>
                        <td>${leader.player}</td>
                        <td>${leader.moves}</td>
                    </tr>
                `;
            }
            break;
        default:
            data.append('api', 'getMostWins');
            response = await postRequest("../server/api.php", data);
            leaders = response.leaders;
            leaderBoardHeader.innerHTML = `
                <tr>
                    <th></th>
                    <th>Player</th>
                    <th>Wins</th>
                </tr>
            `;

            leaderBoardBody.innerHTML = '';
            for(let place = 0; place < 10; place++) {
                let leader = leaders[place] ?? {
                    player: '',
                    wins: ''
                };
                leaderBoardBody.innerHTML += `
                    <tr>
                        <td>${place + 1}</td>
                        <td>${leader.player}</td>
                        <td>${leader.wins}</td>
                    </tr>
                `;
            }
    }
    

    selectLeaders.addEventListener('change', async (e) => {
        e.preventDefault();
        let data = new FormData();

        switch(e.target.value)
        {
            case 'fastest-games':
                data.append('api', 'getFastestGames');
                response = await postRequest("../server/api.php", data);
                leaders = response.leaders;
                leaderBoardHeader.innerHTML = `
                    <tr>
                        <th></th>
                        <th>Player</th>
                        <th>Time</th>
                    </tr>
                `;

                leaderBoardBody.innerHTML = '';
                for(let place = 0; place < 10; place++) {
                    let leader = leaders[place] ?? {
                        player: '',
                        time: null
                    };
                    let time = leader.time ? new Date(leader.time) : '';
                    let timeString = time ? `${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}.${time.getMilliseconds().toString().padStart(3, '0')}` : '';
                    leaderBoardBody.innerHTML += `
                        <tr>
                            <td>${place + 1}</td>
                            <td>${leader.player}</td>
                            <td>${timeString}</td>
                        </tr>
                    `;
                }
                break;
            case 'least-moves':
                data.append('api', 'getLeastMoves');
                response = await postRequest("../server/api.php", data);
                leaders = response.leaders;
                leaderBoardHeader.innerHTML = `
                    <tr>
                        <th></th>
                        <th>Player</th>
                        <th>Moves</th>
                    </tr>
                `;

                leaderBoardBody.innerHTML = '';
                for(let place = 0; place < 10; place++) {
                    let leader = leaders[place] ?? {
                        player: '',
                        moves: ''
                    };
                    leaderBoardBody.innerHTML += `
                        <tr>
                            <td>${place + 1}</td>
                            <td>${leader.player}</td>
                            <td>${leader.moves}</td>
                        </tr>
                    `;
                }
                break;
            default:
                data.append('api', 'getMostWins');
                response = await postRequest("../server/api.php", data);
                leaders = response.leaders;
                leaderBoardHeader.innerHTML = `
                    <tr>
                        <th></th>
                        <th>Player</th>
                        <th>Wins</th>
                    </tr>
                `;

                leaderBoardBody.innerHTML = '';
                for(let place = 0; place < 10; place++) {
                    let leader = leaders[place] ?? {
                        player: '',
                        wins: ''
                    };
                    leaderBoardBody.innerHTML += `
                        <tr>
                            <td>${place + 1}</td>
                            <td>${leader.player}</td>
                            <td>${leader.wins}</td>
                        </tr>
                    `;
                }
        }
        
    })
}

const main_menu = async () => {
    const player = await new Player().getPlayer();
    const welcome = document.getElementById('welcome-msg');
    
    // Select menu buttons
    let loginLink = document.getElementById('login-link'), 
        logoutLink = document.getElementById('logout-link'), 
        registerLink = document.getElementById('register-link'), 
        playLink = document.getElementById('play-link'), 
        playGuestLink = document.getElementById('play-guest-link'), 
        leaderLink = document.getElementById('leader-link');
    
    logoutLink.addEventListener('click', e => {
        e.preventDefault();
        const url = e.target.href;

        player.logout();
        window.location = url;
    })

    if (player.loggedIn) {
        welcome.innerText = `Welcome, ${player.name}. Please select an option.`;
        loginLink.style.display = 'none';  
        registerLink.style.display = 'none'; 
        playGuestLink.style.display = 'none';  
        playLink.style.display = 'block';  
        leaderLink.style.display = 'block';  
        logoutLink.style.display = 'block';
    } else {
        welcome.innerText = `Welcome, Guest. Please select an option.`;
        logoutLink.style.display = 'none';  
        playLink.style.display = 'none'; 
        loginLink.style.display = 'block';
        registerLink.style.display = 'block'; 
        playGuestLink.style.display = 'block';  
        leaderLink.style.display = 'block';
    }

}

export const loadPages = () =>
{
    let mainMenu = document.getElementById('main-menu'),
        gameMenu = document.getElementById('game-menu'),
        gameOptions = document.getElementById('game-options'),
        loginPlayer = document.getElementById('login-player'),
        registerPlayer = document.getElementById('register-player'),
        leaderBoard = document.getElementById('leader-board');

    if (mainMenu) {
        main_menu();
    }

    if (gameMenu) {
        game_menu();
    }

    if (gameOptions) {
        game_options();
    }

    if (loginPlayer) {
        login_player();
    }

    if (registerPlayer) {
        register_player();
    }

    if (leaderBoard) {
        leader_board();
    }
}