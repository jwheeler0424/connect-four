<?php
/**
 * ------------------------------------------------------------
 * Connect Four - Player Class
 * ------------------------------------------------------------
 * 
 * Group Members:
 *  @author Aakash Sharma       <aakash6177@mail.fresnostate.edu>
 *  @author Jonathan Wheeler    <jwheeler0424@mail.fresnostate.edu>
 */
include_once 'Database.php';

class Player implements JsonSerializable
{
    public Int $id;             // ID
    public String $name;        // Name
    public String $username;    // Username
    public String $password;    // Password
    public Bool $loggedIn;      // isLoggedIn

    public function __construct($username, $password, $loggedIn=false, $name='', $id=-1)
    {
        $this->username = $username;
        $this->password = $password;
        $this->loggedIn = $loggedIn;
        $this->name = $name;
        $this->id = $id;
    }

    public function create()
    {
        // Create database instance
        $db = new Database();
        $attributes = $this->attributes();
        $params = array_map(fn($attr) => ":$attr", $attributes);

        $db->query("INSERT INTO users (`". implode('`,`', $attributes) ."`) 
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
        // Check for picture and upload

        // Create database instance
        $db = new Database();
        $attributes = $this->attributes();
        $params = array_map(fn($attr) => "`$attr`=:$attr", $attributes);

        $db->query("UPDATE users
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
        $db->query("DELETE FROM users
                    WHERE id=". $this->id .";");
        
        $db->execute();
        return true;
    }

    public static function findByID($id = -1)
    {
        $db = new Database();
        $db->query("SELECT * FROM users
                    WHERE id=". $id .";");

        $result = $db->getOne();
        if ($result) {
            $player = new Player(
                $result->username, 
                $result->password, 
                false, 
                $result->name, 
                $result->id
            );
            return $player;
        }
        return false;
    }
    
    public static function findByUsername($username = '')
    {
        $db = new Database();
        $db->query("SELECT * FROM users
                    WHERE username = '".$username."' ;");

        $result = $db->getOne();
        if ($result) {
            $player = new Player(
                $result->username, 
                $result->password, 
                false, 
                $result->name, 
                $result->id
            );
            return $player;
        }
        return false;
    }
    
    public function jsonSerialize(): mixed
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'username' => $this->username,
            'password' => $this->password,
            'loggedIn' => $this->loggedIn
        ];
    }

    /**
     * A method to return an array of database columns as attributes
     *
     * @return  array
     */
    public function attributes(): array
    {
    return ['username', 'password', 'name'];
    }
}