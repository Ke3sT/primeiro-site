<?php

require '../../__login/conexao.php';

if (!isset($_POST['id'])) {
    die("Erro em receber os dados");
}

$licencaID = $_POST['id'];

$resposta = array();
$resposta['erroMySQL'] = 0;

//Verifico se a tabela de licencas existe
$query = "SELECT * from licencas";
if (!$conexaoMySQL->query($query)) {
    $resposta['erroMySQL'] = 1;
    $resposta['motivoErro'] = $conexaoMySQL->error;
} else {

    $query = "DELETE FROM licencas WHERE id = " . $licencaID;
    if ($conexaoMySQL->query($query)) {
        $resposta['sucesso'] = 1;
    } else {
        $resposta['sucesso'] = 0;
        $resposta['motivoErro'] = $conexaoMySQL->error;
    }
}

echo json_encode($resposta);
