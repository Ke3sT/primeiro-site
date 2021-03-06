var paginasLicenca;
$(function() {
    //Sistema de pagina
    let solicitacaoLicencas = $.ajax({
        url: 'scripts/retornar-licencas.php'
    });

    solicitacaoLicencas.done(function(resposta, codigoResp, xhttp) {
        let divLicencas = $(".licencasDados");
        if (resposta.length == 0) {
            console.log("Erro conexão MySQL");

            divLicencas.append("<p class='semConexao'>Nao há nenhuma conexao com o banco de dados</p>");
        } else {
            console.log("Conexao MySQL ok");

            let dadosLicencas = JSON.parse(resposta);

            //Verifico se retornou algum dado
            if (dadosLicencas.length > 0) {
                paginasLicenca = new Pagina(10, dadosLicencas);
                paginasLicenca.criarPaginas();
                carregarPaginas();

                carregaOutrasFuncoes();
            } else {
                //Caso nao tenha nenhuma licenca, boto uma mensagem padrao
                divLicencas.append("<p class='semDados'>Não há nenhuma licenca atualmente no banco de dados</p>");
            }
        }
    });

    solicitacaoLicencas.fail(function() {
        console.log("Erro ao solicitar licencas do banco de dados");
        let divLicencas = $(".licencasDados");
        divLicencas.append("<p class='semConexao'>Nao há nenhuma conexao com o banco de dados</p>");
    });
});

//Funcao carregar as funcoes basicas apos receber a data do ajax
function carregaOutrasFuncoes() {
    //Funcao pra criar os botoes de pagina
    criarBotoes();
    //Funcao pra mostrar a pagina 1
    mostrarPagina(1);
    //Funcao pra copiar chave
    carregaCopiarChave();
    //Funcao pra fazer o botao de verinfo
    verInfo();
    //Carrego as funcao do botao de excluir
    jQuery.getScript('javascripts/excluir-licenca.js');
    jQuery.getScript('javascripts/configurar.js');
}

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
            let ipsPermitidos = JSON.parse(dataLicenca['ipsPermitidos']);

            //Crio o "cabecalho" de cada licenca, com as informacoes basicas e os botoes pra controlar
            listaColunas += "<div id='" + dataLicenca['id'] + "' class='chaveDados'>"
            listaColunas += "<a class='licencaTitulo' title='Clique para copiar a chave'> " + dataLicenca['chave'] + " </a>"
            listaColunas += "<button class='configurar' title='Alterar  dados da licenca'>Configurar</button>";
            listaColunas += "<button class='excluir' title='Excluir licenca do banco de dados'>Excluir</button>";
            listaColunas += "<button class='ver' title='Mostrar todas as infos da licenca'>Ver</button>";

            //Aqui crio a lista contendo todas as informacoes que quero mostrar
            listaColunas += "<ul style='display:none'>";
            listaColunas += "<li class='chave' title='Clique para copiar a chave'>Chave da licenca: <a>" + dataLicenca['chave'] + "</a></li>";
            listaColunas += "<li class='maxIps'>Maximo de IPs: <a>" + dataLicenca['maximoIPs'] + "</a></li>";
            listaColunas += "<li class='qualquerIp'>Qualquer IP?: <a>" + (dataLicenca['permitirQualquerIp'] == 1 ? "Sim" : "Nao") + "</a></li>";

            listaColunas += "<li title='Lista de IPs permitidos a utilizar esta chave'>IPs permitidos: <select name='ipsLicenca' id='ipsLicenca'>";

            if (ipsPermitidos != null && ipsPermitidos['ips'].length != 0) {
                ipsPermitidos['ips'].forEach(ip => {
                    listaColunas += "<option>" + ip + "</option>";
                });
            } else {
                listaColunas += "<option>Nenhum IP atribuido</option>";
            }

            listaColunas += "</select></li>";

            listaColunas += "</ul>";
            listaColunas += "</div>";
        })
        listaColunas += "</div>";
        divLicencas.append(listaColunas);
    }
}

//Funcao pra criar os botoes da pagina
function criarBotoes() {
    let divBotoes = $(".botoesNav");
    totalPaginas = paginasLicenca.getTotalPaginas();
    console.log("Criando botoes pra " + totalPaginas + " paginas");

    let botoes = "";
    for (loop = 0; loop < totalPaginas; loop++) {
        botoes += "<button class='botoesNav' id='" + (loop + 1) + "' title='Ir para a pagina " + (loop + 1) + "'>" + (loop + 1) + "</button>"
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


//Funcao pra copiar a chave
function carregaCopiarChave() {
    $(function() {
        //Script pra copiar a chave no que o usuario clicou
        $(".chave").click(function() {
            copiaProClipBoard($(this).children("a").text());
        });

        $(".licencaTitulo").click(function() {
            copiaProClipBoard($(this).text());
        });


    })
}

function atualizaDadoChave(chaveID) {
    //Id da licenca pra eu pegar do banco de dados
    console.log("Atualizando dados da chaveID: " + chaveID);

    solicitacaoAjax = $.ajax({
        url: 'scripts/retornar-licencas.php',
        type: 'POST',
        data: 'licencaID=' + chaveID
    })

    solicitacaoAjax.done(function(resposta, codResp, xhttp) {
        licencaDados = JSON.parse(resposta)[0];
        console.log(licencaDados);

        //Elemento da chave
        elementoChave = $(".licencasDados div#" + paginasLicenca.getPaginaAtual()).find("div#" + chaveID);

        elementoChave.find("a").text(licencaDados['chave']);
        elementoChave.find("ul li.chave a").text(licencaDados['chave']);
        elementoChave.find("ul li.maxIps a").text(licencaDados['maximoIPs']);
        elementoChave.find("ul li.qualquerIp a").text(licencaDados['permitirQualquerIp'] == 1 ? "Sim" : "Nao");

        let ipsPermitidos = JSON.parse(licencaDados['ipsPermitidos']);
        let listaIP = "";
        let caixaIPs = elementoChave.find("ul li select#ipsLicenca");
        if (ipsPermitidos != null && ipsPermitidos['ips'].length != 0) {
            ipsPermitidos['ips'].forEach(ip => {
                listaIP += "<option>" + ip + "</option>";
            });
        } else {
            listaIP += "<option>Nenhum IP atribuido</option>";
        }

        caixaIPs.empty();
        caixaIPs.append(listaIP);
    })
}

//Funcao pra mostrar infos da licenca
function verInfo() {
    $(".ver").click(function(evento) {
        var botaoVer = $(this);
        var chaveClicada = botaoVer.next("ul");

        //Animacoes
        if (chaveClicada.is(":animated")) {
            chaveClicada.stop(true, true);
        }

        if (botaoVer.is(":animated")) {
            botaoVer.stop(true, true);
        }

        botaoVer.attr("disabled", true).animate({
            opacity: 0
        }, 500);

        console.log(chaveClicada);
        if (chaveClicada.is(":hidden")) {

            chaveClicada.show(500, function() {
                botaoVer.text("Ocultar");
                botaoVer.addClass("ocultar")
                botaoVer.attr("disabled", false).animate({
                    opacity: 1
                }, 500);
            });

        } else {
            chaveClicada.hide(500, function() {
                botaoVer.text("Ver");
                botaoVer.removeClass("ocultar")
                botaoVer.attr("disabled", false).animate({
                    opacity: 1
                }, 500);
            });
        }
    });
}

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