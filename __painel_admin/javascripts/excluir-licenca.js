$(function() {
    //Funcao pra excluir chave
    $(".excluir").click(function(e) {
        //Verifico se o botao de excluir nao ta desativado
        console.log("Clicou em excluir");

        var chaveClicada = $(this);
        var licencaID = chaveClicada.parent().attr("id");
        var chaveKey = chaveClicada.parent().find("a:first").text();
        console.log("Tentando excluir ID: " + licencaID);

        //Coloca o elemento meio transp.
        chaveClicada.parent().animate({
            opacity: 0.6
        }, {
            duration: 1000,
        });

        //Bloqueio o botao de excluir pra nao duplicar as query
        bloqueiaBotaoExcluir(true, chaveClicada);

        //Solicitacao ajax pra tentar fazer a exclusao
        var solicitacaoAjax = $.ajax({
            url: 'scripts/excluir-licenca.php',
            type: 'POST',
            data: 'id=' + licencaID
        });

        //Funcao caso a exclusao tenha sido concluida
        solicitacaoAjax.done(function(resposta, code, xhttp) {
            console.log("Recebi resposta: " + resposta);

            //Verifico se o retorno da resposta esta em JSOn, se nao estiver, é pq houve algum erro de mysql
            try {
                var jsonDados = $.parseJSON(resposta);
            } catch (e) {
                console.log("Erro na exclusao da chave, motivo: sem conexao com o banco de dados");
                animacaoExclusao(chaveClicada, false);
                bloqueiaBotaoExcluir(false, chaveClicada);
                mostraNotificacao("vermelho", "Erro ao excluir chave!", "Não foi possível excluir a chave do banco de dados. Motivo do erro: Sem conexão com o banco de dados.");
                return;
            }

            //Verifico primeiro caso a exclusao tenha sido feito com sucesso
            if ("sucesso" in jsonDados && jsonDados['sucesso'] == 1) {

                console.log("Sucesso na exclusao!");
                mostraNotificacao("verde", "Chave excluida!", "A chave (" + chaveKey + ") foi excluida com sucesso do banco de dados.");
                animacaoExclusao(chaveClicada, true);
                //O else abaixo só irá entrar se der erro na exclusao
            } else {
                console.log("Erro na exclusao da chave, motivo: " + jsonDados['motivoErro']);
                mostraNotificacao("vermelho", "Erro ao excluir chave!", "Não foi possível excluir a chave do banco de dados. Motivo do erro: " + jsonDados['motivoErro']);
                animacaoExclusao(chaveClicada, false);
            }
        });

        //Caso der erro na exclusao
        solicitacaoAjax.fail(function() {
            animacaoExclusao(chaveClicada, false);
            bloqueiaBotaoExcluir(false, chaveClicada);
            mostraNotificacao("vermelho", "Erro ao excluir chave!", "Não foi possível excluir a chave do banco de dados. Motivo do erro: Sistema indisponível");
        })
    });
});

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