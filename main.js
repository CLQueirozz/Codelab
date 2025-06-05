//algumas variaveis globais MUITO importantes
    let globalGameData= [];
    let globalPageNumero=1;

//cria cards para os valores encontrados
    function mostrar() {
        const resultado= document.getElementById("resultado");
        resultado.innerHTML="";

        globalGameData.forEach(game =>{

            const card= document.createElement("div");
            card.classList.add("jogo");

            const setae=document.createElement("div");
            const setad=document.createElement("div");
            setae.classList.add("setae");
            setad.classList.add("setad");
            card.appendChild(setae);
            card.appendChild(setad);


            const img= document.createElement("img");
            img.src=game.imagem;
            img.classList.add("imagem-jogo");
            setae.appendChild(img);
        
            const nome = document.createElement("h3");
            nome.textContent=game.nome;
            nome.classList.add("titulo-jogo");
            setad.appendChild(nome);

            const lancamento= document.createElement("p");
            lancamento.textContent= `Lançamento: ${game.lancamento}`;
            lancamento.classList.add("info-jogo");
            setad.appendChild(lancamento);

            const avaliacao=document.createElement("p");
            avaliacao.textContent=`Avaliação: ${game.avaliacao} ⭐`;
            avaliacao.classList.add("info-jogo");
            setad.appendChild(avaliacao);
        
            const plataformas=document.createElement("p");
            plataformas.textContent=`Plataformas: ${game.plataformas}`;
            plataformas.classList.add("info-jogo");
            setad.appendChild(plataformas);

            resultado.appendChild(card);

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


    
//paginação

    //estabele qual é o número da pagina que estamos pesquisando na API
        function setupPag(){
            const next=document.getElementById('next');
            const prev=document.getElementById('prev');

            next.onclick= function(){
                globalPageNumero++;
                buscar();
                updatePag();}
        

            prev.onclick= function(){
                if (globalPageNumero>1){
                    globalPageNumero--;
                    buscar();
                    updatePag();}}
    }

    //dispara a função setupPag assim q a pagina carregar, pq sem ela o link não é gerado
        document.addEventListener('DOMContentLoaded', setupPag())

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

