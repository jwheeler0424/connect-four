<?php
/**
 * Connect Four installation file
 * 
 * @author Jonathan Wheeler <jwheeler0424@mail.fresnostate.edu>
 */

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
    `id`        int AUTO_INCREMENT NOT NULL ,
    `name`      varchar(128) NOT NULL ,
    `username`  varchar(128) NOT NULL ,
    `password`  varchar(255) NOT NULL ,

    PRIMARY KEY (`id`)
);";

$statement = $pdo->prepare($sql);
$statement->execute();

// Create leaderbaord table
$sql = "CREATE TABLE IF NOT EXISTS `games`
(
    `id`        int AUTO_INCREMENT NOT NULL ,
    `user_id`   int NOT NULL ,
    `win`       boolean NOT NULL ,
    `time`      timestamp NOT NULL ,

    PRIMARY KEY (`id`) ,
    FOREIGN KEY (`user_id`)
);";

$statement = $pdo->prepare($sql);
$statement->execute();

