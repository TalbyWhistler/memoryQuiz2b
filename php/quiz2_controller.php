<?php 
        include 'quiz2_operations.php';
        $rawInput=file_get_contents('php://input');
        $jsonInput=json_decode($rawInput,true);
        $function=$jsonInput["function"];
        $outputMessage='No function executed';
        switch($function)
        {
            case("testo"):
                {
                    $outputMessage='controller test successful';
                    break;
                }
            case("fetchRecordsList"):
                    {
                        $params=$jsonInput["params"];
                      //  $figure=$params["figure"];
                        $outputMessage=fetchRecordsList();
                    //    $outputMessage=fetchRecordsList();
                        break;
                    }
            case("fetchDataAndMetadata"):
                {
                    $params=$jsonInput["params"];
                    $figure=$params["figure"];
                    $outputMessage=fetchDataAndMetadata($figure);
                    break;
                }
        }
    echo json_encode($outputMessage);
?>