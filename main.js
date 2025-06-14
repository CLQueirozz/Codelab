//algumas variaveis globais e divs MUITO importantes
    const resultado= document.getElementById("resultado");
    const search = document.getElementById("nome").value;
    let globalGameData= [];
    let globalPageNumero=1;
    let paginacaoCriada=false;
    let qtdTotalpag=1;
    let qtdTotalresul;
    let intervalo;

//cria resumo para usuário sobre sua busca
    function resumo(){

        let relatório=document.getElementById("relatório");
        let filtrosAtivos=[];
        let i=0;

        //lê cada array dos filtros e busca quais estâo ativados, caso estejam, coloca no array filtroAtivos
        //o contador i serve para ver se estamos lidando com 0, 1, ou um plural de filtros
            listaGêneros.forEach((coisa)=>{
                if (coisa.activation==='1'){
                    filtrosAtivos.push(coisa.nome);
                i++;}
            })

            listaTags.forEach((coisa)=>{
                if (coisa.activation==='1'){
                    filtrosAtivos.push(coisa.nome); 
                i++;}
            })

            listaPlataformas.forEach((coisa)=>{
                if (coisa.activation==='1'){
                    filtrosAtivos.push(coisa.nome); 
                i++;}
            })
        
        //isso escreve no relatório o número de resultados, o nome da busca e quais filtros estão sendo utilizados
            if(qtdTotalresul>0){
                if (i==0){
                    relatório.textContent= `Há ${qtdTotalresul} resultados para a busca ${search}`}
        
                if (i==1){
                    relatório.textContent= `Há ${qtdTotalresul} resultados para a busca ${search} com o filtro: ${filtrosAtivos}`;}

                if (i>1){
                    relatório.textContent= `Há ${qtdTotalresul} resultados para a busca ${search} com os filtros: ${filtrosAtivos.join(', ')}`;}
        } 
    }

//cria cards para os valores encontrados
    function mostrar() {
        resultado.innerHTML=""; //limpa os resultados anteriores quando fazemos uma nova busca

        clearInterval(intervalo);
        carregando.textContent='';

        resumo();

        globalGameData.forEach(game =>{ 
            
            const card= document.createElement("div"); //criando o card onde cada jogo será exibido
            card.classList.add("jogo"); //criando uma classe para poder alterar a card pelo css através do .jogo

            const setae=document.createElement("div"); //dividindo a card em duas partes para a imagem ficar no lado das informações do jogo e as informações do jogo ficarem uma em cima da outra
            const setad=document.createElement("div");
            setae.classList.add("setae");
            setad.classList.add("setad");
            card.appendChild(setae); //essas partes div das setas agora estão sendo postas dentro da div card
            card.appendChild(setad);


            const img= document.createElement("img");
            img.src=game.imagem;  //o link da imagem recebida pela api agora está sendo passada para o source da nova constante imagem
            img.classList.add("imagem-jogo");
            setae.appendChild(img); //lado esquerdo do card
        
            const nome = document.createElement("h3");
            nome.textContent=game.nome;
            nome.classList.add("titulo-jogo");
            setad.appendChild(nome); //lado direito do card

            const lancamento= document.createElement("p");
            lancamento.textContent= `Lançamento: ${game.lancamento}`;
            lancamento.classList.add("info-jogo");
            setad.appendChild(lancamento); //lado direito do card

            const avaliacao=document.createElement("p");
            avaliacao.textContent=`Avaliação: ${game.avaliacao} ⭐`;
            avaliacao.classList.add("info-jogo");
            setad.appendChild(avaliacao); //lado direito do card
        
            const plataformas=document.createElement("p");
            plataformas.textContent=`Plataformas: ${game.plataformas}`;
            plataformas.classList.add("info-jogo");
            setad.appendChild(plataformas); //lado direito do card

            resultado.appendChild(card); //card agora está dentro da div resultado

            if(!paginacaoCriada){//somente a primeira vez que for pesquisada vai entrar nisso e exibir junto com os cards os botões
                cardPag();
            }
    })
}

