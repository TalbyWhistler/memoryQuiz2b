<?php 
    include 'tools.php';

    $scriptLink='<script src=js/quiz2Scripts.js></script>';
    $pageHeadline='<h1>FRONTEND</h1>';
    $buttonOutput=createElement('p','buttonOutputArea','outputArea','');
    $tableOutput=createElement('p','quizTableOutput','outputArea','');

    $pageContents=''
            .$pageHeadline 
            .$scriptLink
            .$buttonOutput
            .$tableOutput;
    echo $pageContents


    ?>