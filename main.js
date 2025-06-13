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
        const search = document.getElementById("nome").value;
        const page = linkPag();
        const key= "1175c03391d84eaf9b022713f3c5e618";
        const url= `https://api.rawg.io/api/games?key=${key}&search=${search}&page=${page}${lêGeneros()}${lêTags()}${lêPlataformas()}`
        
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
            botaoAção.className="botbot";
            botaoAção.textContent="Ação";

            const botaoIndie=document.createElement("button");
            botaoIndie.className="botbot";
            botaoIndie.textContent="Indie";

            const botaoPuzzle=document.createElement("button");
            botaoPuzzle.className="botbot";
            botaoPuzzle.textContent="Puzzle";

            const botaoAdventure=document.createElement("button");
            botaoAdventure.className="botbot";
            botaoAdventure.textContent="Aventura";

            const botaoStrategy=document.createElement("button");
            botaoStrategy.className="botbot";
            botaoStrategy.textContent="Estratégia";

            const botaoShooter=document.createElement("button");
            botaoShooter.className="botbot";
            botaoShooter.textContent="Shooter";

            const botaoSports=document.createElement("button");
            botaoSports.className="botbot";
            botaoSports.textContent="Esportes";

            const botaoRacing=document.createElement("button");
            botaoRacing.className="botbot";
            botaoRacing.textContent="Corrida";

        //abre e fecha o menu de opçoes de gênero
            botaoGenero.addEventListener('click',()=> {
                generosCriados=!generosCriados;

                if (generosCriados){
                    botaoGenero.textContent=`Gêneros <`
                    lugarDosGêneros.appendChild(botaoAção);
                    lugarDosGêneros.appendChild(botaoAdventure);
                    lugarDosGêneros.appendChild(botaoRacing);
                    lugarDosGêneros.appendChild(botaoSports);
                    lugarDosGêneros.appendChild(botaoStrategy);
                    lugarDosGêneros.appendChild(botaoIndie);
                    lugarDosGêneros.appendChild(botaoPuzzle);
                    lugarDosGêneros.appendChild(botaoShooter);


                    botaoGeneroDiv.appendChild(lugarDosGêneros); 
                }

                if (!generosCriados){
                    botaoGenero.textContent=`Gêneros >`
                    lugarDosGêneros.removeChild(botaoAção);
                    lugarDosGêneros.removeChild(botaoAdventure);
                    lugarDosGêneros.removeChild(botaoIndie);
                    lugarDosGêneros.removeChild(botaoPuzzle);
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
            let incluirShooter=false;

        //ativa os gêneros
            botaoAção.addEventListener('click',()=>{
                incluirAction=!incluirAction;
                if(incluirAction){
                    botaoAção.style.backgroundColor="rgb(105, 108, 113)";}
                else{
                     botaoAção.style.backgroundColor="rgb(178, 191, 215)"; }})

            botaoAdventure.addEventListener('click',()=>{
                incluirAdventure=!incluirAdventure;
                if(incluirAdventure){
                    botaoAdventure.style.backgroundColor="rgb(105, 108, 113)";}
                else{
                botaoAdventure.style.backgroundColor="rgb(178, 191, 215)"; }
            })

            botaoRacing.addEventListener('click',()=>{
                incluirRacing=!incluirRacing;
                if(incluirRacing){
                   botaoRacing.style.backgroundColor="rgb(105, 108, 113)";}
             else{
                   botaoRacing.style.backgroundColor="rgb(178, 191, 215)"; }
            })

            botaoSports.addEventListener('click',()=>{
                incluirSports=!incluirSports;
                if(incluirSports){
                    botaoSports.style.backgroundColor="rgb(105, 108, 113)";}
                else{
                   botaoSports.style.backgroundColor="rgb(178, 191, 215)"; }
            })

            botaoStrategy.addEventListener('click',()=>{
               incluirStrategy=!incluirStrategy;
                if(incluirStrategy){
                  botaoStrategy.style.backgroundColor="rgb(105, 108, 113)";}
              else{
                 botaoStrategy.style.backgroundColor="rgb(178, 191, 215)"; }
            })

            botaoIndie.addEventListener('click',()=>{
                incluirIndie=!incluirIndie;
                if(incluirIndie){
                    botaoIndie.style.backgroundColor="rgb(105, 108, 113)";}

                else{
                   botaoIndie.style.backgroundColor="rgb(178, 191, 215)"; }
            })

            botaoPuzzle.addEventListener('click',()=>{
                incluirPuzzle=!incluirPuzzle;
                if(incluirPuzzle){
                    botaoPuzzle.style.backgroundColor="rgb(105, 108, 113)";}
                else{
                   botaoPuzzle.style.backgroundColor="rgb(178, 191, 215)"; }
            })

            botaoShooter.addEventListener('click',()=>{
               incluirShooter=!incluirShooter;
               if(incluirShooter){
                    botaoShooter.style.backgroundColor="rgb(105, 108, 113)";}
                else{
                   botaoShooter.style.backgroundColor="rgb(178, 191, 215)"; }
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

                 if(incluirShooter){
                     if (i==0)
                         generos= generos + "&genres=shooter";
                     else
                         generos= generos + ",shooter";
                     i++;
                }

                return generos; 
            }     

    //filtro de tags
        let tagsCriadas=false;

        const lugarDasTags=document.createElement("div");
        lugarDasTags.id="lugarTags";

        //cria os botões de cada tipo de tag
            const botaoSinglePlayer=document.createElement("button");
            botaoSinglePlayer.className="botbot";
            botaoSinglePlayer.textContent="SinglePlayer";

            const botaoMultiPlayer=document.createElement("button");
            botaoMultiPlayer.className="botbot";
            botaoMultiPlayer.textContent="MultiPlayer";

        //abre e fecha o menu de opçoes de tag
            botaoTag.addEventListener('click',()=> {
                tagsCriadas=!tagsCriadas;

                if (tagsCriadas){
                    botaoTag.textContent=`Tags <`
                    lugarDasTags.appendChild(botaoSinglePlayer);
                    lugarDasTags.appendChild(botaoMultiPlayer);
                
                    botaoTagDiv.appendChild(lugarDasTags); 
                }

                if (!tagsCriadas){
                    botaoTag.textContent=`Tags >`
                    lugarDasTags.removeChild(botaoSinglePlayer);
                    lugarDasTags.removeChild(botaoMultiPlayer);

                    botaoTagDiv.removeChild(lugarDasTags); 
                }
            });

        //variaveis de controle de qual tag está sendo ativado
            let incluirSinglePlayer=false;
            let incluirMultiPlayer=false;
            
        //ativa as tags
            botaoSinglePlayer.addEventListener('click',()=>{
                incluirSinglePlayer=!incluirSinglePlayer;
                if(incluirSinglePlayer){
                    botaoSinglePlayer.style.backgroundColor="rgb(105, 108, 113)";}
                else{
                     botaoSinglePlayer.style.backgroundColor="rgb(178, 191, 215)"; }})

           botaoMultiPlayer.addEventListener('click',()=>{
                incluirMultiPlayer=!incluirMultiPlayer;
                if(incluirMultiPlayer){
                    botaoMultiPlayer.style.backgroundColor="rgb(105, 108, 113)";}
                else{
                     botaoMultiPlayer.style.backgroundColor="rgb(178, 191, 215)"; }})
        
            
        let tags; //string que vai ser inserida na url de pesquisa
        let j; //controle de como a string vai ser formatada

        //essa função constroi a string "tags" que vai ser inserida na url a prtir de quais filtros foram ativados ou não
            function lêTags() {
                tags="";
                j=0;

                if (incluirSinglePlayer){
                    if (j==0)
                        tags= tags + "&tags=singleplayer";
                    else
                        tags= tags + ",singleplayer";
                    j++;
                }

                if (incluirMultiPlayer){
                    if (j==0)
                        tags= tags + "&tags=multiplayer";
                    else
                        tags= tags + ",multiplayer";
                    j++;
                }

                return tags; 
            }
    
    //filtro de plataformas
        let plataformasCriados=false;

        const lugarDasPlataformas=document.createElement("div");
        lugarDasPlataformas.id="lugarPlataformas";

        //cria os botões de cada tipo de plataforma
            const botaoPC=document.createElement("button");
            botaoPC.className="botbot";
            botaoPC.textContent="PC";

            const botaoIOS=document.createElement("button");
            botaoIOS.className="botbot";
            botaoIOS.textContent="iOS";

            const botaoAndroid=document.createElement("button");
            botaoAndroid.className="botbot";
            botaoAndroid.textContent="Android";

            const botaoPlaystation5=document.createElement("button");
            botaoPlaystation5.className="botbot";
            botaoPlaystation5.textContent="PlayStation 5";

            const botaoPlaystation4=document.createElement("button");
            botaoPlaystation4.className="botbot";
            botaoPlaystation4.textContent="PlayStation 4";

            const botaoPlaystation3=document.createElement("button");
            botaoPlaystation3.className="botbot";
            botaoPlaystation3.textContent="PlayStation 3";

            const botaoPlaystation2=document.createElement("button");
            botaoPlaystation2.className="botbot";
            botaoPlaystation2.textContent="PlayStation 2";

            const botaoXboxOne=document.createElement("button");
            botaoXboxOne.className="botbot";
            botaoXboxOne.textContent="Xbox One";

            const botaoXbox360=document.createElement("button");
            botaoXbox360.className="botbot";
            botaoXbox360.textContent="Xbox 360";

            const botaoNintendoSwitch=document.createElement("button");
            botaoNintendoSwitch.className="botbot";
            botaoNintendoSwitch.textContent="Nintendo Switch";

            const botaoNintendo3DS=document.createElement("button");
            botaoNintendo3DS.className="botbot";
            botaoNintendo3DS.textContent="Nintendo 3DS";

            const botaoNintendoDS=document.createElement("button");
            botaoNintendoDS.className="botbot";
            botaoNintendoDS.textContent="Nintendo DS";

            const botaoNintendo64=document.createElement("button");
            botaoNintendo64.className="botbot";
            botaoNintendo64.textContent="Nintendo 64";

            const botaoWii=document.createElement("button");
            botaoWii.className="botbot";
            botaoWii.textContent="Wii/Wii U";

            const botaoAtari=document.createElement("button");
            botaoAtari.className="botbot";
            botaoAtari.textContent="Atari";  

        //abre e fecha o menu de opçoes de plataformas
            botaoPlataforma.addEventListener('click',()=> {
                plataformasCriados=!plataformasCriados;

                if (plataformasCriados){
                    botaoPlataforma.textContent=`Disponível para <`
                    lugarDasPlataformas.appendChild(botaoPC);
                    lugarDasPlataformas.appendChild(botaoAndroid);
                    lugarDasPlataformas.appendChild(botaoIOS);
                    lugarDasPlataformas.appendChild(botaoPlaystation2);
                    lugarDasPlataformas.appendChild(botaoPlaystation3);
                    lugarDasPlataformas.appendChild(botaoPlaystation4);
                    lugarDasPlataformas.appendChild(botaoPlaystation5);
                    lugarDasPlataformas.appendChild(botaoXbox360);
                    lugarDasPlataformas.appendChild(botaoXboxOne);
                    lugarDasPlataformas.appendChild(botaoNintendo64);
                    lugarDasPlataformas.appendChild(botaoNintendoDS);
                    lugarDasPlataformas.appendChild(botaoNintendo3DS);
                    lugarDasPlataformas.appendChild(botaoWii);
                    lugarDasPlataformas.appendChild(botaoNintendoSwitch);
                    lugarDasPlataformas.appendChild(botaoAtari);


                    botaoPlataformaDiv.appendChild(lugarDasPlataformas);} 
                

                if (!plataformasCriados){
                    botaoPlataforma.textContent=`Disponível para >`
                    lugarDasPlataformas.removeChild(botaoPC);
                    lugarDasPlataformas.removeChild(botaoAndroid);
                    lugarDasPlataformas.removeChild(botaoIOS);
                    lugarDasPlataformas.removeChild(botaoPlaystation2);
                    lugarDasPlataformas.removeChild(botaoPlaystation3);
                    lugarDasPlataformas.removeChild(botaoPlaystation4);
                    lugarDasPlataformas.removeChild(botaoPlaystation5);
                    lugarDasPlataformas.removeChild(botaoXbox360);
                    lugarDasPlataformas.removeChild(botaoXboxOne);
                    lugarDasPlataformas.removeChild(botaoNintendo3DS);
                    lugarDasPlataformas.removeChild(botaoNintendoDS);
                    lugarDasPlataformas.removeChild(botaoNintendoSwitch);
                    lugarDasPlataformas.removeChild(botaoNintendo64);
                    lugarDasPlataformas.removeChild(botaoWii);
                    lugarDasPlataformas.appendChild(botaoAtari);


                    botaoPlataformaDiv.removeChild(lugarDasPlataformas); 
                
            }});

        //variaveis de controle de qual plataforma está sendo ativada
            let incluirPC=false;
            let incluirAndroid=false;
            let incluirIOS=false;
            let incluirPlaystation5=false;
            let incluirPlaystation4=false;
            let incluirPlaystation3=false;
            let incluirPlaystation2=false;
            let incluirXbox1=false;
            let incluirXbox360=false;
            let incluirWii=false;
            let incluirNSwitch=false;
            let incluirN3DS=false;
            let incluirNDS=false;
            let incluirN64=false;
            let incluirAtari=false;

        //ativa as platadormas
            botaoPC.addEventListener('click',()=>{
                incluirPC=!incluirPC;
                if(incluirPC){
                    botaoPC.style.backgroundColor="rgb(105, 108, 113)";}
                else{
                     botaoPC.style.backgroundColor="rgb(178, 191, 215)"; }})

            botaoAndroid.addEventListener('click',()=>{
                incluirAndroid=!incluirAndroid;
                if(incluirAndroid){
                    botaoAndroid.style.backgroundColor="rgb(105, 108, 113)";}
                else{
                    botaoAndroid.style.backgroundColor="rgb(178, 191, 215)"; }
            })

            botaoIOS.addEventListener('click',()=>{
                incluirIOS=!incluirIOS;
                if(incluirIOS){
                   botaoIOS.style.backgroundColor="rgb(105, 108, 113)";}
             else{
                   botaoIOS.style.backgroundColor="rgb(178, 191, 215)"; }
            })

            botaoPlaystation2.addEventListener('click',()=>{
                incluirPlaystation2=!incluirPlaystation2;
                if(incluirPlaystation2){
                    botaoPlaystation2.style.backgroundColor="rgb(105, 108, 113)";}
                else{
                   botaoPlaystation2.style.backgroundColor="rgb(178, 191, 215)"; }
            })

            botaoPlaystation3.addEventListener('click',()=>{
                incluirPlaystation3=!incluirPlaystation3;
                if(incluirPlaystation3){
                    botaoPlaystation3.style.backgroundColor="rgb(105, 108, 113)";}
                else{
                   botaoPlaystation3.style.backgroundColor="rgb(178, 191, 215)"; }
            })

            botaoPlaystation4.addEventListener('click',()=>{
                incluirPlaystation4=!incluirPlaystation4;
                if(incluirPlaystation4){
                    botaoPlaystation4.style.backgroundColor="rgb(105, 108, 113)";}
                else{
                   botaoPlaystation4.style.backgroundColor="rgb(178, 191, 215)"; }
            })

            botaoPlaystation5.addEventListener('click',()=>{
                incluirPlaystation5=!incluirPlaystation5;
                if(incluirPlaystation5){
                    botaoPlaystation5.style.backgroundColor="rgb(105, 108, 113)";}
                else{
                   botaoPlaystation5.style.backgroundColor="rgb(178, 191, 215)"; }
            })

            botaoXbox360.addEventListener('click',()=>{
                incluirXbox360=!incluirXbox360;
                if(incluirXbox360){
                    botaoXbox360.style.backgroundColor="rgb(105, 108, 113)";}
                else{
                   botaoXbox360.style.backgroundColor="rgb(178, 191, 215)"; }
            })

            botaoXboxOne.addEventListener('click',()=>{
                incluirXbox1=!incluirXbox1;
                if(incluirXbox1){
                    botaoXboxOne.style.backgroundColor="rgb(105, 108, 113)";}
                else{
                   botaoXboxOne.style.backgroundColor="rgb(178, 191, 215)"; }
            })

            botaoNintendo3DS.addEventListener('click',()=>{
                incluirN3DS=!incluirN3DS;
                if(incluirN3DS){
                    botaoNintendo3DS.style.backgroundColor="rgb(105, 108, 113)";}
                else{
                   botaoNintendo3DS.style.backgroundColor="rgb(178, 191, 215)"; }
            })

            botaoNintendoDS.addEventListener('click',()=>{
                incluirNDS=!incluirNDS;
                if(incluirNDS){
                    botaoNintendoDS.style.backgroundColor="rgb(105, 108, 113)";}
                else{
                   botaoNintendoDS.style.backgroundColor="rgb(178, 191, 215)"; }
            })

            botaoNintendo64.addEventListener('click',()=>{
                incluirN64=!incluirN64;
                if(incluirN64){
                    botaoNintendo64.style.backgroundColor="rgb(105, 108, 113)";}
                else{
                   botaoNintendo64.style.backgroundColor="rgb(178, 191, 215)"; }
            })

            botaoNintendoSwitch.addEventListener('click',()=>{
                incluirNSwitch=!incluirNSwitch;
                if(incluirNSwitch){
                    botaoNintendoSwitch.style.backgroundColor="rgb(105, 108, 113)";}
                else{
                   botaoNintendoSwitch.style.backgroundColor="rgb(178, 191, 215)"; }
            })

            botaoWii.addEventListener('click',()=>{
                incluirWii=!incluirWii;
                if(incluirWii){
                    botaoWii.style.backgroundColor="rgb(105, 108, 113)";}
                else{
                   botaoWii.style.backgroundColor="rgb(178, 191, 215)"; }
            })

            botaoAtari.addEventListener('click',()=>{
                incluirAtari=!incluirAtari;
                if(incluirAtari){
                    botaoAtari.style.backgroundColor="rgb(105, 108, 113)";}
                else{
                   botaoAtari.style.backgroundColor="rgb(178, 191, 215)"; }
            })
        
            
        let plataformas; //string que vai ser inserida na url de pesquisa
        let k; //controle de como a string vai ser formatada

        //essa função constroi a string "platafromas" que vai ser inserida na url a prtir de quais filtros foram ativados ou não
            function lêPlataformas() {
                plataformas="";
                k=0;

                if (incluirPC){
                    if (k==0)
                        plataformas= plataformas + "&platforms=4";
                    else
                        plataformas= plataformas + ",4";
                    k++;
                }

                if (incluirAndroid){
                    if (k==0)
                        plataformas= plataformas + "&platforms=21";
                    else
                        plataformas= plataformas + ",21";
                    k++;
                }

                if (incluirIOS){
                    if (k==0)
                        plataformas= plataformas + "&platforms=3";
                    else
                        plataformas= plataformas + ",3";
                    k++;
                }

                if (incluirPlaystation2){
                    if (k==0)
                        plataformas= plataformas + "&platforms=15";
                    else
                        plataformas= plataformas + ",PlayStation 15";
                    k++;
                }

                if (incluirPlaystation3){
                    if (k==0)
                        plataformas= plataformas + "&platforms=16";
                    else
                        plataformas= plataformas + ",16";
                    k++;
                }

                if (incluirPlaystation4){
                    if (k==0)
                        plataformas= plataformas + "&platforms=18";
                    else
                        plataformas= plataformas + ",18";
                    k++;
                }

                if (incluirPlaystation5){
                    if (k==0)
                        plataformas= plataformas + "&platforms=187";
                    else
                        plataformas= plataformas + ",187";
                    k++;
                }

                if (incluirXbox1){
                    if (k==0)
                        plataformas= plataformas + "&platforms=1";
                    else
                        plataformas= plataformas + ",1";
                    k++;
                }

                if (incluirXbox360){
                    if (k==0)
                        plataformas= plataformas + "&platforms=14";
                    else
                        plataformas= plataformas + ",14";
                    k++;
                }

                if (incluirNSwitch){
                    if (k==0)
                        plataformas= plataformas + "&platforms=7";
                    else
                        plataformas= plataformas + ",7";
                    k++;
                }

                if (incluirN3DS){
                    if (k==0)
                        plataformas= plataformas + "&platforms=8";
                    else
                        plataformas= plataformas + ",8";
                    k++;
                }

                if (incluirNDS){
                    if (k==0)
                        plataformas= plataformas + "&platforms=9";
                    else
                        plataformas= plataformas + ",9";
                    k++;
                }

                if (incluirN64){
                    if (k==0)
                        plataformas= plataformas + "&platforms=83";
                    else
                        plataformas= plataformas + ",83";
                    k++;
                }

                if (incluirWii){
                    if (k==0)
                        plataformas= plataformas + "&platforms=10,11";
                    else
                        plataformas= plataformas + ",10,11";
                    k++;
                }

                if (incluirAtari){
                    if (k==0)
                        plataformas= plataformas + "&platforms=28,31,23,22,25,34,46,50";
                    else
                        plataformas= plataformas + ",28,31,23,22,25,34,46,50";
                    k++;
                }

                return plataformas; 
            }

    //quando a pessoa clicar em aplicar, tem que fazer uma busca usando os novos filtros aplicados
        botaoAplicar.addEventListener('click', buscar);