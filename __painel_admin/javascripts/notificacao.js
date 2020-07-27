function mostraNotificacao(corNotificacao, titulo, mensagem) {
    var elementoNotifi = $(".notificacaoCaixa");

    //Se ja tiver uma notificacao sendo mostrada, eu oculto ela
    if (elementoNotifi.css("display") == "block") {
        console.log("Esta na animacao");
        elementoNotifi.css("display", "none");
    }

    //Instancias dos objetos da caixa de notificacao
    var tituloNotifi = elementoNotifi.find(".titulo");
    var conteudoNotifi = elementoNotifi.find(".caixaTexto .aviso");
    var caixaConteudo = elementoNotifi.find(".caixaTexto");

    //Alterar a cor de fundo da notificacao pra simbolizar erro/sucesso
    if (corNotificacao == "verde") {
        caixaConteudo.addClass("sucesso");
        caixaConteudo.removeClass("erro");
    } else if (corNotificacao == "vermelho") {
        caixaConteudo.addClass("erro");
        caixaConteudo.removeClass("sucesso");
    }

    //Se o conteudo for mt grande, eu ativo o scroll na caixa do conteudo
    if (mensagem.lenght >= 170) {
        caixaConteudo.css("overflow-y", "scroll");
    } else {
        caixaConteudo.css("text-align", "center");
    }

    //Seto os dados da notificacao
    tituloNotifi.text(titulo);
    conteudoNotifi.text(mensagem);

    //Coloco pra ela sumir depois de 5segundos
    elementoNotifi.fadeIn(1000, function() {
        setTimeout(function() {
            elementoNotifi.fadeOut(1000)
        }, 5000);
    });
}