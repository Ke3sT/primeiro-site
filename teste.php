<?php
?>

<!doctype html>
<html>

<head>

    <title>Testando sistema de paginas</title>
    <script src="__libraries/jquery-3.5.1.min.js"></script>
    <script src="pagina.js" type="text/javascript"></script>

    <script>
        var paginaDados;
        $(function() {
            //Ajax pra retornar todas as licencas
            var listaLicencas = $.ajax({
                url: 'retorna-licencas.php'
            });

            //Instancio a classe pagina pra criar as paginas com as licencas
            listaLicencas.done(function(resposta, codigoResposta, xhttp) {
                console.log("Resposta: " + codigoResposta);

                paginaDados = new Pagina(10, JSON.parse(resposta));
                paginaDados.criarPaginas();
                mostrarPagina(1);
                criarBotoes();

                //Botoes para mudar de pagina. Preciso estar dentro do done do ajax pq se nao o elemento ainda nao ta na pagina
                $("#botoesPagina button").click(function(evento) {
                    let paginaClicada = evento['target']['id'];
                    mostrarPagina(paginaClicada);

                    //Bloqueio o botao da pagina atual que ele esta
                    $(evento['target']).attr("disabled", true);

                    //Desbloqueio o botao da pagina anterior que ele estava
                    $("#botoesPagina").find("#" + paginaDados.getPaginaAnterior()).attr("disabled", false);

                });
            });


        });

        function mostrarPagina(qualPagina) {
            let divLicencas = $("#listaLicencas");
            //Limpo a lista de elementos na div atual;
            divLicencas.empty();

            let listaColunas = "";
            let elementosPagina = paginaDados.getPagina(qualPagina);

            //Loopo por cada elemento dentro da pagina
            Object.keys(elementosPagina).forEach(index => {
                let dataLicenca = elementosPagina[index];
                listaColunas += "<ul>"
                listaColunas += "<li> Chave: " + dataLicenca['chave'] + ", Max IPs: " + dataLicenca['maximoIPs'] + "</li>";
                listaColunas += "</ul>"
            })

            divLicencas.append(listaColunas);
            paginaDados.setPaginaAnterior(paginaDados.getPaginaAtual());
            paginaDados.setPaginaAtual(qualPagina);

            console.log("Pulando para a pagina " + qualPagina + ". Pagina anterior: " + paginaDados.getPaginaAnterior());
        }

        function criarBotoes() {
            let divBotoes = $("#botoesPagina");
            totalPaginas = paginaDados.getTotalPaginas();
            console.log("Criando botoes pra " + totalPaginas + " paginas");

            let botoes = "";
            for (loop = 0; loop < totalPaginas; loop++) {
                botoes += "<button id='" + (loop + 1) + "'>Pagina " + (loop + 1) + "</button>"
            }

            divBotoes.append(botoes);

            //Se tiver só 1 pagina, eu desativo o botao de paginar
            if (totalPaginas == 1) {
                console.log("Desativando o botao pq so tem 1 pagina");
                divBotoes.find("#1").attr("disabled", true);
            }
        }
    </script>

    <style>
        #listaLicencas {
            background-color: red;
        }
    </style>
</head>

<body>
    <p>Hi eu sou um body</p>

    <div id="listaLicencas">

    </div>

    <div id="botoesPagina">

    </div>
</body>

</html>