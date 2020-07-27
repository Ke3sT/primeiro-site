$(function() {
    //Funcoes do login
    //Evento que abre o login pop up ao clicar em Login
    $("#menuLogin").click(function() {
        abrirLoginPopup();
    });

    //Fecha o popup de login
    $("#fechaLoginPopUp").click(function() {
        fecharLoginPopup();
    });

    //Abre o popup de registrar
    $("#abrirRegistar").click(function() {
        fecharLoginPopup();
        abrirRegistroPopup();
    });

    //Remov a msg de login caso ele coloque novos dados
    $("#login-formulario input").focus(function() {
        escondeLoginStatus();
    })

    //Submit no login
    $("#login-formulario").submit(function(evento) {
        console.log("Clicou em enviar form de login..");
        evento.preventDefault();

        //Escondo o login do status caso ele esteja visivel por outra tentativa de login
        escondeLoginStatus();

        //Bloqueio o botao de login ate receber uma resposta
        bloqueiaBotaoLogin(true);

        $dadosLogin = $(this);
        $login = $($dadosLogin).find("#login").val();
        $senha = $($dadosLogin).find("#senha").val();
        $lembrar = $($dadosLogin).find("#lembrarCheckbox:checked").val() ? true : false;

        var requisitarLogin = $.ajax({
            url: "__login/login.php",
            type: "POST",
            data: "usuario=" + $login + "&senha=" + $senha + "&lembrarlogin=" + $lembrar
        });

        requisitarLogin.done(function(dadosRetorno, textStatus, xhttp) {
            fazerLogin(dadosRetorno);
        });

        requisitarLogin.fail(function() {
            console.log("Erro requisicao Ajax");

        });

    });
});

function fazerLogin(dadosLogin) {

    //Try catch pra verificar se o retorno da resposta é json(se nao for é pq deu erro em mysql)
    try {

        //Prossigo com o login
        var dadoJson = $.parseJSON(dadosLogin);
        atualizaLoginStatus(dadoJson['loginStatus']);

        //Se o status do login 2, o login foi aprovado
        if (dadoJson['loginStatus'] == 2) {
            fecharLoginPopup();
            window.location.replace("index.php");
        } else {
            bloqueiaBotaoLogin(false);
        }
    } catch (e) {
        //Caso chegue no catch, é pq deu erro de mysql

        //Notifico o usuario
        atualizaLoginStatus(3);

        //Desbloqueio o botao
        bloqueiaBotaoLogin(false);
        return;
    }
}

function atualizaLoginStatus(status) {
    var msgStatus = $("#loginStatus");
    console.log("Login status: " + status);

    msgStatus.fadeIn({
        duration: 100
    })

    switch (status) {
        case 0:
            msgStatus.html("Usuario não existe.");
            msgStatus.css("background-color", "#EC4848");
            break;
        case 1:
            msgStatus.html("Senha incorreta.");
            msgStatus.css("background-color", "#EC4848");
            break;
        case 2:
            msgStatus.html("Login autorizado. Logando...");
            msgStatus.css("background-color", "#6FBE72");
            break;
        case 3:
            msgStatus.html("Sistemas de login offline. Tente mais tarde.");
            msgStatus.css("background-color", "#EC4848");
            break;
    }
}

function escondeLoginStatus() {
    $("#loginStatus").fadeOut({
        duration: 700
    })
}

function abrirLoginPopup() {
    //$("#login-popup").css("display", "block");
    $("#login-popup").fadeIn({
        duration: 1000,
        start: function() {
            console.log("Comecei a animacao");
        },
        done: function() {
            console.log("Terminei a animacao");
        }
    });
}

function fecharLoginPopup() {
    $("#login-popup").fadeOut({
        duration: 1000,
        start: function() {
            console.log("Comecei a animacao de fechar");
        },
        done: function() {
            console.log("Terminei a animacao de fechar. Escondendo janela de login..");
            $(this).css("display", "none");
        }
    });
}

function bloqueiaBotaoLogin(bloquear) {
    if (bloquear) {
        console.log("Bloqueando botao login");
        $("#fazerLogin").attr("disabled", true);

        //Animacao pra deixar o botao meio invisivel pra dizer que ta logando
        $("#fazerLogin").animate({
            opacity: 0.5
        }, 1000);
    } else {
        console.log("Desbloqueando botao login");

        //Animacao pra por a opacidade ao normal
        $("#fazerLogin").animate({
            opacity: 1
        }, 1000, function() {
            $(this).removeAttr("disabled");
        });
    }
}