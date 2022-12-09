<?php
/**
 * ------------------------------------------------------------
 * Connect Four API
 * ------------------------------------------------------------
 * 
 * Group Members:
 *  @author Aakash Sharma       <aakash6177@mail.fresnostate.edu>
 *  @author Jonathan Wheeler    <jwheeler0424@mail.fresnostate.edu>
 */

include_once 'Database.php';
include_once 'Player.php';
include_once 'Game.php';

// Start the session
session_start();

$method = $_POST['api'];

switch($method)
{
    case 'getPlayer':

        if (isset($_SESSION['uid']) || isset($_SESSION['isLoggedIn'])) {
           $player = Player::findByID($_SESSION['uid'] ?? -1);
            if ($player) {
                $player->loggedIn = true;
                echo json_encode([
                    'status' => 'success',
                    'message' => 'User has been successfully logged in.',
                    'player' => [
                        "id" => $player->id,
                        "name" => $player->name,
                        "username" => $player->username,
                        "loggedIn" => true
                    ]
                ]);
            } else {
                echo json_encode([
                    'status' => 'failed',
                    'message' => 'No user is currently logged in.'
                ]);
            }
        } else {
            echo json_encode([
                'status' => 'failed',
                'message' => 'No user is currently logged in.'
            ]);
        }
        break;
    case 'loginUser':
        $username = $_POST['username'] ?? '';
        $password = $_POST['password'] ?? '';
        $player = Player::findByUsername($username);

        if ($player && $player->password == $password) {
            if (!isset($_SESSION['uid']) || !isset($_SESSION['isLoggedIn']) || !$player->loggedIn) {
                $_SESSION['uid'] = $player->id;
                $_SESSION['isLoggedIn'] = true;
                $player->loggedIn = true;
            }
            echo json_encode([
                'status' => 'success',
                'message' => 'User has been successfully logged in.',
                'player' => $player
            ]);
        } else  {
            echo json_encode([
                'status' => 'failed',
                'message' => 'Incorrect username or password'
            ]);
        }

        
        
        break;
    case 'logoutUser':
        if (isset($_SESSION['uid']) || isset($_SESSION['isLoggedIn'])) {
            unset($_SESSION["uid"]);
            unset($_SESSION["isLoggedIn"]);
        }
        echo json_encode([
            'status' => 'success',
            'message' => 'User has been successfully logged out.'
        ]);
        break;
    case 'loggedIn':
        $loggedIn = $_SESSION['isLoggedIn'] ?? false;
        echo json_encode([
            'status' => 'success',
            'message' => $loggedIn
        ]);
        break;
    case 'registerUser':
        $name = $_POST['name'] ?? '';
        $username = $_POST['username'] ?? '';
        $password = $_POST['password'] ?? '';

        $player = new Player($username, $password, false, $name);
        $player->create();

        if (!isset($_SESSION['uid']) || !isset($_SESSION['isLoggedIn']) || !$player->loggedIn) {
            $_SESSION['uid'] = $player->id;
            $_SESSION['isLoggedIn'] = true;
            $player->loggedIn = true;
        }

        echo json_encode([
            'status' => 'success',
            'message' => 'User has been successfully registered.',
            'player' => $player
        ]);
        break;
    case 'addGameData':
        $user_id = $_POST['user_id'];
        $win = $_POST['win'] === 'true' ? true : false;
        $time = intval($_POST['time']);
        $moves = intval($_POST['moves']);

        $game = new Game($user_id, $win, $time, $moves);
        $game->create();

        echo json_encode([
            'status' => 'success',
            'message' => 'Game has been successfully saved.',
            'game' => $game
        ]);
        break;
    case 'getMostWins':
        $games = Game::mostWins();
        $leaders = [];
        foreach($games as $game) {
            $player = Player::findByID($game->user_id);
            $leaders[] = [
                'player' => $player->username,
                'wins' => intval($game->wins)
            ];
        }
        echo json_encode([
            'status' => 'success',
            'message' => 'Players ordered by most wins.',
            'leaders' => $leaders
        ]);
        break;
    case 'getFastestGames':
        $games = Game::fastestGames();
        $leaders = [];
        foreach($games as $game) {
            $player = Player::findByID($game->user_id);
            $leaders[] = [
                'player' => $player->username,
                'time' => intval($game->time)
            ];
        }
        echo json_encode([
            'status' => 'success',
            'message' => 'Players ordered by fastest win times.',
            'leaders' => $leaders
        ]);
        break;
    case 'getLeastMoves':
        $games = Game::leastMoves();
        $leaders = [];
        foreach($games as $game) {
            $player = Player::findByID($game->user_id);
            $leaders[] = [
                'player' => $player->username,
                'moves' => intval($game->moves)
            ];
        }
        echo json_encode([
            'status' => 'success',
            'message' => 'Players ordered by least win moves.',
            'leaders' => $leaders
        ]);
        break;
    default:
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid API request submitted.'
        ]);
}