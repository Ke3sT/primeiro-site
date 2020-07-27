<!DOCTYPE html>
<html>

<head>
    <title>Painel Administrativo - Criar Licenca</title>


    <!--Carrego o CSS dessa pagina-->
    <link href="css/criar-licenca.css" rel="stylesheet">

    <!--Carrega os framworks padroes como jQuery, bootstrap, etc.. -->
    <?php include 'scripts/frameworks.php' ?>

    <script>
        $(function() {
            //Mostrar o conteudo com animacao
            $("#conteudo").fadeIn(500, function() {
                console.log("Acabei a animacao do conteudo");

                $("#formNovaLicenca").animate({
                    opacity: 1
                }, {
                    start: function() {
                        console.log("Comecei a animacao");
                        $(this).show(1000);
                    },
                    done: function() {
                        console.log("Acabei a animacao");
                        //Animacao das childrens
                    }
                });
            });
        });

        //Apenas para atualizar a mensagem de status ao enviar uma licenca
        function statusAddLicenca(dados) {
            var mensagemResp = $("#statusResposta");
            var dadosRetorno;
            try {
                dadosRetorno = $.parseJSON(dados);
            } catch (e) {
                mensagemResp.find("a").text("Erro ao conectar-se ao banco de dados de licencas.");
                alterarCorStatus(false);
                mostraStatus(true);
                return;
            }

            if (("sucessoInsert" in dadosRetorno) && dadosRetorno['sucessoInsert'] == 1) {
                //O insert foi concluido e a licenca foi adicionada
                mensagemResp.find("a").text("Nova licenca adicionada: " + dadosRetorno['dadosLicenca']['licencaCodigo']);
                alterarCorStatus(true);
            } else {
                alterarCorStatus(false);

                if (dadosRetorno['erroMySQLCreate'] == 1) {
                    mensagemResp.find("a").text("Ocorreu um erro com o banco de dados. \n Motivo: " + dadosRetorno['erroMySQLCreateMotivo']);

                } else if (dadosRetorno['chaveInvalida'] == 1) {
                    mensagemResp.find("a").text("A chave nao foi aprovada pela validacao do sistema.");

                } else if (dadosRetorno['erroMySQLInsert'] == 1) {
                    mensagemResp.find("a").text("Erro ao inserir a chave no banco de dados. \n Motivo: " + dadosRetorno['erroMySQLInsertMotivo']);
                }
            }
            mostraStatus(true);
        }

        //Alterar a cor do status
        function alterarCorStatus(sucesso) {
            var mensagemClass = $("#statusResposta");

            if (sucesso) {
                mensagemClass.removeClass("statusFalha");
                mensagemClass.addClass("statusSucesso");
            } else {
                mensagemClass.removeClass("statusSucesso");
                mensagemClass.addClass("statusFalha");
            }
        }

        //Esconde/mostra o status
        function mostraStatus(mostrar) {
            if (mostrar) {
                //$("#statusResposta").css("display", "block");
                $("#statusResposta").fadeIn(1000);
            } else {
                //$("#statusResposta").css("display", "none");
                $("#statusResposta").fadeOut(1000);
            }
        }
    </script>

    <!--JS onde tem a funcao de adicionar a licenca ao enviar o formulario-->
    <script src="javascripts/add-licenca.js" type="text/javascript"></script>
</head>

<body>
    <div id="caixa">
        <?php require 'estilos/menu.php'; ?>
        <div id="conteudo">
            <h1>Criar nova licenca</h1>
            <p>Esta pagina serve para criar uma nova licenca no banco de dados.</p>

            <!-- Formulario pra adicionar licenca -->
            <form id="formNovaLicenca" class="formuCaixa" action="" method="POST">

                <div class="labels">
                    <label for="licencaCodigo">Insira o codigo da licenca</label>
                    <label for="licencaMaxIps">Quantos IPs podem utilizar a licenca</label>
                    <label for="licencaQualquerIp">Permitir qualquer IP</label>
                </div>

                <div class="inputs">
                    <input id="licencaCodigo" type="text" title="Insira a chave da licenca" minlength="1" maxlength="19" required>
                    <input id="licencaMaxIps" type="number" max="100" min="1" value="1" title="Insira o numero de IPs permitidos nessa chave">
                    <input id="licencaQualquerIp" type="checkbox" title="Permitir qualquer IP utilizar essa chave?">
                </div>

                <button type="submit">Criar licenca</button>
            </form>

            <div id="statusResposta" class="statusAviso">
                <a></a>
            </div>
        </div>
    </div>
</body>

</html>