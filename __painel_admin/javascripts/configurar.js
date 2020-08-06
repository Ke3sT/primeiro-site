$(function() {
    //Botao pra abrir a pagina de configurar
    $(".configurar").click(function(e) {
        console.log("Clicou em configurar licenca");

        //Id da licenca pra eu pegar do banco de dados
        licencaID = $(this).parent().attr("id");
        console.log(licencaID);

        dadosAjax = $.ajax({
            url: 'scripts/retornar-licencas.php',
            type: 'POST',
            data: 'licencaID=' + licencaID
        });

        dadosAjax.done(function(resposta, respostaCod, xhttp) {
            console.log("Sucesso! Resposta:")

            if (resposta.length != 0) {
                let licencaDados = JSON.parse(resposta)[0];
                abrirPopupConfig(licencaDados);
            } else {
                mostraNotificacao("vermelho", "Erro ao solicitar dados", "Não foi possivel se conectar ao banco de dados para obter informacoes da licenca.")
            }
        });

        dadosAjax.fail(function() {
            console.log("Falha na requisicao Ajax");
        });

    });

    //Enviar as alteracoes
    $("#formularioConfig").submit(function(evento) {
        evento.preventDefault();
        console.log("Clicou em enviar formulario");
        dadosFormulario = $(this);
        escondeStatus();

        //Desativo todos os botoes
        $("#caixaConfigurar button").attr("disabled", true);

        $("#caixaConfigurar input, #caixaConfigurar select").attr("disabled", true);
        //Coloco uma animacao de opacity 0.5 nos inputs e nos botoes
        $("#caixaConfigurar input, #caixaConfigurar select, #caixaConfigurar button").animate({
            opacity: 0.5
        }, 500);
        enviarNovosDados(dadosFormulario);
    });

    //Funcao pra ocultar a parada de adicionar Ips
    $("#caixaOpcoes").click(function(evento) {
        $(".caixaAddIP").fadeOut(500);
    });

    //Clicou em add novo IP
    $(".addIP").click(function(e) {
        console.log("Clicou em add IP");
        let botaoAdd = $(this);
        let caixaDeIps = $(".caixaAddIP");

        if (caixaDeIps.is(":hidden")) {
            console.log("Caixa de add Ip esta oculta, mostrando..");
            caixaDeIps.fadeIn(1000);
        } else {
            //Caso chegue aqui, é pq o usuario vai adicionar um novo IP
            //Desligo o botao de adicionar
            botaoAdd.attr("disabled", true);

            $(".caixaIPs").animate({
                opacity: 0.5,
            }, {
                duration: 500,
                done: function(e) {
                    $(this).animate({
                        opacity: 1
                    }, {
                        duration: 500,
                        done: function(e) {
                            botaoAdd.attr("disabled", false);
                        }
                    });
                }
            });
            //Se ja tiver a mostra, ele vai adicionar o IP
            listaIPs = $("#ipspermitidos");
            ipAdicionado = $("#novoIP").val();

            //Verifico se tem a option "nenhum ip adicionado"
            if (listaIPs.children().length <= 1) {
                //Se só tiver 1, preciso verificar se é o nenhum Ip adicionado;
                if (!listaIPs.children().first().attr("id")) {
                    console.log("Elemento 'Nenhum IP adicionado encontrado. Removendo ele.'");
                    listaIPs.children().first().remove();
                }
            }

            listaIPs.append("<option id='ip'> " + ipAdicionado + "</option>");
            console.log(listaIPs.children().last().attr("selected", true));
            mostrarStatus(true, "Novo IP adicionado. Lembre-se de salvar após terminar.")
            console.log("Novo Ip adicionado");
        }
    });

    //Botao quando clica no remover IP
    $(".removeIP").click(function(e) {
        console.log("Clicou em remover IP");
        let caixaDeIps = $(".caixaAddIP");
        let listaIps = $("#ipspermitidos");
        let totalIPs = listaIps.children().length;

        //Verifico se a caixa de inserir um novo IP está mostrando. Caso sim, eu oculto.
        if (!caixaDeIps.is(":hidden")) {
            console.log("Caixa de add Ip esta mostrando, ocultando..");
            caixaDeIps.fadeOut(1000);
        }

        //Verifico quantos IPs tem na lista
        if (totalIPs >= 1) {
            //Verifico qual elemento dentro da select esta selected
            let elementoSelected;
            listaIps.children().each(function(index, elemento) {
                if (listaIps.val() == $(elemento).val()) {
                    console.log("Achei o elemento selecionado a excluir: " + $(elemento).text());
                    elementoSelected = $(elemento);
                    return false;
                }
            });

            //Verifico se o elemento selecionado nao esta nulo e se ele possui o attr id
            if (elementoSelected != null && elementoSelected.attr("id")) {
                if ((totalIPs - 1) < 1) {
                    console.log("Apagou todos os IPs");
                    listaIps.append("<option>Nenhum IP atribuido</option>");
                }
                elementoSelected.remove();
            }
        }
    });

    //Botao pra fechar o menu popup
    $(".fecharButton").click(function(e) {
        fecharMenuPopup();
        escondeStatus();
    });

    //Esconde a msg de status ao clicar em qualquer campo do formu
    $("input").click(function(e) {
        escondeStatus();
    });
});

