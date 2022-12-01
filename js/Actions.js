/**
 * ------------------------------------------------------------
 * Connect Four - Actions Controller JS
 * ------------------------------------------------------------
 * 
 * @author Jonathan Wheeler <jwheeler0424@mail.fresnostate.edu>
 */
import { handleDisplay } from "./Display.js";
import { postRequest } from "./request.js";

export const navigate = ( page = 'menu' ) => {
    handleDisplay(page);
}

export const loginUser = async (e) => {
    e.preventDefault();
    const loginForm = e.target;
    const data = new FormData(loginForm);
    
    const response = await postRequest("../server/login.php", data);
    if (response.status === 'success') {
        console.log(response);
    } else {
        console.log(response);
    }
}