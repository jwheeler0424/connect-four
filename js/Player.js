/**
 * --------------------------------------------------------------------------------
 * Connect Four - Player Class
 * --------------------------------------------------------------------------------
 * 
 */
export class Player
{
    constructor()
    {

    }

    /**
     * A player method that takes the login form element and submits the data
     * to login.php via AJAX. If successful will set player username and id.
     * 
     * Necessary Form Elements:
     *  - username
     *  - password
     * 
     * @param username  The login form username element
     * @param password  The login form password element
     */
    login(username, password)
    {
        const request = new XMLHttpRequest();
        let formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        
        request.open('post', './server/login.php');
        request.send(formData);
        
        request.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                console.log(JSON.parse(this.response))
            }
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
    register(form)
    {
        const request = new XMLHttpRequest();
        let formData = new FormData(form);
        
        request.open('post', './server/register.php');
        request.send(formData);
        
        request.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                console.log(this.responseText)
            }
        }
    }
}