<?php
@include 'scripts/conexao.php';
?>

<!DOCTYPE html>
<html>

<head>
    <title>Painel Administrativo - KeesTDev</title>

    <!--Carrego o CSS dessa pagina-->
    <link href="css/inicio.css" rel="stylesheet">

    <!--Carrega os framworks padroes como jQuery, bootstrap, etc.. -->
    <?php include 'scripts/frameworks.php'?>

    <script>
        $(function() {
            //Mostrar o conteudo
            $("#conteudo").fadeIn(1000);
        });
    </script>
</head>

<body>

    <div id="caixa">
        <?php require 'estilos/menu.php'; ?>
        <div id="conteudo">
            <h1>Dashboard</h1>

            <?php
            if (!estaConectado()) {
                echo "<p class='semConexao'>Aviso: O painel nao esta conectado ao banco de dados.</p>";
            }
            ?>
        </div>
    </div>

</body>

</html>