<?php
@require '../scripts/conexao.php';

/*
Exemplo de como os dados da requisicao sao:
[
{
"chave": "qalquerchavesia",
"servidorNome": "Nome do servidor",
"servidorIP": "123.456.789.1",
"servidorTotalPlugins": 3
"servidorPlugins": {
	"NomeDoPlugin": "1.3.4",
	"OutroPlugin": "1.2.6"
	}
}
]
*/
//Crio um array onde vou armazenar os dados que vou enviar de volta
$resposta = array();
//Verifico se o MySQL esta conectado
if (!estaConectado()) {
    $resposta['statusCodigo'] = 4;
    $resposta['statusMensagem'] = "[OFFLINE] KeesTDev.com: Sistemas de autorizacao de licencas temporariamente indisponiveis.";
} else {
    //Verifico se recebi os dados nas variaveis
    if (isset($_POST['requisicao']) && !empty($_POST['requisicao'])) {
        //echo "Recebi dados de uma requisicao, tentando converter pra JSON </br>";

        $dadosRequisicao = json_decode($_POST['requisicao'], 1);
        //Verifico se o json retornado esta em uma sintaxe correta
        if (json_last_error() == 0) {
            //Se a sintaxe estiver correta, entao posso pegar os dados do array do json
            $dadosRequisicao = $dadosRequisicao['dadosRequisicao'];

            //echo "Servidor fazendo a requisicao: " . $dadosRequisicao['servidorNome'] . "</br>";

            //Variaveis pra armazenar os dados de quem fez a solicitacao
            $servidorNome = $dadosRequisicao['servidorNome'];
            $servidorIP = $dadosRequisicao['servidorIP'];
            $servidorTotalPlugins = $dadosRequisicao['servidorTotalPlugins'];
            $servidorPlugins = $dadosRequisicao['servidorPlugins'];
            $servidorChave = $dadosRequisicao['chave'];

            //Verificar se a licenca que esta na requisicao existe
            //echo "Verificando se a chave " . $dadosRequisicao['chave'] . " existe </br>";
            $query = "SELECT * FROM licencas WHERE chave = '" . $servidorChave . "'";
            $resultado = $conexaoMySQL->query($query);

            //Verifico se a licenca esta no banco vendo se veio algum row no resultset
            if ($resultado->num_rows != 0) {
                ////echo "Achei a licenca no banco de dados </br>";
                //Resulset da query
                $resultado = $resultado->fetch_assoc();

                //Alguns dados da licenca
                $maxIpsLicenca = $resultado['maximoIPs'];
                $ipsNaLicenca = json_decode($resultado['ipsPermitidos'], 1);
                $chaveLicenca = $resultado['chave'];

                //Verifico o numero de IPs existentes na licenca
                if (empty($ipsNaLicenca)) {
                    //Se entrar aqui, é pq a licenca ainda nao tem nenhum IP
                    if ($maxIpsLicenca >= 1) {

                        //Insiro o Ip atual nessa licenca
                        //$novosIPs = '{"ips": ["' . $servidorIP . '"]}';
                        $novosIPs['ips'] = $servidorIP;


                        $query = "UPDATE licencas SET ipsPermitidos='" . json_encode($novosIPs) . "' WHERE chave = '$chaveLicenca'";
                        ////echo ($query) . "</br>";
                        if ($conexaoMySQL->query($query)) {
                            ////echo "Sucesso! Novo IP adicionado a licenca " . $chaveLicenca;

                            //Resposta 0 = Ok, pode ligar o plugin
                            $resposta['statusCodigo'] = 0;
                            $resposta['statusMensagem'] = "KeesTDev.com: Licenca autorizada com sucesso pela primeira vez. Caso queira mudar algo em sua licenca, acesse nosso site: keestdev.com";
                        } else {
                            //echo "Erro ao adicionar novo IP: " . $conexaoMySQL->error;
                            //Resposta 4 = sem conexao com mysql ou erro de query(msg de painel indisponivel)
                            $resposta['statusCodigo'] = 4;
                            $resposta['statusMensagem'] = "[ERRO] KeesTDev.com: Sistemas de autorizacao de licencas temporariamente indisponiveis.";
                        }
                    } else {

                        //Retorno com codigo de erro 2(Ips permitidos < 0)
                    }
                } else {
                    if (in_array($servidorIP, $ipsNaLicenca)) {
                        //echo "IP permitido!";
                        //Permito o plugin ligar ou faco outras verificacoes

                        //Verifico se o maximo de ips nao é 0, caso eu queria desativar uma licenca
                        if ($maxIpsLicenca >= 1) {
                            //Retorno 0 (Sem erros, ok)
                            $resposta['statusCodigo'] = 0;
                            $resposta['statusMensagem'] = "KeesTDev.com: Licenca autorizada. (" . $servidorNome . ")";
                        } else {
                            //Retorno 2 (Nenhum IP permitido nessa chave)
                            $resposta['statusCodigo'] = 2;
                            $resposta['statusMensagem'] = "KeesTDev.com: Desculpe, mas nenhum servidor está autorizado a utilizar essa chave.";
                        }
                    } else {
                        //echo "IP nao esta na lista de IPs permitidos";
                        //Retorno erro 3 (IP do requisitor nao esta permitido na lista de ips desta chave)
                        $resposta['statusCodigo'] = 3;
                        $resposta['statusMensagem'] = "KeesTDev.com: Seu IP (" . $servidorIP . ") não está permitido a usar esta licenca.";
                    }
                }
            } else {
                //echo "Nao achei a licenca no banco de dados </br>";
                //Retorno 1 (Licenca nao existe)
                $resposta['statusCodigo'] = 1;
                $resposta['statusMensagem'] = "KeesTDev.com: A licenca informada (" . $servidorChave . ") não existe.";
            }
        } else {
            //Caso tenha erros no json, encerro o script.
            $resposta['statusCodigo'] = 5;
            $resposta['statusMensagem'] = "KeesTDev.com: Solicitacao recusada, erro na confirmacao dos dados.";
            //echo ("Erro ao processar sua solicitacao. Voce provavelmente não é um plugin.. </br>");
        }
    } else {
        //echo "Nao recebi nenhum dados no meu POST </br>";
        //5 = nao enviaram nada no post
        $resposta['statusCodigo'] = 5;
        $resposta['statusMensagem'] = "KeesTDev.com: Solicitacao recusada.";
    }
}

//Retorno a resposta formulada
echo json_encode($resposta);
