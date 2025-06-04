
let globalGameData= []; //onde as informações do jogos ficam guardadas
let i=0; //numero do jogo dentro da pagina
let j=0;
let num=1; //para paginação

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

//função de busca
    async function buscar(){

        //vai na API
            const expression = document.getElementById("nome").value;
            const response= await fetch(`https://api.rawg.io/api/games?key=1175c03391d84eaf9b022713f3c5e618&search=${expression}&page=${num}`)
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

    }

//põe os event listeners do botão e do enter para pesquisar
    const enter= document.getElementById("nome");
    const button = document.getElementById("busca");

    enter.addEventListener('keydown', function(event) {
        if (event.key==='Enter'){
            buscar();
        }})

    button.addEventListener('click', buscar);



