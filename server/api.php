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
        break;
    case 'getLeaderboard':
        break;
    default:
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid API request submitted.'
        ]);
}