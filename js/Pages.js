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

export const login_player = () => {
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

export const register_player = () => {
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

export const game_menu = async () => {
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
        startLargeLink = document.getElementById('start-large-link'), 
        leaderLink = document.getElementById('leader-link');

    startLink.addEventListener('click', e => {
        e.preventDefault();
        game_board('regular');
    });

    startLargeLink.addEventListener('click', e => {
        e.preventDefault();
        game_board('large');
    });
}

export const game_board = async (size = 'regular') => {
    const player = await new Player().getPlayer();

    const gameMenu = document.getElementById('game-menu');
    gameMenu.style.display = 'none';
    const gameBoard = document.getElementById('game-board');
    gameBoard.style.display = 'block';

    let header = document.querySelector('#app > header'), 
        game = new Game(size);
    
    // Create page header
    header.innerHTML = `
        <h3 id="player1">${player.loggedIn ? player.username : 'Player 1'}</h3>
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
}

export const leader_board = () => {
    const leaderBoard = document.getElementById('leader-board');
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
        loginPlayer = document.getElementById('login-player'),
        registerPlayer = document.getElementById('register-player'),
        leaderBoard = document.getElementById('leader-board');

    if (mainMenu) {
        main_menu();
    }

    if (gameMenu) {
        game_menu();
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