<?php 
    include 'tools.php';

    $scriptLink='<script src=js/quiz2Scripts.js></script>';
    $pageHeadline='<h2>Memory Table Quizes</h2>';
    $buttonOutput=createElement('p','buttonOutputArea','outputArea','');
    $tableOutput=createElement('p','quizTableOutput','outputArea','');
    $rightWrong=createElement('p',"rightWrongStatus","statusIndicator",'--:');
    $wrongCount=createElement('p',"wrongCount","statusIndicator","Wrong Answers: 0");

    $pageContents=''
            .$pageHeadline 
            .$scriptLink
            .$buttonOutput
            .$rightWrong
            .$wrongCount
            .$tableOutput;
    echo $pageContents


    ?>