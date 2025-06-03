
const button = document.getElementById("busca");
let dados;
let nome;
let plataforma;
let id;

button.onclick= async function buscar(){

const expression = document.getElementById("nome").value;
const response= await fetch(`https://api.rawg.io/api/games?key=1175c03391d84eaf9b022713f3c5e618&search=${expression}`)

dados= await response.json();

    dados.results.forEach(result=>{
        nome=result.name;
        console.log (nome);

        id= result.id;
        console.log(id);

        result.platforms.forEach((item)=>{
            if(!item.platform)
                console.log("no games found");
            plataforma= item.platform.name;
            console.log(plataforma);

});
    console.log("---");
});

}

