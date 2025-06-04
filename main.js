
const button = document.getElementById("busca");
let globalGameData= [];
let dados;
let i=0;
let j=0;

function mostrar(){
    globalGameData.forEach(game=>{
        console.log(game.nome);
        console.log(game.id);
        console.log(game.lancamento);
        console.log(game.avaliacao);
        console.log(game.imagem);

        game.plataformas.forEach(plat=>{
            console.log(plat);
        });
    })
}

button.onclick= async function buscar(){

const expression = document.getElementById("nome").value;
const response= await fetch(`https://api.rawg.io/api/games?key=1175c03391d84eaf9b022713f3c5e618&search=${expression}`)

dados= await response.json();

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

    globalGameData.push(localGameData);
    mostrar();

});

}




