//algumas variaveis globais e divs MUITO importantes
    const resultado= document.getElementById("resultado");
    const carregando= document.getElementById("carregando");
    let globalGameData= [];
    let globalPageNumero=1;
    let paginacaoCriada=false;
    let qtdTotalpag=1;
    let qtdTotalresul;
    let intervalo;

//pega o nome da busca
    function getName(){
        let search = "";
        if (document.getElementById("nome").value)
            search='"'+ document.getElementById("nome").value + '"';
        return search;}

//põe os event listeners do botão e do enter para pesquisar
    const enter= document.getElementById("nome");
    const button = document.getElementById("busca");

    enter.addEventListener('keydown', function(event) {
        if (event.key==='Enter'){
            globalPageNumero=1; //atualiza o valor da página a cada nova busca
            buscar();
        }})

    button.addEventListener('click',()=> {
        globalPageNumero=1; //atualiza o valor da página a cada nova busca
        buscar();
    });

//define a url da API
    function link(){
        const key= "1175c03391d84eaf9b022713f3c5e618";
        const search=getName();
        const page = globalPageNumero;
        const plataformas= quaisFiltros(listaPlataformas, '&platforms');
        const tags= quaisFiltros(listaTags, '&tags');
        const gêneros= quaisFiltros(listaGêneros, '&genres');
        const url= `https://api.rawg.io/api/games?key=${key}&search=${search}&page=${page}${plataformas}${tags}${gêneros}`
        return url;}

//busca na api 
    async function buscar(){
        
        //inicializa o carregando...
            if(intervalo) {
                clearInterval(intervalo);}
            intervalo=loading();

        //vai na API
            try{
                const response= await fetch(link());
                const dados= await response.json();
        
                qtdTotalresul=dados.count; //quantidade total de resultados

                updatePag(); //para que sempre que uma nova busca for feita, o número da pagina volte a ser 1 e seja apresentada a página inicial
                
                qtdTotalpag=Math.ceil(qtdTotalresul/20);  //20 jogos por página, logo a quantidade total de páginas a serem exibidas por pesquisa é a divisão arredondada para cima
                
                globalGameData=[]; //limpa o q estava antes na variavel global
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
                                localGameData.plataformas.push(item.platform.name); });
                        }

                globalGameData.push(localGameData);}); //pôe os atributos encontrados na função busca dentro da variavel global que vai ser lida depois

                setTimeout(mostrar, 1000); //só pro carregar não ficar tiltando esquisitamente
                window.scrollTo({ top: 0, behavior: "smooth" }); //volta sempre pro início da página

                //fecha o menu de filtros
                fechaFiltros();
                }

            catch(error){
                console.log(error);
                deuRuim();}}

