let globalGameData= [];
let i=0;
let j=0;

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
//função de busca
    async function buscar(){

        //vai na API
            const expression = document.getElementById("nome").value;
            const response= await fetch(`https://api.rawg.io/api/games?key=1175c03391d84eaf9b022713f3c5e618&search=${expression}`)
            const dados= await response.json();

        //limpa o q estava antes na variavel global
        globalGameData=[]; 

        //separa os diferentes atributos de cada jogo
            dados.results.forEach((result, i)=>{
                const localGameData={
                    nome:result.name,
                    id: result.id,
                    lancamento:result.released,
                    avaliacao: result.rating,
                    imagem: result.background_image,
                    plataformas: [],
                    posicao: i}
        
        
                result.platforms.forEach((item, j)=>{
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


//põe os event listeners do botão e do enter para pesquisar
    const enter= document.getElementById("nome");
    const button = document.getElementById("busca");

    enter.addEventListener('keydown', function(event) {
        if (event.key==='Enter'){
            buscar();
        }})

    button.addEventListener('click', buscar);
