<?php
/**
 * Database Class
 * 
 * @author Jonathan Wheeler <jwheeler0424@mail.fresnostate.edu>
 */
include_once('./config.php');
use PDO;
use PDOException;

class Database
{

    protected $pdo;
    protected $statement;
    protected $error;


    public function __construct()
    {
        // Set the DSN
        $dsn = 'mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';';
        $options = [
            PDO::ATTR_PERSISTENT => true,
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ];
        
        // Create a PDO instance
        try {
            $this->pdo = new PDO($dsn, DB_USER, DB_PASSWORD, $options);
        } catch (PDOException $e) {
            $this->error = $e->getMessage();
            echo $this->error;
        }

    }

    /**
     * Prepare the PDO statement with a SQL Query
     *
     * @param   string      $sql            A SQL query string
     * 
     * @return  void
     */
    public function query(string $sql)
    {
        $this->statement = $this->pdo->prepare($sql);
    }

    /**
     * A function to bind the values to the prepared state using
     * named parameters
     *
     * @param   string      $param          The value parameter to find where to insert value
     * @param   mixed       $value          The value to be inserted
     * @param   mixed       $type           The type of data of the value
     * 
     * @return  void
     */
    public function bind($param, $value, $type = null)
    {
        // If the $type is null, try to verify data type
        if (is_null($type)) {
            switch(true) {
                case is_int($value):
                    $type = PDO::PARAM_INT;
                    break;
                case is_bool($value):
                    $type = PDO::PARAM_BOOL;
                    break;
                case is_null($value):
                    $type = PDO::PARAM_NULL;
                    break;
                default:
                    $type = PDO::PARAM_STR;
            }
        }

        $this->statement->bindValue($param, $value, $type);
    }

    /**
     * Execute the prepared statement
     *
     * @return  object
     */
    public function execute()
    {
        return $this->statement->execute();
    }

    /**
     * Return multiple records from the PDO query
     *
     * @return  array
     */
    public function getMany()
    {
        $this->execute();
        return $this->statement->fetchAll(PDO::FETCH_OBJ);
    }

    /**
     * Return a single record from the PDO query
     *
     * @return  object
     */
    public function getOne()
    {
        $this->execute();
        return $this->statement->fetch(PDO::FETCH_OBJ);
    }

    /**
     * Get the record count from the PDO query
     *
     * @return  int
     */
    public function rowCount()
    {
        return $this->statement->rowCount();
    }

}