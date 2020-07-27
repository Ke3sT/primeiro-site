//Classe pra criar as paginas
class Pagina {
    //Array contendo todos os elementos
    dados;
    //Objeto onde é guardado as paginas e seus respectivos elementos
    paginaDados = {};
    //Total de dados em todas as paginas
    totalDados = 0;
    //Numero de itens por pagina
    itensPorPagina = 10;
    //Total paginas
    totalPaginas = 0;
    //Salvo a pagina recente mostrada
    paginaAtual = 0;
    //Salvo a pagina anterior quando ele pula para a proxma pagina
    paginaAnterior = 0;

    //Metodo construtor
    constructor(itensPorPagina, arrayItens) {
        //Defino os itens por pagina a partir do parametros acima
        this.itensPorPagina = itensPorPagina;
        //Pego o numero de elementos
        this.totalDados = arrayItens.length;
        //Guardo os dados
        this.dados = arrayItens;

        //Calculo quantas paginas será necessario
        this.totalPaginas = Math.ceil(this.totalDados / this.itensPorPagina);
    }

    //Metodo que cria as paginas
    criarPaginas() {
        console.log("A lista ainda nao foi criada. Criando paginas...");
        console.log("Criando " + this.getTotalPaginas() + " paginas, com " + this.getItensPorPagina() + " elementos por pagina. Total de elementos: " + this.getTotalDados());

        //Vars pra controlar as paginas e os elementos
        var paginaAtual = 0;
        var indexAtual = 0;
        var paginaDados = {};

        //Passo por cada elemento
        for (var loop = 0; loop <= (this.getTotalDados() - 1); loop++) {
            //Pego os dados do elemento atual no loop
            var dadosElemento = this.getDados()[loop];

            //Coloco os dados do elemento atual em um objeto com o index dele(o index no caso é o numero de 0 até o max de itens por pagina)
            paginaDados[indexAtual] = dadosElemento;

            indexAtual++;
            //Caso o index seja maior que o numero de itens numa pagina, ou seja o ultimo ainda contendo elementos pra adicionar
            //Ele entra no if abaixo, ele salva o objeto contendo os elementos da X pagina na variavel global de paginas
            if (indexAtual >= this.getItensPorPagina() || (loop == (this.getTotalDados() - 1) && Object.keys(paginaDados).length != 0)) {

                //Salvo os elementos da pagina indexAtual na paginaAtual e prossigo pra salvar a proxima pagina
                this.getPaginas()[paginaAtual] = paginaDados;
                indexAtual = 0;
                paginaAtual++;
                paginaDados = {};
            }
        };
    }

    //Retorna os elementos de uma pagina
    getPagina(qualPagina) {
        console.log("Pagina solicitada: " + qualPagina);
        qualPagina = qualPagina - 1;
        if (qualPagina > this.getTotalPaginas()) {
            console.log("Pagina " + qualPagina + " nao existe. Devolvendo a 1 pagina");
            qualPagina = 0;
        }

        return this.getPaginas()[qualPagina];
    }

    //------------------------- Alguns getters
    //Pega as paginas
    getPaginas() {
        return this.paginaDados;
    }

    //Pega quantas paginas tem 
    getTotalPaginas() {
        return this.totalPaginas;
    }

    //Retorna o array contendo os elementos
    getDados() {
        return this.dados;
    }

    //Retorna os itens por pagina
    getItensPorPagina() {
        return this.itensPorPagina;
    }

    //Retorna o numero de dados no array
    getTotalDados() {
        return this.totalDados
    }

    getPaginaAtual() {
        return this.paginaAtual;
    }

    setPaginaAtual(qualPagina) {
        this.paginaAtual = qualPagina;
    }

    getPaginaAnterior() {
        return this.paginaAnterior;
    }

    setPaginaAnterior(qualPagina) {
        this.paginaAnterior = qualPagina;
    }

}