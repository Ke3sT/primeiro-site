<?php
@include '../__login/conexao.php';

//Verifico se esta conectado ao banco de dados
if (estaConectado()) {
    //Faco a query pra pegar todas as licencas do banco de dados
    $query = "SELECT * FROM licencas";
    $resultado = $conexaoMySQL->query($query);
}
?>

<!DOCTYPE html>
<html>

<head>
    <title>Painel Administrativo - Lista de Licencas</title>
    <!--Carrego o CSS dessa pagina-->
    <link href="css/listar-licenca.css" rel="stylesheet">

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

    <div id="caixa">
        <?php require 'estilos/menu.php'; ?>
        <div id="conteudo">
            <h1>Listar licencas</h1>

            <!-- Caixa onde tem as licencas e os dados dela -->
            <div id="caixaLicencas" class="caixaLicencas">

                <div class="infoCaixa">
                    <ul>
                        <li class="infoChave" title="Chave da licenca">Chave</li>
                        <li class="infoMaxIps" title="Maximo de IPs permitidos na chave">Maximo de IPs</li>
                        <li class="infoQualquerIp" title="Permite ou nao qualquer IP utilizar a chave">Permitir qualquer IP?</li>
                        <li class="infoOpcoes" title="Opcoes para excluir/alterar dados da licenca">Opcoes</li>
                    </ul>
                </div>

                <div class="licencasDados">
                </div>

                <div class="botoesNav">

                </div>
            </div>

        </div>
    </div>

    <script>
        //Funcao pra copiar a chave ao clicar nela
        function copiaProClipBoard(texto) {
            const licencaChave = document.createElement('textarea');
            licencaChave.value = texto;
            document.body.appendChild(licencaChave);
            licencaChave.setAttribute('readonly', '');
            licencaChave.select();
            document.execCommand('copy');
            document.body.removeChild(licencaChave);
        }

        //Animacao para ocultar a chave
        function animacaoExclusao(elementoChave, sucesso) {

            if (sucesso) {
                //Animacao de exclusao
                elementoChave.parent().animate({
                    opacity: 1
                }, {
                    duration: 1000,
                    start: function() {
                        $(this).removeClass("erro");
                        $(this).addClass("sucesso");
                    },
                    done: function() {
                        $(this).hide(1000);
                    }
                });
            } else {
                elementoChave.parent().animate({
                    opacity: 1
                }, {
                    duration: 1000,
                    start: function() {
                        $(this).removeClass("sucesso");
                        $(this).addClass("erro");
                    }
                });
            }
        }

        //Bloqueia o botao excluir
        function bloqueiaBotaoExcluir(bloquear, elemento) {

            var botaoExcluir = $(elemento);
            if (bloquear) {
                console.log("Bloqueando botao excluir");
                botaoExcluir.attr("disabled", true);

                //Animacao pra deixar o botao meio invisivel
                botaoExcluir.animate({
                    opacity: 0.5
                }, 500);
            } else {
                console.log("Desbloqueando botao excluir");
                botaoExcluir.removeAttr("disabled");

                //Animacao pra por a opacidade ao normal
                botaoExcluir.animate({
                    opacity: 1
                }, 500);
            }
        }
    </script>
</body>

</html>