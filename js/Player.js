/**
 * --------------------------------------------------------------------------------
 * Connect Four - Player Class
 * --------------------------------------------------------------------------------
 * 
 */
import { postRequest } from "./request.js";

export class Player
{
    constructor(username = 'guest', name = 'Guest')
    {
        this.username = username;
        this.name = name;
        this.loggedIn = false;
    }

    /**
     * A player method that takes the login form element and submits the data
     * to api.php via AJAX. If successful will set player username and id.
     * 
     * Necessary Form Elements:
     *  - username
     *  - password
     * 
     * @param data  The login form data
     */
    async login(data)
    {
        const response = await postRequest("./server/api.php", data);
        if (response.status === 'success') {
            this.id = response.player.id
            this.username = response.player.username;
            this.name = response.player.name;
            this.loggedIn = true;
        } else {
            this.loggedIn = false;
        }
    }

    /**
     * A player method that takes the register form element and submits the data
     * to register.php via AJAX. If successful will create a user in the database.
     * 
     * Necessary Form Elements:
     *  - name
     *  - username
     *  - password
     * 
     * @param form  The register form element
     */
    async register(data)
    {
        const response = await postRequest("./server/api.php", data);
        
        if (response.status === 'success') {
            this.id = response.player.id
            this.username = response.player.username;
            this.name = response.player.name;
            this.loggedIn = true;
        } else {
            this.loggedIn = false;
        }
    }

    async logout()
    {
        const data = new FormData();
        data.append('api', 'logoutUser');

        const response = await postRequest("./server/api.php", data);
        if (response.status === 'success') {
            this.id = undefined
            this.username = 'guest';
            this.name = 'Guest';
            this.loggedIn = false;
        }
        
        return this;
    }

    async getPlayer()
    {
        const data = new FormData();
        data.append('api', 'getPlayer');

        const response = await postRequest("./server/api.php", data);
        if (response.status === 'success') {
            this.id = response.player.id
            this.username = response.player.username;
            this.name = response.player.name;
            this.loggedIn = true;
        }
        
        return this;
    }
}