//Envia os dados pro php ao salvar
function enviarNovosDados(novosDados) {
    let chaveId = novosDados.find("#chaveid").val();
    let chaveNome = novosDados.find("#chave").val();
    let maxIps = novosDados.find("#maxips").val();
    let qualquerIp = novosDados.find("#qualquerip").is(":checked") ? true : false;

    //Pegar os IPs da licenca no select
    let jsonIps = '"ips":[';
    let totalIps = novosDados.find("#ipspermitidos").children().length;
    novosDados.find("#ipspermitidos").children().each(function(index, elementoIP) {
        if ($(elementoIP).attr("id")) {
            jsonIps += '"' + $(elementoIP).val() + '"';
            jsonIps += ((index + 1) < totalIps ? "," : "");
        }
    });
    jsonIps += ']'
    console.log("Json IPs: " + jsonIps)

    //Preparo o json pra por todos os dados
    let jsonData = '{';
    jsonData += '"chaveID": "' + chaveId + '",';
    jsonData += '"chave": "' + chaveNome + '",';
    jsonData += '"maxIPs": "' + maxIps + '",';
    jsonData += '"qualquerIP": "' + qualquerIp + '",';
    jsonData += jsonIps;
    jsonData += "}"

    console.log("JSON dos dados: " + jsonData);

    //Ajax enviando os dados pro arquivo php pra tratar dos dados
    solicitacaoAjax = $.ajax({
        url: 'scripts/alterar-licenca.php',
        type: 'POST',
        data: 'dadosJSON=' + jsonData
    });

    solicitacaoAjax.done(function(resposta, codResposta, xhttp) {
        try {
            dadosResposta = $.parseJSON(resposta);

            //Verifico se a alteracao de dados foi um sucesso
            if (dadosResposta['sucesso'] == 1) {
                mostrarStatus(true, "Dados da licenca alterados com sucesso")
                mostraNotificacao("verde", "Sucesso ao alterar dados", "As informacoes da licenca foram atualizadas com sucesso no banco de dados")
                atualizaDadoChave(dadosResposta['chaveID']);
            } else {
                //Se entrar aqui é pq ocorreu algum erro
                mostrarStatus(false, dadosResposta['motivoErro'])
                mostraNotificacao("vermelho", "Erro ao alterar dados", "Ocorreu um erro ao tentar realizar as mudancas na licenca. Motivo do erro: " + dadosResposta['motivoErro'])
            }

            //Coloco uma animacao de opacity 1 pra voltar os dados ao normal
            $("#caixaConfigurar input, #caixaConfigurar select, #caixaConfigurar button").animate({
                opacity: 1
            }, {
                duration: 1000,
                start: function() {

                    if (dadosResposta['sucesso'] == 1) {
                        $(this).removeClass("erro");
                        $(this).addClass("sucesso");
                    } else {
                        $(this).removeClass("sucesso");
                        $(this).addClass("erro");
                    }
                },
                done: function() {
                    $(this).animate({
                        opacity: 0.4
                    }, {
                        duration: 500,
                        done: function() {
                            $(this).removeClass("erro");
                            $(this).removeClass("sucesso");

                            $(this).animate({ opacity: 1 }, {
                                duration: 1000,
                                done: function() {
                                    //Desbloqueio os inputs
                                    $("#caixaConfigurar input, #caixaConfigurar select").attr("disabled", false);

                                    //Ativo todos os botoes
                                    $("#caixaConfigurar button").attr("disabled", false);
                                    escondeStatus();
                                }
                            })
                        }
                    });
                }
            });

        } catch (Exception) {
            console.log("Erro ao converter resposta para JSON");

            //Ativo todos os botoes
            $("#caixaConfigurar button").attr("disabled", false);

            //Coloco uma animacao de opacity 1 pra voltar os dados ao normal
            $("#caixaConfigurar input, #caixaConfigurar select, #caixaConfigurar button").animate({
                opacity: 1
            }, {
                duration: 2000,
                start: function() {
                    $(this).removeClass("sucesso");
                    $(this).addClass("erro");
                }
            });

            mostrarStatus(false, "Sem conexao com o banco de dados")
            mostraNotificacao("vermelho", "Erro ao alterar dados", "Ocorreu um erro ao tentar realizar as mudancas na licenca. Motivo do erro: JSON foi retornado de forma incorreta, provavelmente sem conexao com o banco de dados")

            $("#caixaConfigurar input, #caixaConfigurar select").attr("disabled", false);
            return;
        }
    });

    solicitacaoAjax.fail(function(e) {
        console.log("Erro solicitacao ajax");
    });

}

