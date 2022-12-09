const fs = require('fs');

let gamesJSON = [];

for (let i=1; i<100; i++) {
    let moves = Math.ceil(Math.random() * 50)
    let obj = {
        "user_id": Math.ceil(Math.random() * 10),
        "win": true,
        "time": Math.round(Math.random() * 100000),
        "moves": moves < 4 ? moves + 4 : moves
    }
    gamesJSON.push(obj)
}

let games = JSON.stringify(gamesJSON);
fs.writeFileSync('./games.json', games);
console.log(gamesJSON)