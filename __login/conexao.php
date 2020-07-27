<?php

//Variavel pra saber se esta conectado ou nao
$estaConectado = false;

//Crio uma instancia
$conexaoMySQL = new mysqli("localhost", "root", "");

//Verifico se conseguiu se conectar ao host.
if (!$conexaoMySQL->connect_errno) {
    //Caso a conexao esteja estabelecida, executa abaixo

    //Verifico a conexao com um banco de dados e se a database e tabela necessarias existem.
    if (!$conexaoMySQL->select_db("painel")) {

        $query = "CREATE DATABASE painel;";
        $conexaoMySQL->query($query);

        if ($conexaoMySQL->errno != 0) {
            echo "Erro ao criar a tabela";
        } else {
            //echo "</br>Database painel criado com sucesso.";
            $conexaoMySQL->select_db("painel");
        }

        if (!$conexaoMySQL->query("SELECT * FROM usuarios")) {
            //echo "</br>Tabela usuarios nao encontrado. Criando...";
            $query = "CREATE TABLE usuarios(id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(30) NOT NULL, login VARCHAR(15) NOT NULL, senha VARCHAR(12) NOT NULL, nome VARCHAR(20) NOT NULL);";
            $conexaoMySQL->query($query);
        }
    }

    $estaConectado = true;
}

function estaConectado()
{
    global $estaConectado;
    return $estaConectado;
}
