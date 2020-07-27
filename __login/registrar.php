<?php
require 'conexao.php';

if (estaConectado()) {
    //Verifico se as variaveis foram enviadas ao post
    if (isset($_POST['usuario']) && isset($_POST['nome']) && isset($_POST['email']) && isset($_POST['senha'])) {
        $usuario = $_POST['usuario'];
        $nome = $_POST['nome'];
        $email = $_POST['email'];
        $senha = $_POST['senha'];

        //Array onde retorno os dados pra quem requisitou
        $retornoDados = array();
        $retornoDados['registroStatus'] = 0;

        //Verifico se o usuario já existe(login)
        $query = "SELECT nome FROM usuarios WHERE login = '" . $usuario . "'";
        if ($conexaoMySQL->query($query)->num_rows != 0) {
            $retornoDados['registroStatus'] = 1;
        } else {

            //Verifico se o email já existe
            $query = "SELECT nome FROM usuarios WHERE email = '" . $email . "'";
            if ($conexaoMySQL->query($query)->num_rows != 0) {
                $retornoDados['registroStatus'] = 2;
            }
        }

        //Se o registroStatus ainda for 0, isso significa que o nome de usuario e o email nao existem
        //Prossegue pro registro
        if ($retornoDados['registroStatus'] == 0) {

            //Tento dar insert no banco de dados
            $query = "INSERT INTO usuarios(email, login, senha, nome) VALUES('$email', '$usuario', '$senha', '$nome')";
            if ($conexaoMySQL->query($query)) {
                //Sucesso na insercao de dados.

            } else {
                //Erro na insecao de dados.
                $retornoDados['registroStatus'] = 3;
                $retornoDados['motivoErro'] = $conexaoMySQL->error;
            }
        }

        //Retorno os dados em formato json
        echo json_encode($retornoDados);
    }
}
