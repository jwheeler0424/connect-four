/**
 * ------------------------------------------------------------
 * Connect Four Requests Controller JS
 * ------------------------------------------------------------
 * 
 * @author Jonathan Wheeler <jwheeler0424@mail.fresnostate.edu>
 */

export const postRequest = (url, data) => new Promise((resolve, reject) => {
    const request = new XMLHttpRequest(); // create the object
    
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // console.log(this.responseText)
            resolve(JSON.parse(this.responseText))
        } else if (this.readyState === 4) {
            reject("An error occured while sending this request.")
        }
    }

    request.open("POST", url, true);
    request.send(data);
})

export const getRequest = (url, data) => new Promise((resolve, reject) => {
    const request = new XMLHttpRequest(); // create the object

    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            resolve(JSON.parse(this.responseText))
        } else if (this.readyState === 4) {
            reject("An error occured while sending this request.")
        }
    }

    const dataString = data
      .map(x => `${encodeURIComponent(x[0])}=${encodeURIComponent(x[1])}`)
      .join('&');

    // Modification of the URL so it embeds information to be retrieve by URL
    request.open('GET',url + '?data=' + dataString);
    request.send(); 
});