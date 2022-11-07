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

    login(username, password)
    {
        const request = new XMLHttpRequest();
        let formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        request.addEventListener('loadend', (e) => {
            console.log(e.target.response)
        })
        
        request.open('post', './server/login.php');
        request.send(formData)
    }

}