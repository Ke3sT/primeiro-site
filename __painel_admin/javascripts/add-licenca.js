$(function() {
    //Formulario para criar uma nova licenca
    $("#formNovaLicenca").submit(function(e) {
        e.preventDefault();
        console.log("Clicou em criar licenca");

        var dadosFormu = $(this);
        var chave = dadosFormu.find("#licencaCodigo").val();
        var maxips = dadosFormu.find("#licencaMaxIps").val();
        var qualquerip = dadosFormu.find("#licencaQualquerIp:checked").val() ? true : false;

        console.log("Criando nova licenca: " + chave + ", com max ips: " + maxips + ", permitindo qualquer IP?: " + qualquerip)

        var solicitacaoAjax = $.ajax({
            url: 'scripts/add-licenca.php',
            type: 'POST',
            data: "licencaCodigo=" + chave + "&licencaMaxIps=" + maxips + "&licencaQualquerIp=" + qualquerip
        });

        solicitacaoAjax.done(function(resposta, codigo, xhttp) {
            console.log("Solicitacao feita com sucesso, codigo: " + codigo);
            console.log("Resposta raw: " + resposta);
            console.log(resposta);

            statusAddLicenca(resposta);
        });

        solicitacaoAjax.fail(function() {
            console.log("Erro solicitacao Ajax");
        });
    });

    //Limpar a msg de status se tiver
    $("input").focus(function(e) {
        mostraStatus(false);
    });
});