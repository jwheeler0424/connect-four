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
     * @param form  The login form element
     */
    login(form)
    {
        const request = new XMLHttpRequest();
        let formData = new FormData(form);

        request.addEventListener('loadend', (e) => {
            console.log(e.target.response)
        })
        
        request.open('post', './server/login.php');
        request.send(formData)
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

        request.addEventListener('loadend', (e) => {
            console.log(e.target.response)
        })
        
        request.open('post', './server/register.php');
        request.send(formData)
    }
}