//cria cards para os valores encontrados
    function mostrar() {
        resultado.innerHTML=""; //limpa os resultados anteriores quando fazemos uma nova busca

        clearInterval(intervalo);
        carregando.textContent='';

        const relatório=document.getElementById("relatório");
        relatório.textContent=escreveResumo();

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

//cria resumo para usuário sobre sua busca
    //lê cada array dos filtros e busca quais estâo ativados, caso estejam, coloca no array filtroAtivos
        function resumo(){
            let filtrosAtivos=[];

            listaGêneros.forEach((coisa)=>{
                if (coisa.activation==='1'){
                    filtrosAtivos.push(coisa.nome);}
            })

            listaTags.forEach((coisa)=>{
                if (coisa.activation==='1'){
                    filtrosAtivos.push(coisa.nome);}
            })

            listaPlataformas.forEach((coisa)=>{
                if (coisa.activation==='1'){
                    filtrosAtivos.push(coisa.nome);}
            })
            return filtrosAtivos;}
        
    //isso escreve no relatório o número de resultados, o nome da busca e quais filtros estão sendo utilizados
        function escreveResumo(){
            const arrayAtivos= resumo();
            let relatório='';

            if(qtdTotalresul>0){
                if (arrayAtivos.length===0){
                    relatório= `Há ${qtdTotalresul} resultados para a busca ${getName()}`}
        
                if (arrayAtivos.length===1){
                    relatório= `Há ${qtdTotalresul} resultados para a busca ${getName()} com o filtro: ${arrayAtivos}`;}

                if (arrayAtivos.length>1){
                    relatório= `Há ${qtdTotalresul} resultados para a busca ${getName()} com os filtros: ${arrayAtivos.join(', ')}`;}

        } return relatório;}

//cria a animaçao de "carregando ..."
    function loading(){
        let numPontos=0;

        //a cada 500ms, vai ser acresecentado um ponto final no "caregando"
            return setInterval(()=>{
                numPontos= (numPontos+1)%4;
                carregando.textContent='Carregando'+ '.'.repeat(numPontos);
            },500);}

//interface de erro
    function deuRuim(){
        //remove o "carregando ...""
            clearInterval(intervalo);
            carregando.textContent='';

        //cria uma interface user-friendly de q houve um erro
            cardErro=document.createElement("div");
            cardErro.id='cardErro';
            cardErro.textContent='❌ Erro ao pesquisar jogo ❌';
            resultado.replaceChildren;
            resultado.appendChild(cardErro);}

//paginaçâo
    //Cria o card de paginação
        function cardPag(){
            const paginacao=document.getElementById("page");//fazendo referência ao div com id page no html
            paginacao.replaceChildren(); 
        
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

            botaoe.addEventListener("click",()=> {
                if(globalPageNumero>1){
                    globalPageNumero--;}
                    buscar();
                    updatePag();
                })

            botaod.addEventListener("click",()=> {
                if(globalPageNumero<qtdTotalpag){
                    globalPageNumero++;}
                    buscar();
                    updatePag();
                })

                paginacaoCriada=true;}

    //muda no html a contagem da pagina para que o usuario veja em qual pagina ele está
        function updatePag(){
            const valor=document.getElementById('num');
            if(valor){
                valor.textContent=globalPageNumero;}
        }

//filtro
    //funçôes importantes de filtro

        /*essas 3 funções criam um botâo pra cada dado na array de filtros fornecida como container no parâmetro, põe o event 
        listener neles pra ativar os filtros, muda a cor do botão pra indicar que ele está sendo utilizado, e já dá o 
        appendchild para a div fornecida como parent no parâmetro. */
            function appendBotãoFiltro(parent, container){
                parent.replaceChildren();//garante q botôes não sejam duplicados

                container.forEach((item)=>{
                    const botão=document.createElement("button");
                    botão.className='botbot';
                    botão.textContent=item.nome;
                    ativaçãoCorFiltro(container, botão, item);

                    botão.addEventListener('click', ()=>ativaçãoFiltro(container, botão, item));
                
                    parent.appendChild(botão);
                    })
            } 

            function ativaçãoFiltro(container, botão, item){
                //muda o valor de ativaçâo da API e a cor do botão
                    if (item.activation==='0'){
                        item.activation='1';
                        ativaçãoCorFiltro(container,botão, item);}

                    else{
                        item.activation='0'; 
                        ativaçãoCorFiltro(container,botão, item);}

                    updateFiltros(); }

            function ativaçãoCorFiltro(container, botão, item){
                if (item.activation==='0'){
                        botão.style.backgroundColor="rgb(178, 191, 215)";}

                    else{
                        botão.style.backgroundColor="rgb(105, 108, 113)";}
            }
        
        //essa é uma função pra busca na API, que retorna os nomes que vâo ser inseridos no link
            function quaisFiltros(container, tipoFiltro) {
                    let quais=`${tipoFiltro}=`; //isso aq inclui qual categoria de filtro q estamos buscando, tipo "&genre=", "&tags=", "&plataforms"
                    let i=0; //controle de se exitem filtros sendo ativados dentro da categoria
                    let ativos=[]; //array para os nomes dos filtros, tipo "Action", "Multiplayer", "Nintendo Switch"

                    container.forEach((item)=>{ //para cada item ativo, o nome q a API entende vai ser incluido na array "ativos"
                        if (item.activation=='1'){
                            ativos.push(item.APIvalue);
                            i=1;} })

                    quais= quais + ativos.join(',');

                    if(i>0) return quais; 
                    else return '';}

        //limpa todos os filtros já presentes naquela categoria ao por a activation como 0
            function limpaFiltros(container){
                container.forEach((coisa)=>{
                    coisa.activation='0';})}

        //atualiza o usuário de quais filtros estâo selecionados
            let listaTotalFiltros= document.createElement("p");
                listaTotalFiltros.id="listaFiltros";

            function updateFiltros(){
                const listagem=document.getElementById("listagemFiltros")
                if(resumo().length>0){
                    listaTotalFiltros.textContent=`${resumo().join(', ')}`;
                    listagem.replaceChildren();//primeiro tira a antiga lista de filtros
                    listagem.appendChild(listaTotalFiltros);} //põe a nova lista de filtors

                else{
                    listaTotalFiltros.textContent=``;
                    if (listagem.contains(listaTotalFiltros))
                        listagem.removeChild(listaTotalFiltros)}} //remove a lista

    //variáveis já presentes no HTML
        const larguraFiltro=document.getElementById("filtragem");
            const displayFiltros=document.getElementById("botãoFiltro");
            const espaçoFiltro=document.getElementById("lugarDosFiltros");
            const espaçoOpçôes= document.getElementById("lugarDasOpções");

    //variavel que olha se a barra filtros está aberta ou não, no caso, ela começa fechada
        let filtrosCriados=false;

    //cria os 5 botões presentes dentro do filtro: gêneros, tags, disponivel em, aplicar, limpar todos os filtros
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

         const botaoAplicar=document.createElement("button");
         botaoAplicar.id="aplicar";
         botaoAplicar.textContent="Aplicar";

         const botaoLimpar=document.createElement("button");
         botaoLimpar.id="limpar";
         botaoLimpar.textContent="Limpar todos os filtros";
        
    //event listener que verifica se a pessoa clicou no botão do filtro
    //se clicou um número impar de vezes: o menu vai abrir, vai mostrar as opções de filtro, muda a direçâo da flechinha e a lista vai ir pra baixo do botão
    //se clicar um número par de vezes, o menu vai ser fechado, vai ocultar as opções de filtro, muda a direção da flechinha e a lista vai ir pro lado do botão
        displayFiltros.addEventListener('click',()=> {
            filtrosCriados=!filtrosCriados;

            if (filtrosCriados){
                displayFiltros.textContent=`Filtros <`;
                larguraFiltro.style.flexDirection='column';
                displayFiltros.style.marginTop='20px'
                //para garantir q nada seja duplicado
                    espaçoFiltro.replaceChildren();
                    espaçoOpçôes.replaceChildren();
                //cria os novos
                    espaçoFiltro.appendChild(botaoGeneroDiv);
                    espaçoFiltro.appendChild(botaoTagDiv);
                    espaçoFiltro.appendChild(botaoPlataformaDiv);
                    espaçoOpçôes.appendChild(botaoAplicar);
                    espaçoOpçôes.appendChild(botaoLimpar);}

            else{
                displayFiltros.textContent=`Filtros >`
                larguraFiltro.style.flexDirection='row';
                displayFiltros.style.marginTop='0px'
                espaçoFiltro.replaceChildren();
                espaçoOpçôes.replaceChildren();}
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
                {nome: 'Shooter', APIvalue:'shooter', activation: '0'}]
            
        //abre e fecha o menu de opçoes de gênero
            botaoGenero.addEventListener('click', ()=>{
                generosCriados=!generosCriados;

                if (generosCriados){
                    botaoGenero.textContent=`Gêneros <`
                    //pra ter certeza q está vazio e nada seja duplicado
                        lugarDosGêneros.replaceChildren();
                    //agora sim coloca os novos
                        appendBotãoFiltro(lugarDosGêneros, listaGêneros);
                        botaoGeneroDiv.appendChild(lugarDosGêneros); }

                if (!generosCriados){
                    botaoGenero.textContent=`Gêneros >`
                    lugarDosGêneros.replaceChildren();
                    botaoGeneroDiv.removeChild(lugarDosGêneros); }});   

    //filtro de tags
        let tagsCriadas=false; //controle de se as tags estâo abertas ou não

        //espaço para as tags
            const lugarDasTags=document.createElement("div");
            lugarDasTags.id="lugarTags";
        
        //banco de dados das tags
        const listaTags=[
            {nome: 'SinglePlayer', APIvalue:'singleplayer', activation: '0'},
            {nome: 'MultiPlayer', APIvalue:'multiplayer', activation:'0'}]

        //abre e fecha o menu de opçoes de tag
            botaoTag.addEventListener('click',()=>{
                tagsCriadas=!tagsCriadas;

                if (tagsCriadas){
                    botaoTag.textContent=`Tags <`
                    //pra ter certeza q está vazio e não ocorra duplicaçâo
                        lugarDasTags.replaceChildren();
                    //agora sim coloca as coisas novas
                        appendBotãoFiltro(lugarDasTags, listaTags);                
                        botaoTagDiv.appendChild(lugarDasTags); }

                if (!tagsCriadas){
                    botaoTag.textContent=`Tags >`
                    lugarDasTags.replaceChildren();
                    botaoTagDiv.removeChild(lugarDasTags); }
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
                {nome: 'Atari', APIvalue:'28,31,23,22,25,34,46,50', activation: '0'}]
            
            
        //abre e fecha o menu de opçoes de plataformas
            botaoPlataforma.addEventListener('click', ()=>{
                plataformasCriados=!plataformasCriados;

                if (plataformasCriados){
                    botaoPlataforma.textContent=`Disponível para <`
                    //para ter certeza q esteja vazio e nada seja duplicado
                        lugarDasPlataformas.replaceChildren();
                    //agora sim coloca os novos
                        appendBotãoFiltro(lugarDasPlataformas, listaPlataformas)
                        botaoPlataformaDiv.appendChild(lugarDasPlataformas);} 
                

                if (!plataformasCriados){
                    botaoPlataforma.textContent=`Disponível para >`
                    lugarDasPlataformas.replaceChildren();
                    botaoPlataformaDiv.removeChild(lugarDasPlataformas); }
                });
    
    //função de fazer todos os menusu de filtros se fecharem quando a pessoa buscar
        function fechaFiltros(){
            //para o menu principal de filtros
                filtrosCriados=false;
                displayFiltros.textContent=`Filtros >`
                larguraFiltro.style.flexDirection='row';
                displayFiltros.style.marginTop='0px'
                espaçoFiltro.replaceChildren();
                espaçoOpçôes.replaceChildren();

            //para o menu de gêneros
                generosCriados=false;
                botaoGenero.textContent=`Gêneros >`;
                lugarDosGêneros.replaceChildren();
                botaoGeneroDiv.removeChild(lugarDosGêneros);

            //para o menu de tags
                tagsCriadas=false;
                botaoTag.textContent=`Tags >`;
                lugarDasTags.replaceChildren();
                botaoTagDiv.removeChild(lugarDasTags);
            
            //para o menu de plataformas
                plataformasCriados=false;
                botaoPlataforma.textContent=`Disponível para >`;
                lugarDasPlataformas.replaceChildren();
                botaoPlataformaDiv.removeChild(lugarDasPlataformas);

        }

    //quando a pessoa clicar em aplicar, tem que fazer uma busca usando os novos filtros aplicados
        botaoAplicar.addEventListener('click', buscar);

    //quando a pessoa clicar em limpar, tem que remover todos os filtros ativos
        botaoLimpar.addEventListener('click', ()=>{
            const cor=document.querySelectorAll('.botbot');
            cor.forEach((coisa)=>{
                coisa.style.backgroundColor= 'rgb(178, 191, 215)';}
            );       

            limpaFiltros(listaGêneros);
            limpaFiltros(listaTags);
            limpaFiltros(listaPlataformas);
            updateFiltros();
        })
