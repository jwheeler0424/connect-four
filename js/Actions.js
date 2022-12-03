/**
 * ------------------------------------------------------------
 * Connect Four - Actions Controller JS
 * ------------------------------------------------------------
 * 
 * @author Jonathan Wheeler <jwheeler0424@mail.fresnostate.edu>
 */
import { Player } from "./Player.js";

export const loginUser = async (loginForm) => {
    let player = await new Player().getPlayer();
    
    if (!player.loggedIn) {
        const data = new FormData(loginForm);
        data.append('api', 'loginUser');
        
        await player.login(data);

        if (!player.loggedIn) {
            return 'failed';
        } else {
            return 'success'
        }
    } else  {
        window.location.href('../');
    }
}

export const registerUser = async (registerForm) => {
    let player = await new Player().getPlayer();

    if (!player.loggedIn) {
        const data = new FormData(registerForm);
        data.append('api', 'registerUser');

        await player.register(data);
        
        if (!player.loggedIn) {
            return 'failed';
        } else {
            return 'success';
        }
    } else  {
        window.location.href('../');
    }
}