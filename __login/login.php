<?php
require 'conexao.php';

if (isset($_POST['usuario']) && isset($_POST['senha'])) {

    $usuario = $_POST['usuario'];
    $senha = $_POST['senha'];
    $lembrarlogin = $_POST['lembrarlogin'];

    $query = "SELECT * FROM usuarios WHERE login = '" . $usuario . "';";
    $resultado = $conexaoMySQL->query($query);

    $retornoDados = array();

    if ($resultado->num_rows != 0) {
        $resultado = $resultado->fetch_assoc();

        if ($senha == $resultado['senha']) {
            $retornoDados['loginStatus'] = 2;
            $retornoDados['login'] = $resultado['login'];
            $retornoDados['nome'] = $resultado['nome'];

            //Se a sessao foi iniciada, eu salvo os dados na sessao pra recarregar a pagina
            session_start();
            $_SESSION['estaLogado'] = true;
            $_SESSION['idUsuario'] =  $resultado['id'];
        } else {
            $retornoDados['loginStatus'] = 1;
        }
    } else {
        $retornoDados['loginStatus'] = 0;
    }
}

echo json_encode($retornoDados);