//Abre o menu popup de configurar
function abrirPopupConfig(licencaDados) {
    console.log(licencaDados);
    popupConfigurar = $(".configLicenca");
    formularioConfig = popupConfigurar.children("form");

    //Insiro os dados da chave no menu de configurar
    formularioConfig.find("#chaveid").val(licencaDados['id']);
    formularioConfig.find("#chave").val(licencaDados['chave']);
    formularioConfig.find("#maxips").val(licencaDados['maximoIPs']);
    formularioConfig.find("#qualquerip").attr("checked", licencaDados['permitirQualquerIp'] == 1 ? true : false);

    ipsPermitidos = JSON.parse(licencaDados['ipsPermitidos']);
    var listaIps = "";
    if (ipsPermitidos != null && ipsPermitidos['ips'].length) {
        ipsPermitidos['ips'].forEach(ip => {
            listaIps += "<option id='" + ip + "'>" + ip + "</option>";
        });
    } else {
        listaIps += "<option>Nenhum IP atribuido</option>";
    }

    formularioConfig.find("#ipspermitidos").empty();
    formularioConfig.find("#ipspermitidos").append(listaIps);
    popupConfigurar.fadeIn(500);
}

//Fecha o menupopup de configurar
function fecharMenuPopup() {
    $(".configLicenca").fadeOut(500);
}

//Funcao pra mostrar mensagem do status ao mudar dados da licenca
function mostrarStatus(sucesso, texto) {

    msgAviso = $(".msgStatus");
    msgAviso.children("a").text(texto);
    if (sucesso) {
        msgAviso.addClass("sucesso");
        msgAviso.removeClass("erro");
    } else {
        msgAviso.removeClass("sucesso");
        msgAviso.addClass("erro");
    }

    msgAviso.fadeIn(1000);
}

//Esconder a msg de status
function escondeStatus() {
    $(".msgStatus").fadeOut(1000);
}