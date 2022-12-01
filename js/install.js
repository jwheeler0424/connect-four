/**
 * ------------------------------------------------------------
 * Connect Four - JS Database Check
 * ------------------------------------------------------------
 */

export const checkInstall = new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            resolve(JSON.stringify(JSON.parse(this.responseText).installed))
        }
    }

    request.open("GET", "../server/install.php");
    request.send();
});