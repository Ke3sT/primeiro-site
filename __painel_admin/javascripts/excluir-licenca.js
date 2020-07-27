$(function() {
    //Funcao pra excluir chave
    $(".excluir").click(function(e) {
        //Verifico se o botao de excluir nao ta desativado
        console.log("Clicou em excluir");

        var chaveClicada = $(this);
        var licencaID = chaveClicada.parent().find(".chave").attr("id");
        var chaveKey = chaveClicada.parent().find(".chave").text();
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