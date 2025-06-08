//algumas variaveis globais MUITO importantes
    let globalGameData= [];
    let globalPageNumero=1;
    let paginacaoCriada=false;

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
                    globalPageNumero++;
                    buscar();
                    updatePag();
                })

                paginacaoCriada=true;
            }
    })
}

//põe os event listeners do botão e do enter para pesquisar
    const enter= document.getElementById("nome");
    const button = document.getElementById("busca");

    enter.addEventListener('keydown', function(event) {
        if (event.key==='Enter'){
            buscar();
            pag();
        }})

    button.addEventListener('click', buscar);


    //muda no html a contagem da pagina para que o usuario veja em qual pagina ele está
        function updatePag(){
            const valor=document.getElementById('num');
            valor.textContent=globalPageNumero;
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
        const url= `https://api.rawg.io/api/games?key=${key}&search=${search}&page=${page}`
        return url;
    }
    
//busca na api 
    async function buscar(){

        //vai na API
            const response= await fetch(link());
            const dados= await response.json();

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
        
        
                result.platforms.forEach((item)=>{
                    if(item.platform)
                            localGameData.plataformas.push(item.platform.name); });

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
