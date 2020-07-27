var paginasLicenca;
$(function() {


    //Sistema de pagina
    let solicitacaoLicencas = $.ajax({
        url: 'scripts/retornar-licencas.php'
    });

    solicitacaoLicencas.done(function(resposta, codigoResp, xhttp) {
        if (resposta.length == 0) {
            console.log("Erro conexão MySQL");
            let divLicencas = $(".licencasDados");
            divLicencas.append("<p class='semConexao'>Nao há nenhuma conexao com o banco de dados</p>");
        } else {
            console.log("Conexao MySQL ok");
            let dadosLicencas = JSON.parse(resposta);

            paginasLicenca = new Pagina(15, dadosLicencas);
            paginasLicenca.criarPaginas();
            carregarPaginas();
            criarBotoes();
            mostrarPagina(1);
            carregaCopiarChave();

            //Carrego as funcao do botao de excluir
            jQuery.getScript('javascripts/excluir-licenca.js');
        }
    });

    solicitacaoLicencas.fail(function() {
        console.log("Erro ao solicitar licencas do banco de dados");
        let divLicencas = $(".licencasDados");
        divLicencas.append("<p class='semConexao'>Nao há nenhuma conexao com o banco de dados</p>");
    });
});

function mostrarPagina(qualPagina) {
    let divLicencas = $(".licencasDados");

    paginasLicenca.setPaginaAnterior(paginasLicenca.getPaginaAtual());
    divLicencas.find("#" + (paginasLicenca.getPaginaAnterior())).hide();
    divLicencas.find("#" + (qualPagina)).show(1000);

    paginasLicenca.setPaginaAtual(qualPagina);
}

function carregarPaginas() {
    let divLicencas = $(".licencasDados");

    for (pagina = 1; pagina <= paginasLicenca.getTotalPaginas(); pagina++) {
        let listaColunas = "";
        let elementosPagina = paginasLicenca.getPagina(pagina);
        console.log(elementosPagina);

        //Loopo por cada elemento dentro da pagina
        listaColunas += "<div id='" + pagina + "' style='display:none'>"
        Object.keys(elementosPagina).forEach(index => {
            let dataLicenca = elementosPagina[index];
            listaColunas += "<ul>";
            listaColunas += "<li id='" + dataLicenca['id'] + "' class='chave' title='Clique para copiar'>" + dataLicenca['chave'] + "</li>";
            listaColunas += "<li class='maxIps'>" + dataLicenca['maximoIPs'] + "</li>";
            listaColunas += "<li class='qualquerIp'>" + (dataLicenca['permitirQualquerIp'] == 1 ? "Sim" : "Nao") + "</li>";
            listaColunas += "<button class='configurar' title='Alterar  dados da licenca'>Configurar</button>";
            listaColunas += "<button class='excluir' title='Excluir licenca do banco de dados'>Excluir</button>";
            listaColunas += "</ul>";
        })
        listaColunas += "</div>";
        divLicencas.append(listaColunas);
    }
}

function criarBotoes() {
    let divBotoes = $(".botoesNav");
    totalPaginas = paginasLicenca.getTotalPaginas();
    console.log("Criando botoes pra " + totalPaginas + " paginas");

    let botoes = "";
    for (loop = 0; loop < totalPaginas; loop++) {
        botoes += "<button id='" + (loop + 1) + "'>Pagina " + (loop + 1) + "</button>"
    }

    //Adiciono os botoes
    divBotoes.append(botoes);

    //Se tiver só 1 pagina, eu desativo o botao de paginar
    if (totalPaginas == 1) {
        console.log("Desativando o botao pq so tem 1 pagina");
        divBotoes.find("#1").attr("disabled", true);
    }

    //Botoes para mudar de pagina. Preciso estar dentro do done do ajax pq se nao o elemento ainda nao ta na pagina
    $(function() {
        $(".botoesNav button").click(function(evento) {
            console.log("Clicou em mudar pagina");
            let paginaClicada = evento['target']['id'];
            mostrarPagina(paginaClicada);

            //Bloqueio o botao da pagina atual que ele esta
            $(evento['target']).attr("disabled", true);

            //Desbloqueio o botao da pagina anterior que ele estava
            $(".botoesNav").find("#" + paginasLicenca.getPaginaAnterior()).attr("disabled", false);

        });
    });
}

function carregaCopiarChave() {
    $(function() {
        //Script pra copiar a chave no que o usuario clicou
        $(".chave").click(function() {
            copiaProClipBoard($(this).text());
        });
    })
}