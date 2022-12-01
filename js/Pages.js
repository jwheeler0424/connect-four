/**
 * ------------------------------------------------------------
 * Connect Four - Pages JS
 * ------------------------------------------------------------
 * 
 * @author Jonathan Wheeler <jwheeler0424@mail.fresnostate.edu>
 */

import { Player } from "./Player.js";
import { navigate, loginUser } from "./Actions.js";

export const loginPage = () => {
    const appRoot = document.getElementById('app');
    let header, section, label, input;
    
    // Clear page html
    appRoot.innerHTML = '';

    // Create page header
    header = document.createElement('header');
    header.innerHTML = `<h2>Login User</h2>`;

    // Create page display section
    section = document.createElement('section');
    section.setAttribute('class', 'login');

    // Create menu button
    let menuBtn = document.createElement('button');
    menuBtn.setAttribute('id', 'menu-btn');
    menuBtn.innerText = 'Main Menu';
    menuBtn.addEventListener('click', e => {
        e.preventDefault();
        navigate('menu');
    });

    header.appendChild(menuBtn);

    // Create login form
    const loginForm = document.createElement('form');
    loginForm.setAttribute('id', 'login-form');

    // Create username fieldset
    const usernameField = document.createElement('fieldset');
    label = document.createElement('label');
    label.setAttribute('for', 'username');
    label.innerText = 'Username';

    input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('id', 'username');
    input.setAttribute('name', 'username');
    input.setAttribute('required', true);

    usernameField.append(label, input);

    // Create password fieldset
    const passwordField = document.createElement('fieldset');
    label = document.createElement('label');
    label.setAttribute('for', 'password');
    label.innerText = 'Password';

    input = document.createElement('input');
    input.setAttribute('type', 'password');
    input.setAttribute('id', 'password');
    input.setAttribute('name', 'password');
    input.setAttribute('required', true);

    passwordField.append(label, input);

    const submitBtn = document.createElement('button');
    submitBtn.setAttribute('type', 'submit');
    submitBtn.innerText = 'Login';

    loginForm.append(usernameField, passwordField, submitBtn);
    loginForm.addEventListener('submit', loginUser);

    section.append(loginForm);
    
    appRoot.append(header, section);
}

export const registerPage = () => {
    const appRoot = document.getElementById('app');
    let header, section;
    
    // Clear page html
    appRoot.innerHTML = '';

    // Create page header
    header = document.createElement('header');
    header.innerHTML = `<h2>Register User</h2>`;

    // Create page display section
    section = document.createElement('section');
    section.setAttribute('class', 'register');

    // Create menu button
    let menuBtn = document.createElement('button');
    menuBtn.setAttribute('id', 'menu-btn');
    menuBtn.innerText = 'Main Menu';
    menuBtn.addEventListener('click', e => {
        e.preventDefault();
        navigate('menu');
    });

    header.appendChild(menuBtn);
    
    appRoot.appendChild(header);
    appRoot.appendChild(section);
}

export const gamePage = () => {
    const appRoot = document.getElementById('app');
    let header, section;
    
    // Clear page html
    appRoot.innerHTML = '';

    // Create page header
    header = document.createElement('header');
    header.innerHTML = `<h2>Game</h2>`;

    // Create page display section
    section = document.createElement('section');
    section.setAttribute('class', 'game');

    // Create menu button
    let menuBtn = document.createElement('button');
    menuBtn.setAttribute('id', 'menu-btn');
    menuBtn.innerText = 'Main Menu';
    menuBtn.addEventListener('click', e => {
        e.preventDefault();
        navigate('menu');
    });

    header.appendChild(menuBtn);
    
    appRoot.appendChild(header);
    appRoot.appendChild(section);
}

export const leaderboardPage = () => {
    const appRoot = document.getElementById('app');
    let header, section;
    
    // Clear page html
    appRoot.innerHTML = '';

    // Create page header
    header = document.createElement('header');
    header.innerHTML = `<h2>Leaderboard</h2>`;

    // Create page display section
    section = document.createElement('section');
    section.setAttribute('class', 'leaderboard');

    // Create menu button
    let menuBtn = document.createElement('button');
    menuBtn.setAttribute('id', 'menu-btn');
    menuBtn.innerText = 'Main Menu';
    menuBtn.addEventListener('click', e => {
        e.preventDefault();
        navigate('menu');
    });

    header.appendChild(menuBtn);
    
    appRoot.appendChild(header);
    appRoot.appendChild(section);
}

export const menuPage = () => {
    const appRoot = document.getElementById('app');
    const player = Player.getPlayer;
    let header, section;
    
    // Clear page html
    appRoot.innerHTML = '';

    // Create page header
    header = document.createElement('header');
    header.innerHTML = `<h2>Main Menu</h2>`;

    // Create page display section
    section = document.createElement('section');
    section.setAttribute('class', 'menu');

    let welcomeMessage = document.createElement('p');
    welcomeMessage.innerText = `Welcome ${player ? player.username : 'Guest'}, please select an option.`;

    // Create menu buttons
    let loginBtn, logoutBtn, registerBtn, playBtn, playGuestBtn, leaderBtn;
    loginBtn = document.createElement('button');
    loginBtn.setAttribute('id', 'login-btn');
    loginBtn.innerText = 'Login';
    loginBtn.addEventListener('click', e => {
        e.preventDefault();
        navigate('login');
    });

    logoutBtn = document.createElement('button');
    logoutBtn.setAttribute('id', 'logout-btn');
    logoutBtn.innerText = 'Logout';
    logoutBtn.addEventListener('click', e => {
        e.preventDefault();
        logoutUser();
        navigate('menu');
    });

    registerBtn = document.createElement('button');
    registerBtn.setAttribute('id', 'register-btn');
    registerBtn.innerText = 'Register';
    registerBtn.addEventListener('click', e => {
        e.preventDefault();
        navigate('register');
    });

    playBtn = document.createElement('button');
    playBtn.setAttribute('id', 'play-btn');
    playBtn.innerText = 'Play Now';
    playBtn.addEventListener('click', e => {
        e.preventDefault();
        navigate('game');
    });

    playGuestBtn = document.createElement('button');
    playGuestBtn.setAttribute('id', 'play-guest-btn');
    playGuestBtn.innerText = 'Play as Guest';
    playGuestBtn.addEventListener('click', e => {
        e.preventDefault();
        navigate('game');
    });

    leaderBtn = document.createElement('button');
    leaderBtn.setAttribute('id', 'leaderboard-btn');
    leaderBtn.innerText = 'Leaderboard';
    leaderBtn.addEventListener('click', e => {
        e.preventDefault();
        navigate('leaderboard');
    });

    section.innerHTML = '';
    section.appendChild(welcomeMessage);

    if (player) {
        section.appendChild(playBtn);
        section.appendChild(leaderBtn);
        section.appendChild(logoutBtn);
    } else {
        section.appendChild(loginBtn);
        section.appendChild(registerBtn);
        section.appendChild(playGuestBtn);
        section.appendChild(leaderBtn);
    }

    appRoot.appendChild(header);
    appRoot.appendChild(section);
}