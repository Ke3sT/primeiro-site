<?php

//Variavel pra saber se esta conectado ou nao
$estaConectado = false;

//Crio uma instancia
//$conexaoMySQL = new mysqli("localhost", "u121704082_keest", "Xablau666");
$conexaoMySQL = new mysqli("localhost", "root", "");

//Verifico se conseguiu se conectar ao host.
if (!$conexaoMySQL->connect_errno) {
    //Caso a conexao esteja estabelecida, executa abaixo

    //Verifico a conexao com um banco de dados e se a database e tabela necessarias existem.
    //if (!$conexaoMySQL->select_db("u121704082_painel")) {
    if (!$conexaoMySQL->select_db("painel")) {

        //$query = "CREATE DATABASE painel;";
        //$conexaoMySQL->query($query); aaa
        if (!$conexaoMySQL->query("SELECT * FROM usuarios")) {
            //echo "</br>Tabela usuarios nao encontrado. Criando...";
            $query = "CREATE TABLE usuarios(id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(30) NOT NULL, login VARCHAR(15) NOT NULL, senha VARCHAR(12) NOT NULL, nome VARCHAR(20) NOT NULL);";
            $conexaoMySQL->query($query);
        }

        if (!$conexaoMySQL->query("SELECT * FROM licencas")) {
            //Tabela de licencas nao existe

            //Tento criar a tabela
            $query = "CREATE TABLE usuarios(id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(30) NOT NULL, login VARCHAR(15) NOT NULL, senha VARCHAR(12) NOT NULL, nome VARCHAR(20) NOT NULL);";
            if (!$conexaoMySQL->query($query)) {
                die("Erro ao criar tabela no banco de dados. Motivo: " . $conexaoMySQL->error);
            }
        }
    }
    $estaConectado = true;
}

function estaConectado()
{
    global $estaConectado;
    return $estaConectado;
}
