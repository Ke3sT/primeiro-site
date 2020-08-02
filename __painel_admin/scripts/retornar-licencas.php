<?php
include 'conexao.php';

if (estaConectado()) {
    $query = "SELECT * from licencas";
    $resultado = $conexaoMySQL->query($query)->fetch_all(1);

    echo json_encode($resultado);
} else {
    echo "";
}
