<?php
/**
 * Player login php
 * 
 * @author Jonathan Wheeler <jwheeler0424@mail.fresnostate.edu>
 */
//include_once('./Database.php');
//date_default_timezone_set('America/Los_Angeles');
$date = new DateTime();

// echo $_POST['username'];
echo json_encode([
    'username' => $_POST['username'],
    'date' => $date
]);