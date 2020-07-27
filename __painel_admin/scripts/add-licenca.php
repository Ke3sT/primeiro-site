<?php
require '../../__login/conexao.php';
require 'validacoes.php';

if (!isset($_POST['licencaCodigo']) && !isset($_POST['licencaMaxIps']) && !isset($_POST['licencaQualquerIp'])) {
    die("Erro em receber os dados");
}

$chave = $_POST['licencaCodigo'];
$maxips = $_POST['licencaMaxIps'];
$qualquerip = $_POST['licencaQualquerIp'];

$resposta = array();

$resposta['dadosLicenca'] = ['licencaCodigo' => $chave, 'licencaMaxIps' => $maxips, 'licencaQualquerIp' => $qualquerip];

$resposta['erroMySQLCreate'] = 0;
//Verifico se a tabela de licencas existe
$query = "SELECT * from licencas";
if (!$conexaoMySQL->query($query)) {
    //echo "Tabela de licenca nao existe";
    $resposta['erroMySQLCreate'] = 1;

    //Tento criar a tabela
    $query = "CREATE TABLE licencas(id INT PRIMARY KEY AUTO_INCREMENT, chave VARCHAR(19), maximoIPs SMALLINT, permitirQualquerIp BOOLEAN)";
    if (!$conexaoMySQL->query($query)) {
        $resposta['erroMySQLCreate'] = 1;
        $resposta['erroMySQLCreateMotivo'] = $conexaoMySQL->error;
    } else {
        $resposta['erroMySQLCreate'] = 0;
    }
}

//Verifico se nao deu erro na criacao da tabela
if ($resposta['erroMySQLCreate'] == 0) {

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
}

echo json_encode($resposta);
