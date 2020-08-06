<?php
include 'conexao.php';

$resposta = array();
$resposta['sucesso'] = 0;


if (estaConectado()) {
    if (isset($_POST['dadosJSON'])) {
        //Encontrou dados no post
        $novosDados = json_decode($_POST['dadosJSON'], 1);

        //Sem erros na leitura json
        if (json_last_error() == 0) {
            $chaveid = $novosDados['chaveID'];
            $chave = $novosDados['chave'];
            $maxips = $novosDados['maxIPs'];
            $qualquerip = $novosDados['qualquerIP'];

            $resposta['chaveID'] = $chaveid;

            //Formar a json dos IPs
            $ips = '{"ips":[';
            $totalIPs = sizeof($novosDados['ips']);
            foreach ($novosDados['ips'] as $index => $valor) {
                $ips = $ips . ('"' . $valor . '"');
                $ips = $ips . (($index + 1) < $totalIPs ? ',' : '');
            }
            $ips .= "]}";

            if ($conexaoMySQL->query("UPDATE licencas SET chave='$chave', maximoIPs=$maxips, permitirQualquerIp=$qualquerip, ipsPermitidos='$ips' WHERE id = $chaveid")) {
                $resposta['sucesso'] = 1;
            } else {
                $resposta['codigoErro'] = 4;
                $resposta['motivoErro'] = $conexaoMySQL->error;
            }
        } else {
            $resposta['codigoErro'] = 3;
            $resposta['motivoErro'] = json_last_error_msg();
        }
    } else {
        $resposta['codigoErro'] = 2;
        $resposta['motivoErro'] = "Nenhum dado valido fornecido";
    }
} else {
    $resposta['codigoErro'] = 1;
    $resposta['motivoErro'] = "Sem conexao com MySQL";
}

echo json_encode($resposta);
