/**
 * ------------------------------------------------------------
 * Connect Four - View Controller JS
 * ------------------------------------------------------------
 * 
 * @author Jonathan Wheeler <jwheeler0424@mail.fresnostate.edu>
 */

import { loginPage, registerPage, gamePage, leaderboardPage, menuPage } from "./Pages.js";

export const handleDisplay = async (display = 'menu') => {
    localStorage.setItem('display', display);

    switch(display)
    {
        case 'login':
            // Login Form Display
            loginPage();
            break;
        case 'register':
            // Register Form Display
            registerPage();
            break;
        case 'game':
            // Game Board Display
            gamePage();
            break;
        case 'leaderboard':
            // LeaderBoard Display
            leaderboardPage();
            break;
        default:
            // Menu Display
            menuPage();
    }
}

