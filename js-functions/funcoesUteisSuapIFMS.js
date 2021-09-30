/**
 * função que adiciona observação na folha de frequencia
 * @param observacao 
 */
async function setObservacao(editarApenasVazias = true, observacao = `Trabalho remoto conforme Decisão RTRIA 75/2020 - RT/IFMS e Memorando Circular n. 5/2020/DIGEP/RT/IFMS, item 1.5.`){
    //função para fazer requisição para obter o form e submetê-lo
    const fetchObservacao = (url, observacao)=>{
        fetch(url).then((response)=>{        
            return response.text(); 
        })
        .then((data)=>{
            const doc = (new window.DOMParser()).parseFromString(data, "text/html")
            const form = doc.querySelector('#observacao_form');
            let formData = new FormData();
            let token = form.querySelector('input[type="hidden"]')
            formData.append(token.name, token.value);
            formData.append('descricao', observacao);
            const option = {
                body: formData,
                method: "POST"
            };
            fetch(url,option)
            .then((response)=>{        
                console.log(response); 
            });         
        })
        .catch((error)=>{
            console.log(error);
        });
    };
    async function preencheObservacao(link) {        
        let existeObservacao = link.parentNode.querySelector('.comments>li');   
        //SE o td Não tem uma observação(comment):
        if(!editarApenasVazias || (editarApenasVazias && existeObservacao == null)){
            let url = link.href.replace('?_popup=1', '');
            await fetchObservacao(url, observacao);
        }
    } 
    //seleciona todos  link para adicionar_observacao
    const btnObservacaoList = document.querySelectorAll('a[href*="/ponto/observacao_adicionar/"]')
    //para cada link preenche o form de observação
    btnObservacaoList.forEach(link=>preencheObservacao(link));    
    //atualiza página
    document.location.reload(true);
}
