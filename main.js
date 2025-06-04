
const button = document.getElementById("busca");
let globalGameData= [];
let dados;
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


button.onclick= async function buscar(){

const expression = document.getElementById("nome").value;
const response= await fetch(`https://api.rawg.io/api/games?key=1175c03391d84eaf9b022713f3c5e618&search=${expression}`)

dados= await response.json();
    globalGameData=[];
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