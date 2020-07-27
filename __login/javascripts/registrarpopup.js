$(function() {

    //Fecha o popup de registro
    $("#fechaRegistroPopUp").click(function() {
        fecharRegistroPopup();
    });

    //Remov a msg de registro caso ele coloque novos dados
    $("#registro-formulario input").focus(function() {
        escondeRegistroStatus();
    })

    //Botao pra abrir o login do formulario de registro
    $("#abreLoginPopup").click(function() {
        fecharRegistroPopup();
        abrirLoginPopup();
    });

    //Botao pra abrir o login do formulario de registro
    $("#abreLoginPopup").click(function() {
        fecharRegistroPopup();
        abrirLoginPopup();
    });

    //Submit no registro do usuario
    $("#registro-formulario").submit(function(evento) {
        console.log("Clicou em registrar");
        evento.preventDefault();

        escondeRegistroStatus();
        bloqueiaBotaoRegistro(true);

        var dadosRegistro = $(this);
        var usuario = $(dadosRegistro).find("#reg-usuario").val();
        var nome = $(dadosRegistro).find("#reg-nome").val();
        var email = $(dadosRegistro).find("#reg-email").val();
        var senha = $(dadosRegistro).find("#reg-senha").val();

        console.log("Usuario: " + usuario + ", Nome: " + nome);

        var requisitarRegistro = $.ajax({
            url: "__login/registrar.php",
            type: "POST",
            data: "usuario=" + usuario + "&nome=" + nome + "&email=" + email + "&senha=" + senha
        });

        requisitarRegistro.done(function(dadosRetorno, textStatus, xhttp) {
            fazerRegistro(dadosRetorno);
        });

        requisitarRegistro.fail(function() {
            console.log("Erro requisicao Ajax");
        });
    });


});

//----------------------------------------------------------------------------------------------------
//Registro

function fazerRegistro(dadosRegistro) {

    console.log("Dados de retorno: " + dadosRegistro);
    //Try catch pra verificar se o retorno da resposta é json(se nao for é pq deu erro em mysql)
    try {
        //Prossigo com o registro
        var dadoJson = $.parseJSON(dadosRegistro);
        atualizaRegistroStatus(dadoJson['registroStatus']);

        //Se o status do registro for 0, o login foi aprovado
        if (dadoJson['registroStatus'] == 0) {

            //Abro a aba de login
            setTimeout(function() {
                fecharRegistroPopup();
                setTimeout(function() {
                    abrirLoginPopup();
                }, 2000);
            }, 2000)
        } else {
            bloqueiaBotaoRegistro(false);
        }
    } catch (e) {
        //Caso chegue no catch, é pq deu erro de mysql
        //Notifico o usuario com o erro 4
        atualizaRegistroStatus(4);

        //Desbloqueio o botao
        bloqueiaBotaoRegistro(false);
    }
}

//Atualizo a mensagem em baixo do registro
function atualizaRegistroStatus(status) {
    var msgStatus = $("#registroStatus");
    console.log("Registro status: " + status);

    if (msgStatus.css("display") == "block") {
        console.log("Ja tem uma msg de status. Dando fadeout nela");
        msgStatus.hide();
    }

    //Alterar a cor da mensagem
    if (status == 0) {
        msgStatus.removeClass("erro")
        msgStatus.addClass("sucesso")
    } else {
        msgStatus.removeClass("sucesso")
        msgStatus.addClass("erro")
    }

    //Customizar a msg do erro
    switch (status) {
        case 0:
            msgStatus.html("Registrado com sucesso.");
            break;
        case 1:
            msgStatus.html("Nome de usuario já em uso.");
            break;
        case 2:
            msgStatus.html("Endereco de e-mail já em uso.");
            break;
        case 3:
            msgStatus.html("Erro interno, tente novamente mais tarde.");
            break;
        case 4:
            msgStatus.html("Servicos de login/registro indisponiveis no momento.");
    }

    msgStatus.fadeIn(500);
}

function escondeRegistroStatus() {
    $("#registroStatus").fadeOut({
        duration: 700
    })
}

function abrirRegistroPopup() {
    //$("#login-popup").css("display", "block");
    $("#registrar-popup").fadeIn({
        duration: 1000,
        start: function() {
            console.log("Comecei a animacao");
        },
        done: function() {
            console.log("Terminei a animacao");
        }
    });
}

function fecharRegistroPopup() {
    $("#registrar-popup").fadeOut({
        duration: 1000,
        start: function() {
            console.log("Comecei a animacao de fechar");
        },
        done: function() {
            console.log("Terminei a animacao de fechar. Escondendo janela de registro..");
            $(this).css("display", "none");
        }
    });
}

function bloqueiaBotaoRegistro(bloquear) {
    if (bloquear) {
        console.log("Bloqueando botao de registro");
        $("#botaoRegistrar").attr("disabled", true);

        //Animacao pra deixar o botao meio invisivel pra dizer que ta registrando
        $("#botaoRegistrar").animate({
            opacity: 0.5
        }, 1000);
    } else {
        console.log("Desbloqueando botao registro");
        //Animacao pra por a opacidade ao normal
        $("#botaoRegistrar").animate({
            opacity: 1
        }, 1000, function() {
            $(this).removeAttr("disabled");
        });
    }
}