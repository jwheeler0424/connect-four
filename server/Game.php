<?php
/**
 * ------------------------------------------------------------
 * Connect Four - Game Class
 * ------------------------------------------------------------
 * 
 * Group Members:
 *  @author Aakash Sharma       <aakash6177@mail.fresnostate.edu>
 *  @author Jonathan Wheeler    <jwheeler0424@mail.fresnostate.edu>
 */
include_once 'Database.php';

class Game implements JsonSerializable
{
    public Int $id;             // ID
    public String $user_id;     // userID
    public Bool $win;           // Win
    public Int $time;           // Game Length
    public Int $moves;          // Move Count

    public function __construct($user_id, $win, $time, $moves, $id=-1)
    {
        $this->user_id = $user_id;
        $this->win = $win;
        $this->time = $time;
        $this->moves = $moves;
        $this->id = $id;
    }

    public function create()
    {
        // Create database instance
        $db = new Database();
        $attributes = $this->attributes();
        $params = array_map(fn($attr) => ":$attr", $attributes);

        $db->query("INSERT INTO games (`". implode('`,`', $attributes) ."`) 
                      VALUES (". implode(',', $params) .")");

        foreach ($attributes as $attribute) {
            $db->bind(":$attribute", $this->{$attribute});
        }
        $db->execute();
        $this->id = $db->lastInsertId();

        return $this;
    }

    public function save()
    {
        // Create database instance
        $db = new Database();
        $attributes = $this->attributes();
        $params = array_map(fn($attr) => "`$attr`=:$attr", $attributes);

        $db->query("UPDATE games
                    SET". implode(',', $params) ."
                    WHERE id=". $this->id .";");

        foreach ($attributes as $attribute) {
            $db->bind(":$attribute", $this->{$attribute});
        }
        $db->execute();
        
        return $this;
    }

    public function delete()
    {
        $db = new Database();
        $db->query("DELETE FROM games
                    WHERE id=". $this->id .";");
        
        $db->execute();
        return true;
    }

    public static function getFew()
    {
        $db = new Database();
        $db->query("SELECT * FROM games LIMIT 10;");
        $results = $db->getMany();
        $games = [];

        foreach($results as $result) {
            $game = new Game(
                $result->user_id, 
                $result->win, 
                $result->time, 
                $result->moves, 
                $result->id
            );
            $games[] = $game;
        }
        return $games;
    }

    public static function findByID($id = -1)
    {
        $db = new Database();
        $db->query("SELECT * FROM games
                    WHERE id=". $id .";");

        $result = $db->getOne();
        if ($result) {
            $game = new Game(
                $result->user_id, 
                $result->win, 
                $result->time, 
                $result->moves, 
                $result->id
            );
            return $game;
        }
        return false;
    }

    public static function mostWins()
    {
        $db = new Database();
        $db->query("SELECT `user_id`, SUM(win) as wins FROM games
                    GROUP BY `user_id`
                    ORDER BY wins DESC
                    LIMIT 10;");

        $results = $db->getMany();
        
        return $results;
    }

    public static function fastestGames()
    {
        $db = new Database();
        $db->query("SELECT `user_id`, `time` FROM games
                    WHERE `win` = 1
                    ORDER BY `time` ASC
                    LIMIT 10;");

        $results = $db->getMany();
        
        return $results;
    }

    public static function leastMoves()
    {
        $db = new Database();
        $db->query("SELECT `user_id`, `moves` FROM games
                    WHERE `win` = 1
                    ORDER BY `moves`, `time` ASC
                    LIMIT 10;");

        $results = $db->getMany();
        
        return $results;
    }
    
    public function jsonSerialize(): mixed
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'win' => $this->win,
            'time' => $this->time,
            'moves' => $this->moves
        ];
    }

    /**
     * A method to return an array of database columns as attributes
     *
     * @return  array
     */
    public function attributes(): array
    {
    return ['user_id', 'win', 'time', 'moves'];
    }
}