//Cria o card de paginação
    function cardPag(){
        const paginacao=document.createElement("div");//fazendo referência ao div com id page no html
                paginacao.id="page";

                const botaoe=document.createElement("button");
                botaoe.id="prev";
                botaoe.textContent="⬅️";

                const botaod=document.createElement("button");
                botaod.id="next";
                botaod.textContent="➡️";

                const texto=document.createElement("div");
                texto.id="texto";
                
                const n=document.createElement("p");
                texto.appendChild(n);
                
                const num=document.createElement("p");
                num.textContent=globalPageNumero;
                num.id="num";
                texto.appendChild(num);

                paginacao.appendChild(botaoe);//appendChild na ordem que queremos <- [texto] ->
                paginacao.appendChild(texto);
                paginacao.appendChild(botaod);

                document.body.appendChild(paginacao);//aparecer no fim da página

                botaoe.addEventListener("click",()=> {
                    if(globalPageNumero>1){
                        globalPageNumero--;
                    }
                    buscar();
                    updatePag();
                })

                botaod.addEventListener("click",()=> {
                    if(globalPageNumero<qtdTotalpag){
                        globalPageNumero++;
                    }
                    buscar();
                    updatePag();
                })

                paginacaoCriada=true;
    }

//põe os event listeners do botão e do enter para pesquisar
    const enter= document.getElementById("nome");
    const button = document.getElementById("busca");

    enter.addEventListener('keydown', function(event) {
        if (event.key==='Enter'){
            globalPageNumero=1; //atualiza o valor da página a cada nova busca
            buscar();
            pag();
        }})

    button.addEventListener('click',()=> {
        globalPageNumero=1; //atualiza o valor da página a cada nova busca
        buscar();
    });

    //muda no html a contagem da pagina para que o usuario veja em qual pagina ele está
        function updatePag(){
            const valor=document.getElementById('num');
            if(valor){
                valor.textContent=globalPageNumero;
            }
    }

    //retorna o numero da pagina, util para ser lido depois pela função link e pela função buscar
        function linkPag(){
            return globalPageNumero;
        }

//define a url da API
    function link(){
        const page = linkPag();
        const plataformas= quaisFiltros(listaPlataformas, '&platforms');
        const tags= quaisFiltros(listaTags, '&tags');
        const gêneros= quaisFiltros(listaGêneros, '&genres');
        const key= "1175c03391d84eaf9b022713f3c5e618";
        const url= `https://api.rawg.io/api/games?key=${key}&search=${search}&page=${page}${plataformas}${tags}${gêneros}`
        
        return url;
    }

//cria a animaçao de "carregando ..."
    function loading(){
        const carregando= document.getElementById("carregando");
        let numPontos=0;

        //a cada 500ms, vai ser acresecentado um ponto final no "caregando"
            return setInterval(()=>{
                numPontos= (numPontos+1)%4;
                carregando.textContent='Carregando'+ '.'.repeat(numPontos);
            },500);}

//busca na api 
    async function buscar(){
        
        //inicializa o carregando...
        intervalo=loading();

        //vai na API
        try{
            const response= await fetch(link());
            const dados= await response.json();
        
        //quantidade total de resultados
        qtdTotalresul=dados.count;

        //para que sempre que uma nova busca for feita, o número da pagina volte a ser 1 e seja apresentada a página inicial
        updatePag();
        //20 jogos por página, logo a quantidade total de páginas a serem exibidas por pesquisa é a divisão arredondada para cima
        qtdTotalpag=Math.ceil(qtdTotalresul/20);


        //limpa o q estava antes na variavel global
        globalGameData=[]; 

        //separa os diferentes atributos de cada jogo
            dados.results.forEach((result)=>{
                const localGameData={
                    nome:result.name,
                    id: result.id,
                    lancamento:result.released,
                    avaliacao: result.rating,
                    imagem: result.background_image,
                    plataformas: []}
        
        
                if(result.platforms && result.platforms.length > 0) {
                    result.platforms.forEach((item)=>{
                        if(item.platform)
                            localGameData.plataformas.push(item.platform.name); 
                        });
                }

    //pôe os atributos encontrados na função busca dentro da variavel global que vai ser lida depois
            globalGameData.push(localGameData);
    });

        setTimeout(mostrar, 1000);
        window.scrollTo({ top: 0, behavior: "smooth" });

    }


    catch(error){
        console.log(error);
        //remove o "carregando ...""
            clearInterval(intervalo);
            carregando.textContent='';

        //cria uma interface user-friendly de q houve um erro
        cardErro=document.createElement("div");
        cardErro.id='cardErro';
        cardErro.textContent='❌ Erro ao pesquisar jogo ❌';
        resultado.appendChild(cardErro);
    }}

