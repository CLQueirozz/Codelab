//algumas variaveis globais MUITO importantes
    let globalGameData= [];
    let globalPageNumero=1;
    let paginacaoCriada=false;
    let qtdTotalpag=1;
    const carregando= document.getElementById("carregando");


//cria cards para os valores encontrados
    function mostrar() {
        const resultado= document.getElementById("resultado");
        resultado.innerHTML=""; //limpa os resultados anteriores quando fazemos uma nova busca

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
                cardPag;
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
        const search = document.getElementById("nome").value;
        const page = linkPag();
        const key= "1175c03391d84eaf9b022713f3c5e618";
        const url= `https://api.rawg.io/api/games?key=${key}&search=${search}&page=${page}${lêGeneros()}`
        
        console.log(url);
        return url;
    }
    
//busca na api 
    async function buscar(){

        carregando.textContent="Carregando..."

        //vai na API
            const response= await fetch(link());
            const dados= await response.json();

            if(dados){
                carregando.textContent=""}

        
        //quantidade total de resultados
        const qtdTotalresul=dados.count;

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

        mostrar();
        window.scrollTo({ top: 0, behavior: "smooth" });

    }

//teste para ver se a api tá pegando o q a gente quer
    function teste(){
        globalGameData.forEach(game=>{
            console.log(game.nome);
            console.log(game.id);
            console.log(game.lancamento);
            console.log(game.avaliacao);
            console.log(game.imagem);

            game.plataformas.forEach(plat=>{
                console.log(plat);
            });

            console.log("---${game.posicao}---");
    })}

