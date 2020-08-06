<?php

//Variavel pra saber se esta conectado ou nao
$estaConectado = false;

//Crio uma instancia
$conexaoMySQL = new mysqli("localhost", "u121704082_keest", "Xablau666");
//$conexaoMySQL = new mysqli("localhost", "root", "");

//Verifico se conseguiu se conectar ao host.
if (!$conexaoMySQL->connect_errno) {

    //Tento selecionar a database
    if ($conexaoMySQL->select_db("u121704082_painel")) {
        //if ($conexaoMySQL->select_db("painel")) {
        //Se retornar true, a conexao esta estabelecida
        $estaConectado = true;
    }
}

if (estaConectado()) {
    //Verificar se a tabela de usuarios existe
    if (!$conexaoMySQL->query("SELECT * FROM usuarios")) {
        //echo "</br>Tabela usuarios nao encontrado. Criando...";
        $query = "CREATE TABLE usuarios(id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(30) NOT NULL, login VARCHAR(15) NOT NULL, senha VARCHAR(12) NOT NULL, nome VARCHAR(20) NOT NULL);";
        $conexaoMySQL->query($query);
    }

    //Verificar se a tabela de licencas existe
    if (!$conexaoMySQL->query("SELECT * FROM licencas")) {
        //Tabela de licencas nao existe

        //Tento criar a tabela
        $query = "CREATE TABLE licencas(id INT PRIMARY KEY AUTO_INCREMENT, chave VARCHAR(19), maximoIPs SMALLINT, permitirQualquerIp BOOLEAN, ipsPermitidos VARCHAR(200))";
        $conexaoMySQL->query($query);
    }
}

function estaConectado()
{
    global $estaConectado;
    return $estaConectado;
}
