
/**
 * função que adiciona observação no conteúdo do Diário de Classe
 * @param {*} observacao 
 */
 (setObservacaoDiario = function (editarApenasVazias = true, observacao = `Aula ministrada utilizando meios e tecnologias de informação e comunicação), conforme Instrução Normativa 02_2020 Proen.`){
    
    //seleciona todos  os td que inicial com 'obs_' https://stackoverflow.com/questions/13533484/css-select-elements-with-partial-id
    let colunaObservacoes = document.querySelectorAll('td[id^="obs_"]')

    //para cada observação em colunaObservações
    colunaObservacoes.forEach((colunaObservacao) => {
        //1. simular clicar no <a class="edit_obs">,
        //pega o elemento <a> 
        let a = colunaObservacao.querySelector('a[class^="edit_obs"]')
        if(a !== null){
            //efetua o clique
            a.click(); 
        }
        //2. inserir o msg no <textarea>
        //pega o elemento '<textarea>'
        let textarea = colunaObservacao.querySelector('textarea')
        //altera o valor dele
        if(editarApenasVazias == true){
            if(textarea.value.trim() == ''){
                textarea.value = observacao;
            }
        }else{
            textarea.value = observacao;        
        }
        //3. salvar observação <a class="salvar_obs btn btn-mini btn-s">
        //pega o elemento <a class="salvar_obs btn btn-mini btn-s">
        a = colunaObservacao.querySelector('a[class^="salvar_obs"]')
        //simula o clique
        if(a !== null){
            //efetua o clique
            a.click(); 
        }   
    });
})();

/**
 * função que soma o total de aulas 
 * DETALHAMENTO DA PROPOSTA DE TRABALHO no plano de ensino
 * @returns numeroTotalAulas
 */
(somarNumeroDeAulas = function (){    
    const numeroAulasPeriodo = document.querySelectorAll("#proposta_trabalho>tbody>tr>td:nth-child(3)");
    let totalAulas = 0;
    for(let aulas of numeroAulasPeriodo){        
        totalAulas += parseInt(aulas.innerHTML);
    }    
    
    let templateHTML=`<tr><td class="alert alert-primary"colspan="6">
        O número total de aulas é: <strong> ${totalAulas} aulas </strong>
    </td></tr>`;
    let tfoot = document.createElement('tfoot');
    tfoot.innerHTML = templateHTML;
    
    document.querySelector('#proposta_trabalho').append(tfoot);    
    return totalAulas;
})();