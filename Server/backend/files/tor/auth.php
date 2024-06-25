<?php
class auth {
    protected $conn;

    public function __construct($servername, $username, $password, $dbname) {
        $this->conn = new mysqli($servername, $username, $password, $dbname);

        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }
    }

    public function checkValueInDB($value) {
        $stmt = $this->conn->prepare("SELECT * FROM User WHERE password = ?");
        if ($stmt === false) {
          die("Error preparing statement: " . $this->conn->error);
        }
        
        $stmt->bind_param("s", $value);

        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
                    return true;
        }

        return false;
    }
}
?>

