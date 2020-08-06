<?php
@include 'conexao.php';

if (estaConectado()) {

    if (isset($_POST['licencaID'])) {
        $licencaRequisitada = $_POST['licencaID'];
        $query = "SELECT * from licencas WHERE id = $licencaRequisitada";
    } else {
        $query = "SELECT * from licencas";
    }

    $resultado = $conexaoMySQL->query($query)->fetch_all(1);

    echo json_encode($resultado);
} else {
    echo "";
}
