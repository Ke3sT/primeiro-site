<?php
require 'conexao.php';
require 'validacoes.php';

if (!isset($_POST['licencaCodigo']) && !isset($_POST['licencaMaxIps']) && !isset($_POST['licencaQualquerIp'])) {
    die("Erro em receber os dados");
}

$chave = $_POST['licencaCodigo'];
$maxips = $_POST['licencaMaxIps'];
$qualquerip = $_POST['licencaQualquerIp'];

$resposta = array();

$resposta['dadosLicenca'] = ['licencaCodigo' => $chave, 'licencaMaxIps' => $maxips, 'licencaQualquerIp' => $qualquerip];

//Verifico se nao deu erro na criacao da tabela
$resposta['chaveInvalida'] = 0;
if (!validarChave($chave)) {
    $resposta['chaveInvalida'] = 1;
} else {
    $resposta['erroMySQLInsert'] = 0;
    $query = "INSERT INTO licencas(chave, maximoIPs, permitirQualquerIp) VALUES('$chave', '$maxips', $qualquerip)";
    if (!$conexaoMySQL->query($query)) {
        //Erro no insert de dados
        $resposta['erroMySQLInsert'] = 1;
        $resposta['erroMySQLInsertMotivo'] = $conexaoMySQL->error;
    } else {
        $resposta['sucessoInsert'] = 1;
    }
}

echo json_encode($resposta);
