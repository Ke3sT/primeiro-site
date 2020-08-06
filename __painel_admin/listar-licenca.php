<?php
@include 'scripts/conexao.php';
?>

<!DOCTYPE html>
<html>

<head>
    <title>Painel Administrativo - Lista de Licencas</title>
    <!--Carrego o CSS dessa pagina-->
    <link href="css/listar-licenca.css" rel="stylesheet">
    <link href="css/configurar.css" rel="stylesheet">

    <!--Carrega os framworks padroes como jQuery, bootstrap, etc.. -->
    <?php include 'scripts/frameworks.php' ?>

    <!--O arquivo abaixo é onde tem a funcao de notificar-->
    <script src="javascripts/notificacao.js" type="text/javascript"></script>
    <!--Carregar a classe de paginas -->
    <script src="javascripts/pagina.js" type="text/javascript"></script>
    <!--Carrego o sistema de paginas -->
    <script src="javascripts/sistema-paginas.js"></script>

    <script>
        $(function() {
            //Mostrar o conteudo
            $("#conteudo").fadeIn(1000);
        })
    </script>

</head>

<body>
    <!--Notificacao-->
    <?php include 'estilos/notificacao.php' ?>

    <!--Div contendo as paginas de licencas -->
    <div id="caixa">
        <?php require 'estilos/menu.php'; ?>
        <div id="conteudo">
            <h1>Listar licencas</h1>

            <!-- Caixa onde tem as licencas e os dados dela -->
            <div id="caixaLicencas" class="caixaLicencas">

                <div class="infoCaixa">
                    <ul>
                        <li class="infoChave" title="Chave da licenca">Chave</li>
                        <!--<li class="infoMaxIps" title="Maximo de IPs permitidos na chave">Maximo de IPs</li>
                        <li class="infoQualquerIp" title="Permite ou nao qualquer IP utilizar a chave">Permitir qualquer IP?</li>-->
                        <li class="infoOpcoes" title="Opcoes para excluir/alterar dados da licenca">Opcões</li>
                    </ul>
                </div>

                <div class="licencasDados">
                </div>

                <div class="botoesNav">
                </div>
            </div>

        </div>
    </div>

    <!--Abaixo é o popup de configurar as licencas -->
    <div id="caixaConfigurar" class="configLicenca">
        <form id="formularioConfig">

            <p>Configurar licenca</p>

            <div id="caixaOpcoes">
                <input id="chaveid" hidden>
                <label for="chave">Chave</label>
                <input id="chave" type="text" maxlength="19">

                <label for="maxips">Maximo de IPs</label>
                <input id="maxips" type="number" min="0" max="100" value="1">

                <label for="qualquerip">Permitir qualquer IP?</label>
                <input id="qualquerip" type="checkbox">
            </div>

            <div class="caixaIPs">
                <label for="ipspermitidos">IPs permitidos</label>
                <select id="ipspermitidos">
                </select>

                <button type="button" class="addIP">Adicionar</button>
                <button type="button" class="removeIP">Remover</button>

                <div class="caixaAddIP">
                    <label for="novoIP">Digite um IP</label>
                    <input id="novoIP" type="text">
                </div>
            </div>

            <button type="submit" class="salvarButton">Salvar alteracoes</button>
            <button type="button" class="fecharButton">Fechar</button>

            <div class="msgStatus">
                <a></a>
            </div>
        </form>
    </div>

    <script>

    </script>
</body>

</html>