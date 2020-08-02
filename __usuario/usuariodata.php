<?php
include __DIR__. '/../__painel_admin/scripts/conexao.php';

function getDataDoUsuario($id)
{
    if (estaConectado()) {
        global $conexaoMySQL;

        $query = "SELECT * FROM usuarios WHERE id = " . $id;
        $resultado = $conexaoMySQL->query($query);

        return $resultado->fetch_assoc();
    } else {
        return null;
    }
}

function estaLogado()
{
    return isset($_SESSION['estaLogado']) && $_SESSION['estaLogado'] ? true : false;
}

class UsuarioData
{

    private $dados;
    private $usuarioId;

    function __construct($idUser)
    {
        $this->usuarioId = $idUser;
        $this->atualizaDados();
    }

    //Pega os dados do banco de dados
    function atualizaDados()
    {
        $this->dados = getDataDoUsuario($this->getID());
    }

    //Getters
    public function getID()
    {
        return $this->usuarioId;
    }

    function getLogin()
    {
        return $this->dados['login'];
    }

    function getSenha()
    {
        return $this->dados['senha'];
    }

    function getEmail()
    {
        return $this->dados['email'];
    }

    function getNome()
    {
        return $this->dados['nome'];
    }

    //Caso eu tenha adicionado outra tabela e nao tenha atualizado o codigo
    function getOutro($qualColuna)
    {
        if (isset($this->dados[$qualColuna])) {
            return $this->dados[$qualColuna];
        } else {
            return 'Tabela ' . $qualColuna . " nao existe.";
        }
    }
}