//filtro
    //funçôes importantes de filtro

        //essas 2 funções criam um botâo pra cada dado na array de filtros fornecida como container no parâmetro, põe o event 
        //listener neles pra ativar os filtros e já dá o appendchild para a div fornecida como parent no parâmetro. 
            function appendBotãoFiltro(parent, container){
             container.forEach((item)=>{
                  const botão=document.createElement("button");
                    botão.className='botbot';
                    botão.textContent=item.nome;

                    botão.addEventListener('click', ()=>ativaçãoFiltro(container, botão, item));
                
                    parent.appendChild(botão);
                    })
            } 

            function ativaçãoFiltro(container, botão, item){
                    if (item.activation==='0'){
                        item.activation='1';
                        botão.style.backgroundColor="rgb(105, 108, 113)";}

                    else{
                        item.activation='0';
                        botão.style.backgroundColor="rgb(178, 191, 215)"; }
            }
        
        //essa é uma função pra busca na API, que retorna os nomes que vâo ser inseridos no link
            function quaisFiltros(container, tipoFiltro) {
                    let param=`${tipoFiltro}=`;
                    let i=0;
                    let ativos=[];

                    container.forEach((item)=>{
                        if (item.activation=='1'){
                            ativos.push(item.APIvalue);
                            i=1;} })

                    param= param + ativos.join(',');
                    if(i>0) return param;

                    else return '';}

    //variáveis já presentes no HTML
        const larguraFiltro=document.getElementById("filtragem");
            const displayFiltros=document.getElementById("botãoFiltro");
            const espaçoFiltro=document.getElementById("lugarDosFiltros");

    //variavel que olha se a barra filtros está aberta ou não, no caso, ela começa fechada
        let filtrosCriados=false;

    //cria os 4 botões presentes dentro do filtro: gêneros, tags, disponivel em, aplicar
    //cria tbm algumas divs por motivos de css
         const botaoGeneroDiv=document.createElement("div");
         botaoGeneroDiv.id="generoDiv";
         const botaoGenero=document.createElement("button");
         botaoGenero.id="genero";
         botaoGenero.textContent="Gêneros >";
         botaoGeneroDiv.appendChild(botaoGenero);

         const botaoTagDiv=document.createElement("div");
         botaoTagDiv.id="tagDiv";
         const botaoTag=document.createElement("button");
         botaoTag.id="tag";
         botaoTag.textContent="Tags >";
         botaoTagDiv.appendChild(botaoTag);

         const botaoPlataformaDiv=document.createElement("div");
         botaoPlataformaDiv.id="plataformaDiv";
         const botaoPlataforma=document.createElement("button");
         botaoPlataforma.id="plataforma";
         botaoPlataforma.textContent="Disponível para >";
         botaoPlataformaDiv.appendChild(botaoPlataforma);

         const botaoAplicarDiv=document.createElement("div");
         botaoAplicarDiv.id="aplicarDiv";
         const botaoAplicar=document.createElement("button");
         botaoAplicar.id="aplicar";
         botaoAplicar.textContent="Aplicar";
         botaoAplicarDiv.appendChild(botaoAplicar);
        
    //event listener que verifica se a pessoa clicou no botão do filtro
    //se clicou um número impar de vezes, o menu vai abrir e mostrar as opções de filtro
    //se clicar um número par de vezes, o menu vai ser fechado e ocultar as opções de filtro
        displayFiltros.addEventListener('click',()=> {
            filtrosCriados=!filtrosCriados;

            if (filtrosCriados){
                displayFiltros.textContent=`Filtros <`;
                espaçoFiltro.appendChild(botaoGeneroDiv);
                espaçoFiltro.appendChild(botaoTagDiv);
                espaçoFiltro.appendChild(botaoPlataformaDiv);
                espaçoFiltro.appendChild(botaoAplicarDiv);
            }

            else{
                displayFiltros.textContent=`Filtros >`
                espaçoFiltro.replaceChildren();
            }
        });                

    //filtro de gênero 
        let generosCriados=false; //controle de se os gêneros estâo abertos ou nâo

        //espaço para os gêneros
            const lugarDosGêneros=document.createElement("div");
            lugarDosGêneros.id="lugarGêneros";

        //banco de dados dos gêneros
            const listaGêneros=[
                {nome: 'Ação', APIvalue:'action', activation: '0'},
                {nome: 'Aventura', APIvalue:'adventure', activation: '0'},
                {nome: 'Corrida', APIvalue:'racing', activation: '0'},
                {nome: 'Esportes', APIvalue:'sports', activation: '0'},
                {nome: 'Indie', APIvalue:'indie', activation: '0'},
                {nome: 'Puzzle', APIvalue:'puzzle', activation: '0'},
                {nome: 'Estratégia', APIvalue:'strategy', activation: '0'},
                {nome: 'Shooter', APIvalue:'shooter', activation: '0'},
            ]
            
        //abre e fecha o menu de opçoes de gênero
            botaoGenero.addEventListener('click',()=> {
                generosCriados=!generosCriados;

                if (generosCriados){
                    botaoGenero.textContent=`Gêneros <`
                    appendBotãoFiltro(lugarDosGêneros, listaGêneros);
                    botaoGeneroDiv.appendChild(lugarDosGêneros); 
                }

                if (!generosCriados){
                    botaoGenero.textContent=`Gêneros >`
                    lugarDosGêneros.replaceChildren();
                    botaoGeneroDiv.removeChild(lugarDosGêneros); 
                }
            });   

    //filtro de tags
        let tagsCriadas=false; //controle de se as tags estâo abertas ou não

        //espaço para as tags
            const lugarDasTags=document.createElement("div");
            lugarDasTags.id="lugarTags";
        
        //banco de dados das tags
        const listaTags=[
            {nome: 'SinglePlayer', APIvalue:'singleplayer', activation: '0'},
            {nome: 'MultiPlayer', APIvalue:'multiplayer', activation:'0'}
        ]

        //abre e fecha o menu de opçoes de tag
            botaoTag.addEventListener('click',()=> {
                tagsCriadas=!tagsCriadas;

                if (tagsCriadas){
                    botaoTag.textContent=`Tags <`
                    appendBotãoFiltro(lugarDasTags, listaTags);                
                    botaoTagDiv.appendChild(lugarDasTags); 
                }

                if (!tagsCriadas){
                    botaoTag.textContent=`Tags >`
                    lugarDasTags.replaceChildren();
                    botaoTagDiv.removeChild(lugarDasTags); 
                }
            });
    
    //filtro de plataformas
        let plataformasCriados=false; //controle de se as plataformas estâo abertas ou nâo
        
        //espaço para as plataformas
            const lugarDasPlataformas=document.createElement("div");
            lugarDasPlataformas.id="lugarPlataformas";

        //dados de cada tipo de plataforma
            const listaPlataformas=[
                {nome: 'PC', APIvalue:'4', activation: '0'},
                {nome: 'Android', APIvalue:'21', activation: '0'},
                {nome: 'iOS', APIvalue:'3', activation: '0'},
                {nome: 'PlayStation 2', APIvalue:'15', activation: '0'},
                {nome: 'PlayStation 3', APIvalue:'16', activation: '0'},
                {nome: 'PlayStation 4', APIvalue:'18', activation: '0'},
                {nome: 'PlayStation5', APIvalue:'187', activation: '0'},
                {nome: 'Xbox One', APIvalue:'1', activation: '0'},
                {nome: 'Xbox 360', APIvalue:'14', activation: '0'},
                {nome: 'Wii/Wii U', APIvalue:'10,11', activation: '0'},
                {nome: 'Nintendo Switch', APIvalue:'7', activation: '0'},
                {nome: 'Nintendo 3DS', APIvalue:'8', activation: '0'},
                {nome: 'Nintendo DS', APIvalue:'9', activation: '0'},
                {nome: 'Nintendo 64', APIvalue:'83', activation: '0'},
                {nome: 'Atari', APIvalue:'28,31,23,22,25,34,46,50', activation: '0'}
            ]
            
            
        //abre e fecha o menu de opçoes de plataformas
            botaoPlataforma.addEventListener('click',()=> {
                plataformasCriados=!plataformasCriados;

                if (plataformasCriados){
                    botaoPlataforma.textContent=`Disponível para <`
                    appendBotãoFiltro(lugarDasPlataformas, listaPlataformas)
                    botaoPlataformaDiv.appendChild(lugarDasPlataformas);} 
                

                if (!plataformasCriados){
                    botaoPlataforma.textContent=`Disponível para >`
                    lugarDasPlataformas.replaceChildren();
                    botaoPlataformaDiv.removeChild(lugarDasPlataformas); 
                
            }});
        
    //quando a pessoa clicar em aplicar, tem que fazer uma busca usando os novos filtros aplicados e fechar o menu feio de filtros
        botaoAplicar.addEventListener('click', ()=>{
            espaçoFiltro.replaceChildren();
            filtrosCriados=false;
            displayFiltros.textContent=`Filtros >`
            buscar();
        });
