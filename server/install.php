<?php
/**
 * Connect Four installation file
 * 
 * @author Jonathan Wheeler <jwheeler0424@mail.fresnostate.edu>
 */

include_once('./config.php');

include_once 'Player.php';
include_once 'Game.php';

// Set database connection options
$dsn = 'mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';';
$options = [
    PDO::ATTR_PERSISTENT => false,
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
];

// Create database connection
$pdo = new PDO($dsn, DB_USER, DB_PASSWORD, $options);

// Create database table
$statement = $pdo->prepare('CREATE DATABASE IF NOT EXISTS ' . DB_NAME . ';');
$statement->execute();

// Select database table to use
$statement = $pdo->prepare("USE " . DB_NAME);
$statement->execute();

// Create users table
$sql = "CREATE TABLE IF NOT EXISTS `users`
(
    `id`        int PRIMARY KEY AUTO_INCREMENT NOT NULL ,
    `name`      varchar(128) NOT NULL ,
    `username`  varchar(128) NOT NULL ,
    `password`  varchar(255) NOT NULL
);";

$statement = $pdo->prepare($sql);
$statement->execute();

// Create leaderbaord table
$sql = "CREATE TABLE IF NOT EXISTS `games`
(
    `id`        int PRIMARY KEY AUTO_INCREMENT NOT NULL ,
    `user_id`   int NOT NULL ,
    `win`       boolean NOT NULL ,
    `time`      int NOT NULL ,
    `moves`     int NOT NULL ,
    FOREIGN KEY (user_id) REFERENCES users(id)
);";

$statement = $pdo->prepare($sql);
$statement->execute();

$players = Player::getFew();
if (count($players) <= 0) {
    $playerAr = json_decode(file_get_contents('../users.json'));
    foreach($playerAr as $playerData) {
        $player = new Player($playerData->username, $playerData->password, false, $playerData->name);
        $player = $player->create();
    }
}

$games = Game::getFew();
if (count($games) <= 0) {
    $gameAr = json_decode(file_get_contents('../games.json'));
    foreach($gameAr as $gameData) {
        $game = new Game($gameData->user_id, $gameData->win, $gameData->time, $gameData->moves);
        $game = $game->create();
    }
}

echo json_encode([
    'installed' => true
]);