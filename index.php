<?php
session_start();

@include '__usuario/usuariodata.php';

if (isset($_SESSION['estaLogado'])) {
    //Tem secao!

    //Verifico se a conexao com mysql foi concluida
    if (estaConectado()) {
        //Sim, registra sessao
        if ($_SESSION['estaLogado']) {
            $_SESSION['dadosUsuarios'] = new UsuarioData($_SESSION['idUsuario']);
            //Esta logado!
        }
    } else {
        //Caso contrario, destruo a sessao.
        session_destroy();
        header("Location: index.php");
    }
}

?>
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>KeesTDev - ?</title>

    <link href="__css/index.css" rel="stylesheet">
    <link href="__css/login.css" rel="stylesheet">
    <link href="__css/registrar.css" rel="stylesheet">
    <!--<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    -->
    <link href="__libraries/bootstrap.min.css" rel="stylesheet">
    <script src="__libraries/jquery-3.5.1.min.js"></script>
    <script src="__libraries/bootstrap.min.js"></script>
    <script src="__libraries/popper.min.js"></script>

    <style>
        body {
            background-color: rgba(185, 185, 196, 0.822);
        }
    </style>

    <?php if (!estaLogado()) { ?>
        <!-- Se o usuario nao estiver logado, carrego essas libraries abaixo -->
        <script src="__login/javascripts/loginpopup.js"></script>
        <script src="__login/javascripts/registrarpopup.js"></script>

    <?php } ?>

    <script>
        //Codigo para executar quando estiver logado
        <?php if (estaLogado()) { ?>

            $(function() {
                resizeLogin();

                //Funcao para customizar o botao do logout
                var menuLogin = $("#menuLogin");
                menuLogin.removeClass("botaologin");
                menuLogin.addClass("botaologout");

                menuLogin.hover(function() {
                    menuLogin.find("a").text("Logout");
                }, function() {
                    resizeLogin();
                });

                menuLogin.click(function() {
                    console.log("Clicou no botao logout");
                    window.location.replace("__login/logout.php");
                });

                $("#botaopainel").click(function() {
                    console.log("Clicou pra entra no painel");
                    window.location.replace("__painel_admin/inicio.php");
                });
            });

        <?php } ?>

        function resizeLogin() {

            <?php if (estaLogado()) {
            ?>
                var nomeUsuario = '<?php echo $_SESSION['dadosUsuarios']->getNome() ?>';
            <?php } else { ?>
                var nomeUsuario = "Fazer login";
            <?php } ?>

            var textoLogin = $("#menuLogin");
            var novoTotalWidth = (nomeUsuario.length * 8) + 113;
            textoLogin.css("width", novoTotalWidth);

            textoLogin.find("a").html(nomeUsuario);
        }
    </script>
</head>

<body>

    <!-- Menu do site -->
    <nav class="menu">
        <div class="item-menu">
            <a>Opcao 1</a>
        </div>

        <div class="item-menu">
            <a>Opcao 2</a>
        </div>

        <div class="item-menu submenu">
            <a>Opcao Multiplas</a>

            <div class="submenu-itens">
                <a>Opcao 1</a>
                <a>Opcao 2</a>
                <a>Opcao 3</a>
            </div>
        </div>

        <!--Se o usuario estiver logado, eu disponibilizo o botao pra acessar o painel-->
        <?php if (estaLogado()) { ?>
            <div id="botaopainel" class="item-menu botaoacessapainel">
                <a>Acessar painel</a>
            </div>
        <?php } ?>

        <!--Botao pra fazer o login-->
        <div id="menuLogin" class="item-menu submenu botaologin">
            <a>Fazer login</a>
        </div>
    </nav>

    <!-- Popup do login e  register-->
    <?php if (!estaLogado()) { ?>
        <!-- Formulario de login -->
        <div id="login-popup" class="caixaLogin">
            <form id="login-formulario" class="formLogin" action="">

                <h1>Efetuar login</h1>

                <div class="campos">
                    <label for="login">Usuario:</label>
                    <input id="login" name="usuarioLogin" type="text" placeholder="Nome de usuario" title="Digite seu usuario" required>

                    <label for="senha">Senha:</label>
                    <input id="senha" name="usuarioSenha" type="password" placeholder="Senha" title="Digite sua senha" required>

                    <p id="loginStatus"></p>
                </div>

                <button id="fazerLogin" name="fazerLogin" type="submit">Login</button>

                <input id="lembrarCheckbox" type="checkbox" name="lembrar">
                <label id="lembrarTexto" for="lembrar">Continuar logado</label>
                <button type="button" id="abrirRegistar">Nao tem uma conta? Registre-se</button>

                <button type="button" id="fechaLoginPopUp">Fechar</button>
            </form>
        </div>

        <!-- Formulario de registro -->
        <div id="registrar-popup" class="caixaRegistrar">
            <form id="registro-formulario" class="formRegistrar" action="">

                <h1>Registrar-se</h1>

                <div class="campos">
                    <label for="reg-usuario">Informe um nome de usuario:</label>
                    <input id="reg-usuario" name="usuario" type="text" placeholder="Nome de usuario para realizar login" title="Digite um nome de usuario que deseje usar" required>

                    <label for="reg-nome">Informe seu nome:</label>
                    <input id="reg-nome" name="nome" type="text" placeholder="Xablau da Silva" title="Digite seu nome">

                    <label for="reg-email">Informe seu endereco de e-mail</label>
                    <input id="reg-email" name="email" type="email" placeholder="meuemail@algumemail.com" title="Digite seu endereco de e-mail">

                    <label for="reg-senha">Senha:</label>
                    <input id="reg-senha" name="senha" type="password" placeholder="Senha" title="Digite sua senha">

                    <p id="registroStatus"></p>
                </div>

                <button id="botaoRegistrar" type="submit">Registrar</button>
                <button type="button" id="fechaRegistroPopUp">Fechar</button>
                <button type="button" id="abreLoginPopup">Voltar para o login</button>

            </form>
        </div>

    <?php } ?>


    <main>
        <h1>Pagina inicial</h1>
    </main>
</body>

</html>