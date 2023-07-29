class PlanoDeEnsino {
  constructor(diarioURL = window.location.href) {
    this.diario = this.extrairNumeroDiarioDaURL(diarioURL);
    this.frequenciaURL = `https://academico.ifms.edu.br/administrativo/professores/diario/${this.diario}/frequencia`;
    this.semanasDoAno = new Map();
    this.totalDeAulas = 0;
  }

  extrairNumeroDiarioDaURL(diarioURL) {
    const regex = /\/diario\/(\d+)/;
    const match = diarioURL.match(regex);

    if (match && match[1]) {
      return match[1];
    } else {
      return null;
    }
  }

  obterNumeroDaSemana(dataFormatoBrasileiro = "01/01") {
    // Separa o dia e o mês
    const [dia, mes] = dataFormatoBrasileiro.split("/");

    // Obtém a data atual para pegar o ano corrente
    const dataAtual = new Date();
    const ano = dataAtual.getFullYear();

    //criar data para o ano atual. new Date(ano, mes [0-11], dia)
    const data = new Date(ano, mes - 1, dia);

    const primeiroDiaDoAno = new Date(ano, 0, 1);
    const diferenca =
      primeiroDiaDoAno.getDay() === 0 ? 1 : 8 - primeiroDiaDoAno.getDay();
    const primeiraSegunda = new Date(
      primeiroDiaDoAno.getFullYear(),
      0,
      diferenca
    );
    const numeroDaSemana = Math.ceil(
      ((data - primeiraSegunda) / 86400000 + 1) / 7
    );
    const primeiroDiaDaSemana = new Date(
      primeiraSegunda.getTime() + (numeroDaSemana - 1) * 7 * 24 * 60 * 60 * 1000
    );
    const ultimoDiaDaSemana = new Date(
      primeiroDiaDaSemana.getTime() + 6 * 24 * 60 * 60 * 1000
    );

    return {
      numeroDaSemana: numeroDaSemana,
      inicio: primeiroDiaDaSemana,
      fim: ultimoDiaDaSemana,
    };
  }

  async obterMapQuantidadeDeAulas() {
    this.semanasDoAnoMap = new Map();
    this.totalDeAulas = 0;

    try {
      const response = await fetch(this.frequenciaURL);
      const html = await response.text();

      // Cria um elemento temporário para conter o HTML
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;

      // Filtra o conteúdo pela classe desejada
      const dias = tempDiv.querySelectorAll(
        ".diario thead:nth-child(1) tr:nth-child(1) th:nth-child(n+3):nth-child(n)"
      );

      // Faz algo com os elementos filtrados (por exemplo, iterar e imprimir)
      dias.forEach((dia) => {
        const textoColuna = dia.textContent.trim();

        if (textoColuna !== "#" && textoColuna !== "Estudantes") {
          const { numeroDaSemana, inicio, fim } =
            this.obterNumeroDaSemana(textoColuna);

          if (this.semanasDoAnoMap.has(numeroDaSemana)) {
            const semana = this.semanasDoAnoMap.get(numeroDaSemana);
            semana.quantidadeDeAulas++;
            this.totalDeAulas++;
            this.semanasDoAnoMap.set(numeroDaSemana, semana);
          } else {
            this.semanasDoAnoMap.set(numeroDaSemana, {
              quantidadeDeAulas: 1,
              inicio,
              fim,
            });
          }
        }
      });
    } catch (error) {
      console.error("Erro ao obter o HTML:", error);
    }

    return {
      totalDeAulas: this.totalDeAulas,
      semanasMap: this.semanasDoAnoMap,
    };
  }

  obterConteudo(separacao = ".") {
    return document
      .querySelector("#PlanoEnsinoEmenta")
      .value.split(separacao)
      .filter((elemento) => elemento !== "");
  }

  async preencher(conteudos = this.obterConteudo()) {
    document.querySelector("#botao_adicionar_proposta").click();
    const { totalDeAulas, semanasMap } = await this.obterMapQuantidadeDeAulas();
    const media = Math.floor(semanasMap.size / conteudos.length);
    let indice = 0;
    let quantidade = 1;
    semanasMap.forEach((semana, numeroDaSemana) => {
      const { quantidadeDeAulas, inicio, fim } = semana;
      console.log({
        semana: numeroDaSemana,
        mes: inicio.getMonth() + 1,
        conteudo: conteudos[indice],
        quantidade: quantidadeDeAulas,
        inicio: inicio.getDate(),
        fim: fim.getDate(),
      });
      this.adicionarPropostaDeTrabalho(
        conteudos[indice],
        inicio.getMonth() + 1,
        inicio.getDate(),
        fim.getDate(),
        quantidadeDeAulas
      );
      if (quantidade < media) {
        quantidade++;
      } else if (indice < conteudos.length - 1) {
        indice++;
        quantidade = 1;
      }
    });
    setTimeout(() => {
      location.reload(true);
    }, 3000);
  }

  adicionarPropostaDeTrabalho(
    conteudo,
    mes,
    inicio,
    fim,
    quantidadeDeAulas,
    tecnicas = [
      "Aula prática",
      "Estudo de caso",
      "Estudo dirigido",
      "Expositiva/dialogada",
    ],
    recursos = ["Laboratório", "Projetor multimídia", "Quadro branco/canetão"],
    observacoes = ""
  ) {
    console.log({ conteudo, mes, inicio, fim, quantidadeDeAulas });

    document
      .querySelector("#PlanoEnsinoPropostaTrabalhoMes")
      .querySelector(`option[value^="${mes}"]`).selected = true;
    document.querySelector("#PlanoEnsinoPropostaTrabalhoInicio").value = inicio;
    document.querySelector("#PlanoEnsinoPropostaTrabalhoFim").value = fim;
    document.querySelector("#PlanoEnsinoPropostaTrabalhoQtAulas").value =
      quantidadeDeAulas;
    document.querySelector("#PlanoEnsinoPropostaTrabalhoObservacoes").value =
      observacoes.trim();
    document.querySelector("#PlanoEnsinoPropostaTrabalhoConteudo").value =
      conteudo.trim();
    // console.log(conteudo,mes,inicio,fim,quantidadeDeAulas,tecnicas,recursos,observacoes);
    //#select_adicionar_tecnica
    const selectTecnicas = document.querySelector(
      "#PlanoEnsinoPropostaTrabalhoTecnicasEnsino"
    );

    document
      .querySelectorAll("#PlanoEnsinoPropostaTrabalhoTecnicasEnsino option")
      .forEach((option) => {
        option.remove();
      });

    tecnicas.forEach((tecnica) => {
      let tecnica_opt = document.createElement("option");
      tecnica_opt.value = tecnica;
      tecnica_opt.text = tecnica;
      selectTecnicas.appendChild(tecnica_opt);
    });

    // Adicionar as opções para os recursos de ensino
    const selectRecursos = document.querySelector(
      "#PlanoEnsinoPropostaTrabalhoRecursosEnsino"
    );

    document
      .querySelectorAll("#PlanoEnsinoPropostaTrabalhoRecursosEnsino option")
      .forEach((option) => {
        option.remove();
      });

    recursos.forEach((recurso) => {
      let recurso_opt = document.createElement("option");
      recurso_opt.value = recurso;
      recurso_opt.text = recurso;
      selectRecursos.appendChild(recurso_opt);
    });
    //salvar
    document.querySelector("#salvar_proposta_trabalho").click();
  }
}
// Exemplo de uso com a URL atual como padrão:
const planoDeEnsino = new PlanoDeEnsino();
planoDeEnsino.obterConteudo();