//filtro

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
         botaoPlataforma.textContent="Disponível em >";
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
                displayFiltros.textContent=`Filtros <`
                espaçoFiltro.style.margin="10px";
                espaçoFiltro.appendChild(botaoGeneroDiv);
                espaçoFiltro.appendChild(botaoTagDiv);
                espaçoFiltro.appendChild(botaoPlataformaDiv);
                espaçoFiltro.appendChild(botaoAplicarDiv);
            }

            if (!filtrosCriados){
                displayFiltros.textContent=`Filtros >`
                espaçoFiltro.style.margin="0px";
                espaçoFiltro.removeChild(botaoGeneroDiv);
                espaçoFiltro.removeChild(botaoTagDiv);
                espaçoFiltro.removeChild(botaoPlataformaDiv);
                espaçoFiltro.removeChild(botaoAplicarDiv);
            }
        });

    //filtro de gênero 
        let generosCriados=false;

        const lugarDosGêneros=document.createElement("div");
        lugarDosGêneros.id="lugarGêneros";

        //cria os botões de cada tipo de gênero
            const botaoAção=document.createElement("button");
            botaoAção.id="ação";
            botaoAção.textContent="Ação";

            const botaoIndie=document.createElement("button");
            botaoIndie.id="indie";
            botaoIndie.textContent="Indie";

            const botaoPuzzle=document.createElement("button");
            botaoPuzzle.id="puzzle";
            botaoPuzzle.textContent="Puzzle";

            const botaoAdventure=document.createElement("button");
            botaoAdventure.id="adventure";
            botaoAdventure.textContent="Aventura";

            const botaoRPG=document.createElement("button");
            botaoRPG.id="RPG";
            botaoRPG.textContent="RPG";

            const botaoStrategy=document.createElement("button");
            botaoStrategy.id="strategy";
            botaoStrategy.textContent="Estratégia";

            const botaoShooter=document.createElement("button");
            botaoShooter.id="shooter";
            botaoShooter.textContent="Shooter";

            const botaoSports=document.createElement("button");
            botaoSports.id="sports";
            botaoSports.textContent="Esportes";

            const botaoRacing=document.createElement("button");
            botaoRacing.id="racing";
            botaoRacing.textContent="Corrida";

        //abre e fecha o menu de opçoes de gênero
            botaoGenero.addEventListener('click',()=> {
                generosCriados=!generosCriados;

                if (generosCriados){
                    botaoGenero.textContent=`Gêneros <`
                    botaoGeneroDiv.style.width="90%"
                    lugarDosGêneros.appendChild(botaoAção);
                    lugarDosGêneros.appendChild(botaoAdventure);
                    lugarDosGêneros.appendChild(botaoRacing);
                    lugarDosGêneros.appendChild(botaoSports);
                    lugarDosGêneros.appendChild(botaoStrategy);
                    lugarDosGêneros.appendChild(botaoIndie);
                    lugarDosGêneros.appendChild(botaoPuzzle);
                    lugarDosGêneros.appendChild(botaoRPG);
                    lugarDosGêneros.appendChild(botaoShooter);


                    botaoGeneroDiv.appendChild(lugarDosGêneros); 
                }

                if (!generosCriados){
                    botaoGenero.textContent=`Gêneros >`
                    botaoGeneroDiv.style.width="fit-content"
                    lugarDosGêneros.removeChild(botaoAção);
                    lugarDosGêneros.removeChild(botaoAdventure);
                    lugarDosGêneros.removeChild(botaoIndie);
                    lugarDosGêneros.removeChild(botaoPuzzle);
                    lugarDosGêneros.removeChild(botaoRPG);
                    lugarDosGêneros.removeChild(botaoRacing);
                    lugarDosGêneros.removeChild(botaoSports);
                    lugarDosGêneros.removeChild(botaoShooter);
                    lugarDosGêneros.removeChild(botaoStrategy);

                    botaoGeneroDiv.removeChild(lugarDosGêneros); 
                }
            });

        //variaveis de controle de qual gênero está sendo ativado
            let incluirAction=false;
            let incluirAdventure=false;
            let incluirRacing=false;
            let incluirSports=false;
            let incluirStrategy=false;
            let incluirIndie=false;
            let incluirPuzzle=false;
            let incluirRPG=false;
            let incluirShooter=false;

        //ativa os gêneros
            botaoAção.addEventListener('click',()=>{
                incluirAction=!incluirAction;
                if(incluirAction){
                    botaoAção.style.backgroundColor="rgb(105, 108, 113)";}
                else{
                     botaoAção.style.backgroundColor="rgb(219, 222, 227)"; }})

            botaoAdventure.addEventListener('click',()=>{
                incluirAdventure=!incluirAdventure;
                if(incluirAdventure){
                    botaoAdventure.style.backgroundColor="rgb(105, 108, 113)";}
                else{
                botaoAdventure.style.backgroundColor="rgb(219, 222, 227)"; }
            })

            botaoRacing.addEventListener('click',()=>{
                incluirRacing=!incluirRacing;
                if(incluirRacing){
                   botaoRacing.style.backgroundColor="rgb(105, 108, 113)";}
             else{
                   botaoRacing.style.backgroundColor="rgb(219, 222, 227)"; }
            })

            botaoSports.addEventListener('click',()=>{
                incluirSports=!incluirSports;
                if(incluirSports){
                    botaoSports.style.backgroundColor="rgb(105, 108, 113)";}
                else{
                   botaoSports.style.backgroundColor="rgb(219, 222, 227)"; }
            })

            botaoStrategy.addEventListener('click',()=>{
               incluirStrategy=!incluirStrategy;
                if(incluirStrategy){
                  botaoStrategy.style.backgroundColor="rgb(105, 108, 113)";}
              else{
                 botaoStrategy.style.backgroundColor="rgb(219, 222, 227)"; }
            })

            botaoIndie.addEventListener('click',()=>{
                incluirIndie=!incluirIndie;
                if(incluirIndie){
                    botaoIndie.style.backgroundColor="rgb(105, 108, 113)";}

                else{
                   botaoIndie.style.backgroundColor="rgb(219, 222, 227)"; }
            })

            botaoPuzzle.addEventListener('click',()=>{
                incluirPuzzle=!incluirPuzzle;
                if(incluirPuzzle){
                    botaoPuzzle.style.backgroundColor="rgb(105, 108, 113)";}
                else{
                   botaoPuzzle.style.backgroundColor="rgb(219, 222, 227)"; }
            })

            botaoRPG.addEventListener('click',()=>{
                incluirRPG=!incluirRPG;
                if(incluirRPG){
                    botaoRPG.style.backgroundColor="rgb(105, 108, 113)";}
                else{
                   botaoRPG.style.backgroundColor="rgb(219, 222, 227)"; }
            })

            botaoShooter.addEventListener('click',()=>{
               incluirShooter=!incluirShooter;
               if(incluirShooter){
                    botaoShooter.style.backgroundColor="rgb(105, 108, 113)";}
                else{
                   botaoShooter.style.backgroundColor="rgb(219, 222, 227)"; }
            })
        
            
        let generos; //string que vai ser inserida na url de pesquisa
        let i; //controle de como a string vai ser formatada

        //essa função constroi a string "generos" que vai ser inserida na url a prtir de quais filtros foram ativados ou não
            function lêGeneros() {
                generos="";
                i=0;

                if (incluirAction){
                    if (i==0)
                        generos= generos + "&genres=action";
                    else
                        generos= generos + ",action";
                    i++;
                }

                if (incluirAdventure){
                    if (i==0)
                        generos= generos + "&genres=adventure";
                    else
                        generos= generos + ",adventure";
                 i++;
                }

                if (incluirRacing){
                    if (i==0)
                        generos= generos + "&genres=racing";
                    else
                        generos= generos + ",racing";
                    i++;
                }

                if (incluirSports){
                    if (i==0)
                        generos= generos + "&genres=sports";
                    else
                       generos= generos + ",sports";
                   i++;
                }

                 if(incluirStrategy){
                    if (i==0)
                         generos= generos + "&genres=strategy";
                     else
                         generos= generos + ",strategy";
                 i++;
                 }

                 if(incluirIndie){
                     if (i==0)
                         generos= generos + "&genres=indie";
                     else
                         generos= generos + ",indie";
                     i++;
                }  

                if(incluirPuzzle){
                    if (i==0)
                            generos= generos + "&genres=puzzle";
                        else
                            generos= generos + ",puzzle";
                        i++;
                }

                if(incluirRPG){
                    if (i==0)
                        generos= generos + "&genres=RPG";
                    else
                        generos= generos + ",RPG";
                    i++;
                }

                 if(incluirShooter){
                     if (i==0)
                         generos= generos + "&genres=shooter";
                     else
                         generos= generos + ",shooter";
                     i++;
                }

                return generos; 
            }     

    //quando a pessoa clicar em aplicar, tem que fazer uma busca usando os novos filtros aplicados
        botaoAplicar.addEventListener('click', buscar);
